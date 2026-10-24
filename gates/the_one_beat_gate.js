/* ==========================================================================
   THE ONE BEAT  (SOUNDS, 10/24/26, row [more music, on the one beat], rule 158)

   PAOLO 10/24, LOCKED: 'every time you press a button it's a request, and the game will do those actions on the BPM...
   everything is supposed to be on this BPM clock of the music... I know some of the songs are more like background
   hums and without drums, but we have made this universal BPM music thing for a whole reason.'

   The shell's song clock is ONE GRID the fight can read (tools/bohemia_sounds_the_one_beat_block.js). This gate FAILS
   if the grid is not the song's beat as heard, if a song change or a stop moves the beat, or if the fight cannot read it:

     B1 the block is in the alpha and the demo verbatim, and the transport's five edits are in both
     B2 the clock reads 120 BPM from the transport's own sixteenth, the song is its source
     B3 *** THE GRID IS THE SONG ***: every beat the transport books lands on the grid BOHEMIA_BEAT.next() names
        (heard, within 4 ms), and the booked beats are 500 ms apart
     B4 *** A SONG CHANGE KEEPS THE BEAT ***: the street swaps the song mid-beat; the new song's first note lands on
        the old grid and the song starts from its own bar 1
     B5 THE NET BITES: the same mid-beat swap the old way (no __beatNext) lands OFF the grid (else B4 proves nothing)
     B6 *** THE CLOCK RUNS UNDER A HUM ***: the drums held for four seconds, the beats keep being booked on the grid
     B7 stopped, the grid runs on ('held', the same phase); started again, the song comes in on it
     B8 *** THE FIGHT READS IT ***: a frame named fightFrame is handed BOHEMIA_BEAT and a message every beat; inside it,
        performance.now() + BOHEMIA_BEAT.next(4) is a quarter beat of the shell's grid in the frame's own clock; an
        ASK is answered
     B9 a division is a power of two of the same grid (3 snaps to 2; a half-beat point is a beat point or halfway)
     B10 an offline render (the song tools) never moves the grid
     B11 nothing threw
   THE TWO CLOCKS. The transport books on the audio context's clock; the grid is stamped in wall time as HEARD. On a loaded
   box the audio can slip (an underrun: the context's clock stops while the wall clock runs), and the heard beat really
   moves; measured 10/24 on the alpha with a song render beside it: one slip of 30 ms. So the beat claims (B3, B4, B6, B7)
   are held on the transport's own clock, which cannot slip against itself, and the heard stamps' slips are COUNTED and
   printed, failing only past three in four seconds (a broken stamp, not a busy box).
   node gates/the_one_beat_gate.js            (the demo)
   node gates/the_one_beat_gate.js --alpha    (the alpha)
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? '  [' + String(why).slice(0, 300) + ']' : '')); } };
const done = () => { console.log('THE ONE BEAT: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const ALPHA = process.argv.includes('--alpha');
const TOL = 4;   /* ms: one render quantum is 2.9 ms at 44.1 kHz, the output timestamp moves in those */

/* every beat booked, stamped as heard, recorded beside the grid's own answer at that instant */
const ARM = `(function(){ window.__beats = []; window.__errs = []; window.addEventListener('error', e => window.__errs.push(String(e.message)));
  var iv = setInterval(function(){ if (!window.__beatBooked || window.__beatBooked.__wrapped) return;
    var f = window.__beatBooked; window.__beatBooked = function(T, step){ f(T, step);
      try{ if (step % 4 === 0 && window.BOHEMIA_BEAT) window.__beats.push({ T: T, step: step, e: BOHEMIA_BEAT.probe().epoch, cur: MUS.cur }); }catch(_e){} };
    window.__beatBooked.__wrapped = true; clearInterval(iv); }, 5); })();`;

