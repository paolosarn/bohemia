# LAB 06 PATTERN NOTE — WHAT AN ACTION COSTS (Cataclysm: DDA, 7/31/26)

Page: `slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html`
Numbers: `records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt`
Mechanics played end to end: **action cost / condition / travel / errands /
sleep debt**.

This is an EMULATION, not a model: Cataclysm: DDA is open source, so every
number on the page was read off a real line of its C++ and every citation in
the teardown was printed from the fetched file this session.

---

## WHY IT EXISTS

Paolo's 7/28 correction (clause 17,
`laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md`): *"that's just if you were
walking now you have to understand a lot of things in this game will take up
time and time will pass just by taking actions in this game and you really need
to understand that sort of clock."*

He was right, and the moment he ruled it the repo had a hole: nothing in
Bohemia could say what a single action costs. Clause 4 of
`laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md` **reserves that
table to him** — "A COST TABLE IS CANON, NOT MECHANISM... No lane invents an
action-cost table." So the legal move was not to write costs. It was to go get
the best engineered answer that exists, with its real numbers, and hand him the
SHAPE so he can rule by feel instead of by document.

Cataclysm: DDA was picked for this before it was needed:
`records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md` ranked it **#1 of nine
candidates** on exactly this question, because it is the only open-source game
on the shortlist that answers it with real numbers.

---

## THE TWO FINDINGS

### 1. The cost is fixed. Your condition is the divisor. The divisor has a cap.

An action costs **moves** — a currency 100x finer than the tick
(`calendar.h:289`, 100 moves = 1 turn = 1 second). A 30-minute job is 180,000
moves, always, for everyone. What varies is your **speed**, and speed is what
divides moves into real time.

That split is the whole idea, and it is better than a table of minutes:

- **The table stays stable.** One number per action, forever. Nobody has to
  maintain a fed/rested/wounded variant of every cost.
- **The felt cost varies.** Wrecked, the same job eats more of your day. You do
  not need a second system to make condition matter; it already does.
- **And it cannot run away.** `character.cpp:7652`, their comment verbatim:
  *"Speed cannot be less than 25% of base speed."* So the worst any action can
  ever cost is **4x**. A bad day cannot become an infinite one.

The floor is the part I would steal first. It is what lets you be brutal about
penalties without ever producing an unplayable turn.

### 2. A step is an action, priced in the same currency.

`character.cpp:6022` costs a plain step at `run_cost( 100, false )` — 100
moves, one second at base speed. `character.cpp:6103` caps the bonuses so a
step can never cost *less* than 100. Walking and doing are **one clock** in
their model, with two kinds of purchase.

Bohemia's are **two clocks on purpose** — clause 17: the buff burns on steps,
the day burns on every action. That is a real divergence, and it is now a
chosen one rather than an unexamined one. Worth knowing which side you are on.

### The number that jumped out

Their **worst** step (at the speed floor) is 4.00 s. Bohemia's **average** step
is 3.52 s (clause 16, 12,288 steps to cross the valley). Coincidence, but a
useful one to feel: our baseline walk is already about as expensive as their
worst-case one, because our map is a real city and theirs is a tile grid.

---

## THE SMALLER PATTERNS WORTH HAVING

- **Thresholds, not slopes.** Carried weight costs nothing until you are over
  your cap (`character.cpp:7613`); thirst costs nothing until 40
  (`character.cpp:7620`). Being *slightly* burdened is free. That keeps the
  player from micromanaging, and it means the penalty always arrives as a
  decision rather than a drip.
- **A skill that fixes bad ground and nothing else.** Parkour halves the cost
  of an obstacle (`character.cpp:6096`) and does nothing on easy ground,
  because it only applies inside the `movecost > 105` branch. Sharper than a
  flat movement perk: it changes which routes are open, not how fast you are.
