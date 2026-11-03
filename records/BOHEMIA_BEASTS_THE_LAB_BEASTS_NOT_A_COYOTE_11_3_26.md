# BEASTS 2: THE LAB BEASTS ARE NOT A COYOTE (11/3/26, rule 345 AMENDED, ask line 381)

His words: "maybe the beasts can look better, the lab beasts that got out, everything's looking like a fucking coyote". The job, the
coordinator's measurement and the law: records/BOHEMIA_PAOLO_THE_LAB_BEASTS_ALL_LOOK_LIKE_A_COYOTE_11_3_26.md. Worst first, one push
a piece. This record grows a section per piece.

## MEASURED FIRST (rule 12: the premise is a measurement)
- The coordinator's root cause holds where it counts: every job whose foe was 'beasts' (the hunts, the camps, the guards, the big
  game) dealt ours.enemy_tiers.mix.beasts, dire wolves and cave hyenas (late a frenzied wolf and a schrat), wherever it was; the map
  drew a hunt's pack as a wolf (6 in 10) or a hyena (4 in 10); and the offers that NAME their animal ('the wolves', 'the dogs', 'the
  hyenas', 'the show's cats', the big game's 'THE OLD LION') dealt the same mix.
- One part did not hold: the bull, the camel, the lion, the hog and the coyote were not in NO fight. The road rolls them (their
  factions by act, by the ground they live on and by night, through the fight's roadOpts, which the map's danger roll runs), from his
  second fight on. But no job ever dealt them, and the jobs are where he meets beasts.
- The cave hyena was still the Khronos Fox, reshaped.
- And one I caused: the map's beast pictures (slices/bohemia_job_kinds.js BEAST_META) had their cell sizes typed in (107 x 116);
  BEASTS 2's rebuilt sheets are 118 x 124, so the map cut the wolf across two cells. Fixed in piece 2 at the source: the map reads
  each sheet's cell from the fight's own index.

## PIECE 1, SHIPPED (BUILD 11/3zzzh): THE CAVE HYENA ITS OWN BODY
On the builder (tools/bohemia_beasts_every_beast_its_own_body.py, 'cave_hyena'): Crocuta crocuta spelaea (genome read from bone,
Westbury et al. 2020; made on the spotted hyena), 0.90 m at the shoulder falling to a 0.70 m rump: THE SLOPE; a heavy neck and
shoulders under a low dark mane, a big blunt head, ROUND ears, round dark spots (a jittered 3D grid, about 6 cm), dark stockings and
face, a short tail with a black brush; the hyena's own colours kept (the 10/18 hold). Its rule set is Battle Brothers' hyena (the
wiki row it rides: the bite that bleeds; it takes the weak at the edge). The lab mark sized to read from the fight's camera: a big
yellow ear tag with dark digits and a shaved, stitched shoulder patch. VOTE beasts2-the-cave-hyena-own-body-11-3.

## PIECE 2: THE BULL, THE CAMEL, THE LION AND THE HOG INTO THE BEAST FIGHTS
Data first, the fight's code untouched (COMBAT 7's):
- records/target/bb/bohemia_enemies.json: three one-animal beast parties beside the five: 'wolves' (Battle Brothers' direwolf pack,
  frenzied late), 'hyenas' (the hyena, frenzied late), 'dogs' (the war dogs: wardog, warhound, the armoured one later). A beast
  party is one animal, never the old wolf-and-hyena mix.
- records/target/BOHEMIA_JOB_KINDS.json: beasts_by_ground (a ground's beasts and their weights; WORLD's grounds) and beast_looks
  (the sheet each faction is drawn from on the map, its words). The offers that name their animal now deal it: 'the wolves' wolves,
  'the dogs' and the two dog camps dogs, 'the hyenas' hyenas, 'the show's cats' the lion (the closest body we have to the Strip's
  show tigers and lions; a big cat), the big game's OLD LION the lion (it was a dire wolf labelled 'the lab lion').
- slices/bohemia_job_kinds.js: a job whose foe is 'beasts' meets the beasts of the ground its fight is on (one answer per job, so
  the map, the meet card and the fight agree); each hunt pack is the beasts of the ground it roams; every beast faction is fought as
  beasts; the map draws each beast from its own sheet with its cell read from the fight's index (no typed sizes). The ground is
  read through the danger engine the map already runs, asked for as the map comes up.
- slices/bohemia_job_danger.js: the meet card names each animal (COYOTES, BULL, CAMELS, LION, HOGS, DOGS), draft:true.

