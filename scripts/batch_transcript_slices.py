#!/usr/bin/env python3
"""Generate transcript .md, session index, and timeline event for episodes 10-25."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSCRIPTS = ROOT / "Transcripts"

# (episode_num, title, extracted_md, skip_session_if_exists_name)
EPISODES = [
    (
        10,
        "Sea of Nightmares",
        """> Speech-to-text: Bob/Malfus → [[Malphas]]; Veil → [[Veyl Corvine]]; Serika → [[Cerica Corvine]]; Voro/Voss = Marine captain.

### Summary

- [[Malphas]] Lunarian dream (outpost attack) → wakes as ship hit; [[Daniel (Spider's Nest)]] betrays crew to Marines (Mugen / Lunarion research).
- Deck fight: Wonderland construct, Daniel killed in nightmare layer, Ben overboard; [[Veyl Corvine]] & [[Cerica Corvine]] missing then trapped in ring nightmares.
- Shared nightmare; [[B.O.B]] traces purple **cursed rings**; patron demands [[Baptiste]] find its vessel — refused; exhaustion / warlock-like ring slots.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Baptiste]], [[Roma]], [[B.O.B]] |
| Spider's Nest | [[Daniel (Spider's Nest)]], [[Chloe (Spider's Nest)]], [[Ben (Spider's Nest)]] |
| Sixfold | [[Veyl Corvine]], [[Cerica Corvine]] |
| Antagonists | Marine captain (Voro/Voss STT), Wonderland |

### Open questions

- Marine captain vs [[Vorro]] identity.
- Ring patron name and remaining ring set.""",
    ),
    (
        11,
        "Welcome to the Jungle",
        """> STT: Whale/Serika → Sixfold; Pasha = nightmare lion-mink; Circle of Clouds = clown slave traders.

### Summary

- Resolves Ep 10 spider nightmares (Pasha-form); Daniel shares Liz/fusion lore; crew reaches dome **zoo island** (log pose drift).
- **Circle of Clouds** clowns exposed as stranded slave traders; Roma starts fight on chained platform.
- [[Malphas]] pursues escaped clown captain by speedboat — cliffhanger.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Baptiste]], [[Roma]], [[B.O.B]], [[Veyl Corvine]], [[Cerica Corvine]] |
| Spider's Nest | [[Daniel (Spider's Nest)]], [[Chloe (Spider's Nest)]] |
| Antagonists | Circle of Clouds (clown faction) |

### Open questions

- Recover clown ship and fix log pose?""",
    ),
    (
        12,
        "Clown Tricks",
        """> STT: Bessie = giant crab vessel; transcript degrades ~mid-file.

### Summary

- Continues clown-ship crisis: knock out waking captives; [[Veyl Corvine]] distracts **Bessie**; [[B.O.B]] animal-handling with handler.
- [[Malphas]] off-screen on pursuit boat (from Ep 11).
- Resolution unclear in STT — bridges Ep 13.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Baptiste]], [[Roma]], [[B.O.B]], [[Veyl Corvine]] |
| NPCs | Bessie (crab), clown handler |

### Open questions

- Does Bessie carry party back to island?""",
    ),
    (
        13,
        "The Reaper (No DM Audio)",
        """> **No DM audio** — player/STT only; heavy repetition artifacts.

### Summary

- Party approaches **smoking island**; bone-like fisherman + **Bessie**; Marines want crab for Calm Belt — party refuses slavery.
- Moral debate: clown slave bonded to Bessie.
- Usable content ends early.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Baptiste]], [[Roma]], [[B.O.B]] |
| NPCs | Bone man / fisherman, Bessie, Marine contacts |

### Open questions

- Bone man = Reaper NPC or handler?""",
    ),
    (
        14,
        "The Decibel Decree",
        """> STT: Malfa → [[Malphas]]; Decibella = [[Decibella Kingdom]]; see also [[Session 14 - The Decibel Decree]] (prep/recap).

### Summary

- After [[Graff Newt]], party reaches silent capital **Decibella**; sound illegal; tentacle lake incident.
- [[Baptiste]] Haki-like burst; hideout **The Discord**; meet [[Riff Sin]]; [[Cadence]] captured.
- [[B.O.B]] rings Liberty Bell; **Soundless Five** offer tower key trials — session ends entering broadcast tower.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[B.O.B]], [[Cade Tigor Cooper]] |
| Allies | [[Riff Sin]], [[Cadence]] |
| Faction | Soundless Five, House Tremor |

