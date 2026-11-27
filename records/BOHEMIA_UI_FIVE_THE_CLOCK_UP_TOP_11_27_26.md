# UI FIVE -- THE CLOCK UP TOP (11/27/26; VAMILY rule 487, amends rule 368; ask row 755)

PAOLO 11/27: 'I feel like the players aren't connected to the time in the day, so... take it off the phone and put it at the top of
the screen cause I feel like people aren't connecting'.

## BEFORE (measured on the demo, 390 x 844 and 844 x 390)

Since rule 368 (11/3, 'the only thing at the top is the resources... look at your phone') the top band carried the six counts and the
FOLLOWERS count; the day and the hour were the phone's first line ('DAY 1  06:00', 7 px), and no day or night was drawn anywhere.

## NOW (slices/bohemia_ui_materials.js __THE_CLOCK_UP_TOP__, slices/bohemia_phone.js)

- The one bar every screen wears (the map, a town, camp, the end screen: each asks the map's own bar for its parts) carries the clock at
  its resources' pane's right end: the sun's dial (the sun on its arc by day, the bitten moon by night: the old day plate's own dots), the
  hour at 16 px, DAY n small over it, the hour moonlit blue at night. It is the map's own clock (T), read every time the bar repaints
  (twice a second), so it moves as time moves.
- Upright on a phone the six's pictures are a size smaller (24 px, food 32) and the gaps tighter, so the clock fits on the one row; the
  band keeps its one height (63 points upright, 60 on its side). On its side it stands at the bar's right end.
- The phone's first line no longer says the day and the hour.
- The fight still has nothing across its top (rule 280); its clock does not run.

## PROOF (rule 441: the demo and the alpha, a phone upright and sideways)

GATE THE CLOCK UP TOP (gates/the_clock_up_top_gate.js, new, in the suite): K1 the clock on the bar once, whole, the game's own day and
hour, the dial drawn, the hour 16 px; K2 the game's clock moved 2 h 5 min, the bar says it within a second; at 22:15 night (the moon,
'night' said), at 09:40 day; K3 no DAY and no hour drawn on the phone; K4 nothing threw. 18/0 (demo and alpha, both ways). PLANTED: the
clock taken off the bar, K1 red; the day and the hour put back on the phone, K3 red.
RE-AIMED TO RULE 487 (each says so in its file):
- THE TOP IS ONLY RESOURCES (UI 7's, rule 368): B5 new, the clock on the band once, whole, the game's own day and hour (map, town, camp,
  both ways); B1 allows the clock and the FOLLOWERS count (JOBS 2's, rules 466(c), 470(b): it was red on main, 6 legs, for that chip);
  P1 and P3: the phone says no day and no hour. 65/2: the two left are main's (FIGHT 'a road fight opened through the map's own door').
- THE DAYS ONCE: the DAY and the hour drawn once each, in the bar's clock, the game's own; the phone says neither. 59/0.
GREEN: THE PHONE 268/0.

VOTE ui5-the-clock-up-top-11-27 (STAND-IN): the demo upright, the top band and the phone, before, now, and now at night. Laid out by
tools/bohemia_ui_five_the_clock_up_top_card.py.

[bb Battle Brothers: the day and the hour sit at the top of the world map, a sun or a moon beside them, and the eye finds them there]
[analog horror: a security monitor's corner stamp, DAY and the hour, that nobody set and nobody can turn off]

## AND THE VOTE TAB GATE'S DOOR LEGS, RE-AIMED (UI FIVE 11/27, the same round)

Registering this round's card, the VOTE TAB gate read 58 ok, 8 failed, the same with and without the card. Three of the eight were the gate's
own finger, not the game, each measured by hand on main:

- THE ALPHA LANDS ON VOTE AFTER BEGIN read run/p-city. Its tap at (195, 500) upright is the door's THE FIGHTS card now, so nobody began.
  Pressed the way he does (BEGIN, then the barber's GO), the alpha lands on vote/p-vote and stays (900 ms, 3 s, 8 s). The gate now taps
  BEGIN (#fronttap) and waits for GO in the chair; it does not stop at __PLAY_BEGAN, which is true at BEGIN, before the chair is armed
  (stopping there left the chair over the whole page for the rest of the leg).
- THE GEAR'S VOTE DOOR waited 90 s for the shell's floating gear, which steps aside for good once the map's bar carries one
  (html.bm-gear-in-bar, rule 150). His way to it: RUN (once the squad's tape has cleared, about 5.7 s after GO), then the bar's gear, or
  upright the phone's SETTINGS app. The gate presses whichever is under its own centre pixel, the old gear only as the fallback.
- THE REACH read 26 x 10: the card grows in from the finger (rule 229(b)), measured 7 x 1, 26 x 10, 100 x 43, then 106 x 44 at 600 ms and
  still. The gate reads the button once it stops moving.

After: 61 ok, 5 failed. The five left are other lanes' cards (dynasty-flip-at-crisis-10-9, dynasty-animal-era-10-10 and
plumber-8-fewer-freezes-11-10 and cook6-the-names-painted-11-26 on the why's length, character2-the-robes-come-off-11-26 on its
differences and its 895 pt first picture, plumber-8-fewer-freezes-11-10 on its stage) and one finger drag on the VOTE page's picture
(-100, 0 with room -100, -114: it moved sideways, not up), not looked at this round.
