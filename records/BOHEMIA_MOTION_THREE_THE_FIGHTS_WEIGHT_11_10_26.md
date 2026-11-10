# MOTION 3: THE FIGHT'S WEIGHT (11/10/26)

VAMILY rule 443(e) and 441 (FULLY BAKED), the coordinator's brief: "more love on the fight: its WEIGHT. Measure on the real page first
which of these read and which do not: a hit, a block on a shield, a miss, a kill, a man struck down, a shot, a reload; then make each
read on the beat (the body's reaction, the camera's small answer, the sound already there), with the rig's existing clips first (rule
430), at no frame cost on a cheap phone (PLUMBER 8's budgets), AUTO at 4x still clear. COMBAT TWO owns the fight's rules: touch only how
it looks and moves." Ask line 567.

## THE MEASURE (tools/bohemia_fight_weight.js)

The demo at 390 x 844 (his phone upright), a fight on a suburb cell of the map, his line set, AUTO by a real tap, the CPU slowed 4x
(Chrome's own throttle; this box draws in software, so its frames are the floor of a phone with a graphics chip). For every blow and
note the fight presents (its own `startAnim`), every frame the page draws while it plays out, channel by channel, on the man it is
about: the white (THE PUNCH's freeze), the knock, the hit key, the dodge's lean, the hit flash, the fall, the aim, the reload in his
hands, the block (the shield up), the shot's flare; the glass's kick (KICK); and every sound the fight asked for (its `sfx`).

A KIND READS when its own body channel shows for 2 drawn frames or more AND its own sound is asked for inside its beat, and it never
shows another kind's read (a block that sidesteps is a dodge):

| kind | its body | its sound |
| --- | --- | --- |
| hit | white, knock or hit key | hit, melee_hit, vital, hurt |
| block | the shield up (SBlock) | block |
| miss | the sidestep | miss |
| kill | the fall | kill, body_land |
| struck down | the fall | went_down, body_land |
| shot | the aim | shot |
| reload | the reload keys | mag_home |

## MEASURED BEFORE (main 0f4592d0f)

AUTO at 1x, the CPU slowed 4x (23.8 fps, round 6):

| kind | n | reads | glass | drawn frames (median) |
| --- | --- | --- | --- | --- |
| hit | 7 | 86% | 86% | knock 2, white 1, hit key 3, flash 2, glass 1 |
| miss | 8 | 88% | 0% | sidestep 5 |
| kill | 3 | 100% | 67% | fall 9 |
| shot | 14 | 93% | 43% | aim 9 |
| reload | 4 | 100% | 0% | reload 12 |
| block, struck down | 0 | - | - | none in this fight |

AUTO at 4x, the CPU slowed 4x (16.3 fps, a beat 125 ms, two drawn frames):

| kind | n | reads | glass | drawn frames (median) |
| --- | --- | --- | --- | --- |
| hit | 8 | 63% | 0% | white 0, knock 1, hit key 2, flash 1 |
| miss | 5 | 0% | 0% | sidestep 1 |
| kill | 3 | 33% | 0% | fall 1 |
| shot | 13 | 92% | 0% | aim 2 |
| reload | 3 | 100% | 0% | reload 3 |

And read from the code (and staged, below): A BLOCK ON A SHIELD NEVER READ AS ONE. The rules call a blow that misses a man with a shield
up a block (their `tire()` says 'block'), but the fight drew it as the dodge: the sidestep, the whoosh of a miss, the dodge's mark on the
tag. The shield arm has its own block keys (ANIMATION's SBlock, the shield up before his face), drawn only when a blow LANDED.
A SHOT had no answer at the gun: his aim key and the bang, nothing else on the glass.
AT 4X THE PUNCH FELL BETWEEN FRAMES: its freeze and white were 12 to 30 ms, its kick four steps of 8 ms, the dodge's lean 62 ms; a
slowed phone draws a frame every 61 ms.

## WHAT CHANGED (slices/BOHEMIA_FIGHT.html, MOTION's marked block __THE_FIGHTS_WEIGHT__, COMBAT's file; no rule read or written)

1. A BLOCK ON A SHIELD IS A BLOCK. He takes it on the shield: the shield arm's own SBlock keys (rule 430: the rig's clip first), rocked
   back a hair behind it, the catalogue's own BLOCKED ('the hit that did not land', already in engine/bohemia_sfx.js), the glass a
   small knock, the tag the cover's mark (it hit what he holds); never the sidestep.
2. THE SHOT FLARES. On the clip's kick key (a third of a beat in, where the bang is) the street round him is lit in three hard bands
   (the tape blown by the flash; at night it is the only light), his own picture flares with it (THE PUNCH's own tint), he is rocked
   back a hair off the shot, and the glass answers by a pixel (a pistol) or two (a long gun) along it.
3. NOTHING SHORTER THAN TWO DRAWN FRAMES. The white, the kick's steps, the sidestep, the block and the flare are held for two drawn
   frames at least (the page's own frame clock, UI.frameMs), never past a beat and a fifth; the freeze that holds both men never past
   half its beat. At 1x on a good phone nothing changes (every span is already longer).
4. AND COUNTED IN DRAWN FRAMES. Measured on the staged hit: the blow's own landing is the page's longest frame (its sounds, its blood, its
   tag and its line all at once: 160 ms at 1x on the slowed box, up to 350 ms at 4x), so a white cut in time fell inside that one frame
   and was never drawn. The white, the block, the flare, the sidestep and the glass's kick now stay up past their span until each has
   really been drawn twice (counted once a drawn frame, wDrawn and the kick's own count), never past two beats or three of the phone's
   own frames, whichever is longer.

window.__FIGHT_WEIGHT_OFF = true: the fight as it was.

## MEASURED AFTER (this build, the same measure; the box now drew the fight at 9.6 fps at 4x with the CPU slowed 4x, against 16 before:
## a 4x beat about one frame)

AUTO at 4x, the CPU slowed 4x (a suburb, round 5):

| kind | n | reads | glass | drawn frames / screen time (median) |
| --- | --- | --- | --- | --- |
| hit | 9 | 78% (was 63%, 25% on the slower box) | 100% (was 0%) | white 2 / 254 ms (was 0), knock 1 / 100 ms |
| kill | 3 | 100% (was 33%) | 100% | fall 3 / 468 ms |
| shot | 14 | 86% | 100% (was 0%) | aim 2 / 285 ms, flare 1 / 214 ms |
| reload | 4 | 75% | 100% | reload 1 / 157 ms |
| miss | 5 | (see the gate's last run) | 100% | sidestep 1 / 148 ms |

Staged on the real page at 4x (the fight's own queue and presenter, the fight's own event): A BLOCK: the shield up (the shield arm's own
SBlock keys drawn) 275 ms on the glass, no sidestep, BLOCKED heard and no whoosh, the cover's mark on the tag, the glass kicks; the
weight off: the sidestep, the whoosh, the dodge's mark, nothing on the glass. A SHOT: the street lit round him 2 drawn frames (351 ms),
the glass answers twice; the weight off: nothing. The frames' middle through the staged moments 52.9 ms against 51.7 ms with the weight
off (no frame cost).

At 1x with the CPU slowed 4x (the VOTE card's picture, every frame round the man): the hit's white 2 drawn frames (313 ms) against 1
(151 ms); the block the shield up 2 frames with BLOCKED and the cover's mark against the sidestep, the whoosh and the dodge's mark; the
shot's flare 2 frames (252 ms) against none.

## THE GATE

gates/the_fights_weight_gate.js (THE FIGHT'S WEIGHT, SOLO, registered).

## [bb] and [analog horror]

[bb] Battle Brothers says a block by the shield: the blow stops on it with its own sound and the man does not move off his tile; a dodge
is the other read. Ours now keeps the two apart.
[analog horror] the muzzle flash blows the tape for a frame: hard bands of light, the man white-hot inside it, then the dark again.
