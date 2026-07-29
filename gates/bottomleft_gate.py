#!/usr/bin/env python3
"""
BOHEMIA BOTTOM-LEFT GATE (7/29/26) — the corner Paolo circled stays uncollided.

He sent a screenshot with BUFFET ON, PLACE and TILES ringed in yellow. They were on
top of the hint text, under the nav ring, and clipping off the left edge. The fix is
a flex column; this is the gate that stops it drifting back, because the top bar had
the identical bug on 7/25 and a comment did not prevent this one.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and "these buttons do not overlap" is
only checkable on the REAL SURFACE — you cannot read overlap out of a stylesheet
when four elements are absolutely positioned by four different systems. So this
opens the CITY tab in a real browser at iPhone portrait, puts it in the mode where
the chips appear, and measures actual rectangles.

WHAT IT HOLDS:
  1. every bottom-left chip is fully ON SCREEN (nothing clipped at any edge)
  2. no chip overlaps ANY other bottom-left chip
  3. no chip overlaps the nav ring — the thing you steer with always wins
  4. they are all still VISIBLE, so "fixed by hiding it" fails

Run from repo root:  python3 gates/bottomleft_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

JS = r"""
const path=require('path'),fs=require('fs');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  // the splash eats the first click on every surface in this build
  await p.waitForTimeout(1200);
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(600);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='city'); if(t)t.click();});
  // THE CITY PANEL IS A srcdoc IFRAME, so it has no URL to match on and it is
  // created lazily on the first tab click. Wait for the ELEMENT, then take its
  // content frame — matching frames by url() silently found nothing.
  await p.waitForSelector('#cityFrame',{timeout:30000});
  const f=await (await p.$('#cityFrame')).contentFrame();
  await f.waitForFunction(()=>typeof MODE!=='undefined',null,{timeout:30000,polling:200});
  await p.waitForTimeout(3000);
  // the chips only exist in HUMAN mode — that is what tpVis() gates on, and it
  // re-checks every 400ms, so give it more than one tick to show them
  await f.evaluate(()=>{const m=document.getElementById('mode');
    if(m&&typeof MODE!=='undefined'&&MODE!=='human')m.click();});
  await p.waitForTimeout(2500);
  const r=await f.evaluate(()=>{
    const ids=['tpScatBtn','tpModeBtn','tpJudgeBtn','note','bikebtn','fitbtn','nav'];
    const out={}, W=innerWidth, H=innerHeight;
    ids.forEach(id=>{const e=document.getElementById(id);
      if(!e)return; const s=getComputedStyle(e);
      if(s.display==='none'||s.visibility==='hidden')return;
      const b=e.getBoundingClientRect();
      if(b.width<1||b.height<1)return;
      out[id]={x:b.x,y:b.y,w:b.width,h:b.height};});
    return {boxes:out,W:W,H:H};
  });
  fs.writeFileSync(process.argv[3],JSON.stringify(r));
  await p.screenshot({path:path.join(process.argv[2],'records','target','BOTTOMLEFT.png')});
  await b.close();
})();
"""

P = F = 0


def ok(name, cond, detail=''):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('   FAIL  %s  %s' % (name, detail))


def main():
    global P, F
    with tempfile.TemporaryDirectory() as td:
        js, out = os.path.join(td, 'p.js'), os.path.join(td, 'r.json')
        open(js, 'w').write(JS)
        r = subprocess.run(['node', js, os.path.abspath(REPO), out],
                           capture_output=True, text=True, timeout=180)
        if not os.path.exists(out):
            print('   BOTTOM-LEFT GATE: the probe did not report')
            print('   ' + (r.stderr or r.stdout)[-400:])
            return 1
        data = json.load(open(out))

    boxes, W, H = data['boxes'], data['W'], data['H']
    CHIPS = [k for k in ('tpScatBtn', 'tpModeBtn', 'tpJudgeBtn') if k in boxes]
    ok('the tile chips are on screen at all', len(CHIPS) == 3,
       'found %s — if they are gone this gate is measuring nothing' % (CHIPS,))
    if len(CHIPS) < 3:
        print('   BOTTOM-LEFT GATE: %d passed, %d failed' % (P, F))
        return 1

    for k in CHIPS + [c for c in ('note', 'bikebtn', 'fitbtn') if c in boxes]:
        b = boxes[k]
        ok('on_screen:%s' % k,
           b['x'] >= -0.5 and b['y'] >= -0.5
           and b['x'] + b['w'] <= W + 0.5 and b['y'] + b['h'] <= H + 0.5,
           'x %.0f..%.0f of %d, y %.0f..%.0f of %d'
           % (b['x'], b['x'] + b['w'], W, b['y'], b['y'] + b['h'], H))

    def hits(a, b):
        return not (a['x'] + a['w'] <= b['x'] + 0.5 or b['x'] + b['w'] <= a['x'] + 0.5
                    or a['y'] + a['h'] <= b['y'] + 0.5 or b['y'] + b['h'] <= a['y'] + 0.5)

    corner = CHIPS + [c for c in ('note', 'bikebtn', 'fitbtn') if c in boxes]
    for i, a in enumerate(corner):
        for b_ in corner[i + 1:]:
            ok('no_overlap:%s/%s' % (a, b_), not hits(boxes[a], boxes[b_]),
               'they are on top of each other')
        if 'nav' in boxes:
            ok('clears_nav:%s' % a, not hits(boxes[a], boxes['nav']),
               'under the steering ring')

    print('   BOTTOM-LEFT GATE: %d passed, %d failed  (%d chips measured on a %dx%d '
          'phone)' % (P, F, len(corner), W, H))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
