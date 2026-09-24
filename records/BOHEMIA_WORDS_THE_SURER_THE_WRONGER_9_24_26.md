# WORDS 9/24 -- THE SURER THE WRONGER: THE HEDGE WAS BACKWARDS, AND 749 OF 800
# RETELLINGS CAME OUT OF ONE POOL OF TWO SENTENCES

**LANE** WORDS (12). **MODE** SCHOOL THEN WRITE (Paolo 9/6). This is the WRITING
round; the school is `records/BOHEMIA_WORDS_Q17_WHAT_A_DISTORTED_RUMOUR_SOUNDS_LIKE_9_5_26.md`
(shipped 9/5, before the mechanism it describes existed). The mode requires this
record to name WHICH finding from school changed how the lines were written. Two
did, and they are named in section 3.

**COOK** THE SURER, THE WRONGER -- six frames off the real glass, in VOTE.
**RULE 29** obeyed: this is not a text item. The thing is the street talking, and
the item is six pictures of it.

---

## 1. WHY THIS ROW, AND THE BLOCKER MEASURED FIRST (rule 12)

Both lines this lane holds OPEN were measured again this round and both are still
blocked, for the fourth round running:

- `[naming screen]` waits on DYNASTY `[three names]`, which is still OPEN and
  unclaimed on the board, and a sweep of the alpha and the engine for a naming
  screen returns nothing. There is no mechanism and nothing to write into.
- `[reputation lines]` lives inside the fight, and COMBAT is under rule 17,
  FROZEN TO THE LOOK, with `[fight looks]` claimed.

So the round went where the pattern has gone three times running and been right
three times: **find a mechanism another lane already built whose data says
something the words do not.** PEOPLE shipped `[rumours travel]` (bdf72021) two
rounds ago. It works. What comes out of the mouth does not.

## 2. THE MEASUREMENT, BEFORE A LINE WAS CHANGED

800 retellings driven through `BohemiaStanding.retell` on a 24-person block, the
engine's own code, nothing stubbed:

```
retellings measured : 800
still the truth     :  51   6.4%
blame moved         : 322  40.3%   (the wrong man)
the act grew        : 273  34.1%   (a smaller thing became a bigger one)
the place went      : 659  82.4%
the hour went       : 498  62.3%

the sentence the shipped words picked
  saw    :   0
  heard  :  51
  vague  : 749      <-- 93.6% of everything this city ever passes on
```

**FOUR DIFFERENT THINGS WENT WRONG AND THE STREET HAD ONE VOICE FOR ALL OF THEM.**
`retell()` writes down exactly which part broke -- `truly`, `grew`, `vague.where`,
`vague.when`, and PEOPLE's own comment beside it says a surface that cannot say
WHICH part is wrong "can only say 'probably the wrong version' and mean nothing".
Then `ctRumourLine` asked `isWrong(d)`, a single boolean, and threw the other
three bits away. The distinction was computed 1,752 times and spent nowhere.

**AND THE EYEWITNESS FRAME WAS UNREACHABLE: 0 of 800.** `saw` was bound to hop 0,
so the moment a story was passed on once, nobody could ever say they saw it again.

## 3. THE TWO FINDINGS FROM SCHOOL THAT DECIDED THE WRITING

The mode says name them. These are the two, and the second one is the round.

**(1) THE HEDGE WEARS OFF BEFORE THE CLAIM DOES.** Q17 section 2: the sleeper
effect, 72 experiments, the discounting cue and the message come apart in memory,
so "somebody told me and I don't believe him" becomes "the pump ran past dark".
Doubt is the FIRST thing a retelling loses. **Our city did the exact opposite: it
ADDED doubt as a story travelled.** Every frame is now surer with distance, not
vaguer. That is a straight reversal of what shipped, and it came from the record,
not from taste.

**(2) AT THREE HOPS SOMEBODY SAYS "I SAW IT" AND IS NOT LYING.** Q17 called this
"the best line in this round" nineteen rounds ago: source monitoring failure,
people confuse what they were told with what they watched. **The shipped code made
that line structurally impossible.** It exists now, as the `sure` frame, and it is
the only frame in the set that can say something frightening: *"The scavenger
squeezed somebody. I was there, or near enough."*

**AND THE RULE THAT FALLS OUT OF BOTH, WHICH IS THE ACTUAL WRITING DECISION:**
**A TELLER ONLY HEDGES ABOUT THE PART THEY KNOW THEY LOST.** The place and the
hour are holes a person can feel, so those get an honest hedge. The wrong man and
the bigger act are wrong in ways **nobody in the chain knows about**, so they come
out flat, in the same voice as the truth, with no warning at all. Measured on the
new words: **339 stories carry the wrong man and 0 of them hedge about him.** That
is not a defect, that is the point. Everybody on the street is honest and the
story is still wrong.

## 4. WHAT WAS WRITTEN

Six frames instead of two. English on purpose -- the ambient register cap of 532
lines is Paolo's 8/26 ruling and this lane does not raise it.

| frame | when it fires | what it sounds like |
|---|---|---|
| `saw` | hop 0, really watched it | The scavenger never paid somebody back. I was standing right there. |
| `heard` | passed on, still true | They say the scavenger never paid somebody back. |
| `where` | the place slid, and she knows | The scavenger never paid somebody back, somewhere down that way. |
| `when` | the hour went, and she knows | The scavenger never paid somebody back, some night this week. |
| `flat` | wrong, and nobody can know | The scavenger squeezed somebody. Ask anybody on this street. |
| `sure` | three hops out, the doubt is a scrap | The scavenger squeezed somebody. I was there, or near enough. |

