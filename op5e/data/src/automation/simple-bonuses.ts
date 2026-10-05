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
