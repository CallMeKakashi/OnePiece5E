# Updating OP5e from inside a world

1. The update helper ships inside the module: `Data/modules/op5e/scripts/update-helper.mjs`. Start it on the Foundry host (Node 20+): `node <Foundry Data>/modules/op5e/scripts/update-helper.mjs`. It prints a token; paste it into Game Settings > OP5e > "Update helper token" once.
2. When a GM opens the world and a newer release exists, a notice appears. Game Settings > "Update OP5e" shows installed and latest, then Update.
3. The update syncs the compendium documents through Foundry's own API, then the helper replaces the module files and Foundry reloads the open tabs. A release that adds a new pack still needs one Foundry restart.

Safety: the helper listens on 127.0.0.1 only, needs the token, accepts requests only from the configured Foundry origin (`OP5E_UPDATE_ORIGINS`, default http://localhost:30000), and downloads only the `op5e.zip` asset of a release of CallMeKakashi/OnePiece5E. It never touches `packs/` while Foundry runs.
