#!/usr/bin/env python3
"""Thorough Discord export sync: actors, Attachments/, Devil Fruits/."""

from __future__ import annotations

import re
import urllib.request
from pathlib import Path

VAULT = Path(__file__).resolve().parent.parent
ATTACHMENTS = VAULT / "Attachments"
EXPORTS = VAULT / "Discord" / "exports"
FRUITS_DIR = VAULT / "Devil Fruits"

ACTOR_PATHS: dict[str, str] = {
    "baptiste": "World/Factions/Blackhand/Lunarfolds/Baptiste.md",
    "roma": "World/Factions/Blackhand/Lunarfolds/Roma.md",
    "iron_beast_roma": "World/Factions/Blackhand/Lunarfolds/Roma.md",
    "malphas": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
    "tigor": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "cade_tigor_hunt": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "zim": "World/Factions/Blackhand/Lunarfolds/Zim.md",
    "linus": "World/Factions/Motley Crew/Linus Marrow.md",
    "linus_marrow": "World/Factions/Motley Crew/Linus Marrow.md",
    "serica": "World/Factions/Sixfold/Cerica Corvine.md",
    "veyl": "World/Factions/Sixfold/Veyl Corvine.md",
    "liz": "World/Factions/Sixfold/Liz.md",
    "guillotine_liz": "World/Factions/Sixfold/Liz.md",
    "mira": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "mira_the_unbreakable": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "mira_curr": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "tray": "World/Factions/Blackhand/Tray.md",
    "tray_caneheart": "World/Factions/Blackhand/Tray.md",
    "tray_the_viper": "World/Factions/Blackhand/Tray.md",
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
    "blackhand_cane": "World/Factions/Blackhand/Blackhand Cane.md",
    "cane": "World/Factions/Blackhand/Blackhand Cane.md",
    "tempest_thompson": "World/Factions/Blackhand/Tray.md",  # Thompson Caneheart — no note; skip below
    "thompson_caneheart": None,
    "ju_lee_caneheart": None,
}

SKIP_ACTOR_KEYS = {
    "bob",
    "deathknight_bob",
    "devilmask",
    "dravos",
    "droven",
    "jack",
    "alice",
    "vireth",
    "obsidian",
    "melina",
    "thompson_caneheart",
    "tempest_thompson",
    "ju_lee_caneheart",
}

PHEZU_POWER = """Allows the user to **become intangible** and pass through solid matter (walls, floors, objects, or attacks). Can control tangibility selectively — phasing only parts of the body. When phasing, the user blurs slightly like a mirage (not full invisibility).

**Combat:** Phantom Step (reposition through surfaces), Ghost Palm (phase hand through opponent), Phase Recoil (counter through attacks), Echo Phase (afterimage feints), Phase Cage (trap via partial solidification).

**Utility:** Silent Passage, Underground Extraction (allies through walls), Object Extraction, Phase Lock (weapons into walls).

**Weaknesses:** Haki bypasses phasing; seastone nullifies; continuous phasing drains stamina."""

SOKU_POWER = """**Speed-Speed Fruit** — enhances the user's movement speed dramatically. Campaign user: [[Veyl Corvine]] (Sixfold Page 6). Abilities at table to be expanded from session notes."""

