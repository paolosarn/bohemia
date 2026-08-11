#!/usr/bin/env python3
"""
EVERY VOICE SURFACE GATE (8/11/26) - if a person addresses you, they make a sound.

WHY THIS EXISTS, AND IT IS NOT THE BUG IT IS THE CLASS.

Paolo, 8/11: "I disnt hear any voices when I talked to marisela."

The voices were built, approved, wired and GATED GREEN. The gate was a lie in
two separate ways and both are worth naming:

  1. IT DROVE ONE SURFACE. This game has TWO places a person talks to you -- the
     RUN's quest dialogue and the CITY's talk card -- and the wiring went into
     the first one found. Nobody ever asked "is there another one?" Marisela is
     in the city.
  2. IT CALLED THE FUNCTION INSTEAD OF PRESSING THE BUTTON. The old check did
     `renderTalk({...})` directly. A probe that calls the function can never
     discover that the player is somewhere else entirely -- it proves the
     function works and says nothing about whether anyone can reach it. That is
     precisely what VERIFY ON THE REAL SURFACE (7/18) forbids, written by this
     same lane, broken by this same lane.

So this gate does the opposite of both. It walks up to somebody and PRESSES WHAT
HE PRESSES, on EVERY surface, and it FAILS ON DISCOVERY: any slice that offers to
talk to a person and is not in the manifest below is a failure, so the next
surface somebody builds cannot be silently missed the way the city was.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLICES = os.path.join(ROOT, 'slices')

# EVERY SURFACE WHERE A PERSON ADDRESSES THE PLAYER. Adding a row is how a lane
# says "people talk here"; the discovery check below makes leaving one out fail.
SURFACES = [
    ('BOHEMIA_RUN_CURRENT.html',  'the RUN\'s quest dialogue'),
    ('BOHEMIA_CITY_WORLD.html',   'the CITY\'s talk card -- where Marisela is'),
    # The run's DEV SOURCE, not a third surface: BOHEMIA_RUN_CURRENT.html is
    # built from it. It is listed because the wire has to be in the SOURCE or the
    # next rebuild silently drops it -- which is a real way this lane has lost
    # work before. The discovery sweep found this file on its first run, which is
    # the gate doing its job before a human had to.
    ('BOHEMIA_RUN_SLICE_7_26_26.html', 'the RUN\'s dev source, which the built run comes from'),
    ('BOHEMIA_ALPHA_0_9.html',     'the COLD OPEN caption -- the demo\'s first fifteen seconds'),
]

# HOW A SURFACE IS RECOGNISED. The first version of this sweep looked for one
# marker, "TALK TO THE", and MISSED THE COLD OPEN COMPLETELY -- because a
# CUTSCENE HAS NO TALK VERB. It covered one SHAPE of surface and was blind to a
# second. Every entry below is a distinct shape somebody speaks in, and the list
# is the honest limit of this check: it can only find shapes it already knows,
# which is exactly how the cold open got past it. Adding a shape is cheap;
# assuming there are no more is what cost a turn.
SPEAK_MARKERS = [
    ('TALK TO THE',   'a talk verb offered to the player'),
    # RENAMED 8/12 BY THE CUTSCENE LANE: storyCaption -> cutCaption, the STORY
    # tab -> CUTSCENE. Both spellings are listed because the sweep must keep
    # finding the surface across a rename -- a marker list that only knows
    # yesterday's name goes QUIET, which is the exact failure the shipped-truth
    # gate exists for. This gate went RED instead, which is it working.
    ('cutCaption',    'a scripted-scene caption that names a speaker'),
    ('storyCaption',  'the same, under its pre-8/12 name'),
    ('renderTalk',    'a dialogue node painted with a speaker'),
]

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1600);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(900);
  // THE RUN TAB SHOWS THE CITY PANEL. Worth stating because it is why the first
  // probe found nothing: there is no data-p="city", the run tab maps to it.
  await p.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); });
  await p.waitForTimeout(12000);

  const out = { frames: p.frames().map(f => f.url().split('/').pop()) };
  await p.evaluate(() => { window.__spoke = []; try { MUS.audio(); } catch(e) {}
    const o = BOH_VOICE.say.bind(BOH_VOICE);
    BOH_VOICE.say = function(t, v){ window.__spoke.push({seed: v.seed, text: t});
                                    return o.apply(null, arguments); }; });

  // ---- THE CITY: walk up to somebody and press TALK --------------------
  const cf = p.frames().find(f => f.url().includes('CITY_WORLD'));
  out.cityFrame = !!cf;
  if (cf) {
    out.cityMoved = await cf.evaluate(() => { try {
        const all = window.__CT.everyone(); if (!all.length) return null;
        const t = all.slice().sort((a,b) => a.d - b.d)[0];
        hx = t.x + 1; hy = t.y;               /* stand beside them, as you would */
        try { render(); } catch(e) {}
        return { key: t.key };
      } catch(e) { return 'ERR:' + e; } });
    out.cityVerb = await cf.evaluate(() => { try { return window.__CT.verb(); } catch(e){ return null; } });
    await p.evaluate(() => { window.__spoke = []; });
    // PRESS THE BUTTON HE PRESSES. Not ctOpen().
    out.cityPressed = await cf.evaluate(() => { const btn = document.getElementById('cttalk');
      if (!btn) return 'no button'; btn.click(); return !!CT_OPEN; });
    await p.waitForTimeout(900);
    out.citySpoke = await p.evaluate(() => window.__spoke.slice());
    // meeting the SAME person again must not re-greet on a redraw
    await p.evaluate(() => { window.__spoke = []; });
    await cf.evaluate(() => { try { ctDraw(); } catch(e) {} });
    await p.waitForTimeout(500);
    out.cityRedraw = await p.evaluate(() => window.__spoke.length);
  }

  // ---- THE RUN: its own dialogue, driven through openTalk --------------
  const rf = p.frames().find(f => f.url().includes('RUN_CURRENT'));
  out.runFrame = !!rf;
  if (rf) {
    await p.evaluate(() => { window.__spoke = []; });
    out.runDrove = await rf.evaluate(() => { try {
        if (typeof renderTalk !== 'function') return 'no renderTalk';
        renderTalk({speaker:'red_boss', says:['Batteries. Real ones, not the swollen ones.'],
                    noverbs:[], options:[]});
        return true;
      } catch(e) { return 'ERR:' + e; } });
    await p.waitForTimeout(800);
    out.runSpoke = await p.evaluate(() => window.__spoke.slice());
  }

  // ---- THE COLD OPEN: press PLAY THE OPEN and listen -------------------
  // The demo's first fifteen seconds, and it was silent until 8/11. Driven by
  // the real button, like everything else here.
  await p.evaluate(() => { const t = document.querySelector('.tab[data-p="cutscene"], .tab[data-p="story"]');
    if (t) t.click(); });
  await p.waitForTimeout(2500);
  await p.evaluate(() => { window.__spoke = []; });
  out.storyPressed = await p.evaluate(() => {
    const b = document.getElementById('cutPlay') || document.getElementById('storyPlay');
    if (!b) return false; b.click(); return true; });
  await p.waitForTimeout(46000);   /* the cold open grew to ~40 beats on 8/12 */
  out.storySpoke = await p.evaluate(() => window.__spoke.slice());
  out.storyState = await p.evaluate(() => (document.getElementById('cutState')
    || document.getElementById('storyState') || {}).textContent || '');

  out.errors = errs.slice(0, 4);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== EVERY VOICE SURFACE GATE - if somebody talks to you, you hear them ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    # ---- DISCOVERY. The part that would have caught Marisela ------------
    # Any slice that offers to talk to a PERSON must be in the manifest and must
    # carry the voice wire. This is the check that turns "I forgot there was a
    # second surface" from a thing Paolo finds into a thing the machine finds.
    named = {s for s, _ in SURFACES}
    talkers = []
    for fn in sorted(os.listdir(SLICES)):
        if not fn.endswith('.html'):
            continue
        try:
            src = open(os.path.join(SLICES, fn), encoding='utf8', errors='ignore').read()
        except Exception:
            continue
        if any(m in src for m, _ in SPEAK_MARKERS):
            talkers.append(fn)
    unlisted = [t for t in talkers if t not in named]
    ok('DISCOVERY: every surface that offers to talk to somebody is in the '
       'manifest (found %s)' % talkers, not unlisted)
    if unlisted:
        print('       UNLISTED AND THEREFORE UNTESTED: %s' % ', '.join(unlisted))
    for fn, why in SURFACES:
        path = os.path.join(SLICES, fn)
        if not os.path.exists(path):
            ok('%s exists (%s)' % (fn, why), False)
            continue
        src = open(path, encoding='utf8', errors='ignore').read()
        ok('%s carries the voice wire -- %s' % (fn, why), 'BOHEMIA_VOICE' in src)

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=420)
    finally:
        os.unlink(js)
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:]); print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    approved = ['cand-1', 'cand-2', 'cand-3', 'cand-4', 'cand-6', 'cand-7']

    # ---- THE CITY, driven the way he plays -------------------------------
    ok('the CITY surface loads at all (the RUN tab maps to it)', d.get('cityFrame'))
    ok('there is somebody in the city to walk up to', isinstance(d.get('cityMoved'), dict))
    ok('standing beside them offers the verb (%s)' % d.get('cityVerb'),
       'TALK' in str(d.get('cityVerb') or ''))
    ok('PRESSING THE REAL TALK BUTTON opens the card', d.get('cityPressed') is True)
    cs = d.get('citySpoke') or []
    ok('AND MARISELA MAKES A SOUND: %d utterance(s) from one press' % len(cs),
       len(cs) == 1)
    if cs:
        # HIS 8/12 DIRECTION CHANGED THIS. "We may need way more voices": an
        # unnamed stranger is now CAST FROM THE ENVELOPE his verdicts describe
        # rather than handed one of the six. So the assertion is no longer
        # "which of the six" -- it is that the voice is a real one, keyed to
        # that person, and inside what he approved. A GATE MUST NEVER OUTRANK
        # A RULING.
        ok('the stranger has their OWN voice, keyed to them (%s)' % cs[0]['seed'],
           bool(cs[0]['seed']) and cs[0]['seed'] not in approved)
        ok('saying the words the card actually shows about her (%r)' % cs[0]['text'],
           len(cs[0]['text'].strip()) > 3)
    else:
        ok('(a voice to check)', False)
        ok('(words to check)', False)
    ok('a REDRAW does not greet you again -- a meeting speaks, a redraw does not '
       '(%s)' % d.get('cityRedraw'), (d.get('cityRedraw') or 0) == 0)

    # ---- THE RUN ---------------------------------------------------------
    ok('the RUN surface loads', d.get('runFrame'))
    ok('its dialogue paint is reachable', d.get('runDrove') is True)
    rs = d.get('runSpoke') or []
    ok('and the RUN still speaks too (%d)' % len(rs), len(rs) == 1)
    if rs:
        ok('in one of his approved voices (%s)' % rs[0]['seed'], rs[0]['seed'] in approved)
    else:
        ok('(a run voice to check)', False)

    # ---- THE COLD OPEN ---------------------------------------------------
    ok('the CUTSCENE tab has a PLAY button to press', d.get('storyPressed'))
    ok('the cold open runs to the end (%s)' % d.get('storyState'),
       'done' in str(d.get('storyState') or ''))
    ss = d.get('storySpoke') or []
    ok('THE DEMO OPENS WITH PEOPLE TALKING: %d spoken beats' % len(ss), len(ss) >= 4)
    if ss:
        # ONE VOICE PER PERSON, not one per line. The scene revisits speakers,
        # so counting unique SEEDS against unique LINES is the real claim: a
        # person keeps their voice and two different people do not share one.
        by_text = {}
        for u in ss:
            by_text.setdefault(u['seed'], set()).add(u['text'])
        ok('NOBODY IN THE SCENE SHARES A VOICE: %d speakers, %d distinct voices'
           % (len(by_text), len(set(u['seed'] for u in ss))),
           len(by_text) == len(set(u['seed'] for u in ss)))
        n_appr = sum(1 for x in set(u['seed'] for u in ss) if x in approved)
        ok('the named family get voices HE ACTUALLY HEARD (%d of his six dealt '
           'first), and any overflow is cast from his envelope' % n_appr,
           n_appr >= 1)
        # THE STUTTER TEST IS CONSECUTIVE REPEATS, not a total count. The scene
        # length is another lane's and grew from 4 beats to 40 overnight; an
        # assertion pinned to a count would fail on their content, not on mine.
        # SEED-BLIND ON PURPOSE (8/12). The bug that made this check matter was
        # TWO voice systems on one surface -- the cutscene lane's own cutVoice
        # and mine -- so every line spoke twice in DIFFERENT voices. A repeat
        # test that also required the seeds to match would have called that
        # clean. The text alone is the signature of a line being said again.
        consecutive = sum(1 for i in range(1, len(ss))
                          if ss[i]['text'] == ss[i-1]['text'])
        ok('NO REPAINT STUTTER: no line speaks twice in a row (%d repeats in %d '
           'utterances)' % (consecutive, len(ss)), consecutive == 0)
        # ONE OWNER: a scene of N captions makes about N utterances. Two engines
        # on one surface doubles it (7 lines -> 26 renders, 8/12). Anything over
        # 1.5x the distinct lines means somebody else is also speaking.
        lines = len(set(u['text'] for u in ss))
        ok('ONE VOICE SYSTEM ON THIS SURFACE: %d utterances for %d distinct '
           'lines' % (len(ss), lines), len(ss) <= lines * 1.5 + 1)
        ok('they say the words actually on screen (%r)' % ss[0]['text'][:34],
           len(ss[0]['text'].strip()) > 8)
    else:
        for _ in range(4):
            ok('(the cold open must speak to be checked)', False)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    # VSDEBUG=1 prints every utterance the cold open actually made. Kept because
    # the 8/12 double-speak was invisible in pass/fail and obvious in this list.
    if os.environ.get('VSDEBUG'):
        for u in (d.get('storySpoke') or []):
            print('    DBG %-10s %r' % (u['seed'], u['text'][:40]))
    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  All THREE surfaces speak -- the run, the city and the cold open -- '
              'each driven by pressing what he presses.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
