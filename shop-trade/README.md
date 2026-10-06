# Shop and Trade (dnd5e)

Standalone module for any dnd5e world (Foundry 13, dnd5e 5.x). No dependency on op5e. Shops are stored in a world setting, never in compendiums.

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
`node --test shop-trade/test/currency.test.mjs` (coin math) and `node dev/harness/shop-trade.mjs` from `op5e/` (live: buy, sell, trade, funds, stock, permissions, export/import).

## Not yet
Trade window UI, sell UI, an NPC merchant sheet type, coin-mode live test in a vanilla-currency world, a player-session socket test.
