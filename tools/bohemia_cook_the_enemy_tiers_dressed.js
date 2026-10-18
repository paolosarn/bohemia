/* COOK: THE ENEMY TIERS DRESSED (10/9/26, CHARACTER, [the enemy tiers dressed])
 *
 * Rule 69 (all the character art is live in the game, the new fight included) and COMBAT's
 * own [the enemy math] (10/5): the six named brigand tiers (thug, poacher, marksman, raider,
 * leader, marauder) already draw from a faction-band pairing COMBAT wrote as a DRAFT, citing
 * his own words ("thugs in the poorer crews, the raider in the Mob or the Cartel... the
 * armoured marauder the Remnants or the Blues, the shooters the Network or the Colorful, the
 * poacher the Volunteers or the Caravans, the one leader the Church"). records/target/bb/
 * ours.json, key people_looks.band. REUSE-FIRST: that pairing is NOT reinvented here, it is
 * READ and shown, one representative faction per tier (the pool's first entry).
 *
 * WHAT WAS STILL MISSING, AND IS THIS LANE'S OWN TO ADD: nothing in the pairing told you
 * which tier is the LIGHT one and which is the HEAVY one just from the faction alone -- a
 * faction look is a silhouette, not an armour class. enemies.json's own body-armour ranges
 * say so in numbers (thug 5-70, poacher 20, marksman 20-70, raider 55-110, leader 90-210,
 * marauder 140-255). So the three light tiers (thug, poacher, marksman) stay exactly their
 * faction's own canon look, UNCHANGED. The raider and the marauder, the two that need to
 * read armed, get pieces from this lane's own [attachments] row (shipped 9/29), each picked
 * to land on an EMPTY slot (REUSE-FIRST's own rule from that row: never collide with a
 * faction's existing coat):
 *   RAIDER (Mob, no outer slot today)       + STORM VEST, a grey inside Mob's own charcoal
 *                                             palette, nothing new entering the look
 *   MARAUDER (Remnants, no back slot today) + CHARCOAL ROAD CAPE + STEEL SPIKED PAULDRON
 *
 * THE LEADER STAYS UNCHANGED ON PURPOSE, AND A FIRST TRY SAID OTHERWISE. The first pass also
 * gave the leader a vest, the same piece as the raider -- QUILTED VEST's own warm tan, not
 * tied to either faction, made the two heaviest-armoured tiers look like two men in the same
 * borrowed coat, exactly the kind of collision this lane's own [attachments] work flagged
 * before. Caught by looking at the picture, not assumed: the leader's own gold mantle is
 * already what tells him apart (colour reads as command), and the same vest the raider wears
 * erased that. Dropped. The raider's vest colour was also re-picked to match its own faction
 * instead of leaving the generator's default on two different men.
 *
 * SO THE ESCALATION IS MEASURABLE, NOT JUST LOOKED AT: zero pieces (thug, poacher, marksman,
 * leader) -> one piece (raider) -> two pieces (marauder), and the silhouette-collapse ruler
 * this lane always uses confirms none of the six read as the same body twice.
 *
 * RIG CHECK: renders only, the same shoot()/profile() harness this lane's attachments tool
 * used, G_WORN/G.equipped/G.bodyVar/G.age restored after.
 *
 * REFERENCE CHECK: no new pixel; every garment and every faction look is already canon and
 * already judged. The dressing table (which tier gets which faction and which attachment) is
 * the new thing, and it is numbers and a picture, not art.
 *
 *   node tools/bohemia_cook_the_enemy_tiers_dressed.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ENEMY_TIERS_DRESSED.html');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_ENEMY_TIERS_DRESSED_10_9_26.txt');
const OURS = path.join(REPO, 'records/target/bb/ours.json');
const ENEMIES = path.join(REPO, 'records/target/bb/enemies.json');
const GROUND = { road: '#33333c', walk: '#8a8478', kerb: '#3f3f47' };

const ours = JSON.parse(fs.readFileSync(OURS, 'utf8'));
const band = ours.people_looks.value.band;
const enemyRows = JSON.parse(fs.readFileSync(ENEMIES, 'utf8')).rows;
function bodyRangeOf(tierId) {
  const row = enemyRows.find(r => r.id === tierId);
  return row ? row.armor_body : null;
}

/* THE SIX, IN THE ROW'S OWN ORDER, EACH POINTING AT THE REAL BAND POOL (ours.json), NEVER
   A FACTION INVENTED HERE. The pool's first entry is the one shown. */
