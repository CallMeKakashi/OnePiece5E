import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";
import { backgroundEquipmentAdvancement } from "./equipment-grants.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function bg(id: string, name: string, desc: string): FoundryItem {
  const { advancement, startingBeri } = backgroundEquipmentAdvancement(id, desc);
  return {
    _id: generateId(`background/${id}`),
    name,
    type: "background",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      advancement,
    },
    effects: [],
    flags: { op5e: { startingBeri } },
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function charTable(title: string, rows: string[]): string {
  const headerRow = `<tr><th>d${rows.length}</th><th>${title}</th></tr>`;
  const body = rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r}</td></tr>`).join("\n");
  return `<table>\n<caption>${title}</caption>\n${headerRow}\n${body}\n</table>`;
}

export const backgrounds: FoundryItem[] = [
  // ─── Acrobat ───
  bg("acrobat", "Acrobat", `<p>Flying and flipping through the sky, your moves have long captivated all who bear witness to your performance as you complete seemingly impossible movements. An acrobat is typically a free spirit, as now even gravity is able to tether them for long, often always on the move.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Acrobatics, Athletics, Performance, Perception, Persuasion</p>
<p><strong>Tool Proficiencies:</strong> Disguise kit</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a set of colorful clothing, a disguise kit</p>
<h4>Feature: Entertaining Tumble</h4>
<p>Your dexterity and flexibility is nothing short of extraordinary. You gain your choice of the Acrobat Feat or the Graceful Dexterity Feat.</p>`),

  // ─── Archaeologist ───
  bg("archaeologist", "Archaeologist", `<p>An archaeologist learns about the long-lost and fallen cultures of the past by studying their remains&mdash;their bones, ruins, surviving masterworks, and tombs. Those who practice archaeology travel to the far corners of the world to root through crumbled cities and lost dungeons.</p>
<p><strong>Skill Proficiencies:</strong> 2 from History, Survival, Perception, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Cartographer's tools or Navigator's tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; 3 Small Medkits; Rations &times;5, a bullseye lantern, a miner's pick, traveler's clothes, a shovel, a two-person tent; Cartographer's or Navigator's tools</p>
<h4>Feature: Ancient Explorer</h4>
<p>Your experience in dig sites has given you a great insight into the history of the world. You gain your choice of the Historian Feat or the Rogue Adept Feat.</p>`),

  // ─── Artist ───
  bg("artist", "Artist", `<p>Artists are sought-after and respected individuals all over the world. For their talent to place life and emotion into things such as clay, stone, paint, and other media; artists are loved by all for their creations.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Sleight of Hand, History, and Performance</p>
<p><strong>Tool Proficiencies:</strong> Painter's Supplies</p>
<p><strong>Equipment:</strong> 100,000 Berries; 1 artwork you purchased somewhere; Painter's Supplies</p>
<h4>Feature: Visionary Painter</h4>
<p>Your reputation and the skills you have gained through your career as an artist inspire all. You gain your choice of the Master Painter Feat or the Adept Inspiration Feat.</p>`),

  // ─── Author ───
  bg("author", "Author", `<p>Most of the world's history and culture are inked into the pages of tomes. Those who write these tomes can influence the way people think and feel, how events are remembered, and how the future may be looked out. You are one of these people, a writer.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Performance, Persuasion, Deception, Engineering, Insight, and History</p>
<p><strong>Tool Proficiencies:</strong> Calligrapher's Supplies and one musical instrument of your choice</p>
<p><strong>Equipment:</strong> 150,000 Berries; 1 log book of your journey; 10 Rations; Calligrapher's Supplies</p>
<h4>Feature: Story Weaver</h4>
<p>You have written many tales to inform and astonish, allowing you to inspire the audience. You gain your choice of the Storyteller Feat or the Master Calligrapher Feat.</p>`),

  // ─── Blacksmith ───
  bg("blacksmith", "Blacksmith", `<p>As long as there are battles to be fought, you will no doubt find a blacksmith not too far. An expert at shaping steel, or any material into a refined, deadly weapon. Blacksmiths have dedicated most of their lives to their craft.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Sleight of Hand, History, Athletics, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Smith's Tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; 1 Small Medkit; 5 Rations; Smith's Tools</p>
