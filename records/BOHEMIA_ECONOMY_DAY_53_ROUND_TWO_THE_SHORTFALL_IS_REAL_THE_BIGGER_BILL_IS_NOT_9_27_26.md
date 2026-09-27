# ECONOMY -- ROUND 53 ROUND TWO, Q53 [two clocks], ROUND TWO OF TWO. Q53 COMPLETE.
# 9/27/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Round one: records/BOHEMIA_ECONOMY_DAY_53_COMBAT_ALREADY_DOES_NOT_TOUCH_THE_CLOCK_9_27_26.md

WHAT ROUND TWO OWED: round one found the real record disagreeing with both our
game and Battle Brothers on whether a travel day should cost more than a
standing one, and named it as a content number, not ruled here. Round two's job
is to give that disagreement a SHAPE -- the way round 52's round two gave a
future rung-weight a shape without picking one -- rather than to invent a
number for something MECHANISM-MINE / CONTENTS-PAOLO'S already reserves.

THE HEADLINE: THE REAL RECORD IS MESSIER THAN "TRAVEL COSTS MORE," AND THE
MESSY VERSION IS THE MORE USEFUL ONE. A marching soldier NEEDED more calories
than a standing one, but what he was actually ISSUED on the march was often
LESS than the garrison ration, not more -- because a garrison could cook full
meals and a marching column could not carry or prepare as much. The real
solution to that gap was never a bigger bill. It was finding food along the
way. And that shape -- the bill stays the same, the shortfall is closed by
what you scavenge, not by what you're issued -- is a shape this game already
has, unbuilt as a connection but not unbuilt as a mechanism.

===========================================================================
1. THE REAL RECORD, MEASURED ACROSS SOURCES THAT DISAGREE ON DIRECTION
===========================================================================
Round one found "up to 5,000 calories a day" for an actively marching soldier
against "three pounds of food" for a standing one -- different units, no clean
ratio, honestly flagged as such. This round found the sharper, same-unit
comparison, and it points a way round one did not expect:

    field/marching ration issued      1,200 to 2,500 kcal/day
    garrison ration issued            roughly 4,500 kcal/day
    British ration, garrison duty     2,400 to 3,100 kcal/day, "sufficient for
                                       garrison duty, but during field
                                       conditions it had to be supplemented"
    Roman marching soldier, actual    3,000 to 3,500 kcal/day
    modern reference, 8hr march       almost 3,500 kcal/day, moderate load

READ TOGETHER: the NEED goes up on the march (a marching body burns more than
a standing one, which round one's 5,000-calorie figure for the hardest case
still holds) but the ISSUE often goes DOWN, because a marching column cannot
carry or cook what a garrison can. Two different sources call the field ration
"insufficient" and say it "had to be supplemented" -- not by a bigger issued
ration, but by finding food along the route.

THIS IS A CLEANER, MORE HONEST VERSION OF ROUND ONE'S FINDING. It is not "a
travel day costs 1.5x a standing day." It is "a travel day creates a shortfall
between what marching burns and what marching can carry, and history's answer
to that shortfall was never a bigger issued ration -- it was foraging."

===========================================================================
2. THE SHAPE THAT FOLLOWS, TIED TO A LAW ALREADY OURS
===========================================================================
EVERYTHING COSTS ONE (8/15) forbids exactly the naive fix: a travel day cannot
cost 1.5 batteries, because the currency is whole and the verb debits exactly 1,
frozen, and a caller cannot pass a different amount in. So "travel should cost
more" cannot become a number inside `upkeep()` without breaking the law that
makes the whole purse legible. That is not a limitation this round is arguing
around; it is the same wall round 52 hit on the rung question, and the same
answer applies: THE SHAPE HAS TO LIVE SOMEWHERE EVERYTHING COSTS ONE DOES NOT
GOVERN, NOT INSIDE THE VERB ITSELF.

AND THE REAL RECORD JUST HANDED US WHERE THAT SOMEWHERE IS. The historical fix
for "marching costs more than what's issued" was never a bigger issue, it was
FORAGE ALONG THE WAY -- and this game already has a mechanism shaped exactly
like that, unconnected to travel:

    engine/bohemia_economy.js's mktAgents() comment, quoted verbatim:
    "EVERYONE SCAVS, and that is a stated choice not a number. The economy
     module owns exactly two job kinds ... every head takes the module's own
     conservative kind."

