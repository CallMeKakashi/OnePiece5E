#!/usr/bin/env python3
"""Refresh Devil Fruits/ notes: download images, apply D&D-style template."""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

VAULT = Path(__file__).resolve().parents[1]
FRUITS_DIR = VAULT / "Devil Fruits"
ATTACHMENTS = VAULT / "Attachments"
EXPORT = VAULT / "Discord" / "exports" / "devil-fruit-dex.md"

# Import registry from sync script
sys.path.insert(0, str(VAULT / "scripts"))
from discord_vault_sync_full import ALL_FRUITS, PHEZU_POWER, SOKU_POWER  # noqa: E402

FRUIT_TYPE: dict[str, str] = {
    "Yuki Yuki no Mi — Model Yeti.md": "Logia",
    "Mera Mera no Mi.md": "Logia",
    "Tori Tori no Mi — Model Raicho.md": "Zoan",
    "Tori Tori no Mi — Model Sparrow.md": "Zoan",
    "Kamo Kamo no Mi.md": "Zoan",
    "Unknown Devil Fruit — Party 1.md": "Unknown",
}

EXTRA_FRUITS: list[dict] = [
    {
        "file": "Koru Koru no Mi.md",
        "title": "Koru Koru no Mi (Coal-Coal Fruit)",
        "owner": "[[Daniel]]",
        "fruit_type": "Paramecia",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107529741471765/coal-coal.png",
        "image_name": "koru-koru-no-mi.png",
        "power": "Charcoal and coal manipulation. **No-Knees Phantom** — [[Daniel]], navigator of the [[Spider Nest Pirates]].",
    },
    {
        "file": "Ink Ink no Mi.md",
        "title": "Ink Ink no Mi (墨墨の実)",
        "owner": "[[Rhum Guiseppi]]",
        "fruit_type": "Paramecia",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504556355573518477/Sumi_Sumi_No_Mi.png",
        "image_name": "ink-ink-no-mi.png",
        "power": "Ink manipulation. [[Rhum Guiseppi]] of the [[Guiseppi Family]] — twin of [[Rum Guiseppi]]. Distinct from Daniel's [[Koru Koru no Mi|Coal-Coal]] fruit.",
    },
    {
        "file": "Eki Eki no Mi.md",
        "title": "Eki Eki no Mi (Sick-Sick Fruit)",
        "owner": "[[Cline The Plague]]",
        "fruit_type": "Paramecia",
        "image_url": None,
        "image_name": None,
        "power": "Disease and sickness manipulation — toxic aura, infectious touch, sick fog. See [[Cline The Plague]] for table abilities.",
    },
]

LEGACY_REDIRECTS = {
    "Sumi Sumi no Mi.md": (
        "# Sumi Sumi no Mi (legacy dex label)\n\n"
        "**Superseded:** Daniel → [[Koru Koru no Mi]]; Rhum → [[Ink Ink no Mi]].\n"
    ),
    "Sumi Sumi no Mi — Rhum Guiseppi.md": (
        "# Sumi Sumi no Mi — Rhum Guiseppi (legacy)\n\n"
        "**Superseded by** [[Ink Ink no Mi]].\n"
    ),
}

OWNER_FIXES = {
    "Buki Buki no Mi.md": "[[Serica Corven]]",
    "Fura Fura no Mi.md": "[[Rhythm Echo]]",
    "Suraimu Suraimu no Mi.md": "[[Droven Calligos]]",
    "Toneru Toneru no Mi.md": "[[Dravos]]",
    "Hai Hai no Mi.md": "[[Malak Samum]]",
}

URL_RE = re.compile(r"\((https://cdn\.discordapp\.com/attachments/[^)]+)\)")
FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 500:
        return False
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": "blood-brine-refresh/1.0"})
        with urllib.request.urlopen(req, timeout=90) as response:
            dest.write_bytes(response.read())
        print(f"  downloaded {dest.name}", flush=True)
        return True
    except Exception as exc:
        print(f"  WARN {dest.name}: {exc}", flush=True)
        return False


def urls_from_export() -> dict[str, str]:
    """Map attachment filename (lower) → signed URL."""
    mapping: dict[str, str] = {}
    if not EXPORT.is_file():
        return mapping
    for line in EXPORT.read_text(encoding="utf-8").splitlines():
        for match in URL_RE.finditer(line):
            url = match.group(1)
            name = url.split("?")[0].rsplit("/", 1)[-1].lower()
            mapping[name] = url
    return mapping


def build_registry() -> dict[str, dict]:
    reg: dict[str, dict] = {}
    for entry in ALL_FRUITS + EXTRA_FRUITS:
        f = entry["file"]
        reg[f] = dict(entry)
        reg[f]["fruit_type"] = entry.get("fruit_type") or FRUIT_TYPE.get(f, "Paramecia")
        if f == "Phezu Phezu no Mi.md":
            reg[f]["power"] = PHEZU_POWER
        if f == "Soku Soku no Mi.md":
            reg[f]["power"] = SOKU_POWER
        if f in OWNER_FIXES:
            reg[f]["owner"] = OWNER_FIXES[f]
        if f == "Shire Shire no Mi.md":
            reg[f]["owner"] = "[[Rias Decibel]]"
        if f == "Ame Ame no Mi.md":
            reg[f]["power"] = (
                "Rain manipulation (campaign homebrew). Former PC fruit; owner [[Sora]]."
            )
    return reg


def extract_section(text: str, name: str) -> str:
    pattern = rf"^## {re.escape(name)}\s*\n"
    m = re.search(pattern, text, re.MULTILINE)
    if not m:
        return ""
    start = m.end()
    nxt = re.search(r"\n## ", text[start:])
    end = start + nxt.start() if nxt else len(text)
    return text[start:end].strip()


