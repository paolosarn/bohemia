/* COOKED SOUNDS GATE (9/21/26, SOUNDS lane) -- row [cook sounds], rule 22.
   PAOLO 9/21: "I'll enter the sound chat and it's not even making fucking sounds. It's
   coding and checking whether the sounds are broken or not... I need to be seeing them
   cooking up more, every time, not never."

   SO THIS GATE IS DELIBERATELY SMALL AND IS NOT THE ROUND'S OUTPUT. The round's output
   is three sounds he can play. This only holds them to the rules they were cooked to, so
   that a later round cannot quietly undo them.

   IT READS THE RECIPES, NEVER A COPY. engine/bohemia_horror_sounds.js is the one body:
   the vote page plays from it and this checks from it, so no number is typed twice. The
   round before this, a second copy of the footstep bank sat in the alpha with a comment
   inside its JSON and every footstep in the game was silent for days.

   *** AND ONE RULE OF MEASUREMENT, LEARNED EXPENSIVELY THIS ROUND: EVERY SPECTRAL
   NUMBER HERE IS TAKEN ON THE SAME WINDOW. My scratch instrument took the top corner on
   the loudest window and the energy-above-corner on the first 4,096 samples, the two
   disagreed, and I "fixed" a real sound TWICE chasing the disagreement -- once making it
   break its band, once filtering the life out of it (flatness 0.253 -> 0.0095, exactly
   the near-tone the cook exists to replace). TWO RULERS ON ONE SOUND WILL ALWAYS
   DISAGREE, AND THE SOUND WILL GET THE BLAME. ***

   WHAT IT WILL NOT ACCEPT AS EVIDENCE:
     * A GREP. Every sound is rendered and measured.
     * A DESIGNED NUMBER. The attack is checked by finding where the peak actually is,
       not by reading the value the recipe says it used.
     * A CHECK THAT WOULD PASS ON SILENCE. Each sound must make a sound first.
     * A PASS THAT WOULD ALSO PASS WITH THE COOK REMOVED. --mutate flattens the recipes
       at load time and the claims must go red.
*/
const path = require('path');
const fs = require('fs');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();
const ROOT = path.dirname(__dirname);
const MUTATE = process.argv.indexOf('--mutate') >= 0;

