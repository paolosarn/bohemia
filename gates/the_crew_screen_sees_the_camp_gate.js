/* THE CREW SCREEN SEES THE CAMP  (UI 7, rule 369, 11/3/26)

   PAOLO 11/3: 'I'm tired of all that brown backdrop shit. I wanna see more of the camp, of the settlement, when you're in the crew
   screen... It's your people in the camp and... right now it's hard to see them. There's so much brown background gunk... especially
   in the crew menu, you click on a character, it centers the camera on that character, to make it that much more like walking around.'

   MEASURED BEFORE (the demo at a5e7eaa6, 390 x 844; records/target/coordinator_11_3/crew_screen_now.png): the camp was dimmed 0.62
   under four brown textured panels (the line, his card, the stats' paper, the stash); a tap on a man changed his card, never the camp.
   And made camp on the map after a town, the phone's CREW opened the screen inside the town's unseen frame: nothing on the glass.

   On the DEMO, through the one driver, with a finger, upright (390 x 844) and on its side (844 x 390); in a town (the demo opens in
   one) and at a camp made on the map:
     S1 THE CAMP IS SEEN AND LIT: off the phone, at least 40 percent of the glass shows the camp with nothing of the sheet painted over
        it; over those points the lamp's shade averages under 0.35 (it was 0.62 everywhere); where he stands it is 0 (lit); no panel of
        the sheet wears the kit's board or paper (his card, the title bar, the stats are see-through)
     S2 EVERY MAN OF THE COMPANY IS DRAWN IN IT (the town's own picture draws his men; at the camp the screen draws them round the fire)
     S3 A FINGER ON A MAN IN THE LINE GLIDES THE CAMERA TO HIM: a glide starts and ends inside a beat and a tenth (550 ms), and he lands
        in the open middle of his sheet (between his slot columns, inside the glass) within 14 points of where his figure's feet are,
        unless the picture's own edge holds the camera (then said, and he is still inside the middle)
     S4 A FINGER ON A MAN IN THE CAMP ITSELF picks him and the camera glides to him the same way
     S5 THE SHEET IS HIS: the phone's company face names the man picked
     S6 THE GLIDE FITS A 60 FPS FRAME: the camera's own paint during a glide (the town's copy, or the camp and his men) at the 90th
        percentile under 16.7 ms (this box has no phone's GPU and runs the whole game under the screen, so the game's frame count is said
        beside it, not judged), and no page error
     MAP CAMP C1: made camp on the map after a town, the phone's CREW opens the screen ON THE GLASS (its frame seen), over their camp
   PLANTED (upright, in the town): the brown put back (S1 catches it); a man left out of the camp's drawing (S2); the camera frozen (S3).
   node gates/the_crew_screen_sees_the_camp_gate.js [phone_portrait|phone_landscape] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { openCrew } = require(path.join(ROOT, 'tools/bohemia_open_the_crew.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const SEEN = 0.40, SHADE = 0.35, NEAR = 14, BEAT = 550;

/* in the crew screen: what of the glass is camp, and how lit; the panels' material */
const SIGHT = () => {
  const R = window.BohemiaRosterScreen, C = R.camp, step = 12, W = innerWidth, H = innerHeight;
  let ox = 0, oy = 0; try { for (let w = window; w.frameElement; w = w.parent) { const r = w.frameElement.getBoundingClientRect(); ox += r.left; oy += r.top; } } catch (_e) {}
  let ph = null; try { const q = window.top.document.querySelector('#bohphone.on'); if (q) { const r = q.getBoundingClientRect(); ph = [r.left - ox, r.top - oy, r.right - ox, r.bottom - oy]; } } catch (_e) {}
  const painted = e => { for (let n = e; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    if (n.id === 'campbg') return false;
    if (/^(IMG|CANVAS|BUTTON|INPUT)$/.test(n.tagName)) return getComputedStyle(n).visibility !== 'hidden';
    const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none') return true; const m = cs.backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0.05)) return true;
    if (n.children.length === 0 && n.textContent.trim()) return true; } return false; };
  let all = 0, bare = 0, shade = 0;
  for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
    if (ph && x >= ph[0] && x <= ph[2] && y >= ph[1] && y <= ph[3]) continue;
    all++; const e = document.elementFromPoint(x, y); if (e && painted(e)) continue; bare++; shade += R.campLampAt(x, y, C.dim, C.shadeTop); }
  const sp = R.campSpot(), here = sp ? R.campLampAt(sp.x, sp.y - 30, C.dim, C.shadeTop) : null;
  const kit = ['#card', '#bar', '.stats'].map(q => { const e = document.querySelector(q); if (!e) return null; const cs = getComputedStyle(e); return { q, img: cs.backgroundImage !== 'none' && /ui_kit|cardboard|receipt|board/.test(cs.backgroundImage), shown: cs.display !== 'none' }; }).filter(Boolean);
  const living = R.state.crew.filter(m => m && !m.dead && m.look).map(m => m.name);
  return { seen: all ? bare / all : 0, shade: bare ? shade / bare : 1, here, kit: kit.filter(k => k.img && k.shown).map(k => k.q), kind: C.kind, live: !!C.live, drawn: (C.drawn || []).slice(), living, dim: C.dim, top: C.shadeTop };
};
/* where he stands on the glass against his figure's feet; the middle of his sheet */
const WHERE = (name) => {
  const R = window.BohemiaRosterScreen, sp = R.campSpot(), q = R.campMenOnGlass().find(m => m.name === name), t = R.campTarget();
  const sl = [...document.querySelectorAll('#card .gslot')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0);
  const left = Math.max(0, ...sl.filter(r => r.right < innerWidth / 2 + 80 && r.left < (sp ? sp.x : 0)).map(r => r.right)), right = Math.min(innerWidth, ...sl.filter(r => r.left > (sp ? sp.x : 0)).map(r => r.left));
  const c = R.camp.c, im = R.camp.base, k = R.cam.k, d = R.camp.dpr || 1;
  const atEdge = !!(c && im) && (Math.abs(R.cam.ox) < 1 || Math.abs(R.cam.ox - (c.width - im.width * k)) < 1 || Math.abs(R.cam.oy) < 1 || Math.abs(R.cam.oy - (c.height - im.height * k)) < 1);
  return { sp: sp && [Math.round(sp.x), Math.round(sp.y)], at: q && [Math.round(q.x), Math.round(q.y)], dist: q && sp ? Math.round(Math.hypot(q.x - sp.x, q.y - sp.y)) : null,
    inMiddle: !!q && q.x > left && q.x < right && q.y > 0 && q.y < innerHeight, atEdge, glides: R.cam.glides, log: R.cam.log.slice(-1)[0] || null, raf: !!R.cam.raf, sel: (R.state.crew[R.state.sel] || {}).name };
};

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, PLANT = profile === 'phone_portrait';
  const rf = () => p.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
  const frameAt = async (f) => { const b = await (await f.frameElement()).boundingBox(); let x = b.x, y = b.y; return { x, y }; };
  const closeCrew = async () => { for (const f of p.frames()) await f.evaluate(() => { try { if (window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.close(); } catch (_e) {} }).catch(() => {}); await p.waitForTimeout(900); };
  const fps = (f) => f.evaluate(() => new Promise(r => { let n = 0, t0 = performance.now(); const s = () => { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(s); else r(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(s); }));
  /* the screen up and its camp drawn */
  const up = async () => { for (let i = 0; i < 40; i++) { const f = rf(); if (f && await f.evaluate(() => { const R = window.BohemiaRosterScreen; return !!R && !!R.camp.t.drawn && !!R.cam.k; }).catch(() => false)) return f; await p.waitForTimeout(250); } return null; };
  const legs = async (tag, f) => {
    await p.waitForTimeout(900);
    let s = await f.evaluate('(' + SIGHT + ')()');
    for (let i = 0; i < 16 && s.living.some(n => s.drawn.indexOf(n) < 0); i++) { await p.waitForTimeout(500); s = await f.evaluate('(' + SIGHT + ')()'); }   /* his men's sheets come in on first sight */
    ok(tag + ' S1 the camp is seen past ' + Math.round(SEEN * 100) + '% of the glass off the phone, lit (shade under ' + SHADE + '), lit where he stands, no board or paper panel', s.seen >= SEEN && s.shade < SHADE && s.here === 0 && s.kit.length === 0,
      Math.round(s.seen * 100) + '% seen, shade ' + s.shade.toFixed(2) + ', where he stands ' + s.here + ', panels ' + (s.kit.join(' ') || 'none') + ' (' + s.kind + ', lamp ' + s.dim + '/' + s.top + ')');
    const miss = s.living.filter(n => s.drawn.indexOf(n) < 0);
    ok(tag + ' S2 every man of the company is drawn in it', s.living.length > 0 && miss.length === 0, s.drawn.length + ' of ' + s.living.length + (miss.length ? ', missing ' + miss.join(' ') : '') + (s.live ? ' (the town draws them)' : ' (round the fire)'));
    /* S3: each man in the line, by a finger */
    const o = await frameAt(f), names = s.living;
    let worst = null, bad = [];
    for (const n of names.concat(names[0] ? [names[0]] : [])) {
      const at = await f.evaluate((n) => { const R = window.BohemiaRosterScreen, i = R.state.crew.findIndex(m => m.name === n); const c = document.querySelector('.cell[data-man="' + i + '"]'); if (!c) return null; const r = c.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, n);
      if (!at) { bad.push(n + ' not in the line on the glass'); continue; }
      const before = await f.evaluate(() => window.BohemiaRosterScreen.cam.glides);
      const was = await f.evaluate(() => (window.BohemiaRosterScreen.state.crew[window.BohemiaRosterScreen.state.sel] || {}).name);
      await p.touchscreen.tap(o.x + at[0], o.y + at[1]);
      await p.waitForTimeout(BEAT + 150);
      for (let i = 0; i < 15 && await f.evaluate(() => !!window.BohemiaRosterScreen.cam.raf); i++) await p.waitForTimeout(100);   /* landed (the time judged is the glide's own) */
      const w = await f.evaluate('(' + WHERE + ')(' + JSON.stringify(n) + ')');
      /* within a beat: the glide's own plan (450 ms) and the one frame the box drew late to land it (this box has no phone's GPU) */
      const glided = was === n || (w.glides > before && w.log && w.log.who === n && w.log.ms != null && w.log.plan <= 500 && w.log.ms - w.log.gap <= 500);
      const good = w.sel === n && glided && w.inMiddle && (w.dist <= NEAR || w.atEdge);
      if (!good) bad.push(n + ': picked ' + w.sel + ', glide ' + (w.log ? w.log.ms + ' ms (a frame ' + w.log.gap + ', after ' + w.log.wait + ' ms of his sheet)' : 'none') + ', at ' + w.at + ' vs ' + w.sp + (w.atEdge ? ' (edge)' : '') + (w.inMiddle ? '' : ' OUTSIDE THE MIDDLE'));
      if (!worst || (w.dist || 0) > (worst.dist || 0)) worst = Object.assign({ n }, w);
    }
    ok(tag + ' S3 a finger on each man in the line glides the camera to him inside a beat, him in the middle of his sheet', bad.length === 0 && names.length > 0,
      bad.length ? bad.join(' | ') : names.length + ' men, the farthest landed ' + (worst ? worst.dist + ' pt from his feet' + (worst.atEdge ? ' (the picture\'s edge)' : '') + ', glide ' + (worst.log ? worst.log.ms + ' ms, its latest frame ' + worst.log.gap + ' ms, his sheet first ' + worst.log.wait : '-') + ' ms' : '-'));
    /* S4: a finger on a man in the camp itself (picked from each man in turn until another of his stands on the open camp) */
    const settle = async () => { for (let i = 0; i < 20 && await f.evaluate(() => !!window.BohemiaRosterScreen.cam.raf); i++) await p.waitForTimeout(100); };
    const findT = async () => { await settle(); return f.evaluate(() => { const R = window.BohemiaRosterScreen, sel = (R.state.crew[R.state.sel] || {}).name;
      const painted = e => { for (let n = e; n && n !== document.body; n = n.parentElement) { if (/^(IMG|CANVAS|BUTTON|INPUT)$/.test(n.tagName)) return true; const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none') return true; const m = cs.backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0.05)) return true; if (n.children.length === 0 && n.textContent.trim()) return true; } return false; };
      let ph = null; try { const q = window.top.document.querySelector('#bohphone.on'); if (q) { const r = q.getBoundingClientRect(), fe = window.frameElement.getBoundingClientRect(); ph = [r.left - fe.left, r.top - fe.top, r.right - fe.left, r.bottom - fe.top]; } } catch (_e) {}
      for (const q of R.campMenOnGlass()) { if (q.name === sel) continue;
        for (const dy of [0.5, 0.35, 0.65, 0.2, 0.8]) for (const dx of [0, -6, 6]) { const x = q.x + dx, y = q.y - q.h * dy; if (x < 2 || y < 2 || x > innerWidth - 2 || y > innerHeight - 2) continue;
          if (ph && x >= ph[0] && x <= ph[2] && y >= ph[1] && y <= ph[3]) continue; const e = document.elementFromPoint(x, y); if (e && painted(e)) continue;
          if (!R.campTapOpen(x, y)) continue;   /* the sheet's own rows and slots keep their taps */
          const who = R.campManAtPoint(x, y); if (!who || who.name !== q.name) continue;   /* a point where the game picks HIM (another man's body not in front of him) */
          return { n: q.name, x, y }; } }
      return null; }); };
    let target = await findT();
    for (const n of names) { if (target) break; await f.evaluate((n) => { const R = window.BohemiaRosterScreen; R.choose(R.state.crew.findIndex(m => m.name === n)); }, n); await p.waitForTimeout(BEAT + 150); target = await findT(); }
    if (target) { const b4 = await f.evaluate(() => window.BohemiaRosterScreen.cam.glides);
      await p.touchscreen.tap(o.x + target.x, o.y + target.y); await p.waitForTimeout(BEAT + 150);
      const w = await f.evaluate('(' + WHERE + ')(' + JSON.stringify(target.n) + ')');
      ok(tag + ' S4 a finger on a man in the camp itself picks him and the camera glides to him', w.sel === target.n && w.glides > b4 && w.inMiddle && (w.dist <= NEAR || w.atEdge), target.n + ' tapped at ' + Math.round(target.x) + ',' + Math.round(target.y) + '; picked ' + w.sel + ', at ' + w.at + ' vs ' + w.sp + (w.atEdge ? ' (edge)' : '')); }
    else ok(tag + ' S4 a man of his on the open camp to tap', false, 'none on the glass clear of the sheet');
    /* S5 */
    const sel = await f.evaluate(() => (window.BohemiaRosterScreen.state.crew[window.BohemiaRosterScreen.state.sel] || {}).name), said = await p.evaluate(() => { const e = document.querySelector('#bohphone.on .crewp .cman b'); return e ? e.textContent.trim() : null; });
    ok(tag + ' S5 the phone\'s company face names the man picked', !!sel && said === sel, said + ' vs ' + sel);
    /* S6: what the camera costs a frame while it glides (its paint, the town's copy or the camp and his men), at 60 frames a second's
       budget: this box has no phone's GPU and runs the whole game under the screen, so its frame count is the game's, not the camera's */
    const cost = await f.evaluate(async () => { const R = window.BohemiaRosterScreen, o = R.order(), all = [];
      for (let k = 0; k < 4; k++) { R.choose(o[(o.indexOf(R.state.sel) + 1) % o.length]); await new Promise(r => setTimeout(r, 900)); const row = R.cam.log.slice(-1)[0]; if (row && row.paint) all.push(...row.paint); }
      all.sort((a, b) => a - b); return { n: all.length, med: all[all.length >> 1], p90: all[Math.floor(all.length * 0.9)], max: all[all.length - 1] }; });
    const still = await fps(f);
    ok(tag + ' S6 the glide fits a 60 fps frame: the camera\'s paint under 16.7 ms at the 90th percentile', cost.n >= 4 && cost.p90 <= 16.7,
      cost.n + ' frames painted, median ' + cost.med + ' ms, 90th ' + cost.p90 + ', worst ' + cost.max + ' (the whole game here: ' + Math.round(still) + ' fps standing)');
    return s;
  };
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(2500);
    /* THE TOWN */
    const inTown = await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display !== 'none'; });
    if (!inTown) { await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 30); if (t) loopOpenTown(t); }); await p.waitForTimeout(7000); }
    await openCrew(p, fr); let f = await up();
    if (f) {
      await legs('TOWN', f);
      if (PLANT) {
        await f.evaluate(() => document.documentElement.classList.remove('bm-camp-live')); await p.waitForTimeout(300);
        const pb = await f.evaluate('(' + SIGHT + ')()'); await f.evaluate(() => document.documentElement.classList.add('bm-camp-live'));
        ok('PLANTED: the brown put back is caught (S1)', pb.seen < SEEN || pb.kit.length > 0, Math.round(pb.seen * 100) + '% seen, panels ' + pb.kit.join(' '));
        const pm = await f.evaluate((SIGHTs) => { const C = window.BohemiaRosterScreen.camp, keep = C.drawn; C.drawn = keep.slice(1); const s = eval('(' + SIGHTs + ')')(); C.drawn = keep; return s; }, SIGHT.toString());
        ok('PLANTED: a man left out of the camp\'s drawing is caught (S2)', pm.living.some(n => pm.drawn.indexOf(n) < 0));
        const pz = await f.evaluate(async () => { const R = window.BohemiaRosterScreen, o = R.order(), nx = o[(o.indexOf(R.state.sel) + 1) % o.length], c = R.cam, keep = { k: c.k, ox: c.ox, oy: c.oy };
          R.choose(nx); cancelAnimationFrame(c.raf); c.raf = 0; c.k = keep.k; c.ox = keep.ox; c.oy = keep.oy; await new Promise(r => setTimeout(r, 300));
          const sp = R.campSpot(), q = R.campMenOnGlass().find(m => m.name === R.state.crew[nx].name); return q && sp ? Math.round(Math.hypot(q.x - sp.x, q.y - sp.y)) : null; });
        ok('PLANTED: the camera frozen is caught (S3: he is not under his feet)', pz == null || pz > NEAR, pz + ' pt off');
      }
      await closeCrew();
    } else ok('TOWN the crew screen opened with the town under it', false);
    /* THE CAMP ON THE MAP, after the town */
    const sf = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
    if (sf) await sf.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {});
    await p.waitForTimeout(4000);
    await fr.evaluate(() => { try { if (!BohemiaMapCamp.on()) BohemiaMapCamp.toggle(); } catch (_e) {} }); await p.waitForTimeout(5000);
    await openCrew(p, fr); f = await up();
    const seenFrame = f ? await p.evaluate(() => { let best = null; const look = (d, ox, oy) => { d.querySelectorAll('iframe').forEach(fe => { const r = fe.getBoundingClientRect(), cs = getComputedStyle(fe); let w = null; try { w = fe.contentWindow; } catch (_e) {}
        if (/ROSTER_SCREEN/.test(fe.src || '')) best = { op: +cs.opacity, w: r.width, chain: true };
        try { if (w && w.document && +cs.opacity > 0.05 && cs.display !== 'none') look(w.document, ox + r.left, oy + r.top); } catch (_e) {} }); };
      look(document, 0, 0); return best; }) : null;
    ok('MAP CAMP C1 the phone\'s CREW opens the company screen on the glass over their camp (not inside an unseen town)', !!f && !!seenFrame && seenFrame.w > 0, seenFrame ? JSON.stringify(seenFrame) : 'not on the glass');
    if (f) { const s = await legs('MAP CAMP', f); ok('MAP CAMP the camp under the screen is their camp where the party stands', /^camp-/.test(s.kind), s.kind); await closeCrew(); }
    ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  const only = process.argv[2];
  for (const pr of ['phone_portrait', 'phone_landscape']) if (!only || only === pr) await side(pr);
  console.log('\nTHE CREW SCREEN SEES THE CAMP: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
