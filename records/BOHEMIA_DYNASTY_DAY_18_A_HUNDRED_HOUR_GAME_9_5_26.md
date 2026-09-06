# DYNASTY STUDY -- ROUND 18 (Q16): WHAT A HUNDRED-HOUR GAME ASKS OF A PLAYER
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q16 [hundred hours], "real research on session length,
# return rate and what makes somebody come back to a long game on a phone; how
# the best long games shape the middle, which is where they die. Deliver where
# our hundred hours would sag and what fills it."
# Rounds 1-17: records/BOHEMIA_DYNASTY_DAY_1..17_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# REFERENCE LAW, OBEYED STRICTLY: the only reference game named in this record is
# BATTLE BROTHERS, and this row IS the campaign layer, which is its department.
# The completion research below is about specific titles by name in its own
# sources. I STRIPPED THE TITLES AND KEPT THE NUMBERS, so no game he has not
# named enters this study through the back door.

## 1. THE REAL AISLE -- THE ARITHMETIC IS BRUTAL AND IT IS NOT CLOSE
**SESSION LENGTH.** Across mobile in 2024-25 the median session runs **5 to 6
minutes**; the top quarter of projects reach **8 to 9**; a player averages about
**4 sessions a day**. Regionally the spread is small: about 6.85 minutes at the
top (Oceania) and about 5 at the bottom.
**RETENTION.** Day 1 averaged **27%** across all mobile games in 2025. Day 7's
median is **3.4% to 3.9%**, down from 4-5% in 2023, with the top quarter at 7-8%.
Day 30 runs **1% to 7%** depending on genre.
**AND THE HONEST COUNTERWEIGHT, WHICH I WENT LOOKING FOR ON PURPOSE.** Those are
market averages, not a law of the device. In China **46% of smartphone players
report sessions over an hour and one in five over two hours**; in Brazil **39%
report over an hour**. So a phone can hold a long session. What the median proves
is what the AVERAGE phone game gets, not what a phone can do.
### THE MULTIPLICATION
```
100 hours = 6,000 minutes.
at the 6-minute median          -> about 1,000 sessions   (~250 days at 4/day)
at a generous 30-minute session ->      200 sessions
```
> *** BETWEEN TWO HUNDRED AND A THOUSAND TIMES, SOMEBODY HAS TO DECIDE TO COME
> BACK. THAT IS THE MOST REPEATED ACTION IN OUR ENTIRE GAME. ***

## 2. THE REAL AISLE, PART TWO -- ALMOST NOBODY FINISHES A LONG GAME
Titles stripped per the reference law; the numbers are the sources' own.
- Average completion of primary single-player content, measured by the
  achievement that marks it: **about 14%. Roughly one player in seven.**
- **RPGs run about ten points BELOW that holistic average.** The best-loved big
  ones land near **one in four**.
- **LENGTH IS THE VARIABLE.** A 61-hour open-world campaign was finished by
  **15% to 17%** of the players who started it. Two 16-to-17-hour games of other
  genres sit near **50%**. Same era, same audience, four times the completion.
- Story achievements show a **visible step down at every chapter**.
### WHAT THAT MEANS FOR THE THREE GENERATIONS SPECIFICALLY
Our pillar is that the player lives all three. On the published curve for a game
of our length, **most people who start Bohemia will never meet the Angel.** Gen 3
is not the ending, it is the least-seen content in the game. That is not an
argument against it. It is an argument about where the money and the care go.

## 3. THE GAMES AISLE -- WHY THE MIDDLE IS WHERE THEY DIE
The craft writing is consistent and it agrees with the achievement step-downs.
- **THREE-ACT STRUCTURE DOES NOT SCALE.** The film shape is not adequate for
  pacing something that runs 8 to 100 hours. The middle of a hundred hours is
  not a second act, it is longer than most complete games.
- **MOVEMENT IS NOT PROGRESS.** The named failure is a middle that is busy while
  nothing has actually changed: systems churning alongside the plot instead of
  driving it. **A middle needs escalation, not activity.**
- **THE PLAYER STOPS DRIVING.** Middles sag when the character is reacting,
  following instructions, or waiting to be told something.
- **AND OUR CAMPAIGN REFERENCE ALREADY SETTLED THE ANSWER'S SHAPE** (BATTLE
  BROTHERS, the campaign layer, its own department): the evidence on goal
  distance is blunt. **Proximal sub-goals produce mastery and interest. Distal
  goals had no demonstrable effect.** A hundred-hour horizon motivates nobody.
  A week's horizon does.

