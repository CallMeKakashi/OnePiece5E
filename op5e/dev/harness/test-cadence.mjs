import { withFoundry } from "./drive.mjs";

await withFoundry(async (page) => {
  const result = await page.evaluate(async () => {
    const actor = game.actors.getName("Cadence");
    if (!actor) throw new Error("Cadence is not present in bb-rehearsal");
    const empower = actor.items.getName("Power Word: Empower");
    const obey = actor.items.getName("Power Word: Obey");
    if (!empower || !obey) throw new Error("Cadence is missing one or more Power Word abilities");
    const portrait = await fetch(actor.img).then((r) => r.ok);
    const token = await fetch(actor.prototypeToken.texture.src).then((r) => r.ok);
    const save = await actor.rollSavingThrow({ ability: "wis" }, { configure: false }, {});
    return {
      name: actor.name,
      cr: actor.system.details.cr,
      hp: actor.system.attributes.hp.max,
      ac: actor.system.attributes.ac.value,
      items: actor.items.size,
      empowerActivities: empower.system.activities.size,
      obeyActivities: obey.system.activities.size,
      haki: actor.items.filter((item) => /^Color of (Observation|Armament) (Novice|Apprentice)$/.test(item.name)).map((item) => item.name),
      portrait,
      token,
      saveTotal: save.total,
      errors: game.op5eHarness.getConsoleErrors(),
    };
  });
  console.log(JSON.stringify(result, null, 2));
});
