#!/usr/bin/env node
/* EVERY EVENT HEARD (SOUNDS 11/3, ask line 266: 'nothing feels punchy yet'). The measuring stick for the round: the real demo at
   phone size (tools/bohemia_drive_the_demo.js), a fight opened through the game's own door and played on AUTO to its end, then
   a short trip on the map. It logs every sound the game ASKED for (the fight's BOHEMIA_SFX messages, the shell's playSFX) and
   every sound that actually STARTED on the audio clock (AudioScheduledSourceNode.start, in every frame), so a silent event is
   an event with asks and no starts, and a synth beep is a start with no recording behind it.

   node tools/bohemia_sounds_every_event_heard.js [--alpha] [--out file.json]
   The report goes to records/target/BOHEMIA_SOUNDS_EVERY_EVENT_HEARD.json unless --out names another file. */
'use strict';
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : path.join(ROOT, 'records/target/BOHEMIA_SOUNDS_EVERY_EVENT_HEARD.json');

/* armed in every frame before any page script: every source that starts, with the event the shell was answering when it did */
const ARM = `(function(){
  var top = window; try { top = window.top; void top.document; } catch (e) { top = window; }
  var me = window === top ? 'shell' : (location.pathname.split('/').pop() || 'frame');
  if (window === top) { window.__AUD = []; window.__ASK = []; window.__CUR = null;
    addEventListener('message', function (ev) { var d = ev.data;
      if (d && (d.type === 'BOHEMIA_SFX' || d.type === 'BOHEMIA_SFX_AT' || d.type === 'BOHEMIA_NPCSTEP')) {
        window.__CUR = d.ev || d.type; window.__ASK.push({ t: performance.now(), ev: d.ev || d.type, via: d.type, gun: d.gun || null, victim: d.victim || null });
        setTimeout(function () { window.__CUR = null; }, 0); } }, true); }
  /* every node that feeds the speakers, so --forced can meter what he actually hears */
  try { var C = AudioNode.prototype.connect; AudioNode.prototype.connect = function (dst) { try { if (dst && dst === this.context.destination) (top.__TODEST = top.__TODEST || []).push(this); } catch (e) {} return C.apply(this, arguments); }; } catch (e) {}
  /* AudioBufferSourceNode carries its OWN start(when, offset, duration), so both prototypes are wrapped */
  [window.AudioScheduledSourceNode, window.AudioBufferSourceNode].forEach(function (K) { try { if (!K || !Object.prototype.hasOwnProperty.call(K.prototype, 'start')) return;
    var P = K.prototype, S = P.start;
    P.start = function (when) { try { var b = this.buffer, log = top.__AUD;
      if (log && log.length < 20000) log.push({ t: top.performance.now(), frame: me, ev: top.__CUR || top.__PLAYING || top.__LABEL || null,
        kind: this.constructor.name, dur: b ? +b.duration.toFixed(3) : null, osc: this instanceof OscillatorNode ? this.type : null,
        at: +((when || 0) - this.context.currentTime).toFixed(3) }); } catch (e) {}
      return S.apply(this, arguments); }; } catch (e) {} });
})();`;

