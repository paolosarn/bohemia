#!/usr/bin/env node
/* THE VOTE CARDS PLAY WHERE HE PLAYS THEM (SOUNDS, 10/25/26, row [the vote cards play], rule 193).

   PAOLO 10/25: 'I went in the vote tab and tried to play the music and the music wasn't playing.' The card page played on
   its own in Chromium; where he opened it, it did not (the iPhone's ringer switch mutes Web Audio, an in-app browser can
   refuse it, and 2.4 MB loaded with nothing on screen).

   ON THE REAL SURFACE: the alpha, its door, its VOTE tab (frame one, #voteFrame), a song card's LOOK AT IT (frame two, the
   card's own page), on the phone profile and the computer profile. LEGS, each profile:
     1  FIRST TAP PLAYS: one tap on 1. THE MAP inside both frames, and the card says PLAYING and is playing
     2  IT SAYS LOADING FIRST: between the tap and the sound the words say LOADING
     3  THE RINGER SWITCH (iPhone): the page asks the phone for the 'playback' audio session where the phone has one
        (navigator.audioSession), so the silent switch does not mute it, and it unlocks Web Audio inside the tap
     4  WHEN WEB AUDIO WILL NOT START (an in-app browser, a locked context): the plain <audio> player takes the same tap and
        the words say PLAYING (the simple player)
     5  WHEN THE FILE WILL NOT COME: a plain error in words, never a silent card
   node gates/the_vote_cards_play_gate.js [--phone-only|--computer-only] */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.resolve(__dirname, '..');
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
function pw() { for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) { try { return require(path.join(g, 'playwright')); } catch (e) {} } return require('playwright'); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const CARD = 'sounds-three-levels-the-vault-10-25';

function serve(block) {
  const s = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]), f = path.join(ROOT, u.replace(/^\//, ''));
    if (block && block.test(u)) { res.writeHead(404); return res.end(); }
    /* HIS VOTE CONSUMES A CARD (the tab's own law): the thirteen song cards carry his YES, so on his phone they are gone. The
       page under test is the same for every sound card, so the registry served here forgets his verdict on the one card the
       gate opens; nothing else is changed */
    if (/BOHEMIA_VOTE_REGISTRY\.json$/.test(u)) { const r = JSON.parse(fs.readFileSync(f, 'utf8')); r.verdicts = (r.verdicts || []).filter(v => v && v.id !== CARD); const body = JSON.stringify(r);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }); return res.end(body); }
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': fs.statSync(f).size });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}

/* the alpha, its door, the VOTE tab, the card's LOOK: the card's own frame */
async function cardFrame(p, port) {
  await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html');
  await throughTheTitle(p).catch(() => false);
  await p.waitForFunction(() => window.__LOAD_READY === true, null, { timeout: 240000 });
  /* only BEGIN begins (RUN 10/25, rule 150): the door's own button */
  const bt = await p.$('#fronttap'); const bb = bt && await bt.boundingBox();
  if (bb) await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); else { const box = p.viewportSize(); await p.mouse.click(box.width / 2, box.height * 0.6); }
  /* A NEW GAME NOW MAKES HIS MAIN GUY FIRST (RUN THREE, rule 263(b)) and plays his squad up close (236): both cover the whole
     screen, the VOTE tab with them, until he presses GO and the tape ends or he taps it away. He does both, so this does both. */
  for (let i = 0; i < 120; i++) {
    const st = await p.evaluate(() => { const m = document.getElementById('mainmaker'), q = document.getElementById('squadup');
      const vis = e => !!(e && e.isConnected && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
      const go = m && vis(m) ? m.querySelector('.go') : null, r = go && go.getBoundingClientRect();
      return { maker: vis(m), go: r && r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null, tape: vis(q) }; });
    if (st.go) { await p.mouse.click(st.go.x, st.go.y); await p.waitForTimeout(400); continue; }
    if (st.tape) { const box = p.viewportSize(); await p.mouse.click(box.width / 2, box.height / 2); await p.waitForTimeout(500); continue; }
    if (!st.maker) break;
    await p.waitForTimeout(250);
  }
  await p.waitForFunction(() => { const f = document.getElementById('voteFrame'); return f && /BOHEMIA_VOTE_TAB/.test(f.getAttribute('src') || ''); }, null, { timeout: 60000 });
  const vf = await (await p.$('#voteFrame')).contentFrame();
  await vf.waitForFunction(() => document.querySelectorAll('.row[data-id]').length > 0, null, { timeout: 60000 });
  const sel = '.row[data-id="' + CARD + '"]';
  if (!await vf.$(sel)) { const fold = await vf.$('#fold'); if (fold) await fold.click(); await vf.waitForTimeout(300); }
  const row = await vf.$(sel); if (!row) throw new Error('the card ' + CARD + ' is not in the VOTE tab');
  await row.scrollIntoViewIfNeeded();
  await (await row.$('.look')).click();
  const fh = await vf.waitForSelector(sel + ' iframe', { timeout: 20000 });
  const cf = await fh.contentFrame();
  await cf.waitForFunction(() => typeof window.__threelevels === 'function' && window.__threelevels().song, null, { timeout: 30000 });
  await (await cf.$('#l1')).scrollIntoViewIfNeeded();
  return cf;
}

