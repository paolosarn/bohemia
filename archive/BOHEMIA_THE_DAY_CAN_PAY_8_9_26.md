# THE DAY CAN PAY NOW, AND THE VALVE IS HIS
**8/9/26. WORLD lane, demo-critical rows.
Machines: `payday_gate.js` 26/0, `demo_blockers_gate.js` 27/0.**

> "First: DEMO BLOCKERS — numbered, thumbable. Then: demo-critical — the quest payout hook
> so the day loop PAYS, one act-1 trading hub reachable and spendable, and the dead pass
> (skeletons open, husks sealed) so the valley the vista shows tells its story."
> — Paolo, 8/9/26

---

## FIRST, THE BLOCKERS — AND THEIR EXISTENCE IS DERIVED, NEVER TYPED

Five things only he can decide, in the **VOTE tab**, above the art, one tap each.

A hand-written blocker list is stale the moment he rules one row, and then it asks him
again for something he already gave — which is **STALE UNJUDGED** and **NOTES ARE RULINGS**
in one, and the fastest way to make a judging surface worthless. So a blocker exists only
while the machine can still see the hole: an engine table shipping empty with
`[PENDING Paolo]` in its own source *and* an edge function that returns `NO_RULING`; a
backlog row marked `[HELD]`; the live unjudged count. **Rule one and it leaves the list by
itself the next run.** Nobody edits a file.

The question and its conclusions are authored — that half is judgement. The **fact that it
is still open** is measured.

## THEN THE FINDING THAT REORDERED EVERYTHING

**The purse was an island. So was the economy.**

`engine/bohemia_purse.js` — three ruled currencies, one ledger, six verbs, a faucet/drain
audit. `engine/bohemia_economy.js` — scarcity pricing anchored in real siege data. Both
finished. **Neither was imported by a single file in this repo.** Nothing called
`payQuest`. Ever.

And the probe had already said so, in the only voice that counts:

```
[BLOCKED] 5 GET PAID       currency on the walked surface: NONE AT ALL
[BLOCKED] 6 SPEND SOMETHING    nothing to spend: no currency exists here
```

**I WROTE THE OPPOSITE, IN A SURFACE HE READS, EARLIER THE SAME DAY.** The first version of
blocker 1 said *"payQuest() fires on every quest outcome and credits the purse."* That was
false and I had not checked it — the exact thing the 8/1 law names: *do not claim things
about the codebase without checking.* This is that claim made **true** rather than
retracted.

## THE JOINT

`engine/bohemia_payday.js`. It invents no organ and duplicates none:

- **the payout hook** — the quest runtime ends a quest with `{done, outcome, doneTags}`;
  `payQuest` wants `{outcome, tags}`. No third format in between, because a translation
  layer between two things that already agree is a place for them to drift apart.
- **the hubs** — *read*, never placed (MAP LAW). Swap-meet and truckstop cells the overmap
  already sited. Measured across five seeds: **1–2 hubs, every one reachable** by the drive
  network from the curb.
- **the shelf** — the economy module's own four researched goods. Not a list invented here.

**Why a swap meet is the realistic act-1 trading hub, not just a convenient one:** informal
markets in a collapsed economy do not get founded, they *accrete* at a fixed, already-known,
high-traffic spot with room to park and a boundary somebody can watch. That is the
definition of a swap meet, and Las Vegas ran real ones for decades. A market needs no new
building, no charter and nobody's permission — it needs a place everybody can already find.

## AND I ALMOST FIXED THE WRONG DOOR, AGAIN

The obvious move was the run slice. I made it, rebuilt it, and the probe **did not move**.

Tapping RUN swaps in `#cityFrame`. `BOHEMIA_RUN_CURRENT.html` is loaded and **never
displayed** — the wrong-door bug this repo has now paid for four times. The world he walks
is the CITY page. The run template gets the modules too, because it should carry its own
economy, but **following the probe instead of the filename is the only reason this landed
on the right page.**

Then the same lesson a second time inside one hour: the first `hubs()` required the full
world model, and **the walked page has no world model at all** — it inlines the overmap and
nothing else. It returned an empty list on the one surface that mattered while looking fine
everywhere I happened to test. It takes either shape now, and the gate proves both return
the identical set.

## WHERE IT STANDS, MEASURED ON HIS SURFACE

| | before | after |
|---|---|---|
| 5 GET PAID | **BLOCKED** — no currency at all | **PARTIAL** — three currencies live |
| 6 SPEND SOMETHING | **BLOCKED** — nothing to spend | **PARTIAL** — 2 hubs, 4 goods |
| the day, overall | OK 2 · PARTIAL 2 · **BLOCKED 4** | OK 2 · PARTIAL 4 · **BLOCKED 2** |

In the running world: **swapmeet 44,10 and truckstop 56,88**, purse with
resources/electricity/clout, shelf of water/food/meds/fuel, zero console errors.

## AND IT PAYS NOTHING. OUT LOUD. BY NAME.

```
payForQuest -> {applied:false, reason:'NO_RULING', table:'PAYOUT',
                about:"what a quest outcome pays is Paolo's ruling"}
```

Every amount a player would feel is his and every one is still empty. `PRICE_SOURCE` is
`null` and stays null until he answers a letter. **A sensible default here is canon nobody
ruled** — the 8/3 mistake this repo already paid for once, off a sentence that sounded warm.
The gate fails if a number ever appears *and* fails if the refusal ever goes quiet.

**No balance readout ships.** Three zeroes on screen reads as a *broken* economy rather than
an *unruled* one, and inventing a placeholder to avoid that is the same failure wearing a
nicer coat.

## THE THIRD ROW WAS ALREADY DONE

The dead pass is placed **and drawn in the walked world** — `bohemia_city_dead_patch.py`
landed 8/8, `dead_gate` 44/0, 2,657 bodies across 61 districts. My own handoff still said
"you cannot see them yet"; that was true when I wrote it and stopped being true the same
day. Skeletons scattered in the open, husks behind shut doors, and not one body carrying a
wound field.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
