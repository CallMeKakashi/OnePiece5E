import type { Spec } from "../../helpers/spec.js";
import { classFeatureSpecs } from "./class-features.js";
import { classFeatureSpecs2 } from "./class-features-2.js";
import { featItemSpecs } from "./feats-items.js";
import { creationSpecs1 } from "./creations-1.js";
import { creationSpecs2 } from "./creations-2.js";
import { creationSpecs3 } from "./creations-3.js";
import { creationSpecs4 } from "./creations-4.js";
import { creationSpecs5 } from "./creations-5.js";
import { creationSpecs6 } from "./creations-6.js";
import { creationSpecs7 } from "./creations-7.js";
import { summonSpecs } from "./summons.js";
import { classContentSpecs } from "./class-content.js";
import { shipGearSpecs } from "./ship-gear.js";

/** "pack/Item Name" -> hand-written automation. See helpers/spec.ts. */
export const AUTOMATION: Record<string, Spec> = { ...classFeatureSpecs, ...classFeatureSpecs2, ...featItemSpecs, ...creationSpecs1, ...creationSpecs2, ...creationSpecs3, ...creationSpecs4, ...creationSpecs5, ...creationSpecs6, ...creationSpecs7, ...summonSpecs, ...shipGearSpecs, ...classContentSpecs };
import { sourcebookRuleSpecs } from "./sourcebook-rules.js"; Object.assign(AUTOMATION, sourcebookRuleSpecs);
import { workASpecs } from "./work-a.js"; Object.assign(AUTOMATION, workASpecs);

import { optionSpecs } from "./options.js"; Object.assign(AUTOMATION, optionSpecs);
import { workGSpecs } from "./work-g.js"; Object.assign(AUTOMATION, workGSpecs);
import { unarmedSpecs } from "./unarmed.js"; Object.assign(AUTOMATION, unarmedSpecs);
import { weaponMasterSpecs } from "./weapon-masters.js"; Object.assign(AUTOMATION, weaponMasterSpecs);
import { simpleBonusSpecs, batch1Specs, batch2Specs, batch3Specs } from "./simple-bonuses.js"; Object.assign(AUTOMATION, simpleBonusSpecs, batch1Specs, batch2Specs, batch3Specs);
import { batch4Specs } from "./text-batch4.js"; Object.assign(AUTOMATION, batch4Specs);
import { batch5Specs } from "./text-batch5.js"; Object.assign(AUTOMATION, batch5Specs);
import { batch6Specs } from "./text-batch6.js"; Object.assign(AUTOMATION, batch6Specs);
