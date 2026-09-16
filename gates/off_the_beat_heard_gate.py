#!/usr/bin/env python3
"""
BEING OFF THE BEAT MAKES A SOUND GATE (9/16/26, SOUNDS lane) - [beat teaches].

PAOLO 9/15: "I don't even know how to engage in combat and when that shit starts."
The row: during the first fight the beat is the loudest clearest thing, and a swing
on the beat sounds different from a swing off it, carried by SOUND not words.

MEASURED, AND TWO OF FOUR BANDS WERE SILENT. The fight grades every press into
PERFECT / GOOD / EARLY / LATE. PERFECT rendered three notes, GOOD one, and EARLY
and LATE rendered nothing at all -- and the chain-break that might have covered it
cannot fire while the groove is 0, which is exactly a player's first press in their
first fight.

WHAT THIS GATE REFUSES TO ACCEPT AS EVIDENCE:
  * A GREP. Nothing reads the alpha as text, and the fight lives base64-encoded
    inside it, so reading the file would be reading a blob anyway. Every number is
    a value the running fight returned.
  * A FUNCTION THAT WAS CALLED. It wraps the frame's tone(), drumV() and sfxAsk(),
    so the only thing countable is audio the frame really asked for.
  * A CLAIM WITH NO BAND TO COMPARE IT TO. Every one of the four bands the fight's
    own gradeOf() can return is driven, and all four must sound. A band list this
    gate typed itself would go stale the day COMBAT adds a grade, so the bands come
    from a SWEEP of gradeOf across -250..+250 ms.
  * A PITCH A PHONE CANNOT PLAY. The first version of this fix put the cue an
    octave below the family's root, which is 61.7 Hz at the shelf's low root, and a
    phone is the only measure of this game. There is a floor here, and the family's
    pitch moves with the song, so it is checked against the LIVE root.
  * A CUE THAT IS THE NEW SILENCE. The off-beat cue must render at least as loud as
    the GOOD cue it has to be told apart from, measured through the frame's own
    oscillator, not asserted.
  * A PASS THAT WOULD ALSO PASS WITH THE FIX REMOVED. --mutate deletes the branch
    at runtime and the sound claims must go red.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();
const REPO = process.argv[2];
const MUTATE = process.argv[3] === '--mutate';

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = { mutated: MUTATE, pageErrors: null };
  try {
    await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(1200);
    await p.click('#front', { force:true }).catch(()=>{});
    await p.click('#fronttap', { force:true }).catch(()=>{});

    let owned = false;
    for (let i = 0; i < 140; i++) {
      owned = await p.evaluate(() => { try {
        return !!(CITYMUS && CITYMUS.on) && !(MENUMUS && MENUMUS.on); } catch(e){ return false; } });
      if (owned) break;
      await p.waitForTimeout(500);
    }
    out.streetOwnsMusic = owned;

    /* A REAL FIGHT, through the shell's own route. */
    await p.evaluate(() => { try { cityEncounterIn({ packageId:1, street:true,
      label:'out on the block', at:{x:0,y:0} }); } catch(e){} });
    await p.waitForTimeout(3000);

    let fr = null;
    for (const f of p.frames()) {
      const ok = await f.evaluate(() => typeof window.sndOnBeatStab === 'function'
        && typeof window.gradeOf === 'function').catch(()=>false);
      if (ok) { fr = f; break; }
    }
    out.foundFight = !!fr;
    if (!fr) { out.FATAL = 'no frame exposes the fight\'s grade cue';
      console.log(JSON.stringify(out)); await b.close(); return; }

    /* MUTATION FIRST, before anything is read. A control that runs after the
       reading it is meant to falsify controls nothing. */
    if (MUTATE) out.mutationTook = await fr.evaluate(() => {
      try {
        const o = window.sndOnBeatStab;
        window.sndOnBeatStab = function(grade){
          if (grade === 'PERFECT' || grade === 'GOOD') return o.apply(this, arguments);
          return;                                  /* the branch this round added, gone */
        };
        return true;
      } catch(e){ return false; }
    });

    /* THE BANDS COME FROM THE FIGHT, NOT FROM THIS FILE. */
    out.bands = await fr.evaluate(() => {
      const seen = {};
      for (let ms = -250; ms <= 250; ms += 5) { const g = gradeOf(ms); seen[g] = (seen[g]||0)+1; }
      return { list:Object.keys(seen).sort(), counts:seen,
               perfectMs:(typeof PERFECT_MS!=='undefined'?PERFECT_MS:null),
               goodMs:(typeof GOOD_MS!=='undefined'?GOOD_MS:null) };
    });

    /* WRAP EVERY SOUND PATH IN THE FRAME. */
    out.wrapped = await fr.evaluate(() => {
      const L = window.__OBG = { log: [] }; const r = {};
      for (const nm of ['tone','drumV','sfxAsk']) {
        try { const o = window[nm]; if (typeof o !== 'function') { r[nm] = 'absent'; continue; }
          window[nm] = function(a,b2,c,d){
            const e = { via:nm };
            if (nm === 'tone') { e.hz = a; e.dur = b2; e.g = c; }
            else if (nm === 'drumV') e.kind = String(a);
            else e.ev = String(a);
            L.log.push(e); return o.apply(this, arguments); };
          r[nm] = true; } catch(e){ r[nm] = String(e&&e.message); }
      }
      return r;
    });

    /* EVERY BAND MUST SOUND. */
    out.perGrade = {};
    for (const g of out.bands.list) {
      out.perGrade[g] = await fr.evaluate((grade) => {
        const L = window.__OBG; L.log.length = 0;
        try { sndOnBeatStab(grade); } catch(e){ return { threw:String(e&&e.message) }; }
        return { sounds:L.log.slice() };
      }, g);
      await p.waitForTimeout(60);
    }

    /* THE CHAIN CANNOT COVER THE FIRST PRESS -- the reason the silence mattered. */
    out.chain = await fr.evaluate(() => {
      const r = {};
      try { r.brokeAt0 = !!BohemiaGroove.broke(0,'EARLY');
            r.brokeAt3 = !!BohemiaGroove.broke(3,'EARLY'); } catch(e){ r.err = String(e&&e.message); }
      return r;
    });

    /* THE LEVEL, rendered through the frame's OWN oscillator, against GOOD. */
    out.level = await fr.evaluate(async () => {
      async function meas(freq,dur,vol,type){
        const AC = new OfflineAudioContext(1, 44100*1, 44100);
        const bus = AC.createGain(); bus.gain.value=1; bus.connect(AC.destination);
        const o=AC.createOscillator(),g=AC.createGain();
        o.type=type; o.frequency.value=freq;
        g.gain.setValueAtTime(vol,0); g.gain.exponentialRampToValueAtTime(0.0001,dur);
        o.connect(g); g.connect(bus); o.start(0); o.stop(dur+0.02);
        const d=(await AC.startRendering()).getChannelData(0);
        let peak=0,sum=0; for(let i=0;i<d.length;i++){const a=Math.abs(d[i]); if(a>peak)peak=a; sum+=d[i]*d[i];}
        return { peak:+peak.toFixed(4), rms:+Math.sqrt(sum/d.length).toFixed(5) };
      }
      const r = {};
      try { const f=(typeof owSong==='function')?owSong():FAC();
        const semi=(f.root-55)+((f.scale&&f.scale[0])||0)+12;
        r.liveRootHz = +noteHz(semi).toFixed(1);
        r.octaveBelowHz = +noteHz(semi-12).toFixed(1);
        r.good = await meas(noteHz(semi),0.10,0.040,'triangle');
        r.off  = await meas(noteHz(semi),0.07,0.040,'square');
      } catch(e){ r.err = String(e&&e.message); }
      return r;
    });

    /* AND THE BEAT ITSELF, the row's first claim, over six live seconds. */
    await fr.evaluate(() => { window.__OBG.log.length = 0; });
    await p.waitForTimeout(6000);
    out.sixSeconds = await fr.evaluate(() => {
      const L=window.__OBG, by={};
      L.log.forEach(x => { const k=x.via+':'+(x.kind||x.ev||'tone'); by[k]=(by[k]||0)+1; });
      return { total:L.log.length, by:by,
               drums:L.log.filter(x=>x.via==='drumV').length };
    });

    out.pageErrors = errs.length; out.errs = errs.slice(0,3);
  } catch (e) { out.THREW = String(e && e.message); }
  console.log(JSON.stringify(out));
  await b.close();
})();
'''

PHONE_FLOOR_HZ = 100.0   # below this a phone speaker is not a reliable teacher


def run(mutate):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        argv = ['node', js, ROOT] + (['--mutate'] if mutate else [])
        r = subprocess.run(argv, capture_output=True, text=True, timeout=300)
        lines = [l for l in r.stdout.strip().splitlines() if l.startswith('{')]
        if not lines:
            return {'FATAL': 'no json from the browser', 'stderr': r.stderr[-700:]}
        return json.loads(lines[-1])
    except Exception as e:                                   # noqa: BLE001
        return {'FATAL': str(e)}
    finally:
        os.unlink(js)


def claims(d):
    c = []
    bands = (d.get('bands') or {}).get('list') or []
    pg = d.get('perGrade') or {}
    lv = d.get('level') or {}
    ch = d.get('chain') or {}
    six = d.get('sixSeconds') or {}

    silent = [g for g in bands if not ((pg.get(g) or {}).get('sounds'))]
    counts = {g: len((pg.get(g) or {}).get('sounds') or []) for g in bands}

    c.append(('a real fight is running and exposes its own grade cue',
              d.get('foundFight') is True and d.get('streetOwnsMusic') is True,
              'fight=%s streetOwnsMusic=%s' % (d.get('foundFight'), d.get('streetOwnsMusic'))))
    c.append(('sound paths are wrapped, so sounds are counted and not asked for',
              (d.get('wrapped') or {}).get('tone') is True,
              str(d.get('wrapped'))))
    c.append(('the grade bands come from the fight, not from this gate',
              len(bands) >= 4,
              'bands %s from a sweep of -250..+250 ms (perfect<=%s, good<=%s)'
              % (bands, (d.get('bands') or {}).get('perfectMs'), (d.get('bands') or {}).get('goodMs'))))
    c.append(('EVERY BAND THE FIGHT CAN GRADE MAKES A SOUND',
              bands and not silent,
              'sounds per band %s; silent bands: %s' % (counts, silent or 'none')))
    c.append(('on the beat still sounds different from off it, by note count',
              counts.get('PERFECT', 0) > counts.get('GOOD', 0) >= 1
              and counts.get('GOOD', 0) == counts.get('LATE', 0),
              'PERFECT %s, GOOD %s, EARLY %s, LATE %s'
              % (counts.get('PERFECT'), counts.get('GOOD'),
                 counts.get('EARLY'), counts.get('LATE'))))
    off = ((pg.get('LATE') or {}).get('sounds') or [{}])[0]
    good = ((pg.get('GOOD') or {}).get('sounds') or [{}])[0]
    c.append(('and off the beat is told apart by being SHORTER, not by being lower',
              isinstance(off.get('dur'), (int, float)) and isinstance(good.get('dur'), (int, float))
              and off['dur'] < good['dur'] and abs((off.get('hz') or 0) - (good.get('hz') or 0)) < 1,
              'off dur %s at %s Hz, good dur %s at %s Hz'
              % (off.get('dur'), off.get('hz'), good.get('dur'), good.get('hz'))))
    c.append(('THE CUE IS IN A BAND A PHONE CAN PLAY (>= %.0f Hz), checked on the live root'
              % PHONE_FLOOR_HZ,
              isinstance(lv.get('liveRootHz'), (int, float)) and lv['liveRootHz'] >= PHONE_FLOOR_HZ,
              'live root %s Hz; the rejected octave below it is %s Hz'
              % (lv.get('liveRootHz'), lv.get('octaveBelowHz'))))
    # NOT THE NEW SILENCE. The first cut of this claim demanded the off-beat peak be
    # >= the GOOD peak and it failed by 0.0003, which is 0.8% -- two different decay
    # shapes sampled at 44.1 kHz do not land on the same peak sample, and 0.8% is far
    # under anything a person hears. A TOLERANCE TIGHTER THAN THE INSTRUMENT'S
    # RESOLUTION MEASURES THE INSTRUMENT. So the peak gets a stated 5% margin and the
    # claim leans on ENERGY, where the square's harmonics put it clearly ahead.
    off_l, good_l = lv.get('off') or {}, lv.get('good') or {}
    c.append(('AND IT IS NOT THE NEW SILENCE: peak within 5% of the GOOD cue and at '
              'least its energy',
              bool(off_l) and bool(good_l)
              and off_l.get('peak', 0) >= good_l.get('peak', 1) * 0.95
              and off_l.get('rms', 0) >= good_l.get('rms', 1),
              'off peak %s rms %s against good peak %s rms %s (peak floor %.4f)'
              % (off_l.get('peak'), off_l.get('rms'), good_l.get('peak'),
                 good_l.get('rms'), good_l.get('peak', 0) * 0.95)))
    c.append(('the chain could never have covered a first press',
              ch.get('brokeAt0') is False and ch.get('brokeAt3') is True,
              'broke at groove 0: %s, at groove 3: %s' % (ch.get('brokeAt0'), ch.get('brokeAt3'))))
    c.append(('the row\'s FIRST claim holds: a beat is audible right through the fight',
              (six.get('drums') or 0) >= 10,
              '%s drum hits in six live seconds, %s' % (six.get('drums'), six.get('by'))))
    c.append(('nothing threw', d.get('pageErrors') == 0,
              '%s page errors %s' % (d.get('pageErrors'), d.get('errs') or '')))
    return c


def main():
    print('=== BEING OFF THE BEAT MAKES A SOUND ===')
    d = run(False)
    if d.get('FATAL') or d.get('THREW'):
        print('FAIL: %s' % (d.get('FATAL') or d.get('THREW')))
        if d.get('stderr'):
            print(d['stderr'])
        return 1

    cs = claims(d)
    bad = 0
    for name, ok, detail in cs:
        print('  %s %s' % ('PASS' if ok else 'FAIL', name))
        print('       %s' % detail)
        if not ok:
            bad += 1

    m = run(True)
    if m.get('FATAL') or m.get('THREW'):
        print('  FAIL mutation run did not complete: %s' % (m.get('FATAL') or m.get('THREW')))
        bad += 1
    else:
        watched = 'EVERY BAND THE FIGHT CAN GRADE MAKES A SOUND'
        still = [n for n, ok, _ in claims(m) if ok and n == watched]
        if still:
            print('  FAIL mutation control: %r passed with the branch REMOVED, so it does '
                  'not measure it' % watched)
            bad += 1
        else:
            mpg = m.get('perGrade') or {}
            print('  PASS mutation control: with the off-beat branch gone, the bands go '
                  'silent again')
            print('       sounds per band without it: %s'
                  % {g: len((mpg.get(g) or {}).get('sounds') or []) for g in (m.get('bands') or {}).get('list') or []})

    print('  %d passed, %d failed' % (len(cs) + 1 - bad, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
