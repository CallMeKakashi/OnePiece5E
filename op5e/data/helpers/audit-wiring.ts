// Build-time wiring from the 2026-10-10 compendium audit (docs/compendium-audit-2026-10-10.md): features whose rules text spends a class resource
// ("spend a spirit point", "expend a superiority die", "grit point", "Bardic Inspiration") now spend it, and save activities with an empty DC get the DC the text names.
type Doc = { name: string; system: Record<string, any> };

const POOLS: { re: RegExp; target: string }[] = [
  { re: /(?:spend|expend)s? (a|one|an?|\d+|up to)[^.]{0,30}spirit points?/i, target: "spirit" },
  { re: /(?:expend|spend)s? (a|one) superiority die/i, target: "superior-combatant" },
  { re: /(?:expend|spend)s? (a|one|\d+) grit points?/i, target: "trick-shots" },
  { re: /(?:expend|spend)s? (a|one|\d+)[^.]{0,20}Bardic Inspiration/i, target: "bardic-inspiration" },
];
// several effects in one feature, or the spend is optional: left as text
const SKIP = new Set(["Deflect Missiles", "Mountain Stance", "Ninja Arts", "Vagabond Drill", "The Open Hand", "Six King Gun", "Finishing Blow", "Spirit"]);
const HIGHEST = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod, @abilities.con.mod, @abilities.int.mod, @abilities.wis.mod, @abilities.cha.mod)";
const DCS: Record<string, string> = {
  "Hellfire Halitosis": "8 + @prof + @abilities.con.mod", "Ferocious Aura": "8 + @prof + @abilities.con.mod",
  "Raging Charge": "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)", "Tides of War": "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)",
  "Gleeful Bellows": "8 + @prof + @abilities.cha.mod", "Obliterate": HIGHEST, "Observation Obliteration": HIGHEST,
};
const plain = (h: unknown) => String(h ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

export function wireAudit<T extends Doc>(doc: T): T {
  const acts = Object.values(doc.system.activities ?? {}) as any[];
  if (!acts.length) return doc;
  const dc = DCS[doc.name];
  if (dc) for (const a of acts) if (a.type === "save" && !a.save?.dc?.formula) a.save.dc = { calculation: "", formula: dc };
  if (SKIP.has(doc.name) || acts.length > 2 || acts.some((a) => a.consumption?.targets?.length)) return doc;
  const text = plain(doc.system.description?.value);
  for (const p of POOLS) {
    const m = p.re.exec(text); if (!m) continue;
    const n = /^\d+$/.test(m[1]) ? m[1] : "1";
    const a = acts.find((x) => x.type === "save" || x.type === "attack") ?? acts[0];
    a.consumption = { ...a.consumption, targets: [{ type: "itemUses", target: p.target, value: n, scaling: { mode: "", formula: "" } }] };
    break;
  }
  return doc;
}
