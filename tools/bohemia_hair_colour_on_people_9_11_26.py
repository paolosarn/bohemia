#!/usr/bin/env python3
"""EVERY HEAD IN THE VALLEY -- COOK 2 of 2, 9/11/26. THE CROWD PALETTE.

Cook 1 put eighteen ramps in and named them. This one puts them on people, and it does that
by widening the ONE table that already colours every head rather than writing a second one.

*** HOW A CITIZEN IS COLOURED, READ OUT OF THE FILE BEFORE WRITING A LINE OF THIS. ***
    NPCFactory.pickHair   picks ONE rgb per person, weighted, off their id
    the draw at :8265     luminance-tints the hair layer by that rgb, building its own
                          three-tone ramp from the single colour (dk = colour * 0.32)
    the note at :16571    "NPCFactory has owned skin tone and hair colour since 7/2 and is
                          what the RUN already uses ... No second mechanism is written for
                          skin or hair -- ENGINE SYNC LAW."

So per-person hair colour is not missing. THE LIST IT PICKS FROM IS SEVEN LONG. That is the
whole of "the more the better": null, near-black, dark blonde, brown, a dusty pink, a grey,
a bright red. Nineteen colours in the file and seven of them reachable by a citizen.

WHAT THIS COOK CHANGES, ALL OF IT IN THAT ONE PLACE:

1. THE LIST GOES 7 -> 21, AND IT IS NOT RETYPED. The tool READS the twenty ramp mids out
   of HAIR_RAMPS (cook 1) and builds the crowd entries from them, so the colour a hair
   GARMENT bakes and the colour the crowd TINTS with are the same blonde by construction,
   not by me copying six numbers correctly. Paolo's two existing dyes (the dusty pink
   196,150,150 and the red 200,60,40) are KEPT as named entries -- his colours do not get
   deleted to make room for mine -- plus null, the painted art default.

2. THE WEIGHTS KEEP THE 8/27 RULING AND EXTEND IT. That ruling measured this exact factory
   on 600 citizens and found the two loudest colours were the two most common heads and
   BLACK WAS THE RAREST, because seven entries were picked uniformly. Its shape holds here:
   black and brown dominate, blonde is a minority, natural red is 1-2%, grey is age, dye is
   a statement. Out of 200:
       natural dark   87   (43.5%)  black 30, brown 30, ash 15, jet 12
       art default    24   (12.0%)  the painted ramp, untinted
       natural light  46   (23.0%)  sand 20, auburn 8, platinum 6, ginger 4, rust 4, bleach 4
       the grey family 32  (16.0%)  grey 16, steel 10, white 6
       dye            11    (5.5%)  acid 2, moss 2, magenta 2, teal 2, violet 1, pink 1, red 1
   Grey was 7% and is now 16%, which is the half of his complaint that was real: RAY the
   father, the Church and the old wide-brim citizen could not go grey because grey was one
   entry in seven at 7%.

   *** AND GREY IS NOT LEANING ON AGE, BECAUSE THE CROWD HAS NO AGE. *** I nearly shipped a
   comment claiming "the look module carries an age band per person" and it does not:
   bodyFor returns six numeric dials (height, belly, arms, shoulders, armLength, hips) and
   nothing else. The file already says so at :5226 in somebody else's hand -- "the street
   has no age at all ... fixing it for the crowd means giving the crowd real ages, which is
   a system, not a line". They were right and I did not read it first. 16% is the share of
   a mixed adult street, applied flat. WHO is grey waits on the crowd having ages.
   -> [FOR PEOPLE] grey should follow age once a citizen has one; the hook is HAIR_WEIGHTS.

3. THE ENGINE NEVER GOT THE 8/27 FIX, AND THAT IS A REAL BUG THIS TOOL CLOSES.
   engine/bohemia_engine.js has HAIR_COLORS but NO HAIR_WEIGHTS and NO pickHair -- its
   npcFrom still calls the UNIFORM this.pick. So the engine's crowd is the exact parade the
   8/27 measurement condemned, one head in seven bright red, and has been for two weeks.
   ENGINE SYNC LAW says the two agree. This cook writes the weights AND the weighted pick
   into the engine, so both copies pick the same way.

4. THE FACE MAKER GETS THE SAME EIGHTEEN. HE CAN BUILD HIS OWN FACE is a law, and its hair
   swatch row offered seven. Same names, same mids, one palette everywhere.

EXACTLY ONE rng.next() IS STILL CONSUMED, list length notwithstanding -- pickHair walks the
weights after a single roll. So every citizen's clothes, body and skin are byte-for-byte
what they were and the only thing that moves is hair. That is the 8/27 author's property and
I am not spending it.

    python3 tools/bohemia_hair_colour_on_people_9_11_26.py
"""
import io, re, sys

