# Shop & Trade

A Foundry VTT module (v13, dnd5e 5.0+) for shops and player trades. The GM shows a shop to chosen players, every purchase or sale is a request the GM approves, and players can trade items with each other. Works with dnd5e coins or a single currency.

- Spec: [SPEC.md](SPEC.md). Shop behaviour and API (`game.shopTrade`): [docs/SHOP.md](docs/SHOP.md).
- Other modules add shop types with `game.modules.get("shop-trade").api.registerTemplateSet(id, { label, types, stock? })` from their `ready` hook.
- Install in Foundry with the manifest URL `https://raw.githubusercontent.com/CallMeKakashi/OnePiece5E/main/shop-trade/module.json`.
- Release: bump `version` and the `download` tag in `module.json`, then `gh release create shop-trade-vX.Y.Z --latest=false`. The workflow attaches `shop-trade.zip`.
- Tests: `npm ci && npm test` in this folder.
