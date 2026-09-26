---
name: generate-foundry-actor
description: >-
  Interactive workflow to build Blood & Brine OP5e Foundry actor JSON from compendium
  data — collects identity fields, walks level-gated advancement choices (Haki, fighting
  styles, equipment, subclass features), and writes workshop import JSON. Use when the
  user invokes this skill, asks to generate Foundry JSON for an NPC/PC/Actor, build a
  workshop actor template, or create a compendium-backed character sheet.
disable-model-invocation: true
---

# Generate Foundry Actor (OP5e)

Project-scoped skill for the Blood & Brine vault. Requires `op5e/` compendium source, `CONTEXT.md` domain language, and optional output to `Foundry/actors-json/`.

## Before you start

Read:

1. [CONTEXT.md](../../../CONTEXT.md) — **Actor** (not legacy Character/Crew folders)
2. [op5e/docs/automation-status.md](../../../op5e/docs/automation-status.md) — what compendium automation covers
3. [REFERENCE.md](REFERENCE.md) — packs, build paths, CR→level guidance
4. **[FOUNDRY-KB.md](FOUNDRY-KB.md)** — Foundry actor/item/activity/effect rules (**read before Phase 4**)

Default vault mode is read-only. **Do not write files** until the user approves the final build spec and output path.

## Workflow overview

```
Phase 1 — Identity (batch) → derive target level
Phase 2 — Advancement choices (one prompt at a time)
Phase 3 — Abilities & images (if not deferred)
Phase 4 — Generate JSON + optional vault note
```

Use `AskQuestion` when choices are enumerable. **One advancement prompt at a time** in Phase 2 — never dump all choices in one message.

---

## Phase 1 — Identity intake

