# BB SCHOOL, THE INTERFACE, ROUND SIX: HER PAGE (THE MAN'S PAGE)
# UI (chat 11, ui-kmqmrf), 9/28/26. Row [bb interface], rule 33(f); library first (33j):
# reference/library/battle_brothers/10_UI_AND_FEEL.md (THE ROSTER), 02 (injuries), 06 (backgrounds).

## THE SCHOOL HALF (recall, vol 10)
A man's page in Battle Brothers: a painted portrait aged by his injuries, a background story, stats
with stars, a perk tree, a paper doll of his gear, a list of traits with icons, level and xp. "A man's
page is where the story lives." It is opened from his face in the roster row (round four's option B
puts exactly that face in our bar).

## THE MEASUREMENT HALF: WHAT THE GAME KNOWS ABOUT THE PERSON WALKING WITH YOU
Alpha, the one driver, PEOPLE's walk until a companion fell in (12:12:900, Estella Gaines), then her
record read off her own speech (BARK.p when she spoke; the first two lookups found the wrong object
twice -- __PPL_FACES, then nothing in the neighbourhood list -- so the person was taken from the one
place that provably holds her: the line she was saying).
    ON HER RECORD: archetype 'watch'; home and household; a schedule (sleep 0:00-9:32, home 9:32-17:35,
    watches the street 17:35-23:23, sleep); temperament flags nightOut, darkStay, wetStay (true),
    duskSit (false), heatTol 1; workDir/favDir; a face index and a look index.
    FROM THE FALL-IN: why she came ("their work is gone, so their day is empty and yours is not") and
    what she wants ("a day's work that pays in batteries").
    FROM HER MOUTH: lines like "Half light's worse than none. Makes you think it's coming back."
    NOT ON HER RECORD: her name (the speech system resolves it; p.name is empty), and her BACKGROUND
    (BohemiaPeople.wasOf returned null for a 'watch').
    NOT IN THE GAME AT ALL: health, any stat, gear, what she carries, injuries, level, perks.
So the STORY half of a BB page exists and the NUMBERS half does not. TUNING (research) and COMBAT own
the numbers; this lane owns where they will sit.

## THE SHAPE, AS THREE OPTIONS (rule 25)
A EVERYTHING, BB STYLE: every BB box, most of them dashed and labelled NOT IN THE GAME YET on her.
B HER STORY FIRST (MY DEFAULT): a big head-only face (37i), the last thing she said, why she came, her
  day as a 24-hour ring, three habit icons, and the numbers one tap down. Everything on it is real now.
C ONE CARD over the game: face, name, what she wants, a health ring. The least on screen.
Cook: ui-her-page-9-28, slices/vote/UI_HER_PAGE_9_28.png. Every word on the pages is her real record;
nothing is invented; the empty boxes say NOT IN THE GAME YET rather than showing made-up numbers.
WHAT MOVES THAT BB'S PICTURE DOES NOT (33g): her day ring is the real schedule, so the page can show
where she is right now and whether she is out; BB's page is a still.

## FOR PEOPLE AND PORTRAIT, NOT MINE
wasOf() returns null for the 'watch' archetype, so a companion of that kind has no "what she used to
be" on the page, which is the heart of BB's background line. Named, not touched.
