# THE DOOR IS THE FIGHT (COMBAT, 8/17/26, v161)

**RF4-C, first deliverable. Spec item: NONE YET, and that is deliberate.**

The 8/16 law splits the work: LAB owns the RF4 teardown spec, COMBAT owns the
implementation and builds *from* it, citing item numbers.
`records/BOHEMIA_RF4_TEARDOWN_SPEC.md` **does not exist yet**, so every RF4
mechanic is blocked and this session invented none of them.

What is *not* blocked is the thing the law names as the first thing to ship, in
its own §3 and again in §6:

> *"WHAT IS MISSING IS THE SAME WIRE THE DEMO BOARD ALREADY FLAGGED: on the walked
> surface there is NO COMBAT ENTRY POINT... INDOOR COMBAT AND THAT MISSING WIRE
> ARE THE SAME JOB: walk in a door, fight in the room."*

That is plumbing between two surfaces Bohemia already has. Not an RF4 mechanic,
no spec item needed.

## VERIFIED BEFORE BUILDING ON IT

Demo row 1 claims every `combat` occurrence in the city world is a comment or CSS.
**Checked: five occurrences, all five are comments or a CSS selector.** Nothing on
the walked surface has ever been able to start a fight.

**And the bridge was already finished.** The combat frame has accepted
`BOHEMIA_ENCOUNTER` (roster, package, playerHP, quest context, defend contract)
since v66, answers with `BOHEMIA_COMBAT_END`, and the RUN slice has driven that
exact path for weeks. **The city simply never called it.** This is not new combat
code. It is the call that was missing.

## WHAT SHIPS

1. **The city posts.** `inEnter()` is the one place a body goes through a door —
   the 8/2 doorway ruling funnels every entry through it — so that is the only
   hook, and nothing else in the walk is touched.
2. **The shell drives it**, mirroring `runEncounterIn` in shape. A second handoff
   path would be the duplicate-system mistake; this rides the same bus.
3. **He comes back where he stood.** `INSIDE.exit` already holds the exterior cell
   he walked in from, because the interior entrance *is* the exterior entrance —
   the 7/19 law doing the work, not second bookkeeping.

## WHO IS IN THE ROOM IS NOT MINE

The city has factions, bases and reach. **It has no hostility model**, and who
hates whom is canon — his. So no hostility table is authored here.

But an empty predicate means the wire never fires, which is invisible work.
ALWAYS MAKE AN ATTEMPT (8/11) covers exactly this, so it ships a real playable
attempt, marked `draft:true`, movable in one word:

- `FIGHT_ODDS` — how often somebody is in there who does not want you there.
- `FIGHT_MIN/MAX` — how many, **derived from the room's own floor plate**, so the
  fight scales with the building he chose to walk into.

**Deterministic off the footprint, never a coin flip per entry.** The same
building answers the same way every time, so the world is a place rather than a
slot machine, and he cannot farm a door by walking in and out.

Only the *archetype* rides. Names, outfits and allegiances stay placeholders until
he rules.

## DELIBERATELY NOT HERE

**The room's geometry inside the fight** — walls as cover, doorways as
chokepoints, "wide open" as exposure. That is the RF4 half (*"abilities READ THE
ROOM"*), it is what the teardown spec is for, and inventing it is what the law
forbids. The room's real dimensions ride along on the message so the spec'd
version has them waiting. **Flagged for a spec item.**

## THE BUG THE FIRST RUN FOUND

Sending no roster looked restrained. `startEncounter` maps `(spec.roster||[])`, so
it produced an **empty fight**, and the frame threw *"Cannot read properties of
undefined"*. A fight with nobody in it is not restraint, it is a broken fight.

## GATE

`gates/combat_entry_gate.js`, registered in the suite. **14 pass / 0 fail.** It
boots the alpha, opens the walked surface the way his thumb does (it is behind the
**RUN** tab — there is no `city` tab; the shell maps run → the city panel), walks a
body through a **real door via the shipped `inEnter`**, and requires a real fight
to assemble and then return him.

**Mutation-tested against itself, and that is the whole story of this gate.** The
first version drove the trigger by hand, so unhooking the door from `inEnter` left
**all thirteen checks green** — the exact present-and-dead blind spot the gate was
written to catch, reproduced inside the gate. It walks the real door now, and that
mutation takes it red.

Two of my own harness bugs, named: I clicked a `city` tab that does not exist, and
I stubbed `INSIDE` with a fake floorplan and left the city rendering an interior
with no grid, which threw and looked like a shipped bug. Both mine, both fixed.

TOOL: `tools/bohemia_combat_the_door_is_the_fight_patch.py`
