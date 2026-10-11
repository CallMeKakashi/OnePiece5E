import { withFoundry } from "./drive.mjs";
const run = () => {
  const s = (ns, k) => { const x = game.settings.settings.get(`${ns}.${k}`); return { choices: x?.choices, type: x?.type?.name, value: game.settings.get(ns, k) }; };
  return { crit: s("midi-qol", "CriticalDamage"), critGM: s("midi-qol", "CriticalDamageGM"), extra: s("op5e", "extraSources"),
    packs: game.packs.filter((p) => p.documentName === "Item" || p.documentName === "Actor").map((p) => `${p.collection} | ${p.metadata.label}`).filter((l) => /ddb|one-piece|2024|dnd5e/i.test(l)) };
};
await withFoundry(async (page) => console.log(JSON.stringify(await page.evaluate(`(${run.toString()})()`), null, 1)));
