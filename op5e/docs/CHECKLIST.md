# OP5e checklist (one thing at a time)

Legend: DONE = built and checked by an automated test or a live run. PENDING = still to do.
Branch: `future-work` (pushed, not merged to `planning`). Released so far: v0.2.8. Next: v0.2.9.
Target: Foundry 13.350, dnd5e 5.3.3 (5.1.10 still works). The campaign copy `bb-rehearsal` is where op5e is tested against the real campaign data.

## Order of work
1. Finish every ticket (done below), then ONE full ship check with everything together
2. Cut v0.2.9 and test the in-world updater against it
3. Close the tickets whose checks pass
4. Migrate the characters in the campaign copy to the new sourcebook (copy only)

## A. DONE and tested
- dnd5e 5.3.3 upgrade rehearsal (#45): the campaign copy migrates cleanly (163 actors, one bad Dagger repaired in the copy), Create OPC and level-up fixed for the 5.3 changes (advancement shape, async flow values), level-up 80/80, wizard 32/32, sweep 2,103 documents with Midi-QOL and Chris Premades on
- Modules updated for 5.3: DAE 13.0.30, Midi-QOL 13.0.66, Chris Premades 1.5.50
- Create OPC for the 9 old characters, Devil Fruit casting, text-only features (187 reviewed), shop and trade (GM approval, bargaining, player trades, coin mode), animations, cannons and ships
- Falling damage (#43), token auras (#41, tested on a real canvas), turn-based expiry (#42), ATL token-effect items (#40), canvas shake and burst (#44), best AC / conditional effects / compact chat (#46), performance budget (#47)
- Extra compendium sources (#48): GM menu, Create OPC (feats, species, backgrounds, classes, subclasses), shop Find item, dnd5e compendium browser sync (level-up choices), tested through the UI
- Audit warnings 45 to 0 (#25), import preference assertions (#23)

## B. PENDING
- Premade effects pack (#39): built, needs one Foundry restart so the new pack registers, then its live check
- Full ship check on 5.3.3 with every new stage together (an early run found and fixed bugs already)
- Release v0.2.9 and the in-world updater test (never run); the first update to a version with `"socket": true` needs a Foundry restart
- Verify by eye: MCP tools added after the smoke test, Midi flags in a real combat, how the animations look
- Migrate every character in the campaign copy to the new sourcebook, as a real-campaign test (copy only; the original world stays read-only)

## C. Decisions and facts
- Foundry stays on 13.350 (13.351 declined for now)
- `blood-and-brine` is read-only for Claude. `bb-rehearsal` is a copy and may be tested freely; Midi-QOL's settings are restored after a test run
- The release must be tested on the same Foundry and dnd5e the DM runs
- The test harnesses run in `test` or `bb-rehearsal`, never in `blood-and-brine`
- Manual items kept as documented (#27): Multipod stays text, vision-5e's default hearing-range formula, Approaching Awakening
