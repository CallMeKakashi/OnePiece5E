#!/usr/bin/env python3
"""Sync workshop JSON (foundry-json) into vault — templates only, not live world sheets."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from foundry_statblock import foundry_to_statblock, load_actor

VAULT = Path(__file__).resolve().parents[1]
FOUNDRY_TEMPLATES = VAULT / "Foundry" / "actors-json"

# Workshop JSON stem -> vault note (relative to vault)
ACTOR_MAP: dict[str, str] = {
    "sample-actor": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
    "leon": "World/Factions/Marines/Commander Leon.md",
    "vorro": "World/Factions/Marines/Calder Voss.md",
    "mira": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "tray": "World/Factions/Blackhand/Tray.md",
    "goru": "World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md",
    "rythm": "World/Factions/Soundless 5/Rhythm Echo.md",
    "rythm - Mutated": "World/Factions/Soundless 5/Rhythm Echo.md",
    "alice": "World/Factions/Blackhand/Alice.md",
    "thompson": "World/Factions/Blackhand/Braveheart Pirates/Thompson Caneheart.md",
    "julee": "World/Factions/Blackhand/Braveheart Pirates/Ju Lee Caneheart.md",
    "treble": "World/Factions/Decibella Revolutionary/Cadence.md",
    "treble-anthem": "World/Factions/Soundless 5/Lady Soefra Anthem.md",
    "drez": "World/Factions/Marines/Delaroth.md",
    "linn": "World/Factions/Sixfold/Liz.md",
    "bartho": "World/Factions/Blackhand/Blackhand Cane.md",
    "crunch": "World/Factions/Unaffiliated/DevilMask.md",
    "mikey": "World/Factions/Spider Nest Pirates/Ben.md",
    "morrow": "World/Factions/Unaffiliated/DevilMask.md",
    "sharkfin-pirate": "Rules/Stat blocks/Sharkfin Pirate.md",
    "marine-ensign": "Rules/Stat blocks/Marine Ensign.md",
    "petty-marine": "Rules/Stat blocks/Petty Marine.md",
    "Cassian_Valehart": "Rules/Stat blocks/Cassian Valehart.md",
    "Cecilia Moore": "Rules/Stat blocks/Cecilia Moore.md",
    "Kael Dhamar": "Rules/Stat blocks/Kael Dhamar.md",
    "kaen-solaris": "Rules/Stat blocks/Kaen Solaris.md",
    "rashid-alsafar": "Rules/Stat blocks/Rashid Al-Safar.md",
}

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
FOUNDRY_SECTION_RE = re.compile(
    r"\n## (?:Table play \(Foundry\)|Build template \(Foundry\))\n.*?(?=\n## |\Z)",
    re.DOTALL,
)

TEMPLATE_DISCLAIMER = (
    "> **Build template only** — not the live Foundry sheet. "
    "Running stats live in the Pi world `blood-and-brine` → `data/actors/`.\n\n"
)


def is_npc_kit_note(target_rel: str) -> bool:
    return target_rel.replace("\\", "/").startswith("Rules/Stat blocks/")


def rel_template_path(json_path: Path) -> str:
    rel = json_path.relative_to(FOUNDRY_TEMPLATES)
    return ("Foundry/actors-json/" + str(rel)).replace("\\", "/")


def build_section(foundry_rel: str, data: dict, *, embed_statblock: bool) -> str:
    header = "\n## Build template (Foundry)\n\n" + TEMPLATE_DISCLAIMER
    if embed_statblock:
        return (
            header
            + f"Workshop file: `[[{foundry_rel}]]`. "
            + "Regenerate: `python scripts/sync_foundry_statblocks.py`.\n\n"
            + f"{foundry_to_statblock(data)}\n"
        )
    return header + f"Workshop JSON (import/build): `[[{foundry_rel}]]`.\n"


def _inject_template_fm(fm: str, foundry_rel: str) -> str:
    fm = re.sub(r"^foundry_json:.*\n", "", fm, flags=re.MULTILINE)
    if "foundry_template_json:" in fm:
        return re.sub(
            r"^foundry_template_json:.*$",
            f'foundry_template_json: "{foundry_rel}"',
            fm,
            flags=re.MULTILINE,
        )
    return fm.rstrip()[:-3] + f'foundry_template_json: "{foundry_rel}"\n---\n'


def ensure_kit_note(path: Path, data: dict, foundry_rel: str) -> None:
    name = data.get("name", path.stem)
    path.parent.mkdir(parents=True, exist_ok=True)
    body = f"""---