async function one(b, prof, how) {
  const s = await serve(how === 'nofile' ? /vote\/songs\/three_levels\/the_vault\/(level_|hit)/ : null);
  const ctx = await b.newContext(prof.ctx), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await ctx.addInitScript((how) => {
    /* what the page asked of the phone's audio session */
    try { if (!navigator.audioSession) { const s = { _t: 'auto' }; Object.defineProperty(s, 'type', { get() { return this._t; }, set(v) { this._t = v; window.__askedSession = v; } }); Object.defineProperty(navigator, 'audioSession', { value: s, configurable: true }); } } catch (e) {}
    /* an in-app browser that never lets Web Audio start: the context stays suspended whatever the page does */
    if (how === 'locked') { const C = window.AudioContext || window.webkitAudioContext; if (C) { const W = function (o) { const a = new C(o); a.suspend(); a.resume = () => Promise.resolve(); return a; }; W.prototype = C.prototype; window.AudioContext = W; window.webkitAudioContext = W; } }
  }, how);
  let cf;
  try { cf = await cardFrame(p, s.address().port); }
  catch (e) { leg(false, prof.name + ' ' + how + ': the card opens inside the alpha\'s VOTE tab', String(e.message).slice(0, 200)); await ctx.close(); s.close(); return; }
  const words = [];
  const tap = await cf.$('#l1'), bb = await tap.boundingBox();
  if (prof.touch) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); else await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  for (let i = 0; i < 60; i++) { const st = await cf.evaluate(() => window.__threelevels()); if (!words.length || words[words.length - 1] !== st.words) words.push(st.words); if (/^PLAYING|did not play|did not load/.test(String(st.words)) && i > 2) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(1200);
  const st = await cf.evaluate(() => window.__threelevels());
  const asked = await cf.evaluate(() => window.__askedSession || (navigator.audioSession && navigator.audioSession.type));
  if (how === 'ok') {
    leg(st.live && st.level === 1 && /^PLAYING/.test(st.words) && st.state === 'running' && st.t > 0.3, prof.name + ': *** FIRST TAP PLAYS ***, inside the alpha\'s VOTE tab and the card\'s own frame', JSON.stringify({ live: st.live, level: st.level, state: st.state, t: st.t, mode: st.mode }));
    leg(words.some(w => /^LOADING/.test(w)), prof.name + ': *** IT SAYS LOADING FIRST ***', words.map(w => String(w).slice(0, 40)).join(' | '));
    leg(asked === 'playback', prof.name + ': *** THE RINGER SWITCH ***, the page asks the phone for the playback audio session', 'asked ' + asked);
  } else if (how === 'locked') {
    leg(st.live && st.mode === 'el' && /PLAYING \(the simple player\)/.test(st.words), prof.name + ': *** WHEN WEB AUDIO WILL NOT START ***, the plain player takes the tap', JSON.stringify({ live: st.live, mode: st.mode, words: st.words.slice(0, 60) }));
  } else {
    leg(!st.live && /did not (play|load)/.test(st.words), prof.name + ': *** WHEN THE FILE WILL NOT COME ***, a plain error in words', st.words.slice(0, 90));
  }
  leg(errs.length === 0, prof.name + ' ' + how + ': no page errors', errs.slice(0, 2).join(' | '));
  await ctx.close(); s.close();
}

(async () => {
  const a = process.argv.slice(2);
  const b = await pw().chromium.launch({ args: ['--autoplay-policy=user-gesture-required'] });
  const P = [
    { name: 'phone', touch: true, ctx: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' } },
    { name: 'computer', touch: false, ctx: { viewport: { width: 1280, height: 800 } } }
  ].filter(x => !(a.includes('--phone-only') && x.name !== 'phone') && !(a.includes('--computer-only') && x.name !== 'computer'));
  for (const prof of P) for (const how of ['ok', 'locked', 'nofile']) { console.log('-- ' + prof.name + ', ' + how); await one(b, prof, how); }
  await b.close();
  console.log('THE VOTE CARDS PLAY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
