# CAMP, round two: STRUCK DOWN, HE STILL FIGHTS (rule 234) AND THE CLINIC HALVES BOTH (rule 241), 10/26/26

Rows: CAMP [struck down, he still fights] ONE-HIT-POINT-AND-ACTIVE (rule 234; his words:
records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md) and CAMP [the clinic halves the days and the
debuff] THE-WHOLE-TRADE-BEFORE-HE-PAYS (rule 241; records/BOHEMIA_PAOLO_THE_CLINIC_SHOWS_THE_DEBUFF_AND_THE_DAYS_AND_HALVES_BOTH_10_26_26.md).
Session camp-session_01FfxbakbC. The third row, [the fight saves only at its start] (rule 233), is the map-to-fight door's and waits
on COMBAT's emergency like the door half of rule 234 (section 6).

## 1. WHERE THE BENCH LIVED, MEASURED BEFORE A LINE WAS WRITTEN
The 9/27 law's 'takes them out of fights for 30 to 40 game days' was the coordinator's reading of his 'a debilitating injury'. It
was written into five live places, and each one held a struck-down man out on its own:
1. records/target/bb/ours.json struck_down_laid_up_days: the reading sat in a 'quote' field as if he said it.
2. engine/bohemia_long_injury.js (PEOPLE 10/9): 'days laid up', healDay counting them down.
3. The crew screen (slices/BOHEMIA_ROSTER_SCREEN.html, RUN TWO's): laid(m) took him off the line into a LAID UP strip, refused a
   drag back, left him out of the company the fight is handed, and parked him on the hand-over's bench with the day he could return.
4. The job sizing (slices/bohemia_job_kinds.js rosterMen): left him out of the count until his day.
5. THE MAP'S DOOR (the alpha's nfOpts, gone2): a fight the crew screen had not read held him out until fight day + his days, and the
   hand-over's bench brought him back only on his day. With damage that stays (rule 226, 72835dfb), one bad first fight benched most
   of a crew for a month: he restarted runs without getting past the first day.
The fight itself never benched anybody: it rolls the wiki's mark and the 30 to 40 days and sends them home. Nothing in it changes for
the bench; it changes only to take the fresh wound in (section 6).

## 2. HOW BATTLE BROTHERS DOES IT (rule 33)
A brother struck down who lives gets one of the wiki's eleven PERMANENT injuries (records/target/bb/injuries.json, kind permanent,
bb_all/1540_Permanent Injuries.txt: 'incurable disabilities received after having been struck down in battle'), each a stat penalty
for life. He is never barred from a fight: the player decides who goes in. Temporary injuries heal in days (1 to 9, the wiki rows'
heal_days); the Surgeon takes a day off every injury (bb_all/1974). The temple shortens the time to heal; Battle Brothers halves the
time only, halving the penalty too is ours, his words (rule 241(b)).

## 3. WHAT IS BUILT
- THE DEBUFF, NEVER THE BENCH (engine/bohemia_long_injury.js, PEOPLE's module, amended with a marked header): what a struck-down man
  carries is two parts, both the wiki's own numbers:
  THE MARK, for life: the permanent row's effects (the fight already reads it: opts.company[i].marks, crewUnit's carried injuries).
  THE FRESH WOUND, for his 30 to 40 days: the wiki's temporary injury of the same part the mark is the never-healed form of, its
  whole penalty the day he wakes, falling in a straight line to nothing on the last of his days. freshNow(mark, left, of) gives it in
  the exact shape the fight's injMult and move cost read; penalties(marks, wound) is the list the crew card draws; look(marks, wound)
  is what his face shows (BLOOD while more than half is left, the BANDAGE until it closes, then the mark alone) for PORTRAIT.
  The browser copy inlines the eleven marks with their effects and the fresh table; the gate checks it byte for byte against Node's.
