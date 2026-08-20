# THE NUMBER MOVED AND NOBODY HAD SEEN ANYTHING (8/20/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Answer a claim, then walk up to somebody who
## was standing there. The first row of their card now says **SAW**. Come back
## later to somebody who was not there and it says **HEARD**.

---

## THE FLAW IS NAMED IN THE ENGINE'S OWN HEADER, AND THE CITY WAS COMMITTING IT

`engine/bohemia_deeds.js` opens with this, written 8/6:

> "The faction standing got applied godlike: the number moved, valley-wide,
> instantly, and NOBODY HAD SEEN ANYTHING. So today a back-yard handshake and a
> public humiliation in front of a whole block are worth the same."

That is exactly what `ctAnswerClaim` did. An outfit asks something of you. You say
yes or no, to a person's face, on a street. `BohemiaBelonging.adjust` moves a
valley-wide number, the whole outfit knows instantly, and **the man standing next
to you knows nothing.**

`engine/bohemia_standing.js` was built for precisely this input on 8/2 -- witness,
opinion, gossip, hearsay decay, generational inheritance, 35 green claims in
`standing_gate` -- and had no caller anywhere in the game.

Yesterday this lane wired the witness ORGAN so people can see you. This wires the
DEED, so what they see you *do* is a thing they hold and pass on.

## WHAT IT LOOKS LIKE, ON HIS CARD

```
WATCH
SAW                    watched you turn an outfit down
NAME                   YOU HAVE NOT ASKED
LIVES                  HERE, 6205 6269
RIGHT NOW              Standing outside
YOU HAVE MET           FIRST TIME
```

**A stranger whose name you have never asked has already watched you do
something.** That is the game in six rows, and the ordering is deliberate: what
they know about YOU leads, because it is the only part of the card that is
different because of what you have done. Everything below it is true of them on
any day.

## NEWS TRAVELS AT THE SPEED OF PEOPLE, AND THAT IS THE PART YOU CAN SEE

Measured on the real surface:

| | ledger | card row |
|---|---|---|
| stood next to you | `claim:refused hops=0` | **SAW** watched you turn an outfit down |
| sixty cells away | *nothing* | *no row at all* |
| stood with the witness 45 minutes | `claim:refused hops=1` | **HEARD** heard you turned an outfit down |

In most games every NPC knows everything the instant it happens, with no route
the news could possibly have taken. Here there is a route, and the card shows
which end of it you are looking at.

**The window is the module's own constant (45 minutes), and it is counted in GAME
MINUTES, not frames.** Counting frames would mean two neighbours could only talk
while the player stood watching them, which is both wrong about the world and
unreachable in practice: the player walks twelve cells a game-minute, so
forty-five minutes of watching is five hundred cells of staring at the same two
people. Elapsed clock time between passes is credited instead, so walking away
for three hours does not stop anybody talking.

**Together means conversational distance, not sightline.** `SEE_RANGE` is nine
tiles because that is how far you can SEE something happen. You cannot swap news
with somebody nine tiles away. Two cells is arm's length plus one.

**A pair that separates loses its accumulated time** rather than banking it,
which is what stops two people who merely pass each other daily from eventually
counting as having had a long conversation.

## WHAT A DEED IS WORTH IS STILL HIS, AND THAT IS WHY IT SHIPS EMPTY

`bohemia_standing.js` says it plainly: *"NOTHING IS IN HERE and nothing in this
file invents a row."* `DEED_WEIGHT` is blank, so `opinionOf()` returns 0 and
`standingOf()` returns NEUTRAL for everybody. **Nothing here fills it.** The gate
asserts it is still empty and still zero, so if it ever stops being zero without a
ruling, some lane invented a number he did not give.

The mechanism records WHAT HAPPENED and WHO KNOWS. The judgement waits. The moment
he sets one row, `opinionOf` and `standingOf` light up on this same data with no
further wiring.

That is also why the card reads the deed LEDGER directly instead of going through
`becauseOf()`: **`becauseOf` is a judgement query**, it computes force and drops
anything weightless, so it returns nothing at all while the table is empty. But
"he watched you refuse" is a FACT, not a judgement, and it is true today.

## THE BOUNDARY, AND IT IS ASSERTED RATHER THAN PROMISED

Claims, belonging and commitment are the FACTIONS lane's. This does not change
what a claim costs, who may ask, or how belonging moves. Every number they compute
is left exactly as it was, and the gate asserts their `adjust()` line is still
intact and unchanged. This patch adds one sentence to the world: **and these
specific people saw you do it.**

## THE KIND DOES NOT CARRY THE OUTFIT, ON PURPOSE

`claim:met` and `claim:refused`, not `claim:refused:REDS`. Paolo weighs an ACT
once; a kind per faction would make his `DEED_WEIGHT` table grow with the roster.
And a bystander who is not in that outfit only knows that you turned somebody
down anyway, which is what the words say.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_deeds_patch.py` | new; inlines the ledger, wires the deed, the gossip pass and the card row |
| `slices/BOHEMIA_CITY_WORLD.html` | +483 lines |
| `gates/city_deeds_gate.js` | new; 20 claims, on the real alpha through the RUN tab |
| `gates/bohemia_gates.py` | registered as CITY DEEDS (303 of 402) |

Idempotent on the first try, proved by md5 over three runs -- the memory tool
shipped with exactly the delete-half-missing bug yesterday, so this one was
written with the region marker from the start.

Mutation-proved three ways, each with the mutation's arrival verified in the file
under test **before** the gate ran:

| mutation | result |
|---|---|
| gossip with no window (news teleports) | **2 red** |
| witness everybody regardless of distance | **4 red**, including SAW and HEARD collapsing to the same sentence |
| fire the deed even when the claim did not resolve | **1 red** |

## WHAT COMES AFTER

1. **THE THIRD ACT WORTH JUDGING.** Claims and commitments are wired. The other
   real choice on that card is the FAVOUR -- asking somebody for something -- and
   it is one line once somebody decides whether asking is a deed at all. **This
   lane's.**
2. **THE DIAL.** The instant Paolo rules a single `DEED_WEIGHT` row, opinion,
   standing rungs and the faction's view of you all light up with no wiring
   changed. Until then they correctly read NEUTRAL. **His, and nothing should
   invent it.**
3. **Walking is silent** -- one sfx message, zero footstep code, 97 approved
   sounds unplayed. SOUNDS.
4. **The ridge exterior** -- the one genuinely missing picture. ART's.
