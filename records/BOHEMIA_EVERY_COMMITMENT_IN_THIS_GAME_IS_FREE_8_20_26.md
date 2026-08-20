# EVERY COMMITMENT IN THIS GAME IS CURRENTLY FREE (8/20/26, FACTIONS lane)

**Measured, not suspected.** The whole cross-cutting-cleavage half of the faction
design — *taking a side costs you somewhere else* — cannot fire anywhere in the
valley, and the cause is three stacked facts about the world rather than one bug.

**This is a WORLD/density finding, not a faction-lane one.** It is written up here
because the lane that found it cannot fix it without inventing canon Paolo
reserved, and because a thing nobody has written down is a thing the next session
rediscovers.

---

## 1. THE NUMBERS

Measured on the real city page, whole valley, no stubs:

```
affiliated                                    32 of 298
ties between two affiliated people           106
   same outfit                               106
   CROSSING AN OUTFIT LINE                     0
whoHears lines in the entire valley            0

foci shared by two or more people:  home 0    work 34    faction 8

  CARAVANS     1 members  ->  NOBODY
  CARTEL       2 members  ->  NOBODY
  COLORFUL     2 members  ->  NOBODY
  CUSTOM       3 members  ->  NOBODY
  HOMELESS     1 members  ->  NOBODY
  MOB          3 members  ->  NOBODY
  NETWORK      4 members  ->  NOBODY
  REDS         8 members  ->  NOBODY
  REMNANTS     1 members  ->  NOBODY
  TRADES       5 members  ->  NOBODY
  VOLUNTEERS   2 members  ->  NOBODY
```

## 2. WHAT THAT SWITCHES OFF

Everything downstream of `whoHears` is dead, and all of it is built, grounded and
gated:

| surface | says | actually |
|---|---|---|
| `WHO WILL HEAR` | which outfits learn you took a side | always "NOBODY" |
| `WILL HEAR IT AS FACT` / `A RUMOUR` | how it reaches them | never printed |
| `AND IT COSTS YOU` | standing lost elsewhere | always "NOTHING" |
| `YOUR POSITION` (tertius) | broker, and its **sign** | always *gaudens*, never *dolens* |

So **saying out loud that you are with somebody has no downside anywhere**, and
the *tertius dolens* correction — the thing that makes brokerage a real decision
rather than a free bonus — can never happen.

## 3. THE CAUSE, IN THREE STACKED FACTS

1. **THE VALLEY HAS NO HOUSEHOLDS.** `bohemia_population.homesIn()` walks a
   deterministic scatter and takes **one fine cell per person**, so 298 people
   have 298 homes. The **home** focus — the strongest tie in Feld 1981's scheme,
   and the one that most naturally crosses an outfit line in a real settlement —
   groups nobody with anybody.

   > **This is not a keying bug in `bohemia_ties`.** The adapter reports what the
   > world says, and the world says every person sleeps alone under their own
   > roof. Checked specifically, because a keying bug of exactly this shape was
   > found and fixed on 8/15 and the same conclusion would have been wrong twice.

2. **A FACTION TIE IS SAME-OUTFIT BY DEFINITION**, so the 8 shared faction foci
   can produce 106 ties and never once bridge two outfits.

3. **WORK IS THE ONLY POSSIBLE BRIDGE.** 34 workplaces are shared by two or more
   people — but with 32 affiliated out of 298 (10.7%), a shared workplace
   essentially never holds two affiliated people from *different* outfits. Zero
   is not surprising here; it is what the arithmetic predicts.

## 4. WHAT WOULD ACTUALLY FIX IT (whoever owns these)

Any **one** of these unblocks the entire half of the system. None of them belong
to this lane, and all three are content decisions rather than code:

- **HOUSEHOLDS.** Seat more than one person per home. This is the biggest lever by
  far: Feld's home focus is a clique under Dunbar's support-clique layer of 5, so
  every household instantly makes everyone in it acquainted — and a household
  containing two differently-affiliated people is a bridge by itself. It is also
  simply what a settlement looks like.
- **THE AFFILIATION RATE.** 32 of 298 is the `AFFILIATED_RATE` dial, already on
  the `[PENDING Paolo]` shelf. Raising it raises the odds of a cross-outfit
  workplace quadratically.
- **THE THREE EMPTY BASES.** Anarchists, Blues and Church stand in the valley with
  **zero** members, which separately makes the `presence` act unpressable by
  anybody. Same family of fact.

## 5. HOW IT IS HELD SO IT CANNOT BE SILENTLY BELIEVED

Gate `faction_arc_gate.js` **M5** reports every number above on each run, and is
**falsifiable rather than decorative**: it asserts the tie graph and `whoHears`
*agree*. If cross-outfit ties ever exist while `whoHears` still returns zero
lines, the two disagree and the gate goes red.

> This is the L9 discipline from the same day: *"it did not fire"* must never be
> mistakable for *"it is broken"*, and the way you keep those apart is to print
> the headcount beside the outcome.

---

Law: `laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md` sec 4j
Tool: `tools/bohemia_organ_reach.js` (the sweep that found `tertius` uncalled)
Tab: **CITY** — the position row is live; it just only ever has one answer.
