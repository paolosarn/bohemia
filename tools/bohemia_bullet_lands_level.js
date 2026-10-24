/* THE BULLET LANDS: THE LEVELS, MEASURED THROUGH THE GAME'S OWN OUTPUT CHAIN (SOUNDS, 10/24/26, row [the bullet lands]).
   A real gunshot is a spike (its loudest 5 ms stands 12 dB over its loudest 100 ms); the engine's old shot.3 is a wall (6 dB).
   So one number on the sprite says nothing about what a phone hears: the game's compressor (-14 dB, 6:1, 2 ms) and brickwall
   (-5 dB, 20:1) bend every one differently (measured 10/24: +14 dB on the rifle's flesh gave +11 after the chain, on its
   crack +3.6). This renders every voice through those exact two nodes (MUS.audio's numbers) in a real Chromium's
   OfflineAudioContext and finds, by halving, the gain that lands each one at its MARK after the chain: the loudest 100 ms,
   the energy mean over its takes. A voice the chain will not lift that far stops at +24 dB and says so ('capped').
   The guns ride one gain for all nine (their own relations kept: the shotgun on top, the rifle 1 dB under, the pistol 3,
   theirs 5): the shotgun's near mic to its mark.
   Writes slices/fight_heard/index.json, the only file the game reads beside the sprite: every voice's takes [at, dur] and db.
   Run after tools/bohemia_bullet_lands.py:  node tools/bohemia_bullet_lands_level.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');
const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'slices', 'fight_heard');
const PORT = 8933;

/* THE MARKS (dB, the loudest 100 ms after the chain, played near). Most landings are heard far, on their side of the board
   (the player takes 4 dB and the top off), so a hit on them lands about 4 under its mark. The old fight, through the same
   chain: shot.3 -9.9, hit.4 -13.5, hit.2 -20.3, melee_hit.2 -11.4, hurt.2 -14.4, went_down.4 -6.7, kill.0 -3.7; and five
   shots in six were shot_more at -41.8. The gun is the loudest thing in a firefight and the bullet lands under it. */
const MARK = {
  gun: -20.0,
  flesh_pistol: -18.0, flesh_rifle: -16.5, flesh_shotgun: -17.0, flesh_mg: -17.0,
  armour_pistol: -18.0, armour_rifle: -17.0, armour_shotgun: -17.5, armour_mg: -17.5,
  bone: -21.0,
  cover_wood: -19.0, cover_stone: -19.0, cover_metal: -19.0, cover_car: -18.5,
  ground_far: -21.0, ground_near: -21.0, pellets: -21.0,
  crack_rifle: -21.0, crack_mg: -21.0,
  ricochet: -20.0,
  down_dead: -13.0, down_hurt: -14.0,
  gun_mg_yours: -20.0, gun_mg_theirs: -24.0,
  tick: -30.0, tally_up: -19.0, tally_down: -21.0
};
const CAP = 24.0;

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
  fs.createReadStream(f).pipe(rs);
});

/* shared with the gate: the game's chain, the ruler, a render of a cut at a gain */
const PAGE_LIB = `
  window.SR = 44100;
  window.chain = function (AC) {
    const OUT = AC.createGain();
    const cmp = AC.createDynamicsCompressor(); cmp.threshold.value = -14; cmp.knee.value = 8; cmp.ratio.value = 6; cmp.attack.value = 0.002; cmp.release.value = 0.12;
    const lim = AC.createDynamicsCompressor(); lim.threshold.value = -5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
    OUT.connect(cmp); cmp.connect(lim); lim.connect(AC.destination); return OUT;
  };
  window.loud = function (d) { const w = Math.round(0.1 * SR), st = Math.round(0.005 * SR); let best = 0, pk = 0;
    for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i]));
    for (let i = 0; i + w <= d.length; i += st) { let s = 0; for (let j = i; j < i + w; j++) s += d[j] * d[j]; best = Math.max(best, s / w); }
    window.__pk = Math.max(window.__pk || 0, pk);
    return 10 * Math.log10(best + 1e-20); };
  window.peakOf = async function (fn) { window.__pk = 0; await fn(); return 20 * Math.log10(window.__pk + 1e-12); };
  window.dec = async function (u) { const ab = await (await fetch(u)).arrayBuffer(); return await new OfflineAudioContext(1, SR, SR).decodeAudioData(ab); };
  window.cutAt = async function (buf, at, dur, db, far) {
    const AC = new OfflineAudioContext(1, Math.round((dur + 0.4) * SR), SR), o = chain(AC);
    const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = buf; g.gain.value = Math.pow(10, db / 20); s.connect(g);
    if (far) { const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200; g.connect(lp); lp.connect(o); } else g.connect(o);
    s.start(0.01, Math.max(0, at - 0.005), dur + 0.005);
    return loud((await AC.startRendering()).getChannelData(0));
  };
  window.meanDb = function (a) { return 10 * Math.log10(a.reduce((s, x) => s + Math.pow(10, x / 10), 0) / a.length); };
  window.voiceDb = async function (buf, takes, db, far) { const a = []; for (const t of takes) a.push(await cutAt(buf, t[0], t[1], db, far)); return meanDb(a); };
`;

