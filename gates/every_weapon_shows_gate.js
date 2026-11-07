/* EVERY WEAPON SHOWS (WEAPONS, rule 424(a), ask line 489; Paolo 11/7: 'some two handed weapons aren't showing up... we need more
   one-handed weapons'). The whole weapons list, every row of records/target/bb/weapons.json, and every shield of armor.json, is put
   in a man's hands and the gate asks the PICTURES what was drawn, never a table's say-so:
     D  THE DATA: by the fight's own lookups (meleeProp: bow, sling, two hands by row then class, one hand by row then class; a gun by
        its class in the guns grid; a shield by its row) every row names a picture, and YOU's sheets hold that picture on the
        standing key of its hold (the low ready, the two-handed idle, the bow's idle, the shield arm's idle). MEASURED BEFORE: the five
        two-handed swords, the three two-handed flails and the four two-handed cleavers named nothing (two_by_class had no sword,
        flail or cleaver), so the fight drew them swung from empty fists.
     F  THE FIGHT, IN THE DEMO: a road fight through the game's own door (the demo, its fight frame); two of his men of two looks;
        for every row and every shield (on a pipe), the fight's own draw of the man (blitMan) is watched call by call on its
        canvas, eight facings: the row's own thing is DRAWN (a cell of that prop off a props sheet, or a gun's sheet for a gun)
        in at least three facings (a thing may be behind him facing away). A row whose picture is missing fails BY NAME.
     C  THE CREW SCREEN, IN THE DEMO: the crew screen opened from the map the way the bar opens it; for every row and every
        shield the card's own figure (the same functions its loop draws with) holds that thing in at least three of eight turns;
        and on the glass: a man handed the golf club stands on his card with it in his fists.
     D5 NO CHEAP ROUTE (rule 424(c)): no picture is held one-handed by one row and two-handed by another.
     MUTATIONS (the gate must bite, planted in the live pages and taken back): the sword's two-handed picture taken out of the
     index (the five swords must go red, in the data, the fight and the crew screen); the tire iron's row and its class's fallback
     taken out (the tire iron must go red).
     R  AT A REAL SIZE (rule 426(c), his 'Too tiny' on the pistol card): in the same fight, every row's thing as drawn is at least
        0.85 of its real length on the rig's ruler (a hanging cord 0.6), and THE PISTOL at least a forearm; planted: the pistol put
        back to the old class pistol goes red.
     M  THE MAP (a note, not a leg yet): the map's men are drawn from their own walk sheets and hold nothing; counted, not judged
        (handoffs/WEAPONS.md: the map's own render is the next round).
   node gates/every_weapon_shows_gate.js            (all legs)
   node gates/every_weapon_shows_gate.js --quick    (the data leg only, no browser) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const QUICK = process.argv.includes('--quick');
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined && !ok ? '  [' + why + ']' : '')); };
const note = s => console.log('  note ' + s);
const done = () => { console.log('\nEVERY WEAPON SHOWS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const MIN_FACINGS = 3;

/* ------------------------------------------------------------------------------------------------ D the data */
const W = J('records/target/bb/weapons.json').rows, SH = J('records/target/bb/armor.json').shields;
const OURS = J('records/target/bb/ours.json'), FR = J('slices/fight_rig/fight_rig.json');
const GUN_CLASSES = OURS.gun_classes.value;
const bothHands = b => b.hands === 2 || ((b.hands === null || b.hands === undefined) && ['bow', 'crossbow', 'firearm'].indexOf(b.class) >= 0);
/* the fight's meleeProp, its gunSheet's class and its shieldProp, over the shipped index: [kind, picture, the standing clip] */
function pictureOf(b, M) {
  if (GUN_CLASSES.indexOf(b.class) >= 0) { const g = FR.guns.by_class[b.class]; return g ? ['gun', g, null] : ['gun', null, null]; }
  const bq = (M.bow_by_row || {})[b.id] || (M.bow_by_class || {})[b.class]; if (bq) return ['bow', bq, 'BIdle'];
  const sq = (M.sling_by_row || {})[b.id]; if (sq) return ['one', sq, 'PIdle'];
  if (bothHands(b)) return ['two', (M.two_by_row || {})[b.id] || (M.two_by_class || {})[b.class] || null, 'T2Idle'];
  return ['one', (M.by_row || {})[b.id] || (M.by_class || {})[b.class] || null, 'PIdle'];
}
function dataMisses(M, Y) {
  const miss = [];
  W.forEach(b => {
    const [kind, q, clip] = pictureOf(b, M);
    if (!q) { miss.push(b.id + ' (' + kind + ', ' + b.class + '): no picture named'); return; }
    if (kind === 'gun') return;
    const by = Y.props.by[q], c = by && by[clip];
    if (!c || !c.k || !c.k.some(row => row.filter(x => x !== null && x !== undefined).length >= MIN_FACINGS)) miss.push(b.id + ': ' + q + ' has no picture on ' + clip + ' in YOU\'s sheets');
  });
  SH.forEach(s => {
    const q = (M.shield_by_row || {})[s.id];
    if (!q) { miss.push(s.id + ' (shield): no picture named'); return; }
    const c = Y.props.by[q] && Y.props.by[q].SIdle; if (!c) miss.push(s.id + ': ' + q + ' has no SIdle picture');
  });
  return miss;
}
const MI = J('slices/rig_melee/rig_melee.json'), YOU = J('slices/rig_melee/you.json');
const dm = dataMisses(MI, YOU);
leg(dm.length === 0, 'D1 every one of the ' + W.length + ' weapon rows and ' + SH.length + ' shields names a picture the fight draws, and YOU\'s sheets hold it on the standing key of its hold', dm.slice(0, 8).join('; ') + (dm.length > 8 ? ' ... ' + dm.length + ' in all' : ''));
const two = W.filter(b => bothHands(b) && GUN_CLASSES.indexOf(b.class) < 0 && ['bow'].indexOf(b.class) < 0);
const twoCls = [...new Set(two.map(b => b.class))].sort();
leg(twoCls.every(c => (MI.two_by_class || {})[c] || two.filter(b => b.class === c).every(b => (MI.two_by_row || {})[b.id] || (MI.sling_by_row || {})[b.id])),
  'D2 every class with a two-handed row has a two-handed picture of its own (' + twoCls.join(', ') + ')', twoCls.filter(c => !(MI.two_by_class || {})[c] && !two.filter(b => b.class === c).every(b => (MI.two_by_row || {})[b.id] || (MI.sling_by_row || {})[b.id])).join(', '));
{ const M2 = JSON.parse(JSON.stringify(MI)); delete M2.two_by_class.sword; const m = dataMisses(M2, YOU), sw = ['rhomphaia', 'warbrand', 'longsword', 'greatsword', 'executioner_s_sword'];
  leg(sw.every(id => m.some(x => x.startsWith(id + ' '))), 'D3 MUTATION: the sword\'s two-handed picture taken out of the index, the five two-handed swords go red', m.join('; ')); }
{ const M2 = JSON.parse(JSON.stringify(MI)); delete M2.by_row.tire_iron; delete M2.by_class.mace; const m = dataMisses(M2, YOU);
  leg(m.some(x => x.startsWith('tire_iron ')), 'D4 MUTATION: the tire iron\'s row and its class\'s fallback taken out, the tire iron goes red', m.slice(0, 3).join('; ')); }
