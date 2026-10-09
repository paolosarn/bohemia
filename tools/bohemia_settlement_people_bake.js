#!/usr/bin/env node
/* THE SETTLEMENT'S PEOPLE, BAKED FROM THE CHARACTER BANK (ANIMATION [the settlement's idle people], 10/9; rule 71a:
   the settlement screen is ONE PAINTED PLACE; rule 69: all the character art live in the game).
   The settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html, RUN TWO's) draws its painted picture and NO PEOPLE.
   This lane ships the clips; RUN TWO places them. Same door as COMBAT's fight sheets
   (tools/bohemia_fight_people_bake.js): the alpha through the one driver, famPaintBody for every look, nothing redrawn.
     rows S (facing you, a keeper at his door), SE and SW (the hires at the posts, the crowd crossing);
     columns: eight pictures of each clip, one in the middle of every third drawn pose (the 120 BPM grid), for
     idle | smoke | lean | scratch-back | look-around | nod | beckon | haggle | walk
   Looks: the twelve CITY_CAST_LOOKS (the townsfolk) and the thirteen FACTION_LOOKS (who holds the place).
   Out: slices/settlement_people/<id>.webp (lossless, every pixel checked) + settlement_people.json, with the CLIP
   TABLE (which columns play for which moment) and the SCALE (a person in the picture's own pixels).
   Run: node tools/bohemia_settlement_people_bake.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'slices/settlement_people');
/* which bank clip, and what a keeper or a hire uses it for. All alive in the bank, all read facing you
   (filmed at S before they were picked, 10/9); haggle is the one fixed facing you on 10/1. */
const CLIPS_USED = [
  ['idle', 'wait', 'standing at his door or post, breathing'],
  ['smoke', 'smoke', 'a smoke while nobody comes'],
  ['lean', 'lean', 'his shoulder on the wall'],
  ['scratch-back', 'scratch', 'a scratch at the shoulder blade'],
  ['look-around', 'look', 'looking up and down the street'],
  /* NOT hail: its raised hand leaves the rig's 112 box on 9 of the 25 looks (the tall ones) and is cut at the
     frame's top edge (measured 10/9). His row asks for 'a look up when the finger nears', which is the nod. */
  ['nod', 'greet', 'the finger nears his building: he looks up at you'],
  ['beckon', 'beckon', 'the finger is on his building: come in'],
  ['haggle', 'trade', 'his shop is open: the offer, the shrug'],
  ['walk', 'walk', 'the market-day crowd crossing']];
/* EIGHT PICTURES A CLIP, each in the middle of one of the game's own drawn poses (24 buckets, three apart): the
   quarter-phase cut of the first bake landed on held poses and gave some clips TWO pictures (measured 10/9; the
   bank's clips hold 7 to 10 distinct poses a bar at S) */
const PHS = [0, 1, 2, 3, 4, 5, 6, 7].map(k => +((3 * k + 0.5) / 24).toFixed(4));
const COLS = [];
CLIPS_USED.forEach(c => PHS.forEach(p => COLS.push([c[0], p])));
const ROWS = ['S', 'SE', 'SW'];
/* WHICH WAY EACH MOMENT IS SEEN. A keeper at his door faces you; a hire at the posts and the crowd are seen from the
   side. The back scratch facing you on a long coat shows the hand twice in eight pictures (the arm is behind the
   coat, looked at 10/9): it is a side-on moment, and the table says so rather than offering it facing you. */
const FACES = { wait: ['S', 'SE', 'SW'], smoke: ['S', 'SE', 'SW'], lean: ['S', 'SE', 'SW'], scratch: ['SE', 'SW'], look: ['S', 'SE', 'SW'],
                greet: ['S'], beckon: ['S'], trade: ['S'], walk: ['SE', 'SW'] };
