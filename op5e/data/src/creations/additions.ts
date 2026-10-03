import type { FoundryItem } from "../../schemas/common.js";
import { generateId } from "../../helpers/id.js";
import { buildActivities } from "../../helpers/activities.js";

// Creations whose text was supplied directly by the DM (they are on the class lists but missing from the Appendix A text).
interface Def {
  slug: string; name: string; level: number; school: string; descriptionHtml: string;
  materials: string; material: boolean; somatic: boolean; vocal: boolean;
  range: number; durationMinutes: number; concentration: boolean;
  damage: [string, string]; saveAbility: string; onSave: "half" | "full"; scaling?: string;
}

function creation(d: Def): FoundryItem {
  const system = {
    description: { value: d.descriptionHtml, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    level: d.level, school: d.school,
    components: { value: "", vocal: d.vocal, somatic: d.somatic, material: d.material, ritual: false, concentration: d.concentration },
    materials: { value: d.materials, consumed: false, cost: 0, supply: 0 },
    preparation: { mode: "prepared", prepared: false },
    scaling: { mode: d.scaling ? "level" : "none", formula: d.scaling ?? "" },
    activation: { type: "action", cost: 1, condition: "" },
    duration: { value: String(d.durationMinutes), units: "minute" },
    target: { value: null, width: null, units: "", type: "" },
    range: { value: d.range, long: null, units: "ft" },
    uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "save", attack: { bonus: "", flat: false },
    damage: { parts: [d.damage], versatile: "" },
    save: { ability: d.saveAbility, dc: null, scaling: "spell" },
    chatFlavor: "", formula: "",
  };
  const activities = buildActivities({ name: d.name, type: "spell", system } as never) as Record<string, { type?: string; damage?: { onSave?: string } }>;
  for (const a of Object.values(activities)) if (a.type === "save" && a.damage) a.damage.onSave = d.onSave;
  return {
    _id: generateId(`creation/${d.slug}`), name: d.name, type: "spell", img: "icons/svg/item-bag.svg",
    system: { ...system, activities }, effects: [], flags: { op5e: { suppliedBy: "DM" } }, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FoundryItem;
}

export const additions: FoundryItem[] = [
  creation({
    slug: "vitriolic-sphere", name: "Vitriolic Sphere", level: 4, school: "evo",
    descriptionHtml: "<p>You point at a place within range, and a ball of acid streaks there and explodes in a 20-foot radius. Each creature in that area must make a Dexterity saving throw. On a failed save, a creature takes 10d4 acid damage and 5d4 acid damage at the end of each of its turns for the duration, or until a creature uses their action to scrape off the acid. On a successful save, a creature takes half the initial damage and no damage at the end of its next turn.</p><p><strong>At Higher Levels.</strong> When you use this creation with a creation slot of 5th level or higher, the initial damage increases by 2d4 for each slot level above 4th.</p>",
    materials: "a slug", material: true, somatic: true, vocal: true, range: 150, durationMinutes: 1, concentration: true,
    damage: ["10d4", "acid"], saveAbility: "dex", onSave: "half", scaling: "2d4",
  }),
  // Source title is "Mental Prison"; the class lists call it "Mind Prison", so the compendium uses the list name.
  creation({
    slug: "mind-prison", name: "Mind Prison", level: 6, school: "ill",
    descriptionHtml: "<p>You attempt to bind a creature within an illusory cell that only it perceives. One creature you can see within range must make an Intelligence saving throw. The target succeeds automatically if it is immune to being charmed.</p><p>On a successful save, the target takes 5d10 psychic damage, and the creation ends. On a failed save, the target takes 5d10 psychic damage, and you make the area immediately around the target’s space appear dangerous to it in some way. You might cause the target to perceive itself as being surrounded by fire, floating razors, or hideous maws filled with dripping teeth.</p><p>Whatever form the illusion takes, the target can’t see or hear anything beyond it and is restrained for the creation’s duration. If the target is moved out of the illusion, makes a melee attack through it, or reaches any part of its body through it, the target takes 10d10 psychic damage, and the creation ends.</p>",
    materials: "", material: false, somatic: true, vocal: false, range: 60, durationMinutes: 1, concentration: true,
    damage: ["5d10", "psychic"], saveAbility: "int", onSave: "full",
  }),
];
