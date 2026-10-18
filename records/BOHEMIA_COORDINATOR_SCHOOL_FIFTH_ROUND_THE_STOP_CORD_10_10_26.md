# BOHEMIA COORDINATOR SCHOOL, ROUND FIVE OF TEN: THE STOP CORD (10/10/26)

## THE ANGLE
Toyota built the only factory floor where the lowest worker can stop a billion-dollar line, and where the manager's first job on hearing the alarm is to walk to the station and look, not ask for a report. One belief holds it up: a defect that moves one station down the line costs more than the whole line standing still. This fleet is the opposite. Twenty-six lanes push to one live link, the director finds the defects on his phone, four lanes measured one load four ways and nobody stopped, and the coordinator's own five minutes on a throttled phone found two defects no lane's instrument reported. What is the cord here, who pulls it, and what does the coordinator do when it is pulled?

## WHAT THAT WORLD KNOWS
1. The cord is pulled constantly. The BBC reported about 2,000 pulls a week at Toyota Georgetown against about two a week at Ford Dearborn (https://www.leanblog.org/2007/02/toyota-ford-andon-cord-culture-difference/). Here: zero pulls while four lanes touched one load. The Ford number.
2. A pull does not stop the line by itself. It summons the team leader; the line stops only if the problem is not fixed within takt time (https://blog.gembaacademy.com/?p=11302). Cheap to pull, expensive to ignore, so people pull it. Here there is no cheap pull, only a silent push.
3. GM Fremont before NUMMI had no cord, and raising a problem got you punished; the norm was to pass the defect down the line (https://archive-yaleglobal.yale.edu/content/lean-mean-20, https://www.industryweek.com/operations/continuous-improvement/article/55394935/andon-is-a-signalbut-leaderships-response-is-the-critical-part). Cars left with engines in backwards and no brakes (https://www.npr.org/transcripts/125229157). Four load times and nobody saying "these cannot all be true" is passing it down.
4. Same workers, different system: NUMMI absenteeism fell from 20 to 25 percent to 3 to 4 percent, and J.D. Power counted 117 problems per 100 NUMMI cars against 151 for the industry (https://pmworldjournal.com/article/two-worst-to-first-stories). GM took fifteen more years to use the lessons in its own plants (https://www.npr.org/2010/03/26/125229157/the-end-of-the-line-for-gm-toyota-joint-venture). The fix was never the people; it was whether the system let them stop.
5. Toyota told GM that workers had the obligation to stop the line, not merely the right (John Shook, https://sloanreview.mit.edu/article/how-to-change-a-culture-lessons-from-nummi/). Here every lane has the right to flag a defect and none has the duty.
6. Jidoka: Sakichi Toyoda's loom stopped itself when a thread broke, so one worker could watch thirty to fifty looms (https://www.allaboutlean.com/jidoka-3/). Poka-yoke makes the wrong action impossible (https://teeptrak.com/en/what-is-poka-yoke-mistake-proofing-2026/). Our gates read the repo; nothing stops itself when the phone downloads a tile twice.
7. Ohno's chalk circle: a manager stands in a circle on the floor for hours or a full shift, watching one operation without touching it, until he sees what Ohno saw (https://www.allaboutlean.com/chalk-circle/). A gemba walk is the same idea, not a tour or an audit (https://www.lean.org/lexicon-terms/gemba-walk/). Reading a reply that says "48 s" is a tour.
8. Ohno's five whys: the machine stopped because the fuse blew, because the bearing lacked oil, because the pump moved too little, because the shaft was worn, because there was no strainer; replace the fuse and it recurs (https://www.lean.org/lexicon-terms/5-whys/). Failure modes: stopping at symptoms, missing causes you do not already know, assuming one cause (https://blog.thinkreliability.com/top-criticisms-of-the-5-why-approach, https://qualitysafety.bmj.com/content/26/8/671). Four lanes each replaced the fuse.
9. The cord moved to software: if any pipeline stage fails, everyone stops feature work and fixes it; nobody checks in on a broken build (https://github.com/ikurochkin/software-delivery-assessment/blob/main/continuous-delivery.md). Dodo Pizza stopped the line once, lost three of ten sprint days, and had a faster pipeline within three sprints (https://www.agilealliance.org/?p=8051903). Amazon lets any front-line service associate pull a product off the site (https://amazon.jobs/jobs/2863537). The cost of stopping is paid once.
10. The seven wastes: transport, inventory, motion, waiting, overprocessing, overproduction, defects (https://art.torvergata.it/bitstream/2108/100809/1/43013.pdf); kanban caps work in progress and heijunka levels flow against lumpy batch pushes (https://www.industryweek.com/operations/continuous-improvement/article/21126989/why-heijunka-is-critical). The fleet's biggest waste is DEFECTS, measured by who finds them: the customer, at 46.5 seconds. Overproduction is second: one feature four times, 66 MB nobody asked for, every tile twice, twenty-six lanes pushing every thirteen minutes with no cap.

## WHAT THE COORDINATOR DOES NOT DO
- He does not pull the cord himself. He found the double download and wrote a record; the next push to main went through anyway. A finding without a stop is a report, and GM had reports.
- He does not go to the station when a lane reports a number. 85, 67, 48, 22 were read from replies, not reproduced. The one time he stood at the phone, he caught it.
- He does not ask why twice, let alone five times. Each load fix replaced the fuse. Nobody asked why two loaders exist.
- He does not treat "four numbers for one thing" as the defect. Two stopwatches on one load cannot both be right, and he let both stand.
- He does not limit what may ship. No kanban card for the demo; a firehose.

## THE ONE CHANGE
THE STOP BLOCK, live this hour.

Who pulls: any lane, EYES, PLUMBER or the coordinator, the moment they see a defect on the real surface (the throttled phone loading the live link). Not a suspicion from reading code; a thing seen. Pulling is an obligation: the lane that saw it and pushed anyway is the violation, never the lane that pulled wrongly.

With what words: one block at the TOP of the handoff file, in this exact shape:
STOP (lane, time): I SAW <the defect in one sentence, with the number> ON <the phone profile and the link> AT <the second or minute>. The line is stopped for slices/ and engine/.
Nothing else goes in the block. No fix, no theory.

What stops: every push to main that touches the shipped folders (alpha, engine, demo, slice tiles). A lane that sees a STOP block commits to its own branch and waits. What keeps moving: research lanes, records and laws, art cooked into folders the demo does not load, handoffs.

At the station: within the same round the coordinator loads the live link on the throttled phone himself, network panel open, and reproduces the defect before reading any lane's explanation. If he cannot, he writes NOT SEEN and the line restarts. If he can, he writes the five whys under the block as far as he honestly gets. Two worked now, guesses marked G:
Every tile downloads twice. Why? Two code paths request the same files, a preload list and the tile loader (G). Why two? Two lanes each wrote a loader without knowing the other's existed (G; four lanes, four numbers, is the evidence). Why not know? Loading has no owner and no file saying what loads when. Why no owner? Lanes are cut by game system; loading is a pipe no lane's name covers. Why not caught? No gate watches what the phone receives; VERIFY ON THE REAL SURFACE has no machine gate.
One feature built four times, all checks green. Why four? Each round the lane popped the same backlog item. Why? A rejection did not remove it; the GO procedure resumes or pops the next thing. Why not removed? The rejection lived in Paolo's words in a chat, not in the backlog or the graveyard. Why green? Checks test "built right", never "was it wanted". Why no such check? Verdicts are prose files no gate reads (G).

Restart, all three: the cause is written under the block (not the symptom; "a file was big" is a fuse); the coordinator saw the fix on the phone with the number; one gate or measurement line now goes red if the defect returns. Then he writes RESTART (time) and moves the block to a records file. Takt is one round: fixed inside it, the lanes barely feel the stop.

The chalk circle: every round, before reading a single lane reply, thirty minutes on the throttled phone, network panel open: load the live link cold, watch every file land, play five minutes, write every number seen (seconds to start screen, files after the door, bytes, requests per tile, reloads, pages fetched). Fix nothing in the circle. If his numbers disagree with any lane's, that is a pull.

The poka-yoke: ONE stopwatch. Load time, file count and requests per tile are read by one script on the throttled profile into one line in one measurement file; a lane may quote that line and may not quote a number of its own; a gate refuses a commit carrying any other load number. Only one thing measures, so two lanes cannot measure two ways.

## ONE RULE
THE LINE STOPS WHERE THE DEFECT IS SEEN, NEVER WHERE IT IS REPORTED. Whoever sees a defect on the phone pulls the cord with one sentence, nothing ships to the live link until the coordinator has stood at the phone and written the cause, and no number about the demo exists unless the one stopwatch wrote it.

## FOR PAOLO, IN PLAIN WORDS
Toyota lets any worker stop the whole car line the second they see something wrong, and the boss walks over and looks instead of asking for a report. We never had that, so the bad stuff rolled down the line to your phone. From now on anyone who sees a problem on the phone stops the shipping line, I go look at the phone myself, and nothing ships again until I have written down why it happened.
