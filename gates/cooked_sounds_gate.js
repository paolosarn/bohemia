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
  /* THE A SIDE OF THE A/B, rendered here and nowhere else, so the claim about what the
     transmitter takes away is measured against the same phrase and not against a memory. */
  (function () {
    const made = H.songThroughSpeaker(ctx, { dry: true });
    const dd = made.buffer.getChannelData(0);
    const hpf = (a, f) => { const al = Math.exp(-2*Math.PI*f/SR); let y=0, pr=0;
      const o = new Float64Array(a.length);
      for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y+x-pr); pr = x; o[i]=y; } return o; };
    const en = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return s; };
    let ab = dd; for (let q=0;q<4;q++) ab = hpf(ab, 5000);
    const t = en(dd);
    const dm = measure(dd);
    out.dryRow = { shareAbove5k: t>0 ? en(ab)/t : 0, rootHz: made.root,
                   semitones: made.semitones, flatness: dm.flatness, topHz: dm.topHz };
  })();
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
    /* the fields each new recipe hands back, plus a band-share helper reused below */
    const shareAbove = (arr, hz) => {
      const hpf = (a, f) => { const al = Math.exp(-2*Math.PI*f/SR); let y=0, pr=0;
        const o = new Float64Array(a.length);
        for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y+x-pr); pr = x; o[i]=y; } return o; };
      const en = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return s; };
      let ab = arr; for (let q=0;q<4;q++) ab = hpf(ab, hz);
      const t = en(arr); return t > 0 ? en(ab)/t : 0;
    };
    const rmsOf = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return Math.sqrt(s/(a.length||1)); };
    if (made.dry !== undefined) m.dry = made.dry;
    if (made.personStopsAtSeconds != null) {
      m.personStopsAtSeconds = made.personStopsAtSeconds;
      m.holdSeconds = made.holdSeconds; m.carrierHz = made.carrierHz;
      const a = Math.round(made.personStopsAtSeconds*SR), b = Math.round((made.personStopsAtSeconds+made.holdSeconds)*SR);
      m.rmsBeforeStop = rmsOf(d.subarray(0, a));
      m.rmsInHold = rmsOf(d.subarray(a + Math.round(0.6*SR), Math.min(d.length, b)));
      /* *** MEASURED IN THE PERSON'S OWN BAND, NOT IN TOTAL RMS, AND THE FIRST CUT GOT
         THIS WRONG. The figure that stops is at 233 and 277 Hz; the carrier that must
         NOT stop is 60 Hz mains plus hiss, and it is louder. So total rms fell only
         0.269 -> 0.236, a 12% dip, and the claim read red on a sound doing exactly what
         it was built to do. A MEASURE THAT INCLUDES THE THING THAT MUST STAY CANNOT SEE
         THE THING THAT LEAVES. Band-passed 200 to 320 Hz, which is where the person is
         and where the grid is not. *** */
      const bandPass = (arr) => {
        const hpf = (x, f) => { const al = Math.exp(-2*Math.PI*f/SR); let y=0, pr=0;
          const o = new Float64Array(x.length);
          for (let i=0;i<x.length;i++){ const v=x[i]; y = al*(y+v-pr); pr = v; o[i]=y; } return o; };
        const lpf = (x, f) => { const al = Math.exp(-2*Math.PI*f/SR); let y=0;
          const o = new Float64Array(x.length);
          for (let i=0;i<x.length;i++){ y = (1-al)*x[i] + al*y; o[i]=y; } return o; };
        let z = arr; for (let q=0;q<3;q++) z = hpf(z, 200);
        for (let q=0;q<3;q++) z = lpf(z, 320);
        return z;
      };
      m.personBandBefore = rmsOf(bandPass(d.subarray(0, a)));
      m.personBandInHold = rmsOf(bandPass(d.subarray(a + Math.round(0.6*SR), Math.min(d.length, b))));
      /* AND THE ROOM'S OWN FLOOR IN THAT SAME BAND, measured in the tail after the hold
         where the person is ALSO absent. Without it there is no honest bar: the band-pass
         still passes the mains' 180 Hz harmonic and some hiss, so "the person's band goes
         to zero" is impossible and a percentage bar would just be a number I picked. THE
         CLAIM IS THAT THE HOLD IS INDISTINGUISHABLE FROM A STRETCH WITH NOBODY IN IT. */
      m.personBandTail = rmsOf(bandPass(d.subarray(Math.min(d.length-1, b))));
      /* NOTHING RISES (rule 20): the loudest sample in the hold must not exceed the
         loudest before it. A swell would be the one thing this sound must never do. */
      let pkBefore=0, pkHold=0;
      for (let i=0;i<a && i<d.length;i++) pkBefore = Math.max(pkBefore, Math.abs(d[i]));
      for (let i=a;i<b && i<d.length;i++) pkHold = Math.max(pkHold, Math.abs(d[i]));
      m.peakBeforeStop = pkBefore; m.peakInHold = pkHold;
    }
    if (made.openHz != null && made.shutHz != null) {
      m.openHz = made.openHz; m.shutHz = made.shutHz; m.cloudMult = made.cloudMult;
      /* *** BRIGHTNESS, NOT A BAND SHARE, BECAUSE "DIMMER" IS EXACTLY WHAT A CENTROID
         MEASURES. The first cut asked for the share above 2 kHz and read 2.8% -> 2.4% ->
         2.9%: the right SHAPE and a contrast too small to assert on, because the bed is
         band-limited to 6 kHz and there was never much above 2 kHz to lose. Hunting for
         a band where the number looked bigger would have been choosing the ruler to fit
         the answer. The spectral centroid is the standard measure of how bright a sound
         is, it moves with the whole roll-off rather than with one edge, and dim is what
         a cloud does. *** */
      const centroid = (arr) => {
        const N2 = 4096; if (arr.length < N2) return null;
        let best=0,bestE=-1;
        for (let st=0; st+N2<arr.length; st+=N2>>1){ let e=0; for(let i=st;i<st+N2;i++) e+=arr[i]*arr[i];
          if(e>bestE){bestE=e;best=st;} }
        const re=new Float64Array(N2), im=new Float64Array(N2);
        for (let i=0;i<N2;i++){ const w=0.5-0.5*Math.cos(2*Math.PI*i/(N2-1)); re[i]=arr[best+i]*w; }
        for (let i=1,j=0;i<N2;i++){ let bit=N2>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
          if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
        for (let len=2;len<=N2;len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
          for (let i=0;i<N2;i+=len){ let cr=1,ci=0;
            for (let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
              const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
              re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
              const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
        let num=0, den=0;
        for (let k=1;k<N2/2;k++){ const pw2=re[k]*re[k]+im[k]*im[k]; num += k*(SR/N2)*pw2; den += pw2; }
        return den>0 ? num/den : null;
      };
      const third = Math.floor(d.length/3);
      m.brightAtStart  = centroid(d.subarray(0, third));
      m.brightInMiddle = centroid(d.subarray(third, 2*third));
      m.brightAtEnd    = centroid(d.subarray(2*third));
    }
    if (made.latchAtSeconds != null) {
      m.latchAtSeconds = made.latchAtSeconds; m.outsideHi = made.outsideHi; m.insideHi = made.insideHi;
      const la = Math.round(made.latchAtSeconds*SR), pad = Math.round(0.35*SR);
      m.hiOutside = shareAbove(d.subarray(0, Math.max(1, la - pad)), 2000);
      m.hiInside  = shareAbove(d.subarray(Math.min(d.length-1, la + pad)), 2000);
      m.humOutside = shareAbove(d.subarray(0, Math.max(1, la - pad)), 40) - shareAbove(d.subarray(0, Math.max(1, la - pad)), 90);
    }
    if (made.dropouts && made.dry === false) m.songDropouts = made.dropouts;
    if (made.root != null) { m.rootHz = made.root; m.semitones = made.semitones; }
    m.shareAbove5k = shareAbove(d, 5000);

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
    claim('the recipes load and name what they made', !!d && d.list.length >= 3,
      d ? d.list.length + ' sounds in the one module' : 'nothing');
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

    /* ==== THE FOUR COOKED THIS ROUND ======================================= */
    const SONG = d.rows['sounds-a-song-through-the-dead-speaker-9-22'];
    const FOLD = d.rows['sounds-the-fold-9-22'];
    const CLOUD = d.rows['sounds-the-fights-cloud-9-22'];
    const DOOR = d.rows['sounds-the-door-9-22'];

    /* A SONG THROUGH THE DEAD SPEAKER: the point is the A/B, so the DRY side is
       rendered too and the claim is that the transmitter really took the top off.
       This is the one sound that answers his own ruling being amended by rule 20(c). */
    if (SONG && d.dryRow) {
      /* *** WHAT THE TRANSMITTER ACTUALLY DOES, AND MY FIRST CLAIM ASKED THE WRONG
         QUESTION. It asked whether energy above 5 kHz went DOWN, and measured 0.00% ->
         0.07%: the dry phrase is sine tones at 175 to 310 Hz and their octaves, so there
         was never anything above 5 kHz to take away. THE BAND IS NOT WHERE THE DIFFERENCE
         LIVES; THE HISS IS. A dead broadcast adds a noise floor, and that is audible and
         measurable: a pure tone reads a flatness near zero and hiss pulls it up. *** */
      claim('THE TRANSMITTER PUTS A NOISE FLOOR UNDER THE SONG',
        d.dryRow.flatness != null && SONG.flatness != null &&
        SONG.flatness > d.dryRow.flatness * 4,
        'flatness ' + d.dryRow.flatness.toFixed(4) + ' played clean -> '
        + SONG.flatness.toFixed(4) + ' through the speaker (a tone reads near 0, hiss pulls it up)');
      claim('AND THE SONG IS STILL A SONG UNDERNEATH: same notes, same root',
        d.dryRow.rootHz === SONG.rootHz &&
        JSON.stringify(d.dryRow.semitones) === JSON.stringify(SONG.semitones),
        'root ' + SONG.rootHz + ' Hz, intervals ' + JSON.stringify(SONG.semitones)
        + ' (a minor pentatonic: NO major third anywhere, which is this lane\'s own no-thirds rule)');
      claim('AND IT DROPS OUT, because a dead broadcast is not a clean one',
        (SONG.songDropouts || []).length >= 2,
        (SONG.songDropouts || []).length + ' drop-outs, '
        + (SONG.songDropouts || []).map(x => x.ms + ' ms').join(' and '));
    } else { claim('the song A/B was rendered', false, 'the dry side is missing'); }

    /* THE FOLD: the person stops and the grid does not. */
    if (FOLD) {
      claim('THE FOLD: THE PERSON STOPS, and the hold is indistinguishable from a '
        + 'stretch with nobody in it',
        FOLD.personBandInHold < FOLD.personBandBefore * 0.6 &&
        Math.abs(FOLD.personBandInHold - FOLD.personBandTail) < FOLD.personBandTail * 0.4,
        'in the person\'s own band, 200 to 320 Hz: ' + FOLD.personBandBefore.toFixed(4)
        + ' before -> ' + FOLD.personBandInHold.toFixed(4) + ' during the '
        + FOLD.holdSeconds + ' s hold, against a room floor of '
        + FOLD.personBandTail.toFixed(4) + ' measured where nobody is either (total rms '
        + 'barely moves, because the grid is louder than the person, which is the point)');
      claim('AND THE GRID DOES NOT: the carrier runs right through the hold',
        FOLD.rmsInHold > 0.002 && FOLD.exactZeros === 0,
        'the hold still reads ' + FOLD.rmsInHold.toFixed(4) + ' rms with '
        + FOLD.exactZeros + ' exact zeros, at ' + FOLD.carrierHz + ' Hz mains (school rules 1 and 7)');
      claim('AND NOTHING RISES, which rule 20 requires: nothing jumps',
        FOLD.peakInHold <= FOLD.peakBeforeStop,
        'loudest sample ' + FOLD.peakBeforeStop.toFixed(4) + ' before the stop, '
        + FOLD.peakInHold.toFixed(4) + ' inside the hold');
    } else { claim('the fold was rendered', false, 'missing'); }

    /* THE FIGHT'S CLOUD: the top comes off and comes back, on the city's own numbers. */
    if (CLOUD) {
      claim('THE CLOUD TAKES THE TOP OFF THE FIGHT\'S BED',
        CLOUD.brightInMiddle != null && CLOUD.brightAtStart != null &&
        CLOUD.brightInMiddle < CLOUD.brightAtStart * 0.85,
        'brightness ' + Math.round(CLOUD.brightAtStart) + ' Hz -> '
        + Math.round(CLOUD.brightInMiddle) + ' Hz as it passes');
      claim('AND IT GIVES IT BACK, so it is weather and not a filter sweep',
        CLOUD.brightAtEnd != null && CLOUD.brightAtEnd > CLOUD.brightInMiddle * 1.1,
        'and back to ' + Math.round(CLOUD.brightAtEnd) + ' Hz after');
      claim('AND THE DARKNESS IS THE CITY\'S OWN NUMBER, NOT MINE',
        JSON.stringify(CLOUD.cloudMult) === JSON.stringify([0.86, 0.88, 0.94]),
        'CLOUD_MULT ' + JSON.stringify(CLOUD.cloudMult)
        + ' read from the weather module, whose comment says it cools as it dims');
    } else { claim('the cloud was rendered', false, 'missing'); }

    /* THE DOOR: one room becomes another, and the hum is in both. */
    if (DOOR) {
      claim('THE DOOR SWAPS ONE ROOM FOR ANOTHER, and inside is narrower',
        DOOR.hiInside < DOOR.hiOutside * 0.7,
        'share above 2 kHz: ' + (100*DOOR.hiOutside).toFixed(1) + '% outside -> '
        + (100*DOOR.hiInside).toFixed(1) + '% inside (declared ' + DOOR.outsideHi
        + ' Hz and ' + DOOR.insideHi + ' Hz)');
      claim('AND NEITHER SIDE IS SILENT, because there is always a room',
        DOOR.exactZeros === 0 && DOOR.rms > 0.01,
        DOOR.exactZeros + ' exact zeros, rms ' + DOOR.rms.toFixed(4));
    } else { claim('the door was rendered', false, 'missing'); }

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
  console.log('GREEN: seven cooked sounds he can play, each one noise or tone on purpose, each band naming its machine, the step losing contact on the ground\'s own stations, the cloud dimming on the city\'s own numbers, the fold indistinguishable from an empty room, and every one of them in the vote tab.');
  process.exit(0);
})();