<h4>Feature: Mastercrafter</h4>
<p>You gain the ability to improve any one weapon or armor using your advanced blacksmithing knowledge. You gain your choice of one of the following abilities:</p>
<ul>
<li>At the end of a long rest, you can touch one object which is a suit of armor or a simple or martial weapon. Until the end of your next long rest or until you use this feature on another object, the object becomes a mastercraft item, granting a +1 bonus to AC if it's armor or a +1 bonus to attack and damage rolls if it's a weapon. If the item has a +1-3 bonus already on it, you add your +1 bonus on top of it (to a maximum of +3). Once you use this feature, you can't use it again until you finish a long rest.</li>
<li>You gain the Master Smith Feat.</li>
</ul>`),

  // ─── Bounty Hunter ───
  bg("bounty-hunter", "Bounty Hunter", `<p>There are many groups and organizations out there in the blues. Often mistaken for simple travelers, Bounty Hunters make their living hunting down those who have built up a bad reputation, their main motivation is to hunt down that sweet bounty of berries.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Intimidation, Perception, Insight, and Survival</p>
<p><strong>Tool Proficiencies:</strong> Thieves' Tools</p>
<p><strong>Equipment:</strong> 100,000 Berries; 3 Small Medkits; 5 Rations, Thieves' Tools</p>
<h4>Feature: Skilled Hunter</h4>
<p>Your many years of hunting down wanted men have given you an insight into the many clues and trails people leave behind. You gain your choice of the Knack of the Hunter Feat or the Fighting Initiate Feat.</p>`),

  // ─── Boxer ───
  bg("boxer", "Boxer", `<p>You are a pugilist, a master of hand-to-hand combat who has honed your skills in the ring via constant fights. Whether you fight for glory, gold, or simply the thrill, your fists are your most deadly weapons.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Acrobatics, Intimidation, Insight</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a set of boxing gloves, and a trophy from a past victory</p>
<h4>Feature: Knockout!</h4>
<p>You gain your choice of the Unarmed Master Feat or the Spirit Adept Feat.</p>`),

  // ─── Carpenter ───
  bg("carpenter", "Carpenter", `<p>You were a skilled craftsman, experienced in the shaping and building of wooden structures. Carpentry is a well respected and honest trade, and carpenters take pride in their craft.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Acrobatics, Survival, History</p>
<p><strong>Tool Proficiencies:</strong> Woodcarver's and Carpenter's tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, your choice of Woodcarver's or Carpenter's Tools, a wooden trinket, several blueprints</p>
<h4>Feature: Wood Artisan</h4>
<p>You know how to work with wood. You gain your choice of the Master Carpenter Feat or the Master Woodcarver Feat.</p>`),

  // ─── Cook ───
  bg("cook", "Cook", `<p>You once were a chef, the king of food. Either you were an artisan chef with a fine sense of taste, a master chef who knows dozens of recipes by heart, or a cook at the mess hall. You understand that food has a voice; it can express moods and bring people together.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Insight, Performance, and Sleight of Hand</p>
<p><strong>Tool Proficiencies:</strong> Cook's Utensils</p>
<p><strong>Equipment:</strong> 100,000 Berries; Mess kit; 15 Rations; a recipe book; Cook's Utensils</p>
<h4>Feature: Culinary Expert</h4>
<p>Your mastery of culinary art has granted you the ability to cook special meals for yourself and your crew. You gain your choice of the Gourmand Feat or the Master Brewer Feat.</p>`),

  // ─── Detective ───
  bg("detective", "Detective", `<p>You relentlessly seek the truth. Perhaps you're motivated by the belief in the law and a sense of universal justice, or maybe that very law has failed you and you seek to make things right.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Sleight of Hand, Investigation, Insight, and Perception</p>
