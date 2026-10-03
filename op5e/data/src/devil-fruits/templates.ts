import { generateId } from "../../helpers/id.js";
import { ZOAN_T, LOGIA_T, PARA_T, p, ul } from "../feats/sourcebook-rules.js";

// Class-creation choices (class "Devil Fruit" ItemChoice). Level tables are shared with the sourcebook rule feats.
const NAME_HINT = p("<strong>Player:</strong> rename this item to your fruit (e.g. 'Gum-Gum Fruit') and write its powers below, with your DM. Powers at each level are agreed with the DM (see Creating A Devil Fruit, Ability Crafting).");
const COMMON = ul("Fruit uses are spent on major abilities; you regain all uses on a long rest.", "Fruit-Fruit DC: 8 + highest ability modifier + proficiency bonus.", "Devil Fruit Attack and Ability Check: 1d20 + highest ability modifier + proficiency bonus.", "Ocean's Scorn: you cannot swim and sink in water; seastone and haki can counter your fruit.");

const tpl = (slug: string, name: string, kind: string, html: string) => ({
  _id: generateId(`devil-fruit/template/${slug}`), name, type: "loot", img: "icons/consumables/food/berries-ration-round-red.webp",
  system: { description: { value: html, chat: "" }, type: { value: "treasure" }, rarity: "", activities: {} },
  effects: [], flags: { op5e: { devilFruitTemplate: kind, automation: "NEEDS_REVIEW" } },
});

export default [
  tpl("paramecia", "Paramecia Devil Fruit (Template)", "paramecia", NAME_HINT +
    p("Paramecia fruits cover every superhuman ability or trait not classed as zoan or logia: transforming into a substance, creating a substance or a force. They grant no automatic damage immunity. Initial consumption grants only the 1st-3rd level upgrades until trained.") + PARA_T + COMMON +
    p("Improved Usage (5th, 10th, 15th, 20th) typically adds abilities related to the fruit; the empty table spaces are for the player and DM to fill.")),
  tpl("zoan", "Zoan Devil Fruit (Template)", "zoan", NAME_HINT +
    p("A zoan fruit lets you shapeshift into one animal: a full beast form and a hybrid form. Any zoan weapon counts as both a natural weapon and an unarmed strike. On consumption, your choice of Strength, Dexterity or Constitution increases by 1.") + ZOAN_T + COMMON +
    p("Hybrid Form and Full Beast Form (bonus action, one fruit use, 10 minutes, scaling with level), Enhanced Form (10th, once per long rest) and Endless Forms (20th): see the Zoan Hybrid Form, Zoan Full Beast Form, Zoan Enhanced Form and Zoan Endless Forms feats.")),
  tpl("logia", "Logia Devil Fruit (Template)", "logia", NAME_HINT +
    p("A logia fruit gives you domain over an element or force of nature and lets you transform into it. A newly made logia user is not yet reflexively intangible; that needs training.") + LOGIA_T + COMMON +
    p("Elemental Domain (1st) and Improved Elemental Domain (5th, 10th, 15th, 20th): see the Logia Elemental Domain and Logia Improved Elemental Domain feats.")),
  tpl("none", "No Devil Fruit (yet)", "none",
    p("You have no devil fruit at creation. Your DM can give you one later in the campaign; delete this item when that happens.")),
];
