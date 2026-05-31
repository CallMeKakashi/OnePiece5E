#!/usr/bin/env python3
"""
Match all Foundry world actors to vault notes; link frontmatter; build Monster Manual stubs.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from difflib import SequenceMatcher
from pathlib import Path

VAULT = Path(__file__).resolve().parents[1]
FOUNDRY_DB = Path(
    r"D:\foundry-pi\Foundry\foundrydata\Data\worlds\blood-and-brine\data\actors"
)
READ_SCRIPT = (
    VAULT
    / ".obsidian/plugins/blood-brine-foundry-statblock/foundry-read-actor.mjs"
)
MONSTER_DIR = VAULT / "Monster Manual"
REGISTRY_PATH = VAULT / "Foundry" / "actor-registry.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)

# Foundry name (lower) -> vault note rel (manual overrides)
MANUAL: dict[str, str] = {
    "commander leon": "World/Factions/Marines/Commander Leon.md",
    "captain leon, commander of g-9": "World/Factions/Marines/Commander Leon.md",
    "calder voss": "World/Factions/Marines/Calder Voss.md",
    "vorro": "World/Factions/Marines/Calder Voss.md",
    "mira the unbreakable": "World/Factions/Blackhand/Mira the Unbreakable.md",
    "malphas": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
    "shadow malphas": "World/Factions/Blackhand/Lunarfolds/Malphas.md",
    "baptiste": "World/Factions/Blackhand/Lunarfolds/Baptiste.md",
    "roma": "World/Factions/Blackhand/Lunarfolds/Roma.md",
    "zim": "World/Factions/Blackhand/Lunarfolds/Zim.md",
    "cade tigor cooper": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "cadence": "World/Factions/Decibella Revolutionary/Cadence.md",
    "treble": "World/Factions/Decibella Revolutionary/Cadence.md",
    "treble anthem": "World/Factions/Soundless 5/Lady Soefra Anthem.md",
    "rhythm echo": "World/Factions/Soundless 5/Rhythm Echo.md",
    "rhythm echo (mutated)": "World/Factions/Soundless 5/Rhythm Echo.md",
    "kael dhamar": "Rules/Stat blocks/Kael Dhamar.md",
    "marine ensign (armor mk iii)": "Rules/Stat blocks/Marine Ensign.md",
    "rashid al-saffar": "Rules/Stat blocks/Rashid Al-Safar.md",
    "cassian valehart": "Rules/Stat blocks/Cassian Valehart.md",
    "cecilia moore": "Rules/Stat blocks/Cecilia Moore.md",
    "kaen solaris": "Rules/Stat blocks/Kaen Solaris.md",
    "goru yamashita": "World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md",
    "fenris wolfblood (fenris)": "World/Factions/Blackhand/⚔️ Fenris Wolfblood — “The Blood of Sun and Shadow”.md",
    "liz": "World/Factions/Sixfold/Liz.md",
    "guillotine liz": "World/Factions/Sixfold/Liz.md",
    "serica corvine": "World/Factions/Sixfold/Serica Corven.md",
    "veyl corvine": "World/Factions/Sixfold/Veyl Corven.md",
    "daniel": "World/Factions/Spider Nest Pirates/Daniel.md",
    "ben": "World/Factions/Spider Nest Pirates/Ben.md",
    "chloe": "World/Factions/Spider Nest Pirates/Chloe.md",
    "shako": "World/Factions/Blackhand/Gentle Giant Pirates/Shako.md",
    "kalla of shandia": "World/Factions/Blackhand/Gentle Giant Pirates/Kalla of Shandia.md",
    "thompson caneheart": "World/Factions/Blackhand/Braveheart Pirates/Thompson Caneheart.md",
    "homunculus servant": "World/Factions/Blackhand/Braveheart Pirates/Homunculus Servant.md",
    "façade": "World/Factions/Blackhand/Braveheart Pirates/Facade.md",
    "facade": "World/Factions/Blackhand/Braveheart Pirates/Facade.md",
    "ju lee caneheart": "World/Factions/Blackhand/Braveheart Pirates/Ju Lee Caneheart.md",
    "tray": "World/Factions/Blackhand/Tray.md",
    "alice": "World/Factions/Blackhand/Alice.md",
    "graff bolt": "World/Factions/Marines/Graff Bolt.md",
    "delaroth": "World/Factions/Marines/Delaroth.md",
    "drez": "World/Factions/Marines/Delaroth.md",
    "linus marrow": "World/Factions/Motley Crew/Linus Marrow.md",
    "rias decibel": "World/Factions/Motley Crew/Rias Decibel.md",
    "rias": "World/Factions/Motley Crew/Rias Decibel.md",
    'matthew "the jack" burgess': "World/Factions/Royal Flush Gang/Matthew -The Jack- Burgess.md",
    "midori": "World/Factions/Guiseppi Family/Midori.md",
    # Phase B2 — Monster Manual → World
    "aegir (control)": "World/Factions/Aegir/Aegir (Control).md",
    "aegir (dominian)": "World/Factions/Aegir/Aegir (Dominian).md",
    "arno capone": "World/Factions/Royal Flush Gang/Arno Capone.md",
    "bass tremor": "World/Factions/Tremor/Bass Tremor.md",
    "cade \"tigor\" hunt": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "chime": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    "chuckles": "World/Factions/Soundless 5/Chuckles.md",
    "coda": "World/Factions/Unknown/Coda.md",
    "crunch": "World/Factions/Blackhand/Braveheart Pirates/Ju Lee Caneheart.md",
    "drez crown, captain of g-45": "World/Factions/Marines/Drez Crown, Captain of G-45.md",
    "giggles": "World/Factions/Soundless 5/Giggles.md",
    "irik \"two-tide\" fen": "World/Factions/Sharkfin Pirates/Irik -Two-Tide- Fen.md",
    "jazmine": "World/Factions/Blackhand/Lunarfolds/Jazmine.md",
    "jingle": "World/Factions/Blackhand/Lunarfolds/Cade Tigor Cooper.md",
    'joe "mitchblade" mitch': "World/Factions/Sharkfin Pirates/Joe -Mitchblade- Mitch.md",
    'kara "many-eyes" kagemi': "World/Factions/Unaffiliated/Kara -Many-Eyes- Kagemi.md",
    "king": "World/Factions/Royal Flush Gang/King.md",
    "luna bass": "World/Factions/Unknown/Luna Bass.md",
    "luna coda": "World/Factions/Unknown/Luna Coda.md",
    "luu": "World/Factions/Blackhand/Lunarfolds/Luu.md",
    'maro "powderflash" kel': "World/Factions/Unaffiliated/Maro -Powderflash- Kel.md",
    "merlin": "World/Factions/Blackhand/Lunarfolds/Merlin.md",
    "mikey": "World/Factions/Velencruz/Morrow.md",
    "morrow": "World/Factions/Velencruz/Morrow.md",
    "pegasus": "World/Factions/Blackhand/Lunarfolds/Pegasus.md",
    "queen": "World/Factions/Royal Flush Gang/Queen.md",
    'rolan "redwake" marris': "World/Factions/Sharkfin Pirates/Rolan -Redwake- Marris.md",
    'saeva "longcast" virell': "World/Factions/Sharkfin Pirates/Saeva -Longcast- Virell.md",
    "simon tideborn": "World/Factions/Spider Nest Pirates/Simon The One Armed Tyrant.md",
    "sloan": "World/Factions/Decibella Revolutionary/Sloan.md",
    "snickers": "World/Factions/Soundless 5/Snickers.md",
    "sulong": "World/Factions/Blackhand/Lunarfolds/Roma.md",
    "tariq solen": "World/Factions/Sand Rats/Tariq Solen.md",
    "vesper": "World/Factions/Shadow Guild/Vesper.md",
    "vex": "World/Factions/Blackhand/⚔️ Fenris Wolfblood — “The Blood of Sun and Shadow”.md",
    "wheeze": "World/Factions/Soundless 5/Wheeze.md",
    "zara tideborn": "World/Factions/Spider Nest Pirates/Zara Tideborn.md",
    "devilmask": "World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md",
}

SKIP_NAMES = {
    "player character",
    "npc",
    "character",
    "test",
    "sample",
}


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (s or "").lower())


def slugify(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", (name or "actor").lower()).strip("-")
    return s[:80] or "actor"


def load_foundry_actors() -> list[dict]:
    if REGISTRY_PATH.exists():
        return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    proc = subprocess.run(
        ["node", str(READ_SCRIPT), "--db", str(FOUNDRY_DB), "--list"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    actors = json.loads(proc.stdout)
    REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_PATH.write_text(
        json.dumps(actors, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return actors


def vault_actor_notes() -> list[tuple[str, Path, str, str]]:
    """rel path, path, stem, normalized stem."""
    out: list[tuple[str, Path, str, str]] = []
    for base in (
        VAULT / "World",
        VAULT / "Rules" / "Stat blocks",
        MONSTER_DIR,
    ):
        if not base.is_dir():
            continue
        for path in base.rglob("*.md"):
            if path.name.startswith("_"):
                continue
            stem = path.stem
            rel = str(path.relative_to(VAULT)).replace("\\", "/")
            out.append((rel, path, stem, norm(stem)))
    return out


def score_match(name: str, stem: str, n_name: str, n_stem: str) -> float:
    if n_name == n_stem:
        return 1.0
    if n_name in n_stem or n_stem in n_name:
        return 0.85
    return SequenceMatcher(None, n_name, n_stem).ratio()


def find_match(
    actor: dict, notes: list[tuple[str, Path, str, str]]
) -> str | None:
    name = actor.get("name", "")
    key = name.lower().strip()
    if key in MANUAL:
        return MANUAL[key]
    n_name = norm(name)
    best_rel = None
    best_score = 0.0
    for rel, _path, stem, n_stem in notes:
        s = score_match(name, stem, n_name, n_stem)
        if s > best_score:
            best_score = s
            best_rel = rel
    if best_score >= 0.72:
        return best_rel
    return None


def inject_ids(fm: str, actor_id: str, slug: str) -> str:
    fm = re.sub(r"^foundry_actor_id:.*\n", "", fm, flags=re.MULTILINE)
    fm = re.sub(r"^foundry_live_slug:.*\n", "", fm, flags=re.MULTILINE)
    extra = f'foundry_actor_id: "{actor_id}"\nfoundry_live_slug: "{slug}"\n'
    return fm.rstrip()[:-3] + extra + "---\n"


def update_note(path: Path, actor: dict) -> bool:
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return False
    new_fm = inject_ids(m.group(0), actor["id"], actor["slug"])
    if new_fm == m.group(0):
        return False
    path.write_text(new_fm + text[m.end() :], encoding="utf-8")
    return True


def monster_note_path(actor: dict) -> Path:
    safe = re.sub(r'[<>:"/\\|?*]', "-", actor["name"])
    return MONSTER_DIR / f"{safe}.md"


def ensure_monster_note(actor: dict) -> Path:
    path = monster_note_path(actor)
    if path.exists():
        return path
    MONSTER_DIR.mkdir(parents=True, exist_ok=True)
    name = actor["name"]
    body = f"""---
