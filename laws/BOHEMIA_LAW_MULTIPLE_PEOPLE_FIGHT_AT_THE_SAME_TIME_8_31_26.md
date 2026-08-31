# BOHEMIA LAW — MULTIPLE PEOPLE FIGHT AT THE SAME TIME
# (Paolo 8/31/26, LOCKED. COMBAT lane. Gate: fight_moves_you_gate.js)

> "OKAY NOW WHAT ABOUT 2 V 8 WHEN I HAVE A COMPANION. **THIS GAME WILL ONLY WORK
> WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME TIME!** DO BIG BRAIN RESEARCH IF YOU
> NEED. IM GETTING THE REFERENCE LAB TO LOOK UP BATTLE BROTHERS ND TACTICS YOU
> CAN DO THE SAME. **I IMAGINE OUR COMBAT IS WAY MORE AUTOMATED YOU REALLY ONLY
> NEED TO CONTROL YOURSELF FOR REAL!!!**" — Paolo, 8/31/26

---

## 1. THE RULING, IN THREE CLAUSES

1. **A FIGHT CAN HOLD MORE THAN ONE BODY ON YOUR SIDE.** Not a summon, not a
   buff, not a turret: a person who stands on a tile, takes a turn, gets shot at,
   and can be lost.
2. **THE COMPANION IS AUTOMATED.** "You really only need to control yourself for
   real." She runs a fixed ladder. There is no order menu, no gambit list to
   edit, no pause to command her. The player's control surface does not grow.
3. **THE INCOMING FIRE IS SHARED.** A body on your side that never draws a bullet
   is a damage buff wearing a hat. Whoever a shooter can reach, he picks between.

## 2. WHY IT IS A LAW AND NOT A FEATURE REQUEST — THE MEASUREMENT

Run before anything was built. Same 30 boards, same policy, one man, **triple the
shipping health (300)**, fifty turns to finish. Rooms cleared:

| foes in the room | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|
| **rooms cleared, alone** | 78.3% | 48.3% | 30.0% | 5.0% | **0.0%** | **0.0%** |

**One man clears zero rooms of seven or eight, out of sixty tries each.** And he
mostly does not *die* in them — he is pinned, and the fight simply never ends.

`ENC_SIZES` has shipped `[3,4,5,6]` since V167 for exactly this reason, with
RF4's own design notes reserving 7-8 for **boss fights**. *His instinct is the
measurement.* Eight is not a fight for one person, and the thing that makes it
one is a second body.

With her, same boards, same policy: **8 foes 0% → 60%**, 6 foes 3.3% → 58.3%,
4 foes 55% → 80%. She goes down in 13.3% of eight-man rooms and 0% of four-man
ones, so the danger scales with the room instead of being paid entirely by you.
**And eight-with-her still clears worse than three-alone**, so the curve keeps
its shape and the reserved size stays the hard one.

## 3. THE RESEARCH (COMBAT half; LAB studied the campaign half the same day)

**BATTLE BROTHERS**, the game he named:

- **No separate player and AI phases.** Every body on both sides is sorted into
  one order and acts in it. Initiative is recomputed each round from action
  points, fatigue and armour weight.
- **Its ally AI is set once, not steered.** *"A unit will act like a ranged
  character if he has a ranged weapon equipped and a melee character if he has a
  melee weapon equipped. This decision is made at the time you enable the AI."*
- **Its enemy targeting is the load-bearing part.** Melee goes for the weakest
  body; **ranged fire disperses** toward the softer, nearer target rather than
  concentrating. Its players' standing answer to being shot at is *"keep weaker
  characters behind somebody else"* — **a sentence that only means anything if
  there is somebody else.**

**FF12'S GAMBITS / DRAGON AGE'S TACTICS**: an ordered if-then ladder the ally
runs by itself, beloved for exactly the reason he gave — it takes the tedium out
and lets you play your own character. But those are **lists the player edits**,
and he asked for the opposite. So the ladder is **fixed** and the whole
instrument is one word.

**THE BUREAU: XCOM DECLASSIFIED** is the shape he described almost exactly: you
control the squad leader, the others fend for themselves.

## 4. AND THE MACHINERY ALREADY EXISTED. IT HAD ONLY EVER BEEN GIVEN TO THE ENEMY.

`tickTurnEnd` has run **meleeTurnRun, medicTurn, breachTurn, coverSeekAI and
pressAI** since this fight was built — five automated actors making their own
decisions every turn, and **every one of them on the other side**. The medic
already walks to a body and picks it up. *Nothing on your side had ever taken a
turn.*

Same for the geometry. **V193's `gunsOnTile` is the fight's own exposure question
asked from a tile that is not where you stand**, gated at 30 of 30 fights
agreeing with `posExposed`. A companion stands on a tile that is not where you
stand. The hard part of a second body was already built, already gated, and had
only ever been used to tint the floor.

**So it ships as ONE geometry, not two** (ENGINE SYNC LAW): `gunsOnTile` is now a
count over `hitsTile(e,dx,dy)` — *can this man shoot a body standing there*. A
second copy is how one variable quietly becomes five that disagree, and this lane
has caught that twice in a week.