- THE TABLE (records/target/bb/condition.json, CAMP's file, TUNING's one table reads it; both rows draft, picked_by CAMP):
  struck_down_fresh, mark by mark: Brain Damage <- Severe Concussion; Broken Elbow Joint <- Fractured Elbow; Broken Knee <- Injured
  Knee Cap; Partly Collapsed Lung <- Pierced Lung; Maimed Foot <- Cut Achilles Tendon; Missing Ear <- Ripped Ear; Missing Eye <- Grazed
  Eye Socket; Missing Finger <- Crushed Finger; Missing Nose <- Split Nose; Weakened Heart <- Pierced Chest; Traumatized <- none (the
  wiki gives it no flesh wound: 'faced with his own mortality'; its mark is his debuff). struck_down_fresh_full_share 1 (the whole
  wiki penalty the day he wakes). struck_down_hp_left now cites rule 234 ('their health will just be at one').
- ours.json struck_down_laid_up_days: the false quote is gone (kept under 'was'); it cites rule 234 and the 9/27 law's 30 to 40 days,
  and its 'why' says the days are the fresh wound's and never keep him out. The key keeps its name because the fight reads it.
  struck_down_injury.value.lasts is 'life', fresh_wound_days names the days row.
- THE COMPANY'S CONDITION (engine/bohemia_condition.js, CAMP's): the one clock for a wound, by name. afterFight keeps, for a man
  struck down and alive, ONE HITPOINT (as before), every mark he has ever taken (a list, for life) and his fresh wound (mark, days
  left, days of). The map's clock (elapse) counts the wound down by the hour, camped or marching (the wiki heals an injury by days;
  camp speeds hitpoints and mending, not injuries; the surgeon's day comes off when it is given). handOver gives the fight his marks
  (the crew screen's and the fight's, one list) and his fresh wound as it stands today (c.marks, c.fresh). injuryOf(name) is the
  whole picture for the crew card and PORTRAIT. wounded() / treat(name) are the clinic's. wake() (section 5).
- THE CREW SCREEN (RUN TWO's file, marked lines, NOTE on RUN TWO's board): laid() is false for everyone; a struck-down man keeps his
  place in the line and is in the company the fight is handed; his cell carries his wound's days (a red border, never greyed); his
  card says STRUCK DOWN, THE WOUND N OF M DAYS, every mark for good, PEOPLE's pain line, THE INJURY CARD, and 'He can fight.' with
  the clinic's price (or that a clinic already cut it). syncCondition reads the days and the marks from the company's condition
  whenever it knows him, so the crew card, the clinic and the fight read one clock. The old strip is empty; nothing refuses a drag.
- THE JOB SIZING (slices/bohemia_job_kinds.js): a struck-down man counts; the dead never.
- THE END-OF-FIGHT WORDS (slices/BOHEMIA_SPOILS_SCREEN.html): 'STRUCK DOWN. ONE HITPOINT, STILL IN THE CREW: <MARK>', never 'laid up'.
- THE INJURY CARD (slices/bohemia_injury_card.js, CAMP's, new): one drawing for the town's clinic and the crew card (rule 241(c): they
  match). THE WOUND: a blood drop drawn a pixel at a time and the wound's word; its debuff as stat icons (UI's slices/stat_icons/, a
  short word where the kit has none yet: SIGHT, STEP, XP) each with a red DOWN arrow as long as the cut (a green up arrow for the one
  that helps: Brain Damage's +15% resolve), the exact figure on hover or hold (rule 224(b)); the days on a pixel clock; with the
  clinic, the clinic's after beside the now (the days cut in two, every arrow halved); FOR LIFE, the marks' own arrows and 'The clinic
  cannot touch this. It is his for life.'; the price.
- THE TOWN'S CLINIC (slices/BOHEMIA_SETTLEMENT_SCREEN.html, CAMP's marked block __THE_CLINIC_HALVES_BOTH__ in RUN TWO's file):
  MEASURED: the live game never handed the town its hurt (only the old loop page posts o.wounded), so the clinic always said nobody
  was hurt while the crew screen quoted its price. Now it reads the company's own condition, one card a man, the whole trade before he
  pays; Treat halves the days left (rounded up, the hired medic a day more) and so the wound's penalty, never the mark.
- THE CAMP'S LOOK (engine/bohemia_camp.js look(), rule 239's NOTE): the fire and whether the company is camped, the cart he has grown
  to, each follower by his word, a tent a head, the stash's room, one call for UI's camp behind the crew screen. The surgeon's words
  now say 'heals his fresh wound a day sooner'.
