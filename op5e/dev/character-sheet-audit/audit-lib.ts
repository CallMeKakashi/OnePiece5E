import classes from "../../data/src/classes/index.ts";
import subclasses from "../../data/src/subclasses/index.ts";
import classFeatures from "../../data/src/class-features/index.ts";
import backgrounds from "../../data/src/backgrounds/index.ts";
import items from "../../data/src/items/index.ts";
import { compendiumUuid } from "../../data/helpers/uuid.ts";
import {
  type IssuePhase,
  classifyFeaturePhase,
  isFalsePositiveActivation,
  isFalsePositiveUses,
  phaseSeverity,
  PHASE2B_STATUS,
  INFORMATIONAL_SCALES,
} from "./phase-rules.js";

export const AUDIT_LEVELS = [1, 5, 10, 15, 20] as const;
export type AuditLevel = (typeof AUDIT_LEVELS)[number];

export type AnyDoc = Record<string, unknown> & {
  _id?: string;
  name?: string;
  type?: string;
  system?: Record<string, unknown>;
  effects?: unknown[];
};

export interface GrantEntry {
  uuid: string;
  level: number;
  source: "class" | "subclass" | "background" | "role" | "additional-power";
  sourceName: string;
  optional?: boolean;
}

export interface AutomationIssue {
  code: string;
  severity: "error" | "warn" | "info";
  phase: IssuePhase;
  feature: string;
  level: number;
  message: string;
  fixHint?: string;
  sourceFile?: string;
}

export interface BuildAuditResult {
  buildId: string;
  pass: boolean;
  levels: Record<
    number,
    {
      pass: boolean;
      expectedItemCount: number;
      brokenUuids: string[];
      issues: AutomationIssue[];
    }
  >;
  summary: {
    errors: number;
    warnings: number;
    textOnlyCount: number;
  };
}

export interface MasterGap {
  priority: number;
  phase: IssuePhase;
  buildId: string;
  feature: string;
  level: number;
  code: string;
  message: string;
  fixHint?: string;
}

export interface AuditReport {
  generatedAt: string;
  mode: "static-data-audit";
  note: string;
  builds: BuildAuditResult[];
  masterGaps: MasterGap[];
  classScaleSummary: Record<
    string,
    { missing: string[]; unused: string[] }
  >;
  phase2Backlog: MasterGap[];
  phase2bStatus: Record<
    string,
    { status: "wired" | "partial" | "deferred"; wiring?: string; reason?: string }
  >;
  stats: {
    buildsPassed: number;
    buildsFailed: number;
    totalErrors: number;
    totalWarnings: number;
    phase1Errors: number;
    phase1Warnings: number;
    phase2Count: number;
    phase2bWired: number;
    phase2bPartial: number;
    phase2bDeferred: number;
    narrativeCount: number;
    casterProgressionCount: number;
  };
}

const UUID_RE = /^Compendium\.op5e\.([^.]+)\.([a-f0-9]+)$/i;

export function parseUuid(uuid: string): { pack: string; id: string } | null {
  const m = UUID_RE.exec(uuid);
  if (!m) return null;
  return { pack: m[1], id: m[2] };
}

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

export function extractScaleRefs(doc: AnyDoc): { classIdentifier: string; scaleId: string }[] {
  const strings: { path: string; value: string }[] = [];
  walkStrings(doc, "", strings);
  const refs: { classIdentifier: string; scaleId: string }[] = [];
  const re = /@scale\.([a-z0-9_-]+)\.([a-z0-9_-]+)/gi;
  for (const s of strings) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(s.value))) {
      refs.push({ classIdentifier: m[1].toLowerCase(), scaleId: m[2] });
    }
  }
  return refs;
}

export interface CompendiumIndex {
  byUuid: Map<string, AnyDoc>;
  byId: Map<string, AnyDoc>;
  classes: AnyDoc[];
  subclasses: AnyDoc[];
  features: AnyDoc[];
  backgrounds: AnyDoc[];
  items: AnyDoc[];
}

