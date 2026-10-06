/**
 * Headless ("auto-apply default choices") driver for dnd5e AdvancementManager, used by the wizard's testing option
 * and game.op5eCharacterCreator.createFromDraft(draft, {auto:true}). The player-facing path never uses this: it renders
 * the manager UI exactly like Foundry's own Level Up. Ported from dev/harness/advance-lib.mjs (__op5eRun) and extended with
 * subclass, hit-point mode and native-prerequisite-aware ItemChoice picks.
 */
const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];

function chosenSet(adv) {
  return new Set(Object.values(adv.value?.added ?? {}).flatMap((o) => Object.values(o)));
}

/** Value to apply for one advancement step, or null to skip it. ctx: {subUuid, haki, hpMode, note} */
async function pick(manager, flow, adv, ctx) {
  const clone = manager.clone;
  const lvl = flow.level;
  switch (adv.constructor.typeName) {
    case "ItemChoice": {
      const count = adv.configuration.choices[lvl]?.count ?? 0;
      const have = chosenSet(adv);
      const out = {};
      const docs = [];
      for (const p of adv.configuration.pool ?? []) {
        const doc = await fromUuid(p.uuid);
        if (doc) docs.push({ uuid: p.uuid, doc });
      }
      // Preferences: Role takes the first role, Devil Fruit "No Devil Fruit (yet)" (or ctx.fruit), Haki the preset branch.
      const title = String(adv.title ?? "");
      const wantName = /devil fruit/i.test(title) ? (ctx.fruit ?? "No Devil Fruit") : null;
      const branch = ctx.haki?.[lvl];
      const prefer = (ctx.prefer ?? []).map((r) => (r instanceof RegExp ? r : new RegExp(r, "i")));
      const rank = ({ doc }) =>
        prefer.some((r) => r.test(doc.name)) ? 0 :
        wantName && doc.name.toLowerCase().includes(wantName.toLowerCase()) ? 0
        : branch && doc.name.toLowerCase().includes(branch) ? 0 : 1;
      docs.sort((x, y) => rank(x) - rank(y));
      const picked = [...have];
      const idOf = (doc) => doc.system?.identifier ?? doc.identifier;
      for (const { uuid, doc } of docs) {
        if (Object.keys(out).length >= count) break;
        if (have.has(uuid)) continue;
        // what dnd5e's ItemChoice UI does: only offer entries whose native prerequisites pass
        if (doc.system?.validatePrerequisites) {
          // dnd5e's validatePrerequisites reads i.system.identifier itself: pass the item documents, not identifiers
          const added = [...picked.map((u) => fromUuidSync(u)).filter(Boolean), ...Object.keys(out).map((u) => docs.find((d) => d.uuid === u).doc)];
          if (doc.system.validatePrerequisites(clone, { added, level: clone.system.details?.level }) !== true) continue;
        }
        out[uuid] = true;
      }
      if (Object.keys(out).length < count) ctx.note(`L${lvl} ${adv.title}: only ${Object.keys(out).length}/${count} choices available`);
      return out;
    }
    case "ItemGrant":
      return Object.fromEntries(adv.configuration.items.map((i) => [i.uuid, true]));
    case "Trait": {
      const chosen = [];
      for (const grp of adv.configuration.choices) {
        // like the real dialog: one trait at a time, options recomputed after each pick (that is when replacements are offered)
        for (let n = 0; n < grp.count; n++) {
          const avail = await adv.availableChoices(new Set(chosen));
          const leaves = [];
          const walk = (m) => {
            for (const [k, v] of Object.entries(m ?? {})) {
              if (v?.children) walk(v.children);
              else if (!v?.disabled) leaves.push(k);
            }
          };
          const sets = avail?.choices ?? avail;
          walk(sets?.choices ?? sets);
          const one = leaves.find((k) => !chosen.includes(k) && ![...adv.configuration.grants].includes(k));
          if (!one) { ctx.note(`L${lvl} ${adv.title}: trait choice ${n}/${grp.count}`); break; }
          chosen.push(one);
        }
      }
      return { chosen: [...adv.configuration.grants, ...chosen] };
    }
    case "AbilityScoreImprovement": {
      const c = adv.configuration;
      const a = {};
      let left = c.points;
      const order = [...ABILITIES].sort((x, y) => (clone.system.abilities[y]?.value ?? 0) - (clone.system.abilities[x]?.value ?? 0));
      for (const k of order) {
        if (left <= 0) break;
        if (c.locked?.has?.(k)) continue;
        const give = Math.min(left, c.cap ?? left, 20 - (clone.system.abilities[k]?.value ?? 0));
        if (give > 0) { a[k] = give; left -= give; }
      }
      return { type: "asi", assignments: a };
    }
    case "Subclass":
      return ctx.subUuid ? { uuid: ctx.subUuid } : null;
    case "HitPoints": {
      if (lvl === 1 && clone.itemTypes.class.length <= 1) return { [lvl]: "max" };
      if (ctx.hpMode === "roll") {
        // Book ruling "Rolling Hit Points": roll, but a roll below the average may be replaced by the average.
        const die = adv.hitDieValue;
        const roll = await new Roll(`1d${die}`).evaluate();
        return { [lvl]: Math.max(roll.total, die / 2 + 1) };
      }
      return { [lvl]: "avg" };
    }
    default:
      return flow.getAutomaticApplicationValue();
  }
}