<p><strong>Tool Proficiencies:</strong> Forgery Kit or Disguise Kit</p>
<p><strong>Equipment:</strong> 150,000 Berries; magnifying glass; 5 Rations; Forgery or Disguise Kit</p>
<h4>Feature: Astute Observation</h4>
<p>Your years of experience have allowed you to keep track of even the most minute details. You gain your choice of the Investigator Feat or the Keen Mind Feat.</p>`),

  // ─── Doctor (Background) ───
  bg("doctor", "Doctor", `<p>As the world is full of deadly diseases, there are doctors ready to combat such ailments. Doctors also perform invasive procedures to save lives, like conducting surgeries or helping induce birth.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Medicine, Investigation, Nature</p>
<p><strong>Tool Proficiencies:</strong> Herbalism Kit</p>
<p><strong>Equipment:</strong> 50,000 Berries; Small Medkits &times;5; Rations &times;10; Healer's Kit</p>
<h4>Feature: Medical Master</h4>
<p>You have mastered the art of medicine. You gain your choice of the First Aid Feat or the Master Alchemist Feat.</p>`),

  // ─── Drunkard ───
  bg("drunkard", "Drunkard", `<p>You are known throughout the land for your uncanny ability to consume alcohol and still maintain a certain level of coherence. Whether you're a tavern regular or a wandering imbiber, your reputation precedes you.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Persuasion, Performance, and Intimidation</p>
<p><strong>Tool Proficiencies:</strong> Brewer's Supplies</p>
<p><strong>Equipment:</strong> 150,000 Berries; a flask of strong alcohol; Brewer's Supplies; 5 empty glass bottles</p>
<h4>Feature: Big Drinker</h4>
<p>You are familiar with the rough and tumble nature of taverns and bars. You gain your choice of the Tavern Brawler Feat or the Drunkard Feat.</p>`),

  // ─── Entertainer ───
  bg("entertainer", "Entertainer", `<p>You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir hearts, your music raises spirits, and your dance steps captivate.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Acrobatics, Performance, and Sleight of Hand</p>
<p><strong>Tool Proficiencies:</strong> Disguise Kit or Gaming Set</p>
<p><strong>Equipment:</strong> 150,000 Berries; Disguise Kit or Gaming Set; 1 Medkit; Rations &times;5</p>
<h4>Feature: Lead Performer</h4>
<p>You always know how to captivate the audience, stealing the show. You gain your choice of the Performer Feat or the Musician Feat.</p>`),

  // ─── Faceless ───
  bg("faceless", "Faceless", `<p>Being who you are, you could never be a hero. Whether due to your class, your people, your family, or your sins, something about you prevents you from effectively pursuing the path you've chosen. You've left your old face behind, taking on a new persona.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Deception, Intimidation, Persuasion, Performance</p>
<p><strong>Tool Proficiencies:</strong> Disguise Kit</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;3; Rations &times;5, Disguise Kit, and a costume</p>
<h4>Feature: Stay Away</h4>
<p>Your years of hiding your true identity and nature have granted you the ability to always keep yourself away. You gain your choice of the Rogue Adept Feat or the Master of Disguise Feat.</p>`),

  // ─── Farmer ───
  bg("farmer", "Farmer", `<p>You were what most common folk are&mdash;a farmer. You produced resources from the land in return for food, shelter, clothing, and protection. Farmers are hearty, enduring folk who work long hours under the sun.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Animal Handling, Nature, Persuasion, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Herbalism Kit</p>
<p><strong>Equipment:</strong> 50,000 Berries; Shovel; Rations &times;10; 1 Small Medkit; Herbalism Kit</p>
<h4>Feature: Down On The Farm</h4>
<p>You have ample practice in treating animals and crops. You gain your choice of the Critter Friend Feat or the Naturalist Feat.</p>`),

  // ─── Fisherman ───
  bg("fisherman", "Fisherman", `<p>You have spent your life aboard fishing vessels or combing the shallows for the bounty of the ocean. You soon fell in love with the sea, the art of fishing, and the promise of the eternal horizon.</p>
