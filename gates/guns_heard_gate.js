/* ============================================================================
   THE GUNS HEARD GATE: THE FIRST FIGHT'S GUNS FROM REAL GUNS  (SOUNDS, row [the guns heard], 10/19/26)

   RULE 120 (PAOLO 10/18, LOCKED): 'I wanna start off with the guns too... the guns were supposed to be the main way this
   is gonna be solved.' Before this, every gun in the fight posted one engine-made 'shot' (one take in six his approved
   shot.3, five about 25 dB under it, measured here), the PISTOL posted a sword's whoosh, a reload made no sound.

   This proves, the way he opens it (a phone, the VOTE tab's 62vh frame, a slow phone network, real speed: the lesson of
   'Was broke', records/BOHEMIA_THE_STEP_IN_THE_FIGHT_POST_MORTEM_10_18_26.md, whose gate ran three times as fast):
     - REAL GUNS, ONE LICENCE: every window in the bank is a cut of a master track of the Free Firearm Sound Library
       (CC0 1.0, the mirror named), every take on the card names its master and its far mic
     - THE SOUNDS, decoded: twelve gun voices (three guns, yours and theirs, A and C) of five takes, six reloads of three;
       nothing over -1 dBFS; every take of a voice as loud as the others (1 dB); every shot two beats long and quiet at its
       end (no click); A inside the VHS band (under 5 percent of its energy above 10 kHz, under 1 percent above 20 kHz);
       THE STREET ON THE GRID: in A the canyon claps back a 16th after the crack (125 ms); THE CAMCORDER: A's tail stands
       higher than C's (the automatic gain breathing back); THE DROP-OUT: take three of every A voice dives and goes dull,
       never to zero (rule 6 of what analog horror sounds like); THEIRS under YOURS
     - WHAT PLAYS NOW: the pools the page plays as B are the alpha's own (APPROVED and SIBLINGS, re-read now), measured
     - THE GAME CARRIES IT (re-aimed 10/24 to rule 127: no YES is waited for): the alpha and the demo carry the engine inside
       THE BULLET LANDS' block, byte for byte; the fight, COMBAT's file, none of it
     - THE CARD: in the registry with this page, a draft, three options; CUE 7.7 names it
     - THE PAGE, his way: the fight loads once and is never reloaded by a tap; a gun fires within two seconds of a tap on
       a 1.6 Mbps network; B renders through the game's engine; C plays the clean files; the fight playing itself is heard
       through the new guns (yours and theirs) at real speed; nothing throws; every button 44 px and on a 390 px screen
   Run: node gates/guns_heard_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const PORT = 8898;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const DIR = 'slices/vote/guns_heard';
const BANK = 'reference/library/sound_bank/ffsl_cc0';
const PAGE = 'slices/BOHEMIA_THE_GUNS_HEARD_10_19_26.html';
const CARD = 'sounds-the-guns-heard-10-19';

console.log('THE GUNS HEARD GATE');

/* ---------------- REAL GUNS, ONE LICENCE ---------------- */
const lic = JSON.parse(rd(BANK + '/LICENCES.json'));
const man = JSON.parse(rd(DIR + '/manifest.json'));
ok('the bank is the Free Firearm Sound Library, CC0 1.0, its mirror named', lic.library.licence === 'CC0 1.0 Universal' && /buddingmonkey\/FreeFirearmsSFXLibrary/.test(lic.library.mirror) && man.library.licence === 'CC0 1.0 Universal');
const wins = Object.keys(lic.windows);
ok('every window in the bank is a FLAC cut of a named master track', wins.length >= 60 && wins.every(w => fs.existsSync(path.join(ROOT, BANK, w + '.flac')) && /^Master Tracks\/.+\/[A-Z]_\d+\.wav$/.test(lic.windows[w].master_track)), wins.length + ' windows');
const cutsAll = man.voices.flatMap(v => v.cuts);
ok('every take names its near or mid mic and its far mic, both banked', cutsAll.length === 60 && cutsAll.every(c => lic.windows[c.source] && lic.windows[c.far] && lic.windows[c.source].kind === 'shot' && lic.windows[c.far].kind === 'far'), cutsAll.length + ' takes');
ok('every reload is the real motions of the same guns, banked', man.reloads.length === 6 && man.reloads.every(r => r.cuts.length === 3 && r.cuts.every(c => c.motions.every(m => lic.windows[m.source] && lic.windows[m.source].kind === 'motion'))));
ok('three guns a class, nine real guns', Object.values(man.guns).every(g => g.length === 3) && new Set(Object.values(man.guns).flat().map(g => g.folder)).size === 9);