type: actor
faction: "[[Unaffiliated]]"
status: draft
publish: true
foundry_template_json: "{foundry_rel}"
---

# {name}

NPC kit from workshop `foundry-json`. Not the live world actor.

{build_section(foundry_rel, data, embed_statblock=True).lstrip()}
"""
    path.write_text(body, encoding="utf-8")
    print(f"  CREATED {path.relative_to(VAULT)}", flush=True)


def update_note(path: Path, data: dict, foundry_rel: str, *, include_actors: bool) -> None:
    embed = is_npc_kit_note(str(path.relative_to(VAULT)).replace("\\", "/"))
    if not embed and not include_actors:
        return

    text = path.read_text(encoding="utf-8")
    section = build_section(foundry_rel, data, embed_statblock=embed)

    match = FRONTMATTER_RE.match(text)
    if match:
        fm = _inject_template_fm(match.group(0), foundry_rel)
        body = FOUNDRY_SECTION_RE.sub("\n", text[match.end() :])
    else:
        fm = f'---\nfoundry_template_json: "{foundry_rel}"\n---\n\n'
        body = FOUNDRY_SECTION_RE.sub("\n", text)

    path.write_text(fm + body.rstrip() + section, encoding="utf-8")
    print(f"  UPDATED {path.relative_to(VAULT)}", flush=True)


def iter_json_files() -> list[Path]:
    if not FOUNDRY_TEMPLATES.is_dir():
        return []
    return sorted(
        p
        for p in FOUNDRY_TEMPLATES.rglob("*.json")
        if not p.name.startswith(".")
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync workshop foundry-json templates into vault (not live world actors)."
    )
    parser.add_argument(
        "--include-actors",
        action="store_true",
        help="Also refresh World/Factions actor notes (link-only, strips embedded template stat blocks).",
    )
    args = parser.parse_args()

    if not FOUNDRY_TEMPLATES.is_dir():
        print(f"error: missing junction {FOUNDRY_TEMPLATES}", flush=True)
        return 1

    mapped = 0
    created = 0
    skipped = 0
    for json_path in iter_json_files():
        stem = json_path.stem
        rel = rel_template_path(json_path)
        try:
            data = load_actor(json_path)
        except (json.JSONDecodeError, OSError) as exc:
            print(f"  SKIP {json_path.name}: {exc}", flush=True)
            continue

        target_rel = ACTOR_MAP.get(stem)
        if not target_rel:
            name = data.get("name", stem).lower()
            for note in VAULT.glob("World/Factions/**/*.md"):
                if note.stem.lower() in name or name in note.stem.lower():
                    target_rel = str(note.relative_to(VAULT)).replace("\\", "/")
                    break

        if not target_rel:
            safe = re.sub(r'[<>:"/\\|?*]', "-", data.get("name", stem))
            target_rel = f"Rules/Stat blocks/Foundry - {safe}.md"

        note_path = VAULT / target_rel
        if not note_path.exists():
            if is_npc_kit_note(target_rel):
                ensure_kit_note(note_path, data, rel)
                created += 1
            continue

        if not is_npc_kit_note(target_rel) and not args.include_actors:
            skipped += 1
            continue

        update_note(note_path, data, rel, include_actors=args.include_actors)
        mapped += 1

    print(
        f"Done: {mapped} updated, {created} created, {skipped} actor skips "
        f"(use --include-actors to refresh faction pages).",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
