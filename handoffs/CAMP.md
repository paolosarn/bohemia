CAMP (camp-session_01FfxbakbC): 10/26 LATEST -- [camp holds until he ends it] SHIPPED 8db01c53, BUILT, NOT YET SEEN (rule 179; rule
267(a), a bug; EYES q12 saw it live), BUILD 10/26zzc - CAMP HOLDS UNTIL YOU END IT. Record
records/BOHEMIA_CAMP_CAMP_HOLDS_UNTIL_HE_ENDS_IT_10_26_26.md. MEASURED on the old code (the new gate, computer 1/6): the contact flag a
won fight leaves up broke a camp made straight after a fight on its first hour and froze the valley; a crew two blocks off broke it;
a travel did not. NOW (marked __CAMP_HOLDS__ in the map, the camp's warning in the settlement screen): only his tap (the phone's HEAL,
BREAK CAMP where the phone is not up, T), a travel, or an enemy reaching it (the meet card or the fight) ends it; a crew coming is
said once by one of his men, tap-through; the tent's buttons no longer move under his finger. GATES: CAMP HOLDS UNTIL HE ENDS IT 14/0
(new, registered, phone and computer); RUN TWO's THE CAMP GATE re-aimed to 267(a) 8/0 (merged with UI TWO's rule 286(b)); THE HEAL
BUTTON 16/0, THE PHONE 219/0, MAKE CAMP FROM THE FIGHT 11/0, MEET BEFORE YOU FIGHT 15/0, THE BARS OVER THEIR HEADS 12/0. NOTEs: RUN,
RUN TWO, UI (for UI TWO: the camp sheet's close X is under the phone on a phone). VOTE: camp-camp-holds-until-you-end-it-10-26.
ALSO SHIPPED this session: [the bars over their heads] 9e5595cf (BUILD 10/26zu; THE BARS OVER THEIR HEADS 12/0).
NOT MINE ANY MORE: [make camp from the fight] 267(b) is RUN FOUR's, built (gates/make_camp_from_the_fight_gate.js); 267(c)'s pile of
the slain is the camp's look (CAMP TWO); 275(c)'s head start is COMBAT's (__PULLED_BACK__, meetFallBack's two blocks).
NEXT, in order: rule 278 [healing stops itself at full] (built, worktree camp-full: company().lowest/done, condition.json
camp_done_at 0.99, campDone breaks a camp made for mending at 99, PAUSE, one of his men says so; gate
gates/healing_stops_itself_at_full_gate.js), [a town is safe] 273(a)(b)(d) (built, worktree camp-town: townSafeAt, a hunter waits off
a town's ground, HEAL in a town rests there, on the edge it opens the town; gate gates/a_town_is_safe_gate.js), the injury days on
our clock 264(h) (scratchpad days_patch.py: condition.json struck_down_days_scale 0.2, 30-40 become 6-8), then [the fight saves only at
its start] (233).
[bb Battle Brothers: camping is a toggle he sets and he clears; a party that reaches you while camped is a fight, one only near is a
name on the map.]
[analog horror: the warning is a man by the fire saying it low, not a siren; the camp does not jump, it waits.]

PREVIOUS:
CAMP (camp-session_01FfxbakbC): 10/26 LATEST -- [the bars over their heads] SHIPPED 9e5595cf, BUILT, NOT YET SEEN (rule 179; rule 261
and 278(c); line 189), BUILD 10/26zu - THE BARS OVER THEIR HEADS. Record records/BOHEMIA_CAMP_THE_BARS_OVER_THEIR_HEADS_10_26_26.md.
BUILT: over YOU and every man of his, outside the fight (the map's party at every zoom, a town's picture with his crew standing and
walking, the camp), two small bars: red his hit points, grey his armour, the dark part what is missing, a hard dark edge; hidden when
both are at 87 percent or more, so a whole company shows nothing. engine/bohemia_condition.js bars(o) (by name, else look, YOU by key)
and drawHeadBars; records/target/bb/condition.json bars_hide_at 0.87 (his number). Hooks marked __THE_BARS_OVER_THEIR_HEADS__ in the
map (queued per man, drawn after the party; the map repaints on a condition change, here or from the town's frame by storage; YOU's
bars sit on the top of his ink, not his picture's box) and the settlement screen (end of drawPeople, every frame).
GATE: THE BARS OVER THEIR HEADS 12/0 (phone 6/0, computer 6/0, on the cut: B1 the map, B2 gone at 87, B3 a town through the map's door,
B4 the camp read in the frame it heals, B5 nothing threw, B6 the map draws once a frame for any number of heals); registered in the suite. Pre-ship: every red of the
browserless tier measured on plain main too, same legs (the record lists them); THE MAP ANSWERS AFTER BEGIN 12/0 on both (my first
build drew the map twice a heal and turned it red: fixed, B6); THE HEAL BUTTON 16/0, STRUCK DOWN HE STILL FIGHTS 30/0, THE CLINIC
HALVES BOTH 10/0, LONG INJURY 55/0. Known, not new: NOTHING COMES TWICE fetches condition.json twice (the map and the shell each
load the condition module; on main since ff94590b).
NOTEs: RUN, RUN TWO (for RUN THREE), TUNING. VOTE: camp-the-bars-over-their-heads-10-26.
NEXT, the coordinator's order (07:09): [camp holds until he ends it] (267(a), built in a worktree: the won fight's contact flag that
broke a camp made straight after a fight, a hunter two blocks off now a warning said by one of his men, a hidden frame shown again;
gate gates/camp_holds_until_he_ends_it_gate.js), rule 278 (healing stops itself at 99 percent, paused; drafted), [a town is safe]
(273), [make camp from the fight] (267(b)(c)), the injury days on our clock (264(h)), then [the fight saves only at its start] (233).
[bb Battle Brothers: every man in a fight carries a red hit point bar and a grey armour bar over his head; on its world map nothing.
We carry the two bars out of the fight and hide them at 87 so a whole company is clean.]
[analog horror: the bars are flat hard pixels with a black edge, a dried-blood red over a dull steel grey, a gauge on old equipment
emptying while you watch.]
