# OP5e checklist (one thing at a time)

Legend: DONE = built and checked by an automated test or live run. BUILT = written, only partly checked. TODO = not started.
Branch: `future-work` (not merged to `planning`, not released). Released so far: v0.2.8 (test world and the old shop only).

## Order of work
1. Release v0.2.9 (ship check running, then release notes, then publish)
2. Verify what is built but untested (section C)
3. Close the open tickets that are really finished (#21, #23) and finish the small leftovers (#25, #27)
4. Upgrade rehearsal: dnd5e 5.3.3 on Foundry 13 in a copy (#45), with the snapshot as the way back
5. Module-only features: effects compendium, token-effect items, token auras, turn expiry, falling macro, canvas effects (#39 to #44)
6. D&D Beyond world packs as selectable sources (#48), performance (#47), our own dnd5e 6 features (#46)

## A. DONE and tested
- Compendium on dnd5e 5.1.10: full sweep 2,103 documents, level-up 80/80, wizard, prerequisites, rules, transformations, multi-player, walkthroughs (last full green run: before the shop rewrite)
- Create OPC for the 9 old characters (Baptiste, Matthew, B.O.B, Roma, Malphas, Hybrid, Sulong, both Thunderbird forms): classes, saves, skills, berries, gear carry over (import-old harness, 9 of 9)
- Devil Fruit: Uses pool, template grants it (and the Zoan forms), casting with Uses as spell points, Zoans only in a form, casting ability from class (fruit-casting harness)
- Text-only features: 187 reviewed with the DM; every approved one is a passive effect, toggle or button; checked live in text-batch4 to 7 (about 140 checks); about 55 stay text on purpose
- Shop: GM shows shops to players or all, presence, requests with GM approval, bargaining both ways, shop types from the sourcebook catalogues, quick stock controls, currency names, trades between characters with the other owner confirming, coin mode (shop-approval 60/60, shop-coins 9/9, shop-trade 14/14, demoed in the browser)
- Animations: 324 entries merged into Automated Animations with valid ids, AA loads clean (animations harness)
- Cannons and ships: summons, ships, cannons assertions; the Galleon sheet opens and a 12-pounder fires (summons-ships, ships-fire)
- Refresh actor from compendium, world-to-compendium sync, sourcebook update pipeline, MCP server (smoke test passed, but before later changes)
- Old campaign sheets read-only rule saved; snapshot taken by the DM

## B. In flight
- Full ship check on the current branch (all stages, about 45 minutes), then v0.2.9

## C. BUILT but not fully verified
- In-world updater (update helper, Update OP5e button, update notice): never run, needs a release to update to; the first update to the version with `"socket": true` needs one Foundry restart
- MCP server: tools added after the smoke test (learn_fruit_spell, import_old_character, prefer and haki options) were not re-run through MCP
- Old-character import: `prefer` regexes for fighting styles and Haki are in but the harness does not assert them; `matchHp` option never tested; early Haki carry not asserted
- Shop in a browser: sidebar Shop and Trade buttons after the registration fix, the trade dialog and partner prompt by eye, drag-and-drop stocking, the sell list
- Midi-QOL flags used by about 20 toggles and buttons (advantage, disadvantage, fail.disadvantage, grants.*): the keys are the ones Midi documents but no real Midi combat was run
- Auras as buttons (will be replaced by real auras in #41)
- Animation entries: the merge works, nobody has looked at whether the chosen effects look right per item; free JB2A/PSFX may lack assets
- Create OPC with the new preferences in the real wizard UI (the wizard walkthrough passed, the preferences were not exercised there)

## D. Open tickets
- #21 Shop and trade: finished and tested, can be closed
- #23 Old-character import: finished except the unasserted items in section C
- #25 Verification: summons, ships, rules done; review-sheet skim and audit warnings left
- #27 Known mechanics: hearing-range setting stays manual; cannon check done; Multipod stays text
- #38 umbrella plan for Foundry and dnd5e upgrade
- #39 effects compendium, #40 token-effect items (ATL), #41 token auras, #42 turn-based expiry, #43 falling macro, #44 canvas effects
- #45 dnd5e 5.3 on Foundry 13 rehearsal, #46 our own dnd5e 6 features, #47 performance
- #48 D&D Beyond world packs as sources (reference at runtime, never bundled, read-only on the campaign world)

## E. Decisions and facts
- Foundry stays on 13.350 (the DM declined 13.351 for now; it closes two remote-code-execution holes)
- `blood-and-brine` is read-only for Claude: list files and `world.json` only
- The release must be tested on the same Foundry and dnd5e the DM runs

## F. Later (after all work is finished)
- Migrate every character in the bb-rehearsal copy to the new sourcebook, as a real-campaign test. Copy only; the original world stays read-only.
