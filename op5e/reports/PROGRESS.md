# Campaign-readiness tracker

Updated as work finishes. `[x]` done, `[~]` in progress, `[ ]` not started.

## A. Build and deploy
- [x] Build: 17 packs, 0 errors, 2,912 images clean
- [x] Fixes in this build: Zoan uses spend Devil Fruit Uses, level-scaled Hybrid/Full Beast duration, Inner Beast + Sulong, Zoan fruit prerequisite, Shop Catalogues journal
- [x] Deploy done (backup op5e-module-20261004-1313); [ ] start Foundry on the test world (user)
- [x] Foundry started on the test world
- [~] Campaign Items pack (23 docs) and journal page: written, goes out in the next build
- [~] Zoan prerequisite regex fix written, goes out in the next build (suite showed 45/47 on the first build)

## B. Automated suites against the new build
- [~] Full sweep: parallel run in progress (5 shards)

- [x] Wizard 32/32
- [x] Level-up 80/80
- [x] Optional rules 9/10 (same single CPR failure as before)
- [~] Prerequisites: 45/47 on the first build; the 2 Zoan cases need the next build

- [ ] Unit tests: 3 stale files to repair (haki-advancement imports a moved file, character-sheet-audit, equipment-grants Role: Captain)

## C. Player characters (test world)
- [~] Size, Berries, Haki, Additional Power, art, fruit and Zoan feats: rebuild script extended, runs after the next build
- [x] Zoan feats, art, Berries, Haki, size on all 10 PCs (rebuild clean, 0 issues)
- [x] Roma: Hybrid Form, Full Beast Form, Sulong tested live
- [x] Transformations: 31/31 on Roma, Hybrid, Sulong, Malphas

## D. Real-UI checks
- [ ] Create OPC for every class
- [ ] Level-up through the real UI
- [ ] Ship cannon on the legacy ship sheet
- [ ] Combat with Midi cards
- [ ] Shop Catalogues links open

## E. Multi-player
- [ ] Player users created (test world only)
- [ ] Create OPC as a player
- [ ] Permissions
- [ ] Shared combat and chat, Midi effects across clients

## F. Wrap-up
- [ ] Clean up scratch actors and scenes
- [ ] Regenerate reports (`node scripts/finalize.mjs`)
- [ ] Push (only when asked)
- [ ] Install on the real campaign world (only with explicit approval)
- Multi-player 15/15 (GM + Player + Trusted Player). Campaign needs Create Actor enabled for players.
