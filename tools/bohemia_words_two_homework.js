#!/usr/bin/env node
// WORDS TWO [his homework] 11/17 -- VAMILY rule 454(c), ask row 629.
// Paolo 11/17: 'every time you have a human talk it's so fucking bad... don't do anything to fix it yet... I'm also down to do a
// little homework for you, 20, 30, 40, 110, but each thing you present to me has to be really understanding to teach you... you
// show me one sentence or one dialog caption that you made and then I'll tell you how I want that shit to sound.'
//
// WHAT THIS DOES. It reads a sheet of homework cards (records/target/words_two/homework_<NN>.json), and for each card:
//   1. PULLS THE LINE FROM THE GAME'S OWN DATA, never from the sheet. A card names a file and a locator (a JSON path, a module
//      path, or a pattern with one capture); the string is read out of that file at build time. A card may carry `expect`, the
//      first words of the line, as a tripwire: if the data moved and the locator now lands on another line, the tool stops.
//   2. Cuts the speaker's face from the game's own face bank (the fight's face strips or a portrait file).
//   3. Draws ONE picture: the face, who it is, the line as the game words it, to whom and when. Nothing of ours is on it: no
//      rewrite, no suggestion. (He said he will tell us.)
//   4. Registers the card in the VOTE tab's registry (kind line, lane words two), the title being the line itself so the card
//      reads in five seconds without a tap, the why being who says it, to whom and when in two sentences (rule 22f).
// THIS TOOL REWRITES NOTHING IN THE GAME. It reads game files and writes only its own pictures, its own pulled.json and its own
// rows in the registry.
//
//   node tools/bohemia_words_two_homework.js --sheet 01            # pictures + pulled.json, registry untouched
//   node tools/bohemia_words_two_homework.js --sheet 01 --register # and append (or refresh) this sheet's rows in the registry
//   node tools/bohemia_words_two_homework.js --sheet 01 --check    # exit 1 if any registered title is not the data's own line
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const has = k => process.argv.indexOf(k) > 0;
const SHEET = String(arg('--sheet', '01')).padStart(2, '0');
const SHEET_FILE = path.join(ROOT, 'records/target/words_two/homework_' + SHEET + '.json');
const OUT_DIR = path.join(ROOT, 'slices/vote/words_two_homework_' + SHEET);
const REG_FILE = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const LANE = 'words two';

/* ---------- 1. THE LINE COMES OUT OF THE GAME'S FILE ---------- */
function walk(obj, p) {   /* p: an array of keys and indexes; a key may be {find:{k:v}} to pick the row of a list by a field */
  let o = obj;
  for (const k of p) {
    if (o == null) throw new Error('path runs out at ' + JSON.stringify(k));
    if (k && typeof k === 'object' && k.find) {
      if (!Array.isArray(o)) throw new Error('find on a thing that is not a list');
      const hit = o.filter(r => r && Object.keys(k.find).every(f => r[f] === k.find[f]));
      if (hit.length !== 1) throw new Error('find ' + JSON.stringify(k.find) + ' matched ' + hit.length + ' rows');
      o = hit[0];
    } else o = o[k];
  }
  return o;
}
function loadModule(file) {   /* a game script run in an empty sandbox: it hangs its tables on window/module, we read them */
  const src = fs.readFileSync(file, 'utf8');
  const box = { console: { log() {}, warn() {}, error() {} }, setTimeout() {}, clearTimeout() {}, setInterval() {}, Math, JSON, Date, Object, Array, String, Number, Boolean, RegExp, Error, parseInt, parseFloat, isNaN };
  box.window = box; box.self = box; box.globalThis = box; box.root = box;
  box.module = { exports: {} }; box.exports = box.module.exports;
  box.document = undefined; box.localStorage = undefined;
  vm.createContext(box);
  try { vm.runInContext(src, box, { filename: file, timeout: 8000 }); } catch (e) { box.__err = String(e && e.message || e); }
  return box;
}
function pull(card) {
  const P = card.pull, file = path.join(ROOT, P.file);
  if (!fs.existsSync(file)) throw new Error('no such file ' + P.file);
  let s;
  if (P.json) s = walk(JSON.parse(fs.readFileSync(file, 'utf8')), P.json);
  else if (P.module) {
    const box = loadModule(file), p = P.module.slice();
    let o = p[0] === 'exports' ? box.module.exports : box[p[0]];
    if (o == null) throw new Error('the script did not hang ' + p[0] + (box.__err ? ' (' + box.__err + ')' : ''));
    s = walk(o, p.slice(1));
  } else if (P.re) {
    const txt = fs.readFileSync(file, 'utf8'), m = txt.match(new RegExp(P.re, P.flags || ''));
    if (!m || m[1] == null) throw new Error('the pattern found nothing');
    s = P.unescape === false ? m[1] : m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\u([0-9a-fA-F]{4})/g, (x, h) => String.fromCharCode(parseInt(h, 16)));
  } else throw new Error('a card needs pull.json, pull.module or pull.re');
  if (Array.isArray(s)) s = s.join('\n');
  if (typeof s !== 'string' || !s.trim()) throw new Error('the locator did not land on words: ' + JSON.stringify(s).slice(0, 80));
  if (card.expect && s.indexOf(card.expect) !== 0) throw new Error('the data moved: wanted a line starting ' + JSON.stringify(card.expect) + ', found ' + JSON.stringify(s.slice(0, 60)));
  return s;
}
/* A BLANK THE GAME FILLS ({pay}, {name}) is filled the way the game fills it: from the same row of the same file ({json: path})
   or with a name the sheet declares; the line as the file holds it is kept beside the filled one in pulled.json */
