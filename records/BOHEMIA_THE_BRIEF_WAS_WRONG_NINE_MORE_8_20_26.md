# NINE MORE MOMENTS WHERE THE BRIEF IS WRONG, NOT THE SOUND (8/20/26, SOUND lane)

## WHY THIS FILE EXISTS

This morning Paolo killed the MONEY MOVES moment with a canon ruling:

> "THERE IS NO PAPER NO COINS COINS GET MELTED DOWN TO RESOURCE PARTS WHAT
> DONT U UNDERSTAND"

Fifteen candidates across three sound sources had died on that moment, and the
lesson locked in `laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS_8_20_26.md` was:

> A moment that dies with EVERY candidate across MULTIPLE SOURCES is not a
> cooking failure. It is a BRIEF that does not describe his world.

That law was written from ONE instance. **There are nine more sitting in the
same data, and nobody had ever looked.** After his 500-thumb sweep, 27 labelled
moments hold no approved sound. Strip the ones deliberately ruled silent (the
ten doors), the ones already answered by a renamed sibling (reload is `mag_home`,
out-of-breath is `lungs_burn`, neon is `sign_alive`, the six 8/16 raw-synthesis
retirements), and nine are left. **Every one of them died across two or three
separate sources.** That is the signature. This is the diagnosis, so that the
next session does not cook an eleventh candidate for any of them.

## THE NINE

| moment | ids tried | dead | what it actually is |
|---|---|---|---|
| YOU STEP INSIDE | go_inside, cross_in | 10 | **a MIX event. FIXED THIS TURN.** |
| THE FIGHT IS OVER | clear, clear_still, gone_quiet | 15 | **already answered by STING** |
| IT IS DONE | quest_done, done_ring | 10 | music, not SFX |
| SOMEBODY TURNS TO YOU | talk_start, turn_to_you | 10 | a BODY, not a tone |
| YOU OWN IT NOW | deed, deed_stamp | 10 | music, not SFX |
| A DOG, FAR OFF | dog_far, dog_cry, dog_calls | 15 | the rack cannot make an animal |
| THE CAR TICKS | car_heat, panel_tick | 10 | genuinely a cooking miss |
| FOOTSTEP: BROKEN GLASS | step_glass, glass_crunch | 10 | **no trigger exists** |
| FOOTSTEP: METAL DECK | step_metal, deck_ring | 10 | **no trigger exists** |

Ninety-five dead candidates. Not one of them was a synthesis problem.

## 1. YOU STEP INSIDE — a room is a STATE, not an event (FIXED THIS TURN)

His own brief said it and was right the whole time: *"crossing into a building.
the ROOM is the sound, not the door."* Ten candidates still tried to be a
one-shot SAMPLE of a room, which is a thing that cannot exist. A room is not an
event. You hear a room by the air CHANGING.

**The air was already correct and already approved** — `air_inside`, `air_day`
and `air_night`, five candidates each, all his. What was broken was WHEN. `where`
learns you are indoors within four seconds, but `tick` only fires on a 40-to-95
second gap, so the air of a room arrived up to **a minute and a half** after you
walked into it. That reads as random weather, not as the building you are
standing in. The crossing itself was silent, which is precisely the hole ten dead
candidates were cooked to fill.

FIXED: the crossing now ARMS the clock instead of waiting for it, and forces the
BED rather than `pick()` (stepping outside must hand you the outside air, not a
dog). Same sounds, same mix, same bed. The only change is that the room arrives
when you enter it.

## 2. THE FIGHT IS OVER — it was already answered and nobody noticed

Fifteen candidates, three ids, all cooked to be a NOISE THAT MEANS SILENCE. That
is a contradiction: you cannot play a sample that means absence. Standard
practice everywhere in game audio is that "the room goes quiet" is done by
REMOVING things — the combat bed stops, the ambience returns, the low end drops
out — never by adding a one-shot.

