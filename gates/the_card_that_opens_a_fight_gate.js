#!/usr/bin/env node
/* THE CARD THAT OPENS A FIGHT (FIGHT SCREEN TWO 11/14/26; VAMILY rule 450(a), ask row 621; rules 449(a), 441, 224, 12).
   PAOLO 11/14, twice: 'The card bro, the combat card is UGLY AS SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN FINAL SHIT.'
   MEASURED BEFORE (records/BOHEMIA_FIGHT_SCREEN_THE_TEARDOWN_OF_THE_CARDS_11_14_26.md): the card where he chooses ENGAGE or FALL
   BACK had no leader, no face and no why; the lane before named a blocker (a face on the card would not be the man in the fight
   until the band's looks were handed over). MEASURED NOW: the map carries the fight's own engine and the fight deals a band's
   looks by its place in the band, so the card can ASK the fight which faces will stand.
   THE LAW NOW: a face the card shows clearly is a man who stands in the fight, every time; the one who says why on the card is
   the one who says it at the bell, in the same words; a face the card cannot be sure of is shown dark, never guessed; and the
   card changes nothing of the map's hand-over.
   THE LEGS (the fight's own page as the bench, the map's engine reader loaded on it the way the map loads it):
     C1  THE SEAM IS ONE LINE: the map file carries the card's two scripts and ONE marked line in meetShow; this lane's file
         writes no hand-over (no postMessage, no cityHandOver, no party.band written) and moves the map's pieces, never rebuilds them
     C2  NOTHING UNDER 11 POINTS in the card's own stylesheet
     C3  THE PROMISE HOLDS: six bands, each asked the card's way, then dealt for real forty times on fresh dice: every face the
         card calls sure is on the board in every deal, worn by a man of that kind; a band of two or more shows faces (not all dark)
     C4  WHO SAYS IT: men with a leader: the leader says it; beasts: one of HIS men says it; a lone man whose pool holds a carried
         look is never promised (no note is left)
     C5  THE BELL KEEPS THE CARD'S WORD: the fight opened for the band the card read: the man wearing the card's face says the
         card's sentence (UI.whySaid.card line and face true), once more and small
     C6  A STALE NOTE IS NOT TRUSTED: a note for another band is not read; a note is read once
     planted: a note whose face is not on the board: the bell says so (card.face false) and its own leader speaks (C5 red on it)
   Run: node gates/the_card_that_opens_a_fight_gate.js      (about a minute) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const done = () => { console.log('\nTHE CARD THAT OPENS A FIGHT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
(async () => {
  /* C1, C2: read off the files */
  const map = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8'), mod = fs.readFileSync(path.join(ROOT, 'slices/bohemia_fight_opener.js'), 'utf8');
  const code = mod.replace(/\/\*[\s\S]*?\*\//g, '');
  const hooks = (map.match(/BohemiaFightOpener\.dress\(/g) || []).length, inMeet = /function meetShow\(msg, skin\)\{[\s\S]*?BohemiaFightOpener\.dress\(el, msg[\s\S]*?\n\}\n/.test(map);
  const tags = /<script src="bohemia_fight_why\.js"><\/script>\s*<script src="bohemia_fight_opener\.js"><\/script>/.test(map);
  const writes = ['postMessage', 'cityHandOver', '.band =', 'party.band=', '__HANDED', 'nfOpts('].filter(w => code.indexOf(w) >= 0), rebuilds = /mc\.innerHTML\s*=/.test(code) || /el\.innerHTML\s*=/.test(code);
  check(hooks === 1 && inMeet && tags && !writes.length && !rebuilds, 'C1', 'the seam: ' + hooks + ' marked line in meetShow, the two scripts ' + (tags ? 'loaded' : 'MISSING') + '; this file writes no hand-over (' + (writes.join(', ') || 'none') + ') and rebuilds none of the map\'s pieces');
  const sizes = (code.match(/(?:font:[^;'"]*?|font-size:)\s*(\d+(?:\.\d+)?)px/g) || []).map(s => +/(\d+(?:\.\d+)?)px/.exec(s)[1]);
  check(sizes.length >= 8 && Math.min.apply(null, sizes) >= 11, 'C2', sizes.length + ' type sizes in the card\'s stylesheet, the smallest ' + Math.min.apply(null, sizes) + ' points');
  let chromium = null; try { chromium = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })().chromium; } catch (e) {}
  if (!chromium) { check(false, 'C3', 'no browser on this box'); return done(); }
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(fs.readFileSync(f)); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port, URL0 = 'http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html';
  const COMPANY = [{ background: 'militia', level: 2, gear: { main: 'snub_revolver' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'handgonne' } }, { name: 'RAUL', background: 'militia', level: 5, gear: { main: 'shortsword' } }];
  const BANDS = { led: ['brigand_thug', 'brigand_thug', 'brigand_leader', 'brigand_raider', 'brigand_marksman', 'brigand_thug'], thugs: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'], lone: ['brigand_thug'],
    poachers: ['brigand_poacher', 'brigand_poacher', 'brigand_thug'], captain: ['watch_captain', 'brigand_thug', 'house_shield', 'brigand_marksman'], beasts: ['direwolf', 'direwolf', 'hyena'] };
  const optsFor = (k) => ({ why: 'road:' + k, deploy: false, teach: false, met: 3, district: 'suburb', cell: { gx: 40, gy: 40 }, party: { count: BANDS[k].length, days: 40, difficulty: 1, band: BANDS[k], rolled: true, faction: k === 'beasts' ? 'beasts' : 'brigands' }, company: COMPANY });
  const b = await chromium.launch(), errs = [], ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const open = async (o) => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 140))); await p.addInitScript(o => { window.FIGHT_OPTS = o; try { Object.keys(localStorage).forEach(k => { if (!/fight\.(opener|why)\.v1$/.test(k)) localStorage.removeItem(k); }); } catch (e) {} }, o); await p.goto(URL0);   /* never a fight kept from the page before */
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0, null, { timeout: 45000 }); return p; };
  try {
    /* the bench: the fight's page with the map's engine reader and the card's file on it, the door answering with this gate's company */
    const bench = await open(Object.assign(optsFor('led'), { why: 'bench' }));
    await bench.addScriptTag({ url: 'http://127.0.0.1:' + port + '/slices/bohemia_job_danger.js' }); await bench.addScriptTag({ url: 'http://127.0.0.1:' + port + '/slices/bohemia_fight_opener.js' });
    await bench.evaluate(async (COMPANY) => { await BohemiaJobDanger.engine();
      BohemiaJobDanger.doorOpts = function (party) { return { district: 'suburb', company: JSON.parse(JSON.stringify(COMPANY)), party: { count: party.band.length, band: party.band.slice(), faction: party.faction, days: party.days, difficulty: party.difficulty, rolled: true }, auto: true, odds: false, met: 0, deploy: false }; }; }, COMPANY);
    const asked = {};
    for (const k of Object.keys(BANDS)) asked[k] = await bench.evaluate(async ([k, band]) => {
      const msg = { why: 'road:' + k, party: { count: band.length, band: band, faction: k === 'beasts' ? 'beasts' : 'brigands', days: 40, difficulty: 1 } };
      const R = await BohemiaFightOpener.read(msg), note = JSON.parse(localStorage.getItem(BohemiaFightOpener.NOTE_KEY) || 'null');
      if (!R) return { none: BohemiaFightOpener.err || 'no read' };
      /* forty real deals on fresh dice, the door's own opts */
      const E = BohemiaJobDanger.fresh(), o = BohemiaJobDanger.doorOpts(msg.party), sure = R.them.filter(u => u.sure && !u.beast), broken = [], seen = {};
      for (let s = 0; s < 40; s++) { E.seed((Date.now() ^ (s * 2654435761)) >>> 0); E.F.setup(JSON.parse(JSON.stringify(o)));
        const on = E.F.S.units.filter(u => u.side === 'them'); on.forEach(u => { seen[u.look] = 1; });
        sure.forEach(u => { if (!on.some(x => x.look === u.look && x.kind === u.kind)) broken.push(u.look + '@' + s); });
        if (R.speaker && R.speaker.sure && R.speaker.side === 'them' && !on.some(x => x.look === R.speaker.look && !x.beast && !x.ghost && !x.machine)) broken.push('SPEAKER ' + R.speaker.look + '@' + s); }
      return { n: R.them.length, sure: sure.length, dark: R.them.filter(u => !u.sure).length, broken: broken, looks: Object.keys(seen).length, speaker: R.speaker, side: R.side, line: R.line, rule: R.rule, note: note, deals: R.deals, longest: R.longest, mine: R.mine.map(u => u.name) };
    }, [k, BANDS[k]]);
    const men = ['led', 'thugs', 'lone', 'poachers', 'captain'], bad = Object.keys(asked).filter(k => asked[k].none || asked[k].broken.length), faceless = ['led', 'thugs', 'poachers', 'captain'].filter(k => !asked[k].none && asked[k].sure < 1);
    check(!bad.length && !faceless.length, 'C3', 'six bands asked the card\'s way (' + (asked.led.deals || '?') + ' deals each), then 40 real deals each: ' + Object.keys(asked).map(k => k + ' ' + (asked[k].none ? 'NOT READ' : asked[k].sure + ' sure, ' + asked[k].dark + ' dark of ' + asked[k].n + ', ' + asked[k].broken.length + ' broken')).join('; ') + (bad.length ? ' | BROKEN: ' + bad.map(k => k + ' ' + JSON.stringify((asked[k].broken || []).slice(0, 3))).join(' ') : ''));
    const L = asked.led, C = asked.captain, B = asked.beasts, O = asked.lone;
    const c4 = L.speaker && L.speaker.kind === 'brigand_leader' && L.speaker.sure && !!L.line && C.speaker && C.speaker.kind === 'watch_captain' && B.side === 'ours' && B.speaker && B.speaker.side === 'ours' && B.mine.indexOf(B.speaker.name) >= 0 && !!B.line && O.speaker && !O.speaker.sure && !O.note;
    check(!!c4, 'C4', 'who says it: led ' + (L.speaker && L.speaker.name) + ' (' + (L.speaker && L.speaker.kind) + '), the watch ' + (C.speaker && C.speaker.kind) + ', beasts ' + (B.speaker && B.speaker.name) + ' of his own (' + B.side + '); the lone thug is ' + (O.speaker && O.speaker.sure ? 'PROMISED' : 'not promised') + ', note ' + (O.note ? 'LEFT' : 'none'));
    /* C5: the bell, for the band the card read (the note is on this origin's storage) */
    const bell = async (k, plant) => { await bench.evaluate(async ([k, band, plant]) => { const msg = { why: 'road:' + k, party: { count: band.length, band: band, faction: k === 'beasts' ? 'beasts' : 'brigands', days: 40, difficulty: 1 } };
        await BohemiaFightOpener.read(msg); if (plant) { const N = JSON.parse(localStorage.getItem(BohemiaFightOpener.NOTE_KEY)); plant(N); } }, [k, BANDS[k], null]);
      if (plant) await bench.evaluate((how) => { const K = BohemiaFightOpener.NOTE_KEY, N = JSON.parse(localStorage.getItem(K)); if (how === 'face') N.look = 'person_nobody_9'; if (how === 'band') N.band = 'brigand_thug'; localStorage.setItem(K, JSON.stringify(N)); }, plant);
      const note = await bench.evaluate(() => JSON.parse(localStorage.getItem(BohemiaFightOpener.NOTE_KEY) || 'null'));
      const p = await open(optsFor(k)); await p.waitForFunction(() => !!UI.whySaid, null, { timeout: 20000 }); await p.waitForTimeout(400);
      const out = await p.evaluate(() => ({ said: UI.whySaid, small: document.getElementById('why').classList.contains('said'), shown: getComputedStyle(document.getElementById('why')).display !== 'none', left: localStorage.getItem('bohemia.fight.opener.v1') })); await p.close(); return { note: note, out: out }; };
    const b1 = await bell('led'), b2 = await bell('beasts');
    const kept = (x) => x.note && x.out.said && x.out.said.card && x.out.said.card.line && x.out.said.card.face && x.out.said.line === x.note.line && x.out.said.byLook === x.note.look && x.out.small && x.out.shown;
    check(kept(b1) && kept(b2), 'C5', 'the bell keeps the card\'s word: led: ' + (b1.out.said.by || JSON.stringify(b1.out.said)) + ' "' + b1.out.said.line + '" card ' + JSON.stringify(b1.out.said.card) + (b1.out.small ? ', small' : ', NOT SMALL') + '; beasts: ' + b2.out.said.by + ' "' + b2.out.said.line + '" card ' + JSON.stringify(b2.out.said.card));
    const b3 = await bell('led', 'band');
    check(b3.out.said && !b3.out.said.none && b3.out.said.card === null && !b3.out.small && b3.out.left === null && b1.out.left === null, 'C6', 'a note for another band is not read (card ' + JSON.stringify(b3.out.said.card) + ', the bell said its own: "' + b3.out.said.line + '"); a note is read once (left: ' + b1.out.left + ')');
    const b4 = await bell('led', 'face');
    check(!kept(b4) && b4.out.said && b4.out.said.card && b4.out.said.card.face === false && !!b4.out.said.by && !b4.out.small, 'planted', 'a note whose face is not on the board: the bell says so (card ' + JSON.stringify(b4.out.said.card) + ') and ' + b4.out.said.by + ' speaks, full size: C5 is red on it');
    check(!errs.length, 'errors', errs.length + ' page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  } catch (e) { check(false, 'ran', String(e && e.stack || e).slice(0, 400)); }
  await b.close(); srv.close(); done();
})();
