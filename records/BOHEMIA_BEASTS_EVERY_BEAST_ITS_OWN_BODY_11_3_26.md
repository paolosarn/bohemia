# BEASTS 2: EVERY BEAST ITS OWN BODY (11/3/26, rule 345, ask line 354)

Paolo 11/2 in the VOTE tab, on THE FERAL BULL: 'They look wayyy to similar to the og coyote the wolf actually to this needs way
more work'. On CAMELOPS, THE MOUNTAIN LION, THE FERAL HOGS, THE COYOTE PACK: 'Work in progress keep going'. The coordinator's job:
every beast reads as THAT animal by its SHAPE at phone size before its colour; the bull first, then the other four, then the dire
wolf and the feral dogs so the canines are told apart. Rule 337: the asset, through the rig, the same round.

## 1. WHY THEY LOOKED THE SAME (measured)
Every rig beast in the fight (the dire wolf, the cave hyena, the feral shepherd, and the five of 11/3) was ONE MESH: the Khronos
Fox (reference/models/khronos/Fox.glb, 1,728 vertices), stretched by the hyena tool's reshape (legs longer, the head scaled, ears
pulled, a tail shortened) plus, for the five, three moves (a neck pushed up, a hump lifted, two horns glued to the skull). A stretch
keeps the fox's ribcage, the fox's skull, the fox's ears and the fox's leg shape: the bull was a fox with horns and a white face,
the camel a tall fox with a bump. Colour was the only thing telling them apart, which is exactly what his note says.

## 2. WHAT CHANGED (tools/bohemia_beasts_every_beast_its_own_body.py)
ONLY THE FOX'S SKELETON IS KEPT (its 23 bones, so the poses tool, the master rig and the fight's sheet layout all work unchanged).
Each animal gets:
- ITS OWN BODY, grown from its real measurements in metres: an implicit surface (Blender metaballs, calibrated: a lone element's
  visible radius is R*sqrt(1-(t/s)^(1/3)), measured exact to 1 mm) of ellipsoids for the chest, barrel, rump, shoulders and thighs,
  capsules for every leg bone at its own thickness, the neck as its own curve, the head as cranium + jaw + muzzle, the ears, the
  tail, and each animal's own parts (table below). Horns and tusks are tube meshes on the head bone.
