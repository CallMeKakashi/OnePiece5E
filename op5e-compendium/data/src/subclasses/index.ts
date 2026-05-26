import type { SubclassItem } from "../../schemas/subclass.js";

// --- Fighter subclasses (named exports) ---
import { champion } from "./fighter-champion.js";
import { battlemaster } from "./fighter-battlemaster.js";
import { brute } from "./fighter-brute.js";
import { gunslinger } from "./fighter-gunslinger.js";
import { samurai } from "./fighter-samurai.js";
import { banneret } from "./fighter-banneret.js";
import { cavalier } from "./fighter-cavalier.js";
import { gadgetKnight } from "./fighter-gadget-knight.js";
import { masterOfNone } from "./fighter-master-of-none.js";
import { armsDealer } from "./fighter-arms-dealer.js";
import { blitzkrieg } from "./fighter-blitzkrieg.js";

// --- Rogue subclasses ---
import { subclass as rogueAssassin } from "./rogue-assassin.js";
import { subclass as rogueBruiser } from "./rogue-bruiser.js";
import { subclass as rogueFencer } from "./rogue-fencer.js";
import { subclass as rogueGadgetTrickster } from "./rogue-gadget-trickster.js";
import { subclass as rogueInquisitive } from "./rogue-inquisitive.js";
import { subclass as rogueRingmaster } from "./rogue-ringmaster.js";
import { subclass as rogueSawbones } from "./rogue-sawbones.js";
import { subclass as rogueScout } from "./rogue-scout.js";
import { subclass as rogueSeeker } from "./rogue-seeker.js";
import { subclass as rogueSwashbuckler } from "./rogue-swashbuckler.js";
import { subclass as rogueThief } from "./rogue-thief.js";
import { subclass as rogueWildcard } from "./rogue-wildcard.js";

// --- Barbarian subclasses ---
import { subclass as barbarianBerserker } from "./barbarian-berserker.js";
import { subclass as barbarianTotemWarrior } from "./barbarian-totem-warrior.js";
import { subclass as barbarianStormHerald } from "./barbarian-storm-herald.js";
import { subclass as barbarianBladeMaster } from "./barbarian-blade-master.js";
import { subclass as barbarianCannoneer } from "./barbarian-cannoneer.js";
import { subclass as barbarianChanneler } from "./barbarian-channeler.js";
import { subclass as barbarianShatteredMind } from "./barbarian-shattered-mind.js";
import { subclass as barbarianForgemaster } from "./barbarian-forgemaster.js";
import { subclass as barbarianPugilist } from "./barbarian-pugilist.js";
import { subclass as barbarianSpiritSpeaker } from "./barbarian-spirit-speaker.js";

// --- Bard subclasses ---
import { subclass as bardBewitchment } from "./bard-bewitchment.js";
import { subclass as bardLegends } from "./bard-legends.js";
import { subclass as bardLore } from "./bard-lore.js";
import { subclass as bardSwords } from "./bard-swords.js";
import { subclass as bardIdol } from "./bard-idol.js";
import { subclass as bardEloquence } from "./bard-eloquence.js";

// --- Brawler subclasses ---
import { subclass as brawlerOpenHand } from "./brawler-open-hand.js";
import { subclass as brawlerDrunkenMaster } from "./brawler-drunken-master.js";
import { subclass as brawlerFishmanKarate } from "./brawler-fishman-karate.js";
import { subclass as brawlerOkamaKenpo } from "./brawler-okama-kenpo.js";
import { subclass as brawlerPrivateEye } from "./brawler-private-eye.js";
import { subclass as brawlerNinja } from "./brawler-ninja.js";
import { subclass as brawlerDaredevil } from "./brawler-daredevil.js";
import { subclass as brawlerChromaticCommandment } from "./brawler-chromatic-commandment.js";
import { subclass as brawlerSumoWrestler } from "./brawler-sumo-wrestler.js";
import { subclass as brawlerSixPowersMaster } from "./brawler-six-powers-master.js";
import { subclass as brawlerSwordSage } from "./brawler-sword-sage.js";
import { subclass as brawlerExpressionist } from "./brawler-expressionist.js";
import { subclass as brawlerWayOfMercy } from "./brawler-way-of-mercy.js";

