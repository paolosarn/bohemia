#!/usr/bin/env python3
"""
YOUR HOUSE IS YOURS, AND THE PHONE IS IN YOUR POCKET (8/11/26).

Paolo: "How was this a run when my house isn't labeled and the Phone app that we
worked so hard for isn't even implemented yet."

Both are the same defect, and it is the one this lane has now been caught by four
separate times: THE WORK EXISTS AND IS NOT IN THE SURFACE HE TAPS.

--- THE PHONE ---------------------------------------------------------------
It was never missing. slices/BOHEMIA_CURRENT_SLICE.html is a finished phone --
the Network feed with DMs inside it, the ONE MAP app rendering the real generated
valley cell for cell, Wallet, Profile, quest offers, followers -- 1.6 MB of it,
driving the real engine modules. It sits behind the alpha's SLICE tab, which is a
DEVELOPER tab. It is not in the walked world, so when he plays there is no phone.

The backlog has said so since 7/27, filed and never actioned:
    0D. (7/27, [PENDING Paolo]) "the phone system isn't in here, doesn't progress
    as I walk" -- the phone/feed is not reachable from the walked world and
    nothing about it advances with steps.
That [PENDING] was on whose LANE it belonged to, which is not a question that
needed him: REACHABILITY is mechanism. It is answered here.

So the phone goes in his pocket. A button in the run, and it opens THE REAL
PHONE -- not a re-skin, not a second copy that drifts. REUSE-FIRST: the file that
already exists is the file that opens, so every future phone improvement lands in
the run for free. And it PROGRESSES AS HE WALKS: the city posts where he is, what
day it is, what time it is and what the day's job is into the phone every time it
opens and every time the state changes, and the phone shows it live.

--- YOUR HOUSE --------------------------------------------------------------
The day loop I shipped wakes you at 06:00 nowhere in particular. A day that
starts nowhere is not a day, and a valley where nothing is YOURS is not a home.

HOME is now a real place: the enterable house nearest the middle of the district
he spawns in, chosen deterministically from the seed so it is the SAME house
every single time he loads that cell. It is LABELLED in the world, in the exact
type the city already uses for people's names (the CITY TALK pass: dark outline,
#e8b84a), because a second label style would be a second design.

And the loop now means something: YOU WAKE UP AT HOME. Nightfall ends the day
wherever you are, you sleep, and 06:00 finds you at your own front door.

WHAT I DID NOT DO, deliberately. MAP LAW: Claude never designs map layouts. I did
not place a house, move a house, or author a district. I NAMED a house the
generator already built, by a rule (nearest the centre of the spawn cell). If
Paolo wants a different house, or a real family home authored into the suburb,
that is his canon and this rule steps aside for it.

REUSE CHECK: cooks no graphic pixels of any kind. The HOME label reuses the CITY
TALK name pass's existing type treatment; the phone button reuses the topbar
button face already in the CSS (--face/--line/--acc); the phone itself is the
existing slice, opened, not redrawn. No bank is opened because nothing is drawn.

Idempotent: re-running finds the markers and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
HOME_MARK = '__YOUR_HOUSE__'
PHONE_MARK = '__PHONE_IN_POCKET__'

# ---- HTML: the button and the phone overlay ---------------------------------
OLD_HTML = '    <div id="keybtn">\U0001f511 KEY</div>'
NEW_HTML = ('    <div id="phonebtn">\U0001f4f1 PHONE</div>\n'
            '    <div id="keybtn">\U0001f511 KEY</div>')

OLD_STAGE = '  <div id="savepanel"></div>'
NEW_STAGE = ('  <div id="phonewrap"><div id="phonebar"><span id="phonewhere"></span>'
             '<span id="phoneclose">✕</span></div>'
             '<div id="phoneslot"></div></div>\n'
             '  <div id="savepanel"></div>')

OLD_CSS = '<style id="dayloopCss">'
NEW_CSS = """<style id="homePhoneCss">
/* """ + PHONE_MARK + """ / """ + HOME_MARK + """ -- the phone button reuses the topbar
   button face already defined for #keybtn; nothing new is designed here. */
#phonebtn{padding:7px 11px;border-radius:5px;background:var(--face);border:1px solid var(--line);
  color:var(--acc);font-weight:500;font-size:10px;letter-spacing:1px}
#phonebtn:active{border-color:var(--acc);color:#fff}
#phonewrap{position:absolute;inset:0;z-index:30;display:none;flex-direction:column;
  background:#070605}
#phonewrap.on{display:flex}
#phonebar{flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;
  padding:7px 11px;background:var(--face);border-bottom:1px solid var(--line);
  color:var(--acc);font-size:10px;font-weight:700;letter-spacing:1px}
