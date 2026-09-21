# I MEASURED A CITY WITH NO PEOPLE IN IT (9/21/26, WORLD lane)

Board row **[block strikes] / WE-BUILT-THE-CUT-OFF-AND-NEVER-BUILT-THE-STRIKE**,
plus rule 22 (COOK EVERY ROUND). **Nothing shipped to a play surface** — rule 18
holds; the cook went to the VOTE tab.

---

## 1. THE ROW WAS HELD SIX ROUNDS ON A MEASUREMENT TAKEN ON THE WRONG PAGE

On 9/15 this lane wrote, on the board and in the handoff:

> "CT_MINDS IS EMPTY AND STAYS EMPTY. At the door 0 minds; after twelve hours of
> advanced game time, still 0. ZERO of the block's 20 residents has a mind, so
> whoVouches over the block returns nothing, **always**, and the picket cannot be
> counted. **THE FIX IS GIVING A BLOCK'S RESIDENTS MINDS, WHICH IS 09 PEOPLE'S
> LANE**, and building it here would cross one-system-one-session."

That was true of the page I opened and false of the game.

**`PLAYER_CV` is set by exactly one thing: a `postMessage` of type
`BOHEMIA_CITY_PLAYER` from the parent frame.** The alpha sends it; the walked
city opened on its own is never sent anything. And `peoplePass()` returns `0` on
its **first line** when there is no body:

```js
function peoplePass(ox, oy, C) {
  BARK_DREW = [];
  if (!PLAYER_CV) return 0;   /* no body yet: draw nobody, never a placeholder */
```

No body posted, no bodies drawn, no minds born, nobody to picket. **I opened a
city with no people in it and concluded the game had no people.** Then I handed
the row to another lane and it sat for six rounds.

## 2. RE-MEASURED ON THE DEMO HE ACTUALLY PLAYS

Through the one driver (rule 14g), with the player's position checked first so a
sample from somebody who never moved cannot be read as a walk:

```
at the door ................ 2 minds,  6 bodies drawn, PLAYER_CV present
walking, about 4 seconds ... 25 minds, 9 people known by name
on the player's own block ... 6 minds
his quest corpus ............ 83 deed weights filled at load
a deed in front of them ..... witnessed, and it lands in the mind
```

**The picket can be counted. It was countable the whole time.**

And a second instrument fault caught on the way, the same family as
PLUMBER's player-pressed-against-a-wall: my first walk **tapped the middle of the
pad**, which is not a direction. `hx`/`hy` never changed and the mind count never
moved, and I was about to read a still player's numbers as a walk. Pressing **off
centre** on the ring is a walk: 2 → 4 → 19 → 22 → 25.

## 3. WHAT GLASGOW 1915 ACTUALLY WAS

25,000 families stopped paying and won in nine months, and the mechanism was
never the money. **It was the vacancy.** Bailiffs driven from doors, empty flats
picketed so nobody could take them. A landlord's cut only works if he can replace
you. **If the block holds the door, he cannot.**

So `engine/bohemia_strike.js` answers exactly one question — **can the cut be
made to stick** — and the answer is about people, not batteries.

## 4. *** SILENCE IS NOT A NO, AND THAT GAP IS WHERE THE ROW DIED ***

Early in the game almost nobody has seen you do anything. A block where no
resident holds an opinion **does not know you**; it has not decided against you.
Collapse those two facts and the thing reports "the strike failed" on day one,
every time, forever.

So `held()` has **three** answers:

```
HELD       more of the block stands with you than against
BROKEN     more of it will not
NOT_KNOWN  nobody here has seen you do anything yet
```

Nothing in the module ever turns silence into a verdict. And **NOT_KNOWN does not
stop the cut** — a strike you win by not playing is not a strike, so an unknown
block falls through to the cut sticking. The machinery works; the people have to
show up.

That is the same rule this lane put on the notice module two rounds ago (refuse
rather than print a plausible number). It took six rounds to learn it here.

## 5. NOT ONE WEIGHT IN THE FILE

