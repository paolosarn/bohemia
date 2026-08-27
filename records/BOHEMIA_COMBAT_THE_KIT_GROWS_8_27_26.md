# V191 THE KIT GROWS + V192 ONE NUMBER IS ONE EXACT FIGHT (COMBAT lane, 8/27/26)

> "LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
> ELDERSCROLL PERK AND BONUS SHIT. **WILL ALSO GO HAND IN HAND WITH ABILITIES AND
> THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA
> BRO!**" — Paolo, 8/26

---

## THE HALF NOBODY BUILT

He named **three** things in one breath and said they go hand in hand: the TREE
(V188), the BOSSES (V190) and the **ABILITIES** (V185's kit).

After V190 two of the three touched each other. **The kit was still exactly the
six it shipped with** — the same six on turn one of fight one and the same six on
hour ninety, in a hundred-hour game with sixty bosses in it.

**AND V190 ONLY PROVED THE LOCK, NEVER THE GRANT.** THE CLIMB hands back stairs
and THE CHARGE hands back the grenade, and *both are verbs the engine already
had*, switched off and returned. Not one boss gave you something that did not
exist before you beat him. That is the difference between a key and A NEW WAY TO
INTERACT, and it is exactly what his sentence asked for.

## THREE ABILITIES THAT DO NOT EXIST UNTIL SOMEBODY HANDS THEM TO YOU

Each is a grant off his own ladder, read out of the record, built on machinery
that already ships.

| ability | the man | what it does | measured |
|---|---|---|---|
| **PATCH IT** | THE WARD | *"treat and dose, so a bad day stops being the last one"* — the only thing in this fight that gives health back | hp **40 → 65**, bar reads 65%, cannot overheal (95 → 100) |
| **LIGHT IT** | THE BURN | *"light a fire anywhere, so you get the night back"* | your reach **11 → 16**, **a sniper's 8 → 16**, back to 11 when it burns out |
| **SEND HIM** | THE DOGS | *"take a dog: it walks with you, or it holds your gate"* | stun **0 → 2**, suppression untouched, **health untouched**, 0 other men affected |

**AN ABILITY NOBODY HANDED YOU IS ABSENT, NOT GREYED OUT.** Twelve turns of every
recharge verb in the game leave the three locked ones at **0 charge**, not ready,
**out of the row**, and pressing them does nothing. It must not even *accumulate*:
a fight quietly feeding a button that is not in the game yet, then revealing it
full, is a different feature. He has asked five times for things to come **off**
that row.

**AND THE KEY GIVES YOU THE ABILITY WHILE THE FIGHT STILL GIVES YOU THE CHARGE.**
Taking all three keys puts **nothing** in the row; turns of their own conditions
put all three there. V185's law held through a new door: a boss hands you a WAY
TO PLAY, not a charged button.

### *** LIGHT IT LIGHTS THE LOT FOR THEM TOO, AND THAT IS THE WHOLE DESIGN ***

V98's dark halves every range in this game and V160 made every reach — yours,
theirs, the sniper's — come through **one door**. So un-halving it un-halves it
for everybody who wants to shoot you. A fire that only lit your half would not be
a fire, it would be a scope, and his grant would stop being a decision.

## THREE OLD ARMS CAUGHT THREE REAL DEFECTS IN THIS TURN

1. **V185: two abilities on one verb.** The first cut hung the three on cover /
   move2 / kill — verbs the shipped six already own — and V185's arm went red on
   its own law: *"recharge conditions are UNIQUE PER ITEM."* Two abilities on one
   verb is a menu getting longer, not a set of pressures getting wider. They have
   their own conditions now, measured at turn end where `open` and `cover` already
   are: **QUIET** (nobody held a line on you), **DARK** (the turn ended after
   dark), **CLOSE** (somebody got inside four tiles). Nine abilities, **nine
   distinct verbs, one each, every verb with a real caller in a played fight.**
2. **V188: OPENING MOVE armed a locked ability.** The perk picks a random KIT row
   and charges it; with three locked rows in the list it started arming abilities
   the player does not have, which reads as arming **nothing**. *A feature that
   widens a list silently breaks every random pick over that list.*
3. **RF4-49: the sprint arm went intermittent** — see below.

## V192 — ONE NUMBER IS ONE EXACT FIGHT, NOT ONE EXACT LOT

V88's promise, verbatim: *"cover, spawn layout, looks, weapons — **one number
reproduces one exact fight, forever**."*

**V190 broke it twice, in opposite directions.**

- **First cut:** rolled the boss *inside* `withDice`, drew one number off the
  seeded stream every fight, and re-dealt every arena he has ever written down.
  Caught by V173 and V180 going red.
- **The fix moved the roll out to the real `Math.random`** — which repaired the
  COVER and left WHO TURNS UP unseeded. A pinned seed still rolled a different
  encounter every replay. **The lot was reproducible and the FIGHT was not, which
  is half a promise.** Caught by an RF4-49 movement arm that has pinned seed 6 for
  weeks and started failing about one run in three: the fight it drew was
  sometimes a boss fight with two of his guards standing on the cell it wanted to
  step into.

**THE LESSON, AND IT IS NOT THE ONE I WROTE DOWN YESTERDAY.** I recorded *"a
feature that costs a seeded stream one draw rewrites the whole map"* and then
fixed it by taking the draw out of the stream entirely — trading one broken half
for the other. **A thing that must be reproducible cannot be moved off the seed to
protect the seed.** It needs its own stream, keyed off the same number.

`bossDice()` builds a generator from the seed itself. Measured: seed 6 gives **THE
SURVEYOR in 1 distinct outcome over 25 replays**, 60 different seeds give **11
different answers**, and the arena signature is still **1** across 40 replays.

### AND THAT CHANGED WHAT AN OLD ARM IS ENTITLED TO ASSUME

A boss is decided by the arena number now, so a seed an arm pinned for weeks is
either **always** a boss fight or **never** one. Every arm in the combat gate that
predates V190 now declares `bossOff` **once, at boot, loudly** — those arms were
all written to measure an ordinary fight, and V190's and V191's arms ask for a
boss explicitly. *A default is not a workaround when it is the thing being
measured.*

The V190 rate arm was also wrong: it called `rollBoss()` **4,000 times on one
seed** and read that seed's answer 4,000 times — 100% or 0%, never 14%. A decision
that is deterministic per seed has to be sampled the way a player meets it: a new
number for every fight. Re-measured properly: **15.0%**, 53 different men, 0 once
you hold them all.

## TWO GATE ANCHORS RE-POINTED FOR STRUCTURE, NEVER FOR OUTCOME

- **V185's probe now holds the three keys for its run** and hands them back, so it
  tests the kit a player who has been playing actually has. Grown from 6 to 9,
  with the three new verbs staged and driven through the shipped tick.
- **V180's `openGroundTick` slice ran to `tickTurnEnd`**, so it swallowed every
  function anybody added in between — V185's `kitCoverTick`, then V191's
  `kitOwnTicks`. It ends at the next function now, and its rail is **content**
  (`finisherFeed()`, `wideOpen()`) rather than a magic character count. *A length
  rail fails every time somebody writes a longer comment next door.*

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **130 pass / 0 fail** (was 122/0), four runs, stable |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's fight-music ladder) |
| `boss_ladder_gate.js` | 87 / 0 |
| `one_engine_gate.js` | 3 / 0 |
| `tool_idempotent_gate.js` | 6 / 0 |
| page errors | **0** |

## WHAT COMES AFTER

Fifty of his fifty-three grants still live **outside combat** — the map, cooking,
tattoos, the workshop, the farm, the summon. `window.bohemiaKeys` publishes what
you hold, so CITY, RUN and QUESTS can close their own doors without knowing
anything about combat. Nothing about that is combat's to write.

Still open from his 8/25 dispatch, still named open: **ammo is confusing**
(readability), **"it could be more hardcore if you wanted it to be"** (permission,
not a ruling), and the pillars-and-stairs note — now partly answered by V187's
shapes and by THE CLIMB making height something you earn.
