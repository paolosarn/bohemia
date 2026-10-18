# "DIDN'T LOAD THE DISPLAY" -- INVESTIGATED, NOT REPRODUCED. PORTRAIT, 10/10/26.

His bugs beat the queue (rule 8). The 10/10 export's verdict on
`portrait-hairstyles-match-10-9` ("Didnt load the display", a DOWN vote, 10/9)
is the ONLY one of this lane's three DOWN votes this month that names a
literal bug rather than a taste call ("dogshit", "needs so much work I can't
even judge it"), so it is the one checked first, before any other work this
round.

## WHAT WAS CHECKED

1. **The file itself.** `slices/vote/PORTRAIT_HAIRSTYLES_MATCH.html` and its
   `.png` both exist on disk, both committed. Loaded standalone via
   Playwright: zero page errors, zero failed requests, the image's
   `naturalWidth` is 684 (fully decoded).
2. **The real nested chain.** The registry's own item (`show.how:"page"`,
   `src:"vote/PORTRAIT_HAIRSTYLES_MATCH.html"`) is opened the same way the
   VOTE tab actually opens it: `BOHEMIA_VOTE_TAB.html`'s `build()` creates a
   plain `<iframe src="...">`, no sandbox attribute. Served over a real local
   HTTP server (not `file://`, which blocks the registry's own `fetch()` and
   would falsely read as broken on its own), with the item's verdict removed
   so it still shows in the live WAITING queue exactly as it did on 10/9: the
   row was found, `LOOK AT IT` was clicked, the nested iframe loaded, and
   inside it the image reports `complete:true`, `naturalWidth:684`,
   `readyState:"complete"`. A screenshot of the opened stage shows the text
   and the before/after sheet both rendered cleanly.
3. **The publish path.** `_config.yml` keeps `slices/` by default (nothing
   excludes it, nothing excludes `.png`), so neither of the two builders that
   race to publish this site (records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md)
   would drop this file.

## RESULT

**Not reproducible in the current code.** Every real step of the chain --
the page, the image, the iframe, the fetch, the publish config -- works.

## THE LIKELY CAUSE, NAMED HONESTLY RATHER THAN GUESSED AWAY

The file was committed at 22:59 on 10/9; his vote is timestamped the same
day. This repo has a documented, previously-measured failure mode with
exactly this symptom: two builders publish the site and race
(records/BOHEMIA_TWO_DEPLOYS_RACE_9_22_26.md, "THE LIST DID NOT LOAD"), and
whichever finishes last decides what is actually live -- a stale deploy can
serve a build from before a file existed while every gate and every commit
reads green. The repo's own fix for that class of bug (forcing the registry
JSON into both builders, and eventually the Settings -> Pages -> Source flip)
was built for the registry specifically; it was never proven for an
individual sheet like this one. This is the most honest explanation
available: a timing issue on the day he looked, not a defect in this file
today.

## NOT CLAIMED

This is not written up as "fixed" -- nothing was broken to fix. It is
written up as checked, because an unexplained bug report is worse than a
checked one, and because the next time a DOWN vote says a sheet "didn't
load," this record is the method to re-run.
