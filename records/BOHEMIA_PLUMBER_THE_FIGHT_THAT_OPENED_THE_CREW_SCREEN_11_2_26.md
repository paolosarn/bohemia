# THE FIGHT THAT OPENED THE CREW SCREEN (PLUMBER, 11/2/26, ask line 309)

Paolo 11/2, playing the live build: "I just encountered this bug: I was supposed to get into combat, and then it took me to the
crew screen. Look into that and destroy that bug."

## HOW IT WAS REPRODUCED
Every probe drives the demo (and the alpha) at 390 x 844 with REAL TOUCHES (tools/bohemia_drive_the_demo.js, Playwright's
touchscreen), with two things armed in every frame before any page script runs: a tripwire on BohemiaCrewDoor.open (who opened the
crew screen, with a stack) and a log of every pointer, touch, mouse and click event each page receives.

1. Ways a fight starts, all through the map's one door (cityHandOver): a party on the road, a job's crew, a boss's place (THE POT
   dressed by slices/bohemia_bosses.js), a camp attacked, a party with the town open, the world's own step (no card), and after a
   reload mid-fight. Each one that his own walking meets puts up THE MEET CARD (ENGAGE / FALL BACK / MAKE CAMP NEARBY).
2. A real finger on ENGAGE over the map and over the camp. The fight opened every time, BUT the event log showed the tap did not
   stay on the card: over the camp, the settlement screen's frame (BOHEMIA_SETTLEMENT_SCREEN.html, the camp and town screen) got
   `mousedown cv, mouseup cv, click cv` from the very tap that pressed ENGAGE. Over the map the same click goes to the map's canvas.

   Before the fix (main 0cedfb67), camp, one tap on ENGAGE:
   ```
   CITY_WORLD   pointerdown BUTTON (ENGAGE)   touchstart BUTTON   pointerup BUTTON   touchend BUTTON
   SETTLEMENT   mousedown cv   mouseup cv   click cv        <- the same tap, delivered to the screen under the card
   ```
   After the fix: the four touch/pointer events on ENGAGE, and nothing anywhere else.