ALPHA  = 'slices/BOHEMIA_ALPHA_0_9.html'
ENGINE = 'engine/bohemia_engine.js'
MARK   = '__HAIR_ON_EVERY_HEAD__'

OLD_LIST = ("var HAIR_COLORS=[null,[20,18,22],[150,120,80],[110,70,50],"
            "[196,150,150],[80,80,90],[200,60,40]]; // null = art default")
OLD_WEIGHTS = "var HAIR_WEIGHTS=[22, 34, 13, 20, 2, 7, 2];   // parallel to HAIR_COLORS"

# name -> weight out of 200. Every name here must be a HAIR_RAMPS name (asserted below),
# except ART (the painted default) and Paolo's two legacy dyes, which carry their own rgb.
PLAN = [
    # --- natural dark, 87 ----------------------------------------------------------
    ('BLACK',    30, None), ('BROWN', 30, None), ('ASH', 15, None), ('JET', 12, None),
    # --- the painted art default, 24 -----------------------------------------------
    ('ART',      24, 'null'),
    # --- natural light and natural red, 46 -----------------------------------------
    ('SAND',     20, None), ('AUBURN', 8, None), ('PLATINUM', 6, None),
    ('GINGER',    4, None), ('RUST',   4, None), ('BLEACH',   4, None),
    # --- the grey family, 32 (age, applied flat until the crowd has ages) ----------
    ('GREY',     16, None), ('STEEL', 10, None), ('WHITE', 6, None),
    # --- the dye, 11 (a statement: COLOUR IS TERRITORY applied to a head) ----------
    ('ACID',      2, None), ('MOSS',   2, None), ('MAGENTA', 2, None), ('TEAL', 2, None),
    ('VIOLET',    1, None),
    # Paolo's own two, kept at his exact values -- they are H_PNK.mid and H_RED.mid now,
    # so they come from the ramp table like every other colour and can reach a BODY.
    ('PINK',      1, None),
    ('RED',       1, None),
]
# which of the above are DYE. Declared here, exported to the page, and read by
# talking_portrait_gate so the gate can never again count a colour nobody wears.
DYES = ['ACID', 'MOSS', 'MAGENTA', 'TEAL', 'VIOLET', 'PINK', 'RED']


def ramp_mids(src):
    """the twenty mids, read out of HAIR_RAMPS rather than retyped."""
    tbl = re.search(r'var HAIR_RAMPS=window\.HAIR_RAMPS=\{(.*?)\};', src, re.S)
    if not tbl:
        return None
    out = {}
    for name, var in re.findall(r'(\w+):(H_\w+)', tbl.group(1)):
        m = re.search(r'var %s=\{dk:\[[\d, ]+\],mid:\[(\d+),(\d+),(\d+)\]' % var, src)
        if not m:
            return None
        out[name] = [int(m.group(1)), int(m.group(2)), int(m.group(3))]
    return out


def build(mids):
    names, cols, wts = [], [], []
    for name, w, override in PLAN:
        if override == 'null':
            cols.append('null')
        elif override is not None:
            cols.append('[%d,%d,%d]' % tuple(override))
        else:
            if name not in mids:
                raise AssertionError('%s is not a HAIR_RAMPS name' % name)
            cols.append('[%d,%d,%d]' % tuple(mids[name]))
        names.append(name); wts.append(w)
    return names, cols, wts


