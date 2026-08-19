# THE ENCOUNTER CURVE (V167, 8/19/26, COMBAT lane)

**RF4-24 and RF4-26, SPECED -> BUILT. The precondition for RF4-37.**
**TAB: COMBAT.** Hit NEW ENCOUNTER a few times and count the bodies.

> Paolo 8/19: *"its still not feeling like rogue fable 4 bro"*

---

## I WENT LOOKING FOR THE GAP INSTEAD OF GUESSING

The teardown spec has 68 numbered rows. Exactly one carries **three stars**, and
it was sitting at SPECED with the worst measurement in the document:

> **RF4-24 ★★★ THE ENCOUNTER-SIZE RULE, IN HIS OWN DESIGN NOTES:** *"The typical
> encounter should have **3-4 enemies** with **5-6 being very hard** and anything
> above that being **reserved for boss fights** or very challenging vaults."*
> Fights *"become messy when there are more than about 5-6"* and *"devolve into
> **messy kiting and choke-point abuse**."*
>
> **MEASURED: 8.0 per fight. min 8, max 8, across 40 arenas. INSIDE RF4's 3-6
> BAND: 0 OF 40.**

**Every fight in Bohemia has been boss-fight sizing. Every single one.**

Read his complaints back with that in hand and they stop being separate notes.
*"messy kiting and choke-point abuse"* is RF4's own designer describing, in
advance, the exact fight Paolo keeps reporting: find cover, sit, grind, nothing
sharp ever happens.

### And it was one button, left on

The demo settings carry a FOES row, `1 / 3 / 5 / 8`, and **`8` has had the `on`
class since it was written.** `G.numEnemies` defaults to 8 and `setupEnemies`
reads it straight. No curve, no roll, no variance. Eight, forever.

---

## WHAT SHIPPED

A distribution rolled per encounter off the arena's own seeded dice, so a seed
still reproduces a fight exactly:

| bodies | weight | RF4's own words |
|---|---|---|
| 3 | 30% | typical |
| 4 | 35% | typical |
| 5 | 22% | "very hard" |
| 6 | 13% | "very hard", top of the band |
| 7-8 | **not rolled** | *"reserved for boss fights"* — and still one tap away |

Measured over 60 arenas: **3×16, 4×19, 5×14, 6×11. Mean 4.33. Inside the band
60 of 60.**

### And fewer only works if the group is composed (RF4-26)

> *"Enemies should generally be more individually powerful, come in **mixed
> groups** and be designed to work together."*
> HALF BUILT: the bodies are differentiated; **the groups are not composed.**

Rosters were picked by modular arithmetic on the slot index, and **every one of
those rules was gated on N being large**: `N>=5` for the SEC-BOT, `N>=4` for the
sniper. **Shrinking N alone would have made the game worse** — a four-man fight
loses its machine, a three-man fight loses its sniper too, and small fights
degrade to goons and a stick. Fewer AND blander AND easier, arrived at by doing
half the work.

So there is a **spine** at every size:

| | |
|---|---|
| **the worst man** | one sniper whenever N>=3, swapped onto the back slot |
| **the machine** | a SEC-BOT at N>=4, two at N>=6 |
| **the pressure** | a blade at N>=3, two at N>=6 (his 7/19 MELEE MIX still rules this) |
| **the rest** | goons |

Measured: **a priority target in 60 of 60 fights, three or more kinds of body in
60 of 60.** A three-man fight is a sniper, a blade and a goon: three different
problems from three directions.

That is also **RF4-37's missing precondition.** You cannot have a priority target
in a crowd of eight interchangeable goons, because there is nothing to
prioritise. Making him *worth crossing the room for* is the other half and is
**not claimed** — RF4-37 stays SPECED.

---

## HE WAS RIGHT, AND I AM NOT HIDING IT

> Paolo, earlier: *"I am really concerned how easy this game could be unless I
> throw 8+ enemies at a player"*

Same policy, same rolls, 24 fights each, driven through the shipped return-fire
path:

| | HP lost per turn | hits per turn | **died** | turns per fight |
|---|---|---|---|---|
| pinned 8 | 6.36 | 0.246 | **8 of 24** | 8.6 |
| the curve | 3.74 | 0.168 | **2 of 24** | 9.4 |

Turns per fight barely moved, so this is not a short-fight illusion. **Half the
guns is half the incoming fire.** Shuffling which archetypes turn up barely dents
it: moving the SEC-BOT earlier, from N>=5 to N>=4, bought back 3.31 to 3.74 and
nothing more.

### Why it ships anyway, and why that is not a dodge

The only lever that closes that gap is **making each enemy hit harder**, and
**NO DAMAGE BEFORE THE DIAL** forbids me from setting a damage number, full stop.

And the compensator RF4 actually uses is not per-fight lethality at all. It is
**attrition across a floor**: you fight many small encounters and your resources
do not reset between them. In the COMBAT tab every fight starts at 100 HP because
it is a standalone arena. Wiring encounters into a run belongs to another lane.

**So the true sentence is: the fight is sharper, shorter and less lethal one for
one, and the thing that is supposed to make that add up is a run, which does not
exist here yet.** It is written into the patch tool, into this record and into a
gate check, so it cannot quietly become false. And the boss sizing he has played
for weeks is one tap away in the same panel.

**If it reads as easy when he plays it, the answer is not eight bodies again — it
is attrition, and that is the next conversation.**

---

## HE CAN STILL DIRECT IT

The FOES row gains a **CURVE** button, on by default. `1 / 3 / 5 / 8` all still
pin the size exactly as they do today and turn the curve off. A fight size he can
no longer choose would be me taking a dial off him to make my own feature measure
well.

---

## THE GATES

`gates/combat_lab_gate.js` — 844 -> more. The distribution is **run** (4000 rolls,
mean and band asserted, not merely declared); the spine is **run** at sizes 3, 4,
5, 6 and 8 and asserted to hold a worst man and three kinds of body at every one;
MELEE MIX OFF and PACK are both exercised so a recipe cannot quietly ignore a
ruling he already made; and one check exists purely to keep **the difficulty drop
declared**.

Two older claims were **re-pointed, and the first of them had been pinning the
bug**: `ok('playtest defaults to 8 enemies')` asserted the `on` class on the `8`
button. It was written as a convenience for the playtest and had quietly become
the whole game, with a gate holding it in place.
