# THE SITE IS WHAT THE GAME LOADS (PLUMBER 5, chat 18b, 11/6/26; rule 411's round; ask lines 462 and 463)

## THE ANSWER IN FIVE LINES (for him, eighth grade)
- The website had grown to 1,858 MB. GitHub's limit is 1 GB and it gives a deploy ten minutes; 3 of the last 8 deploys ran out of time and died.
- Most of it was never loaded: old VOTE cards he already judged (763 of 938), old judge pictures, render notes.
- Now the deploy publishes only what the game, the demo and the VOTE tab actually ask for: 831 MB, about 16,200 files instead of 32,000.
- A new checker plays the game on a server that only has those files. Nothing the game asked for was missing.
- Getting under 260 MB is not possible without cutting the game's own art (the fight boards, the men, the towns are about 530 MB).

## THE MEASURE (on ce14b189, before)
- Published: slices/ 939 MB, records/target 912 MB, engine 7 MB = 1,858 MB, 32,040 files (pages.yml copied the three folders whole).
- gates/pages_publish_gate.js: red, 260 MB cap, measured 1,781 to 1,858 MB.
- The last 8 `pages` runs: 5 SUCCESS at 4 to 5 minutes; 3 FAILURE (4270 0019d67b, 4272 d52cbebc, 4274 0865dda7) at 12 to 13 minutes, dying at actions/deploy-pages' 10-minute timeout.
- The VOTE tab: 938 cards, 763 judged (a judged card is never drawn: 'A VOTE CONSUMES'), 142 more hidden green or gray by the triage; 36 on his screen. slices/vote is 342 MB.
- Who reads the registry: only slices/BOHEMIA_VOTE_TAB.html (the alpha names it in a comment).
- The live URLs the repo ever names: the alpha and the demo, nothing else.

