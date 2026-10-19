/* BOHEMIA -- EYES AND EARS, [every face beside its body] (10/19, rule 120(d)): THE FACES THE DEMO PAINTS AT RUN TIME.
 *
 * ONE JOB: the faces the demo paints while it runs have no file to read, so this opens the demo the way he does (his
 * phone's pixels, the plain page, BEGIN tapped) and takes each face and its body OFF THE PAGE'S OWN CANVASES, never
 * re-drawn here:
 *   THE MAP FACE   the face in the middle of the map's pad (#modeFace, the city frame), beside PLAYER_CV.S, the body
 *                  the map draws for him.
 *   THE STREET     every person in the blocks round the start, through the city's own two doors: ctBody(p, 'S') (the
 *                  body the street draws for that person) and ctFaceAsk(p.id) (the face his speech bubble shows),
 *                  answered by the demo shell exactly as in play.
 *   THE FLIP STRIP the faces of acts one to three on the phone strip (ctFaceAsk('act1' .. 'act3')); acts two and three
 *                  have no body on screen, and the read says so.
 * Each picture is written as a small PNG under records/eyes_faces_runtime/ (not published) and listed in
 * records/target/EYES_EVERY_FACE_RUNTIME.json; tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py reads them
 * with the same skin read as every other face.
 *
 *   node tools/bohemia_eyes_every_face_beside_its_body_10_19_26.js [max street people = 40]
 */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}

const ROOT = path.resolve(__dirname, '..'), PORT = 8881;
const MAX = parseInt(process.argv[2] || '40', 10);
const DIR = 'records/eyes_faces_runtime';   /* not a published folder: evidence for the read, never served */
const OUT = 'records/target/EYES_EVERY_FACE_RUNTIME.json';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json',
  '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.css': 'text/css', '.txt': 'text/plain' };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});

function save(name, dataUrl) {
  const rel = DIR + '/' + name + '.png';
  fs.writeFileSync(path.join(ROOT, rel), Buffer.from(dataUrl.split(',')[1], 'base64'));
  return rel;
}

