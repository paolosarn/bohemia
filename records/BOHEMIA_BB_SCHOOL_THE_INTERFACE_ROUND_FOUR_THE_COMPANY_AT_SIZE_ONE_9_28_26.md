# BB SCHOOL, THE INTERFACE, ROUND FOUR: THE COMPANY, AT SIZE ONE
# UI (chat 11, ui-kmqmrf), 9/28/26. Row [bb interface], rule 33(f), library first (33j):
# reference/library/battle_brothers/10_UI_AND_FEEL.md (the roster bar, the man's page),
# 02_COMBAT_RULES.md (injuries, morale), 06_BACKGROUNDS.md (the roster reads as a cast).

## THE SCHOOL HALF (recall, vol 10 and 02)
Battle Brothers never lets you forget who is in the company. The map's bottom bar is a row of small
painted faces, each with a hitpoint ring and a morale ring, and it never leaves the screen. A man who
is hurt is a face with an emptied ring; a man carrying an injury wears it on his face and in his traits;
a man's page (portrait, background story, stats, perks, paper doll) is where his story lives. The row is
the company's pulse: you read a fight's cost off it before you read any number.
WHAT WE DO NOT COPY (rule 33g): the row is a still. Ours has a body walking beside you on the street,
so the question is not "where is the roster" but "what tells you THAT body is yours".

## THE MEASUREMENT HALF, ON THE ALPHA, WITH SOMEBODY ACTUALLY THERE
Through the one driver, alpha, PEOPLE's own walk (talk, stay two beats, step): after 8 beats a
companion fell in -- Estella Gaines, id 12:12:900, "their work is gone, so their day is empty and yours
is not", one press away. The company is ONE id, never a roster (the_company_is_a_cast_gate).

WHAT ON THE GLASS SAYS SHE IS WITH YOU:
    her body      drawn in the cell behind his; at the 112 px size about four fifths of it is under his
    her name      ONLY while she is talking (the speech bubble, with her portrait)
    a name tag    a small gold "EST..." at her feet, under his boots
    her face      nowhere, between lines
    her health    nowhere
    anything that says "company"   nothing
MY FIRST CENSUS SAID "NOTHING NAMES HER" AND IT WAS WRONG: the lookup for her name returned null, so
the census searched the glass for an empty string. The picture showed her name in the bubble. The
numbers above come from the picture and the tree, not from that census.

WHY IT GETS WORSE UNDER RULE 34: a person becomes one cell, about 28 px. At that size a friend and a
stranger are the same few pixels; the only thing that can tell them apart is a mark. And rule 36(b): a
person struck down is 80% of the time out with an injury for 30 to 40 game days. She is then NOT ON THE
STREET, so anything drawn on her body has nothing to be drawn on; only a face somewhere steady can
still say "she is yours, and she is hurt".

## THE SHAPE FOR US, AND THE VOTE
The frame is where steady things live (round three: the bar sits above the world, its cells already
spent). Company size one means ONE face, which fits in the strip the song title uses now. That is B.
C is the other honest answer: no roster at all, a mark on the body, and it fails the injured month.
A is today. ui-how-you-know-she-is-with-you-9-28, three phones, one real shot of her beside him from
the game's camera; her face in B is her own portrait cut out of the bubble the game drew for her.
Disclosed on the sheet: her speech bubble is held off for one frame for the picture (she talks on a
loop while he stands still).

## THREE THINGS FOUND ON THE WAY, EACH SENT WHERE IT BELONGS
1. MY OWN SHIPPED WARNING HAS ITS NUMBER COVERED. [danger visible] (UI, 9/5) draws #packline, "2 OF
   THEM AND THEY ARE NOT FRIENDLY. TAP ONE AND IT STARTS.", 234x30 at 12,543 in the city frame. The
   rail's BUILD HERE (#buildbtn, 44x44 at 13,521) sits on its first 44 px, so the line reads "...EM
   AND THEY ARE NOT FRIENDLY": the count, the one word that matters, is the part covered. ALPHA ONLY:
   the demo strips the rail (18g). Measured by geometry and the picture; an elementFromPoint count
   said 290 of 290 points covered and I threw it out, because that oracle skips pointer-events:none
   elements and so cannot tell covered from click-through. New row [warning clipped]; held by rule 18.
