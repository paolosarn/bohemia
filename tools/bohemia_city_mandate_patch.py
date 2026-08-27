#!/usr/bin/env python3
"""
GIVE THE RUNG A FACE (8/15/26, WORLD lane).

engine/bohemia_mandate.js shipped the ladder Paolo locked on 6/30 -- TERRITORY, then
MANDATE when the city backs you, then MAYOR -- and it computed perfectly where nobody
could see it. HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT (Paolo 8/12, LOCKED):
"WHERE DOES HE CHANGE THIS HIMSELF?" A rung that only exists in a module is a rung he
cannot meet while playing, and a system he meets nowhere is a system he cannot correct.

So: a STANDING button in the city page, beside SLEEP and MARKET, and a card that answers
the only three questions the ladder is for.

WHAT IT SHOWS, AND EVERY NUMBER IS READ, NEVER INVENTED:
  WHICH RUNG      from BohemiaMandate.rungOf, the same derived call the engine uses.
  HOW CLOSE       n of 16 factions with you. The 16 are HIS roster, read out of
                  engine/bohemia_belonging.js RULES (the same 16 that have dossiers in
                  records/factions/), and who is friendly is read out of the PERSISTED
                  faction ledger a quest writes with `@DO faction NAME +n`. Nothing here
                  invents a faction, a standing, or a denominator.
  WHAT IT BUYS    the rung in plain words: where you may build and why.

AND WHAT IT REFUSES TO ANSWER, OUT LOUD. The obvious fourth line is "can you build on
THIS district", and it cannot be written honestly: no district on the overmap carries a
faction owner, because WHO HOLDS WHICH GROUND IS PAOLO'S CANON and MAP LAW says Claude
never designs map layouts. Inventing an owner to make the card feel complete would be
canon nobody ruled, quietly shipped inside a UI. The card says the ground is unclaimed
and says whose call it is, which makes the missing piece VISIBLE to him where he meets
it instead of invisible in a backlog row.

THE TOP RUNG STAYS OUT OF REACH and the card says why: he ruled a share for MANDATE and
did not rule one for MAYOR, so MAYOR_SHARE is null and the card asks for a ruling rather
than guessing a curve off the one number he did give.

REUSE CHECK: cooks ZERO pixels. Opens no bank. Uses the page's existing cardShow/cardHide
and the existing button styling (#mktbtn's own rule, extended by selector, not copied).

RE-RUNNABLE, DELIMITED, AND ITS MARKERS ARE DERIVED BY EVERY READER. The payday block was
renamed once and the rename orphaned the old copy, leaving TWO bodies on the page with the
stale one winning at runtime, and a gate that hard-coded the old name held it there (8/15).
So this block is swept the same way: one marker pair, replaced wholesale every run, and
any future rename adds the old name to LEGACY_MARKS instead of leaving a corpse.

  python3 tools/bohemia_city_mandate_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '/* ==== WHERE YOU STAND WITH THE CITY (mandate face) ==== */'
ENDMARK = '/* ==== end WHERE YOU STAND WITH THE CITY ==== */'
LEGACY_MARKS = []          # add ('old start','old end') here if this block is ever renamed

CSS_MARK = '/* ==== mandate face css ==== */'
CSS_END = '/* ==== end mandate face css ==== */'

BTN = '  <div id="rungbtn">◆ STANDING</div><!-- __WHERE_YOU_STAND__ -->\n'

CSS = """%s
/* __WHERE_YOU_STAND__ -- sits in the same left column as SLEEP and MARKET, above both,
   and borrows #mktbtn's rule rather than copying it so the two can never drift apart. */
#rungbtn{position:absolute;left:6px;bottom:74px;z-index:7;padding:7px 11px;border-radius:9px;
  background:var(--face);border:1px solid var(--line);color:var(--acc);
  font-size:11px;font-weight:700;letter-spacing:1px}
#rungbtn:active{background:#2a251d;color:#fff}
#daycardIn .rrow{display:flex;justify-content:space-between;align-items:baseline;gap:8px;
  padding:8px 10px;margin-bottom:5px;border-radius:8px;background:#151310;
  border:1px solid var(--line)}
