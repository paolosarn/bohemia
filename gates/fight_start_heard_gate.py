#!/usr/bin/env python3
"""
A FIGHT STARTING MAKES A SOUND GATE (9/15/26, SOUNDS lane) - [music owned].

PAOLO 9/15, his second play: "I don't even know how to engage in combat and when
that shit starts." This gate is the sound half of that sentence, held down.

WHAT IT REFUSES TO ACCEPT AS EVIDENCE, because every one of these has burned this
lane already:

  * A GREP. Nothing below reads the alpha as text. Every number is a value the
    running game returned, on a real boot, through a real front door, with the
    street really owning the music (polled, not waited for -- a fixed wait is not
    an event).
  * STING.play RETURNING TRUE. It returns true on its own bookkeeping. This wraps
    synthV itself, so the only thing it can count is notes the ENGINE WAS HANDED.
  * A CLAIM WITH NOTHING TO COMPARE IT TO. It runs a CONTROL WINDOW first: the
    same length of street, nothing pressed. If the control also produces a fight
    sting, the instrument is lying and the gate says so instead of passing.
  * A BEAT CHECK AGAINST A NUMBER I TYPED. The beat grid comes from the
    transport's own nextT/step/stepDur, READ IN THE SAME EVALUATE AS THE NOTES.
    The first cut of this check read the grid 400 ms after the notes and reported
    every note 60 ms off the beat; they were exactly on it. A GRID READ AT A
    DIFFERENT TIME THAN THE EVENT IS A DIFFERENT GRID.
  * A LEVEL NOBODY MEASURED. The first figure shipped this round peaked 0.9338
    into a 0.8 master because two of its notes landed on the same 16th step and
    summed. There is a ceiling here now, and it is not a typed constant: it is
    the loudest figure the family already had, times a stated margin.
  * A PASS THAT WOULD ALSO PASS WITH THE FIX REMOVED. --mutate deletes the
    figure at runtime and every claim below must go red.
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
const WIN = 6000;

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

    /* THE STREET MUST REALLY OWN THE MUSIC, polled. A fight sting measured while
       the opening still owns the transport is a measurement of a different
       moment, and this lane has published that mistake before. */
    let owned = false;
    for (let i = 0; i < 140; i++) {
      owned = await p.evaluate(() => { try {
        return !!(CITYMUS && CITYMUS.on) && !(MENUMUS && MENUMUS.on); } catch(e){ return false; } });
      if (owned) break;
      await p.waitForTimeout(500);
    }
    out.streetOwnsMusic = owned;
    if (!owned) { out.FATAL = 'the street never took the music'; console.log(JSON.stringify(out)); await b.close(); return; }

    /* THE MUTATION GOES IN BEFORE ANYTHING IS READ. The first cut of this gate
       read the family list ABOVE this line, so the family claim passed with the
       figure deleted and the mutation control caught it -- which is the whole
       reason a mutation control exists. A CONTROL THAT RUNS AFTER THE READING IT
       IS MEANT TO FALSIFY CONTROLS NOTHING. */
    if (MUTATE) out.mutationTook = await p.evaluate(() => {
      try { delete STING.FIG.fight; return !STING.FIG.fight; } catch(e){ return false; } });

    /* the family this figure joins, and the level ceiling derived from it */
    out.family = await p.evaluate(() => { try { return Object.keys(STING.FIG); } catch(e){ return null; } });

    /* WRAP synthV: the only thing this can count is notes the engine was handed. */
    out.wrapped = await p.evaluate(() => {
      const L = window.__FSG = { notes: [] };
      const base = window.synthV || (typeof synthV !== 'undefined' ? synthV : null);
      if (!base) return false;
      window.synthV = function(kind, AC, dest, hz, sd, semi, t, g){
        try { L.notes.push({ k:String(kind), semi:semi, t:+t, g:g }); } catch(e){}
        return base.apply(this, arguments); };
      return true;
    });

    /* ---- THE FIGURE, rendered offline through the real synthV -------------
       Done BEFORE the fight so the render cannot be confused with the fight's
       own notes, and so the level claim does not depend on a live window. */
    out.level = await p.evaluate(async () => {
      const SV = window.synthV;
      async function render(fig){
        const AC = new OfflineAudioContext(1, 44100*3, 44100);
        const bus = AC.createGain(); bus.gain.value = 1; bus.connect(AC.destination);
        for (const n of fig.n){
          const semi = 45 + fig.oct + n[0] - 55;
          try { SV(fig.v, AC, bus, x => MUS.noteHz(x), fig.sd, semi, n[1]*0.125, fig.g); } catch(e){}
        }
        const d = (await AC.startRendering()).getChannelData(0);
        let peak=0,sum=0; for(let i=0;i<d.length;i++){const a=Math.abs(d[i]); if(a>peak)peak=a; sum+=d[i]*d[i];}
        return { peak:+peak.toFixed(4), rms:+Math.sqrt(sum/d.length).toFixed(4) };
      }
      const r = { fight:null, others:{}, loudestOther:0, master:null };
      try { r.master = +MUS.MAST.gain.value.toFixed(3); } catch(e){}
      for (const k of Object.keys(STING.FIG)) {
        const m = await render(STING.FIG[k]);
        if (k === 'fight') r.fight = m;
        else { r.others[k] = m; if (m.peak > r.loudestOther) r.loudestOther = m.peak; }
      }
      return r;
    });

    /* ---- CONTROL WINDOW: the street, nothing pressed ------------------- */
    await p.evaluate(() => { window.__FSG.notes.length = 0; });
    await p.waitForTimeout(WIN);
    out.control = await p.evaluate(() => {
      const n = window.__FSG.notes;
      const r = { taiko: n.filter(x => x.k === 'taiko').length, total: n.length };
      n.length = 0; return r;
    });

    /* ---- THE FIGHT. Grid and notes read against ONE transport reading. --- */
    out.start = await p.evaluate(() => {
      const r = {};
      try { r.nextT = MUS.nextT; r.step = MUS.step; r.stepDur = MUS.stepDur();
            r.at = MUS.AC.currentTime; } catch(e){}
      try { r.fightmusBefore = !!(FIGHTMUS && FIGHTMUS.on); } catch(e){}
      try { cityEncounterIn({ packageId:1, street:true, label:'out on the block', at:{x:0,y:0} });
            r.called = true; } catch(e){ r.called = false; r.err = String(e&&e.message); }
      return r;
    });
    await p.waitForTimeout(800);
    out.fight = await p.evaluate(() => {
      const n = window.__FSG.notes;
      const r = { notes: n.filter(x => x.k === 'taiko'), fightmus:null, citymus:null };
      try { r.fightmus = !!(FIGHTMUS && FIGHTMUS.on); } catch(e){}
      try { r.citymus = !!(CITYMUS && CITYMUS.on); } catch(e){}
      return r;
    });

    /* BEAT ALIGNMENT, off the reading taken at the same instant as the call. */
    if (out.start && out.start.stepDur) {
      const sd = out.start.stepDur, beat = sd*4;
      const anchor = out.start.nextT - (out.start.step % 4) * sd;
      out.beat = { beat:+beat.toFixed(5), anchor:+anchor.toFixed(5),
        offMs: out.fight.notes.map(x => { const k = (x.t - anchor)/beat;
          return +(Math.abs(k - Math.round(k)) * beat * 1000).toFixed(2); }),
        /* DANGER IS NOW, and the honest way to say so is INSIDE THE TRANSPORT'S
           OWN FRAME. The first cut asserted the distance from AC.currentTime --
           a wall clock read before the call -- to the note's scheduled time, and
           demanded it be under one beat. That number contains the engine's
           SCHEDULING LOOKAHEAD and the round trip out of the browser, so it grew
           under load: the claim went RED in the pack and GREEN run alone, which
           means it was measuring the box. A TOLERANCE TIGHTER THAN WHAT THE
           INSTRUMENT CONTAINS MEASURES THE INSTRUMENT.
           The claim that actually matters is that the hit lands on the NEXT beat
           the transport has, not a phrase away, and STING.when() can only ever
           add 0 to 3 steps to nextT. So the bound is three steps past the next
           booked step, which is arithmetic the engine defines and no load can
           move. The wall-clock figure is still PRINTED, never asserted. */
        firstHitAfterNextStepMs: out.fight.notes.length
          ? +((out.fight.notes[0].t - out.start.nextT)*1000).toFixed(1) : null,
        maxAllowedMs: +(sd*3*1000).toFixed(1),
        wallClockMsNotAsserted: out.fight.notes.length
          ? +((out.fight.notes[0].t - out.start.at)*1000).toFixed(1) : null };
    }
    out.pageErrors = errs.length; out.errs = errs.slice(0,3);
  } catch (e) { out.THREW = String(e && e.message); }
  console.log(JSON.stringify(out));
  await b.close();
})();
'''

MARGIN = 1.6   # the fight sting may be the loudest figure, but not by a landslide


def run(mutate):
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JS)
        js = f.name
    try:
        argv = ['node', js, ROOT] + (['--mutate'] if mutate else [])
        r = subprocess.run(argv, capture_output=True, text=True, timeout=300)
        line = [l for l in r.stdout.strip().splitlines() if l.startswith('{')]
        if not line:
            return {'FATAL': 'no json from the browser', 'stderr': r.stderr[-700:]}
        return json.loads(line[-1])
    except Exception as e:                                  # noqa: BLE001
        return {'FATAL': str(e)}
    finally:
        os.unlink(js)


def claims(d):
    """Every claim as (name, ok, detail). Numbers print whether it passes or not."""
    c = []
    lv = d.get('level') or {}
    fg = lv.get('fight')
    notes = (d.get('fight') or {}).get('notes') or []
    bt = d.get('beat') or {}
    ctl = d.get('control') or {}

    c.append(('the street owns the music before anything is measured',
              d.get('streetOwnsMusic') is True, str(d.get('streetOwnsMusic'))))
    c.append(('synthV is wrapped, so notes are counted and not asked for',
              d.get('wrapped') is True, str(d.get('wrapped'))))
    c.append(('the fight sting joins the sting family',
              'fight' in (d.get('family') or []),
              'family: %s' % ','.join(d.get('family') or [])))
    c.append(('a street fight really started',
              (d.get('start') or {}).get('called') is True and (d.get('fight') or {}).get('fightmus') is True,
              'called=%s FIGHTMUS.on=%s CITYMUS.on=%s' % ((d.get('start') or {}).get('called'),
                                                          (d.get('fight') or {}).get('fightmus'),
                                                          (d.get('fight') or {}).get('citymus'))))
    c.append(('THE CONTROL WINDOW IS SILENT of this voice, so the count is not invented',
              ctl.get('taiko') == 0,
              'taiko notes with no fight: %s (of %s notes in the window)'
              % (ctl.get('taiko'), ctl.get('total'))))
    c.append(('THE START OF A FIGHT SCHEDULES NOTES, counted at synthV',
              len(notes) >= 2, '%d taiko notes' % len(notes)))
    c.append(('every note lands ON THE BEAT of the transport grid',
              bool(bt.get('offMs')) and max(bt['offMs']) < 1.0,
              'off the beat by %s ms (beat %s s)' % (bt.get('offMs'), bt.get('beat'))))
    c.append(('the first hit lands on the NEXT beat the transport has, not a phrase away',
              isinstance(bt.get('firstHitAfterNextStepMs'), (int, float))
              and 0 <= bt['firstHitAfterNextStepMs'] <= bt.get('maxAllowedMs', 375) + 0.5,
              'first hit %s ms past the next booked step, ceiling %s ms '
              '(wall clock from the call, printed not asserted: %s ms)'
              % (bt.get('firstHitAfterNextStepMs'), bt.get('maxAllowedMs'),
                 bt.get('wallClockMsNotAsserted'))))
    c.append(('it RISES, which is what loss does not',
              len(notes) >= 2 and notes[-1]['semi'] > notes[0]['semi'],
              'semitones %s' % [n['semi'] for n in notes]))
    c.append(('it is the loudest figure in the family',
              bool(fg) and fg['peak'] > lv.get('loudestOther', 9),
              'fight peak %s, loudest other %s' % (fg and fg['peak'], lv.get('loudestOther'))))
    c.append(('AND IT DOES NOT CLIP: not past %.1fx the loudest figure, under the master' % MARGIN,
              bool(fg) and fg['peak'] <= lv.get('loudestOther', 0) * MARGIN
              and fg['peak'] < lv.get('master', 0.8),
              'fight peak %s, ceiling %.4f, master %s'
              % (fg and fg['peak'], lv.get('loudestOther', 0) * MARGIN, lv.get('master'))))
    c.append(('nothing threw', d.get('pageErrors') == 0,
              '%s page errors %s' % (d.get('pageErrors'), d.get('errs') or '')))
    return c


def main():
    print('=== A FIGHT STARTING MAKES A SOUND ===')
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

    # ---- MUTATION: with the figure gone, the sound claims must all go red ----
    m = run(True)
    if m.get('FATAL') or m.get('THREW'):
        print('  FAIL mutation run did not complete: %s' % (m.get('FATAL') or m.get('THREW')))
        bad += 1
    else:
        mcs = claims(m)
        watched = ['the fight sting joins the sting family',
                   'THE START OF A FIGHT SCHEDULES NOTES, counted at synthV',
                   'it is the loudest figure in the family']
        still = [n for n, ok, _ in mcs if ok and n in watched]
        if still:
            print('  FAIL mutation control: these passed with the figure REMOVED, so they '
                  'do not measure it -> %s' % still)
            bad += 1
        else:
            print('  PASS mutation control: with the figure deleted at runtime, '
                  'the family loses it and zero notes are scheduled')
            print('       taiko notes without the figure: %d'
                  % len(((m.get('fight') or {}).get('notes') or [])))

    print('  %d passed, %d failed' % (len(cs) + 1 - bad, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
