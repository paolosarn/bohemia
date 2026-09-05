# HOLDING A LIT BLOCK WAS FREE, AND NOW THE NIGHT SENDS A BILL
# 9/5/26, WORLD lane. VAMILY [lights bill] — BB-THE-NIGHT-EATS-POWER.

## THE HOLE

LIGHT=TERRITORY has been live code since 7/20. The valley's streets are split into
feeder-sized circuits, 12% of them are lit, every live one carries an owner, the seams are
computed, and nobody patrols the dark.

**And holding a lit block was free.** Territory was a colour on a map. There was no way to
have more of it than you could afford, and therefore no way to lose it.

The row's ship test is one sentence: *a held circuit debits power at nightfall and an unpaid
one goes dark.* Both halves ship here.

## WHAT MAKES A CIRCUIT YOURS, AND IT IS NOT A FLAG I MINTED

The round before this one built the drain and pointed it at `owner === 'player'`. There is no
such owner — the grid's owners are settlement, faction, network and solar_lone — so it
correctly billed nothing, and I wrote down that I would not stamp one, because the row says
**"which circuits are his is still his."**

The answer was already in the game and another lane had built it: **the buildings he put down
himself.** LIFE+CITY's builder writes a delta of placed plots, and the production tick already
walks it to pay him. A plot he chose, paid a battery for, and can demolish is the one piece of
ground in this valley that is unambiguously his — and **nobody had to rule it, because he did
it with his thumb.** That is reading ownership somebody performed, not minting it.

## AND A BUILDING IS NOT ON ITS OWN CIRCUIT, IT IS ON THE STREET'S

Measured, and it is the whole shape of the thing: **the grid only lays circuits along STREET
cells.** `POWER.at()` on a building's own cell returns the dead default and always will.

A version that billed `POWER.at(building)` would have found **zero lit circuits on a valley
full of his buildings** and reported it as "he holds nothing" — the instrument answering about
itself, which is the failure this lane keeps paying for. Check 2c in the gate is the one that
catches it.

**REALISM FIRST, and it is also just how power works**: a building takes a service drop off
the feeder running down the street it fronts. So a placed plot holds the circuit of the lit
street beside it, and a corner plot fronts two and holds both, because it is lit from two
feeders.

**DEDUPED BY CIRCUIT, NEVER BY BUILDING.** Four shops on one street are one feeder and **one**
bill; four shops spread across the valley are **four**. That is what makes spreading out cost
something, and it is the entire reason the drain is per circuit rather than a flat "you have
lights" charge.

## THE DARKENING HAD TO LIVE IN THE GRID

Ten places on the walked surface ask `POWER.at(x,y).live`: the lamp pass, both "is it black in
here" checks, the fire barrel, the music's own night test. **Darkening a circuit by patching
ten readers is nine chances to miss one and a tenth to disagree.**

So `at()` answers the question and `douse()` changes the answer — the same rule the purse
lives under, where balances are derived and there is no setter. `status` is private to the
closure, so **`at()` is the only door out of the grid** and a reader cannot see round the
doused set even by accident. The gate holds that door shut.

Two things a cell needed that it did not have:

1. **AN ID.** Cells carried `{live, owner}` and no way to say *which* circuit, so "these two
   buildings are on the same feeder, that is one bill" could not be expressed and "put THIS
   one out" had no subject.
2. **A WAY BACK.** `dark` is a separate set, never a write into `live`, because a circuit that
   was never lit and a circuit somebody could not pay for are different facts. `relight()`
   exists and **nothing calls it** — what it costs to get your lights back is a price, and
   prices are his.

## THE FAILURE IS PER CIRCUIT, AND IT IS STABLE

Run out halfway down the list and **the blocks you already paid for stay lit.** Anything else
would be a wipe, and a wipe is a punishment nobody ruled.

And **a light you lost is a light you stop being billed for.** The doused circuit is no longer
lit, so it is no longer held, so it never bills you again. There is no debt spiral, because
**debt would be canon and canon is his.**

## WHAT IT LOOKS LIKE

Build a plot on a lit street, finish the day's job, sleep:

> The Meter Reader: COMPLETE (notable)
> **paid: 1 battery**
> every lit circuit you hold burned one

**The battery you earned all day goes straight back out for the light.** That is the whole
economy in two lines, and it is in the cut demo through the splash.

