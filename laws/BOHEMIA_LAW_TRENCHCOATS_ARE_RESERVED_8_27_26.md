# BOHEMIA LAW — TRENCHCOATS ARE FOR BADASSES (Paolo, 8/27/26, LOCKED)

## HIS WORDS

> "OK, I just want you to understand that like the trenchcoat shit like everyone's
> getting a fucking trenchcoat and I think that's fucking ridiculous. The trenchcoat
> should just be reserved for like to be honest like mostly badass people for real
> like killers and shit like do you have everyone wearing a trenchcoat and I'm sick
> of it like I don't know what type of rule you wanna make and keep it calm and I'm
> not trying to fuck with your flow too much just like bro like everyone has a
> fucking trenchcoat and it's crazy like I know we still need to make a lot more
> clothing so this is like very early on but still bro like keep that in mind with
> the trenchcoat like I'm pretty sure that's the only thing like it's gonna be a
> couple rules but yeah trenchcoats are for bad ass motherfuckers bro cowboy shit
> like killers like for real"

## HE WAS RIGHT AND THE NUMBER WAS WORSE THAN HE THOUGHT

Measured the day he said it, on 5,000 people through the real generator
(`BOH_PERSONLOOK.lookFor`), not a mock:

| | before |
|---|---|
| long coats in the outer slot | **16 of 35 garments (46%)** |
| factions wearing one | **5 of 13** |
| every person in the city | **20.6% in a trenchcoat** |
| of the people who wore any coat at all | **45% wore a long one** |

One in five. He said "everyone" and he was describing a real distribution.

**And four of those sixteen were mine, cooked the day before he said this.** The
colour pass on 8/26 needed a saturated outer garment for two factions and reached
for a duster four times, because a duster was what the shelf held.

## THE CAUSE IS A HOLE, NOT A TASTE

Every long coat in the game is `len` 0.80–0.90. Everything else in the outer slot
stops at the **waist** (`vest:true` or `jacket:true`). Between the waistcoat and the
floor there was **nothing**.

That is the whole bug. The picker is uniform over what exists. If the shelf holds a
waistcoat and a floor-length duster and nothing in between, then every person who
wants "a coat" and not "a waistcoat" ends up in a duster. Nobody chose that. The
wardrobe chose it.

**He named this himself in the same breath:** *"I know we still need to make a lot
more clothing so this is like very early on."*

## THEREFORE THE RULE HAS TWO HALVES AND THE FIRST ONE IS THE REAL ONE

### 1. FILL THE MIDDLE (the fix)

Reserving the coat without filling the hole would just strip the coat off half the
city and leave those people in a waistcoat. That is not a fix, it is a subtraction.
So the wardrobe gained **two new length bands**, seventeen garments:

- **HIP** — `len: 0.34`. Chore coat, barn coat, work coat. Ends at the hip bone.
- **THIGH** — `len: 0.56`. Car coat. Ends mid-thigh.
- plus more `jacket:true` and `vest:true` at the waist.

A new length is a new **SHAPE**, so STRUCTURE-NOT-COLOR (7/19) is satisfied by
geometry and not by argument. This is the half that makes the city look right.

### 2. THE LONG COAT IS RESERVED (the ruling)

Every floor-length coat carries `hard: true`. The picker, `BOH_PERSONLOOK.lookFor`,
holds a **reservation gate** in exactly the shape the existing `lux` flag already
used:

```js
var _hardOdds = 0.10;
var _soft = pool.filter(function (x) { return !x.hard; });
pool = (_soft.length && unit(id, 'hard:' + cat) > _hardOdds) ? _soft : pool;
```

Nine people in ten never see the long coats in the pool at all. It is **data, not
names** — the module names no garment anywhere, so a new duster is reserved the
moment it is tagged, without touching the picker.