// --- Marksman subclasses ---
import { subclass as marksmanSniper } from "./marksman-sniper.js";
import { subclass as marksmanBeastmaster } from "./marksman-beastmaster.js";
import { subclass as marksmanBountyHunter } from "./marksman-bounty-hunter.js";
import { subclass as marksmanSwarmkeeper } from "./marksman-swarmkeeper.js";
import { subclass as marksmanNighthawk } from "./marksman-nighthawk.js";
import { subclass as marksmanGuru } from "./marksman-guru.js";
import { subclass as marksmanOlympian } from "./marksman-olympian.js";

// --- Gadgeteer subclasses ---
import { subclass as gadgeteerAlchemist } from "./gadgeteer-alchemist.js";
import { subclass as gadgeteerArmorer } from "./gadgeteer-armorer.js";
import { subclass as gadgeteerArtillerist } from "./gadgeteer-artillerist.js";
import { subclass as gadgeteerBattleSmith } from "./gadgeteer-battle-smith.js";
import { subclass as gadgeteerElementalist } from "./gadgeteer-elementalist.js";
import { subclass as gadgeteerSafeguard } from "./gadgeteer-safeguard.js";

// --- Medic subclasses ---
import { subclass as medicFieldSurgeon } from "./medic-field-surgeon.js";
import { subclass as medicPhysician } from "./medic-physician.js";
import { subclass as medicChemist } from "./medic-chemist.js";
import { subclass as medicAmputator } from "./medic-amputator.js";
import { subclass as medicPlaguewright } from "./medic-plaguewright.js";
import { subclass as medicBioEngineer } from "./medic-bio-engineer.js";

// --- Savant subclasses ---
import { subclass as savantBurningPassion } from "./savant-burning-passion.js";
import { subclass as savantCausticSpite } from "./savant-caustic-spite.js";
import { subclass as savantColdIndifference } from "./savant-cold-indifference.js";
import { subclass as savantFulminatingGlee } from "./savant-fulminating-glee.js";
import { subclass as savantMindfulInsight } from "./savant-mindful-insight.js";
import { subclass as savantNecroticMania } from "./savant-necrotic-mania.js";
import { subclass as savantRadiantSuperiority } from "./savant-radiant-superiority.js";
import { subclass as savantThunderingResolve } from "./savant-thundering-resolve.js";
import { subclass as savantVenomousDuality } from "./savant-venomous-duality.js";

export const items: SubclassItem[] = [
  // Fighter
  champion, battlemaster, brute, gunslinger, samurai,
  banneret, cavalier, gadgetKnight, masterOfNone, armsDealer, blitzkrieg,
  // Rogue
  rogueAssassin, rogueBruiser, rogueFencer, rogueGadgetTrickster,
  rogueInquisitive, rogueRingmaster, rogueSawbones, rogueScout,
  rogueSeeker, rogueSwashbuckler, rogueThief, rogueWildcard,
  // Barbarian
  barbarianBerserker, barbarianTotemWarrior, barbarianStormHerald,
  barbarianBladeMaster, barbarianCannoneer, barbarianChanneler,
  barbarianShatteredMind, barbarianForgemaster, barbarianPugilist,
  barbarianSpiritSpeaker,
  // Bard
  bardBewitchment, bardLegends, bardLore, bardSwords, bardIdol, bardEloquence,
  // Brawler
  brawlerOpenHand, brawlerDrunkenMaster, brawlerFishmanKarate,
  brawlerOkamaKenpo, brawlerPrivateEye, brawlerNinja, brawlerDaredevil,
  brawlerChromaticCommandment, brawlerSumoWrestler, brawlerSixPowersMaster,
  brawlerSwordSage, brawlerExpressionist, brawlerWayOfMercy,
  // Marksman
  marksmanSniper, marksmanBeastmaster, marksmanBountyHunter,
  marksmanSwarmkeeper, marksmanNighthawk, marksmanGuru, marksmanOlympian,
  // Gadgeteer
  gadgeteerAlchemist, gadgeteerArmorer, gadgeteerArtillerist,
  gadgeteerBattleSmith, gadgeteerElementalist, gadgeteerSafeguard,
  // Medic
  medicFieldSurgeon, medicPhysician, medicChemist,
  medicAmputator, medicPlaguewright, medicBioEngineer,
  // Savant
  savantBurningPassion, savantCausticSpite, savantColdIndifference,
  savantFulminatingGlee, savantMindfulInsight, savantNecroticMania,
  savantRadiantSuperiority, savantThunderingResolve, savantVenomousDuality,
];
export default items;