THE RULE SETS (mechanic first, the 9/29 law s6; each already built in FIVE MORE BEASTS and named here): THE BULL rides the unhold
(Sweep as the horns) with its own charge (Battle Brothers' Ijirok gore: a straight run that knocks a man flat); CAMELOPS the unhold
(Sweep as the kick: every man beside it knocked a tile back); THE MOUNTAIN LION the serpent (the bite and the grab: it waits unseen,
springs and pins); THE HOG the hyena (the bite as the tusk, the gash that bleeds); the dogs Battle Brothers' war dogs; the wolves the
direwolf; the hyenas the hyena.

MEASURED, the fight: tools/bohemia_beasts_every_party_its_own_animal_probe.js opens the real fight on his phone with each beast
party ({faction, count 4}): all 8 deal their own animal, each drawn from its own sheet (no fallback to the dire wolf), 0 page errors.
MEASURED, the map: the real map page, a hunt planned at 121 places (363 packs): hyenas 70, dogs 76, bulls 46, wolves 44, hogs 37,
lions 33, coyotes 33, camels 24; wolves, dogs and coyotes together 42 in 100 (was 100 in 100 wolves and hyenas). The first pass
measured 66 in 100 canids because most of the map is streets: the streets' tables were rebalanced so the lab's hyenas, the edge's
bulls and hogs and the Strip's show cats walk the city too. No ground's table is only canids.
Gates run: THE BOARDS ALWAYS HAVE WORK 24/0, A JOB PAYS FOR THE TIME AND THE RISK 23/0.
VOTE beasts2-the-beasts-into-the-fight-11-3 (slices/vote/BEASTS_INTO_THE_FIGHT.html): WAS the old beast fight beside the bull, the
camel, the lion and the hogs each on their ground, real fights on his phone with his four men for scale, and the measured table.

NAMED FOR COMBAT (not this lane's file): the fight's turn strip draws every beast's face as one red wolf-head glyph (BOHEMIA_FIGHT.html,
'a crop of its body is never a portrait', rule 115(h)), so the bar under a lion or a hog shows a wolf's head.

## PIECE 3: THE SHORT-FACED BEAR AND THE SHASTA GROUND SLOTH, ON THE UNHOLD
Two outlines nothing else in the game has, on the builder:
- THE SHORT-FACED BEAR (Arctodus simus; its mitogenome read from bone, Mitchell et al. 2016; made on the brown bear, the right size):
  1.55 m at the shoulder on all fours (built 1.60 with the hump), 2.4 m nose to rump, long legs for a bear, a short broad face with a
  pale muzzle, small round ears, the shoulder hump, big paws; dark brown, grizzled over the back. The lab mark: a thick collar with
  its box and a big numbered ear tag. It paces (a bear's amble) and its attack is the MAUL: back on the haunches, up on the hind legs,
  the forearm swung down, the bite held.
- THE SHASTA GROUND SLOTH (Nothrotheriops shastensis; Gypsum Cave, a few miles from the Strip, kept its dung and its DNA was read
  from it, Poinar et al. 1998). NAMED HONESTLY: its living kin are 4 to 8 kg tree sloths, so the 9/29 law's surrogate test fails (the
  five-beasts round skipped it for that); rule 345 amended (a) names it, newest wins, so the record says the lab grew it in its own
  womb (the 2017 lamb in a bag, made huge): the one beast in the valley no mother carried. Built: 0.94 m at the shoulder and 1.30 at
  the hip (the hips over the shoulders), 2.3 m with the tail, a wide pelvis, a thick tail to the ground, a small head on a longer neck
  carried low, long forelegs on the knuckles with three great claws each (tube meshes, ivory), shaggy warm brown. The lab mark: a big
  numbered ear tag and a shaved, stitched hip patch. It walks slowly and mauls.
- Pass by eye: the first coats read grey (the rig's dust pass bleaches a mid brown on a big up-facing body), so both went deeper and
  warmer; the first bear read as a sheep (body too wide, legs too thick, head small and high): leaner body, longer legs, a bigger
  lower head; the first sloth's hips were too wide (0.9 m): narrower and higher.
THE RULE SET (mechanic first): Battle Brothers' UNHOLD (bb_all/0146_Armored Unhold.txt): REGENERATION, 15% of its hitpoints at the start
of each turn (bb_all/1661_Regeneration.txt), and FLING BACK, 4 AP and 20 fatigue, the man beside it tossed onto the tile behind it with
10 fatigue and falling damage (bb_all/0794_Fling Back (20 fatigue).txt); always on a man it can finish (10 hitpoints or less, the
unhold's own page), else 35 in 100 (ours, draft); the falling damage 5 to 10 is ours (the page gives no number). Rows, the brain
'unhold', the numbers regenerate and fling, the parties bears and sloths (one animal each), the road (act 1 to 3: 0.1 to 0.3; the bear
more at night) and the jobs (the hills and the open desert: near the fossil beds) are all in records/target/bb/bohemia_enemies.json and
BOHEMIA_JOB_KINDS.json. The fight got two small hooks, both reading that data (slices/BOHEMIA_FIGHT.html beginTurn: the heal; fling()
beside kickAll, and one line in the brain step): COMBAT 7's file, kept to that.
MEASURED: both parties deal their own animal from their own sheet (the probe, 0 errors); six AUTO fights against four of his men: the
bear healed 21 times and threw 14 men, the sloth healed 37 times and threw 17; the bear won one of three, the sloth one of three.
VOTE beasts2-the-bear-and-the-sloth-11-3 (slices/vote/BEASTS_THE_BEAR_AND_THE_SLOTH.html): WAS the dire wolf (what the fossil beds
dealt), the man, NOW, and the line-up.

## PIECE 4: THE SABRE-TOOTH, THE AMERICAN LION, THE ANCIENT BISON, THE ICE AGE HORSE
On the builder, each its own outline (rule 345 amended (a)), each on a Battle Brothers rule set (mechanic first; where Battle Brothers
has no such beast, the closest rule and its lesson, named):
| beast | built (shoulder / hip / long, m) | the real animal (DNA) | its outline | rule set |
|---|---|---|---|---|
| SABRE-TOOTH | 1.08 / 0.88 / 1.86 | Smilodon fatalis, genome from bone (Paijmans et al. 2017), on the largest cats | massive forelegs and neck, the back falling to a BOB TAIL, the two SABRES past the chin, faint spots | NO BB beast: the serpent's wait, spring and pin (the mountain lion's) WITH the hyena's bleeding bite: brain 'ambusher' |
| AMERICAN LION | 1.19 / 1.20 / 2.92 | Panthera atrox, DNA from bone (Barnett et al. 2009, 2016), on the African lion | a quarter over any lion alive, long legs, NO mane, a long tail with a dark tuft | BB's direwolf PACK: a pride of two or three that goes round you for the weak one: brain 'pride' |
| ANCIENT BISON | 2.0 at the hump / 1.57 / 2.76 | Bison antiquus, Tule Springs bone, on the plains bison | the huge hump, the head carried LOW, a shaggy dark front and beard, wide horns curving up, slim hindquarters | BB's Ijirok GORE, the bull's charge (brain 'charger') |
| ICE AGE HORSE | 1.55 at the withers with the mane / 1.42 / 2.23 | Equus, Tule Springs and Gypsum Cave bone; Ice Age horse genomes (Orlando et al. 2013), on a horse | stocky, dun, dark legs, an UPRIGHT dark mane, a dark stripe down the back, a long head | NO BB beast: the unhold's Sweep as the camel's kick, and it runs hurt (brain 'kicker') |
The lab marks: big numbered ear tags (all but the horse), the sabre-tooth's stitched shoulder patch, the American lion's lab collar,
the bison's white freeze-brand numerals on the hip, the horse's white freeze mark on the left of the neck (the mark real wild horses
carry). Places (BOHEMIA_JOB_KINDS.json and the road): the sabre-tooth and the lions in the rocks (the hills), the lions and the bison
and the horses on the open desert, the bison on the golf courses' grass, the horses on the solar fields and the airport's flats; the
road by act (more in act two and three) and the cats more at night. Pass by eye: the bison's hump read as a ball set on its back:
blended longer and lower into the shoulders.

## RULE 359, THE CHEAP CLONE (Paolo 11/3, laws/BOHEMIA_LAW_THE_CHEAP_CLONE_11_3_26.md), FOLDED IN
- THE BATCH (one pack, one face): MEASURED, every animal in a beast party is drawn from its faction's ONE sheet, so a pack from one
  line already has one face, the same markings, the same plate and the same number on every animal. Nothing was built for it, and
  it is named so no later round 'fixes' it with variety: a batch's sameness is the horror. (A second batch with its own face is a new
  sheet and a new party, never a random tint.)
- THE MARKS: piece 5 below (the lab's collar plate on every lab beast, the farm's lime tag on the bull and the hog instead).
- THE WATER: records/target/bb/bohemia_enemies.json 'water': the valley's waters (the Wash, the lake shore, the springs, the
  guzzlers, the golf ponds, the fountains, the pools, the mains, each said as the law says it) and every beast party's waters, the
  first where it is found most, with what the real animal drinks (a pig cannot sweat and never leaves the wallow; a camel goes a week
  and then drinks over 100 litres; a bull 40 to 80 litres a day; a horse 25 to 45; a bison 30 to 40, once a day, in a herd). For
  WORLD [creatures] to put them there. Gate leg B7 holds it.

