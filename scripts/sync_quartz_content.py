#!/usr/bin/env python3
"""Copy publishable vault content from planning into v4/content/.

Obsidian Dataview blocks are expanded to static Markdown during sync so Quartz
(GitHub Pages) can render lists and tables without an Obsidian runtime.
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

SYNC_DIRS = (
    "Attachments",
    "Journals",
    "Monster Manual",
    "Rules",
    "Sessions",
    "Sourcebook",
    "Timeline",
    "Transcripts",
    "World",
)
SYNC_FILES = ("_index.md", "World-Map.png")

# Obsidian uses _index.md for folder MOCs; Quartz expects index.md (see quartz/util/fileTrie.ts).
INDEX_BASENAME = "_index.md"
QUARTZ_INDEX_BASENAME = "index.md"

PUBLISH_RE = re.compile(r"^publish:\s*true\s*$", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)
DATAVIEW_BLOCK_RE = re.compile(r"```dataview\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)
FROM_PATHS_RE = re.compile(r'"([^"]+)"')
WIKILINK_DISCORD_RE = re.compile(r"\[\[[^\]]*Discord/[^\]]*\]\]", re.IGNORECASE)
AGENTS_LINE_RE = re.compile(
    r"^Agents:.*\n(?:\n)?", re.MULTILINE | re.IGNORECASE
)
DISCORD_EDITOR_LINE_RE = re.compile(
    r"^.*\bDiscord quarry\b.*\n"
    r"|^.*\bpending re-download\b.*Discord.*\n"
    r"|^.*\bsynced from \[\[Discord/.*\n",
    re.MULTILINE | re.IGNORECASE,
)
PUBLIC_SECTIONS_DROP = frozenset({"discord", "maintenance"})


@dataclass(frozen=True)
class VaultNote:
    path: Path
    rel_path: str  # without .md, forward slashes
    folder: str
    name: str  # stem
    frontmatter: dict[str, object]
    publish: bool


def has_publish_true(path: Path) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"warning: could not read {path}: {exc}", file=sys.stderr)
        return False

    if not text.startswith("---"):
        return False

    match = FRONTMATTER_RE.match(text)
    if not match:
        return False

    return bool(PUBLISH_RE.search(match.group(1)))


def should_copy(path: Path) -> bool:
    if path.suffix.lower() == ".md":
        return has_publish_true(path)
    return True


def parse_simple_frontmatter(text: str) -> dict[str, object]:
    if not text.startswith("---"):
        return {}

    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}

    fm: dict[str, object] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, raw = line.partition(":")
        key = key.strip()
        value = raw.strip()
        if not key:
            continue
        if value.startswith('"') and value.endswith('"'):
            fm[key] = value[1:-1]
        elif value.startswith("'") and value.endswith("'"):
            fm[key] = value[1:-1]
        elif value in ("true", "false"):
            fm[key] = value == "true"
        else:
            fm[key] = value
    return fm


def fm_scalar(frontmatter: dict[str, object], key: str) -> str | None:
    value = frontmatter.get(key)
    if value is None:
        return None
    if isinstance(value, list):
        return str(value[0]) if value else None
    return str(value)


def build_vault_index(planning_root: Path) -> list[VaultNote]:
    notes: list[VaultNote] = []
    for path in planning_root.rglob("*.md"):
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue

        rel = path.relative_to(planning_root).as_posix()
        if rel.endswith(".md"):
            rel = rel[:-3]
        folder = rel.rsplit("/", 1)[0] if "/" in rel else ""
        frontmatter = parse_simple_frontmatter(text)
        notes.append(
            VaultNote(
                path=path,
                rel_path=rel,
                folder=folder,
                name=path.stem,
                frontmatter=frontmatter,
                publish=has_publish_true(path),
            )
        )
    return notes


def parse_dataview_block(body: str) -> dict[str, str]:
    lines = [line.strip() for line in body.strip().splitlines() if line.strip()]
    parsed: dict[str, str] = {}
    for line in lines:
        upper = line.upper()
        if upper.startswith("LIST") or upper.startswith("TABLE"):
            parsed["kind"] = "TABLE" if upper.startswith("TABLE") else "LIST"
            if parsed["kind"] == "TABLE":
                columns = line[5:].strip()
                parsed["columns"] = columns
        elif upper.startswith("FROM"):
            parsed["from"] = line[4:].strip()
        elif upper.startswith("WHERE"):
            parsed["where"] = line[5:].strip()
        elif upper.startswith("SORT"):
            parsed["sort"] = line[4:].strip()
    return parsed


def from_paths(from_clause: str) -> list[str]:
    return FROM_PATHS_RE.findall(from_clause)


def note_in_from_paths(note: VaultNote, paths: list[str]) -> bool:
    for path in paths:
        if note.folder == path or note.folder.startswith(path + "/"):
            return True
        if note.rel_path == path:
            return True
    return False


def passes_where(note: VaultNote, where: str | None) -> bool:
    if not where:
        return True

    folder_match = re.fullmatch(r'file\.folder\s*=\s*"([^"]+)"', where)
    if folder_match:
        return note.folder == folder_match.group(1)

    type_match = re.fullmatch(r'type\s*=\s*"([^"]+)"', where)
    if type_match:
        return fm_scalar(note.frontmatter, "type") == type_match.group(1)

    name_ne_match = re.fullmatch(r'file\.name\s*!=\s*"([^"]+)"', where)
    if name_ne_match:
        return note.name != name_ne_match.group(1)

    publish_match = re.fullmatch(r"publish\s*=\s*(true|false)", where, re.IGNORECASE)
    if publish_match:
        want = publish_match.group(1).lower() == "true"
        got = note.frontmatter.get("publish") is True
        return got == want

    print(f"warning: unsupported dataview WHERE: {where}", file=sys.stderr)
    return True


def sort_notes(notes: list[VaultNote], sort_clause: str | None) -> list[VaultNote]:
    if not sort_clause:
        return sorted(notes, key=lambda n: n.name.lower())

    descending = "DESC" in sort_clause.upper()
    key_name = "file.name"
    if "file.name" in sort_clause:
        key_name = "file.name"

    if key_name == "file.name":
        return sorted(notes, key=lambda n: n.name.lower(), reverse=descending)

    return sorted(notes, key=lambda n: n.name.lower())


def query_notes(
    index: list[VaultNote],
    parsed: dict[str, str],
    *,
    publish_only: bool,
) -> list[VaultNote]:
    from_clause = parsed.get("from", "")
    paths = from_paths(from_clause)
    if not paths:
        return []

    where = parsed.get("where")
    matches = [
        note
        for note in index
        if note_in_from_paths(note, paths) and passes_where(note, where)
    ]
    if publish_only:
        matches = [note for note in matches if note.publish]
    return sort_notes(matches, parsed.get("sort"))


def render_list(notes: list[VaultNote]) -> str:
    if not notes:
        return "<!-- dataview: no matching notes -->\n"
    lines = [f"- [[{note.name}]]" for note in notes]
    return "\n".join(lines) + "\n"


def render_table(notes: list[VaultNote], columns_csv: str) -> str:
    columns = [col.strip() for col in columns_csv.split(",") if col.strip()]
    if not columns:
        return render_list(notes)

    if not notes:
        return "<!-- dataview: no matching notes -->\n"

    header = "| Note | " + " | ".join(columns) + " |"
    separator = "| --- | " + " | ".join("---" for _ in columns) + " |"
    rows: list[str] = []
    for note in notes:
        cells = [fm_scalar(note.frontmatter, col) or "" for col in columns]
        rows.append("| [[" + note.name + "]] | " + " | ".join(cells) + " |")
    return "\n".join([header, separator, *rows]) + "\n"


def render_dataview_block(body: str, index: list[VaultNote]) -> str:
    parsed = parse_dataview_block(body)
    kind = parsed.get("kind")
    if not kind:
        return f"<!-- dataview: could not parse block -->\n```\n{body}\n```\n"

    notes = query_notes(index, parsed, publish_only=True)
    if kind == "LIST":
        return render_list(notes)
    return render_table(notes, parsed.get("columns", ""))


def expand_dataview(text: str, index: list[VaultNote]) -> str:
    def replace(match: re.Match[str]) -> str:
        return render_dataview_block(match.group(1), index)

    return DATAVIEW_BLOCK_RE.sub(replace, text)


def drop_public_sections(text: str) -> str:
    """Remove ## Discord / ## Maintenance blocks from published markdown."""
    lines = text.splitlines()
    out: list[str] = []
    skip = False
    for line in lines:
        if line.startswith("## "):
            heading = line[3:].strip().lower()
            skip = heading in PUBLIC_SECTIONS_DROP
        if skip:
            continue
        out.append(line)
    return "\n".join(out)


