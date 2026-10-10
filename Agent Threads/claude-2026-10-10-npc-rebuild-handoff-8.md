# Handoff: compendium audit, NPC review fixes, release 0.2.13 (2026-10-10)

Continues [handoff 7](claude-2026-10-10-npc-rebuild-handoff-7.md); read handoffs 1 to 7 for workflow and gotchas. **Next: Goru Yamashita**, but ask the user first (see below).

## Done this session

- **Compendium audit** of all 1,938 text-bearing items in `op5e/packs-src` against their activities/uses/effects. Outcome and the needs-code and skipped lists are at the top of [docs/compendium-audit-2026-10-10.md](../docs/compendium-audit-2026-10-10.md). Fixes live in `op5e/data/src/automation/audit-fixes.ts` (high severity, hand-verified) and `audit-fixes-0..4.ts` (agent-written, build and tests pass, rules guesses listed in the doc). `op5e/data/helpers/audit-wiring.ts` wires spirit, superiority-die (`superior-combatant`), grit (`trick-shots`) and Bardic Inspiration costs and 7 empty DCs at build time. 195 of 449 re-checked items were real; the first-pass extractor wrongly read `transfer:false`/`disabled:true` effects as permanent self effects and read recovery from the wrong field.
- **NPC reviews** of the OP5E and Meridian Island folders (28 live actors) by read-only agents, then fixes. Wrong DMG HP bands were corrected (CR 3 = 101-115, CR 4 = 116-130, CR 5 = 131-145, CR 10 = 206-220): Chuckles 105 (the user had approved 78 on my wrong band, flagged in NPC-BUILDS), Tariq 105, Cecilia 135, Calder 210. Also: Kaen extra Action Surge/Indomitable use, Khael Strength (Athletics expertise), Tariq Acrobatics, Serica Martial Adept (2 d8 dice, short rest) with Precision Attack and Menacing Attack, Irik art-folder case and unequipped armor, Shin's real skills (Rogue half merged), Bard pools recover on a short rest (Font of Inspiration/Vitality), Veyl dagger equipped, Vesper Sneak Attack leftover. Judith's Wisdom save is legitimate (Fearsome Fortitude).
- **Spirit costs** for Flurry of Blows, Patient Defense, Deft Escape, Stunning Strike on the Brawler NPCs (`wireSpirit` in `refresh-from-packs.ts`); `limitedUse()` there adds uses plus a utility activity to a text-only feature (Soefra's Lucky, Kaen's Undying Devotion).
- **Release OP5e 0.2.13** published from `future-work` (tag v0.2.13); the CI `release.yml` should attach the files, not yet confirmed. `level-up-npc` skill deleted (both copies). Calder's new art is the user's Aerio pin.
- Commits since handoff 7 are on `future-work`; run `git log --oneline -25`.

## Goru Yamashita (still not built)

Live sheet: CR 5, 95 HP, AC 16, odachi swordsman with MistFrame, an air-elemental summon and five Forms. Vault page `World/World Map/East Blue/Driftroot Isle/🗡️ Goru Yamashita (formerly Goru Valencruz).md`. His class "The Fang (custom class by Soda)" is not in the Sourcebook. `specs/goru-spec.json` is a stub (Fighter Samurai L8 Noble, empty `choices[]`, 13 pending steps). **Ask the user** (AskUserQuestion) for: class/subclass, level, whether to build the mist gear as homebrew or drop it (compendium-only), then each pending choice. The user dismissed the question batches earlier; stop and wait if they dismiss again. Queue after Goru: Mikey/Morrow, Marine Ensign Mk III, Commander Leon, Drez Crown, Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (list in docs/rehearsal-migration-candidates.md).

## Gotchas learned

- `git add -f "Agent Threads"` stages the whole gitignored folder; add specific handoff files. Same for `Foundry/actors-json`: add `-f` only the finished NPC JSON, never the glob.
- Builders read `<slug>-chassis.json`; rebuild it with `npm run actor:build -- --spec @dev/generate-foundry-actor/specs/<slug>-spec.json --out ../Foundry/actors-json/<slug>-chassis.json` (Kaen's reads `kaen-solaris-chassis.json`) when missing.
- `packs-src` is gitignored build output; `npm run build:json` regenerates it from `data/src` (automation specs in `data/src/automation`, later `Object.assign` wins; audit-fixes.ts is imported last).
- Foundry harness shares one "Automation" login: run `sync-npc.mjs` loops in the background (they exceed 2 minutes) and do not run two Foundry scripts at once. Agents should review from an offline snapshot (`live-dump.json` pattern) instead.
- `git stash` slipped in by mistake once and was popped; do not use it with the dirty tree.
- Use the DMG band table in `dev/harness/npc-validate.mjs` for HP bands instead of memory.

## Open items

- Not played in a real fight; Veyl's walk speed 140 vs the fruit page's 120 (ask about capping); Serica's Dual Wielder +1 AC not automatic.
- 24 compendium needs-code items (e.g. two "Slippery Devil" items share a key, Fruit Uses scaling for six fruits); 33 skipped. See the audit doc.
- Text-only features that could still be automated: Six Techniques, Back In The Fight, Kaen's Fighting Stances and Conqueror's Haki Journeyman uses.
- Art credits: permission "Not asked" for all art; Calder's art is a close-up face (no wings or armor).
- `package-lock.json` still says 0.2.11.

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline for Goru (NOT `level-up-npc`)
- `diagnosing-bugs` if an import silently drops an item
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
