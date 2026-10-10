#!/usr/bin/env python3
"""BOHEMIA — BUILT ON THE MAP (10/9/26, LIFE + CITY, row [built on the map]).

Rule 40b: "what is built shows on the map, on the fight board, and in the derived future". [build on the
screen] put the build list on RUN TWO's settlement screen, but the screen kept its OWN ledger per place:
the map's century ledger (what the derive reads for acts 2 and 3) never heard a build, the map drew
nothing at your base, and what a thing makes landed in the screen's purse, not the map's.

THE MAP OWNS THE LOTS NOW. This patch (idempotent, every block marked, every anchor resolved once):
  1. inlines engine/bohemia_homebases.js and engine/bohemia_lotbuild.js beside the century module;
  2. keeps LOT_BOOK, one build site per place, on the map, and lotBookFor(name) hands the SAME object to
     the settlement screen (same origin, the screen asks window.parent), so there is one truth;
  3. on the day loop's own wake beat (DAY.on('wake'), never a second timer) ticks every site with the
     map's purse, the map's century ledger (centuryGet(), the one the derive reads) and the map's day;
     whose ground is the map's own answer (your outfit's base, BohemiaBetween.mine()), written as
     FACTIONS' ledger for the module to ask;
  4. saves and restores the lots with the century (the save's own literal and its own restore);
  5. draws what stands at the base on the map, from the same cut sprites the screen draws
     (slices/settlement/lot/), small, on the base's west side, scaled with the map's people.

REUSE CHECK: the module is this lane's gated engine/bohemia_lotbuild.js; the ledger is the map's own
century (centuryGet); the purse the map's own (purseGet); the beat the day loop's own; the art the
approved street's own pieces. Nothing new is drawn.

Run from repo root:  python3 tools/bohemia_city_built_patch.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODS = ['bohemia_homebases', 'bohemia_lotbuild']
AFTER = '/* ==== /engine/bohemia_livingmap.js ==== */\n'

GLUE_MARK, GLUE_END = '/* __BUILT_ON_THE_MAP__ (LIFE+CITY 10/9) */', '/* __/BUILT_ON_THE_MAP__ */'
GLUE = GLUE_MARK + r'''
/* THE MAP OWNS THE BUILD LOTS. One site per place; the settlement screen is handed the same object
   (lotBookFor), so what he builds there IS the map's. var-hoisted on purpose: the save's restore may run
   before this line, and must not have its lots wiped by it. */
var LOT_BOOK = LOT_BOOK || {};
/* WHO HOLDS WHAT IS ONE LEDGER ON THE MAP: FACTIONS' (engine/bohemia_homebases.js), made once, saved, restored. Your
   outfit's own base is yours from the first day (one taking, 'deal': nobody fought for it); every other base is its
   own people's until somebody takes it. The build lots and the raids read this one ledger, never a copy. */
var HB_REC = HB_REC || null;
function hbRec(){
  if(HB_REC) return HB_REC;
  var H = BohemiaHomeBases; HB_REC = H.make({ act: 1 });
  try{ var m = BohemiaBetween.mine(), bs = ctBases() || {}, n = function(v){ return String(v||'').toUpperCase().replace(/[\s_]/g,''); };
       for(var k in bs) if(m && n(k) === n(m)) H.took(HB_REC, { base: k, to: H.YOU, day: 0, by: 'deal', why: "your outfit's own base" }); }catch(_e){}
  return HB_REC;
}
function lotIsMine(name){
  try{ var H = BohemiaHomeBases, r = hbRec(); return !H.isRuin(r, name, r.act) && H.heldBy(r, name, r.act) === H.YOU; }catch(_e){ return false; }
}
function lotHoldFor(name){ var r = hbRec(); return { rec: r, act: r.act }; }
function lotBookFor(name){
  if(!LOT_BOOK[name]) LOT_BOOK[name] = BohemiaLotBuild.site({ base: name });
  return LOT_BOOK[name];
}
/* THE MORNING: what was started stands, what stands pays, into the map's purse and the map's century; a raid that
   is due and that nobody answered is settled the world's way (FACTIONS' settle: the base holds if it is as strong as
   the crew, else the crew takes it); and a base worth taking draws a crew. */
function lotWake(){
  var done = 0;
  try{ raidSettle(); }catch(_e){}
  for(var n in LOT_BOOK){
    try{ var r = BohemiaLotBuild.tick(LOT_BOOK[n], purseGet(), centuryGet(), DAY.day, lotHoldFor(n));
         done += (r && r.finished) ? r.finished.length : 0; }catch(_e){}
  }
  window.__LOTS_FINISHED = (window.__LOTS_FINISHED || 0) + done;
  try{ raidDraw(); }catch(_e){}
  return done;
}
/* ---- A RAID ON YOUR BASE ([a raid on your base], LIFE+CITY 10/9; the ledger is FACTIONS') ---- */
function raidSay(txt){
  try{ travelSay(txt); }catch(_e){}
  try{ if(window.BOHEMIA_FEED) window.BOHEMIA_FEED.push({ who: '@thegate', txt: txt, kind: 'world', draft: true }); }catch(_e){}
  window.__RAID_SAID = (window.__RAID_SAID || []).concat([txt]).slice(-12);
}
/* a crew arrived somewhere: if it is a base you hold, the raid opens and its clock starts */
function raidArrivals(arr){
  var H = BohemiaHomeBases, rec = hbRec(), seats = turfSeats() || [];
  var raids = H.raidsFrom(arr, seats, rec, H.YOU);
  raids.forEach(function(r){
    var o = H.openRaid(rec, { base: r.base, by: r.by, party: r.party, power: r.power, day: DAY.day });
    if(o.applied) raidSay('A crew from ' + r.by + ' is at the gate of ' + r.base + '. ' + (o.raid.due - DAY.day) + ' days, or it is theirs.');
  });
  if(raids.length){ try{ raidDefend(); }catch(_e){} }
  return raids;
}
function raidSettle(){
  var H = BohemiaHomeBases, out = H.settle(hbRec(), turfSeats() || [], DAY.day);
  out.forEach(function(r){
    if(r.how === 'moot') return;
    raidSay(r.outcome === 'taken' ? (r.by + ' took ' + r.base + '. What we built there stands. It pays them now.')
                                  : (r.base + ' held. The crew from ' + r.by + ' went home.'));
  });
  return out;
}
/* a base you hold with things standing on it draws ONE crew, once an act, when none is open or already walking */
function raidDraw(){
  var H = BohemiaHomeBases, rec = hbRec(), seats = turfSeats() || [], ps = partiesAll() || [];
  for(var n in LOT_BOOK){
    if(!lotIsMine(n)) continue;
    var up = 0; for(var k in LOT_BOOK[n].lots) if(LOT_BOOK[n].lots[k].done) up++;
    if(up < BohemiaLivingMap.WORTH_RAIDING || H.raidsOpen(rec).some(function(x){ return x.base === n; }) || H.raidsOn(rec, n, rec.act) >= 1) continue;
    var seat = seats.filter(function(s){ return s.faction === n; })[0]; if(!seat) continue;
    if(ps.some(function(p){ return p && p.raid && p.to && p.to.x === seat.x && p.to.y === seat.y && !p.arrived; })) continue;
    var crew = BohemiaLivingMap.crewAt(seats, seat, {
      friend: function(f){ try{ var e = BohemiaBetween.between(f, BohemiaBetween.mine(), null); return !!e && e.init > 0; }catch(_e){ return false; } },
      holds: function(f){ return H.heldBy(rec, f, rec.act) === f; } });
    if(!crew) continue;
    ps.push(crew);
    raidSay('A crew from ' + crew.from.faction + ' left home, walking at ' + n + '. You can see them coming.');
  }
}
/* YOU CAN BE THERE (rule 68: you see them coming; [built on the board]: you fight on what you built). Standing at a base
   you hold while its raid is open starts the fight at the gate, through the one door every fight goes through (so
   what stands there is on the board); the crew is sized by the map's own party math. A win (the crew gone, nobody
   left standing) closes the raid: the base held. A loss is a reload (below). */
var RAID_FIGHTING = null;
function raidDefend(){
  if(RAID_FIGHTING) return false;
  var H = BohemiaHomeBases, rec = hbRec(), seats = turfSeats() || [];
  var open = H.raidsOpen(rec);
  for(var i = 0; i < open.length; i++){
    var r = open[i]; if(!lotIsMine(r.base)) continue;
    var seat = seats.filter(function(s){ return s.faction === r.base; })[0]; if(!seat) continue;
    if(Math.max(Math.abs(city.x - seat.x), Math.abs(city.y - seat.y)) > 1) continue;
    /* the crew is sized by the map's own party math and dressed by COMBAT's enemy table (its own enemy kinds: the
       raider's faction NAME is not one, and handing it over left the fight unable to build its ground) */
    var party = null; try{ party = partyMath('roaming', { x: seat.x, y: seat.y }); }catch(_e){ party = null; }
    var roster = []; for(var k = 0; k < ((party && party.count) || 3); k++) roster.push({ arch: 'human' });
    RAID_FIGHTING = r.base;
    var ok = false;
    try{ ok = cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'The raid on ' + r.base, faction: r.by, draft: true,
      roster: roster, party: party, street: true, why: 'raid:' + r.base, at: { x: seat.x, y: seat.y, gx: seat.x, gy: seat.y } }); }catch(_e){ ok = false; }
    if(!ok){ RAID_FIGHTING = null; continue; }
    raidSay('The crew from ' + r.by + ' is at the gate. You are here. Fight.');
    return true;
  }
  return false;
}
/* A LOSS IS NOT A TAKING. DEATH IS A RELOAD, NOT A RESET (Paolo 7/26): going down sends him back to the save made at
   the bell, and that save has the raid still open at the gate. So a loss writes nothing here; the reload is the
   answer, and the raid's own days still run (stay away and the world settles it). A win closes it: the base held. */
function raidFought(o){
  var base = RAID_FIGHTING; RAID_FIGHTING = null; if(!base) return null;
  var won = !!(o && (o.victory || o.result === 'win')) && !((o && o.alive) | 0);
  if(!won) return { applied: false, reason: 'RELOAD' };
  var res = BohemiaHomeBases.closeRaid(hbRec(), { base: base, outcome: 'held', day: DAY.day, how: 'fought' });
  if(res.applied) raidSay(base + ' held. You stood at the gate and they broke.');
  return res;
}
window.addEventListener('message', function(ev){
  var d = ev && ev.data; if(!d || d.type !== 'BOHEMIA_CITY_COMBAT_END' || !RAID_FIGHTING) return;
  try{ raidFought(d.outcome || null); }catch(_e){}
});
window.raidArrivals = raidArrivals; window.raidSettle = raidSettle; window.raidDraw = raidDraw; window.hbRec = hbRec;
window.raidDefend = raidDefend; window.raidFought = raidFought;
DAY.on('wake', function(){ try{ lotWake(); }catch(_e){} });
window.lotBookFor = lotBookFor; window.lotWake = lotWake; window.lotIsMine = lotIsMine;
/* the built things' pictures, the same cuts the settlement screen stands on its lots */
var LOT_SPR = {};
function lotSprite(id){
  if(!LOT_SPR[id]){ var im = new Image(); im.src = 'settlement/lot/' + id + '.png'; LOT_SPR[id] = im; }
  var s = LOT_SPR[id]; return (s.complete && s.naturalWidth) ? s : null;
}
''' + GLUE_END + '\n'
GLUE_BEFORE = '/* THE WAKE BEAT ITSELF. DAY.on(\'wake\') is the day loop\'s own hook, so this fires'

SAVE_OLD = "    century:(function(){ try{ return BohemiaCentury.save(centuryGet()); }catch(_e){ return null; } })(),\n"
SAVE_NEW = SAVE_OLD + ("    /* __BUILT_ON_THE_MAP__: the build lots ride with the century they write into */\n"
                       "    lots:(function(){ try{ var o = {}; for(var n in LOT_BOOK) o[n] = JSON.parse(BohemiaLotBuild.save(LOT_BOOK[n])); return o; }catch(_e){ return null; } })(),\n"
                       "    homebases:(function(){ try{ return HB_REC ? BohemiaHomeBases.toJSON(HB_REC) : null; }catch(_e){ return null; } })(),\n")
LOAD_OLD = "  if(st.century){ try{ CENTURY=BohemiaCentury.load(st.century); }catch(_e){} }\n"
LOAD_NEW = LOAD_OLD + ("  /* __BUILT_ON_THE_MAP__ */\n"
                       "  if(st.lots){ try{ for(var __ln in st.lots){ var __ls = BohemiaLotBuild.load(JSON.stringify(st.lots[__ln])); if(__ls) LOT_BOOK[__ln] = __ls; } }catch(_e){} }\n"
                       "  if(st.homebases){ try{ HB_REC = BohemiaHomeBases.load(st.homebases); }catch(_e){} }\n")

DRAW_MARK, DRAW_END = '        /* __BUILT_ON_THE_MAP__ at the base (LIFE+CITY 10/9) */', '        /* __/BUILT_ON_THE_MAP__ at the base */'
DRAW = DRAW_MARK + r'''
        /* WHAT YOU BUILT, AT YOUR BASE: what stands on its lots, on its west side, nearest first, at
           the map people's scale; going up is faint, as on the screen. */
        try { MAP_DREW.baseAt = MAP_DREW.baseAt || {}; MAP_DREW.baseAt[__n] = { sx: __p.sx, cy: __cy }; } catch (_e8) {}   /* where a base sits on the glass, for a probe to point at */
        try {
          var __lb = LOT_BOOK && LOT_BOOK[__n], __lk = 0;
          if (__lb) {
            /* on the base's west side, nearest first, so the party's own flag on the east is never covered */
            var __lx0 = __p.sx - 16 * MAP_PEOPLE_K, __lfy = __cy + 6 + 2 * MAP_PEOPLE_K;
            for (var __lkey in __lb.lots) {
              var __lot = __lb.lots[__lkey], __im = lotSprite(__lot.id); if (!__im) continue;
              var __lh = 16 * MAP_PEOPLE_K, __lw = __im.naturalWidth * (__lh / __im.naturalHeight);
              if (__lw > 24 * MAP_PEOPLE_K) { __lw = 24 * MAP_PEOPLE_K; __lh = __im.naturalHeight * (__lw / __im.naturalWidth); }
              __lx0 -= __lw;
              g.save(); g.imageSmoothingEnabled = false; g.globalAlpha = __lot.done ? 1 : 0.4;
              g.drawImage(__im, mapSnap(__lx0), mapSnap(__lfy - __lh), __lw, __lh); g.restore();
              __lx0 -= 3 * MAP_PEOPLE_K; __lk++;
            }
            try { MAP_DREW.built = MAP_DREW.built || {}; MAP_DREW.built[__n] = __lk; } catch (_e7) {}
          }
        } catch (_e7) {}
''' + DRAW_END + '\n'
DRAW_BEFORE = '        __r = Math.max(__r, __ps.height - 4);      /* the name plate sits above the building */'


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


def put(s, begin, end, block, insert):
    """A marked block that already exists is rewritten IN PLACE (so two patches that both anchor near the
    same line never swap places run after run); a missing one is inserted by `insert`."""
    i = s.find(begin)
    if i >= 0:
        j = s.find(end, i)
        if j < 0:
            sys.exit('REFUSING TO WRITE: %r opens and never closes.' % begin)
        k = j + len(end)
        if s[k:k + 1] == '\n':
            k += 1
        return s[:i] + block + s[k:]
    return insert(s)


def once(s, a, label):
    if s.count(a) != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times.' % (label, s.count(a)))


ARRIVE_OLD = "function loopArrived(to){\n  var x = city.x, y = city.y;\n"
ARRIVE_NEW = ARRIVE_OLD + "  try{ if(typeof raidDefend === 'function' && raidDefend()) return; }catch(_e){}   /* __BUILT_ON_THE_MAP__ a raid at your gate (LIFE+CITY 10/9) */\n"


def main():
    s = open(CITY, encoding='utf8').read()
    before = s
    for m in MODS:
        b, e = '/* ==== engine/%s.js ==== */' % m, '/* ==== /engine/%s.js ==== */' % m
        body = open(os.path.join(ROOT, 'engine', m + '.js'), encoding='utf8').read().rstrip('\n')
        if '</' in body:
            sys.exit('REFUSING TO WRITE: %s would close the script tag.' % m)
        blk = '%s\n%s\n%s\n' % (b, body, e)
        def ins_mod(t, blk=blk):
            once(t, AFTER, 'living map module end'); return t.replace(AFTER, AFTER + blk, 1)
        s = put(s, b, e, blk, ins_mod)
    def ins_glue(t):
        once(t, GLUE_BEFORE, 'the wake beat'); return t.replace(GLUE_BEFORE, GLUE + GLUE_BEFORE, 1)
    s = put(s, GLUE_MARK, GLUE_END, GLUE, ins_glue)
    SAVE_PREV = SAVE_OLD + ("    /* __BUILT_ON_THE_MAP__: the build lots ride with the century they write into */\n"
                            "    lots:(function(){ try{ var o = {}; for(var n in LOT_BOOK) o[n] = JSON.parse(BohemiaLotBuild.save(LOT_BOOK[n])); return o; }catch(_e){ return null; } })(),\n")
    LOAD_PREV = LOAD_OLD + ("  /* __BUILT_ON_THE_MAP__ */\n"
                            "  if(st.lots){ try{ for(var __ln in st.lots){ var __ls = BohemiaLotBuild.load(JSON.stringify(st.lots[__ln])); if(__ls) LOT_BOOK[__ln] = __ls; } }catch(_e){} }\n")
    for new_, prev, old_, label in ((SAVE_NEW, SAVE_PREV, SAVE_OLD, 'the save'), (LOAD_NEW, LOAD_PREV, LOAD_OLD, 'the restore')):
        if new_ in s:
            continue
        if s.count(prev) == 1:
            s = s.replace(prev, new_, 1)
        else:
            once(s, old_, label)
            s = s.replace(old_, new_, 1)
    if ARRIVE_NEW not in s:
        once(s, ARRIVE_OLD, 'loopArrived')
        s = s.replace(ARRIVE_OLD, ARRIVE_NEW, 1)
    # RETIRED 10/10 (rule 86, the seventh votes: 'the map is mainly for looks'): what you build is not drawn on the
    # map. The drawing block is never inserted again, and one left in a page is taken out here.
    s = cut(s, DRAW_MARK, DRAW_END)
    if s == before:
        print('BUILT ON THE MAP: nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('BUILT ON THE MAP: the map owns the lots, ticks them on the wake beat, saves them and draws them at the base')


if __name__ == '__main__':
    main()
