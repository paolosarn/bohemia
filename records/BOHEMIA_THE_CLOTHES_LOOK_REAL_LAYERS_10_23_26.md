# CHARACTER [the clothes look real]: LAYERS THAT SHOW (10/23)

Rule 129 as corrected. HIS WORDS: "I am concerned that you're not making the clothing good enough to look good...
layering, layering"; then "I didn't mean to say leather, I just meant to say layers, so don't worry about leather."
The coordinator's row: every person rolls an OUTFIT of layers that visibly sit over and under each other, on the pieces
already made, before any new piece. No card (rule 127). Checked against real photographs at 1:1 (rule 82).

## 1. The real photographs at the game's size (the check, done first)

Four photographs of real layered outfits, each scaled so the person stands 112 px tall (the size the rig renders a
person in the game: 36 x 117 px). Linked, never stored (the library's rule: we link and annotate, we do not copy bytes):

| photo | outfit | what survives at 112 px |
|---|---|---|
| the DeepFashion2 sample still, the man at left (https://raw.githubusercontent.com/switchablenorms/DeepFashion2/master/images/deepfashion2_bigbang.png) | a tan jacket worn open on a red shirt | the shirt as a stripe 2 to 4 px wide down the open front, from the collar to the hem: hue and value both apart |
| the same still, the tall man | a grey short-sleeve tee over a dark long-sleeve | the dark forearms out of the light sleeves (a 2 to 3 px band from the elbow) and a dark ring at the neck |
| the SCHP demo photo (https://raw.githubusercontent.com/PeikeLi/Self-Correction-Human-Parsing/master/demo/demo.jpg) | a navy overcoat on a white shirt and a tie | a light V 3 to 5 px wide at the neck: the strongest single read of a layer at this size |
| the IDM-VTON example "Jensen" (https://raw.githubusercontent.com/yisol/IDM-VTON/main/gradio_demo/example/human/Jensen.jpeg) | black leather on a black tee | almost nothing: tonal layers read only by the jacket's collar edge and its highlights, and our clay look has no highlight (the guide: roughness 1, specular 0) |

THE THREE RULES THEY GAVE: (1) a layer reads only if it is ANOTHER VALUE than the one over it (two layers in one colour
are one garment at 112 px); (2) what shows of a layer under another is 2 to 5 px: the V at the neck, the stripe down an
open front, a hem band, a cuff, a hood heap; (3) a layer over another throws a shadow band on it (the library's GARM-01),
so the layers must stand off each other by the cloth. The runway library said the same in its own words: RNWY-05 and
RNWY-08 (every layer's hem lower than the one over it), RNWY-06 (each layer readable at the collar).

## 2. What our people did (measured on RUN TWO's roll, 116 people, before this round)

* RUN TWO's roll puts the top and the coat both inside the gang's hue (its `same_cloth`), so a coat over a shirt rendered
  as one blob: the RUST HOODIE (79 of 255) under the LEATHER JACKET (69) was one brown mass.
* The coat closed over the neck (its front opened only below 1.04 m, a 7 cm slit) and ran to the wrist, so nothing under
  it showed: no V, no cuff, no hem, the hoodie's hood buried under the coat's collar.
* 76 of the 116 wore one top and nothing over it.
* The gang mantle (Blues, Caravans, Church, Homeless, Mob, and a rolled shoulder mantle on others) wrapped the whole chest
  and both arms to the wrist, hiding every layer under it.

## 3. What changed

**THE OUTFIT** (`tools/bohemia_character_the_outfit.py`, decided once per person off his id):

* UNDER A COAT, the top must read apart from it (40 values on the bank's mid, or 24 and clearly another hue, or 24 when
  one of them is printed: a 16 cm plaid is a 9 px check). If not, the top becomes the same cut in another colour of the
  bank, a plain colour first, so the gang's colour stays outside where the street reads it; if no colour of that cut
  works, the coat does, the same coat in another colour (the gang's first). The gangs' own pieces (the Church's
  vestment, the Mob's pinstripe, the Trades' apron) stay with their gangs.
* HOW THE COAT IS WORN: open down the front to the neck (a jacket 4 in 5, a car or chore coat about 2 in 3, a longcoat
  3 in 5, a duster and a vest always, a trench 1 in 3; the wrap coat never); the hoodie's hood heaped OVER the coat's
  collar (the coat drops its standing collar); a shirt's collar out over the lapels; the shirt's tail or the hoodie's
  band below a jacket or a vest; the coat's sleeve ending short of the shirt's cuff, or pushed up the forearm in a
  bunched roll.
* NO COAT: a second top, the one outside in his gang's colour where one reads: an open shirt over his tee, tank, henley,
  turtleneck or runway tee; his own shirt worn open over a plain tee; his tee or tank over a long-sleeve of another value
  (the dark sleeves out of the light tee); his hoodie over a longer tee whose hem shows under the band, or under an open
  flannel with the hood out over its collar.
* THE BELT (GEAR 1, later the same round): a rolled belt or tool belt is cinched OVER a closed longcoat, car coat, chore
  coat, cocoon, comma or asymmetric coat at the coat's own waist offset; under an open coat it stays on the trousers.
* THE MANTLE, for a person in an outfit: a capelet, fastened at the throat, open down the front and off the forearms.
  The fourteen looks keep theirs as voted.

**THE GARMENTS** read the outfit off their build (`L['layers']`): GARMENTS BASE (`pieces(G, X, layer)`: role mid, open,
sleeves, hem_drop, hood_over, collar_out, cuff_to, arms_covered, lift) and GARMENTS OUTER (`pieces(G, X, layer)`: lift,
open, ohw, collar_z, fo_add, collar, neck_top, sleeve_to, push). With no layer every piece builds exactly as before (the
coat and top cards, the fourteen looks). The barber's person build decides the outfit before the body, so RUN TWO's
builder (`tools/bohemia_run2_no_two_people_alike.py build-one`) takes it unedited.

**THE COUNT** (RUN TWO's first 116, `records/target/character/BOHEMIA_THE_OUTFITS.json`; over its full roll of 152 since,
143 in two layers or more, 58 tops and 14 coats in another colour, 9 in one): two layers or more on 110 (was 40);
45 tops and 11 coats in another colour of the same cut so the two read apart; 6 still one garment (two work
coveralls, which are one garment by nature, and four left bare by the roll's 1 in 20 to 1 in 10: a tank in the heat, a
henley, a short-sleeve shirt, a flannel). Every person also keeps GEAR 1's kit (bags, straps, scarves,
belts), which crosses over the coat: bandoliers and bag straps stand off the coat, a scarf's tail lies over a strap.

## 4. Proof

`records/target/character/the_clothes_look_real/CHARACTER_THE_LAYERS_BEFORE_AND_AFTER.png`: eight of RUN TWO's people,
each before (the outfit switched off, `BOHEMIA_OUTFIT=off`) and after, facings S, SE, E and N, at 1:1 and at x3, built
by RUN TWO's own build-one and rendered by DIRECTION's master rig (standing, 16 samples). At 1:1: the sand hoodie's
stripe down the open leather jacket, its hood on the jacket's back and its band under the jacket's hem; the striped tee
in the open drifter's coat; the white tee's band under the blue hoodie; the bone henley's sleeves and hem out of the
leather vest under the olive capelet; the striped tee over black sleeves under the Church's gold capelet.

`records/target/character/the_clothes_look_real/CHARACTER_THE_LAYERS_CROWD_BEFORE_AND_AFTER_X2.png`: the same eight in a line
as a street shows them (facing S, then SE; before above after; at x2), the latest pass on each (the drape, the loud
eight turned down, the belt over the closed car coat): before, eight one-colour blobs and neon boots; after, a V or a
stripe under every coat, hem bands, sleeves out from under, dyed cloth that reads worn.

The walk in eight (six keys) on two of them: the open jacket, the hood heap, the open shirt and the tee move with the
body, nothing pokes through (every piece takes the man's nearest weights; the hanging pieces blend hip to thigh).

Caught by looking, fixed before the push: a tee's sleeve band and stand-off poked through an open shirt's sleeve (a
covered layer now drops what stood off its own sleeves); the mid top's hanging tail took the tee's cloth (its pieces
are named its own); the mantle hid every layer (the capelet).

## 5. For RUN TWO [no two people alike]

* Your builder takes the outfit with no change. The top and coat your roll names may come back in another colour of the
  same cut; the build's stats json (`records/character/rig/person_<id>.json`, `worn` and `layers`) and
  `records/target/character/BOHEMIA_THE_OUTFITS.json` say what he wears. Your bake's `top=` and `coat=` are the roll's;
  read `base`, `mid`, `outer` from the outfit book (or `bohemia_character_the_outfit.outfit(P)`) so the sheet says what
  the person wears.
* People rendered before this push (your branch carries 3, more may sit on your disk) were built without the outfit:
  delete their folders under `records/target/character/barber/person_*` and run `batch` again from main.
* Your NO_TOP and NO_COAT exclusions can stay; the outfit never swaps a top into a different cut.

## 6. Not done, seen

* Each garment reading as its own cloth beyond colour and shape (knit, denim, canvas, wool): at 57 px a metre one pixel
  is 1.75 cm, so ribbing and stitching vanish; what is left is relief over 2 cm (folds, bunching, patches) and wear.
  Next on this row.
* DONE LATER THE SAME ROUND: the shoes in a gang's saturated colour (SIGNAL RED BOOTS, GRASS BOOTS, COBALT STACK BOOT)
  rendered hot pink, neon green and lilac after the rig's dust. Measured: the bank's eight loud ramps (signal red, gold,
  grass, teal, cobalt, rose) come out of the source push at 145 to 228 of chroma, every other cloth at 92 or under. His
  9/23 note ('the bright colours not so bright, vibrance turned down a little') is the ruling: GARMENTS BASE's src() now
  pulls a cloth back toward its own grey to 90 of chroma (the rust family's level), brightness kept so the outfit's value
  contrast holds; 37 of 307 garments move. The red boot reads worn dusty red; the green and teal coats sit with the street.

[bb Battle Brothers stacks a man's gear as a body armour and a helmet slot, each drawn whole over the last; ours are
cut on the man and worn the way people wear them, open, pushed up and untucked, so the layer under shows at 112 px.]
[analog horror: a hoodie gone the colour of sand under a cracked jacket, a shirt worn open because the buttons went for
trade, a blanket made a capelet.]
