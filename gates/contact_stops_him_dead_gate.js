#!/usr/bin/env node
/* ============================================================================
   CONTACT STOPS HIM DEAD GATE (WORLD 9, 11/5; rules 401(b), 398(b), 396's computer half; ask lines 443, 438, 435).

   PAOLO 11/4: 'you still kind of slightly walking after someone wants to attack you'; 'these little pop-up events are fucking with
   my fast speed vibe, if I make it four I have to make it again'; 'when I hold, I want it to go four times as fast... on a computer
   the same hold, with the mouse or the space bar'.

   Plays the demo on the computer (the keyboard is his there) through the one driver and samples the party's PICTURE (CITY_GLIDE,
   what is drawn) every frame:
     C1 a real chase into the nearest roaming party at his speed: from the frame the card comes up, the picture moves under 0.02 of a
        block for the next 1.5 s (before: 0.73 of a block, 268 ms)
     C2 the picture where the card came up is where it stands when the card closes (FALL BACK pressed)
     C3 no snap at contact: no frame around the card moves the picture more than the march's own largest frame before it
     C4 after FALL BACK the picture walks from where it stood: no frame jumps a block or more
     C5 a road event that asks him something, on a 4x march: the picture stops dead the same way
     C6 MUTATION: CONTACT_DEAD.on false, a contact on the march: the picture walks on (over 0.2 of a block): the gate bites
   THE QUIET EVENTS (398(b)):
     Q1 the event that asks stops the map (PAUSE) while it stands
     Q2 his choice: the answer is never a second card, and the march goes on at the 4x he had
     Q3 the answer is a post on the phone's feed (the FEED app's own list), '@theroad', the speaker's name
     Q4 a card with nothing to decide on a 4x march: no card, no stop, the speed and the march untouched
     Q5 MUTATION: QUIET.on false, the same card stands and the map stops
   THE SPACE BAR (396):
     S1 a tap pauses the march; another tap plays it at his speed (rule 163(a), on both doors: the shell's focus and the map's)
     S2 a hold runs 4x while held; let go and it is his speed again; his kept speed never moves
     S3 a hold from PAUSE runs 4x while held and lets go to PAUSE
     S4 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nCONTACT STOPS HIM DEAD GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* the picture, every frame, into window.__PS */
const SAMPLE = () => { window.__PS = []; window.__PSon = true;
  const tick = () => { if (!window.__PSon) return; const G = CITY_GLIDE;
    window.__PS.push({ t: performance.now(), px: G.px, py: G.py, x: city.x, y: city.y, up: !!(MEET.up || (window.BohemiaRoadEvents && BohemiaRoadEvents.up())), sp: TRAVEL_SPEED });
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick); };
const READ = () => { window.__PSon = false; const S = window.__PS || [], i0 = S.findIndex(s => s.up); if (i0 < 0) return { noup: true, n: S.length };
  /* a snap is a move with no time in it: the picture's SPEED frame to frame (a slow frame moves farther and is not a snap) */
  const a = S[i0], st = (p, q) => Math.max(Math.abs(q.px - p.px), Math.abs(q.py - p.py)) / Math.max(8, q.t - p.t) * 16.7;
  let slide = 0, around = 0, before = 0;
  for (let i = i0 + 1; i < S.length && S[i].t - a.t < 1500; i++) slide = Math.max(slide, Math.max(Math.abs(S[i].px - a.px), Math.abs(S[i].py - a.py)));
  for (let i = Math.max(1, i0 - 3); i <= Math.min(S.length - 1, i0 + 6); i++) around = Math.max(around, st(S[i - 1], S[i]));
  for (let i = Math.max(1, i0 - 40); i < i0 - 3; i++) before = Math.max(before, st(S[i - 1], S[i]));
  return { pic: [a.px, a.py], logic: [a.x, a.y], slide, around, before, lag: Math.max(Math.abs(a.px - a.x), Math.abs(a.py - a.y)), frames: S.length - i0 }; };