## 4. *** THE MEASUREMENT ***
### 4a. THE MIDDLE IS THE THINNEST PART OF OUR OWN DESIGN
Counted two ways, in two directories, with two spellings, in case one was a
counting artefact. It is not.
```
                        act 1     act 2     act 3
boss ladder (numerals)     20        12         7
laws/ (numerals)          145        57        86
laws/+records/ (words)    111        29        49
```
**ACT 2 LOSES EVERY COUNT.** The least-written act in our canon is the middle,
and the middle is the measured place long games die. We are thinnest exactly
where the danger is.
### 4b. NOTHING IN THIS GAME KNOWS HOW LONG YOU HAVE PLAYED
Searched the engine and the alpha for playtime, play_time, hoursPlayed,
totalTime, minutesPlayed, elapsedTotal. **ZERO HITS.** (Control: 89 hits for
"hour" in the engine, and they are golden hour, wake times and comments.)
**We claim a hundred hours and own no instrument that could ever tell us the
middle sagged.**
### 4c. THE RETURN IS NOT BUILT, AND ITS SCRIPT IS ALREADY WRITTEN
- Searched every slice for a returning-player surface: welcome back, when you
  left, while you were gone, what you were doing. **ZERO.**
- AND THE RECAP EXISTS AS CONTENT. **27 quests are baked into the alpha carrying
  164 rows of `kind: "journal"`** -- first person, past tense, one per stage,
  exactly what a returning player needs. *"Put the current back myself. Block has
  light tonight. Nobody knows it was me."*
- **THE ONLY CODE IN THE REPO THAT READS `kind==='journal'` IS THE DIRECTOR
  TOOL PAOLO WRITES THEM IN.** Not one of those 164 lines is ever shown to a
  player.
