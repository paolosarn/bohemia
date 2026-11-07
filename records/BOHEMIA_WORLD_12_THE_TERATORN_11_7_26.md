# WORLD 12: THE TERATORN, ONE MORE BEAST (11/7/26)

VAMILY rule 431(e)(f), ask lines 516 and 517. BUILD 11/7z THE TERATORN, ONE MORE BEAST.

## WHAT HE SAID
- 431 (Paolo 11/7): 'I thought they would be like an enemy type... you made it like this weird map virtue signaling shit'.
- 431(e), his answer B: 'for the vultures, B': the vulture is an enemy, a lab-made beast by the beast law.
- 431(f), simpler, his word: 'just another animal we can fight'. The coordinator: one more beast in the roster, met and
  fought the way the other beasts are; no raids on the dead, no camp attacks, no special flight rules, NO MAP SIGN; it
  looks like a vulture (the bald red head, the ruff, the long fingered wings) at every size, or it does not ship.
  (f) wins over (e) where they differ.

## WHAT IT IS (the beast law, laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md)
- Teratornis incredibilis, the giant teratorn, named by Hildegarde Howard (1952) from Smith Creek Cave in Nevada's own
  Snake Range. Its cousin T. merriami (the La Brea tar pits) stood about 75 cm and spanned 3.5 to 3.8 m, about 14 kg.
  The coordinator's 'about four metres of wing' is the span built. A California condor is the surrogate (the egg, the
  size, the bald head). The lab tagged its wings the way the condor people tag theirs (a hi-vis wing tag with a number,
  the green lab mark of every beast). Never radiation.
- Built: 4.0 m span, 0.87 m standing on the sheet (inside the gate's 0.7 to 1.2 m), 15 to 25 kg.

## WHAT WAS BUILT
1. THE BODY (tools/bohemia_world12_the_teratorn.py, model reference/models/bohemia/own_body/teratorn.glb): 26 bones
   (body, neck, head, two legs, each wing upper arm, forearm, hand and seven primaries fingered out), dark feathers
   in three shades with a silver bar on the wing, a pale ruff, a bald red head and neck with a caruncle, a pale hooked
   beak; four moves on the DIRECTION master rig's clip shape: WALK 6 (the hop-step, wings half open for balance), BITE 6
   (the wings thrown out to 3.4 m, the head down and striking), HIT 2, FALL 3 (prone, wings sprawled, nothing through
   the ground). Materials carry the style guide's hair/skin names so the rig's dust does not grey the bird.
2. THE SHEET (the DIRECTION master rig, patched in memory for a bird's span): slices/fight_rig/beast_teratorn.webp,
   8 facings x 18 frames (stand 0, walk 1-6, bite 7-12, hit 13-14, fall 15-17), 300 x 253 cells, 64 colours and the rim
   like every beast; the fight's index entry beast_teratorn; packed by the demo cut. The renders and the rig's crop box
   come back from the tool into records/target/combat/rig/beast_teratorn/ (git-ignored like every beast's); the strip and the ruler beside the wolf and a man in
   records/target/world12_teratorn/.
3. THE ROSTER (data a modder edits, no code): records/target/bb/bohemia_enemies.json: the faction teratorns (beast:
   true), the row teratorn from the wolf with the coyote's own brain (scavenger), board name TERATORN, hp 70, init 125,
   melee 55, both defences 15, resolve 30, xp 80, Pathfinder; habitat the open desert, the hills, the landfill, the Wash;
   the mix, a flock at 0.6 of a pack's count, the road by act (0.3, 0.4, 0.4), the water it lives at.
   records/target/BOHEMIA_JOB_KINDS.json: the map's look (beast_teratorn, a flock up to 5) and its grounds (open desert 1,
   hills 1, landfill 2, the Wash 1, the freeway 1). records/target/bb/carcass.json: the kill (TERATORN, 20 kg). The roster
   page (records/target/bb/roster.json) regenerated.
4. THE TWO NAME TABLES, the only code that says teratorn: the danger card's name (slices/bohemia_job_danger.js) and the
   fight's 'who they are' line (slices/BOHEMIA_FIGHT.html). Everything else is data.

## WHAT WAS NOT BUILT (431(f) dropped it)
- No going for the dead, no camp attacks, no flight over walls, no map sign. The map's cap
  (records/target/bb/map_ambient.json) holds the vulture and the lair birds at 0 at once and 0 a minute, and the gate
  goes red if either comes back.

## VERIFIED ON THE PHONE (the demo, phone held up, gates/the_teratorn_is_one_more_beast_fight.js)
- A flock of three through the one door is fielded as three TERATORN units, look beast_teratorn, hp 70, on their own
  sheet (5400 px wide, 18 cells of 300).
- The win leaves a teratorn kill on the map in its own picture; one tap: food up and one roll of hides in the stash.
- The feed said 'the Night Shift beat teratorns at the casinos' on its own.

## THE GATE
gates/the_teratorn_is_one_more_beast_gate.py --plant (suite: THE TERATORN IS ONE MORE BEAST): T1 the sheet, T2 it reads
as a vulture at every size (the red head in 8 of 8 facings, the ruff in 8, the body dark, the bite over twice its
standing width, the red head and the ruff still there at the map's half, third and fifth), T3 one more beast (an existing
brain, no key the other beasts' rows lack, every table), T4 no code names it but the two name tables and no vulture on the
map, T5 in the fight, R nothing threw. Plants: the head painted black (T2 red), a new brain and a 'flies' key (T3 red),
three vultures back on the map's cap (T4 red). 7 passed, 0 failed, every plant caught.
Also green with it: THE BESTIARY, EVERY BEAST ITS OWN OUTLINE (11/0), THE ROSTER fresh, THE KILL GOES IN THE STASH,
THE MAP LIVES UNDER A CAP.

## STAGE
STAND-IN: the first cut of the picture. DIRECTION's golden-piece bar (the reference check against the style guide and
his ruled beasts) has not been run on it; the card says so.

## FOR OTHER LANES (not changed here)
- UI: the fight panel's beast icon is the same fox head for every beast (the teratorn shows a fox, as the bear and the
  lion do). A per-beast icon is UI's.
- TUNING: the teratorn's numbers are the coyote's shape scaled to a 20 kg bird, draft:true, TUNING's to move.
- DIRECTION: a golden pass on the sheet when its turn comes.

## [bb] RESEARCH LINE
Battle Brothers keeps every beast a row of numbers plus a brain the others share (the Nachzehrer's 'Gruesome Feast',
bb_all/0925_Gruesome Feast (25 fatigue).txt, is the one that eats the dead; its numbers the Wolf's, bb_all/2230_Wolf.txt).
The teratorn is that lesson: one more row, a shared brain, no new rule.

## ANALOG HORROR LINE
A real wing tag, still numbered, on a bird the size of a man: the lab's paperwork outlived the lab.
