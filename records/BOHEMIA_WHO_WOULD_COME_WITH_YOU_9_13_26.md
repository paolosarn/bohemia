# WHO WOULD COME WITH YOU
FACTIONS lane · VAMILY row `[recruit anywhere]` WHO-WILL-JOIN-YOU-DEPENDS-ON-WHERE-YOU-STAND · 9/13/26

## THE ONE LINE
Stand anywhere in the valley and the game can now tell you who on that block
would come with you, and when the answer is nobody it tells you why. Walk one
block and it changes, because the ground changed.

## NOTHING IN THIS GAME COULD BE RECRUITED. MEASURED FIRST.
    a join or recruit path, anywhere    0
    people on the block he wakes on     61
    who could be asked to come          nobody, there was no such question

The row named no blocker and did not have one. What it needed was the four
things it names, and every one of them was already built by somebody.

## HIS FOUR SENTENCES, AND THE THING IN THIS REPO THAT ANSWERS EACH
> *"who is available depends on the ground you are on and who holds it"*

`turf()` has named the holder of all 9,216 cells since `[held ground]`, and the
people standing there are the ones the city already spawned with their own homes,
jobs and days.

> *"and your standing there"*

The belonging ladder, which is a **count of the times you did what an outfit
actually wanted**. Not a number picked here.

> *"a fortress offers different people than a camp"*

`goodsFor()` — **the same function that cuts a camp's shelf**, pointed at the
trades standing on the ground instead of the goods on the shelf. Four trades
through his DEPTH thirds gives fortress 4, town 3, camp 2, and nobody typed any
of those.

> *"a faction that hates you offers nobody"*

`refuse` has meant will-not-deal-with-you since the against organ was written.
Hostile and war carry it, **cold does not, and a stranger on their block does
not.** So the line between hates-you and merely-watches-you was drawn months ago
and this asks for it instead of picking a rank.

## AND IT KEEPS NO LIST, WHICH IS THE OTHER LANE'S HARD-WON RULE
`engine/bohemia_company.js` says it plainly: do not build the roster, because a
list is a thing somebody has to maintain and the moment it exists it can disagree
with the world. So this **computes** who would come, every call, out of the
ground under your feet and the people on it. Nothing is written on anybody,
nothing is saved, and there is no rule for when to forget.

## WHAT A PLACE HAS TO SPARE IS WHAT IT HAS MOST OF
The tier cuts the list of trades, and the ORDER of that list is a measured fact
about the ground: commonest first. So a camp of scavengers offers scavengers.
Ties break on the world's own archetype list, so two calls one frame apart can
never reshuffle.

**And a crowd size is not a tier.** Measured before the rule was written: the
fortress seat has 20 people on it and a camp seat has 100. How many bodies stand
somewhere is a fact about where the map put houses, not about the faction, so
sizing the offer by headcount would have inverted his own sentence. The tier
cuts the KINDS.

## AN OUTFIT ANSWERS TO ITS OWN LADDER, NEVER THE HOLDER'S
Fifteen Church people stand on the Mob's fortress ground on the first morning.
How far in you are with the Mob is nothing to them. So the rung is asked of
**their** outfit, one call per person, and somebody who runs with nobody has no
ladder to climb — which is why on day one the people who would come with you are
the ones who belong to nobody.

**And null is not stranger.** The belonging module answers null for an outfit
that wants nothing, because calling you a stranger to something that is not a
club would be a lie. An outfit with no ladder has no door to stand outside of.

## DRIVEN ON THE WALKED SURFACE AND THE DEMO
    THE BLOCK HE WAKES ON   Mob, fortress, 61 people
      46 would come; 15 held back as strangers to the Church
      a fortress spares every trade standing on it: scavenger, worker, watch, keeper

    ALL FOURTEEN SEATS, and the tier really cuts it every time
      every fortress spares 4 trades, every town 3, every camp 2
      Colorful camp   45 of 100 come, spares scavenger and keeper
      Caravans fort   16 of 20  come, spares all four

    A FACTION THAT HATES YOU, EARNED THROUGH THE GAME'S OWN DOOR
      side with the Remnants -> CARTEL, hostile, war (their between-ledger's rule)
      the busiest Cartel block: 219 would come -> 0
      "NOBODY HERE WOULD COME WITH YOU. YOU ARE STANDING ON THEIR GROUND"
      an uninvolved faction's ground: untouched

    YOUR STANDING THERE, MOVED WITH THE BELONGING MODULE'S OWN WRITER
      do what the Church wants three times: rung stranger -> useful
      the waking block goes 46 of 61 -> 61 of 61
      and the card names them: CHURCH 15 · useful

    484 blocks walked, 484 offer somebody on day one
Identical on the demo. No page errors on either.

## THE HONEST FINDING: ON DAY ONE THE VALLEY IS OPEN
Every one of 484 blocks swept offers somebody, because three in four people
belong to nobody and you have not yet given anybody a reason. That is not a hole
to plug with a threshold nobody ruled — it is what a valley of strangers looks
like. The gates bite the moment you take a side: one decision took 219 people off
the table.

## TWO SURFACES, BECAUSE THEY ANSWER DIFFERENT QUESTIONS
**WHERE YOU STAND** (the ◆ STANDING card, reachable anywhere on foot) already
says whose ground this is, so the answer goes directly under that row and behind
no new button. It reads by trade with a count, not one line per body: forty-six
unaffiliated scavengers are one fact about a block, not forty-six decisions.
Anybody who runs with an outfit gets their own row, grouped the same way, because
that is the half he named — recruiting **from different factions**.

**THE TOWN'S MARKET CARD** at a seat, under the shelf that is cut by the same
rule, so the fortress-and-camp difference reads in one glance.

## WHAT IS DELIBERATELY NOT BUILT
**The act of taking somebody on.** Nothing here adds a person to anything. What a
hand costs is a price and prices are his, and there is no ledger for "I hired
somebody" — inventing one would be building the roster the company module just
finished refusing to build. This answers WHO WOULD, on this ground, today. The
taking is `[who follows]`, the next row in this lane.

## GATES
`faction_towns_gate` **144/0**, up from 111 — extended, not duplicated.
Thirty-three new claims: the tier cuts the trades and goodsFor is what does it,
commonest first, a camp turns people away for it and a fortress does not, a
faction that hates you offers nobody and says so about every person on the block,
the line is their own `refuse` sign and not a rank I picked, a person whose own
outfit refuses you is out on calm ground, a stranger cannot take an outfit's
people, one rung opens it and the rung is named never numbered, an outfit answers
to its own ladder, null is not stranger, nothing is stored, nobody is spawned,
somebody already yours is not offered twice, the only cap is the caller's and is
named a rendering bound, the words are attempts, the city asks one organ rather
than assembling the facts twice, the rung is handed over as a function, it is on
the card he already opens under the ground row, and it is on the market card.

**Eight of those drive the real surface**, including the 219-to-0 swing and the
rung climb, and both halves were negative-controlled: removing the hates-you gate
in the module turned L5 and L6 red, and stopping the live surface from asking the
holder turned L28 red on its own.

Green alongside: engine sync zero drift, bundle, banner, demo build, alpha loads.

## [PENDING Paolo] — NOTHING NEW
The row needed no ruling. The tier table is his, the ladder is his, the sign is
the game's own, and the only number in the surface is how many rows fit a phone.
