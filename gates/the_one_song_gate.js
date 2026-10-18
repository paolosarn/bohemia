/* ==========================================================================
   THE ONE SONG  (RUN, 10/4/26, VAMILY [one song], rule 64)

   PAOLO 10/2: "two songs are playing at the same time; I don't know how you fucked that up."
   MEASURED (every AudioContext and media element in every frame hooked, the demo walked):
   the demo has ONE music engine, and the folds had broken its hand-offs both ways --
   (1) the rebuilt fight makes only its own short sounds and nobody told the music a fight began,
       so the MAP'S song played on under every fight;
   (2) the way home clicks the RUN tab, and the shell's tab rule only spared 'city', so it
       stopped the street's song: home from every fight to a SILENT map.
   NOW (__ONE_SONG__ in the shell): the fight takes the music the way FIGHTMUS always has (the
   street stands down without a cut, the fight's song is picked once through the one handler),
   and the fight's leave hands the street back on a phrase; the map's panel never stops it.

   LEGS, one walk on the demo, sampled every half second from the map through a settlement, a
   fight and home:
     S1 *** NEVER TWO SONGS *** at any sample: one music engine making music at most (the shell's
        transport, any other frame's audio making more than a note-run, any media element)
     S2 on the map and in the settlement screen the street owns the music
     S3 *** THE FIGHT TAKES THE MUSIC *** within two seconds of the door: the fight's director
        on, the street's off, a faction song (never the scratch patch)
     S4 the fight's song is picked once (one name through the whole fight)
     S5 *** HOME IS NEVER SILENT ***: the music plays at every sample after he is home
     S6 the street takes it back on a phrase: not before one phrase of the fight's song, and
        within forty seconds, with an overworld song
     S8 *** THE OLD FIGHT'S DOOR IS NOT TWO SONGS EITHER *** (rule 64a: he heard the double music on the
        old fight): the demo's walk never uses it, and forced open the shell plays the fight's song while
        the old fight's own loop is silent
     S9 nothing threw
   node gates/the_one_song_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE ONE SONG: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* every frame: count the notes each AudioContext starts, and every media element that plays */
