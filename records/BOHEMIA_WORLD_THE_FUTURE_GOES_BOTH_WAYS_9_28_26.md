# THE FUTURE GOES BOTH WAYS

WORLD lane (chat 02), 9/28/26. Rule 37(c). The record for the round that rebuilt
`engine/bohemia_future.js` after Paolo voted down what it produced.

---

## 1. WHAT HE SAID

Two of his third votes landed on this lane's own shipped work, in the same round.

**THE SAME VALLEY, THREE ACTS: DOWN.**

> "You know actually the future could get worse. You could choose the origin as a
> raiding party and then three acts later, like the buildings that you destroyed
> or the people that you raided, in the future the surrounding buildings of their
> headquarters or their stuff could get worse. So yeah really the future is a
> reflection of your past actions and that's what it's gonna have to be."

**THE VALLEY AT NIGHT: UP**, with a note.

> "A mix of both but im leaning towards the larger clusters"

The first is rule 37(c): THE DERIVE IS SIGNED. It kills rule 32(b), which said the
game starts in the ruin and the future only gets better. The second is a shape
ruling on the light and it is handled in section 5.

---

## 2. THE CLAMP WAS MINE

This is the finding of the round and it is not flattering.

`engine/bohemia_century.js` has always had the subtraction he asked for.
`through()` returns `net`, which is **built minus demolished**. It also returns a
housing figure, and the module's own comment says, in its own file:

> a housing figure allowed to be NEGATIVE ... clamping that to zero would hide
> exactly the story the century rule is for

I read `.built` instead of `.net`. Then I clamped `housing` to zero myself. Then I
wrote a refusal, `WOULD_DECAY_BELOW_THE_FLOOR`, that made the clamp a law of the
module and threw if anything tried to go down.

So the picture he rejected was not missing data. Every number he asked for was
sitting in the ledger the whole time, behind two lines I wrote. He watched three
panels get nicer and said the future could get worse, and the honest answer is
that the game already knew that and I had thrown the sign away.

**Count this one.** It is the seventh time this round-series that measuring found
the premise already built, or built wrong in a way nobody had measured. The
difference here is that the wrong thing was mine.

## 3. WHAT CHANGED IN THE MODULE

`engine/bohemia_future.js`:

* `standing` is now `(by.net | 0)`. Built minus demolished, signed.
* `housing` is carried whole, negative and all. No clamp.
* `WOULD_DECAY_BELOW_THE_FLOOR` is **removed**. In its place the derive reports
  `out.went[k] = out.valley[k] - floor[k]`: how far each field moved off the
  floor, up or down, as a number instead of a refusal.
* `THE_LINES_MOVED` is **kept**. His ruling is about what STANDS and what is LIT.
  It was never about where the lots are, and rule 34's honest grid says the cells
  do not move. An act never adds or removes a cell.
* `net` was added to the report card. Without it the first signed attempt
  produced all zeros, because a field the report card does not name reads as
  nothing.

Measured on a real fixture (build 10, raze 6):

| past | standing at act 3 |
|---|---|
| a raiding past | **4** |
| doing nothing | **10** |
| a building past | **16** |

That is the ruling, in three numbers, off the live ledger.

`LOOKS` still ships empty. What a poor valley or a rebuilt valley LOOKS like is
his, not mine.

## 4. A NEW UNREAD, NAMED INSTEAD OF FAKED

His words name "the buildings that you destroyed". The module cannot express that
yet, and it says so by name rather than returning a plausible zero:

```
razed -- nothing counts the GENERATED city as a standing quantity
(homes() returns [] on a fresh valley) so razing what was already
there cannot be expressed yet (WORLD measured it 9/28)
```

What works today is razing what YOU built: the ledger has both sides of that. What
does not work is razing the valley that generated before you arrived, because
nothing anywhere holds a count of it as a standing quantity. That is a real hole
and it belongs to whoever gets the row for it.

## 5. AND THE GATE WAS GREEN FOR THE WRONG REASON

