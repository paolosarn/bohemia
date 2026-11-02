#!/usr/bin/env node
/* THEY MEND ON THE MARCH (ANIMATION, ask line 314, Paolo 11/2: 'I like these animations, let's make this happen... it has to look
   good, that's the main thing'). records/BOHEMIA_ANIMATION_HEALING_AND_MENDING_ON_THE_MARCH_11_2_26.md

   M1  the kept source holds the four (bind, pills, tape, helmet), each on the walk's six keys, every hold two keys or more, no pose
       beside itself, whole bars, starting and ending on its own lift (the step from the walk's swing: no joint jumps to the chest)
   M2  the pack: every rendered man has all four, a cell for every facing he is seen working on, every pose, every walk key, and
       his arms' sheet beside it; his legs lay on his own map walk (the leftover written by the pack, under 8 percent)
   M3  the numbers are in the modder's file and the player reads them (one or two men at once, a rest of several bars)
   M4  THE PICKER, run in a clock with no browser: over a long march no more than two men are at work at once; nobody starts in the
       march's first bars; an act starts on a bar and plays its whole bars unless he stops or turns away; a man rests before he
       works again; nobody works facing away (N, NE, NW); a man with nothing to mend never works; a hood never gets its dent
       knocked out; with no tape nobody tapes
   M5  the map draws it: the act's cell in his walk frame's place, his worn plate and helmet found on his walk frame (his helmet in
       his fist while it is off: the wear player's headAt), his arms again on top; for him and for his two men
   M6  the four are in the VOTE tab, each a page that plays them */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const J = (p) => JSON.parse(rd(p));

/* M1 */
const SRC = J('records/target/animation/BOHEMIA_THEY_MEND_ON_THE_MARCH.json');
const ACTS = { march_bind: 'bind', march_pills: 'pills', march_tape: 'tape', march_helmet: 'helmet' };
const m1 = [];
for (const a in ACTS) {
  const A = SRC.activities[a]; if (!A) { m1.push('no ' + a); continue; }
  if (A.walk !== 6) m1.push(a + ' not on the six-key walk');
  const tl = A.timeline || [], n = tl.reduce((s, x) => s + x[1], 0);
  if (n % 12 || n < 24 || n > 48) m1.push(a + ' is ' + n + ' keys, not two to four whole bars');
  tl.forEach((x, i) => { if (x[1] < 2) m1.push(a + ' holds ' + x[0] + ' one key'); if (i && tl[i - 1][0] === x[0]) m1.push(a + ' has ' + x[0] + ' beside itself'); if (!A.poses[x[0]]) m1.push(a + ' plays ' + x[0] + ', no such pose'); });
  const lift = Object.keys(A.poses).find(p => /_lift$/.test(p));
  if (!lift || tl[0][0] !== lift || tl[tl.length - 1][0] !== lift) m1.push(a + ' does not start and end on its lift');
}
ok('M1 the kept source: four acts on the walk\'s six keys, whole bars, every hold two keys or more, each from and back to its lift', !m1.length, m1.slice(0, 4).join('; ') || Object.keys(ACTS).map(a => ACTS[a] + ' ' + SRC.activities[a].timeline.reduce((s, x) => s + x[1], 0) / 12 + ' bars').join(', '));

/* M2 */
const IXP = 'slices/rig_march/rig_march.json';
const IX = fs.existsSync(path.join(ROOT, IXP)) ? J(IXP) : null;
ok('M2a the pack\'s index is in the published folder (slices/rig_march)', !!IX && Object.keys(IX.looks || {}).length > 0, IX ? Object.keys(IX.looks).join(', ') : 'missing');
const m2 = [];
if (IX) {
  for (const look in IX.looks) {
    const L = IX.looks[look];
    if (!L.legs_off_px || L.legs_off_px[0] > 0.08 * L.legs_off_px[1]) m2.push(look + ' legs do not lay on his walk');
    for (const a in ACTS) {
      const S = L.acts[ACTS[a]]; if (!S) { m2.push(look + ' has no ' + ACTS[a]); continue; }
      for (const f of ['file', 'front']) if (!fs.existsSync(path.join(ROOT, 'slices/rig_march', S[f]))) m2.push(look + ' ' + S[f] + ' missing');
      for (const face of IX.seen) for (const p of Object.keys(SRC.activities[a].poses)) for (let k = 0; k < 6; k++)
        if (!(S.cells[face] && S.cells[face][p] && S.cells[face][p][k] && S.cells[face][p][k].length === 6)) m2.push(look + ' ' + ACTS[a] + ' ' + face + ' ' + p + '@' + k);
      if (a === 'march_helmet') { const held = ['MH_hold', 'MH_up', 'MH_knock']; for (const face of IX.seen) for (const p of held) for (let k = 0; k < 6; k++) if (!(S.helm[face] && S.helm[face][p] && S.helm[face][p][k])) m2.push(look + ' no helmet spot ' + face + ' ' + p + '@' + k); }
    }
  }
}
ok('M2b every packed man: all four, every seen facing, pose and walk key, his arms\' sheet, his legs on his own map walk', IX && !m2.length, m2.slice(0, 4).join('; ') || (IX ? Object.entries(IX.looks).map(([l, L]) => l + ' legs ' + L.legs_off_px[0] + '/' + L.legs_off_px[1]).join(', ') : ''));

