#!/usr/bin/env python3
"""
THE TRADING HUB (8/14/26).

The demo cut, ruled 8/4, row 3, in full: "wake -> 2-3 quests -> walk finished-looking
streets -> one talk, one dial fight -> GET PAID -> SPEND AT A TRADING HUB -> camp ->
sleep-save holds."

GET PAID shipped 8/12. SPEND AT A TRADING HUB did not, and I wrote in my own handoff
that it was blocked on Paolo because "a price is a number, and numbers are his."

THAT WAS WRONG AND I HAD NOT READ THE FILE. He already ruled it, three days earlier:

    @RULING PRICES A (Paolo 8/11): "Three goods, priced off the scarcity sim we
    already have."
    records/BOHEMIA_VERDICT_ICONS_AND_DEMO_BLOCKERS_8_11_26.txt

engine/bohemia_payday.js has carried `var PRICE_SOURCE = 'economy';   // RULED 8/11 by
Paolo, blocker 2 = A` ever since. The valve he was asked to open, he opened, and the
lane then sat on the work for three days waiting for him to open it again. A ruling
nobody acts on is the same as a ruling nobody asked for -- and this is the SEVENTH
time this week this lane has found a finished thing that never reached the surface he
taps. The pattern is not "we lack rulings." It is "we do not read them back."

SO THE MARKET IS OPEN. What this file wires, all of it from parts already in the build:

  WHERE       BohemiaPayday.hubs() reads swap meets and truck stops OUT OF THE
              OVERMAP. MAP LAW holds absolutely: nothing is placed here. The overmap
              sites those cells (bohemia_overmap.js L290 swapmeet, L315 truckstop);
              if the seed moves them, the market moves with them.
  WHAT        bohemia_economy.js's GOODS -- water, food, meds, fuel -- each already
              carrying its own real-world anchor in that file (3L sedentary vs 6-8L
              desert labor; a ration is ~2000 kcal).
  HOW MUCH    bohemia_economy.js's price(): hyperbolic in days-of-supply, anchored in
              real siege data (Sarajevo 92-95, where staples moved 10-100x, not 2x).
              Nobody types a price here. HIS OWN TABLE STILL WINS -- PURSE.PRICES is
              checked first by payday.buy() and is still empty, so the day he names a
              price it beats the sim for that good and nothing else changes.
  PAID WITH   resources, because the economy quotes everything in salvage-kg and of
              his three locked currencies that is the one that means physical goods
              you carry. That mapping is payday's, made 8/11, not new here.

A MARKET IS A PLACE, AND THAT IS THE DESIGN, NOT A LIMITATION. You cannot buy from
the phone. The shelf only opens when you are STANDING IN THE HUB CELL, which is what
makes the walk between his house and the swap meet worth anything at all -- and it is
why the phone's job here is to tell him WHERE it is, not to sell to him. The phone
already has a GO that moves the city marker (__PHONE_JUMP__, 8/12); the market rides
that door rather than growing a second one.

THE LEDGER IS SIZED BY THE VALLEY'S OWN PEOPLE, and it is a sampled ESTIMATE that
says so. The city page has no world model -- payday's own header records that
discovery -- so there are no plots to census here. What the city DOES have is
BohemiaPopulation, the same module that decides who is standing on screen. So the
market is sized by the heads in the residential neighbourhoods around it: the
customers are literally the people he can walk up to. Built lazily on first open (a
census at boot would be paid by every player who never trades) and cached in the save.

EVERYONE SCAVS, AND I AM SAYING SO OUT LOUD. advanceDay() wants agents, and the
economy module defines exactly two job kinds: 'site' (an organized crew at a real
district) and 'scav' ("subsistence sweep of an already-picked block"). Knowing who
works at a site needs plots, which this page does not have. So every head is a scav
-- the module's own conservative kind, chosen rather than invented, and stated here
so nobody later reads a placeholder as a ruling. When the run gains a real jobs
model the same call takes real agents and nothing else in this file changes.

AND THE PRICES MOVE, which is the entire reason ruling A is worth having. The ledger
advances one day at every nightfall: stock is produced, eaten, and what is not there
is logged as shortfall. Water at thirty days is base price. Water at four days is
not. He will see the number change between day 1 and day 3 without anybody touching
a table.

REUSE CHECK: cooks no graphic pixels of any kind, opens no art bank, because nothing
here is drawn. Every surface reuses what the day card and the button row already are
(.dcgo, #sleepbtn's treatment, cardShow/esc). The three engine modules it calls --
bohemia_payday.js, bohemia_purse.js, bohemia_economy.js -- are all already inlined in
this page and all three are opened in code below, not merely named.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_TRADING_HUB__'

CSS_OLD = """#sleepbtn:active{border-color:var(--acc);color:#fff}"""
CSS_NEW = """#sleepbtn:active{border-color:var(--acc);color:#fff}
/* """ + MARK + """ -- the market button sits beside SLEEP and is only there when he
   is standing in the hub, because a market is a place. */
#mktbtn{position:absolute;left:6px;bottom:40px;z-index:7;padding:7px 11px;border-radius:9px;
  background:var(--face);border:1px solid var(--acc);color:var(--acc);
  font-size:11px;font-weight:700;letter-spacing:1px;display:none}
#mktbtn:active{background:#2a251d;color:#fff}
#daycardIn .mrow{display:flex;justify-content:space-between;align-items:center;gap:8px;
  padding:9px 10px;margin-bottom:5px;border-radius:8px;background:#151310;
  border:1px solid var(--line)}
#daycardIn .mrow:active{border-color:var(--acc)}
#daycardIn .mrow.no{opacity:.45}
#daycardIn .mgood{font-size:12px;font-weight:700;letter-spacing:1px;color:var(--ink)}
#daycardIn .mnote{font-size:10px;color:#8d7c5e;letter-spacing:.5px}
#daycardIn .mprice{font-size:12px;font-weight:700;color:var(--acc);white-space:nowrap}"""

