import type { FeatureItem } from "../../schemas/feature.js";

// --- Additional Powers (Chapter 7) ---
import { additionalPowerFeatures } from "./additional/index.js";

// --- Fighter ---
import { fighterFeatures } from "./fighter.js";
import { fighterStyles } from "./fighter-styles.js";
import { marksmanStyles } from "./marksman-styles.js";
import { savantStyles } from "./savant-styles.js";
import { barbarianStyles } from "./barbarian-styles.js";
import { bardStyles } from "./bard-styles.js";
import { brawlerStyles } from "./brawler-styles.js";
import { hakiAbilities } from "./haki.js";
import { championFeatures } from "../subclasses/fighter-champion.js";
import { battlemasterFeatures } from "../subclasses/fighter-battlemaster.js";
import { bruteFeatures } from "../subclasses/fighter-brute.js";
import { gunslingerFeatures } from "../subclasses/fighter-gunslinger.js";
import { samuraiFeatures } from "../subclasses/fighter-samurai.js";
import { banneretFeatures } from "../subclasses/fighter-banneret.js";
import { cavalierFeatures } from "../subclasses/fighter-cavalier.js";
import { gadgetKnightFeatures } from "../subclasses/fighter-gadget-knight.js";
import { masterOfNoneFeatures } from "../subclasses/fighter-master-of-none.js";
import { armsDealerFeatures } from "../subclasses/fighter-arms-dealer.js";
import { blitzkriegFeatures } from "../subclasses/fighter-blitzkrieg.js";

// --- Rogue ---
import { rogueClassFeatures } from "./rogue.js";
import { features as rogueAssassinFeatures } from "../subclasses/rogue-assassin.js";
import { features as rogueBruiserFeatures } from "../subclasses/rogue-bruiser.js";
import { features as rogueFencerFeatures } from "../subclasses/rogue-fencer.js";
import { features as rogueGadgetTricksterFeatures } from "../subclasses/rogue-gadget-trickster.js";
import { features as rogueInquisitiveFeatures } from "../subclasses/rogue-inquisitive.js";
import { features as rogueRingmasterFeatures } from "../subclasses/rogue-ringmaster.js";
import { features as rogueSawbonesFeatures } from "../subclasses/rogue-sawbones.js";
import { features as rogueScoutFeatures } from "../subclasses/rogue-scout.js";
import { features as rogueSeekerFeatures } from "../subclasses/rogue-seeker.js";
import { features as rogueSwashbucklerFeatures } from "../subclasses/rogue-swashbuckler.js";
import { features as rogueThiefFeatures } from "../subclasses/rogue-thief.js";
import { features as rogueWildcardFeatures } from "../subclasses/rogue-wildcard.js";

// --- Barbarian ---
import { barbarianClassFeatures } from "./barbarian.js";
import { features as barbarianBerserkerFeatures } from "../subclasses/barbarian-berserker.js";
import { features as barbarianTotemWarriorFeatures } from "../subclasses/barbarian-totem-warrior.js";
import { features as barbarianStormHeraldFeatures } from "../subclasses/barbarian-storm-herald.js";
import { features as barbarianBladeMasterFeatures } from "../subclasses/barbarian-blade-master.js";
import { features as barbarianCannoneerFeatures } from "../subclasses/barbarian-cannoneer.js";
import { features as barbarianChannelerFeatures } from "../subclasses/barbarian-channeler.js";
import { features as barbarianShatteredMindFeatures } from "../subclasses/barbarian-shattered-mind.js";
import { features as barbarianForgemasterFeatures } from "../subclasses/barbarian-forgemaster.js";
import { features as barbarianPugilistFeatures } from "../subclasses/barbarian-pugilist.js";
import { features as barbarianSpiritSpeakerFeatures } from "../subclasses/barbarian-spirit-speaker.js";

// --- Bard ---
import { bardClassFeatures } from "./bard.js";
import { features as bardBewitchmentFeatures } from "../subclasses/bard-bewitchment.js";
import { features as bardLegendsFeatures } from "../subclasses/bard-legends.js";
import { features as bardLoreFeatures } from "../subclasses/bard-lore.js";
import { features as bardSwordsFeatures } from "../subclasses/bard-swords.js";
import { features as bardIdolFeatures } from "../subclasses/bard-idol.js";
import { features as bardEloquenceFeatures } from "../subclasses/bard-eloquence.js";

