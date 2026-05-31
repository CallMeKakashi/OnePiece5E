import classes from "../data/src/classes/index.ts";
import features from "../data/src/class-features/index.ts";
import subclasses from "../data/src/subclasses/index.ts";

type ClassDoc = (typeof classes)[number];
type ItemDoc = (typeof features)[number] | (typeof subclasses)[number];

type ScaleRef = { classIdentifier: string; scaleId: string; path: string; sample: string };

function walkStrings(value: unknown, path: string, out: { path: string; value: string }[]) {
  if (typeof value === "string") {
    out.push({ path, value });
    return;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) walkStrings(value[i], `${path}[${i}]`, out);
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      walkStrings(v, path ? `${path}.${k}` : k, out);
    }
  }
}

function extractScaleRefs(doc: ItemDoc): ScaleRef[] {
  const strings: { path: string; value: string }[] = [];
  walkStrings(doc, "", strings);

  const refs: ScaleRef[] = [];
  const re = /@scale\.([a-z0-9_-]+)\.([a-z0-9_-]+)/gi;

  for (const s of strings) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(s.value))) {
      refs.push({
        classIdentifier: m[1].toLowerCase(),
        scaleId: m[2],
        path: s.path,
        sample: s.value.length > 140 ? `${s.value.slice(0, 140)}…` : s.value,
      });
    }
  }

  return refs;
}

function classScaleIds(cls: ClassDoc): Set<string> {
  const out = new Set<string>();
  for (const adv of cls.system?.advancement ?? []) {
    if (adv.type !== "ScaleValue") continue;
    const id = (adv.configuration as any)?.identifier;
    if (typeof id === "string" && id) out.add(id);
  }
  return out;
}

function classGrantedCompendiumUuids(cls: ClassDoc): string[] {
  const uuids: string[] = [];
  for (const adv of cls.system?.advancement ?? []) {
    if (adv.type !== "ItemGrant") continue;
    const items = (adv.configuration as any)?.items;
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      const u = it?.uuid;
      if (typeof u === "string" && u) uuids.push(u);
    }
  }
  return uuids;
}

function isSubclassForClass(sub: any, classIdentifier: string): boolean {
  const clsId = sub?.system?.classIdentifier;
  if (typeof clsId !== "string") return false;
  return clsId.toLowerCase() === classIdentifier.toLowerCase();
}

function byClassIdentifier(id: string) {
  return classes.find((c) => c.system?.identifier === id);
}

function main() {
  const byClass = new Map<string, { class: ClassDoc; features: any[]; subclasses: any[] }>();

  for (const cls of classes) {
    const id = cls.system.identifier;
    byClass.set(id, { class: cls, features: [], subclasses: [] });
  }

  for (const item of features as any[]) {
    const req = String(item?.system?.requirements ?? "");
    const m = /^(?<className>[A-Za-z ]+)\s+(?<level>\d+)/.exec(req);
    if (!m?.groups?.className) continue;
    const className = m.groups.className.trim();
    const cls = classes.find((c) => String(c.name).toLowerCase() === className.toLowerCase());
    if (!cls) continue;
    byClass.get(cls.system.identifier)?.features.push(item);
  }

  for (const sub of subclasses as any[]) {
    for (const cls of classes) {
      if (!isSubclassForClass(sub, cls.system.identifier)) continue;
      byClass.get(cls.system.identifier)?.subclasses.push(sub);
    }
  }

  const report: any = { generatedAt: new Date().toISOString(), classes: [] as any[] };

  for (const [classIdentifier, bundle] of byClass.entries()) {
    const cls = bundle.class;
    const scaleIds = classScaleIds(cls);
    const grantedUuids = classGrantedCompendiumUuids(cls);

    const scaleRefs = [
      ...bundle.features.flatMap(extractScaleRefs),
      ...bundle.subclasses.flatMap(extractScaleRefs),
    ].filter((r) => r.classIdentifier === classIdentifier);

    const referencedScaleIds = new Set(scaleRefs.map((r) => r.scaleId));
    const missingScaleIds = [...referencedScaleIds].filter((id) => !scaleIds.has(id));
    const unusedScaleIds = [...scaleIds].filter((id) => !referencedScaleIds.has(id));

    const grantsItemsPack = grantedUuids.some((u) => u.includes(".items."));
    const grantsWeapon = grantedUuids.some((u) => u.includes(".items.")); // items pack includes weapons/gear/etc

    report.classes.push({
      identifier: classIdentifier,
      name: cls.name,
      scale: {
        defined: [...scaleIds].sort(),
        referenced: [...referencedScaleIds].sort(),
        missing: missingScaleIds.sort(),
        unused: unusedScaleIds.sort(),
        references: scaleRefs
          .filter((r) => missingScaleIds.includes(r.scaleId) || unusedScaleIds.includes(r.scaleId))
          .slice(0, 30),
      },
      itemGrants: {
        count: grantedUuids.length,
        grantsItemsPack,
        grantsWeapon,
      },
      notes: [],
    });
  }

  // Targeted heuristic checks (start small / high-signal)
  const brawler = byClassIdentifier("brawler");
  if (brawler) {
    const entry = report.classes.find((c: any) => c.identifier === "brawler");
    if (entry?.scale?.unused?.includes("brawling-die")) {
      entry.notes.push(
        "brawling-die scale is defined but (outside subclasses) never referenced in any formulas; base Unarmed Strike remains 1d4 unless a weapon/effect wires it up."
      );
    }
    if (!entry?.itemGrants?.grantsItemsPack) {
      entry.notes.push(
        "No items-pack grants found for Brawler; if the system doesn't auto-provide an Unarmed Strike weapon on PCs, Brawler may lack an attack entry entirely."
      );
    }
  }

  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}

main();

