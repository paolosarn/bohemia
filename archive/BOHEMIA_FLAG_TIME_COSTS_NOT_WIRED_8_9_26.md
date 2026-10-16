# FLAG — HIS 8/7 TIME COSTS DO NOT REACH THE GAME YET (found 8/9, SOUND lane)

**This is a hand-off, not a fix. The change is RUN / LIFE lane work and I did not
make it.** Written because the ruling is locked and the code that was explicitly
waiting for it does not know.

## THE RULING (locked, laws/BOHEMIA_ADDENDUM_EATING_TAKES_TIME_8_7_26.md)

> "Eating a snack might take 10 minutes eating a five star meal might take an
> hour. I'm going to sleep could take six through 12 hours."

    snack            10 minutes
    five star meal   1 hour
    sleep            6 to 12 hours

## WHAT THE GAME SAYS TODAY

`slices/BOHEMIA_RUN_CURRENT.html`, the run's action-cost table:

```js
var MOMENTS = [ { name:'SLEEP', spends:8 }, { name:'HANGOUT', spends:1 },
                { name:'EAT', spends:null } ];
```

and the comment directly above it:

> "THE MOMENTS ARE HIS. He named the sizes in the same breath: sleep 8, hang out
> 1. **He did not price EAT, so EAT is declared with NO spend and the button says
> so**, because an action-cost table is canon and no lane writes one."

That lane did exactly the right thing: it refused to invent a number and left the
slot empty with a note saying why. **HE HAS NOW PRICED IT.** The blocker named in
that comment is gone, and the table has not caught up.

Two live things now disagree, which the TRUTH HIERARCHY calls a bug rather than
an interpretation:

| | ruling | code |
|---|---|---|
| EAT | 10 min (snack) to 60 min (meal) | `spends:null` — advances nothing, button says "no ruled cost yet" |
| SLEEP | 6 to 12 hours | `spends:8` — a constant, and the button reads "SLEEP (8 HOURS, SAVES)" |

## WHY I DID NOT JUST FIX IT

Not lane politics. **Both numbers are RANGES, and neither has anything in the
game to hang the range on.** Writing either one down as a single number would be
inventing the structure he did not specify, which is the thing
MECHANISM-MINE / CONTENTS-PAOLO'S exists to stop:

- **EAT has no food types.** "Depends on the food" needs a food to depend on, and
  there is no item, no inventory and no food category anywhere in the run
  (`propAt(px,py)` returns a prop and the action is literally "EAT WHAT YOU
  FOUND"). Pricing eat at a flat 10 minutes would quietly collapse a six-to-one
  spread he stated on purpose into one number.
- **SLEEP has no way to choose a length.** 6 to 12 is a decision by someone —
  the player, or the situation. There is no UI, no prompt and no state that
  settles it. Hardcoding 6, or 12, or a random draw, is three different game
  designs and none of them is his.

So the honest report is: **the ruling is ready and the mechanism it needs does
not exist yet.** That is a real piece of work, not a one-line edit.

## WHAT THE SOUND LANE ALREADY DID ABOUT IT

Nothing needed changing, and I verified that rather than assuming it:

- **Sleeping the night already strikes eight times.** Measured through the REAL
  contextual action button in the real run, not a synthetic message: clock 450 →
  930, eight strikes at the engine. It is now a permanent check in
  `gates/time_pass_gate.py`.
- **Whatever number that lane lands on, the sound follows for free.** The strike
  reads a jump in the world clock the run already reports; it does not read the
  MOMENTS table. Change `spends` and the sound changes with it.
- His four numbers are already gate cases: snack 10 min → silent, meal 1 hour →
  one strike, sleep 6h → six, sleep 12h → twelve.

**So the sound is not blocking. The clock is.** The moment EAT gets a real cost,
eating an hour-long meal will strike once on its own with no sound work at all.

## FOR WHOEVER TAKES IT

1. EAT needs food types before it can need a duration. That is the real
   dependency and it is bigger than the timing.
2. SLEEP needs an answer to "who picks 6 versus 12" before the range means
   anything. [PENDING, Paolo] unless he has already said and it is recorded
   somewhere I did not find.
3. The button label "SLEEP (8 HOURS, SAVES)" is a promise to the player and has
   to change with the number, or it becomes the next thing that lies to him.
