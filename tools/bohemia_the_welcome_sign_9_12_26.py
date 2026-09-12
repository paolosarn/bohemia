#!/usr/bin/env python3
"""THE WELCOME TO LAS VEGAS SIGN -- COOK, 9/12/26. [fortress buildings] round 3.

The map has named this cell `sign` at 55,65 since before I held this lane and NOTHING COULD
DRAW IT. Round 2 measured that: seven landmarks the overmap places and no registry can build,
ten cells of bare ground where the most recognisable objects in Las Vegas are supposed to
stand. This is the first of them, and it is first for a reason -- one cell, one shape, and at
96 metres it is honest.

REFERENCE CHECK

COMPARED TO: DIST-02 (Learning From Las Vegas, Venturi/Scott Brown), CB-07 (the same book's
builder half), BLDG-04 (the Strip's three races: pool, sign, porte-cochere), TG-05 (the
commercial lot tile), and the real sign at 5100 Las Vegas Blvd South.

STRUCTURAL RULES TAKEN:
  * DIST-02 -- "a Vegas commercial plot is SIGN + SHED + PARKING IN FRONT; the building hides
    behind its lot." The Welcome sign is that idea with the shed deleted. There is no
    building at all: a sign, a small apron of parking, and the boulevard. It is the purest
    case in the whole reference, which is why it is the right first landmark rather than a
    hard one.
  * CB-07 -- "the LOT's front is parking and the SIGN is taller than the building." Nothing
    here is taller than the sign because nothing else is here. The plan reads as SIGN FIRST.
  * TG-05 -- a commercial lot tile is striped asphalt with seal-coat patches and stop bars,
    "the most readable man-made ground". The parking apron is drawn as a lot, with its bays
    marked, not as a grey rectangle.
  * THE DESERT DOMINANCE LAW (Paolo 7/14, banks/BOHEMIA_STREET_POOLS_HARMONIZED): one
    dominant ground at 85%, accents in COHERENT CLUSTERS, per-cell random shuffle BANNED.
    The five landmarks already here learned that the hard way -- their own comment says
    painting the background as one code "broke the monoblock law five times over". So the
    open ground is hardpan with rock-lag patches laid as blobs, never as noise.

WHAT THE REAL ONE IS, AND WHAT CHANGED:
  Betty Willis, 1959. A steel diamond about 25 ft tall on two poles, standing in the median
  of Las Vegas Boulevard South, with a free parking lot of about a dozen bays added beside it
  in 2008 because people kept stopping on the highway to photograph it.
  CHANGED: it is NOT in the median here, and that is the map's call, not mine. The cell at
  55,65 has ARTERIAL down its entire west side and suburb and commercial on the other three,
  so this plot FRONTS the boulevard rather than sitting inside it. MAP LAW says Claude never
  designs the map; the sign goes where the map already put it and faces the road it has.
  Measured, not assumed -- the 3x3 around the cell was read off a generated map before a
  single line of this was drawn.

AND IT IS ACT ONE, so the lamps are dead, the paint is sun-bleached, and the bays are
cracked. The sign still reads. That is the point of it.

    python3 tools/bohemia_the_welcome_sign_9_12_26.py
"""
import io, sys

LM = 'engine/bohemia_landmarks.js'
WORLD = 'engine/bohemia_world.js'
MARK = '__THE_WELCOME_SIGN__'

ANCHOR = "  var API = { plan: plan };"