- THE ALPHA loads engine/bohemia_long_injury.js beside the condition (the hand-over needs freshNow).

## 4. NUMBERS, MEASURED
- Missing Eye, 34 days: the day he wakes -50% ranged skill, -2 sight (Grazed Eye Socket, the wiki's whole); 17 days left -25%, -1;
  the last day nothing; for life -50% ranged skill, -2 sight (the mark).
- Struck down at 63 hitpoints: one hitpoint after the fight; 8 camped hours +16 (2 an hour camped, the table's); about 31 hours of
  march to whole (1 an hour); the fresh wound runs its 33 days whatever the camp does.
- The clinic at the fort (fortress prices): 85 batteries for 34 days; after Treat 17 days and the wound at half.

## 5. OLD SAVES WAKE (row step 4)
engine/bohemia_condition.js wake(), at every boot of a window that loads the condition (the alpha, the map, the crew screen, the
town): a man on the crew screen's old bench (bohemia.company.line.v1 bench, a save from before this round) is put back in the company
the fight is handed, at the hitpoints the condition kept for him or, when it kept none, at ONE; his mark and his days come from the
crew screen's own climb file. The bench is emptied, so it happens once. The door's bench line (prepared, section 6) brings any man
left there too.

## 6. WHAT WAITS ON COMBAT'S EMERGENCY, AND WHY (the coordinator's order: 'do not touch the fight's door code until COMBAT's board
## shows that row SHIPPED on main')
The door half of this row is two small edits, written and tested on copies, not applied:
- the alpha's nfOpts: gone2 keeps only the dead (no 'r.down && r.injury && today < f.day + r.laidUpDays'), the hand-over's bench
  always comes (no 'today >= b.until');
- the fight's intake (COMBAT's file): the roster copies m.fresh, crewUnit's carried injuries take c.fresh beside the marks; the end
  card says STRUCK DOWN, STILL IN with the mark, never LAID UP N DAYS.
Shipping the rest without them would put him on the crew screen's line while the door still held him out of the next fight whenever
the crew screen had not been opened since, and size the job for a man who is not there. So the whole row ships at once.
WHAT IT LEAVES RED UNTIL THEN (the legs that bite on the door): gates/long_injury_gate.js G's last leg (names the two door lines),
gates/struck_down_he_still_fights_gate.js S3 and S4, gates/who_you_hire_fights_gate.js W8's three re-aimed legs.

## 7. GATES
- gates/struck_down_he_still_fights_gate.js (new, rule 234(g)), on the cut he plays, phone and computer: S1 the fight's own fall()
  strikes his men down until one lives; S2 one hitpoint, the mark, the wound kept; S3 he stands in the very next fight at what he was
  handed; S4 his mark and his fresh wound on that board, freshNow's exact effects; S5 the HEAL bar counts him; S6 the camp heals him at
  the table's rate; S10 his face's stage handed to PORTRAIT; S7 the wound closes, the mark stays; S8 on the crew screen's line; S9 an
  old save's benched man wakes; S11 nothing threw. Before the door: 8/3 on the computer (S3, S4 the door; S10 my own leg, rewritten).
- gates/the_clinic_halves_both_gate.js (new, rule 241(e)), phone and computer: C1 the clinic knows he is hurt; C2 the whole trade (the
  wound's mark and word, a stat icon and a red down arrow a cut, the days on a clock, the after halved beside it, his for life
  untouched, the price); C3 a real press on Treat pays and halves the days and the debuff, the mark untouched; C4 the crew card
  matches; C5 nothing threw. 10/0.
- gates/long_injury_gate.js: + G (rule 234), eleven legs: the fresh table is the wiki's rows byte for byte in the table and the
  module, the browser copy is Node's, whole the day he wakes, half halfway, nothing at the end, Traumatized none, the penalties, the
  face's stages, ours.json's quote gone, and no live file holds a man out for his days (red until the door).
- RE-AIMED, each leg's old text kept in the gate's header as what rule 234 struck: gates/roster_hurt_gate.js (RUN TWO's: he stays in
  the line, the next fight gets him, nobody refused, the card's wound and its after; 14/0); gates/the_roster_counts_who_can_fight_gate.js
  (WORLD's R1: three dead and four struck down size the job to nine, the dead never; 6/0); gates/the_crew_screen_at_fourteen_gate.js
  (a struck-down man's name and his wound's days, in the line); gates/who_you_hire_fights_gate.js (W8: the fallen hire stands in the
  next fight, on the line, never held home).
- Held: THE HEAL BUTTON 16/0 (phone 8/0, computer 8/0) with all of this in; GEAR NEVER VANISHES 6/0.
- Red, not mine, measured: INLINED FRESH (tools/bohemia_city_module_resync.py refuses: engine/bohemia_followers.js's closing banner is
  missing in the map file; PEOPLE's module, on main before this round).

## 8. NOT DONE, SAID
- The door half (section 6) and so the row's SHIPPED; then [the fight saves only at its start], the same door.
- His face (rule 234(c)) is PORTRAIT's row [the face shows the wound]: the data is handed (BohemiaCondition.injuryOf(name).look:
  the marks, the wound's stage, its share).
- The injury's own icon a kind (rule 234(d)) is UI's: the card draws a blood drop for every wound and the stat icons the kit has;
  SIGHT, STEP and XP are words until UI draws them.
- AUTO keeping a man under a third of his hitpoints behind the shields (234(e)) is COMBAT TWO's.
- The red tick a laid-up man got on the bar (slices/bohemia_ui_materials.js, 'a red tick until he is back', capped at a fifth for his
  days) is UI's file: it should read his real hitpoints now; NOTE on UI's board.

## 9. THE NEXT ROW, MEASURED NOW SO IT GOES IN FAST: [the fight saves only at its start] (rule 233), all at the door
- THE FIGHT KEEPS ITSELF MID-FIGHT TODAY (slices/BOHEMIA_FIGHT.html keptTick, bohemia.fight.kept.v1): at the start of every turn of
  his it writes the whole frozen fight, and a reload of the same hand-over within six hours resumes it there. Rule 233(b) is the
  opposite. The fight already has the switches: opts.keep === false writes nothing, opts.resume === false reads nothing; and
  opts.seed sets its dice (SEED), so the same opts deal the same board, the same enemies, the same men.
- THE PLAN (door code, after COMBAT's emergency): nfOpen writes ONE start record (bohemia.fight.start.v1: the opts exactly as the
  door built them, the company as it walked in with its .cond, the party, the seed, keep and resume off) and has the map save
  where he stands (saveNow); nfOverIn and the spoils keep the fight's results in memory (the condition's afterFight, the after
  queue, the loot's batteries and goods); nfHome, the moment the map opens, writes them all, clears the start record and saves.
  At boot, once the map's save is read back, a start record still there reopens that fight from it: turn one, the same board, the
  same enemies, his men as they walked in. A killed write: the two-slot save (engine/bohemia_save.js) keeps the one before whole.
- THE GATE (233(f)), phone and computer, demo: start a road fight, three turns, a man falls, reload: turn one, same board, same men;
  finish, reach the map, reload: the results stand; reload twice mid-fight: turn one; the save before a killed write loads whole.

[bb Battle Brothers: struck down and alive is a permanent injury for life and nothing else; nobody is ever barred from a fight; the
temple and the surgeon shorten an injury's days.]
[analog horror: the wound reads like a medical chart left out in the rain: a drop of dried blood, a clock with no glass, arrows the
colour of old iodine, and under it the line that does not go away.]
