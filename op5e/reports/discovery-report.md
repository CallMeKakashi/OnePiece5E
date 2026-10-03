# Phase 0 — Discovery Report (op5e compendium upgrade)

Branch: `compendium-upgrade` (off `planning`). No source files modified; only this report was added.

## Key finding: the compendium is *generated*, not hand-edited

`data/src/**/*.ts` (TypeScript definitions) → `npm run build:json` (`data/build.ts`) → `packs-src/**/*.json` → `npm run build:db` (`data/compile.ts`, foundryvtt-cli) → `packs/` (LevelDB). `packs/` and `packs-src/` are **gitignored build output**. So:

- The "existing compendium" to preserve = `data/src` + `data/helpers`, not packs-src JSON.
- A baseline snapshot must therefore be produced by running the build (needs `npm install`; `node_modules` is currently absent).
- Plan's "new compiler" should extend `data/helpers/activities.ts` / `effects.ts` / `data/src`, not replace the pipeline.

## Existing architecture

| Layer | Path | Notes |
|---|---|---|
| Content definitions | `data/src/{backgrounds,class-features,classes,creations,feats,items,races,racial-features,subclasses}` | ~190 TS files; subclasses 81, class-features 65 |
| Builders/helpers | `data/helpers/{activities,advancement,effects,haki-advancement,icons,id,uuid}.ts` | `activities.ts` (422 lines) generates dnd5e 5.1 `system.activities` at build time; stable IDs via `id.ts` |
| Schemas | `data/schemas/*.ts` (zod) | class, common, feature, race, subclass only; **no activity/effect/item/actor schema** |
| Build | `data/build.ts`, `data/compile.ts`, `scripts/package.mjs` | `npm run release` |
| Runtime module | `scripts/*.mjs` (compendium, feature-hooks 713 lines, haki-advancement, crit-damage, equipment-grant, animations, wizard/) | Foundry-side hooks |
| Tests | `test/*.test.mjs` (15 vitest files) | Static/Node only; no live Foundry |
| Audits | `scripts/audit-compendium-{sourcebook,automation}.ts`, `dev/character-sheet-audit/` | Reports in `reports/` |
| Foundry harness | `dev/compendium-test/` (crit-damage only, in-world GM button), `dev/character-creator-test/` | Tiny; **not** a general harness; README references stale `op5e-compendium` ids/ports |
| Actor generation | `dev/generate-foundry-actor/` | Spec-driven NPC builder + validator (`validate-actor-lib.ts`) |
| Docs | `docs/automation-status.md` (2026-05-30), `docs/phase2-passive-backlog.md` | |

Module: `op5e` v0.2.7, Foundry v13, system dnd5e. Packs: backgrounds, class-features, classes, creations, feats, items, races, racial-features, subclasses (all `Item`). **No Actor, vehicle/ship, Monster Manual or NPC pack exists.**

## Existing compendium (from `reports/compendium-automation-audit.md`, may be stale)

Total 1973 items.

| Pack | Total | Ready | Needs automation | Reference-only |
|---|--:|--:|--:|--:|
| backgrounds | 56 | 0 | 0 | 56 |
| class-features | 746 | 175 | 30 | 541 |
| classes | 9 | 0 | 0 | 9 |
| creations | 426 | 344 | 82 | 0 |
| feats | 201 | 81 | 6 | 114 |
| items | 362 | 97 | 0 | 265 |
| races | 9 | 0 | 0 | 9 |
| racial-features | 84 | 21 | 0 | 63 |
| subclasses | 80 | 0 | 0 | 80 |
| **Total** | 1973 | 718 | 118 | 1137 |

Sourcebook audit (`reports/compendium-sourcebook-audit.md`): 591 headings, 558 "missing" — but heading-name matching is crude (matches section headings like "1st Level", flavor titles); treat as unreliable until Phase 4/6 rebuilds it from structured extraction. The `audit:sourcebook`/`audit:automation` scripts are reusable seeds for Phase 6.

Known gaps already recorded: ~118 items flagged "source damage/save not on an activity"; Phase 2b partials (Diamond Soul, Combat Medicine, Danger Sense, Brutal Critical, Extra Attack); deferred (Unarmored Movement Improvement, Perfected Subject); Midi/DAE columns are "no" across the board in the needs-automation list (Midi-QOL flags are largely unused in generated data).

## Sourcebook

Vault `Sourcebook/` markdown (user-confirmed authoritative input): Chapters 1–8, Appendix A/B, plus `Sourcebook.md`. Structure is one-md-per-entry under chapter folders, so page numbers are **not** available — "source location" will be the file path + heading, not a page (deviation from plan §7, needs your OK implicitly; I'll proceed with file path unless told otherwise).

## Environment

- Foundry at `http://localhost:30000`: **not reachable right now** (HTTP 000) → integration tests would report `FOUNDRY_UNAVAILABLE`. Needs the server started before Phase 10+.
- `op5e/node_modules` absent → `npm install` required before build/test.
- Vault-level fixtures: tests write into `../Foundry/actors-json/` (junction); see `op5e/CLAUDE.md`.
- Installed Foundry/dnd5e/Midi/DAE versions unverified (will read from the live install once running).

## Reusable vs. obsolete

Reusable: build pipeline, `activities.ts`, `effects.ts`, zod schemas (extend), both audit scripts, `feature-hooks.mjs`, `generate-foundry-actor` validator, `dev/compendium-test` as seed for the harness.
Likely obsolete/stale: `dev/compendium-test` README ids/ports; `reports/*` (dated); `tmpdist/`.

## Proposed adjustments to the pasted plan

1. Extend the existing TS generator instead of writing a second compiler (preserves stable IDs and working automation by construction).
2. Baseline = build output of current `HEAD` committed under `op5e/baseline/` (immutable) + manifest of ids/uuids/activities/effects.
3. No NPC/ship/vehicle packs exist yet; Monster Manual lives in the vault (`Monster Manual/`). Adding Actor packs is new scope — confirm before Phase 4 extraction of NPC/ship content.
4. Harness: grow `dev/compendium-test` into a Foundry module + a Playwright/CDP driver script against :30000.

## Next steps (awaiting your go for Phase 1+)

1. `npm install`, run `npm test` + `npm run build` to get a clean baseline and confirm tests pass at HEAD.
2. Snapshot baseline.
3. Classify existing docs (Phase 2) via static activity/effect checks.
