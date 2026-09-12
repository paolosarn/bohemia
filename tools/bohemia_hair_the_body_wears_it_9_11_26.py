#!/usr/bin/env python3
"""THE BODY WEARS THE COLOUR THE PORTRAIT IS WEARING -- COOK 3, 9/11/26.

*** I SHIPPED TWENTY-ONE HAIR COLOURS AND THEN I LOOKED AT THEM. ***

Cook 2 measured beautifully: 21 colours, dye 5.6% under a cap of 8, grey 7% -> 15.6%, every
colour reachable, the portrait path agreeing at 5.67%. Then I rendered one real citizen per
colour and put the sheet on screen, and MAGENTA, VIOLET and PINK were blonde.

THE NUMBERS COULD NOT SEE IT. That is twice this session and it is the whole lesson.

WHAT THE PICTURE WAS SHOWING, MEASURED AFTER:

    92.4% of citizens wear a PERSONLOOK hair GARMENT (2,000 sampled)
    :8263  if a person wears one, the PD hair layer is SKIPPED -- `continue`
    :8265  the luminance tint by `hairColor` lives INSIDE that skipped branch

    citizen bp:95   picked MAGENTA [142,32,92]
      portrait hair     [142,32,92]   exact
      closest pixel anywhere on the BODY   65 away
    bp:170 VIOLET 68 away · bp:5 TEAL 59 away · bp:67 ACID 66 away

So the portrait that pops up when somebody talks has magenta hair and THE PERSON STANDING IN
FRONT OF YOU DOES NOT, for nine citizens in ten. ONE ID, ONE WHOLE PERSON (8/27) is broken
for hair COLOUR. This is the same bug the 8/28 note fixed for the haircut SHAPE -- same two
renderers, same disagreement, and nobody checked the colour half:

    "three quarters of the people in Bohemia had one haircut standing in front of you and a
     different one in the portrait that popped up when they spoke"

AND IT MEANS I OVERCORRECTED IN COOK 1. I removed a wearer-colour override calling it the
second mechanism ENGINE SYNC LAW forbids. Wrong reading. There is ONE colour -- NPCFactory
picks it off your id -- and TWO renderers, and only the portrait honours it. Making the body
honour the SAME colour is that law satisfied, not violated. A second PICKER would violate it.
This is not one: nothing here chooses a colour. It looks one up.

THE FIX IS A LOOKUP, NOT A SYNTHESIS, AND THAT IS ONLY POSSIBLE BECAUSE OF COOK 2. The crowd
entries ARE the ramp mids -- cook 2 built them by reading HAIR_RAMPS rather than retyping.
So a person's rgb resolves back to the exact authored three-tone ramp by name. No blending, no
invented shade, no second palette: the colour the crowd tints with and the ramp a cut bakes
are the same table read from two ends. Cook 2's docstring claimed they could not drift; this
turns the claim into a lookup that would break loudly if they did.

    person's rgb -> NPC_FACTORY.hairColors index -> hairColorNames[i] -> HAIR_RAMPS[name]

Null, the painted art default, and any colour with no ramp both fall through to the ramp the
cut was authored with, which is exactly what "art default" means.

WHAT DOES NOT MOVE, AND WHY THE PINNED HASHES SURVIVE. genHair still bakes opt.ramp whenever
nobody is wearing anything -- and clothes_4x_gate rebuilds genHair with `new Function`, where
the wearer variable does not exist at all. The read is `typeof`-guarded, which is the one form
that cannot throw on an undeclared identifier. The first cut of this used `window.HAIR_WEAR`,
`window` does not exist in that rebuild, it threw, hair drew nothing, and 560 of 1,744 pinned
hashes moved. The gate caught it and was right.

FRAME CACHING NEEDED NOTHING: frameLookHash has carried hairColor since before this, so two
people in the same clothes with different hair already key to different frames. Checked, not
assumed -- the 7/31 "SHUFFLE FIT BUTTON DID NOT WORK BRO!!!" bug was exactly this cache
serving a stale body, and it is the reason that hash is worth reading before touching a look.

    python3 tools/bohemia_hair_the_body_wears_it_9_11_26.py

REFERENCE CHECK (9/12, same duty and same blind spot as cooks 1 and 2).

COMPARED TO: GARM-03 (the cut is one channel, the colour is another), HAIR-01 (hair is one
mass), FACE-03 (identity at small sizes), and this repo's ONE ID, ONE WHOLE PERSON law.

STRUCTURAL RULES TAKEN:
  * GARM-03 -- if colour is its own channel, then the SAME colour has to arrive wherever that
    person is drawn, or the channel carries two different messages about one person. That is
    exactly the defect this cook closes: the portrait honoured the person's colour and the
    body did not, for 92.4% of citizens.
  * HAIR-01 -- because hair is one mass with a dark/mid/light, the fix had to hand genHair a
    real authored RAMP and not a single tint colour. Resolving the person's rgb back to its
    own three-tone ramp preserves the mass; multiplying a flat colour over the sprite would
    not have.
  * FACE-03 -- "identity at small sizes is SIZE AND SPACING, not detail." Hair colour is one
    of the few channels that survives at 56 pixels, which is why a mismatch between the body
    and the portrait is an IDENTITY bug and not a polish bug.

WHAT CHANGED FROM THE REFERENCE: nothing. This cook adds no colour and no shape. It is a
lookup that makes an existing per-person colour arrive at a second renderer.

AND THE MEASUREMENT IS ON RENDERED PIXELS, not on the dials, because the dials agreed the
whole time -- both halves read the same variable and one of them threw it away at draw.
"""
import io, sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_BODY_WEARS_IT__'