<p><strong>Skill Proficiencies:</strong> 2 from History, Nature, Survival, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Fishing Tackle</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;1; Rations &times;5, Fishing tackle, and a net</p>
<h4>Feature: Harvest the Water</h4>
<p>You are an expert of hunting down and capturing fish. You gain your choice of the Master Fisherman Feat or the Spear Mastery Feat.</p>`),

  // ─── Folk Hero ───
  bg("folk-hero", "Folk Hero", `<p>You come from a humble social rank, but you are destined for so much more. Already the people of your home island regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Animal Handling, Survival, Persuasion, Nature</p>
<p><strong>Tool Proficiencies:</strong> One type of Artisan's Tools, Vehicles (land)</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;3; Rations &times;5, Artisan's tools (one of your choice), a shovel, an iron pot</p>
<h4>Feature: Inner Strength</h4>
<p>For the sake of the common folk and your destiny, you call upon your physical fortitude. You gain your choice of the Unmatched Strength Feat or the Underdog Feat.</p>`),

  // ─── Gambler ───
  bg("gambler", "Gambler", `<p>All you need to make a lot of gold is a little gold. Whether you're a good gambler or a bad one rarely matters, because no one can divine the whims of Lady Luck. Sometimes you're up, sometimes you're down.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Deception, Insight, Perception, and Persuasion</p>
<p><strong>Tool Proficiencies:</strong> Gaming set</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;1; Rations &times;5, one gaming set, a lucky charm</p>
<h4>Feature: Gambler's Fallacy</h4>
<p>When you are down on your luck, and the odds are against you, you manage to pull through with random chance. You gain your choice of the Lucky Feat or the Master of Games Feat.</p>`),

  // ─── Gladiator ───
  bg("gladiator", "Gladiator", `<p>You're a gladiator of the colosseum; you were very likely captured, enslaved, and forced to compete in death matches. Your fighting style made you a successful gladiator or was at least good enough to keep you alive.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Intimidation, Survival, and Acrobatics</p>
<p><strong>Equipment:</strong> 50,000 Berries; Small Medkits &times;3; Rations &times;5</p>
<h4>Feature: Experienced Brawler</h4>
<p>Life for you is nothing but a series of endless battles. You gain your choice of the Charger Feat or the Menacing Feat.</p>`),

  // ─── Glutton ───
  bg("glutton", "Glutton", `<p>You have an insatiable appetite for all things delicious and decadent. Your passion for indulgence has shaped your life, always looking to experience a myriad of flavors.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Persuasion, Athletics, Perception, Survival</p>
<p><strong>Tool Proficiencies:</strong> Cook's Utensils</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, Cook's utensils, a catalog of various recipes</p>
<h4>Feature: Big Appetite</h4>
<p>You can eat a lot of food. You gain your choice of the Voracity Feat or the Resilient Constitution Feat.</p>`),

  // ─── Hermit ───
  bg("hermit", "Hermit", `<p>You lived in seclusion&mdash;either in a sheltered community such as a monastery, or entirely alone&mdash;for a formative part of your life. In your time apart from society, you found quiet, solitude, and perhaps some answers.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Medicine, Religion, Nature, Survival</p>
<p><strong>Tool Proficiencies:</strong> Herbalism kit</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;2; Rations &times;5, Herbalism kit, a notebook full of notes</p>
<h4>Feature: Secluded Study</h4>
<p>While living in seclusion, you have practiced extensively a specific set of skills. You gain your choice of the Skill Expert Feat or the Sound Intelligence Feat.</p>`),

  // ─── Jeweler ───
  bg("jeweler", "Jeweler", `<p>You hail from a prestigious lineage of accomplished jewelers, artisans, and gemcrafters. Your mastery of precious metals and stones distinguishes you.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Investigation, Perception, Sleight of Hand, Deception</p>
<p><strong>Tool Proficiencies:</strong> Jeweler's tools and Glassblower's Tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, Jeweler's kit and Glassblowing tools, a magnifying glass, jewelry worth 150,000 Berries</p>
<h4>Feature: Crystal Crafter</h4>
<p>You know how to work with gems and glass. You gain your choice of the Master Glassblower Feat or the Master Jeweler Feat.</p>`),

  // ─── Knight ───
  bg("knight", "Knight", `<p>You belong to an order of knights who have sworn oaths to achieve a certain goal. The <em>One Piece</em> world has a wide variety of knightly orders, all with a similar outlook concerning their actions and responsibilities.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Persuasion, Athletics, Religion, History</p>
