#!/usr/bin/env node
/* HOME BASE 4, 11/27/26: WHAT HE HAS SITS IN THE GROUND: its VOTE card (VAMILY rules 479(a) 'they look like they're floating on top of the
   map', 482; rule 441: a phone upright and sideways). BEFORE is the town screen as it stood at c2faac557 (served in its place, every other
   file the same); NOW is this build. The same game both times: his place, his four buildings, five builds, four bosses' things that have
   no piece of their own (a hook, a drum, charges, a rope), the whole block on CAM 1.
   Writes records/target/home_base/what_he_has_sits_in_the_ground_<run>_<profile>_<shot>.webp, the card
   records/target/home_base/vote_what_he_has_sits_in_the_ground.webp and its first picture (sideways, now)
   records/target/vote_first/home-base-what-he-has-sits-in-the-ground-11-27.webp.
   Run: node tools/bohemia_home_base_what_he_has_sits_in_the_ground_card_11_27_26.js */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base'), TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'hb4ground-'));
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const PROFS = ['phone_portrait', 'phone_landscape'], RUNS = ['before', 'now'];
const OLDF = path.join(TMP, 'old_screen.html'); fs.writeFileSync(OLDF, spawnSync('git', ['show', 'c2faac557:slices/BOHEMIA_SETTLEMENT_SCREEN.html'], { cwd: ROOT, maxBuffer: 1 << 28 }).stdout);
const shots = {}, facts = {};
(async () => {
  for (const run of RUNS) for (const prof of PROFS) {
    const d = await drive.open({ profile: prof, keepCards: true, serve: run === 'before' ? { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': OLDF } : undefined, beforeTap: async (pg) => {
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
      [['burn', 'hand_burn.png', 'THE DRUM'], ['blow', 'hand_blow.png', 'THE CHARGES'], ['catch', 'hand_catch.png', 'THE NET'], ['climb', 'hand_climb.png', 'THE ROPE']].forEach(a => { try { BohemiaHomeMap.give({ id: 'prize:' + a[0], kind: 'prize', name: a[2], pic: 'boss_places/' + a[1], from: 'a boss', says: null }); } catch (e) {} });
      return { at, places: BohemiaHomeMap.state().places.map(p => p.id + '@' + p.lot), lots: Object.keys(bk.lots), res: BohemiaHomeMap.state().residents.map(r => r.name) }; });
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    if (!fr) { console.log(prof, 'NO FEED'); await d.close(); continue; }
    for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
    await P.waitForTimeout(6000);   /* the arrival's speech gone */
    const shot = async (n) => { const f = path.join(TMP, run + '_' + prof + '_' + n + '.png'); await P.screenshot({ path: f }); (shots[run + '_' + prof] = shots[run + '_' + prof] || {})[n] = f; };
    await fr.evaluate(() => { try { window.__HOME_FEED_TOUR_AT(500); } catch (e) {} }); await P.waitForTimeout(1500); await shot('0_whole');
    const tours = [await fr.evaluate(() => { const d = window.__HOME_FEED_DRAWN ? window.__HOME_FEED_DRAWN() : {}; return { grounded: d.grounded | 0, h: d.groundedH || null, states: d.states || null }; })];
    facts[run + '_' + prof] = { set, tours };
    console.log(run, prof, JSON.stringify(facts[run + '_' + prof]).slice(0, 600));
    await d.close();
  }
  const py = `
import sys, json
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1]); S = a['shots']
def one(p, w, h): return Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS)
G, T = 12, 30
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 18)
except Exception: fnt = ImageFont.load_default()
W = 2 * 844 + G; H = T + 844 + G + 2 * (T + 390)
C = Image.new('RGB', (W, H), (18, 14, 10)); d = ImageDraw.Draw(C); red, grn = (214, 96, 72), (226, 196, 120)
lab = lambda x, y, s, c: d.text((x + 4, y + 5), s, font=fnt, fill=c)
lab(0, 0, 'BEFORE', red); C.paste(one(S['before_phone_portrait']['0_whole'], 390, 844), (0, T))
lab(390 + G, 0, 'NOW', grn); C.paste(one(S['now_phone_portrait']['0_whole'], 390, 844), (390 + G, T))
# close-ups of the front row (the sideways shot's lower left, where his lots meet the street), before above now
def close(p):
    im = Image.open(p).convert('RGB'); k = im.width / 844.0
    c = im.crop((int(40 * k), int(200 * k), int(560 * k), int(370 * k)))
    return c.resize((W - 2 * (390 + G), int((W - 2 * (390 + G)) * c.height / c.width)), Image.LANCZOS)
cx = 2 * (390 + G); b1 = close(S['before_phone_landscape']['0_whole']); n1 = close(S['now_phone_landscape']['0_whole'])
lab(cx, 0, 'BEFORE, close: a hook, a drum, a rope as tall as a house', red); C.paste(b1, (cx, T))
lab(cx, T + b1.height + G, 'NOW, close: things on the ground, their shadows', grn); C.paste(n1, (cx, 2 * T + b1.height + G))
y2 = T + 844 + G
lab(0, y2, 'BEFORE sideways', red); C.paste(one(S['before_phone_landscape']['0_whole'], 844, 390), (0, y2 + T))
lab(844 + G, y2, 'NOW sideways', grn); C.paste(one(S['now_phone_landscape']['0_whole'], 844, 390), (844 + G, y2 + T))
C = C.crop((0, 0, W, y2 + T + 390))
C.save(a['out'], 'WEBP', quality=86, method=6)
C.crop((844 + G, y2 + T, 844 + G + 844, y2 + T + 390)).save(a['first'], 'WEBP', quality=88, method=6)
for k, S2 in S.items():
    for n, p in S2.items(): im = Image.open(p).convert('RGB'); im.resize((im.width // 3, im.height // 3), Image.LANCZOS).save(a['dir'] + '/what_he_has_sits_in_the_ground_%s_%s.webp' % (k, n), 'WEBP', quality=84, method=6)
print(json.dumps({'card': C.size, 'firstAt': [844 + G, y2 + T, 844, 390]}))
`;
  if (shots.now_phone_portrait && shots.before_phone_landscape) {
    const r = spawnSync('python3', ['-c', py, JSON.stringify({ shots, out: path.join(OUT, 'vote_what_he_has_sits_in_the_ground.webp'), first: path.join(ROOT, 'records/target/vote_first/home-base-what-he-has-sits-in-the-ground-11-27.webp'), dir: OUT })], { encoding: 'utf8' });
    console.log(r.stdout.trim(), r.stderr.trim().slice(-600));
  }
  fs.writeFileSync(path.join(OUT, 'what_he_has_sits_in_the_ground_facts.json'), JSON.stringify(facts, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
