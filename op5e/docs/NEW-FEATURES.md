# What is new (v0.2.9)

Works on Foundry 13 with dnd5e 5.1.10 or 5.3.3 (5.3.3 is what the campaign copy runs). Midi-QOL, DAE, Chris Premades and Aura Effects are optional but unlock more.

## Shops and trade
GM shows shops to players (or everyone), players ask to buy, sell or trade, the GM approves, bargaining works from both sides, shop types come from the sourcebook catalogues, and players can trade with each other (the other owner confirms). See `SHOP.md`.

## Falling damage (#43)
Select the token(s) that fell and run `game.op5eFalling.prompt()` (make it a macro). It asks for the distance, rolls 1d6 bludgeoning per full 10 ft (max 20d6), applies the damage and makes the faller prone. A fall under 10 ft does nothing. From a macro with a set distance: `game.op5eFalling.fall(canvas.tokens.controlled, 40)`.

## Token auras (#41)
Aura of Freedom, Aura of Courage, Aura of Devotion and Aura of Tenacity follow the token and apply their changes to every creature in range (10 ft, 30 ft from level 18), and remove them when a creature leaves. Needs the Aura Effects module. Without it the features are plain text, nothing breaks.

## Token-effect items (#40)
Torch, Candle, Lantern, Lamp, Night Vision Goggles and the Disguise Kit carry switched-off effects. Torch, Candle and the Goggles start equipped (dnd5e only applies an item's effects while it is equipped). Switch the effect on (the character's effect list) when the torch is lit, the goggles are on or the disguise is worn: the token's light or image changes, and the goggles give a 60 ft darkvision sense. Needs Active Token Effects (ATL).

## Premade effects (#39)
New compendium **OP5e Premade Effects**: Dodge, Help, Half Cover and Three-Quarters Cover. Drag one to a character and use its activity.

## Turn-based expiry (#42)
Effects whose rule text says "until the start of your next turn" or "until the end of your turn" now end exactly then (through DAE special durations), not after a fixed round count. 21 effects use it today. Needs DAE and Times-Up.

## Big-hit effects (#44)
A damage roll at or above a GM threshold (default 25), or a critical hit, shakes every player's screen and plays a burst on the target (burst needs Sequencer and JB2A). Settings: **Big-hit effects** and **Big-hit damage threshold** (GM), **Screen shake on big hits** (each player can turn it off). Macro: `game.op5eFx.bigHit({ total: 40 })`.

## Extra compendium sources (#48)
Settings, **Extra compendium sources**, **Choose sources**: tick installed item compendiums (for example a D&D Beyond import). Their feats appear, labelled with their source, in Create OPC's free starting feat list. Only referenced, never copied or shipped.

## dnd5e 6 ideas (#46)
- **Best armor class** (world setting, off by default): characters use whichever AC calculation gives the highest number. Hand-set flat/custom/natural AC is left alone.
- **Conditional effects**: give any effect the flag `flags.op5e.condition` with a formula such as `@attributes.hp.value < @attributes.hp.max / 2`. It switches itself on and off with the formula.
- **Compact chat cards** (per-player setting): tighter spacing in the chat log.

## Fixes for dnd5e 5.3
Create OPC and level-up now work on dnd5e 5.3 (advancement data changed shape, and the advancement manager's automatic values became asynchronous).

## Updating from inside the world (new)
**Update OP5e** (Game Settings, GM) now opens a progress window: the steps (check, download, compendiums, warn the players, replace the files, done), a real progress bar of documents, and a clear error with what to do. Progress is saved after every compendium, so an interrupted update resumes when you press Update again, and a compendium is never left unlocked. Players get a warning a few seconds before the page reloads. It works for a remote GM too: put the helper behind your tunnel at `/op5e-update` (see `docs/UPDATING.md`).

## Health check (new)
**OP5e health check** (Game Settings, GM) runs **Quick checks** (read-only: versions, needed modules, compendiums, invalid documents, the tools, the latest release, the update helper) or **Deep checks** (a level 3 Fighter built and levelled, a sample of the compendium on an actor, falling damage, conditional effects, token auras: all on temporary documents that are deleted). A **Ship check** tab shows the developer's full ship check (stages, minutes, live log, Run and Stop) when the helper runs from the repository.
