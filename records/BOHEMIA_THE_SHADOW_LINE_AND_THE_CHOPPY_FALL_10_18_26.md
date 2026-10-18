# THE SHADOW LINE AND THE CHOPPY FALL (ANIMATION, [the shadow line and the choppy fall], 10/18/26)

## WHY THIS, NOW
His thirteenth votes (10/17), two things this lane owned: NO on animation-the-party-walks-as-one-10-11, 'Like there's a
shadow line behind the main character bro like what's wrong with you?', and his note on the ragdoll, 'choppy, not smooth,
a little too slow' (rule 115f). The row: the party card returns with no line behind anyone; the ragdoll falls smooth and
faster; both in VOTE; fix the cause, not the frame. Run under rules 112 to 116 (opened by the coordinator, no check-in).

## ONE: THE SHADOW LINE
LOOKED AT FIRST, zoomed on the card he judged. Two candidates for 'a line behind him':
1. the BEFORE panel beside the candidate still showed the banner POLE (the 10/11 fix removed it only in NOW); the
   card put the thing he had already said no to right next to the candidate;
2. in the NOW panel, a dark streak running off his heels: his ground shadow (the planted ellipse, 22 x 8 px at 0.6)
   and the two companions' own (16 x 5 at 0.45) OVERLAPPED, because the 10/11 formation puts the two 13 and 22 px
   behind him. Measured on the real map with the people hidden: one piece of shade runs under two of the three on 5
   of 8 trips. And the companion nearer the camera drew its shadow AFTER his body, over his boots.
THE CAUSE: three shadows drawn as three separate people instead of one company standing on one ground.
THE FIX (__THE_SHADOW_LINE__, slices/BOHEMIA_CITY_WORLD.html, inside the candidate, OFF by default as before):
mapPartyShadow lays the party's three shadows ONCE, before anybody is drawn, as one path filled once (two meeting can
never stack darker), each the width of the feet on it (0.13 of the body's drawn width, 0.4 as tall: his 7 px, theirs
5), so none touch at any facing; mapPersonDraw skips its own shadow inside the party pass (MAP_SHADOW_DONE). The spot
math moved to mapCompanySpot, shared by the draw and the shadows. OFF draws exactly what the game drew.
THE CARD: no before panel (it was the pole); two walks across the glass, filmed from the real map with the switch on
(tools/bohemia_animation_the_shadow_line_film.js + .py), 160 x 110 map px at the phone's 3x.
MY OWN INSTRUMENT FAILED THREE TIMES FIRST, SAID: counting dark pieces with the people drawn read 5 to 13 (legs split
every shadow); clearing 'shadow-coloured fills' also cleared a town's big base shadow (a fourth piece); the order check
counted a settlement crowd man standing near. Fixed in the gate each time: people hidden, only person-sized ovals
cleared, only HIS three by the feet the map reports. A walk up the glass for the card found only a caravan's name plate
on him every time; the card films two walks across instead (where the streak showed).

## TWO: THE CHOPPY FALL
MEASURED on four kinds x eight facings (the alpha's ragdollSim, sampled as the clip samples):
    the fall played over 4 beats (2 s) on 12 pictures, SIX A SECOND
    he was down (torso past 70 degrees) at 0.8 to 1.6 s; the last 3 to 5 pictures he lay still       -> too slow
    one picture to the next moved a joint up to 54 px (a third of his height), 14 on average          -> choppy
TRIED AND DROPPED: heavier gravity (840, 1120 px/s/s). Some facings never landed or never settled: every knob in the
ragdoll is tuned to the real 560. The physics stays byte for byte.
THE FIX (__THE_CHOPPY_FALL__, slices/BOHEMIA_ALPHA_0_9.html): the CLOCK. RAGDOLL.play = {secs 1.8, beats 2, keys 24}:
the clip plays the simulation's first 1.8 s (every kind and facing is at rest by then) in two beats, 1.8x the real
speed, drawn on 24 pictures (six a beat: a one-shot on twos, the claymation cadence); ANIMBEATS.ragdoll 4 -> 2.
    the biggest jump 54 -> 25 px, the average 14 -> 7
    the blow down at 0.46 to 0.70 s; every kind within 0.9 s (a shot or a club slumps on an arm first on two facings)
    the last picture 1.7 px from the body at rest (the dead pose after it does not pop)
The candidates compared: 1.6 s on 12 keys (peak 43, the end 11 px off rest), 1.6 s on 24 (peak 22, 9 px off rest),
1.5 s on 24 (14.5 off rest), 1.8 s on 24 (peak 25, 1.7 off rest): the last is the only one that ends at rest.
STYLE GUIDE: field 15 (the animation grid, this lane's by DIRECTION's handoff) gains one_shot_keys_per_beat 6 with
the reason; the cycles keep three a beat.
THE STRIP: tools/bohemia_animation_ragdoll_hits_bake.js now reads the keys and beats from RAGDOLL.play; the
[ragdoll hits] card plays the new clock; the old strip is kept as ANIMATION_THE_CHOPPY_FALL_BEFORE for this card.

## PROOF
    THE SHADOW LINE (new, gates/the_shadow_line_gate.js, in the suite) 7/0: three shadows on every trip, none touching,
    each of the three on his own piece of shade and none under two (people hidden), no shade after a body; the old
    drawing joins on 5 of 8 (bites). MUTATIONS, 3 caught: the old oval width (2 fail), the companions drawing their own
    shadow too (1), the switch on in the file (1).
    THE CHOPPY FALL (new, gates/the_choppy_fall_gate.js, in the suite) 7/0; the old clock fails smooth and faster in-gate.
    NEIGHBOURS: PARTY AS ONE 7/0, THE MAP GLIDES 14/0, THE PARTIES WALK 10/0, RAGDOLL FALLS 15/0 (its bank check now
    reads two beats), RAGDOLL HITS 19/0 (reads the clock's keys), AN ENVELOPE RAMPS SLOWER THAN THE GRID 10/0, STYLE
    GUIDE 27/0. FACE ON THE MAP: A2 and B2 red, the same two red on clean main before this round.
    VOTE animation-the-shadow-line-and-the-choppy-fall-10-18: filmed at a 3x phone, 42 canvases all change, 0 errors.

## WHAT IS NOT DONE, SAID SO
Nothing is in the game (rule 100): the party switch stays OFF and the ragdoll is in no fight. The party's walking
formation itself is unchanged (his 10/11 'closer, more behind'); if the line he meant was the pole on the old card's
before panel, that panel is gone and the pole only lives in the OFF game path he has not finalled away.

## [bb shadow] THE SCHOOL LINE (rule 39b)
Battle Brothers moves the whole company on the world map as one banner figure (this lane's 10/11 line); the library
holds nothing on its shadows, so nothing is claimed about them. WHAT WE DO DIFFERENTLY: three walking people, each on
a shadow the size of his own feet.

## ANALOG HORROR LINE (rule 30)
Three people walking close, three small shadows that never once touch, however close they walk.