### Open questions

- Vera informant — ally or agent?""",
        True,
    ),
    (
        15,
        "Animal Within",
        """> Mid-combat open; see [[Session 15 - Animal Within]] prep.

### Summary

- Tower 1v1s: [[Cade Tigor Cooper]] + [[Riff Sin]] vs **Synth** (Wildsaid llama transform).
- [[Baptiste]] vs **Bass**; [[Malphas]] vs **Rhythm** — both down, mysterious PVC-pipe healers intervene.
- [[Roma]] / [[B.O.B]] fights teased next.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Cade Tigor Cooper]], [[Riff Sin]], [[Baptiste]], [[Malphas]] |
| Antagonists | Synth, Bass, Rhythm (Soundless Five) |

### Open questions

- Who commands PVC-pipe healers?""",
        True,
    ),
    (
        16,
        "Broken Promises",
        """> Broadcast tower assault; see [[Session 16 - Broken Promises]] outline.

### Summary

- Multi-floor **Soundless Five** gauntlet: Malphas vs Rhythm, Roma Sulong vs Treble, Baptiste vs rhino-mutant.
- Roof fight begins; floor 5 **Emperor** comatose; **third ring** on Malphas — cliffhanger.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Riff Sin]], [[Cade Tigor Cooper]] |
| Antagonists | Soundless Five, Emperor (Decibel) |

### Open questions

- Malphas third ring control rules.""",
        True,
    ),
    (
        17,
        "Agony of Choas",
        """> Title STT: Chaos; **≠** [[Session 17 - Howling Thunder]] (prep for earlier tower fights).

### Summary

- Roof **void entity** fight; [[Baptiste]] collapses (crystals/rings); **Broadcast Tower collapses**.
- Shore recovery: [[Shako]] boat, Malphas blood cocoon, Roma serum rampage aftermath (noble quarter).
- Briefing: Mira / **Clind** mission; Cadence escaped capture.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Riff Sin]], [[Cade Tigor Cooper]] |
| NPCs | Fenderis, Malik Samim, [[Shako]] |

### Open questions

- Tell Roma about noble-quarter destruction?""",
    ),
    (
        18,
        "Gentle Giant Pirates",
        """> ~1 week downtime on Decibella; Gentle Giant / Black Hand arena setup.

### Summary

- Crew downtime: Malphas bell fragments, Roma saber-tooth pet, Riff kingdom aid.
- Plan rescue **Droven** + execution prisoner; **Battle of Beast** arena vs Gentle Giant Pirates.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Riff Sin]] |
| Faction | Gentle Giant Pirates |

### Open questions

- Arena stakes and prisoner identity.""",
    ),
    (
        19,
        "The Walking Dead",
        """> Arena continuation from Ep 18; title not spoken on-table.

### Summary

- Crew wins Gentle Giant contest rounds; toxic blood / skillet highlights.
- Night hunt for escaped **singer twin** (Cadence's sister); Roma wants [[Riff Sin]] on crew.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Riff Sin]] |
| Antagonists | Shackle, Gentle Giant fighters |

### Open questions

- Singer twin fate.""",
    ),
    (
        20,
        "Price of Freedom Part 1",
        """> Part 1 of 2; Freefield island cage prep.

### Summary

- Depart Decibella: flag prep with [[Shako]]; stop for **metal cage** (saber-tooth).
- Pose as Lunar house nobles; negotiate ~1M berries with mayor/craftsman.
- Foundry crash — combat continues Part 2.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Shako]] |

### Open questions

- Private parley "woman" identity.""",
    ),
    (
        20,
        "Price of Freedom Part 2",
        """> Part 2 of 2; combat-heavy.

### Summary

- Skirmish: Baptiste void arms, Malphas paladin bombs; **Eric** crewless pirate freed.
- Level-up tease; leads toward [[Episode 21 - House of Justice]] / Dravo rescue arc.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]] |
| NPCs | Eric (Gentle Giant remnant) |

