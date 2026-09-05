#!/usr/bin/env python3
"""
THE GROUND HAS A NAME (9/5/26, SOUNDS lane) - every footstep in the valley has
been the dirt one, and the classifier that was supposed to stop that reads two
fields a city cell does not have.

FOUND WHILE WIRING BB-THE-CITY-SENDS-WHERE, and it had to be fixed there and
then: the WHERE message reports STREET or OPEN, and it decides which by asking
__surfaceOf whether there is a road within one cell. If that function cannot
tell a road from a lawn, the new message ships with a field that is permanently
OPEN, which is the same bug I was sent to fix wearing a different hat.

MEASURED ON THE REAL SURFACE, 81x81 cells around the spawn:

    6,561 of 6,561 cells classified 'dirt'
    6,561 of 6,561 cells had an EMPTY name

__surfaceOf reads `c.name || c.tile`. A CITY CELL HAS NEITHER FIELD. It carries
g (a colour), s, walk, q, ecode, artPool, gArtPool, gArtVariant, gTint, face,
wallH, enter. So the regexes below it -- the ported ones, in the order that is
the spec -- have been matching an empty string since the day they landed, and
every step on every road, sidewalk and yard has played step_dirt.

*** AND THE COMMENT ON TOP OF IT SAYS THE OPPOSITE, IN DETAIL. *** It explains
that the rules were ported from sfxGround "not reinvented", that "the road test
runs before the concrete test because a drivable surface is asphalt whatever the
tile happens to be called", and that this is what makes "the road sound like
asphalt and the yard sound like dirt". Every word of that is true about the
rules and none of it was ever reached. Fourth time this month a correct comment
has stood over code that could not run, and the previous three are all written
into the laws. The reason it survived: THE FALLBACK IS A REAL SOUND. `return
'dirt'` is an approved footstep, so the game never went silent, nothing threw,
no gate went red, and the only symptom was that the valley sounded like one
enormous field.

THE FIX IS TO ASK THE FIELD THE CITY ACTUALLY FILLS IN. `gArtPool` is the
ground's own pool name, set by the tile pass off the district legend's KIND and
NAME -- the same two things the dossier law says a legend is for -- and it is on
every ground cell in the world:

    street   drive + marking      the roadway            -> asphalt
    side     walk + gate + kerb + the concrete list      -> concrete
    hyard    the yard, and the default for plain ground  -> dirt
    tf_ls    landscape strip: Vegas rock mulch           -> gravel
    tf_rip   riprap and talus: rock armour               -> gravel
    tf_be*   embankment: the freeway's graded shoulder   -> gravel
    tf_iv*   channel invert: jointed concrete            -> concrete
    tf_bk    channel bank: poured concrete slope         -> concrete
    tf_*     field soil, furrows, silt, the bathtub ring -> dirt

NOTHING IS INVENTED HERE. Every one of those routings is the city's own
sentence about that tile, quoted from the block that assigns the pool: "an
arterial's parkway strip IS Vegas xeriscape", "talus is the rock the wash's
armor is made of", "the freeway's graded shoulder slope IS the berm", "plain
jointed concrete", "a kerb is concrete, it is poured with the walk and it
weathers with it". The pool table already decided what each tile is made of in
order to draw it. This lane just never asked.

AND THE OLD REGEXES STAY, UNDERNEATH, UNCHANGED. They are the answer for
anything with a real name -- an interior floor, a future caller, the run slice's
own cells -- and deleting a rule because it is currently unreachable is how the
next migration strands it again.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new sound. It
routes to step_asphalt, step_concrete, step_gravel and step_dirt, all four
already approved in his 270-thumb sweep on 8/12, and the parent already falls
back with `if(!APPROVED[ev]) ev='step_dirt'` so a surface with no approved sound
plays exactly what it plays today.

  python3 tools/bohemia_the_ground_has_a_name.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_GROUND_HAS_A_NAME__'

ANCHOR = """  var n = (c && (c.name || c.tile || '') + '').toLowerCase();"""

REPLACE = r"""  /* __THE_GROUND_HAS_A_NAME__ (9/5, SOUNDS lane) -- EVERY STEP IN THE VALLEY
     WAS THE DIRT ONE. Measured over 81x81 cells around the spawn: 6,561 of
     6,561 came back 'dirt' and 6,561 of 6,561 had an EMPTY name, because the
     line below reads c.name and c.tile and A CITY CELL HAS NEITHER. The rules
     under it are right, were ported correctly, and have never once been
     reached. It survived because `return 'dirt'` is an APPROVED SOUND: nothing
     went silent, nothing threw, no gate went red, and the only symptom was a
     valley that sounded like one enormous field.
     gArtPool IS THE FIELD THE CITY ACTUALLY FILLS IN. The tile pass sets it off
     the district legend's KIND and NAME -- the two things the dossier law says
     a legend is for -- and every routing below is that block's own sentence
     about the tile, not a new opinion: a kerb is poured with the walk, the
     parkway strip is Vegas rock mulch, talus is the rock the wash's armour is
     made of, the freeway's graded shoulder is the berm, a channel invert is
     plain jointed concrete.
     A MARKING IS PAINT ON A ROAD, so it is the road: markPool is only ever set
     on a drivable surface, and the ported order already says a drivable surface
     is asphalt whatever the tile is called. */
  var pool = (c && (c.markPool ? 'street' : c.gArtPool)) || '';
  if(pool){
    if(pool === 'street') return 'asphalt';
    if(pool === 'side' || pool === 'tf_bk' || pool.indexOf('tf_iv') === 0) return 'concrete';
    if(pool === 'tf_ls' || pool === 'tf_rip' || pool.indexOf('tf_be') === 0) return 'gravel';
    /* hyard is the house yard AND the table's default for plain ground, and
       every other tf_ pool is loose ground: field soil, furrows, cracked silt,
       the ring the lake left. This is what it already played, kept on purpose
       so the commonest ground in the valley does not change under him. */
    if(pool === 'hyard' || pool.indexOf('tf_') === 0) return 'dirt';
  }
  /* AND THE NAME RULES STAY, UNDERNEATH. They are the answer for anything that
     does carry a name -- an interior floor, the run slice's own cells, the next
     caller -- and deleting a rule because it is currently unreachable is how
     the migration stranded this one in the first place. */
  var n = (c && (c.name || c.tile || '') + '').toLowerCase();"""


def main():
    src = open(CITY, encoding='utf8').read()
    print('=== THE GROUND HAS A NAME ===')

    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    if 'function __surfaceOf(c){' not in src:
        print('FAIL: __surfaceOf is not in this city module')
        return 1
    if src.count(ANCHOR) != 1:
        print('FAIL: the name line is not unique (%d)' % src.count(ANCHOR))
        return 1

    src = src.replace(ANCHOR, REPLACE, 1)
    open(CITY, 'w', encoding='utf8').write(src)
    print('  __surfaceOf now reads gArtPool, the field the city fills in')
    print('  wrote %d bytes' % len(src))
    print('  street->asphalt  side->concrete  tf_ls/tf_rip/tf_be*->gravel  '
          'tf_iv*/tf_bk->concrete  hyard and the rest->dirt (unchanged)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
