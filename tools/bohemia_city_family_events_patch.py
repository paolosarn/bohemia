#!/usr/bin/env python3
"""BOHEMIA FAMILY EVENTS (9/7/26, PEOPLE lane).
VAMILY [family events], row FAMILY-EVENTS.

THE ROW: "something writes a child, a marriage, an ageing into family.tree;
selectHeir has zero callers."

MEASURED FIRST, COMMENTS STRIPPED (a comment is a block, not a line): in the
alpha, the city and the demo, runDynasty / selectHeir / family.tree /
foldGeneration / emptyInheritance are ALL ZERO. The RUN lane put the family CAST
in the walked world on 9/4 and it is real -- four people, one lost, on a card he
already opens -- but there is no TREE for them to be in and nothing writes one.

WHAT THIS WIRES, AND NOTHING MORE:
  1. engine/bohemia_family.js inlined into the city, fenced, so the module
     resync sweeps it and it cannot drift from the engine copy.
  2. A TREE built from the family the shell already sent. Who is lost is NOT
     re-decided here -- famHydrate's `alive` is used as-is.
  3. THREE THINGS THAT WRITE TO IT: a marriage (his decision, canon calls it "a
     permanent act one decision"), children (canon: three to four from that
     marriage), and an ageing (canon: the handoff is ~30 years).
  4. THE HEIR RULE, CALLED, from a card a player opens.

WHAT IS DELIBERATELY LEFT: WHO you marry. The coordinator ruled it 9/5 -- "WHO
YOU CAN MARRY stays Paolo's (identity) ... leave marriage a stub with his name on
it" -- so the partner is a stub carrying [PENDING Paolo] and the module itself
THROWS if anybody tries to marry without handing a partner in.

  python3 tools/bohemia_city_family_events_patch.py

Gate: gates/family_events_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MOD = 'engine/bohemia_family.js'
MARK = '__CITY_FAMILY_EVENTS__'

# ---------------------------------------------------------------------------
# 1. THE MODULE, INLINED AND FENCED. The fence is what bohemia_city_module_resync
#    looks for, so a module without one silently drifts from engine/ -- which is
#    exactly the rot that tool exists to kill.
FENCE_AFTER = '/* ==== /engine/bohemia_against.js (THE CROWD CARRIES THE SIGN) ==== */'

# ---------------------------------------------------------------------------
# 2. THE TREE, hung off the family block the RUN lane already ships.
T_OLD = """function famLiving(){
  var f = famHydrate() || [];
  return f.filter(function(m){ return m.alive; });
}"""

T_NEW = r"""function famLiving(){
  var f = famHydrate() || [];
  return f.filter(function(m){ return m.alive; });
}
/* ============================================================================
   __CITY_FAMILY_EVENTS__ (9/7) -- AND NOW SOMETHING WRITES TO IT.

   The family ARRIVED on 9/4 and then never changed again. Measured before this:
   family.tree 0, selectHeir 0, runDynasty 0, in both files that make up the game
   and in the demo. Four people frozen at the cold open, in a game whose whole
   spine is THREE GENERATIONS.

   NOTHING BELOW DECIDES ANYTHING THE CANON ALREADY DECIDED:
     GDD v4 47   the tree carries marriages, children, deaths, heir
     GDD v4 51   the heir is a child, else a sibling's child
     GDD v4 58   DERIVED, hashing seed + gen + candidate ids -- so a reload
                 cannot change who your heir is
     GDD v2 245  married by the end of act one, a permanent act one decision,
                 and THREE TO FOUR CHILDREN from that marriage
     MAYOR 6/30  the handoff is "~30 years", which is the ageing number

   AND WHO IS LOST IS NOT RE-DECIDED HERE. famHydrate's list already carries
   `alive`, resolved by the shell from his 7/19 ruling, and seedTree uses that
   answer rather than recomputing it. The game must never disagree with itself
   about which sibling died.
   ========================================================================== */
var FAMTREE = null;
var FAMT_KEY = 'boh.city.famtree';

/* THE SAME RULE THE FAMILY SAVE SETS: an unreadable blob is discarded WHOLE.
   A half-restored tree is worse than none, because you cannot see it is wrong. */
