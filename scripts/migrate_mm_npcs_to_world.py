#!/usr/bin/env python3
"""One-time migration: Monster Manual named NPCs → World/Factions (Phase B2)."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

VAULT = Path(__file__).resolve().parents[1]
MM = VAULT / "Monster Manual"

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
LIVE_SECTION_RE = re.compile(
    r"\n## Live sheet \(Foundry\)\n.*?(?=\n## |\n### |\Z)",
    re.DOTALL,
)

KEEP = {
    "Aberrant Abomination.md",
    "Ashscale Basilisk.md",
    "Bandit.md",
    "Berserker.md",
    "Carrion Stalker.md",
    "Carrion Vulture.md",
    "Cave Render.md",
    "Chicken.md",
    "Crystalback Scorpion.md",
    "FarmBull.md",
    "FarmPig.md",
    "Giant Boar.md",
    "Giant Crab.md",
    "Giant Crocodile.md",
    "Guard.md",
    "Homunculus Servant.md",
    "Lamprey Horror.md",
    "Mafia Grunt.md",
    "Panther.md",
    "Pump-Up Pirate.md",
    "Puppy.md",
    "Ravine Scylla.md",
    "Red Maw Beast.md",
    "Riding Horse.md",
    "River Serpent.md",
    "Saber-Toothed Tiger.md",
    "Smiling Watcher.md",
    "Stitched Horror.md",
    "Swarm of Quippers.md",
    "Titan Ape.md",
    "_index.md",
}

# mm filename -> destination relative path
MOVE: dict[str, str] = {
    "Aegir (Control).md": "World/Factions/Aegir/Aegir (Control).md",
    "Aegir (Dominian).md": "World/Factions/Aegir/Aegir (Dominian).md",
    "Arno Capone.md": "World/Factions/Royal Flush Gang/Arno Capone.md",
    "Bass Tremor.md": "World/Factions/Tremor/Bass Tremor.md",
    "Chuckles.md": "World/Factions/Soundless 5/Chuckles.md",
    "Drez Crown, Captain of G-45.md": "World/Factions/Marines/Drez Crown, Captain of G-45.md",
    "Giggles.md": "World/Factions/Soundless 5/Giggles.md",
    "Irik -Two-Tide- Fen.md": "World/Factions/Sharkfin Pirates/Irik -Two-Tide- Fen.md",
    "Jazmine.md": "World/Factions/Blackhand/Lunarfolds/Jazmine.md",
    "Joe -Mitchblade- Mitch.md": "World/Factions/Sharkfin Pirates/Joe -Mitchblade- Mitch.md",
    "Kara -Many-Eyes- Kagemi.md": "World/Factions/Unaffiliated/Kara -Many-Eyes- Kagemi.md",
    "King.md": "World/Factions/Royal Flush Gang/King.md",
    "Luna Bass.md": "World/Factions/Unknown/Luna Bass.md",
    "Luu.md": "World/Factions/Blackhand/Lunarfolds/Luu.md",
    "Maro -Powderflash- Kel.md": "World/Factions/Unaffiliated/Maro -Powderflash- Kel.md",
    "Merlin.md": "World/Factions/Blackhand/Lunarfolds/Merlin.md",
    "Pegasus.md": "World/Factions/Blackhand/Lunarfolds/Pegasus.md",
    "Queen.md": "World/Factions/Royal Flush Gang/Queen.md",
    "Rolan -Redwake- Marris.md": "World/Factions/Sharkfin Pirates/Rolan -Redwake- Marris.md",
    "Saeva -Longcast- Virell.md": "World/Factions/Sharkfin Pirates/Saeva -Longcast- Virell.md",
    "Simon Tideborn.md": "World/Factions/Spider Nest Pirates/Simon The One Armed Tyrant.md",
    "Sloan.md": "World/Factions/Decibella Revolutionary/Sloan.md",
    "Snickers.md": "World/Factions/Soundless 5/Snickers.md",
    "Tariq Solen.md": "World/Factions/Sand Rats/Tariq Solen.md",
    "Vesper.md": "World/Factions/Shadow Guild/Vesper.md",
    "Wheeze.md": "World/Factions/Soundless 5/Wheeze.md",
    "Zara Tideborn.md": "World/Factions/Spider Nest Pirates/Zara Tideborn.md",
}

# mm filename -> (target, optional subsection title for live block)
MERGE: dict[str, tuple[str, str | None]] = {
    "Cade -Tigor- Hunt.md": (
        "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
        '### Cade "Tigor" Hunt (alternate Foundry sheet)',
    ),
    "Chime.md": (
        "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
        "### Chime (deer companion)",
    ),
    "Jingle.md": (
        "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
        "### Jingle (deer companion)",
    ),
    "Crunch.md": (
        "World/Factions/Blackhand/Braveheart Pirates/Ju Lee Caneheart.md",
        "### Crunch (sea beast pet)",
    ),
    "Vex.md": (
        "World/Factions/Blackhand/⚔️ Fenris Wolfblood — “The Blood of Sun and Shadow”.md",
        "### Vex (companion monkey)",
    ),
    "Mikey.md": (
        "World/Factions/Velencruz/Morrow.md",
        "### Mikey (untransformed)",
    ),
}

FACTION_META: dict[str, tuple[str, str]] = {
    "World/Factions/Aegir/Aegir (Control).md": ("actor", "[[Aegir]]"),
    "World/Factions/Aegir/Aegir (Dominian).md": ("actor", "[[Aegir]]"),
    "World/Factions/Tremor/Bass Tremor.md": ("actor", "[[Tremor]]"),
    "World/Factions/Soundless 5/Chuckles.md": ("actor", "[[Soundless 5]]"),
    "World/Factions/Soundless 5/Giggles.md": ("actor", "[[Soundless 5]]"),
    "World/Factions/Soundless 5/Snickers.md": ("actor", "[[Soundless 5]]"),
    "World/Factions/Soundless 5/Wheeze.md": ("actor", "[[Soundless 5]]"),
    "World/Factions/Marines/Drez Crown, Captain of G-45.md": ("actor", "[[Marines]]"),
    "World/Factions/Sharkfin Pirates/Irik -Two-Tide- Fen.md": ("actor", "[[Sharkfin Pirates]]"),
    "World/Factions/Sharkfin Pirates/Joe -Mitchblade- Mitch.md": ("actor", "[[Sharkfin Pirates]]"),
    "World/Factions/Sharkfin Pirates/Rolan -Redwake- Marris.md": ("actor", "[[Sharkfin Pirates]]"),
    "World/Factions/Sharkfin Pirates/Saeva -Longcast- Virell.md": ("actor", "[[Sharkfin Pirates]]"),
    "World/Factions/Blackhand/Lunarfolds/Jazmine.md": ("actor", "[[Lunarfolds]]"),
    "World/Factions/Blackhand/Lunarfolds/Luu.md": ("actor", "[[Lunarfolds]]"),
    "World/Factions/Blackhand/Lunarfolds/Merlin.md": ("actor", "[[Lunarfolds]]"),
    "World/Factions/Blackhand/Lunarfolds/Pegasus.md": ("actor", "[[Lunarfolds]]"),
    "World/Factions/Unaffiliated/Kara -Many-Eyes- Kagemi.md": ("actor", "Unaffiliated"),
    "World/Factions/Unaffiliated/Maro -Powderflash- Kel.md": ("actor", "Unaffiliated"),
    "World/Factions/Royal Flush Gang/Arno Capone.md": ("actor", "[[Royal Flush Gang]]"),
    "World/Factions/Royal Flush Gang/King.md": ("actor", "[[Royal Flush Gang]]"),
    "World/Factions/Royal Flush Gang/Queen.md": ("actor", "[[Royal Flush Gang]]"),
    "World/Factions/Unknown/Luna Bass.md": ("actor", "[[Unknown]]"),
    "World/Factions/Decibella Revolutionary/Sloan.md": ("actor", "[[Decibella Revolutionary]]"),
    "World/Factions/Sand Rats/Tariq Solen.md": ("actor", "[[Sand Rats]]"),
    "World/Factions/Shadow Guild/Vesper.md": ("actor", "[[Shadow Guild]]"),
    "World/Factions/Spider Nest Pirates/Zara Tideborn.md": ("actor", "[[Spider Nest Pirates]]"),
    "World/Factions/Velencruz/Morrow.md": ("actor", "[[Velencruz]]"),
}


def parse_frontmatter(text: str) -> tuple[str, dict[str, str]]:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return "", {}
    block = m.group(0)
    fm: dict[str, str] = {}
    for line in block.splitlines()[1:-1]:
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"')
    return block, fm


def extract_live_section(text: str) -> str:
    m = LIVE_SECTION_RE.search(text)
    return m.group(0).strip() if m else ""


def strip_live_section(text: str) -> str:
    return LIVE_SECTION_RE.sub("", text).rstrip()


def build_frontmatter(
    fm: dict[str, str],
    dest_rel: str,
    *,
    actor_type: str = "actor",
    faction: str | None = None,
) -> str:
    actor_id = fm.get("foundry_actor_id", "")
    slug = fm.get("foundry_live_slug", "")
    faction_line = f'faction: "{faction}"\n' if faction else ""
    return (
        "---\n"
        f"type: {actor_type}\n"
        f"{faction_line}"
        "status: draft\n"
        "publish: true\n"
        f'foundry_actor_id: "{actor_id}"\n'
        f'foundry_live_slug: "{slug}"\n'
        "---\n"
    )


def title_from_mm(text: str, mm_path: Path) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return mm_path.stem


def body_stub(title: str, faction_link: str | None) -> str:
    related = f"- {faction_link}\n" if faction_link else ""
    return (
        f"# {title}\n\n"
        "## Description\n\n"
        "*(Details TBD)*\n\n"
        "## Role\n\n"
        "*(Details TBD)*\n\n"
        "## Related\n\n"
        f"{related}"
    )


def move_mm_to_world(mm_path: Path, dest_rel: str) -> None:
    dest = VAULT / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    text = mm_path.read_text(encoding="utf-8")
    _, fm = parse_frontmatter(text)
    live = extract_live_section(text)
    title = title_from_mm(text, mm_path)
    meta = FACTION_META.get(dest_rel, ("actor", None))
    faction = meta[1]

    if dest.exists() and dest_rel.endswith("Simon The One Armed Tyrant.md"):
        body = strip_live_section(dest.read_text(encoding="utf-8"))
        if fm.get("foundry_actor_id"):
            body = re.sub(
                r"^foundry_actor_id:.*\n",
                f'foundry_actor_id: "{fm["foundry_actor_id"]}"\n',
                body,
                count=1,
                flags=re.MULTILINE,
            )
            if "foundry_live_slug" not in body and fm.get("foundry_live_slug"):
                body = body.replace(
                    "---\n",
                    f'---\nfoundry_live_slug: "{fm["foundry_live_slug"]}"\n',
                    1,
                )
        dest.write_text(body.rstrip() + "\n\n" + live + "\n", encoding="utf-8")
    elif dest.exists():
        body = strip_live_section(dest.read_text(encoding="utf-8"))
        dest.write_text(body.rstrip() + "\n\n" + live + "\n", encoding="utf-8")
    else:
        head = build_frontmatter(fm, dest_rel, faction=faction)
        body = body_stub(title, faction)
        dest.write_text(head + body + "\n" + live + "\n", encoding="utf-8")

    mm_path.unlink()
    print(f"  MOVE {mm_path.name} -> {dest_rel}")


def merge_mm_into(mm_path: Path, dest_rel: str, subsection: str | None) -> None:
    dest = VAULT / dest_rel
    if not dest.is_file():
        raise FileNotFoundError(f"merge target missing: {dest_rel}")
    text = mm_path.read_text(encoding="utf-8")
    _, fm = parse_frontmatter(text)
    live = extract_live_section(text)
    if subsection and live:
        live = live.replace("## Live sheet (Foundry)", subsection, 1)

    body = strip_live_section(dest.read_text(encoding="utf-8"))

    # First merge with alt id on Cade / Morrow
    if mm_path.name == "Cade -Tigor- Hunt.md" and fm.get("foundry_actor_id"):
        if "foundry_actor_id_alt:" not in body:
            body = body.replace(
                "---\n",
                f'---\nfoundry_actor_id_alt: "{fm["foundry_actor_id"]}"\n',
                1,
            )
    if mm_path.name == "Mikey.md" and fm.get("foundry_actor_id"):
        if "foundry_actor_id_alt:" not in body:
            body = body.replace(
                "---\n",
                f'---\nfoundry_actor_id_alt: "{fm["foundry_actor_id"]}"\n',
                1,
            )

    dest.write_text(body.rstrip() + "\n\n" + live + "\n", encoding="utf-8")
    mm_path.unlink()
    print(f"  MERGE {mm_path.name} -> {dest_rel}", flush=True)


def create_velencruz_morrow() -> None:
    mm_morrow = MM / "Morrow.md"
    if not mm_morrow.is_file():
        return
    dest_rel = "World/Factions/Velencruz/Morrow.md"
    dest = VAULT / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    text = mm_morrow.read_text(encoding="utf-8")
    _, fm = parse_frontmatter(text)
    live = extract_live_section(text)
    head = build_frontmatter(fm, dest_rel, faction="[[Velencruz]]")
    body = (
        "# Morrow\n\n"
        "## Description\n\n"
        "Velencruz operative. Uses the **DevilMask** disguise (see [[🗡️ Goru Yamashita (formerly Goru Valencruz)]]).\n\n"
        "## Role\n\n"
        "House Velencruz agent.\n\n"
        "## Related\n\n"
        "- [[Velencruz]]\n"
        "- [[🗡️ Goru Yamashita (formerly Goru Valencruz)]]\n"
    )
    dest.write_text(head + body + "\n" + live + "\n", encoding="utf-8")
    mm_morrow.unlink()
    print(f"  CREATE {dest_rel} (from Morrow.md)")


def split_luna_coda() -> None:
    mm_path = MM / "Luna Coda.md"
    if not mm_path.is_file():
        return
    text = mm_path.read_text(encoding="utf-8")
    _, fm = parse_frontmatter(text)
    live = extract_live_section(text)

    # Current file links to Coda actor (TlGLB1hk)
    coda_dest = VAULT / "World/Factions/Unknown/Coda.md"
    coda_dest.parent.mkdir(parents=True, exist_ok=True)
    coda_fm = dict(fm)
    coda_head = build_frontmatter(coda_fm, "World/Factions/Unknown/Coda.md", faction="[[Unknown]]")
    coda_body = (
        "# Coda\n\n"
        "## Description\n\n"
        "*(Lore TBD — distinct from [[Luna Coda]].)*\n\n"
        "## Related\n\n"
        "- [[Unknown]]\n"
        "- [[Luna Coda]]\n"
    )
    coda_dest.write_text(coda_head + coda_body + "\n" + live + "\n", encoding="utf-8")
    print("  SPLIT Luna Coda.md -> World/Factions/Unknown/Coda.md")

    luna_dest = VAULT / "World/Factions/Unknown/Luna Coda.md"
    luna_head = (
        "---\n"
        "type: actor\n"
        'faction: "[[Unknown]]"\n'
        "status: draft\n"
        "publish: true\n"
        'foundry_actor_id: "MT8fwqGzW17ZpITW"\n'
        'foundry_live_slug: "luna-coda"\n'
        "---\n"
    )
    luna_body = (
        "# Luna Coda\n\n"
        "## Description\n\n"
        "*(Lore TBD.)*\n\n"
        "## Related\n\n"
        "- [[Unknown]]\n"
        "- [[Coda]]\n"
    )
    luna_dest.write_text(luna_head + luna_body + "\n", encoding="utf-8")
    print("  CREATE World/Factions/Unknown/Luna Coda.md (sync pending)")
    mm_path.unlink()


def merge_sulong_into_roma() -> None:
    """Sulong actor listed under Sloan in index — attach to Roma if no MM file."""
    pass


def create_faction_overviews() -> None:
    overviews = {
        "World/Factions/Aegir/Aegir.md": (
            "faction",
            "# Aegir\n\nAntagonist force — **Control** and **Dominian** forms.\n\n## Members\n\n- [[Aegir (Control)]]\n- [[Aegir (Dominian)]]\n",
        ),
        "World/Factions/Sharkfin Pirates/Sharkfin Pirates.md": (
            "faction",
            "# Sharkfin Pirates\n\n## Members\n\n- [[Joe -Mitchblade- Mitch]] — captain\n- [[Irik -Two-Tide- Fen]]\n- [[Rolan -Redwake- Marris]]\n- [[Saeva -Longcast- Virell]]\n",
        ),
        "World/Factions/Sand Rats/Sand Rats.md": (
            "faction",
            "# Sand Rats\n\nLiberation army.\n\n## Members\n\n- [[Tariq Solen]]\n",
        ),
        "World/Factions/Tremor/Tremor.md": (
            "faction",
            "# Tremor\n\nFaction tied to [[Soundless 5]] leadership.\n\n## Members\n\n- [[Bass Tremor]]\n",
        ),
        "World/Factions/Shadow Guild/Shadow Guild.md": (
            "faction",
            "# Shadow Guild\n\n## Members\n\n- [[Vesper]]\n",
        ),
        "World/Factions/Velencruz/Velencruz.md": (
            "faction",
            "# Velencruz\n\nNoble house — see also [[🗡️ Goru Yamashita (formerly Goru Valencruz)]].\n\n## Members\n\n- [[Morrow]]\n",
        ),
        "World/Factions/Unknown/Unknown.md": (
            "faction",
            "# Unknown\n\nPlaceholder faction until lore is settled.\n\n## Members\n\n- [[Luna Bass]]\n- [[Luna Coda]]\n- [[Coda]]\n",
        ),
    }
    for rel, (typ, body) in overviews.items():
        path = VAULT / rel
        if path.exists():
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        fm = f"---\ntype: {typ}\nstatus: draft\npublish: true\n---\n\n"
        path.write_text(fm + body, encoding="utf-8")
        print(f"  OVERVIEW {rel}")


def handle_devilmask() -> None:
    devil = VAULT / "World/Factions/Unaffiliated/DevilMask.md"
    goru = VAULT / "World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md"
    if devil.is_file() and goru.is_file():
        goru_text = goru.read_text(encoding="utf-8")
        if "DevilMask" not in goru_text:
            insert = (
                "\n\n## Disguises\n\n"
                "- **DevilMask** — bounty-poster identity used by [[Morrow]] (House Velencruz). "
                "Former standalone note merged here; see [[Velencruz/Morrow]].\n"
            )
            goru.write_text(goru_text.rstrip() + insert, encoding="utf-8")
        devil.unlink()
        print("  DELETE World/Factions/Unaffiliated/DevilMask.md (merged into Goru)")


def update_royal_flush_gang_index() -> None:
    path = VAULT / "World/Factions/Royal Flush Gang/Royal Flush Gang.md"
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace("[[Monster Manual/King|King]]", "[[King]]")
    text = text.replace("[[Monster Manual/Queen|Queen]]", "[[Queen]]")
    text = text.replace("[[Monster Manual/Arno Capone|Arno Capone]]", "[[Arno Capone]]")
    path.write_text(text, encoding="utf-8")


def merge_sulong_roma() -> None:
    """Add Sulong alt id to Roma from registry actor uQ0rUZwECpjnDh77."""
    roma = VAULT / "World/Factions/Blackhand/Lunarfolds/Roma.md"
    if not roma.is_file():
        return
    text = roma.read_text(encoding="utf-8")
    if "foundry_actor_id_sulong:" in text:
        return
    text = text.replace(
        "---\n",
        '---\nfoundry_actor_id_sulong: "uQ0rUZwECpjnDh77"\n',
        1,
    )
    if "### Sulong" not in text:
        text = text.rstrip() + (
            "\n\n### Sulong (mink form)\n\n"
            "Alternate Foundry actor for Roma's Sulong state. "
            "Sync manually: `python scripts/sync_foundry_live_markdown.py --id uQ0rUZwECpjnDh77`.\n"
        )
    roma.write_text(text, encoding="utf-8")
    print("  UPDATE Roma.md with Sulong actor reference")


def main() -> int:
    create_faction_overviews()
    create_velencruz_morrow()

    for mm_name, dest_rel in MOVE.items():
        mm_path = MM / mm_name
        if mm_path.is_file():
            move_mm_to_world(mm_path, dest_rel)

    split_luna_coda()

    for mm_name, (dest_rel, subsection) in MERGE.items():
        mm_path = MM / mm_name
        if mm_path.is_file():
            merge_mm_into(mm_path, dest_rel, subsection)

    handle_devilmask()
    update_royal_flush_gang_index()
    merge_sulong_roma()

    remaining = [p.name for p in MM.glob("*.md") if p.name not in KEEP]
    if remaining:
        print("\nRemaining MM files (not in KEEP — review manually):")
        for name in sorted(remaining):
            print(f"  - {name}")
    else:
        print("\nAll non-bestiary MM entries migrated.")

    kept = sorted(p.name for p in MM.glob("*.md") if p.name != "_index.md")
    print(f"\nBestiary entries kept: {len(kept)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
