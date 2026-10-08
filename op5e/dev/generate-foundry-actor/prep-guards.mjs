// Meridian Island guards: writes the build specs, fills every pending creation choice from per-NPC preferences (the user approved the builds and powers;
// the skill/kit picks below are defaults to review), and runs the pipeline to produce each chassis JSON.
// Usage: node dev/generate-foundry-actor/prep-guards.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SPECS = "dev/generate-foundry-actor/specs", OUT = "../Foundry/actors-json";
const run = (c) => execSync(c, { stdio: ["ignore", "pipe", "ignore"] }).toString();
const base = { buildPath: "class-based", actorKind: "npc", raceIdentifier: "human", devilFruit: null, abilityMethod: "manual", powerFork: "neither", abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, choices: [] };

// skill codes: acr ani arc ath dec his ins itm inv med nat prc prf per rel slt ste sur
const NPCS = [
  { slug: "coast-guard", name: "Coast Guard", cls: "fighter", sub: "champion", level: 3, cr: 0.5, bg: "Marine/Soldier", role: "deckhand", prefs: { skills: ["ath", "prc", "itm", "sur", "ins"], weapons: ["Cutlass", "Flintlock"], armor: ["Heavy Longcoat", "Chain Mail"], feat: ["Medium Armor Master", "Light Armor Master"], pack: ["Explorer's Pack"], tool: ["Tool: navg"], bonusFeat: ["Perceptive", "Fighting Initiate"] } },
  { slug: "pirate-guard", name: "Pirate Guard", cls: "rogue", sub: "swashbuckler", level: 6, cr: 3, bg: "Pirate", role: "deckhand", prefs: { skills: ["acr", "ste", "dec", "per", "prf", "slt", "ath"], weapons: ["Cutlass", "Flintlock", "Rapier", "Shortsword"], expertise: ["acr", "ste", "dec", "slt"], tool: ["Tool: thief", "Tool: navg"], bonusFeat: ["Mobile", "Perceptive"], pack: ["Burglar's Pack"] } },
  { slug: "judith", name: "Judith", cls: "fighter", sub: "champion", level: 8, cr: 5, bg: "Marine/Soldier", role: "master-at-arms", power: "fearsome-fortitude", prefs: { skills: ["ath", "itm", "prc", "ins", "sur"], weapons: ["Katana", "Flintlock"], armor: ["Heavy Longcoat", "Chain Mail"], feat: ["Medium Armor Master"], haki: ["Color of Armament Novice"], pack: ["Explorer's Pack"], bonusFeat: ["Sentinel", "Tough"] } },
  { slug: "may", name: "May", cls: "rogue", sub: "assassin", level: 9, cr: 6, bg: "Pirate", role: "navigator", power: "dodge-roll", prefs: { skills: ["acr", "ste", "dec", "per", "slt", "prf"], weapons: ["Rapier", "Shortsword", "Flintlock"], expertise: ["acr", "ste", "dec", "slt"], haki: ["Color of Observation Novice"], tool: ["Tool: thief"], pack: ["Burglar's Pack"], bonusFeat: ["Rogue Adept", "Keen Mind"] } },
  { slug: "jay", name: "Jay", cls: "bard", sub: "swords", level: 9, cr: 6, bg: "Entertainer", role: "musician", power: "heart-strings", prefs: { skills: ["prf", "per", "dec", "acr", "ath", "itm"], weapons: ["Rapier", "Flintlock"], expertise: ["prf", "per", "dec", "acr"], haki: ["Color of Observation Novice"], instrument: ["Lute", "Guitar", "Shamisen"], pack: ["Diplomat's Pack"], bonusFeat: ["Silver Tongue", "Diplomat"] } },
  { slug: "shin", name: "Shin", cls: "fighter", sub: "brute", level: 8, cr: 8, bg: "Pirate", role: "captain", power: "machiavellian-misfit", prefs: { skills: ["ath", "itm", "dec", "per", "sur"], weapons: ["Cutlass", "Flintlock"], armor: ["Leather Armor", "Heavy Longcoat"], haki: ["Color of Armament Novice"], expertise: ["dec", "itm"], tool: ["Tool: thief", "Tool: navg"], pack: ["Burglar's Pack"], bonusFeat: ["Menacing", "Tough"], feat: ["Light Armor Master"] },
    rogue: { sub: "thief", level: 4 } },
];