def quartz_publish_relpath(relative: Path) -> Path:
    """Map vault `_index.md` paths to Quartz `index.md` folder pages."""
    if relative.name == INDEX_BASENAME:
        return relative.with_name(QUARTZ_INDEX_BASENAME)
    return relative


def rewrite_obsidian_index_links(text: str) -> str:
    """Rewrite Obsidian `_index` wikilinks to Quartz `index` slugs."""
    text = re.sub(
        r"\[\[([^|\]#]+)/_index(\|[^\]]+)?\]\]",
        lambda m: f"[[{m.group(1)}/index{m.group(2) or ''}]]",
        text,
    )
    text = re.sub(
        r"\[\[_index(\|[^\]]+)?\]\]",
        lambda m: f"[[index{m.group(1) or ''}]]",
        text,
    )
    return text


def sanitize_frontmatter_block(fm: str) -> str:
    kept: list[str] = []
    for line in fm.splitlines():
        stripped = line.strip()
        if "Discord/" in line or stripped.lower().startswith("discord/"):
            continue
        kept.append(line)
    return "\n".join(kept)


def sanitize_for_publish(text: str) -> str:
    """Strip editor-only paths and Discord provenance from staged markdown."""
    text = AGENTS_LINE_RE.sub("", text)
    text = drop_public_sections(text)
    text = WIKILINK_DISCORD_RE.sub("", text)
    text = DISCORD_EDITOR_LINE_RE.sub("", text)
    text = text.replace("[[source/", "[[Sourcebook/")
    text = text.replace("[[source|", "[[Sourcebook|")
    text = text.replace('FROM "source"', 'FROM "Sourcebook"')
    text = text.replace("`source/", "`Sourcebook/")
    text = rewrite_obsidian_index_links(text)

    match = FRONTMATTER_RE.match(text)
    if match:
        cleaned_fm = sanitize_frontmatter_block(match.group(1))
        text = f"---\n{cleaned_fm}\n---" + text[match.end() :]

    # Collapse excessive blank lines from removals
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text


