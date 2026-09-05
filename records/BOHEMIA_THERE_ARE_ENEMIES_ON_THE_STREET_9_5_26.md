# THERE ARE ENEMIES ON THE STREET (RUN, 9/5/26)

VAMILY `[enemies exist]` / THERE-ARE-NO-ENEMIES-ON-THE-STREET. His bug, top of
the lane above everything.

> "Awesome I just played the run. Where the enemies at bro."

The ruling (`records/BOHEMIA_RULING_WHERE_THE_ENEMIES_AT_9_5_26.md`) had already
measured the honest sentence: **the game knows who your enemies are and has
never once put one in front of you.** Every "hostile" and "enemy" string in the
alpha, the city and the demo was prose. Hostility existed only in
`engine/bohemia_between.js` as a sign on a relationship — they charge you more,
they watch you. A ledger, not a body.

## WHAT SHIPPED

`engine/bohemia_hostiles.js` — crews of people who stand on a corner, clock you
while they are still on screen, and close on you. Inlined verbatim into the
walked city (ENGINE SYNC), drawn with the bodies that already exist, wired into
the same draw pass as the residents and the animals.

**It is shaped like `bohemia_packs.js` on purpose.** That module already solved
"a group that stands somewhere, has seen you, closes on you, and an alley is a
real out," and Paolo approved it on 8/30. Same coarse-lattice placement, same
corridor rule, same local hash, same no-dependency discipline, same probe. What
differs is what decides: a pack is decided by biology, a crew by whose corner it
is and who they are at odds with.

**No art was cooked.** A crew is people, and the people are already drawn.

**NO DAMAGE BEFORE THE DIAL**, and the gate asserts it off the module's surface
*and* its code rather than trusting the comment. COMBAT owns contact
(`[street fight]`, routed the same round). PEOPLE owns the crowd wearing the
sign. UI owns seeing a block is dangerous before you enter it.

## THE FINDING: THE OBVIOUS DESIGN SHIPS THIS INVISIBLE

The natural rule is "put crews out for whoever is hostile to me." Measured
before writing a line:

- the canon graph holds **9 edges**, of which **4 are hostile**
- they are Cartel/Caravans and Cartel/Remnants
- **not one of them touches Custom**, the player's own outfit
- `watchers('Custom')` returns **`[]`** on day one

So that design puts **nobody** on the street he just played and complained
about. Same shape as the den bug this lane fixed last week: a thing that only
happens when a search for something else accidentally lands on it is not a
feature.

Inventing "everybody hates you" is a canon decision and canon is his. So the
rule is derived from what is already ruled, and it is my call, correct-after:

> **An outfit that is already at odds with somebody puts crews out — and to an
> unaligned stranger walking through, those crews are the danger.**

You are a nobody with your own outfit, standing on other people's ground. The
outfits with enemies are the jumpy ones. It needs no new canon, it puts Cartel,
Caravans and Remnants crews out on day one, it grows by itself the moment the
ledger says somebody is hostile to *you*, and a valley where nobody is at odds
correctly has no crews in it at all.

## THREE BUGS OF MINE, ALL FOUND BY MEASURING RATHER THAN BY ASSUMING

**1. The first ownership rule put every enemy thousands of cells from the
spawn.** I borrowed the agents module's `REACH_CELLS` (12) as a hard cutoff, so
ground more than twelve overmap cells from a base belonged to nobody and could
hold no crew. Measured: the player wakes in cell (48,48); the nearest base of
*any* kind is Colorful at (34,33), **fifteen** cells; the nearest base of an
outfit actually at odds is Remnants at (74,70), **twenty-six** cells, about
3,300 walked cells. He would have finished the demo three times over without
meeting one — **I would have shipped his own bug back to him.** `REACH_CELLS`
answers a different question (how far a base's pull carries when deciding who a
resident runs with) and borrowing it was reasoning by proximity of name.

**2. A cache that could hold "the dependency was not loaded yet."** `hostDanger`
cached whatever the first call produced, and the first call happens while the
page is still parsing. The street would have been empty for the whole session
with nothing anywhere going red.

**3. `HOST_DREW` under-counts on purpose and I nearly called it a bug.** The
draw cull allows a three-tile margin so nobody pops in at the edge; the record
only takes what landed on the glass. Two bodies drawn in the margin with an
empty record is that discipline working, not failing.

## *** AND THE ONE THAT COST MOST OF THE ROUND: MY READINESS CHECK WAS A LIE ***

Four separate probes waited for `DAY.day >= 1` before reading the city. That is
true **part way through the city's script** — `BohemiaBetween` and `ctBases` are
defined near the *end* of that file. So four measurements ran against a
half-parsed city and reported **"BohemiaBetween is not defined"**, and I was one
step from writing up "the ledger of who hates you is missing from the walked
surface," which would have been a large, confident, completely false finding
about another lane's work.

It is not missing. Loaded directly, the city has it: `BohemiaBetween` an object,
`ctBases` a function, 97 globals, zero errors.

**A readiness check that is true before the file has finished is not a readiness
check.** Every probe here now waits for something defined at the end. This is
the eighth broken ruler on this lane in two weeks and the pattern is identical
every time: the instrument agreed with the fear, and checking the instrument was
the whole job.

Worth flagging beyond this lane: `DAY.day >= 1` is a common wait in this repo's
gates. Any gate using it to mean "the city is up" may be reading a half-loaded
city.

## MUTATION PROOF

- Never call `hostilePass` → **2 red**, including "walking at them puts bodies on
  the street — 0 drawn".
- Drop the at-odds half of the rule, leaving only "who is hostile to me" →
  **"somebody is still dangerous on day one (0: )" goes red.** That is the whole
  reason that half exists.
- That same mutation **also turned ENGINE SYNC red on its own**, because it
  edited `engine/` and not the inlined copy. The sync claim caught a drift it
  was not aimed at, in the same run.

## RESULT

    ENEMIES EXIST 27/0 (new) · DEMO CURRENT 16/0 · STRANGER OPENS 18/0
    WHOLE DEMO 23/0 · DEMO BUILD 25/0 · WILDLIFE 30/0

Measured on the served demo: three outfits dangerous on day one, crews within
sixty cells of where he wakes up, and **bodies drawn on the walked street** when
you walk at them.

Not this lane's, both verified pre-existing against the unpatched city: PACK GATE
1 red, DAY LOOP 57/2.

## WHAT IS STILL OPEN, AND IT IS NOT MINE

They stand, they watch, they close. **Nothing happens when you touch them** —
that is COMBAT's `[street fight]`, routed the same round, and this module
deliberately cannot start a fight. The tell that a block is dangerous before you
walk into it is UI's `[danger visible]`.
