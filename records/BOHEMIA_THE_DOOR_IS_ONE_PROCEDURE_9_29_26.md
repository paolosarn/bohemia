# THE DOOR IS ONE PROCEDURE (PLUMBER 9/29/26, row [one driver], round 1; rule 14(g))

Row (coordinator 9/23, "the fleet's most-asked row"): fold the door into one procedure in the one
driver (tools/bohemia_drive_the_demo.js), then make every gate that opens the alpha go through it;
merge with [real surface] (a gate that opens the alpha as a local file cannot see into the city
frame). KEPT CLAIMED, ROUND 1 OF SEVERAL (rule 6): the procedure is folded and held by a gate, two
checkers moved, and 288 still open the game on their own.

## THE ANSWER FIRST

- **292 checkers in the suite open the alpha or the demo in a browser. Before this round 2 used the
  one driver; 290 built their own browser and their own door, and 239 of those open the game as a
  local file,** which SOUNDS proved cannot see into the city frame (the frame is a different origin
  over file://; records/BOHEMIA_EVERY_GATE_THAT_OPENS_THE_ALPHA_AS_A_FILE_IS_BLIND_9_23_26.md).
- **Two of them were red on main at the door, not at their subject.** CITY DEEDS and CITY MEMORY
  (PEOPLE's) each opened the alpha as a file, clicked #front, then clicked the RUN tab; the tab strip
  had moved, so the click waited 30 s and threw. Neither had reached the city since.
- **Moved onto the driver this round, both reach the city again:** DEEDS 36 passed 7 failed,
  MEMORY 25 passed 9 failed. Before: 0 passed each. The reds left are the checkers finally looking,
  and they are PEOPLE's to read (one line on their board): news that does not travel inside its
  window, a hearsay row that reads "undefined", a weight table that filled up under a
  contents-are-Paolo's rule, 4 of 28 drafted lines that guess the player's gender, witnessing and
  recognition legs. Some of those legs may simply be out of date now that the walked city is dead
  (rules 38 to 40); that is theirs to decide per leg.
- **ONE DRIVER is in the suite** and holds the line: no new checker opens the game with its own
  browser. 288 are frozen on gates/one_driver_baseline.txt; the list may only shrink.

## THE DOOR WAS ALREADY ONE PROCEDURE; WHAT WAS MISSING WAS THE HOLD

The fold the row asked for had landed across earlier rounds: knock on a clock until the door is
behind us (RUN's trap 7 and UI's 90 s door clock, one loop now), confirm it with the same test
covered-controls uses (what the finger would hit at the frame's centre), land on RUN when the alpha
hides the city panel (SOUNDS' click), and publish doorIsBehindUs(). Read in the driver, not assumed.
What no round had built was the thing that stops the next lane writing a 291st door. That is ONE
DRIVER.

## TWO FIXES IN THE DRIVER

1. **A wait that is not a number is refused.** The driver reads boot, door, runtab, settle and world
   as `opts.x || default` and compares them to a clock. `runtab: true` therefore meant a wait of ONE
   millisecond: one try, and a pass only if the RUN box was already there. This lane's own
   map-density tool passed `runtab: true` for a round and got lucky. Now it throws, naming the value,
   the same way an unknown option already did. No other caller passed a non-number (checked).
2. **noWorker: true blocks the service worker** (UI's ask, 9/24: the worker answers requests itself,
   so a probe that throttles or logs the network measures the worker, not the wire). Off by default,
   because the player's phone has the worker. Booted both ways: the alpha in 40 s with the worker in
   control, the demo with noWorker in 147 s with no worker in control, 0 page errors each.

## THE GATE

gates/one_driver_gate.js, in the suite as ONE DRIVER, static, under a second:
- S1 the driver refuses `runtab: true` (a wait that is not a number) and `runTab` (an option it does
  not know), before any browser starts.
- L1 no NEW suite checker opens the game with its own browser; a checker that names the game but
  opens something else says so with the words "one-driver: not the game" in a comment.
- L2 a checker that has moved onto the driver is never still on the baseline.
- A NOTE names baseline lines that no longer open the game on their own, to lock the win in.

Mutation-checked three ways, each restored: a checker taken off the list (L1 red), a moved checker put
back on it (L2 red), the driver's wait check removed (S1 red). What it cannot see, stated: a checker
that opens the game under a name other than the two page files.

**My own mistake this round, named:** cleaning up after the third mutation I killed processes by
matching command text, and the pattern matched my own shell. The restores had already run (checked
file by file), nothing was left running, but it is the second time this lane has done it. Kill by
process id, never by pattern.

## ROUTED

- PEOPLE: CITY DEEDS and CITY MEMORY reach the city again; read each red leg (above).
- COMBAT: four of its checkers already use the driver (house board, lot is sixteen tiles, the person
  is 112, you can start it) and none is registered in the suite, so no pass ever runs them.

## [real surface] IS FOLDED IN

The coordinator's own words on this row: "Merge with [real surface]: same job, one row." Its ship
test (a checker gives the same answer over the web and through the driver) is now this row's: every
checker that leaves the baseline does so by going through the driver, which serves the game over
the web.

## NEXT ROUNDS

Move the baseline in batches, the red ones first (a checker red at the door is lying about its
subject), each batch run before and after so a changed answer is reported, not hidden.
