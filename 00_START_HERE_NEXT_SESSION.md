WORDS (words-8dqrnq): 8/27 (b) LATEST -- *** THE INTERFACE WAS NEVER IN THE WORDS BOOK, AND
THE 8/11 LAW NAMES IT BY NAME. 34 strings the demo actually paints, harvested, voice-passed,
and editable by him for the first time. TAB: WORDS, search "screen". Nothing to judge. ***

ALWAYS MAKE AN ATTEMPT (Paolo 8/11, LOCKED) lists what counts as player-facing text and it is
NOT only dialogue: "UI copy, tooltips, notifications, failure messages". The words book
harvested 36 sources and every single one was a quest, a scene or a bark. ZERO interface. So
the wake card, the objectives, the save panel and the buttons -- THE FIRST WORDS A STRANGER
READS, and the only words some of them will read -- were never audited against the voice card
and HE COULD NOT EDIT ONE OF THEM. That is the half of the 8/11 law that makes the rest real.

*** HARVESTED BY DRIVING, NEVER BY GREPPING. *** The city world's source holds 368 quoted
strings and a stranger sees almost none of them -- they are dev labels, name banks, debug text.
So the test for player-facing is THE GAME PAINTED IT: tools/bohemia_interface_words.py opens
the BUILT DEMO, walks it down its own path (the same one demo_build_gate uses), and reads the
rendered text nodes on a 390x844 phone. 34 strings across 6 screens. If a stranger could not
have seen it, it is not in the file.

TWO THINGS WERE ON A PLAYER'S SCREEN THAT SHOULD NEVER HAVE BEEN:
 1. *** "backend:" *** -- a developer's word for a storage API, printed in the SAVE PANEL, a
    screen a player opens on purpose. Now "kept in:". The line above it went from "autosaves as
    you move - one slot - resume only" to "saves itself as you go - one save - picks up where
    you left off". Same information, no jargon.
 2. *** "walking the neighborhood you dropped into." *** -- DROP-IN VOCABULARY FROM A GENRE
    THIS GAME IS NOT. THERE ARE NO RUNS (8/26): one character, about a hundred hours, and he
    LIVES on that block. Now "walking your own block."
AND ONE STATE FLAG LEAKING AS PROSE: the first screen of the game said "on the network - not
taken" under the quest title. "not taken" is the flag's name. Now "nobody has picked it up
yet" -- same fact, plus the reason to care, which is that somebody else could.

WHAT I DID NOT TOUCH, ON PURPOSE: "HUMAN MODE" is HIS term (8/2, "THE RUN TAB OPENS IN HUMAN
MODE, WHERE YOU LIVE"). MECHANISM-MINE / CONTENTS-PAOLO'S -- a name he coined is not mine to
improve. Same for POST-ECONOMIC APOCALYPSE - LAS VEGAS and the button labels.

THEY ARE IN THE WORDS TAB NOW, as five new groups called WHAT THE SCREEN SAYS, one per screen,
each line editable in the same box as every quest line. 2,442 lines -> 2,476. Verified on the
real surface: searched the tab on a phone-width screen and edited an interface line.

GATE: gates/voice_gate.js, 85 checks (was 78). The harvest exists, is driven off the real
surface rather than grepped, is tagged draft, and reaches the tab -- plus a DEVELOPER LANGUAGE
sweep over every painted string: backend, localStorage/IndexedDB/API, null/undefined/NaN, a
state flag as prose, run vocabulary, a stack trace or file path. Mutation-tested: planting
"backend: null" back on a screen takes it red on two counts at once.
ALSO: dialogue_catalogue_gate's completeness count now includes the interface, independently
measured off the harvest rather than trusted from the generator's summary.

Nine gates green on the merged tree: voice, dialogue catalogue, quest study, attempt, language,
handoff, current slice, demo build, direct. Build 8/27p.

WHAT I WOULD DO NEXT, IN ORDER:
 1. THE SCREENS THE HARVESTER COULD NOT REACH. It got 6: splash, shell, first morning, after
    GET UP, phone, save. It did NOT reach the journal, the objectives list, the outfit board,
    the sleep card or ANY failure message, because the driver could not open them. Those are
    still unaudited and unreachable to him, and finding them is a driver problem, not a
    writing one.
 2. THE 22 UNPASSED QUEST SCENES, worst-first by rhythm ratio. Not demo-blocking.
 3. NOBODY EVER RAISES THEIR VOICE. Zero exclamation marks in 504 speeches, still true. I am
    not going to force one; it wants a scene that earns it.

WHAT IS PENDING HIM: nothing from this lane.

