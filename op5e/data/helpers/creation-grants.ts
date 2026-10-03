import { items as creations } from "../src/creations/index.js";
import { compendiumUuid } from "./uuid.js";
import { createItemGrant, type AdvancementEntry } from "./advancement.js";

/** Book spelling -> pack name where they differ. */
const ALIASES: Record<string, string> = { "storm sphere": "stormy sphere" };

const byName = new Map<string, string>();
for (const c of creations as { _id: string; name: string }[]) byName.set(c.name.toLowerCase(), c._id);

function creationId(name: string): string {
  const k = name.trim().toLowerCase();
  const id = byName.get(ALIASES[k] ?? k) ?? byName.get(`${ALIASES[k] ?? k} (r)`);
  if (!id) throw new Error(`creation-grants: no creation named "${name}"`);
  return id;
}

/**
 * Always-prepared subclass creation table: one ItemGrant per class level,
 * granting the named creations as always-prepared (do not count against prepared).
 */
export function creationGrants(
  subclassId: string,
  rows: [level: number, names: string[]][],
  title: string,
): AdvancementEntry[] {
  return rows.map(([level, names]) => {
    const adv = createItemGrant(
      subclassId,
      level,
      names.map((n) => ({ uuid: compendiumUuid("creations", creationId(n)) })),
      `creations-${level}`,
    );
    adv.title = title;
    (adv.configuration as Record<string, unknown>).spell = {
      ability: [],
      preparation: "always",
      uses: { max: "", per: "", requireSlot: false },
    };
    return adv;
  });
}
