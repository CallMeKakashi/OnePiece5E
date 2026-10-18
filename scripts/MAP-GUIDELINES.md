# Map guidelines (mapgen)

Rules for any battlemap built with `mapgen.py`. The first two are enforced by the generator (`entrance` in the spec); the rest are a checklist when writing a spec.

## Enforced

1. **Everything is reachable.** Set `"entrance": [x, y]` (a floor point in squares). Mapgen flood-fills from it, treating doors as open and walls, bars and secret doors as closed. Any floor it cannot reach is printed as `UNREACHABLE` and the run exits non-zero. A deliberate dead end (stairs down, a sealed vault) must still be reachable through a door; a space with no door at all is a hidden room and must be a `secret` door.
2. **Door edges match region edges.** A door's `a`/`b` must be one whole edge of a region polygon, so add the vertices first. A door that matches nothing is ignored by the wall cutter and the wall stays solid.

## Circulation (how people actually move)

3. **One public route, one private route.** Spectators go entrance, lobby, concourse, stands. Fighters and animals go holding level, gates, pit. The two meet only at the pit edge and are separated by doors or bars.
4. **A hierarchy of space:** street, lobby (the control point), concourse (distributes), then rooms. Never open a stand straight onto the street.
5. **Two ways out.** Every room that holds a crowd has at least two exits to different spaces (egress). A room with one door is a dead end by design, so label it (cell, closet, stairs).
6. **Every stand section has its own door** to the concourse and a door to its neighbour. Sections are walled apart so a crowd can be held or cleared by section.
7. **Pit access for staff:** the pit has at least one gate on the public side (the arena's main tunnel) and gates to the holding level. Fighters should never have to cross a stand.

## Structure

8. **Outer wall is load-bearing and continuous.** Openings in it are doors, sized for their traffic. Interior dividers may be thinner.
9. **Door widths:** 1 square for a room, 2 squares for a stand aisle or gate, 3 or more for the main entrance.
10. **Seats rise toward the outside.** Benches run in arcs concentric with the pit; aisles run radially and carry the doors and stairs.
11. **Show vertical links.** Stairs, ramps, lifts and ladders are drawn and named (alcove or `stairs` prop). A drop to another level is a door to a mapped or noted space, not an empty wall.
12. **Roof and light.** Say what covers each space (seaprism glass over stands and pit, solid roof elsewhere). Light sources must exist where the map shows light: torches on walls, braziers, glass.

## Campaign flags

13. **Seaprism** is drawn blue-green (`"seaprism": true` on doors and bars, `glass` overlay for roofs). Where it covers, powers are suppressed; note it in the scene, not just the art.
14. **Hiding places** (crawlspaces, ducts) are separate noted spaces tied to a real room, with their own opening, never floating off the map.
