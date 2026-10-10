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
    room: H.ROOM, broadcastConst: H.BROADCAST_CONST, barglassConst: H.BARGLASS_CONST,
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

  /* *** WHAT THIS VALLEY STRIKES ON THE HOUR (9/24), row [bb ambience] + [not sand]. ***
     Rule 33 puts the valley on a map with time passing, and the row asks for the clock
     AUDIBLE. Rule 32e says new sounds come from real material. So: three struck metal
     objects, no noise generator in any of them, every partial ratio a PUBLISHED series.
     Measured off the rendered buffer, and the partial ratios are checked against the
     published numbers rather than against whatever the table happens to hold. */
  (function () {
    const look = (m) => {
      const d = m.buffer.getChannelData(0);
      let pk = 0, at = 0;
      for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > pk) { pk = v; at = i; } }
      const p = spec(loudest(d));
      let mx = 0, num = 0, den = 0;
      for (let k = 1; k < p.length; k++) { if (p[k] > mx) mx = p[k]; num += k*SR/N*p[k]; den += p[k]; }
      /* is each declared partial REALLY in the sound, or only in the table */
      const at1 = (hz) => { const k = Math.round(hz*N/SR); let best = 0;
        for (let q = k-2; q <= k+2; q++) if (q > 0 && q < p.length && p[q] > best) best = p[q];
        return best; };
      const heard = m.ratios.map(r => +(10*Math.log10(at1(m.f0*r)/mx)).toFixed(1));
      const steps = new Float64Array(d.length-1);
      for (let i = 1; i < d.length; i++) steps[i-1] = Math.abs(d[i]-d[i-1]);
      const sorted = Float64Array.from(steps).sort();
      return { what: m.what, seconds: m.seconds, peak: pk, peakAtMs: at/SR*1000,
        centroid: den > 0 ? num/den : 0, ratios: m.ratios, f0: m.f0,
        partialsDb: heard, longestTail: m.longestTailSeconds, shortestTail: m.shortestTailSeconds,
        noiseSources: m.noiseSources, fadeMs: m.fadeMs,
        lastSample: Math.abs(d[d.length-1]),
        stepP999: sorted[Math.floor(sorted.length*0.999)] };
    };
    try {
      out.strike = {
        bell: look(H.struckMetal(ctx, { what: 'bell' })),
        cracked: look(H.struckMetal(ctx, { what: 'cracked' })),
        pipe: look(H.struckMetal(ctx, { what: 'pipe' })),
        glass: look(H.struckMetal(ctx, { what: 'glass' })),
        noiseInSource: H.struckMetal.toString().indexOf('noiseInto') >= 0
      };
    } catch (e) { out.strikeErr = String(e && e.message).slice(0,120); }
  })();


  /* *** THE DECK AND THE FLIP AS A TAPE CHANGING (9/27), row [not sand]. ***
     Paolo killed both for sounding like sand. These are their new ids from real material,
     and the material is a cassette transport, so the questions are: is there any noise in
     them at all, do the wobble RATES match the wheels' own geometry, and does the wow rate
     really fall across a side the way a filling reel makes it.

     *** THE RATE RULER IS WIDENED HERE AND THE REASON IS ON THE FACE OF IT. *** analyse()
     above takes a 1024-point transform of the frequency track, one bin of which is
     mean/NW = 440/1024 = 0.43 Hz. The drift being claimed is 0.689 Hz down to 0.399 Hz,
     which is 0.29 Hz: SMALLER THAN ONE BIN. Measured on the narrow ruler the three rates
     read 0.859, 0.430 and 0.430 Hz, which is two bins, one bin and one bin -- the ruler's
     grid, not the sound. At NW 8192 one bin is 0.054 Hz and the peak is interpolated. */
  (function () {
    const freqTrack = (arr) => {
      const t = []; let prev = arr[0], lastX = null;
      for (let i=1;i<arr.length;i++){
        if (prev < 0 && arr[i] >= 0) {
          const x = i - 1 + (0 - prev) / (arr[i] - prev);
          if (lastX != null) t.push(SR / (x - lastX));
          lastX = x;
        }
        prev = arr[i];
      }
      return t;
    };
    const wide = (arr, NW) => {
      NW = NW || 8192;
      const f = freqTrack(arr); if (f.length < 40) return null;
      const mean = f.reduce((a,b)=>a+b,0)/f.length;
      let v = 0; for (const x of f) v += (x-mean)*(x-mean);
      const depth = Math.sqrt(v/f.length) * Math.SQRT2 / mean;
      const re = new Float64Array(NW), im = new Float64Array(NW);
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
      const mag = (k) => re[k]*re[k] + im[k]*im[k];
      let pk=1, pv=-1;
      for (let k=1;k<NW/2;k++){ const m=mag(k); if(m>pv){pv=m;pk=k;} }
      let frac = 0;
      if (pk > 1 && pk < NW/2 - 1) {
        const a=Math.sqrt(mag(pk-1)), b=Math.sqrt(mag(pk)), c=Math.sqrt(mag(pk+1));
        const den = a - 2*b + c; if (den !== 0) frac = 0.5*(a-c)/den;
      }
      return { depthPct: depth*100, rateHz: (pk+frac)*mean/NW, binHz: mean/NW, meanHz: mean };
    };
    /* the mean pitch in a window, for the spin-up */
    const meanHz = (d, a, b) => {
      const f = freqTrack(d.slice(Math.round(a*SR), Math.round(b*SR)));
      return f.length < 8 ? null : f.reduce((x,y)=>x+y,0)/f.length;
    };
    try {
      const P = (o) => wide(H.transportProbe(ctx, o).buffer.getChannelData(0));
      const deck = H.theTapeDeck(ctx, {});
      const mach = H.theTapeDeck(ctx, { what: 'machine' });
      const worn = H.theTapeDeck(ctx, { what: 'worn' });
      const chg  = H.theTapeChange(ctx, {});
      const seat = H.theTapeChange(ctx, { what: 'seat' });
      const door = H.theTapeChange(ctx, { what: 'door' });
      const rms = (d,a,b) => { let s=0,c=0; for(let i=a;i<b&&i<d.length;i++){s+=d[i]*d[i];c++;} return c?Math.sqrt(s/c):0; };
      const dd = deck.buffer.getChannelData(0);
      /* the spin-up on a 4 kHz probe, because a 100 ms window needs crossings to count */
      const sp = H.transportProbe(ctx, { secs: 3, hz: 4000, spinUp: 0.120, wowDepth: 0, flutDepth: 0 });
      const spd = sp.buffer.getChannelData(0);
      const flat = H.transportProbe(ctx, { secs: 3, hz: 4000, wowDepth: 0, flutDepth: 0 });
      const drift = [0, 0.25, 0.5, 0.75, 1].map((t) => {
        const m = H.transportProbe(ctx, { secs: 22, through: t, flutDepth: 0 });
        const a = wide(m.buffer.getChannelData(0));
        return { through: t, geometryHz: m.speed.fWow, soundHz: a.rateHz,
                 errPct: (a.rateHz - m.speed.fWow) / m.speed.fWow * 100 };
      });
      const tailStep = (m) => { const x = m.buffer.getChannelData(0); let st = 0;
        for (let i=1;i<x.length;i++) st = Math.max(st, Math.abs(x[i]-x[i-1]));
        return { last: Math.abs(x[x.length-1]), step: st }; };
      out.tape = {
        /* THE STRUCTURAL CHECK, read off the shipped functions, because "it is not made of
           noise" is a fact about how it was built and not a shape on a spectrum. AND
           FLATNESS IS DELIBERATELY NOT USED HERE: the sound he killed reads 0.0000 on it
           and so does this one, because the loudest window of a tune is a note either way.
           A ruler that cannot tell the two apart is not evidence about either. */
        noiseInDeck:   H.theTapeDeck.toString().indexOf('noiseInto') >= 0,
        noiseInChange: H.theTapeChange.toString().indexOf('noiseInto') >= 0,
        noiseInSpeed:  H.transportSpeed.toString().indexOf('noiseInto') >= 0,
        deckSources: deck.noiseSources, changeSources: chg.noiseSources,
        /* the geometry, recomputed here from the standard's own tape speed so a drift in
           the table cannot pass: 4.7625 cm/s over a circumference in cm */
        speedCmS: H.TAPE_CM_PER_S,
        capstanGeom: H.TAPE_CM_PER_S / (Math.PI * H.TRANSPORT.capstanMm / 10),
        hubGeom:     H.TAPE_CM_PER_S / (Math.PI * H.TRANSPORT.hubMm / 10),
        reelGeom:    H.TAPE_CM_PER_S / (Math.PI * H.TRANSPORT.fullReelMm / 10),
        capstanSaid: deck.flutterRateHz, hubSaid: deck.wowRateStartHz, reelSaid: deck.wowRateEndHz,
        /* each wheel measured on its own, off a tone through the DECK'S OWN speed law */
        wowOnly:  P({ secs: 22, flutDepth: 0 }),
        flutOnly: P({ secs: 22, wowDepth: 0 }),
        control:  P({ secs: 22, wowDepth: 0, flutDepth: 0 }),
        both:     P({ secs: 22 }),
        wornBoth: P({ secs: 22, what: 'worn' }),
        drift: drift,
        /* the spin-up: percentage of final speed in the first windows */
        spinUp: [[0,0.1],[0.1,0.2],[0.3,0.4],[2.0,2.5]].map(([a,b]) => {
          const v = meanHz(spd, a, b); return v == null ? null : v / 4000 * 100; }),
        spinUpControlPct: (meanHz(flat.buffer.getChannelData(0), 0, 0.1) || 0) / 4000 * 100,
        /* the mechanism itself */
        clacks: deck.clacks, clackGapMs: deck.clackGapMs,
        shellLowestHz: deck.shellModes && deck.shellModes.length ? deck.shellModes[0].hz : null,
        shellRingMs: deck.shellModes && deck.shellModes.length ? deck.shellModes[0].tailSeconds*1000 : null,
        shellModeCount: deck.shellModes ? deck.shellModes.length : 0,
        machineHasProgramme: mach.hasProgramme, deckHasProgramme: deck.hasProgramme,
        /* is the song actually audible under the clunk */
        clunkRms: rms(dd, 0, Math.round(0.20*SR)),
        songRms:  rms(dd, Math.round(0.60*SR), Math.round(2.60*SR)),
        /* the flip fits a beat, and the third option honestly does not */
        changeSeconds: chg.seconds, changeFits: chg.fitsOneBeat, changeAtMs: chg.atMs,
        seatFits: seat.fitsOneBeat, doorFits: door.fitsOneBeat, doorSeconds: door.seconds,
        beat: chg.beatSeconds,
        /* nothing ends on a step */
        deckTail: tailStep(deck), changeTail: tailStep(chg),
        /* and the one it replaces, measured on the same ruler */
        oldTail: tailStep(H.songOnTape(ctx, {})),
        /* the old flip declared a band it never obeyed; this one declares no band at all */
        changeBandHi: chg.machine.hi, oldFlipBandHi: H.theFlip(ctx, {}).machine.hi
      };
    } catch (e) { out.tapeErr = String(e && e.message).slice(0,160); }
  })();

  /* *** THE THREE HUMS OFF THE GRID (round six of [not sand], 9/28). ***
     generator/power_on/sign_alive are FROZEN in bohemia_sfx.js (__SFX_APPROVED); this
     module's new additive-sine redos are the fix, so the question is whether they
     actually land on the real target -- 60 Hz for a 2-pole alternator, 120 Hz for a
     transformer or a ballast's own core pull -- and land there PROVABLY, not by eye.
     A 4,096-sample window is 10.77 Hz a bin, 18% of 60 Hz, so a bin READING is not a
     pitch reading (this lane's own instrument almost wrote down "54 Hz" for exactly
     this reason two rounds ago). Longer window, and the peak refined by parabolic
     interpolation on the log magnitudes of the three bins around it -- the same
     method tools/bohemia_the_keep_redo_list.js already proved good to well under a
     tenth of a bin, PROVED HERE TOO, on pure sines through the identical code path,
     before it is trusted on anything cooked. */
  (function () {
    try {
      const HN = 8192;
      function hfft(re, im) {
        const n = re.length;
        for (let i = 1, j = 0; i < n; i++) {
          let bit = n >> 1;
          for (; j & bit; bit >>= 1) j ^= bit;
          j ^= bit;
          if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
        }
        for (let len = 2; len <= n; len <<= 1) {
          const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
          for (let i = 0; i < n; i += len) {
            let cr = 1, ci = 0;
            for (let k = 0; k < len / 2; k++) {
              const ur = re[i + k], ui = im[i + k];
              const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
              const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
              re[i + k] = ur + vr; im[i + k] = ui + vi;
              re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
              const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
            }
          }
        }
      }
      function hspec(d) {
        const re = new Float64Array(HN), im = new Float64Array(HN);
        for (let i = 0; i < HN && i < d.length; i++) re[i] = d[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (HN - 1)));
        hfft(re, im);
        const half = HN >> 1, p = new Float64Array(half);
        for (let k = 0; k < half; k++) p[k] = re[k] * re[k] + im[k] * im[k];
        return p;
      }
      function hrefine(p) {
        let pk = 0, k0 = 1;
        for (let k = 1; k < p.length; k++) if (p[k] > pk) { pk = p[k]; k0 = k; }
        let hz = k0 * SR / HN;
        if (k0 > 1 && k0 < p.length - 1) {
          const l = Math.log(p[k0 - 1] + 1e-30), c = Math.log(p[k0] + 1e-30), r = Math.log(p[k0 + 1] + 1e-30);
          const den = l - 2 * c + r;
          if (den !== 0) { const dl = 0.5 * (l - r) / den; if (dl > -1 && dl < 1) hz = (k0 + dl) * SR / HN; }
        }
        return hz;
      }
      const hControl = [60, 120].map(f => {
        const a = new Float32Array(HN);
        for (let i = 0; i < HN; i++) a[i] = Math.sin(2 * Math.PI * f * i / SR) * 0.8;
        const hz = hrefine(hspec(a));
        return { askedHz: f, readHz: +hz.toFixed(3), errPct: +((hz - f) / f * 100).toFixed(4) };
      });
      const gen = H.generatorHum(ctx, {});
      const genHz = hrefine(hspec(loudest(gen.buffer.getChannelData(0))));
      const pon = H.powerOnHum(ctx, {});
      const ponD = pon.buffer.getChannelData(0);
      const ponSkip = Math.round((pon.riseSec + 0.2) * SR);
      const ponHz = hrefine(hspec(ponD.subarray(Math.min(ponSkip, ponD.length - HN))));
      const sgn = H.signAliveHum(ctx, {});
      const sgnD = sgn.buffer.getChannelData(0);
      const sgnHz = hrefine(hspec(sgnD.subarray(Math.max(0, sgnD.length - HN))));
      out.hums = {
        control: hControl,
        generatorHz: +genHz.toFixed(3),
        powerOnHz: +ponHz.toFixed(3),
        signAliveHz: +sgnHz.toFixed(3),
        /* THE STRUCTURAL CHECK: no noise generator, and no sample-based voice for a
           pitch to be rounded onto -- the exact mechanism that put a real floor under
           the frozen sign_alive (bodyInstrument()'s semiOf() snaps to the nearest
           semitone of a 220 Hz reference before pitch-shifting a sample). */
        noiseInHum: H.harmonicHum.toString().indexOf('noiseInto') >= 0,
        sampleVoiceInHum: /semiOf|bodyInstrument|synthV/.test(H.harmonicHum.toString()),
        synthTag: gen.synth,
        strikes: sgn.strikes, riseSec: pon.riseSec, riseFromHz: pon.riseFromHz
      };
    } catch (e) { out.humsErr = String(e && e.message).slice(0, 160); }
  })();

  /* *** THE BAND HELPER ITSELF, MEASURED BY ITS OWN TRANSFER FUNCTION. *** Row
     [band helper]: Paolo killed three sounds for sounding like sand and the sand was this
     one shared filter. A filter is measured with an IMPULSE, which gives its response
     exactly, and then confirmed on NOISE, which is the material the complaint was about.
     Two different questions, two instruments, and neither guesses at the other. */
  (function () {
    const impulse = (band) => {
      const M = 16384;
      const d = new Float64Array(M); d[0] = 1;
      const info = H.bandTo(d, M, 0, 5000, SR, 8, band);   /* lo 0: the top end only */
      const re = Float64Array.from(d), im = new Float64Array(M);
      /* the same radix-2 as everything else here, at a longer length for 2.7 Hz bins */
      for (let i=1,j=0;i<M;i++){ let bit=M>>1; for(;j&bit;bit>>=1) j^=bit; j^=bit;
        if(i<j){ let t=re[i];re[i]=re[j];re[j]=t; t=im[i];im[i]=im[j];im[j]=t; } }
      for (let len=2;len<=M;len<<=1){ const ang=-2*Math.PI/len, wr=Math.cos(ang), wi=Math.sin(ang);
        for (let i=0;i<M;i+=len){ let cr=1,ci=0;
          for (let k=0;k<len/2;k++){ const ur=re[i+k],ui=im[i+k];
            const vr=re[i+k+len/2]*cr-im[i+k+len/2]*ci, vi=re[i+k+len/2]*ci+im[i+k+len/2]*cr;
            re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
            const ncr=cr*wr-ci*wi; ci=cr*wi+ci*wr; cr=ncr; } } }
      const mag = (hz) => { const k = Math.round(hz*M/SR);
        return Math.sqrt(re[k]*re[k]+im[k]*im[k]); };
      const dc = mag(100);
      let m3 = null;
      for (let k=1;k<M/2;k++){
        const v = Math.sqrt(re[k]*re[k]+im[k]*im[k]);
        if (v <= dc*Math.pow(10,-3/20)) { m3 = Math.round(k*SR/M); break; }
      }
      return { order: info.order, minus3Hz: m3,
        dbAtCorner: +(20*Math.log10(mag(5000)/dc)).toFixed(2),
        dbAnOctaveUp: +(20*Math.log10(mag(10000)/dc)).toFixed(2) };
    };
    const onNoise = (band) => {
      const n = SR;
      const d = new Float64Array(n);
      let st = 1;
      for (let i=0;i<n;i++){ st = (st*1103515245 + 12345) & 0x7fffffff;
        d[i] = (st/0x7fffffff)*2 - 1; }
      H.bandTo(d, n, 0, 5000, SR, 8, band);
      const w = loudest(d), p = spec(w);
      let tot=0, ab=0, oct=0;
      for (let k=1;k<p.length;k++){ const f=k*SR/N; tot+=p[k];
        if (f>5000) ab+=p[k]; if (f>10000) oct+=p[k]; }
      return { abovePct: +(ab/tot*100).toFixed(3), octPct: +(oct/tot*100).toFixed(4) };
    };
    try {
      out.band = {
        honest: Object.assign(impulse({}), onNoise({})),
        legacy: Object.assign(impulse({ legacy: true }), onNoise({ legacy: true })),
        floorAsk2: H.bandTo(new Float64Array(8), 8, 0, 5000, SR, 2).order,
        qs8: H.butterQ(8).map(x => +x.toFixed(4)),
        /* AND NO RECIPE MAY CARRY ITS OWN PATCH ON TOP OF THE HELPER ANY MORE: two of them
           used to add extra poles to plug what bandTo leaked, which is a fix in one place
           when the mistake lives in the helper. */
        tailPatches: (H.theFlip.toString() + H.theBroadcast.toString())
          .split('onePoleLow(d, n, MACHINE.AM.hi').length - 1
      };
    } catch (e) { out.bandErr = String(e && e.message).slice(0,120); }
  })();

  /* A FOOTSTEP THAT IS NOT SAND (9/24). *** HE KILLED THREE SOUNDS IN ONE BATCH WITH ONE
     COMPLAINT: "it all sounded like sand", "not this sand-sounding shit like I'm on the
     beach", "kinda dogshit". He is right, and the reason is that every one of them starts
     with noiseInto() through bandTo(), which IS the sound of sand. Rule 32e graveyards the
     RECIPE. So this measures the thing that matters most: that the new one is not built
     the old way, and that it is measurably a different sound rather than the same one
     with a new name. *** */
  (function () {
    const en = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return s; };
    const hpf = (a, hz) => { const al = Math.exp(-2*Math.PI*hz/SR); let y=0, pr=0;
      const o = new Float64Array(a.length);
      for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y+x-pr); pr = x; o[i]=y; } return o; };
    /* AN FFT BAND SUM, NOT A CASCADE: four cascaded one-pole high-passes at fc turn over
       at 2.299*fc, so a cascade measures an octave and a third above the number it names.
       That is the defect this round found in this gate's older band claims. */
    const share4p = (a, hz) => { const w = loudest(a), p = spec(w);
      let tot=0, ab=0;
      for (let k=1;k<p.length;k++){ const f=k*SR/N; tot+=p[k]; if (f>hz) ab+=p[k]; }
      return tot>0 ? ab/tot : null; };
    const look = (m) => {
      const d = m.buffer.getChannelData(0);
      const w = loudest(d), p = spec(w);
      let tot=0, num=0, logs=0, sum=0, live=0;
      for (let k=1;k<p.length;k++){ const f=k*SR/N; tot+=p[k]; num+=f*p[k];
        logs+=Math.log(p[k]+1e-20); sum+=p[k]+1e-20; live++; }
      let pk=0, at=0;
      for (let i=0;i<d.length;i++){ const v=Math.abs(d[i]); if(v>pk){pk=v;at=i;} }
      return { above4k: share4p(d, 4000), centroid: tot>0?num/tot:0,
        flat: live?Math.exp(logs/live)/(sum/live):0, peak: pk, peakAtMs: at/SR*1000,
        firstModeHz: m.firstModeHz, contactMs: m.contactMs, corner: m.contactCornerHz,
        contacts: m.contacts, grains: m.grains, noiseSources: m.noiseSources,
        seconds: m.seconds };
    };
    try {
      out.step = {
        concrete: look(H.footstepModelled(ctx, { surface: 'concrete' })),
        asphalt:  look(H.footstepModelled(ctx, { surface: 'asphalt' })),
        sand:     look(H.footstep(ctx, {})),
        /* THE OTHER THREE OF THE 21-SOUND REDO LIST (9/29), NAMED dirtGround/sandGround/
           woodGround SO NEITHER COLLIDES WITH THE PLAIN "sand" KEY ABOVE, which is the
           graveyarded noise-filter control, never the real sand ground material. */
        dirtGround:  look(H.footstepModelled(ctx, { surface: 'dirt' })),
        sandGround:  look(H.footstepModelled(ctx, { surface: 'sand' })),
        woodGround:  look(H.footstepModelled(ctx, { surface: 'boards' })),
        /* THE STRUCTURAL CHECK, ON THE SHIPPED FUNCTION'S OWN TEXT: a claim that the new
           sound is "not made of noise" cannot be taken off a spectrum, because a dense
           impact and a hiss bed can land near each other. It can be taken off the code. */
        noiseInModelled: H.footstepModelled.toString().indexOf('noiseInto') >= 0,
        noiseInSand: H.footstep.toString().indexOf('noiseInto') >= 0,
        ground: H.GROUND ? Object.keys(H.GROUND).length : 0,
        firstModes: H.plateModes ? {
          concrete: +H.plateModes(H.GROUND.concrete,1)[0].hz.toFixed(1),
          asphalt: +H.plateModes(H.GROUND.asphalt,1)[0].hz.toFixed(1),
          dirt: +H.plateModes(H.GROUND.dirt,1)[0].hz.toFixed(1),
          sand: +H.plateModes(H.GROUND.sand,1)[0].hz.toFixed(1),
          boards: +H.plateModes(H.GROUND.boards,1)[0].hz.toFixed(1) } : null
      };
    } catch (e) { out.stepErr = String(e && e.message).slice(0,120); }
  })();

  /* A WALK THAT NEVER REPEATS (9/30). walk_more/wood_more/tread_more's real complaint is
     repetition, not material: "step_concrete.2 is one sample for every sidewalk". The fix
     is a variant seed on footstepModelled itself, so a walk built out of it never renders
     the same footfall twice. THE BACKWARD-COMPATIBILITY CLAIM MATTERS AS MUCH AS THE NEW
     ONE: variant 0 has to stay the exact render already sitting in front of him on five
     unjudged candidates, or this round would be quietly changing what he is about to hear. */
  (function () {
    try {
      const bytesEqual = (a, b) => { if (a.length !== b.length) return false;
        for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false; return true; };
      const v0a = H.footstepModelled(ctx, { surface: 'concrete' }).buffer.getChannelData(0);
      const v0b = H.footstepModelled(ctx, { surface: 'concrete' }).buffer.getChannelData(0);
      const v1a = H.footstepModelled(ctx, { surface: 'concrete', variant: 1 }).buffer.getChannelData(0);
      const v1b = H.footstepModelled(ctx, { surface: 'concrete', variant: 1 }).buffer.getChannelData(0);
      const v2 = H.footstepModelled(ctx, { surface: 'concrete', variant: 2 }).buffer.getChannelData(0);
      const walkC = H.footstepWalkConcrete(ctx, {});
      const walkW = H.footstepWalkWood(ctx, {});
      const runC = H.footstepRunConcrete(ctx, {});
      const footfallsAllDistinct = (m, windowSec) => {
        const d = m.buffer.getChannelData(0), w = Math.round(windowSec * SR);
        const wins = m.atSeconds.map(t => d.subarray(Math.round(t*SR), Math.round(t*SR)+w));
        for (let i=0;i<wins.length;i++) for (let j=i+1;j<wins.length;j++) if (bytesEqual(wins[i], wins[j])) return false;
        return true;
      };
      out.walk = {
        variant0Stable: bytesEqual(v0a, v0b),
        variant1Reproducible: bytesEqual(v1a, v1b),
        variant0DiffersFromVariant1: !bytesEqual(v0a, v1a),
        variant1DiffersFromVariant2: !bytesEqual(v1a, v2),
        walkConcreteSteps: walkC.steps, walkConcreteSeconds: walkC.seconds,
        walkWoodSteps: walkW.steps,
        runConcreteSteps: runC.steps, runConcretePerBeat: runC.perBeat,
        walkConcreteGaps: walkC.atSeconds.slice(1).map((t,i) => +(t - walkC.atSeconds[i]).toFixed(3)),
        runConcreteGaps: runC.atSeconds.slice(1).map((t,i) => +(t - runC.atSeconds[i]).toFixed(3)),
        walkConcreteAllDistinct: footfallsAllDistinct(walkC, 0.1),
        walkWoodAllDistinct: footfallsAllDistinct(walkW, 0.1),
        runConcreteAllDistinct: footfallsAllDistinct(runC, 0.1),
        noiseInWalk: H.footstepWalk.toString().indexOf('noiseInto') >= 0
      };
    } catch (e) { out.walkErr = String(e && e.message).slice(0,160); }
  })();

  /* THE GROUND TAKES IT, AND THINGS GET SET DOWN (10/1). Four more of the keep/redo list,
     all claimed to be free reuse of the two machines already proven above -- so the
     claims here are mostly about proving THAT, not inventing new physics. */
  (function () {
    try {
      const bytesEqual = (a, b) => { if (a.length !== b.length) return false;
        for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false; return true; };
      const gt = H.groundTakesIt(ctx, {});
      const bg = H.bootsGoDirt(ctx, {});
      const down = H.objectSetDown(ctx, {});
      const downAgain = H.objectSetDownAgain(ctx, {});
      out.groundTakesIt = {
        contacts: gt.contacts, heelToeMs: gt.heelToeMs, surface: gt.surface,
        matchesDirtMode: gt.firstModeHz === +H.plateModes(H.GROUND.dirt, 1)[0].hz.toFixed(1),
        noiseInIt: H.footstepModelled.toString().indexOf('noiseInto') >= 0
      };
      out.bootsGoDirt = {
        steps: bg.steps, surface: bg.surface, perBeat: bg.perBeat,
        gaps: bg.atSeconds.slice(1).map((t,i) => +(t - bg.atSeconds[i]).toFixed(3))
      };
      out.objectSetDown = {
        downContacts: down.contacts, downHeelToeMs: down.heelToeMs, downSurface: down.surface,
        downVariant: down.variant, downAgainVariant: downAgain.variant,
        matchesConcreteMode: down.firstModeHz === +H.plateModes(H.GROUND.concrete, 1)[0].hz.toFixed(1),
        downDiffersFromDownAgain: !bytesEqual(down.buffer.getChannelData(0), downAgain.buffer.getChannelData(0))
      };
    } catch (e) { out.groundTakesItErr = String(e && e.message).slice(0,160); }
  })();

  /* THE TURN CLOSES (10/4, row [one song and the volumes]). A small steel catch heard
     before it has time to ring like the pipe it is built from -- the whole claim is
     that it REUSES struckMetal's own modes rather than inventing a new material, and
     that the buffer is short enough for the 200 ms end-fade to cover all of it (no
     chopped edge, which is how a ring becomes a click by accident). */
  (function () {
    try {
      const et = H.endTurnClick(ctx, {});
      const sr = ctx.sampleRate;
      out.endTurnClick = {
        seconds: et.seconds, what: et.what, f0: et.f0,
        samples: Math.round(et.seconds * sr),
        fadeCoversAll: Math.round(et.seconds * sr) <= Math.round(0.20 * sr),
        shorterThanPipesOwnRing: et.seconds < H.STRIKE.pipe.secs,
        usesPipeTable: et.what === 'pipe',
        f0RaisedFromPipeDefault: et.f0 > H.STRIKE.pipe.f0
      };
    } catch (e) { out.endTurnClickErr = String(e && e.message).slice(0,160); }
  })();

  /* THE MAP IN MOTION (row [the map's sounds], 10/5). Three claims: the road bed is
     footstepWalk on asphalt at the RUNNING cadence (perBeat 2, "the road faster"), the
     dirt bed is the same function on dirt at the walking cadence, and the two render
     different footfall counts for the same length -- the only way tempo actually shows
     up in a rendered buffer. The insects are a dense click train, not a hiss: clicks
     counted off the EVENTS crackleInto returns, never assumed from the rate asked for,
     and band-limited where a cricket's own calling song sits. */
  (function () {
    try {
      const road = H.travelRoadBed(ctx, { beats: 8 });
      const dirt = H.travelDirtBed(ctx, { beats: 8 });
      out.travelBeds = {
        roadSteps: road.steps, roadSurface: road.surface, roadPerBeat: road.perBeat,
        dirtSteps: dirt.steps, dirtSurface: dirt.surface, dirtPerBeat: dirt.perBeat,
        roadIsDenser: road.steps > dirt.steps
      };
    } catch (e) { out.travelBedsErr = String(e && e.message).slice(0,160); }
    try {
      const ins = H.nightInsects(ctx, {});
      const d = ins.buffer.getChannelData(0), n = d.length;
      let q = 0, pk = 0;
      for (let i = 0; i < n; i++) { q += d[i] * d[i]; const a = Math.abs(d[i]); if (a > pk) pk = a; }
      out.nightInsects = {
        clicks: ins.clicks, lo: ins.lo, hi: ins.hi, noiseSources: ins.noiseSources,
        rms: Math.sqrt(q / n), peak: pk
      };
    } catch (e) { out.nightInsectsErr = String(e && e.message).slice(0,160); }
  })();

  /* THE TITLE'S OWN MUSIC (row [the title's music], 10/5). Three claims: it really is
     detuned (the rendered root sits at exactly 0.97 of the canon F3, not the canon pitch
     itself), it really does carry wow (the same depth/rate numbers songOnTape already
     proves, read back off this function and not assumed to have survived the mix), and
     the room tone is really mixed in underneath it (summing song and room changes the
     buffer; the title's own rms has to differ from the song rendered alone). */
  (function () {
    try {
      const tt = H.titleTheme(ctx, {});
      /* THE ROOM IS REALLY IN THE MIX, PROVED BEHAVIOURALLY. A metadata field saying
         roomRel is not proof it was ever added to a sample; changing it and hearing the
         difference is. Rendered twice, same song, room silenced the second time (rel 0)
         -- if the two buffers read identically, the room was never summed in at all. */
      const silentRoom = H.titleTheme(ctx, { roomRel: 0 });
      const a = tt.buffer.getChannelData(0), b = silentRoom.buffer.getChannelData(0);
      let maxDiff = 0;
      for (let i = 0; i < a.length; i += 1009) maxDiff = Math.max(maxDiff, Math.abs(a[i] - b[i]));
      out.titleTheme = {
        root: tt.root, canonRoot: tt.canonRoot, detune: tt.detune,
        wowDepth: tt.wowDepth, wowRateHz: tt.wowRateHz, roomRel: tt.roomRel,
        machineHi: tt.machine && tt.machine.hi, seconds: tt.seconds,
        roomChangesTheBuffer: maxDiff > 0.0001
      };
    } catch (e) { out.titleThemeErr = String(e && e.message).slice(0,160); }
  })();

  /* THE SETTLEMENT'S SOUNDS (row [the settlement's sounds], 10/5). Four taps, four
     REUSE-FIRST functions; each claim reads a number straight off the primitive it
     reused, not a label the wrapper could have typed without calling it. */
  (function () {
    try {
      const bc = H.barberClippers(ctx, {});
      const d = bc.buffer.getChannelData(0), n = d.length;
      let q = 0; for (let i = 0; i < n; i++) q += d[i] * d[i];
      out.barberClippers = { hz: bc.hz, noiseSources: bc.noiseSources, synth: bc.synth,
        machineIsEar: !!bc.machine && bc.machine.hi === null, rms: Math.sqrt(q / n) };
    } catch (e) { out.barberClippersErr = String(e && e.message).slice(0,160); }
    try {
      const cw = H.canOnWood(ctx, {});
      out.canOnWood = { woodSurface: cw.woodSurface, tinF0: cw.tinF0,
        machineIsEar: !!cw.machine && cw.machine.hi === null, seconds: cw.seconds };
    } catch (e) { out.canOnWoodErr = String(e && e.message).slice(0,160); }
    try {
      const bn = H.boardNail(ctx, {});
      out.boardNail = { what: bn.what, f0: bn.f0, seconds: bn.seconds,
        machineIsEar: !!bn.machine && bn.machine.hi === null };
    } catch (e) { out.boardNailErr = String(e && e.message).slice(0,160); }
    try {
      const pr = H.paperRustle(ctx, {});
      const d = pr.buffer.getChannelData(0), n = d.length;
      let pk = 0; for (let i = 0; i < n; i++) { const a = Math.abs(d[i]); if (a > pk) pk = a; }
      out.paperRustle = { clicks: pr.clicks, lo: pr.lo, hi: pr.hi, noiseSources: pr.noiseSources,
        machineIsEar: !!pr.machine && pr.machine.hi === null, peak: pk };
    } catch (e) { out.paperRustleErr = String(e && e.message).slice(0,160); }
  })();

  /* THE SOUNDSCAPE'S FIRST TWO WORKING SOUNDS (row [the soundscape], 10/9). Both reuse
     struckMetal's own free-free bar series; the claims read the real difference (mass and
     cadence) off the actual render, not off a label. */
  (function () {
    try {
      const sh = H.smithHammer(ctx, {});
      out.smithHammer = { what: sh.what, f0: sh.f0, seconds: sh.seconds,
        machineIsEar: !!sh.machine && sh.machine.hi === null };
    } catch (e) { out.smithHammerErr = String(e && e.message).slice(0,160); }
    try {
      const ar = H.armourerRivets(ctx, {});
      const d = ar.buffer.getChannelData(0), n = d.length;
      let pk = 0; for (let i = 0; i < n; i++) { const a = Math.abs(d[i]); if (a > pk) pk = a; }
      out.armourerRivets = { what: ar.what, f0: ar.f0, strikes: ar.strikes, seconds: ar.seconds,
        machineIsEar: !!ar.machine && ar.machine.hi === null, peak: pk };
    } catch (e) { out.armourerRivetsErr = String(e && e.message).slice(0,160); }
  })();

  /* THE BAR'S GLASS (row [the soundscape], 10/10). canOnWood's own construction, a
     contact landing summed with a material's own ring, done a second time for a glass
     set down on the bar's counter instead of a can on the stall's. */
  (function () {
    try {
      const bg = H.barGlassDown(ctx, {});
      out.barGlassDown = { woodSurface: bg.woodSurface, glassF0: bg.glassF0, seconds: bg.seconds,
        machineIsEar: !!bg.machine && bg.machine.hi === null };
    } catch (e) { out.barGlassDownErr = String(e && e.message).slice(0,160); }
  })();

  /* THE BLOCK (row [not sand], the keep/redo list's last eight, 10/10). canOnWood's own
     construction a third time: a parry is two hard things touching, the same definition
     the redo list's own criterion already names. */
  (function () {
    try {
      const wb = H.weaponBlock(ctx, {});
      out.weaponBlock = { woodSurface: wb.woodSurface, edgeF0: wb.edgeF0, seconds: wb.seconds,
        machineIsEar: !!wb.machine && wb.machine.hi === null };
    } catch (e) { out.weaponBlockErr = String(e && e.message).slice(0,160); }
  })();

  /* SOMETHING HERE STILL WORKS (Paolo, direct, 10/10: 'the best sounds of all time... impress
     me'). struckMetal's bell and powerOnHum are both already proven sounds; what is NEW here
     is a real sidechain duck, so the claim has to prove the duck actually happens over time,
     not just that two layers are present. TWO RENDERS AT THE DUCK'S OWN EXTREMES (0 and 0.9)
     are compared in two windows: right after the strike, where the bell's envelope is near
     its peak and a duck should make a real difference, and two seconds later, where the
     bell has mostly decayed and a duck has almost nothing left to grab. */
  (function () {
    try {
      const lf = H.legendaryFind(ctx, {});
      const bellAlone = H.struckMetal(ctx, { what: 'bell' });
      const d0 = H.legendaryFind(ctx, { duckAmount: 0 }).buffer.getChannelData(0);
      const d9 = H.legendaryFind(ctx, { duckAmount: 0.9 }).buffer.getChannelData(0);
      const rmsDiff = (a1, a2, lo, hi) => { let s = 0, c = 0; for (let i = lo; i < hi && i < a1.length && i < a2.length; i++) { const x = a1[i] - a2[i]; s += x * x; c++; } return c ? Math.sqrt(s / c) : 0; };
      const earlyLo = 0, earlyHi = Math.round(SR * 0.05);
      const lateLo = Math.round(SR * 2.0), lateHi = Math.round(SR * 2.2);
      out.legendaryFind = { bellF0: lf.bellF0, duckAmount: lf.duckAmount, seconds: lf.seconds,
        machineIsEar: !!lf.machine && lf.machine.hi === null,
        bellRatiosCount: bellAlone.ratios.length,
        earlyDiff: rmsDiff(d0, d9, earlyLo, earlyHi), lateDiff: rmsDiff(d0, d9, lateLo, lateHi) };
    } catch (e) { out.legendaryFindErr = String(e && e.message).slice(0,160); }
  })();

  /* THE BROADCAST (9/24). Three renders, because the questions are about DIFFERENCES:
     a working transmitter, a transmitter nobody has touched in ten years, and the worn
     one with a head that holds speed perfectly. The last is the control for the wobble
     and it runs BEFORE any reading it could falsify. */
  (function () {
    const en = a => { let s=0; for (let i=0;i<a.length;i++) s += a[i]*a[i]; return s; };
    const rmsOf = a => Math.sqrt(en(a)/(a.length||1));
    const hpf = (a, hz) => { const al = Math.exp(-2*Math.PI*hz/SR); let y=0, pr=0;
      const o = new Float64Array(a.length);
      for (let i=0;i<a.length;i++){ const x=a[i]; y = al*(y+x-pr); pr = x; o[i]=y; } return o; };
    const shareAbove4p = (a, hz) => { let z=a; for (let q=0;q<4;q++) z = hpf(z, hz);
      const t = en(a); return t>0 ? en(z)/t : null; };
    /* ABSOLUTE power in a narrow band around a frequency, NEVER relative to the
       window's own biggest bin. A noise-only window's biggest bin is luck, so a
       relative read reported the pair at 0 dB in the dead air where there is no pair
       at all -- the first cut of this measurement said exactly that. */
    const at = (a, f) => {
      if (a.length < N) return null;
      const w = new Float32Array(N); w.set(a.subarray(0, N));
      const pwr = spec(w); const k = Math.round(f*N/SR);
      let best = 0; for (let q=k-2;q<=k+2;q++) if (q>0 && q<pwr.length && pwr[q]>best) best = pwr[q];
      return best;
    };
    const look = (m) => {
      const d = m.buffer.getChannelData(0);
      const toneN = Math.round(SR*m.toneSeconds);
      const airFrom = toneN + Math.round(SR*0.25);     /* clear of the tone's 8 ms tail */
      const air = d.subarray(airFrom, d.length - 2);
      const half = Math.floor(air.length/2);
      let zeros = 0, pk = 0;
      for (let i=0;i<d.length;i++){ if (d[i] === 0) zeros++;
        const v = Math.abs(d[i]); if (v > pk) pk = v; }
      const inTone = d.subarray(Math.round(SR*2), Math.round(SR*2)+N);
      /* THE LOOP POINT, MEASURED AND NOT ASSERTED BY DESIGN. Option C is this on
         repeat, so the step from the last sample back to the first has to be an
         ordinary step and not a click. The bar is the buffer's OWN steps: the 99.9th
         percentile of every sample-to-sample jump in it. A click is an outlier; a jump
         inside the sound's own range is not audible as one. */
      const steps = new Float64Array(d.length - 1);
      for (let i = 1; i < d.length; i++) steps[i-1] = Math.abs(d[i] - d[i-1]);
      const sorted = Float64Array.from(steps).sort();
      const p999 = sorted[Math.floor(sorted.length * 0.999)];
      const wrapStep = Math.abs(d[0] - d[d.length-1]);
      return {
        wrapStep: wrapStep, stepP999: p999, stepMax: sorted[sorted.length-1],
        seconds: m.seconds, toneSeconds: m.toneSeconds, airSeconds: m.airSeconds,
        bars: m.bars, toneBeats: m.toneBeats, airBeats: m.airBeats,
        len: d.length, peak: pk, zeros: zeros,
        rmsTone: rmsOf(inTone), rmsAir: rmsOf(air),
        airFirstHalf: rmsOf(air.subarray(0, half)), airSecondHalf: rmsOf(air.subarray(half)),
        airAboveDeclared: shareAbove4p(air, m.machine.hi),
        airAboveOctaveUp: shareAbove4p(air, m.machine.hi*2),
        pairInTone: [at(inTone, m.tones[0]), at(inTone, m.tones[1])],
        pairInAir:  [at(air, m.tones[0]), at(air, m.tones[1])],
        drops: m.dropouts, wow: m.wow, hiss: m.hiss, machineHi: m.machine.hi
      };
    };
    try {
      const worn  = H.theBroadcast(ctx, {});                        /* wear 1 by default */
      const clean = H.theBroadcast(ctx, { wear: 0 });
      const steady = H.theBroadcast(ctx, { wow: false });           /* the wobble's control */
      const a = look(worn), b2 = look(clean);
      /* the wobble is proved by DIFFERENCE from a perfect head, on the same material */
      const dw = worn.buffer.getChannelData(0), ds = steady.buffer.getChannelData(0);
      let maxDiff = 0, sameLen = dw.length === ds.length;
      if (sameLen) for (let i=0;i<dw.length;i++) maxDiff = Math.max(maxDiff, Math.abs(dw[i]-ds[i]));
      out.bcast = { worn: a, clean: b2,
        wowSameLength: sameLen, wowMaxDiff: maxDiff, wowAsked: worn.wow };
    } catch (e) { out.bcastErr = String(e && e.message).slice(0,120); }
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
      /* *** AND THIS MEASUREMENT WAS LENIENT BY 2.3x FOR EVERY CLAIM IT EVER MADE, WHICH
         IS THE bandTo LESSON RUNNING IN THE OTHER DIRECTION AND IN MY OWN RULER. It used
         FOUR CASCADED ONE-POLE HIGH-PASSES at the declared corner, and cascading raises a
         high-pass's combined -3 dB point exactly as it lowers a low-pass's: four poles at
         fc turn over at 2.299*fc. So "the share above 5,000 Hz" was really the share above
         11,500 Hz, and every band number this gate has printed -- 0.54%, 0.63%, 0.03%,
         the station's 3.1%, THE FLIP'S 21% LEAK -- was measured through a filter that
         let two and a third octaves of the thing being measured through unmeasured.
         A NUMBER THAT DOES NOT MEAN WHAT ITS NAME SAYS IS WORSE THAN NO NUMBER, and this
         is the third time this lane has written that sentence about its own instrument.
         AN FFT BAND SUM HAS NO CORNER TO MOVE, so that is what it is now, on the same
         loudest window every other spectral number here is taken on. *** */
      const w = loudest(d), p = spec(w);
      let tot = 0, ab = 0, way = 0;
      for (let k=1;k<p.length;k++){ const f = k*SR/N; tot += p[k];
        if (f > dec) ab += p[k]; if (f > dec*2) way += p[k]; }
      m.shareAboveDeclared = tot > 0 ? ab/tot : null;
      m.shareAboveOctaveUp = tot > 0 ? way/tot : null;
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
        /* AND THE BROADCAST: A TRANSMITTER SOMEBODY STILL MAINTAINS. Not a sine, because
           the material is right and the question is whether the machine has been left
           alone for ten years. wear 0 is the honest falsifier: same signal, same band,
           same carrier, no hiss lift, no drop-outs, no slipping head. The hiss, drop-out
           and wobble claims must all go red and the timing and band claims must stay
           green, because a maintained transmitter still keeps its own band. */
        const realBcast = H.theBroadcast;
        H.theBroadcast = (ctx, o) => realBcast(ctx, Object.assign({}, o || {}, { wear: 0 }));
        /* AND THE FOOTSTEP THAT IS NOT SAND: THE SAND ONE. Not a sine -- the exact thing he
           rejected, which is the only falsifier that means anything here. If the claims
           about noise, flatness, brightness and the two surfaces stay green when the new
           footstep IS the old one, they were never claims. */
        const sandStep = H.footstep;
        H.footstepModelled = (ctx, o) => sandStep(ctx, o || {});
        /* AND THE DECK: A DECK WITH NOTHING WRONG WITH IT, PLUS THE HISS EVERYBODY
           REACHES FOR. Three falsifiers in one, because the round makes three kinds of
           claim about it and a single sine would only break the first:
             (1) noiseInto IS CALLED, so the structural claim has something to fail on.
                 A structural check that reads a function's own text cannot be falsified
                 by swapping the function for a different clean one, so the mutation has
                 to be a dirty one.
             (2) the two wobbles are ZERO and the tape starts AT speed, so every claim
                 about the reel, the capstan, the drift and the spin-up must go red. A
                 perfect machine is the right falsifier here for the same reason it was
                 for the tape: the material is fine, the question is whether the machine
                 is a machine.
             (3) the tape change becomes ONE knock, which is a button and not a mechanism. */
        const realDeck = H.theTapeDeck, realProbe = H.transportProbe, realChange = H.theTapeChange;
        H.theTapeDeck = (ctx, o) => {
          const m = realDeck(ctx, Object.assign({}, o || {},
            { wowDepth: 0, flutDepth: 0, knocks: 1 }));
          const dd = m.buffer.getChannelData(0);
          H.noiseInto ? H.noiseInto(dd, dd.length, 0.15, 7) : (function () {
            /* the hiss a cassette is always given and never needs: a plain noise bed */
            let x = 12345;
            for (let i = 0; i < dd.length; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff;
              dd[i] += ((x / 0x7fffffff) * 2 - 1) * 0.15; }
          })();
          m.noiseSources = 1;
          return m;
        };
        H.transportProbe = (ctx, o) => realProbe(ctx, Object.assign({}, o || {},
          { wowDepth: 0, flutDepth: 0, spinUp: 1e-9 }));
        H.theTapeChange = (ctx, o) => realChange(ctx, Object.assign({}, o || {}, { what: 'seat' }));
        /* AND THE BAND HELPER: PUT THE OLD LEAKING CHAIN BACK. The band claims read
           H.bandTo directly, so nothing else in this harness touches them, and a claim
           nothing can falsify is not a claim. The two honest claims must go red and the
           "the old chain really did leak" claim must stay GREEN, because it asks for the
           legacy path by name and still gets it. */
        /* AND THE STRIKE: ONE SINE. A bell IS its partial series, so a single tone is the
           exact thing it is not, and it is also what 51 of the 65 shipped sounds measure
           as. The ratio, inharmonicity and top-dies-first claims must all go red. */
        const realStrike = H.struckMetal;
        H.struckMetal = (ctx, o) => {
          const m = realStrike(ctx, o);
          const dd = m.buffer.getChannelData(0), sr = ctx.sampleRate;
          for (let i = 0; i < dd.length; i++)
            dd[i] = Math.sin(2*Math.PI*220*i/sr) * Math.exp(-i/sr/0.4) * 0.85;
          m.ratios = [1]; m.longestTailSeconds = 0.4; m.shortestTailSeconds = 0.4;
          return m;
        };
        const realBand = H.bandTo;
        H.bandTo = (d, n, lo, c, sr, p, band) =>
          realBand(d, n, lo, c, sr, p, Object.assign({}, band || {}, { legacy: true }));
        /* AND THE THREE HUMS: THE WRONG PITCH, WHICH IS THE ONLY QUESTION THIS ROUND
           ASKS OF THEM. Not a structural swap -- the recipe is right on purpose, so the
           falsifier is the one thing rule 2 actually tests: a hum off the grid. AND IT
           HAS TO REPLACE THE THREE EXPORTED WRAPPERS, NOT harmonicHum: generatorHum,
           powerOnHum and signAliveHum call harmonicHum BY CLOSURE, never through H, the
           exact trap this file already caught once on wowFlutter (a mutation on a name
           nothing calls is not a mutation). If the three pitch claims stay green while
           every hum reads 90 Hz instead of its real target, they were never claims. */
        const realHarmonic = H.harmonicHum;
        const wrong = (ctx, o) => realHarmonic(ctx, Object.assign({}, o || {}, { hz: 90, riseFromHz: 90, parts: [[1,1]] }));
        H.generatorHum = wrong; H.powerOnHum = wrong; H.signAliveHum = wrong;
        /* AND THE GROUND TAKES IT / BOOTS GO / SET IT DOWN (10/1): SAME TRAP, SAME FIX.
           groundTakesIt, bootsGoDirt and objectSetDown all call the local footstepModelled
           and footstepWalk BY CLOSURE, never through H, so swapping H.footstepModelled
           above touches none of them. The falsifier has to replace these four exported
           names directly, with the one thing he rejected twice: the graveyarded sand
           recipe, which carries none of contacts/heelToeMs/surface/firstModeHz. */
        const wrongContact = (ctx, o) => sandStep(ctx, o || {});
        H.groundTakesIt = wrongContact;
        H.objectSetDown = wrongContact;
        H.objectSetDownAgain = wrongContact;
        H.bootsGoDirt = (ctx, o) => {
          const one = sandStep(ctx, {});
          return { buffer: one.buffer, steps: 1, surface: 'mutated', perBeat: 1, atSeconds: [0] };
        };
        /* AND THE TURN CLOSES (10/4): SAME TRAP AGAIN. endTurnClick calls struckMetal BY
           CLOSURE, so the H.struckMetal swap above never reaches it; the falsifier has to
           replace H.endTurnClick itself, with the full-length pipe ring at its own f0 and
           none of the short-cut-off fields the claims read. */
        H.endTurnClick = (ctx, o) => {
          const m = realStrike(ctx, { what: 'pipe', f0: 196 });
          return { buffer: m.buffer, seconds: m.seconds, what: 'pipe', f0: 196 };
        };
        /* AND THE MAP IN MOTION (10/5): SAME TRAP A THIRD TIME. travelRoadBed and
           travelDirtBed call the local footstepWalk BY CLOSURE, and nightInsects calls
           the local crackleInto and bandTo the same way, so none of the swaps above
           reach them. The falsifier has to replace all three exported names directly:
           both travel beds collapse to the SAME perBeat (no tempo difference at all),
           and the insects become a flat, unfiltered noise bed (the thing rule 32e
           graveyarded) with no clicks to count.
           Flat noise it may be, but it is not SILENT noise -- rms has to clear the
           claim's own 0.01 floor as a plain safety-check so this does not falsely read
           as "clicks: 0" ever doing the mutation's job for it. */
        const flatSameTempo = (ctx, o) => {
          const beats = (o && o.beats != null) ? o.beats : 6;
          return { buffer: ctx.createBuffer(1, 1, ctx.sampleRate), surface: 'mutated',
            perBeat: 1, steps: beats, seconds: beats * 0.5 };
        };
        H.travelRoadBed = flatSameTempo; H.travelDirtBed = flatSameTempo;
        H.nightInsects = (ctx, o) => {
          const secs = (o && o.secs) || 4.0, sr = ctx.sampleRate, n = Math.round(sr * secs);
          const buf = ctx.createBuffer(1, n, sr), dd = buf.getChannelData(0);
          for (let i = 0; i < n; i++) dd[i] = (Math.random() * 2 - 1) * 0.5;
          return { buffer: buf, seconds: secs, clicks: 0, lo: 0, hi: sr / 2, noiseSources: 1 };
        };
        /* AND THE TITLE'S OWN MUSIC (10/5): titleTheme calls the local songOnTape and
           roomHum BY CLOSURE, so no swap above reaches it either. The falsifier plays the
           canon pitch untouched (detune 1, so root equals canonRoot exactly), zero wow,
           and never actually sums the room in regardless of roomRel -- all three claims
           have to go red together. */
        H.titleTheme = (ctx, o) => {
          const canon = (o && o.root) || 174.61;
          const n = Math.round(ctx.sampleRate * 2);
          return { buffer: ctx.createBuffer(1, n, ctx.sampleRate), seconds: n / ctx.sampleRate,
            root: canon, canonRoot: canon, detune: 1, wowDepth: 0, wowRateHz: 0,
            roomRel: (o && o.roomRel) == null ? 0.025 : o.roomRel,
            machine: { hi: 5000 } };
        };
        /* AND THE SETTLEMENT'S SOUNDS (10/5): all four call harmonicHum, objectSetDown,
           struckMetal or crackleInto BY CLOSURE, so each falsifier replaces the OUTER
           wrapper's own exported name directly, same as every reused wrapper above. */
        H.barberClippers = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          hz: 60, noiseSources: 1, synth: 'noise', machine: { hi: 5000 } });
        H.canOnWood = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          woodSurface: 'mutated', tinF0: 0, seconds: 0, machine: { hi: 5000 } });
        H.boardNail = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          what: 'mutated', f0: 0, seconds: 1, machine: { hi: 5000 } });
        H.paperRustle = (ctx, o) => {
          const secs = (o && o.secs) || 1.5, sr = ctx.sampleRate, n = Math.round(sr * secs);
          const buf = ctx.createBuffer(1, n, sr), dd = buf.getChannelData(0);
          for (let i = 0; i < n; i++) dd[i] = (Math.random() * 2 - 1) * 0.5;
          return { buffer: buf, clicks: 0, lo: 0, hi: sr / 2, noiseSources: 1, machine: { hi: 5000 } };
        };
        /* AND THE SOUNDSCAPE'S FIRST TWO WORKING SOUNDS (10/9): both call struckMetal BY
           CLOSURE, same trap, same fix. */
        H.smithHammer = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          what: 'mutated', f0: 0, seconds: 1, machine: { hi: 5000 } });
        H.armourerRivets = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          what: 'mutated', f0: 0, strikes: 0, seconds: 1, machine: { hi: 5000 } });
        /* AND THE BAR'S GLASS (10/10): the same trap a third time, objectSetDown and
           struckMetal both by closure. */
        H.barGlassDown = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          woodSurface: 'mutated', glassF0: 0, seconds: 0, machine: { hi: 5000 } });
        /* AND THE BLOCK (10/10): the same trap a fourth time. */
        H.weaponBlock = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          woodSurface: 'mutated', edgeF0: 0, seconds: 0, machine: { hi: 5000 } });
        /* AND SOMETHING HERE STILL WORKS (10/10): struckMetal and powerOnHum both by
           closure, and the duck itself only exists inside this wrapper. */
        H.legendaryFind = (ctx, o) => ({ buffer: ctx.createBuffer(1, 1, ctx.sampleRate),
          bellF0: 0, duckAmount: 0, seconds: 0, machine: { hi: 5000 } });
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
    /* *** THIS CLAIM USED TO PASS AT FLATNESS 0.2283 AND IT NOW READS 0.0003, AND THAT
       COLLAPSE IS THE FINDING OF THE ROUND RATHER THAN A REGRESSION. *** The band helper
       leaked 27.55% of this sound above its own declared corner. Fix the helper and the
       texture goes with the leak: a 760-fold fall in flatness, which means WHAT MADE THIS
       READ AS NOISE AT ALL WAS THE ENERGY SITTING OUTSIDE THE BAND IT CLAIMED. Inside an
       honest band the noise recipe is a dull thud, not a footfall. Paolo killed it for
       sounding like sand (9/23) and the measurement now says it was never a footstep.
       So it is PRINTED, not asserted: the sound is in the graveyard (rule 32e, second
       rejection) and a dead recipe does not get a green tick or hold the suite hostage.
       The replacement is A FOOTSTEP THAT IS NOT SAND, which has no noise in it at all. */
    claim('THE NOISE FOOTSTEP WAS ONLY NOISE BECAUSE OF THE LEAK (graveyard reading)', true,
      'flatness was 0.2283 with the leaking band and reads ' + F.flatness.toFixed(4)
      + ' with an honest one, a ' + Math.round(0.2283 / Math.max(F.flatness, 1e-9))
      + '-fold fall. Its texture lived entirely above the corner it declared');
    claim('AND IT HAS REAL ENERGY UP HIGH', F.above1k > 0.20 && F.above4k > 0.05,
      (100*F.above1k).toFixed(1) + '% above 1 kHz, ' + (100*F.above4k).toFixed(1) + '% above 4 kHz');

    /* ---- SCHOOL RULE 4: the band names its machine, WITHIN AN OCTAVE ---------
       The rule's own words: the top corner "matches that machine's number within an
       octave". Measured on the same window as everything else. */
    /* SCHOOL RULE 4, HELD BY ENERGY RATHER THAN BY A CORNER, AND THE RULER WAS FIXED THIS
       ROUND. The old reading cascaded four one-pole high-passes at the declared corner,
       which turns over at 2.299 times it, so every band number this gate printed was
       measured two and a third octaves too high and came back tiny. On an FFT band sum,
       which has no corner to move, FOUR OF THESE SOUNDS LEAK AND TWO OF THEM LEAK ABOUT
       A THIRD OF THEIR ENERGY:

         a footstep on the beat   0.54% reported  ->  27.55% really, above its own 4,500 Hz
         the step loses contact   0.63%           ->  28.85%
         the door                 0.04%           ->  15.96%
         the fight's cloud        0.04%           ->   6.06%

       *** AND THE TWO WORST ARE THE TWO HE KILLED FOR SOUNDING LIKE SAND. *** That is
       what sand IS: band-limited noise whose band is not actually limited. The
       coordinator's line on [band helper] -- "the 21% leak is likely the sand itself" --
       is now measured, and the true numbers are bigger than 21%.

       SO THIS IS A RATCHET AND NOT A RED. A checker that goes red on four sounds the day
       its own ruler is fixed breaks the suite for twenty lanes over work nobody has done
       yet; the pattern this repo settled on is to freeze the debt, print it, and refuse
       to let it grow. Anything NOT in the debt list is held to 5% and 1% outright. */
    /* *** THE DEBT LIST IS GONE, AND IT IS GONE BECAUSE IT WAS PAID, NOT BECAUSE IT WAS
       DELETED. *** Last round this held four frozen leaks (the footstep 27.55%, the step
       drop-out 28.85%, the door 15.96%, the cloud 6.06%) with the note that a checker going
       red the day its own ruler is fixed breaks the suite for twenty lanes. This round the
       HELPER was fixed, every noise sound was re-rendered, and the same four measure 3.32%,
       3.37%, 1.63% and 0.84% on the same honest ruler. So school rule 4's real bars, under
       5% and under 1%, are asserted outright again and the grandfather clause is deleted.
       A RATCHET IS SUPPOSED TO END.
       ONE SOUND IS NOT ASKED, AND IT IS NOT AN EXCUSE: the flip is KILLED (Paolo 9/23,
       "kinda dogshit", the second rejection of the noise recipe, rule 32e). Its gap is
       DELIBERATELY wider-banded than its station, which is the whole AGC mechanism, so the
       AM band it declares never described the gap and the claim was asking the wrong
       question of that sound -- the third time this lane has caught itself doing that. A
       dead recipe does not get a green tick either; it gets named. */
    const GRAVEYARD = {
      'sounds-what-a-flip-sounds-like-9-25':
        'KILLED 9/23 ("kinda dogshit"), and its gap is wider-banded than its station on '
        + 'purpose, so the AM corner it declares never described it'
    };
    for (const [id, r] of Object.entries(d.rows)) {
      const dec = r.machine && r.machine.hi;
      const nm = id.replace('sounds-','').replace('-9-21','');
      /* *** A SOUND THAT DECLARES NO MACHINE IS NOT ASKED A BAND QUESTION, AND THIS READ
         "0.00% of its energy sits above the null Hz it declares" BEFORE IT WAS FIXED.
         DIRECTION's bible rule 8: tape damage lives only inside in-world speakers and the
         lens is an eye, so a footfall under your own boot has no machine and rule 4 does
         not apply to it. MACHINE.EAR carries hi: null on purpose. A claim that reports a
         percentage above "null Hz" is not a strict check, it is a broken one. *** */
      if (dec == null) {
        claim('NOT ASKED OF ' + nm + ': it is heard with your own ears, so it declares no machine',
          r.machine != null,
          'bible rule 8, DIEGETIC OR DEAD. School rule 4 is for sounds that came off a '
          + 'machine; this one did not, and pretending otherwise is how a real sound gets '
          + 'filtered to satisfy a table');
        continue;
      }
      const dead = GRAVEYARD[id];
      if (dead) {
        claim('NOT ASKED OF ' + nm + ': it is in the graveyard', true,
          dead + '. Reading ' + (100*(r.shareAboveDeclared||0)).toFixed(2)
          + '% above its own ' + dec + ' Hz, printed and not asserted');
        continue;
      }
      claim('THE BAND STOPS WHERE ITS MACHINE STOPS: ' + nm,
        r.shareAboveDeclared != null && r.shareAboveDeclared < 0.05,
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

    /* ---- WHAT THIS VALLEY STRIKES ON THE HOUR (9/24) ------------------------ */
    if (d.strike) {
      const B = d.strike.bell, C = d.strike.cracked, P = d.strike.pipe, G = d.strike.glass;
      claim('THERE IS NO NOISE IN ANY OF THE FOUR STRIKES, read off the shipped function',
        d.strike.noiseInSource === false
          && B.noiseSources === 0 && C.noiseSources === 0 && P.noiseSources === 0 && G.noiseSources === 0,
        'rule 32e: new sounds from real material. A struck metal object is a set of MODES, '
        + 'so there is nothing here for a noise generator to do, and the check is on the '
        + 'code rather than on a spectrum because that is a fact about how it was built');
      /* THE PUBLISHED SERIES, WRITTEN OUT HERE SO THE TABLE CANNOT QUIETLY DRIFT OFF IT.
         A founder tunes a bell to a MINOR THIRD: hum, prime, tierce at 6/5, quint, nominal.
         A free-free bar is INHARMONIC: 1 : 2.756 : 5.404 : 8.933 : 13.34. */
      claim('AND THE BELL IS TUNED THE WAY A FOUNDER TUNES ONE, on a minor third',
        JSON.stringify(B.ratios.slice(0,5)) === JSON.stringify([0.5, 1.0, 1.2, 1.5, 2.0]),
        'hum 0.5, prime 1, TIERCE 1.2 which is a minor third (6/5), quint 1.5, nominal 2. '
        + 'The minor tierce is the whole character of a bell and it is also this lane\'s own '
        + 'no-major-third rule agreeing with a bell founder by accident');
      claim('AND THE PIPE IS A FREE-FREE BAR, which is not a chord at all',
        JSON.stringify(P.ratios) === JSON.stringify([1, 2.756, 5.404, 8.933, 13.34]),
        'the classic transverse series. That inharmonicity is why it reads as metal somebody '
        + 'found rather than as a bell, and it is why the pipe measures '
        + Math.round(P.centroid) + ' Hz bright against the bell\'s ' + Math.round(B.centroid));
      /* AND THE COUNT IS PART OF THE CLAIM. The first cut only asked that the partials it
         found were loud enough, so a BARE SINE walked straight through it under --mutate:
         one ratio, one reading, at 0 dB, and `every` on a one-item list is always true. A
         struck object is a SET of modes; one mode is a tone. So the number of modes really
         present is checked before their levels are. A claim nothing can falsify is not a
         claim, and this one had to be shown a sine before it admitted it. */
      claim('AND EVERY DECLARED PARTIAL IS REALLY IN THE SOUND, not only in the table',
        B.partialsDb.length >= 8 && P.partialsDb.length >= 5
          && B.partialsDb.slice(0,5).every(x => x > -40) && P.partialsDb.slice(0,3).every(x => x > -40),
        'the bell carries ' + B.partialsDb.length + ' modes and the pipe ' + P.partialsDb.length
        + '; the bell\'s first five read ' + B.partialsDb.slice(0,5).join(', ')
        + ' dB under its loudest bin, and the pipe\'s first three ' + P.partialsDb.slice(0,3).join(', ')
        + '. A ratio in a table is a promise; this is the sound');
      claim('AND THE TOP DIES FIRST, which is physics and not a choice',
        B.longestTail > B.shortestTail * 4 && P.longestTail > P.shortestTail * 4,
        'the bell rings ' + B.longestTail + ' s at the hum and ' + B.shortestTail
        + ' s at its highest partial, ' + (B.longestTail/B.shortestTail).toFixed(1)
        + 'x. Damping rises with frequency, which is why a bell WARMS as it decays');
      claim('AND A CRACK TAKES THE RING OUT OF IT, which is the realistic one here',
        C.longestTail < B.longestTail * 0.6,
        'the bell rings ' + B.longestTail + ' s and the cracked one ' + C.longestTail
        + ' s. A crack stops the shell moving as one piece, so nothing in a valley nobody '
        + 'has maintained for ten years rings like a cast bell');
      claim('AND THE STRIKE LANDS ON THE BEAT (the 120 BPM law)',
        B.peakAtMs < 55 && C.peakAtMs < 55 && P.peakAtMs < 55,
        'loudest instant ' + B.peakAtMs.toFixed(1) + ', ' + C.peakAtMs.toFixed(1) + ' and '
        + P.peakAtMs.toFixed(1) + ' ms against the fight\'s 55 ms PERFECT window. The RING '
        + 'runs on for seconds after, which is legal: the law is about when a sound starts');
      claim('AND NO RING IS CHOPPED OFF, because a chopped ring is a click',
        B.lastSample <= B.stepP999 * 0.05 && C.lastSample <= C.stepP999 * 0.05
          && P.lastSample <= P.stepP999 * 0.05,
        'last samples ' + B.lastSample.toFixed(6) + ', ' + C.lastSample.toFixed(6) + ', '
        + P.lastSample.toFixed(6) + ' against their own 99.9th-percentile steps of '
        + B.stepP999.toFixed(4) + ', ' + C.stepP999.toFixed(4) + ', ' + P.stepP999.toFixed(4)
        + '. The first cut chopped the bell mid-ring with 0.21 rms still going');
      claim('AND NONE OF THEM CLIPS (school rule 8)',
        B.peak <= 1 && C.peak <= 1 && P.peak <= 1 && G.peak <= 1,
        'peaks ' + B.peak.toFixed(4) + ', ' + C.peak.toFixed(4) + ', ' + P.peak.toFixed(4)
        + ', ' + G.peak.toFixed(4) + ', through a tanh rather than a ceiling');
      /* THE BAR'S GLASS (10/10): a drinking glass's own real character, against the same
         test that caught the bare-sine false positive on this table once already (a claim
         that only asks "loud enough" cannot tell a chord from a tone, so the count itself
         is the claim, exactly as it is for the bell and the pipe above). */
      claim('AND THE GLASS IS THE ONE ENTRY WITH A SINGLE PARTIAL, which is its own real character',
        G.ratios.length === 1 && G.partialsDb.length === 1 && G.partialsDb[0] > -3
          && B.ratios.length > 1 && P.ratios.length > 1,
        'the bell carries ' + B.ratios.length + ' modes and the pipe ' + P.ratios.length
        + '; the glass carries ' + G.ratios.length + ', reading ' + G.partialsDb[0]
        + ' dB under its own loudest bin, which IS its loudest bin -- a struck tumbler\'s '
        + 'well-known "one clear pitch" against the bell\'s chord and the pipe\'s clangy stack');
      /* THE FIRST CUT OF THIS CLAIM ASSUMED LOWER DAMPING MEANS A LONGER RING, AND IT IS
         WRONG: tail = 1/(pi f damp), so PITCH MATTERS AS MUCH AS LOSS. The pipe's own
         196 Hz fundamental outrings the glass's 650 Hz one even though the glass loses
         less energy per cycle, because the glass pays that advantage back in cycles per
         second. A real bar tumbler's clink really is brief, and this is the honest reason
         why: not fast energy loss, a high pitch. */
      claim('AND THE GLASS RINGS SHORTER THAN THE PIPE DESPITE LOSING LESS PER CYCLE, because pitch outweighs loss here',
        G.longestTail < P.longestTail && G.f0 > P.f0,
        'the glass rings ' + G.longestTail + ' s against the pipe\'s ' + P.longestTail
        + ' s, even though its damping (0.05%) is below the pipe\'s own 0.08%: tail time is '
        + '1/(pi f damp), and the glass\'s 650 Hz against the pipe\'s 196 Hz decides it. A '
        + 'glass really does clink and go quiet fast, and the real reason is its pitch, not '
        + 'a hidden loss this table never gave it');
      claim('AND THE GLASS STILL LANDS ON THE BEAT AND NEITHER CLIPS NOR CHOPS',
        G.peakAtMs < 55 && G.lastSample <= G.stepP999 * 0.05,
        'loudest instant ' + G.peakAtMs.toFixed(1) + ' ms; last sample ' + G.lastSample.toFixed(6)
        + ' against its own 99.9th-percentile step of ' + G.stepP999.toFixed(4));
    } else { claim('WHAT THIS VALLEY STRIKES was measured', false, d.strikeErr || 'no reading'); }

    /* ---- THE DECK, AND THE FLIP AS A TAPE CHANGING (9/27) -------------------- */
    if (d.tape) {
      const T = d.tape;
      claim('THERE IS NO NOISE IN THE DECK, THE TAPE CHANGE OR THE SPEED LAW, read off the shipped code',
        T.noiseInDeck === false && T.noiseInChange === false && T.noiseInSpeed === false
          && T.deckSources === 0 && T.changeSources === 0,
        'rule 32e. AND FLATNESS IS NOT USED AS THE EVIDENCE HERE ON PURPOSE: the tape he '
        + 'killed reads 0.0000 on it and so does this one, because the loudest window of a '
        + 'tune is a note in both. A ruler that cannot separate them proves nothing about either');
      /* THE GEOMETRY. 4.7625 cm/s is the Compact Cassette standard's tape speed, and a
         wheel's rate is that over its circumference. Recomputed here so the table cannot
         drift away from what the recipe reports. */
      claim('EVERY RATE IN THE DECK IS THE WHEEL\'S OWN GEOMETRY, not a number somebody liked',
        Math.abs(T.capstanSaid - T.capstanGeom) < 0.001 && Math.abs(T.hubSaid - T.hubGeom) < 0.001
          && Math.abs(T.reelSaid - T.reelGeom) < 0.001 && Math.abs(T.speedCmS - 4.7625) < 1e-9,
        'tape speed ' + T.speedCmS + ' cm/s (1 7/8 ips, by the standard): capstan '
        + T.capstanGeom.toFixed(4) + ' rev/s, empty hub ' + T.hubGeom.toFixed(4)
        + ', full reel ' + T.reelGeom.toFixed(4) + '. Before this the wobble in this file was '
        + '1.4 Hz, which is inside the rule and is no part of any machine');
      claim('AND THE INSTRUMENT IS NOT MEASURING ITS OWN ARITHMETIC',
        T.control && T.control.depthPct < 0.01,
        'the same tone with both wobbles switched off reads ' + T.control.depthPct.toFixed(4)
        + '%. My first ruler read 2.85% on this control, which is eight times the 0.35% it '
        + 'was aimed at, and the control is the only reason that never reached a record');
      /* the expected rate is DERIVED from the two geometries and where in the side the
         deck's default sits, never typed: hub + (reel - hub) * through, at through 0.15.
         The first cut of this claim carried a literal 0.6455 and a stray `* 0`, which is a
         number that would keep passing after the geometry changed underneath it. */
      const THROUGH = 0.15;
      const wowExpect = T.hubGeom + (T.reelGeom - T.hubGeom) * THROUGH;
      claim('THE REEL IS HEARD AT THE REEL\'S RATE',
        T.wowOnly && Math.abs(T.wowOnly.rateHz - wowExpect) < 0.02
          && Math.abs(T.wowOnly.depthPct - 0.35) < 0.03,
        'wow alone: ' + T.wowOnly.depthPct.toFixed(3) + '% at ' + T.wowOnly.rateHz.toFixed(4)
        + ' Hz, against the reel\'s own ' + wowExpect.toFixed(4) + ' rev/s '
        + (THROUGH*100) + '% of the way through a side, which is where the deck sits by default');
      claim('AND THE CAPSTAN AT THE CAPSTAN\'S RATE, which is the other wheel and the faster wobble',
        T.flutOnly && Math.abs(T.flutOnly.rateHz - T.capstanGeom) < 0.05
          && Math.abs(T.flutOnly.depthPct - 0.08) < 0.02,
        'flutter alone: ' + T.flutOnly.depthPct.toFixed(3) + '% at ' + T.flutOnly.rateHz.toFixed(4)
        + ' Hz against the capstan\'s ' + T.capstanGeom.toFixed(4)
        + '. Both wheels turn at once in the sound because both turn at once in the machine');
      /* *** THE ONE THAT MATTERS: THE WOW RATE FALLS AS THE REEL FILLS. *** */
      const worst = Math.max.apply(null, T.drift.map(x => Math.abs(x.errPct)));
      claim('THE WOW RATE FALLS ACROSS A SIDE, BECAUSE THE TAKE-UP REEL GETS FATTER',
        T.drift[0].soundHz > T.drift[4].soundHz * 1.5 && worst < 1.5,
        T.drift.map(x => 'at ' + x.through.toFixed(2) + ' the geometry says '
          + x.geometryHz.toFixed(4) + ' and the sound says ' + x.soundHz.toFixed(4)).join('; ')
        + '. Worst disagreement ' + worst.toFixed(2) + '%. A deck at the end of a side breathes '
        + 'slower than the same deck at the start, and that is the whole reason a tape sounds tired');
      claim('THE TAPE COMES UP TO SPEED INSTEAD OF STARTING AT IT',
        T.spinUp[0] != null && T.spinUp[0] < 55 && T.spinUp[1] > T.spinUp[0]
          && T.spinUp[3] > 99 && T.spinUpControlPct > 99,
        'percentage of final speed: ' + T.spinUp.map(x => x == null ? '?' : x.toFixed(1) + '%').join(', ')
        + ' over the first 0.1, 0.2, 0.4 and 2.5 s. THE CONTROL with the ramp switched off reads '
        + T.spinUpControlPct.toFixed(1) + '% from the first window, so the ramp is the cause '
        + 'and not the ruler. This is the part a whoosh was standing in for');
      claim('WHAT SHIPS IS INSIDE RULE 5 AND THE WORN ONE IS DELIBERATELY OUTSIDE IT',
        T.both.depthPct >= 0.15 && T.both.depthPct <= 0.60 && T.wornBoth.depthPct > 0.60,
        'A reads ' + T.both.depthPct.toFixed(3) + '% and C reads ' + T.wornBoth.depthPct.toFixed(3)
        + '% against rule 5\'s 0.15 to 0.60%. A deck that tired is a deck outside the spec the '
        + 'standard sets for it, which is what worn means. I wrote "still inside rule 5" in the '
        + 'recipe first and the measurement said otherwise');
      claim('THE MECHANISM IS TWO KNOCKS AND NOT ONE, because one is a button',
        T.clacks === 2 && T.clackGapMs > 20 && T.clackGapMs < 120,
        'the lever, then the head assembly and the roller arriving ' + T.clackGapMs
        + ' ms later. The gap is the part that says machine');
      /* THE RING TIME WINDOW MOVED THIS ROUND, AND THE REASON IS PAOLO'S OWN WORDS.
         The old bound (10 to 80 ms) matched loss 0.02, the bare material's own figure.
         Measured on the rendered buffer: flatness 0.0000, a near-pure tone, and 493 Hz
         alone carried 55.8% of the loudest window -- "I hated all these noiseS" on both
         the deck and the flip that share this shell. A shell held in a hand and seated
         against a mechanism is not a free plate (the footstep's own slab-on-grade
         correction, reused rather than re-argued), so loss is now 0.22 and the
         fundamental rings 2 to 4 ms, the same range the footstep's own ground modes sit
         in (0.4 to 3.5 ms). 493 Hz's share of the loudest window fell to 15.9%, close to
         the footstep's own peak-bin share (11.9%) on the fix Paolo has not yet objected
         to. */
      claim('AND THE KNOCK IS THE SHELL\'S OWN PLATE MODES, off the footstep\'s own function',
        T.shellModeCount >= 8 && T.shellLowestHz > 300 && T.shellLowestHz < 800
          && T.shellRingMs > 1 && T.shellRingMs < 10,
        'polystyrene, 1.2 mm walls, 64 mm across: lowest mode ' + Math.round(T.shellLowestHz)
        + ' Hz ringing ' + T.shellRingMs.toFixed(2) + ' ms over ' + T.shellModeCount
        + ' modes. Published E, rho and v; the loss factor is a damped-in-mounting estimate '
        + 'and the recipe says so on its face');
      claim('THE SONG IS AUDIBLE UNDER THE CLUNK, and the machine-only option really has no song',
        T.songRms > 0.03 && T.clunkRms > 0 && T.deckHasProgramme === true
          && T.machineHasProgramme === false,
        'the song sits ' + (20*Math.log10(T.songRms/T.clunkRms)).toFixed(1)
        + ' dB under the clunk (rms, so it is loudness and not a peak). A mechanical clunk '
        + 'really is louder than the music on a real deck');
      claim('THE FLIP FITS ONE BEAT, and the option that does not says so',
        T.changeFits === true && T.seatFits === true && T.doorFits === false
          && T.changeSeconds <= T.beat + 1e-6,
        'A is ' + T.changeSeconds.toFixed(3) + ' s with knocks at ' + T.changeAtMs.join(' and ')
        + ' ms inside a ' + T.beat + ' s beat; C runs ' + T.doorSeconds.toFixed(3)
        + ' s and is marked as not fitting rather than trimmed to look like it does. He will '
        + 'hear this hundreds of times, so the failure mode is not "too quiet", it is "I am sick of it"');
      claim('AND IT DECLARES NO BAND, because the old flip declared one it never obeyed',
        T.changeBandHi === null && T.oldFlipBandHi !== null,
        'the killed flip published a ' + T.oldFlipBandHi + ' Hz AM ceiling while its own gap '
        + 'was built wider-banded than any AM channel on purpose. This is heard with your ears '
        + 'in the room, so there is no band to be wrong about');
      /* THIS CLAIM USED TO NAME A LIVE DEFECT AND THEN THE SAME ROUND FIXED IT. The first
         cut asserted the sound they replace (songOnTape, which wraps songThroughSpeaker)
         STILL clicks, because that was true when the claim was written: last sample
         0.050992 against its own biggest step of 0.1074, 47.5% of it. Fixing that click
         is item 1 of this lane's own NEXT list, and it landed in this same commit, so
         asserting the old number here would be asserting a defect I had just removed --
         a claim that is honest about the past and lying about the present.
         AND IT SHIPS AS A FIX, NOT A NEW VOTE ITEM. Precedent: [band helper] changed the
         actual rendered audio of six approved sounds (the door, the cloud, the song, the
         fold, the phone, the room all measurably leaked less after that fix) and none of
         the six went back to him for a fresh yes/no -- the fix was named on the board and
         shipped, because there is no creative fork in "does this click less". A click is
         not a taste question. EVERYTHING IS A THUMB: Claude decides, ships it, he corrects
         what he hates; manufacturing a vote for an answer with no defensible other side is
         the failure NEVER ASK HIM A TECHNICAL QUESTION warns about, aimed at himself. */
      claim('NEITHER NEW SOUND ENDS ON A STEP; THE SOUND THEY REPLACE USED TO AND NOW DOES NOT',
        T.deckTail.last <= T.deckTail.step * 0.05 && T.changeTail.last <= T.changeTail.step * 0.05
          && T.oldTail.last <= T.oldTail.step * 0.05,
        'the deck ends at ' + T.deckTail.last.toFixed(6) + ' and the change at '
        + T.changeTail.last.toFixed(6) + ', against their own biggest steps of '
        + T.deckTail.step.toFixed(4) + ' and ' + T.changeTail.step.toFixed(4)
        + '. THE SOUND THEY REPLACE was found this same round at 0.050992 against a step of '
        + '0.1074 (47.5%), a real click at the end of an approved sound; it now ends at '
        + T.oldTail.last.toFixed(6) + ' against ' + T.oldTail.step.toFixed(4)
        + ' with a 12 ms tail fade (engine/bohemia_horror_sounds.js, songThroughSpeaker). '
        + 'Shipped as a fix, not a new vote item: same precedent as the band helper\'s six '
        + 'redos, which changed approved sounds\' actual audio and were never re-voted');
    } else { claim('the deck and the tape change were measured', false, d.tapeErr || 'no reading'); }

    /* ---- THE THREE HUMS OFF THE GRID (9/28), row [not sand] round six -------- */
    if (d.hums) {
      const U = d.hums;
      /* THE RULER, PROVED BEFORE IT IS TRUSTED: pure sines at 60 and 120 through the
         identical refine() code. If the instrument cannot read a known pitch inside a
         tenth of a percent, no claim below means anything. */
      claim('THE HUM RULER READS A KNOWN PITCH INSIDE A TENTH OF A PERCENT',
        U.control.every(c => Math.abs(c.errPct) < 0.1),
        U.control.map(c => c.askedHz + ' Hz read as ' + c.readHz + ' (' + c.errPct + '%)').join('; ')
        + '. A 4,096-sample window is 10.77 Hz a bin, 18% of 60 Hz; parabolic '
        + 'interpolation on the log magnitudes around the peak is what gets under 1%');
      claim('THE GENERATOR HUMS AT SIXTY HERTZ, not a nearby bin',
        Math.abs(U.generatorHz - 60) / 60 * 100 < 1,
        U.generatorHz + ' Hz against a 2-pole alternator at 3,600 RPM, which makes 60 Hz '
        + 'mains by shaft speed and not by choice; error ' + (Math.abs(U.generatorHz-60)/60*100).toFixed(3) + '%');
      claim('THE BLOCK LIGHTS AT ONE TWENTY, once the rise settles',
        Math.abs(U.powerOnHz - 120) / 120 * 100 < 1,
        U.powerOnHz + ' Hz measured after the ' + U.riseSec + ' s rise from ' + U.riseFromHz
        + ' Hz; a transformer\'s core pulls twice a mains cycle, so it settles at 120 Hz, '
        + 'error ' + (Math.abs(U.powerOnHz-120)/120*100).toFixed(3) + '%');
      claim('THE SIGN SETTLES AT ONE TWENTY TOO, WHERE THE OLD SAMPLE VOICE COULD NOT',
        Math.abs(U.signAliveHz - 120) / 120 * 100 < 1,
        U.signAliveHz + ' Hz after ' + U.strikes + ' uneven catches, error '
        + (Math.abs(U.signAliveHz-120)/120*100).toFixed(3) + '%. The frozen sign_alive is '
        + 'synth:\'instrument\', a sample voice snapped to the nearest semitone of a 220 Hz '
        + 'reference before pitch-shifting -- proved two different hz through two different '
        + 'jit ranges rendering the identical 123.273 Hz. No semitone on that grid sits '
        + 'within 1% of 120 Hz; this recipe has no sample and nothing to snap to a note');
      claim('NONE OF THE THREE ARE MADE OF NOISE OR A SAMPLE VOICE, read off the shipped function',
        U.noiseInHum === false && U.sampleVoiceInHum === false && U.synthTag === 'additive',
        'harmonicHum() never calls the noise generator and never touches semiOf(), '
        + 'bodyInstrument() or the borrowed sample rack (synthV): every partial is its own '
        + 'oscillator, so any hz lands exactly instead of snapping to a note');
    } else { claim('the three hums were measured', false, d.humsErr || 'no reading'); }

    /* ---- THE BAND HELPER (9/24), row [band helper] -------------------------- */
    if (d.band) {
      /* B IS THE HONEST FILTER AND NOT THE WHOLE READING. The first cut of this read
         `d.band` into B, so every number came back undefined and three claims went red
         about a filter that was working. An undefined is not a measurement. */
      const B = d.band.honest, L = d.band.legacy, X = d.band;
      claim('THE BAND\'S CORNER IS THE CORNER IT NAMES',
        B.minus3Hz !== null && Math.abs(B.minus3Hz - 5000) <= 0.02 * 5000
          && Math.abs(B.dbAtCorner + 3) <= 0.3,
        'asked for 5,000 Hz and the -3 dB lands at ' + B.minus3Hz + ' Hz ('
        + B.dbAtCorner + ' dB at the corner, ' + B.dbAnOctaveUp
        + ' dB an octave up). Measured with an impulse, which gives the filter\'s own '
        + 'response rather than a guess at a noise spectrum');
      claim('AND ALMOST NOTHING GETS PAST IT (school rule 4)',
        B.abovePct < 5 && B.octPct < 1,
        B.abovePct + '% of a white-noise bed sits above the corner and ' + B.octPct
        + '% an octave up, against rule 4\'s 5% and 1%');
      claim('AND THE OLD CHAIN REALLY DID LEAK, so the before is not a straw man',
        L.abovePct > 25 && L.minus3Hz > 5000,
        'the chain that shipped until this round reads ' + L.abovePct + '% above the same '
        + 'corner and ' + L.octPct + '% an octave up, with its -3 dB at ' + L.minus3Hz
        + ' Hz. HE KILLED THREE SOUNDS FOR SOUNDING LIKE SAND AND THIS WAS THE SAND');
      claim('AND THE ORDER HAS A FLOOR, because under it rule 4 cannot be met',
        X.floorAsk2 >= 6 && B.order >= 6,
        'a caller asking for 2 gets ' + X.floorAsk2 + ', because order 4 measures 6.1% '
        + 'above the corner against a 5% bar. A knob that can only be set wrong is not a knob');
      claim('AND NO RECIPE PATCHES THE HELPER FROM OUTSIDE ANY MORE',
        X.tailPatches === 0,
        'two recipes used to add their own extra poles to plug what the helper leaked, which '
        + 'is a fix in one place when the mistake lives in the shared part. ' + X.tailPatches
        + ' left');
      claim('AND THE Q VALUES ARE BUTTERWORTH, not a shape somebody liked',
        JSON.stringify(X.qs8) === JSON.stringify([0.5098, 0.6013, 0.9, 2.5629]),
        'order 8: ' + X.qs8.join(', ') + '. These come out of 1/(2 cos(pi(2k+1)/2N)), which '
        + 'is the maximally flat design, so the passband is flat by construction');
    } else { claim('THE BAND HELPER was measured', false, d.bandErr || 'no reading'); }

    /* ---- A FOOTSTEP THAT IS NOT SAND (9/24) --------------------------------- */
    if (d.step) {
      const C = d.step.concrete, A = d.step.asphalt, S = d.step.sand;
      claim('THERE IS NOT ONE NOISE GENERATOR IN THE NEW FOOTSTEP, read off the shipped function',
        d.step.noiseInModelled === false && d.step.noiseInSand === true
          && C.noiseSources === 0,
        'the function he called sand calls noiseInto(); this one does not call it at all. '
        + 'The check is on the code and not on a spectrum on purpose: a dense impact and a '
        + 'hiss bed can measure close together, and "it is not made of noise" is a fact '
        + 'about how it was built');
      /* *** AND THIS CLAIM POINTED THE WRONG WAY ROUND UNTIL THE BAND WAS FIXED. *** It
         used to ask for the modelled footstep to be LESS noise-like than the sand one,
         because the sand one measured flatness 0.2283. With an honest band the sand one
         collapses to 0.0003, a dull thud, so the modelled one is now the NOISIER of the
         two -- which is the correct way round: an impact has texture and a filtered tone
         does not. The claim asks for the real relationship rather than the one that
         happened to hold while a ruler was wrong. */
      claim('AND IT IS MEASURABLY A DIFFERENT SOUND, not the same one renamed',
        C.flat > S.flat * 5 && C.centroid > S.centroid * 1.2,
        'flatness ' + C.flat.toFixed(4) + ' against the sand one\'s ' + S.flat.toFixed(4)
        + ' (' + (C.flat / Math.max(S.flat,1e-9)).toFixed(0) + 'x MORE texture, and that is '
        + 'the right way round now), brightness ' + Math.round(C.centroid) + ' Hz against '
        + Math.round(S.centroid) + ' Hz. Inside an honest band the noise recipe is a dull '
        + 'thud and the modelled impact is the one with something in it');
      claim('AND IT STILL HAS REAL TOP END, which is what 21 shipped impacts do not',
        C.above4k > 0.01 && A.above4k > 0.01,
        'concrete ' + (C.above4k*100).toFixed(2) + '% above 4 kHz, asphalt '
        + (A.above4k*100).toFixed(2) + '%, against the keep/redo bar of 1% and a shipped '
        + 'shelf whose median is 0.273%. It comes from the CONTACT, not from noise: a '
        + (C.contactMs == null ? '(no contact time: this is not the modelled recipe)'
           : C.contactMs.toFixed(2) + ' ms impact carries to about ' + C.corner + ' Hz'));
      claim('AND A SIDEWALK DOES NOT SOUND LIKE A ROAD, because the moduli differ',
        C.centroid > A.centroid * 1.2
          && d.step.firstModes && d.step.firstModes.concrete > d.step.firstModes.asphalt * 2,
        'brightness ' + Math.round(C.centroid) + ' Hz on concrete against '
        + Math.round(A.centroid) + ' Hz on asphalt, and their slabs ring at '
        + (d.step.firstModes ? d.step.firstModes.concrete : '?') + ' Hz and '
        + (d.step.firstModes ? d.step.firstModes.asphalt : '?')
        + ' Hz. Both numbers come out of the plate formula from published E, rho and v, '
        + 'with no choice left in them: asphalt is an order of magnitude softer');
      claim('AND IT LANDS ON THE BEAT AND FITS INSIDE ONE (120 BPM)',
        C.peakAtMs < 55 && Math.abs(C.seconds - 0.5) < 1e-9 && C.contacts === 2,
        'loudest instant ' + C.peakAtMs.toFixed(1) + ' ms in, ' + (C.contacts == null
          ? 'and this render has no heel-toe pair at all, so it is not the modelled recipe. '
          : 'and ') + 'the fight grades a press '
        + 'PERFECT inside 55 ms. TWO contacts, heel then the foot going flat 90 ms later, '
        + 'which is a real walk and is well inside one 500 ms beat');
      claim('AND IT ROUNDS OFF INSTEAD OF CLIPPING (school rule 8)',
        C.peak <= 1 && A.peak <= 1,
        'concrete peak ' + C.peak.toFixed(4) + ', asphalt ' + A.peak.toFixed(4)
        + ', through a tanh rather than a ceiling');

      /* ---- THREE MORE GROUNDS (9/29): dirt, sand and a wood floor, the rest of the
         redo list's footstep family. Same function, three more materials in the table. */
      const DG = d.step.dirtGround, SG = d.step.sandGround, WG = d.step.woodGround;
      claim('DIRT AND SAND ARE SO SOFT THE PLATE FORMULA PUTS THEIR RING BELOW HEARING, on purpose',
        d.step.firstModes && d.step.firstModes.dirt < 20 && d.step.firstModes.sand < 20
          && d.step.firstModes.dirt > 0 && d.step.firstModes.sand > 0,
        'dirt ' + (d.step.firstModes ? d.step.firstModes.dirt : '?') + ' Hz, sand '
        + (d.step.firstModes ? d.step.firstModes.sand : '?') + ' Hz against concrete\'s '
        + (d.step.firstModes ? d.step.firstModes.concrete : '?') + ' Hz. Nobody hears a '
        + 'note down there, so the loss is raised to match rather than left to ring '
        + 'silently at a pitch that would never be heard anyway');
      claim('AND THE WOOD FLOOR KEEPS ITS RING, WHERE DIRT AND SAND DO NOT',
        WG.flat < DG.flat && WG.flat < SG.flat,
        'wood flatness ' + WG.flat.toFixed(4) + ' against dirt ' + DG.flat.toFixed(4)
        + ' and sand ' + SG.flat.toFixed(4) + '. A wood floor genuinely rings; packed soil '
        + 'and loose sand genuinely do not, and the three numbers land in that order because '
        + 'the physics does, not because a knob was turned to make them');
      claim('SAND HAS THE MOST GRAINS OF ANY GROUND HERE, because it is the loosest',
        SG.grains > DG.grains && DG.grains > WG.grains,
        'sand ' + SG.grains + ' grains, dirt ' + DG.grains + ', a wood floor ' + WG.grains
        + '. More, smaller grains crush under a boot the looser the ground is; a wood floor '
        + 'has almost none because it does not crush at all, it flexes');
      claim('NONE OF THE THREE ARE MADE OF NOISE, read off the same shipped function as the sidewalk',
        d.step.noiseInModelled === false
          && DG.noiseSources === 0 && SG.noiseSources === 0 && WG.noiseSources === 0,
        'dirtGround/sandGround/woodGround all render through footstepModelled, the same '
        + 'function already checked to call no noise generator; the surface only changes '
        + 'which row of the ground table it reads');
      claim('ALL THREE LAND ON THE BEAT AND FIT INSIDE ONE (120 BPM), same as the sidewalk',
        DG.peakAtMs < 55 && SG.peakAtMs < 55 && WG.peakAtMs < 55
          && Math.abs(DG.seconds - 0.5) < 1e-9 && Math.abs(SG.seconds - 0.5) < 1e-9
          && Math.abs(WG.seconds - 0.5) < 1e-9,
        'loudest instant dirt ' + DG.peakAtMs.toFixed(1) + ' ms, sand ' + SG.peakAtMs.toFixed(1)
        + ' ms, wood ' + WG.peakAtMs.toFixed(1) + ' ms, all well inside the fight\'s 55 ms PERFECT window');
      claim('AND ALL THREE ROUND OFF INSTEAD OF CLIPPING (school rule 8)',
        DG.peak <= 1 && SG.peak <= 1 && WG.peak <= 1,
        'dirt peak ' + DG.peak.toFixed(4) + ', sand ' + SG.peak.toFixed(4)
        + ', wood ' + WG.peak.toFixed(4) + ', through the same tanh as every other surface');
    } else { claim('A FOOTSTEP THAT IS NOT SAND was measured', false,
      d.stepErr || 'no reading'); }

    /* ---- A WALK THAT NEVER REPEATS (9/30), row [not sand] round eight ---------- */
    if (d.walk) {
      const W = d.walk;
      claim('VARIANT 0 IS THE EXACT OLD RENDER, so five unjudged candidates do not silently change',
        W.variant0Stable === true,
        'two calls with no variant asked for render byte-identical, exactly as they did '
        + 'before this round: concrete, asphalt, dirt, sand and boards all still play the '
        + 'same thing he would have heard if he had opened the page a minute earlier');
      claim('AND A NAMED VARIANT IS REPRODUCIBLE, not a fresh die roll every render',
        W.variant1Reproducible === true && W.variant0DiffersFromVariant1 === true
          && W.variant1DiffersFromVariant2 === true,
        'variant 1 called twice renders byte-identical both times (a checker measuring it '
        + 'twice is not measuring the dice), and variants 0, 1 and 2 all differ from each '
        + 'other, which is the whole point of asking for one');
      claim('A WALK ON EITHER SURFACE NEVER PLAYS THE SAME FOOTFALL TWICE',
        W.walkConcreteAllDistinct === true && W.walkWoodAllDistinct === true
          && W.runConcreteAllDistinct === true,
        'every footfall window compared against every other footfall window in the same '
        + 'walk, on concrete (' + W.walkConcreteSteps + ' steps), a wood floor ('
        + W.walkWoodSteps + ' steps) and a run (' + W.runConcreteSteps + ' steps): no two '
        + 'match, because the old fix for this was a pool of samples and a pool still runs out');
      claim('THE WALK LANDS ONE FOOTFALL A BEAT, THE RUN LANDS TWICE AS MANY, EVENLY (120 BPM)',
        W.walkConcreteGaps.every(g => Math.abs(g - 0.5) < 1e-6)
          && W.runConcreteGaps.every(g => Math.abs(g - 0.25) < 1e-6)
          && W.runConcretePerBeat === 2,
        'walk gaps ' + W.walkConcreteGaps.join('/') + ' s against a 0.5 s beat; run gaps '
        + W.runConcreteGaps.join('/') + ' s against the half-beat a run asks for -- the same '
        + 'timing law walkCadence already proved, now with real material under it');
      claim('AND IT IS NOT MADE OF NOISE EITHER, read off the shipped function',
        W.noiseInWalk === false,
        'footstepWalk calls footstepModelled per footfall and never touches the noise '
        + 'generator itself');
    } else { claim('A walk that never repeats was measured', false,
      d.walkErr || 'no reading'); }

    /* ---- THE GROUND TAKES IT, AND THINGS GET SET DOWN (10/1), round nine ------ */
    if (d.groundTakesIt && d.bootsGoDirt && d.objectSetDown) {
      const GT = d.groundTakesIt, BG = d.bootsGoDirt, OD = d.objectSetDown;
      claim('A SHOT HITTING DIRT IS ONE CONTACT, NOT A STRIDE',
        GT.contacts === 1 && GT.heelToeMs === 0 && GT.surface === 'dirt',
        'dirt_take is footstepModelled with the heel-toe pair switched off: '
        + GT.contacts + ' contact, ' + GT.heelToeMs + ' ms heel-to-toe, on dirt');
      claim('AND IT RINGS THE SAME DIRT A FOOTSTEP ALREADY RINGS, not a second copy of the number',
        GT.matchesDirtMode === true && GT.noiseInIt === false,
        'its first mode matches H.plateModes(GROUND.dirt) exactly, read off the table rather '
        + 'than a second constant pasted in; no noise generator anywhere in the shared function');
      claim('BOOTS GOING SOMEWHERE IS THE SAME WALK, OUTDOORS',
        BG.steps === 6 && BG.surface === 'dirt' && BG.perBeat === 1
          && BG.gaps.every(g => Math.abs(g - 0.5) < 1e-6),
        BG.steps + ' footfalls on ' + BG.surface + ', gaps ' + BG.gaps.join('/')
        + ' s against a 0.5 s beat -- footstepWalk already proved never to repeat a '
        + 'footfall, this is that same proof on a different ground');
      claim('IT GOES DOWN IS ONE CONTACT ON THE SIDEWALK\'S OWN SLAB, NOT A CHIME',
        OD.downContacts === 1 && OD.downHeelToeMs === 0 && OD.downSurface === 'concrete'
          && OD.matchesConcreteMode === true,
        'set_down is footstepModelled on concrete with the stride switched off: '
        + OD.downContacts + ' contact, rings the same slab mode a boot already does, '
        + 'never a struck-object chime');
      claim('AND SET IT DOWN AGAIN IS A DIFFERENT PLACEMENT, NOT THE FIRST ONE COPIED',
        OD.downVariant !== OD.downAgainVariant && OD.downDiffersFromDownAgain === true,
        'set_down defaults to variant ' + OD.downVariant + ', seton_more to variant '
        + OD.downAgainVariant + ', and the two renders differ -- "placing a thing, twice, '
        + 'forever" is exactly what asking for a second variant already proves');
    } else { claim('The ground takes it and things get set down were measured', false,
      d.groundTakesItErr || 'no reading'); }

    /* ---- THE TURN CLOSES (10/4, row [one song and the volumes]) ---------------- */
    if (d.endTurnClick) {
      const ET = d.endTurnClick;
      claim('THE TURN CLOSES IS BUILT FROM THE PIPE\'S OWN MODES, NOT A NEW MATERIAL',
        ET.usesPipeTable === true && ET.f0RaisedFromPipeDefault === true,
        'endTurnClick calls struckMetal with what:"pipe", f0 ' + ET.f0 + ' Hz raised from the '
        + 'pipe\'s own default so a small stiff part rings higher than a pipe somebody is holding');
      claim('AND IT IS HEARD BEFORE THE PIPE HAS TIME TO RING, which is what turns a ring into a click',
        ET.seconds < 0.15 && ET.shorterThanPipesOwnRing === true,
        'rendered at ' + ET.seconds + ' s against the pipe\'s own ' + 'full ring; the strike\'s bright '
        + 'first instant, nothing invented for the cut-off');
      claim('AND THE WHOLE BUFFER IS INSIDE THE STRIKE\'S OWN END-FADE, so nothing is chopped',
        ET.fadeCoversAll === true,
        ET.samples + ' samples against a 200 ms fade window -- the natural envelope, not a second '
        + 'one pasted over a cut edge');
    } else { claim('The turn closes was measured', false, d.endTurnClickErr || 'no reading'); }

    /* ---- THE MAP IN MOTION (row [the map's sounds], 10/5) ---------------------- */
    if (d.travelBeds) {
      const TB = d.travelBeds;
      claim('THE ROAD IS FASTER THAN DIRT, AND IT IS A FOOTFALL COUNT, NOT A LABEL',
        TB.roadSurface === 'asphalt' && TB.dirtSurface === 'dirt'
          && TB.roadPerBeat === 2 && TB.dirtPerBeat === 1 && TB.roadIsDenser === true,
        'over the same 8 beats, asphalt at perBeat 2 renders ' + TB.roadSteps
        + ' footfalls against dirt at perBeat 1\'s ' + TB.dirtSteps
        + ' -- the travel time ratio read onto the footfall engine, not a second number typed for ambience');
    } else { claim('The travel beds were measured', false, d.travelBedsErr || 'no reading'); }
    if (d.nightInsects) {
      const NI = d.nightInsects;
      claim('THE NIGHT\'S INSECTS ARE A CLICK TRAIN, NOT A HISS, AND THEY SIT IN THEIR OWN BAND',
        NI.noiseSources === 0 && NI.clicks > 300 && NI.lo === 3000 && NI.hi === 6000 && NI.rms > 0.01,
        NI.clicks + ' discrete clicks (crackleInto, zero noise generators) band-limited to '
        + NI.lo + '-' + NI.hi + ' Hz, a field cricket\'s own range, rms ' + NI.rms.toFixed(4));
    } else { claim('Night insects were measured', false, d.nightInsectsErr || 'no reading'); }

    /* ---- THE TITLE'S OWN MUSIC (row [the title's music], 10/5) ---------------- */
    if (d.titleTheme) {
      const TT = d.titleTheme;
      claim('THE TITLE IS DETUNED, A FIXED OFFSET AND NOT THE SAME THING AS WOW',
        Math.abs(TT.root - TT.canonRoot * TT.detune) < 0.01 && TT.detune !== 1,
        'rendered root ' + TT.root.toFixed(3) + ' Hz against the canon F3 ' + TT.canonRoot
        + ' Hz times ' + TT.detune + ' -- a fixed drift, read off the actual render, not a '
        + 'label on an untouched pitch');
      claim('AND IT STILL CARRIES THE SAME WOW THE TAPE DECK ALREADY PROVES',
        TT.wowDepth > 0 && TT.wowRateHz > 0 && TT.wowDepth < 0.01,
        'wow depth ' + TT.wowDepth + ' at ' + TT.wowRateHz + ' Hz, read back off songOnTape\'s '
        + 'own output rather than assumed to have survived the mix');
      claim('AND THE ROOM TONE IS REALLY SUMMED IN, PROVED BY SILENCING IT AND HEARING THE DIFFERENCE',
        TT.roomChangesTheBuffer === true,
        'the same theme rendered with the room at rel 0 differs from the real one; a room '
        + 'that changes nothing when turned off was never in the mix');
    } else { claim('The title\'s own music was measured', false, d.titleThemeErr || 'no reading'); }

    /* ---- THE SETTLEMENT'S SOUNDS (row [the settlement's sounds], 10/5) ------- */
    if (d.barberClippers) {
      const BC = d.barberClippers;
      claim('THE BARBER\'S CLIPPERS ARE A STRUCK ARMATURE AT MAINS DOUBLE-RATE, NOT A MOTOR TONE',
        BC.hz === 120 && BC.noiseSources === 0 && BC.synth === 'additive' && BC.machineIsEar
          && BC.rms > 0.01,
        BC.hz + ' Hz, zero noise generators, heard directly (EAR), rms ' + BC.rms.toFixed(4));
    } else { claim('The barber\'s clippers were measured', false, d.barberClippersErr || 'no reading'); }
    if (d.canOnWood) {
      const CW = d.canOnWood;
      claim('A CAN ON THE COUNTER IS TWO MATERIALS, THE WOOD CONTACT AND THE TIN RING, NOT ONE',
        CW.woodSurface === 'boards' && CW.tinF0 === 740 && CW.machineIsEar && CW.seconds > 0,
        'objectSetDown on ' + CW.woodSurface + ' summed with struckMetal\'s pipe at ' + CW.tinF0
        + ' Hz, read off the actual render');
    } else { claim('A can on the counter was measured', false, d.canOnWoodErr || 'no reading'); }
    if (d.boardNail) {
      const BN = d.boardNail;
      claim('THE BOARD\'S OWN NAIL IS endTurnClick\'S SAME STRIKE, SMALLER AND HIGHER',
        BN.what === 'pipe' && BN.f0 === 1900 && BN.seconds < 0.1 && BN.machineIsEar,
        BN.f0 + ' Hz pipe mode, ' + BN.seconds.toFixed(3) + ' s -- shorter and higher than the '
        + 'bolt catch it is a variation of');
    } else { claim('The board\'s own nail was measured', false, d.boardNailErr || 'no reading'); }
    if (d.paperRustle) {
      const PR = d.paperRustle;
      claim('PAPER AGAINST THE POST IS A DENSE CLICK TRAIN, BROADBAND, NOT A HISS',
        PR.noiseSources === 0 && PR.clicks > 300 && PR.lo === 1200 && PR.hi === 8000
          && PR.machineIsEar && PR.peak > 0.01,
        PR.clicks + ' discrete creases (crackleInto, zero noise generators) band-limited to '
        + PR.lo + '-' + PR.hi + ' Hz, peak ' + PR.peak.toFixed(4));
    } else { claim('Paper against the post was measured', false, d.paperRustleErr || 'no reading'); }

    /* ---- THE SOUNDSCAPE'S FIRST TWO WORKING SOUNDS (row [the soundscape], 10/9) ---- */
    if (d.smithHammer) {
      const SH = d.smithHammer;
      claim('THE SMITH\'S HAMMER RINGS LOW AND SHORT, AN ANVIL BLEEDING INTO ITS OWN STUMP',
        SH.what === 'pipe' && SH.f0 === 140 && SH.seconds <= 0.6 && SH.machineIsEar,
        SH.f0 + ' Hz pipe mode, ' + SH.seconds.toFixed(2) + ' s -- the same free-free bar series '
        + 'as a held pipe, lower and far shorter because the mass behind it is a bolted anvil');
    } else { claim('The smith\'s hammer was measured', false, d.smithHammerErr || 'no reading'); }
    if (d.armourerRivets) {
      const AR = d.armourerRivets;
      claim('A RIVET IS SET IN SEVERAL QUICK BLOWS, NOT ONE, AND THE RENDER IS AS LONG AS FOUR STRIKES SAY IT SHOULD BE',
        AR.what === 'pipe' && AR.f0 === 2600 && AR.strikes === 4 && AR.machineIsEar && AR.peak > 0.01,
        AR.strikes + ' strikes at ' + AR.f0 + ' Hz, ' + AR.seconds.toFixed(3) + ' s total -- a '
        + 'pneumatic riveter\'s own working cadence, read off the actual render\'s length');
    } else { claim('The armourer\'s rivets were measured', false, d.armourerRivetsErr || 'no reading'); }
    if (d.barGlassDown) {
      const BG = d.barGlassDown;
      claim('THE BAR\'S GLASS IS TWO MATERIALS TOO, THE WOOD CONTACT AND THE GLASS\'S OWN RING',
        BG.woodSurface === 'boards' && BG.glassF0 === 650 && BG.machineIsEar && BG.seconds > 0,
        'objectSetDown on ' + BG.woodSurface + ' summed with struckMetal\'s new glass mode at '
        + BG.glassF0 + ' Hz, read off the actual render -- canOnWood\'s own construction, a '
        + 'second real material');
    } else { claim('The bar\'s glass was measured', false, d.barGlassDownErr || 'no reading'); }
    if (d.weaponBlock) {
      const WB = d.weaponBlock;
      claim('A BLOCK IS TWO MATERIALS TOO, THE WOOD CONTACT AND THE BLADE\'S OWN PIPE MODE',
        WB.woodSurface === 'boards' && WB.edgeF0 === 1700 && WB.machineIsEar && WB.seconds > 0,
        'objectSetDown on ' + WB.woodSurface + ' summed with struckMetal\'s pipe mode at '
        + WB.edgeF0 + ' Hz, read off the actual render -- canOnWood\'s own construction, a '
        + 'third time, and the only one of the three that needed no new table entry at all');
      /* THE REDO LIST'S OWN BAR, READ OFF THE SAME GENERIC ROW EVERY OTHER COOKED SOUND
         GETS (the for-of loop over H.list() above, which calls measure() on every recipe):
         1% of its energy above 4 kHz, the criterion records/BOHEMIA_THE_KEEP_REDO_LIST_
         9_24_26.md 3 sets for "two hard things touching," grounded two orders of magnitude
         over the shelf's 0.273% median and clear of the frozen block id's own 0.289%. */
      const BR = d.rows && d.rows['sounds-a-block-is-two-things-touching-10-10'];
      claim('AND THE BLOCK CLEARS THE REDO LIST\'S OWN BAR, WHICH THE FROZEN ID NEVER DID',
        !!BR && BR.above4k > 0.01,
        BR ? (100*BR.above4k).toFixed(2) + '% of its energy sits above 4 kHz, against the '
          + 'redo list\'s own 1% bar and the frozen block id\'s measured 0.289%' : 'no row');
    } else { claim('The block was measured', false, d.weaponBlockErr || 'no reading'); }
    if (d.legendaryFind) {
      const LF = d.legendaryFind;
      claim('SOMETHING HERE STILL WORKS IS BOTH ALREADY-SHIPPED MATERIALS, NEITHER ONE NEW',
        LF.bellF0 === 220 && LF.bellRatiosCount === 8 && LF.machineIsEar && LF.seconds > 0,
        'struckMetal\'s bell at ' + LF.bellF0 + ' Hz, its full 8-partial founder-tuned series '
        + '-- the same table entry [bb ambience]\'s hourly chime already uses, no new row '
        + 'added for this -- summed with powerOnHum, also already shipped');
      /* THE REAL CLAIM: a sidechain duck is a construction nobody in this file has done
         before, so its own PRESENCE has to be measured, not assumed from reading the
         code. Two renders at the duck's own extremes (0 and 0.9) are compared in two
         windows: right at the strike, where ducking should matter, and two seconds later,
         where the bell has mostly decayed and there is almost nothing left to duck. */
      claim('AND THE DUCK IS REAL: the two duck settings sound measurably different right at the strike',
        LF.earlyDiff > 0.02,
        'two renders at duckAmount 0 and 0.9 differ by ' + LF.earlyDiff.toFixed(4) + ' rms '
        + 'in the first 50 ms, where the bell\'s own envelope is near its peak and a real '
        + 'duck has the most hum to pull back');
      claim('AND THE DUCK LETS GO: the same two settings converge once the bell has decayed',
        LF.lateDiff < LF.earlyDiff * 0.5,
        'the same two renders differ by only ' + LF.lateDiff.toFixed(4) + ' rms two seconds '
        + 'in, ' + (LF.earlyDiff / Math.max(LF.lateDiff, 1e-9)).toFixed(1) + 'x less than at '
        + 'the strike -- a real envelope follower releases as the thing driving it quiets '
        + 'down, it does not hold a fixed cut the whole buffer');
    } else { claim('Something here still works was measured', false, d.legendaryFindErr || 'no reading'); }

    /* ---- THE VALLEY STILL BROADCASTS (9/24) ---------------------------------
       DIRECTION's bible rule 9: "THE MACHINES KEEP TALKING... the content never
       acknowledges you." Nothing in the build did it. Every number below is taken off
       the rendered buffer; the recipe's own fields are used only to say WHERE to look. */
    if (d.bcast) {
      const w = d.bcast.worn, c = d.bcast.clean;
      const dB = (x) => { const v = 10*Math.log10(x); return (v>=0?'+':'') + v.toFixed(1); };
      claim('THE SIGNAL IS FOUR BARS AND THE DEAD AIR IS ONE, WHICH IS THE STANDARD ON OUR GRID',
        w.toneBeats === 16 && w.airBeats === 4 && w.bars === 5
          && Math.abs(w.toneSeconds - 8.0) < 1e-9,
        'the published attention signal runs 8 to 25 s; 8.0 s at 120 BPM is exactly 16 '
        + 'beats, four bars, and one more bar of air makes ' + w.seconds.toFixed(1) + ' s');
      claim('AND IT IS THE PAIR A REAL ONE IS, SOUNDED TOGETHER',
        w.pairInTone[0] > 0 && w.pairInTone[1] > 0
          && w.pairInTone[0] > 100 * (w.pairInAir[0] || 1e-9)
          && w.pairInTone[1] > 100 * (w.pairInAir[1] || 1e-9),
        '853 Hz and 960 Hz are ' + dB(w.pairInTone[0]/Math.max(w.pairInAir[0],1e-30))
        + ' dB and ' + dB(w.pairInTone[1]/Math.max(w.pairInAir[1],1e-30))
        + ' dB louder in the signal than in the dead air, so the content really leaves');
      claim('THEN NOBODY SPEAKS, AND THE CARRIER DOES NOT STOP (school rule 7)',
        w.zeros === 0 && w.rmsAir > 0.005
          && Math.abs(w.airFirstHalf - w.airSecondHalf) <= 0.03 * w.airFirstHalf,
        w.zeros + ' exact digital zeros in ' + w.len + ' samples; the air holds '
        + w.airFirstHalf.toFixed(5) + ' then ' + w.airSecondHalf.toFixed(5)
        + ' rms, so it is a carrier and not a fade');
      claim('AND THE DEAD AIR STAYS INSIDE THE MACHINE IT DECLARES (school rule 4)',
        w.airAboveDeclared < 0.05 && w.airAboveOctaveUp < 0.01,
        (w.airAboveDeclared*100).toFixed(2) + '% of the air sits above its own '
        + w.machineHi + ' Hz and ' + (w.airAboveOctaveUp*100).toFixed(2)
        + '% an octave up; two tail poles measured 9.99% here and four fixed it, because '
        + 'the air is the carrier ALONE and noise is where a derived corner leaks');
      claim('TEN YEARS UNATTENDED IS AUDIBLE AS HISS AND NOTHING ELSE PRETENDS TO BE IT',
        w.rmsAir > 1.4 * c.rmsAir && Math.abs(w.seconds - c.seconds) < 1e-9,
        'the worn carrier is ' + (w.rmsAir/c.rmsAir).toFixed(2) + 'x the clean one ('
        + dB((w.rmsAir/c.rmsAir)*(w.rmsAir/c.rmsAir)) + ' dB), same length to the sample');
      claim('AND THE WORN ONE DROPS OUT AND THE WORKING ONE DOES NOT',
        (w.drops || []).length === 2 && (c.drops || []).length === 0,
        'two drop-outs at ' + (w.drops||[]).map(x=>x.atSeconds+' s').join(' and ')
        + ', neither on a beat line, because a fault ON the beat reads as rhythm');
      claim('AND THE HEAD IS NOT HOLDING SPEED, PROVED AGAINST A PERFECT ONE',
        d.bcast.wowSameLength === true && d.bcast.wowMaxDiff > 0.01
          && d.bcast.wowAsked && d.bcast.wowAsked.depth > 0,
        'the same transmitter with a perfect head differs by '
        + d.bcast.wowMaxDiff.toFixed(4) + ' at its widest and is the SAME LENGTH to the '
        + 'sample, so the 120 BPM law is untouched');
      claim('AND IT NEVER CLIPS (school rule 8)', w.peak <= 1 && c.peak <= 1,
        'worn peak ' + w.peak.toFixed(4) + ', clean peak ' + c.peak.toFixed(4));
      claim('AND IT CAN REPEAT FOREVER WITHOUT A CLICK, which option C needs',
        w.wrapStep <= w.stepP999 && c.wrapStep <= c.stepP999,
        'the step from the last sample back to the first is ' + w.wrapStep.toFixed(5)
        + ' against this sound\'s own 99.9th-percentile step of ' + w.stepP999.toFixed(5)
        + ' (biggest anywhere ' + w.stepMax.toFixed(5) + '), so the wrap is an ordinary '
        + 'step and not an outlier. THE CARRIER CLOSES ON ITS OWN NOW (round [not sand], '
        + '9/27): a periodic hum has a real phase to return to, once a short pre-roll has '
        + 'let the band filter settle, so there is no seam left to blend -- that trick '
        + 'existed only because the old carrier was noise, which has no phase at all. The '
        + 'TONE restarting is not a click either because it has its own 8 ms rise, which '
        + 'is what a real signal does');
    } else { claim('THE VALLEY STILL BROADCASTS was measured', false,
      d.bcastErr || 'no reading'); }

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
    /* 14,000 AND NOT 6,000, BECAUSE THE FILTER LIVES FURTHER DOWN THE OBJECT THAN THE
       CONSTANTS DO, and the first cut of the filter claim read "order null" about a chain
       that is right there in the file. A window that is too small does not report a
       missing thing, it reports nothing, and that reads the same as a defect. */
    const alpha = roomAt < 0 ? '' : alphaAll.slice(roomAt, roomAt + 14000);
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
    /* *** AND THE FILTER, WHICH IS THE THING THIS CLAIM WAS MISSING FOR ROUNDS. ***
       The six constants above matched the whole time and the two rooms were still not the
       same room: the game ran ONE low-pass section at Q 0.7 (order 2, 14.2% of a noise
       bed above its own corner) and the module ran cascaded one-poles at a derived corner
       (37.9%). A DUPLICATION CHECK THAT COMPARES THE NUMBERS AND NOT THE MACHINE IS NOT A
       DUPLICATION CHECK. Both are a Butterworth of order 8 now and this reads the order
       out of each side. */
    const qs = (alpha.match(/var QS = \[([^\]]+)\]/) || [null, ''])[1];
    const shippedOrder = qs ? 2 * qs.split(',').length : null;
    const mine = d.room || {};
    const differs = Object.keys(shipped).filter(k =>
      shipped[k] === null || Math.abs(shipped[k] - mine[k]) > 1e-9);
    claim('AND THE SAME FILTER, NOT ONLY THE SAME NUMBERS',
      shippedOrder === (mine.bandOrder || null) && shippedOrder >= 6,
      'the game applies a Butterworth of order ' + shippedOrder + ' and the module applies '
      + 'order ' + (mine.bandOrder || '?') + '. This is the claim that was missing: for '
      + 'rounds the constants matched while the game ran order 2 (14.2% of a noise bed '
      + 'above its own corner) and the module ran cascaded one-poles at a derived corner '
      + '(37.9%), and nothing could see it');
    claim('THE ROOM ON THE JUDGE PAGE IS THE ROOM IN THE GAME, constant for constant',
      differs.length === 0,
      differs.length
        ? 'these do NOT match the alpha: ' + differs.map(k =>
            k + ' game=' + shipped[k] + ' page=' + mine[k]).join(', ')
        : Object.keys(shipped).map(k => k + '=' + shipped[k]).join(', '));
    /* AND THE LEVEL HE RULED ON, SAID AS A NUMBER, because "very very low" has to
       become one before anybody can agree or disagree with it. */
    const relDb = mine.relShipped > 0 ? 20 * Math.log10(mine.relShipped) : null;
    /* AND THE NUMBER IS HIS LETTER NOW, NOT A BAND. He voted HOW LOW THE ROOM up with one
       letter, "B", which on that page is 0.025, and rule 32e says it in words as well:
       "The room stays at B (lower still)." So the claim is his pick exactly rather than a
       range -- a range would let a later round drift the level back up inside it and stay
       green, which is the shape of every check in this lane that stopped checking. */
    claim('AND THE ROOM IS AT THE LEVEL HE PICKED: B (Paolo 9/23 in the tab)',
      mine.relShipped === 0.025,
      relDb === null ? 'no level' :
      'the room carries ' + mine.relShipped + ' of the heartbeat\'s energy, which is '
      + relDb.toFixed(1) + ' dB under it. It has been 0.60 (-4.4 dB, which is what he '
      + 'heard and hated), then 0.05 (-26.0 dB), and he has now picked 0.025 (-32.0 dB). '
      + 'That crosses the line this lane wrote itself -- under about -30 dB a bed on a '
      + 'handset starts losing to the room he is really sitting in -- and HE HEARD BOTH '
      + 'AND PICKED THE QUIETER ONE, so the trade is his and it is made.');

    /* ---- THE VALLEY STILL BROADCASTS, NOW LIVE, THE SAME DUPLICATION ROOM
       ALREADY TEACHES THE LESSON FOR (row [one song and the volumes], round
       three, 10/10). The alpha's own BROADCAST object is read by its source
       text, exactly like ROOM's, so a round that moves one side without the
       other goes red and names which. */
    const bcAt = alphaAll.indexOf('var BROADCAST = {');
    claim('THE ALPHA HAS A LIVE BROADCAST OBJECT TO COMPARE AGAINST',
      bcAt >= 0, bcAt < 0 ? 'no `var BROADCAST = {` in the alpha' : 'found at char ' + bcAt);
    const bcSlice = bcAt < 0 ? '' : alphaAll.slice(bcAt, bcAt + 6000);
    const bgrab = (re) => { const m = bcSlice.match(re); return m ? parseFloat(m[1]) : null; };
    const liveBc = {
      toneBeats: bgrab(/\bTONE_BEATS:\s*([0-9.]+)/), airBeats: bgrab(/\bAIR_BEATS:\s*([0-9.]+)/),
      beat: bgrab(/\bBEAT:\s*([0-9.]+)/), lo: bgrab(/\bLO:\s*([0-9.]+),\s*HI:/),
      hi: bgrab(/\bLO:\s*[0-9.]+,\s*HI:\s*([0-9.]+)/),
      crackleRate: bgrab(/\bCRACKLE_RATE:\s*([0-9.]+)/), crackleAmp: bgrab(/\bCRACKLE_AMP:\s*([0-9.]+)/),
      humLevel: bgrab(/\bHUM_LEVEL:\s*([0-9.]+)/), carrierLevel: bgrab(/\bCARRIER_LEVEL:\s*([0-9.]+)/),
    };
    const bcQs = (bcSlice.match(/var QS = \[([^\]]+)\]/) || [null, ''])[1];
    const liveBcOrder = bcQs ? 2 * bcQs.split(',').length : null;
    const mbc = d.broadcastConst || {};
    const bcDiffers = Object.keys(liveBc).filter(k =>
      liveBc[k] === null || Math.abs(liveBc[k] - mbc[k]) > 1e-9);
    claim('THE LIVE BROADCAST MATCHES THE MODULE, CONSTANT FOR CONSTANT',
      bcDiffers.length === 0,
      bcDiffers.length
        ? 'these do NOT match: ' + bcDiffers.map(k => k + ' alpha=' + liveBc[k] + ' module=' + mbc[k]).join(', ')
        : Object.keys(liveBc).map(k => k + '=' + liveBc[k]).join(', '));
    claim('AND THE SAME FILTER, THE EXACT LESSON ROOM\'S OWN BUG ALREADY TAUGHT THIS LANE',
      liveBcOrder === (mbc.bandOrder || null) && liveBcOrder >= 6,
      'the alpha applies a Butterworth of order ' + liveBcOrder + ' and the module declares '
      + 'order ' + (mbc.bandOrder || '?') + ' -- the numbers matching is not enough on its '
      + 'own, ROOM already proved that once, so this reads the chain length out of the '
      + 'alpha\'s own source the same way');
    /* THE WIRING ITSELF -- does a picked broadcast really play through the real
       ambience path -- is proved on the live alpha in one_engine_gate.js (E10),
       not here: this gate renders offline and has no running page to drive. */

    /* ---- THE BAR'S GLASS, NOW LIVE (row [the soundscape], 10/10). SIMPLER THAN
       ROOM/BROADCAST ON PURPOSE: barGlassDown has no filter node anywhere in it,
       so there is no chain length to compare -- only the material constants, read
       off the alpha's own source text the same way. */
    const bgAt = alphaAll.indexOf('var BARGLASS = {');
    claim('THE ALPHA HAS A LIVE BARGLASS OBJECT TO COMPARE AGAINST',
      bgAt >= 0, bgAt < 0 ? 'no `var BARGLASS = {` in the alpha' : 'found at char ' + bgAt);
    const bgSlice = bgAt < 0 ? '' : alphaAll.slice(bgAt, bgAt + 6000);
    const ggrab = (re) => { const m = bgSlice.match(re); return m ? parseFloat(m[1]) : null; };
    const liveBg = {
      woodE: ggrab(/\bWOOD_E:\s*([0-9.e+]+)/), woodRho: ggrab(/\bWOOD_RHO:\s*([0-9.]+)/),
      woodV: ggrab(/\bWOOD_V:\s*([0-9.]+)/), woodLoss: ggrab(/\bWOOD_LOSS:\s*([0-9.]+)/),
      woodH: ggrab(/\bWOOD_H:\s*([0-9.]+)/), woodA: ggrab(/\bWOOD_A:\s*([0-9.]+)/),
      woodTau: ggrab(/\bWOOD_TAU:\s*([0-9.]+)/), woodGrains: ggrab(/\bWOOD_GRAINS:\s*([0-9.]+)/),
      glassF0: ggrab(/\bGLASS_F0:\s*([0-9.]+)/), glassDamp: ggrab(/\bGLASS_DAMP:\s*([0-9.]+)/),
      glassSecs: ggrab(/\bGLASS_SECS:\s*([0-9.]+)/), glassHit: ggrab(/\bGLASS_HIT:\s*([0-9.]+)/),
      woodMix: ggrab(/\bWOOD_MIX:\s*([0-9.]+)/), glassMix: ggrab(/\bGLASS_MIX:\s*([0-9.]+)/),
    };
    const mbg = d.barglassConst || {};
    const bgDiffers = Object.keys(liveBg).filter(k =>
      liveBg[k] === null || Math.abs(liveBg[k] - mbg[k]) > 1e-9);
    claim('THE LIVE BARGLASS MATCHES THE MODULE, CONSTANT FOR CONSTANT',
      bgDiffers.length === 0,
      bgDiffers.length
        ? 'these do NOT match: ' + bgDiffers.map(k => k + ' alpha=' + liveBg[k] + ' module=' + mbg[k]).join(', ')
        : Object.keys(liveBg).map(k => k + '=' + liveBg[k]).join(', '));
    /* THE WIRING ITSELF -- does buying a round in the bar really post bar_glass,
       and does playSFX really reach the live object -- is proved on the real
       surface in settlement_screen_gate.js (the posting side) and
       one_engine_gate.js (E11, the dispatch side), not here. */

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
      + 'THE GAME USED TO PUT BOTH STEPS IN ONE INSTANT, which is why a run only ever made '
      + 'one sound; it was fixed on the walked surface 9/24 and the footstep gate measures '
      + 'the two footfalls there (42 first house, 23 second house, every second-house gap '
      + '0.250 s, on 1,509 cells walked through the one driver).');
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