/* M3 */
const NUM = J('records/target/bb/march_acts.json');
const eng = rd('engine/bohemia_march_acts.js');
const keys = ['men_at_once', 'start_chance', 'rest_bars_min', 'rest_bars_max', 'first_bars', 'heal_below', 'bandage_below', 'mend_min_points'];
ok('M3 the numbers are in the modder\'s file and the player reads that file', keys.every(k => NUM[k] && typeof NUM[k].value === 'number') && NUM.men_at_once.value <= 2 && NUM.rest_bars_min.value >= 2 &&
   /march_acts\.json/.test(eng) && /function num\(k\)/.test(eng), 'men_at_once ' + NUM.men_at_once.value + ', rest ' + NUM.rest_bars_min.value + '..' + NUM.rest_bars_max.value + ' bars');

/* M4: the picker in a clock */
const store = {};
const W = {
  localStorage: { getItem: k => store[k] == null ? null : store[k], setItem: (k, v) => { store[k] = String(v); } },
  performance: { now: () => 0 }, document: null,
  fetch: (u) => Promise.resolve({ json: () => Promise.resolve(u.indexOf('rig_march.json') >= 0 ? IX : NUM) }),
  Image: function () { const me = this; setTimeout(() => { me.onload && me.onload(); }, 0); }
};
W.window = W;
const men = { YOU: { main: true, look: 'you', hpMax: 60, lostHp: 30, lostH: 10, lostB: 0, head: 'hat' }, DESI: { look: 'person_town_0', hpMax: 55, lostHp: 20, lostH: 5, lostB: 0, head: 'hood' },
              RAUL: { look: 'person_town_1', hpMax: 58, lostHp: 0, lostH: 0, lostB: 30 }, TINA: { look: 'person_town_5', hpMax: 50, lostHp: 0, lostH: 0, lostB: 0 } };
