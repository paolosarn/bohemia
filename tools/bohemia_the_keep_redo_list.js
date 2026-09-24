/* THE KEEP/REDO LIST (9/24/26, SOUNDS lane) -- row [analog horror sound], round two.
   Rule 20 (Paolo 9/20): "the sounds have to complement that... everything that's a
   sound has to be thought about as analog horror." Round one was the school page (ten
   rules, each ending in a number). Round two is this: EVERY SOUND THE GAME SHIPS TODAY,
   one line each, against that page, with KEEP or REDO and a reason.

   IT MEASURES, IT DOES NOT GREP. Every number comes off a rendered buffer, taken from
   BOH_SFX inside the shipped alpha, at the variant index HE APPROVED (the first one, so
   the reading is deterministic and a threshold cannot be measuring the dice).

   AND IT OPENS THE ALPHA OVER HTTP, NOT AS A FILE. This lane measured on 9/23 that every
   gate opening the alpha as a local file is blind: three of the four loading lines ask
   their question inside the city iframe, whose origin over file:// is "null", so the
   read throws and the helper's catch turns "I am not allowed to look" into "not done".
   Nothing here touches the door at all -- BOH_SFX and his approved table both exist at
   script load -- but the server costs one line and removes the whole class.

     node tools/bohemia_the_keep_redo_list.js            # write the baseline + table
     node tools/bohemia_the_keep_redo_list.js --print    # measure and print, write nothing
*/
'use strict';
const fs = require('fs');
const http = require('http');
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
const { chromium } = pwmod();

const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, 'records/target/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.json');
const PRINT_ONLY = process.argv.indexOf('--print') >= 0;
const MIME = { '.html':'text/html', '.js':'application/javascript', '.json':'application/json',
  '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg',
  '.svg':'image/svg+xml', '.txt':'text/plain', '.md':'text/markdown' };

