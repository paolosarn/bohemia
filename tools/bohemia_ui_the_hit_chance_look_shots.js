/* THE HIT CHANCE LOOK, the shots (UI [the hit chance look], rule 120(b), 10/19/26). Opens the rebuilt fight on his phone
   profile through the one driver, leaves the chalk, and on the first man of his to move sets up two real cases IN THE BROWSER
   ONLY (nothing written to the game): WEAK, his own pistol against the raider's plate beside him (his 10/18 'your weapon
   sucks'); GOOD, a rifle on the same man against a thug in a jacket three streets off (rule 120(a), guns first). The numbers
   are the fight's own: hitChance(), and resolveAttack() at the weapon's mean roll for the dent. Then for each case: TODAY
   (the picked man and the bar as they are), A (the slip on the man), B (the slip out of the bar's top edge), C (the meters in
   the bar, the chance on the STRIKE square), and each one's AFTER (the same slip once the swing lands). Every word on a laid
   slip is measured against the paper really under it, plain and in the sun (+25% white, rule 73).
   node tools/bohemia_ui_the_hit_chance_look_shots.js <out dir> <phone_portrait|phone_landscape> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, profile] = process.argv.slice(2);
const side = profile === 'phone_landscape' ? 'sideways' : 'upright';
fs.mkdirSync(out, { recursive: true });

/* the two cases, set on the man whose turn it is; returns the read COMBAT would hand hitRead() */
const SETUP = (kind) => {
  const S = FIGHT.S, u = FIGHT.current(), byId = FIGHT.byId;
  if (!window.__hrHome) { window.__hrHome = {}; S.units.forEach(v => { window.__hrHome[v.id] = { x: v.x, y: v.y }; }); window.__hrOwn = JSON.parse(JSON.stringify(u.weapon)); window.__hrJob = u.job; }
  S.units.forEach(v => { const h = window.__hrHome[v.id]; v.x = h.x; v.y = h.y; });
  const free = (x, y) => y >= 0 && x >= 0 && y < S.coverCount.length && x < S.coverCount[0].length && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y);
  let t;
  if (kind === 'weak') {
    u.weapon = JSON.parse(JSON.stringify(window.__hrOwn)); u.job = window.__hrJob;
    t = byId('e8');
    const at = [[1, 0], [0, -1], [0, 1], [-1, 0]].map(q => ({ x: u.x + q[0], y: u.y + q[1] })).filter(q => free(q.x, q.y))[0];
    t.x = at.x; t.y = at.y;
  } else {
    u.weapon = JSON.parse(JSON.stringify(byId('c6').weapon)); u.job = 'rifle'; u.loaded = true;
    t = byId('e2');
    /* the open tile in his reach where the fight gives the rifle its best chance (a clean shot, not one through a car) */
    const sk0 = FIGHT.strikeSkill(u.weapon); let best = null;
    for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) { const x = u.x + dx, y = u.y + dy; if (!free(x, y)) continue;
      t.x = x; t.y = y; if (!FIGHT.canStrike(u, t)) continue; const c = FIGHT.hitChance(u, t, sk0).chance; if (!best || c > best.c) best = { x, y, c }; }
    t.x = best.x; t.y = best.y;
  }
  FIGHT_UI.pend = { target: t }; FIGHT_UI.skillMode = null;
  try { say(''); } catch (e) {}
  const w = u.weapon, sk = FIGHT.strikeSkill(w), mean = (w.damage_min + w.damage_max) / 2;
  const hc = FIGHT.hitChance(u, t, sk), r = FIGHT.resolveAttack(u, t, sk, { roll: 0, head: false, base: mean });
  /* DRAFT, COMBAT's and TUNING's to set (rule 117's numbers are theirs): weak when the mean hit puts under a tenth of his
     health through and his armour needs three or more of these hits to strip */
  const strips = t.armB / Math.max(1, r.armour), weak = r.hp < t.hp * 0.1 && strips >= 3;
  const wl = (DB.wlines.rows[w.class] || {}).name || w.class;
  const plate = t.armB >= 90 ? 'plate' : t.armB >= 40 ? 'vest' : 'jacket';
  return { kind, u: u.id, uname: u.name, t: t.id, tname: t.name, weapon: wl, can: FIGHT.canStrike(u, t), parts: hc.parts,
    read: { chance: hc.chance, armour: { now: t.armB, max: t.armBMax, take: r.armour }, body: { now: t.hp, max: t.hpMax, take: r.hp }, weak,
      line: 'Your ' + wl.toLowerCase() + ' barely dents his ' + plate + '.' } };
};

