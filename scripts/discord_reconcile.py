#!/usr/bin/env python3
"""Write Discord/reconcile.md: messages new since a git revision, matched to vault notes.

Read-only for notes — never edits the vault. Run after discord_export.py, before committing:

    python discord_reconcile.py             # new vs last commit (HEAD)
    python discord_reconcile.py --since HEAD~1
"""

import argparse
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
EXPORTS = VAULT / "Discord" / "exports"
REPORT = VAULT / "Discord" / "reconcile.md"
NOTE_DIRS = ("World", "Devil Fruits", "Monster Manual", "Timeline", "Sessions")
URL_RE = re.compile(r"\]\((https://cdn\.discordapp\.com/[^)]*)\)")


def blocks(text: str) -> list[str]:
    return [b.strip() for b in re.split(r"\n---\n(?=### )", text) if b.strip().startswith("### ")]


def old_export(path: Path, since: str) -> str:
    rel = path.relative_to(VAULT).as_posix()
    result = subprocess.run(["git", "show", f"{since}:{rel}"], cwd=VAULT, capture_output=True)
    return result.stdout.decode("utf-8") if result.returncode == 0 else ""


def new_blocks(path: Path, since: str) -> list[str]:
    # Headers (timestamp + author) identify messages; count them so same-minute posts diff correctly.
    seen = Counter(b.split("\n")[0] for b in blocks(old_export(path, since)))
    fresh = []
    for block in blocks(path.read_text(encoding="utf-8")):
        header = block.split("\n")[0]
        if seen[header]:
            seen[header] -= 1
        else:
            fresh.append(block)
    return fresh


def candidate_names(block: str) -> list[str]:
    names = []
    for line in block.splitlines()[1:]:
        if "|" in line:  # character-art style: "Name | role | Status"
            names.append(line.split("|")[0])
        elif line.startswith("- [") and "](" in line:  # attachment filename stem
            names.append(Path(line[3 : line.index("](")]).stem)
    cleaned = []
    for name in names:
        name = re.sub(r"\|\|.*?\|\||SPOILER_|-token|[^\w\s'-]", " ", name).replace("_", " ")
        name = " ".join(name.split())
        if len(name) >= 3 and not name.startswith("exec") and "?" not in name:
            cleaned.append(name)
    return list({n.lower(): n for n in reversed(cleaned)}.values())[::-1]


def find_notes(name: str, notes: list[Path]) -> list[Path]:
    words = [w.lower() for w in name.split() if len(w) >= 4]
    if not words:
        return []
    both = [n for n in notes if all(w in n.stem.lower() for w in words[:2])]
    return (both or [n for n in notes if n.stem.lower().startswith(words[0])])[:3]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--since", default="HEAD", help="git revision to diff exports against")
    args = parser.parse_args()

    notes = [p for d in NOTE_DIRS for p in (VAULT / d).rglob("*.md")]
    out = [
        "---",
        "publish: false",
        f"generated: {datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC",
        f"since: {args.since}",
        "---",
        "",
        "# Discord reconcile",
        "",
        "New Discord messages since the last export commit. Nothing here has been applied to the vault —",
        "review each item and update the matched note (or create one) by hand.",
    ]
    total = 0
    for export in sorted(EXPORTS.glob("*.md")):
        fresh = new_blocks(export, args.since)
        if not fresh:
            continue
        total += len(fresh)
        out += ["", f"## {export.stem} ({len(fresh)} new)", ""]
        for block in fresh:
            block = URL_RE.sub(lambda m: "](" + m.group(1).split("?")[0] + ")", block)
            out += ["- [ ] " + block.split("\n")[0].lstrip("# "), ""]
            out += ["  " + line if line else "" for line in block.splitlines()[1:]]
            for name in candidate_names(block):
                matches = find_notes(name, notes)
                links = ", ".join(f"[[{m.relative_to(VAULT).with_suffix('').as_posix()}]]" for m in matches)
                out.append(f"  - **{name}** → {links or '_no note found_'}")
            out.append("")
    if not total:
        out += ["", "_No new messages._"]
    REPORT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"{total} new message(s) -> {REPORT.relative_to(VAULT)}")


if __name__ == "__main__":
    main()
