# OP5e Character Sheet Automation Status

Single reference for what's automated in compendium data, what stays manual at the table, and what needs a custom Foundry module. Generated from the static audit harness — re-run `npm run audit:characters` to refresh counts.

**Last updated:** 2026-05-30 — expanded audit tiers (subclass smoke + power hosts).

## Summary

| Layer | Status |
|-------|--------|
| **Phase 1** (combat sheet) | ✅ Clean — 11/11 curated builds, 0 errors/warnings |
| **Phase 1 full matrix** | ⚠️ 138/138 builds pass errors bar; 1470 text-only warnings (subclass/power expansion backlog) |
| **Phase 2** (DAE passives) | ✅ Backlog empty on curated matrix |
| **Phase 2b** (partial / informational) | 4 wired, 1 partial, 2 deferred |
| **Phase 3** (module hooks) | 10 automated, 3 still manual/deferred |
| **Out of scope** | Caster mod/trick combat automation, Devil Fruit, background feat picks |

## Audit tier coverage

Builds are generated at audit time from compendium data (`dev/character-sheet-audit/build-factory.ts`) — no hand-maintained subclass list.

| Tier | Description | Builds | Command | Phase 1 bar |
|------|-------------|--------|---------|-------------|
| **0** | Curated diverse matrix (classes, bg/role/power samples) | 11 | `npm test`, `npm run audit:characters` | 0 errors, 0 warnings |
| **1** | `AUTO_SUBCLASS_SMOKE` — one minimal build per subclass | 80 | `npm run audit:characters:full` | errors only |
| **2** | `AUTO_POWER_HOST` — one L20 host per additional-power root | 47 | `npm run audit:characters:full` | errors only |
| **Combined full** | Tier 0 + 1 + 2 (deduped by build id) | **138** | `npm run audit:characters:full` | 0 errors, 1470 warnings |
| **4** | Foundry spot-checks (manual) | 3–9 builds | see checklist below | not automatable in Node |

**Subclass coverage:** 80/80 (Tier 1) · **Additional powers:** 47/47 roots (Tier 2; was 2/47 in curated matrix only)

Full-matrix warnings are almost entirely `text-only` on subclass features not yet wired for combat sheet automation (~360 unique features). Curated matrix remains the CI gate; full audit is for coverage discovery.

## Phase 1 — Fully automated

These wire through ItemGrants, `@scale` formulas, `uses.max`, granted weapons, and attack activities:

- Class feature grants at each level (all 9 classes)
- Scale-backed pools: Rage uses, Spirit points, Sneak Attack dice, Bardic Inspiration die, Favored Mark damage, Action Surge / Indomitable uses, Fighter Extra Attack count
- Activatable features with `activation.type`, `uses.max`, and damage/heal formulas where applicable
- dnd5e 5.1 `system.activities` generated at build time for activatable class/subclass/Haki feats (see `data/helpers/activities.ts`)
- Equipment packs via `equipment-grants.ts` (stack sizes applied at runtime — see below)
- Racial features with DAE patterns (darkvision, swim speed, natural AC, etc.)

## Phase 2 — DAE passives (wired)

| Feature | Classes | Wiring |
|---------|---------|--------|
| Unarmored Defense | Barbarian, Brawler | AC formula override |
| Unarmored Movement | Brawler | Walk speed `@scale.brawler.unarmored-movement` |
| Fast Movement | Barbarian | +10 ft walk |
| Feral Instinct | Barbarian | `flags.dnd5e.initiativeAdv` |
| Quick On The Draw | Marksman | `flags.dnd5e.initiativeAdv` |
| Jack of All Trades | Bard | `flags.dnd5e.jackOfAllTrades` |
| Expertise | Rogue, Bard | Trait advancement `mode: "expertise"` |
| Evasion | Rogue, Brawler | `flags.dnd5e.evasion` |
| Elusive / Reliable Talent | Rogue | `flags.dnd5e.elusive`, `flags.dnd5e.reliableTalent` |
| Primal Champion | Barbarian | +4 STR/CON |
| Vigilant Gaze | Marksman | Blindsight 30 ft |

## Phase 2b — Partial or informational

| Feature | Status | Automated | Manual / module |
|---------|--------|-----------|-----------------|
| **Diamond Soul** | Module | Save prof DAE; failed-save prompt spends 1 spirit and rerolls (`scripts/feature-hooks.mjs`) | Player must confirm each reroll; needs save DC on roll data |
| **Combat Medicine** | Module | Natural armor DAE; bonus-action temphp; **use pool synced**; **base EM redirects to Combat Medicine item** on activation | Enhancement swap as bonus action (manual) |
| **Danger Sense** | Module | Dex-save advantage when not blinded/deafened/incapacitated (`dnd5e.preRollSavingThrow`) | Visible effect source (GM); rage reaction attack redirect — **no dnd5e hook to retarget attacks** (manual reaction item) |
| **Brutal Critical** | Wired (info) | `@scale.barbarian.brutal-critical` in chatFlavor | Roll extra crit dice manually |
| **Extra Attack** | Wired (info) | Fighter `@scale`; other classes static chatFlavor | Attack action rule — no extra sheet button |
| **Unarmored Movement Improvement** | Deferred | — | Vertical-surface movement |
| **Perfected Subject** | Deferred | — | Test Subject companion actor |
| **haki-tier** scale | Informational | Scaffold only | Haki feat tier display |

