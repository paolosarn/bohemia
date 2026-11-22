/* ==========================================================================
   EVERY FOE AGREES  (JOBS 2, 11/22/26, VAMILY rule 475(b), rule 441)

   PAOLO 11/22, his screenshot (records/paolo_shots/BOHEMIA_PAOLO_SHOT_THE_RECEIPT_STILL_THERE_11_22_26.jpg): the end of a beast job read
   'THE GROUND SLOTH ARE DOWN'. FIGHT SCREEN 3 made the end screen's line agree with how many fell (BUILD 11/22zr, __THE_LINE_READS_RIGHT__);
   the coordinator: 'for every kind of foe a job names'. MEASURED over the job file's names, one fell and several fell: four still read
   wrong (THE CREWS AT THE PUMP STATION, THE THIEVES AFTER THE REGULATORS, THE WATER PEOPLE IS, THE SHRUB-OXENS).

     F1  every name a job hands the end screen (the job file's foe_says, every beast look, every row's own, the danger reader's animals),
         one fell and several fell: a group's word stays one (CREW, GANG, PACK IS DOWN); what comes after AFTER, AT, TO is never changed;
         PEOPLE, MEN, OXEN are many even for one; one beast named 'the X' IS DOWN, several ARE DOWN in the many form; A or AN IS DOWN
     F1p PLANTED: main's table before this (no group word, no AFTER, PEOPLE as one) fails F1
     F2  the end screen itself, alone, on a phone upright and sideways: one ground sloth, three ground sloths, the crew at the pump station
         (three), the thieves after the regulator (one), the water people (one): the head says it, whole on the glass
     F3  nothing threw
   node gates/every_foe_agrees_gate.js        FOE_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nEVERY FOE AGREES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SS = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SPOILS_SCREEN.html'), 'utf8');
const K = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8'));

function agreeOf(src) { const a = src.indexOf('var SAME_MANY'), b = src.indexOf('function theyWere('); const W = {}; vm.createContext(W); vm.runInContext(src.slice(a, b), W); return W.foeAgrees; }
function names() {
  const n = new Set(), T = K.foe_says || {};
  for (const k in T) if (!/^_|draft/.test(k)) n.add(String(T[k]).replace('{what}', 'the cold box').replace('{cargo}', 'the water drums').replace('{item}', 'the regulator').replace('{place}', 'the pump station').replace('{dest}', 'Primm').replace('{label}', 'the keepers'));
  const BL = K.beast_looks || {}; for (const k in BL) if (BL[k] && BL[k].label) { const l = String(BL[k].label); n.add(/^(a|an|the) /i.test(l) ? l : 'the ' + l); }
  ((K.board_people && K.board_people.rows) || []).forEach(r => { if (r.foe_says) n.add(r.foe_says); });
  ['coyote', 'dire wolf', 'ground sloth', 'ancient bison', 'feral bull', 'short-faced bear', 'hyena', 'american lion', 'water people', 'house men'].forEach(w => n.add('the ' + w));
  return [...n];
}
/* the rules, read off the name itself */
function wrong(fa) {
  const bad = [];
  names().forEach(nm => {
    const F = nm.toUpperCase(), one = fa(F, true), many = fa(F, false), say = r => r.name + (r.are ? ' ARE' : ' IS') + ' DOWN';
    const words = F.split(' '), k = words.findIndex((w, i) => i > 0 && /^(WHO|THAT|OF|FROM|IN|AT|ON|AFTER|TO|FOR|WITH|BY)$/.test(w)), head = (k > 0 ? words[k - 1] : words[words.length - 1]).split('-').pop();
    const tail = k > 0 ? words.slice(k).join(' ') : '';
    if (/^(A|AN) /.test(F)) { if (one.are || many.are || one.name !== F) bad.push(nm + ': ' + say(one)); return; }
    if (tail && (!one.name.endsWith(tail) || !many.name.endsWith(tail))) bad.push(nm + ' (the words after the head changed): ' + say(many));
    if (/^(CREW|GANG|BAND|PACK|HERD|MOB|FAMILY|WATCH)$/.test(head)) { if (one.are || many.are || many.name !== F) bad.push(nm + ' (a group is one): ' + say(many)); return; }
    if (/^(PEOPLE|[A-Z]*MEN|OXEN|POLICE|FOLK|KIDS|CHILDREN)$/.test(head)) { if (!one.are || !many.are || /OXENS|MENS|PEOPLES/.test(many.name)) bad.push(nm + ' (many even for one): ' + say(one)); return; }
    if (/S$/.test(head) && !/(SS|US|IS)$/.test(head)) { if (!one.are || !many.are) bad.push(nm + ': ' + say(one)); return; }
    if (/^(BISON|DEER|SHEEP)$/.test(head)) { if (one.are || !many.are) bad.push(nm + ': ' + say(one) + ' / ' + say(many)); return; }
    if (one.are || one.name !== F) bad.push(nm + ' (one): ' + say(one));
    if (!many.are || many.name === F) bad.push(nm + ' (several): ' + say(many));
  });
  return bad;
}
{ const bad = wrong(agreeOf(SS)), n = names().length;
  ok('F1 every name a job hands the end screen (' + n + '), one fell and several fell: a group stays one, the words after AFTER/AT/TO never change, PEOPLE/MEN/OXEN are many, one beast IS DOWN and several ARE DOWN',
    n >= 30 && !bad.length, bad.slice(0, 4).join(' | '));
  const old = SS.replace(/\nvar ONE_GROUP = [^\n]*/, '\nvar ONE_GROUP = /^$/;').replace('|FOR|AFTER|TO|OVER|ACROSS|ALONG|BEYOND|AGAINST|UP)$/;', '|FOR)$/;')
    .replace('var SAME_MANY = /^(BISON|DEER|SHEEP|MOOSE|ELK|FISH|SWINE|AIRCRAFT)$/;', 'var SAME_MANY = /^(BISON|DEER|SHEEP|MOOSE|ELK|CATTLE|FISH|SWINE|AIRCRAFT|PEOPLE|POLICE|FOLK)$/;');
  const pb = wrong(agreeOf(old));
  ok('F1p planted: main\'s table before this build fails F1', pb.length >= 4, pb.length + ' wrong: ' + pb.slice(0, 3).join(' | '));
}
if (process.env.FOE_FILES) done();

