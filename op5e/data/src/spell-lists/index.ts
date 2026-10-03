import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import creations from "../creations/index.js";

// Class creation (spell) lists as dnd5e spell-list journal pages, registered via module flags.dnd5e.spellLists.
// The vault files are two-column PDF text; membership is recovered by matching known creation names (longest first),
// since every creation already carries its own level. Only files the source labels by class are used.
const DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../../Sourcebook/Appendix A Creations/Creation Lists");
const words = (s: string) => s.toLowerCase().replace(/\(r\)/g, " ").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);

const byName = new Map<string, string>();
for (const c of creations) byName.set(words(c.name).join(" "), c._id);
const maxLen = Math.max(...[...byName.keys()].map((k) => k.split(" ").length));

export function matchNames(text: string): string[] {
  const ws = words(text.replace(/\(R\)/g, " "));
  const hits = new Set<string>();
  for (let i = 0; i < ws.length;) {
    let took = 0;
    for (let n = Math.min(maxLen, ws.length - i); n >= 1; n--) {
      const id = byName.get(ws.slice(i, i + n).join(" "));
      if (id) { hits.add(id); took = n; break; }
    }
    i += took || 1;
  }
  return [...hits];
}

// Authoritative clean lists supplied by the DM (class-lists.txt): exact name match, unmatched names are reported.
const clean = new Map<string, string[]>();
{
  let cur = "";
  for (const line of readFileSync(join(dirname(fileURLToPath(import.meta.url)), "class-lists.txt"), "utf8").split(/\r?\n/)) {
    const h = line.match(/^(\w+) Creations$/);
    if (h) { cur = h[1].toLowerCase(); clean.set(cur, []); } else if (line.startsWith("* ")) clean.get(cur)!.push(line.slice(2).replace(/\(R\)/, "").trim());
  }
}
export const unmatchedNames: Record<string, string[]> = {};
// spelling variants between the supplied lists and compendium names
const ALIAS: Record<string, string> = { combust: "combustion", "wind blast": "windblast", featherfall: "feather fall", thunderstep: "thunder step" };
const fromClean = (id: string) => {
  const ids = new Set<string>();
  for (const n of clean.get(id) ?? []) {
    const key = words(n).join(" ");
    const hit = byName.get(ALIAS[key] ?? key);
    if (hit) ids.add(hit); else (unmatchedNames[id] ??= []).push(n);
  }
  return [...ids];
};

const LISTS = [
  { identifier: "bard", name: "Bard Creations", file: "Bard Creations Charm Person.md", clean: true },
  { identifier: "savant", name: "Savant Creations", file: "Savant Creations Lesser Restoration.md", clean: true },
  { identifier: "medic", name: "Medic Creations", file: "", clean: true },
  { identifier: "gadgeteer", name: "Gadgeteer Creations", file: "", clean: true },
  { identifier: "marksman", name: "Marksman Creations", file: "", clean: true },
];

export const spellListData = LISTS.map((l) => {
  if (l.clean) return { ...l, creationIds: fromClean(l.identifier) };
  const raw = readFileSync(join(DIR, l.file), "utf8").replace(/^---[\s\S]*?---\s*/, "").replace(/^#+ .*$/gm, " ").replace(/<!--.*?-->/g, " ");
  return { ...l, creationIds: matchNames(raw) };
});

export default spellListData.map((l) => {
  const entryId = generateId(`spell-list/${l.identifier}`), pageId = generateId(`spell-list/${l.identifier}/page`);
  return {
    _id: entryId, name: l.name, folder: null, sort: 0, ownership: { default: 0 },
    flags: { op5e: { spellListPage: compendiumUuid("spell-lists" as never, entryId).replace(/^Compendium\.op5e\.spell-lists\./, `Compendium.op5e.spell-lists.JournalEntry.`) + `.JournalEntryPage.${pageId}`, source: l.file, automation: "NEEDS_REVIEW", note: "extracted from scrambled two-column PDF text by name matching;" } },
    pages: [{
      _id: pageId, name: l.name, type: "spells", sort: 0, flags: {},
      system: { type: "class", identifier: l.identifier, grouping: "level", description: { value: "<p><em>Auto-extracted from the sourcebook's two-column PDF text; may be incomplete. Verify against the printed list.</em></p>" }, spells: l.creationIds.map((id) => compendiumUuid("creations", id)), unlinkedSpells: [] },
      title: { show: true, level: 1 }, text: {}, ownership: { default: -1 },
    }],
  };
});