- **Travel is base + rate.** `20 minutes + distance x 10 minutes`
  (`mission_companion.cpp:1358`). A fixed cost for setting out, then a rate.
  The base is what makes short trips feel not-worth-it, which is a design
  outcome, not an accident.
- **An errand is a declared block, paid at rate x hours.** 1 / 4 / 10 / 20 hour
  blocks, paid 3, 4 or 5 per hour worked. You commit the block up front and
  collect later. This is the cleanest "spend time you are not present for"
  mechanic I have read, and it maps onto Bohemia companions almost directly.
- **Sleep debt's first rung is two whole days.** `character.h:247`. Nothing at
  all happens until you have been up 48 hours. Sleep is a strategic resource,
  not a nightly chore. If our camp is going to matter, that generosity is
  probably the right register — it agrees with his own clause 6 (ignoring the
  camp has to stay playable).

---

## WHAT NOT TO PORT

- **Their per-task JSON times.** Deliberately not even enumerated on the page.
  Bohemia's action list and its costs are Paolo's, by law, and a borrowed task
  list would read as a proposal. The page ships four generic rows built from
  the duration granularity their own C++ speaks in, and nothing more.
- **The pain curve.** The page subtracts pain from speed directly. Their real
  `get_pain_penalty()` is a curve. Do not treat the page's pain slider as
  Cataclysm's pain model.
- **Speed as a stat the player reads.** Their speed number is exposed and
  fiddled with. Ours should stay behind the curtain: Paolo's whole register is
  small legible numbers (Rogue Fable IV +1/+2/+3, clause 8 of the camp law), and
  a 0-100 speed stat with a -25 weight penalty is a different game's HUD.
- **Their granularity.** 100 moves per turn is right for a game where you
  press a key per step. Bohemia is a phone game with a 120 BPM beat. If any of
  this ports, the currency should be the BEAT, not the move.
- **The caravan jitter** (`+/-10%`, `mission_companion.cpp:1364`) and the
  random payouts (`rng( 20, 75 )`). Randomising the cost of time reads as the
  game lying to you about its own clock.
- **The sleep-debt penalties.** Not modelled and not extracted — they live in
  their effects JSON. Do not cite this page for what sleep debt *does* in
  Cataclysm, only for the shape of its ladder.

---

## HONEST LIMITS

- **This is four of their systems, not their whole clock.** run_cost alone has
  terrain costs, limb encumbrance, move modes, vehicles and mounts; none are
  modelled. The teardown lists every omission by file:line so the gap is
  countable rather than vague.
- **The errand rate/block pairing is mine.** Their rates attach to specific
  missions, not to block lengths. Pairing 3 with the 1-hour block and 5 with
  the 10-hour one is the page's arrangement to show the shape, and the teardown
  says so.
- **Sleep debt is the ladder only.** Accrual is counted 1:1 with minutes awake
  because their real accrual rule was not in the C++ I read. That is stated on
  the page's own face, in its code comments, and here — three places, so a
  reader of any one file cannot be fooled.
- **Four of my own first-draft citations were wrong** by a few lines, written
  from memory before the files were fetched. All four were corrected against
  the real source and the correction is recorded at the top of the teardown.
  The lesson is the one the 7/18 verify-on-the-real-surface law already says:
  a number you did not print from the file is a guess wearing a citation.
- **I have not seen him play it.** Everything above is what the code says, not
  what the shape feels like on a phone.

---

## WHAT THIS DOES NOT DECIDE

**Bohemia's action list and its costs remain [PENDING Paolo].** Clause 4 of the
time law reserves the table, and this page invents none of it. Nothing here is
wired into the engine, the alpha, or any bank — under
`laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md` a lab finding moves
into the game only when he says so.

The one thing this page is FOR is the question underneath the table, and it is
a short question: **is the shape right — a fixed cost in a fine currency, your
condition as the divisor, and a hard cap on how bad the divisor can get?** If
yes, the numbers are a conversation. If no, the table was never the problem.
