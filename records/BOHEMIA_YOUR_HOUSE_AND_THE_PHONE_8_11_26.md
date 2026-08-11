# YOUR HOUSE, AND THE PHONE — 8/11/26 (RUN lane)

Paolo, 8/11:

> How was this a run when my house isn't labeled and the Phone app that we worked
> so hard for isn't even implemented yet.

He is right twice, and both are the same defect, and it is the one this lane has
now been caught by four separate times:

**THE WORK EXISTS AND IS NOT IN THE SURFACE HE TAPS.**

---

## THE PHONE WAS NEVER MISSING

`slices/BOHEMIA_CURRENT_SLICE.html` is a finished phone. 1.6 MB of it:

- the **Network** feed, with DMs living inside it as a tab (his 7/21 ruling:
  whatsapp + instagram combined, the feed IS the DMs)
- the **ONE MAP** app, rendering the real generated valley cell for cell off
  `engine/bohemia_valleymap.js`, the same shared renderer the MAP tab uses
- **Wallet**, **Profile**, followers, quest offers, quest pickups over the phone
  vs pulled up in person

It drives the real engine modules. It was behind the alpha's **SLICE tab**, which
is a developer tab. So in the game he plays, there was no phone.

And the backlog has said so since **7/27**, filed and never actioned:

> 0D. (7/27, [PENDING Paolo], probably not the CITY lane) "the phone system isn't
> in here, doesn't progress as I walk" — the phone/feed is not reachable from the
> walked world and nothing about it advances with steps.

That `[PENDING]` was parked on *whose lane it belonged to*. That is not a question
that needed him. **Reachability is mechanism**, and mechanism is mine. Two weeks
sat on a question I should have answered myself.

### What ships

A **PHONE** button in the run. It opens **the real slice** — not a re-skin, not a
second copy that drifts — so every future phone improvement lands in the run for
free. REUSE-FIRST held: nothing about the phone was rebuilt.

And it **progresses as he walks**, which is the half of that backlog entry that
actually mattered. The city posts into it on open and on every change:

| pushed | so that |
|---|---|
| the cell he stands in | the map's "you" blip is really him |
| the district | named on the phone |
| the day and the clock | the day loop's real clock, not a demo's |
| the live objective | today's job, in the quest's own words |
| where HOME is | drawn on the map |

**The map needed almost no new code to show him.** It already drew "you" from
`player.tile` and was drawing a demo actor parked at a start cell. Feeding it the
real cell makes the existing blip correct — the cheapest version of this, and the
one least likely to drift from the map the MAP tab draws. The only thing genuinely
added to that canvas is a HOME marker, using the map's own glyph-and-label helper
(the one that already draws DAM and SOLAR).

---

## YOUR HOUSE

The day loop I shipped this morning woke him at 06:00 **nowhere in particular**, in
a valley where nothing was his. A day that starts nowhere is not a day.

**HOME** is now a real place: the enterable house nearest **where he actually
lands**, resolved off the world model. He wakes at his own door and the word
**HOME** is drawn over it, in the exact type the city already uses for people's
names — a second label style would be a second design.

**MAP LAW held.** I did not place a house, move a house, or author a district. I
**named** a house the generator already built, by a rule. If Paolo wants a
different house, or a real family home authored into the suburb, that is his canon
and this rule steps aside for it.

---

## FOUR WRONG ANSWERS BEFORE THE RIGHT ONE

This is the part worth keeping, because every one of them looked like success.

**1. Anchored on the wrong point.** First rule was "the house nearest the middle of
the district." Measured: that put HOME **55 cells** from where he drops in — his
own house off screen the entire time he stood in his own neighbourhood, which is
indistinguishable from not having one. Anchoring on the landing point instead
(itself deterministic: same seed → same spiral → same landing) put it 26 cells
out, and waking at the doorstep put him on it.

**2. Cached a "not yet" as an answer.** `homeFind()` asked during boot — before the
cell's fine data exists — finds no house. The first draft wrote that *nothing* into
the cache under the cell's key, so every later call returned it and he dropped in
beside a house the game had already decided he did not have. **A null is not an
answer, it is "not yet."** Only a real find is cached now.

**3. The temporal dead zone, twice, into a silent catch.** I hooked the wake into
`swapMode()`, which sits ~500 lines *earlier* in the file than my declarations. A
top-level `let` is unreachable until its own line runs, so the drop-in branch threw
`Cannot access 'LANDED' before initialization` — **into a `try{}catch(_e){}` I had
written myself.** The only symptom was that he never woke at home. Switching those
to `var` fixed mine and then exposed two **pre-existing** faults of the same shape
in the city: `updHud` reads `RIDING`, and the footprint walk reads `IN_D4`, both
`let`s declared after the code that uses them. Those are not mine to fix today, but
they are why the hook moved to `render()`, which runs after the whole script.

**A silent catch around a TDZ error is a bug that looks exactly like a feature
quietly not working.** That is the lesson, and it cost four measurement rounds.

**4. My harness was measuring a half-executed page.** Calling `swapMode()` directly
from Playwright hits those pre-existing faults and reports nonsense. The gate now
**taps the buttons** — GET UP, DROP IN, PHONE — the way he does. Same class as
clause 1b of MEASURE THE THING HE NAMED: a measurement not taken the way he plays
is not a measurement of what he sees.

---

## PROOF

`gates/home_phone_gate.js`, 21 assertions, all driven by tapping the real buttons
in a real browser with the network dead:

- HOME resolves to a real **house** (checked against the world model's own
  `enter` text), and re-resolving from scratch finds the **same** house
- he **wakes at his own door**, and the word HOME is **actually drawn** there —
  a label nobody sees is not a label
- **bounded**: 300 cells away, the label is not drawn
- the PHONE button opens **the real slice**, and the fix lives in the phone
  **source**, so `build_current_slice.js` cannot delete it
- the phone carries district, day, clock and today's objective, **shows** them,
  and its map blip is his actual cell
- zero page errors through wake → drop in → walk → phone

Registered in the suite and in `shipped_truth_gate` (RUN lane 16/16 live).

---

## WHAT I STILL OWE HIM

The phone opens as the phone. It does not yet **ring** — no quest arrives on it,
no DM lands from something that happened in the world. The pipe now exists in the
right direction (world → phone); the return leg (accept a job on the phone, and the
day loop picks it up) is the next thing in this lane.
