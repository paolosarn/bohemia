#!/usr/bin/env node
/* BOHEMIA -- COOK: THE TWENTY FACE PAIRS, step one of two: THE HEADS. PORTRAIT, 10/17/26.
 * Rule 110 (the big swing day, Paolo 10/16) on this lane's MODE line: "the twenty face pairs
 * for his taste session (head only, head gear shown), ready to show the moment the moodboard
 * lands." Rule 108 ROUND TWELVE (5): his eye used ONCE, as twenty pairs, each pair separating
 * one choice that matters. DIRECTION built the ground's twenty (tools/bohemia_direction_taste_
 * session.py, records/BOHEMIA_THE_TASTE_SESSION_10_11_26.md); this is the face's twenty, in the
 * same shape, so one session reads the same way for both.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the rulers are FACE-01 and FACE-02 (the portrait's
 * construction), FACE-03 (identity at 64 px) and AH-01 rule 6 (the still face). Rule 108a is
 * the fence: NO NEW PIXEL IS DRAWN HERE. Every head this tool writes is the game's own, already
 * shipping faceFor()/renderFace() called unmodified, exactly as the settlement screen, the
 * hires' posts and the enemy recap call it today; a switch this tool passes (threeD, feat, brow)
 * is a switch the renderer has carried since 9/24 to 9/30 and nothing else. The heads are
 * PLACEHOLDERS under rule 108 ROUND THIRTEEN (the hand-coded renderer is what the moodboard
 * replaces); the session asks his taste on the KNOBS (line, colours, light, grime, strength,
 * darkness, warmth, room, size), which outlive the renderer. No pack twin exists for a face
 * (this lane's count 16c80eb7, COOK's pixel sweep f3090598: a dozen faces, all printed on
 * posters); the pair's own unchanged side is the control.
 *
 * WHAT IT WRITES: records/target/taste/portrait_heads/<slug>.png, one 64 x 64 head per person
 * per renderer setting the pairs need, and records/target/taste/PORTRAIT_HEADS.json (who they
 * are, what gear their spec carries, which switch each file used). Step two is
 * tools/bohemia_portrait_taste_session.py, which turns the heads into the twenty sheets.
 *
 * THE CAST (twenty real ids the game already draws, never a made-up person): the six brigand
 * tiers with their faction look's hair (the exact over.hairName route [the enemy faces] built),
 * the five keepers of THE WASH, NORTH LAS VEGAS (keeperFaceId, the id the settlement screen
 * asks for), and nine crowd citizens whose spec carries head gear today (a durag or shades).
 * Head gear shows wherever the person's spec carries it (rule 37i, [head and gear] 9/28);
 * the tool counts how many of the twenty show gear and refuses to write under twelve.
 *
 *   node tools/bohemia_cook_the_twenty_face_pairs.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OURS = path.join(REPO, 'records/target/bb/ours.json');
const OUT_DIR = path.join(REPO, 'records/target/taste/portrait_heads');
const OUT_JSON = path.join(REPO, 'records/target/taste/PORTRAIT_HEADS.json');
const KL = require(path.join(REPO, 'engine/bohemia_keeper_lines.js'));

const band = JSON.parse(fs.readFileSync(OURS, 'utf8')).people_looks.value.band;
const TIERS = ['brigand_thug', 'brigand_poacher', 'brigand_marksman', 'brigand_raider', 'brigand_leader', 'brigand_marauder']
  .map(t => ({ id: 'enemy:' + t, slug: t.replace('brigand_', 'brigand-'), label: t.replace('brigand_', '').toUpperCase() + ' (brigand)', faction: band[t][0] }));
const TOWN = 'THE WASH, NORTH LAS VEGAS';
const KEEPERS = KL.KEEPER_KINDS.map(k => ({ id: 'keeper:' + TOWN + ':' + k, slug: 'keeper-' + k, label: 'THE ' + k.toUpperCase() + ', ' + TOWN.split(',')[0] }));
/* nine crowd citizens whose spec carries gear today (measured 10/17: 68 of 200 carry hat/durag, 58 glasses/shades) */
const CROWD = [2, 5, 10, 14, 21, 35, 47, 63, 105].map(i => ({ id: 'gate:crowd:' + i, slug: 'crowd-' + i, label: 'CITIZEN ' + i }));
const CAST = [...TIERS, ...KEEPERS, ...CROWD];

