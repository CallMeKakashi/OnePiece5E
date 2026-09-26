# Foundry VTT — Actor export knowledge base

Condensed from [Foundry Knowledge Base](https://foundryvtt.com/kb/) plus **dnd5e 5.1** + **op5e** project rules. Read before generating workshop JSON.

## Core documents

| Document | Role | KB |
|----------|------|-----|
| **Actor** | Sheet + prototype token; owns embedded items | [Actors](https://foundryvtt.com/article/actors) |
| **Item** (owned) | Copy embedded on actor; not in world Items directory | [Items](https://foundryvtt.com/article/items) |
| **ActiveEffect** | On actor or item; transfer flag for equipment | [Active Effects](https://foundryvtt.com/article/active-effects) |
| **Compendium** | Canonical definitions; import or reference by UUID | [Compendium Packs](https://foundryvtt.com/article/compendia) |

**Import path:** Actors Directory → right-click actor → **Import Data** → JSON file.  
**Export path:** same menu → **Export Data** (full actor + embedded items).

## Actor JSON top level

```json
{
  "name": "Display Name",
  "type": "character | npc",
  "img": "path/or/url/to/portrait.webp",
  "prototypeToken": { "texture": { "src": "path/to/token.webp" } },
  "system": { /* dnd5e TypeDataModel */ },
  "items": [ /* embedded Item documents */ ],
  "effects": [],
  "flags": {},
  "_stats": { "coreVersion": "13", "systemId": "dnd5e", "systemVersion": "5.1.10" }
}
```

### Required `system` blocks (dnd5e 5.1)

| Path | Purpose |
|------|---------|
| `system.abilities.*.value` | Base scores (before ActiveEffect modifiers) |
| `system.attributes.hp` | `{ value, max, temp, formula }` |
| `system.attributes.ac` | `{ flat, calc, formula }` — prepared at runtime |
| `system.attributes.prof` | Proficiency bonus (= level-based) |
| `system.attributes.movement` | walk/swim/fly; **devil fruit users: swim 0** |
| `system.details.cr` | NPC challenge rating |
| `system.details.level` | Character level (derived from class item too) |
| `system.details.race` | Display race string |
| `system.details.type` | `{ value: "humanoid", subtype }` |
| `system.skills.*.value` | 0 / 1 proficient / 2 expertise |
| `system.tools.*.value` | Tool proficiencies (expertise = 2) |
| `system.currency.gp` | **Berries** in op5e (`CONFIG` labels gp as ʙ) |
| `system.traits.weaponProf` / `armorProf` | From class/race |

## Embedded items — rules

1. **Full documents**, not `{ sourceId }` stubs — workshop JSON must contain complete item data Foundry can instantiate.
2. Each owned item needs unique **`_id`** (16-char hex).
3. **Standalone rule:** export must contain **zero** `Compendium.op5e.*` strings — no `flags.dnd5e.sourceId`, no `_stats.compendiumSource`. Advancement `uuid` fields point to `Actor.<actorId>.Item.<ownedId>` for embedded items only. Unresolved choice-pool entries are stripped.
4. **`type`** must match dnd5e: `race`, `class`, `subclass`, `background`, `feat`, `weapon`, `equipment`, `loot`, `tool`, `consumable`.
5. **Sort order** matters on sheet — typical: race → background → class → subclass → features → equipment.

### Item types for OP5e builds

| type | When |
|------|------|
| `race` | Species (Human, Fishman, …) |
| `class` | One per class; `system.levels` = character level |
| `subclass` | **Required** for archetype; `system.identifier`, `system.classIdentifier` |
| `background` | Librarian, Gladiator, … — **not** `feat` |
| `feat` | Class features, Haki, devil fruit abilities, ship **roles** (`Role: Scholar`) |
| `weapon` | `system.equipped: true` on worn weapons; include **`system.activities`** (5.1) |
| `equipment` | Armor — `system.equipped: true` when worn |
| `loot` | Packs, gear |
| `tool` | Thieves' tools, kits |

## dnd5e 5.1 Activities (`system.activities`)

Legacy fields (`actionType`, `activation`, `uses`, `damage`, `save`) are **not enough** on 5.1 sheets — buttons come from **`system.activities`**.

OP5e compendium builds activities via `op5e/data/helpers/activities.ts` → `ensureFeatureActivities()`.

**Generator rule:** every activatable feat/weapon must have non-empty `system.activities` before export. Run compendium helper on embed; never hand-roll partial feat stubs.

Activity types: `attack`, `damage`, `save`, `heal`, `utility`, `check`.

Primary activity id (dnd5e default): `dnd5eactivity000`.

## Active Effects

| Field | Rule |
|-------|------|
| `effects[].img` | **Always set** — use item `img` or thematic Foundry icon |
| `effects[].changes[]` | `{ key, mode, value, priority }` |
| `effects[].flags.dae.transfer` | `true` for worn/granted passives |
| Change modes | 2=ADD, 5=OVERRIDE, 3=MULTIPLY, etc. |

Attribute keys use dot paths: `system.abilities.int.value`, `flags.dnd5e.initiativeAdv`, `flags.midi-qol.advantage.skill.prc`.

## Advancements vs owned items

**Class** items carry `system.advancement[]` (ItemGrant, ItemChoice, Subclass, Trait, ASI).

Workshop JSON must **both**:
- Embed the **class** item at correct `system.levels`
- Embed **every granted feature** as its own `feat` item (from ItemGrant resolution through level)
- Embed **subclass** item + subclass-granted features
- Embed **background** (`type: background`) + **role** (`type: feat`, `flags.op5e.shipRole`)

Do **not** skip subclass/background because "grants exist on paper" — the sheet only shows **owned items**.

Trait advancements (skill picks) → `system.skills` / `system.tools` on the **actor**, not separate items.

## Inventory checklist (common failures)

| Symptom | Fix |
|--------|-----|
| Empty inventory | Embed weapons/armor/pack as `items[]` entries with `system.quantity` |
| No currency | Sum `flags.op5e.startingBeri` from background + role → `system.currency.gp` |
| No subclass row | Add `type: "subclass"` item |
| Background missing | Add `type: "background"` full doc from compendium |
| No Use buttons | Run `ensureFeatureActivities()` on every activatable item |
| Effects blank icon | Copy `img` from parent feat onto each effect |
| Weapons don't attack | Add `system.activities` attack activity on weapons |

## op5e project sources

| Need | Path |
|------|------|
| Full item defs | `op5e/data/src/**` → `npm run build` → `packs-src/` |
| Activity builder | `op5e/data/helpers/activities.ts` |
| Effect builder | `op5e/data/helpers/effects.ts` |
| Compendium index | `op5e/dev/character-sheet-audit/audit-lib.ts` → `buildCompendiumIndex()` |
| Starting gear | `op5e/data/src/classes/class-equipment-grants.ts`, `backgrounds/equipment-grants.ts` |
| Automation scope | `op5e/docs/automation-status.md` |

## Custom content (homebrew)

When compendium lacks content (5e Mastermind, campaign devil fruits):

1. Author **full** `subclass` / `feat` items matching `op5e/data/schemas/*.ts`
2. Run same activity + DAE pipelines as compendium features
3. Register devil fruit in vault `Devil Fruits/` separately (user approval)

## Validation before delivery

```bash
cd op5e
node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/validate-actor.ts --file ../Foundry/actors-json/<slug>.json
```

**Hard fail:** any `Compendium.op5e` string in the export (validator counts them as errors).

Manual Foundry spot-check: inventory visible, subclass row, background tab, feat Use buttons, effects show icons.