// --- Brawler ---
import { brawlerClassFeatures } from "./brawler.js";
import { features as brawlerOpenHandFeatures } from "../subclasses/brawler-open-hand.js";
import { features as brawlerDrunkenMasterFeatures } from "../subclasses/brawler-drunken-master.js";
import { features as brawlerFishmanKarateFeatures } from "../subclasses/brawler-fishman-karate.js";
import { features as brawlerOkamaKenpoFeatures } from "../subclasses/brawler-okama-kenpo.js";
import { features as brawlerPrivateEyeFeatures } from "../subclasses/brawler-private-eye.js";
import { features as brawlerNinjaFeatures } from "../subclasses/brawler-ninja.js";
import { features as brawlerDaredevilFeatures } from "../subclasses/brawler-daredevil.js";
import { features as brawlerChromaticCommandmentFeatures } from "../subclasses/brawler-chromatic-commandment.js";
import { features as brawlerSumoWrestlerFeatures } from "../subclasses/brawler-sumo-wrestler.js";
import { features as brawlerSixPowersMasterFeatures } from "../subclasses/brawler-six-powers-master.js";
import { features as brawlerSwordSageFeatures } from "../subclasses/brawler-sword-sage.js";
import { features as brawlerExpressionistFeatures } from "../subclasses/brawler-expressionist.js";
import { features as brawlerWayOfMercyFeatures } from "../subclasses/brawler-way-of-mercy.js";

// --- Marksman ---
import { marksmanClassFeatures } from "./marksman.js";
import { features as marksmanSniperFeatures } from "../subclasses/marksman-sniper.js";
import { features as marksmanBeastmasterFeatures } from "../subclasses/marksman-beastmaster.js";
import { features as marksmanBountyHunterFeatures } from "../subclasses/marksman-bounty-hunter.js";
import { features as marksmanSwarmkeeperFeatures } from "../subclasses/marksman-swarmkeeper.js";
import { features as marksmanNighthawkFeatures } from "../subclasses/marksman-nighthawk.js";
import { features as marksmanGuruFeatures } from "../subclasses/marksman-guru.js";
import { features as marksmanOlympianFeatures } from "../subclasses/marksman-olympian.js";

// --- Gadgeteer ---
import { gadgeteerClassFeatures } from "./gadgeteer.js";
import { features as gadgeteerAlchemistFeatures } from "../subclasses/gadgeteer-alchemist.js";
import { features as gadgeteerArmorerFeatures } from "../subclasses/gadgeteer-armorer.js";
import { features as gadgeteerArtilleristFeatures } from "../subclasses/gadgeteer-artillerist.js";
import { features as gadgeteerBattleSmithFeatures } from "../subclasses/gadgeteer-battle-smith.js";
import { features as gadgeteerElementalistFeatures } from "../subclasses/gadgeteer-elementalist.js";
import { features as gadgeteerSafeguardFeatures } from "../subclasses/gadgeteer-safeguard.js";

// --- Medic ---
import { medicClassFeatures } from "./medic.js";
import { features as medicFieldSurgeonFeatures } from "../subclasses/medic-field-surgeon.js";
import { features as medicPhysicianFeatures } from "../subclasses/medic-physician.js";
import { features as medicChemistFeatures } from "../subclasses/medic-chemist.js";
import { features as medicAmputatorFeatures } from "../subclasses/medic-amputator.js";
import { features as medicPlaguewrightFeatures } from "../subclasses/medic-plaguewright.js";
import { features as medicBioEngineerFeatures } from "../subclasses/medic-bio-engineer.js";

// --- Savant ---
import { savantClassFeatures } from "./savant.js";
import { features as savantBurningPassionFeatures } from "../subclasses/savant-burning-passion.js";
import { features as savantCausticSpiteFeatures } from "../subclasses/savant-caustic-spite.js";
import { features as savantColdIndifferenceFeatures } from "../subclasses/savant-cold-indifference.js";
import { features as savantFulminatingGleeFeatures } from "../subclasses/savant-fulminating-glee.js";
import { features as savantMindfulInsightFeatures } from "../subclasses/savant-mindful-insight.js";
import { features as savantNecroticManiaFeatures } from "../subclasses/savant-necrotic-mania.js";
import { features as savantRadiantSuperiorityFeatures } from "../subclasses/savant-radiant-superiority.js";
import { features as savantThunderingResolveFeatures } from "../subclasses/savant-thundering-resolve.js";
import { features as savantVenomousDualityFeatures } from "../subclasses/savant-venomous-duality.js";