SO THE DEFENSIBLE SHAPE, NAMED AND NOT BUILT: a travel day's bill stays exactly
what round one measured it to be today -- one `day:ate`, flat, no distance
multiplier, obeying EVERYTHING COSTS ONE to the letter. What COULD change,
without inventing a number, is whether TRAVELLING gives a company a CHANCE at
what scavenging already gives a stationary head -- a find, along the road,
that offsets what the day cost, the way the real record's marching column
foraged to close its own gap. That is a chance, not a charge, and a chance
needs no fractional currency to exist: it is either found or it is not, which
is the same binary EVERYTHING COSTS ONE already deals in everywhere else.

THIS ALSO EXPLAINS WHY BB AND OUR OWN CODE BOTH LANDED ON "FLAT" INDEPENDENTLY
(round one, section 2): a fixed provisions number is the CORRECT abstraction
for the bill. What both of us are missing, if anything, is not a bigger bill,
it is the FORAGE HALF of the real shape -- and BB does not model that either
(its provisions consumption is flat with no distinct travel-foraging mechanic
turned up in this round's research), so this is not a case of catching up to
the named reference. It would be going further than it does, which is a real
design choice and not a gap this round is empowered to close.

===========================================================================
3. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Whether Battle Brothers has ANY travel-specific foraging or hunting mechanic
  tied to the road specifically (as opposed to camping, which round one found
  burns the same flat rate). Not found in this round's sources; not claimed
  either way beyond that.
- Any number for how often, or how much, a travel-day scavenge chance should
  hit. That is exactly the kind of content number this record is refusing to
  invent, for the same reason round 52 refused one for a rung's weight.
- Whether the existing scavenging job-kind (`mktAgents`) is reachable by, or
  meaningfully distinct from, whatever the player's own company does while
  travelling on the overworld. That is WORLD's module and WORLD's question.

===========================================================================
4. THE FINDING
===========================================================================
Q53 IS COMPLETE. Part (a): the debt of one a night sits on the single clock the
map and the street already share (round one, section 1), never on combat's beat,
and that seam was already closed the same way Battle Brothers closes it. Part
(b): a day of travel costs exactly what a day standing still costs, today,
correctly, because the real record's own honest shape is not "charge more" but
"the shortfall gets closed by what you find, not by what you're issued" -- and
the finding this round proves us wrong on is narrower and more useful than
"travel should cost more": IT IS THAT NEITHER WE NOR BATTLE BROTHERS MODEL THE
FORAGE HALF OF THAT SHORTFALL AT ALL, and the mechanism this game would reach
for to build it already exists, under a different name, standing still.

===========================================================================
5. ROUTED
===========================================================================
WORLD        the shape in section 2, if it is ever wanted: a travel day's own
             chance at what a scavenging head already gets, rather than a
             changed number on the existing verb. Not built here; EVERYTHING
             COSTS ONE stays obeyed either way this goes.
COORDINATOR  blind spot 3 is now answered in full, both parts, and the record
             the blind-spots file should point at if it gets a second pass is
             this pair, not a new one.

===========================================================================
6. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[two clocks] Battle Brothers charges a flat provisions rate whether the company
marched or camped, and never models the real gap between what marching burns
and what a marching column can carry. Our game does the same thing, for the
same honest reason -- EVERYTHING COSTS ONE cannot bill a fraction -- and the
real record's own fix for that gap, foraging, is a mechanism we already have
sitting in a different corner of the file, unconnected to the road.

===========================================================================
7. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
A real column that marched hungry solved it by finding something along the
way. Ours cannot: the road here offers nothing a stationary block does not
already offer, so walking the whole valley starving is exactly as survivable,
and exactly as empty-handed, as sitting still and starving in one room. THE
HORROR IS THE ROAD THAT GIVES NOTHING BACK: motion here has no reward the
ledger can see, so there is no reason, on paper, to ever get up.

===========================================================================
8. NOT IN A TAB YET
===========================================================================
This record is research. The day loop and the four verbs are live in the
demo's day loop, reachable by playing, but a travel-day forage chance has not
been built, ruled, or put anywhere he can see.
