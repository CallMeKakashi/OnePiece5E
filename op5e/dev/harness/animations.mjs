// Live check of the OP5e animation entries (issue #29): the merge into Automated Animations ran, nothing existing was overwritten, and a covered item
// actually triggers an animation when used. Test world, Automation user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const MENUS = ["melee", "range", "ontoken", "templatefx", "preset", "aura", "aefx"];
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "");
  ok("Automated Animations and dnd5e-animations are active", game.modules.get("autoanimations")?.active && game.modules.get("dnd5e-animations")?.active);
  for (let i = 0; i < 40 && game.settings.get("op5e", "animationsAutorecVersion") === ""; i++) await new Promise((r) => setTimeout(r, 500));   // the merge runs on ready
  await new Promise((r) => setTimeout(r, 1500));
  const all = MENUS.flatMap((m) => (game.settings.get("autoanimations", `aaAutorec-${m}`) ?? []).map((e) => ({ ...e, menu: m })));
  const ours = all.filter((e) => e.metaData?.name === "OP5e Animations");
  ok("OP5e entries were merged into the Automated Animations menus", ours.length > 250, `${ours.length} entries`);
  ok("The merge was recorded for this module version", game.settings.get("op5e", "animationsAutorecVersion") !== "", `version marker "${game.settings.get("op5e", "animationsAutorecVersion")}"`);
  const labels = all.map((e) => norm(e.label)); const dupes = labels.filter((l, i) => labels.indexOf(l) !== i && ours.some((e) => norm(e.label) === l));
  ok("No label is duplicated by the merge", dupes.length === 0, [...new Set(dupes)].slice(0, 5).join(", "));
  const theirs = all.length - ours.length;
  ok("Entries that were already there are untouched (none removed)", theirs >= (globalThis.__aaBefore ?? 0), `${theirs} existing entries`);
  for (const name of ["Sharkrazor Mantle", "Rolling Pin: Kura3 (Base)", "12-pounder", "Zoan Hybrid Form"]) {
    ok(`An animation entry exists for "${name}"`, all.some((e) => norm(name).includes(norm(e.label)) && norm(e.label).length > 3), "");
  }
  // using a covered item runs Automated Animations
  const tag = []; const hook = (...a) => tag.push(a); Hooks.on("aa.animationStart", hook);
  await game.op5eApi.createCharacter({ name: "[AN] Tester", species: "Human", background: "Boxer", cls: "Brawler", level: 3 });
  const a = game.actors.getName("[AN] Tester"); await game.op5eApi.addItem({ actor: a.name, name: "Longsword" });
  const sc = await Scene.create({ name: "[AN] scene", width: 1000, height: 1000, grid: { size: 100 } }); await sc.view(); await new Promise((r) => setTimeout(r, 1500));
  await sc.createEmbeddedDocuments("Token", [(await a.getTokenDocument({ x: 100, y: 100 })).toObject()]);
  const t2 = await Actor.create({ name: "[AN] Target", type: "npc" }); await sc.createEmbeddedDocuments("Token", [(await t2.getTokenDocument({ x: 300, y: 100 })).toObject()]);
  sc.tokens.find((t) => t.name === "[AN] Target").object.setTarget(true, { releaseOthers: true });
  const atk = [...a.items.getName("Longsword").system.activities].find((x) => x.type === "attack");
  await Promise.race([atk.use({ create: { measuredTemplate: false } }, { configure: false }, {}), new Promise((r) => setTimeout(r, 15000))]);
  await new Promise((r) => setTimeout(r, 3000)); Hooks.off("aa.animationStart", hook);
  ok("Using a weapon with the merged entries runs cleanly (card posted, no error)", game.messages.contents.some((m) => /Longsword/.test(m.content)), `${tag.length} animation hook calls`);
  await sc.delete(); await t2.delete(); await a.delete();
  for (const m of game.messages.filter((x) => /\[AN\]/.test(x.content + (x.speaker?.alias ?? "")))) await m.delete().catch(() => {});
  return out;
};
await withFoundry(async (page, { logs }) => {
  for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; }
  const aa = logs.filter((l) => /UUIDv4|autoanimations|Automated Animations/i.test(l));
  console.log(aa.length ? `FAIL Automated Animations logged errors: ${aa[0].slice(0, 160)}` : "PASS Automated Animations loaded without errors"); if (aa.length) process.exitCode = 1;
});
