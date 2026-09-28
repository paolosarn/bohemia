# [bb clips] WHERE A BODY SPENDS ITS PICTURES (ANIMATION school, rule 33f, 9/27/26)

## *** SUPERSEDED 9/28. SECTION 4 BELOW RESTS ON A SIZE PAOLO KILLED, AND IT WAS WRONG ANYWAY. ***
Section 4 argued that a one-cell body cannot carry a readable hit, so the walk should keep
the pictures and the hit should be carried by sound. TWO THINGS HAPPENED TO IT:
(1) PAOLO KILLED THE ONE-CELL BODY in his 9/27 votes (rule 37a: "I don't wanna treat a
    whole new character... not some Atari bullshit"). The body is the full-detail 112 art.
(2) BEFORE THAT LANDED, THE NEXT ROUND MEASURED THE CLAIM AND IT WAS FALSE EVEN AT 28 px:
    punch-heavy moved 47-86% of the body, bat-arc 56-93%, shiv-jab 72-91%, against the
    walk's 42-73%. It was reasoned from Battle Brothers' sprite size and never checked
    against our own pixels.
WHAT SURVIVES: BB spends its budget on the landing, and sound carries impact. The
conclusion drawn from it does not. Record: records/BOHEMIA_TWO_MOVES_THAT_WERE_DEAD_9_28_26.md

## 1. WHAT BATTLE BROTHERS ACTUALLY SPENDS ANIMATION ON
On the map there is NO BODY AT ALL. The company is a marker; what sells it moving is
sound, not frames -- "footsteps of the marker" and "a horn when a party is spotted"
(10_UI_AND_FEEL). The map's life is the day/night light and the weather, not a walk
cycle. Nobody has ever complained that the Battle Brothers marker does not walk.

In the fight the camera is FIXED isometric with zoom, and what the game spends on is
the HIT: "weapon impacts by material, grunts, death cries, the shield thud", and "a
fight that is slow, heavy and legible" (10_UI_AND_FEEL). The board is hexes, a turn is
discrete, and a man between turns is essentially still. The budget goes into the moment
a weapon lands, because that is the moment the player is reading.

And the roster face is PAINTED and it AGES: "portrait (painted, aged by injuries)".
The identity is carried by a still picture that changes over a campaign, not by motion.

## 2. WHAT WE DO NOT COPY, AND THE LIBRARY SAYS SO ITSELF
Rule 33(g), written on that same page: "WHAT WE DO NOT COPY: the stills. Ours move: the
map breathes, a place is a living street." So this is not an argument for copying BB's
stillness. It is an argument about WHERE the pictures go when there are few of them.

## 3. MEASURED AGAINST OUR OWN REPO, AND WE DO NOT DO WHAT BB DOES
Every clip in the file, counted with the game's OWN key counter (poseHoldCount, which
nothing in the codebase has ever read), worst facing of eight:

    A STROLL                walk 8   run 8   sneak 8   tired-walk 8   swagger 8
    A HIT                   punch-heavy 8   shiv-jab 8   spear-drive 9   bat-arc 9
                            kick 5   throw 8   headshot 5
    A HOLD                  pistol 2   two-hand 2   winded 2   brace 2   sleep 2
    THE MOST EXPENSIVE      air-guitar 15   dizzy 10   talk 10   greet 10

WE SPEND THE SAME ON A STROLL AS ON A PUNCH. Battle Brothers spends almost nothing on
locomotion and everything on the landing. On our numbers the most animated thing a
person owns is playing air guitar, at nearly twice the budget of a spear through the
chest.

## 4. THE FINDING THAT PROVES US WRONG
The obvious reading is "move pictures from the walk to the hit". IT IS WRONG FOR US,
and the reason is rule 34 itself: BB's fighter is a big isometric sprite on a hex, seen
close, and his hit has room to be legible. OUR fighter is now ONE CELL, about 24 rows
of body. A hit at that size cannot carry eight readable pictures -- there is not enough
body to move. What a one-cell body CAN read is the silhouette changing: legs open and
closed, an arm out, the whole shape leaning. That is locomotion's language, not impact's.
So the honest conclusion is the opposite of the copy: AT ONE CELL THE WALK IS WHERE THE
PICTURES BELONG, and the hit has to be carried the way BB carries it -- by SOUND and by
the board telling you what happened, not by frames on a 24-row man.

Which is also why this round's defect mattered at all. Six gaits drawing one picture at
both leg crossings costs nothing at 112 and costs the read at 28, because at 28 the
legs ARE the character.

## 5. ROUTED
- SOUNDS: BB's fight budget is impact audio by material, plus the shield thud and the
  drum on turn one. If our hit cannot be carried by frames at one cell, it has to be
  carried there. (10_UI_AND_FEEL, the SOUND paragraph.)
- COMBAT: a hit at one cell wants a board-level tell (the target moving a cell, a mark
  on the tile), not a per-body animation. That is theirs to design, not this lane's.
- PORTRAIT: BB puts identity in a painted face that ages. We already have the HD face;
  at one cell it is the ONLY place a person can be a person.

## 6. NOTHING IN THE VOLUME READ AS WRONG
Checked 10_UI_AND_FEEL and 02_COMBAT_RULES against what this lane could verify. No
correction to file this round.

## 7. ANALOG HORROR LINE (rule 30)
BB's stillness between turns is a board game's stillness and it is comfortable. Ours
must not be: a person who holds perfectly still at one cell reads as a sprite that has
stopped updating, which is the bible's own defect -- an ordinary frame with one thing
wrong. The idle measured this round moves 23% to 40% of its body and never lifts a
foot. That is the right shape: always breathing, never travelling.
