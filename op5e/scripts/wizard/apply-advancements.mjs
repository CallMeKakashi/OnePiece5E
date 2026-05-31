/**
 * Apply compendium items through dnd5e's AdvancementManager so race/class grants,
 * proficiencies, and nested item grants resolve on the actor.
 */

const ADVANCEMENT_COMPLETE_TIMEOUT_MS = 120_000;

function getAdvancementManagerClass() {
  return (
    globalThis.dnd5e?.applications?.advancement?.AdvancementManager ??
    game.dnd5e?.applications?.advancement?.AdvancementManager
  );
}

function waitForAdvancementManagerComplete(manager) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      Hooks.off("dnd5e.advancementManagerComplete", onComplete);
      reject(new Error("Timed out waiting for advancement application to finish."));
    }, ADVANCEMENT_COMPLETE_TIMEOUT_MS);

    const onComplete = (mgr) => {
      if (mgr !== manager) return;
      clearTimeout(timeout);
      Hooks.off("dnd5e.advancementManagerComplete", onComplete);
      resolve();
    };

    Hooks.on("dnd5e.advancementManagerComplete", onComplete);
  });
}

/**
 * @param {Actor} actor
 * @param {object} itemData  Item document data (e.g. from CompendiumDocument#toObject)
 */
export async function importItemWithAdvancements(actor, itemData) {
  const AdvancementManager = getAdvancementManagerClass();
  if (!AdvancementManager) {
    await actor.createEmbeddedDocuments("Item", [itemData]);
    return;
  }

  const data = foundry.utils.deepClone(itemData);
  if (data.type === "class") {
    foundry.utils.setProperty(data, "system.levels", data.system?.levels ?? 1);
  }

  // Foundry/dnd5e advancements include user-choice steps (notably starting equipment).
  // If we set automaticApplication, the system will apply defaults and never prompt.
  const manager = AdvancementManager.forNewItem(actor, data, { automaticApplication: false });
  if (!manager.steps.length) {
    await actor.createEmbeddedDocuments("Item", [itemData]);
    return;
  }

  const done = waitForAdvancementManagerComplete(manager);
  manager.render(true);
  await done;
}

/**
 * @param {Actor} actor
 * @param {string} packCollection
 * @param {string} docId
 */
export async function importFromPackWithAdvancements(actor, packCollection, docId) {
  if (!docId) return null;
  const pack = game.packs.get(packCollection);
  if (!pack) return null;
  const doc = await pack.getDocument(docId);
  if (!doc) return null;
  await importItemWithAdvancements(actor, doc.toObject());
  return doc;
}

/**
 * Grant starting beri stored on compendium items (flags.op5e.startingBeri).
 * @param {Actor} actor
 * @param {object[]} sourceItems  Imported Item documents (with flags.op5e.startingBeri)
 */
export async function applyStartingBeri(actor, sourceItems) {
  let total = 0;
  for (const item of sourceItems) {
    const beri = Number(item?.flags?.op5e?.startingBeri ?? 0);
    if (beri > 0) total += beri;
  }
  if (total <= 0) return;

  // system.currency.gp is the internal key; CONFIG labels it as Berries (ʙ).
  const currency = foundry.utils.deepClone(actor.system.currency ?? {});
  currency.gp = (Number(currency.gp) || 0) + total;
  await actor.update({ "system.currency": currency });
}