BTN_OLD = """  <div id="sleepbtn">🛏 SLEEP</div>"""
BTN_NEW = """  <div id="sleepbtn">🛏 SLEEP</div>
  <div id="mktbtn">🧺 MARKET</div><!-- """ + MARK + """ -->"""

GLUE = """
/* """ + MARK + """ -- SPEND AT A TRADING HUB. The other half of the demo cut's row 3,
   and it was never blocked: Paolo ruled PRICES = A on 8/11 ("Three goods, priced off
   the scarcity sim we already have") and payday.js has carried PRICE_SOURCE='economy'
   ever since. The lane then waited three days for a ruling it already had.
   MAP LAW: the hubs are READ out of the overmap, never placed here.
   var, not let, for the same temporal-dead-zone reason as HOME (8/11). */
var MKT_LEDGER=null, MKT_HUB=null, MKT_HUB_KEY=null, MKT_BOUGHT=null, MKT_LAST=null;

/* WHERE. nearestHub takes a raw overmap, which is exactly what this page has. */
function mktHub(){
  var key=seed+':'+city.x+','+city.y+':'+MODE;
  if(MKT_HUB_KEY===key) return MKT_HUB;
  var cx=(MODE==='human')?((hx/FN)|0):city.x, cy=(MODE==='human')?((hy/FN)|0):city.y;
  var h=null; try{ h=BohemiaPayday.nearestHub(om, cx, cy); }catch(_e){ h=null; }
  MKT_HUB=h; MKT_HUB_KEY=key; return h;
}
/* A MARKET IS A PLACE. He has to be standing in the cell, in either mode -- the city
   marker counts, because moving the marker there IS how you travel the valley. */
function mktAt(){
  var h=mktHub(); if(!h) return false;
  var cx=(MODE==='human')?((hx/FN)|0):city.x, cy=(MODE==='human')?((hy/FN)|0):city.y;
  return h.x===cx&&h.y===cy;
}

/* THE VALLEY'S OWN PEOPLE SIZE THE MARKET. No plots on this page (payday's header
   records that discovery), so the census is BohemiaPopulation's -- the same module
   that decides who is standing on screen. A SAMPLED ESTIMATE, said out loud. */
function mktHeads(){
  var heads=0, seen={}, n=om.n, tried=0;
  var h=mktHub(); if(!h) return 0;
  /* nearest residential neighbourhoods first: a swap meet serves what is around it */
  for(var r=0;r<=8&&tried<10;r++){
    for(var dy=-r;dy<=r&&tried<10;dy++)for(var dx=-r;dx<=r&&tried<10;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
      var x=h.x+dx, y=h.y+dy; if(x<0||y<0||x>=n||y>=n)continue;
      var c=om.at(x,y); if(!c)continue;
      var nb=null; try{ nb=BohemiaPopulation.neighbourhoodOf(x,y); }catch(_e){ continue; }
      var k=nb[0]+','+nb[1]; if(seen[k])continue; seen[k]=1;
      var ppl=[]; try{ ppl=BohemiaPopulation.peopleIn(om,POWER,nb[0],nb[1],seed,FN,null,24)||[]; }
      catch(_e){ ppl=[]; }
      if(!ppl.length)continue;
      heads+=ppl.length; tried++;
    }
  }
  return heads;
}
/* Built LAZILY: a census at boot is paid by every player who never trades. */
function mktLedger(){
  if(MKT_LEDGER) return MKT_LEDGER;
  var heads=mktHeads();
  if(!heads) heads=1;                 /* a market with no customers still has a shelf */
  try{ MKT_LEDGER=BohemiaEconomy.makeLedger(seed, heads, heads); }catch(_e){ MKT_LEDGER=null; }
  return MKT_LEDGER;
}
/* EVERYONE SCAVS, and that is a stated choice not a number. The economy module owns
   exactly two job kinds; knowing who works a SITE needs plots this page does not
   have, so every head takes the module's own conservative kind. */
function mktAgents(){
  var L=mktLedger(); if(!L) return [];
  var out=[]; for(var i=0;i<L.agents;i++) out.push({job:{kind:'scav'}});
  return out;
}
/* THE DAY MOVES THE PRICES. Stock is produced, eaten, and what is not there is
   shortfall -- which is the whole point of the ruling he made. */
function mktAdvanceDay(){
  if(!MKT_LEDGER) return null;            /* never censused = never traded = nothing to age */
  try{ return BohemiaEconomy.advanceDay(MKT_LEDGER, mktAgents()); }catch(_e){ return null; }
}
/* THE SHELF. Goods and prices both READ, never typed. */
function mktShelf(){
  var L=mktLedger(), p=purseGet(), out=[];
  var sh=[]; try{ sh=BohemiaPayday.shelf()||[]; }catch(_e){ sh=[]; }
  for(var i=0;i<sh.length;i++){
    var q=null; try{ q=BohemiaPayday.price(p, L, sh[i].good); }catch(_e){ q=null; }
    var dl=null; try{ dl=BohemiaEconomy.daysLeft(L, sh[i].good); }catch(_e){}
    out.push({ good:sh[i].good, unit:sh[i].unit, note:sh[i].note,
               price:(q&&q.price!=null)?q.price:null,
               source:(q&&q.source)||null, reason:(q&&q.reason)||null,
               daysLeft:(dl===Infinity||dl==null)?null:dl });
  }
  return out;
}
function mktBuy(good){
  var p=purseGet(); if(!p) return null;
  var r=null;
  try{ r=BohemiaPayday.buy(p, mktHub(), good, DAY.day, mktLedger()); }catch(_e){ return null; }
  MKT_LAST=r;
  if(r&&r.applied){
    MKT_BOUGHT=MKT_BOUGHT||{}; MKT_BOUGHT[good]=(MKT_BOUGHT[good]||0)+1;
    window.__BOUGHT=(window.__BOUGHT||0)+1;
    /* A HARD SINK: the goods leave the world when he consumes them, so the stock the
       price is computed from really drops. Buying makes the next one dearer. */
    try{ if(MKT_LEDGER&&MKT_LEDGER.stocks&&MKT_LEDGER.stocks[good]!=null)
      MKT_LEDGER.stocks[good]=Math.max(0,+(MKT_LEDGER.stocks[good]-1).toFixed(2)); }catch(_e){}
  } else window.__BUY_REFUSED=(window.__BUY_REFUSED||0)+1;
  try{ phonePush(true); }catch(_e){}
  return r;
}
/* THE SHELF ON SCREEN. Reuses the day card, because a second card system is a second
   thing to keep in step with the first. */
function showMarket(){
  var h=mktHub(), rows=mktShelf(), bal=purseBalances()||{};
  var s='<h2>'+esc(((h&&h.kind==='truckstop')?'TRUCK STOP':'SWAP MEET'))+'</h2>'
       +'<div class="sub">'+esc(DAY.hhmm(DAY.min))+' \\u00b7 you have '
       +esc(String(bal.resources==null?0:bal.resources))+' resources</div>';
  for(var i=0;i<rows.length;i++){
    var r=rows[i], can=(r.price!=null)&&((bal.resources||0)>=r.price);
    var right=(r.price!=null)?(r.price+' res'):(r.reason==='NO_RULING'?'unpriced':'\\u2014');
    s+='<div class="mrow'+(can?'':' no')+'" data-act="buy:'+esc(r.good)+'">'
      +'<div><div class="mgood">'+esc(r.good.toUpperCase())+' \\u00b7 1 '+esc(r.unit)+'</div>'
      +'<div class="mnote">'+esc(r.daysLeft==null?String(r.note||'')
          :(r.daysLeft+' days of it left in the valley'))+'</div></div>'
      +'<div class="mprice">'+esc(right)+'</div></div>';
  }
  if(MKT_LAST&&!MKT_LAST.applied)
    s+='<div class="sub" style="margin-top:8px">'+esc(
        MKT_LAST.reason==='CANNOT_AFFORD'?('not enough resources: that is '+MKT_LAST.price
          +' and you have '+MKT_LAST.have)
        :MKT_LAST.reason==='NO_RULING'?'nobody has ruled what that costs'
        :String(MKT_LAST.reason||''))+'</div>';
  s+='<div class="dcgo" data-act="close">LEAVE</div>';
  cardShow(s,function(act){
    if(act==='close'){ MKT_LAST=null; cardHide(); return; }
    if(act&&act.indexOf('buy:')===0){ mktBuy(act.slice(4)); showMarket(); }
  });
}
function mktBtnSync(){
  var el=document.getElementById('mktbtn'); if(!el)return;
  el.style.display=(mktAt()&&DAY.phase==='awake')?'block':'none';
}
"""

