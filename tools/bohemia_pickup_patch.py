#!/usr/bin/env python3
"""
V210 -- YOU CAN GO BACK FOR HER  (COMBAT lane, [rescue her] BB-PICKUP)

THE ROW: "YOU CAN GO BACK FOR HER... THE SMALLEST ROW IN THE STUDY AND THE HIGHEST
FEELING PER LINE, AND THE MACHINERY IS ALREADY WRITTEN ON THE OTHER SIDE OF THE
BOARD."

WHY IT MATTERS MORE THAN IT LOOKS, from the study's day 4: permadeath does not
create attachment, it CASHES IN a bond that already exists -- and permadeath is
ruled out here. The channels left are interdependence (already true and measured:
eight foes alone clears 0 of 60 rooms, with her 60%), responsiveness, marks that
persist, and BEING MISSED. This is being missed, and it is the cheapest of the four.

*** MEASURED IN THE DECODED BLOB, AND THE ROW'S OWN POINTER IS EXACT. ***
    ALLY_DOWN_TURNS=99 is DECLARED AND NEVER READ -- one hit in the whole file, its
    own declaration -- with the comment "he stays down; picking him up is not built
    yet and is not pretended". An honest comment on a dead constant.
    She falls properly already: at hp<=0 she goes downed (never dead), the fight
    records when she fell, she draws in red, and the readout says "every gun she was
    holding is back on you". Then nothing, forever.
    AND THEIR SIDE HAS THE WHOLE THING. medicTurn() walks a medic to a downed man
    inside MEDIC_REACH and stands him up, and the scoring above it makes a body on
    the floor DRAG HIM OUT OF COVER -- its comment is "A BODY ON THE FLOOR OUTRANKS
    HIS OWN SKIN, AND THAT IS THE WHOLE FIGHT WITH HIM."

SO THIS IS BUILT AS THEIR RULE, MIRRORED, AND NOT AS A NEW MECHANIC:
    HOW      you WALK TO HER. That is the whole input. It reuses PICKUP_R, the
             same distance the loot already uses for "you got your hands on it",
             and it hangs off the same call site, the one whose comment reads "the
             world moving under him IS him walking". ONE idea of having reached
             something, not two.
    WHAT     she comes up AT THE HEALTH THE GAME LEFT HER, which is the medic's own
             bargain word for word -- "revived at the hp the game left him, which is
             1, so the medic sets no health number at all and a man he stands up
             dies to anything." No health is granted here either.
    COST     she comes up WINDED (stun 1), the medic's own line, because a man does
             not get off the floor shooting. And the real cost is not a number: it
             is the ground you cross under fire to reach her, which is the same
             thing V181 made you pay for loot.

THE ROW'S THREE MUST-NOTS, EACH ANSWERED:
    "must not become a heal button"    -- there is no button. Walking is the input,
                                          and no health number is authored.
    "must not make her invulnerable"   -- she comes up at 1 and the next volley can
                                          put her straight back down. Nothing about
                                          what lands on her changes.
    "must not add a control surface"   -- the 8/31 no-order-menu law. Nothing is
                                          added to the UI at all.

AND THE READOUT HAD TO CHANGE, because a thing he cannot know about does not exist:
the line when she falls said only that her guns were back on him. It says she is
down and reachable now, which is the whole feeling the row is buying.

NO DAMAGE BEFORE THE DIAL: no damage value, no hit chance and no roll is authored.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__PICKUP__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:140]))
    return src.replace(old, new, n)


BLOCK = r"""
/* ===== V210 __PICKUP__ -- YOU CAN GO BACK FOR HER ==========================
   BB-PICKUP. Their medic has done this since V173 and your side had
   ALLY_DOWN_TURNS=99 with a comment admitting it was not built. This is that rule
   mirrored, with nothing new invented: their medicTurn walks to a downed man
   inside MEDIC_REACH and stands him up at the health the game left him, winded.
   WALKING IS THE WHOLE INPUT, which is what keeps this out of the 8/31
   no-order-menu law and off the UI entirely: no button, no order, no menu. It
   reuses PICKUP_R, the distance the loot already calls "how close you walk to pick
   it up", so the fight has ONE idea of having reached something. */
