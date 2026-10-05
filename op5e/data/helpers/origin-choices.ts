import { generateId } from "./id.js";
import { compendiumUuid } from "./uuid.js";
import { createItemChoiceRestricted, type AdvancementEntry } from "./advancement.js";

/** Role slugs; the role docs are generated in data/src/backgrounds/roles.ts with _id = generateId(`role/<slug>`). */
export const ROLE_SLUGS = [
  "captain", "navigator", "helmsman", "cook", "doctor",
  "musician", "scholar", "shipwright", "master-at-arms", "deckhand",
] as const;

/** Devil fruit template slugs; docs live in data/src/devil-fruits/templates.ts. */
export const DEVIL_FRUIT_CHOICE_SLUGS = ["paramecia", "zoan", "logia", "none"] as const;
export const devilFruitChoiceId = (slug: string) => generateId(`devil-fruit/template/${slug}`);

/** Level-1 ItemChoice advancements shared by every class: Role + Devil Fruit. */
export function createOriginChoices(classId: string): AdvancementEntry[] {
  const role = createItemChoiceRestricted(
    classId, 1, ROLE_SLUGS.map((s) => compendiumUuid("backgrounds", generateId(`role/${s}`))),
    { count: 1, label: "Role" },
  );
  role.classRestriction = "primary";   // a starting choice: a second class (story-classing) must not offer another role
  role.hint = "Choose your role on the ship. It grants skills, tools, equipment and a bonus feat.";
  const fruit = createItemChoiceRestricted(
    classId, 1, DEVIL_FRUIT_CHOICE_SLUGS.map((s) => compendiumUuid("devil-fruits", devilFruitChoiceId(s))),
    { count: 1, label: "Devil Fruit", itemType: "loot", restrictionType: "" },
  );
  fruit.classRestriction = "primary";
  fruit.hint = "Pick a devil fruit type (rename the item and fill in its name and powers) or 'No Devil Fruit (yet)'.";
  return [role, fruit];
}
