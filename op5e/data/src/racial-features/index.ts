import type { FeatureItem } from "../../schemas/feature.js";
import { assignIcons } from "../../helpers/icons.js";
import { featAutomation } from "../../helpers/feat-advancement.js";

import { humanFeatures } from "./human.js";
import { fishmanFeatures } from "./fishman.js";
import { minkFeatures } from "./mink.js";
import { giantFeatures } from "./giant.js";
import { skyIslanderFeatures } from "./sky-islander.js";
import { dwarvesFeatures } from "./dwarves.js";
import { merfolkFeatures } from "./merfolk.js";
import { lunarianFeatures } from "./lunarian.js";
import { augmentedFeatures } from "./augmented.js";

/** Wire explicit skill/tool/save proficiencies named in a trait's text into a Trait advancement (races keep their own ASI/effects). */
const withProficiencies = (f: FeatureItem): FeatureItem => {
  if ((f.system as { advancement?: unknown[] }).advancement?.length) return f;
  const a = featAutomation(f._id, f.system.description.value, (m) => console.warn(`  ⚠ racial ${f.name}: ${m}`), { proficienciesOnly: true });
  return a.advancement.length ? ({ ...f, system: { ...f.system, advancement: a.advancement } } as unknown as FeatureItem) : f;
};

export const items: FeatureItem[] = assignIcons([
  ...humanFeatures,
  ...fishmanFeatures,
  ...minkFeatures,
  ...giantFeatures,
  ...skyIslanderFeatures,
  ...dwarvesFeatures,
  ...merfolkFeatures,
  ...lunarianFeatures,
  ...augmentedFeatures,
].map(withProficiencies));
export default items;
