/* ==========================================================================
   ONE SONG ONLY  (SOUNDS, 10/20/26, row [one song only], rule 122)

   PAOLO 10/20, LOCKED: 'all the music sucks except for the new one you just made, the overworld night track, so I
   shouldn't be hearing anything other than that ever; if I hear any other song ever again I'm shutting this whole
   shit down'; 'And ALL OF THE OVERWORLD NIGHT TRACKS TOO'; 'It's in the music tab!!!'; 'the background ambience,
   the radio, has to go way down; anything volume wise, I should be seeing a slider for it in the settings'.

   THE SET is the MUSIC tab's OVERWORLD NIGHT category, read at play time (REPO MAN in it plays as THE MACHINE
   PARTY). This gate FAILS IF A SONG OUTSIDE THE SET CAN PLAY, by driving every door and every song on the demo:

     O1 the fence is in the alpha and in the demo, verbatim from its source (tools/bohemia_sounds_one_song_only_block.js)
     O2 the set is his category and not empty (nine on 10/20), read from the game, not typed here
     O3 *** THE WALK ***: the demo through its own door, the music on, every half second for twenty seconds the
        song on the transport is in the set
     O4 *** EVERY DOOR CHOOSES FROM THE SET ***: the street at night, day, dusk and dawn; the opening; the room
     O5 *** EVERY FIGHT ***: a fight starting, then every faction's pick posted the way the fight posts it: the song
        stays in the set
     O6 *** THE NET ***: every song in the library, both slots, put on the transport and stepped through a whole
        bar: every voice that reaches the graph belongs to a song in the set
     O7 the net can see a leak: the same sweep through the unfenced step DOES hear outside songs (else O6 proves
        nothing)
     O8 REPO MAN plays as THE MACHINE PARTY (the machine attached, its log moving) and the machine lets go on any
        other song (drumV and MUS.playStep given back)
     O9 the ambience starts far down: a fresh phone's mix says AMBIENCE 0.4 and the ambience bus is at its taper;
        the beds go into that bus
     O10 *** THE SLIDERS ***: the settings card has MUSIC, AMBIENCE and EFFECTS as sliders, 44 points tall, and a
        tap on one moves the mix at once and is saved
     O11 the settlement screen's own beds follow AMBIENCE and its taps follow EFFECTS (its engine, read)
     O12 nothing threw
   node gates/one_song_only_gate.js            (the demo)
   node gates/one_song_only_gate.js --alpha    (the alpha)
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? '  [' + String(why).slice(0, 300) + ']' : '')); } };
const done = () => { console.log('ONE SONG ONLY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const ALPHA = process.argv.includes('--alpha');

/* every connection into a node, so the ambience bus can be asked who feeds it */
const ARM = `(function(){ var C = AudioNode.prototype.connect; window.__conn = [];
  AudioNode.prototype.connect = function(dst){ try{ window.__conn.push({ src: this, dst: dst }); }catch(e){} return C.apply(this, arguments); }; })();`;

