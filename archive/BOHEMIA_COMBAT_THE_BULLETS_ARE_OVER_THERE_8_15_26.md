# THE BULLETS ARE OVER THERE (COMBAT, 8/15/26, v157)

Paolo, 8/15, LOCKED and demo-critical, said again in the same words:

> *"It's still kind of felt like I just found some cover and I stayed in the same
> place just shooting people at the same location like nothing changed. There's no
> movement. There's no movement whatsoever and I hate it."*

## I HAD ALREADY BUILT THIS THREE TIMES

- **v152** made his cover decay
- **v136/v137** made them flank, press and hold a line
- **v152** took the grenade off its one-per-fight leash

Every one of those is the same idea: **make his spot worse**. He has rejected the
result four times.

A fourth punishment would be the fourth-version mistake, which is the tell that I
already failed. So this changes class.

His own law names the difference. Cover-expires, flankers, the flush and rushers
are **survival taxes**, and every one of them can be *tanked* while he keeps
firing from the same tile, which is exactly what he keeps reporting. *"The
resource is elsewhere"* is a **win condition**, and you cannot tank a win
condition. His law also says that option sits naturally with a world about
scarcity.

## THE GAME HAD NO AMMO. NONE.

Grepped the whole combat blob: not one occurrence outside the audio data.
**Infinite bullets, since day one, in a post-economic-collapse survival RPG.**

That is simultaneously the realism hole and the exact reason one tile can win a
fight: a spot with a wall and unlimited rounds is a fortress.

Now: your gun holds what it holds, every shot spends a round, and you start with
what you scavenged.

## AND THE DEAD ARE THE SUPPLY

Ammo alone would only be a pacing tax. He would shoot less from the same tile.
The thing that moves him is **where the next round is**:

**EVERY MAN YOU DROP LEAVES HIS ROUNDS ON THE GROUND WHERE HE FELL.**

Which is never where you are standing. The loop becomes: kill until dry, then
break cover and cross the lot to a body, under fire, while the men still up work
your angle. Movement stops being a way to avoid dying and becomes the only way to
keep shooting.

It is self-balancing (the fight always contains enough bullets to finish it,
because they are *on* the men) and it cannot dead-end (walking costs nothing, and
the other gun is one tap away).

## THE NUMBER IS SET BY THE LAW, NOT BY TASTE

First cut gave every gun a full magazine. Measured:

```
CLEARED THE FIGHT WITHOUT MOVING    26 of 40   (65.0%)
```

**The law's test failed.** 8 in the pistol plus 4 in the rifle covers 8 men, so
the first excursion never has to happen. The starting load is therefore
*constrained*, not chosen: it has to be smaller than the fight or the mechanism
is decoration. `START_LOADED` is 3 in a pistol, 2 in a rifle.

And that is the premise anyway. You scavenged this gun. Nobody in a collapse
carries a full magazine and spares. Starting nearly dry is not a difficulty
setting, it is the world.

## MEASURED, ONE POLICY, TWO ARMS

Same fights, same player logic. The only difference is whether he may walk.

```
NEVER MOVES (his test -- this MUST fail)
    cleared the fight         0 of 40    (0.0%)
    men down when he ran dry  3.8 of 8

ALLOWED TO WALK (this MUST succeed)
    cleared the fight        31 of 40    (77.5%)
    tiles walked             42.6
```

And the control that keeps me honest: the same policy in the **old
infinite-ammo world** cleared 32 of 40. So scarcity costs essentially nothing in
winnability. It does not make fights unwinnable. It makes *standing still*
unwinnable, which is the entire ruling.

## THE DEAD END I SHIPPED AND CAUGHT

The first version typed every drop by the dead man's calibre. More realistic, and
it **dead-ended 24 of 40 fights**: he carries a pistol, the ground is covered in
rifle ammo he cannot load. A mechanism that can strand him is not a mechanism, it
is a bug with a story attached. Rounds are rounds now.

## THE GATE HIS LAW ASKED FOR BY NAME

His law says:

> *"A gate that plays a fight from one spot and requires it to FAIL is the honest
> check, and it is what should prove this ruling is satisfied."*

`gates/fight_moves_you_gate.js`, registered in the suite. It boots the real alpha,
opens the real combat tab and plays real fights, calling the **shipped**
functions (`dryNow`, `doReload`, `doSwap`, `spendRound`, `pickTarget`,
`dropRounds`, `worldShift`) rather than reimplementing the maths, because a gate
that marks its own homework is the failure that has cost this project three
sessions. **10 pass / 0 fail.**

It checks both directions plus the control, so it cannot be satisfied by shipping
an unwinnable fight. **Mutation-tested**: restoring full magazines makes the
never-moves arm clear 8 of 12 and takes it red.

`gates/combat_lab_gate.js` — **808 pass / 0 fail** for the shape of the thing.

## THE HARNESS BUGS, NAMED

Three of my own measurements were wrong before they were right, and I am writing
them down rather than quietly fixing them:

1. A harness that never advanced the turn counter, so `pressAI` skipped everyone
   and I nearly reported "they stop moving after turn one."
2. A harness that spent a round *before* checking there was a target, which the
   shipped code never does, so it burned ammo on nothing and invented dead ends.
3. A harness that stopped the fight when nobody was in range instead of walking
   toward them, which turned my own walking arm into a losing one.

The eight remaining unwinnable fights in the walking arm are **not** caused by
ammo: the control arm with infinite rounds loses the same ones. They are my
walker being unable to use stairs.

## WHAT I DID NOT DECIDE

Every number is a `[DIAL]` with a real attempt in it rather than an empty table
he cannot play. The one that controls the whole feel is `START_LOADED`. Gun
ranges are still untouched and still his open debate.

TOOL: `tools/bohemia_combat_the_bullets_are_over_there_patch.py`
