#!/usr/bin/env python3
"""
BOHEMIA CITY TALK (8/3/26, PEOPLE lane) — YOU CAN SPEAK TO SOMEBODY ON THE
SURFACE HE ACTUALLY PLAYS.

Paolo, 8/2: "can you just have one extra NPC chilling outside the spawn in the
suburb that I can just talk to and test out your mechanics?"
Then, after I built it: "I couldn't find them."

HE WAS RIGHT AND THE REASON WAS WORSE THAN A MISSING NPC. The alpha routes the
RUN tab to the CITY panel -- PANEL = (t.dataset.p==='run') ? 'city' : ... -- so
#p-run (BOHEMIA_RUN_CURRENT.html) is display:none the entire time. Everything
this lane built lives in that file: the identity card, the one contextual
button, asking a name, the name over their head, and the neighbour placed
outside his door. All of it on a page the game never shows.

MEASURED ON HIS SURFACE, standing where the RUN tab now drops him:
    bodies drawn on screen ......... 0
    nearest person in the valley ... 192 tiles away
    occurrences of "TALK TO" ....... 0
    identity card / ask a name ..... 0
Not "nobody to talk to". NOBODY AT ALL, and no way to speak if there had been.

WHAT THIS PATCH ADDS, and every piece of it is the SHARED module rather than a
second implementation (ENGINE SYNC LAW: one canonical body per module):

  1. engine/bohemia_people.js inlined verbatim, exactly the way
     bohemia_city_people_patch.py already inlines population and agents. The
     name, the trade, the card and the three tiers are that module's answers.
     This frame decides nothing about who anybody is.

  2. THE NEIGHBOUR AT THE SPAWN. One extra resident, standing a few tiles from
     where you land. He is a REAL person record from BohemiaPopulation.
     personFields -- same derivation as all 300 people in the valley -- so he
     has a real trade, a real look, a real schedule asked from BohemiaAgents,
     and a name you have to ask for. A prop would test nothing.
     He is pinned to the SPAWN, computed once, not to the player: a body that
     followed you around would be a cursor, not a neighbour.

  3. THE ONE CONTEXTUAL BUTTON. Stand next to somebody and it says
     TALK TO THE SCAVENGER -- the same phrase the run says, from the same
     BohemiaPeople.addressOf(). Tap it for the card: who they are, where they
     live, what they are doing right now. No timetable: A ROUTINE IS INVISIBLE
     INFORMATION (Paolo 7/31) holds here exactly as it holds on the run.

  4. ASKING, which is the whole mechanic (Paolo 7/31, YOU HAVE TO ASK): "I hate
     how in other games you know everyone's name off the bat." The card says
     YOU HAVE NOT ASKED until you tap Ask their name. Then they are named, the
     button calls them by it, and it is remembered.

  5. THE NAME OVER THEIR HEAD once you have asked, and never before. Strangers
     stay anonymous forever, which is the point.

REUSE CHECK: COOKS ZERO PIXELS and opens no bank. The body is the character
Paolo already built (the frame's existing BOHEMIA_CITY_PLAYER sprite, tinted
per person by the CITY PEOPLE pass that is already there). The card is laid out
in the frame's own palette variables. The only new ink is the letters of a name
he asked for, in the gold the frame already uses.

Gate: gates/city_talk_gate.js -- drives the ALPHA and taps the TAB, because the
whole reason this work was invisible is that every gate in this lane opened the
run file directly. VERIFY ON THE REAL SURFACE means the surface he taps.

Idempotent: every injected region is bracketed and a re-run strips the previous
version before injecting the current one.

THE CITY MOVED HOUSE ON 8/4: it used to be a base64 constant inside the alpha
(CITY_B64) and the CITY lane extracted it to slices/BOHEMIA_CITY_WORLD.html so
the alpha opens 29x faster. This tool's edits were already applied when that
extraction happened, so they travelled into the new file intact - but the tool
itself would crash on a re-run looking for CITY_B64. It reads the standalone
file now: a plain text edit, no decode/encode, which is strictly better.
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
PEOPLE = 'engine/bohemia_people.js'

MARK = 'CITY TALK'

# --------------------------------------------------------------------------
# 1. the identity module, inlined the way population and agents already are
# --------------------------------------------------------------------------
MOD_START = '/* ==== engine/bohemia_people.js (CITY TALK, 8/3) ==== */'
MOD_END = '/* ==== /engine/bohemia_people.js (CITY TALK) ==== */'

# --------------------------------------------------------------------------
# 2 + 3 + 4 + 5. the neighbour, the button, the card, the ask, the name
# --------------------------------------------------------------------------
TALK_START = '/* ==== CITY TALK (8/3): somebody to speak to ==== */'
TALK_END = '/* ==== /CITY TALK ==== */'

TALK_JS = TALK_START + r"""
/* THE MET LEDGER. Keyed per person, derived-not-stored everywhere else, and the
   ONE thing that genuinely has to persist: "once you ask their name, if you see
   them again, then they would be named" is a claim about memory. It rides in
   localStorage here rather than the city save blob so it survives a reload
   without touching another lane's save format. */
