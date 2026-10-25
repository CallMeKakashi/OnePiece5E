# Spec: shop-trade, a standalone shop and trade module

Pulls the shop out of op5e (`op5e/scripts/shop/`, about 1,000 lines) into its own Foundry module. op5e then drops its copy; `shop-trade` is the only shop.

## Decisions (grilled 2026-10-25)
1. Lives in `shop-trade/` in this repo: own `module.json` (id `shop-trade`, title "Shop & Trade", Foundry 13, dnd5e 5.0+, no required modules), `scripts/`, `templates/`, `lang/`, `styles/`, `test/`.
2. Code copied from op5e; `MODULE_ID` becomes `shop-trade`, CSS and element ids lose the `op5e-` prefix. The GM item search no longer uses op5e's extra sources: it searches any Item compendium.
3. Ships only the fantasy template set, stocked from a compendium chosen in settings. `game.shopTrade.registerTemplateSet(id, set)` lets other modules add sets; op5e registers its One Piece set (stocked from its Shop Catalogues journal) through it.
4. Migration: on first load in a world, copy op5e's `shops`, `shopRequests`, `usedShopNames` and the shop settings into `shop-trade` keys. op5e no longer registers these settings, so they are read raw from the world settings storage. Old values stay untouched.
5. The shop is removed from op5e (code, templates, CSS, lang, tests, docs). op5e recommends `shop-trade` and keeps only the One Piece template set. Removal ships only after a `shop-trade` release exists.
6. Releases: a stable manifest URL (raw `shop-trade/module.json` on `main`) whose `download` points at a tagged release asset, so it does not clash with op5e's `releases/latest`.
7. Tests: the moved unit tests run in CI. Live check in the bb-rehearsal world only: buy, sell, trade, migration.

## Tickets
a) Scaffold `shop-trade/` and move the code. b) Replace the GM item search. c) Migration from op5e's keys. d) `registerTemplateSet`; op5e One Piece set as an add-on. e) Remove the shop from op5e. f) Manifest and release setup. g) Live check in bb-rehearsal.