const clean = (fr) => fr.evaluate(() => { try { if (window.MEET_DONE && MEET.up) MEET_DONE(false); } catch (e) {} try { if (BohemiaRoadEvents.up()) BohemiaRoadEvents.close(false); } catch (e) {}
  try { loopClose(); } catch (e) {} try { PARTY_CHASE = null; PARTY_SEL = null; } catch (e) {} LOOP.fighting = null; CITY_CONTACT_POSTED = false; travelStop(); });   /* the chase is let go, or every walk re-aims at the party beside him */
/* a march far off along the road, at a speed */
const march = (fr, sp) => fr.evaluate((sp) => {
  const ok = (x, y) => { try { return cityWalkable(x, y) && !loopTownAt(x, y, 2); } catch (e) { return false; } };
  window.__ROADEV_OFF = true; try { MEET_BACK.list = []; } catch (e) {}
  /* far enough that a 4x march (8 blocks a second) is still on when the gate asks; the first place the map's own walk sets out for */
  for (let r = 60; r >= 24; r -= 6) for (let a = 0; a < 16; a++) { const x = city.x + Math.round(r * Math.cos(a * Math.PI / 8)), y = city.y + Math.round(r * Math.sin(a * Math.PI / 8)); if (!ok(x, y)) continue;
    try { travelStop(); travelTo(0, 0, [x, y]); } catch (e) { continue; }
    if (TRAVEL) { travelSpeedSet(sp); TRAVEL_SPEED_LAST = sp; return { to: [x, y], sp: TRAVEL_SPEED, r }; } }
  return { fail: true, me: [city.x, city.y], look: !!(window.LOOK && LOOK.on), mode: MODE, town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), meet: !!MEET.up, road: !!BohemiaRoadEvents.up() }; }, sp);

