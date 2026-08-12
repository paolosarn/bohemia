#!/usr/bin/env python3
"""
CLOSE THE GAME DAY LOOP END TO END (8/11/26).

Paolo's demo row, verbatim: "close the game day loop end to end (hardcode the
demo quests, scaffolding is legal)".

WHAT WAS THERE. A clock:

    const T={day:1, min:8*60};
    function advance(mins){ T.min+=mins; while(T.min>=24*60){T.min-=24*60;T.day++;} }

That is a TIMER, not a day. Nothing woke you, nothing ended, nothing was
reckoned, and day 2 was day 1 with a different number in the corner. Meanwhile
the quest machinery -- a .bq parser, a full quest runtime, 21 canon quests, a
loop engine -- was finished, tested, and in ZERO of the two files the player
loads. Same shape as every defect this lane has chased for a week: the work
exists, it is just not in the surface he taps.

WHAT SHIPS HERE. The loop closes:

    WAKE 06:00 --- 16 waking hours --- NIGHTFALL 22:00 --- THE RECKONING
      ^                                                          |
      +-------------- day + 1, everything carried ---------------+

  * a WAKE card opens the day and states the day's quest in its own words
  * the live objective sits on the HUD the whole day
  * walking into the right place ADVANCES the quest -- into an unlit building on
    day 1 (the world really has a 12% clustered power grid, so a dark block is a
    real thing to find), into a house on day 2, across a district line on day 3
  * a RESOLUTION card offers the quest's real branches, and every button is the
    destination stage's own @LOG line VERBATIM. Not one word is invented; the
    gate checks each button against the .bq byte for byte.
  * the choice really runs the quest's @DO verbs: bonds, faction standing,
    faction posture, objectives. It rides the save.
  * NIGHTFALL on an unresolved quest fires THE QUEST'S OWN FAIL STAGE, written
    by its author for exactly this. The day has teeth and I invented no number
    to give it any: NO DAMAGE BEFORE THE DIAL still holds.
  * the RECKONING card says what the day was, and SLEEP starts the next one.

WHAT IS SCAFFOLD, said plainly. The CASTING. The real placement system casts
@ROLE against people who exist and puts the quest where they are; this binds
stages to world events instead, one quest per day, fixed order. That is a demo,
and it is the honest way to have a playable day before casting is wired.

WHAT IS PAOLO'S AND STAYS EMPTY. What a day COSTS to live. Hunger, exhaustion,
rent, a debt clock: the loop carries a STAKES table built to take any of them,
and it is empty on purpose. MECHANISM-MINE / CONTENTS-PAOLO'S -- I built the
day, he sets the price of one.

REUSE CHECK: cooks no graphic pixels of any kind. Every pixel on the new cards is
CSS in the city's existing palette (--acc #b89a6a, --face #141210, --line
#2a2418, --ink #e7d8bb), which is the Dead Eye Dial's language and already the
whole app's. No bank is opened because nothing is drawn.

Idempotent: re-running finds the marker and reports NOOP.
"""
import json
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__DAY_LOOP__'
MODULES = ['engine/bohemia_bq.js', 'engine/bohemia_quest_runtime.js',
           'engine/bohemia_dayloop.js', 'engine/bohemia_demoquests.js']
QUESTS = ['S01_THE_METER_READER', 'S09_THE_BACK_DOOR', 'S02_THE_SAME_CRATE_TWICE']

# ---- the clock this replaces ------------------------------------------------
OLD_CLOCK = """// ---- game clock: I MOVE YOU MOVE. steps advance time. ----
const T={day:1, min:8*60};
function advance(mins){ T.min+=mins; while(T.min>=24*60){T.min-=24*60;T.day++;} updHud(); }"""

NEW_CLOCK = """// ---- game clock: I MOVE YOU MOVE. steps advance time. ----
/* """ + MARKER + """ -- THE DAY HAS A SHAPE NOW (8/11/26). This was a bare timer:
   minutes accumulated, rolled past midnight, incremented a number, and nothing
   else in the world knew a day had happened. advance() now runs the real day
   loop (engine/bohemia_dayloop.js): it wakes you at 06:00, spends your sixteen
   hours, ends the day at NIGHTFALL 22:00 whether you like it or not, and hands
   the reckoning to the card. T is kept in step because the renderer, the HUD and
   the save all read it, and none of them should have to know the loop exists. */
const T={day:1, min:6*60};
const DAY=BohemiaDayLoop.make();
DAY.wake();
function daySync(){ T.day=DAY.day; T.min=DAY.min; }
function advance(mins){
  const was=DAY.phase;
  DAY.tick(mins, dayWhere());
  daySync();
  if(was==='awake'&&DAY.phase==='ended') onNightfall();
  updHud();
}"""

