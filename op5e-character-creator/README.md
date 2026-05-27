# OP5e Character Creator (Foundry v13+)

Resumable, world-side character creation wizard for the **OP5e** (One Piece 5e) content in `op5e-compendium`.

## Launch

Enable the module, then open the **Actors** sidebar and click **OP5e Creator**.

## Draft storage (world-side)

Drafts are stored in a single **world setting**:

- Module: `op5e-character-creator`
- Setting key: `drafts`
- Scope: `world`

The stored value is an object keyed by `draftId`, where each draft contains:

- `ownerUserId`: user who owns/resumes the wizard
- `step`: current wizard step (for resume)
- `data`: selected ids + entered fields (name, images, species/background/role/class, abilities, fork choice)
- `touched`: a map of wizard-owned field paths set by the owner

Non-GM users can only access their own draft; the GM can access any draft.

## Reset & Restart (wizard-owned)

Reset is allowed **only** when:

- the current user is the draft owner (`ownerUserId === game.user.id`), and
- at least one field has been written by the wizard (`touched` not empty)

Reset clears `data`, sets `step` back to the first step, and empties `touched`.

