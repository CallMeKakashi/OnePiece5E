import re
from pathlib import Path


def parse_top_frontmatter(text: str):
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "".join(lines[: i + 1])
    return None


def main() -> None:
    repo = Path(__file__).resolve().parents[1]
    items = []
    for p in (repo / "Sessions").rglob("*.md"):
        text = p.read_text(encoding="utf-8", errors="replace")
        fm = parse_top_frontmatter(text)
        if not fm:
            continue
        if not re.search(r"^type:\s*session\b", fm, re.MULTILINE):
            continue
        m_order = re.search(r"^session_order:\s*([0-9.]+)\s*$", fm, re.MULTILINE)
        m_date = re.search(r"^date_played:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*$", fm, re.MULTILINE)
        if not (m_order and m_date):
            continue
        order = float(m_order.group(1))
        dp = m_date.group(1)
        items.append((order, dp, p.stem))

    items.sort(key=lambda t: (t[0], t[1], t[2]))

    out = [
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
        out.append(f"- **{order:g}** ({dp}) — [[{name}]]")
    out.append("")

    (repo / "Sessions.md").write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    main()

