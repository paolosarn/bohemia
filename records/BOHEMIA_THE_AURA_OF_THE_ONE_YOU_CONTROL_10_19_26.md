# THE AURA OF THE ONE YOU CONTROL, ROUND ONE: THREE CANDIDATES IN VOTE (ANIMATION, 10/19/26, row [the aura of the one you control])

Rule 120(c) (Paolo 10/18, LOCKED), rule 115 (the rig's look; CRASHBOX: held poses, nothing glows), rule 114 (not vibe
coded), rule 107 (eight directions), rule 100 (a candidate until his FINAL, nothing in the game), rule 118 (a card id or
NOT IN A TAB YET), rule 108 (no art drawn rectangle by rectangle in code), PURPLE RESERVATION 7/10 and NEUROLINK 7/10,
rule 12 (a premise is measured). Opened by the coordinator (rules 111, 112); Opus 5.5 at Extra (rule 116).

## HIS WORDS (records/BOHEMIA_PAOLO_THE_COMBAT_IS_STILL_ASS_GUNS_FIRST_THE_AURA_AND_THE_FACE_IS_THE_BODYS_10_18_26.md)
"when you're controlling a person, there should be like some aura like some fifth dimensional, analog horror... the fifth
dimension Electric amalgamation vibes, bro so like I need to be able to see that more and when I'm in control of a
character... around that character even on the big map not just a portrait"

## THE CANON READ FIRST
- GDD v2, The Fifth Dimensional Element: the Amalgamation 'touched something above time'; never confirmed, never explained.
- GDD v2 s15, Second Bar, Time Dilation: 'the game's fifth-dimensional element made into gameplay... enemy movement
  trajectories become visible, where they are going'. A: THE ECHO's ahead copy wears the step he is about to take.
- GDD v3, Prince Hobo: 'This ambiguity is permanent and must never be explained.' The aura is a look, never a word.
- PURPLE RESERVATION 7/10 + NEUROLINK 7/10: purple is the Amalgamation's alone (the hatch, its agents). THE REWIND 8/15:
  'associate, never explain', and purple never carries meaning alone. So NO CANDIDATE CARRIES PURPLE (ROUTED below).
- The rhythm ideas 7/19 s4 THE BREAK: groove cashes into the fifth dimension on the beat. All three live on the 120 grid.