<p><strong>Tool Proficiencies:</strong> 1 set of Artisan's tools of your choice</p>
<p><strong>Equipment:</strong> 200,000 Berries; Small Medkits &times;3; Rations &times;5, Artisan's tools, a seal denoting your rank, a banner denoting your faction</p>
<h4>Feature: Knightly Training</h4>
<p>As a knight, you have mastered using heavy armor for the ultimate defense. You gain your choice of the Heavy Armor Master Feat or the Shield Master Feat.</p>`),

  // ─── Leatherworker ───
  bg("leatherworker", "Leatherworker", `<p>Leather is a hard, yet flexible material, and you are no different than the material you work with. As a Leatherworker, you've honed your skills in crafting and manipulating leather to create a variety of functional and decorative items.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Sleight of Hand, Survival, Nature, Athletics</p>
<p><strong>Tool Proficiencies:</strong> Leatherworker's Tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a bundle of freshly made leather, a skinning knife</p>
<h4>Feature: Skinning and Tanning</h4>
<p>You are an expert of extracting skins from beasts and forming high quality leather. You gain your choice of the Master Leatherworker Feat or the Slasher Feat.</p>`),

  // ─── Librarian ───
  bg("librarian", "Librarian", `<p>You spent years learning the lore of the world and its vast oceans. You scoured manuscripts, studied scrolls, and listened to the greatest experts. Your efforts have made you a master in your fields of study.</p>
<p><strong>Skill Proficiencies:</strong> 3 from History, Arcana, Insight, Religion, Nature, and Persuasion</p>
<p><strong>Tool Proficiencies:</strong> Calligrapher's Supplies or Forgery Kit</p>
<p><strong>Equipment:</strong> 50,000 Berries; Rations &times;5; 1 Devil Fruit Encyclopedia; Calligrapher's Supplies or Forgery Kit</p>
<h4>Feature: Well Read</h4>
<p>You have a vast swath of knowledge due to being around so many books your whole life. You gain your choice of the Skilled Feat or the Practiced Wisdom Feat.</p>`),

  // ─── Lumberjack ───
  bg("lumberjack", "Lumberjack", `<p>Woodcutter, Lumberjack, Woodsman&mdash;whatever title they go by the profession is the same; to cut and chop wood. They live among the trees and forest critters, learning the best ways to do what they love.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Nature, Survival, and Intimidation</p>
<p><strong>Weapon Proficiencies:</strong> Battleaxes, Handaxes, Greataxes</p>
<p><strong>Equipment:</strong> 50,000 Berries; 1 handaxe; 5 Rations; 1 Medkit</p>
<h4>Feature: Tree Feller</h4>
<p>You are an expert at finding the weak points in any wooden surface. You gain your choice of the Axe Mastery Feat or the Savage Attacker Feat.</p>`),

  // ─── Marine/Soldier ───
  bg("marine-soldier", "Marine/Soldier", `<p>War has been your life for as long as you care to remember. You might have been part of a standing national army, a mercenary company, or perhaps a member of the Navy under the World Government, sailing the seas to combat pirates.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Persuasion, Perception, Engineering, Acrobatics</p>
<p><strong>Tool Proficiencies:</strong> Water Vehicles</p>
<p><strong>Equipment:</strong> 100,000 Berries; 2 Medkits; Rations &times;5; Leather Armor/Navy Uniform</p>
<h4>Feature: Military Training</h4>
<p>You gain your choice of the Light Armor Master or Medium Armor Master feat.</p>`),

  // ─── Mason ───
  bg("mason", "Mason", `<p>You are a skilled artisan, a master in the craft of stonemasonry. Your expertise lies in shaping and crafting stone to create enduring structures.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, History, Sleight of Hand, Persuasion</p>