type: monster
status: draft
publish: true
foundry_actor_id: "{actor['id']}"
foundry_live_slug: "{actor['slug']}"
---

# {name}

Campaign monster manual entry. Live stats: `python scripts/sync_foundry_live_markdown.py`.

## Role

(To be filled from sessions / transcripts.)

## Appearances

- (session links)

## Related

- [[Monster Manual/_index|Monster Manual]]
"""
    path.write_text(body, encoding="utf-8")
    return path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    actors = load_foundry_actors()
    notes = vault_actor_notes()
    linked = 0
    updated = 0
    monsters_created = 0
    report: list[dict] = []

    for actor in actors:
        name = (actor.get("name") or "").strip()
        if not name or name.lower() in SKIP_NAMES:
            continue
        atype = actor.get("type", "npc")
        match = find_match(actor, notes)
        entry = {
            "id": actor["id"],
            "name": name,
            "slug": actor["slug"],
            "type": atype,
            "vault": match,
        }

        if match:
            path = VAULT / match
            if path.exists() and update_note(path, actor):
                updated += 1
            linked += 1
        elif atype == "npc" and name.lower().strip() not in MANUAL:
            path = ensure_monster_note(actor)
            rel = str(path.relative_to(VAULT)).replace("\\", "/")
            update_note(path, actor)
            entry["vault"] = rel
            monsters_created += 1
            linked += 1
            notes.append((rel, path, path.stem, norm(path.stem)))

        report.append(entry)

    # Monster Manual index
    MONSTER_DIR.mkdir(parents=True, exist_ok=True)
    def vault_path(e: dict) -> str:
        return e.get("vault") or ""

    npcs = [e for e in report if vault_path(e).startswith("Monster Manual/")]

    lines = [
        "---",
        "publish: true",
        "status: draft",
        "---",
        "",
        "# Monster Manual",
        "",
        "Bestiary entries only. Named NPCs live under [[World/Factions/_index|World → Factions]].",
        "",
        "## Creatures",
        "",
    ]
    for e in sorted(npcs, key=lambda x: x["name"].lower()):
        title = e["name"]
        note = e["vault"].replace(".md", "")
        lines.append(f"- [[{note}|{title}]] — `{e['id']}`")

    (MONSTER_DIR / "_index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    unlinked = [e for e in report if not e.get("vault")]
    print(
        f"Actors: {len(report)} | linked: {linked} | notes updated: {updated} | "
        f"monster stubs created: {monsters_created} | unlinked: {len(unlinked)}",
        flush=True,
    )
    if unlinked:
        print("Unlinked (need manual MANUAL map or new note):", flush=True)
        for e in unlinked[:25]:
            print(f"  - {e['name']} ({e['type']}) {e['id']}", flush=True)
        if len(unlinked) > 25:
            print(f"  ... and {len(unlinked) - 25} more", flush=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
