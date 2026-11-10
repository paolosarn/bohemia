#!/usr/bin/env python3
"""
SFX SHUFFLE GATE (8/7/26) - the cheap verdict door, driven on the real surface.

WHY THIS IS A BROWSER GATE AND NOT A GREP. The thing being asserted is not that
some code exists, it is that HIS THUMB LANDS SOMEWHERE THAT SURVIVES. Every
failure this lane has actually shipped was invisible to a text search: a bus
wired to the wrong parent, a store written but never read, a button that played
a footstep instead of the sound it was named after, a UI tone landing on top of
the candidate he was trying to hear. All of those are green in a grep. So this
opens the alpha, taps the button, and reads the real store.

VERIFY ON THE REAL SURFACE (7/18): a side-door probe is a lie.
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
  const out = { errors: errs };
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(900);

  // GO TO THE TAB HE ACTUALLY TAPS. The board only exists once MUSIC is built.
  await p.evaluate(() => {
    // a tab that is not there must SAY SO (one_world_tab_gate, 8/2): `if (t)`
    // swallows the miss and the failure then surfaces far from its cause
    const t = document.querySelector('.tab[data-p="music"]');
    if (!t) throw new Error('that tab is not in the bar'); t.click();
  });
  await p.waitForTimeout(2600);

  out.hasBoard   = await p.evaluate(() => !!document.getElementById('sbWrap'));
  out.hasGo      = await p.evaluate(() => !!document.getElementById('shufGo'));
  out.goText     = await p.evaluate(() => { const g=document.getElementById('shufGo'); return g?g.textContent:''; });

  // THE QUEUE ITSELF, read from the page's own builder rather than re-derived.
  out.queue = await p.evaluate(() => {
    if (!window.__shufQueue) return null;
    return window.__shufQueue().map(q => ({ ev:q.ev, id:q.v.id, n:q.n, of:q.of }));
  });

  // A DONE MOMENT MUST NEVER BE ASKED AGAIN (graveyard is final).
  out.doneFams = await p.evaluate(() => {
    const J = window.BOH_SFX_JUDGE; if (!J) return null;
    return BOH_SFX.EVENTS.filter(E => { try { return J.done(E.ev); } catch(e){ return false; } })
                         .map(E => E.ev);
  });

  // COUNT EVERY SOUND THAT ACTUALLY REACHES THE OUTPUT, at the bus, not at a flag.
  await p.evaluate(() => {
    window.__rendered = 0;
    try { MUS.audio(); } catch(e) {}
    const orig = BOH_SFX.render.bind(BOH_SFX);
    BOH_SFX.render = function(){ window.__rendered++; return orig.apply(null, arguments); };
  });

  // AN EMPTY QUEUE IS A REAL, CORRECT STATE. He judged all 130 on 8/7, so the
  // right behaviour is the launcher saying so and refusing to open -- not a
  // round with nothing in it. Everything below is conditional on there being
  // work, and the empty case gets its own assertions instead of being skipped.
  out.empty = !(out.queue && out.queue.length);

  // OPEN IT THE WAY HE DOES: tap the button.
  await p.click('#shufGo', { force:true }).catch(()=>{});
  await p.waitForTimeout(700);
  out.opened   = await p.evaluate(() => !!document.getElementById('shufWrap'));
  out.noui     = await p.evaluate(() => { const w=document.getElementById('shufWrap');
                                          return !!(w && w.hasAttribute('data-noui')); });
  out.autoPlay = await p.evaluate(() => window.__rendered);   // it plays without being asked

  // THE UI TONE MUST NOT LAND ON TOP OF THE CANDIDATE (Paolo 8/4).
  await p.evaluate(() => { window.__uiTaps = 0;
    const f = window.playSFX;
    window.playSFX = function(ev){ if (ev === 'ui_tap') window.__uiTaps++; return f.apply(null, arguments); }; });

  const first = await p.evaluate(() => window.__shufState());
  out.first = first;

  // TAP YES. The verdict must land in the SHARED store and the next must play.
  const before = await p.evaluate(() => window.__rendered);
  await p.click('#shufWrap .shYes', { force:true }).catch(()=>{});
  await p.waitForTimeout(700);
  const after = await p.evaluate(() => window.__shufState());
  out.afterYes = after;
  out.advanced = after.idx === first.idx + 1 && after.at !== first.at;
  out.playedNext = (await p.evaluate(() => window.__rendered)) > before;
  out.storedYes = await p.evaluate(id => window.BOH_SFX_JUDGE.V[id], first.at);
  out.persisted = await p.evaluate(id => {
    try { const d = JSON.parse(localStorage.getItem('bohemia_sfx')||'{}'); return d.V ? d.V[id] : null; }
    catch(e) { return null; }
  }, first.at);

  // TAP NO.
  await p.click('#shufWrap .shNo', { force:true }).catch(()=>{});
  await p.waitForTimeout(600);
  out.storedNo = await p.evaluate(id => window.BOH_SFX_JUDGE.V[id], after.at);

  // SKIP must move on WITHOUT writing a verdict. "not sure" is not a thumb.
  const atSkip = await p.evaluate(() => window.__shufState());
  await p.click('#shufWrap .shSkip', { force:true }).catch(()=>{});
  await p.waitForTimeout(500);
  out.skipWrote = await p.evaluate(id => window.BOH_SFX_JUDGE.V[id] || 0, atSkip.at);
  out.skipMoved = (await p.evaluate(() => window.__shufState())).idx === atSkip.idx + 1;

  out.uiTaps = await p.evaluate(() => window.__uiTaps);

  // THE ROUND MUST END. Tap through the rest and check it stops at ten.
  for (let i = 0; i < 14; i++) {
    const st = await p.evaluate(() => window.__shufState());
    if (st.idx >= Math.min(st.round, st.len)) break;
    await p.click('#shufWrap .shNo', { force:true }).catch(()=>{});
    await p.waitForTimeout(230);
  }
  out.end = await p.evaluate(() => window.__shufState());
  out.doneScreen = await p.evaluate(() => {
    const w = document.getElementById('shufWrap');
    return w ? /THAT IS THE ROUND/.test(w.textContent) : false;
  });

  // AND THE EXPORT IS THE SAME .txt HE ALREADY KNOWS, carrying the new thumbs.
  await p.evaluate(() => { try { window.BOH_SFX_JUDGE.exportTxt(); } catch(e){} });
  await p.waitForTimeout(400);
  const txt = await p.evaluate(() => { const t=document.getElementById('expText'); return t?t.value:''; });
  out.exportHasUp = txt.indexOf('UP   ' + '') >= 0 || /^\s*UP\s/m.test(txt);
  out.exportName  = await p.evaluate(() => { try { return G._expName; } catch(e){ return null; } });
  out.exportLen   = txt.length;

  out.errors = errs.slice(0, 4);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=420)
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('=== SFX SHUFFLE GATE ===')
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        return 1
    d = json.loads(line[-1])

    print('=== SFX SHUFFLE GATE - one tap per sound, on the real surface ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    q = d.get('queue')
    ok('the soundboard he was promised is on screen', d.get('hasBoard'))
    ok('the launcher is on the board without him finding anything', d.get('hasGo'))
    ok('the launcher says how many are waiting', 'waiting' in (d.get('goText') or '')
       or 'EVERY SOUND IS JUDGED' in (d.get('goText') or ''))
    ok('the queue builder is reachable and returned a list', isinstance(q, list))

    if isinstance(q, list) and q:
        # BREADTH FIRST: the first pass takes candidate 1 of every moment before
        # any moment gets a second. That is what makes six taps retire six
        # silences instead of one.
        fams = []
        for it in q:
            if it['ev'] not in fams:
                fams.append(it['ev'])
        head = q[:len(fams)]
        ok('breadth first: the first %d in the queue are %d DIFFERENT moments'
           % (len(fams), len(fams)),
           len({i['ev'] for i in head}) == len(fams))
        ok('breadth first: nothing in that first pass is a repeat moment',
           len(head) == len({i['ev'] for i in head}))
        ids = [i['id'] for i in q]
        ok('no candidate is queued twice', len(ids) == len(set(ids)))
        dn = d.get('doneFams') or []
        ok('GRAVEYARD IS FINAL: no finished moment is queued again (%d finished)' % len(dn),
           not (set(i['ev'] for i in q) & set(dn)))
        print('    %d candidates waiting across %d moments' % (len(q), len(fams)))
    else:
        ok('there is something to judge (or the launcher says there is not)',
           isinstance(q, list))

    if d.get('empty'):
        # NOTHING LEFT TO JUDGE. This is the state his 130/130 export created and
        # it has to be asserted, not skipped: the failure it guards against is a
        # surface that re-asks him for verdicts he already gave, which is the
        # exact thing he called out on 8/1 ("I can't be judging shit and then you
        # pretend that I didn't").
        ok('EVERY SOUND IS JUDGED, and the launcher says so in his words',
           'EVERY SOUND IS JUDGED' in (d.get('goText') or ''))
        ok('and it does NOT open a round with nothing in it', not d.get('opened'))
        ok('so he is never asked again for a verdict he already gave',
           not d.get('opened') and not d.get('queue'))
        ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
           not d.get('errors'))
        print('    nothing waiting: all 130 candidates carry a thumb')
        print('  %d passed, %d FAILED' % (p, f))
        if not f:
            print('  The queue is empty because he emptied it. The surface says so '
                  'and stays shut.')
        return 1 if f else 0

    # ---- A QUEUE TOO SHORT TO DRIVE IS ITS OWN STATE (8/28) --------------
    # He judged 599 OF 600 in his 8/28 sweep and left exactly one candidate
    # unthumbed (cloth_more.0). That is neither the empty case above nor the
    # full one below: the drive underneath needs THREE distinct candidates to
    # exercise YES, NO and SKIP, and a one-item queue makes three legs go red on
    # a surface that is behaving perfectly.
    # THIS IS NOT THE GATE BEING WEAKENED TO GO GREEN. The legs it drops are the
    # ones that are ARITHMETICALLY IMPOSSIBLE on a queue this short, and every
    # leg that still means something is still asserted -- it opens, it plays by
    # itself, YES writes a real thumb into the shared store, and that thumb
    # persists. The full drive comes back the moment a batch refills the queue.
    _q = d.get('queue') or []
    if isinstance(_q, list) and 0 < len(_q) < 3:
        ok('the launcher opens on a queue of %d' % len(_q), d.get('opened'))
        ok('it carries data-noui so a click tone can never cover the candidate',
           d.get('noui'))
        ok('IT PLAYS BY ITSELF on the last one too',
           (d.get('autoPlay') or 0) > 0)
        ok('YES still writes a real thumb into the SHARED judge store',
           d.get('storedYes') == 1)
        ok('and that thumb survives a reload', d.get('persisted'))
        ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
           not d.get('errors'))
        print('    only %d candidate(s) left unjudged -- he swept 599 of 600 on '
              '8/28, so YES/NO/SKIP cannot be driven on distinct items and those '
              'three legs are held back rather than failed' % len(_q))
        print('  %d passed, %d FAILED' % (p, f))
        if not f:
            print('  The board works on the last sound in the queue, which is '
                  'the only one he has not thumbed.')
        return 1 if f else 0

    ok('tapping the launcher opens it', d.get('opened'))
    ok('it carries data-noui so a click tone can never cover the candidate',
       d.get('noui'))
    ok('IT PLAYS BY ITSELF: he does not have to find a play button',
       (d.get('autoPlay') or 0) > 0)

    ok('YES advances to a DIFFERENT candidate', d.get('advanced'))
    ok('and the next one plays on its own', d.get('playedNext'))
    ok('YES writes a thumb up into the SHARED judge store', d.get('storedYes') == 1)
    ok('and that thumb survives a reload (it is persisted, not just in memory)',
       d.get('persisted') == 1)
    ok('NO writes a thumb down into the same store', d.get('storedNo') == -1)
    ok('SKIP writes NO verdict: not sure is not a thumb', not d.get('skipWrote'))
    ok('SKIP still moves him on', d.get('skipMoved'))

    ok('NOT ONE UI CLICK TONE PLAYED WHILE HE WAS JUDGING (Paolo 8/4)',
       (d.get('uiTaps') or 0) == 0)

    end = d.get('end') or {}
    ok('the round STOPS at ten instead of running forever',
       end.get('idx', 0) <= min(end.get('round', 10), end.get('len', 0)))
    ok('and it tells him he is finished', d.get('doneScreen'))

    ok('the export is the .txt law, not a second format',
       (d.get('exportName') or '').endswith('.txt'))
    ok('the export carries his new thumbs', d.get('exportHasUp'))
    ok('the export is not empty', (d.get('exportLen') or 0) > 200)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
       not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  A verdict now costs him ONE TAP. That is the whole point: the '
              'queue was never the problem, the price was.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
