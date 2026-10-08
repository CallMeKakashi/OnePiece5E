// Drives the GM side of the shop demo from a headless GM (Automation) so the browser pane can be a player's screen.
// Usage: node dev/harness/demo-gm.mjs <setup|show|showall|approve|decline|hide|reset>   (test world only)
import { withFoundry } from "./drive.mjs";
const action = process.argv[2] ?? "setup";
await withFoundry(async (page) => {
  const r = await page.evaluate(async (action) => {
    const T = game.shopTrade, p1 = game.users.getName("Test Player 1"), p2 = game.users.getName("Test Player 2");
    const shop = () => T.list().find((s) => s.name === "Orange Town Armory");
    if (action === "reset" || action === "setup") {
      for (const a of game.actors.filter((x) => x.name.startsWith("[DEMO]"))) await a.delete();
      for (const s of T.list()) await T.deleteShop(s.id);
      await game.settings.set("op5e", "shopRequests", []);
      if (action === "reset") return "reset";
      const user = p1 ?? await User.create({ name: "Test Player 1", role: CONST.USER_ROLES.PLAYER });
      if (!p2) await User.create({ name: "Test Player 2", role: CONST.USER_ROLES.PLAYER });
      const baptiste = await Actor.create({ name: "[DEMO] Baptiste", type: "character", ownership: { default: 0, [game.users.getName("Test Player 1").id]: 3 }, system: { currency: { gp: 5000000 } } });
      await Item.create({ name: "Old Compass", type: "loot", system: { price: { value: 800, denomination: "gp" }, quantity: 1 } }, { parent: baptiste });
      const gen = await Actor.create({ name: "[DEMO] Old Man Gen", type: "npc", img: "icons/svg/mystery-man.svg", system: { currency: { gp: 500000 } } });
      const id = await T.createShop("Orange Town Armory", { markup: 10, type: "armory", keeper: { actorId: gen.id } });
      return `ready: ${T.list().length} shop, ${shop().items.length} items`;
    }
    if (action === "show") { await T.show(shop().id, [p1.id]); return "shown to Test Player 1"; }
    if (action === "showall") { await T.show(shop().id, "all"); return "shown to everyone"; }
    if (action === "hide") { await T.hide(shop().id, "all"); return "hidden"; }
    const pend = T.requests().filter((r) => r.status === "pending");
    if (action === "approve" || action === "decline") { if (!pend.length) return "nothing pending"; const r = await T.decide(pend[0].id, action === "approve", action === "decline" ? "Come back with more Berries" : ""); return `${action}: ${r.status}`; }
  }, action);
  console.log(r);
});
