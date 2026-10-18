# THE ENEMY FACES -- PORTRAIT, 10/9/26, [the enemy faces]

Rule 69 (all the character art is live in the game, the new fight included), rule 68a
(the party's card on the map), EVERYBODY HAS A FACE (8/27). The jump list's top row:
"a head per enemy kind in enemies.json matched to CHARACTER's dressed tier."

## WHAT WAS ALREADY THERE, READ NOT REINVENTED

CHARACTER's own [the enemy tiers dressed] (10/9) already dressed the six named brigand
tiers -- thug, poacher, marksman, raider, leader, marauder -- each in a real faction's
worn look, pulled from `records/target/bb/ours.json`, key `people_looks.band`, COMBAT's
own draft quoting Paolo directly ("thugs in the poorer crews, the raider in the Mob or
the Cartel... the armoured marauder the Remnants or the Blues, the shooters the Network
or the Colorful, the poacher the Volunteers or the Caravans, the one leader the Church").
That pairing is read here exactly as CHARACTER's own tool reads it -- `band[tierId][0]`,
the faction's `FACTION_LOOKS` entry, nothing guessed.

## THE BUG, MEASURED FIRST

`faceFor(id, over)` resolves a portrait's hair through `BOH_PERSONLOOK.lookFor(id, pool)`,
which needs a real citizen id already living in the town-population tables. An enemy tier
has none of that -- it is dressed directly off a `FACTION_LOOKS` row, nothing in the
citizen system has ever heard of `brigand_thug`. Calling `faceFor('enemy:brigand_thug')`
with no override hands back a haircut rolled off that string's own hash, same mechanism
PORTRAIT's two earlier bugs this round used, but here there was never a right answer to
drift away from -- the code had no path to the real cut at all.

Measured on the six tiers, before any fix: the random roll happened to pick a real canon
cut every time (the pool is a fixed list of 11 names), but **0 of 6 matched the cut its
own dressed body actually wears**:

| tier | faction | body wears (real) | portrait wore (before) |
|---|---|---|---|
| THUG | Homeless | LAYERED FALL | DRY TAPER |
| POACHER | Volunteers | HEAVY FRINGE | COIL CROWN |
| MARKSMAN | Network | TEMPLE TAPER | ROPE LOCKS |
| RAIDER | Mob | DRY TAPER | DUST WEAVE |
| LEADER | Church | COIL CROWN | DUST WEAVE |
| MARAUDER | Remnants | TEMPLE TAPER | HEAVY FRINGE |

## THE FIX

`faceFor`'s `over` parameter now takes `over.hairName` (slices/BOHEMIA_ALPHA_0_9.html,
beside where `_bodyHair`/`_hd` are resolved, right before the existing
`BOH_PERSONLOOK.lookFor` call). When set, it short-circuits the lookup entirely and reads
`hairDialsFor()` straight off the name passed in -- the exact same dial source the normal
citizen path already trusts, just skipping the one step (`lookFor`) that has nothing to
look up for an id that is not a citizen. Every id that does not pass `hairName` -- every
real citizen in the game -- falls through to the unchanged `else if` branch, byte for
byte the code that ran before this round.

```js
if (over && over.hairName) {
  _bodyHair = over.hairName;
  _hd = hairDialsFor(_bodyHair);
} else if (typeof BOH_PERSONLOOK !== 'undefined' && typeof GARMENTS !== 'undefined') {
  /* ...unchanged... */
}
```

This is the same pattern `over.kin` and `over.age` already use two blocks above it in the
same function -- an explicit override skips the default roll instead of fighting it.

## THE LEADER'S FACE IS THE ONE YOU REMEMBER

The row's own words. `opts.threeD` -- the 9/14 lighting upgrade (a second, darker shadow
step and a real highlight streak along the lit cheekbone, gated off the play surface by
rule 18 so it has never moved a shipped face) -- is turned on for the leader's render
only. Same face pipeline, same dials, one real visual difference: he is lit like a
person the camera cares about, the other five are lit like the crowd.

## MEASURED AFTER

All six tiers: **6 of 6** wear the real cut their dressed body wears.

Pairwise distinctness, full render compared, **background excluded** (renderFace paints
an identical gradient behind every face regardless of who it is -- comparing raw pixels
without masking that out would mostly be comparing the shared background and calling it
"alike"; the background formula is reproduced and subtracted before measuring). Closest
pair: THUG/RAIDER at 37% foreground overlap -- six distinct faces, not one face worn six
ways.

## PROVED SAFE

The new branch only activates when `over.hairName` is explicitly passed. No existing
caller in the codebase passes it; the branch that used to run unconditionally for every
citizen now runs inside an `else if`, unchanged. Checked, not assumed: rendered 200
regular citizens (`faceFor('gate:crowd:0'..'199')`, no override) on a clean
pre-change worktree and on this change, hashed every rendered buffer -- **0 of 200
differ**. His own approved face is a separate code path entirely (`buildSpec()`, never
`faceFor`) and was never touched.

GATES: talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker 16/0,
hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads 20/0,
portrait_matches_body 11/0.

## NOT HERE, NAMED HONESTLY

The row also asks for "the chipped bodies' faces wrong in the way the lore says" and
"the recap shows who you killed by face." Both are real, both are out of scope for this
round:

- **Chipped bodies are the undead** (WORDS [the enemies' names], 10/9, locked rule 63:
  "zombies are chipped bodies, via Grok"). A chipped body is not a living brigand
  wearing the wrong haircut -- by its own lore it may have no ordinary face at all.
  What a chipped body's face looks like is a DIRECTION/ANIMATION call about the look of
  a reanimated corpse, not a hair-matching fix, and nothing here guesses at an answer.
- **The kill recap screen does not exist yet.** It is COMBAT's row to build; there is
  no screen in the game today to hang a face on. When it ships, it can call
  `faceFor('enemy:'+tierId, {hairName: ...})` exactly the way this round's cook tool
  does.

IN VOTE: the six tiers' heads, `portrait-the-enemy-faces-10-9`.
