import { withFoundry } from "./drive.mjs";
const r = await withFoundry(async (_, { evaluate }) => evaluate(async () => {
  const H = game.op5eHarness; await H.resetWorld();
  const docs = await H.loadCompendium("op5e.items");
  const w = docs.find((d) => d.type === "weapon" && [...d.system.activities].some((a) => a.type === "attack"));
  const atk = await H.createActor({ name: "Atk", abilities: { str: 16, dex: 14 }, hp: 30 });
  const tgt = await H.createActor({ name: "Tgt", hp: 40, ac: 10 });
  const item = await H.giveItem(atk, w.uuid); await H.equipItem(item);
  const act = H.findActivity(item, "attack");
  let out = { weapon: w.name, actKeys: [...item.system.activities].map((a) => a.type), dmg: act.damage?.parts?.map((p) => p.formula ?? p.custom?.formula) };
  try { const t = await H.createToken(tgt); H.targetToken(t); out.targets = game.user.targets.size; } catch (e) { out.tokenErr = e.message; }
  try { const rolls = await H.rollAttack(item); out.attack = rolls?.map((r) => r.total); } catch (e) { out.attackErr = e.message; }
  try { const rolls = await H.rollDamage(item); out.damage = rolls?.map((r) => r.total + ":" + r.formula); } catch (e) { out.dmgErr = e.message; }
  out.errors = H.getConsoleErrors(); await H.cleanup(); return out;
}));
console.log(JSON.stringify(r, null, 1));
