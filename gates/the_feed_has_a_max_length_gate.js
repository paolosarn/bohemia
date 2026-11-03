#!/usr/bin/env node
/* THE FEED HAS A MAX LENGTH (FIXES item 9, VAMILY rule 350, ask line 360; Paolo 11/3: 'find a final character count that's the max
   capacity... make the text slightly tighter... the feed is broken right now... the tweets are too fat... they're like loading half
   the time'). records/BOHEMIA_PAOLO_THE_FEED_HAS_A_MAX_LENGTH_11_3_26.md.

   Legs:
   1. EVERY FEED LINE UNDER THE MAX WITH ITS LONGEST FILLS: every line of the feed's data files (records/target/bb/feed_kinds.json,
      the one file the game reads, WORDS' bank it is built from, and the world feed records/target/bb/feed_world.json: every kind, reply and follow-up, English and its Spanglish
      twin), with every {fill} at its longest real value, is at most 120 characters; every handle (and its act two and three names)
      at most 16. The longest values come from the data: {company} the new-company door's own maxlength, {town} and {toward} the
      longest town the map seats, {place} and {road} the feed's own lists, {enemy} and {faction} the longest faction plural, {man}
      the longest first name plus the longest surname the names engine can roll; the small fills are stated below.
   2. ON THE UPRIGHT PHONE (390 x 844, touch), through the coordinator's fitStrip (slices/bohemia_phone.js, 9 px down to 6 px): the
      six longest real posts under a 16-letter handle each fit at 6 px or more with every word in the box. The three-jobs strip is
      measured and printed, not judged (the strip is the coordinator's; rule 350(4)'s step-up is not built).
   Run: node gates/the_feed_has_a_max_length_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MAX = 120, HANDLE = 16;
let pass = 0, fail = 0;
const ok = (what, c, why) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- 1. the longest real fills ---------- */
const FK = JSON.parse(rd('records/target/bb/feed_kinds.json'));
const BANK = JSON.parse(rd('banks/BOHEMIA_WORDS_THE_FEED_BANK.json'));
const WORLD = fs.existsSync(path.join(ROOT, 'records/target/bb/feed_world.json')) ? JSON.parse(rd('records/target/bb/feed_world.json')) : { kinds: [], accounts: [] };   /* WORDS' world feed (rule 352), merged at boot */
const longest = xs => xs.filter(x => typeof x === 'string').reduce((a, b) => (b.length > a.length ? b : a), '');
const coMax = +((rd('slices/BOHEMIA_ALPHA_0_9.html').match(/id="newconame"[^>]*maxlength="(\d+)"/) || [])[1] || 0);
const bases = Object.keys(JSON.parse((rd('slices/BOHEMIA_CITY_WORLD.html').match(/var CT_BASES_BAKED = (\{.*?\});/) || [, '{}'])[1]));
const NM = require(path.join(ROOT, 'engine/bohemia_names.js')).MIX;
const flat = o => Array.isArray(o) ? o : Object.keys(o || {}).reduce((a, k) => a.concat(flat(o[k])), []);
const manMax = longest(flat(NM.given)).length + 1 + longest(flat(NM.surname)).length;
const FILL = {
  company: 'C'.repeat(coMax), companyhandle: 'c'.repeat(coMax), town: longest(bases), toward: longest(bases),
  place: longest(Object.values(FK.places || {})), road: longest(flat(FK.roads)),
  enemy: longest(Object.values(FK.faction_says || {})), faction: longest(Object.values(FK.faction_says || {})), man: 'M'.repeat(manMax),
  /* stated: a count or a price never runs past three digits, a good past 12 letters, a rare kind or an origin past 16 */
  count: '999', high: '999', low: '999', start: '999', paid: '999', days_left: '999', days: '999', now: '999 batteries', was: '999 batteries',
  good: 'g'.repeat(12), rare: 'r'.repeat(16), origin: 'o'.repeat(16)
};
ok('the longest fills are read from the data', coMax >= 16 && bases.length >= 10 && FILL.place.length > 5 && FILL.road.length > 5 && FILL.enemy.length > 5 && manMax >= 15,
  'company ' + coMax + ', town ' + FILL.town.length + ' (' + FILL.town + '), place ' + FILL.place.length + ', road ' + FILL.road.length + ', faction ' + FILL.enemy.length + ', man ' + manMax);
const lines = [], handles = [];
(function walk(o, where) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, where));
  if (!o || typeof o !== 'object') return;
  ['en', 'es'].forEach(k => { if (typeof o[k] === 'string' && o[k].trim()) lines.push({ t: o[k], where }); });
  Object.keys(o).forEach(k => { if (k === 'en' || k === 'es') return; walk(o[k], where); });
})({ kinds: FK.kinds, replies: FK.replies, followups: FK.followups, world: WORLD.kinds }, 'feed_kinds.json and feed_world.json');
(function walk(o) { if (Array.isArray(o)) return o.forEach(walk); if (!o || typeof o !== 'object') return;
  ['en', 'es'].forEach(k => { if (typeof o[k] === 'string' && o[k].trim()) lines.push({ t: o[k], where: 'the bank' }); });
  Object.keys(o).forEach(k => { if (k !== 'en' && k !== 'es' && k !== 'accounts') walk(o[k]); }); })(BANK);
