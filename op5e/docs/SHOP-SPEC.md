# Shop: spec (v2)

Replaces the bare v0.1 window. Part of op5e (`scripts/shop/`), uses only dnd5e, so it could be split out later.

## Goals
1. The GM runs a shop like a scene: starts it, shows it to the players who are in the scene (or everyone), watches who is looking, and approves every transaction.
2. Players get a storefront that reads like a shop: categories, clear prices in the world's currency, an honest "can I afford this" signal, a cart, and a visible status after they send it.
3. Nothing moves (money, items, stock) without GM approval. The GM can still act directly through the API.

## Roles and flows

### GM: start a shop
- Actors sidebar button "Shops" (GM) opens the Shop control panel. "Start a shop" asks for: shop name (required), who runs it (an existing NPC actor, or a generic shopkeeper with a typed name), markup percent.
- An NPC keeper's portrait and name are shown to players and its own wealth pays for what it buys and receives what it sells. A generic keeper has only a name and a generic portrait, no wallet (the shop buys and sells without limit).
- The GM stocks the shop by dragging items from any compendium, folder or sidebar onto the panel. Each row has editable price and stock (empty = unlimited) and a remove button. Prices default to the item's price, in the world's currency.

### GM: show the shop
- "Show to everyone" shows it to all non-GM users at once. Per-player toggles show it to chosen players only. "Hide from everyone" (or per player) closes it on their screens and revokes access.
- When shown, the storefront opens on the player's screen automatically for their character (the one assigned to them, else the first they own; a picker appears if they own several). A "Shop" button in their Actors sidebar reopens it while the shop is shown to them.
- The panel lists every non-GM user with: not shown, shown, or looking now (live: set when their storefront is open, cleared when it closes).

### Player: browse and request
- Header: shop name, shopkeeper portrait and name, the character's purse in the currency name ("300,000 Berries").
- Tabs Buy and Sell. Category chips with counts (Weapons, Armor and gear, Supplies, Tools, Goods, Scrolls) filter the list.
- A row shows icon, name, a one-line note (stock left, or "you have 3"), the price with the currency name, and one of: "You can afford it", "N short" (shown in red, the add button stays but the cart total warns), "Sold out".
- Add and remove buttons build a cart. The cart footer shows the total, the purse after the purchase, and a warning when it exceeds the purse. "Send to GM" is the only way to ask. Sell prices are the shop's sell ratio of the item price; equipped items are not offered.
- After sending, the player sees the request as Waiting, then Approved or Declined (with the GM's reason). A waiting request can be cancelled.

### GM: approve
- Pending requests appear in the panel (and as a whispered chat line and a notification) with who, which items, quantities, total and the character's current purse. Approve runs the sale on the GM client: funds, stock, items, merchant wallet, a chat receipt. If anything changed meanwhile (stock gone, not enough money) the request is declined with the reason and nothing is half-applied. Decline takes an optional reason.
- The panel keeps the last ten decisions.

## Data
- World setting `op5e.shops`: `{ id, name, markup, keeper:{actorId|null,name,img}, merchantId, openAll, visibleTo:[userId], items:[{key,uuid,name,img,type,price,stock}] }`.
- World setting `op5e.shopRequests` (last 60): `{ id, shopId, shopName, actorId, actorName, userId, userName, kind: buy|sell, lines:[{key|itemId,name,img,qty,amount}], total, status: pending|approved|declined|cancelled, note, at, decidedAt }`.
- Socket `module.op5e`: operations from players (`request`, `cancel`, `viewing`, `buy`, `sell`) executed only by the active GM, with a reply; broadcast events `open`, `close`, `decided`, `newRequest`.

## Rules and edge cases
- Currency name comes from `CONFIG.DND5E.currencies` (Berries in this world); numbers use thousands separators. A world with one currency is single-currency automatically.
- Visibility is checked on the GM client for every request; a closed or hidden shop refuses requests. A player can never write settings; everything goes through the GM.
- Stock and funds are checked when the cart is sent and again on approval.
- No GM online: sending fails with a clear message after 10 seconds.
- A shop deleted or hidden while a storefront is open: the window closes (hidden) or shows "This shop is gone".
- Prices use integer maths (800000 with 10% markup is 880000).

## Acceptance (automated: `dev/harness/shop-trade.mjs`, `dev/harness/shop-approval.mjs`)
- Start with a generic and with an NPC keeper; keeper shown and wallet used only for an NPC.
- Show to all, to one player; storefront opens on that player's client only; hide closes it.
- Presence: GM sees a player "looking" while the storefront is open and not after it closes.
- Player cart to request; nothing changes until approve; approve applies; decline leaves everything; request that became unaffordable is declined with a reason; cancel works.
- Prices show with the currency name; sold-out and short-of-funds states render.
- A player cannot approve, cannot see or request from a shop not shown to them.
