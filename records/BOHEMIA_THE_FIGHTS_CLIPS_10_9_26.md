# THE FIGHT'S CLIPS (ANIMATION, [the fight's clips in the new fight], 10/9/26)

## WHY THIS, NOW
Rule 78 (Paolo 10/9, 'give jobs to all chats right now') lifted every pause and put this row at the top of the
lane. Rule 69 (Paolo 10/4: 'I wanna see all my character art that we worked so hard on live in the game, even if
it's new combat'): every fighter in the rebuilt fight is drawn from slices/fight_people, his look's sheet baked
from the alpha's 112 rig by COMBAT's tools/bohemia_fight_people_bake.js. The row: the bank's clips wired to the
fight's events THROUGH ITS DATA; COMBAT's file untouched; this lane ships the clip table and the sheets.

## WHAT THE FIGHT DREW, MEASURED ON ITS OWN frameFor (slices/BOHEMIA_FIGHT.html)
    standing, waiting   idle@0, ONE frame: every man frozen between beats (the bank's idle has 6 distinct
                        pictures over 24 buckets: shifts of weight, three clocks)
    struck, fallen      sleep@0 the instant he goes down: no fall, and the sleeping pose lies the other way
                        round from anything a fall could end on
    struck down, alive  the same sleep@0: down and dead drew the same picture
    a shot              two-hand@0, the aim held (the bank's recoils are weak: deadeye, the crouch-aims, cover-fire; corrected 10/9)

## WHAT SHIPPED
THE SHEETS: twelve columns APPENDED to every one of the 26 looks (14 -> 26), so the fourteen the fight already
reads by name and by position keep both (checked byte for byte on all 26 sheets, faces included).
    idle x3 more     idle @ .1042 .3542 .7292 (with idle@0: four distinct pictures, every look, both ways)
    the fall x5      floor-rise PLAYED BACKWARDS: standing .8125, crouch .6458, kneel .5208, sitting .3125,
                     then crawl-dying .1042 (picked from the drawn box over 24 buckets: lying 0-5, sitting
                     6-11, kneeling 12-13, crouching 14-17, standing 18-21)
    the down x4      crawl-dying @ .1042 .4167 .7083 .9167 (three or four distinct pictures every look)
THE CLIP TABLE in fight_people.json: idle (4 beats, loops), step (1), swing (1), shot (1, the aim held, said so),
hit (1), fall (2 beats, then: down), down (4, loops), dead (sleep@0). frame = cols[floor(progress * n)].
No new shape anywhere: every picture is a bank clip, and the 7/2 graveyard's 'death' and 'ragdoll' stay dead.

## WHAT LOOKING FOUND, TWICE
1. THE FALL DOES NOT END LYING FLAT. Baked with his clothes on, floor-rise's first quarter is a man SITTING on the
   ground leaning back, which is exactly crawl-dying's pose. So the table was turned round: the fall flows into
   the man struck down (sitting up, crawling: ALIVE), and the dead keep the flat pose (DEAD). Down and dead now
   read apart at a glance, which is what COMBAT's [struck down] (20% dead, else a long injury; the main
   character never dies) needs on the board.
2. TWO RULERS OF MINE WERE WRONG BEFORE THE GATE SHIPPED. 'Lying is under 80 px' failed the church's tall hat
   (the seated end is 81 px under a 98 px start): replaced by 'ends under 88% of where it started'. 'The dead
   head is 12 px lower' failed on SW, where the top of the flat body is his raised FEET: replaced by SHAPE
   (sitting up is taller than wide, lying is as wide as tall), checked against the picture of all four poses.
   And the fall's seated end and the crawl's first picture differ by the crawl's reaching arm (2-4 px), so the
   fall now ENDS ON the crawl's first picture and the seam is exact by construction.

## PROOF
    THE FIGHT CLIPS PLAY FROM THE TABLE (new, gates/the_fight_clips_play_from_the_table_gate.py, in the suite as
    FIGHT CLIPS TABLE): 11/0 on the baked pixels of all 26 looks, both ways. MUTATIONS: the old sheets 0/1 (no
    table); a reversed fall (3 fail); a frozen idle (fails); the dead drawn as the down man (2 fail); a seam
    one picture off (2 fail).
    THE REBUILT FIGHT PLAYS (COMBAT's) 108/2 on the new sheets and 108/2 on the old: the same two night-lighting
    claims, not this round's.
    VOTE TAB 31/1: the one red is grok-first-crisis-around-day-100-10-9 (no where), red before this row landed.
    VOTE: animation-the-fights-clips-10-9 plays one exchange from the real sheets and the table, BEFORE (the
    fight's frameFor today) beside NOW, on the 120 beat; looked at, twelve beats, both panels.

## WHAT IS NOT DONE, SAID SO
THE FIGHT DOES NOT PLAY THE TABLE YET. Its frameFor picks columns by hand in COMBAT's file, which this row keeps
untouched. COMBAT's switch is small: frameFor reads DB.people.clips[event] and DB.people.cols, a fallen man
plays fall then down (or dead), a waiting man plays idle. Routed to COMBAT on its [struck down] row. Until then
the play surface is unchanged, so no build stamp.
THE SHOT has no kick here; the claim that the bank has no recoil clip was WRONG (deadeye and others recoil, weakly), corrected and built in records/BOHEMIA_THE_SHOT_KICKS_10_9_26.md.

## [bb clips] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
The library carries Battle Brothers' fight feel as sound and numbers on still figures (10_UI_AND_FEEL: 'weapon
impacts by material, grunts, death cries'), and this lane's 9/28 line found its developers left body animation
out on purpose to keep the gear readable. How it draws a man struck down but alive is NOT in the library, so it
is not claimed here; it is handed to the coordinator for the Grok ask list (rule 49) as one question. WHAT WE DO DIFFERENTLY: the body
goes down on the beat, and the man struck down stays on the board SITTING UP AND CRAWLING, so you can see who is
still alive to carry home, with the dead lying flat beside him.

## ANALOG HORROR LINE (rule 30)
A man who drops flat in one frame is a tape that skipped; one who sinks over two beats and keeps crawling is the
part of the recording you did not want to see.
