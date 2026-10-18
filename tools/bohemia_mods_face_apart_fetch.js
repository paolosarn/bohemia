#!/usr/bin/env node
/* MODS [the face apart] -- what one more fetch per look costs on a phone (reads only; RESEARCH ONLY, rule 22).

     python3 tools/bohemia_mods_face_apart.py --split DIR      # first: body-only and face-only WebPs, outside the repo
     node tools/bohemia_mods_face_apart_fetch.js DIR [--runs 5] [--json]

   Nothing in the game calls this and nothing in slices/ changes. Two readings:
   (A) THE REAL FIRST FIGHT, through the one driver (tools/bohemia_drive_the_demo.js: served like GitHub Pages, the
       390x844 phone, CPU 4x, the fleet's LTE profile from tools/bohemia_first_load.js): slices/BOHEMIA_FIGHT.html as
       it is, then a copy written into DIR whose loader also asks for a face file per look (every look, or only the
       looks on the board) and whose bar reads that file; the driver's serve map hands the copy and DIR's WebPs out
       under the real URLs. The number is the moment the board is baked (FIGHT_UI.board), from the page's own clock.
   (B) THE BARE FETCH, HTTP/1.1 against HTTP/2: the same sheets loaded by a page that does nothing else, from a plain
       server and from an HTTP/2 server with a throwaway certificate, because the driver's server is HTTP/1.1 (six
       connections a host) and GitHub Pages is not, so (A) alone would bill the split for queueing Pages never does. */
'use strict';
const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const args = process.argv.slice(2);
const DIR = path.resolve(args[0] || '');
const RUNS = args.includes('--runs') ? +args[args.indexOf('--runs') + 1] : 5;
if (!args[0] || !fs.existsSync(path.join(DIR, 'body')) || !fs.existsSync(path.join(DIR, 'face'))) {
  console.error('usage: node tools/bohemia_mods_face_apart_fetch.js DIR (run tools/bohemia_mods_face_apart.py --split DIR first)');
  process.exit(2);
}
const LTE = { down: 12000, up: 3000, rtt: 70 };          /* tools/bohemia_first_load.js, the fleet's phone network */
const SLOW = { down: 1600, up: 750, rtt: 150 };          /* Lighthouse's mobile profile ("slow 4G"), the bad day */
const CPU = 4;
const PEOPLE = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_people/fight_people.json'), 'utf8'));
const FILES = Object.keys(PEOPLE.looks).map(k => PEOPLE.looks[k].file);
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

/* ---------- (A) the real first fight ---------- */
const PUSH = "Object.keys(DB.people.looks).forEach(function (k) { all.push('fight_people/' + DB.people.looks[k].file); });";
const FACE_DRAW = 'g.drawImage(img, DB.people.frame * DB.people.cols.length, 0, DB.people.face.size, DB.people.face.size, 0, 0, S, S);';
function variant(which) {
  let s = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  if (s.split(PUSH).length !== 2 || s.split(FACE_DRAW).length !== 2) throw new Error('the fight changed: the loader or the bar line moved');
  const faces = which === 'every look'
    ? "Object.keys(DB.people.looks).forEach(function (k) { all.push('fight_faces/' + DB.people.looks[k].file); });"
    : "Array.from(new Set(FIGHT.S.units.map(function (v) { return v.look; }))).forEach(function (k) { const L = DB.people.looks[k]; if (L) all.push('fight_faces/' + L.file); });";
  s = s.replace(PUSH, PUSH + ' ' + faces);
  s = s.replace(FACE_DRAW, "{ const L = DB.people.looks[v.look] || DB.people.looks[Object.keys(DB.people.looks)[0]], f = UI.imgs['fight_faces/' + L.file]; if (f) g.drawImage(f, 0, 0, f.width, f.height, 0, 0, S, S); }");
  const out = path.join(DIR, 'BOHEMIA_FIGHT_' + which.replace(/ /g, '_') + '.html');
  fs.writeFileSync(out, s); return out;
}
const CLOCK = 'window.__FIRST=null;(function t(){if(window.FIGHT_UI&&FIGHT_UI.board&&window.__FIRST===null){window.__FIRST=performance.now();window.__LOOKS=new Set(FIGHT.S.units.map(function(v){return v.look;})).size;return;}requestAnimationFrame(t);})();'
  + 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip"};';
async function fightOnce(which, net) {
  const serve = {};
  if (which !== 'packed') {
    serve['/slices/BOHEMIA_FIGHT.html'] = variant(which);
    FILES.forEach(f => { serve['/slices/fight_people/' + f] = path.join(DIR, 'body', f); serve['/slices/fight_faces/' + f] = path.join(DIR, 'face', f); });
  }
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, pages: true, throttle: CPU, net, netlog: true, serve, arm: CLOCK });
  try {
    await d.page.waitForFunction(() => window.__FIRST !== null, null, { timeout: 240000, polling: 250 });
    const r = await d.page.evaluate(() => ({ first: Math.round(window.__FIRST), looks: window.__LOOKS }));
    const ppl = d.netlog.filter(e => /\/fight_(people|faces)\/.*\.webp$/.test(e.url));
    r.requests = ppl.length; r.bytes = ppl.reduce((a, e) => a + e.bytes, 0);
    r.peopleDone = ppl.length ? Math.max(...ppl.map(e => e.endMs)) : null;
    r.errors = d.errs.length; return r;
  } finally { await d.close(); }
}

