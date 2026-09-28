# ECONOMY -- ROUND 54 ROUND TWO, Q52 [inherited trust], ROUND TWO OF TWO. Q52 COMPLETE.
# 9/28/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Round one: records/BOHEMIA_ECONOMY_DAY_54_THREE_DESCENDANTS_SHARE_ONE_RUNG_9_28_26.md

WHAT ROUND TWO OWED: "the one integer shape it could take." Round one found two things
inherited trust could plausibly attach to and is attached to neither: bohemia_standing's
gate-tested three-generation decay (built for witnessed deeds, unused) and the belonging
rung (which actually gates lending, and today is perfectly shared rather than inherited).
This round names the shape using ONLY what already exists in the belonging module, because
that is the one that actually matters to lending and the first battery.

THE HEADLINE: THE LADDER ALREADY HAS THE INTEGER. bohemia_belonging.js's RUNGS is five
discrete stops -- stranger(0), peripheral(1), useful(3), counted(6), inside(10) -- an index
0 through 4. The shape this round names needs no new currency and no fraction: A FRESH
DESCENDANT'S FIRST RUNG WITH A FACTION IS THE PARENT'S RUNG INDEX, MINUS ONE, CLAMPED AT
ZERO. One integer, subtracted once, read off a table that already ships.

===========================================================================
1. WHY THIS INTEGER AND NOT ANOTHER, WORKED THROUGH ON THE REAL LADDER
===========================================================================
    RUNGS, indexed:  0 stranger | 1 peripheral | 2 useful | 3 counted | 4 inside
                      (idx 2 is "useful" at count 3; the table's own "at" values are
                       0, 1, 3, 6, 10 -- five stops, not evenly spaced, and that spacing
                       is his and untouched here)

The rule: on the FIRST time a descendant is tapped who has never interacted with a given
faction, seed `save.meta.gave[fid]` for THAT descendant not at 0 (a stranger, Q49's hardest
case) and not at the parent's own raw count (today's accidental behaviour, section 1c of
round one), but at the `at` VALUE of the rung ONE STEP BELOW wherever the parent's rung
currently sits.

    parent at INSIDE (idx 4, at 10)   -> heir seeded at COUNTED's threshold, at=6
    parent at COUNTED (idx 3, at 6)   -> heir seeded at USEFUL's threshold, at=3
    parent at USEFUL (idx 2, at 3)    -> heir seeded at PERIPHERAL's threshold, at=1
    parent at PERIPHERAL (idx 1, at 1)-> heir seeded at STRANGER's threshold, at=0
    parent at STRANGER (idx 0)        -> heir seeded at STRANGER, at=0 (floor; a family with
                                          no standing anywhere transmits none, which is the
                                          honest answer and not a special case to write)

READ AGAINST PART OF Q49's OWN FINDING: Q49 measured that six givings are needed before a
stranger can ask anybody for anything, and that the very first battery is the hardest thing
in the game to get. Under this shape, a THIRD descendant whose grandparent reached INSIDE
with a faction (10 givings, the top rung) starts their own life with that faction already at
COUNTED's threshold (6) -- past Q49's own six-giving wall on arrival, without ever having
met anyone, which is exactly the real record's finding that inherited trust has a measurable
economic effect before a single interaction happens. And a descendant whose family never rose
past PERIPHERAL inherits nothing at all, which is equally the real record's finding: trust
that was never really earned does not transmit either.

===========================================================================
2. WHAT THE SHAPE ACTUALLY REQUIRES, NAMED WITHOUT BUILDING IT
===========================================================================
This is not a number waiting to be typed into a constant; it is a missing DIMENSION, and
that is worth being precise about rather than pretending it is a one-line fix:

  (a) `save.meta.gave` IS TODAY A FLAT MAP, faction -> count, with no second key for WHICH of
      the three named descendants earned it. The shape above needs `gave` to become faction ->
      descendant -> count (or the reverse), which is a real change to the save's shape, not a
      rate. Round one measured this gap; it is named again here as what the integer rule
      actually depends on existing first.
  (b) "THE PARENT'S RUNG" NEEDS AN ORDER. Rule 31 opens all three acts at once rather than one
      dying before the next begins, so "parent" here should mean the EARLIER-NUMBERED
      descendant (1 before 2, 2 before 3), which the act system already tracks (`ACTS`,
      `yearsBetween`) without any new field.
  (c) RULE 31 SECTION 2(a) ALREADY SAYS THE RIGHT THING ABOUT WHEN THIS RUNS: "the future is
      derived, never authored ... every time he flips forward," and "a flip back to act 1 and
      a change there re-derives act 2 and 3's base." So this rung-minus-one rule is not a
      one-time seed at all, it is a DERIVED VALUE, recomputed on every flip forward exactly the
      way the rest of the derive is specified to work -- read the earlier act's CURRENT rung,
      subtract one rung, that is act 2's floor with that faction TODAY, and it moves if act 1's
      own rung moves. This is why groundDiffers()'s stub matters (round one, section 1d): this
      rule is a natural first tenant of that function once it is built, not a parallel system.