**"ASK ANYBODY ON THIS STREET" IS NOT BRAVADO, IT IS THE MECHANISM SAID OUT LOUD.**
Q17's first finding was socially shared retrieval-induced forgetting: a street does
not end up with many partial versions, it ends up with ONE version and everybody
has the same hole in the same place. `retell()` copies the story whole, so asking
anybody really does get you the same wrong story. The line is true about the
machine and a lie about the world.

**AND THE INVENTED HALF IS A REASON** (Bartlett 1932, rationalisation in almost
every chain; Q17 section 2): a teller who cannot make a piece fit does not drop it,
they EXPLAIN it, and the explanation is something they already believed. So a
story that GREW arrives carrying a cause it never had, and the cause is this
street's own assumption: *Nobody does that for free. / Rent does that to people. /
It was always going there.* Only on grown stories, never on the truth. That is the
half that teaches the player where they are.

## 5. THE PROOF, ON THE CITY'S OWN HOP BUDGETS

Not a made-up chain: `hopsFor` off the walked city's real clout table, so a quiet
deed gets 1 hop, a notable one 3, a risky one 4. 1,360 lines built.

```
dead lines                     0
over the 98-character ceiling  0
"somebody" twice in one line   0
lowercase after a full stop    0
longest / shortest             98 / 37

every frame, and whether the street can reach it
  saw    400 REACHABLE      when   108 REACHABLE
  heard  102 REACHABLE      flat    61 REACHABLE
  where  369 REACHABLE      sure   320 REACHABLE

the invented reason   said 233   dropped for the ceiling 11
the wrong man         339 stories carry him, 0 hedge about him
```

**AND A SHAPE FELL OUT THAT I DID NOT DESIGN.** Broken down by how loud the deed
was, a **quiet** deed never reaches `sure` at all -- it dies before three hops. So
the only mouths that ever say *"I was there, or near enough"* are talking about a
notable or risky deed. **The story that travels furthest is the one somebody ends
up believing they watched.** That is PEOPLE's clout ladder and Q17's sleeper
effect agreeing without being introduced.

**THE 98-CHARACTER CEILING IS NOT A STYLE RULE AND IT IS THIS LANE'S OWN (Q4).**
`barkHold()` is `(length / 14) * 1000` ms clamped at 7000, so a bubble past 98
characters is held exactly as long as a 98-character one: every letter after that
is time the reader does not get. A reason that would cross it is DROPPED rather
than shortened into mush. That dropped 11 of 244.

## 6. AND I REWROTE A GATE LEG THAT WAS A RULER FAILURE, WITH A MUTATION TO PROVE IT

PEOPLE's `rumours_travel_gate.js` went RED on the new words, and it was right to
fire and wrong about why. The leg read:

```js
/wrong version|Don't ask me where/.test(spoke.wrongLine)
```

**IT DID NOT ASK WHETHER THE WRONG VERSION SOUNDED WRONG. IT ASKED WHETHER THE
WORDS LAYER STILL CONTAINED TWO EXACT STRINGS.** That is the ninth entry in this
lane's ruler-failure series: a ruler believed because it produced a number. It
would have stayed green on a line that said "probably the wrong version" and
nothing else, and it went red the moment the words got better. Worse, it was
wrong on purpose and not just brittle: **a test that demands a hedge in the wrong
version bans the truest line in the set**, because school says the most distorted
stories are the ones said with the most confidence.

**IT NOW TESTS THE THING.** Two of the six frames are the ones a first-hand,
still-true story gets. A wrong story must never land in either. That property
holds for every sentence anybody ever writes into those pools and cannot be passed
by pasting a magic phrase. The frame is carried out on `__RUMOUR_SAID` beside the
text so a gate and a mouth read ONE fact.

**MUTATION PROVED, because a gate I cannot make fail is not a gate.** Forcing the
frame picker to return `heard` for every wrong story: `RED: 60 passed, 1 failed`,
and the failure names the frame it caught (`[frame: heard]`). Restored: `GREEN: 61
passed, 0 failed`.

## 7. GATES

```
RUMOURS TRAVEL      61 /0   (on the real glass, the new leg mutation-proved)
LANGUAGE            85 /0
VOICE              114 /0
DIALOGUE CATALOGUE  63 /0   (3148 lines across 51 sources)
ATTEMPT             15 /0
NO SHOTS IN REPO     4 /0   (the shooter lives outside the repo, which is why)
```

## 8. WHAT THIS DOES NOT PROVE, STATED

- **It does not prove any line is good.** Six frames, twelve sentences, all
  `draft:true`, all his to kill. The pictures are in VOTE so he can.
- The three invented reasons are attempts. What this street actually believes is
  canon and it is his.
- `CT_RUMOUR_ACT` still has ONE phrase per kind, eight in total. A block raising
  109 stories a day will repeat an act phrase often. Not touched this round: the
  frames were the defect worth the round, and widening the act table is a separate
  measurement about repetition, not about sounding wrong.
- Nothing in the mechanism was touched. `retell`, `DRIFT`, `LOUDER` and `isWrong`
  are PEOPLE's and are unchanged; this round only decides what a mouth does with
  what they already compute.

## ROUTED
- **PEOPLE** -- the frame picker exports `band` on `__RUMOUR_SAID`. If anything
  else ever wants to know how sure a speaker sounded, it reads that, not the text.
- **WORDS, next** -- the act table's eight phrases against a block that raises 109
  stories a day is the repetition question, and it is a measurement first.
