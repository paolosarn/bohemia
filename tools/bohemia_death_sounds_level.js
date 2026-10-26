/* DEATH SOUNDS THAT TERRIFY: THE LEVELS, MEASURED THROUGH THE GAME'S OWN OUTPUT CHAIN (SOUNDS, 10/26/26, row [death sounds
   that terrify], rule 235). REUSE-FIRST: the bullets' ruler (tools/bohemia_bullet_lands_level.js PAGE_LIB: the game's compressor
   and brickwall, MUS.audio's numbers, in a real Chromium's OfflineAudioContext), its search by halving, its marks' scale.
   Writes slices/fight_death/index.json, the only file the game reads beside the sprite: every voice's takes [at, dur] and db.

   THE MARKS (dB, the loudest 100 ms after the chain, played near). Rule 235(e): his own men's deaths are the worst sound in the
   game, so YOURS sits over everything a fight makes (the gun -20, the bullet in a man -16.5, a man shot down -13, the old fight's
   kill.0 -3.7 was a wall, not a death); THEIRS is still horrible and plays far (the player takes 4 dB and the top off: about -16
   heard); the skull's crunch rides on top of either; a beast dies as loud as a man of theirs.
   Run after tools/bohemia_death_sounds.py:  node tools/bohemia_death_sounds_level.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const { PAGE_LIB, CAP } = require('./bohemia_bullet_lands_level.js');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'slices', 'fight_death');
const PORT = 8934;

function markOf(name) {
  if (/_yours$/.test(name)) return -9.0;
  if (/_theirs$/.test(name)) return -12.0;
  if (name === 'skull') return -15.0;
  return -12.0;   /* animal_* */
}

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
  fs.createReadStream(f).pipe(rs);
});

async function measureIn(page, marks) {
  return page.evaluate(async ({ marks, CAP }) => {
    const man = await (await fetch('/slices/fight_death/manifest.json')).json();
    const buf = await dec('/slices/fight_death/' + man.file);
    async function find(takes, mark) {
      let lo = -10, hi = CAP;
      const pkAt = async (db) => peakOf(() => voiceDb(buf, takes, db, false));
      let ceil = CAP;
      if ((await pkAt(CAP)) > -1.0) { let a = -10, b = CAP; for (let i = 0; i < 12; i++) { const m = (a + b) / 2; if ((await pkAt(m)) > -1.0) b = m; else a = m; } ceil = a; }
      const top = await voiceDb(buf, takes, ceil, false);
      if (top < mark) return { db: +ceil.toFixed(2), capped: ceil < CAP ? 'peak' : 'gain', heard: +top.toFixed(2), peak: +(await pkAt(ceil)).toFixed(2) };
      hi = ceil;
      for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; const at = await voiceDb(buf, takes, mid, false); if (at < mark) lo = mid; else hi = mid; }
      const db = (lo + hi) / 2;
      return { db: +db.toFixed(2), capped: false, heard: +(await voiceDb(buf, takes, db, false)).toFixed(2), peak: +(await pkAt(db)).toFixed(2) };
    }
    const out = { voices: {} };
    for (const name of Object.keys(man.voices)) {
      const takes = man.voices[name].takes.map(t => [t.at_s, t.dur_s]);
      const r = await find(takes, marks[name]);
      r.far = +(await voiceDb(buf, takes, r.db - 4, true)).toFixed(2);
      out.voices[name] = Object.assign({ takes: takes, mark: marks[name], side: man.voices[name].side }, r);
    }
    return out;
  }, { marks, CAP });
}

if (require.main === module) (async () => {
  const man = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
  const marks = {}; for (const n of Object.keys(man.voices)) marks[n] = markOf(n);
  await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + PORT + '/slices/fight_death/manifest.json');
  await page.addScriptTag({ content: PAGE_LIB });
  const r = await measureIn(page, marks);
  await browser.close(); srv.close();
  const idx = {
    _readme: 'DEATH SOUNDS THAT TERRIFY, WHAT THE GAME READS (SOUNDS 10/26/26, rule 235): the sprite, every voice\'s takes as [at, dur] seconds in it, and the gain (db) that lands each at its mark after the game\'s own compressor and brickwall (tools/bohemia_death_sounds_level.js). The voices: <kind>_yours (one of his men), <kind>_theirs (an enemy, played far), skull (on top when the head went), animal_<canine|big|cat> (a beast\'s own death). The player is engine/bohemia_death_sounds.js.',
    made: '10/26/26', file: man.file, chain: 'MUS.audio: compressor -14 dB 6:1 knee 8 2 ms/120 ms, brickwall -5 dB 20:1 1 ms/80 ms', far_db: -4, far_lp_hz: 5200,
    voices: {}
  };
  for (const [name, v] of Object.entries(r.voices)) idx.voices[name] = { db: v.db, mark: v.mark, heard: v.heard, far: v.far, peak: v.peak, capped: v.capped || undefined, side: v.side, takes: v.takes };
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(idx, null, 0).replace(/\],"/g, '],\n"').replace(/\},"/g, '},\n"'));
  for (const [n, v] of Object.entries(r.voices)) console.log('  ' + n.padEnd(15) + (v.db >= 0 ? '+' : '') + v.db.toFixed(1).padStart(5) + ' dB -> ' + v.heard.toFixed(1) + ' (mark ' + v.mark + ', far ' + v.far + ', peak ' + v.peak + ')' + (v.capped ? ' CAPPED ' + v.capped : ''));
})();

module.exports = { markOf, measureIn };