# the button only exists where he is
OLD_HUD = """  document.getElementById('note').textContent=MODE==='city'
    ? 'move on the streets. time moves when you move.'
    : 'walking your own block.';
}"""
NEW_HUD = """  document.getElementById('note').textContent=MODE==='city'
    ? 'move on the streets. time moves when you move.'
    : 'walking your own block.';
  try{ mktBtnSync(); }catch(_e){}   /* """ + MARK + """ */
}"""

# nightfall ages the ledger, so the prices are different tomorrow
OLD_NIGHT = """  if(OFFER_TAKEN){ const r=DQ.nightfall(); if(r)updQline();
    try{ payForToday(); }catch(_e){}   /* __THE_DAY_PAYS__ */ }
  showReckoning();"""
NEW_NIGHT = """  if(OFFER_TAKEN){ const r=DQ.nightfall(); if(r)updQline();
    try{ payForToday(); }catch(_e){}   /* __THE_DAY_PAYS__ */ }
  try{ mktAdvanceDay(); }catch(_e){}   /* """ + MARK + """ -- a day passes in the valley
     too: stock produced, eaten, shortfall logged. Water at four days does not cost
     what water at thirty days costs, and that is the whole point of ruling A. */
  showReckoning();"""

# the phone says where the market is, so the walk has a destination
OLD_STATE = """           purse:purseBalances(), paid:PAID_TODAY, payRefused:PAY_REFUSED };"""
NEW_STATE = """           purse:purseBalances(), paid:PAID_TODAY, payRefused:PAY_REFUSED,
           market:(function(){ try{ var h=mktHub(); return h?{cell:{x:h.x,y:h.y},kind:h.kind,
             dist:Math.round(h.dist||0), at:mktAt(), bought:MKT_BOUGHT}:null; }
             catch(_e){ return null; } })() };   /* """ + MARK + """ */"""

