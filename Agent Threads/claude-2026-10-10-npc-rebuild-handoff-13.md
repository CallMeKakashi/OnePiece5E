# Handoff: Drez Crown built (2026-10-10)

Continues [handoff 12](claude-2026-10-10-npc-rebuild-handoff-12.md); read handoffs 1 to 12 for workflow and gotchas. **Next: Petty Officer Marine** (CR 2, OpenSea; ask every choice with AskUserQuestion, check each option exists in the packs first; after each NPC add the `op5e/docs/NPC-BUILDS.md` entry and the vault "Foundry build" section, tick `docs/rehearsal-migration-candidates.md`, commit, then go to the next one).

## Done this session

- **Drez Crown** is live in `bb-rehearsal`, folder `OP5E/Marines`. Commit `9f399d0`. Details are in `op5e/docs/NPC-BUILDS.md`, `op5e/dev/generate-foundry-actor/build-drez-custom.ts` and `specs/drez-spec.json`; not repeated here. Not pushed yet.
- Human Marksman 10 (Sniper), HP 165 override (under the CR 10 band 206-220, the user chose the legacy value), AC 17. The Copy-Copy Clone became the bespoke Holo-Decoy feature; its attack-disadvantage effect is text only.
- Art is the user's pick (pin 36, blond officer in a white coat; no rifle, medals or stubble), cropped above its watermark text; logged in `docs/art-credits.md`.

## Queue and open items

- Queue: Petty Officer Marine, SeaBeast Hermit Crab, Marine Warship (ship actor), Alice, Cassian Valehart, Dravos, Malphas + Thunderbird Form 2 (`docs/rehearsal-migration-candidates.md`).
- Carried over from handoffs 10 to 12: the old "Morrow" actor in the rehearsal world, the transform chat-card click, Veyl's walk speed, Serica's Dual Wielder AC, 24 needs-code compendium items, `package-lock.json` still says 0.2.11, Ensign vault file still named Mk III, Leon's katana vs rapier and his legacy vault statblock.
- Drez: his vault page keeps the legacy statblock. Light Armor Master's Dex +1 is capped away at Dex 20 only partly; the ASIs were planned around it (Dex 20, Wis 15).

## Gotchas learned

- **Point-buy math:** check the final scores add up before offering them (Human +1 all, feat Dex bonuses, ASIs at levels 4 and 8 for Marksman). An earlier offer of Dex 20 and Wis 16 was impossible and had to be corrected.
- **Pipeline steps:** the Haki Apprentice step lists only Novice options until the Novice pick is in the spec; add the Novice, re-run `list-choices.ts`, then use the Apprentice uuid it shows. Marksman gear choices include Musket and Rifle.
- **Import:** `node dev/harness/import-npc.mjs ../Foundry/actors-json/<slug>.json --replace`, then `node dev/harness/ensure-npc-folder.mjs "<Actor name>" "OP5E/Marines"`.
- **Art search:** same Pinterest scrape as handoff 12. In Git Bash, `/tmp` is `C:\Users\Admin\AppData\Local\Temp`; Read needs the Windows path. Put the shortlist sheet under `op5e/reports/imgs/` and open it with `show_pane` so the user can see it.
- Big grep over `Agent Threads/` hits the jsonl backups and floods output; exclude `Backups/`.

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline (NOT `level-up-npc`)
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`)
