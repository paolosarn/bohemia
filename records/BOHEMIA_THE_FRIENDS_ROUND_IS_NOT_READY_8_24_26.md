# THE FRIENDS ROUND WILL PRODUCE NOTHING, AND TWO SMALL THINGS FIX IT
# (8/24/26, coordinator. The demo plays end to end and is gated. This is
# the thing standing between "it plays" and "we know if it is good.")

## WHERE WE ARE
The demo plays start to finish and something proves it: 21 claims, 44
seconds, one unbroken session from the splash to the valley. The board's
next step is ROUND 1, the friends round. That protocol has existed since
8/11, ready and waiting.
IT IS NOT READY TO RUN. Two things would make a friends round return
nothing, and both are cheap. Neither is a demo bug.

## PROBLEM 1 — THE INSTRUMENT DOES NOT EXIST
The protocol's whole design rests on one object: "the in-demo FEEDBACK
CARD (RUN 0f) + the telemetry paste. Each tester sends Paolo ONE paste."
**RUN 0f WAS NEVER BUILT.** It sits open in the backlog, tagged
"demo-ADJACENT, never demo-blocking" — which was correct on 8/11, when
the demo did not exist and the card would have blocked it for no reason.
That tag is now wrong in the only way that matters: THE CARD IS NOT
DEMO-BLOCKING, IT IS PLAYTEST-BLOCKING, and the playtest is the next step.
(`gates/feedback_master_gate.py` exists but is a different thing — it
protects PAOLO'S feedback from going missing, not a tester's.)
WITHOUT IT: five to eight people play, and Paolo gets five to eight text
messages saying "it was cool". No quit points, no confusion map, nothing
comparable between round 1 and round 2, and the protocol's own rule —
"a tester who stops playing is a FINDING" — has no way to record where
they stopped. THE ROUND IS SPENT AND FIRST IMPRESSIONS SPEND ONCE.

## PROBLEM 2 — WE ALREADY KNOW HOW THEY WILL FAIL, AND IT IS WRITTEN DOWN
From the demo's own record, in the lane's own words: **tapping ONLY the
obvious primary button goes GET UP -> SLEEP -> DAY 2 and never plays
anything. The day's work is behind the PHONE and the thing pointing at it
is one unread badge.**
So a tester can complete the demo without ever meeting the game.
THE RESEARCH SAYS THIS IS THE DEFAULT BEHAVIOUR, NOT AN EDGE CASE.
Playtest practitioners report the same finding over and over: players
click through without reading, follow the highlighted thing, and skip
text. One observed session is the exact shape of ours — players "breezed
through the tutorial by clicking every highlighted button they were told
to," and minutes later had no idea how anything worked, because the
tutorial had taught them WHERE TO CLICK, not what it meant. The lesson
practitioners draw: design for how real players behave, not how the
developer imagines they will.
AND THE REAL-WORLD AISLE NAMES IT EXACTLY. Don Norman's distinction:
AFFORDANCES are what an action is possible on; SIGNIFIERS are what tells
you WHERE the action goes. His running example is a door — and his rule
is that when you have to put a sign on a door, THE DESIGN ALREADY
FAILED. Our badge is a sign on a door. The big button is the handle
everyone reaches for, and it leads away from the game.
THE FIX IS NOT A TUTORIAL AND NOT MORE TEXT. It is making the phone the
obvious thing at 06:00 — the biggest, most primary-looking action on
screen, so the hand goes there without instruction. GET UP / SLEEP can
stay exactly where they are; they simply must not be the loudest thing in
the room on the first morning.

## THE DECISION
1. **RUN 0f IS RE-TAGGED PLAYTEST-BLOCKING and built before anyone is
   invited.** Three taps and a text box, exported like the save blob.
   Small, and the round is worthless without it.
2. **THE FIRST MORNING GETS ITS SIGNIFIER FIXED** before round 1, not
   discovered by round 1. We know the failure, it is on record, and
   spending a fresh-eyes round rediscovering a known bug is spending the
   one thing the protocol says spends once.
3. **NOTHING ELSE GETS ADDED FIRST.** No new features before the round.
   The demo is done; this is instrumentation and one signifier.

## WHAT COMES AFTER, IN ORDER
1. The card + the first-morning fix (RUN, one session, both small).
2. ROUND 1: 5-8 people Paolo trusts, their own phones, the one link, and
   PAOLO SAYS NOTHING.
   *** ADDED 8/25 BY SWEEP 19 (records/BOHEMIA_THREE_SOUNDS_ARE_THE_ONLY_
   COPY_8_25_26.md): ONE OF THEM PLAYS WITH THE SOUND OFF, DELIBERATELY,
   and their paste records that. It is the accessibility practitioners'
   own test, verbatim — "ask someone to play through for the first time
   with the sound muted; if at any point they cannot progress because
   information was missed, it needs to be conveyed another way." Three
   cues in this build are information with no picture behind them
   (phone_buzz, done_ring, save_chime), and the first morning already
   depends on one of them. It costs one line in the invite and it uses a
   round we are running anyway. *** The protocol is strict about this and it is the
   hardest part for him: he does not explain the controls, does not
   defend the game, does not watch over shoulders. One question after:
   "would you play more?"
3. Compile every paste into one digest — quit points, confusions, verbatim
   quotes. Route findings to lanes as corrections.
4. Fix, then ROUND 2 with FIVE TO EIGHT NEW PEOPLE. Never re-screen to the
   same audience; they compare against memory instead of nothing.
5. Only then does the public question come up, and it is his.

## CONFIDENCE
The card's absence and the 0f tag: read from the backlog, high. The
first-morning trap: the RUN lane's own record of the demo, high. The
player-behaviour findings: practitioner playtest write-ups, consistent
across sources, medium-high. Norman's affordance/signifier distinction:
published and standard, high. The claim that fixing the signifier will
change round-1 behaviour is a prediction, and round 1 is the test of it.

Sources: antidote.gg (FTUE playbook and "5 Common FTUE Mistakes We See
During Playtests"), uxdesign.cc (games UX onboarding), ixdf.org
(playtesting, affordances, signifiers), Norman's The Design of Everyday
Things; plus records/BOHEMIA_THE_WHOLE_DEMO_PLAYS_8_21_26.md and
records/BOHEMIA_CLOSED_PLAYTEST_PROTOCOL_8_11_26.md.
