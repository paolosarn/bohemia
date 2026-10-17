# THE ONE STOPWATCH: THE DEMO'S DOOR IS 9.2 SECONDS ON HIS PHONE'S PROFILE, AND THAT IS THE ONLY LOAD NUMBER NOW
PLUMBER, 10/17/26, VAMILY row [the one stopwatch]. Rule 94's poka-yoke; rule 90 round 6 (the release line
opens with TIME TO PLAY). The coordinator's note 10/16: "the door read 50.9, 29.9, 31.7, 20.0 on four runs of
the same instrument across two builds; one run is not a number."

## WHY
Four lanes quoted four load numbers for one demo: 85 s (this lane, 10/9, served like Pages, before the cuts),
67 s (after four load hunks), 48.4 s (EYES' arm at 4x), 22 s (RUN, at phone speed). Every one was true of a
different instrument, build or box, and he could not tell which was the demo. A number nobody can place is noise.

## THE LINE (records/target/BOHEMIA_THE_ONE_STOPWATCH.json, `line`)
    THE DEMO (DEMO - BUILD 10/13b - THE MAP PEOPLE COME BAKED, demo 6bc210fb): title 1.5 s, the door (NEW GAME
    ready) 9.2 s on the 4x phone profile, median of 5 (9.1 to 9.3); 3.4 MB before the door, 25.3 MB in 12 files
    in the 20 s after it.

Five readings, one instrument (tools/bohemia_first_load.js: a fresh browser, cold cache, no service worker,
served like GitHub Pages, nobody touching the glass), the 4x throttled phone profile, the COMMITTED demo:

    title (ms)   door (ms)   MB before the door   MB in the 20 s after   files after
       1,490       9,190           3.4                  25.3                 12
       1,626       9,093           3.4                  25.3                 12
       1,382       9,182           9.0                  19.8                 11
       1,539       9,272           9.0                  19.8                 10
       1,457       9,157           3.4                  25.3                 12

Nothing downloaded twice, no page errors, in any reading. The door is steady to a tenth of a second across five
cold opens. One 5.6 MB file crosses the door line on either side run to run (it is the same 30 MB in 30 s
either way), which is why the line carries the median and the spread, not one run.

## HOW IT IS KEPT TRUE
    node tools/bohemia_one_stopwatch.js 5        about three minutes; writes the JSON and prints the line

The JSON carries the demo's build stamp and the sha1 of slices/BOHEMIA_DEMO.html. RUN runs the stopwatch in the
same commit as a cut; a re-cut demo with last cut's number is STALE and the gate says so.

## THE GATE: gates/one_stopwatch_gate.js, in the suite as THE ONE STOPWATCH. 5/0.
  W1 three or more readings, a median, the demo's stamp and hash.
  W2 THE NUMBER IS OF THIS DEMO: the hash in the file is the committed demo's.
  W3 THE SPREAD IS A SPREAD: high within 60% of low, or one reading was broken.
  W4 NO OTHER NUMBER: the DEPLOY LINE on the front page, the live cue rows of the calling script, the first
     block of the handoff, and every commit on main since the stopwatch was taken quote no door or title time
     but the stopwatch's (title within 1.0 s, door within 20%). History older than the stopwatch is not held;
     this is a fence forward. The first cut of this leg held three history lines and a draw time that shared a
     sentence with the word door; the load word now has to sit within 45 characters of the number, and the
     calling script's LANDED rows and reports are history.
  S1 "the door at 85 s" is refused; the stopwatch's own line passes; a BEGIN or walk number is not this
     stopwatch's and is not held; a wrong title time is refused.

## WHAT THE NUMBER IS NOT
It is the door: the title on screen and NEW GAME live. It is not TIME TO PLAY (the first tap that moves the
party, RUN [ten seconds to play], measured after the door picks and BEGIN), and it is not the first-minute
freeze (RUN [the long freeze], the five minutes). Those keep their own instruments; this gate does not hold a
BEGIN, walk or stall number. The release line's first line wants play under ten seconds; the door is 9.2 of them.

## THE INSTRUMENT GREW ONE KNOB
tools/bohemia_first_load.js readOnce takes `linger` (ms): it keeps the page open after the door so what loads
behind it is on the net log, and returns filesBeforeReady and filesAll. Without it a reading stopped the moment
NEW GAME went live and "what loads after" read zero. FIRST LOAD's own legs are untouched.
