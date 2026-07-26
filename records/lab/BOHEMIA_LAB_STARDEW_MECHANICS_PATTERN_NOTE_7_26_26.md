# LAB 02 — PATTERN NOTE: WHAT STARDEW'S THREE BEST MECHANICS ARE ACTUALLY MADE OF

Lane: LAB. Law: `laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md`
Playable: `slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html`
Numbers + citations: `records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt`
Gate: `gates/lab_gate.js`

The lab ports nothing. Paolo plays it and rules.

---

## 1. THE ONE-PAGE VERSION (no code)

Three mechanics that carried a game for ten years, and all three are small.

**FISHING is one number in a tug of war.** A bar you juggle against gravity, a
fish that wanders, and a percentage that climbs while the fish is inside the bar
and falls while it is not. Climb rate 0.002 a frame, fall rate 0.003. That
closeness is the whole feeling: losing is only one and a half times faster than
winning, so every fight is long and every fight feels winnable. The entire
fishing skill tree is the bar getting taller (96px at level 0, 176px at level
10). There is no second reward for levelling. **A whole beloved minigame is four
numbers and a bar.**

**FARMING is a bet against the calendar.** A crop advances one day only if you
watered it, and forgetting to water is not punished at all: the day just does not
count. The only hard kill is planting into the wrong season, and that wipes the
plot in one night. So farming is not a chore simulator, it is a TIME budget with
a deadline, and the chore is how you spend it.

**MARRIAGE is a ceiling that only moves when you commit.** One integer, 250 per
heart. Gifts are the fast lane and they are rationed to one a day and two a week
(their birthday bypasses both and pays eight times). Talking is free, +20, once a
day. And here is the part worth stealing: an undated villager DECAYS while below
2000 points and the decay stops there, so no amount of gifting gets you past 8
hearts. You have to accept the bouquet. Then the ceiling moves to 10 hearts, and
marriage moves it to 14, and ignoring your spouse costs -20 a day instead of -2.
**The mechanic gets harder after you win it.** That is why the marriage stays a
thing you do instead of a trophy on a shelf.

---

## 2. THE PATTERNS, NAMED

These are the transferable ideas, independent of farming games.

### P1. ONE AUTHORED SCALAR, THREE BEHAVIOURS
A fish's `difficulty` (0-110) feeds how OFTEN it changes direction, how FAR it
moves, and how FAST it eases there. One number a designer types produces a
recognisable personality. Compare our own tuning surfaces: anything that needs
five sliders per entry will never get filled in.

### P2. THE NEAR-EQUAL TUG OF WAR
Progress +0.002 vs -0.003. A 1.5x ratio makes a contest feel close for its whole
length. Make the loss rate 3x and the same code becomes a punishment.

### P3. WINNING CALMS THE CONTROLS
While the fish is inside the bar, BOTH acceleration terms are multiplied by 0.6.
Being on target makes the input gentler, which reads as grip. One multiplier
does what a designer would otherwise try to write with juice.

### P4. THE SKILL CURVE IS ONE NUMBER GETTING BIGGER
Ten levels of fishing = a bar going from 17% of the track to 31%. No new verbs,
no unlocks. Legible to the player, nearly free to build.

### P5. A MISSED CHORE COSTS TIME, NOT DAMAGE
Unwatered is a wasted day, not a dead plant. Time is the resource, so time is the
punishment. This is exactly the shape of Paolo's ruling that the world moves when
you spend time on an action.

### P6. RESOLVE AT SLEEP
Nothing grows while you watch. You spend a day, then you find out. It makes a
day a unit of decision rather than a unit of waiting.

### P7. RATION, DO NOT PRICE
Gifts are limited by COUNT (1/day, 2/week), not by cost. A priced system becomes
a money check the moment the player is rich. A rationed one never stops
mattering.

### P8. THE CALENDAR AS A MULTIPLIER
Birthdays bypass the ration and pay x8. One number turns a date on a calendar
into an event players write down. The cheapest content in the game.

### P9. THE CEILING MOVES ONLY ON A COMMITMENT
You cannot grind past 8 hearts; you have to accept the bouquet. Progress gates
are STATE CHANGES, not thresholds. Grinding cannot skip a story beat.

### P10. THE COST OF NEGLECT SCALES WITH INTIMACY
-2 stranger, -8 dating, -20 spouse. Getting closer makes the relationship more
expensive to hold. Nothing in the system is "completed".

---

## 3. WHAT THIS MEANS FOR BOHEMIA (recommendations, not builds)

Bohemia is not a farming game. Every item below is the PATTERN, not the content.

1. **RATION, DO NOT PRICE (P7) — for CLOUT and for favours.** Our social loop is
   posts and reputation. If a favour, a post or a bribe is limited by money, a
   rich player switches it off. Limit by COUNT per day or per week and it keeps
   working in act 3. This is the single most portable idea in the file.
2. **THE CEILING THAT MOVES ON A COMMITMENT (P9) — for faction standing.** A
   faction should have a hard wall you cannot grind through: you get to "known"
   by doing jobs, and you only get past it by DOING THE THING that commits you
   (taking a side, burning a bridge). It makes our territory arc a story instead
   of a bar to fill.
3. **NEGLECT SCALES WITH INTIMACY (P10) — for the same standing.** The deeper you
   are in with a faction, the more it costs to go quiet on them. Our world is
   about being watched.
4. **A MISSED ACTION COSTS TIME, NOT DAMAGE (P5).** This is already Paolo's law
   in another form, and it is worth writing into the action-cost table when he
   writes it: the penalty for doing a thing badly is that the day is gone.
5. **ONE AUTHORED SCALAR, THREE BEHAVIOURS (P1) — for NPC and encounter tuning.**
   One "heat" number per NPC driving how often they act, how far they push, and
   how fast they escalate, instead of a table nobody fills in.
6. **THE NEAR-EQUAL TUG OF WAR (P2) + WINNING CALMS THE CONTROLS (P3) — for the
   Dead Eye Dial.** If any contested meter in combat resolves faster than about
   1.5:1 against the player, it reads as unfair rather than tense. And damping
   the input while the player is winning is a cheap way to make landing on the
   beat feel like grip.
7. **RESOLVE AT SLEEP (P6).** We already have SLEEP AND SAVE. Making the world's
   consequences land AT that moment (who moved, who noticed, what the feed said
   overnight) turns sleeping into the most interesting button in the game instead
   of a save point.

## 4. WHAT NOT TO PORT

- **The mechanics themselves.** We are not adding fishing, or crops, or a
  marriage system. Paolo has not asked for any of the three and this note is not
  a pitch for them.
- **Levelling as a single widening bar (P4).** It is elegant for a minigame and
  it would be thin as a whole progression system.
- **The content tables.** Fish difficulties, crop phase lists and gift tastes are
  theirs and are stand-ins here. Our contents are Paolo's.
- **Anything about their walk.** Ruled: laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_
  ACTIONS_7_26_26.md.

## 5. HONEST LIMITS

- Three loops, each closing, nothing deeper. No treasure, bait or tackle in
  fishing; no crop quality, giant crops or greenhouse; no heart events, dialogue,
  jealousy, children or divorce. Every one of those is a modifier on the rules in
  the teardown, and the teardown says where each branch lives.
- The mechanisms are cited to file:line and are measured by the gate. The
  content tables are ours and are labelled as such on the page itself.
- Sections 1 and 2 are facts about their code. Section 3 is my opinion and is for
  Paolo to accept or bin.