var CT_MET = (function(){
  var raw=null; try{ raw=JSON.parse(localStorage.getItem('boh.city.met')||'null'); }catch(_e){}
  return BohemiaPeople.makeLedger(raw);
})();
function ctSave(){ try{ localStorage.setItem('boh.city.met', JSON.stringify(CT_MET.serialize())); }catch(_e){} }

/* WHERE HE LANDED, captured ONCE. The neighbour is pinned to the spawn, not to
   the player: a body that followed you around would be a cursor, not a person. */
var CT_SPAWN = null;
function ctSpawn(){
  if(CT_SPAWN) return CT_SPAWN;
  if(typeof hx!=='number' || !hx) return null;
  CT_SPAWN=[hx,hy]; return CT_SPAWN;
}

/* THE NEIGHBOUR AT THE SPAWN. A real person record from the shared module -
   same derivation as every other person in the valley - placed a few tiles from
   where you land, on ground you can actually stand on. */
var CT_NB = null;
var CT_NB_V = -1;
function ctNeighbour(){
  var s=ctSpawn(); if(!s) return null;
  /* THE BOTTOM OF THE SLIDER IS NOT ALLOWED TO LIE (8/16). The population
     module's own words for dial 0 are "A GHOST VALLEY. Not 'fewer people' -
     NOBODY ... It has to be reachable or the bottom of the slider is a lie."
     This neighbour is an authored fixture rather than a census resident, so he
     sailed straight through it: measured on the real surface, dial 0 drew one
     body. If he says nobody lives here, nobody lives here, and that includes
     the man next door. Keyed on rulesVersion so moving the dial back brings
     him straight home. */
  try {
    if (BohemiaPopulation.dial() <= 0) { CT_NB = null; return null; }
    if (CT_NB_V !== BohemiaPopulation.rulesVersion()) {
      CT_NB = null; CT_NB_V = BohemiaPopulation.rulesVersion();
    }
  } catch (_e) {}
  if(CT_NB) return CT_NB;
  var NB=BohemiaPopulation.NB, span=NB*FN;
  var nx=Math.floor(s[0]/span), ny=Math.floor(s[1]/span);
  /* OUT OF THE DOORWAY, STILL RIGHT THERE, and on open ground: a body that never
     moves permanently removes a cell (OCCUPANCY LAW), so parking one in a
     one-wide path is a wall, not a neighbour. Learned the hard way on the run
     surface, where three people ended up queued behind a fixture. */
  var spot=null, bestOpen=-1, bestD=1e9;
  for(var ry=-6;ry<=6;ry++) for(var rx=-6;rx<=6;rx++){
    var d=Math.abs(rx)+Math.abs(ry); if(d<2||d>5) continue;
    var qx=s[0]+rx, qy=s[1]+ry;
    var c=cellAt(qx,qy); if(!c||!c.walk) continue;
    var open=0;
    for(var ax=-1;ax<=1;ax++) for(var ay=-1;ay<=1;ay++){
      if(!ax&&!ay) continue; var n=cellAt(qx+ax,qy+ay); if(n&&n.walk) open++;
    }
    if(open<4) continue;
    if(open>bestOpen || (open===bestOpen && d<bestD)){ bestOpen=open; bestD=d; spot=[qx,qy]; }
  }
  if(!spot) return null;
  /* index 900: peopleIn caps a neighbourhood at 24, so this can never collide
     with a real resident's key and can never be mistaken for one. */
  var p=BohemiaPopulation.personFields(nx,ny,900,seed,'spread',spot);
  p.sched=BohemiaAgents.scheduleFor(p.scheduleSeed,p.archetype,8*60);
  p.home=spot; p.outSpot=spot; p.favSpot=spot;
  p.__ctPinned=true;                       /* stays put: see ctAt */
  CT_NB=p; return p;
}
/* pinned people do not wander: their spot IS their answer at every hour */
function ctAt(p){ return p.__ctPinned ? p.home : pplAt(p); }