export const items: FeatureItem[] = [
  // Fighter
  ...fighterFeatures,
  ...fighterStyles,
  ...marksmanStyles,
  ...savantStyles,
  ...barbarianStyles,
  ...bardStyles,
  ...brawlerStyles,
  // Haki
  ...hakiAbilities,
  ...championFeatures,
  ...battlemasterFeatures,
  ...bruteFeatures,
  ...gunslingerFeatures,
  ...samuraiFeatures,
  ...banneretFeatures,
  ...cavalierFeatures,
  ...gadgetKnightFeatures,
  ...masterOfNoneFeatures,
  ...armsDealerFeatures,
  ...blitzkriegFeatures,
  // Rogue
  ...rogueClassFeatures,
  ...rogueAssassinFeatures,
  ...rogueBruiserFeatures,
  ...rogueFencerFeatures,
  ...rogueGadgetTricksterFeatures,
  ...rogueInquisitiveFeatures,
  ...rogueRingmasterFeatures,
  ...rogueSawbonesFeatures,
  ...rogueScoutFeatures,
  ...rogueSeekerFeatures,
  ...rogueSwashbucklerFeatures,
  ...rogueThiefFeatures,
  ...rogueWildcardFeatures,
  // Barbarian
  ...barbarianClassFeatures,
  ...barbarianBerserkerFeatures,
  ...barbarianTotemWarriorFeatures,
  ...barbarianStormHeraldFeatures,
  ...barbarianBladeMasterFeatures,
  ...barbarianCannoneerFeatures,
  ...barbarianChannelerFeatures,
  ...barbarianShatteredMindFeatures,
  ...barbarianForgemasterFeatures,
  ...barbarianPugilistFeatures,
  ...barbarianSpiritSpeakerFeatures,
  // Bard
  ...bardClassFeatures,
  ...bardBewitchmentFeatures,
  ...bardLegendsFeatures,
  ...bardLoreFeatures,
  ...bardSwordsFeatures,
  ...bardIdolFeatures,
  ...bardEloquenceFeatures,
  // Brawler
  ...brawlerClassFeatures,
  ...brawlerOpenHandFeatures,
  ...brawlerDrunkenMasterFeatures,
  ...brawlerFishmanKarateFeatures,
  ...brawlerOkamaKenpoFeatures,
  ...brawlerPrivateEyeFeatures,
  ...brawlerNinjaFeatures,
  ...brawlerDaredevilFeatures,
  ...brawlerChromaticCommandmentFeatures,
  ...brawlerSumoWrestlerFeatures,
  ...brawlerSixPowersMasterFeatures,
  ...brawlerSwordSageFeatures,
  ...brawlerExpressionistFeatures,
  ...brawlerWayOfMercyFeatures,
  // Marksman
  ...marksmanClassFeatures,
  ...marksmanSniperFeatures,
  ...marksmanBeastmasterFeatures,
  ...marksmanBountyHunterFeatures,
  ...marksmanSwarmkeeperFeatures,
  ...marksmanNighthawkFeatures,
  ...marksmanGuruFeatures,
  ...marksmanOlympianFeatures,
  // Gadgeteer
  ...gadgeteerClassFeatures,
  ...gadgeteerAlchemistFeatures,
  ...gadgeteerArmorerFeatures,
  ...gadgeteerArtilleristFeatures,
  ...gadgeteerBattleSmithFeatures,
  ...gadgeteerElementalistFeatures,
  ...gadgeteerSafeguardFeatures,
  // Medic
  ...medicClassFeatures,
  ...medicFieldSurgeonFeatures,
  ...medicPhysicianFeatures,
  ...medicChemistFeatures,
  ...medicAmputatorFeatures,
  ...medicPlaguewrightFeatures,
  ...medicBioEngineerFeatures,
  // Savant
  ...savantClassFeatures,
  ...savantBurningPassionFeatures,
  ...savantCausticSpiteFeatures,
  ...savantColdIndifferenceFeatures,
  ...savantFulminatingGleeFeatures,
  ...savantMindfulInsightFeatures,
  ...savantNecroticManiaFeatures,
  ...savantRadiantSuperiorityFeatures,
  ...savantThunderingResolveFeatures,
  ...savantVenomousDualityFeatures,
  // Additional Powers (Chapter 7)
  ...additionalPowerFeatures,
];
export default items;