(async () => {
  const d = await D.open({ alpha: args.includes('--alpha'), arm: ARM, engage: true });
  const page = d.page;
  /* the shell's own asks (a tap, the map, the town): wrap playSFX now the boot has finished replacing it */
  await page.evaluate(() => {
    const P = window.playSFX;
    window.playSFX = function (ev) { const was = window.__PLAYING; window.__PLAYING = ev;
      try { const r = P.apply(this, arguments); window.__ASK.push({ t: performance.now(), ev: ev, via: 'playSFX', ok: !!r }); return r; } finally { window.__PLAYING = was; } };
    ['BULLET', 'DEATH', 'PUNCH'].forEach(function (k) { const o = window[k]; if (!o || typeof o.heard !== 'function') return; const H = o.heard;
      o.heard = function (m) { const r = H.apply(this, arguments); window.__ASK.push({ t: performance.now(), ev: m && m.ev, via: k, said: r === 'done' ? 'done' : (r && r.swap) ? 'swap:' + r.swap : null }); return r; }; });
  });
  const mark = async (name) => page.evaluate((n) => ({ n: n, t: performance.now(), ask: window.__ASK.length, aud: window.__AUD.length }), name);
  const phases = [];

  /* ---- --forced: every new hook's message, posted from the frame that posts it, over the music, with the game's final output
     metered (an analyser on the node that feeds the speakers): the loudest 100 ms of music alone against the loudest 100 ms
     with each sound, and the peak (over 0 dBFS is a clip). Said out loud as FORCED: the events are the hooks' own messages,
     not met on the road. ---- */
  if (args.includes('--forced')) {
    await page.waitForTimeout(9000);   /* the music running and the sprite in (6 s after the music) */
    await page.evaluate(() => { const AC = MUS.AC, an = AC.createAnalyser(); an.fftSize = 4096; const buf = new Float32Array(an.fftSize);
      /* the brickwall is the last node before the speakers: everything he hears passes it */
      const last = (window.__TODEST || []).filter(n => n.context === AC); last.forEach(n => { try { n.connect(an); } catch (e) {} });
      window.__MET = { n: last.length, rows: [] }; window.__METER = setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0, p = 0; for (let i = 0; i < buf.length; i++) { s += buf[i] * buf[i]; p = Math.max(p, Math.abs(buf[i])); }
        window.__MET.rows.push({ t: performance.now(), db: 10 * Math.log10(s / buf.length + 1e-20), pk: 20 * Math.log10(p + 1e-12), tag: window.__TAG || 'music' }); }, 90); });
    await page.waitForTimeout(8000);
    const city = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
    const fightLike = [['fight_step', { machine: true, side: 'them' }], ['swing_air', { machine: true, side: 'them' }], ['melee_hit', { melee: true, blow: 'blunt', side: 'you', target_machine: true }],
      ['melee_hit', { melee: true, blow: 'blunt', side: 'you' }], ['melee_hit', { melee: true, blow: 'cutting', side: 'you' }], ['went_down', { side: 'them' }], ['body_land', { side: 'them', machine: true }],
      ['kill', { side: 'them', victim: 'machine' }]];
    const mapLike = ['camp_make', 'camp_break', 'they_come', 'road_stop', 'boss_found'];
    for (const [ev, f] of fightLike) { await page.evaluate(([ev, f]) => { window.__TAG = ev; window.postMessage(Object.assign({ type: 'BOHEMIA_SFX', ev: ev }, f), '*'); }, [ev, f]); await page.waitForTimeout(1600); }
    for (const ev of mapLike) { await (city || page).evaluate((ev) => { (window.parent || window).__TAG = ev; window.parent.postMessage({ type: 'BOHEMIA_SFX', ev: ev }, '*'); }, ev); await page.waitForTimeout(ev === 'boss_found' || ev === 'road_stop' ? 5000 : 2400); }
    await page.evaluate(() => { window.__TAG = 'music'; });
    await page.waitForTimeout(6000);
    const met = await page.evaluate(() => { clearInterval(window.__METER); return window.__MET; });
    const res = await page.evaluate(() => ({ ask: window.__ASK, aud: window.__AUD, punch: window.PUNCH ? { ready: PUNCH.ready(), err: PUNCH.err, count: PUNCH.count, log: PUNCH.log.slice(-40) } : null }));
    await d.close();
    const by = {}; met.rows.forEach(r => { const b = by[r.tag] || (by[r.tag] = { tag: r.tag, loud: -200, peak: -200, n: 0 }); b.loud = Math.max(b.loud, r.db); b.peak = Math.max(b.peak, r.pk); b.n++; });
    const music = by.music || { loud: null };
    const rep = { _readme: 'SOUNDS 11/3, --forced: each new hook\'s own message posted on the real ' + d.says() + ' over its music; the game\'s final output metered every 90 ms (loudest 100 ms in dB and the peak in dBFS, over 0 is a clip).',
      meteredNodes: met.n, music: music, sounds: Object.values(by).filter(b => b.tag !== 'music').map(b => Object.assign(b, { overMusic: music.loud != null ? +(b.loud - music.loud).toFixed(1) : null })),
      punch: res.punch, starts: res.aud.filter(a => a.ev && a.ev !== 'music').reduce((o, a) => { o[a.ev] = (o[a.ev] || 0) + 1; return o; }, {}) };
    fs.writeFileSync(OUT.replace(/\.json$/, '_FORCED.json'), JSON.stringify(rep, null, 1));
    console.log('metered nodes', met.n, '| music loudest', music.loud && music.loud.toFixed(1), 'dB, peak', music.peak && music.peak.toFixed(1), 'dBFS');
    rep.sounds.forEach(s => console.log('  ' + s.tag.padEnd(12) + ' loudest ' + s.loud.toFixed(1) + ' dB (' + (s.overMusic >= 0 ? '+' : '') + s.overMusic + ' vs music), peak ' + s.peak.toFixed(1) + ' dBFS, starts ' + (rep.starts[s.tag] || 0)));
    return;
  }

  /* the game's final output, metered every 90 ms through the whole walk: each row knows its phase and whether a sound of the
     fight, the map or the phone started in the 400 ms before it (else it is the music alone) */
  await page.evaluate(() => { const AC = MUS.AC; if (!AC) return; const an = AC.createAnalyser(); an.fftSize = 4096; const buf = new Float32Array(an.fftSize);
    (window.__TODEST || []).filter(n => n.context === AC).forEach(n => { try { n.connect(an); } catch (e) {} });
    window.__MET = []; window.__METER = setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0, p = 0; for (let i = 0; i < buf.length; i++) { s += buf[i] * buf[i]; p = Math.max(p, Math.abs(buf[i])); }
      const now = performance.now(), A = window.__AUD; let fx = false; for (let i = A.length - 1; i >= 0 && now - A[i].t < 400; i--) if (A[i].ev) { fx = true; break; }
      window.__MET.push({ ph: window.__PH || 'boot', fx: fx, db: 10 * Math.log10(s / buf.length + 1e-20), pk: 20 * Math.log10(p + 1e-12) }); }, 90); });
  const phase = (n) => page.evaluate((n) => { window.__PH = n; }, n);

  /* ---- THE MAP: a short trip, the way a player taps ---- */
  await phase('map');
  phases.push(await mark('map'));
  try { await d.toMap(); const vp = page.viewportSize();
    for (const [fx, fy] of [[0.62, 0.42], [0.35, 0.6], [0.55, 0.3]]) { await page.touchscreen.tap(Math.round(vp.width * fx), Math.round(vp.height * fy)); await page.waitForTimeout(5000); }
  } catch (e) { phases.push({ n: 'map failed', why: String(e.message).slice(0, 200) }); }

  /* ---- THE PHONE: its real buttons, by a finger at their place on the glass (a page open and shut, camp made and broken) ---- */
  phases.push(await mark('phone')); await phase('phone');
  const press = async (app) => { const b = await page.$('#bohphone button.app[data-app="' + app + '"]'); const r = b ? await b.boundingBox() : null;
    if (!r) return app + ': not on the phone'; await page.touchscreen.tap(Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)); return app; };
  const pressed = [];
  for (const [app, ms] of [['relations', 1500], ['relations', 1500], ['heal', 6000], ['heal', 5000]]) { pressed.push(await press(app).catch(e => app + ': ' + e.message)); await page.waitForTimeout(ms); }
  phases.push({ n: 'pressed', what: pressed });

  /* ---- THE FIGHT: through the game's own door, AUTO to the end ---- */
  phases.push(await mark('fight')); await phase('fight');
  const opened = await page.evaluate(() => { try { if (typeof nfOpen === 'function') return !!nfOpen({ label: 'every event heard' }) || 'nfOpen'; } catch (e) { return 'nfOpen threw ' + e.message; }
    try { cityEncounterIn({ packageId: 1, label: 'every event heard' }); return 'cityEncounterIn'; } catch (e) { return 'no door: ' + e.message; } });
  let fight = { opened: opened, over: false, ms: 0 };
  const t0 = Date.now();
  let fr = null;
  while (Date.now() - t0 < 40000 && !fr) { const h = await page.$('#fightFrame'); fr = h ? await h.contentFrame() : null; if (!fr) await page.waitForTimeout(250); }
  if (fr) {
    const up = async () => fr.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false);
    while (Date.now() - t0 < 60000 && !(await up())) await page.waitForTimeout(250);
    await page.waitForTimeout(2500);
    await fr.evaluate(() => { const b = document.getElementById('bauto'); if (b && !FIGHT_UI.auto) b.click(); }).catch(() => {});
    const t1 = Date.now();
    while (Date.now() - t1 < 150000) { const o = await fr.evaluate(() => !!(FIGHT.S && FIGHT.S.over)).catch(() => true); if (o) { fight.over = true; break; } await page.waitForTimeout(500); }
    fight.ms = Date.now() - t1;
    fight.machines = await fr.evaluate(() => FIGHT.S.units.filter(u => u.machine).length).catch(() => null);
    fight.heard = await fr.evaluate(() => (FIGHT_UI.sent || []).length).catch(() => null);
    await page.waitForTimeout(3000);
  }
  phases.push(await mark('end'));
  const res = await page.evaluate(() => { clearInterval(window.__METER); return { ask: window.__ASK, aud: window.__AUD, met: window.__MET || [] }; });
  const lv = {}; res.met.forEach(r => { const k = r.ph + (r.fx ? ' with a sound' : ' music alone'); const b = lv[k] || (lv[k] = { loudest: -200, peak: -200, n: 0 }); b.loudest = Math.max(b.loudest, +r.db.toFixed(1)); b.peak = Math.max(b.peak, +r.pk.toFixed(1)); b.n++; });
  await d.close();

  /* ---- the table: per event, asked and started (and from which frame, recording or oscillator) ---- */
  const rows = {};
  const row = (ev) => rows[ev] || (rows[ev] = { ev: ev, asked: 0, via: {}, rendered: 0, silent: 0, starts: 0, recording: 0, oscillator: 0 });
  res.ask.forEach(a => { if (a.via === 'playSFX' || a.via === 'BULLET' || a.via === 'DEATH' || a.via === 'PUNCH') { const r = row(a.ev); r.via[a.via + (a.said ? ':' + a.said : a.ok === false ? ':silent' : '')] = (r.via[a.via + (a.said ? ':' + a.said : a.ok === false ? ':silent' : '')] || 0) + 1; }
    else { const r = row(a.ev); r.asked++; } });
  res.aud.forEach(s => { const r = row(s.ev || ('(' + s.frame + ' unlabelled ' + (s.osc ? 'osc ' + s.osc : 'buffer') + ')')); r.starts++; if (s.osc) r.oscillator++; else r.recording++; });
  Object.values(rows).forEach(r => { r.silent = r.asked > 0 && r.starts === 0 ? 1 : 0; });
  const report = { _readme: 'SOUNDS 11/3 every event heard: the real ' + d.says() + ', phone portrait. asked = BOHEMIA_SFX messages the game sent; starts = audio sources that actually started while the shell answered that event (recording = a buffer, oscillator = a synth tone). silent: asked and nothing started.',
    phases: phases, fight: fight, levels: lv, rows: Object.values(rows).sort((a, b) => b.asked - a.asked || b.starts - a.starts) };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 1));
  console.log('fight', JSON.stringify(fight)); Object.entries(lv).forEach(([k, b]) => console.log('  level ' + k.padEnd(26) + ' loudest ' + b.loudest + ' dB, peak ' + b.peak + ' dBFS (' + b.n + ' reads)'));
  report.rows.forEach(r => console.log((r.silent ? 'SILENT ' : '       ') + String(r.ev).padEnd(34) + ' asked ' + String(r.asked).padStart(3) + '  starts ' + String(r.starts).padStart(4) + ' (rec ' + r.recording + ', osc ' + r.oscillator + ') ' + JSON.stringify(r.via)));
})().catch(e => { console.error(e); process.exit(1); });
