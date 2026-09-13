#!/usr/bin/env python3
"""
NAMED LEAD GATE (9/13/26, SOUNDS lane) -- [lead never sounds] and [three retagged].

HIS RULING: Paolo 8/2, on THE MARKER ON THE DOOR -- "one of my new favorite songs
that you've made great job." The row he was talking about says
inst:{b:'abyssbass', l:'brokenrosary'} and the batch 22 verdict records it as
"lead brokenrosary". NOTES ARE RULINGS (7/19): the row is his content.

EYES E18 (fb5e8d33) found that brokenrosary is scheduled ZERO times. Censused
across the live library it was 109 of 142 songs, and THE TUNE WAS A BARE TRIANGLE
OSCILLATOR ON 135 OF 142. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this
holds the repair.

WHAT IT CHECKS, and WHY EACH CLAIM IS SHAPED THE WAY IT IS

  1. THE RESOLVER IS THE ACCENT'S OWN MAPPING, re-derived from the file. 'pluck',
     'arp' and 'whistle' are abstract lead KINDS rather than rack voices; the
     section-A accent has mapped them to bell/acid/karp since it shipped. If
     somebody changes one of the two and not the other, the tune and the accent
     become different instruments and this goes red. A CHECK THAT READS ITS OWN
     COPY OF THE ANSWER PROVES NOTHING, so neither side of that comparison is
     typed in here.

  2. THE TUNE IS THE NAMED VOICE ON EVERY SONG, attributed by CALL SITE -- the
     line number out of a stack trace -- and NOT by voice name or gain, because the
     bass, the accent and the lead can all name the same voice.
     *** AND THE SECTION-A ACCENT IS EXCLUDED BY ITS OWN CALL SITE, which the
     first cut of this gate got wrong. "Is the lead scheduled anywhere" passed on
     two of six songs even with the old bug put back, because when a row has no
     `am` field the accent has always played the lead. THE ACCENT WAS ANSWERING A
     QUESTION ABOUT THE TUNE. *** The block's boundaries and the accent's own
     lines come out of the file and must be unique, or this says it cannot measure
     rather than passing quietly.

  3. THE BARE OSCILLATOR CARRIES THE TUNE ON NO SONG. It carried it on 135 of 142
     before 9/13, which is why the whole shelf had one instrument on top of it.

  4. AN UNKNOWN VOICE NAME MAKES SOUND, NOT SILENCE. synthV is 581 `kind===`
     branches; before 9/13 there was nothing after them, so one typo in a song row
     would have deleted that song's melody with no tell. Checked by rendering a
     name that cannot exist.

  5. THE DETECTOR BITES, and the mutation REPRODUCES THE DEFECT rather than
     resembling it. Its own first cut broke the RESOLVER and read 57 notes,
     because a bogus name is still a name that got scheduled -- it was measuring
     nothing. Now the tune's voice call is intercepted and a bare triangle built
     in its place, which is the `else` branch that stood there until 9/13.

  6. NOTHING RAN AWAY AND NOTHING WENT SILENT. The voice swap is 135 songs' worth
     of melody, and this shelf already has one song peaking 25x the median, so the
     levels are measured rather than assumed. Two songs peak over 1.0 and both are
     NAMED here; a third joining them is news and this says so.

  7. [three retagged] THE TWO CANON LATE-BEAT SONGS REACH THE STREET and keep the
     front door, and GRAVEYARD IS FINAL: no buried song is in any overworld pool.

IT RENDERS AND IT SCHEDULES, IT DOES NOT READ. Every number comes out of the real
engine driven into an OfflineAudioContext.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

# the two songs whose peak exceeds 1.0 pre-limiter, named so a third is news
LOUD = ['THE GAPS IN THE HYMNAL', 'MENU — LIGHTS ACROSS THE VALLEY']
# the two CANON late-beat songs, and the two that stay buried
RETAG = ['MENU — DEAD VALLEY DAWN', 'MENU — THE POWER STILL ON SOMEWHERE']
STAY_BURIED = ['MENU — PURPLE DAWN', 'MENU — LIGHTS ACROSS THE VALLEY']
MUTANTS = ['THE MARKER ON THE DOOR', 'REDS', 'BLUES', 'SLOW CREEP', 'THE VAULT',
           'HYMN FOR RUNNING WATER']
SAMPLE = ['THE MARKER ON THE DOOR', 'REDS', 'BLUES', 'SLOW CREEP', 'THE VAULT',
          'REPO MAN', 'HYMN FOR RUNNING WATER', 'TWO COINS FOR THE FERRYMAN']

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();
(async () => {
  const { chromium } = pw;
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium',
    args:['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = {};
  try {
    await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1600);
    await p.evaluate(() => { const f=document.getElementById('front'); if(f)f.click(); });
    await p.waitForTimeout(2500);
    out.res = await p.evaluate(async (cfg) => {
      MUS.build();
      const lib = MFACTIONS.concat(MLOOPS);
      const sd = MUS.stepDur(), BARS = 24;
      const R = {};
      const ACC = {}; for(const l of cfg.accentLines) ACC[l]=1;

      /* the call site, out of a stack trace: the only honest way to say WHICH
         branch of playStep wrote a note */
      function site(){ const st=(new Error()).stack||'', ls=st.split('\n');
        for(let i=1;i<ls.length;i++){ const m=ls[i].match(/:(\d+):(\d+)\)?$/);
          if(m && ls[i].indexOf('ALPHA')>=0){ if(ls[i].indexOf('site')>=0) continue; return +m[1]; } }
        return null; }

      const realSynth = window.synthV, realDrum = window.drumV;
      let notes = [], depth = 0;
      /* MUTATION MODE PUTS THE OLD BUG BACK, FOR REAL. Its first cut broke the
         RESOLVER instead, and the census happily read 57, 24, 60 notes -- because
         it compared what was scheduled against what the resolver ASKED FOR, and a
         bogus name is still a name that got scheduled. A MUTATION THAT DOES NOT
         REPRODUCE THE DEFECT ONLY PROVES THE CHECK CAN SEE SOMETHING ELSE. This
         reproduces the defect: the tune's voice call is intercepted and a bare
         triangle into a 2200 Hz lowpass built in its place, which is exactly the
         `else` branch that stood there until 9/13. Keyed on the CALL SITE, so the
         section-A accent is left alone the way the old code left it alone. */
      let MUT = false;
      function wrap(){
        window.synthV = function(name,ctx,dest,hz,sd2,semi,t,amp){
          const ln = (depth===0) ? site() : null;
          if(MUT && depth===0 && ln!==null && ln>=cfg.blockFrom && ln<cfg.blockTo && !ACC[ln]){
            notes.push({k:'o',t:+(t||0),line:ln});
            const o=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter();
            lp.type='lowpass'; lp.frequency.value=2200;
            o.type='triangle'; o.frequency.value=hz(semi);
            g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(amp,t+0.01);
            g.gain.exponentialRampToValueAtTime(0.0001,t+sd2*1.6);
            o.connect(lp);lp.connect(g);g.connect(dest);o.start(t);o.stop(t+sd2*2);
            return; }
          if(depth===0) notes.push({k:'v',name:name,t:+(t||0),line:ln});
          depth++; try{ return realSynth.apply(this,arguments); } finally{ depth--; } };
        window.drumV = function(name,ctx,dest,t){
          if(depth===0) notes.push({k:'d',name:name,t:+(t||0),line:site()});
          depth++; try{ return realDrum.apply(this,arguments); } finally{ depth--; } }; }
      function unwrap(){ window.synthV=realSynth; window.drumV=realDrum; }

      const sv = {AC:MUS.AC,MAST:MUS.MAST,OUT:MUS.OUT,fac:MUS.fac,step:MUS.step,layers:MUS.layers};
      try{ if(MENUMUS.watch){ clearInterval(MENUMUS.watch); MENUMUS.watch=null; } }catch(e){}
      try{ CITYMUS.on=false; FIGHTMUS.on=false; MENUMUS.on=false;
           if(window.INTERIORMUS) INTERIORMUS.on=false; }catch(e){}

      /* the census: schedule only, no rendering -- "which voice does the engine
         call" is a schedule question, and 142 renders is minutes for no claim */
      function census(only, mutate){
        const rows = [];
        for(let i=0;i<lib.length;i++){
          const row = lib[i];
          if(only && only.indexOf(row.n)<0) continue;
          const OAC = new OfflineAudioContext(1, 8000*2, 8000);
          const m = OAC.createGain(); m.gain.value=1; m.connect(OAC.destination);
          const realOsc = OAC.createOscillator.bind(OAC);
          OAC.createOscillator = function(){ const o=realOsc();
            const d0=depth, ln=(d0===0)?site():null, rs=o.start.bind(o);
            o.start=function(when){ if(d0===0) notes.push({k:'o',t:+(when||0),line:ln});
              return rs.apply(this,arguments); }; return o; };
          notes = [];
          MUT = !!mutate;
          MUS.AC=OAC; MUS.MAST=m; MUS.OUT=m; MUS.layers=0;
          MUS.fac=function(){ return row; };
          let err=null;
          try{ for(let s=0;s<BARS*16;s++){ MUS.step=s; MUS.playStep(s%16, s*sd, MUS.songCtx(s)); } }
          catch(e){ err=String(e&&e.message||e); }
          MUT = false;
          const lead=(row.inst&&row.inst.l)||'pluck';
          const res=MUS.leadVoice?MUS.leadVoice(lead):null;
          let tuneNamed=0, tuneOsc=0, tuneOther={}, accentNamed=0, firstTune=null;
          for(const x of notes){
            if(x.line===null) continue;
            if(ACC[x.line]){ if(x.k==='v'&&x.name===res) accentNamed++; continue; }
            if(x.line<cfg.blockFrom || x.line>=cfg.blockTo) continue;
            if(firstTune===null || x.t<firstTune) firstTune=+x.t.toFixed(3);
            if(x.k==='o'){ tuneOsc++; continue; }
            if(x.name===res) tuneNamed++;
            else tuneOther[x.name]=(tuneOther[x.name]||0)+1; }
          const drums=notes.filter(x=>x.k==='d');
          rows.push({ n:row.n, lead:lead, resolved:res, mel:row.mel||'seed8',
                      tuneNamed:tuneNamed, tuneOsc:tuneOsc, tuneOther:tuneOther,
                      accentNamed:accentNamed, firstTune:firstTune,
                      firstKit: drums.length? +Math.min.apply(null,drums.map(x=>x.t)).toFixed(2):null,
                      err:err });
        }
        return rows;
      }
      wrap();
      R.census = census(null, false);
      /* AND THE SAME QUESTION ON THE SURFACE IT IS ACTUALLY ABOUT. The census
         above runs with CITYMUS off, which is the MUSIC TAB, where the drum hold
         is never applied on purpose -- so the first cut of the claim below read
         the kit at 0.0s and called it "on the street". A CLAIM ABOUT ONE SURFACE
         MEASURED ON ANOTHER IS NOT A WEAK CLAIM, IT IS THE WRONG ONE. */
      try{ CITYMUS.on=true; }catch(e){}
      R.street = census(cfg.mutants, false).map(x => ({ n:x.n, firstTune:x.firstTune,
        firstKit:x.firstKit }));
      try{ CITYMUS.on=false; }catch(e){}
      R.mutation = census(cfg.mutants, true).map(x => ({ n:x.n, tuneNamed:x.tuneNamed,
        tuneOsc:x.tuneOsc, accentNamed:x.accentNamed }));
      unwrap();

      /* the floor: a name the rack cannot have must still make sound */
      async function renderOne(fn, secs){
        const SR=22050, OAC=new OfflineAudioContext(1, Math.ceil(SR*secs), SR);
        const m=OAC.createGain(); m.gain.value=1; m.connect(OAC.destination);
        try{ fn(OAC, m); }catch(e){ return {err:String(e&&e.message||e)}; }
        let buf=null; try{ buf=await OAC.startRendering(); }catch(e){ return {err:String(e)}; }
        const d=buf.getChannelData(0); let sq=0,pk=0;
        for(let j=0;j<d.length;j++){ const a=Math.abs(d[j]); sq+=a*a; if(a>pk)pk=a; }
        return { peak:+pk.toFixed(5), rms:+Math.sqrt(sq/d.length).toFixed(5) };
      }
      R.floor = await renderOne((OAC,m)=>{
        synthV('zzz_no_such_voice_anywhere', OAC, m, x=>MUS.noteHz(x), 0.125, 0, 0.05, 0.07); }, 1.2);
      R.known = await renderOne((OAC,m)=>{
        synthV('bell', OAC, m, x=>MUS.noteHz(x), 0.125, 0, 0.05, 0.07); }, 1.2);

      /* levels, on the four bars where the tune actually plays */
      const want = new Set(cfg.levels);
      R.levels = [];
      for(let i=0;i<lib.length;i++){
        const row = lib[i];
        if(!want.has(row.n)) continue;
        const FROM=64, N=64;
        const r = await renderOne((OAC,m)=>{
          MUS.AC=OAC; MUS.MAST=m; MUS.OUT=m; MUS.layers=0; MUS.fac=function(){return row;};
          for(let k=0;k<N;k++){ MUS.step=FROM+k; MUS.playStep((FROM+k)%16, 0.05+k*sd, MUS.songCtx(FROM+k)); }
        }, sd*64+2.0);
        r.n = row.n; R.levels.push(r);
      }
      MUS.AC=sv.AC; MUS.MAST=sv.MAST; MUS.OUT=sv.OUT; MUS.fac=sv.fac;
      MUS.step=sv.step; MUS.layers=sv.layers;

      /* the pools, by the engine's own predicate rather than by the tag table */
      R.pools = {};
      for(const cat of ['OVERWORLD NIGHT','OVERWORLD DAY','OVERWORLD DUSK/DAWN','MENU']){
        const arr=[]; MLOOPS.forEach(m=>{ if(MUS.V[m.n+'#1']!==0 && MUS.catsOf(m.n+'#1').indexOf(cat)>=0) arr.push(m.n); });
        R.pools[cat]=arr; }
      R.buriedInOverworld = [];
      MLOOPS.forEach(m=>{ const cs=MUS.catsOf(m.n+'#1')||[];
        if(MUS.V[m.n+'#1']===0 && cs.some(c=>c.indexOf('OVERWORLD')===0)) R.buriedInOverworld.push(m.n); });
      R.verdicts = {}; for(const n of cfg.verdicts) R.verdicts[n]=MUS.V[n+'#1'];
      R.menuFlag = {}; for(const n of cfg.retag){ const f=lib.find(x=>x.n===n); R.menuFlag[n]=!!(f&&f.menu); }
      return R;
    }, JSON_CFG);
  } catch (e) { out.fatal = String(e && e.message || e); }
  out.pageErrors = errs.slice(0, 5);
  console.log('@@' + JSON.stringify(out));
  await b.close();
})();
'''


def main():
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    src = open(ALPHA, encoding='utf8').read()
    lines = src.split('\n')

    # ---- 1. THE RESOLVER IS THE ACCENT'S OWN MAPPING ----------------------
    # BOTH SIDES COME OUT OF THE FILE. Typing either one in here would make this a
    # check that reads its own copy of the answer.
    acc = re.search(r"_am\s*=\s*f\.am\|\|\((.*?)\);", src)
    res = re.search(r"leadVoice\(l\)\{[^}]*?return (.*?);\s*\}", src, re.S)
    ok('the section-A accent still resolves the abstract lead kinds in one '
       'expression (found in the file)', bool(acc))
    ok('and MUS.leadVoice exists in the shipped alpha', bool(res))
    if acc and res:
        def pairs(t):
            return set(re.findall(r"==='([a-z0-9]+)'\?'([a-z0-9]+)'",
                                  t.replace('_li', 'l')))
        a_p, r_p = pairs(acc.group(1)), pairs(res.group(1))
        ok('THE RESOLVER AND THE ACCENT MAP THE ABSTRACT LEAD KINDS THE SAME WAY, '
           'so the tune and the accent cannot become different instruments '
           '(accent %s, resolver %s)' % (sorted(a_p), sorted(r_p)),
           bool(a_p) and a_p == r_p)

    # ---- the melody block's own boundaries, and the ACCENT's own lines -----
    starts = [i + 1 for i, l in enumerate(lines)
              if l.strip().startswith("{ const _li=(f.inst&&f.inst.l)||'pluck';")]
    ends = [i + 1 for i, l in enumerate(lines)
            if 'MENU MUSIC IS NEVER INTENSIFIED' in l]
    ok('the melody block\'s boundaries are findable and unique in the file, so a '
       'note can be attributed to a branch instead of guessed at from its gain '
       '(start %s, end %s)' % (starts, ends), len(starts) == 1 and len(ends) == 1)
    if not (len(starts) == 1 and len(ends) == 1):
        print('\n=== NAMED LEAD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    lo, hi = starts[0], ends[0]
    accent = [i + 1 for i, l in enumerate(lines)
              if lo <= i + 1 < hi
              and ('synthV(_am,' in l or "sc.sec==='A'&&_li==='pad'" in l)]
    ok('AND THE SECTION-A ACCENT\'S OWN CALL SITES ARE FOUND AND EXCLUDED (%s). '
       'The first cut of this gate did not, and "is the lead scheduled anywhere" '
       'passed on two of six songs WITH THE OLD BUG PUT BACK, because a row with '
       'no `am` field has always had the accent play the lead. THE ACCENT WAS '
       'ANSWERING A QUESTION ABOUT THE TUNE' % accent, len(accent) == 2)

    cfg = {'mutants': MUTANTS, 'levels': LOUD + RETAG + SAMPLE,
           'verdicts': RETAG + STAY_BURIED, 'retag': RETAG,
           'blockFrom': lo, 'blockTo': hi, 'accentLines': accent}
    js = JS.replace('JSON_CFG', json.dumps(cfg))
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        jsf = fh.name
    try:
        r = subprocess.run(['node', jsf, ROOT], capture_output=True, text=True, timeout=600)
    except subprocess.TimeoutExpired:
        print('  > FAIL the probe did not finish')
        print('\n=== NAMED LEAD GATE: %d passed, %d failed ===' % (p, f + 1))
        return 1
    finally:
        os.unlink(jsf)

    line = [l for l in r.stdout.splitlines() if l.startswith('@@')]
    ok('the probe drove the real engine and reported', bool(line))
    if not line:
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        print('\n=== NAMED LEAD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    d = json.loads(line[0][2:])
    ok('and it did not die on the way (%s)' % (d.get('fatal') or 'no fatal'),
       not d.get('fatal'))
    ok('the page threw nothing (%s)' % (d.get('pageErrors') or 'none'),
       not d.get('pageErrors'))
    R = d.get('res') or {}
    cen = R.get('census') or []
    ok('the whole live library was censused (%d songs)' % len(cen), len(cen) > 130)
    if not cen:
        print('\n=== NAMED LEAD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    ok('and no song threw while being scheduled (%s)'
       % ([x['n'] for x in cen if x.get('err')][:3] or 'none'),
       not [x for x in cen if x.get('err')])
    unres = [x['n'] for x in cen if not x.get('resolved')]
    ok('every song\'s named lead resolves to something (%s)'
       % (unres[:3] or 'all resolve'), not unres)

    # ---- 2. THE TUNE IS THE NAMED VOICE ----------------------------------
    bad = [x['n'] for x in cen if (x.get('tuneNamed') or 0) == 0]
    ok('*** THE TUNE IS THE VOICE THE SONG ROW NAMES, on %d of %d songs. Before '
       '9/13 the melody branch reached the named lead only for mel="hymn" or a '
       'lead literally called "bell", so 109 of 142 songs named a lead that was '
       'scheduled ZERO times. EYES E18 found the first one -- BROKENROSARY, named '
       'in the row AND in his own 8/2 verdict. NOTES ARE RULINGS (%s) ***'
       % (len(cen) - len(bad), len(cen), bad[:3] or 'none silent'), not bad)

    # ---- 3. NO BARE OSCILLATOR ON THE TUNE -------------------------------
    osc = [x['n'] for x in cen if (x.get('tuneOsc') or 0) > 0]
    ok('AND THE BARE TRIANGLE OSCILLATOR CARRIES THE TUNE ON NO SONG AT ALL. It '
       'carried it on 135 of 142 before 9/13, which is why the whole shelf had one '
       'instrument on top of it (%d: %s)' % (len(osc), osc[:3] or 'none'), not osc)

    # ---- 4. THE FLOOR ---------------------------------------------------
    fl, kn = R.get('floor') or {}, R.get('known') or {}
    ok('a known voice renders sound, so the floor test is being run on a working '
       'rack (bell peak %s)' % kn.get('peak'), (kn.get('peak') or 0) > 0.001)
    ok('*** AN UNKNOWN VOICE NAME MAKES SOUND, NOT SILENCE (peak %s). 581 '
       '`kind===` branches and nothing after them meant one typo in a song row '
       'would delete that song\'s melody with no tell anywhere ***'
       % fl.get('peak'), (fl.get('peak') or 0) > 0.001)

    # ---- 5. THE DETECTOR BITES -----------------------------------------
    mut = R.get('mutation') or []
    ok('THE DETECTOR BITES: with the pre-9/13 `else` put back on %d songs -- the '
       'tune built as a bare triangle instead of as the named voice -- the tune '
       'reads ZERO named notes (%s) and counts the oscillator instead (%s), while '
       'the accent keeps playing (%s) exactly as it did before. A check that '
       'cannot fail is not a check'
       % (len(mut), [x.get('tuneNamed') for x in mut],
          [x.get('tuneOsc') for x in mut], [x.get('accentNamed') for x in mut]),
       len(mut) >= 4
       and all((x.get('tuneNamed') or 0) == 0 for x in mut)
       and all((x.get('tuneOsc') or 0) > 0 for x in mut))

    # ---- 6. NOTHING RAN AWAY, NOTHING WENT SILENT ----------------------
    lv = {x['n']: x for x in (R.get('levels') or []) if not x.get('err')}
    ok('the level sample rendered (%d songs)' % len(lv), len(lv) >= 8)
    dead = [n for n, x in lv.items() if (x.get('peak') or 0) < 0.001]
    ok('NO SONG IN THE SAMPLE RENDERS SILENT after the voice swap (%s)'
       % (dead or 'none'), not dead)
    over = sorted(n for n, x in lv.items() if (x.get('peak') or 0) > 1.0)
    ok('AND THE SONGS PEAKING OVER 1.0 PRE-LIMITER ARE THE TWO THAT ARE NAMED, so '
       'a third joining them is news rather than a silent re-balance of his '
       'content (%s)' % over, over == sorted(LOUD))

    # ---- 7. [three retagged] -------------------------------------------
    pools = R.get('pools') or {}
    dusk = pools.get('OVERWORLD DUSK/DAWN') or []
    menu = pools.get('MENU') or []
    for n in RETAG:
        ok('%s reaches the street at first light' % n, n in dusk)
        ok('and %s KEEPS the front door -- nothing was taken away' % n, n in menu)
        ok('and %s is still flagged a menu song, so his 8/26 "menu music doesnt '
           'get impacted by intensity type shit" still reads true for it' % n,
           (R.get('menuFlag') or {}).get(n) is True)
    ok('the dusk/dawn pool grew from 2 to 4, the thinnest pool on the shelf (%d: '
       '%s)' % (len(dusk), dusk), len(dusk) >= 4)
    v = R.get('verdicts') or {}
    for n in RETAG:
        ok('%s is still CANON, so this moved a song he likes and not a candidate '
           '(verdict %s)' % (n, v.get(n)), v.get(n) == 2)
    for n in STAY_BURIED:
        ok('GRAVEYARD IS FINAL: %s is still BURIED and nothing here asks for it '
           'back (verdict %s)' % (n, v.get(n)), v.get(n) == 0)
    ok('AND NO BURIED SONG IS IN ANY OVERWORLD POOL (%s)'
       % (R.get('buriedInOverworld') or 'none'), not R.get('buriedInOverworld'))

    # ---- [melody first] THE SHAPE, MEASURED ON THE STREET ---------------
    st = [x for x in (R.get('street') or [])
          if x.get('firstTune') is not None and x.get('firstKit') is not None]
    ok('the street census ran (%d songs)' % len(st), len(st) >= 4)
    early = [x for x in st if x['firstTune'] < x['firstKit']]
    ok('*** AND THE MELODY IS ALREADY PLAYING WHEN THE BEAT ARRIVES, which is the '
       'shape his anchor is famous for. ON THE STREET, with the drum hold on: the '
       'tune at %s and the kit at %s. EYES E18 read the arrangement as INVERTED '
       '(drums 0.0s, melody 8.0s) because it rendered with no game surface owning '
       'the music, which is the MUSIC TAB, where the kit is never held on purpose. '
       'THE PREMISE WAS MEASURED ON THE WRONG SURFACE ***'
       % ([x['firstTune'] for x in st], [x['firstKit'] for x in st]),
       st and len(early) == len(st))

    print('  MEASURED  %d songs censused off the engine\'s own schedule; the tune '
          'is the named voice on %d, a bare oscillator on %d; dusk/dawn pool %d'
          % (len(cen), len(cen) - len(bad), len(osc), len(dusk)))
    print('\n=== NAMED LEAD GATE: %d passed, %d failed ===' % (p, f))
    return 0 if f == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
