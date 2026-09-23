/* COOKED SOUNDS GATE (9/21/26, SOUNDS lane) -- row [cook sounds], rule 22.
   PAOLO 9/21: "I'll enter the sound chat and it's not even making fucking sounds. It's
   coding and checking whether the sounds are broken or not... I need to be seeing them
   cooking up more, every time, not never."

   SO THIS GATE IS DELIBERATELY SMALL AND IS NOT THE ROUND'S OUTPUT. The round's output
   is sounds he can play, eight of them now. This only holds them to the rules they were cooked to, so
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
  /* THE ROOM'S CONSTANTS, HANDED BACK SO THE GATE CAN HOLD THEM AGAINST THE ALPHA'S.
     A duplication a machine checks is a fact; one a comment promises is rot waiting. */
  const out = { list: H.list(), rows: {}, tapeAt: H.TAPE_AT, dropoutAt: H.DROPOUT_AT,
    room: H.ROOM,
    /* THE CADENCE, MEASURED BY FINDING THE HITS, not by reading back the list the recipe
       was handed. A recipe that says "I put a footfall at 0.25 s" and did not is exactly
       the class of claim this gate refuses. */
    /* THE FLIP, MEASURED AT THREE LEDGER STATES. Row [flip sound], rule 31. Every number
       is found in the rendered buffer; the recipe's own stated figures are printed beside
       them and never asserted on. */
    flip: (function(){
      const rms=(d,a,b)=>{let s=0,k=0;for(let i=Math.round(a*SR);i<Math.round(b*SR)&&i<d.length;i++){s+=d[i]*d[i];k++;}return k?Math.sqrt(s/k):0;};
      /* ENERGY ABOVE THE TRANSMITTER'S OWN CORNER, which is the whole "no carrier, no band"
         claim and nothing else. Measured on a window inside the stretch asked for. */
      function aboveCorner(d,a,b,corner){
        const N=4096, mid=Math.min(d.length-N, Math.max(0, Math.round(((a+b)/2)*SR - N/2)));
        const seg=new Float32Array(N); seg.set(d.subarray(mid,mid+N));
        const re=new Float64Array(N), im=new Float64Array(N);
        for(let i=0;i<N;i++){ const w=0.5-0.5*Math.cos(2*Math.PI*i/(N-1)); re[i]=seg[i]*w; }
        for(let i=1,j=0;i<N;i++){ let bit=N>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
          if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
        for(let len=2;len<=N;len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
          for(let i=0;i<N;i+=len){ let cr=1,ci=0;
            for(let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
              const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
              re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
              const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
        const binHz=SR/N; let tot=0, hi=0;
        for(let k=1;k<N/2;k++){ const pwr=re[k]*re[k]+im[k]*im[k]; tot+=pwr;
          if(k*binHz>corner) hi+=pwr; }
        return tot>0?hi/tot:0;
      }
      /* IS THE 60 Hz FAMILY THERE? The grid is on in every act (school rule 7). Asked of
         the two stations separately, so a flip that drops the carrier on one side fails. */
      function humAt(d,a,b){
        const N=8192, mid=Math.min(d.length-N, Math.max(0, Math.round(((a+b)/2)*SR - N/2)));
        if(b*SR-a*SR < 2000) return null;              /* too short to ask */
        const seg=new Float32Array(N); seg.set(d.subarray(mid,mid+N));
        let best=0;
        for(const f of [60,120,180]){
          let re=0, im=0;
          for(let i=0;i<N;i++){ const w=0.5-0.5*Math.cos(2*Math.PI*i/(N-1));
            re+=seg[i]*w*Math.cos(2*Math.PI*f*i/SR); im+=seg[i]*w*Math.sin(2*Math.PI*f*i/SR); }
          const mag=Math.sqrt(re*re+im*im)/N; if(mag>best) best=mag;
        }
        return +best.toFixed(5);
      }
      const o={};
      for(const sig of [1,0.5,0]){
        const c2=new OfflineAudioContext(1,SR,SR);
        const m=H.theFlip(c2,{signal:sig});
        const d=m.buffer.getChannelData(0);
        const gA=m.gapFromSeconds, gB=m.gapToSeconds;
        let z=0, pk=0;
        for(let i=0;i<d.length;i++){ if(d[i]===0) z++; const a=Math.abs(d[i]); if(a>pk)pk=a; }
        o['s'+sig]={
          seconds:m.seconds, gapFrom:gA, gapTo:gB, gapLen:m.gapSeconds,
          stationRms:+rms(d,0,gA).toFixed(5), gapRms:+rms(d,gA,gB).toFixed(5),
          landRms:+rms(d,gB,m.seconds).toFixed(5),
          gapOverStation:+(rms(d,gA,gB)/Math.max(1e-9,rms(d,0,gA))).toFixed(3),
          aboveCornerStation:+(aboveCorner(d,0,gA,5000)*100).toFixed(2),
          aboveCornerGap:+(aboveCorner(d,gA,gB,5000)*100).toFixed(2),
          humBefore:humAt(d,0,gA), humAfter:humAt(d,gB,m.seconds),
          exactZeros:z, peak:+pk.toFixed(3), said:m.levels, corner:m.machine.hi
        };
      }
      return o;
    })(),
    cadence: (function(){
      function hits(b){
        const d=b.getChannelData(0), sr=SR, out=[];
        let pk=0; for(let i=0;i<d.length;i++){const a=Math.abs(d[i]); if(a>pk)pk=a;}
        const thr=pk*0.35; let last=-1e9;
        for(let i=0;i<d.length;i++){
          if(Math.abs(d[i])>=thr && (i-last)>Math.round(sr*0.06)){ out.push(+(i/sr).toFixed(3)); last=i; }
        }
        return out;
      }
      const ctx2=new OfflineAudioContext(1,SR,SR);
      const w=H.walkCadence(ctx2,{perBeat:1,beats:8});
      const r=H.walkCadence(ctx2,{perBeat:2,beats:8});
      const hw=hits(w.buffer), hr=hits(r.buffer);
      const gaps=(a)=>a.map((x,i)=>i?+(x-a[i-1]).toFixed(3):null).slice(1);
      return { walkHits:hw.length, runHits:hr.length,
               walkGaps:gaps(hw), runGaps:gaps(hr),
               walkSaid:w.gapSeconds, runSaid:r.gapSeconds, beats:w.beats };
    })(),
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
  /* THE WOBBLE, MEASURED ON A TEST TONE AND SAID TO BE ONE. Wow is a property of a pitch
     over TIME, so it needs a note long enough to hold several cycles of the modulation: at
     1.4 Hz that is seconds, and the song's notes are 460 ms. The tone is declared a probe,
     the game never plays it, and the claim that the SONG gets the same treatment is checked
     separately against the song's own length and notes. */
  (function () {
    const freqTrack = (arr) => {
      const t = []; let prev = arr[0], lastX = null;
      for (let i=1;i<arr.length;i++){
        if (prev < 0 && arr[i] >= 0) {
          const x = i - 1 + (0 - prev) / (arr[i] - prev);   /* sub-sampled crossing */
          if (lastX != null) t.push(SR / (x - lastX));
          lastX = x;
        }
        prev = arr[i];
      }
      return t;
    };
    const analyse = (arr) => {
      const f = freqTrack(arr);
      if (f.length < 40) return null;
      const mean = f.reduce((a,b)=>a+b,0)/f.length;
      let v=0; for (const x of f) v += (x-mean)*(x-mean);
      const depth = Math.sqrt(v/f.length) * Math.SQRT2 / mean;
      const NW = 1024, re = new Float64Array(NW), im = new Float64Array(NW);
      for (let i=0;i<NW;i++){ const w = 0.5-0.5*Math.cos(2*Math.PI*i/(NW-1));
        re[i] = ((f[i] != null ? f[i] : mean) - mean) * w; }
      for (let i=1,j=0;i<NW;i++){ let bit=NW>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
        if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
      for (let len=2;len<=NW;len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
        for (let i=0;i<NW;i+=len){ let cr=1,ci=0;
          for (let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
            const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
            re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
            const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
      let pk=1, pv=-1;
      for (let k=1;k<NW/2;k++){ const m=re[k]*re[k]+im[k]*im[k]; if(m>pv){pv=m;pk=k;} }
      return { depthPct: depth*100, rateHz: pk*mean/NW, meanHz: mean, n: f.length };
    };
    try {
      const wob = H.wowProbe(ctx, {});
      const a = analyse(wob.buffer.getChannelData(0));
      const flat = H.wowProbe(ctx, { depth: 0 });
      const c = analyse(flat.buffer.getChannelData(0));
      const sw = H.songOnTape(ctx, {}), sd = H.songThroughSpeaker(ctx, {});
      out.wow = a ? { depthPct: a.depthPct, rateHz: a.rateHz, meanHz: a.meanHz,
        askedDepthPct: +(wob.wowDepth*100).toFixed(3), askedRateHz: wob.wowRateHz,
        controlDepthPct: c ? c.depthPct : null,
        lengthsMatch: sw.buffer.length === sd.buffer.length,
        songSame: sw.root === sd.root && JSON.stringify(sw.semitones) === JSON.stringify(sd.semitones) } : null;
    } catch (e) { out.wowErr = String(e && e.message).slice(0,90); }
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
        /* AND THE PRECISE FALSIFIER FOR RULE 5 (9/23). A bare sine is the right
           mutation for the three above, because a near-pure tone IS the shelf they
           replace. It is the WRONG mutation for the wobble: rule 5 is not about the
           material, it is about whether the machine playing it holds speed. So the
           mutation for that is a head that holds speed PERFECTLY -- a pass-through.
           MEASURED WITHOUT THIS: 45 ok / 8 failed under mutation, and all four wow
           claims stayed GREEN, because the recipe they read was never touched. A
           claim that cannot fail when the thing it tests is removed is not a claim.
           KNOWN GAP, NAMED NOT FIXED: the four round-two cooks (the song through the
           speaker, the fold, the cloud, the door) are still un-mutated, so their
           claims are proven only by their own controls and not by this harness. A
           uniform sine breaks their row lookups, so each needs its own falsifier the
           way the wobble just got one.
           AND IT REPLACES THE RECIPES, NOT wowFlutter. First cut swapped H.wowFlutter
           and the four claims stayed green anyway, because wowProbe and songOnTape call
           the module's own local wowFlutter by closure and never look at the export.
           REPLACING A FUNCTION SOMETHING DOES NOT CALL IS NOT A MUTATION, and the
           evidence that it was not one was a mutated run that still read 0.3467%. */
        /* AND THE CADENCE: a run that is really a walk is exactly the bug in the game,
           so that is the falsifier -- perBeat is ignored and everything comes out at one
           a beat. If the two cadence claims stay green on this, they are not claims. */
        /* AND THE FLIP: a PLAIN CROSSFADE between two stations, no AGC, which is what
           every transition sound in every game already is and is exactly what this is not.
           If the gap claims stay green on this they were never claims. */
        const realFlip = H.theFlip;
        H.theFlip = (ctx, o) => realFlip(ctx, Object.assign({}, o || {}, { holdX: 0 }));
        const realCad = H.walkCadence;
        H.walkCadence = (ctx, o) => realCad(ctx, Object.assign({}, o || {}, { perBeat: 1 }));
        const steady = H.wowProbe, steadySong = H.songThroughSpeaker;
        H.wowProbe = (ctx, o) => steady(ctx, Object.assign({}, o || {}, { depth: 0 }));
        H.songOnTape = (ctx, o) => steadySong(ctx, o || {});
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

    /* ==== RULE 5, THE LAST RULE NOTHING IN THE GAME WAS DOING ================
       School rule 5: the pitch is not stable, because the motor is not stable. This
       lane's own scorecard had it UNMET AND UNTESTED across all 65 shipped sounds --
       162 detune calls exist in the build and not one is a slow wobble.
       MEASURED THE WAY WOW AND FLUTTER IS REALLY SPECIFIED: the instantaneous frequency
       of a steady tone is tracked from its zero crossings (sub-sampled, or the track is
       quantised and the depth reads as noise), and the modulation RATE is the peak of
       that track's own spectrum. Both numbers come off the buffer, never off the recipe.
       AND A CONTROL RUNS FIRST: the same tone with the wobble switched off must read a
       depth near zero, or the instrument is measuring its own arithmetic. */
    if (d.wow) {
      claim('THE TAPE REALLY WOBBLES, AND BY THE AMOUNT RULE 5 ASKS FOR',
        d.wow.depthPct > 0.15 && d.wow.depthPct < 0.6,
        'measured ' + d.wow.depthPct.toFixed(4) + '% against ' + d.wow.askedDepthPct
        + '% asked; rule 5 allows 0.15 to 0.6%');
      claim('AND AT THE RATE IT ASKS FOR: this is WOW, the slow end',
        d.wow.rateHz >= 0.5 && d.wow.rateHz <= 6,
        'measured ' + d.wow.rateHz.toFixed(2) + ' Hz against ' + d.wow.askedRateHz
        + ' Hz asked; rule 5 allows 0.5 to 6 Hz');
      claim('AND THE INSTRUMENT IS NOT MEASURING ITS OWN ARITHMETIC',
        d.wow.controlDepthPct < 0.01,
        'the same tone with the wobble switched off reads '
        + d.wow.controlDepthPct.toFixed(4) + '%');
      claim('THE 120 BPM LAW IS UNTOUCHED: the wobble is in the pitch, never in when it plays',
        d.wow.lengthsMatch === true && d.wow.songSame === true,
        'the wobbled song is the same length as the steady one to the sample, and carries the '
        + 'same root and the same intervals, so a note that started on the beat still does');
    } else { claim('the wobble was measured', false, 'no reading'); }

    /* ---- THE ROOM IS A SECOND COPY, SO THE MACHINE HOLDS THE TWO TOGETHER ----
       PAOLO 9/21 voted the room UP with "this volume has to be very, very low", nine
       times over, so it needs to be judged at more than one level side by side -- and
       the shipped recipe lives in the alpha while a judge page can only play this
       module. That is a duplication, and a duplication in THIS lane is the exact bug
       that silenced every footstep in the game for days.
       A COMMENT PROMISING THEY MATCH IS NOT A CHECK. So the gate reads BOTH FILES and
       asserts every constant is equal. If either moves, this goes red and names which
       one, instead of the page quietly playing a different room from the game. */
    const alphaAll = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
    /* *** AND THE SEARCH IS SCOPED TO THE ROOM'S OWN BLOCK, WHICH THIS CLAIM CAUGHT
       ON ITS FIRST RUN -- ON ITSELF. A bare /SEC:\s*([0-9.]+)/ over the whole alpha
       matched the HEARTBEAT's `SEC: 0.5`, two objects earlier, and the claim reported
       "game=0.5 page=4" as if the room had moved. The room was right and the ruler was
       reading a different object. A PATTERN OVER A 5 MB FILE IS NOT A READING OF A
       PARTICULAR THING unless it says which thing. So: cut the ROOM object out first,
       by its own opening line, and read only inside it. */
    const roomAt = alphaAll.indexOf('var ROOM = {');
    const alpha = roomAt < 0 ? '' : alphaAll.slice(roomAt, roomAt + 6000);
    claim('the alpha still has a ROOM object to compare against', roomAt >= 0,
      roomAt < 0 ? 'no `var ROOM = {` in the alpha' : 'found at char ' + roomAt);
    const grab = (re) => { const m = alpha.match(re); return m ? parseFloat(m[1]) : null; };
    const shipped = {
      sec:  grab(/\bSEC:\s*([0-9.]+)/),
      hum:  grab(/\bHUM:\s*([0-9.]+)/),
      lo:   grab(/\bLO:\s*([0-9.]+),\s*HI:/),
      hi:   grab(/\bLO:\s*[0-9.]+,\s*HI:\s*([0-9.]+)/),
      seam: grab(/\bSEAM:\s*([0-9.]+)/),
      relShipped: grab(/\bREL:\s*([0-9.]+)/),
    };
    const mine = d.room || {};
    const differs = Object.keys(shipped).filter(k =>
      shipped[k] === null || Math.abs(shipped[k] - mine[k]) > 1e-9);
    claim('THE ROOM ON THE JUDGE PAGE IS THE ROOM IN THE GAME, constant for constant',
      differs.length === 0,
      differs.length
        ? 'these do NOT match the alpha: ' + differs.map(k =>
            k + ' game=' + shipped[k] + ' page=' + mine[k]).join(', ')
        : Object.keys(shipped).map(k => k + '=' + shipped[k]).join(', '));
    /* AND THE LEVEL HE RULED ON, SAID AS A NUMBER, because "very very low" has to
       become one before anybody can agree or disagree with it. */
    const relDb = mine.relShipped > 0 ? 20 * Math.log10(mine.relShipped) : null;
    claim('AND IT IS VERY LOW, WHICH IS A NUMBER NOW (Paolo 9/21)',
      relDb !== null && relDb <= -20,
      relDb === null ? 'no level' :
      'the room carries ' + mine.relShipped + ' of the heartbeat\'s energy, which is '
      + relDb.toFixed(1) + ' dB under it (was 0.60, -4.4 dB). Film and broadcast put room '
      + 'tone 20 to 30 dB under the foreground; under about -30 dB a bed on a handset '
      + 'loses to the room the player is really in.');

    /* ---- THE FLIP: A RECEIVER CROSSING YEARS ---------------------------------
       Row [flip sound], rule 31 (Paolo 9/23): the three acts are open at once and he flips
       between them with one tap on the phone, always available. The mechanism is a receiver
       retuning, and the honest detail is AGC: with no carrier to hold it down the gain winds
       UP, so the gap between two stations is LOUDER and WIDER-BANDED than either station.
       That gap is the machine listening for a future he has not built yet. */
    const FLIPS = d.flip || {};
    const f1 = FLIPS.s1 || {}, fh = FLIPS['s0.5'] || {}, f0 = FLIPS.s0 || {};
    claim('THE FLIP FITS INSIDE ONE BEAT, at every ledger state (the 120 BPM law)',
      [f1, fh, f0].every(x => Math.abs((x.seconds || 0) - d.beat) < 1e-9),
      'all three are ' + f1.seconds + ' s and a beat is ' + d.beat + ' s. It is ONE TAP, '
      + 'ALWAYS AVAILABLE, so he hears it hundreds of times: the failure mode is not "too '
      + 'quiet", it is "I am sick of it"');
    /* SIGNED, because a failure message that prints "+-3.8 dB" wastes the next reader's
       time working out what it meant. The mutated run reads -3.8 and should say so. */
    const dB = (x) => { const v = 20 * Math.log10(x);
      return (v >= 0 ? '+' : '') + v.toFixed(1); };
    claim('THE GAP IS LOUDER THAN EITHER STATION, which is what an AGC really does',
      (f1.gapOverStation || 0) > 1.4,
      'gap ' + f1.gapOverStation + 'x the station, which is ' + dB(f1.gapOverStation)
      + ' dB. A real AM receiver\'s inter-station hiss runs +6 to +12 dB over a tuned '
      + 'station. MY FIRST CUT MEASURED 0.66x (-3.6 dB), backwards from the mechanism the '
      + 'whole sound is built on, and the sound was wrong rather than the ruler');
    claim('AND A THINNER ACT HUNTS LONGER AND LOUDER, so the sound reports what the city does',
      (f0.gapLen || 0) > (f1.gapLen || 0) * 1.8 && (f0.gapOverStation || 0) > (f1.gapOverStation || 0) * 1.8,
      'full act: gap ' + f1.gapLen + ' s at ' + dB(f1.gapOverStation) + ' dB.  half: '
      + fh.gapLen + ' s at ' + dB(fh.gapOverStation) + ' dB.  a ruin: ' + f0.gapLen
      + ' s at ' + dB(f0.gapOverStation) + ' dB. THE LEDGER IS NOT MINE (rule 31: DYNASTY '
      + 'derives it); this file ships the mechanism and a default of full signal');
    claim('AND THE GAP HAS NO BAND, because a carrier is what gives a receiver one',
      (f1.aboveCornerGap || 0) > (f1.aboveCornerStation || 0) * 2
      && (f1.aboveCornerStation || 99) < 5,
      'above the transmitter\'s own ' + f1.corner + ' Hz corner: ' + f1.aboveCornerStation
      + '% on the station (school rule 4 asks under 5), ' + f1.aboveCornerGap + '% in the gap. '
      + 'THE STATION LEAKED 21% UNTIL THIS WAS MEASURED, because bandTo DERIVES a per-pole '
      + 'corner upward (4 poles put each at 11,495 Hz for a 5 kHz band) and raising its pole '
      + 'count makes that WORSE, not better. Invisible on tones, fully exposed on noise.');
    claim('THE GRID IS ON IN BOTH ACTS (school rule 7: a silence keeps its carrier)',
      (f1.humBefore || 0) > 0 && (f1.humAfter || 0) > 0,
      'the 60 Hz family reads ' + f1.humBefore + ' before the flip and ' + f1.humAfter
      + ' after it. Same grid in every act, and nothing pitches: a pitch move would make '
      + 'this a transition effect instead of a machine');
    claim('AND IT NEVER READS DIGITAL ZERO (school rule 1)',
      [f1, fh, f0].every(x => x.exactZeros === 0),
      '0 exact zeros at all three states, peaks ' + [f1, fh, f0].map(x => x.peak).join('/')
      + ' (never normalised to the peak on purpose: the GAP is the loudest part and a '
      + 'normalise would hide that behind the ceiling)');

    /* ---- THE CADENCE: MEASURED FROM THE AUDIO, NOT READ BACK ------------------
       Row [footsteps on the beat]. Measured in the alpha this round: walking makes ONE
       footstep per beat and one press carries him 25 cells, so 94% of footfalls are
       silent and that is THE STEP IS A HOUSE working. What is wrong is the run: two
       houses in one beat, both steps inside one tick, and the 0.12 s limiter swallows
       the second, so a run sounds identical to a walk. This holds the two cadences he
       is being asked to choose between. */
    const cad = d.cadence || {};
    claim('THE WALK LANDS ONE FOOTFALL A BEAT, ON THE BEAT',
      cad.walkHits === cad.beats &&
      (cad.walkGaps || []).every(g => Math.abs(g - d.beat) <= 0.008),
      cad.walkHits + ' footfalls over ' + cad.beats + ' beats, gaps '
      + (cad.walkGaps || []).join('/') + ' s against a beat of ' + d.beat + ' s');
    claim('AND THE RUN LANDS EXACTLY TWICE AS MANY, EVENLY, NOT TWO JAMMED TOGETHER',
      cad.runHits === cad.beats * 2 &&
      (cad.runGaps || []).every(g => Math.abs(g - d.beat / 2) <= 0.008),
      cad.runHits + ' footfalls (wanted ' + (cad.beats * 2) + '), gaps of '
      + (cad.runGaps || [])[0] + ' s against the half beat of ' + (d.beat / 2) + ' s asked for. '
      + 'THE GAME PUTS BOTH STEPS IN ONE INSTANT, which is why it only ever makes one sound.');
    claim('AND THE SPACING WAS FOUND IN THE AUDIO, NOT READ BACK OFF THE RECIPE',
      cad.walkGaps && cad.walkGaps.length > 0 && cad.runGaps && cad.runGaps.length > 0,
      'the hits are located by threshold on the rendered buffer; the recipe\'s own stated '
      + 'gaps (' + cad.walkSaid + ' s and ' + cad.runSaid + ' s) are printed for comparison '
      + 'and are never what is asserted');

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
  console.log('GREEN: eight cooked sounds he can play, each one noise or tone on purpose, each band naming its machine, the step losing contact on the ground\'s own stations, the cloud dimming on the city\'s own numbers, the fold indistinguishable from an empty room, and every one of them in the vote tab.');
  process.exit(0);
})();
