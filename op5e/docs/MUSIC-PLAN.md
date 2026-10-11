# Music organization plan

Draft for review (2026-10-11). Source: the `bb-rehearsal` playlists (a copy of the live world) and `Data/music`.

## Current state

- 13 playlists, 120 sounds, all in the `Session` folder (one at the root). No sound is in two playlists, and every file in `Data/music` is already used.
- 47 more files sit in `Data/music/Characters/<name>/` and are **in no playlist**: they look like per-actor themes.

| Playlist | Sounds | Role today |
|---|---|---|
| Session/B.O.B | 1 | single theme |
| Session/Baptiste | 1 | single theme |
| Dropped_Audios | 1 | single theme |
| Session/General combat | 24 | mood/combat pool |
| Session/Intense | 49 | mood/combat pool |
| Session/Jack | 1 | single theme |
| Session/Mira | 1 | single theme |
| Session/Obsidian | 1 | single theme |
| Session/Obsidian Combat | 15 | mood/combat pool |
| Session/Roma | 1 | single theme |
| Session/Tigor | 1 | single theme |
| Session/Tray | 1 | single theme |
| Session/travel | 23 | mood/combat pool |

## Character theme files (not in any playlist yet)

| Folder | Files |
|---|---|
| Ace | Shiro SAGISU - Invasion |
| Admiral-Lee | Paul Drew - Aoi Todo Theme (from Jujutsu Kaisen) - Epic Rock Version |
| Aegir | cecil; dominion-aegir; drums-of-oppression-imu-s-theme-x-drums-of-liberation-one-piece-epic-version; Samuel Kim - Lacrimosa - Epic Version (Mozart) |
| Arancio | Kill Every Venue - Vegeta's Theme (Hells Bells) Metal Cover |
| Armano | PokéMixr92 - One Piece - Katakuri's Theme |
| Briggs | Akira Senju - To Be King |
| Capones | Shiro SAGISU - Treachery |
| Dravos | Dravos |
| Fenris | Fenris Wolfblood |
| Joker | Colm R. McGuinness - Hoist the Colours; Soap&Skin - Me and the Devil |
| JuLee | Evan Call - Zoltraak |
| King | PokéMixr92 - Full-Force Kamehameha (From 'Dragon Ball Super- Broly'); Ramin Djawadi, Tom Morello - Pacific Rim (feat. Tom Morello); Samuel Kim - The Very Very Very Strongest - Epic Version (from 'One Piece'); TeamFourStar - The Final Flash |
| Linus | linus-theme |
| Lunarfolds | BURN IT ALL DOWN (INSTRUMENTAL) ｜ Worlds 2021 - League of Legends |
| Malak | Malak |
| Obsidian | Dio's Theme - Epic Version_spotdown.org; PokéMixr92 - Broly Evolves (From 'Dragon Ball Super- Broly') |
| Ribes | Jett Black - Heavenly Blooming Madness (TYBW Shunsui vs Lille Battle Theme Imagined) |
| Salvatore | Friedrich Habetler - Perfect Cell Theme |
| Serica | Get Jinxed (Instrumental) |
| Simon | Dude's Cover - Unohana Bankai Theme (From 'Bleach- Thousand Year Blood War'); Unohana Bankai Theme (From _Bleach_ Thousand Year Blood War_)_spotdown.org |
| Sixfolds | Don Toliver - TORE UP (Official Instrumental) |
| SpiderNest | Dude's Cover - Zanka no Tachi Theme (From 'Bleach- Thousand Year Blood War'); Ergun Bicer of Moody Music - Kenpachi's Bankai Theme |
| Tray | Dragon Smasher_spotdown.org; Evan Call - Dragon Smasher |
| Veyl | Haikyuu!! To The Top OST - Miya Atsumu |
| Vireth | control-aegir; Instrumental King - Welcome To The Jungle; Linkin Park - One Step Closer (Instrumental); Motörhead - Ace of Spades (40th Anniversary Master) (Instrumental); Strueres - Hells Bells (Instrumental Version); Strueres - Highway to Hell (Instrumental Version); Strueres - Shoot to Thrill (Instrumental Version); The Hit Crew - Back In Black - Instrumental |
| Vorro | O Fortuna from Carmina Burana - Vocal_spotdown.org; Pergolesi_ Stabat Mater_ V. Quis est homo_spotdown.org; RoomTone - The Cyborg Fights; The Phantom Of The Opera_spotdown.org |

## Proposed structure

- **Moods** (playlist folder): Combat, Boss, Intense, Travel, Calm, Tension, Sad. Existing pools (General combat, Intense, Obsidian Combat, travel) become the first mood playlists; the rest are sorted by title once approved.
- **Themes** (playlist folder): one playlist per actor, named after the actor page in `World/Factions/`, holding that actor's songs. The single-song playlists (B.O.B, Baptiste, Jack, Mira, Obsidian, Roma, Tigor, Tray) and the `Characters/` folders feed it.
- Actor to theme link: a world flag on the actor (`flags.op5e.theme` = playlist or sound id) plus a play button on the sheet.

## Build steps

1. Approve the mood list and the actor-to-folder mapping (this file).
2. Generate a playlist pack in op5e from the approved mapping (data/src to packs-src to packs), so both worlds import the same playlists.
3. Theme flag and sheet button (GM plays the theme; the synchronized-music code keeps players aligned).
4. Import step for the worlds (macro, like the actor bundle).

## Open questions

- Which moods do you want? (the list above is a guess)
- Should one actor be able to have several themes (e.g. calm and battle), or exactly one?
- Keep the character folders as they are on disk, or may I move files? (Moving breaks existing playlist paths, so I would not.)