/* D5 NO CHEAP ROUTE (rule 424(c), ask line 515, Paolo 11/7: 'you have like a one-handed variation, a two-handed variation, and I
   think that's a pretty cheap escape route'): no picture is held one-handed by one row and two-handed by another */
const bothWays = M => { const one = new Set(), two = new Set();
  W.forEach(b => { const [kind, q] = pictureOf(b, M); if (!q || kind === 'gun' || kind === 'bow') return; (kind === 'two' ? two : one).add(q); });
  return [...one].filter(q => two.has(q)); };
leg(bothWays(MI).length === 0, 'D5 NO CHEAP ROUTE: no picture is held one-handed by one row and two-handed by another (one object at two sizes)', bothWays(MI).join(', '));
{ const M2 = JSON.parse(JSON.stringify(MI)); M2.two_by_row.two_handed_mace = 'pipe';
  leg(bothWays(M2).indexOf('pipe') >= 0, 'D6 MUTATION: a two-handed mace pointed back at the one-handed pipe is caught', bothWays(M2).join(', ')); }
const OWNG = J('slices/fight_rig/own_guns.json').by_row || {};
const ONE = W.filter(b => b.hands === 1), oneSeen = new Set(ONE.map(b => GUN_CLASSES.indexOf(b.class) >= 0 ? 'gun:' + (OWNG[b.id] || 'pistol') : pictureOf(b, MI)[1] || '?'));
note('the weapons list: ' + W.length + ' rows, ' + ONE.length + ' one-handed (' + ONE.filter(b => GUN_CLASSES.indexOf(b.class) < 0).length + ' not guns), ' +
  W.filter(b => bothHands(b)).length + ' two-handed; ' + oneSeen.size + ' real one-handed objects in a man\'s fist (424(c): each its own picture, never a two-hander\'s); ' + W.filter(b => b.armory).length + ' rows of the valley\'s own');