function famTree(){
  if(FAMTREE) return FAMTREE;
  try{
    var raw = JSON.parse(localStorage.getItem(FAMT_KEY) || 'null');
    if(raw && raw.length && raw[0] && raw[0].rel) FAMTREE = raw;
  }catch(_e){ FAMTREE = null; }
  if(!FAMTREE){
    var fam = famHydrate();
    if(!fam || !fam.length) return null;       /* no family yet, no tree yet */
    try{ FAMTREE = BohemiaFamily.seedTree(fam, null); }catch(_e){ return null; }
    famTreeSave();
  }
  return FAMTREE;
}
function famTreeSave(){
  try{ localStorage.setItem(FAMT_KEY, JSON.stringify(FAMTREE||[])); }catch(_e){}
}
/* THE SEED THE HEIR IS DERIVED FROM. It must be the same string every load or
   the heir changes when he reloads, which GDD v4 58 explicitly forbids. The
   world seed is that string and the game already holds it. */
function famSeedText(){
  try{ if(typeof SEED!=='undefined' && SEED) return String(SEED); }catch(_e){}
  try{ if(typeof WORLD_SEED!=='undefined' && WORLD_SEED) return String(WORLD_SEED); }catch(_e){}
  return 'bohemia';
}

/* A MARRIAGE. His decision, and the PARTNER IS NOT MINE: the coordinator ruled
   9/5 that who you can marry is identity and stays Paolo's. So this hands in a
   STUB carrying his name, and BohemiaFamily.marry throws if anybody ever calls
   it without a partner -- there is no default, on purpose. */
function famMarry(){
  var t = famTree(); if(!t) return null;
  var n = null;
  try{
    n = BohemiaFamily.marry(t, { name:null, draft:true, pending:true,
                                 age:'adult' }, { turn: ctMinuteNow() });
  }catch(_e){ return null; }
  if(n) famTreeSave();
  return n;
}

/* A CHILD, ON A NIGHT THAT PASSES. Canon fixes the COUNT (three to four) and
   BohemiaFamily stops at it, so this cannot run away. THE SPACING IS NOT MINE
   AND IS NOT INVENTED: one per night is the game's own existing beat, and how
   many game days ought to sit between two births needs a days-per-year mapping
   NOBODY HAS RULED. That is [PENDING Paolo] and it is named in the record
   rather than guessed at here. */
function famBorn(){
  var t = famTree(); if(!t) return null;
  var n = null;
  try{ n = BohemiaFamily.bear(t, famSeedText(), { turn: ctMinuteNow() }); }
  catch(_e){ return null; }
  if(n) famTreeSave();
  return n;
}

/* AN AGEING. Takes the years; the fold hands it the canon ~30 and nothing here
   makes a number up. */
function famAge(years){
  var t = famTree(); if(!t) return 0;
  var moved = 0;
  try{ moved = BohemiaFamily.agePeople(t, years); }catch(_e){ return 0; }
  if(moved) famTreeSave();
  return moved;
}

