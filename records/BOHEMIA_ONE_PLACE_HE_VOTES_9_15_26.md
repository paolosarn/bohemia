# ONE PLACE HE VOTES, AND A VOTE MAKES THE THING LEAVE
UI lane (chat 11), 9/15/26. Board row [vote tab]. Law:
laws/BOHEMIA_ADDENDUM_ONE_VOTE_TAB_AND_THE_PORTRAIT_CHAT_9_14_26.md (Paolo 9/14, LOCKED,
rule 15). Gate: gates/vote_tab_gate.js -- 27 legs.

## THE RULING
"We need one central tab in the fucking demo where everything from sounds to portrait to
hair to everything that is new, where I vote on it... after I vote on something it needs to
stop presenting itself like I didn't just vote on it."

## WHAT WAS THERE BEFORE
Eight judge pages, one per lane, each built when it was "one or two things". The alpha's
VOTE tab pointed at slices/BOHEMIA_VOTE_CURRENT.html: 6.4 MB of base64 pictures baked into
one file at the moment one lane drew them. That page cannot consume a vote, because the
list it shows IS the file. A rebuild, a reload, a new phone: the same batch again.

## WHAT SHIPPED
Three pieces, and the split matters more than any of them.

1. THE REGISTRY -- records/target/BOHEMIA_VOTE_REGISTRY.json. ONE file. Every lane APPENDS
   one object per candidate (id, kind, lane, sha, made, title, why, show) and READS verdicts
   back out of verdicts[]. Nobody draws a vote page again.
   It is in records/target/ because _config.yml + .github/workflows/pages.yml publish exactly
   three folders (slices/, engine/, records/target/) and this one has to be reachable from a
   page in slices/. Putting it anywhere else 404s in production while working on disk, which
   is the one way that config bites and it is written at the top of the config for that reason.

2. THE TAB -- slices/BOHEMIA_VOTE_TAB.html. Fetches the registry at open, draws one row per
   unjudged candidate, NEWEST FIRST (the registry is appended to, so the end of the file is
   the newest thing anybody made). Same three controls on every row whatever the kind: up,
   down, a comment. Sun by default and night on a button. Export as .txt, never .json. The
   comment box at the bottom. Every control 44 at 390x844.

3. THE DOOR -- the gear. NOT the tab bar. tools/bohemia_cut_the_demo.js deletes every tab
   except RUN, so a VOTE tab alone reaches him in the workshop and never in the thing he
   plays. SETTINGS grew a row, NEW / VOTE ON WHAT IS NEW, which opens the queue full screen
   and closes the settings card behind it (one subject, one door -- the same complaint he
   made about PRETTY MAP and DROP IN, and about OUTFIT and STANDING). The VOTE tab still
   exists in the alpha and now points at the same page, so the workshop and the demo are
   looking at one surface.

## A VOTE CONSUMES, AND IT TAKES TWO MEMORIES
The phone remembers instantly (localStorage), so the row leaves the frame he taps in. The
registry remembers forever, so a cleared cache, a new phone or a rebuild cannot resurrect a
judged thing. An item is consumed if it is in EITHER. One memory would not have been enough:
localStorage alone dies with the cache, and the registry alone cannot round-trip inside a
session because a browser cannot write a repo file.

THE GATE'S STRONGEST LEG IS THE REGISTRY ONE. It serves a registry with a verdict planted on
a candidate a brand new browser profile has never seen, and proves that candidate is not
drawn. That is his complaint, measured.

## WHAT I PICKED WITHOUT HIM, AND WHY
- SUN IS THE DEFAULT. Every other judge surface in this repo opens dark and makes him find
  the SUN button. He judges outside.
- NOTHING HEAVY LOADS UNTIL HE TAPS LOOK AT IT. Eight candidates today, one of them a whole
  page; building eight iframes at open costs him the open. The trade (two taps to judge one
  thing) is the subject of this round's option sheet.
- ONE STEP OF UNDO, in plain words: PUT THE LAST ONE BACK. A vote is permanent by design and
  a mis-tap on a 44px thumb is a real thing. It only reaches this phone's memory; nothing
  from the browser ever rewrites the registry.
- A REDO CARRIES HIS OWN WORDS. An item with redoOf renders "REDONE. You killed <id> because:
  <his words>", so he is never asked the same question twice without being told it is the
  same question.

## WHAT I GOT WRONG ON THE WAY
The door leg failed three times and each failure was me measuring the wrong thing.
1. Waited for the gear. The gear hides on the splash on purpose.
2. Tapped the element carrying the words TAP TO ENTER. It reports a 0x0 box the whole time
   it is up, so the tap landed at (0,0). A first probe passed by ACCIDENT for exactly this
   reason: its click at (0,0) still hit the full-screen splash.
3. Skipped the tap when the box came back 0x0, and then sat on the splash for twenty
   seconds concluding the card never appears.
   The splash IS the button. The sweep now taps the middle of the screen, which is what a
   thumb does, then answers the cold-open card (the gear also hides while that card is up,
   because it once covered the first word of the card's second line).
   Same lesson this lane has now written four times: a clean answer from the wrong oracle
   looks exactly like a fact.

## WHAT IS NOT DONE
- THE COMMITTED DEMO lags, and that one is RUN's under rule 14a. THE DEPLOYED ONE DOES NOT:
  .github/workflows/pages.yml runs `node tools/bohemia_cut_the_demo.js` as a build step before
  it assembles the site, so the demo at the one link is cut from the alpha on every push and
  already carries the gear door. Two files, both true. The gate runs the real cutter into a
  throwaway tree and proves the door survives that cut.
- Every other lane's [into the vote tab] row can land now: append to items[], read verdicts[].
- The registry is seeded with this lane's eight unjudged option sheets. It is empty of every
  other lane's work until they register.
