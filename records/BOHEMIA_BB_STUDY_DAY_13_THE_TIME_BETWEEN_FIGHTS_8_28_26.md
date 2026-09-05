# BB STUDY — DAY 13: THE TIME BETWEEN FIGHTS
# (coordinator, on his trigger. Days 1-12: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE SUBJECT: EVENTS. And it lands on his loudest playtest complaint.

## 0. THE QUESTION
Most of a campaign in the game he named is **not fighting.** It is
travelling, camping, repairing, hiring, and reading small things that
happen to you. And his 8/25 dispatch said: *"THE CITY SEEMS DEAD ASF AND
I DONT LIKE THIS BEING THE DEFAULT."* So: **what fills the time between
fights, and why does ours feel empty?**

## 1. BB'S EVENT SYSTEM, AND THE PART THAT TRANSFERS IS NOT THE COUNT
They shipped **47 events** in the first pass, described as *"a vertical
slice of what we want to ultimately achieve... showing a bit of
everything."* They are things you stumble on while travelling, things
that need you to be somewhere specific, and — the important kind —
**things that require characters of certain backgrounds or traits in your
party.**
And the designers said what that is for, in a sentence that closes the
loop with day 8:
> *"a lot of events will change depending on what backgrounds or traits
> your Battle Brothers have, it'll also add a layer of complexity to
> character backgrounds **beyond just their different stats**."*
### THE MECHANISM, STATED PLAINLY
**THEY DID NOT SOLVE A THIN EVENT BENCH BY WRITING MORE EVENTS. THEY GAVE
EVENTS MORE THINGS TO KEY OFF.** One event, seen through who is standing
next to you, is many events. That is FACTORY LAW applied to moments, and
it is the same shape as our five-archetypes-times-a-modifier-table
bestiary.

## 2. THE SHELF, MEASURED — AND IT IS BETTER BUILT THAN I EXPECTED, WHICH
## MAKES THE NUMBER WORSE
The walked surface has a real roadside director: `walkDirector()`,
`walkInterrupt(spentSeconds)` pulled from the walked step *"with the
seconds that step cost, which is the same clock everything else in this
game spends"*, a per-district table, a repeat lockout of an hour of
walking (~700 cells), and **NO GLOBAL SPAWNS EVER** — if a district has no
row, nothing fires. It refuses to announce an animal that is not actually
drawn on the glass. This is careful work.
### THE ROSTER IS TWELVE, AND THE MIX WANTS 70% OF ITS MOMENTS FROM THREE
`engine/bohemia_encounters.js`, counted:
| kind | count | which |
|---|---|---|
| **ambient** | **3** | coyote shadow, ghost robotaxi, patrols collide |
| interactive | 5 | rattlesnake, scavenger shakedown, toll crew, the snatcher, spotter drone |
| forced | 4 | feral dog pack, crazed wanderer, bounty squad, casino security bot |
And the target mix, in the module's own constant:
`var MIX = { ambient: 0.70, interactive: 0.20, forced: 0.10 };`
**THE DESIGN ASKS FOR 70% OF ITS MOMENTS OUT OF 25% OF ITS CONTENT.**
And the module is RIGHT to refuse to fake it: *"if the story wants an
ambient beat and no ambient token is available here, the answer is that
NOTHING [fires]"*, because a forced fight standing in for an ambient beat
breaks the promise the mix makes. A measured run came out **40/42/18
instead of 70/20/10.**
Its own comment already names the consequence and the reason it was not
fixed:
> *"off the road the coyote was the ONLY ambient beat in the game... a
> district with no coyote in it had no ambient token at all and went
> silent for seven beats in ten... a THIRTEENTH encounter would be his,
> and there is not one here. The thin ambient bench is written down as a
> finding rather than fixed by invention."*
**THAT REFUSAL IS CORRECT AND IT IS ALSO A DEAD END** if the only way out
is more canon. It is not the only way out.

## 3. THE OTHER AISLE — WHY DENSITY WILL NOT FIX "DEAD"
The best-established finding about how people remember an experience:
- **THE PEAK-END RULE.** People evaluate a past experience on a small
  number of emotionally intense snapshots — **the most intense moment and
  the final moment** — and neglect the rest.
- **DURATION NEGLECT.** Ratings *"correlate almost perfectly with the
  average of the peak moment and the final moment, and correlate NEAR-ZERO
  with total duration."*
- The landmark experiment is the cold-water one: people preferred a
  LONGER unpleasant experience that ENDED slightly better, and chose to
  repeat it. More total discomfort, better memory.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**HE SAID THE CITY IS DEAD, AND WE WROTE DOWN THAT THE FIX IS MORE
PEOPLE.** The dispatch's item 5 is "the default population goes up", which
is HIS RULING and stands — a valley where you meet nobody without trying
is wrong and it should be fixed.
**BUT DENSITY CANNOT BE THE ANSWER TO "DEAD", BECAUSE MEMORY DOES NOT
AVERAGE.** Doubling the crowd raises the FLOOR of every minute and moves
the PEAK by nothing, and the peak plus the end is what a hundred hours
will be remembered as. Our own build already measured the shape of the
real problem and it is not headcount: **the ambient bench is empty seven
beats in ten**, so the moments that were supposed to carry 70% of the
felt life of the valley mostly do not happen at all.
**A CITY FEELS ALIVE BECAUSE THINGS HAPPEN IN IT, NOT BECAUSE PEOPLE ARE
STANDING IN IT.** One driverless car rolling through a dead suburb at
06:40 does more than forty more bodies on the sidewalk, and we have that
car — it just has almost nothing to stand beside.
### AND THE WAY OUT DOES NOT COST HIM A SINGLE RULING
The bench is thin because we counted CONTENT. **Count COMBINATIONS
instead.** The twelve are his and stay twelve. What multiplies them is
what they can key off, and every one of those keys is a mechanism we
either have or have already routed:
- **WHO IS THERE** — the former trade (day 8). A ghost robotaxi rolling
  past a man who used to park them for a living is a different moment.
