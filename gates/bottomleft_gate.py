#!/usr/bin/env python3
"""
BOHEMIA BOTTOM-LEFT GATE (7/29/26) — the corner Paolo circled stays uncollided.

He sent a screenshot with BUFFET ON, PLACE and TILES ringed in yellow. They were on
top of the hint text, under the nav ring, and clipping off the left edge. The fix was
a flex column, and this gate held it.

THEN HE KILLED THEM OUTRIGHT — 7/29, an hour later: "I dont want those button
anymore." So this gate now asserts the OPPOSITE of what it asserted this morning, and
that reversal is the honest thing rather than an embarrassment: a gate still enforcing
a ruling he has since overturned is worse than no gate at all. The first version
demanded those three chips exist and not overlap. It now demands they are GONE.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and neither "these are gone" nor "these
do not overlap" is readable out of a stylesheet when four elements are absolutely
positioned by four different systems. So this opens the CITY tab in a real browser at
iPhone portrait, puts it in the mode where the chips USED to appear, and measures
actual rectangles.

WHAT IT HOLDS:
  1. BUFFET ON / PLACE / TILES do not exist — killed, not hidden, so there is no
     invisible tap target sitting in that corner
  2. the buffet cannot happen anyway: placement and scatter are both off, and nothing
     is left that could turn them on
  3. the chrome still down there is fully ON SCREEN (nothing clipped at any edge)
  4. none of it overlaps any other bottom-left chrome
  5. none of it overlaps the nav ring — the thing you steer with always wins
  6. it is all still VISIBLE, so "fixed by hiding everything" fails

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
  // ONE WORLD TAB (Paolo 8/2): the CITY tab is gone, RUN opens the world frame.
  // This clicked 'city', found nothing, and `if(t)` swallowed it — so the gate
  // then waited 30s for a frame no click had ever asked for and died on timeout.
  // A gate that navigates by a button the user does not have is testing nothing.
  await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')]
    .find(x=>x.getAttribute('data-p')==='run');
    if(!t) throw new Error('no RUN tab in the bar'); t.click();});
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
    // KILLED means the node is not in the document at all — a hidden node still
    // answers getElementById, and "hidden" is exactly what he did not ask for.
    const alive=['tpScatBtn','tpModeBtn','tpJudgeBtn']
      .filter(id=>document.getElementById(id));
    return {boxes:out,W:W,H:H,alive:alive,
            tpOn:(typeof TP!=='undefined')?!!TP.on:null,
            tpScatter:(typeof TP!=='undefined')?!!TP.scatter:null};
  });
  fs.writeFileSync(process.argv[3],JSON.stringify(r));
  /* THE PROOF SHOT GOES TO A TEMP DIR, NEVER INTO THE REPO (8/9).
     This wrote a 500 KB binary into records/target/ -- TRACKED and PAGES-PUBLISHED --
     on every single suite run, so every lane's `git add -A` swept up a picture nobody
     authored and nothing reads. The verdict comes from the JSON on argv[3]; this file
     is never read back and no slice references it. Diagnosed and fixed the same way in
     tools/bohemia_sun_mode_look.js; this is that fix reaching the gate that caused it. */
  await p.screenshot({path:path.join(require('os').tmpdir(),'BOHEMIA_BOTTOMLEFT.png')});
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

    # 1) THE KILL. Paolo 7/29: "I dont want those button anymore."
    ok('buffet_buttons_killed_not_hidden', not data['alive'],
       'still in the document: %s' % (data['alive'],))
    ok('placement_off', data['tpOn'] is False, 'TP.on is %r' % (data['tpOn'],))
    ok('scatter_off', data['tpScatter'] is False, 'TP.scatter is %r' % (data['tpScatter'],))

    # 2) and the corner they came out of is still sane. This is measured on whatever
    # chrome is actually down there, so it keeps working as chips come and go.
    CHIPS = []
    corner_only = [c for c in ('note', 'bikebtn', 'fitbtn') if c in boxes]
    ok('the corner still has chrome to measure', len(corner_only) >= 1,
       'nothing found — this gate would be measuring nothing')

    for k in CHIPS + corner_only:
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

    print('   BOTTOM-LEFT GATE: %d passed, %d failed  (buffet chips gone; %d pieces of '
          'chrome measured on a %dx%d phone)' % (P, F, len(corner), W, H))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