W.BohemiaCondition = { get: () => ({ men: JSON.parse(JSON.stringify(men)), dead: [] }) };
W.BohemiaWear = { wearOf: () => null, piece: (slot, id) => ({ cls: id === 'hat' ? 'hard_hat' : 'rag_hood' }) };
store['bohemia.supplies.v1'] = JSON.stringify({ tape: 20 });
new Function('window', 'fetch', 'Image', 'performance', 'localStorage', eng.replace('typeof window !== \'undefined\' ? window : this', 'window'))(W, W.fetch, W.Image, W.performance, W.localStorage);
const BM = W.BohemiaMarch;
(async () => {
  BM.load(); await new Promise(r => setTimeout(r, 20));
  const LOOKS = IX ? Object.keys(IX.looks) : [];
  const crew = [['you', 'you', { main: true }], ['crew:person_town_0', 'person_town_0', { look: 'person_town_0' }], ['crew:person_town_1', 'person_town_1', { look: 'person_town_1' }], ['crew:person_town_5', 'person_town_5', { look: 'person_town_5' }]].filter(c => LOOKS.indexOf(c[1]) >= 0);
  /* load every sheet once */
  for (const c of crew) for (const a of ['bind', 'pills', 'tape', 'helmet']) { BM.force(c[0], a); BM.frame(c[0], c[1], c[2], 'SE', 0.1, true, 0); BM.reset(); }
  await new Promise(r => setTimeout(r, 20)); BM.reset();
  const keyMs = 500 / 3, bad = [], acts = {}, starts = [];
  let most = 0, t = 0, face = 'SE';
  const last = {};
  for (let i = 0; i < 12 * 400; i++) {   /* 400 bars of marching, a key at a time; he turns away now and then and stops now and then */
    t = i * keyMs; const bar = Math.floor(i / 12);
    face = (bar % 37 > 30) ? 'N' : (bar % 23 > 19 ? 'NW' : ['SE', 'S', 'E', 'SW', 'W'][Math.floor(bar / 11) % 5]);
    const moving = bar % 53 < 50;
    let n = 0;
    for (const c of crew) {
      const q = BM.frame(c[0], c[1], c[2], face, (i % 6) / 6 + 0.01, moving, t);
      if (q) { n++; acts[c[0] + ':' + q.act] = (acts[c[0] + ':' + q.act] | 0) + 1;
        if (['N', 'NE', 'NW'].indexOf(face) >= 0) bad.push('works facing ' + face);
        if (!moving) bad.push('works standing');
        if (!last[c[0]] || last[c[0]].act !== q.act || q.key < last[c[0]].key) { starts.push([c[0], i, q.key]); if (q.key !== i % 12 && q.key > 1) bad.push(c[0] + ' starts off the bar at key ' + q.key); }
        last[c[0]] = { act: q.act, key: q.key, i }; }
      else if (last[c[0]] && last[c[0]].i === i - 1) last[c[0]].end = i;
    }
    most = Math.max(most, n);
  }
  const firstStart = starts.length ? Math.min(...starts.map(s => s[1])) : null;
  const tina = Object.keys(acts).filter(k => k.indexOf('person_town_5') >= 0);
  const hood = Object.keys(acts).filter(k => k === 'crew:person_town_0:helmet');
  const raulMends = Object.keys(acts).filter(k => k === 'crew:person_town_1:tape');
  /* no tape: nobody tapes or knocks */
  store['bohemia.supplies.v1'] = JSON.stringify({ tape: 0 }); BM.reset(); const noTape = {};
  for (let i = 0; i < 12 * 120; i++) for (const c of crew) { const q = BM.frame(c[0], c[1], c[2], 'SE', (i % 6) / 6, true, 1e7 + i * keyMs); if (q) noTape[q.act] = 1; }
  ok('M4a over 400 bars of marching never more than ' + NUM.men_at_once.value + ' at work at once, and somebody works', crew.length === 0 ? false : (most <= NUM.men_at_once.value && starts.length > 4), 'most ' + most + ', ' + starts.length + ' acts started');
  ok('M4b nobody works facing away (N NE NW) or standing still; every act starts on a bar', !bad.length, bad.slice(0, 3).join('; ') || 'checked ' + (12 * 400) + ' keys');
  ok('M4c nothing in the march\'s first bars', firstStart == null || firstStart >= 12 * NUM.first_bars.value, 'first act at key ' + firstStart);
  ok('M4d a man with nothing to mend never works; a hood never gets its dent knocked out; tape mends a torn vest', !tina.length && !hood.length && (LOOKS.indexOf('person_town_1') < 0 || raulMends.length > 0), JSON.stringify(acts));
  ok('M4e with no tape in the cart nobody tapes or knocks a dent (the march mends only with tape)', !noTape.tape && !noTape.helmet, JSON.stringify(noTape));
  /* VOTE FIXES 11/2: he voted NO on the pills ('Not good looking enough'): off the march's rotation, read from the modder's file */
  const pillsPlayed = Object.keys(acts).filter(k => /:pills$/.test(k)).concat(noTape.pills ? ['no tape: pills'] : []);
  ok('M4f the pills are off the march (his NO): the file lists them off and over 400 bars nobody plays them; the bandage still plays', (NUM.acts_off && NUM.acts_off.value || []).indexOf('pills') >= 0 && !pillsPlayed.length && /acts_off/.test(eng) && !!noTape.bind, pillsPlayed.join(', ') || 'none; ' + JSON.stringify(noTape));
  /* M5 */
  const map = rd('slices/BOHEMIA_CITY_WORLD.html'), wear = rd('engine/bohemia_wear.js');
  ok('M5a the map loads the player and draws it for his two men: the act in his walk frame\'s place, his gear on his walk frame, his arms on top',
     /<script defer src="\.\.\/engine\/bohemia_march_acts\.js"><\/script>/.test(map) && /rigBlit\(__mf \? __mf\.body : fr,/.test(map) && /mapWearOn\(fr, __bx, __by, w \/ fr\.width, [^;]*look, __mf\)/.test(map) && /if \(__mf\) rigBlit\(__mf\.front/.test(map));
  ok('M5b and for him: his act, his gear found on his walk frame, his arms on top', /__march=mapMarchFrame\('you'/.test(map) && /mapWearOn\(__marchWalk\|\|__body/.test(map) && /spriteAt\(__march\.front,32\)/.test(map));
  ok('M5c the wear player draws his helmet in his fist while it is off (headAt)', /o\.headAt \? ox \+ o\.headAt\[0\] \* s : ax/.test(wear) && /headAt: extra && extra\.headAt/.test(map));
  /* M6 */
  const reg = J('records/target/BOHEMIA_VOTE_REGISTRY.json');
  const mine = reg.items.filter(x => /^animation-march-/.test(x.id));
  const pages = mine.map(x => x.show && x.show.src).filter(Boolean);
  ok('M6 the four are in the VOTE tab, each a page that plays them (the player and the map\'s own pictures)', mine.length === 4 && pages.every(p => fs.existsSync(path.join(ROOT, 'slices', p)) && /bohemia_march_acts\.js/.test(rd('slices/' + p)) && /animation_march\.js/.test(rd('slices/' + p))),
     mine.map(x => x.id).join(', '));
  console.log('\nTHEY MEND ON THE MARCH GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