[FK.accounts, BANK.accounts, WORLD.accounts].forEach(A => (A || []).forEach(a => { if (a.handle) handles.push(a.handle); Object.values(a.acts || {}).forEach(h => { if (h) handles.push(h); }); }));
const fill = t => t.replace(/\{(\w+)\}/g, (m, k) => (FILL[k] != null ? FILL[k] : m));
const unknown = [...new Set(lines.map(l => (l.t.match(/\{(\w+)\}/g) || []).filter(m => FILL[m.slice(1, -1)] == null)).flat())];
ok('every fill a feed line uses has a longest value here', !unknown.length, unknown.join(' ') || 'all known');
const over = lines.filter(l => fill(l.t).length > MAX);
ok('*** EVERY FEED LINE AT ' + MAX + ' OR UNDER WITH ITS LONGEST FILLS *** (' + lines.length + ' lines, English and Spanglish, the game\'s file and the bank)',
  lines.length > 500 && !over.length, over.slice(0, 3).map(l => fill(l.t).length + ': ' + l.t.slice(0, 70)).join(' | ') || 'longest ' + Math.max.apply(null, lines.map(l => fill(l.t).length)));
const longH = handles.filter(h => h.length > HANDLE);
ok('every handle at ' + HANDLE + ' or under (' + handles.length + ', every act\'s)', handles.length > 50 && !longH.length, longH.slice(0, 4).join(' ') || 'longest ' + longest(handles));
const dots = lines.filter(l => /(\.\.\.|…)\s*$/.test(l.t));
ok('no line is cut with dots', !dots.length, dots.slice(0, 2).map(l => l.t.slice(0, 60)).join(' | ') || 'none');

/* ---------- 2. on the upright phone, through the coordinator's fitStrip (slices/bohemia_phone.js, d3f1cb29: 9 px down to 6 px) ---------- */
const TXT = "the keeper's machines won at the industrial park. the SOUTHSIDE NIGHT SHIFTS rolled back to Volunteers slow, lights off.";
const WHO = '@' + 'remnants_nellis_'.slice(0, HANDLE);
/* the six longest real posts: the lines that come longest with their longest fills, filled with real-looking names of that length */
const REAL = Object.assign({}, FILL, { company: 'SOUTHSIDE NIGHT SHIFTS'.slice(0, coMax), man: 'GUADALUPE CASTELLANOS'.slice(0, manMax), companyhandle: 'southsidenightshifts' });
const POSTS = [TXT].concat(lines.slice().sort((x, y) => fill(y.t).length - fill(x.t).length).map(l => l.t.replace(/\{(\w+)\}/g, (m, k) => (REAL[k] != null ? REAL[k] : m)))
  .filter((t, i, A) => A.indexOf(t) === i && t.length <= MAX).slice(0, 5));
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d = null;
  try { d = await open({ profile: 'phone_portrait', door: 120000, engage: true }); } catch (e) { ok('the demo opened on the upright phone', false, String(e.message).slice(0, 120)); return end(); }
  const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const until = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await p.waitForTimeout(150); } return false; };
  const put = async (txt) => fr.evaluate(([who, txt]) => { const P = window.BohemiaPhone && BohemiaPhone.P; if (!P) return false; P.posts = () => [{ who, txt, kind: 'world' }]; return true; }, [WHO, txt]);
  const measure = () => p.evaluate(() => { const fp = document.querySelector('#bohphone .home .bpfd .fp'), sp = fp && fp.querySelector('span'); if (!sp || !sp.firstChild) return null;
    const cr = fp.getBoundingClientRect(), tn = sp.firstChild, t = tn.nodeValue.replace(/\s+$/, ''), i = t.lastIndexOf(' ') + 1, rg = document.createRange();
    rg.setStart(tn, i); rg.setEnd(tn, t.length); const lr = rg.getBoundingClientRect(), cs = getComputedStyle(fp);
    return { len: t.length, last: t.slice(i), px: parseFloat(cs.fontSize), seen: lr.width > 0 && lr.bottom <= cr.bottom + 0.5 && lr.right <= cr.right + 0.5 && fp.scrollHeight <= fp.clientHeight + 0.5,
      font: cs.fontSize + '/' + cs.lineHeight }; });
  try {
    await until(() => p.evaluate(() => { const b = document.querySelector('#bohphone .home .bpfd'); return !!b && b.getBoundingClientRect().height > 10; }), 60000);
    const got = [];
    for (const t of POSTS) { await put(t); await p.waitForTimeout(1600); got.push(await measure()); }
    const bad = got.filter(g => !g || g.px < 6 || !g.seen);
    ok('*** THE STRIP: the six longest real posts (the longest ' + Math.max.apply(null, POSTS.map(t => t.length)) + ' letters) under a 16-letter handle each fit at 6 px or more and show every word ***',
      got.length === POSTS.length && !bad.length, got.map(g => g ? g.len + ':' + g.font + (g.seen ? '' : ' CUT') : 'none').join(', '));
    /* the three-jobs strip (20 px): rule 350(4) wants a post that does not fit to step up a line a beat; the strip is the coordinator's
       and is not touched here, so this is measured and said, not judged */
    await p.evaluate(() => document.querySelector('#bohphone .home').classList.add('jobs3'));
    await put(TXT + ' '); await p.waitForTimeout(1600); const j3 = await measure();
    console.log('  note  the three-jobs strip, measured not judged: ' + JSON.stringify(j3));
    await p.evaluate(() => document.querySelector('#bohphone .home').classList.remove('jobs3'));
    ok('no page errors', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the phone was measured', false, String(e && e.message || e).slice(0, 200)); }
  try { await d.close(); } catch (e) { try { await d.browser.close(); } catch (e2) {} }
  end();
})().catch(e => { console.error(e); process.exit(1); });
function end() { console.log('=== THE FEED HAS A MAX LENGTH: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
