#!/usr/bin/env node
/* MODS [a modder's first hour] -- CHANGE ONE THING IN TEN MINUTES (reads only; RESEARCH ONLY, rule 38g).

     node tools/bohemia_mods_ten_minutes.js [--json] [--no-live]

   The row (Paolo 9/30 and 10/9: 'the point of the mods chat is to make mods easy to make'): a first-time modder makes
   three changes against the data line -- a weapon's damage, a face's hair, a building's name -- each step timed and
   each wall listed with the fix. Nothing in the game calls this and nothing in the repo changes: every edited file is a
   copy outside the repo, handed to the page under its real URL by a serve map.

   THE CHANGES, in a stranger's words (what the screen shows him, not the repo's names):
     W  'make the PISTOL my crew carries hit harder' (+5 on both ends)
     H  'give a crew member with long hair short hair'
     B  'rename THE BAR to THE SALOON'

   TWO READINGS.
   (1) STATIC, from the files: where each thing lives, how many files a search for the word on the screen returns, which
       guide page names the place, how many files must change, what tool must run, and the words a stranger reads on the
       shortest path. Human minutes come from two published rates, never from our own clock: silent reading 238 words a
       minute for non-fiction (Brysbaert 2019, a meta-analysis of 190 studies) and the Keystroke-Level Model's operators
       (Card, Moran and Newell 1980: K 0.28 s a key for an average typist, P 1.1 s to point, H 0.4 s to move a hand,
       M 1.35 s to decide). The shortest path is the best case: a stranger who never takes a wrong turn.
   (2) LIVE, on the phone profile (390x844, CPU 4x, the fleet's driver numbers): the SEE step for W and B, timed from the
       page's own clock, with the edited copy served under the real URL; and the CACHE wall: the server MODDING.md and the
       first-hour page tell a stranger to run (python3 -m http.server), an edit, a plain reload, and whether the new
       number arrives. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync, spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const LIVE = !args.includes('--no-live');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const words = t => (String(t).match(/[A-Za-z0-9][A-Za-z0-9'_.-]*/g) || []).length;
const lineOf = (txt, re) => { const m = re.exec(txt); return m ? txt.slice(0, m.index).split('\n').length : null; };

/* ---------- the published rates (the only human numbers on the page) ---------- */
const WPM = 238;                                      /* Brysbaert 2019, J. Memory and Language 109:104047 */
const KLM = { K: 0.28, P: 1.1, H: 0.4, M: 1.35 };     /* Card, Moran, Newell 1980, CACM 23(7) */
const readMin = w => w / WPM;
const klmSec = ops => ops.reduce((s, o) => s + KLM[o[0]] * o[1], 0);

/* ---------- the search a stranger runs, over what GitHub shows him (tracked files) ---------- */
function gitGrep(word, ci, whole) {
  try {
    const out = execFileSync('git', ['-C', ROOT, 'grep', '-l', '-F', ...(ci ? ['-i'] : []), ...(whole ? ['-w'] : []), '-e', word], { encoding: 'utf8', maxBuffer: 1 << 26 });
    return out.split('\n').filter(Boolean);
  } catch (e) { return []; }
}
const GAME = f => /^(slices|engine|records\/target)\//.test(f) && !/^slices\/BOHEMIA_[A-Z_]+_\d+_\d+_26\.html$/.test(f);
function search(word, ci, whole) {
  const all = gitGrep(word, ci, whole);
  return { word, ci: !!ci, whole: !!whole, files: all.length, game_files: all.filter(GAME).length, game: all.filter(GAME) };
}

/* ---------- the front door ---------- */
function frontDoor() {
  const root = execFileSync('git', ['-C', ROOT, 'ls-tree', '--name-only', 'HEAD'], { encoding: 'utf8' }).split('\n').filter(Boolean);
  const readme = root.filter(f => /^readme(\.|$)/i.test(f));
  const md = root.filter(f => /\.md$/i.test(f));
  return { root_entries: root.length, root_md: md.length, readme: readme, modding_md_at_root: root.includes('MODDING.md'),
           modding_words: words(rd('MODDING.md')) };
}