ALL_FRUITS: list[dict] = [
    {
        "file": "Phezu Phezu no Mi.md",
        "title": "Phezu Phezu no Mi (Phase-Phase Fruit)",
        "owner": "[[Linus Marrow]]",
        "owner_path": "World/Factions/Motley Crew/Linus Marrow.md",
        "fruit_link": "[[Phezu Phezu no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1390210465048563765/PhasuPhasuNoMi_-_Phase_Phase_Fruit.webp",
        "image_name": "phezu-phezu-no-mi.webp",
        "power": PHEZU_POWER,
    },
    {
        "file": "Soku Soku no Mi.md",
        "title": "Soku Soku no Mi (Speed-Speed Fruit)",
        "owner": "[[Veyl Corvine]]",
        "owner_path": "World/Factions/Sixfold/Veyl Corvine.md",
        "fruit_link": "[[Soku Soku no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426108606335422485/sokusokunomi_-_Speed_Speed_Fruit.png",
        "image_name": "soku-soku-no-mi.png",
        "power": SOKU_POWER,
        "overwrite": True,
    },
    {
        "file": "Yuki Yuki no Mi — Model Yeti.md",
        "title": "Yuki Yuki no Mi — Model: Yeti",
        "owner": "[[Roma]]",
        "owner_path": "World/Factions/Blackhand/Lunarfolds/Roma.md",
        "fruit_link": "[[Yuki Yuki no Mi — Model Yeti]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1390210465635897515/yukiyukinomi_-_Yeti_Yeti_Fruit.png",
        "image_name": "yukiyukinomi-yeti.png",
        "power": "Logia-type snow fruit; **Model: Yeti** grants ice/snow manipulation and yeti transformation. Roma uses frost powers he has yet to fully master.",
    },
    {
        "file": "Uchu Uchu no Mi.md",
        "title": "Uchu Uchu no Mi",
        "owner": "[[Baptiste]]",
        "owner_path": "World/Factions/Blackhand/Lunarfolds/Baptiste.md",
        "fruit_link": "[[Uchu Uchu no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107809069793290/uhuuchunomi-2.png",
        "image_name": "uchu-uchu-no-mi.png",
        "power": "Space-themed paramecia (campaign homebrew). Baptiste's primary fruit per Discord dex (supersedes early \"unnamed fruit\" listing).",
    },
    {
        "file": "Ame Ame no Mi.md",
        "title": "Ame Ame no Mi (Rain-Rain Fruit)",
        "owner": "[[Sora]]",
        "owner_path": None,
        "fruit_link": "[[Ame Ame no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1390210656124272652/ameamenomi.png",
        "image_name": "ame-ame-no-mi.png",
        "power": "Rain manipulation (campaign homebrew). Former PC fruit; owner now NPC [[Sora]] — no vault actor page yet.",
    },
    {
        "file": "Hai Hai no Mi.md",
        "title": "Hai Hai no Mi (Ash-Ash Fruit)",
        "owner": "[[Malak Samum]]",
        "owner_path": None,
        "fruit_link": "[[Hai Hai no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426106870879354901/Ash_Ash_Devil_Fruit_Full_Design.jpg",
        "image_name": "hai-hai-no-mi.jpg",
        "power": "Ash manipulation. Doctor of the Braveheart Pirates — no vault actor page yet.",
    },
    {
        "file": "Buki Buki no Mi.md",
        "title": "Buki Buki no Mi (Weapon-Weapon Fruit)",
        "owner": "[[Cerica Corvine]]",
        "owner_path": "World/Factions/Sixfold/Cerica Corvine.md",
        "fruit_link": "[[Buki Buki no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107238442995712/bukibukinomi_-_Weapon_Weapon_Fruit.png",
        "image_name": "bukibukinomi.png",
        "power": "Transforms body parts into weapons. Discord notes later ownership by Baby5 (canon reference); campaign owner: Serica/Cerica Corvine.",
    },
    {
        "file": "Sumi Sumi no Mi.md",
        "title": "Sumi Sumi no Mi (Charcoal-Charcoal Fruit)",
        "owner": "[[Daniel]]",
        "owner_path": "World/Factions/Spider Nest Pirates/Daniel.md",
        "fruit_link": "[[Sumi Sumi no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426107529741471765/coal-coal.png",
        "image_name": "sumi-sumi-no-mi.png",
        "power": "Charcoal/coal manipulation. Daniel Tideborn (Spider Nest Pirates).",
    },
    {
        "file": "Suraimu Suraimu no Mi.md",
        "title": "Suraimu Suraimu no Mi (Slime-Slime Fruit)",
        "owner": "[[Droven Calligos]]",
        "owner_path": None,
        "fruit_link": "[[Suraimu Suraimu no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426108495329230848/Suraimu_Suraimu_no_Mi.webp",
        "image_name": "suraimu-suraimu-no-mi.webp",
        "power": "Slime body manipulation. Blackhand 2nd Fleet — no vault actor page (Discord: Droven \"Remnant\" Calligos).",
    },
    {
        "file": "Toneru Toneru no Mi.md",
        "title": "Toneru Toneru no Mi (Teleport-Teleport Fruit)",
        "owner": "[[Dravos]]",
        "owner_path": None,
        "fruit_link": "[[Toneru Toneru no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426108722685411379/Toneru_Toneru_no_Mi.png",
        "image_name": "toneru-toneru-no-mi.png",
        "power": "Short-range teleportation. Gentle Giant Pirates navigator — no vault actor page yet.",
    },
    {
        "file": "Tori Tori no Mi — Model Raicho.md",
        "title": "Tori Tori no Mi — Model: Raichō (Thunder Bird)",
        "owner": "[[Malphas]]",
        "owner_path": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
        "fruit_link": "[[Tori Tori no Mi — Model Raicho]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426109574934560889/toritorinomi.png",
        "image_name": "toritorinomi-raicho.png",
        "power": "Zoan bird transformation — thunderbird (raichō) model.",
    },
    {
        "file": "Unknown Devil Fruit — Party 1.md",
        "title": "Unknown Devil Fruit (Party 1 puzzle box)",
        "owner": "Party 1 (unclaimed)",
        "owner_path": None,
        "fruit_link": "[[Unknown Devil Fruit — Party 1]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1426109101724930048/puzzle-box.png",
        "image_name": "unknown-devil-fruit-puzzle-box.png",
        "power": "Unidentified fruit sealed in a puzzle box; held by Party 1 when last noted in Discord dex.",
    },
    {
        "file": "Tori Tori no Mi — Model Sparrow.md",
        "title": "Tori Tori no Mi — Model: Sparrow",
        "owner": "[[Jack S. Parrow]]",
        "owner_path": None,
        "fruit_link": "[[Tori Tori no Mi — Model Sparrow]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504553329005559828/gMpCccYSlkZqgAAAABJRU5ErkJggg.png",
        "image_name": "tori-tori-sparrow.png",
        "power": "Zoan sparrow transformation. Captain of the High Roost Pirates — no vault actor page yet.",
    },
    {
        "file": "Kaze Kaze no Mi.md",
        "title": "Kaze Kaze no Mi (Wind-Wind Fruit)",
        "owner": "[[Mira the Unbreakable]]",
        "owner_path": "World/Factions/Blackhand/Mira the Unbreakable.md",
        "fruit_link": "[[Kaze Kaze no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504552846853542079/Kaze_Kaze_no_Mi.png",
        "image_name": "kaze-kaze-no-mi.png",
        "power": "Wind manipulation. Blackhand 4th Fleet Commander.",
    },
    {
        "file": "Mera Mera no Mi.md",
        "title": "Mera Mera no Mi (Flame-Flame Fruit)",
        "owner": "[[Commander Leon]]",
        "owner_path": "World/Factions/Marines/Commander Leon.md",
        "fruit_link": "[[Mera Mera no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504554654464217281/Mera_Mera_No_Mi.png",
        "image_name": "mera-mera-no-mi.png",
        "power": "Logia flame generation and transformation.",
    },
    {
        "file": "Foji Foji no Mi.md",
        "title": "Fōji Fōji no Mi",
        "owner": "[[Tray]]",
        "owner_path": "World/Factions/Blackhand/Tray.md",
        "fruit_link": "[[Foji Foji no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504555156484915370/Foji_Foji_no_Mi.png",
        "image_name": "foji-foji-no-mi.png",
        "power": "Campaign homebrew fruit (Forge-related paramecia per naming). Braveheart / Blackhand deckhand Tray Caneheart.",
    },
    {
        "file": "Kobu Kobu no Mi.md",
        "title": "Kobu Kobu no Mi (Fist-Fist Fruit)",
        "owner": "[[Gin Guiseppi]]",
        "owner_path": None,
        "fruit_link": "[[Kobu Kobu no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504555441898782801/Kobu_Kobu_no_Mi.png",
        "image_name": "kobu-kobu-no-mi.png",
        "power": "Motivational fist enhancement (canon-style). Guiseppi Family — no vault actor pages yet.",
    },
    {
        "file": "Kamo Kamo no Mi.md",
        "title": "Kamo Kamo no Mi (Duck-Duck Fruit)",
        "owner": "[[Vodka Guiseppi]]",
        "owner_path": None,
        "fruit_link": "[[Kamo Kamo no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504555939435642941/Kamo_Kamo_No_Mi.png",
        "image_name": "kamo-kamo-no-mi.png",
        "power": "Partial duck transformation. Guiseppi Family — no vault actor page yet.",
    },
    {
        "file": "Sumi Sumi no Mi — Rhum Guiseppi.md",
        "title": "Sumi Sumi no Mi (Rhum Guiseppi)",
        "owner": "[[Rhum Guiseppi]]",
        "owner_path": None,
        "fruit_link": "[[Sumi Sumi no Mi — Rhum Guiseppi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504556355573518477/Sumi_Sumi_No_Mi.png",
        "image_name": "sumi-sumi-rhum-guiseppi.png",
        "power": "Second Sumi Sumi user in campaign (charcoal fruit). Rhum Guiseppi — twin of Rum; no vault actor page yet.",
    },
    {
        "file": "Peto Peto no Mi.md",
        "title": "Peto Peto no Mi",
        "owner": "[[Ju Lee Caneheart]]",
        "owner_path": None,
        "fruit_link": "[[Peto Peto no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504556966272565340/Peto_Peto_no_Mi.png",
        "image_name": "peto-peto-no-mi.png",
        "power": "Campaign homebrew. Mascot of the Braveheart Pirates — no vault actor page yet.",
    },
    {
        "file": "Shire Shire no Mi.md",
        "title": "Shire Shire no Mi",
        "owner": "[[Rias]]",
        "owner_path": "World/Factions/Motley Crew/Rias.md",
        "fruit_link": "[[Shire Shire no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504557753211949237/Shire_Shire_No_Mi.png",
        "image_name": "shire-shire-no-mi.png",
        "power": "Campaign homebrew. Listed owner in dex: Rias Decibel (Motley Crew / Decibella Revolutionary ties).",
    },
    {
        "file": "Dabu Dabu no Mi.md",
        "title": "Dabu Dabu no Mi",
        "owner": "[[Irik Fen]]",
        "owner_path": None,
        "fruit_link": "[[Dabu Dabu no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504558764068442152/Dabu_Dabu_No_Mi.png",
        "image_name": "dabu-dabu-no-mi.png",
        "power": "Campaign homebrew. SharkFin Pirates — no vault actor page yet.",
    },
    {
        "file": "Fura Fura no Mi.md",
        "title": "Fura Fura no Mi (Float-Float Fruit)",
        "owner": "[[Rythm Echo]]",
        "owner_path": None,
        "fruit_link": "[[Fura Fura no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504559958597959740/Fura_Fura_No_Mi.png",
        "image_name": "fura-fura-no-mi.png",
        "power": "Gravity nullification / floating. Soundless Five No. 3 — no vault actor page yet (Discord spelling: Rythm Echo).",
    },
    {
        "file": "Meshi Meshi no Mi.md",
        "title": "Meshi Meshi no Mi",
        "owner": "[[Blackhand Cane]]",
        "owner_path": "World/Factions/Blackhand/Blackhand Cane.md",
        "fruit_link": "[[Meshi Meshi no Mi]]",
        "image_url": "https://cdn.discordapp.com/attachments/1382564751527251968/1504561051985907762/Meshi_Meshi_No_Mi.png",
        "image_name": "meshi-meshi-no-mi.png",
        "power": "Food/meal-related paramecia (campaign homebrew). Blackhand organization captain.",
    },
]


