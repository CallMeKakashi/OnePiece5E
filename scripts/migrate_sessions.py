import os
import re
import subprocess
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple


RE_WIKILINK = re.compile(r"\[\[([^\]\|]+)(\|[^\]]+)?\]\]")


@dataclass(frozen=True)
class RenamePlan:
    old_path: Path
    old_note_name: str  # filename without extension
    new_path: Path
    new_note_name: str  # filename without extension
    date_played: str
    session_order: float
    sidestory: bool


def run_git(args: List[str], cwd: Path) -> str:
    p = subprocess.run(
        ["git", *args],
        cwd=str(cwd),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )
    if p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {p.stderr.strip()}")
    return p.stdout


def oldest_git_date(repo: Path, file_path: Path) -> Optional[str]:
    rel = file_path.relative_to(repo).as_posix()
    out = run_git(["log", "--reverse", "--format=%ad", "--date=short", "--", rel], cwd=repo)
    out = out.strip().splitlines()
    return out[0].strip() if out else None


def parse_top_frontmatter(text: str) -> Tuple[Optional[str], str]:
    """
    Returns (frontmatter_block_including_markers_or_None, remainder_text).
    Only recognizes YAML frontmatter if it begins at line 1.
    """
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return None, text
    # find closing marker
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            fm = "".join(lines[: i + 1])
            rest = "".join(lines[i + 1 :])
            return fm, rest
    return None, text


YAML_BLOCK_START = re.compile(r"^---\s*$")
YAMLISH_KEY = re.compile(r"^[A-Za-z_][A-Za-z0-9_\-]*\s*:")
YAMLISH_INTERESTING_KEYS = {
    "publish",
    "type",
    "episode",
    "status",
    "sources",
    "date",
    "role",
    "prep_for",
}


def strip_embedded_yaml_blocks(body: str) -> str:
    """
    Removes YAML-like blocks that appear after the first frontmatter block.
    Heuristic: block delimited by lines containing only '---', and inside contains
    at least one "interesting" key.
    """
    lines = body.splitlines()
    out: List[str] = []
    i = 0
    while i < len(lines):
        if YAML_BLOCK_START.match(lines[i]):
            # find closing
            j = i + 1
            has_interesting = False
            has_key = False
            while j < len(lines) and not YAML_BLOCK_START.match(lines[j]):
                if YAMLISH_KEY.match(lines[j]):
                    has_key = True
                    key = lines[j].split(":", 1)[0].strip()
                    if key in YAMLISH_INTERESTING_KEYS:
                        has_interesting = True
                j += 1
            if j < len(lines) and YAML_BLOCK_START.match(lines[j]) and has_key and has_interesting:
                # drop the whole block (including closing marker)
                i = j + 1
                continue
        out.append(lines[i])
        i += 1
    return "\n".join(out).rstrip() + "\n"


def first_heading_title(body: str) -> Optional[str]:
    for line in body.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return None


def sanitize_title_for_filename(title: str) -> str:
    # Keep em dash used in vault; normalize problematic filesystem characters.
    title = title.strip()
    title = re.sub(r"[\\/:*?\"<>|]", "—", title)
    title = re.sub(r"\s+", " ", title).strip()
    return title


SESSION_NUM_RE = re.compile(r"\bSession\s*-?\s*(\d+(?:\.\d+)?)\b", re.IGNORECASE)


def session_order_from_name(name: str) -> Optional[float]:
    m = SESSION_NUM_RE.search(name)
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def guess_sidestory(path: Path, title: str, top_frontmatter: Optional[str]) -> bool:
    if "Sidequests" in path.parts:
        return True
    if re.search(r"\bsidequest\b", title, re.IGNORECASE):
        return True
    if top_frontmatter and re.search(r"^\s*type:\s*(?:\n\s*-\s*)?outline\b", top_frontmatter, re.IGNORECASE | re.MULTILINE):
        return True
    return False


def extract_sources_wikilinks(text: str) -> List[str]:
    out: List[str] = []
    for m in RE_WIKILINK.finditer(text):
        target = m.group(1).strip()
        if target:
            out.append(f"[[{target}]]")
    # de-dupe stable
    seen = set()
    deduped = []
    for x in out:
        if x not in seen:
            seen.add(x)
            deduped.append(x)
    return deduped


def build_frontmatter(
    date_played: str,
    session_order: float,
    sidestory: bool,
    episode_links: List[str],
    source_links: List[str],
) -> str:
    def fmt_list(xs: List[str]) -> str:
        if not xs:
            return "[]"
        return "[\n" + "".join([f"  - \"{x}\"\n" for x in xs]) + "]"

    # Baseline required by user.
    fm = [
        "---",
        "type: session",
        f"date_played: {date_played}",
        f"session_order: {int(session_order) if session_order.is_integer() else session_order}",
        f"sidestory: {'true' if sidestory else 'false'}",
        f"episode: {fmt_list(episode_links)}",
        f"sources: {fmt_list(source_links)}",
        "---",
        "",
    ]
    return "\n".join(fm)


