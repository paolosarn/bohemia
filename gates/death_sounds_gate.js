#!/usr/bin/env node
/* DEATH SOUNDS THAT TERRIFY (SOUNDS, 10/26/26, row [death sounds that terrify], rule 235(f)).

   PAOLO 10/26: 'during combat when people die, I wanna hear terrible, terrible noises that are scary, like people are literally
   dying... many types, like broken bones, the whole enchilada.'
   235(f): every death in rolled fights plays a death take from its kind, never the same take twice in a row, in the fight's
   mix, on the beat; at least six kinds with at least three takes each; each take is real material (its source line in the
   record).
   LEGS
     1  THE GAME CARRIES IT: the alpha and the demo carry engine/bohemia_death_sounds.js byte for byte and the line where the
        fight's sound reaches the shell asks DEATH first; the fight carries SND.death and sends it on the dead note
     2  SIX KINDS, THREE TAKES: the sprite's manifest and the game's index hold bone, blade, gun, beast, slow and armour, each for
        his man and theirs, three takes or more, the skull and three animals; his man louder (by the marks) and longer
     3  REAL MATERIAL: every layer of every take is a clip with a CC0 line in the manifest, and every clip is named in the record
     4  THE KILLING BLOW PICKS THE KIND: SND.death in the fight, on dead men the gate makes (a mace, a sword, a rifle, a wolf's
        bite, mail that broke, a small last blow, a wolf dying, a machine), says the kind 235(b) names
   on the demo, the phone profile (CPU 4x slower) and the computer:
     5  EVERY KIND PLAYS ITS OWN: every kind for his man and theirs, the animals and the skull, posted the way the fight posts
        a death: each plays a take of exactly its voice on the effects bus, the old fall stood down, never one take twice in a
        row (six deaths of one kind running)
     6  ROLLED FIGHTS: three seeded road fights on AUTO: every death plays a take of the kind its facts name, never the same take
        twice in a row, the old fall never plays, and each starts on the song's sixteenth (within 20 ms, the one beat's log)
     7  nothing threw
   node gates/death_sounds_gate.js [--computer-only|--phone-only] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SL = path.join(ROOT, 'slices');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const TOL = 20;
const KINDS = ['bone', 'blade', 'gun', 'beast', 'slow', 'armour'];
const RECORD = path.join(ROOT, 'records', 'BOHEMIA_DEATH_SOUNDS_THAT_TERRIFY_SOUNDS_10_26_26.md');

/* 1 */
const ENGINE = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_death_sounds.js'), 'utf8').trimEnd();
for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
  const s = fs.readFileSync(path.join(SL, f), 'utf8');
  leg(s.includes(ENGINE) && s.includes('<!-- /__DEATH_SOUNDS__ -->') && s.includes("_dh = window.DEATH ? DEATH.heard(d) : null;"),
    f + ': *** THE DEATHS ARE IN THE GAME ***, the player byte for byte and the fight\'s sound line asks it first');
}
{
  const s = fs.readFileSync(path.join(SL, 'BOHEMIA_FIGHT.html'), 'utf8');
  leg(/\n  death: function \(u, e\) \{/.test(s) && s.includes('SND.fall(true, SND.death(u, e))') && s.includes('facts.kill = SND.death(v, e)'),
    'the fight says how each man died (SND.death on the dead note and on a skipped turn)');
}
/* 2, 3 */
const man = JSON.parse(fs.readFileSync(path.join(SL, 'fight_death', 'manifest.json'), 'utf8'));
const idx = JSON.parse(fs.readFileSync(path.join(SL, 'fight_death', 'index.json'), 'utf8'));
{
  const need = [].concat(...KINDS.map(k => [k + '_yours', k + '_theirs']), ['skull', 'animal_canine', 'animal_big', 'animal_cat']);
  const short = need.filter(n => !idx.voices[n] || idx.voices[n].takes.length < 3 || !man.voices[n] || man.voices[n].takes.length !== idx.voices[n].takes.length);
  leg(!short.length, '*** SIX KINDS, THREE TAKES EACH ***, his man\'s and theirs, the skull and three animals, in the sprite and the game\'s index',
    need.length + ' voices, ' + need.reduce((s, n) => s + ((idx.voices[n] || {}).takes || []).length, 0) + ' takes' + (short.length ? '; SHORT: ' + short.join(', ') : ''));
  const worse = KINDS.filter(k => idx.voices[k + '_yours'].mark > idx.voices[k + '_theirs'].mark && man.voices[k + '_yours'].cut_s > man.voices[k + '_theirs'].cut_s);
  leg(worse.length === KINDS.length, 'HIS MEN THE WORST (235(e)): every kind\'s his-man take is louder and longer than theirs',
    KINDS.map(k => k + ' ' + idx.voices[k + '_yours'].mark + '/' + idx.voices[k + '_theirs'].mark + ' dB, ' + man.voices[k + '_yours'].cut_s + '/' + man.voices[k + '_theirs'].cut_s + ' s').join('; '));
  const rec = fs.existsSync(RECORD) ? fs.readFileSync(RECORD, 'utf8') : '';
  const used = new Set(), bad = [];
  for (const [n, v] of Object.entries(man.voices)) for (const tk of v.takes) for (const l of tk.layers) {
    used.add(l.source);
    const s = man.sources[l.source];
    if (!s || s.licence !== 'CC0' || !/freesound\.org/.test(s.freesound || '')) bad.push(n + ':' + l.source);
  }
  const unnamed = [...used].filter(s => !rec.includes(s));
  leg(!bad.length && !unnamed.length && used.size >= 20, '*** REAL MATERIAL ***: every layer is a CC0 recording with its Freesound line, every clip named in the record',
    used.size + ' clips' + (bad.length ? '; NO CC0 LINE: ' + bad.slice(0, 4).join(', ') : '') + (unnamed.length ? '; NOT IN THE RECORD: ' + unnamed.slice(0, 5).join(', ') : ''));
}

/* 4: the kind, through the fight's own SND.death and the player's own kindOf */
const CASES = [
  ['a mace caves him in', 'bone', { side: 'them' }, { class: 'mace', name: 'Bludgeon' }, { hp: 30, armour: 5 }],
  ['a sword opens him', 'blade', { side: 'them' }, { class: 'sword', name: 'Shortsword' }, { hp: 30, armour: 0 }],
  ['a spear runs him through', 'blade', { side: 'you' }, { class: 'spear', name: 'Militia Spear' }, { hp: 30, armour: 0 }],
  ['a rifle drops him', 'gun', { side: 'them' }, { class: 'crossbow', name: 'Light Crossbow' }, { hp: 30, armour: 0 }],
  ['a wolf takes one of his', 'beast', { side: 'you' }, { class: 'natural', name: 'Direwolf Bite' }, { hp: 30, armour: 0 }, { beast: 'dire_wolf' }],
  ['his mail gives under a hammer', 'armour', { side: 'you', armBMax: 140, armB: 0 }, { class: 'hammer', name: 'Military Pick' }, { hp: 25, armour: 40 }],
  ['a thin vest broken by a shot is still the gun', 'gun', { side: 'them', armBMax: 40, armB: 0 }, { class: 'crossbow', name: 'Light Crossbow' }, { hp: 25, armour: 10 }],
  ['a small last blow finishes him', 'slow', { side: 'them', hpMax: 60 }, { class: 'sword', name: 'Shortsword' }, { hp: 6, armour: 0 }],
  ['a brute\'s sweep breaks him', 'bone', { side: 'them' }, { class: 'natural', name: 'Sweep' }, { hp: 40, armour: 0 }],
  ['a wolf dies', 'animal_canine', { side: 'them', beast: 'dire_wolf', kind: 'direwolf' }, { class: 'sword', name: 'Shortsword' }, { hp: 30, armour: 0 }],
  ['a machine stops (no voice)', null, { side: 'them', machine: true }, { class: 'firearm', name: 'Handgonne' }, { hp: 30, armour: 0 }]
];
function sideOf(want, u) { return want && !/^animal_/.test(want) ? want + '_' + (u.side === 'you' ? 'yours' : 'theirs') : want; }

const ARM = (seed) => `(function(){
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: ${seed} }) : v; } });
    return; }
})();`;
const OFF = `window.__offOf = function (T) { const g = BOHEMIA_BEAT.grid(T - 0.0625); return g == null ? null : (T - g) * 1000; };`;

async function fightUp(p, d, party) {
  await d.fr.evaluate(pt => { CITY_CONTACT_POSTED = false; roadContactFight({ id: pt, name: pt, seq: 7 }); }, party);
  let f = null;
  for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
    if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board && !FIGHT.S.over).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
  return f;
}

