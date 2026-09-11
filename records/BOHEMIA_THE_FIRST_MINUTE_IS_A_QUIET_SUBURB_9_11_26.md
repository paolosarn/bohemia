# THE FIRST MINUTE IS A QUIET SUBURB (RUN, 9/11/26)

VAMILY `[drop in]` / THE-FIRST-MINUTE-IS-THE-PROMISE.

> What a stranger who taps the link DOES in their first sixty seconds, in order,
> so they end that minute wanting the second one. **One thing at a time (the pad,
> then something to look at, then somebody who wants something from them).**

Measured end to end on the served demo, at 390x844, walking on the beat and
tapping cards the way a stranger does.

## THE FIRST MINUTE, AS IT ACTUALLY PLAYS

     6.5s   the walked world is up
    ~20s    DAY 1 card, and it DOES carry the job:
              "Something came in on your phone overnight."
              THE METER READER / "nobody has picked it up yet"
              "about 4 and a half hours on foot, about 8 and a half there and back"
    15.6s   TEACHING: WALK WITH THIS
    27.8s   TEACHING: THE PHONE IS HOW THEY REACH YOU
    40.4s   TEACHING: STEP BACK AND SEE THE CITY
    60s     nothing else. 13 fine tiles walked, one in-game minute spent.

**Correcting my own last round: the phone DOES ring inside the first minute.** I
reported it did not, and I was reading the offer before `showWake` had run —
`offerRing()` is called inside it. Entering is not being ready, again, and this
time it made me write down something false. The third beat is present at ~20s.

## WHY NOTHING EVER HAPPENS TO HIM, AND IT IS STRUCTURAL

**He wakes in `suburb`, and the road director can never fire there.** Instrumented
live: **13 calls, 0 fired, reason `NO_TABLE`, with 65 seconds of walking handed to
it.** The wiring this lane shipped on 9/5 is working perfectly; there is simply
nothing for it to pick.

`ROAD_TABLE` has seven rows and every one is a transport district — arterial,
strip, freeway, beltway, interchange, rail, wash. **Suburb is not one, and that is
deliberate and correct**: the feature is called THE ROAD INTERRUPTS, and the
table's own comment says *"NO GLOBAL SPAWNS EVER: a district with no row spawns
nothing, and there is deliberately nothing to fall back on."* This is not a bug to
fix in the table.

**The nearest road district is one overmap cell away, which is 128 fine tiles.**
Measured walking rate: a minute of play covers **13 fine tiles**, and it is not my
harness pacing — 50 back-to-back steps with 60 clear cells ahead moved the same 13
tiles, so **one step is about a quarter of a tile**. The first road moment is
several minutes of continuous walking away from a sixty-second row.

**And the other two systems that could fill the gap are out of reach too:**
`hostileProbe()` returns 0 near the spawn and the nearest at-odds base is `null`;
the wildlife query answered 0 for that cell and hour. *(That last one used argument
shapes I inferred rather than read off a caller, so treat it as the weakest line
here.)*

## *** AND THE RULED FIRST BEAT OF THE DEMO IS NOT WIRED AT ALL ***

His ruled cut is **COLD OPEN → THE VISTA → ONE GOOD DAY → sleep**. The cold open is
his own, from 8/8: *"build a tutorial-tier family-defense encounter for the cold
open"*, and it is built — `COLD_OPEN`, `coldOpenSpec()`, `startColdOpen()`.

**`startColdOpen` has ZERO callers.** The only other hits in the whole alpha are a
comment describing when it *should* be called and two scene records that name it as
their `call`. **The demo's ruled opening beat does not play.** That is the real
reason the first minute is a card and three labels.

It is also already known to be unreachable from two directions:
- `COLD_OPEN.cast` and `COLD_OPEN.place` are both **`[PENDING, Paolo's call]`**.
- DEMO DAY's own not-asserted list says **"THE FIGHT — combat has no entry point on
  the walked surface"**, and NO DAMAGE BEFORE THE DIAL governs it.

## WHAT THIS ROUND DID NOT DO, ON PURPOSE

Nothing was built. Three ways to force a first minute were available and all three
are somebody else's call or a law violation:

- **Adding a suburb row to the road table** would contradict the feature's own
  design and invent which encounters happen where — contents, not mechanism.
- **Moving where the demo starts you** is map layout. MAP LAW: this lane never
  designs those.
- **Wiring the cold open** needs combat entry on the walked surface, and its cast
  and place are pending his call.

STOP PRODUCING names finding a legal way to ship anyway as the violation. The row
is answered; what it needs next is a decision, not a patch.

## THE ONE THING BLOCKING THE WHOLE ROW

**A stranger's first sixty seconds happen in the one kind of place where nothing in
this game is designed to happen, and the beat that was supposed to fill them has
never been connected.**