## Manual by design

| Track | Notes |
|-------|-------|
| **Backgrounds / roles** | Feat choices and narrative live in background HTML; equipment packs wired |
| **General feats** | Description + optional uses; no class-grant wiring |
| **Fighting Style / ItemChoice** | Granted pool; player picks at level-up |
| **Reckless Attack, Sneak Attack triggers, etc.** | Rule-text features; no activatable button |
| **Caster classes** (Gadgeteer, Medic, Savant) | Progression/scales wired; per-mod/trick/creation combat automation out of scope |

## Phase 3 — Module hooks (`scripts/`)

### Starting equipment stack sizes

dnd5e 5.1 `ItemGrant` configuration only stores `uuid` + `optional` (no native quantity). OP5e encodes stack sizes in compendium data and applies them when advancement completes:

| Storage | Example |
|---------|---------|
| `flags.op5e.grantQuantities` on background/class/role items | `{ "Compendium.op5e.items.<id>": 3 }` |
| `configuration.op5eGrantQuantities` on ItemGrant advancements | same map (survives in compendium JSON; may be stripped from live `advancement.configuration` by the dnd5e schema) |
| **Runtime field on actor items** | `system.quantity` (consumables/loot/stacks) |

Hook: `dnd5e.preAdvancementManagerComplete` in `scripts/equipment-grant-advancement.mjs` — mutates both `toCreate` and `toUpdate` before `createEmbeddedDocuments` / `updateEmbeddedDocuments`. Matches granted items by `flags.dnd5e.sourceId` (compendium UUID).

Vitest: `test/equipment-grant-advancement.test.mjs`, `test/equipment-grants.test.mjs`.

Registered from `compendium.mjs` via `registerOp5eFeatureHooks()`:

| Feature | File | Hook(s) | Vitest |
|---------|------|---------|--------|
| **Danger Sense** | `feature-hooks-lib.mjs`, `feature-hooks.mjs` | `dnd5e.preRollSavingThrow` — Dex advantage unless blinded/deafened/incapacitated | `test/feature-hooks.test.mjs` |
| **Diamond Soul** | same | `dnd5e.rollSavingThrow` — confirm dialog, spend 1 spirit use, `rollAbilitySave` again | same |
| **Combat Medicine pool** | same | `updateItem` — mirror `system.uses.value` between Combat Medicine and Experimental Medicine | same |
| **Combat Medicine redirect** | same | `dnd5e.preUseActivity` — block base EM, invoke Combat Medicine item instead | same |
| **Relentless Rage** | same | `dnd5e.damageActor` — Con save prompt at escalating DC (`flags.op5e.relentlessRageDc`); `dnd5e.restCompleted` resets DC | same |
| **Flaming Duality** | same | Two activities (Ignited Form / Godspeed Form); `dnd5e.preUseActivity` applies 1 min ActiveEffect; switch without extra use; Ultimate Duality unlimited + double speed; Improved Ignite DR; Empowered Godspeed OA disadvantage via `dnd5e.preRollAttack` | `test/lunarian-automation.test.mjs` |
| **Flame Investure** | same, `races/lunarian.ts` | ItemGrants: Fire Bolt (L0), Elemental Armor (L3), Fireball (L5); `preUseActivity` opens cast dialog; Fireball consumes trait 1/LR use | same |
| **Rage** | same | `preUseActivity` — applies 1 min ActiveEffect (B/P/S resist, Str adv checks/saves, +@prof melee damage) | `test/feature-hooks.test.mjs` (helpers) |
| **Inner Beast** (Mink) | same | `preUseActivity` — 1 min Str/Dex check advantage +10 ft speed | — |
| **Bubble Floater** (Merfolk) | same | `preUseActivity` — 8 hr +20 ft walk | — |
| **Giant's Endurance** | same | `damageActor` stores `flags.op5e.lastDamageTaken`; reaction Use rolls 1d12+CON and heals back | — |

Stable feature item IDs: `scripts/feature-ids.mjs` (includes Lunarian + `OP5E_CREATION_IDS`).

### Still manual / deferred (module)