/* ---------- W: the pistol ---------- */
function weapon() {
  const WL = JSON.parse(rd('records/target/bb/weapon_lines.json'));
  const WP = JSON.parse(rd('records/target/bb/weapons.json'));
  const OURS = JSON.parse(rd('records/target/bb/ours.json'));
  const rows = Array.isArray(WP.rows) ? WP.rows : Object.values(WP.rows);
  const lineKey = Object.keys(WL.rows).find(k => WL.rows[k].job === 'pistol');
  const L = WL.rows[lineKey];
  const jobRow = (OURS.weapon_rows && OURS.weapon_rows.value || {}).pistol;
  const row = rows.find(r => r.id === jobRow);
  const knife = rows.find(r => r.id === 'knife');
  const wtxt = rd('records/target/bb/weapons.json');
  const mod = rd('MODDING.md');
  const firstHour = rd('records/BOHEMIA_MODS_A_MODDERS_FIRST_HOUR_10_10_26.md');
  /* the shortest path: MODDING.md whole, the weapon card's name in weapon_lines (one row), then the row in weapons.json */
  const rowStart = lineOf(wtxt, new RegExp('"id":\\s*"' + jobRow + '"'));
  const rowText = wtxt.split('\n').slice(rowStart - 4, rowStart + 40).join('\n');
  const pathWords = words(mod) + words(JSON.stringify(L)) + words(rowText);
  const edit = [['M', 3], ['P', 2], ['H', 2], ['K', 2 + 2 + 2]];   /* decide, point at two numbers, two digits each, save */
  /* every crew weapon's name on the screen against the two files a stranger would search for it */
  const atxt = rd('records/target/bb/armor.json');
  const names = Object.keys(OURS.weapon_rows.value).map(job => {
    const k = Object.keys(WL.rows).find(x => WL.rows[x].job === job), nm = k ? WL.rows[k].name : job.toUpperCase();
    const re = new RegExp('\\b' + nm.replace(/ /g, '\\s+') + '\\b', 'gi');
    return { job, screen: nm, row: OURS.weapon_rows.value[job], in_weapons: (wtxt.match(re) || []).length, in_armor: (atxt.match(re) || []).length };
  });
  return {
    screen_names: names, screen_names_found: names.filter(n => n.in_weapons + n.in_armor > 0).length + ' of ' + names.length,
    screen: { card_title: L.name, small_print: 'Battle Brothers: ' + L.base, key_in_weapon_lines: lineKey },
    lives: { file: 'records/target/bb/weapons.json', id: jobRow, line: rowStart, damage: [row.damage_min, row.damage_max],
             the_link: 'records/target/bb/ours.json weapon_rows.pistol = ' + jobRow + ' (the job to the row); weapon_lines.json keys the card by class ' + lineKey },
    files_to_change: 1, tool_to_run: null, as_a_mod: true,
    search: { pistol: search('pistol', true), pistol_in_weapons_json: (wtxt.match(/pistol/gi) || []).length, dagger: search('"dagger"', false) },
    guide: { modding_names: /pistol/i.test(mod) ? 'pistol' : /dagger/i.test(mod) ? 'dagger' : 'the knife only',
             modding_example: /knife/.test(mod) ? 'knife' : null, first_hour_example: /knife/.test(firstHour) ? 'knife' : null,
             knife_class: knife.class, knife_damage: [knife.damage_min, knife.damage_max], knife_carried_by_crew: Object.values(OURS.weapon_rows.value).includes('knife') },
    best_case: { words: pathWords, read_min: +readMin(pathWords).toFixed(1), edit_sec: +klmSec(edit).toFixed(1) }
  };
}

