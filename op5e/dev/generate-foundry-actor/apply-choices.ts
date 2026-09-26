import { hakiUuid } from "../../data/helpers/haki-advancement.ts";
import {
  findByUuid,
  type AnyDoc,
} from "../character-sheet-audit/audit-lib.js";
import type { ChoiceEntry, BuildSpec } from "./build-spec.schema.js";
import type { EmbedRegistry } from "./standalone.js";
import { embedOwnedItem, type CompendiumDoc } from "./compendium-resolver.js";

const SKILL_KEYS: Record<string, string> = {
  acrobatics: "acr",
  athletics: "ath",
  deception: "dec",
  insight: "ins",
  intimidation: "itm",
  investigation: "inv",
  perception: "prc",
  performance: "prf",
  persuasion: "per",
  sleightofhand: "slt",
  stealth: "ste",
  history: "his",
  arcana: "arc",
  nature: "nat",
  religion: "rel",
};

function traitKey(entry: string): { kind: "skill" | "tool"; key: string } | null {
  if (entry.startsWith("skills:")) {
    const raw = entry.slice("skills:".length).replace(/\s/g, "");
    const key = SKILL_KEYS[raw] ?? raw.slice(0, 3);
    return { kind: "skill", key };
  }
  if (entry.startsWith("tool:")) {
    const raw = entry.slice("tool:".length);
    const toolMap: Record<string, string> = {
      "thieves' tools": "tth",
      "disguise kit": "dis",
      "forgery kit": "frg",
      "calligrapher's supplies": "cal",
    };
    const key = toolMap[raw.toLowerCase()] ?? raw.slice(0, 3);
    return { kind: "tool", key };
  }
  return null;
}

export function applyTraitChoices(
  spec: BuildSpec,
  skills: Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }>,
  tools: Record<string, { value: number; ability: string; bonuses: { check: string; passive: string } }>,
): void {
  for (const choice of spec.choices ?? []) {
    for (const slug of choice.slugs ?? []) {
      const parsed = traitKey(slug);
      if (!parsed) continue;
      const block = { value: 1, ability: "int", bonuses: { check: "", passive: "" } };
      if (parsed.kind === "skill") {
        skills[parsed.key] = { ...block, ...skills[parsed.key], value: Math.max(skills[parsed.key]?.value ?? 0, 1) };
      } else {
        tools[parsed.key] = { ...block, ...tools[parsed.key], value: Math.max(tools[parsed.key]?.value ?? 0, 1) };
      }
    }
  }
}

export function embedChoiceItems(
  spec: BuildSpec,
  registry: EmbedRegistry,
  opts: { equippedWeapons?: Set<string> } = {},
): CompendiumDoc[] {
  const out: CompendiumDoc[] = [];
  const embeddedNames = new Set<string>();

  for (const choice of spec.choices ?? []) {
    for (const uuid of choice.uuids ?? []) {
      const doc = findByUuid(uuid);
      if (!doc) continue;
      const name = String(doc.name ?? "");
      const embedded = embedOwnedItem(doc as CompendiumDoc, {
        registry,
        equipped: opts.equippedWeapons?.has(name),
      });
      registry.register(uuid, embedded._id);
      out.push(embedded);
      embeddedNames.add(name);
    }
  }

  return out;
}

export function embedStartingHaki(
  slugs: string[] | undefined,
  registry: EmbedRegistry,
): CompendiumDoc[] {
  const out: CompendiumDoc[] = [];
  for (const slug of slugs ?? []) {
    const uuid = hakiUuid(slug);
    const doc = findByUuid(uuid);
    if (!doc) continue;
    const embedded = embedOwnedItem(doc as CompendiumDoc, { registry });
    registry.register(uuid, embedded._id);
    out.push(embedded);
  }
  return out;
}

export function embedEquipmentByName(
  equipment: Record<string, string> | undefined,
  registry: EmbedRegistry,
  findItem: (name: string) => AnyDoc | undefined,
): CompendiumDoc[] {
  const out: CompendiumDoc[] = [];
  if (!equipment) return out;

  const slotEquip: Record<string, boolean> = {
    shortsword: true,
    pistol: true,
    primary: true,
    secondary: true,
  };

  for (const [slot, name] of Object.entries(equipment)) {
    const doc = findItem(name);
    if (!doc) continue;
    out.push(
      embedOwnedItem(doc as CompendiumDoc, {
        registry,
        equipped: slotEquip[slot.toLowerCase()] ?? false,
      }),
    );
  }
  return out;
}

export function collectChoiceUuids(spec: BuildSpec): string[] {
  return (spec.choices ?? []).flatMap((c: ChoiceEntry) => c.uuids ?? []);
}
