/* WHEN THE PHONE TURNS  (UI lane 11, [landscape], 10/10/26)

   RULE 50b (Paolo 9/30, his sixth Pocket City 2 shot, reference/pocket_city_2/06): portrait is the default; in landscape
   the HUD re-lays to the corners the Pocket City 2 way, the same buttons, the phone city-view-only rule unchanged;
   measured on both profiles through the one driver; a screen that breaks when the phone turns is red.
   The layout is slices/bohemia_ui_materials.js's (one media rule for a phone on its side); no lane's file is edited.

   WHAT THIS HOLDS, on the demo's map, upright (390x844) and on its side (844x390), through the one driver:
     - every piece of the HUD is on the glass, whole: the gear, the bar and its readouts, NOTES, the speed pad, the phone
     - no two pieces cover each other (the gear, the bar, the speed pad, the phone)
     - every pressed thing is 44 points: the gear, NOTES, the five speeds, the phone, the faces
     - THE SAME BUTTONS both ways: the same readouts, the same five speeds, NOTES, the gear, the phone, the faces
     - the phone stays a phone, 19.5 by 9
     - on its side, the corners: the bar across the top, the phone on the left (the face's side), the speed pad in the
       bottom right; and with all three of the family unlocked every face is still 44 points inside the glass
     - no page error

   node gates/the_phone_turns_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nWHEN THE PHONE TURNS: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const box = r => r && [Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h)].join(',');
const hit = (a, b) => a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1;

async function measure(profile) {
  const d = await open({ door: 120000, profile });
  if (!d.doorIsBehindUs()) { await d.close(); return null; }
  const p = d.page, fr = d.fr;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await fr.evaluate(() => { const f = document.getElementById('cityfeed'); return !!(f && f.classList.contains('on') && document.getElementById('speedpad')); })) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(2500);
  const fb = await (await fr.frameElement()).boundingBox();
  const shell = await p.evaluate(() => {
    const vis = e => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
    const g = document.getElementById('gearbtn') || [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === '⚙' && vis(e));
    const r = vis(g) ? g.getBoundingClientRect() : null;
    return { vw: innerWidth, vh: innerHeight, gear: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null };
  });
  const read = () => fr.evaluate(({ ox, oy }) => {
    const R = e => { if (!e) return null; const s = getComputedStyle(e), r = e.getBoundingClientRect(); if (s.display === 'none' || s.visibility === 'hidden' || !r.width) return null; return { x: ox + r.x, y: oy + r.y, w: r.width, h: r.height }; };
    const scr = R(document.getElementById('cityfeedscreen'));
    return { bar: R(document.getElementById('menubar')), notes: R(document.getElementById('notebtn')), pad: R(document.getElementById('speedpad')),
      phone: R(document.getElementById('cityfeed')), glass: scr,
      reads: [...document.querySelectorAll('#barread .rd')].map(R).filter(Boolean), speeds: [...document.querySelectorAll('#speedpad .sp')].map(e => Object.assign(R(e) || {}, { t: e.textContent.trim() })),
      faces: [...document.querySelectorAll('#actflip .af')].map(R).filter(Boolean) };
  }, { ox: fb.x, oy: fb.y });
  const m = await read();
  /* the family unlocked by the game's own hook, so the face row is at its fullest */
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); ctActUnlock(2); ctActUnlock(3); } catch (e) {} });
  await p.waitForTimeout(1200);
  const m3 = await read();
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); } catch (e) {} });
  const errs = (d.errs || []).slice();
  await d.close();
  return Object.assign(shell, m, { three: m3, errs });
}

(async () => {
  console.log('\nWHEN THE PHONE TURNS  (UI [landscape], rule 50b)\n');
  const P = {};
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    const M = P[prof] = await measure(prof);
    console.log('\n  -- ' + prof + (M ? ' ' + M.vw + 'x' + M.vh : '') + '\n');
    if (!M) { ok('the driver got past the door', false); continue; }
    const on = r => r && r.x >= -0.5 && r.y >= -0.5 && r.x + r.w <= M.vw + 0.5 && r.y + r.h <= M.vh + 0.5;
    const parts = { gear: M.gear, bar: M.bar, notes: M.notes, speedpad: M.pad, phone: M.phone };
    const missing = Object.keys(parts).filter(k => !parts[k]);
    ok('EVERY PIECE OF THE HUD IS ON THE GLASS, WHOLE', missing.length === 0 && Object.values(parts).every(on) && M.reads.every(on) && M.speeds.every(on) && M.three.faces.every(on),
       missing.length ? 'missing ' + missing.join(' ') : Object.keys(parts).map(k => k + ' ' + box(parts[k])).join(' | '));
    const big = { gear: M.gear, bar: M.bar, speedpad: M.pad, phone: M.phone }, ks = Object.keys(big), clash = [];
    for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (big[ks[i]] && big[ks[j]] && hit(big[ks[i]], big[ks[j]])) clash.push(ks[i] + ' on ' + ks[j]);
    ok('  no two pieces cover each other', clash.length === 0, clash.join(', '));
    const pressed = [['gear', M.gear], ['NOTES', M.notes], ['phone', M.phone]].concat(M.speeds.map(s => [s.t, s]), M.faces.map((f, i) => ['face ' + i, f]));
    const small = pressed.filter(([, r]) => !r || r.w < 44 || r.h < 44);
    ok('  every pressed thing is 44 points', small.length === 0, small.map(([k, r]) => k + ' ' + (r ? Math.round(r.w) + 'x' + Math.round(r.h) : 'none')).join(', '));
    ok('  the phone stays a phone, 19.5 by 9', !!M.phone && Math.abs(M.phone.h / M.phone.w - 2.167) < 0.12, M.phone && Math.round(M.phone.w) + 'x' + Math.round(M.phone.h));
    const g = M.three.glass, f3 = M.three.faces;
    ok('  with all three of the family unlocked, every face is 44 points inside the glass', f3.length === 3 && f3.every(f => f.w >= 44 && f.h >= 44 && f.x >= g.x - .5 && f.x + f.w <= g.x + g.w + .5 && f.y + f.h <= g.y + g.h + .5),
       f3.map(f => Math.round(f.w) + 'x' + Math.round(f.h)).join(', '));
    ok('  no page error', !M.errs.length, M.errs.slice(0, 2).join(' | '));
  }
  const A = P.phone_portrait, B = P.phone_landscape;
  if (A && B) {
    console.log('\n  -- both ways\n');
    const sig = M => ['readouts ' + M.reads.length, 'speeds ' + M.speeds.map(s => s.t).join(' '), 'notes ' + !!M.notes, 'gear ' + !!M.gear, 'phone ' + !!M.phone, 'faces ' + M.three.faces.length].join('; ');
    ok('THE SAME BUTTONS BOTH WAYS', sig(A) === sig(B), sig(B));
    const L = B;
    ok('ON ITS SIDE, THE CORNERS: the bar across the top, the phone on the left, the speed pad bottom right',
       L.bar.y <= 1 && L.bar.w >= L.vw * 0.6 && L.phone.x + L.phone.w / 2 < L.vw / 2 && L.pad.x + L.pad.w / 2 > L.vw / 2 && L.pad.y + L.pad.h >= L.vh - 30 && L.phone.y >= L.bar.y + L.bar.h - 1,
       'bar ' + box(L.bar) + ', phone ' + box(L.phone) + ', speed pad ' + box(L.pad));
  }
  done();
})().catch(e => { console.error(e); process.exit(1); });
