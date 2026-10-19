#!/usr/bin/env node
/* THE AURA OF THE ONE YOU CONTROL (ANIMATION, 10/19; rule 120(c)).

   PAOLO 10/18: "when you're controlling a person, there should be some aura... fifth dimension, electric Amalgamation
   vibes, analog horror... I need to be able to see that more when I'm in control of a character... around that character
   even on the big map, not just a portrait." His older NO stands beside it: the blue and orange lines round people in
   the lit fight (10/17) -- NEVER A COLOURED OUTLINE.

   THREE CANDIDATES in one module (slices/vote/ANIMATION_THE_AURA.js): A THE ECHO, B THE TEAR, C THE CURRENT. This gate
   draws every one of them round the rig's poncho crewman in all eight facings, the same module and the same draw calls
   the fight and the map use, and asks the things his words and the laws make measurable:
     1. HE CAN SEE IT: on the first slot of every beat of the bar, in every facing, the aura shows at least twice the
        pixels of the gaffer tape that marks his tile today (the mark he said does not tell him), and never swallows him.
     2. HELD LIKE STOP-MOTION (rule 115(d), CRASHBOX): two times inside one twelfth of a second draw the same picture,
        and the bar still holds several different pictures (it moves on the grid, not between).
     3. NEVER AN OUTLINE: the pixels it changes do not hug his silhouette: what it changes in the thin ring just outside
        him is weighed against what it changes a few pixels further out; a ring that is changed close and not beyond is
        an outline. A planted outline must fail.
     4. NO LOUD COLOUR, NO PURPLE: every colour it adds that the picture without it did not already hold is a quiet
        one (saturation at most 0.35), and none is purple (PURPLE RESERVATION 7/10: the Amalgamation's alone; its
        ambiguity is a look, never a word). A planted purple echo must fail.
     5. THE RIG'S LOOK ON THE SCREEN: the module uses no filter, no composite mode, no blur, no glow, no gradient and
        no see-through wash (the horror reading's R8 and R10; rule 114: no glow, no blur, no gradients).
     6. EIGHT DIRECTIONS (rule 107): the echo walks along his facing and the current is a different render per facing,
        so opposite facings do not draw the same aura (the tear tears along the screen's rows, so it is held to claim 1
        in every facing and not asked to turn).
     7. NOTHING IN THE GAME BEFORE HIS FINAL (rule 100): the fight, the demo, the map and the alpha do not load it.
     8. THE CLIPS ARE THE REAL FIGHT AT THE BEAT: three clips, 48 pictures each, two bars to the millisecond, and the
        same crop with no aura beside them; the row is in the registry with its twin.
   A planted unheld aura (moving between slots) must fail claim 2.            ANIMATION 10/19 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const VOTE = path.join(ROOT, 'slices', 'vote');
const MOD = path.join(VOTE, 'ANIMATION_THE_AURA.js');
const ID = 'animation-the-aura-of-the-one-you-control-10-19';

let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '\n         ' + why : ''))); };
const done = () => { console.log('\nTHE AURA OF THE ONE YOU CONTROL GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---- the source, read without a browser ---- */
const src = fs.readFileSync(MOD, 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const BANNED = /\bfilter\b|globalCompositeOperation|shadowBlur|shadowColor|globalAlpha|createLinearGradient|createRadialGradient|\bblur\(/;
const looksClean = s => !BANNED.test(s);
ok('5. the module draws with no filter, composite mode, blur, glow, gradient or see-through wash', looksClean(code), (code.match(BANNED) || [])[0]);
ok('5. MUTATION: a planted glow (shadowBlur) is caught by the same read', !looksClean(code + '\ng.shadowBlur = 8;'));
/* 7, AMENDED 10/19 by his YES on B (rule 121(f): 'combat only... I'm fucking with the tear'; COMBAT [the tear and the floor]):
   the fight loads the module and draws THE TEAR only; the demo, the map and the alpha never load it (never on the map) */
{ const fs_ = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html'), 'utf8'), kinds = (fs_.match(/BOHEMIA_AURA\.draw\('(\w+)'/g) || []);
  ok('7. BOHEMIA_FIGHT.html loads the aura and draws the tear and nothing else (his YES on B, combat only)', /ANIMATION_THE_AURA\.js/.test(fs_) && kinds.length > 0 && kinds.every(k => /'tear'/.test(k)), kinds.join(' ')); }
for (const f of ['BOHEMIA_DEMO.html', 'BOHEMIA_CITY_WORLD.html', 'BOHEMIA_ALPHA_0_9.html']) {
  const p = path.join(ROOT, 'slices', f);
  ok('7. ' + f + ' does not load the aura (rule 121(f): combat only, never on the map)', fs.existsSync(p) && !/BOHEMIA_AURA|ANIMATION_THE_AURA/.test(fs.readFileSync(p, 'utf8')));
}

/* ---- the clips, read by Pillow ---- */
const clipInfo = cp.spawnSync('python3', ['-c', `
import json,sys
from PIL import Image
out={}
for k in ['ECHO','TEAR','CURRENT']:
    p='${VOTE}/ANIMATION_THE_AURA_CLIP_%s.webp'%k
    try:
        im=Image.open(p); n=0; ms=0
        while True:
            im.load(); ms+=im.info.get('duration',0); n+=1
            try: im.seek(im.tell()+1)
            except EOFError: break
        out[k]=[n,ms,im.size]
    except Exception as e: out[k]=str(e)
print(json.dumps(out))`], { encoding: 'utf8' });
let clips = {}; try { clips = JSON.parse(clipInfo.stdout); } catch (e) { clips = { err: clipInfo.stderr }; }
for (const k of ['ECHO', 'TEAR', 'CURRENT']) {
  const c = clips[k];
  /* 48 slots of a twelfth of a second; the encoder merges a pose held over two slots into one picture shown twice as long */
  ok('8. the ' + k + ' clip is two bars of the real fight: 4000 ms in 12 to 48 held pictures (' + JSON.stringify(c) + ')', Array.isArray(c) && c[0] >= 12 && c[0] <= 48 && Math.abs(c[1] - 4000) <= 2);
}
ok('8. the same crop with no aura sits beside them (the twin)', fs.existsSync(path.join(VOTE, 'ANIMATION_THE_AURA_NONE.png')));
{ const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const row = reg.items.find(i => i.id === ID);
  ok('8. the row ' + ID + ' is in the registry, its page and its twin on disk',
    !!row && fs.existsSync(path.join(ROOT, 'slices', row.show.src)) && !!row.twin && fs.existsSync(path.join(ROOT, 'slices', row.twin.src))); }

/* ---- the drawing, in a browser, the module's own calls ---- */
const HARNESS = async () => {
  const A = window.BOHEMIA_AURA, E = window.AURA_EIGHT, T = window.AURA_CURRENT;
  const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = s; });
  const man = await load(E.src), ground = await load(E.ground);
  if (T) { const sh = await load(T.src || 'ANIMATION_THE_AURA_CURRENT.webp'); if (!sh) return { err: 'the current sheet did not load' }; }
  const W = 100, H = 160, X = 50, FEET = 140, cw = E.cell[0], ch = E.cell[1];
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return g; };
  const frameOf = (f) => { const i = E.facings.indexOf(f), org = E.origin[f];
    return { img: man, sx: i * cw, sy: 0, sw: cw, sh: ch, dx: X - org[0], dy: FEET - org[1], dw: cw, dh: ch }; };
  /* a planted fake for the mutations: same calls, drawn by the harness */
  const FAKES = {
    outline: (layer, g, o, sil) => { if (layer !== 'front') return; g.fillStyle = A.cold[4];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (sil.ring1[y * W + x]) g.fillRect(x, y, 1, 1); },
    purple: (layer, g, o) => { if (layer !== 'behind') return; g.fillStyle = '#7a2fa8'; g.fillRect(o.X - 30, o.feet - 110, 18, 90); },
    unheld: (layer, g, o) => { if (layer !== 'behind') return; g.fillStyle = A.cold[3]; g.fillRect(o.X - 40 + Math.floor(o.t / 10) % 20, o.feet - 80, 6, 60); } };
  const render = (kind, f, t, sil) => {
    const g = mk(); g.drawImage(ground, 0, 0); const fr = frameOf(f);
    const o = { k: 1, X: X, feet: FEET, frame: fr, face: f, t: t, beat: 500, size: 'fight' };
    const draw = (layer) => { if (!kind) return; if (FAKES[kind]) FAKES[kind](layer, g, o, sil); else A.draw(kind, layer, g, o); };
    draw('behind'); g.drawImage(man, fr.sx, 0, cw, ch, fr.dx, fr.dy, cw, ch); draw('front');
    return g.getImageData(0, 0, W, H).data;
  };
  const silOf = (f) => { const g = mk(); const fr = frameOf(f); g.drawImage(man, fr.sx, 0, cw, ch, fr.dx, fr.dy, cw, ch);
    const a = g.getImageData(0, 0, W, H).data, m = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) m[i] = a[i * 4 + 3] > 127 ? 1 : 0;
    const dil = (src, r) => { const o = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (src[y * W + x])
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const u = x + dx, v = y + dy; if (u >= 0 && v >= 0 && u < W && v < H) o[v * W + u] = 1; } return o; };
    const d2 = dil(m, 2), d5 = dil(m, 5), ring1 = new Uint8Array(W * H), ring2 = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) { ring1[i] = d2[i] && !m[i]; ring2[i] = d5[i] && !d2[i]; }
    return { m, ring1, ring2 }; };
  const diff = (a, b) => { const c = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) c[i] = (a[i * 4] !== b[i * 4] || a[i * 4 + 1] !== b[i * 4 + 1] || a[i * 4 + 2] !== b[i * 4 + 2]) ? 1 : 0; return c; };
  const sat = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx ? (mx - mn) / mx : 0; };
  const hue = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return 0;
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; return h < 0 ? h + 360 : h; };
  /* the module loads the current's sheet on its first draw: draw once and let it arrive before anything is measured */
  render('current', 'S', 5, null); await new Promise(r => setTimeout(r, 500));
  const per = 500 / 6, R = {};
  const study = (kind) => {
    const r = { seenMin: 1e9, seenMax: 0, held: true, distinct: 0, outline: 0, loud: 0, purple: 0, added: 0, masks: {} };
    for (const f of E.facings) {
      const sil = silOf(f), none = render('', f, 5, sil), colours = new Set();
      for (let i = 0; i < W * H; i++) colours.add((none[i * 4] << 16) | (none[i * 4 + 1] << 8) | none[i * 4 + 2]);
      const pics = new Set(); let hugSum = 0, n = 0;
      for (let s = 0; s < 24; s++) {
        const a = render(kind, f, s * per + 4, sil), b = render(kind, f, s * per + per - 4, sil);
        if (diff(a, b).some(v => v)) r.held = false;
        let key = 0; for (let i = 0; i < a.length; i += 37) key = (key * 31 + a[i]) | 0; pics.add(key);
        const c = diff(a, none); let changed = 0, h1 = 0, h2 = 0, n1 = 0, n2 = 0;
        for (let i = 0; i < W * H; i++) {
          if (sil.ring1[i]) { n1++; if (c[i]) h1++; } if (sil.ring2[i]) { n2++; if (c[i]) h2++; }
          if (!c[i]) continue; changed++;
          const p = (a[i * 4] << 16) | (a[i * 4 + 1] << 8) | a[i * 4 + 2];
          if (colours.has(p)) continue;
          r.added++; const S = sat(a[i * 4], a[i * 4 + 1], a[i * 4 + 2]), Hh = hue(a[i * 4], a[i * 4 + 1], a[i * 4 + 2]);
          if (S > 0.35) r.loud++; if (S > 0.12 && Hh >= 255 && Hh <= 320) r.purple++;
        }
        if (s % 6 === 0) { const share = changed / (W * H); r.seenMin = Math.min(r.seenMin, share); r.seenMax = Math.max(r.seenMax, share); }
        if (s === 0) r.masks[f] = c;
        if (changed) { hugSum += Math.max(0, h1 / Math.max(1, n1) - h2 / Math.max(1, n2)); n++; }
      }
      r.distinct = Math.max(r.distinct, pics.size);
      r.outline = Math.max(r.outline, n ? hugSum / n : 0);
    }
    const same = (p, q) => { let d = 0, u = 0; for (let i = 0; i < W * H; i++) { if (p[i] || q[i]) u++; if (p[i] !== q[i]) d++; } return u ? d / u : 0; };
    r.turns = Math.min(same(r.masks.E, r.masks.W), same(r.masks.N, r.masks.S));
    delete r.masks; return r;
  };
  for (const k of A.kinds.concat(['outline', 'purple', 'unheld'])) R[k] = study(k);
  return R;
};

