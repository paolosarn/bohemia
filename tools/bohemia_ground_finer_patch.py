#!/usr/bin/env python3
"""
BOHEMIA — THE GROUND HE ACTUALLY WALKS ON (8/20/26, SOUND lane).

REUSE CHECK: cooks NOTHING. Every sound this makes audible is one Paolo already
approved in his 270-thumb sweep on 8/12 and has never once heard in the game.
Banks opened: banks/BOHEMIA_SFX_APPROVED_8_17_26.json, to confirm step_concrete,
step_sand and step_wood are approved and to confirm this only ever returns a
surface the bank can answer.

THE DEFECT, AND IT IS APPROVED-BUT-UNUSED ON THE MOST-WALKED SURFACES IN THE
GAME. There are two ground classifiers in this repo:

  sfxGround()    in the RUN slice. Knows six surfaces. Written 8/12 for exactly
                 this, with the reasoning in tools/bohemia_sfx_wire_patch.py:
                 "a sidewalk, a motel floor and deep desert sand all came out as
                 the same footstep he had already heard."
  __surfaceOf()  in BOHEMIA_CITY_WORLD.html. Knows THREE: asphalt, gravel, dirt.
                 And it lumps concrete, sidewalk, walk and slab in WITH asphalt.

And the city world is the one he walks. Paolo asked for it on 7/28 -- "Can you
put the city in the run tab?" -- so the RUN tab shows the city, and every
footstep in the played game goes through the three-surface version. The fine one
sits in a frame the player does not walk in.

SO: step_concrete (approved), step_sand (approved) and step_wood (approved) have
never made a sound in the game, and every sidewalk and every interior floor plays
the roadway footstep. Three sounds he said yes to, silent, on the ground he
covers more than any other.

THE FIX IS ONE FUNCTION, and its own comment invites it: "Read off the tile's OWN
dossier name, so a new surface is one line here rather than a guess at the call
site." The rules are ported from sfxGround rather than reinvented, because that
classifier is the one that already carries his 8/12 ruling and the reasoning for
the order.

ORDER IS THE SPEC. The more specific name wins, and the road test runs before the
concrete test because a drivable surface is asphalt whatever the tile is called.

NOTHING ELSE HAD TO CHANGE. The parent already maps an unknown surface through
`'step_'+d.surface` and then falls back with `if(!APPROVED[ev]) ev='step_dirt'`,
so a new name is safe by construction: it plays the right sound if one is
approved and the old one if not.

step_glass and step_metal are NOT here. He killed all ten candidates, and the run
has no glass or metal ground to report anyway.

  python3 tools/bohemia_ground_finer_patch.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json'

OLD = """function __surfaceOf(c){
  var n = (c && (c.name || c.tile || '') + '').toLowerCase();
  if(/asphalt|road|street|lane|driveway|apron|concrete|sidewalk|walk|pavement|parking|slab/.test(n)) {
    return /gravel/.test(n) ? 'gravel' : 'asphalt';
  }
  if(/gravel|ballast|rock|caliche|hardpan|lag/.test(n)) return 'gravel';
  return 'dirt';
}"""

NEW = """function __surfaceOf(c){
  /* THE GROUND GOT FINER (8/20). This knew three surfaces -- asphalt, gravel,
     dirt -- and lumped concrete, sidewalk, walk and slab in WITH asphalt. Paolo
     approved step_concrete, step_sand and step_wood in his 270-thumb sweep on
     8/12 and had NEVER HEARD ANY OF THEM in the game, because the six-surface
     classifier written that day (sfxGround) lives in the RUN slice and the city
     is what he actually walks -- he asked for the city in the run tab on 7/28.
     So every sidewalk and every interior floor played the roadway footstep.
     The rules below are PORTED from sfxGround, not reinvented: that function is
     the one carrying his ruling and the reasoning for the order.
     ORDER IS THE SPEC. The more specific name wins, and the road test runs
     before the concrete test because a drivable surface is asphalt whatever the
     tile happens to be called.
     SAFE BY CONSTRUCTION: the parent maps 'step_'+surface and then falls back
     with `if(!APPROVED[ev]) ev='step_dirt'`, so a surface with no approved sound
     plays the one it played before rather than going silent.
     step_glass and step_metal are deliberately absent -- he killed all ten, and
     there is no glass or metal ground to report. */
  var n = (c && (c.name || c.tile || '') + '').toLowerCase();
  if(/gravel|ballast|caliche|hardpan|lag|shoulder/.test(n)) return 'gravel';
  if(/asphalt|roadway|road|street|lane|driveway|highway|parking|lot/.test(n))
    return 'asphalt';
  if(/wood|board|plank|porch|deck|parquet|boardwalk/.test(n)) return 'wood';
  if(/sidewalk|walk|concrete|apron|pad|slab|platform|court|patio|curb|floor/.test(n))
    return 'concrete';
  if(/sand|dune|wash|desert|scrub|playa/.test(n)) return 'sand';
  if(/rock/.test(n)) return 'gravel';
  return 'dirt';
}"""


def main():
    bank = json.load(open(BANK, encoding='utf8'))
    for e in ('step_concrete', 'step_sand', 'step_wood'):
        print('  %-14s approved: %s' % (e, len(bank.get(e) or []) or 'NO'))

    s = open(CITY, encoding='utf8').read()
    if 'THE GROUND GOT FINER (8/20)' in s:
        print('  already installed (idempotent, nothing to do)')
        return 0
    if s.count(OLD) != 1:
        print('FAIL: __surfaceOf is not the shape this patch knows (%d matches)'
              % s.count(OLD))
        return 1
    open(CITY, 'w', encoding='utf8').write(s.replace(OLD, NEW, 1))
    print('  __surfaceOf now reports six surfaces instead of three')
    print('  sidewalks and interior floors stop playing the roadway footstep')
    return 0


if __name__ == '__main__':
    sys.exit(main())
