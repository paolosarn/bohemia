#!/usr/bin/env node
/* THE MENU HEARS ONLY ITS FEED, AND THE HOURS WHISPER (FIXES, VAMILY rule 361, ask line 385; Paolo 11/3: 'that day speed sound
   effect playing on the loading menu... vibe killer... very loud even in the regular game... it should not be anywhere near the
   loading menus... the volume has to go really down').
   MEASURED before: on the demo's start screen, 20 s with no tap, the game behind the menu struck the hours twelve times (time_pass,
   strikeHours: the map's first clock report after the load read as a jump), laid the map's desert bed and fired the map's ambience;
   in play the same strike is the day's speed sound (the clock reports every 4 s and an hour of travel passes in 2.3 s, so it struck
   7 times in 10 s at the regular speed and 21 at four times), as loud as any effect.
   Legs, on his phone's profile (390 x 844, touch), the demo served from disk, every sound the page starts hooked at the source:
   1. *** THE START SCREEN HEARS ONLY ITS FEED ***: 20 s with no tap, then a real touch on the title and 20 s more: every sound started
      in the page and its frames is the camera feed's own (slices/crashbox/feed_*.mp3), nothing of the game behind it.
   2. *** THE HOURS WHISPER ***: each of his approved time_pass strikes, rendered offline through the strike's own bus at the game's
      level (window.__TIME_PASS_LEVEL), peaks at or under CEILING, and at most a fifth of the same strike unscaled.
   3. THE WIRES: playSFX, the hour strike, the desert bed and the ambience each ask the one test (window.__FRONT_QUIET) first; the
      strike goes through its own bus at TIME_PASS_LEVEL.
   Run: node gates/the_menu_hears_only_its_feed_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..'), PORT = 8879, CEILING = 0.06;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp',
  '.mp3': 'audio/mpeg', '.glb': 'model/gltf-binary', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.wav': 'audio/wav', '.ogg': 'audio/ogg' };
let pass = 0, fail = 0;
const ok = (what, c, why) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const HOOK = `(() => { const W = window; if (W.__SND) return; const T0 = performance.now(); W.__SND = [];
  const where = () => (location.pathname.split('/').pop() || '').slice(0, 40);
  const tag = new WeakMap(), urlOf = new WeakMap();
  const of = W.fetch; if (of) W.fetch = function (u) { const url = String(u && u.url || u); return of.apply(this, arguments).then(r => { const ab = r.arrayBuffer.bind(r); r.arrayBuffer = () => ab().then(b => { try { urlOf.set(b, url); } catch (e) {} return b; }); return r; }); };
  const AC = W.AudioContext || W.webkitAudioContext; if (!AC) return; const BAC = W.BaseAudioContext || AC; const dd = BAC.prototype.decodeAudioData;
  BAC.prototype.decodeAudioData = function (ab, a, b) { const u = urlOf.get(ab) || '(made)'; const p = dd.call(this, ab, x => { try { tag.set(x, u); } catch (e) {} a && a(x); }, b); if (p && p.then) p.then(x => { try { tag.set(x, u); } catch (e) {} }); return p; };
  const live = (n) => !(n.context && W.OfflineAudioContext && n.context instanceof W.OfflineAudioContext);
  const bs = AudioBufferSourceNode.prototype.start; AudioBufferSourceNode.prototype.start = function () { try { if (live(this)) { const b = this.buffer; W.__SND.push({ t: Math.round(performance.now() - T0), f: where(), k: 'buf', u: b ? (tag.get(b) || '(synth ' + b.duration.toFixed(2) + 's)') : '?' }); } } catch (e) {} return bs.apply(this, arguments); };
  const os = OscillatorNode.prototype.start; OscillatorNode.prototype.start = function () { try { if (live(this)) W.__SND.push({ t: Math.round(performance.now() - T0), f: where(), k: 'osc', u: this.type + ' ' + Math.round(this.frequency.value) }); } catch (e) {} return os.apply(this, arguments); };
  const mp = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { try { W.__SND.push({ t: Math.round(performance.now() - T0), f: where(), k: 'media', u: (this.currentSrc || this.src || '') }); } catch (e) {} return mp.apply(this, arguments); };
})();`;
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f).toLowerCase()] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  await ctx.addInitScript({ content: HOOK });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  const grab = async () => { const out = []; for (const f of p.frames()) { try { (await f.evaluate(() => (window.__SND || []).splice(0))).forEach(x => out.push(x)); } catch (e) {} } return out; };
  try {
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 240000 });
    await p.waitForTimeout(20000);
    const quiet0 = await p.evaluate(() => typeof window.__FRONT_QUIET === 'function' && window.__FRONT_QUIET());
    const a = await grab();
    await p.touchscreen.tap(195, 300); await p.waitForTimeout(20000);   /* a real touch on the title, not a button */
    const c = await grab(), still = await p.evaluate(() => window.__FRONT_QUIET());
    const all = a.concat(c), feed = all.filter(x => x.k === 'buf' && /crashbox\/feed_[a-z]+\.mp3/.test(x.u)), other = all.filter(x => !(x.k === 'buf' && /crashbox\/feed_[a-z]+\.mp3/.test(x.u)));
    const say = (L) => { const o = {}; L.forEach(x => { const k = x.f + ' ' + x.k + ' ' + String(x.u).split('/').slice(-2).join('/'); o[k] = (o[k] | 0) + 1; }); return JSON.stringify(o); };
    ok('*** THE START SCREEN HEARS ONLY ITS FEED *** (40 s on the title, a real touch half way: ' + feed.length + ' feed sounds, ' + other.length + ' others)',
      quiet0 && still && !other.length, other.length ? say(other) : say(feed));
    /* 2: the strike through its own bus, offline */
    const hw = await p.evaluate(async () => {
      try {
        const set = (window.__SFX_APPROVED && window.__SFX_APPROVED.time_pass) || [], level = window.__TIME_PASS_LEVEL;
        if (!set.length || !(level > 0)) return { err: 'no approved strike or no level', n: set.length, level };
        const pool = BOH_SFX.cook('time_pass', 5), out = [];
        for (const i of set) {
          const v = pool[i] || pool[0], peakOf = async (g) => { const O = new OfflineAudioContext(1, 44100 * 3, 44100), gn = O.createGain(); gn.gain.value = g; gn.connect(O.destination);
            BOH_SFX.render(v, O, gn, 0.02); const buf = await O.startRendering(), d = buf.getChannelData(0); let m = 0; for (let k = 0; k < d.length; k++) { const x = Math.abs(d[k]); if (x > m) m = x; } return m; };
          out.push({ i, raw: +(await peakOf(1)).toFixed(4), heard: +(await peakOf(level)).toFixed(4) });
        }
        return { level, out };
      } catch (e) { return { err: String(e && e.message || e) }; }
    });
    const hb = !hw.out ? [] : hw.out.filter(x => !(x.heard <= CEILING && x.raw > 0 && x.heard <= x.raw / 5 + 1e-6));
    ok('*** THE HOURS WHISPER: every approved strike peaks at or under ' + CEILING + ' through its bus, a fifth of itself or less ***',
      !!hw.out && hw.out.length > 0 && !hb.length, hw.err || JSON.stringify(hw.out) + ' at level ' + hw.level);
  } catch (e) { ok('the start screen was heard', false, String(e && e.message || e).slice(0, 200)); }
  /* 3 */
  const A = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8'), D = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
  const wires = s => /window\.playSFX=function\(ev,when,mul\)\{\s*if\(window\.__FRONT_QUIET\(\)\)/.test(s) && /function strikeHours\(h\)\{[\s\S]{0,200}__FRONT_QUIET/.test(s)
    && /tick:function\(\)\{\s*if\(!this\.kind\) return;\s*if\(window\.__FRONT_QUIET/.test(s) && /var dest=TP_BUS;/.test(s) && /TP_BUS\.gain\.value=TIME_PASS_LEVEL/.test(s)
    && /if\(window\.__FRONT_QUIET && window\.__FRONT_QUIET\(\)\) return false;   \/\* __THE_MENU_HEARS_ONLY_ITS_FEED__ \*\//.test(s);
  ok('THE WIRES: the effects, the hour strike, the ambience and the desert bed ask the one test first; the strike has its own quiet bus (the workshop and the demo)', wires(A) && wires(D));
  ok('no page errors', !errs.length, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('=== THE MENU HEARS ONLY ITS FEED: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