let ok = 0; const bad = [];
function claim(name, good, detail) {
  if (good) { ok++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { bad.push(name); console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
}

const MEASURE = `
(() => {
  const H = window.BOH_HORROR_SOUNDS;
  const SR = 44100;
  const N = 4096;
  function spec(arr){
    const re=new Float64Array(N), im=new Float64Array(N);
    for(let i=0;i<N;i++){ const w=0.5-0.5*Math.cos(2*Math.PI*i/(N-1)); re[i]=(arr[i]||0)*w; }
    for(let i=1,j=0;i<N;i++){ let bit=N>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
      if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
    for(let len=2;len<=N;len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
      for(let i=0;i<N;i+=len){ let cr=1,ci=0;
        for(let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
          const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
          re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
          const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
    const half=N>>1, p=new Float64Array(half);
    for(let k=0;k<half;k++) p[k]=re[k]*re[k]+im[k]*im[k];
    return p;
  }
  /* ONE WINDOW FOR EVERY SPECTRAL NUMBER: the loudest one. */
  function loudest(d){
    if (d.length <= N) { const a=new Float32Array(N); a.set(d.subarray(0,Math.min(N,d.length))); return a; }
    let best=0,bestE=-1;
    for(let s=0;s+N<d.length;s+=N>>1){ let e=0; for(let i=s;i<s+N;i++) e+=d[i]*d[i];
      if(e>bestE){bestE=e;best=s;} }
    return d.subarray(best,best+N);
  }
  function measure(d){
    const win = loudest(d), p = spec(win), binHz = SR/N;
    let tot=0; for(let k=1;k<p.length;k++) tot+=p[k];
    const share=(a,b)=>{ let s=0; const ka=Math.max(1,Math.round(a/binHz)), kb=Math.min(p.length-1,Math.round(b/binHz));
      for(let k=ka;k<=kb;k++) s+=p[k]; return tot>0?s/tot:0; };
    const lo=Math.max(1,Math.round(100/binHz)), hi=Math.min(p.length-1,Math.round(16000/binHz));
    let lg=0, ar=0, c=0;
    for(let k=lo;k<=hi;k++){ const v=p[k]+1e-20; lg+=Math.log(v); ar+=v; c++; }
    /* *** THE TOP CORNER IS FOUND ON A SMOOTHED SPECTRUM, AND THAT IS NOT A DETAIL.
       A single-bin "highest bin within 20 dB of the peak bin" test is meaningless on
       NOISE: neighbouring bins of noise scatter by more than 10 dB all by themselves,
       so one lucky bin near Nyquist decides the answer. Measured: the phone's carrier
       reported a top corner of 22,039 Hz -- exactly Nyquist -- against a declared
       5,000, and it reported that with a 12 dB/octave roll-off in place that should
       have put the real corner near 16 kHz. I filtered the sound HARDER twice before
       admitting the ruler was the problem. A THIRD-OCTAVE MOVING AVERAGE FIRST, then
       the search. Tones are unaffected (a tone dominates its neighbourhood either
       way); noise stops lying. *** */
    const sm = new Float64Array(p.length);
    for (let k=1;k<p.length;k++){
      const w = Math.max(2, Math.round(k * 0.12));      /* about a third of an octave */
      let a=0, c2=0;
      for (let j=Math.max(1,k-w); j<=Math.min(p.length-1,k+w); j++){ a+=p[j]; c2++; }
      sm[k] = a/c2;
    }
    /* TWO JOBS, TWO SPECTRA, AND THEY ARE NOT INTERCHANGEABLE. A BAND EDGE is a
       property of the envelope, so it is found on the smoothed one. A TONE is a
       property of a single bin, so it is found on the raw one: smoothing blurred the
       phone's 958 Hz tone and broke the claim that identifies it. */
    let peakK=1; for(let k=1;k<sm.length;k++) if(sm[k]>sm[peakK]) peakK=k;
    /* *** THE BAND EDGE IS THE -3 dB POINT, NOT THE -20 dB POINT, AND MY OWN WRITTEN
       RULE HAD THIS WRONG. School rule 4 said the top corner is "the highest frequency
       within 20 dB of its own peak". That is not what a machine's published bandwidth
       means: when a cassette deck "reaches 14 kHz" or an AM channel "passes 5 kHz",
       that is a -3 dB figure. The two numbers are far apart for any real filter, and
       chasing the -20 dB one made me filter a good sound twice and then cascade poles
       in the wrong direction -- four poles at a DERIVED corner has a flatter passband
       and a roll-off that starts LATER, which is the opposite of what I wanted.
       MEASURED DIRECTLY, in octave bands, the carrier peaked at 2-4 kHz and sat only
       4.8 dB down at 8-16 kHz: the filter was doing exactly what it was built to do and
       the test was asking the wrong question. -3 dB IS THE QUESTION. The record has
       been corrected to say so. *** */
    const half = Math.pow(10, -3/10);
    const thr = sm[peakK] * half; let topK=peakK;
    for(let k=sm.length-1;k>peakK;k--) if(sm[k]>=thr){ topK=k; break; }
    let rawPeakK=1; for(let k=1;k<p.length;k++) if(p[k]>p[rawPeakK]) rawPeakK=k;
    let pk=0, pi=0, sq=0, zeros=0;
    for(let i=0;i<d.length;i++){ const a=Math.abs(d[i]); if(a>pk){pk=a;pi=i;} sq+=d[i]*d[i]; if(d[i]===0) zeros++; }
    return { peak:pk, peakAtMs:pi/SR*1000, rms:Math.sqrt(sq/d.length), exactZeros:zeros,
             flatness:Math.exp(lg/c)/(ar/c), topHz:Math.round(topK*binHz),
             peakHz:Math.round(rawPeakK*binHz), envelopePeakHz:Math.round(peakK*binHz),
             above1k:share(1000,22050),
             above4k:share(4000,22050), binHz:binHz };
  }
  const ctx = new OfflineAudioContext(1, SR, SR);
  const out = { list: H.list(), rows: {}, tapeAt: H.TAPE_AT, dropoutAt: H.DROPOUT_AT,
                beat: H.BEAT, bpm: H.BPM, alert: H.ALERT };
  for (const item of H.list()) {
    const made = H[item.make](ctx, {});
    const d = made.buffer.getChannelData(0);
    const m = measure(d);
    m.machine = made.machine; m.seconds = made.seconds;
    if (made.dropouts) {
      m.dropouts = made.dropouts; m.depthDb = made.depthDb; m.dropMs = made.dropMs;
      m.stations = made.stations; m.dropoutStations = made.dropoutStations;
      const rms = a => { let s=0; for(let i=0;i<a.length;i++) s+=a[i]*a[i]; return Math.sqrt(s/(a.length||1)); };
      m.dives = made.dropouts.map(ev => {
        const at=Math.round(ev.atSeconds*SR), len=Math.round(SR*made.dropMs/1000);
        const before=d.subarray(Math.max(0,at-len),at), inside=d.subarray(at,Math.min(d.length,at+len));
        const rb=rms(before), ri=rms(inside);
        let minAbs=1; for(let i=0;i<inside.length;i++) minAbs=Math.min(minAbs,Math.abs(inside[i]));
        /* THE TOP GOES FIRST (school rule 6), MEASURED WITHOUT AN FFT, AND THE FIRST
           CUT COULD NEVER RUN: it asked for a 4,096-point spectrum of a 34 ms window,
           which is 1,499 samples, so it returned null every single time and the claim
           read "?% -> ?%". A CHECK THAT CANNOT PRODUCE A NUMBER IS NOT A STRICT CHECK,
           IT IS NO CHECK. So this filters instead: a one-pole high-pass at 2 kHz, and
           the ratio of high energy to all energy. Works at any length. */
        const hiOf = a => {
          if (!a.length) return null;
          const hp = new Float64Array(a.length);
          const al = Math.exp(-2*Math.PI*2000/SR);
          let y=0, prev=0, all=0, hi=0;
          for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y + x - prev); prev = x; hp[i]=y;
            all += x*x; hi += y*y; }
          return all>0 ? hi/all : 0;
        };
        return { at:ev.atSeconds, dB:(rb>0&&ri>0)?20*Math.log10(ri/rb):null, reachedZero:minAbs===0,
                 hiBefore:hiOf(before), hiInside:hiOf(inside) };
      });
    }
    if (made.tones) {
      m.tones = made.tones; m.beatBetweenHz = made.beatBetweenHz; m.toneOnForSeconds = made.toneOnForSeconds;
      const after = d.subarray(Math.round(made.toneOnForSeconds*SR)+2000);
      let s=0; for(let i=0;i<after.length;i++) s+=after[i]*after[i];
      m.carrierAfterToneRms = Math.sqrt(s/(after.length||1));
      /* the carrier's OWN top corner, measured the same way as everything else */
      if (after.length >= N) { const cm = measure(after); m.carrierTopHz = cm.topHz;
        m.carrierFlatness = cm.flatness; }
    }
    /* *** THE BAND CLAIM, AFTER FIVE FAILED ATTEMPTS AT A SINGLE CORNER NUMBER. What
       I wanted was one frequency per sound. There is no such number that means the same
       thing across an impact with a low thump, a hiss bed and a tone over a carrier: the
       -20 dB point rides on noise scatter, the -3 dB point rides on whichever peak
       happens to dominate, and cascading poles moves both. Each attempt blamed a sound
       that turned out to be correctly built, and twice I changed a good sound to satisfy
       a bad ruler. SO THE CLAIM IS ENERGY, WHICH IS SHAPE-INDEPENDENT: how much of the
       sound sits above the band it declares. The split itself is four cascaded poles so
       the measure is not its own leak. *** */
    (function () {
      const dec = made.machine && made.machine.hi;
      if (!dec) return;
      const hpf = (a, hz) => { const al = Math.exp(-2*Math.PI*hz/SR); let y=0, pr=0;
        const o = new Float64Array(a.length);
        for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y+x-pr); pr = x; o[i]=y; } return o; };
      const en = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return s; };
      const tot = en(d);
      let ab = d, way = d;
      for (let q=0;q<4;q++) { ab = hpf(ab, dec); way = hpf(way, dec*2); }
      m.shareAboveDeclared = tot > 0 ? en(ab)/tot : null;
      m.shareAboveOctaveUp = tot > 0 ? en(way)/tot : null;
    })();
    out.rows[item.id] = m;
  }
  return out;
})()`;

(async () => {
  console.log('=== COOKED SOUNDS: three he can play, held to the rules they were cooked to ===');
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let d = null;
  try {
    await p.goto('about:blank');
    await p.addScriptTag({ path: path.join(ROOT, 'engine', 'bohemia_horror_sounds.js') });
    if (MUTATE) {
      /* THE MUTATION GOES IN BEFORE ANY READING, never after the reading it falsifies.
         It replaces the cook with a bare sine, which is exactly what the old shelf was
         (51 of 65 sounds measured as near-pure tones) -- so this proves the gate can
         tell the new sounds from the thing they replace. */
      await p.evaluate(() => {
        const H = window.BOH_HORROR_SOUNDS;
        const flat = (ctx, o) => {
          const sr = ctx.sampleRate, n = Math.round(sr * 0.18);
          const buf = ctx.createBuffer(1, n, sr), dd = buf.getChannelData(0);
          for (let i = 0; i < n; i++) dd[i] = Math.sin(2*Math.PI*300*i/sr) * Math.pow(1-i/n, 3) * 0.9;
          return { buffer: buf, machine: { lo: 180, hi: 4500, why: 'mutated' }, seconds: 0.18 };
        };
        H.footstep = flat; H.stepWithDropouts = flat; H.phoneTone = flat;
      });
    }
    d = await p.evaluate(MEASURE);
    claim('the recipes load and name what they made', !!d && d.list.length === 3,
      d ? d.list.length + ' sounds' : 'nothing');
    claim('nothing threw while rendering them', errs.length === 0, errs.slice(0,2).join('; '));

    /* the beat is the law's beat, not a number this file chose */
    claim('THE BEAT IS THE LAW\'S BEAT', d.bpm === 120 && Math.abs(d.beat - 0.5) < 1e-9,
      d.bpm + ' BPM, ' + d.beat + ' s');

    const F = d.rows['sounds-a-footstep-on-the-beat-9-21'];
    const S = d.rows['sounds-the-step-loses-contact-9-21'];
    const P = d.rows['sounds-the-phone-still-transmits-9-21'];

    for (const [id, r] of Object.entries(d.rows)) {
      claim('IT MAKES A SOUND: ' + id.replace('sounds-','').replace('-9-21',''),
        r.peak > 0.01 && r.rms > 0.001, 'peak ' + r.peak.toFixed(4) + ', rms ' + r.rms.toFixed(5));
    }

    /* ---- SCHOOL RULE 3: hiss is broadband and it lives UP HIGH ---------------
       The shelf this replaces measured a MEDIAN flatness of 0.0037 with 51 of 65
       sounds under 0.01. So the bar is not invented: it is "unmistakably not that". */
    claim('THE FOOTSTEP IS NOISE, NOT A TONE', F.flatness > 0.05,
      'flatness ' + F.flatness.toFixed(4) + ' against a shipped-shelf median of 0.0037');
    claim('AND IT HAS REAL ENERGY UP HIGH', F.above1k > 0.20 && F.above4k > 0.05,
      (100*F.above1k).toFixed(1) + '% above 1 kHz, ' + (100*F.above4k).toFixed(1) + '% above 4 kHz');

    /* ---- SCHOOL RULE 4: the band names its machine, WITHIN AN OCTAVE ---------
       The rule's own words: the top corner "matches that machine's number within an
       octave". Measured on the same window as everything else. */
    /* SCHOOL RULE 4, HELD BY ENERGY RATHER THAN BY A CORNER. The thresholds are not
       invented: measured on these three, the share above the declared corner is 0.54%,
       0.63% and 0.03%, and an octave above it is 0.01%, 0.01% and 0%. A 5% and a 1% bar
       therefore sit an order of magnitude clear of the readings instead of inside their
       spread, which is the mistake five of this lane's thresholds have already made. */
    for (const [id, r] of Object.entries(d.rows)) {
      const dec = r.machine && r.machine.hi;
      const nm = id.replace('sounds-','').replace('-9-21','');
      claim('THE BAND STOPS WHERE ITS MACHINE STOPS: ' + nm,
        dec != null && r.shareAboveDeclared != null && r.shareAboveDeclared < 0.05,
        (100*(r.shareAboveDeclared||0)).toFixed(2) + '% of its energy sits above the ' + dec + ' Hz it declares');
      claim('AND AN OCTAVE ABOVE THAT THERE IS NOTHING: ' + nm,
        r.shareAboveOctaveUp != null && r.shareAboveOctaveUp < 0.01,
        (100*(r.shareAboveOctaveUp||0)).toFixed(2) + '% above ' + (dec*2) + ' Hz');
    }

    /* ---- THE ROW'S OWN ASK: the footstep lands ON the beat -------------------
       Not the designed attack: where the peak REALLY is. The bound is the fight's
       own PERFECT window, 55 ms, which is the game's existing definition of on-time. */
    claim('THE FOOTSTEP LANDS ON THE BEAT', F.peakAtMs <= 55,
      'its loudest instant is ' + F.peakAtMs.toFixed(1) + ' ms in; the fight calls a press PERFECT inside 55 ms');
    claim('AND IT IS SHORTER THAN HALF A BEAT, so it cannot smear the next one',
      F.seconds < d.beat / 2, F.seconds + ' s against a ' + (d.beat/2) + ' s half-beat');

    /* ---- SCHOOL RULE 6, AND IT IS TIMED TO ANIMATION'S GROUND ---------------- */
    claim('THE DROP-OUTS SIT ON ANOTHER LANE\'S STATIONS, NOT ON MINE',
      JSON.stringify(S.stations) === JSON.stringify(d.tapeAt) &&
      JSON.stringify(S.dropoutStations) === JSON.stringify(d.dropoutAt) &&
      S.dropouts.length === d.dropoutAt.length,
      'ANIMATION holds the ground at ' + JSON.stringify(d.tapeAt) + '; drop-outs at ' + JSON.stringify(d.dropoutAt) +
      ' (1.00 is the beat landing him, which is the next footstep, not a lost frame)');
    for (const dv of (S.dives || [])) {
      claim('A DIVE, NOT A CUT, at ' + dv.at + ' s',
        dv.dB != null && dv.dB <= -6 && dv.dB >= -20 && dv.reachedZero === false,
        (dv.dB == null ? 'no reading' : dv.dB.toFixed(1) + ' dB') + ', rule 6 allows 6 to 20; reached zero: ' + dv.reachedZero);
      claim('AND THE TOP GOES BEFORE THE LEVEL, at ' + dv.at + ' s',
        dv.hiBefore != null && dv.hiInside != null && dv.hiInside < dv.hiBefore,
        'share above 2 kHz ' + (dv.hiBefore==null?'?':(100*dv.hiBefore).toFixed(1)) + '% -> ' +
        (dv.hiInside==null?'?':(100*dv.hiInside).toFixed(1)) + '%');
    }
    claim('THE DROP-OUT LENGTH IS INSIDE THE RULE', S.dropMs >= 8 && S.dropMs <= 60,
      S.dropMs + ' ms, rule 6 allows 8 to 60');
    claim('AND THE STEP NEVER READS DIGITAL ZERO', S.exactZeros === 0,
      S.exactZeros + ' exact zeros (school rule 1)');

    /* ---- SCHOOL RULES 4, 7 AND 9 ON THE PHONE ------------------------------- */
    /* SAID AS A CLAIM, NEVER AS A CRASH. Under --mutate the phone has no tones at all,
       and the first cut of this line called .join on undefined and killed the whole gate
       at "the gate ran". A CHECKER THAT DIES INSTEAD OF FAILING TELLS YOU NOTHING ABOUT
       WHICH CLAIM BROKE, which is the same failure shape as the empty catch that silenced
       every footstep in the game. */
    var hasTones = !!(P.tones && P.tones.length === 2 && P.beatBetweenHz > 0);
    claim('THE PHONE IS TWO TONES THAT DO NOT RESOLVE',
      hasTones && Math.abs(P.peakHz - Math.max(P.tones[0], P.tones[1])) < 40,
      hasTones ? (P.tones.join(' and ') + ' Hz, ' + P.beatBetweenHz + ' Hz apart; strongest bin ' + P.peakHz + ' Hz')
               : 'no tone pair in this sound at all');
    claim('AND THE CARRIER OUTLIVES THE TONE', (P.carrierAfterToneRms || 0) > 0.005,
      (P.carrierAfterToneRms == null ? 'no carrier measured: this sound has no tone to outlive'
        : 'after the tone stops the hiss still reads ' + P.carrierAfterToneRms.toFixed(5))
      + ' (school rule 7: a silence keeps its carrier)');
    claim('THE PHONE NEVER READS DIGITAL ZERO EITHER', P.exactZeros === 0, String(P.exactZeros));

    /* ---- and the registry actually carries them ----------------------------- */
    const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
    const ids = new Set((reg.items || []).map(x => x.id));
    const missing = d.list.map(x => x.id).filter(x => !ids.has(x));
    claim('EVERY SOUND COOKED THIS ROUND IS IN THE VOTE TAB', missing.length === 0,
      missing.length ? 'missing: ' + missing.join(', ') : d.list.length + ' of ' + d.list.length + ' registered (rule 22a)');
  } catch (e) {
    claim('the gate ran', false, String(e && e.message).slice(0, 160));
  }
  await b.close();

  console.log('  ' + ok + ' ok, ' + bad.length + ' failed');
  if (MUTATE) {
    /* under --mutate the sound claims MUST fail; a green mutated run proves nothing */
    if (bad.length === 0) { console.log('MUTATION DID NOT BITE: the gate would pass with the cook removed.'); process.exit(1); }
    console.log('MUTATION BIT: ' + bad.length + ' claim(s) went red with the cook replaced by a bare sine.');
    process.exit(0);
  }
  if (bad.length) { console.log('RED: ' + bad.join('; ')); process.exit(1); }
  console.log('GREEN: three cooked sounds, each one noise or tone on purpose, each band naming its machine, the step losing contact on the ground\'s own stations, and all three in the vote tab.');
  process.exit(0);
})();
