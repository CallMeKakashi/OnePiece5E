import type { Spec } from "../../helpers/spec.js";

// Aura of Freedom and Aura of Tenacity used to be buttons that applied a one-minute effect to targets (issue #41). They are real token-attached auras now:
// scripts/auras.mjs adds an Aura Effects aura to the feature when Aura Effects is active. The pack data stays plain (an effect type from a module that
// is not installed would make the item invalid), so the buttons are simply removed here.
export const auraSpecs: Record<string, Spec> = {
  "class-features/Aura of Freedom": { activities: [] },
  "class-features/Aura of Tenacity": { activities: [] },
};
