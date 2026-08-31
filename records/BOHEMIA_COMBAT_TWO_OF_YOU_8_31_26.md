# V197 — TWO OF YOU (COMBAT lane, 8/31/26)

> "OKAY NOW WHAT ABOUT 2 V 8 WHEN I HAVE A COMPANION. THIS GAME WILL ONLY WORK
> WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME TIME!... I IMAGINE OUR COMBAT IS WAY
> MORE AUTOMATED YOU REALLY ONLY NEED TO CONTROL YOURSELF FOR REAL!!!" — Paolo

Law: `laws/BOHEMIA_LAW_MULTIPLE_PEOPLE_FIGHT_AT_THE_SAME_TIME_8_31_26.md`

---

## THE NUMBER HE WAS REACTING TO, MEASURED BEFORE ANYTHING WAS BUILT

Same 30 boards, same policy, one man, **triple the shipping health**, fifty turns:

| foes | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|
| rooms cleared | 78.3% | 48.3% | 30.0% | 5.0% | **0%** | **0%** |

**Zero of sixty, twice.** He mostly does not die in those — he is pinned, and the
fight never ends. `ENC_SIZES` ships `[3,4,5,6]` for exactly this reason, with
RF4's notes reserving 7-8 for boss fights.

## AND WITH HER

| foes | alone | with her |
|---|---|---|
| 4 | 55% | **80%** |
| 6 | 3.3% | **58.3%** |
| 8 | **0%** | **60%** |

Damage to clear at eight: 68. She is down in 13.3% of eight-man rooms, 1.7% of
six, 0% of four — **the danger scales with the room**. And eight-with-her stays
below three-alone, so the curve keeps its shape.

*(The gate's own arm reads lower in absolute terms — 0% → 16.7% at eight — and
the reason is the harness, not the game: that policy spends any ability the
instant it is ready, and by that point in the file more of them are unlocked, so
more turns go to abilities instead of shooting. Both arms pay it equally, which
is why the arm compares and does not calibrate. The arm says so in its own text.)*

## THE MACHINERY WAS ALREADY THERE, ON THE WRONG SIDE

`tickTurnEnd` has run **meleeTurnRun, medicTurn, breachTurn, coverSeekAI,
pressAI** since this fight was built — five automated actors taking a turn every
turn, **all five theirs**. The medic already walks to a body and picks it up.
Nothing on your side had ever acted.

And **V193's `gunsOnTile` is the fight's own exposure question asked from a tile
that is not where you stand**, gated at 30 of 30 against `posExposed`. A
companion stands on such a tile. So the hard part existed, was gated, and had
only ever tinted the floor. It ships as **one geometry**: `gunsOnTile` is now a
count over `hitsTile(e,dx,dy)`, and the gate checks they agree on all 49 tiles.

## THE FIRE SPLITS, AND THE COST IS NOT HIDDEN

Battle Brothers' own measured targeting: melee takes the weakest body, **ranged
fire disperses** toward the softer nearer target rather than concentrating, and
its players' answer to being shot at is *"keep weaker characters behind somebody
else"* — a sentence that only means anything if there is somebody else.

The rule: cannot reach her → he is on you; your cover stops him and hers does not
→ he takes her; both open → the nearer wins, tie broken by his index so the squad
splits instead of stacking.

**A companion draws fire that would never have reached you** — a man out of reach
of your tile but in reach of hers is now shooting somebody on your side. On 7 of
20 staged boards that is exactly what happens.

The split is on the **volley pool** and never on the positional read, because
`posExposed` is a geometry question ("who *could* line you up", its own words)
and folding the split into it would have made V193's agreement arm a lie.

## THE GATE ASSERTS INVARIANTS AND REPORTS RATES

**DISJOINT 20/20** (nobody shoots both of you on one turn), **REACHABLE 20/20**
(every man on her can reach her tile), **CONSERVED 20/20** (no fire evaporates in
the handover). *A rate needs a threshold picked in advance, and this lane has
four times caught itself picking one loose enough to fit its own swing.*

## FOUR BROKEN INSTRUMENTS, AND ONE OF THEM WAS YESTERDAY'S SHIPPED ART

1. **THE LABEL ANCHOR.** `drawHuman` blits the 112 art at `ey-84*S`, so a head
   top is exactly `84*bodyScale()` up and the soles `28*S` down — numbers in the
   code the whole time. My first label sat on her head. **And looking at hers is
   what caught V196's, shipped the day before at `er*1.9` — 0.65 of a ring where
   a head top is 2.3 rings up. It was painted on the man's chest.** Both fixed at
   the derived anchor.
2. **A CHECKER THAT REBUILDS THE CAMERA MEASURES ITS OWN ARITHMETIC.** The first
   label arm recomputed `fieldPos` with a centre and pixel ratio the gate does
   not have and called a correct label broken — V193's pixel arm burned seven
   attempts on the same thing. The frame writes down what it drew now.
3. **A CHECK THAT READS WHAT YOU HANDED IT IS NOT A CHECK.** The down-vs-up arm
   pinned one seed, drew zero men on her, and reported `0 → 0` as a pass. It
   hunts for a live board now, and fails if it cannot find one.
4. **A COMMENT COST TWO ANCHORS A CHARACTER.** The first cut split
   `tickTurnEnd`'s head line to make room for a note; combat_lab holds that line
   as exact text in two claims and both went red, correctly. The head is
   byte-identical now, the note sits above the function, and V136's ordering
   window is widened with the reason written into it.

## NO DAMAGE BEFORE THE DIAL, THROUGH A WHOLE NEW BODY

`applyDamage` is 40. Archetypes byte-identical (`32-48/0.72`, `14-26/0.55`).
**She authors no number at all** — she is `ARCH.human`, the same 60 hp and the
same `[14,26]` every goon carries, firing through the same `distAccuracy` model
read from her position. `seesMe` is untouched.

## WHO SHE IS STAYS HIS

The name ships as a real attempt tagged `draft:true` per the 8/11 words rule, so
there is somebody to meet instead of a blank field. **Tab: COMBAT** — she is
beside you when the bell rings, and DEMO SETTINGS holds **SHE FIGHTS WITH YOU:
ON/OFF** so the fight can be seen without her.

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **155 pass / 0 fail** (was 148/0) |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's, pre-existing) |
| `one_engine_gate.js` | 3 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| page errors | **0** |

## WHAT COMES AFTER

1. **SHE CANNOT BE PICKED BACK UP.** She goes down and stays down for the fight.
   The medic on the other side has done exactly this since it was written, five
   feet away in the same function — **the enemy has a mechanic for their fallen
   that your side does not.**
2. **THE ENEMY DOES NOT KNOW SHE IS A PERSON YET.** Blades still run at the
   player only; `meleeTurnRun` is a separate engine and the split is on ranged
   fire. A knife that could choose her is the next honest half of this.
3. **SHE HAS NO AMMO AND NO RELOAD.** The player's magazine economy (V149/V157)
   does not touch her.
4. Still open from the 8/25 dispatch and still combat's: **"it could be more
   hardcore if you wanted it to be"** — permission, not a ruling.