def norm_stem(name: str) -> str:
    s = Path(name).stem.lower()
    s = re.sub(r"^spoiler_", "", s)
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s


def actor_key_from_filename(filename: str) -> str | None:
    stem = norm_stem(filename)
    if stem in SKIP_ACTOR_KEYS:
        return None
    if stem in ACTOR_PATHS:
        val = ACTOR_PATHS[stem]
        return stem if val else None
    for key, val in ACTOR_PATHS.items():
        if val and (key in stem or stem in key):
            return key
    return None


URL_RE = re.compile(r"\((https://cdn\.discordapp\.com/attachments/[^)]+)\)")


def extract_attachments_full(export_path: Path) -> dict[str, tuple[str, str]]:
    text = export_path.read_text(encoding="utf-8")
    mapping: dict[str, tuple[str, str]] = {}
    for line in text.splitlines():
        for match in URL_RE.finditer(line):
            url = match.group(1)
            filename = url.split("?")[0].rsplit("/", 1)[-1]
            key = actor_key_from_filename(filename)
            if key and ACTOR_PATHS.get(key):
                mapping[key] = (url, filename)
    return mapping


def download(url: str, dest: Path) -> bool:
    if dest.exists():
        return False
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": "blood-brine-vault-sync/2.0"})
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
        fm = fm.rstrip() + f'\nsources:\n  - "Discord/exports/{source}"'
    return f"---{fm}\n---" + text[end + 4 :]


