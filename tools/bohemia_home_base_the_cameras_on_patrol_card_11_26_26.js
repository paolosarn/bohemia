#!/usr/bin/env node
/* HOME BASE 4, 11/26/26: THE CAMERAS ON PATROL: its VOTE card and its proof on the glass (VAMILY rule 482: 'the cameras' shots worth
   watching', his people at work reading clearly; rule 479(b): ONE LOT, ONE THING; rule 441: a phone upright and sideways).
   The demo, as he plays it: a new game, his place planted, the grinder, the forge, the yard and the lookout put up, a wall, a tank, a
   garden, a solar panel and a roof (a family moves in) built and standing, then HIS PLACE: the whole block (CAM 1 at its start), then
   eight seconds into each camera's round: the camera has pushed in on what is going on (his man at work, the family, a building).
   Writes records/target/home_base/the_cameras_on_patrol_<profile>_<shot>.webp, the card records/target/home_base/vote_the_cameras_on_patrol.webp
   and its first picture records/target/vote_first/home-base-the-cameras-on-patrol-11-26.webp (upright: one of his men at work).
   Run: node tools/bohemia_home_base_the_cameras_on_patrol_card_11_26_26.js */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base'), TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'hb4patrol-'));
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const PROFS = ['phone_portrait', 'phone_landscape'];
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
      BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 60; w.food = 12; wagonPut(w);
      ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3;
      const bk = lotBookFor(BohemiaBetween.mine()), P0 = purseGet(); BohemiaPurse.credit(P0, 'electricity', 20, 'card', 'card', DAY.day);
      ['tank', 'garden', 'solar', 'roof', 'wall'].forEach((k, i) => { try { BohemiaLotBuild.start(bk, P0, { x: i, y: 0 }, k, DAY.day, lotHoldFor(BohemiaBetween.mine())); } catch (e) {} });
      for (let q = 0; q < 2; q++) { for (const k in bk.lots) bk.lots[k].done = true; DAY.day = DAY.day + 1; try { lotWake(); } catch (e) {} }
      return { at, places: BohemiaHomeMap.state().places.map(p => p.id + '@' + p.lot), lots: Object.keys(bk.lots), res: BohemiaHomeMap.state().residents.map(r => r.name) }; });
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    if (!fr) { console.log(prof, 'NO FEED'); await d.close(); continue; }
    for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
    await P.waitForTimeout(6000);   /* the arrival's speech gone */
    const shot = async (n) => { const f = path.join(TMP, prof + '_' + n + '.png'); await P.screenshot({ path: f }); (shots[prof] = shots[prof] || {})[n] = f; };
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(500)); await P.waitForTimeout(1500); await shot('0_whole');
    const tours = [];
    for (let k = 1; k <= 3; k++) {
      await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(8000)); await P.waitForTimeout(3400);
      tours.push(await fr.evaluate(() => ({ cam: window.__HOME_FEED.cam, tour: window.__HOME_FEED_TOUR(), feet: (window.__HOME_FEED_DRAWN() || {}).feet })));
      await shot(k + '_patrol');
      await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(19000)); await P.waitForTimeout(1800);
    }
    facts[prof] = { set, tours };
    console.log(prof, JSON.stringify(facts[prof]).slice(0, 900));
    await d.close();
  }
  const py = `
import sys, json
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1]); P, L = a['shots']['phone_portrait'], a['shots']['phone_landscape']
def one(p, w, h): return Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS)
G, T = 12, 30
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 18)
except Exception: fnt = ImageFont.load_default()
W = 4 * 390 + 3 * G; H = T + 844 + G + 2 * (T + 390) + G
C = Image.new('RGB', (max(W, 2 * 844 + G), H), (18, 14, 10)); d = ImageDraw.Draw(C); grn = (226, 196, 120)
lab = lambda x, y, s: d.text((x + 4, y + 5), s, font=fnt, fill=grn)
names = a['names']
for i, k in enumerate(['0_whole', '1_patrol', '2_patrol', '3_patrol']):
    x = i * (390 + G); lab(x, 0, names['phone_portrait'][i]); C.paste(one(P[k], 390, 844), (x, T))
y2 = T + 844 + G
for i, k in enumerate(['1_patrol', '2_patrol', '3_patrol', '0_whole']):
    x = (i % 2) * (844 + G); y = y2 + (i // 2) * (T + 390); lab(x, y, names['phone_landscape'][[1, 2, 3, 0][i]]); C.paste(one(L[k], 844, 390), (x, y + T))
C.save(a['out'], 'WEBP', quality=86, method=6)
C.crop((390 + G, T, 390 + G + 390, T + 844)).save(a['first'], 'WEBP', quality=88, method=6)
for prof, S in a['shots'].items():
    for k, p in S.items(): im = Image.open(p).convert('RGB'); im.resize((im.width // 3, im.height // 3), Image.LANCZOS).save(a['dir'] + '/the_cameras_on_patrol_%s_%s.webp' % (prof, k), 'WEBP', quality=84, method=6)
print(json.dumps({'card': C.size, 'firstAt': [390 + G, T, 390, 844]}))
`;
  const nm = (prof) => { const t = (facts[prof] || {}).tours || []; return ['the whole block, CAM 1'].concat(t.map(x => 'CAM ' + x.cam + ': ' + (x.tour ? (x.tour.why === 'work' ? 'MOTION, ' + x.tour.who + ' at work' : x.tour.why === 'home' ? 'the family at home' : x.tour.why === 'pile' ? 'the dead waiting' : 'his building') : 'held wide'))); };
  if (shots.phone_portrait && shots.phone_landscape) {
    const r = spawnSync('python3', ['-c', py, JSON.stringify({ shots, names: { phone_portrait: nm('phone_portrait'), phone_landscape: nm('phone_landscape') }, out: path.join(OUT, 'vote_the_cameras_on_patrol.webp'), first: path.join(ROOT, 'records/target/vote_first/home-base-the-cameras-on-patrol-11-26.webp'), dir: OUT })], { encoding: 'utf8' });
    console.log(r.stdout.trim(), r.stderr.trim().slice(-400));
  }
  fs.writeFileSync(path.join(OUT, 'the_cameras_on_patrol_facts.json'), JSON.stringify(facts, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