if (QUICK) done();

/* ------------------------------------------------------------------------------------------------ F and C, in the demo */
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
async function waitFor(page, fn, ms) { const s = Date.now(); while (Date.now() - s < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; }

/* in the fight frame: every row and every shield in each man's hands, the fight's own draw watched call by call */
const FIGHT_WALK = async (args) => {
  const S = FIGHT.S, rows = DB.weapons.rows, shields = DB.armor.shields, sleep = ms => new Promise(r => setTimeout(r, ms));
  if (args.mutate === 'sword') delete MELEE.meta.two_by_class.sword;
  if (args.mutate === 'small_pistol') { const M = ownGunMeta(); if (M) Object.keys(M.by_row).forEach(r => { if (M.by_row[r] === 'dagger') delete M.by_row[r]; }); }
  S.night = false; UI.anim = [];
  const ours = S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && !v.beast && !v.machine && !v.ghost);
  let carries = {}; try { carries = R('ours.model_carries').looks || {}; } catch (e) {}
  const men = [], seen = {};
  ours.sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0)).forEach(v => { const L = lookOf(v); if (L._key === undefined) L._key = Object.keys(DB.rig.looks).filter(k => DB.rig.looks[k] === L)[0] || null;
    const k = L._key || v.look; if (!seen[k] && !carries[k] && men.length < 2) { seen[k] = 1; men.push(v); } });
  if (!men.length) return { err: 'nobody of his on the field' };
  const keep = men.map(v => ({ w: v.weapon, s: v.shield, sb: v.shieldBack, f: v._face }));
  /* his facing held while he is drawn: the fight turns a standing man a notch toward his nearest foe a beat after his last turn
     (turnTo), which raced the facing this walk sets (COOK's pistol proof met the same) */
  const keepTurn = turnTo; turnTo = function () {};
  const orig = cx.drawImage; let LOG = null;
  cx.drawImage = function (img) { if (LOG) LOG.push([String((img && (img.src || (img.base && img.base.src))) || ''), arguments[1], arguments[2], arguments[3], arguments[4], img]); return orig.apply(this, arguments); };
  const base = s => s.split('?')[0].split('/').slice(-2).join('/');
  /* every props sheet's cells, by file and place: the prop it is (every melee look loaded so far) */
  const CELL = {}, RUN_ = Math.random();   /* each walk indexes afresh (a second walk in the same page found every look marked done and an empty index) */
  const index = () => { Object.keys(MELEE.looks).concat(['you']).forEach(k => { const d = k === 'you' ? meleeLook('you') : MELEE.looks[k] && MELEE.looks[k].d; if (!d || !d.props || d._indexed === RUN_) return;
    Object.keys(d.props.by).forEach(q => Object.keys(d.props.by[q]).forEach(c => { const pk = d.props.by[q][c], sh = d.props.sheets[pk.l]; if (!sh) return;
      (pk.k || []).forEach(row => (row || []).forEach(ix => { if (ix === null || ix === undefined) return; const cl = sh.cells[ix]; CELL['rig_melee/' + sh.file + '|' + cl[0] + '|' + cl[1]] = q; })); }));
    d._indexed = RUN_; }); };
  const what = e => { const f = base(e[0]); if (/_guns\.webp$|own_guns\//.test(f)) return 'gun'; return CELL[f + '|' + e[1] + '|' + e[2]] || null; };
  const arm = (v, row, sh) => { v.weapon = row ? (FIGHT._t.pistolShot(row) || row) : null; v.shield = sh || null; v.shieldBack = null; };
  const drawOnce = (v, f, dt) => { v._face = f; const b = manBox(v.x, v.y); LOG = []; try { blitMan(v, b.x, b.feet, performance.now() + (dt || 0), 1); } catch (e) { LOG.push(['ERR ' + e.message, 0, 0]); } const l = LOG; LOG = null; return l; };
  let job = [];
  rows.forEach(r => job.push({ id: r.id, row: r, sh: null }));
  const pipe = rows.find(r => r.id === 'bludgeon');
  shields.forEach(s => job.push({ id: 'shield:' + s.id, row: pipe, sh: s }));
  if (args.only) job = job.filter(j => args.only.indexOf(j.id) >= 0);   /* a planted run asks only the rows it broke and a few it did not */
  const want = (v, j) => { if (j.sh) return shieldProp(v); if (FIGHT.isGun(v.weapon)) return 'gun'; const mp = meleeProp(v); return mp ? mp[0] : null; };
  /* two passes to load every sheet the draws ask for, then the measured one */
  const asked = () => Object.values(HOLD.ims).length + Object.keys(UI.imgs || {}).length, inn = () => Object.values(HOLD.ims).every(e => e.b);
  for (let pass_ = 0, n0 = -1; pass_ < 8; pass_++) {
    for (const v of men) for (const j of job) { arm(v, j.row, j.sh); for (let f = pass_ % 2; f < 8; f += 2) drawOnce(v, f); }
    for (let t = 0; t < 120 && !inn(); t++) await sleep(250);
    index(); const n = asked(); if (n === n0 && inn()) break; n0 = n; await sleep(1500);
  }
  /* R: how long the thing is as drawn, in the sheet's art pixels (the rig's ruler: 98 px to 1.72 m), its opaque pixels' longest
     span over 32 directions, less the cut's one-pixel rim each side; a gun's grid cell is the whole frame with only the gun on it */
  const SPAN = {}, scratch = document.createElement('canvas'), sg = scratch.getContext('2d', { willReadFrequently: true });
  const span = e => { const key = e[0] + '|' + e[1] + '|' + e[2] + '|' + e[3] + '|' + e[4]; if (SPAN[key] !== undefined) return SPAN[key];
    let r = 0; try { const w = Math.max(1, e[3] | 0), h = Math.max(1, e[4] | 0); scratch.width = w; scratch.height = h; sg.clearRect(0, 0, w, h);
      sg.drawImage(e[5], e[1], e[2], w, h, 0, 0, w, h); const d = sg.getImageData(0, 0, w, h).data, xs = [], ys = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 0) { xs.push(x); ys.push(y); }
      for (let t = 0; t < 32; t++) { const c = Math.cos(t * Math.PI / 32), sn = Math.sin(t * Math.PI / 32); let lo = 1e9, hi = -1e9;
        for (let i = 0; i < xs.length; i++) { const p = xs[i] * c + ys[i] * sn; if (p < lo) lo = p; if (p > hi) hi = p; } if (hi - lo > r) r = hi - lo; }
      r = Math.max(0, r - 2); } catch (x) { r = -1; }
    return (SPAN[key] = r); };
  const gunOf = v => { const w = v.weapon, b = w && (w.of || w); if (!b || !FIGHT.isGun(w)) return null; const M = ownGunMeta(); return (M && M.by_row[b.id]) || 'class:' + DB.rig.guns.by_class[b.class]; };
  const out = { men: men.map(v => lookOf(v)._key), rows: {}, errs: [] };
  for (const v of men) for (const j of job) {
    arm(v, j.row, j.sh); const q = want(v, j); let n = 0, len = 0;
    for (let f = 0; f < 8; f++) { const l = drawOnce(v, f); l.forEach(e => { if (e[0].startsWith('ERR')) out.errs.push(j.id + ': ' + e[0]); });
      const hit = q ? l.filter(e => what(e) === q) : []; if (hit.length) n++;
      /* the length: the same standing man a few moments on (his idle's other keys: the fight draws one key a moment) */
      /* standing in the open (a man on a cover tile kneels and holds it close: the size is read on the man standing) */
      if (q) { const kc = holdCovered; holdCovered = function () { return false; };
        try { [0, 700, 1900, 3700, 6100].forEach(dt => drawOnce(v, f, dt).filter(e => what(e) === q).forEach(e => { len = Math.max(len, span(e)); })); } finally { holdCovered = kc; } } }
    const k = lookOf(v)._key; (out.rows[j.id] = out.rows[j.id] || {})[k] = { want: q, facings: n, len: Math.round(len * 10) / 10, gun: j.sh ? null : gunOf(v) };
  }
  men.forEach((v, i) => { v.weapon = keep[i].w; v.shield = keep[i].s; v.shieldBack = keep[i].sb; v._face = keep[i].f; });
  cx.drawImage = orig; turnTo = keepTurn;
  return out;
};