# ---- the HTML ---------------------------------------------------------------
OLD_HTML = '  <div id="savepanel"></div>'
NEW_HTML = """  <div id="qline"></div>
  <div id="daycard"><div id="daycardIn"></div></div>
  <div id="sleepbtn">\U0001f6cf SLEEP</div>
  <div id="savepanel"></div>"""

OLD_CSS = '<style id="tjScrollFix">'
NEW_CSS = """<style id="dayloopCss">
/* """ + MARKER + """ -- the day loop's surface, in the app's own palette. No new
   art: this is the Dead Eye Dial language the whole city already speaks. */
#qline{position:absolute;left:6px;right:6px;top:6px;z-index:7;pointer-events:none;
  font-size:11px;font-weight:700;letter-spacing:1px;color:var(--acc);
  text-shadow:0 1px 4px #000,0 0 10px #000;line-height:1.35}
#sleepbtn{position:absolute;left:6px;bottom:6px;z-index:7;padding:7px 11px;border-radius:9px;
  background:var(--face);border:1px solid var(--line);color:var(--acc);
  font-size:11px;font-weight:700;letter-spacing:1px}
#sleepbtn:active{border-color:var(--acc);color:#fff}
#daycard{position:absolute;inset:0;z-index:20;display:none;align-items:center;justify-content:center;
  background:rgba(6,5,4,.86);padding:14px}
#daycard.on{display:flex}
#daycardIn{width:100%;max-width:420px;max-height:100%;overflow-y:auto;touch-action:pan-y;
  background:var(--face);border:1px solid var(--line);border-radius:12px;padding:16px 15px;
  box-shadow:0 18px 50px rgba(0,0,0,.7)}
#daycardIn h2{font-size:13px;letter-spacing:3px;color:var(--acc);margin-bottom:4px}
#daycardIn h3{font-size:11px;letter-spacing:2px;color:#8d7c5e;margin:12px 0 5px}
#daycardIn p{font-size:13px;line-height:1.5;color:var(--ink);margin-bottom:8px}
#daycardIn .sub{font-size:11px;color:#8d7c5e;letter-spacing:1px;margin-bottom:10px}
#daycardIn ul{list-style:none;margin-bottom:6px}
#daycardIn li{font-size:12px;line-height:1.5;color:var(--ink);padding-left:12px;position:relative;margin-bottom:3px}
#daycardIn li:before{content:'\\00b7';position:absolute;left:2px;color:var(--acc)}
.dcbtn{display:block;width:100%;text-align:left;margin-top:9px;padding:11px 12px;border-radius:9px;
  background:#1b1813;border:1px solid var(--line);color:var(--ink);font-size:13px;line-height:1.45}
.dcbtn:active{border-color:var(--acc);color:#fff}
.dcbtn .tag{display:block;font-size:10px;letter-spacing:2px;color:var(--acc);margin-bottom:3px}
.dcgo{margin-top:14px;padding:12px;border-radius:9px;background:#1b1813;border:1px solid var(--acc);
  color:var(--acc);font-size:12px;font-weight:700;letter-spacing:2px;text-align:center}
.dcgo:active{background:#2a251d;color:#fff}
</style>
<style id="tjScrollFix">"""

