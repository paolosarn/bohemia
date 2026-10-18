# BOHEMIA COORDINATOR SCHOOL, ROUND FOUR OF TEN: CALLING THE SHOW (10/10/26)

## THE ANGLE
Every night a stage manager lands several hundred cues, in order, in front of a paying house, with a crew who each do one thing and never decide when. A news director puts a camera on air with one word. A launch director stops the clock on purpose and polls every console. A pit crew releases a car in 1.80 seconds because one light says go. All of them learned in public: write the order down before the show, fire every cue with one reserved word, build the pauses into the clock, write a report after. We have 26 lanes pushing to one live link whenever they finish, nobody calling anything, and a director who learns what landed by opening his phone.

## WHAT THAT WORLD KNOWS
1. The prompt book puts the script on one page and the cues on the facing page, a line drawn from the exact word the cue fires on to the cue, in pencil (https://theatrecrafts.com/pages/home/topics/stage-management/the-prompt-book/). Bites here: our book is 200 commits read after the fact; nothing is written against the line it fires on.
2. "Go" is reserved. On headset people say "the G word" or spell "G-O" when they only mean to talk about a cue, because the operator fires on the sound of it (https://en.wikipedia.org/wiki/Cue_(theatrical)). Bites here: every lane's "shipped" is a go word, and 26 people say it.
3. Warning a minute out, standby 30 seconds out, then go; the crew answers "standing by"; same words, same order, every time (https://smnetwork.org/forum/stage-management-plays-musicals/prompt-book-creating-a-calling-script-(meta-thread)/30/). Bites here: no lane ever stands by; it is silent or already live.
4. A late cue is inserted as 10.5 or 10A, never by renumbering, because renumbering rewrites the whole book; a jump from 44 to 100 reads as a missed cue (https://theatrecrafts.com/pages/home/topics/lighting/lx-cues/). Bites here: a late insert slots between two planned ships without reordering anyone.
5. In tech the director and designers place each cue; the stage manager calls them. On opening night the director leaves and hands over the show (https://theatreartlife.com/?p=257; https://www.tuacahn.org/spotlight-stage-managers/). Bites here: Paolo places cues with his votes; he must never call them.
6. The pre-show calls are fixed: half hour, fifteen, five, places. One posted schedule: 7:30, 7:42, 7:52 with "crew to places for headset check", 7:57 (https://smnetwork.org/forum/stage-management-plays-musicals/calling-half-hour/). Bites here: he opens the link at a time nobody announced, so the house is always mid scene change.
7. The performance report, every show, records each act's run time, who was out, which understudy went on, every injury, every missed cue, by department (https://human.libretexts.org/Bookshelves/Theater_Film_and_Storytelling/Technical_Theatre_Practicum_(Boltz)/01%3A_Chapters/1.11%3A_Production_Reports; https://archives.nypl.org/the/18690). Bites here: a deploy has no report, so the same half-state lands three times.
8. Live TV fires with two words: "ready camera two" puts the shot on preview, "take two" cuts it to air; the director calls, the technical director presses. When the backtime turns red the producer kills a story and it vanishes from rundown, prompter and anchors' tablets at once; floating content waits in a Z-block (https://murphy.sjmc.umn.edu/aufklarung/U-Report/index.php-name=Rarig_Studio&m=Rarig_Jobs.mov.html; https://davebusiek.substack.com/p/how-do-live-tv-shows-stay-on-time). Bites here: our only preview monitor is his phone, and a kill is a revert nobody calls.
9. The fastest pit stop is 1.80 seconds (McLaren, Qatar 2023). The lollipop is now a light that goes green only when every wheel crew and both signallers have pressed a button (https://www.guinnessworldrecords.com/world-records/108666-fastest-formula-one-pit-stop; https://www.autosport.com/f1/feature/4121/the-secrets-of-formula-1-pitstops). Bites here: speed came from one release signal, not from skipping it.
10. A shuttle count had seven built-in holds: T-27h, 19h, 11h, 6h, 3h, 20 min and 9 min. T-20 held 10 minutes; T-9 held about 45 and carried the final go/no-go poll. One commit criterion out (upper winds "no-go" at 90 percent weather "go") scrubs the day (https://en.wikipedia.org/wiki/Built-in_hold; https://space.com/12190-space-shuttle-launch-countdown-minutes-liftoff.html; https://spacenews.com/?p=29432). Bites here: our clock never stops, so there is never a moment to ask.
11. When a cover goes on with no rehearsal, the show does not change; the night does. Kate Marilley went on in The Prom with a swing running lines while her wig and mic were fitted; at the Met a baritone replaced in Act One sang the duet "without any rehearsal whatsoever" (https://www.papermag.com/kate-marilley-the-prom; https://slippedisc.com/?p=625184). Bites here: a lane replaced mid round keeps the cue list; the stage manager runs the lines.

## WHAT THE COORDINATOR DOES NOT DO
- It does not read the show after the show. Learning a cue landed from the commit log means it did not call the show. This alone catches the skipped title screen before his phone does.
- It does not say "go" in any sentence that is not a go. "Shipped", "landed", "live" are banned on the board without a cue number.
- It does not fix in the hold. The moves in a hold are go, hold, or scrub. "Just patch it" gets a scrub.
- It does not let Paolo call a cue. Asking him when something should land hands him the headset.

## THE ONE CHANGE
The build gets a prompt book, a reserved word, two holds, and a report.

THE CUE LIST: one file at repo root, BUILD_CALLING_SCRIPT.md, the facing page of the handoff. One row per planned ship, written by the lane BEFORE it builds:
`CUE 14 | COMBAT | reach ring lights on the fight tiles | FIRES ON: splash stamp reads BUILD 10/10d | NEEDS: CUE 12 | STATE: WARNING`
The number is the landing order. A late insert is 14.5, never a renumber. NEEDS names the cue it fires after; an unmet NEEDS cannot reach standby. The coordinator owns the order column only; the lane owns its row. Pencil: a row changes, it never moves.

THE WORDS, in order, and who says them:
- WARNING (the lane, at round start): the row exists; "this lands after cue N."
- STANDBY (the lane): suite green once, buildstamp bumped, SHA named in the row, nothing pushed. On standby a lane may rebase, re-run the suite, write its handoff block. It may not push.
- GO (the coordinator only): the word `GO` in the STATE column with the minute. The lane pushes within 5 minutes or lapses to WARNING. No other GO until this cue's pages run is SUCCESS. One car in the box at a time.
- `GO` appears nowhere else on the board. Talking about a cue, write G-O.

THE HOLDS, two, built into the clock:
- T-9: before each GO the coordinator opens the live link and reads the splash stamp; that is the preview monitor. Three commit criteria: (1) the lane's suite green within 60 minutes, (2) the NEEDS cue reads LANDED, (3) the live stamp equals the stamp the row fires on. One out, no GO. Hold under 3 minutes.
- PLACES: 15 minutes before the reply to Paolo, no GO is issued; the last pages run must be SUCCESS and contain the last GO'd SHA (merge-base, not eyeballing); the coordinator watches the first 60 seconds on a phone. His VAMILY always lands on a called, seen build.

THE SCRUB: a failed pages run, a live stamp that does not match the row, or anything in the first 60 seconds not on the list, and the coordinator writes `SCRUB` in the row; the lane reverts that commit as its next push, no fix-forward. A second scrub on one cue ends it for the round. A cue the demo can drop is marked `FLOAT` and is scrubbed first.

THE REPORT, five lines, by the coordinator within 10 minutes of each pages SUCCESS, appended under the date at the bottom of BUILD_CALLING_SCRIPT.md, read by every lane at the top of its round:
1. STAMP and RUN TIME: `BUILD 10/10d, push to SUCCESS 4 min 12 s`.
2. CUES CALLED and LANDED: `called 14, landed 14; 13.5 held (NEEDS 12)`.
3. WHO WENT ON: which lane was replaced or scrubbed.
4. WHAT WENT WRONG: the missed cue, the broken tile, the skipped screen; one line each, with a fix owner.
5. INJURIES: anything that reached his phone wrong. The goal is `none`, written out.
Paolo sees lines 1 and 5 only, in plain words, inside the two-sentence bottom line.

HOW HE STAYS OUT AND STILL OWNS IT: his votes and words are the cue placements, cited in each row. He never hears standby or go; he hears places as a finished build with a readable stamp, and line 5. Two reports running without `none` and no GO is called until the baseline is fixed.

## ONE RULE
NOTHING GOES LIVE WITHOUT A CALLED GO, AND NOBODY BUT THE COORDINATOR SAYS IT.
A lane writes its cue before it builds, stands by when it is green, pushes only on the word, and the coordinator reads the live stamp before the next word and writes five lines after.

## FOR PAOLO, IN PLAIN WORDS
Right now 26 chats put their work in the game whenever they feel like it, so you open it and catch it half changed. From now on each chat writes down what it is adding and in what order, waits for the manager to say go, and the manager looks at the live game before saying it. You will always open a build that was checked first, with a stamp you can read, and the manager tells you in two lines what landed and what broke.
