# E23 [every screen] ROUND ONE, SCHOOL: THREE OF THE ROW'S SIX CARDS ARE ALREADY GONE

EYES AND EARS, lane 17, E23 round one of two. 9/27/26. MODE: SCHOOL THEN CHECK, so nothing is
built this round.

THE ROW: *"how BB's map reads at a glance" was a different row -- this one is RUN [drop in]
(9da188c2) finding the four conversation buttons at 31 px, unseen by any checker because none
stands next to a person and opens a conversation. School first: how accessibility audits
enumerate every reachable state of an app (the state graph, not the home screen); then the check:
drive every reachable card (conversation, offer, nightfall, haggle, fight, feed) and measure
every tap target on each, one number a screen."*

---

## I READ THE WRONG FILE FIRST, AND THAT IS ITS OWN LESSON

My first pass grepped `slices/BOHEMIA_ALPHA_0_9.html` for the row's six names and found `daycard`
**zero times**, `nightfall` once (inside quest prose), `offer` and `haggle` nowhere as screens. I
nearly wrote that the whole premise had evaporated.

**The alpha shell is not where the cards live.** They are built inside the child frame,
`slices/BOHEMIA_CITY_WORLD.html`, loaded by iframe -- the exact thing this lane's own 7/18 law
says out loud (VERIFY ON THE REAL SURFACE) and the exact mistake every walk tool in this lane
reaches into a frame to avoid. Re-run against the real file:

```
  daycard        78     offer       336     feed     298
  ctcard         20     nightfall    56     fight    316
  haggle         82
```

So the premise is not gone. It is just not where I first looked. Caught before it went in a
record, which is the whole point of checking twice.

---

## AND ONCE I READ THE RIGHT FILE, THREE OF THE SIX NAMED CARDS ARE STILL GONE, FOR REAL REASONS

**`cardShow()` is the one funnel every real card in this game draws through** -- 9 call sites in
the whole file. **`toPhone()` is the newer one that replaced it for some screens** -- 3 call
sites. Read each of the row's six names against that:

```
  conversation (ctcard)     REAL, cardShow-backed, unchanged
  feed                      REAL, but never was a card -- it is the scrolled phone screen
  offer                     THE CARD PATH IS DEAD CODE
  haggle                    ONLY REACHABLE THROUGH THE SAME DEAD PATH AS OFFER
  nightfall                 NO LONGER A CARD AT ALL
  fight                     a different surface, out of scope here (see below)
```

**Offer and haggle**, in `askOffer`'s own source: the function returns before it ever reaches its
`cardShow(...)` call, guarded by a comment that says why on purpose --
*"the card's own handler below is the offer's haggle-and-take flow, and PEOPLE [face at the door]
and QUESTS [a person asks] are building the body that will say all of this out loud... this is a
shape waiting for a mouth."* That is rule 19/20 (A QUEST IS PEOPLE, PLACES AND THINGS, NEVER A
CARD, Paolo 9/20) landing on this exact function. The card is not broken. It is retired on
purpose and kept as a shape for the mouth-and-portrait version to replace it.

**Nightfall**, in `showReckoning()`: the same information -- who you let down, what you owe, what
tomorrow costs -- now goes to `toPhone('last night', h)` instead of `cardShow(...)`. The comment
names the ruling: *"Paolo 9/20, rule 19a, [no pop ups]: the night's bookkeeping... moves to the
PHONE, the thing he opens himself... AND THE DAY STILL HAS TO TURN... only the modal he had to
dismiss to get his next day is gone."* There is no nightfall card to open any more. It is a phone
screen, and the day advances by itself behind it.

**Fight** is combat, a genuinely different surface with its own rows (COMBAT [fight looks], rule
21's fight leg, the horror bible's fight rows) -- driving it is a different tool's job and stays
out of scope here rather than faked.

So a checker written strictly to the row's six names would either silently skip four of them or
throw trying to open dead code, and report a clean number that measured two screens while
claiming six.

---

## THE OUTSIDE PRACTICE, AND WHY IT SAYS THE SAME THING TWICE

**How real crawlers enumerate states.** Tools like MobiGUITAR and ACE build a model dynamically:
DFS from the starting screen, tracking which events have been tried from each discovered state,
and they stop when every triggerable event leads to an already-visited state. The state is
DISCOVERED by driving, never assumed from a list somebody wrote down.

**And a fixed list is the documented failure mode.** Android's own Monkey tool "achieves
surprisingly low activity coverage (10.3%)" because it "is oblivious to the locations of widgets
on a screen and cannot distinguish states before or after an event" -- it presses things without
knowing what state it is in, the mirror image of trusting a list without knowing what state the
GAME is in. And in the industrial "are we there yet?" study, 25 of 50 apps were never fully
covered because reaching some activities needs "a unique path of activity transitions from the
root... or the activity that requires the filling of correct text inputs" -- a precondition,
exactly the shape of `#cttalk` needing a person standing next to you, which is the finding that
started this whole row.

**This lane's own comment already said the fix, before this round asked the question.** The CSS
block that gives every card button its 44px reach ends: *"AND THE LIST IS NOT THE GUARANTEE. A
selector list can always miss the class somebody adds next round."* That is the crawler lesson,
written by another lane, about a different list, five days before rule 20 made two more items on
this row's own list stop existing.

**And the touch-target half.** WCAG 2.5.8 sets 24x24 CSS px as its floor, Apple's HIG asks 44x44,
Google's Material asks 48x48; this repo has stood on 44 since round one of this lane. Lighthouse's
own overlap rule -- a target under 48px fails if 25% of the area within 48px of its centre
belongs to another target -- is the crowding half E23 has not measured yet, distinct from the
size half thumb_gate.js already checks on the first screen.

---

## WHAT ALREADY EXISTS, SO ROUND TWO DOES NOT REBUILD IT

`gates/thumb_gate.js` wraps `addEventListener` before the page runs so no handler can hide from
it, and it already proved `[onclick]` and CDP's `getEventListeners` both miss real controls here --
that wrapping technique is reused, not reinvented. `gates/city_rail_gate.js` reads "whatever the
column holds" rather than a hardcoded rail list, which is the exact right shape for a crawler and
the wrong scope (it is the rail, not the cards). Neither one drives to a second or third screen.

## WHAT ROUND TWO BUILDS

A driven crawl on PLUMBER's one driver, starting at the street:

1. **Discover states by driving, not by name.** Press every visible control (reusing the walk's
   "innermost pressable thing" rule from `[song length]` and `[the six]`), and after each press
   fingerprint the screen (which card is open, or which phone page). A state already fingerprinted
   is not re-explored, matching the DFS-with-termination pattern above.
2. **Measure 44px on every new state**, with `thumb_gate`'s `addEventListener` wrap so a handler
   wired without `onclick` cannot hide.
3. **Report what could not be reached and why**, never silently. `offer`/`haggle`/`nightfall` are
   reported as CORRECTLY UNREACHABLE (their own guard, named), not as a checker failure -- the
   crawler must tell a retired shape from a broken one.
4. **RULE ZERO**: plant a second card reachable only through a real press two levels deep and
   confirm the crawl finds and measures it; plant a `return`-guarded dead card like `offer`'s and
   confirm the crawl reports it unreachable rather than silently skipping or falsely measuring it.

## BLIND SPOTS, STATED

The fight surface is out of scope on purpose, named above rather than faked. I have not yet driven
anything; every number here is read from source, not from a browser, which is proper for a school
round and is exactly what round two exists to convert into a measurement. And "unreachable on
purpose" is my own reading of two comments -- it should hold up under a real crawl attempt in round
two, and if the crawl finds a live path into either that this reading missed, that is the round-two
correction to make.

## PROOF

- `slices/BOHEMIA_CITY_WORLD.html`, the counts and line numbers above are grep-verified there
- `gates/thumb_gate.js`, `gates/city_rail_gate.js`, read for technique and for scope
- the Monkey/MobiGUITAR/ACE and WCAG/Lighthouse figures are quoted from search results because
  the primary papers and battlebrothersgame.com-adjacent research domains are blocked by this
  box's network policy, the same blind spot [bb reads] hit twice already
