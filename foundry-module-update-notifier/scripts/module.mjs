const MODULE_ID = "foundry-module-update-notifier";

/** @type {number | null} */
let _intervalId = null;

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Module Update Notifier`);

  game.settings.register(MODULE_ID, "enabled", {
    name: "MODULE_UPDATE_NOTIFIER.SettingEnabledName",
    hint: "MODULE_UPDATE_NOTIFIER.SettingEnabledHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, "checkIntervalMinutes", {
    name: "MODULE_UPDATE_NOTIFIER.SettingIntervalName",
    hint: "MODULE_UPDATE_NOTIFIER.SettingIntervalHint",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0, max: 1440, step: 1 },
    default: 5,
  });

  game.settings.register(MODULE_ID, "notifyGmOnly", {
    name: "MODULE_UPDATE_NOTIFIER.SettingGmOnlyName",
    hint: "MODULE_UPDATE_NOTIFIER.SettingGmOnlyHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MODULE_ID, "lastNotifiedVersions", {
    scope: "client",
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(MODULE_ID, "checkNow", {
    name: "MODULE_UPDATE_NOTIFIER.SettingCheckNowName",
    hint: "MODULE_UPDATE_NOTIFIER.SettingCheckNowHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      if (!value || !game.ready) return;
      void runUpdateCheck().finally(() => {
        if (game.user.isGM) {
          game.settings.set(MODULE_ID, "checkNow", false);
        }
      });
    },
  });

});

Hooks.once("ready", () => {
  if (!game.settings.get(MODULE_ID, "enabled")) return;
  if (!shouldRunChecks()) return;
  scheduleChecks();
});

Hooks.on("updateSetting", (setting) => {
  if (setting.namespace !== MODULE_ID) return;
  if (!["enabled", "checkIntervalMinutes", "notifyGmOnly"].includes(setting.key)) return;
  if (!game.ready) return;
  clearScheduledChecks();
  if (!game.settings.get(MODULE_ID, "enabled")) return;
  if (!shouldRunChecks()) return;
  scheduleChecks();
});

/**
 * Whether this client should run manifest checks and show notifications.
 * @returns {boolean}
 */
function shouldRunChecks() {
  const gmOnly = game.settings.get(MODULE_ID, "notifyGmOnly");
  if (gmOnly) return game.user.isGM;
  return true;
}

/**
 * Whether this client should see notifications (same as run checks for now).
 * @returns {boolean}
 */
function shouldNotify() {
  return shouldRunChecks();
}

function clearScheduledChecks() {
  if (_intervalId != null) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
}

function scheduleChecks() {
  clearScheduledChecks();
  void runUpdateCheck();

  const minutes = game.settings.get(MODULE_ID, "checkIntervalMinutes");
  if (typeof minutes === "number" && minutes > 0) {
    _intervalId = window.setInterval(() => void runUpdateCheck(), minutes * 60 * 1000);
  }
}

/**
 * Resolve manifest URL from a Module document (v13 fields + source fallback).
 * @param {foundry.packages.Module} mod
 * @returns {string | null}
 */
function getManifestUrl(mod) {
  const candidates = [
    mod.manifest,
    mod._source?.manifest,
    mod.flags?.manifest,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/**
 * @param {foundry.packages.Module} mod
 * @param {string} remoteVersion
 * @param {string} installedVersion
 */
function notifyUpdateAvailable(mod, remoteVersion, installedVersion) {
  const title = mod.title ?? mod.id;
  const message = game.i18n.format("MODULE_UPDATE_NOTIFIER.Notification", {
    title,
    installed: installedVersion,
    remote: remoteVersion,
  });
  ui.notifications.warn(message, { permanent: false });
}

/**
 * Check all installed modules for remote manifest updates.
 */
async function runUpdateCheck() {
  if (!game.settings.get(MODULE_ID, "enabled")) return;
  if (!shouldRunChecks()) return;

  const lastNotified = { ...game.settings.get(MODULE_ID, "lastNotifiedVersions") };
  let changed = false;

  for (const mod of game.modules.values()) {
    if (mod.id === MODULE_ID) continue;

    const manifestUrl = getManifestUrl(mod);
    if (!manifestUrl) continue;

    const installedVersion = mod.version;
    if (!installedVersion) continue;

    let remoteVersion;
    try {
      const remote = await foundry.packages.Module.fromRemoteManifest(manifestUrl);
      remoteVersion = remote?.version;
    } catch (err) {
      console.warn(`${MODULE_ID} | Failed to fetch manifest for ${mod.id}`, manifestUrl, err);
      continue;
    }

    if (!remoteVersion || typeof remoteVersion !== "string") continue;
    if (!foundry.utils.isNewerVersion(remoteVersion, installedVersion)) continue;

    if (lastNotified[mod.id] === remoteVersion) continue;
    if (!shouldNotify()) continue;

    notifyUpdateAvailable(mod, remoteVersion, installedVersion);
    lastNotified[mod.id] = remoteVersion;
    changed = true;
  }

  if (changed) {
    await game.settings.set(MODULE_ID, "lastNotifiedVersions", lastNotified);
  }
}
