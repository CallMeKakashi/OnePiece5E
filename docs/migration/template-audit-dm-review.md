# Template audit — needs DM review

Generated during Tier 1 frontmatter pass (scope D). Do not auto-fix without confirmation.

| Note | Issue |
|------|--------|
| `Characters/B.O.B.md` | Empty file — PC stub or delete? |
| `Characters/Malphas.md` | `type: Players` — confirm PC vs NPC/antagonist |
| `Crew/Unnamed Party Member.md` | Empty file — fill or remove? |
| `Characters/Baptiste` vs `World/Factions/Blackhand/Baptiste` | Same name, different people (disambiguated in prose) — OK |
| `Timeline/Undated/[Backstory] Liz, Raid Kingdom, and Baptiste rescue` | No `in_world_start` — intentional undated? |
| `Timeline/Dates.md` | Reference index, no `type:` — OK as non-entry? |
| `Party NPC's/Shako.md` | `status: draft` on NPC — keep or drop? |
| `Party NPC's/Kalla of Shandia.md` | Uses `#### Backstory` instead of template `# Backstory` — content left as-is |

## Applied without review

- List `type` for people/rules; scalar `type` for Timeline
- `publish: true` added where missing (in-scope notes)
- `status: draft` added only on Rules notes missing it (e.g. Inspiration)
- NPC headings `### Voice` / `# Description` prepended where absent (body unchanged below)
