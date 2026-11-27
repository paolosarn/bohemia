#!/usr/bin/env node
/* A BEAST BITES LIKE A BEAST (FIXES 4 11/27, ask row 749 FOUND BY BESTIARY 2; rule 482, the beasts he meets first: 'each moves and
   sounds like the animal it is'). records/BOHEMIA_FIXES_FOUR_A_BEAST_BITES_LIKE_A_BEAST_11_27_26.md.
   MEASURED BEFORE: the fight sent a beast's natural blow as 'blunt' (SND.blow) and the shell's punch player (engine/bohemia_punch_heard.js)
   played the pipe-on-bone take for a coyote's bite, a lion's maul and a hog's tusks alike; no beast was heard before it died.

   Legs:
   B1 THE SPRITE: slices/fight_punch/ holds three beast voices (beast_canine, beast_cat, beast_big), three takes each, none longer than
      the pipe's own take (0.75 s), each from banked CC0 recordings (the dog, the cat, the pigs fighting: the clips the death voices are
      cut from), each with its gain through the game's chain in index.json; the twenty voices before them still there, take for take;
   B2 THE ROUTER: a beast's blow is its animal (a coyote, a wolf and a hyena bite; a mountain lion, a sabre-tooth and a jaguar maul; a
      hog, a bull, a bison, a camel and Harrington's goat ram), the same animal the death player names; a man's blow is still the pipe
      or the blade; a beast's blow on a machine is still steel; a beast's blow on one of his is the beast, and his 'that was you' still
      plays on top (null); a miss is still the scuff;
   B3 THE FIGHT NAMES THE STRIKER: SND.blow adds striker (its kind) for a beast and only for a beast, and its death reads the same
      beastOf;
   B4 THE GAME CARRIES IT: the alpha and the demo inline both players byte for byte;
   B5 THE REAL SURFACE: the demo, a road fight through the map's own door with coyotes, hogs and a mountain lion, on AUTO: every beast's
      blow that landed played its own animal, never the pipe; a man's blow still the pipe or the blade; nothing threw.
   --plant: the fight's old message (no striker), served in place of the fight: B5 must go red.
   Run: node gates/a_beast_bites_like_a_beast_gate.js   (--fast skips B5) */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PLANT = process.argv.includes('--plant');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('A BEAST BITES LIKE A BEAST' + (PLANT ? ' (PLANTED)' : '') + ': ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const BEASTS = ['beast_canine', 'beast_cat', 'beast_big'];
const OLD20 = ['blunt', 'blade', 'swing', 'scuff', 'hurt_body', 'down', 'thud', 'high', 'metal_step', 'servo', 'machine_hit', 'machine_fall',
  'road_stop', 'boss_found', 'they_come', 'camp_make', 'camp_break', 'phone_tap', 'phone_open', 'phone_close'];

(async () => {
  /* ---------------- B1: the sprite ---------------- */
  const man = JSON.parse(read('slices/fight_punch/manifest.json')), idx = JSON.parse(read('slices/fight_punch/index.json'));
  const SRC = JSON.parse(read('tools/bohemia_from_a_recording_sources.json'));
  const bad = BEASTS.filter(v => { const m = man.voices[v], i = idx.voices[v];
    return !m || !i || m.takes.length !== 3 || i.takes.length !== 3 || m.takes.some(t => t.dur_s > 0.75 || t.dur_s < 0.15) || typeof i.db !== 'number'
      || Math.abs(i.heard - i.mark) > 0.5 || !(m.sources || []).length || m.sources.some(s => (SRC[s] || {}).licence !== 'CC0' || !man.sources[s]); });
  const animals = { beast_canine: 'Dog', beast_cat: 'Cat', beast_big: 'Pig' };
  const ownAnimal = BEASTS.filter(v => man.voices[v] && man.voices[v].sources.some(s => (SRC[s] || {}).category === animals[v]));
  const kept = OLD20.filter(v => man.voices[v] && idx.voices[v] && man.voices[v].takes.length === idx.voices[v].takes.length);
  leg(!bad.length && ownAnimal.length === 3 && kept.length === 20 && idx.file === man.file,
    '*** B1 THE SPRITE ***: three beast voices, three takes each, none past 0.75 s, every source banked CC0, each with its animal in it (the dog, the cat, the pigs), each at its mark through the game\'s chain; the twenty before them kept',
    (bad.length ? 'bad: ' + bad.join(', ') + '; ' : '') + BEASTS.map(v => v + ' ' + (man.voices[v] ? man.voices[v].takes.map(t => t.dur_s).join('/') + ' s ' + (idx.voices[v] || {}).heard + ' dB' : 'MISSING')).join('; ') + '; kept ' + kept.length + '/20');

  /* ---------------- B2: the router ---------------- */
  delete globalThis.BOH_DEATH; delete globalThis.BOH_PUNCH;
  require(path.join(ROOT, 'engine/bohemia_death_sounds.js')); require(path.join(ROOT, 'engine/bohemia_punch_heard.js'));
  const P = globalThis.BOH_PUNCH, D = globalThis.BOH_DEATH;
  const v = (m, shot) => (P.voicesOf(m, !!shot) || []).join('+');
  const hit = (striker, extra) => Object.assign({ ev: 'melee_hit', melee: true, side: 'them', blow: 'blunt' }, striker ? { striker: striker } : {}, extra || {});
  const want = { coyote: 'beast_canine', wolf: 'beast_canine', direwolf: 'beast_canine', hyena: 'beast_canine', wardog: 'beast_canine',
    mountain_lion: 'beast_cat', sabre_tooth: 'beast_cat', pleistocene_jaguar: 'beast_cat', american_cheetah: 'beast_cat', american_lion: 'beast_cat',
    feral_hog: 'beast_big', feral_bull: 'beast_big', ancient_bison: 'beast_big', camelops: 'beast_big', harringtons_goat: 'beast_big', short_faced_bear: 'beast_big', columbian_mammoth: 'beast_big' };
  const wrong = Object.keys(want).filter(k => v(hit(k)) !== want[k] || v(hit(k, { ev: 'vital' })) !== want[k] || 'beast_' + D.animalOf(k) !== want[k]);
  const man1 = v(hit(null)) === 'blunt' && v(hit(null, { blow: 'cutting' })) === 'blade' && v(hit(null, { blow: 'piercing' })) === 'blade';
  const steel = v(hit('coyote', { target_machine: true })) === 'machine_hit';
  const hurt = v({ ev: 'hurt', melee: true, striker: 'feral_hog' }) === 'beast_big' && v({ ev: 'hurt', melee: true }) === 'hurt_body';
  const miss = v({ ev: 'miss', melee: true, striker: 'coyote' }) === 'scuff';
  leg(!wrong.length && man1 && steel && hurt && miss,
    '*** B2 THE ROUTER ***: a coyote, a wolf and a hyena bite; the cats maul; a hog, a bull, a bison, a camel and the goat ram (the death player\'s own animal); a man\'s blow is the pipe or the blade; a bite on a machine is steel; a beast on one of his is the beast; a miss is the scuff',
    'wrong ' + (wrong.join(', ') || 'none') + '; man ' + man1 + ', steel ' + steel + ', hurt ' + hurt + ', miss ' + miss);
  /* the player itself: a beast's blow played its animal, his 'that was you' still on top, and an old sprite falls back to the blow it had */
  const fakeAC = { currentTime: 0, createBufferSource: () => ({ buffer: null, playbackRate: { value: 1 }, connect() {}, start() {}, stop() {}, disconnect() {} }), createGain: () => ({ gain: { value: 1, setTargetAtTime() {} }, connect() {}, disconnect() {} }) };
  const mk = (voices) => { const S = P.make({ out: () => ({ AC: fakeAC, bus: {} }), random: () => 0.5 }); S.idx = { voices: voices }; S.buf = {}; return S; };
  const allV = {}; Object.keys(idx.voices).forEach(k => { allV[k] = idx.voices[k]; });
  const S1 = mk(allV), r1 = S1.heard(hit('coyote')), p1 = S1.log.map(l => l.voice).join('+'), r2 = S1.heard({ ev: 'hurt', melee: true, striker: 'mountain_lion' }), p2 = S1.log.slice(1).map(l => l.voice).join('+');
  const oldV = {}; OLD20.forEach(k => { oldV[k] = idx.voices[k]; });
  const S2 = mk(oldV), r3 = S2.heard(hit('feral_hog')), p3 = S2.log.map(l => l.voice).join('+');
  leg(r1 === 'done' && p1 === 'beast_canine' && r2 === null && p2 === 'beast_cat' && r3 === 'done' && p3 === 'blunt',
    'the player: a coyote\'s blow plays the bite and stands the old sound down; a lion on his man plays the maul and his \'that was you\' still plays on top; a sprite from before the beasts plays the blow it had, never silence',
    [r1, p1, r2, p2, r3, p3].join(' | '));

  /* ---------------- B3: the fight names the striker ---------------- */
  const FH = read('slices/BOHEMIA_FIGHT.html');
  const b3 = /if \(bk\) f\.striker = bk;/.test(FH) && /bk = SND\.beastOf\(u\);/.test(FH) && /const bk = SND\.beastOf\(u\); if \(bk\) f\.beast = bk;/.test(FH)
    && /beastOf: function \(u\) \{ return u && \(u\.beast \|\|/.test(FH);
  leg(b3, '*** B3 THE FIGHT NAMES THE STRIKER ***: SND.blow adds the beast that struck (its kind), for a beast only; its death reads the same beastOf', b3);

  /* ---------------- B4: the game carries it ---------------- */
  const eng = ['engine/bohemia_punch_heard.js', 'engine/bohemia_death_sounds.js'].map(f => read(f));
  for (const f of ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']) {
    const s = read(f), miss4 = eng.map((e, i) => s.indexOf(e) >= 0 ? null : ['punch', 'death'][i]).filter(Boolean);
    leg(!miss4.length, '*** B4 THE GAME CARRIES IT *** (' + path.basename(f) + '): both players inlined byte for byte', miss4.length ? 'drifted: ' + miss4.join(', ') : 'both');
  }
  if (process.argv.includes('--fast')) return done();

  /* ---------------- B5: the real surface ---------------- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const BAND = ['coyote', 'coyote', 'feral_hog', 'feral_hog', 'mountain_lion', 'coyote'];
  const ARM = `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 11, party: ${JSON.stringify(BAND)} }) : v; } }); })();`;
  const opts = { keepCards: true, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } };
  if (PLANT) {
    const sp = path.join(require('os').tmpdir(), 'beast_bites_plant_' + process.pid + '.html');
    fs.writeFileSync(sp, FH.replace('if (bk) f.striker = bk;', '/* planted: the old message */'));
    opts.serve = { '/slices/BOHEMIA_FIGHT.html': sp };
  }
  let d;
  try { d = await drive.open(opts); } catch (e) { leg(false, 'the demo boots', String(e.message).slice(0, 160)); return done(); }
  const p = d.page; const perr = []; p.on('pageerror', e => perr.push(String(e.message)));
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running' && window.PUNCH, null, { timeout: 30000 });
    await p.evaluate(() => { const L = window.__BB = [];
      const orig = PUNCH.heard; PUNCH.heard = function (m) { const c0 = PUNCH.count, r = orig.call(PUNCH, m), n = PUNCH.count - c0;
        if (m && /^(melee_hit|vital|hurt)$/.test(m.ev)) L.push({ ev: m.ev, striker: m.striker || null, side: m.side, ready: PUNCH.ready(), played: n ? PUNCH.log.slice(-n).map(l => l.voice) : [], r: r });
        return r; }; });
    const f = await drive.roadFightOffTheTown(d, { id: 'toll_crew', name: 'the toll crew', seq: 7 });
    if (!f) throw new Error('the road fight never came up');
    for (let i = 0; i < 300 && !(await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)); i++) await p.waitForTimeout(150);
    const kinds = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind));
    await p.waitForFunction(() => PUNCH.ready(), null, { timeout: 60000 });
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    /* until a coyote, a hog and the lion have each landed a blow, or the fight is over */
    const want5 = { coyote: 'beast_canine', feral_hog: 'beast_big', mountain_lion: 'beast_cat' };
    let L = [], over = false;
    for (let i = 0; i < 400; i++) {
      L = await p.evaluate(() => window.__BB.slice());
      over = await f.evaluate(() => !!FIGHT.S.over).catch(() => true);
      const seen = new Set(L.filter(x => x.ready).map(x => x.striker || (x.side === 'you' ? '' : '?')));
      if (over || Object.keys(want5).every(k => seen.has(k))) break;
      await p.waitForTimeout(500);
    }
    const theirs = L.filter(x => x.ready && x.side === 'them');
    const named = theirs.filter(x => x.striker), heardRight = named.filter(x => x.played[0] === want5[x.striker] || x.played[0] === 'beast_' + ((globalThis.BOH_DEATH.animalOf(x.striker)) || 'canine'));
    const piped = theirs.filter(x => x.played.some(n => n === 'blunt' || n === 'hurt_body'));
    const kindsHeard = Array.from(new Set(heardRight.map(x => x.played[0]))).sort();
    const mine = L.filter(x => x.ready && x.side === 'you' && x.ev !== 'hurt'), mineOk = mine.every(x => !x.striker && /^(blunt|blade|machine_hit)$/.test(x.played[0] || 'blunt'));
    leg(theirs.length >= 3 && named.length === theirs.length && heardRight.length === named.length && !piped.length && kindsHeard.length >= 2 && mineOk,
      '*** B5 HE HEARS THE ANIMAL ***: the demo\'s road fight with coyotes, hogs and a mountain lion on AUTO: every beast\'s blow that landed played its own animal, never the pipe; his men\'s blows still the pipe or the blade',
      'band ' + kinds.join(',') + '; fight over ' + over + '; their blows ' + theirs.length + ', named ' + named.length + ', their own animal ' + heardRight.length + ' (' + kindsHeard.join(', ') + '), the pipe ' + piped.length + '; his ' + mine.length + ' ' + (mineOk ? 'pipe or blade' : 'WRONG ' + JSON.stringify(mine.filter(x => x.striker || !/^(blunt|blade|machine_hit)$/.test(x.played[0] || 'blunt')).slice(0, 2))) + '; e.g. ' + JSON.stringify(theirs.slice(0, 3).map(x => [x.ev, x.striker, x.played.join('+')])));
  } catch (e) { leg(false, 'the demo\'s fight ran', String(e.message).slice(0, 220)); }
  leg(!perr.length, 'nothing threw in the demo', perr.slice(0, 2).join(' | '));
  await d.close();
  done();
})();
