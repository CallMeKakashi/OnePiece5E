import { withFoundry } from "./drive.mjs";

await withFoundry(async (page) => {
  const result = await page.evaluate(async () => {
    const actor = game.actors.getName("Facade");
    if (!actor) throw new Error("Facade is not present in bb-rehearsal");
    const required = ["Inspired Innovation", "Homunculus Servant (OHM Spider)", "Color of Armament Novice", "Color of Armament Apprentice", "Lightning Bolt", "Shatter", "Flintlock"];
    const missing = required.filter((name) => !actor.items.getName(name));
    const companion = actor.items.getName("Homunculus Servant (OHM Spider)");
    return {
      name: actor.name,
      folder: actor.folder?.name,
      cr: actor.system.details.cr,
      level: actor.system.details.level,
      hp: actor.system.attributes.hp.max,
      ac: actor.system.attributes.ac.value,
      missing,
      companionReference: companion?.flags?.op5e?.companionActorId ?? null,
      portrait: await fetch(actor.img).then((response) => response.ok),
      token: await fetch(actor.prototypeToken.texture.src).then((response) => response.ok),
      errors: game.op5eHarness.getConsoleErrors(),
    };
  });
  console.log(JSON.stringify(result, null, 2));
});