And that machinery already ships: **STING** fires on `BOHEMIA_COMBAT_END`, and
the music transition out of combat is phrase-aligned (8 bars) on purpose. The
moment has a sound. It is a musical one. `clear`, `clear_still` and `gone_quiet`
were fifteen attempts to duplicate, as a sample, something the music system was
already doing better. **Do not re-cook. The moment is covered.**

## 3 and 5. IT IS DONE, and YOU OWN IT NOW — these are MUSIC

*"the one moment that earns the whole room."* *"ownership is the whole spine of
the game."* Both briefs describe a NARRATIVE PAYOFF, and both were filed as
sound effects. A payoff that "earns the whole room" is a musical cue — it needs
harmony, a key, and a length, and none of those are things a 200ms one-shot has.
Twenty candidates died trying to be a fanfare without being music.

Both triggers exist in the run (a quest-completion hook; `deed` appears 31
times), so these are BUILDABLE — as stings, in the music system, alongside the
combat sting that already works. **That is the next real feature in this lane.**

## 4. SOMEBODY TURNS TO YOU — the brief defeats itself

*"small: a person is not an event."* A brief that asks for a sound small enough
to not be an event is asking for something inaudible, and an inaudible candidate
gets thumbed down for being nothing. It cannot win. Both ids carried the same
self-defeating sentence, which is why both went 0 for 5.

What a person turning to you actually sounds like is a BODY: cloth shifting,
weight moving onto the other foot. That is foley with a source, not an abstract
quiet tone — and `cloth_on` is approved, so the family demonstrably works. If it
is re-briefed, it is re-briefed as a body.

## 6. A DOG — the honest answer is that the rack cannot do it

Fifteen candidates across three ids. This one is NOT a brief error: "the only
other living thing you can hear" describes his world exactly. It is a
CAPABILITY limit. An animal vocalisation is formant structure over a voiced
source, and the 602-voice rack is struck bodies, plates, strings and air. It can
be pushed toward a wail (`dobrowail`, `harmonicawail`, `shofar` were tried) and
it lands as an instrument imitating a dog, which is worse than no dog.

**Recommendation: leave it silent and stop spending candidates on it.** The
valley being empty of animals is not a defect, and a bad dog is worse than none.

## 7. THE CAR TICKS — the only real cooking miss of the nine

Cooling metal ticking is physically simple and the brief describes the world
correctly. Ten candidates still died. This is the one moment on this list where
another cook is a legitimate move, and it should go sparse and irregular:
cooling metal ticks are *unevenly spaced*, which is the thing a quantised rack
gets wrong by default. Note the 120 BPM law fights this moment specifically.

## 8 and 9. GLASS AND METAL FOOTSTEPS — there is nothing to trigger them

The ground classifier returns exactly six surfaces: asphalt, concrete, dirt,
gravel, sand, wood. **There is no glass and no metal anywhere in it.** Twenty
candidates were cooked, judged and killed for surfaces the player cannot stand
on. Even a perfect one would never have played.

This is a WORLD-lane dependency, not a sound task. Until the classifier learns
those surfaces, cooking for them is pure waste. `cross_ns`/`cross_ew` are in the
same position on the art side and for the same reason.

## WHAT THIS CHANGES ABOUT HOW THIS LANE WORKS

Before cooking a replacement for any dead moment, in this order:

1. **Does a trigger exist?** (glass and metal footsteps: no. Twenty wasted.)
2. **Is it already answered elsewhere?** (the fight is over: yes, by STING.
   Fifteen wasted.)
3. **Is it a one-shot at all,** or is it a mix event or a musical cue? (step
   inside, it is done, you own it now: thirty wasted.)
4. **Does the brief describe HIS world?** (money: no. Fifteen wasted.)
5. **Can the rack physically make it?** (a dog: no. Fifteen wasted.)

Only then cook. Ninety-five of the ninety-five dead candidates on this list fail
one of those five questions, and every one of those questions can be answered by
reading the repo before a single sample is rendered.
