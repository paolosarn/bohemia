/* ============================================================================
   A FLAT THING READS FLAT (9/13/26, LIFE + CITY lane)
   VAMILY row [freeway reads] A-FLAT-FREEWAY-READS-AS-A-BRIDGE, the lane's first
   job under rule 14, THE FIVE MINUTES.

   *** PAOLO 9/13: "I thought something was an overpass over a freeway, of a
       regular street crossing over the freeway section, and it was just it." ***

   He was right and the lie was in overpassAt's test. It asked whether a street was
   NEXT TO the cell, so a freeway running ALONGSIDE a street was jacked onto a deck
   and given a cast shadow down its whole length while being flat ground -- and a
   street running parallel to a freeway was sunk into a trough the whole way.

   THE FIRST NUMBER WAS TOO GOOD AND IT WAS WRONG. Asking only "is there a road on
   the opposite side of THIS cell" said 194 of 198 decks were false. That is a much
   better headline and it is not true: THE FREEWAY IS TWO CELLS WIDE (164 of the 168
   bands), so a genuine crossing never puts a road against the cell at all. Stepping
   across the whole band:

       BEFORE   decks  198 drawn, 168 genuinely crossed,  30 FALSE
                dips   201 drawn, 172 genuinely under,    29 FALSE
       AFTER    decks  168 drawn, 168 genuinely crossed,   0 FALSE
                dips   172 drawn, 172 genuinely under,     0 FALSE

   They pair up -- deck (5,20) with dip (5,19), deck (6,64) with dip (6,63) --
   because they were one defect seen from both sides.

   AND IT REMOVES NO OVERPASS HE ASKED FOR, which is the whole point. Paolo 8/15:
   "there has to be an intersection of when the freeway meets the street you gotta
   look decent like you gotta be like an underpass an overpass or something most of
   the time probably a overpass though ... and then the streets right before that
   intersection like they gotta look like they dip a little bit." Every one of the
   168 real decks and 172 real dips survives untouched.

   WHERE HE SAW IT, MEASURED RATHER THAN ASSUMED: the nearest freeway is 324 walked
   cells from the demo's door, which at the repo's own MIN_PER_CELL is 27.2 MINUTES.
   He cannot have walked to it inside the five minutes, so this is a CITY MODE break
   -- and city mode is the only caller of overpassAt in the file.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('A FLAT THING READS FLAT — the deck is a crossing, not a neighbour');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE TEST IS THE CROSSING. Both sides of the band, on both axes, not a neighbour. */
ok('A1 a freeway cell carries a deck only when an ordinary street is on BOTH far sides '
   + 'of the whole band, not merely beside it',
   /_rd\(x-a\*back,y-b\*back\) && _rd\(x\+a\*fwd,y\+b\*fwd\)\) return 1;/.test(CITY));

/* A2. AND THE DIP CHAINS TO A REAL CROSSING, so no trough leads nowhere. */
ok('A2 a street dips only when the street picks up again on the far side of the band, '
   + 'so a trough always leads somewhere',
   /while\(k<SPAN && _fw\(x\+q\[0\]\*k,y\+q\[1\]\*k\)\) k\+\+;/.test(CITY)
   && /if\(_rd\(x\+q\[0\]\*k,y\+q\[1\]\*k\)\) return 2;/.test(CITY));

/* A3. HIS 8/15 RULING IS STILL THE MECHANISM: the freeway is the deck and the street
   goes under. This leg exists so nobody "fixes" the read by flipping which one lifts. */
ok('A3 the freeway is still the thing carried OVER and the street still dips UNDER, '
   + 'which is his 8/15 ruling and is not what this round changed',
   /1 = carries the deck/.test(CITY) && /2 = dips under/.test(CITY));