(async () => {
  const d = await open({ profile: 'computer' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.waitForTimeout(3000);
  await fr.waitForFunction(() => typeof CITY_GLIDE !== 'undefined' && typeof CONTACT_DEAD !== 'undefined' && window.BohemiaRoadEvents && BohemiaRoadEvents.ready(), null, { timeout: 60000 }).catch(() => {});

  /* ---- C5, Q1 to Q3: a road event that asks, on a 4x march ---- */
  await clean(fr); await page.waitForTimeout(1000);
  const m1 = await march(fr, 4);
  await page.waitForTimeout(1200);
  const ev = await fr.evaluate((SAMPLE) => { (new Function('(' + SAMPLE + ')()'))(); const D = BohemiaRoadEvents.data().events.events;
    const e = D.filter(x => (x.opts || []).length >= 2 && !(x.opts[0].need) && !(x.opts[0].fx && (x.opts[0].fx.fight || x.opts[0].fx.quest)) && !(x.needs && (x.needs.party || x.needs.raided || x.needs.boss_sign || x.needs.flag)))[0];
    if (!e) return null; const fired = BohemiaRoadEvents.fire(e.id); return { id: e.id, fired, name: e.who && e.who.name }; }, SAMPLE.toString());
  await page.waitForTimeout(1700);
  const C5 = await fr.evaluate((READ) => (new Function('return (' + READ + ')()'))(), READ.toString());
  const q1 = await fr.evaluate(() => ({ card: !!document.getElementById('roadcard'), sp: TRAVEL_SPEED, travel: !!TRAVEL, last: TRAVEL_SPEED_LAST }));
  ok('C5 a road event that asks, on a 4x march: the picture stops dead', !!ev && C5 && !C5.noup && C5.slide < 0.02, C5 && !C5.noup ? 'slid ' + C5.slide.toFixed(3) + ' block (' + ev.id + ')' : 'no card');
  ok('Q1 the event that asks stops the map while it stands', !!m1 && !m1.fail && q1.card && q1.sp === 0 && q1.travel && q1.last === 4, JSON.stringify(q1) + (m1 && m1.fail ? ' march failed ' + JSON.stringify(m1) : ''));
  const before = await fr.evaluate(() => [city.x, city.y]);
  await fr.evaluate(() => { const b = document.querySelector('#roadcard [data-road="0"]'); if (b) b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true })); });
  await page.waitForTimeout(250);
  const q2a = await fr.evaluate(() => ({ card: !!document.getElementById('roadcard'), sp: TRAVEL_SPEED, travel: !!TRAVEL, quiet: window.__ROADEV_QUIET || null }));
  await page.waitForTimeout(700);
  const after = await fr.evaluate(() => [city.x, city.y]);
  ok('Q2 his choice: no second card, and the march goes on at the 4x he had', !q2a.card && q2a.sp === 4 && q2a.travel && (after[0] !== before[0] || after[1] !== before[1]), 'card ' + q2a.card + ', speed ' + q2a.sp + ', moved ' + before + ' -> ' + after);
  const posts = await fr.evaluate(() => { try { return BohemiaPhone.P.posts().slice(-8); } catch (e) { return []; } });
  const said = posts.filter(p => p.who === '@theroad');
  ok('Q3 the answer is a post on the phone\'s feed, @theroad, the speaker\'s name', said.length > 0 && !!q2a.quiet && said.some(p => q2a.quiet.post && p.txt === q2a.quiet.post && (!ev.name || p.txt.toUpperCase().indexOf(String(ev.name).toUpperCase().slice(0, 6)) >= 0)),
     said.length ? said[said.length - 1].who + ' "' + said[said.length - 1].txt.slice(0, 90) + '"' : 'no @theroad post among ' + posts.length);
  /* Q4, Q5: a card with nothing to decide */
  const quietCard = (fr) => fr.evaluate(() => { const i0 = window.__TRAVEL_INTERRUPT ? window.__TRAVEL_INTERRUPT.at : 0, me = [city.x, city.y];
    BohemiaRoadEvents.card({ quiet: true, name: 'THE GATE', text: 'Nothing to decide here.', head: 'ON THE ROAD', opts: [{ t: 'GO ON', fn: function () { BohemiaRoadEvents.close(); } }] });
    return { i0, me, card: !!document.getElementById('roadcard'), sp: TRAVEL_SPEED, travel: !!TRAVEL, stopped: !!(window.__TRAVEL_INTERRUPT && window.__TRAVEL_INTERRUPT.at > i0) }; });
  await clean(fr); await page.waitForTimeout(600); await march(fr, 4); await page.waitForTimeout(1500);
  const q4 = await quietCard(fr); await page.waitForTimeout(1500);
  const q4b = await fr.evaluate(() => ({ me: [city.x, city.y], sp: TRAVEL_SPEED, card: !!document.getElementById('roadcard') }));
  ok('Q4 a card with nothing to decide on a 4x march: no card, no stop, the speed and the march untouched', !q4.card && !q4.stopped && q4.sp === 4 && q4.travel && !q4b.card && q4b.sp === 4 && (q4b.me[0] !== q4.me[0] || q4b.me[1] !== q4.me[1]),
     'card ' + q4.card + ', stopped ' + q4.stopped + ', speed ' + q4.sp + ' -> ' + q4b.sp + ', moved ' + q4.me + ' -> ' + q4b.me);
  await fr.evaluate(() => { BohemiaRoadEvents.QUIET.on = false; });
  const q5 = await quietCard(fr);
  await fr.evaluate(() => { BohemiaRoadEvents.QUIET.on = true; try { BohemiaRoadEvents.close(false); } catch (e) {} });
  ok('Q5 MUTATION: the quiet card switched off, it stands and the map stops', q5.card && q5.sp === 0, 'card ' + q5.card + ', speed ' + q5.sp);

  /* ---- C6: the mutation, a contact on the march with the dead stop off ---- */
  await clean(fr); await page.waitForTimeout(600); await march(fr, 2); await page.waitForTimeout(2000);
  await fr.evaluate((SAMPLE) => { CONTACT_DEAD.on = false; (new Function('(' + SAMPLE + ')()'))();
    setTimeout(() => { meetWalk(() => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'gate:contact', label: 'A CREW', party: { count: 3, faction: 'brigands' }, roster: [{ arch: 'human' }, { arch: 'human' }, { arch: 'human' }], street: true }, null)); }, 120); }, SAMPLE.toString());
  await page.waitForTimeout(1900);
  const C6 = await fr.evaluate((READ) => { const r = (new Function('return (' + READ + ')()'))(); CONTACT_DEAD.on = true; return r; }, READ.toString());
  ok('C6 MUTATION: the dead stop off, the picture walks on under the card', C6 && !C6.noup && C6.slide > 0.2, C6 && !C6.noup ? 'slid ' + C6.slide.toFixed(3) + ' block' : 'no card');
  await clean(fr);

  /* ---- S1 to S3: the space bar, through both doors ---- */
  const sp = () => fr.evaluate(() => ({ sp: TRAVEL_SPEED, last: TRAVEL_SPEED_LAST, travel: !!TRAVEL, saved: (function () { try { return localStorage.getItem(TRAVEL_CLOCK.saveKey); } catch (e) { return null; } })() }));
  const doors = [['the shell', async () => { await page.evaluate(() => { try { document.activeElement && document.activeElement.blur(); } catch (e) {} document.body.focus(); }); }],
                 ['the map', async () => { await page.focus('#cityFrame').catch(() => {}); await fr.evaluate(() => { try { window.focus(); document.body.focus(); } catch (e) {} }); }]];
  const S = {};
  for (const [door, focus] of doors) {
    await clean(fr); await page.waitForTimeout(500);
    await fr.evaluate(() => { try { travelPick(2); } catch (e) {} });
    await march(fr, 2); await page.waitForTimeout(600); await focus();
    const s0 = await sp();
    await page.keyboard.down('Space'); await page.waitForTimeout(80); await page.keyboard.up('Space'); await page.waitForTimeout(250);
    const s1 = await sp();
    await page.keyboard.down('Space'); await page.waitForTimeout(80); await page.keyboard.up('Space'); await page.waitForTimeout(250);
    const s2 = await sp();
    await page.keyboard.down('Space'); await page.waitForTimeout(900);
    const h = await sp(); await page.waitForTimeout(400); const h2 = await sp();
    await page.keyboard.up('Space'); await page.waitForTimeout(250);
    const a = await sp();
    /* from PAUSE */
    await page.keyboard.down('Space'); await page.waitForTimeout(80); await page.keyboard.up('Space'); await page.waitForTimeout(250);
    const p0 = await sp();
    await page.keyboard.down('Space'); await page.waitForTimeout(900); const ph = await sp(); await page.keyboard.up('Space'); await page.waitForTimeout(250);
    const pa = await sp();
    S[door] = { s0, s1, s2, h, h2, a, p0, ph, pa };
  }
  for (const door of Object.keys(S)) { const s = S[door];
    ok('S1 (' + door + ') a tap pauses the march, another plays it at his speed', s.s0.sp === 2 && s.s1.sp === 0 && s.s2.sp === 2, [s.s0.sp, s.s1.sp, s.s2.sp].join(' -> '));
    ok('S2 (' + door + ') a hold runs 4x while held, let go and it is his 2x; his kept speed never moves', s.h.sp === 4 && s.h2.sp === 4 && s.a.sp === 2 && [s.h, s.h2, s.a].every(q => q.last === 2) && s.a.saved === s.s0.saved,
       'held ' + s.h.sp + ', ' + s.h2.sp + ', let go ' + s.a.sp + '; kept ' + [s.h.last, s.h2.last, s.a.last].join('/') + ', saved ' + s.s0.saved + ' -> ' + s.a.saved); }
  for (const door of Object.keys(S)) { const s = S[door];
    ok('S3 (' + door + ') a hold from PAUSE runs 4x while held and lets go to PAUSE', s.p0.sp === 0 && s.ph.sp === 4 && s.pa.sp === 0 && s.pa.last === 2, [s.p0.sp, s.ph.sp, s.pa.sp].join(' -> ') + ', kept ' + s.pa.last); }
  /* the chase last: what a real party leaves behind on the map never touches the legs above */
  /* ---- C1 to C4: a real chase ---- */
  let C = null, chased = null;
  for (let k = 0; k < 4 && !(C && !C.noup); k++) {
    await clean(fr); await page.waitForTimeout(1200);
    chased = await fr.evaluate(({ SAMPLE, k }) => { (new Function('(' + SAMPLE + ')()'))();
      const ps = partiesAll() || []; const cand = ps.map(p => ({ p, d: Math.max(Math.abs((p.at.x | 0) - city.x), Math.abs((p.at.y | 0) - city.y)) })).filter(o => o.d > 3).sort((a, b) => a.d - b.d);
      const pk = cand[k]; if (!pk) return null; const best = pk.p, tx = best.at.x | 0, ty = best.at.y | 0;
      let c = cityWalkable(tx, ty) ? [tx, ty] : null;
      if (!c) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(tx + a, ty + b)) { c = [tx + a, ty + b]; break; }
      if (!c) return null; PARTY_CHASE = best.id; PARTY_SEL = best.id; travelTo(0, 0, c); travelSpeedSet(2); TRAVEL_SPEED_LAST = 2;
      return { id: best.id, d: pk.d }; }, { SAMPLE: SAMPLE.toString(), k });
    if (!chased) continue;
    for (let i = 0; i < 120; i++) { await page.waitForTimeout(250); if (await fr.evaluate(() => !!MEET.up)) break; }
    await page.waitForTimeout(1700);
    C = await fr.evaluate((READ) => (new Function('return (' + READ + ')()'))(), READ.toString());
  }
  const up = C && !C.noup;
  ok('C1 a real chase: from the card, the picture moves under 0.02 of a block for 1.5 s', up && C.slide < 0.02, up ? 'slid ' + C.slide.toFixed(3) + ' block; it stood ' + C.lag.toFixed(2) + ' block short of the logic\'s block (' + (chased && chased.id) + ')' : 'no contact');
  const closeAt = await fr.evaluate(() => [CITY_GLIDE.px, CITY_GLIDE.py]);
  ok('C2 where the card came up is where it stands when the card closes', up && Math.max(Math.abs(closeAt[0] - C.pic[0]), Math.abs(closeAt[1] - C.pic[1])) < 1e-6, up ? 'up ' + C.pic.map(v => v.toFixed(3)) + ', closing ' + closeAt.map(v => v.toFixed(3)) : '');
  ok('C3 no snap at contact: no frame around the card goes faster than the march before it', up && C.around <= C.before * 1.25 + 0.02, up ? 'around ' + C.around.toFixed(3) + ', march ' + C.before.toFixed(3) + ' block per 60th of a second' : '');
  await fr.evaluate((SAMPLE) => { (new Function('(' + SAMPLE + ')()'))(); }, SAMPLE.toString());
  await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} });
  await page.waitForTimeout(1200);
  const fb = await fr.evaluate(() => { window.__PSon = false; const S = window.__PS || []; let mx = 0; for (let i = 1; i < S.length; i++) mx = Math.max(mx, Math.max(Math.abs(S[i].px - S[i - 1].px), Math.abs(S[i].py - S[i - 1].py)));
    return { mx, n: S.length, pic: [CITY_GLIDE.px, CITY_GLIDE.py], me: [city.x, city.y] }; });
  ok('C4 after FALL BACK the picture walks from where it stood, never a jump of a block', up && fb.n > 5 && fb.mx < 1, 'largest frame ' + fb.mx.toFixed(3) + ' block over ' + fb.n + ' frames');

  ok('S4 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
