# WORDS Q23, ROUND ONE: SCHOOL -- THE LINE IS A CONCLUSION WITH NO EVIDENCE, AND
# THE DIRECTION IS ALREADY IN THE DATA
# VAMILY school round, 9/13/26, lane WORDS (words-8dqrnq).
# MODE: SCHOOL THEN WRITE (Paolo 9/6, LOCKED). Round ONE of two.
# *** NO TEST LINES ARE WRITTEN IN THIS FILE. Not one. Round two writes them and
# must name which finding below changed them. ***
#
# The row, verbatim: [track words] Q23 How the street says SOMEBODY CAME THROUGH
# HERE. FACTIONS [tracks read] (1ced8e51) shipped one line as an attempt:
# 'Anarchists came through here just now. a patrol, and they are close.' School
# first: how trackers and scouts actually report sign (age, number, direction,
# gait; hunters, border guards, infantry scouts), what a townsperson says instead
# of a tracker; then write the family, Spanglish, draft:true, speaking only when
# the answer changes. Tab: RUN. (coordinator 9/13)

## THE SHORT VERSION
**A real report separates what was SEEN from what it MEANS, and our line is all
meaning and no seeing. It names the faction, which is the single hardest thing to
read off the ground, and leaves out the two things a tracker always has: how old
and which way. And the which-way is not missing from the game, it is missing from
the sentence: the track record already carries the leg the party is on, out or
back, and the line throws it away.**

## 1. THE FINDING THAT PROVES US WRONG, AND IT IS DOCTRINE, NOT TASTE
The army's standard spot report is SALUTE: **S**ize, **A**ctivity, **L**ocation,
**U**nit, **T**ime, **E**quipment, sent within five minutes of the observation. The
part that matters for writing is the instruction attached to it: the report is
brief, accurate and clear, and **facts and opinions are distinguished**. Observation
is kept separate from interpretation, by doctrine, because an inference passed on as
an observation cannot be re-checked by the person receiving it.

Our shipped line is:

    Anarchists came through here just now. a patrol, and they are close.

Map it onto SALUTE and the shape of the problem is visible at once:
- **Unit: ANARCHISTS.** Present, and it is the one element on the list that cannot
  be read off the ground (see 2.3).
- **Activity: A PATROL.** Present.
- **Time: JUST NOW.** Present, as an adverb rather than as evidence.
- **Size: MISSING.**
- **Location: implied by standing on it**, which is fine.
- **Equipment: MISSING**, and reasonably so.
- **And the inference "they are close" is delivered in the same breath as the
  observations, with nothing marking it as the conclusion it is.**

**So the line hands over the answer and hides the working.** The working is the part
a player can act on, argue with, or be wrong about.

## 2. HOW A TRACKER ACTUALLY REPORTS, WHICH IS ALL WORKING
The US Border Patrol's term for this is **cutting sign**. "Sign" is evidence of
recent passage: a tire track, a footprint, a broken branch. "Cutting" is the act of
searching for it, finding it, and understanding it, and trackers are called sign
cutters.

**2.1 AGE IS READ FROM WHAT HAPPENED ON TOP OF THE PRINT.** Morning dew, a previous
rain, and small animal tracks crossing the print all date it. **This is the single
most useful thing in this record for a writer**, because it means age is never
asserted, it is always evidenced: the print is older than the dew or newer than it,
the beetle walked over it or did not. A tracker does not say "an hour ago", he says
what has and has not happened to the print since.

**2.2 NUMBER AND GAIT COME OFF THE SPACING AND THE SHAPE.** Distance between steps,
the pattern of the steps and the type of footwear are read together. Trackers keep
**footprint cards**: photographs and measurements of a print, from which they work
out shoe size, footwear type, an idea of bodyweight, and the person's gait.

**2.3 IDENTITY IS AN INFERENCE FROM FOOTWEAR THAT DOES NOT FIT, AND IT IS EXPLICITLY
FLAGGED AS A GUESS.** In the Border Patrol material, small shoes suggest women or
children; cheap sandals suggest the poorer end of the crossing population; and
**combat boots with newer tread are described as a yellow flag, meaning somebody
outside the normally encountered group.** That is exactly how a faction would be
guessed in our valley, and note what it is: a flag, a thing to be careful about, not
a name stated as fact. **Our line states the name as fact and shows none of the
footwear.**

## 3. WHAT A TOWNSPERSON SAYS INSTEAD, AND IT IS THE MIRROR IMAGE
A person who lives on the street does not cut sign. They report what they saw and
they date it against their own day rather than against the weather. So the split
falls out cleanly and it is a design, not a flourish:

- **THE GROUND KNOWS HOW MANY AND WHICH WAY AND HOW LONG AGO. IT DOES NOT KNOW WHO.**
- **A PERSON KNOWS WHO. THEY ARE VAGUE ABOUT HOW MANY AND HOW LONG AGO.**

