# BOHEMIA COORDINATOR SCHOOL, ROUND SEVEN OF TEN: THE TRAIL EVAPORATES (10/10/26)

## THE ANGLE
Our fleet is a stigmergic system: nobody talks, everybody reads marks left in a shared place and leaves new marks. Ants, termites and bees run the same way with no manager. The one thing their marks have that ours do not is a half-life. A pheromone trail fades in minutes, a scout's dance shrinks every trip, a Wikipedia edit nobody defends is gone in four minutes. Here nothing fades. Measured this hour: 95 rules and 1,665 lines on the front page; a handoff of 135,343 lines (9.3 MB) with 5,070 dated lines from July and August against 445 from October; 433 law files, 289 from July, 16 ever archived; 1,986 records; 165 July dates still cited on the front page; a reference lab retired 9/4 still named 17 times. Rule 18 was cited 214 times this month and rule 53 twice, and the page itself cannot tell them apart.

## WHAT THAT WORLD KNOWS
1. Grassé's termites (1959): the work is the cue. He wrote that social insects "ne dirigent pas leur travail, ils sont plutôt guidés par lui" (they do not direct their work, they are guided by it). https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/17564693/stigmergie , https://en.wikipedia.org/wiki/Stigmergy . Bites: the board IS the manager; a dead mark steers a lane as hard as a live one.
2. Real trails have a lifetime. Lasius niger trail pheromone lasts a mean of 47 minutes (Beckers, Deneubourg, Goss); across species trails last minutes to days, longest for ants farming permanent food. https://link.springer.com/article/10.1007/BF01201674 , https://cob.silverchair.com/jeb/article-pdf/212/15/2337/1414334/2337.pdf . Bites: the lifetime matches how long the food lasts; our food changes daily, our trails last forever.
3. Too-slow evaporation locks in the worse path. Goss (1989) gave Argentine ants a long path first; when a shorter one was added, in most trials the majority stayed on the long path, "trapped" because reinforcement outlived evaporation (same review). Bites: THE STEP IS A HOUSE and the walk were cited for weeks after they died.
4. The ant mill. Army ants cut off from the track follow each other in a circle; Beebe saw one 1,200 feet around run two days, bodies piling up, until a few workers straggled off (Schneirla 1944). https://en.wikipedia.org/wiki/Ant_mill . Bites: a trail with no food at its end, followed because it is followed.
5. Ant colony optimization needs rho. Dorigo: evaporation exists "to avoid unlimited accumulation"; the classic Ant System setting is rho = 0.5, half the trail gone each iteration, and rho = 0 stagnates. https://jmvidal.cse.sc.edu/library/dorigo03a.pdf , http://www.scholarpedia.org/article/Ant_colony_optimization . Bites: our rho is 0.
6. Seeley's scouts cannot lobby forever. A scout shortens her dance by about 15 circuits each return (measured slope about 17); once she returns without dancing she makes about one more visit and quits; 20 to 30 bees at a site is the quorum; the choice takes a day or two. https://journals.biologists.com/jeb/article/211/23/3691/17956/Sensory-coding-of-nest-site-value-in-honeybee , https://www.news.cornell.edu/stories/2006/04/honeybee-decision-making-ability-rivals-any-department-committee . Bites: the coordinator can repeat a rule forever at full strength.
7. The stop signal. Scouts from a rival site head-butt a dancer and buzz; enough butts and she stops. https://www.sciencedaily.com/releases/2011/12/111208141942.htm . Bites: a lane cannot shut a trail down, only add a line beside it.
8. Wikipedia heals in minutes because marks are watched: median revert four minutes (Cobb 2009), five (IBM); the mean is hours because the unwatched tail lasts months. https://signpost.news/2009-06-22/Vandalism , https://bewitched.com/historyflow.html . Bites: 135,000 lines is an unwatched tail.
9. Stale bots: probot-stale's defaults are 60 days to stale, 7 more to close; Gitea runs it to clear issues "left open even if solved or waiting for more insight." https://npmjs.com/package/probot-stale . Bites: our oldest OPEN rows were reopened 9/6 and nobody claimed them in a month.
10. Desire paths. Michigan State leaves ground unpaved, watches where students walk, then paves that. https://news.wisc.edu/desire-paths-the-unofficial-footpaths-that-frustrate-captivate-campus-planners/ . Bites: rule 12 (six lanes ignored named blockers) and rule 13 (lanes ran their own gates) were desire paths; pave what lanes do.
11. Broken windows, measured: 13 percent took a money envelope from a clean mailbox, 27 percent from a graffitied one (Keizer 2008). https://www.nature.com/articles/456424a . Bites: every dead line on the page invites the next.
12. Forgetting ranks memory. Ebbinghaus's savings fall to about a third at 24 hours and every re-reading flattens the curve; Hedberg (1981) named unlearning, discarding obsolete knowledge, as learning's counterbalance. https://en.wikipedia.org/wiki/Forgetting_curve , https://www.emerald.com/insight/content/doi/10.1108/EJTD-10-2021-0162/full/html . Bites: what is re-read should survive; we keep everything at full strength.