## 5. THE RULES, EXACTLY

**WHO A SHOOTER ENGAGES**, per turn, pure and cached:

- cannot reach her at all → **he is on you**, unchanged
- your cover stops him and hers does not → **he takes her**
- both of you open → the **nearer** body wins; when it is close his own index
  breaks the tie, so a squad **disperses across two men instead of stacking**

**AND THE COST IS REAL AND IS NOT HIDDEN: a companion draws fire that would never
have reached you.** A man out of reach of your tile but in reach of hers is a man
now shooting somebody on your side. That is the trade.

**THE SPLIT IS ON THE VOLLEY POOL AND NEVER ON THE POSITIONAL READ.**
`exposedToMe` is *who is shooting at you*; `posExposed` is, in its own words,
*"who could line you up"* — and a man who could line you up but chose the other
target still could. Folding the split into `posExposed` would have made V193's
agreement arm a lie the moment a second body existed.

**HER LADDER**, fixed, in order, once a turn:

1. a blade inside reach of **you** → shoot it — *"GOT THE BLADE"*
2. the spotter, while he has the room → shoot him — *"ON THE SPOTTER"*
3. anything she can reach → the one nearest dead, so bodies actually fall
4. nothing in reach → one step, onto the ground with the least fire on it

She answers the blade first because it is the thing the player provably cannot:
V196 measured that crossing a room costs you the fight unless you spend a stamina
pip, and a knife already on you is that problem with no pip left in it.

## 6. WHAT THIS LAW DOES NOT TOUCH

- **NO DAMAGE BEFORE THE DIAL.** She authors **no number at all**. She is
  `ARCH.human` — the same 60 hp and the same `[14,26]` every goon in the valley
  carries — firing through the same `distAccuracy` model, read from her position.
  `applyDamage` is 40 and the archetypes are byte-identical.
- **`seesMe` is untouched.** V165's one door for sight is not opened again.
- **MECHANISM-MINE / CONTENTS-PAOLO'S.** *Who* walks with you is his. The name
  ships as a real attempt tagged `draft:true` per the 8/11 words rule, so there
  is somebody to meet instead of a blank field.
- **HE MUST BE ABLE TO DIRECT IT (8/12).** One toggle, in DEMO SETTINGS, in the
  COMBAT tab: **SHE FIGHTS WITH YOU: ON/OFF**. Being able to see the fight
  without her is how you tell what she is worth.

## 7. WHAT THE GATE HOLDS

`fight_moves_you_gate.js`, and it **asserts invariants and reports rates**, never
the other way round:

- the one-man curve, and that eight-alone is **zero**
- a strict improvement with her at six and at eight, and that eight-with-her
  stays **at or below** three-alone
- **ONE geometry**: `gunsOnTile` equals the count over `hitsTile` on every tile,
  and `posExposed` still equals `gunsOnTile(0,0)`
- three hard invariants on every staged board — **DISJOINT** (nobody shoots both
  of you on one turn), **REACHABLE** (every man on her can reach her tile),
  **CONSERVED** (no fire evaporates in the handover)
- she stops being a shield the moment she is down, staged on a board **hunted
  for** because it actually has men on her
- she authors no damage number, and her name is drafted
- she is painted with her name **above** her head, at an anchor **derived from
  `drawHuman`** rather than eyeballed

## 8. THE PROCESS LESSONS OF THE TURN

- **AN EYEBALLED LABEL OFFSET LANDS INSIDE THE TORSO.** `drawHuman` blits the 112
  art at `ey-84*S`, so a head top is exactly `84*bodyScale()` above a body's
  field position and the soles are `28*S` below. Looking at hers is what caught
  **V196's**, shipped the day before at `er*1.9` — 0.65 of a ring where a head
  top is 2.3 rings up. **It was painted on the man's chest.** Fixed in the same
  pass, at the derived anchor.
- **A CHECKER THAT RECOMPUTES THE CAMERA IS MEASURING ITS OWN ARITHMETIC.** The
  first cut of the label arm rebuilt `fieldPos` with a centre and a pixel ratio
  the gate does not have, and reported a correct label broken — the same failure
  that cost V193's pixel arm seven attempts. **The frame writes down what it
  did** now, and the gate reads that.
- **A CHECK THAT READS WHAT YOU HANDED IT IS NOT A CHECK.** The first cut of the
  down-vs-up arm pinned one seed, drew zero men on her, and reported `0 → 0` as a
  pass. It hunts for a live board now.
- **A RATE NEEDS A THRESHOLD PICKED IN ADVANCE**, and this lane has four times
  caught itself picking one loose enough to fit its own swing. The split arm
  asserts invariants and reports the rates.
- **A COMMENT CAN COST AN ANCHOR A CHARACTER.** The first cut split
  `tickTurnEnd`'s head line to make room for a note; two combat_lab claims held
  that line as exact text and both went red, correctly. The head is
  byte-identical now and the note sits above the function.
