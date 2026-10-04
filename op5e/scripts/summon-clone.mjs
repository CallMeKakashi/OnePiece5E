// Test Subject > Clone: "Ability scores equal to yours". dnd5e's summon bonuses cannot copy ability scores and effect values
// are evaluated against the summoned actor only, so copy the summoner's six scores into the token's actor delta before it is created.
Hooks.on("dnd5e.preSummonToken", (activity, profile, config) => {
  if (profile?.name !== "Clone") return;
  const abilities = activity.actor?.system?.abilities;
  if (!abilities) return;
  config.actorUpdates ??= {};
  for (const [key, ab] of Object.entries(abilities)) {
    if (typeof ab?.value === "number") config.actorUpdates[`system.abilities.${key}.value`] = ab.value;
  }
});
