/* THE CREW SCREEN SHOWS THEIR CAMP WHERE THEY STAND  (UI [the crew screen shows their camp where they stand], rule 239, 10/26/26;
   Paolo 10/26: 'anytime you're in the character menu, you press the C button, the background is all black, but what I really want
   is, depending on the opacity, your crew with their camp in the background, at whatever tile they're currently on... in a
   settlement the same settlement, in the street or anywhere in the desert the tile they're on')

   MEASURED BEFORE (the demo at 3e2a2178): behind every card, slot and word of the crew screen was one flat colour, #120e0a, over
   the crew door's own #120e0a: on the glass, the open part of the screen had a spread of 0 (one colour, black).

   On the demo, the company screen through the bar's CREW, phone and computer, 239(d):
     W1 on the map on a street by day: their camp (COOK FOUR's camp picture, the day one) with his men round the fire, drawn
     W2 on the map in the desert by night: the camp's night picture, his men round the fire
     W3 in a town by day, W4 in a town by night: the town's own picture behind the screen
     G  (each of W1 to W4) never black: on the glass (the screenshot), the open part of the screen shows a picture (a spread of
        light, not one flat colour)
     C  (each) every word that sits on the picture (not on its own paper, tin or button) keeps 4.5 to 1 against the brightest and
        the darkest tenth of the pixels behind it, read off the drawn picture
     M  the picture costs one screen-sized canvas (under 8 MB of pixels: a phone's line is about 1.1 GB, rule 173)
     T  the screen opens no slower: click to the screen drawn, three opens with the camp and three without, the median within a
        tenth and 60 ms; and the camp draws after the screen's first frame
   PLANTED: (G) the camp switched off, the glass behind the screen is one flat colour and G reads it black; (C) the dim taken off,
   the words on the bright camp fall under the floor and C catches it.
   node gates/the_crew_screen_shows_their_camp_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const FLOOR = 4.5, DESERT = ['desert', 'wash', 'mountain', 'basin', 'quarry'], STREETS = ['arterial', 'suburb', 'commercial', 'strip', 'downtown', 'apartment', 'resort'];

/* in the crew screen: the camp as drawn, and every word on it measured off the drawn picture (the gate's own sums) */
const READ = () => {
  const c = document.getElementById('campbg'), C = BohemiaRosterScreen.camp;
  if (!c) return null;
  const x = c.getContext('2d'), d = C.dpr || 1;
  const lum = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const words = BohemiaRosterScreen.campWords().map(e => { const r = e.getBoundingClientRect();
    const L = Math.max(0, Math.floor(r.left * d)), T = Math.max(0, Math.floor(r.top * d)), W = Math.min(c.width - L, Math.ceil(r.width * d)), H = Math.min(c.height - T, Math.ceil(r.height * d));
    const px = x.getImageData(L, T, Math.max(1, W), Math.max(1, H)).data, ls = [];
    for (let i = 0; i < px.length; i += 4) ls.push(lum(px[i], px[i + 1], px[i + 2]));
    ls.sort((a, b) => a - b);
    const ink = (getComputedStyle(e).color.match(/[\d.]+/g) || [0, 0, 0]).map(Number), il = lum(ink[0], ink[1], ink[2]);
    const worst = Math.min(ratio(il, ls[Math.floor(ls.length * 0.1)]), ratio(il, ls[Math.min(ls.length - 1, Math.floor(ls.length * 0.9))]));
    return { word: e.textContent.trim().slice(0, 30), worst: Math.round(worst * 100) / 100 }; });
  return { kind: c.dataset.kind, src: c.dataset.src || '', ground: c.dataset.ground || '', night: c.dataset.night, men: +(c.dataset.men || 0), crew: BohemiaRosterScreen.state.crew.filter(m => m && !m.dead && m.look).length,
    dim: C.dim, words, bytes: c.width * c.height * 4, spot: C.spot, t: C.t, live: C.live, drawnAfter: C.t.drawn >= C.t.ready };
};
/* the glass: every bare point of the screen (nothing of the screen's own painted there: no card, slot, paper, button or word),
   read off the screenshot; its spread of light (one flat colour has none) */
const BARE = () => { const out = [], step = 12;
  const painted = e => { for (let n = e; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    if (/^(IMG|CANVAS|BUTTON|INPUT)$/.test(n.tagName)) return true; const cs = getComputedStyle(n);
    if (cs.backgroundImage !== 'none') return true; const m = cs.backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0)) return true;
    if (n.children.length === 0 && n.textContent.trim()) return true; } return false; };
  /* where this screen sits on the page (its frames' offsets), so a point can be read off the page's own screenshot */
  let ox = 0, oy = 0; try { for (let w = window; w.frameElement; w = w.parent) { const r = w.frameElement.getBoundingClientRect(); ox += r.left; oy += r.top; } } catch (_e) {}
  for (let y = step / 2; y < innerHeight; y += step) for (let x = step / 2; x < innerWidth; x += step) { const e = document.elementFromPoint(x, y); if (!e || !painted(e)) out.push([x + ox, y + oy]); }
  return out; };
