import { withFoundry } from "./drive.mjs";
const r = await withFoundry(async (page) => page.evaluate(async () => {
  const T = dnd5e.documents.Trait, o = {};
  const c = await T.choices("tool");
  const set = c.asSet?.() ?? new Set();
  o.size = set.size; o.sample = [...set].slice(0, 60);
  const flat = []; const walk = (n, p = "") => { for (const [k, v] of Object.entries(n)) { flat.push(p + k); if (v.children) walk(v.children, p + k + "/"); } }; walk(c);
  o.tree = flat.slice(0, 20);
  o.wild = ["tool:art:*", "tool:game:*", "tool:music:*", "tool:*", "art:*"].map((p) => [p, c.filter(new Set([p]), { inplace: false }).asSet().size]);
  return o;
}));
console.log(JSON.stringify(r));
