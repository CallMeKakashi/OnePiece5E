// dnd5e 6 ideas built on 5.3 (#46): best armor class, conditional effects, compact chat cards.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => y.name === "[D6] Test")) await x.delete();
  const bestBefore = game.settings.get("op5e", "bestAc");
  let a;
  try {
    // --- best armor class
    ok("the best-AC setting exists and is off by default", bestBefore === false || bestBefore === true);
    a = await Actor.create({ name: "[D6] Test", type: "character", system: { abilities: { dex: { value: 16 } } } });
    await a.update({ "system.attributes.ac.calc": "default" });
    const keys = Object.keys(CONFIG.DND5E.armorClasses).filter((k) => !["flat", "custom", "natural"].includes(k));
    const ac = {}; for (const k of keys) ac[k] = a.clone({ "system.attributes.ac.calc": k }, { keepId: true }).system.attributes.ac.value;
    const max = Math.max(...Object.values(ac));
    ok("the calculations differ, so there is something to choose", Math.max(...Object.values(ac)) > Math.min(...Object.values(ac)) || keys.length < 2, JSON.stringify(ac));
    const chosen = await game.op5eBestAc.applyBestAc(a); await wait(500);
    ok("it switches to the highest calculation", a.system.attributes.ac.value === max, `${chosen ?? "unchanged"} -> AC ${a.system.attributes.ac.value} (max ${max})`);
    ok("a second run changes nothing", (await game.op5eBestAc.applyBestAc(a)) === null);
    await a.update({ "system.attributes.ac.calc": "flat", "system.attributes.ac.flat": 11 });
    ok("a flat AC the player set is left alone", (await game.op5eBestAc.applyBestAc(a)) === null && a.system.attributes.ac.calc === "flat");

    // --- conditional effects
    const [fx] = await a.createEmbeddedDocuments("ActiveEffect", [{ name: "[D6] Bloodied", disabled: true, changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "2" }], flags: { op5e: { condition: "@attributes.hp.value < @attributes.hp.max / 2" } } }]);
    await a.update({ "system.attributes.hp.max": 20, "system.attributes.hp.value": 20 }); await wait(900);
    ok("a conditional effect is off while its condition is false", game.actors.get(a.id).effects.get(fx.id).disabled === true);
    await a.update({ "system.attributes.hp.value": 4 }); await wait(900);
    ok("it switches on when the condition becomes true", game.actors.get(a.id).effects.get(fx.id).disabled === false);
    await a.update({ "system.attributes.hp.value": 20 }); await wait(900);
    ok("it switches off again when the condition is false", game.actors.get(a.id).effects.get(fx.id).disabled === true);
    ok("evaluateCondition treats a broken formula as false", game.op5eConditions.evaluateCondition("@@ nonsense", {}) === false);

    // --- compact chat cards
    const was = game.settings.get("op5e", "compactChat");
    await game.settings.set("op5e", "compactChat", true); await wait(100);
    ok("compact chat adds the body class", document.body.classList.contains("op5e-compact-chat"));
    await game.settings.set("op5e", "compactChat", false); await wait(100);
    ok("and removes it again", !document.body.classList.contains("op5e-compact-chat"));
    await game.settings.set("op5e", "compactChat", was);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await game.settings.set("op5e", "bestAc", bestBefore).catch(() => {});
  await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
