import {
  createItemChoiceRestricted,
  mergeAdvancements,
  type AdvancementEntry,
} from "../../helpers/advancement.js";
import {
  equipmentAdvancement,
  grantQuantitiesMap,
  itemArmor,
  itemGear,
  itemTool,
  itemWeapon,
  repeat,
  type StartingEquipmentPack,
} from "../backgrounds/equipment-grants.js";
import {
  ADVENTURING_PACK_UUIDS,
  DIPLOMAT_OR_EXPLORER_PACK_UUIDS,
  MARTIAL_MELEE_UUIDS,
  MUSICAL_INSTRUMENT_UUIDS,
  RANGED_WEAPON_UUIDS,
  ROGUE_PACK_UUIDS,
  SCHOLAR_OR_EXPLORER_PACK_UUIDS,
  SIMPLE_WEAPON_UUIDS,
} from "./class-proficiency-pools.js";

interface ClassEquipmentDef {
  fixed: StartingEquipmentPack;
  choices?: Array<{ label: string; uuids: string[]; itemType?: string; count?: number }>;
}

/**
 * Class starting gear must be level 1, not 0. dnd5e AdvancementManager.forNewItem runs
 * createLevelChangeSteps from class level 0→N and only calls flowsForLevel at 1..N;
 * level-0 ItemGrant/ItemChoice never run for classes (backgrounds/roles at level 0 still work).
 */
export const CLASS_STARTING_EQUIPMENT_LEVEL = 1;

