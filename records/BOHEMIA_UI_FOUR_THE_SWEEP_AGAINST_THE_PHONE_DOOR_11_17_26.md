# UI FOUR: THE SWEEP AGAINST THE PHONE DOOR (11/17/26)

VAMILY rule 448 (when in doubt, it comes out of the phone; what has its own thing grows from that; never a bare cut, a fade from
nowhere or a slide from an edge), rules 441 and 453. Ask row 632 (EYES 11/17: 'THE SCAVENGE OPENS ON A BLANK SCREEN... a bare cut',
its 448 half; the 4.6 s the board takes to come up is PLUMBER 8's). The coordinator's routine "UI FOUR" job 3: "a sweep of every
screen change against rule 448's gate".

## His words (11/14)
"When in doubt and you don't know what to do with the UI transitions, just do it from where the phone screen would be at all times...
if you don't have an artistic thing to combine something with, just do it from the phone."

## The sweep: every screen change met on the demo (a phone upright and sideways), and where it opens from
Already answered by UI THREE's 11/14v and MOTION 3 (re-walked, kept): the town and the camp from their place on the map, a building's
sheet from the building tapped, the item card from its slot, the settings and the crew screen from their buttons on the phone, the
end screen from the phone, the road, meet and day cards, the notes, the town's talk and warning, the kills card from the phone.
FOUND STILL WRONG, and fixed in this build:
| screen | before | now |
|---|---|---|
| THE SCAVENGE (after 'Search the lot') | a bare cut: a brown cover over the whole glass and, over it, the game's own frame, whose page paints its dark glass the moment it loads | both grow together out of THE LOT on the town's picture, the thing he searched (rule 448(a)); when he leaves, the cover's copy goes back into the lot |
| THE TOWN'S ARRIVAL CARD (the town's sign, who speaks, what they think of him; two seconds on arriving) | a fade from nowhere and a fade to nowhere (its own opacity step) | out of the phone's spot and back into it (rule 448(b): it has no thing of its own on the glass) |
LOOKED AT, LEFT, each with its reason:
- THE SQUAD-UP CLOSE-UP at the start of a game (slices/bohemia_the_squad_up_close.js): a film cut of its own (his crew close up before
  the map), not a card; a cut is its own thing there.
- THE FRONT SCREEN and the maker: the game's own opening (rule 66a's, 'awesome'); no phone stands yet.
- THE FIGHT'S GLASS (the veteran, the weapon card, 'fight over'): FIGHT SCREEN 2's (rule 449), untouched.
- Three old panels in the map's file (#ctcard, #savepanel, #teachwrap) open by a bare display switch in the code; none came up on the
  demo's walk (the town card was retired by rule 19(a); the save is the settings' code now). Not met, not changed; named so a walk
  that does meet one knows where to look.

## How (one shared piece, no copy per screen)
- slices/bohemia_ui_nothing_pops.js, the POPS table, two rows: 'arrival card' (#arrive, from the phone) and 'scavenge' (#scavcover
  and #scavgame together, from the world, at: the lot's own place on the town's picture, BohemiaSettlement.where('lot')). The layer
  already knows how to carry a card from an origin and back (UI THREE's travel).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html, the arrival card (__THE_SWEEP__): where the layer stands and its row is there, the card's own
  fade steps aside (whole the moment it is on the page, gone the moment it leaves; the layer does the travel both ways); with no layer
  (the page alone) or its switch off, the old fade.
No word is touched (rule 454(a)); nothing floats over the world (442(b)).

## Proven
Gate THE PHONE IS THE DOOR (gates/the_phone_is_the_door_gate.js), new legs, on the demo, upright and sideways, real taps:
- S1 THE SWEEP: the table names both rows, the scavenge with its place (the lot).
- L5 THE TOWN'S ARRIVAL CARD: the layer's record of it starts at the phone's centre within 8 px, in and out.
- L6 THE SCAVENGE: 'Search the lot' pressed with a real thumb; the first move starts within 40 px of the lot and it goes back there
  when the game's own LEAVE is pressed; the worst gap between two painted frames while it opens under 100 ms.
- L4 NO SCREEN WITHOUT AN ANSWER now also meets the scavenge's cover and frame, both named by the table.
- --plant: the scavenge told to open from the finger, L6's judge turns it away.
The numbers of the run are in the handoff block.
Filmed on the demo, slowed so a shutter can keep up: records/target/ui4_the_sweep_11_17/the_scavenge_and_the_arrival.webp (it plays:
the lot's sheet, the scavenge growing out of the lot, the board; LEAVE and the cover going back; then a town's arrival card standing
and going back into the phone).

## Named, not this build
- THE 4.6 s BEFORE THE SCAVENGE'S BOARD COMES UP (row 632's other half): the game's own baking; PLUMBER 8 with SCAVENGE.
- THE STALL SIDEWAYS on the demo with a trade good's row: 36 px past its box. Next on this lane.

[bb Battle Brothers opens every town window from the town's own node on the map; nothing in it appears from nowhere.]
[analog horror: the lot swallows the screen from one dark doorway, and when you leave it closes back to that doorway like an eye.]