<p><strong>Tool Proficiencies:</strong> Mason's tools and Potter's Tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, Mason's or Potter's tools, a hammer and chisel</p>
<h4>Feature: Stonemaster</h4>
<p>You know how to work with stone and clay. You gain your choice of the Master Mason Feat or the Master Potter Feat.</p>`),

  // ─── Mercenary ───
  bg("mercenary", "Mercenary", `<p>As a mercenary, your services were for hire to anyone who could afford them. You are a soldier of fortune, fighting for coin.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Intimidation, Perception, Survival, and Nature</p>
<p><strong>Tool Proficiencies:</strong> Gaming Set</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;3; Rations &times;10; Gaming Set</p>
<h4>Feature: Battle Born</h4>
<p>Throughout your many battles, you have developed a certain fighting style that you excel in. You gain your choice of the Martial Adept Feat or the Fighting Initiate Feat.</p>`),

  // ─── Merchant ───
  bg("merchant", "Merchant", `<p>You have spent your life among traders, merchants, and the mercantile exchange of goods. You've become attached to the profession.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Investigation, Persuasion, Insight, and Deception</p>
<p><strong>Tool Proficiencies:</strong> 1 Artisan Tool of your choice</p>
<p><strong>Equipment:</strong> 200,000 Berries; 1 Small Medkit; 1 Artisan Tool of your choice; 10 Rations</p>
<h4>Feature: Hornswoggling</h4>
<p>You are a master at negotiating for a better price. You gain your choice of the Silver Tongue Feat or the Diplomat Feat.</p>`),

  // ─── Miner ───
  bg("miner", "Miner", `<p>Mining is dirty and dangerous, but it's a job that must be done. You are one of these workers, breaking rocks in search of Mother Earth's greatest treasures deep down in dank quarries.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Investigation, Intimidation, Perception, and Survival</p>
<p><strong>Tool Proficiencies:</strong> Mason's Tools</p>
<p><strong>Weapon Proficiencies:</strong> War picks</p>
<p><strong>Equipment:</strong> 100,000 Berries; Bandages &times;3; Rations &times;5; Pickaxe; Mason's Tools</p>
<h4>Feature: Cave Eyes</h4>
<p>Your experience deep down in the caves has made you more used to dark environments. You gain your choice of the Perceptive Feat or the Warpick Master Feat.</p>`),

  // ─── Navigator (Background) ───
  bg("navigator", "Navigator", `<p>You guided sea vessels for many years, studying the way of weather and waves. Your keen senses have granted you one of the most sought skills in the world.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Perception, Investigation, Survival, and Nature</p>
<p><strong>Tool Proficiencies:</strong> Cartographer's Tools or Navigator's Tools, Water Vehicles</p>
<p><strong>Equipment:</strong> A map of the surrounding area within 100 nautical miles; Rations &times;10; Cartographer's or Navigator's tools</p>
<h4>Feature: Keen Eye</h4>
<p>Your training has given you a keen eye for even the slightest of changes. You gain your choice of the Observant Feat or the Master Navigator Feat.</p>`),

  // ─── Noble ───
  bg("noble", "Noble", `<p>You understand wealth, power, and privilege. You carry a noble title, and your family owns the land, collects taxes, and wields significant political influence.</p>
<p><strong>Skill Proficiencies:</strong> 2 from History, Persuasion, Deception, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Gaming Set</p>
<p><strong>Equipment:</strong> 250,000 Berries; Small Medkits &times;1; Rations &times;10; a scroll of pedigree; Gaming Set</p>
<h4>Feature: Noble's Charm</h4>
<p>Your status combined with your experience in many events has made you able to seamlessly merge or manipulate socially. You gain your choice of the Diplomat Feat or the Silver Tongue Feat.</p>`),

  // ─── Pirate ───
  bg("pirate", "Pirate", `<p>You spent your youth under the sway of a dread pirate, a ruthless cutthroat who taught you how to survive in a world of sharks and savages. You've indulged in larceny on the high seas and sent more than one deserving soul to a briny grave.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Intimidation, Perception, and Deception</p>