const PX_PER_METRE = 42.9;   /* slices/settlement_ground/settlement_ground.json px_per_metre */

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ alpha: true });
  const ready = async () => { for (let i = 0; i < 240; i++) { const ok = await d.page.evaluate(() => typeof famPaintBody === 'function'
      && !!window.FACTION_LOOKS && !!window.CITY_CAST_LOOKS).catch(() => false); if (ok) return true; await d.page.waitForTimeout(500); } return false; };
  if (!(await ready())) { console.log('the alpha never exposed its rig'); await d.browser.close(); process.exit(1); }
  const beats = await d.page.evaluate((names) => { const o = {}; names.forEach(n => { o[n] = (typeof ANIMBEATS !== 'undefined' && ANIMBEATS[n])
      || (typeof CAND_BEATS !== 'undefined' && CAND_BEATS[n]) || 4; }); return o; }, CLIPS_USED.map(c => c[0]));
  const looks = await d.page.evaluate(() => window.CITY_CAST_LOOKS.map(l => ({ id: 'cast_' + l.id, name: l.id, kind: 'cast' }))
    .concat(window.FACTION_LOOKS.map(l => ({ id: 'faction_' + l.faction.toLowerCase(), name: l.faction, kind: 'faction' }))));
  const clips = {};
  CLIPS_USED.forEach(c => { clips[c[1]] = { clip: c[0], cols: PHS.map(p => c[0] + '@' + p), beats: beats[c[0]], loop: true, for: c[2], faces: FACES[c[1]] };   /* frame = cols[floor(progress * 8)] */ });
  const manifest = { version: 'settlement-people-10-9', built: '10/9/26', lane: 'animation', rule: '71a, 69', for_screen: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html (RUN TWO places them)',
    source: 'slices/BOHEMIA_ALPHA_0_9.html: famPaintBody (the 112 rig, the runway clothes, the hair bank) and the bank clips ' + CLIPS_USED.map(c => c[0]).join(', '),
    frame: 112, figure_bbox: [36, 6, 42, 102], rows: ROWS, cols: COLS.map(c => c[0] + '@' + c[1]), clips: clips,
    clips_by: 'frame = cols[floor(progress * 8)], progress over beats * 500 ms (the 120 beat)',
    scale: { px_per_metre: PX_PER_METRE, person_metres: 1.75, person_px_in_picture: Math.round(1.75 * PX_PER_METRE),
             draw_frame_at: +(1.75 * PX_PER_METRE / 102 * 112).toFixed(1), note: 'the figure is 102 of the 112 frame: draw the frame at this many picture px and his feet on the door step' },
    looks: {} };
  for (const L of looks) {
    const url = await d.page.evaluate((args) => {
      const L = args.L, COLS = args.COLS, ROWS = args.ROWS, F = 112;
      const atlas = document.createElement('canvas'); atlas.width = F * COLS.length; atlas.height = F * ROWS.length;
      const g = atlas.getContext('2d');
      const member = L.kind === 'cast' ? window.CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === L.id)[0]
        : window.FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === L.id)[0];
      const m = { worn: member.worn, dials: member.dials, age: member.age || 'adult', role: 'town', name: L.id };
      ROWS.forEach((dir, r) => COLS.forEach((c, i) => {
        const cv = document.createElement('canvas'); cv.width = F; cv.height = F;
        famPaintBody(cv, m, dir, c[0], c[1]); g.drawImage(cv, i * F, r * F);
      }));
      return atlas.toDataURL('image/png');
    }, { L, COLS, ROWS });
    const file = L.id + '.png';
    fs.writeFileSync(path.join(OUT, file), Buffer.from(url.split(',')[1], 'base64'));
    manifest.looks[L.id] = { file: file, name: L.name, kind: L.kind };
    console.log('  baked ' + L.id);
  }
  fs.writeFileSync(path.join(OUT, 'settlement_people.json'), JSON.stringify(manifest, null, 1));
  require('child_process').execFileSync('python3', ['-c', [
    'import json,os', 'from PIL import Image', "d='" + OUT + "'", "m=json.load(open(d+'/settlement_people.json'))",
    "for k,v in m['looks'].items():",
    "  s=os.path.join(d,v['file']); im=Image.open(s).convert('RGBA'); t=s[:-4]+'.webp'; im.save(t,'WEBP',lossless=True,quality=100,method=6)",
    "  assert Image.open(t).convert('RGBA').tobytes()==im.tobytes(); os.remove(s); v['file']=os.path.basename(t)",
    "m['packed']='lossless WebP, every pixel checked identical to the bake'", "json.dump(m,open(d+'/settlement_people.json','w'),indent=1)"].join('\n')]);
  console.log('looks: ' + Object.keys(manifest.looks).length + '; errors in the alpha: ' + d.errs.length);
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  process.exit(0);
})().catch(e => { console.log('bake failed: ' + e.message); process.exit(1); });