## PIECE 5: THE LAB MARK READS FROM THE FIGHT'S CAMERA (rule 345 amended (d), rule 359 (2))
MEASURED FIRST: the ear tags (even the big ones of pieces 1, 3 and 4) rendered 0 to 3 dull pixels: a small thing on the side of an
ear, seen from 45 degrees above, desaturated by the rig's own wear pass; and the sheet's 64-colour pack (median cut) merged what was
left into the coat. A mark nobody can see is not a mark.
AT THE SOURCE:
- THE LAB COLLAR'S PLATE on the NAPE, the top of the neck the camera looks down on, in HI-VIS YELLOW-GREEN (a safety vest's colour:
  no fur on any animal is it, so it reads on the white wolf, the sand camel and the black bison alike), with a dark number down its
  middle and the collar's dark band round the neck; sized to the animal. The plate finds the neck's real top surface (measured: set
  at the neck's half-depth it was buried under the bear's and the bison's humps and the sloth's shoulders, 0 pixels).
- THE FARM TAG instead on the feral bull and the hog (rule 359: range and farm animals, not the lab's): big and lime, the colour
  real cattle tags come in; the hog wears one in each ear (its ears are small: one tag read 0 pixels).
- THE PACK KEEPS THE MARK'S COLOUR: tools/bohemia_factions_five_more_beasts.py pack() gives the hi-vis pixels (green over red, far over
  blue: no coat is that) a palette entry of their own, so the 64 colours never merge the mark into the fur.
