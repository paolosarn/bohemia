# DAY 20 -- THE RETURN RITUAL: ABSENCE IS FREE, AND ONE LINE IS WAITING
DYNASTY lane, VAMILY row `[return ritual]` Q18. Claimed 9/28 `dynasty-vamily-w4yxiz`.

> **THE ROW, VERBATIM:** "What brings a person back to a long game tomorrow, from real habit
> research rather than engagement tricks: what a person needs waiting for them, what makes
> returning feel good instead of like homework, and how the best long games handle a player
> who was away a week. Deliver what our morning should be."

Reference law kept (as Q16 kept it): the campaign layer's reference is BATTLE BROTHERS only,
read from `reference/library/battle_brothers/` (volumes 01, 07, 08, 10; every number in it is
tagged recall). No other game is named. Habit and memory findings below are from the published
literature and are cited by author and year, not by anything this repo can check.

## 0. THE FINDING THAT PROVES US WRONG
**Q16 said the return was "the most repeated moment in the game and we built it zero times."
That is true of a SCREEN and false of the WORDS and the WORLD.** Measured this round:

- **The recap is already written, and it is bigger than Q16 counted.** 249 `@LOG` lines, in
  **42 of 42** quests (Q16 counted 164 in 27), each first person, past tense, one per stage:
  *"Put the current back myself. Block has light tonight. Nobody knows it was me."*
- **Nothing hands any of it to a player who comes back.** The runtime pushes each stage's line
  into `state.log` and the shared deed log; the only player-reachable readers are the STANDING
  panel (`D.standing()`, last eight lines, on demand, behind a button he has to think to press)
  and the feed's "what you did" posts. The morning (`MORNING`, `toPhone()`) is a single entry,
  REPLACED each day, built by scraping the wake card's own HTML. **It reports the day, not you.**
- **Nothing knows he was away.** `bohemia_save.js` uses `Date.now()` only for slot generation,
  so a save written now and read a week later is indistinguishable from one read a minute later.
  The game flushes on `pagehide`, `freeze`, `blur` and `visibilitychange` (the phone path is
  hardened), so the STATE always survives. **The intent does not: nothing saves what he was
  about to do.**
- **The world does not move while he is away, by design.** Rule 31 freezes every act but the
  one he stands in; the map's clock runs when he travels (rule 33), the way the library's
  01_WORLDMAP.md has Battle Brothers travel "in real time (pausable...)". **So absence is
  FREE: nothing rots, nothing is owed.** That is the strongest fact in this round and nobody
  had written it down as a return design. It is also why Q16's worry ("what fills the return")
  needs a smaller answer than it looked: nothing has to be REPAIRED, only RESTORED.

**So the missing piece is one selector and one timestamp, not a screen and not a system.**

## 1. WHAT THE HABIT RESEARCH ACTUALLY SAYS, AND WHERE OUR INSTINCT WAS WRONG
- **Habits form slowly and forgive a miss.** Lally et al. (2009, 96 people, 12 weeks): the
  median time to automatic repetition was **66 days, range 18 to 254**, and **missing a single
  opportunity did not materially affect the process.** At fifteen real minutes a day a hundred
  hours is about 400 days (Q16), so the game is long enough to grow a habit and short of the
  timescale where it matters that one missed day be forgiven. **A streak that resets on a
  miss is contradicted by the one finding everybody quotes for it.**
- **Habits are carried by the context, not by a reward.** Wood and Neal (2007) and Wood and
  Rünger (2016): a repeated behaviour is triggered by a stable cue in a stable place, and
  rewards matter for forming it far more than for keeping it. **The cue for a phone game is
  the phone in his hand at some routine moment, which no game owns.** Our job is to be
  ready when the cue happens, not to invent a second cue.
