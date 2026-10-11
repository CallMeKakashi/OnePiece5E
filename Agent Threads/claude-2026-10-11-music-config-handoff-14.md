# Handoff: release 0.2.14, config migration, music organization (2026-10-11)

Continues [handoff 13](claude-2026-10-10-npc-rebuild-handoff-13.md). The NPC queue (next: Petty Officer Marine) is untouched this session; this one was ops and music. Read handoffs 1 to 13 for the NPC workflow.

## Done this session (details live in the commits and files, not repeated here)

- **Drez Crown** built and committed (see handoff 13).
- **Release `v0.2.14`** published on `CallMeKakashi/OnePiece5E` (tag, GitHub release, release workflow green). `v0.2.13` was already a published release at another commit, so the tag was bumped. `module.json` `download` URL still names v0.2.11; packaging rewrites it, unchecked.
- **Synchronized music** (`op5e/scripts/music-sync.mjs`, commit `c627ed9`): GM position broadcast over the module socket, players seek on drift > 0.3 s, `game.op5eMusic.seek`. **Not tested with a real GM + player pair.** Deploying (`npm run deploy:foundry`) overwrites the shared `Data/modules/op5e`, which `blood-and-brine` also reads.
- **Actor bundle**: `dev/harness/export-bundle.mjs` and `scripts/import-bundle-macro.js` (34 actors from `OP5E/` tree + `Meridian Island`, output `Foundry/actors-json/op5e-bundle.json`, gitignored). The macro was never run anywhere.
- **Config migration**: `export-config-bundle.mjs` + `scripts/apply-config-macro.js` (commit `7a9a4e0`); bundle `Foundry/actors-json/op5e-config-bundle.json`. Corrections applied in `bb-rehearsal`: midi-qol crit = Max Base Roll Crit (players and GM), chat log pruning on, splatter violence 1, op5e extraSources = all Item packs except op5e, dnd5e and 2024 ones. A read-only check of `blood-and-brine` settings found all 82 bundled settings already matching; only `splatter.violence` is 5 there (wanted 1) and `chatlog-prune` is an extra live-only module.
- **Brawler scale error** (`Unresolved StringTerm scale.brawler.unarmored`): not op5e. The `one-piece-5e` module's Unarmored Movement item on `Baptiste` and `[Fight] Baptiste` has a fly change `scale.brawler.unarmored-movement.value` missing the `@`. Not fixed; fix is on those two actors.
- **Unused modules** (not enabled in `blood-and-brine` or `bb-rehearsal`, test world ignored): 18, listed in the chat; nothing moved or deleted.

## Music organization (in progress)

User decisions: playlists as a **shared compendium pack in op5e**; structure = **Mood folders + Themes folder (one playlist per actor)**; actor theme = **actor flag + play button on the sheet**; **instrumental only for session moods**, vocal tracks go to a separate Vocal folder excluded from moods. Draft in `op5e/docs/MUSIC-PLAN.md` (current playlists, `Data/music/Characters/<name>/` theme files, open questions: mood list, one vs several themes per actor, files stay in place).

Vocal detection: tags + LRCLIB gave 36 instrumental / 13 vocal / 118 unknown (`Foundry/actors-json/music-vocals.json`; LRCLIB is noisy: Sagisu and Kudo tracks and Linkin Park "(Instrumental)" are false vocals). Then Demucs (htdemucs vocals stem, CUDA RTX 3060 Ti) in a venv in the session scratchpad scores every track by vocal/mix ratio per second: `dev/harness/music-demucs.py`, output `Foundry/actors-json/music-demucs.json` (mean_ratio, frac_gt_025, frac_gt_040). Was at 160/167 when this note was written. **Next:** calibrate a threshold on the known-vocal tracks (Phantom of the Opera, O Fortuna, Pergolesi, Soap&Skin, Fenris Wolfblood, Hoist the Colours, Ace of Spades) vs the LRCLIB-instrumental ones, flag the likely vocals for the user to confirm, then build the Vocal/mood/theme structure and the pack.

## Gotchas learned

- Foundry runs one world at a time and the harness (`drive.mjs`) refuses anything but `test` and `bb-rehearsal`; the user switches worlds, so check `curl localhost:30000/api/status` first.
- `blood-and-brine` is the live campaign: read-only. Reading its settings was done by copying `data/settings` (not LOCK) to the scratchpad and reading the copy with `classic-level` from Foundry's node_modules (`dev` scratch scripts `read-settings.mjs`, `compare.mjs` in the session scratchpad). Never read the users DB. Delete copies afterwards.
- A stale zero-byte `.git/index.lock` blocked a commit once; no git process was running, so it was removed.
- Demucs on Python 3.14 is unsupported: use `py -3.11` venv with `torch` from the cu124 index. Demucs stderr decoding errors in the subprocess reader are non-fatal.
- Pasted console logs: only the Brawler scale error was op5e-relevant; the rest is third-party deprecation noise.

## Open items

- Push of the last commits (`7a9a4e0` and the handoff/music commit) is not done; `v0.2.14` and its commits are pushed.
- Terms to decide: Vocal folder location, mood list, themes per actor.
- Carried over from handoffs 10 to 13 (Morrow actor, transform chat-card click, Veyl walk speed, Serica Dual Wielder AC, needs-code compendium items, Ensign vault file name, Leon katana vs rapier).

## Suggested skills

- `grilling` / `anthropic-skills:grill-with-docs` to settle the mood list and theme model before building the pack.
- `generate-foundry-actor` and the op5e pipeline for the NPC queue (NOT `level-up-npc`).
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f`).
