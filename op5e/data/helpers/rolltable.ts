// Parses the flattened-PDF tables of the Sourcebook markdown ("d6 Ideal" header, then numbered rows) into table data.
// Also used by the reference journal to render the same tables as real HTML tables.

export interface TableRow { lo: number; hi: number; label?: string; text: string }
/** start/end are 0-based line indexes (inclusive) into md.replace(/\r/g, "").split("\n") */
export interface ParsedTable { key: string; title: string; die: number; rolled: boolean; head: string; rows: TableRow[]; start: number; end: number }

const HEADER = /^(?:d(\d+)|(Stage|Round|Number))\s+([A-Z].*)$/;
const ENTRY = /^(\d+)(?:\s*[-–]\s*(\d+))?\s+(\S.*)$/;
const DASH_ENTRY = /^(\d+)[-–]\s+(\S.*)$/; // "9- text" then next line "10" (range split by the PDF columns)
const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const isLabel = (s: string) => /^[A-Z][^.!?]{0,50}\.$/.test(s) && s.split(" ").length <= 8;

/** Finds every numbered table in a markdown file. A table is a header line followed by its rows, numbered from 1 (dice tables). */
export function parseTables(md: string): ParsedTable[] {
  const lines = md.replace(/\r/g, "").split("\n").map((l) => l.trim());
  const tables: ParsedTable[] = [];
  let lastHeading = "";
  for (let i = 0; i < lines.length; i++) {
    const hd = lines[i].match(/^#{1,6}\s+(.*)$/);
    if (hd) { lastHeading = hd[1].trim(); continue; }
    const h = lines[i].match(HEADER);
    if (!h) continue;
    const die = h[1] ? Number(h[1]) : 0;
    const head = clean(h[3]);
    const prev = tables[tables.length - 1];
    // table continued on the next page: same header again, numbering resumes
    const cont = prev && prev.head === head && prev.title === (lastHeading || head) ? prev : null;
    const rows: TableRow[] = cont ? cont.rows : [];
    let expect = rows.length ? rows[rows.length - 1].hi + 1 : die ? 1 : -1;
    const okNum = (n: number) => expect === -1 || n === expect;
    let labeled = null as boolean | null;
    let cur = null as TableRow | null;
    let label: string | undefined;
    let last = i;
    const push = (lo: number, hi: number, text: string, lab?: string, at = 0) => {
      cur = { lo, hi, text: clean(text) }; if (lab) cur.label = lab; rows.push(cur); expect = hi + 1; last = at;
    };
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l || l.startsWith("<!--")) {
        if (cur && ((die && cur.hi >= die) || (!die && !l.startsWith("<!--")))) break; // table finished
        continue;
      }
      if (/^#{1,6}\s/.test(l) || HEADER.test(l)) break;
      const bare = l.match(/^(\d+)$/);
      if (bare && okNum(Number(bare[1])) && cur) {
        // row number alone on a line; the previous line held its label and first words ("Invention. Make what you need...")
        const prevLine = clean(lines[j - 1]);
        const lm = prevLine.match(/^([A-Z][A-Za-z' ]{0,30})\.\s+(\S.*)$/);
        const c: TableRow = cur;
        if (lm && c.text.endsWith(prevLine)) { c.text = clean(c.text.slice(0, c.text.length - prevLine.length)); push(expect, expect, lm[2], lm[1], j); }
        else push(expect, expect, "", undefined, j);
        continue;
      }
      const m = l.match(ENTRY);
      const dash = m ? null : l.match(DASH_ENTRY);
      if (dash && okNum(Number(dash[1])) && lines[j + 1]) {
        const n = lines[j + 1].match(/^(\d+)(?:\s+(\S.*))?$/);
        if (n && Number(n[1]) > Number(dash[1])) { push(Number(dash[1]), Number(n[1]), `${dash[2]} ${n[2] ?? ""}`, label, j + 1); label = undefined; j++; continue; }
      }
      if (m && okNum(Number(m[1])) && (!m[2] || Number(m[2]) > Number(m[1]))) {
        push(Number(m[1]), m[2] ? Number(m[2]) : Number(m[1]), m[3], label, j); label = undefined; continue;
      }
      // label line ("Break a Finger.") before the next row of a labeled table
      if (labeled !== false && isLabel(l)) {
        const next = lines.slice(j + 1).find((x) => x && !x.startsWith("<!--")) ?? "";
        const nm = next.match(ENTRY) ?? next.match(DASH_ENTRY);
        if (nm && okNum(Number(nm[1]))) { labeled = true; label = l.replace(/\.$/, ""); last = j; continue; }
      }
      if (!cur) break; // not a table
      // stage/round/number tables have short rows: only a wrapped (long) previous line can continue
      if (!die && clean(lines[last]).length < 35) break;
      // last row of a dice table: a short line ending a sentence closes the table, whatever follows is body text
      let tl = last; while (tl > i && /^\d+$/.test(lines[tl])) tl--;
      if (die && cur.hi >= die && /[.!?]$/.test(lines[tl]) && lines[tl].length < 50) break;
      (cur as TableRow).text = clean(`${(cur as TableRow).text} ${l}`); last = j;
    }
    if (rows.length === 0) continue;
    if (cont) { cont.end = last; i = Math.max(i, last); continue; }
    if (die && rows[0].lo !== 1) continue;
    // "Number" tables (Volatile Damage) are rolled; "Stage" and "Round" are looked up, not rolled
    tables.push({ key: die ? `d${die}` : h[2], title: lastHeading || head, die: die || rows[rows.length - 1].hi, rolled: !!die || h[2] === "Number", head, rows, start: i, end: last });
    i = Math.max(i, last);
  }
  return tables.filter((t) => t.rows.length >= 2);
}

export const rowRange = (r: TableRow) => (r.lo === r.hi ? `${r.lo}` : `${r.lo}-${r.hi}`);