async function live(profile, throttle) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : ''));
  let d; const errs = [];
  try { d = await drive.open({ keepCards: true, profile, throttle, arm: ARM(7), beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running' && window.__beatNext && window.DEATH, null, { timeout: 90000 });
    await p.evaluate(async () => { await DEATH.load();
      /* every death the shell asks the player about, what it answered and the take it played (one row per death, in order) */
      window.__DH = []; const h = DEATH.heard; DEATH.heard = function (m) { const n0 = DEATH.log.length; let r, err = null;
        try { r = h.apply(this, arguments); } catch (e) { err = String(e && e.message || e).slice(0, 200); throw e; }
        finally { if (m && m.ev === 'kill') { const e = DEATH.log.slice(n0).filter(x => x.take !== undefined && !/^skull/.test(x.voice))[0];
          __DH.push({ m: m, r: r, err: err, got: e ? e.voice + '#' + e.take : null }); } } return r; }; });
    await p.evaluate(OFF);
    await p.evaluate(() => { window.__OLD = 0; const ps = window.playSFX; window.playSFX = function (ev) { if (ev === 'kill') __OLD++; return ps.apply(this, arguments); }; });
    /* 5: every kind, posted the way the fight posts it */
    const posted = await p.evaluate(async (KINDS) => {
      const out = [], wait = ms => new Promise(r => setTimeout(r, ms));
      const send = async (facts) => { const n0 = DEATH.log.length, o0 = __OLD; window.postMessage(Object.assign({ type: 'BOHEMIA_SFX', ev: 'kill' }, facts), '*'); await wait(120);
        return { want: BOH_DEATH.kindOf(facts), got: DEATH.log.slice(n0).filter(e => e.take !== undefined).map(e => e.voice + '#' + e.take), old: __OLD - o0 }; };
      const F = { bone: { blow: 'blunt', weapon: 'mace' }, blade: { blow: 'cutting', weapon: 'sword' }, gun: { gun: true, weapon: 'crossbow', blow: 'piercing' },
        beast: { by_beast: true, blow: 'natural', weapon: 'natural' }, slow: { finish: true, blow: 'cutting', weapon: 'sword' }, armour: { armour_gave: true, blow: 'blunt', weapon: 'hammer' } };
      for (const k of KINDS) for (const side of ['you', 'them']) out.push(await send(Object.assign({ side: side }, F[k])));
      for (const b of ['direwolf', 'unhold', 'nachzehrer']) out.push(await send({ side: 'them', beast: b, weapon: 'sword', blow: 'cutting' }));
      const head = await send({ side: 'them', weapon: 'mace', blow: 'blunt', head: true });
      const run = []; for (let i = 0; i < 6; i++) run.push(await send({ side: 'them', weapon: 'sword', blow: 'cutting' }));
      return { out, head, run };
    }, KINDS);
    const wrong = posted.out.filter(r => !r.got.length || r.got[0].split('#')[0] !== r.want || r.old);
    leg(!wrong.length && posted.out.length === 15, profile + ': *** EVERY KIND PLAYS ITS OWN *** (six kinds for his man and theirs, three beasts), on the effects bus, the old fall stood down',
      posted.out.map(r => r.got[0] || ('nothing for ' + r.want)).join(', ') + (wrong.length ? '; WRONG: ' + wrong.map(r => r.want + ' -> ' + (r.got[0] || 'nothing') + (r.old ? ' +old' : '')).join(', ') : ''));
    leg(posted.head.got.length === 2 && /^skull#/.test(posted.head.got[1]), profile + ': THE HEAD (the fatality): the skull\'s crunch on top of the kind', posted.head.got.join(' + '));
    const takes = posted.run.map(r => r.got[0]), rep = takes.filter((t, i) => i && t === takes[i - 1]);
    leg(takes.length === 6 && takes.every(Boolean) && !rep.length, profile + ': *** NEVER THE SAME TAKE TWICE IN A ROW *** (six blade deaths of theirs running)', takes.join(' '));
    /* 6: rolled fights on AUTO */
    const rolled = [];
    for (const [party, seed] of [['toll_crew', 7], ['patrols_collide', 11], ['bounty_squad', 5]]) {
      await d.fr.evaluate(() => {}).catch(() => {});
      const f = await fightUp(p, d, party);
      if (!f) { console.log('  (the ' + party + ' fight did not come up)'); continue; }
      await f.evaluate(sd => { try { if (window.FIGHT_OPTS) FIGHT_OPTS.seed = sd; if (FIGHT.S.deploy) fightNow(); } catch (_e) {} FIGHT_UI.auto = true; }, seed);
      const k0 = await p.evaluate(() => __DH.length), ob0 = await p.evaluate(() => (window.__ONEBEAT ? __ONEBEAT.log.length : 0));
      let over = false;
      for (let i = 0; i < 700 && !over; i++) { over = await f.evaluate(() => !!FIGHT.S.over && !FIGHT_UI.anim.length).catch(() => true); if (!over) await p.waitForTimeout(500); }
      await p.waitForTimeout(2500);
      const r = await p.evaluate(a => ({ kills: __DH.slice(a[0]).map(k => ({ want: BOH_DEATH.kindOf(k.m), got: k.got, facts: k.m, err: k.err })),
        beat: (window.__ONEBEAT ? __ONEBEAT.log.slice(a[1]).filter(e => e.ev === 'kill').map(e => ({ why: e.why, off: __offOf(e.T) })) : []) }), [k0, ob0]);
      rolled.push(Object.assign({ party: party }, r));
      /* back to the map for the next one */
      try { await f.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /continue|done|back|map|leave/i.test(x.textContent || '')); if (b) b.click(); }); } catch (_e) {}
      await p.waitForTimeout(4000);
    }
    const all = [].concat(...rolled.map(r => r.kills)), beats = [].concat(...rolled.map(r => r.beat));
    const mism = all.filter(k => k.want && k.got && k.got.split('#')[0] !== k.want), silent = all.filter(k => k.want && !k.got);
    const seq = all.map(k => k.got).filter(Boolean), rep2 = seq.filter((t, i) => i && t === seq[i - 1]);
    const offBeat = beats.filter(b => b.off == null || Math.abs(b.off) > TOL), oldN = await p.evaluate(() => __OLD);
    const kinds = {}; all.forEach(k => { const n = (k.got || 'none').split('#')[0]; kinds[n] = (kinds[n] || 0) + 1; });
    leg(all.length >= 2 && !mism.length && !silent.length && !rep2.length && oldN === 0,
      profile + ': *** ROLLED FIGHTS *** every death plays a take of the kind its killing blow names, never the same take twice in a row, the old fall never',
      all.length + ' deaths in ' + rolled.length + ' fights: ' + Object.keys(kinds).map(k => kinds[k] + ' ' + k).join(', ') + '; old fall ' + oldN
        + (mism.length ? '; WRONG: ' + mism.map(k => k.want + '->' + k.got).join(', ') : '') + (silent.length ? '; SILENT ' + silent.length + ' ' + JSON.stringify(silent.slice(0, 2).map(k => [k.facts, k.err])) : '') + (rep2.length ? '; REPEATED ' + rep2.join(',') : ''));
    leg(beats.length >= all.length && !offBeat.length, profile + ': *** ON THE BEAT *** every death starts on the song\'s sixteenth (within ' + TOL + ' ms), the tail rings past',
      beats.length + ' deaths booked: ' + beats.map(b => b.why + ' ' + (b.off == null ? '?' : b.off.toFixed(1))).join(', '));
    /* 4 inside the fight frame of the last fight (the page is the fight's own) */
    const h = await p.$('#fightFrame'); const fr = h ? await h.contentFrame() : null;
    if (fr) {
      const res = await fr.evaluate((CASES) => CASES.map(c => {
        const [what, want, uo, w, blow, ao] = c;
        const killer = Object.assign({ id: '__k', side: uo.side === 'you' ? 'them' : 'you', weapon: { class: w.class, name: w.name, skills: [] } }, ao || {});
        const u = Object.assign({ id: '__u', side: 'them', hpMax: 60, armBMax: 0, armHMax: 0, armB: 0, armH: 0, _blow: blow }, uo);
        const by = FIGHT.byId; FIGHT.byId = function (id) { return id === '__k' ? killer : by(id); };
        let f; try { f = SND.death(u, { t: 'dead', id: '__u', by: '__k' }); } finally { FIGHT.byId = by; }
        return { what, want, facts: f };
      }), CASES);
      const kinder = await p.evaluate(rs => rs.map(r => Object.assign(r, { got: BOH_DEATH.kindOf(r.facts) })), res);
      const bad = kinder.filter(r => r.got !== sideOf(r.want, CASES.find(c => c[0] === r.what)[2]));
      leg(!bad.length, '*** THE KILLING BLOW PICKS THE KIND *** (the fight\'s own SND.death on dead men the gate makes)',
        kinder.map(r => r.what + ': ' + r.got).join('; ') + (bad.length ? '; WRONG: ' + bad.map(r => r.what + ' -> ' + r.got).join(', ') : ''));
    } else leg(false, 'the fight frame is there for the kind table');
  } catch (e) { leg(false, profile + ': the demo and the fights played', String(e.message).slice(0, 200)); }
  leg(!errs.length, profile + ': nothing threw', errs.slice(0, 2).join(' | ').slice(0, 200));
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--computer-only')) await live('phone_portrait', 4);
  if (!a.includes('--phone-only')) await live('computer', 1);
  console.log('DEATH SOUNDS THAT TERRIFY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
