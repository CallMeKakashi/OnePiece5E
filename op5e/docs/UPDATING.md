# Updating OP5e

Update from Foundry's **Setup** page: leave the world, open **Add-on Modules**, press **Update** next to OP5e (or **Update All**), then launch the world again. Foundry reads this module's manifest (`releases/latest/download/module.json`) and installs the newest GitHub release, including the version number, new compendiums and settings.

The GM gets a notice when a world opens and a newer release exists, with these steps.

There used to be an in-world "Update OP5e" button with a helper program (0.2.9 and 0.2.10). It was removed: Foundry only re-reads a module's manifest (version, new compendiums, sockets) through the Setup installer or a server restart, so an in-world update could not finish the job, and the helper meant a file-writing program on the host. Nothing needs to be run on the host to update, and the Cloudflare tunnel needs no extra route.

## Developer helper (optional)
`node scripts/ship-helper.mjs` (from the OP5e repository on the Foundry host) feeds the **Ship check** tab of the OP5e health check: stage list, minutes, live log, and Run / Stop for the full ship check. It listens on 127.0.0.1 only and needs its token (printed on start) in the "Developer helper token" setting. It cannot change the module.
