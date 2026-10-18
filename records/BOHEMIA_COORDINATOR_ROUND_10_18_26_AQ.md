# THE COORDINATOR'S SWEEP AQ (10/18 04:30 to 05:05 UTC; his second 'keep going')

## THE STOP BLOCK (rule 94): RESTARTED

Four counting walks at 4x on the committed demo (BUILD 10/13b), none with a stall over 3 s:

| Walk | Taps landed | Stalls over a beat | Worst stall | fps |
|---|---|---|---|---|
| RUN 1 (a0849682) | 55 | | 1,283 ms | |
| RUN 2 | 51 | | 1,317 ms | |
| RUN 3 | 61 | | 1,250 ms | |
| Coordinator (this sweep) | 69 | 2 | 1,050 ms | 55.9 |

The coordinator's walk: door 16.0 s after 32 files, 0 page errors, 3 dead taps of 69 landed, 272 dropped frames. RUN found why the earlier walks did not count: the 15 'covered' controls were readouts, clipped feed posts and a selector that throws, nothing in the game; the walk was fixed, not the game. The cord was pulled at AL on 9,083 ms; the cause (four loops each redrawing the whole map) was written at AM; it lifts now on four walks. The demo cut is open; RUN cuts it with the rig truck he voted up (rule 115g) and names the 3 dead taps.

## THE HOUR

RUN shipped the real Las Vegas region on WORLD's one scale (34 places, 384 m a block, a three-day crossing against Battle Brothers' two to four) and the rig truck driving the map's I-15 in the alpha (VOTE run-the-rig-truck-on-the-map-10-18). CHARACTER put the thirteen gang outfits on the rig's body as modelled clothes. PORTRAIT modelled the thug's head on his own body with three moods. COOK THREE fixed the thug's two failing rows and built the poacher. ANIMATION made the fall twice as fast and split the shadows per person. COMBAT shipped the outline fix and the fat map (147 of 147). UI built the phone's home screen in two looks. SOUNDS put real recordings into the live settlement. COOK FOUR the gas station in tans. COMBAT TWO re-laid the three boards with the tan houses. WORLD one scale one clock. EYES the blind pass, the keep rate and the five tells by hand. TUNING, ECONOMY, PEOPLE, FACTIONS, QUESTS, MODS research pages (ECONOMY: the raid screen rolls dice, 30.4 percent of town-weeks false; 13 wrong food prices).

## THE FLEET AND THE USAGE

Opus's five-hour window shows a usage warning on most lanes. Rule 113(b) applied: when usage is short, research waits first. Held this sweep: TUNING, MODS, QUESTS, ECONOMY, PEOPLE, FACTIONS (all pages under the hold). Reopened on Opus: COOK, COOK TWO, COOK THREE, COOK FOUR, ANIMATION, CHARACTER, PORTRAIT, COMBAT, WORLD, RUN TWO, SOUNDS, UI, and RUN for the cut. Still running from the last sweep: DIRECTION, PLUMBER (a 69-gate batch), COMBAT TWO, EYES.

## A DEFECT OF THE ALLOW LIST (rule 111d)

COOK's session sat 40 minutes on a shell prompt while writing its render folders, with Bash(*) on the allow list. The app's own safety check on some shell commands is not overridden by an allow rule. Nobody approves in a lane (rule 112), so the session was archived and its uncommitted renders lost; the new COOK chat was told to commit each prop when it passes and never run recursive deletes or moves on absolute paths. The pattern goes on every lane's first message from here.

## THE 10/16 STOP TEXT, EVAPORATED

THE STOP BLOCK (rule 94, read before anything else): STOP (the coordinator, 10/16, sweep AL): I SAW A FREEZE OF 9,083 ms during play (34 stalls over a beat, the walk at 40.6 fps, 25 driver taps taking 96 s instead of 55 between the first and second minute) ON the 4x throttled phone profile loading the committed demo (tools/bohemia_five_minutes.js --throttle 4, BUILD 10/13b) AT about the second minute; this is the THIRD run in a row with a freeze far over a beat on the same instrument (14.8 s on 10/11f, 3.9 s, now 9.1 s), so the sighting is reproduced across runs, not once. The line is stopped for the demo cut (no G-O, rule 93) and nothing else; the alpha moves. Owner at the station: RUN [the long freeze] with the one driver's per-second log, several runs, the main thread's work in the frozen second written under this block. RESTART when the cause (not the symptom) is written here, the fix is seen on the phone profile with the number over three runs, and one gate goes red if a stall over two seconds returns.