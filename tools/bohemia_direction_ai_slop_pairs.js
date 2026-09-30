#!/usr/bin/env node
/* BOHEMIA -- DIRECTION [ai slop]: THE MACHINE IS SMOOTH AND WRONG, THE WORLD IS ROUGH AND TRUE.
 * Rule 45c (Paolo 9/29: "I'm really falling in love with this AI slop analog horror direction...
 * AI slop, literally"). The card is records/BOHEMIA_AI_SLOP_THE_MACHINE_AND_THE_WORLD_9_30_26.md.
 * This tool shoots its three do/don't pairs FROM THE GAME'S CAMERA (second votes: show it from the
 * game's camera): the demo's own phone on the map, the feed's own font and glass, with the posts
 * swapped in the DOM for the pair's lines, and the demo's own map glass for the smoothing pair.
 * Nothing is painted by hand. DIRECTION does not cook: the pairs are the card's examples, and the
 * words in them are draft:true attempts WORDS [narrator lines] owns from here.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the ruler is AH-01, the bible, and its law section 10
 * (the two voices, 'AI slop' named as a strand). R1 one wrong thing, R4 the light was in the room
 * (a screen is its own fixture), R5 the dead institution's type, R8 diegetic or dead, R10 grime
 * baked never shaded. The map pair is also read by the 9/29 floor's fine band (0.020). No
 * reference game is cited; 'AI slop' is a direction, never a game.
 *
 * Out: slices/vote/DIRECTION_AI_SLOP_THREE_PAIRS.png
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'aislop-'));

/* the pairs' posts: [who, text, kind]. kind 'machine' is the institution's account, 'person' a person */
const FEEDS = {
  one_do: [
    ['@thevalley', 'Good morning, Reyna. Water is available today at 1 battery per unit. Thank you for your patience.', 'machine'],
    ['@marisol_v', 'water is one battery today. no se, pero we drink anyway', 'person'],
    ['@waterline', 'queue at the standpipe already. bring somthing to sit on', 'person'],
  ],
  one_dont: [
    ['@thevalley', 'still no moving the Church off their town. everybody knows it.', 'machine'],
    ['@marisol_v', 'water is one battery today. no se, pero we drink anyway.', 'person'],
    ['@waterline', 'queue at the standpipe already. bring something to sit on.', 'person'],
  ],
  three_do: [
    ['@thevalley', 'Scheduled maintenance of the Eastside grid is complete. 420 blocks are now powered.', 'machine'],
    ['@thevalley', 'Scheduled maintenance of the Eastside grid is complete. 421 blocks are now powered.', 'machine'],
    ['@thecircuit', 'most of the valley is still dark. 420 blocks with anything in them at all', 'person'],
  ],
  three_dont: [
    ['@thevalley', 'W̴A̸T̷E̶R̵ I̴S̸ G̷O̶N̵E̴!!! Y̸O̷U̶ C̵A̴N̸\'̷T̶ H̵I̴D̸E̷', 'glitch'],
    ['@marisol_v', 'water is one battery today. no se, pero we drink anyway.', 'person'],
    ['@thevalley', 'H̵E̴ I̸S̷ W̶A̵T̴C̸H̷I̶N̵G̴', 'glitch'],
  ],
};

async function shootPhone(d, posts, out) {
  await d.fr.evaluate((posts) => {
    const L = document.getElementById('cityfeedlist');
    L.innerHTML = '';
    for (const [who, txt, kind] of posts) {
      const p = document.createElement('div'); p.className = 'fp life in';
      const w = document.createElement('div'); w.className = 'who'; w.textContent = who;
      const t = document.createElement('div'); t.className = 'txt'; t.textContent = txt;
      if (kind === 'glitch') { t.style.color = '#ff2a2a';
        t.style.textShadow = '2px 0 #00e5ff, -2px 0 #ff00c8'; w.style.color = '#ff2a2a'; }
      p.append(w, t); L.append(p);
    }
    L.scrollTop = 0;
  }, posts);
  await d.page.waitForTimeout(400);
  const fb = await (await d.fr.frameElement()).boundingBox();
  const r = await d.fr.evaluate(() => { const b = document.getElementById('cityfeed').getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height }; });
  fs.writeFileSync(out, await d.page.screenshot({ clip: { x: fb.x + r.x - 4, y: fb.y + r.y - 4, width: r.w + 8, height: r.h + 8 } }));
}

(async () => {
  const d = await open({});
  await d.page.waitForTimeout(3000);   /* the opening zoom: the map fills the glass and the phone is up */
  /* the map pair: a piece of the map canvas's OWN pixels (what it paints, before the browser stretches it) */
  const own = await d.fr.evaluate(() => {
    const c = [...document.querySelectorAll('canvas')].map(c => ({ c, r: c.getBoundingClientRect() }))
      .sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height)[0];
    const sx = c.c.width / c.r.width, sy = c.c.height / c.r.height;
    const t = document.createElement('canvas'); t.width = Math.round(220 * sx); t.height = Math.round(180 * sy);
    t.getContext('2d').drawImage(c.c, Math.round(10 * sx), Math.round((530 - c.r.y) * sy), t.width, t.height, 0, 0, t.width, t.height);
    return t.toDataURL('image/png');
  });
  fs.writeFileSync(path.join(TMP, 'map.png'), Buffer.from(own.split(',')[1], 'base64'));
  for (const k of Object.keys(FEEDS)) await shootPhone(d, FEEDS[k], path.join(TMP, k + '.png'));
  await d.close();
  const out = path.join(ROOT, 'slices/vote/DIRECTION_AI_SLOP_THREE_PAIRS.png');
  const r = cp.spawnSync('python3', [path.join(ROOT, 'tools/bohemia_direction_ai_slop_compose.py'), TMP, out], { encoding: 'utf8' });
  process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });
