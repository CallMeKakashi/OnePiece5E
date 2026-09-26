---
name: level-up-npc
description: >-
  Build a standalone FoundryVTT NPC actor JSON, leveled up one homebrew power at a
  time toward a target CR, following the One Piece Sourcebook. Chassis (race, class,
  subclass, background, role, Haki, equipment, currency, skills) is built by calling
  op5e's real compendium-resolution pipeline — never hand-typed. Only genuinely
  homebrew abilities (no compendium equivalent) are authored, and even those go
  through op5e's own schema-shaping helpers. Output has zero Compendium.op5e
  references — imports into any dnd5e Foundry world without the op5e module.
  Use when the user invokes /level-up-npc, says "level up this NPC", or asks to
  build an NPC to a target CR.
---

# Level Up NPC

## Why this exists, and why it isn't independent of `op5e/` anymore

Earlier versions of this skill hand-typed the entire actor JSON — schema, item ids,
icons, class/subclass features — from memory and Sourcebook prose. Every one of
those was wrong at least once (16-char id format, activity/effect schema, missing
class features, invented starting gear/currency that didn't match the real class).

The fix: **never hand-type Foundry item JSON.** `op5e/dev/generate-foundry-actor/`
already has a tested pipeline that resolves the *real* compendium data (classes,
subclasses, backgrounds, roles, racial features, starting equipment, currency,
Haki chains) into correctly-shaped standalone items. Use it for the chassis.
For genuinely custom homebrew abilities with no compendium equivalent, still go
through op5e's own item-shaping helpers (`ensureFeatureActivities`, `generateId`)
so the schema is never guessed by hand, even for one-off content.

The **output file** is still fully standalone (zero `Compendium.op5e` references,
importable into any world without the op5e module) — only the *authoring process*
depends on this repo's `op5e/` checkout.

Default vault mode is read-only — **do not write the actor JSON until the user
approves it.**

## Workflow

### 1. Identity

Ask (batch): name, race/species, target CR, rough archetype. Confirm before continuing.

### 2. Chassis — build via the real op5e pipeline, not by hand

1. Resolve race/class/subclass/background/role identifiers with:
   ```
   cd op5e
   node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/list-catalog.ts
   ```
2. Derive target level from CR using the table in
   [`generate-foundry-actor/REFERENCE.md`](../../../.cursor/skills/generate-foundry-actor/REFERENCE.md).
3. Write a build spec to `op5e/dev/generate-foundry-actor/specs/<slug>-spec.json`
   (same shape `generate-foundry-actor` uses — see REFERENCE.md's "Build spec JSON
   shape"). `cr` must be a **number**, not a string.
4. Loop `list-choices.ts --spec @path/to/spec.json`, resolving one pending step at a
   time by adding `{ stepId, level, source, uuids }` to the spec's `choices[]` and
   re-running — **stepIds are exact matches**, re-fetch them from each run's
   `pending[]`, don't guess or reuse stale ones. **Every pending step's real options
   go to the user — never pick on their behalf, not even for "obvious" choices like
   a skill or a starting-kit item.** This is a hard rule, not a default: it was
   skipped once already (all 8 of Zenzara's chassis choices — equipment, skills,
   Haki — got decided silently instead of asked), and that's the exact failure this
   rule exists to prevent. Batching several straightforward picks into one
   AskUserQuestion call is fine; deciding them without asking is not.
5. **Ability Score Improvement levels (per the class table) are a choice, not a
   given.** At each ASI-granting level ≤ target level, ask the user: take the
   ability score bump(s), or a Feat instead (variant-style)? `list-choices.ts`
   does not surface this as a pending step (`AbilityScoreImprovement` advancements
   are auto-applied / left to manual ability assignment per REFERENCE.md) — so it's
   on this skill to ask explicitly rather than silently filling in final ability
   scores and treating that as equivalent to having made the choice.
6. Once `pendingCount: 0`, build and validate:
   ```
   npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>-chassis.json
   node node_modules/tsx/dist/cli.mjs dev/generate-foundry-actor/validate-actor.ts --file ../Foundry/actors-json/<slug>-chassis.json
   ```
   This alone gives you the real class, subclass, background, role, all their
   granted features (including subclass features at every gate level — check the
   actual compendium output before assuming Sourcebook vault text is incomplete;
   the compendium is frequently more complete than the vault's PDF extraction),
   starting equipment, and starting currency. **Do not hand-author any of this.**
7. If a subrace/optional racial trait isn't surfaced by `list-choices.ts` (some
   racial `ItemGrant` groups are marked optional and not walked automatically),
   find the real source file under `op5e/data/src/racial-features/<race>.ts`,
   import the named export directly in a small script, and embed it with
   `embedOwnedItem()` from `compendium-resolver.ts` — still real compendium data,
   just fetched a different way. Don't fall back to typing the feature by hand.
8. **`embedOwnedItem()`'s internal activity-builder only covers `feat`/`class`/
   `weapon` types — `spell` items pass through with zero activities.** If you
   embed any creation/spell (see step 8b below), call `ensureItemActivities()`
   from `data/helpers/activities.ts` on it *before* `embedOwnedItem()`, or every
   spell ships with no Use button. This is a real gap in the resolver, not
   something to route around per-item — always apply it to every spell.
9. If the class has real spellcasting ("creations" in this Sourcebook's
   language — check the class's own source file under
   `op5e/data/src/classes/<class>.ts` for a `spellcasting: {...}` field, don't
   assume a class is a non-caster just because it isn't named like one), the
   chassis build does **not** set spell slots or pick prepared
   creations/cantrips automatically — `build-actor.ts` currently leaves
   `system.attributes.spellcasting` blank and `system.spells` untouched. You
   must: set `spellcasting` to the class's casting ability, compute the slot
   table for its progression (`full`/`half`/etc.) at the built level, and pick
   real creations from `op5e/data/src/creations/index.ts` (grep by name) —
   ask the user for thematic direction or confirm picks with them, don't
   silently invent a spell list. Embed any subclass-guaranteed creations
   (e.g. Chemist Creations) as `preparation.mode: "always"`.
10. **Before declaring the build done, audit every non-identity item
    (everything except `race`/`class`/`subclass`/`background`) for whether it
    has `system.activities` or `effects` populated.** A text-only item isn't
    automatically a bug — cross-check `op5e/docs/automation-status.md` for
    documented scope gaps (e.g. "per-mod/trick/creation combat automation out
    of scope" for caster classes) before assuming something's missing. But
    silently shipping a sparse automation layer without checking is exactly
    the failure this step exists to catch — report the audit result to the
    user (what's automated, what's text-only and why) rather than assuming
    everything compendium-sourced is automatically complete.

### 3. Homebrew leveling loop — one power per turn, still schema-safe

For anything with no compendium equivalent:

1. Ask "what's next?" one power at a time — never batch.
2. **Ask (or confirm from the user's description) the activation type for every
   distinct effect the power has**: action, bonus action, reaction, or no action
   cost (a passive, or a free/triggered effect — dnd5e's `"special"` activation).
   A single power described with multiple steps (e.g. "spend an action to apply
   it, then a free action later to trigger it") is **two separate activities**,
   each with its own activation type — don't collapse them into one activity with
   one activation just because they're one narrative feature. This was missed once
   already (Healing Tattoo Ink's "apply" and "trigger" steps got merged into a
   single action-activated heal, losing the free-action trigger entirely).
3. Author it as a small Node script that builds a legacy-shape feature object
   (`system: { actionType, damage: [[formula, type]], save: {ability, dc}, uses, ... }`
   — see `op5e/data/src/class-features/haki.ts` for the exact shape real op5e
   content uses) and runs it through `ensureFeatureActivities()` from
   `op5e/data/helpers/activities.ts`. That function converts the legacy shape into
   the real dnd5e 5.1 `system.activities` schema — this is the same function every
   real compendium item goes through, so the output is correct by construction.
3. Generate the item's `_id` with `generateId(idPath)` from
   `op5e/data/helpers/id.ts` (deterministic 16-char hex from a content path like
   `"homebrew/<npc-slug>/<power-slug>"`) — never hand-type an id.
4. For passive bonuses (AC, saves, resistances), build the effect's `changes[]`
   using `DAE_MODES` from `op5e/data/schemas/common.ts` for mode numbers, but
   **strip `flags.dae`** from the resulting effect object — core dnd5e effects only,
   no DAE module dependency, per this NPC's target world not being guaranteed to
   have it installed.
5. Verify every `img` path exists under the Foundry install's
   `foundryvtt/public/icons/` before using it (`find` it — don't guess a
   plausible-sounding filename; a wrong guess renders as a silent blank icon, not
   an error).
6. Merge the built item into the chassis actor's `items[]`.
7. Recompute CR (below) and report the running total to the user.

### 4. CR balance pass — mandatory, automatic, before showing the build to the user

This is **not an optional check the user has to remember to ask for.** Every
build that specifies a target CR gets this pass automatically, every time,
before the actor is presented as done. It was skipped by default early in this
skill's use and had to be asked for by hand on four separate NPCs — that's
the exact failure this step exists to prevent.

**The core lesson, confirmed across every class-based NPC built so far
(Zenzara, Queen, Cedro, Nerolo, Bosco):** a real PC-class chassis, played
straight, **structurally undershoots** the DMG's monster CR tables — often by
a wide margin — the lower the character level is relative to the target CR,
and especially for HP (fixed hit-die count) and DPR (fixed attack count per
class features). This isn't a one-off bug to catch reactively; assume it will
happen and check for it every time.

1. After the chassis + homebrew items are merged, compute against the DMG
   tables using the actor's **real, final** numbers (not the target the user
   typed into the spec's `cr` field):
   - **Defensive**: HP and AC (DMG "Step 3") — remember AC may come from a
     dynamic formula (Unarmored Defense, armor + Dex, etc.); resolve the
     actual number, don't read the raw `calc: "default"` field as if it were
     the value.
   - **Offensive**: attack bonus and average damage per round across a full
     turn's actions (DMG "Step 4") — count Extra Attack, bonus-action extra
     attacks (Flurry of Blows, etc.) as they'd actually be used together.
   - **Save DCs**: any save-based ability's DC against the DMG's per-CR DC
     expectation, not just attack/AC/HP.
   - Average defensive + offensive for the final effective CR.
2. **If the real numbers fall outside the target band, close the gap
   yourself before presenting the build — don't wait to be asked:**
   - **HP short**: raise CON first (real formula, no override). If the
     character's level is low enough that even an implausible CON (30+)
     can't reach the band through the real hit-die formula, flat-override
     `system.attributes.hp.value`/`max` instead — this is a legitimate,
     expected fallback for low-level/high-CR builds, not a last resort to
     avoid. Document the override in the build script with a comment
     explaining why the formula couldn't get there.
   - **AC short**: raise the ability score(s) the AC formula actually reads
     (check the class/subclass text — e.g. Sumo Wrestler substitutes STR for
     DEX in Unarmored Defense, so DEX doesn't help there). Watch for one stat
     driving two things at once (AC and a save DC, say) — raising it to fix
     one can overshoot the other; that's fine, note the tradeoff plainly and
     move on rather than treating it as a new open question.
   - **DPR short**: this is the most common and largest gap. Bump the
     weapon/attack's damage dice to a bespoke value that closes it — this is
     a deliberate, documented departure from real class-formula damage, not
     a bug, but it must be *labeled* as such (both in a code comment and in
     the item's in-sheet description) so nobody mistakes it for real class
     output later. **Watch for `system.activities.<id>.damage.parts[].custom`**
     on any reflavored item whose source used a dynamic formula (e.g.
     Brawler Unarmed Strike's `@scale.brawler.brawling-die`): if
     `custom.enabled` stays `true`, Foundry uses `custom.formula` instead of
     the `number`/`denomination`/`bonus` you just set, silently discarding
     the bump. Set `custom.enabled = false` (or update `custom.formula` to
     match) whenever you touch a damage part's static fields.
     **Also fix the item's top-level legacy `system.damage.parts` array**
     (the old pre-5.1 `["formula","type"]` shape `build-actor.ts` still
     writes alongside the real `system.activities.*.damage`) — it duplicates
     the same dynamic formula, and Foundry migrates it into
     `system.damage.base.custom.formula` on import. If that formula can't
     resolve outside actor-roll context, import throws "Unresolved
     StringTerm" and the actor fails to load entirely. Replace it with the
     proper `base: {number, denomination, bonus, types, custom, scaling}` /
     `versatile: {...}` object mirroring whatever you set in the activity
     (this bit both Bosco, Greyhound, and Salvatore's reflavored Brawler
     weapons — grep every actor json for `"parts": [\n  "@scale` before
     calling a build done).
   - **Save DC short**: raise the ability score the DC formula reads. Same
     stacking caveat as AC — flag if it conflicts with another stat's target.
3. **Also verify while you're in there** (fold into the same pass, don't
   make it a separate ask): every starting-equipment item that should be
   `equipped: true` actually is (`build-actor.ts` embeds starting armor
   without equipping it — same class of gap as the missing weaponProf/
   armorProf/spellcasting fields already called out in step 2), and that
   `system.attributes.prof` matches the class level (or the target CR, if
   you deliberately chose to tie it to CR instead — state which and why).
4. Report the before/after numbers to the user in the build summary — they
   should never have to ask "what's his CR" and get a surprise. If a gap is
   large enough that closing it would require an implausible fix (e.g. CON
   past what a human could plausibly have even in a fantasy setting), surface
   that specific tradeoff rather than silently picking a number — but do the
   pass regardless; "I checked and it's fine" is itself the expected outcome
   sometimes (see Cedro's save DCs, which needed no fix at all).

### 5. Output

Before writing, confirm with the user:
- Chassis fully resolved (`pendingCount: 0` from `list-choices.ts`)
- `validate-actor.ts` passes on the chassis build
- Every homebrew item's `_id` came from `generateId()`, every activity from
  `ensureFeatureActivities()`, every icon path verified to exist
- Zero `Compendium.op5e` references and zero `flags.dae` anywhere in the final file

On approval, merge chassis + homebrew items into `Foundry/actors-json/<slug>.json`,
delete the intermediate `<slug>-chassis.json`, and re-run `validate-actor.ts` on the
final merged file as the last check before handing it to the user.
