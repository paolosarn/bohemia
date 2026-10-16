# BOHEMIA — COMBAT T7: HIS NOTES, AND THE ORANGE FINALLY NAMED (7/31/26)

> Paolo, T7: *"Do not code anything yet until I say so please don't just this is
> my Notes but I'm gonna keep on playing please don't start coding yet"*

**NOTHING WAS BUILT THIS TURN.** These are his notes, recorded, plus diagnosis on
the ones I could settle read-only. Two of the six are now nailed to a line
number. The rest are described honestly, including the one I still cannot
explain.

---

## 1. THE ORANGE GOLD THING ON A KILLSHOT — **FOUND, AND IT IS THE ARM**

> *"when I hit someone with the killshot that dead shot dial like orange gold
> thing still is not going away like what's wrong with you I thought we handled
> that"*

He has reported this **six times**. I have "fixed" it twice and been wrong both
times. So this time I did not guess: I **instrumented the canvas**, wrapping every
`fill` / `stroke` / `fillRect` / `fillText` and recording only what gets drawn
**while `G.ks` is live**, with its colour, its call count, and its stack.

### THE ANSWER, TOP OF THE LIST, 1008 STROKE CALLS DURING ONE KILLSHOT

```
stroke(path) rgb(202,160,122)   calls: 1008
  at drawArmNeedle  ->  at draw
```

`#caa07a` is the needle arm's warm tan-gold highlight. And it is not one arm:

```js
/* AL. NEEDLE TRAIL: the needle drags a fading arc of its recent path. */
for(let i=8;i>=1;i--){
  const ga=base + G.angleTrail(i);
  drawArmNeedle(ctx,cx,cy,ga,ARML,0.045*i/8);
}
```

**EIGHT GHOST ARMS, EVERY FRAME, ALL THE WAY THROUGH THE KILLSHOT CINEMATIC.**
A warm tan-gold fan sitting on top of the kill. That is the thing that "is not
going away", and it is not going away because **nothing ever told it to stop**.

**IT IS THE SAME BUG CLASS AS EVERY OTHER TIME, WHICH IS WHY IT KEEPS COMING
BACK.** The dial's own furniture keeps drawing during the cinematic:
- v87 gated the chain-escalation glow on the freeze
- v94 deleted the hand-painted road median
- **the needle trail was never gated at all**

I fixed two members of a family and never asked what else was in it.

### SECOND SUSPECT, SAME RUN
```
fill(path) rgb(255,200,70)   calls: 184
  at screenOverlays  ->  at draw
```
That is `ghostRGB(1)`, the greed ghost at **full gold charge**, drawn as an orb
with a 12px gold `shadowBlur` and a three-orb comet trail. Smaller than the arm
trail but literally orange-gold.

### WHAT I WOULD DO (on his go)
Gate the needle trail and the gold ghost on the killshot the same way the floor
pulse already is, and then **sweep for the rest of the family** instead of
fixing one more member: every warm thing the instrument lists, checked against
"should this be on screen during a kill?" The instrument is now written and can
be re-run on demand.

---

## 2. TWO SHOTS SHOULD BE TWO GUNSHOTS

> *"when you do two shots for the killshot cause sometimes I send out two shots.
> I need to hear like two gunshot noises do you understand"*

Recorded as a ruling. Not investigated yet.

---

## 3. THE SHOTGUN, AND DEATH ANIMATIONS THAT MATCH THE HIT

> *"the default gun that I start off with is a shotgun... if I'm using a shotgun
> everyone fucking dies and when they die they're either bleeding out wiggling
> around which you might have to make a new animation for and all of it has to be
> translated from the type of headshot they got"*

Recorded. Two separate things:
- **the shotgun is the default and it kills everything** (a balance observation)
- **the death should read from what killed him.** A shotgun death is not a pistol
  death, and a headshot is not a body shot. New clips, and the mapping from
  hit-type to death clip.

---

## 4. **SQUATTING AFTER A HEADSHOT** — almost certainly mine, from v102/v104

> *"if I killshot someone with a shotgun, they shouldn't be squatting doing an
> animation with squatting back up right after they get their headshot"*

That is the cover crouch. The v102 dial-cover pose scrubs a man between the tuck
and the peek while the dial is on him, and v104 pointed it at the right clip
(`cover-fire`) — but **a man who has just been killed should leave that branch
immediately and never come back to it.**

`enemyFrame` returns the death clip only once `e._deadAt` has passed, and
`_deadAt` is set *into the future* by the killshot duration
(`tgt._deadAt = performance.now() + G.ks.dur*tv*1000`) so the body stays on its
feet until the bullet lands. **The window between the trigger and `_deadAt` is
where he is seeing a corpse-to-be doing cover animation.** Not yet proven with a
capture; that is the first thing to do on his go.

---

## 5. **THE GRENADE SURVIVES THE END OF THE FIGHT** — CONFIRMED, MINE

> *"I had a grenade set to explode. I had one turn left, but then all the enemies
> I either killed or they gave up and then combat ended... and then even when I
> press a new encounter the grenade it just stuck, saying one turn until it
> explodes it's very confusing"*

**Confirmed by reading, no ambiguity.** The reset

```js
G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;
```

lives in **`setupCombat()`**. But `newEncounter()` **does not call
`setupCombat()`** — it calls `setupEnemies(); buildBoard(); updPlayer();`
directly and resets its own inline list (faction, song, camera, over, win, inFU,
execWindow, ks, frozen, killStreak, popTarget, fireTarget...).

**That list never included the grenade.** So a live grenade survives the end of
a fight AND survives NEW ENCOUNTER, exactly as he saw.

### AND HIS BIGGER POINT IS THE REAL FINDING
> *"I'm just so confused the type of transition you have between combat mode and
> non-combat mode"*

He is not describing one stuck object. **There are two reset paths
(`setupCombat` and `newEncounter`) that reset different things, and every new
mechanic has to remember to be added to both.** The grenade is just the one that
showed. That is a structural problem and the fix is ONE reset, called by both,
not a third place to forget.

---

## 6. RESEARCH ASK: CONNECTING ANIMATIONS SEAMLESSLY

> *"as we create more animations you have to be smart with this like how you
> connect animation seamlessly together so you might have to do big brain
> research on that"*

Recorded as a research task, not started. Note that this is adjacent to the
animation revamp running in another session, so scope has to be agreed before
anyone touches clips.

---

## WHAT IS ACTUALLY DONE HERE

- The orange is **named**, with a call count and a stack trace, for the first
  time in six reports.
- The stuck grenade is **confirmed** to a specific missing line in a specific
  function.
- Everything else is written down verbatim and waiting on his go.
