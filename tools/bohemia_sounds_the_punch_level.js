/* THE PUNCH HEARD: THE LEVELS, THROUGH THE GAME'S OWN OUTPUT CHAIN (SOUNDS 11/3/26, ask line 266).
   The bullets' way (tools/bohemia_bullet_lands_level.js, its PAGE_LIB reused: MUS.audio's compressor and brickwall in a real
   Chromium's OfflineAudioContext): every voice of slices/fight_punch/ gets the gain that lands its loudest 100 ms at its MARK
   after the chain, never past the gain where the chain's own output would peak over -1 dBFS.
   THE MARKS sit against the fight that is already in: a bullet in a man -16.5 to -18, a man going down -13 to -14, the guns
   -20. A blow is the bullet's cousin (it lands where the eye is, -15); the air before it and the scuff of a miss sit well
   under it; the map and the phone sit under all of it and UNDER THE MAP'S MUSIC (rule: nothing loud on the map, ambience very
   low; measured 11/3 on the demo's real output: the map's music at its loudest 100 ms -24 dB, so a map sound marks -25 or under).
   Run after tools/bohemia_sounds_the_punch.py:  node tools/bohemia_sounds_the_punch_level.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const { PAGE_LIB, CAP } = require('./bohemia_bullet_lands_level.js');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'slices', 'fight_punch');
const MARK = {
  blunt: -15, blade: -16, swing: -22, scuff: -23, hurt_body: -14, down: -14, thud: -17, high: -22,
  metal_step: -22, servo: -25, machine_hit: -15, machine_fall: -14,
  road_stop: -26, boss_found: -25, they_come: -25, camp_make: -28, camp_break: -28,
  phone_tap: -30, phone_open: -29, phone_close: -30
};

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  await new Promise(r => srv.listen(0, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + srv.address().port + '/slices/fight_punch/manifest.json');
  await page.addScriptTag({ content: PAGE_LIB });
  const r = await page.evaluate(async ({ MARK, CAP }) => {
    const man = await (await fetch('/slices/fight_punch/manifest.json')).json();
    const buf = await dec('/slices/fight_punch/' + man.file);
    async function find(takes, mark) {
      const pkAt = async (db) => peakOf(() => voiceDb(buf, takes, db, false));
      let ceil = CAP;
      if ((await pkAt(CAP)) > -1.0) { let a = -40, b = CAP; for (let i = 0; i < 12; i++) { const m = (a + b) / 2; if ((await pkAt(m)) > -1.0) b = m; else a = m; } ceil = a; }
      const top = await voiceDb(buf, takes, ceil, false);
      if (top < mark) return { db: +ceil.toFixed(2), capped: ceil < CAP ? 'peak' : 'gain', heard: +top.toFixed(2), peak: +(await pkAt(ceil)).toFixed(2) };
      let lo = -40, hi = ceil;
      for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if ((await voiceDb(buf, takes, mid, false)) < mark) lo = mid; else hi = mid; }
      const db = (lo + hi) / 2;
      return { db: +db.toFixed(2), heard: +(await voiceDb(buf, takes, db, false)).toFixed(2), peak: +(await pkAt(db)).toFixed(2) };
    }
    const out = {};
    for (const name of Object.keys(man.voices)) {
      const takes = man.voices[name].takes.map(t => [t.at_s, t.dur_s]);
      out[name] = Object.assign({ takes: takes, mark: MARK[name] }, await find(takes, MARK[name]));
      out[name].far = +(await voiceDb(buf, takes, out[name].db - 4, true)).toFixed(2);
    }
    return out;
  }, { MARK, CAP });
  await browser.close(); srv.close();
  const man = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
  const idx = { _readme: 'THE PUNCH HEARD, WHAT THE GAME READS (SOUNDS 11/3/26): the sprite, every voice\'s takes as [at, dur] seconds in it, and the gain (db) that lands each at its mark after the game\'s own compressor and brickwall (tools/bohemia_sounds_the_punch_level.js).',
    made: '11/3/26', file: man.file, chain: 'MUS.audio: compressor -14 dB 6:1 knee 8 2 ms/120 ms, brickwall -5 dB 20:1 1 ms/80 ms', far_db: -4, far_lp_hz: 5200, voices: {} };
  for (const [n, v] of Object.entries(r)) idx.voices[n] = { db: v.db, mark: v.mark, heard: v.heard, far: v.far, peak: v.peak, capped: v.capped || undefined, takes: v.takes };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(idx, null, 0).replace(/\],"/g, '],\n"').replace(/\},"/g, '},\n"'));
  for (const [n, v] of Object.entries(r)) console.log('  ' + n.padEnd(13) + (v.db >= 0 ? '+' : '') + v.db.toFixed(1).padStart(5) + ' dB -> ' + v.heard.toFixed(1) + ' (mark ' + v.mark + ', peak ' + v.peak + ')' + (v.capped ? ' CAPPED by ' + v.capped : ''));
})().catch(e => { console.error(e); process.exit(1); });