/* ---------- B: the bar ---------- */
function building() {
  const F = 'slices/BOHEMIA_SETTLEMENT_SCREEN.html', t = rd(F);
  const m = /\n\s*bar:\s*\{[^}]*name:'([^']+)'/.exec(t);
  const line = lineOf(t, /\n\s*bar:\s*\{[^}]*name:'/) + 1;
  const dl = rd('records/BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md');
  const mod = rd('MODDING.md');
  const merge = rd('tools/bohemia_mods_merge_reference.js');
  const s = search(m[1], false, true);   /* whole words: THE BAR, not THE BARBER */
  /* the shortest path: MODDING.md, the data line page (it is where MODDING.md sends a stranger for 'where things live'),
     then the twelve lines of the B table */
  const tbl = t.split('\n').slice(line - 8, line + 4).join('\n');
  /* best case: MODDING.md, then a whole-word search for the name on the screen (its list of game files), then the table;
     guided: MODDING.md sends him to the data line page for 'where the game's data lives', which does not name it */
  const pathWords = words(mod) + s.game.length * 2 + words(tbl);
  const guidedWords = pathWords + words(dl);
  const edit = [['M', 2], ['P', 1], ['H', 2], ['K', 'SALOON'.length + 2 + 2]];
  return {
    screen: { name: m[1], where: 'drawn on the canvas, only while a finger is on the building (no DOM text)' },
    lives: { file: F, table: 'B', line, kind: 'a table inside a 107 KB page of code' },
    files_to_change: 1, tool_to_run: null,
    as_a_mod: /records\/target\/bb/.test(merge) && !/SETTLEMENT_SCREEN/.test(merge) ? false : 'unknown',
    search: s,
    guide: { data_line_names_it: /BOHEMIA_SETTLEMENT_SCREEN|building name|THE BAR/.test(dl), modding_names_it: /settlement|building/i.test(mod) },
    best_case: { words: pathWords, read_min: +readMin(pathWords).toFixed(1), edit_sec: +klmSec(edit).toFixed(1) },
    guided: { words: guidedWords, read_min: +readMin(guidedWords).toFixed(1), detour: 'the data line page, ' + words(dl) + ' words, does not name it' }
  };
}

/* ---------- H: the hair ---------- */
/* Two words name one man's hair, in two vocabularies: the BODY's cut in the alpha's CITY_CAST_LOOKS (one of the hair
   bank's named cuts; the fight and the settlement sheets are baked from it), and the PORTRAIT's class in PORTRAIT's tool
   (long, taper, coil, shag; the 128 px faces are rendered from it in Blender). Every other place is a label or a copy. */