/* EVERYBODY ON SCREEN, residents and the neighbour together, as ONE list. */
function ctEveryone(){
  var out=[], s=ctSpawn();
  var NB=BohemiaPopulation.NB, span=NB*FN;
  var nx=Math.floor(hx/span), ny=Math.floor(hy/span);
  for(var dy=-1;dy<=1;dy++) for(var dx=-1;dx<=1;dx++){
    var list=pplPeople(nx+dx,ny+dy);
    for(var i=0;i<list.length;i++) out.push(list[i]);
  }
  /* NOT appended here: the wrapped pplPeople below already adds him to his own
     neighbourhood's list, and adding him twice made him two people in every
     count. Measured on the real surface the first time round. */
  if(!out.length){ var n=ctNeighbour(); if(n) out.push(n); }
  return out;
}

/* A CITY PERSON, AS THE IDENTITY MODULE WANTS THEM. bohemia_people.js reads an
   AGENT ('H<house>-<slot>' plus a seed); the city plane has person RECORDS. This
   is the adapter and it invents nothing: the seat comes from the record's own
   stable id, the seed from its own schedule seed. One identity module, two
   surfaces - the alternative is a second idea of who somebody is, which is the
   exact bug this lane spent 8/2 removing. */
function ctAgent(p){
  var parts=String(p.id).split(':');
  var h=(parseInt(parts[parts.length-1],10)||0)+1;
  return { id:'H'+h+'-1', seed:p.scheduleSeed>>>0, role:p.archetype,
           home:{building:h-1,bedRoom:0}, job:{kind:'scav'}, sched:p.sched };
}
function ctPerson(p){
  var a=ctAgent(p);
  var key='P:city:'+p.id;
  var who=BohemiaPeople.personOf(seed>>>0, a, { asked: CT_MET.asked(key) });
  who.key=key;                              /* keyed to the CITY record, valley-unique */
  if(who.tier==='asked') who.name=BohemiaPeople.generatedName(key);
  return who;
}

/* WHO YOU ARE STANDING NEXT TO. Nearest first, and adjacency only - you talk to
   somebody you could touch, not somebody across the street. */
function ctAdjacent(){
  var all=ctEveryone(), best=null, bd=99;
  for(var i=0;i<all.length;i++){
    var at=ctAt(all[i]);
    var d=Math.abs(at[0]-hx)+Math.abs(at[1]-hy);
    if(d<=1 && d<bd){ bd=d; best=all[i]; }
  }
  return best;
}

/* ---- THE ONE BUTTON + THE CARD ------------------------------------------
   Laid out in the frame's OWN palette variables so it is the same game, not a
   panel bolted on: --face for the button, --line for its edge, --ink for text. */
