# V187 — EVERY ROOM IS A DIFFERENT QUESTION
### COMBAT lane, 8/26/26. The puzzle he asked for.

---

## THE BRIEF

> *"Rogue Fable four isn't necessarily a puzzle game, but **it kind of is**. And
> when you drop me in these, like, sample environments, **it should almost be,
> like, how is best to solve this puzzle given my stats at the time.**"*

---

## OUR OWN TEARDOWN NAMED THE GAP, AND WAS HALF WRONG ABOUT IT

RF4-26 says enemies come in **mixed groups designed to work together**. Our column
read: *"The bodies are differentiated; **the groups are not composed.**"*

**That was half wrong, which is why this is not a rewrite.** `composeRoster` was
never random — it is a good "spine at every size" recipe: a sniper at three, the
machine at four, his 7/19 blades, the medic, the breacher.

**The problem is that it was the only recipe.** Five men was *always* sniper + bot
+ blade + medic + breacher. Every arena in the game asked the same question, so
there was nothing to solve — you learn one answer on fight three and repeat it
forever. **A puzzle needs a different question, not a harder one.**

---

## FIVE SHAPES

| shape | what it is | what it punishes |
|---|---|---|
| **THE NEST** | a sniper and machines that hold, **no blades** | camping |
| **THE RUSH** | blades and **no machine at all** | standing still badly |
| **THE ANVIL** | a breacher eating your stone | trusting one rock |
| **THE CHOIR** | medics behind the bodies | shooting whatever is closest |
| **THE MIX** | his 7/19 spine, unchanged, still in the pool |  |

**THE NEST and THE RUSH want opposite things from you** — holders against closers
— so no single habit survives the pool. And *"given my stats at the time"* is what
makes it a puzzle rather than a quiz: with a plate in hand THE RUSH is survivable
head on, without one it has to be kited.

All five turn up across 200 fights, roughly evenly.

---

## THREE THINGS THIS BROKE THAT WERE WORTH KEEPING

Every one was caught by a gate written before today, and every one was a real
guarantee rather than a stale anchor.

**1. A shape must decide what DOMINATES, not what is the only threat.** The first
cut gave THE NEST *a sniper and four plain goons* — **blander inside a fight than
the spine it replaced.** The spine's own comment had warned about exactly this:
*"a three-man fight is three different problems from three directions, not two
goons and a stick."* Trading variety-within-a-fight for variety-between-fights is
not a trade worth making. Every shape now carries a signature **plus** a real
second threat.

**2. Exactly one worst man.** V167 holds that as RF4-37's missing precondition —
you cannot have a priority target in a crowd of interchangeable goons. The second
cut doubled signature bodies (two snipers, two breachers) and broke it. **No shape
doubles its signature now.** What differs is *which* body is the worst one and
what stands beside it.

**3. A small room is still three problems.** THE NEST at three men came out
`sniper + bot + bot` — **two kinds.** A shape may lean; it may not collapse. The
last duplicate gives way so the floor holds. **Verified across 1500 rosters: every
one has three or more kinds and exactly one sniper.**

---

## AND THE SAME TRAP AS V163, IN A DIFFERENT GATE

V167 does not read `composeRoster` as a string — it **slices it out and executes
it**, bound only to `G`, to prove the recipe really makes a mixed group at every
size. My shape code sat *above* that slice, so the harness threw and **three
correct claims went red at once.**

Everything `composeRoster` calls is now declared **inside its own slice**, with the
reason written next to it. This is the second time today a slice-and-execute gate
has been broken by code placed just outside it, and both times the gate was right.

---

## HIS 7/19 MELEE RULING STILL WINS OVER EVERY SHAPE

At NO-BLADES every shape puts down **zero** blades. At PACK every shape gives him
his **half**. A shape *bends* the mix; it never replaces it — the exact mistake
V173 made when a new archetype ate a slot a ruling had already claimed.

---

## TWO CLAIMS RE-POINTED, AND BOTH GOT STRONGER

**V177's ordering claim** required *exactly one* `out.push('breacher')` in the
file — a guard a previous session wrote because *"an ordering claim that reads
indexOf is defeated by a duplicate."* V187 legitimately adds a second recipe, so
the guard fired on a correct change. **The intent was never "one push site", it
was "he never jumps ahead of the blades"** — now checked **inside every recipe**,
scoped, which is stronger than one global position test.

**V177's chew arm** used to *skip* any fight without a breacher. That was fine
when every roster had one; now he is concentrated in THE ANVIL, and skipping
starved the arm to 18 bites against a threshold of 20. **That arm is about the
mechanic, not the frequency** — frequency has its own claim — so it now **stages**
him. 120 bites, 9 pillars destroyed, 0 with him pinned.

---

## GATES

- `fight_moves_you_gate.js` — **107 pass / 0 fail**
- `combat_lab_gate.js` — **930 pass / 1 fail**, and that one red is **not this
  lane's**: it is the fight-music intensity ladder another session changed today,
  and it fails identically with all of this work stashed.

---

## WHERE HE FINDS IT

**COMBAT tab.** Start a fight and the readout names the room — THE NEST, THE RUSH,
THE ANVIL, THE CHOIR, THE MIX. **The room announces the question and never the
answer.**
