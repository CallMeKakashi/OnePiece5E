import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mdToHtml } from "./markdown.js";

const VAULT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

/** Feature description straight from a vault Sourcebook note (frontmatter, "### Title" heading and page markers dropped). */
export function sourcebookHtml(relPath: string): string {
  const raw = readFileSync(join(VAULT, "Sourcebook", relPath), "utf8");
  const body = raw.replace(/^---[\s\S]*?---\s*/, "").replace(/^###\s+.*\r?\n/, "").replace(/<!--[\s\S]*?-->/g, "");
  return mdToHtml(body);
}
