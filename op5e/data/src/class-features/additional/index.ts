import type { FeatureItem } from "../../../schemas/feature.js";

import { ardentZealFeatures } from "./ardent-zeal.js";
import { armorlessGuardianFeatures } from "./armorless-guardian.js";
import { battleModesFeatures } from "./battle-modes.js";
import { burnBabyBurnFeatures } from "./burn-baby-burn.js";
import { cannonballChuckerFeatures } from "./cannonball-chucker.js";
import { charismaticBastionFeatures } from "./charismatic-bastion.js";
import { cheaterCheaterFeatures } from "./cheater-cheater.js";
import { destructiveWaveFeatures } from "./destructive-wave.js";
import { dodgeRollFeatures } from "./dodge-roll.js";
import { dragonClawFistFeatures } from "./dragon-claw-fist.js";
import { eightImpactsFistFeatures } from "./eight-impacts-fist.js";
import { emphaticObservationFeatures } from "./emphatic-observation.js";
import { fearsomeFortitudeFeatures } from "./fearsome-fortitude.js";
import { fishmanKarateAdeptFeatures } from "./fishman-karate-adept.js";
import { flowingMindFeatures } from "./flowing-mind.js";
import { fortuneTellingFeatures } from "./fortune-telling.js";
import { foxfireStyleFeatures } from "./foxfire-style.js";
import { fullBodyArmamentFeatures } from "./full-body-armament.js";
import { geoFistFeatures } from "./geo-fist.js";
import { heartStringsFeatures } from "./heart-strings.js";
import { inspiredInnovationFeatures } from "./inspired-innovation.js";
import { ironFuryFeatures } from "./iron-fury.js";
import { kappaStyleFeatures } from "./kappa-style.js";
import { legTechniqueWayFeatures } from "./leg-technique-way.js";
import { lifeReturnFeatures } from "./life-return.js";
import { longshotFeatures } from "./longshot.js";
import { machiavellianMisfitFeatures } from "./machiavellian-misfit.js";
import { manDemonTacticsFeatures } from "./man-demon-tactics.js";
import { masterOfTheCraftFeatures } from "./master-of-the-craft.js";
import { mermanCombatFeatures } from "./merman-combat.js";
import { multipleWeaponStyleFeatures } from "./multiple-weapon-style.js";
import { mutantMetamorphosisFeatures } from "./mutant-metamorphosis.js";
import { newkamaKenpoFeatures } from "./newkama-kenpo.js";
import { noSwordStyleFeatures } from "./no-sword-style.js";
import { observationKillingFeatures } from "./observation-killing.js";
import { phdFeatures } from "./phd.js";
import { planBFeatures } from "./plan-b.js";
import { powerfulLaughterFeatures } from "./powerful-laughter.js";
import { ragingSingularityFeatures } from "./raging-singularity.js";
import { ramenKenpoFeatures } from "./ramen-kenpo.js";
import { ricochetRoundsFeatures } from "./ricochet-rounds.js";
import { ropeActionFeatures } from "./rope-action.js";
import { sharpFocusFeatures } from "./sharp-focus.js";
import { sixPowersAdeptFeatures } from "./six-powers-adept.js";
import { toughCustomerFeatures } from "./tough-customer.js";
import { voiceOfAllThingsFeatures } from "./voice-of-all-things.js";
import { worldChampionFeatures } from "./world-champion.js";

export const additionalPowerFeatures: FeatureItem[] = markAdditionalPowerFlags([
  ...ardentZealFeatures,
  ...armorlessGuardianFeatures,
  ...battleModesFeatures,
  ...burnBabyBurnFeatures,
  ...cannonballChuckerFeatures,
  ...charismaticBastionFeatures,
  ...cheaterCheaterFeatures,
  ...destructiveWaveFeatures,
  ...dodgeRollFeatures,
  ...dragonClawFistFeatures,
  ...eightImpactsFistFeatures,
  ...emphaticObservationFeatures,
  ...fearsomeFortitudeFeatures,
  ...fishmanKarateAdeptFeatures,
  ...flowingMindFeatures,
  ...fortuneTellingFeatures,
  ...foxfireStyleFeatures,
  ...fullBodyArmamentFeatures,
  ...geoFistFeatures,
  ...heartStringsFeatures,
  ...inspiredInnovationFeatures,
  ...ironFuryFeatures,
  ...kappaStyleFeatures,
  ...legTechniqueWayFeatures,
  ...lifeReturnFeatures,
  ...longshotFeatures,
  ...machiavellianMisfitFeatures,
  ...manDemonTacticsFeatures,
  ...masterOfTheCraftFeatures,
  ...mermanCombatFeatures,
  ...multipleWeaponStyleFeatures,
  ...mutantMetamorphosisFeatures,
  ...newkamaKenpoFeatures,
  ...noSwordStyleFeatures,
  ...observationKillingFeatures,
  ...phdFeatures,
  ...planBFeatures,
  ...powerfulLaughterFeatures,
  ...ragingSingularityFeatures,
  ...ramenKenpoFeatures,
  ...ricochetRoundsFeatures,
  ...ropeActionFeatures,
  ...sharpFocusFeatures,
  ...sixPowersAdeptFeatures,
  ...toughCustomerFeatures,
  ...voiceOfAllThingsFeatures,
  ...worldChampionFeatures,
]);

/** True tree root vs level-gated or chained sub-feature (47 roots, not 76). */
function isAdditionalPowerSubFeature(requirements: string, featureNames: Set<string>): boolean {
  const req = requirements.trim();
  if (!req) return false;
  if (featureNames.has(req)) return true;
  // Level-gated subs: "Burn Baby, Burn 5", "Voice of All Things 10", etc.
  for (const name of featureNames) {
    if (req.startsWith(`${name} `) || req.startsWith(`${name},`)) return true;
  }
  return false;
}

function markAdditionalPowerFlags(features: FeatureItem[]): FeatureItem[] {
  const names = new Set(features.map((f) => f.name));
  return features.map((f) => {
    const req = String(f.system?.requirements ?? "").trim();
    const isSubFeature = isAdditionalPowerSubFeature(req, names);
    return {
      ...f,
      flags: {
        ...(f.flags ?? {}),
        op5e: {
          ...((f.flags as { op5e?: Record<string, unknown> })?.op5e ?? {}),
          additionalPower: true,
          ...(isSubFeature ? {} : { additionalPowerRoot: true }),
        },
      },
    };
  });
}
