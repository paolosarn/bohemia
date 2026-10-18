# THE FERAL DOG PACK: THREE STRAYS FROM THE SAME SOURCE, THE PIT MIX IN VOTE (ANIMATION, 10/18/26, row [the beasts through the rig, the wolf redone], ROUND TWO)

Rule 115c (every beast remade through the rig, 'for everything to start looking better it has to come from the same
source'), rule 116 (opened by the coordinator, claim first, commit small), rule 100 and ROUND THIRTEEN (a candidate in
VOTE, nothing into the game), rule 108 (the pixels come from a render), rule 114 (the five tells), rule 97 (three passes
by eye, then stop), rule 42 and the bestiary's number 1 (records/BOHEMIA_THE_BEASTS_OF_BOHEMIA_ROUND_THREE_THE_SEVENTEEN_9_29_26.md:
'Vegas's own pets', act one's first fight, they flank like a lighter direwolf, the pack splits).

## WHY THREE DOGS
A pack of strays is never three copies. South-western shelters fill, in this order, with pit-bull mixes, shepherd
mixes and the yellow-and-white curs of the desert towns, so the pack is those three: three bodies from the same Fox
the wolf came from, each keeping one thing from the house it left, a collar.

## WHAT EXISTS NOW
- tools/bohemia_animation_the_feral_dog_pack_prep.py (bpy 4.2, headless): reuses the wolf tool's reshape and its texel
  trace (split out of the wolf's paint_coat as trace(), the wolf's output unchanged) and sets each dog's numbers:
  * THE PIT MIX (1.1 m): legs 1.18, limbs 2.0 thick, body 1.55 wide, skull 1.42, muzzle 0.8, ears 0.5, a whip tail 0.55,
    chest 1.4 deep. DARK BRINDLE (near-black brown, sparse fawn streaks down the flanks from the body's long axis broken
    by a 3D noise), a white chest and blaze, dark feet, a faded red collar painted as a band across the neck's own axis.
  * THE SHEPHERD MIX (1.4 m): legs 1.32, ears 1.0 (they stand), muzzle 1.12, the brush tail 0.9. Tan, a sable saddle
    wider than the wolf's, a black mask, a cream throat.
  * THE YELLOW CUR (1.25 m): legs 1.28, ears 0.78. Off-white under soft liver patches (a 3D noise, one patch always over
    the right eye and ear), two mange patches to grey skin, a faded blue collar.
  * THE DOG'S BITE: the wolf's keys with the spring lifted (root up 6.5 units, not 3; the neck 22 degrees, not 16): the
    first render rose 4 px on the pit, a 1.1 m dog doing a 1.7 m wolf's lunge reaches a man's knee. A dog jumps up.
- reference/models/bohemia/feral_dog_{pit,shepherd,cur}.glb and their licence lines.
- records/target/master_rig/feral_dog_{pit,shepherd,cur}/: DIRECTION's rig UNCHANGED (still = the walk's passing pose,
  Survey 12 + Walk 6 + Bite 6, eight facings, the contact shadow its own layer). Raw renders not committed (the wolf's way).
- slices/vote/ANIMATION_THE_FERAL_DOG_PIT.webp + .json + _TABLE.js (the bake now also takes --title) and
  slices/vote/ANIMATION_THE_FERAL_DOG_PACK.html: the pit mix in eight, idle, step and bite live on the 120 beat at one art
  pixel to one phone pixel, the fox it came from beside it.
- records/target/master_rig/ANIMATION_THE_FERAL_DOG_PIT.png: the proof sheet at 1:1 with the fox, the wolf redone, the cur
  and the shepherd as rows; ANIMATION_THE_FERAL_DOG_CUR.png the cur's own.
- VOTE: animation-the-feral-dog-pack-10-18, PLACEHOLDER, sprites (the pit's eight), class beast, the look block (rule 114c).

## THE PASSES, BY EYE AND BY THE CARDS
1. Pit pass one: fawn with dark stripes and white paws read as a TABBY CAT, and the white paws lit it from below (card
   light -8.9). Pass two: the dark brindle, dark feet, the heavier body and head: a dog. Card 2 of 8 (size, colours).
2. Shepherd: pass one's 0.14 saddle bleached to the wolf's grey under the rig's sun; 0.06 kept it black but the value span
   sat at 100 and the light at -3.4; a paler belly lifted the span to 115 and kept the light at -2.8; a tan face instead of
   the mask measured worse (-19.5). STOPPED: 3 of 8 (colours, value span 115 of 118, light -2.8 of -2.5). HELD.
3. Cur: the card passed (2 of 8) but NOT VIBE CODED's D5 (detail everywhere, no rest area) held it on the end-on facings.
   Dropping my own coat grain (the rig adds one) and bigger patches cleared NW but not N (evenness 0.047, the packs'
   0.057); fewer patches tripped two more rows; another layout failed E and N by 0.001-0.002. STOPPED, the best version
   kept on disk. HELD.
4. The pit, after the grain was dropped: card 2 of 8 to DIRECTION (long side 77 under the prop floor 96: rule 102, a 1.1 m
   dog at the one ruler; colours 490 under 2330, the same row the wolf and the fox fail), NOT VIBE CODED first five held
   for its row.

## MEASURED (gate THE FERAL DOG PACK (PIT), gates/the_beast_in_eight_gate.py --dog pit, 36/0, in the suite)
- Every BEAST IN EIGHT question at 1.1 m, plus: three tones (86 levels, line 70); the passing-pose still; DIRECTION's
  card not BACK; A PACK, NOT ONE DOG RECOLOURED: the coat 41 levels from the wolf redone and 67 from the cur (line 20);
  stands like a dog, not the fox: tall over long 0.71 against the fox's 0.60; the bite rises 7 px (line scaled to its
  size, 5: the wolf's 8 px line was set on a 1.7 m animal; 7 px is 11 percent of the pit's length, the wolf's 9 is 9).
- --dog cur is in the gate for the next round (36/0 on its frames before its sheet was taken off the card), not in the
  suite until it is on a card.
- Two new mutations planted: a dog that is the wolf recoloured a little, a BACK card. THE WOLF REDONE 31/0 and BEAST IN
  EIGHT 26/0 unchanged after the gate and bake edits.
- STYLE GUIDE 58/0 (the pit and the cur 1 of 8 out under the style guide, the shepherd 2). REFERENCE CHECK 490/0.

## WHAT IS NOT DONE, SAID SO
- The cur and the shepherd are HELD (above). Not in VOTE.
- No jaw bone still: the mouth never opens.
- The rig makes W nearly E flipped in silhouette on the cur (1 percent; the light is what makes it a W), the wolf's family.
- Not in the fight (rule 100). FINAL waits for his moodboard.
- NEXT on this row: the cur's rest area (a coat with one big plain flank, the brindle's way) and the shepherd's light
  (the card reads a dark back as lit from below; to DIRECTION as a beast-class question), then 3 THE HYENA.

## [bb beast] THE SCHOOL LINE (rule 39b)
Battle Brothers has no dogs in the wild, only its wardogs on a leash, so its lesson here is the direwolf's: a pack
reads by silhouette at a glance. WHAT WE DO: three different bodies from one skeleton (a heavy short pit, a tall
eared shepherd, a lean cur), so the pack's flank is three shapes, not one sprite three times.

## ANALOG HORROR LINE (rule 30)
The red collar is the horror. Somebody bought it at a pet store on Rainbow Boulevard, and now it is on the thing that
comes out from under the car.
