export const ROLE_NAME_PREFIX = "Role: ";

/** Compendium index entry or item document shape. */
export function isRoleEntry(entry) {
  if (entry?.flags?.op5e?.shipRole === true) return true;
  return entry?.type === "feat" && String(entry.name ?? "").startsWith(ROLE_NAME_PREFIX);
}

export function isBackgroundEntry(entry) {
  return entry?.type === "background" && !isRoleEntry(entry);
}
