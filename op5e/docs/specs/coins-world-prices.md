# Spec: op5e item prices in a coins world

Compendium prices are Berries amounts stored under `gp`. With `berriesCurrency` on, that slot is Berries, so prices are right. With it off (a dnd5e coins world), 1,000,000 Berries reads as 1,000,000 gp.

## Decisions (grilled 2026-10-25)
1. Covers all op5e item prices, not only magic items.
2. Rate: 1 GP = 10,000 Berries. Compendium data stays in Berries.
3. A `preCreateItem` hook runs only when `berriesCurrency` is off, for items whose `_stats.compendiumSource` starts with `Compendium.op5e.`. Hand-made items, whole-actor imports and items already in a world are left alone.
4. Rounding: the largest coin that gives a whole number (gp, then sp, then cp); anything under 1 cp becomes 1 cp.
5. `berriesToCoin(berries)` is a pure function with a vitest unit test. No live Foundry test.

## Tickets
- Conversion function and unit test.
- `preCreateItem` hook and docs refresh (`FUTURE-WORK.md`: CI and walkthrough runner are already done; the walkthrough-script merge is dropped).
