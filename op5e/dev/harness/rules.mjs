// Assertions for the highest-risk rules, built through Create OPC and level-up in the test world (Automation user):
// Devil Fruit Uses by level, Haki tiers by level, the Brawler die, the Boxer die step. Scratch actors are removed afterwards.
// Usage: node dev/harness/rules.mjs
import { withFoundry } from "./drive.mjs";

const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const made = [];
  const uses = (a) => a.items.find((i) => i.name === "Devil Fruit Uses")?.system.uses.max;
  const haki = (a) => a.items.filter((i) => /^(Color of|Conqueror.s Haki|Armament Haki|Observation Haki)/i.test(i.name) && i.type === "feat").map((i) => i.name);
  // Sourcebook: Zoan and Logia 1 use at 1st, 2 at 3rd, 3 at 5th, 4 at 7th, 5 at 9th, 6 at 11th
  const TABLE = [[1, 1], [3, 2], [5, 3], [7, 4], [9, 5], [11, 6]];
  const hakiSeen = {};
  for (const fruit of ["Zoan", "Logia", "Paramecia"]) {
    const name = `[RULES] ${fruit}`;
    let c = await game.op5eApi.createCharacter({ name, species: "Human", background: "Boxer", cls: "Brawler", level: 1, fruit });
    const a = game.actors.getName(name); made.push(a);
    await new Promise((r) => setTimeout(r, 2000));   // the template's grants arrive a moment after the build returns
    ok(`${fruit}: choosing the fruit template grants Devil Fruit Uses`, !!a.items.find((i) => i.name === "Devil Fruit Uses"));
    const got = [];
    for (const [lvl] of TABLE) {
      if (lvl > 1) await game.op5eApi.levelUp({ actor: name, cls: "Brawler", to: lvl });
      got.push(uses(a));
      if (fruit === "Zoan") hakiSeen[lvl] = haki(a).length;
    }
    if (fruit === "Paramecia") ok(`${fruit}: Devil Fruit Uses by level`, got.every((v, i) => v === TABLE[i][1] + 1 || v === TABLE[i][1]), `levels 1,3,5,7,9,11 -> ${got.join(",")}`);
    else ok(`${fruit}: Devil Fruit Uses by level`, got.every((v, i) => v === TABLE[i][1]), `levels 1,3,5,7,9,11 -> ${got.join(",")} (want ${TABLE.map((t) => t[1]).join(",")})`);
    const die = a.system.scale?.brawler?.["brawling-die"]?.faces;
    ok(`${fruit}: Brawler die at 11 is d10 (levels 11 to 15)`, die === 10, `faces ${die}`);
    const flag = a.getFlag("op5e", "unarmedDieStep");
    ok(`${fruit}: Boxer background grants a die step`, flag === 1, `step ${flag}`);
  }
  ok("Haki: none before level 8", hakiSeen[7] === 0 || hakiSeen[7] === undefined, JSON.stringify(hakiSeen));
  ok("Haki: appears by level 9", hakiSeen[9] >= 1, JSON.stringify(hakiSeen));
  for (const a of made) await a.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