def extract_body_after_frontmatter(text: str) -> str:
    return FRONTMATTER_RE.sub("", text, count=1).strip()


def short_name(title: str) -> str:
    return title.split("(")[0].strip()


def render_note(meta: dict, power: str, description: str = "") -> str:
    title = meta["title"]
    name = short_name(title)
    fruit_type = meta.get("fruit_type", "Paramecia")
    owner = meta.get("owner", "")
    image = meta.get("image_name")
    epithet = ""
    if "(" in title:
        epithet = title[title.index("(") + 1 : title.rindex(")")].strip()

    subtitle = f"*{fruit_type}, unique (consumed — replaces attunement)*"
    if epithet and epithet not in name:
        heading = f"# {name}\n\n{subtitle}\n\n*{epithet}*"
    else:
        heading = f"# {name}\n\n{subtitle}"

    img_block = ""
    if image:
        img_block = f"\n![[Attachments/{image}|registry-image]]\n"

    desc = description or (
        f"Campaign-registered **{fruit_type}** devil fruit. "
        f"Current eater: {owner}."
    )

    drawbacks = """- **Ocean's Scorn** — the eater cannot swim; running water and seastone apply as in [[What Are Devil Fruits]].
- **Haki** — armament haki can bypass many paramecia defenses where noted in session."""
    if "Logia" in fruit_type:
        drawbacks += "\n- **Elemental body** — logia intangibility unless struck with haki or countered by the element."

    owner_link = owner.strip("[]") if owner.startswith("[[") else owner
    see_also = f"- [[Sourcebook/Chapter 6 Devil Fruits/Chapter 6 Devil Fruits|Chapter 6 Devil Fruits]]\n- Owner: {owner}"
    if owner_link and not owner_link.startswith("Party"):
        see_also += f"\n- [[{owner_link}]]"

    return f"""---
type: devil-fruit
fruit_type: {fruit_type}
publish: true
status: canon
owner: "{owner}"
rarity: unique
attunement: none
sources:
  - "Discord/exports/devil-fruit-dex"
related_source:
  - "[[Sourcebook/Chapter 6 Devil Fruits/Chapter 6 Devil Fruits|Chapter 6 Devil Fruits]]"
---

{heading}

| | |
| --- | --- |
| **Owner** | {owner} |
| **Registry** | [[Devil Fruits]] |
{img_block}
## Description

{desc}

## Properties

{power}

## Drawbacks

{drawbacks}

## See also

{see_also}
"""


def render_legacy(filename: str, body: str) -> str:
    return f"""---
type: devil-fruit
publish: true
status: archived
---

{body}
"""


def render_campaign_one_off(path: Path, fruit_type: str = "Paramecia") -> None:
    """Zaiko / Fusion: wrap existing body in template shell."""
    text = path.read_text(encoding="utf-8")
    body = extract_body_after_frontmatter(text)
    owner = ""
    m = re.search(r'^owner:\s*"?(\[\[[^\]]+\]\])"?', text, re.MULTILINE)
    if m:
        owner = m.group(1)
    title_m = re.search(r"^#+ \*?\*?([^*\n]+)", body, re.MULTILINE)
    title = title_m.group(1).strip() if title_m else path.stem
    name = path.stem
    desc = extract_section(text, "Description") or f"Campaign 1 legacy fruit — see body below."
    props = body
    for drop in ("### **Name**", "### **Fusion"):
        if props.startswith("#"):
            pass
    # Use full body as Properties for legacy rich notes
    if "## Properties" not in body and "## 🌿" in body:
        props = body.split("### **Name**", 1)[-1].strip()
        if props.startswith(":"):
            props = props.split("\n", 1)[-1].strip()

    note = render_note(
        {
            "title": title,
            "owner": owner or "—",
            "fruit_type": fruit_type,
            "image_name": None,
        },
        props,
        description=desc,
    )
    path.write_text(note, encoding="utf-8")
    print(f"  wrapped {path.name}", flush=True)


def main() -> int:
    export_urls = urls_from_export()
    registry = build_registry()
    changed = 0

    for path in sorted(FRUITS_DIR.glob("*.md")):
        name = path.name
        if name in LEGACY_REDIRECTS:
            path.write_text(render_legacy(name, LEGACY_REDIRECTS[name]), encoding="utf-8")
            print(f"  legacy {name}", flush=True)
            changed += 1
            continue

        if name in ("Zaiko Zaiko No Mi.md", "Fusion Fusion Fruit.md"):
            continue  # Campaign 1 legacy — hand-maintained layout

        meta = registry.get(name)
        if not meta:
            print(f"  SKIP no registry: {name}", flush=True)
            continue

        existing = path.read_text(encoding="utf-8") if path.exists() else ""
        power = (
            extract_section(existing, "Properties")
            or extract_section(existing, "Power")
            or meta.get("power", "")
        )
        description = extract_section(existing, "Description")

        image_name = meta.get("image_name")
        image_url = meta.get("image_url")
        if image_name:
            resolved = None
            if image_url:
                bn = image_url.split("?")[0].rsplit("/", 1)[-1].lower()
                resolved = export_urls.get(bn)
            if not resolved:
                for key, url in export_urls.items():
                    stem = image_name.split(".")[0].replace("-", "")
                    if stem and stem in key.replace("-", "").replace("_", ""):
                        resolved = url
                        break
                    if key.replace("-", "").replace("_", "") in stem:
                        resolved = url
                        break
            url_to_fetch = resolved or image_url
            if url_to_fetch:
                download(url_to_fetch, ATTACHMENTS / image_name)

        path.write_text(
            render_note(meta, power, description), encoding="utf-8"
        )
        print(f"  updated {name}", flush=True)
        changed += 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