RE_SECTION = re.compile(r"^##\s+", re.MULTILINE)


def ensure_section_structure(body: str, is_prep_heavy: bool) -> str:
    """
    Enforce required section order:
    1) TL;DR  2) Cast  3) Where/When  4) Actual play outcomes
    5) Open threads  6) Loot & changes  7) Prep (before play)
    We keep existing content by appending it to either Prep or Actual play outcomes.
    """
    required = [
        "## TL;DR",
        "## Cast",
        "## Where/When",
        "## Actual play outcomes",
        "## Open threads",
        "## Loot & changes",
        "## Prep (before play)",
    ]

    # If it already has these headers, do nothing.
    if all(h in body for h in required):
        return body.rstrip() + "\n"

    title = first_heading_title(body) or "Session"

    # Remove the first H1; we’ll re-add a normalized one.
    lines = body.splitlines()
    stripped: List[str] = []
    skipped_h1 = False
    for line in lines:
        if not skipped_h1 and line.startswith("# "):
            skipped_h1 = True
            continue
        stripped.append(line)
    remaining = "\n".join(stripped).strip()

    content_bucket = "## Prep (before play)" if is_prep_heavy else "## Actual play outcomes"

    out = [f"# {title}", ""]
    for h in required:
        out.append(h)
        out.append("")
        if h == content_bucket and remaining:
            out.append(remaining)
            out.append("")
    return "\n".join(out).rstrip() + "\n"


def compute_session_title(note_name: str, body: str) -> str:
    h1 = first_heading_title(body)
    if h1:
        return h1
    # fallback to filename, stripping extension already
    return note_name


def is_prep_outline(top_frontmatter: Optional[str], note_name: str, body: str) -> bool:
    if top_frontmatter and re.search(r"^\s*role:\s*prep-outline\b", top_frontmatter, re.IGNORECASE | re.MULTILINE):
        return True
    if re.search(r"\bprep outline\b", body, re.IGNORECASE):
        return True
    if "Outlines" in note_name or "/Outlines/" in note_name:
        return True
    return False


def plan_renames(repo: Path) -> Tuple[List[RenamePlan], Dict[str, str]]:
    sessions_root = repo / "Sessions"
    md_files = [p for p in sessions_root.rglob("*.md") if p.is_file()]

    plans: List[RenamePlan] = []
    sidestory_counter = 0

    for p in md_files:
        rel = p.relative_to(repo).as_posix()
        # Campaign 1 is handled separately (move to Timeline)
        if rel.lower().startswith("sessions/archive/campaign 1/"):
            continue
        if rel.lower().startswith("sessions/archive\\campaign 1\\"):
            continue

        note_name = p.stem
        text = p.read_text(encoding="utf-8", errors="replace")
        fm, body = parse_top_frontmatter(text)
        title = compute_session_title(note_name, body)
        sidestory = guess_sidestory(p, title, fm)

        order = session_order_from_name(note_name) or session_order_from_name(title)
        if order is None:
            if sidestory:
                sidestory_counter += 1
                order = 10000.0 + sidestory_counter
            else:
                # Non-session utility notes in Sessions/ are left in place.
                continue

        dp = oldest_git_date(repo, p) or date.today().isoformat()
        year = dp.split("-", 1)[0]

        # Title for new filename: drop leading "Session X —" when present, keep the story title.
        clean_title = re.sub(r"^\s*Session\s*-?\s*\d+(?:\.\d+)?\s*[—\-:]\s*", "", title, flags=re.IGNORECASE).strip()
        if not clean_title:
            clean_title = title.strip()
        clean_title = sanitize_title_for_filename(clean_title)

        new_note_name = f"{dp} — {clean_title}"
        new_path = sessions_root / year / f"{new_note_name}.md"

        plans.append(
            RenamePlan(
                old_path=p,
                old_note_name=note_name,
                new_path=new_path,
                new_note_name=new_note_name,
                date_played=dp,
                session_order=order,
                sidestory=sidestory,
            )
        )

    # Build wikilink replacements map.
    repl: Dict[str, str] = {}
    for pl in plans:
        if pl.old_note_name != pl.new_note_name:
            repl[pl.old_note_name] = pl.new_note_name
    return plans, repl