export function buildCompendiumIndex(): CompendiumIndex {
  const byUuid = new Map<string, AnyDoc>();
  const byId = new Map<string, AnyDoc>();

  const register = (pack: string, docs: AnyDoc[]) => {
    for (const doc of docs) {
      if (!doc?._id) continue;
      byId.set(`${pack}:${doc._id}`, doc);
      byUuid.set(compendiumUuid(pack as Parameters<typeof compendiumUuid>[0], doc._id), doc);
    }
  };

  register("classes", classes as AnyDoc[]);
  register("subclasses", subclasses as AnyDoc[]);
  register("class-features", classFeatures as AnyDoc[]);
  register("backgrounds", backgrounds as AnyDoc[]);
  register("items", items as AnyDoc[]);

  return {
    byUuid,
    byId,
    classes: classes as AnyDoc[],
    subclasses: subclasses as AnyDoc[],
    features: classFeatures as AnyDoc[],
    backgrounds: backgrounds as AnyDoc[],
    items: items as AnyDoc[],
  };
}

function getAdvancements(doc: AnyDoc): AnyDoc[] {
  const adv = doc.system?.advancement;
  return Array.isArray(adv) ? (adv as AnyDoc[]) : [];
}

export function collectItemGrants(
  doc: AnyDoc,
  source: GrantEntry["source"],
  sourceName: string,
  maxLevel: number,
  minLevel = 0,
): GrantEntry[] {
  const out: GrantEntry[] = [];
  for (const adv of getAdvancements(doc)) {
    if (adv.type !== "ItemGrant") continue;
    const level = Number(adv.level ?? 0);
    if (level < minLevel || level > maxLevel) continue;
    const items = (adv.configuration as AnyDoc)?.items;
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      const uuid = it?.uuid;
      if (typeof uuid !== "string" || !uuid) continue;
      out.push({
        uuid,
        level,
        source,
        sourceName,
        optional: Boolean(it.optional),
      });
    }
  }
  return out;
}

export function findClass(identifier: string, index: CompendiumIndex): AnyDoc | undefined {
  return index.classes.find(
    (c) => String(c.system?.identifier ?? "").toLowerCase() === identifier.toLowerCase(),
  );
}

export function findSubclass(
  classIdentifier: string,
  subclassIdentifier: string,
  index: CompendiumIndex,
): AnyDoc | undefined {
  return index.subclasses.find((s) => {
    const cls = String(s.system?.classIdentifier ?? "").toLowerCase();
    const id = String(s.system?.identifier ?? "").toLowerCase();
    return cls === classIdentifier.toLowerCase() && id === subclassIdentifier.toLowerCase();
  });
}

export function findBackground(slug: string, index: CompendiumIndex): AnyDoc | undefined {
  return index.backgrounds.find((b) => {
    const name = String(b.name ?? "");
    if (name === slug) return true;
    return name.toLowerCase() === slug.toLowerCase();
  });
}

export function findRole(slug: string, index: CompendiumIndex): AnyDoc | undefined {
  const normalized = slug.toLowerCase().replace(/^role:\s*/, "");
  return index.backgrounds.find((b) => {
    if (b.flags?.op5e?.shipRole === true) {
      const name = String(b.name ?? "").replace(/^role:\s*/i, "").toLowerCase();
      return name === normalized || name.replace(/\s+/g, "-") === normalized;
    }
    const name = String(b.name ?? "");
    if (!/^role:/i.test(name)) return false;
    const roleName = name.replace(/^role:\s*/i, "").toLowerCase();
    return roleName === normalized || roleName.replace(/\s+/g, "-") === normalized;
  });
}

function normalizePowerLabel(value: string): string {
  return value.toLowerCase().replace(/,/g, "").replace(/\s+/g, " ").trim();
}

export function findAdditionalPower(slug: string, index: CompendiumIndex): AnyDoc[] {
  const slugLabel = normalizePowerLabel(slug.replace(/-/g, " "));
  return index.features.filter((f) => {
    const reqs = String(f.system?.requirements ?? "");
    const name = String(f.name ?? "");
    if (normalizePowerLabel(name) === slugLabel) return true;
    if (normalizePowerLabel(reqs) === slugLabel) return true;
    if (reqs.toLowerCase().includes(slug.replace(/-/g, " "))) return true;
    return false;
  });
}

export function getSubclassLevel(classDoc: AnyDoc): number {
  for (const adv of getAdvancements(classDoc)) {
    if (adv.type === "Subclass") return Number(adv.level ?? 3);
  }
  return 3;
}

function classScaleIds(classDoc: AnyDoc): Set<string> {
  const out = new Set<string>();
  for (const adv of getAdvancements(classDoc)) {
    if (adv.type !== "ScaleValue") continue;
    const id = (adv.configuration as AnyDoc)?.identifier;
    if (typeof id === "string" && id) out.add(id);
  }
  return out;
}

