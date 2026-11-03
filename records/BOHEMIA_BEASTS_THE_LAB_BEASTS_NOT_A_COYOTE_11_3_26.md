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

## NEXT (in order)
4. The sabre-tooth, the American lion, the ancient bison, the Ice Age horse. 5. Every lab mark readable from the fight's camera.
6. The gate in the suite.
