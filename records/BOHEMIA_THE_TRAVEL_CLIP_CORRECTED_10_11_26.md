# THE TRAVEL CLIP, CORRECTED (SOUNDS, 10/11)

Row [the map's sounds]. His eleventh votes landed UP on `sounds-the-road-is-faster-10-5`
with three complaints in one sentence, all about the same judge page
(`slices/BOHEMIA_THE_MAP_IN_MOTION_10_5_26.html`, round one, 10/5):

> "The travel clip at night is terrible so just use the day one for the night one too.
> I don't know why you know there's already gonna be music and stuff that doesn't need
> to be. You don't have to fall in love with this fucked up generator humming noises
> everywhere, bro. And the dog sound effect has nothing to do with the dog bro. It's
> really bad. I hate it."

## What was actually wrong

The footstep bed itself (the thing the id is named for) was never the complaint -- he
voted it up. The page's own demo "travel clip" bolted three things onto that bed that
were never part of the row's approved content:

1. **Night played a different, busier clip than day on purpose** (insects added only
   on the "ROAD, NIGHT" button). He is right that this reads worse, not better.
2. **A generator cue fired at 5 s on every play**, on a page that already plays over
   music. Repeated across this lane's own work ("everywhere"), it reads as a crutch.
3. **A dog cue fired at 7 s.** This was `dog_far` -- a candidate that is DOWN on all
   five of its own variants and has been graveyarded since 8/12 (confirmed again in
   [the map's sounds] round three, 10/9: "the dog has never once played through this
   mechanism... because it was killed before this row was ever written"). It was never
   approved, never had a real render anyone judged, and should not have been on a page
   that plays like it is live content. He heard it and correctly said it does not sound
   like a dog, because it is not a judged dog sound -- it is dead content that slipped
   into a demo assembly.

## The fix

`slices/BOHEMIA_THE_MAP_IN_MOTION_10_5_26.html`: the clip is now one thing, the same
for road or dirt, day or night -- the footstep bed, one wind_gust at 2 s, thinning out
at 10 s. No insects auto-added, no generator, no dog. The standalone insects candidate
(section TWO) is untouched and still its own unjudged item; the standalone wind_gust
button (section THREE) is kept as a reference since it is real, approved content; the
generator and dog buttons are removed from the page entirely, not just from the clip,
since GRAVEYARD IS FINAL means dog_far does not get a button on any page suggesting it
is live.

## What this did not touch

No engine file changed (the fix is entirely in the demo-page assembly, not in
`footstepModelled`, `travelRoadBed`, `travelDirtBed` or `nightInsects`). No VOTE
registry change: the three registered ids on this page (`sounds-the-road-is-faster-
10-5`, `sounds-dirt-is-slower-10-5`, `sounds-the-night-has-insects-10-5`) are unchanged
-- his UP on the road bed stands, the complaint was about the surrounding demo, not the
material. `gates/cooked_sounds_gate.js` 238/0, unchanged (no claim reads this page's
clip assembly). `gates/vote_tab_gate.js` 35/2, both reds pre-existing and owned by
other lanes (TUNING's why-length, COMBAT2's missing twin), confirmed unrelated.

## Verified live

A standalone Playwright check plays the corrected "ROAD" clip for its full 10 s: zero
page errors, no generator or dog call anywhere in the page's own source, both clip
buttons relabelled (no "NIGHT"/"DAY" distinction left to contradict).