def upsert_visuals(text: str, portrait: str | None, bounty: str | None) -> str:
    existing_portrait = None
    existing_bounty = None
    if "## Visuals" in text:
        m = re.search(r"!\[\[Attachments/([^|\]]+)(?:\|Portrait)?\]\]", text)
        if m and "portrait" in m.group(1).lower():
            existing_portrait = m.group(1)
        m2 = re.search(r"!\[\[Attachments/([^|\]]+)(?:\|Bounty poster)?\]\]", text)
        for line in text.splitlines():
            if "Bounty poster" in line and "Attachments/" in line:
                existing_bounty = re.search(r"Attachments/([^|\]]+)", line).group(1)

    portrait = portrait or existing_portrait
    bounty = bounty or existing_bounty

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

    if text.startswith("---"):
        end = text.index("\n---", 3) + 4
        rest = text[end:].lstrip("\n")
        return text[:end] + "\n" + block + rest
    return block + text


def add_fruit_to_role(text: str, fruit_link: str) -> str:
    title = fruit_link.strip("[]")
    if title in text and "Devil Fruit:" in text:
        # Replace wrong fruit reference if present
        text = re.sub(
            r"Devil Fruit:.*?(?=\n\n|\n## |\Z)",
            f"Devil Fruit: {fruit_link}.",
            text,
            count=1,
            flags=re.DOTALL,
        )
        return text
    if title in text:
        return text
    role_match = re.search(r"(## Role\n\n)(.*?)(\n\n## )", text, re.DOTALL)
    if role_match:
        role_body = role_match.group(2).rstrip()
        if "Devil Fruit" not in role_body and "devil fruit" not in role_body.lower():
            role_body += f"\n\nDevil Fruit: {fruit_link}."
        else:
            role_body = re.sub(
                r"Devil Fruit:.*",
                f"Devil Fruit: {fruit_link}.",
                role_body,
            )
        return text[: role_match.start(2)] + role_body + text[role_match.end(2) :]
    return text


