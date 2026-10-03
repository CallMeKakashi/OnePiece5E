import { withFoundry } from "./drive.mjs";
const r = await withFoundry((_, { evaluate }) => evaluate(async () => {
  const a = await Actor.create({ name: "[T] V", type: "vehicle", flags: { op5e: { harnessTest: true } } });
  const s = a.toObject().system; const o = { keys: Object.keys(s), attributes: s.attributes, cargo: s.cargo, details: s.details, traits: s.traits };
  const w = await Item.create({ name: "[T] Cannon", type: "weapon", flags: { op5e: { harnessTest: true } } });
  o.weaponKeys = Object.keys(w.toObject().system); o.weaponType = w.toObject().system.type; o.range = w.toObject().system.range; o.weaponTypes = Object.keys(CONFIG.DND5E.weaponTypes);
  o.vehicleTypes = CONFIG.DND5E.vehicleTypes; await game.op5eHarness.cleanup(); return o;
}));
console.log(JSON.stringify(r));
