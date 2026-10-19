# THE ROLL CALL: EVERY HAIR, HAT, EYEWEAR AND GARMENT, ONE ROW EACH (CHARACTER, 10/19/26)

Row: CHARACTER [every old asset into the new look] THE-ROLL-CALL-OF-HAIR-HATS-GLASSES-AND-CLOTHES, round one.
His words, 10/18, voting YES on PORTRAIT's crew faces: "I'm so in love with the way this shit looks but keep in mind
like it looks like you made some hair look like it was like a medieval link mesh armor... All of this has to be
customizable and we still have to get the hair approved and the hats approved and the sunglasses approved and all the
assets we have we have to coordinate them, rename them, reapply them in the new art stuff, so please don't forget."

## 1. THE LIST

records/target/character/BOHEMIA_THE_ROLL_CALL.json (tools/bohemia_character_the_roll_call.py, draft, nothing live reads
it). 394 rows: the 387 entries of the alpha's GARMENTS table (352 canon, 34 dead hair, 1 cook) and the 7 pieces of the
paper doll the player first wore. Each row: the ONE name, a plainer name where the old one is a brand or a place (the
old stays an alias, saves keep it), kind and slot, which looks wear it, where it stands in the rig's look with the card
and his words, every other name another tool calls it by, and the batch that rebuilds it.

| kind | approved, not final | shown, not approved | built, not shown | not yet | dead |
|---|---|---|---|---|---|
| hair (11 canon + his curtain bob) | 0 | 6 | 2 | 4 | 34 |
| hats (21) | 0 | 6 | 1 | 15 | 0 |
| eyewear (14 + the shades) | 0 | 0 | 0 | 15 | 0 |
| garments (306 + 6 paper doll) | 49 | 0 | 29 | 233 | 0 |

- APPROVED, NOT FINAL: the 49 garments the thirteen gang bodies are modelled in, on three cards he voted UP
  ("Nice direction very good not final").
- SHOWN, NOT APPROVED: hair and hats that rode those cards and the barber's card. His 10/18 sentence takes them back out:
  "we still have to get the hair approved... the hats approved... the sunglasses approved". The gate (R4) holds it:
  no hair, hat or eyewear is approved until a card of its own passes.
- BUILT, NOT SHOWN: the cast's clothes PORTRAIT built with my rig tool under each crew head, never shown as a body.
- DEAD: the 34 dead cuts are listed and never batched (GRAVEYARD IS FINAL).

## 2. ONE NAME, NOT THREE

Three tools named the same hair three ways: the alpha's GARMENTS ('TEMPLE TAPER'), my rig ('taper', 'crop'), PORTRAIT's
heads ('taper', 'coil', 'long'). Each look wears one GARMENTS name, so each short name maps onto it through the look
that wears it: every PORTRAIT head piece maps (R7). Renamed for plainness (alias kept): CHINESE RICE FARMER HAT is the
CONE HAT; the paper doll's shoes/balenciaga are RUNWAY SNEAKERS (a brand is not a name in the game), its fuzz jacket,
legwarmer pants, cowl hoodie, durag, shades and curtain bob get their plain words.

## 3. THE ORDER (his)

hair 1 first (strands and clumps, never a mesh: his chain-mail note), then hats 1, then eyewear 1, then the garments
slot by slot (base, outer, legs, feet, back, gear, neck, waist, hands). Each batch is rebuilt through the rig (rule
115), PORTRAIT renders the faces wearing it (fresh portraits, rule 115h), and it goes to VOTE as one card; a part that
fails his vote goes back, never into the game.

## 4. THE GATE

gates/the_roll_call_gate.py (THE ROLL CALL), 3 s, no browser: R1 every entry once (and a second ruler: 387 names
against 387 layer keys in the table, because a single-quote parser missed DRIFTER'S COAT and SMITH'S APRON on the first
pass), R2 every worn name on it, R3 approved only with his UP, R4 no hair/hat/eyewear approved early, R5 the dead never
batched, R6 re-derives row for row, R7 PORTRAIT's pieces mapped. Mutation-proven: a row removed fails R1, R2, R6; a cut
set to approved fails R4. 8/0.

## 5. NEXT

Hair 1: the eight canon cuts not yet on the starred skull (SHAG, ROPE LOCKS, SHORT ROPES, DUST WEAVE, CURTAIN CUT, HEAVY
FRINGE, DRY TAPER, DEEP TAPER), and the three already there checked against his chain-mail note, sculpted as strands and
clumps; queued behind the thirteen gang renders of [one skin, one person] on this box's four cores.

[bb Battle Brothers keeps every helmet, hat and beard as one entry in one list the barber and the gear screen both read;
the roll call is our one list.]
[analog horror: the list is the person's wardrobe in the valley's own words, a brand name is never on it.]
