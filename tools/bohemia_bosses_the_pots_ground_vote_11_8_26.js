#!/usr/bin/env node
/* BOSSES 11/8 (rule 437(a)): THE VOTE CARD'S PICTURE for [the first boss changes the map], from the game's own camera on a phone.
   A new game, out of the town, his flyer read (his place marked). Then he falls (the map's own fell(), the one the fight's win
   calls; the fight itself is walked for real by gates/the_first_boss_changes_the_map_gate.js) and the kill's own camera beat
   glides to his place: BEFORE held (his line cooks' checkpoints shut the streets round THE KITCHEN), then
   AFTER (the carts at the kerb, the kitchen lit), the beat's own camera; then her card. Out: records/target/bosses_the_pots_ground_11_8/
   before.png, after.png, card.png and VOTE_THE_FIRST_BOSS_CHANGES_THE_MAP.webp (before | after | her card).
   node tools/bohemia_bosses_the_pots_ground_vote_11_8_26.js */
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records', 'target', 'bosses_the_pots_ground_11_8');
const N = 'THE POT';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile: 'phone_portrait', fog: true });
  const fr = d.fr, page = d.page;
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  for (let i = 0; i < 30 && !(await inTown()); i++) await page.waitForTimeout(500);
  for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); }
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) break; } await page.waitForTimeout(800); };
  let G = null, sign = null;
  for (let i = 0; i < 60 && !G; i++) { await page.waitForTimeout(500); const q = await fr.evaluate((n) => ({ G: BohemiaBosses.ground(n), s: BohemiaHisMap.state().boss.sign }), N); G = q.G && q.G.shut.length ? q.G : null; sign = q.s; }
  if (!G) { console.log('no ground'); process.exit(1); }
  await go([sign.x, sign.y]); await settle();
  /* THE MOMENT HE FALLS, the game's own camera: the beat glides to his place and holds on the BEFORE (his checkpoints shut, his black
     smoke), then the tape tracks the AFTER in (the carts at the kerb, the kitchen lit). The map's own fell() (the one the fight's win
     calls); the mouths are let talk so the beat can play, Raul's flyer card already read. */
  await fr.evaluate((n) => { const L = BohemiaBosses.state().lead[n] || {}; L.thingDue = false; L.asked = L.asked || 'read'; window.__BOSSES_TALK = true; try { closeRoadCard && closeRoadCard(); } catch (e) {} }, N);
  /* the first minute's tips (RUN's DESI, 'tap anywhere...', 'crew on the road...') are done before he falls, the way a stranger meets
     him; then the screen is the beat's and hers */
  await page.waitForTimeout(75000);
  await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, N);
  /* a picture every 350 ms through the beat, each tagged with its phase and how far the tape has tracked (u); the card takes the
     last BEFORE (u 0, held) and the first AFTER fully in (u 1, shown) */
  const seq = [];
  for (let i = 0; i < 40; i++) {
    const b = await fr.evaluate(() => { const b = window.__BOSS_BEAT; return b ? { ph: b.phases.slice(-1)[0], u: b.u, done: !!b.done, cps: b.checkpoints | 0 } : null; }).catch(() => null);
    const f = path.join(OUT, 'beat_' + String(i).padStart(2, '0') + '.png'); await page.screenshot({ path: f, scale: 'css' });
    const b2 = await fr.evaluate(() => { const b = window.__BOSS_BEAT; return b ? { ph: b.phases.slice(-1)[0], u: b.u, done: !!b.done } : null; }).catch(() => null);
    seq.push({ f, b, b2 }); if (b2 && b2.done) break; await page.waitForTimeout(60);
  }
  console.log(seq.map(q => path.basename(q.f) + ' ' + JSON.stringify(q.b) + ' -> ' + JSON.stringify(q.b2)).join('\n'));
  const pre = seq.filter(q => q.b && q.b2 && (q.b.ph === 'hold' || q.b.ph === 'wipe') && (q.b2.u || 0) < 0.75).slice(-1)[0] || seq.filter(q => q.b && q.b.ph === 'glide').slice(-1)[0];
  const post = seq.filter(q => q.b && q.b2 && q.b.ph === 'show' && q.b2.ph === 'show' && !q.b2.done)[0];
  if (pre) fs.copyFileSync(pre.f, path.join(OUT, 'before.png'));
  if (post) fs.copyFileSync(post.f, path.join(OUT, 'after.png'));
  const got = { hold: !!pre, show: !!post };
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(250); if (await fr.evaluate(() => !!(window.__BOSS_CARD && window.__BOSS_CARD.kind === 'after' && document.getElementById('roadcard'))).catch(() => false)) break; }
  await page.waitForTimeout(900); await page.screenshot({ path: path.join(OUT, 'card.png') });
  const g2 = await fr.evaluate((n) => BohemiaBosses.ground(n), N);
  console.log('ground', G.shut.length, 'shut, front', G.front.join(' '), 'beat shots', JSON.stringify(got), 'open', g2.open, 'paid', g2.paid);
  await d.close();
  /* the card: before | after, the gate's card under them if the gate has run */
  const card = path.join(ROOT, 'records', 'target', 'the_first_boss_changes_the_map', '5_she_says_what_changed.png');
  const py = `
from PIL import Image, ImageDraw
import sys, os
ims=[Image.open(f).convert('RGB') for f in sys.argv[1:-1] if os.path.exists(f)]
W=sum(i.width for i in ims)+10*(len(ims)+1); H=max(i.height for i in ims)+20
s=Image.new('RGB',(W,H),(18,16,14)); x=10
for i in ims: s.paste(i,(x,10)); x+=i.width+10
s.save(sys.argv[-1],'WEBP',quality=78)
`;
  execFileSync('python3', ['-c', py, path.join(OUT, 'before.png'), path.join(OUT, 'after.png'), path.join(OUT, 'card.png'), path.join(OUT, 'VOTE_THE_FIRST_BOSS_CHANGES_THE_MAP.webp')]);
  console.log('wrote', path.join(OUT, 'VOTE_THE_FIRST_BOSS_CHANGES_THE_MAP.webp'), fs.existsSync(card) ? '(the card picture is the gate\'s 5_she_says_what_changed.png)' : '');
})().catch(e => { console.error(e); process.exit(1); });