function allyDownAt(){ const A=G.ally; return (A&&A.downed&&!A.dead)?A:null; }
function allyReach(){ const A=allyDownAt(); if(!A)return 1e9;
  /* her own distance, the same edist every body in this fight is measured by */
  return (A.edist==null)?1e9:A.edist; }
function allyPickup(){
  const A=allyDownAt(); if(!A)return false;
  if(G.over)return false;
  if((A.lvl|0)!==myLvl())return false;          /* not through a floor */
  if(allyReach()>PICKUP_R)return false;
  /* AT THE HEALTH THE GAME LEFT HER, which is the medic's own sentence: "revived
     at the hp the game left him, which is 1, so the medic sets no health number at
     all and a man he stands up dies to anything." Her fall clamps hp to 0, so the
     floor of one is the same floor a downed man is already left on -- not a number
     chosen here, and not a heal. */
  A.hp=Math.max(1, A.hp|0);
  A.downed=false; A.broken=false; A.fleeing=false;
  A.stun=Math.max(A.stun||0, 1);                /* winded: nobody gets off the floor shooting */
  A._upAt=performance.now();
  G._alKey=null;                                 /* the same cache key her fall clears */
  /* [draft:true] her words are an attempt, not canon. WORDS owns what she says. */
  try{ A.say='on my feet'; A.sayT=performance.now(); }catch(_e){}
  try{ setRead(ALLY_NAME+' IS UP','winded, and one more hit puts her back down','#8fe89a'); }catch(_e){}
  try{ if(typeof sfxAsk==='function')sfxAsk('key_taken'); }catch(_e){}
  return true; }
/* ===== /V210 __PICKUP__ ===== */
"""


def patch_blob(blob):
    if MARK in blob:
        print('  blob already patched')
        return blob, False

    # 1. the move, declared beside the drop sweep whose idiom it borrows
    blob = sub(blob,
               "/* walking over it takes it. Checked after every world move, because the world\n"
               "   moving under him IS him walking. */",
               BLOCK.strip() + "\n"
               "/* walking over it takes it. Checked after every world move, because the world\n"
               "   moving under him IS him walking. */",
               1, 'blob/block')

    # 2. hung off the SAME call site as the loot sweep: one walk, one check
    blob = sub(blob,
               "try{sweepDrops();}catch(_e){}   /* the world moving under him IS him walking */",
               "try{sweepDrops();}catch(_e){}   /* the world moving under him IS him walking */\n"
               "  /* V210 " + MARK + ": AND YOU CAN GO BACK FOR HER, on the same footfall. One\n"
               "     call site for everything walking to a place gets you, so a step can never\n"
               "     pick up a magazine and miss the woman lying next to it. */\n"
               "  try{allyPickup();}catch(_e){}",
               1, 'blob/hook')

    # 3. the line when she falls has to say she can be reached
    blob = sub(blob,
               "try{ setRead(ALLY_NAME+' IS DOWN','every gun she was holding is back on you','#e8593a'); }catch(_e){}",
               "/* V210 " + MARK + ": AND IT SAYS SHE CAN BE REACHED, because a thing he cannot\n"
               "         know about does not exist. The feeling this row is buying is BEING MISSED\n"
               "         (study day 4: permadeath does not create attachment, it cashes in a bond\n"
               "         that already exists), and it cannot be bought by a mechanic nobody is told\n"
               "         about. [draft:true] */\n"
               "      try{ setRead(ALLY_NAME+' IS DOWN','her guns are back on you \\u2014 go to her and she gets up','#e8593a'); }catch(_e){}",
               1, 'blob/fallread')

    # 4. and the dead constant stops lying about it
    blob = sub(blob,
               "const ALLY_DOWN_TURNS=99;  /* [DIAL] he stays down; picking him up is not built yet and is not pretended */",
               "const ALLY_DOWN_TURNS=99;  /* [DIAL] she stays down until somebody comes for her: nothing\n"
               "                              in the fight stands her up on a timer, and V210 " + MARK + "\n"
               "                              made the only way YOU. The old comment on this line said\n"
               "                              picking her up was not built and was not pretended, which\n"
               "                              was honest then and is a lie now. */",
               1, 'blob/constant')
    return blob, True


def main():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, changed = patch_blob(blob)
    if not changed:
        return
    s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/12w - YOU CAN GO BACK FOR HER\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V210 applied to', ALPHA)


if __name__ == '__main__':
    main()