(function(){
  var css=document.createElement('style');
  css.textContent=
    '#cttalk{position:absolute;left:50%;transform:translateX(-50%);bottom:74px;z-index:40;'+
      'display:none;padding:11px 18px;border:1px solid var(--line);background:var(--face);'+
      'color:var(--acc);font:700 12px/1 "Space Grotesk",system-ui,sans-serif;'+
      'letter-spacing:2px;border-radius:9px}'+
    '#cttalk:active{background:#31280f}'+
    '#ctcard{position:absolute;left:8px;right:8px;bottom:8px;z-index:41;display:none;'+
      'background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px}'+
    '#ctcard .who{font:700 15px/1.2 "Space Grotesk",system-ui,sans-serif;color:var(--ink);'+
      'letter-spacing:1px}'+
    '#ctcard .r{display:flex;gap:10px;align-items:baseline;margin-top:7px}'+
    '#ctcard .k{font:9px/1 ui-monospace,monospace;letter-spacing:1.2px;color:#8a7a5a;'+
      'text-transform:uppercase;width:76px;flex:none}'+
    '#ctcard .v{font:12px/1.3 "Space Grotesk",system-ui,sans-serif;color:var(--ink)}'+
    '#ctcard button{margin-top:11px;margin-right:8px;padding:9px 13px;border:1px solid var(--line);'+
      'background:var(--face);color:var(--acc);font:700 11px/1 "Space Grotesk",system-ui,sans-serif;'+
      'letter-spacing:1.4px;border-radius:8px}';
  document.head.appendChild(css);
  var b=document.createElement('button'); b.id='cttalk'; b.textContent='TALK';
  var c=document.createElement('div'); c.id='ctcard';
  var st=document.getElementById('stage')||document.body;
  st.appendChild(b); st.appendChild(c);
  b.addEventListener('click',function(){ ctOpen(); });
})();

var CT_OPEN=null;
function ctRow(k,v){ return '<div class="r"><div class="k">'+k+'</div><div class="v">'+v+'</div></div>'; }
function ctOpen(){
  var p=ctAdjacent(); if(!p) return;
  CT_OPEN=p; ctDraw();
}
/* SPLIT ON PURPOSE: opening a card is a MEETING, redrawing one is not. Counting
   a redraw as a meeting was a real bug on the run surface on 7/31. */
function ctDraw(){
  var p=CT_OPEN; if(!p) return;
  var who=ctPerson(p);
  var met=CT_MET.get(who.key);
  var nm=BohemiaPeople.nameOf(who);
  var at=ctAt(p);
  var card=document.getElementById('ctcard');
  var body='<div class="who">'+(nm?nm.toUpperCase():BohemiaPeople.headingOf(who))+'</div>';
  body+=ctRow('NAME', nm?nm:'YOU HAVE NOT ASKED');
  /* THE TRADE IS THE TRADE, ALWAYS. headingOf() returns the NAME once you have
     asked - which is right for a heading and wrong for this row, where it made
     the card read "TRADE: MARISELA". Measured on the real surface the first time
     the loop was driven end to end. ROLE_WORDS is the module's own answer. */
  body+=ctRow('TRADE', BohemiaPeople.ROLE_WORDS[who.role]||'SOMEBODY');
  body+=ctRow('LIVES', 'HERE, '+at[0]+' '+at[1]);
  /* RIGHT NOW is EYESIGHT and stays: present tense is what you can see. A
     future or habitual line would be a timetable, which Paolo banned. */
  body+=ctRow('RIGHT NOW', BohemiaPeople.nowLineOf(who, T.min|0) ||
                           (ctAt(p)[0]===p.home[0]?'Standing outside':'Out on the block'));
  body+=ctRow('YOU HAVE MET', met&&met.times>1?(met.times+' TIMES'):'FIRST TIME');
  if(!nm) body+='<button id="ctask">Ask their name</button>';
  body+='<button id="ctgo">Leave them to it</button>';
  card.innerHTML=body; card.style.display='block';
  document.getElementById('cttalk').style.display='none';
  var ask=document.getElementById('ctask');
  if(ask) ask.addEventListener('click',function(){
    CT_MET.ask(who.key, T.day||1); ctSave(); ctDraw(); render(); });
  document.getElementById('ctgo').addEventListener('click',ctClose);
  CT_MET.meet(who.key, T.day||1); ctSave();
}
function ctClose(){ CT_OPEN=null;
  var c=document.getElementById('ctcard'); if(c) c.style.display='none';
  ctVerb(); }

/* THE BUTTON ONLY EXISTS WHEN SOMEBODY IS THERE. That is what makes it the ONE
   CONTEXTUAL VERB and not a menu. */
function ctVerb(){
  var b=document.getElementById('cttalk'); if(!b) return;
  if(CT_OPEN || MODE!=='human'){ b.style.display='none'; return; }
  var p=ctAdjacent();
  if(!p){ b.style.display='none'; window.__CT_VERB=null; return; }
  var label=BohemiaPeople.addressOf(ctPerson(p));
  b.textContent=label; b.style.display='block'; window.__CT_VERB=label;
}