3. What the leaked click hits is whatever stands under the button at that moment. In the camp and the town screen that includes
   controls that open the crew screen by a click: the tent's YOUR COMPANY, the cart's OPEN THE STASH, and the ALSO HERE faces of his
   own men in a person's sheet (each calls BohemiaCrewDoor.open). In the probes the spot under ENGAGE was bare ground, so the
   leaked click landed on the canvas and did nothing; I did not get a sheet staged under the card in a scripted run (the camp's
   sheets are reached only through its own sealed code). So: THE LEAK IS REPRODUCED AND MEASURED; THE CREW SCREEN AT THE END OF IT
   IS WHERE THE LEAK LEADS, not a frame I watched open. Nothing else in the game opens the crew screen around a fight's start: every
   caller of BohemiaCrewDoor.open was read (the settlement's CREW, YOUR COMPANY, OPEN THE STASH, a camp man's tap; the spoils'
   CHOOSE HIS LEVEL-UP; the bar's CREW tag and the C and I keys), and the tripwire never fired in any start tried without a tap.

Also ruled out, measured: the phone's faces (home, fight, YOUR COMPANY) do not put CREW under a finger that just pressed PLAY or
ENGAGE (the phone's CREW sits at the bottom row, 265-291 x 781-809 upright; ENGAGE at 200-348 x 500-544; PLAY 266-316 x 699-749;
the fight face's FIGHT 267-369 x 623-651); the phone shows YOUR COMPANY only while a real roster page is up (rosterWin); the crew
door's fold (UI round 2) is gone in half a second and is skipped by the phone while folding; a fight started with the crew screen
just closed, with a level waiting and a wounded man, from a boss, from a camp and after a reload all open the fight.

## THE ROOT CAUSE
slices/BOHEMIA_CITY_WORLD.html meetShow(): the card's buttons answer the finger's LIFT (pointerup), because "the map's own touch
handlers keep the browser from making a click". That was wrong for the card: the card stops every touch from reaching the map
(stopPropagation), so nothing cancels it and the browser DOES make the click. In the same pointerup handler done() makes the card
see-through (WORLD's btwCardGone sets pointer-events:none, then removes it a beat later), so when the click comes about 80 ms later
the browser hit-tests it again and gives it to whatever is under the button: the settlement screen over a camp or a town (z 60,
under the card's 70), the map's canvas elsewhere. The fight still starts, and a crew-opening control under the finger opens the
crew screen in the same tap. On a mouse it cannot happen (the click goes to the same button), which is why every checker that
pressed the card with a click or MEET_DONE never saw it: only a finger on a phone does it.

## THE FIX (at the card, not on top)
- The card cancels its own touchend (`{passive:false}`, preventDefault when cancelable): a tap on the card makes no click at all,
  so nothing under it can receive one. The card already stopped touchend from reaching the map; it now also kills its click.
- For a browser that makes the click anyway (a touchend it was not allowed to cancel), the going card stays a wall for 450 ms
  after a press from a finger: it takes pointer events again and eats mousedown, mouseup and click in the capture phase, then
  turns see-through as WORLD built it. A mouse press is untouched (its click lands on the same button and is a no-op).
- done() answers only its own card (`MEET.up.el === el`), so a late press on a going card can never answer the next card.
- FALL BACK and MAKE CAMP NEARBY are on the same card and get the same fix.

## THE GATE
gates/the_fight_opens_the_fight_gate.js, in the suite as THE FIGHT OPENS THE FIGHT. On the demo at phone size (the stranger's
game, which starts in a town; --alpha for the alpha), every leg presses the card with a REAL TOUCH and fails if anything but the
fight opens, or if any mouse or click from the tap reaches any page or element other than the card:
F1 the town (ENGAGE with the town open), F2 FALL BACK on the map, F3 the road, F4 a job's place, F5 a boss's place (THE POT),
F6 the camp (they come, ENGAGE over the camp screen), F7 the crew screen just before (opened with the phone's CREW, closed with
DONE on the phone, a party at once), F8 a level waiting and a wounded man, F9 no card (the world's own step), F10 after a reload
mid-fight (the tab killed, the same fight opens), F11 nothing threw.

## RESULTS
- BEFORE (main 0cedfb67's map file served in place of the fix, the same gate, the demo, upright): 2 passed, 9 FAILED. Every card
  press leaked: F1 (the town) `BOHEMIA_SETTLEMENT_SCREEN.html mousedown cv, mouseup cv, click cv`; F2 to F8 the same three into
  the map's own canvas (`BOHEMIA_CITY_WORLD.html ... cv`). F9 (no card) passed; F10 failed for the driver's reason below.
- AFTER, on the tree as shipped (rebased on 3da53263, BUILD 11/3zf), the demo, upright: 11 passed, 0 failed. Every press: 'the
  tap was the card's alone (0 on the card)' (no mouse or click made at all), the fight up at round 1 with the phone on its strike
  card or fight face, no crew screen anywhere; F7's crew screen came up from the phone's CREW and DONE on the phone closed it.
- THE ALPHA, the same tree (`--alpha`): 11 passed, 0 failed. The alpha opens on the street with the town over it, so the gate
  leaves the town and goes to the map (eight squeezes did not reach it there; the map's own switch, swapMode, the function its pinch
  calls, did) and its town leg runs on the map; every other leg as on the demo.
- THE GATES THE CHANGE TOUCHES: MEET BEFORE YOU FIGHT on this tree 13 passed, 2 failed (M6, M10); main's own map file served in
  its place, the same gate: 13 passed, the SAME 2 failed. Not this change; on RUN's row (M6: the walk back into the party he fell
  back from meets no card, the fall-back hold; M10: one card on the walk past the pack). THE MOMENTS BETWEEN presses the card
  with MEET_DONE, never a finger, so the finger-only wall never runs there.

## TWO THINGS MEASURED ON THE WAY (not the bug, written down)
- THE DRIVER HID A RESUMED FIGHT. tools/bohemia_drive_the_demo.js waits up to two minutes for the street (MODE 'human'), which the
  stranger's game never shows; on a reopen mid-fight the resumed fight (FINISHER's, round 1, the same band) has by then taken the
  screen, the map's frame has no box, and the driver's TRAP 7 presses the RUN tab: the map goes back OVER the built fight (the
  fight in a hidden #p-combat, the phone on the map's face). That is the checker pressing a tab no player presses: F10 reopens
  with world: 1500 and the same fight opens with the phone on it. Any checker that reopens mid-fight with the default wait and
  then reads only the fight's own state (as THE FIGHT SAVES AT ITS START does) will not see this; one that reads the glass will.
- THE ALPHA OPENS ON THE STREET (MODE human, the town over it): the meet card is the map's (meetShow asks MODE 'city'), so on the
  alpha every fight goes straight with no card until he is on the map; eight squeezes did not get the driver to the map there.

