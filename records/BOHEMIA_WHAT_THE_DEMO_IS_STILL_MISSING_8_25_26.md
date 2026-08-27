# WHAT THE DEMO IS STILL MISSING — MEASURED, NOT GUESSED
# (8/25/26, coordinator, on his order: "WE ARE NOT READY FOR THE DEMO
# YET! WHAT ARE WE STILL MISSING! LOOK ONLINE FOR FEELINGS AND
# AWESOMENESS DEMOS PROVIDE AND THE WHOLE ENCHILADA")

## 0. MY ERROR FIRST
I called the workshop link the demo for four turns and planned a friends
round around it. Sending five people into a seventeen-tab dev bench would
have burned the one round that spends once. Law recorded:
laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_8_25_26.md. Everything
below is what I should have been counting instead.

## 1. WHAT IS ALREADY DONE, BECAUSE HE SHOULD SEE HOW CLOSE IT IS
Measured against the 8/4 demo plan's own critical path:
- **THE DAY PLAYS END TO END.** the_whole_demo_gate, 23 claims, one
  unbroken session, green today.
- **THE COLD OPEN PLAYS AND HANDS OFF.** coldopen_gate + opening_gate;
  PEOPLE closed the last seam this week ("all the way out the other
  side"), and found and killed a bug where a phone call was deleting
  three of the opening's four scenes.
- **THE VISTA HAS A CALLER NOW.** The 8/14 audit found the money shot
  with zero game-side callers; `__VISTA.open(` is live in the walked
  surface today. P0-VISTA is effectively closed.
- **THE SAVE SURVIVES A HOSTILE PHONE.** save_iphone_gate and
  save_compat_gate: walk-forward migrator, newer-build saves refused by
  name instead of wiped, ITP's seven-day eviction handled.
- **THE FIGHT HAS A DOOR AND A SOUND.** combat_entry_gate; SOUND put 17
  approved sounds into combat this week.
- **THE STREETS ARE WALKABLE AND EVERY DISTRICT HAS A WAY IN** — WORLD's
  rule number one, green for the first time.
- **THE PAYDAY BRIDGE HAS CALLERS.** 10 references in the walked surface,
  where the 8/14 audit found zero.
- **VOICES EXIST** (engine/bohemia_voice.js, voice_audible_gate).
THIS IS NOT A GAME THAT IS FAR AWAY. It is a game with no front door.

## 2. WHAT IS MISSING — THE LIST
**A. THE DEMO BUILD DOES NOT EXIST.** Zero standalone slices. Seventeen
   `data-p` tabs in the alpha. Nothing publishes a player-only file.
   THIS IS THE HEADLINE AND EVERYTHING ELSE IS SMALLER THAN IT.
**B. THE FRONT DOOR (RUN P0-DOOR, still open).** The alpha's markup still
   has `class="tab on" data-p="char"` — it opens on the CHARACTER
   workbench. Even inside the workshop, the game is not the first thing
   you see.
**C. THE FIRST MORNING POINTS AT THE WRONG BUTTON (RUN P0-MORNING).**
   Tapping only the obvious primary button goes GET UP -> SLEEP -> DAY 2
   and never plays anything. A tester can finish without meeting the game.
**D. THE FEEDBACK CARD (RUN 0f).** ~~Not built. Without it a round returns
   five texts saying "it was cool."~~ *** BUILT 8/27 (PEOPLE lane). Three
   taps and a box, out the save blob's own export door, stamped with the
   build, the seed and the device. AND THE PASTE IS WRITTEN WHILE THEY PLAY
   rather than at the end, because a card at the end is filled in only by
   people who reached the end, and the protocol's own rule says the tester
   who STOPS is the finding that matters most. There is a door into it that
   is not the ending. records/BOHEMIA_THE_CARD_ONLY_THE_FINISHERS_SEE_8_27_
   26.md, gates/feedback_gate.js, 54 claims. ***
**E. THREE MESSAGES ARE SOUND-ONLY** (SOUND's own classification):
   save_chime, ui_deny, STING:missed. `ui_deny` is the sharp one — a
   refusal with no sound looks exactly like a broken button.
**F. TWENTY-FOUR SECONDS TO FIRST PLAY.** RUN measured 24.2s on throttled
   weak 4G — every previous number was localhost with infinite bandwidth.
   A stranger who waits 24 seconds on a link a friend sent them is a
   stranger who does not wait.
**G. THE ENDING.** See §4. There isn't one. The day ends by going to bed.
**H. NOT A BLOCKER, BUT NAME IT:** the demo has no title screen of its
   own, no "what is this", no way to stop and come back that a stranger
   would recognise as such.

## 3. THE RESEARCH — WHAT A DEMO ACTUALLY DOES TO A PERSON
He asked for the feeling, so this is the feeling half, and the two aisles
converge on the same answer from opposite directions.
### THE REAL-WORLD AISLE: PEOPLE DO NOT REMEMBER WHAT HAPPENED
Kahneman and Fredrickson's **PEAK-END RULE** (the 1993 study "When More
Pain Is Preferred to Less: Adding a Better End", with Schreiber and
Redelmeier) is one of the most replicated findings in the psychology of
experience: a person's memory of an episode is almost entirely predicted
by **TWO DATA POINTS — the most intense moment, and the last moment.**
Not the average. Not the total.
And the companion finding is **DURATION NEGLECT: HOW LONG IT WAS BARELY
REGISTERS.** A meta-analysis of the peak-end rule and duration neglect
found strong support for both. The neuroscience agrees: hippocampal
encoding is biased toward high-affect moments and toward BOUNDARY moments
— beginnings, endings, scene changes.
**SO A DEMO IS NOT A SAMPLE OF THE GAME. IT IS TWO MOMENTS THAT A PERSON
WILL CARRY AROUND, PLUS SOME TIME THEY WILL NOT REMEMBER.**
### THE GAMES AISLE: THE DATA SAYS THE SAME THING BY ACCIDENT
Chris Zukowski, who is the practitioner on this and whose demo work this
repo already cites, surveyed developers in February 2025 on demo length
and found **a roughly 50/50 split in what studios chose and NO MEANINGFUL
DIFFERENCE IN MEDIAN WISHLIST PERFORMANCE between them.**
Read that next to duration neglect and it stops being a shrug: **length
does not correlate with outcome because people are not measuring length.**
Two independent bodies of evidence, one from a psychology lab and one
from Steam's numbers, arriving at the same place.
What Zukowski does say matters: a demo unlocks the two channels nothing
else opens — **streamers and festivals** — and the ending is not
neutral. His framing of the cliffhanger is the useful one: it must make a
player think **"I need to play more of this," not "that was annoying,"**
and ending without giving a reason to come back actively hurts the demo.
### PUT TOGETHER, THE RULE FOR US
A great demo needs exactly three things and the rest is polish:
1. **ONE PEAK BIG ENOUGH TO BE REMEMBERED.** We have it and it is ruled:
   THE VISTA, the whole valley from the mountain. The plan's own words
   call it "the demo's money shot."
2. **AN ENDING THAT IS A DOOR, NOT A FULL STOP.**
3. **NOTHING IN THE WAY OF EITHER.** Which is the whole of §2.

## 4. THE FINDING THAT CHALLENGES WHAT WE BELIEVE — AND IT IS ABOUT HIS
## OWN RULED CUT
The demo cut, ruled 8/4, runs: COLD OPEN (the sibling dies) -> THE VISTA
-> ONE GOOD DAY -> sleep.
**BOTH PEAKS ARE IN THE FIRST FIVE MINUTES AND THE LAST THING THE PLAYER
FEELS IS GOING TO BED.**
Under peak-end that is exactly backwards. The peak is fine wherever it
sits — memory does not care when the peak happened — but **THE ENDING IS
DOING NOTHING, AND THE ENDING IS HALF OF WHAT THEY KEEP.** "I went to
sleep" is the emotional flatline of the whole session, and it is the note
the player walks away humming.
**THIS IS NOT A REQUEST TO RE-CUT THE DEMO. THE CUT IS HIS AND IT IS
GOOD.** It is a request for the last thirty seconds, which nobody has
designed at all. The cheapest version costs almost nothing and uses
machinery that already exists: **the day ends, you sleep, and something
arrives that you cannot answer, because the demo is over.** The phone
already carries the day's work; a message landing on it as the screen
goes is one beat of writing and one call.
There is a second candidate that is even more ours: **the vista returns.**
It is already locked canon that the overlook UPGRADES PER ACT. Ending on
the valley again, changed even slightly by the day the player just spent
in it, is a peak AND an end in one shot, and it says the thing the whole
game is about without a word of text.
**WHICH ONE IS A CREATIVE CALL AND IT IS HIS.** Both are drafted, cheap,
and built on existing parts. Neither moves a single beat of the ruled cut.

## 5. THE DECISION (mine, EVERYTHING IS A THUMB)
1. **THE DEMO BUILD IS THE NEXT THING THE FLEET MAKES.** Not a feature.
   A published file with no dev tabs and its own URL, cut from the
   workshop, sharing every engine module.
2. **THE ORDER IS: BUILD, DOOR, ENDING, INSTRUMENT, THEN INVITE.**
   A demo with no front door cannot be tested. A demo with no ending
   wastes the half of memory that lasts. A round with no instrument
   returns nothing. Every one of those is cheaper than the round it
   protects.
3. **NOBODY IS INVITED UNTIL ALL FOUR EXIST.** The friends round is
   downstream of the demo build, not the workshop. Everything sweeps 14,
   20 and 21 routed still holds — pinned build, canonical seed, one muted
   tester, build stamped into every paste — it just applies to THE DEMO
   BUILD'S link, not the workshop's.
4. **24 SECONDS IS A BLOCKER, NOT A NICE-TO-HAVE.** RUN already measured
   it honestly and is on it. It stays on the list until it is under the
   ceiling on throttled 4G, because the demo's first boundary moment is
   the loading screen.

## 6. ROUTED
- **SHARED — DEMO-BUILD: CUT THE DEMO.** A published player-only file,
  its own URL, zero dev tabs, cold-boots into the game. Gate:
  `demo_build_gate` (zero dev tabs in the demo; cold boot lands in the
  game; the workshop still boots with all seventeen tabs). REVERSIBLE,
  and it must not fork the engine.
- **RUN — P0-DOOR stays top of queue** and now serves two surfaces.
- **RUN — DEMO-END: THE LAST THIRTY SECONDS.** Draft both candidates in
  §4, tagged draft:true, and put them in front of him inside the game.
  The words are ours to attempt; which ending is his.
- **RUN — the 24-second ceiling** stays demo-blocking.
- **ALREADY ROUTED AND UNCHANGED:** 0f (+ build/seed stamp), P0-MORNING,
  SILENT-2, SHARED -13 (pinned ref, now pinning the DEMO build).

## 7. CONFIDENCE
- Seventeen tabs, no standalone slice, P0-DOOR still open, the vista
  caller now present, 10 payday references: read in place. **HIGH** —
  and on the boot tab specifically I am reading MARKUP, and this repo has
  already caught me once assuming markup equals runtime, so P0-DOOR's own
  open status is the stronger evidence, not my grep.
- 24.2 seconds on throttled 4G: RUN's own measurement, with their
  instrument-correction written up. **HIGH.**
- Peak-end and duration neglect: foundational, replicated, meta-analysed.
  **HIGH.**
- Zukowski's demo-length survey: practitioner survey data, self-reported.
  **MEDIUM-HIGH.** The convergence with duration neglect is my argument,
  not his.
- That a better ending changes what testers say: a **PREDICTION**, and
  round 1 is the test.

## SOURCES
Kahneman, Fredrickson, Schreiber & Redelmeier (1993), "When More Pain Is
Preferred to Less: Adding a Better End"; the peak-end / duration-neglect
meta-analysis in Organizational Behavior and Human Decision Processes
(2022); NN/g and Laws of UX on the peak-end rule in experience design;
Chris Zukowski / howtomarketagame on Steam demos, demo length and the
streamer-and-festival channels, via Game World Observer and Game
Developer; practitioner field guides on building a demo that converts.
In-repo: records/BOHEMIA_THE_DEMO_PLAN_8_4_26.md,
laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_8_25_26.md,
BOHEMIA_BACKLOG.md (P0-DOOR, P0-MORNING, 0f, P0-VISTA, E1-RUN),
gates/the_whole_demo_gate.js, gates/coldopen_gate.js,
gates/save_compat_gate.js, commit d62c1a9 (the 24-second measurement).
