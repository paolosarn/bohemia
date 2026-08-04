#!/usr/bin/env python3
"""
BOHEMIA CITY CAST (8/3/26, PEOPLE lane) — THE PEOPLE STOP BEING COPIES OF HIM.

Paolo, 8/3, after seeing the first neighbour he could actually talk to:

  "I saw it very good. Maybe we can do more with that but we have so much work.
   We need to do thanks for having one person that I can see. Now we have
   character models just shuffle that character model every time the game looks
   and have it not be a copy of me"

HE IS DESCRIBING EXACTLY WHAT THE CODE DID. The city frame drew every resident
as PLAYER_CV -- the player's own baked body -- run through pplTinted(), which is
a colour shift applied to his finished sprite. Same rig, same clothes, same
everything, in a different colour. Six weeks of wardrobe work and every person
in the valley was him with the hue turned.

AND THE GAME ALREADY HAD THE ANSWER, one iframe away. runSendCast() in the alpha
bakes SIX TOWNSFOLK BODIES for the run: it swaps G.tints (jacket / shirt / pants
/ shoes) and G.equipped.hat, re-bakes the real rig through bake56, and ships
them. Those are genuinely different people -- their own clothes, their own
colourways, a durag on every third one -- built from his own approved rig and
his own approved wardrobe.

The city frame never received them. So:

  ALPHA SIDE   citySendCast() bakes the same six looks the run gets and posts
               them as BOHEMIA_CITY_CAST. It reuses runSendCast's exact
               mechanism (withLook + bake56) rather than inventing a second
               one, and bakes IDLE ONLY, which is all the city's people pass
               draws -- 48 frames instead of 288.

  CITY SIDE    the people pass draws cast.looks[person.look % N] instead of
               tinting the player. If the cast has not arrived yet it falls
               back to the old tinted body, so nobody ever vanishes waiting.

WHICH BODY A PERSON WEARS IS ALREADY DECIDED AND ALREADY STABLE: personFields
gives every person a `look` from their own hash, so the shuffle is deterministic
and a body keeps its clothes. That is the "shuffle every time" he asked for --
per person, not per frame, because a person whose clothes changed as you watched
would be a glitch and not a citizen.

REUSE CHECK: COOKS ZERO PIXELS and opens no bank. Every frame is baked by the
alpha's own bake56 from the rig and wardrobe Paolo already built and already
approved. No new colour, no new garment, no new body. The only thing this
changes is WHICH already-approved body each already-existing person wears.
This is the same mechanism the RUN has used since 7/26 and the same law combat
uses for bodies-that-are-not-you (Paolo 7/3: "enemies are tints of me") -- with
the important difference he just asked for: a tint of the WARDROBE, not a tint
of HIM.

Gate: gates/city_cast_gate.js -- drives the ALPHA and taps the TAB, and counts
DISTINCT painted bodies rather than trusting that a message was sent.

THE CITY MOVED HOUSE ON 8/4, mid-flight. It used to be a base64 constant inside
the alpha (CITY_B64); the CITY lane extracted it to slices/BOHEMIA_CITY_WORLD.html
so the alpha opens 29x faster, and every tool that reached for CITY_B64 stopped
working the moment that landed. This one follows it: the city half is a plain
file edit now, no decode/encode, which is strictly better. The alpha half
(citySendCast) still edits the alpha, because that is where the baking lives.

Idempotent: both injected regions are bracketed and a re-run strips the previous
version first.
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'

MARK = 'CITY CAST'
A_START = '/* ==== CITY CAST (8/3): the neighbours wear their own clothes ==== */'
A_END = '/* ==== /CITY CAST ==== */'
C_START = '/* ==== CITY CAST (8/3): a body that is not his ==== */'
C_END = '/* ==== /CITY CAST (city side) ==== */'

# --------------------------------------------------------------------------
# ALPHA SIDE: bake the same six looks the run gets, post them to the city.
# --------------------------------------------------------------------------
ALPHA_ANCHOR = "/* ===== THE RUN CAST BRIDGE (7/26/26)"
ALPHA_JS = A_START + r"""
/* Paolo 8/3: "now we have character models just shuffle that character model
   every time the game looks and have it not be a copy of me."
   The city drew every resident as the PLAYER's baked body with a colour shift
   over it, so the whole valley was him in different hues. runSendCast() below
   has baked six real townsfolk bodies for the run since 7/26 - its own clothes
   per body, a hat on every third - and the city frame simply never got them.
   This is that bake, aimed at the city. Same withLook + bake56 mechanism, not a
   second one. IDLE ONLY: the city's people pass draws idle frames and nothing
   else, so this is 48 frames rather than 288. */
