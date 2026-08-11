# NOBODY IS IN RANGE WHEN THE BELL RINGS

**8/11/26 — COMBAT lane. Answers Paolo 8/11: "how dare you make a range of
weapons that have a maximum range and then don't even set the Enemies that far
away from me... can you have it set up in a way where everyone starts out of
range almost out of range of the weapon and then they have to walk towards each
other... I literally can just stand there. Shoot out everyone kill them."**

---

## HE IS RIGHT, AND MY OWN NUMBER SAID IT THIS MORNING

I gave every gun a maximum range and then spawned people **inside it**.

Worse than that: **I measured it and filed it as a feature.** This morning's
record says *"pistol 41% of the board in range"* and I wrote that up as a nice
gradient. Forty-one percent in range **is** stand-there-and-kill-everyone. The
number was right there and I read it wrong.

And there was something even more direct: the generator has always placed **one
man in your face**, four to six tiles out, every single fight, forever. On a
board whose whole point is that your gun has a reach, that one line hands over a
free target on turn one no matter how big the board gets.

**A maximum range means nothing if there is never a moment when nothing is
inside it.**

## THE RESEARCH AGREES

Turn-based tactics design says the same thing plainly: do not open a battle with
enemies a turn or less away. Spacing them out is what gives the player room to
use ranged tactics and forces the approach to actually be **played** instead of
skipped. The opening distance is supposed to be a phase of the fight. This game
did not have one.

---

## WHAT SHIPS: THE SPAWN IS MEASURED IN YOUR GUN, NOT IN TILES

A fixed tile number can never be right for five weapons with five different
reaches. So the distance everyone starts at is a **multiple of your own maximum
range** — 1.8× to 2.6× of it.

This matters more than it sounds, because **the dark halves every range.** A
pistol really reaches 8 tiles at night, not 16. A spawn band written in tiles
would be wrong every time the light changed. Written in your gun, it is right
automatically.

The man-in-your-face is gone, replaced by the nearest man sitting outside your
reach with a walk in front of him.

## MEASURED, 80 ARENAS PER GUN, STANDING PERFECTLY STILL

| your gun | in range when the fight starts | nearest man | turns before anything is shootable |
|---|---|---|---|
| shotgun | **0%** | 17.8 tiles | **5.8** |
| pistol | **0%** | 20.7 tiles | **6.3** |
| SMG | **0%** | 28.0 tiles | **6.3** |

Down from 41%. **Nobody is shootable at the bell, with any of them**, and if you
plant your feet it is six turns before that changes — six turns during which
anyone carrying a longer gun than yours is already shooting at you.

## THE THIRD THING, WHICH THE MEASUREMENT FOUND AND I DID NOT

After widening the band, 6–8% of men were **still** in range. The cause was the
two-storey deck: it takes shooters who spawned correctly way out in the band and
**teleports them onto deck tiles near you**, silently undoing the opening
distance. A later pass quietly overwriting an earlier pass is the same shape of
bug as the giants — two things deciding one number. The deck keeps its point
(high ground beats the rock you are behind) but it may only claim a man if the
high ground is also outside your reach.

That took it from 6–8% to **0%**.

---

## ONE THING I AM NOT HIDING: THE RIFLE

A rifle reaches 44 tiles in daylight and the arena is 32 across, so with a rifle
in the day everyone spawns inside your reach and you *can* open the fight
standing still. At night it reaches 22 and you walk like everyone else.

That is a real, explainable property — the rifle is the standoff weapon, and
"lit means hittable from across the lot" is already the law here. But it does
mean **the arena would have to be bigger again before a rifle in daylight has to
walk.** Saying it plainly rather than letting you find it.

Also: in 1 arena out of 80, an SMG standing still never got a target in 25
turns. That measurement had the player frozen; a player who walks does not hit
it. Worth knowing, not worth a system.

Tool: `tools/bohemia_combat_nobody_in_range_at_the_bell_patch.py`
Gate: `gates/combat_lab_gate.js`, 745 → 748 checks.

**WHERE TO SEE IT: the COMBAT tab.** Start a fight and try to shoot. You cannot,
with anything except a rifle in daylight. Everyone is out there, and both sides
have to walk in.

---

Sources:
- [12 ways to improve turn-based RPG combat systems — Sinister Design](https://sinisterdesign.net/12-ways-to-improve-turn-based-rpg-combat-systems/)
- [How to design a turn-based combat system — Game World Observer](https://gameworldobserver.com/2022/12/02/how-to-design-turn-based-combat-system-untamed-tactics)
- [Turn-based tactics — Wikipedia](https://en.wikipedia.org/wiki/Turn-based_tactics)
