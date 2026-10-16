# THE SWEEP COULD NOT SEE ITS OWN MODULE
FACTIONS lane · closing the PLUMBER's bounce-back on `[light owners]`, and one of my own · 9/11/26

## THE ONE LINE
Three gates were red on main, all three from this lane, and the two root causes
were the same shape: **a copy of an engine module that nothing was watching.**

## WHAT I WAS HANDED, AND HOW FAR SHORT IT FELL
The PLUMBER's line (9/6) said `[light owners]` left ONE carrier stale, named
`BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js`, and said re-inlining it would turn
both gates green. Measured, it was bigger on three counts, and every one of them
mattered:

    named          1 stale carrier
    measured       4 stale copies across 3 files, one file holding TWO
    named          canon undeclared for BOH_POWERGRID
    measured       canon undeclared for SIX modules, BOH_FLOORPLAN across ELEVEN carriers
    named          two gates red
    measured       three, and the third was mine from the round before

The bounce-back was right to exist and right in direction. It was not the scope.
**A handed-over diagnosis is a place to start measuring, not a work order.**

## FAULT ONE: THE GRID (from `[light owners]`)
Canon is 10,038 characters. The stale copies are 1,811. That is not a missed
edit, it is the **7/14 prototype still wearing the name** — the one whose owner
was a CATEGORY (`settlement / faction / network / solar_lone`), which is exactly
what `[held ground]` and `[light owners]` existed to replace.

So the drifted carriers were serving the valley the game spent two rounds
deleting. Both real call sites still work because the canon `at()` returns a
**superset** of the old shape:

    old   {live, owner}
    canon {live, owner, id, faction, ground, free}

Re-inlined into all four copies. The bundle is an archive, not runnable code
(`node --check` fails on its own `====` rails), and twelve of its fourteen
members match their standalone file byte for byte, so the two that had drifted
were rebuilt to that same invariant, md5 header and size label included.

## FAULT TWO: CANON WAS A COIN TOSS, SIX TIMES
`gates/bohemia_sync_canon.txt` opens with its own warning, written 7/16:

> *"mtime is not authority: dropping an old copy of a file into the working dir
> makes it the newest file on disk while making it the most wrong file on disk.
> That exact thing happened 7/16/26."*

Six modules were never declared, so the gate fell back to that exact guess. **It
guessed right this time, by luck.** All six are declared now, including the two
that have no standalone engine file at all — those name a page, which is not a
workaround but where the body is really authored, and writing it down is the
whole point of declaring instead of inferring.

## FAULT THREE: MINE, AND IT EXPLAINS A HAND-PATCH I DID LAST ROUND
`banner_gate` went red on `engine/bohemia_encounters.js` — inlined in the city
behind a banner the sweep cannot read. Both the resync tool and the gate accept a
banner only when the trimmed line **starts** with the opener and **ends** with the
closer. Ours was:

    /* ==== engine/bohemia_encounters.js (inlined verbatim, __THE_ROAD_INTERRUPTS__) ====
       ONE CANONICAL BODY. ... ENGINE SYNC LAW, held for a module the sync gate cannot see */

It opened a multi-line comment, so the first line never closed, so the module was
invisible. **A block whose own words claim to hold the ENGINE SYNC LAW opted out
of it in its first line.**

That is why, last round, `bohemia_city_module_resync.py` reported *"113 embedded,
113 already fresh"* while the city's encounters body was a revision old and I had
to replace it by hand. The banner is one line now and the prose sits under it. The
tool sees the module and reports it fresh, so the hand-patching ends here.

**The ratchet was not widened.** `KNOWN_HIDDEN` is at zero and its own comment says
anything added there is a regression, not a note. It is still at zero.

## DRIVEN ON THE REAL SURFACE
Both surfaces that carry the module, phone sized, no page errors:

    walked city   79 lit circuits sampled, 20 naming a faction
    run slice     at() returns faction,free,ground,id,live,owner   <- SIX fields

That last line is the proof the re-inline is live rather than merely on disk: the
old body could only ever have answered with two.

The run slice is not downloaded by the product (8/21) — the RUN tab shows the city
— so it was opened through `__loadRunSlice`, the same named door its four gates
use, rather than by clicking a tab that does something else.

## GATES
    engine sync       18 modules, ZERO drift, zero undeclared   (was 1 drifted, 6 undeclared)
    bundle            16/0                                      (was 15/1)
    banner            14/0                                      (was 12/2)
    map bound          8/0 held
Green alongside: demo build 25/0, alpha loads 20/0, encounter 69/0, walk encounter
25/0, turf 43/0, coalition 40/0, mandate 44/0.

## ONE RED LEFT, AND IT IS NOT MINE
`faction_between_gate` is 180/2. **Verified inherited**: a clean checkout of
`origin/main` gives the identical 180/2 with the identical two claims, so nothing
in this round caused it. Named in the handoff for the QUESTS lane with the exact
row, because a bounce-back without the detail is just a complaint.

## [PENDING Paolo] — NOTHING NEW
None of this needed a ruling. It is plumbing on work already shipped.
