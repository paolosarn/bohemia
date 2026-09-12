# V210 — YOU CAN GO BACK FOR HER (COMBAT lane, `[rescue her]` BB-PICKUP)

**Closes the Battle Brothers study row the study itself called "the smallest row and
the highest feeling per line, and the machinery is already written on the other side
of the board."** It was right on both counts.

---

## THE HOLE, MEASURED IN THE DECODED BLOB

`ALLY_DOWN_TURNS=99` was **declared and never read** — one hit in the whole file,
its own declaration — and the comment beside it said *"he stays down; picking him up
is not built yet and is not pretended."* An honest comment on a dead constant.

She already **falls** properly. At `hp<=0` she goes `downed` and never `dead`, the
fight records when she fell, she draws in red, and the readout said *"every gun she
was holding is back on you."* Then nothing, forever.

**And their side has the whole thing.** `medicTurn()` walks a medic to a downed man
inside `MEDIC_REACH` and stands him up, and the scoring above it makes a body on the
floor **drag him out of cover** — its own comment is *"A BODY ON THE FLOOR OUTRANKS
HIS OWN SKIN, AND THAT IS THE WHOLE FIGHT WITH HIM."*

> **This is the fifth time this lane has found the same shape: the behaviour exists,
> and it is pointed away from the player.** The study's own headline, across four
> days, was that four separate systems failed this way. The cost of the study is
> wiring, not invention.

## WHY IT MATTERS MORE THAN IT LOOKS

From the study's day 4: **permadeath does not create attachment, it cashes in a bond
that already exists** — and permadeath is ruled out here. The channels left are
interdependence (already true and measured: eight foes alone clears 0 of 60 rooms,
with her 60%), responsiveness, marks that persist, and **BEING MISSED**.

This is being missed, and it is the cheapest of the four.

## WHAT WAS BUILT: THEIR RULE, MIRRORED, AND NOTHING NEW INVENTED

| | |
|---|---|
| **HOW** | You **walk to her**. That is the whole input. It reuses `PICKUP_R`, the same distance the loot already calls "you got your hands on it", and it hangs off the **same call site**, the one whose comment reads *"the world moving under him IS him walking."* One idea of having reached something, not two. |
| **WHAT** | She comes up **at the health the game left her**, which is the medic's own bargain word for word: *"revived at the hp the game left him, which is 1, so the medic sets no health number at all and a man he stands up dies to anything."* No health is granted here either. |
| **COST** | She comes up **winded** (`stun 1`), the medic's own line, because a man does not get off the floor shooting. And the real cost is not a number: it is the ground you cross under fire to reach her, which is the same thing V181 made you pay for loot. |

And the readout when she falls had to change, because **a thing he cannot know about
does not exist**. It now says *"her guns are back on you — go to her and she gets
up."* `[draft:true]`, WORDS owns the wording.

The dead constant's comment was corrected too. Saying pick-up "is not built and is
not pretended" was honest when it was written and is a lie now.

## THE ROW'S THREE MUST-NOTS, EACH HELD ON THE GLASS

`gates/pickup_gate.js` — **9 passed, 0 failed.**

1. **Not a heal button.** She comes up at **1 hp from 0**, which is the floor a
   downed body is already left on and not a number this row chose. And there is no
   button anywhere: walking is the input.
2. **Not invulnerable.** Standing at 1 hp, the shipped fire puts her back on the
   floor in **1 volley** — still `downed`, not `dead`. Nothing about what lands on
   her was touched. Going back for her is a decision with a price, not a rescue that
   ends the problem.
3. **No control surface**, the 8/31 no-order-menu law. Of the **101 pressable things
   in the fight, zero** order her about: no pick-up, no revive, no rescue, no carry,
   nothing with her name on it.

Plus: she goes down **through the shipped fire** and not by setting a flag, because a
flag proves the pickup works on a state the game may never reach. And **nothing
stands her up alone** — 30 turns of her own ladder, their medic's turn and the
pickup itself, with you nine tiles away, and she is still down. No timer, no
self-revive. That absence is what makes it *being missed* rather than a wait.

## TWO INSTRUMENT BUGS IN MY OWN GATE, BOTH WORTH WRITING DOWN

**THE STAGING WAS BACKWARDS AND THE GATE COULD NOT FAIL HONESTLY.** The first cut set
`acq = 0` when `acquired()` wants `acq >= ACQ_TURNS`, and it left the men out of
range. **400 volleys landed nothing.** Fixed by putting them a tile off her shoulder
with real acquisition: she falls in two volleys.

**AND MUTATION A ESCAPED.** I deleted `allyPickup()` from the footfall and **the gate
stayed green**, because the arm called the function directly.

> **An arm that calls the function proves the function works. It does not prove the
> game reaches it.** That is the structurally-unreachable defect this lane has now
> found four times, and my own checker had it.

Rewritten to drive the real `worldShift(1,0)` walk with nothing calling the pickup by
hand. The same mutation now produces **3 reds**. Two more mutations were run: the
heal button (1 red) and no wind (1 red).

A third, smaller one: the control-surface arm regexed `innerHTML` and flagged the
test bench's pre-existing `TAKE HIT` / `HEAL` pair. It reads real controls now, and
names and excludes that pair on purpose. **A mention is not a use.**

## THE DIAL

No damage value, no hit chance and no roll is authored anywhere in V210.

---

**Tool:** `tools/bohemia_pickup_patch.py` (MARK `__PICKUP__`, replayable onto fresh
main) · **Gate:** `gates/pickup_gate.js`, registered in the suite as **PICKUP** ·
**Tab:** COMBAT.
