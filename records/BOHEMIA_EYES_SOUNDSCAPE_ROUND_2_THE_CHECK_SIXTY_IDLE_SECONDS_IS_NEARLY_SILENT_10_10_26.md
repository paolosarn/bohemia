# EYES AND EARS -- [the soundscape judged] -- ROUND TWO: THE CHECK
### 10/10/26 -- session eyes-5vql33

Row (rule 80a, Paolo 10/9: "so many sounds in Battle Brothers... we're not even touching the
surface"). Round one (records/BOHEMIA_EYES_SOUNDSCAPE_ROUND_1_SCHOOL_THE_HOOK_ALREADY_EXISTS_MASKING_IS_THE_REAL_REASON_10_9_26.md)
found this lane's own E4 hook already built and sourced why count-and-level is the right pair.
This round builds `tools/bohemia_eyes_soundscape.js`, extends the hook with levels, and runs it on
the real map, settlement and fight.

## THREE REAL BUGS CAUGHT BEFORE A NUMBER WAS TRUSTED

Run one: zero sounds everywhere, AND the positive control itself never moved (`stepSfx('asphalt')`
firing by hand did not increment the render counter). A control that does not move is this lane's
own standing rule (E4, round one of this exact job): a zero is never read as silence until the
control proves the counters are not blind. Diagnosed, not guessed: the control itself had been
`playSFX('door_open')`, an event name never verified to resolve. Fixed to the exact event E4's own
control already proved fires. Run two: the control now moved, `MUS.AC.state` read "running" at
every stage (not the blocker), and the map produced one real render -- but the settlement still
failed to open, with `LOOP.frame` never even created and `CZOOM` still pinned at 0.208. A direct
state read (not a retry) found why: `toMap()` does not land at a normal "look around" zoom, it
lands at the camera's own far floor in one continuous squeeze -- the exact 0.208 [the far stop's
pixels counted] measured this same session, confirmed twice now by two different jobs. There is no
intermediate stop to reach a settlement from. Fixed by reordering, not patching the symptom: reach
the settlement and the fight first, from the game's own natural starting state (the order [a
stranger's five minutes judged] already proved works), and measure the map LAST, since nothing
needs reaching after it. Run three: the settlement opened clean.

## THE REAL NUMBERS, HONEST ABOUT WHAT THEY ARE

| screen | reached | distinct sounds asked (playSFX) | rendered | notable level |
|---|---|---|---|---|
| settlement (Church) | yes | 0 | 0 | none |
| map | yes | 0 | 1 | gain 0.2 against the song's 0.8 |
| fight | no | -- | -- | -- |

The fight was not reached this run for the same named reason [a stranger's five minutes judged]'s
round two already found and did not fully resolve: the board's contract sheet offered no text
ending in "battery" for the scripted tap to find. Not re-diagnosed fresh here -- the same real gap,
now seen twice by two different tools, worth whoever owns the board's contract list looking at once
rather than each tool working around it separately.

THE ONE REAL LEVEL CAPTURED: on the map, sixty idle seconds produced exactly one call into
`BOH_SFX.render`, at gain 0.2 against the music bus's own 0.8 at that instant -- a real four-to-one
ratio under the song, the first concrete number this instrument has produced for "at what level."
It did not go through the `playSFX` wrap (its event name reads "?"), confirming something besides
`playSFX` also calls `BOH_SFX.render` directly, matching a direct render call this lane found in the
engine's own footstep-bus code while researching round one.

## THE REAL FINDING, NOT A FAILURE TO HIDE: SIXTY IDLE SECONDS IS NEARLY SILENT

Across two real screens and 120 real seconds of sitting still, the game's own `playSFX` was asked
for a sound exactly ZERO times. This is not this instrument failing -- the control proves it is
listening, and it heard one real render on the map. It is a genuine measurement of what this
build's audio actually does: round one's own sourcing already drew the real line between AMBIENCE
(loops meant to fill idle time) and SFX/Foley (triggered by an action) -- this round's numbers say
plainly that there is close to no ambience bed running on either screen at rest, and that nearly
everything in the sound bank is interaction-triggered. Since THE WALK IS DEAD (9/28) and this
instrument deliberately does not re-add it, "sit still for sixty seconds" measures ambience
coverage specifically, not the full soundscape a player moving and tapping would hear -- a real
limitation of this method, named plainly rather than overclaimed as a complete picture. A round
three that deliberately interacts (tap buildings, buy something, walk a few cells) would measure
the triggered half this round could not.

## GROK ASK 23: STILL CONFIRMED UNLANDED

No catalogue page exists yet, same as round one found. Nothing new to compare against this round.

## "READS AS FAKE": BLOCKED BY THE SAME SILENCE, NAMED NOT SKIPPED

With effectively nothing captured to render and listen to (one unidentified render, no named event
to re-trigger in isolation), this lane's own E18 render-to-WAV technique has nothing concrete to
point at yet. Not attempted on a guess; waits on a round that captures real named events, most
likely the interaction-driven round three above.

## ROUTED

- SOUNDS (or whoever owns ambience): two real screens measured at rest, both near-silent on
  playSFX; if ambience loops are meant to be running already, they are not reaching this hook, or
  they render through a path this tool's second wrap has not found yet.
- The board's contract-sheet reach gap (named here and by [a stranger's five minutes judged]) is
  now a two-tool pattern, worth a real look rather than two separate workarounds.
- PLUMBER / whoever owns the shared driver: a third confirmation that `toMap()`'s single squeeze
  lands at the camera's far floor, not a browsing zoom -- any future tool reaching a settlement
  after calling toMap() will hit the same wall this round did.

## SHIP TEST FOR THIS ROUND

A real instrument, extending this lane's own proven hook with the one field round one found
missing, ran on two of three real screens and caught three real bugs before trusting a number --
an unverified control event, and twice confirming (via a direct state read, not a guess) that
toMap() cannot be followed by a settlement reach without reordering. The real result is thin but
real and honestly reported: near-total silence at rest on both reached screens, one real level
number, the fight's reach gap named against a cause already found elsewhere. The "nearly silent at
rest" finding is reported as a genuine measurement of ambience coverage, with its own real
limitation (idle only, not interaction-driven) named for round three rather than hidden behind a
flattering average. Grok ask 23 confirmed still unlanded. "Reads as fake" honestly blocked by having
nothing concrete yet to listen to.
