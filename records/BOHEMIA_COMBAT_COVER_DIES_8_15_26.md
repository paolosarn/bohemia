# COVER DIES

**8/15/26 — COMBAT lane. Paolo: "there's no movement in the game bro... as soon
as I find Cover I can just hunker down until the end like it has to be things
that switched up naturally... right now it's just crouch somewhere and stay in
the same place."**

---

## FIFTH TIME HE HAS SAID THIS, AND I HAD BEEN FIXING THE WRONG SIDE

Every attempt so far was about making the **enemies** move — they flank, they
close, they press. He is telling me the problem is that **he** never has to.

## THE RESEARCH HE ASKED FOR

Turtling is a solved problem and there are only a few answers:

1. **Destructible cover.** XCOM's own solution — fire that misses chews the
   cover itself, and you break a wall to flush out what is behind it.
2. **Mission timers.** XCOM 2 added them specifically because XCOM 1
   *"encouraged slow squad movement that killed fun"* — which is his sentence in
   somebody else's mouth.
3. **Escalating pressure** — surround the player with more enemies as turns pass.

**I did not build the timer, deliberately.** A countdown is an author standing
off-screen shouting hurry up, and he asked for things that *"switched up
naturally."* This ships the two that are physics.

## 1. EVERY ROUND YOUR COVER EATS TAKES A BITE OUT OF IT

Concrete spalls. Sheet metal opens. A car door stops being a car door.

**The file already knew this and stopped one step short** — it wrote *"a round
that YOUR COVER ate has to go somewhere"* and used it to heat a car. It goes
into the stone now.

- **tall stone** → chewed down to **low cover** (crouch behind it, vault it)
- **low cover** → chewed to rubble and gone from the board

**The tile you are sitting on expires.** Not on a schedule — because you stood
there and let people shoot it. The decision to move arrives on its own, made of
the fight instead of a rule. Toughness comes from size, so a big block is a real
position and a crate is a few seconds, and you can read that off the board with
no number on screen.

## 2. THE MOVEMENT-FORCER WAS RATIONED TO ONE

The enemy grenade's own comment calls it *"the RF4 movement-forcer"* — the thing
built to make you leave a tile. And it was gated: **exactly one per encounter,
"for judging it clean."**

That was a **judging scaffold** so you could see it once and rule on it. You
ruled. The scaffold stayed up for two months, and the game's only purpose-built
reason to move has been firing once per fight. It runs on a cooldown now — a
real gap, never spam.

**Flagging this plainly: the old gate attributed that cap to you.** I changed it
under your 8/15 instruction rather than slipping it past. Say the word and it
goes back.

## MEASURED

| | |
|---|---|
| pillars at spawn → after 14 turns under fire | 64.9 → **47.3** |
| tall pieces knocked down to low cover | **13.4** per fight |
| enemy grenades | ~2 per fight (was hard-capped at 1) |

**Honest caveat:** my simulation chewed 45% of *all* pillars every turn, which is
far harsher than real play — only the cover actually taking rounds degrades. So
the real rate is slower, and the board decays around **you** specifically rather
than everywhere. That is the intended behaviour, not a shortfall.

## STILL OWED

**The killshot chain ignoring your facing** — you said "I already told you," and
you had. A chain target directly behind you means spinning 180°, which is not a
chain. Not fixed here; it is next.

Tool: `tools/bohemia_combat_cover_dies_patch.py`
Gate: `gates/combat_lab_gate.js`, 777 → 779 checks.

**WHERE TO SEE IT: the COMBAT tab.**

---

Sources:
- [Cover system — Wikipedia](https://en.wikipedia.org/wiki/Cover_system)
- [Turtling (gameplay) — Wikipedia](https://en.wikipedia.org/wiki/Turtling_(gameplay))
- [A Deep Dive Into XCOM and XCOM 2 — Game Developer](https://www.gamedeveloper.com/design/a-deep-dive-into-xcom-and-xcom-2)
- [Learning from XCOM: the rules that matter](https://lurkerablog.wordpress.com/2023/02/07/learning-from-xcom-1-the-rules-that-matter/)
