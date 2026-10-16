# THE MAN WHO KEEPS LEAVING (v173, RF4-38 + RF4-27)

COMBAT lane, 8/20/26. **TAB: COMBAT.**

## THE ROW

RF4-38, ★★:

> *"**Support enemies have their own AI, and it runs away from you.** Backliners
> maintain line-of-sight and range with at least one **ally** while biased
> **against** being close to, or in line-of-sight of, the **player.** Built to be
> hard to reach, which forces the player to either aggro into them or have tools
> to pick them off."*

Our diff column: *"ABSENT. No enemy reads another enemy. This is the concrete
version of RF4-27, and it is the mechanism that makes RF4-37 real: **the thing
you must kill keeps leaving.**"*

V171 built the group *read*. This is the first body whose entire existence is
about the group rather than about you.

## HE IS A GOON WITH A JOB

His hp, accuracy and damage are `ARCH.human`'s exact numbers, **copied, not
chosen.** An entire new archetype sets no damage number, so NO DAMAGE BEFORE THE
DIAL survives a new body joining the roster — and it makes the measurement pure,
because **there is no difference to point at except behaviour.**

| same slot, same start, same ten turns | ends at | no clean line on him | nearest ally |
|---|---|---|---|
| GOON | 5.87 tiles | **17%** | 4.45 |
| MEDIC | **7.46 tiles** | **67%** | 4.83 |

## WHAT HE DOES: HE STANDS THE DOWNED BACK UP

Both states already ship and neither is a number anybody chose. V32's
weapon-gated lethality leaves a man **downed at hp 1** when the killshot is not
fatal; V71's nerve system breaks or scatters survivors once half the room is out
of it. **Nothing had ever undone either.**

| knock men down, look again a turn later | knocked | stood back up |
|---|---|---|
| with him **alive** | 117 | **47** |
| with him **dead** | 78 | **0** |

**He is revived at the hp the game left him, which is 1.** The medic sets no
health number at all — a man he stands up dies to anything. What he costs you is
a **turn**, not health: you shoot that body a second time. So the puzzle is not
*out-damage the healer*, it is **kill him first and your kills stick** — RF4-37's
priority target and RF4-27's *"a single healer turns a crowd into a
priority-target puzzle"* in one move. And he comes up **winded**, on the stun
state the fight already owns, because nobody gets off the floor shooting.

## AND THE WOUNDED PULL HIM OUT, WHICH IS THE WHOLE FIGHT WITH HIM

Measured without it, he hid so well he could not reach anybody. The lazy fix is
to lengthen his reach — which is a healer working the room from cover with **no
counterplay at all**. Instead a body on the floor outranks his own skin: he
breaks cover to get to it, closing **4 tiles in four turns** toward a man dropped
six tiles past him.

That is RF4-38's own closing line — hard to reach, so the player must *"aggro
into them or **have tools to pick them off**"* — except **the tool is a body on
the ground, and you make it yourself.**

**And pinning him stops him.** He is a goon; everything that works on a goon
works on him. On an identical board a free medic gets the body up and a
suppressed one does not.

## THREE THINGS BUILT AND CUT, WHICH IS WHERE THE TURN ACTUALLY WENT

1. **His first job was un-pinning allies** — undoing the player's SUPPRESS, which
   reads like a textbook RF4-28 counter to an effective player action. Two things
   killed it: `SUPP_TURNS` is 1, so a pin expires by itself next turn anyway, and
   `doSuppress` pins **every** exposed man **including him**, so one press of the
   button switched him off permanently. Measured **480 of 480** pins surviving
   with him alive and **352 of 352** with him dead — identical, because he never
   got a turn. **A counter with a one-button counter is not a counter.**
2. **`MEDIC_SHY`, a "how badly he wants to be away from you" dial, was killed by
   mutation testing.** Set to zero he still ended 7.5 tiles out against 7.39 with
   it, still unseen 67% of the time. **The hide term was doing all of it** — a
   tile with no angle on you is a tile far from you most of the time — so the
   distance term was buying something already bought. A dead dial is worse than
   no dial, third time this month.
3. **He was placed ahead of the blades in the roster and it broke a ruling.** At
   PACK the recipe wants `floor(N/2)` knives and the medic was eating one, so
   PACK stopped meaning more knives. He now fills **after** his 7/19 melee mix
   has taken its slots. A gate must never outrank a ruling, and neither may a new
   archetype.

## AND IT DOES NOT FIX YESTERDAY'S DEFECT, WHICH IS THE POINT

The skill-gap gate was re-run against this build. **The ordering did not move:**
the pacifist still wins 15 of 24, and shooting is still monotonically worse.

That is not a disappointment, it is the **cleanest possible confirmation of the
diagnosis.** V173 makes the fighting genuinely harder — 40% of your knockdowns
get stood back up — and the dominant strategy is exactly where it was, because
**making a fight harder is not the same as making it worth something, and only
the second one can beat a door.** A new claim, S4b, pins that.

## GATES

- `gates/fight_moves_you_gate.js` — **58 pass / 0 fail** (8 new V173 claims,
  including two direct arms added *because* mutation testing found them missing)
- `gates/combat_lab_gate.js` — 883 pass / 2 fail (7 new V173 shape claims; both
  fails already red on clean main)
- `gates/skill_gap_gate.js` — 6 pass / 0 fail (S4b new)
- `gates/top_of_the_document_gate.js` — 10 pass / 0 fail, **25 BUILT rows, 25
  named by a gate**

**Eight mutations, all caught.** Three initially survived the browser — working
while pinned, deleting the wounded-pull, and the shy dial — and each one was a
real gap: two became new behaviour arms, and the third turned out to be a dead
dial and was deleted.

**And the shape gate caught itself on a mention-versus-use.** The first write
asserted the string `MEDIC_SHY` appears nowhere — and it appears in the comment
explaining why the dial was removed, so the gate failed the build for documenting
its own finding. That is the identical defect the expression-line gate was built
for this same morning: strip the explanation and you are left with a deletion
nobody can account for.

**RF4-38 and RF4-27 both move SPECED → BUILT.** Starred rows built: **8 of 18**,
top ten: **6 of 10**. The only ★★★ row left is RF4-36, the thesis.
