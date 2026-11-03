# FACTIONS (written only by the FACTIONS lane)

## FACTIONS (BEASTS 2), 11/3/26: THE LAB BEASTS ALL LOOK LIKE A COYOTE (rule 345 AMENDED, ask line 381), RUNNING
His words: 'maybe the beasts can look better, the lab beasts that got out, everything's looking like a fucking coyote'. Record of the
job: records/BOHEMIA_PAOLO_THE_LAB_BEASTS_ALL_LOOK_LIKE_A_COYOTE_11_3_26.md. MEASURED (rule 12): the road can roll the five
(coyotes, lions, hogs, camels, bulls; by act, ground and night through the fight's roadOpts, which the map's job_danger roll runs),
but the 'beasts' party (ours.enemy_tiers.mix.beasts) and the hunt jobs (bohemia_job_kinds.js BEAST_META) deal only wolves and
hyenas, so the beast fights he plays are dogs.
- PIECE 1 SHIPPED, BUILD 11/3zzzh: the cave hyena its own body on the builder (sloped back, heavy neck under a mane, round ears,
  spots, a big yellow numbered ear tag and a stitched shoulder patch). VOTE beasts2-the-cave-hyena-own-body-11-3 (slices/vote/BEASTS_THE_CAVE_HYENA.html, the card on the hyena).
- PIECE 2 SHIPPED (de92f6fc, BUILD 11/3zzzi): no beast fight is always dogs. bohemia_enemies.json's one-animal parties (wolves, hyenas,
  dogs); BOHEMIA_JOB_KINDS.json beasts_by_ground and beast_looks, the named offers deal their animal; bohemia_job_kinds.js picks a
  'beasts' job's animal by the ground its fight is on and draws each beast from its own sheet with its cell read from the fight's
  index (the typed sizes had gone stale). Probe tools/bohemia_beasts_every_party_its_own_animal_probe.js 8/8. VOTE
  beasts2-the-beasts-into-the-fight-11-3. Record records/BOHEMIA_BEASTS_THE_LAB_BEASTS_NOT_A_COYOTE_11_3_26.md.
- NEXT, in order: (3) the
  short-faced bear and the Shasta ground sloth as the unhold, (4) the sabre-tooth, the American lion, the ancient bison, the Ice Age
  horse, (5) every lab mark readable from the fight's camera, (6) the gate (own sheet each, outline differs past a floor, no place
  only canids). COMBAT 7 owns BOHEMIA_FIGHT.html: this lane works in the data and the sheets.

## FACTIONS (BEASTS 2), 11/3/26: EVERY BEAST ITS OWN BODY (rule 345, ask line 354), BUILD 11/3zzy (the bull) and 11/3zzza (the six)
Record: records/BOHEMIA_BEASTS_EVERY_BEAST_ITS_OWN_BODY_11_3_26.md. His words on THE FERAL BULL: 'They look wayyy to similar to the
og coyote the wolf actually'. Measured: every rig beast was the Khronos Fox's one mesh stretched.
- THE BUILDER: tools/bohemia_beasts_every_beast_its_own_body.py keeps only the Fox's skeleton; each animal's body is grown from its
  real measures in metres (metaball anatomy, calibrated), its bones moved to its own joints, its skin weighted by the part each
  vertex grew from, its own 24-frame walk on its own gait (GAITS, STRIDE), its own attack (ATTACKS), its coat painted from the 3D
  shape with its mark (tags, the camel's stitched neck patch, the lion's GPS collar, the coyote's mange, the dog's collar). Then the
  five-beasts tool's pose / render / pack (bpy 4.2 in a python3.11 venv; a beast is 2 to 6 minutes at 24 samples on 2 cores).
  `<venv>/bin/python tools/bohemia_beasts_every_beast_its_own_body.py model|pose|render <name>` then `pack <a,b,...>`; models in
  reference/models/bohemia/own_body/, the measures in records/target/beasts_own_body/<name>_audit.json.
- SHIPPED: the bull (559517cb), Camelops, the mountain lion, the feral hog, the coyote, the dire wolf, the feral dog (f7346a72), each
  in the fight's own sheet under its old look name (nothing in the fight's rules or data changed).
- VOTE: one card, beasts2-every-beast-its-own-body-11-3 (slices/vote/BEASTS_EVERY_BEAST_ITS_OWN_BODY.html): WAS beside a man of
  ours beside NOW for each, a line-up of all seven, every beast's eight facings. The old sheets' SE rows are kept in
  slices/vote/beasts_was/ for it.
WHAT IS LEFT (no Paolo needed): the cave hyena is still the Fox reshape (not in his note); ANIMATION may refine the walk and attack
tables; his verdict on the card decides the next pass.

## FACTIONS (BEASTS), 11/3/26: FIVE MORE BEASTS THAT CAN REALLY LIVE IN THE MOJAVE (ask line 343), BUILD 11/3zzb
Record: records/BOHEMIA_FACTIONS_FIVE_MORE_BEASTS_11_3_26.md (the Mojave test with sources, the mammoth answered, what shipped).
- THE FIVE, each through the rig in eight facings (tools/bohemia_factions_five_more_beasts.py: the Fox reshaped by the hyena tool's
  reshape plus our NECK, HUMP and HORNS, the coat from the 3D shape, the poses tool's Hit and Fall, DIRECTION's master rig, packed
  into slices/fight_rig/beast_<x>.webp and merged into fight_rig.json): COYOTE (eats the dead), MOUNTAIN LION (hides, waits, jumps
  and pins; it CLIMBS roofs), FERAL HOG (the gash bleeds; water ground only), CAMELOPS (kicks every man beside it), FERAL BULL
  (charges 2 to 4 tiles down a straight line, knocks flat).
- THE DATA in records/target/bb/bohemia_enemies.json (5 factions, 5 rows on their wiki twins: Wolf, Serpent, Hyena, Unhold, Unhold;
  5 brains; numbers gash, kick, charge, feed, lurk.wait_rounds; mix, count_scale, the road's by_act, holds and night). The fight
  folds the beast block in (ownEnemies: rig look, attack page, climbs) and builds the rules (slices/BOHEMIA_FIGHT.html beastLanded,
  kickAll, charge, feed, the lion's wait; cannotClimb reads ours.climbers.climbs).
- Skipped and why: the Shasta ground sloth (no living mother its size), the golden eagle and the Gila monster (they do not fight a
  crew). The mammoth: only at Lake Mead's shore, act three at the earliest.
- PROOF: tools/bohemia_factions_five_more_beasts_shots.js (his phone upright, four of his men): every rule fired, page errors 0
  (records/target/factions_five_beasts/shots.json). VOTE: five items, slices/vote/FACTIONS_FIVE_MORE_BEASTS.html#<beast>.
WHAT IS LEFT (no Paolo needed): the camel's N, NE and NW stills read thin (a camel from behind is thin; three passes, stopped); a
kick clip and a horn-hook clip (the bite stands in) are ANIMATION's; the map's own 'beasts' mix could take the five by act (COMBAT);
prices for hide, meat, camel milk and a live Gila monster (ECONOMY); words draft:true (WORDS); numbers tuned:false (TUNING).
Render cost: bpy 4.2 in a python3.11 venv; a beast is about 5 minutes on one core (the camel 15).
