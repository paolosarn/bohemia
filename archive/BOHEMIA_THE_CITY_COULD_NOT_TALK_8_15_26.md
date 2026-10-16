# THE CITY COULD NOT TALK TO THE SHELL (8/15/26, RUN lane)

## THE ONE-LINE VERSION

The city's autosave has never worked through the alpha, not once, and the game's
own save panel has been telling the player it does.

## HOW IT WAS FOUND

Not by looking for it. The demo gate (board row 9) was built to play the whole
day end to end on the surface Paolo taps, and on its very first run it went red
on "THE DAY SURVIVED THE TAB". I assumed my gate had a race. It did have one, and
underneath it was this.

## THE MEASUREMENT, TAKEN BEFORE ANYTHING WAS CHANGED

Two postMessages into the real alpha in a real browser. Identical payloads. The
only difference is a `.type` field:

    postMessage({bohemiaCityState:{...day:42}})            ->  CITYSAVE 0 bytes
    postMessage({type:'X', bohemiaCityState:{...day:42}})  ->  CITYSAVE 135 bytes,
                                                               day 42 reads back

The city never sends a `.type`.

## THE CAUSE, ONE LINE

`ALPHA:7105`:

    function combatMsgIn(d){
      if(!d||!d.type)return false;      // everything the city sends dies here

**Seven** handlers live inside that function, and every one of them is keyed on a
`bohemia*` property with no `.type` at all:

| handler | what was dead |
|---|---|
| `bohemiaCityState` | **THE AUTOSAVE** |
| `bohemiaCitySfx` | the city's sounds crossing to the audio bus |
| `bohemiaCityMusic` | the city music toggle |
| `bohemiaCitySaveQuery` | the save panel's own status line |
| `bohemiaCitySaveExport` | EXPORT SAVE |
| `bohemiaCitySaveImport` | IMPORT SAVE |
| `bohemiaPrefabApproved` | approved prefabs reaching the world |

## WHAT IT COST, AND SOME OF IT IS MINE TO OWN

1. **Both save paths were dead, including the one built for his phone.** The
   debounced `reportState()` and the `flushState()` emergency path (pagehide /
   freeze / blur / visibilitychange, written 8/11 precisely so a phone being
   reaped by Safari does not lose the run) both posted into a function that
   returned false on its second line.

2. **The game said otherwise, on the surface he taps.** The city's save panel
   reads *"Saved to this device. Autosaves survive a reload."*

3. **MY OWN RECORDS REPEAT THE CLAIM.** THE DAY PAYS (8/12) and THE TRADING HUB
   (8/14) both state that the purse and the market "ride the save", and both
   gates proved it — **on the city page opened directly**, where the city is the
   top document and there is no shell to post to. On the alpha, where he plays,
   the message went nowhere. That is VERIFY ON THE REAL SURFACE (7/18) in one
   sentence: a side-door probe is a lie. My gates were one frame short of the
   truth and I did not notice because they were green.

4. **It silently disabled two other lanes' work.** The SOUND lane's phone buzz
   crossing to the audio bus, and the prefab bridge. Both come back with this
   fix. Neither lane's files were edited.

## THE FIX IS DERIVED, NOT A LIST

Adding `bohemiaCityState` to the guard would have fixed one of seven and left the
trap armed for the eighth. The guard's real job is to cheaply ignore
postMessages from unrelated frames and extensions, and every handler in the
function answers to either a `.type` or a `bohemia*` key — so that is now exactly
what it tests. A handler added tomorrow works with no further change.

The gate also checks the other half, because a fix that accepts everything is not
a fix: an unrelated postMessage is still ignored.

## THE SECOND BUG, ALSO MINE, FOUND IN THE SAME PASS

`reportState()` and `flushState()` each built their own copy of the state object.
`purse` was added to one on 8/12 and `market` on 8/14, and neither ever landed in
the other. So the emergency path — **the phone path** — restored the right day
and the right quest with an **empty purse** and a valley whose stocks snapped
back to base, resetting every price in the market.

A save that restores four fields out of six is not a partial save, it is a lie,
and the 800ms debounce hid it everywhere except the surface he demos on.

Fixed at the root: there is now **one** `citySnapshot()` and both callers use it,
so a field cannot be added to one path and not the other. Adding two fields to
the copy would have left the same trap for the next lane.

## GATES

- **`gates/city_bridge_gate.js`** (17) — scrapes the handler list **out of the
  alpha itself** rather than typing it here, posts every one untyped, proves the
  save, the sound and the prefab bridge really work, and proves junk is still
  ignored.
- **`gates/demo_gate.js`** (24) — reloads the whole alpha mid-demo and asserts
  the day, the purse and the valley's stocks all came back.

## THE PATTERN, NOW EIGHT FOR EIGHT THIS WEEK

Every finding this lane has made in eight days is the same shape: **a thing that
was finished, and a surface where it was not reachable.** The phone behind a dev
tab. The third zoom band behind a note. The feed-offer channel skipped. Faction
standing wired half way. `bohemia_payday.js` exported and called zero times. Four
modules outside the sync sweep. A ruling read once and never read back. And now a
bridge that carried nothing.

The gates were green every single time.

---

# PART TWO: THE CITY WAS NEVER INTRODUCED TO ITS OWN SAVE (same day)

Fixing the bridge was not enough, and the demo gate said so on the next run.

## THE MEASUREMENT

Play a real day on the real alpha, then reload:

    CITYSAVE before reload : 2755 bytes, day 2, purse yes, market yes
    CITYSAVE after  reload : day 2, purse yes, market yes        (the save is FINE)
    the world came back as : day 1, purse 0, market null
    T.day after that boot  : 1        <- applyRestore was NEVER CALLED
    applyRestore(that exact payload), by hand a moment later:
                             returns true, day 2, purse 499.75, water 702

The save was perfect. The restore function was perfect. They were never
introduced.

## THE CAUSE IS THE HANDOFF, NOT A LINE

The shell **guessed** when the city was ready:

    fr.addEventListener('load', () => { ...
      setTimeout(() => { ...postMessage({bohemiaCityRestore: sv.data})... }, 320); });

One `setTimeout`, fired once, at a hand-picked moment, with no acknowledgement
and no retry. The city is ~1.6 MB of script that grows every day. When 320ms
after `load` falls on the wrong side of readiness — and after a played day it
reproducibly does — the message lands in a document that cannot act on it, and
nothing anywhere says so.

And the boot made the matching mistake from the other side:

    setTimeout(function(){ if(!DAY_RESTORED) showWake(); else updQline(); }, 60);

**Sixty milliseconds** to decide "is this a new game?" — so a returning player got
a DAY 1 wake card thrown over their own run unless the restore beat 60ms.

## THE FIX IS THE IDIOM THE FILE ALREADY USED

The city already asks the shell for things when *it* is ready
(`BOHEMIA_CITY_NEED_PLAYER`, CITY_WORLD:18992). The save now works the same way,
because the city is the only party that knows when the city is ready:

    city  -> shell : {bohemiaCityNeedRestore:1}
    shell -> city  : {bohemiaCityRestore:<data>}  or  {bohemiaCityRestoreNone:1}

"No save" is an answer too — that is the thing the 60ms timer had to guess about.
The old 320ms push is left in place: `applyRestore` is a pure apply, so if it
wins the race the handshake just finds the day already restored.

Proven three runs out of three, because a race proved once is not proven.

## AND THE FLEET-WIDE BLOCKER ART FLAGGED

`run_gate.js` (126 integration assertions, the fleet's only end-to-end proof that
character + valley + districts + loop work together) was **crashing on main**, so
every lane's full-suite run was red. ART routed it here. Two causes, both found by
measuring rather than reading:

1. the cold open overlay now sits over the run panel from the first frame — the
   gate dismisses it by tapping the same SKIP a player taps;
2. underneath that, `#runFrame` came back **390x150**, so the D-pad sat outside
   the iframe's rectangle and every click mapped to a point the parent owned.
   Playwright reported `<div id=app> intercepts pointer events` and died on a 30s
   timeout, thirty seconds and one wrong surface away from its cause. The panel is
   `display:none` in normal play, so nothing in the build ever gives it a size.

**RUN GATE: 126 passed, 0 failed.**