<p><strong>Tool Proficiencies:</strong> Water Vehicles</p>
<p><strong>Equipment:</strong> 100,000 Berries; 2 Small Medkits; Rations &times;10</p>
<h4>Feature: Never Ending Battles</h4>
<p>Your life has been on dangerous waters, making you always prepared for the worst. You gain your choice of the Alert Feat or the Free Diver Feat.</p>`),

  // ─── Priest ───
  bg("priest", "Priest", `<p>You have spent your life in the service of a temple. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Insight, Religion, Persuasion, and History</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a prayer book, 5 sticks of incense, and vestments</p>
<h4>Feature: Knowledge of Faith</h4>
<p>Your faith and training as a priest have given you a greater understanding of religion. You gain your choice of the Religious Feat or the Insightful Feat.</p>`),

  // ─── Revolutionary ───
  bg("revolutionary", "Revolutionary", `<p>You are or were a rebel, a person who wants to destroy the government. You quickly learned battle, survival, and leadership skills in the riots and battles of your unstable homeland.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Survival, Insight, Persuasion, and History</p>
<p><strong>Tool Proficiencies:</strong> Disguise Kit or Thieves' Tools</p>
<p><strong>Equipment:</strong> 50,000 Berries; Hempen Rope 50ft; Rations &times;5; a symbol of your revolution; Disguise or Thieves' Tools</p>
<h4>Feature: Lead The Charge</h4>
<p>Your neverending crusade has taught you how to get people riled up and ready to charge. You gain your choice of the Inspiring Leader Feat or the Unyielding Charisma Feat.</p>`),

  // ─── Sailor ───
  bg("sailor", "Sailor", `<p>You sailed on a seagoing vessel for years. In that time, you faced mighty storms, monsters of the deep, and those who wanted to sink your craft. Your first love is the distant line of the horizon.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Perception, Nature, and Insight</p>
<p><strong>Tool Proficiencies:</strong> Water Vehicles</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;2; Rations &times;5; Hempen Rope 50ft</p>
<h4>Feature: Sea Man</h4>
<p>Your life on ports and boats has made you accustomed to the very waters that swallow the world. You gain your choice of the Observant Feat or the Free Diver Feat.</p>`),

  // ─── Scientist ───
  bg("scientist", "Scientist", `<p>You live to unravel the mysteries of the world and use those secrets to revolutionize your field of study. Be it mechanical mastery or medical miracles, your ingenuity knows no bounds.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Engineering, Medicine, History, Investigation</p>
<p><strong>Tool Proficiencies:</strong> Your choice of 2 tool kits</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;2; Rations &times;5, 2 tool kits of your choice, a binder full of notes</p>
<h4>Feature: Incredible Ingenuity</h4>
<p>Your well of scientific knowledge has born fruit in the form of personal creations. You gain your choice of the Creativity Adept Feat or the Customized Creativity Adept Feat.</p>`),

  // ─── Shipwright (Background) ───
  bg("shipwright-bg", "Shipwright", `<p>You have sailed into war on the decks of great ships, patching their hulls with soup bowls and prayers. Since childhood, you have loved the water and have been captivated by the many vessels that travel on it.</p>
<p><strong>Skill Proficiencies:</strong> 3 from Perception, Persuasion, Intimidation, Investigation, and Deception</p>
<p><strong>Tool Proficiencies:</strong> Carpenter's Tools, Water Vehicles</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkit; Rations &times;5; A blank Book and Pen; Carpenter's Tools</p>
<h4>Feature: Ship Savant</h4>
<p>You are a master at piloting and building ships. You gain your choice of the Vehicle Master Feat or the Brawny Feat.</p>`),

  // ─── Slave ───
  bg("slave", "Slave", `<p>For some significant portion of your life, you have been someone else's property. How did you become a slave? Are you a slave or a freeman? What were the conditions of your slavery?</p>