let CCAST=null;                                   /* bake in flight */
const CITY_LOOKS=6;                               /* the same six the run gets */
function citySendCast(){
  const fr=document.getElementById('cityFrame');
  if(!fr||!fr.contentWindow)return false;
  if(CCAST)return true;
  CCAST=true;
  const out={type:'BOHEMIA_CITY_CAST',w:56,h:56,packed:true,looks:[]};
  const rc=()=>[0,0,0].map(()=>64+Math.floor(Math.random()*150));
  const plan=[];
  for(let i=0;i<CITY_LOOKS;i++){
    const L={tints:{jacket:rc(),shirt:rc(),pants:rc(),shoes:rc()},
             hat:(i%3===0)?'hat/durag':'', dirs:{}};
    plan.push(L); out.looks.push({dirs:L.dirs});
  }
  const withLook=(L,fn)=>{
    const kt=JSON.parse(JSON.stringify(G.tints)),kh=G.equipped.hat;
    G.tints=L.tints;G.equipped.hat=L.hat;
    try{fn();}finally{G.tints=kt;G.equipped.hat=kh;}
  };
  try{
    plan.forEach(L=>{ for(const d of DIRS) withLook(L,()=>{
      L.dirs[d]={idle:bake56(d,'idle',0.25)};
    }); });
    fr.contentWindow.postMessage(out,'*');
  }catch(_e){ CCAST=null; return false; }
  CCAST=null;
  return true;
}
""" + A_END + "\n"

# the city already asks for the player on boot; answer with the cast too
NEED_OLD = "  if(d.type==='BOHEMIA_RUN_NEED_CAST'){runSendCast();return true;}\n"
NEED_NEW = ("  if(d.type==='BOHEMIA_RUN_NEED_CAST'){runSendCast();return true;}\n"
            "  /* " + MARK + ": the city asks for a body on boot; send the CAST too, so\n"
            "     the people standing in it are not six copies of him. */\n"
            "  if(d.type==='BOHEMIA_CITY_NEED_PLAYER'){ try{citySendCast();}catch(_e){} }\n")

# and on city-tab open, beside the player send
OPEN_OLD = "  else if(PANEL==='city'){ citySendPlayer(); }"
OPEN_NEW = ("  else if(PANEL==='city'){ citySendPlayer(); "
            "try{citySendCast();}catch(_e){} }   /* " + MARK + " */")

# --------------------------------------------------------------------------
# CITY SIDE: receive the cast, and draw it instead of tinting the player.
# --------------------------------------------------------------------------
CITY_ANCHOR = ("// ask the parent for the current character as soon as we boot\n")
CITY_JS = C_START + r"""
/* Paolo 8/3: "have it not be a copy of me". Every resident used to be
   PLAYER_CV - his own body - with pplTinted() shifting the hue. These are the
   six townsfolk the alpha bakes from his rig and his wardrobe, each with its own
   clothes. Which one a person wears comes from their own `look`, which
   personFields already gives them, so it is deterministic and a body keeps its
   clothes instead of flickering as you watch. */
var CAST_CV = null;
window.addEventListener('message',function(ev){
  var m=ev&&ev.data; if(!m||m.type!=='BOHEMIA_CITY_CAST'||!m.looks) return;
  var out=[];
  for(var i=0;i<m.looks.length;i++){
    var L=m.looks[i], set={};
    for(var d in L.dirs){ var f=decodePlayerFrame(L.dirs[d].idle); if(f) set[d]={idle:f}; }
    if(Object.keys(set).length) out.push(set);
  }
  if(out.length){ CAST_CV=out; if(MODE==='human')render(); }
});
/* WHICH BODY THIS PERSON WEARS. Null until the bake lands, and the people pass
   falls back to the old tinted body in that window so nobody ever vanishes
   waiting for a message. */