When I pulled the floor refusal out, `gates/three_acts_gate.js` stayed green.

Its check was a regex for `WOULD_DECAY_BELOW_THE_FLOOR` against the module source.
My replacement **comment** still contained the words. So the gate matched a
comment describing a constant that no longer existed, and reported a law being
enforced that had just been deleted. Green over nothing, in my own gate, in the
same commit that removed the thing it was checking.

Re-anchored to a live-statement regex, and re-aimed at the ruling instead of the
dead rule. **THREE ACTS: 28 passed, 0 failed, red four ways.**

Two related instrument failures from the same round, written down because the
pattern is the point:

* My first test fixture was unreal: 6 demolitions with 0 builds, giving standing
  of −6. A valley that razed six things and built nothing is not a history, it is
  a typo. Fixed to build 10 / raze 6.
* In `gates/light_clusters_gate.js`, one check's regex for the removed coin flip
  matched my own comment quoting the removed line, and another demanded
  `open.length > 0` and went red the round he judged everything.

Legs 7 and 8 (the flip) still print as OWED on every run. Nobody has built a flip.
The gate says so out loud rather than quietly carrying six of eight.

## 6. HIS OTHER VOTE: THE LARGER CLUSTERS

`engine/bohemia_powergrid.js` used to decide lit-or-dark with **one coin flip per
feeder**. That scatters. He asked for larger clusters.

`growClusters(circuits, seed, target, sources)` now seeds a few owned sources and
grows outward through touching feeders until the lit fraction is reached. Same
lamps, different shape.

Measured on the real grid, seed 1337, 425 lit of 3,538 street cells (12.0%):

| | patches | biggest patch |
|---|---|---|
| before (coin per feeder) | 178 | 12 |
| after (grown from sources) | **11** | **104** |

The lamp count did not change. Only where they are. `gates/light_clusters_gate.js`
sections B, C and D were rewritten: B holds the law now instead of measuring the
hole, C proves there IS a core, and D proves the same amount of light in a
different shape against a simulated coin flip. **37 passed, 0 failed.**

## 7. THE COOK: TWO FUTURES

`tools/bohemia_two_futures_cook_9_28_26.js` → `slices/vote/WORLD_TWO_FUTURES.png`.

Not the killed picture with a panel added. It is **the same act, twice, off two
pasts**. Left is act 3 after a raiding past. Right is act 3 after a building past.
One valley, one date, two histories. The raid takes the two biggest lit blobs out,
because his own law says outages are clusters too: a raid darkens districts, it
does not scatter the grid.

Measured:

* lit cells: **raided 263 / start 425 / built 705**
* patches: 9 / 11 / 14, biggest 49 / 104 / 185
* **7,515 ground pixels compared, 0 moved**

The tool refuses itself four ways: if the two futures do not straddle the start
(rule 37c, both directions), if they are less than 25% apart (a reflection of your
past has to be legible), if either is a blackout or a restoration, and if a single
ground pixel differs between the panels.

AH-01, the analog horror read: two photographs of a city at night is the ordinary
frame. **The wrong thing is that the dark is the same shape in both.** Same
streets, same mountains, same empty lots, and only the light differs. Whatever you
did, the city did not move. It just kept more or less of itself switched on.

Nothing shipped to a play surface. Rule 18 holds. This is a picture for the VOTE
tab.

## 8. WHAT THIS COSTS AND WHAT IT DOES NOT

Rule 32(b) is dead. Nothing else moves: the floor is still the seed's own valley
measured at run time (9,216 cells, 3,538 street, 432 lit, 215 people), the lines
still do not move, and the derive still refuses rather than guesses when a ledger
has no act on it. The change is one sign, and the sign was always in the data.

---

`[bb futures]` Battle Brothers never shows you a second version of the world, and
it does not have to: its map is a still you read once and its history is a list of
contracts you remember. Ours is a place you come back to across three acts, so the
comparison has to be legible ON THE GROUND, not in a log. That is why the two
panels share every road and every mountain: the only sentence the picture is
allowed to say is the one about what you did.