BLOCK = '''  /* ============================ THE WELCOME SIGN ============================
     ''' + MARK + ''' (9/12, COOK, [fortress buildings] round 3.)
     WELCOME TO FABULOUS LAS VEGAS NEVADA. Betty Willis, 1959: a steel diamond about 25 ft
     tall on two poles, eight white letters on red circles, a star on top. It is the most
     photographed object in the valley and the map has named this cell since before anyone
     could draw it.
     LEARNING FROM LAS VEGAS (DIST-02) SAYS A VEGAS PLOT IS SIGN + SHED + PARKING IN FRONT.
     This is that plot with the shed deleted -- there is no building here at all, which is
     exactly why it is the first landmark this lane cooks and not the hardest. CB-07: the
     sign is taller than the building. Nothing else is here to be taller than.
     IT FRONTS THE BOULEVARD, IT IS NOT IN THE MEDIAN, and that is the MAP's call rather
     than mine. Read off a generated map before drawing: cell 55,65 has ARTERIAL down its
     whole west side, commercial north-east, suburb east and south. MAP LAW -- Claude never
     designs the map -- so the sign stands on the plot the map gave it and faces the road
     the map gave it. */
  /* VALUES OFF THE FAMILY THE GROUND BELONGS TO, not picked by eye. Hardpan and rock lag
     sit in the same tan band the fort and the other landmarks use; the apron and shoulder
     are asphalt; the only saturated colour in the whole cell is the sign's own red, which
     is the one thing here allowed to shout. */
  var SIGN_PAL = { 0: '#8a7a5e', 1: '#3f3d38', 2: '#9a8a68', 3: '#b9482f', 4: '#c9c1aa',
                   5: '#7a6a50', 6: '#55514a', 7: '#8f8676', 8: '#6a6258',
                   9: '#4a463f', 10: '#c2a86a', 11: '#46433c', 12: '#b09a72',
                   13: '#4a4030', 14: '#84744f', 15: '#5c5140' };
  var SIGN_LEG = {
    0:  { name: 'hardpan', kind: 'ground', act1: 'the open hardpan at the south end of the boulevard, baked pale and cracked' },
    1:  { name: 'boulevard shoulder', kind: 'drive', act1: 'the shoulder where the boulevard runs past (car-drivable)' },
    2:  { name: 'rock lag', kind: 'ground', act1: 'a patch of desert gravel the wind left behind', solid: false },
    3:  { name: 'the sign', kind: 'structure', act1: 'WELCOME TO FABULOUS LAS VEGAS NEVADA. The lamps are dead and the paint has gone chalky, and it still stops you.' },
    4:  { name: 'sign star', kind: 'structure', act1: 'the eight-pointed star on top of the sign, one bulb left in it' },
    5:  { name: 'sign pole', kind: 'structure', act1: 'one of the two steel poles holding the diamond up' },
    6:  { name: 'parking apron', kind: 'drive', act1: 'the free parking apron, cracked and seal-patched (car-drivable)' },
    7:  { name: 'bay stripe', kind: 'ground', act1: 'a parking bay stripe, mostly worn off', solid: false },
    8:  { name: 'kerb', kind: 'structure', act1: 'the low kerb around the apron' },
    9:  { name: 'dead lamp post', kind: 'structure', act1: 'a car park lamp post with nothing in the head' },
    10: { name: 'bollard', kind: 'structure', act1: 'a yellow bollard, sun-bleached to cream' },
    11: { name: 'kerb cut', kind: 'drive', act1: 'the kerb cut off the boulevard into the apron (car-drivable)' },
    12: { name: 'walkway', kind: 'ground', act1: 'the little concrete walk up to the sign', solid: false },
    13: { name: 'dead mesquite', kind: 'tree-dead', act1: 'a mesquite that died when the water stopped', solid: false },
    14: { name: 'sign footing', kind: 'structure', act1: 'the concrete footing the poles stand in' },
    15: { name: 'shadow', kind: 'ground', act1: 'the hard shadow the diamond throws across the hardpan', solid: false }
  };
  var SIGN_NOTES = {
    summary: 'The Welcome to Fabulous Las Vegas sign: a 1959 steel diamond on two poles with a free parking apron beside it, standing on open hardpan at the south end of the boulevard. No building — the sign IS the building.',
    reference: ['Welcome to Fabulous Las Vegas, Betty Willis, 1959, at 5100 Las Vegas Blvd South. A steel diamond roughly 25 ft tall on two poles, eight white letters on red circles spelling WELCOME, an eight-pointed star on top. A free parking lot of about a dozen bays was added beside it in 2008 because drivers kept stopping on the highway to photograph it.',
      'Learning From Las Vegas (Venturi and Scott Brown): a Strip plot is SIGN + SHED + PARKING IN FRONT, and the sign is taller than the building. This plot is that idea with the shed removed.'],
    layout: ['The SIGN stands toward the WEST front of the plot, facing the boulevard, because a Vegas sign faces the road and not the lot.',
      'The PARKING APRON sits behind and beside it with its bays marked, reached by one kerb cut off the boulevard.',
      'Everything else is open hardpan with rock-lag patches: this is the edge of town and it is honestly mostly desert.'],
    circulation: 'The KERB CUT (11) is the only way in off the boulevard shoulder (1). On foot the walkway (12) runs from the apron (6) to the sign footing (14). Nothing here is enterable — there is no interior, which is the whole point of the plot.',
    layering: 'GROUND: hardpan (0), rock lag (2), bay stripes (7), walkway (12), the sign shadow (15), dead mesquite (13). DRIVE: boulevard shoulder (1), parking apron (6), kerb cut (11). STRUCTURE (solid): the sign diamond (3), its star (4), the poles (5), the footing (14), the kerb (8), lamp posts (9), bollards (10).'
  };
  spec('sign', 'leisure', function (c) { return c === 3 || c === 4 || c === 5 || c === 14; },
    SIGN_PAL, SIGN_LEG, SIGN_NOTES, function (a) {
      /* THE GROUND FIRST, AND NOT AS ONE CODE. The desert dominance law (Paolo 7/14) says one
         dominant ground at 85% with accents in COHERENT CLUSTERS and a per-cell shuffle
         BANNED. The five landmarks already in this file broke the monoblock law five times
         over by painting their background flat, and say so in their own comment. Patches. */
      a.rect(a.X0, a.Y0, a.X1, a.Y1, 0);
      a.scatter(0, 2, 70, 5, 18);

      /* THE BOULEVARD IS THE WEST EDGE. The arterial is the NEXT CELL, so what belongs in
         this one is the shoulder it fronts onto -- and STREET-AWARE / DRIVABLE ACCESS LAW
         wants the plot reachable from it. */
      a.rect(a.X0, a.Y0, a.fx(0.10), a.Y1, 1);

      /* THE APRON, behind the sign, with a single kerb cut. Twelve bays in two ranks, which
         is what the real lot has. TG-05: a lot is striped asphalt, so the bays are marked. */
      /* SIZED OFF THE REAL LOT, WHICH IS ALSO WHAT MAKES IT READ. The first cut drew the
         apron 0.30-0.74 across the cell -- about 34 m, a slab that ate the plot and reduced
         to one dark block with no bays left in it. The real free lot is about a dozen bays,
         roughly 30 m x 18 m. Smaller AND more legible, which is usually how it goes when a
         number comes off the real thing instead of off the eye. */
      var AL = a.fx(0.40), AR = a.fx(0.72), AT = a.fy(0.36), AB = a.fy(0.62);
      a.rect(AL, AT, AR, AB, 6);
      a.ring(AL - 2, AT - 2, AR + 2, AB + 2, 2, 8);                 // the kerb around it
      a.rect(a.fx(0.10), a.fy(0.44), AL - 2, a.fy(0.52), 11);       // the kerb cut in
      /* BAYS TWO UNITS WIDE, NOT ONE. A one-unit stripe is 0.75 m and it vanishes the moment
         anything reduces it -- the coarse tile took the whole lot to a flat rectangle. Two
         units survives the 4x the aerial pass uses, and a painted bay line really is about
         1.5 m of paint on a Vegas lot. */
      for (var i = 0; i < 5; i++) {
        var sx = AL + 5 + i * Math.round((AR - AL - 10) / 5);
        a.rect(sx, AT + 2, sx + 1, a.fy(0.47), 7);
        a.rect(sx, a.fy(0.51), sx + 1, AB - 2, 7);
      }
      a.rect(AL, a.fy(0.48), AR, a.fy(0.50), 6);                     // the drive aisle between

      /* THE SIGN. It stands toward the front, facing the boulevard: a Vegas sign faces the
         road, never the lot (DIST-02). Drawn as what a top-down view actually shows -- the
         footing, two poles, the diamond above them and the hard shadow it throws east. */
      /* THE PHOTO APRON. The real reason anyone stops here: a paved pad at the foot of the
         sign where people stand to be photographed under it. It also does the drawing job
         of SEATING the sign on something, which the first cut skipped -- the diamond floated
         on open hardpan and read as a red blob dropped on dirt. */
      a.rect(a.fx(0.12), a.fy(0.38), a.fx(0.30), a.fy(0.56), 12);

      var SX = a.fx(0.21), SY = a.fy(0.44);
      a.rect(SX - 6, SY + 11, SX + 6, SY + 15, 14);                  // concrete footing
      a.rect(SX - 5, SY + 6, SX - 3, SY + 12, 5);                    // pole
      a.rect(SX + 3, SY + 6, SX + 5, SY + 12, 5);                    // pole
      /* THE DIAMOND, widest at its middle row, which is what makes it a diamond and not a
         box at this size. BIGGER THAN THE FIRST CUT (half 7 -> 10) and it is still honest:
         the real sign is about 7.6 m tall and this reads 15 units, which is 11 m, because a
         45-DEGREE view shows a standing sign's FACE and not its plan. A sign has almost no
         plan area at all -- straight down it is a line -- so drawing it at its footprint
         would be drawing nothing, and that is the trap this shape avoids. */
      /* A TRUE DIAMOND ON ITS POINT: half-width falls LINEARLY to 1 at top and bottom. My
         first shape subtracted an extra two near the ends, which rounded the points off and
         turned Betty Willis's diamond into a lens -- rendered, it read as a flying saucer.
         The silhouette IS the landmark here; get the outline wrong and no amount of correct
         colour rescues it. */
      for (var d = 0; d < 15; d++) {
        var half = 8 - Math.round(Math.abs(d - 7) * 8 / 7);
        if (half < 1) continue;
        a.rect(SX - half, SY - 12 + d, SX + half, SY - 12 + d, 3);
      }
      /* the eight letters on their red circles read as a light band across the middle */
      a.rect(SX - 6, SY - 6, SX + 6, SY - 5, 4);
      a.rect(SX - 4, SY - 2, SX + 4, SY - 1, 4);
      a.rect(SX - 2, SY - 16, SX + 2, SY - 13, 4);                   // the star on top
      /* THE SHADOW GOES EAST, because every other tile in this game is lit from the same
         corner and a landmark throwing its shadow the wrong way is the one thing that would
         make it read as pasted on. DARKER THAN THE FIRST CUT: at #6f6249 against #8a7a5e
         hardpan it was three values away and simply did not read, so the sign sat on
         nothing. A Vegas midday shadow is hard and it is dark. */
      for (var sh = 0; sh < 15; sh++) {
        var hw = 8 - Math.round(Math.abs(sh - 7) * 8 / 7);
        if (hw < 1) continue;
        a.rect(SX + 11, SY - 12 + sh, SX + 11 + hw, SY - 12 + sh, 15);
      }

      /* THE SMALL DEAD THINGS. Act one: the lamps are out and the mesquite is finished. */
      a.set(AL + 6, AT - 5, 9); a.set(AR - 6, AT - 5, 9);
      a.set(AL + 6, AB + 5, 9); a.set(AR - 6, AB + 5, 9);
      for (var b2 = 0; b2 < 5; b2++) a.set(a.fx(0.12) + b2 * 3, a.fy(0.40), 10);
      a.set(a.fx(0.84), a.fy(0.22), 13); a.set(a.fx(0.88), a.fy(0.80), 13);
      a.set(a.fx(0.80), a.fy(0.62), 13);
    }, 0);

'''

