/* THE TRAIT BEFORE YOU HIRE GATE (RUN TWO, row [the trait before you hire], 10/24/26; rule 133, TUNING's change 9:
   'a recruit's card shows his face, his 3 best things as stars, his one trait in plain words, his price and his nightly cost...
   HARDCORE KEPT: a bad trait is still a bad trait').
     H1  THE TABLE IS THE WIKI'S: records/target/bb/traits.json holds every trait the wiki's Traits page lists, each read off its
         own page in the library (re-read here from the tarball for every trait at the post: the same numbers); the ones at the
         post are only flat numbers on the eight stats; nothing at the post is a status, an event's, the cult's or the arena's
     H2  EVERY MAN AT THE POST SHOWS ONE TRAIT IN PLAIN WORDS before you pay (camp, town, fortress): its name, a few plain words,
         its numbers; never one his background excludes (the wiki's traits_excluded)
     H3  HIS STATS ON THE CARD ARE MOVED BY IT: every number the trait names is his roll plus the trait, coloured up or down
     H4  THE SAME MAN, THE SAME TRAIT: the post opened again is the same man with the same trait
     H5  HE WALKS IN WITH IT: hired, he is kept with his trait and the stats his card showed; the crew screen shows the trait;
         the crew screen's hand-over to the fight carries both
     H6  AND HE FIGHTS AS HIS CARD SAID: a fight handed that company gives him exactly those numbers (the dice for everybody
         else unchanged: a fight handed no stats is the same fight as before)
   Run: node gates/the_trait_before_you_hire_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8875;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const STAT = { Health: 'hp', Fatigue: 'fatigue', Resolve: 'resolve', Initiative: 'initiative', Melee_skill: 'melee_skill', Ranged_skill: 'ranged_skill', Melee_defense: 'melee_defense', Ranged_defense: 'ranged_defense' };

(async () => {
  /* ---- H1 the table is the wiki's ---- */
  const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/traits.json'), 'utf8'));
  const core = fs.readFileSync(path.join(ROOT, 'reference/library/grok/wiki/CORE_WIKITEXT.md'), 'utf8');
  const i0 = core.indexOf('# PAGE Traits'), listed = (core.slice(i0, core.indexOf('# PAGE ', i0 + 5)).match(/\{\{:([^}]+)\}\}/g) || []).map(x => x.slice(3, -2));
  const post = T.traits.filter(t => t.at_the_post);
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'run2traits-'));
  const want = post.map(t => t.wiki_page);
  cp.spawnSync('tar', ['xzf', path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz'), '-C', tmp].concat(want), { encoding: 'utf8' });
  const reread = post.map(t => { const s = fs.readFileSync(path.join(tmp, t.wiki_page), 'utf8'), row = (s.match(/<onlyinclude>([\s\S]*?)<\/onlyinclude>/) || [])[1] || '';
    const got = []; row.replace(/<span style="color:(green|red)">\s*([+-]?\d+)(%?)\s*<\/span>\s*\[\[File:([A-Za-z_]+)\.png/g, (m, c, n, pc, f) => { got.push((STAT[f] || f) + (pc ? '%' : '') + ':' + Math.abs(+n) * (c === 'red' ? -1 : 1)); });
    const mine = t.effects.map(e => e.stat + (e.pct ? '%' : '') + ':' + e.n);
    return { name: t.name, same: got.join() === mine.join() && got.length > 0, got: got.join(' ') }; });
  ok('H1 THE TABLE IS THE WIKI\'S: every trait the Traits page lists is read off its own page in the library',
    listed.length >= 70 && T.traits.length === listed.length && T.missing_pages.length === 0, T.traits.length + ' of ' + listed.length + ' listed');
  ok('  every trait at the post re-read from its page here: the same numbers', post.length >= 10 && reread.every(r => r.same), reread.filter(r => !r.same).map(r => r.name + ' ' + r.got).join('; ') || post.length + ' traits, all the same: ' + post.map(t => t.name).join(', '));
  ok('  at the post only flat numbers on the eight stats; never a status, an event\'s, the cult\'s or the arena\'s',
    post.every(t => t.kind === 'trait' && t.effects.every(e => e.flat_eight) && !/Davkul|Glorious|Arena|Pit|Player|^Fat$/.test(t.name)) && post.every(t => t.says),
    'left out and named: ' + T.traits.filter(t => !t.at_the_post).length);

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.evaluate(() => { try { localStorage.removeItem('bohemia.hired.v1'); } catch (e) {} });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.traitsIn(), null, { timeout: 30000 });
  const BG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/backgrounds.json'), 'utf8')).rows;
  const excl = id => ((BG.find(r => r.id === id) || {}).traits_excluded || []).map(x => x.toLowerCase());
  const SHORT = { hp: 'HP', fatigue: 'FAT', resolve: 'RES', initiative: 'INI', melee_skill: 'MSK', ranged_skill: 'RSK', melee_defense: 'MDF', ranged_defense: 'RDF' };
  const readPost = () => p.evaluate(() => [...document.querySelectorAll('#sbody .hire')].map(c => ({ id: c.dataset.id, trait: c.querySelector('.htrait') && c.querySelector('.htrait').dataset.trait,
    name: (c.querySelector('.htrait b') || {}).textContent, says: (c.querySelector('.htrait span') || {}).textContent, line: (c.querySelector('.htrait em') || {}).textContent,
    stats: [...c.querySelectorAll('.hstats span')].map(e => ({ k: e.dataset.stat, txt: e.textContent, cls: e.className })) })));
  /* the post opened the way a tap does (a tap that only skips the arrival is tapped again) */
  const openHall = async (o) => {
    await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
    await p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: [], night: false, batteries: 9999 }), o);
    for (let k = 0; k < 4; k++) {
      await p.waitForTimeout(400);
      if (await p.evaluate(() => BohemiaSettlement.state.open === 'hall' && document.querySelectorAll('#sbody .hire').length > 0)) break;
      const w = await p.evaluate(() => BohemiaSettlement.where('hall')); if (w) await p.mouse.click(w.x, w.y);
    }
    await p.waitForTimeout(300);
    return readPost();
  };
  /* ---- H2, H3 ---- */
  const seen = [], bad = [], badStats = [];
  for (const tier of ['camp', 'town', 'fortress']) for (const name of ['HENDERSON', 'THE WASH, NORTH LAS VEGAS']) {
    const cards = await openHall({ tier, name });
    const men = await p.evaluate(() => BohemiaSettlement.recruits().map(r => ({ id: r.id, bg: r.backgroundId, stats: r.stats, trait: r.trait ? r.trait.id : r.trait })));
    cards.forEach(c => {
      const m = men.find(x => x.id === c.id), t = post.find(x => x.id === c.trait);
      seen.push({ tier, id: c.id, trait: c.trait });
      if (!m || !t || c.name !== t.name.toUpperCase() || !c.says || c.says !== t.says) { bad.push(tier + ':' + c.id + ' ' + (c.trait || 'none')); return; }
      if (excl(m.bg).includes(t.name.toLowerCase())) bad.push(tier + ':' + c.id + ' ' + t.name + ' is excluded for a ' + m.bg);
      const line = t.effects.map(e => (e.n > 0 ? '+' : '') + e.n + ' ' + SHORT[e.stat]).join('  ');
      if (c.line !== line) bad.push(tier + ':' + c.id + ' line "' + c.line + '" not "' + line + '"');
      /* H3: every stat shown is his roll plus the trait, the moved ones coloured */
      c.stats.forEach(s => { const d = t.effects.filter(e => e.stat === s.k).reduce((a, e) => a + e.n, 0), want = m.stats[s.k] + d;
        if (!new RegExp('^' + SHORT[s.k] + ' ' + want + '(\\s|$)').test(s.txt) || (d > 0 && !/\bup\b/.test(s.cls)) || (d < 0 && !/\bdown\b/.test(s.cls)) || (!d && /\b(up|down)\b/.test(s.cls))) badStats.push(tier + ':' + c.id + ' ' + s.txt + ' (' + s.cls + ') want ' + want); });
    });
  }
  const kinds = [...new Set(seen.map(x => x.trait))];
  ok('H2 EVERY MAN AT THE POST SHOWS ONE TRAIT IN PLAIN WORDS before you pay: its name, its words, the wiki\'s numbers; never one his background excludes',
    seen.length >= 12 && seen.every(x => x.trait) && bad.length === 0, seen.length + ' men, ' + kinds.length + ' different traits (' + kinds.join(', ') + ')' + (bad.length ? '; ' + bad.slice(0, 3).join('; ') : ''));
  ok('H3 HIS STATS ON THE CARD ARE MOVED BY IT: every number his trait names is his roll plus the trait, coloured up or down', badStats.length === 0, badStats.slice(0, 3).join('; ') || 'every stat on every card');
  /* ---- H4 the same man, the same trait ---- */
  const a1 = await openHall({ tier: 'town', name: 'HENDERSON' }), a2 = (await openHall({ tier: 'fortress', name: 'HENDERSON' }), await openHall({ tier: 'town', name: 'HENDERSON' }));
  ok('H4 THE SAME MAN, THE SAME TRAIT: the post opened again is the same men with the same traits', a1.length > 0 && a1.map(c => c.id + c.trait).join() === a2.map(c => c.id + c.trait).join(), a1.map(c => c.trait).join(', '));
  /* ---- H5 hire the first man ---- */
  const first = a2[0];
  await p.evaluate(id => { const c = document.querySelector('#sbody .hire[data-id="' + id + '"]'); const btn = c && [...c.querySelectorAll('button')].find(x => /Hire/.test(x.textContent)); if (btn) btn.click(); }, first.id);
  await p.waitForTimeout(400);
  const kept = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]'));
  const def = kept[kept.length - 1] || {};
  const shownStats = {}; first.stats.forEach(s => { shownStats[s.k] = +s.txt.split(' ')[1]; });
  ok('H5 HE WALKS IN WITH IT: hired, he is kept with his trait and the stats his card showed',
    def.traits && def.traits[0] === first.trait && def.trait && def.trait.name.toUpperCase() === first.name && Object.keys(shownStats).every(k => def.stats[k] === shownStats[k]),
    (def.name || 'nobody') + ': ' + (def.traits || []).join(',') + ' ' + JSON.stringify(def.stats));
  /* the crew screen: his page shows it, and its hand-over carries it */
  const r = await ctx.newPage(); r.on('pageerror', e => errs.push('roster: ' + e.message));
  await r.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await r.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  const rs = await r.evaluate(n => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === n && m.hired); if (i < 0) return null;
    return { i, trait: (S.crew[i].trait || {}).id, company: BohemiaRoster.company(S.crew)[i] }; }, def.name);
  if (rs) { const at = await r.evaluate(i => { const S = BohemiaRosterScreen.state, row = S.front.indexOf(i) >= 0 ? 'front' : 'back', j = S[row].indexOf(i);
      const el = document.querySelector('[data-drag="man:' + row + ':' + j + '"]'); if (!el) return null; el.scrollIntoView({ block: 'center' }); const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, rs.i);
    if (at) { await r.mouse.click(at.x, at.y); await r.waitForTimeout(300); }
    rs.card = await r.evaluate(() => (document.querySelector('#card .trait') || {}).textContent || null); }
  ok('  the crew screen keeps his trait and his card\'s stats, and hands both to the fight', rs && rs.trait === first.trait && rs.company && rs.company.traits && rs.company.traits[0] === first.trait && rs.company.stats && Object.keys(shownStats).every(k => rs.company.stats[k] === shownStats[k]),
    rs ? (rs.card || 'the page shows ' + (rs.trait || 'nothing')) + '; handed ' + JSON.stringify(rs.company && { traits: rs.company.traits, hp: rs.company.stats && rs.company.stats.hp }) : 'not on the crew screen');
  ok('  and his page on the crew screen says it', rs && rs.card && rs.card.indexOf(first.name) === 0, rs ? rs.card : '');
  /* ---- H6 the fight ---- */
  const company = rs ? [rs.company] : [];
  const f = await ctx.newPage(); f.on('pageerror', e => errs.push('fight: ' + e.message));
  await f.addInitScript(c => { window.FIGHT_OPTS = { seed: 11, speed: 1, company: c, deploy: false }; }, company);
  await f.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  const u = await f.evaluate(() => { const v = FIGHT.S.units.find(x => x.side === 'you'); return v && { hp: v.hpMax != null ? v.hpMax : v.hp, resolve: v.resolve, initiative: v.initiative, fatigue: v.fatigueMax != null ? v.fatigueMax : v.fatigue, keys: Object.keys(v).slice(0, 60) }; });
  const statsOk = u && ['hp', 'resolve', 'initiative'].every(k => u[k] === shownStats[k]);
  ok('H6 AND HE FIGHTS AS HIS CARD SAID: the fight handed that company gives him his card\'s numbers, his trait on them', statsOk,
    u ? 'HP ' + u.hp + '/' + shownStats.hp + ', RES ' + u.resolve + '/' + shownStats.resolve + ', INI ' + u.initiative + '/' + shownStats.initiative : 'no unit');
  /* the dice for everybody else unchanged: the same seed with the same company minus his stats deals the band the same */
  const g = await ctx.newPage();
  const plain = company.map(c => { const o = Object.assign({}, c); delete o.stats; delete o.traits; return o; });
  await g.addInitScript(c => { window.FIGHT_OPTS = { seed: 11, speed: 1, company: c, deploy: false }; }, plain);
  await g.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await g.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  const band = pg => pg.evaluate(() => FIGHT.S.units.filter(x => x.side !== 'you').map(x => [x.name, x.hp, x.x, x.y].join(':')).join('|'));
  const [b1, b2] = [await band(f), await band(g)];
  ok('  the dice for everybody else are the same (his numbers come off the card, the roll is still drawn)', b1.length > 0 && b1 === b2, b1 === b2 ? 'the same band, the same places' : 'differs');
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | ') || '0');
  await b.close(); srv.close();
  console.log('THE TRAIT BEFORE YOU HIRE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
