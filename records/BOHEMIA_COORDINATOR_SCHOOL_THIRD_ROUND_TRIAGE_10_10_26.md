# BOHEMIA COORDINATOR SCHOOL, ROUND THREE OF TEN: TRIAGE (10/10/26)

## THE ANGLE
Mass-casualty medicine was forced, by bodies on the ground, to admit that more patients than hands means some do not get treated, and that a sorter who treats has stopped sorting. Larrey paid for the lesson with wounded men lying 24 to 36 hours on the field; emergency rooms pay in measured death rates; Mozilla pays in thousands of bug reports a week. All arrived at the same shape: a fast sort with four tags, one for "needs nothing from us", one for "we will not spend on this", and a hard cap on the one scarce resource. Ours is one man's thumb, and 173 items are lying on the field.

## WHAT THAT WORLD KNOWS
1. Larrey treated by wound severity regardless of rank or nationality, and built the "flying ambulance" so the sort happened near the fight instead of 24 to 36 hours later (https://en.wikipedia.org/wiki/Dominique_Jean_Larrey; https://jmvh.org/article/historical-developments-in-casualty-evacuation-and-triage/). Bites here: our items are sorted by which lane shouted, and only when he opens the tab.
2. START sorts a patient in 30 seconds on three signs, and its first move is shouting "anyone who can walk, come to me", which removes about 50 percent of victims from the sort (https://www.fireengineering.com/firefighting/start-triage-with-rpm/; https://www.wikem.org/wiki/Start_triage). Bites here: half the 173 can walk, and nobody has shouted.
3. The expectant tag is for the casualty whose treatment "would pull effort from patients with a better chance", used only when the normal plan is already overwhelmed (https://www.rcemlearning.co.uk/modules/triage-in-mass-casualty-situations/lessons/triage-categories/topic/introduction-142/). Bites here: an item with a ruling already costs him a tap a real fork needed, and we have no gray tag.
4. Pooled across 32 studies START is right 73 percent of the time, over-triages 14 percent, under-triages 10; on real adult patients it under-triaged 57 percent against SALT's 26 (https://resolve.cambridge.org/core/journals/prehospital-and-disaster-medicine/article/abs/metastart-a-systematic-review-and-metaanalysis-of-the-diagnostic-accuracy-of-the-simple-triage-and-rapid-treatment-start-algorithm-for-disaster-triage/9780160ABB6FD77AAAA941155C4A310E; https://augusta.elsevierpure.com/en/publications/comparing-the-accuracy-of-mass-casualty-triage-systems-when-used-). Bites here: a quarter of any sort is wrong, so it must be cheap to re-run.
5. The American College of Surgeons sets under-triage at 5 percent or less and accepts over-triage of 25 to 35 percent: the two errors are not equal, and the system is built to make the cheap one five to seven times as often (https://www.pubmed.ncbi.nlm.nih.gov/35191799/; https://naemsp.org/prehospital-episode/ep-138-deep-dive-under-and-over-triage-field-triage-guidelines/). Bites here: we never named our expensive error, so we make both.
6. SALT, the CDC consensus system, sorts first by walk, wave, or still, and allows the sorter only lifesaving moves that take seconds, with "the equipment, the skill, and enough time" (https://www.ems1.com/mass-casualty-incidents-mci/articles/how-to-use-salt-to-triage-mci-patients-ioh8pD88282FDTdy/). Bites here: reading 200 commits and answering 26 lanes is surgery in the sorting tent.
7. The ESI nurse assigns a level and nothing else; the 2020 edition cut wording because nurses had begun assigning levels "based on the ED's current capacity and bed availability rather than the patient's physiologic status" (https://emscimprovement.center/documents/2177/Emergency_Severity_Index_Handbook.pdf); a measured door-to-triage median is 12 minutes (https://cambridge.org/core/services/aop-cambridge-core/content/view/4638EF5524564154042050A652E33C7D/S1481803516003985a.pdf). Bites here: a tag comes from the item, never from how full the tab is.
8. Reverse triage, the lightly wounded first so they return to the fight, is rare and real (German army in WWII, the Falklands) and applies when the unit's survival outranks the individual's (https://militaryhealth-bmj-com.bibliotheek.ehb.be/content/early/2024/07/18/military-2024-002774). Bites here: a lane stopped by one tiny vote gets that vote first.
9. Diversion kills at the system level: heart attack patients whose nearest ER was on diversion 12 or more hours died at 19 percent versus 15 in 30 days, and one hospital diverting sets off a domino of neighbors (https://pmc.ncbi.nlm.nih.gov/articles/PMC3690784). Massachusetts banned it in 2009 except for "code black"; volume rose 3.6 percent, length of stay fell 10.4 minutes (https://journalofethics.ama-assn.org/article/ending-ambulance-diversion-massachusetts/2010-06; https://www.beckershospitalreview.com/care-coordination/study-free-clinics-could-reduce-unnecessary-ed-visits/capacity-management/study-ambulance-diversion-ban-did-not-increase-ed-crowding.html). Bites here: closing the tab moves the pile into 26 handoffs; sort at the door, do not lock it.
10. Mozilla names one triage owner per component, assesses new bugs daily, fully triages within one week, caps an unanswered question at two weeks, and at cycle end demotes P3 bugs it will not do to P5 or resolves them WONTFIX (https://github.com/mozilla/gecko-dev/blob/master/docs/bug-mgmt/policies/triage-bugzilla.rst). Chromium DevTools keeps P0 for "fire drill" work, "seldom needed", and closes WontFix what it already decided against (https://chromium.googlesource.com/devtools/devtools-frontend/+/refs/heads/chromium/4844/docs/triage_guidelines.md). Bites here: our tab has one state, "waiting", and nothing ever leaves.

## WHAT THE COORDINATOR DOES NOT DO
- It does not treat in the tent: no answering a lane's design question in a sweep note. It tags the question; the lane or the law answers. Cuts 26 notes to 8.
- It does not forward. An item reaches his screen because the coordinator tagged it RED, never because a lane registered it. Cuts 173 to under 40.
- It does not re-ask a ruling. Anything a law, a locked vote, or NOTES ARE RULINGS already answers is closed with the citation.
- It does not bump a tag because the queue is long. RED is RED at 3 items or 300.
- It does not read everything. A walking lane gets its handoff block and commit title read, not its diff.

## THE ONE CHANGE
A four-tag sort on the vote registry, applied by the coordinator at the door, with a cap and a clock.

THE TAGS (every item gets one within one sweep of being registered, the door-to-triage standard):
- GREEN, WALKING: the lane could pick an answer and be defensibly right. Test: "if the lane chose A and he hated it, would it cost more than one correction while playing?" If no, GREEN. It leaves the tab the same sweep, the lane builds its pick, he corrects by playing. About half the pile.
- GRAY, EXPECTANT: the team already knows the answer, or two options he cannot tell apart, or a duplicate. The coordinator writes the one-line ruling it cites (a law, a locked vote, a note of his) and closes it, WONTFIX style. Never shown. This tag kills his "can't tell difference" notes.
- YELLOW, DELAYED: a real fork, but no lane is stopped by it. Held off his screen. Promoted to RED when the RED count drops below 6, oldest first; demoted to GRAY after 14 days if the lane shipped a default meanwhile.
- RED, IMMEDIATE: only a name or identity he reserved, a fork with no defensible default where a lane is stopped until he picks, or a thing he asked to see. A blocked lane's tiny item outranks a big unblocked one. One RED per lane per sweep, hard; the lane picks which.

THE CAP: no more than 12 RED items in front of him at once. His bursts are 30 to 80 votes, so 12 is one screen he finishes and still sees each one. Items 13 and up wait hidden, in the coordinator's order, not arrival order.

THE EXPECTANT RULE: before any item goes RED, the coordinator checks the laws index and the three locked vote records; a ruling found makes it GRAY with the citation. A lane that goes GRAY three times in a round loses its RED slot next round.

THE ERROR THAT IS WORSE: holding a thing he must see (under-triage) stops a lane for a round; showing him a thing not ready (over-triage) costs one tap and one annoyed note. Like the surgeons, we accept over-triage up to a third of REDs and under-triage of 1 in 20. The cap bounds the first; the clock exposes the second: an item older than one sweep without a tag is a sort failure on the coordinator's row.

THE DIVERSION RULE: the tab never closes to new registrations, because diversion moves the pile into the lanes' handoffs and starts a domino. The only "code black" is Paolo saying the baseline is broken (STOP PRODUCING); then every RED but the one item that fixes the baseline drops to YELLOW until he says go.

THE FIRST HOUR: run the 173 through GREEN, then GRAY, then split the rest. Expect roughly 85 GREEN, 40 GRAY, 36 YELLOW, 12 RED.

THE SWEEP'S 30-SECOND SORT FOR LANES (walk, wave, still, per lane, before reading any diff):
- STILL: blocked, build red, or waiting on him. Gets a note; its item is checked for RED. 3 to 6 lanes.
- WAVE: asked a question a law answers, or duplicates another lane (three load-time measurements becomes one owner, PLUMBER, and two notes: "PLUMBER owns it"; three guesses in flight make the problem worse). One line with the citation. 3 to 6 lanes.
- WALK: shipped, gates green, no ask. Silence; the commit is the record. Half the lanes or more.
Notes per sweep: 8 or fewer. A sweep that writes 26 notes did not sort.

## ONE RULE
THE SORTER DOES NOT TREAT, AND THE WALKING LEAVE THE TENT.
The coordinator tags every item and every lane in seconds, lets anyone who can decide alone decide alone, and puts at most twelve true forks in front of Paolo at a time.

## FOR PAOLO, IN PLAIN WORDS
Field doctors learned that when there are more hurt people than hands, you sort fast, send the ones who can walk away on their own, and do not spend on what you already know. We are doing that to your vote pile: about half of it the chats can decide themselves, a chunk already has your answer in an old vote, and you will only ever see twelve real choices at a time. Fewer taps, and every tap will actually change the game.