/* in the crew screen: the card's own figure for every row and every shield */
const CREW_WALK = async (args) => {
  const S = BohemiaRosterScreen.state, C = window.BohemiaRoster, B = window.BohemiaIdles, sleep = ms => new Promise(r => setTimeout(r, ms));
  const X = window.BohemiaRosterWeapons; if (!X) return { err: 'the crew screen carries no __EVERY_WEAPON_SHOWS__ block' };
  const WEAP = X.state, HELD = X.held, heldMelee = X.heldMelee, weapFrame = X.weapFrame, heldGun = X.heldGun, holdFrame = X.holdFrame;
  for (let i = 0; i < 80 && !(WEAP.meta && WEAP.meta.looks && HELD.feet && HELD.hold); i++) await sleep(250);
  if (args.mutate === 'sword') delete WEAP.meta.two_by_class.sword;
  const rows = C.data.weapons.rows, shields = C.data.armor.shields, pipe = rows.find(r => r.id === 'bludgeon');
  const on = S.crew.filter(m => m && !m.dead && HELD.feet[m.look]), men = [], seen = {};
  let carries = {}; try { carries = C.data.ours.model_carries.value.looks || {}; } catch (e) {}
  on.forEach(m => { if (!seen[m.look] && !carries[m.look] && men.length < 2) { seen[m.look] = 1; men.push(m); } });
  if (!men.length) return { err: 'no man on the card with a look the fight draws' };
  let job = rows.map(r => ({ id: r.id, gear: { main: r.id, off: null } })).concat(shields.map(s => ({ id: 'shield:' + s.id, gear: { main: pipe.id, off: s.id } })));
  if (args.only) job = job.filter(j => args.only.indexOf(j.id) >= 0);
  const one = (m, j, f, now) => {
    const mm = Object.assign({}, m, { gear: Object.assign({}, m.gear, j.gear) });
    const hm = heldMelee(mm);
    if (hm) { const w = weapFrame(m.look, 'gate:' + m.name, now, f, hm); const q = j.id.startsWith('shield:') ? hm.shield : hm.prop; return { want: q, drawn: !!(w && q && w.lay.some(t => t[4] === q)), how: hm.how }; }
    const gun = heldGun(mm); if (!gun) return { want: null, drawn: false };
    if (gun === 'pistol') { const h = holdFrame(m.look, 'gate:' + m.name, now, f); return { want: 'gun', drawn: !!(h && h.gun && !h.gun.hidden) }; }
    const lk = B.has('fight_' + m.look) ? 'fight_' + m.look : m.look, q = B.frame(lk, 'gate:' + m.name, now, f, { set: 'carry' });
    const g = q && !q.person ? B.gun(lk, gun, q.pose, f) : null; return { want: 'gun', drawn: !!(g && !g.hidden) };
  };
  /* every sheet the card asks for, loaded before anything is counted: warm passes until a pass asks for nothing new and all are in */
  const ims = () => Object.values(WEAP.ims).concat(Object.values(HELD.ims || {})), ready = () => ims().every(e => e.ok);
  for (let p = 0, n0 = -1; p < 8; p++) {
    for (const m of men) for (const j of job) for (let f = 0; f < 8; f++) one(m, j, f, performance.now());
    for (let t = 0; t < 120 && !ready(); t++) await sleep(250);
    const n = ims().length; if (n === n0 && ready()) break; n0 = n; await sleep(1500);
  }
  const out = { men: men.map(m => m.look), rows: {} };
  for (const m of men) for (const j of job) { let n = 0, want = null;
    for (let f = 0; f < 8; f++) { const r = one(m, j, f, performance.now()); want = r.want; if (r.drawn) n++; }
    (out.rows[j.id] = out.rows[j.id] || {})[m.look] = { want: want, facings: n }; }
  return out;
};
const missing = R => Object.keys(R.rows).filter(id => Object.values(R.rows[id]).some(x => x.facings < MIN_FACINGS));
/* R: AT A REAL SIZE (rule 426(c), Paolo 11/7 on the pistol card: 'Too tiny'; the coordinator: 'a weapon in the hand reads at its real
   size against the man (a pistol is about a forearm's length from the grip to the muzzle's end)'). The rig's ruler: 98 px to 1.72 m.
   A thing's real length: its model's (COOK's measured box), a handgun's its model's over the hand grow it is built with (the fist
   hides its grip: own_guns.json hand_grow_k). Drawn as long as 0.85 of it (a rigid thing), 0.6 (a cord, a thong or a chain that
   hangs from the fist: the source's 'hanging'); THE PISTOL at least a forearm (0.146 of a man's height, anthropometry's forearm). */
