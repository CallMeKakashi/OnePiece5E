// Falling damage, the dnd5e 6 way: 1d6 bludgeoning per full 10 ft fallen (max 20d6), and the faller lands prone unless the fall was under 10 ft.
// game.op5eFalling.fall(tokens, feet) rolls and applies it; game.op5eFalling.prompt() asks the GM for the distance and uses the selected tokens.
// Also usable from a macro: game.op5eFalling.prompt()

/** Number of d6 for a fall of `feet` (0 under 10 ft). */
export const fallingDice = (feet) => Math.min(20, Math.floor(Math.max(0, Number(feet) || 0) / 10));

/**
 * @param {Token[]} tokens  tokens (or token documents) that fell
 * @param {number} feet     distance fallen
 * @param {{prone?: boolean}} [opts]
 * @returns {Promise<{name: string, dice: number, damage: number}[]>}
 */
export async function fall(tokens, feet, { prone = true } = {}) {
  if (!game.user.isGM) throw new Error("Falling damage is applied by the GM.");
  const dice = fallingDice(feet), out = [];
  for (const t of tokens) {
    const actor = t.actor ?? t.document?.actor; if (!actor) continue;
    let damage = 0;
    if (dice > 0) {
      const roll = await new Roll(`${dice}d6`).evaluate();
      damage = roll.total;
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: `${actor.name} falls ${feet} ft: ${dice}d6 bludgeoning` });
      await actor.applyDamage([{ value: damage, type: "bludgeoning" }]);
      if (prone && !actor.statuses?.has("prone")) await actor.toggleStatusEffect("prone", { active: true });
    }
    out.push({ name: actor.name, dice, damage });
  }
  return out;
}

/** Ask for the distance, then apply it to the selected tokens. */
export async function prompt() {
  const tokens = canvas.tokens?.controlled ?? [];
  if (!tokens.length) return ui.notifications.warn("Select the token(s) that fell first.");
  const feet = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Falling damage" },
    content: `<div class="form-group"><label>Distance fallen (ft)</label><input type="number" name="feet" value="10" min="0" step="10" autofocus></div>`,
    ok: { label: "Fall", callback: (_e, button) => Number(button.form.elements.feet.value) },
  }).catch(() => null);
  if (feet == null) return null;
  return fall(tokens, feet);
}

export function registerFalling() { game.op5eFalling = { fall, prompt, fallingDice }; }