# it rides the save: a purse that survives the night and a market that forgets is a lie
OLD_SAVE = """      purse:(function(){ try{ return BohemiaPurse.save(purseGet()); }catch(_e){ return null; } })()"""
NEW_SAVE = """      purse:(function(){ try{ return BohemiaPurse.save(purseGet()); }catch(_e){ return null; } })(),
      market:MKT_LEDGER?{ledger:MKT_LEDGER,bought:MKT_BOUGHT}:null   /* """ + MARK + """ */"""

OLD_RESTORE = """  if(st.purse){ try{ PURSEV=BohemiaPurse.load(st.purse); }catch(_e){} }"""
NEW_RESTORE = """  if(st.purse){ try{ PURSEV=BohemiaPurse.load(st.purse); }catch(_e){} }
  /* """ + MARK + """ -- the valley's stocks are the price, so a market that forgets
     them resets every price to base on every reload. */
  if(st.market){ try{ MKT_LEDGER=st.market.ledger||null; MKT_BOUGHT=st.market.bought||null; }catch(_e){} }"""

BOOT_OLD = """document.getElementById('sleepbtn').addEventListener('click',function(){"""
BOOT_NEW = """/* """ + MARK + """ BOOT */
document.getElementById('mktbtn').addEventListener('click',function(){
  if(!mktAt())return; MKT_LAST=null; showMarket();
});
document.getElementById('sleepbtn').addEventListener('click',function(){"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [
        ('css', CSS_OLD, CSS_NEW),
        ('button', BTN_OLD, BTN_NEW),
        ('hud sync', OLD_HUD, NEW_HUD),
        ('nightfall', OLD_NIGHT, NEW_NIGHT),
        ('phone state', OLD_STATE, NEW_STATE),
        ('save', OLD_SAVE, NEW_SAVE),
        ('restore', OLD_RESTORE, NEW_RESTORE),
        ('boot', BOOT_OLD, BOOT_NEW),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
