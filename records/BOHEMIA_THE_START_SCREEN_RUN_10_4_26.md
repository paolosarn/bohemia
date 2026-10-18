# THE START SCREEN (RUN, 10/4/26, [the start screen], rule 66)

> **PAOLO 10/2:** *"the UI sucks... there should be a start screen: new game, continue game, settings."*

## MEASURED FIRST
- The demo opened straight onto the loading terminal with the picks laid over it: a grid of flat
  green boxes (rule 71's "vibe coded").
- One save, and no way to start over (no wipe anywhere). A returning player's only door was BEGIN
  relabelled "CONTINUE · DAY N".
- No settings until he was already in the game.
- The start batteries: "paid once" lived in memory only. Measured on a CONTINUE, the map restores the
  save a second time after BEGIN, which happens to put the saved purse back over a second payment, so
  no double pay showed; it was hidden by timing, not prevented.

## NOW (`__THE_START_SCREEN__`, the shell)
- **Battle Brothers' own door:** the title, then NEW GAME / CONTINUE / SETTINGS, and NOTES.
- **The picture is the game's own camera** (rule 23): the valley's far stop, captured from the map at
  night, graded as what it is in the story, the power authority's last working camera (rule 30,
  analog horror at the source: a surveillance feed with its REC light, its clock, a rolling bar,
  scanlines, a slow drift). The ground reads at 0.24 (wide) and 0.29 (tall) of white, over rule 73's
  0.20 floor. His own logo at an integer scale. Upright: logo high, menu low. On its side: menu left,
  logo right. MOTION in settings stills the drift.
- **The plates are built with light and form** (rule 29): a lit top edge, a dark bottom lip, a drop,
  pressed on touch; CONTINUE greys out when there is nothing to continue.
- **NEW GAME:** the door's picks and BEGIN, as before. Over a save it asks once ("START OVER? this
  ends day N. tap again"), then marks the save slots with the save engine's own DEAD mark (no
  tombstone, so new saves count from zero), holds the page's last snapshot from writing the old game
  back, and reloads straight to the picks.
- **CONTINUE:** only with a save, labelled "DAY N · HH:MM · THE CREW". It goes in through the door's
  own BEGIN, waiting for the valley if it is still loading.
- **SETTINGS:** the game's one settings card, opened through UI's own start-screen entry
  (`BohemiaSettings.open({atStart:true})`, built this same round), lifted over the door, without its SAVE and QUIT row.
- **NOTES:** the same notes list the game keeps, each marked as written on the start screen.
- **The demo's door only.** The workshop file (the alpha) lands on VOTE after its loading screen by law,
  and the title in front of that broke THE VOTE TAB's three landing legs (32/0 again once the title
  reads the cutter's own `__BOHEMIA_DEMO_BUILD` flag).
- **It lives inside the door,** so everything that enters by BEGIN still does (every driver and every
  check). The menu keeps clear of BEGIN in both shapes, and a stray tap on the picture is held.
- **The start is paid once per GAME:** the map reads its purse's own ledger, and a crew with a start
  payment in it is never paid again, whatever the order of messages.

## THE LOOK IS UI'S (merged the same round)
UI shipped [the start screen's look] (21fef9b) while this was in its checks: `BohemiaMaterials.startScreen(host,
{onNew, onContinue, onSettings, saved})`, the three buttons as three materials (taped cardboard, a receipt,
cracked glass), his mark, a painted night ridge with pylons. The title now WEARS it, inside its own layer
(so inside the door), driven by this logic: CONTINUE's line and dark state (`paint`), the START OVER warning
(`arm`/`disarm`), the menu kept clear of BEGIN and shown once in place. The camera-feed look above stays as the
fallback when their file does not load (the valley pictures are in `slices/start/`, offered to UI). Measured
and fixed on the way:
- **a class-name collision that was mine:** this title's REC dot was `.rec` and UI's receipt button is `b rec`,
  so CONTINUE was drawn as a 30 px blinking red dot; the dot is `.recdot` now.
- **pinned at both ends:** UI's wide-screen rule centres its menu with top 50% and a transform; with the
  bottom rule here the box was squeezed and the buttons spilled off the top. When this logic places the
  menu it releases top and transform; upright and sideways the three sit clear of BEGIN.
- NOTES sits at the very top, clear of the logo and the first card's tape in both shapes (measured: no
  overlap with anything).

## WORDS' SIX FIXES (records/BOHEMIA_WORDS_THE_DEMOS_LINES_10_4_26.md), applied word for word
Clinic short "heals faster"; clinic button "Heal faster"; THE WATER TRUCK "The water gets more respect
than you do."; THE BLOCK WATCH "...a small crew against you."; the recap "LAID UP 14 DAYS"; the win
"THE ROAD CREW RAN". Two are in RUN TWO's settlement file and two in COMBAT's fight file, one text
swap each, as the coordinator assigned them to this row.

## WHAT THE OTHER CHECKS FOUND, AND WHAT CHANGED
- **Seven door checks meet the door the way a stranger does** and their taps now landed on the title.
  Re-aimed, not loosened: `tools/bohemia_through_the_title.js` does what a person now does first (NEW
  GAME, a real touch, confirmed; on a return visit CONTINUE), then each check meets the door exactly as
  before. STOP AND COME BACK reads "the run is waiting" from the title's CONTINUE line, where it now is.
- **The helper's own two traps, measured:** right after a navigation the old blank page still answers
  with the game's address and "complete", so only a page with the game's door may say "no title"; and
  on a phone-speed CPU the menu moved under the tap once the door took its loading layout.
- **That move was a real defect for a thumb too:** the menu now appears once, in its place, when the
  door has its loading layout (or after the game has begun, for QUIT).
- **The title read the whole save twice a second.** That is the exact thing that broke the beat once
  already (the door's own painter, BEAT FIRST): it now reads it once per showing.
- **An offline audio context was being resumed.** A bar rendered offline swaps the music engine's
  context for an OfflineAudioContext; a first touch inside that window called resume() on it and the
  rejection escaped every catch (SETTINGS saw it as a page error in 2 of 3 runs). The title's early NEW
  GAME touch made the window likelier. Two guards in SOUNDS' engine lines (MUS.audio and the unlock):
  never resume an offline context. SETTINGS is then the same as main (its two reds are a click timed
  1.3 s after load, red on main alone as well).
- Against main: A STRANGER 18/0 (main 17/1); STOP AND COME BACK 24/1 (main 21/4); THE DOOR WAITS 10/0;
  THE FRONT DOOR 7/0; THE SCREEN HOLDS THE LOADING 27/0 alone (its one-tap timing misses under nine
  parallel browsers); FRONT DOOR 8/2 where main crashes at A3 (its A7 and A9b were red under that crash:
  the picks put about 1,800 characters on a door it holds to 220); BEAT FIRST 14/3 (main 12/5).

## NOT DONE HERE, ROUTED
- **The screen-size override in SETTINGS (rule 62):** the screen module is COMBAT's (built this round)
  and only the fight reads it; a row that changes nothing would be a dead button. COMBAT: read an
  override from `BOH_SETTINGS.screen` in `classify()` and the row goes in the card.

## CHECKS
- **THE START SCREEN**, new, 12/0, registered slow, driven with real touches at the phone's profile.
  Mutations, each red: no ledger guard (T8b, 1 -> 2 payments); the title passes taps to the door (the
  stray tap enters, the walk breaks at T3); NEW GAME keeps the save (T9, the old purse comes back);
  the menu over BEGIN (T2).