## MEASURED FIRST (rule 12)
- THE FIGHT HE PLAYS (slices/BOHEMIA_FIGHT.html, COMBAT's): seed 5, suburb, his phone (390 x 844 at 3x): twelve of his men in
  two packed columns, the man acting marked only by GAFFER TAPE on his tile's corners: 126 px (css) round the poncho
  crewman's tile. In a packed column the man in front stands on that tile, so the tape reads as HIS. That is the
  complaint, measured: the only mark points at the wrong man.
- The fight's sheets have TWO facings (SE, SW); the rig's crewman (PORTRAIT's cast_poncho through DIRECTION's master rig,
  the man whose turn it is at seed 5) has eight. Eight directions are shown on him; the fight shows its two.
- The fight's man is drawn at 3 phone pixels an art pixel while its ground is at one (the board's own two pixel sizes, not
  this lane's): every aura pixel sits on the MAN's grid.
- THE MAP DRAWS HIM ONLY WHEN THE PARTY MOVES: at rest MAP_DREW.youCount stays 1 while render() makes 78 blits; the map
  reuses its last picture (right for a phone). So the map clips are the map's own frame, his own body sprite and the exact
  box the map blits it in, with the aura drawn by the same calls RUN will make.

## THE THREE (slices/vote/ANIMATION_THE_AURA.js: BOHEMIA_AURA.draw(kind, 'behind'|'front', g, o))
A. THE ECHO (the fifth dimension, above time): two copies of him a beat out of step, one ahead along his facing in a stride
   of his own walk (the step he is about to take), one behind where he was; his own pixels laid along the cold
   chrome-and-glass ramp (glass_eye, chrome: no purple, no blue) on every other row like a broadcast ghost; each beat they
   snap out of him and fall back in three held steps, furthest on the bar's first beat; drawn BEHIND him.
B. THE TEAR (analog horror): the picture cannot hold him. In a house-wide band the rows comb like a paused tape (the two
   fields a pixel apart, swapping each slot), a tear rolls up through him once a bar with dead-channel specks (runway
   black and tape grey), the band kicks two pixels on every beat (three on the one); ragged sides held a beat; only the
   board's own pixels move.
C. THE CURRENT (electric): bent wire and crumpled foil, MODELLED IN BLENDER (tools/bohemia_animation_the_aura_current_prep.py,
   reference/models/bohemia/aura_current.glb: a stand-in body so arcs behind him are hidden, 32 arcs over twelve keys) and
   rendered by DIRECTION's master rig UNCHANGED (breaks []), eight facings x twelve keys (three a beat), the biggest on the
   bar's first beat; the bake keeps only the arcs' own pixels by the rig's object-id pass (tools/bohemia_animation_the_aura_current_bake.py).

Every change lands on a twelfth of a second (six slots a beat at 120; the dog pack's grid); no filter, composite mode,
blur, glow, gradient or see-through wash; nothing traces his silhouette.

## THE PASSES, AND WHAT EACH WAS FOR (rule 97: by eye, then stop)
1. THE TEAR, round one, slid the ground a pixel on most slots: invisible on a busy board. THE COMB added: every slot reads.
2. THE CURRENT on the fight read faint: pale wire on a pale man on tan. A dark edge added after the pipe (rule 114c's
   hand-finish), then the wire thickened 2.5-3.5 cm to 4-5.5 cm (2 to 3 px), then a fourth arc on each of the bar's other
   beats (the weakest beat showed 159 px, then 195 px from behind because beat two's arcs were all on his front: moved one
   to his back). Specks of arc peeking past the stand-in's small head became black boxes on the crewman's hair once
   edged: pieces under 8 px are dropped.
3. DIRECTION's style guide, through the NOT VIBE CODED first five on the man-wearing-it pictures (16, two candidates x
   eight facings): the echo inked to six ramp steps carried the top eight colours at 25 to 50 percent (G2's line 11.1:
   the guide's own NEVER, a snap to a short list); the arcs' one flat edge colour, 15 to 23. Fixed at the root: the echo
   runs ALONG the ramp over his whole value range; the edge is SELECTIVE (only on the side away from the one sun, below
   and right) and runs along the runway-black ramp by the brightness of the wire above it. (A try that took the edge from
   the rig's shaded wire kept the colours but went soft grey and read lit from below on two facings: dropped.) Now 16 of
   16 pass D1 to D5.

## THE GATE: gates/the_aura_of_the_one_you_control_gate.js (THE AURA OF THE ONE YOU CONTROL, in the suite) 29/0
The floor is the mark it joins: on every beat, in every facing, at least TWICE the tape corners (252 px): echo 401, tear
3,139, current 415 at the least. Held inside every twelfth (echo 9, tear 24, current 12 different pictures a bar). Never
an outline (hugging minus a few px out: echo 18.0%, tear 11.4%, current 1.7%; the line 25%; a planted pale ring 100%,
caught). No loud colour or purple added (0 of 154,012 / 1,302 / 43,068; a planted purple echo caught). No filter, blur,
glow (a planted shadowBlur caught). The echo and the current differ by facing (98.7%, 95.9%; the tear tears along the
screen's rows, held to claim 1 in every facing). Nothing in the fight, demo, map or alpha (rule 100). The clips two bars to
the millisecond. A planted aura that moves between slots is caught.

## IN VOTE: animation-the-aura-of-the-one-you-control-10-19 (options A the echo / B the tear / C the current / NO)
The page (slices/vote/ANIMATION_THE_AURA.html): the three on the real fight from the game's camera, side by side at one art
pixel to one phone pixel (two bars, held, lossless); the same man with no aura (the twin); all eight directions live on
the rig's crewman; ON THE BIG MAP, the three at the map's size round his party; THE REAL FIGHT, LIVE: a tap loads the real
fight, the aura laid on by slices/vote/ANIMATION_THE_AURA_HOOK.js wrapping the fight's blitMan FROM OUTSIDE (COMBAT's file
untouched), A/B/C/NO buttons only change what is seen (rule 25: the vote is on the row). Tested headless: the live board
wears echo, then tear, then current on the buttons; no page error.

## HANDED TO RUN: [the aura on the map] (rule 120(c)), on his pick
The same module at size 'map' (the echo's throw 14 art px, the band 2.0, the tear 2 rows): where renderCity blits his body
(g.drawImage(__body, mapSnap(__gx-__bw/2), mapSnap(__gy-__bh*0.93), __bw, __bh)), call
BOHEMIA_AURA.draw(kind, 'behind', g, o), the blit, BOHEMIA_AURA.draw(kind, 'front', g, o) with
o = {k: __bw/112, X: __gx, feet: __gy, frame: {img: __body, sx: 0, sy: 0, sw: __body.width, sh: __body.height, dx, dy,
dw: __bw, dh: __bh}, face: mapFaceNow(), t: performance.now(), beat: BEAT, size: 'map'}. ONE COST TO KNOW: the map now
redraws only when he moves; an aura that lives on the beat needs his layer redrawn twelve times a second while it shows
(PLUMBER's budget). BOHEMIA_AURA_MAP_HOOK in the hook file does it from outside for a look today; it goes away when RUN
builds it in. The fight's wiring (COMBAT, on his pick): the same two calls round blitMan for the crewControlled current man.

## ROUTED (records, not a word to him)
- DIRECTION: judge the three before his pick, by eye; your instruments ran here (the first five 16/16; the rig on the
  arcs breaks []; the rig's card on the S still with the stand-in 1 of 8 out, the stand-in's grey, not the arcs).
- THE COORDINATOR: purple is the Amalgamation's and none of the three carries it; if he wants the aura to SAY 'them', that is
  his identity call (PURPLE RESERVATION, THE REWIND's 'associate, never explain'), never this lane's.
- COMBAT and SOUNDS: the fight's beat is its own clock (FIGHT_UI.t0), not the song's (FIGHTMUS in the demo); an aura on the
  beat should land on the song's beat when it ships.
- PLUMBER: the page's clips weigh 5.1 MB (the tear's moving ground is 2.0 of it); the published surface was already over
  its cap before this.

## BLIND SPOTS, SAID
No real phone: Chromium at his phone's profile. The eight-direction view is the rig's crewman, not the fight's sprite (two
facings). The map clip is the map's frame with his body redrawn by the same numbers, not the map's own loop (it does not
redraw at rest). FULL SUITE NOT RUN (rule 13): every gate my files touch was run by name: this row's 29/0; VOTE TAB 46/6
(the six are DYNASTY's two whys and the sheet viewer's pinch, not this row); THE CARD I NAME 26/0; NOT VIBE CODED 29/1 (N3
names none of this row's 16 pictures); STYLE GUIDE 105/7 (PORTRAIT's crew rig.json 'wear'; this row's rig.json passes);
REFERENCE CHECK 502/2 (UI's new cook tool); PAGES PUBLISH 16/2 (887 MB before the cap, and handoffs/skills/tickets).

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the same fight with no aura; the style palette's
chrome, glass and cloth_black ramps; DIRECTION's rig and guide; no reference game (CRASHBOX is the look bible's, art only).
