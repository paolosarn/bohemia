# GUNS HAVE RANGES NOW, AND THE MAP IS BIG ENOUGH TO MEAN IT

**8/11/26 — COMBAT lane. Answers Paolo 8/11: "the map has to be wayy bigger...
the enemies being close together when the gun range is like this is so fucking
ass. Like imagine different guns have different ranges and this influence the
mobility on the map. There should be a maximum range and different gun
behaviors. We need wayyyyy more movement in the combat rn."**

---

## THE THING I FOUND WHEN I WENT LOOKING

**There was no gun range in this game. At all.**

The file already had a table for how lethal each gun is, a table for how many
shots it gets, a table for how wide its dial is, and a table for what it says
about itself. Range was simply never one of them. Every weapon — pistol,
shotgun, SMG, rifle, and the sniper — ran through **one shared distance curve**.

So a pistol and a rifle were the same gun wearing different dial widths, and
there was no distance anywhere on the board where a shot was not allowed.

And the board was tiny. Everybody spawned between 6.5 and 14.5 tiles out. A tile
is 1.5 metres, so **the whole fight happened inside 10 to 22 metres**. That is a
parking space with people in it. Worse, the board you could *see* was a 10-tile
radius, so anyone spawned past that was off screen — the field was drawing less
ground than it was spawning people on.

You were right on all three counts, and all three are the same missing number.

---

## THE RESEARCH

| gun | real effective range |
|---|---|
| handgun | ~50 yd / 46 m — **but real fights happen at 3–7 yards** |
| buckshot | 30–50 yd; pattern opens roughly an inch per yard (old rule; modern wads are tighter) |
| SMG / pistol-calibre carbine | 100–150 yd, combat hits reported to 300 yd |
| carbine / rifle | excellent at 100 m, military-effective 300–600 m |
| sniper | 600 m+ |

**Those numbers cannot go in raw and I am not going to pretend otherwise.** A
pistol's 46 m is 30 tiles, which is already bigger than the whole board. A
rifle's 600 m is 400 tiles. Drop them in literally and every gun is unlimited
again, which is the exact bug wearing a lab coat.

What survives the squeeze is the **shape**, and the shape is the whole point:

1. **The order never changes.** shotgun < pistol < SMG < rifle < sniper.
2. **The ratios stay roughly true.** A rifle reaches about 3× a pistol; a sniper
   about 2× a rifle.
3. **Every gun gets two numbers**, because that is how guns actually work.
4. **The pistol's number is built on the fight distance (3–7 yd), not the
   ballistic one**, because on a street that is the honest number.

| gun | full ability out to | **cannot fire past** |
|---|---|---|
| shotgun | 5 tiles (7 m) | **14 tiles (21 m)** |
| pistol | 6 tiles (9 m) | **16 tiles (24 m)** |
| SMG | 10 tiles (15 m) | **26 tiles (39 m)** |
| rifle | 20 tiles (30 m) | **44 tiles (66 m)** |
| sniper (theirs) | 30 tiles (45 m) | **64 tiles (96 m)** |

**MAXIMUM RANGE IS THE ENTIRE FEATURE.** Past it the gun does not get worse, it
does not work. An accuracy taper that never quite reaches zero is just a worse
chance to hit, and a worse chance to hit has never made anybody walk anywhere.
A hard wall is what makes the board readable: there is a distance where your gun
is a brick and his is not, and your feet are the only answer.

---

## MEASURED, 100 DIFFERENT ARENAS

**What your gun can even shoot at, the moment the fight starts:**

| your gun | in range | **out of range — you have to walk** |
|---|---|---|
| shotgun | 36% | **64%** |
| pistol | 41% | **59%** |
| SMG | 63% | **37%** |
| rifle | 87% | **13%** |

That is the mobility he asked for, and it comes from the gun in your hands. Pick
the shotgun and two thirds of the board is a walk you have to survive. Pick the
rifle and you can stand off — but a rifle is not what a broke man is carrying.