/* on the page: only the points where nothing of any screen ABOVE the crew screen (the one phone, a bar) lies over it */
const UNCOVERED = (pts) => pts.filter(([x, y]) => { let doc = document, X = x, Y = y;
  for (let i = 0; i < 6; i++) { const e = doc.elementFromPoint(X, Y); if (!e || e.tagName !== 'IFRAME') return false; const r = e.getBoundingClientRect(); X -= r.left; Y -= r.top;
    let d2 = null; try { d2 = e.contentDocument; } catch (_e) {} if (!d2) return false; if (/ROSTER_SCREEN/.test(d2.location.href)) return true; doc = d2; }
  return false; });
async function glass(p, pts) {
  pts = await p.evaluate('(' + UNCOVERED + ')(' + JSON.stringify(pts) + ')');
  const b64 = (await p.screenshot()).toString('base64');
  return p.evaluate(async ([b64, pts]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const k = im.width / innerWidth, c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, im.width, im.height).data; let n = 0, m = 0, q = 0;
    for (const [px, py] of pts) { const i = (Math.min(im.height - 1, Math.round(py * k)) * im.width + Math.min(im.width - 1, Math.round(px * k))) * 4; const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; m += l; q += l * l; }
    if (!n) return { mean: 0, spread: 0, points: 0 };
    m /= n; return { mean: Math.round(m * 10) / 10, spread: Math.round(Math.sqrt(Math.max(0, q / n - m * m)) * 10) / 10, points: n }; }, [b64, pts]);
}

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr;
  /* the crew screen opened by THIS click (a screen left open in a town is somebody else's) */
  const crewFrame = async (at, want) => { for (let t = 0; t < 60; t++) { for (const f of p.frames().filter(f => /ROSTER_SCREEN/.test(f.url())))
      if (await f.evaluate(([at, want]) => { const R = window.BohemiaRosterScreen; return !!R && !!R.camp && R.camp.t.ready >= at && (want !== 'drawn' || !!R.camp.t.drawn); }, [at, want]).catch(() => false)) return f;
      await p.waitForTimeout(250); } return null; };
  const click = () => fr.evaluate(() => { const at = performance.timeOrigin + performance.now(); document.querySelector('#bmtb .t.crew').click(); return at; });
  const openCrew = async () => { const at = await click(); return { cf: await crewFrame(at, 'drawn'), at }; };
  const closeCrew = async () => { for (const f of p.frames()) await f.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (_e) {} }).catch(() => {}); await p.waitForTimeout(500); };
  const closeTown = async () => { const sf = p.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url())); if (sf) await sf.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(1500); };
  const place = (where) => fr.evaluate(([kinds, night]) => { let best = null, bd = 1e9;
    for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) { const k = __CITY.district(x, y); if (kinds.indexOf(k) < 0) continue; const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd < bd) { bd = dd; best = [x, y]; } }
    if (best) { city.x = best[0]; city.y = best[1]; } T.min = night ? 22 * 60 : 12 * 60; try { __CITY.rerender(); } catch (_e) {} return best; }, where);
  const scene = async (label, check) => {
    const { cf } = await openCrew();
    if (!cf) { ok(label + ': the company screen opened with its camp', false); return null; }
    await p.waitForTimeout(900);   /* the fade in (an eighth at 120) and a beat of the men */
    let r = await cf.evaluate('(' + READ + ')()');
    for (let i = 0; i < 12 && r && r.men < r.crew && /^camp-/.test(r.kind); i++) { await p.waitForTimeout(500); r = await cf.evaluate('(' + READ + ')()'); }   /* his men's sheets come in on first sight */
    if (!r) { ok(label + ': a camp behind the screen', false, 'no picture'); await closeCrew(); return null; }
    const g = await glass(p, await cf.evaluate('(' + BARE + ')()'));
    ok(label + ': ' + check.say, check.test(r), 'kind ' + r.kind + (r.ground ? ', ground ' + r.ground : '') + ', night ' + r.night + ', men ' + r.men + ' of ' + r.crew + (r.src ? ', ' + r.src : ''));
    ok(label + ': G never black on the glass (the bare part of the screen shows a picture)', g.points >= 20 && g.spread >= 4 && g.mean >= 6, g.points + ' bare points, spread ' + g.spread + ', mean ' + g.mean);
    const short = r.words.filter(w => w.worst < FLOOR);
    ok(label + ': C every word on the picture at 4.5 to 1 or better', r.words.length >= 1 && short.length === 0, r.words.length + ' words, worst ' + Math.min(...r.words.map(w => w.worst)) + ', dim ' + r.dim + (short.length ? ', short: ' + short.map(w => w.word + ' ' + w.worst).join('; ') : ''));
    r.cf = cf; return r;
  };
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(1500);
    /* W1: the map, a street, by day */
    await place([STREETS, false]);
    const w1 = await scene('W1 ' + profile + ' map, street, day', { say: 'their camp by day with his men round the fire',
      test: r => /^camp-\d$/.test(r.kind) && r.night === '0' && STREETS.indexOf(r.ground) >= 0 && r.men >= Math.min(3, r.crew) && r.men > 0 });
    if (w1) {
      ok('M ' + profile + ': one screen-sized canvas, under 8 MB of pixels', w1.bytes < 8e6, (w1.bytes / 1e6).toFixed(1) + ' MB');
      ok('T ' + profile + ': the camp is drawn after the screen\'s first frame', w1.drawnAfter && w1.t.cost < 400, 'ready ' + w1.t.ready + ', drawn ' + w1.t.drawn + ', its own work ' + Math.round(w1.t.cost) + ' ms');
      if (profile === 'phone_portrait') {
        await w1.cf.evaluate(() => { BohemiaRosterScreen.camp.__keep = BohemiaRosterScreen.camp.dim; BohemiaRosterScreen.camp.dim = 0; }); await p.waitForTimeout(1200);
        const pl = await w1.cf.evaluate('(' + READ + ')()');
        ok('PLANTED: the dim taken off, C catches a word under the floor', pl.words.some(w => w.worst < FLOOR), pl.words.map(w => w.word + ' ' + w.worst).join('; '));
        await w1.cf.evaluate(() => { BohemiaRosterScreen.camp.dim = BohemiaRosterScreen.camp.__keep; });
      }
    }
    await closeCrew();
    /* W2: the map, the desert, by night */
    await place([DESERT, true]);
    await scene('W2 ' + profile + ' map, desert, night', { say: 'their camp\'s night picture with his men round the fire',
      test: r => /^camp-\d-night$/.test(r.kind) && r.night === '1' && DESERT.indexOf(r.ground) >= 0 && r.men > 0 });
    await closeCrew();
    /* W3, W4: a town by day and by night */
    for (const night of [false, true]) {
      await place([STREETS, night]);
      const town = await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 30); if (t) { loopOpenTown(t); return t.name || true; } return null; });
      await p.waitForTimeout(7000);
      if (!town) { ok((night ? 'W4 ' : 'W3 ') + profile + ': a town to open', false); continue; }
      await scene((night ? 'W4 ' : 'W3 ') + profile + ' town, ' + (night ? 'night' : 'day'), { say: 'the town\'s own picture behind the screen',
        test: r => (r.kind === 'town' || r.kind === 'camp') && r.live === true && r.night === (night ? '1' : '0') });
      await closeCrew(); await closeTown();
    }
    /* T: the open time with the camp and without (the map, by day) */
    await place([STREETS, false]);
    const times = { on: [], off: [] }; let flat = null;
    for (let k = 0; k < 6; k++) {
      const off = k % 2 === 1;
      await fr.evaluate(o => { window.__CAMPBG_OFF = o; }, off);
      const at = await click();
      const cf = await crewFrame(at, 'ready');
      if (cf) { const ready = await cf.evaluate(() => BohemiaRosterScreen.camp.t.ready); times[off ? 'off' : 'on'].push(ready - at);
        if (off && !flat) { await p.waitForTimeout(900); flat = await glass(p, await cf.evaluate('(' + BARE + ')()')); flat.has = await cf.evaluate(() => !!document.getElementById('campbg')); } }
      await closeCrew();
    }
    await fr.evaluate(() => { window.__CAMPBG_OFF = false; });
    const med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
    ok('T ' + profile + ': the screen opens no slower with the camp (median of three)', times.on.length === 3 && times.off.length === 3 && med(times.on) <= med(times.off) * 1.1 + 60,
      'with ' + times.on.map(Math.round).join('/') + ' ms, without ' + times.off.map(Math.round).join('/') + ' ms');
    if (profile === 'phone_portrait')
      ok('PLANTED: the camp switched off, G reads the glass black (one flat colour)', !!flat && !flat.has && flat.points >= 20 && flat.spread < 4, flat ? flat.points + ' bare points, spread ' + flat.spread + ', mean ' + flat.mean : 'not read');
  } catch (e) { ok('the gate ran on ' + profile, false, String(e.message).slice(0, 200)); }
  finally { try { await d.browser.close(); } catch (_e) {} try { d.server && d.server.close(); } catch (_e) {} }
}

(async () => {
  await side('phone_portrait');
  await side('computer');
  console.log('\nTHE CREW SCREEN SHOWS THEIR CAMP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
