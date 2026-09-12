# GO AND SEE FOR YOURSELF
## VAMILY round 29, QUESTS lane, row [check the claim] YOU-CATCH-A-LIAR-BY-WALKING-TO-THE-FENCE
### 9/12/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## THE RESEARCH THE ROW CAME FROM

Of 158 measured deception cues, **118 mean nothing**, pauses among them, and people
catch a lie **47% of the time**, which is a coin.

> **THE LIAR IS BELIEVED, AND NOTHING IN HIS MOUTH IS A TELL.**

The design rule that falls out: an ask can be a CLAIM, and a claim is checked by
GOING TO THE THING. Never a highlighted dialogue option. Never a skill roll. Never
a face.

## MEASURED BEFORE A LINE WAS WRITTEN

Nothing in `engine/` checked a claim. The seven act-one asks shipped 9/7 are each
hand-written to this rule, and that is exactly where the rule stopped.

## THE ADMISSION TICKET, STOLEN FROM ITS SIBLING ON PURPOSE

`bohemia_asks.js` refuses any candidate that cannot name a visible change, before
anybody is asked anything, because a reward bolted on at the end is not a design.
The same shape is the right one here:

> **A CLAIM THAT CANNOT BE CHECKED BY WALKING SOMEWHERE IS NOT A CLAIM.**

No place to go, or nothing at that place the world holds an answer about, and it is
refused with a reason. An unfalsifiable statement is not a claim, it is atmosphere,
and atmosphere does not get to waste a player's day.

## *** THE CHECK THIS WHOLE ROUND EXISTS FOR: A TELL THAT PREDICTS IS A BUG ***

The tempting version of this feature is the one every game ships: **the liar
fidgets.** That is the 118 meaningless cues rebuilt as a mechanic, and it would
quietly delete the row, because if manner predicts then nobody ever walks.

So manner exists (people are not blank) and it is assigned from **where the claim is
about**, never from whether it is true. The gate takes all 480 claims the module can
make, splits them by true and false, and fails if the distributions differ at all.

The control that makes liars speak quickly opens a **48-point gap** and turns it red.

## THREE MEASUREMENTS ON THE WALKED SURFACE, EACH KILLING THE VERSION BEFORE IT

I set out to prove "the check reads the claim's place, not the player's feet" by
walking to a cell whose grid answer differed.

1. **Swept 25,921 cells** across a 4,000-cell span around the waking block.
   Every one reads dark. Nothing lit to walk to.
2. **Asked the grid outside the valley.** `POWER.at` answers
   `{live:false, id:-1}` for **every coordinate in existence** — a million cells
   away, negative cells, even NaN. **The grid never says "I do not know."** A naive
   seam would settle a claim about a place that does not exist, and report it dark.
   `id:-1` is the grid's own marker for "there is no circuit here", so that is what
   no-answer means in the seam now. I found that by asking, not by assuming.
3. **Probed 120,801 cells for a real circuit id. Zero.** The grid holds no circuit
   anywhere near where the player starts.

## AND THAT MADE THE DESIGN BETTER

The live seam does fire: `ctClaimNow()` returns a real claim on the walked surface.
It rides the same snapshot row the live ASK rides, and that row is a circuit the
grid reports with `id:-1` — a circuit that does not exist.

**The claim machinery catches that by itself, and that is the point.** Somebody says
the block is dark, you walk there, and the world cannot settle it. **UNSETTLED** is
the honest answer and the module produces it without being told anything. A design
that only ever answered true or false would have quietly called a claim about
nothing TRUE.

## THE BUG I MADE, AND WHY IT MATTERED

`mannerFor` used the repo's usual 32-bit FNV with a plain `*`. In JavaScript that
product runs past 2^53 and **the low bits are lost to floating point**, so `% 8`
collapsed: `b01`, `b07`, `b12` and `b20` all landed in one bucket. Every person on
every block would have said it exactly the same way. Measured, four block ids, one
bucket. `Math.imul` is the multiply this needs, and the spread is now checked by the
gate (200 block ids, all 8 manners used) rather than eyeballed.

## AND A CHECK THAT PASSED FOR THE WRONG REASON

My first surface proof found any cell the grid answered about and claimed the
opposite. A mutation that made the seam read the **player's feet** instead of the
claim's place **sailed straight through**, because both cells were dark so both
readings gave the same verdict.

A test that passes for the wrong reason is worse than no test. On today's world that
mutation cannot be caught by walking at all — his feet answer nothing either — so
the gate holds it **structurally**, by reading the seam's code, and says out loud
that the behavioural half is blind to it until the grid has circuits.

## SEVEN NEGATIVE CONTROLS, ALL CAUGHT

| mutation | caught by |
|---|---|
| make liars speak quickly (the tell that predicts) | 2b (48-point gap), 2c |
| let the claim settle itself | 2a, 6a-6d, 7b, 7c |
| mark a lie nobody checked | 7a, 7e |
| allow a claim with nowhere to go | 1a |
| put the broken multiply back | 9a (2 of 8 manners), 9b |
| let the seam settle a place with no circuit | R5, R6, R8, R9, R10b |
| make the seam read the player's feet | S5, S6 |

And one more thing the controls earned: a mutation that emptied the sample used to
**kill the gate mid-run** instead of reporting. A gate that dies is a gate nobody
can read, so it reports now.

## HANDED ON, NOT SILENTLY FIXED

The live ask and the live claim both ride a circuit with `id:-1`. **The one thing the
valley can currently say is about a circuit that does not exist.** That is
[asks exist]'s row, not this one: fixing it here would take that row's own shipped
ship test red inside a different job. It is named in the handoff and it is this
lane's next one.

Build stamp: **BUILD 9/12v - GO AND SEE FOR YOURSELF**.

## WHAT IS STILL HIS

Every word a person says is `draft:true` and the module names nobody. What you say
to somebody you caught out is content and it is his: this produces the fact, not the
confrontation.