===========================================================================
3. WHY A DISCRETE RUNG STEP AND NOT A DECAYING FRACTION, STATED HONESTLY
===========================================================================
The real record's own numbers (Clark's status persistence, cited round 50, contested at 0.70
to 0.75 a generation; Algan and Cahuc's causal but non-invariant inherited trust) are
CONTINUOUS decay rates on a smooth scale. "One rung back" is a coarse, five-step analogy to
that, not a translation of either coefficient, and this record is not claiming it is one --
EVERYTHING COSTS ONE and the belonging ladder's own five whole stops make a smooth percentage
the wrong shape for this game regardless of what the real coefficient says, the same
reasoning round 52 used to reject a fractional rung-weight and round 53 used to reject a
fractional travel-day bill. A DISCRETE, INTEGER STEP ON AN EXISTING LADDER IS THE SHAPE THAT
FITS THE GAME'S OWN ARITHMETIC, even though it is a rougher fit to the research than a
percentage would be. That trade is named, not hidden.

===========================================================================
4. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Whether "one rung back" is the right AMOUNT to step down, as opposed to two, or a step that
  varies by faction. That is a magnitude and EVERYTHING COSTS ONE's own law (section 5) says
  magnitudes are his; this record names the mechanism, not the constant.
- Whether bohemia_standing.inherit()'s witnessed-deed decay (round one, section 1b) should
  ALSO feed this, giving a descendant's rung a second input beyond the belonging count. Left
  alone deliberately: two systems getting connected to a THIRD thing in one uninvited round
  is exactly the kind of unrequested scope this lane's charter forbids.
- Any UI or card language for how a descendant would be TOLD they start ahead or behind with a
  faction. Rule 19(a)/29 territory, not this lane's to draft here.

===========================================================================
4b. LANDED MID-ROUND, DIRECTLY RELEVANT, NOTED RATHER THAN CHASED
===========================================================================
Rule 37c (THE THIRD VOTES, 9/28, laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md) amended
32(b) while this round was in progress: "the derive is SIGNED... built rises, raided falls."
That ruling is about territory/builds/invest, not standings, and this record does not lean on
it for anything. It is worth one sentence because it removes a possible objection to section 1's
own shape before anybody raises it: a rung genuinely going DOWN a step across a generation is
no longer in tension with any "nothing below the floor" reading of the derive -- 37c already
settled that the derive can move a field down as well as up. Section 1's shape needed no
correction; it is simply no longer swimming against a law that might have forbidden it.
Rule 37d, same batch: "it will always be three generations... the acts are the generations."
That is exactly the premise round one's whole finding rests on (three real, distinct
descendants, not one person flipping costumes), now ruled rather than inferred from rule 31's
own wording. Nothing in round one needs revision; it was reading rule 31 correctly already.

===========================================================================
5. THE FINDING
===========================================================================
Q52 IS COMPLETE. The row asked what inherited trust does to prices (nothing can, no per-person
price exists to move, round one section 2), lending and the first battery (today: total,
unearned sharing across all three descendants, not inheritance at all, round one section 1c),
and the one integer shape it could take. That shape is HIS RUNG, MINUS ONE, CLAMPED AT ZERO --
a single subtraction on a five-step ladder that already ships, requiring one new dimension on
an existing save field and no new currency, and it is a natural first use of the derive
function (groundDiffers) that rule 31 already specified and has not yet built.

===========================================================================
6. ROUTED
===========================================================================
DYNASTY / WORLD   [the derive]: this shape (section 1 and 2) is a candidate first rule for
                  groundDiffers() once it exists, using only the belonging ladder's own
                  integers. Not built here.
COORDINATOR       the canon question from round one (are the three descendants strangers to
                  each other's earned trust, or one household sharing it) is still not
                  answered by this round; this round's shape assumes the real answer is
                  neither extreme, which is itself the position, not a ruling.

===========================================================================
7. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[inherited trust] Battle Brothers has no rung to inherit at all -- a company either has a
reputation with a settlement or it does not, read off the SAME company's own history, never a
different person's. The shape this round names has nothing to borrow from BB because BB never
had three different people to connect in the first place.

===========================================================================
8. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
A rung that goes down by exactly one step, forever, no matter how good the grandparent was,
means somewhere down the family line a descendant is always starting slightly behind the one
before them for reasons that were never their fault and can never be undone by anything they
personally do differently. THE HORROR IS THE INHERITED DEFICIT NOBODY CAN OUTRUN: it is not a
punishment for anything the third descendant did, it is just what standing still one generation
too many times looks like on a ladder that only ever counts down.

===========================================================================
9. NOT IN A TAB YET
===========================================================================
This record is research. THE THREE NAMES, the flip, and the belonging rung are all live in
the demo; the rung-minus-one shape has not been built, ruled, or put anywhere he can see.
