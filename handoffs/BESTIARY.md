# BESTIARY (one file per lane, written only by BESTIARY; newest block on top)

BESTIARY (rule 440(f), ask line 539): 11/9 LATEST -- BUILD 11/9k - FIVE LAB BEASTS (77eebb02), BUILT, NOT YET SEEN.
Record: records/BOHEMIA_BESTIARY_THE_LAB_SEVEN_11_9_26.md. VOTE bestiary-five-lab-beasts-11-9 (stage stand_in).
- THE COUNT, MEASURED: roster.json's 'beasts: 17' counted Battle Brothers' archetype names (13 with no animal in the fight). The fight
  fielded 15 animals, 10 of them lab-made. Now: 20 animals fielded, 15 lab-made (14 from Nevada's own fossils), 5 living animals loose
  in the valley (law s3). Factions 12 (the fight fields 8). Types 157 in the roster, 47 the fight fields (UNDER his 75: the next gap).
  Bosses 6 staged. Champions 3 dealt.
- THE GATE THE LAW OWED: gates/the_bestiary_floor_gate.py, THE BESTIARY FLOOR, registered, 10/0 with five plants caught (one beast
  removed, a beast of unknown origin, a beast with no fossil, a new brain with a flies key, the stilt horse on the Ice Age horse's sheet).
  Ratchets: LAB_MADE_NOW 15 (17 with the bison and the shrub-ox), TYPES_IN_THE_FIGHT_FLOOR 47.
- THE FIVE IN THE FIGHT (records/target/bb/lab_beasts.json is the lab's book; rows, parties, waters, road in bohemia_enemies.json):
  American cheetah (Crypt Cave; pride; a giant), Harrington's goat (Smith Creek Cave; charger, climbs), stilt-legged horse (Gypsum
  Cave; coward), Ice Age jaguar (Kurten's Nevada record; stalker, climbs; a giant), large-headed llama (Tule Springs; kicker). Art: tools/bohemia_bestiary_the_lab_seven.py (the own-body pipe, 7 animals added) ->
  slices/fight_rig/beast_<x>.webp + packed. Names: slices/bohemia_job_danger.js, slices/BOHEMIA_FIGHT.html THEY_ARE.
- TWO WAIT FOR ROOM: the long-horned bison (Bison latifrons, Tule Springs cf.; 2.1 MB) and the shrub-ox (Euceratherium, the Lake
  Winnemucca caves; 1.1 MB) are modelled (reference/models/bohemia/own_body/) and specced in the tool; the site sat at 896.6 of its 900 MB
  cap and the five took it to 899. TO LAND EACH (the shrub-ox's row and data are in b039de6f's tree; the bison's values below):
  bpy venv (python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow), then `v/bin/python tools/bohemia_bestiary_the_lab_seven.py
  model,pose,render long_horned_bison` (each a command; render about 4 min), `python3 tools/bohemia_bestiary_the_lab_seven.py pack
  long_horned_bison`, `python3 tools/bohemia_run_the_sheets_packed.py`; put its faction 'longhorns', row, mix, water, count_scale 0.15,
  road [0.03, 0.06, 0.1], carcass (1900 kg), beast_looks + giants, the two name tables back (the record's section 3 and the first
  batch's diff hold every value); move it from lab_beasts.json 'waiting' to 'beasts'; raise LAB_MADE_NOW. Needs PLUMBER's room first (3.3 MB for both).
- ROUTED: PLUMBER the room (records/target/COOK2_ONE_REAL_STREET.webp 7.6 MB published only as the style guide's reference twin; old
  tab pages); TUNING the drafts; WORLD 14 / WORLD 12 the teratorn gate's T4 (red on main since 64380f14, slices/bohemia_place_visits.js's
  fallback regex); COMBAT / FACTIONS the 48-of-75 types; DIRECTION the golden check; WORDS the names and lines.
- GATES (rule 13, pre-push): THE BESTIARY FLOOR 10/0, EVERY BEAST ITS OWN OUTLINE 11/0, THE BESTIARY 10/0, WAY MORE QUESTS NOT ALL
  HUNTS 7/0, COMBAT SCALE 8/0, PAGES PUBLISH 28/0 (899 MB); THE NEW ENEMIES 8/4 (the same four as main); THE TERATORN 6/1 (T4, main's).
[bb Battle Brothers' 17 beasts include its variants and its ghosts; ours counts animals, each on its own sheet, lab-made by the law.]
[analog horror: the hi-vis plate on the nape, the shaved and stitched sample patch, the numbered collar; the rumours in the feed.]
