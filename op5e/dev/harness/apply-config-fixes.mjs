// bb-rehearsal only: applies the agreed setting corrections (midi-qol crit rule, chat log pruning, splatter violence, op5e extra sources minus 2024 packs).
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const set = (ns, k, v) => game.settings.set(ns, k, v);
  await set("midi-qol", "CriticalDamage", "maxBaseRollCrit");
  await set("midi-qol", "CriticalDamageGM", "maxBaseRollCrit");
  await set("midi-qol", "pruneChatLog", true);
  await set("splatter", "violence", 1);
  const cand = game.packs.filter((p) => p.documentName === "Item" && !["op5e", "dnd5e"].includes(p.metadata.packageName) && !/2024|24\b/.test(`${p.collection} ${p.metadata.label}`)).map((p) => p.collection).sort();
  await set("op5e", "extraSources", cand);
  return { crit: game.settings.get("midi-qol", "CriticalDamage"), prune: game.settings.get("midi-qol", "pruneChatLog"), violence: game.settings.get("splatter", "violence"), extraSources: game.settings.get("op5e", "extraSources") };
};
await withFoundry(async (page) => console.log(JSON.stringify(await page.evaluate(`(${run.toString()})()`), null, 1)));
