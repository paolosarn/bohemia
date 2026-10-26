# RUN FOUR: MAKE CAMP FROM THE FIGHT, THE END SCREEN'S HALF (rule 267(b); CAMP's row [make camp from the fight]; 10/26/26)

## HIS WORDS
Rule 267 (Paolo 10/26, LOCKED): 'after combat ends there should be a button where you go straight into camp mode to start healing.'
Record of the ruling: records/BOHEMIA_PAOLO_CAMP_HOLDS_CAMP_FROM_THE_FIGHT_AND_YOUR_OWN_NAME_10_26_26.md.

## MEASURED BEFORE
The end-of-fight screen had one way out, LEAVE. Camp was a second trip: home, wait for the clouds to part, find CAMP on the map.

## WHAT IS BUILT (RUN FOUR's half; CAMP leads the row)
1. MAKE CAMP beside LEAVE ('HEAL HERE' under it), the kit's tin like LEAVE. On a phone the two ways out are the bottom row, half each,
   and the loot's two buttons (LOOT ALL, OPTIMIZE LOOT) ride the row above while there is loot left; the strip over them. On a computer
   MAKE CAMP stands left of LEAVE on the bar. There after a won, a lost and a pulled-out fight; not after a wipe (nobody is standing).
2. One tap does everything LEAVE does (the counts home: batteries, rounds, tape) and posts leave with camp: true; the shell's
   __THE_SPOILS__ block goes home as for LEAVE and, the moment the map is his again (no fight frame), makes CAMP's camp where the party
   stands, the fight's place: BohemiaMapCamp.make(), asked every quarter second for six seconds (SPOILS.camped says how it went).
3. THE CALL, for CAMP's board: the end screen hands over by BohemiaMapCamp.make() at the party's tile, nothing else; the camp's look
   after a fight (267(c): the slain in a pile scaled to the kills, his men going through them) and the save as the camp opens
   (233(d)) are CAMP's.
4. FOUND AND FIXED IN THE HAND-OVER: the camp broke on its first hour as 'contact' on the phone and the computer: the road fight's
   CITY_CONTACT_POSTED is still set when he gets home (it clears on his next step). The fight it stands for is over, so the hand-over
   clears it (the city frame's own contactClear) before it makes the camp. A party that reaches the camp later still ends it (267(a)).
   Every other way a camp breaks is CAMP's [camp holds until he ends it].

## THE GATE: gates/make_camp_from_the_fight_gate.js (in the suite as MAKE CAMP FROM THE FIGHT), 11/0 at registration
C1 the screen on a phone and a computer: beside LEAVE, whole, a thumb's size, clear of the loot's buttons and the strip; there after
won, lost and ran, not after a wipe. C2 the live demo on both: a road fight won, MAKE CAMP (a real tap): the tape home (40 -> 53), the
end screen and the fight gone, the camp at the fight's tile. C3 three seconds on, the camp is still up (it broke as 'contact' before).

[bb] Battle Brothers leaves the field to the world map and camp is a second button there; ours is one tap off the field.
[analog horror] they do not go far: the fire goes up where the bodies are still warm.
