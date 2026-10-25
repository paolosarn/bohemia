/* THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE (UI, row [the company screen, Battle Brothers simple], carrying [a dismiss
   button], 10/25/26; rules 172 and 171).
   PAOLO 10/25: 'find screenshots of how Battle Brothers' company menu works, because they really simplify how easy it can
   look... you're over complicating it, it's really hard to navigate your equipment, the levelling up... and then we need to
   improve upon that... you're in deficit.' And: 'there's not a dismiss button, bro, what if I want to dismiss people.'

   On his phone (390 x 844, touch) and a computer (1440 x 900, mouse), the crew screen opened the way the game opens it
   (engine/bohemia_crew_door.js), on the stranger's state (tools/bohemia_ui_company_screen_count.js: six men, BOOKIE with a
   level waiting, a stash of ten), with real taps:
   (1) FEWER THINGS ON THE SCREEN THAN THE 10/25 SCREEN, counted the same way (132 open and 169 with a man picked, on both),
       and the whole screen on the glass (no page to scroll; the 10/25 screen ran 1.9 to 2.3 screens on the phone).
   (2) THE STRANGER'S PATH ON ONE SCREEN: open the crew, pick the third man, put the best armour in the stash on him, level
       him up, dismiss the fifth man; every press on the glass when it is pressed (no scroll), counted; under the 10/25
       screen's 11 taps and 2 scrolls for the same first four steps, and the fifth step at all (the 10/25 screen had none).
       The phone: one tap shows the comparison (on the slot and in the line, the difference signed), the second puts it on,
       the old piece back in the stash. The computer: the comparison under the mouse before any click, a right-click puts
       it on (Battle Brothers' own).
   (3) THE LEVEL-UP IS ITS OWN SHORT MOMENT: the man with a level waiting shows his eight numbers as the picks with their
       rolls, three taps and RAISE THEM raise exactly those three by their rolls, the PERK tab opens itself, one tap takes it.
   (4) DISMISS (rule 171): one confirm (a tap alone keeps him, KEEP HIM keeps him); YOU have no button; YES puts his gear in
       the stash, takes him off the strip and the fight's hand-over, writes him in the walked list with dismissed:true,
       and the map's own code reads it: the nightly bill counts one man fewer (crewCount, read out of the map's file), the
       enemy's sizing (BohemiaJobKinds.rosterLevels) and the fight's door (the alpha's nfOpts, read out of its file) leave
       him out; the phone's feed says it; the bill never walks a man twice (the map's crewWhoWalks picks by name).
   (5) A SWIPE across him on the phone is the next man; on the computer Tab is the next man and Escape takes back a
       comparison.
   (6) Nothing thrown.  Planted defects (--plant, the phone only): a one-tap equip, a DISMISS that writes no walked line,
       DISMISS on YOU, the 36 empty stash slots back: each must turn a leg red.
   Run: node gates/the_company_screen_battle_brothers_simple_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools', 'bohemia_ui_company_screen_count.js'));
const PORT = 8917;   /* a port no other gate holds (8873 is three gates') */
/* THE 10/25 SCREEN, measured with the same counter before anything changed (3493e132; records/BOHEMIA_UI_THE_COMPANY_SCREEN_BATTLE_BROTHERS_SIMPLE_10_25_26.md) */
const BEFORE = { phone: { open: 132, third: 169, four: 10, scrolls: 2 }, computer: { open: 132, third: 169, four: 10, scrolls: 0 } };   /* four: the taps for the first four steps (open, the third man, the armour, his level); the fifth was impossible */
/* THE BUDGET: this round's screen counts 98 open and 121 with a man picked (his PERK tab waiting) on both; the gate holds the gain, a little room
   for a word added where it earns its place, never back toward the 10/25 screen (rule 178: a gate is a floor) */
const BUDGET = { open: 105, third: 130 };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

