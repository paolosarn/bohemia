# DOES A SHOTGUN THROW A BODY AT LONG RANGE? THE RESEARCH (8/1/26)

Paolo asked the question and asked for the research. **The answer is ONLY UP
CLOSE**, and the reason is not the obvious one, which is why it is worth
writing down rather than just tuning.

---

## FINDING 1 — NOTHING THROWS A BODY. NOT A SHOTGUN, NOT ANYTHING.

The knockback everyone pictures is a film invention, and the disproof is one
line of Newton's third law: **if a gun could deliver enough momentum to launch
a victim backwards, the recoil would launch the SHOOTER backwards just as
hard.** A ~40g payload at ~400 m/s against an ~80kg body produces a velocity
change the sources call *imperceptible*.

> "the smaller mass of a bullet travelling at high velocity equates to a certain
> amount of momentum, but when that momentum is transferred to the significantly
> larger mass of the human body, the resulting velocity of the body is minuscule
> — usually imperceptible"

Movement at the instant of a hit is **physiological** — a body failing — never
momentum. So *"does a shotgun throw at range"* was the wrong question. **It does
not throw at ANY range.**

## FINDING 2 — BUT SOMETHING REAL CHANGES WITH RANGE, AND IT IS DRAMATIC

Forensic pathology on contact and near-contact shotgun wounds is unambiguous:

> "At contact range, the entrance wound is a single, round defect because **the
> pellets penetrate the target as a single mass**... At contact range, the
> pellets stay tightly grouped, creating a single large wound."

> "the body absorbs **the entire discharge of the cartridge, not just the
> projectile**, and the injection of rapidly expanding propellant gases may
> cause significantly more damage than the bullet itself"

At distance the same cartridge is a different injury entirely. Pattern-controlled
00 buck spreads **~6.2 inches from the centreline by 40 yards**, fewer pellets
connect, and **a single 00 pellet carries less energy than a .380**.

**ONE CATASTROPHIC HIT drives a man down and away from the muzzle. A SCATTER OF
HOLES folds him where he stands.** That is a **RANGE fact, not a FORCE fact** —
and it is the thing worth putting in the game, because it is real and it changes
a decision.

## FINDING 3 — EVERY GAME EVER MADE ALREADY AGREES

Shotgun damage and knockback falling off hard with distance is so universal it
has a trope name: **Short-Range Shotgun**. Shooters commonly scale it linearly
past a falloff start (one documented example is ~9% per metre), and the stated
design reason is exactly ours:

> "Stronger damage falloff ensures that shotgun users would be locked to the
> actual intended range of their weapons system."

---

## WHAT SHIPPED (v111)

v109 threw a body for `blast`, for `shotgun` **at any range**, or for **anything**
at point blank. Two of those three were wrong.

| source | throws? |
|---|---|
| **explosion** (grenade, cooking fuel tank) | **yes, at any range it reaches** |
| **shotgun inside PT_BLANK** | **yes** — the one-mass band |
| shotgun beyond PT_BLANK | no, he folds |
| pistol / smg / rifle, any range **including contact** | no, he folds |

**An explosion is the one case where the film version is true.** Overpressure is
a *wave* acting on the whole surface of a body at once — a genuinely different
mechanism from a projectile.

**And the Hollywood reflex got evicted from the point-blank check.** v109 let
every weapon throw a body up close, which smuggled the myth back in through a
range test. A pistol at contact is still a pistol.

### THE NUMBER WAS ALREADY IN THE FILE

`PT_BLANK` is **4 tiles**, and this engine's own comment puts a tile at ~1.5m —
so point blank is **~6m / ~6.5 yards**. The patterning literature tests at 5, 7,
10, 15 yards and the tight single-mass band lives at that short end. **The
constant Paolo ruled on for an entirely different reason lands on the real
one-mass distance.** It is used as found; no number was invented for this.

### WHAT IT DOES TO THE GAME

The shotgun stops being the universal answer and becomes **a reason to close**.
Take the long shot and he folds; walk into his face and he leaves his feet. That
is the same trade his point-blank ruling already makes everywhere else in the
fight, and it is why this is a better mechanic than the one it replaces.

MEASURED: shotgun at 2 tiles throws, at 4 (PT_BLANK) throws, at 5 folds, at 20
folds. Pistol folds at every range. Blast throws. Combat gate 598 → 603.

---

## SOURCES

**The knockback myth / Newton's third law**
- [Does getting shot really throw someone back?](https://freethoughtblogs.com/singham/2024/06/12/does-getting-shot-really-throw-someone-back/)
- [Recoil — Wikipedia](https://en.wikipedia.org/wiki/Recoil)
- [Engineering:Recoil — HandWiki](https://handwiki.org/wiki/Engineering:Recoil)
- [When gunshot moves you back? — The Gun Zone](https://thegunzone.com/when-gunshot-moves-you-back/)

**Contact-wound pathology (the one-mass finding)**
- [Contact shot — Wikipedia](https://en.wikipedia.org/wiki/Contact_shot)
- [Gunshot wounds — Pathology Outlines](https://www.pathologyoutlines.com/topic/forensicsgunshotwounds.html)
- [Contact, Intermediate, and Distant Gunshot Wounds](https://behindthecrimescene.com/contact-intermediate-and-distant-gunshot-wounds-forensic-indicators-explained)
- [Forensic Pathology of Firearm Wounds — Medscape](https://emedicine.medscape.com/article/1975428-overview)

**Buckshot patterning and energy at range**
- [What's the Maximum Effective Range of Buckshot? — Lucky Gunner Lounge](https://www.luckygunner.com/lounge/whats-the-maximum-effective-range-of-buckshot/)
- [How Today's 00 Buck Loads Fare Downrange — Tactical Life](https://www.tactical-life.com/ammunition/00-buckshot-ammo-test/)
- [Maximum Effective Range of Buckshot — Brass Fetcher](https://brassfetcher.com/Shotguns/Maximum%20Effective%20Range/Buckshot.html)
- [A single 00 pellet vs a .380 — Defensive Carry](https://www.defensivecarry.com/threads/do-you-realize-that-a-single-00-pellet-has-less-energy-and-momentum-than-a-380.154973/)

**The design convention**
- [Short-Range Shotgun — TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Main/ShortRangeShotgun)
- [A Comparison of Damage Falloff in PvP FPSs — Zeke Virant](https://zekevirant.medium.com/a-comparison-of-damage-falloff-in-pvp-fpss-7be74fbb131)
- [Damage Falloff — GTFO Wiki](https://gtfo.wiki.gg/wiki/Damage_Falloff)