const PXM = FR.ruler.px / FR.ruler.m, FOREARM = 0.146 * FR.ruler.px;
function glbLen(file) {   /* a glb's longest side in metres: every mesh's box through its node's transforms */
  const b = fs.readFileSync(path.join(ROOT, file)), n = b.readUInt32LE(12), j = JSON.parse(b.slice(20, 20 + n).toString());
  const mul = (A, B) => { const C = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) C[c * 4 + r] += A[k * 4 + r] * B[c * 4 + k]; return C; };
  const trs = nd => { if (nd.matrix) return nd.matrix; const t = nd.translation || [0, 0, 0], q = nd.rotation || [0, 0, 0, 1], sc = nd.scale || [1, 1, 1];
    const [x, y, z, w] = q, R = [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0, 2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0, 2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0, 0, 0, 0, 1];
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) R[c * 4 + r] *= sc[c]; R[12] = t[0]; R[13] = t[1]; R[14] = t[2]; return R; };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  const walk = (i, M) => { const nd = j.nodes[i], W = mul(M, trs(nd));
    if (nd.mesh !== undefined) j.meshes[nd.mesh].primitives.forEach(pr => { const a = j.accessors[pr.attributes.POSITION];
      for (let k = 0; k < 8; k++) { const p = [k & 1 ? a.max[0] : a.min[0], k & 2 ? a.max[1] : a.min[1], k & 4 ? a.max[2] : a.min[2]];
        for (let r = 0; r < 3; r++) { const v = W[r] * p[0] + W[4 + r] * p[1] + W[8 + r] * p[2] + W[12 + r]; lo[r] = Math.min(lo[r], v); hi[r] = Math.max(hi[r], v); } } });
    (nd.children || []).forEach(c => walk(c, W)); };
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  (j.scenes[j.scene || 0].nodes).forEach(i => walk(i, I));
  return Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
}
const OWNJ = J('slices/fight_rig/own_guns.json'), HANG = new Set(J('records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json').hanging || ['chain']);
const CLASS_GUN = { pistol: 'gun_pistol_a', rifle: 'gun_rifle_a', shotgun: 'gun_shotgun_a' };
const realOf = (x) => {   /* [metres, the share it must be drawn at, the rule's name] or null when the thing has no measure */
  if (x.gun) { const own = x.gun.indexOf('class:') !== 0, m = own ? OWNJ.model[x.gun] : CLASS_GUN[x.gun.slice(6)];
    if (!m || !fs.existsSync(path.join(ROOT, 'reference/models/bohemia', m + '.glb'))) return null;
    const k = own && (OWNJ.hand_grow_k || {})[x.gun] || 1; return [glbLen('reference/models/bohemia/' + m + '.glb') / k, 0.85, 'gun ' + x.gun]; }
  const mj = path.join(ROOT, 'records/target/cook_every_item/measured_' + x.want + '.json'); if (!fs.existsSync(mj)) return null;
  return [Math.max.apply(null, J('records/target/cook_every_item/measured_' + x.want + '.json').size_m), HANG.has(x.want) ? 0.6 : 0.85, x.want]; };