## WHAT IS PUBLISHED NOW, AND WHY (tools/bohemia_publish_list.js, computed at deploy from the committed tree)
1. THE DOORS: the alpha, the demo, the VOTE tab, slices/sw.js.
2. EVERYTHING A PUBLISHED TEXT FILE NAMES, followed to the end: every run of path characters in a published .html/.js/.json/.css/.txt is tried from the file's folder, from slices/ (a script's URL resolves against its page) and from the root. 2b: a bare name the code adds its own extension to (rigSheetLoad(RIG_CAST, 'BOHEMIA_RIG_CAST') fetches .json and .png; found by the serve-only gate on its first run).
3. A FOLDER THE CODE BUILDS NAMES IN SHIPS WHOLE: a folder named in a page or a script ('fight_rig/' + kind; '../records/target/character/barber/' + look + '/rig_' + turn), or a data value that is a folder and nothing else ("trailer_rig": "../records/target/master_rig/cook_trailer/", which the camp builds names under). A folder named inside a sentence of a data file is provenance, not a loader: one such line in the style guide took 115 MB nobody loads. A text file inside a whole folder is read for the files it names, but a folder IT names is not taken whole (the chain of maybes stops at one step; without the stop a sidecar rig.json in the barber's folder named the style guide and the style guide named master_rig/).
4. THE VOTE REGISTRY IS READ THE WAY THE TAB READS IT: not judged, not green or gray, then show.src and show.first. A card a lane registers is published by the next deploy.
Comments are read too, on purpose: blanking them was measured at 16 MB of 821, and one wrong guess by a home-made parser would 404 a real file on his phone.
Nothing is deleted from the repo. The three roots stay the only folders a page may load from; _config.yml says so and now names the list (bohemia_publish_list:), and three folders it kept but never published (handoffs/, skills/, tickets/) are excluded, the half-published state the gate refuses.

## AFTER
- 831 MB in 16,198 files (45% of the bytes, 51% of the files). Biggest: slices/fight_ground 92, records/target/character 88, slices/fight_rig 79, slices/rig_idles 77, records/target/portrait 46, slices/vote 46 (the 36 cards and the game's music), slices/rig_hold 40, settlement towns 30.
- THE BUDGET: CAP_MB 900 in gates/pages_publish_gate.js (about 8% over today, under GitHub's 1 GB). 260 MB cannot be reached losslessly: the game's own art is about 530 MB of it.
- THE SHRINK, MEASURED AND LEFT: PIL works on this box (12.3.0). The fight boards are already lossy WebP (VP8); a lossless re-encode of the packed sheets saves 0 to 4%; PNG optimize saves 2% (3,471,432 -> 3,395,942 on the biggest). Not worth a round. A lossy pass or dropping old tabs would be a look decision, not the pipe's.

## THE DEPLOY (the proof on the real surface)
- pages run 4278 on 00000127: SUCCESS, 3 min 25 s from push to done (the good runs before were 4 to 5 min; three of eight died at 12 to 13).
- On the runner the list copied 16,199 files, 831.4 MB (one more than this box: the deploy's own baked file); the artifact was 798 MB; actions/deploy-pages took 28 s.
- The live check, widened to 11 URLs (the registry, the sort, the alpha, the demo, the VOTE tab, sw.js, the map, the fight, the town, the fight's two indexes): all 200 on https://paolosarn.github.io/bohemia/.

## THE GATES
- PAGES PUBLISH (re-aimed): 28/0, was red on main (16/2). It reads the list, binds it to the workflow (the copy step runs the list, no `cp -r` of a whole folder, the paths filter names the tool) and to _config.yml (the key, the exclude list), the doors and the registry published, every card the tab can draw has what it shows, every outward ref of a published page published, the 900 MB cap.
- THE SITE SERVES WHAT THE GAME LOADS (new, gates/the_site_serves_what_the_game_loads_gate.js): a server that answers ONLY the list. L2 the alpha and its 18 tabs pressed: 303 files asked, none off the list. L3 the VOTE tab, 36 cards opened: 200 files, none off. L5 every one of the 61 published pages opened by itself: 1,238 files, none off. M1 a file the alpha loads taken off the list is named. L4 PLUMBER 4's THE WHOLE LOOP PLAYS, run as it is, with the driver's server answering only the list (a preload wraps the driver's open(); the loop's file is not touched). The first run caught slices/BOHEMIA_RIG_CAST.json, _PEOPLE.json and _YOU.json, asked by the map, which the reader had missed: rule 2b.
- VOTE TAB, FIRST TIME FINAL (408(c), DIRECTION's F1 to F8 as written): see the second part below.

## THE SECOND JOB: RULE 408(c), A PLACEHOLDER IS MARKED OR NOT SHOWN
DIRECTION wrote the leg (records/BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md PART 4); it is in gates/vote_tab_gate.js as FIRST TIME FINAL.
- THE LINE BETWEEN OLD AND NEW is frozen in records/BOHEMIA_FIRST_TIME_FINAL_BASELINE_11_6_26.json: the 938 card ids in the registry when the leg landed, and the 128 waiting art cards (DIRECTION counted 137 on its commit; by its own definition, a tile, an animation, an outfit, a face, a haircut, a ui card with an image or a page, or a redo of one, this is 128 on ce14b189).
- F1 THE MARK, F2 THE WORD IS NOT THE MARK, F3 GOLDEN CARRIES ITS PROOF (art_kind, bar key or none:<kind> with nearest, real as a REF-ID in records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json or a file, surface a file, DIRECTION's PASS 'beside the bar:'), F4 ONE GOLDEN AT A TIME, F5 NO VOLUME BEFORE THE PASS (the golden card's verdict up with a star, or up with no not-final words), F6 no options and no twin on a stand-in: all read the registry; each is planted wrong once first (12 plants) and a whole golden card reads clean.
- F6 THE BAND and F7 NO MARK, NOT SHOWN render the tab with two planted cards made after the leg landed: a stand-in, which must carry STAND-IN, NOT THE LOOK, and a card with no stage, which must not be drawn. Both are RED until RUN TWO draws the marks and the band and skips an unmarked art card (the tab is RUN TWO's; 408(c) routed it there). They name RUN TWO in their red.
- F8 THE RATCHET is NOT ARMED until DIRECTION writes records/BOHEMIA_FIRST_TIME_FINAL_STAGES.json ({"stages": {"<id>": "golden" | "made_from" | "stand_in"}}); then every waiting old art card needs a stage (its own or the list's) and the list may only name cards that were waiting art when the leg landed. Its planted list goes red both ways now.
- One standing leg agreed with DIRECTION's F6: the rule-82 twin leg no longer asks a stand-in for a reference twin (a stand-in asks nothing about the look).

## ROUTED
- RUN TWO: the three marks (GOLDEN, MADE FROM, STAND-IN), the grey STAND-IN, NOT THE LOOK band, and the tab skipping an art card made after 11/6 with no stage; F6 band and F7 go green the commit it lands.
- DIRECTION: the F8 list, records/BOHEMIA_FIRST_TIME_FINAL_STAGES.json, for the 128 old waiting art cards.
- EVERY MAKING LANE: a new art card carries "stage" from now (F1), or the VOTE TAB gate is red on it.
- THE COORDINATOR: the site is 831 of a 900 MB budget. The next cut, if it is wanted, is a look call (old tabs' pictures, a lossy pass), not a pipe fix.
