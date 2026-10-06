// Devil Fruit casting checks (issue #20): Uses as spell points, cantrips free, level cap, Zoans only in a form. Test world, Automation user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const F = game.op5eFruitCasting, made = [];
  const mkChar = async (name, fruit) => {
    await game.op5eApi.createCharacter({ name, species: "Human", background: "Boxer", cls: "Brawler", level: 5, fruit });
    const a = game.actors.getName(name); made.push(a);
    await game.op5eApi.addItem({ actor: name, name: "Devil Fruit Uses", pack: "op5e.feats" }); return a;
  };
  const spellUuid = async (name) => { const e = (await game.packs.get("dnd5e.spells").getIndex()).find((x) => x.name === name); return e?.uuid; };
  const use = async (a, name) => { const it = a.items.getName(name); await [...it.system.activities][0].use({}, { configure: false }, {}); await new Promise((r) => setTimeout(r, 1500)); };
  const err = async (p) => { try { await p; return ""; } catch (e) { return e.message; } };

  const a = await mkChar("[FC] Logia", "Logia");
  ok("Uses maximum at level 5 is 3", F.usesMax(a) === 3, `${F.usesMax(a)}`);
  await F.learn(a, await spellUuid("Fire Bolt")); await F.learn(a, await spellUuid("Fireball"));
  ok("Learned a cantrip and a level 3 spell from the dnd5e pack", a.items.some((i) => i.name === "Fire Bolt") && a.items.some((i) => i.name === "Fireball"));
  ok("A spell above the Uses maximum cannot be learned", /can learn up to level 3/.test(await err(F.learn(a, await spellUuid("Wish")))));
  await use(a, "Fire Bolt"); ok("Cantrip is free", F.usesLeft(a) === 3, `${F.usesLeft(a)} left`);
  await use(a, "Fireball"); ok("A level 3 spell costs 3 uses", F.usesLeft(a) === 0, `${F.usesLeft(a)} left`);
  const slots = Object.values(a.system.spells ?? {}).reduce((n, s) => n + (s.value ?? 0), 0);
  ok("No spell slot is used", slots === Object.values(a.system.spells ?? {}).reduce((n, s) => n + (s.max ?? 0), 0));
  const before = game.messages.size; await use(a, "Fireball"); ok("Casting with too few uses is refused", F.usesLeft(a) === 0 && game.messages.size === before);

  const z = await mkChar("[FC] Zoan", "Zoan");
  await game.op5eApi.addItem({ actor: z.name, name: "Zoan Hybrid Form", pack: "op5e.feats" });
  await F.learn(z, await spellUuid("Fire Bolt"));
  ok("Zoan is detected", F.isZoan(z));
  const m0 = game.messages.size; await use(z, "Fire Bolt"); ok("Zoan cannot cast in base form", game.messages.size === m0);
  await z.createEmbeddedDocuments("ActiveEffect", [{ name: "Zoan Hybrid Form", duration: { seconds: 600 } }]);
  const m1 = game.messages.size; await use(z, "Fire Bolt"); ok("Zoan casts while in Hybrid Form", game.messages.size > m1);

  for (const x of made) await x.delete().catch(() => {});
  for (const m of game.messages.filter((x) => /\[FC\]/.test(x.content + (x.speaker?.alias ?? "")))) await m.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