function sizeFaults(R) {
  const short = [], pistol = [], unmeasured = new Set();
  Object.keys(R.rows).forEach(id => Object.entries(R.rows[id]).forEach(([look, x]) => {
    if (!x.want || !x.facings) return;
    const r = realOf(x); if (!r) { unmeasured.add(x.want); return; }
    const need = r[0] * PXM * r[1]; if (x.len < need) short.push(id + '@' + look + ' ' + x.len + ' < ' + need.toFixed(1) + ' (' + r[2] + ')');
    if ((x.gun === 'dagger' || x.gun === 'class:pistol') && x.len < FOREARM) pistol.push(id + '@' + look + ' ' + x.len + ' < ' + FOREARM.toFixed(1));
  }));
  return { short, pistol, unmeasured: [...unmeasured] };
}
const SWORDS = ['rhomphaia', 'warbrand', 'longsword', 'greatsword', 'executioner_s_sword'];

(async () => {
  const errs = [];
  const session = async (what, body) => {
    let d = null;
    try {
      d = await D.open(what === 'the fight' ? {} : { file: 'BOHEMIA_DEMO.html', profile: 'phone_portrait', engage: true });
      d.page.on('pageerror', e => errs.push(what + ': ' + String(e)));
      await d.page.waitForTimeout(2500);
      await body(d);
    } catch (e) { leg(false, 'the demo drove (' + what + ')', String(e)); }
    try { if (d) await d.close(); } catch (e) {}
  };
  /* F, in a demo of its own: a road fight through the game's one door */
  await session('the fight', async (d) => {
    /* F: a road fight through the game's one door */
    /* the way THE THING IN HIS HAND's W3 starts one (gates/melee_in_hand_gate.py): the map ready, one step, then the contact */
    await d.fr.waitForFunction(() => typeof roadContactFight === 'function' && typeof om !== 'undefined' && !!om, null, { timeout: 120000 });
    await d.fr.evaluate(async () => {
      for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
      try { contactClear(); } catch (e) {}
      try { stepOnce(0); stepOnce(4); } catch (_e) {}
      /* the demo's crew starts on its town's ground, where A TOWN IS ALWAYS A DOOR holds a road crew off it and the meet card asks
         first: both lifted for the one call that sets the test fight up, put back the same instant (this gate is about the hands) */
      const kt = townDoorHolds, km = MEET.on; townDoorHolds = function () { return false; }; MEET.on = false;
      try { return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); } finally { townDoorHolds = kt; MEET.on = km; }
    });
    let f = null;
    await waitFor(d.page, async () => { const h = await d.page.$('#fightFrame'); if (!h) return false; const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0 && typeof MELEE !== 'undefined' && MELEE.state === 2)) { f = c; return true; } return false; }, 120000);
    if (!f) leg(false, 'F0 a road fight opens in the demo', 'no fight frame');
    else {
      await d.page.waitForTimeout(2000);
      const F1 = await f.evaluate(FIGHT_WALK, {});
      if (F1.err) leg(false, 'F1 the fight', F1.err);
      else {
        const miss = missing(F1);
        note('F the fight\'s men: ' + F1.men.join(', ') + '; ' + Object.keys(F1.rows).length + ' rows and shields each; errors ' + F1.errs.length);
        leg(miss.length === 0 && !F1.errs.length, 'F1 THE FIGHT (the demo\'s road fight): every row and every shield is DRAWN in his hands by the fight\'s own draw in at least ' + MIN_FACINGS + ' of 8 facings, for ' + F1.men.length + ' looks, no error',
          miss.slice(0, 12).map(id => id + ' ' + JSON.stringify(F1.rows[id])).join('; ') + (miss.length > 12 ? ' ... ' + miss.length : '') + ' ' + F1.errs.slice(0, 2).join('; '));
        const sz = sizeFaults(F1);
        note('R measured against the ruler (' + PXM.toFixed(1) + ' px a metre; a forearm ' + FOREARM.toFixed(1) + ' px); no measure for: ' + (sz.unmeasured.join(', ') || 'none'));
        leg(sz.short.length === 0, 'R1 AT A REAL SIZE: every row and every shield is drawn in his hand at least 0.85 of its real length (a hanging cord 0.6), the longest of its eight facings standing',
          sz.short.join('; '));
        leg(sz.pistol.length === 0, 'R2 THE PISTOL READS A FOREARM LONG in his hand (every PISTOL row, his "Too tiny")', sz.pistol.slice(0, 8).join('; '));
        const P3 = await f.evaluate(FIGHT_WALK, { mutate: 'small_pistol', only: ['dagger', 'knife', 'bludgeon'] }), s3 = sizeFaults(P3);
        leg(s3.pistol.some(x => x.startsWith('dagger@')) && !s3.short.some(x => x.startsWith('bludgeon@')), 'R3 MUTATION: the pistol drawn as the old class pistol (its real size, the size main drew it) goes red on R2, the pipe beside it does not',
          JSON.stringify(s3.pistol.slice(0, 3)));
        const F3 = await f.evaluate(FIGHT_WALK, { mutate: 'sword', only: SWORDS.concat(['bludgeon', 'tire_iron', 'two_handed_mallet']) }), m3 = missing(F3);
        leg(SWORDS.every(id => m3.indexOf(id) >= 0) && m3.indexOf('bludgeon') < 0 && m3.indexOf('two_handed_mallet') < 0, 'F2 MUTATION: the sword\'s two-handed picture taken out in the live fight, the five swords go red (and only they)', m3.join(', '));
      }
    }
    /* M: the map, counted */
    const mp = await d.fr.evaluate(() => { try { return { crew: (MAP_DREW && MAP_DREW.crewLooks || []).filter(Boolean).length, weapons: 0 }; } catch (e) { return null; } }).catch(() => null);
    note('M the map: his crew walks beside him from their own walk sheets, ' + (mp ? mp.crew : '?') + ' men drawn, 0 of them with a weapon in hand (no weapon is drawn on the map yet: the next round, handoffs/WEAPONS.md)');
  });
  /* C, in a fresh demo: the crew screen from the map */
  await session('the crew screen', async (d) => {
    /* C: the crew screen, from the map the way the bar opens it */
    await d.fr.evaluate(() => new Promise(res => { const go = () => { try { if (!BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.open({ base: '' }); } catch (e) {} res(true); };
      if (window.BohemiaCrewDoor) return go(); const sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_door.js'; sc.onload = go; document.head.appendChild(sc); }));
    let RS = null;
    await waitFor(d.page, async () => { RS = d.page.frames().find(f => /ROSTER_SCREEN/.test(f.url())); return !!RS && await RS.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready)); }, 40000);
    if (!RS) { leg(false, 'C0 the crew screen opens in the demo', 'it never opened'); }
    else {
      const C1 = await RS.evaluate(CREW_WALK, {});
      if (C1.err) leg(false, 'C1 the crew screen', C1.err);
      else {
        const miss = missing(C1);
        note('C the crew screen\'s men: ' + C1.men.join(', ') + '; ' + Object.keys(C1.rows).length + ' rows and shields each');
        leg(miss.length === 0, 'C1 THE CREW SCREEN (the demo\'s): every row and every shield is in his fists on his card in at least ' + MIN_FACINGS + ' of 8 turns, for ' + C1.men.length + ' looks',
          miss.slice(0, 12).map(id => id + ' ' + JSON.stringify(C1.rows[id])).join('; ') + (miss.length > 12 ? ' ... ' + miss.length : ''));
        /* on the glass: the man on the card handed the golf club */
        const glass = await RS.evaluate(async () => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel]; if (!m) return { err: 'no man selected' };
          const keep = m.gear.main; m.gear.main = window.BohemiaRoster.itemOf('weapon', 'golf_club'); BohemiaRosterScreen.choose(S.sel);
          let got = null; for (let i = 0; i < 40 && !got; i++) { await new Promise(r => setTimeout(r, 200)); const c = document.querySelector('#card .rbody');
            if (c && /golf_club/.test(c.dataset.holds || '') && +c.dataset.weaponLaid > 0) { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let k = 3; k < x.length; k += 4) if (x[k] > 0) n++; got = { holds: c.dataset.holds, painted: n }; } }
          m.gear.main = keep; BohemiaRosterScreen.choose(S.sel); return got || { holds: (document.querySelector('#card .rbody') || { dataset: {} }).dataset.holds || null }; });
        leg(!!(glass && /golf_club/.test(glass.holds || '') && glass.painted > 200), 'C2 ON THE GLASS: the man on the card handed the golf club stands with it in his fists (the card\'s own canvas says so, painted)', JSON.stringify(glass));
        const C3 = await RS.evaluate(CREW_WALK, { mutate: 'sword', only: SWORDS.concat(['bludgeon', 'tire_iron', 'two_handed_mallet']) }), m3 = missing(C3);
        leg(SWORDS.every(id => m3.indexOf(id) >= 0) && m3.indexOf('bludgeon') < 0 && m3.indexOf('two_handed_mallet') < 0, 'C3 MUTATION: the sword\'s two-handed picture taken out on the crew screen, the five swords go red (and only they)', m3.join(', '));
      }
      await d.fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} }).catch(() => {});
      await d.page.waitForTimeout(800);
    }
  });
  leg(!errs.length, 'no page error in the demo while every weapon was handed out', errs.slice(0, 3).join('; '));
  done();
})();
