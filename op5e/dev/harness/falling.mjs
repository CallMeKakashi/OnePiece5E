// Falling damage in the real world: a 35 ft fall rolls 3d6, applies it as bludgeoning and knocks the actor prone; a 5 ft fall does nothing.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  for (const x of game.actors.filter((y) => y.name === "[FALL] Test")) await x.delete();
  let a;
  try {
    ok("the falling API is registered", !!game.op5eFalling?.fall && game.op5eFalling.fallingDice(200) === 20);
    a = await Actor.create({ name: "[FALL] Test", type: "character", system: { attributes: { hp: { value: 100, max: 100 } } } });
    const tok = { actor: a };
    const r1 = await game.op5eFalling.fall([tok], 35);
    const lost = 100 - a.system.attributes.hp.value;
    ok("a 35 ft fall rolls 3d6", r1[0]?.dice === 3 && r1[0].damage >= 3 && r1[0].damage <= 18, JSON.stringify(r1));
    ok("the damage is applied to hit points", lost === r1[0].damage, `lost ${lost}`);
    ok("the faller lands prone", a.statuses.has("prone"));
    await a.toggleStatusEffect("prone", { active: false }); await a.update({ "system.attributes.hp.value": 100 });
    const r2 = await game.op5eFalling.fall([tok], 5);
    ok("a 5 ft fall does nothing", r2[0]?.dice === 0 && a.system.attributes.hp.value === 100 && !a.statuses.has("prone"));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await a?.delete().catch(() => {});
  for (const m of game.messages.filter((x) => /\[FALL\]/.test(x.speaker?.alias ?? "") || /\[FALL\]/.test(x.flavor ?? ""))) await m.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