function ctBody(p,dir){
  if(!CAST_CV||!CAST_CV.length) return null;
  var set=CAST_CV[(p.look>>>0)%CAST_CV.length];
  var s=set&&(set[dir]||set.S);
  return s?s.idle:null;
}
""" + C_END + "\n"

# the draw swap, inside peoplePass
DRAW_OLD = ("      const set = PLAYER_CV[dir] || PLAYER_CV.S;\n"
            "      const spr = set && set.idle; if (!spr) continue;\n")
DRAW_NEW = ("      /* " + MARK + " (Paolo 8/3, \"have it not be a copy of me\"): their OWN\n"
            "         body from the baked cast, and only the player's tinted sprite if that\n"
            "         bake has not landed yet. */\n"
            "      const own = (typeof ctBody === 'function') ? ctBody(p, dir) : null;\n"
            "      const set = PLAYER_CV[dir] || PLAYER_CV.S;\n"
            "      const spr = own || (set && set.idle); if (!spr) continue;\n")

BLIT_OLD = "      g.drawImage(pplTinted(dir, p.look, img),\n"
BLIT_NEW = ("      /* " + MARK + ": a cast body is ALREADY this person's clothes - tinting it\n"
            "         again would put a hue over his wardrobe and undo the point. Only the\n"
            "         fallback player sprite still gets the shift. */\n"
            "      g.drawImage(own ? img : pplTinted(dir, p.look, img),\n")


def cut(text, a, b, what):
    i = text.find(a)
    if i < 0:
        print('FAILED: cannot re-apply, %s start marker gone' % what); sys.exit(1)
    j = text.find(b, i)
    if j < 0:
        print('FAILED: cannot re-apply, %s end marker gone' % what); sys.exit(1)
    return text[:i] + text[j + len(b):]


def main():
    alpha = open(ALPHA, encoding='utf8').read()

    # ---- alpha side ----
    if A_START in alpha:
        alpha = cut(alpha, A_START, A_END, 'the alpha bake')
        alpha = alpha.replace(NEED_NEW, NEED_OLD, 1)
        alpha = alpha.replace(OPEN_NEW, OPEN_OLD, 1)
    for name, old in (('run-cast anchor', ALPHA_ANCHOR), ('need-player hook', NEED_OLD),
                      ('city-tab open hook', OPEN_OLD)):
        if alpha.count(old) != 1:
            print('FAILED: %s resolves %d times, not 1' % (name, alpha.count(old))); sys.exit(1)
    alpha = alpha.replace(ALPHA_ANCHOR, ALPHA_JS + ALPHA_ANCHOR, 1)
    alpha = alpha.replace(NEED_OLD, NEED_NEW, 1)
    alpha = alpha.replace(OPEN_OLD, OPEN_NEW, 1)

    # ---- city side: a PLAIN FILE now, not a base64 blob (see the header) ----
    city = open(CITY, encoding='utf8').read()

    if C_START in city:
        city = cut(city, C_START, C_END, 'the city receiver')
        city = city.replace(DRAW_NEW, DRAW_OLD, 1)
        city = city.replace(BLIT_NEW, BLIT_OLD, 1)
        if MARK in city:
            print('FAILED: strip left traces behind'); sys.exit(1)

    for name, old in (('city boot anchor', CITY_ANCHOR), ('the sprite pick', DRAW_OLD),
                      ('the blit', BLIT_OLD)):
        if city.count(old) != 1:
            print('FAILED: %s resolves %d times, not 1' % (name, city.count(old))); sys.exit(1)
    city = city.replace(CITY_ANCHOR, CITY_JS + CITY_ANCHOR, 1)
    city = city.replace(DRAW_OLD, DRAW_NEW, 1)
    city = city.replace(BLIT_OLD, BLIT_NEW, 1)
    open(CITY, 'w', encoding='utf8').write(city)

    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s + %s' % (ALPHA, CITY))
    print('  the neighbours wear their own clothes now, not his')
    return 0


if __name__ == '__main__':
    sys.exit(main())
