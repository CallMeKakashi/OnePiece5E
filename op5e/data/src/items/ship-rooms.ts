import { mkItem } from "./_make.js";

const AVAIL = "Caravel, carrack, galleon, galley, keelboat, longship, sloop";
const STACK = "Rooms are repeatable, but their benefits do not stack: two Sick Bays do not give a 2d4 bonus.";

// [id, name, cost (beri), days, benefit html]
const ROOMS: [string, string, number, number, string][] = [
  ["bedroom", "Bedroom (Individual)", 2_000_000, 30, "A separate, comfortable room for its main occupant, as opposed to the standard bunks. When a creature takes a long rest inside this room, it regains all of its expended hit dice instead of half."],
  ["kitchen", "Kitchen", 3_000_000, 40, "A must-have when a chef is aboard; the chef has access to all their culinary tools. Any food made in this room takes half the time to craft."],
  ["dining-room", "Dining Room", 2_000_000, 30, "When a creature eats a meal provided by the ship's chef in the dining room, it becomes energized for the next 24 hours. While energized, it can roll a number of extra hit dice on a short rest equal to the chef's proficiency bonus."],
  ["stage", "Stage", 2_000_000, 30, "The ideal performance zone on the ship. Any musician in this room has a 1d4 bonus to checks made with a musical instrument, or to Charisma (Performance) checks."],
  ["navigators-room", "Navigator's Room", 3_000_000, 40, "A treasure trove of maps and tools. Any navigator in this room has a 1d4 bonus to checks made with navigator's tools or cartographer's tools."],
  ["sick-bay", "Sick Bay", 5_000_000, 50, "A doctor's room with all the tools to make medicine for the crew. When a ship doctor makes a Wisdom (Medicine) check, or an alchemist's supplies or herbalism kit check, in this room, they gain a 1d4 bonus to the roll."],
  ["library", "Library", 3_000_000, 40, "A library for scholarly research, such as seeking mythical treasures. When a creature makes an Intelligence (History) check inside this room, it has a 1d4 bonus to the check."],
  ["training-room", "Training Room", 5_000_000, 60, "Where fighters hone their combative prowess and develop new fighting techniques. When a creature trains in the training room, it has advantage on any skill check made to train a new ability."],
  ["workshop", "Workshop", 5_000_000, 60, "Filled with the tools for a specific artisan. When creating this room, select a specific tool; any check made with that tool in the workshop has a 1d4 bonus. To make the workshop work for additional tools, expend 60 days and 5 million beri per extra tool."],
];

export const shipRooms = ROOMS.map(([id, name, cost, days, benefit]) =>
  mkItem("ship-rooms", id, name, cost,
    `<p><strong>Ship Room.</strong> Cost ${cost.toLocaleString("en-US")} beri; build time ${days} days (same process as ship upgrades). Requirement: ${AVAIL}.</p><p>${benefit}</p><p>${STACK}</p>`));