- ITS OWN JOINTS: every bone moved (never turned) to that animal's shoulder, elbow, knee, hip, stifle (at ~0.58 of the hip's
  height: the first pass put it at the belly line and the shin lay flat), hock, fetlock, neck base, poll and tail. The skin is
  weighted by which body part each vertex grew from (each element's own field share at the vertex), so it bends at its own joints.
- ITS OWN WALK: the Fox's walk was made for a fox's legs and on a bull it folded the hind legs flat and dropped the nose to the
  ground (seen on the first two passes), so each animal walks a cycle written for its own legs: 24 frames (two beats at 120 BPM),
  each leg on the animal's gait, the leg swinging about the stance it was built in, the fore knee and the hock folding in the swing,
  the body bobbing twice a cycle, the head nodding, the tail swaying.
- ITS OWN ATTACK in the bite's slot (the six drawn keys at frames 2, 6, 10, 14, 18, 22).
- ITS OWN COAT painted from the 3D shape (every texel traced to its point through the UVs), with the analog horror at the source:
  a tag, a shaved patch, a scar, a collar, mange; never radiation, never gore.

| beast | built (shoulder / hip / long, m) | the real animal | its own shape | gait | attack | the mark |
|---|---|---|---|---|---|---|
| FERAL BULL | 1.57 at the crest (1.48 withers) / 1.46 / 2.54 nose to rump | Hereford-line range bull, 1.45-1.55 m, 800-1,000 kg | deep barrel, level back, neck crest, dewlap, short thick legs, cloven hooves, horns out-forward-up (0.3 m), tail to the hocks with a switch, Hereford white face, crest, belly, socks | TROT, heavy bob | GORE: head down, lunge, hook up and aside | yellow farm ear tag, healed fight scars |
| CAMELOPS | 2.22 / 2.13 / 2.94 (the head 2.59 up) | Camelops hesternus, ~2.2 m at the shoulder, about a fifth over a dromedary | long thin legs, dark knee calluses, broad foot pads, one hump, neck down then up (a U), long face, small round ears, thighs high on the body, tufted tail | PACE (both legs of a side together), body roll | KICK: a hind leg back and out, the other, a forefoot strike | the lab's shaved neck patch with stitches, lab ear tag |
| MOUNTAIN LION | 0.65 / 0.72 / 1.93 | Puma concolor male, 0.60-0.75 m, tail 0.6-0.9 m | long low body, hips over shoulders, blades up, thick legs, big round paws, small round head, short round ears, a thick tail hanging in a J to a dark tip | WALK, low | POUNCE: crouch, spring with forepaws out, land, bite held | research GPS collar (Nevada collars its lions) |
| FERAL HOG | 0.88 / 0.73 / 1.64 | Sus scrofa boar, 0.75-0.9 m, 90-150 kg | a wedge: massive shoulders, no neck, rump lower, narrow body, bristle ridge, long head carried low to a snout disc, tusks, short thin legs, small hooves, tasselled tail | TROT, tail swish | SLASH: rush, tusk up one side then the other | farm ear tag (the pig farm's) |
| COYOTE | 0.58 / 0.57 / 1.08 | Canis latrans, 0.58-0.66 m, 9-18 kg | small, lanky, narrow chest, tucked waist, big pointed ears, narrow muzzle, bushy tail carried LOW | TROT, light | BITE (the wolf's keys) | sarcoptic mange on the hip |
| DIRE WOLF | 0.81 / 0.78 / 1.56 | Aenocyon dirus, ~0.8 m, 60-68 kg | heavy, thick-boned, BROAD skull, short deep muzzle, neck ruff, big paws, straight bushy tail | WALK | BITE | white coat (the 2025 lab pups were born white), lab ear tag |
| FERAL DOG | 0.59 / 0.56 / 1.24 | shepherd x pit mix, 0.55-0.6 m, 28-34 kg | blocky broad head, short muzzle, thick neck, ONE ear up and one flopped, tail UP in a sickle | WALK | BITE | the red collar it wore at home, its tag |

THE CANINES APART, by shape before colour: the coyote is the smallest and thinnest with the biggest ears and the tail hanging low;
the dire wolf is the biggest and heaviest with the broadest head and a neck ruff; the dog has the blocky head, one flopped ear and
the tail up over its back. Then colour: grey-buff and rust, white, black and tan.

## 3. THE COMPARE (the 9/4 law: beside a man of ours, same frame)
On the VOTE card every beast plays WAS (the old sheet's own SE row, kept at slices/vote/beasts_was/) beside the man (cast_shortcoat,
1.72 m = 98 px) beside NOW (the fight's new sheet), one ground line, one image pixel to one screen point; a line-up of all seven
NOW with the man; and each beast's eight facings. MEASURED on the fight's own sheets, facing east, painted pixels wide x tall
(the camera's 45 degrees shows the back from above, so a beast reads taller than its shoulder): the man 26x107, the coyote 64x44,
the feral dog 72x51, the dire wolf 90x58, the feral hog 96x61, the mountain lion 112x51, the feral bull 146x112, Camelops 170x141.
The order is the real animals' order; nothing is scaled after the render (57 px a metre, the man is the ruler). The card was
opened at 390 x 844: eight rows, nothing wider than the phone, no page error. Passes by eye on the way (rule 97): pass 1 the bull read as a cow but the Fox's
walk folded its legs; pass 2 the walk centred, the hind shin still flat (the stifle at the belly line); pass 3 its own walk and the
stifle at 0.58: it trots on its diagonals and gores head down. The six: pass 1 camel with two humps (the withers ridge), lion with a
tiny head at the ground and a spotted coat, hog with a fin for a crest, coyote too grey; pass 2 fixed each.

## 4. WHAT DID NOT CHANGE
The fight's rules, numbers and data (records/target/bb/bohemia_enemies.json) are untouched; the looks keep their names
(beast_<x>) and the sheet layout (18 columns: still, walk 6, bite 6, hit 2, fall 3; 8 facings), so the fight reads them as before.
The cave hyena is still the Fox reshape (not in his note; next in line if he wants it). The old models stay in
reference/models/bohemia/; the new ones are reference/models/bohemia/own_body/.

## 5. LEFT (no Paolo needed)
- The cave hyena on the same builder, if asked.
- ANIMATION may refine any clip; the walk and attack keys are tables at the top of the moves section.
- A kick that knocks a man back is still the fight's own rule; only the picture changed.

Sources: NPS Tule Springs Fossil Beds (Camelops, the Columbian mammoth); San Diego Natural History Museum (Camelops hesternus);
Nevada Department of Wildlife (mountain lion, coyote); the American Hereford Association (bull size); USDA APHIS feral swine;
Colossal Biosciences, April 2025 (the dire wolf pups Romulus, Remus and Khaleesi, white coats; grey wolf cells with 20 edits);
Dundas 1999 and Anyonge & Roman 2006 (dire wolf body mass); Webb 1965 and camelid trackway studies (camels pace).
