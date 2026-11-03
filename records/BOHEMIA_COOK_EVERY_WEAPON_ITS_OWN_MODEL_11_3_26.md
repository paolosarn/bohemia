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
   New layers in records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json: m4 and m5 (one hand, the m2 clips; the spears thrust), s4
   and s5 (one hand with a shield, the s2 clips), t4 (two hands, the t2 clips). 'hanging': the cords, thongs and chains hang from the handle's
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

## BATCH 2 (BUILD 11/3zzj): THE MELEE OF THE LAST ARMORY ROUND
| weapon | before: drawn in his hand as | after: its own model | size |
|---|---|---|---|
| crowbar | the pipe | a 30-inch hex wrecking bar in red paint worn to steel at the grip, the gooseneck and split claw, the chisel butt, tape lifting | 0.86 m |
| bike-lock chain | the chain | square links in a torn black sleeve bunched and taped for a grip, the lock barrel with its brass key | 0.94 m |
| box cutter | the cleaver | a yellow heavy-duty utility knife, blade run all the way out, the back wound in black tape (drawn a third over its real 0.2 m so the blade reads) | 0.27 m |
| framing hammer | the sledge | a hickory framing hammer, the milled face, the straight rip claw with a bent nail caught in it | 0.50 m |
| broom bayonet | the rebar spear | a teal-painted broom handle worn to wood at the grip, an old bayonet hose-clamped on twice, a rag tied under the clamps | 1.60 m |
| pawn-shop katana (row pawn_katana) | the machete | a wall-hanger katana, black wrap with pale diamonds, round guard, the curved blade, the price tag on its string | 0.97 m |
| splitting maul (two hands) | the fire axe | an eight-pound maul, the wedge ground bright, the sledge face behind, red paint mostly gone | 0.92 m |
| sign-post halberd (two hands) | the pole hook | a punched U-channel sign post, a STOP sign cut into an axe blade and bolted through, a back spike, the post ground to a point | 2.03 m |

YOU's sheets: the six one-handers on their own layers m5 (1,110 cells) and s5 (809), the maul and the halberd on t4 (387: the t2
clips: held across him, leaned on, brought down in both hands, the halberd thrust). First packed onto m4 with the five, the sheet
came to 2048 x 1046 and THE THING IN HIS HAND's P7 refused it (rule 173: no sheet over 2048 x 1024, a phone's decode); split, the
same pictures, nothing rendered twice. Proof: each in YOU's hands in the shipped fight, AFTER prop:<weapon> 405 to 433 draws a run,
its family model 0, 0 page errors in all sixteen runs (the crowbar re-run after the split).
The first look at the eight side-on caught the halberd's blade reading as a red bucket; it was cut narrower to flare to the edge
before any render.

## PROOF (tools/bohemia_cook_every_weapon_its_own_proof_11_3_26.js, the shipped fight at 390 x 844 at 3x through the one driver)
Each weapon in YOU's hands a reach from a brigand: turned through the eight facings, then the fight's own strike held at six points
of its beat; twice, BEFORE (the row pointed back at its family model, in the page only) and AFTER. The fight's own count of what it
drew (records/target/cook_every_weapon/proof.json): AFTER, prop:<the weapon> 405 to 422 draws a run, its family model 0; 0 page
errors in all ten runs. The VOTE card is those frames: records/target/cook_every_weapon/sheet_batch1.webp (WAS left, NOW right).

## CHECKS RUN (only the ones this change touches)
Batch 2: every item has a model 258/0, the thing in his hand 29/0 (after the split), the market's pack art 8/0, the VOTE tab (below).
Batch 1: green: every item has a model 226/0 (amended: a weapon modelled as its own, 'was' in items.json, owns its row; it only knew the club,
the bat and the hatchet); the thing in his hand 29/0 (it caught the katana's row id, 'pawn_katana', fixed before ship); reuse-first
(both new tools PASS); reference check (both new tools carry one; the gate's 2 reds are other tools already red on main: the armour
cards, the night shots, the town glide).

## OWED (honest)
- THE SIX GUNS (zip gun, snub revolver, lever rifle, scoped deer rifle, sawed-off, pump shotgun) are still drawn as the pistol, the
  rifle and the shotgun. MEASURED this round: a gun in a man's hands is drawn by FOUR picture systems, each per look and none
  borrowable the way the melee layers are: the fight's gun grid (slices/fight_rig/<look>_guns.webp, three rows x 8 facings x 15
  keys, COMBAT's guns tool), the held clips (slices/rig_hold, the pistol's low ready, the reload), the idles (slices/rig_idles, 'his
  gun is rendered in his hands on every idle') and the shield arm's pistol (rig_melee s1). Doing it right is its own round: the
  grid falls through to YOU's sheet by the feet the way meleeDraw does, then the six rendered once in YOU's hands in each system.
  The models half exist: COOK's own B guns (gun_pistol_b a revolver, gun_rifle_b a lever carbine, gun_shotgun_b a pump) are built;
  the zip gun, the snub and the scope are not.
- The other 107 Battle Brothers rows still drawn as their class's model (by_class): a sword is the machete, a mace the pipe. Next
  after the guns, the most-carried first (ANIMATION's 10/25 count: the bludgeon, the mallet, the woodcutter's axe).
- The lash itself is the fight's 2D drawing (ARMORY 2's); SOUNDS owns the crack and the hiss.
- The bag's 22-cell icon from the model (above): a better cut wants more than 22 cells; UI's line.

[bb Battle Brothers draws every weapon its own sprite in the man's hand, layered over his body in every pose; ours now does for these thirteen.]
[analog horror: every one of them is something the valley lost its use for: a pool with no water, a garage with no power, a fence with nothing behind it.]
