FACTIONS (factions-ovkjpf): 8/27 (r) LATEST -- *** A GUARD THAT COMPARED TWO
CONSTANTS, AND A LIST OF DIRECTIONS WITH NO REASONS ON IT. Nothing to judge. ***

TAB: **RUN**, the ⚔ OUTFIT chip.

=== ONE. ctBases() HAD A CHECK THAT COULD NEVER FIRE ===
    if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
BOH_SEED_TEXT is a const ('bohemia'). CT_BASES_SEED is baked from that same
const. TWO CONSTANTS. Its own comment says what it is for -- "a different seed
gets NULL rather than a confidently wrong answer" -- and the intent is right
while the variable is wrong.

WHAT MAKES A DIFFERENT WORLD IS `seed`, which REROLL advances by one LCG step
and never touches the text. MEASURED BY PRESSING THE REAL BUTTON:
    seed      2691674296 -> 3182853632    the world IS new
    ctBases() null? false -> false        the guard never fired
Damage is not that factions vanish (people are keyed to cell coords, so the
census is identical). It is that the bases then sit on whatever terrain the new
overmap put under those coordinates.

FIXED with the comparison the comment meant: seed === BOH_ONE_SEED(). The text
check STAYS -- it catches somebody editing the seed and forgetting to re-bake.

AND IT SAYS SO WHEN IT FIRES, which is the half that matters. Returning null in
silence is how this lane lost thirteen days (factionOf answered null for all
166 people and "nobody runs with anybody" looks exactly like a world where
nobody does). A GUARD THAT GOES QUIET IS THE BUG IT WAS WRITTEN TO PREVENT.
Board + one console line: "YOU REROLLED THE WORLD. The outfits' ground was
mapped for the valley that was here before..."
REROLL is in the builder drawer and hidden from the demo, so this is a workshop
consequence, not a player one.

=== TWO. THE VALLEY LIST TOLD HIM WHERE AND NEVER WHY ===
Yesterday: nearest outfit is 29 cells from spawn = 3,712 tiles, and the board
started listing every outfit with a bearing. That makes it FINDABLE and gives
nobody a REASON.

AND THE REASONS WERE ALREADY WRITTEN. bohemia_belonging RULES has anchorWant +
pays for all sixteen:
    COLORFUL  "To know whether you are safe to be around"
              THEY PAY: A NETWORK INSIDE EVERY OTHER FACTION
    MOB       "You ACCOUNTED FOR. Not loyal, not employed - listed"
              THEY PAY: ENFORCEMENT OF A DEAL
    CARTEL    "They want you to OWE them"
              THEY PAY: WHATEVER YOU NEEDED THAT WEEK
Every one shown ONLY on the card of somebody he had ALREADY MET -- one walk too
late. Same shape as the four Colorful garments worn by nobody for five weeks.
The board says it now, before he goes. Nothing authored: gate L4 compares every
string against the module, so the board may move his words and never write new
ones.

  FACTION BETWEEN  81 passed, 0 failed (was 73)   CARD FOLD   18/0
  ORGAN REACH       8/0   EVERY PANEL 14/0        ALPHA LOADS 20/0
Three mutations, all bite: guard back to two constants (L6/L7/L8), guard firing
silently (L7), the board inventing its own words (L4).

HOW BOTH WERE FOUND: not by reading code. By asking what happens when somebody
presses a button, and pressing it.

*** STILL THE ONE THING BLOCKING THIS LANE, AND STILL NOT MINE ***
837 people stand within six cells of the spawn and not one runs with anybody;
nearest base is 29 cells. Three ways out:
  1. THE SPAWN AND THE BASES ARE PLACED BY TWO SYSTEMS THAT HAVE NEVER HEARD OF
     EACH OTHER. I checked for an existing answer to adopt: bohemia_loop.boot()
     returns factionBases and NO player position at all, so reconciling them
     means DECIDING where the player starts relative to the outfits. Placement.
  2. The dials: AFFILIATED_RATE (0.30) and REACH_CELLS (12), both [PENDING].
  3. Outfits get people who TRAVEL. Needs a new dial, so it needs a ruling.
The board makes it findable and gives a reason to go. It does not make it near.

--------------------------------------------------------------------------------

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