WORLD_OLD = ("    prison:     { mod:KIT.get('prison'),     "
             "foot:function(r){return r.footprints;}, zone:'institutional', cluster:true },")
# NO cluster:true. The five above are multi-cell blobs; the sign is ONE cell (measured on a
# real map: sign 1, and only the sphere is a blob at 4). Copying cluster:true because the
# neighbours have it is exactly the kind of thing that ships looking fine and is wrong.
WORLD_NEW = ("    /* " + MARK + " -- the Welcome sign, 9/12/26, COOK. Registered here for the same\n"
             "       reason the five below it are: DISTGEN is what the world asks, and a spec that\n"
             "       lives only in the landmark file is a spec nothing can reach. ONE CELL, so no\n"
             "       cluster flag -- it is not a blob like the convention halls or the dam. */\n"
             "    sign:       { mod:KIT.get('sign'),       "
             "foot:function(r){return r.footprints;}, zone:'leisure' },\n"
             + WORLD_OLD)


def main():
    lm = io.open(LM, encoding='utf-8').read()
    if MARK in lm:
        print('  already done (mark present)')
        return 0
    if lm.count(ANCHOR) != 1:
        print('  the landmark API block is not where I left it (%d) -- REFUSING' % lm.count(ANCHOR))
        return 1
    if "spec('sign'" in lm:
        print('  a sign spec already exists -- REFUSING to write a second one')
        return 1
    # *** VALIDATE BOTH FILES BEFORE WRITING EITHER. ***
    # The first cut of this tool wrote the landmark file and THEN checked the world file.
    # The world anchor's spacing was wrong, so it refused -- after it had already written
    # half the change, leaving exactly the drift its own guard exists to prevent. A tool
    # that edits two files has to be all-or-nothing or it is a drift generator.
    w = io.open(WORLD, encoding='utf-8').read()
    if MARK in w:
        print('  the world is already registered but the landmark was not -- REFUSING (drift)')
        return 1
    if w.count(WORLD_OLD) != 1:
        print('  the DISTGEN kit rows are not where I left them (%d) -- REFUSING' % w.count(WORLD_OLD))
        return 1
    if 'sign:' in w.split('var DISTGEN')[1][:6000]:
        print('  DISTGEN already has a sign row -- REFUSING')
        return 1

    lm = lm.replace(ANCHOR, BLOCK + ANCHOR, 1)
    w = w.replace(WORLD_OLD, WORLD_NEW, 1)
    io.open(LM, 'w', encoding='utf-8').write(lm)
    io.open(WORLD, 'w', encoding='utf-8').write(w)
    print('  %s + %s: the Welcome sign is registered and drawable.' % (LM, WORLD))
    return 0


if __name__ == '__main__':
    sys.exit(main())