/* a function's own text out of a file, braces matched past strings and comments */
function fnText(src, name) {
  const at = src.indexOf('function ' + name + '('); if (at < 0) return null;
  let i = src.indexOf('{', at), d = 0;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
    if (c === '/' && n === '/') { i = src.indexOf('\n', i); continue; }
    if (c === '"' || c === "'" || c === '`') { for (i++; i < src.length && src[i] !== c; i++) if (src[i] === '\\') i++; continue; }
    if (c === '{') d++; else if (c === '}' && --d === 0) return src.slice(at, i + 1);
  }
  return null;
}
const MAP = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const ALPHA = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
const MAPFNS = ['crewWalked', 'crewHired', 'crewCount', 'crewDead', 'crewTakenAll', 'crewTaken', 'crewWhoWalks'].map(n => fnText(MAP, n));
const DOOR = ['nfKind', 'nfOpts'].map(n => fnText(ALPHA, n));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).crew.value;

/* the map's count and the fight's door, run in the host page on what the screen left in this phone's storage */
async function gameReads(page) {
  return page.evaluate(({ fns, door, men }) => {
    const out = {};
    try {
      const LOOP = { start: { company: men.slice(0, 6).map(m => ({ name: m.name, background: m.background, level: 1 })) } };
      const CREW_DEFS = { men: men, looks: [] };
      const f = new Function('LOOP', 'CREW_DEFS', 'var CREW_WALKED_KEY = "bohemia.walked.v1", TAKEN_KEY = "bohemia.taken.v1";\n' + fns.join('\n') + '\nreturn { count: crewCount(), walks: crewWhoWalks(), walked: crewWalked() };');
      out.map = f(LOOP, CREW_DEFS);
      /* the bill's next nights, short every night: who walks, in order, and never a man twice (the storage put back after) */
      const keep = localStorage.getItem('bohemia.walked.v1'), seq = [];
      for (let k = 0; k < 6; k++) { const r = f(LOOP, CREW_DEFS); if (!r.walks) break; seq.push(r.walks.name); const w = r.walked; w.push(r.walks); localStorage.setItem('bohemia.walked.v1', JSON.stringify(w)); }
      if (keep == null) localStorage.removeItem('bohemia.walked.v1'); else localStorage.setItem('bohemia.walked.v1', keep);
      out.map.seq = seq;
    } catch (e) { out.mapErr = String(e && e.message || e); }
    try {
      window.NF = window.NF || {};
      const g = new Function(door.join('\n') + '\nreturn nfOpts({ district: "suburb", world: { day: 1 } });');
      const o = g(); out.fight = (o.company || []).map(m => m && m.name);
    } catch (e) { out.fightErr = String(e && e.message || e); }
    try { if (window.BohemiaJobKinds) { const r = BohemiaJobKinds.roster(); out.roster = r.men.map(m => m.name); } } catch (e) { out.rosterErr = String(e && e.message || e); }
    return out;
  }, { fns: MAPFNS, door: DOOR, men: OURS });
}
const selMan = (fr, n) => fr.evaluate(n => '.cell[data-man="' + BohemiaRosterScreen.state.crew.findIndex(m => m.name === n) + '"]', n);