function hasAutomation(doc: AnyDoc): boolean {
  const sys = doc.system ?? {};
  const activation = sys.activation as AnyDoc | undefined;
  const uses = sys.uses as AnyDoc | undefined;
  const damage = sys.damage as AnyDoc | undefined;
  const save = sys.save as AnyDoc | undefined;
  const effects = doc.effects;

  if (activation?.type) return true;
  if (uses?.max) return true;
  if (Array.isArray(effects) && effects.length > 0) return true;
  if (Array.isArray(damage?.parts) && damage!.parts.length > 0) return true;
  if (save?.ability) return true;
  if (sys.actionType) return true;
  if (doc.type === "weapon") {
    return Boolean(sys.actionType || (Array.isArray(damage?.parts) && damage!.parts.length > 0));
  }
  if (doc.type === "spell") return true;
  return false;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function issue(
  partial: Omit<AutomationIssue, "phase" | "severity"> & { severity?: AutomationIssue["severity"] },
  classIdentifier: string,
): AutomationIssue {
  const classified = classifyFeaturePhase(partial.feature, classIdentifier);
  const phase: IssuePhase =
    classified ??
    (partial.code === "passive-needs-effect"
      ? "phase2"
      : partial.code === "scale-missing" ||
          partial.code === "broken-uuid" ||
          partial.code === "weapon-incomplete" ||
          partial.code === "missing-weapon-grant"
        ? "phase1"
        : "phase1");
  const severity =
    partial.severity ??
    (phase === "phase1" ? (partial.code === "text-only" ? "warn" : partial.code.startsWith("needs-") ? "warn" : "error") : phaseSeverity(phase));
  return { ...partial, phase, severity };
}

function countByPhase(issues: AutomationIssue[], phase: IssuePhase, sev?: "error" | "warn"): number {
  return issues.filter((i) => i.phase === phase && (!sev || i.severity === sev)).length;
}

export function analyzeItemAutomation(
  doc: AnyDoc,
  context: { classIdentifier: string; level: number; classDoc: AnyDoc },
): AutomationIssue[] {
  const issues: AutomationIssue[] = [];
  const name = String(doc.name ?? doc._id ?? "unknown");
  const sys = doc.system ?? {};
  const desc = stripHtml(String((sys.description as AnyDoc)?.value ?? ""));
  const activation = sys.activation as AnyDoc | undefined;
  const uses = sys.uses as AnyDoc | undefined;
  const classified = classifyFeaturePhase(name, context.classIdentifier);

  if (!hasAutomation(doc)) {
    const mundaneTypes = new Set(["consumable", "equipment", "loot", "tool", "container"]);
    if (mundaneTypes.has(String(doc.type ?? ""))) {
      return issues;
    }
    const reqs = String(sys.requirements ?? "");
    const isDeftExplorerChoice =
      name === "Deft Explorer" && /\b(?:Marksman|marksman)\s+(?:6|10)\b/i.test(reqs);
    if (!classified && !isDeftExplorerChoice) {
      issues.push(
        issue(
          {
            code: "text-only",
            feature: name,
            level: context.level,
            message: "Feature has no activation, uses, effects, damage, save, or weapon attack wiring.",
            fixHint: "Add DAE effects, uses.max, activation, or damage.parts as appropriate.",
          },
          context.classIdentifier,
        ),
      );
    }
  }

  const scaleRefs = extractScaleRefs(doc).filter((r) => r.classIdentifier === context.classIdentifier);
  const definedScales = classScaleIds(context.classDoc);
  for (const ref of scaleRefs) {
    if (!definedScales.has(ref.scaleId)) {
      issues.push(
        issue(
          {
            code: "scale-missing",
            feature: name,
            level: context.level,
            message: `References @scale.${ref.classIdentifier}.${ref.scaleId} but class lacks ScaleValue.`,
            fixHint: `Add createScaleValue for "${ref.scaleId}" in data/src/classes/${context.classIdentifier}.ts`,
          },
          context.classIdentifier,
        ),
      );
    }
  }

  if (
    !isFalsePositiveActivation(desc, name) &&
    /\bbonus action\b/i.test(desc) &&
    !activation?.type
  ) {
    issues.push(
      issue(
        {
          code: "needs-activation",
          feature: name,
          level: context.level,
          message: "Description mentions bonus action but activation.type is empty.",
          fixHint: "Set system.activation.type to 'bonus'.",
        },
        context.classIdentifier,
      ),
    );
  } else if (
    !isFalsePositiveActivation(desc, name) &&
    /\bas an action\b|\baction on your turn\b/i.test(desc) &&
    !/\bAttack action\b/i.test(desc) &&
    !activation?.type
  ) {
    issues.push(
      issue(
        {
          code: "needs-activation",
          feature: name,
          level: context.level,
          message: "Description mentions action activation but activation.type is empty.",
          fixHint: "Set system.activation.type to 'action'.",
        },
        context.classIdentifier,
      ),
    );
  } else if (
    !isFalsePositiveActivation(desc, name) &&
    /\bas a reaction\b|\breaction when\b/i.test(desc) &&
    !activation?.type &&
    name !== "Danger Sense"
  ) {
    issues.push(
      issue(
        {
          code: "needs-activation",
          feature: name,
          level: context.level,
          message: "Description mentions reaction but activation.type is empty.",
          fixHint: "Set system.activation.type to 'reaction'.",
        },
        context.classIdentifier,
      ),
    );
  }

  if (
    !uses?.max &&
    !isFalsePositiveUses(desc, name) &&
    /\b(number of times|uses per|per long rest|per short rest|pool of|expend a use)\b/i.test(desc)
  ) {
    issues.push(
      issue(
        {
          code: "needs-uses",
          feature: name,
          level: context.level,
          message: "Description implies limited uses but uses.max is empty.",
          fixHint: "Wire uses.max to @scale or formula (e.g. @prof, @abilities.cha.mod).",
        },
        context.classIdentifier,
      ),
    );
  }

  if (doc.type === "weapon") {
    const damage = sys.damage as AnyDoc | undefined;
    const parts = damage?.parts;
    if (!sys.actionType || !Array.isArray(parts) || parts.length === 0) {
      issues.push(
        issue(
          {
            code: "weapon-incomplete",
            feature: name,
            level: context.level,
            message: "Weapon missing actionType or damage parts.",
            fixHint: "Ensure weapon has actionType and damage.parts in data/src/items/weapons.ts",
          },
          context.classIdentifier,
        ),
      );
    }
  }

  if (
    /\bAC equals\b|\bproficiency bonus is doubled\b|\badd half your proficiency\b/i.test(desc) &&
    (!Array.isArray(doc.effects) || doc.effects.length === 0) &&
    name !== "Expertise"
  ) {
    issues.push(
      issue(
        {
          code: "passive-needs-effect",
          feature: name,
          level: context.level,
          message: "Passive mechanical rule likely needs an Active Effect (DAE).",
          fixHint: "Add createDAEEffect in the feature definition.",
        },
        context.classIdentifier,
      ),
    );
  }

  return issues;
}

export interface TestBuild {
  id: string;
  label: string;
  classIdentifier: string;
  subclassIdentifier?: string;
  backgroundSlug?: string;
  roleSlug?: string;
  additionalPowerSlug?: string;
  style?: "player" | "npc";
}

export function collectExpectedGrants(
  build: TestBuild,
  maxLevel: number,
  index: CompendiumIndex,
): { grants: GrantEntry[]; brokenUuids: string[]; unresolved: string[] } {
  const grants: GrantEntry[] = [];
  const brokenUuids: string[] = [];

  const classDoc = findClass(build.classIdentifier, index);
  if (!classDoc) {
    brokenUuids.push(`class:${build.classIdentifier}`);
    return { grants, brokenUuids, unresolved: [`Class not found: ${build.classIdentifier}`] };
  }

  grants.push(...collectItemGrants(classDoc, "class", String(classDoc.name), maxLevel));

  const subclassLevel = getSubclassLevel(classDoc);
  if (build.subclassIdentifier && maxLevel >= subclassLevel) {
    const sub = findSubclass(build.classIdentifier, build.subclassIdentifier, index);
    if (sub) {
      grants.push(...collectItemGrants(sub, "subclass", String(sub.name), maxLevel, subclassLevel));
    } else {
      brokenUuids.push(`subclass:${build.classIdentifier}/${build.subclassIdentifier}`);
    }
  }

  if (build.backgroundSlug) {
    const bg = findBackground(build.backgroundSlug, index);
    if (bg) grants.push(...collectItemGrants(bg, "background", String(bg.name), maxLevel));
  }

  if (build.roleSlug) {
    const role = findRole(build.roleSlug, index);
    if (role) grants.push(...collectItemGrants(role, "role", String(role.name), maxLevel));
  }

  if (build.additionalPowerSlug) {
    const powerFeats = findAdditionalPower(build.additionalPowerSlug, index);
    for (const feat of powerFeats) {
      grants.push({
        uuid: compendiumUuid("class-features", feat._id!),
        level: 1,
        source: "additional-power",
        sourceName: String(feat.name),
      });
    }
  }

  for (const g of grants) {
    if (!index.byUuid.has(g.uuid)) brokenUuids.push(g.uuid);
  }

  return { grants, brokenUuids, unresolved: [] };
}

export function auditBuild(
  build: TestBuild,
  index: CompendiumIndex,
  levels: readonly number[] = AUDIT_LEVELS,
): BuildAuditResult {
  const classDoc = findClass(build.classIdentifier, index)!;
  const levelResults: BuildAuditResult["levels"] = {};
  let totalErrors = 0;
  let totalWarnings = 0;
  let textOnlyCount = 0;

  for (const lvl of levels) {
    const { grants, brokenUuids } = collectExpectedGrants(build, lvl, index);
    const issues: AutomationIssue[] = [];

    if (brokenUuids.length) {
      for (const u of brokenUuids) {
        issues.push(
          issue(
            {
              code: "broken-uuid",
              feature: u,
              level: lvl,
              message: `Grant references missing compendium document: ${u}`,
              fixHint: "Verify UUID resolves in compendium data or add missing item/feature.",
            },
            build.classIdentifier,
          ),
        );
      }
    }

    const seen = new Set<string>();
    for (const grant of grants) {
      if (seen.has(grant.uuid)) continue;
      seen.add(grant.uuid);
      const doc = index.byUuid.get(grant.uuid);
      if (!doc) continue;
      const itemIssues = analyzeItemAutomation(doc, {
        classIdentifier: build.classIdentifier,
        level: grant.level,
        classDoc,
      });
      issues.push(...itemIssues);
    }

    // Brawler-specific: must have unarmed strike weapon at level 1+
    if (build.classIdentifier === "brawler" && lvl >= 1) {
      const hasUnarmed = grants.some((g) => {
        const doc = index.byUuid.get(g.uuid);
        return doc?.type === "weapon" && String(doc.name).toLowerCase().includes("unarmed");
      });
      if (!hasUnarmed) {
        issues.push(
          issue(
            {
              code: "missing-weapon-grant",
              feature: "Brawler Unarmed Strike",
              level: 1,
              message: "Brawler should grant Brawler Unarmed Strike weapon at level 1.",
              fixHint: "Add item grant in data/src/classes/brawler.ts (items/weapons/brawler-unarmed-strike).",
            },
            build.classIdentifier,
          ),
        );
      }
    }

    const phase1Errors = countByPhase(issues, "phase1", "error");
    const phase1Warnings = countByPhase(issues, "phase1", "warn");
    const errors = issues.filter((i) => i.phase === "phase1" && i.severity === "error").length;
    const warnings = issues.filter((i) => i.phase === "phase1" && i.severity === "warn").length;
    textOnlyCount += issues.filter((i) => i.code === "text-only" && i.phase === "phase1").length;
    totalErrors += phase1Errors;
    totalWarnings += phase1Warnings;

    levelResults[lvl] = {
      pass: phase1Errors === 0,
      expectedItemCount: seen.size,
      brokenUuids,
      issues,
    };
  }

  return {
    buildId: build.id,
    pass: Object.values(levelResults).every((l) => l.pass),
    levels: levelResults,
    summary: {
      errors: totalErrors,
      warnings: totalWarnings,
      textOnlyCount,
    },
  };
}

export function auditClassScales(index: CompendiumIndex): Record<string, { missing: string[]; unused: string[] }> {
  const out: Record<string, { missing: string[]; unused: string[] }> = {};

  for (const cls of index.classes) {
    const id = String(cls.system?.identifier ?? "");
    const scaleIds = classScaleIds(cls);
    const className = String(cls.name ?? "");

    const relatedFeatures = index.features.filter((f) => {
      const req = String(f.system?.requirements ?? "");
      return req.toLowerCase().startsWith(className.toLowerCase());
    });

    const relatedSubs = index.subclasses.filter(
      (s) => String(s.system?.classIdentifier ?? "").toLowerCase() === id.toLowerCase(),
    );

    const refs = [
      ...relatedFeatures.flatMap(extractScaleRefs),
      ...relatedSubs.flatMap(extractScaleRefs),
    ].filter((r) => r.classIdentifier === id.toLowerCase());

    const referenced = new Set(refs.map((r) => r.scaleId));
    out[id] = {
      missing: [...referenced].filter((s) => !scaleIds.has(s)).sort(),
      unused: [...scaleIds].filter((s) => !referenced.has(s) && !INFORMATIONAL_SCALES.has(s)).sort(),
    };
  }

  return out;
}

function gapPriority(code: string, phase: IssuePhase): number {
  if (phase !== "phase1") return 5;
  switch (code) {
    case "broken-uuid":
    case "scale-missing":
    case "missing-weapon-grant":
    case "weapon-incomplete":
      return 1;
    case "needs-activation":
    case "needs-uses":
      return 2;
    case "text-only":
      return 3;
    default:
      return 4;
  }
}

export function buildMasterGaps(buildResults: BuildAuditResult[]): MasterGap[] {
  const gaps: MasterGap[] = [];
  const seen = new Set<string>();

  for (const build of buildResults) {
    for (const [lvlStr, levelData] of Object.entries(build.levels)) {
      const lvl = Number(lvlStr);
      for (const issue of levelData.issues) {
        const key = `${issue.phase}|${issue.code}|${issue.feature}|${lvl}|${issue.message}`;
        if (seen.has(key)) continue;
        seen.add(key);
        gaps.push({
          priority: gapPriority(issue.code, issue.phase),
          phase: issue.phase,
          buildId: build.buildId,
          feature: issue.feature,
          level: lvl,
          code: issue.code,
          message: issue.message,
          fixHint: issue.fixHint,
        });
      }
    }
  }

  gaps.sort((a, b) => a.priority - b.priority || a.feature.localeCompare(b.feature));
  return gaps;
}

export function buildPhase2Backlog(gaps: MasterGap[]): MasterGap[] {
  return gaps.filter(
    (g) =>
      (g.phase === "phase2" || g.code === "passive-needs-effect") &&
      g.feature !== "Expertise" &&
      !(g.feature in PHASE2B_STATUS && PHASE2B_STATUS[g.feature].status !== "partial"),
  );
}

export function buildPhase2bStatus(): AuditReport["phase2bStatus"] {
  return { ...PHASE2B_STATUS };
}

export function runFullAudit(builds: TestBuild[]): AuditReport {
  const index = buildCompendiumIndex();
  const buildResults = builds.map((b) => auditBuild(b, index));
  const masterGaps = buildMasterGaps(buildResults);
  const phase2Backlog = buildPhase2Backlog(masterGaps);
  const phase2bStatus = buildPhase2bStatus();
  const classScaleSummary = auditClassScales(index);

  const allIssues = buildResults.flatMap((b) => Object.values(b.levels).flatMap((l) => l.issues));
  const phase1Errors = allIssues.filter((i) => i.phase === "phase1" && i.severity === "error").length;
  const phase1Warnings = allIssues.filter((i) => i.phase === "phase1" && i.severity === "warn").length;
  const phase2bWired = Object.values(phase2bStatus).filter((s) => s.status === "wired").length;
  const phase2bPartial = Object.values(phase2bStatus).filter((s) => s.status === "partial").length;
  const phase2bDeferred = Object.values(phase2bStatus).filter((s) => s.status === "deferred").length;

  return {
    generatedAt: new Date().toISOString(),
    mode: "static-data-audit",
    note:
      "Phase 1 bar: ItemGrants, @scale, uses.max, granted weapons, attack activities. " +
      "Phase 2 backlog: DAE passives (Unarmored Defense, Expertise, etc.). " +
      "Phase 2b: tracked passive checklist (phase2bStatus). " +
      "Does not execute Foundry AdvancementManager.",
    builds: buildResults,
    masterGaps,
    phase2Backlog,
    phase2bStatus,
    classScaleSummary,
    stats: {
      buildsPassed: buildResults.filter((b) => b.pass).length,
      buildsFailed: buildResults.filter((b) => !b.pass).length,
      totalErrors: phase1Errors,
      totalWarnings: phase1Warnings,
      phase1Errors,
      phase1Warnings,
      phase2Count: allIssues.filter((i) => i.phase === "phase2").length,
      phase2bWired,
      phase2bPartial,
      phase2bDeferred,
      narrativeCount: allIssues.filter((i) => i.phase === "narrative").length,
      casterProgressionCount: allIssues.filter((i) => i.phase === "caster-progression").length,
    },
  };
}
