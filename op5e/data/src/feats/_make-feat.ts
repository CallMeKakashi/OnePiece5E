import { generateId } from "../../helpers/id.js";
import type { FeatureItem } from "../../schemas/feature.js";

export interface FeatDef {
  name: string;
  slug: string;
  racial?: boolean;
  prerequisites?: string;
  description: string;
  activation?: { type: string; cost: number | null; condition?: string };
  uses?: { max: string; per: string; recovery?: string };
  actionType?: string;
}

export function makeFeat(def: FeatDef): FeatureItem {
  const prefix = def.racial ? "feat/racial" : "feat";
  const id = generateId(`${prefix}/${def.slug}`);
  return {
    _id: id,
    name: def.name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: def.description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "feat", subtype: "" },
      requirements: def.prerequisites ?? "",
      activation: {
        type: def.activation?.type ?? "",
        cost: def.activation?.cost ?? null,
        condition: def.activation?.condition ?? "",
      },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: {
        value: null,
        max: def.uses?.max ?? "",
        per: def.uses?.per ?? null,
        recovery: def.uses?.recovery ?? "",
        prompt: true,
      },
      actionType: def.actionType ?? "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  };
}