2. THE THREE FACES THAT CHANGE WHO YOU ARE ARE 36 PX WIDE. DYNASTY's [the flip] built my OPEN row
   [faces on the phone]: Reyna NOW, Ezekiel +35Y, Perla +70Y along the bottom of the cracked phone,
   the whole tile takes the touch. Each tile is 36 x 54, so under the 44 px thumb on width. HIS OWN
   9/21 VOTE decides this and I am not re-asking it: "it looks better when it's tinier... this is
   something that could be changed in the settings". So the tiles stay small and the fix is the
   SIZE SETTING [the picks] already owes. The row folds as built by DYNASTY, measured here.
3. A COMMENT SAID THE SHELL COVERS THE TOP OF THE PHONE, AND IT DOES NOT ANY MORE. DYNASTY wrote in
   the city world that something in the shell covered the top of the phone and named it for UI; it
   never reached this board. Asked the glass: a finger down the middle of the phone lands on the city
   frame from its top edge (cityfeedbar at y 117) to the bottom of the act strip. Most likely closed by
   the [banner eats fingers] fix. The comment is stale; named for DYNASTY, not edited.
AND ONE FOR PEOPLE, NOT MINE: she stands in the cell behind him and his body covers about four fifths
of hers. NOBODY STANDS ON ANYBODY (9/21) is about exactly this picture. The one-cell body of rule 34
fixes it by construction (a body one cell tall cannot cover the next cell), so this is a note for
[small body] and PEOPLE, not a bug to patch at 112.

## A CORRECTION TO ROUND THREE
Round three said the bar is empty. It is empty ON THE DEMO, which is what a friend plays and what the
measurement ran on. On the ALPHA the same bar shows HUMAN MODE, SUBURB - ON FOOT, the track, SAVE,
TOOLS and NOTES. The vote item's words now say "the demo" so he is not judging a sentence that is only
half true.

## NEXT ROUND
Round five: THE MAN'S PAGE. BB's roster page is where a man's story lives (portrait, background, the
injuries he carries). We have PORTRAIT's faces, PEOPLE's backgrounds and what they KEPT, and rule 36's
injuries: what one tap on her face in the bar opens, on 12 cells across.

## RULE 37 LANDED WHILE THIS ROUND WAS SHIPPING, AND IT CHANGED THREE THINGS HERE
His third votes (records/BOHEMIA_PAOLO_THIRD_VOTES_9_28_26.md), read before pushing, not after:
1. 37(a) NO ATARI: the 32 px cell and the one-cell sprite defaults are DEAD. Round three's counts were
   in 32 px units (312 cells, the frame costs 48, "the pad that hid one man will hide nine"). The
   pixel facts stand (the bar is 390x50 ABOVE the world, the pad 90x90 ON it, the frame box 378x794);
   the cell arithmetic and the nine-men line die with the default. The WHAT THE BAR SAYS sheet carried a
   32 px grid labelled "the new cell size you just set": the grid and the sentence are REMOVED from the
   picture and from the item's words before he judges it. This round's sheet and words drop the
   "one small square" argument too.
2. 37(b) PLACES ARE SETTLEMENT SCREENS: you walk only in the fight and special places. That makes this
   round's question sharper, not smaller: most of the time her body is not on screen at all, so a mark
   on her (C) only works where you walk, and a steady face (B) is BB's own answer. The sheet's footer
   and the item's words now say so.
3. HIS VERDICTS ON FOUR OF MY ITEMS: the cracked iPhone UP without saying B, so A (one crack) stands,
   plus a new ask: cracked at the start and bougier as the acts improve (37j); the phone waking up UP;
   one set of buttons UP with a note that the grid is SQUARE (37f); the fight is a different game DOWN
   (graveyard/POSTMORTEM_THE_FIGHT_IS_A_DIFFERENT_GAME_9_28_26.txt: combat and traversal ARE two
   things to him; [one hud] becomes ONE LOOK, not one set of buttons).
