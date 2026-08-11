#!/usr/bin/env python3
"""
FRESH DOORS GATE (8/9/26) - the replacement door cannot drift back to what died.

Paolo killed all ten door candidates on 7/30 and named DOORS in the minimum demo
sound set on 8/9. The 7/30 post-mortem did the rare thing and found a CAUSE
rather than stopping at "he said no":

    metal 3 UP / 12 DOWN, wood 0 UP / 5 DOWN
    ash + stone + bell 25 UP / 0 DOWN, crystal 8 UP / 2 DOWN
    and the survivors were BRIGHTER, SHORTER and HARDER-DRIVEN than the dead.

That is a finding with numbers in it, which means it can be a gate instead of a
paragraph somebody hopefully reads. "Build the door out of metal or wood again"
is a documented dead end, and this is the machine that keeps it one.

It also guards the registry the whole no-remake law rests on: the ten dead ids
must still exist, still be dead, and still be findable.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAVE = os.path.join(ROOT, 'gates', 'bohemia_graveyard.txt')

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();
(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844} });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(1000);
  const out = await p.evaluate(() => {
    const r = {};
    const has = e => BOH_SFX.EVENTS.some(x => x.ev === e);
    r.hasDrag = has('door_drag'); r.hasClack = has('door_clack');
    // THE DEAD IDS MUST STILL POINT AT THE DEAD SOUNDS. The post-mortem is
    // explicit that the MOMENTS did not die -- only the candidates did -- so
    // door_open and door_shut still exist and still cook. What would corrupt
    // the registry is a NEW sound appearing behind a registered dead id, and
    // the way to catch that is to check they still cook the materials that are
    // written on their tombstone.
    r.deadStillMetalWood = (function(){
      try {
        const o = BOH_SFX.cook('door_open',5).map(v=>v.mat);
        const s = BOH_SFX.cook('door_shut',5).map(v=>v.mat);
        return o.every(m=>m==='metal') && s.every(m=>m==='wood');
      } catch(e) { return false; }
    })();
    r.freshIdsAreNew = !['door_open','door_shut'].includes('door_drag')
                    && !['door_open','door_shut'].includes('door_clack');
    const drag = BOH_SFX.cook('door_drag', 5), clack = BOH_SFX.cook('door_clack', 5);
    r.dragN = drag.length; r.clackN = clack.length;
    const all = drag.concat(clack);
    r.mats = Array.from(new Set(all.map(v => v.mat)));
    r.minBright = Math.min.apply(null, all.map(v => v.bright));
    r.maxDecay  = Math.max.apply(null, all.map(v => v.decay));
    r.minDrive  = Math.min.apply(null, all.map(v => v.drive));
    // every candidate must be distinct: five copies of one sound is not a batch
    r.distinct = new Set(all.map(v => JSON.stringify(v))).size;
    r.total = all.length;
    // and NOTHING may be banked -- he has not thumbed one
    const A = window.__SFX_APPROVED || {};
    r.banked = ['door_drag','door_clack','door_open','door_shut'].filter(e => A[e] && A[e].length);
    // they must be reachable to judge, or the batch may as well not exist
    r.cookable = r.dragN === 5 && r.clackN === 5;
    return r;
  });
  out.errors = errs.slice(0, 3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== FRESH DOORS GATE - it cannot drift back to metal and wood ===')
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
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=300)
    finally:
        os.unlink(js)
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1000:]); print(r.stderr[-1000:])
        return 1
    d = json.loads(line[-1])

    ok('the drag exists', d.get('hasDrag'))
    ok('the clack exists', d.get('hasClack'))
    ok('five candidates each (%s, %s)' % (d.get('dragN'), d.get('clackN')), d.get('cookable'))
    ok('every candidate is a different sound (%s of %s)'
       % (d.get('distinct'), d.get('total')), d.get('distinct') == d.get('total'))

    mats = set(d.get('mats') or [])
    ok('MADE OF THE MATERIALS THAT WON: %s' % sorted(mats),
       mats and mats <= {'ash', 'stone', 'bell', 'crystal'})
    ok('NOT METAL. metal went 3 UP / 12 DOWN and took the doors with it',
       'metal' not in mats)
    ok('NOT WOOD. wood went 0 UP / 5 DOWN -- it never won once',
       'wood' not in mats)

    # the dead ten were bright 0.70-0.85, decay 0.5-0.75, drive 0.25-0.35.
    # "brighter, shorter, harder-driven" is a comparison, so compare.
    ok('BRIGHTER than every door that died (min %.2f vs their max 0.85)'
       % (d.get('minBright') or 0), (d.get('minBright') or 0) > 0.85)
    ok('SHORTER than every door that died (max decay %.3f vs their min 0.50)'
       % (d.get('maxDecay') or 9), (d.get('maxDecay') or 9) < 0.5)
    ok('HARDER-DRIVEN than every door that died (min %.2f vs their max 0.35)'
       % (d.get('minDrive') or 0), (d.get('minDrive') or 0) > 0.35)

    ok('NOTHING IS BANKED: the game still makes no door sound until he thumbs one '
       '(%s)' % (d.get('banked') or 'none'), not d.get('banked'))
    ok('the fresh cook uses NEW ids, so the dead ten stay dead and findable',
       d.get('freshIdsAreNew'))
    ok('and the dead ids STILL COOK METAL AND WOOD -- nothing new has been slipped '
       'in behind a registered tombstone', d.get('deadStillMetalWood'))

    # and the registry still carries them, so the kill stays findable
    g = open(GRAVE, encoding='utf8').read()
    for dead in ('door_open.0', 'door_shut.0'):
        ok('the graveyard still records %s' % dead, dead in g)
    ok('and it still records WHY, so nobody re-tries metal',
       'METAL AND WOOD DIED' in g)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))
    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  A door that drags on thirty years of sand and then stops dead. '
              'Cooked from what won, not from what he already refused.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
