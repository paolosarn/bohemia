#!/usr/bin/env node
/* THE KILL CAMS, REMADE (ANIMATION, rule 426(h), ask lines 365 and 498; Paolo 11/3: 'in the early combat you know we had kill cams,
   bro why don't we have kill cams here... it will just like fit into the timing of the game... I always just care about the frames
   per second'; then rule 379: 'Kill cams came in like ugly dogshit, they are far from final... Toggle kill cams on or off').
   COMBAT 7 brought the first module's camera back (11/3); this lane remade it (11/7): only the kills that matter, the crew's
   camcorder at the art's own pixels, on the key grid, on its own layer. slices/BOHEMIA_FIGHT.html killStake/killCut/cutAfter,
   ours.kill_cams. Legs, the real fight page on the upright phone (390 x 844 at 3x, touch), AUTO on:
   K1 THE RULE IS DATA: ours.kill_cams: big_share, a style for each of the three stakes, whole zooms, the look, source, his words, why
   K2 ONLY THE KILLS THAT MATTER: on real AUTO fights every cut is a stake (the last of theirs, a champion or boss, a killing blow of
      big_share of his health or more) and no plain kill is cut; over the run fewer kills matter than fall (one fight may honestly be
      all big hits). PLANTED: the page's own killStake run on the
      same recorded kills with big_share 0 must cut every kill, and this leg's own check must call that 'every kill'
   K3 ON THE BEAT: every cut whole beats (HELD BREATH long, HAMMER short, AUTO halves but never the last one); the picture changes
      only on the key grid (three keys a beat), each new key once, in order. PLANTED: a cut of one and a half beats is caught
   K4 THE ART'S OWN PIXELS: every picture blown up by a WHOLE number (2 or more) from a whole-pixel origin; the fight's canvas never
      carries a transform or animation (the old blur). PLANTED: a picture at 1.5 is caught
   K5 THE CAMERA NEVER MOVES, AND THE BOARD'S MARKS STAY OUT OF THE CAMERA: the fight's zoom and aim the same through every cut; no
      man's bars drawn while a cut holds; the layer gone after
   K6 A TAP SKIPS IT: a finger on the board mid-cut ends it, the layer goes, the fight goes on
   K7 NO FRAME LOST: a kill's frames (the fight's draw and the camera's layer together) within 3 ms of the same kills with the cams
      off (mean, measured round the page's own calls)
   K8 THE SWITCH, OFF BY DEFAULT (rule 379(b)): the game's default fight never cuts (no cut, no layer, the tags never hidden); on the
      demo on his upright phone the gear's card carries KILL CAMS (ON / OFF) under FIGHTS, OFF lit, his taps set and clear it
   (K2 to K7 run with the switch ON, as he would turn it on)
   Run: node gates/the_kill_cams_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const KC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).kill_cams;
const V = KC && KC.value;
const whole = a => Array.isArray(a) && a.length && a.every(n => Number.isInteger(n) && n >= 2);
leg(!!(V && KC.source && KC.quote && KC.why && V.on && V.big_share > 0 && V.big_share < 1 && V.styles && ['last', 'champion', 'big'].every(k => V.styles[k] && V.zoom[V.styles[k]])
    && Object.values(V.zoom).every(whole) && V.long_beats > V.short_beats && V.look && V.look.warm && V.look.lines > 0),
  '*** K1 THE RULE IS DATA ***: ours.kill_cams: big_share, a style for the last, a champion and a big hit, whole zooms, the look',
  JSON.stringify(V && { big: V.big_share, styles: V.styles, zoom: V.zoom, short: V.short_beats, long: V.long_beats, auto: V.auto_share }));

/* THE CHECKS, shared by the live legs and their plants */
const STAKES = ['last', 'champion', 'big'];
function stakeFaults(kills, cuts) {   /* kills: [{stake}], cuts: [{stake}] from one fight: every cut a stake, never more cuts than stakes */
  const out = [], n = kills.filter(k => k.stake).length;
  cuts.forEach(c => { if (STAKES.indexOf(c.stake) < 0) out.push('a cut on a plain kill (' + c.stake + ')'); });
  if (cuts.length > n) out.push(cuts.length + ' cuts for ' + n + ' kills that matter');
  return out;
}
/* THE RULE NEVER MAKES EVERY KILL A STAKE: over a whole run of fights (a fight may honestly be all big hits: seed 42 after 11/7l, two
   kills, both blows of 0.8 or more) the kills that matter are fewer than the kills */