Fail to pay it:

> every lit circuit you hold burned one — *and you could not pay it*
> **the lights went out on arterial — nobody patrols the dark**

Named by district, because that is the word he navigates by. The circuit number is not his
business.

**AND A PLAYER WHO HAS BUILT NOTHING SEES NOTHING NEW.** A day with no buildings reads exactly
as it did before. The bill only exists once you own lights, which is the point.

## THE SAVE, AND THE TWO WAYS IT COULD HAVE GONE WRONG

The doused set rides its own localStorage key, **not the build delta** — a light that is off
is not an edit to the world, and merging the two would mean a valley reset silently paid
everybody's power bill.

And a circuit id only means something against the map that made it. **A different seed is a
different valley**, so on a seed change the set is thrown away rather than restored against
the wrong streets, which would have put lights out at random in a place the player has never
been. Same on a re-roll. Both are checked.

## AND A GATE OF MINE HAD TO MOVE, ONE ROUND AFTER I WROTE IT

`four_verbs_gate` proved `night:power` by faking `owner:'player'` for one call. That was right
when nothing in the game said a circuit was his. **It is a lie now that something does.**

**A GATE MUST NEVER OUTRANK A RULING** (Paolo 8/1). The gate moved to the real mechanism — it
puts a building down, which is what a player does — and it kept its whole tooth: zero before,
one after. Its guard against the thing that was actually forbidden (*nothing stamps a circuit
`player`*) still stands.

## THE INSTRUMENT I COULD NOT GET WORKING, WRITTEN DOWN RATHER THAN GLOSSED

I wanted a picture of the street going dark, and **I do not have one.**

The lamp queue is nulled at the top of a render and nulled again after it draws, so reading it
afterwards always says nothing. I installed a witness on it: **zero lamps, before and after.**
Then I counted warm pixels on the aerial frame: **8 before, 8 after.**

So I ran the deciding mutation and **put out every lit circuit in the valley — all 173.** The
frame did not move: **8 pixels.** That is proof my probe is the broken instrument, not the
grid, and it is the only honest reading of it. The camera or the canvas I grabbed is not the
one the aerial lamp pass draws to.

**A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE INSTRUMENT COULD
HAVE SEEN A POSITIVE ONE** — so it is reported as an unproven claim rather than dressed up.
What IS proved is structural and stronger than a pixel count: every consumer asks `at()`,
`at()` is the only door out of the grid, and it reports the doused circuit as not live. The
walked surface's own "is it black in here" test flips, and the gate asserts it.

## THE GATE — `gates/lights_bill_gate.js`, 30 checks, registered as LIGHTS BILL

The circuit id exists and ground with no feeder carries none; dousing puts the whole circuit
out and keeps its owner; a circuit that was never lit cannot be put out; `at()` is the only
door; it serialises, restores, clears, and drops a foreign id; on the surface, nothing built
means nothing held, a building makes exactly the fronting feeder his, a paid night stays lit,
an unpaid one goes dark and stays dark, he is not billed again for a light he lost, and the
card names the block.

**Proved it can go red both ways**: removing the never-lit guard drops it to 29/1; removing
the `douse()` call on the surface drops it to 24/6.

## VERIFIED

| | |
|---|---|
| walked surface | build → hold 1 → pay → stays lit; empty pocket → goes dark, persists, stops billing |
| demo, through the splash | build → hold 1 → `paid: 1 battery` → `every lit circuit you hold burned one` |
| a player who built nothing | one line, unchanged from before |
| gates | lights bill 30, four verbs 32, purse 28, payday 37, day pays 18, brownout 20, road cell 46, placeholder 14, economy 13, demo blockers 22, pages publish 18 — **278 checks, 0 failed** |

## WHAT IS STILL HIS, AND WHAT IS NOT MINE

- **The price of a night** is one, his 8/15 ruling, and `upkeep()` cannot be passed another.
- **What it costs to relight a block.** The function exists and nothing calls it.
- **Whether anything other than a placed building makes ground yours** — that is BB-TURF's
  row, [held ground], and it is next in this lane's queue.
- **The builder is not reachable inside the cut demo** (its drawer is hidden), so a demo player
  cannot yet build and therefore cannot hold a circuit there. The mechanism is in the demo and
  proved in it; the reachability is LIFE+CITY's row, not mine.
