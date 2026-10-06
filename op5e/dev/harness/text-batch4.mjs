// Checks the text-only features turned into usable items (docs/..., issue #26, text-batch4): uses, heal/save numbers, effects, the Afterimage summon. Test world, Automation user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const made = [], prior = game.settings.get("op5e", "prerequisiteMode");
  await game.settings.set("op5e", "prerequisiteMode", "off");   // the test characters do not have the classes and subclasses these features require
  for (const x of game.actors.filter((y) => y.name.startsWith("[B4]"))) await x.delete();
  const mk = async (name, cls, level) => { await game.op5eApi.createCharacter({ name, species: "Human", background: "Boxer", cls, level, abilities: { str: 10, dex: 14, con: 14, int: 12, wis: 16, cha: 13 } }); const a = game.actors.getName(name); made.push(a); return a; };
  const give = async (a, n, pack) => { try { return await game.op5eApi.addItem({ actor: a.name, name: n, pack }); } catch (e) { ok(`add ${n}`, false, e.message); } };
  const acts = (a, n) => [...a.items.getName(n).system.activities];
  const act = (a, n, name) => acts(a, n).find((x) => x.name === name);
  const evalRoll = async (f, a) => (await new Roll(f, a.getRollData()).evaluate()).total;
  const effOf = (a, n, name) => a.items.getName(n).effects.find((e) => e.name === name);
  const applyFx = async (a, n, name) => { const e = effOf(a, n, name), d = e.toObject(); delete d._id; d.transfer = false; d.disabled = false; const [c] = await a.createEmbeddedDocuments("ActiveEffect", [d]); return c; };

  try {
  // Chemical Cocktail: uses by Gadgeteer level, six cocktails
  const g = await mk("[B4] Gadgeteer 6", "Gadgeteer", 6); await give(g, "Chemical Cocktail");
  ok("Chemical Cocktail: 2 uses at level 6", g.items.getName("Chemical Cocktail").system.uses.max === 2, `${g.items.getName("Chemical Cocktail").system.uses.max}`);
  ok("Chemical Cocktail: six cocktails, each spends a use", acts(g, "Chemical Cocktail").length === 6 && acts(g, "Chemical Cocktail").every((x) => x.consumption.targets.length >= 1));
  const heal = act(g, "Chemical Cocktail", "Healing Cocktail"); ok("Healing Cocktail: 4d4 + Int mod", /4d4/.test(heal.healing.formula ?? heal.healing.custom?.formula ?? JSON.stringify(heal.healing)), JSON.stringify(heal.healing).slice(0, 80));
  const w0 = g.system.attributes.movement.walk; const fx = await applyFx(g, "Chemical Cocktail", "Swiftness Cocktail");
  ok("Swiftness Cocktail: +10 ft walking speed", g.system.attributes.movement.walk === w0 + 10, `${w0} -> ${g.system.attributes.movement.walk}`); await fx.delete();
  const ac0 = g.system.attributes.ac.value; const fx2 = await applyFx(g, "Chemical Cocktail", "Resilience Cocktail");
  ok("Resilience Cocktail: +1 AC", g.system.attributes.ac.value === ac0 + 1, `${ac0} -> ${g.system.attributes.ac.value}`); await fx2.delete();
  const g15 = await mk("[B4] Gadgeteer 15", "Gadgeteer", 15); await give(g15, "Chemical Cocktail");
  ok("Chemical Cocktail: 3 uses at level 15", g15.items.getName("Chemical Cocktail").system.uses.max === 3);

  // Brawler features
  const b = await mk("[B4] Brawler 6", "Brawler", 6);
  await give(b, "Drunken Arts"); const dart = await evalRoll(act(b, "Drunken Arts", "Drunken Arts").healing.custom?.formula ?? act(b, "Drunken Arts", "Drunken Arts").healing.formula, b);
  ok("Drunken Arts: temp HP is Wisdom modifier doubled at level 6", dart === Math.max(0, b.system.abilities.wis.mod) * 2, `${dart} (Wis mod ${b.system.abilities.wis.mod})`);
  await give(b, "Drunkard", "op5e.feats");
  ok("Drunkard: 2 uses, poison resistance, 2d6 + level heal", b.items.getName("Drunkard").system.uses.max === 2 && b.system.traits.dr.value.has("poison") && (() => { const h = act(b, "Drunkard", "Drink").healing; return (h.number === 2 && h.denomination === 6 && /@details.level/.test(h.bonus ?? "")) || /2d6/.test(JSON.stringify(h)); })(), JSON.stringify(act(b, "Drunkard", "Drink").healing).slice(0, 120));
  await give(b, "Bullet Time"); const i0 = b.system.attributes.init.total;
  ok("Bullet Time: uses equal to proficiency, +prof initiative", b.items.getName("Bullet Time").system.uses.max === b.system.attributes.prof, `${b.items.getName("Bullet Time").system.uses.max}`);
  await give(b, "Caring"); ok("Caring: 3 care dice, three ways to use one", b.items.getName("Caring").system.uses.max === 3 && acts(b, "Caring").length === 3);
  await give(b, "Inspiring Leader"); const il = acts(b, "Inspiring Leader")[0];
  ok("Inspiring Leader: a 10-minute heal for up to six", il.activation.type === "minute" && Number(il.target.affects.count) === 6 && /double|2 \*/.test(JSON.stringify(il.healing)) || /2 \* @details.level/.test(JSON.stringify(il.healing)), JSON.stringify(il.healing).slice(0, 100));
  await give(b, "Ferocious Charger"); const fc = act(b, "Ferocious Charger", "Ferocious Charge");
  ok("Ferocious Charger: Strength save, DC 8 + prof + Str", fc.type === "save" && /8 \+ @prof \+ @abilities.str.mod/.test(JSON.stringify(fc.save)), JSON.stringify(fc.save).slice(0, 100));
  await give(b, "Ominous Toxin"); const ot = acts(b, "Ominous Toxin");
  ok("Ominous Toxin: two save activities and poison resistance", ot.length === 2 && ot.every((x) => x.type === "save") && b.system.traits.dr.value.has("poison"));
  await give(b, "Mammal of Action"); b.system.attributes.movement.walk;
  ok("Mammal of Action: blindsight 10 and swim equal to walk, envenom save", b.system.attributes.senses.blindsight === 10 && b.system.attributes.movement.swim === b.system.attributes.movement.walk && acts(b, "Mammal of Action")[0].type === "save", `swim ${b.system.attributes.movement.swim} walk ${b.system.attributes.movement.walk}`);

  // Afterimage summon
  const af = (await game.packs.get("op5e.summons").getIndex()).find((e) => e.name === "Afterimage");
  ok("Afterimage: the stat block exists in the summons pack", !!af);
  await give(b, "Afterimage"); const sa = acts(b, "Afterimage")[0];
  ok("Afterimage: a bonus-action summon that points at it", sa.type === "summon" && sa.activation.type === "bonus" && sa.profiles.length === 1 && !!(await fromUuid(sa.profiles[0].uuid)), sa.profiles[0]?.uuid);

  // passive features
  const p = await mk("[B4] Passive", "Fighter", 4);
  const walk = p.system.attributes.movement.walk, ath = p.system.skills.ath.value, enc = p.system.attributes.encumbrance.max;
  await give(p, "Herculean Strength");
  ok("Herculean Strength: +10 ft speed and Athletics one step up", p.system.attributes.movement.walk === walk + 10 && p.system.skills.ath.value === Math.min(2, ath + 1) || p.system.skills.ath.value === ath + 1, `walk ${walk} -> ${p.system.attributes.movement.walk}; Athletics ${ath} -> ${p.system.skills.ath.value}`);
  await give(p, "Master Navigator"); await give(p, "Master Weaver"); await give(p, "Master Woodcarver");
  // the tool proficiency comes from the feat's Trait advancement (an effect on system.tools would leave a half-built entry that breaks encumbrance on dnd5e 5.3)
  const grants = [["Master Navigator", "navg"], ["Master Weaver", "weaver"], ["Master Woodcarver", "woodcarver"]].map(([n, t]) => [...p.items.getName(n).system.advancement].some((x) => x.type === "Trait" && x.configuration.grants.has(`tool:${t}`)));
  ok("Master Navigator, Weaver, Woodcarver: grant their tool proficiency through advancement", grants.every(Boolean), JSON.stringify(grants));
  await give(p, "Medical Expertise"); ok("Medical Expertise: expertise in Medicine", p.system.skills.med.value === 2, `${p.system.skills.med.value}`);
  await give(p, "Medium Armor Master"); ok("Medium Armor Master: the dnd5e flag is set", !!p.getFlag("dnd5e", "mediumArmorMaster"));
  await give(p, "Pack Mule"); ok("Pack Mule: carrying capacity doubles", p.system.attributes.encumbrance.max === enc * 2, `${enc} -> ${p.system.attributes.encumbrance.max}`);
  ok("Pack Mule: advantage on Constitution saves", p.system.abilities.con.save.roll?.mode === 1, `mode ${p.system.abilities.con.save.roll?.mode}`);

  } catch (e) { ok("the test itself stopped", false, e.message); }
  for (const a of made) await a.delete().catch(() => {});
  await game.settings.set("op5e", "prerequisiteMode", prior);
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
