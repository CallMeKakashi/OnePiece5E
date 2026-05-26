import { createHash } from "node:crypto";

const ID_LENGTH = 16;

/**
 * Generate a deterministic 16-character hex ID from a content path.
 * The same path always produces the same ID, so cross-pack UUID
 * references stay stable across rebuilds.
 *
 * @example generateId("fighter/second-wind") // "a3f1…" (16 hex chars)
 */
export function generateId(contentPath: string): string {
  const hash = createHash("sha256")
    .update(`op5e:${contentPath}`)
    .digest("hex");
  return hash.substring(0, ID_LENGTH);
}
