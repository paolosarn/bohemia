# THE PHONE NEVER OPENS BLACK
UI lane (chat 11), 9/24/26. Row [phone black], claimed off the coordinator's 9/23b sweep,
which took it from my own record of 400c374 a round earlier.

## WHAT THE ROW ASKED FOR
"your own 400c374: the phone's own screen is black about three seconds the first time it
opens, anywhere (the frame is 'loading' at 1.5 s, complete at 3 s with 49,301 characters).
A phone that opens black is the 9/22b black rectangle in miniature. Preload it behind the
loading screen (the load already runs a hundred seconds) or draw the cracked glass and the
hour while it loads; never black."

(9/22b is Paolo tapping a door and getting a black rectangle for two minutes.)

## WHAT I MEASURED BEFORE TOUCHING ANYTHING
On a fresh cut, through the one driver, a real touch on the pocket phone, photographing
THE SLOT rather than asking the iframe how it feels:

    120 ms after the tap    0.05% of the slot's pixels above black
    400 ms                  1.03%
    800 ms and after        3.24%   (the phone's own screen, settled)

AND IDENTICAL AT 4x CPU THROTTLING, second run, same numbers. That is the useful part: the
wait is the 2.1 MB fetch and parse of the phone's page, NOT the processor. A fix that makes
it faster is a fix that stops holding on a slower phone, so the fix cannot be about speed.

## WHAT IS BUILT
THE PHONE WEARS ITS OWN FACE WHILE ITS PAGE IS COMING UP. Inside the slot, above the frame:
the hour it already knows, where he is standing, one line from a dead network, and THE SAME
FRACTURE the pocket phone wears -- cloned from #cityfeedglass at open time, so there is one
crack in this game and it cannot drift into two. It comes off when the phone's page has
PAINTED, never on a timer.

  slices/BOHEMIA_CITY_WORLD.html
    #phoneboot in the slot, #phoneslot.ready takes it away
    phoneBootFace()  fills the hour from clockStr() and clones the crack
    phoneBootDone()  waits for the frame's own two animation frames

ONE WRONG THING (the bible, rule 1): everything on that face is an ordinary lock screen,
and the clock is perfect while the carrier is gone. The camera does not help (rule 2): it
is the phone, at the size the phone is, never framed or pointed at. Diegetic or dead (rule
8): it is not a loading screen for the phone, it is the phone with nothing on it yet.

## WHY NOT THE ROW'S OTHER OPTION
Preloading the phone's page behind the loading screen costs 2.1 MB inside RUN's during-play
budget, which stands at 54.0 MB of 70 and 21 files of 30. That is a tenth of another lane's
headroom spent to shorten a screen that is no longer black. The face costs zero bytes and
holds on a phone whose page never arrives at all. Said here rather than left as a silent
choice; if the coordinator wants the preload too, it is a line and it is cheap.

## THREE THINGS I GOT WRONG FIRST, EACH FOUND BY LOOKING
1. *** A DOCUMENT THAT SAYS 'complete' HAS NOT NECESSARILY PAINTED. *** The first cut took
   the face off at readyState complete and MEASURED WORSE THAN THE FACE: 1.03% of the
   slot's pixels lit against the face's 2.23%, because the phone's page was parsed and not
   yet drawn. The fix was handing him a darker screen for a moment than the one it
   replaced. It waits for the phone's own next two frames now, which is the browser saying
   it painted rather than a timer saying it probably did.
2. *** A FUNCTION THAT ANSWERS FOR THE FUTURE. *** phoneBootDone() returned true the moment
   it scheduled those frames, so a caller reading it got "the phone is up" about a phone
   whose face was still on. It reports what is true now.
3. *** THE FACE SAID THE HOUR TWICE AND CALLED IT A PLACE. *** The bar's line is
   "SUBURB - DAY 1 - 06:00" and the first cut put the whole string under the clock. Cut at
   the first separator: SUBURB.

## WHAT I COULD NOT DO, SAID PLAINLY
I could not reproduce his three seconds on this box by holding the network back. A glob
route matched nothing on a url that plainly contains the name (held requests: 0), and with
a catch-all the page made NO request for the phone's page at all -- something between the
page and the probe, the service worker this game registers, answers it. The honest counts
are the ones above, taken at 120 ms and 400 ms, plus one later run where the frame was
still 'loading' at 1.5 s and complete before 3 s, which is his window.
So the wait is held open WHERE IT MATTERS instead: the game's own "is the page in yet"
answer is pinned to false, which is exactly what a phone that has not finished loading
looks like, and the glass is photographed through it.

## THE GATE
gates/the_phone_never_opens_black_gate.js. It holds a property, not a duration:
AT NO MOMENT BETWEEN THE TOUCH AND THE PHONE BEING UP IS THE GLASS BLACK.
It photographs the slot as fast as the browser will take pictures and scores the WORST
frame, because a handful of chosen moments walks straight past a dark one. It reads the
pixels itself: the PNG is inflated with node's own zlib and the filters undone, thirty
lines and no dependency the repo does not already carry.

  THE SAMPLER WAS THE FIRST THING THAT HAD TO BE FIXED. Measured, four shots each way:
    locator.screenshot          2,272 ms a picture   -> ONE photograph in 2.6 s
    page.screenshot with a clip   211 ms idle, about a second while something loads
    the browser's own capture     fast enough to call this a sample
  The first cut of this gate took a single picture and reported it as a window.

SIX MUTATIONS, EACH PROVED AND EACH RESTORED (14 ok / 0 failed on the real tree):
  take the face away entirely, which is the build he complained about
        -> 2 red, and the never-black leg reads 0.06% -- HIS BLACK, back, measured
  put the face UNDER the frame instead of over it            -> 1 red
  take the face off on a TIMER instead of when the page has painted
        -> 3 red, and again 0.06% on the glass: a timer puts the black straight back
  never take it off at all (the two animation frames removed) -> 2 red, the face sticks
  draw a second crack by hand instead of cloning the pocket phone's -> 2 red
  let the face invent its own hour instead of reading the game clock -> 1 red (23:59)

AND ONE OF THOSE SIX IS CARRIED BY THE SOURCE ALONE, WHICH IS WORTH SAYING. Putting the
face UNDER the frame reds the source leg and NOT the glass: an iframe that has not painted
is see-through, so the face still reads through it and the pixels stay lit. The z-index is
held by reading the file, not by the photograph, and that is a weaker hold than the others.
I would rather write that down than let six green ticks imply six independent catches.

## AND THEN HE VOTED, MID-ROUND, AND THE OTHER HALF OF THIS LANE'S WEEK CAME OUT
While this was being built, his second votes landed on main. On
ui-the-phone-in-your-pocket-9-23, the thing I shipped a round ago, thumb DOWN:

  "YOU ONLY SEE THE PHONE WHEN ITS UR ZOOMED OUT TO THE WHOLE CITY VIEW not when its the
   human close shit bro. And the phone should look like a cracked iphone bro"

NOTES ARE RULINGS, so it came out the same round it was read, before this push:
  - no phone is drawn on the walked street; the phone is a CITY-VIEW object again
  - the `.street` CSS is deleted rather than left dead, and the tick is back to `isCity`
  - gates/the_bar_fits_his_glass_gate.js HELD THE OPPOSITE and its legs were turned round
    with the ruling: it now holds that the street is CLEAR, and that no phone-shaped button
    crept into the bar to stand in for what was removed. 22 ok / 0 failed.
  - graveyard/POSTMORTEM_THE_PHONE_IN_YOUR_POCKET_9_24_26.txt
THIS ROW IS UNAFFECTED AND THAT IS NOT A CONVENIENCE: the black he saw was the OPEN phone,
which he still opens, in the city view. The face was rebuilt and re-photographed in the
city view and the gate crosses the seam before it asks anything.
WHAT REMAINS OF HIS RULING, and it is the bigger half: the drawn phone has to become A
CRACKED IPHONE. That is row [phone city only], claimed, not done here.

## THE ANALOG HORROR LINE (rule 9 of the law, every chat, every round)
A phone with nothing on it but the time, behind a crack nobody mentions, looking for a
network that has not existed for years. Nothing moves. It is the most ordinary screen in
the world and the only wrong thing about it is that it still keeps perfect time.
