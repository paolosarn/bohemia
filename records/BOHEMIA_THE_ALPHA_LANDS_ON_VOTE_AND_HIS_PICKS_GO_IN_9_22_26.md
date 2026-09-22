# BOHEMIA -- THE ALPHA LANDS ON VOTE, AND HIS PICKS GO IN (UI lane 11, 9/22/26)
# Rows [alpha opens on vote] and [the picks].

## 1. HE SAID IT TWICE

Paolo 9/20 (rule 15g) and again 9/22: "in the alpha why does it open the run first thing, I
told you to not have that happen."
(records/BOHEMIA_PAOLO_THE_ALPHA_STILL_OPENS_ON_RUN_9_22_26.md)

**Built.** After BEGIN the alpha shows the VOTE tab, with RUN one tap away. The demo is
untouched by construction: the cutter strips every tab but RUN, so there is no vote tab to
find there and the line does nothing, which is exactly what the demo wants (rule 15a).

**It clicks the tab; it does not call `showTabPanel`.** That distinction is already written
down in the alpha and it is real: `showTabPanel` lights the panel and nothing else, and the
VOTE panel's iframe is a lazy `data-src` that only the tab's own click handler promotes.
`showTabPanel('vote')` would land him on an empty box. The mutation that swaps one for the
other turns two legs red, which is the proof.

**It does not undo the thing that made the alpha fast.** `__loadStart` still clicks RUN
behind the splash, because that is what builds the city while he reads the door. This only
moves the surface afterwards.

## 2. THE GATE WAS TAPPING A DOOR THAT WAS NOT A DOOR YET

The landing leg came back `tab=run, panel=p-city` about a build that lands on vote
correctly. I measured the page directly before believing it: tap after `__LOAD_READY` and
the path is `run/p-city -> vote/p-vote`, and it stays there at +200 ms, +1 s and +3 s.

The gate was tapping the splash **immediately**, and the splash handler opens with
`if(!window.__LOAD_READY) return;` (rule 18a: nothing is tappable until it is loaded). So
the gate's tap was A NO-OP and the game opened later by another route. **A probe that
presses a button before the button exists is measuring its own impatience.** It waits for
readiness now, which is also what a player does, because the screen says WAIT until then.

`gates/vote_tab_gate.js` 30/0, the landing leg added as the row asked. Two mutations proved,
each restored: take the landing out (2 red -- the alpha opens on the run again, his exact
complaint) and land on it with `showTabPanel` instead of the tab (2 red -- the empty box).

## 3. HIS PICK: LOADS B, BUILT, NO SECOND VOTE

Rule 28: "never worry about the UI of the alpha amendments ever again"; the picks stand and
`UI [the picks]` builds them into the demo without asking again. His word on the loading
screen was **"loads B, keep going, more analog horror."**

B is the option where you are not looking at a machine, you are INSIDE one: no case, no
bezel, the glass edge to edge, the corners going dark because a tube is curved. So the case
is gone and the unit IS the screen. The name burns in the glass instead of being punched
into metal that no longer exists. Everything the bar cannot lie about is unchanged.

## 4. THREE DEFECTS IN MY OWN FILE, ALL FOUND BY RENDERING IT

- **No `box-sizing` anywhere in the module.** The case had been hiding it; with the case
  gone, the padding ran past the right edge of the phone and cut the percentage in half.
- **The glass was a void.** At first it filled the screen with almost nothing in it. It is
  capped now and the log fills the lower part of it, bottom-anchored like a real terminal.
- **THE NAME RULE WAS STILL THE PUNCHED-METAL ONE, AND I HAD ALREADY "FIXED" IT ONCE.** A
  dark letter with a lit lower lip is right when the name is cut into a case. On lit glass
  it is a near-invisible smudge, which is what it has been in every render since the first
  cut. An earlier edit of mine replaced a string that **does not exist in this file** and I
  never checked that it matched, so the fix silently did nothing, twice. This time the
  replacement asserts on its own match and the render was checked afterwards.

That is the same lesson as section 2 in a different costume: **an edit that cannot bite and
a probe that cannot see both look exactly like success.**

`gates/the_loading_screen_gate.js` 29/0 on the rebuilt screen: the bar still cannot lie, the
words are still wired to real stages, and the slow line still prints the real count.

## 5. WHAT I DID NOT TOUCH, AND WHY

Rule 25 ("an interactive inside of an interactive", "7 options here, wtf") and rule 29
("no more cards with quest, just make an actual quest") both land on this lane. This round
registered **no new option sheet at all**: rule 28 says the alpha's UI is frozen and the
picks stand, so offering more pictures of things he has already decided is exactly the
behaviour he objected to. The cook is the real screen, changed to his pick.

`[inner votes]` (two or three options maximum, votes cast inside a page landing in COPY ALL)
is still open and is the next row.
