# FIXES ITEM 9: THE FEED HAS A MAX LENGTH, AND A POST IS SEEN WHOLE (11/3/26)

BUILD 11/3zzzj THE WHOLE POST, ONE NAME EACH. Rule 350, ask line 360. Paolo 11/3: 'the feed is broken right now... the tweets are too fat for it... they're like loading half the time'.
The coordinator's measures: records/BOHEMIA_PAOLO_THE_FEED_HAS_A_MAX_LENGTH_11_3_26.md. Tested on the upright phone (390 x 844, touch,
3x) with tools/bohemia_eyes_live_session.js.

(a)-(c) THE STRIP IS THE COORDINATOR'S (d3f1cb29, slices/bohemia_phone.js fitStrip: one post fills the strip, its type fitted from 9 px
    down to 6 px, the biggest at which every word fits; refitted when the strip's height changes). This round built its own version
    first (6 px on 7 px lines and a step-up for the three-jobs strip) and dropped it on the coordinator's word, untouched. MEASURED before
    (main's phone before d3f1cb29, the post at 6.5 px in the old two-post half): a 120-letter post's last word 30 px under the box.
    Not built: rule 350(4)'s step-up in the three-jobs strip (20 px); there a 120-letter post is cut (the gate prints it, a note).
(d) THE MAX: 120 letters with every fill at its longest real value: the company name at the new-company door's maxlength (22), the
    longest town the map seats (Anarchists, 10), the feed's longest place (the industrial park, 19) and road (the Spaghetti Bowl, 18),
    the longest faction plural (the keeper's machines, 21), the longest man (the names engine's longest first name and surname, 21),
    a price at 999 batteries. At those values 87 lines ran over 120 (more than the 34 measured with THE NIGHT SHIFT and a short
    town), English and Spanglish; all 82 different lines rewritten tighter in the same voice at the source (tools/words_feed/*.py,
    then the bank and the game's file rebuilt by their own tools), meaning kept, draft:true, never cut with dots. No Spanglish added
    (rule 355): twins only shortened, 217 different twins before and after. Handles: 40 over 16 (every act's), each shortened and
    still who they are (blues_assembly, doloresy_eggs, kinghobo_rarely, network_official...). WORDS' world feed already fit.
(e) THE GATE: gates/the_feed_has_a_max_length_gate.js, in the suite as THE FEED HAS A MAX LENGTH: every line of the game's feed
    file, WORDS' bank and the world feed at 120 or under with the longest fills read from the data, every handle at 16 or under, no
    dots; on the upright phone, through fitStrip, the six longest real posts each fit at 6 px or more with every word in the box.

Seen while measuring, not changed: a new post steps in from above for half a beat (bohIn), so a picture taken in that half beat
shows the words without the handle; that is the step-in, not a cut.
Also caught by THE FEED'S WORDS while rewriting (fixed): a Spanglish twin trimmed until it had no Spanish word left (two put back
from their own old words), a night post that lost its person ('i saw' put back), and the era's handles (a digit and the one .eth kept).