async function run(b, name, prof, screen, quiet) {
  const R = { taps: 1, scrolls: 0, legs: {} };   /* tap 1: the crew button */
  const leg = (k, g, m, x) => { R.legs[k] = !!g; if (!quiet) ok(m, g, x); };
  const srv = await T.serve(PORT, screen ? { screen } : {});
  const ctx = await b.newContext(T.PROFILES[name]), page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  /* the phone's feed, where the map keeps it: the screen finds it up the frames */
  await page.addInitScript(() => { if (window.top === window) window.BOHEMIA_FEED = { posts: [], push(p) { this.posts.push(p); return true; } }; });   /* the map's window only, never the screen's own */
  try {
    const fr = await T.openCrew(page, PORT);
    await page.evaluate(() => new Promise(r => { const s = document.createElement('script'); s.src = 'slices/bohemia_job_kinds.js'; s.onload = r; s.onerror = r; document.head.appendChild(s); }));
    const before = await gameReads(page);
    /* (1) fewer things, one screen */
    const open = await T.count(fr);
    leg('fewer_open', open.total < BEFORE[name].open && open.total <= BUDGET.open, name + ': fewer things on the screen when it opens than the 10/25 screen, inside the budget', open.total + ' < ' + BEFORE[name].open + ', budget ' + BUDGET.open + ' (words ' + open.words + ', pictures ' + open.pics + ', empty boxes ' + open.boxes + ')');
    leg('one_screen', open.screens <= 1.02, '  the whole screen on the glass, no page to scroll', open.screens + ' screens');
    const tap = async (sel, how) => { const on = await T.onGlass(fr, sel); if (on !== true) R.scrolls++;
      if (how === 'right') await fr.click(sel, { button: 'right' }); else await fr.click(sel); R.taps++; await page.waitForTimeout(300); return on; };
    /* (2) the third man */
    await tap(await selMan(fr, T.THIRD));
    const third = await T.count(fr);
    leg('fewer_third', third.total < BEFORE[name].third && third.total <= BUDGET.third && third.screens <= 1.02, '  fewer things with the third man picked, inside the budget, still one screen', third.total + ' < ' + BEFORE[name].third + ', budget ' + BUDGET.third + ', ' + third.screens + ' screens');
    const me = await fr.evaluate(n => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; return { name: m.name, body: m.gear.body && m.gear.body.id, had: S.bag.filter(x => m.gear.body && x.id === m.gear.body.id).length, slots: [].map.call(document.querySelectorAll('#card .gslot'), g => g.dataset.slot).join(','),
      body3d: !!document.querySelector('#card canvas.rbody'), bags: document.querySelectorAll('#bags .gslot').length, stats: document.querySelectorAll('#card [data-raise], #card .stats [data-stat]').length,
      icons: [].filter.call(document.querySelectorAll('#card [data-raise]>span:first-child, #card .stats [data-stat]>span:first-child'), s => /url\(/.test(getComputedStyle(s, '::before').backgroundImage)).length }; });
    leg('him', me.name === T.THIRD && me.body3d && me.slots === 'head,main,body,bag1,bag2,acc,off,ammo' && me.bags === 2 && me.stats === 8 && me.icons === 8,
      '  the screen is him: his 3D body, the slots around it (head, both hands, body, accessory, ammo), his two bag slots, eight numbers with their icons', me.name + ' ' + me.slots + ', icons ' + me.icons);
    /* the best armour: the body piece whose own number is highest, read off the tiles as a stranger reads them */
    const best = await fr.evaluate(() => { const S = BohemiaRosterScreen.state; let top = null;
      [].forEach.call(document.querySelectorAll('#bag .slot[data-bag]'), t => { const it = S.bag[+t.dataset.bag]; if (!it || it.kind !== 'body') return; const n = +t.querySelector('b').textContent; if (!top || n > top.n) top = { n, sel: '#bag .slot[data-bag="' + t.dataset.bag + '"]', id: it.id, green: t.querySelector('b').classList.contains('up') }; });
      return top; });
    leg('best_seen', best && best.id === T.BEST_ARMOUR && best.green, '  the best armour reads off its tile: its number, green against what he wears', best && (best.id + ' ' + best.n));
    if (name === 'computer') {
      await fr.hover(best.sel); await page.waitForTimeout(250);
      const hv = await fr.evaluate(() => ({ said: document.getElementById('said').innerText, cmp: (document.querySelector('#card .gslot.cmp') || {}).dataset }));
      leg('hover', /PLATE CARRIER/i.test(hv.said) && /\+80/.test(hv.said) && hv.cmp && hv.cmp.slot === 'body', '  the computer: the comparison is under the mouse before any click (the slot it goes in lit, the difference signed)', hv.said.replace(/\n/g, ' / '));
      await tap(best.sel, 'right');
    } else {
      await tap(best.sel);
      const cm = await fr.evaluate(n => ({ said: document.getElementById('said').innerText, cmp: (document.querySelector('#card .gslot.cmp') || {}).dataset, d: (document.querySelector('#card .gslot.cmp em.d') || {}).textContent,
        body: BohemiaRosterScreen.state.crew.find(m => m.name === n).gear.body.id }), T.THIRD);
      leg('compare', /PLATE CARRIER/i.test(cm.said) && /\+80/.test(cm.said) && /AGAIN/.test(cm.said) && cm.cmp && cm.cmp.slot === 'body' && cm.d === '+80' && cm.body !== T.BEST_ARMOUR,
        '  the phone: one tap shows the comparison (his BODY slot lit +80, the line says what he wears and how to put it on), nothing put on yet', cm.said.replace(/\n/g, ' / '));
      await tap(best.sel);
    }
    const wore = await fr.evaluate(({ n, old, had }) => { const S = BohemiaRosterScreen.state, m = S.crew.find(m => m.name === n); return { body: m.gear.body && m.gear.body.id, back: S.bag.filter(x => x.id === old).length === had + 1, n: S.bag.length,
      kept: (JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]').find(x => x.name === n) || {}).gear }; }, { n: T.THIRD, old: me.body, had: me.had });
    leg('equipped', wore.body === T.BEST_ARMOUR && wore.back && wore.kept && wore.kept.body === T.BEST_ARMOUR, '  ' + (name === 'computer' ? 'a right-click' : 'the second tap') + ' puts it on, his old one back in the stash, the fight\'s hand-over has it', JSON.stringify(wore.kept && wore.kept.body));
    /* (3) the level-up, in his numbers */
    const lv = await fr.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(m => m.name === n); return { picks: document.querySelectorAll('#levelup [data-raise]').length, stats: Object.assign({}, m.stats), gains: m.rolls[0].gains }; }, T.THIRD);
    leg('lv_open', lv.picks === 8, '  his numbers ARE the level-up while it waits: eight picks with their rolls, no extra tap to open it', lv.picks + ' picks');
    const keys = ['hp', 'melee_skill', 'melee_defense'];
    for (const k of keys) await tap('#levelup [data-raise="' + k + '"]');
    await tap('#raise');
    const up = await fr.evaluate(n => { const S = BohemiaRosterScreen.state, m = S.crew.find(m => m.name === n); return { stats: m.stats, rolls: (m.rolls || []).length, perk: !!document.querySelector('#plist button'), tab: S.tab }; }, T.THIRD);
    const rose = keys.every(k => up.stats[k] === lv.stats[k] + lv.gains[k]) && Object.keys(lv.stats).filter(k => keys.indexOf(k) < 0).every(k => up.stats[k] === lv.stats[k]);
    leg('raised', rose && up.rolls === 0, '  three taps and RAISE THEM raise exactly those three by their rolls', keys.map(k => k + ' ' + lv.stats[k] + '->' + up.stats[k]).join(', '));
    leg('perk_tab', up.perk && up.tab === 'perk', '  the PERK tab opens itself beside him');
    const pid = await fr.evaluate(() => document.querySelector('#plist button').dataset.perk);
    await tap('#plist button');
    const pk = await fr.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(m => m.name === n); return { perks: m.perks.slice(), points: m.points, plus: !!document.querySelector('.cell.sel i.up') }; }, T.THIRD);
    R.four = R.taps;
    leg('perk', pk.perks.indexOf(pid) >= 0 && pk.points === 0 && !pk.plus, '  one tap takes the perk; his plus is gone', pk.perks.join(','));
    /* (4) dismiss the fifth man */
    await tap(await selMan(fr, T.FIFTH));
    const yesNot = await fr.evaluate(() => !document.getElementById('letgo'));
    await tap('#dismiss');
    const asked = await fr.evaluate(n => ({ still: BohemiaRosterScreen.state.crew.some(m => m.name === n), yes: !!document.getElementById('letgo'), keep: !!document.getElementById('keep'), said: document.getElementById('said').textContent }), T.FIFTH);
    leg('confirm', yesNot && asked.still && asked.yes && asked.keep && /wage stops/i.test(asked.said), '  DISMISS asks once (he is still here; YES and KEEP HIM; the line says his gear and his wage)', asked.said);
    const gear = await fr.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(m => m.name === n); return ['main','off','body','head','bag1','bag2'].map(s => m.gear[s] && m.gear[s].id).filter(Boolean); }, T.FIFTH);
    const n0 = await fr.evaluate(() => BohemiaRosterScreen.state.bag.length);
    await tap('#letgo');
    const gone = await fr.evaluate(({ n, gear }) => { const S = BohemiaRosterScreen.state, ids = S.bag.map(x => x.id);
      const w = JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]'), co = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]'), ln = JSON.parse(localStorage.getItem('bohemia.company.line.v1') || '{}');
      return { crew: S.crew.some(m => m.name === n), strip: [].some.call(document.querySelectorAll('.cell[aria-label]'), c => c.getAttribute('aria-label') === n),
        hand: co.some(m => m.name === n), known: (ln.known || []).indexOf(n) >= 0, walked: w.filter(x => x.name === n && x.dismissed).length, bag: S.bag.length,
        gearBack: gear.every(id => ids.indexOf(id) >= 0), you: S.crew.findIndex(m => m.main) }; }, { n: T.FIFTH, gear });
    leg('dismissed', !gone.crew && !gone.strip && !gone.hand && !gone.known && gone.walked === 1 && gone.gearBack && gone.bag === n0 + gear.length,
      '  YES: he is off the strip and the fight\'s hand-over, in the walked list once (dismissed), his ' + gear.length + ' pieces in the stash', JSON.stringify(gone));
    const after = await gameReads(page);
    leg('bill', before.map && after.map && after.map.count === before.map.count - 1 && after.map.walked.length === 1, '  the map\'s nightly bill counts one man fewer (its own crewCount)', (before.map && before.map.count) + ' -> ' + (after.map && after.map.count) + (after.mapErr || ''));
    const seq = (after.map && after.map.seq) || [];
    leg('walks_once', seq.length === 4 && seq.indexOf(T.FIFTH) < 0 && new Set(seq).size === seq.length && seq.indexOf('YOU') < 0, '  the bill never walks him a second time, nor anyone twice, nor YOU (five short nights in a row)', seq.join(' > '));
    leg('fight', Array.isArray(after.fight) && after.fight.length === 5 && after.fight.indexOf(T.FIFTH) < 0 && after.fight[0] === 'YOU', '  the fight\'s door (the alpha\'s nfOpts) hands five men and not him', (after.fight || []).join(',') + (after.fightErr || ''));
    leg('roster', Array.isArray(after.roster) && after.roster.indexOf(T.FIFTH) < 0 && after.roster.length === 5, '  the enemy\'s sizing counts five (BohemiaJobKinds.roster)', (after.roster || []).join(',') + (after.rosterErr || ''));
    const feed = await page.evaluate(n => window.BOHEMIA_FEED.posts.filter(p => p.txt.indexOf(n) >= 0).map(p => p.txt), T.FIFTH);
    leg('feed', feed.length === 1, '  the phone\'s feed says it', feed[0]);
    /* the path, counted */
    leg('taps', R.four < BEFORE[name].four && R.taps <= R.four + 3 && R.scrolls === 0, '  THE STRANGER\'S PATH: ' + R.taps + ' taps in all, ' + R.four + ' for the first four steps, ' + R.scrolls + ' scrolls, every press on the glass (the 10/25 screen: ' + BEFORE[name].four + ' taps and ' + BEFORE[name].scrolls + ' scrolls for the first four, the fifth impossible)');
    /* YOU have no DISMISS */
    await fr.evaluate(() => BohemiaRosterScreen.choose(BohemiaRosterScreen.state.crew.findIndex(m => m.main))); await page.waitForTimeout(200);
    leg('you', await fr.evaluate(() => !document.getElementById('dismiss') && BohemiaRosterScreen.dismiss(BohemiaRosterScreen.state.crew.findIndex(m => m.main)) === false), '  YOU have no DISMISS, and the call refuses him');
    /* KEEP HIM keeps him */
    await fr.evaluate(() => BohemiaRosterScreen.choose(BohemiaRosterScreen.state.crew.findIndex(m => !m.main))); await page.waitForTimeout(200);
    const k0 = await fr.evaluate(() => BohemiaRosterScreen.state.crew.length); await fr.click('#dismiss'); await page.waitForTimeout(150); await fr.click('#keep'); await page.waitForTimeout(150);
    leg('keep', await fr.evaluate(k0 => BohemiaRosterScreen.state.crew.length === k0 && !!document.getElementById('dismiss'), k0), '  KEEP HIM takes the question back, nobody leaves');
    /* (5) a swipe on the phone, Tab and Escape on the computer */
    const o = await fr.evaluate(() => ({ order: BohemiaRosterScreen.order(), sel: BohemiaRosterScreen.state.sel }));
    const nextOf = o.order[(o.order.indexOf(o.sel) + 1) % o.order.length];
    if (name === 'phone') {
      const box = await (await fr.$('#card .rbody, #card canvas.big')).boundingBox(), man = await (await fr.$('#man')).boundingBox();
      const y = box.y + box.height * 0.5, x0 = man.x + man.width * 0.64, x1 = man.x + man.width * 0.36;
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
      for (let s = 1; s <= 6; s++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * s / 6, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(300);
      leg('swipe', await fr.evaluate(n => BohemiaRosterScreen.state.sel === n, nextOf), '  a swipe across him is the next man in the line');
    } else {
      await fr.click('#bar .t'); await page.keyboard.press('Tab'); await page.waitForTimeout(250);
      leg('tab', await fr.evaluate(n => BohemiaRosterScreen.state.sel === n, nextOf), '  Tab is the next man (Battle Brothers\' key)');
      const t1 = await fr.$('#bag .slot[data-bag]'); await t1.click(); await page.waitForTimeout(200);
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      const esc = { cmp: await fr.evaluate(() => BohemiaRosterScreen.state.cmp), door: !!(await page.$('#crewdoor')) };
      leg('esc', esc.cmp == null && esc.door, '  Escape takes back a comparison before it closes anything', JSON.stringify(esc));
    }
    leg('clean', errs.length === 0, '  nothing thrown', errs.slice(0, 2).join(' | '));
  } catch (e) { leg('ran', false, name + ': the path ran to the end', String(e && e.message || e).split('\n')[0]); }
  await ctx.close(); srv.close();
  return R;
}

