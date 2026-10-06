# Foundry and dnd5e upgrade plan (research of 2026-10-07)

Installed: Foundry 13.350, dnd5e 5.1.10. Newest: Foundry 14.368 (stable, 16 September 2026), dnd5e 6.0.5 (needs Foundry 14) and 5.3.3 (works on Foundry 13 and 14).
Sources: foundryvtt.com/releases (13.351, 14.349 to 14.368), github.com/foundryvtt/dnd5e releases (5.2.0, 5.3.0, 6.0.0). Release-note pages were read through a summariser: confirm each point on the page before acting on it.

## 1. Do now, no risk: Foundry 13.351
13.351 is the only build after 13.350 in the v13 line. It closes two remote-code-execution vulnerabilities in document modification. It is a patch inside v13 (no module changes). Later security hardening (14.361: HTML served as text/plain, data-exfiltration workarounds closed, admin-password misconfiguration; 14.365: unauthorised journal page creation, `fromDropData` permission hole) exists only in v14.

## 2. What changed (Foundry 14, builds 14.349 to 14.368)
Player and GM features: Scene Levels (multi-level scenes), Shared Fog of War, Scene Regions v2 (cone, ray, ring, emanation, surfaces, attach to tokens, copy and paste, replace Measured Templates), Active Effects v2 (expiry events, compendium packs of effects, effects that change tokens, actor data in values), Pop-out applications, Placeables palette and sidebar tab, scene transitions, chat visibility modes (In-Character), light attenuation, combat names and new turn marker, compendium search by content, canvas shake, particle generator and VFX framework, KTX2 textures, performance (3 to 25 percent), server admin and package-install improvements, macOS signing, ProseMirror only (TinyMCE removed).
Breaking for modules: `ActiveEffect#changes` moved to `system.changes`, change `mode` became a string `type`, `CONFIG.statusEffects` is a keyed object, MeasuredTemplate document removed (Regions), `template.json` systems deprecated, Wall and Region API moves, Electron 40 and Node 24 for the app. A v13 install cannot update to v14 in place: uninstall and reinstall, tested in a separate copy first.

## 3. dnd5e between 5.1.10 and now
- 5.2 (Foundry 13+): core calendar integration, activity and effect visibility rules (level ranges, availability), vehicle sheet rebuilt (crew quality, action points, group primary vehicle), damage threshold automation, 50+ improvements.
- 5.3 (Foundry 13 and 14): advancement windows rebuilt, rich text hints, NPC gear configuration, full SRD 5.1 spell list. Breaking: senses move to `attributes.senses.ranges.*`, advancement data arrays become objects (migration included), usage chat messages become message types.
- 6.0 (Foundry 14 only): compact chat cards, falling automation (with Levels), multiple AC calculations with automatic best choice, conditional Active Effect v2 changes and expiry tied to turns, region-based difficult terrain, calendar-driven recovery and bastion turns. Breaking: `ac.calcs`/`ac.formulas`, senses as objects, chat card data in system data.

## 4. What op5e can deliver without upgrading Foundry
Of the ~25 headline v14 and dnd5e 6 features:
- Through our own content or modules already installed (about 7): a compendium of premade effects (v14's "effects compendium"), token-effect items (torches, goggles, disguises) via ATL, token-attached auras via Active Auras (Aura of Freedom, Warding, Spite, Tenacity, Star of the Show), effect expiry through special durations and times-up, a falling-damage macro, pop-out windows (module `popout`), compendium content search (Quick Insert), canvas effects and screen shake (Sequencer and JB2A, plus the animations work already done).
- By upgrading only dnd5e to 5.2.5 or 5.3.3 on Foundry 13 (about 8): vehicle sheet redesign (our ships), activity visibility (level-gated activities), calendar, damage threshold, advancement redesign, NPC gear, SRD spell list, 100+ fixes. Needs op5e changes: senses paths, advancement data migration check, and a Midi-QOL, Chris Premades, DAE and Sequencer compatibility test first.
- Needs Foundry 14 itself (about 10): Scene Levels, Shared Fog of War, native Regions v2 and surfaces, Active Effects v2 core model, scene transitions, placeables palette, chat visibility modes, VFX framework, performance, admin and install improvements, KTX2.

## 5. Recommendation
1. Update to Foundry 13.351 now.
2. Test dnd5e 5.3.3 on Foundry 13 in a separate Foundry copy with the real module list and a copy of the test world; port op5e to it (senses keys, advancement migration, effect keys); ship only if the full ship check passes.
3. Build the module-only items of section 4 (effects compendium, ATL token items, Active Auras auras, falling macro).
4. Stay on Foundry 13 until Midi-QOL, DAE, Chris Premades, Sequencer, Token Magic and the others publish v14 builds, then rehearse the move on a world copy (`scripts/copy-world.mjs`) before the campaign.