(async () => {
  let pw; try { pw = require('/opt/node22/lib/node_modules/playwright'); } catch (e) { pw = require('playwright'); }
  const http = require('http');
  const server = http.createServer((q, s) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'Content-Type': /\.js$/.test(f) ? 'text/javascript' : /\.html$/.test(f) ? 'text/html' : /\.webp$/.test(f) ? 'image/webp' : 'image/png' }); fs.createReadStream(f).pipe(s); });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const br = await pw.chromium.launch(); const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.setContent('<!doctype html><body></body>');
  await pg.goto('http://127.0.0.1:' + server.address().port + '/slices/vote/ANIMATION_THE_AURA.html');
  await pg.waitForTimeout(500);
  const R = await pg.evaluate(HARNESS);
  await br.close(); server.close();
  ok('the VOTE page loads its module with no page error (' + (errs[0] || 'none') + ')', errs.length === 0);
  if (R.err) { ok('the harness ran (' + R.err + ')', false); return done(); }
  const f2 = x => (100 * x).toFixed(1) + '%';
  /* THE FLOOR IS THE MARK IT JOINS: today the only thing that says which man is his is the gaffer tape on his tile's
     corners, measured on the filmed fight at its opening zoom: 126 px round the poncho crewman's tile (css px; the man is
     drawn at 1.02 css px an art pixel, so the harness's art pixels compare one to one). He said he cannot feel which man
     is his with it, so on every beat, in every facing, the aura shows at least TWICE that: 252 px of a 100 x 160 cell. */
  const TAPE = 126, CELL = 100 * 160, FLOOR = 2 * TAPE / CELL;
  for (const k of ['echo', 'tear', 'current']) {
    const r = R[k];
    ok('1. ' + k + ': he can see it on every beat in all eight facings (the least it changes on a beat ' + Math.round(r.seenMin * CELL) + ' px, at least twice the tape corners, ' + 2 * TAPE + ') and it never swallows his cell (most ' + f2(r.seenMax) + ', at most 45%)',
      r.seenMin >= FLOOR && r.seenMax <= 0.45);
    ok('2. ' + k + ': held like stop-motion: one picture inside each twelfth of a second, ' + r.distinct + ' different pictures across the bar (at least 4)', r.held && r.distinct >= 4);
    ok('3. ' + k + ': never an outline (how much more it changes hugging his silhouette than a few pixels out: ' + f2(r.outline) + ', at most 25%)', r.outline <= 0.25);
    ok('4. ' + k + ': no loud colour added (' + r.loud + ' of ' + r.added + ' added pixels over 0.35 saturation, at most 1%) and no purple (' + r.purple + ')',
      r.loud <= Math.max(2, r.added * 0.01) && r.purple === 0);
    /* the tear is the picture's, not his body's: a tape tears along the screen's rows whichever way he faces, so it
       answers eight directions by claim 1 (it shows in every facing) and is not asked to turn */
    if (k !== 'tear') ok('6. ' + k + ': opposite facings draw different auras (' + f2(r.turns) + ' of the changed pixels differ, at least 30%)', r.turns >= 0.3);
  }
  ok('3. MUTATION: a planted outline (one pale ring hugging him) is caught (' + f2(R.outline.outline) + ')', R.outline.outline > 0.25);
  ok('4. MUTATION: a planted purple echo is caught (' + R.purple.purple + ' purple pixels)', R.purple.purple > 0);
  ok('2. MUTATION: a planted aura that moves between slots is caught', !R.unheld.held);
  done();
})().catch(e => { console.error(e); process.exit(1); });
