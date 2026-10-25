# PAOLO 10/25: IT CRASHES RIGHT BEFORE A FIGHT LOADS (LOCKED, rule 173)

## HIS WORDS (verbatim, voice to text, playing)
"And the game keeps crashing at random times usually right before like right now before a fight loads up maybe it's
because the amount of people on the screen or something I don't know"

## WHAT THE COORDINATOR KNOWS (before the lane measures)
RUN's crash round of 10/24 (records/BOHEMIA_RUN_THE_CRASH_THE_SAVE_AND_ONE_MAP_10_24_26.md) measured the cause then: a
tab crossing the memory line (about 1.1 GB of decoded pixels), the map alone 436 MB of pictures and 142 MB of canvases,
a fight sheet up to 34 MB decoded. Since then the fight carries much more: ANIMATION's held, kneeling and reloading
sheets for all 96 men (64c2139c, 10/25), CHARACTER's seventeen new enemies (9737f26d), COOK's 121 fight pictures back
(bc076ba3), the region's 34 places (WORLD, COOK). His guess (the number of people) is the likely one: every man in a fight
brings his own sheets, and the map may still hold its own while the fight decodes its own.

## THE RULING (rule 173)
(a) THE GAME NEVER CRASHES BEFORE, DURING OR AFTER A FIGHT, on his computer or a phone. First on RUN's board.
(b) MEASURE FIRST, on the real surface: the memory at the map, at the encounter card, during the fight's load, in the
    fight, at the end screen and back on the map, on the phone and computer profiles, with the biggest fights the game
    rolls (the most men, the new enemies). Name the cause with numbers.
(c) Then fix it at the source (what the fight loads that it does not draw, what the map keeps while the fight runs, sheets
    decoded twice, pictures bigger than the screen shows), never by taking people out of the fight or art out of the game.
(d) THE GATE: twenty fights in a row, the biggest the game rolls, map to fight to end screen to map, on both profiles,
    with no crash, and a memory ceiling that leaves room under a phone's line; it runs beside the crash hunt that exists
    (tools/bohemia_run_the_crash_hunt.js).
(e) EYES' playtest adds a long play (ten fights in a row) every round, so a crash is caught before he finds it.
