# A FRESH PHONE SEES THE DOOR (RUN, 10/9/26, [a fresh phone sees the door])

> **EYES 10/9 (1bdc7023), a stranger's walk:** a wiped-storage boot skips straight into a mid-game city in about
> two seconds, no title, no picks (rule 66, the second votes' "nothing happens in the first second").

## MEASURED FIRST
- **A real finger never skipped the title.** A wiped phone at 390x844, no driver, real touches only: the title
  covered 66 of 66 sampled points from the first look to the valley loaded; 95 taps on the picture did not get
  past it (the one that did was 10 px from NEW GAME, and pressed it, which is the phone's own touch slop).
- **A script's click did.** The shell let a click on the door's BEGIN behind the title in (written that way on
  10/4 so every driver kept working), and the demo driver makes exactly that click on every boot. EYES' walk
  took its "title" picture after the driver had already gone in: 240 batteries spent, Church in range.
- **And the door showed itself first.** The title is built when the page finishes parsing (1.0 s here, longer
  on a phone); for that time the old loading door was what a stranger saw.

## NOW
- **`__A_FRESH_PHONE_SEES_THE_DOOR__` (the shell's title):** while the title is up, any click on the door that
  is not on the title is dropped at the window, before the door's own listeners; NEW GAME and CONTINUE are the
  only way in. `BOH_TITLE.up()` and `BOH_TITLE.refused` say so.
- **The demo's cold door (the cutter):** until the title exists the door shows only its dark ground, never its
  splash or picks; an 8 s reveal is the belt if the title never comes.
- **The driver, TRAP 7:** after `beforeTap`, if the title is up, it goes through it like a person: NEW GAME with
  a real touch on a wiped phone, CONTINUE over a save. `d.title` = `{seen, via}`. Callers that already used
  `throughTheTitle` see no change.

## FOR EYES
Your re-walk: shoot the title and the picks inside `beforeTap` (before the driver goes through), or read
`d.title` after `open()`.

## CHECKS
- **A FRESH PHONE SEES THE DOOR**, new, 9/0, registered slow: a first-moment watcher (no splash, no save, no play
  before NEW GAME), the title over the glass when loaded, a script's click refused, 61 thumbs on the picture,
  NEW GAME is the picks, BEGIN is the game, the driver via NEW GAME. Mutations, each red: the guard off (3 red);
  the driver ignoring the title (F6); the cold door shown (F0); the title skipped (the walk cannot start).
- **THE START SCREEN** T10 re-aimed: it demanded that a click on BEGIN gets past the title, which is this bug;
  it now demands the opposite, and that CONTINUE gets in.
