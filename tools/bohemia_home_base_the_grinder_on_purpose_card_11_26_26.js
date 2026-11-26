#!/usr/bin/env node
/* HOME BASE 4, 11/26/26: THE GRINDER, ON PURPOSE, BOTH WAYS: its VOTE card and its proof on the glass (VAMILY rule 481(b), his NO on
   home-base-the-grinder-11-22: 'this has to be made for horizontal and vertical phone wielding... It looks like dog shit... sideways like
   you didn't even try'; rule 441: a phone upright and sideways).
   The demo, as he plays it: a new game, day 2, his place planted (the checkers' plantAt), the grinder and the forge put up from the
   desk's own rows and standing the next day, a fight won (the map's own hook), then HIS PLACE: the footage, a real tap on the grinder
   (the camera zooms onto its lot and the sheet is laid for the way the phone is held), a real tap on GRIND, the sheet shut (the camera
   back out). Writes records/target/home_base/the_grinder_on_purpose_<profile>_<step>.webp, the card
   records/target/home_base/vote_the_grinder_on_purpose.webp (BEFORE: the 11/22 card he said NO to; NOW: the same three moments, both
   ways) and its first picture records/target/vote_first/home-base-the-grinder-on-purpose-11-26.webp (the sideways one he named).
   Run: node tools/bohemia_home_base_the_grinder_on_purpose_card_11_26_26.js [--only phone_portrait] */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base'), TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'hb4card-'));
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
const shots = {}, facts = {};
(async () => {
  for (const prof of PROFS) {
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
    const set = await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
      const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
      const p = BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 30; w.food = 12; wagonPut(w);
      const g = BohemiaHomeMap.placeBuild('grinder'), f = BohemiaHomeMap.placeBuild('forge'); DAY.day = 3;
      const won = BohemiaHomeMap.grinderFight({ outcome: { victory: true, bodies: [{ beast: false }, { beast: false }, { beast: false }, { beast: false }, { beast: false }] } });
      return { at, planted: !!(p && (p.ok || p.at)), g, f, won, now: BohemiaHomeMap.grinder() }; });
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    if (!fr) { console.log(prof, 'NO FEED'); await d.close(); continue; }
    for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
    const fb = await (await fr.frameElement()).boundingBox();
    const shot = async (n) => { const f = path.join(TMP, prof + '_' + n + '.png'); await P.screenshot({ path: f }); (shots[prof] = shots[prof] || {})[n] = f; };
    const tapSel = async (sel, done) => { for (let t = 0; t < 3; t++) { const w = await fr.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel); if (!w) return false;
      await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); for (let i = 0; i < 12; i++) { await P.waitForTimeout(250); if (await fr.evaluate(done).catch(() => false)) return true; } } return false; };
    await P.waitForTimeout(1500); await shot('1_place');
    let up = false;
    for (let t = 0; t < 3 && !up; t++) { const w = await fr.evaluate(() => { const f = window.__HOME_FEED || {}, s = f.slots || {}; const n = Object.keys(s).filter(n => s[n].id === 'grinder')[0]; return n ? window.__HOME_FEED_AT(+n) : null; }); if (!w) break;
      await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); for (let i = 0; i < 12 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => !!document.querySelector('#sbody .act[data-grind]')).catch(() => false); } }
    await P.waitForTimeout(1200);
    const open = await fr.evaluate(() => ({ st: window.__HOME_STATION, view: window.__HOME_FEED_VIEW(), pile: (window.__HOME_FEED_DRAWN() || {}).pile, btn: (document.querySelector('#sbody .act[data-grind]') || {}).textContent }));
    await shot('2_open');
    const food0 = await F.evaluate(() => (wagonGet() || {}).food | 0);
    await tapSel('#sbody .act[data-grind]', () => !!window.__HOME_GRIND); await P.waitForTimeout(1300);
    const food1 = await F.evaluate(() => (wagonGet() || {}).food | 0);
    const ground = await fr.evaluate(() => ({ btn: (document.querySelector('#sbody .act[data-grind]') || {}).textContent, say: (document.querySelector('#sbody .say p') || {}).textContent, pile: (window.__HOME_FEED_DRAWN() || {}).pile }));
    await shot('3_ground');
    await tapSel('#close', () => !BohemiaSettlement.state.open); await P.waitForTimeout(1300);
    const shut = await fr.evaluate(() => ({ st: window.__HOME_STATION, view: window.__HOME_FEED_VIEW() }));
    await shot('4_shut');
    facts[prof] = { set, open, food0, food1, ground, shut, view: P.viewportSize() };
    console.log(prof, JSON.stringify(facts[prof]).slice(0, 900));
    await d.close();
  }
  /* the card: BEFORE (the 11/22 card he said NO to, its upright tap and its sideways tap) and NOW, the same moments both ways */
  const py = `
import sys, json
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1]); out, first, old = a['out'], a['first'], a['old']
def one(p, w, h): return Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS)
O = Image.open(old).convert('RGB')   # the 11/22 card: three 390 x 844 upright on top, then two 1170-wide sideways rows
oU = O.crop((390, 0, 780, 844)); oS = O.crop((0, 852, 1170, 1393)).resize((844, 391), Image.LANCZOS)
P, L = a['shots']['phone_portrait'], a['shots']['phone_landscape']
G, T = 12, 30
W = 4 * 390 + 3 * G; H = T + 844 + G + T + 390 + G + T + 390
C = Image.new('RGB', (max(W, 2 * 844 + G), H), (18, 14, 10)); d = ImageDraw.Draw(C)
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 18)
except Exception: fnt = ImageFont.load_default()
def lab(x, y, s, col): d.text((x + 4, y + 5), s, font=fnt, fill=col)
red, grn = (214, 96, 72), (226, 196, 120)
lab(0, 0, 'BEFORE (11/22, his NO)', red); C.paste(oU, (0, T))
for i, k in enumerate(['1_place', '2_open', '3_ground']):
    x = (i + 1) * (390 + G); lab(x, 0, ['NOW: his place', 'NOW: tap the grinder', 'NOW: GRIND'][i], grn); C.paste(one(P[k], 390, 844), (x, T))
y2 = T + 844 + G; lab(0, y2, 'BEFORE sideways', red); lab(844 + G, y2, 'NOW sideways: tap the grinder', grn)
C.paste(oS, (0, y2 + T)); C.paste(one(L['2_open'], 844, 390), (844 + G, y2 + T))
y3 = y2 + T + 390 + G; lab(0, y3, 'NOW sideways: GRIND', grn); lab(844 + G, y3, 'NOW sideways: shut, the camera back out', grn)
C.paste(one(L['3_ground'], 844, 390), (0, y3 + T)); C.paste(one(L['4_shut'], 844, 390), (844 + G, y3 + T))
C.save(out, 'WEBP', quality=86, method=6)
C.crop((844 + G, y2 + T, 844 + G + 844, y2 + T + 390)).save(first, 'WEBP', quality=88, method=6)
for prof, S in a['shots'].items():
    for k, p in S.items(): Image.open(p).convert('RGB').resize((Image.open(p).width // 3, Image.open(p).height // 3), Image.LANCZOS).save(a['dir'] + '/the_grinder_on_purpose_%s_%s.webp' % (prof, k), 'WEBP', quality=84, method=6)
print(json.dumps({'card': C.size, 'firstAt': [844 + G, y2 + T, 844, 390]}))
`;
  if (shots.phone_portrait && shots.phone_landscape) {
    const r = spawnSync('python3', ['-c', py, JSON.stringify({ shots, out: path.join(OUT, 'vote_the_grinder_on_purpose.webp'), first: path.join(ROOT, 'records/target/vote_first/home-base-the-grinder-on-purpose-11-26.webp'), old: path.join(OUT, 'vote_the_grinder.webp'), dir: OUT })], { encoding: 'utf8' });
    console.log(r.stdout.trim(), r.stderr.trim().slice(-400));
  }
  fs.writeFileSync(path.join(OUT, 'the_grinder_on_purpose_facts.json'), JSON.stringify(facts, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