- **WHOSE BLOCK IT IS** — the circuit owner (day 6). Patrols collide
  reads completely differently on a seam.
- **WHEN** — the hour, and the day's own clock, which the director is
  already spending.
- **WHAT YOU DID** — the standing web (day 1) and what you are known for.
**ONE APPROVED AMBIENT BEAT SEEN THROUGH FOUR KEYS IS NOT ONE MOMENT.**
That is MECHANISM-MINE / CONTENTS-PAOLO'S working exactly as written: we
multiply, he names. And if he ever wants a thirteenth encounter he can
have one, whenever he feels like it, without anybody blocking on it.

## 5. THE SECOND HALF OF PEAK-END, WHICH IS FREE AND NOBODY HAS USED IT
**THE END IS HALF THE MEMORY, AND OUR DAY ALREADY HAS AN END.** The
reckoning card is the last thing a player sees every single day, and day 7
measured what it currently says: steps taken, districts stood in,
buildings entered, the job outcome, and what you were paid. **A RECEIPT.**
The research says that card is carrying half the emotional weight of the
entire day. It should be the day's best MOMENT, not its inventory —
which is exactly what day 7's BB-WHAT-YOU-OWE was already reaching for
from a different direction. **Two days of this study converge on the same
card, and it is the cheapest surface in the game.**

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** events that key off WHO IS WITH YOU, not just where you are;
the roadside director's refusal to substitute, which is right and stays;
the mix as a promise rather than a suggestion; and the day's end treated
as a moment because the research says it is half of what gets remembered.
**REFUSE:** inventing a thirteenth encounter (canon is his, and the lane
that refused was correct); density as the answer to deadness, because it
raises the floor and never the peak; and ambience as wallpaper — a beat
that nobody remembers did not happen.

## 7. ROUTED
- **WORLD / PEOPLE — BB-MORE-KEYS.** *The row that fixes the thin bench
  without asking him for anything.* Give the twelve approved encounters
  more to key off: the former trade of whoever is nearby (day 8), the
  circuit owner of the block (day 6), the hour, and what you are known for
  (day 1). Twelve stays twelve; what changes is how many different moments
  twelve can be. Measured baseline to beat: **ambient silent seven beats
  in ten, and a run at 40/42/18 against a 70/20/10 target.**
- **WORDS — BB-THE-SMALL-MOMENT.** The twelve are written as PEAKS, not
  as wallpaper. Duration neglect says a beat nobody remembers did not
  happen, so a roadside moment gets the same craft as a quest line: voice
  card, `draft:true`, and nobody in Bohemia is wise.
- **RUN / UI — BB-THE-END.** The reckoning card is the last thing seen
  every day and the research puts half the memory of the day on it. It
  currently reads as a receipt. Make it the day's best moment. **Merge
  with day 7's BB-WHAT-YOU-OWE — same card, same afternoon, two findings.**
- **NOT A ROW, A NOTE FOR HIM WHENEVER HE WANTS IT:** the ambient bench is
  three. A thirteenth encounter is his to name any time, and nothing is
  blocked waiting for it.
**RUNNING ORDER:** behind the demo. BB-MORE-KEYS depends on day 8's
BB-WHAT-YOU-WERE, so those two are one thread; BB-THE-END is small and
should ride with BB-WHAT-YOU-OWE.

## 8. CONFIDENCE
- The twelve encounters and their kinds, `MIX = {0.70, 0.20, 0.10}`, the
  40/42/18 measured run, the seven-beats-in-ten silence, the director's
  clock and its no-global-spawns rule: **MEASURED** in
  `engine/bohemia_encounters.js` and the walked surface, several of them
  quoted from the lane's own comments rather than re-derived by me — which
  I am flagging, because a second-hand number inside our own repo is still
  second-hand.
- BB's 47 initial events, their types, and the backgrounds/traits quote:
  the developers' dev blog #43 as reported plus the wiki. The blog is
  proxy-blocked here and was NOT read directly. **MEDIUM-HIGH.**
- The peak-end rule, duration neglect and the cold-water experiment:
  Fredrickson & Kahneman (1993) and the large literature after it,
  including a recent meta-analysis. **HIGH** for the core effect; its
  strength varies by domain, and I am using it as a design heuristic, not
  as a law of nature.
- §4's conclusion, §5, §6 and §7: **MY ARGUMENT AND MY ROUTING.** His
  population ruling stands untouched; what I am claiming is that it is not
  sufficient, not that it is wrong.

## SOURCES
Battle Brothers dev blog #43 (introducing the event system) as reported,
plus the wiki's Events page, for the 47 initial events, the event types,
and events keyed to backgrounds and traits "beyond just their different
stats". Fredrickson & Kahneman (1993) on the peak-end rule and the
snapshot model of remembered utility; Kahneman, Fredrickson, Schreiber &
Redelmeier, "When More Pain Is Preferred to Less: Adding a Better End";
and the duration-neglect literature. IN-REPO:
engine/bohemia_encounters.js (the twelve, the MIX constant, the
no-substitute rule), slices/BOHEMIA_CITY_WORLD.html (walkDirector,
walkInterrupt, walkAnimalHere, ROAD_TABLE/WALK_TABLE, the ambient-bench
comment, showReckoning),
laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md (item 5),
laws/BOHEMIA_VOICE_CARD_8_26_26.md, and days 1-12 of this study.