(async () => {
  /* O1, O11: read */
  const block = fs.readFileSync(path.join(ROOT, 'tools/bohemia_sounds_one_song_only_block.js'), 'utf8').trim();
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
  ok('O1 THE FENCE IS IN THE ALPHA AND THE DEMO, verbatim from its source', alpha.includes(block) && demo.includes(block));
  ok('O1 the fight, the street and the old fight go through it (the fight pick, the street keeps, the old loop muted)',
    ['SONGFENCE.fight(); else MUS.cur=_fi;', 'if(!(window.SONGFENCE&&SONGFENCE.keep()))this.play();', 'bohemiaMusicMute:(window.SONGFENCE?true:!_combatOwnsIt)']
      .every(t => alpha.includes(t) && demo.includes(t)));
  const heard = fs.readFileSync(path.join(ROOT, 'engine/bohemia_settlement_heard.js'), 'utf8');
  ok('O11 THE SETTLEMENT\'S BEDS FOLLOW AMBIENCE, its taps EFFECTS, both ALL and MUTE, and a slider is heard at once',
    /self\.g\.connect\(AMBG\)/.test(heard) && /g\.connect\(amb \? AMBG : MASTER\)/.test(heard) && /play\(pool\[[^\n]*, 1, true\)/.test(heard)
      && /addEventListener\('storage'/.test(heard) && /bohemia_mix/.test(heard) && /BOH_SETTINGS/.test(heard));

  let d;
  try { d = await drive.open(ALPHA ? { alpha: true, arm: ARM } : { arm: ARM }); }
  catch (e) { ok('the ' + (ALPHA ? 'alpha' : 'demo') + ' boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const P = d.page;
  try {
    /* the music the way the game starts it; if the door's own tap already did, this is a no-op */
    await P.evaluate(() => { if (!MUS.playing && window.MENUMUS) MENUMUS.open(); });
    await P.waitForTimeout(2500);

    /* O2 */
    const set = await P.evaluate(() => ({ names: SONGFENCE.names(), cat: SONGFENCE.cat,
      tagged: MUS.lib().filter(f => ((MUS.cats || {})[f.n + '#1'] || []).indexOf('OVERWORLD NIGHT') >= 0).map(f => f.n) }));
    ok('O2 THE SET IS HIS OVERWORLD NIGHT CATEGORY, read from the game (' + set.names.length + ': ' + set.names.join(', ') + ')',
      set.cat === 'OVERWORLD NIGHT' && set.names.length >= 1 && set.tagged.every(n => set.names.indexOf(n) >= 0) && set.names.indexOf('REPO MAN') >= 0, JSON.stringify(set));
    const SET = set.names;

    /* O3 the walk */
    const samples = [];
    for (let i = 0; i < 40; i++) {
      samples.push(await P.evaluate(() => ({ playing: MUS.playing, now: SONGFENCE.now(), ok: SONGFENCE.ok(), notes: SONGFENCE.notes })));
      await P.waitForTimeout(500);
    }
    const played = samples.filter(s => s.playing);
    ok('O3 *** THE WALK: TWENTY SECONDS, EVERY HALF SECOND, ONLY HIS SONGS *** (' + [...new Set(played.map(s => s.now))].join(', ') + ')',
      played.length >= 30 && played.every(s => s.ok && SET.indexOf(s.now) >= 0) && samples[samples.length - 1].notes > samples[0].notes,
      JSON.stringify(samples.filter(s => !s.ok).slice(0, 3)));

    /* O4 every door */
    const doors = await P.evaluate((SET) => {
      const nm = c => MUS.lib()[c.fi].n, inSet = cs => cs.every(c => SET.indexOf(nm(c)) >= 0), out = {};
      const was = CITYMUS.phase;
      ['NIGHT', 'DAY', 'DUSK', 'DAWN'].forEach(ph => { CITYMUS.phase = ph; const cs = CITYMUS.candidates(); out[ph] = { n: cs.length, ok: cs.length > 0 && inSet(cs) }; });
      CITYMUS.phase = was;
      const m = MENUMUS.candidates(); out.MENU = { n: m.length, ok: m.length > 0 && inSet(m) };
      const r = INTERIORMUS.candidates(); out.ROOM = { n: r.length, ok: inSet(r) };
      let picks = 0, bad = 0; for (let i = 0; i < 40; i++) { const c = CITYMUS.pick(); picks++; if (!c || SET.indexOf(nm(c)) < 0) bad++; }
      out.PICKS = { n: picks, ok: bad === 0 };
      return out;
    }, SET);
    ok('O4 *** EVERY DOOR CHOOSES FROM THE SET ***: the street at night, day, dusk and dawn, the opening, the room, forty draws',
      Object.values(doors).every(x => x.ok), JSON.stringify(doors));

    /* O5 every fight */
    const fights = await P.evaluate(async (SET) => {
      const res = [];
      FIGHTMUS.enter();
      const nf = MFACTIONS.length;
      for (let i = 0; i < nf; i++) {
        FIGHTMUS.songLatched = false;
        window.postMessage({ bohemiaFactionPicked: i }, '*');
        await new Promise(r => setTimeout(r, 60));
        res.push({ i, now: SONGFENCE.now(), ok: SONGFENCE.ok() && SET.indexOf(SONGFENCE.now()) >= 0 });
      }
      FIGHTMUS.cameBack = 0; FIGHTMUS.leave();
      return res;
    }, SET);
    ok('O5 *** EVERY FIGHT ***: a fight begins and every faction\'s pick is posted the way the fight posts it, and the song stays his (' + fights.length + ' picks)',
      fights.length > 5 && fights.every(f => f.ok), JSON.stringify(fights.filter(f => !f.ok).slice(0, 3)));

    /* O6 / O7 the net, and proof it can see a leak */
    const sweep = async (unfenced) => P.evaluate(async ({ SET, unfenced }) => {
      const heard = {}, sv = window.synthV, dv = window.drumV;
      const tag = () => { try { const f = MUS.fac(); heard[f && f.n] = (heard[f && f.n] || 0) + 1; } catch (e) {} };
      window.synthV = function () { tag(); return sv.apply(this, arguments); };
      window.drumV = function () { tag(); return dv.apply(this, arguments); };
      const save = { cur: MUS.cur, slot: MUS.curSlot, audit: MUS._audit, up: MUS.userPicked, playing: MUS.playing };
      if (MUS.playing) MUS.stop();                      /* the transport is ours for the sweep */
      const step = unfenced ? SONGFENCE._ps : MUS.playStep;
      const L = MUS.lib(), nf = MFACTIONS.length; let tried = 0;
      try {
        for (let i = 0; i < L.length; i++) {
          for (const slot of (i < nf ? [1, 2] : [1])) {
            if (slot === 2 && !(MUS.song2 && MUS.song2[L[i].n] && Object.keys(MUS.song2[L[i].n]).length)) continue;
            MUS._audit = false; MUS.userPicked = false; MUS.cur = i; MUS.curSlot = slot; tried++;
            const t0 = MUS.AC.currentTime + 0.05, sd = MUS.stepDur();
            /* bar nine of his form: the beat is in, so the kit and the tune both have their say */
            for (let s = 0; s < 16; s++) step.call(MUS, s, t0 + s * sd, MUS.songCtx(128 + s));
          }
        }
      } finally {
        if (window.MACHINEPARTY && MACHINEPARTY.on) MACHINEPARTY.detach();   /* first: it gives back the drumV it wrapped */
        window.synthV = sv; window.drumV = dv;
        MUS.cur = save.cur; MUS.curSlot = save.slot; MUS._audit = save.audit; MUS.userPicked = save.up;
        if (save.playing) MUS.start();
      }
      const names = Object.keys(heard);
      return { tried, names, outside: names.filter(n => SET.indexOf(n) < 0) };
    }, { SET, unfenced });
    const net = await sweep(false);
    ok('O6 *** THE NET: EVERY SONG IN THE LIBRARY ON THE TRANSPORT, ONLY HIS SONGS REACH THE GRAPH *** (' + net.tried + ' songs stepped, heard: ' + net.names.join(', ') + ')',
      net.tried > 50 && net.names.length >= 1 && net.outside.length === 0, JSON.stringify(net.outside.slice(0, 8)));
    const leak = await sweep(true);
    ok('O7 the net can see a leak: the same sweep through the unfenced step hears ' + leak.outside.length + ' outside songs',
      leak.outside.length > 20, JSON.stringify(leak).slice(0, 200));

    /* O8 REPO MAN, THE MACHINE PARTY */
    const mp = await P.evaluate(async () => {
      if (!MUS.playing) MUS.start();
      const i = MUS.lib().findIndex(f => f.n === 'REPO MAN'); MUS._audit = false; MUS.cur = i; MUS.curSlot = 1;
      const t0 = Date.now(); while (Date.now() - t0 < 20000 && SONGFENCE.machine.state !== 'ready') await new Promise(r => setTimeout(r, 250));
      const log0 = window.MACHINEPARTY ? MACHINEPARTY.log.length : 0;
      await new Promise(r => setTimeout(r, 4000));
      const on = { state: SONGFENCE.machine.state, err: SONGFENCE.machine.err, on: !!(window.MACHINEPARTY && MACHINEPARTY.on), moved: window.MACHINEPARTY ? MACHINEPARTY.log.length - log0 : 0, now: SONGFENCE.now() };
      const j = MUS.lib().findIndex(f => f.n !== 'REPO MAN' && SONGFENCE.allowed(MUS.lib().indexOf(f), 1)); MUS.cur = j;
      await new Promise(r => setTimeout(r, 1500));
      const off = { on: !!(window.MACHINEPARTY && MACHINEPARTY.on), ps: MUS.playStep !== SONGFENCE._ps && !(window.MACHINEPARTY && MACHINEPARTY._ps), now: SONGFENCE.now() };
      return { on, off };
    });
    ok('O8 REPO MAN PLAYS AS THE MACHINE PARTY: the machine attached and playing (' + mp.on.moved + ' machine hits in four seconds)',
      mp.on.state === 'ready' && mp.on.on && mp.on.moved > 0 && mp.on.now === 'REPO MAN', JSON.stringify(mp.on));
    ok('O8 the machine lets go on any other song (' + mp.off.now + ')', !mp.off.on && mp.off.ps, JSON.stringify(mp.off));

    /* O9 the ambience far down by default, and the beds go into its bus */
    const amb = await P.evaluate(() => {
      const A = window.__ambBus && __ambBus(), m = getMix();
      const feeds = (window.__conn || []).filter(c => c.dst === A).length;
      return { amb: m.amb, gain: A ? A.gain.value : null, taper: window.__mixTaper ? __mixTaper(m.amb) : null, feeds, saved: localStorage.getItem('bohemia_mix') };
    });
    ok('O9 THE AMBIENCE STARTS FAR DOWN: a fresh phone\'s AMBIENCE is 0.4 and its bus at ' + (amb.gain || 0).toFixed(3) + ' (-20 dB)',
      amb.amb === 0.4 && amb.gain !== null && Math.abs(amb.gain - Math.pow(0.4, 2.5)) < 0.002, JSON.stringify(amb));
    ok('O9 the beds go into the ambience bus (' + amb.feeds + ' sources so far: the heartbeat, the room, the title wind, the desert)', amb.feeds >= 2, JSON.stringify(amb));

    /* O10 the sliders */
    await P.evaluate(() => BohemiaSettings.open());
    await P.waitForTimeout(600);
    const geo = await P.evaluate(() => ['setmusic', 'setamb', 'setsfx'].map(id => { const i = document.querySelector('#' + id + ' input[type=range]');
      if (!i) return { id, missing: true }; const r = i.getBoundingClientRect(); return { id, x: r.x, y: r.y, w: r.width, h: r.height, v: +i.value }; }));
    ok('O10 *** THE SETTINGS CARD HAS MUSIC, AMBIENCE AND EFFECTS SLIDERS ***, each 44 points tall and on screen',
      geo.every(g => !g.missing && g.h >= 44 && g.w >= 120 && g.y > 0 && g.y < 844), JSON.stringify(geo));
    const a = geo.find(g => g.id === 'setamb');
    if (a && !a.missing) await P.touchscreen.tap(a.x + a.w * 0.75, a.y + a.h / 2);
    await P.waitForTimeout(400);
    const after = await P.evaluate(() => { const A = window.__AMBBUS; return { mix: getMix(), gain: A ? A.gain.value : null, saved: JSON.parse(localStorage.getItem('bohemia_mix') || '{}') }; });
    ok('O10 a tap on AMBIENCE moves the mix at once and is saved (' + after.mix.amb + ')',
      after.mix.amb > 0.55 && after.mix.amb < 0.9 && Math.abs(after.gain - Math.pow(after.mix.amb, 2.5)) < 0.01 && after.saved.amb === after.mix.amb, JSON.stringify(after));
  } catch (e) {
    ok('the gate ran to the end [' + String(e && e.message || e).slice(0, 200) + ']', false);
  }
  ok('O12 nothing threw (' + d.errs.length + ')', d.errs.length === 0, d.errs.slice(0, 3).join(' | '));
  await d.close();
  done();
})();
