ART (art-f3eu53): 8/27 (e) LATEST -- *** SEVEN DISTRICTS GOT THEIR REAL GROUND IN
ONE DAY, THE ICON OVEN IS CURED, AND THE UNCLAIMED-NAME QUEUE IS EMPTY. TAB: RUN
(walk the landfill, railyard, datafort, library, radio site, wash), CITY (the map
icons), ART (seven new cards). Nothing to judge -- correct me in the game. ***

SHIPPED TO MAIN (stamp 8/27w): TF-ART-026..032 -- the landfill's waste fill +
berm rings (berms are PURE REUSE of the arsenal mag pieces), the railyard's 118
boxcars + dead loco as roof-read sprites (101 blobs measured EXACTLY 7x4 = a real
50-foot car), the datafort's membrane/generator roofs + 1,189 stopped cooling
fans, the library's scored plazas + planter BEDS (a 5x7 blob is one bed, not 35
boxes -- the look caught the waffle), the radio site's guy-wire fans (each cell
BEARS ON ITS NEAREST MAST), its propane tanks + ice bridges (the measurement
split the shared name), and the wash's invert + banks (stain on CENTRELINE CELLS
ONLY, edge-pinned -- the first render was a barcode). Watertreat's dry basins
joined the bed tiles free. Every family measured on the walked world first,
verified live, full form + board row + ART card.

THE ICON OVEN: bake 6 shipped -- farm rows ON the pad (the ground fit ignored
flat patches), the drive-in screen finally WHITE (two diseases: the frame stood
camera-side of the screen because +y faces the viewer, and SCREEN's palette can
never bleach by multiplication). THE INSTRUMENT THAT FIXED IT: a 1.7-second
single-hero probe (scratchpad hero_one.py pattern, rebuild if wiped) after three
73-160min blind bakes each. Wave 4 judged by probe: 8 of 10 remaining kills stand
on signature; MALL rebuilt low-and-blank (joined NOT_A_BUILDING + LOW_BY_NATURE),
WATERPARK slide tower is an open frame with 3 flumes exiting AT the deck edge on
bearings OFF the camera diagonal (dx~=dy projects as a vertical caterpillar).
BAKE 7 IS GRINDING as this ships, carrying: mall, waterpark, the landfill scale
house (was tunneling a bench), and the SQUINT/HUE twin cures (basin floor grades
dark, wash invert pale + stained over grey corridor, rail rides dark cess bands,
arterial draws the double yellow its palette always carried -- squint/hue were
red on main BEFORE this session; verified in a worktree). When bake 7 lands: wire
patch, icon gates by EXIT CODE, ship.

SUITE TRIAGE (worktree-verified): every other red reproduces on clean main --
RENDER PIXEL/FULL RES identical numbers, 19 stale LOOK pictures all CHARACTER
lane's, GRAVEYARD's 10 live refs are hair tokens, REUSE FIRST is the floor cook.

NEXT: (1) bake 7 lands -> verify pixels, wire, ship; (2) 5th composition audit;
(3) daily re-probe (12 landmark grounds STILL sealed: strip/casino/freeway/
speedway/resort/minigp/ballpark/interchange/strat/highroller/luxor/sphere;
trailer awnings unnamed -- pounce when WORLD names them); (4) session-dead, no
recook: strip, strip_x, minigp, dam; casino/resort CBB frozen until the Strip
exists. PENDING PAOLO: the act-one-approve vs other-act-approve explanation he
promised.

WORDS (words-8dqrnq): 8/27 (d) LATEST -- *** ALL 27 QUEST SCENES TALK LIKE PEOPLE NOW.
2.2% -> 89.3% contractions across the whole build. 819 of them applied by a tool that is
honest about being only ONE of the eight tells. TAB: WORDS. Nothing to judge. ***

THE 22 SCENES THE DEMO DOES NOT PLAY WERE STILL AT 0-11% CONTRACTIONS -- 873 lines of people
saying "I will walk it back". Hand-passing them would be four more sessions, and doing them
BADLY would be worse than leaving them, because a mechanical sweep over craft is exactly the
machine behaviour this lane exists to fight.

SO THE HONEST SPLIT: seven of the eight tells NEED A HUMAN READ -- cutting a sermon off the
end of a speech, giving somebody a question to ask, varying a rhythm, finding the one detail
only this person would name, putting the subtext under the line. A regex can do NONE of that.
ONE of the eight is spelling. "I will" -> "I'll" is not a stylistic choice a character made,
it is how people talk. tools/bohemia_contraction_pass.py does that half and nothing else.

*** A SCENE IT TOUCHES IS CONTRACTION-PASSED, NEVER VOICE-PASSED, AND THE GATE HOLDS THOSE
TWO WORDS APART ON PURPOSE. *** "We passed 27 scenes" would be the most flattering sentence in
this repo and it would be false. Only the five the demo plays are voice-passed, by hand, line
by line. THE NUMBERS PROVE THE DIFFERENCE: contractions went 2.2% -> 89.3% while sermons went
34.0% -> 32.1%. A pass that cut sermons would have moved the second number. This one could not
and did not, and the gate prints that sentence every run.

THE GUARDS, because a careless sweep breaks real lines:
  - never in a comment, a @STAGE, a @DO, or an @OPT's target and effects
  - never when either word is SHOUTED ("I do NOT" is not "I don't")
  - "have" only before a participle ("I have been" yes, "I have a name" no)
  - *** AND A CONTRACTED AUXILIARY MAY NOT END A CLAUSE. *** The first cut wrote "I can't
    promise I'll." into a scene. That is not English -- a stranded auxiliary always takes its
    full form. Negatives are exempt ("I don't." is fine). Nine unit cases, all passing.
  - the five hand-written scenes are named in the tool and skipped, gated.
Structure proved untouched on all 22: strip the player-facing lines out of both sides and the
files are byte-identical.

*** AND THE THIRD BROKEN RULER OF THE SESSION, CAUGHT THE SAME WAY AS THE OTHER TWO. *** After
the pass the sermon count fell from 33.5% to 18.1%. NOTHING HAD CUT A SERMON. The maxim
detector asked for the word "is", so contracting "That is the whole point" into "That's the
whole point" HID THE COPULA FROM ITS OWN DETECTOR. Fixed; the true number is 32.1%. Three
rulers this session, all broken in the flattering direction, all found by refusing to believe
a number that moved when nothing had been done to move it. That note is printed in the report.

GATE: gates/voice_gate.js, 90 checks. Nine green on the merged tree: voice, dialogue catalogue,
quest study, attempt, language, handoff, current slice, demo build, direct. Build 8/27u.

WHAT I WOULD DO NEXT, IN ORDER:
 1. VOICE-PASS THE 22 FOR REAL, worst-first by rhythm ratio: SIXTY SECONDS OF RAIN, THE COUNT
    THAT DOES NOT ADD, FIFTY-FIVE GALLONS A FOOT. The sermons are still in all of them and a
    machine cannot take them out. One scene per turn, by hand, like the demo five.
 2. THE SCREENS STILL OUT OF REACH: the journal, the objectives list, and EVERY FAILURE
    MESSAGE. A failure message is what a player reads at their worst moment and not one has
    ever been read as writing. (Checked: the refusal SOUND is a known SOUND-lane gap; whether
    there is refusal TEXT at all is the open question.)
 3. NOBODY EVER RAISES THEIR VOICE. Zero exclamation marks in 504 speeches. Still true.

WHAT IS PENDING HIM: nothing from this lane.

