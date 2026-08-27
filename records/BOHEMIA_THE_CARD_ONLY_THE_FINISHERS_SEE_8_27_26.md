# THE CARD ONLY THE FINISHERS SEE
## Row 0f, the feedback card. PEOPLE lane, 8/27/26.
## Built: engine/bohemia_blackbox.js, tools/bohemia_city_feedback_patch.py
## Gate: gates/feedback_gate.js (54 claims, 0 red)
## Tab: RUN (the demo's last screen, and the save drawer any time)

---

## WHAT THE ROW ASKED FOR

> "three taps (fun? / confusing? / play again?) + an optional text box, exported
> exactly like the save blob so a tester can paste it into a chat."

Amended 8/25: the paste stamps THE BUILD AND THE SEED, because "it froze when I
went in the door" cannot be answered without them.

This was the last unowned row on the demo critical path. The handoff's own
order: BUILD, then DOOR, then ENDING, then INSTRUMENT, then INVITE. Build,
door and ending shipped. This is the instrument.

---

## MEASURED FIRST, ON THE REAL DEMO BUILD

Drove the shell, tapped the real splash, played a few beats, then read every
byte the page had kept:

```
bohemia:look          1,517 bytes
boh.city.minds          118 bytes
boh.city.deedweight       2 bytes
bohemia_sfxvol            1 byte
--------------------------------------------------------------
about how the session went for the person playing:      0 bytes
```

And `CT_BUILD` did not exist. The city has never known which build it is.

So today a tester who stops at minute four leaves nothing behind, and a tester
who finishes leaves nothing either.

---

## AND THE ROW AND THE PROTOCOL CONTRADICT EACH OTHER

The closed playtest protocol, standing rule, written 8/11:

> "A tester who stops playing is a FINDING, never a failure. Where and why is
> the whole point of the instrument."

The row asks for an END-OF-DAY card.

**A card at the end is filled in only by people who reached the end.** Everybody
who stopped, which is the exact population the protocol calls the whole point,
never sees it. The one finding the instrument exists to collect is the one its
placement makes impossible to collect.

That is not a small correction to the row. It changes what the thing is.

---

## SO THE PASTE EXISTS BEFORE THE CARD DOES

A flight recorder runs from the first tap. By the time anybody opens the card,
the record of their session is already written and the card only adds the
words. Somebody who quits at minute four and comes back next week still has it,
and there is a door into the card that is not the ending.

**IT SAMPLES, IT DOES NOT HOOK.** The city's own save carries the argument, in
its own comment: "ONE SEAM, NOT TWENTY: the writers are record/adjust/setState
and two ledgers, and hooking each is five chances to miss one." A two second
ticker reads the state the game already keeps and stamps a beat the first time
it becomes true. No call site is touched, so no lane can break this by moving a
function, and there is no writer to miss.

Eleven beats, and the paste says which ones happened and when:

```
the game came up / got out of bed / the phone rang / took the job /
left the block / got to the address / talked to somebody /
asked somebody their name / answered somebody / finished the job / went to bed
```

---

## THE QUESTIONS ARE NOT THE ROW'S LITERAL THREE

Researched 8/27. Every source lands in the same place.

**PEOPLE ARE NICE AND THEY WILL LIE TO YOU**, and friends and family are the
worst offenders, which is exactly who round one is. "Did you have fun?" is the
textbook vague question. "Would you play again?" is the textbook polite one.
Both were in the row.

The fix both aisles give is to ask about A BEHAVIOUR ONLY PEOPLE WHO LOVE A
THING PERFORM. They send it to somebody. That is Net Promoter's whole finding,
and its other half is that only the top of the scale counts, so a middle answer
is not a pass.

The second finding: THE USEFUL CUT IS FUN VERSUS WORK, and the single best open
prompt is "if you could change one thing", because a blank box beats five boxes
and a forced priority beats a blank box.

So the three taps are:

| | asks | answers |
|---|---|---|
| 1 | WOULD YOU SEND THIS TO SOMEBODY? | I already want to / if it were finished / no |
| 2 | WHAT PART FELT LIKE WORK? | the parts they reached, plus "none of it did" |
| 3 | WHERE DID YOU NOT KNOW WHAT TO DO? | the parts they reached, plus "I always knew" |

and the box asks IF YOU COULD CHANGE ONE THING.

The row's SHAPE is kept exactly: three taps, one box, one paste.

**AND THE TAPS ARE ABOUT THEIR OWN SESSION.** Question two offers the parts of
the day THEY ACTUALLY REACHED, never a generic list. A tester who quit before
the phone rang is never asked about the phone, because an option somebody
cannot have an opinion about is an invitation to make one up. That is only
possible because the recorder ran while they played.

---

