# THE LAB BEASTS ALL LOOK LIKE A COYOTE (Paolo 11/3; VAMILY rule 345 AMENDED; ask line 381)

## HIS WORDS (verbatim, transcription kept)
"maybe the beasts can look better the lab beasts that got out everythings looking like a fucking coyote"

## WHAT THE COORDINATOR FOUND (measured, not guessed)
- BEASTS 2 shipped seven new bodies this stretch (BUILD 11/3zzy and 11/3zzza): the feral bull, Camelops, the mountain lion, the feral
  hog, the coyote, the dire wolf, the feral dog. The coordinator looked at the VOTE card's line-up: the bull, the camel, the lion and
  the hog now read as their own animals. The coyote, the feral dog and the dire wolf are still three brown-and-grey dogs at fight size.
- THE ROOT CAUSE: the fight only ever draws three beast pictures. records/target/bb/ours.json beast_rig_looks maps every beast row the
  fight can spawn (direwolf, frenzied_direwolf, wolf, goblin_wolf, hyena, frenzied_hyena, wardog, armored_wardog, warhound) to
  beast_dire_wolf, beast_cave_hyena or beast_feral_dog_shepherd, and BOHEMIA_FIGHT.html rigBeast() falls back to the dire wolf for
  anything else. The jobs (bohemia_job_kinds.js BEAST_META) know only the wolf and the hyena.
- THE CAVE HYENA IS STILL THE FOX (the Khronos Fox reshape); BEASTS 2's record says so. It is one of the two beasts you meet most.
- SO: every beast fight he plays is dogs, and one of them is a fox. The bull, the camel, the lion and the hog exist and no fight
  uses them. The lab's real Ice Age animals with their own shapes (rule 9/29: horse, American lion, sabre-tooth, short-faced bear,
  ground sloth, ancient bison) are not built at all.
- The roster (records/target/bb/roster.json): of Battle Brothers' 17 beasts, 5 are in the fight; the unhold (skin: "the short-faced
  bear or the ground sloth") is not.

## THE LAW (rule 345 AMENDED, his words)
1. THE LAB BEASTS LOOK LIKE LAB BEASTS: the animals that broke out of the lab are the valley's own Ice Age dead brought back (the 9/29
   law), and they must look like nothing on the street. Big, wrong-sized, strange outlines a player has never seen walk: the
   short-faced bear, the Shasta ground sloth (real: Gypsum Cave, a few miles from the Strip, kept its dung and its DNA), the
   sabre-tooth, the American lion, Camelops, the ancient bison, the Ice Age horse. Real DNA only, no mutants, nothing glowing.
2. NO FIGHT IS ALWAYS DOGS: what you meet comes from the place (WORLD [creatures]): the bull and the hog at the farms and the edges,
   the camel and the bison on the open desert, the lion and the sabre-tooth in the rocks, the bear and the sloth near the fossil beds,
   the dogs in the streets. A canid is one choice among many, never the default.
3. THE CAVE HYENA GETS ITS OWN BODY: the sloped back, the heavy neck and shoulders, the round ears, the spots. It is in the fight now.
4. THE LAB MARK READS FROM THE FIGHT'S CAMERA, at the source (analog horror): a numbered ear tag, a shaved and stitched patch, a lab
   collar, read at phone size, not a detail you need a zoom for.
5. MECHANIC FIRST, SKIN SECOND (the 9/29 law s6): each body rides a Battle Brothers beast rule set from the roster (the bear or the
   sloth is the unhold: it regenerates and throws; the hyena takes the weak at the edge; the wolves flank). Where a new body has no
   Battle Brothers beast, it takes the closest rule and the record names its lesson.
6. THE GATE: (a) every beast the fight can draw has its own picture (no two beast rows of different animals share one sheet, no
   fallback to the dire wolf); (b) every pair of beasts differs by outline at fight size past a floor (the silhouette measured, not
   the colour); (c) no place's beast table is only canids.

## THE LANES
- BEASTS 2 (session_01GKDyut6CrksXEJ4oNNLX7H), after its push lands: the hyena's own body; the bull, camel, lion and hog into the
  fight (their rows, their rule sets, the look map); the short-faced bear and the ground sloth as the unhold; then the sabre-tooth,
  the American lion, the bison and the horse; the lab marks; the gate. Worst first: the hyena (you meet it now), then the bear and the
  sloth (the shapes nothing else has).
- COMBAT 7 keeps the fight's code; BEASTS 2 works in the data (ours.json, roster.json, the sheets, the job kinds' beast list) and
  rebases carefully if it must touch the fight file.
- [bb] Battle Brothers' beasts each have their own outline at a glance (the unhold's mass, the nachzehrer's hunch, the direwolf's
  lean): a player names the enemy before reading a word. That is the floor.
