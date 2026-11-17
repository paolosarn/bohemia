# THE TRACKS HE CAN READ (WORLD 14, 11/17)

The coordinator's round under rule 453 ("do a full sweep, let's have some fun, lotta tokens this week"), item (3): parties that roam
and leave tracks he can read. Rule 441: on the real page, alpha and demo, a phone both ways. Rule 454(a): no standing line rewritten,
no new road prose; this build adds NO words at all.

## MEASURED FIRST (main b94bd4920)
- The parties roam and leave prints already: LIFE+CITY's living map (LIVING_MAP.st.prints, one print a step off a town, PRINT_HOURS 24,
  fading by the hour, BohemiaLivingMap.fadeOf). About 500 prints stand on the valley after five hours of the parties' business.
- But since rule 151(f) (Paolo 10/24: "I don't know why I'm seeing their lines on the ground of where they're gonna walk, that was
  never a thing in Battle Brothers") the prints draw only behind UI's F key (MAP_PRINTS_SHOWN). A phone has no F key: on a phone no
  track was ever seen.
- The read already exists: the map's own tracks line (tracksHere / trackSay, __WHOSE_FOOTPRINTS_ARE_THESE__) says at the foot of the
  glass who came through and how close they are, e.g. "VOLUNTEERS CAME THROUGH HERE JUST NOW. A PATROL, AND THEY ARE CLOSE." It reads
  the parties' CURRENT legs, so a print a party left before it turned round said nothing (measured on the demo sideways).

## BATTLE BROTHERS FIRST
Footprints show round the company on the world map, fading with time, and hovering one tells who left it and how long ago. His 151(f)
ruling was about LINES of where people WILL walk; a print is where somebody WALKED. So: prints, never lines, and only round him.

## NOW (slices/bohemia_tracks_read.js, loaded by BOHEMIA_CITY_WORLD.html after the road's modules)
- THE PRINTS ROUND HIM: the living map's own prints inside about twice his sight (8 to 14 blocks; the fog decides what shows), drawn
  as SHOE PRINTS, two a step (the left foot behind, the right ahead), each a sole and a heel pointing the way they went, pressed dust
  paler than the dark ground with the dirt's dark lip under it, tinted halfway to the faction's own colour, fainter by the hour.
  First cut was the faction's colour straight: the colours are measured off garments and most are dark (Volunteers 122,117,108;
  Trades 85,62,42), so on the phone they read as round dark dots, like manholes. Pale dust tinted to the faction reads as feet.
- A foot is about an eighth of a block (2.4 to 5.5 px at the usual stop); none at the far stops (a print is a close thing, TW < 10).
- With F on, UI's full trails draw as before and these stand down.
- THE READ OF A PRINT: where the parties' legs say nothing, the print under him answers the map's own line in its own shape (faction,
  agenda, age in steps at about 3.7 blocks an hour), so the line's own words say it. No new words.
- The draw wraps loopJobsDraw (the map's draw hands it ox, oy; it runs after the parties' figures). Never a lineTo, never a stroke.

## THE GATE (gates/the_tracks_he_can_read_gate.js, in the suite as THE TRACKS HE CAN READ (demo) and (alpha))
- T1 the seam: wraps the map's draw, loaded after the road, marks never lines, stands down for F.
- On the page, demo and alpha, upright and sideways: five hours pass the parties' own way (partiesAdvance); he stands five blocks off
  a fresh trail (his own men are drawn over the ground he stands on), the camera settles, then:
  - T2 at each print's own spot on the map's canvas the pixels change with the prints on, and do not change between two frames with
    them off (demo upright 13 of 13 and 0, sideways 7 of 7 and 0; alpha upright 15 of 15 and 0, sideways 24 of 25 and 2).
  - T3 with F's full trails on, none drawn by this file. T4 at the farthest stop, none. T5 standing on their print, the map's own
    line names who came through (Volunteers, Trades). T6 nothing threw.
- Two measuring mistakes the gate made first, both fixed: it sampled the middle of a step, which falls between the two feet; it read
  the alpha sideways while the camera was still easing onto him.

## THE SIGN ALWAYS TURNS UP (the same round, item (1), slices/bohemia_his_map.js, WORLD TWO's file, marked __THE_SIGN_ALWAYS_TURNS_UP__)
Rule 243's Valheim half (the map fills in where he has been, his own pins, a boss found by a sign) is on main already (WORLD TWO,
HIS MAP). The one gap measured this round: HIS MAP's B6 leg was red (the full run 41/1; with the fix the phone half is 21/0) because the next
boss's sign could find no street in reach on some seeds, so the sign never turned up. Now the sign tries the near ring, then a wider
ring, then any walkable block (anyWalk), and the boss's own place may stand up to 50 blocks off (bossPlace far) before it gives up.

## ANALOG HORROR
A print that is already fading when you find it: you were always a few hours behind them.

[bb tracks] Battle Brothers' footprints: round the company, fading, hover for who and when. Ours: round him, fading, stand on them
for who and when, in the map's own line.
