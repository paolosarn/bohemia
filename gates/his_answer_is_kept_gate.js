#!/usr/bin/env node
/* HIS ANSWER IS KEPT (WORDS THREE 11/20/26; VAMILY rules 465, 454(c), 441; ask row 629)
   PAOLO 11/20: 'im still not done with the replacement text vibes from the voting shit'. He is typing his own lines into the
   homework cards in the VOTE tab, on his phone, one card at a time. MEASURED BEFORE THIS GATE (the real tab, a phone upright): a line
   typed into a card behind MORE and not yet thumbed was GONE after closing and opening MORE (draw() rebuilds every row), and GONE after
   a reload. The tab now keeps every card's box on the phone as he types (slices/BOHEMIA_VOTE_TAB.html, DRAFTKEY), the way its ANYTHING
   ELSE box always was. This gate drives the real tab page in a browser, the way he holds it:
     K1  a homework card's box asks for the line his way ('type how it should sound...'), not 'say why'
     K2  a line typed in a homework card behind MORE is still in the box after MORE is closed and opened again
     K3  ... and after the page is reloaded
     K4  a thumb sends it: the vote on this phone carries his words exactly, and the kept copy is cleared
     K5  UNDO brings the card back with his words in its box
     K6  every other card's box is as it was ('say why, if you want to')
     K7  upright and sideways, no page error
     P   PLANT: the same tab with the keeping taken out is served in place of the real one; K2 and K3 go red
   A browser, its own small server on a free port, about half a minute.   node gates/his_answer_is_kept_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const TAB = 'slices/BOHEMIA_VOTE_TAB.html', REG = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
let pass = 0, fail = 0;
const ok = (n, g, why) => { console.log((g ? '  ok   ' : '  FAIL ') + n + (why ? '  [' + why + ']' : '')); g ? pass++ : fail++; };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };

function serve(plantHtml) {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '');
      if (plantHtml && rel === TAB) { r.setHeader('content-type', 'text/html'); return r.end(plantHtml); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end('no'); }
      r.setHeader('content-type', TYPES[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function walk(br, port, vp, cardId, otherId) {
  const ctx = await br.newContext({ viewport: vp, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  const url = 'http://127.0.0.1:' + port + '/' + TAB;
  const open = async () => { await pg.goto(url); await pg.waitForFunction(() => window.__voteReady === true, null, { timeout: 30000 }); if (await pg.$('#fold:not([hidden])')) { const f = await pg.$('#more .row'); if (!f) { await pg.click('#fold'); await pg.waitForTimeout(300); } } };
  const box = id => '.row[data-id="' + id + '"] textarea.note';
  const R = {};
  await open();
  R.placeholder = await pg.getAttribute(box(cardId), 'placeholder');
  /* the other card is one the tab really draws (an art card with no mark is held back, rule 408(c)) */
  R.otherPlaceholder = await pg.$eval('.row:not([data-id^="words-two-hw"]) textarea.note', t => t.getAttribute('placeholder')).catch(() => null);
  const line = 'yo we were told to watch for you, ' + vp.width + ' wide';
  await pg.fill(box(cardId), line);
  await pg.click('#fold'); await pg.waitForTimeout(250); await pg.click('#fold'); await pg.waitForTimeout(400);
  R.afterMore = await pg.inputValue(box(cardId)).catch(() => null);
  await pg.fill(box(cardId), line + ' again');
  await open();
  R.afterReload = await pg.inputValue(box(cardId)).catch(() => null);
  await pg.click('.row[data-id="' + cardId + '"] button.tb.up'); await pg.waitForTimeout(500);
  R.sent = await pg.evaluate(id => { try { return (JSON.parse(localStorage.getItem('bohemia.vote.verdicts.v1') || '{}')[id] || {}).said; } catch (e) { return null; } }, cardId);
  R.draftLeft = await pg.evaluate(id => { try { return JSON.parse(localStorage.getItem('bohemia.vote.drafts.v1') || '{}')[id] || null; } catch (e) { return 'unreadable'; } }, cardId);
  await pg.click('#undo'); await pg.waitForTimeout(300);
  if (!(await pg.$(box(cardId)))) { await pg.click('#fold'); await pg.waitForTimeout(300); }
  R.afterUndo = await pg.inputValue(box(cardId)).catch(() => null);
  R.line = line; R.errors = errs;
  await ctx.close();
  return R;
}

(async () => {
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, REG), 'utf8'));
  const judged = new Set((reg.verdicts || []).map(v => v.id));
  const hw = reg.items.filter(i => i.homework && i.lane === 'words two' && !judged.has(i.id));
  const card = (hw[0] || {}).id;   /* any homework card still waiting */
  const other = (reg.items.slice().reverse().find(i => !i.homework && i.kind !== 'tile' && !judged.has(i.id) && !/art|look/.test(i.kind || '')) || {}).id;
  if (!card) { ok('K0 a homework card is waiting in the tab', false, 'none'); return finish(); }
  const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
  const br = await chromium.launch();
  const srv = await serve(null), port = srv.address().port;
  for (const [name, vp] of [['upright', { width: 390, height: 844 }], ['sideways', { width: 844, height: 390 }]]) {
    const R = await walk(br, port, vp, card, other);
    ok('K1 ' + name + ': the homework card\'s box asks for the line his way', /how it should sound/.test(R.placeholder || ''), R.placeholder);
    ok('K2 ' + name + ': a typed line survives closing and opening MORE', R.afterMore === R.line, JSON.stringify(R.afterMore));
    ok('K3 ' + name + ': ... and a reload', R.afterReload === R.line + ' again', JSON.stringify(R.afterReload));
    ok('K4 ' + name + ': a thumb sends his words exactly and clears the kept copy', R.sent === R.line + ' again' && R.draftLeft === null, JSON.stringify([R.sent, R.draftLeft]));
    ok('K5 ' + name + ': UNDO brings the card back with his words in the box', R.afterUndo === R.line + ' again', JSON.stringify(R.afterUndo));
    ok('K6 ' + name + ': any other card\'s box is as it was', !other || R.otherPlaceholder === 'say why, if you want to' || R.otherPlaceholder === null, R.otherPlaceholder);
    ok('K7 ' + name + ': no page error', R.errors.length === 0, R.errors.slice(0, 2).join(' | '));
  }
  srv.close();
  /* the plant: the keeping taken out */
  const real = fs.readFileSync(path.join(ROOT, TAB), 'utf8');
  const plant = real.replace(/\n\s*if\(drafts\[it\.id\]\) n\.value = drafts\[it\.id\];/, '').replace(/\n\s*n\.addEventListener\('input', function\(\)\{ keepDraft\(it\.id, n\.value\); \}\);/, '');
  const ps = await serve(plant);
  const P = plant !== real ? await walk(br, ps.address().port, { width: 390, height: 844 }, card, other) : null;
  ps.close();
  ok('P  the plant (the tab with the keeping taken out) goes red on K2 and K3', !!P && P.afterMore !== P.line && P.afterReload !== P.line + ' again', P ? JSON.stringify([P.afterMore, P.afterReload]) : 'the plant did not change the tab');
  await br.close();
  finish();
})().catch(e => { console.error(e); ok('the gate ran', false, String(e && e.message || e).slice(0, 160)); finish(); });

function finish() {
  console.log('\n=== HIS ANSWER IS KEPT: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}