/** Class starting equipment mapped to OP5e compendium items (source book). */
const CLASS_EQUIPMENT: Record<string, ClassEquipmentDef> = {
  barbarian: {
    fixed: {
      beri: 0,
      grants: [
        itemGear("explorers-pack"),
        ...repeat(itemWeapon("javelin"), 4),
        ...repeat(itemWeapon("handaxe"), 2),
      ],
    },
    choices: [
      {
        label: "Primary Weapon",
        itemType: "weapon",
        uuids: [itemWeapon("greataxe").uuid, ...MARTIAL_MELEE_UUIDS],
      },
      {
        label: "Secondary Weapon",
        itemType: "weapon",
        uuids: SIMPLE_WEAPON_UUIDS,
      },
    ],
  },
  bard: {
    fixed: {
      beri: 0,
      grants: [
        itemArmor("leather"),
        itemWeapon("dagger"),
      ],
    },
    choices: [
      {
        label: "Starting Weapon",
        itemType: "weapon",
        uuids: [
          itemWeapon("rapier").uuid,
          itemWeapon("longsword").uuid,
          ...SIMPLE_WEAPON_UUIDS,
        ],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...DIPLOMAT_OR_EXPLORER_PACK_UUIDS],
      },
      {
        label: "Musical Instrument",
        itemType: "tool",
        uuids: MUSICAL_INSTRUMENT_UUIDS,
      },
    ],
  },
  brawler: {
    fixed: {
      beri: 0,
      grants: [
        itemGear("clothes-common"),
        itemGear("backpack"),
        itemWeapon("quarterstaff"),
        itemGear("sling-bullets-20"),
        itemGear("rations"),
      ],
    },
    choices: [
      {
        label: "Simple Weapon",
        itemType: "weapon",
        uuids: SIMPLE_WEAPON_UUIDS,
      },
    ],
  },
  fighter: {
    fixed: {
      beri: 0,
      grants: [
        itemGear("arrows-20"),
        itemGear("crossbow-bolts-20"),
        ...repeat(itemWeapon("handaxe"), 2),
      ],
    },
    choices: [
      {
        label: "Starting Armor",
        itemType: "equipment",
        uuids: [
          itemArmor("chain-mail").uuid,
          itemArmor("heavy-longcoat").uuid,
          itemArmor("leather").uuid,
        ],
      },
      {
        label: "Martial Weapon",
        itemType: "weapon",
        uuids: MARTIAL_MELEE_UUIDS,
      },
      {
        label: "Second Weapon or Shield",
        itemType: "equipment",
        uuids: [itemArmor("shield").uuid, ...MARTIAL_MELEE_UUIDS],
      },
      {
        label: "Ranged Weapon",
        itemType: "weapon",
        uuids: [itemWeapon("longbow").uuid, itemWeapon("crossbow-light").uuid],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...ADVENTURING_PACK_UUIDS],
      },
    ],
  },
  gadgeteer: {
    fixed: {
      beri: 0,
      grants: [
        itemWeapon("dagger"),
        itemGear("book"),
        itemGear("backpack"),
        itemTool("tinkers-tools"),
        itemGear("firearms-bullets-20"),
      ],
    },
    choices: [
      {
        label: "Firearm",
        itemType: "weapon",
        uuids: [itemWeapon("shotgun").uuid, itemWeapon("flintlock").uuid],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...SCHOLAR_OR_EXPLORER_PACK_UUIDS],
      },
    ],
  },
  marksman: {
    fixed: {
      beri: 0,
      grants: [
        itemWeapon("dagger"),
        itemTool("tinkers-tools"),
        itemTool("gunsmiths-tools"),
        itemGear("arrows-20"),
        itemGear("crossbow-bolts-20"),
        itemGear("firearms-bullets-20"),
        itemGear("sling-bullets-20"),
      ],
    },
    choices: [
      {
        label: "Melee Weapon",
        itemType: "weapon",
        uuids: [itemWeapon("shortsword").uuid, ...SIMPLE_WEAPON_UUIDS],
      },
      {
        label: "Starting Armor",
        itemType: "equipment",
        uuids: [
          itemArmor("scale-mail").uuid,
          itemArmor("leather").uuid,
          itemArmor("heavy-longcoat").uuid,
        ],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...ADVENTURING_PACK_UUIDS],
      },
      {
        label: "Ranged Weapon",
        itemType: "weapon",
        uuids: RANGED_WEAPON_UUIDS,
      },
    ],
  },
  medic: {
    fixed: {
      beri: 0,
      grants: [
        itemWeapon("flintlock"),
        itemGear("firearms-bullets-20"),
        itemArmor("leather"),
      ],
    },
    choices: [
      {
        label: "Sidearm",
        itemType: "weapon",
        uuids: [itemWeapon("sickle").uuid, itemWeapon("dagger").uuid],
      },
      {
        label: "Medical Kit",
        itemType: "tool",
        uuids: [itemTool("alchemists-supplies").uuid, itemTool("herbalism-kit").uuid],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...SCHOLAR_OR_EXPLORER_PACK_UUIDS],
      },
    ],
  },
  rogue: {
    fixed: {
      beri: 0,
      grants: [
        itemArmor("leather"),
        ...repeat(itemWeapon("dagger"), 2),
        itemTool("thieves-tools"),
        itemGear("arrows-20"),
      ],
    },
    choices: [
      {
        label: "Primary Weapon",
        itemType: "weapon",
        uuids: [itemWeapon("rapier").uuid, itemWeapon("shortsword").uuid],
      },
      {
        label: "Secondary Weapon",
        itemType: "weapon",
        uuids: [
          itemWeapon("shortbow").uuid,
          itemWeapon("shortsword").uuid,
        ],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...ROGUE_PACK_UUIDS],
      },
    ],
  },
  savant: {
    fixed: {
      beri: 0,
      grants: [
        ...repeat(itemWeapon("javelin"), 5),
        itemWeapon("dagger"),
        itemGear("memento"),
      ],
    },
    choices: [
      {
        label: "Starting Armor",
        itemType: "equipment",
        uuids: [itemArmor("chain-mail").uuid, itemArmor("heavy-longcoat").uuid],
      },
      {
        label: "Adventuring Pack",
        itemType: "loot",
        uuids: [...ADVENTURING_PACK_UUIDS],
      },
      {
        label: "Martial Weapon",
        itemType: "weapon",
        uuids: MARTIAL_MELEE_UUIDS,
      },
      {
        label: "Second Weapon or Shield",
        itemType: "equipment",
        uuids: [itemArmor("shield").uuid, ...MARTIAL_MELEE_UUIDS],
      },
    ],
  },
};

function classChoiceAdvancements(
  classId: string,
  choices: ClassEquipmentDef["choices"],
  level: number,
): AdvancementEntry[] {
  if (!choices?.length) return [];
  return choices.map((choice) =>
    createItemChoiceRestricted(`class/${classId}`, level, choice.uuids, {
      count: choice.count ?? 1,
      label: choice.label,
      itemType: choice.itemType ?? "loot",
      restrictionType: choice.itemType ?? "loot",
    }),
  );
}

/** ItemGrant / ItemChoice advancements for class starting equipment (level 1). */
export function classStartingEquipmentAdvancement(classId: string): AdvancementEntry[] {
  const def = CLASS_EQUIPMENT[classId];
  if (!def) return [];
  const level = CLASS_STARTING_EQUIPMENT_LEVEL;
  return mergeAdvancements(
    ...equipmentAdvancement(`class/${classId}`, def.fixed, level),
    ...classChoiceAdvancements(classId, def.choices, level),
  );
}

/** flags.op5e.grantQuantities for class compendium items (quantity hook fallback). */
export function classStartingEquipmentGrantQuantities(classId: string): Record<string, number> {
  const def = CLASS_EQUIPMENT[classId];
  if (!def) return {};
  return grantQuantitiesMap(def.fixed.grants);
}

export default classStartingEquipmentAdvancement;