const COUNT = { fighter: 2, rogue: 4, bard: 3 };
function fill(specPath, prefs, cls) {
  const spec = JSON.parse(readFileSync(specPath, "utf8")); spec.choices = [];
  const c = JSON.parse((s => s.slice(s.indexOf("{")))(run(`node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-choices.ts --spec @${specPath}`)));
  const used = new Set(); const sheet = []; let expIdx = 0; const meta = { skills: [], expertise: [], tools: [] };   // expertise steps take the next skills in the list
  const pickNames = (p, wanted, n) => {
    const names = p.options.map((o) => o.name); const out = [];
    for (const w of wanted) { const hit = p.options.find((o) => (o.name === w || o.uuid === w) && !out.includes(o)); if (hit && out.length < n) out.push(hit); }
    for (const o of p.options) if (out.length < n && !out.includes(o)) out.push(o);
    return out;
  };
  for (const p of c.pending) {
    let want, n = 1;
    const t = p.title, src = p.source;
    if (p.type === "Trait") {
      if (/^expertise/.test(t)) { n = 2; want = (prefs.expertise ?? []).map((x) => `skills:${x}`); }
      else if (t === "skills") { n = src === "class" ? COUNT[cls] ?? 2 : src === "background" ? 2 : 1; want = (prefs.skills ?? []).map((x) => `Skill: ${x}`); }
      else if (t === "tools") { n = 1; want = prefs.tool ?? []; }
    } else {
      if (/Role/.test(t)) want = [`Role: ${NAME_ROLE[prefs._role]}`];
      else if (/Devil Fruit/.test(t)) want = ["No Devil Fruit (yet)"];
      else if (/Haki/.test(t)) want = prefs.haki ?? [];
      else if (/Armor/.test(t)) want = prefs.armor ?? [];
      else if (/Pack/.test(t)) want = prefs.pack ?? [];
      else if (/Instrument/.test(t)) want = prefs.instrument ?? [];
      else if (/bonus-feat/.test(t)) want = prefs.bonusFeat ?? [];
      else if (src === "background" && t === "feat") want = prefs.feat ?? [];
      else want = prefs.weapons ?? [];
    }
    // do not pick the same weapon for two steps
    const opts = { ...p, options: p.options.filter((o) => !(/Weapon|Shield/.test(t) && used.has(o.name))) };
    let uuids, label;
    if (/^expertise/.test(t)) { uuids = (want ?? []).slice(expIdx, expIdx + n); expIdx += n; label = uuids.join(", "); }   // the pool is a wildcard ("skills:*"), so the pick is written out
    else { const picked = pickNames(opts, want ?? [], n); for (const o of picked) used.add(o.name); uuids = picked.map((o) => o.uuid); label = picked.map((o) => o.name).join(", "); }
    if (p.type === "Trait") { const codes = uuids.map((u) => String(u).replace(/^skills:|^tool:/, "")); (/^expertise/.test(t) ? meta.expertise : t === "skills" ? meta.skills : meta.tools).push(...codes); }
    spec.choices.push({ stepId: p.stepId, level: p.level, source: src, uuids });
    sheet.push(`${src} L${p.level} ${t}: ${label}`);
  }
  writeFileSync(specPath, JSON.stringify(spec, null, 2));
  return { meta, sheet, left: JSON.parse((s => s.slice(s.indexOf("{")))(run(`node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-choices.ts --spec @${specPath}`))).pendingCount };
}
const NAME_ROLE = { deckhand: "Deckhand", "master-at-arms": "Master at Arms", navigator: "Navigator", musician: "Musician", captain: "Captain" };

const report = [];
for (const n of NPCS) {
  for (const half of [{ key: "", cls: n.cls, sub: n.sub, level: n.level }, ...(n.rogue ? [{ key: "-rogue", cls: "rogue", sub: n.rogue.sub, level: n.rogue.level }] : [])]) {
    const specPath = `${SPECS}/${n.slug}${half.key}-spec.json`;
    writeFileSync(specPath, JSON.stringify({ ...base, name: n.name + (half.key ? " (rogue part)" : ""), classIdentifier: half.cls, subclassIdentifier: half.sub, level: half.level, cr: n.cr, backgroundSlug: n.bg, roleSlug: n.role, additionalPowerSlug: n.power ?? "" }, null, 2));
    const { meta, sheet, left } = fill(specPath, { ...n.prefs, _role: n.role }, half.cls);
    writeFileSync(`reports/.meta-${n.slug}${half.key}.json`, JSON.stringify(meta));
    run(`npm run actor:build -- --spec @${specPath} --out ${OUT}/${n.slug}${half.key}-chassis.json`);
    report.push(`## ${n.name}${half.key ? " (rogue half)" : ""} (${half.cls} ${half.level}, ${half.sub}) pending left ${left}\n${sheet.map((s) => "- " + s).join("\n")}`);
  }
}
writeFileSync("reports/guards-choices.md", report.join("\n\n"));
console.log(report.join("\n\n"));
