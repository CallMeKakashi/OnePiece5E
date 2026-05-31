#!/usr/bin/env python3
"""One-shot sync: Discord exports → actor notes, Attachments/, Rules/Devil Fruits/."""

from __future__ import annotations

import re
import urllib.request
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
ATTACHMENTS = VAULT / "Attachments"
EXPORTS = VAULT / "Discord" / "exports"

# actor key → note path (relative to vault)
ACTOR_PATHS: dict[str, str] = {
    "baptiste": "World/Factions/Blackhand/Lunarfolds/Baptiste.md",
    "roma": "World/Factions/Blackhand/Lunarfolds/Roma.md",
    "malphas": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
    "tigor": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "cade_tigor_hunt": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "zim": "World/Factions/Blackhand/Lunarfolds/Zim.md",
    "linus": "World/Factions/Motley Crew/Linus Marrow.md",
    "linus_marrow": "World/Factions/Motley Crew/Linus Marrow.md",
    "serica": "World/Factions/Sixfold/Cerica Corvine.md",
    "veyl": "World/Factions/Sixfold/Veyl Corvine.md",
    "liz": "World/Factions/Sixfold/Liz.md",
    "mira": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "tray": "World/Factions/Blackhand/Tray.md",
    "tray_caneheart": "World/Factions/Blackhand/Tray.md",
    "leon": "World/Factions/Marines/Commander Leon.md",
    "daniel": "World/Factions/Spider Nest Pirates/Daniel.md",
    "cadence": "World/Factions/Decibella Revolutionary/Cadence.md",
    "cline": "World/Factions/Sixfold/Cline The Plague.md",
    "fenris_wolfblood": "World/Factions/Blackhand/⚔️ Fenris Wolfblood — “The Blood of Sun and Shadow”.md",
    "shako": "World/Factions/Blackhand/Gentle Giant Pirates/Shako.md",
    "kalla": "World/Factions/Blackhand/Gentle Giant Pirates/Kalla of Shandia.md",
    "ben": "World/Factions/Spider Nest Pirates/Ben.md",
    "chloe": "World/Factions/Spider Nest Pirates/Chloe.md",
    "graff_bolt": "World/Factions/Marines/Graff Bolt.md",
    "graff_boltt": "World/Factions/Marines/Graff Bolt.md",
    "calder_voss": "World/Factions/Marines/Vorro.md",
    "vorro": "World/Factions/Marines/Vorro.md",
    "rias": "World/Factions/Motley Crew/Rias.md",
    "pasha": "World/Factions/Motley Crew/Pasha.md",
    "hallow_gruff": "World/Factions/Mugen Industries/Hallow.md",
    "melina": "World/Factions/Marines/Graff Bolt.md",  # no Melina note; skip via None below
}

