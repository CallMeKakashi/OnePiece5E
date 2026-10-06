// Sourcebook update pipeline: snapshot extracted/entries.json, re-run the extraction, and report what moved.
// Usage: node scripts/sourcebook-update.mjs      Writes reports/sourcebook-diff.md. Then run: node scripts/ship-check.mjs
// The report lists new, removed and changed entries (changed = body text, dice or saves differ) and which need a human decision.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const FILE = "extracted/entries.json", PREV = "extracted/previous/entries.json";
const load = (f) => new Map(JSON.parse(readFileSync(f, "utf8")).map((e) => [e.kind + ":" + e.key, e]));
const sig = (e) => createHash("sha1").update(e.body.replace(/\s+/g, " ").trim()).digest("hex");
if (!process.env.NO_SNAPSHOT && existsSync(FILE)) { mkdirSync("extracted/previous", { recursive: true }); copyFileSync(FILE, PREV); }
const r = spawnSync("node", ["scripts/extract-sourcebook.mjs"], { stdio: "inherit" });
if (r.status) { console.error("extraction failed"); process.exit(1); }
if (!existsSync(PREV)) { console.log("No previous snapshot: this run is the baseline."); process.exit(0); }

const a = load(PREV), b = load(FILE), added = [], removed = [], changed = [];
for (const [k, e] of b) { const o = a.get(k); if (!o) added.push(e); else if (sig(o) !== sig(e)) changed.push({ o, e, dice: JSON.stringify(o.hints.dice) !== JSON.stringify(e.hints.dice), saves: JSON.stringify(o.hints.saves) !== JSON.stringify(e.hints.saves), words: e.hints.words - o.hints.words }); }
for (const [k, e] of a) if (!b.has(k)) removed.push(e);
const line = (e) => `- ${e.name} (${e.kind}, ${e.source.file})`;
const md = [`# Sourcebook diff`, "", `${added.length} new, ${removed.length} removed, ${changed.length} changed.`, "",
  `## Needs a human decision`, "- Changed entries whose dice or saving throws moved (the compendium automation probably needs the same change):",
  ...changed.filter((c) => c.dice || c.saves).map((c) => `  - ${c.e.name} (${c.e.kind}): dice ${c.dice ? JSON.stringify(c.o.hints.dice) + " -> " + JSON.stringify(c.e.hints.dice) : "same"}, saves ${c.saves ? "changed" : "same"}`),
  "- Removed entries (is the compendium doc obsolete or renamed?):", ...removed.map((e) => "  " + line(e)), "",
  `## New`, ...added.map(line), "", `## Changed (text only)`, ...changed.filter((c) => !c.dice && !c.saves).map((c) => `- ${c.e.name} (${c.e.kind}) ${c.words >= 0 ? "+" : ""}${c.words} words`), ""].join("\n");
writeFileSync("reports/sourcebook-diff.md", md);
console.log(md.split("\n").slice(0, 3).join(" "), "\nreport: reports/sourcebook-diff.md\nNext: node scripts/ship-check.mjs");
