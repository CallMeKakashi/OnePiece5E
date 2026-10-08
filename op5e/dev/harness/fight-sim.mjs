// Back-of-the-envelope Monte Carlo of Kyle Sollen + Tyrell against a party. NOT a Foundry combat: it uses each side's hit points, AC, attack bonus and average damage
// per hit, and a simple turn script. It ignores terrain, positioning, most spells and PC special abilities, so read it as a rough power check, not a prediction.
// Usage: node dev/harness/fight-sim.mjs [trials]
const TRIALS = Number(process.argv[2] ?? 3000);
const d = (n, s) => { let t = 0; for (let i = 0; i < n; i++) t += 1 + Math.floor(Math.random() * s); return t; };
const d20 = () => d(1, 20), hit = (bonus, ac) => { const r = d20(); return r === 20 || (r !== 1 && r + bonus >= ac); };

// PCs: hp, ac, attacks per round, to-hit, average damage per hit, wis save bonus (sheet numbers where the world sheet had them)
const PARTY = {
  "B.O.B (Paladin 10)": { hp: 123, ac: 20, atk: 2, hit: 9, dmg: 13, wis: 6 },
  "Roma (Barbarian 7 / Fighter 3)": { hp: 104, ac: 16, atk: 3, hit: 9, dmg: 14, wis: 2 },
  "Malphas (Brawler 8)": { hp: 80, ac: 18, atk: 4, hit: 8, dmg: 9, wis: 3 },
  "Matthew Burgess (Gunslinger 10)": { hp: 71, ac: 22, atk: 2, hit: 10, dmg: 32, wis: 3 },
};
const scale = (p, k) => Object.fromEntries(Object.entries(p).map(([n, v]) => [n, { ...v, dmg: v.dmg * k }]));

function fight(party) {
  const pcs = Object.entries(party).map(([name, p]) => ({ name, ...p, cur: p.hp, stunned: 0 }));
  const kyle = { name: "Kyle", ac: 18, hp: 245 + 60, hit: 11, riddles: 3, rutRecharge: true, sandstorm: true },   // 60 temp hp from Hybrid Form
        tyrell = { name: "Tyrell", ac: 17, hp: 226, hit: 10, rut: 2, takeHit: 3, rage: true };
  let round = 0, kyleLR = 3, tyLR = 2;
  const alive = () => pcs.filter((p) => p.cur > 0);
  const pick = () => { const a = alive(); return a.sort((x, y) => x.cur - y.cur)[Math.floor(Math.random() * Math.min(2, a.length))]; };   // the two weakest are the favourite targets
  const dmgPc = (p, n) => { p.cur -= n; };
  while (round < 15 && alive().length && (kyle.hp > 0 || tyrell.hp > 0)) {
    round++;
    // ---- party turn: each PC attacks; 60% of the focus goes to Kyle while he is up
    for (const p of alive()) {
      if (p.stunned > 0) { p.stunned--; continue; }
      for (let a = 0; a < p.atk; a++) {
        let t = kyle.hp > 0 && (tyrell.hp <= 0 || Math.random() < 0.6) ? kyle : tyrell;
        if (!hit(p.hit, t.ac)) continue;
        let dmg = p.dmg * (0.8 + Math.random() * 0.4);
        if (t === kyle && tyrell.hp > 0 && tyrell.takeHit > 0 && Math.random() < 0.7) { tyrell.takeHit--; t = tyrell; dmg /= 2; }   // Take the Hit: Tyrell steps in at resistance
        t.hp -= dmg;
      }
    }
    // ---- Kyle: round 1 Riddle; then Riddle (3/day), Sandstorm (recharge) or two Khopesh attacks with Verdict and Sneak Attack
    if (kyle.hp > 0) {
      const tgt = pick(); if (!tgt) break;
      const kAtk = () => { let n = 0; for (let i = 0; i < 2; i++) if (hit(kyle.hit, tgt.ac)) n += d(4, 8) + 6 + 5; return n; };   // 4d8 + 2 + 4 Dex + 5 hybrid
      if (kyle.riddles > 0 && (round === 1 || Math.random() < 0.3)) {
        kyle.riddles--; const save = d20() + tgt.wis >= 19; dmgPc(tgt, save ? d(12, 8) / 2 : d(12, 8)); if (!save) tgt.stunned = 1;
      } else if (kyle.sandstorm && Math.random() < 0.5) {
        for (const p of alive()) dmgPc(p, d20() + 3 >= 19 ? d(10, 8) / 2 : d(10, 8)); if (Math.random() < 0.67) kyle.sandstorm = false;
      } else { const n = kAtk(); if (n) dmgPc(tgt, n + d(4, 6) + d(2, 6)); }   // Verdict 4d6 + Sneak Attack 2d6 once on a hit
      if (!kyle.sandstorm && d(1, 6) >= 5) kyle.sandstorm = true;
      // legendary action between turns: one Sunbrand Strike (2 of his 3 legendary actions)
      const t2 = pick(); if (t2 && hit(kyle.hit, t2.ac)) dmgPc(t2, d(4, 8) + 11);
    }
    // ---- Tyrell: Moose Rut (bonus) twice a day, otherwise Flurry; two attacks plus two flurry hits, +9 (2d8) and rage damage
    if (tyrell.hp > 0) {
      const tgt = pick(); if (!tgt) break;
      const strike = () => (hit(tyrell.hit, tgt.ac) ? d(1, 10) + 5 + 3 + d(2, 8) : 0);
      let n = strike() + strike();
      if (tyrell.rut > 0 && round <= 2) { tyrell.rut--; n += d20() + 3 >= 18 ? d(4, 10) / 2 : d(4, 10); } else n += strike() + strike();
      dmgPc(tgt, n);
      const t2 = pick(); if (t2 && hit(tyrell.hit, t2.ac)) dmgPc(t2, d(1, 10) + 5 + 3 + d(2, 8));   // legendary Strike
    }
  }
  return { round, pcsDown: pcs.filter((p) => p.cur <= 0).length, kyleDown: kyle.hp <= 0, tyrellDown: tyrell.hp <= 0, pcWin: kyle.hp <= 0 && tyrell.hp <= 0, bossWin: alive().length === 0 };
}

const run = (label, party) => {
  let pc = 0, boss = 0, rounds = 0, down = 0, stalemate = 0;
  for (let i = 0; i < TRIALS; i++) { const r = fight(party); rounds += r.round; down += r.pcsDown; if (r.pcWin) pc++; else if (r.bossWin) boss++; else stalemate++; }
  console.log(`${label}: party wins ${(100 * pc / TRIALS).toFixed(0)}%, bosses win ${(100 * boss / TRIALS).toFixed(0)}%, unresolved by round 15 ${(100 * stalemate / TRIALS).toFixed(0)}%; average ${(rounds / TRIALS).toFixed(1)} rounds, ${(down / TRIALS).toFixed(1)} of 4 PCs down`);
};
console.log(`Kyle (HP 245 + 60 temp, AC 18) and Tyrell (HP 226, AC 17) against ${Object.keys(PARTY).join(", ")}, ${TRIALS} trials each`);
run("A. party as its world sheets read   ", PARTY);
run("B. party with 1.5x damage (gear)    ", scale(PARTY, 1.5));
run("C. party with 2x damage (high power)", scale(PARTY, 2));