- **Paid-for returns decay when the pay stops.** The over-justification result (Lepper,
  Greene and Nisbett, 1973) and Ryan, Rigby and Przybylski (2006, "The motivational pull of
  video games"): the pull of a game is predicted by whether it satisfies competence,
  autonomy and relatedness, and by controls that feel natural, more than by the rewards
  layered on. **A daily login gift buys a visit and teaches him the visit is for the gift.**
- **An unfinished thing pulls, but the classic story is weaker than it sounds.** The claim
  that unfinished tasks are remembered better (Zeigarnik) replicates poorly. What does hold
  is that an unfinished goal intrudes on thought until a SPECIFIC PLAN exists for it
  (Masicampo and Baumeister, 2011). **So the waiting thing must be a plan, never a nag.**
- **A cue left at the point of interruption shortens the way back in.** Altmann and Trafton
  (2002, memory for goals): resumption is slow because the goal has decayed, and it is fast
  when a cue was rehearsed or left at the moment of leaving. **That is a sentence, written
  before he goes, that he reads when he returns.**
- **The gap sets how much needs restoring.** The forgetting curve and the spacing literature
  (Cepeda et al., 2006): after a longer gap less specific detail is recalled, but relearning
  is fast. **Recap depth should scale with the gap: nothing after minutes, one line after a
  day, a little more after a week.** Never a full history.
- **How it ends decides how it feels to come back.** Peak-end (Fredrickson and Kahneman,
  1993): what is remembered is the peak and the final moment. **So the save should sit on a
  settled beat with one road ahead, and the first minute back should be quiet** (which rule
  32a already requires: nothing forced, nothing in the first second).

## 2. WHAT MAKES A RETURN FEEL LIKE HOMEWORK, FROM THE SAME PAPERS
Four things, and every one is a thing a game builds on purpose:
1. **A backlog that grew while he was gone** (the guilt of a list). Ours cannot: the world froze.
2. **A loss he could not prevent** (streak reset, decayed crops, a timer that ran out). Loss is
   felt harder than an equal gain, so absence-that-costs is the strongest way to make a person
   dread reopening the app. **We refuse it structurally, which is right.**
3. **A number of days shown to him** ("7 days away"): a stated absence reads as a debt.
4. **Several things at once.** A list is a to-do list. **One line is a sentence.**

## 3. HOW THE BEST LONG GAMES HANDLE A WEEK AWAY, WITH THE LAW OBEYED
Only one game is in scope for this department, and the library is thin on exactly this:
`01_WORLDMAP.md` and `10_UI_AND_FEEL.md` have travel in pausable real time and a day count,
and **nothing on saving, resuming or time away** (checked: no hit for save, resume, autosave
or ironman in any of the ten volumes). What the library does carry is the one thing that plays
the resumption cue's part: **AMBITIONS**, "an optional goal you choose (hire 12 men, reach
2,000 crowns...) with a small renown reward" (01, 07, 08), a standing line on the screen that
says what he was after. That is the library's own version of a plan waiting to be read.
**The other long games are not cited by name** (Q16's rule, kept). The class of design the
research above supports, described without titles, is: **the world pauses, the last thing you
were doing is written down for you, and nothing accrued.** The class it argues against is the
one that punishes absence, and it is the one the retention numbers make attractive, which is
exactly why it is the one to refuse. PLUMBER [bb library] can settle the Battle Brothers
half the day the wiki is reachable.

## 4. WHAT OUR MORNING SHOULD BE
**One line, in his own voice, written by the game the moment he stopped, shown on the phone
that already rings, and nothing else.**

- **What waits (one thing):** the `@LOG` line of the stage he is in, exactly as the quest
  wrote it. Those words already exist, are already in his voice (first person, past tense)
  and are already gated by the WORDS lane. **No new prose, no new surface, no pop-up**
  (rule 19a: the morning lives on the phone he opens; the chip rings).
- **When it is shown, by the gap (thresholds are TUNING's, drafts here, one word to
  knock down):** under about an hour, nothing (he did not leave); after a night, that one line;
  after about a week, that line plus the name of the last person he spoke to and where the
  marker stands. **Never the number of days.** Never a list. Never a reward.
- **What the wait is not:** a streak, a daily gift, a timer, an energy cap, a push nag, a
  counter of days, or a summary of what the world did while he was gone (it did nothing; the
  honest text is that nothing changed, and saying so is the calm of the analog horror bible).
- **Where he leaves matters:** the map is where he most likely stops. A marker standing on a
  road with the next settlement ahead is a natural open loop. The one thing to avoid is a save
  taken in the middle of a fight, because the peak-end finding says that is the shape he will
  remember returning to.
- **Three acts (rule 31):** it is per act. Coming back to act 3 gives act 3's line, because
  each act's clock is frozen and each has its own ledger. The flip strip already shows who he is.
- **Analog horror (rule 20, section 9):** the loading screen already carries a line for this,
  `READING LAST NIGHT'S METERS`, in the machine's calm register, and then `NO OPERATOR ON
  DUTY`. **The institution reporting is the ritual's voice; his own last line is the ritual's
  content.** Two voices, one screen each, no second wrong thing.

## 5. THE MACHINE, NAMED NOT BUILT (this is research; the rows are for the builders)
- **One field:** the last time the game was hidden, written by the same flush that already
  runs on `pagehide`, `freeze`, `blur` and `visibilitychange`. Real-time only, used only to
  choose how much to restore.
- **One selector:** the current stage's `@LOG` line for the act he is standing in.
- **One gate, when built:** *"a return after a gap shows exactly one line and no number, no
  list, no reward; a return inside the hour shows none; and nothing in the state changed
  between the hide and the return."* The last clause is the one that keeps absence free.
- **One refusal, written down so nobody re-adds it:** no streaks, no daily reward, no
  countdown, no away-time shown as a number.

## ROUTED
- **RUN / UI** -- the field and the selector are RUN's (the flush and the morning are already
  theirs); the ring and the line are UI's phone. Neither needs a new surface.
- **TUNING** (research only, rule 38g) -- the gap thresholds (about an hour, about a night,
  about a week) are numbers a player feels; they belong in the one numbers table, not here.
- **WORDS** -- the `@LOG` lines are the recap. A pass that reads each as the ONLY thing a
  returning player sees would find the ones that do not stand alone.
- **QUESTS** (research only, rule 35) -- the 249 lines are library material for "does each
  stage's line survive being read cold after a week".
- **PLUMBER [bb library]** -- the library has no save, resume or time-away content; fetch it.
- **COORDINATOR** -- nothing blocking.

## WHAT THIS ROUND DID NOT DECIDE
The thresholds. Whether the last speaker's name and the marker's place are shown after a week
(a design choice, one line either way). Whether an act's ledger should note a scheduled
return. Any canon: nothing here names a person, a place or a faction.

## GATE NOTE
School, no code, no gate. Registered to VOTE as one line, `dynasty-return-ritual-9-28`.
Pre-push: handoff, reply contract, three names and the flip unchanged (nothing of mine touched).
Canon rot is red on main too (11/2, two unrelated citations), checked against a clean stash.

*DYNASTY round, research only. Nothing in the game changed.*
