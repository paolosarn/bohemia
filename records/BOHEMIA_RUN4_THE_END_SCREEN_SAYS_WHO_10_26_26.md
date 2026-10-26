# RUN FOUR [eyes: the road crew ran]: the end screen says who they were (10/26/26)

THE ASK (EYES round five, on RUN TWO's board for RUN FOUR): on the live BUILD 10/26zq, computer, after two dire wolves and a hyena the
end screen said 'YOU WON | THE ROAD CREW RAN' over '3 OF 3 OF THEIRS DOWN', and 'NOBODY CLIMBED' for no level. STEP: the line names who
they were (the pack, the raiders) and says ran only when some ran; a level is 'a level', never 'climbed'.

## WHY IT SAID THAT
The fight's showOver() (COMBAT's slices/BOHEMIA_FIGHT.html) prints one head for every won fight that is not pulled out, haunted or a
wipe: 'THE ROAD CREW RAN'. recapOf() reads that card and hands it to the end screen, which printed it as it came. Nothing looked at who
was on the board or whether anyone ran.

## THE FIX (my screen only; the fight file is COMBAT's and my brief says do not edit it)
slices/BOHEMIA_SPOILS_SCREEN.html wonHead(spoils), used only when the fight's head is that one generic line (or missing):
- WHO, off spoilsOf().bodies and .faction (both already handed over): every body a beast is THE PACK (one: THE BEAST); else the
  faction: brigands THE RAIDERS, machines THE MACHINES, kids THE KIDS, heavies THE HEAVIES, ghosts THE DEAD (one: THE RAIDER, THE KID...).
- WHAT: some ran and none fell: '... RAN'; some fell and some ran: '... BROKE AND RAN'; none ran: '... IS DOWN' / '... ARE DOWN'.
- The fight's other heads (RETREAT_RECAP, HAUNT_RECAP, WIPE_SAYS) pass through as they are.
- The crew line counts levels: 'NO NEW LEVEL', '1 NEW LEVEL', '2 NEW LEVELS' (levels gained this fight across the men), never 'climbed'.
All words draft:true.

## MEASURED
THE SPOILS 28/0. S3 (new, the page): the sample (two dead, one ran, brigands) reads THE RAIDERS BROKE AND RAN; three beasts down THE
PACK IS DOWN; two beasts down and one ran THE PACK BROKE AND RAN; four raiders down THE RAIDERS ARE DOWN; two machines who all ran THE
MACHINES RAN; one kid THE KID IS DOWN; the crew line '2 NEW LEVELS, 1 HURT', no 'CLIMB'. E1 (re-aimed, the live demo through the map's
own door): 'YOU WON / THE RAIDERS ARE DOWN' over '2 OF 2 OF THEIRS DOWN'; the gate's E1 now passes only when the head names them, says
RAN exactly when the fight's own units fled, and says the pack exactly when every one was a beast.

## ROUTED
NOTE COMBAT (their section): the card behind the end screen still says THE ROAD CREW RAN for every win; narrator_gate reads that word,
so changing it is theirs.

[bb Battle Brothers' roaming parties carry what they are as their name on the map (brigand raiders, direwolves), so a fight is always
against somebody; ours says that somebody on the end screen, the pack or the raiders, and RAN only for the ones who ran.]
[analog horror: the head is a tape label, the who and the what and nothing more.]
