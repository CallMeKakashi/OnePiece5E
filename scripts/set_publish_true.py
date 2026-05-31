#!/usr/bin/env python3
"""Set publish: true on all markdown in GitHub Pages sync directories."""

from __future__ import annotations

import re
import sys
from pathlib import Path

VAULT = Path(__file__).resolve().parents[1]
SYNC_DIRS = (
    "Attachments",
    "Journals",
    "Rules",
    "Sessions",
    "Sourcebook",
    "Timeline",
    "Transcripts",
    "World",
)
SYNC_FILES = ("Home.md",)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)
PUBLISH_LINE_RE = re.compile(r"^publish:\s*(true|false)\s*$", re.MULTILINE)


def set_publish(text: str) -> tuple[str, bool]:
    if FRONTMATTER_RE.match(text):
        fm_match = FRONTMATTER_RE.match(text)
        assert fm_match
        fm = fm_match.group(1)
        rest = text[fm_match.end() :]
        if PUBLISH_LINE_RE.search(fm):
            new_fm = PUBLISH_LINE_RE.sub("publish: true", fm)
        else:
            new_fm = "publish: true\n" + fm
        new_text = f"---\n{new_fm}\n---{rest}"
        return new_text, new_text != text
    new_text = "---\npublish: true\n---\n\n" + text
    return new_text, True


def iter_targets() -> list[Path]:
    paths: list[Path] = []
    for name in SYNC_FILES:
        p = VAULT / name
        if p.is_file():
            paths.append(p)
    for directory in SYNC_DIRS:
        root = VAULT / directory
        if not root.is_dir():
            continue
        paths.extend(sorted(root.rglob("*.md")))
    return paths


def main() -> int:
    changed = 0
    for path in iter_targets():
        text = path.read_text(encoding="utf-8")
        new_text, did = set_publish(text)
        if did:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
    print(f"Updated {changed} markdown files with publish: true")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
