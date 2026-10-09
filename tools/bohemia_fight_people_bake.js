#!/usr/bin/env node
/* THE FIGHT'S PEOPLE, BAKED FROM THE CHARACTER BANK (COMBAT [rebuild] round three, rule 69, Paolo 10/4:
   'I wanna see all my character art that we worked so hard on live in the game, even if it's new combat').
   The rig, the runway clothes, the hair bank and the faces live only inside the alpha (famPaintBody,
   drawChar, renderFace, faceFor). This opens the alpha through the one driver and bakes, for every person
   the fight can field, his 112-px frames from the bank's own renderer, nothing redrawn:
     rows SE (facing right) and SW (facing left);
     columns idle | walk x4 | stagger-hit x4 (the hit clip) | bat-arc x3 (a swing) | two-hand (aiming) | sleep (fallen)
     | idle x3 more | the fall x5 | the down man x4 (ANIMATION 10/9, appended; the clip table says what plays when)
   plus his 64-px face from renderFace with his own face key. Looks: YOU (the player as he stands), the
   twelve CITY_CAST_LOOKS, the thirteen FACTION_LOOKS (the runway thirteen). Out: slices/fight_people/
   <id>.png (then packed to lossless WebP) and fight_people.json, the manifest the fight reads.
   Run: node tools/bohemia_fight_people_bake.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'slices/fight_people');
const COLS = [['idle', 0], ['walk', 0], ['walk', .25], ['walk', .5], ['walk', .75],
  ['stagger-hit', .03], ['stagger-hit', .09], ['stagger-hit', .16], ['stagger-hit', .26],
  ['bat-arc', .2], ['bat-arc', .5], ['bat-arc', .68], ['two-hand', 0], ['sleep', 0],
  /* ANIMATION [the fight's clips in the new fight] (10/9, rule 69): APPENDED, so every column above keeps its
     index. The idle breathes (the fight drew idle@0 only: every man stood frozen between beats); the FALL is
     the bank's floor-rise played BACKWARDS (standing at ph .81, crouch .65, kneel .52, sitting .31, lying .10,
     measured on the drawn box, 24 buckets). LOOKING at the bake: it ends SITTING on the ground, leaning back,
     which is exactly where crawl-dying starts. So the fall flows into the DOWN man, struck down and not dead
     (rule 36b), who crawls (four distinct pictures); the DEAD lie FLAT (sleep), so alive and dead read apart at
     a glance: sitting is alive, flat is dead. No new shape: every frame is a bank clip, and the 7/2
     graveyard's 'death' and 'ragdoll' stay dead. */
  ['idle', .1042], ['idle', .3542], ['idle', .7292],
  ['floor-rise', .8125], ['floor-rise', .6458], ['floor-rise', .5208], ['floor-rise', .3125], ['floor-rise', .1042],
  ['crawl-dying', .1042], ['crawl-dying', .4167], ['crawl-dying', .7083], ['crawl-dying', .9167]];
const ROWS = ['SE', 'SW'];
/* THE CLIP TABLE (ANIMATION's, 10/9): which columns play for which fight event, how many beats they take and
   what follows. The fight reads it (frame = cols[floor(progress * cols.length)]); nothing here is a number a
   player feels, only which picture and how long it lasts on the 120 beat. */
