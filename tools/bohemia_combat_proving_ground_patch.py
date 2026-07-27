#!/usr/bin/env python3
"""BOHEMIA - COMBAT v88: THE PROVING GROUND. Seeded arenas, and the point-blank
trade made visible.

Paolo 7/27/26, two rulings in one message:

  "u want to get into point blank range and sprinting and not losing a turn can
   help that. i mean when it comes to shooting theres not a lot of ways to
   increase damage other than hit the killshot. just fun position and yeah.
   maybe its time to add a shuffable arena map fr and add companions maybe?"

RULING 1: NO DAMAGE MULTIPLIERS. "There's not a lot of ways to increase damage
other than hit the killshot." Position does not make the number bigger. Position
makes the killshot LANDABLE. That kills flank-damage, elevation-damage and every
other multiplier before anyone builds one.

RULING 2: POINT BLANK IS THE OFFENSIVE PLAY, and sprint is how you get there.

--- AND RULING 2 IS ALREADY BUILT. IT IS JUST INVISIBLE. -------------------
  G.pkgDiff=Math.max(0,Math.min(4,distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0)));
  function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); }
  function distAccuracy(e){ return 0.97 - distT(e)*0.60; }

Closing to point blank pulls the EASIEST needle pattern in the game, on any
difficulty. It also takes their accuracy on you from 0.37 to 0.97. That is
exactly the trade he described -- easier to kill him, far easier for him to kill
you -- and the player has never been shown either half of it.

Yesterday's audit called this "pointing the wrong way for tension." That was
wrong, and Paolo corrected it. It is the tension.

So this ships the READ, not a new mechanic. Nothing about the model changes.

--- 1. THE SEEDED ARENA ----------------------------------------------------
"maybe its time to add a shuffable arena map fr"

MAP LAW: Claude never designs map layouts. Plumbing only. Paolo places canon.
So this does NOT author arenas. It makes the existing generator DETERMINISTIC and
gives every arena a NUMBER.

BohemiaArena.withDice() swaps in a seeded PRNG for the whole encounter build --
cover, spawn layout, looks, weapons, all of it -- then hands Math.random back. One
number reproduces one exact fight, forever.

That is the MAP LAW hook, made literal: I hand him the dice and the notebook. He
plays, finds arenas worth keeping, and says "4417, 6021 and 883 are canon."
Without a seed an arena is random mush you cannot even talk about.

--- 2. SHUFFLE ----------------------------------------------------------------
One button: ARENA #4417. Tap it and the field re-rolls -- new cover, new spawns --
WITHOUT resetting your HP or your streak, so he can flip through a dozen arenas in
a dozen seconds instead of playing a fight per look.

Every shuffle writes "arena 4417" into the comment box, which already has a COPY
button beside it. And it reads that box on the way IN: put a number there and the
button REPLAYS that arena instead of rolling a new one. Re-entering a seed with
zero new UI, using two controls that already exist.

--- 3. THE RANGE READ ---------------------------------------------------------
One line under the dial, live, in plain English:

  POINT BLANK  ·  his dial: EASY  ·  he hits you 97%
  LONG RANGE   ·  his dial: BOHEMIAN  ·  he hits you 37%

Both halves of the trade, on the same line, always. This is the whole of Ruling 2
made legible, and it is the same defect class as the SUPPRESS complaint he has now
made three times: a real mechanic nobody can see is not a mechanic yet.

NOT IN THIS PATCH: COMPANIONS. He said "maybe?" and it is a whole system with a
dozen unruled decisions in it (who they are, what they cost, whether they can die,
whether you order them). Building one on spec while he is asking a question is
exactly what STOP PRODUCING forbids. The arena is what companions get tested IN,
so it comes first either way.

REUSE CHECK: no art or audio assets are cooked, read or written. One PRNG, one
wrapper around the existing generator, one button, one read line. The arena
generator itself is untouched -- it just rolls known dice now.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_proving_ground_patch.py
Gate:  node gates/combat_lab_gate.js   (section 24)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V88 THE PROVING GROUND'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


CORE = r"""/* ===== V88 THE PROVING GROUND =======================================
   Paolo: "maybe its time to add a shuffable arena map fr".
   MAP LAW: Claude never designs map layouts, plumbing only, Paolo places canon.
   So this authors NOTHING. It makes the encounter build DETERMINISTIC and gives
   every arena a NUMBER, which is the MAP LAW hook made literal -- I hand him the
   dice and the notebook, he says which numbers are canon. An arena without a seed
   is random mush you cannot even talk about, let alone keep. */