(async () => {
  const { chromium } = require('playwright'); const b = await chromium.launch();
  for (const n of ['phone', 'computer']) { console.log('-- ' + n.toUpperCase() + ' (' + T.PROFILES[n].viewport.width + ' x ' + T.PROFILES[n].viewport.height + ')'); await run(b, n, null, null, false); }
  ok('the map\'s count and the fight\'s door were read out of their own files', MAPFNS.every(Boolean) && DOOR.every(Boolean), MAPFNS.filter(Boolean).length + ' + ' + DOOR.filter(Boolean).length);
  if (process.argv.includes('--plant')) {
    console.log('-- PLANTED DEFECTS (the phone): each must turn a leg red');
    const SRC = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ROSTER_SCREEN.html'), 'utf8');
    const plants = [
      ['a one-tap equip (no comparison first)', s => s.replace("if(S.cmp === i){ S.cmp = null; equip(i, slotOf(it)); return; }", "S.cmp = null; equip(i, slotOf(it)); return;"), 'compare'],
      ['DISMISS writes no walked line', s => s.replace("localStorage.setItem(WKEY, JSON.stringify(w));", ""), 'bill'],
      ['DISMISS on YOU', s => s.replace("if(!m.main && !m.dead){", "if(!m.dead){"), 'you'],
      ['the 36 empty stash slots back', s => s.replace("  if(!shown){", "  for(var e9 = S.bag.length; e9 < BAG_SLOTS; e9++){ var z = document.createElement('div'); z.className = 'slot'; el.appendChild(z); }\n  if(!shown){"), 'fewer_open']
    ];
    for (const [what, mut, legName] of plants) {
      const s2 = mut(SRC); if (s2 === SRC) { ok('planted: ' + what + ' (the plant did not apply)', false); continue; }
      const r = await run(b, 'phone', null, s2, true);
      ok('planted: ' + what + ' is caught', r.legs[legName] === false || r.legs.ran === false, legName + ' ' + r.legs[legName]);
    }
  }
  await b.close();
  console.log('\nTHE COMPANY SCREEN, BATTLE BROTHERS SIMPLE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