# ---- 1. the resolver, beside the palette it reads ------------------------------------
RES_OLD = """    WHITE:H_WHT, ACID:H_ACD, MOSS:H_MOS, MAGENTA:H_MAG, TEAL:H_TEA, VIOLET:H_VIO,
    PINK:H_PNK, RED:H_RED };"""

RES_NEW = RES_OLD + """
  /* """ + MARK + """ -- THE BODY WEARS THE COLOUR THE PORTRAIT IS WEARING.
     MEASURED: 92.4% of citizens wear a hair GARMENT, and a worn garment makes the draw skip
     the PD hair layer -- which is where the luminance tint by `hairColor` lives. So nine
     citizens in ten had the right hair colour in their portrait and the cut's baked colour
     on their body. ONE ID, ONE WHOLE PERSON, broken for colour exactly the way 8/28 found it
     broken for the cut.
     THIS CHOOSES NOTHING. NPCFactory picked the colour off your id; this looks that same rgb
     back up in the same palette it came from and hands over the authored ramp. A second
     PICKER is what ENGINE SYNC LAW forbids, and removing one is why cook 1 overcorrected.
     A LOOKUP, NOT A BLEND, and only possible because cook 2 built the crowd entries FROM
     these mids: the two tables are one table read from two ends. If they ever drift, this
     returns null and the cut keeps its own ramp -- visibly wrong, never silently blended.
     Null, the painted art default, and an unknown colour both fall through to the cut. */
  var HAIR_WEAR=null;
  window.hairWear=function(rgb){
    HAIR_WEAR=null;
    var F=(typeof NPC_FACTORY!=='undefined')?NPC_FACTORY:null;
    if(rgb&&F&&F.hairColors&&F.hairColorNames){
      var k=rgb.join(','),cs=F.hairColors,i;
      for(i=0;i<cs.length;i++){
        if(cs[i]&&cs[i].join(',')===k){ HAIR_WEAR=HAIR_RAMPS[F.hairColorNames[i]]||null; break; } }
    }
    return HAIR_WEAR; };"""

# ---- 2. genHair takes the wearer's ramp when one is set -------------------------------
GEN_OLD = """  function genHair(g,opt){
    var r=opt.ramp,i,o={},S=rsc();"""

GEN_NEW = """  function genHair(g,opt){
    /* """ + MARK + """ -- A CUT IS A SHAPE; THE COLOUR BELONGS TO THE PERSON.
       When somebody is wearing this cut, their colour wins. Nobody wearing it means the cut
       keeps the ramp it was authored with, so every approved look and all 1,744 pinned
       garment hashes are byte-for-byte what they were.
       `typeof` IS NOT A STYLE CHOICE. clothes_4x_gate rebuilds this function with
       `new Function` out of its extracted body, where neither the wearer variable nor
       `window` exists. The first cut of this reached for the wearer ramp as a property of
       `window`, which THREW there -- hair drew nothing and 560 of the 1,744 hashes moved.
       typeof is the one form that cannot throw on an identifier never declared. */
    var r=((typeof HAIR_WEAR!=='undefined'&&HAIR_WEAR)||opt.ramp),i,o={},S=rsc();"""