#phoneclose{padding:0 6px;font-size:14px;color:var(--ink)}
#phoneslot{flex:1;min-height:0;position:relative}
#phoneslot iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
</style>
<style id="dayloopCss">"""

# ---- HOME: find it, draw it, wake in it -------------------------------------
GLUE = """
/* """ + HOME_MARK + """ -- YOUR HOUSE (Paolo 8/11: "how was this a run when my house
   isn't labeled"). HOME is the enterable house nearest the middle of the district he
   spawns in, resolved from the world model and cached per (seed, cell) so it is the
   SAME house every load. MAP LAW holds: nothing is placed or moved here, a house the
   generator already built is NAMED by a rule. */
/* var, NOT let, AND THAT IS LOAD-BEARING. swapMode() sits ~500 lines EARLIER in
   this file than this glue, and it writes LANDED and reads HOME_WAKE_PENDING. A
   top-level `let` lives in the temporal dead zone until its own line executes, so
   on the boot path swapMode threw "Cannot access 'LANDED' before initialization"
   INTO A SILENT CATCH -- the drop-in branch died halfway, and the only symptom was
   that he never woke up at home. `var` is hoisted and initialised to undefined, so
   earlier code can touch these safely. A silent catch around a TDZ error is a bug
   that looks exactly like a feature quietly not working, which is what it did. */
var HOME=null, HOME_KEY=null, LANDED=null;
function homeFind(){
  const key=seed+':'+city.x+','+city.y;
  if(HOME_KEY===key) return HOME;
  const bx=city.x*FN, by=city.y*FN;
  /* ANCHORED ON WHERE HE LANDS, NOT ON THE CENTRE OF THE CELL. Measured 8/11:
     centre-of-cell put HOME 55 cells north of the drop-in, so his own house was
     off screen the entire time he was standing in his own neighbourhood, which
     is indistinguishable from not having one. The drop-in point is itself
     deterministic (same seed -> same spiral -> same landing), so anchoring here
     keeps HOME the same house every load AND puts it in front of him. */
  const anchor=(LANDED&&((LANDED[0]/FN)|0)===city.x&&((LANDED[1]/FN)|0)===city.y)
    ? LANDED : [bx+(FN>>1), by+(FN>>1)];
  const cx=anchor[0], cy=anchor[1];
  let best=null, bd=1e9;
  for(let ly=0;ly<FN;ly++)for(let lx=0;lx<FN;lx++){
    const c=cellAt(bx+lx,by+ly);
    if(!c||c.walk||!c.enter)continue;
    if(!/house/i.test(c.enter))continue;      /* a house, not a garage or a shed */
    const dx=bx+lx-cx, dy=by+ly-cy, d=dx*dx+dy*dy;
    if(d<bd){ bd=d; best=[bx+lx,by+ly]; }
  }
  /* A NULL IS NOT AN ANSWER, IT IS "NOT YET", AND CACHING IT COST A MEASUREMENT.
     Asked during boot -- before the cell's fine data exists -- the scan finds no
     house and returns nothing. The first draft wrote that nothing into the cache
     under the cell's key, so every later call returned it and he dropped in beside
     a house the game had already decided he did not have. Only a REAL find is
     cached; a miss leaves the key unset so the next caller tries again. */
  if(!best)return null;
  const f=inFootprint(best[0],best[1]);
  if(!f)return null;
  HOME_KEY=key;
  /* the front door, so waking puts you at your own doorstep and not in a wall */
  let door=null;
  for(let y=f.y;y<f.y+f.h&&!door;y++)for(let x=f.x;x<f.x+f.w&&!door;x++){
    const c=cellAt(x,y);
    if(c&&c.artPool_face==='hdoor')door=[x,y];
  }
  HOME={x:f.x,y:f.y,w:f.w,h:f.h,door:door,cell:{x:city.x,y:city.y}};
  return HOME;
}
/* the cell you STAND on to be at your front door: one south of the door if that is
   walkable, else any walkable neighbour of the footprint. */
function homeDoorstep(){
  const h=homeFind(); if(!h)return null;
  const tries=[];
  if(h.door)tries.push([h.door[0],h.door[1]+1],[h.door[0],h.door[1]-1],
                       [h.door[0]-1,h.door[1]],[h.door[0]+1,h.door[1]]);
  for(let x=h.x-1;x<=h.x+h.w;x++){ tries.push([x,h.y+h.h]); tries.push([x,h.y-1]); }
  for(const t of tries){ const c=cellAt(t[0],t[1]); if(c&&c.walk)return t; }
  return null;
}
/* THE LABEL. Same treatment as the CITY TALK name pass -- dark outline then
   #e8b84a -- because a second label style would be a second design. */
