# BATTERY WORTH, ROUND 2 — THE SUPPLY IS FIXED AND WORK IS PAID, NOT PRINTED (9/18/26, WORLD lane)

Board row `[battery worth]` / YOU-ARE-BUYING-THE-CONTAINER, second round.
Ships: the opening stock, work paid from a treasury, the nightly charge,
`gates/battery_worth_gate.js` 25 → 35.

---

## 1. THE PENDING CAME BACK RULED

Last round this lane measured that **a day of work minted a cell from nothing**, ten
days of work taking the valley 0 → 10 batteries without bound, and shipped the count
rather than the fix because the fix needed a number nobody had ruled.

**RULED 9/16, ruling 9 of the six defaults after his second play:**

> one battery per head on day one, held by the treasury of whoever holds that
> person's ground, plus one a day per lit site; **a day's work is PAID from a
> treasury, never minted.** The fixed supply is one hour of WORLD's when a lane has
> no five-minute break.

## 2. MEASURED FIRST, ON THE REAL VALLEY

```
neighbourhoods ......... 576
heads .................. 3,352   across 12 factions
                         Network 672, Remnants 608, Mob 556, Anarchists 428,
                         Blues 320, Cartel 284, Church 224, Colorful 120,
                         Caravans 60, Trades 40, Homeless 20, Custom 20
lit circuits ........... 173     across 12 factions
time to take the tally .. ~10 ms
```

Cheap enough to pay once at the first purse and never again.

## 3. WHAT SHIPPED — ALL THREE HALVES OF THE RULING

**THE OPENING STOCK.** The valley boots with **3,352 batteries sitting in the faction
treasuries**, a cell per head on each faction's ground. Paid **once**: a second call
returns `ALREADY_STOCKED` and adds nothing, because an opening stock that can re-run
is a mint with a polite name. Every entry carries its own reason (`the lights went
out`) so `made()` can tell the cells that were already on the shelves from the ones
the valley made afterwards.

**WORK IS PAID, NOT PRINTED.** A day's work is now a handoff from the treasury of the
ground you worked on — the same holder the rent goes to, so what you earn and what you
owe are the same outfit's. A company town, at no new table.

```
before a day's work ... valley 3,352   player 0
after  a day's work ... valley 3,352   player 1   made 0
```

**It falls back rather than refusing.** A day on nobody's ground, or for an outfit
with an empty treasury, still pays the old way and marks itself `minted`. A player who
cannot eat because a faction is broke is `[rice clock]` broken again, and this lane
has broken the first bag of rice once already.

**AND THE CHARGE COMES BACK.** One a night per lit circuit, paid to whoever holds that
wire: **173 on the real map**. The cell count is fixed; what a working panel makes is
charge. **A dark circuit makes nothing**, so letting your ground go out stops you
earning from it — the rent now bites in both directions.

## 4. THE CARD

```
BATTERIES IN THE VALLEY: 3352 across 15 hands
```

and, on a night the wires ran, *"and 173 more exist than last night"* — which is now a
true statement with a named cause rather than a symptom of printing.

## 5. A STALE COMMENT THE RULING SUPERSEDED

`bohemia_cells.js` said minting was the defect. After ruling 9 that is only true of
the fallback path: the opening stock is not minting, being paid is not minting, and a
live wire making one a night **is the design**. The header now says all three, because
a comment that contradicts a ruling is exactly the rot the truth hierarchy exists to
kill.

## 6. THE GATES

`battery_worth_gate.js` 25 → 35 checks. Mutation-tested:

| break it like this | checks that go red |
|---|---|
| work goes back to minting | 1 — and it reads `3352 -> 3353` |
| the opening stock can be run twice | 1 |
| the opening stock counts as minted | 5 |

`every_pocket_gate.js` went 56 → 52/4 on this change, and **all four were my own gate
hard-coding the old empty-valley numbers**, not real breaks: it asserted the landlords'
*totals* equalled what the player paid, and a supply of exactly 40. The claim was never
the literal, it was the **invariant** — conservation, and the landlord gaining exactly
what the player lost. Rewritten to assert that; 56/0 again. A check pinned to a number
the world can legitimately change is a brittle check.

## 7. RATCHET AND NOT-MINE

Walked with the one driver: door opens, controls render, the seam crosses by pinch and
comes back, **0 page errors**.

`tools/bohemia_faction_dossiers.py` still crashes (exit 1, *BLUES "COPPER WORK SHIRT"
is not in the canon wardrobe bank*) and DERIVED FRESHNESS is red for it. Verified last
round that it crashes identically on an untouched parent. Not this lane's.

## 8. ONE THING I DID TO MYSELF, WRITTEN DOWN

I truncated `BOHEMIA_CITY_WORLD.html` to **zero bytes** mid-round, with
`open(p,'w').write(open(p).read().replace(...))` — Python opens the write handle first,
which truncates the file, so the read returns empty. Restored from git in seconds and
redone reading into a variable first. **Never let a write handle and a read of the same
file appear in one expression.**