const CLIPS = {
  idle:  { cols: ['idle@0', 'idle@0.1042', 'idle@0.3542', 'idle@0.7292'], beats: 4, loop: true },
  step:  { cols: ['walk@0', 'walk@0.25', 'walk@0.5', 'walk@0.75'], beats: 1, loop: true },
  swing: { cols: ['bat-arc@0.2', 'bat-arc@0.5', 'bat-arc@0.68'], beats: 1, loop: false },
  shot:  { cols: ['two-hand@0'], beats: 1, loop: false, note: 'the aim, held: the bank has no recoil clip and none is invented here' },
  hit:   { cols: ['stagger-hit@0.03', 'stagger-hit@0.09', 'stagger-hit@0.16', 'stagger-hit@0.26'], beats: 1, loop: false },
  fall:  { cols: ['floor-rise@0.8125', 'floor-rise@0.6458', 'floor-rise@0.5208', 'floor-rise@0.3125', 'crawl-dying@0.1042'], beats: 2, loop: false, then: 'down',
           note: 'ends ON the down man\'s first picture (his own reaching arm, 2-4 px past floor-rise\'s seated end), so the seam is exact; a man who dies goes from here to dead (he slumps flat)' },
  down:  { cols: ['crawl-dying@0.1042', 'crawl-dying@0.4167', 'crawl-dying@0.7083', 'crawl-dying@0.9167'], beats: 4, loop: true, note: 'struck down, not dead: sitting up, crawling' },
  dead:  { cols: ['sleep@0'], beats: 1, loop: false, note: 'flat on the ground: dead reads apart from down at a glance' }
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ alpha: true });
  const p = d.fr || d.page;
  const ready = async () => { for (let i = 0; i < 240; i++) { const ok = await d.page.evaluate(() => typeof famPaintBody === 'function' && typeof drawChar === 'function'
      && !!window.FACTION_LOOKS && !!window.CITY_CAST_LOOKS && typeof renderFace === 'function' && typeof faceFor === 'function').catch(() => false); if (ok) return true; await d.page.waitForTimeout(500); } return false; };
  if (!(await ready())) { console.log('the alpha never exposed its rig'); await d.browser.close(); process.exit(1); }
  const looks = await d.page.evaluate(() => [{ id: 'you', name: 'YOU', kind: 'you' }]
    .concat(window.CITY_CAST_LOOKS.map(l => ({ id: 'cast_' + l.id, name: l.id, kind: 'cast', worn: l.worn })))
    .concat(window.FACTION_LOOKS.map(l => ({ id: 'faction_' + l.faction.toLowerCase(), name: l.faction, kind: 'faction', worn: l.worn }))));
  const manifest = { version: 'fight-people-10-4', built: '10/4/26', lane: 'combat', rule: 69,
    source: 'slices/BOHEMIA_ALPHA_0_9.html: famPaintBody / drawChar (the 112 rig, the runway clothes, the hair bank), renderFace / faceFor (the faces), the clips idle, walk, stagger-hit, bat-arc, two-hand, sleep',
    frame: 112, figure_bbox: [36, 6, 42, 102], rows: ROWS, cols: COLS.map(c => c[0] + '@' + c[1]), face: { size: 64, at: 'right of the last column, top row' },
    clips: CLIPS, clips_by: 'animation 10/9: frame = cols[floor(progress * cols.length)], progress over beats * 500 ms; fall is followed by down, or by dead for the man who dies', looks: {} };
  const _miss = Object.keys(CLIPS).reduce((a, k) => a.concat(CLIPS[k].cols.filter(c => manifest.cols.indexOf(c) < 0)), []);
  if (_miss.length) { console.log('the clip table names columns the sheet does not bake: ' + _miss.join(', ')); process.exit(1); }
  for (const L of looks) {
    const url = await d.page.evaluate((args) => {
      const L = args.L, COLS = args.COLS, ROWS = args.ROWS, F = 112;
      const atlas = document.createElement('canvas'); atlas.width = F * COLS.length + 64; atlas.height = F * ROWS.length;
      const g = atlas.getContext('2d');
      const member = L.kind === 'you' ? null : (L.kind === 'cast' ? window.CITY_CAST_LOOKS.filter(x => 'cast_' + x.id === L.id)[0]
        : window.FACTION_LOOKS.filter(x => 'faction_' + x.faction.toLowerCase() === L.id)[0]);
      const m = member ? { worn: member.worn, dials: member.dials, age: member.age || 'adult', role: 'fight', name: L.id } : null;
      ROWS.forEach((dir, r) => COLS.forEach((c, i) => {
        const cv = document.createElement('canvas'); cv.width = F; cv.height = F;
        if (m) famPaintBody(cv, m, dir, c[0], c[1]); else drawChar(cv, dir, c[0], c[1]);
        g.drawImage(cv, i * F, r * F);
      }));
      /* his face: the same key the bank uses for anybody who is not the player */
      try {
        const spec = m ? faceFor('fight:' + L.id, { age: m.age }) : (typeof buildSpec === 'function' ? buildSpec() : faceFor('fight:you', {}));
        const ramp = m ? faceRampFor(spec) : (typeof portraitRamp === 'function' ? portraitRamp() : faceRampFor(spec));
        const px = renderFace(spec, { ramp: ramp });
        const id = g.createImageData(64, 64); id.data.set(px); g.putImageData(id, F * COLS.length, 0);
      } catch (e) { g.fillStyle = '#300'; g.fillRect(F * COLS.length, 0, 64, 64); }
      return atlas.toDataURL('image/png');
    }, { L, COLS, ROWS });
    const file = L.id + '.png';
    fs.writeFileSync(path.join(OUT, file), Buffer.from(url.split(',')[1], 'base64'));
    manifest.looks[L.id] = { file: file, name: L.name, kind: L.kind, worn: L.worn || 'the player as he stands' };
    console.log('  baked ' + L.id);
  }
  fs.writeFileSync(path.join(OUT, 'fight_people.json'), JSON.stringify(manifest, null, 1));
  /* pack to lossless WebP, every pixel checked identical (COMBAT TWO's way, 10/2) */
  require('child_process').execFileSync('python3', ['-c', [
    'import json,os', 'from PIL import Image', "d='" + OUT + "'", "m=json.load(open(d+'/fight_people.json'))",
    "for k,v in m['looks'].items():",
    "  s=os.path.join(d,v['file']); im=Image.open(s).convert('RGBA'); t=s[:-4]+'.webp'; im.save(t,'WEBP',lossless=True,quality=100,method=6)",
    "  assert Image.open(t).convert('RGBA').tobytes()==im.tobytes(); os.remove(s); v['file']=os.path.basename(t)",
    "m['packed']='lossless WebP, every pixel checked identical to the bake'", "json.dump(m,open(d+'/fight_people.json','w'),indent=1)"].join('\n')]);
  console.log('looks: ' + Object.keys(manifest.looks).length + '; errors in the alpha: ' + d.errs.length);
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  process.exit(0);
})().catch(e => { console.log('bake failed: ' + e.message); process.exit(1); });
