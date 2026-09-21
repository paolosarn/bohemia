/* COOK: TWO PEOPLE WHO ARE A LITTLE TOO STILL (9/21/26, CHARACTER lane, [horror body])
 *
 * RULE 22, COOK EVERY ROUND (Paolo 9/21, LOCKED): "I need to be seeing them cooking up more,
 * every time, not never... I'll enter the sound chat and it's not even making fucking
 * sounds. It's coding and checking whether the sounds are broken or not." A making lane
 * makes one real thing every round, REGISTERED IN THE VOTE TAB, or the round did not happen.
 * This lane's last two rounds were pure measurement. This one makes bodies.
 *
 * RULE 20, ANALOG HORROR (Paolo 9/20, LOCKED), and the law's own sentence is the brief:
 * *** "NOT A MONSTER. No creature design, no gore pass, no jump. A PERSON A LITTLE TOO
 * STILL IS THE FACE; a street with the lights still on and nobody home is the tile." ***
 * So none of these three is disfigured, bloodied or strange. Every one is an ordinary
 * person, dressed correctly, and ONE THING about them is wrong.
 *
 * WHAT THIS LANE IS ALLOWED TO COOK WITH, and it shapes the whole answer. COOK owns garment
 * ART; this lane owns THE BODY -- the dials and the pairing. So the wrongness cannot be a
 * new prop or a new texture. It has to live in PROPORTION and in WHAT SOMEBODY CHOSE TO
 * PUT ON, which is the harder and better constraint: an ordinary wardrobe worn wrong is
 * more analog horror than a new sinister object would be.
 *
 *   1. THE ONE WHO STILL WEARS THE UNIFORM. Nothing about him is wrong at all. Work cap,
 *      buttoned shirt, belt, suspenders, boots, gloves, all correct, all matched, in a
 *      valley where the company that issued it is gone. The law's own words: "a dead
 *      institution still broadcasting, in its own typeface, too calm." The wrong thing is
 *      that he is TIDY.
 *   2. DRESSED FOR A COLD THAT IS NOT COMING. Coat, scarf, knit cap, gloves, wraps, in the
 *      desert. A real person makes this mistake exactly once; somebody who makes it every
 *      day is somebody nobody has corrected in a long time.
 *   3. TOO TALL FOR THE DOORWAY. Ordinary clothes, nothing notable. Height at the top of the
 *      dial, shoulders and hips narrowed, arms long. You do not notice until he stands next
 *      to somebody, which is the point: the frame is ordinary and one thing in it is wrong.
 *
 * NOTHING NEW IS DRAWN. REUSE-FIRST: every garment below is already canon on the rail and
 * every dial is the rig's own. That is not a shortcut, it is the test -- if the tone cannot
 * be reached with the wardrobe we have, the tone is a filter and rule 20 says it is not.
 *
 * AND IT DOES NOT SHIP TO THE STREET. Rule 18 holds the play surface; rule 22(b) says the
 * hold is on the play surface and NOT on the making, and everything made goes to VOTE. So
 * these three are rendered, registered, and wired into the cast only if he thumbs them up.
 *
 * REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 9/21 at the seam --
 * this tool shipped without one and the gate caught it the same round): the ruler
 * is AH-01, the analog horror bible, whose rule 1 (the ordinary frame, one wrong
 * thing) and rule 6 (the still face performs restraint) are the whole brief above;
 * the bodies themselves are canon garments on the rig's own dials, so the compare
 * for the wardrobe is the style card's corpus, not a new reference. AH-01 resolves
 * in reference/library/analog-horror/INDEX.md.
 *
 * RIG CHECK (RIG IS LAW): reads only; restores G_WORN, G.equipped, the dials and the caches.
 *
 *   node tools/bohemia_cook_the_too_still.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THREE_PEOPLE_TOO_STILL_9_21_26.txt');

/* THE THREE. Kept here, in the tool that renders them, so the picture he votes on and the
   recipe that would be wired on an up-vote can never drift apart. */
