# ONE FACE AT THE START, AND THE NEXT ONE IS BORN FROM HIM
# DYNASTY lane, board row [one then heirs] / ONE-FACE-AT-THE-START-AND-THE-NEXT-IS-BORN-FROM-HIM
# 9/29/26 - MODE: BUILD - rule 39c (Paolo 9/28), laws/BOHEMIA_LAW_THE_THREE_ACTS_AT_ONCE_9_23_26.md s11

## THE ONE LINE
**"You start the game, you can't flip between the three people... customize just one
person, and when you hop into the second generation you'll be given an option to
customize the person and it will start off generated based on how you made the first."**
A fresh game now shows ONE face on the phone. A second is born when act 2 unlocks, a third
after that. A real finger hops into the new one and is offered a name, a sex and a
reshuffle in one row of the phone, and that offer closes for good when he leaves.

Three faces from frame one (this lane's [the flip], 9/24) and naming all three before act 1
(this lane's [three names], 9/27) were built correctly and were the wrong product. His
ruling killed both as built. This round unwound them and kept their machinery.

## WHY I TOOK THIS ROW AHEAD OF THE ONE ABOVE IT (said, not hidden)
Rule 5 says the first OPEN line. [the ending] sat above this one. But this row carries the
coordinator's own word FIRST LINE, and it is not a queue item: **it is a live defect.** The
alpha he plays today shows three faces at frame one, which he said he does not want. "His
bugs beat your queue" (rule 8). The claim was committed and pushed as its own commit before
any work, the way rule 5 asks (last round's process miss, not repeated).

## WHAT SHIPPED
**engine/bohemia_acts.js** gained the timing: `unlock(n)` (one way, in order), `unlocked()`,
`flip(n)` refuses a locked act and says `LOCKED` and reports `first` the first time he stands
in one, `customizable(n)` and `confirm(n)` (the offer's window), `visible(seed)` (only the
people who exist, each with `open`, `met` and `bornOf`), `faceKey(seed, n)`, `save()` and
`load()`, `unlockFromBases(entries)` (the default trigger) and `resetAll()`.

**The phone strip** draws `visible()`: one tile at the start, none of them with a glyph
(act 1 is the face maker's). The reshuffle glyph exists only on a person whose window is
open. **The offer** is one row above the strip, never a pop-up and never a keyboard he did
not ask for: a name field (16px, so iOS does not zoom), MALE, FEMALE and OK. It appears when
he hops into an open act, closes on OK or when he flips away, and doing nothing is a whole
answer because the person already exists, named, sexed and faced.

**The faces.** `faceKey` carries what a face is made from: this act's reshuffle count and
sex, and for act 3 the second's as well, so **the third is born from the second, not from
the first** (his words). A typed name is deliberately not in the key. The alpha's face
bridge parses it; `descendantSpec` gained optional `variant`, `reads` and `hopAs` and is
byte-for-byte what PORTRAIT shipped when none is given.

**The save.** The city's own snapshot carries `acts` and restore loads it.

## THREE THINGS MEASURED BEFORE BUILDING (rule 12: a premise, not a gate)
1. **NOTHING IN THE WALKED GAME CAN HAND HIM A HOME BASE.** The default unlock is "the first
   home base is yours". `bohemia_homebases.js` has a `YOU` holder and a `took()` and is
   inlined in neither the city nor the alpha, and nothing calls `took()`. So nothing calls
   `unlock` either. It is one call for FACTIONS or RUN to make the moment a base is his, and
   it is proven here against the REAL ledger. On the glass the door is opened with the
   game's own hook, and the record says so.
2. **THE ACTS WERE NEVER SAVED.** `current()`, the roster, every typed name: module memory
   only. A player who flipped to act 3 and reloaded came back as act 1 with the names rolled
   fresh. Unlock state that a reload forgets is a feature that lasts until he closes the tab,
   so the save is part of this row and not a follow-up.
3. **THE FACE COULD NOT FOLLOW THE PERSON.** [three names] found `ctFaceAsk` keyed the face on
   'act2', a fixed string. Now it is keyed on what the face is made from. Reshuffle changes a
   descendant's face by **761 to 1,513 of 4,096 pixels** (8 variants, measured on the alpha).

## WHAT I FOUND AND DID NOT FIX, SAID PLAINLY
**CHOOSING MALE OR FEMALE DOES NOT CHANGE THE FACE.** Measured the way it should have been
measured the first time (my first probe compared object identity and told me nothing): across
8 variants, `descendantSpec` with `reads:'he'` against `'she'` differs in **0 of 4096 pixels**
at 64x64. `faceFor` uses `reads` only to narrow the pool of hair cuts, and heredity copies the
ancestor's hair 90% of the time, so nothing it can see is sex. The wire is right and it is
shipped: the ask carries the sex, the shell answers a fresh key. What the shell's function does
with it is PORTRAIT's and DIRECTION's taste (what a face reads as), so the gate asserts the wire
and PRINTS the pixel result instead of asserting the defect, which would go red the day they
fix it. **The M and F buttons do change something real: the person's sex on paper and a name
that agrees with it. They do not yet change the face, and a control that promises more than it
does is the worst bug in this game (rule 14d).** Kept because two of his rulings ask for it
(32d, 39c), disclosed here, in the vote item, and routed.

**And a defect in my own last round.** [three names]'s record said the gate was "registered as
THREE NAMES". **It was never in the runner.** `gates/bohemia_gates.py` had no entry, so the suite
has never run it, the exact class of failure the six unregistered WORDS gates were. Found this
round while registering the new one; both are in the runner now and were run through it.

## DEFAULTS I DECIDED (draft, his to correct in the VOTE tab)
- **Act 3 unlocks when he holds a base in act 2**, mirroring act 2's. He ruled act 2's default;
  act 3's was not stated.
- **The offer closes when he flips away or presses OK**, and a closed person cannot be
  reshuffled, renamed or re-sexed (Battle Brothers does not let you reroll a man you hired).
- **Act 1 has no offer.** The face maker owns the start, and no round has given him a name field.

## THE GATE - gates/one_then_heirs_gate.js, registered as ONE THEN HEIRS
Headless (against the real modules, including the real home-base ledger): a new game is one
person; a locked act is refused; act 3 cannot skip act 2; unlock opens a window; leaving
closes it; a closed act refuses all three edits; reshuffle changes one act only; a typed name
is kept and is not in the face key; a reshuffle moves act 3's key because the third is born
from the second; the save round-trips, and garbage, a hand-edited skip and a bad name are
dropped; a base taken in act 1 unlocks act 2, one taken by somebody else or a ruin does not,
and a ledger with both replays in order. On the glass with a real finger and a real keyboard:
the boot state is one face with nothing else, painted with no re-call; unlocking grows a
second that paints itself; a finger hops in and the offer appears; the field is thumb-sized
and nothing in the shell covers it; F is tapped and the ask follows; the glyph reshuffles and
the face differs; a real keyboard types a name; OK keeps it and the row and glyph go; a typed
name leaves the face unchanged; a third face, a hop, and flipping away closes it; the city's
own snapshot carries the acts and restoring it brings the three faces back.

THE FLIP and THREE NAMES were **re-aimed, not loosened**: every leg they had still runs, after
the acts they need are unlocked through the same hook. PORTRAIT's blank first paint, named
for [the flip] in their record, is closed: a face that lands now repaints the strip.

## ROUTED
- **PORTRAIT / DIRECTION** - `descendantSpec` ignores the chosen sex (0 of 4096 pixels, 8 of 8).
  The gate leg prints the number; update it the day this is fixed.
- **FACTIONS / RUN** - call `BohemiaActs.unlock(2)` (or `ctActUnlock(2)`) the moment the first
  base is his; `unlockFromBases(rec.entries)` reads the real ledger.
- **UI / SOUNDS / DIRECTION** - rule 37j makes the flip a BIG transition (a filter, a cut, a
  sound, unlocked mid-act). Not built here. `flip()` returns `first` for it to key on.
- **WORDS / UI** - `slices/BOHEMIA_THE_THREE_BEFORE_ACT_ONE_9_28_26.html` is dead as built (naming
  all three before act 1). It loads `roster()`, which I left as all three so its gate stays
  green; retire it when you choose.
- **[heirs]** - the company inheriting is the next row and reads `visible()`/`bornOf`.

## PRE-PUSH PASS
ONE THEN HEIRS 97/0, THE FLIP 23/0, THREE NAMES 31/0, each also through the runner. INLINED-FRESH
3/0 (bohemia_acts.js re-synced verbatim). Canon rot is red on main too (11/2, two unrelated
citations, checked on a clean stash).