> *** THE MOST REPEATED MOMENT IN A HUNDRED-HOUR GAME IS COMING BACK, AND OUR
> RECAP FOR IT IS ALREADY WRITTEN, IN HIS VOICE, WITH NO READER. ***
### 4d. SAY THE GOOD PART, AND IT IS VERY GOOD
- **THE SAVE IS THE BEST-ENGINEERED THING I HAVE MEASURED IN THIS REPO.** Two
  slots with a generation counter so the newest good save is never the write
  target, an FNV-1a checksum plus byte length verified on load, tombstones that
  poison a failed slot so a stale save can never resurrect ("never a time
  machine"), and a probe sized to the REAL save instead of one byte. Driven by a
  gate against a hostile fake browser.
- **AND THE HARDEST CONSTRAINT ON A HUNDRED-HOUR PHONE GAME IS ALREADY
  ANSWERED.** WebKit deletes all script-writable storage after **seven days**
  without interaction. In the gate's own words: *the platform put a run timer on
  a game whose first law is that there are no runs.* RUN shipped the only
  exemption there is, the home screen install, on 9/5.
### 4e. THE MIDDLE HORIZON IS BUILT, REACHABLE, AND CAPPED BY A PENDING
Verified live today, not quoted from the 8/28 law: the mandate ladder is inlined
on the walked surface behind a real **◆ STANDING** button and reads live
standings, three rungs mapping to the three acts. And
`slices/BOHEMIA_CITY_WORLD.html:11031` still reads:
```
var MAYOR_SHARE = null;   // [PENDING Paolo: "enough done, enough love" is not a number]
```
**So it tops out at two rungs of three.** The one structure in this game that
answers "what am I working on this week" is finished, on the surface, and stuck
on a ruling. And section 3 says the week's horizon is the ONLY goal distance
with demonstrated effect. **A pending is sitting on the working part.**
### 4f. AND THE SPINE IS SEVEN SHORT OF THE PILLAR
The pillar is 60 mini bosses, each handing a verb. The live ladder is **v7, 53
candidates**, and its own header says *"a pool to cut from, not a shipping
list."* 53 candidates, 60 slots, none confirmed.

## 5. *** THE FINDING THAT PROVES US WRONG ***
> **WE ARE BUILDING THE HOUR AND THE GAME IS MADE OF RETURNS.**
> Between 200 and 1,000 times a player has to reopen this thing and remember why
> they cared. We have built the fight, the city, the streets, the faces, the
> clothes, and a genuinely excellent save. **We have built the coming back zero
> times.** The save protects the STATE perfectly and nothing anywhere protects
> the INTENT.
AND THE SECOND ORDER OF IT: a save that survives is not a player who returns.
Those are two different problems and we have solved exactly one.

## 6. THE ROW'S DELIVERABLE: WHERE THE HUNDRED HOURS SAGS, AND WHAT FILLS IT
### WHERE IT SAGS, IN ORDER OF DANGER
1. **THE MIDDLE OF ACT 2.** Measured thinnest in every count (4a), and the
   place the craft says long games die. This is the big one.
2. **EVERY RE-ENTRY, 200 TO 1,000 OF THEM.** Nothing greets a returning player
   and nothing reminds them what they wanted (4c).
3. **THE WEEK.** The only goal distance that works is capped at two of three
   rungs by a pending (4e).
4. **ANY LONG BREAK.** The seven-day rule is answered by the home screen, but a
   player who comes back after two weeks still walks into a world with no memory
   of their intent even when the save is intact.
5. **ACT 3 IS THE LEAST-SEEN ACT IN THE GAME** on the published completion
   curve (2), and it is the one carrying the Angel.
### WHAT FILLS IT (mechanism only. every number, name and word is HIS.)
- **THE RETURN IS A SCENE, AND IT COSTS ONE FILE.** Round 12 measured that a
  scene is one file and no new engine code. The content is the 164 journal lines
  we already wrote. THE LAST THING YOU DID, IN YOUR OWN VOICE, BEFORE THE WORLD
  COMES BACK UP.
- **THE MIDDLE IS A WEEK, NOT A HUNDRED HOURS.** The ladder exists. Unblocking
  the top rung is a ruling, not a build.
- **THE MIDDLE MUST ESCALATE AND OURS ARITHMETICALLY CANNOT.** Round 9 measured
  that our city can only get nicer: no `-=` and no `Math.min` anywhere in the
  fold, and `districtTexture` climbs one way only. A middle that cannot get
  worse is the exact "movement without progress" failure from section 3. **THE
  MIDDLE SAG AND THE MISSING SUBTRACTION ARE THE SAME BUG.**
- **AND THE LEDGER THAT CANNOT BE SETTLED IS THE THIRD FACE OF IT** (round 17):
  nothing resolves, so nothing in the middle can ever conclude.
- **MEASURE IT.** One counter for time played would tell us whether any of this
  is true in the built game. We have never had one.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **RUN or UI -- THE-RETURN-IS-A-SCENE.** The single highest-frequency moment in
  the game, unbuilt, with its script already written and one reader missing.
  Tab: RUN.
- **WORLD -- THE-MIDDLE-CAN-GET-WORSE.** Rounds 9, 17 and this one are three
  faces of one missing subtraction. This is now the third time this lane has
  routed it and the second time it has been the largest gap on the board.
- **THE PLUMBER -- ONE PLAYTIME COUNTER.** Small, fast, and it is the only way
  any claim in this record ever gets tested on the real surface.
- **[PENDING Paolo, carried by the coordinator]: `MAYOR_SHARE` has been null
  since 6/30.** It caps the only motivation structure the research supports. It
  is his ruling and nobody else's, and it is not a technical question: it is
  "how much of the valley is enough to be the mayor."

## 8. CONFIDENCE
- Every count in section 4 (the act spread in three cuts, zero playtime hits,
  zero welcome-back hits, 27 quests, 164 journal rows, the sole `kind==='journal'`
  reader being the director tool, `MAYOR_SHARE` null at line 11031, the save
  module's own text, the ladder's 53): **MEASURED today.** Scope: engine/ and
  slices/ both swept this round, which is the scope failure round 6 taught me.
- Session length, D1/D7/D30 retention: mobile analytics benchmark reports.
  **MEDIUM-HIGH.** They are industry aggregates over free-to-play mobile, which
  is not our shape, and I have said so rather than pretending they transfer
  cleanly. The over-an-hour regional figures are survey self-report, which is
  weaker still, and they are the reason I did not conclude "a phone means six
  minutes."
- Completion rates from achievement data: **MEDIUM-HIGH** in direction, softer in
  precision. Achievement telemetry undercounts (offline play, no-achievement
  platforms) and the samples differ between sources. The DIRECTION -- longer
  means far fewer finish -- is consistent everywhere I looked.
- The middle-sag craft writing: design and story-craft essays, not measurement.
  **MEDIUM**, used as a description of a known failure rather than as evidence.
- Section 5, section 6, and the claim that the middle sag and the missing
  subtraction are the same bug: **MINE.**

## SOURCES
REAL AISLE: mobile gaming benchmark reports for 2025-26 on session length,
sessions per day and D1/D7/D30 retention; published analyses of game completion
rates derived from achievement and trophy data, including the length-versus-
completion comparison (titles deliberately stripped under the reference law);
survey data on smartphone session length in China and Brazil; and design and
story-craft writing on second-act pacing failure in games. IN-REPO:
records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md; laws/ and records/ act counts;
engine/bohemia_save.js; gates/home_screen_is_the_save_gate.js;
slices/BOHEMIA_ALPHA_0_9.html (the quest corpus and the director tool);
slices/BOHEMIA_CITY_WORLD.html:11031 (MAYOR_SHARE);
laws/BOHEMIA_ADDENDUM_BATTLE_BROTHERS_AND_THE_GAMBIT_8_28_26.md (the campaign
layer, its own department); and rounds 9, 12, 16 and 17 of this study.