def stage_content(planning_root: Path, staging_root: Path) -> None:
    content_dir = staging_root / "content"
    content_dir.mkdir(parents=True, exist_ok=True)
    vault_index = build_vault_index(planning_root)

    def write_staged(source: Path, destination: Path) -> None:
        destination.parent.mkdir(parents=True, exist_ok=True)
        if source.suffix.lower() == ".md":
            text = source.read_text(encoding="utf-8")
            text = expand_dataview(text, vault_index)
            text = sanitize_for_publish(text)
            destination.write_text(text, encoding="utf-8")
        else:
            shutil.copy2(source, destination)

    for filename in SYNC_FILES:
        source = planning_root / filename
        if source.is_file():
            dest_name = (
                QUARTZ_INDEX_BASENAME
                if filename == INDEX_BASENAME
                else filename
            )
            write_staged(source, content_dir / dest_name)

    for directory in SYNC_DIRS:
        source_dir = planning_root / directory
        if not source_dir.is_dir():
            continue

        for source in source_dir.rglob("*"):
            if source.is_dir() or not should_copy(source):
                continue

            relative = source.relative_to(source_dir)
            destination = content_dir / directory / quartz_publish_relpath(relative)
            write_staged(source, destination)


def replace_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination)


def sync(planning_root: Path, v4_root: Path) -> bool:
    staging_root = v4_root / ".sync-staging"
    if staging_root.exists():
        shutil.rmtree(staging_root)

    try:
        stage_content(planning_root, staging_root)
        staged_content = staging_root / "content"
        target_content = v4_root / "content"

        if not staged_content.exists():
            print("No publishable content found on planning.")
            return False

        if target_content.exists():
            replace_tree(staged_content, target_content)
        else:
            shutil.copytree(staged_content, target_content)

        print(f"Synced publishable content into {target_content}")
        return True
    finally:
        if staging_root.exists():
            shutil.rmtree(staging_root)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync publishable planning vault content into v4/content/."
    )
    parser.add_argument(
        "planning_root",
        type=Path,
        help="Path to the planning branch checkout",
    )
    parser.add_argument(
        "v4_root",
        type=Path,
        help="Path to the v4 branch checkout",
    )
    args = parser.parse_args()

    if not args.planning_root.is_dir():
        print(f"error: planning root not found: {args.planning_root}", file=sys.stderr)
        return 1

    if not args.v4_root.is_dir():
        print(f"error: v4 root not found: {args.v4_root}", file=sys.stderr)
        return 1

    sync(args.planning_root, args.v4_root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
