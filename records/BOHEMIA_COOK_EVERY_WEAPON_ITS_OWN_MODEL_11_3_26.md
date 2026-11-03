# COOK WEAPONS: EVERY WEAPON ITS OWN MODEL (rule 337, ask line 344; Paolo 11/3)

Paolo 11/3: "you build the bosses like shit, we don't have enough assets, and you're not creating assets, weapons, armor, the
vibe, nothing." MEASURED by the coordinator and again here: the two armory rounds added 19 weapons as DATA only; both records say
"OWED: own 3D models". In a man's hands each was drawn as its family's model (slices/rig_melee by_row).

## THE WAY (one renderer, the master rig; nothing drawn by hand)
1. MODEL: each weapon a glb at real size in the rig's held frame (reference/models/bohemia/item_<name>.glb: origin the middle of
   the right hand's grip, haft along +X, edge +Z), built with COOK's every-item kit (tools/bohemia_cook_a_model_for_every_item_10_25_26.py
   Kit/build/model, imported, its builders added to it), every colour a step of the style palette, five materials at most.
   tools/bohemia_cook_every_weapon_its_own_11_3_26.py.
2. IN HIS HANDS: ANIMATION's own prop render (tools/bohemia_animation_melee_in_hand.py render_props, called as it is) on YOU's
   posed body, the master rig's camera, sun and stretch read back from his rig.json, his body a holdout, every key of every clip,
   eight facings. YOU's body was rebuilt in this container (COMBAT `bodies you`, the hold pose, the Stand frame: 16 + 12 + 18 s) and
   checked against the shipped pictures first: the chain's swing re-rendered lands on the shipped cells to the pixel (59,-8,7,17;
   54,81,7,47; 59,78,11,55 both ways).
   New layers in records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json: m4 (one hand, the m2 clips; the spears thrust), s4 (one
   hand with a shield, the s2 clips), t4 (two hands, the t2 clips). 'hanging': the cords, thongs and chains hang from the handle's
   end, trail the wind and fly out on the blow, the way COOK's chain does (build_prop and model_sig read the list now, one line each).
3. EVERY MAN: the fight already lets a man hold another man's pictures moved by the difference of their feet (meleeDraw,
   props_ref; 23 looks did it since 10/25). The four named looks that drew all their own things (the thug, the poacher, the
   caravans, the wide brim) now fall through to YOU for the new layers; their HELD-BACK layers stay held back (their shield arm
   sinks 14 px, ANIMATION's 'withhold'): the list rides in their json and the fight's thing()/has() skip those layers (a 4-line
   change in slices/BOHEMIA_FIGHT.html, marked). Rolled men fall through their gang to YOU.
4. THE ROW: slices/rig_melee/rig_melee.json by_row / two_by_row point each armory row at its own model, only once YOU's pictures
   of it are packed (never a man the fight thinks is armed while the sheet is not).
5. THE SHELF: the shop tile of a piece of the valley's own wears its model's render (slices/market_icons/own_<row>.png, the rig's
   light, on the inventory's diagonal); a picture on a tile wins over the kit's drawn icon (RUN TWO 10/11). Marked block
   __EVERY_WEAPON_ITS_OWN__ in slices/BOHEMIA_SETTLEMENT_SCREEN.html.
6. THE BAG ICON: TRIED AND NOT SHIPPED. The model cut into the kit's 22 cells (tools: `icon-render`, `icon`) read WORSE than the
   hand-cut icon side by side: the knife on the pole, the cord's plug and the barbs are lost under two cells, the colours went
   muddy. The hand-cut 22-cell icons stay; they are each weapon's own drawing already (ARMORY 11/2), never another's.

## BATCH 1 (BUILD 11/3zzd): THE FIVE NEWEST
| weapon | before: drawn in his hand as | after: its own model | size |
|---|---|---|---|
| pool pole spear | the rebar spear | aluminium skimmer pole, teal cam-lock collar, kitchen knife taped into the clip end, an older pale tape wrap | 2.24 m |
| extension cord | the chain (handle, chain, padlock) | orange cord wound four turns round his fist, the socket out the back of his hand, hanging to a three-prong plug, a taped split | 1.06 m |
| live wire | the chain | drill battery for a pommel on a taped pipe grip, a switch on a red label, black cable to stripped copper | 1.18 m |
| barbed wire | the chain | taped broom stub, a rope, two strands of rusted barbed wire twisted on, a barb every 12 cm | 1.08 m |
| rodeo bullwhip | the chain | two-tone plaited handle, knot and wrist loop, brass ring, banded thong to the pale fall and cracker | 1.25 m |

YOU's sheets: you_props_m4.webp (966 cells), you_props_s4.webp (717 cells). The fight's 2D lash (ARMORY 2's, six drawn keys on the
beat) still flies from his fist; the hanging cord now is the weapon's own.

## BATCH 2 (modelled and rendered this round, ships the next push): THE MELEE OF THE LAST ARMORY ROUND
crowbar (was the pipe), bike-lock chain (was the chain), box cutter (was the cleaver), framing hammer (was the sledge), broom bayonet
(was the rebar spear), pawn-shop katana (was the machete), splitting maul (was the fire axe), sign-post halberd (was the pole hook).

## PROOF (tools/bohemia_cook_every_weapon_its_own_proof_11_3_26.js, the shipped fight at 390 x 844 at 3x through the one driver)
Each weapon in YOU's hands a reach from a brigand: turned through the eight facings, then the fight's own strike held at six points
of its beat; twice, BEFORE (the row pointed back at its family model, in the page only) and AFTER. The fight's own count of what it
drew (records/target/cook_every_weapon/proof.json): AFTER, prop:<the weapon> 405 to 422 draws a run, its family model 0; 0 page
errors in all ten runs. The VOTE card is those frames: records/target/cook_every_weapon/sheet_batch1.webp (WAS left, NOW right).

## CHECKS RUN (only the ones this change touches)
Green: every item has a model 226/0 (amended: a weapon modelled as its own, 'was' in items.json, owns its row; it only knew the club,
the bat and the hatchet); the thing in his hand 29/0 (it caught the katana's row id, 'pawn_katana', fixed before ship); reuse-first
(both new tools PASS); reference check (both new tools carry one; the gate's 2 reds are other tools already red on main: the armour
cards, the night shots, the town glide).

## OWED (honest)
- THE SIX GUNS (zip gun, snub revolver, lever rifle, scoped deer rifle, sawed-off, pump shotgun) are drawn as the pistol, the rifle
  and the shotgun: a gun is rendered per look on a grid sheet (slices/fight_rig/<look>_guns.webp, three rows), not borrowable like the
  melee layers; COOK's own B guns (gun_pistol_b, gun_rifle_b, gun_shotgun_b: a revolver, a lever carbine, a pump) already exist as
  models. Next: the guns' sheet falls through to YOU's like the melee does, then the six rendered in his hands.
- The other 107 Battle Brothers rows still drawn as their class's model (by_class): a sword is the machete, a mace the pipe. Next
  after the guns, the most-carried first (ANIMATION's 10/25 count: the bludgeon, the mallet, the woodcutter's axe).
- The lash itself is the fight's 2D drawing (ARMORY 2's); SOUNDS owns the crack and the hiss.
- The bag's 22-cell icon from the model (above): a better cut wants more than 22 cells; UI's line.

[bb Battle Brothers draws every weapon its own sprite in the man's hand, layered over his body in every pose; ours now does for these thirteen.]
[analog horror: every one of them is something the valley lost its use for: a pool with no water, a garage with no power, a fence with nothing behind it.]
