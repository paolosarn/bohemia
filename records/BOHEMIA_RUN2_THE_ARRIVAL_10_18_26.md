# RUN TWO [the arrival] (10/18/26)

Row: WHAT-YOU-SEE-WHEN-YOU-REACH-A-TOWN. Law: THE OVERWORLD IS BATTLE BROTHERS (a place is a settlement screen);
A QUEST IS PEOPLE, PLACES AND THINGS (text from a mouth with a portrait, nothing pops up).

## What it does
When the GAME sends a new place (the BOHEMIA_SETTLEMENT_OPEN message; the demo's map and BOHEMIA_LOOP both do),
the settlement screen lays one overlay over the picture before anything can be touched:
- the town's name on a torn tag (UI's receipt paper and tape, the settlement labels' own material, BohemiaCasing),
  its tier (A CAMP / A TOWN / A FORTRESS) and its standing traits (RAIDED, SICKNESS, MARKET DAY);
- THE ELDER (the board's keeper) speaks ONE line under his face: the trait's own board line when one stands
  (records/target/settlement_traits.json), else the tier's (three new lines, draft:true);
- WHAT THEY THINK OF YOU: a bar on the wiki's nine relation bands (records/target/bb/relations.json, FACTIONS
  [beef]); the game hands open({opinion}); a place it does not name sits at the wiki's start, 50, NEUTRAL;
- HELD BY <faction>, its colour and face, only when the game hands open({faction:{name, hex, face}}).
Two seconds, then the picture (a three-step fade, no smooth tween); a tap skips it and the tap opens no building.
Once per new place; the same place again plays nothing; open({arrival:false}) on the message skips it; the page's
own open() (the JS API the other gates drive, and the standalone page) is the screen at rest (?arrival=1 plays it).
No sound of its own: SOUNDS' arrival cue already fires on the map (cf9b7d8b). Posts 'arrive' and 'arrived' {how}.

## Proof
gates/the_arrival_gate.js (THE ARRIVAL, in the suite) 33/0 on his phone's profile: a raided camp at 15
(THREATENING), a market-day town held by the Caravans at 72 (FRIENDLY), a fortress with nothing named (NEUTRAL).
VOTE run2-the-arrival-10-18, picture slices/vote/RUN2_THE_ARRIVAL_10_18.png (the three side by side).
Settlement gates unchanged: screen 65/0, people 24/0, sideways 13/0, market pack art 7/0, barber 8/0, build on the
screen 15/0, equip 7/0, crew rows 21/0. The one-file loop waits the tag out like a player (12/1, the 'hire one at
the hall' red is PLUMBER's 10/10 note, red on clean main). UI's THE ROSTER AND THE POSTS LOOK was red on clean main
(crashed after its weapon leg: the twelve crew rows of b47f391 pushed the card below the glass); its three taps now
scroll their target into view first, 28/0.

## Owed
- RUN: the demo's map hands open({opinion}) from the relations record and open({faction}) from the place's holder
  when it has them; until then every town arrives NEUTRAL and unheld.
- PORTRAIT: THE ELDER's face is his fight_people sheet face until PORTRAIT's keeperFaceSrc answers needFace.