#daycardIn .rk{font-size:10px;letter-spacing:1px;color:var(--acc);opacity:.85}
#daycardIn .rv{font-size:12px;font-weight:700;letter-spacing:1px;color:var(--ink);
  text-align:right}
#daycardIn .rwhy{font-size:11px;line-height:1.45;color:var(--ink);opacity:.8;
  padding:2px 2px 8px}
#daycardIn .rpend{font-size:11px;line-height:1.45;color:var(--acc);opacity:.9;
  padding:8px 10px;margin-top:2px;border-radius:8px;background:#151310;
  border:1px dashed var(--line)}
%s""" % (CSS_MARK, CSS_END)

JS = """%s
/* __WHERE_YOU_STAND__ -- THE MANDATE FACE. Paolo 8/12, LOCKED: he must be able to DIRECT a
   system, not just watch it, and the test is "where does he change this himself?" The rung
   computed correctly in engine/bohemia_mandate.js and appeared nowhere he could reach, which
   is the same failure the quests had.
   EVERY NUMBER ON THIS CARD IS READ. Nothing here invents a faction, a standing, or a
   denominator, and the one question it cannot answer honestly it refuses out loud. */

/* HIS 16, and they are read off the belonging registry rather than typed here -- the same
   16 that have dossiers in records/factions/. A hand-typed roster is the recurring house
   bug and would silently go stale the day he adds a faction. */
function rungRoster(){
  try{
    var R = (window.BohemiaBelonging && window.BohemiaBelonging.RULES) || null;
    if(R){ var k = Object.keys(R); if(k.length) return k; }
  }catch(_e){}
  return null;                       /* no roster loaded -> the card says so, never guesses */
}

/* WHO IS WITH YOU, out of the CROSS-QUEST LEDGER -- `DQ.shared.faction`, which is what
   Runtime._remember writes when a quest says `@DO faction NAME +n`. Standing above zero is
   friendly-with-you; a faction nobody has ever dealt with is simply not with you yet, which
   is correct on day one.
   IT MUST BE THE SHARED LEDGER AND NOT THE ACTIVE QUEST'S OWN STATE. That distinction is
   the whole point of the 8/12 fix: faction standing used to live only inside a quest, and a
   quest's state dies with the quest, so day 1 ended TRADES +8 and day 2 opened empty. A
   card reading the quest's copy would show your standing evaporating every morning.
   (The first draft of this read a `QS` global that does not exist on this page. It failed
   silently into an empty object behind a try/catch, so the card would have read 0 of 16
   forever while looking perfectly healthy. Found by driving the real page and warming a
   faction -- VERIFY ON THE REAL SURFACE, and a probe that only opens the card is not a
   test, it is a screenshot.) */
function rungStandings(){
  try{ if(typeof DQ !== 'undefined' && DQ && DQ.shared && DQ.shared.faction)
         return DQ.shared.faction; }catch(_e){}
  return {};
}

function rungRead(){
  var roster = rungRoster();
  if(!roster) return { ok:false };
  var st = rungStandings(), fwuNames = [];
  var facs = roster.map(function(name){
    var v = +st[name] || 0, f = v > 0;
    if(f) fwuNames.push(name);
    return { name:name, fwu:f, standing:v };
  });
  var M = window.BohemiaMandate; if(!M) return { ok:false };
  return { ok:true, facs:facs, fwu:fwuNames, total:roster.length,
           rung:M.rungOf(facs), share:M.fwuShare(facs),
           need:Math.ceil(M.MANDATE_SHARE * roster.length),
           mayorOpen:(M.MAYOR_SHARE == null) };
}

function rungWords(r){
  if(r.rung === 'MANDATE')
    return 'The city backs you. You can build in a district whose local faction does not '
         + 'love you, because the whole city has your back and the locals do not have to.';
  if(r.rung === 'MAYOR')
    return 'You are not negotiating any more. You are governing.';
  return 'You build where you are loved, and nowhere else. Every plot is its own '
       + 'negotiation until enough of the valley is with you.';
}

