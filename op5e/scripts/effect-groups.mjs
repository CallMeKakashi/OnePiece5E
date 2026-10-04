// Effects flagged flags.op5e.effectGroup are mutually exclusive on an actor: applying one removes the others of the same group.
// Used for "choose after each long rest" features such as the Storm Herald's Raging Storm / Stormy Soul / Fury of the Storm.
Hooks.on("createActiveEffect", (effect, _options, userId) => {
  const group = effect.getFlag("op5e", "effectGroup");
  const actor = effect.parent;
  if (!group || userId !== game.user.id || !actor?.effects) return;
  const stale = actor.effects.filter((e) => e.id !== effect.id && e.getFlag("op5e", "effectGroup") === group).map((e) => e.id);
  if (stale.length) actor.deleteEmbeddedDocuments("ActiveEffect", stale);
});
