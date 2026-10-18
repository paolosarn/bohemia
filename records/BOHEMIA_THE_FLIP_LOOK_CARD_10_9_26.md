# THE FLIP LOOK CARD: THE TRANSITION BETWEEN GENERATIONS (DIRECTION 10/9/26, row [flip look])

Rule 37j (Paolo 9/27, his third votes: "a filter, a cut, a sound... we can't do this cheap"; the phone and the world
change look; the phone cracked at the start, "bougier and busier" with progress; the flip unlocked at some point in
each act, never at the start). Rule 31 (the three acts at once, one tap on the phone). Rule 45 (the narrator's biggest
moment is the flip: it reads the year). SOUNDS' [flip sound] (records/BOHEMIA_WHAT_A_FLIP_SOUNDS_LIKE_9_25_26.md: a
receiver crossing years, inside one beat, heard hundreds of times). DYNASTY [one then heirs] owns when an act unlocks.
Picture in VOTE: slices/vote/DIRECTION_THE_FLIP_IN_FOUR_BEATS.png, the four beats drawn on the game's own frames.
Tool: tools/bohemia_direction_flip_look.js (+ .py).

## WHAT THE FLIP IS TODAY (measured on the alpha, the game's own unlock and flip)
**Flipping act 1 to act 3 changes 0.0% of the world on screen**, during the flip and after it: same map, same clock,
same batteries. Only the phone's highlight moves and a name panel opens. That is the cheap flip he ruled out, and it
is not a pixel problem first: the world of act 3 is not derived on the map yet (DYNASTY / WORLD, rule 31). The card
below is what the look does; it lands on a world that has to have changed.

## THE TWO NEWEST RULINGS, RECONCILED
SOUNDS read rule 31 as "a sound he will hear hundreds of times, so it fits in one beat". His 37j (newer) says the flip
is a big deal. Both hold, because there are TWO flips:
- **THE FLIP (every time): 4 beats, 2 seconds.** Short enough to do a hundred times; a full transition every time,
  never a toggle.
- **THE OPENING (the first time an act unlocks, once per act per game): 16 beats, 8 seconds.** The big one.

## THE FLIP, BEAT BY BEAT (4 beats at 120 BPM)
0. **HOLD.** His thumb on a face on the cracked phone. Nothing else moves (R3).
1. **TEAR.** The phone's own tape loses tracking: rows of the phone's screen slide sideways, a head-switch band at its
   foot, the face smears. INSIDE THE PHONE ONLY (R8: damage lives in a screen, never on the world). SOUNDS' receiver
   crossing years starts here.
2. **DRAIN.** The world outside the phone goes dark by night's arithmetic, value multiplied down, hue untouched (R4,
   the cloud rule). The phone's black glass shows only WHO and WHEN in the institution's calm type: "PERLA / +70 YEARS".
   No title card, no decoration, no exclamation (R5).
3. **CUT.** On the downbeat, a hard cut to the SAME CAMERA, SAME ZOOM, SAME PLACE in the other act, the world's value
   back. The camera never moves (R2): because the frame is the same, what changed is the only thing the eye reads.
   The HUD's clock, batteries and the phone change with the act; nothing else on the HUD moves.

## THE OPENING (once per act; the first time it unlocks)
Beats 0 to 3 as above, then 12 more beats held on the new act's frame: the narrator reads the year in the machine's
too-even voice (45a's biggest moment; never in the first minute, which the unlock already guarantees), and WHAT CHANGED
RISES ON THE BEAT, one thing per beat, each a real row of the derived future (R7): a district's lights that came on, a
tower that went up on a lot he held, a block that fell because it was raided (37c, the future goes both ways). The
camera still does not move; the changes come to it. Then the phone's new face is his.

## WHAT CHANGES LOOK AFTER (the three eras card, records/BOHEMIA_THE_THREE_ERAS_LOOK_CARD_9_24_26.md, made visible)
- **THE PHONE PER ACT** (his "bougier and busier"): act 1, the cracked iPhone (as shipped); act 2, the same phone
  repaired: tape on the crack, a sticker, a second-hand case; act 3 rich, a clean glass slab whose screen is the
  machine's smooth finish (the AI-slop strand, pair 1); act 3 poor, act 1's phone forty years older, yellowed, the
  crack spread.
- **THE WORLD:** the ledgers decide it, never a palette. Wear dialled down by earning, lights by power held, buildings
  by footprints built. The register and the hue 18-47 world stay at all three dates.

## NEVER (the cheap versions, by name)
A whoosh or riser; a white flash; a swirl, ripple or dissolve shader; a glitch filter over the world (R8); a camera
zoom or pan (R2); a loading screen; a "70 YEARS LATER" title card in decorative type; a different HUD per act.

## OWNERS
RUN or UI: the four beats on the phone and the HUD (the tear inside the phone, the drain as a value multiply, the cut).
SOUNDS: [flip sound] across beats 1 to 3; the narrator on the opening. DYNASTY / WORLD: the derived act-3 world the cut
lands on, and the list of changes the opening raises. COOK: the phone per act (four phones). DIRECTION judges the
first build from the game's camera.

```json
{"card":"FLIP_LOOK","date":"10/9/26","row":"[flip look]","rules":["37j","31","45a"],
 "today":{"world_changed_act1_to_act3":0.0,"world_changed_during_flip":0.0,"what_moves":"the phone highlight and a name panel"},
 "two_flips":{"flip":{"beats":4,"seconds":2.0,"when":"every flip"},"opening":{"beats":16,"seconds":8.0,"when":"first unlock of each act, once per game"}},
 "beats":[{"n":0,"name":"HOLD"},{"n":1,"name":"TEAR","where":"inside the phone only (R8)"},{"n":2,"name":"DRAIN","how":"world value multiplied down, hue untouched (R4); phone says WHO and WHEN in the institution's type"},{"n":3,"name":"CUT","how":"same camera, zoom and place, the other act (R2)"}],
 "opening":"narrator reads the year; what changed rises one per beat from the derived ledgers (R7, 37c both ways)",
 "phone_per_act":{"act1":"cracked iPhone","act2":"repaired: tape, sticker, second-hand case","act3_rich":"clean glass slab, the machine's smooth screen","act3_poor":"act 1's phone forty years older"},
 "never":["whoosh","white flash","swirl/ripple/dissolve","glitch over the world","camera move","loading screen","'70 YEARS LATER' card","a different HUD per act"],
 "owners":{"RUN/UI":"the four beats","SOUNDS":"flip sound and narrator","DYNASTY/WORLD":"the derived world and the change list","COOK":"four phones"},
 "picture":"slices/vote/DIRECTION_THE_FLIP_IN_FOUR_BEATS.png"}
```