/* ---------------- THE SOUNDS, DECODED ---------------- */
const PY = `
import json, sys, math, numpy as np, soundfile as sf
from scipy import signal
D='${path.join(ROOT, DIR)}/'
m=json.load(open(D+'manifest.json')); SR=44100; out={}
def db(v): return 20*math.log10(v+1e-12)
def loud(y):
    w=int(0.1*SR); st=int(0.01*SR); b=0.0
    for i in range(0,max(1,len(y)-w),st): b=max(b,float(np.sqrt((y[i:i+w]**2).mean())))
    return db(b)
def share(y,lo):
    f,p=signal.welch(y,SR,nperseg=4096); return float(p[f>=lo].sum()/(p.sum()+1e-20))
def env(y,t,w=0.002): i=int(t*SR); n=int(w*SR); return db(float(np.sqrt((y[i:i+n]**2).mean())))
def onset(c):
    a=np.abs(c[:int(0.1*SR)]); th=a.max()*0.25; return int(np.argmax(a>th))/SR
for v in m['voices']+m['reloads']:
    x,sr=sf.read(D+v['file'],dtype='float32'); assert sr==SR
    slot=m['slot'] if v['file'].startswith('guns') else m['reload_slot']
    r=dict(seconds=len(x)/SR, peak=db(float(np.abs(x).max())), cuts=[])
    for k in range(len(v['cuts'])):
        c=x[int(k*slot*SR):int((k+1)*slot*SR)]
        on=onset(c); cc=c[int(on*SR):]
        d=dict(loud=loud(c), above10=share(cc[:int(1.0*SR)],10000), above20=share(cc[:int(1.0*SR)],20000), on=on)
        if v['file'].startswith('guns'):
            d['end']=env(c, on+0.985, 0.012)
            d['clap']=max(env(c,on+t/1000.0) for t in range(119,138,1))-min(env(c,on+t/1000.0) for t in range(95,116,2))
            d['tail']=db(float(np.sqrt((cc[int(0.5*SR):int(0.9*SR)]**2).mean())))-db(float(np.abs(cc[:int(0.02*SR)]).max()))
            if k==2:
                hp=signal.sosfilt(signal.butter(4,4000,'highpass',fs=SR,output='sos'),cc)
                def e(a,t0,t1): return db(float(np.sqrt((a[int(t0*SR):int(t1*SR)]**2).mean())))
                d['dive']=e(cc,0.315,0.351)-e(cc,0.368,0.388); d['dull']=e(hp,0.315,0.351)-e(hp,0.368,0.388); d['floor']=e(cc,0.368,0.388)
        r['cuts'].append(d)
    out[v['file']]=r
print(json.dumps(out))
`;
let M = {};
try { M = JSON.parse(execFileSync('python3', ['-c', PY], { encoding: 'utf8', maxBuffer: 1 << 26 })); } catch (e) { ok('the sprites decode', false, String(e).slice(0, 200)); }
const voices = man.voices, files = voices.map(v => v.file);
ok('twelve gun voices (three guns, yours and theirs, A and C) of five takes, six reloads of three', voices.length === 12 && voices.every(v => v.cuts.length === 5) && files.every(f => M[f]) && man.reloads.every(r => M[r.file]));
ok('every sprite is as long as its takes (5 x 1.25 s, 3 x 1.25 s)', voices.every(v => Math.abs(M[v.file].seconds - 6.25) < 0.1) && man.reloads.every(r => Math.abs(M[r.file].seconds - 3.75) < 0.1));
ok('nothing over -1 dBFS (decoded)', Object.values(M).every(r => r.peak <= -0.9), Math.max(...Object.values(M).map(r => r.peak)).toFixed(2) + ' dB');
const spread = voices.map(v => { const l = M[v.file].cuts.map(c => c.loud); return Math.max(...l) - Math.min(...l); });
ok('every take of a voice as loud as the others (within 1 dB, decoded)', spread.every(s => s <= 1.0), 'worst ' + Math.max(...spread).toFixed(2) + ' dB');
ok('every shot is quiet at two beats (no click at its end)', voices.every(v => M[v.file].cuts.every(c => c.end < -45)), 'loudest end ' + Math.max(...voices.flatMap(v => M[v.file].cuts.map(c => c.end))).toFixed(1) + ' dB');
const A = voices.filter(v => v.version === 'a'), C = voices.filter(v => v.version === 'c');
ok('A is inside the VHS band: under 5 percent of every take above 10 kHz, under 1 percent above 20 kHz', A.every(v => M[v.file].cuts.every(c => c.above10 < 0.05 && c.above20 < 0.01)), 'worst ' + (100 * Math.max(...A.flatMap(v => M[v.file].cuts.map(c => c.above10)))).toFixed(2) + ' percent');
const claps = A.flatMap(v => M[v.file].cuts.map(c => c.clap));
ok('THE STREET ON THE GRID: in every A take the canyon claps back a 16th after the crack (125 ms, 6 dB over the gap before it)', claps.every(c => c >= 6), 'weakest ' + Math.min(...claps).toFixed(1) + ' dB');
const tailUp = A.map(v => { const c = voices.find(w => w.gun === v.gun && w.perspective === v.perspective && w.version === 'c');
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length; return mean(M[v.file].cuts.map(x => x.tail)) - mean(M[c.file].cuts.map(x => x.tail)); });
ok('THE CAMCORDER: A\'s tail (0.5 to 0.9 s) stands higher against its crack than C\'s, every voice (the gain breathing back)', tailUp.every(t => t >= 6), 'least ' + Math.min(...tailUp).toFixed(1) + ' dB');
const dives = A.map(v => M[v.file].cuts[2]);
ok('THE DROP-OUT: take three of every A voice dives 6 dB or more and its top goes further, never to zero', dives.every(d => d.dive >= 6 && d.dull >= d.dive && d.floor > -90), dives.map(d => d.dive.toFixed(0) + '/' + d.dull.toFixed(0)).join(' '));
ok('THEIRS is five dB under YOURS (the manifest\'s loudness)', ['pistol', 'shotgun', 'rifle'].every(g => ['a', 'c'].every(x => {
  const y = voices.find(v => v.gun === g && v.perspective === 'yours' && v.version === x), t = voices.find(v => v.gun === g && v.perspective === 'theirs' && v.version === x);
  return Math.abs((y.loud_100ms_db - t.loud_100ms_db) - 5) < 0.05; })));