Which means the faction name belongs in somebody's mouth and the sign belongs to the
street, and our line currently puts a person's certainty into the ground's mouth.

## 4. OUR OWN BUILD, MEASURED
**4.1 THE CORPUS HAS NO TRACKER REGISTER AT ALL.** 3,093 spoken lines:
- **sign read as evidence: 7 hits, and reading all seven, NOT ONE is somebody
  reading the ground.** They are idioms ("keeping track", "I do not keep track of
  who is doing what to who") and clothing ("boots that have been resoled twice").
- **age given as evidence: 0 of 3,093.** Nobody in this game has ever said how they
  know how old something is.
- direction: 13 hits, and reading them they are movement ("I'm going up"), not a
  report of where somebody went.
- graded confidence: 17 hits, all general uncertainty, none of it about evidence.

**4.2 AND THE DATA AUDIT, WHICH IS THE USEFUL HALF.** Read out of the engine rather
than assumed, because round two may only write lines the game can say truthfully.
`tracksAt()` returns, for the cell you are standing on:

| field | what it is | in the shipped line? |
|---|---|---|
| `faction` | whose party laid the track | **yes** |
| `agenda` | crew, caravan or patrol | **yes** |
| `age` | steps since they were here, 0 = standing here | as "just now" |
| `leg` | **`out` or `back`: WHICH WAY THEY ARE GOING** | **NO** |

And the party behind it also carries `from` and `to` (real seats on his map),
`toward`, and the town's `tier` and `power`.

- **DIRECTION IS ALREADY COMPUTED AND THROWN AWAY.** `leg` is the difference between
  a party walking away from its own town and one walking back to it, which is the
  difference between something moving off and something coming home. It is the one
  thing on the list a player can act on, and the sentence does not use it.
- **THE FRESHEST TRACK WINS, and the engine's own comment is already the image:**
  "two parties crossing the same cell is one set of prints on top of another, and
  the one on top is the one you read." That is 2.1 written by another lane without
  the research, and round two should use that comment's own words.
- **THERE IS NO HEADCOUNT ANYWHERE.** A party has a faction, a tier and a power, and
  no number of people. **So any line that says how many is a lie**, and the honest
  tracker move when you cannot count is to say what the ground does show.

## 5. WHAT SCHOOL LEAVES ME HOLDING FOR ROUND TWO
1. **SEPARATE THE SEEING FROM THE MEANING.** If a line carries a conclusion it must
   be audibly a conclusion, and the observation comes first.
2. **AGE IS EVIDENCE, NEVER AN ADVERB.** What has happened to the print since, not
   "just now".
3. **DIRECTION IS IN THE DATA AND IS THE MOST PLAYABLE THING THERE.** Out or back.
4. **IDENTITY IS THE WEAKEST READING AND MUST SOUND LIKE A GUESS**, the way a boot
   tread that does not belong is a yellow flag rather than a name.
5. **NO NUMBER, EVER**, because the game does not know one.
6. **THE GROUND AND A PERSON KNOW DIFFERENT HALVES**, so the faction's name wants a
   mouth, and the family should include what a neighbour says instead.
7. **AND IT SPEAKS ONLY WHEN THE ANSWER CHANGES**, which the row asks for and the
   shipped code already does, including the care not to wipe another system's
   sentence off the shared line.

## ROUTED
- **WORDS** Round one is done. Round two writes the family, Spanglish, draft:true,
  and names which of the seven above changed the lines. No test lines here.
- **NOTHING IS ROUTED TO ANOTHER LANE THIS ROUND.** School produces knowledge, not
  jobs. Findings 3 and 5 plainly touch FACTIONS, who own the track (1ced8e51): one
  says a field they already compute is going unused, the other says a headcount does
  not exist. Both get routed properly in round two alongside written material, the
  way Q19 through Q22 did.

## SOURCES
- SALUTE / spot report doctrine: Size, Activity, Location, Unit, Time, Equipment;
  submitted within five minutes of observing; the body brief, accurate and clear
  with **facts and opinions distinguished**.
- US Border Patrol sign cutting: "sign" as evidence of recent passage and "cutting"
  as searching, finding and understanding it; age read from morning dew, previous
  rain and small animal tracks over the print; step distance, step pattern and
  footwear read together for number and gait; footprint cards recording shoe size,
  footwear type, bodyweight and gait; and identity inferred from footwear that does
  not fit, with combat boots on newer tread named as a yellow flag for somebody
  outside the usual group.
- Our own build: records/BOHEMIA_WORDS_BOOK.json (3,093 spoken lines, every hit in
  the five counts above read by hand), engine/bohemia_towns.js `trackOf` and
  `tracksAt`, engine/bohemia_parties.js `mk`, and the shipped line in
  slices/BOHEMIA_CITY_WORLD.html.
