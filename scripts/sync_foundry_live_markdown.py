#!/usr/bin/env python3
"""Sync live Foundry world actors into vault notes as ```statblock fences.

Reads actors from the world LevelDB via foundry-read-actor.mjs, converts with
foundry_statblock.py, and updates a `## Live sheet (Foundry)` section on notes
that declare `foundry_actor_id` in frontmatter.

Run after sessions (or when prep needs current HP/items):

    python scripts/sync_foundry_live_markdown.py

Single note (reads `foundry_actor_id` from frontmatter):

    python scripts/sync_foundry_live_markdown.py --note-only "World/Factions/Marines/Commander Leon.md"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from foundry_statblock import foundry_to_statblock

VAULT = Path(__file__).resolve().parents[1]
READ_SCRIPT = (
    VAULT
    / ".obsidian/plugins/blood-brine-foundry-statblock/foundry-read-actor.mjs"
)
DEFAULT_DB = Path(
    os.environ.get(
        "FOUNDRY_ACTORS_DB",
        r"D:\foundry-pi\Foundry\foundrydata\Data\worlds\blood-and-brine\data\actors",
    )
)

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
ACTOR_ID_FM_RE = re.compile(r'^foundry_actor_id:\s*["\']?([^"\']+)["\']?\s*$', re.MULTILINE)
LIVE_SECTION_RE = re.compile(
    r"\n## Live sheet \(Foundry\)\n.*?(?=\n## |\Z)",
    re.DOTALL,
)
FOUNDRY_LIVE_FENCE_RE = re.compile(
    r"\n```foundry-live\n.*?\n```\n?",
    re.DOTALL,
)
PLUGIN_BLURB_RE = re.compile(
    r"\nLive stats also auto-render.*?(?=\n## |\n# |\Z)",
    re.DOTALL,
)
MM_PLUGIN_INTRO_RE = re.compile(
    r"\nFoundry actor linked for campaign monster manual\. "
    r"Live stats render via the \*\*Blood & Brine Foundry Statblock\*\* plugin "
    r"\(`foundry_actor_id`\)\.\n",
    re.MULTILINE,
)

def build_live_section(actor_id: str, data: dict) -> str:
    synced = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    return (
        "\n## Live sheet (Foundry)\n\n"
        f"*Last synced: {synced}*\n\n"
        f"{foundry_to_statblock(data)}\n"
    )


def read_actor(db: Path, actor_id: str) -> dict:
    proc = subprocess.run(
        ["node", str(READ_SCRIPT), "--db", str(db), "--id", actor_id],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=False,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout or "read failed").strip()
        raise RuntimeError(f"{actor_id}: {detail}")
    return json.loads(proc.stdout)


def extract_actor_id(text: str) -> str | None:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    fm = ACTOR_ID_FM_RE.search(m.group(0))
    return fm.group(1).strip() if fm else None


def iter_linked_notes() -> list[tuple[Path, str]]:
    out: list[tuple[Path, str]] = []
    for base in (
        VAULT / "World",
        VAULT / "Rules" / "Stat blocks",
        VAULT / "Monster Manual",
        VAULT / "Characters",
        VAULT / "Party NPC's",
    ):
        if not base.is_dir():
            continue
        for path in base.rglob("*.md"):
            if path.name.startswith("_"):
                continue
            text = path.read_text(encoding="utf-8")
            actor_id = extract_actor_id(text)
            if actor_id:
                out.append((path, actor_id))
    return out


def update_note(path: Path, actor_id: str, data: dict) -> bool:
    text = path.read_text(encoding="utf-8")
    section = build_live_section(actor_id, data)

    body = LIVE_SECTION_RE.sub("\n", text)
    body = FOUNDRY_LIVE_FENCE_RE.sub("\n", body)
    body = PLUGIN_BLURB_RE.sub("\n", body)
    body = MM_PLUGIN_INTRO_RE.sub("\n", body)
    body = body.rstrip() + section

    if body == text:
        return False
    path.write_text(body, encoding="utf-8")
    return True


def sync_one(db: Path, path: Path, actor_id: str) -> None:
    data = read_actor(db, actor_id)
    if update_note(path, actor_id, data):
        print(f"  UPDATED {path.relative_to(VAULT)}", flush=True)
    else:
        print(f"  unchanged {path.relative_to(VAULT)}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Embed live Foundry statblocks into vault notes (Fantasy Statblocks fences)."
    )
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help="Foundry actors LevelDB path")
    parser.add_argument("--id", dest="actor_id", help="Sync one Foundry actor id only")
    parser.add_argument(
        "--note",
        type=Path,
        help="Vault note path (with --id); default: first note with that foundry_actor_id",
    )
    parser.add_argument(
        "--note-only",
        type=Path,
        dest="note_only",
        help="Sync one note; reads foundry_actor_id from its frontmatter",
    )
    parser.add_argument(
        "--watch",
        type=int,
        metavar="SECONDS",
        help="Re-run sync loop every N seconds (Ctrl+C to stop)",
    )
    args = parser.parse_args()

    if not READ_SCRIPT.is_file():
        print(f"error: missing {READ_SCRIPT}", flush=True)
        return 1
    if not args.db.is_dir():
        print(f"error: actors DB not found: {args.db}", flush=True)
        return 1

    def run_once() -> int:
        if args.note_only:
            note_path = args.note_only if args.note_only.is_absolute() else VAULT / args.note_only
            if not note_path.is_file():
                print(f"error: note not found: {note_path}", flush=True)
                return 1
            text = note_path.read_text(encoding="utf-8")
            actor_id = extract_actor_id(text)
            if not actor_id:
                rel = note_path.relative_to(VAULT)
                print(f"error: no foundry_actor_id in {rel}", flush=True)
                return 1
            try:
                sync_one(args.db, note_path, actor_id)
            except (RuntimeError, json.JSONDecodeError) as exc:
                print(f"  ERROR {note_path.relative_to(VAULT)}: {exc}", flush=True)
                return 1
            return 0

        if args.actor_id:
            if args.note:
                note_path = args.note if args.note.is_absolute() else VAULT / args.note
            else:
                matches = [
                    p for p, aid in iter_linked_notes() if aid == args.actor_id
                ]
                if not matches:
                    print(f"error: no note with foundry_actor_id {args.actor_id}", flush=True)
                    return 1
                note_path = matches[0]
            try:
                sync_one(args.db, note_path, args.actor_id)
            except (RuntimeError, json.JSONDecodeError) as exc:
                print(f"  ERROR {note_path.relative_to(VAULT)}: {exc}", flush=True)
                return 1
            return 0

        linked = iter_linked_notes()
        if not linked:
            print("No notes with foundry_actor_id in frontmatter.", flush=True)
            return 0

        updated = errors = 0
        for path, actor_id in sorted(linked, key=lambda x: str(x[0])):
            try:
                if update_note(path, actor_id, read_actor(args.db, actor_id)):
                    updated += 1
                    print(f"  UPDATED {path.relative_to(VAULT)}", flush=True)
            except (RuntimeError, json.JSONDecodeError) as exc:
                errors += 1
                print(f"  ERROR {path.relative_to(VAULT)}: {exc}", flush=True)

        print(
            f"Done: {updated} updated, {len(linked) - updated - errors} unchanged, "
            f"{errors} errors.",
            flush=True,
        )
        return 1 if errors else 0

    if args.watch:
        print(f"Watching every {args.watch}s — Ctrl+C to stop.", flush=True)
        try:
            while True:
                run_once()
                time.sleep(args.watch)
        except KeyboardInterrupt:
            print("Stopped.", flush=True)
        return 0

    return run_once()


if __name__ == "__main__":
    raise SystemExit(main())
