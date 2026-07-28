# BOHEMIA ADDENDUM — NEVER DRIFT (Paolo 7/28/26, LOCKED)

> "Never drift off ever again"

Said after he caught the RUN lane rebuilding an entire house renderer out of the
CBB tileset — the one his own verdict called *could be better* — while thirty
house skins he had personally thumbed UP sat decoded in the same file, never
drawn.

This is the third time the same law has had to be tightened. REUSE-FIRST (7/22)
made a cook document what it looked at. APPROVED-ASSETS-FIRST + THE SHOPPING LAW
(7/26, 7/27) made the catalog mandatory reading. Both were **paperwork**, and
both were satisfied while the drift happened anyway.

---

## THE LAW

**1. DRIFT IS BUILDING WITHOUT SHOPPING.** Not cooking new pixels — *that* was
already illegal. Drift is reaching for whatever is already wired in your file
instead of opening `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md` and finding
out what he already approved for the thing you are about to build. No new pixel
has to be cooked for a session to spend a whole day making the game look less
like his art.

**2. THE CATALOG IS CHECKED BEFORE THE FIRST LINE, NOT AFTER THE SHIP.** A
session that touches any visual surface opens the index first. "I cooked
nothing" is not a defence and never was.

**3. A CLAIMED CONSUMER IS A CLAIM THE MACHINE CHECKS.** The index has a
CONSUMED BY column. Every entry in it that claims a live surface must be *proven
to draw pixels on that surface*, on the real render path. An approved bank that
is loaded and never drawn is a defect (`banks_used_gate.js`), and an index row
that claims a consumer it does not have is a **lie in the one document every
session is required to trust**. That is worse than the gap it describes.

**4. ZERO-CONSUMER BANKS ARE DEBTS ON THE BOOKS.** A bank he approved with no
live surface is tracked in the backlog by name. Not silence. Silence is how his
13 border walls sat unused from 7/14 to 7/28 and how his 30 house skins are
still unused now.

**5. A WAIVER NEEDS A NAME AND A TICKET.** Where a gap is genuinely blocked on a
ruling from Paolo, it is waived *by name*, with the backlog item, and the waiver
is asserted honest in **both** directions: it fails if the bank stops being
loaded (stale entry) and it fails if the bank *starts* drawing (delete it). A
waiver you can forget is just silence with extra steps.

---

## WHY PAPERWORK KEPT FAILING

`reusefirst_gate.py` reads docstrings. A session that draws with tiles already
sitting in its own file never writes a docstring at all, because it never
*cooks* anything — so there is nothing for the paperwork gate to read. The
entire failure mode lives in the blind spot between "cooked new art" (gated) and
"drew existing art" (was not gated).

The fix is not another docstring. **It is counting draws on the real surface.**

## THE GATE

`gates/banks_used_gate.js`, extended:

| check | catches |
|---|---|
| every approved bank the surface LOADS must DRAW | the house-skin and border-wall class of bug |
| every index row claiming a live consumer must really draw there | the catalog lying to the next session |
| the index must carry a machine-readable routing block | the catalog rotting into prose nobody can check |
| every waiver still loaded AND still undrawn | stale waivers, and fixed-but-still-waived |

Run it before you believe an index row.

## WHAT THIS DOES NOT DO

It cannot force a director's call. Where his approved art and a shipped feature
genuinely conflict — his flat house skins versus the massing the houses just
gained — the gate records the debt and **he picks**. A gate that picked for him
would be a different law being broken.