const TIERS = [
  { id: 'brigand_thug', label: 'THUG', faction: band.brigand_thug[0], add: {} },
  { id: 'brigand_poacher', label: 'POACHER', faction: band.brigand_poacher[0], add: {} },
  { id: 'brigand_marksman', label: 'MARKSMAN', faction: band.brigand_marksman[0], add: {} },
  { id: 'brigand_raider', label: 'RAIDER', faction: band.brigand_raider[0], add: { outer: 'STORM VEST' } },
  { id: 'brigand_leader', label: 'LEADER', faction: band.brigand_leader[0], add: {} },
  { id: 'brigand_marauder', label: 'MARAUDER', faction: band.brigand_marauder[0],
    add: { back: 'CHARCOAL ROAD CAPE', gear: 'STEEL SPIKED PAULDRON' } }
];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ TIERS }) => {
    const o = { rows: [], err: null };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };

    const profile = (fr) => {
      const rows = new Array(fr.CH).fill(0); let top = 1e9, bot = -1;
      for (let i = 0; i < fr.px.length; i++) { if (!fr.px[i]) continue;
        const y = (i / fr.CW) | 0; rows[y]++; if (y < top) top = y; if (y > bot) bot = y; }
      const span = Math.max(1, bot - top), wide = Math.max.apply(null, rows) || 1;
      const prof = []; for (let k = 0; k < 16; k++) prof.push(rows[Math.min(fr.CH - 1, top + Math.round(span * k / 15))] / wide);
      return prof;
    };
    const dist = (a, c) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - c[i]); return s / a.length; };

    const shoot = (dials, worn, age, dir) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(dials || {})); G.age = age || 'adult';
      rebuildFromRig(); clear();
      return buildFrame(dir, 'idle', 0);
    };
    const toPNG = (fr) => {
      const cv = document.createElement('canvas'); cv.width = fr.CW; cv.height = fr.CH;
      const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(fr.CW, fr.CH), d = im.data;
      for (let i = 0; i < fr.px.length; i++) { const q = fr.px[i]; if (!q) continue;
        d[i*4] = q[0]; d[i*4+1] = q[1]; d[i*4+2] = q[2]; d[i*4+3] = 255; }
      g2.putImageData(im, 0, 0); return cv.toDataURL('image/png');
    };

    try {
      for (const t of TIERS) {
        const faceName = t.faction.replace('faction_', '');
        const f = FACTION_LOOKS.filter(x => x.faction.toLowerCase() === faceName.toLowerCase())[0];
        if (!f) { o.err = 'no faction for ' + t.faction; break; }
        const worn = Object.assign({}, f.worn, t.add);
        const fr = shoot(f.dials, worn, f.age, 'S');
        o.rows.push({ id: t.id, label: t.label, faction: f.faction, pieces: Object.keys(t.add).length,
          added: Object.values(t.add), png: toPNG(fr), prof: profile(fr) });
      }
      if (o.rows.length === TIERS.length) {
        let worst = Infinity;
        for (let i = 0; i < o.rows.length; i++)
          for (let j = i + 1; j < o.rows.length; j++)
            worst = Math.min(worst, dist(o.rows[i].prof, o.rows[j].prof));
        o.crossDist = worst;
      }
    } catch (e) { o.err = String(e && e.message || e); }
    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { TIERS });
  await b.close();

  if (R.err) { console.error('THREW: ' + R.err); process.exit(3); }
  if (R.crossDist !== undefined && R.crossDist < 0.02) {
    console.error('REFUSING TO WRITE: two tiers read as the same body, ' + R.crossDist.toFixed(4));
    process.exit(4);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const L = [];
  L.push('THE ENEMY TIERS DRESSED -- CHARACTER, 10/9/26, [the enemy tiers dressed], rule 69');
  L.push('');
  L.push('COMBAT already wrote which faction each brigand tier wears, as a draft, quoting his own');
  L.push('words (ours.json, people_looks.band). That pairing is read here, not reinvented:');
  TIERS.forEach(t => L.push('  ' + t.label.padEnd(10) + t.faction.replace('faction_', '').toUpperCase()
    + (t.add && Object.keys(t.add).length ? '  + ' + Object.values(t.add).join(' + ') : '  (unchanged)')));
  L.push('');
  L.push('WHAT THIS ROUND ADDS: enemies.json gives each tier a real body-armour range. The four');
  L.push('light ones (thug 5-70, poacher 20, marksman 20-70, and the leader at 90-210 -- heavy on');
  L.push('paper but already read by his own gold mantle) stay their faction\'s own canon look.');
  L.push('The raider and the marauder get pieces from this lane\'s own [attachments] row, picked');
  L.push('to land on a slot each faction leaves empty today, so nothing collides with a coat');
  L.push('already worn:');
  TIERS.filter(t => Object.keys(t.add).length).forEach(t => {
    const bd = bodyRangeOf(t.id);
    L.push('  ' + t.label + ': enemies.json armor_body ' + JSON.stringify(bd)
      + ' -- added ' + Object.values(t.add).join(' + ') + '.');
  });
  L.push('');
  L.push('A BAD FIRST TRY, CAUGHT BY LOOKING AT THE PICTURE: the leader first wore the same');
  L.push('QUILTED VEST as the raider, and the two heaviest tiers read as one man in a borrowed');
  L.push('coat. Dropped the leader\'s vest (his gold mantle already says command) and re-picked');
  L.push('the raider\'s vest to a grey that sits inside Mob\'s own charcoal palette instead of');
  L.push('the generator\'s default. Different cues for a different role, not just \'more cloth\'.');
  L.push('');
  L.push('ONE MORE THING LEFT HONEST, NOT HIDDEN: the raider still reads mostly mustard and the');
  L.push('leader still reads mostly gold, because that is each faction\'s own ruled colour (Mob\'s');
  L.push('gold, shipped 9/13; Church\'s, shipped earlier still) and a vest, being sleeveless, does');
  L.push('not cover a long-sleeve shirt underneath -- it was never going to fully hide it, and');
  L.push('recolouring either faction to fight that would be overriding his own colour ruling,');
  L.push('which is not this lane\'s to do. What tells the two apart is everything else: Mob\'s');
  L.push('shirt-and-vest-and-charcoal-pants against Church\'s floor-length solid robe, and the');
  L.push('silhouette number below.');
  L.push('');
  if (R.crossDist !== undefined) {
    L.push('SILHOUETTE CHECK: all six tiers compared pairwise, the same 16-sample profile ruler');
    L.push('this lane always uses; the closest pair sits ' + R.crossDist.toFixed(4) + ' apart, clear of the');
    L.push('0.02 collapse floor. Six different enemies, not one costume worn six ways.');
  }
  L.push('');
  L.push('NOT HERE, ON PURPOSE: the lower_* and champion variants, and the other BB factions');
  L.push('(goblins, orcs, ancient dead...) -- rule 69\'s own brief named these six; the rest are');
  L.push('COMBAT\'s to ask for when their own fight needs them.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));

  const cells = R.rows.map(r => `
    <figure>
      <canvas id="c${r.id}" width="112" height="112"></canvas>
      <figcaption>${r.label}<br><span class="mini">${r.faction.replace('faction_','').toUpperCase()}${r.added.length ? ' + ' + r.added.join(' + ') : ''}</span></figcaption>
    </figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8">
<title>THE ENEMY TIERS DRESSED</title>
<style>
  :root{ --road:${GROUND.road}; --walk:${GROUND.walk}; --kerb:${GROUND.kerb}; }
  html,body{ margin:0; background:#1b1b20; color:#d8d2c4;
    font:13px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .wrap{ padding:16px; max-width:900px; }
  h1{ font-size:19px; margin:0 0 8px; letter-spacing:.5px; }
  p.sub{ margin:0 0 16px; line-height:1.5; }
  .street{ background:var(--walk); padding:10px 0; }
  .road{ background:var(--road); display:flex; gap:18px; padding:14px; flex-wrap:wrap; }
  figure{ margin:0; text-align:center; }
  canvas{ width:140px; height:140px; image-rendering:pixelated; display:block; background:var(--road); }
  figcaption{ font-size:11px; padding:6px 0 0; }
  .mini{ font-size:9px; opacity:.7; }
  .beat{ margin:16px 0 0; font-size:11px; opacity:.8; line-height:1.6; }
</style>
<div class="wrap">
  <h1>THE ENEMY TIERS DRESSED</h1>
  <p class="sub">six brigand tiers, each in the faction combat already picked for it. thug,
  poacher, marksman and the leader stay their faction's own canon look, unchanged -- the
  leader's own gold mantle already reads as command. the raider carries one new piece, a
  vest in mob's own grey. the marauder carries two, a cape and a spiked pauldron, the
  heaviest of the six, matching enemies.json's own numbers.</p>
  <div class="street"><div class="road">${cells}</div></div>
  <p class="beat">not shown: the lower_* and champion variants, and every non-brigand faction --</p>
  <p class="beat">this round answers rule 69's own six names; the rest is combat's to ask for.</p>
</div>
<script>
const FRAMES = ${JSON.stringify(R.rows.map(r => ({ id: r.id, png: r.png })))};
FRAMES.forEach(f => {
  const cv = document.getElementById('c' + f.id), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0); im.src = f.png;
});
</script>`;
  fs.writeFileSync(PAGE, html);
  console.log('\nWROTE ' + path.relative(REPO, PAGE));
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));
})();