async function measureIn(page) {
  return page.evaluate(async ({ MARK, CAP }) => {
    const man = await (await fetch('/slices/fight_heard/manifest.json')).json();
    const lands = await dec('/slices/fight_heard/' + man.file);
    const gun = await dec('/slices/vote/guns_heard/guns_shotgun_yours_a.mp3');
    const gunTakes = [0, 1, 2, 3, 4].map(k => [k * 1.25 + 0.05, 1.0]);
    /* the gain that lands it at its mark, never past the one where the chain's own output would peak over -1 dBFS (the
       brickwall's 1 ms attack lets the first millisecond through: past that gain a phone hears the crack clip) */
    async function find(buf, takes, mark) {
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
    out.guns = await find(gun, gunTakes, MARK.gun);
    for (const name of Object.keys(man.voices)) {
      const takes = man.voices[name].takes.map(t => [t.at_s, t.dur_s]);
      const r = await find(lands, takes, MARK[name]);
      r.far = +(await voiceDb(lands, takes, r.db - 4, true)).toFixed(2);
      out.voices[name] = Object.assign({ takes: takes, mark: MARK[name] }, r);
    }
    return out;
  }, { MARK, CAP });
}

async function boot() {
  await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:' + PORT + '/slices/fight_heard/manifest.json');
  await page.addScriptTag({ content: PAGE_LIB });
  return { browser, page };
}

if (require.main === module) (async () => {
  const { browser, page } = await boot();
  const r = await measureIn(page);
  await browser.close(); srv.close();
  const man = JSON.parse(fs.readFileSync(path.join(OUT, 'manifest.json'), 'utf8'));
  const idx = {
    _readme: 'THE BULLET LANDS, WHAT THE GAME READS (SOUNDS 10/24/26): the sprite, every voice\'s takes as [at, dur] seconds in it, and the gain (db) that lands each at its mark after the game\'s own compressor and brickwall (tools/bohemia_bullet_lands_level.js). guns_db is the one gain the nine real guns ride (slices/vote/guns_heard/).',
    made: '10/24/26', file: man.file, chain: 'MUS.audio: compressor -14 dB 6:1 knee 8 2 ms/120 ms, brickwall -5 dB 20:1 1 ms/80 ms', far_db: -4, far_lp_hz: 5200,
    guns_db: r.guns.db, guns_heard_db: r.guns.heard, voices: {}
  };
  for (const [name, v] of Object.entries(r.voices)) idx.voices[name] = { db: v.db, mark: v.mark, heard: v.heard, far: v.far, peak: v.peak, capped: v.capped || undefined, takes: v.takes };
  idx.guns_peak_db = r.guns.peak;
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(idx, null, 0).replace(/\],"/g, '],\n"').replace(/\},"/g, '},\n"'));
  console.log('guns +' + r.guns.db + ' dB -> ' + r.guns.heard + ' (peak ' + r.guns.peak + ')');
  for (const [n, v] of Object.entries(r.voices)) console.log('  ' + n.padEnd(15) + (v.db >= 0 ? '+' : '') + v.db.toFixed(1).padStart(5) + ' dB -> ' + v.heard.toFixed(1) + ' (mark ' + v.mark + ', far ' + v.far + ', peak ' + v.peak + ')' + (v.capped ? ' CAPPED by ' + v.capped : ''));
})();

module.exports = { MARK, PAGE_LIB, measureIn, CAP };
