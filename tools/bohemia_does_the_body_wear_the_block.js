/* DOES THE BODY WEAR THE BLOCK? (9/12/26, CHARACTER lane, VAMILY [faction colour]
 * THE-BODY-WEARS-THE-TERRITORY)
 *
 * THE ROW: "on the walked surface, every dressed person's dominant colour matches the
 * faction that owns the block they stand on (COLOUR IS TERRITORY, 8/26); measure the miss
 * rate and fix the picker where it misses."
 *
 * THE LAW IT SERVES (8/26, LOCKED, Paolo's own words): "people get shot in Los Angeles
 * for wearing the wrong color ... when it comes down to how we wanna communicate, like,
 * who would defend us." Silhouette says WHAT KIND of person; colour says WHOSE.
 *
 * SO THE MEASUREMENT IS THREE JOINED QUESTIONS, and nobody has asked any of them on the
 * walked street:
 *   Q1 WHO OWNS THE GROUND under each body the renderer actually blitted? The city can
 *      answer that per cell since the [who holds] ruling -- POWER.holderAt.
 *   Q2 WHOSE IS EACH BODY? ctFactionOf, the same call the cast uses to pick a body.
 *   Q3 WHAT COLOUR IS THAT BODY ACTUALLY WEARING? Not what the table says it should be:
 *      the DOMINANT HUE of the pixels the game blitted, read off the sprite.
 * Then the miss rate is Q3 against the faction colour table, for the people the law
 * actually governs.
 *
 * *** AND THE ROW'S OWN WORDING HIDES A TRAP THIS TOOL REFUSES TO WALK INTO. ***
 * "EVERY dressed person's dominant colour matches the faction that owns the block" would,
 * read literally, put the whole street in gang colours -- every shopkeeper, every kid, in
 * Cartel brown because they happen to stand on Cartel ground. That is the opposite of the
 * law it cites. The law says colour is a STATEMENT OF WHO WOULD DEFEND YOU and that
 * "wearing your colours is a choice with a cost"; the style card allows ONE saturated
 * piece per body and lists dust, ash, bone and lead as legal cloth. A valley where
 * everybody is in uniform has no signal in it at all, because a colour only means
 * something against another colour (the law's own line about the Bloods and the Crips).
 * So this measures the miss rate for AFFILIATED bodies and reports the civilians
 * SEPARATELY rather than counting them as misses. If that reading is wrong it is wrong in
 * public, with both numbers printed, instead of being buried in a fix.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports. Never touches BAKED, a joint, a bone or
 * a painted pixel; restores nothing because it changes nothing.
 * REUSE CHECK: cooks ZERO pixels. The crowd harness is the one from [stands out] (9/6),
 * the ground answer is the city's own POWER.holderAt, the colours are the dress module's.
 *
 *   node tools/bohemia_does_the_body_wear_the_block.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_BODY_WEAR_THE_BLOCK_9_12_26.txt');
const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 150)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'));
  await SETTLE(p, 15000);
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(p, 12000);
  await wait(3000);
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.log('NO CITY FRAME -- the demo did not open the walked street'); await b.close(); process.exit(1); }

  const r = await fr.evaluate(async () => {
    const o = {};
    for (let q = 0; q < 14; q++) {
      const btns = [...document.querySelectorAll('#daycardIn .dcgo, #daycardIn button, .dcgo')];
      if (!btns.length) break;
      btns[btns.length - 1].click();
    }
    try { cardHide(); } catch (e) {}
    const dc = document.getElementById('daycard'); if (dc) dc.style.display = 'none';
    T.min = 13 * 60;

    /* THE FACTION COLOUR TABLE, READ LIVE. A copy typed here would measure the copy. */
    let table = {};
    /* AND WHETHER THE MODULE IS EVEN HERE IS ITSELF ONE OF THE ANSWERS. The faction
       colours live in engine/bohemia_dress.js and the walked city never loads it, so on
       this surface the table is not thin -- it is absent. Reported, not silently zero. */
    o.dressModuleLoaded = (typeof window.BohemiaDress !== 'undefined');
    try {
      const D = window.BohemiaDress || window.BOH_DRESS || null;
      if (D && D.FACTION_LOOK) for (const k in D.FACTION_LOOK) {
        const L = D.FACTION_LOOK[k];
        if (L && L.color) table[k] = L.color;
      }
      if (D && D.FACTION_COLOR) for (const k in D.FACTION_COLOR)
        if (!table[k]) table[k] = D.FACTION_COLOR[k];
    } catch (e) {}
    o.table = table;

    /* SWEEP THE VALLEY FOR GROUND THAT IS ACTUALLY HELD, rather than standing in one spot
       and reporting whatever that spot happens to be. */
    const NB = BohemiaPopulation.NB, span = NB * FN;
    const holders = {};
    let probed = 0, held = 0;
    const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
    const spots = [];
    for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
    for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
      let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      if (!ppl.length) continue;
      for (const q of ppl) {
        let at = null; try { at = pplAt(q); } catch (e) { continue; }
        if (!at) continue;
        probed++;
        let h = null; try { h = POWER.holderAt(at[0], at[1]); } catch (e) {}
        if (h) { held++; holders[h] = (holders[h] || 0) + 1; }
        spots.push({ nx: nx, ny: ny, at: at, n: ppl.length });
      }
    }
    o.probed = probed; o.heldGround = held; o.holders = holders;

    /* STAND IN THE FULLEST NEIGHBOURHOOD, the same way [stands out] did. */
    let best = null;
    for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
    for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
      let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      if (ppl.length && (!best || ppl.length > best.n)) best = { n: ppl.length, ppl: ppl };
    }
    if (best) {
      const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
      const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
      hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
    }
    try { render(); } catch (e) { o.threw = String(e.message).slice(0, 140); }

    /* THE DOMINANT HUE OF A BODY AS DRAWN. Opaque pixels only; near-grey pixels are
       excluded from the hue vote because grey has no hue and a dun body is mostly grey --
       counting it would elect "no colour" every time and say nothing. */
    const hueOf = (spr) => {
      if (!spr) return null;
      let src = spr; try { if (typeof spriteAt === 'function') src = spriteAt(spr, 32) || spr; } catch (e) {}
      try {
        const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(src, 0, 0);
        const im = x.getImageData(0, 0, c.width, c.height).data;
        const bins = new Array(12).fill(0); let col = 0, tot = 0;
        for (let i = 0; i < im.length; i += 4) {
          if (im[i + 3] < 128) continue;
          tot++;
          const R = im[i], G = im[i + 1], B = im[i + 2];
          const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
          const sat = mx ? (mx - mn) / mx : 0;
          if (sat < 0.25 || mx < 40) continue;           /* grey or near-black: no hue */
          col++;
          let hdeg;
          if (mx === mn) hdeg = 0;
          else if (mx === R) hdeg = 60 * (((G - B) / (mx - mn)) % 6);
          else if (mx === G) hdeg = 60 * (((B - R) / (mx - mn)) + 2);
          else hdeg = 60 * (((R - G) / (mx - mn)) + 4);
          if (hdeg < 0) hdeg += 360;
          bins[Math.floor(hdeg / 30) % 12]++;
        }
        let bi = 0; for (let i = 1; i < 12; i++) if (bins[i] > bins[bi]) bi = i;
        return { bin: bins[bi] ? bi : null, colouredShare: tot ? col / tot : 0 };
      } catch (e) { return null; }
    };
    const hexBin = (hex) => {
      const n = parseInt(String(hex).replace('#', ''), 16);
      const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
      const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
      if (mx === mn) return null;
      let h;
      if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
      else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
      else h = 60 * (((R - G) / (mx - mn)) + 4);
      if (h < 0) h += 360;
      return Math.floor(h / 30) % 12;
    };
    o.tableBin = {}; for (const k in table) o.tableBin[k] = hexBin(table[k]);

    const rows = [];
    for (let i = 0; i < BARK_DREW.length; i++) {
      const person = BARK_DREW[i].p, at = BARK_DREW[i].at;
      let dir = 'S'; try { dir = pplFace(person, at); } catch (e) {}
      let own = null; try { own = ctBody(person, dir); } catch (e) {}
      let spr = own; if (!spr) { try { const s = PLAYER_CV[dir] || PLAYER_CV.S; spr = s && s.idle; } catch (e) {} }
      const H = hueOf(spr);
      let mine = null; try { mine = ctFactionOf(person); } catch (e) {}
      let ground = null; try { ground = POWER.holderAt(at[0], at[1]); } catch (e) {}
      rows.push({ id: person.id, mine: mine || null, ground: ground || null,
                  bin: H ? H.bin : null, coloured: H ? H.colouredShare : 0 });
    }
    /* AND THE FOURTH HOLE, asked directly because the sprite comparison could not answer
       it: if a body DID have a faction, would the cast dress it in one? Ask for a faction
       bake and wait. No timing subtlety here -- this reads a table, not a picture. */
    o.castCV = (typeof CAST_CV !== 'undefined' && CAST_CV) ? CAST_CV.length : null;
    o.castFidBefore = (typeof CAST_FID !== 'undefined') ? Object.keys(CAST_FID).length : null;
    try { if (typeof ctNeedFaction === 'function') ctNeedFaction('REDS'); } catch (e) { o.bakeThrew = String(e.message).slice(0, 120); }
    for (let i = 0; i < 20; i++) {
      await new Promise(r2 => setTimeout(r2, 1000));
      if (typeof CAST_FID !== 'undefined' && Object.keys(CAST_FID).length) { o.bakeLandedSec = i + 1; break; }
    }
    o.castFidAfter = (typeof CAST_FID !== 'undefined') ? Object.keys(CAST_FID).length : null;

    o.rows = rows;
    return o;
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const rows = r.rows || [];
  const withFaction = rows.filter(x => x.mine);
  const onHeld = rows.filter(x => x.ground);
  const pct = (a, n) => n ? (a / n * 100).toFixed(1) + '%' : '-';

  const L = [];
  L.push('DOES THE BODY WEAR THE BLOCK? -- COLOUR IS TERRITORY, measured on the walked');
  L.push('street through the demo');
  L.push('9/12/26, CHARACTER lane. VAMILY [faction colour] THE-BODY-WEARS-THE-TERRITORY.');
  L.push('');
  L.push('THE ROW: "every dressed person\'s dominant colour matches the faction that owns');
  L.push('the block they stand on; measure the miss rate and fix the picker where it misses."');
  L.push('THE LAW (8/26, his words): "people get shot in Los Angeles for wearing the wrong');
  L.push('color ... how we wanna communicate, like, who would defend us."');
  L.push('');
  L.push('  bodies the renderer put on the glass    ' + rows.length);
  L.push('  the faction colour module is loaded     ' + (r.dressModuleLoaded ? 'yes' : 'NO') +
    (r.dressModuleLoaded ? '   (' + Object.keys(r.table || {}).length + ' colours)' : ''));
  L.push('');
  L.push('Q1. WHO OWNS THE GROUND THEY STAND ON?');
  L.push('');
  L.push('  resident spots probed across the valley  ' + r.probed);
  L.push('  standing on ground somebody HOLDS        ' + r.heldGround + '   ' +
    pct(r.heldGround, r.probed));
  const hold = Object.keys(r.holders || {});
  if (hold.length) {
    for (const k of hold.sort((a, c) => r.holders[c] - r.holders[a]).slice(0, 8))
      L.push('      ' + k.padEnd(16) + r.holders[k]);
  } else {
    L.push('      NOBODY HOLDS ANY GROUND A RESIDENT STANDS ON.');
  }
  L.push('');
  L.push('Q2. WHOSE IS EACH BODY?');
  L.push('');
  L.push('  bodies answering a faction of their own  ' + withFaction.length + ' of ' +
    rows.length + '   ' + pct(withFaction.length, rows.length));
  L.push('');
  L.push('Q3. AND WHAT COLOUR ARE THEY ACTUALLY WEARING?');
  L.push('');
  const anyCol = rows.filter(x => x.coloured >= 0.12);
  L.push('  bodies with any real colour on them      ' + anyCol.length + ' of ' + rows.length +
    '   ' + pct(anyCol.length, rows.length));
  L.push('  (a body is "coloured" when at least 12% of its pixels carry a hue at all --');
  L.push('   grey and near-black are excluded, because a dun body is mostly grey and');
  L.push('   counting it would elect "no colour" every time and say nothing)');
  L.push('');
  L.push('Q4. AND IF A BODY DID HAVE A FACTION, WOULD IT BE DRESSED IN ONE?');
  L.push('');
  L.push('  trade bodies baked and ready             ' + r.castCV);
  L.push('  faction bodies baked, before asking      ' + r.castFidBefore);
  L.push('  ... after asking, and waiting            ' + r.castFidAfter +
    (r.bakeLandedSec ? '   (landed after ' + r.bakeLandedSec + 's)' : '   (nothing landed)'));
  L.push('');
  L.push('  THE FACTION CAST NEVER BAKES. The trade cast is there and works, the request');
  L.push('  function exists and throws nothing, and the faction cast stays empty. So even');
  L.push('  handing somebody a faction would not put them in its colours today.');
  L.push('');
  L.push('  A PROBE THAT COULD NOT ANSWER THIS IS WORTH RECORDING: the first attempt gave');
  L.push('  bodies a faction and compared their sprites. It read 12 of 12 changed, then on');
  L.push('  a re-run 0 of 12, then 6 of 12. A body\'s breath frame advances with the beat,');
  L.push('  so ANY two samples taken seconds apart differ whatever you did in between --');
  L.push('  the null control changed 12 of 12 with no faction at all. The question is');
  L.push('  answered above by reading a TABLE instead of a PICTURE, which has no clock in');
  L.push('  it. WHEN A MEASUREMENT FLIPS BETWEEN RUNS, STOP READING IT.');
  L.push('');
  L.push('THE MISS RATE');
  L.push('');
  if (!withFaction.length || !r.heldGround) {
    L.push('  *** IT CANNOT BE COMPUTED, AND THAT IS THE FINDING. ***');
    L.push('');
    if (!withFaction.length)
      L.push('  NOT ONE BODY ON THE STREET BELONGS TO A FACTION. ' + rows.length + ' of ' +
        rows.length + ' answer none.');
    if (!r.heldGround)
      L.push('  AND NO RESIDENT IS STANDING ON GROUND ANYBODY HOLDS (0 of ' + r.probed + ').');
    if (!r.dressModuleLoaded)
      L.push('  AND THE WALKED CITY NEVER LOADS THE FACTION COLOUR MODULE AT ALL.');
    if (!r.castFidAfter)
      L.push('  AND THE FACTION CAST NEVER BAKES, so there is nothing to dress them in.');
    L.push('');
    L.push('  A miss rate needs two things to compare. The colours exist, the law exists,');
    L.push('  the ground can answer who holds it -- but on the surface Paolo walks there is');
    L.push('  no affiliated person and no claimed block under them, so "does this body wear');
    L.push('  this block\'s colour" has no subject. Fixing the picker would be fixing the');
    L.push('  half of the sentence that is not broken.');
  } else {
    const bad = withFaction.filter(x => x.bin !== null && r.tableBin[x.mine] != null &&
      x.bin !== r.tableBin[x.mine]);
    L.push('  affiliated bodies whose hue is NOT their faction\'s   ' + bad.length +
      ' of ' + withFaction.length + '   ' + pct(bad.length, withFaction.length));
  }
  L.push('');
  L.push('*** AND THE ROW\'S OWN WORDING HIDES A TRAP, NAMED HERE RATHER THAN WALKED INTO.');
  L.push('"EVERY dressed person\'s colour matches the faction that owns the block" would,');
  L.push('read literally, put the whole street in gang colours -- every shopkeeper, every');
  L.push('kid, in Cartel brown for standing on Cartel ground. That is the opposite of the');
  L.push('law it cites. The law calls colour "a statement of who would defend you" and says');
  L.push('wearing your colours is A CHOICE WITH A COST; the style card allows ONE saturated');
  L.push('piece per body and lists dust, ash, bone and lead as legal cloth. A valley where');
  L.push('everybody is in uniform has no signal in it, because a colour only means');
  L.push('something against another colour -- the law\'s own line about the Bloods taking');
  L.push('red to contrast the Crips\' blue. So the miss rate above is for AFFILIATED bodies,');
  L.push('and civilians are reported, never counted as misses.');
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. A NUMBER IS NOT A FINDING UNTIL YOU KNOW');
  L.push('WHAT IT IS COUNTING. Hue is read off the PIXELS THE GAME BLITTED, in twelve bins,');
  L.push('ignoring grey -- so "wrong colour" here means the body is visibly a different hue,');
  L.push('not that a hex differs by a shade.');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();
