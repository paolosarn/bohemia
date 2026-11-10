/* __BOHEMIA_SOLO__ -- THIS GATE COUNTS DRAWN FRAMES WITH THE CPU SLOWED, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE FIGHT'S WEIGHT  (MOTION 3, 11/10/26, VAMILY rule 443(e) and 441; the coordinator's brief: 'measure on the real page first which of
   these read and which do not: a hit, a block on a shield, a miss, a kill, a man struck down, a shot, a reload; then make each read on
   the beat (the body's reaction, the camera's small answer, the sound already there), with the rig's existing clips first (rule 430), at
   no frame cost on a cheap phone, AUTO at 4x still clear. COMBAT TWO owns the fight's rules: touch only how it looks and moves.')
   MEASURED BEFORE (main 0f4592d0f, tools/bohemia_fight_weight.js, the demo at 390 x 844, a suburb fight on AUTO by a real tap, the CPU
   slowed 4x; records/BOHEMIA_MOTION_THREE_THE_FIGHTS_WEIGHT_11_10_26.md): at 1x a hit, a miss, a kill, a shot and a reload each read
   (86 to 100%), the hit's white one drawn frame; at 4x a hit read 63% (its white 0 frames, the glass never kicked), a miss 0% (the
   sidestep one frame), a kill 33%; a block on a shield was drawn as a sidestep with the whoosh of a miss, never as a block.
   On the demo (phone upright, 390 x 844), the CPU slowed 4x:
     SEEN: a read is on the glass for two drawn frames or 100 ms of screen time (this box at 4x draws a blow's beat in one or two
        frames, so one frame left up 140 ms is seen; a read that falls between two frames is not)
     W1 AUTO AT 4X: a suburb fight on AUTO at 4x by a real tap: a hit reads (its own body channel SEEN and its own sound) 75% or more,
        its white or its knock SEEN (medians), the glass answers 50% or more; a miss reads 60% or more
     W2 A BLOCK IS A BLOCK, staged on the real page (the fight's own queue and presenter, the fight's own event: a club blow a man of
        theirs with a wooden shield takes on it), at 4x: he is held in the block SEEN, his shield arm's own SBlock keys drawn (or his hit
        key where his look has no shield keys yet), no sidestep SEEN, BLOCKED heard and the miss's whoosh not, the tag the cover's mark,
        the glass kicks
     W3 THE SHOT FLARES, staged, at 4x: the street lit round him on a drawn frame (drawn, not only asked), his aim key, the shot heard,
        the glass answers
     W4 NO FRAME COST: the frames' middle through the staged moments no more than 15% (and 3 ms) over the same moments with the weight
        off, on the same box in the same run
     P1 PLANTED: window.__FIGHT_WEIGHT_OFF = true (the fight as it was), the same staged block: W2's check goes RED
     P2 PLANTED: the same, the staged shot: W3's check goes RED
     A1 the fight page threw nothing of the weight's
   node gates/the_fights_weight_gate.js [--quick] (skips W1's fight on AUTO)   (about 8 minutes) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const W = require(path.join(ROOT, 'tools/bohemia_fight_weight.js'));
const QUICK = process.argv.indexOf('--quick') > 0;
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const CPU = 4, SPEED = 4;

/* the checks, each a pure function of what the tool read, so a planted fail runs the very same check */
function blockReads(b) {
  if (!b || !b.seen) return { ok: false, why: 'no block staged' };
  const ch = b.ch || {}, ms = b.ms || {}, sn = (c) => W.seen({ ch: ch, ms: ms }, c), keys = Object.keys(b.clips || {});
  const held = sn('block') && (sn('hitclip') || sn('shield')), shield = keys.some(k => /melee:S(Block|CoverHit)|^hit$|melee:.*Hit|hold:.*Hit/.test(k)), lean = sn('lean');
  const heard = (b.sounds || []).indexOf('block') >= 0, whoosh = (b.sounds || []).indexOf('miss') >= 0, mark = (b.tags || []).some(t => t.indexOf('▮') >= 0);
  const glass = (ch.glass || 0) >= 1;
  const f = (c) => (ch[c] || 0) + 'f/' + (ms[c] || 0) + 'ms';
  return { ok: held && shield && !lean && heard && !whoosh && mark && glass,
    why: 'block ' + f('block') + ', shield ' + f('shield') + ', hit key ' + f('hitclip') + ', clips ' + keys.filter(k => /Block|Hit|^hit$/.test(k)).join(' ') + ', sidestep ' + f('lean') + ', heard ' + (b.sounds || []).join(' ') + ', tag ' + (b.tags || []).join(' ') + ', glass ' + (ch.glass || 0) };
}
function shotReads(s) {
  if (!s || !s.seen) return { ok: false, why: 'no shot staged' };
  const ch = s.ch || {}, ms = s.ms || {}, flare = ch.flare || 0, aim = ch.aim || 0, heard = (s.sounds || []).indexOf('shot') >= 0, glass = (ch.glass || 0) >= 1;
  return { ok: flare >= 1 && (s.drawn || 0) >= 1 && aim >= 1 && heard && glass, why: 'flare ' + flare + 'f/' + (ms.flare || 0) + 'ms (drawn ' + (s.drawn || 0) + '), aim ' + aim + ', heard ' + (s.sounds || []).join(' ') + ', glass ' + (ch.glass || 0) };
}
function autoReads(r) {
  const h = r.kinds && r.kinds.hit, m = r.kinds && r.kinds.miss;
  const hch = (h && h.ch) || {}, hms = (h && h.ms) || {}, held = W.seen({ ch: hch, ms: hms }, 'white') || W.seen({ ch: hch, ms: hms }, 'knock');
  return { ok: !!h && h.n >= 3 && h.read >= 75 && held && h.glass >= 50 && (!m || !m.n || m.read >= 60),
    why: 'hit n ' + (h && h.n) + ' reads ' + (h && h.read) + '%, white ' + (hch.white || 0) + 'f/' + (hms.white || 0) + 'ms knock ' + (hch.knock || 0) + 'f/' + (hms.knock || 0) + 'ms (medians), glass ' + (h && h.glass) + '%; miss n ' + (m && m.n) + ' reads ' + (m && m.read) + '% (' + r.fps + ' fps)' };
}
module.exports = { blockReads, shotReads, autoReads };

