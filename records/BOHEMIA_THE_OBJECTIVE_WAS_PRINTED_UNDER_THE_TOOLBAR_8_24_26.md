# THE ONE SENTENCE THAT TELLS HIM WHAT TO DO WAS PRINTED UNDER THE TOOLBAR
### 8/24/26, RUN lane. TAB: RUN (take the job, then look at the top of the screen).

## HOW IT WAS FOUND

Not by reading a ledger. By playing the demo the way a friend plays it — splash,
cold open, get up, phone, take the job, walk — and **screenshotting every beat and
looking at them**. The bug is in the first frame after taking the job.

## THE MEASUREMENT

Boxes in the city frame's own coordinates, after taking the day-one job:

```
qline    47..62   "Find why the block browns out"    z-index 7
topbar   49..80    MUSIC / SAVE / PHONE / wrench      z-index 7
```

**Thirteen of the objective's fifteen pixels were inside the toolbar**, and both
sat at z-index 7, so which one won was decided by DOM order rather than by
anybody's intent. That line is the only thing in the game that tells a player
what he is supposed to be doing.

The same sweep found two more pairs, all in one corner:

```
rungbtn  699..730   note     714..754     16px of overlap
bikebtn  760..792   sleepbtn 767..798     25px of overlap
```

## AND IT WAS A REGRESSION AGAINST A FIX THAT ALREADY SHIPPED — BY THIS LANE

On **7/29** the CITY lane found this exact bug in this exact corner and wrote the
diagnosis down:

> "four things live in that corner and every one of them was absolute-positioned
> with its own hardcoded offset, so none of them knows the others exist... The
> layout does the arithmetic instead of me."

It built `#blstack`, a bottom-left flex column, and moved `#note`, `#bikebtn` and
`#fitbtn` into it. Then the **DAY LOOP — mine — added three more absolutely
positioned chips to the same corner** with hardcoded offsets:

```
#sleepbtn bottom:6    #mktbtn bottom:40    #rungbtn bottom:74
```

which is word for word the bug that had just been fixed, committed six days later
by the lane that should have read the note above the CSS it was writing next to.

And the ladder has a **hole**: `#mktbtn` is `display:none`, so the 40 rung is
empty and `#note` (bottom:58) falls into the gap on top of `#rungbtn` (bottom:74).
A hardcoded ladder assumes every rung is always visible. This one is not.

**Nothing in the machine cared.** The fix was right, was written down, was read by
nobody, and rotted in under a week. That is the entire argument for the gate.

## THE FIX IS THE ONE ALREADY DESIGNED

Nothing new is invented. The three day-loop chips **join `#blstack`** and lose
their hardcoded offsets, and the top gets the same treatment with `#tlstack`, so
the objective sits under the toolbar and cannot be buried even when a long song
title makes the toolbar wrap to two rows.

**The order is declared, not left to creation timing.** The old adoption loop did
`insertBefore(el, firstChild)`, so where a chip landed depended on which system
happened to build it first. Bottom-up order is now written down — SLEEP nearest
the thumb, the transient hint furthest from it — and re-asserted every pass, so a
rebuilt chip returns to its own place. A hidden chip **leaves** the column instead
of holding an empty rung open.

## THE OTHER HALF: THE OBJECTIVE NEVER SAID WHAT TO DO

`hudLine()` returned `objs[0].text` and threw everything else away. Meanwhile the
day's spec, in the same file, declares how the quest actually advances:

```js
day 1: advance: { stage: 20, on: 'enter_building', require: 'dark' }
```

So "Find why the block browns out" is finished by **walking into a building with
no power**. Nothing on screen said building. Nothing said dark. A friend walks
past every door in the valley and then goes to bed.

(The mechanic itself is fine and completable — CLUSTERED POWER puts ~88% of the
valley off the live network, so nearly any building satisfies `dark`.)

The next step is now **derived from that rule** rather than written per quest, so
it cannot drift from the mechanic it describes: change how a day advances and its
sentence changes with it, and every day's quest gets one without anybody authoring
it. It disappears once he is past that step.