- The old marks stay where they were (the stitched patches, the camel's blood-draw patch, the freeze brands): they are the close look.
MEASURED on the fight's own sheets (the standing picture, hi-vis pixels, facings S SE E NE N NW W SW; before: 0 in every facing):
| beast | pixels per facing |
|---|---|
| dire wolf | 14 18 21 22 20 19 19 17 |
| cave hyena | 26 28 25 24 20 23 24 29 |
| camelops | 18 55 56 63 59 53 54 63 |
| short faced bear | 80 72 51 33 25 37 58 79 |
| ground sloth | 35 32 24 20 12 14 26 36 |
| sabre tooth | 26 31 35 34 28 34 30 31 |
| american lion | 30 38 48 54 52 55 45 39 |
| ancient bison | 27 28 19 6 5 7 19 26 |
| ice age horse | 16 30 46 47 59 51 46 29 |
| feral bull | 9 0 0 0 24 25 33 21 |
| feral hog | 31 28 20 8 0 9 21 28 |

## PIECE 6: THE GATE (rule 345 amended (f)), IN THE SUITE
gates/every_beast_its_own_outline_gate.py, registered in gates/bohemia_gates.py as EVERY BEAST ITS OWN OUTLINE (python, seconds, no
browser). Its legs and what each was measured against are in its header: B1 every beast kind a beast party can deal has its own
picture (it found the late beasts mix's SCHRAT drawn as the dire wolf: the walking tree breaks rule 345 (a)'s 'real DNA only', so it is
out of ours.enemy_tiers.mix.beasts.late and records/target/bb/roster.json says why; its lesson, it heals, lives in the bear and the
sloth, and the roster's unhold row is now in the fight); B2 no two animals share a sheet; B3 every pair differs by OUTLINE: each
silhouette cut to its box and scaled to one height (a SHAPE: a stretched fox is a fox at any size), E and SE, 1 - overlap/union, the
floor 0.20 MEASURED between the old fox cast's closest pair (the dire wolf and the feral dog, 0.16, the control leg that must fail) and
the rebuilt cast's closest (the cave hyena and the sabre-tooth, 0.23); a first version compared the silhouettes at their fight sizes
and passed the old fox cast too (it measured size, not shape), so it was thrown out; B4 no ground is only canids; B5 the map types no
beast cell size; B6 every mark reads (6+ pixels in 4+ of 8 facings; the unmarked rows the plant); B7 every beast lives at a water.

## NEXT
Nothing on the list is open. His verdicts on the cards decide the next pass. Named for COMBAT: the turn strip's one red wolf-head
glyph for every beast (rule 115(h)).