# ---- the runtime glue -------------------------------------------------------
GLUE = """
/* """ + MARKER + """ GLUE -- the day loop, the demo quests, and the three cards.
   SCAFFOLDING WHERE IT SAYS SCAFFOLDING (engine/bohemia_demoquests.js): the
   quests and every word in them are canon, the CASTING is not wired yet. */
const DQ=BohemiaDemoQuests.make({BQ:BQ,BQRuntime:BQRuntime,sources:DEMO_BQ,loop:DAY});
let DAYOPEN=null;

function dayWhere(){
  try{
    const t=(MODE==='human')?om.at((hx/FN)|0,(hy/FN)|0):om.at(city.x,city.y);
    return t?t.district:null;
  }catch(_e){ return null; }
}
/* is the block you are standing on dark? The world's real 12% clustered power
   grid answers this, so "an unlit block" is a place you can actually find. */
function dayDark(){
  try{ const p=POWER.at((hx/FN)|0,(hy/FN)|0); return !(p&&p.live); }catch(_e){ return true; }
}
let _lastDistrict=null;
function dayDistrictCheck(){
  const d=dayWhere();
  if(!d||d===_lastDistrict)return;
  _lastDistrict=d;
  const r=DQ.event('enter_district',{district:d});
  if(r)dayAfterQuest(r);
}
function dayEnteredBuilding(label){
  DAY.entered(label||'a building');
  const r=DQ.event('enter_building',{district:dayWhere(),dark:dayDark(),building:label});
  if(r)dayAfterQuest(r);
}
function dayAfterQuest(r){
  updQline();
  if(r&&r.card){ showChoice(r.card); }
}
function updQline(){
  const el=document.getElementById('qline'); if(!el)return;
  el.textContent=DQ.hudLine()||'';
}

/* ---- the cards ---------------------------------------------------------- */
function cardShow(html,onTap){
  const c=document.getElementById('daycard'), i=document.getElementById('daycardIn');
  i.innerHTML=html; c.classList.add('on');
  i.onclick=function(ev){ const b=ev.target.closest('[data-act]'); if(b&&onTap)onTap(b.dataset.act); };
}
function cardHide(){ document.getElementById('daycard').classList.remove('on'); }
function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function showWake(){
  DAYOPEN=DQ.openDay(DAY.day);
  updQline();
  const o=DAYOPEN;
  let h='<h2>DAY '+DAY.day+'</h2><div class="sub">'+esc(DAY.hhmm(DAY.WAKE_MIN))
       +' \\u00b7 light until '+esc(DAY.hhmm(DAY.NIGHT_MIN))+'</div>';
  if(o){ h+='<h3>'+esc((o.title||'').toUpperCase())+'</h3><p>'+esc(o.log||o.brief)+'</p>';
    const ob=(o.objectives||[]).filter(x=>x.status==='active');
    if(ob.length){ h+='<ul>'+ob.map(x=>'<li>'+esc(x.text)+'</li>').join('')+'</ul>'; } }
  h+='<div class="dcgo" data-act="go">GET UP</div>';
  cardShow(h,function(){ cardHide(); if(DQ.pending)showChoice(DQ.pending); });
}

function showChoice(card){
  if(!card)return;
  let h='<h2>'+esc((card.title||'').toUpperCase())+'</h2>'
      +'<div class="sub">'+esc(DAY.hhmm(DAY.min))+' \\u00b7 '
      +(DAY.left()/60).toFixed(1)+'h of light left</div>';
  card.options.forEach(function(o,i){
    h+='<div class="dcbtn" data-act="'+o.stage+'">'
      +(o.tags&&o.tags.length?'<span class="tag">'+esc(o.tags[0].toUpperCase())+'</span>':'')
      +esc(o.text)+'</div>';
  });
  cardShow(h,function(act){
    const r=DQ.resolve(parseInt(act,10));
    cardHide(); if(r)dayAfterQuest(r);
  });
}

function onNightfall(){
  const r=DQ.nightfall();        /* unresolved -> the quest's OWN fail stage */
  if(r)updQline();
  showReckoning();
}
function showReckoning(){
  const s=DAY.summary();
  let h='<h2>DAY '+s.day+' \\u00b7 '+(s.reason==='slept'?'TURNED IN':'NIGHTFALL')+'</h2>'
       +'<div class="sub">'+esc(s.endedAt)+' \\u00b7 '+s.hoursLived+'h lived'
       +(s.hoursGivenBack?' \\u00b7 '+s.hoursGivenBack+'h given back':'')+'</div>';
  if(s.notes.length){ h+='<h3>WHAT HAPPENED</h3><ul>'+s.notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>'; }
  h+='<h3>THE DAY</h3><ul>';
  h+='<li>'+s.steps+' steps</li>';
  if(s.districts.length)h+='<li>'+esc(s.districts.map(d=>d.name).join(', '))+'</li>';
  if(s.entered.length)h+='<li>went into '+esc(s.entered.join(', '))+'</li>';
  const oc=DQ.outcome();
  if(oc)h+='<li>'+esc((DAYOPEN&&DAYOPEN.title)||'the job')+': '+esc(oc)
        +(DQ.tags().length?' ('+esc(DQ.tags()[0])+')':'')+'</li>';
  h+='</ul>';
  h+='<div class="dcgo" data-act="next">SLEEP \\u2192 DAY '+(s.day+1)+'</div>';
  cardShow(h,function(){ cardHide(); DAY.nextDay(); daySync(); _lastDistrict=null;
    showWake(); updHud(); render(); reportState(); });
}
"""

BOOT = """
/* """ + MARKER + """ BOOT -- open day 1 once the world is up. */
document.getElementById('sleepbtn').addEventListener('click',function(){
  if(DAY.phase!=='awake')return; DAY.sleep(); daySync(); onNightfall(); updHud();
});
setTimeout(function(){ if(!DAY_RESTORED) showWake(); else updQline(); },60);
"""

# entering a building: the hook is inEnter's own success return
OLD_ENTER = """  try{ doorSwing((tgtX*73856093)^(tgtY*19349663),tgtX,tgtY); }catch(_e){}
  advance(0.5); return true;"""
NEW_ENTER = """  try{ doorSwing((tgtX*73856093)^(tgtY*19349663),tgtX,tgtY); }catch(_e){}
  try{ dayEnteredBuilding(INSIDE&&INSIDE.label); }catch(_e){}   /* """ + MARKER + """ */
  advance(0.5); return true;"""