function hair() {
  const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html', DEMO = 'slices/BOHEMIA_DEMO.html', TOOL = 'tools/bohemia_portrait_the_head_from_the_model.py';
  const a = rd(ALPHA), d = rd(DEMO), t = rd(TOOL);
  const castOf = (txt) => {
    const i = txt.indexOf('const CITY_CAST_LOOKS = ['), j = txt.indexOf('window.CITY_CAST_LOOKS', i), blk = txt.slice(i, j), out = {};
    const re = /id:'([a-z]+)'[\s\S]*?worn:\{hair:'([A-Z ]+)'/g; let m;
    while ((m = re.exec(blk))) out[m[1]] = { hair: m[2], line: txt.slice(0, i + m.index + m[0].length).split('\n').length };
    return out; };
  const body = castOf(a), bodyDemo = castOf(d);
  const side = {}; a.replace(/genHair\(g,\{name:'([A-Z ]+)'[^}]*?side:([0-9.]+)/g, (_, n, v) => { if (!(n in side)) side[n] = +v; });
  const por = {}; let m; const pre = /'([A-Z_]+)':\s*dict\(look='([a-z_]+)',((?:(?!dict\()[\s\S])*?)hair='([a-z]+)'/g;
  while ((m = pre.exec(t))) por[m[2]] = { hair: m[4], line: t.slice(0, m.index).split('\n').length };
  const looks = Object.keys(body).map(id => ({ look: 'cast_' + id, body: body[id].hair, side: side[body[id].hair], portrait: (por['cast_' + id] || {}).hair }));
  /* the same cut in both words: the class word is in the cut's name (TAPER, COIL, SHAG), or 'long' over a cut that falls
     past 0.75 of the head's side (the bank's own side number) */
  const agree = looks.filter(l => l.portrait && (l.body.toLowerCase().includes(l.portrait) || (l.portrait === 'long' && l.side >= 0.75))).length;
  const id = Object.keys(body).sort((x, y) => (side[body[y].hair] || 0) - (side[body[x].hair] || 0))[0], look = 'cast_' + id;   /* the longest cut */
  const FP = JSON.parse(rd('slices/fight_people/fight_people.json')), SP = JSON.parse(rd('slices/settlement_people/settlement_people.json'));
  const CF = JSON.parse(rd('records/target/portrait/crew/BOHEMIA_CREW_FACES.json'));
  const places = [
    { where: ALPHA + ' line ' + body[id].line, says: body[id].hair, role: 'the body\'s word: the fight and settlement sheets are baked from it' },
    { where: DEMO + ' line ' + (bodyDemo[id] || {}).line, says: (bodyDemo[id] || {}).hair, role: 'the demo\'s own copy of the same table (a cut copies it)' },
    { where: TOOL + ' line ' + (por[look] || {}).line, says: (por[look] || {}).hair, role: 'the portrait\'s word: the 128 px faces are rendered from it in Blender' },
    { where: 'slices/fight_people/fight_people.json looks.' + look + '.worn.hair', says: ((FP.looks[look] || {}).worn || {}).hair || null, role: 'a label the bake writes' },
    { where: 'slices/settlement_people/settlement_people.json looks.' + look + '.worn.hair', says: ((SP.looks[look] || {}).worn || {}).hair || null, role: 'a label the bake writes' },
    { where: 'records/target/portrait/crew/BOHEMIA_CREW_FACES.json faces.' + look + '.hair', says: (CF.faces[look] || {}).hair || null, role: 'a label the render writes; no screen reads it' }];
  const pics = [], pdir = 'records/target/portrait/crew/' + look;
  if (fs.existsSync(path.join(ROOT, pdir))) fs.readdirSync(path.join(ROOT, pdir)).filter(f => /\.png$/.test(f)).forEach(f => pics.push(pdir + '/' + f));
  ['slices/fight_people/', 'slices/settlement_people/'].forEach(dd => { const f = dd + look + '.webp'; if (fs.existsSync(path.join(ROOT, f))) pics.push(f); });
  const bytes = pics.reduce((n, f) => n + fs.statSync(path.join(ROOT, f)).size, 0);
  const reader = rd('engine/bohemia_crew_faces.js');
  let bpy = false; try { execFileSync('python3', ['-c', 'import bpy'], { stdio: 'ignore' }); bpy = true; } catch (e) {}
  const fight = rd('slices/BOHEMIA_FIGHT.html');
  const dl = rd('records/BOHEMIA_MODS_THE_DATA_LINE_EVERY_CONTENT_KIND_10_17_26.md');
  const dlRow = (dl.split('\n').find(l => /\*\*clothes and hair\*\*/.test(l)) || '');
  const dlFiles = (dlRow.match(/`([^`]+)`/g) || []).map(x => x.slice(1, -1));
  const dlHasLook = dlFiles.filter(f => fs.existsSync(path.join(ROOT, f)) && rd(f).includes("'" + id + "'"));
  /* the shortest path with no wrong turn: MODDING.md, the data line's hair row, the cast table, the bank's hair lines (to
     pick a short cut), the bake tool's header (to learn the sheets are baked); then PORTRAIT's tool's header for the face */
  const ci = a.indexOf('const CITY_CAST_LOOKS = ['), castBlk = a.slice(ci, a.indexOf('window.CITY_CAST_LOOKS', ci));
  const bankLines = a.split('\n').filter(l => /layer:'hair'/.test(l) && /genHair/.test(l));
  const bodyWords = words(rd('MODDING.md')) + words(dlRow) + words(castBlk) + words(bankLines.join('\n'))
    + words(rd('tools/bohemia_fight_people_bake.js').split('\n').slice(0, 13).join('\n'));
  const faceWords = words(t.split('\n').slice(0, 60).join('\n'));
  return {
    best_case: { body_words: bodyWords, body_read_min: +readMin(bodyWords).toFixed(1), face_words: faceWords,
                 all_read_min: +readMin(bodyWords + faceWords).toFixed(1), bake_sec: 230, bank_lines: bankLines.length },
    screen: { look, body: body[id].hair, side: side[body[id].hair], portrait: (por[look] || {}).hair },
    places, words_to_change: 2, copies_to_follow: 1,
    pictures: pics.length, bytes, alpha_lines: a.split('\n').length,
    cuts: { named: Object.keys(side).length, portrait_classes: Array.from(new Set(Object.values(por).map(x => x.hair))) },
    every_look: looks, agree: agree + ' of ' + looks.length,
    crew_to_look: /lk\[i % lk\.length\]/.test(fight) ? 'by position: man i wears ours.people_looks.crew[i % 12]; no crew row names its look' : 'unknown',
    same_man_same_look: (function () {   /* the fight's list (ours.people_looks.crew) against the crew screen's (engine/bohemia_roster.js manOf: the cast_ keys of fight_people.json) */
      const O = JSON.parse(rd('records/target/bb/ours.json')), crew = O.crew.value, lk = O.people_looks.value.crew;
      const rl = Object.keys(FP.looks).filter(k => /^cast_/.test(k));
      const men = crew.map((c, i) => ({ name: c.name, fight: lk[i % lk.length], crew_screen: c.main ? 'you' : rl[i % rl.length] }));
      return { same: men.filter(x => x.fight === x.crew_screen).length + ' of ' + men.length, men };
    })(),
    tools_to_run: ['node tools/bohemia_fight_people_bake.js (the strangers: 230 s, twice)', 'node tools/bohemia_settlement_people_bake.js',
                   'Blender 4.2 Python (bpy) for ' + TOOL + ', then tools/bohemia_direction_master_rig.py'],
    here: { bpy_importable: bpy },
    the_trap: { field: 'BOHEMIA_CREW_FACES.json faces.' + look + '.hair', read_by_a_screen: /\.hair\b/.test(reader) },
    as_a_mod: false,
    guide: { data_line_row_files: dlFiles, of_those_naming_the_look: dlHasLook, modding_says: /A sprite in a mod\s+Not yet/.test(rd('MODDING.md')) ? 'A sprite in a mod: Not yet' : null },
    search: { haircut: search('haircut', true), cut_name: search(body[id].hair, false) }
  };
}

/* ---------- the live part ---------- */
const PW = '/opt/node22/lib/node_modules/playwright';
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true };
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png',
               '.webp': 'image/webp', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.svg': 'image/svg+xml' };
function serveMap(map) {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = map[u] || path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}
async function phone(browser, cpu) {
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  if (cpu > 1) { const c = await ctx.newCDPSession(page); await c.send('Emulation.setCPUThrottlingRate', { rate: cpu }); }
  return { ctx, page, errs };
}
function tmpWith(rel, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mods-ten-'));
  const out = path.join(dir, path.basename(rel));
  fs.writeFileSync(out, fn(fs.readFileSync(path.join(ROOT, rel), 'utf8')));
  return out;
}
function bumpRow(txt, id, d) {
  const j = JSON.parse(txt), rows = Array.isArray(j.rows) ? j.rows : Object.values(j.rows);
  const r = rows.find(x => x.id === id); r.damage_min += d; r.damage_max += d;
  return JSON.stringify(j, null, 1);
}
/* the fight on the bench: its own clock to the baked board, then the pistol man's card from the fight's own weaponCard */
async function fightCard(browser, serve, opts) {
  const server = await serveMap(serve);
  const { ctx, page, errs } = await phone(browser, opts.cpu);
  await page.addInitScript({ content: 'window.FIGHT_OPTS=' + JSON.stringify(opts.fight || {}) + ';' });
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:' + server.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction('window.FIGHT_UI && FIGHT_UI.t0 > 0', null, { timeout: 120000 });
  const r = await page.evaluate(function () {
    const units = FIGHT.S.units, pm = units.filter(u => u.side === 'you' && u.weapon && u.weapon.id === 'dagger')[0];
    let card = null; if (pm) { weaponCard(pm); card = document.getElementById('drawer').innerText.replace(/\s+/g, ' ').trim(); }
    return { boardMs: Math.round(FIGHT_UI.t0), card, crew: units.filter(u => u.side === 'you').map(u => u.weapon && u.weapon.id),
             foes: units.filter(u => u.side !== 'you').map(u => u.weapon && u.weapon.id) };
  });
  r.wallMs = Date.now() - t0; r.errs = errs.length;
  await ctx.close(); server.close();
  return r;
}
/* the settlement on the bench: a finger held on THE BAR, and every string the canvas drew while it was held */
async function barName(browser, serve, cpu) {
  const server = await serveMap(serve);
  const { ctx, page, errs } = await phone(browser, cpu);
  await page.addInitScript({ content: "window.__DRAWN=[];(function(){var f=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t){try{window.__DRAWN.push(String(t));}catch(e){}return f.apply(this,arguments);};})();" });
  const t0 = Date.now();
  await page.goto('http://127.0.0.1:' + server.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html?tier=town', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction("window.BohemiaSettlement && BohemiaSettlement.where && BohemiaSettlement.where('bar')", null, { timeout: 120000 });
  const readyMs = await page.evaluate('Math.round(performance.now())');
  const at = await page.evaluate("(function(){var p=BohemiaSettlement.where('bar'),c=document.querySelector('canvas').getBoundingClientRect();return {x:p.x!==undefined?p.x:p[0],y:p.y!==undefined?p.y:p[1],cx:c.left,cy:c.top};})()");
  await page.evaluate('window.__DRAWN.length=0');
  await page.mouse.move(at.x, at.y); await page.mouse.down();
  await page.waitForTimeout(900);
  const drawn = await page.evaluate('Array.from(new Set(window.__DRAWN))');
  const shot = path.join(os.tmpdir(), 'mods_ten_bar_' + Date.now() + '.png');
  await page.screenshot({ path: shot });
  await page.mouse.up();
  await ctx.close(); server.close();
  return { readyMs, wallMs: Date.now() - t0, at, drawn: drawn.filter(s => /[A-Z]{3}/.test(s)).slice(0, 12), shot, errs: errs.length };
}
/* the cache wall: the server the guide names (python3 -m http.server sends Last-Modified and no Cache-Control), a real
   edit, a plain reload. A browser may keep such a file for a tenth of its age (RFC 9111 4.2.2, the heuristic Chromium
   uses), and a clone's files are as old as the clone, so ageMin says how long ago he cloned when he first loaded the page.
   Read after the edit: a plain reload, the same URL typed again, the reload that skips the cache (shift-reload), after
   waitSec more seconds, and a fresh browser (a private window). */
async function cacheWall(browser, ageMin, waitSec) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mods-ten-root-'));
  ['slices', 'engine'].forEach(d => fs.symlinkSync(path.join(ROOT, d), path.join(dir, d)));
  fs.mkdirSync(path.join(dir, 'records/target/bb'), { recursive: true });
  fs.readdirSync(path.join(ROOT, 'records/target')).forEach(f => { if (f !== 'bb') fs.symlinkSync(path.join(ROOT, 'records/target', f), path.join(dir, 'records/target', f)); });
  fs.readdirSync(path.join(ROOT, 'records/target/bb')).forEach(f => {
    const src = path.join(ROOT, 'records/target/bb', f), dst = path.join(dir, 'records/target/bb', f);
    if (f === 'weapons.json') { fs.copyFileSync(src, dst); const old = new Date(Date.now() - ageMin * 60e3); fs.utimesSync(dst, old, old); }
    else fs.symlinkSync(src, dst); });
  const port = 8000 + Math.floor(Math.random() * 900) + 50;
  const py = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: dir, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 900));
  const DAG = "(function(){var r=(DB.weapons.rows.length?DB.weapons.rows:Object.values(DB.weapons.rows)).filter(function(x){return x.id==='dagger';})[0];return r.damage_min+' to '+r.damage_max;})()";
  const ctx = await browser.newContext(PHONE), page = await ctx.newPage(), cdp = await ctx.newCDPSession(page);
  const url = 'http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html';
  const read = async (p) => { await (p || page).waitForFunction('typeof DB !== "undefined" && DB.weapons && window.FIGHT_UI && FIGHT_UI.t0 > 0', null, { timeout: 120000 });
    return (p || page).evaluate(DAG); };
  await page.goto(url); const t1 = Date.now(); const before = await read();
  const wf = path.join(dir, 'records/target/bb/weapons.json');
  fs.writeFileSync(wf, bumpRow(fs.readFileSync(wf, 'utf8'), 'dagger', 5));
  await page.reload(); const reload = await read();
  await page.goto(url); const typedAgain = await read();
  let later = null;
  if (waitSec) { const left = waitSec * 1000 - (Date.now() - t1); if (left > 0) await new Promise(r => setTimeout(r, left)); await page.reload(); later = await read(); }
  await page.goto('about:blank'); await page.goto(url); await read();
  fs.writeFileSync(wf, bumpRow(fs.readFileSync(wf, 'utf8'), 'dagger', 5));   /* a second edit, then the shift-reload */
  await cdp.send('Page.reload', { ignoreCache: true }); await page.waitForTimeout(300); const shiftReload = await read();
  const c2 = await browser.newContext(PHONE), p2 = await c2.newPage();
  await p2.goto(url); const freshBrowser = await read(p2);
  await ctx.close(); await c2.close(); py.kill();
  fs.rmSync(dir, { recursive: true, force: true });
  return { ageMin, window_sec: Math.round(ageMin * 6), edit: '15 to 35 -> 20 to 40 (shift-reload checks a second edit, 25 to 45)',
           before, reload, typedAgain, later: waitSec ? { afterSec: waitSec, reload: later } : null, shiftReload, freshBrowser };
}
/* which weapons the demo's first road parties carry: the bench with the map's own first party (rule 75b) at ten seeds */
/* and the company the demo's door hands the fight when nothing is picked (BOH_START's 'newcrew', its men from origins.json) */
async function firstRoads(browser) {
  const O = JSON.parse(rd('records/target/bb/origins.json')).origins, def = O.find(o => o.id === 'newcrew');
  const company = def.men.map(m => ({ background: m.background, level: m.level }));
  const seen = { crew: {}, foes: {}, door_company: {} };
  for (let s = 1; s <= 10; s++) {
    const party = { count: 3, days: 1, difficulty: 0, faction: 'brigands' };
    const r = await fightCard(browser, {}, { cpu: 1, fight: { seed: s, kind: 'strip', party } });
    r.crew.forEach(w => seen.crew[w] = (seen.crew[w] || 0) + 1); r.foes.forEach(w => seen.foes[w] = (seen.foes[w] || 0) + 1);
    if (s <= 3) { const d = await fightCard(browser, {}, { cpu: 1, fight: { seed: s, kind: 'strip', party, company, cap: def.field_cap } });
      d.crew.forEach(w => seen.door_company[w] = (seen.door_company[w] || 0) + 1); }
  }
  return seen;
}

async function live() {
  const { chromium } = require(PW);
  const browser = await chromium.launch();
  const out = {};
  try {
    const W5 = tmpWith('records/target/bb/weapons.json', t => bumpRow(t, 'dagger', 5));
    out.fight_before = await fightCard(browser, {}, { cpu: 4, fight: { seed: 31, kind: 'strip' } });
    out.fight_after = await fightCard(browser, { '/records/target/bb/weapons.json': W5 }, { cpu: 4, fight: { seed: 31, kind: 'strip' } });
    const S2 = tmpWith('slices/BOHEMIA_SETTLEMENT_SCREEN.html', t => t.replace("name:'THE BAR',", "name:'THE SALOON',"));
    out.bar_before = await barName(browser, {}, 4);
    out.bar_after = await barName(browser, { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': S2 }, 4);
    out.cache = [await cacheWall(browser, 10, 75), await cacheWall(browser, 24 * 60, 0)];
    out.first_roads = await firstRoads(browser);
  } finally { await browser.close(); }
  return out;
}

(async function main() {
  const res = { front: frontDoor(), W: weapon(), H: hair(), B: building() };
  if (LIVE) res.live = await live();
  if (JSON_OUT) { console.log(JSON.stringify(res, null, 1)); return; }
  const f = res.front, W = res.W, H = res.H, B = res.B;
  console.log('MODS [a modder\'s first hour] -- change one thing in ten minutes');
  console.log('FRONT DOOR: ' + f.root_entries + ' entries at the root, ' + f.root_md + ' .md, README: ' + (f.readme.length ? f.readme.join(',') : 'NONE') + '; MODDING.md ' + f.modding_words + ' words');
  console.log('W  the screen says ' + W.screen.card_title + ' (' + W.screen.small_print + '); it lives in ' + W.lives.file + ' id ' + W.lives.id + ' line ' + W.lives.line + ', ' + W.lives.damage.join(' to '));
  console.log('   search "pistol": ' + W.search.pistol.files + ' files (' + W.search.pistol.game_files + ' game), ' + W.search.pistol_in_weapons_json + ' in weapons.json; MODDING.md names: ' + W.guide.modding_names + '; knife carried by the crew: ' + W.guide.knife_carried_by_crew);
  console.log('   the crew\'s weapon names on the screen found in weapons.json or armor.json: ' + W.screen_names_found + ' (' + W.screen_names.map(n => n.screen + '=' + n.row).join(', ') + ')');
  console.log('   best case: ' + W.best_case.words + ' words, ' + W.best_case.read_min + ' min reading + ' + W.best_case.edit_sec + ' s edit');
  console.log('H  ' + H.screen.look + ': body ' + H.screen.body + ' (side ' + H.screen.side + '), portrait ' + H.screen.portrait + '; the two words agree on ' + H.agree + ' looks; ' + H.cuts.named + ' named cuts against ' + H.cuts.portrait_classes.length + ' portrait classes');
  H.places.forEach(p => console.log('   ' + p.where + ' = ' + JSON.stringify(p.says) + '  (' + p.role + ')'));
  console.log('   pictures to remake ' + H.pictures + ' (' + H.bytes + ' bytes); crew to look: ' + H.crew_to_look + '; bpy here: ' + H.here.bpy_importable + '; the label read by a screen: ' + H.the_trap.read_by_a_screen);
  console.log('   the same man in the fight and on the crew screen wears the same look: ' + H.same_man_same_look.same + ' (' + H.same_man_same_look.men.filter(x => x.fight !== x.crew_screen).map(x => x.name + ' ' + x.fight.replace('cast_', '') + '/' + x.crew_screen.replace('cast_', '')).join(', ') + ')');
  console.log('   best case: ' + H.best_case.body_words + ' words, ' + H.best_case.body_read_min + ' min reading for the body, ' + H.best_case.all_read_min + ' with the face; the bake ' + H.best_case.bake_sec + ' s');
  console.log('   data line row files naming the look: ' + H.guide.of_those_naming_the_look.length + ' of ' + H.guide.data_line_row_files.length + '; search "' + H.search.cut_name.word + '": ' + H.search.cut_name.files + ' files (' + H.search.cut_name.game_files + ' game)');
  console.log('B  the screen says ' + B.screen.name + ' (' + B.screen.where + '); it lives in ' + B.lives.file + ' table B line ' + B.lives.line);
  console.log('   search "' + B.screen.name + '": ' + B.search.files + ' files (' + B.search.game_files + ' game): ' + B.search.game.join(', '));
  console.log('   data line names it: ' + B.guide.data_line_names_it + '; a mod can patch it: ' + B.as_a_mod + '; best case ' + B.best_case.words + ' words, ' + B.best_case.read_min + ' min + ' + B.best_case.edit_sec + ' s; guided ' + B.guided.words + ' words, ' + B.guided.read_min + ' min');
  if (res.live) {
    const L = res.live;
    console.log('LIVE (phone, CPU 4x): fight before ' + L.fight_before.boardMs + ' ms, card "' + ((L.fight_before.card || '').match(/^.*?·\s*\S+|Damage \d+ to \d+/g) || []).join(' ... ') + '"');
    console.log('                       fight after  ' + L.fight_after.boardMs + ' ms, card "' + ((L.fight_after.card || '').match(/^.*?·\s*\S+|Damage \d+ to \d+/g) || []).join(' ... ') + '"');
    console.log('                       bar before ready ' + L.bar_before.readyMs + ' ms drew ' + JSON.stringify(L.bar_before.drawn));
    console.log('                       bar after  ready ' + L.bar_after.readyMs + ' ms drew ' + JSON.stringify(L.bar_after.drawn));
    L.cache.forEach(c => console.log('CACHE cloned ' + c.ageMin + ' min before (window ' + c.window_sec + ' s): before ' + c.before + ' | reload ' + c.reload + ' | typed again ' + c.typedAgain + (c.later ? ' | reload at ' + c.later.afterSec + ' s ' + c.later.reload : '') + ' | shift-reload ' + c.shiftReload + ' | fresh browser ' + c.freshBrowser));
    console.log('FIRST ROADS (10 seeds): crew ' + JSON.stringify(L.first_roads.crew) + ' foes ' + JSON.stringify(L.first_roads.foes));
    console.log('THE DOOR\'S OWN COMPANY (newcrew, 3 seeds): ' + JSON.stringify(L.first_roads.door_company));
  }
})().catch(e => { console.error(e); process.exit(1); });