const MEASURE = `(async () => {
  const SR = 44100, N = 4096;
  const A = window.__SFX_APPROVED;
  if (!A) return { fatal: 'his approved table is not in this build' };
  if (typeof BOH_SFX === 'undefined') return { fatal: 'BOH_SFX is not in this build' };

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
  /* ONE WINDOW FOR EVERY SPECTRAL NUMBER: the loudest one. Two rulers on one sound will
     always disagree and the sound will get the blame -- this lane changed two correctly
     built sounds chasing exactly that. */
  function loudest(d){
    if (d.length <= N) { const a=new Float32Array(N); a.set(d.subarray(0,Math.min(N,d.length))); return a; }
    let best=0,bestE=-1;
    for(let s=0;s+N<d.length;s+=N>>1){ let e=0; for(let i=s;i<s+N;i++) e+=d[i]*d[i];
      if(e>bestE){bestE=e;best=s;} }
    const a=new Float32Array(N); a.set(d.subarray(best,best+N)); return a;
  }
  async function render(ev, idx){
    const pool = BOH_SFX.cook(ev, 5);
    const v = pool[idx] || pool[0];
    const beats = BOH_SFX.beatsOf(v);
    const secs = beats * BOH_SFX.BEAT + 0.6;
    const OAC = new OfflineAudioContext(1, Math.ceil(SR*secs), SR);
    const bus = OAC.createGain(); bus.gain.value = 1; bus.connect(OAC.destination);
    BOH_SFX.render(v, OAC, bus, 0.02);
    const buf = await OAC.startRendering();
    return buf.getChannelData(0);
  }
  /* *** THE PITCH RULER'S OWN ERROR, MEASURED, BEFORE IT IS USED ON ANYTHING. ***
     Rule 2 asks whether a hum is 60 Hz or a whole multiple of it, which is a question
     about a couple of percent. One bin of this window is 10.77 Hz, eighteen percent of
     60, so the refinement below the bin is doing all the work -- and a tolerance quoted
     from a textbook instead of from this instrument is a number nobody can defend. So:
     pure sines at frequencies we know exactly, through the identical code path. */
  function refine(p){
    let pk = 0, k0 = 1;
    for (let k=1;k<p.length;k++) if (p[k] > pk) { pk = p[k]; k0 = k; }
    let hz = k0 * SR / N;
    if (k0 > 1 && k0 < p.length - 1) {
      const l = Math.log(p[k0-1] + 1e-30), c = Math.log(p[k0] + 1e-30),
            r = Math.log(p[k0+1] + 1e-30);
      const den = l - 2*c + r;
      if (den !== 0) { const dl = 0.5 * (l - r) / den; if (dl > -1 && dl < 1) hz = (k0 + dl) * SR / N; }
    }
    return { hz: hz, binHz: k0 * SR / N };
  }
  const control = [];
  for (const f of [60, 120, 180, 853]) {
    const a = new Float32Array(N);
    for (let i=0;i<N;i++) a[i] = Math.sin(2*Math.PI*f*i/SR) * 0.8;
    const g = refine(spec(a));
    control.push({ askedHz: f, readHz: +g.hz.toFixed(3), binHz: +g.binHz.toFixed(2),
      errPct: +((g.hz - f) / f * 100).toFixed(3),
      binErrPct: +((g.binHz - f) / f * 100).toFixed(3) });
  }

  const rows = [];
  for (const ev of Object.keys(A).sort()) {
    const idx = (A[ev] && A[ev].length) ? A[ev][0] : 0;
    let d;
    try { d = await render(ev, idx); }
    catch (e) { rows.push({ ev: ev, idx: idx, err: String(e && e.message).slice(0,90) }); continue; }
    let peak = 0, sq = 0, zeros = 0;
    for (let i=0;i<d.length;i++){ const a=Math.abs(d[i]); if(a>peak)peak=a; sq+=d[i]*d[i];
      if(d[i]===0) zeros++; }
    const rms = Math.sqrt(sq/d.length);
    const w = loudest(d), p = spec(w);
    /* FLATNESS: geometric mean over arithmetic mean. 1 is white noise, 0 is a pure tone. */
    let logs=0, sum=0, live=0;
    for (let k=1;k<p.length;k++){ const v=p[k]+1e-20; logs+=Math.log(v); sum+=v; live++; }
    const flat = live ? Math.exp(logs/live)/(sum/live) : 0;
    /* THE BANDS, DISJOINT, AND THEY MUST SUM TO 1. A share over one is a receipt that
       the ruler is wrong, which is how this lane caught its first band table. */
    const EDGE = [0, 80, 320, 1000, 4000, 8000, SR/2];
    const band = new Array(EDGE.length-1).fill(0);
    let tot = 0;
    for (let k=1;k<p.length;k++){
      const f = k*SR/N; tot += p[k];
      for (let q=0;q<band.length;q++) if (f>=EDGE[q] && f<EDGE[q+1]) { band[q]+=p[k]; break; }
    }
    const shares = band.map(x => tot>0 ? x/tot : 0);
    /* THE TOP CORNER AS AN ENERGY QUANTILE, which is the one reading that means what its
       name says across an impact, a hiss bed and a tone over a carrier. The -20 dB point
       rides on noise scatter and the -3 dB point rides on whichever peak dominates (a
       footstep measured 108 Hz that way, and a carrier measured 86 Hz). */
    /* THE LOUDEST BIN, which is the RIGHT reading for exactly one class of sound and the
       wrong one for every other: a hum is a pitch, so rule 2 asks whether that pitch is
       the grid's. It is recorded for all of them and only ASKED of the hums, because this
       lane already measured a footstep at 108 Hz and a carrier at 86 Hz this way. */
    let pk1 = 0, pkK = 1;
    for (let k=1;k<p.length;k++) if (p[k] > pk1) { pk1 = p[k]; pkK = k; }
    /* *** AND THE BIN NUMBER IS NOT THE PITCH, WHICH ALMOST PUT A FALSE ACCUSATION IN A
       RECORD. This window is 4,096 samples at 44,100, so one bin is 10.77 Hz, which at
       60 Hz is EIGHTEEN PERCENT. The first cut of this read the generator at "54 Hz" and
       the sign at "118 Hz" and I was about to write down that neither hums at the grid's
       pitch -- when 54 Hz is simply the nearest bin below 60 and 118 is the nearest bin to
       120. A MEASUREMENT CANNOT ANSWER A QUESTION FINER THAN ITS OWN RESOLUTION, and a
       3% rule read through an 18% ruler is not a reading.
       Parabolic interpolation on the log magnitudes of the peak and its two neighbours,
       which is the standard refinement and is good to well under a tenth of a bin on a
       strong periodic component -- about 1 Hz here, so a 3% rule is answerable. */
    let pkHz = pkK * SR / N;
    if (pkK > 1 && pkK < p.length - 1) {
      const l = Math.log(p[pkK-1] + 1e-30), c = Math.log(p[pkK] + 1e-30),
            r2 = Math.log(p[pkK+1] + 1e-30);
      const den = l - 2*c + r2;
      if (den !== 0) {
        const dlt = 0.5 * (l - r2) / den;
        if (dlt > -1 && dlt < 1) pkHz = (pkK + dlt) * SR / N;
      }
    }
    let acc = 0, e95 = null, e99 = null;
    for (let k=1;k<p.length;k++){ acc += p[k];
      if (e95===null && acc >= 0.95*tot) e95 = k*SR/N;
      if (e99===null && acc >= 0.99*tot) { e99 = k*SR/N; break; } }
    rows.push({ ev: ev, idx: idx, variants: (A[ev]||[]).length,
      peak: +peak.toFixed(5), rms: +rms.toFixed(6), zeros: zeros, samples: d.length,
      flat: +flat.toFixed(4), e95Hz: Math.round(e95||0), e99Hz: Math.round(e99||0),
      peakHz: +pkHz.toFixed(2), peakBinHz: Math.round(pkK * SR / N), binHz: +(SR / N).toFixed(2),
      sharesSum: +shares.reduce((a,b)=>a+b,0).toFixed(6),
      sub80: +shares[0].toFixed(5), lo320: +shares[1].toFixed(5),
      mid1k: +shares[2].toFixed(5), up4k: +shares[3].toFixed(5),
      hi8k: +shares[4].toFixed(5), top: +shares[5].toFixed(5),
      above4k: +(shares[4]+shares[5]).toFixed(5) });
  }
  return { rows: rows, events: Object.keys(A).length, control: control };
})()`;