def blocks(names, cols, wts):
    total = sum(wts)
    dye_w = sum(w for n, w in zip(names, wts) if n in DYES)
    grey_w = sum(w for n, w in zip(names, wts) if n in ('GREY', 'STEEL', 'WHITE'))
    lst = ('var HAIR_COLORS=[' + ','.join(cols) + '];   // null = art default\n'
           '/* ' + MARK + ' -- NAMES, PARALLEL TO HAIR_COLORS, so a colour can be talked\n'
           '   about instead of matched on three numbers. */\n'
           'var HAIR_COLOR_NAMES=[' + ','.join("'%s'" % n for n in names) + '];')
    wblk = (
        '/* ' + MARK + ' (Paolo 9/11: "the more the better ... of course add them, bro")\n'
        '   THE LIST WENT 7 -> %d AND THE 8/27 RULING BELOW STILL HOLDS ITS SHAPE. The mids\n'
        '   are READ OUT OF HAIR_RAMPS by the cook, not retyped, so the colour a hair GARMENT\n'
        '   bakes and the colour the crowd TINTS with cannot drift into two different blondes.\n'
        '   Paolo\'s own pink and red are kept; his colours do not get deleted to make room.\n'
        '   Out of %d:  natural dark 87 · art default 24 · natural light 46 ·\n'
        '   the grey family %d · dye %d (%.1f%%, and the cap is 8).\n'
        '   GREY WENT 7%% -> %.0f%%, which is the half of his complaint that was real: RAY, the\n'
        '   Church and the old wide-brim citizen could not go grey because grey was one entry\n'
        '   in seven. *** IT IS FLAT, NOT AGED, BECAUSE THE CROWD HAS NO AGE. *** :5226 says\n'
        '   so already, in somebody else\'s hand, and it is right: bodyFor returns six numeric\n'
        '   dials and no age band. Faking one is how NINA came out grey at a family dinner.\n'
        '   WHO is grey waits on the crowd having real ages; this is the share, applied flat. */\n'
        'var HAIR_WEIGHTS=[%s];   // parallel to HAIR_COLORS, out of %d\n'
        '/* WHICH ENTRIES ARE DYE, DECLARED WHERE THE PALETTE LIVES. talking_portrait_gate\n'
        '   counted dye against two hardcoded triples and warns in its own comment that a\n'
        '   palette change would make it "quietly read zero forever". It reads this now, so\n'
        '   the ruler cannot lose sight of what it measures. */\n'
        'var HAIR_DYES=[%s];'
    ) % (len(names), total, grey_w, dye_w, 100.0 * dye_w / total, 100.0 * grey_w / total,
         ', '.join(str(w) for w in wts), total,
         ','.join("'%s'" % n for n in DYES))
    return lst, wblk


# ---- the engine never got the weighted pick (8/27 landed in the alpha only) -----------
ENG_PICK_OLD = "    hairColor:this.pick(rng,this.hairColors)"
ENG_PICK_NEW = "    hairColor:this.pickHair(rng)"
ENG_PROTO_OLD = ("NPCFactory.prototype.pick=function(rng,arr){if(!arr||!arr.length)"
                 "return null;return arr[Math.floor(rng.next()*arr.length)%arr.length];};")
