# Handoff: music system built and released, 0.2.15 to 0.2.18 (2026-10-11)

Continues [handoff 14](claude-2026-10-11-music-config-handoff-14.md) (read it and handoff 13 for the NPC workflow; the NPC queue, next Petty Officer Marine, is still untouched). Everything below is committed and pushed; releases are on `CallMeKakashi/OnePiece5E`.

## Done since handoff 14 (details live in the files, not repeated)

- **Vocal and mood analysis**: `op5e/docs/MUSIC-VOCALS.md` (Demucs scores; 9 songs pre-marked "yes (sure)", 8 "check", user has NOT reviewed), `op5e/docs/MUSIC-MOODS.md` (mood draft from librosa features + title cues; the "Mood? (you)" column is how the user corrects it), `op5e/docs/MUSIC-THEMES.md` (theme decisions), plan in `op5e/docs/MUSIC-PLAN.md`. Tools: `op5e/dev/harness/music-{tags,vocals,demucs,features,moods,build-playlists}.py`.
- **Scope decision (user)**: actor themes only for the current players and Meridian Island NPCs (B.O.B, Baptiste, Jack, Roma, Tigor, Kanto, The Gallows); every other song goes through the mood sort. "Only real lyrics go to Vocal", wordless choirs stay in the moods ([[instrumental-session-music]] memory).
- **Playlists pack** (`op5e/data/src/playlists/`, generated `music.json`, release 0.2.15): 7 moods incl. Vocal and 7 `Theme: <name>` playlists, 167 songs, all paths verified on disk. It was already imported into `bb-rehearsal` by the user (folder "OP5e Music Playlists").
- **Macros pack** (`op5e/data/src/macros/`, 0.2.16): Import Playlists, Import Actor Bundle, Apply Config Bundle (snapshots of `op5e/dev/harness/scripts/*.js` at build time).
- **GM seek row** (`op5e/scripts/music-sync.mjs`, 0.2.17): back 10 s, slider, forward 10 s under each playing sound; paused seek updates `pausedTime`.
- **Actor theme button** (`op5e/scripts/actor-themes.mjs`, 0.2.18): "Play/Stop theme" and "Set theme" in the actor sheet header menu, GM only. Matching is by name (`Theme: Tigor` fits Cade "Tigor" Hunt) or the `flags.op5e.theme` playlist id. Verified in `bb-rehearsal` via `op5e/dev/harness/test-actor-themes.mjs`.
- Latest release: [v0.2.18](https://github.com/CallMeKakashi/OnePiece5E/releases/tag/v0.2.18) (CI and release workflow green). `module.json` and `package.json` are at 0.2.18.

## Open items

- **Nothing audio was heard**: music sync, the seek row and the theme button are all untested with a real GM plus player session (headless Foundry cannot play sound). Test first in `bb-rehearsal`/`test`.
- The user must update op5e in both worlds from Setup, then run the macros as needed. `blood-and-brine` still has `splatter.violence` = 5 (wanted 1) and a live-only `chatlog-prune` module.
- Review items the user owes: vocal "check" songs (MUSIC-VOCALS.md), mood corrections (MUSIC-MOODS.md; rerun `music-moods.py` then `music-build-playlists.py`, rebuild, release), Linus Marrow's theme (he is in the party; his folder song was left unassigned), Tray (not in the party list, so only in the moods).
- The old "Session" playlists remain in the worlds (import skips existing names); the user can delete them when ready.
- 18 unused modules in `Data/modules` (not enabled in `blood-and-brine` or `bb-rehearsal`) listed in the earlier chat; nothing moved. Baptiste's `one-piece-5e` Unarmored Movement item has a fly change missing the `@` (source of the `Unresolved StringTerm scale.brawler.unarmored` console error); not fixed.
- Scratchpad still holds a multi-GB `demucs-venv` (Python 3.11, torch cu124, demucs, librosa); delete it if no more analysis is needed.
- Carried over from handoffs 10 to 14: Morrow actor, transform chat-card click, Veyl walk speed, Serica Dual Wielder AC, needs-code compendium items, Ensign vault file name, Leon katana vs rapier.

## Gotchas learned

- `blood-and-brine` is live and read-only; `drive.mjs` refuses it. Check `curl localhost:30000/api/status` before any harness run; the user switches worlds. Reading its settings was done by copying `data/settings` (not LOCK) and reading the copy with Foundry's `classic-level`.
- A pack of a new document type needs: schema in `data/schemas/common.ts`, a `data/src/<dir>/index.ts`, an entry in `PACK_CONFIGS` and `EMBEDDED_COLLECTIONS` in `data/build.ts`, and the pack plus pack folder in `module.json`. Build with `node node_modules/tsx/dist/cli.mjs data/build.ts` then `data/compile.ts` (npm scripts fail in the `&` path); `npm test` equivalent: `node node_modules/vitest/vitest.mjs run`.
- Releasing: bump `module.json` + `package.json`, commit `chore(release): op5e X`, tag, `git push origin future-work vX`, `gh release create vX --target future-work`; the release workflow builds the zip. Commit headers must be 72 chars or less (a hook rejects longer).
- Header menu entries of ApplicationV2 sheets accept `onClick`; test them by clicking the `toggleControls` button, not by calling `_getHeaderControls()` (the hook runs elsewhere).
- Browser pane cannot play local audio; use `SendUserFile` to give the user songs to listen to.

## Suggested skills

- `grilling` / `anthropic-skills:grill-with-docs` to walk the user through the mood corrections and vocal review.
- `generate-foundry-actor` and the op5e pipeline for the NPC queue (NOT `level-up-npc`).
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f`).
