# TEN SECONDS TO PLAY, ROUND TWO (RUN, 10/11/26, [ten seconds to play])

> **PAOLO 10/5:** *"I feel like I gotta wait 40 seconds for this shit to load."* The row's end state: from the tap on the
> link to the first tap that moves the party, under ten seconds at 4x.

## MEASURED (PLUMBER's FIRST LOAD at 4x, served like Pages; and a CPU profile from the link to BEGIN ready at full speed)
| | BEGIN ready at 4x | full speed |
|---|---|---|
| the start of this round | 27.7 s | 11.4 s (this box, this hour) |
| now | **13.0 / 13.1 s** (two runs) | **3.4 s** |
The title stays at 1.7 to 1.9 s; 3.2 MB before ready; nothing twice.

## THE CUTS (each measured in the profile; each picture proven the same)
- **The people's breath after the door.** The map's six people were baked with all four breathing frames before
  BEGIN (2.4 s). The boot now bakes their still (the breath's own 0.25 frame); the four frames are baked after the
  world is ready, a facing at a time, while he reads the title and picks his crew, and join the stills on the map by
  a small message (`BOHEMIA_CITY_CAST_BREATH`) that never touches the people a later bake adds on the end.
- **His walk after the door; no run.** His body was baked standing, walking and running (72 frames). The map draws
  only standing and walking (every PLAYER_CV reader), so the 32 run frames are gone; his walk is baked after the
  world is ready, and the map draws his still while he glides until it lands.
- **No street crowd on the map.** The music's intensity watcher asked the city for everyone within five tiles twice a
  second; on the demo's map that built the street's whole near field (2.9 s the first time). On the map it reads
  "no crowd".
- **No street-walk warm-up.** The shell pre-built his walk and run frames for the walked street (0.68 s); not in the
  demo. And the demo knows it is the demo from its first line (the cut sets the flag in the head as well as the
  epilogue): the parser yields while reading the page, and the warm-up ran between chunks before the flag arrived.
- **One paint for a burst of pictures.** Each traffic-signal picture painted the whole map again as it decoded;
  now a burst asks for one paint on the next frame.

## THE SAME PICTURES
The map ends with the same 280 frames as the workshop's one-piece bake (six people's stills and breath, his stills
and walk; hashed, THE DEMO BOOTS LIGHT B10), and the 240 cast frames hash the same with the split and without it.

## WHAT IS LEFT (13 s against 10)
At full speed: the six people's stills (1.07 s, 48 frames), parsing the two pages (0.74 s), the city frame's own
boot (0.7 s), the map's first paints (0.5 s).

## CHECKS
THE DEMO BOOTS LIGHT grows: B1b (no crowd poll, no street-walk warm-up before BEGIN), B9 (the breath and his walk
come after the door, whole eights), B10 (the same 280 frames as the one-piece bake, no run frames). 12/0.