# ---- 3. the draw hands the person's colour to their own cut ---------------------------
DRAW_OLD = """    for(const lay of ORD){ const nm=window.G_WORN[lay]; if(!nm)continue;
      const gg=window.GARMENTS.find(x=>x.n===nm); if(!gg||!gg.gen)continue;
      let out=null; try{ out=gg.gen(_gsrc,_gw,_gh); }catch(e){}
      _stampG(out); }"""

DRAW_NEW = """    for(const lay of ORD){ const nm=window.G_WORN[lay]; if(!nm)continue;
      const gg=window.GARMENTS.find(x=>x.n===nm); if(!gg||!gg.gen)continue;
      let out=null;
      /* """ + MARK + """ -- THIS IS THE LINE THAT WAS MISSING. `hairColor` is the colour
         NPCFactory picked for whoever is being drawn, and every caller already sets it: the
         RUN through applyLook, the CHARACTER crowd grid by hand. The portrait has read it all
         along. The body never did, because a worn hair garment skips the layer that reads it.
         SET AND CLEARED AROUND ONE gen() CALL, IN A finally. A colour left standing would
         paint the next head drawn, which is how a per-person property quietly becomes a
         global one -- and gen() is inside a catch that swallows, so a throw must not be able
         to leave it set. */
      const _hw = (lay==='hair'&&window.hairWear)
        ? window.hairWear(typeof hairColor!=='undefined'?hairColor:null) : null;
      try{ out=gg.gen(_gsrc,_gw,_gh); }catch(e){}
      finally { if(lay==='hair'&&window.hairWear) window.hairWear(null); }
      _stampG(out); }"""


def main():
    src = io.open(ALPHA, encoding='utf-8').read()
    if MARK in src:
        print('  already done (mark present)')
        return 0
    if 'HAIR_RAMPS' not in src or 'HAIR_COLOR_NAMES' not in src:
        print('  run cooks 1 and 2 first -- REFUSING')
        return 1
    for needle, why in ((RES_OLD, 'the palette table'), (GEN_OLD, 'genHair'),
                        (DRAW_OLD, 'the worn-garment draw')):
        if src.count(needle) != 1:
            print('  %s is not where I left it (%d) -- REFUSING' % (why, src.count(needle)))
            return 1

    src = src.replace(RES_OLD, RES_NEW, 1)
    src = src.replace(GEN_OLD, GEN_NEW, 1)
    src = src.replace(DRAW_OLD, DRAW_NEW, 1)

    for needle, why in (
            ('window.hairWear=function(rgb)', 'the resolver'),
            ("var r=((typeof HAIR_WEAR!=='undefined'&&HAIR_WEAR)||opt.ramp)", 'genHair reads it'),
            ('window.hairWear(typeof hairColor', 'the draw hands it the person'),
            ('finally { if(lay===\'hair\'&&window.hairWear) window.hairWear(null); }', 'the clear')):
        if needle not in src:
            print('  verify failed, missing ' + why)
            return 1
    # the wearer ramp must never be reached for as a property of `window`: that form throws
    # in clothes_4x_gate's `new Function` rebuild. THE GUARD CANNOT TELL CODE FROM PROSE, and
    # it caught my own COMMENT explaining this the first time I ran it -- same shape as the
    # props_gate arm my comment broke earlier this session. The comment moved, not the guard.
    if 'window.HAIR' + '_WEAR' in src:
        print('  verify failed: window.HAIR_WEAR throws in the clothes gate rebuild -- REFUSING')
        return 1
    # set and cleared exactly once each, so a colour cannot be left standing
    if src.count('window.hairWear(null)') != 1 or src.count('window.hairWear(typeof hairColor') != 1:
        print('  verify failed: the set and the clear are not one each')
        return 1

    io.open(ALPHA, 'w', encoding='utf-8').write(src)
    print('  %s: patched. the body wears the colour the portrait is wearing.' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