/* ONE MEASURING BODY, EXPORTED, SO THE GATE DOES NOT CARRY A SECOND COPY OF IT.
   A duplication in THIS lane is the exact bug that silenced every footstep in the game
   for days, and a checker measuring with its own copy of a ruler is the same thing
   wearing a different hat. */
async function measureShelf() {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0,120)));
  await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 300000 });
  /* WAIT FOR THE TABLE AND THE ENGINE, NOT FOR A NUMBER OF SECONDS. A fixed wait is not
     an event, which is written three times over in this lane's records. */
  /* BARE IDENTIFIERS, NOT window.BOH_SFX, AND THE FIRST CUT OF THIS TIMED OUT FOR THREE
     MINUTES BECAUSE OF IT: the engine is declared with a lexical binding, which lives in
     the script's scope and never becomes a property of window, so `window.BOH_SFX` is
     undefined in a build where the engine is perfectly loaded. That is the same shape as
     every other false negative in this lane's records -- an instrument asking a question
     the build was never going to answer, and reporting the answer as the build's fault. */
  await p.waitForFunction(
    () => typeof BOH_SFX !== 'undefined' && !!window.__SFX_APPROVED,
    null, { timeout: 180000 });
  const out = await p.evaluate(MEASURE);
  await b.close();
  server.close();
  out.errs = errs;
  return out;
}

async function main() {
  const out = await measureShelf();
  if (out.fatal) { console.log('COULD NOT MEASURE: ' + out.fatal); process.exit(1); }
  const errs = out.errs || [];
  const good = out.rows.filter(r => !r.err);
  const bad = out.rows.filter(r => r.err);
  console.log('measured ' + good.length + ' of ' + out.events + ' approved events'
    + (bad.length ? ', ' + bad.length + ' threw: ' + bad.map(r=>r.ev).join(' ') : ''));
  const worst = good.filter(r => Math.abs(r.sharesSum - 1) > 1e-4);
  if (worst.length) { console.log('THE RULER IS WRONG: ' + worst.length
    + ' rows have disjoint band shares that do not sum to 1'); process.exit(1); }
  const srt = good.map(r => r.above4k).sort((a,b)=>a-b);
  const med = srt[Math.floor(srt.length/2)];
  console.log('median share above 4 kHz: ' + (med*100).toFixed(3) + '%');
  console.log('sounds with more than 1% above 4 kHz: '
    + good.filter(r=>r.above4k>0.01).length + ' of ' + good.length);
  console.log('sounds that read as noise (flatness > 0.05): '
    + good.filter(r=>r.flat>0.05).length + ' of ' + good.length);
  console.log('page errors while measuring: ' + errs.length);
  console.log('THE PITCH RULER, measured on sines we know exactly, before it is used:');
  for (const c of (out.control||[])) console.log('    ' + c.askedHz + ' Hz  ->  bin '
    + c.binHz + ' Hz (' + c.binErrPct + '%)  refined ' + c.readHz + ' Hz ('
    + c.errPct + '%)');
  if (!PRINT_ONLY) {
    fs.writeFileSync(OUT, JSON.stringify({
      _readme: 'THE FROZEN SHELF (SOUNDS, 9/24). Every sound the game shipped on this '
        + 'date, measured through the alpha\'s own engine at the variant he approved. '
        + 'A BASELINE, not a target: analog_horror_sound_gate.js refuses to let any of '
        + 'these get duller, and holds every NEW sound to the law outright, so the debt '
        + 'can only shrink. Regenerate with tools/bohemia_the_keep_redo_list.js.',
      measured: '9/24/26', events: out.events,
      pitchRuler: out.control, medianAbove4k: med, rows: good
    }, null, 2) + '\n');
    console.log('wrote ' + path.relative(ROOT, OUT));
  }
  console.log('');
  console.log('EVENT            idx  flat   e95Hz  e99Hz  >4k%    sub80%  peak');
  for (const r of good) console.log(
    r.ev.padEnd(16) + String(r.idx).padStart(3) + '  '
    + r.flat.toFixed(4).padStart(6) + ' ' + String(r.e95Hz).padStart(6)
    + ' ' + String(r.e99Hz).padStart(6) + '  ' + (r.above4k*100).toFixed(3).padStart(7)
    + ' ' + (r.sub80*100).toFixed(2).padStart(7) + '  ' + r.peak.toFixed(3));
}

module.exports = { measureShelf, MEASURE };

if (require.main === module) {
  main().catch(e => { console.log('CRASHED: ' + e.message); process.exit(1); });
}
