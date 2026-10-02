# Generate Foundry Actor — Reference

## Compendium packs (`op5e` module)

| Pack id | Contents |
|---------|----------|
| `op5e.races` | Species (race items + racial advancement) |
| `op5e.racial-features` | Racial feature feats |
| `op5e.backgrounds` | Backgrounds **and** ship roles (`flags.op5e.shipRole`) |
| `op5e.classes` | 9 classes + advancement chains |
| `op5e.subclasses` | ~80 subclasses |
| `op5e.class-features` | Class/subclass features, Haki tree, additional powers |
| `op5e.feats` | General + racial feats |
| `op5e.items` | Weapons, gear, creations |

Source of truth for IDs: `op5e/data/src/` TypeScript → `npm run build` → LevelDB packs.

## Races / species

| Identifier | Display name |
|------------|--------------|
| `human` | Human |
| `fishman` | Fishman |
| `merfolk` | Merfolk |
| `mink` | Mink |
| `lunarian` | Lunarian |
| `dwarves` | Dwarves |
| `sky-islander` | Sky Islander |
| `augmented` | Augmented |
| `giant` | Giant |

Human has subrace optional grants (Kuja, Long-arm, etc.) via racial ItemGrant groups — may need explicit picks in Phase 2 if building past racial advancement.

## Classes

`barbarian`, `bard`, `brawler`, `fighter`, `gadgeteer`, `marksman`, `medic`, `rogue`, `savant`

## Haki (class choices)

- Choice levels: **8, 10, 12, 14, 16**
- Branches: `armament`, `observation`, `conqueror`
- Tiers: `novice` → `apprentice` → `journeyman` → `adept` → `master`
- Slug form: `{branch}-{tier}` (e.g. `armament-novice`)
- Logic: `op5e/data/helpers/haki-advancement.ts`, runtime `op5e/scripts/haki-advancement-lib.mjs`

Prior picks constrain the next pool (upgrade branch or start new branch at Novice).

## Build spec JSON shape

Validated by `op5e/dev/generate-foundry-actor/build-spec.schema.ts` (Zod). All scripts parse through `parseBuildSpec()`.

```json
{
  "buildPath": "class-based",
  "actorKind": "npc",
  "name": "Example NPC",
  "raceIdentifier": "human",
  "classIdentifier": "fighter",
  "subclassIdentifier": "champion",
  "level": 10,
  "cr": "5",
  "backgroundSlug": "Gladiator",
  "roleSlug": "captain",
  "powerFork": "neither",
  "additionalPowerSlug": "",
  "devilFruit": null,
  "startingHakiNotes": "",
  "abilities": { "str": 16, "dex": 14, "con": 15, "int": 10, "wis": 12, "cha": 8 },
  "abilityMethod": "manual",
  "portraitImg": "",
  "tokenImg": "",
  "choices": [
    { "stepId": "abc123", "level": 1, "source": "class", "uuids": ["Compendium.op5e.class-features...."] }
  ]
}
```

## CR → suggested level (class NPCs)

Use as a **starting suggestion** — always confirm.

| CR | Suggested level |
|----|-----------------|
| 0–1/4 | 1–2 |
| 1/2–2 | 3–4 |
| 3–4 | 5–7 |
| 5–7 | 8–10 |
| 8–10 | 11–13 |
| 11–15 | 14–17 |
| 16+ | 18–20 |

## Advancement types to prompt

| Type | Prompt? |
|------|---------|
| `ItemChoice` | Yes — equipment, fighting styles, instruments, Haki |
| `Subclass` | Only if `subclassIdentifier` not set in Phase 1 |
| `Trait` with `choices` | Yes — skill picks, etc. |
| `ItemGrant` | No — auto-applied |
| `AbilityScoreImprovement` | Phase 3 — ability assignment |
| `ScaleValue`, `HitPoints`, `Size` | No — auto |

## Output locations

| Artifact | Path |
|----------|------|
| Workshop JSON | `Foundry/actors-json/<slug>.json` |
| Vault actor page | `World/Factions/<Faction>/<Name>.md` |
| Monster registry | `Monster Manual/<Name>.md` (monster path) |

Workshop JSON is a **build template**, not the live Pi world sheet — see `Foundry/_index.md`.

## Related scripts

| Script | Purpose |
|--------|---------|
| `op5e/dev/generate-foundry-actor/list-catalog.ts` | List races, classes, subclasses, backgrounds, roles, powers |
| `op5e/dev/generate-foundry-actor/list-choices.ts` | Pending advancement choices for a build spec |
| `op5e/dev/generate-foundry-actor/build-actor.ts` | **Actor Build module** — `buildActor(spec)` |
| `op5e/dev/generate-foundry-actor/build-spec.schema.ts` | Zod BuildSpec contract |
| `op5e/dev/generate-foundry-actor/build-from-spec.ts` | CLI wrapper → `buildActor()` |
| `op5e/dev/generate-foundry-actor/validate-actor.ts` | Pre-import checklist |
| `op5e/dev/generate-foundry-actor/compendium-resolver.ts` | Embed-only adapter (icons, activities) |

**Foundry rules:** [.cursor/skills/generate-foundry-actor/FOUNDRY-KB.md](../.cursor/skills/generate-foundry-actor/FOUNDRY-KB.md)

## Automation expectations

Set user expectations from `op5e/docs/automation-status.md`:

- Curated builds: Phase 1 clean
- Full subclass matrix: many features still text-only
- Midi-QoL + DAE recommended at table; compendium uses dnd5e 5.1 `system.activities` + DAE effects
