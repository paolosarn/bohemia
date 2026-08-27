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