/* THE NAME OVER THEIR HEAD, and only for people you asked. nameOf() returns
   null for a stranger BY LAW, so a stranger can never get one here whatever
   this code does. Drawn after the bodies, at integer positions, in the frame's
   own gold, with a dark ring so it reads over pale ground and dark alike. */
function ctNames(ox,oy,C){
  if(MODE!=='human') return 0;
  var all=ctEveryone(), n=0;
  g.save();
  g.font='11px ui-monospace,monospace'; g.textAlign='center'; g.textBaseline='alphabetic';
  var drew=[];
  for(var i=0;i<all.length;i++){
    var p=all[i], who=ctPerson(p), nm=BohemiaPeople.nameOf(who);
    if(!nm) continue;
    var at=ctAt(p);
    var sx=Math.round(ox+at[0]*C+C/2), sy=Math.round(oy+at[1]*C-Math.round(C*0.30));
    if(sx<-40||sy<-40||sx>cv.width+40||sy>cv.height+40) continue;
    var first=String(nm).split(' ')[0];
    g.fillStyle='rgba(12,14,10,0.85)';
    for(var dx=-1;dx<=1;dx++) for(var dy=-1;dy<=1;dy++) if(dx||dy) g.fillText(first,sx+dx,sy+dy);
    g.fillStyle='#e8b84a'; g.fillText(first,sx,sy);
    drew.push(first); n++;
  }
  g.restore();
  window.__CT_NAMES=drew;
  return n;
}

/* THE NEIGHBOUR IS DRAWN BY THE SAME PASS AS EVERYBODY ELSE. Rather than a
   second blit path (which would drift from the real one), he is appended to the
   neighbourhood list the people pass already walks. */
var _ctPplPeople=pplPeople;
pplPeople=function(nx,ny){
  var list=_ctPplPeople(nx,ny);
  var n=ctNeighbour(); if(!n) return list;
  var NB=BohemiaPopulation.NB, span=NB*FN;
  if(Math.floor(n.home[0]/span)!==nx||Math.floor(n.home[1]/span)!==ny) return list;
  if(list.indexOf(n)>=0) return list;
  var copy=list.slice(); copy.push(n);
  return copy;
};

/* the verb re-evaluates every render, because whether somebody is next to you
   is a fact about the world and not an event */
var _ctRender=render;
render=function(){ var r=_ctRender.apply(this,arguments); try{ ctVerb(); }catch(_e){} return r; };

window.__CT={ everyone:function(){ return ctEveryone().map(function(p){
                var w=ctPerson(p), at=ctAt(p);
                return { key:w.key, tier:w.tier, name:BohemiaPeople.nameOf(w),
                         heading:BohemiaPeople.headingOf(w), x:at[0], y:at[1],
                         d:Math.abs(at[0]-hx)+Math.abs(at[1]-hy) }; }); },
              verb:function(){ return window.__CT_VERB||null; },
              names:function(){ return window.__CT_NAMES||[]; },
              adjacent:function(){ var p=ctAdjacent(); return p?ctPerson(p).key:null; },
              open:function(){ ctOpen(); return !!CT_OPEN; },
              nameCount:function(){ return CT_MET.namesKnown(); },
              wipe:function(){ try{localStorage.removeItem('boh.city.met');}catch(_e){}
                               CT_MET=BohemiaPeople.makeLedger(null); } };
