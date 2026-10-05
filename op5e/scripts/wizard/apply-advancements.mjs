/**
 * Apply compendium items through dnd5e's AdvancementManager so race/class grants,
 * proficiencies, and nested item grants resolve on the actor.
 *
 * Player path: the manager's own UI (automaticApplication:false), same as Foundry's Level Up.
 * Testing path (opts.auto): defaults are chosen headlessly by auto-advance.mjs.
 */
import { applyAllSteps, commitManager } from "./auto-advance.mjs";

const ADVANCEMENT_COMPLETE_TIMEOUT_MS = 1_800_000;

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
 * Run a prepared manager: UI + wait for the player, or headless when opts.auto.
 * @param {object} manager
 * @param {{auto?: boolean, level?: number, subUuid?: string, haki?: object, fruit?: string, hpMode?: string, notes?: string[]}} opts
 * @returns {Promise<boolean>} false when the manager had no steps
 */
export async function runManager(manager, opts = {}) {
  if (!manager.steps.length) return false;
  if (opts.auto) {
    const notes = opts.notes ?? [];
    await applyAllSteps(manager, {
      level: opts.level ?? 1,
      subUuid: opts.subUuid,
      haki: opts.haki,
      fruit: opts.fruit,
      hpMode: opts.hpMode,
      note: (m) => notes.push(m),
    });
    await commitManager(manager);
    return true;
  }
  // the player already chose a subclass on the wizard's class step: show it pre-filled in dnd5e's own Subclass step (still changeable)
  if (opts.subUuid) {
    const sub = await fromUuid(opts.subUuid).catch(() => null);
    if (sub) for (const step of manager.steps) if (step.flow?.advancement?.constructor?.typeName === "Subclass") step.flow.subclass = sub;
  }
  const done = waitForAdvancementManagerComplete(manager);
  manager.render(true);
  await done;
  return true;
}

/**
 * @param {Actor} actor
 * @param {object} itemData  Item document data (e.g. from CompendiumDocument#toObject)
 * @param {object} [opts]    see runManager
 */
export async function importItemWithAdvancements(actor, itemData, opts = {}) {
  const AdvancementManager = getAdvancementManagerClass();
  if (!AdvancementManager) {
    await actor.createEmbeddedDocuments("Item", [itemData]);
    return;
  }

  const data = foundry.utils.deepClone(itemData);
  // Classes always enter at level 1; further levels go through forLevelChange like Foundry's Level Up.
  if (data.type === "class") foundry.utils.setProperty(data, "system.levels", 1);

  // Foundry/dnd5e advancements include user-choice steps (notably starting equipment).
  // If we set automaticApplication, the system will apply defaults and never prompt.
  const manager = AdvancementManager.forNewItem(actor, data, { automaticApplication: !!opts.auto });
  if (!(await runManager(manager, { ...opts, level: 1 }))) {
    await actor.createEmbeddedDocuments("Item", [itemData]);
  }
}

/**
 * @param {Actor} actor
 * @param {string} packCollection
 * @param {string} docId
 * @param {object} [opts]    see runManager
 */
export async function importFromPackWithAdvancements(actor, packCollection, docId, opts = {}) {
  if (!docId) return null;
  const pack = game.packs.get(packCollection);
  if (!pack) return null;
  const doc = await pack.getDocument(docId);
  if (!doc) return null;
  // remember where the item came from (stamped after the import): dnd5e finds "feats you already have" through _stats.compendiumSource, which toObject() leaves empty for built packs.
  // Without it a feat taken here (the free feat) is invisible to the duplicate check and the same feat can be taken again later (Role bonus feat).
  const before = new Set(actor.items.map((i) => i.id));
  await importItemWithAdvancements(actor, doc.toObject(), opts);
  for (const it of actor.items.filter((i) => !before.has(i.id) && i.type === doc.type && i.name === doc.name && !i._stats?.compendiumSource)) {
    await it.update({ "_stats.compendiumSource": doc.uuid });
  }
  return doc;
}

/**
 * Raise a class on the actor by one level at a time through AdvancementManager.forLevelChange
 * (what Foundry's Level Up runs) until it reaches `target`.
 * @param {Actor} actor
 * @param {string} classItemId  embedded class item id
 * @param {number} target
 * @param {object} [opts]       see runManager (subUuid applies to this class)
 */
export async function levelClassTo(actor, classItemId, target, opts = {}) {
  const AdvancementManager = getAdvancementManagerClass();
  let item = actor.items.get(classItemId);
  while (item && item.system.levels < target) {
    const next = item.system.levels + 1;
    const manager = AdvancementManager.forLevelChange(actor, classItemId, 1, { automaticApplication: !!opts.auto });
    if (!(await runManager(manager, { ...opts, level: next }))) {
      await item.update({ "system.levels": next });
    }
    item = actor.items.get(classItemId);
    if (item && item.system.levels < next) throw new Error(`Level-up to ${next} did not complete for ${item.name}.`);
  }
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