**And it cuts the other way.** A goon has a pistol, so at 20 tiles he is holding
a brick and you can walk him down. A SEC-BOT has a rifle, so he can hit you from
where nothing you own can answer. Stand still for six turns and the guns that
can reach you go **4.25 → 5.48**, because they close 2.67 tiles while you do
nothing.

---

## THE BOARD GOT BIG ENOUGH TO HOLD IT

Spawns open from 6.5–14.5 tiles to **6–26 tiles (9–39 m)**, with the sniper out
at 30–40 where nothing you own reaches him. The zoom is one dial now instead of
five copies of the same number scattered through the drawing code.

**I picked the zoom by looking at it, not by doing arithmetic.** I rendered the
real board at four values and compared the actual pixels, because a board zoomed
too far out is a screen of ants and you have thrown out ugly twice this month.

**And the arena had to grow with it.** Cover was scattered inside 9.7 tiles and
hard-capped at 11 — correct for the old board, a desert on this one. Every rock
would have sat in the middle third and the outer two thirds would have been bare
sand, which is thin content stranded in open ground. Cover count and spread both
scale now, so the density per square tile stays where it already was.

---

## THE TRAP THIS CHANGE SET FOR ITSELF, AND THE MEASUREMENT THAT CAUGHT IT

The enemy movement I shipped this morning decided whether to walk by asking the
range function — **which is now the range of the gun in *your* hands.** So every
enemy on the board was consulting the player's pistol to decide how far away was
too far. With a pistol that curve flattens out around 9.6 tiles, so on a 16-tile
board there was no gradient at all and nobody moved: movement fell from 1.93 men
a turn to **0.42**, and they closed 0.61 tiles in six turns.

**The board got bigger and the fight got emptier.** A string check would never
have caught it; only counting the men who actually moved did. A man reads his
own gun now, and it is gated.

Nothing else regressed: the defence still loses 58 of 60 times at full health if
you ignore it, and 0 of 60 if you kill them.

---

## WHAT IS NOT DONE YET, SAID PLAINLY

- **Shotgun spread does not widen with distance yet.** The research is in
  (roughly an inch of pattern per yard) and the range is in; the pellet spread
  itself is still one number. That is the next honest piece of "different gun
  behaviours".
- **Enemies still only carry three guns** (pistol / rifle / sniper rifle). Nobody
  on their side runs a shotgun or an SMG yet.

Tool: `tools/bohemia_combat_gun_ranges_and_a_big_board_patch.py`
Gate: `gates/combat_lab_gate.js`, 736 → 744 checks.

**WHERE TO SEE IT: the COMBAT tab.** The board is a street now instead of a
parking space. Take the shotgun and watch how much of it you cannot touch.

---

Sources:
- [Range Comparison: Maximum Effective Range of Guns — MachinaSphere](https://www.machinasphere.com/range-comparison-maximum-effective-range-of-guns/)
- [Effective range — Gun Wiki](https://guns.fandom.com/wiki/Effective_range)
- [Pistol Caliber Carbine Effective At Distance — The Firearm Blog](https://www.thefirearmblog.com/blog/2017/03/13/pistol-caliber-carbine-effective-distance/)
- [Effective Range: How Far Can You Push the SAINT Victor 9mm Carbine? — The Armory Life](https://www.thearmorylife.com/9mm-carbine-effective-range/)
- [The True Distance of a Typical Gunfight — Lucky Gunner Lounge](https://www.luckygunner.com/lounge/the-true-distance-of-a-typical-gunfight/)
- [What Do FBI Statistics Really Say About Gunfights? — Personal Defense Network](https://www.personaldefensenetwork.com/post/what-do-fbi-statistics-really-say-about-gunfights/)
- [What's the Maximum Effective Range of Buckshot? — Lucky Gunner Lounge](https://www.luckygunner.com/lounge/whats-the-maximum-effective-range-of-buckshot/)
- [Myth-Busting: 1″ per Yard Shotgun Pattern Spreads — The Firearm Blog](https://www.thefirearmblog.com/blog/2014/07/04/myth-busting-1-per-yard-shotgun-pattern-spreads/)
- [Buckshot Basics — NRA Shooting Illustrated](https://www.shootingillustrated.com/content/buckshot-basics/)
