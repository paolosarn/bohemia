# THE PHONE'S FRONT SCREEN: ONE CLOCK, ONE FACE, ONE PRESS (UI [the phone's front screen], 10/18/26)

MODE: cook only (rules 100, 108). A candidate in VOTE. Nothing in the game: the phone's inside and the city file are untouched;
the new front screen is laid over the opened phone in the browser by a tool and photographed.

## WHAT HE SAID
His fourteenth votes: YES on the phone's apps, with 'the front screen looks like dog shit, the first one, so let's update that
too'. The first one is the first picture on that card: the lock screen the phone opens on. Rule 117 (his, 10/18): minimalist,
one clear next thing, a busy screen shows progress and never a to-do list. Rule 114 D10: no browser defaults.

## WHAT THE FRONT SCREEN IS NOW (measured, tools/bohemia_ui_phone_lock_shots.js, NOW on his phone)
renderLock() in the phone's frame: a 62 px clock in the phone's mono font, 'THE VALLEY · +38°C · post-collapse', two rounded
see-through cards (The Neighbor with a purple 'N' square, cut off mid-sentence; Network '41 quests available near you' with a
yellow diamond square), and a blinking 'tap to unlock'. The D10 counts are on the sheet's header and in the manifest.

## WHAT SHIPPED (the candidate)
- tools/bohemia_ui_phone_lock.js lays the front screen over the phone's glass:
  - THE TIME ONLY (the HUD's clock with the day stripped; the bar above already says the day), in CASING at 50 px = 15 phone
    pixels a dot, a 3 px hard drop line, no glow.
  - ONE MESSAGE FROM ONE MOUTH (rule 19): the neighbor's face from the game's own face maker (keeperFaceSrc, 64 px, shown at
    3 phone px a face pixel) and his REAL last text from the phone's threads, the whole line, never cut off.
  - ONE PRESS: READ, 168 x 48 points, at the thumb's end of the screen.
  - THE PANEL PAINTED IN ONE CANVAS: the black of a dead screen, the glare from the top left as an ordered dither in whole art
    pixels; and two things a salvaged phone really has, painted in, never a filter (analog horror at the source): THE LAST
    OWNER'S LOCK SCREEN BURNED INTO THE PANEL (her 11:47 and 'MOM (14)', about 4% over the black, draft:true) and ONE DEAD ROW
    of pixels across the glass.
  - LOOK A: the message on a receipt strip taped to the glass, READ on a cardboard tab.
  - LOOK B: the message printed straight on the glass between two 1 px rules, READ in a 1 px amber box.
  - Sideways: the clock on the left, the message and READ on the right.
- The '41 quests' card leaves the front screen: it is a to-do count (rule 117c) and lives in JOBS on the home screen.
- First shot caught two of mine before the sheet: the clock read 'DAY 1 · 06:00' (the HUD's text) and the materials' 132 px
  glass tiled into a checkerboard at phone size; both fixed (time only; the panel painted whole).
- Sheets: records/target/ui_phone_lock/UI_ONE_AT_A_TIME_THE_PHONES_FRONT_SCREEN.png (NOW, A, B side by side at 1:1) and
  UI_THE_PHONES_FRONT_SCREEN_SIDEWAYS.png. Manifest UI_THE_PHONES_FRONT_SCREEN.json.
- Gate: gates/the_phones_front_screen_gate.py, in the suite as THE PHONES FRONT SCREEN.
- VOTE: ui-the-phones-front-screen-10-18 (A / B / NO).

## FOR RUN TWO AND RUN AFTER HIS PICK
The wiring is renderLock() and the #lock / .lk-* styles in BOHEMIA_CURRENT_SLICE.html: one message (the first unread thread),
the face from keeperFaceSrc posted in like the settlement's faces, READ opens that thread, a tap anywhere else opens the home
screen; the burn-in and the dead row are one canvas painted once at open. The shell's gear still overlaps the top of the opened
phone (named on the apps card too).
