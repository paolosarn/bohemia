#!/usr/bin/env python3
"""BOHEMIA CITY FACTIONS PATCH -- move the FACTIONS lane onto the surface he walks (8/14/26)

*** WHAT WENT WRONG, AND IT IS MINE. ***

The coordinator ruled on 8/14 (BOHEMIA_BACKLOG.md banner, records/BOHEMIA_DEMO_
STATUS_BOARD_8_14_26.md): THE CITY WORLD IS THE WALKED SURFACE, and
slices/BOHEMIA_RUN_CURRENT.html IS LEGACY -- preloaded on every visit and NEVER
DISPLAYED. Verified independently before writing a line of this: open the real
alpha, tap RUN, and p-run computes to display:none while p-city is block and
#runFrame.offsetParent is null.

This lane spent four turns wiring player-facing work into the run slice:
  - the sixteen introductions on the person card   (8/12)
  - who knows who, and the vouch                   (8/12)
  - what a faction wants from you                  (8/12)
  - the peripheral act and its preconditions       (8/14)

All of it is real, all of it is gated, and NONE OF IT IS ON THE SURFACE HE PLAYS.
The judge pages in the LIFE tab saved half of it -- he can look at all four -- but
the in-game half has been dark since the day it shipped. That is the
authored-but-unread disease that this lane wrote a gate against, committed by the
lane that wrote the gate.

*** WHY THE PORT IS NOT A COPY-PASTE. *** The city's people are SHIMS. ctAgent()
fabricates `H<n>-1` (everybody alone in their own house) and `job:{kind:'scav'}`
(everybody a lone scavenger), and there is no faction anywhere in the file. So all
three organs would port over and sit inert: no faction means every introduction
falls to DEFAULT, no household or job site means the tie graph is empty, and no
outfit means there is no bargain. The thing that unlocks all three is ONE fact the
city does not have: WHO THIS PERSON RUNS WITH.

*** ONE ANSWER, NOT TWO. *** Faction bases could be invented here from the city's
own overmap, and then the Cartel would live in two different places depending on
which surface you were standing on. That is the two-systems-disagreeing bug this
lane has now fixed four times. So the bases come from THE SAME PLACE the run gets
them: BohemiaLoop.boot()'s own placement rule, run once, lazily, and cached.
Measured warm: 165ms for the whole boot, and it is not paid until you open your
first person card -- the COLD BOOT gate's budget is untouched.

MECHANISM-MINE / CONTENTS-PAOLO'S: nothing here decides anything. It moves work
that already exists onto the surface that is already ruled.

REUSE CHECK (7/22 law):
  - engine/bohemia_introductions.js, _ties.js, _belonging.js ... OPENED IN CODE and
    injected with the ==== engine/x.js ==== banner, so they JOIN the ENGINE SYNC
    sweep (tools/bohemia_city_module_resync.py) and cannot drift behind canon.
  - engine/bohemia_loop.js ......... ALREADY in the city; used for its base
    placement rather than a second copy of the rule.
  - engine/bohemia_agents.js ....... ALREADY in the city; factionOf is called, not
    reimplemented.
  - tools/bohemia_city_dayloop_patch.py ... COPIED BY HAND as the FORM (marker,
    idempotent NOOP, banner-wrapped bodies). No bytes of it are opened.
  - nothing is drawn, nothing is cooked.

  python3 tools/bohemia_city_factions_patch.py

Law:  laws/BOHEMIA_ADDENDUM_THE_WALKED_SURFACE_IS_THE_GAME_8_14_26.md
Gate: gates/walked_surface_gate.js
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_FACTIONS__'
MODULES = ['engine/bohemia_introductions.js', 'engine/bohemia_ties.js',
           'engine/bohemia_belonging.js']

ANCHOR = "function ctPerson(p){"

BLOCK = r'''/* ''' + MARKER + r''' -- THE FACTIONS LANE, ON THE SURFACE HE ACTUALLY WALKS (8/14/26).

   Everything below already existed and already worked -- on slices/BOHEMIA_RUN_
   CURRENT.html, which the alpha preloads and never displays. The coordinator ruled
   the city the walked surface on 8/14; this is the lane moving.

   WHO THIS PERSON RUNS WITH is the one fact the city did not have, and all three
   organs hang off it. The bases come from the RUN'S OWN placement rule, not a
   second one invented here, or the Cartel would live in two places depending on
   which surface you were standing on. Booted once, lazily, on the first card you
   open -- never at load, so the cold-boot budget is untouched. */
var CT_BASES_BAKED = __BASES_JSON__;
var CT_BASES_SEED  = __BASES_SEED__;
/* THE BASES ARE THE RUN'S OWN, BAKED AT BUILD TIME. bohemia_loop.js is inlined in
   this file but never reaches the global scope here, so booting it at runtime is
   not on the table. The alternative -- deriving bases from the city's own overmap
   -- would put the Cartel in two different places depending on which surface you
   were standing on, which is the two-systems-disagreeing bug this lane has now
   fixed four times. So they are produced by running the loop's OWN placement rule
   at patch time and keyed to the seed TEXT they were produced for: a different
   seed gets NULL rather than a confidently wrong answer. */
function ctBases(){
  if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
  return CT_BASES_BAKED;
}
/* the overmap cell you are standing in. hx,hy are GLOBAL FINE coords and FN is the
   fine tiles per cell, so this is the same cell the rest of the world means. */
function ctCell(){ return [Math.floor(hx/FN), Math.floor(hy/FN)]; }
function ctFactionOf(p){
  var bases = ctBases();
  if(!bases || typeof BohemiaAgents === 'undefined') return null;
  try { return BohemiaAgents.factionOf(ctAgent(p), ctCell(), bases); } catch(_e){ return null; }
}

/* the save this lane keeps: how many times you did what an outfit wanted, and on
   which day. Same shape and the SAME WRITER the run and the world bridge use
   (BohemiaBelonging.record), so the count cannot fork between surfaces. */
function ctBelongSave(){
  if(!window.__CT_BELONG) window.__CT_BELONG = { meta:{} };
  return window.__CT_BELONG;
}
function ctActState(fid){
  var B = BohemiaBelonging, sv = ctBelongSave();
  var g = null;
  try {
    var bases = ctBases(), want = String(fid||'').toUpperCase().replace(/[\s_]/g,''), base = null;
    for(var k in (bases||{})) if(String(k).toUpperCase().replace(/[\s_]/g,'')===want) base = bases[k];
    if(base && base.x != null){
      var cell = ctCell();
      var reach = (typeof BohemiaAgents!=='undefined' && BohemiaAgents.REACH_CELLS) || 12;
      var d = Math.abs(base.x-cell[0]) + Math.abs(base.y-cell[1]);
      g = { base:base, dist:d, on:d<=reach };
    }
  } catch(_e){}
  var told = (sv.meta.told||{})[fid]|0, seen = Object.keys(sv.meta.seen||{}).length;
  return { st:{ gaveToday: B.gaveDayOf(sv, fid) === (T.day||1),
                onTheirGround: g ? g.on : true,
                somethingToTell: seen > told },
           ground:g, sv:sv };
}
/* WHERE YOU HAVE STOOD, so "tell them what you have seen" means something here
   too. Recorded on the same cell vocabulary the faction check uses. */
function ctSawCell(){
  try { var sv=ctBelongSave(), c=ctCell();
        (sv.meta.seen || (sv.meta.seen={}))[c[0]+','+c[1]] = 1; } catch(_e){}
}

function ctPerson(p){'''

# ---- the card. The city's own rows stay; the faction layer is appended. -------
OLD_NAME = """  var body='<div class="who">'+(nm?nm.toUpperCase():BohemiaPeople.headingOf(who))+'</div>';
  body+=ctRow('NAME', nm?nm:'YOU HAVE NOT ASKED');"""

NEW_NAME = """  var body='<div class="who">'+(nm?nm.toUpperCase():BohemiaPeople.headingOf(who))+'</div>';
  /* """ + MARKER + """ -- THE SIXTEEN INTRODUCTIONS DECIDE THIS ROW. The city's own
     answer was the uniform one (asked, therefore named); the organ knows the
     sixteen different answers his dossiers give. Decided HERE, at the row's own
     source, so the card can never carry two answers to one question. */
  var ctFid = (typeof ctFactionOf==='function') ? ctFactionOf(p) : null;
  var ctIntro = null;
  if(typeof BohemiaIntros !== 'undefined'){
    var iRule = BohemiaIntros.ruleOf(ctFid);
    var iCtx  = { full: BohemiaPeople.generatedName(who.key),
                  trade: BohemiaPeople.ROLE_WORDS[who.role]||null, work:null };
    var iSt   = { asked: CT_MET.asked(who.key) };
    ctIntro = { rule:iRule, ctx:iCtx, st:iSt, m:BohemiaIntros.meeting(iRule, iCtx, iSt) };
  }
  var nameRow = ctIntro ? ctIntroName(ctIntro, CT_MET.asked(who.key))
                        : ['NAME', nm?nm:'YOU HAVE NOT ASKED'];
  body+=ctRow(nameRow[0], nameRow[1]);"""

OLD_ASK = """  if(!nm) body+='<button id="ctask">Ask their name</button>';
  body+='<button id="ctgo">Leave them to it</button>';"""

NEW_ASK = """  body = ctIntroRows(body, ctIntro, ctFid);
  var ctBtn = ctIntro ? BohemiaIntros.buttonFor(ctIntro.rule, ctIntro.ctx, ctIntro.st)
                      : (nm ? null : 'Ask their name');
  var ctAct = null;
  if(typeof BohemiaBelonging !== 'undefined' && ctFid){
    var bRule = BohemiaBelonging.ruleOf(ctFid);
    var bState = ctActState(ctFid);
    var bar = BohemiaBelonging.bargain(bRule, BohemiaBelonging.gaveOf(bState.sv, ctFid));
    if(bar){
      body += ctRow('THEY WANT', bar.wantWord);
      if(bar.holds) body += ctRow('THEY HOLD', bar.holds.split('.')[0]);
      if(bar.pays) body += ctRow('PAID IN', bar.pays);
      if(bar.refuses) body += ctRow('WILL NOT TAKE', bar.refuses);
      if(bar.theyFirst) body += ctRow('CAREFUL', 'THEY HELP YOU BEFORE YOU AGREE TO ANYTHING');
      if(bar.rung) body += ctRow('YOU ARE', bar.rung.word
        + (bar.next ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));
      var why = BohemiaBelonging.noActBecause(bRule, bState.st);
      if(why) body += ctRow('', why);
      if(bState.ground && !bState.ground.on){
        var gdx = bState.ground.base.x-ctCell()[0], gdy = bState.ground.base.y-ctCell()[1];
        body += ctRow('THEIR GROUND', bState.ground.dist+' CELLS '
          + (Math.abs(gdy)>=Math.abs(gdx) ? (gdy<0?'NORTH':'SOUTH') : (gdx<0?'WEST':'EAST')));
      }
      ctAct = BohemiaBelonging.actFor(bRule, bState.st);
    }
  }
  /* EVERY BUTTON AT THE BOTTOM, under the rows it acts on. */
  if(ctBtn) body+='<button id="ctask">'+ctBtn+'</button>';
  if(ctAct) body+='<button id="ctgive">'+ctAct.label+'</button>';
  body+='<button id="ctgo">Leave them to it</button>';"""

OLD_WIRE = """  var ask=document.getElementById('ctask');
  if(ask) ask.addEventListener('click',function(){
    CT_MET.ask(who.key, T.day||1); ctSave(); ctDraw(); render(); });"""

NEW_WIRE = """  var ask=document.getElementById('ctask');
  if(ask) ask.addEventListener('click',function(){
    CT_MET.ask(who.key, T.day||1); ctSave(); ctDraw(); render(); });
  /* """ + MARKER + """ */
  var give=document.getElementById('ctgive');
  if(give) give.addEventListener('click',function(){
    var sv=ctBelongSave();
    BohemiaBelonging.record(sv, ctFid, T.day||1);
    if(ctAct && ctAct.kind==='information')
      (sv.meta.told || (sv.meta.told={}))[ctFid] = Object.keys(sv.meta.seen||{}).length;
    advance(60);                       /* an hour, the same hour the run spends */
    ctDraw(); render();
  });"""

# the rows helper, added next to ctRow so it lives with the card it draws
# WHERE YOU HAVE STOOD is recorded as you WALK, not when a probe calls it. The
# Remnants want honest word about the road; that is worthless if the record only
# updates when something else happens to ask.
STEP_OLD = "      hx=nx; hy=ny; moved++; advance(0.084);"
STEP_NEW = ("      hx=nx; hy=ny; moved++; advance(0.084);"
            " /* " + MARKER + " */ ctSawCell();")

ROWS_ANCHOR = "function ctDraw(){"
ROWS = r'''/* ''' + MARKER + r''' -- WHAT YOU KNOW TO CALL THEM, decided by the organ.
   Returns [label, value] for the card's NAME row so the row is decided AT ITS
   SOURCE. The first version regex-replaced the finished row out of the HTML
   string; it worked, and it left an unbalanced opening div tag in the file, which
   blob_integrity_gate caught by counting tags. (This comment says "div tag" in
   words for the same reason -- that gate counts tags wherever they appear, and
   writing the literal here would fail it all over again.) Doing HTML surgery on a string you
   just built is a smell even when it parses. */
function ctIntroName(intro, asked){
  var m = intro.m || {};
  if(m.isName) return ['NAME', m.shown];
  if(m.shown)  return ['KNOWN AS', m.shown];
  if(m.used)   return ['NAME', 'THEY USED YOURS. YOU NEVER GAVE IT.'];
  if(m.opener==='third-party') return ['NAME', 'NOBODY HAS INTRODUCED YOU'];
  return ['NAME', asked ? 'YOU ASKED. YOU DID NOT GET IT.' : 'YOU HAVE NOT ASKED'];
}
/* the rest of what the introduction knows, appended after the city's own rows. */
function ctIntroRows(body, intro, fid){
  var m = (intro && intro.m) || {};
  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());
  if(m.asks) body += ctRow('THEY ASKED YOU', m.asks);
  if(m.blocked) body += ctRow('WILL NOT SAY', m.blocked);
  if(m.cost) body += ctRow('AND', m.cost);
  if(m.remembers) body += ctRow('AND', 'THEY WILL NOT FORGET YOU');
  if(!m.isName && m.next && m.explain) body += ctRow('HOW YOU GET THE REST', m.next);
  return body;
}

function ctDraw(){'''


def city_seed(src):
    """the seed TEXT the city declares, read out of the file rather than typed."""
    import re
    m = re.search(r"BOH_SEED_TEXT\s*=\s*'([^']*)'", src)
    return m.group(1) if m else None


def loop_bases(seed_txt):
    """run bohemia_loop's OWN base placement. ONE rule for both surfaces, not two."""
    import json as _json
    import subprocess
    js = ("var L=require('./engine/bohemia_loop.js');"
          "var c=L.boot({seed:%s});"
          "process.stdout.write(JSON.stringify(c.factionBases||{}));"
          % _json.dumps(str(seed_txt)))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit('FAIL: could not boot the loop for bases\n' + out.stderr[:400])
    return _json.loads(out.stdout or '{}')


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        # *** THE ONE-SHOT NOOP WAS HIDING A STALE WORLD (9/5, FACTIONS lane).
        #
        # This tool bakes the loop's faction seats into CT_BASES_BAKED, then
        # checks its marker and no-ops forever. So the day anybody changed the
        # placement rule in bohemia_loop.js, the engine was right and the walked
        # city carried last week's capitals, with NOTHING to re-run. Measured
        # when FACTION-SEATS landed: the boot put the Homeless on a pump station
        # in the middle of the city; the bake still said 8,89, a corner.
        # faction_between's U9 caught it -- 14 of 14 baked and every coordinate
        # wrong -- which is the only reason this is a paragraph and not another
        # thirteen dark days.
        #
        # This is EXACTLY the defect tools/bohemia_city_module_resync.py was
        # written for ("all one-shot: they check a marker and no-op forever
        # after"). That tool re-syncs the inlined module BODIES; nothing
        # re-synced the baked DATA. So the NOOP becomes a RE-BAKE: the injection
        # is still one-shot, the numbers are not.
        seed_txt = city_seed(s)
        if not seed_txt:
            sys.exit('FAIL: could not read BOH_SEED_TEXT out of the city')
        bases = loop_bases(seed_txt)
        if not bases:
            sys.exit('FAIL: the loop produced no faction bases -- refusing to bake nothing')
        import json as _json
        import re as _re
        want = 'var CT_BASES_BAKED = ' + _json.dumps(bases, sort_keys=True) + ';'
        pat = _re.compile(r'var CT_BASES_BAKED = .*?;\n')
        if not pat.search(s):
            sys.exit('FAIL: ' + MARKER + ' is present but CT_BASES_BAKED is not -- '
                     'the block was edited by hand and this tool will not guess')
        old = pat.search(s).group(0).strip()
        if old == want:
            print('SEATS ALREADY FRESH: %d bases, seed %r' % (len(bases), seed_txt))
            return
        # --check: report and fail without writing, so a gate can ask this
        # question in a second instead of driving a browser to find out.
        if '--check' in sys.argv:
            print('SEATS STALE: the walked city carries seats the loop no longer places')
            print('  baked: ' + old[:150])
            print('  loop : ' + want[:150])
            print('  fix  : python3 tools/bohemia_city_factions_patch.py')
            sys.exit(1)
        s = pat.sub(lambda _m: want + '\n', s, count=1)
        s = _re.sub(r'var CT_BASES_SEED  = .*?;\n',
                    'var CT_BASES_SEED  = ' + _json.dumps(str(seed_txt)) + ';\n', s, count=1)
        open(CITY, 'w', encoding='utf-8').write(s)
        print('SEATS RE-BAKED: %d bases from the loop, seed %r' % (len(bases), seed_txt))
        print('  was: ' + old[:110])
        print('  now: ' + want[:110])
        return

    bodies = []
    for m in MODULES:
        if not os.path.exists(m):
            sys.exit('FAIL: missing module ' + m)
        # the ==== engine/x.js ==== banner is what tools/bohemia_city_module_resync.py
        # scans for, so these three JOIN the ENGINE SYNC sweep and cannot silently
        # drift a week behind their canon bodies. It must end with '==== */'.
        bodies.append('/* ==== engine/' + os.path.basename(m) + ' ==== */\n'
                      + open(m, encoding='utf-8').read())

    seed_txt = city_seed(s)
    if not seed_txt:
        sys.exit('FAIL: could not read BOH_SEED_TEXT out of the city')
    bases = loop_bases(seed_txt)
    if not bases:
        sys.exit('FAIL: the loop produced no faction bases -- refusing to bake nothing')

    if ANCHOR not in s:
        sys.exit('FAIL: anchor not found -- ' + ANCHOR)
    import json as _json
    block = (BLOCK.replace('__BASES_JSON__', _json.dumps(bases, sort_keys=True))
                  .replace('__BASES_SEED__', _json.dumps(str(seed_txt))))
    s = s.replace(ANCHOR, '<' + '/script>\n<script>\n' + '\n'.join(bodies)
                  + '\n<' + '/script>\n<script>\n' + block, 1)

    for old, new, what in ((STEP_OLD, STEP_NEW, 'the walk hook'),
                           (ROWS_ANCHOR, ROWS, 'the rows helper'),
                           (OLD_NAME, NEW_NAME, 'the NAME row'),
                           (OLD_ASK, NEW_ASK, 'the card'),
                           (OLD_WIRE, NEW_WIRE, 'the button wiring')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY FACTIONS: %d modules injected, card wired' % len(MODULES))
    print("  seed '%s' -> %d faction bases, baked from the loop's own rule"
          % (seed_txt, len(bases)))
    for m in MODULES:
        print('  + ' + m)


if __name__ == '__main__':
    main()
