#!/usr/bin/env python3
"""BOHEMIA — BUILD ON THE SCREEN (10/9/26, LIFE + CITY, row [build on the screen]).

Puts this lane's build list (engine/bohemia_lotbuild.js, eight things, gate BUILD A LOT) onto RUN TWO's
settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html) the way every other building there works: a
place on the picture you tap, a mouth with a face that speaks (rule 32a), a sheet of acts. Every change
is a MARKED block, found by its marker and rewritten, never stacked; every anchor must resolve exactly
once or nothing is written. RUN TWO's own code is not edited except where a one-line hook is needed
(the list of tappable buildings, one branch in openB, one call in draw, one read in open).

  - THE PLACE: open ground in each tier's picture, picked by eye (BUILDBOX), FOUR LOTS across it (a
    number of mine, draft, for TUNING). Its name is BUILD, its keeper is YOU, as the scavenge lot's is.
  - WHOSE GROUND: the map says whether you hold this place (`held` in the open message, the map's own
    answer: your outfit's base). The screen writes that as FACTIONS' ledger (one taking) and the build
    module asks it, so a place you do not hold refuses BY NAME and costs nothing (rule 43).
  - WHAT IT COSTS AND WHEN: the module's own (one battery, one day). The day is the map's (`day` in the
    open message); a lot started on day d stands on day d+1. The purse is the screen's own, so the
    battery spent goes back to the map on the next post, like every other act on this screen.
  - WHAT STANDS: drawn on the picture, on its lot, from the street's own art cut out by
    tools/bohemia_lot_sprites_factory.py (slices/settlement/lot/); half-built is the same sprite, faint.
  - MEMORY: the place's lots and its century ledger are kept per place in the page's own storage (the
    bag already does this); a build posts 'build' {id, lot} to the map.

REUSE CHECK: nothing new is drawn by hand. The place on the picture is COMBAT TWO's painted town; the
things that stand are the approved street's own pieces (tools/bohemia_lot_sprites_factory.py); the sheet
is the page's own speak()/act() and its torn-label plates; the money is the page's purse; the rules are
engine/bohemia_lotbuild.js and FACTIONS' engine/bohemia_homebases.js.

Run from repo root:  python3 tools/bohemia_settlement_build_patch.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_SETTLEMENT_SCREEN.html')

TAGS_MARK = '<!-- __BUILD_ON_THE_SCREEN__ scripts (LIFE+CITY 10/9) -->'
TAGS = TAGS_MARK + '\n' + '\n'.join('<script src="../engine/%s.js"></script>' % f for f in
       ['bohemia_century', 'bohemia_housing', 'bohemia_powerbuild', 'bohemia_homebases', 'bohemia_lotbuild']) + \
       '\n<!-- __/BUILD_ON_THE_SCREEN__ scripts -->\n'
TAGS_BEFORE = '<script src="bohemia_ui_materials.js"></script>'

CODE_MARK = '/* __BUILD_ON_THE_SCREEN__ (LIFE+CITY 10/9) */'
CODE_END = '/* __/BUILD_ON_THE_SCREEN__ */'
CODE = CODE_MARK + r'''
/* BUILD ON THE SCREEN (rule 40b: "a more deep rich interactable buildable world"; rule 43: you build
   where you hold). The list, the cost, the day and what each thing does are engine/bohemia_lotbuild.js;
   this block is only the place on the picture, the mouth, and the drawing of what stands. */
B.build = {name:'BUILD', short:'1 battery, 1 day'};
KEEPERS.build = {who:'you', name:'YOU', draft:true};
var BUILDBOX = {camp:[1600,440,2010,600], town:[420,400,1080,530], fortress:[1640,480,2040,760]};
var BUILD_LOTS = 4;                                   /* lots on a place's open ground: mine, draft, TUNING */
var LOTSPR = {};
['wall','tank','shed','pump','garden','solar','stall','roof'].forEach(function(id){
  var im = new Image(); im.src = 'settlement/lot/' + id + '.png'; LOTSPR[id] = im; });
function buildKey(){ return 'bohemia.lots.' + S.place.name; }
/* INSIDE THE GAME THE MAP OWNS THE LOTS ([built on the map], 10/9): the same object, from the parent
   (same origin), so the map's morning finishes them, pays its own purse and writes its own century, and
   draws them at the base. The page keeps its own only when it is played on its own. */
function buildParent(){ try{ var w = window.parent; return (w && w !== window && typeof w.lotBookFor === 'function') ? w : null; }catch(e){ return null; } }
function buildState(){
  if(S.build && S.build.name === S.place.name) return S.build;
  var PW = buildParent();
  if(PW){ S.build = { name: S.place.name, site: PW.lotBookFor(S.place.name), century: null, parent: true }; return S.build; }
  var LB = window.BohemiaLotBuild, C = window.BohemiaCentury, st = null;
  try{ st = JSON.parse(localStorage.getItem(buildKey()) || 'null'); }catch(e){ st = null; }
  S.build = { name: S.place.name,
              site: (st && LB && LB.load(JSON.stringify(st.site))) || (LB ? LB.site({base:S.place.name}) : null),
              century: (C && st && st.century) ? C.load(st.century) : (C ? C.make({act:1}) : null) };
  return S.build;
}
function buildSave(){ var b = S.build; if(!b || b.parent) return;   /* the map saves its own */
  try{ localStorage.setItem(buildKey(), JSON.stringify({site: JSON.parse(BohemiaLotBuild.save(b.site)),
                                                        century: BohemiaCentury.save(b.century)})); }catch(e){} }
/* the ledger FACTIONS keeps, written from the map's answer: one taking, or nothing */
function buildHold(){
  var H = window.BohemiaHomeBases; if(!H) return null;
  var rec = H.make({act:1});
  if(buildMine()) H.took(rec, {base:S.place.name, to:H.YOU, day:buildDay()});
  return {rec:rec, act:1};
}
/* whose ground: the map always says (held in the open message); the page alone, played on its own purse
   (its header: 'Standalone it runs on its own purse with 3 batteries so it can be played'), is your place */
function buildMine(){ return (S.mine === undefined) ? !!S.standalone : !!S.mine; }
function buildDay(){ return (typeof S.mapDay === 'number') ? S.mapDay : (S.day|0); }
function buildTick(){
  var LB = window.BohemiaLotBuild, b = buildState(); if(!LB || !b.site) return null;
  if(b.parent) return null;   /* the map's morning ticks it, into the map's purse and century */
  var r = LB.tick(b.site, S.purse, b.century, buildDay(), buildHold()); buildSave(); return r;
}
function buildFreeLot(){ var b = buildState(); for(var i=0;i<BUILD_LOTS;i++) if(!b.site.lots[i+',0']) return {x:i, y:0}; return null; }
function buildDoes(e){
  if(e.houses) return 'a family';
  if(e.makes && e.makes.clout) return 'your name';
  if(e.six) return '+1 ' + (e.six === 'batteries' ? 'battery' : e.six) + '/day';
  return e.guards ? 'keeps out ' + e.guards : 'nothing';
}
/* HELD (rule 88, Paolo 10/10: looks first, features hold): Take it shipped 43 minutes after the hold and is switched off
   in the game until he lifts it; the machinery stays and its gate switches it on to keep it honest. */
window.BUILD_TAKE_ON = false;
var BUILD_NO = { NOT_HELD:'This is not our ground. We build where we hold. Take it first.', RUIN:'Nothing stands on a ruin this generation.',
  NO_HOLD:'This is not our ground. We build where we hold. Take it first.', CANNOT_AFFORD:'No battery, nothing goes up.',
  LOT_TAKEN:'Something is already going up there.', KIND_LOCKED:'We do not know how to build that yet.' };
function buildSheet(body, acts, line){
  var LB = window.BohemiaLotBuild, b = buildState(), hold = buildHold();
  /* the place's gossip is the keepers' to say, and this keeper is YOU: the player does not speak it */
  if(line && line === traitLine('build')) line = null;
  if(!LB || !b.site){ body.appendChild(speak('build', 'Nothing to build with.')); body.appendChild(acts); return show(); }
  buildTick();
  if(!buildMine()){
    /* TAKE THE NEXT PART ([take the next part], rule 43: what you hold grows by taking). Inside the game, one act:
       go to their gate. The map runs it (one fight there; win and the place is yours, lose and it is a reload). */
    body.appendChild(speak('build', line || 'This is not our ground. We build where we hold.'));
    if(window.BUILD_TAKE_ON && buildParent()) acts.appendChild(act('Take it', 'a fight at their gate', function(){
      post('take', {}); heard('You go to their gate.');
    }));
    body.appendChild(acts); return show();
  }
  var free = buildFreeLot(), list = LB.list(b.site, S.purse, hold);
  body.appendChild(speak('build', line || (free ? 'One battery and a day for any of these. What goes up?' : 'Every lot here has something on it.')));
  list.forEach(function(e){
    acts.appendChild(act(e.name, '1 batt  ' + buildDoes(e), function(){
      var lot = buildFreeLot(); if(!lot) return openB('build', 'Every lot here has something on it.');
      var r = LB.start(b.site, S.purse, lot, e.id, buildDay(), hold);
      if(!r.ok) return openB('build', BUILD_NO[r.why] || 'It will not go up.');
      buildSave(); post('build', {id:e.id, lot:lot, day:buildDay()}); shelf();
      heard('The ' + e.name.toLowerCase() + ' goes up. It stands tomorrow.'); openB('build', 'It goes up tonight. Tomorrow it stands.');
    }, !free || !e.affordable));
  });
  var sl = document.createElement('div'); sl.className = 'slots';
  var up = [], going = [];
  for(var k in b.site.lots){ var L = b.site.lots[k], nm = (LB.markerOf(L.id) || {}).name || L.id; (L.done ? up : going).push(nm); }
  sl.textContent = 'Standing: ' + (up.length ? up.join(', ') : 'nothing yet') + (going.length ? '.  Going up: ' + going.join(', ') + '.' : '.')
                 + '  Lots: ' + Object.keys(b.site.lots).length + ' of ' + BUILD_LOTS + '.';
  body.appendChild(acts); body.appendChild(sl); return show();
}
/* WHAT STANDS, ON ITS LOT: the street's own art, its foot on the box's floor; going up is faint */
function drawBuilt(s){
  if(!VAR || !VAR.boxes.build) return;
  var b = buildState(); if(!b.site) return;
  var bx = VAR.boxes.build, lw = (bx[2]-bx[0]) / BUILD_LOTS, lh = bx[3]-bx[1];
  for(var k in b.site.lots){
    var L = b.site.lots[k], im = LOTSPR[L.id]; if(!im || !im.complete || !im.naturalWidth) continue;
    var k2 = Math.min(2, (lw*0.92)/im.naturalWidth, (lh*0.95)/im.naturalHeight);
    var w = im.naturalWidth*k2, h = im.naturalHeight*k2;
    var x = view.ox + (bx[0] + lw*L.x + (lw - w)/2)*s, y = view.oy + (bx[3] - h)*s;
    cx.save(); cx.imageSmoothingEnabled = false; cx.globalAlpha = L.done ? 1 : 0.35;
    cx.drawImage(im, Math.round(x), Math.round(y), Math.round(w*s), Math.round(h*s)); cx.restore();
  }
}
''' + CODE_END + '\n'
CODE_BEFORE = 'var GROUND = null, PIC = {day:null, night:null}, VAR = null;'

HOOKS = [
    # the tappable list
    ("  ORDER = ['hall','board','stall','bar','arms','smith','armourer','barber','clinic','lot'].filter(",
     "  ORDER = ['hall','board','stall','bar','arms','smith','armourer','barber','clinic','lot','build'].filter("),
    # where the place is on the picture
    ("  VAR.boxes.lot = LOTBOX[S.place.tier] || LOTBOX.town;\n",
     "  VAR.boxes.lot = LOTBOX[S.place.tier] || LOTBOX.town;\n"
     "  VAR.boxes.build = BUILDBOX[S.place.tier] || BUILDBOX.town;   /* __BUILD_ON_THE_SCREEN__ */\n"),
    # the sheet
    ("  else if(k==='lot'){\n",
     "  else if(k==='build'){ return buildSheet(body, acts, line); }   /* __BUILD_ON_THE_SCREEN__ */\n  else if(k==='lot'){\n"),
    # the drawing
    ("  drawTraitLooks(s);\n",
     "  drawTraitLooks(s);\n  try{ drawBuilt(s); }catch(e){}   /* __BUILD_ON_THE_SCREEN__ */\n"),
    # what the map says
    ("  if(o.traits !== undefined) S.forceTraits = o.traits;",
     "  S.build = null;   /* __BUILD_ON_THE_SCREEN__: a new place, its own lots */\n"
     "  if(o.held !== undefined) S.mine = !!o.held;   /* __BUILD_ON_THE_SCREEN__: the map says whether this place is yours */\n"
     "  if(typeof o.day === 'number') S.mapDay = o.day;   /* __BUILD_ON_THE_SCREEN__: the map's day */\n"
     "  if(o.traits !== undefined) S.forceTraits = o.traits;"),
    # the plate under the finger
    ("  if(k==='board') return S.held.length+' of '+SLOTS+' held';\n",
     "  if(k==='board') return S.held.length+' of '+SLOTS+' held';\n"
     "  if(k==='build') return buildMine() ? '1 battery, 1 day' : 'not your ground';   /* __BUILD_ON_THE_SCREEN__ */\n"),
]


def cut(s, b, e):
    i = s.find(b)
    if i < 0:
        return s
    j = s.find(e, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %r opens and never closes.' % b)
    k = j + len(e)
    if s[k:k + 1] == '\n':
        k += 1
    return s[:i] + s[k:]


def main():
    s = open(PAGE, encoding='utf8').read()
    before = s
    s = cut(s, TAGS_MARK, '<!-- __/BUILD_ON_THE_SCREEN__ scripts -->')
    s = cut(s, CODE_MARK, CODE_END)
    for anchor, label in ((TAGS_BEFORE, 'materials script'), (CODE_BEFORE, 'the ground vars')):
        if s.count(anchor) != 1:
            sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times.' % (label, s.count(anchor)))
    s = s.replace(TAGS_BEFORE, TAGS + TAGS_BEFORE, 1)
    s = s.replace(CODE_BEFORE, CODE + CODE_BEFORE, 1)
    for old, new in HOOKS:
        if new in s:
            continue
        if s.count(old) != 1:
            sys.exit('REFUSING TO WRITE: hook %r resolves %d times.' % (old[:50], s.count(old)))
        s = s.replace(old, new, 1)
    if s == before:
        print('BUILD ON THE SCREEN: nothing to do')
        return
    open(PAGE, 'w', encoding='utf8').write(s)
    print('BUILD ON THE SCREEN: the build list is a place on the settlement picture')


if __name__ == '__main__':
    main()
