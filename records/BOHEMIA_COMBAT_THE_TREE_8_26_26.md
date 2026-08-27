# V188 — THE TREE
### COMBAT lane, 8/26/26. The piece five days of work were waiting for.

---

## THE RULING

> *"**BRO THERE ARE NO RUNS.** IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS TO
> COMPLETE BRO. **LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE
> CYBER PUNK ELDERSCROLL PERK AND BONUS SHIT.** WILL ALSO GO HAND IN HAND WITH
> ABILITIES AND THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO
> INTERACT WITH BOHEMIA BRO!"*

---

## THE SOCKETS WERE ALREADY CUT, AND NOT ONE HAD A HAND ON IT

This is not a menu bolted onto combat. **It is the thing the last five builds were
made against, and every one of them ended in a dead end:**

| built | and it terminated in |
|---|---|
| **V181** put experience on the bodies and made you walk to it | a ledger **nothing read** |
| **V183** gated the whole nerve system behind `G.perks.fear` | its own comment: *"nothing turns it on"* |
| **V182 / V184** gave you Power, plates, legs | fixed forever at their start value |
| **V185** gave you a kit with charge rates | a rate nobody could change |

**Seven of the nine perks below need no new mechanic at all.** They move a number
a shipped system already reads. That is the proof this was the missing spine
rather than an addition.

---

## NINE PERKS, THREE BRANCHES

| | | |
|---|---|---|
| **BODY** | PLATE CARRIER | walk in wearing two |
| | SECOND SKIN | room for four on you instead of three |
| | WALK IT OFF | one back at the top of every fight |
| **EYE** | **THEY KNOW YOU** | **men break and run from you now** |
| | STEADY EYE | +1 Power: every gun's window, never its damage |
| | QUICK STUDY | the kit comes up one sooner |
| **HAND** | LONG WIND | a fourth pip in your legs |
| | CLOSER | the finisher lands at three |
| | OPENING MOVE | one ability ready when the bell goes |

**THEY KNOW YOU is the flagship, and it is his own sentence made mechanical.** He
said: *"I don't wanna see anyone run away... unless I have a perk that allows them
to. **You're not scary enough.**"* V183 built the off switch and named the perk
that would one day flip it. **This is that perk.**

---

## MEASURED ON THE REAL SURFACE

| | |
|---|---|
| a body you walk over pays the tree | **15 xp** |
| 360 xp | level **4**, **3 points** |
| every perk moves | exactly one thing, and it is the thing it names |
| across a **brand new fight** | 2 perks still owned, power 1, plates 2 |
| buy broke / buy twice / buy above level | **all refused** |
| damage with **all nine** owned | **40 → 40** |
| page errors | 0 |

`carrier:pp  skin:carry  walkoff:pp  fear:fear  eye:power  study:kitNeed
wind:legs  closer:finish  opening:charged`

**"No runs" is not a slogan here, it is the storage layer.** The tree is written
out, read back on load, and applied at the top of every fight. Wrapped in
try/catch and falling back to memory, because a `srcdoc` frame can be handed an
opaque origin and **a tree that throws is worse than one that forgets.**

---

## *** THE SLICE RULE, LEARNED THREE TIMES IN ONE DAY ***

Several gates here do not **read** a function. They **slice it out and execute
it** with a fixed list of bindings:

- **V163** does it to the speed clock
- **V167** does it to `composeRoster`
- **combat_lab** does it to `spendMove`, bound to exactly `(G, STAM_MAX, ...)`

That is a **good** way to gate — a per-use refund and a global clock are
indistinguishable by string, and only running the code settles it.

**It also means any helper a sliced function calls is undefined inside the
harness.** Calling `stamCap()` from `spendMove` did not fail a claim. **It crashed
the entire gate.**

So every perk-aware cap is now written **inline at its read site**, out of nothing
but a const the harness already binds and `G`. The named helpers stay for
everything outside a sliced function. Three separate gates taught this today
(V163 with the plate, V167 with the shapes, this one with the legs) and the rule
is now written where the next person will hit it.

---

## GATES

- `fight_moves_you_gate.js` — **111 pass / 0 fail**
- `combat_lab_gate.js` — **930 pass / 1 fail**, and that red is the fight-music
  intensity ladder another session changed today. Proven not this lane's: it fails
  identically with all of this work stashed.
- `one_engine_gate.js` — **3 pass / 0 fail**

One claim re-pointed: **V176's** finisher read, because CLOSER lowers the
threshold. The claim is unchanged — a counter and a ready state, no button, no HUD.

---

## WHERE HE FINDS IT

**COMBAT tab.** Kill men, walk over the bodies, and a **LEVEL** button appears
next to SUPPRESS when you have a point. Tap it and the tree opens. The perks stay
bought.

---

## WHAT COMES AFTER

**The 60 mini bosses.** He tied them to this in the same breath: *"will also go
hand in hand with abilities and the 60 mini bosses in the game that give you a new
way to interact with Bohemia."* The tree is the socket they plug into — a boss
does not drop a trophy, **it hands you a verb.** There is already a boss ladder in
the repo with 53 candidates and a gate holding their locks distinct.
