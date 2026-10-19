# THE ART FENCE: NOTHING AN ART LANE MAKES ENTERS THE GAME BEFORE HIS FINAL (PLUMBER 10/19/26, VAMILY row [the art fence])

Rule 100 (Paolo 10/10: "they can't just take one turn thinking they did something awesome and implement some bullshit
until every asset they make gets the final approval and I say this is it... they do one little dogshit that I didn't
say is final and start implementing it nationwide"), clause (f): a commit by an art lane touching slices/ or engine/
is red unless the VOTE registry holds his FINAL on that asset's family; the lane read from the commit's first word.
Rule 101(c), the second leg: an art lane's edit to a placeholder file is red.

READBACK [the art fence]: I read this as: a commit whose first word is an art lane and that touches the game is red
unless his own FINAL covers it, and an art lane editing a listed placeholder is red; done means proven both ways.

## WHAT THE RULINGS SAY, NEWEST LAST, AND HOW THE FENCE READS THEM

- Rule 100(a) and (f) (10/10): COOK, COOK TWO, COOK THREE, COOK FOUR, DIRECTION, CHARACTER, PORTRAIT, COMBAT TWO's
  boards and UI's look cook only: cook folders and the VOTE registry, never slices/ or engine/.
- Rule 88 (10/10): UI changes "the look of the screens in the materials only". The fence allows UI that one file,
  slices/bohemia_ui_materials.js, where its look waits behind RUN's switch until the cut (rule 93). UI regenerating
  the demo or editing the alpha is still red.
- Rule 100(b): FINAL is "a YES on a card titled FINAL? <family>". Read from his verdicts in the registry, never a
  lane's words, and a YES whose words say "not final" is not FINAL (most of his YESes on FINAL? cards say exactly that).
- Rule 108 round thirteen (10/11, newest on FINAL): "no art reaches FINAL before his pictures are in the bible". The
  moodboard has not landed (the cooks' own 10/18 cards still say "nothing final before your moodboard"), so the
  config's moodboard_landed is null and NO FINAL COUNTS TODAY. Five cards are FINAL by 100(b)'s letter (four with no
  words at all: COOK TWO's curb, UI's six supplies, the phone's crack, one bar; and the party marker, whose words call
  every icon "dog shit"); the gate prints them every run so the coordinator sees what would count the day it lands.
- Rule 115(g) (10/18): the first rig-made things that pass the VOTE tab ride RUN's next cut. RUN is not an art lane,
  so the fence never blocks that road: the cook folder, the VOTE tab, then RUN carries it.

## THE GATE (THE ART FENCE, 14/0, about 8 s; gates/art_fence.json is its config)

A1 the window: every commit after the birth (ca82b0de); a shallow clone that does not reach it reads every commit it
holds dated after it, and says so. A2 the fence, A3 the placeholder leg (the paths records/BOHEMIA_PLACEHOLDERS.md
names and the pictures of the cards it lists: 372 files today), A4 every finals entry names a card FINAL in his own
votes. A red commit leaves the red only through `answered` in the config, with the revert's sha or the ruling's
record: a history gate with no way to answer stays red forever.

PROVEN BOTH WAYS. Nine planted cases on a planted repository (an art lane's board file red, its cook folder and the
VOTE folder green, UI's materials green and UI's demo red, RUN and the coordinator green, a placeholder edit red and a
new file green, a FINAL before the moodboard red, after it green, a YES saying "not final" red, an answered commit
cleared, the lane read longest name first: COOK TWO, never COOK; COMBAT is not COMBAT TWO). On the REAL history in a
throwaway worktree: a planted "COOK TWO [the mutant]" board file, A2 red; a planted edit of the cone (a listed
placeholder), A2 and A3 red; a planted "RUN [the cut, now]" demo change, green.

## THE RECORD SINCE RULE 100 (printed every run, not failed)

From 10/10 to the birth, in this clone's 1,018 commits: 28 art-lane commits put files in the game with no FINAL of
his, and 4 edited a placeholder's picture. Most landed on 10/10 itself (COMBAT TWO's 67- and 46-file boards, COOK
TWO's kits, COOK FOUR's settlement pictures, PORTRAIT and CHARACTER in the alpha and the map); after it, COOK THREE's
paint layers in engine/ (10/11, 10/16) and UI's front screen in the alpha and a regenerated demo (10/18). That is the
"implemented nationwide" he named, measured; nothing in it is reverted by this lane (the files are other lanes', and
the coordinator rules).

## ALSO THIS ROUND, FROM BUILDING IT

- 45 OF THE LANES' OWN PICTURES LIVE IN HIS PACK BANK (34 COOK4_* in reference/art_bank/settlement, 11 in
  fight_board/sprites). Every ruler that reads "the packs" read them too: my pixel floor and my tells bands now read
  pack_* only. Routed to COOK FOUR and DIRECTION: the bank is his packs; a cook's picture lives in a cook folder.
- MY TELLS BANDS WERE STALE SINCE 10/18 17:21 (records/target/BOHEMIA_NOT_VIBE_CODED_BANDS.json): I changed D7 to its
  1st-to-99th percentile (5d508637) and never rebuilt, and N2, my own freshness check, only counted pieces. Rebuilt
  over his 1,915 pieces; D7's band moved in every family (ground -0.010 to -0.072); N2 now also holds a fingerprint of
  every function a band number comes from, so a changed ruler is a red until the bands are rebuilt.

## [bb pipe]

Battle Brothers' art reached the game through one art lead's sign-off; nothing a single artist drew went into a
build on its own. The fence is that sign-off made a machine: his FINAL, read from his own votes.
