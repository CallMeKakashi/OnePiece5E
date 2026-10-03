// Compares each automated item's activities against its own sourcebook description text (read-only, no Foundry needed).
// Flags: damage dice the automation rolls but the text never mentions, dice/damage the text describes but no activity rolls,
// save abilities that don't match, and durations/ranges that contradict the text. Findings are for review, not hard failures.
// Usage: node scripts/check-automation-accuracy.mjs [pack ...]   (needs a built packs-src/)
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

const PACKS = process.argv.slice(2).length ? process.argv.slice(2) : ["class-features", "racial-features", "feats", "items", "creations", "backgrounds"];
const ABIL = { strength: "str", dexterity: "dex", constitution: "con", intelligence: "int", wisdom: "wis", charisma: "cha" };
const DMG = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];
const UNIT_S = { round: 6, minute: 60, hour: 3600, day: 86400 };

const strip = (h) => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
const diceIn = (s) => new Set([...String(s).matchAll(/\b(\d+)d(\d+)\b/g)].map((m) => `${+m[1]}d${m[2]}`));
const seconds = (v, u) => (UNIT_S[u] ? Number(v) * UNIT_S[u] : null);

function partDice(p) {
  const out = new Set();
  if (p.custom?.enabled) for (const d of diceIn(p.custom.formula)) out.add(d);
  else if (p.number && p.denomination) out.add(`${p.number}d${p.denomination}`);
  if (p.bonus) for (const d of diceIn(p.bonus)) out.add(d);
  return out;
}

const findings = [];
const stats = {};
for (const pack of PACKS) {
  let docs = 0, withActs = 0, flagged = 0;
  for (const f of readdirSync(`packs-src/${pack}`)) {
    const d = JSON.parse(readFileSync(`packs-src/${pack}/${f}`, "utf8"));
    const acts = Object.values(d.system?.activities ?? {});
    docs++;
    if (!acts.length) continue;
    withActs++;
    const text = strip(d.system?.description?.value);
    if (!text) continue;
    const textDice = diceIn(text);
    const issues = [];
    const summons = acts.some((a) => a.type === "summon");

    // 1) dice the automation rolls vs dice the text mentions (scaling dice count as mentioned if the base appears)
    const actDice = new Set();
    for (const a of acts) {
      for (const p of a.damage?.parts ?? []) {
        for (const x of partDice(p)) actDice.add(x);
        if (p.scaling?.formula) for (const x of diceIn(p.scaling.formula)) actDice.add(x);
      }
      if (a.healing) for (const x of partDice(a.healing)) actDice.add(x);
    }
    for (const x of actDice) {
      if (textDice.has(x)) continue;
      const sameDie = [...textDice].filter((t) => t.split("d")[1] === x.split("d")[1]);
      if (!sameDie.length) issues.push({ kind: "dice-not-in-text", detail: `activities roll ${x}; text has ${[...textDice].join(", ") || "no dice"}` });
      else if (!x.startsWith("1d") && !sameDie.some((t) => Number(x.split("d")[0]) % Number(t.split("d")[0]) === 0)) issues.push({ kind: "dice-count-differs", detail: `activities roll ${x}; text has ${sameDie.join(", ")}` });   // 1dN is usually a per-level scaling die
    }

    // 2) typed damage described in the text with no matching activity damage
    const actTypes = new Set(acts.flatMap((a) => [...(a.damage?.parts ?? []), ...(a.healing ? [a.healing] : [])].flatMap((p) => p.types ?? [])));
    const hasHealing = acts.some((a) => a.type === "heal" || a.healing);
    for (const m of text.matchAll(/\b(\d+d\d+)(?:\s*[+-]\s*[\w@. ]{1,25}?)?\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/gi)) {
      const t = m[2].toLowerCase();
      if (!actTypes.has(t) && !acts.some((a) => (a.damage?.parts ?? []).some((p) => !(p.types ?? []).length))) issues.push({ kind: "described-damage-missing", detail: `text: ${m[1]} ${t}; no activity deals ${t}` });
    }
    if (/\bregain(s)?\b[^.]{0,40}\bhit points\b/i.test(text) && /\d+d\d+/.test(text) && !hasHealing && !summons && !acts.some((a) => a.type === "utility")) issues.push({ kind: "healing-missing", detail: "text grants hit points but no heal activity" });

    // 3) saving throws
    const textSaves = new Set([...text.matchAll(/\b(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/gi)].map((m) => ABIL[m[1].toLowerCase()]));
    const actSaves = new Set(acts.flatMap((a) => (a.type === "save" ? [...(a.save?.ability ?? [])] : [])));
    for (const s of actSaves) if (textSaves.size && !textSaves.has(s)) issues.push({ kind: "save-ability-not-in-text", detail: `activity saves ${s}; text mentions ${[...textSaves].join(", ")}` });
    if (!actSaves.size && textSaves.size && !summons && !acts.some((a) => a.type === "utility")) issues.push({ kind: "save-missing", detail: `text has ${[...textSaves].join(", ")} save; no save activity` });
    for (const s of textSaves) if (actSaves.size && !actSaves.has(s)) issues.push({ kind: "text-save-not-automated", detail: `text mentions ${s} save; activities save ${[...actSaves].join(", ")}` });

    // 4) duration and range of the item itself (only when both sides are specific)
    const dur = d.system?.duration;
    const dms = [...text.matchAll(/(?:for|duration[:s]+(?:concentration,?s*)?)s*(?:ups+tos+)?(d+)s+(round|minute|hour|day)s?/gi)];
    const dm = dms[0];
    if (dm && dur?.value && UNIT_S[dur.units]) {
      const want = seconds(dm[1], dm[2].toLowerCase()), have = seconds(dur.value, dur.units);
      if (!dms.some((m) => seconds(m[1], m[2].toLowerCase()) === have)) issues.push({ kind: "duration-differs", detail: `item duration ${dur.value} ${dur.units}; text says ${dm[1]} ${dm[2]}` });
    }
    const rng = d.system?.range;
    if (rng?.value && rng.units === "ft") {
      const rm = text.match(/Range:\s*(?:Self\s*\()?(\d+)/i);   // only the stated Range line; area sizes in prose are not the range
      const nums = rm ? [+rm[1]] : [];
      if (nums.length && !nums.includes(Number(rng.value))) issues.push({ kind: "range-not-in-text", detail: `item range ${rng.value} ft; text has ${[...new Set(nums)].join(", ")}` });
    }

    if (issues.length) { flagged++; findings.push({ pack, name: d.name, issues }); }
  }
  stats[pack] = { docs, withActivities: withActs, flagged };
}

const byKind = {};
for (const f of findings) for (const i of f.issues) byKind[i.kind] = (byKind[i.kind] ?? 0) + 1;
mkdirSync("reports", { recursive: true });
writeFileSync("reports/automation-accuracy.json", JSON.stringify({ stats, byKind, findings }, null, 2));
const md = [`# Automation vs sourcebook text`, ``, `Heuristic read-only comparison of each item's activities against its description. Findings are leads to review, not confirmed bugs.`, ``,
  `| pack | docs | with activities | flagged |`, `|---|---|---|---|`, ...Object.entries(stats).map(([p, s]) => `| ${p} | ${s.docs} | ${s.withActivities} | ${s.flagged} |`), ``,
  `By kind: ${Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`, ``,
  ...findings.flatMap((f) => [`## ${f.pack}/${f.name}`, ...f.issues.map((i) => `- ${i.kind}: ${i.detail}`), ``])].join("\n");
writeFileSync("reports/automation-accuracy.md", md);
console.log(JSON.stringify({ stats, byKind }, null, 1));
