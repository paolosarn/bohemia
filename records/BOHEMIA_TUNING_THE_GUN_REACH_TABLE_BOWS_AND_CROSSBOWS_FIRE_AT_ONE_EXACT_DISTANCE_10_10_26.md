# TUNING ROUND 17 -- [the gun reach table] EVERY WEAPON'S MINIMUM AND MAXIMUM REACH, AND A BUG THAT MAKES BOWS FIRE AT ONE EXACT DISTANCE (10/10/26)
# Row: VAMILY TUNING [the gun reach table] (PAOLO 10/10: 'melee weapons work on one tile away, all guns 2+ minimum'; rule 83; COMBAT [guns need two tiles]), RESEARCH (rule 38g).
# Sources: records/target/bb/weapons.json (126 rows, wiki-copied, rule 63d), the wiki weapon pages (infobox tilerange; Bows page on height), ours.json weapon_rows, and the
# fight's own functions in slices/BOHEMIA_FIGHT.html lifted verbatim and run on the real rows (tool: the lift script is in this record, section 3). Nothing built or fixed by me.

## 1. THE TABLE (every weapon class, minimum to maximum reach in tiles, what rule 83 asks, whether the data meets it)
    class (rows)            min..max in weapons.json     wiki tilerange            rule 83 asks                 meets it?
    dagger (6)              1..1                         1                          melee: reach 1               YES
    sword (16)              1..1  (7 rows state none)    1                          melee: reach 1               YES (the 7 default to 1)
    mace (17)               1..1 or 1..2                 1 / "1 - 2"                melee: reach 1               YES
    spear (8)               1..1 or 1..2                 1 / "1 - 2"                melee: reach 1               YES
    axe (12)                1..1 or 1..2                 1 / "1 - 2"                melee: reach 1               YES
    flail (7)               1..1                         1                          melee: reach 1               YES
    cleaver (14)            1..1 or 1..3                 1 / "1 - 3"                melee: reach 1               YES
    hammer (7)              1..1 or 1..2                 1 / "1 - 2"                melee: reach 1               YES
    polearm (10)            1..1 or 1..2                 1 / "1 - 2"                melee: reach 1               YES
    BOW (8)                 6..6 or 7..7  <-- min = max  7 (a single number)       gun: min 2, max 7            NO. Minimum is wrong (see 3)
    CROSSBOW (4)            6..6          <-- min = max  6 (a single number)       gun: min 2, max 6            NO. Minimum is wrong
    FIREARM / handgonne (1) 2..2                         "2 - 2"                    gun: min 2                   YES (exactly 2, the wiki's own)
    throwing (9)            2..4 or 2..6                 "2 - x" (min 2)            min 2                        YES
    throwable item (7)      3..3                         3                          (not a gun)                  see 4
THE DEMO'S SEVEN JOBS (ours.json weapon_rows, mapped to their Battle Brothers rows):
    pipe -> Bludgeon (mace)            1..1   YES        sledge -> Two-Handed Mallet (hammer)   1..1   YES
    shotgun -> Handgonne (firearm)     2..2   YES        bottles -> Bundle of Throwing Axes     2..4   YES
    pistol -> DAGGER (dagger)          1..1   NO: a gun at reach 1. His 9/22 law said "pistol one tile"; his 10/10 rule 83 (newer) says every gun starts at 2.
    rifle -> Light Crossbow            6..6   NO: fires only at exactly 6 (see 3); rule 83 wants 2..6
    car door -> wooden shield          not a weapon row (the shield lookup finds no weapon named wooden_shield; it lives in the armour file)
HEIGHT: the Bows page says shooting downhill adds 1 to range per height level (and uphill takes 1 away); rules.json holds it (ranged_range_per_level) and the fight uses it.

## 2. WHAT THE WIKI ACTUALLY SAYS (so the minimum of 2 is HIS rule and not Battle Brothers')
The wiki's bows and crossbows have ONE range number: tilerange = 7 for the bows, 6 for the crossbows. It states no minimum. The Handgonne is "2 - 2" and throwing weapons "2 - 4" / "2 - 6",
so a minimum of 2 is BB's own for those. For bows and crossbows, Battle Brothers lets an archer shoot an adjacent enemy; a minimum of 2 for them is Paolo's guns rule, not the wiki's.

## 3. THE BUG (found by running the fight's own functions on the data)
weapons.json fills range_min with the same number as range_max for every bow and crossbow (6..6, 7..7). The fight's inRange() for a ranged weapon is
    d >= rangeMin(w) && d <= rangeMax(w.range) + upFromHeight
I lifted inRange, rangeMax, rangeMin, dist, isRanged and RANGED from slices/BOHEMIA_FIGHT.html unchanged and ran them on the real rows, level ground, a target d tiles away (Y = can shoot):
    Short Bow          1- 2- 3- 4- 5- 6- 7Y 8- 9-        ONLY at distance 7
    War Bow            1- 2- 3- 4- 5- 6- 7Y 8- 9-        ONLY at distance 7
    Light Crossbow     1- 2- 3- 4- 5- 6Y 7- 8- 9-        ONLY at distance 6   (the demo's RIFLE)
    Handgonne          1- 2Y 3- 4- 5- 6- 7- 8- 9-        ONLY at distance 2   (the wiki's own, a cone; fine)
    Staff Sling        1- 2Y 3Y 4Y 5Y 6Y 7- 8- 9-        2 to 6, correct
    Throwing Spear     1- 2Y 3Y 4Y 5- 6- 7- 8- 9-        2 to 4, correct
    Dagger             1Y 2- ...                          1, correct
So on flat ground a bow or a crossbow can shoot one tile-distance and no other. Height moves it by one per level. A rifle in the demo hits only a man exactly six tiles away.
This predates rule 83 and has nothing to do with it; rule 83's minimum of 2 would be correct if the data said 2..7 and 2..6. The wiki's tilerange for these is a MAX; the
data file copied it into the minimum too.

## 4. THE FINDING THAT PROVES US WRONG
My 10/10 audit said the demo's fight rules match the wiki's rows. They do read the rows correctly; the ROW is what is wrong. And rule 83 would have been implemented as "min 2" on
top of a minimum that is already 6 or 7: the fix he asked for is a data fix, not a code fix. Also: RANGED in the fight is ['bow','crossbow','firearm','throwing'], so the seven
"throwable item" rows (reach 3..3) are treated as melee weapons that reach 3 tiles with a minimum of 1, which is not a throw.

## 5. THE TABLE, FIXED AS A PROPOSAL (for COMBAT [guns need two tiles]; nothing applied)
    bows (8)            min 2, max unchanged (6 or 7)          crossbows (4)     min 2, max 6
    handgonne           2..2 as is                              throwing          2..4 / 2..6 as is
    PISTOL              currently a dagger at 1..1: needs a row whose minimum is 2. No Battle Brothers weapon is a pistol, so the choice is COMBAT's and his: the
                        nearest wiki rows with a minimum of 2 are the Throwing Spear (2..4) and the Staff Sling (2..6), or a ruled override (pistol 2..3) in ours.json with his quote.
    throwable items     add 'throwable_item' to RANGED, or rule them melee on purpose.
The scope and the rifle keep their Battle Brothers bases' maxima (bow 7, crossbow 6) as his rule says; "machine gun" and "the scope" have no row yet.

## ROUTED
- COMBAT [guns need two tiles]: section 3 and 5 (the data fix; the pistol decision; RANGED). WORLD/PEOPLE: none. TUNING [numbers table]: min_reach rows by class.
- Test material: the VOTE page is draft:true. The lift script: read slices/BOHEMIA_FIGHT.html, extract the named functions with a brace counter, eval with level() = 0 and sees() = true.