/* THE HEIR RULE, FINALLY CALLED SOMEWHERE A PLAYER CAN REACH. */
function famHeir(gen){
  var t = famTree(); if(!t) return null;
  try{ return BohemiaFamily.heirOf(t, famSeedText(), gen||1); }catch(_e){ return null; }
}
function famHeirSay(gen){
  var t = famTree(); if(!t) return null;
  var id = famHeir(gen); if(!id) return null;
  var n = BohemiaFamily.byId(t, id);
  return n ? BohemiaFamily.say(t, n) : null;
}"""

# ---------------------------------------------------------------------------
# 3. THE NIGHT WRITES THE TREE. onNightfall already exists and already carries
#    the day's other consequences, so a birth lands in the same place the day is
#    paid for rather than behind a timer nobody can see.
N_OLD = """function onNightfall(){"""
N_NEW = r"""function onNightfall(){
  /* __CITY_FAMILY_EVENTS__ -- A NIGHT PASSES AND THE FAMILY CHANGES. Canon
     gives the marriage three to four children (GDD v2 245) and the module stops
     at that count, so this is bounded by his own document and not by a timer.
     Before today the tree could not be written at all. */
  try{ famBorn(); }catch(_e){}"""

# ---------------------------------------------------------------------------
# 4. THE CARD. Straight under WHO YOU LOST, on the card he already opens.
C_OLD = """    }
  }catch(_e){}
  h += '<div class="rrow"><span class="rk">YOUR RUNG</span>'"""

C_NEW = r"""    }
  }catch(_e){}
  /* __CITY_FAMILY_EVENTS__ -- WHAT THE FAMILY HAS BECOME SINCE, under the two
     rows that say who you started with. A family that never changes is not a
     dynasty, and this is the first surface that can show it changing.
     THE HEIR IS SHOWN because GDD v4 51 makes it a fact about the tree, not a
     thing that happens later: there is always an answer, including NOBODY, and
     "a dynasty in crisis" is a real state worth seeing coming. */
  try{
    var _t = famTree();
    if(_t){
      var _sp = BohemiaFamily.spouseOf(_t), _kd = BohemiaFamily.kidsOf(_t);
      if(_sp){
        h += '<div class="rrow"><span class="rk">MARRIED</span><span class="rv">'
           + esc(_sp.name || '[PENDING Paolo]') + '</span></div>';
      } else {
        h += '<div class="rrow"><span class="rk">NOT MARRIED</span><span class="rv">'
           + 'BY THE END OF ACT ONE</span></div>'
           + '<button id="fammarry">Marry</button>';
      }
      if(_kd.length){
        h += '<div class="rrow"><span class="rk">YOUR CHILDREN</span><span class="rv">'
           + esc(_kd.map(function(k){ return BohemiaFamily.say(_t,k); }).join(' · '))
           + '</span></div>';
        var _hs = famHeirSay(1);
        h += '<div class="rrow"><span class="rk">WHO INHERITS</span><span class="rv">'
           + esc(_hs || 'NOBODY YET') + '</span></div>';
      }
    }
  }catch(_e){}
  h += '<div class="rrow"><span class="rk">YOUR RUNG</span>'"""

# ---------------------------------------------------------------------------
# 5. THE BUTTON, BOUND WHERE THE CARD REALLY IS.
#    *** THE FIRST CUT BOUND THIS WITH THE PERSON CARD'S OTHER BUTTONS AND IT
#    COULD NEVER HAVE WORKED. *** The row renders on the STANDING card, built by
#    showStanding into #daycardIn; the person card is a different element built
#    by a different function. Nothing threw and nothing logged -- the button just
#    did nothing. Only pressing it on the real surface found that, which is the
#    whole of why VERIFY ON THE REAL SURFACE is a law and not advice.
#    It binds AFTER cardShow because the node does not exist until the card is
#    in the document.
B_OLD = """  cardShow(h, cardHide);
}"""
B_NEW = r"""  cardShow(h, cardHide);
  /* __CITY_FAMILY_EVENTS__ -- AND THE BUTTON IS BOUND WHERE THE CARD REALLY IS.
     The marriage is a decision, so it is a button he presses. Canon calls it "a
     permanent act one decision" and the module enforces that permanence:
     marry() returns null once a spouse exists, so a second press cannot write a
     second marriage. */
  try{
    var _fmar = document.getElementById('fammarry');
    if(_fmar) _fmar.addEventListener('click', function(){
      try{ famMarry(); }catch(_e){}
      try{ showStanding(); }catch(_e){}   /* redraw the card he is looking at */
    });
  }catch(_e){}
}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if FENCE_AFTER not in html:
        sys.exit('FAILED: the against fence is not in %s, so there is nowhere '
                 'anchored to put the module.' % CITY)
    for name, anchor in [('the family block', T_OLD), ('nightfall', N_OLD),
                         ('the card rows', C_OLD), ('the button handlers', B_OLD)]:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))

    src = open(MOD, encoding='utf-8').read()
    block = ('\n/* ==== engine/bohemia_family.js (THE FAMILY TREE, inlined verbatim) ==== */\n'
             + src
             + '\n/* ==== /engine/bohemia_family.js (THE FAMILY TREE) ==== */\n')
    html = html.replace(FENCE_AFTER, FENCE_AFTER + block, 1)
    html = html.replace(T_OLD, T_NEW, 1)
    html = html.replace(N_OLD, N_NEW, 1)
    html = html.replace(C_OLD, C_NEW, 1)
    html = html.replace(B_OLD, B_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [family events]')


if __name__ == '__main__':
    main()