### Open questions

- Kyle combatant role.""",
    ),
    (
        21,
        "House of Justice",
        """> Lex Imperia / Newshold judiciary islands; Zim + Droven rescue arc.

### Summary

- **Freefield** → **Dravo** Thousand-Mile Tunnel (ship fall); twin islands Lex Imperia / Newshold.
- Roma infiltrates **House Valehart** as chef; Malphas cathedral chaos; prison riot (~686 freed).
- [[Linus Marrow]] returns; fight vs [[Vorro]] + G-45 armor Marine — cliffhanger.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Cade Tigor Cooper]] |
| Allies | [[Linus Marrow]], Dravo |
| Antagonists | [[Vorro]], Marines, House Valehart |
| Targets | Zim, Droven |

### Open questions

- Zim trial vs execution timing.""",
    ),
    (
        22,
        "The Missing Piece",
        """> Continues Ep 21; heavy STT corruption mid-file.

### Summary

- Defeat **Vorro** + armored Marine; rescue **Zim** from seastone brig.
- Strip Vorro; take routing papers (Commander Leon, Dress Crown).
- Roma white serum → temporary human form; Baptiste brands Vorro.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Linus Marrow]] |
| Captive | [[Vorro]], Zim |

### Open questions

- White serum duration.""",
    ),
    (
        23,
        "Choice for life",
        """> Naval chase; Vorro interrogation continues.

### Summary

- Commodore demands Vorro back; party refuses; naval battle vs Lex Imperia fleet.
- Newspaper: **Baron Lazarus** on Driftroot; serum colors explained (green/white/red…).
- Plan Baron ship infiltration next.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]], [[Linus Marrow]] |
| Captive | [[Vorro]], Zim |

### Open questions

- Sea-king bait outcome.""",
    ),
    (
        24,
        "The Friendly Baron",
        """> Filename has double space: `Episode  24 - The Friendly Baron.txt`

### Summary

- [[Baptiste]] dreams of ring entity **Aegir**.
- Intercept [[🗡️ Goru Yamashita (formerly Goru Valencruz)|Goru Yamashita]]; Black Hand connection; mansion back channel.
- **Cashian** Valehart hosts; Roma (human) rampage vs Marines; Bob resuscitates Roma.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]], [[Roma]], [[Baptiste]] |
| Allies | Goru Yamashita, Cashian, Jefferson |
| Captive | [[Vorro]] (aboard ship) |

### Open questions

- Zim trial status after Goru/Cashian talk.""",
    ),
    (
        25,
        "Fire Storm",
        """> **Episode 25** — related prep [[Session 24 - Fire Storm]] (session number diverges).

### Summary

- Escort fleet battle: **Commander Leon** (Flame Logia); Lunarian **Alice** burns ships.
- **Nikolai/Anton** mist abducts Alice + [[Malphas]]; [[Vorro]] escapes; **Droven** fate unresolved.

### People (links)

| Role | Note |
|------|------|
| PCs | [[Malphas]] (taken), [[Roma]], [[Baptiste]] |
| Allies | [[Linus Marrow]], Goru, Cashian, Zim |
| Antagonists | Commander Leon, Alice, Nikolai |

### Open questions

- Droven rescued or lost on burning escort?""",
        True,
    ),
]

SESSION_SKIP_EXISTING = {14, 15, 16}  # have prep session notes; still write index stub


def find_txt(ep: int, title: str) -> Path:
    candidates = list(TRANSCRIPTS.glob(f"Episode*{ep}*{title}*.txt"))
    if not candidates:
        candidates = list(TRANSCRIPTS.glob(f"Episode {ep} - {title}.txt"))
    if not candidates:
        raise FileNotFoundError(f"No txt for ep {ep} {title}")
    return candidates[0]


def write_transcript(ep: int, title: str, extracted: str, txt: Path) -> Path:
    base = txt.stem
    md_path = TRANSCRIPTS / f"{base}.md"
    srt = TRANSCRIPTS / f"{base}.srt"
    sources = [f"Transcripts/{txt.name}"]
    if srt.exists():
        sources.append(f"Transcripts/{srt.name}")
    src_yaml = "\n".join(f'  - "{s}"' for s in sources)
    body = txt.read_text(encoding="utf-8", errors="replace")
    content = f"""---
