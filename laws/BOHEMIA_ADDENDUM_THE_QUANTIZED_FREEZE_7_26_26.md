# BOHEMIA ADDENDUM — THE QUANTIZED FREEZE (Paolo 7/26/26)

> "Lets freeze the game for that snappy satisfying feelings then."
> — Paolo, 7/26/26

LOCKED and shipped the same turn. This is item 1 of the juice research
(`records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md`).

---

## 1. THE LAW

**EVERY FREEZE IN BOHEMIA IS A NOTE VALUE.**

```
1/16 note   0.125s   GRAZE   a light weapon connecting
1/8  note   0.250s   HIT     a heavy weapon, or taking one yourself
1/4  note   0.500s   KILL    one WHOLE BEAT — the world stops dead
1/2  note   1.000s   LAST    the body that ends the fight; the room holds
```

Not one of those numbers is typed. They are all derived from `BEAT = 60/BPM` at
120 BPM, so if the tempo law ever changed, every freeze in the game would move
with it.

**A KILLSHOT IS A REST IN THE MUSIC.** The world stops for exactly one beat, the
song keeps running underneath it, and everything drops back in on the grid. That
is the whole idea, and it is only possible in a game that already quantizes
everything to a clock.

## 2. WHAT WAS THERE BEFORE, AND THE BUG NOBODY HAD SPOTTED

A hit-stop already existed (JUICE.F) and it counted **FRAMES** — 2, 3, 4, 6, 7, 10
and 14, across seven call sites. Two defects, and the second is a real bug:

1. **THE DURATIONS WERE ARBITRARY.** Seven frames is not a musical length. In the
   one game where the 120 BPM LAW quantizes everything else, the single most
   deliberate moment in combat was landing wherever it happened to land.

2. **FRAME COUNTING IS FRAMERATE-DEPENDENT.** Ten frames is 167ms on a 60Hz
   screen and **83ms on a 120Hz phone.** Every freeze in the game was **half as
   long on a newer iPhone**, and nothing in the code said so. Paolo has been
   judging feel on a device where every impact was running at half the intended
   weight.

Vlambeer's *Art of Screenshake* — the canonical juice talk — uses about 0.2
seconds and calls it barely visible and completely transformative. **That number
is correct for any game that is not on a clock, and wrong for this one.** The gate
now explicitly rejects 0.2s along with all seven old frame counts.

## 3. THE SHAKE DECAYS *INSIDE* THE FREEZE

The game-feel literature is specific: shake along the **axis** of the hit, with a
rapid exponential decay so readability comes straight back.

So the shake takes its direction from the shot vector, and **its duration IS the
freeze duration** — which means it can never smear into the next action or bleed
across a beat. It decays on a squared curve rather than cutting, it scales with
the weight of the moment (5.5 on a kill, 3.2 on a hit, 1.8 on a graze), and it is
applied on the **camera transform**, so nothing in the world moves relative to
anything else.

## 4. ONE PLACE, NAMED TIERS

There is exactly one function that arms a freeze, and it takes a **named tier**,
never a duration:

```js
freeze('kill', dirX, dirY)
```

All seven old call sites now pass a tier. A bare number cannot reappear at a call
site, because there is nowhere to put one. `JUICE.F` still switches the whole
system off, so the freeze stays A/B-able like every other feel change, and a fresh
fight clears both the freeze and the shake so neither can leak between encounters.

**THE LAST MAN GETS THE LONG ONE, AND IT IS DECIDED BEFORE THE BODY RESOLVES.**
`finishHim` asks whether this is the final enemy *first*, so the two-beat hold
lands on the kill that ends the fight rather than on the one after it.

## 5. WHERE I PULLED BACK FROM MY OWN RESEARCH

The research doc proposed a **full bar (2.0s)** when the last man drops. I built a
**1/2 note (1.0s)** instead. Two seconds of frozen world is too long to sit
through on a phone, and shipping the version that feels good beats shipping the
version that matched my own document. It is one constant (`TIERS.last`) if he
wants the bar.

## 6. THE GATE

`gates/combat_lab_gate.js` section 17 (335 checks total, 0 fail). It EXECUTES the
core rather than describing it:

- asserts `BEAT` is **derived** from the 120 BPM law and not typed;
- runs every tier and asserts each is a legal note value, that they escalate with
  the weight of the moment, and that a killshot is **exactly one beat**;
- **asserts the invariant REJECTS what was there before** — none of the seven old
  frame counts is legal at 60Hz *or* 120Hz, and neither is Vlambeer's 0.2s. An
  invariant that only accepts the new values and would also have accepted the old
  ones is decoration;
- asserts a note value means a **real musical subdivision** (1/1 through 1/32) and
  not merely "some integer fraction", because the looser version let 1/60 of a bar
  through — which is exactly how a frame counter passes for music;
- asserts the audio clock advances **before** the freeze is applied, so the dial
  cannot drift while the world is stopped;
- asserts the shake's duration is the freeze duration, and that an unknown weapon
  still lands on the grid instead of on zero or NaN.

**REAL-SURFACE PROOF** (`slices/BOHEMIA_QUANTIZED_FREEZE_PROOF_7_26_26.png`), read
off the live game in the real alpha:

```
armed a KILL freeze: 0.500s (tier kill), shake duration 0.500s
  250ms in : freeze left 0.221s, shake elapsed 0.279s
  650ms in : freeze left 0.000s, shake cleared
  THE MUSIC KEPT PLAYING: the audio clock advanced 679ms over 650ms of wall
  time while the world was frozen
per weapon, live: pistol=1/16  smg=1/16  rifle=1/8  shotgun=1/8
the old frame counts: all rejected
console errors: 0
```

That third line is the proof that matters. **The world stopped and the song did
not.**

## 7. THE LESSON

Two of the last three additions to this game were correct systems ruined by an
unexamined unit. v75 measured song density per pattern and called it per bar, and
was wrong by 4x. This freeze measured impact weight in frames and was wrong by 2x
on half the phones in the world.

**A NUMBER WITHOUT A UNIT IS NOT A NUMBER.** Both gates now derive their unit from
the clock instead of typing it, so neither mistake can be made twice.
