// "Import OP5e journals" button in the Journal tab: copies the OP5e Reference and Spell Lists journals into a world folder.
// Copies are static (they do not follow later module updates); shift-click replaces copies made earlier. GM only.
import { MODULE_ID } from "./constants.mjs";

const PACKS = [["reference", "OP5e Reference"], ["spell-lists", "OP5e Spell Lists"]];

export async function importOp5eJournals({ replace = false } = {}) {
  let made = 0, replaced = 0, skipped = 0;
  for (const [pack, label] of PACKS) {
    const p = game.packs.get(`${MODULE_ID}.${pack}`);
    if (!p) continue;
    const folder = game.folders.find((f) => f.type === "JournalEntry" && f.name === label) ?? (await Folder.create({ name: label, type: "JournalEntry" }));
    for (const doc of await p.getDocuments()) {
      const mine = game.journal.find((j) => j.getFlag(MODULE_ID, "importedFrom") === doc.uuid);
      if (mine && !replace) { skipped++; continue; }
      if (mine) { await mine.delete(); replaced++; } else made++;
      const data = doc.toObject(); delete data._id; delete data._stats;
      await JournalEntry.create({ ...data, folder: folder.id, flags: { ...data.flags, [MODULE_ID]: { importedFrom: doc.uuid } }, ownership: { default: 2 } });
    }
  }
  ui.notifications.info(`OP5e journals: ${made} imported, ${replaced} replaced, ${skipped} already there.`);
  return { made, replaced, skipped };
}

export function registerImportJournals() {
  Hooks.on("renderJournalDirectory", (app, html) => {
    if (!game.user.isGM) return;
    const root = html instanceof HTMLElement ? html : html[0];
    if (root.querySelector(".op5e-import-journals")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "op5e-import-journals"; b.innerHTML = '<i class="fa-solid fa-book"></i> Import OP5e journals';
    b.title = "Copy the OP5e Reference and Spell Lists journals into this world (shift-click replaces earlier copies)";
    b.addEventListener("click", (ev) => importOp5eJournals({ replace: ev.shiftKey }));
    (root.querySelector(".directory-footer") ?? root.querySelector(".header-actions") ?? root.querySelector("header"))?.append(b);
  });
  game.op5eImportJournals = importOp5eJournals;   // also usable from a macro: game.op5eImportJournals()
}