## WHAT THE COORDINATOR DOES NOT DO
- It never lets a mark lose strength. Rule 95 turns a CLAIMED row after three rounds, the one evaporation we have; nothing turns an OPEN row, a rule, a law, a record or a handoff block. 433 laws, 16 ever archived.
- It has no counter. No file says when a rule was last cited by a lane or by how many, so "retire by pointer" cannot run as a machine.
- It appends instead of replacing. THE SUITE LINE and THE CUT LINE carry fourteen sweeps (P through AG); only the newest is true, all are read.
- It decided the handoff split on 9/13 and never built it: handoffs/ does not exist.
- It wrote five rules today (91 to 95) and killed none.

## THE ONE CHANGE
THE TRAIL FILE. One machine-written table, records/target/BOHEMIA_TRAIL.json, one row per mark: every numbered rule, every [two-word] row, every law and record path, every handoff block. Each row holds last_cite (sha, sweep letter), lanes_citing (distinct lanes over the last 14 sweeps) and strength. tools/bohemia_trail_sweep.js writes it at every coordinator VAMILY, the colony's clock. No field is written by hand.

A CITE is mechanical: a commit on main by a lane other than the coordinator whose message or diff contains the mark's name ("rule 18", "[fight headroom]", the file path). The coordinator's own citations do not count.

THE RATES (rho 0.5 per silent sweep, applied as counts):
- A RULE: 7 silent sweeps and it folds to one line (title plus pointer). 14 and it leaves the front page: a rule quoting Paolo keeps its law file and gets its line in archive/bohemia_superseded.txt; a coordinator rule with no Paolo quote is deleted and lives only in its record. Any cite resets it to full.
- A ROW: OPEN and unclaimed 10 sweeps gets the word STALE; 14 and it moves to records/BOHEMIA_EVAPORATED_ROWS.md as one line. CLAIMED keeps rule 95's turn.
- A NOTE (SUITE, CUT, BREAK and COOK lines): the page holds the newest sweep only; the older entry moves into that sweep's record the moment a new one lands.
- A RECORD or LAW: uncited by any live file or lane commit for 30 days and the canon index drops it; it moves to archive/ with its registry line. Git keeps it; the canon does not.
- A HANDOFF BLOCK: the sweep reads *** as the block marker (2,612 of them against 12 ## headers: the desire path, paved) and keeps each lane's two newest blocks on the START file; older blocks go to handoffs/<LANE>_ARCHIVE.md, the 9/13 split built now.

THE QUORUM: a coordinator rule becomes a law file only after 3 distinct lanes cite it in commits (3 of 26 is the bees' fraction). Paolo's words skip the quorum.

THE STOP SIGNAL: a lane that measures a mark dead writes "STOP <mark> <sha> <why>" in its commit. The sweep zeroes that mark and stamps DEAD with a pointer the same sweep; a second STOP from another lane removes it from the page.

THE ANT MILL WE ARE IN, the coordinator's guess: the sweep lines. Each sweep appends a paragraph shaped like the last, lanes cite the newest, and the rule about shrinking the board is itself a new line. The food at the trail's end is Paolo's thumb, and it is exhausted: 173 items wait, 112 added since 10/9, while COOK EVERY ROUND is reinforced every round.

THE FIRST MARKS THAT EVAPORATE TODAY: the 17 mentions of the retired lab (STOP, 9/4); sweeps P through AF of THE SUITE LINE and THE CUT LINE (AG stays); every BREAK LIST entry before his 10/1 play; the handoff's July and August lines; the 8 OPEN rows dated September, [judge the old] and [ratchet sixty] first; and rules 53, 58 and 60, cited by lanes three times or fewer this month, which fold to one line.

## ONE RULE
EVERY MARK HAS A HALF-LIFE, AND ONLY A LANE'S COMMIT RENEWS IT: a rule, row, note, record or handoff block that no lane names in its commits for its set number of sweeps folds to one line, then leaves the page, and the sweep does the folding, never a person.

## FOR PAOLO, IN PLAIN WORDS
Ants find the best path because old trails fade unless ants keep walking them. Our board never fades, so old orders from July still steer the chats like they were new. I am adding a timer to every line on the board: if no chat uses it for a set number of rounds, it shrinks and then falls off, automatically.
