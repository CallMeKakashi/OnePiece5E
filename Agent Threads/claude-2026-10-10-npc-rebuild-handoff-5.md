# Handoff: Kaen, Vesper, additional powers, release 0.2.12 (2026-10-10)

Continues [handoff 4](claude-2026-10-10-npc-rebuild-handoff-4.md). Next NPC: **Veyl Corven and Serica Corven** (Sixfolds); queue in [docs/rehearsal-migration-candidates.md](../docs/rehearsal-migration-candidates.md).

## State
- Eleven NPCs live in `bb-rehearsal`; Kaen (`OP5E/Guardians of Sol`, CR 20) and Vesper (`OP5E/Shadows/Scorpio`, CR 5) added with art. Build facts: `op5e/docs/NPC-BUILDS.md`.
- **Additional powers were missing** for Tariq, Saeva (now Fearsome Fortitude), Kaen (Tough Customer), Vesper (Cheater Cheater). Ask for one for every non-fruit NPC, and check prerequisites in `op5e/data/src/class-features/additional/*.ts` before offering options.
- Relic and custom NPC items go in `op5e/data/src/campaign-items/npc-items.json` (pack `campaign-items`, 28 items). Release v0.2.12 published from `future-work` (CI `release.yml` succeeded and attached the assets); update from Foundry Setup, no restart needed for an existing pack.
- Pinterest: add `&filter_genai=true` to the search URL for the Less AI filter; art credits in `docs/art-credits.md`.

## Gotchas
- `rm` of `<slug>-chassis.json` means a rebuild needs `actor:build` from the spec again first.
- Expertise steps are wildcard (`skills:*`); apply expertise by hand in the custom builder.
- A pending Haki step may be left unresolved if the user wants no Haki; the build still works.
- Not played in a real fight; the Aegis resistance and relic activities were checked from JSON and the live import only.

## Open items
- Kaen's art (ArtStation `VV1W4`, via the Pinterest pin) is brown-haired; the user's description asked for black hair. Offer a new search if they mind. Vesper's art is an unattributed grey line drawing. Both credit rows say permission "Not asked".
- Veyl and Serica Corven are next; still unverified: relic and additional-power activities in a real fight, and Kaen's Conqueror's Haki DC 17 against the CR 20 band of 19.
- `package-lock.json` still says 0.2.11 (harmless for `npm ci`).

## Suggested skills
- `generate-foundry-actor` (level-up-npc was deleted as obsolete) for each queued NPC; ask every choice with AskUserQuestion and check options against the Sourcebook first
- `ponytail` for minimal builder scripts, `diagnosing-bugs` if an import silently drops an item
- `handoff` for the next handoff (the user wants it in `Agent Threads/`, committed, with `git add -f`)