/* lay one look; mode null is today; after true prints the result */
const LAY = ({ mode, read, after }) => {
  document.querySelectorAll('.bm-hit').forEach(e => e.remove());
  const bs = document.getElementById('bstrike'); bs.classList.remove('bm-hit-sq'); document.getElementById('skills').dataset.key = ''; hud();   /* the square as the fight builds it */
  if (!mode) return null;
  const rd = Object.assign({}, read, after ? { after: { hit: true } } : {});
  const t = FIGHT.byId(window.__hrT), R = e => e.getBoundingClientRect();
  const el = BohemiaMaterials.hitRead(rd, { mode });
  document.body.appendChild(el);
  const b = manBox(t.x, t.y);
  const ctx = { man: { x: b.x, head: b.head, feet: b.feet }, bar: R(document.getElementById('bot')), stats: R(document.getElementById('stats')), top: R(document.getElementById('top')).bottom };
  if (mode === 'bar') BohemiaMaterials.hitChanceOnButton(bs, rd);
  const box = BohemiaMaterials.hitReadPlace(el, ctx);
  return { box: [box.x, box.y, box.width, box.height].map(Math.round), man: [b.x, b.head, b.feet].map(Math.round), bar: [ctx.bar.x, ctx.bar.y, ctx.bar.width, ctx.bar.height].map(Math.round),
    stats: [ctx.stats.x, ctx.stats.y, ctx.stats.width, ctx.stats.height].map(Math.round), top: Math.round(ctx.top),
    strike: [R(bs).x, R(bs).y, R(bs).width, R(bs).height].map(Math.round),
    buttons: Array.from(document.querySelectorAll('#bot button')).filter(x => x.offsetParent).map(x => ({ id: x.id || x.dataset.skill, r: [R(x).x, R(x).y, R(x).width, R(x).height].map(Math.round) })),
    css: (() => { const s = getComputedStyle(el); return { radius: s.borderTopLeftRadius, shadow: s.boxShadow, filter: s.filter, bgi: /gradient/.test(s.backgroundImage) ? 'gradient' : /url\(/.test(s.backgroundImage) ? 'url' : 'none', font: getComputedStyle(el.querySelector('.bm-hit-n')).fontFamily }; })(),
    sizes: Array.from(el.querySelectorAll('*')).filter(e => Array.from(e.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())).map(e => ({ t: e.firstChild.textContent.trim(), px: parseFloat(getComputedStyle(e).fontSize), font: getComputedStyle(e).fontFamily.split(',')[0].replace(/['"]/g, '') })) };
};

/* every word on the slip (and on the STRIKE square in C) against what is really under it, plain and in the sun */
async function words(page) {
  const items = await page.evaluate(() => {
    const out = [];
    const host = Array.from(document.querySelectorAll('.bm-hit')).concat(document.querySelector('#bstrike.bm-hit-sq') ? [document.querySelector('#bstrike.bm-hit-sq b')] : []);
    host.forEach(h => [h].concat(Array.from(h.querySelectorAll('*'))).forEach(e => {
      if (!Array.from(e.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) return;
      const rr = document.createRange(); rr.selectNodeContents(Array.from(e.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim())[0]);
      const r = rr.getBoundingClientRect();
      out.push({ k: e.textContent.trim().slice(0, 24), box: [r.left, r.top, r.width, r.height], col: getComputedStyle(e).color });
    }));
    const st = document.createElement('style'); st.id = 'hr-hide'; st.textContent = '.bm-hit *,.bm-hit,#bstrike b{color:transparent!important}';
    document.head.appendChild(st); return out;
  });
  await page.waitForTimeout(150);
  const png = (await page.screenshot()).toString('base64');
  await page.evaluate(() => { const s = document.getElementById('hr-hide'); if (s) s.remove(); });
  return page.evaluate(async ({ png, items }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return items.map(it => {
      const [x, y, w, h] = it.box, d = g.getImageData(Math.round(x * sc), Math.round(y * sc), Math.max(1, Math.round(w * sc)), Math.max(1, Math.round(h * sc))).data, S = [];
      for (let i = 0; i < d.length; i += 4 * 3) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const t = it.col.match(/[\d.]+/g).slice(0, 3).map(Number), tl = LUM(...t);
      const bg = S[Math.floor((S.length - 1) * (tl > 0.18 ? 0.9 : 0.1))];
      return { k: it.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2), bg: bg.join(','), col: t.join(','), box: it.box.map(Math.round) };
    });
  }, { png, items });
}

(async () => {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"}' });
  const p = d.page; const t0 = Date.now();
  while (Date.now() - t0 < 40000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(3000);
  await p.click('#bend');
  for (let i = 0; i < 80; i++) { const s = await p.evaluate(() => { const u = FIGHT.current(); return u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT.S.deploy; }); if (s) break; await p.waitForTimeout(500); }
  await p.evaluate(() => document.fonts.ready);
  const res = { profile, side, cases: {}, shots: [] };
  const plan = side === 'upright' ? [['weak', [null, 'tag', 'slip', 'bar'], true], ['good', [null, 'tag', 'slip', 'bar'], true]] : [['weak', [null, 'tag', 'slip', 'bar'], false], ['good', [null, 'slip'], false]];
  for (const [kind, modes, afters] of plan) {
    const c = await p.evaluate(SETUP, kind); res.cases[kind] = c;
    await p.evaluate(t => { window.__hrT = t; }, c.t);
    await p.waitForTimeout(1200);
    for (const mode of modes) for (const after of (mode && afters ? [false, true] : [false])) {
      const laid = await p.evaluate(LAY, { mode, read: c.read, after });
      await p.waitForTimeout(700);
      const name = side + '_' + kind + '_' + (mode ? { tag: 'A', slip: 'B', bar: 'C' }[mode] : 'today') + (after ? '_after' : '');
      await p.screenshot({ path: path.join(out, name + '.png') });
      const row = { name, kind, mode, after, laid };
      if (mode) row.words = await words(p);
      res.shots.push(row);
      console.log(name, laid ? laid.box.join(',') : 'today', row.words ? row.words.map(w => w.k + ' ' + w.plain + '/' + w.sun).join(' | ') : '');
    }
  }
  await p.evaluate(LAY, { mode: null });
  fs.writeFileSync(path.join(out, 'measures_' + side + '.json'), JSON.stringify(res, null, 1));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