def rewrite_wikilinks(text: str, mapping: Dict[str, str]) -> str:
    def _sub(m: re.Match) -> str:
        target = m.group(1)
        alias = m.group(2) or ""
        new_target = mapping.get(target, target)
        return f"[[{new_target}{alias}]]"

    return RE_WIKILINK.sub(_sub, text)


def apply_content_rewrite(repo: Path, plan: RenamePlan) -> None:
    text = plan.old_path.read_text(encoding="utf-8", errors="replace")
    top_fm, body = parse_top_frontmatter(text)
    body = strip_embedded_yaml_blocks(body)

    # Pull episode links from existing sources list and/or inline links.
    episode_links: List[str] = []
    if top_fm:
        episode_links = extract_sources_wikilinks(top_fm)
    episode_links = [x for x in episode_links if "Episode" in x]

    source_links: List[str] = []
    if top_fm:
        source_links.extend(extract_sources_wikilinks(top_fm))
    source_links.extend(extract_sources_wikilinks(body))

    # Prefer to keep only high-signal sources (episodes + prior session pointers).
    source_links = [x for x in source_links if ("Episode" in x or "Session" in x or "Transcript" in x)]
    # De-dupe stable
    seen = set()
    dedup = []
    for x in source_links:
        if x not in seen:
            seen.add(x)
            dedup.append(x)
    source_links = dedup

    prep_heavy = is_prep_outline(top_fm, plan.old_note_name, body) or plan.sidestory
    body = ensure_section_structure(body, is_prep_heavy=prep_heavy)

    fm = build_frontmatter(
        date_played=plan.date_played,
        session_order=plan.session_order,
        sidestory=plan.sidestory,
        episode_links=episode_links,
        source_links=source_links,
    )

    plan.new_path.parent.mkdir(parents=True, exist_ok=True)
    plan.new_path.write_text(fm + body, encoding="utf-8")


def merge_prep_into_session(repo: Path, prep_path: Path, target_session_name: str) -> None:
    """
    Merge an outline/prep note into the canonical session note by appending
    its content under '## Prep (before play)'.
    """
    prep_text = prep_path.read_text(encoding="utf-8", errors="replace")
    _, prep_body = parse_top_frontmatter(prep_text)
    prep_body = strip_embedded_yaml_blocks(prep_body).strip()

    # Find the target session note by wikilink name (stem match) across Sessions/ years.
    candidates = list((repo / "Sessions").rglob(f"*{target_session_name}.md"))
    if not candidates:
        return
    target_path = candidates[0]
    target_text = target_path.read_text(encoding="utf-8", errors="replace")
    fm, body = parse_top_frontmatter(target_text)
    if fm is None:
        return

    if "## Prep (before play)" not in body:
        body = ensure_section_structure(body, is_prep_heavy=False)

    parts = body.split("## Prep (before play)", 1)
    before = parts[0]
    after = parts[1] if len(parts) > 1 else ""
    merged = before + "## Prep (before play)\n\n" + prep_body + "\n\n" + after.lstrip()
    target_path.write_text(fm + merged.rstrip() + "\n", encoding="utf-8")


def migrate_campaign1_to_timeline(repo: Path) -> Dict[str, str]:
    """
    Move Sessions/Archive/Campaign 1/* into Timeline/Campaign 1/* and create hub.
    Returns wikilink rename mapping old stem -> new stem where changed.
    """
    src_dir = repo / "Sessions" / "Archive" / "Campaign 1"
    if not src_dir.exists():
        return {}
    dest_dir = repo / "Timeline" / "Campaign 1"
    dest_dir.mkdir(parents=True, exist_ok=True)

    mapping: Dict[str, str] = {}
    moved: List[Tuple[str, str]] = []

    for p in src_dir.rglob("*.md"):
        if not p.is_file():
            continue
        new_path = dest_dir / p.name
        new_path.write_text(p.read_text(encoding="utf-8", errors="replace"), encoding="utf-8")
        moved.append((p.stem, new_path.stem))
        p.unlink()

    hub = repo / "Timeline" / "Campaign 1.md"
    lines = [
        "---",
        "publish: true",
        "type: backstory",
        "status: draft",
        "---",
        "",
        "# Campaign 1 (backstory)",
        "",
        "Backstory sessions formerly stored under `Sessions/Archive/Campaign 1/`.",
        "",
        "## Index",
        "",
    ]
    for old_stem, new_stem in sorted(moved):
        lines.append(f"- [[Campaign 1/{new_stem}]]")
    lines.append("")
    hub.write_text("\n".join(lines), encoding="utf-8")

    for old_stem, new_stem in moved:
        if old_stem != new_stem:
            mapping[old_stem] = new_stem
    return mapping


