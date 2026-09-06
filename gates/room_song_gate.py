#!/usr/bin/env python3
"""
THE ROOM HAS ITS OWN SONG GATE (9/6/26, SOUNDS lane) - [music owned].

THE QUESTION NOBODY WAS ASKING: CAN THIS SONG BE HEARD ANYWHERE?

music_reach_gate (8/4) asks whether a song HE TAGGED can be heard, and it is
right to. It cannot see the 91 songs nobody ever tagged, because a gate built
around his tag table can only ever check the rows in the tag table. Measured by
asking the game's own functions on a real boot: 128 songs in the shelf, the
street can reach 16, combat 15, the opening 6, and NINETY-ONE could be heard
nowhere at all. EIGHTY-TWO OF THOSE HE THUMBED CANON.

So this gate asks the whole-shelf question instead, and it asks it of the game
rather than of the file: every song is either reachable by some player, or
buried. There is no third state, and "nobody got round to tagging it" is not an
excuse a build gets to keep.

IT DRIVES THE REAL SURFACE AND WALKS THROUGH A REAL DOOR. Three probes were
written before this one and TWO OF THEM BROKE THE THING THEY MEASURED:
  * the first forced CITYMUS.startShuffle() while the opening was still
    playing, which resets MUS.step under MENUMUS's watch (it is looking for
    step >= 128), so the handoff was missed and the opening never ended;
  * the second posted a FAKE inside:true from the parent window, which the
    city's own truthful four-second heartbeat correctly overwrote three seconds
    later. Lying to the game about where the player is standing is not a
    measurement of anything.
So this uses the city's own inEnter() to walk the body through a real door, and
the city's own swapMode() to come back out, and it waits for the SWITCH rather
than for a duration -- a fixed wait is not an event.

A MENTION IS NOT A USE: nothing below greps the alpha for a word. Every claim is
a value the running game returned.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { pageErrors: null };
  try {
    await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front', { force:true }).catch(()=>{});
    await p.waitForTimeout(2500);
    const sh = fn => p.evaluate(fn);

    out.exists = await sh(() => typeof window.INTERIORMUS !== 'undefined');
    out.players = await sh(() => ['CITYMUS','MENUMUS','FIGHTMUS','INTERIORMUS']
      .filter(n => typeof window[n] !== 'undefined'));

    /* ---- THE WHOLE-SHELF CENSUS, ASKED OF THE GAME ---------------------- */
    out.census = await sh(() => {
      const was = CITYMUS.phase, street = new Set();
      for (const ph of ['NIGHT','DAY','DUSK','DAWN']) { CITYMUS.phase = ph;
        CITYMUS.candidates().forEach(c => street.add(
          (c.fi<MFACTIONS.length?MFACTIONS[c.fi]:MLOOPS[c.fi-MFACTIONS.length]).n)); }
      CITYMUS.phase = was;
      const menu = new Set(MENUMUS.candidates().map(c => MLOOPS[c.fi-MFACTIONS.length].n));
      const room = new Set((typeof INTERIORMUS!=='undefined'
        ? INTERIORMUS.candidates() : []).map(c => MLOOPS[c.fi-MFACTIONS.length].n));
      const fac = new Set(MFACTIONS.map(f => f.n));
      const r = { songs: MLOOPS.length, street: 0, menu: 0, room: 0, combat: 0,
                  buried: 0, nowhere: [] };
      for (const m of MLOOPS) {
        const n = m.n, cs = MUS.catsOf(n+'#1') || [];
        if (MUS.V[n+'#1'] === 0) { r.buried++; continue; }
        if (street.has(n)) { r.street++; continue; }
        if (menu.has(n))   { r.menu++;   continue; }
        if (room.has(n))   { r.room++;   continue; }
        if (cs.some(c => fac.has(c))) { r.combat++; continue; }
        r.nowhere.push(n);
      }
      return r;
    });

    /* ---- THE POOL IS A RULE, NOT A LIST --------------------------------- */
    out.pool = await sh(() => {
      if (typeof INTERIORMUS === 'undefined') return null;
      const cs = INTERIORMUS.candidates();
      return { n: cs.length,
        tagged: cs.filter(c => (MUS.catsOf(MLOOPS[c.fi-MFACTIONS.length].n+'#1')||[]).length>0).length,
        buried: cs.filter(c => MUS.V[MLOOPS[c.fi-MFACTIONS.length].n+'#1']===0).length,
        creeper: cs.filter(c => CITYMUS.OVERWORLD.has(MLOOPS[c.fi-MFACTIONS.length].n)).length };
    });

    /* the opening hands over on its own -- never forced, see the header */
    out.openingOver = await sh(async () => { const t=Date.now();
      while (Date.now()-t < 45000) { await new Promise(r=>setTimeout(r,300));
        if (!MENUMUS.on && CITYMUS.on) return true; } return false; });

    const song = () => sh(() => { const c=MUS.cur;
      const f=(c<MFACTIONS.length)?MFACTIONS[c]:MLOOPS[c-MFACTIONS.length];
      return f ? f.n : null; });
    out.streetSong = await song();
    out.streetIsCreeper = await p.evaluate(n => CITYMUS.candidates()
      .map(c=>(c.fi<MFACTIONS.length?MFACTIONS[c.fi]:MLOOPS[c.fi-MFACTIONS.length]).n)
      .indexOf(n)>=0, out.streetSong);

    /* ---- THROUGH A REAL DOOR, with the city's own inEnter ---------------- */
    const cf = await (await p.$('#cityFrame')).contentFrame();
    out.door = await cf.evaluate(() => { try {
        for (let r=1;r<70;r++) for (let dx=-r;dx<=r;dx++) for (let dy=-r;dy<=r;dy++) {
          if (Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
          const nx=hx+dx, ny=hy+dy, c=cellAt(nx,ny);
          if (!(c&&c.enter)) continue;
          if (inEnter(nx,ny,hx,hy,!!c.walk)) return {ok:true,r:r,label:INSIDE&&INSIDE.label};
        }
        return {ok:false};
      } catch(e){ return {ok:false,err:String(e)}; } });
    out.cityInside = await cf.evaluate(() => !!INSIDE);

    /* WAIT FOR THE SWITCH, NOT FOR A DURATION. */
    out.switchedMs = await sh(async () => { const t=Date.now();
      while (Date.now()-t < 75000) { await new Promise(r=>setTimeout(r,250));
        if (typeof INTERIORMUS!=='undefined' && INTERIORMUS.on) return Date.now()-t; }
      return null; });
    out.insideSong = await song();
    out.insideUntagged = out.insideSong ? await p.evaluate(n =>
      (MUS.catsOf(n+'#1')||[]).length===0 && !CITYMUS.OVERWORLD.has(n), out.insideSong) : null;
    out.cityStoodDown = await sh(() => !CITYMUS.on);
    out.playingInside = await sh(() => MUS.playing);
    out.bedKind = await sh(() => (window.__AMB && window.__AMB.kind) || null);

    /* ---- AND BACK OUT, through the city's own exit ----------------------- */
    await cf.evaluate(() => { try { if (INSIDE) swapMode(); } catch(e){} });
    out.cityOutside = await cf.evaluate(() => !INSIDE);
    out.backMs = await sh(async () => { const t=Date.now();
      while (Date.now()-t < 75000) { await new Promise(r=>setTimeout(r,250));
        if (typeof INTERIORMUS==='undefined' || (!INTERIORMUS.on && CITYMUS.on)) return Date.now()-t; }
      return null; });
    out.backSong = await song();
    out.backIsCreeper = await p.evaluate(n => CITYMUS.candidates()
      .map(c=>(c.fi<MFACTIONS.length?MFACTIONS[c.fi]:MLOOPS[c.fi-MFACTIONS.length]).n)
      .indexOf(n)>=0, out.backSong);
    out.playingEnd = await sh(() => MUS.playing);
    out.noTimerLeak = await sh(() => typeof INTERIORMUS==='undefined' || !INTERIORMUS.watch);

    /* ---- A FIGHT BEATS A ROOM ------------------------------------------- */
    out.fightWins = await sh(async () => {
      if (typeof INTERIORMUS==='undefined') return null;
      try { FIGHTMUS.enter(); } catch(e) {}
      INTERIORMUS.on = false; INTERIORMUS.inside = false;
      INTERIORMUS.where(true);
      await new Promise(r=>setTimeout(r,3000));
      const held = !INTERIORMUS.on;
      try { FIGHTMUS.on = false; } catch(e) {}
      return held;
    });
  } catch (e) { out.fatal = String(e && e.message || e); }
  out.pageErrors = errs.slice(0,5);
  console.log('@@' + JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0
    findings = []

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True,
                           timeout=400)
    except subprocess.TimeoutExpired:
        print('  > FAIL the probe did not finish')
        print('\n=== ROOM SONG GATE: 0 passed, 1 failed ===')
        return 1
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.splitlines() if l.startswith('@@')]
    ok('the probe drove the real alpha and reported', bool(line))
    if not line:
        print(r.stdout[-2000:])
        print(r.stderr[-2000:])
        print('\n=== ROOM SONG GATE: %d passed, %d failed ===' % (p, f))
        return 1
    d = json.loads(line[0][2:])
    ok('and it did not die on the way (%s)' % (d.get('fatal') or 'no fatal'),
       not d.get('fatal'))
    ok('the page threw nothing (%s)' % (d.get('pageErrors') or 'none'),
       not d.get('pageErrors'))

    # ---- THE PLAYER EXISTS -------------------------------------------------
    ok('the game has a music player for the room he is standing in '
       '(players: %s)' % (d.get('players'),), d.get('exists'))

    # ---- THE WHOLE-SHELF CENSUS -------------------------------------------
    c = d.get('census') or {}
    nowhere = c.get('nowhere') or []
    ok('the shelf was counted on the real surface (%d songs)' % c.get('songs', 0),
       c.get('songs', 0) > 100)
    ok('the street can reach songs (%d)' % c.get('street', 0), c.get('street', 0) > 0)
    ok('the opening can reach songs (%d)' % c.get('menu', 0), c.get('menu', 0) > 0)
    ok('combat can reach songs (%d)' % c.get('combat', 0), c.get('combat', 0) > 0)
    ok('THE ROOM can reach songs (%d) -- this is the number that was zero, and '
       'it is the whole row' % c.get('room', 0), c.get('room', 0) > 0)
    ok('a song he BURIED is still buried and nothing gave it a home (%d)'
       % c.get('buried', 0), c.get('buried', 0) > 0)
    ok('EVERY SONG HE HAS NOT BURIED CAN BE HEARD SOMEWHERE: %d unreachable '
       '(%s)' % (len(nowhere), ', '.join(nowhere[:6]) or 'none'), not nowhere)
    ok('and the four players account for the whole shelf with nothing left over '
       '(%d + %d + %d + %d + %d buried = %d)'
       % (c.get('street', 0), c.get('menu', 0), c.get('room', 0),
          c.get('combat', 0), c.get('buried', 0), c.get('songs', 0)),
       (c.get('street', 0) + c.get('menu', 0) + c.get('room', 0)
        + c.get('combat', 0) + c.get('buried', 0)) == c.get('songs', 0))

    # ---- THE POOL IS A RULE, NOT A LIST -----------------------------------
    pool = d.get('pool') or {}
    ok('the room pool is not empty (%s songs)' % pool.get('n'),
       (pool.get('n') or 0) > 0)
    ok('and NOTHING HE PLACED IS IN IT -- a tagged song belongs where he put it '
       '(%s tagged found)' % pool.get('tagged'), pool.get('tagged') == 0)
    ok('GRAVEYARD IS FINAL: nothing he buried is in it (%s found)'
       % pool.get('buried'), pool.get('buried') == 0)
    ok('and no creeper is in it -- the overworld keeps its six (%s found)'
       % pool.get('creeper'), pool.get('creeper') == 0)

    # ---- THE REAL DOOR -----------------------------------------------------
    ok('the opening handed the music over on its own, unforced',
       d.get('openingOver'))
    ok('the street was playing a creeper before he went in (%s)'
       % d.get('streetSong'), d.get('streetIsCreeper'))
    door = d.get('door') or {}
    ok('the body walked through a REAL DOOR with the city\'s own inEnter (%s)'
       % (door.get('label') or door), door.get('ok'))
    if not door.get('ok'):
        findings.append('no enterable door was reachable from the spawn this run')
    ok('and the walked city says he is indoors', d.get('cityInside'))
    ok('the ambience bed agrees he is indoors (%s) -- the control, because this '
       'half has worked since 8/14 and proves the report arrived'
       % d.get('bedKind'), d.get('bedKind') == 'air_inside')

    # ---- THE SWITCH --------------------------------------------------------
    sw = d.get('switchedMs')
    ok('THE MUSIC CHANGED WHEN HE WENT INSIDE (after %s ms)' % sw, sw is not None)
    ok('and it landed on a phrase, not instantly: 16s at 120 BPM is one phrase '
       'and it took %s ms' % sw, sw is not None and sw >= 15000)
    ok('the song he heard indoors is one nobody had placed (%s)'
       % d.get('insideSong'), d.get('insideUntagged'))
    ok('the street shuffle stood down and did not fight for the transport',
       d.get('cityStoodDown'))
    ok('and the music never stopped: standing down is not silence',
       d.get('playingInside'))

    # ---- AND BACK OUT ------------------------------------------------------
    ok('he walked back out through the city\'s own exit', d.get('cityOutside'))
    bk = d.get('backMs')
    ok('THE STREETS TOOK THE MUSIC BACK (after %s ms)' % bk, bk is not None)
    ok('and that landed on a phrase too (%s ms)' % bk,
       bk is not None and bk >= 15000)
    ok('and what plays outdoors is a creeper again (%s)' % d.get('backSong'),
       d.get('backIsCreeper'))
    ok('the music is still playing at the end', d.get('playingEnd'))
    ok('and the room left no timer running once the music matches where he '
       'stands -- one pump, not two', d.get('noTimerLeak'))

    # ---- PRECEDENCE --------------------------------------------------------
    ok('A FIGHT BEATS A ROOM: walking indoors mid-fight does not take the music '
       'off the fight', d.get('fightWins'))

    if findings:
        print('  NOTE: ' + '; '.join(findings))
    print('  CENSUS  %d songs: street %d, opening %d, ROOM %d, combat %d, '
          'buried %d, NOWHERE %d'
          % (c.get('songs', 0), c.get('street', 0), c.get('menu', 0),
             c.get('room', 0), c.get('combat', 0), c.get('buried', 0),
             len(nowhere)))
    print('\n=== ROOM SONG GATE: %d passed, %d failed ===' % (p, f))
    return 0 if f == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
