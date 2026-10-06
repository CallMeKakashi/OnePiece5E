// Checks the last group of text-only features made usable (text-batch7): toggles start off and change the right number, buttons exist and roll the right formula. Test world.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const made = [], prior = game.settings.get("op5e", "prerequisiteMode");
  await game.settings.set("op5e", "prerequisiteMode", "off");
  for (const x of game.actors.filter((y) => y.name.startsWith("[B7]"))) await x.delete();
  try {
    await game.op5eApi.createCharacter({ name: "[B7] Tester", species: "Human", background: "Boxer", cls: "Fighter", level: 8, abilities: { str: 14, dex: 14, con: 14, int: 12, wis: 16, cha: 16 } });
    const a = game.actors.getName("[B7] Tester"); made.push(a);
    const give = async (n, pack) => { try { return await game.op5eApi.addItem({ actor: a.name, name: n, pack }); } catch (e) { ok(`add ${n}`, false, e.message); return null; } };
    const fx = (item, part) => a.items.getName(item)?.effects.find((e) => e.name.includes(part));
    const acts = (n) => [...(a.items.getName(n)?.system.activities ?? [])];
    const act = (n, name) => acts(n).find((x) => x.name === name);
    const roll = async (f) => (await new Roll(f, a.getRollData()).evaluate()).total;
    const T = async (label, item, part, test) => {
      const added = await give(item); if (!added) return;
      const e = fx(item, part); if (!e) return ok(`${label}: toggle exists`, false, `no effect "${part}" on ${item}`);
      ok(`${label}: starts switched off`, e.disabled === true); await e.update({ disabled: false }); ok(`${label}: switched on`, test()); await e.update({ disabled: true });
    };
    const walk = () => a.system.attributes.movement.walk;
    const w0 = walk();
    await T("Rational Mind", "Rational Mind", "Rational Mind", () => a.system.skills.his.roll?.mode === 1 && a.system.skills.inv.roll?.mode === 1);
    await T("Superior Hunter", "Superior Hunter", "Superior Hunter", () => a.system.skills.prc.roll?.mode === 1 && a.system.skills.sur.roll?.mode === 1);
    await T("Supreme Sneak", "Supreme Sneak", "Supreme Sneak", () => a.system.skills.ste.roll?.mode === 1 && a.system.skills.slt.roll?.mode === 1);
    await T("Earth Stance", "Fighting Stances", "Earth Stance (+2", () => true);
    const ac0 = a.system.attributes.ac.value; const es = fx("Fighting Stances", "Earth Stance (+2"); await es.update({ disabled: false }); ok("Earth Stance: +2 AC", a.system.attributes.ac.value === ac0 + 2, `${ac0} -> ${a.system.attributes.ac.value}`); await es.update({ disabled: true });
    await T("Stance Improvements (Wind)", "Stance Improvements", "Wind Stance", () => a.system.attributes.movement.fly === walk());
    await T("Ancient Aspect (Shark)", "Ancient Aspect", "Shark", () => a.system.attributes.movement.swim === walk());
    await T("Primal Totem (Elk)", "Primal Totem", "Elk", () => walk() === w0 + 15);
    await give("Primal Totem"); const bear = fx("Primal Totem", "Bear (raging): resistance to fire"); await bear.update({ disabled: false }); ok("Primal Totem: Bear resistance toggles, one per damage type", a.system.traits.dr.value.has("fire") && !a.system.traits.dr.value.has("psychic") && !fx("Primal Totem", "resistance to force"), ""); await bear.update({ disabled: true });
    await T("Totem Attuned (Eagle)", "Totem Attuned", "Eagle", () => a.system.attributes.movement.fly === walk());
    await T("Deft Explorer (Roving)", "Deft Explorer", "Roving", () => walk() === w0 + 10 && a.system.attributes.movement.climb === walk() && a.system.attributes.movement.swim === walk());
    // signature fighting style
    await give("Signature Fighting Style");
    const sig = (part) => fx("Signature Fighting Style", part);
    ok("Signature Fighting Style: four toggles, all switched off", ["Improved Archery", "Improved Blind", "Improved Defense", "Improved Dueling"].every((p) => sig(p)?.disabled === true));
    const bd = sig("Improved Blind"); await bd.update({ disabled: false }); ok("Improved Blind Fighting: blindsight 30 ft", a.system.attributes.senses.blindsight === 30); await bd.update({ disabled: true });
    const ar = sig("Improved Archery"); await ar.update({ disabled: false }); ok("Improved Archery: +3 ranged attack", /\+3/.test(a.system.bonuses.rwak.attack)); await ar.update({ disabled: true });
    // passives
    await give("Inciting Inspiration"); await give("Inventive Mind"); ok("Inciting Inspiration and Inventive Mind: +1 creation attack and DC", /\+1/.test(a.system.bonuses.msak.attack) && /\+1/.test(a.system.bonuses.spell.dc));
    // buttons
    await give("Aura of Spite"); await give("Aura of Tenacity"); ok("Aura of Spite stays a button that applies an effect in range; Aura of Tenacity is a real token aura now (no button)", acts("Aura of Spite")[0]?.effects.length === 1 && acts("Aura of Tenacity").length === 0);
    await give("Improved Ardent Smite"); ok("Improved Ardent Smite: a 1d8 button", /1d8/.test(act("Improved Ardent Smite", "Improved Ardent Smite").roll.formula));
    await give("Mountain Stance"); ok("Mountain Stance: anchor and brace buttons, brace is 1d10 + Str mod", !!act("Mountain Stance", "Anchor") && (await roll(act("Mountain Stance", "Brace for damage").roll.formula)) >= 1 + a.system.abilities.str.mod);
    await give("Achilles Heel"); ok("Achilles Heel: a button per damage type that gives the target that vulnerability", acts("Achilles Heel").length === 13 && acts("Achilles Heel").every((x) => x.effects.length === 1));
    await give("Totem Attuned"); ok("Totem Attuned (Elk): a Strength save button for prone", act("Totem Attuned", "Elk: charge through")?.type === "save");
    await give("Huntsmen's Tactics"); ok("Huntsmen's Tactics: three buttons", acts("Huntsmen's Tactics").length === 3, `${acts("Huntsmen's Tactics").length}`);
    await give("Fearsome Fortitude"); const ff = await roll(act("Fearsome Fortitude", "Fearsome Fortitude").roll.formula); ok("Fearsome Fortitude: rolls a hit die plus Con", ff >= 1 + a.system.abilities.con.mod, `${ff}`);
    await give("Legendary Flourish"); const lf = acts("Legendary Flourish");
    ok("Legendary Flourish: four buttons, the three flourishes spend a Bardic Inspiration use", lf.length === 4 && lf.filter((x) => x.consumption.targets.some((t) => t.target === "bardic-inspiration")).length === 3);
    await give("Deft Explorer"); ok("Deft Explorer: Tireless button with proficiency-bonus uses", a.items.getName("Deft Explorer").system.uses.max === a.system.attributes.prof && act("Deft Explorer", "Tireless")?.type === "heal");
  } catch (e) { ok("the test itself stopped", false, e.message); }
  for (const a of made) await a.delete().catch(() => {});
  await game.settings.set("op5e", "prerequisiteMode", prior);
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
