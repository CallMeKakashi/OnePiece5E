import { withFoundry } from "./drive.mjs";
const r = await withFoundry((_, { evaluate }) => evaluate(async () => {
  const cls = (await game.packs.get("op5e.classes").getDocuments()).find((c) => c.name === "Barbarian");
  const advs = cls.system.advancement; const o = { lute: !!game.packs.get("op5e.items").index.find((i) => i.name === "Lute"), types: {}, sample: [] };
  for (const a of advs) { o.types[a.type] = (o.types[a.type] ?? 0) + 1; }
  const grant = advs.find((a) => a.type === "ItemGrant");
  const u = grant.configuration.items[0].uuid; o.sample = [u, !!(await fromUuid(u))];
  let ok = 0, bad = [];
  for (const a of advs.filter((a) => a.type === "ItemGrant")) for (const i of a.configuration.items) (await fromUuid(i.uuid)) ? ok++ : bad.push(i.uuid);
  o.grantsResolved = ok; o.unresolved = bad.slice(0, 5); o.levels = advs.map((a) => `${a.level}:${a.type}`).slice(0, 12);
  return o;
}));
console.log(JSON.stringify(r, null, 1));
