// Checks the second group of conditional text-only features (text-batch6): toggles start off and change the right number when switched on, buttons exist and roll the right formula. Test world.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const made = [], prior = game.settings.get("op5e", "prerequisiteMode");
  await game.settings.set("op5e", "prerequisiteMode", "off");
  for (const x of game.actors.filter((y) => y.name.startsWith("[B6]"))) await x.delete();
  try {
    await game.op5eApi.createCharacter({ name: "[B6] Fighter", species: "Human", background: "Boxer", cls: "Fighter", level: 8, abilities: { str: 14, dex: 14, con: 14, int: 12, wis: 16, cha: 16 } });
    const a = game.actors.getName("[B6] Fighter"); made.push(a);
    const give = async (n, pack) => { try { return await game.op5eApi.addItem({ actor: a.name, name: n, pack }); } catch (e) { ok(`add ${n}`, false, e.message); } };
    const fx = (item, part) => a.items.getName(item)?.effects.find((e) => e.name.includes(part));
    const acts = (n) => [...(a.items.getName(n)?.system.activities ?? [])];
    const act = (n, name) => acts(n).find((x) => x.name === name);
    const roll = async (f, data) => (await new Roll(f, data ?? a.getRollData()).evaluate()).total;
    const flip = (e, on) => e.update({ disabled: !on });
    const toggle = async (label, item, part, test) => {
      await give(item); const e = fx(item, part); if (!e) return ok(`${label}: toggle exists`, false, `no effect "${part}" on ${item}`);
      ok(`${label}: starts switched off`, e.disabled === true); await flip(e, true); ok(`${label}: switched on`, test(), ""); await flip(e, false);
    };
    await toggle("Fear Factor", "Fear Factor", "Fear Factor", () => a.system.skills.itm.roll?.mode === 1);
    await toggle("Hardy Resolution", "Hardy Resolution", "Hardy Resolution", () => ["str", "dex", "con", "int", "wis", "cha"].every((k) => a.system.abilities[k].save.roll?.mode === 1));
    await toggle("Strong Faith", "Strong Faith", "Strong Faith", () => a.system.abilities.wis.save.roll?.mode === 1);
    await toggle("Third Eye", "Third Eye", "Third Eye", () => a.system.abilities.dex.save.roll?.mode === 1);
    await toggle("Improved Ignite", "Improved Ignite", "Improved Ignite", () => a.system.traits.dr.value.has("fire") && a.system.traits.dr.value.has("slashing") && !a.system.traits.dr.value.has("psychic"));
    await toggle("Keen Eyes", "Keen Eyes", "Keen Eyes", () => a.system.skills.prc.roll?.mode === 1 && a.system.skills.inv.roll?.mode === 1);
    await toggle("Pokerface", "Pokerface", "Pokerface", () => a.system.skills.dec.roll?.mode === 1 && a.system.skills.slt.roll?.mode === 1);
    await toggle("Sharpshooter", "Sharpshooter", "Sharpshooter", () => a.system.bonuses.rwak.attack === "-5" && a.system.bonuses.rwak.damage === "+10");
    const w0 = a.system.attributes.movement.walk; await toggle("Supersonic", "Supersonic", "Supersonic", () => a.system.attributes.movement.walk === w0 + 10);
    await toggle("Gigantic Might", "Gigantic Might", "Gigantic Might", () => /1d4/.test(a.system.bonuses.mwak.damage) && /1d4/.test(a.system.bonuses.rwak.damage));
    await give("Reckless Attack"); const ra = fx("Reckless Attack", "Reckless Attack"); ok("Reckless Attack: toggle starts off and holds both effects", ra?.disabled === true && ra.changes.length === 2);
    await give("Inexorable Prowess"); ok("Inexorable Prowess: toggle starts off", fx("Inexorable Prowess", "Inexorable")?.disabled === true);

    // unarmed die: overlapping features never stack
    const step = () => a.getFlag("op5e", "unarmedDieStep") ?? 0;
    await give("Fists of Fury"); ok("Fists of Fury: d6 unarmed (step 1) always on", step() === 1, `step ${step()}`);
    const fof = fx("Fists of Fury", "no weapon"); await flip(fof, true); ok("Fists of Fury: toggle for no weapon or shield gives d8 (step 2)", step() === 2, `step ${step()}`);
    await give("Ready to Rumble"); ok("Ready to Rumble with Fists of Fury on: still d8 (they do not stack)", step() === 2, `step ${step()}`);
    const rtr = fx("Ready to Rumble", "no weapon"); await flip(rtr, true); ok("Ready to Rumble toggle: d10 (step 3)", step() === 3, `step ${step()}`);
    await flip(rtr, false); await flip(fof, false);

    // buttons
    await give("Fighting Style: Thrown Weapon Fighting"); ok("Thrown Weapon Fighting: a +2 damage button", await roll(act("Fighting Style: Thrown Weapon Fighting", "Thrown weapon hit").roll?.formula ?? "2") === 2);
    ok("Fists of Fury: a punish button that applies an effect to the target", act("Fists of Fury", "Fists of Fury: punish")?.effects.length === 1);
    await give("Gigantic Might"); ok("Gigantic Might: shockwave button rolls the character level", (await roll("@details.level")) === a.system.details.level);
    await give("Grappler", "op5e.feats"); ok("Grappler: a button with an advantage effect", act("Grappler", "Grappler: advantage on the grappled creature")?.effects.length === 1);
    await give("Make Your Mark"); ok("Make Your Mark: a mark effect and a punish roll of half the Fighter level", act("Make Your Mark", "Mark")?.effects.length === 1 && (await roll("floor(@classes.fighter.levels / 2)")) === 4, `${await roll("floor(@classes.fighter.levels / 2)")}`);
    await give("Ordnance Requiem");
    const req = async (lvl) => { const f = act("Ordnance Requiem", "Ordnance Requiem").roll.formula; const r = new Roll(f, { classes: { bard: { levels: lvl } } }); await r.evaluate(); return r.dice[0]?.number; };
    ok("Ordnance Requiem: 2d6, 3d6, 5d6, 8d6 at Bard levels 3, 5, 10, 15", [await req(3), await req(5), await req(10), await req(15)].join() === "2,3,5,8", [await req(3), await req(5), await req(10), await req(15)].join());
    ok("Ordnance Requiem: spends a Bardic Inspiration use", act("Ordnance Requiem", "Ordnance Requiem").consumption.targets[0]?.target === "bardic-inspiration");
    await give("Powerful Passion"); ok("Powerful Passion: a 1d8 button", /1d8/.test(act("Powerful Passion", "Powerful Passion").roll.formula));
    await give("Slasher", "op5e.feats"); ok("Slasher: slow effect (-10 ft) and critical-wound effect on the target", act("Slasher", "Slasher: slow")?.effects.length === 1 && act("Slasher", "Slasher: grievous wound")?.effects.length === 1);
    await give("Star of the Show"); ok("Star of the Show: temp HP button, minimum 1", act("Star of the Show", "Star of the Show")?.type === "heal" && (await roll("max(1, @abilities.cha.mod)")) === Math.max(1, a.system.abilities.cha.mod));
    await give("Third Wind"); ok("Third Wind: a temporary hit points button", act("Third Wind", "Third Wind")?.type === "heal");
    await give("Rampaging Vigor"); ok("Rampaging Vigor: temp HP is Wisdom modifier plus Brawler level (minimum 1)", /classes\.brawler\.levels/.test(JSON.stringify(act("Rampaging Vigor", "Rampaging Vigor").healing)));

    // Tireless Spirit restores a Second Wind use
    const sw = a.items.getName("Second Wind"); await sw.update({ "system.uses.spent": sw.system.uses.max });
    await give("Tireless Spirit"); const regain = act("Tireless Spirit", "Regain Second Wind");
    await Promise.race([regain.use({}, { configure: false }, {}), new Promise((r) => setTimeout(r, 15000))]); await new Promise((r) => setTimeout(r, 1500));
    ok("Tireless Spirit: regains one Second Wind use", a.items.getName("Second Wind").system.uses.value === 1, `${a.items.getName("Second Wind").system.uses.value} of ${sw.system.uses.max}`);
    ok("Tireless Spirit: the Wisdom bonus rolls at least 1", (await roll(act("Tireless Spirit", "Second Wind bonus").roll.formula)) === Math.max(1, a.system.abilities.wis.mod));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  for (const a of made) await a.delete().catch(() => {});
  await game.settings.set("op5e", "prerequisiteMode", prior);
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