# the save has to carry the loop and the quest, or the day loop is a session toy
OLD_SAVE = """      v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
      riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM
    }},'*'); }catch(_e){}
  },800);"""
NEW_SAVE = """      v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
      riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM,
      loop:DAY.serialize(),quest:DQ.serialize()      /* """ + MARKER + """ */
    }},'*'); }catch(_e){}
  },800);"""

OLD_FLUSH = """function flushState(){ if(_svT){clearTimeout(_svT);_svT=null;}
  try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
    v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM
  }},'*'); }catch(_e){} }"""
NEW_FLUSH = """function flushState(){ if(_svT){clearTimeout(_svT);_svT=null;}
  try{ if(window.parent&&window.parent!==window)window.parent.postMessage({bohemiaCityState:{
    v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,
    riding:(typeof RIDING!=='undefined')?RIDING:false,hzoom:HZOOM,
    loop:DAY.serialize(),quest:DQ.serialize()        /* """ + MARKER + """ */
  }},'*'); }catch(_e){} }"""

OLD_RESTORE = """  T.day=st.day||1; T.min=(typeof st.min==='number')?st.min:8*60;"""
NEW_RESTORE = """  T.day=st.day||1; T.min=(typeof st.min==='number')?st.min:8*60;
  /* """ + MARKER + """ -- a day loop that does not survive a reload is a session
     toy, not a loop. The quest's own state (stage, bonds, faction, objectives)
     rides with it, so resuming puts you back mid-job, not back at the wake. */
  if(st.loop&&DAY.restore(st.loop)){ daySync(); DAY_RESTORED=true;
    if(st.quest)DQ.restore(st.quest,DAY.day); else DQ.openDay(DAY.day);
    try{ updQline(); }catch(_e){}
    if(DAY.phase==='ended')try{ showReckoning(); }catch(_e){} }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return

    # 1. the engine bodies + the canon quest text, right before the clock
    bodies = []
    for m in MODULES:
        if not os.path.exists(m):
            sys.exit('FAIL: missing module ' + m)
        # the ==== engine/x.js ==== banner is what tools/bohemia_city_module_resync.py
        # scans for, so these four modules join the ENGINE SYNC sweep and cannot
        # silently drift a week behind their canon bodies.
        # THE BANNER MUST END WITH '==== */' AND NOTHING ELSE. The resync's own
        # scanner is `s.startswith('/* ==== engine/') and s.endswith('==== */')`,
        # so the marker comment that used to trail this line put all four of these
        # modules OUTSIDE the ENGINE SYNC sweep -- silently, for a day, while the
        # 8/11 commit message claimed they had joined it. A claimed reuse that the
        # machine does not actually perform is worse than no claim.
        bodies.append('/* ' + MARKER + ' */\n/* ==== engine/' + os.path.basename(m) + ' ==== */\n'
                      + open(m, encoding='utf-8').read())
    src = {}
    for q in QUESTS:
        p = 'quests/bq/' + q + '.bq'
        if not os.path.exists(p):
            sys.exit('FAIL: missing quest ' + p)
        src[q] = open(p, encoding='utf-8').read()
    bodies.append('/* ' + MARKER + ' -- the three canon .bq quests, VERBATIM. Every\n'
                  '   resolution button in the game is one of these files\' own @LOG lines. */\n'
                  'const DEMO_BQ=' + json.dumps(src) + ';\n'
                  'let DAY_RESTORED=false;')
    block = '\n'.join(bodies) + '\n'

    if OLD_CLOCK not in s:
        sys.exit('FAIL: the bare clock was not found; it may already have moved')
    s = s.replace(OLD_CLOCK, block + NEW_CLOCK, 1)

    for name, old, new in [
        ('html', OLD_HTML, NEW_HTML),
        ('css', OLD_CSS, NEW_CSS),
        ('enter hook', OLD_ENTER, NEW_ENTER),
        ('debounced save', OLD_SAVE, NEW_SAVE),
        ('ios flush', OLD_FLUSH, NEW_FLUSH),
        ('restore', OLD_RESTORE, NEW_RESTORE),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    # the glue goes right after applyRestore so every function it names exists
    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    # district polling rides the existing render tick
    if 'function render(){ if(MODE===' not in s:
        sys.exit('FAIL: render() not found')
    s = s.replace("function render(){ if(MODE===",
                  "function render(){ try{ dayDistrictCheck(); }catch(_e){}   /* " + MARKER + " */\n"
                  "  if(MODE===", 1)

    # boot at the very end of the script body
    tail = s.rfind('</script>')
    if tail < 0:
        sys.exit('FAIL: no closing script tag')
    s = s[:tail] + BOOT + '\n' + s[tail:]

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