function filled(card, raw) {
  let s = raw; const used = {};
  Object.keys(card.fill || {}).forEach(k => {
    const f = card.fill[k]; let v = f;
    if (f && typeof f === 'object') v = walk(JSON.parse(fs.readFileSync(path.join(ROOT, f.file || card.pull.file), 'utf8')), f.json);
    used[k] = String(v); s = s.split('{' + k + '}').join(String(v));
  });
  if (/\{[a-z_]+\}/.test(s)) throw new Error('a blank is left in the line: ' + s);
  /* A KEEPER'S LINE GOES THROUGH THE GAME'S OWN SPANGLISH DIAL (slices/BOHEMIA_SETTLEMENT_SCREEN.html speak(), rule 143(a)): about
     seven times in eight the game shows plain(line), the tag word of Spanish taken out. The card shows what he usually reads, made
     by the game's own function (engine/bohemia_spanglish.js plain), never by hand; the line as stored stays in pulled.json. */
  if (card.through === 'BohemiaSpanglish.plain') {
    const box = loadModule(path.join(ROOT, 'engine/bohemia_spanglish.js')), SP = box.BohemiaSpanglish || box.module.exports;
    if (!SP || typeof SP.plain !== 'function') throw new Error('the Spanglish engine did not load');
    used['(shown through)'] = 'BohemiaSpanglish.plain'; s = SP.plain(s);
  }
  return { line: s, used };
}
function also(card, key) {   /* a name or the choices under a card, read from the same file */
  const q = card[key]; if (!q) return null;
  const v = walk(JSON.parse(fs.readFileSync(path.join(ROOT, q.file || card.pull.file), 'utf8')), q.json);
  return Array.isArray(v) ? v.map(o => (o && typeof o === 'object') ? o[q.field || 't'] : o) : v;
}

/* ---------- 2. THE FACE COMES OUT OF THE GAME'S FACE BANK ---------- */
const RIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_rig/fight_rig.json'), 'utf8')).faces;
function faceOf(card) {   /* -> { file (absolute), x, y, s } or null (a mouth with no face: a post in the feed) */
  const f = card.face; if (!f) return null;
  if (f.look) {
    const i = RIG.order.indexOf(f.look);
    if (i >= 0) return { file: path.join(ROOT, 'slices/fight_rig', RIG.file), x: i * RIG.size, y: 0, s: RIG.size };
    for (const M of RIG.more || []) { const j = M.order.indexOf(f.look); if (j >= 0) return { file: path.join(ROOT, 'slices/fight_rig', M.file), x: j * RIG.size, y: 0, s: RIG.size }; }
    throw new Error('no face in the bank for look ' + f.look);
  }
  if (f.file) { const p = path.join(ROOT, f.file); if (!fs.existsSync(p)) throw new Error('no face file ' + f.file); return { file: p, x: f.x || 0, y: f.y || 0, s: f.s || 128, w: f.w, h: f.h }; }
  return null;
}

