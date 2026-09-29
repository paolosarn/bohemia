#!/usr/bin/env python3
"""BOHEMIA — WHERE A RAID IS FOUGHT (9/28/26, LIFE + CITY, row [honest grid], round 3).

THE ROUND'S COOK (rule 22), AIMED BY HIS NEWEST RULINGS. Rule 37(e), his third votes:
FOURTEEN parts of Vegas are generated HOME BASES you can raid. Rule 38(b): the close grid is
the FIGHT'S ground and the special places', never the city's floor. So the sealed-floor debt
that matters is not the valley's 18,645 cells. It is the floor you could be fighting on.

MEASURED BEFORE DRAWING. The fourteen seats were placed by the game's own seat rule
(engine/bohemia_towns.js derive) on five seeds: they land on seventeen district kinds, and ten
of those carry any sealed floor. After this round's chapel gates, SIX still carry more than a
sliver, and they are these six, each one a faction's home:

    police station   Remnants        prison           Remnants
    pump station     Homeless        radio site       Network
    medical campus   Volunteers      bus terminal     Caravans

THE PICTURE IS THE GAME'S OWN GROUND. Every block off its own registered generator with the
seed and call the game uses; every cell's answer from gates/every_floor_region_connects_lib.js,
the measurement the gate ratchets. Green walk, grey solid, blue water, pale island, RED sealed.

THE ANALOG HORROR LINE (rule 30): the Remnants' police station has a yard nobody has walked
into since the fence went up. When the raid comes, the fight is on ground half of which does
not connect to the other half, and nothing on the screen says so. One wrong thing.

REUSE CHECK: the harvester, colours, label measurement and refusals are the places factory's
own (tools/bohemia_places_you_can_see_and_never_enter_factory.py), imported rather than
copied; only the panel list and the output differ. Grids from the registered generators,
classes from the kit's tileLayer, answers from the shared lib.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: six quiet plans, and the only loud
           colour in the sheet is red, used only for floor a body cannot reach.
  BLDG-03  structure reads. Held: every solid mass stays one grey so a police station reads as
           a building with a yard, not as a pattern.
  BLDG-05  structural sanity. Held: nothing is moved or redrawn; these are the generators' own
           blocks cell for cell.

DETERMINISTIC. REFUSES if any panel is not actually sealed any more, because a red square on a
block that got fixed is a false sentence in his VOTE tab.

Run from repo root:  python3 tools/bohemia_where_a_raid_is_fought_factory.py
Writes: slices/vote/LIFECITY_WHERE_A_RAID_IS_FOUGHT_9_28.png
"""
import importlib.util, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    'places', os.path.join(HERE, 'bohemia_places_you_can_see_and_never_enter_factory.py'))
places = importlib.util.module_from_spec(spec)
spec.loader.exec_module(places)

# OFF THE SITE 9/29 ([vote picture]): withdrawn from his queue, kept for the record, never published.
places.OUT = os.path.join(places.ROOT, 'records', 'lifecity_pictures', 'LIFECITY_WHERE_A_RAID_IS_FOUGHT_9_28.png')
places.PANELS = [
    ('REMNANTS: POLICE', 'policestation', None),
    ('HOMELESS: PUMPS', 'pumpstation', None),
    ('VOLUNTEERS: MEDICAL', 'medical', None),
    ('REMNANTS: PRISON', 'prison', None),
    ('NETWORK: RADIO', 'radio', None),
    ('CARAVANS: TERMINAL', 'terminal', None),
]

_orig_harvest = places.harvest


def harvest():
    res = _orig_harvest()
    for (lab, t, _), r in zip(places.PANELS, res):
        if r['sealed'] == 0:
            sys.exit('REFUSING: %s (%s) has no sealed floor any more. Take it off this sheet; '
                     'a red square on fixed ground is a lie.' % (lab, t))
    return res


places.harvest = harvest

if __name__ == '__main__':
    places.main()
