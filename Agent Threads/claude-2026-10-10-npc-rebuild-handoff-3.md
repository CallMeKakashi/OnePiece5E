# Handoff: NPC rebuild, Saeva done, review and Sourcebook pass (2026-10-10)

Next session continues the `bb-rehearsal` NPC rebuild with **Kaen Solaris** (Omen Guardians), then Vesper. Read [claude-2026-10-10-npc-rebuild-handoff.md](claude-2026-10-10-npc-rebuild-handoff.md) and [-2](claude-2026-10-10-npc-rebuild-handoff-2.md) first; their workflow and gotchas still apply.

## Done this session

- **Saeva "Longcast" Virell** (`OP5E/Sharkfin Pirates`): male Human Fighter 5 Champion / Barbarian 3 Blade Master, Sailor, Deckhand, L8 / CR 5, HP 138 (override), scores 18/15/18/8/12/10. Scimitar, Shield, Javelin as the harpoon stand-in, Armament Novice. Art is the user's pin (logged in `docs/art-credits.md`). Builder `build-saeva-custom.ts`, specs `saeva-spec.json` and `saeva-barbarian-spec.json`.
- **Review of all nine rebuilt NPCs** by parallel read-only agents, then fixes strictly from the Sourcebook, re-imported and checked live. Commit `98d0556`.

## Rules learned (Sourcebook-strict)

- Proficiency bonus: +2 at L1-4, +3 at L5-8, +4 at L9-12. `build-actor.ts` was off by one and is fixed.
- Human trait: +2/+1 or +1/+1/+1. The user chose +1/+1/+1 for Saeva, Khael, Cecilia, Tariq and Irik; Soefra was not asked.
- Rage damage bonus equals the proficiency bonus (Strength melee only). Deckhand grants TWO skills plus one artisan's tool kit.
- Marksman saves are Dex and Wis. Rogue Sneak Attack reaches 5d6 at L7. The Sourcebook has no multiclass rules.
- Devil Fruit Uses: one per odd level, Paramecia +1, long rest; a Clone's Test Subject spends them and grants the eater +1 while it is up.
- Recovery lives in `uses.recovery`; rebuilt JSON stores the legacy `uses.per`, so builders convert it.

## Open items

- Irik: Mirror Image, Misty Step, Bait and Switch spend Devil Fruit Uses; his Sneak Attack is 5d6; CR 4 with HP 123 as an override (user chose to keep it).
- Blazing Bullet's burn does not end on a successful save; Mesmerizing Words has no Bardic Inspiration spend; Potent Creativity is an empty item (its +5 sits on the trick damage lines); Rage's Strength-only limit is by name only.
- Soefra's new 4th-level creations use op5e data descriptions (the Sourcebook has none); several Bard creations could not be checked against Sourcebook text.
- Versatile Fighting (Saeva) is disabled because his weapons are not versatile.
- Vault notes ("Foundry build" sections) and `op5e/docs/NPC-BUILDS.md` entries for Soefra, Khael, Cecilia, Vex, Tariq, Irik, Saeva are still missing.
- None of the NPCs has been played in a real fight; the GM login question is unanswered.

## Queue

Kaen Solaris, Vesper; Veyl and Serica Corven; Chuckles; Calder Voss, Goru Yamashita, Marine Ensign Mk III, Mikey, Morrow; Commander Leon, Drez Crown, Petty Officer Marine; SeaBeast Hermit Crab; Marine Warship (ship actor); Alice, Cassian Valehart, Dravos, Malphas plus Thunderbird Form 2.
