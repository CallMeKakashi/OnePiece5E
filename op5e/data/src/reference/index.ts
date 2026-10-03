import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { generateId } from "../../helpers/id.js";

// Reference journal: sourcebook rules/tables/optional rules, one entry per top section, one page per markdown file.
// ponytail: the vault md is flattened PDF text (no pipe tables); table pages keep their line breaks instead of being re-gridded.
const SB = join(dirname(fileURLToPath(import.meta.url)), "../../../../Sourcebook");
const SECTIONS = ["Appendix B Running The Game", "Chapter 3 Character Origins", "Chapter 4 Equipment and Items", "Chapter 5 Customization", "Chapter 6 Devil Fruits", "Credits", "General Sub Sections"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function mdToHtml(md: string): string {
  const text = md.replace(/\r/g, "").replace(/^---[\s\S]*?---\s*/, "").replace(/<!--[\s\S]*?-->/g, "");
  const tabular = /^d\d+\b/m.test(text);
  const out: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushP = () => { if (para.length) out.push(`<p>${para.map(esc).join(tabular ? "<br>" : " ")}</p>`); para = []; };
  const flushL = () => { if (list.length) out.push(`<ul>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`); list = []; };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    const li = line.match(/^[-*•]\s+(.*)$/);
    if (!line) { flushP(); flushL(); }
    else if (h) { flushP(); flushL(); const n = Math.min(6, h[1].length + 1); out.push(`<h${n}>${esc(h[2])}</h${n}>`); }
    else if (li) { flushP(); list.push(li[1]); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return out.join("\n");
}

function walk(dir: string): string[] {
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith(".md") ? [p] : [];
  });
}

export default SECTIONS.map((sec, si) => {
  const root = join(SB, sec);
  const pages = walk(root).map((f, i) => {
    const rel = relative(root, f).split("\\").join("/").replace(/\.md$/, "");
    const parts = rel.split("/");
    const name = parts.length > 1 && parts[parts.length - 1] === parts[parts.length - 2] ? parts.slice(0, -1).join(" / ") : parts.join(" / ");
    return {
      _id: generateId(`reference/${sec}/${rel}`), name: name || basename(f), type: "text", sort: (i + 1) * 100, flags: {},
      system: {}, title: { show: true, level: 1 }, image: {}, video: {},
      text: { format: 1, content: mdToHtml(readFileSync(f, "utf8")) }, ownership: { default: -1 },
    };
  });
  return { _id: generateId(`reference/${sec}`), name: sec, folder: null, sort: (si + 1) * 100, ownership: { default: 2 }, flags: {}, pages };
});
