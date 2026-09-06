# THE THIRTEEN KILLS WERE NEVER ENFORCED
COOK (16, the Production Artist), VAMILY [runway hair], 9/5/26.
First move of HAIR-TO-THE-CARD, and it never got to the card.

## WHAT WAS FOUND
Paolo killed thirteen haircuts on 8/20/26. The verdict file says it in one line:

    KILL (13): SUN CROP · DUSK SHAG · ASH SWEEP · SALT CROWN · BUZZ CUT · CROP ·
               SLICK BACK · BOWL CUT · FRINGE · SHOULDER LENGTH · LONG LOOSE ·
               WOLF CUT · GREY WISPS
    "All 13 kills are FINAL and graveyarded. GRAVEYARD IS FINAL, no remakes."

**All thirteen were still shipping as `st:'canon'` sixteen days later** -- 13 of the
24 canon haircuts. They were in the crowd, in the face maker's HAIRCUT row, on the
family, on the faction looks and on the six-person city cast.

This lane's own handoff mandates a full graveyard read before any hair is cooked (the
8/30 lesson: seven cuts were remakes of shapes killed twice, and "the answer was one
grep away"). The read is what found it. **Nothing was cooked this round.**

## WHY NOTHING CAUGHT IT, AND THIS IS THE PART WORTH KEEPING
The graveyard registry spelled all thirteen like this:

    n:'HAIR — SUN CROP'

That is the JUDGING TOOL'S DISPLAY NAME -- what the verdict export prints on his
screen. The build has always said:

    n:'SUN CROP'

`bohemia_graveyard_gate.py` treats a registry entry as a search string and sweeps the
whole tree for it. It swept for a string **that has never existed in this codebase**,
found nothing, and reported the dead as staying dead. Green, thorough, and measuring a
typo. Same family as the 8/25 headwear gate that passed seventeen hats drawing zero
pixels: A CHECKER THAT CANNOT FIND ITS OWN TARGET IS NOT A CHECKER.

## WHAT SHIPPED
1. **The thirteen tokens rewritten** into the form the code uses, and the thirteen
   haircuts flipped `st:'canon'` -> `st:'dead'`. Canon hair 24 -> 11: TEMPLE TAPER
   and SHAG (his two KEEPs from that round) plus nine cooked after it.
   Tool: `tools/bohemia_hair_graveyard_enforce_9_5_26.py`
2. **Nineteen authored people repointed off the corpses.** The fixed tokens
   immediately found what the gate's own docstring says it exists for -- "a config
   file three docs deep still POINTING at one". The draw path is
   `GARMENTS.find(x => x.n === nm)`: it resolves BY NAME and never looks at `st`, so
   nineteen hand-authored characters were still rendering dead shapes -- RAY, DENISE
   and NINA of the family cast, eleven faction looks, and the whole city cast.
   Replacement is the nearest LIVING cut by the dials that make the silhouette
   (`|side| + |front| + 0.08*|vol|`, texture family must match) -- not taste.
   Tool: `tools/bohemia_hair_repoint_the_kills_9_5_26.py`