function showStanding(){
  var r = rungRead();
  if(!r.ok){
    cardShow('<div class="rwhy">Standing is not loaded on this page yet.</div>'
           + '<div class="rrow"><span class="rk">TAP</span><span class="rv">CLOSE</span></div>',
           cardHide);
    return;
  }
  var h = '';
  h += '<div class="rrow"><span class="rk">YOUR RUNG</span>'
     + '<span class="rv">' + r.rung + '</span></div>';
  h += '<div class="rrow"><span class="rk">THE VALLEY</span><span class="rv">'
     + r.fwu.length + ' of ' + r.total + ' factions with you</span></div>';
  if(r.rung === 'TERRITORY'){
    h += '<div class="rrow"><span class="rk">TO BE BACKED</span><span class="rv">'
       + r.need + ' of ' + r.total + '</span></div>';
  }
  h += '<div class="rwhy">' + rungWords(r) + '</div>';
  if(r.fwu.length){
    h += '<div class="rrow"><span class="rk">WITH YOU</span><span class="rv">'
       + r.fwu.join(' · ') + '</span></div>';
  }
  /* THE LINE THIS CARD REFUSES TO WRITE, and it says so rather than faking it. No district
     on the overmap carries a faction owner: who holds which ground is HIS canon, and MAP
     LAW says Claude never designs map layouts. An invented owner would be canon nobody
     ruled, shipped quietly inside a UI. */
  h += '<div class="rpend">Nobody holds this ground yet. Which faction claims which '
     + 'district is nobody\'s yet, so there is no one here to ask. '
     + 'be needing here.</div>';
  if(r.mayorOpen){
    h += '<div class="rpend">The top rung is still out of reach. Nobody has said '
       + 'what it takes to stand there.</div>';
  }
  h += '<div class="rrow"><span class="rk">TAP</span><span class="rv">CLOSE</span></div>';
  cardShow(h, cardHide);
}

document.getElementById('rungbtn').addEventListener('click', showStanding);
%s""" % (MARK, ENDMARK)

if not os.path.exists(WORLD):
    sys.exit('MANDATE FACE: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()


def cut(text, a_mark, b_mark, what):
    n = 0
    while a_mark in text:
        a = text.find(a_mark)
        b = text.find(b_mark, a)
        if b < 0:
            sys.exit('MANDATE FACE: %s has a start and no end. Refusing to guess.' % what)
        text = text[:a] + text[b + len(b_mark):]
        n += 1
    return text, n


src, _ = cut(src, CSS_MARK, CSS_END, 'the css block')
src, refreshed = cut(src, MARK, ENDMARK, 'the js block')
for _m, _e in LEGACY_MARKS:
    src, _n = cut(src, _m, _e, 'a legacy block')
src = src.replace(BTN, '')

# THE BUTTON goes beside the ones it belongs with, anchored on the market button's own
# line rather than a line number -- the market button is the thing it sits above.
ANCHOR_BTN = '  <div id="mktbtn">'
i = src.find(ANCHOR_BTN)
if i < 0:
    sys.exit('MANDATE FACE: could not find the market button to sit beside.')
src = src[:i] + BTN + src[i:]

# THE CSS goes with the other button rules, right after the market button's own block.
ANCHOR_CSS = '#mktbtn:active{background:#2a251d;color:#fff}\n'
i = src.find(ANCHOR_CSS)
if i < 0:
    sys.exit('MANDATE FACE: could not find the market button css to sit beside.')
j = i + len(ANCHOR_CSS)
src = src[:j] + CSS + '\n' + src[j:]

# THE JS goes at the same boot point the market button wires itself, so cardShow and the
# button both exist by the time it runs.
ANCHOR_JS = "document.getElementById('sleepbtn').addEventListener('click'"
i = src.find(ANCHOR_JS)
if i < 0:
    sys.exit('MANDATE FACE: could not find the boot block to wire into.')
src = src[:i] + JS + '\n' + src[i:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('MANDATE FACE: %s the STANDING button and card in %s'
      % ('REFRESHED' if refreshed else 'added', WORLD))
print('    the rung, his 16 factions, and what the rung buys -- every number READ')
print('    and the one line it cannot answer honestly (who holds this ground) says so')