# filename stem (lower, normalized) → actor key
def norm_stem(name: str) -> str:
    s = Path(name).stem.lower()
    s = re.sub(r"^spoiler_", "", s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s

def actor_key_from_filename(filename: str) -> str | None:
    stem = norm_stem(filename)
    aliases = {
        "bob": None,
        "deathknight_bob": None,
        "devilmask": None,
        "dravos": None,
        "droven": None,
        "jack": None,
        "alice": None,
        "vireth": None,
        "obsidian": None,
        "iron_beast_roma": "roma",
        "guillotine_liz": "liz",
        "mira_the_unbreakable": "mira",
        "mira_curr": "mira",
        "spoiler_mira_curr": "mira",
        "thompson_caneheart": None,
        "ju_lee_caneheart": None,
        "melina": None,
    }
    if stem in aliases:
        return aliases[stem]
    if stem in ACTOR_PATHS:
        return stem
    for key in ACTOR_PATHS:
        if key in stem or stem in key:
            return key
    return None

URL_RE = re.compile(r"\((https://cdn\.discordapp\.com/attachments/[^)]+)\)")

def extract_latest_attachments(export_path: Path) -> dict[str, str]:
    """Map actor key → latest attachment URL from export (last wins)."""
    text = export_path.read_text(encoding="utf-8")
    mapping: dict[str, str] = {}
    for line in text.splitlines():
        for match in URL_RE.finditer(line):
            url = match.group(1).split("?")[0]
            filename = url.rsplit("/", 1)[-1]
            key = actor_key_from_filename(filename)
            if key and key in ACTOR_PATHS:
                mapping[key] = (url, filename)
    return {k: v[0] for k, v in mapping.items()} | {
        k: v[0] for k, v in {
            key: mapping[key] for key in mapping
        }.items()
    }

def extract_attachments_full(export_path: Path) -> dict[str, tuple[str, str]]:
    text = export_path.read_text(encoding="utf-8")
    mapping: dict[str, tuple[str, str]] = {}
    for line in text.splitlines():
        for match in URL_RE.finditer(line):
            url = match.group(1)  # keep signed query params for Discord CDN
            filename = url.split("?")[0].rsplit("/", 1)[-1]
            key = actor_key_from_filename(filename)
            if key and key in ACTOR_PATHS:
                mapping[key] = (url, filename)
    return mapping

def download(url: str, dest: Path) -> bool:
    if dest.exists():
        return False
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": "blood-brine-vault-sync/1.0"})
        with urllib.request.urlopen(req, timeout=60) as response:
            dest.write_bytes(response.read())
        return True
    except Exception as exc:
        print(f"  WARN download failed {dest.name}: {exc}", flush=True)
        return False

def add_source(text: str, source: str) -> str:
    if source in text:
        return text
    if not text.startswith("---"):
        return text
    end = text.index("\n---", 3)
    fm = text[3:end]
    if "sources:" in fm:
        fm = fm.rstrip() + f'\n  - "Discord/exports/{source}"'
    else:
        fm = fm.rstrip() + f"\nsources:\n  - \"Discord/exports/{source}\""
    return f"---{fm}\n---" + text[end + 4 :]

def upsert_visuals(text: str, portrait: str | None, bounty: str | None) -> str:
    lines = []
    if portrait:
        lines.append(f"![[Attachments/{portrait}|Portrait]]")
    if bounty:
        lines.append(f"![[Attachments/{bounty}|Bounty poster]]")
    if not lines:
        return text
    block = "## Visuals\n\n" + "\n".join(lines) + "\n\n*Discord quarry: "
    sources = []
    if portrait:
        sources.append("[[Discord/exports/character-art]]")
    if bounty:
        sources.append("[[Discord/exports/bounty-posters]]")
    block += ", ".join(sources) + "*\n\n"

    if "## Visuals" in text:
        text = re.sub(r"## Visuals\n.*?(?=\n## |\Z)", block.rstrip() + "\n\n", text, flags=re.DOTALL)
        return text

    # Insert after frontmatter, before first ##
    if text.startswith("---"):
        end = text.index("\n---", 3) + 4
        rest = text[end:].lstrip("\n")
        return text[:end] + "\n" + block + rest
    return block + text

DEVIL_FRUITS = [
    {
        "file": "Yuki Yuki no Mi — Model Yeti.md",
        "title": "Yuki Yuki no Mi — Model: Yeti",
        "owner": "[[Roma]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1390210465635897515/yukiyukinomi_-_Yeti_Yeti_Fruit.png",
        "image_name": "yukiyukinomi-yeti.png",
        "actor_path": "World/Factions/Blackhand/Lunarfolds/Roma.md",
        "fruit_link": "[[Yuki Yuki no Mi — Model Yeti]]",
    },
    {
        "file": "Uchu Uchu no Mi.md",
        "title": "Uchu Uchu no Mi",
        "owner": "[[Baptiste]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107809069793290/uhuuchunomi-2.png",
        "image_name": "uchu-uchu-no-mi.png",
        "actor_path": "World/Factions/Blackhand/Lunarfolds/Baptiste.md",
        "fruit_link": "[[Uchu Uchu no Mi]]",
    },
    {
        "file": "Tori Tori no Mi — Model Raicho.md",
        "title": "Tori Tori no Mi — Model: Raichō (Thunder Bird)",
        "owner": "[[Malphas]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426109574934560889/toritorinomi.png",
        "image_name": "toritorinomi-raicho.png",
        "actor_path": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
        "fruit_link": "[[Tori Tori no Mi — Model Raicho]]",
    },
    {
        "file": "Buki Buki no Mi.md",
        "title": "Buki Buki no Mi",
        "owner": "[[Cerica Corvine]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107238442995712/bukibukinomi_-_Weapon_Weapon_Fruit.png",
        "image_name": "bukibukinomi.png",
        "actor_path": "World/Factions/Sixfold/Cerica Corvine.md",
        "fruit_link": "[[Buki Buki no Mi]]",
    },
    {
        "file": "Sumi Sumi no Mi.md",
        "title": "Sumi Sumi no Mi",
        "owner": "[[Daniel]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107529741471765/coal-coal.png",
        "image_name": "sumi-sumi-no-mi.png",
        "actor_path": "World/Factions/Spider Nest Pirates/Daniel.md",
        "fruit_link": "[[Sumi Sumi no Mi]]",
    },
    {
        "file": "Kaze Kaze no Mi.md",
        "title": "Kaze Kaze no Mi",
        "owner": "[[Mira the Unbreakable]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504552846853542079/Kaze_Kaze_no_Mi.png",
        "image_name": "kaze-kaze-no-mi.png",
        "actor_path": "World/Factions/Blackhand/Mira the Unbreakable.md",
        "fruit_link": "[[Kaze Kaze no Mi]]",
    },
    {
        "file": "Mera Mera no Mi.md",
        "title": "Mera Mera no Mi",
        "owner": "[[Commander Leon]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504554654464217281/Mera_Mera_No_Mi.png",
        "image_name": "mera-mera-no-mi.png",
        "actor_path": "World/Factions/Marines/Commander Leon.md",
        "fruit_link": "[[Mera Mera no Mi]]",
    },
    {
        "file": "Foji Foji no Mi.md",
        "title": "Fōji Fōji no Mi",
        "owner": "[[Tray]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504555156484915370/Foji_Foji_no_Mi.png",
        "image_name": "foji-foji-no-mi.png",
        "actor_path": "World/Factions/Blackhand/Tray.md",
        "fruit_link": "[[Foji Foji no Mi]]",
    },
    {
        "file": "Shire Shire no Mi.md",
        "title": "Shire Shire no Mi",
        "owner": "[[Rias]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504557753211949237/Shire_Shire_No_Mi.png",
        "image_name": "shire-shire-no-mi.png",
        "actor_path": "World/Factions/Motley Crew/Rias.md",
        "fruit_link": "[[Shire Shire no Mi]]",
    },
    {
        "file": "Meshi Meshi no Mi.md",
        "title": "Meshi Meshi no Mi",
        "owner": "[[Blackhand Cane]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504561051985907762/Meshi_Meshi_No_Mi.png",
        "image_name": "meshi-meshi-no-mi.png",
        "actor_path": "World/Factions/Blackhand/Blackhand Cane.md",
        "fruit_link": "[[Meshi Meshi no Mi]]",
    },
]

def create_fruit_note(fruit: dict) -> Path:
    path = VAULT / "Rules" / "Devil Fruits" / fruit["file"]
    if path.exists():
        return path
    download(fruit["image_url"], ATTACHMENTS / fruit["image_name"])
    body = f"""---
type:
  - Rules
publish: true
status: draft
sources:
  - "Discord/exports/devil-fruit-dex"
owner: "{fruit["owner"]}"
related_source:
  - "[[Chapter 6 Devil Fruits]]"
---

# {fruit["title"]}

**Owner:** {fruit["owner"]}

## Image Reference
![[Attachments/{fruit["image_name"]}]]
"""
    path.write_text(body, encoding="utf-8")
    return path

def add_fruit_to_role(text: str, fruit_link: str) -> str:
    if fruit_link.strip("[]") in text:
        return text
    role_match = re.search(r"(## Role\n\n)(.*?)(\n\n## )", text, re.DOTALL)
    if role_match:
        role_body = role_match.group(2).rstrip()
        if "Devil Fruit" not in role_body and "devil fruit" not in role_body.lower():
            role_body += f"\n\nDevil Fruit: {fruit_link}."
        return text[: role_match.start(2)] + role_body + text[role_match.end(2) :]
    return text

def main() -> None:
    ATTACHMENTS.mkdir(exist_ok=True)
    portraits = extract_attachments_full(EXPORTS / "character-art.md")
    bounties = extract_attachments_full(EXPORTS / "bounty-posters.md")

    updated_notes: set[Path] = set()
    downloaded = 0

    # Merge actor keys
    all_keys = set(portraits) | set(bounties)
    for key in sorted(all_keys):
        rel = ACTOR_PATHS.get(key)
        if not rel:
            continue
        note_path = VAULT / rel
        if not note_path.exists():
            print(f"SKIP missing note: {rel}")
            continue

        portrait_file = None
        bounty_file = None

        if key in portraits:
            url, orig = portraits[key]
            safe = f"{key}-portrait{Path(orig).suffix}"
            if download(url, ATTACHMENTS / safe):
                downloaded += 1
            portrait_file = safe

        if key in bounties:
            url, orig = bounties[key]
            safe = f"{key}-bounty{Path(orig).suffix}"
            if download(url, ATTACHMENTS / safe):
                downloaded += 1
            bounty_file = safe

        text = note_path.read_text(encoding="utf-8")
        orig_text = text
        if portrait_file:
            text = add_source(text, "character-art")
        if bounty_file:
            text = add_source(text, "bounty-posters")
        text = upsert_visuals(text, portrait_file, bounty_file)

        if text != orig_text:
            note_path.write_text(text, encoding="utf-8")
            updated_notes.add(note_path)
            print(f"UPDATED {rel}", flush=True)

    # Devil fruits
    new_fruits = []
    for fruit in DEVIL_FRUITS:
        path = create_fruit_note(fruit)
        if path.stat().st_mtime > 0:  # created or existed
            new_fruits.append(fruit["file"])
        actor = VAULT / fruit["actor_path"]
        if actor.exists():
            text = actor.read_text(encoding="utf-8")
            new_text = add_source(text, "devil-fruit-dex")
            new_text = add_fruit_to_role(new_text, fruit["fruit_link"])
            if new_text != text:
                actor.write_text(new_text, encoding="utf-8")
                updated_notes.add(actor)
                print(f"UPDATED fruit owner {fruit['actor_path']}")

    # Update Devil Fruits index
    index_path = VAULT / "Rules" / "Devil Fruits.md"
    index = index_path.read_text(encoding="utf-8")
    for fruit in DEVIL_FRUITS:
        link = fruit["fruit_link"]
        if link not in index:
            index = index.replace(
                "- [[Zaiko Zaiko No Mi]]",
                f"- {link} — {fruit['owner'].strip('[]')}\n- [[Zaiko Zaiko No Mi]]",
            )
    index_path.write_text(index, encoding="utf-8")

    print(f"\nDone: {len(updated_notes)} notes updated, {downloaded} images downloaded")
    print(f"New fruit notes: {[f['file'] for f in DEVIL_FRUITS]}")

if __name__ == "__main__":
    main()
