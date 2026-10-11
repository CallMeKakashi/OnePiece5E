# Handoff 18: Malphas built, the last queued NPC (2026-10-11)

Continues [handoff 17](claude-2026-10-11-audit-fixes-handoff-17.md). Workflow and gotchas live in handoffs 10 to 17 and the memory notes (ask every choice with AskUserQuestion, check options exist in the packs, no AI art, add the docs entries, commit per NPC).

## Done this session (details are in `op5e/docs/NPC-BUILDS.md` "Malphas", `docs/art-credits.md` and the scripts; not repeated here)

- **Malphas** built and imported into `bb-rehearsal` (`OP5E/Lunarfolds`): Lunarian Brawler 12 (Drunken Master), CR 11, HP 215. Scripts `build-malphas-custom.ts` and `build-malphas-forms.ts`, spec `specs/malphas-spec.json`. Verified live: Devil Fruit Uses 6, both transform profiles resolve to the form actors, no duplicate items, Haki Armament Novice, Observation Novice, Armament Apprentice.
- **Decision: one Hybrid Form and one Full Beast Form only.** The user said there is no Form 1 or Form 2; the legacy Thunderbird Form 1/2 stay archived and untouched. The legacy Malphas was renamed `Malphas (legacy)` (Archived), not deleted.
- **Art:** base = local `players/Lunarfold/Malphas-2.png`; Hybrid = pin 10414642882975480 (grey painting, black bird with purple lightning wings); Full Beast = pin 179018153932336148. Both pins had no "AI modified" tag when checked. Files are in the Foundry data folder `one-piece-5e/npcs/Lunarfolds/` (not in the repo).
- Marked the queue done in `docs/rehearsal-migration-candidates.md`.

## Open items

- **Confirm the Hybrid Form art.** The pin is not the golden-beaked brief; the local `players/Lunarfold/malphis-hybrid.png` (also `Malphas-Hybrid.png`) matches the user's pasted description better. If they prefer it, replace `malphas-hybrid-new.jpg` and its token, and update `docs/art-credits.md`.
- The lightning creations (Stormcall, Thunderstroke, Skystep, Thunderclap, Shatter, Gust) sit on Malphas, labelled Hybrid Form only, 1/long rest; the user's choice of "existing creations on Form 2" was moved onto the single hybrid. Ask if they want them gated differently.
- CR 11 is my DMG-band calculation, not played in a real fight.
- The browser-test report `op5e/reports/browser-test-meridian-op5e.md` from handoff 17 was not read this session (the `_bt.mjs` harness was running at first, then finished). Read it before fixing anything.
- Carried over from handoff 17: audit S2/S3 items, remade actors outside the audited folders (Amareno, Bosco, Greyhound, Queen, Salvatore, Limonte), art stand-ins (Alice, Marine Warship), Morrow actor, transform chat-card click, Veyl walk speed, Serica Dual Wielder AC, needs-code compendium items, music organisation.
- Not pushed before this session: everything since `01e359e` on `future-work` (pushed at the end of this session if the push succeeded).

## Gotchas learned

- `import-npc.mjs` fails at login (`select[name=userid]`, option not enabled) while another harness process (such as `_bt.mjs`) holds the Automation user. Check running node processes first. Do not match on `_bt.mjs` in a PowerShell command line: the watcher matches itself.
- Pinterest "AI modified" is not in the pin HTML (it loads client-side). To check a pin, load `/pin/<id>/` in a same-origin iframe and test `body.innerText` for "AI modified" (about 4.5 s each); the Less AI filter (`filter_genai=true`) still returns tagged pins.
- Widget images hotlinked from `pinimg.com` do not render for the user. Show candidates in the Browser pane, or send a local contact sheet with `SendUserFile`.
- A bash heredoc containing `'` in the body can break the tool call; write long script files with the Write tool.
- `list-actor-folders.mjs` threw in `drive.mjs` once while the harness was busy; it worked after.

## Suggested skills

- `diagnosing-bugs` for anything the browser test found.
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`).
