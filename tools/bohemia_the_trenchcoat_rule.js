/* TRENCHCOATS ARE FOR KILLERS (8/27/26, CHARACTER lane).
 *
 * Paolo, 8/27: "everyone's getting a fucking trenchcoat and I think that's fucking
 * ridiculous. The trenchcoat should just be reserved for like mostly badass people for
 * real like killers and shit ... I know we still need to make a lot more clothing ...
 * trenchcoats are for bad ass motherfuckers bro cowboy shit like killers like for real"
 *
 * HE IS RIGHT AND HE NAMED THE CAUSE HIMSELF. Measured the day he said it:
 *     16 of the 35 outer garments were LONG COATS -- 46% of the whole slot
 *     5 of the 13 factions wore one
 *     ONE IN FIVE PEOPLE IN THE CITY (20.6%) was in a trenchcoat
 * And FOUR OF THOSE SIXTEEN WERE MINE, cooked the day before he said this.
 *
 * IT IS A HOLE, NOT A PREFERENCE. Every long coat is len 0.80-0.90 and everything else
 * stopped at the WAIST. THE MIDDLE OF THE WARDROBE DID NOT EXIST. If the only outer
 * garments are a waistcoat and a floor-length duster, half the valley ends up in a
 * duster -- so reserving the coat without filling the hole would just strip the coat off
 * half the city and call it a fix.
 *
 * TWO NEW LENGTH BANDS, seventeen garments: a HIP coat (0.34) and a THIGH coat (0.56),
 * plus more jackets and vests. New lengths are new SHAPES, so STRUCTURE-NOT-COLOR is
 * satisfied by geometry and not by argument.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every garment is an existing generator shape
 * at a new length; every body is the alpha's own render.
 *
 *   node tools/bohemia_the_trenchcoat_rule.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/the-trenchcoat-rule.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.BOH_PERSONLOOK, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const LONG = /DUSTER|TRENCH|LONGCOAT|'S COAT|FIELD COAT|COBALT COAT/;
    const pool = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const API = window.BOH_PERSONLOOK;
    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar;
    const PD_OFF = ['hat','glasses','hair','shirt','jacket','pants','shoes'];
    const shot = (dials, worn) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of PD_OFF) eq[s] = '';
      G.equipped = eq; G.bodyVar = dials || {}; window.G_WORN = worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame('S', 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 7, PAD = 16, HDR = 178;
    const X0 = 0.24, X1 = 0.76, Y0 = 0.05, Y1 = 0.95;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const COLS = 8;
    const cv = document.createElement('canvas');
    cv.width = PAD + COLS * (cw + PAD);
    cv.height = HDR + (ch + 54) + 46 + (ch + 74) + 46 + (ch + 44) + 86;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE MIDDLE OF THE WARDROBE DID NOT EXIST', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said everyone has a trenchcoat and it is ridiculous. one in five people', PAD, 82);
    cx.fillText('in the city was wearing one. not because anybody chose that: every coat in', PAD, 106);
    cx.fillText('the game was either a waistcoat or floor-length. there was nothing between.', PAD, 130);

    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
      const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };

    /* ---- ROW 1: the ladder, so the new band is visible as a SHAPE ---- */
    let y = HDR;
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('THE LADDER NOW  --  the two in the middle are new', PAD, y - 10);
    const LADDER = [['BONE VEST','waist'], ['WORK JACKET','waist'], ['CHORE COAT','HIP - NEW'],
                    ['CAR COAT','THIGH - NEW'], ['WASTELAND DUSTER','floor']];
    LADDER.forEach(([n, lbl], i) => {
      const x = PAD + i * (cw + PAD);
      blit(shot({}, { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', outer:n }), x, y);
      cx.fillStyle = /NEW/.test(lbl) ? '#8fc07a' : '#8a7d68';
      cx.font = 'bold 13px monospace'; cx.fillText(lbl, x, y + ch + 18);
      cx.fillStyle = '#e8dcc6'; cx.font = '12px monospace';
      cx.fillText(n.toLowerCase().slice(0, 18), x, y + ch + 34);
    });
    y += ch + 54 + 46;

    /* ---- ROW 2: EIGHT PEOPLE OFF THE STREET, AS THEY ARE NOW ----
       *** THE FIRST CUT OF THIS ROW RECONSTRUCTED THE "BEFORE" and I threw it away.
       It re-picked each person's coat with a hash of my own rather than the one the
       old code used, so the eight it drew were not the eight the old game dressed --
       it showed ONE trenchcoat in eight when the real rate was closer to four, and a
       picture that undersells a bug is still a picture telling him a number I did not
       measure. The population figures in the caption ARE measured, on 5,000 people
       through the real generator, and they carry the before/after on their own. *** */
    let y2 = y;
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('EIGHT PEOPLE OFF THE STREET, AS THEY ARE NOW', PAD, y2 - 10);
    const picks = [];
    for (let i = 0; i < 4000 && picks.length < COLS; i++) {
      const lk = API.lookFor('crowd:0:' + i, pool);
      if ((lk.worn || {}).outer) picks.push(lk);
    }
    let longNow = 0;
    picks.forEach((lk, i) => {
      const x = PAD + i * (cw + PAD);
      if (LONG.test(lk.worn.outer || '')) longNow++;
      blit(shot(lk.body, lk.worn), x, y2);
      cx.fillStyle = '#8a7d68'; cx.font = '11px monospace';
      cx.fillText((lk.worn.outer || '').toLowerCase().slice(0, 19), x, y2 + ch + 16);
    });
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 14px monospace';
    cx.fillText(longNow + ' of ' + picks.length + ' in a trenchcoat', PAD, y2 + ch + 36);
    y = y2 + ch + 74 + 46;

    /* ---- ROW 3: THE RAIL IS STILL THERE, it is just reserved ---- */
    cx.fillStyle = '#c98a6a'; cx.font = 'bold 16px monospace';
    cx.fillText('AND THE COAT IS STILL THERE  --  ONE faction wears it, and the rest is earned', PAD, y - 10);
    /* ONE faction, then the rail. He capped it at 10% of ANYBODY on 8/27 --
       "THIS IS A DESSERT GAME. ITS HOT" -- and the factions were at 23%. */
    const KEEP = [['Anarchists','SPLIT-TAIL DUSTER'], ['','WASTELAND DUSTER'],
                  ['','SOOT TRENCH'], ['','STORM GREY LONGCOAT'],
                  ['','SLATE TRENCH'], ['','KHAKI DUSTER'],
                  ['','BONE DUSTER'], ['','BRICK LONGCOAT']];
    KEEP.forEach(([who, n], i) => {
      const x = PAD + i * (cw + PAD);
      const fl = (window.FACTION_LOOKS || []).filter(f => f.faction === who)[0];
      blit(shot(fl ? fl.dials : {}, fl ? fl.worn :
        { base:'BLACK TANK', legs:'BLACK CARGOS', feet:'RUST BOOTS', outer:n }), x, y);
      cx.fillStyle = who ? '#e8dcc6' : '#8a7d68'; cx.font = (who ? 'bold ' : '') + '12px monospace';
      cx.fillText(who ? who.toUpperCase() : n.toLowerCase().slice(0, 19), x, y + ch + 16);
    });
    y += ch + 44;

    G.bodyVar = keepV; window.G_WORN = keepW; G.equipped = keepE;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    /* ROUNDED ON PURPOSE. Three different 5,000-person samples read 1.66 / 1.38 / 1.34,
       so the honest sentence is "about one and a half", not whichever of the three I
       happened to draw this row from. A picture quoting two decimals off one sample is
       telling him a precision the measurement does not have. */
    cx.fillText('about 20% of people were in one. it is about 1.5% now, and ONE faction of thirteen', PAD, cv.height - 56);
    cx.fillText('still wears it -- 7.7%, inside the 10% you set. the desert is the reason: a', PAD, cv.height - 36);
    cx.fillText('floor-length coat at 40 degrees is a statement, which is what makes it cost something.', PAD, cv.height - 16);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
