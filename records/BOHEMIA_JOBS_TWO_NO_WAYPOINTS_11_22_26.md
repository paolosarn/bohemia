# JOBS 2 -- NO WAYPOINT ARROWS ON THE MAP (BUILD 11/22zo - NO WAYPOINTS), 11/22/26

VAMILY rule 473 (owner JOBS 2 for the jobs' off-the-glass names; WORLD 15 checks the map's other edge names). Rules 441, 448.

## HIS WORDS
'with the side quest on the map... I don't want direction arrows if my map is zoomed in... if a bunch of side quests are populating and
I'm not completing them, then my whole map gets cluttered with waypoint arrows towards these little side quests, not that the side
quests are bullshit, but you're cluttering my whole screen; just have the part highlighted when you're close, like when you see it
normally on the map, but I don't want waypoints... I have like 14 white points on my map for these offshoot side location missions'.

## MEASURED FIRST
One drawer puts every job's and side quest's place on the map: slices/bohemia_job_kinds.js markPlace(), called for each held job's next
place (markNext), the phone's lit town (markPhone) and every side quest's place (BohemiaRoadEvents.places()). Off the glass it drew the
place's name at the glass's edge on the line from the middle toward it ('FIND · PLACE 13', 'ESCORT TO PRIMM', 'JOB AT REMNANTS') with an
amber wedge pointing (wedgesDraw, over the fog), each one a touch that walked there.
On the demo upright, a new crew with 14 side places on his road (12 to 60 blocks out, round him) and two jobs held, at the map's near
stop: 16 marks, 12 on the glass, 4 names and points stacked down the glass's right edge (FIND · PLACE 11 to 14). The farther the places,
the more of them stand at the edge: his 14.

## BUILT
- markPlace(): OFF THE GLASS NOTHING IS DRAWN, no name, no point, no touch (__NO_WAYPOINTS__); it still answers the place's record
  (on: false) for the code that reads it. The wedge layer, the edge boxes and their count are gone; post-mortem
  graveyard/POSTMORTEM_JOBS_THE_EDGE_NAMES_11_22_26.txt.
- ON THE GLASS, as before: the place is ringed where it stands (an amber ring that breathes on the beat) and named under it; a touch on
  it walks there (473(b)).
- THE PHONE IS THE DOOR (473(c), rule 448): each held job's line on the phone keeps its which-way mark (238(d)) and a touch on it sets
  the company off there (questGo), measured below.

## ON HIS PHONE (tools/bohemia_jobs_no_waypoints_on_the_phone.js; gate NO WAYPOINTS)
The demo and the alpha, upright and sideways, the same 14 side places and two jobs:
  demo upright 16 marks, 12 on the glass, 0 at the edge | demo sideways 10 on the glass, 0 | alpha upright 12, 0 | alpha sideways 13, 0.
The camera over a place that was off the glass (PLACE 11, 7, 11, 10): ringed where it stands, its name under it, on all four.
The first job's line on the phone pressed with a finger: the company sets out for THE DRY WASH on all four.
Picture: records/target/JOBS_TWO_NO_WAYPOINTS.jpg (the demo upright, before and now).

## RE-AIMED (their legs asked for the dead names)
gates/the_jobs_part_gate.js N3 (PRIMM off the glass: nothing at the edge) and N5 (the job's line on the phone sets out for PRIMM);
gates/the_place_in_the_dark_gate.js D5b (on the glass marked, off the glass nothing at the edge) and D6 (the touch on the phone's line
walks there).

## NOT MINE, SAID
WORLD 15's own edge names (a found boss off the glass, slices/bohemia_his_map.js) are rule 473's second half: WORLD 15 checks them.

[bb Battle Brothers marks a contract's place where it stands on the world map and never points at the edge; you find it by looking]
[analog horror: fourteen places you meant to go, and the map stopped reminding you]
