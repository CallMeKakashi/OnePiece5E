// Repairs broken and default image references in the world (test or bb-rehearsal): actors' portraits and tokens, item and effect icons, world items, user avatars.
//  - a broken path is matched to a real file under Data/one-piece-5e by file name (then by name without extension, then by letters and digits only), preferring the file whose folders share the most words;
//  - the D&D Beyond importer's icons (module not installed) become the dnd5e school icons or stock Foundry icons;
//  - items still on a default icon get a stock Foundry icon by name keyword or type.
// Every change is written to reports/image-fixes.json (old path, new path, what it belongs to). Nothing is deleted. Usage: node dev/harness/fix-images.mjs [--dry]
import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { withFoundry } from "./drive.mjs";

const DATA = process.env.FOUNDRY_DATA_DIR ?? "D:/foundry-pi/Foundry/foundrydata/Data", CORE = "D:/foundry-pi/Foundry/foundryvtt/public";
const DRY = process.argv.includes("--dry"), IMG = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const walk = (dir, out = []) => { for (const n of readdirSync(dir)) { const p = join(dir, n); const s = statSync(p); if (s.isDirectory()) walk(p, out); else if (IMG.test(n)) out.push(p.replace(/\\/g, "/")); } return out; };
const files = ["one-piece-5e", "assets", "ddb-images"].filter((d) => existsSync(join(DATA, d))).flatMap((d) => walk(join(DATA, d))).map((p) => p.slice(DATA.length + 1));
const norm = (s) => decodeURIComponent(s).toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]/g, "");
const base = (s) => decodeURIComponent(s).split("/").pop().toLowerCase();
const byBase = new Map(), byStem = new Map();
for (const f of files) { (byBase.get(base(f)) ?? byBase.set(base(f), []).get(base(f))).push(f); (byStem.get(norm(base(f))) ?? byStem.set(norm(base(f)), []).get(norm(base(f)))).push(f); }
const words = (s) => new Set(decodeURIComponent(s).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2));
const best = (broken, list) => { const w = words(broken.split("/").slice(0, -1).join("/")); return [...list].sort((a, b) => [...words(b)].filter((x) => w.has(x)).length - [...words(a)].filter((x) => w.has(x)).length || a.length - b.length)[0]; };
const core = (p) => (existsSync(join(CORE, p)) ? p : null);
const school = (n) => `systems/dnd5e/icons/svg/schools/${n}.svg`;
const DDB = {
  enchantment: school("enchantment"), abjuration: school("abjuration"), evocation: school("evocation"), conjuration: school("conjuration"), necromancy: school("necromancy"), divination: school("divination"), transmutation: school("transmutation"), illusion: school("illusion"),
  "arcane-focus": core("icons/sundries/misc/orb-glass-blue.webp") ?? core("icons/magic/symbols/runes-star-blue.webp"), "adventuring-gear": core("icons/containers/bags/pack-leather-brown.webp") ?? core("icons/containers/bags/sack-simple-leather-brown.webp"),
  tool: core("icons/tools/hand/hammer-and-nail.webp") ?? core("icons/tools/hand/hammer-cobbler-steel.webp"), "wondrous-item": core("icons/magic/symbols/runes-star-blue.webp") ?? core("icons/sundries/gaming/dice-runed-brown.webp"),
  armor: core("icons/equipment/chest/breastplate-scale-grey.webp") ?? core("icons/equipment/chest/breastplate-metal-scaled-grey.webp"), "equipment-pack": core("icons/containers/bags/pack-leather-brown.webp") ?? core("icons/containers/bags/sack-simple-leather-brown.webp"),
  weapon: core("icons/weapons/swords/sword-guard-purple.webp") ?? core("icons/weapons/swords/sword-simple-white.webp"), ammunition: core("icons/weapons/ammunition/arrows-flame-red.webp") ?? core("icons/weapons/ammunition/arrow-head-war-flight.webp"), "holy-symbol": core("icons/magic/holy/yin-yang-balance-symbol.webp") ?? core("icons/magic/holy/symbol-sun-gold.webp"),
};
const KEY = [[/multiattack/i, "icons/skills/melee/strike-slashes-orange.webp"], [/claw|talon/i, "icons/creatures/claws/claw-talons-glowing-orange.webp"], [/bite|fang/i, "icons/creatures/abilities/mouth-teeth-long-red.webp"], [/sting|venom|poison/i, "icons/magic/death/skull-poison-green.webp"], [/breath/i, "icons/creatures/abilities/dragon-fire-breath-orange.webp"], [/fire|flame|fireball|burn/i, "icons/magic/fire/projectile-fireball-orange.webp"], [/lightning|thunder|electro|spark/i, "icons/magic/lightning/bolt-strike-blue.webp"], [/haki|aura|dread/i, "icons/magic/control/hypnosis-mesmerism-eye.webp"], [/regenerat|heal/i, "icons/magic/life/cross-embers-glow-yellow-purple.webp"], [/pistol|musket|flintlock|gun|shigan/i, "icons/weapons/guns/gun-pistol-flintlock-metal.webp"], [/kick|punch|strike|fist|geppo|soru|rankyaku|stance/i, "icons/skills/melee/unarmed-punch-fist.webp"], [/mask|goggles|hat|attire|clothes|coat/i, "icons/equipment/head/hat-feathered-blue.webp"], [/cuff|chain|shackle/i, "icons/sundries/misc/handcuffs.webp"], [/box|puzzle|chest/i, "icons/containers/chest/chest-reinforced-steel-brown.webp"]];
const TYPE = { weapon: "icons/weapons/swords/sword-guard-purple.webp", equipment: "icons/equipment/chest/breastplate-scale-grey.webp", tool: "icons/tools/hand/hammer-and-nail.webp", loot: "icons/containers/bags/pack-leather-brown.webp", consumable: "icons/consumables/potions/potion-bottle-corked-red.webp", feat: "icons/skills/melee/strike-slashes-orange.webp", spell: "icons/magic/symbols/runes-star-blue.webp", container: "icons/containers/bags/pack-leather-brown.webp" };
// stock Foundry icons by creature word (monsters whose art is gone); humanoids fall back to the plain silhouette
const coreIcons = existsSync(join(CORE, "icons")) ? walk(join(CORE, "icons")).map((p) => p.slice(CORE.length + 1)) : [];
const CREATURE_WORDS = { abomination: "tentacle", basilisk: "serpent", stalker: "wolf", vulture: "raptor", render: "claw-bear", chicken: "chicken", scorpion: "scorpion", bull: "ox-buffalo", pig: "livestock-pig", grinner: "demon", lamprey: "tentacle", puppy: "dog", dog: "dog", wolf: "wolf", scylla: "tentacle", "maw beast": "beast-horned", serpent: "serpent", snake: "snake", keelboat: "boat", boat: "boat", horror: "tentacle", crab: "crab", shark: "shark" };
const creatureIcon = (name) => { const n = name.toLowerCase(); const key = Object.keys(CREATURE_WORDS).sort((a, b) => b.length - a.length).find((k) => n.includes(k)); if (!key) return null; const kw = CREATURE_WORDS[key]; return coreIcons.find((p) => /^icons\/creatures\//.test(p) && p.toLowerCase().includes(kw) && /\.(webp|png)$/.test(p)) ?? coreIcons.find((p) => p.toLowerCase().includes(kw) && /\.(webp|png)$/.test(p)) ?? null; };
const DEFAULT_ICON = /(^|\/)icons\/svg\/(mystery-man|item-bag|d20|upgrade)\.svg$|systems\/dnd5e\/icons\/svg\/(items|actors)\//;
const pickDefault = (name, type) => { for (const [re, p] of KEY) if (re.test(name) && core(p)) return p; return core(TYPE[type] ?? "") ?? null; };

await withFoundry(async (page) => {
  const refs = await page.evaluate(async () => {
    const cache = new Map(), probe = async (s) => { if (cache.has(s)) return cache.get(s); let r; try { r = (await fetch(s, { method: "HEAD" })).status; } catch { r = -1; } cache.set(s, r); return r; };
    const out = []; const push = async (o) => { if (!o.src) return; const st = await probe(o.src); if (st !== 200) out.push({ ...o, broken: true }); else if (/(^|\/)icons\/svg\/(mystery-man|item-bag|d20|upgrade)\.svg$|systems\/dnd5e\/icons\/svg\/(items|actors)\//.test(o.src) && (o.kind === "item" || (/^(actor|token)$/.test(o.kind) && /mystery-man/.test(o.src)))) out.push({ ...o, broken: false }); };
    for (const a of game.actors) { await push({ kind: "actor", id: a.id, field: "img", src: a.img, label: a.name }); await push({ kind: "token", id: a.id, field: "token", src: a.prototypeToken.texture.src, label: a.name });
      for (const i of a.items) { await push({ kind: "item", actor: a.id, id: i.id, field: "img", src: i.img, label: `${a.name} / ${i.name}`, name: i.name, type: i.type }); for (const e of i.effects) await push({ kind: "ieffect", actor: a.id, item: i.id, id: e.id, field: "img", src: e.img, label: `${a.name} / ${i.name} / ${e.name}` }); }
      for (const e of a.effects) await push({ kind: "aeffect", actor: a.id, id: e.id, field: "img", src: e.img, label: `${a.name} / ${e.name}` }); }
    for (const i of game.items) await push({ kind: "worlditem", id: i.id, field: "img", src: i.img, label: i.name, name: i.name, type: i.type });
    for (const u of game.users) await push({ kind: "user", id: u.id, field: "avatar", src: u.avatar, label: u.name });
    return out;
  });
  const plan = [], unresolved = [];
  for (const r of refs) {
    let to = null;
    if (r.broken) {
      const ddb = /ddb-importer\/storage\/(?:spell\/school|ddb\/(?:loot|item))\/([a-z-]+)\.webp$/i.exec(r.src);
      if (ddb) to = DDB[ddb[1].toLowerCase()] ?? null;
      if (!to) { const cands = byBase.get(base(r.src)) ?? byStem.get(norm(base(r.src))); if (cands?.length) to = best(r.src, cands); }
    } else to = /^(actor|token)$/.test(r.kind) ? creatureIcon(r.label) : pickDefault(r.name ?? "", r.type);
    if (!to && r.broken) {   // nothing on disk: a stock icon that fits, never a broken link
      if (r.kind === "item" || r.kind === "worlditem") to = pickDefault(r.name ?? "", r.type);
      else if (r.kind === "actor" || r.kind === "token") to = creatureIcon(r.label) ?? "icons/svg/mystery-man.svg";
      else if (r.kind === "ieffect" || r.kind === "aeffect") to = "icons/svg/aura.svg";
      else if (r.kind === "user") to = "icons/svg/mystery-man.svg";
    }
    if (to && to !== r.src) plan.push({ ...r, to }); else if (r.broken) unresolved.push(r);
  }
  const summary = {}; for (const p of plan) summary[p.kind] = (summary[p.kind] ?? 0) + 1;
  writeFileSync("reports/image-fixes.json", JSON.stringify({ plan: plan.map(({ kind, label, src, to, broken }) => ({ kind, label, from: src, to, was: broken ? "broken" : "default icon" })), unresolved: unresolved.map((u) => ({ kind: u.kind, label: u.label, src: u.src })) }, null, 1));
  console.log(`${refs.length} references need work: ${plan.length} fixable (${JSON.stringify(summary)}), ${unresolved.length} with no matching file`);
  if (DRY) return;
  const res = await page.evaluate(async (plan) => {
    let n = 0; const errs = [];
    const byActor = new Map(); for (const p of plan) { const k = p.actor ?? p.id; (byActor.get(k) ?? byActor.set(k, []).get(k)).push(p); }
    for (const p of plan) {
      try {
        if (p.kind === "actor") await game.actors.get(p.id).update({ img: p.to }, { render: false });
        else if (p.kind === "token") await game.actors.get(p.id).update({ "prototypeToken.texture.src": p.to }, { render: false });
        else if (p.kind === "item") await game.actors.get(p.actor).items.get(p.id).update({ img: p.to }, { render: false });
        else if (p.kind === "ieffect") await game.actors.get(p.actor).items.get(p.item).effects.get(p.id).update({ img: p.to }, { render: false });
        else if (p.kind === "aeffect") await game.actors.get(p.actor).effects.get(p.id).update({ img: p.to }, { render: false });
        else if (p.kind === "worlditem") await game.items.get(p.id).update({ img: p.to }, { render: false });
        else if (p.kind === "user") await game.users.get(p.id).update({ avatar: p.to });
        n++;
      } catch (e) { errs.push(`${p.label}: ${String(e.message).slice(0, 80)}`); }
    }
    return { n, errs };
  }, plan);
  console.log(`applied ${res.n} fixes, ${res.errs.length} errors`); for (const e of res.errs.slice(0, 8)) console.log("  ", e);
});
