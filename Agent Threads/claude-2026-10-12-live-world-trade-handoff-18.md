# Handoff 18: live world cleanup and the item trade feature (2026-10-12)

Continues [handoff 17](claude-2026-10-11-audit-fixes-handoff-17.md). Its "next: Malphas" line is stale: Malphas is built (`op5e/docs/NPC-BUILDS.md`, "Malphas (2026-10-11)"). The NPC rebuild queue is empty; nothing is scheduled next.

## Done this session (details are in the commits, `op5e/docs/` and the scripts; not repeated here)

- **Single live world.** `blood-and-brine` is the only world (`bb-rehearsal` and `test` deleted). Reach it only through https://bloodandbrine.online (memory `test-via-public-url-feedback`); the user logs in on the browser pane, I never enter passwords. `op5e/.pass` holds the GM password and is gitignored.
- **Live fixes** (not in git, applied in the world): art paths for 68 actors (offline patch), actor and scene folder reorganisation from the user's mapping, Braveheart folder restored, encumbrance off, Berries-only currency, Midi `ReplaceDefaultActivities` off, 8 module macros and the "CPR - Descriptions" journal deleted, B.O.B macros moved to a folder "B.O.B". The unused world Items were **not** deleted (user: "no dont delete").
- **Lunarian Flame Investure** creations (1 per long rest, no slot) fixed at the species level, commits `997bb5e`, `0b4830b`.
- **Item trade feature**, commits `34d82e6` (feature) and the follow-up "GM can trade from NPCs": a **Trade** entry in an item's three-dots menu. Players trade from their own characters to characters of players who are online now; the receiver accepts or declines (no GM step, offers expire after 10 minutes); a public chat line records who traded what to whom for how much (a number of Berries or free); multiple items per trade. The GM can trade from any actor including NPCs. Files: `op5e/scripts/shop/item-trade.mjs`, `item-trade-lib.mjs`, changes in `shop.mjs`, tests in `op5e/test/item-trade.test.mjs` (184 tests pass).
- **Release 0.2.19** cut and published: https://github.com/CallMeKakashi/OnePiece5E/releases/tag/v0.2.19 (release workflow and CI green). Branch `future-work` is pushed. The scripts were also copied by hand into the live module (`D:/foundry-pi/Foundry/foundrydata/Data/modules/op5e/scripts/shop`), backup next to it as `shop.bak-*`.

## Verified vs not

- Verified on bloodandbrine.online from the GM session with scratch actors (deleted afterwards): offline recipient rejected; accepted trade moves items and Berries, items arrive unequipped; chat line text; NPC to player trade.
- **Not verified:** the real Trade menu entry and the Accept dialog on a player's client (I cannot log in as a player and may not create accounts on the public site). The user said they will update to 0.2.19 and can try a trade with a real player. A UI test needs two real or user-created test players (separate browser profiles, since the login cookie is shared across tabs).

## Open items

- Compendium packs (new Lunarian creation versions) are **not** deployed to the live world: needs a Foundry restart and `npm run deploy:foundry`. Affects only newly created Lunarians.
- Player to NPC trading is not built (user only asked NPC to player).
- Candidates for the next task (none chosen): build the unfiled actors Daniel and Kara "Many-Eyes" Kagemi; remade actors outside `OP5E` still on the old class data (Amareno, Bosco, Greyhound, Queen, Salvatore: Brawler; Limonte: Marksman; also Five Families, Guisseppi, Commodore, Horus, Afterimage, SSR); audit S2/S3 items listed in handoff 17; the 6 retired actors with broken art; Alice and Marine Warship stand-in art; Thunderbird Form 2 (archived, untouched).
- Scenes `Stormy Ocean`, the second `Astral Plane` and `Demo` are unfiled (user decisions); `Church of Retibution` typo not renamed.
- `op5e/dev/character-sheet-audit/output/audit-report.json` is a regenerated file left unstaged on purpose.

## Gotchas learned

- The commit hook rejects a heredoc with a `## Heading` next to `git commit`, and headers over 72 chars: write docs in one call, commit in another.
- The world LevelDB is locked while it runs; offline patching only when the world is stopped.
- To simulate a second player from the GM session: patch `user.active` in the page, then add the GM id to the request's `partners` in setting `op5e.shopRequests` before calling `game.shopTrade.respondTrade`. Clean up scratch actors, folder, requests and chat messages afterwards.
- Match actors by `_id`, never by name (duplicates: Morrow, Riding Horse, Guard).

## Suggested skills

- `generate-foundry-actor` and the op5e pipeline for any new NPC (NOT `level-up-npc`); ask the Chapter 7 additional power for non-fruit builds.
- `diagnosing-bugs` if the real two-player trade test finds problems.
- `handoff` for the next handoff (save in `Agent Threads/`, commit with `git add -f <file>`).