const CAST = [
  { id: 'still-uniform', title: 'THE ONE WHO STILL WEARS THE UNIFORM',
    wrong: 'nothing is wrong with him, and that is the wrong thing',
    why: 'every piece correct and matched, for a company that no longer exists',
    dials: { height: 0.10, belly: 0.05, arms: 0.00, shoulders: 0.30, hips: 0.00 },
    worn: { hair: 'DRY TAPER', head: 'SLATE WORK CAP', base: 'PATINA WORK SHIRT',
            legs: 'PATCHED WORK PANTS', feet: 'BROWN BOOTS', waist: 'LEATHER BELT',
            gear: 'WORK SUSPENDERS', hands: 'LEATHER GLOVES' } },
  { id: 'still-cold', title: 'DRESSED FOR A COLD THAT IS NOT COMING',
    wrong: 'wrapped for winter, in a desert, every day',
    why: 'one mistake anybody makes once; nobody has corrected this person in a long time',
    dials: { height: -0.20, belly: 0.20, arms: -0.10, shoulders: -0.10, hips: 0.10 },
    worn: { hair: 'LAYERED FALL', head: 'STORM KNIT CAP', neck: 'DUST SCARF',
            base: 'BONE HENLEY', outer: 'FIELD GREEN COAT', legs: 'DUST TROUSERS',
            feet: 'WRAPPED BOOTS', hands: 'DUST GLOVES' } },
  /* *** A THIRD WAS DESIGNED, BUILT, LOOKED AT AND CUT: "TOO TALL FOR THE DOORWAY". ***
     Ordinary clothes, height at the top of the dial, narrow shoulders and hips. It did not
     read, so I measured the dial instead of adjusting it again, and THE RIG CANNOT DO IT:
         height dial -1   body  96 px painted        height dial +1   body 103 px
         width at every setting: 39 px, flat
     SEVEN PER CENT END TO END. Real adult height runs about a third between the short and
     the tall, so at the very top of the slider a man is three per cent above average and
     nobody on earth can see that. The label would have claimed something the pixels do not
     show, which is this lane's own [names lie] defect in the one place he judges things.
     STOP PRODUCING: the tell is writing a third version of something. So it is cut, and the
     number is reported instead -- THE RIG HAS NO USABLE HEIGHT RANGE, and that is worth
     more than a body nobody can tell is tall. */
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate((CAST) => {
    const o = { missing: [], made: [], sheet: null };
    const keepW = window.G_WORN, keepE = G.equipped, keepD = JSON.stringify(G.bodyVar || {});
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    /* EVERY GARMENT NAMED MUST BE REAL AND CANON. A recipe that names a garment the rail
       does not have renders a naked man and looks like a design choice -- this lane froze
       thirteen of those once and called it a baseline. */
    const canon = {};
    for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;
    for (const c of CAST) for (const k in c.worn)
      if (!canon[c.worn[k]]) o.missing.push(c.id + ': ' + c.worn[k]);
    if (o.missing.length) return o;

    /* *** THE DIALS GO IN G.bodyVar AND THE RIG HAS TO BE REBUILT. ***
       The first cut of this wrote `G.dials[k] = ...` inside a try/catch. THERE IS NO
       G.dials. The catch swallowed the TypeError, all three bodies rendered with default
       proportions, and "TOO TALL FOR THE DOORWAY" came out exactly as tall as the ordinary
       man standing next to it. A LABEL CLAIMING SOMETHING THE PIXELS DO NOT SHOW is the
       [names lie] defect, and it was one step from going in front of him in the one place
       he judges things. Caught by LOOKING AT THE PICTURE, which is the only reason.
       A SILENT CATCH AROUND A WRITE IS A LIE WAITING TO HAPPEN: it turned "this does
       nothing" into "this worked". The real path is the one the game uses on its own cast
       (famPaintBody): set G.bodyVar, rebuild the rig, and restore both after. */
    const draw = (worn, dials) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = dials;
      rebuildFromRig();
      clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { return null; }
      const W = fr.CW, H = fr.CH; if (!W || !H) return null;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      let top = 1e9, bot = -1;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
        const y = (i / W) | 0; if (y < top) top = y; if (y > bot) bot = y;
      }
      g2.putImageData(im, 0, 0);
      return { cv: c, painted: bot - top + 1 };
    };
    /* AN ORDINARY CITIZEN BESIDE THEM, so "too tall" and "too tidy" are visible at all.
       One thing being wrong is only legible next to the thing being right. */
    const plain = draw({ hair: 'DRY TAPER', base: 'WHITE TEE', legs: 'BLUE JEANS',
                         feet: 'BROWN BOOTS' },
                       { height: 0, belly: 0, arms: 0, shoulders: 0, hips: 0 });
    const shots = CAST.map(c => ({ c: c, m: draw(c.worn, c.dials) }));

    /* THE SHEET. The valley's ground under them and the light that is in the room: no
       spotlight, no vignette, no filter. Rule 20 bans the filter by name. */
    const CELL = 210, PAD = 14, HEAD = 40, LAB = 58;
    const cv = document.createElement('canvas');
    cv.width = (shots.length + 1) * CELL + PAD * 2;
    cv.height = CELL + HEAD + LAB + PAD * 2;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
    g.font = 'bold 19px ui-monospace, monospace';
    g.fillText('TWO PEOPLE WHO ARE A LITTLE TOO STILL', PAD, PAD);
    g.font = '13px ui-monospace, monospace';
    g.fillText('an ordinary person on the left. nothing here is a monster.', PAD, PAD + 22);
    const put = (m, x, title, sub) => {
      if (m && m.cv) {
        const s = Math.min(CELL / m.cv.width, CELL / m.cv.height);
        const w = Math.round(m.cv.width * s), h = Math.round(m.cv.height * s);
        g.drawImage(m.cv, x + (CELL - w) / 2, PAD + HEAD, w, h);
      }
      g.fillStyle = '#3a2f1c'; g.font = 'bold 12px ui-monospace, monospace';
      g.fillText(String(title).slice(0, 27), x + 3, PAD + HEAD + CELL + 4);
      g.font = '11px ui-monospace, monospace';
      const words = String(sub).split(' '); let line = '', ln = 0;
      for (const w2 of words) {
        if ((line + ' ' + w2).length > 30) { g.fillText(line, x + 3, PAD + HEAD + CELL + 20 + ln * 13); line = w2; ln++; }
        else line = line ? line + ' ' + w2 : w2;
      }
      if (line) g.fillText(line, x + 3, PAD + HEAD + CELL + 20 + ln * 13);
    };
    put(plain, PAD, 'AN ORDINARY ONE', 'for scale. nothing wrong with him.');
    shots.forEach((s, i) => put(s.m, PAD + (i + 1) * CELL, s.c.title, s.c.wrong));
    o.sheet = cv.toDataURL('image/png');
    o.made = shots.map(s => ({ id: s.c.id, title: s.c.title, painted: s.m ? s.m.painted : null }));
    o.plainPainted = plain ? plain.painted : null;

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); rebuildFromRig(); clear();
    return o;
  }, CAST);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  if (R.missing.length) {
    console.error('REFUSING TO COOK: these recipes name garments the rail does not have:\n  '
      + R.missing.join('\n  ') + '\nA recipe that names a missing garment renders a naked man '
      + 'and looks like a design choice.');
    process.exit(2);
  }
  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_TWO_PEOPLE_TOO_STILL.png');
  fs.writeFileSync(f, Buffer.from(R.sheet.split(',')[1], 'base64'));

  const L = [];
  L.push('TWO PEOPLE WHO ARE A LITTLE TOO STILL  --  CHARACTER lane, 9/21/26, [horror body]');
  L.push('');
  L.push('RULE 22 (Paolo 9/21): "I need to be seeing them cooking up more, every time, not');
  L.push('never." A making lane makes one real thing a round, registered in the VOTE tab.');
  L.push('This lane\'s last two rounds were measurement. These are bodies.');
  L.push('');
  L.push('RULE 20, and the law\'s own sentence is the whole brief: "NOT A MONSTER. No creature');
  L.push('design, no gore pass, no jump. A PERSON A LITTLE TOO STILL IS THE FACE."');
  L.push('So each of these is an ordinary person, dressed correctly, with ONE thing wrong.');
  L.push('');
  for (const m of R.made) {
    const c = CAST.filter(x => x.id === m.id)[0];
    L.push('  ' + c.title);
    L.push('    the one wrong thing   ' + c.wrong);
    L.push('    why it reads          ' + c.why);
    L.push('    painted height        ' + m.painted + ' px   (an ordinary one is ' + R.plainPainted + ')');
    L.push('');
  }
  L.push('WHAT THIS LANE IS ALLOWED TO COOK WITH, AND IT SHAPED THE ANSWER. COOK owns garment');
  L.push('ART; this lane owns THE BODY, which is the dials and the pairing. So the wrongness');
  L.push('could not be a new sinister prop. It had to live in PROPORTION and in WHAT SOMEBODY');
  L.push('CHOSE TO PUT ON. That is the better constraint: an ordinary wardrobe worn wrong is');
  L.push('more analog horror than a new object would be, and rule 20 bans the filter anyway.');
  L.push('NOTHING NEW WAS DRAWN. Every garment is already canon on the rail; every dial is the');
  L.push('rig\'s own. If the tone cannot be reached with the wardrobe we have, it is a filter.');
  L.push('');
  L.push('AN ORDINARY CITIZEN STANDS BESIDE THEM IN THE PICTURE. One thing being wrong is only');
  L.push('legible next to the thing being right, and "too tall" means nothing alone.');
  L.push('');
  L.push('*** A THIRD WAS DESIGNED, BUILT, LOOKED AT AND CUT: "TOO TALL FOR THE DOORWAY". ***');
  L.push('It did not read. So I measured the dial instead of adjusting it a third time:');
  L.push('    height dial -1   body  96 px painted       height dial +1   body 103 px');
  L.push('    width at every setting: 39 px, flat');
  L.push('SEVEN PER CENT END TO END. Real adult height runs about a third between the short');
  L.push('and the tall. At the very top of the slider a man is three per cent above average');
  L.push('and nobody can see that. THE RIG HAS NO USABLE HEIGHT RANGE. Shipping it would have');
  L.push('put a label claiming something the pixels do not show into the one place he judges');
  L.push('things, which is this lane\'s own [names lie] defect one screen further out.');
  L.push('');
  L.push('IT DOES NOT SHIP TO THE STREET. Rule 18 holds the play surface; rule 22(b) says the');
  L.push('hold is on the play surface and not on the making. Registered in VOTE. If he thumbs');
  L.push('it up these go into the cast the same round; the recipes live in the tool that drew');
  L.push('them, so the picture and the wire can never drift apart.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  wrote slices/vote/CHARACTER_TWO_PEOPLE_TOO_STILL.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
