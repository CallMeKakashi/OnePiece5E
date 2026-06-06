import yaml from "js-yaml"

const ABILITY_LABELS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const

type StatEntry = {
  name?: string
  desc?: string
  [key: string]: unknown
}

export type StatblockData = {
  name?: string
  size?: string
  type?: string
  subtype?: string
  alignment?: string
  ac?: string | number
  hp?: string | number
  speed?: string
  stats?: Array<string | number>
  cr?: string | number
  saves?: string[] | Record<string, string | number>
  skills?: string[] | Record<string, string | number>
  damage_vulnerabilities?: string
  damage_resistances?: string
  damage_immunities?: string
  condition_immunities?: string
  senses?: string
  languages?: string
  passive?: string | number
  traits?: StatEntry[]
  actions?: StatEntry[]
  bonus_actions?: StatEntry[]
  reactions?: StatEntry[]
  legendary_actions?: StatEntry[]
  [key: string]: unknown
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ")
}

function abilityModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function asString(value: unknown): string | undefined {
  if (value == null) return undefined
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return undefined
}

function formatList(value: string[] | Record<string, string | number> | undefined): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) {
    return value.map((entry) => entry.trim()).filter(Boolean).join(", ")
  }
  return Object.entries(value)
    .map(([key, raw]) => `${titleCase(key)} ${raw}`)
    .join(", ")
}

function formatSubtitle(data: StatblockData): string {
  const size = data.size ? titleCase(asString(data.size) ?? "") : ""
  const type = asString(data.type) ?? ""
  const subtype = asString(data.subtype)
  const creatureType = subtype ? `${type} (${subtype})` : type
  const alignment = asString(data.alignment) ?? ""
  const sizeAndType = [size, creatureType].filter(Boolean).join(" ")
  return [sizeAndType, alignment].filter(Boolean).join(", ")
}

function formatSenses(data: StatblockData): string | undefined {
  const parts: string[] = []
  if (data.senses) parts.push(asString(data.senses)!)
  if (data.passive != null) parts.push(`passive Perception ${data.passive}`)
  return parts.length ? parts.join(", ") : undefined
}

function formatEntryExtras(entry: StatEntry): string {
  const extras = Object.entries(entry)
    .filter(([key]) => key !== "name" && key !== "desc" && !key.startsWith("_"))
    .map(([key, value]) => `${titleCase(key.replaceAll("_", " "))}: ${asString(value) ?? value}`)
  const underscoreExtras = Object.entries(entry)
    .filter(([key]) => key.startsWith("_") && key !== "_")
    .map(([key, value]) => {
      const label = key.slice(1).replaceAll("_", " ")
      return `${titleCase(label)}: ${asString(value) ?? value}`
    })
  return [...extras, ...underscoreExtras].join("<br>")
}

function renderProperty(label: string, value: string): string {
  return `<div class="statblock-property"><strong>${escapeHtml(label)}</strong> ${escapeHtml(value)}</div>`
}

function renderAbilityTable(stats: Array<string | number>): string {
  const scores = stats.slice(0, 6).map((score) => Number(score))
  const cells = scores
    .map((score, index) => {
      const safeScore = Number.isFinite(score) ? score : 10
      return `<th>${ABILITY_LABELS[index]}</th>`
    })
    .join("")
  const values = scores
    .map((score) => {
      const safeScore = Number.isFinite(score) ? score : 10
      return `<td>${safeScore} (${abilityModifier(safeScore)})</td>`
    })
    .join("")
  return `<table class="statblock-abilities"><thead><tr>${cells}</tr></thead><tbody><tr>${values}</tr></tbody></table>`
}

function renderSection(title: string, entries: StatEntry[] | undefined): string {
  if (!entries?.length) return ""
  const blocks = entries
    .map((entry) => {
      const name = asString(entry.name) ?? "Feature"
      const desc = asString(entry.desc) ?? ""
      const extras = formatEntryExtras(entry)
      const body = [desc, extras].filter(Boolean).join(extras ? "<br>" : "")
      return `<div class="statblock-feature"><strong>${escapeHtml(name)}.</strong> ${body}</div>`
    })
    .join("")
  return `<section class="statblock-section"><h4>${escapeHtml(title)}</h4>${blocks}</section>`
}

export function renderStatblockHtml(raw: string): string {
  const data = yaml.load(raw) as StatblockData
  if (!data || typeof data !== "object") {
    throw new Error("statblock YAML must be an object")
  }

  const name = asString(data.name) ?? "Creature"
  const subtitle = formatSubtitle(data)
  const properties = [
    data.ac != null ? renderProperty("Armor Class", asString(data.ac) ?? String(data.ac)) : "",
    data.hp != null ? renderProperty("Hit Points", asString(data.hp) ?? String(data.hp)) : "",
    data.speed ? renderProperty("Speed", data.speed) : "",
    data.damage_vulnerabilities
      ? renderProperty("Damage Vulnerabilities", data.damage_vulnerabilities)
      : "",
    data.damage_resistances ? renderProperty("Damage Resistances", data.damage_resistances) : "",
    data.damage_immunities ? renderProperty("Damage Immunities", data.damage_immunities) : "",
    data.condition_immunities
      ? renderProperty("Condition Immunities", data.condition_immunities)
      : "",
    formatSenses(data) ? renderProperty("Senses", formatSenses(data)!) : "",
    data.languages ? renderProperty("Languages", data.languages) : "",
    formatList(data.saves) ? renderProperty("Saving Throws", formatList(data.saves)!) : "",
    formatList(data.skills) ? renderProperty("Skills", formatList(data.skills)!) : "",
    data.cr != null ? renderProperty("Challenge", asString(data.cr) ?? String(data.cr)) : "",
  ].filter(Boolean)

  const statsTable = Array.isArray(data.stats) ? renderAbilityTable(data.stats) : ""

  const sections = [
    renderSection("Traits", data.traits),
    renderSection("Actions", data.actions),
    renderSection("Bonus Actions", data.bonus_actions),
    renderSection("Reactions", data.reactions),
    renderSection("Legendary Actions", data.legendary_actions),
  ].filter(Boolean)

  return `<div class="statblock op5e-statblock">
  <header class="statblock-header">
    <h3 class="statblock-name">${escapeHtml(name)}</h3>
    ${subtitle ? `<p class="statblock-subtitle">${escapeHtml(subtitle)}</p>` : ""}
  </header>
  <div class="statblock-top">
    ${properties.join("")}
    ${statsTable}
  </div>
  ${sections.join("")}
</div>`
}