<p><strong>Skill Proficiencies:</strong> 2 from Performance, Survival, Insight, and Stealth</p>
<p><strong>Tool Proficiencies:</strong> 1 tool of your choosing</p>
<p><strong>Equipment:</strong> 1,000 Berries; Small Medkit; Rations &times;2; 1 tool of your choosing</p>
<h4>Feature: Tough Customer</h4>
<p>Your years of manual labor and sacrifice have granted you an unbelievable amount of endurance. You gain your choice of the Tough Feat or the Durable Feat.</p>`),

  // ─── Smuggler ───
  bg("smuggler", "Smuggler", `<p>On a rickety barge, you carried a hundred longswords in fish barrels right past the dock master's oblivious lackeys. In your more charitable times, you have transported innocents out of war zones.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Acrobatics, Deception, Sleight of Hand</p>
<p><strong>Tool Proficiencies:</strong> Vehicles (water)</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a fancy leather vest, leather boots</p>
<h4>Feature: Adept Theft</h4>
<p>Your experience in smuggling illicit goods has made you a master of sleight of hand. You gain your choice of the Quick Fingers Feat or the Master Appraiser Feat.</p>`),

  // ─── Sniper ───
  bg("sniper", "Sniper", `<p>You wield a weapon designed to strike your foes from a safe distance. Preparation from threats is key. Your deft eyes enable you to seek something.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Acrobatics, Stealth, Survival, Perception</p>
<p><strong>Weapon Proficiencies:</strong> 2 simple or martial ranged weapons of your choice</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a telescope, a trinket related to your backstory</p>
<h4>Feature: Master Sniper</h4>
<p>Each sniper is specialized, mastering a single weapon to deadly perfection. You gain your choice of a weapon mastery feat with a simple or martial ranged weapon.</p>`),

  // ─── Swordsman ───
  bg("swordsman", "Swordsman", `<p>For years, you have studied the blade. Where most simply wield a sword in combat, you wield your blade as an artist, ready to make your mark on the world.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Acrobatics, History, Perception</p>
<p><strong>Weapon Proficiencies:</strong> 2 simple or martial melee weapons (piercing or slashing)</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a whetstone, a memento from a person from your past</p>
<h4>Feature: Blade Mastery</h4>
<p>As each swordsman is unique, so is their blade. You gain your choice of a weapon mastery feat with a simple or martial melee weapon that deals piercing or slashing damage.</p>`),

  // ─── Tailor ───
  bg("tailor", "Tailor", `<p>You are a master of the delicate art of fashion and clothcraft. Whether creating garments for nobles or designing practical attire for adventurers, your skill with needle and thread is unmatched.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Insight, Perception, Sleight of Hand, Persuasion</p>
<p><strong>Tool Proficiencies:</strong> Weaver's tools and Cobbler's Tools</p>
<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, Weaver's kit and Cobbler's tools, 3 sets of fine clothes and leather shoes</p>
<h4>Feature: Clothing Savant</h4>
<p>You know how to work with clothing and shoes. You gain your choice of the Master Weaver Feat or the Master Cobbler Feat.</p>`),

  // ─── Urchin ───
  bg("urchin", "Urchin", `<p>You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or provide for you, so you learned to provide for yourself. You've survived despite all odds.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Sleight of Hand, Stealth, Acrobatics, Athletics</p>
<p><strong>Tool Proficiencies:</strong> Disguise kit, Thieves' tools</p>
<p><strong>Equipment:</strong> 100,000 Berries; Small Medkits &times;1; Rations &times;5, Disguise kit, Thieves' tools, 1 Dagger</p>
<h4>Feature: Sneaky Devil</h4>
<p>Living on the streets has granted you insight into how to hide even in the most unlikely locations. You gain your choice of the Skulker Feat or the Silver Tongue Feat.</p>`),

  // ─── Wanderer ───
  bg("wanderer", "Wanderer", `<p>You are from a distant place, one so remote that few realize it exists. You have come to this part of the world for your own reasons.</p>
<p><strong>Skill Proficiencies:</strong> 2 from Intimidation, Perception, Insight, and Survival</p>
<p><strong>Tool Proficiencies:</strong> Gaming Set</p>
<p><strong>Equipment:</strong> 50,000 Berries; Small Medkits &times;3; Rations &times;5; Gaming Set</p>
<h4>Feature: Acquired Trait</h4>
<p>Having wandered from the far corners of the world, you have picked up a unique skill. You gain a feat of your choice.</p>`),
];