function everyKill(kills) { const n = kills.filter(k => k.stake).length; return kills.length >= 2 && n >= kills.length ? ['every kill (' + n + ' of ' + kills.length + ')'] : []; }
function beatFaults(cuts, B, K, auto) {
  const out = [];
  cuts.forEach(c => {
    const b = c.ms / B; if (Math.abs(b - Math.round(b)) > 0.01) out.push(c.stake + ' ' + b.toFixed(2) + ' beats');
    const want = Math.max(1, Math.round((c.style === 'held' ? K.long_beats : K.short_beats) * (auto && c.stake !== 'last' ? K.auto_share : 1)));
    if (Math.abs(b - want) > 0.01) out.push(c.stake + ' ' + b.toFixed(2) + ' beats, not ' + want);
    let prev = -1;
    (c.drawn || []).forEach(d => { const off = d.at - c.at - d.k * B / 3; if (d.k <= prev) out.push('key ' + d.k + ' again or out of order'); prev = d.k;
      if (off < -1 || off > B / 3) out.push('key ' + d.k + ' drawn ' + Math.round(off) + ' ms off its key'); });
  });
  return out;
}
const pixelFaults = cuts => { const out = []; cuts.forEach(c => (c.drawn || []).forEach(d => { if (!Number.isInteger(d.n) || d.n < 2 || !Number.isInteger(d.sx) || !Number.isInteger(d.sy)) out.push(c.stake + ' key ' + d.k + ' at x' + d.n + ' from ' + d.sx + ',' + d.sy); })); return out; };

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const OPTS = seed => ({ seed, speed: 1, kind: 'street', deploy: false, formation: null, auto: true, company: [{}, {}, {}, {}, {}, {}], cap: 6, band: ['brigand_thug', 'brigand_thug', 'brigand_leader'] });
  const open = async (seed, on, force) => {
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(OPTS(seed)) + (on === 'default' ? '' : ";try{localStorage.setItem('bohemia.killcams.v1','on')}catch(e){}") });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
    await p.evaluate(([on, force]) => {
      if (on !== 'default') DB.ours.kill_cams.value.on = on; FIGHT_UI.cutForce = force || null;
      window.__D = []; window.__K = []; window.__bars = 0; const od = window.draw, oa = window.cutAfter;
      window.draw = function (now) { const t = performance.now(), z = [FIGHT_UI.zoom, FIGHT_UI.cx, FIGHT_UI.cy]; od(now); window.__t = performance.now() - t;
        const a0 = FIGHT_UI.anim[0], kill = !!FIGHT_UI.cut || !!(a0 && a0.k === 'note' && a0.e && a0.e.t === 'dead' && a0.at <= now && now - a0.at < Math.max(a0.dur, 500));
        window.__D.push([window.__t, kill]);
        if (FIGHT_UI.cut) { window.__bars += FIGHT.S.units.filter(v => v._bar && v._bar.at === now).length;
          window.__K.push({ z0: z, z1: [FIGHT_UI.zoom, FIGHT_UI.cx, FIGHT_UI.cy], hid: getComputedStyle(document.getElementById('num') || document.body).visibility, tf: getComputedStyle(document.getElementById('cv')).transform, an: getComputedStyle(document.getElementById('cv')).animationName }); } };
      window.cutAfter = function (now) { const t = performance.now(); oa(now); if (window.__D.length) window.__D[window.__D.length - 1][0] += performance.now() - t; };
    }, [on, force]);
    return { d, p, errs };
  };
  const toEnd = async (p, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(() => FIGHT.S.over && !FIGHT_UI.anim.length).catch(() => true)) break; await p.waitForTimeout(250); } };
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  try {
    /* K2, K3, K4, K5, K7: whole AUTO fights, the switch on, then off on the same seeds */
    const runs = { on: [], off: [] }, errs = [], seen = [];
    let sf = [], bf = [], pf = [], moved = 0, hidOk = true, back = true, bars = 0, cvOk = true, plant = null, nKills = 0, nCuts = 0; const allKills = [], allPlant = [];
    for (const seed of [23, 11, 42]) for (const on of [true, false]) {
      const { d, p, errs: e } = await open(seed, on);
      await toEnd(p, 160000);
      const r = await p.evaluate(() => {
        const S = FIGHT.S, K = R('ours.kill_cams'), L = S.log, them = S.units.filter(v => v.side === 'them' && !v.decoy);
        let left = them.length; const kills = [], plantK = Object.assign({}, K, { big_share: 0 });
        L.forEach((e, i) => { if (e.t !== 'dead') return; const u = FIGHT.byId(e.id); if (!u || u.side !== 'them') return; left--;
          kills.push({ stake: killStake(u, L, i, left, K), plant: killStake(u, L, i, left, plantK), round: e.round }); });
        const all = (FIGHT_UI.cuts || []).map(c => Object.assign({}, c)), last = FIGHT_UI.cutLast;
        return { kills, cuts: all, B: beatMs(), K, auto: !!FIGHT_UI.auto, numVis: getComputedStyle(document.getElementById('num') || document.body).visibility, cut: !!FIGHT_UI.cut,
          layer: (document.getElementById('killcam') || { style: {} }).style.display || 'none', D: window.__D, Kf: window.__K, bars: window.__bars, res: S.result };
      });
      runs[on ? 'on' : 'off'].push(...r.D.filter(x => x[1]).map(x => x[0]));
      if (on) {
        nKills += r.kills.length; nCuts += r.cuts.length;
        seen.push(seed + ': ' + r.kills.length + ' kills (' + r.kills.map(k => k.stake || '-').join(' ') + '), ' + r.cuts.length + ' cut ' + r.cuts.map(c => c.style + '/' + c.stake + ' ' + Math.round(c.ms / r.B * 100) / 100 + 'b').join(' '));
        sf.push(...stakeFaults(r.kills, r.cuts)); bf.push(...beatFaults(r.cuts, r.B, r.K, r.auto)); pf.push(...pixelFaults(r.cuts));
        if (r.kills.some(k => k.stake === 'last') && !r.cuts.some(c => c.stake === 'last')) sf.push(seed + ': the last one fell with no cut');
        allKills.push(...r.kills); allPlant.push(...r.kills.map(k => ({ stake: k.plant })));
        r.Kf.forEach(k => { if (Math.abs(k.z0[0] - k.z1[0]) > 1e-9 || Math.abs(k.z0[1] - k.z1[1]) > 1e-6 || Math.abs(k.z0[2] - k.z1[2]) > 1e-6) moved++; if (k.hid !== 'hidden') hidOk = false; if (k.tf !== 'none' || (k.an && k.an !== 'none')) cvOk = false; });
        bars += r.bars;
        if (r.numVis === 'hidden' || r.cut || r.layer !== 'none') back = false;
      }
      errs.push(...e); await d.close();
    }
    sf.push(...everyKill(allKills)); plant = everyKill(allPlant);
    leg(nCuts >= 2 && nCuts < nKills && sf.length === 0 && plant.some(x => /every kill/.test(x)),
      '*** K2 ONLY THE KILLS THAT MATTER ***: every cut a stake, the last one always cut, no plain kill cut, fewer kills that matter than kills over the run; PLANTED big_share 0 reads "every kill"',
      seen.join(' | ') + (sf.length ? ' FAULTS ' + sf.slice(0, 3).join(', ') : '') + ' plant: ' + JSON.stringify(plant));
    const bPlant = beatFaults([{ stake: 'big', style: 'hammer', ms: 750, at: 0, drawn: [] }], 500, V, false);
    leg(bf.length === 0 && bPlant.length > 0, '*** K3 ON THE BEAT ***: every cut whole beats, the picture only on the key grid, each key once in order; PLANTED 1.5 beats caught',
      (bf.slice(0, 3).join(', ') || 'clean') + ' | plant: ' + bPlant[0]);
    const pPlant = pixelFaults([{ stake: 'big', drawn: [{ k: 0, n: 1.5, sx: 10, sy: 10 }] }]);
    leg(pf.length === 0 && cvOk && pPlant.length > 0, '*** K4 THE ART\'S OWN PIXELS ***: every picture a whole zoom from a whole pixel, the fight\'s canvas never transformed; PLANTED x1.5 caught',
      (pf.slice(0, 3).join(', ') || 'clean') + (cvOk ? '' : ', the canvas transformed') + ' | plant: ' + pPlant[0]);
    leg(moved === 0 && hidOk && back && bars === 0, '*** K5 THE CAMERA NEVER MOVES, THE MARKS STAY OUT ***: zoom and aim unchanged through every cut, no man\'s bars drawn in a cut, the tags aside and back, the layer gone after',
      moved + ' frames moved, ' + bars + ' bars drawn in a cut' + (hidOk ? '' : ', tags not hidden') + (back ? '' : ', not back after'));
    const mOn = mean(runs.on), mOff = mean(runs.off);
    leg(runs.on.length > 10 && runs.off.length > 10 && mOn - mOff <= 3, '*** K7 NO FRAME LOST ***: a kill\'s frames (the fight\'s draw and the camera\'s layer) within 3 ms of the same kills with the cams off',
      'on ' + (mOn && mOn.toFixed(1)) + ' ms over ' + runs.on.length + ' frames, off ' + (mOff && mOff.toFixed(1)) + ' ms over ' + runs.off.length);
    /* K6: a forced cut and his finger */
    {
      const { d, p, errs: e } = await open(23, true, 'last');
      const ok = await p.waitForFunction(() => !!FIGHT_UI.cut && FIGHT_UI.cut.drawn.length > 0, null, { timeout: 120000 }).then(() => true).catch(() => false);
      let tapped = null;
      if (ok) { const at = await p.evaluate(() => ({ x: innerWidth / 2, y: innerHeight * 0.4 })); await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(150);
        tapped = await p.evaluate(() => ({ gone: !FIGHT_UI.cut, skipped: FIGHT_UI.cutSkipped || 0, layer: (document.getElementById('killcam') || { style: {} }).style.display }));
        const n0 = await p.evaluate(() => FIGHT.S.log.length); await p.waitForTimeout(3000); tapped.goesOn = await p.evaluate(n0 => FIGHT.S.over || FIGHT.S.log.length > n0, n0); }
      leg(!!tapped && tapped.gone && tapped.skipped >= 1 && tapped.layer === 'none' && tapped.goesOn, '*** K6 A TAP SKIPS IT ***: a finger on the board mid-cut ends it, the layer goes, the fight goes on', JSON.stringify(tapped));
      errs.push(...e); await d.close();
    }
    /* K8: the fight with the game's default (nothing set), then the settings card on the demo by his finger */
    {
      const { d, p, errs: e } = await open(23, 'default');
      await toEnd(p, 160000);
      const r = await p.evaluate(() => ({ kills: FIGHT.S.log.filter(x => x.t === 'dead' && FIGHT.byId(x.id) && FIGHT.byId(x.id).side === 'them').length, cuts: (FIGHT_UI.cuts || []).length, framesInCut: window.__K.length,
        cutting: document.body.classList.contains('cutting'), layer: !!document.getElementById('killcam'), key: localStorage.getItem('bohemia.killcams.v1') }));
      errs.push(...e); await d.close();
      const dm = await D.open({ profile: 'phone_portrait' }); const q = dm.page, e2 = []; q.on('pageerror', x => e2.push(String(x.message).slice(0, 140)));
      let row = null;
      try {
        const tapEl = async sel => { const at = await q.evaluate(sel => { const b = document.querySelector(sel); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }, sel); if (at) await q.touchscreen.tap(at.x, at.y); return !!at; };
        await q.evaluate(() => document.getElementById('gearbtn').click()); await q.waitForTimeout(700);
        const look = () => q.evaluate(() => { const h = document.getElementById('setcams'), r = h && h.closest('.setrow'), f = document.getElementById('setdiff');
          const pos = (a, b) => a && b ? !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) : false;
          return h ? { label: r.querySelector('.setlab').textContent, buttons: [...h.children].map(b => b.textContent + (b.classList.contains('on') ? '*' : '')).join(' '), shown: getComputedStyle(r).display !== 'none' && r.getBoundingClientRect().height > 4,
            underFights: pos(r, f), key: localStorage.getItem('bohemia.killcams.v1') } : null; });
        const first = await look();
        await tapEl('#setcams .setbtn[data-k=on]'); await q.waitForTimeout(250); const onNow = await look();
        await tapEl('#setcams .setbtn[data-k=off]'); await q.waitForTimeout(250); const offNow = await look();
        row = { first, onNow, offNow };
      } catch (x) { row = { err: String(x.message).slice(0, 160) }; }
      errs.push(...e2); await dm.close();
      const ok = r.kills > 0 && r.cuts === 0 && r.framesInCut === 0 && !r.cutting && !r.layer && r.key === null && row && row.first && row.first.label === 'KILL CAMS' && row.first.shown && row.first.underFights
        && /OFF\*/.test(row.first.buttons) && !/ON\*/.test(row.first.buttons) && row.first.key === null && row.onNow.key === 'on' && /ON\*/.test(row.onNow.buttons) && row.offNow.key === null && /OFF\*/.test(row.offNow.buttons);
      leg(ok, '*** K8 THE SWITCH, OFF BY DEFAULT *** [upright 390 x 844, touch]: the game\'s default fight never cuts and never makes the layer; KILL CAMS (ON / OFF) on the gear\'s card under FIGHTS, OFF lit, his taps set and clear it',
        JSON.stringify({ fight: r, card: row }));
    }
    leg(errs.length === 0, '  nothing threw', errs.slice(0, 2).join(' | ') || 'none');
  } catch (e) { leg(false, 'the page legs ran', String(e.message).slice(0, 200)); }
  console.log('\n=== THE KILL CAMS: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