/* ---------- (B) the bare fetch, HTTP/1.1 and HTTP/2 ---------- */
function cert() {
  const k = path.join(DIR, 'key.pem'), c = path.join(DIR, 'cert.pem');
  if (!fs.existsSync(k)) execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', k, '-out', c,
    '-days', '1', '-subj', '/CN=127.0.0.1', '-addext', 'subjectAltName=IP:127.0.0.1'], { stdio: 'ignore' });
  return { key: fs.readFileSync(k), cert: fs.readFileSync(c) };
}
const PAGE = '<!doctype html><meta charset=utf-8><script>window.go=function(list){const t0=performance.now();'
  + 'return Promise.all(list.map(function(s){return new Promise(function(ok){const i=new Image();i.onload=function(){(i.decode?i.decode():Promise.resolve()).then(function(){ok(1);},function(){ok(1);});};i.onerror=function(){ok(0);};i.src=s;});}))'
  + '.then(function(r){return {ms:Math.round(performance.now()-t0),ok:r.reduce(function(a,b){return a+b;},0)};});};</script>';
function route(u) {
  if (u === '/' || u === '/p.html') return { type: 'text/html', body: Buffer.from(PAGE) };
  const m = u.match(/^\/(packed|body|face)\/([a-z_]+\.webp)$/); if (!m) return null;
  const f = m[1] === 'packed' ? path.join(ROOT, 'slices/fight_people', m[2]) : path.join(DIR, m[1], m[2]);
  return fs.existsSync(f) ? { type: 'image/webp', body: fs.readFileSync(f) } : null;
}
async function serveBoth() {
  const handler = (req, res) => {
    const r = route(req.url.split('?')[0]);
    if (!r) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': r.type, 'cache-control': 'no-store' }); res.end(r.body);
  };
  const h1 = require('http').createServer(handler);
  const h2 = http2.createSecureServer(Object.assign(cert(), { allowHTTP1: false }), handler);
  await new Promise(r => h1.listen(0, '127.0.0.1', r)); await new Promise(r => h2.listen(0, '127.0.0.1', r));
  return { h1: 'http://127.0.0.1:' + h1.address().port, h2: 'https://127.0.0.1:' + h2.address().port, close: () => { h1.close(); h2.close(); } };
}
async function bareOnce(browser, base, list, net) {
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(), cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  let proto = null; cdp.on('Network.responseReceived', e => { if (/\.webp$/.test(e.response.url)) proto = e.response.protocol; });
  await page.goto(base + '/p.html');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: net.rtt, downloadThroughput: net.down * 1000 / 8, uploadThroughput: net.up * 1000 / 8 });
  const r = await page.evaluate(l => window.go(l), list);
  r.protocol = proto; await ctx.close(); return r;
}

(async () => {
  const out = { runs: RUNS, cpu: CPU, nets: { lte: LTE, slow: SLOW }, fight: {}, bare: {} };
  /* (A), the variants taken in turn inside each run, so a slow minute on the box lands on all three alike */
  const VAR = ['packed', 'every look', 'looks on the board'], got = {};
  VAR.forEach(w => { got[w] = []; });
  for (let i = 0; i < RUNS; i++) for (const w of VAR) got[w].push(await fightOnce(w, LTE));
  for (const which of VAR) {
    const rs = got[which];
    out.fight[which] = { first_ms: med(rs.map(r => r.first)), first_all: rs.map(r => r.first), people_done_ms: med(rs.map(r => r.peopleDone)),
      requests: rs[0].requests, bytes: rs[0].bytes, looks_on_board: rs[0].looks, errors: rs.reduce((a, r) => a + r.errors, 0) };
    console.log('(A) first fight, ' + which + ': ' + JSON.stringify(out.fight[which]));
  }
  /* (B) */
  const S = await serveBoth(), browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  const onBoard = out.fight['looks on the board'].requests - FILES.length;
  const sets = { packed: FILES.map(f => '/packed/' + f), 'every look': FILES.map(f => '/body/' + f).concat(FILES.map(f => '/face/' + f)),
    'looks on the board': FILES.map(f => '/body/' + f).concat(FILES.slice(0, Math.max(0, onBoard)).map(f => '/face/' + f)) };
  try {
    for (const proto of ['h1', 'h2']) for (const nk of ['lte', 'slow']) {
      const bySet = {}; Object.keys(sets).forEach(sk => { bySet[sk] = []; });
      for (let i = 0; i < RUNS; i++) for (const sk of Object.keys(sets)) bySet[sk].push(await bareOnce(browser, S[proto], sets[sk], out.nets[nk]));
      for (const sk of Object.keys(sets)) {
      const rs = bySet[sk], key = proto + ' ' + nk + ' ' + sk;
      out.bare[key] = { ms: med(rs.map(r => r.ms)), all: rs.map(r => r.ms), files: sets[sk].length, ok: rs[0].ok, protocol: rs[0].protocol };
      console.log('(B) ' + key + ': ' + JSON.stringify(out.bare[key]));
      }
    }
  } finally { await browser.close(); S.close(); }
  fs.writeFileSync(path.join(DIR, 'face_apart_fetch.json'), JSON.stringify(out, null, 1));
  if (args.includes('--json')) console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