""" + TALK_END + "\n"

# where the names pass hangs: immediately after the people are drawn
NAMES_CALL_OLD = "  window.__PPL_DRAWN = drawn;\n"
NAMES_CALL_NEW = ("  window.__PPL_DRAWN = drawn;\n"
                  "  /* " + MARK + ": names last, so nothing paints over them */\n"
                  "  try{ if(typeof ctNames==='function') ctNames(ox,oy,C); }catch(_ctn){}\n")


def cut(text, a, b, what):
    i = text.find(a)
    if i < 0:
        print('FAILED: cannot re-apply, %s start marker is gone' % what); sys.exit(1)
    j = text.find(b, i)
    if j < 0:
        print('FAILED: cannot re-apply, %s end marker is gone' % what); sys.exit(1)
    return text[:i] + text[j + len(b):]


def main():
    city = open(CITY, encoding='utf8').read()

    """A TRACE IS A STRUCTURAL MARKER, NEVER A MENTION (fixed 8/16).

    This used to strip on `MARK in city` and then re-check the same substring,
    where MARK is the bare words 'CITY TALK'. That worked exactly as long as this
    tool was the only thing in the file that had ever said them. By 8/16 three
    later patches referred to CITY TALK IN THEIR OWN COMMENTS -- the name pass,
    the label pass, and the reroll fix all cite it by name, correctly, because it
    is the lane they must not break. So the strip succeeded, the prose remained,
    and the tool declared its own success a failure and refused to re-apply.
    A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1).
    The real evidence is the four delimiters and the swapped call: if those are
    gone, the strip is clean.
    """
    def traces(t):
        n = sum(t.count(m) for m in (MOD_START, MOD_END, TALK_START, TALK_END))
        return n + t.count(NAMES_CALL_NEW)

    # ---------------------------------------------------------------------
    # REFUSE TO ROLL ANOTHER LANE BACK (8/16). This tool STRIPS the talk block
    # and REGENERATES it from the TALK_JS constant below, which is the 8/3 text.
    # That is fine while this tool is the only thing that has ever written there.
    # It was not: measured 8/16, re-running it deleted 2,607 lines of the
    # FACTIONS lane's work out of the city -- CT_BASES_BAKED and every faction's
    # canon strings, written into this block after 8/3 and never mirrored back
    # here. Every gate stayed green, because a gate that does not know the
    # content existed cannot miss it.
    # A REGENERATOR IS ONLY SAFE WHILE IT IS THE ONLY AUTHOR. So before it
    # destroys anything, it asks whether the block on disk says things it does
    # not know how to say, and stops if it does. Mirror the newer content into
    # TALK_JS (this file is the source of record) and it will apply again.
    # ---------------------------------------------------------------------
    if TALK_START in city and TALK_END in city:
        cur = city[city.index(TALK_START):city.index(TALK_END)]
        mine = set(l.strip() for l in TALK_JS.splitlines())
        theirs = [l.strip() for l in cur.splitlines()
                  if len(l.strip()) > 12 and l.strip() not in mine]
        if theirs:
            print('REFUSING TO WRITE: the CITY TALK block in the city has %d line(s) '
                  'this tool cannot regenerate.' % len(theirs))
            print('Somebody extended it after 8/3 and did not mirror it back here.')
            print('Regenerating would DELETE their work. First three:')
            for l in theirs[:3]:
                print('   ' + l[:100])
            sys.exit(1)

    if traces(city):
        city = cut(city, MOD_START, MOD_END, 'the identity module')
        city = cut(city, TALK_START, TALK_END, 'the talk surface')
        city = city.replace(NAMES_CALL_NEW, NAMES_CALL_OLD, 1)
        if traces(city):
            print('FAILED: strip left traces behind, refusing to double-apply'); sys.exit(1)
        print('  (previous CITY TALK stripped, re-applying)')

    anchor = '/* ==== engine/bohemia_powergrid.js (canon, married 7/20) ==== */'
    if anchor not in city:
        print('FAILED: engine anchor not found'); sys.exit(1)
    people_src = open(PEOPLE, encoding='utf8').read()
    city = city.replace(anchor, MOD_START + '\n' + people_src + '\n' + MOD_END +
                        '\n' + anchor, 1)

    if city.count(NAMES_CALL_OLD) != 1:
        print('FAILED: the people-pass anchor resolves %d times, not 1'
              % city.count(NAMES_CALL_OLD)); sys.exit(1)
    city = city.replace(NAMES_CALL_OLD, NAMES_CALL_NEW, 1)

    tail = '\nwindow.__CITY_INSIDE=function()'
    if tail not in city:
        print('FAILED: script tail anchor not found'); sys.exit(1)
    city = city.replace(tail, '\n' + TALK_JS + tail, 1)

    open(CITY, 'w', encoding='utf8').write(city)
    print('wrote %s' % CITY)
    print('  the city frame can now be spoken to')
    return 0


if __name__ == '__main__':
    sys.exit(main())