Collect these **primary fields first** (single structured pass — list what's missing, then ask for the rest):

| Field | Required | Notes |
|-------|----------|-------|
| **Build path** | Yes | `class-based` (PC-style) or `monster-statblock` (CR + traits/actions, no class) |
| **Actor kind** | Yes (class-based) | `pc` → type `character`; `npc` → type `npc` |
| **Name** | Yes | Display name on sheet |
| **Race / species** | Yes (class-based) | Human, Fishman, Mink, Lunarian, Merfolk, Dwarves, Sky Islander, Augmented, Giant — see catalog |
| **Class** | Yes (class-based) | One of 9 OP5e classes |
| **Subclass** | Yes (class-based) | Filtered by class; needed before level ≥ subclass level (usually 3) |
| **Level** | Yes (class-based) | Character level — drives how far advancements resolve |
| **CR** | Yes (monster) / optional (class NPC) | Threat rating; for class NPCs can inform level if user doesn't specify |
| **Background** | Optional | From `op5e.backgrounds` (non-role entries) |
| **Role** | Optional | Ship role (`Role: Captain`, etc.) |
| **Power fork** | Optional | `additional-power` \| `devil-fruit` \| `neither` |
| **Additional power** | If fork = additional-power | Root feat name/slug from Ch. 7 powers |
| **Devil fruit** | If fork = devil-fruit | Campaign registry name or custom — may need manual item authoring |
| **Starting Haki** | Optional | Pre-level-8 Haki from race/background (e.g. Kuja Minor Haki, Captain Conqueror's path) — note in spec; class Haki choices still prompt at 8+ |

**Recommended defaults when user is vague:**

- Class-based NPC without level → suggest CR-to-level table in [REFERENCE.md](REFERENCE.md), confirm with user
- No background/role → allowed (see `npc-fighter-champion-minimal` in audit matrix)
- Devil fruit → warn that compendium automation is limited; capture name + type for manual item

After Phase 1, **confirm the build summary** and computed **target level** before Phase 2.

### Devil fruit builds (`powerFork: devil-fruit`)

When the user names a devil fruit, plan **embedded items on the final actor JSON** — not just a vault registry note.

1. **Fruit shell** — parent `feat` or `class` feature item: name (e.g. *Smart Smart no Mi*), type line (Paramecia / Zoan / Logia), `Ocean's Scorn` drawback (grant or embed)
2. **Ability items** — one Foundry item per active ability (child feats/features/spells on the actor), each with:
   - `system.activities` where applicable (attacks, saves, heals, utility)
   - DAE passives when the rule is always-on
   - Reflavored compendium content when possible — ask user: *"Reflavor an existing spell/feat?"* or *"Describe a new ability"*
3. **Authoring loop** (after Phase 1, before or interleaved with class advancements):
   - Ask fruit **type** (Paramecia / Zoan / Logia) if not known
   - Ask how many abilities at this level / tier
   - For each ability: name, action economy, damage/save, uses — offer to map from `op5e` spells, feats, or class features
   - Record in build spec under `devilFruit: { name, type, abilities: [...] }`
4. **Output** — all devil fruit items appear in the actor's `items` array in Phase 4 JSON (generated inline, not only compendium UUID refs)
5. **Optional** — user may also want `Devil Fruits/<Name>.md` registry entry; requires explicit approval (Tier 1 vault write)

Compendium has Haki + general feats; **no devil fruit compendium pack** — custom items are expected for campaign fruits.


From repo root:

```bash
cd op5e
node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-catalog.ts
node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-catalog.ts --class fighter
```

---

## Phase 2 — Advancement choices (sequential)

Target level from Phase 1 determines **which choice steps appear**. Run the choice enumerator, then prompt **one step at a time**:

```bash
cd op5e
node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-choices.ts --spec '{"classIdentifier":"fighter","subclassIdentifier":"champion","raceIdentifier":"human","level":10}'
```

Pass `--spec @path/to/build-spec.json` for longer specs. Re-run after each user answer with updated `choices` in the spec (see REFERENCE for spec shape).

For each pending step the script returns:

1. Show **level**, **source** (race/class/subclass/background/role), **title**, **hint**
2. Present **numbered options** (name + short id/slug)
3. For **Haki** steps (`op5eHakiChoice`): only show slugs from `getAvailableHakiSlugs` given prior Haki picks — same rules as `op5e/scripts/haki-advancement-lib.mjs`
4. Record `{ stepId, level, uuid | uuids[] }` in the build spec
5. Re-run `list-choices.ts` until `pending: []`

**Skip / manual by design** (inform user, don't block):

- ASI (+2/+1) — record ability bumps in Phase 3 unless user wants defaults
- Background "bonus feat" narrative picks — offer general feat list from catalog or defer
- Caster mod/trick/creation picks — out of compendium combat automation scope
- Fighting style sub-options inside a granted Fighting Style feature — text pick unless ItemChoice pool exists

---

## Phase 3 — Abilities, HP, images

After advancements:

| Field | Default |
|-------|---------|
| Ability scores | Standard array for level ≤ 4; ask method (array / point-buy / manual / "match CR") |
| HP | Let dnd5e compute from class hit die + CON unless monster path |
| Portrait / token | Optional paths for `img` and `prototypeToken.texture.src` |
| Faction / vault note | Ask if user wants a `World/Factions/…` actor page — **requires explicit approval** |

---

## Phase 4 — Generate output

**Prerequisite:** [FOUNDRY-KB.md](FOUNDRY-KB.md) — full embedded items, activities, inventory, currency.

1. Assemble **build spec** → `op5e/dev/generate-foundry-actor/specs/<slug>-spec.json`
2. Build + validate:

```bash
cd op5e
npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>.json
npm run actor:validate -- --file ../Foundry/actors-json/<slug>.json
```

3. **Must pass:** race, class, **subclass**, **background**, weapons in `items[]`, `system.currency.gp`, `system.activities` on activatable feats, effect `img` icons, **zero** `Compendium.op5e` references (standalone workshop sheet — imports anywhere without op5e compendium)
4. Write JSON only after user approval; optional vault note after approval

Spec examples: `op5e/dev/generate-foundry-actor/specs/`. Builder: `compendium-resolver.ts` + `standalone.ts` + `ensureFeatureActivities()`.

Optional compendium audit:

```bash
npm run audit:characters
```

Automation layers (do not promise beyond compendium):

- **Phase 1 data**: ItemGrants, activities, uses, `@scale` — see automation-status.md
- **Phase 2 DAE**: passive effects on items
- **Phase 3 hooks**: `op5e/scripts/feature-hooks.mjs` — only for documented features

---

## Monster-statblock path

When `buildPath: monster-statblock`:

- Phase 1: name, CR, type, size, alignment, key stats (or full statblock paste)
- Skip Phase 2 class advancements
- Model after `Monster Manual/*.md` statblock fences + existing workshop JSON patterns
- Use `scripts/foundry_statblock.py` inverse patterns only as reference — generation is forward (JSON → note), not reverse

---

## Example invocation

User: `/generate-foundry-actor` or "use the generate foundry actor skill"

Agent:

1. Phase 1 — ask for build path, name, **race/species**, class, subclass, level, CR, background, role, power fork, starting Haki notes
2. Confirm summary → run `list-choices.ts`
3. Loop prompts until choices complete
4. Phase 3 — abilities/images
5. Show JSON preview → ask approval → write file

---

## Additional resources

- Compendium packs, spec schema, CR table: [REFERENCE.md](REFERENCE.md)
- Live sync vs workshop templates: [Foundry/_index.md](../../../Foundry/_index.md)
- Character creator wizard (Foundry runtime): `game.op5eCharacterCreator.launch()` — parallel to this skill, not a substitute for vault-side JSON authoring
