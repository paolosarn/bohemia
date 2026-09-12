#!/usr/bin/env python3
"""
SOUND CARD GATE (9/12/26, SOUNDS lane) - [sound card] WHAT-BOHEMIA-SOUNDS-LIKE.

HIS RULING (9/6, LOCKED): "Post-apocalyptic Final Fantasy X, especially that
fantasy beach vibe, it was so good."  HIS ANCHOR (9/7): FFX OST, BESAID ISLAND,
the original not the remaster.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and a CARD without one is a mood
board. So this holds the card's measurable half.

WHAT IT ACTUALLY CHECKS, and the shape matters: a card is only honest if its terms
DISCRIMINATE. A term that reads the same for every song is not a standard, it is
decoration -- and one of the five did exactly that, which is how the round's main
finding turned up. So this gate re-measures the shelf through the REAL engine and
asserts:

  1. every term still separates the closest songs from the furthest ones, by the
     margins the card publishes. If a term collapses, the card is stale and this
     goes red rather than letting a dead term sit in a law file.
  2. THE KNOWN GAP IS STILL THE KNOWN GAP: 136 of 140 songs put the drum on beat
     one and the first transient lands at 0.04s for almost the whole shelf. The
     one trait his law names as WHAT PEOPLE LOVED is absent. The day somebody
     builds the late-beat entry, this claim flips and the card must be rewritten
     -- so it is written as a MEASUREMENT, not as an aspiration.
  3. the ranking in the bank file still matches what the engine renders today, so
     a song edited by any lane cannot leave a stale ranking standing.
  4. THE LOUD DEFECT IS STILL THE ONLY ONE. One CANON song peaks 13.4x the median
     and it is named; if a SECOND song joins it, that is new and this says so.

IT RENDERS, IT DOES NOT READ. Every number comes from MUS.playStep driven into an
OfflineAudioContext, the same way the menu-music checker does it. Reading the song
table would prove the fields exist and nothing about what comes out of a speaker.

GRAVEYARD IS FINAL: buried songs are measured and labelled, and nothing here asks
for one back.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARD = os.path.join(ROOT, 'banks', 'BOHEMIA_SOUND_CARD_9_12_26.json')

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { pageErrors: null };
  try {
    await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1500);
    await p.click('#front', { force:true }).catch(()=>{});
    await p.waitForTimeout(2500);

    out.shelf = await p.evaluate(async (NAMES) => {
      MUS.build();
      const SR = 22050, STEPS = 32, sd = (60/120)/4;
      const lib = MFACTIONS.concat(MLOOPS);
      function lowShare(d, sr, hz){ const a=Math.exp(-2*Math.PI*hz/sr); let y=0,lo=0,all=0;
        for(let i=0;i<d.length;i++){ y=(1-a)*d[i]+a*y; lo+=y*y; all+=d[i]*d[i]; }
        return all>0?lo/all:0; }
      function highShare(d, sr, hz){ const a=Math.exp(-2*Math.PI*hz/sr); let y=0,hi=0,all=0;
        for(let i=0;i<d.length;i++){ y=(1-a)*d[i]+a*y; const h=d[i]-y; hi+=h*h; all+=d[i]*d[i]; }
        return all>0?hi/all:0; }
      function env(d, sr){ const W=Math.floor(sr*0.02), e=[];
        for(let i=0;i+W<d.length;i+=W){ let s=0; for(let j=0;j<W;j++) s+=d[i+j]*d[i+j];
          e.push(Math.sqrt(s/W)); } return e; }
      async function one(idx){
        const OAC = new OfflineAudioContext(1, Math.ceil(SR*(sd*STEPS+1.2)), SR);
        const sv = {AC:MUS.AC,MAST:MUS.MAST,OUT:MUS.OUT,cur:MUS.cur,curSlot:MUS.curSlot,layers:MUS.layers};
        const m = OAC.createGain(); m.gain.value = 1; m.connect(OAC.destination);
        MUS.AC=OAC; MUS.MAST=m; MUS.OUT=m; MUS.cur=idx; MUS.curSlot=1; MUS.layers=0;
        const name = (MUS.fac()||{}).n;
        try { for(let s=0;s<STEPS;s++) MUS.playStep(s%16, 0.05+s*sd, MUS.songCtx(s)); } catch(e){}
        let buf=null; try { buf = await OAC.startRendering(); } catch(e){}
        MUS.AC=sv.AC; MUS.MAST=sv.MAST; MUS.OUT=sv.OUT;
        MUS.cur=sv.cur; MUS.curSlot=sv.curSlot; MUS.layers=sv.layers;
        if(!buf) return {name, err:'no render'};
        const d = buf.getChannelData(0), e = env(d, SR);
        const mx = Math.max.apply(null, e) || 1;
        let n=0, first=null;
        for(let i=1;i<e.length;i++) if(e[i]>mx*0.20 && e[i]>e[i-1]*1.8){ n++; if(first===null) first=i*0.02; }
        let up=0; for(const v of e) if(v>mx*0.15) up++;
        let sq=0, pk=0; for(let i=0;i<d.length;i++){ const a=Math.abs(d[i]); sq+=a*a; if(a>pk)pk=a; }
        return { name, onsets:n, firstAt:first, peak:pk, rms:Math.sqrt(sq/d.length),
                 low:lowShare(d,SR,200), high:highShare(d,SR,3000),
                 sustain:e.length?up/e.length:0 };
      }
      /* MEASURE ONLY THE SONGS THE CARD NAMES, plus the whole shelf's kick data.
         Rendering all 142 twice a suite run is minutes for no extra claim: the
         card's margins are a statement about its own named ends, and the
         beat-on-one census is a config read of every song, which is cheap. */
      const want = new Set(NAMES);
      const res = [];
      for (let i=0;i<lib.length;i++) if (want.has(lib[i].n)) res.push(await one(i));
      /* THE WHOLE-SHELF CENSUS: does the drum land on beat one? Asked of the data
         every song actually carries, not of a sample. */
      let onOne=0, noDrum=0, late=0, total=0;
      for (const f of lib){ const k=f.kick||[]; total++;
        if(!k.length) noDrum++; else if(+k[0]===0) onOne++; else late++; }
      /* THE LATE BEAT, COUNTED AT THE KIT'S OWN CALL SITE. */
      async function kitTiming(idx, from){
        const OAC = new OfflineAudioContext(1, Math.ceil(SR*(sd*160+1.2)), SR);
        const sv = {AC:MUS.AC,MAST:MUS.MAST,OUT:MUS.OUT,cur:MUS.cur,
                    curSlot:MUS.curSlot,layers:MUS.layers,step:MUS.step};
        const m = OAC.createGain(); m.gain.value=1; m.connect(OAC.destination);
        MUS.AC=OAC; MUS.MAST=m; MUS.OUT=m; MUS.cur=idx; MUS.curSlot=1; MUS.layers=0;
        const name=(MUS.fac()||{}).n, hits=[], rd=window.drumV;
        window.drumV=function(k,ac,ma,t){ hits.push(t); return rd.apply(this,arguments); };
        try { for(let k=0;k<160;k++){ MUS.step=from+k;
                MUS.playStep((from+k)%16, 0.05+k*sd, MUS.songCtx(from+k)); } }
        catch(e){} finally { window.drumV=rd; }
        try { await OAC.startRendering(); } catch(e){}
        MUS.AC=sv.AC; MUS.MAST=sv.MAST; MUS.OUT=sv.OUT; MUS.cur=sv.cur;
        MUS.curSlot=sv.curSlot; MUS.layers=sv.layers; MUS.step=sv.step;
        return { name, hits:hits.length,
                 firstKitAt: hits.length ? +(hits[0]-0.05).toFixed(2) : null };
      }
      const LB = ['REDS','BLUES','SLOW CREEP','REPO MAN'];
      const li = {}; lib.forEach((f,i)=>{ if(LB.indexOf(f.n)>=0) li[f.n]=i; });
      const lateBeat = { street:[], fight:[], opening:[], studio:[] };
      /* MENUMUS'S OWN WATCHDOG SETS on=false THE INSTANT MUS.playing IS FALSE,
         which is always so in an offline render -- it undid the setup between two
         songs once and gave two different answers to one question. Stop it, and
         pin the flag before every render. */
      try{ if(MENUMUS.watch){ clearInterval(MENUMUS.watch); MENUMUS.watch=null; } }catch(e){}
      const set = (city, fight, menu) => { try{ CITYMUS.on=city; }catch(e){}
        try{ FIGHTMUS.on=fight; }catch(e){} try{ MENUMUS.on=menu; }catch(e){}
        try{ if(window.INTERIORMUS) INTERIORMUS.on=false; }catch(e){} };
      for (const n of LB) if(li[n]!==undefined){ set(true,false,false);
        lateBeat.street.push(await kitTiming(li[n], 0)); }
      for (const n of LB.slice(0,2)) if(li[n]!==undefined){ set(true,true,false);
        lateBeat.fight.push(await kitTiming(li[n], 0)); }
      for (const n of LB.slice(0,2)) if(li[n]!==undefined){ set(true,false,true);
        lateBeat.opening.push(await kitTiming(li[n], 0)); }
      for (const n of LB.slice(0,2)) if(li[n]!==undefined){ set(false,false,false);
        lateBeat.studio.push(await kitTiming(li[n], 0)); }
      set(false,false,false);
      return { measured: res, census: {total, onOne, noDrum, late}, lateBeat };
    }, NAMES_PLACEHOLDER);
  } catch (e) { out.fatal = String(e && e.message || e); }
  out.pageErrors = errs.slice(0,5);
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

    ok('the sound card bank file exists', os.path.exists(CARD))
    if not os.path.exists(CARD):
        print('\n=== SOUND CARD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    card = json.load(open(CARD, encoding='utf8'))

    # ---- THE CARD ITSELF -------------------------------------------------
    ok('it is marked draft -- it SORTS, it does not judge, and a ranking is '
       'never a verdict', card.get('draft') is True)
    ok('it carries HIS ruling verbatim (%s)' % (card.get('ruling') or '')[:48],
       'Final Fantasy X' in (card.get('ruling') or ''))
    ok('and HIS anchor, named by him on 9/7 (%s)' % (card.get('anchor') or '')[:44],
       'BESAID' in (card.get('anchor') or '').upper())
    ok('every term quotes the words it came from, so no term is my taste (%d '
       'terms)' % len(card.get('terms') or {}),
       len(card.get('terms') or {}) == 5
       and all(t.get('quote') and t.get('measure')
               for t in (card.get('terms') or {}).values()))
    ok('the weighting is NAMED rather than hidden',
       'EQUAL' in (card.get('weighting') or '').upper())
    ok('and the fight is explicitly NOT governed by the card -- a beach is not '
       'danger, and a reference belongs to one department (his 9/5 law)',
       'DOES NOT GOVERN' in ((card.get('per_surface') or {}).get('fight') or '').upper())

    rank = card.get('ranking') or []
    ok('the ranking covers the shelf (%d songs)' % len(rank), len(rank) > 130)
    ok('and it is sorted (every score <= the one above it)',
       all(rank[i]['score'] >= rank[i+1]['score'] - 1e-9 for i in range(len(rank)-1)))

    # the card's own named ends, re-measured on the real engine
    top = [r['song'] for r in rank[:10]]
    bot = [r['song'] for r in rank[-10:]]
    names = sorted(set(top + bot + [(card.get('defect') or {}).get('song')]) - {None})

    js = JS.replace('NAMES_PLACEHOLDER', json.dumps(names))
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(js)
        jsf = fh.name
    try:
        r = subprocess.run(['node', jsf, ROOT], capture_output=True, text=True,
                           timeout=400)
    except subprocess.TimeoutExpired:
        print('  > FAIL the probe did not finish')
        print('\n=== SOUND CARD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    finally:
        os.unlink(jsf)

    line = [l for l in r.stdout.splitlines() if l.startswith('@@')]
    ok('the probe rendered the real engine and reported', bool(line))
    if not line:
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        print('\n=== SOUND CARD GATE: %d passed, %d failed ===' % (p, f))
        return 1
    d = json.loads(line[0][2:])
    ok('and it did not die on the way (%s)' % (d.get('fatal') or 'no fatal'),
       not d.get('fatal'))
    ok('the page threw nothing (%s)' % (d.get('pageErrors') or 'none'),
       not d.get('pageErrors'))
    shelf = d.get('shelf') or {}
    got = {x['name']: x for x in (shelf.get('measured') or []) if not x.get('err')}
    ok('every song the card names still renders (%d of %d)'
       % (len(got), len(names)), len(got) == len(names))

    # ---- 1. THE TERMS STILL DISCRIMINATE ----------------------------------
    def med(vals):
        v = sorted(vals)
        return v[len(v)//2] if v else None

    checks = [('onsets', 'patience', 'fewer'), ('low', 'bass_under', 'more'),
              ('high', 'warmth', 'less'), ('sustain', 'held_line', 'more')]
    for field, term, direction in checks:
        tv = [got[n][field] for n in top if n in got]
        bv = [got[n][field] for n in bot if n in got]
        if not tv or not bv:
            ok('term %s could be measured' % term, False)
            continue
        tm, bm = med(tv), med(bv)
        good = (tm < bm) if direction in ('fewer', 'less') else (tm > bm)
        ok('THE CARD\'S TERM "%s" STILL SEPARATES ITS OWN ENDS: the closest ten '
           'median %.4f, the furthest ten %.4f, and closer means %s. A term that '
           'stops separating is decoration in a law file'
           % (term, tm, bm, direction), good)

    # ---- 2. THE KNOWN GAP IS STILL THE GAP --------------------------------
    c = shelf.get('census') or {}
    ok('the whole shelf was censused for where the drum lands (%s)' % c,
       (c.get('total') or 0) > 130)
    ok('THE SONG DATA STILL PUTS THE DRUM ON BEAT ONE AND THAT IS LEFT ALONE, '
       'because a kick array is HIS content: %s of %s on beat one, %s with no '
       'drum, %s with a late one. The late beat is delivered by the ENGINE '
       'instead (claims below) -- THIS CLAIM IS ABOUT THE DATA, NOT ABOUT WHAT A '
       'PLAYER HEARS, and its wording said otherwise until 9/12'
       % (c.get('onOne'), c.get('total'), c.get('noDrum'), c.get('late')),
       (c.get('late') or 0) == 0)
    # A PROSE GREP IS A WEAK CHECK, and this one broke the moment the card was
    # honestly rewritten -- it looked for the phrase "beat one" in a paragraph
    # that now says "kick arrays still start on step 0". Replaced with the
    # invariant that actually matters: the card must not DRIFT BACK to the term
    # that could find the gap but could not confirm the repair.
    lbt = (card.get('terms') or {}).get('late_beat') or {}
    ok('the card\'s late-beat term measures THE KIT, not "any transient" -- the '
       'first version could find the gap and could not confirm the fix, and it '
       'must not drift back (%s)' % (lbt.get('measure') or '')[:60],
       'kit' in (lbt.get('measure') or '').lower()
       and 'transient' not in (lbt.get('measure') or '').lower())
    ok('and it keeps the correction that says why, so the next reader does not '
       'undo it', bool(lbt.get('corrected_9_12')))
    ok('the card records the gap as CLOSED BY A MECHANISM, with the song data '
       'left alone', 'CLOSED' in (card.get('known_gap') or '')
       and 'RE-COOK' in (card.get('known_gap') or '').upper())

    # ---- 2b. THE LATE BEAT, WHERE IT COUNTS: THE KIT ----------------------
    # Measured at drumV's own call site, because the card's first version of this
    # term ("the first transient") cannot tell a kick from the bass note beside
    # it: with the drums provably held 128 steps, REDS still read 0.06s.
    # A TERM THAT FOUND A GAP IS NOT AUTOMATICALLY A TERM THAT CAN CONFIRM ITS
    # REPAIR.
    lb = shelf.get('lateBeat') or {}
    st = lb.get('street') or []
    ok('the late-beat probe ran on the street (%d songs)' % len(st), len(st) >= 3)
    late_ok = [x for x in st if x.get('firstKitAt') is not None
               and x['firstKitAt'] >= 15.0]
    ok('ON THE STREET THE KIT WAITS A PHRASE: first kit hit at %s, and 16s is 8 '
       'bars at 120 BPM -- the trait his law names as what people loved, on every '
       'song, with no song\'s data touched'
       % ([round(x['firstKitAt'], 2) for x in st] or 'none'),
       len(late_ok) == len(st) and st)
    for key, label in (('fight', 'A FIGHT'), ('opening', 'THE OPENING'),
                       ('studio', 'THE MUSIC TAB')):
        rows = lb.get(key) or []
        early = [x for x in rows if x.get('firstKitAt') is not None
                 and x['firstKitAt'] < 1.0]
        ok('AND IN %s THE KIT IS NEVER HELD (%s). %s' % (label,
           [round(x['firstKitAt'], 2) if x.get('firstKitAt') is not None else None
            for x in rows] or 'none',
           {'A FIGHT': 'Danger is now, and the first fight exists to TEACH the '
                       'beat -- one arriving 16s late teaches nothing',
            'THE OPENING': 'It owns one phrase in total, so holding a phrase '
                           'would silence its whole kit',
            'THE MUSIC TAB': 'He judges candidates there, and 16 silent bars at '
                             'the top of a candidate is an artefact, not a song'}[label]),
           rows and len(early) == len(rows))

    # ---- 3. THE RANKING IS NOT STALE --------------------------------------
    drift = []
    for n in list(top) + list(bot):
        if n not in got:
            continue
        rec = [x for x in rank if x['song'] == n][0]
        for f_, k_ in (('onsets', 'onsets'), ('low', 'bass'),
                       ('high', 'treble'), ('sustain', 'held')):
            a, bb = got[n][f_], rec[k_]
            if a is None or bb is None:
                continue
            tol = max(0.08, abs(bb) * 0.45)
            if abs(a - bb) > tol:
                drift.append('%s %s %.3f vs %.3f' % (n[:18], k_, a, bb))
    ok('THE RANKING STILL MATCHES WHAT THE ENGINE RENDERS TODAY, so a song any '
       'lane edits cannot leave a stale ranking standing in a bank file (%s)'
       % ('; '.join(drift[:4]) or 'no drift'), not drift)

    # ---- 4. ONE LOUD DEFECT, AND ONLY ONE ---------------------------------
    dfc = card.get('defect') or {}
    dn = dfc.get('song')
    peaks = [(n, got[n]['peak']) for n in got if n != dn]
    if dn in got and peaks:
        m = med([q for _, q in peaks])
        ratio = got[dn]['peak'] / m if m else 0
        ok('the named loud defect is still loud (%s peaks %.3f, %.1fx the median '
           '%.3f of the rest) -- reported, not silently re-balanced, because it '
           'is HIS content' % (dn, got[dn]['peak'], ratio, m), ratio > 3)
        others = [n for n, q in peaks if q > m * 3]
        ok('AND IT IS STILL THE ONLY ONE: no second song has joined it (%s)'
           % (others or 'none'), not others)
    else:
        ok('the named defect could be measured (%s)' % dn, False)

    print('  MEASURED  %d of 142 songs re-rendered; drum on beat one %s of %s, '
          'late %s' % (len(got), c.get('onOne'), c.get('total'), c.get('late')))
    print('\n=== SOUND CARD GATE: %d passed, %d failed ===' % (p, f))
    return 0 if f == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