/* ---------- 3. ONE PICTURE ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const b64 = f => 'data:' + (/\.webp$/.test(f) ? 'image/webp' : /\.png$/.test(f) ? 'image/png' : 'font/woff2') + ';base64,' + fs.readFileSync(f).toString('base64');
function html(card, line, face) {
  const F = n => b64(path.join(ROOT, 'slices/fonts', n));
  const long = line.length > 150, mid = line.length > 70;
  const size = card.layout === 'bark' ? 30 : long ? 17 : mid ? 21 : 26;
  const faceCss = face ? ('background-image:url(' + b64(face.file) + ');background-position:-' + (face.x * 96 / face.s) + 'px -' + (face.y * 96 / face.s) + 'px;background-size:auto ' + (96 * ((face.h || face.s) / face.s)) + 'px;') : '';
  const feed = card.layout === 'feed';
  return '<!doctype html><meta charset="utf-8"><style>'
    + "@font-face{font-family:'BohemiaCasing';src:url(" + F('BohemiaCasing-Regular.woff2') + ") format('woff2')}"
    + "@font-face{font-family:'BohemiaROM';src:url(" + F('BohemiaROM-Regular.woff2') + ") format('woff2')}"
    + "@font-face{font-family:'BohemiaBody';src:url(" + F('BohemiaBody-Regular.woff2') + ") format('woff2')}"
    + '*{box-sizing:border-box}html,body{margin:0;background:#15110c}'
    + '#c{width:390px;padding:12px 12px 14px;background:#15110c;color:#f2e4c6;font-family:BohemiaBody,ui-monospace,monospace}'
    + '.tag{font:11px BohemiaCasing,ui-monospace,monospace;letter-spacing:2px;color:#b7a67f;display:flex;justify-content:space-between;gap:8px;margin:0 2px 9px}'
    + '.tag b{font-weight:400;color:#e3b04b}'
    + '.board{background:#2a2016;border-left:3px solid ' + (card.side === 'you' ? '#7fae8a' : card.side === 'them' ? '#c4553f' : '#d8ceb6') + ';padding:14px 12px 14px 12px;box-shadow:3px 2px 0 rgba(10,6,3,.6)}'
    + '.head{display:flex;gap:12px;align-items:flex-end;margin-bottom:12px}'
    + '.photo{flex:0 0 auto;width:96px;height:96px;background-color:#0d0b09;background-repeat:no-repeat;image-rendering:pixelated;transform:rotate(-1.4deg);box-shadow:0 0 0 1px #0d0a07,0 0 0 3px #d8ceb6,0 0 0 4px #0d0a07,3px 4px 0 rgba(0,0,0,.55)}'
    + '.who{min-width:0}.who .n{font:19px BohemiaCasing,ui-monospace,monospace;letter-spacing:1.5px;line-height:1.15;color:#f2e4c6}'
    + '.who .r{font:12px BohemiaROM,ui-monospace,monospace;letter-spacing:1px;color:#b7a67f;margin-top:5px;line-height:1.3}'
    + '.say{font:' + size + 'px/1.32 BohemiaBody,ui-monospace,monospace;color:#fff6dc;white-space:pre-wrap;overflow-wrap:anywhere}'
    + '.say.bark{letter-spacing:.5px}'
    + '.post{background:#0f1113;border:1px solid #2c3136;padding:12px}.post .h{font:13px BohemiaROM,ui-monospace,monospace;color:#8fb6c9;letter-spacing:.5px;margin-bottom:7px}'
    + '.post .say{color:#eef1f2}'
    + '.opts{margin-top:12px;display:flex;flex-direction:column;gap:6px}.opts span{font:12px/1.35 BohemiaROM,ui-monospace,monospace;letter-spacing:1px;color:#d8ceb6;border:1px solid #6b5c41;padding:7px 9px}'
    + '.meta{margin:11px 2px 0;font:12px/1.45 BohemiaROM,ui-monospace,monospace;letter-spacing:.6px;color:#b7a67f}.meta b{font-weight:400;color:#e3b04b}'
    + '</style><div id="c">'
    + '<div class="tag"><span>' + esc(card.mouth) + '</span><b>' + esc(card.tab) + '</b></div>'
    + (feed
      ? '<div class="post"><div class="h">' + esc(card.who) + '</div><div class="say">' + esc(line) + '</div></div>'
      : '<div class="board"><div class="head">' + (face ? '<div class="photo" style="' + faceCss + '"></div>' : '')
        + '<div class="who"><div class="n">' + esc(card.who) + '</div>' + (card.role ? '<div class="r">' + esc(card.role) + '</div>' : '') + '</div></div>'
        + '<div class="say' + (card.layout === 'bark' ? ' bark' : '') + '">' + esc(line) + '</div>'
        + (card.choices && card.choices.length ? '<div class="opts">' + card.choices.map(c => '<span>' + esc(c) + '</span>').join('') + '</div>' : '')
        + '</div>')
    + '<div class="meta"><b>TO</b> ' + esc(card.to) + '<br><b>WHEN</b> ' + esc(card.when) + (card.second ? '<br><b>THE TEST</b> scary, then ' + esc(String(card.second).toLowerCase()) : '') + '</div>'
    + '</div>';
}

/* ---------- 4. THE CARD IN THE REGISTRY ---------- */
function oneSentence(s) { return String(s).replace(/[.!?]+(\s|$)/g, (m, sp) => ',' + sp).replace(/,\s*$/, '').trim(); }   /* a why is two sentences: nothing inside it may end one */
function row(card, line, sha, px) {
  const flat = line.replace(/\s*\n\s*/g, ' / ');
  return {
    id: card.id, kind: 'line', lane: LANE, sha: sha, made: card.made, draft: true,
    title: '“' + flat + '”',
    said: card.said || "you show me one sentence or one dialog caption that you made and then I'll tell you how I want that shit to sound",
    /* SCARY FIRST (rule 455, Paolo 11/17: 'there's two words, but the first word is always scary'): a card of a later sheet names
       the second word it is there to test, so his answer shows how THAT pair sounds */
    why: 'HOW SHOULD THIS SOUND? ' + (card.second ? 'It is here to test SCARY, THEN ' + oneSentence(card.second) + ': ' : '') + oneSentence(card.who_plain) + ' says it to ' + oneSentence(card.to) + ' when ' + oneSentence(card.when)
       + ' (you see it ' + oneSentence(card.where) + '); type your way in the box, then tap a thumb to send it.',
    /* the picture is one thing already: it is its own first picture, and a tap opens it at one image pixel to one point (rule 89) */
    show: { how: 'image', src: 'vote/words_two_homework_' + SHEET + '/' + card.id + '.webp', first: 'vote/words_two_homework_' + SHEET + '/' + card.id + '.webp', firstAt: [0, 0, px[0], px[1]] },
    homework: { sheet: +SHEET, n: card.n, mouth: card.mouth, second: card.second || undefined, teaches: card.teaches, pulled_from: card.pull.file, line: line }
  };
}