function bohemiaDice(a){ return function(){ a|=0; a=a+0x6D2B79F5|0;
  var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
var BohemiaArena=(function(){
  var seed=null;
  function roll(){ seed=1+Math.floor(Math.random()*99998); return seed; }
  function get(){ return seed; }
  function set(s){ s=parseInt(s,10); if(!(s>=1&&s<=99999))return null;
    seed=s; return seed; }
  /* run the whole encounter build on the arena's own dice, then give Math.random
     straight back. Cover, spawn layout, looks, weapons -- one number reproduces
     one exact fight, forever. */
  function withDice(fn){ if(seed==null)roll();
    var real=Math.random;
    Math.random=bohemiaDice(seed*2654435761);
    try{ return fn(); } finally { Math.random=real; } }
  return { roll:roll, get:get, set:set, withDice:withDice, dice:bohemiaDice }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaArena;
/* ===== V88 ARENA CORE END ===== */
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- the core, in front of the generator it wraps ------------------------
    demo = sub1(demo, 'function setupEnemies(){ const prev=G.e||[];',
        CORE +
        "/* V88: the encounter build runs on the arena's dice. The generator below is\n"
        "   UNTOUCHED -- it just rolls known dice now, so #4417 is #4417 forever. */\n"
        "function setupEnemies(){ return BohemiaArena.withDice(setupEnemiesBody); }\n"
        "function setupEnemiesBody(){ const prev=G.e||[];",
        'arena core + deterministic generator')

    # --- the button --------------------------------------------------------
    demo = sub1(demo,
        '<button id="newenc" class="cbtn">NEW&nbsp;ENCOUNTER</button>',
        '<button id="newenc" class="cbtn">NEW&nbsp;ENCOUNTER</button>\n'
        '    <button id="arenabtn" class="cbtn" style="border-color:#c8a23a;color:#e8c88a"'
        ' title="re-roll the arena. put a number in the comment box to replay that one">ARENA</button>',
        'arena button')

    # --- the range read line ------------------------------------------------
    demo = sub1(demo,
        '<div id="patlbl2" style="font-size:10px;color:#8a7d66;min-height:12px;letter-spacing:1px;"></div>',
        '<div id="patlbl2" style="font-size:10px;color:#8a7d66;min-height:12px;letter-spacing:1px;"></div>\n'
        '  <!-- V88 THE RANGE READ: both halves of the point-blank trade, always on. -->\n'
        '  <div id="rangeread" style="font-size:10px;min-height:12px;letter-spacing:1px;color:#8a7d66;"></div>',
        'range read line')

    # --- the wiring ---------------------------------------------------------
    demo = sub1(demo,
        "  const wo=D('whatson'); if(wo)wo.addEventListener('click',()=>{ whatsOnHook(); BohemiaWhatsOn.arm();",
        "  /* V88 SHUFFLE THE ARENA. Re-rolls cover and spawns WITHOUT touching your HP\n"
        "     or your streak, so a dozen arenas take a dozen seconds instead of a fight\n"
        "     each. It reads the comment box on the way IN: put a number there and this\n"
        "     REPLAYS that arena instead of rolling. And it writes the new seed back OUT\n"
        "     into the same box, which already has a COPY button beside it -- so keeping\n"
        "     an arena is one tap, and re-entering one costs no new UI at all. */\n"
        "  const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();\n"
        "    const _in=D('lcinput');\n"
        "    /* THE BUG THE CLICK TEST CAUGHT: writing the seed OUT into this box poisons\n"
        "       the read on the way back IN, so the button locked itself to the first\n"
        "       arena and SHUFFLE only ever shuffled once. The box is a REQUEST only when\n"
        "       PAOLO put the number there -- never when I did. */\n"
        "    const _txt=_in?String(_in.value).trim():'';\n"
        "    const _mine=(_txt!==''&&_txt===G._arenaWrote);\n"
        "    const _asked=(_in&&!_mine)?BohemiaArena.set((_txt.match(/\\d{1,5}/)||[])[0]):null;\n"
        "    const s=(_asked!=null)?_asked:BohemiaArena.roll();\n"
        "    G.corpses=[];   /* a new arena is a clean lot: last arena's dead do not haunt this one */\n"
        "    setupEnemies(); updateGeomCover(); buildBoard(); updPlayer();\n"
        "    G.phase='cover'; G.popTarget=-1; G.fireTarget=-1; setPhaseUI(); updGap(); updArenaBtn();\n"
        "    G._arenaWrote='arena '+s; if(_in)_in.value=G._arenaWrote;\n"
        "    setRead('ARENA #'+s, (_asked!=null?'replayed from the box':'fresh cover, fresh spawns')\n"
        "      +' — HP and streak kept','#e8c88a'); });\n"
        "  const wo=D('whatson'); if(wo)wo.addEventListener('click',()=>{ whatsOnHook(); BohemiaWhatsOn.arm();",
        'arena wiring')

    # --- the button label + the range read, both fed from one place ---------
    demo = sub1(demo,
        "function setRead(t,s,col){",
        "/* V88: the arena's number lives ON the button, so he never has to go looking\n"
        "   for which one he is playing. */\n"
        "function updArenaBtn(){ const b=D('arenabtn'); if(!b)return;\n"
        "  const s=BohemiaArena.get(); b.textContent=(s==null)?'ARENA':('ARENA #'+s); }\n"
        "/* V88 THE RANGE READ. Paolo: \"u want to get into point blank range.\" That\n"
        "   trade has been fully built since the dial shipped and has NEVER been shown:\n"
        "   distPkg pulls an EASIER needle pattern the closer you are (on any\n"
        "   difficulty), while distAccuracy takes their hit chance on you from 0.37 to\n"
        "   0.97. Easier to kill him, far easier for him to kill you. Both halves, one\n"
        "   line, always on. A mechanic nobody can see is not a mechanic yet -- the same\n"
        "   defect he has named three times about SUPPRESS. */\n"
        "function updRangeRead(){ const r=D('rangeread'); if(!r)return;\n"
        "  const i=(G.fireTarget>=0)?G.fireTarget:((G.popTarget>=0)?G.popTarget:-1);\n"
        "  const e=(i>=0)?G.e[i]:null;\n"
        "  if(!e||e.dead||G.over){ r.textContent=''; return; }\n"
        "  const tier=rangeTier(e);\n"
        "  const dialTier=Math.max(0,Math.min(4,distPkg(e)+(e.elite?1:0)+(e.gcov?1:-1)+(G.handPeek?1:0)));\n"
        "  const theirs=Math.round(distAccuracy(e)*((e.E&&e.E.acc||0.55)/0.55)*100);\n"
        "  r.innerHTML='<span style=\"color:'+rangeCol(e)+'\">'+tier+'</span>'\n"
        "    +' <span style=\"color:#5a5040\">·</span> his dial: <b style=\"color:#e8c88a\">'+pkgName(dialTier)+'</b>'\n"
        "    +' <span style=\"color:#5a5040\">·</span> he hits you <b style=\"color:'+(theirs>=70?'#e8593a':theirs>=50?'#d69a3a':'#8fe89a')+'\">'\n"
        "    +Math.max(0,Math.min(99,theirs))+'%</b>'; }\n"
        "function setRead(t,s,col){",
        'arena button label + range read')

    # --- keep the read live: it rides the one function that already runs per phase
    demo = sub1(demo,
        "function updGap(){ if(G.phase!=='cover')return; G.pkgDiff=G.userPkg;",
        "function updGap(){ try{updRangeRead();}catch(_e){}   /* V88: the trade is on screen whenever the board is */\n"
        "  if(G.phase!=='cover')return; G.pkgDiff=G.userPkg;",
        'range read rides updGap')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
