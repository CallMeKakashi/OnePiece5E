# Handoff: NPC rebuild, Tariq and Irik done (2026-10-10)

Next session continues rebuilding the archived `bb-rehearsal` NPCs through the op5e pipeline. Start with **Saeva "Longcast" Virell** (Freefield). Read [claude-2026-10-10-npc-rebuild-handoff.md](claude-2026-10-10-npc-rebuild-handoff.md) first: its workflow and gotchas sections still apply unchanged.

## Done this session

- **Tariq Solen** (`OP5E/Sand Rats`): Human Marksman 5 (Sniper), Wanderer, no role, no Haki, no fruit. L5 / CR 3, HP 72 (override), Dex 18, Archery style, Alert, longbow and dagger, Leather Armor. Idealistic Courage and Dagger +1 dropped by the user. Builder: `op5e/dev/generate-foundry-actor/build-tariq-custom.ts`, spec `specs/tariq-spec.json`. **No new art**: three filtered Pinterest searches found no match for the user's description (saved in `docs/art-credits.md`, pending section). He keeps his existing `Sand Rats/tariq.jpg` and `tariq-token.png`. Not re-verified in the Foundry UI.
- **Irik "Two-Tide" Fen** (`OP5E/Sharkfin Pirates`): Human Rogue 8 (Fencer), Navigator background and role, Observation Novice, L8 / CR 5, HP 123 (override), AC 16, Dex 20. Builder `build-irik-custom.ts`, spec `specs/irik-spec.json`. Fruit is the **compendium** Dabu Dabu no Mi item plus Test Subject (Clone summon only, Amalgamation and Flora profiles pruned), Mirror Image, Misty Step and Bait and Switch. The user said "strictly use the compendium only", so there are no homebrew features. Art: the user's pin ([8162843071341663](https://in.pinterest.com/pin/8162843071341663/)), saved as `Sharkfin Pirates/irik-new.jpg` plus a local token, logged in `docs/art-credits.md`.
- Both imported with `import-npc.mjs --replace`, then `ensure-npc-folder.mjs`. The Clone summon actor was imported first with `--keep-id`.

## Open issues

- **Bait and Switch needs a superiority die** (Battlemaster resource) that Irik lacks. The user approved the mapping; ask whether to swap it out.
- Rogue 8 under-damages for CR 5. Only HP was raised, to stay compendium-only. Ask before adding a balance feature.
- Tariq's and Irik's live actors were checked from import output only, not in the Foundry UI. The user said earlier they might not be able to log in as Gamemaster; ask.
- Tariq art still pending; the user said "use existing art for now".

## Gotchas learned

- The sourcebook has **no Ranger**; the archer class is Marksman (archetypes Beastmaster, Bounty Hunter, Sniper). Check classes, archetypes and feats in `Sourcebook/Chapter 2 Classes` and `Chapter 5 Customization` before offering them.
- `powerFork` only accepts `neither`, `fork` or `style`; a Devil Fruit goes in as the "No Devil Fruit (yet)" step (drop it in the custom builder) and the real fruit is embedded from `packs-src/devil-fruits`. Check that pack first: Dabu Dabu no Mi already exists there (description only, no activities).
- `list-choices.ts` prints warnings before the JSON; strip with `sed -n '/^{/,$p'`. Node cannot read bash `/tmp` paths on Windows; write temp files inside `op5e/` and delete them.
- Role is a required pending step even for "no role" builds; the pipeline builds without it, and the custom builder dedupes `Role: Navigator`.
- Pinterest: very long keyword queries return nothing; use shorter ones. Pin images are at `i.pinimg.com/736x/...` (read the `img` src via JS). Art lives in `D:/foundry-pi/Foundry/foundrydata/Data/one-piece-5e/npcs/<Faction>/`.

## Queue after Saeva

Kaen Solaris, Vesper; Veyl and Serica Corven; Chuckles; Calder Voss, Goru Yamashita, Marine Ensign Mk III, Mikey, Morrow; Commander Leon, Drez Crown, Petty Officer Marine; SeaBeast Hermit Crab; Marine Warship (ship actor); Alice, Cassian Valehart, Dravos, Malphas plus Thunderbird Form 2. Full list in [docs/rehearsal-migration-candidates.md](../docs/rehearsal-migration-candidates.md).
