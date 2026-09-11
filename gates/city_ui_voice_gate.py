#!/usr/bin/env python3
"""
CITY UI VOICE GATE (9/11/26, SOUNDS lane).

DOES THE CITY INTERFACE ANSWER, AND DOES IT ANSWER IN THREE VOICES?

ON 9/11 THE WHOLE CITY INTERFACE WENT SILENT AND NOTHING ASKED. `#phonebtn`
moved from `#topbar` into `#menubar > #barright` -- another lane's ordinary UI
change -- and the city's tap policy names its containers by id, so every selector
missed and `ui_tap`, `ui_back` and `ui_deny` all stopped across the walked city.
The sound census caught it only as a count (12 of 65 instead of 13), which is a
weak signal: "ui_tap was heard somewhere" is also true of a build where every
control in the game answers with the same tick, or where WALKING ticks on every
step.

SO THIS COUNTS PER CONTROL, WHICH IS THE ONLY WAY THE CLAIM MEANS ANYTHING:

    a control      -> ui_tap, once
    a way out      -> ui_back, once, never a tap
    the world      -> NOTHING. Walking already makes a footstep and a tick on
                      every step is the 8/4 two-sounds complaint at its worst.
    sleep          -> sleep_sink and NO tick, because it already has its moment

IT LIVES IN ITS OWN GATE ON PURPOSE. These claims were written into the sound
census first, and they BROKE IT: the census is a carefully sequenced drive and
dismissing the morning card plus tapping the world moved the clock, so the hour
chime went red. A CHECK THAT DISTURBS A SEQUENCED DRIVE REPORTS A BUG THAT IS NOT
THERE -- which is the third time that shape has bitten this lane in one round.

AND THE MORNING CARD IS DISMISSED BEFORE THE WORLD IS TAPPED. It covers the whole
screen, so a probe that taps through it measures the CARD. That mistake reported
"walking ticks twelve times" once, on a build where walking was silent.

A MENTION IS NOT A USE: nothing below greps a file. Every claim counts messages
the running city actually posted.
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
  const out = {};
  try {
    await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front', { force:true }).catch(()=>{});
    await p.waitForTimeout(3500);
    const cf = await (await p.$('#cityFrame')).contentFrame();

    /* COUNT WHAT THE CITY POSTS, per name, per action. */
    await p.evaluate(() => { window.__T = {};
      window.addEventListener('message', ev => { const d = ev.data;
        if (d && d.bohemiaCitySfx && d.bohemiaCitySfx.ev && window.__T)
          window.__T[d.bohemiaCitySfx.ev] = (window.__T[d.bohemiaCitySfx.ev]||0)+1; }); });
    const tally = async fn => { await p.evaluate(()=>{ window.__T = {}; });
      await fn(); await p.waitForTimeout(700);
      return await p.evaluate(()=>JSON.parse(JSON.stringify(window.__T))); };

    out.controls = await cf.evaluate(() => ({
      phone: !!document.getElementById('phonebtn'),
      close: !!document.getElementById('phoneclose'),
      sleep: !!document.getElementById('sleepbtn'),
      closeCodes: (() => { const e=document.getElementById('phoneclose');
        return e ? [...(e.textContent||'')].map(c=>'U+'+c.codePointAt(0).toString(16).toUpperCase()) : null; })(),
      phoneChain: (() => { const e=document.getElementById('phonebtn'); if(!e) return null;
        let a=[], n=e.parentElement, i=0;
        while(n&&i<4){ a.push(n.tagName+(n.id?'#'+n.id:'')); n=n.parentElement; i++; }
        return a; })()
    }));

    /* THE MORNING CARD COVERS THE SCREEN. Dismiss it, then confirm what is
       actually under the middle of the frame before tapping it. */
    await cf.evaluate(()=>{ try{ const g=document.querySelector('.dcgo'); if(g)g.click(); }catch(e){} });
    await p.waitForTimeout(1400);
    out.hitAt = await cf.evaluate(()=>{ const e=document.elementFromPoint(
        window.innerWidth*0.5, window.innerHeight*0.5);
      return e ? e.tagName + (e.id?'#'+e.id:'') : null; });

    const box = await (await p.$('#cityFrame')).boundingBox();
    out.world = await tally(async () => { for (let i=0;i<8;i++)
      await p.mouse.click(box.x+box.width*0.5, box.y+box.height*0.5); });
    out.tapControl = await tally(async () => { await cf.evaluate(()=>{ try{
      const e=document.getElementById('phonebtn'); if(e)e.click(); }catch(_e){} }); });
    out.wayOut = await tally(async () => { await cf.evaluate(()=>{ try{
      const e=document.getElementById('phoneclose'); if(e)e.click(); }catch(_e){} }); });
    out.sleep = await tally(async () => { await cf.evaluate(()=>{ try{
      const e=document.getElementById('sleepbtn'); if(e)e.click(); }catch(_e){} }); });
  } catch (e) { out.fatal = String(e && e.message || e); }
  out.pageErrors = errs.slice(0,5);
  console.log('@@' + JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0

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
                           timeout=300)
    except subprocess.TimeoutExpired:
        print('  > FAIL the probe did not finish')
        print('\n=== CITY UI VOICE GATE: 0 passed, 1 failed ===')
        return 1
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.splitlines() if l.startswith('@@')]
    ok('the probe drove the real alpha and reported', bool(line))
    if not line:
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        print('\n=== CITY UI VOICE GATE: %d passed, %d failed ===' % (p, f))
        return 1
    d = json.loads(line[0][2:])
    ok('and it did not die on the way (%s)' % (d.get('fatal') or 'no fatal'),
       not d.get('fatal'))
    ok('the page threw nothing (%s)' % (d.get('pageErrors') or 'none'),
       not d.get('pageErrors'))

    c = d.get('controls') or {}
    ok('the three controls this measures are all still in the city (%s)' % c,
       c.get('phone') and c.get('close') and c.get('sleep'))

    def only_ui(t):
        return [k for k in (t or {}) if k.startswith('ui_')]

    ok('the probe got past the morning card before tapping the world -- it hit '
       '%s. TAPPING THROUGH A CARD MEASURES THE CARD, and that mistake once '
       'reported "walking ticks twelve times" on a build where walking was '
       'silent' % d.get('hitAt'), (d.get('hitAt') or '').startswith('CANVAS'))

    ok('WALKING DOES NOT TICK: eight taps on the world produced no ui sound '
       '(%s). Walking already makes a footstep, and a tick on every step is the '
       '8/4 two-sounds complaint at its worst' % (d.get('world') or {}),
       not only_ui(d.get('world')))

    tc = d.get('tapControl') or {}
    ok('TAPPING A CONTROL IS A TAP (%s). This is the claim that went silent on '
       '9/11 when #phonebtn moved to a different bar: the classifier named its '
       'containers by id, so every selector missed. Its chain today is %s'
       % (tc, c.get('phoneChain')), tc.get('ui_tap'))
    ok('and it ticks ONCE, not twice (%s)' % tc, tc.get('ui_tap') == 1)

    wo = d.get('wayOut') or {}
    ok('A WAY OUT IS A WAY OUT, NOT A TAP (%s). The close control renders %s and '
       'the policy only listed U+00D7, so every close in the game answered with '
       'a tick until 9/11. A GLYPH THAT LOOKS LIKE THE ONE YOU TYPED IS NOT THE '
       'ONE YOU TYPED' % (wo, c.get('closeCodes')), wo.get('ui_back'))
    ok('and a way out does NOT also tap (%s)' % wo, not wo.get('ui_tap'))

    sl = d.get('sleep') or {}
    ok('SLEEP CARRIES ITS OWN SOUND AND DOES NOT ALSO TICK (%s) -- two sounds on '
       'one tap is the 8/4 complaint this policy exists to prevent' % sl,
       not only_ui(sl))
    ok('and sleeping really does sound (%s)' % sl, sl.get('sleep_sink'))

    print('  MEASURED  world %s, control %s, way out %s, sleep %s'
          % (d.get('world'), tc, wo, sl))
    print('\n=== CITY UI VOICE GATE: %d passed, %d failed ===' % (p, f))
    return 0 if f == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