def fruit_note_body(fruit: dict) -> str:
    return f"""---
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

**Current owner:** {fruit["owner"]}

## Image

![[Attachments/{fruit["image_name"]}]]

## Power

{fruit["power"]}
"""


def upsert_fruit_note(fruit: dict) -> tuple[Path, bool]:
    path = FRUITS_DIR / fruit["file"]
    download(fruit["image_url"], ATTACHMENTS / fruit["image_name"])
    created = not path.exists()
    if created or fruit.get("overwrite"):
        path.write_text(fruit_note_body(fruit), encoding="utf-8")
        return path, created
    text = path.read_text(encoding="utf-8")
    new_body = fruit_note_body(fruit)
    if "## Power" not in text:
        path.write_text(new_body, encoding="utf-8")
        return path, False
    # Enrich missing sections only
    if "**Current owner:**" not in text and "**Owner:**" in text:
        text = text.replace("**Owner:**", "**Current owner:**")
    if "## Power" not in text:
        power_block = f"\n\n## Power\n\n{fruit['power']}\n"
        if "## Image Reference" in text:
            text = text.replace("## Image Reference", "## Image").replace(
                f"![[Attachments/{fruit['image_name']}]]",
                f"![[Attachments/{fruit['image_name']}]]",
            )
        text = text.rstrip() + power_block
        path.write_text(text, encoding="utf-8")
    return path, created


