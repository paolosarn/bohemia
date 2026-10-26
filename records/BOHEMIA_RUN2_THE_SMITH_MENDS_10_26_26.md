# THE SMITH MENDS (RUN TWO, 10/26/26, rule 277)

Paolo 10/26: 'if I go to a settlement that has a smith and an armourer I should be able to repair my stuff with them pretty
easily and quickly... the fact that that's not even an option is insane.'

## MEASURED BEFORE
The smith said 'Fixed, sharpened, loaded. Pick one.' and only bought and sold; so did the armourer and a camp's GUNS AND PLATE.
Armour damage stays between fights (CAMP's engine/bohemia_condition.js keeps each man's lost helmet and body points) and the
only mend was the camp's: slow (3 points an hour) and paid in tape.

## NOW (__THE_SMITH_MENDS__; BUILD 10/26zh)
- The smith, the armourer and a camp's GUNS AND PLATE open on MEND YOUR GEAR, above their shelf: MEND IT ALL (every living
  man's broken helmet and body armour back to full) with the tape icon, and one row a man ('Mend Desi's gear') with a bar for
  each broken piece (rule 224: the grey is what is left; the exact points on a hover).
- The price is on the button before the tap: ECONOMY's craftsman's price (engine/bohemia_stall_prices.js mendPrice over
  records/target/bb/stall_prices.json mend): twice the tape the damage takes at this stall (a roll per 15 points, Battle
  Brothers' Tools page), moved by the place's size and the town's card, at least 1 a piece.
- Paid in batteries; none of his tape is spent. The map's clock moves an hour (mend.hours, rule 277(c)).
- CAMP's file gained two calls (RUN TWO's marked block, NOTE on CAMP's board): BohemiaCondition.broken(origin) and
  BohemiaCondition.mend(keys); the HEAL bar repaints on the 'bohemia:condition' event.
- Nothing broken: 'Nothing of yours is broken.' and no button.

## GATE
THE SMITH MENDS 8/0 (gates/the_smith_mends_gate.js, in the suite), the demo, a new game, YOU and DESI's helmets and armour
dented through CAMP's afterFight (the fight's own call): M1 Church's smith shows MEND first, 'Mend it all, 4 pieces 56
batteries', the sum worked out from the file at the card's x1.25; M2 one tap: 600 -> 544, nothing broken, TAPE 40 -> 40, the
clock +60 min; M3 one man alone (DESI 28), YOU still broken; M5 nothing broken says so; M4 Colorful's GUNS AND PLATE (a camp)
52 then nothing broken; K1 the computer by a click.

## FOUND, FOR THE NEXT ROW
Today's town picture puts the ARMOURER in the bottom-right corner (town tier box 1830..2060 x 720..1092): on the phone AND the
computer it sits under UI TWO's phone, and a tap there lands on the phone. RUN TWO [the towns wired tall and wide] and [the
town fits the screen] (COOK's compositions keep both bottom corners clear) take it out; the gate proves the counter on the smith
and the camp's GUNS AND PLATE, the same shopSheet.

[bb Battle Brothers' smith repairs instantly for crowns, dearer than your own tools; ours charges twice the tape and an hour.]
[analog horror: the smith hammers your dents out while you wait, the clock on the wall stopped at the hour the money died.]