```
before:  Find why the block browns out
after:   Find why the block browns out · get inside somewhere the power is out
```

Words are a real attempt tagged `draft:true` (ALWAYS MAKE AN ATTEMPT, 8/11). They
are the mechanic in plain English; the mechanic is not mine to change.

## THE GATE: `hud_overlap_gate.js`, registered HUD OVERLAP, 14 claims

**General, not three special cases.** Every visible piece of chrome measured
against every other one, pairwise, in four states reached by tapping. A chip added
tomorrow is covered the day it appears, without anybody remembering to add it.

- **Containment is skipped** — a button inside the toolbar is inside it on purpose.
- **Exceptions must be NAMED with a reason.** There is no fuzz factor and no
  tolerance to hide behind. The list is currently empty.
- **The opened builder's drawer is excluded, and the line is worth drawing where
  it is:** it is a *panel the player opened*, not a chip that lives in a corner.
  Its button is chrome and is checked. Its contents already sit in their own flex
  column with a position reset, so they cannot collide with each other.

```
just got up 0 · carrying the objective 0 · drawer open 0 · walking with it 0
(collisions per state, across 15 pieces of chrome — was 3 pairs)
```

### THE CONTROL FAILED TWICE BEFORE IT BIT, AND BOTH FAILURES WERE THE FINDING

A control that cannot fail is not a control.

1. Shoving `#sleepbtn` onto another chip with inline `position:fixed` did
   **nothing** — the flex column simply kept winning.
2. Taking it out of the column with its old `bottom:6px` *did* reproduce the bug —
   and then `blStack`'s 600ms tick **adopted it back before the read**, so the gate
   still saw a clean screen.

The fix now plants, measures and restores **in one `evaluate`**: reading a rect
forces layout synchronously, so no timer can run in the middle. That the tick
heals it at all is the fix working, and it is asserted as its own claim.

## TWO OF MY OWN BUGS, CAUGHT BY MY OWN GATE ON ITS FIRST RUN

- `#tlstack` was appended to `.wrap`, which is **not** what `#topbar` was
  positioned against — `top:8` put the toolbar at y=49, so its offsetParent starts
  41px down, below the clock bar. Hung off `.wrap`, the same `top:8` rendered at
  y=8 and **dragged the whole toolbar up into `#hud`** — five fresh collisions
  where there had been none. Ask the element what it was positioned against
  instead of assuming, and capture it *before* adoption changes the answer.
- The gate read `.h` off a `DOMRect`, which has `.height`. It printed
  `toolbar ..NaN`, and a comparison against NaN is always false — the claim would
  have failed forever for a reason that was not the claim.

## AND ONE ROW CORRECTED SO NOBODY RE-DOES A REJECTED THING

`interior_pool` was sitting in this lane's owed pile as "the dressed-interior bank
is absent". **It is not a hole. It is a refusal, and a considered one.** The CITY
lane opened the bank, rendered it to PNG, looked at it, and wrote the reason into
the city above the furnish pass: banded oak barrels, burlap sacks, tavern benches,
potion bottles and **live flowering plants** — a generic fantasy asset pack. Live
greenery breaks the dead-world standing law outright. The other pool's containers
are glowing sci-fi loot crates.

> "Putting a fantasy barrel in the one surface he plays, because a bank existed and
> a law said reuse first, is how a build ends up looking like somebody else's game."

City interiors **are** furnished — typed COVER/LOW massing, edge-faced,
45-degree-law correct. They are simply not furnished from that bank. The ledger
now says so, quoting the refusal, because a row that reads OWED will send somebody
to re-do a rejected thing.

*(The status column still reads INTEGRATED, which is what the probe proves about
the run slice. `integration_gate` rejected a compound status when I tried one —
that vocabulary is closed on purpose. A gate outranking my convenience, and it was
right.)*

---

**THE RULE THIS BUYS:** a corner of the screen belongs to a layout or it belongs
to nobody. The moment two things in it carry their own hardcoded offsets, neither
of them knows the other exists — and the one that loses will be whichever one you
cared about most.