(async () => {
  /* B1 */
  const block = fs.readFileSync(path.join(ROOT, 'tools/bohemia_sounds_the_one_beat_block.js'), 'utf8').trim();
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
  const edits = ['window.__beatBooked&&window.__beatBooked(MUS.nextT,MUS.step)', '(window.__beatNext?window.__beatNext(this.AC.currentTime+0.06)',
    '(window.__beatNext?window.__beatNext(_n+0.06)'];
  const swaps = s => s.split('MUS.nextT=(window.__beatNext?window.__beatNext(MUS.AC.currentTime+0.06)').length - 1;
  ok('B1 THE GRID IS IN THE ALPHA AND THE DEMO, verbatim from its source', alpha.includes(block) && demo.includes(block));
  ok('B1 the transport stamps its beats, and a start, a stall and all three swaps land on the grid (alpha ' + swaps(alpha) + ', demo ' + swaps(demo) + ' swaps)',
    edits.every(t => alpha.includes(t) && demo.includes(t)) && swaps(alpha) === 3 && swaps(demo) === 3
      && !/MUS\.nextT=MUS\.AC\.currentTime\+0\.06;/.test(alpha) && !/MUS\.nextT=MUS\.AC\.currentTime\+0\.06;/.test(demo));

  let d;
  try { d = await drive.open(ALPHA ? { alpha: true, arm: ARM } : { arm: ARM }); }
  catch (e) { ok('the ' + (ALPHA ? 'alpha' : 'demo') + ' boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const P = d.page;
  const errs = []; P.on('pageerror', e => errs.push(e.message));
  /* is epoch e on the grid through g (ms), at a division of h ms? the distance to the nearest point */
  const off = (e, g, h) => { const r = ((e - g) % h + h) % h; return Math.min(r, h - r); };
  try {
    await P.evaluate(() => { if (!MUS.playing && window.MENUMUS) MENUMUS.open(); });
    await P.waitForTimeout(3000);

    /* B2 */
    const s0 = await P.evaluate(() => ({ st: BOHEMIA_BEAT.now(), sd: MUS.stepDur(), playing: MUS.playing }));
    ok('B2 THE CLOCK IS 120 BPM, FROM THE TRANSPORT\'S OWN SIXTEENTH (' + s0.st.bpm + ' bpm, ' + s0.st.beatMs + ' ms, src ' + s0.st.src + ')',
      s0.playing && s0.st.bpm === 120 && s0.st.beatMs === s0.sd * 4000 && s0.st.src === 'song', JSON.stringify(s0));

    /* B3 the grid is the song: sample the reader's answer at random instants and hold every booked beat against it */
    const asks = [];
    for (let i = 0; i < 12; i++) {
      asks.push(await P.evaluate(() => { const n = performance.timeOrigin + performance.now(); return { at: n, g: BOHEMIA_BEAT.epoch(), e1: n + BOHEMIA_BEAT.next(1), e4: n + BOHEMIA_BEAT.next(4) }; }));
      await P.waitForTimeout(170 + (i * 37) % 120);
    }
    const b3 = await P.evaluate(() => window.__beats.slice());
    const run = b3.filter(b => b.cur === b3[b3.length - 1].cur).slice(-8);
    const tg = run.slice(1).map((b, i) => (b.T - run[i].T) * 1000);
    const worstT = tg.length ? Math.max(...tg.map(g => Math.abs(g - 500))) : 999;
    /* the heard stamps: each one's offset from its booked time; a change is a slip */
    const offs = run.map(b => b.e - b.T * 1000), slips = offs.slice(1).filter((o, i) => Math.abs(o - offs[i]) > TOL).length;
    /* every ask, held against the stamp current at that instant: the reader names that stamp's grid */
    const worstAsk = Math.max(...asks.map(a => Math.max(off(a.e1, a.g, 500), off(a.e4, a.g, 125))));
    ok('B3 THE GRID IS THE SONG: ' + run.length + ' booked beats, worst ' + worstT.toFixed(3) + ' ms off 500 on the transport\'s clock; 12 asks name the heard grid, worst ' + worstAsk.toFixed(2) + ' ms off; heard slips ' + slips,
      run.length >= 6 && worstT <= 0.5 && worstAsk <= TOL && slips <= 3, JSON.stringify({ tg, offs: offs.map(o => o.toFixed(1)) }));

    /* B4 / B5: swap the song mid-beat, the new way and the old way */
    async function swapMid(oldWay) {
      return P.evaluate(async (oldWay) => {
        const wait = ms => new Promise(r => setTimeout(r, ms));
        for (let i = 0; i < 40 && Math.abs(BOHEMIA_BEAT.now().phase - 0.35) > 0.08; i++) await wait(10);
        const before = window.__beats.length, last = window.__beats[before - 1], g = last ? last.T * 1000 : 0, cur = MUS.cur, keep = window.__beatNext;
        if (oldWay) window.__beatNext = null;
        try { CITYMUS.on = true; CITYMUS.play(); } finally { window.__beatNext = keep; }
        const swappedTo = MUS.cur, stepAfter = MUS.step;
        await wait(1400);
        const fresh = window.__beats.slice(before).filter(b => b.cur === swappedTo);
        return { g, cur, swappedTo, stepAfter, first: fresh[0] || null, n: fresh.length };
      }, oldWay);
    }
    const sw = await swapMid(false);
    const swOff = sw.first ? off(sw.first.T * 1000, sw.g, 500) : 999;
    ok('B4 A SONG CHANGE KEEPS THE BEAT: swapped mid-beat, the new song\'s first beat lands ' + swOff.toFixed(2) + ' ms off the old grid, from its own bar 1',
      sw.first && swOff <= TOL && sw.first.step === 0 && sw.stepAfter === 0, JSON.stringify(sw));
    const swOld = await swapMid(true);
    const oldOff = swOld.first ? off(swOld.first.T * 1000, swOld.g, 500) : 0;
    ok('B5 THE NET BITES: the same mid-beat swap the old way lands ' + oldOff.toFixed(1) + ' ms off the grid',
      swOld.first && oldOff > 60, JSON.stringify(swOld));
    await P.waitForTimeout(1200);

    /* B6 the clock under a hum: the kit held for four seconds */
    const hum = await P.evaluate(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const held = MUS.drumsHeld, dv = window.drumV; let drums = 0;
      MUS.drumsHeld = function(){ return true; }; window.drumV = function(){ drums++; return dv.apply(this, arguments); };
      await wait(600);
      const before = window.__beats.length, g = window.__beats[before - 1].T * 1000; drums = 0;
      await wait(4000);
      MUS.drumsHeld = held; window.drumV = dv;
      return { g, beats: window.__beats.slice(before), drums };
    });
    const humOff = hum.beats.length ? Math.max(...hum.beats.map(b => off(b.T * 1000, hum.g, 500))) : 999;
    ok('B6 THE CLOCK RUNS UNDER A HUM: the drums held (' + hum.drums + ' kit hits), ' + hum.beats.length + ' beats booked in 4 s, the worst ' + humOff.toFixed(2) + ' ms off the grid',
      hum.beats.length >= 7 && humOff <= TOL, JSON.stringify({ n: hum.beats.length, drums: hum.drums }));

    /* B7 stopped, then started */
    const st = await P.evaluate(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const g = BOHEMIA_BEAT.epoch(), lastT = window.__beats[window.__beats.length - 1].T * 1000; MUS.stop(); await wait(1700);
      const n = performance.timeOrigin + performance.now(), held = BOHEMIA_BEAT.now(), e = n + BOHEMIA_BEAT.next(1);
      const before = window.__beats.length; MUS.start(); await wait(1500);
      return { g, lastT, src: held.src, e, first: window.__beats[before] || null };
    });
    ok('B7 STOPPED, THE GRID RUNS ON (' + st.src + ', ' + off(st.e, st.g, 500).toFixed(2) + ' ms off); STARTED AGAIN, the song comes in ' + (st.first ? off(st.first.T * 1000, st.lastT, 500).toFixed(2) : '?') + ' ms off it',
      st.src === 'held' && off(st.e, st.g, 500) <= TOL && st.first && off(st.first.T * 1000, st.lastT, 500) <= 0.5 && st.first.step === 0, JSON.stringify(st));

    /* B8 the fight reads it: a stand-in frame by the fight's name */
    const fr = await P.evaluate(async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      const f = document.createElement('iframe'); f.id = 'fightFrame'; f.style.cssText = 'position:fixed;width:1px;height:1px;left:-9px;top:-9px;border:0';
      f.srcdoc = '<script>window.__got=[];window.__ans=0;addEventListener("message",function(e){if(e.data&&e.data.type==="BOHEMIA_BEAT"){__got.push({m:e.data,at:performance.timeOrigin+performance.now()});if(__asked)__ans++;}});window.__asked=false;window.ask=function(){parent.postMessage({type:"BOHEMIA_BEAT_ASK"},"*");};<\/script>';
      document.body.appendChild(f); await wait(2300);
      const cw = f.contentWindow, got = cw.__got.slice(), has = !!cw.BOHEMIA_BEAT;
      let mine = null; if (has) { const n = cw.performance.now(); mine = { origin: cw.performance.timeOrigin, at: n, q: n + cw.BOHEMIA_BEAT.next(4) }; }
      cw.__asked = true; cw.ask(); await wait(150);   /* the frame's own function, so the frame is the message's source */
      const ans = cw.__ans; const g = BOHEMIA_BEAT.epoch(); f.remove();
      return { got, has, mine, ans, g };
    });
    const msgOff = fr.got.length ? Math.max(...fr.got.map(x => off(x.at + x.m.inMs, fr.g, 500))) : 999;
    const qOff = fr.mine ? off(fr.mine.origin + fr.mine.q, fr.g, 125) : 999;
    ok('B8 THE FIGHT READS IT: handed BOHEMIA_BEAT ' + fr.has + ', ' + fr.got.length + ' beat messages in 2.3 s (worst ' + msgOff.toFixed(1) + ' ms off the grid, the post\'s own delay included), its quarter beat ' + qOff.toFixed(2) + ' ms off, an ASK answered ' + fr.ans,
      fr.has && fr.got.length >= 3 && msgOff <= 25 && qOff <= TOL && fr.ans >= 1 && fr.got.every(x => x.m.msPerBeat === 500 && x.m.inMs >= -5 && x.m.inMs <= 1005),
      JSON.stringify({ n: fr.got.length, first: fr.got[0], mine: fr.mine }));

    /* B9 divisions */
    const dv = await P.evaluate(() => { const n = performance.timeOrigin + performance.now(); return { n, d1: BOHEMIA_BEAT.next(1), d2: BOHEMIA_BEAT.next(2), d3: BOHEMIA_BEAT.next(3), d16: BOHEMIA_BEAT.next(16), lead: BOHEMIA_BEAT.next(1, 600), s: [1, 2, 3, 4, 5, 8, 16, 32].map(BOHEMIA_BEAT.div) }; });
    ok('B9 A DIVISION IS THE SAME GRID, FINER (snaps ' + dv.s.join(',') + '; the next half beat is the next beat or 250 ms before it; a 600 ms lead lands a beat on)',
      JSON.stringify(dv.s) === '[1,2,2,4,4,8,16,16]' && Math.abs(dv.d3 - dv.d2) < 0.01 && dv.d16 <= dv.d2 + 0.01
        && (Math.abs(dv.d1 - dv.d2) < 1 || Math.abs(dv.d1 - dv.d2 - 250) < 1) && dv.lead >= 600 && dv.lead < 1100 && Math.abs(((dv.lead - dv.d1) % 500 + 500) % 500) < 1,
      JSON.stringify(dv));

    /* B10 an offline render never moves the grid */
    const off10 = await P.evaluate(() => { const a = BOHEMIA_BEAT.probe(), keep = MUS.AC; MUS.AC = new OfflineAudioContext(1, 4410, 44100);
      try { window.__beatBooked(0.5, 0); } finally { MUS.AC = keep; } const b = BOHEMIA_BEAT.probe(); return { a, b }; });
    ok('B10 AN OFFLINE RENDER NEVER MOVES THE GRID', off10.b.booked === off10.a.booked && off10.b.epoch === off10.a.epoch, JSON.stringify(off10));

    const pe = await P.evaluate(() => window.__errs.slice());
    ok('B11 nothing threw', !errs.length && !pe.length, errs.concat(pe).join(' | '));
  } catch (e) {
    ok('the run [' + String(e && e.message).slice(0, 200) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
  done();
})();
