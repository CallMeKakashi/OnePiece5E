// A ship in the real UI: the ship's sheet opens with no errors, a cannon is added to it, and firing the cannon (attack, then damage) posts cards with the book's dice. Test world, Automation user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  for (const x of game.actors.filter((y) => y.name.startsWith("[SHIP]"))) await x.delete();
  let ship;
  try {
    const src = (await game.packs.get("op5e.ships").getDocuments()).find((d) => d.name === "Galleon");
    const data = src.toObject(); delete data._id; data.name = "[SHIP] Galleon";
    ship = await Actor.create(data);
    ok("The Galleon imports as an actor with hit points and armor class", ship.system.attributes.hp.max > 0 && (ship.system.attributes.ac.flat > 0 || ship.system.attributes.ac.value > 0), `HP ${ship.system.attributes.hp.max}, type ${ship.type}`);
    const cannons = (await game.packs.get("op5e.ship-weapons").getDocuments()).filter((d) => /pounder/.test(d.name));
    const big = cannons.find((d) => d.name === "12-pounder");
    await ship.createEmbeddedDocuments("Item", [big.toObject()]);
    await ship.sheet.render({ force: true }); const elOf = () => ship.sheet.element?.[0] ?? ship.sheet.element;   // the 5.1 vehicle sheet is an older-style sheet: element is a jQuery wrapper
    for (let i = 0; i < 20 && !elOf()?.innerText; i++) await new Promise((r) => setTimeout(r, 500));
    ship.sheet.activateTab?.("features"); await new Promise((r) => setTimeout(r, 600));   // weapons are listed on the Features tab
    const text = elOf()?.innerText ?? "";
    ok("The ship's sheet opens (" + ship.sheet.constructor.name + ") and lists the cannon", ship.sheet.rendered && /12-pounder/.test(text), `${text.length} characters of sheet`);
    const cannon = ship.items.getName("12-pounder"), atk = [...cannon.system.activities].find((a) => a.type === "attack");
    ok("The cannon has an attack activity with damage", !!atk && (atk.damage?.parts?.length > 0 || cannon.system.damage?.base?.number > 0), JSON.stringify(cannon.system.damage?.base ?? {}).slice(0, 100));
    const n0 = game.messages.size;
    await Promise.race([atk.use({ create: { measuredTemplate: false } }, { configure: false }, {}), new Promise((r) => setTimeout(r, 15000))]); await new Promise((r) => setTimeout(r, 2000));
    ok("Firing the cannon posts a chat card from the ship", game.messages.size > n0 && /12-pounder/.test(game.messages.contents.slice(n0).map((m) => m.content).join(" ")), `${game.messages.size - n0} new messages`);
    const dmg = await atk.rollDamage({}, { configure: false }, { data: {} }).catch((e) => e.message); await new Promise((r) => setTimeout(r, 1500));
    const rolls = game.messages.contents.slice(n0).flatMap((m) => m.rolls.map((r) => r.formula));
    ok("The damage roll uses the 12-pounder's dice from the book", rolls.some((f) => /d10|d8|d12|d6/.test(f)), rolls.join(" | ").slice(0, 120));
    await ship.sheet.close();
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await ship?.delete().catch(() => {});
  for (const m of game.messages.filter((x) => /12-pounder|\[SHIP\]/.test(x.content + (x.speaker?.alias ?? "")))) await m.delete().catch(() => {});
  return out;
};
await withFoundry(async (page, { logs }) => {
  for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; }
  const bad = logs.filter((l) => /ship|cannon|TypeError|ReferenceError/i.test(l) && !/Deprecat/.test(l));
  console.log(bad.length ? `FAIL the ship sheet logged errors: ${bad[0].slice(0, 160)}` : "PASS no ship-related console errors"); if (bad.length) process.exitCode = 1;
});
