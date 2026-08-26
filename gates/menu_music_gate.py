#!/usr/bin/env python3
"""
MENU MUSIC GATE (8/26/26) - a menu is not a place where anything is happening.

HIS RULING, 8/26, on his own music verdict export:

    "menu music doesnt get impacted by intensity type shit."

and, in the same breath, the casualty that made him say it:

    "i liked the power still on somewhere when it was calm but it was really
     bad on intensity 2 you know."

MENU - THE POWER STILL ON SOMEWHERE is CANON. It is also a MENU song. It was
good at calm and bad at 2, and that is not a fault in the song -- it is a fault
in ever playing a menu song at a fight's arrangement. NOTES ARE RULINGS, so this
is the spec, and it has a number in it that a machine can check.

MEASURED BEFORE THE FIX, rendering one full bar of that song offline at each
intensity and counting zero crossings (an integer count of how much is playing,
which unlike level does not drift between renders):

    intensity 0 -> zc  479
    intensity 2 -> zc 1539      more than three times the parts
    intensity 4 -> zc 2063

AFTER: 479 / 479 / 479, and DUST CRAWL still goes 2140 -> 2814, because the fix
must not be "turn intensification off".

WHERE IT IS FIXED, AND WHY THERE. `const sk = f.menu ? 0 : this.layers` inside
MUS.playStep. `sk` is the one place the intensity NUMBER becomes an ARRANGEMENT,
and every surface funnels through it -- the game, the MUSIC tab's KILL LAYERS
button, and anything built later. Fixing it at the KILLMUS end would have left
the judge page still able to audition a menu song at 2, which is exactly the
surface he heard it on. THE BORDER IS ONE PIXEL (8/16): a pass can be
individually right and still be wrong because of where it sits.

NO NEW DATA WAS INVENTED. Every menu song already carried `menu:true`.

    python3 gates/menu_music_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(1200);

  const out=await p.evaluate(async()=>{
    /* RENDER A REAL BAR OF A REAL SONG, THROUGH THE REAL playStep, OFFLINE.
       Reading the source for `f.menu` would prove the line exists and nothing
       about what comes out of the speaker. VERIFY ON THE REAL SURFACE. */
    async function bar(songName, layers){
      const li = MLOOPS.findIndex(x=>x.n===songName);
      if(li<0) return {err:'no song '+songName};
      const idx = MFACTIONS.length + li;      /* fac() indexes the CONCATENATED library */
      const SR=44100, steps=16, secs=(60/120)/4*steps+1.0;
      const OAC=new OfflineAudioContext(2,Math.ceil(SR*secs),SR);
      const save={AC:MUS.AC,MAST:MUS.MAST,OUT:MUS.OUT,cur:MUS.cur,curSlot:MUS.curSlot,layers:MUS.layers};
      const mast=OAC.createGain(); mast.gain.value=1; mast.connect(OAC.destination);
      MUS.AC=OAC; MUS.MAST=mast; MUS.OUT=mast; MUS.cur=idx; MUS.curSlot=1; MUS.layers=layers;
      /* and PROVE the selector actually selected it -- the first version of this
         probe set MUS.idx, which is not a thing, and happily measured the same
         song twice while reporting two different names. */
      if(!MUS.fac() || MUS.fac().n!==songName){
        MUS.AC=save.AC; MUS.MAST=save.MAST; MUS.OUT=save.OUT;
        MUS.cur=save.cur; MUS.curSlot=save.curSlot; MUS.layers=save.layers;
        return {err:'fac() gave '+((MUS.fac()||{}).n)+' not '+songName};
      }
      try{ for(let s=0;s<steps;s++){ MUS.playStep(s, 0.05+s*((60/120)/4), MUS.songCtx(s)); } }catch(e){}
      const buf=await OAC.startRendering();
      MUS.AC=save.AC; MUS.MAST=save.MAST; MUS.OUT=save.OUT;
      MUS.cur=save.cur; MUS.curSlot=save.curSlot; MUS.layers=save.layers;
      const L=buf.getChannelData(0); let sq=0,pk=0,zc=0;
      for(let i=0;i<L.length;i++){ const a=Math.abs(L[i]); sq+=a*a; if(a>pk)pk=a;
        if(i&&((L[i]>=0)!==(L[i-1]>=0)))zc++; }
      return {rms:Math.sqrt(sq/L.length), peak:pk, zc:zc};
    }
    /* COMPARE EACH SONG AGAINST ITS OWN NOISE, BECAUSE playStep IS NOT
       DETERMINISTIC. Measured the decisive way, by rendering ONE song at ONE
       intensity three times:

           MENU - NOBODY IS COMING, layer 0, three renders:
             zc 122 / 120 / 122,  rms varying at 2.7e-5

       So a fixed tolerance -- absolute, relative, or both -- cannot tell "the
       intensity changed it" from "it renders differently every time", and the
       first two versions of this check failed the quietest song in the game for
       being quiet. Some instrument in it is seeded per render, which is
       legitimate and not this gate's business.
       THE HONEST INSTRUMENT IS THE SONG'S OWN SPREAD: render the baseline three
       times, take the band that produces, and ask whether the other intensities
       land inside it. A song that genuinely intensifies leaves that band by
       orders of magnitude -- his went 479 to 1539 -- so the test stays sharp
       while the noise stops counting. */
    function band(runs){
      const zs=runs.map(x=>x.zc), rs=runs.map(x=>x.rms);
      const zMin=Math.min.apply(null,zs), zMax=Math.max.apply(null,zs);
      const rMin=Math.min.apply(null,rs), rMax=Math.max.apply(null,rs);
      const rMean=rs.reduce((a,c)=>a+c,0)/rs.length;
      return { zMin, zMax, rMin, rMax, rMean,
               /* twice the observed spread, with a floor, so a song that happens
                  to render identically three times is not held to zero */
               zTol: Math.max(2*(zMax-zMin), 4),
               rTol: Math.max(2*(rMax-rMin), 1e-4*rMean) };
    }
    function inBand(bd, x){
      if(!x || x.err) return false;
      return x.zc >= bd.zMin-bd.zTol && x.zc <= bd.zMax+bd.zTol
          && x.rms >= bd.rMin-bd.rTol && x.rms <= bd.rMax+bd.rTol;
    }

    const r={ menuSongs:[], rows:[] };
    for(const m of MLOOPS) if(m.menu) r.menuSongs.push(m.n);
    /* EVERY menu song, not just the one he complained about. He named the one he
       happened to be auditioning; the ruling is about the category. */
    for(const n of r.menuSongs){
      const base=[await bar(n,0), await bar(n,0), await bar(n,0)];
      if(base.some(x=>x.err)){ r.rows.push({n:n, flat:false, err:base.find(x=>x.err).err}); continue; }
      const bd=band(base);
      const c=await bar(n,2), d=await bar(n,4);
      r.rows.push({n:n, band:[bd.zMin,bd.zMax], zTol:bd.zTol,
                   zc:[base[0].zc, c.zc, d.zc],
                   flat: inBand(bd,c) && inBand(bd,d)});
    }
    /* AND THE FIX MUST NOT BE "TURN IT ALL OFF". A handful of ordinary songs
       still have to intensify, or the ruling has been honoured by breaking the
       feature it was carving an exception out of. */
    r.normals=[];
    const picks = MLOOPS.filter(x=>!x.menu).slice(0,4);
    for(const s of picks){
      const base=[await bar(s.n,0), await bar(s.n,0), await bar(s.n,0)];
      if(base.some(x=>x.err)){ r.normals.push({n:s.n, changed:false, err:'render'}); continue; }
      const bd=band(base);
      const d=await bar(s.n,4);
      /* JUDGED BY THE SAME INSTRUMENT as the menu songs, deliberately: if the
         band were wide enough to hide a real intensification, these would go
         green here and the whole method would be worthless. */
      r.normals.push({n:s.n, band:[bd.zMin,bd.zMax], zc:[base[0].zc,d.zc],
                      changed: !inBand(bd,d)});
    }
    r.hasMenuFlagField = MLOOPS.some(x=>'menu' in x);

    /* ===== PART TWO OF THE SAME RULING: THE THREE-LEVEL LADDER ===========
       "overworld calmness lvl 1 then an enemy trying to hurt you or someone is
        talking to you is lvl 2 then you either kill 2 enemies or theresa whole
        bunch of people close together talking type shit for lvl 3"
       One law, one gate: the menu exemption only means anything against a
       ladder, and the ladder is only safe because the menu is exempt from it. */
    const I=window.INTENSITY;
    if(I){
      const L=()=>I.level();
      I.reset();                       const calm=L();
      I.setThreat(true);               const threat=L();
      I.reset(); I.talking(true);      const talkedTo=L();
      I.reset(); I.killed();           const oneKill=L();
      I.killed();                      const twoKills=L();
      I.reset(); I.crowd(true);        const crowd=L();
      I.reset();                       const lCalm=I.LAYERS[I.level()];
      I.setThreat(true);               const lThreat=I.LAYERS[I.level()];
      I.reset(); I.killed(); I.killed(); const lTwo=I.LAYERS[I.level()];
      I.reset();
      r.ladder={calm, threat, talkedTo, oneKill, twoKills, crowd,
                layers:[lCalm,lThreat,lTwo], oneOwner:(window.KILLMUS===I)};
    } else { r.ladder={err:'window.INTENSITY does not exist'}; }
    return r;
  });

  /* AND THE REAL PATH, not the API. A setter nobody calls is the defect this
     repo has a law about, so the two triggers that DO have signals today are
     driven by posting the messages the game actually posts. */
  out.wired = await p.evaluate(async()=>{
    if(!window.INTENSITY) return {err:'no INTENSITY'};
    INTENSITY.reset();
    const before=INTENSITY.level();
    window.postMessage({type:'BOHEMIA_COMBAT_STARTED'},'*');
    await new Promise(r=>setTimeout(r,400));
    const started=INTENSITY.level();
    INTENSITY.reset();
    window.postMessage({type:'BOHEMIA_PLAYER_HIT',hp:50,dmg:10},'*');
    await new Promise(r=>setTimeout(r,400));
    const hit=INTENSITY.level();
    INTENSITY.reset();
    return {before, started, hit};
  });

  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=420)
    finally:
        os.unlink(js)

    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    print('=== MENU MUSIC GATE - "menu music doesnt get impacted by intensity" ===')
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    songs = d.get('menuSongs') or []
    ok('the game marks its menu songs, so this rule needs no new data (%d found)'
       % len(songs), len(songs) >= 6)
    ok('and THE SONG HE NAMED is one of them: MENU - THE POWER STILL ON SOMEWHERE',
       any('POWER STILL ON' in s for s in songs))

    rows = d.get('rows') or []
    ok('every menu song was actually rendered, none skipped (%d of %d)'
       % (len(rows), len(songs)), len(rows) == len(songs) and rows)
    bad = [x for x in rows if not x.get('flat')]
    ok('EVERY MENU SONG SOUNDS THE SAME AT 0, 2 AND 4 -- a menu is not a place '
       'where anything is happening to you (%s)'
       % ('; '.join('%s %s' % (x['n'], x['zc']) for x in bad) if bad else 'all flat'),
       not bad)
    named = [x for x in rows if 'POWER STILL ON' in x['n']]
    ok('and HIS one specifically: it went 479 / 1539 / 2063 before this, more '
       'than three times the parts at intensity 2 (%s)'
       % (named[0]['zc'] if named else 'not measured'),
       named and named[0].get('flat'))

    norms = d.get('normals') or []
    still = [x for x in norms if x.get('changed')]
    ok('AND THE FIX IS NOT "TURN IT ALL OFF": ordinary songs still intensify '
       '(%s)' % ', '.join('%s %s' % (x['n'], x['zc']) for x in norms),
       len(norms) >= 3 and len(still) == len(norms))

    # ---- PART TWO: HIS THREE-LEVEL LADDER --------------------------------
    L = d.get('ladder') or {}
    ok('THE LADDER IS HIS SENTENCE: overworld is level 1 (%s)' % L.get('calm'),
       L.get('calm') == 1)
    ok('an enemy trying to hurt you is level 2 (%s)' % L.get('threat'),
       L.get('threat') == 2)
    ok('somebody talking to you is level 2 (%s)' % L.get('talkedTo'),
       L.get('talkedTo') == 2)
    ok('ONE kill is NOT enough -- he said two, and one kill leaves it calm (%s)'
       % L.get('oneKill'), L.get('oneKill') == 1)
    ok('TWO kills is level 3, down from the four that shipped (%s)'
       % L.get('twoKills'), L.get('twoKills') == 3)
    ok('a crowd of people talking near you is level 3 (%s)' % L.get('crowd'),
       L.get('crowd') == 3)
    ok('and the three levels ask for three different arrangements, 0/2/4 (%s)'
       % (L.get('layers'),), L.get('layers') == [0, 2, 4])
    ok('KILLMUS and INTENSITY are ONE object, so there is no second copy of the '
       'state to drift', L.get('oneOwner') is True)

    # A SETTER NOBODY CALLS IS NOT A FEATURE. Driven by the real messages.
    W = d.get('wired') or {}
    ok('AND IT IS ACTUALLY TRIGGERED, not just callable: a real '
       'BOHEMIA_COMBAT_STARTED raises the music before a shot is fired '
       '(%s -> %s)' % (W.get('before'), W.get('started')),
       W.get('before') == 1 and W.get('started') == 2)
    ok('and taking a hit does too, which is the most literal reading of "an '
       'enemy trying to hurt you" there is (%s)' % W.get('hit'),
       W.get('hit') == 2)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  The menu stays calm no matter what the game thinks is happening, '
              'and a fight still builds.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
