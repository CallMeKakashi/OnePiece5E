// Checks the conditional text-only features turned into toggles and buttons (text-batch5): a toggle starts off, and switching it on changes the number its text promises. Test world.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const made = [], prior = game.settings.get("op5e", "prerequisiteMode");
  await game.settings.set("op5e", "prerequisiteMode", "off");   // the features need classes, subclasses and races the test character lacks
  for (const x of game.actors.filter((y) => y.name.startsWith("[B5]"))) await x.delete();
  try {
    await game.op5eApi.createCharacter({ name: "[B5] Tester", species: "Human", background: "Boxer", cls: "Fighter", level: 8, abilities: { str: 14, dex: 14, con: 14, int: 12, wis: 12, cha: 16 } });
    const a = game.actors.getName("[B5] Tester"); made.push(a);
    const give = async (n, pack) => { try { return await game.op5eApi.addItem({ actor: a.name, name: n, pack }); } catch (e) { ok(`add ${n}`, false, e.message); } };
    const fx = (item, part) => a.items.getName(item)?.effects.find((e) => e.name.includes(part));
    const acts = (n) => [...(a.items.getName(n)?.system.activities ?? [])];
    const snap = () => ({ walk: a.system.attributes.movement.walk, ac: a.system.attributes.ac.value, hp: a.system.attributes.hp.max, init: a.system.attributes.init.total });
    const flip = async (e, on) => e.update({ disabled: !on });
    // toggle: exists, starts off, on changes a number, off puts it back
    const check = async (label, item, part, test, pack) => {
      await give(item, pack); const e = fx(item, part);
      if (!e) return ok(`${label}: toggle exists`, false, `no effect "${part}" on ${item}`);
      const off = snap(); ok(`${label}: starts switched off`, e.disabled === true);
      await flip(e, true); const on = snap(); ok(`${label}: switched on`, test(off, on), `${JSON.stringify(off)} -> ${JSON.stringify(on)}`);
      await flip(e, false); ok(`${label}: switched off again restores it`, JSON.stringify(snap()) === JSON.stringify(off));
    };
    await check("Light Armor Master (speed)", "Light Armor Master", "speed", (x, y) => y.walk === x.walk + 5);
    await check("Light Armor Master (moved 20 ft)", "Light Armor Master", "moved 20 ft", (x, y) => y.ac === x.ac + 1);
    await check("Dual Wielder", "Dual Wielder", "Dual Wielder", (x, y) => y.ac === x.ac + 1);
    await check("Versatile Fighting (two hands)", "Fighting Style: Versatile Fighting", "two hands", (x, y) => y.ac === x.ac + 1);
    await check("In and Out", "In and Out", "In and Out", (x, y) => y.walk === x.walk + 15);
    const iao = fx("In and Out", "In and Out"); await flip(iao, true); ok("In and Out: +2 to all saving throws", a.system.bonuses.abilities.save === "+2" || /\+2/.test(a.system.bonuses.abilities.save), `${a.system.bonuses.abilities.save}`); await flip(iao, false);
    await check("Destroy Defense", "Destroy Defense", "Destroy Defense", () => /\+2/.test(a.system.bonuses.mwak.attack));
    await flip(fx("Destroy Defense", "Destroy Defense"), false);
    await check("Rakish Audacity", "Rakish Audacity", "Rakish Audacity", (x, y) => y.init === x.init + a.system.abilities.cha.mod);
    const w0 = snap().walk; await give("Cut Time"); ok("Cut Time: +10 ft walking speed without switching anything", snap().walk === w0 + 10 && fx("Cut Time", "Cut Time")?.disabled === false, `${w0} -> ${snap().walk}`);
    // always-on passives
    const s0 = snap(); await give("Endless Vigor"); ok("Endless Vigor: hit point maximum up by twice the level", a.system.attributes.hp.max === s0.hp + 2 * a.system.details.level, `${s0.hp} -> ${a.system.attributes.hp.max} at level ${a.system.details.level}`);
    const step0 = a.getFlag("op5e", "unarmedDieStep") ?? 0; await give("Dragon Claw"); ok("Dragon Claw: unarmed die goes up one size", (a.getFlag("op5e", "unarmedDieStep") ?? 0) === step0 + 1);
    await give("Medical Dissertation"); ok("Medical Dissertation: +1 to creation attack and save DC", /\+1/.test(a.system.bonuses.msak.attack) && /\+1/.test(a.system.bonuses.spell.dc));
    ok("Medical Dissertation: the extra healing button rolls proficiency", acts("Medical Dissertation").some((x) => x.name === "Extra healing"));
    // reckless brilliance resist toggles
    await give("Reckless Brilliance"); const rb = fx("Reckless Brilliance", "resist acid"); await flip(rb, true); ok("Reckless Brilliance: Bound Hulk resistance when its toggle is on", a.system.traits.dr.value.has("acid")); await flip(rb, false);
    const rb2 = fx("Reckless Brilliance", "Mad Genius"); await flip(rb2, true); ok("Reckless Brilliance: Mad Genius advantage on Intelligence saves", a.system.abilities.int.save.roll?.mode === 1, `mode ${a.system.abilities.int.save.roll?.mode}`); await flip(rb2, false);
    await give("Enhanced Forms"); const ef = fx("Enhanced Forms", "Resilient"); await flip(ef, true); ok("Enhanced Forms: bludgeoning, piercing and slashing resistance when on", ["bludgeoning", "piercing", "slashing"].every((t) => a.system.traits.dr.value.has(t))); await flip(ef, false);
    await give("Artful Mastery"); const am = fx("Artful Mastery", "Artful Mastery"); ok("Artful Mastery: toggle starts off with attack and damage +1", am?.disabled === true && am.changes.length === 2);
    await give("Colossal Channeler"); ok("Colossal Channeler: toggle with thunder damage riders", fx("Colossal Channeler", "Colossal")?.disabled === true);
    await give("Unrelenting Fortress"); ok("Unrelenting Fortress: temporary hit points button", acts("Unrelenting Fortress")[0]?.type === "heal");
    // buttons and uses
    await give("Strong Arms"); ok("Strong Arms: one use and a 2d6 button", a.items.getName("Strong Arms").system.uses.max === 1 && acts("Strong Arms")[0]?.type === "utility");
    await give("Aura of Freedom"); await give("Aura of Warding"); ok("Aura of Warding stays a button that applies an effect to allies; Aura of Freedom is a real token aura now (no button)", acts("Aura of Warding")[0]?.effects.length === 1 && acts("Aura of Freedom").length === 0);
    await give("Carving Inspiration"); ok("Carving Inspiration: a button with a one-round advantage effect", acts("Carving Inspiration")[0]?.effects.length === 1);
    await give("Color of Observation Master"); ok("Sense Future: a button with advantage and disadvantage effects", acts("Color of Observation Master")[0]?.effects.length === 1);
    await give("Crusher", "op5e.feats"); ok("Crusher: push button and critical-hit effect on the target", acts("Crusher").length === 2);
    await give("Enhanced Evolution"); ok("Enhanced Evolution: uses equal to proficiency", a.items.getName("Enhanced Evolution").system.uses.max === a.system.attributes.prof);
    // Constant Shots restores Advanced Arsenal uses
    await give("Advanced Arsenal"); await give("Constant Shots");
    const arsenal = a.items.getName("Advanced Arsenal"), max = arsenal.system.uses.max; await arsenal.update({ "system.uses.spent": max });
    const cs = acts("Constant Shots")[0]; await Promise.race([cs.use({}, { configure: false }, {}), new Promise((r) => setTimeout(r, 15000))]); await new Promise((r) => setTimeout(r, 1500));
    ok("Constant Shots: restores two Advanced Arsenal uses", a.items.getName("Advanced Arsenal").system.uses.value === 2, `${a.items.getName("Advanced Arsenal").system.uses.value} left of ${max}`);
  } catch (e) { ok("the test itself stopped", false, e.message); }
  for (const a of made) await a.delete().catch(() => {});
  await game.settings.set("op5e", "prerequisiteMode", prior);
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