ok('the SHOTGUN is the loudest gun, the PISTOL the quietest (his words: one huge hit; armor barely feels it)', (() => { const L = g => voices.find(v => v.gun === g && v.perspective === 'yours' && v.version === 'a').loud_100ms_db; return L('shotgun') > L('rifle') && L('rifle') > L('pistol'); })());

/* ---------------- WHAT PLAYS NOW ---------------- */
let fresh = null;
try { fresh = JSON.parse(execFileSync('python3', ['-c', 'import sys, json; sys.path.insert(0, "' + path.join(ROOT, 'tools') + '"); import bohemia_guns_heard as G; print(json.dumps(G.what_plays_now()["pools"]))'], { encoding: 'utf8' })); } catch (e) { ok('the alpha\'s pools re-read', false, String(e).slice(0, 200)); }
const nowFile = JSON.parse(rd(DIR + '/fight_now.json'));
ok('B is the alpha\'s own pools for the fight\'s events, re-read from the alpha now (APPROVED and SIBLINGS)', fresh && JSON.stringify(fresh) === JSON.stringify(nowFile.pools) && nowFile.pools.shot.length >= 1);
const meas = JSON.parse(rd(DIR + '/now_measured.json'));
const shot3 = meas.events.shot.find(c => c.cand === 'shot.3'), more = meas.events.shot.filter(c => /^shot_more/.test(c.cand));
ok('measured in a real engine render: the game\'s shot today, his shot.3 and its five siblings (the record\'s finding)', shot3 && more.length === 5 && typeof meas.shot_loud_100ms_db === 'number', 'shot.3 ' + (shot3 && shot3.loud_100ms_db) + ' dB, siblings ' + more.map(c => c.loud_100ms_db).join(' '));