/* the renderer switches a pair needs beyond the plain head; everything else is an image operation in step two */
const SETTINGS = { plain: {}, threeD: { threeD: true }, feat120: { feat: 1.2 }, brow: { brow: -0.5 } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function' && typeof faceRampFor === 'function'
    && window.FACTION_LOOKS && window.BOH_PERSONLOOK, { timeout: 60000 });

  const data = await p.evaluate(({ CAST, SETTINGS }) => {
    const lookOf = (faction) => (FACTION_LOOKS || []).filter(x => x.faction.toLowerCase() === faction.replace('faction_', '').toLowerCase())[0];
    const toPng = (buf) => { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; const cx = cv.getContext('2d');
      const idd = cx.createImageData(64, 64); idd.data.set(buf); cx.putImageData(idd, 0, 0); return cv.toDataURL('image/png'); };
    const out = [];
    for (const c of CAST) {
      let over = {};
      if (c.faction) { const look = lookOf(c.faction); if (!look) { out.push({ ...c, error: 'no FACTION_LOOKS for ' + c.faction }); continue; } over = { hairName: look.worn.hair, reads: 'either' }; }
      const spec = faceFor(c.id, over);
      const ramp = faceRampFor(spec);
      const files = {};
      for (const k of Object.keys(SETTINGS)) files[k] = toPng(renderFace(spec, Object.assign({ ramp }, SETTINGS[k])));
      /* the same person twice is byte-identical (no dice in the renderer) */
      const again = toPng(renderFace(faceFor(c.id, over), { ramp: faceRampFor(faceFor(c.id, over)) }));
      out.push({ id: c.id, slug: c.slug, label: c.label, hat: spec.hat || '', glasses: spec.glasses || '', hair: (spec.hair && spec.hair.name) || '',
        skin: spec.skin, deterministic: again === files.plain, files });
    }
    return out;
  }, { CAST, SETTINGS });

  /* ---------- REFUSE TO WRITE ON ANY FAILED CLAIM ---------- */
  const fails = [];
  if (data.length !== 20) fails.push('cast is ' + data.length + ', not 20');
  for (const d of data) {
    if (d.error) fails.push(d.id + ': ' + d.error);
    else if (!d.deterministic) fails.push(d.id + ': two renders differ');
  }
  const gear = data.filter(d => d.hat || d.glasses).length;
  if (gear < 12) fails.push('only ' + gear + ' of 20 heads carry head gear (floor 12)');
  const plains = new Set(data.map(d => d.files && d.files.plain));
  if (plains.size !== data.length) fails.push('two people share one face');
  for (const d of data) if (d.files && d.files.plain === d.files.threeD) fails.push(d.id + ': the threeD switch changed nothing');
  if (errs.length) fails.push('page errors: ' + errs.join(' | '));
  if (fails.length) { console.error('REFUSED TO WRITE:\n' + fails.map(f => ' - ' + f).join('\n')); await b.close(); process.exit(1); }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const heads = data.map(d => {
    const files = {};
    for (const k of Object.keys(d.files)) {
      const f = path.join(OUT_DIR, d.slug + (k === 'plain' ? '' : '.' + k) + '.png');
      fs.writeFileSync(f, Buffer.from(d.files[k].replace(/^data:image\/png;base64,/, ''), 'base64'));
      files[k] = path.relative(REPO, f);
    }
    return { id: d.id, slug: d.slug, label: d.label, hat: d.hat, glasses: d.glasses, hair: d.hair, skin: d.skin, files };
  });
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    made: '10/17/26', lane: 'portrait', rule: '110 on 108 ROUND TWELVE (5); 108a: zero new pixels, the shipping faceFor()/renderFace() unmodified',
    renderer: 'slices/BOHEMIA_ALPHA_0_9.html renderFace() at 64 x 64, a placeholder under rule 108 ROUND THIRTEEN',
    settings: SETTINGS, gear_shown: gear + ' of 20', heads
  }, null, 1));
  console.log('WROTE', heads.length, 'heads x', Object.keys(SETTINGS).length, 'settings to', path.relative(REPO, OUT_DIR));
  console.log('WROTE', path.relative(REPO, OUT_JSON));
  console.log('head gear shown on', gear, 'of 20:', data.filter(d => d.hat || d.glasses).map(d => d.slug + ':' + (d.hat || d.glasses)).join(' '));
  await b.close();
})();
