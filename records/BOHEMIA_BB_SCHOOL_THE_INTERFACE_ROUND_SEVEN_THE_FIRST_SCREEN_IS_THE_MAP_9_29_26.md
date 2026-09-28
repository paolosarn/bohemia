# BB SCHOOL, THE INTERFACE, ROUND SEVEN: THE FIRST SCREEN IS THE MAP NOW
# UI (chat 11, ui-kmqmrf), 9/29/26. Row [bb interface], rule 33(f); library vol 10 (THE MAP HUD), 01.
# WHY THIS ROUND: RUN e4c66f2 ([bb map] + [no city walk]) made the demo open on the map. Every HUD
# question this lane asked on the walked street is now asked on a surface that is dead (38b); the
# first screen a friend sees is the map, so that is where the interface was measured.

## THE SCHOOL HALF (vol 10)
BB's map HUD: a top bar with crowns, food days, tools, medicine, ammo, the day count and a time-of-day
sun; the company banner; a bottom bar of roster faces; pause / play / 2x. On the map the top bar is the
FEEDBACK OF TRAVEL: you tap, the party moves, and you watch the day and the food tick.

## THE MEASUREMENT HALF, ON THE DEMO, THROUGH THE ONE DRIVER
Door 19.8 s, mode city, 0 cards. What is on the first screen: the bar (390x50, black, one NOTES
button), the gear, the cracked phone with the feed and the three family faces, and the map.
Tap to travel: the hour moved 06:00 -> 06:26/06:32 in about 2.5 s -- visible ONLY on the phone's
status-bar clock (a few pixels tall). The bar says nothing while time passes.
A CENSUS NUMBER I THREW OUT: the element census listed feed posts down to y 803, i.e. spilling out of
the phone over the whole map. The picture shows them clipped inside the phone. A rect is not what is
painted when a parent clips (overflow:hidden); same family of wrong oracle as round three's wrapper.

## THE DEFECT: THE THREE FAMILY FACES ARE BLACK ON THE FIRST SCREEN, AND THE FIX IS ONE LINE
Measured: the faces (act1..3) are in the face cache 1 s after the door (3 of 3, 64x64, mean brightness
92/88/67, Reyna's saved and looked at), and the three 26x26 tiles on the phone hold 0 painted pixels
at 1, 3, 6, 10, 20 and 40 s and after a tap on the map. Same on the alpha.
ROOT CAUSE (slices/BOHEMIA_CITY_WORLD.html): ctActFlipPaint() draws the tiles and is called
automatically in ONE place, when the phone opens (city mode toggles on). At that moment the faces are
not there yet: ctFaceAsk() posts the ask to the shell and returns null; the answer lands one message
later in the BOHEMIA_CITY_FACE handler, which caches it and calls render() -- the MAP -- but never the
strip. Only a flip, a reshuffle or a name change repaints it. It was latent since [the flip]; the demo
opening straight onto the map made it the first thing a friend sees.
THE FIX, PROVED ON THE REAL DEMO WITH A CONTROL (the one driver's serve option, a patched copy of the
city world, same walk, touching nothing, 5 s after the door):
    UNPATCHED  tiles painted: 0 px, 0 px, 0 px
    PATCHED    tiles painted: 676 px (mean 92), 676 (89), 676 (69)
    in the handler, after `if (c) { try { render(); } catch (_e2) {} }` add:
    if (c && /^act/.test(String(m.who))) { try { ctActFlipPaint(); } catch (_e3) {} }
NOT PUSHED BY THIS LANE: rule 18(b) holds UI's code off the play surface, and the first screen is RUN's
under 18(a) now. Routed to RUN (and DYNASTY, whose strip it is) with the line and the proof; new UI row
[faces blank] carries it in case the coordinator hands it here.
ALSO ROUTED TO THIS LANE IN A CODE COMMENT, NOW A ROW: RUN replaced the reshuffle mark U+27F3 with '?'
because the phone's ROM face has no arrow ("Whoever wants a real reroll arrow adds it to the ROM face;
UI [glass face]"). The '?' reads as "unknown person" on a face tile and sits over the hair. New row
[glass face].

## THE COOK
ui-what-the-bar-says-9-27 was shot on the walked street, which 38(b) killed before he judged it. Same
question, same id (asked once), picture and words RE-SHOT ON THE DEMO'S MAP: A nothing / B batteries,
the hour, where you are, the hour ticking while the party travels / C five, the BB count. The faces on
the phone in that picture are painted by the patched copy, and the sheet says so in one line.