if (require.main === module) (async () => {
  console.log('THE FIGHT\'S WEIGHT (the demo upright, the CPU slowed ' + CPU + 'x, AUTO at ' + SPEED + 'x)');
  const errs = [];
  const one = async (fn) => { const d = await open({ profile: 'phone_portrait', door: 120000, engage: true });
    d.page.on('pageerror', e => { const m = String(e && e.message || e); if (/\bw(Held|Kick|Blocked|BlockLand|BlockSound|BlockOf|Shot|FlareOf|FlareGround|FlareTint|Push|On|Frame|Dir)\b|weightOf/.test(m)) errs.push(m); });
    try { await d.page.waitForTimeout(2500); return await fn(d); } finally { await d.close(); } };
  /* W2, W3, W4 and the planted fails: the staged moments, the weight on, then off (each a fresh demo, the same fight cell) */
  const on = await one(d => W.stage(d, { speed: SPEED, cpu: CPU }));
  const off = await one(d => W.stage(d, { speed: SPEED, cpu: CPU, off: true }));
  if (on.err || off.err) ok('the staged moments ran', false, on.err || off.err);
  if (on.shot) on.shot.drawn = (on.counts || {}).flareDrawn || 0; if (off.shot) off.shot.drawn = (off.counts || {}).flareDrawn || 0;
  const b = blockReads(on.block), s = shotReads(on.shot);
  ok('W2 A BLOCK IS A BLOCK: the shield up two drawn frames or more, no sidestep, BLOCKED heard (no whoosh), the cover\'s mark, the glass kicks', b.ok, b.why);
  ok('W3 THE SHOT FLARES: the street lit round him two drawn frames or more, his aim key, the shot heard, the glass answers', s.ok, s.why);
  const fOn = Math.max((on.block || {}).fmed || 0, (on.shot || {}).fmed || 0), fOff = Math.max((off.block || {}).fmed || 0, (off.shot || {}).fmed || 0);
  ok('W4 NO FRAME COST: the frames\' middle through the staged moments within 15% (and 3 ms) of the weight off', fOn > 0 && fOff > 0 && fOn <= fOff * 1.15 + 3, fOn + ' ms against ' + fOff + ' ms (worst ' + ((on.block || {}).fworst) + ' / ' + ((off.block || {}).fworst) + ')');
  const pb = blockReads(off.block), ps = shotReads(off.shot);
  ok('P1 PLANTED: the weight off (the fight as it was), W2\'s check on the same staged block goes RED', !pb.ok, pb.why);
  ok('P2 PLANTED: the weight off, W3\'s check on the same staged shot goes RED', !ps.ok, ps.why);
  if (!QUICK) {
    const r = await one(d => W.measure(d, { speed: SPEED, ms: 40000, fam: '^suburb$', cpu: CPU }));
    if (r.err) ok('W1 the fight on AUTO ran', false, r.err);
    else { console.log(W.table(r).split('\n').map(l => '       ' + l).join('\n')); const a = autoReads(r); ok('W1 AUTO AT 4X: a hit reads 75% or more, its white or knock two drawn frames, the glass answers half; a miss reads 60% or more', a.ok, a.why); }
  }
  ok('A1 the fight page threw nothing of the weight\'s', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE FIGHT\'S WEIGHT: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
