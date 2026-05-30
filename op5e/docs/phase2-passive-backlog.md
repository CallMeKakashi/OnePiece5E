# Phase 2 Passive Automation Backlog

Phase 1 (combat sheet) is complete when ItemGrants, `@scale` formulas, `uses.max`, granted weapons, and attack activities are wired. **Phase 2** covers passive mechanics that need DAE (Dynamic Active Effects) or similar sheet automation.

Generated from `npm run audit:characters`. Re-run the audit to refresh counts in `dev/character-sheet-audit/output/audit-report.json` (`phase2Backlog` array, `phase2bStatus` checklist).

**Last updated:** 2026-05-30 — Phase 2c pass: Combat Medicine EM activation, Danger Sense reaction, Quick On The Draw initiative, Extra Attack chatFlavor on martial classes. See [automation-status.md](./automation-status.md) for full reference.

**Last audit:** Phase 2 backlog **0 entries**; Phase 2b: 4 wired, 3 partial, 2 deferred.

## Scope

| Phase | Wire | Defer |
|-------|------|-------|
| **1** | ItemGrants, scales, uses, weapons, attack rolls | — |
| **2** | AC formulas, Expertise, speed bonuses, initiative, natural armor, save profs | Narrative/social features |
| **2b** | Informational scale refs, partial features with documented gaps | Conditional saves, companion modules |
| **Out of scope** | Devil Fruit, full mod/trick/creation combat automation | ItemChoice UI-only verification |

## Phase 2b checklist (audit `phase2bStatus`)

| Feature | Classes | Status | Wiring / reason |
|---------|---------|--------|-----------------|
| **Unarmored Defense** | Barbarian, Brawler | ✅ Done | `overrideValue` on AC formula |
| **Unarmored Movement** | Brawler | ✅ Done | `addBonus` walk speed → `@scale.brawler.unarmored-movement` |
| **Unarmored Movement Improvement** | Brawler L9 | ⏸ Deferred | Vertical-surface movement — no clean DAE |
| **Fast Movement** | Barbarian | ✅ Done (Phase 1) | +10 ft walk via DAE |
| **Feral Instinct** | Barbarian | ✅ Done (Phase 1) | `flags.dnd5e.initiativeAdv` |
| **Quick On The Draw** | Marksman | ✅ Done (Phase 2c) | `flags.dnd5e.initiativeAdv` |
| **Jack of All Trades** | Bard | ✅ Done (Phase 1) | `flags.dnd5e.jackOfAllTrades` |
| **Expertise** | Rogue, Bard | ✅ Done | Trait advancement `mode: "expertise"` |
| **Diamond Soul** | Brawler | ⚠️ Partial | DAE save prof on con/int/wis/cha (str/dex from L1). Spirit reroll deferred — custom module |
| **Combat Medicine** | Field Surgeon | ⚠️ Partial | Natural armor DAE + bonus-action temphp on Combat Medicine item. Enhancement swap + EM use sync deferred |
| **Danger Sense** | Barbarian | ⚠️ Partial | Reaction activation for rage redirect. Conditional Dex-save adv manual |
| **Brutal Critical** | Barbarian | ✅ Done (info) | `chatFlavor` → `@scale.barbarian.brutal-critical` |
| **Extra Attack** | Fighter + martial classes | ✅ Done (info) | Fighter `@scale`; others static chatFlavor |
| **Perfected Subject** | Bio-Engineer | ⏸ Deferred | Test Subject companion — requires companion actor module |

## Phase 2c quick wins (informational / activation)

| Feature | Class | Change |
|---------|-------|--------|
| Extra Attack | Barbarian, Brawler, Marksman | chatFlavor: 2 attacks |
| Extra Attack | Field Surgeon, Bruiser | chatFlavor: 2 attacks |
| Deflect Missiles | Brawler | chatFlavor with reduction formula |
| Brace for Impact | Brawler | chatFlavor with fall reduction formula |

## Tracks 2 & 3 (backgrounds, roles, feats, races)

| Track | Scope | Result |
|-------|-------|--------|
| **Track 2** — backgrounds + roles | Combat-relevant role/background features | **No ItemGrant wiring** — features live in background HTML (feat choices, narrative). Equipment packs wired via `equipment-grants.ts`. Foundry: manual feat pick at creation. |
| **Track 3** — general feats + racial features | Same bar as Phase 1 where activatable | **Racial features** with DAE patterns wired (darkvision, swim, AC, etc. in `racial-features/`). **General feats** remain description + optional uses; no Phase 1 gaps in test matrix builds. Racial **feat** choices (expertise in text) deferred — Trait advancement at feat level not in data model. |

## Unused scales (informational)

Excluded from audit `unused` list via `INFORMATIONAL_SCALES`:

- `haki-tier` — Haki feat tier scaffold (all martial/caster classes)

Now referenced (no longer unused):

- `brutal-critical` — Barbarian Brutal Critical `chatFlavor`
- `extra-attack` — Fighter Extra Attack `chatFlavor`

## Foundry spot-check

See [automation-status.md](./automation-status.md) for the full checklist across all test-matrix builds.

## Related commands

```bash
npm run audit:characters   # Phase 1 audit + phase2Backlog + phase2bStatus
npm run build              # rebuild compendium JSON + DB
npm test                   # includes Phase 1 clean assertion + phase2b checklist
```
