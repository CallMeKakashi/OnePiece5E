// Runs real Midi-QOL workflows (attack/damage/save) on live compendium items in the TEST world and asserts the outcome:
// rolls happened, damage landed on the target token, base weapon damage is not doubled.
// Needs: midi-qol + chris-premades + op5e active (node dev/harness/stack.mjs on; node dev/harness/midi-config.mjs on).
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const CASES = [
  { pack: "items", name: "Warhammer", kind: "attack", expectDamageRolls: 1 },
  { pack: "items", name: "Battleaxe", kind: "attack", expectDamageRolls: 1 },
  { pack: "items", name: "Rapier", kind: "attack", expectDamageRolls: 1 },
  { pack: "items", name: "Longbow", kind: "attack", expectDamageRolls: 1 },
  { pack: "creations", name: "Fire Bolt", kind: "spell-attack" },
  { pack: "creations", name: "Fireball", kind: "spell-save", cls: "Medic" },
  { pack: "class-features", name: "Second Wind", kind: "heal", cls: "Fighter" },
  { pack: "class-features", name: "Sneak Attack", kind: "feature", cls: "Rogue" },
];

const run = async (c) => {
  const H = game.op5eHarness;
  const clicker = setInterval(() => { for (const b of document.querySelectorAll("button")) if (/^(normal|roll)$/i.test(b.textContent.trim()) && b.closest("dialog, .application, .window-content")) b.click(); }, 250);
  const out = { ...c, fails: [], rolls: [] };
  try {
    const src = (await game.packs.get(`op5e.${c.pack}`).getDocuments()).find((i) => i.name === c.name);
    if (!src) { out.fails.push("not found in pack"); return out; }
    let A = await H.createActor({ name: "Atk", abilities: { str: 16, dex: 16, int: 16, wis: 16, cha: 16 }, hp: 60 });
    if (c.cls) { // persisted level-10 actor of the class so @scale values resolve
      const AM = dnd5e.applications.advancement.AdvancementManager, cd = __op5eBuilt("classes").find((x) => x.name === c.cls).toObject(); cd.system.levels = 10;
      const m = AM.forNewItem(A, cd, { automaticApplication: true }); await __op5eRun(m, { level: 10, sub: null, note: () => {}, granted: [] }); m.clone.reset();
      const data = m.clone.toObject(); delete data._id; delete data._stats; data.name = "[T] Atk"; data.flags = { op5e: { harnessTest: true } }; await A.delete(); A = await Actor.create(data);
      const have = A.items.find((i) => i.name === c.name); if (have) await have.delete();
    }
    const T = await H.createActor({ name: "Tgt", type: "npc", hp: 200 });
    await T.update({ "system.attributes.ac": { calc: "flat", flat: 5 } });
    const scene = canvas.scene;
    const [ta] = await scene.createEmbeddedDocuments("Token", [(await A.getTokenDocument({ x: 1000, y: 1000 })).toObject()]);
    const [tt] = await scene.createEmbeddedDocuments("Token", [{ ...(await T.getTokenDocument({ x: 1100, y: 1000 })).toObject(), flags: { op5e: { harnessTest: true } } }]);
    const [it] = await A.createEmbeddedDocuments("Item", [src.toObject()]);
    if ("equipped" in it.system) await it.update({ "system.equipped": true });
    if (A.system.spells) await A.update({ "system.spells": Object.fromEntries(Object.entries(A.system.spells).filter(([, v]) => v?.max).map(([k, v]) => [k, { value: 9 }])) });
    await new Promise((r) => setTimeout(r, 800));
    tt.object?.setTarget(true, { releaseOthers: true });
    const act = [...it.system.activities][0];
    if (!act) { out.fails.push("no activity"); return out; }
    const before = game.messages.size, hp0 = tt.actor.system.attributes.hp.value;
    const wf = await Promise.race([
      MidiQOL.completeActivityUse(act, { midiOptions: { autoRollAttack: true, autoRollDamage: "always", autoFastForward: "all" }, create: { measuredTemplate: false } }, { configure: false }, { create: true }),
      new Promise((_, j) => setTimeout(() => j(new Error("TIMEOUT 25s (workflow did not finish)")), 25000)),
    ]);
    await new Promise((r) => setTimeout(r, 1500));
    const rolls = game.messages.contents.slice(before).flatMap((m) => m.rolls);
    out.rolls = rolls.map((r) => `${r.constructor.name}:${r.formula}=${r.total}`);
    const dmg = rolls.filter((r) => r instanceof CONFIG.Dice.DamageRoll);
    out.hp = [hp0, tt.actor.system.attributes.hp.value];
    out.workflow = !!wf;
    if (!rolls.length) out.fails.push("workflow produced no rolls");
    if (c.expectDamageRolls && dmg.length !== c.expectDamageRolls) out.fails.push(`damage rolled ${dmg.length}x, expected ${c.expectDamageRolls}`);
    const atk = rolls.find((r) => r instanceof CONFIG.Dice.D20Roll);
    if (c.kind === "attack" && atk && atk.total >= 5 && dmg.length && out.hp[1] >= out.hp[0]) out.fails.push("hit but target HP unchanged");
    if (c.kind === "heal" && !dmg.length && !rolls.length) out.fails.push("no heal roll");
  } catch (e) { out.fails.push(String(e.message).slice(0, 160) + " buttons=[" + [...new Set([...document.querySelectorAll("dialog button, .application button, .window-content button")].filter((b) => b.offsetParent).map((b) => b.textContent.trim()).filter(Boolean))].slice(0, 8).join(",") + "]"); }
  finally { clearInterval(clicker); await H.cleanup(); await Promise.all(canvas.scene.tokens.filter((t) => t.flags?.op5e?.harnessTest || ["Atk", "Tgt"].some((n) => t.name.includes(n))).map((t) => t.delete().catch(() => {}))); }
  return out;
};

let res;
try {
  res = await withFoundry(async (page) => {
    page.setDefaultTimeout(120000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    const out = [];
    for (const c of CASES.filter((x) => !process.env.ONLY || process.env.ONLY.split("|").includes(x.name))) {
      const r = await page.evaluate(`(${run.toString()})(${JSON.stringify(c)})`).catch((e) => ({ ...c, fails: [e.message.slice(0, 160)], rolls: [] }));
      out.push(r);
      console.log(`${r.fails.length ? "FAIL" : "ok  "} ${c.pack}/${c.name}: ${r.fails.join("; ") || `${r.rolls.join(" | ")} hp ${r.hp?.join("->")}`}`.slice(0, 260));
    }
    return out;
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-midi.json", JSON.stringify(res, null, 1));
console.log(`${res.filter((r) => !r.fails.length).length}/${res.length} Midi workflows ok`);