**A majority is the shape of a picket, not a number anybody tuned.** More of the
block with you than against is what "the block held" means in plain English, so
nothing ships a dial. The opinions come from `bohemia_standing` off his own
CLOUT_WEIGHTS, and this file never touches them. The gate checks the code for any
number bigger than one and for any faction or deed name, and finds none.

The price of getting the light back is **his ruled ONE**, read off PAYOUT.
Move the ONE and the price follows; take the table away and it **refuses** rather
than relighting for free.

## 6. PROVED ON THE DEMO, END TO END

```
before anyone has seen anything ...... NOT_KNOWN, and the cut sticks
4 of the block witness a good deed ... HELD, vouch 4, wont 0
                                       *** THE CUT STOPS STICKING ***
2 more witness a bad deed ............ vouch 4, wont 2, still HELD
```

## 7. *** A HOLE IN MY OWN GATE, FOUND BY MUTATION ***

I mutated the module to let **any** block hold the door — replacing
`(vouch > wont)` with something always true — and the gate stayed at **33 passed,
0 failed.** The majority rule, which is the entire mechanic, was never tested,
because the gate only ever built blocks where nobody disagreed.

**A gate that never builds the case it is guarding is a decoration.** Both
lopsided blocks are now constructed through the real standing module, and a tie
is checked too. The same mutation now goes red.

The other mutation — making silence a verdict, which is the six-round bug itself
— goes red three ways.

## 8. THE COOK: THE NOTICE TO QUIT

Rule 22. The paper the man at the door was holding, and the oldest document in
this family: a landlord's demand for possession, in a form fixed by law, served
on a person standing in a doorway.

```
MOB
NOTICE TO QUIT

PREMISES: FREEWAY 75-5
SERVED: DAY 2 AT 07:40

YOU ARE REQUIRED TO GIVE UP POSSESSION OF THESE PREMISES ON DAY 5 AT 07:40.

GROUND: ARREARS OF 1 BATTERY.

IF POSSESSION IS NOT GIVEN UP THE OWNER MAY APPLY TO A COURT.
```

Every other notice this lane has built points at an office nobody is in. **This
one points at a court, and the whole premise of the economy underneath it is that
there is no court** — "we built the courthouse and never issued a loan" is the
board row next door. The form threatens you with a building that is not there. It
never says so. **The block standing in the doorway is the only thing the threat
actually meets.**

It refuses to issue with no landlord on it: a notice with no landlord is not a
notice, it is a threatening letter, and this module does not make those.

## 9. THE GATES

```
BLOCK STRIKES   36 / 0   new, driven on the demo, red two ways
FIRST NOTICE    48 / 0   the notice to quit added to the same module
VISIBLE CHANGE  26 / 0   unchanged
```

## 10. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** Four rows now: THE FIRST NOTICE, WHO SENDS THE
NOTICE, YOU PAID IT, and **THE BLOCK HOLDS THE DOOR**.

## 11. ROUTED, AND ONE THING I WOULD LIKE SOMEBODY TO LOOK AT

**TO PEOPLE**, with an apology attached: I handed you "give the block's residents
minds" six rounds ago. You did not need to build it; it already worked. The bad
measurement was mine.

**TO WHOEVER OWNS THE WALKED CITY** (and this is measured, not a guess): opened on
its own, `slices/BOHEMIA_CITY_WORLD.html` draws **no people at all** — not the
player, not one resident — because nothing posts it a body. Every gate that
checks that page standalone is checking a city with nobody in it. That is not a
bug in the game he plays. It is a hole under every test that opens that file
directly, and this lane just fell in it for six rounds.

**Observed, not claimed as a bug, because I could not separate it from a player
who simply was not standing near anyone:** in one sample, 12 bodies were drawn
and the nearest was 11 units from the player against `SEE_RANGE` 9, so nothing was
witnessed. Whether a player standing next to somebody is reliably witnessed in
normal play is a question I did not answer, and I am saying so rather than
reporting a range bug I have not reproduced.