(async () => {
  const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
  const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + srv.address().port, { chromium } = require('playwright'), b = await chromium.launch(), errs = [];
  const CASES = [['the ground sloth', 1, 'THE GROUND SLOTH IS DOWN'], ['the ground sloth', 3, 'THE GROUND SLOTHS ARE DOWN'], ['the crew at the pump station', 3, 'THE CREW AT THE PUMP STATION IS DOWN'],
    ['the thieves after the regulator', 1, 'THE THIEVES AFTER THE REGULATOR ARE DOWN'], ['the water people', 1, 'THE WATER PEOPLE ARE DOWN']];
  const rows = [];
  try {
    for (const shape of [['upright', 390, 844], ['sideways', 844, 390]]) {
      const ctx = await b.newContext({ viewport: { width: shape[1], height: shape[2] }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      const sp = await ctx.newPage(); sp.on('pageerror', e => errs.push(shape[0] + ': ' + e.message));
      await sp.goto(base + '/slices/BOHEMIA_SPOILS_SCREEN.html');
      await sp.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
      for (const c of CASES) {
        const r = await sp.evaluate(async ([foe, n]) => {
          window.__FIGHT_NOW = { foe: foe };
          const f = JSON.parse(JSON.stringify(BohemiaSpoilsScreen.SAMPLE)), one = f.spoils.bodies[0];
          f.spoils.bodies = Array.from({ length: n }, (_, i) => Object.assign({}, one, { name: 'ONE ' + i, dead: true, fled: false, boss: false }));
          if (f.spoils && f.spoils.recap) f.spoils.recap.head = null;
          localStorage.setItem('bohemia.bag.v1', '[]'); BohemiaSpoilsScreen.open({ fight: f, seed: 7 });
          await new Promise(res => setTimeout(res, 900));
          const w = document.getElementById('head'), q = w ? w.getBoundingClientRect() : null;   /* the result line ('THE ... IS DOWN') */
          return { head: w ? String(w.textContent || '').replace(/\s+/g, ' ').trim() : null, whole: !!w && w.scrollWidth <= w.clientWidth + 1 && q.left >= 0 && q.right <= innerWidth + 1 && q.bottom <= innerHeight };
        }, [c[0], c[1]]);
        rows.push({ shape: shape[0], foe: c[0], n: c[1], want: c[2], head: r.head, whole: r.whole });
      }
      await ctx.close();
    }
  } catch (e) { errs.push(String(e && e.message || e).slice(0, 200)); }
  await b.close(); srv.close();
  const bad = rows.filter(r => r.head !== r.want || !r.whole);
  ok('F2 the end screen alone, a phone upright and sideways: one ground sloth IS DOWN, three are THE GROUND SLOTHS, THE CREW AT THE PUMP STATION IS DOWN for three, THE THIEVES AFTER THE REGULATOR ARE DOWN for one, THE WATER PEOPLE ARE DOWN for one, the head whole on the glass',
    rows.length === 10 && !bad.length, (bad.length ? bad : rows.slice(0, 2)).map(r => r.shape + ' ' + r.n + ' ' + r.foe + ': "' + r.head + '"' + (r.whole ? '' : ' CUT')).join(' | '));
  ok('F3 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  done();
})();