ENG_PROTO_NEW = ENG_PROTO_OLD + """
/* """ + MARK + """ -- THE ENGINE NEVER GOT THE 8/27 WEIGHTING AND NOBODY NOTICED.
   The alpha grew pickHair on 8/27 after measuring that a uniform pick over seven entries
   made bright red the most common head in the valley. This file kept calling the uniform
   pick, so the engine's crowd has been that parade ever since. ENGINE SYNC LAW: the two
   copies agree. ONE rng.next(), same as the uniform pick it replaces, so clothes, body and
   skin are byte-for-byte unchanged and only hair moves. */
NPCFactory.prototype.pickHair=function(rng){
  var a=this.hairColors,w=this.hairWeights;
  if(!a||!a.length)return null;
  if(!w||w.length!==a.length)return a[Math.floor(rng.next()*a.length)%a.length];
  var t=0,i;for(i=0;i<w.length;i++)t+=w[i];
  var r=rng.next()*t;
  for(i=0;i<w.length;i++){r-=w[i];if(r<=0)return a[i];}
  return a[a.length-1];
};"""
# THE PALETTE DECLARES ITS OWN DYE AND ITS OWN NAMES, AND THE FACTORY CARRIES THEM.
# MEASURED, NOT ASSUMED: a probe asked the loaded page for HAIR_DYES and got sawDyes:false
# -- that whole section is scoped, so only what the factory holds is reachable from outside.
# It also printed portraitDyePct 0.0, which would have read exactly like a clean finding if
# the probe had not printed WHAT IT COULD SEE first. A gate that hardcodes which triples are
# dye goes blind the moment the palette grows; talking_portrait_gate says so in its own
# comment. So the list travels with the factory that picks from it.
CTOR_OLD = "  this.hairColors=opts.hairColors||HAIR_COLORS.slice();"
CTOR_EXTRA = ("\n  /* " + MARK + " -- the palette declares its own dye and its own names, and\n"
              "     the factory carries them, so a ruler can ask what dye IS instead of\n"
              "     hardcoding three numbers and quietly reading zero forever. */\n"
              "  this.hairDyes=opts.hairDyes||HAIR_DYES.slice();\n"
              "  this.hairColorNames=opts.hairColorNames||HAIR_COLOR_NAMES.slice();")
ENG_CTOR_OLD = CTOR_OLD
ENG_CTOR_NEW = (CTOR_OLD + "\n  this.hairWeights=opts.hairWeights||HAIR_WEIGHTS.slice();"
                + CTOR_EXTRA)

# ---- the face maker swatch row (HE CAN BUILD HIS OWN FACE) ----------------------------
FACE_OLD = ('const HAIR_COLORS=[["platinum",null],["black",[34,32,40]],'
            '["blonde",[214,178,96]],["auburn",[150,64,44]],["white",[238,238,244]],'
            '["violet",[150,90,200]],["pink",[222,120,170]]];')


def face_block(mids):
    """the same eighteen, by name, for the swatch row he picks from by hand."""
    order = ['ART', 'JET', 'BLACK', 'ASH', 'BROWN', 'AUBURN', 'GINGER', 'RUST', 'SAND',
             'PLATINUM', 'BLEACH', 'STEEL', 'GREY', 'WHITE', 'ACID', 'MOSS', 'MAGENTA',
             'TEAL', 'VIOLET', 'PINK', 'RED']
    legacy = {}   # both are ramp mids now; nothing here is hardcoded
    out = []
    for n in order:
        if n == 'ART':
            out.append('["art default",null]')
        elif n in legacy:
            out.append('["%s",[%d,%d,%d]]' % ((n.lower(),) + tuple(legacy[n])))
        else:
            out.append('["%s",[%d,%d,%d]]' % ((n.lower(),) + tuple(mids[n])))
    return ('/* ' + MARK + ' -- THE SWATCH ROW OFFERS WHAT THE VALLEY WEARS. HE CAN BUILD\n'
            '   HIS OWN FACE is a law and this row was seven colours wide while the crowd\n'
            '   palette went to twenty-one. Same names, same mids, one palette everywhere. */\n'
            'const HAIR_COLORS=[' + ','.join(out) + '];')


