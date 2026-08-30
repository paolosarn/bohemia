# A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME (8/30/26, CHARACTER lane)

**GRAVEYARD IS FINAL** has been law since July. `gates/bohemia_graveyard.txt` is 1,300
lines of tombstones with his own words on them. **Nothing has ever read it.**

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, proven on 7/16 when six of nine gated laws
turned out to be already broken. This one was not even in that count, because it had no
gate at all. Six weeks.

---

## WHAT IT COST, THE DAY IT WAS FOUND

Paolo, 8/28: *"Cool I like it, but it's tough to analyze without implementing all the new
hairstyles and shit."* A ruling to cook more haircuts. Seven were cooked in one turn.

**All seven were remakes of shapes he has already killed, most of them twice.**

| cooked as | is really | killed |
|---|---|---|
| RIDGE CREST, SPIKED CREST, WIDE CREST | MOHAWK, LIBERTY SPIKES, HIGH TOP | 8/1 and again 8/2, *"it's like a rectangle on someone's head"*, third strike |
| NAPE TAIL, TIED ROPES | PONYTAIL, BRAIDED TAIL (both dead) | 8/1 *"looks like dog shit"*, PONYTAIL again 8/2 |
| WORK KNOT | TOP KNOT | 8/1 *"it's the same from the front and the backside"*, again 8/2 |
| DESERT COIL | LOW BUN | 8/1, again 8/1, permanent |

Half a turn went into rebuilding the two mechanisms so those styles would read from every
angle: the crest taper, the round knot, the shoulder-borne tail, the clippered stubble on a
shaved side. **Three separate attempts at the crest in profile alone.** Every one of them
was work on a slot he had closed a month ago, and the answer was one grep away in a file
written for exactly this purpose.

**THE NAMES WERE NEW AND THE SHAPES WERE NOT.** That is the whole failure in a sentence, and
it is why the fix cannot be a naming convention or a checklist.

---

## WHY A NAME CHECK WOULD NOT HAVE CAUGHT IT

A name is the one thing a fresh cook always changes. `RIDGE CREST` shares no word with
`MOHAWK`. Any gate that matched names would have passed all seven and taught the next
session that the registry had been consulted.

**IN THIS GENERATOR A SHAPE IS A DIAL.** `genHair` builds a crest when `strip` is set and a
tied mass when `tie` is set. Those two dials exist for nothing else, nothing canon uses
them, and every shape they have ever produced is a standing tombstone. That makes them
**dead mechanisms**, and cooking with one is a remake whatever it gets called.

So the gate reads the dials, not the labels.

---

## THE RULE

1. **A shape in the graveyard stays there.** A new name, a new colourway, a new dial
   setting on the same mechanism: all remakes. *Fresh cooks answer dead slots* means a
   silhouette he has not seen, not a retune of one he has rejected.
2. **A dead mechanism is a dial whose every named product is a standing tombstone and
   which nothing canon uses.** Today that is `strip` and `tie`. The list lives in
   `gates/hair_graveyard_gate.js` and each entry cites the registry lines it rests on, so
   the citations cannot rot silently.
3. **Reopening is his.** `laws/BOHEMIA_ADDENDUM_A_KILL_CAN_BE_REOPENED_8_1_26.md` allows a
   kill whose stated reason was a DEFECT to return as a candidate once the defect is fixed,
   and makes a second kill permanent. Every shape above has taken its second. Raising the
   gate needs a dated ruling from Paolo newer than 8/2/26, written into `REBASELINE`, the
   same way the trenchcoat cap records his.
4. **BEFORE COOKING ANY ART, READ THE GRAVEYARD FOR THAT LANE.** Not the summary bullets,
   not this file: the registry.

---

## THE SENTENCE THAT INVITED IT BACK

`laws/BOHEMIA_LAW_A_HAIRCUT_READS_FROM_EVERY_ANGLE_8_28_26.md` ends:

> The crest and the tie are unfinished mechanisms and are NAMED ROWS, not silent omissions.

That was written two days ago, by me, about the same two dials. It is **wrong**, and it is
wrong in the most expensive possible direction: it says the crest and the tie are *work not
yet done*, when they are *work he has already refused*. A row on the backlog is an
invitation. The next session read the invitation and spent half a turn accepting it.

It is corrected in that file today. **When you write down that something is unfinished, check
first whether it is dead** -- the two look identical from inside the code and are opposites
in the record.

---

## AND THE GATE'S OWN RULER BROKE FIRST, WHICH IS NOW ROUTINE

The first version tested that each cited tombstone carried permanent wording -- *"permanent"*,
*"second kill"*, *"closed"* -- and went red on `BRAIDED TAIL`, which is as dead as anything in
the file. Its verdict was *"looks like dog shit"*: a first kill naming NO defect, so the
reopening addendum never applied to it and nobody ever needed to write "permanent" beside it.

**The file already had a real convention and I invented a different one.** A reopened entry is
COMMENTED OUT with a `#`; a live tombstone is not. Tenth broken ruler this month and the same
shape as all of them: reading what I expected instead of what is there.

---

## WHAT SURVIVES

Nothing shipped to the wardrobe. The valley still wears the same **24** haircuts it wore
yesterday, and no approved pixel moved. What ships is the gate, this law, and the correction
to the 8/28 one.

That is the honest total for the turn, and it is worth more than seven haircuts he would have
thumbed down: **the next session that reaches for a dead shape now hits a red gate on the
first one, before the rebuild, not after it.**

Gate: `gates/hair_graveyard_gate.js`
Registry: `gates/bohemia_graveyard.txt`
Tab: CHARACTER (try them on) / VOTE (thumb them) / RUN (the crowd)
