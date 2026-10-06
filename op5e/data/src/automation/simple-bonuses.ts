import type { Spec } from "../../helpers/spec.js";

// Flat bonuses that the text states without a condition, found by scripts/audit-text-only.mjs. The conditional parts of each feature stay as text.
export const simpleBonusSpecs: Record<string, Spec> = {
  "feats/Mobile": { activities: [], extraEffects: [{ name: "Mobile", transfer: true, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10" }] }] },
  "feats/Savage Attacker": { activities: [], extraEffects: [{ name: "Savage Attacker", transfer: true, changes: [
    { key: "system.bonuses.mwak.damage", mode: 2, value: "+1" }, { key: "system.bonuses.rwak.damage", mode: 2, value: "+1" },
  ] }] },
  // Wrestling: unarmed damage dice one step larger (the same flag Unarmed Master and Spirit Adept use, see automation/unarmed.ts)
  "class-features/Fighting Style: Wrestling": { activities: [], extraEffects: [{ name: "Wrestling", transfer: true, changes: [{ key: "flags.op5e.unarmedDieStep", mode: 2, value: "1" }] }] },
};

// Batch 1 of the text-only features (issue #26; Alert, Observant and Tough are already handled natively by dnd5e): unconditional speed, initiative, passive score, darkvision and hit point bonuses stated in the feat text.
const eff = (name: string, ...changes: { key: string; mode: number; value: string }[]): Spec => ({ activities: [], extraEffects: [{ name, transfer: true, changes }] });
const speed = (kind: string, n: number) => ({ key: `system.attributes.movement.${kind}`, mode: 2, value: String(n) });
export const batch1Specs: Record<string, Spec> = {
  "feats/Charger": eff("Charger", speed("walk", 10)),
  "feats/Fleet-Footed": eff("Fleet-Footed", speed("walk", 5), { key: "system.attributes.init.bonus", mode: 2, value: "+@prof" }),
  "feats/Hooves Inbound": eff("Hooves Inbound", speed("walk", 5)),
  "feats/Knack Of The Pretender": eff("Knack Of The Pretender", speed("walk", 5)),
  "feats/Water Wings": eff("Water Wings", speed("swim", 10)),
  "feats/Sea Sovereignty": eff("Sea Sovereignty", speed("swim", 10)),
  "feats/Perceptive": eff("Perceptive", { key: "system.attributes.senses.darkvision", mode: 2, value: "30" }),
  "feats/Knack Of The Hunter": eff("Knack Of The Hunter", { key: "system.attributes.senses.darkvision", mode: 2, value: "60" }),
  "feats/Made For War": eff("Made For War", { key: "system.attributes.hp.bonuses.overall", mode: 2, value: "+@details.level" }),
};