(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(20000);
  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;

  const m = fr ? await fr.evaluate(() => {
    try {
      const N = om.n;
      const isFw = (x, y) => { const n = om.at(x, y); return !!(n && FW_FAM(n.district)); };
      const isRd = (x, y) => { const n = om.at(x, y); return !!(n && RD[n.district] && !FW_FAM(n.district)); };
      let deck = 0, deckReal = 0, dip = 0, dipReal = 0;
      const widths = {};
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
        const t = om.at(x, y); if (!t) continue;
        if (FW_FAM(t.district)) {
          if (overpassAt(x, y) !== 1) continue;
          deck++;
          /* JUDGED INDEPENDENTLY OF THE SHIPPED FUNCTION -- this walks the band itself
             rather than asking overpassAt whether overpassAt was right. */
          for (const [dx, dy] of [[0, 1], [1, 0]]) {
            let a = 1; while (a < 12 && isFw(x - dx * a, y - dy * a)) a++;
            let b = 1; while (b < 12 && isFw(x + dx * b, y + dy * b)) b++;
            if (isRd(x - dx * a, y - dy * a) && isRd(x + dx * b, y + dy * b)) {
              deckReal++; widths[a + b - 1] = (widths[a + b - 1] || 0) + 1; break;
            }
          }
        } else if (RD[t.district]) {
          if (overpassAt(x, y) !== 2) continue;
          dip++;
          for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
            if (!isFw(x + dx, y + dy)) continue;
            let k = 1; while (k < 12 && isFw(x + dx * k, y + dy * k)) k++;
            if (isRd(x + dx * k, y + dy * k)) { dipReal++; break; }
          }
        }
      }
      /* AND HOW FAR THE NEAREST FREEWAY IS FROM THE DOOR, walked, in his own minutes.
         Rule 14 asks what the first five minutes contain; this answers it with a number
         instead of a guess, and it is why this break is a CITY MODE break. */
      const start = [hx, hy];
      const seen = new Set([start[0] + ',' + start[1]]);
      let front = [start], steps = 0, hit = null;
      while (front.length && !hit && steps < 1200) {
        const next = [];
        for (const [x, y] of front) {
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
            if (seen.has(k)) continue;
            if (nx < 0 || ny < 0 || nx >= N * FN || ny >= N * FN) continue;
            if (isFw(Math.floor(nx / FN), Math.floor(ny / FN))) { hit = steps + 1; break; }
            if (!pplStandable(nx, ny)) continue;
            seen.add(k); next.push([nx, ny]);
          }
          if (hit) break;
        }
        front = next; steps++;
      }
      return { deck, deckReal, dip, dipReal, widths,
               fwCells: hit, fwMins: hit ? hit * MIN_PER_CELL : null };
    } catch (e) { return { err: String(e).slice(0, 200) }; }
  }) : { err: 'NO CITY FRAME' };

  /* B1. *** THE THING THIS ROUND IS FOR. NO FLAT GROUND IS DRAWN RAISED. *** */
  ok('B1 *** EVERY LIFTED DECK IS A REAL CROSSING *** — ' + m.deck + ' drawn, '
     + m.deckReal + ' genuinely crossed, ' + (m.deck - m.deckReal) + ' false. It was 30 false '
     + 'of 198, every one of them flat ground wearing a deck and a cast shadow',
     !m.err && m.deck > 0 && m.deck === m.deckReal);

  /* B2. AND NO TROUGH LEADS NOWHERE. */
  ok('B2 every dipping street really goes under — ' + m.dip + ' drawn, ' + m.dipReal
     + ' genuinely under, ' + (m.dip - m.dipReal) + ' false. It was 29 false of 201',
     !m.err && m.dip > 0 && m.dip === m.dipReal);

  /* B3. AND HIS 8/15 OVERPASSES DID NOT GET DELETED TO BUY IT. A fix that removed the
     lie by removing every overpass would pass B1 and B2 and be a worse game. */
  ok('B3 the real crossings SURVIVED — ' + m.deckReal + ' decks and ' + m.dipReal
     + ' dips still stand, against 168 and 172 before. A fix that bought the honesty by '
     + 'deleting his 8/15 overpasses would read as green here and be a worse game',
     !m.err && m.deckReal >= 168 && m.dipReal >= 172);

  /* B4. THE BAND IS TWO CELLS WIDE, which is the fact that made the first cut wrong. */
  ok('B4 the crossing test still spans the whole band, so a two-cell freeway still reads '
     + 'as crossed (widths seen: ' + JSON.stringify(m.widths) + ')',
     !m.err && (m.widths[2] || 0) > 100);

  /* B5. WHERE HE COULD HAVE SEEN IT. Not an assertion about the fix -- a standing fact
     about which of his five minutes this break lives in. */
  ok('B5 the nearest freeway is ' + (m.fwCells || '?') + ' walked cells from the door, '
     + (m.fwMins ? m.fwMins.toFixed(1) : '?') + ' minutes, so this is a CITY MODE break '
     + 'and not something he met on foot in the five',
     !m.err && m.fwCells > 0);

  ok('B6 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED ON THE REAL MAP:');
  console.log('    lifted decks    : ' + m.deck + '   real ' + m.deckReal
    + '   false ' + (m.deck - m.deckReal) + '      (was 198 / 168 / 30)');
  console.log('    dipping streets : ' + m.dip + '   real ' + m.dipReal
    + '   false ' + (m.dip - m.dipReal) + '      (was 201 / 172 / 29)');
  console.log('    freeway from the door: ' + m.fwCells + ' cells, '
    + (m.fwMins ? m.fwMins.toFixed(1) : '?') + ' minutes on foot');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  A FLAT THING READS FLAT: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  A FLAT THING READS FLAT: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
