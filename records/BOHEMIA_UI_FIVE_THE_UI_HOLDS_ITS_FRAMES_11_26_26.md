# UI FIVE -- THE UI HOLDS ITS FRAMES (11/26/26; VAMILY rule 480(b)(c), ask row 723)

PAOLO 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for nothing lets go'.

## MEASURED FIRST (the demo, a phone 390 x 844, the CPU slowed four times, the GPU drawing the canvases off the page's thread)

Every UI change, from the press to 1.4 s after, frames the top page drew (records the probe printed; 'over 50' frames past 50 ms):

| change | before | now |
|---|---|---|
| the map standing still | 9.7 fps | 11 to 12 (not the UI's) |
| the town standing still | 10 | 9 to 12 (not the UI's) |
| the town to the smith (the sheet grows) | 8 | 9 to 12 |
| the shop standing open | 11 | 22 to 30 |
| a weapon tapped (its card and the strip) | 8.5 | 17 to 21 |
| its MORE (the long card) | 6.9 to 8.7 | 25 to 28 |
| a buy (a double tap) | 8.9 | 21 to 22 |
| an armour piece tapped | 9.6 | 20 to 22 |
| the sheet goes (its x) | 9.9 | 14 to 15 |
| the crew screen, his main hand tapped | 6.9 to 7.1 | 20 |
| the crew screen, looking round it | 6.3 to 6.8 | 22 to 23 |

WHERE THE FRAMES WENT (a CPU profile of each change): in every one of them the biggest thing on the page's thread was the town's own
picture (BOHEMIA_SETTLEMENT_SCREEN.html draw: every person's shadow and body, fill() 13 to 20% of the thread), drawn every frame under a
shop sheet that hides all of it but a 22 px band of rooftops (upright; 5.4% of the picture at the edges on its side), and under the crew
screen, which hides all of it. Switching pieces off one at a time on the idle town (the map frame under it, every CSS animation, the
town's canvases, the phone, the top page's overlays) moved its frames by 1 to 2 a second each: the town and the map standing still are
spread over many per-frame scripts and the browser's own commit, theirs and PLUMBER 8's (rule 480(d)), not one piece of the UI.

## THE FIX

- slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_TOWN_RESTS_UNDER_ITS_SHEET__ (SCAVENGE 2's rest under its game, the same pattern): while
  the sheet is open, fully opaque, nothing in the page is moving (no running animation: a sheet growing out of its building or folding
  back plays over a town drawn every frame) and it hides all the town's picture on the glass (nothing drawn) or all but 6% (drawn eight
  times a second, so the band of rooftops still lives), the town looks again eight times a second; its sounds go on; the frame the sheet
  starts to go, it draws every frame again. UNDER THE CREW SCREEN (engine/bohemia_crew_door.js #crewdoor, opened in the town's own page,
  fixed over the whole glass, opaque), settled and not folding: the town draws nothing. Nothing is let go: he is still in the town.
- slices/bohemia_ui_nothing_pops.js __THE_WATCHER_SKIPS_A_HIDDEN_PAGE__: its four-a-second walk asked every voice box of every page the
  game keeps open whether it shows (a style pass each, 60 to 115 ms in every 4 to 6 s on the slowed phone, in every screen), the hidden
  pages too; a page that is gone, hidden or zero-sized is not asked.
- The town counts its pictures (window.__TOWN_DRAWN) for the check.

## PROOF (rule 441: the page he plays, the way he gets there, a phone upright and sideways)

GATE THE UI HOLDS ITS FRAMES (gates/the_ui_holds_its_frames_gate.js, new, in the suite): the demo and the alpha, upright and on its
side: F1 the shop standing open, the town draws 7 to 8 pictures a second where 6% or less of it shows (upright 2.9%, on its side 5.4%),
every frame where more shows; F2 the same with a weapon's card up; F3 the sheet goes, the town draws every frame again (59 to 79 in the
second after the x); F4 the crew screen settled, the town draws nothing, and 76 to 79 pictures in the 1.5 s after the phone's DONE; F5
on the slowed phone the shop standing open draws 2.5 times the frames of the same town with no sheet (11.5 to 28.3 a second); F6
nothing threw. PLANTED (the demo upright): the rest taken out, F1 red (58 pictures a second under the shop).
THE UI MORPHS EVERYWHERE: its frames leg E6 (red on main: the town to a shop 19.5 to 24.7 frames a second while it plays) now holds every
change but one at this box's full speed (the town to a shop 41.7, a weapon 57.3, the sheet goes 46.4, the board 50.9, a job 49.8, the
settings 56 to 60, the fight's end 30.4 on its own floor, the way home 40.7); E3 green too (red on main). 18/1. STILL SLOW: the town
to the lot, 36.8 (its floor 40): the lot boots a fight board under it (BOHEMIA_FIGHT.html pre, bakeBoard, its fetches), SCAVENGE's and
PLUMBER 8's, not the morph.
GREEN WITH THIS BUILD: SCAVENGE IS THE RHYTHM 42/0 (alone; under four checks at once its timing legs wobble, green on main the same way
alone), THE PEOPLE OF THE PLACE 40/0, NOTHING POPS VOICES CLEAR TOOLTIPS 38/0, THE SETTLEMENT ON ITS SIDE 13/0, EVERY PANEL CLOSES 14/0,
ONE HAND OR TWO 6/0 (demo upright). RED ON MAIN, NOT THIS BUILD'S: THE ARENA 4 (on the red list, the same four on main), THE ARMOUR HE
WEARS SHOWS (main 4 red on the map's legs, this build 3).

FOR PLUMBER 8 (rule 480(d), the walk): on the slowed phone the map and the town standing still draw 9 to 12 frames a second with nothing
of the UI moving; the profile's biggest native costs there are the town's shadows (fill under draw, BOHEMIA_SETTLEMENT_SCREEN.html
draw:4037 and :3674 and :4022), bohemia_idles.js warmOne's getImageData (a GPU canvas read back every few frames), and the browser's
commit; the lot's opening boots the fight page.

## TWO TAPS BY THE FINGER (ask row 726, FOUND BY EYES 11/26 on the alpha slowed four times)

I built the same fix as FIXES 3 in parallel (the double taps timed by the finger, not by when the page handles the click); FIXES 3's
__THE_FINGER_SETS_THE_BEAT__ (fingerAt, the click's own time stamp) reached main first, so mine was dropped at the rebase and theirs
stands. What this round keeps is a check on the glass the way a slow phone hands taps over: GATE THE UI HOLDS ITS FRAMES F7, the stall's
BUY tapped twice 150 ms apart with the page busy 600 ms between the taps: 3 of 3 bought; PLANTED, fingerAt put back to the page's own
clock: 0 of 3 (measured here before either fix: 0 of 3). OPTIMIZE LOOT 22/0, THE SHOP TAPS 9/0.

VOTE ui5-the-ui-holds-its-frames-11-26 (STAND-IN): the numbers above as a picture, before and now, on the slowed phone.

[bb Battle Brothers' town screen is a still picture behind its windows: nothing under a window is drawn]
[analog horror: the security monitor goes to a still frame when nobody is watching it, the timestamp still ticking]
