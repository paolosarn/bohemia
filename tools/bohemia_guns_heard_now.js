/* THE GUNS HEARD: WHAT PLAYS NOW, MEASURED (SOUNDS, 10/19/26, row [the guns heard]).
   Renders every candidate the alpha's playSFX draws from for the fight's events (slices/vote/guns_heard/fight_now.json,
   read out of the alpha by tools/bohemia_guns_heard.py) through the real engine (engine/bohemia_sfx.js, BOH_SFX.cook(ev, 5)[i]
   and BOH_SFX.render) in a real Chromium's OfflineAudioContext, and writes how loud each is on the same ruler the gun tool
   uses (the rms of the loudest 100 ms, and the peak): slices/vote/guns_heard/now_measured.json. The VOTE page reads it so the
   new guns play exactly as loud as the shot the game plays today (a fair A/B), never louder to win.
   Run: node tools/bohemia_guns_heard_now.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const ROOT = path.dirname(__dirname);
const PORT = 8894;
const OUT = path.join(ROOT, 'slices', 'vote', 'guns_heard', 'now_measured.json');

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : 'text/html');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + PORT + '/slices/vote/guns_heard/manifest.json');
  await page.addScriptTag({ url: 'http://127.0.0.1:' + PORT + '/engine/bohemia_sfx.js' });
  const now = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', 'vote', 'guns_heard', 'fight_now.json'), 'utf8'));
  const res = await page.evaluate(async (pools) => {
    const SR = 44100, out = {};
    function loud(d) {
      const w = Math.round(0.1 * SR), st = Math.round(0.01 * SR); let best = 0, pk = 0;
      for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i]));
      for (let i = 0; i + w <= d.length; i += st) { let s = 0; for (let j = i; j < i + w; j++) s += d[j] * d[j]; best = Math.max(best, Math.sqrt(s / w)); }
      return { loud_100ms_db: 20 * Math.log10(best + 1e-12), peak_db: 20 * Math.log10(pk + 1e-12) };
    }
    for (const ev of Object.keys(pools)) {
      out[ev] = [];
      for (const [e, i] of pools[ev]) {
        const v = BOH_SFX.cook(e, 5)[i];
        const sec = Math.min(4, BOH_SFX.durSec(v) + 1.0);
        const AC = new OfflineAudioContext(1, Math.round(sec * SR), SR);
        BOH_SFX.render(v, AC, AC.destination, 0.01);
        const buf = await AC.startRendering();
        const m = loud(buf.getChannelData(0));
        out[ev].push({ cand: e + '.' + i, loud_100ms_db: +m.loud_100ms_db.toFixed(2), peak_db: +m.peak_db.toFixed(2), seconds: +sec.toFixed(3) });
      }
    }
    return out;
  }, now.pools);
  await browser.close(); srv.close();
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  const shot = res.shot || [];
  const doc = {
    _readme: 'WHAT PLAYS NOW, MEASURED (SOUNDS 10/19/26): every candidate in the alpha\'s pools for the fight\'s events, rendered by engine/bohemia_sfx.js in a real Chromium OfflineAudioContext (no vary, no master limiter), measured as the rms of its loudest 100 ms. The VOTE page plays the new guns at shot_loud_100ms_db, the mean of the shot pool, so A, B and C are equally loud. tools/bohemia_guns_heard_now.js.',
    made: '10/19/26', shot_loud_100ms_db: +mean(shot.map(c => c.loud_100ms_db)).toFixed(2), events: res };
  fs.writeFileSync(OUT, JSON.stringify(doc, null, 1));
  console.log('the shot today: ' + doc.shot_loud_100ms_db + ' dB (100 ms rms, mean of ' + shot.length + ')');
  for (const ev of Object.keys(res)) console.log('  ' + ev.padEnd(12) + res[ev].map(c => c.cand + ' ' + c.loud_100ms_db + '/' + c.peak_db).join('  ') || '(silent)');
})().catch(e => { console.error(e); srv.close(); process.exit(1); });