type: transcript
episode: {ep}
title: "{title}"
status: draft
sources:
{src_yaml}
---

# Episode {ep} — {title}

## Extracted

{extracted}

---

## Transcript

"""
    md_path.write_text(content + body, encoding="utf-8")
    return md_path


def write_session(ep: int, title: str, skip_existing_prep: bool) -> Path | None:
    path = ROOT / "Sessions" / f"Session {ep} - {title}.md"
    if path.exists() and skip_existing_prep:
        # Append transcript link block if missing
        text = path.read_text(encoding="utf-8")
        link = f"[[Episode {ep} - {title}]]"
        if link not in text:
            header = f"""---
type: session
episode: {ep}
status: draft
sources:
  - "[[Episode {ep} - {title}]]"
---

# Session {ep} — {title}

> Curated prep/recap exists below. Transcript: [[Episode {ep} - {title}]].

"""
            path.write_text(header + text, encoding="utf-8")
        return path
    if path.exists():
        return None
    related = ""
    if ep == 17:
        related = "\n> **Note:** [[Session 17 - Howling Thunder]] is DM prep for tower fights (Ep 15–16 territory), not this recording.\n"
    if ep == 25:
        related = "\n> **Note:** Prep outline [[Session 24 - Fire Storm]] — session number ≠ episode number.\n"
    prior = f"[[Session {ep - 1} - *]]"  # placeholder
    # fix prior link for known chain
    prior_map = {
        11: "[[Session 9 - The Lunarfold Tournament Part 2]]",
        12: "[[Session 11 - Welcome to the Jungle]]",
        13: "[[Session 12 - Clown Tricks]]",
        14: "[[Session 13 - The Reaper (No DM Audio)]]",
        15: "[[Session 14 - The Decibel Decree]]",
        16: "[[Session 15 - Animal Within]]",
        17: "[[Session 16 - Broken Promises]]",
        18: "[[Session 17 - Agony of Choas]]",
        19: "[[Session 18 - Gentle Giant Pirates]]",
        20: "[[Session 19 - The Walking Dead]]",
        21: "[[Episode 20 - Price of Freedom Part 2]]",
        22: "[[Session 21 - House of Justice]]",
        23: "[[Session 22 - The Missing Piece]]",
        24: "[[Session 23 - Choice for life]]",
        25: "[[Session 24 - The Friendly Baron]]",
    }
    prior_link = prior_map.get(ep, "")
    prior_row = f"| Prior | {prior_link} |\n" if prior_link else ""
    content = f"""---
type: session
episode: {ep}
status: draft
sources:
  - "[[Episode {ep} - {title}]]"
---

# Session {ep} — {title}

> Index only — curated recap not written yet.
{related}
## Links

| Kind | Note |
|------|------|
| Transcript | [[Episode {ep} - {title}]] |
| Timeline | [[Timeline/Undated/[Event] {title}]] |
{prior_row}| Raw | `Transcripts/Episode {ep} - {title}.txt` |

"""
    path.write_text(content, encoding="utf-8")
    return path


def write_timeline(title: str, ep: int, extracted: str) -> Path:
    path = ROOT / "Timeline" / "Undated" / f"[Event] {title}.md"
    if path.exists():
        return path
    # first bullet from summary
    content = f"""---
type: event
status: draft
sources:
  - "[[Episode {ep} - {title}]]"
---

# {title}

Episode {ep} table events. See transcript `## Extracted`.

## Evidence

- [[Episode {ep} - {title}]]
- [[Session {ep} - {title}]]
"""
    path.write_text(content, encoding="utf-8")
    return path


def main():
    done = []
    for item in EPISODES:
        skip_sess = False
        if len(item) == 4:
            ep, title, extracted, skip_sess = item
        else:
            ep, title, extracted = item
        txt = find_txt(ep, title)
        md = write_transcript(ep, title, extracted, txt)
        write_timeline(title, ep, extracted)
        sess = write_session(ep, title, skip_sess or ep in SESSION_SKIP_EXISTING)
        done.append((ep, title, md.name, sess.name if sess else "(existing)"))
    for row in done:
        print(row)


if __name__ == "__main__":
    main()