const ARM = `(function(){
  var A = window.__AUD = { ctxs: [], media: [] };
  var Orig = window.AudioContext || window.webkitAudioContext; if (!Orig) return;
  function W(o){ var c = new Orig(o); var rec = { c: c, starts: [] }; A.ctxs.push(rec);
    ['createOscillator','createBufferSource'].forEach(function(k){ var f = c[k]; if (!f) return;
      c[k] = function(){ var n = f.apply(c, arguments), st = n.start; n.start = function(){ rec.starts.push(performance.now()); return st.apply(n, arguments); }; return n; }; });
    return c; }
  W.prototype = Orig.prototype; window.AudioContext = W; if (window.webkitAudioContext) window.webkitAudioContext = W;
  var P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function(){ if (A.media.indexOf(this) < 0) A.media.push(this); return P.apply(this, arguments); };
  window.__audSnap = function(){ var now = performance.now();
    return { ctx: A.ctxs.map(function(r){ return r.c.state === 'running' ? r.starts.filter(function(t){ return now - t < 2000; }).length : 0; }),
      media: A.media.filter(function(m){ return !m.paused && !m.muted && m.volume > 0; }).length }; };
})();`;

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, arm: ARM }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const samples = [];
  const sample = async (where) => {
    const s = await d.page.evaluate(() => { const g = (f) => { try { return f(); } catch (_e) { return null; } };
      return { mus: g(() => !!MUS.playing), city: g(() => !!CITYMUS.on), fight: g(() => !!FIGHTMUS.on), cur: g(() => MUS.cur), nf: MFACTIONS.length,
        song: g(() => MUS.cur < MFACTIONS.length ? MFACTIONS[MUS.cur].n : MLOOPS[MUS.cur - MFACTIONS.length].n),
        overworld: g(() => MUS.cur >= MFACTIONS.length && CITYMUS.candidates().some(c => c.fi === MUS.cur)) }; });
    /* the other frames: a context starting more than eight notes in two seconds is making music, not a hit */
    s.others = 0; s.media = 0;
    for (const f of d.page.frames()) { try { const a = await f.evaluate(() => window.__audSnap ? __audSnap() : null); if (!a) continue;
      s.media += a.media; if (f !== d.page.mainFrame()) s.others += a.ctx.filter(n => n > 8).length; } catch (_e) {} }
    s.playing = (s.mus ? 1 : 0) + s.others + s.media;
    s.where = where; s.t = Date.now(); samples.push(s); return s;
  };
  const hold = async (where, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await sample(where); await d.page.waitForTimeout(500); } };
  try {
    const fr = d.fr;
    /* the old fight's door is counted from the first second: the demo's own walk must never use it */
    await d.page.evaluate(() => { window.__oldDoor = 0; const f = window.startEncounter; window.startEncounter = function(){ window.__oldDoor++; return f.apply(this, arguments); }; });
    await hold('map', 6000);
    /* a settlement: touch the nearest town and wait for its screen */
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    if (town) {
      const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y); return { x: r.left + q.sx, y: r.top + q.sy + TH / 2 }; }, [town.x, town.y]);
      await d.tapAt(p.x, p.y);
      for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await sample('travel'); await d.page.waitForTimeout(400); }
      await hold('settlement', 3000);
      await fr.evaluate(() => { try { LOOP.frame.style.display = 'none'; } catch (_e) {} try { loopClose && loopClose(); } catch (_e) {} });
    }
    /* the fight, through the one door; the moment the music changes hands is timed inside the page, on a 20 ms watch */
    await d.page.evaluate(() => { window.__took = { door: 0, took: 0 }; const t = setInterval(() => { const W = window.__took, now = performance.now();
      if (!W.door && document.getElementById('fightFrame')) W.door = now;
      if (W.door && !W.took && FIGHTMUS.on && !CITYMUS.on && MUS.playing && MUS.cur > 0 && MUS.cur < MFACTIONS.length) { W.took = now; clearInterval(t); }
      if (W.door && now - W.door > 10000) clearInterval(t); }, 20); });
    await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); });
    for (let i = 0; i < 40; i++) { if (await d.page.evaluate(() => !!document.getElementById('fightFrame'))) break; await d.page.waitForTimeout(100); }
    await d.page.waitForTimeout(2000);
    await hold('fight', 12000);
    const h = await d.page.$('#fightFrame'); const ff = h ? await h.contentFrame() : null;
    if (ff) await ff.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    const tOver = Date.now();
    for (let i = 0; i < 40; i++) { const home = await d.page.evaluate(() => !CITYFIGHT); await sample(home ? 'home' : 'card'); if (home) break; await d.page.waitForTimeout(250); }
    await hold('home', 40000);

    const two = samples.filter(s => s.playing > 1);
    ok('*** S1 NEVER TWO SONGS *** (' + samples.length + ' samples, the most playing at once ' + Math.max(...samples.map(s => s.playing)) + (two.length ? '; two at ' + two[0].where + ': engine ' + two[0].mus + ', other frames ' + two[0].others + ', media ' + two[0].media : '') + ')', samples.length > 40 && two.length === 0);
    const calm = samples.filter(s => s.where === 'map' || s.where === 'settlement');
    ok('S2 on the map and in the settlement screen the street owns the music (' + calm.filter(s => s.mus && s.city && !s.fight).length + ' of ' + calm.length + ' samples; ' + samples.filter(s => s.where === 'settlement').length + ' in the settlement)',
      calm.length > 0 && samples.some(s => s.where === 'settlement') && calm.every(s => s.mus && s.city && !s.fight));
    const fights = samples.filter(s => s.where === 'fight');
    const W = await d.page.evaluate(() => window.__took), took = fights.find(s => s.fight && !s.city && s.mus && s.cur > 0 && s.cur < s.nf);
    const ms = W.door && W.took ? Math.round(W.took - W.door) : null;
    ok('*** S3 THE FIGHT TAKES THE MUSIC *** (' + (ms !== null ? ms + ' ms after the door, ' + (took ? took.song : '?') : 'never: ' + JSON.stringify(fights[0] && { song: fights[0].song, city: fights[0].city, fight: fights[0].fight })) + '; held in ' + fights.filter(s => s.fight && !s.city && s.mus && s.cur > 0 && s.cur < s.nf).length + ' of ' + fights.length + ' fight samples)',
      ms !== null && ms <= 2000 && !!took && fights.every(s => s.fight && !s.city && s.mus && s.cur > 0 && s.cur < s.nf));
    const names = [...new Set(fights.filter(s => took && s.t >= took.t).map(s => s.song))];
    ok('S4 the fight\'s song is picked once (' + names.join(', ') + ')', names.length === 1);
    const home = samples.filter(s => s.where === 'home');
    const silent = home.filter(s => !s.mus);
    ok('*** S5 HOME IS NEVER SILENT *** (' + (home.length - silent.length) + ' of ' + home.length + ' samples with music' + (silent.length ? '; silent ' + Math.round((silent[0].t - tOver) / 1000) + ' s after the card' : '') + ')', home.length > 20 && silent.length === 0);
    const back = home.find(s => s.city && s.mus);
    const ph = await d.page.evaluate(() => phraseMs());
    ok('S6 the street takes it back on a phrase (' + (back ? Math.round((back.t - tOver) / 100) / 10 + ' s after the fight ended, a phrase is ' + ph / 1000 + ' s, ' + back.song + (back.overworld ? ', an overworld song' : ', NOT an overworld song') : 'never') + ')',
      !!back && back.t - tOver >= ph - 1000 && back.t - tOver <= 40000 && back.overworld);
    /* S8: the old door, forced (rule 64a): every fight the demo starts goes to the rebuilt one, so this is the
       only way to reach it now; whatever reaches it later must still be one song */
    const oldUsed = await d.page.evaluate(() => window.__oldDoor);
    /* as a fresh boot has it: the old frame's own loop allowed (the RUN tab's click on the way home from the first
       fight muted it, which would hide the bug; measured: forced at the opening it played, about 35 notes in two seconds) */
    await d.page.evaluate(() => { NEW_FIGHT_ON = false; const cf = document.getElementById('combatFrame'); if (cf && cf.contentWindow) cf.contentWindow.postMessage({ bohemiaMusicMute: false }, '*'); });
    await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 2 }); });
    await d.page.waitForTimeout(3000);
    /* COMBAT 10/9 [one fight]: nothing warms the old frame ahead now, so this door builds 1.95 MB cold and the page is
       busy for seconds; the watch is longer so it still gathers more than five samples (the floor below is unchanged) */
    const before = samples.length; await hold('old fight', 14000);
    const old = samples.slice(before);
    const oldPair = old.filter(s => s.playing > 1).length, oldShell = old.filter(s => s.mus && s.fight).length;
    ok('*** S8 THE OLD FIGHT\'S DOOR IS NOT TWO SONGS EITHER *** (the demo\'s walk used it ' + oldUsed + ' times; forced open: ' + oldShell + ' of ' + old.length
      + ' samples the shell scoring the fight, ' + oldPair + ' with two playing, the old frame ' + Math.max(0, ...old.map(s => s.others)) + ' playing)',
      oldUsed === 0 && old.length > 5 && oldPair === 0 && oldShell === old.length && old.every(s => s.others === 0));
    ok('S9 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
