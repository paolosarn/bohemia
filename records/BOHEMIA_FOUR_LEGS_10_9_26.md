# FOUR LEGS (ANIMATION, [four legs], 10/9/26)

## WHY THIS, NOW
Rule 42 (Paolo 9/29: "just beasts human genetically brought back but broke out their labs when the us dollar went
to shit"; Battle Brothers' bestiary is the floor) and rule 81 (what a Battle Brothers monster becomes). The rig is a
biped. Measured before a line was written: no clip in the bank walks on four legs, and the only animal art in the
repo is the 16x16 map critters (a raven, a coyote). A beast could not appear in the fight because there was nothing
to draw it with.

## WHAT SHIPPED
ENGINE: engine/bohemia_quadruped.js, pure (no DOM, no canvas): pose(clip, phase) gives a skeleton, raster() gives
the 112 frame, palette-indexed, no blending, a one-pixel border, the back lit (you are above it), the far legs in
shadow. SW is SE turned round. A lab dire wolf (Aenocyon dirus: Ice Age, a gray-wolf surrogate, its bones in the
valley's own Tule Springs beds), dust-grey over brown, a pale chest, a yellow ear tag that was its lab number.
Shoulder 44 px against a man of about 100 in the same frame (a real one: 80 cm against 1.75 m).
    idle   4 beats  breath, a tail sway, one ear flick a bar
    walk   2 beats  the lateral walk (hind, fore, hind, fore): paws down 3 2 3 3 2 3 on the drawn pictures
    lope   2 beats  the gallop: hinds then fronts, and picture 5 of 6 has NO paw down (the suspension)
    lunge  2 beats  crouched, the spring with the jaws open, the bite SHUT on him, recovering, back
    fall   2 beats  the legs go, it sinks, it lies on its belly, the head last, the ears go flat (not a loop)
THE MEN'S GRID: three pictures a beat, twelve a bar, the alpha's POSEHOLD.keys. keys(clip) lists the only phases ever
drawn. That is why the lope is two beats and not one: three pictures cannot hold a gallop.
SHEET: tools/bohemia_fight_beasts_bake.js bakes slices/fight_beasts/dire_wolf.webp (36 pictures x SE, SW, lossless,
checked identical) and fight_beasts.json in fight_people's shape, with a clip table: idle, step (walk), run (lope),
bite (lunge), fall (then: dead), dead (the fall's last picture). Same frame, same ground line as the men.

## WHAT LOOKING FOUND (three passes on the picture, then stopped)
1. The first draw was a jackal: a thin body and a small head. Deeper chest, a ruff, a broad skull, a shorter muzzle.
2. The bite's jaw was cut by the frame's right edge (this lane's own [hands in the box] defect, on a new body). The
   animal moved 4 px back and the spring went 16 to 11 px. The gate now asks no picture touches the frame.
3. The fall pushed a hind knee and the tail tip under the ground. No joint goes under the ground now.
4. THE FALL STOOD BACK UP on its last picture: phase 1 wrapped to 0, the standing pose. A fall clamps, it does not loop.
5. THE ENVELOPE, measured at the drawn keys: the first lope (a 34 px stride, 34% stance) put the fore knee's reach on
   ONE key, 17.4 px out and 12 back: the one-key peak AN ENVELOPE RAMPS SLOWER THAN THE GRID names. Fixed in the gait
   (26 px, 40% stance, the fronts at .32 and .40 so the suspension still lands on a drawn key): worst step 10.8 px.
6. A walk whose stance I cut to 40% still showed two paws on every drawn picture: the one-paw moments fell between
   keys and are never drawn. Honest, but 2-2-2-2 is a trot. The walk claim now also asks for three paws on some.

## PROOF
    FOUR LEGS (new, gates/four_legs_gate.py, in the suite as FOUR LEGS): 22/0 on the skeleton at the drawn keys and
    the baked pixels. Lines set before the gate and written in it: a loop never moves a joint over 14 px between two
    drawn pictures (an eighth of the frame) nor turns it round more than twice a cycle; the bite and the fall 16 px
    and three turns. Measured: idle 0.7, walk 12.2, lope 10.8, lunge 13.4, fall 14.8.
    ONE RULER OF MINE WAS STRICTER THAN ITS OWN WORDS: 'longer than tall on the map' was first coded as 1.25x; the
    21 px wolf is 16x13 (1.23) and a man there is about 4x19. It is 1.1x now, said here, not quietly.
    MUTATIONS, 11 caught: the long lope (envelope), a trot (the walk), no suspension, a shut jaw, a fall that stands
    (2), a frozen idle, no border, a lit belly, a jaw out of the frame (3), a stale sheet (one body), a smoothed sheet (8).
    VOTE: animation-four-legs-10-9 plays the real sheets and both clip tables on the 120 beat; filmed at 16 beats,
    zero page errors; the bite lands on his front edge, his hit and swing play from fight_people's table.

## WHAT IS NOT DONE, SAID SO
THE FIGHT DOES NOT DRAW IT YET. slices/BOHEMIA_FIGHT.html is COMBAT's; it reads slices/fight_people only and has no
beast in its roster. The switch is the same as for the men's clip table: read fight_beasts.json beside
fight_people.json, frame = cols[floor(progress * n)]. Routed to COMBAT. No alpha change, so no build stamp.
ONE BEAST. The engine is a quadruped, not a wolf: the hyena, the horse, the lion, the bear and the mammoth are the
same skeleton with other lengths, a palette and a head. Next row.

## [bb beasts] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
The library (GROK 01, 09_ENEMIES) carries Battle Brothers' Direwolf as numbers: 130 HP, 12 action points,
initiative 150, a bite of 4 points, so three bites if it does not move, and the frenzied one at 150 HP. How Battle
Brothers draws a wolf moving is NOT in the library, so it is not claimed here; this lane's 9/28 line found its
figures stand still and slide on purpose. WHAT WE DO DIFFERENTLY: the wolf has a gait. It walks with three paws down,
gallops with a moment in the air, and the bite is a body that crouches and springs, so a player reads 'it is about
to jump' a beat before it lands.

## ANALOG HORROR LINE (rule 30)
A tagged animal from a lab that nobody runs any more, walking the way a real one walks: the wrong thing is not how
it moves, it is the yellow number in its ear.
