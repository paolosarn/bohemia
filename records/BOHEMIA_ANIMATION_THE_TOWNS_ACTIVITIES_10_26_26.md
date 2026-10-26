# [the town's activities] HIS CREW LIVES IN THE TOWN (ANIMATION, rule 218(a), 10/26/26)

PAOLO 10/26, LOCKED: "in the settlements I really want everyone that is on your company or your recruited. You can see them in
the settlement you know maybe flirting with a girl maybe drinking some beer or maybe walking around maybe talking to people...
make the shit feel alive." (records/BOHEMIA_PAOLO_YOUR_CREW_LIVES_IN_THE_TOWN_AND_THE_TOWN_FITS_10_26_26.md)

## MEASURED FIRST
- The settlement drew its keepers and its crowd idling on their spot (ANIMATION [everybody idles]), its walkers on their lanes
  with their work (rule 131) and his lead walking up (RUN TWO). His company was not in the picture at all.
- Nothing in the bank drank, sat, talked with a partner, flirted or picked a thing off a stall. The idles' smoke went back to
  standing square after every drag (the cigarette came and went), so a man could not stand there smoking.

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json. Six activities, each a loop of HELD
keys (three a beat at 120, Crashbox stop-motion, rule 115(d)) on the rig's man (the skeleton every person is built on, so one
list fits every look and her body too), each with its own rest pose, four breaths on each leg (the same pictures held for
different counts) and a few variants:
- DRINK: a green beer bottle at his belt (a brown one was lost on a brown coat, measured on the first preview), raised, a sip
  with the neck in his mouth, a long swig with the head back, a look round; a weight shift with a glance; the bottle never
  put down.
- SMOKE: the idles' own cigarette held low between drags (never put away), a drag and the smoke let out, a hip out with a
  hand on it.
- TALK: two people, turns. While he has the word he talks with his hands (an open hand, both hands out, a point, a chop);
  while the other has it he listens (nods, a tilt of the head, hands on his hips, a laugh). A pair shares one clock and the
  partner is a slot on, so one talks while the other listens.
- FLIRT: his weight on one leg and the head tipped, leaning in, a laugh with a hand to his chest, a hand to the back of his
  neck, a hand on his hip; beside a wall (o.wall) a hand up on it, leaning his weight in.
- SIT: on the work's own slatted crate set on end behind his heels (a step, a stoop): hands on his knees, elbows on them
  leaning forward, leaning back on his hands, a look round. His heels stay where he stood (the plant).
- STALL: bent a little over the goods, looking along them, a hand out, a red tin picked up, looked at, turned over, put back.
- WALKING THE STREET is the walk every man already has (slices/rig_walk 'walk_plain', RUN TWO's sheets), its stops 'stall'
  or the bare idles' look: nothing new to render, RUN THREE steers him on the picture's own ground (rule 169).

THE TOOL: tools/bohemia_animation_the_towns_activities.py (pose / people / pack / preview / closeup). The props are skinned to
bones of their own (the idles' lesson); every pose's joints are written beside the posed model (joints.json, the gate's ruler).

THE PICTURES: slices/rig_town/<look>_<act>.webp, a sheet PER ACTIVITY (a man drinking decodes only his drink sheet, about
1024 x 330, 1.3 MB), in his own colours (his bare idles' palette, the bottle's and the tin's added only where they are far
from his own); slices/rig_town/<look>.json his cells and feet; slices/rig_town/rig_town.json the activities and timelines.

THE PLAYER: engine/bohemia_idles.js, __THE_TOWNS_ACTIVITIES__:
    BohemiaIdles.activities(look)                 the activities this look has pictures for
    BohemiaIdles.activity(look, seed, now, facing, {act, n, pair, partner, wall, since})   the cell to draw now (as frame():
                                                  img x y w h dx dy foot, and kind, pose, act), or null
    BohemiaIdles.townAt(seed, now, {act, ...})    the clock alone
  o.n is his place in his company: the crew's clocks are spread by the golden ratio, so no two are in step; o.pair any string
  a talking pair shares, one of them partner: true; o.wall a wall at his right hand (flirt).

## THE BUGS I MADE AND CAUGHT
- THE SEAT MOVED EVERY FACING. Hidden, a prop shrinks onto its bone; the crate's bone stood under the crate, 27 cm behind his
  heels, so his box grew 6 cm deep and the rig, which frames and turns a man about his box, slid every facing a pixel or two
  off his still (0.83 overlap). The crate's bone stands between his feet now; the pack also lays each facing on his still by
  the best whole pixel (front and back 0.99, the sides 0.96 on the first render).
- THE ENVELOPE (his 'tweaking', 9/21) caught on the posed model, before a single render: the cigarette hand dropping chest to
  hip in one key, the hand to the back of the neck, the chop and the point, each through an on-the-way pose; three half poses
  were not on the line between their ends (the elbow went out and came back), made an even fraction of the full pose; two arcs
  that dip in projection before they rise are held two keys (a held step, the idles' rule), never one.
- IN STEP. With the idles' clock (a slot every two bars, his offset in keys) twelve men at one bar fell in step: any two whose
  offsets differ by whole slots did every slot together, and with two pictures to breathe in, two of twelve drinkers shared 73
  percent of their keys. Now: four breaths a leg, the leg alternating every two slots, his own pauses between slots (one
  slot's worth in eight, laid his own way), and the crew's clocks spread by their place in the company. Twelve of his company
  at every activity: worst pair under half their keys.
- I started the ten company renders on a source that was not final (the seat, then the on-the-way poses): stopped them and
  rendered again from the final source; about 25 CPU minutes lost. The first man's render is the one that found the seat.

## GATE
THE TOWN'S ACTIVITIES (gates/the_towns_activities_gate.py, in the suite): S the source; E the envelope on the posed joints,
every slot into every next, eight facings; E3 the feet stay put, sitting too; P the pictures (every pose, eight facings, the
soles on his ground); C no variant is its rest, a man at an activity is not his plain still; X the shipped player; W the real
settlement screen hands back every activity's cell. Mutations: a short timeline, a turn side to side, a wrist out and back,
a sip that is the rest, the same clock for all, a pair that both talk.

## REFERENCE CHECK
The compare law's twin of every activity is the same man's own bare idle cell at the same facing (his standing square), side by
side at the street's pixels; analog horror AH-01, the held key; no reference game. [bb Battle Brothers: the company in a town
is a list on the town screen; ours walks, drinks and talks in the picture.]
