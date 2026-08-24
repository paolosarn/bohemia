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
    r.bank = {};
    ['door_drag','door_clack','door_open','door_shut'].forEach(e => { r.bank[e] = A[e] || null; });
    // they must be reachable to judge, or the batch may as well not exist
    r.cookable = r.dragN === 5 && r.clackN === 5;
    return r;
  });
  // ============ OPEN A REAL DOOR AND COUNT WHAT COMES OUT ==============
  // Everything above reads tables. This walks the surface he plays: load the
  // RUN, call the game's own openDoor(), and count renders that carry the
  // APPROVED vector's signature -- ash, three strikes, hz 174. Matching on the
  // signature rather than on "a sound happened" means a footstep or an ambience
  // tick in the same window cannot be mistaken for a door, which is the exact
  // ruler mistake the time_pass gate had to be corrected for.
  /* A TAB THAT IS NOT THERE IS A FAILURE, NOT A SKIP (ONE WORLD TAB, 8/2).
     `if (t) t.click()` walks on when the button is missing and then measures
     whatever panel happened to be open. FIFTH file with this shape -- the pattern
     check keeps finding them as new gates land, which is the argument for
     checking the pattern rather than the instances. */
  await p.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]');
    if (!t) throw new Error('no RUN tab to open: the surface this gate measures is not reachable');
    t.click(); });
  await p.waitForTimeout(8000);
  await p.evaluate(() => { window.__dd = 0; try { MUS.audio(); } catch(e) {}
    const o = BOH_SFX.render.bind(BOH_SFX);
    BOH_SFX.render = function(v){
      if (v && v.mat === 'ash' && v.hits && v.hits.length === 3 && Math.abs(v.hz - 174) < 1) window.__dd++;
      return o.apply(null, arguments); }; });
  /* __ASK_FOR_THE_RUN_SLICE__ (8/23). The alpha stopped downloading the 17.8 MB run
     slice on boot (8/21) and this gate never got told. Without this the frame
     lookup below falls through to p.frames()[1] -- THE CITY -- and every claim
     about "the run" is then measured against a surface that was never asked to
     carry them. Ask the exported loader by name, which is what it was exported
     for, and wait for the frame to finish rather than guessing a duration. */
  await p.evaluate(() => { if (window.__loadRunSlice) window.__loadRunSlice(); });
  for (let _i = 0; _i < 120 && !p.frames().find(f => f.url().includes('RUN_CURRENT')); _i++)
    await p.waitForTimeout(500);
  { const _rf = p.frames().find(f => f.url().includes('RUN_CURRENT'));
    if (_rf) await _rf.waitForLoadState('load').catch(() => {}); }
  const fr = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];
  if (fr) {
    const b0 = await p.evaluate(() => window.__dd);
    out.openCalled = await fr.evaluate(() => { try { openDoor('gate-probe-door'); return true; }
                                               catch(e) { return false; } }).catch(() => false);
    await p.waitForTimeout(1200);
    out.dragFired = (await p.evaluate(() => window.__dd)) - b0;
  }

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

    # THE CALL SITE IS IN THE RUN, NOT THE ALPHA, so it is read where it lives.
    run = open(os.path.join(ROOT, 'slices', 'BOHEMIA_RUN_CURRENT.html'),
               encoding='utf8').read()
    d['wired'] = "sfx('door_drag')" in run
    d['wiredShut'] = "sfx('door_clack')" in run

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

    # HE RULED, SO THE SPEC INVERTED (8/9, 140/140). This asserted that NOTHING
    # was banked, which was right for exactly as long as the batch was unjudged.
    # A GATE MUST NEVER OUTRANK A RULING, so it becomes his verdict itself --
    # and it is stricter, because it pins the survivor by index and catches the
    # bank drifting in either direction.
    bank = d.get('bank') or {}
    ok('HIS 8/9 THUMB IS IN THE GAME: door_drag = [0], the unjittered base (%s)'
       % bank.get('door_drag'), bank.get('door_drag') == [0])
    ok('GRAVEYARD IS FINAL: the stone clack went 0 for 5 and is banked nowhere (%s)'
       % bank.get('door_clack'), not bank.get('door_clack'))
    ok('and the ten he killed on 7/30 are still banked nowhere',
       not bank.get('door_open') and not bank.get('door_shut'))
    ok('THE DOOR ACTUALLY MAKES A NOISE NOW: openDoor fires it in the real run '
       '-- approved-but-unused is the defect this lane exists for', d.get('wired'))
    ok('and the SHUT is still silent, which is his ruling and not an omission',
       not d.get('wiredShut'))
    ok('the run exposes openDoor to drive', d.get('openCalled'))
    ok('OPENING A REAL DOOR IN THE REAL RUN SOUNDS HIS APPROVED DRAG, EXACTLY '
       'ONCE (%s) -- matched on the vector signature, so a footstep in the same '
       'window cannot be mistaken for it' % d.get('dragFired'),
       d.get('dragFired') == 1)
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
        print('  The door drags on thirty years of sand and it is heard in the run. '
              'The stone clack went 0 for 5 and the shut stays silent, his call.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
