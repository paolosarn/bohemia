# THE DAY PAYS — 8/12/26 (RUN lane)

The demo cut, ruled 8/4, row 3:

> "THEN ONE GOOD DAY: wake -> 2-3 quests -> walk finished-looking streets -> one
> talk, one dial fight -> **GET PAID** -> spend at a trading hub -> camp ->
> sleep-save holds."

**GET PAID did not happen.** Not because it was unbuilt.

## MEASURED, NOT ASSUMED

`engine/bohemia_payday.js` exports `questEvent`, `payForQuest`, `hubs`,
`reachable`, `nearestHub`, `shelf`, `price`, `buy`, `dayReport`.

**Every one of them was referenced exactly zero times outside its own module.**

The entire "get paid, spend at a hub" half of the demo cut had been sitting in the
build, complete and dormant, since 8/11. That is the **sixth** time this week this
lane has found the same shape: the work exists and nothing calls it.

## AND ONE PIECE REALLY WAS MISSING, AND IT IS A GOOD ONE

Paolo ruled on 8/11, asked what a day's work should pay:

> "Whatever currency the quest decida to give."

The bridge was built that same day to honour it — `questReward()` reads
`questState.reward` and pays exactly that. **And the .bq language had no verb to
say it.** A quest could not declare a reward, so every finished job fell through
to the empty global table and got `NO_RULING`.

The ruling was made, the bridge was built, and the sentence could not be written.

`engine/bohemia_quest_runtime.js` now has:

```
@DO pay resources 3
```

**On the stage, not in a header** — because his ruling put the reward in the job,
and a quiet fix and a public spectacle are different jobs that should not pay the
same. The completing stage is already where a quest says what happened.

## THE REFUSAL IS THE POINT, NOT A BUG

The three canon demo quests declare no reward yet, because **amounts are
contents**. The ALWAYS MAKE AN ATTEMPT law (8/11, LOCKED) is explicit that
"numbers, dials, rates, prices" still wait for him.

So the reckoning does not fake a number. It says:

> **The Meter Reader: nobody has ruled what this pays**

That is the machine asking for exactly one ruling, in the place he reads, without
blocking the demo or inventing his canon. The moment a `.bq` file says
`@DO pay resources 3`, that line becomes a number and nothing else changes.

## PROOF

`gates/day_pays_gate.js`, 16 assertions:

- a quest can declare what it pays, and the declaration **reaches the purse**
  (balance really moves)
- the declaration survives serialization
- a quest that declares nothing is **refused, not guessed at**, and credits nothing
- **the run actually calls the bridge** — the assertion that would have caught the
  original defect
- on the real surface: finishing a job reaches the purse, pays nothing with nothing
  ruled, and the reckoning names the job it is waiting on
- the purse rides the save, because pay that dies with the tab is not pay

## WHAT COMES AFTER

The other half of that demo row is still dormant: `hubs`, `nearestHub`, `shelf`,
`price`, `buy` — **"spend at a trading hub"**. All built, all uncalled. That is the
next wire, and it needs one thing from him first: a price is a number, and numbers
are his.
