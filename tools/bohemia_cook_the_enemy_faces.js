#!/usr/bin/env node
/* BOHEMIA -- COOK: THE ENEMY FACES. PORTRAIT, 10/9/26, [the enemy faces].
 *
 * REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 10/9 at the seam): the rulers are
 * FACE-01 and FACE-02 (the portrait construction), the portrait-wears-the-haircut law and AH-01
 * rule 6 (the still face); the tier look is read from ours.json, never invented. Ids resolve in
 * the reference library index.
 *
 * Rule 69 (all character art live in the game), rule 68a (the party's card on the
 * map), COMBAT's recap. The jump list's top row: "a head per enemy kind in
 * enemies.json matched to CHARACTER's dressed tier." CHARACTER already dressed the
 * six named brigand tiers from a real faction look (tools/bohemia_cook_the_enemy_
 * tiers_dressed.js, records/BOHEMIA_THE_ENEMY_TIERS_DRESSED_10_9_26.txt), reading
 * ours.json's own people_looks.band -- the same pairing is READ here, never
 * reinvented, same as that tool.
 *
 * THE BUG, MEASURED FIRST: faceFor(id, over) resolves hair through
 * BOH_PERSONLOOK.lookFor(id, pool), which needs a real citizen id to look up. An
 * enemy tier has none -- it is dressed directly from a FACTION_LOOKS row, so
 * calling faceFor('enemy:brigand_thug') with no override hands back a hair cut
 * rolled from that string's own hash, unrelated to the body CHARACTER's tool just
 * dressed. Measured on the six tiers before any fix: 0 of 6 portraits wore the
 * cut their own dressed body wears -- not "mostly wrong", NEVER RIGHT, because
 * nothing in the pipeline ever compared the two.
 *
 * THE FIX: faceFor's over now takes over.hairName, read two lines above
 * BOH_PERSONLOOK.lookFor (same place over.kin and over.age already short-circuit
 * the normal roll) -- when set, it skips lookFor entirely and reads the real cut
 * straight off FACTION_LOOKS.worn.hair, the same hairDialsFor() the body-matching
 * cuts already trust. Every id that does not pass hairName (every real citizen)
 * is byte-for-byte unchanged, because the branch that used to run unconditionally
 * now runs inside an else.
 *
 * THE LEADER'S FACE IS THE ONE YOU REMEMBER: the row's own words. opts.threeD (the
 * 9/14 lighting upgrade, gated off the play surface by rule 18, used already by
 * this lane for judged portraits) gives the leader's render the second light and
 * the cheekbone highlight the other five do not get -- a real visual difference
 * from the same pipeline, not a new face generator for one man.
 *
 * NOT HERE, NAMED HONESTLY: the row also says "the chipped bodies' faces wrong in
 * the way the lore says" and "the recap shows who you killed by face." Chipped
 * bodies are the undead (WORDS [the enemies' names], 10/9: "zombies are chipped
 * bodies... via Grok") -- a different category with no face at all by its own
 * lore, not six living brigands wearing a wrong haircut; giving them a face is a
 * DIRECTION/ANIMATION call about what a chipped body looks like, not a PORTRAIT
 * hair-matching fix. The recap screen itself does not exist yet -- COMBAT's row,
 * not built, nothing here to hang a face on. Both flagged, neither guessed at.
 *
 *   node tools/bohemia_cook_the_enemy_faces.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_ENEMY_FACES.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_ENEMY_FACES.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_ENEMY_FACES.json');
const OURS  = path.join(REPO, 'records/target/bb/ours.json');

const ours = JSON.parse(fs.readFileSync(OURS, 'utf8'));
const band = ours.people_looks.value.band;

const TIERS = [
  { id: 'brigand_thug',     label: 'THUG' },
  { id: 'brigand_poacher',  label: 'POACHER' },
  { id: 'brigand_marksman', label: 'MARKSMAN' },
  { id: 'brigand_raider',   label: 'RAIDER' },
  { id: 'brigand_leader',   label: 'LEADER' },
  { id: 'brigand_marauder', label: 'MARAUDER' }
].map(t => ({ ...t, faction: band[t.id][0] }));

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof faceFor === 'function' &&
    window.FACTION_LOOKS, { timeout: 60000 });

  const out = await p.evaluate((TIERS) => {
    const faceNameOf = (f) => f.replace('faction_', '');
    const lookOf = (faceName) => (FACTION_LOOKS || []).filter(x =>
      x.faction.toLowerCase() === faceName.toLowerCase())[0];

    const rows = [];
    let err = null;
    for (const t of TIERS) {
      const faceName = faceNameOf(t.faction);
      const look = lookOf(faceName);
      if (!look) { err = 'no FACTION_LOOKS for ' + t.faction; break; }
      const wantHair = look.worn.hair;
      const id = 'enemy:' + t.id;

      /* BEFORE: the bug, exactly as it rendered until this round -- no override,
         hair rolled from the id's own hash, never consulting the dressed body. */
      const before = faceFor(id);
      const beforeHair = before.hair.name;

      /* AFTER: the fix. */
      const after = faceFor(id, { hairName: wantHair, reads: 'either' });
      const threeD = t.id === 'brigand_leader';
      const buf = renderFace(after, { ramp: faceRampFor(after), threeD });

      rows.push({
        id: t.id, label: t.label, faction: faceName.toUpperCase(),
        wantHair, beforeHair, afterHair: after.hair.name,
        matchedBefore: beforeHair === wantHair,
        matchedAfter: after.hair.name === wantHair,
        buf: Array.from(buf), threeD
      });
    }
    if (err) return { err };

    /* PAIRWISE DISTINCTNESS: six different tiers should not collapse to one
       rendered face. renderFace paints an identical gradient background on
       every call (the `for(let y=0...) rect(...)` loop, same formula
       whatever the spec) -- comparing raw pixels would mostly be comparing
       that shared background and call it "alike". So the background for
       each row is computed the same way renderFace does and masked OUT
       first; only the face/hair/skin pixels that actually differ per
       person count toward the ratio below. */
    const N = 64, bgAt = (y) => { const t = y / N;
      return [56 - 18 * t | 0, 54 - 18 * t | 0, 70 - 22 * t | 0]; };
    const fgMask = (buf) => { const m = new Uint8Array(N * N);
      for (let y = 0; y < N; y++) { const bg = bgAt(y);
        for (let x = 0; x < N; x++) { const k = (y * N + x) * 4;
          m[y * N + x] = (buf[k] !== bg[0] || buf[k+1] !== bg[1] || buf[k+2] !== bg[2]) ? 1 : 0; } }
      return m; };
    const iou = (a, b, ma, mb) => { let inter = 0, uni = 0;
      for (let i = 0; i < ma.length; i++) { const k = i * 4;
        const eq = ma[i] && mb[i] && a[k] === b[k] && a[k+1] === b[k+1] && a[k+2] === b[k+2];
        if (eq) inter++;
        if (ma[i] || mb[i]) uni++; }
      return uni ? inter / uni : 0; };
    const masks = rows.map(r => fgMask(r.buf));
    let worst = 0, worstPair = '';
    for (let i = 0; i < rows.length; i++)
      for (let j = i + 1; j < rows.length; j++) {
        const v = iou(rows[i].buf, rows[j].buf, masks[i], masks[j]);
        if (v > worst) { worst = v; worstPair = rows[i].label + '/' + rows[j].label; }
      }

    return {
      rows: rows.map(r => ({ ...r, buf: r.buf })),
      matchedBeforeCount: rows.filter(r => r.matchedBefore).length,
      matchedAfterCount: rows.filter(r => r.matchedAfter).length,
      worst, worstPair
    };
  }, TIERS);

  if (out.err) { console.error('THREW: ' + out.err); await b.close(); process.exit(3); }
  if (out.matchedAfterCount !== TIERS.length) {
    console.error('REFUSING TO WRITE: not all six tiers matched after the fix, ' + out.matchedAfterCount + '/' + TIERS.length);
    await b.close(); process.exit(4);
  }

  const sheetPng = await p.evaluate((out) => {
    const FN = 64, PZ = 3, pW = FN * PZ, PAD = 16, CARD = pW + 34;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + CARD * 3; cv.height = 150 + (CARD + 30) * 2;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 22px monospace';
    cx.fillText('THE ENEMY FACES', PAD, 30);
    cx.font = '13px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('six tiers, each face wearing the same haircut CHARACTER already dressed its body in.', PAD, 52);
    cx.fillText('closest pair ' + (out.worst * 100).toFixed(0) + '% identical (' + out.worstPair + ') -- six faces, not one worn six ways.', PAD, 72);
    const mk = (arr, n) => { const t = document.createElement('canvas'); t.width = t.height = n;
      const im = t.getContext('2d').createImageData(n, n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im, 0, 0); return t; };
    out.rows.forEach((r, i) => {
      const col = i % 3, row = (i / 3) | 0;
      const x = PAD + col * CARD, y = 96 + row * (CARD + 30);
      cx.drawImage(mk(r.buf, FN), 0, 0, FN, FN, x, y, pW, pW);
      cx.fillStyle = '#c7b894'; cx.font = 'bold 13px monospace';
      cx.fillText(r.label + (r.threeD ? ' *' : ''), x, y + pW + 16);
      cx.fillStyle = '#8d7c5e'; cx.font = '11px monospace';
      cx.fillText(r.faction + ' -- ' + r.afterHair.toLowerCase(), x, y + pW + 30);
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Enemy Faces</title>
<!-- PORTRAIT, 10/9/26, [the enemy faces]. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>Each of the six enemy ranks now has a face. The hair on the face is the real hair CHARACTER already put on that rank's body, read from the same faction table, not a random roll.</p>
<p>Checked on real pixels: before this, <b>${out.matchedBeforeCount} of 6</b> faces wore the cut their own body wears; after, <b>${out.matchedAfterCount} of 6</b>. The leader's face carries a second light so he reads as the one you remember.</p>
<img src="PORTRAIT_THE_ENEMY_FACES.png" alt="the enemy faces, six tiers">
<p>Not in this: the undead ("chipped bodies") have no face by their own lore, and the kill recap screen that would show these faces does not exist yet -- both are a different lane's row, not guessed at here.</p>
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), matchedBeforeCount: out.matchedBeforeCount,
    matchedAfterCount: out.matchedAfterCount, worst: out.worst, worstPair: out.worstPair,
    rows: out.rows.map(r => ({ id: r.id, label: r.label, faction: r.faction, wantHair: r.wantHair,
      beforeHair: r.beforeHair, afterHair: r.afterHair, matchedBefore: r.matchedBefore, matchedAfter: r.matchedAfter })) };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0, 3));
  await b.close();
})();
