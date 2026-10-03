import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../../Sourcebook/Chapter 4 Equipment and Items/Mounts and Vehicles");
const read = (f: string) => readFileSync(join(DIR, f), "utf8").split(/\r?\n/);

/** Lines of a "##### Title" table section, up to the next heading or page marker. */
const section = (lines: string[], title: string) => {
  const i = lines.findIndex((l) => l.startsWith("#####") && l.includes(title));
  if (i < 0) throw new Error(`table not found: ${title}`);
  const rest = lines.slice(i + 1);
  const end = rest.findIndex((l) => l.startsWith("#####") || l.startsWith("<!--"));
  return (end < 0 ? rest : rest.slice(0, end)).map((l) => l.trim()).filter(Boolean);
};

export const beri = (s: string) => {
  const m = s.trim().match(/^([\d\s]+?)\s*(Million)?$/i);
  if (!m) throw new Error(`bad cost: ${s}`);
  return Number(m[1].replace(/\s/g, "")) * (m[2] ? 1_000_000 : 1);
};

const COST = String.raw`(\d[\d\s]*?(?:\s*Million)?)`;
const frac = (s: string) => {
  if (s === "─" || s === "-") return null;
  if (s.includes("½")) return parseFloat(s) + 0.5;
  const f = s.match(/^(\d+)\/(\d+)$/);
  return f ? Number(f[1]) / Number(f[2]) : Number(s);
};

export interface ShipRow {
  name: string; cost: number; mph: number; crew: number; passengers: number; cargoTons: number | null;
  slots: Record<string, number>; ac: number; hp: number; threshold: number | null;
}

export function parseShips(): ShipRow[] {
  const rows = section(read("Ships and Waterborne Vessels.md"), "Waterborne Vehicles").slice(1).map((l) => {
    const m = l.match(new RegExp(String.raw`^(\S+)\s+${COST}\s+([\d½.]+)\s*mph\s+(\d+)\s+(\d+)\s+(\S+)$`));
    if (!m) throw new Error(`bad ship row: ${l}`);
    return { name: m[1], cost: beri(m[2]), mph: frac(m[3])!, crew: +m[4], passengers: +m[5], cargoTons: frac(m[6]) };
  });
  // The AC/HP/slots table has no names (PDF split); rows align with the ship table by order. Flagged NEEDS_REVIEW in ship flags.
  const cannons = read("Cannons.md");
  const i = cannons.findIndex((l) => l.startsWith("Cannon Slots AC HP Damage Threshold"));
  const stats = cannons.slice(i + 1, i + 1 + rows.length).map((l) => {
    const m = l.trim().match(/^(.*?)\s+(\d+)\s+(\d+)\s+(\d+|─)$/);
    if (!m) throw new Error(`bad ship stat row: ${l}`);
    const slots: Record<string, number> = {};
    for (const s of m[1].matchAll(/(Bow|Port|Star|Stern)\s+(\d+)/g)) slots[s[1].toLowerCase()] = +s[2];
    return { slots, ac: +m[2], hp: +m[3], threshold: m[4] === "─" ? null : +m[4] };
  });
  if (stats.length !== rows.length) throw new Error("ship/stat row count mismatch");
  return rows.map((r, k) => ({ ...r, ...stats[k] }));
}

export interface CannonRow { name: string; dice: number; sides: number; cost: number; range: number; long: number; siege: boolean }

export function parseCannons(): CannonRow[] {
  return section(read("Ships and Waterborne Vessels.md"), "Cannons").slice(1).map((l) => {
    const m = l.match(new RegExp(String.raw`^(.+?)\s+(\d+)d(\d+)\s+${COST}\s+(\d+)\/(\d+)\s+(Yes|No)$`));
    if (!m) throw new Error(`bad cannon row: ${l}`);
    return { name: m[1], dice: +m[2], sides: +m[3], cost: beri(m[4]), range: +m[5], long: +m[6], siege: m[7] === "Yes" };
  });
}

export interface Availability { reload: string; ships: string[] | "all" }

/** "Clean and Reload / Ship Availability" table: rows align with the cannon table order (no names in the source table). */
export function parseAvailability(shipNames: string[]): Availability[] {
  const cannons = read("Cannons.md");
  const i = cannons.findIndex((l) => l.startsWith("Clean and Reload Ship Availability"));
  return cannons.slice(i + 1, i + 9).map((l) => {
    const m = l.trim().match(/^(1 Bonus Action|\d+ Actions?)\s+(.+)$/);
    if (!m) throw new Error(`bad availability row: ${l}`);
    const where = m[2];
    if (/^All Ships$/i.test(where)) return { reload: m[1], ships: "all" as const };
    return { reload: m[1], ships: shipNames.filter((n) => new RegExp(String.raw`\b${n}\b`).test(where)) };
  });
}
