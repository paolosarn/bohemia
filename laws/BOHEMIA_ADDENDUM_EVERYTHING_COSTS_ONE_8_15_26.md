# BOHEMIA ADDENDUM — EVERYTHING COSTS ONE (Paolo 8/15/26, LOCKED)
# "Anything that could cost a resource, we can't be tied up in this. Just
# make everything cost one. Just start off with one and then I'll move
# from there... you would have to play until the end of the game to be
# like OK this is how much I should have, this is how much this shit
# costs, to be very frank."

## 1. THE RULING
EVERY RESOURCE COST, PRICE, PAYOUT AND YIELD IS **1** UNTIL HE HAS PLAYED
THE GAME END TO END AND TUNED IT BY FEEL.
The three empty tables fill with ones TODAY:
  PURSE.PAYOUT      — what a quest pays        (was {} , demo blocker 1)
  PURSE.PRICES      — what a thing costs       (was {} , demo blocker 2)
  PURSE.PRODUCTION  — what a building yields   (was {} , demo blocker 3)
Plus the rewind's per-move cost (laws/BOHEMIA_ADDENDUM_THE_REWIND_
8_15_26.md §7) and any future resource price anybody is tempted to invent.
`engine/bohemia_payday.js` said it in its own header: "The pipe is
finished and the valve is his. ONE LETTER OPENS IT." He sent the letter,
and the letter is 1.

## 2. HIS REASONING, AND IT IS CORRECT GAME DESIGN
Economy values are meaningless in isolation — a price is only right
relative to income, scarcity, pacing and the length of the whole curve.
You genuinely cannot know what a thing should cost until you have played
to the end and felt how much you should have had. Ruling numbers cold, on
a spreadsheet, before that game exists, is guessing with extra steps. So
the numbers wait for the only instrument that can measure them: him,
playing the finished thing.

## 3. WHY THIS IS SAFER THAN DRAFTING "REALISTIC" NUMBERS
The coordinator's recommendation was to draft plausible starting values
the way the 8/11 law drafts words. HIS ANSWER IS BETTER, AND HERE IS THE
FAILURE MODE IT AVOIDS: a plausible-looking number LOOKS TUNED. It slips
past every future reader, gets built on, and quietly becomes canon by
inertia — nobody re-opens a value that looks deliberate. A 1 can never be
mistaken for a ruling. It announces itself as a placeholder from across
the room.
AND IT KEEPS MECHANISM-MINE / CONTENTS-PAOLO'S PERFECTLY INTACT: ONE IS
NOT A GUESS. It is the absence of a guess. Nobody is filling in canon he
reserved; the machine is running on a neutral unit until he rules.
THIS ALSO DISSOLVES THE LAW CONFLICT that was put to him this turn (8/9
"everything is a thumb, decide and let him correct" vs 8/11 "numbers,
dials, rates and prices wait for him"). Both hold, unchanged: nobody
decided a number, and nothing is waiting.

## 4. WHAT "COST ONE" DOES NOT MEAN
- IT DOES NOT MEAN FREE. The spend still happens, the ledger still moves,
  you can still run out. The pipe must be EXERCISED, not bypassed — a
  cost of 1 that is skipped teaches us nothing when the real number lands.
- IT DOES NOT MEAN "NO REFUSAL PATH". Keep the NO_RULING behaviour for
  anything genuinely uncovered by a table. Nine gates already assert that
  honest refusal (purse, payday, day_pays, demo_blockers, world_resolve,
  succession, fuse, brownout and kin) — the mechanism stays, the tables
  simply are not empty any more.
- IT DOES NOT TOUCH DAMAGE. NO DAMAGE BEFORE THE DIAL is its own standing
  law and he did not amend it here. This is resource costs, prices,
  payouts and yields. Nothing else.
- IT IS NOT FOREVER. It is the starting position, and he said so: "then
  I'll move from there."

## 5. THE MACHINE HALF (a law without a gate is not enforced)
Every unity value SHIPS TAGGED as a placeholder, exactly the way drafted
words carry `draft:true` — so that when he sits down to tune after a
full playthrough, ONE LIST holds every number in the game.
  (a) each entry carries a placeholder marker (e.g. `placeholder:true`)
      beside its 1;
  (b) a gate enumerates every economic value in the build and asserts
      that each is EITHER tagged placeholder OR carries a recorded ruling
      from him — so a hand-typed 7 with no ruling behind it goes RED;
  (c) the tuning list is generated, not remembered.
WITHOUT (b) this law rots into the exact disease it was meant to prevent:
an untagged number nobody re-opens.

## 6. WHAT THIS UNBLOCKS, TODAY
All three demo blockers die at once. The economy circulates end to end
for the first time: a quest pays, the payout lands in the purse, a hub
sells something, the purchase clears, a held building yields over time,
and the rewind can be priced. That is the "GET PAID -> spend at a trading
hub" half of the ruled demo cut, which the 8/14 audit found present but
dormant (row 1) — it was never missing code, it was missing a number.
DEMO NOTE, and it is fine: friends in the closed playtest will see costs
of 1. Round 1 is people who know it is a demo (records/BOHEMIA_CLOSED_
PLAYTEST_PROTOCOL_8_11_26.md), and honest placeholders read better than
invented economics that are wrong in a way nobody can name.

## 7. ROUTING
- WORLD owns the tables: fill PAYOUT / PRICES / PRODUCTION with tagged
  ones (item EC + the new EP), keep the refusal path for uncovered keys.
- RUN owns the plumbing: the payday bridge is already built and dormant —
  with numbers present it can finally be CALLED from the day loop
  (the 8/14 audit's row 1 gap), and the purse ledger moves.
- COMBAT: unaffected; damage is not in scope (§4).
- Whoever ships first writes the placeholder gate (§5). It is small, and
  it is the difference between a placeholder and a lie.
