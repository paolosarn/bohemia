/* THE HIRE SHOWS THE WHOLE MAN (RUN TWO [the hire shows the whole man], 10/24/26; rule 121(b)(e): the 3D models on every screen
   with a person; 120(a) guns first; TUNING's change 9, 'hire what you see': 'a recruit's card shows his face, his 3 best things as
   stars, his one trait in plain words, his price and his nightly cost').
   END STATE: a man offered for hire stands as his 3D model in his own rolled look, holding his gun, with its reach in tiles and its
   rounds beside him (the crew screen's line), so the player picks a man by seeing him. On his phone's profile, real taps:
     W0  CONTROL: the post's old kit put a gun in 2 of 6 backgrounds' hands, and the old card drew no body (so W1 can go red)
     W1  THE WHOLE MAN: at a camp, a town and a fortress (two places each) every card at the post stands its man as his whole 3D
         model (his look's own fight frames, 60 painted rows or more), in the look of the man standing at the post's rail, his gun
         in his hands, breathing on his own beat (two different poses over three seconds on most cards)
     W2  WHAT HIS GUN DOES: every card names his gun and says its reach and rounds in the crew screen's own words
         (BohemiaRoster.armLine), and every gun is one the fight reads as a gun
     W3  HIRE WHAT YOU SEE: three stats starred on every card, his price, and his night (the crew's one bill, nightly_bill.json)
     W4  HE WALKS IN AS YOU SAW HIM: hired, he is on the crew screen with that gun in his main hand and its line in his row, his
         cloth on his back; the bag gets only the rest of what he carried
   Run: node gates/the_hire_shows_the_whole_man_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8903;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.flac': 'audio/flac' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const HTML = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');

(async () => {
  /* W0 */
  const W = J('records/target/bb/weapons.json').rows, guns = J('records/target/bb/ours.json').gun_classes.value;
  const isGun = id => { const r = W.find(x => x.id === id); return !!(r && guns.indexOf(r['class']) >= 0); };
  const OLD = { farmhand: ['bludgeon', 'sackcloth'], messenger: ['knife', 'sackcloth'], butcher: ['butcher_s_cleaver', 'leather_wraps'], brawler: [null, 'sackcloth'], thief: ['knife', 'leather_tunic'], militia: ['militia_spear', 'padded_surcoat'] };
  const KIT = (() => { const m = HTML.match(/var KIT = (\{[^;]+\});/); return m ? Function('return ' + m[1])() : {}; })();
  const oldArmed = Object.keys(OLD).filter(b => OLD[b].some(isGun)).length, nowArmed = Object.keys(KIT).filter(b => KIT[b].some(isGun)).length;
  ok('W0 CONTROL: the old kit armed 2 of 6 backgrounds with a gun; now every one', oldArmed === 2 && nowArmed === Object.keys(KIT).length && nowArmed === 6, 'old ' + oldArmed + ', now ' + nowArmed + ' of ' + Object.keys(KIT).length);
  const bill = J('records/target/bb/nightly_bill.json').per_man_per_night;
  const night = +(bill && bill.value != null ? bill.value : bill);

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(220); } };
  const cards = [], noHall = [];
  for (const [tier, name] of [['camp', 'HIRE CAMP'], ['camp', 'DRY WELL'], ['town', 'HIRE TOWN'], ['town', 'BLUE DIAMOND'], ['fortress', 'HIRE FORT'], ['fortress', 'NELLIS GATE']]) {
    await close();
    await p.evaluate(o => BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: 9, batteries: 400 }), { name, tier });
    await p.waitForTimeout(300);
    await p.waitForFunction(() => BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(300);
    const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); if (!xy) { noHall.push(name); continue; }
    await p.mouse.click(xy.x, xy.y);
    await p.waitForFunction(() => { const f = [].slice.call(document.querySelectorAll('#sheet.on .hire canvas.hfig')); return f.length && f.every(c => c.dataset.drawn === '1'); }, null, { timeout: 15000 }).catch(() => {});
    const poses = {};
    for (let t = 0; t < 12; t++) {   /* three seconds: what each figure shows */
      const now = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sheet.on .hire')).map(h => { const c = h.querySelector('canvas.hfig'); return { id: h.dataset.id, idle: c && c.dataset.idle }; }));
      now.forEach(x => { (poses[x.id] = poses[x.id] || new Set()).add(x.idle); });
      await p.waitForTimeout(250);
    }
    const got = await p.evaluate(() => {
      const standing = BohemiaSettlement.folk().filter(q => q.post).map(q => q.look), men = BohemiaSettlement.recruits();
      return [].slice.call(document.querySelectorAll('#sheet.on .hire')).map(h => {
        const c = h.querySelector('canvas.hfig'), r = men.filter(m => m.id === h.dataset.id)[0];
        let rows = 0; if (c) { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, k = c.width / 96;
          for (let y = 0; y < c.height; y += k) { let any = false; for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 200) { any = true; break; } if (any) rows++; } }
        const g = h.querySelector('.hgun'), arm = g && g.querySelector('.arm');
        const want = g && window.BohemiaRoster ? BohemiaRoster.armLine(BohemiaRoster.itemOf('weapon', g.dataset.gun), false) : null;
        return { id: h.dataset.id, look: c && c.dataset.look, cardLook: r && r.look, standing: standing.indexOf(r && r.look) >= 0, drawn: c && c.dataset.drawn, held: c && c.dataset.held, rows,
          gun: g && g.dataset.gun, gunName: g && (g.querySelector('b') || {}).textContent, arm: arm && arm.textContent, want: want && (want.reach + (want.rounds ? '  ·  ' + want.rounds : '')),
          stars: h.querySelectorAll('.hstats .star').length, btn: (h.querySelector('.act') || {}).textContent || '',
          wage: r && window.BohemiaWages ? Math.round(BohemiaWages.wage(r.backgroundId, r.level) * (window.BohemiaCamp ? BohemiaCamp.mult('wage') : 1)) : 0 };   /* RE-AIMED 10/25 (RUN TWO __THE_HIRED_ARE_PAID__, rule 151(b)): his night is the bill and his wage */
      });
    });
    got.forEach(x => { x.place = name; x.poses = poses[x.id] ? poses[x.id].size : 0; cards.push(x); });
  }
  const whole = cards.filter(c => c.drawn === '1' && c.rows >= 60 && c.look === c.cardLook && c.standing);
  ok('W1 THE WHOLE MAN: every card at the post stands its man as his whole 3D model, the man at the rail', cards.length >= 15 && whole.length === cards.length && noHall.length === 0,
     whole.length + ' of ' + cards.length + ' cards' + (whole.length < cards.length ? ', red ' + cards.filter(c => whole.indexOf(c) < 0).slice(0, 2).map(c => c.place + ':' + c.look + ' rows ' + c.rows + ' drawn ' + c.drawn).join(' | ') : ''));
  const held = cards.filter(c => c.held === '1' || c.held === 'hidden'), shown = cards.filter(c => c.held === '1');
  ok('  his gun in his hands (its own cell over him; covered by his body only on a pose)', held.length === cards.length && shown.length >= cards.length * 0.8, shown.length + ' of ' + cards.length + ' drawn in his hands');
  const alive = cards.filter(c => c.poses >= 2);
  ok('  breathing on his own beat: two poses or more in three seconds on most cards', alive.length >= cards.length * 0.6, alive.length + ' of ' + cards.length);
  const said = cards.filter(c => c.gun && isGun(c.gun) && c.arm && c.want && c.arm === c.want && /TILE/.test(c.arm));
  ok('W2 WHAT HIS GUN DOES: every card names his gun and its reach and rounds in the crew screen\'s own words', said.length === cards.length,
     said.length + ' of ' + cards.length + (cards[0] ? ' (' + cards[0].gunName + ' ' + cards[0].arm + ')' : ''));
  const three = cards.filter(c => c.stars === 3), priced = cards.filter(c => /\d+ batt/.test(c.btn) && new RegExp('\\b' + (night + c.wage) + ' batter(y|ies) a night').test(c.btn) && c.wage >= 1);
  ok('W3 HIRE WHAT YOU SEE: three stats starred on every card', three.length === cards.length, three.length + ' of ' + cards.length);
  ok('  his price and his night (the crew\'s one bill, ' + night + ' a man a night, and his own wage)', night > 0 && priced.length === cards.length, (cards[0] ? cards[0].btn.replace(/\s+/g, ' ') : '') + ', ' + priced.length + ' of ' + cards.length);

  /* W4 */
  await p.evaluate(() => { try { localStorage.removeItem('bohemia.hired.v1'); localStorage.removeItem('bohemia.bag.v1'); } catch (e) {} });
  await close();
  await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: 'town' }, traits: [], day: 9, batteries: 400, bag: [] }));
  await p.waitForTimeout(600);
  const hx = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.mouse.click(hx.x, hx.y); await p.waitForTimeout(400);
  const pick = await p.evaluate(() => { const h = [].slice.call(document.querySelectorAll('#sheet.on .hire')).filter(h => /farmhand|butcher|militia/i.test(h.textContent))[0] || document.querySelector('#sheet.on .hire');
    const g = h.querySelector('.hgun'); return { id: h.dataset.id, gun: g && g.dataset.gun }; });
  await p.click('#sheet.on .hire[data-id="' + pick.id + '"] .act');
  await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ hired: JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]'), bag: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(i => i.id) }));
  const def = after.hired[after.hired.length - 1] || {};
  const r = await ctx.newPage(); r.on('pageerror', e => errs.push(e.message));
  await r.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await r.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 });
  await r.waitForTimeout(500);
  const man = await r.evaluate(n => { const m = BohemiaRosterScreen.state.crew.filter(x => x.name === n)[0]; if (!m) return null;
    const al = m.gear.main ? BohemiaRoster.armLine(m.gear.main, false) : null; return { main: m.gear.main && m.gear.main.id, body: m.gear.body && m.gear.body.id, look: m.look, al: al && al.reach }; }, def.name);
  ok('W4 HE WALKS IN AS YOU SAW HIM: on the crew screen with that gun in his main hand and its reach, his cloth on him', !!man && man.main === pick.gun && !!man.al && /TILE/.test(man.al) && !!man.body && man.look === def.look,
     JSON.stringify(man) + ' (' + def.name + ')');
  const rest = (def.kit || []).filter(id => id && id !== (def.gear || {}).main && id !== (def.gear || {}).body);
  ok('  and the bag gets only the rest of what he carried', after.bag.indexOf(pick.gun) < 0 && rest.every(id => after.bag.indexOf(id) >= 0), 'bag ' + after.bag.join(',') + ', rest ' + rest.join(','));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE HIRE SHOWS THE WHOLE MAN: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
