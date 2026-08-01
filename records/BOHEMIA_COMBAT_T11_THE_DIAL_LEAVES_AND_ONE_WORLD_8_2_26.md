# COMBAT T11 — THE DIAL LEAVES, THE WORLD IS ONE WORLD (8/2/26)

Paolo's list, and the first item is his **eleventh** report of the same thing.

---

## 1. "MAKE THE WHOLE DEAD SHOT DIAL GO AWAY. FADE AWAY AS THE BULLET GETS CLOSER"

He has now given me the **fix**, not the symptom, and it is the right one: stop
hunting members of a family and delete the whole family on a schedule tied to
the bullet.

**What the instrument says today:** the fade already runs across the bullet's own
travel time, and in a measured killshot **nothing** of the dial draws — no arm,
no needle, no ticks. The timing math is right.

**What his screenshot actually shows:** the FIRE button is **green and lit**,
which means phase `aim`. That orange shape is **his own arm and gun** — the baked
deadeye pose at the dial's centre — blown up by the zoomed camera. It is the
dial, and it is on screen at a moment he reads as the cinematic, because the
chain drops him straight back into aim over a body that is still dying.

**So the fix is both halves:**
- **A HARD OFF.** Past 97% faded, the entire dial block is *skipped* — bands,
  ticks, ghost fans, reticle, **and the pose**. Not faded to nearly nothing, not
  drawn at alpha 0.01: not drawn. A dial that is "almost gone" is what eleven
  reports look like.
- **The pose is explicitly inside it.** It is the biggest, warmest object the
  dial owns and it was the last thing still standing.

## 2. "JUST HAVE THE PHYSICS WORLD BE THE SAME BRO FOR REAL"

> *"I'm trying to test out the stairs and they look like they were working, I saw
> improvements, I couldn't walk off the edge, but I was doing combat, but now that
> combat is over I can't even test it."*

**He is describing my own code and he is exactly right.** v106 wrapped the whole
stair-and-edge block in `if(!roam)`, where roam is the post-victory walk. So the
moment a fight ended, **the staircase stopped being a staircase and the deck edge
stopped existing** — you could stroll off a second storey into the air, on the one
screen where he had time to actually test it.

**ONE WORLD.** The stairs climb, the edge refuses, and the level rules hold
whether or not anyone is shooting. The only thing `roam` still changes is that
walking is free — which is what a victory walk is *for*.

MEASURED AFTER, with combat over and won: climbed 0→1 on a step onto the run, and
a step off a plain deck tile was **refused**.

## 3. "IF A GRENADE EXPLODES AT MY FEET, I SHOULD BE DEAD. END OF STORY."

> *"now the outside radius is a different thing but yeah keep that in mind"*

40-52 damage for a frag going off **on** you was a videogame number. Standing on
it is death. The band outside it is untouched, because he drew that line himself.

MEASURED: at your feet, 100 → 0. At 1.2 tiles, 100 → 77.

## 4. THE HIGH GROUND BEATS A CROUCH

> *"if you're on a second story... if they just have a crouching cover, depending
> how far they are from you it should be easier to hit them because you have that
> height vantage point... their crouch cover is maybe potentially blown"*

Physically true, and **it is the first thing that makes the climb worth making**
instead of just a different place to stand. A man crouched behind a low wall is
hidden from someone at his own eye level; from a storey up you are looking down
**into** the pocket he is hiding in. The closer he is, the steeper that angle, so
the advantage is biggest directly beneath you and gone by the far end of the lot.

It **pulls the dial easier**, on the same tier machinery as everything else. It is
**not** a damage multiplier — his no-multipliers ruling holds.

MEASURED: same floor 0, above+close **2 tiers**, above+mid 1, above+far 0, no
cover 0, both of you up 0, and a man *above* you gives nothing.

## 5. EXECUTION PAYS, BARELY

> *"maybe you can just get like a really minor stupid amount of experience on top
> of that... maybe only +2% or +3%"*

His number, his framing. The kill is already paid for when he goes **down**;
finishing a man on the floor adds a token. Deliberately almost nothing, because
**the point is that it is a choice, not an optimisation.**

MEASURED: +2 XP on a 60-max body at 3%.

---

## HIS BALANCE CONCERN — READ, NOT YET ANSWERED

> *"I'm like fully exposed versus eight people and like no one's able to hit me...
> I definitely would want you to double check. I understand I'm playing on easy...
> and actually I just did a round and I hit by three people at the same time and I
> almost died"*

**Recorded and NOT declared fixed.** The two halves of what he saw are consistent
with the code as written — a man in the open takes fire from everyone with a line
*and* an acquired lock, and the lock takes two turns to build, so a fight where he
keeps moving breaks locks faster than they form and a fight where he stands still
gets him killed. That is the design working. But "eight guns and nobody hits me"
deserves a measured answer, not a plausible story, and the honest measurement is a
headless run of N turns counting shots-taken versus shots-landed at each
difficulty. **That is the next thing, and it has not been done.**