def main():
    src = io.open(ALPHA, encoding='utf-8').read()
    if MARK in src:
        print('  already done (mark present)')
        return 0
    if 'HAIR_RAMPS' not in src:
        print('  the palette is missing; run cook 1 first -- REFUSING')
        return 1
    mids = ramp_mids(src)
    if not mids or len(mids) != 20:
        print('  could not read the twenty ramp mids -- REFUSING')
        return 1
    for needle, why in ((OLD_LIST, 'the crowd list'), (OLD_WEIGHTS, 'the weights'),
                        (FACE_OLD, 'the swatch row')):
        if src.count(needle) != 1:
            print('  %s is not where I left it (%d) -- REFUSING' % (why, src.count(needle)))
            return 1

    names, cols, wts = build(mids)
    lst, wblk = blocks(names, cols, wts)
    alpha_ctor = (CTOR_OLD + "\n  this.hairWeights=opts.hairWeights||HAIR_WEIGHTS.slice();")
    if src.count(alpha_ctor) != 1:
        print('  the alpha ctor is not where I left it (%d) -- REFUSING' % src.count(alpha_ctor))
        return 1
    src = src.replace(alpha_ctor, alpha_ctor + CTOR_EXTRA, 1)
    src = src.replace(OLD_LIST, lst, 1)
    src = src.replace(OLD_WEIGHTS, wblk, 1)
    src = src.replace(FACE_OLD, face_block(mids), 1)

    eng = io.open(ENGINE, encoding='utf-8').read()
    if MARK in eng:
        print('  the engine is already done but the alpha was not -- REFUSING (they drifted)')
        return 1
    for needle, why in ((OLD_LIST, 'the list'), (ENG_PICK_OLD, 'the uniform hair pick'),
                        (ENG_PROTO_OLD, 'the pick prototype'), (ENG_CTOR_OLD, 'the ctor')):
        if eng.count(needle) != 1:
            print('  engine: %s is not where I left it (%d) -- REFUSING' % (why, eng.count(needle)))
            return 1
    if 'pickHair' in eng:
        print('  engine already has pickHair -- REFUSING to write a second one')
        return 1
    eng = eng.replace(OLD_LIST, lst, 1)
    eng = eng.replace(ENG_PROTO_OLD, ENG_PROTO_NEW, 1)
    eng = eng.replace(ENG_CTOR_OLD, ENG_CTOR_NEW, 1)
    eng = eng.replace(ENG_PICK_OLD, ENG_PICK_NEW, 1)
    # the weights block goes in right after the list, where the alpha keeps it
    eng = eng.replace(lst, lst + '\n' + wblk, 1)

    for blob, needle, why in (
            (src, 'var HAIR_DYES=[', 'alpha: the dye declaration'),
            (src, "'MAGENTA'", 'alpha: the new colours'),
            (src, 'HAIR_COLOR_NAMES', 'alpha: the names'),
            (eng, 'NPCFactory.prototype.pickHair=', 'engine: the weighted pick'),
            (eng, 'this.hairWeights=opts.hairWeights', 'engine: the ctor takes weights'),
            (eng, 'hairColor:this.pickHair(rng)', 'engine: npcFrom uses it'),
            (src, 'this.hairDyes=opts.hairDyes', 'alpha: the factory carries the dye list'),
            (eng, 'this.hairDyes=opts.hairDyes', 'engine: the factory carries the dye list'),
            (src, 'this.hairColorNames=opts.hairColorNames', 'alpha: it carries the names'),
            (eng, 'this.hairColorNames=opts.hairColorNames', 'engine: it carries the names')):
        if needle not in blob:
            print('  verify failed, missing ' + why)
            return 1
    # ONE rng.next() per person is the 8/27 author's property; do not spend it
    if src.count('var r=rng.next()*t;') != 1 or eng.count('var r=rng.next()*t;') != 1:
        print('  verify failed: the single-roll pick is not exactly once')
        return 1
    # the two copies must hold the SAME list and the SAME weights
    for blk, why in ((lst, 'list'), (wblk, 'weights')):
        if src.count(blk) != 1 or eng.count(blk) != 1:
            print('  verify failed: the %s is not identical in both copies' % why)
            return 1

    io.open(ALPHA, 'w', encoding='utf-8').write(src)
    io.open(ENGINE, 'w', encoding='utf-8').write(eng)
    t = sum(wts)
    dye = sum(w for n, w in zip(names, wts) if n in DYES)
    grey = sum(w for n, w in zip(names, wts) if n in ('GREY', 'STEEL', 'WHITE'))
    print('  %s + %s: patched.' % (ALPHA, ENGINE))
    print('  %d colours (was 7). dye %.1f%% (cap 8). grey family %.1f%% (was 7).'
          % (len(names), 100.0 * dye / t, 100.0 * grey / t))
    print('  engine got pickHair, which it never had -- its crowd was uniform since 8/27.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
