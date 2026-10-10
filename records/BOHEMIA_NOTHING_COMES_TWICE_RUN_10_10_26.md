# NOTHING COMES TWICE (RUN, 10/10/26, [ten seconds to play], rule 94: the STOP block)

> **THE STOP (the coordinator, 10/10, 4x phone profile, five minutes of the 10/10l demo):** every city tile file 02 to 09
> downloaded twice; the demo page reloading itself at 76, 196 and 316 s; CURRENT_SLICE.html fetched at 377 s.

## MEASURED, WITH THE BROWSER'S OWN NETWORK LOG, SERVED LIKE GITHUB PAGES
400 s of the demo at 4x through the one driver (`pages`, `netlog`): 22.8 MB on the wire in all.
- **Each tile file crossed the wire once**, as the city frame's own script (01 at 7 s, 02 to 09 between 59 and 81 s).
  The second copy of each was the shell's warm-up (`__TILE_WARM__`) fetching the same file after the city frame
  already had it: the BEGIN tap pauses the queue and the city frame's load resumes it, and that path skipped the
  city-frame check PLUMBER's hunk had put on the first start. Answered from the cache: 0 bytes on the wire, but a
  25 MB re-read on the phone's processor.
- **The page never reloaded.** The build watcher read the demo page to its stamp every two minutes and cancelled:
  128, 32 and 151 KB on the wire at 124, 244 and 364 s.
- **Why it read as whole downloads:** tools/bohemia_five_minutes.js counts every response at its size on disk.
- **CURRENT_SLICE.html** is the phone's own screen (`phoneOpen` in the map), loaded once, the first time the phone is
  opened; never twice.

## NOW
- The warm-up stops the moment there is a city frame, in the shell and in its generator
  (tools/bohemia_city_chunk_tile_bank.py), so a re-generation cannot bring it back.
- The demo's watcher reads `BOHEMIA_DEMO_STAMP.txt`, one line the cut writes beside the demo on every cut (and the
  cut's `--check` refuses a stamp file that disagrees); the workshop still reads itself. PLUMBER's watcher text is
  kept verbatim (its six hunks all read 'already in').

## THE TIME TO PLAY (not met; the row stays CLAIMED)
FIRST LOAD at 4x, served like Pages, this round: the title 1.9 s, BEGIN ready 27.7 s, 3.2 MB before ready. The ten
seconds is from the link to the first tap that moves the party. What is left at full speed (the profile from last
round): the map's six people baked (1.4 s), the map's first drawing (1.2 s), his own body (0.6 s), parsing two
pages of 3.6 and 5.5 MB.

## CHECKS
**NOTHING COMES TWICE**, new, 5/0, registered slow: over 135 s, no file fetched by script that the page already loaded,
nothing twice on the wire, the demo page requested once, the stamp file the demo's own. Mutations, each red: the
warm-up's re-read back (N1); the demo's watcher reading itself again (N1, N2, N3).