(async () => {
  const sheet = JSON.parse(fs.readFileSync(SHEET_FILE, 'utf8'));
  const cards = sheet.cards, pulled = [], bad = [];
  cards.forEach(c => { if (sheet.said && !c.said) c.said = sheet.said; });
  for (const c of cards) {
    try {
      const raw = pull(c), f = filled(c, raw), who = also(c, 'who_pull'), ch = also(c, 'choices_pull');
      if (who) c.who = (c.who_prefix || '') + who;
      const role = also(c, 'role_pull'); if (role) c.role = role;
      if (ch) c.choices = ch;
      pulled.push({ card: c, raw, line: f.line, used: f.used, face: faceOf(c) });
    } catch (e) { bad.push(c.id + ': ' + e.message); }
  }
  if (bad.length) { console.error('NOT PULLED:\n  ' + bad.join('\n  ')); process.exit(1); }
  if (has('--check')) {
    const reg = JSON.parse(fs.readFileSync(REG_FILE, 'utf8')), by = {}; reg.items.forEach(i => { by[i.id] = i; });
    const judged = new Set((reg.verdicts || []).map(v => v.id));   /* a card he answered is history: the game may be rewritten under it one day */
    const off = pulled.filter(p => !judged.has(p.card.id) && (!by[p.card.id] || by[p.card.id].homework.line !== p.line)).map(p => p.card.id);
    console.log(off.length ? 'OFF THE DATA: ' + off.join(', ') : 'every card on sheet ' + SHEET + ' is the data\'s own line (' + pulled.length + ')');
    process.exit(off.length ? 1 : 0);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
  const sharp = (function () { try { return require('sharp'); } catch (e) { return null; } })();
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const p of pulled) {
    await pg.setContent(html(p.card, p.line, p.face)); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(60);
    const el = await pg.$('#c'), png = path.join(OUT_DIR, p.card.id + '.png');
    await el.screenshot({ path: png });
    p.box = await el.boundingBox();
  }
  await br.close();
  /* png -> webp (the registry's pictures are webp); PIL does it where sharp is not installed */
  const { execFileSync } = require('child_process');
  const dims = JSON.parse(execFileSync('python3', ['-c', 'import sys,glob,os,json\nfrom PIL import Image\nd={}\nfor f in glob.glob(sys.argv[1]+"/*.png"):\n    im=Image.open(f); d[os.path.basename(f)[:-4]]=list(im.size); im.save(f[:-4]+".webp",lossless=True,method=6); os.remove(f)\nprint(json.dumps(d))', OUT_DIR], { encoding: 'utf8' }));
  pulled.forEach(p => { p.px = dims[p.card.id]; });
  fs.writeFileSync(path.join(OUT_DIR, 'pulled.json'), JSON.stringify({ draft: true, tool: 'tools/bohemia_words_two_homework.js', sheet: +SHEET,
    note: 'every line below was read out of the named game file by this tool; none was typed',
    cards: pulled.map(p => ({ n: p.card.n, id: p.card.id, mouth: p.card.mouth, who: p.card.who, pulled_from: p.card.pull.file, locator: p.card.pull.json || p.card.pull.module || p.card.pull.re, in_the_file: p.raw, filled_with: Object.keys(p.used).length ? p.used : undefined, line: p.line, picture_pt: [Math.round(p.box.width), Math.round(p.box.height)] })) }, null, 1) + '\n');
  pulled.forEach(p => console.log(String(p.card.n).padStart(2) + '  ' + p.card.id + '  ' + Math.round(p.box.height) + ' pt  ' + JSON.stringify(p.line.slice(0, 90))));
  if (has('--register')) {
    /* INSERT AS TEXT, NEVER RE-SERIALIZE (tools/bohemia_merge_the_vote_registry.js, 9/27: a whole-file dump re-encodes every
       other lane's rows). My rows go in before the end of items[]; a row of mine already there is replaced in place; every
       other byte of the file is left as found. */
    let txt = fs.readFileSync(REG_FILE, 'utf8');
    const reg = JSON.parse(txt), sha = arg('--sha', 'PENDINGSHA');
    const judged = new Set((reg.verdicts || []).map(v => v.id)), other = new Set(reg.items.filter(i => i.lane !== LANE).map(i => i.id));
    const block = o => JSON.stringify(o, null, 1).split('\n').map(l => '  ' + l).join('\n');
    let added = 0, fresh = 0;
    pulled.slice().reverse().forEach(p => {   /* appended last card first: the tab draws the newest row on top, so card 1 leads */
      if (judged.has(p.card.id)) return;      /* a judged card is history: never rewritten */
      if (other.has(p.card.id)) throw new Error('the id ' + p.card.id + ' is another lane\'s row');
      const b = block(row(p.card, p.line, sha, p.px)), head = '\n  {\n   "id": ' + JSON.stringify(p.card.id) + ',';
      const at = txt.indexOf(head);
      if (at >= 0) { const end = txt.indexOf('\n  }', at + 1); if (end < 0) throw new Error('no end for ' + p.card.id); txt = txt.slice(0, at + 1) + b + txt.slice(end + 4); fresh++; }
      else { const m = txt.match(/\n(\s*)\],\n(\s*)"verdicts"/); if (!m) throw new Error('cannot find the end of items[]'); txt = txt.slice(0, m.index) + ',\n' + b + txt.slice(m.index); added++; }
    });
    const back = JSON.parse(txt);   /* it must still be one valid file, and every card on it exactly once */
    pulled.forEach(p => { if (back.items.filter(i => i.id === p.card.id).length !== 1 && !judged.has(p.card.id)) throw new Error(p.card.id + ' is not on the file exactly once'); });
    fs.writeFileSync(REG_FILE, txt);
    console.log('registered: ' + added + ' new, ' + fresh + ' refreshed (lane ' + LANE + ', sha ' + sha + '); items ' + back.items.length);
  }
})().catch(e => { console.error(e); process.exit(1); });
