# Discord channels

Campaign Discord server channels exported to `Discord/exports/` for vault quarries. Curated content lives in `Timeline/`, `World/`, and actor pages — cite exports in frontmatter `sources`, not as table-play evidence alone.

**Export:** [[scripts/README|Discord export script]] — channel IDs in `scripts/discord-channels.example.json` (copy to `discord-channels.json`, gitignored).

## Lore & between sessions

| Channel | ID | Export | Purpose |
|---------|-----|--------|---------|
| `#world-lore` | `1382564722293080124` | [[Discord/exports/world-lore|world-lore]] | In-world headlines and reactions to PC actions — quarry for [[Timeline|Timeline]] newspapers |
| `#downtime-actions` | `1382564699228606474` | [[Discord/exports/downtime-actions|downtime-actions]] | Between-session character actions and downtime narration |

## Campaign reference

| Channel | ID | Export | Purpose |
|---------|-----|--------|---------|
| `🎨│character-art` | `1453435491117432916` | [[Discord/exports/character-art|character-art]] | Player character art, tokens, and portrait references shared by the table |
| `🍈│devil-fruit-dex` | `1382564751527251968` | [[Discord/exports/devil-fruit-dex|devil-fruit-dex]] | Campaign devil fruit registry — names, users, and notes; see [[Rules/Devil Fruits|Devil Fruits]] |
| `🧬│bounty-posters` | `1382564599877861389` | [[Discord/exports/bounty-posters|bounty-posters]] | Marine bounty poster images for PCs and known operatives; pairs with newspaper bounty updates in [[Discord/exports/world-lore|world-lore]] |

**Last export:** 2026-05-31 — character-art (33 msgs), devil-fruit-dex (37 msgs), bounty-posters (18 msgs).

### Sync notes (2026-05-31)

Thorough pass: portrait/bounty images in `Attachments/`; **25 actor pages** under `World/Factions/` with `## Visuals` (Discord `#character-art` / `#bounty-posters`). **24 campaign devil fruits** in [[Rules/Devil Fruits|Rules/Devil Fruits]] (image, power, current owner) from `#devil-fruit-dex`.

**Remaining ops:** Re-download expired CDN devil-fruit images from [[Discord/exports/devil-fruit-dex|devil-fruit-dex]] export links; sync portraits for actors marked *pending re-download* in `## Visuals`.

**Still without actor pages (if any):** Royal Flush Gang and other lore-only names — quarry remains in exports above.

## Related

- [[Timeline|Timeline]] — newspapers often sourced from `#world-lore`
- [[docs/obsidian-setup|Obsidian setup]] — `Discord/` hidden in explorer (search and links still work)