function homePass(ox,oy,C){
  const h=homeFind(); if(!h)return;
  /* CULL ON THE BUILDING, CLAMP THE LABEL. Culling on the LABEL's own position was
     wrong and it hid the thing it was drawing: standing at the front door of a
     12-cell-deep house puts the north edge -- where the label sits -- 550px above
     the middle of a 844px screen, i.e. off the top, so the word HOME was culled
     exactly when he was standing on his own doorstep looking at it. The building
     decides whether to draw; the label is then pulled onto the screen. */
  const cxp=Math.round(ox+(h.x+h.w/2)*C), cyp=Math.round(oy+(h.y+h.h/2)*C);
  if(cxp<-C*8||cyp<-C*8||cxp>cv.width+C*8||cyp>cv.height+C*8)return;
  const sx=Math.max(24,Math.min(cv.width-24,cxp));
  const sy=Math.max(18,Math.min(cv.height-8,Math.round(oy+h.y*C-Math.round(C*0.55))));
  g.save();
  g.font='700 '+Math.max(9,Math.round(C*0.26))+'px "Space Grotesk",system-ui,sans-serif';
  g.textAlign='center'; g.textBaseline='bottom';
  g.fillStyle='rgba(12,14,10,0.85)';
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(dx||dy)g.fillText('HOME',sx+dx,sy+dy);
  g.fillStyle='#e8b84a'; g.fillText('HOME',sx,sy);
  g.restore();
  window.__HOME_LABEL=(window.__HOME_LABEL||0)+1;
}
/* YOU WAKE UP AT HOME. A day that starts nowhere is not a day.
   The first wake of a run fires while he is still on the city view, before the world
   he would wake INTO exists, so it is REMEMBERED and spent at the drop-in instead.
   That is what puts him on his own doorstep with the label over his head the first
   time he ever drops in, rather than 26 cells away from a house he never sees. */
/* FALSE AT BOOT, AND THAT IS A CORRECTION I HAD TO MAKE AFTER BREAKING SOMETHING.
   I first started this TRUE, so the run's very first drop-in walked him to his own
   front door. It worked, and it broke another lane: CITY TALK asserts SOMEBODY IS
   STANDING BY THE SPAWN, within 6 tiles, because there has to be a person to talk
   to where you start. The cast is placed by NEIGHBOURHOOD, not around the player,
   so moving him 13 cells to his door left nobody near him -- green on my gate, red
   on theirs, and their gate was green before I touched anything.
   DAY 1 THEREFORE LANDS EXACTLY WHERE IT ALWAYS DID. HOME is still resolved, still
   LABELLED in the world, and still pinned on the phone's map so he can find it.
   From the next wake on -- after he has actually slept -- he wakes at his own door,
   which is the only day on which "you slept at home" means anything anyway. */
var HOME_WAKE_PENDING=false;
function homeWake(){
  if(MODE!=='human'){ HOME_WAKE_PENDING=true; return false; }
  const s=homeDoorstep(); if(!s)return false;
  hx=s[0]; hy=s[1]; INSIDE=null;
  HOME_WAKE_PENDING=false;
  window.__WOKE_HOME=(window.__WOKE_HOME||0)+1;
  return true;
}
DAY.on('wake',function(){ try{ homeWake(); }catch(_e){} });

/* """ + PHONE_MARK + """ -- THE PHONE IS IN YOUR POCKET (Paolo 8/11: "the Phone app
   that we worked so hard for isn't even implemented yet"). It was finished and it was
   behind a developer tab. This opens THE REAL SLICE, not a copy, so every future phone
   improvement lands in the run for free -- and it PROGRESSES AS HE WALKS, which is the
   half the 7/27 backlog entry actually complained about: the city posts where he is,
   the day, the clock and the live objective into it on open and on every change. */
