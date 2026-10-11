# EYES AND EARS -- [eyes: ticker overlap] -- ROUND ONE: THE PREMISE CHECK CLOSES IT
### 10/11/26 -- session eyes-5vql33

Row: found 10/4 inside the fight screen -- a band of flavour text ("THE MARQUEE", "THE WAY OUT",
"THE CHOIR", "THE ROAD") drawing up to four lines stacked unreadable at the top of the board, on
more than one seed. The row's own text named the likely cause: "the text is base64-embedded in
the alpha's COMBAT_B64 blob." Claimed last round with a premise flag: that old sealed fight was
retired from the demo this same session ([one fight] SHIPPED 10/9 aaf6ee2, "the demo never builds
the old fight"), so round one checks whether the bug is still real before chasing it.

## THE OLD BUG'S OWN SOURCE, FOUND

The flavour-text strings ("THE MARQUEE", "THE ROAD", etc.) are real, in
engine/bohemia_ladder_data.js -- they are the sixty mini-bosses' own ladder names (CLAUDE.md: "60
mini bosses, each handing you a VERB"), drawn as a board title. Grepped for the reach method
tools/bohemia_eyes_fight_floor.js (this lane's own tool, the one that produced round three's
original fight_5.png/fight_13.png screenshots) actually used: `BohemiaArena.set/setupCombat`.
BohemiaArena is NOT defined as plaintext anywhere in the current repo's HTML -- it only exists
base64-encoded inside COMBAT_B64 in the alpha and the demo, decoded at runtime. CONFIRMED: this
lane's own original bug report was always reaching the OLD sealed fight, never the rebuilt one,
exactly as the row's own text guessed and this round's premise flag suspected.

## THE CURRENT REBUILT FIGHT, CHECKED LIVE, NOT GUESSED FROM SOURCE ALONE

Source first: grepped slices/BOHEMIA_FIGHT.html for "ladder", "BohemiaArena" and "setupCombat" --
zero matches, a different engine with no path to the old ticker code at all. SOURCE ABSENCE IS
NOT PROOF BY ITSELF, so this round reproduced it on the glass: built
tools/bohemia_eyes_ticker_overlap_check_10_11_26.js, reusing DIRECTION's own proven open pattern
(tools/bohemia_direction_fight_verdict_23.js's `D.open({bare:true, file:'BOHEMIA_FIGHT.html',
arm:"window.FIGHT_OPTS=..."})`) to open the real rebuilt fight on three different boards (suburb,
freeway, strip), screenshot the top strip where the old bug drew, and sweep every DOM element in
the top 100px for any text node. ALL THREE BOARDS: the only text at the top is "R1" (the round
counter) and the "AUTO" button; the real screenshot (records/eyes_ticker_overlap/suburb_top.png)
shows the roster face strip and nothing else -- no flavour-text band, no overlapping lines,
anywhere.

## THE VERDICT

THE PREMISE WAS STALE AND THIS ROUND CONFIRMS IT, ON THE GLASS, NOT JUST FROM A GREP: the bug
lived exclusively in the old sealed BohemiaArena/COMBAT_B64 fight, retired from the demo's real
play path before this round began. The rebuilt fight a player actually reaches
(slices/BOHEMIA_FIGHT.html) has no equivalent ticker, no board-name band, and no overlap, on every
board checked. THIS ROW CLOSES ON ROUND ONE: there is no live bug left to measure a round two
against, and continuing to chase a defect that cannot be reproduced on the current demo would be
the exact thing rule 14g warns against ("never report a break you have not reproduced on the
glass") run in reverse.

## ROUTED

Nothing to route -- the only code carrying this defect (the old sealed fight's own BohemiaArena
ticker) is unreachable from the demo per [one fight]'s own ship note; no owner needs to act on
dead code nobody can see.

## SHIP TEST FOR THIS ROUND

Found the old bug's real source (engine/bohemia_ladder_data.js's board names, reached only through
the now-retired BohemiaArena/COMBAT_B64 path); confirmed the current rebuilt fight has no such
code by source AND by a real screenshot on three boards, never asserted from the grep alone. [eyes:
ticker overlap] IS ANSWERED: the bug is dead on the surface a player reaches.