1. **Danger Sense** — rage reaction redirect; “visible effect” adjudication. dnd5e exposes `preRollAttack` / `rollAttack` but no hook to swap the attack target mid-resolution; use the Danger Sense reaction item manually (or a future midi-qol workflow).
2. **Combat Medicine** — enhancement swap automation (bonus action to change EM enhancement while active)
3. **Unarmored Movement Improvement** — vertical surfaces / liquids movement
4. **Perfected Subject** — companion actor (**stub**: Bio-Engineer Test Subject requires linked NPC actor, initiative, and EM-adjacent automation — out of scope for Phase 3)
5. **Relentless Rage** — instant-death / massive-damage edge cases; rage detection depends on Rage active effect or `rage` status
6. **Monstrous Transformation** — transformation state machine
7. **Full mod/trick/creation combat** — Gadgeteer, Medic, Savant

## Foundry spot-check checklist

Use test-matrix builds at levels **1 / 5 / 10 / 15 / 20**.

### 1. Brawler / Open Hand / Acrobat

- [ ] Unarmored AC = 10 + Dex + Wis; Unarmored Movement speed bonus from scale
- [ ] L14+ Diamond Soul: con/int/wis/cha saves show proficiency; failed save offers spirit reroll
- [ ] Extra Attack chatFlavor shows 2 attacks; Deflect Missiles / Brace for Impact show formulas

### 2. Barbarian / Berserker / Helmsman

- [ ] Brutal Critical `@scale.barbarian.brutal-critical` in chat flavor at L9+
- [ ] Danger Sense: reaction button present; Dex-save advantage auto when not blinded/deafened/incapacitated
- [ ] Relentless Rage (L11+ barbarian): drop to 0 HP while raging → Con save dialog; DC escalates (+5 per success); resets on rest
- [ ] Extra Attack chatFlavor shows 2 attacks

### 3. Fighter / Champion / Captain

- [ ] Extra Attack chatFlavor shows `@scale.fighter.extra-attack` at L5/11/20

### 4. Medic / Field Surgeon / Shipwright

- [ ] Combat Medicine natural armor AC = 10 + Wis + prof
- [ ] Combat Medicine: bonus action, temp HP = 4×level + WIS (clicking base EM auto-redirects to Combat Medicine item)
- [ ] Combat Medicine and Experimental Medicine use counts stay equal after either is spent

### 5. Rogue / Assassin / Archaeologist / Navigator

- [ ] Expertise Trait choices at L1/L6; 2× prof on selected skills
- [ ] Assassinate uses `@prof` per long rest

### 6. Marksman / Sniper / Master at Arms

- [ ] Quick On The Draw: initiative advantage on sheet
- [ ] Favored Mark damage uses `@scale.marksman.favored-mark`

### 7. Bard / Lore / Author / Cook

- [ ] Jack of All Trades flag active; Bardic Inspiration uses scale die

### 8. Gadgeteer / Alchemist / Scholar

- [ ] Class grants and scales present; mod/trick automation manual

### 9. Savant / Burning Passion / Six Powers Adept

- [ ] Channel Conviction features present; full combat automation manual

### 10. Lunarian (any class, levels 1 / 5 / 10 / 15)

- [ ] Flaming Duality: Use Ignited Form or Godspeed Form activity; resistances/speed on sheet; switch form without spending another use
- [ ] L5 Empowered Godspeed: opportunity attacks vs Godspeed form at disadvantage
- [ ] L10 Improved Ignite: Ignited resists all non-psychic
- [ ] L15 Ultimate Duality: unlimited Flaming Duality uses; Godspeed doubles walk speed
- [ ] Flame Investure: Fire Bolt on sheet at L0; Elemental Armor at L3; Fireball at L5; Use opens cast menu; Fireball spends 1/LR on trait

## How to run the audit

```bash
cd op5e
npm run build              # rebuild compendium JSON + DB
npm test                   # vitest — Tier 0 curated (11 builds), Phase 1 clean bar
npm run audit:characters   # Tier 0 only → dev/character-sheet-audit/output/audit-report.json
npm run audit:characters:full   # Tier 0+1+2 (138 builds); fails only on Phase 1 errors
```

Report fields:

- `stats.phase1Errors` / `phase1Warnings` — curated must be 0/0; full matrix tracks warning backlog
- `phase2Backlog` — DAE passives still unwired (target: empty on curated)
- `phase2bStatus` — partial/deferred checklist with wiring notes
- `builds[].pass` — per build at levels 1/5/10/15/20

### Tier 4 — Foundry manual validation

Static Node audit cannot execute `AdvancementManager`, roll attacks, or verify DAE at runtime. After data changes, spot-check curated builds in Foundry at levels 1/5/10/15/20 (checklist below). Full-matrix builds add subclass/power coverage but do not replace Foundry validation.

## Related docs

- [phase2-passive-backlog.md](./phase2-passive-backlog.md) — Phase 2 scope and checklist detail
