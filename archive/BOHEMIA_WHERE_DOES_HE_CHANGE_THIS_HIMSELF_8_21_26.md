# WHERE DOES HE CHANGE THIS HIMSELF (8/21/26, PEOPLE lane)

## WHERE TO SEE IT: the **DIRECT** tab, third chip, **STANDING**. Set what each
## thing you can do is worth, press PLAY WHAT I BUILT, and it drops you on the
## street where the person who watched you now has an opinion.

---

## I BROKE HIS OWN LAW THREE TURNS RUNNING

Over three turns this lane shipped a reputation system: people witness what you
do, remember it, tell each other at a penalty per retelling, forget it as it
fades, and a loud act carries further than a quiet one. Its entire **judgement**
layer, `bohemia_standing`'s `DEED_WEIGHT`, ships deliberately empty and waits on
Paolo. That is correct under MECHANISM-MINE / CONTENTS-PAOLO'S: numbers are his
and nothing may invent one.

**But the only way he could fill it was to tell me and I edit a file.** His own
8/12 law answers that in one line:

> **"where does he change this himself?"** If the answer is "he tells me and I
> edit a file", the system is not shipped yet.

My own handoff said it three times, approvingly: *"THE DIAL, AND IT IS HIS.
Nothing should invent it."* That sentence is right about the first half and blind
to the second. **Not inventing his numbers and not giving him the controls are two
different mistakes**, and I kept making the second one while congratulating myself
for avoiding the first.

## WHAT HE GETS

Four things he can do on that street, each in plain English, each with a ladder he
taps:

```
You turn an outfit down to their face      -5 -3 -1 [NOT RULED] +1 +3 +5
You do the thing an outfit asked of you
You take a favour from an outfit
You throw in with an outfit
```

**What he reads is the consequence, not the number.** A raw integer is not a
decision anyone can make. This is:

> someone who WATCHED it: -3.0 (COLD) · someone who only HEARD: -1.6 (COLD)

**NOT RULED is a real position, not zero.** Zero would mean "worth nothing";
NOT RULED means he has not said, and while he has not said, nobody in the game
forms an opinion at all. Pressing it again takes the ruling back, because being
able to undo is half of a dial.

**It crosses the frame the moment he presses.** The city applies it in place, so
`opinionOf`, `standingOf` and the rungs light up with no other wiring, and the
card on the person who watched him gains a row:

```
SAW           watched you turn an outfit down
THEY THINK    COLD (-3.0)
NAME          YOU HAVE NOT ASKED
```

**It keeps and it exports**, as a `.txt` a lane can land straight into
`DEED_WEIGHT` as canon.

## THE TABLE STILL SHIPS EMPTY, AND THE GATE PROVES IT

Nothing here seeds a row, suggests a value, or defaults to anything. The gate
asserts every shipped declaration of `DEED_WEIGHT` is `{}`, and that the only
writer anywhere is the dial receiver.

## THE ONE I ALMOST GOT WRONG, KNOWING BETTER

The readout needs the rung boundaries and the hearsay penalty. The obvious way to
get them is `fr.contentWindow.BohemiaStanding`, and **that throws SecurityError**,
because `file://` frames are opaque origin `"null"`. Measured, not assumed.

The tempting repair was to retype `RUNGS` and `HEARSAY_LOSS` up in the alpha.
**That is exactly the second-copy drift this lane spent the previous turn
deleting**, and it would have been introduced on purpose, one day later, by the
person who wrote the record about it.

So the city computes the answers with the shipped module and posts them back. The
ladder is fixed, so one reply covers every button and no press costs a round trip.
The gate asserts the alpha holds no copy of either table, and a mutation that
retypes them goes red.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_direct_tab_patch.py` | STANDING mode: the dial, the readout, export, play |
| `tools/bohemia_city_deeds_patch.py` | receives his ruling, applies it in place, persists, answers the readout |
| `gates/city_dial_gate.js` | new, 22 claims, on the real alpha through both tabs |
| `gates/direct_gate.js` | one assertion generalised (see below) |
| `gates/bohemia_gates.py` | registered as CITY DIAL (306 of 406) |

Mutation-proved, each with arrival verified in the file under test first:

| mutation | result |
|---|---|
| seed the table with a default | **1 red** (after the gate was fixed, see below) |
| stop the dial crossing the frame | **3 red** |
| retype the rungs in the alpha instead of asking | **1 red** |

## TWO THINGS THIS GOT WRONG FIRST

**A RUNTIME PROBE COULD NOT SEE A SEEDED TABLE, BECAUSE MY OWN PUSH ERASED IT.**
The first mutation, seeding `DEED_WEIGHT` with a default, left the gate GREEN. The
reason is subtle and worth keeping: the alpha pushes his (empty) dial across on
boot, and the receiver clears the table before applying, so the seed was
*neutralised* rather than *caught*. The runtime behaviour is right, his dial is
the authority, but it means no probe can ever see a seeded default. The gate now
asserts the shipped **declaration**, which is what the law is actually about.

**AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S RULE FAILS THE DAY THE
ANSWER LEGITIMATELY CHANGES.** `direct_gate` read `seen.modes === 2`, so adding a
third mode turned it red for doing exactly what that gate exists to encourage. The
rule was never "there are two modes", it is "both things he said he cannot direct
are here", it now names them and tolerates company. **Fourth time this lane has
met this shape.** Fix the ruler, never the target.

## WHAT COMES AFTER

1. **HE TURNS IT.** Nothing else in this system is blocked on code. The moment he
   sets one row, three turns of witnessing, gossip and decay become a reputation
   that judges him. **His, and nothing should invent it.**
2. **THE OTHER DIALS.** The same test applies to every number this lane is
   sitting on: `SEE_RANGE`, the gossip window, the decay halflife. Each is a
   defensible constant with a written argument, but "where does he change this
   himself" has the same answer for all of them, and it is the wrong one.
   **This lane's, next.**
3. **The three retyped clout slices**, one line each in whichever tool generates
   them, now that `bohemia_clout.js` exists to point at. Not this lane's surfaces.
4. **Walking is silent**, one sfx message, zero footstep code, 97 approved sounds
   unplayed. SOUNDS.
