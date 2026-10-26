# CAMP: CAMP HOLDS UNTIL HE ENDS IT (rule 267(a), a bug), 10/26/26

Session camp-session_01FfxbakbC. Row [camp holds until he ends it] NOBODY-WAKES-HIM (rule 267(a)(d); the coordinator 07:09: first after
the bars).

PAOLO 10/26: 'when I click the camp button it wants to stop having me in camp mode, I hate that, unless an enemy pulls up on me...
even when I'm in camp mode it keeps making me go out to the city mode, I'm trying to heal'.

## 1. MEASURED FIRST (the new gate on the old code, computer: 1 passed, 6 failed)
- STRAIGHT AFTER A FIGHT the camp broke on its FIRST hour as 'contact' with no enemy anywhere. The cause: the map's contact flag
  (CITY_CONTACT_POSTED, 'one step makes at most one fight') goes up when a fight is posted and comes down only on his next walked step
  (stepOnce). Every fight he wins leaves it up; a camp made before he moves read it as an enemy reaching the camp. It also froze the
  valley while it stood (mapStepWorld returns at once while the flag is up). This is the camp 'wanting to stop' the moment he made it.
- A CREW TWO BLOCKS OFF (four with a LOOKOUT) broke the camp ('X are coming. Camp's broken.'), wherever it was going.
- A TRAVEL (the phone's job GO calls travelTo) did not end the camp: the march set out under a camp that still stood.
- A camp frame hidden by anything but his own tap was read as 'left' and broke the camp.

## 2. NOW (the map's file, marked __CAMP_HOLDS__; the settlement screen's camp, marked)
The camp ends on three things only:
1. HIS TAP: the phone's HEAL app (it stands for the camp's HEAL button while the phone is on), the camp's BREAK CAMP, T. The camp's
   frame says leave and the camp breaks the beat he taps ('left'), not on the next hour.
2. A TRAVEL: travelTo while camped (the phone's GO; a town's door) breaks it ('travel'); the world's own steps inside the camp's
   hour (a chase's re-aim) never do. A town or a job opened in the camp's place breaks it too.
3. AN ENEMY REACHING THE CAMP: the meet card is up, or a fight ('contact'); the camp's frame closes and the card is on the map.
Never: the contact flag a fight left up (making camp, and every camped hour with no card and no fight up, takes it down: a stale
flag is not an enemy); a crew coming (a WARNING, below); a frame hidden by anything else (it is shown again and the camp stands).
THE WARNING: when a hunting crew is within two blocks (four with a LOOKOUT), one of his men says who and how far at the top of the
camp, from his mouth with his face (rule 32a): 'The Gate Crew, coming our way. Two blocks off. We hold the fire.' (draft:true). Said
once; said again only when they come closer; a tap or seven seconds takes it away. When they reach him it is the meet card.

## 3. THE GATE (rule 267(d)), gates/camp_holds_until_he_ends_it_gate.js, on the cut he plays, phone and computer
H1 straight after a fight (the won fight's flag up): the camp stands 12 camped hours, its clock runs, the flag is down. H2 a crew held
two blocks off for 12 camped hours: the camp stands, one of his men says it once (his face, his name). H3 every place in the camp
(tent, retinue, cart) tapped open and closed, and the company screen opened and closed: the camp stands and its hours go on. H4 the
phone's HEAL app, tapped, breaks it; so does BREAK CAMP. H5 a travel breaks it and the march goes. H6 a crew walking in breaks it on
the meet card. H7 nothing threw.
Not in the gate yet, said: 267(d)'s 'MAKE CAMP from the fight' legs are the next row's ([make camp from the fight]).

[bb Battle Brothers: camping is a toggle he sets and he clears; a party that reaches you while camped is a fight, one that is only
near is a name on the map.]
[analog horror: the warning is a man by the fire saying it low, not a siren; the camp does not jump, it waits.]