def build_sessions_hub(repo: Path) -> None:
    sessions_md = repo / "Sessions.md"
    session_files = list((repo / "Sessions").rglob("*.md"))
    items: List[Tuple[float, str, str]] = []  # (order, date_played, note_name)

    for p in session_files:
        text = p.read_text(encoding="utf-8", errors="replace")
        fm, _ = parse_top_frontmatter(text)
        if not fm:
            continue
        if not re.search(r"^type:\s*session\b", fm, re.MULTILINE):
            continue
        m_order = re.search(r"^session_order:\s*([0-9.]+)\s*$", fm, re.MULTILINE)
        m_date = re.search(r"^date_played:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*$", fm, re.MULTILINE)
        if not (m_order and m_date):
            continue
        try:
            order = float(m_order.group(1))
        except ValueError:
            continue
        dp = m_date.group(1)
        items.append((order, dp, p.stem))

    items.sort(key=lambda t: (t[0], t[1]))

    lines = [
        "---",
        "publish: true",
        "type: index",
        "---",
        "",
        "# Sessions",
        "",
        "Canonical index of all table sessions and sidestories.",
        "",
        "Sorted by `session_order`, then `date_played`.",
        "",
        "## Index",
        "",
    ]
    for order, dp, name in items:
        lines.append(f"- **{order}** ({dp}) — [[{name}]]")
    lines.append("")
    sessions_md.write_text("\n".join(lines), encoding="utf-8")


def update_template(repo: Path) -> None:
    templates_dir = repo / "Templates"
    templates_dir.mkdir(parents=True, exist_ok=True)
    tpl = templates_dir / "Session Template.md"
    tpl.write_text(
        "\n".join(
            [
                "---",
                "type: session",
                "date_played: {{date:YYYY-MM-DD}}",
                "session_order: ",
                "sidestory: false",
                "episode: []",
                "sources: []",
                "---",
                "",
                "# {{title}}",
                "",
                "## TL;DR",
                "",
                "## Cast",
                "",
                "## Where/When",
                "",
                "## Actual play outcomes",
                "",
                "## Open threads",
                "",
                "## Loot & changes",
                "",
                "## Prep (before play)",
                "",
            ]
        ),
        encoding="utf-8",
    )

    idx = templates_dir / "_index.md"
    if idx.exists():
        text = idx.read_text(encoding="utf-8", errors="replace")
    else:
        text = "# Campaign templates\n"
    if "[[Session Template]]" not in text:
        text = text.rstrip() + "\n\n## Sessions\n\n- [[Session Template]]\n"
    idx.write_text(text.rstrip() + "\n", encoding="utf-8")


def rewrite_links_across_repo(repo: Path, mapping: Dict[str, str]) -> None:
    md_files = [p for p in repo.rglob("*.md") if p.is_file()]
    for p in md_files:
        text = p.read_text(encoding="utf-8", errors="replace")
        new_text = rewrite_wikilinks(text, mapping)
        if new_text != text:
            p.write_text(new_text, encoding="utf-8")


def main() -> None:
    repo = Path(__file__).resolve().parents[1]

    # 1) Plan renames for sessions/sidestories.
    plans, mapping = plan_renames(repo)

    # 2) Rewrite session contents into new canonical files.
    for pl in plans:
        apply_content_rewrite(repo, pl)

    # 3) Merge known prep-outline sessions into canonical sessions, then remove the prep files.
    # These are hard-coded from existing notes that explicitly point to the played session.
    known_merges = [
        (repo / "Sessions" / "Session 24 - Fire Storm.md", "Session 25 - Fire Storm"),
        (repo / "Sessions" / "Session 17 - Howling Thunder.md", "Session 17 - Agony of Choas"),
    ]
    for prep_path, target in known_merges:
        if prep_path.exists():
            merge_prep_into_session(repo, prep_path, target_session_name=target)
            prep_path.unlink()

    # 4) Move Campaign 1 into Timeline/ and create hub.
    campaign1_mapping = migrate_campaign1_to_timeline(repo)
    mapping.update(campaign1_mapping)

    # 5) Rewrite wikilinks across repo (sessions + campaign1 moves).
    rewrite_links_across_repo(repo, mapping)

    # 6) Create Sessions hub.
    build_sessions_hub(repo)

    # 7) Update templates.
    update_template(repo)

    # 8) Remove legacy folders (empty after migration).
    for d in [repo / "Sessions" / "Sidequests", repo / "Sessions" / "Outlines", repo / "Sessions" / "Archive"]:
        if d.exists():
            # Remove only if empty after our operations.
            try:
                next(d.rglob("*"))
            except StopIteration:
                d.rmdir()


if __name__ == "__main__":
    main()