## WHAT THE PASTE LOOKS LIKE (real, off the real demo)

```
BOHEMIA / ONE DAY / what it was like

BUILD: DEMO - BUILD 8/27y - THE MUSIC HEARS THE ROOM
SEED: bohemia / 2691674296
DEVICE: Mozilla/5.0 (...) 390x844 @1  en-US
PLAYED: 4m 19s over 2 sittings

GOT AS FAR AS: took the job
STOPPED THERE FOR: 3m 39s
IN GAME: day 1, 09:05

THE DAY, IN THE ORDER IT HAPPENED:
  0m 9s   the game came up
  0m 10s  the phone rang
  0m 14s  got out of bed
  0m 16s  took the job
NEVER GOT TO:
  left the block, got to the address, talked to somebody, ...

WOULD YOU SEND THIS TO SOMEBODY?
  if it were finished
WHAT PART FELT LIKE WORK?
  the phone
WHERE DID YOU NOT KNOW WHAT TO DO?
  (no answer)

IF YOU COULD CHANGE ONE THING
  took me forever to work out the phone was a thing i could open
```

It goes out the save blob's own door: the same share/copy/download modal, the
same .txt rule that exists because iOS blanks a .json on a chat share. A second
export mechanism is a second thing that can break on a phone nobody here owns.

---

## THE ORDER IS THE ORDER IT HAPPENED, AND THAT LOOKED LIKE A BUG

The first paste off the real demo read "the phone rang" above "got out of bed"
and I went looking for the error. There is none. The phone is already ringing
while he is still in bed. That is the game.

A list that claims to be chronological and is not makes a reader distrust the
whole page, so the paste sorts by the clock and puts what never happened
underneath, in its own block.

---

## TWO REAL HOLES THE GATE FOUND

**1. A TWO SECOND TICKER CANNOT SEE A CARD THAT OPENS AND CLOSES BETWEEN TWO OF
ITS LOOKS.** The "got out of bed" beat was read off the wake card going away,
and a fast player dismissed it inside one tick window, so the paste said he
never got up. Sampling is right for a durable fact and wrong for a transition.

A DURABLE FACT CAN BE SAMPLED. A TRANSIENT ONE NEEDS A WITNESS. The witness is
a MutationObserver on the card, which is still not a hook: no call site is
touched, nothing in the day loop knows it exists, and the browser does the
watching.

**2. AND THE GATE'S OWN SILENCE CLAIM WAS GREEN FOR THE WRONG REASON.** The
claim "when the ending lands there is nothing to press" read the door in the
same synchronous block as the ending itself, which is trivially empty for ANY
setTimeout. Mutating the pause from five seconds to zero left it green.

A CLAIM THAT PASSES BECAUSE OF WHEN IT LOOKED, NOT BECAUSE OF WHAT IS TRUE. It
now measures a second and a half in, which is an instant a person can actually
be at. Re-mutated: 1 red.

---

## THE ENDING KEEPS ITS SILENCE

Peak-end is the reason there is nothing to press on the last card. The last
moment is half of what anybody keeps, and replacing it with a survey spends
that half on a form.

So the door is not built into the ending. It arrives five seconds after the
message lands, appended to the card that is already up, quiet, under a rule, in
monospace rather than the game's voice. A player who closes the ending never
sees it, and the last thing THE GAME said stays the last thing the game said.

The card itself is deliberately not in the game's voice either. It says so out
loud on its first line: "not the game, thirty seconds". And it says what it
cannot do, on its last: "nothing gets sent from here. this builds a block of
text and you paste it wherever you want." This is a static page on a phone.
There is no server. Implying otherwise is the one lie a feedback card cannot
afford.

---

## WHAT IT CANNOT ANSWER, PRINTED IN THE MODULE

No silent caps. The instrument says its own limits:

- why they stopped, only where and for how long
- whether they were being kind, on any question
- anything at all about a tester who never opens the card

A round read as if the paste answered more than this is worse than a round with
no instrument.

---

## MUTATIONS

| broken | red |
|---|---|
| a beat re-stamps every time it is true | 1 |
| the taps offer everybody the whole day | 2 |
| the shell stops naming the build | 4 |
| the survey arrives the instant the message lands | 1 |
| the card is sampled instead of watched | 1 |

Baseline 0 red, 54 claims.

---

## WHAT THIS CLOSES

The demo critical path was BUILD, DOOR, ENDING, INSTRUMENT, INVITE. The first
four exist. INVITE is Paolo's, and it is the friends round.

The protocol is already written and has been since 8/11. It needs 5 to 8 people
he trusts to be honest, at least two of whom are not gamers, on their own
phones, with no explanation from him beyond "play this". Each one sends him one
paste. He forwards them. Nothing else is asked of him.
