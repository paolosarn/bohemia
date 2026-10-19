# THE MARAUDER THROUGH THE RIG (COOK THREE, [the tiers through the rig] round 7, the last tier, 10/19/26)

Rule 115(a)(c)(h), rule 120(d). Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 at Extra
(rule 116), opened by the coordinator (rule 112). The same direction as the raider again and the leader (rounds 5 and 6,
this session): the thug and the marksman he said YES to, the city not the Middle Ages.

## How Battle Brothers did it (rule 41)
records/target/bb/enemies.json, `brigand_marauder`: the band's ARMOURED BRUTE ('Brigand Marauders start appearing in
the middle game, one or more among weaker brigands. Later, brigand parties can sometimes entirely consist of
Marauders'): Pillaged Heavy Lamellar, Patchwork Scale or a Rusted Mail Hauberk, a third of the time with METAL PLATES AND
RIVETS on it; a Marauder Helmet with CLOSED mail (the face shut); 55 percent a TWO-HANDER (a Longaxe, a Two-Handed Mace
or Mallet, a Pike...). The tier paint file's MARAUDER: plate, 5 lames, spikes. The lesson kept: the heavy one with the
big swing, his face shut until he lifts it.

## Our skin, from the same city
- THE LAMELLAR AND THE SPIKES: old FOOTBALL SHOULDER PADS gone bone-white, a shell over each shoulder and an arch over
  the chest and the shoulder blades, with BOLTS WELDED UPRIGHT on each crown; the set rides the chest bone (as real pads
  do) while the arms move under it. The wide pale shoulders are his silhouette's feature at 28 px.
- THE CLOSED HELMET: a WELDING MASK flipped up on its hinge at the temples (shut, his face is gone; flipped, it stands
  over his head like a crest), built round PORTRAIT's skull (its numbers read, never edited), a dark glass window, and a
  RED STRIPE down it: war paint, the one accent above the waist.
- THE REST AREA: a WELDER'S LEATHER APRON from the chest to mid-thigh (a bib widening below the waist, hanging straight
  from the belly, never into the gap between the legs; the hanging half on the hips with a share to each thigh).
- THE TWO-HANDER: a SLEDGEHAMMER (Battle Brothers' Two-Handed Mallet), a long handle and a bevelled steel head.
- A black long-sleeve shirt and trousers, boots. PORTRAIT's head: a buzz and a full black beard under the mask, a scar
  through the brow. 8 materials: skin, eyes, the black (shirt, trousers, mask), rubber (boots, the window), the pads'
  bone, steel (bolts, hammer head), leather (apron, handle), the red stripe.

## The skin is the face's (rule 120(d))
skin_mid 2 on the face and the hands, the same step; measured off the ID pass, pooled over the eight facings (the
ruler: records/BOHEMIA_COOK3_THE_RAIDER_AGAIN_10_19_26.md): see the card below.

## The cycles (logged), and where this lane stopped on purpose
1. Smooth bone-white domes 11.8 by 13.8 cm: card 0 of 8 out, span 163, skin 2.1; the pads READ AS FUR, two white
   pom-poms on the shoulders.
2. The domes stepped into lames (1.3 cm shingles, a size smaller): no change at 1x. The lames were under a pixel.
3. Olive drab paint (a mid value, so the rig's wear would be dust, not the bright-base mottle) and 2.2 cm lames: green
   fur, and the value span fell to 112 (the pads were the light end). The colour was never it.
4. FACETED, flat-shaded shells (eight round, six down: each band one hard plane), bone again: span 154, skin 2.5, and
   STILL a puff at 1x. The object-ID pass confirms the puff is the pads (184 and 143 px at S); the raw render before
   the analog pass already shows it. A bright shell 10 px wide is under the grain and the clay shading at this size,
   whatever its geometry. A fourth version is where the stop-producing law (7/26) says stop and say so: the pads read as
   BIG PALE PUFFED SHOULDERS, which is still the silhouette's feature, and the card says that plainly instead of calling
   them football pads.

## The card, the skin, the sheet (the full render, cycle 4)
The card on the S still, class person: 0 OF 8 OUT: long side 134, colours 1,479 vs 758, top 8 3.3%, value span 156,
saturation 0.247, light top minus bottom 51.8, edge -18.7, grain 1.68. Colours across the set 36,852; the passing pose of
Anim_0, frame 7. THE FACE IS THE BODY'S FACE: dE 4.7 PASS (face L* 54.6, hands 50.0; 764 face pixels, 131 hand and
neck pixels over the eight facings); records/cook3/rig/marauder_skin.json.
records/target/cook3/COOK3_THE_MARAUDER_THROUGH_THE_RIG.png: eight facings, the S and SE walk (6 keys = 2 beats at 120),
beside the game's flat marauder at 1:1 and 4x, the skin line under the card. 57 px a metre, one pixel size, block 1;
palette records/target/BOHEMIA_STYLE_PALETTE.json, every base colour a step of a role; one light, the rig's sun upper
left. VOTE: cook3-the-marauder-through-the-rig-10-19 (its line says the pads read as big pale puffed shoulders).

## Findings
- FOR DIRECTION (the rig): a small bright convex shell (about 10 px across at 57 ppm) renders as fluff from the raw
  pass on, smooth or faceted, bone or olive: the grain and the clay shading are at the shell's own scale. Hard armour on
  a person at this size reads by its OUTLINE and by flat planes 3 px and up (the raider's vest plates, the leader's
  licence plates read; these did not). Worth a style guide row: 'a hard piece smaller than 4 px a facet reads soft'.
- FOR DIRECTION (the rig, again): the object-ID table's hex IS what the PNG carries, but the material-ID table's hex is
  the linear emission (the PNG is sRGB): two passes, two encodings.
- FOR COMBAT: Battle Brothers' marauders can make up a whole late band; with the sledgehammer he is the one melee tier
  besides the thug's pipe and the poacher's hatchet (rule 120(a): the gun answers him).

REFERENCE CHECK: the twin is the game's own flat marauder (records/cook3/enemy_tiers_repainted.png, cell 5: grey striped
plate with shoulder spikes, an olive coat, a black cap, a flat face); the thug and marksman he voted up; PORTRAIT's
modelled head; the card of numbers. No reference game.