(async () => {
  fs.mkdirSync(path.join(ROOT, DIR), { recursive: true });
  for (const f of fs.readdirSync(path.join(ROOT, DIR))) if (f.endsWith('.png')) fs.unlinkSync(path.join(ROOT, DIR, f));
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = pw();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__LOAD_READY, null, { timeout: 120000 });
  /* BEGIN: a real tap when the door is free; the door's own click when the splash still covers it */
  await p.click('#fronttap', { timeout: 8000 }).catch(() => p.evaluate(() => { const t = document.getElementById('fronttap'); if (t) t.click(); }));
  await p.waitForFunction(() => { const f = document.getElementById('cityFrame'); const w = f && f.contentWindow;
    try { return w && w.eval('PLAYER_CV') && w.CAST_CV && w.CAST_CV.length; } catch (e) { return false; } }, null, { timeout: 120000 });
  await p.waitForTimeout(3000);
  const stamp = await p.evaluate(() => { const s = document.getElementById('buildstamp'); return s ? s.textContent.trim() : null; });

  /* every street person in the blocks round the start: ask each face once, then wait for the shell to answer */
  const asked = await p.evaluate((MAX) => {
    const cw = document.getElementById('cityFrame').contentWindow;
    const ppl = cw.eval('pplPeople'), seen = new Set(), out = [];
    for (let r = 0; r < 6 && out.length < MAX; r++)
      for (let ny = 0; ny < 40 && out.length < MAX; ny++)
        for (let nx = 0; nx < 40 && out.length < MAX; nx++) {
          if (Math.max(Math.abs(nx - 20), Math.abs(ny - 20)) !== r * 3) continue;
          let list = [];
          try { list = ppl(nx, ny) || []; } catch (e) {}
          for (const q of list) {
            if (out.length >= MAX || seen.has(q.id)) continue;
            seen.add(q.id); out.push(q.id);
            try { cw.ctBody(q, 'S'); cw.ctFaceAsk(q.id); } catch (e) {}
          }
        }
    window.__EYES_PPL = out;
    ['act1', 'act2', 'act3'].forEach(k => { try { cw.ctFaceAsk(k); } catch (e) {} });
    return out.length;
  }, MAX);
  await p.waitForTimeout(6000);

  const got = await p.evaluate(() => {
    const cw = document.getElementById('cityFrame').contentWindow;
    const url = c => { try { return c && c.toDataURL ? c.toDataURL('image/png') : null; } catch (e) { return null; } };
    const pick = s => s && (s.idle || s.S || s);
    const res = { map: null, street: [], flip: [] };
    const PC = cw.eval('PLAYER_CV');
    const mf = cw.document.getElementById('modeFace');
    res.map = { face: url(mf), body: url(pick(PC.S || PC[Object.keys(PC)[0]])), faceSize: mf ? mf.width : null };
    const ppl = cw.eval('pplPeople');
    const byId = {};
    for (let ny = 0; ny < 40; ny++) for (let nx = 0; nx < 40; nx++) { let l = []; try { l = ppl(nx, ny) || []; } catch (e) {} l.forEach(q => { byId[q.id] = q; }); }
    for (const id of window.__EYES_PPL) {
      const q = byId[id]; if (!q) continue;
      let body = null; try { body = cw.ctBody(q, 'S'); } catch (e) {}
      const face = cw.FACE_CV[String(id)];
      let fid = null, fit = null; try { fid = cw.ctFactionOf(q); } catch (e) {} try { fit = cw.ctFitIndex(q); } catch (e) {}
      res.street.push({ id: String(id), face: url(face), body: url(body), faction: fid || null, fit: fit,
        name: q.name || null, role: q.role || q.archetype || null });
    }
    ['act1', 'act2', 'act3'].forEach(k => res.flip.push({ id: k, face: url(cw.FACE_CV[k]) }));
    return res;
  });

  const pairs = [];
  if (got.map && got.map.face) {
    pairs.push({ who: 'you', name: 'YOU', face: 'the map pad\'s face (#modeFace)', face_png: save('map_face', got.map.face),
      body_png: got.map.body ? save('map_body', got.map.body) : null, owner: 'RUN (the map) / CHARACTER',
      note: 'the body: PLAYER_CV.S, what the map draws for him' });
  }
  let n = 0;
  for (const s of got.street) {
    if (!s.face) continue;
    const tag = 'street_' + (n++);
    pairs.push({ who: 'street:' + s.id, name: (s.name || 'street ' + s.id) + (s.faction ? ' (' + s.faction + ')' : ''),
      face: 'the street bubble\'s face (faceFor, ctFaceAsk)', face_png: save(tag + '_face', s.face),
      body_png: s.body ? save(tag + '_body', s.body) : null, owner: 'CHARACTER [one skin, one person] (the city cast bake)',
      body_set: s.faction ? 'faction ' + s.faction : 'cast fit ' + s.fit });
  }
  for (const f of got.flip) {
    if (!f.face) continue;
    pairs.push({ who: f.id === 'act1' ? 'you' : f.id, name: f.id.toUpperCase(), face: 'the phone strip\'s ' + f.id + ' face',
      face_png: save('flip_' + f.id + '_face', f.face), body_png: f.id === 'act1' && got.map.body ? DIR + '/map_body.png' : null,
      owner: 'DYNASTY / PORTRAIT', note: f.id === 'act1' ? 'act one is him: his map body' : 'no body for this act on any screen' });
  }
  const out = { tool: 'tools/bohemia_eyes_every_face_beside_its_body_10_19_26.js', read: new Date().toISOString(),
    page: 'slices/BOHEMIA_DEMO.html (committed tree), 390 x 844 at 3x, BEGIN tapped', build: stamp,
    asked_street: asked, street_faces_answered: got.street.filter(s => s.face).length,
    street_without_face: got.street.filter(s => !s.face).length, page_errors: errs, pairs };
  fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(out, null, 1));
  console.log('runtime read: ' + pairs.length + ' faces (' + out.street_faces_answered + ' street of ' + asked + ' asked), build ' + stamp + ', ' + errs.length + ' page errors');
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