3. **Four new checks in `hair_graveyard_gate.js`**, each mutation-tested:
   - none of his thirteen is shipping as canon (fires: "BACK IN CANON: SUN CROP")
   - all thirteen are still in the build as tombstones, not deleted
   - nobody in the game is still WEARING one (fires: "still worn: SLICK BACK")
   - **every hair tombstone names a string the build actually contains** -- the one
     that would have caught this on day one (fires: "matches NOTHING in the build,
     so it guards nothing: n:'HAIR — SUN CROP'")

## THE HOLE THIS OPENS, AND IT IS HIS CALL
**There is no grey and no white haircut left in the game.** ASH SWEEP and SALT CROWN
were H_GRY, GREY WISPS was H_WHT; LOW BUN was H_GRY and died 8/2. All eleven surviving
canon cuts are H_BLK, H_BRN or H_SND. A worn hair garment draws in its OWN baked ramp
-- there is no recolour on the G_WORN path -- so RAY the father, the Church and the old
wide-brim citizen no longer have grey hair on the body.

Nothing was faked to hide it. Cooking grey recolours is "recolors, not diverse looks"
(7/18) and a fresh hair SHAPE is blocked until the east/west facings render correctly
(the 8/20 record: "cooking new hair into a broken render is how you get a fourteenth
kill"). It goes to him as a ruling. [PENDING Paolo]

## FIVE RULERS WERE WRONG, AND NOT ONE SHAPE WAS CHANGED TO FIT A BAR
Four gates went red on a turn that did not move a single pixel. `clothes_4x_gate` is
the proof: all 1,744 pinned 56px hashes are unmoved, and per-style straightness is
identical to the digit on both sides for all eleven survivors.

| gate | what it said | what was wrong |
|---|---|---|
| `hair_gate` clause 3 | pooled straightness 17.2% -> 18.2% | A POOLED MEAN IS NOT A RATCHET WHEN THE POPULATION CAN CHANGE. The thirteen that left were the LESS straight ones (ASH SWEEP 9.3, LONG LOOSE 8.3, WOLF CUT 10.5, CROP 11.1). Re-derived to 0.1822, and the straightest SINGLE style is now pinned beside it (TEMPLE TAPER 34.4%, the same before and after) -- removing a style can never raise that, so a pool change can neither fire it nor hide behind it. |
| `hairline_gate` | `E.length >= 15` | A COUNT OF THE POOL IS NOT A CHECK ON THE POOL, and it was the weaker claim: at thirty styles it sits green while half draw nothing. Now: every canon style that exists rendered, with a floor of 8. Its blind fixture also named BOWL CUT, a corpse; it reads the pool now. |
| `portrait_haircut_gate` | `DIALS_MIN = 15` | Same shape. 11 of 11 resolving failed a bar of 15. Now: all of them, floor 8. |
| `face_maker_gate` | clicked the button labelled `wolf cut` | THE RULER NAMED A STYLE AND THE STYLE DIED. Picking a cut still changed his face perfectly; there was just no WOLF CUT button to click. Reads the pool now. |
| `craft_law_gate` clause 6 | `>= 4` canon styles carry the skin-tint | A SHARE, NOT A COUNT -- the third time this exact bug has been written (hairline_gate has a paragraph on it beside PIECES_PCT). THE RATE WENT UP: 7 of 24 = 29.2% -> 3 of 11 = 27.3%, against 4 of 15 = 26.7% on the build the line was written for. Floor is 25% now. |

`city_cast_silhouette_gate` is the one that was RIGHT. Nearest-cut alone broke the six
outlines twice: two pairs landed on the same cut, and the member the table calls
"smallest" got LAYERED FALL, the largest untextured cut in the pool, squeezing the
cast's size spread 11.2% -> 9.1%. So inside that one table the repoint carries the
table's own two authored properties -- no two members share a cut, and a repoint may
not overturn a member's written brief. Body sizes came out 659/712/689/612/635/702,
spread 14.0%, and the gate is back to exactly the state it has on main (its mean check,
0.079 against a 0.085 floor, was already red before this turn and is the cast lane's).

## WHERE HE SEES IT
CHARACTER tab: the haircut list is eleven now instead of twenty-four, and the thirteen
he killed are gone from it. CLOTHES tab: they read "DOWN (graveyard)". Everywhere a
person stands -- the street, the family, the faction board, the city cast -- nobody is
wearing a shape he killed.

## PROOF
    node gates/hair_graveyard_gate.js        13/0  (4 new checks, all mutation-tested)
    node gates/hair_gate.js                  39/0  (one more check than before)
    node gates/hairline_gate.js              12/0
    node gates/portrait_haircut_gate.js      12/0
    node gates/face_maker_gate.js            13/0
    node gates/craft_law_gate.js             39/0
    node gates/clothes_4x_gate.js            13/0  1,744 pinned 56px hashes unmoved
    node gates/talking_portrait_gate.js      27/0
    node gates/family_gate.js                15/0
    node gates/runway_gate.js                82/0
    node gates/structure_gate.js            134/0
    node gates/look_gate.js                  24/0  (24 pictures retaken)
    python3 gates/style_card_gate.py        112/0  (bank regenerated, 317 canon)
    python3 gates/bohemia_leaf_gate.py       holds
    python3 gates/bohemia_graveyard_gate.py  180 tokens, 248 tombstones, 0 LIVE REFERENCES
