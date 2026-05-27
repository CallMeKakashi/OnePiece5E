import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";
import { roleEquipmentAdvancement } from "./equipment-grants.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function role(id: string, name: string, desc: string): FoundryItem {
  const { advancement, startingBeri } = roleEquipmentAdvancement(id);
  return {
    _id: generateId(`role/${id}`),
    name: `Role: ${name}`,
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

export const roles: FoundryItem[] = [
  // ─── Captain ───
  role("captain", "Captain", `<p>Perhaps the most important role to fill on a ship is the captain. As a captain, you set the course of the ship and spearhead your crew into the adventure ahead. Your most valuable power isn't your strength in combat, but rather your ability to inspire and lead others.</p>
<p><strong>Skill Proficiencies:</strong> Persuasion, choose two from Acrobatics, Animal Handling, Athletics, Insight, Intimidation</p>
<p><strong>Tool Proficiencies:</strong> One set of tools of your choice</p>
<p><strong>Equipment:</strong> Common clothes, a pirate flag featuring your jolly roger, a spyglass, and a pouch containing 100,000 beri</p>
<h4>Feature: Force of Personality</h4>
<p>You have an unmistakable presence that is felt by all around you. People and creatures you meet are more likely to be amenable and forthcoming. When you make a Charisma (Persuasion) check, the check cannot have disadvantage, nor be reduced in any way.</p>
<p>You have the potential to unlock the mythical power of Conqueror's Haki and can be awarded Conqueror's Haki when you reach certain character levels.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Alert, Brave, Brawny, Inspiring Leader, Joyful, Tough.</p>
<h4>Dream</h4>
<p>A captain's dream is extremely important for the crew. Choose a dream from the table below or create your own with the help of your DM.</p>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>I want to be the king/queen of the pirates.</td></tr>
<tr><td>2</td><td>A pirate captain saved my life once and inspired me to take up the mantle myself until I can surpass them.</td></tr>
<tr><td>3</td><td>I want to create a pirate paradise where people can live a life of absolute freedom.</td></tr>
<tr><td>4</td><td>The world government is a scourge on the free world and must be torn down from its thrones.</td></tr>
<tr><td>5</td><td>I want to create a better world for everyone, free from aristocracy and oppression.</td></tr>
<tr><td>6</td><td>I will create the greatest armada that the world has ever seen.</td></tr></table>`),

  // ─── Navigator (Role) ───
  role("navigator", "Navigator", `<p>After the captain, the navigator might be the most important role on a ship. While the captain decides where to take the ship, the navigator figures out how to get there. Being a navigator requires a level head and a quick wit.</p>
<p><strong>Skill Proficiencies:</strong> Survival, choose one from Athletics, History, Religion, Perception, or Nature</p>
<p><strong>Tool Proficiencies:</strong> Cartographer's tools, Navigator's tools</p>
<p><strong>Equipment:</strong> Common clothes, cartographer's tools, navigator's tools, 5 blank sea charts, inkwell, quill, and a pouch containing 50,000 beri</p>
<h4>Feature: Weather Portent</h4>
<p>You can always tell what the weather will be like within the next hour and always know which way is north as long as you can see the sky. You and your crew cannot get lost as long as you have the stars or the sun to guide you. You can tell a real map or sea chart from a fake one at a glance. You don't need to make a Navigator's tools check when sailing under normal conditions.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Creativity Adept, Elemental Adept, Heightened Innovation, Keen Mind, Rogue Adept, Skill Expert.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>I wish to draw a map of the entire world.</td></tr>
<tr><td>2</td><td>There is a passage in the Grand Line said to be impossible to chart, and I aim to prove that wrong.</td></tr>
<tr><td>3</td><td>A legendary storm sweeps across the seas every 100 years. I aim to be the first one to conquer it.</td></tr>
<tr><td>4</td><td>A stranger gifted me a map of an ancient treasure, and I will not rest until I've found it.</td></tr>
<tr><td>5</td><td>I inherited an incomplete map of the New World and promised to finish what my predecessor started.</td></tr>
<tr><td>6</td><td>I wish to chart a trade route from the depths of Fishman Island to the most distant sky islands.</td></tr></table>`),

  // ─── Helmsman ───
  role("helmsman", "Helmsman", `<p>The helmsman is responsible for steering the ship through the storm. While the navigator charts the course and the shipwright keeps the vessel in shape, the helmsman braves the ocean waves from behind the wheel. Helmsmen are steadfast and typically possess great physical strength.</p>
<p><strong>Skill Proficiencies:</strong> Choose three from Athletics, Engineering, Insight, Intimidation, Sleight of Hand, or Survival</p>
<p><strong>Tool Proficiencies:</strong> Vehicles (Water)</p>
<p><strong>Equipment:</strong> Common clothes, a warm coat, a lucky charm, and a pouch containing 100,000 beri</p>
<h4>Feature: Ocean Tamer</h4>
<p>When you commandeer a ship from the helm, you instantly learn all of the ship's statistics, including its current and maximum hit points, and whether its current hit point maximum has been reduced. You can use any Ability Score for any check made to steer and control any ship you choose to helm. You gain a swim speed equal to your walking speed if you don't already have one.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Brawny, Menacing, Practiced Wisdom, Sentinel, Survivalist, Tough.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>One day, I will stand at the helm of a ship as it sails around the world.</td></tr>
<tr><td>2</td><td>I wish to master myself as I master the ship I command.</td></tr>
<tr><td>3</td><td>There is a legendary storm that no one has sailed through before. I will be the first.</td></tr>
<tr><td>4</td><td>I won't settle for a single ship, I want to sail all manners of ships!</td></tr>
<tr><td>5</td><td>I've heard legends of a ship that can sail the skies to the moon and back. I want to sail it.</td></tr>
<tr><td>6</td><td>There's a ship known to revolt against its crews. I will find it and tame it.</td></tr></table>`),

  // ─── Cook (Role) ───
  role("cook", "Cook", `<p>The cook is tasked with providing good food and drink to the crew, looking after the pantry and making sure food lasts from island to island. Only a cook can create the kind of food that makes a pirate's heart sing with courage and vigor.</p>
<p><strong>Skill Proficiencies:</strong> Choose two from History, Nature, Persuasion, Performance, Sleight of Hand, or Survival</p>
<p><strong>Tool Proficiencies:</strong> Cook's Utensils</p>
<p><strong>Equipment:</strong> Common clothes, cook's utensils, a knife kit (3 chef knives usable as daggers), and a pouch containing 50,000 beri</p>
<h4>Feature: Kitchen Artisan</h4>
<p>While on a ship, you and your crew require only half as many rations and half as much water. The time and cost to craft food items is cut in half. You can learn "attack cuisine" recipes.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Alert, Charger, Creativity Adept, Gourmand, Observant, Skilled.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>There's a mythical sea called the "All Blue" where fish from all oceans swim. I want to find it.</td></tr>
<tr><td>2</td><td>I want to create the perfect dish.</td></tr>
<tr><td>3</td><td>I wish to master all 99 recipes of the so-called "Attack Cuisine".</td></tr>
<tr><td>4</td><td>There are so many strange creatures. I want to cook a meal with every ingredient possible.</td></tr>
<tr><td>5</td><td>I want to create my own restaurant that serves food that can't be found anywhere else.</td></tr>
<tr><td>6</td><td>There is a single, mythical ingredient that no one has mastered. I will be the first.</td></tr></table>`),

  // ─── Doctor (Role) ───
  role("doctor", "Doctor", `<p>A pirate's life is a rough life filled with danger. Most crews cannot make it far without a doctor. A doctor's duties speak for themselves, tasked with looking after their crewmates' health.</p>
<p><strong>Skill Proficiencies:</strong> Medicine, choose one from Insight, Nature, Perception, Sleight of Hand, or Survival</p>
<p><strong>Tool Proficiencies:</strong> Alchemist's Supplies, Herbalism Kit</p>
<p><strong>Equipment:</strong> Common clothes, a herbalism kit, a stethoscope, an encyclopedia on medicinal herbs, and a pouch containing 50,000 beri</p>
<h4>Feature: Routine Care</h4>
<p>The time and money to craft medicines and poisons are both halved. While present on a ship, you prevent diseases from spreading among the crew. You can immediately tell what common injuries and ailments a person is suffering from. If the injury is something you've never seen, you know where you could go to research it and find a cure.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Battle Creator, Caring, First Aid, Master Alchemist, Naturalist, Skilled.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>An incurable disease is ravaging my homeland, and I aim to find a cure before it's too late.</td></tr>
<tr><td>2</td><td>I wish to create a miracle drug that can cure any illness or sickness.</td></tr>
<tr><td>3</td><td>I want to write my own encyclopedia on rare medical herbs and plants all over the world.</td></tr>
<tr><td>4</td><td>A doctor once gave their lives to save mine. I pursue my craft to make them proud.</td></tr>
<tr><td>5</td><td>I want to create a hospital that can take care of any patient, no matter the illness.</td></tr>
<tr><td>6</td><td>Honestly, I'm good if I can just keep my crew of idiots alive until we reach the next island.</td></tr></table>`),

  // ─── Musician ───
  role("musician", "Musician", `<p>A role that is often understated is that of the musician. Musicians keep their crew happy with performance, song, and dance. They lift the tired spirits and weary bodies of their crewmates after gruesome fights or violent storms.</p>
<p><strong>Skill Proficiencies:</strong> Performance, choose two from Acrobatics, Animal Handling, Deception, History, or Persuasion</p>
<p><strong>Tool Proficiencies:</strong> One instrument of your choice</p>
<p><strong>Equipment:</strong> Common clothes, a costume, an instrument of your choice, and a pouch containing 50,000 beri</p>
<h4>Feature: Entertainer's Routine</h4>
<p>You can always find a place to perform in towns and settlements, and you and your crew can stay for free as long as you perform every night. At the start of each dawn, select a friendly creature that can see and hear you; that creature gains a temporary point of Inspiration lasting until the end of the day.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Diplomat, Elemental Attack, Musician, Performer, Remarkable Recovery, Silver Tongue.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>I left my sweetheart behind as I took to the seas. One day I will return with a treasure in my hands.</td></tr>
<tr><td>2</td><td>I wish to record the epic adventures of my crew and immortalize them through song.</td></tr>
<tr><td>3</td><td>Somewhere in the world, there is beauty unlike any other. I wish to lay my own eyes upon it.</td></tr>
<tr><td>4</td><td>Notes on a great performance are scattered around the world. I want to collect and recreate them.</td></tr>
<tr><td>5</td><td>I wish to bring the joy of laughter and song to all corners of the world.</td></tr>
<tr><td>6</td><td>I fell in love with someone who set off to sea, and now I follow their trail hoping for reunion.</td></tr></table>`),

  // ─── Scholar ───
  role("scholar", "Scholar", `<p>Scholars are purveyors of knowledge and intrepid explorers of the forgotten past. Scholars that board pirate ships typically pursue knowledge the world government doesn't want found: the secrets of the Void Century and ancient poneglyphs.</p>
<p><strong>Skill Proficiencies:</strong> History, choose one from Insight, Investigation, Nature, Religion, or Stealth</p>
<p><strong>Tool Proficiencies:</strong> Disguise kit, Forgery kit</p>
<p><strong>Equipment:</strong> Common clothes, a leatherbound journal, inkwell, quill, and a pouch containing 100,000 beri</p>
<h4>Feature: Pursuer of Secrets</h4>
<p>You can read and write in poneglyphs. When you attempt to recall common information about an area you know the true name of, you automatically succeed. If you don't know a specific piece of information, you instead know where you could learn it.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Historian, Investigator, Keen Mind, Observant, Skilled, Skill Expert.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>It's my duty to unravel the true history behind the Void Century.</td></tr>
<tr><td>2</td><td>I was gifted an ancient text that will lead to a great discovery.</td></tr>
<tr><td>3</td><td>The secrets of the past will unravel the world government, and that's what I wish for.</td></tr>
<tr><td>4</td><td>I wish to find and control the ancient weapons: Pluton, Poseidon, and Uranus.</td></tr>
<tr><td>5</td><td>I am working on a chronicle of the world's history, and I need to learn everything.</td></tr>
<tr><td>6</td><td>The knowledge of the poneglyphs must be preserved.</td></tr></table>`),

  // ─── Shipwright (Role) ───
  role("shipwright", "Shipwright", `<p>Sailing the Grand Line without a ship built by a skilled shipwright is to invite disaster. Shipwrights are responsible for building and maintaining the vessel upon which the crew sails.</p>
<p><strong>Skill Proficiencies:</strong> Engineering, choose one from Athletics, History, Investigation, Perception, or Sleight of Hand</p>
<p><strong>Tool Proficiencies:</strong> Carpenter's tools, 2 artisan's tool sets of your choice</p>
<p><strong>Equipment:</strong> Common clothes, blueprints, carpenter's tools, and a pouch containing 50,000 beri</p>
<h4>Feature: Craft Vessel</h4>
<p>Given the necessary materials, you can construct ships from scratch. You can repair a ship that has a reduced hit point maximum, and when you repair a ship it regains twice as many hit points. The time and cost to craft items made from wood and metal is cut in half.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Adept Modifier, Battle Creator, Brawny, Creativity Adept, Engineer, Free Diver.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>I wish to build a ship that can sail to the ends of the world and back again.</td></tr>
<tr><td>2</td><td>The ship of my dreams can fight off 10 galleons without a scratch in the hull.</td></tr>
<tr><td>3</td><td>I dream of revolutionizing the history of shipwrights.</td></tr>
<tr><td>4</td><td>Any ship can sail on water. I wish to build a ship that can sail the skies!</td></tr>
<tr><td>5</td><td>My mentor created a work of art but died before seeing it realized. I swore to make their dream reality.</td></tr>
<tr><td>6</td><td>There exists a storm that no ship has conquered, and I intend to build the ship that could.</td></tr></table>`),

  // ─── Master at Arms ───
  role("master-at-arms", "Master at Arms", `<p>In situations dealing with combat it is the most tactical and experienced warrior on board, the master at arms, who takes action. The primary duties involve leading the crew in combat, hunting down foes, or boarding enemy ships.</p>
<p><strong>Skill Proficiencies:</strong> Choose three from Athletics, History, Insight, Intimidation, Persuasion, or Survival</p>
<p><strong>Tool Proficiencies:</strong> None</p>
<p><strong>Equipment:</strong> Common clothes, a simple or martial weapon of your choice, and a pouch containing 100,000 beri</p>
<h4>Feature: Perfected Practice</h4>
<p>You process information unlike others. Where others feel stress and falter, you thrive. When learning a new combat-related skill, the time it would take is reduced. You display overwhelming confidence that gives others pause; you can usually get away with minor offenses in settlements.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Dual Wielder, Lucky, Menacing, Observant, Sentinel, Tough.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>My captain's dream is my dream, it will come true!</td></tr>
<tr><td>2</td><td>I will be the strongest fighter in the world!</td></tr>
<tr><td>3</td><td>I have a rival that I wasn't strong enough to defeat. I must grow stronger.</td></tr>
<tr><td>4</td><td>I seek to master the art of fighting for someone who cannot do so anymore.</td></tr>
<tr><td>5</td><td>I have learned of a secret technique no one has ever mastered. I will be the first.</td></tr>
<tr><td>6</td><td>Seeing my crew make it to the end of Grand Line is all I care about.</td></tr></table>`),

  // ─── Deckhand ───
  role("deckhand", "Deckhand", `<p>A deckhand's role is much less defined, but when push comes to shove they can prove to be the most valuable member of a crew. Deckhands are jack-of-all-trades that add versatility and utility by helping out with other roles.</p>
<p><strong>Skill Proficiencies:</strong> Choose two from Animal Handling, Deception, Engineering, Investigation, Perception, or Sleight of Hand</p>
<p><strong>Tool Proficiencies:</strong> One artisan's tool kit of your choice</p>
<p><strong>Equipment:</strong> Common clothes, a hammer, a spyglass, and a pouch containing 50,000 beri</p>
<h4>Feature: All Hands on Deck</h4>
<p>You specialize in performing menial tasks aboard the ship such as taking inventory, swabbing the deck, manning the cannons, or acting lookout. You can always find your way around any ship. When you assist a creature in the crafting process, you halve the time and cost.</p>
<h4>Feature: Bonus Feat</h4>
<p>You gain a bonus feat of your choice. Some potential options: Creativity Adept, Fighting Initiate, Mobile, Beary Blue, Perceptive, Underdog.</p>
<h4>Dream</h4>
<table><tr><th>d6</th><th>Dream</th></tr>
<tr><td>1</td><td>I will do everything in my power to make sure my captain becomes king/queen of the pirates.</td></tr>
<tr><td>2</td><td>One day, I want to be a legend sung about in songs of heroes.</td></tr>
<tr><td>3</td><td>I want to have the adventure of a lifetime!</td></tr>
<tr><td>4</td><td>I made a promise to a childhood friend to brave the seas, and I will keep that promise.</td></tr>
<tr><td>5</td><td>No one believed me when I said I would sail around the world, and I aim to prove them wrong.</td></tr>
<tr><td>6</td><td>There's a mythical island in the New World that I want to see with my own eyes.</td></tr></table>`),
];