def rebuild_devil_fruits_hub() -> None:
    hub = VAULT / "Devil Fruits" / "Devil Fruits.md"
    lines = [
        "---",
        "publish: true",
        "status: draft",
        "---",
        "",
        "# Devil Fruits",
        "",
        "Campaign devil fruit registry — image, power, and current owner. Discord quarry: [[Discord/exports/devil-fruit-dex]]. Supplement rules: `source/Chapter 6 Devil Fruits/`.",
        "",
        "Legacy Campaign 1: [[Fusion Fusion Fruit]] — Ronan; see `Characters/Archive/Campaign 1/` if present.",
        "",
        "## Registry",
        "",
    ]
    for fruit in ALL_FRUITS:
        owner_plain = fruit["owner"].strip("[]")
        lines.append(f"- {fruit['fruit_link']} — {owner_plain}")
    lines.extend(
        [
            "",
            "Also documented (pre-Discord sync): [[Zaiko Zaiko No Mi]]",
            "",
            "Inventions (non-fruits): [[Rules/Inventions|Inventions folder]].",
        ]
    )
    hub.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    FRUITS_DIR.mkdir(parents=True, exist_ok=True)
    ATTACHMENTS.mkdir(exist_ok=True)

    portraits = extract_attachments_full(EXPORTS / "character-art.md")
    bounties = extract_attachments_full(EXPORTS / "bounty-posters.md")

    updated_notes: set[Path] = set()
    downloaded = 0
    pc_count = 0
    npc_count = 0

    LUNARFOLDS = {
        "baptiste",
        "roma",
        "malphas",
        "tigor",
        "cade_tigor_hunt",
        "zim",
        "linus",
        "linus_marrow",
    }

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
            safe = f"{key.replace('_marrow', '')}-portrait{Path(orig).suffix}"
            if key == "linus_marrow":
                safe = f"linus_marrow-portrait{Path(orig).suffix}"
            elif key == "cade_tigor_hunt":
                safe = f"cade_tigor_hunt-portrait{Path(orig).suffix}"
            elif key == "fenris_wolfblood":
                safe = f"fenris_wolfblood-portrait{Path(orig).suffix}"
            elif key == "graff_boltt":
                safe = f"graff_boltt-portrait{Path(orig).suffix}"
            elif key == "tray_caneheart":
                safe = f"tray_caneheart-portrait{Path(orig).suffix}"
            if download(url, ATTACHMENTS / safe):
                downloaded += 1
            portrait_file = safe

        if key in bounties:
            url, orig = bounties[key]
            safe = f"{key.replace('_marrow', '')}-bounty{Path(orig).suffix}"
            if key == "linus_marrow":
                safe = f"linus-bounty{Path(orig).suffix}"
            elif key == "cade_tigor_hunt" or key == "tigor":
                safe = f"tigor-bounty{Path(orig).suffix}"
            elif key == "tray_caneheart" or key == "tray_the_viper":
                safe = f"tray-bounty{Path(orig).suffix}"
            elif key == "mira_the_unbreakable":
                safe = f"mira-bounty{Path(orig).suffix}"
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
            if key in LUNARFOLDS or "Lunarfolds" in rel:
                pc_count += 1
            else:
                npc_count += 1
            print(f"UPDATED actor {rel}", flush=True)

    fruits_created = 0
    fruits_updated = 0
    for fruit in ALL_FRUITS:
        path, created = upsert_fruit_note(fruit)
        if created:
            fruits_created += 1
            print(f"CREATED fruit {fruit['file']}", flush=True)
        else:
            fruits_updated += 1
            print(f"UPDATED fruit {fruit['file']}", flush=True)

        if fruit.get("owner_path"):
            actor = VAULT / fruit["owner_path"]
            if actor.exists():
                text = actor.read_text(encoding="utf-8")
                new_text = add_source(text, "devil-fruit-dex")
                new_text = add_fruit_to_role(new_text, fruit["fruit_link"])
                if new_text != text:
                    actor.write_text(new_text, encoding="utf-8")
                    updated_notes.add(actor)
                    print(f"UPDATED fruit owner {fruit['owner_path']}", flush=True)

    rebuild_devil_fruits_hub()

    # Fix Roma specifically — replace vague ice-type text
    roma_path = VAULT / ACTOR_PATHS["roma"]
    if roma_path.exists():
        roma = roma_path.read_text(encoding="utf-8")
        new_roma = roma.replace(
            "Devil Fruit user — ate an ice-type fruit that grants frost powers he has yet to fully master.",
            "Devil Fruit: [[Yuki Yuki no Mi — Model Yeti]]. Frost powers not yet fully mastered.",
        )
        if new_roma != roma:
            roma_path.write_text(new_roma, encoding="utf-8")
            updated_notes.add(roma_path)

    # Fix Linus fruit link
    linus_path = VAULT / ACTOR_PATHS["linus_marrow"]
    if linus_path.exists():
        linus = linus_path.read_text(encoding="utf-8")
        new_linus = linus.replace(
            "Devil Fruit: Phezu-Phezu (phase); campaign write-up at [[Soku Soku no Mi]].",
            "Devil Fruit: [[Phezu Phezu no Mi]].",
        )
        if new_linus != linus:
            linus_path.write_text(new_linus, encoding="utf-8")
            updated_notes.add(linus_path)

    print(
        f"\nDone: {len(updated_notes)} notes touched, {downloaded} images downloaded, "
        f"{fruits_created} fruits created, {fruits_updated} fruits updated/enriched"
    )


if __name__ == "__main__":
    main()
