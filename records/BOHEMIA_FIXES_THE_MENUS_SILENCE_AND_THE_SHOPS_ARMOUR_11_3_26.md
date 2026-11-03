# FIXES: THE MENU HEARS ONLY ITS FEED, THE HOURS WHISPER, AND THE SHOP KEEPS ITS ARMOUR (11/3/26)
BUILD 11/3zzzw THE QUIET MENU, THE SHOP KEEPS ITS ARMOUR. Rules 361 and 364, ask lines 385 and 388.
Records: records/BOHEMIA_PAOLO_THE_DEAD_THE_NAME_THE_SOUND_AND_THE_FIGHT_NOTES_11_3_26.md. Measured on the upright phone (390 x 844,
touch), every sound the page and its frames start hooked at its source (buffers tagged by the file they were decoded from).

## RULE 361: THE DAY'S SPEED SOUND, AND THE MENU'S SILENCE
- WHICH SOUND IT IS, MEASURED: travel 10 s at the regular speed and 10 s at four times, every source counted; one sound tripled with
  the speed (7 -> 21 strikes): time_pass, the hours going by (strikeHours, his 8/7 'have it the amount of time that goes by'). The
  map reports its clock every 4 s and a jump of an hour or more strikes once an hour, capped at twelve; that floor was 'only a real
  skip' when it was written, and an hour of travel now passes in 2.3 s on dirt, so ordinary travel struck two to seven times every
  four seconds, at the full level of any effect (peak 0.276).
- WHY IT WAS ON THE MENU: the map runs behind the start screen, and its first clock report after the load reads as a jump: twelve
  strikes. With it, on the start screen (20 s, no tap): the map's desert bed (bed_day), the map's ambience, and the game's effects.
- THE FIX (slices/BOHEMIA_ALPHA_0_9.html, the demo cut from it): one test, window.__FRONT_QUIET (the start screen on the glass and play
  not begun: the loading screen, the title, the new company's door). The game's effects (playSFX), the hour strike, the desert bed and
  the map's ambience ask it first and say nothing while it holds; the camera feed's own sound (UI 6's loop) is untouched and is the one
  thing heard. In play the strike stays (his ruling) and goes through its own bus at 0.12 of its level: peak 0.033, about 18 dB down,
  under the game's mix (the effects bus peaks 0.33). The start screen's look and words are UI 6's and are not touched.
- MEASURED AFTER: the start screen, 40 s with a real touch half way: 3 sounds, all crashbox/feed_*.mp3, nothing else; in play at four
  times the strikes still come (28 voices in 12 s), peaking 0.033 on their bus.
- GATE: gates/the_menu_hears_only_its_feed_gate.js, in the suite as THE MENU HEARS ONLY ITS FEED, 4/0.
- FOUR SOUND GATES (THE MAP HEARD, TIME PASS, SFX WIRED, EVERY SOUND IS REACHABLE) checked the game's sounds with the start screen
  still up and never pressed BEGIN; each now begins play the way BEGIN does (window.__PLAY_BEGAN) before it listens. After: 17/0, 30/2,
  1052/4 and 19/4, the same reds main carries (measured with main's files).

## RULE 364: THE SHOP KEEPS ITS ARMOUR
- MEASURED: buying every armour piece in turn into the stash, and onto a man in the real demo's towns (a fortress and a camp), took
  only that piece, every time. The bug is the shelf being rolled again while a piece is up (restock: the town's ground arriving late,
  a camp turning, the bar's price): the piece his finger chose was the old roll's copy, the buy took S.stock[k].indexOf(it), which was
  -1, and splice(-1, 1) took the LAST piece on the shelf. REPRODUCED: he paid for the cultist robe, it went in his bag AND stayed on
  the shelf, and the shield at the end vanished; the next roll put the shield back and took the robe (the flicker he saw).
- THE FIX (slices/BOHEMIA_SETTLEMENT_SCREEN.html): a buy finds the piece on the shelf as it stands (the same object, else the same
  kind, id and his-own mark) and takes that one only; a piece no longer on the shelf is said, never sold; a new roll moves his chosen
  piece to its new copy; neither splice can take index -1 again. BohemiaSettlement.restock() is exposed for the gate.
- GATE: gates/the_shop_keeps_its_armour_gate.js, in the suite as THE SHOP KEEPS ITS ARMOUR, 3/0 (on main with only the test hook: 2/1,
  the leg with the roll between his pick and his Buy red: 'bought the robe, the shield vanished'). THE SETTLEMENT SCREEN 73/1, main's
  same red (a gun's name casing).
