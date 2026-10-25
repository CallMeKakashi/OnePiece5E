# Shop and trade (part of op5e)

Shops are stored in an op5e world setting, never in compendiums. The code lives in `scripts/shop/` and uses only dnd5e, so it could be split out later.

## Use (macro or console)
```js
const shop = await game.shopTrade.createShop("Armory", { markup: 10 });       // GM
await game.shopTrade.addItem(shop, "Compendium.dnd5e.items.Item.xxxx", { price: 15, stock: 3 });   // price in gp, stock null = unlimited
game.shopTrade.open(shop, actor);                                              // window with Buy buttons; the GM can drop items on it
await game.shopTrade.buy(shop, actor.id, itemKey, 1);
await game.shopTrade.sell(shop, actor.id, itemId, 1);                          // pays the sell ratio (default 50%) of the item's price
await game.shopTrade.trade({ actorId, items: [{ itemId, qty }], money }, { actorId: other, items: [], money: 0 }, [userIdA, userIdB]);   // atomic, both sides confirm
game.shopTrade.exportShop(shop) / importShop(json)
```
Players call the same functions; the active GM's client does the work and re-checks ownership, funds and stock.

## Currency
Default: dnd5e coins, read from `CONFIG.DND5E.currencies`, with change making. Setting "Single currency": one coin only (for example a Berries world). A world whose config has one currency is always single.

## Tests
`npm test` (test/shop-currency.test.mjs, coin math) and `node dev/harness/shop-trade.mjs` (live: buy, sell, trade, funds, stock, permissions, export/import).

`createShop(name, { merchantId })` makes an NPC merchant: its own wealth pays for items it buys and receives what it sells for. `game.shopTrade.openTrade(actor)` opens the trade window.

## Not yet verified
The windows (Sell list, trade dialog), coin mode in a vanilla-currency world, and a player-session socket round trip are written but untested.
