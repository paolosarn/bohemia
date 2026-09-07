#!/usr/bin/env python3
"""BOHEMIA NEGLECT COSTS (9/7/26, PEOPLE lane).
VAMILY [neglect costs], row BB-OBLIGATION-BURN.

THE ROW: "THE STAKES TABLE GETS ITS FIRST ENTRY AND IT IS AN OBLIGATION, NOT A
METER ... ONE thing not five meters; it SCALES WITH SUCCESS so a bigger operation
is a bigger obligation; the punishment is a person walking away, not a bar
draining."

MEASURED FIRST: STAKES is [] and applied at every reckoning; upkeep() debits
exactly 1 with no headcount in its signature; desert/leaves/quit/abandon are ZERO
across commitment, favour, standing and claim, so nobody in this valley has ever
stopped waiting for the player; and neglectFor() returns per-stage costs that are
every one of them tagged "neglectPlaceholder": true -- a cost nobody ruled,
consumed by nothing.

IT NEEDS NO RULING, WHICH IS THE ROW'S OWN UNLOCK. A hunger meter needs a RATE.
"Three people are waiting on you" needs nothing but the truth. So the entry
COUNTS and REPORTS, exactly as the day loop's own header says a reckoning must
("The reckoning REPORTS; it does not starve you, drain you, or kill you"), and
the placeholder neglect numbers are deliberately never read.

  python3 tools/bohemia_city_obligation_patch.py

Gate: gates/neglect_costs_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MOD = 'engine/bohemia_obligation.js'
MARK = '__CITY_OBLIGATION__'

FENCE_AFTER = '/* ==== /engine/bohemia_family.js (THE FAMILY TREE) ==== */'

# ---------------------------------------------------------------------------
# THE FACTS, GATHERED AT RECKONING TIME. Hung off the family block, because the
# tree is half of what this reads.
F_OLD = """function famHeirSay(gen){"""

F_NEW = r"""/* ============================================================================
   __CITY_OBLIGATION__ (9/7) -- WHO IS WAITING ON YOU, AND WHO STOPS WAITING.

   The STAKES table has been empty since the day loop shipped, and its own header
   says why: "what a day costs to live is Paolo's ruling, not mine." That is
   right about a HUNGER meter, which needs a rate. It is not right about an
   obligation, which needs only the truth -- and the truth is already in the
   save: who you married, the children you had, and every outfit you swore to.

   NOTHING BELOW READS THE PLACEHOLDER NEGLECT NUMBERS. bohemia_commitment's
   per-stage `neglect` values are all tagged "neglectPlaceholder": true, and
   consuming a number tagged as a placeholder is how a guess becomes canon by
   accident.
   ========================================================================== */
var CT_GONE = {}, CT_GONE_KEY = 'boh.city.gone';
function ctGoneLoad(){
  try{ var raw = JSON.parse(localStorage.getItem(CT_GONE_KEY) || 'null');
       if(raw && typeof raw === 'object') CT_GONE = raw; }catch(_e){ CT_GONE = {}; }
  return CT_GONE;
}
function ctGoneSave(){
  try{ localStorage.setItem(CT_GONE_KEY, JSON.stringify(CT_GONE)); }catch(_e){}
}

/* WHAT AN OUTFIT YOU SWORE TO THINKS OF YOU. Not a new number: the against organ
   already answers this, and it is the organ this lane shipped for [who is
   hostile], so there is exactly one rule for "are they against you" in the game.
   Negative means against, positive means not. */
function ctOblOutfit(fid){
  try{
    if (typeof BohemiaAgainst === 'undefined') return null;
    var rel = ctRelToMine(fid);
    var ans = BohemiaAgainst.read({ rel: rel, rung: null,
                                    coalition: null, roving: null });
    return (ans && ans.level) ? -1 : 1;
  }catch(_e){ return null; }
}

/* DID YOU DO ANYTHING FOR THEM. Read off the ledger the game already writes.
   A deed done ABOUT an outfit is stamped with that outfit on the eyewitness
   copies (ctDeed does it), so showing up for the Cartel means a deed today that
   an eyewitness knows was about the Cartel. Nothing new is recorded. */
function ctOblDeeds(id){
  var out = [];
  try{
    if (String(id).indexOf('fac:') === 0){
      var want = String(id).slice(4).toUpperCase().replace(/[\s_]/g,'');
      for (var k in CT_MINDS){
        var m = CT_MINDS[k]; if (!m || !m.deeds) continue;
        for (var i = 0; i < m.deeds.length; i++){
          var d = m.deeds[i];
          if (!d || d.hops) continue;                 /* eyewitness only */
          if (!d.of) continue;
          if (String(d.of).toUpperCase().replace(/[\s_]/g,'') !== want) continue;
          out.push({ turn: d.turn });
        }
      }
      return out;
    }
    /* KIN. Their mind is the same shape as anybody's, if they have one. */
    var mm = CT_MINDS[id];
    if (mm && mm.deeds) for (var j = 0; j < mm.deeds.length; j++)
      out.push({ turn: mm.deeds[j].turn });
  }catch(_e){}
  return out;
}

function ctOblFacts(){
  var commit = {};
  try{ var sv = ctBelongSave(); commit = (sv && sv.meta && sv.meta.commit) || {}; }
  catch(_e){ commit = {}; }
  return {
    tree: famTree(),
    commit: commit,
    gone: ctGoneLoad(),
    deedsFor: ctOblDeeds,
    opinionOf: function(id){
      if (String(id).indexOf('fac:') === 0) return ctOblOutfit(String(id).slice(4));
      /* *** KIN CANNOT FORM AN OPINION YET AND THAT IS THE HONEST ANSWER. ***
         They are not bodies on the street, so they witness nothing and hear
         nothing: the gossip pass needs two DRAWN people standing together. So
         they are COUNTED as waiting on you and they never leave, because the
         game gives you no way to be there for them and it would be a lie to
         punish you for it. That gap is the next row, and it is written down
         rather than papered over. */
      var op = null; try{ op = ctOpinionOf(id); }catch(_e){}
      return op ? op.value : null;
    }
  };
}

/* WHO ACTUALLY WENT. The module decides; this is the write, because a pure
   module does not reach out and remove somebody from the world. */
function ctOblApply(ids){
  if (!ids || !ids.length) return 0;
  ctGoneLoad();
  for (var i = 0; i < ids.length; i++) CT_GONE[ids[i]] = (T.day|0);
  ctGoneSave();
  return ids.length;
}

function famHeirSay(gen){"""

# ---------------------------------------------------------------------------
# THE ENTRY, PUT IN THE SOCKET -- DIRECTLY UNDER THE MODULE.
#   *** THE FIRST CUT PUSHED IT BESIDE `const DAY = BohemiaDayLoop.make()`, WHICH
#   RUNS ABOUT NINE THOUSAND LINES BEFORE THIS MODULE EXISTS. *** The guard meant
#   to make that safe did its job silently: no throw, no log, an empty STAKES
#   table and a reckoning that reported nothing forever. A guard around an
#   ordering bug hides the ordering bug. Under the module there is no ordering to
#   get wrong, and only driving it on the real surface found it.
S_OLD = """/* ==== /engine/bohemia_obligation.js (WHO IS WAITING ON YOU) ==== */"""
S_NEW = r"""/* ==== /engine/bohemia_obligation.js (WHO IS WAITING ON YOU) ==== */
/* __CITY_OBLIGATION__ -- THE STAKES TABLE'S FIRST ENTRY, AND IT IS AN OBLIGATION
   RATHER THAN A METER. The socket has been applied at every reckoning since the
   day loop shipped and has had nothing in it. Pushed directly under the module
   so there is no load order to get wrong. */
try{
  DAY.STAKES.push(BohemiaObligation.stakesEntry(function(){ return ctOblFacts(); }));
}catch(_e){}"""

# ---------------------------------------------------------------------------
# AND HE READS IT IN THE MORNING, beside what his buildings made overnight.
W_OLD = """  var _hl=''; try{ _hl=houseLine(); }catch(_e){}
  if(_hl) h+='<p>'+esc(_hl)+'</p>';                                 /* draft:true */"""
W_NEW = r"""  var _hl=''; try{ _hl=houseLine(); }catch(_e){}
  if(_hl) h+='<p>'+esc(_hl)+'</p>';                                 /* draft:true */
  /* __CITY_OBLIGATION__ -- WHO WAS WAITING ON YOU YESTERDAY. It goes here, with
     what his city made while he slept, because it is the same kind of sentence:
     what happened because of choices he already made. A morning with nobody
     waiting says nothing at all, which is the honest empty state and not a zero.
     AND WHOEVER STOPPED WAITING IS NAMED, because "a person walking away" that
     you never hear about is a bar draining with extra steps. draft:true. */
  try{
    var _ob = (DAY.history && DAY.history.length)
            ? DAY.history[DAY.history.length-1].obligation : null;
    if(_ob && _ob.waiting){
      h += '<p>'+esc(BohemiaObligation.say(_ob))+'</p>';
      if(_ob.leaving && _ob.leaving.length){
        ctOblApply(_ob.leaving);
        h += '<p>'+esc(_ob.leaving.length===1
              ? 'SOMEBODY STOPPED WAITING FOR YOU.'
              : _ob.leaving.length+' PEOPLE STOPPED WAITING FOR YOU.')+'</p>';
      }
    }
  }catch(_e){}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if FENCE_AFTER not in html:
        sys.exit('FAILED: the family fence is not in %s.' % CITY)
    for name, anchor in [('the family block', F_OLD), ('the day loop', S_OLD),
                         ('the wake card', W_OLD)]:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))

    src = open(MOD, encoding='utf-8').read()
    block = ('\n/* ==== engine/bohemia_obligation.js (WHO IS WAITING ON YOU, inlined verbatim) ==== */\n'
             + src
             + '\n/* ==== /engine/bohemia_obligation.js (WHO IS WAITING ON YOU) ==== */\n')
    html = html.replace(FENCE_AFTER, FENCE_AFTER + block, 1)
    html = html.replace(F_OLD, F_NEW, 1)
    html = html.replace(S_OLD, S_NEW, 1)
    html = html.replace(W_OLD, W_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [neglect costs]')


if __name__ == '__main__':
    main()
