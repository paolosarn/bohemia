# ONE DOOR: TWO BUTTONS, ONE SUBJECT, AND THE WORD THAT FOOLED ME
UI lane (11), row [one door] -- OUTFIT-AND-STANDING-OPEN-THE-SAME-ROOM. 9/14/26.
Found by CHARACTER (64503658) walking the five minutes. Routed by the coordinator 9/13.
Rule 14(b): a break he named, so it is this lane's first job.
Sheet: slices/BOHEMIA_FIVE_WAYS_ONE_DOOR_9_14_26.html

## THE ROW WAS RIGHT IN SUBSTANCE AND WRONG IN DETAIL, AND THE DETAIL CHANGED THE FIX
The row says both buttons "lead to the same faction-standing panel". **They do not.** Opened
both on the real surface and read what came up:

    OUTFIT   (top strip)  -> #outfitpanel, "YOUR OUTFIT": the directory of ALL SIXTEEN crews --
                             where each one is, whether you have met them, what they want, what
                             they pay. Zero clothing in it, top to bottom.
    STANDING (left rail)  -> the card, "YOUR RUNG": your own position -- your rung, territory,
                             this ground, the rent tonight, who would come with you, who would
                             follow you.

Two genuinely different and genuinely useful views of ONE subject. So the fix is not "delete a
duplicate": **the directory moves INSIDE standing**, one tap further in, and the second door
comes off the strip. Two doors onto one room should cost a tap, not a room.

## *** AND I READ "OUTFIT" AS CLOTHES, WITH THE WHOLE CODEBASE OPEN ***
Halfway through this I had written that the OUTFIT button was **mislabelled** -- that a panel
full of factions behind a sign saying OUTFIT was a lying sign. Then I found the game's own
vocabulary, in its own strings:

    'YOUR OUTFIT AND THEIRS ARE AT ODDS'
    'YOUR OUTFITS ARE AT WAR AND IT IS ALSO PERSONAL'

**In this game an OUTFIT is a CREW.** The label was correct all along and my reading was the
error. I corrected it before touching a line, and it is written here because the mistake is the
evidence for the decision, not a footnote to it:

**I had every file in front of me and still read it as clothes, because the game also has a
CLOTHES tab.** A stranger has the same collision and none of the context. That is why STANDING
is the door that survives -- not because it is better designed, but because it says the same
thing in words that cannot be taken two ways. It also already sits on the left rail with the
game's verbs, while the strip holds MUSIC, SAVE and PHONE, which are machine controls.

## WHAT LANDED
* the OUTFIT button is gone from the top strip
* the STANDING card grows one row, `WHO IS OUT THERE`, which opens the directory (draft:true)
* walked it the way a player does: dismiss the wake card, tap STANDING, tap the row --
  the directory opens. The row measures **130x44**, so it meets the thumb law this lane shipped
  on [every card].

`gates/city_rail_gate.js` **15 ok, 0 failed**, two new legs beside the ones that already guard
PRETTY MAP and DROP IN -- the same law, the same shape:

    the OUTFIT door is gone from the strip
    and the room it used to open is still reachable, one tap inside STANDING

**A door you remove must not take its room with it**, so both legs exist and both are
mutation-proved:

    put the second door back      -> the first leg fails, "STILL THERE"
    remove the way in from STANDING -> the second fails, "no way in to the directory"
    restored                      -> 15 ok, 0 failed

## A PROBE THAT LIED TO ME FOR ONE RUN, AND IT WAS MINE
My first walk reported the new row **MISSING** and the directory unreachable. It was not: the
harness had failed to dismiss the wake card, so `STANDING` was never actually opened and I was
reading a screen with the morning card still on it. The card's own tail gave it away
(`...I'LL TAKE IT / GET UP`). The harness now presses GET UP, **verifies the card is gone, and
REFUSES TO REPORT if it is not** -- which is exactly what `tools/bohemia_eyes_thumbs.js` does,
and I should have copied that first instead of re-learning it.

## A CORRECTION TO MY OWN HANDOFF FROM LAST ROUND
I reported seven gates that press `#modechip` and said each needs "one identical line --
`swapMode()` instead of the click". **For one of the seven that is wrong.**
`gates/the_action_button_does_actions_gate.js` is **16 passed 2 failed on clean origin/main**,
and its failing legs assert *"the camera toggle still exists"* and *"a thumb can actually press
it"*. Those do not want a new way to click the button; they assert the button **should exist**,
which Paolo's ruling deleted. That is a decision for whoever owns the gate, not a one-liner, and
saying "one line" about it was me generalising from the two I had actually fixed.

## PROOF
    node gates/city_rail_gate.js      15 ok, 0 failed (two new legs, both mutation-proved)
    node gates/thumb_gate.js          19 ok, 0 failed
    node gates/half_size_gate.js       7 ok, 0 failed
    node gates/phone_object_gate.js   18 ok, 0 failed
    node gates/rom_face_gate.js       14 ok, 0 failed
    node gates/feed_gate.js           15 ok, 0 failed
    node gates/alpha_loads_gate.js    20 passed, 0 failed
    python3 gates/readable_ruler_gate.py   7 ok, 0 failed

Per rule 13: PRE-PUSH PASS green. THE SUITE LINE is still unposted, so the honest sentence is
**pre-push pass green; full suite unmeasured since 7efb22cf.**
Rule 14(a): ships to the alpha and the workshop; the demo is untouched. RUN cuts it.