**A NAMED CHARACTER IS NOT A CROWD MEMBER.** A faction, a boss, a killer, a quest
NPC wears whatever its `FACTION_LOOKS` row or its authored look says. The
reservation governs the *random* population only. That is the whole point: when the
coat stops being background noise, putting one on somebody becomes a statement.

## THE RESULT

| | before | after |
|---|---|---|
| every person in the city | ~20% | **~1.5%** |
| of the people who wore any coat | ~45% | **~3%** |
| factions wearing one | 5 of 13 | 3 of 13 → **1 of 13** (amended, below) |

**ROUNDED ON PURPOSE.** Three separate 5,000-person samples read 1.66% / 1.38% /
1.34%. The honest number is "about one and a half", not whichever of the three a
picture happened to draw from. Quoting two decimals off one sample is claiming a
precision the measurement does not have, and the gate reports its own figure at run
time rather than repeating a frozen one.

The two factions that lost theirs are the two I mis-dressed on 8/26: **Blues** →
COBALT CHORE COAT, **Colorful** → GRASS CAR COAT. Both are now in the new hip/thigh
bands and both kept their faction colour, so COLOUR IS TERRITORY (8/26) is intact.

~~**Anarchists, Reds and Remnants keep their long coats.**~~ **AMENDED THE SAME DAY
to Anarchists alone (1 of 13 = 7.7%)** — see the foot of this file. Who that one is
remains **HIS** to say (MECHANISM-MINE / CONTENTS-PAOLO'S).

## THE GATE

`gates/trenchcoat_gate.js` — a **ratchet on the crowd**, measured on the real
picker, not on the catalogue:

1. **THE CROWD RATCHET.** ≤ 4.0% of 3,000 generated people may be in a long coat.
   (Measured 1.4%. Headroom for new long coats to be added without a gate edit.)
2. **THE COAT-WEARER RATCHET.** ≤ 12% of people who wear *any* outer garment may be
   wearing a long one. (Measured 3.1%.) Sharper than test 1, and it cannot be gamed
   by making coats rarer overall.
3. **THE MIDDLE MUST STAY FILLED.** The outer slot must hold at least **6** garments
   in the hip band (0.20 ≤ len < 0.45) and at least **5** in the thigh band
   (0.45 ≤ len < 0.70). This is the half a share-cap alone cannot protect: you can
   satisfy a share cap by deleting the coats, and this line forbids that.
4. **EVERY LONG COAT IS TAGGED.** Any outer garment with `len ≥ 0.70` must carry
   `hard: true`. This is what makes the rule survive the next cook — add a duster
   without the tag and the gate goes red the same turn.
5. **THE RESERVATION IS LIVE.** The gate re-runs the whole 3,000-person walk with
   every `hard` flag stripped and asserts the share jumps back. Measured: 1.4% →
   **14.4%**. That gap *is* the feature. Separately mutation-proved by hand on
   8/27: deleting the filter line from the picker turns three of the nine checks
   red. A gate that still passes with the feature deleted is not a gate.
6. ~~**FACTIONS ARE NOT CAPPED.** The gate never reads `FACTION_LOOKS`.~~
   **SUPERSEDED THE SAME DAY — see the amendment at the foot of this file.** He
   ruled 10% *"no matter what"*, which includes the thirteen. This clause is left
   visible rather than deleted because it is the exact sentence that let a 23%
   faction share sit under a green gate all morning: **an exemption I wrote for
   myself, stated as a principle.** Faction *dress* is still his; a *ceiling he set*
   is not something the gate gets to exempt anybody from.

## WHAT THIS LAW DOES NOT DO

It does not decide **who** is a badass. It does not touch a faction's clothes. It
does not delete a single coat. Every one of the seventeen long coats is still in the
game, still rendered, still wearable in the CHARACTER tab. The only thing that
changed is how often a stranger on the street is wearing one.

## THE LESSON UNDERNEATH

**When something is everywhere, look at what it is competing against before you cap
it.** The trenchcoat was not over-represented because it was over-weighted. It was
over-represented because it had no neighbours. The fix for "too much of X" is
usually "not enough of everything else", and capping X without checking that is how
you end up with a city where nobody owns a coat.

---
Tab: **CHARACTER** (the outfit board) and **RUN** (the crowd on the street).
Picture: `slices/look/the-trenchcoat-rule.png`.
Record: `records/BOHEMIA_TRENCHCOATS_ARE_RESERVED_8_27_26.txt`.

---

# AMENDED THE SAME DAY — 10% NO MATTER WHAT, AND THE REASON IS THE DESERT

## HIS WORDS (Paolo, 8/27, hours after the ruling above)

> "BRO NEW RULE ONLY 10% OF PEOPLE NO MATTER WHAT MAXIMUM CAN WEAR TRANCH COATS
> THAT ARE LONG LIKE THAT OKAY. **THIS IS A DESSERT GAME. ITS HOT!!!!**"

and, in the same breath:

> "YOU DONT NEED TO SEE IT SO MUCH FACTION BASED BRO"

## WHAT I HAD MISSED, AND THE GATE HAD MISSED WITH ME

The morning's fix took the random crowd from ~20% to ~1.5% and I reported that as
done. **The factions were still at 3 of 13 — 23% — and the gate never looked at
them,** because I wrote it to hold the RANDOM population and said so in its own
header as though that were a virtue.

**A cap that exempts the loudest, most-seen people in the game is not a cap.** The
faction outfits are the most repeated silhouettes a player meets; putting the coat
there is exactly where a 23% reads as "everyone has one" no matter what the crowd
number says. His two sentences are one instruction: the long coat had quietly become
a *faction uniform*, which is both over his ceiling and the wrong way to spend it.

## THE NUMBER IS HIS AND IT IS NOT A RATCHET

**10% of ANYBODY. Crowd, factions, named characters, all of it.** "No matter what"
means I do not get to argue the exemption I had already written for myself.

| | before | after |
|---|---|---|
| the random crowd | 1.4% | **1.4%** (already inside) |
| the thirteen factions | 3 of 13 = **23%** | **1 of 13 = 7.7%** |

Reds → **BRICK CAR COAT** (thigh), Remnants → **SPLIT-TAIL WORK COAT** (hip). Both
are the **same ramp** at a shorter length, so COLOUR IS TERRITORY (8/26) is untouched
and a faction named for a colour still wears it. **Anarchists keep the duster**,
because their whole `why` line is the silhouette — and one of thirteen is inside his
number. Who that one is remains **HIS**.

## AND THE REASON IS BETTER THAN THE RULE

> "THIS IS A DESSERT GAME. ITS HOT!!!!"

Las Vegas summers run past 40°C. **A floor-length coat in that valley is a
heat-stroke garment.** That is not taste, it is physics, and it upgrades the morning's
rule: the long coat is not merely RESERVED, it is **climatically absurd on anybody who
is not making a point with it.**

Which is the same thing he said the first time, arrived at from the other end. A
person wearing a duster at noon in the Mojave is telling you they care more about how
they look than about being comfortable — **and that is precisely what "for badass
motherfuckers" means.** The heat is what makes the coat cost something, and a garment
that costs nothing to wear cannot signal anything. **The two rulings are one ruling.**

REALISM FIRST (8/4) is satisfied without spending any of the fun: this is a case where
the real-world constraint *is* the dramatic one.

## THE GATE NOW HOLDS BOTH HALVES

`gates/trenchcoat_gate.js` gained three checks: the **faction share** against his 10%,
the **crowd share** against the same hard ceiling, and one that fails if this law stops
recording **why** — because a number with its reason deleted is the thing that rots
first.

*Open: the heat should eventually cost something in the simulation, not just in the
wardrobe. A coat at noon in a valley this hot is a stamina question, and that is a
COMBAT/LIFE row, not a clothing one.*
