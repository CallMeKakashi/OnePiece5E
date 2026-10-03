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
const words = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);

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

const LISTS = [
  { identifier: "bard", name: "Bard Creations", file: "Bard Creations Charm Person.md" },
  { identifier: "medic", name: "Medic Creations", file: "Medic Creations.md" },
  { identifier: "savant", name: "Savant Creations", file: "Savant Creations Lesser Restoration.md" },
  // gadgeteer / marksman: "Creations.md" and "Creations 2.md" are unlabelled fragments; assignment is ambiguous (see unresolved.json)
];

export const spellListData = LISTS.map((l) => {
  const raw = readFileSync(join(DIR, l.file), "utf8").replace(/^---[\s\S]*?---\s*/, "").replace(/^#+ .*$/gm, " ").replace(/<!--.*?-->/g, " ");
  return { ...l, creationIds: matchNames(raw) };
});

export default spellListData.map((l) => {
  const entryId = generateId(`spell-list/${l.identifier}`), pageId = generateId(`spell-list/${l.identifier}/page`);
  return {
    _id: entryId, name: l.name, folder: null, sort: 0, ownership: { default: 0 },
    flags: { op5e: { spellListPage: compendiumUuid("spell-lists" as never, entryId).replace(/^Compendium\.op5e\.spell-lists\./, `Compendium.op5e.spell-lists.JournalEntry.`) + `.JournalEntryPage.${pageId}`, source: l.file, automation: "NEEDS_REVIEW", note: "extracted from scrambled two-column PDF text by name matching; may be incomplete (Bard has no 6th-8th level creations)" } },
    pages: [{
      _id: pageId, name: l.name, type: "spells", sort: 0, flags: {},
      system: { type: "class", identifier: l.identifier, grouping: "level", description: { value: "<p><em>Auto-extracted from the sourcebook's two-column PDF text; may be incomplete. Verify against the printed list.</em></p>" }, spells: l.creationIds.map((id) => compendiumUuid("creations", id)), unlinkedSpells: [] },
      title: { show: true, level: 1 }, text: {}, ownership: { default: -1 },
    }],
  };
});
