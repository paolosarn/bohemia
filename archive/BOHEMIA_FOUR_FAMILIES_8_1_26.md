# FOUR FAMILIES (Paolo 8/1/26, LOCKED)

> "in my starting neighborhood I want there to be four families"

Exactly four. Not about four.

## WHY IT WAS NOT ALREADY POSSIBLE

The starting block had a FLOOR of six households, expressed as an occupancy RATE
(6 / homes-on-the-block). A rate is a per-house coin flip: it lands NEAR a number
and never ON it. On the shipping seed that floor produced FIVE families, and it
would produce five, six or seven on another seed.

**When he names a count, the count is the law.** So the agents module gained an
explicit `households: N` option: pick exactly N houses, deterministically, and
leave every other door shut.

## THE THREE DECISIONS INSIDE IT

**1. WHICH four houses.** Spread across the block, not clumped at one end. Four
families in a row is a terrace; four families spread down the street is a
neighbourhood. Deterministic from the block seed, so they are the same four
houses forever.

**2. A FAMILY IS MORE THAN ONE PERSON.** The household roll returns 1 about thirty
percent of the time, and the first build came out as two couples and two people
living alone. That is not four families in any normal use of the word, so the
named-count path floors household size at 2. **Only that path.** Everywhere else
in the valley a household of one is still a household of one, because most
survivors are alone and that is the honest picture.

**3. THE POPULATION DIAL STILL WINS, EVEN OVER A NAMED COUNT.** Two of his rulings
meet here: "four families in my starting neighborhood" and "the slider can go all
the way from ZERO to a maximum". At dial 0 the valley is a ghost valley and that
has to include his own street, or the bottom of the slider is a lie. So the COUNT
is dialled exactly the way a rate is: four families at 1, two at 0.5, none at 0,
eight at 2. The gate caught this conflict — E11 went red the moment the count
bypassed the dial, which is the gate doing its job on a design question rather
than a typo.

## WHAT IS ON THE BLOCK NOW, measured on the real run

    STARTING NEIGHBOURHOOD: 4 FAMILIES, 10 people
      H1  - 2 people:  WATCH, SCAVENGER
      H5  - 3 people:  WATCH, SCAVENGER, KEEPER
      H10 - 3 people:  SCAVENGER, KEEPER, SCAVENGER
      H15 - 2 people:  WATCH, SCAVENGER
    outside right now: 3

Four households, spread from house 1 to house 15, every one of them more than one
person, and people out on the street where he can walk up to them.

## AND A FIX TO THIS LANE'S OWN TOOL, forced by this work

The guard added on 8/1 refuses to restore a fence containing lines it does not
recognise, which is what stops it deleting another lane's code. It cannot tell
OUR OWN OLD TEXT from somebody else's, so it also refused every legitimate edit to
our own blocks — including this one.

    python3 tools/bohemia_people_identity_patch.py --allow WORKERS

An intentional rewrite is now a deliberate act somebody types, while a silent
deletion stays impossible. Verified: the other lane's 29-line RUN PERSON FACTS
block is still in the file after the migration, and the tool runs clean without
the flag afterwards.

## GATE
people_gate part H, 6 claims, 121 total, driven on the real run because the
starting neighbourhood is the one place he is guaranteed to stand. H1 exactly
four, H2 every one of them more than one person, H3 spread not clumped. Mutation
proved twice: going back to a rate floor gives five and fails H1/H3; letting a
family be one person fails H2.
