# work-E part 1 (fighter subclasses)

Comparer: all 7 files at recall >= 0.9 (only Blitzkrieg Rapid Action flagged for "5 feet", comparer token artefact; text already matches the book).

- **Arms Dealer**: all 7 features rewritten to the book. Advanced Arsenal now holds the full option list (Stasis, Hypnotic, Elemental, Exploding, Feeble, Grasping, Piercing, Homing, Shadow, Warp) with 18th-level upgrades. Fabricated ammo types (Explosive, Concussive, Smoke, Railgun, Gravity) and the invented ricochet, crit, and Smith's tools text were removed. Engineering text per book.
- **Banneret**: all features and intro restored per book (the four Commander in Chief commands, Honorable Beacon, Brave and Bold, Empowered Authority, Heroic Surge, Invincible Dominion).
- **Battlemaster**: Superior Combatant now holds the full maneuver list; Advanced Combat Tactics, Relentless Combatant, and Signature Strike corrected to the book.
- **Blitzkrieg**: Afterimage, Flashpoint, and Infinitesimal Instant were fabricated and are now per book. The ts Infinitesimal Instant was an invented "three extra turns" feature.
- **Brute**: Brute Force, Third Wind, Devastating Critical, and Survivor per book.
- **Cavalier**: all features restored. The Bonus Proficiency text is in Saddle-Born (it has a trait advancement but no feature). Find Mount text is in Warding Master and Hold the Line.
- **Champion**: Physical Superiority now has the Strength, Constitution, and Dexterity text. Signature Fighting Style has all 14 Improved styles. Invulnerable and Perfected Fighting Styles per book. The book has no Strength-mod bonus, so the invented half-proficiency bonuses are gone.

Skipped: nothing.

Discrepancies (not changed):
- Brute scale value "brute-force" uses 3/10/16 (d4/d6/d8, plus 20 per the old table). The book is 3 d4, 5 d6, 11 d8, 17 d10.
- Battlemaster scale values "superiority-dice" and "maneuvers-known" are unverified against the book. The book gives the same dice and maneuver counts as the ts.
- Cavalier Make Your Mark has a Strength-modifier use limit in the ts. The book has none (check the activity or uses).
- Arms Dealer uses: the book gives 1 + Int mod per rest. The ts `createItemChoiceRestricted` counts are only 2/1/1/1/1.
- Blitzkrieg and Banneret automation may carry the old invented mechanics (check any activities or effects).
- `npx tsc` shows errors in the fighter files (the `feat()` return type is missing advancement/activities, and `faces` is not in ScaleValueEntry). These came from schema changes by other agents, not from my description edits.