/** Applies every step of the manager on its clone. ctx: {level, subUuid, haki, hpMode, note} */
export async function applyAllSteps(manager, ctx) {
  const AM = dnd5e.applications.advancement.AdvancementManager;
  const clone = manager.clone;
  let guard = 0;
  for (let i = 0; i < manager.steps.length; i++) {
    if (++guard > 3000) { ctx.note("step guard hit"); break; }
    const step = manager.steps[i];
    try {
      if (step.flow && step.type === "forward") {
        const adv = step.flow.advancement;
        // a subclass always comes from the wizard's own pick (an empty value would insert a nameless item)
        let d = adv.type === "Subclass" ? false : await step.flow.getAutomaticApplicationValue();   // async since dnd5e 5.3
        if (d === false) d = await pick(manager, step.flow, adv, ctx);
        if (d === null) { /* nothing requested (e.g. subclass not due) */ }
        else if (d === false || d === undefined) ctx.note(`L${step.flow.level} ${adv.title}: nothing to apply`);
        else {
          const before = new Set(clone.items.map((x) => x.id));
          await adv.apply(step.flow.level, d);
          for (const it of clone.items) {
            if (before.has(it.id) || !it.hasAdvancement) continue;
            const cls = clone.items.find((x) => x.type === "class");
            const extra = [];
            for (let l = 0; l <= ctx.level; l++) extra.push(...AM.flowsForLevel(it, l));
            manager.steps.splice(i + 1, 0, ...extra.map((flow) => ({ type: "forward", flow, synthetic: true, class: { item: cls, level: Math.max(flow.level, 1) } })));
          }
        }
      }
      if (step.class && !step.synthetic) step.class.item.updateSource({ "system.levels": step.class.level });
      clone.reset();
    } catch (e) {
      ctx.note(`step ${i} ${step.flow?.advancement?.title ?? ""}: ${String(e.message).slice(0, 140)}`);
    }
  }
  clone.reset();
}

/** Writes the manager's clone back onto the real actor (what the manager's own Complete button does, without the UI). */
export async function commitManager(manager) {
  const actor = manager.actor;
  const clone = manager.clone;
  clone.reset();
  const src = clone.toObject();
  const cur = actor.toObject();
  const sysDiff = foundry.utils.diffObject(cur.system, src.system);
  if (!foundry.utils.isEmpty(sysDiff)) await actor.update({ system: sysDiff }, { isAdvancement: true });

  const have = new Set(actor.items.map((i) => i.id));
  const toCreate = clone.items.filter((i) => !have.has(i.id)).map((i) => i.toObject());
  const toDelete = actor.items.filter((i) => !clone.items.has(i.id)).map((i) => i.id);
  const toUpdate = [];
  for (const ci of clone.items) {
    const ai = actor.items.get(ci.id);
    if (!ai) continue;
    const diff = foundry.utils.diffObject(ai.toObject(), ci.toObject());
    if (!foundry.utils.isEmpty(diff)) toUpdate.push({ ...diff, _id: ci.id });
  }
  if (toCreate.length) await actor.createEmbeddedDocuments("Item", toCreate, { keepId: true, isAdvancement: true });
  if (toUpdate.length) await actor.updateEmbeddedDocuments("Item", toUpdate, { isAdvancement: true });
  if (toDelete.length) await actor.deleteEmbeddedDocuments("Item", toDelete, { isAdvancement: true });
}