var PHONE_ON=false, PHONE_FR=null, PHONE_LAST='';   /* var: same reason as HOME above */
function phoneState(){
  let d=null; try{ d=dayWhere(); }catch(_e){}
  const h=(function(){ try{ return homeFind(); }catch(_e){ return null; } })();
  let obj=''; try{ obj=DQ.hudLine()||''; }catch(_e){}
  return { where:d||'', district:d||'', day:DAY.day, clock:DAY.hhmm(DAY.min),
           night:isNight(), mode:MODE,
           cell:{x:(MODE==='human')?((hx/FN)|0):city.x, y:(MODE==='human')?((hy/FN)|0):city.y},
           home:h?{cell:h.cell}:null, objective:obj,
           quest:(function(){ try{ return DQ.spec?DQ.spec.id:null; }catch(_e){ return null; } })(),
           done:(function(){ try{ return DQ.done(); }catch(_e){ return false; } })() };
}
function phonePush(force){
  if(!PHONE_ON||!PHONE_FR||!PHONE_FR.contentWindow)return;
  const st=phoneState(), key=JSON.stringify(st);
  if(!force&&key===PHONE_LAST)return;
  PHONE_LAST=key;
  try{ PHONE_FR.contentWindow.postMessage({bohemiaPhoneWhere:st},'*'); }catch(_e){}
  const w=document.getElementById('phonewhere');
  if(w)w.textContent=(st.district?st.district.toUpperCase()+' \\u00b7 ':'')+'DAY '+st.day+' \\u00b7 '+st.clock;
}
function phoneOpen(){
  const wrap=document.getElementById('phonewrap');
  if(!PHONE_FR){
    PHONE_FR=document.createElement('iframe');
    PHONE_FR.setAttribute('title','the phone');
    PHONE_FR.src='BOHEMIA_CURRENT_SLICE.html';
    PHONE_FR.addEventListener('load',function(){ setTimeout(function(){ phonePush(true); },400); });
    document.getElementById('phoneslot').appendChild(PHONE_FR);
  }
  PHONE_ON=true; wrap.classList.add('on'); phonePush(true);
}
function phoneClose(){ PHONE_ON=false; document.getElementById('phonewrap').classList.remove('on'); }
"""

BOOT = """
/* """ + PHONE_MARK + """ BOOT */
document.getElementById('phonebtn').addEventListener('click',function(){
  if(PHONE_ON)phoneClose(); else phoneOpen();
});
document.getElementById('phoneclose').addEventListener('click',phoneClose);
"""

# the label rides the same pass list as the signals and the side doors
OLD_LAND = "    if(_best){ hx=_best[0]; hy=_best[1]; }\n    MODE='human';"
NEW_LAND = ("    if(_best){ hx=_best[0]; hy=_best[1]; }\n"
            "    LANDED=[hx,hy];   /* " + HOME_MARK + ": HOME is the house nearest where you LAND */\n"
            "    MODE='human';")

OLD_PASS = "  ewDoorPass(ox,oy,C);   /* __EW_FACING_DOORS__ */"
NEW_PASS = ("  ewDoorPass(ox,oy,C);   /* __EW_FACING_DOORS__ */\n"
            "  try{ homePass(ox,oy,C); }catch(_e){}   /* " + HOME_MARK + " */")

# and the phone learns about every step, through the render tick the day loop uses
OLD_TICK = "function render(){ try{ dayDistrictCheck(); }catch(_e){}   /* __DAY_LOOP__ */"
NEW_TICK = ("function render(){ try{ dayDistrictCheck(); }catch(_e){}   /* __DAY_LOOP__ */\n"
            "  /* " + HOME_MARK + ": you slept at home, so the day starts at your own door.\n"
            "     CONSUMED HERE AND NOT IN swapMode, which is where the first draft put it.\n"
            "     swapMode sits ~500 lines earlier than this glue and the city has two\n"
            "     PRE-EXISTING temporal-dead-zone faults on that path (updHud reads RIDING,\n"
            "     the footprint walk reads IN_D4, both `let`s declared later), so anything\n"
            "     hooked there runs before those are initialised and throws. render() runs\n"
            "     after the whole script, every frame, so the first human frame spends it.\n"
            "     The spiral still decides where the neighbourhood lets you in; this only\n"
            "     walks the last few cells to your own doorstep, which is a walkable cell\n"
            "     touching your own footprint -- and every house's walk/driveway reaches the\n"
            "     street by construction (D1 KERB + STREET-AWARE ACCESS, both gated), so it\n"
            "     cannot strand you. NO DISTRICT IS A PRISON still holds. */\n"
            "  try{ if(HOME_WAKE_PENDING&&MODE==='human') homeWake(); }catch(_e){}   /* " + HOME_MARK + " */\n"
            "  try{ if(PHONE_ON)phonePush(false); }catch(_e){}   /* " + PHONE_MARK + " */")


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if HOME_MARK in s and PHONE_MARK in s:
        print('NOOP: both markers already present')
        return
    for name, old, new in [
        ('phone button', OLD_HTML, NEW_HTML),
        ('phone overlay', OLD_STAGE, NEW_STAGE),
        ('css', OLD_CSS, NEW_CSS),
        ('drop-in landing', OLD_LAND, NEW_LAND),
        ('render pass', OLD_PASS, NEW_PASS),
        ('render tick', OLD_TICK, NEW_TICK),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    tail = s.rfind('</script>')
    if tail < 0:
        sys.exit('FAIL: no closing script tag')
    s = s[:tail] + BOOT + '\n' + s[tail:]

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
