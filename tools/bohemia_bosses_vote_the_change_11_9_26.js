#!/usr/bin/env node
/* BOSSES 11/9 (rule 440(b)): THE VOTE CARD'S PICTURE of a boss's change on the map, from the game's own camera on a phone, for any boss
   on the ladder: node tools/bohemia_bosses_vote_the_change_11_9_26.js "THE TAP" [outdir]
   A new game, out of the town, every boss before him on the ladder read and felled through the map's own fell() (the door a won fight
   calls; each one is walked whole by his own gate), his sign read (his place marked), the first minute's tips let pass; then he falls
   the same way and the kill's own camera beat is shot frame by frame at phone size: BEFORE held (what he held on the map), the tape
   tracking in, AFTER (what changed), then the card of the one who asked. Out: <outdir>/before.png, after.png, card.png and
   VOTE.webp (before | after | the card, twice the pixels). Made from tools/bohemia_bosses_the_pots_ground_vote_11_8_26.js. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const N = process.argv[2] || 'THE TAP';
const OUT = process.argv[3] || path.join(ROOT, 'records', 'target', 'bosses_vote_' + N.replace(/^THE /, '').toLowerCase());
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile: 'phone_portrait', fog: true });
  const fr = d.fr, page = d.page;
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaBosses && !!BohemiaBosses.data() && !!BohemiaHisMap.data()).catch(() => false)) break; }
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  for (let i = 0; i < 30 && !(await inTown()); i++) await page.waitForTimeout(500);
  for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); }
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) break; } await page.waitForTimeout(800); };
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const order = await fr.evaluate(() => BohemiaHisMap.data().bosses.map(b => b.n));
  const quiet = (n, felled) => fr.evaluate((a) => { const L = BohemiaBosses.state().lead[a[0]] || (BohemiaBosses.state().lead[a[0]] = {}); L.thingDue = false; L.asked = L.asked || 'read';
    if (a[1]) { L.afterDue = false; L.beatDone = 1; } }, [n, !!felled]);   /* the ones before him fall quietly; his own beat and card play */
  for (const n of order) {
    let s = null;
    for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); s = await fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaHisMap.state().boss))); if (s.sign && s.sign.n === n) break; }
    if (!s.sign || s.sign.n !== n) { console.log('no sign for', n); process.exit(1); }
    await go([s.sign.x, s.sign.y]); await settle();
    await quiet(n);
    if (n === N) break;
    await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, n); await page.waitForTimeout(400); await quiet(n, true);
    await page.waitForTimeout(1500);
  }
  clearInterval(guard);
  /* the first minute's tips are done before he falls, the way a stranger meets him; then the screen is the beat's and the card's */
  await page.waitForTimeout(75000);
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  /* BOSSES_NIGHT=1 (THE BURN, 11/10): his change is the night's, so the beat is shot at night (his side black before, his drums after) */
  if (process.env.BOSSES_NIGHT === '1') { await fr.evaluate(() => { try { T.min = 22 * 60; render(); } catch (e) {} }); await page.waitForTimeout(800); }
  await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, N);
  const seq = [];
  for (let i = 0; i < 40; i++) {
    const b = await fr.evaluate(() => { const b = window.__BOSS_BEAT; return b ? { n: b.n, ph: b.phases.slice(-1)[0], u: b.u, done: !!b.done } : null; }).catch(() => null);
    const f = path.join(OUT, 'beat_' + String(i).padStart(2, '0') + '.png'); await page.screenshot({ path: f, scale: 'css' });
    const b2 = await fr.evaluate(() => { const b = window.__BOSS_BEAT; return b ? { n: b.n, ph: b.phases.slice(-1)[0], u: b.u, done: !!b.done } : null; }).catch(() => null);
    seq.push({ f, b, b2 }); if (b2 && b2.n === N && b2.done) break; await page.waitForTimeout(60);
  }
  const mine = seq.filter(q => q.b && q.b.n === N && q.b2 && q.b2.n === N);
  const pre = mine.filter(q => (q.b.ph === 'hold' || q.b.ph === 'wipe') && (q.b2.u || 0) < 0.75).slice(-1)[0] || mine.filter(q => q.b.ph === 'glide').slice(-1)[0];
  const post = mine.filter(q => q.b.ph === 'show' && q.b2.ph === 'show' && !q.b2.done)[0] || mine.filter(q => q.b.ph === 'show' && !q.b.done)[0];   /* 11/10: a slow frame can land the only 'show' shot as the beat ends */
  if (pre) fs.copyFileSync(pre.f, path.join(OUT, 'before.png'));
  if (post) fs.copyFileSync(post.f, path.join(OUT, 'after.png'));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(250); if (await fr.evaluate((n) => !!(window.__BOSS_CARD && window.__BOSS_CARD.kind === 'after' && window.__BOSS_CARD.n === n && document.getElementById('roadcard')), N).catch(() => false)) break; }
  await page.waitForTimeout(900); await page.screenshot({ path: path.join(OUT, 'card.png'), scale: 'css' });
  console.log(N, 'beat', seq.map(q => q.b2 && q.b2.ph).join('>'), 'before', !!pre, 'after', !!post);
  await d.close();
  seq.forEach(q => { try { fs.unlinkSync(q.f); } catch (e) {} });
  const py = `
from PIL import Image
import sys, os
o=sys.argv[1]
ims=[Image.open(os.path.join(o,f)).convert('RGB') for f in ('before.png','after.png','card.png') if os.path.exists(os.path.join(o,f))]
ims=[i.resize((390, round(i.height*390/i.width)), Image.LANCZOS) if i.width!=390 else i for i in ims]
W=sum(i.width for i in ims)+10*(len(ims)+1); H=max(i.height for i in ims)+20
s=Image.new('RGB',(W,H),(18,16,14)); x=10
for i in ims: s.paste(i,(x,10)); x+=i.width+10
s=s.resize((W*2,H*2), Image.LANCZOS); s.save(os.path.join(o,'VOTE.webp'),'WEBP',quality=80)
`;
  require('child_process').execFileSync('python3', ['-c', py, OUT]);
  console.log('wrote', path.join(OUT, 'VOTE.webp'));
})().catch(e => { console.error(e); process.exit(1); });