/* ---------------- THE GAME UNTOUCHED ---------------- */
const fight = rd('slices/BOHEMIA_FIGHT.html'), alpha = rd('slices/BOHEMIA_ALPHA_0_9.html'), demo = rd('slices/BOHEMIA_DEMO.html');
/* RE-AIMED 10/24 (SOUNDS [the bullet lands]) to rule 127 (Paolo 10/23: 'I haven't seen any votes in the alpha, it's okay if
   not; if you know there's something I'm in love with, just use tokens towards that'): no YES is waited for any more, so the
   real guns are IN the game, through the bullet lands' player: the alpha and the demo carry this engine byte for byte inside
   that one block (gates/bullet_lands_gate.js holds the rest), and the fight, COMBAT's file, still carries none of it. */
const eng = rd('engine/bohemia_guns_heard.js').trimEnd() + '\n';
const inBlock = s => { const a = s.indexOf('<!-- __THE_BULLET_LANDS__ (SOUNDS 10/24, rule 120) -->'), b = s.indexOf('<!-- /__THE_BULLET_LANDS__ -->'); return a >= 0 && b > a && s.slice(a, b).indexOf(eng) >= 0 && s.split('BOH_GUNS_HEARD = {').length === 2; };
ok('rule 127: the real guns are in the game, the alpha and the demo carry this engine byte for byte inside THE BULLET LANDS\' block, the fight (COMBAT\'s file) none of it', inBlock(alpha) && inBlock(demo) && !/bohemia_guns_heard|guns_heard\//.test(fight));

/* ---------------- THE CARD ---------------- */
const reg = JSON.parse(rd('records/target/BOHEMIA_VOTE_REGISTRY.json'));
const card = reg.items.find(i => i.id === CARD);
ok('the card is in the registry: this page, a sound, SOUNDS, a draft, three options, a sha', card && card.kind === 'sound' && card.lane === 'sounds' && card.draft === true && card.show && card.show.how === 'page' && card.show.src === path.basename(PAGE) && card.options.length === 3 && !!card.sha);
const cue = rd('BUILD_CALLING_SCRIPT.md');
ok('CUE 7.7 names the card, the fight\'s three lines and this gate', /CUE 7\.7 \| SOUNDS \|[^\n]*sounds-the-guns-heard-10-19[^\n]*guns_heard_gate\.js/.test(cue));

/* ---------------- THE PAGE, HIS WAY ---------------- */
const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (_e) { ok('playwright', false); return finish(); }
  await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  let fightLoads = 0; page.on('request', r => { if (/\/slices\/BOHEMIA_FIGHT\.html/.test(r.url())) fightLoads++; });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 0.75e6 / 8 });
  /* the VOTE tab's frame: the card's page at 62vh on a 390 x 844 phone */
  await page.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_VOTE_TAB.html', { waitUntil: 'commit' }).catch(() => {});
  await page.setContent('<html><body style="margin:0;background:#000"><iframe id="card" style="width:100%;height:62vh;border:0" src="http://127.0.0.1:' + PORT + '/' + PAGE + '"></iframe></body></html>');
  const t0 = Date.now();
  const frame = async () => { for (let i = 0; i < 200; i++) { const f = page.frames().find(f => /BOHEMIA_THE_GUNS_HEARD/.test(f.url())); if (f) return f; await page.waitForTimeout(50); } return null; };
  const F = await frame();
  if (!F) { ok('the card\'s page opens in the frame', false); return finish(browser); }
  await F.waitForFunction(() => typeof window.__guns === 'function', null, { timeout: 30000 }).catch(() => {});
  /* a tap three seconds in: a gun within two seconds of it, on the slow network */
  await page.waitForTimeout(Math.max(0, 3000 - (Date.now() - t0)));
  const tap = Date.now(); await F.click('#g-shotgun');
  let g = null, firstAt = null;
  for (let i = 0; i < 100; i++) { g = await F.evaluate(() => window.__guns()); if (g.played > 0) { firstAt = Date.now() - tap; break; } await page.waitForTimeout(50); }
  ok('A GUN WITHIN TWO SECONDS OF A TAP, three seconds after the card opens, on a 1.6 Mbps network', firstAt !== null && firstAt <= 2000, firstAt + ' ms');
  ok('the tap fired YOUR SHOTGUN, the street on tape (A, the default)', g && g.log.length && /guns_shotgun_yours_a\.mp3/.test(g.log[g.log.length - 1].name));
  /* B: the game's engine, through the alpha's output chain */
  await F.click('#opt-b'); const b0 = (await F.evaluate(() => window.__guns())).heard.b;
  await page.waitForTimeout(400); await F.click('#g-rifle');
  let bOk = false; for (let i = 0; i < 40; i++) { g = await F.evaluate(() => window.__guns()); if (g.heard.b > b0) { bOk = true; break; } await page.waitForTimeout(50); }
  ok('B renders what plays now through the game\'s own engine', bOk);
  await F.click('#opt-c'); await page.waitForTimeout(300); const ctap = Date.now(); await F.click('#g-pistol');
  let cAt = null; for (let i = 0; i < 60; i++) { g = await F.evaluate(() => window.__guns()); if (g.log.some(x => /guns_pistol_yours_c\.mp3/.test(x.name))) { cAt = Date.now() - ctap; break; } await page.waitForTimeout(50); }
  ok('C plays the clean recording, within two seconds of the tap', cAt !== null && cAt <= 2000, cAt + ' ms');
  const rtap = Date.now(); await F.click('#reload');
  let rAt = null; for (let i = 0; i < 60; i++) { g = await F.evaluate(() => window.__guns()); if (g.log.some(x => /reload_pistol_c\.mp3/.test(x.name))) { rAt = Date.now() - rtap; break; } await page.waitForTimeout(50); }
  ok('RELOAD plays the last gun\'s real motions, within two seconds of the tap', rAt !== null && rAt <= 2000, rAt + ' ms');
  await F.click('#opt-a');
  /* the fight, playing itself at real speed, heard through the new guns */
  let hooked = false; for (let i = 0; i < 450; i++) { g = await F.evaluate(() => window.__guns()); if (g.hooked) { hooked = true; break; } await page.waitForTimeout(100); }
  const hookAt = Date.now() - t0;
  ok('the real fight loads in the card and plays itself (on a 1.6 Mbps network)', hooked, (hookAt / 1000).toFixed(1) + ' s');
  ok('the company carries the three guns and the marksmen carry crossbows (their rifle)', g.units && ['firearm', 'dagger', 'crossbow'].every(c => g.units.some(u => u.side === 'you' && u.cls === c)) && g.units.filter(u => u.name === 'MARKSMAN').every(u => u.cls === 'crossbow'));
  const before = g.log.length;
  await page.waitForTimeout(30000);
  g = await F.evaluate(() => window.__guns());
  const fightShots = g.log.slice(before).map(x => x.name);
  ok('in thirty seconds of the fight at real speed, its guns are heard through the new sounds, yours and theirs', fightShots.filter(n => /^guns_/.test(n)).length >= 4 && fightShots.some(n => /_yours_a/.test(n)) && fightShots.some(n => /_theirs_a/.test(n)), fightShots.join(' ').replace(/\.mp3/g, ''));
  ok('the fight loaded once: no tap reloaded it', fightLoads === 1, fightLoads + ' loads');
  ok('the fight\'s own bang stands down on this page (never a gun heard twice)', g.heard.fight > 0 && g.heard.old === 0, g.heard.old + ' old shots posted');
  const lay = await F.evaluate(() => { const bs = Array.from(document.querySelectorAll('button')); const W = document.documentElement.clientWidth;
    return { minH: Math.min(...bs.map(b => b.getBoundingClientRect().height)), off: bs.some(b => b.getBoundingClientRect().right > W + 0.5), scroll: document.documentElement.scrollWidth > W, fight: document.getElementById('fight').getBoundingClientRect().height }; });
  ok('every button 44 px tall and on a 390 px screen, no sideways scroll; the fight keeps 200 px of the frame', lay.minH >= 44 && !lay.off && !lay.scroll && lay.fight >= 200, JSON.stringify(lay));
  ok('nothing throws', errs.length === 0, errs.slice(0, 2).join(' | '));
  return finish(browser);
})().catch(e => { ok('the page run', false, String(e).slice(0, 300)); finish(); });

async function finish(browser) {
  try { if (browser) await browser.close(); } catch (_e) {}
  try { srv.close(); } catch (_e) {}
  console.log('\nTHE GUNS HEARD GATE: ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
}
