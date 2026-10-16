# COORDINATOR ROUND 10/10, SWEEP AG (the first sweep under rule 90, the coordinator's school)

## THE THREE RISKS (school rule 1: before any lane's report is read)

1. TIME TO PLAY HAS NO ONE NUMBER, EVERY NUMBER IS OVER THE LINE, AND THE DEMO KEEPS LOADING AFTER THE DOOR (66.6 MB more, every tile file twice, the page itself three times). RUN says about 22 s to BEGIN at phone speed after the light boot (a85baf60). EYES' ARM at 4x says 48.4 s to ready (c112987c). The coordinator's own run at 4x (below) says the door at 46.5 s. The release line's first line is now TIME TO PLAY UNDER TEN SECONDS (school rule 6). The demo is four to five times over it, and two lanes measure it differently. RUN [ten seconds to play] owns the one number; EYES co-signs it.
2. THE LOOK PROGRAM HAS NO ONE SCREEN. Five art lanes cook in parallel (COOK's bank, COOK TWO's streets, COOK THREE's people, COOK FOUR's places, UI's materials) and DIRECTION judges them piecewise; only COOK FOUR has a PASS. School rule 2: one screen at final quality is the contract everything else is measured against. The coordinator's candidate, put to DIRECTION this sweep: the fight board on one Vegas block with the HUD on it (COMBAT TWO's pack streets, COOK FOUR's houses, UI's materials), with its numbers on one card (school rule 8).
3. THE VOTE QUEUE IS THE BIGGEST IT HAS BEEN. 532 items, 360 verdicts, 173 waiting, 112 of them added since 10/9. He votes in bursts; a queue this long is where 'can't tell difference' comes from. Rules 89 and 90 (round 5) are the cure, and EYES [the before and after] is the filter in front of him. Lanes on HOLD register nothing (two did and retracted; right).

Also named, not a risk to the game but to the coordinator: he told SOUNDS directly that the coordinator 'been tripping on you the most'. He is right that the hold on SOUNDS was a misread of his words. Rule 88 is amended in place; records/BOHEMIA_PAOLO_UNPAUSE_SOUNDS_THE_BEST_SOUNDS_OF_ALL_TIME_10_10_26.md.

## THE FIVE MINUTES (school rule 1: the coordinator's own run of the live build before reading the lanes)

tools/bohemia_five_minutes.js --throttle 4 on the committed demo (BOHEMIA_DEMO.html, build 10/10l), this container at 1.05x of the baseline box, CPU throttled 4x as his phone's profile:
- the door reached at 46.5 s after 39 files; 24 controls on screen at the door;
- 25 taps by 63 s, 50 by 122 s, 75 by 180 s, zero dead taps so far;
- the four numbers over 325 s of play: 5 page errors; 31 stalls over one beat (worst 1.8 s); 1 dead tap of the 6 that reached a control (15 taps were covered by something and do not count; 4 more moved the screen and vanished, so the honest dead count is between 1 and 5); 44.7 fps over the walk, 682 whole frames dropped; the dead control reads 'ReynaNOW';
- WHAT LOADS WHILE HE PLAYS: the door opened after 17 files, then 25 MORE files arrived during play, 66.6 MB, the last at 377 s. Every city tile file 02 to 09 was downloaded TWICE (02 at 38.7 s and again at 47.4 s, and so on). BOHEMIA_DEMO.html itself loaded again at 76 s, 196 s and 316 s: the demo reloads mid-play three times. BOHEMIA_CURRENT_SLICE.html (2.1 MB) was fetched at 377 s: a second page the demo has no business loading;
- the tool's own verdict: THIS WALK DOES NOT COUNT, only 6 taps landed, a walk that pressed nothing agrees the demo is perfect. Taken: the coordinator's five minutes is a measurement of the load and the frame rate, not of the game, until the driver's taps reach their controls;
- one error repeated: the clipboard write is denied in the container (the NOTES button's copy), not a phone bug.
What the coordinator saw: the number that matters is 46.5 s to the door, which agrees with EYES (48.4 s) and not with RUN's 22 s; RUN's number is BEGIN-ready at 'phone speed 75', a different profile. The release line carries the 4x number until RUN and EYES agree on one instrument. Zero dead taps across the first three minutes is the good news and the only one on the first screen.

## THE SWEEP (203 commits since sweep AF, de681fe1..origin/main)

Notes written on 26 lane sections (one NOTE line each, tagged [sweep ag]); five lanes topped up to three OPEN rows (RUN TWO, CHARACTER, COOK THREE, ECONOMY, TUNING); the open-row gate's two reds fixed (SOUNDS and RUN TWO had a round hiding inside a shipped row); EVERY RUNNING LANE HAS A JOB 9/0.

Shipped and read (the headline per lane): RUN load hunks (75 s to about 22 s at phone speed, 3.2 MB, the far end at the phone's pixels, demo 10/10l); RUN TWO the roster shows the hurt, the stash screen; COMBAT the flipped phone's look, the head under the strip; COMBAT TWO the rest join (nine boards, zero broken seams), the boards from the packs (every fight street from his purchased tiles); UI landscape, the sideways sides (no brown-grey bands), the roster and the posts look; DIRECTION the reference twin round one, the revamp pass round one (COOK FOUR PASS), demo verdict two (2 fixed, 18 still wrong); COOK the pack is the twin (all 1,927 approved tiles out as files by family; they sat as base64 in four bank files, which is why nobody looked); COOK TWO the street kit rounds one to four; COOK THREE the thirteen repainted rounds 1 to 3, the enemy tiers rounds 1 and 2; COOK FOUR the settlement from the packs rounds 1 and 2; EYES the soundscape judged, a fresh phone judged again; PLUMBER open row gate, the pack gate, the picture leg; CHARACTER three bodies (his NO), wildlife rig; PORTRAIT keepers' faces, chipped bodies' faces, hires' faces, hair match regression gate; SOUNDS not sand round eight, the first real sidechain duck; WORLD the valley has no inside (his YES); LIFE+CITY a raid on your base, take the next part, then held and two rows retired on his DOWN votes; FACTIONS beef, who guards, houses at war; PEOPLE keepers; ECONOMY rounds 63 to 65; DYNASTY the flip at the crisis; TUNING the price ratios (his YES), gun reach, board sizes, origins difficulty, start power; MODS five research rounds; QUESTS three shelves; ANIMATION and WORDS on hold.

Rulings read on the board: FACTIONS and ECONOMY shipped mechanics under the rule-88 HOLD; the work stays and both lanes are PAGES WITHOUT SHEETS until he lifts it. FACTIONS merged main into its branch three times (merge commits on main); QUESTS left three 'wip' commits with no message. Both named in their notes.

## GROK

Fourteen pages pulled, GROK_144 to GROK_157, all stamped PASSED FILTER: seven gear tables (durability, initiative, resolve, armor, helmets, shields, spears; TUNING's and MODS' reading) and seven lore passes that restate rulings the board already holds, two of them narrating a plumber's bug note. Nothing new filed as VIA GROK. The asks page re-ordered: 23 (the soundscape catalogue, first, for SOUNDS) then 24 (why Battle Brothers' houses feel flat). Master rebuilt.

## THE LINES

DEPLOY: runs through 2988 SUCCESS, live 0f659c57. COOK: 532 items, 360 verdicts, 173 waiting. RELEASE: a new first line, TIME TO PLAY UNDER TEN SECONDS, RED at 46.5 s. CUT: RUN re-cut at 10/10l.

## ONE SHIPPED THING HE NEVER OPENED

Hold the phone sideways on the MAP: the map runs edge to edge, the brown-grey bands are gone (UI [the sideways sides], 59240601, live in the alpha; DIRECTION judges the sheet before it reaches VOTE).

## THE SCHOOL, APPLIED (rule 90)

Risks first, then the five minutes, then the reports: done above. One screen: asked of DIRECTION. The reply to him: under 150 words, the last five lines fixed. Fold, don't stack: rule 88 amended in place, no new rule this sweep. Retire by pointer: nothing retired this sweep; said so.
