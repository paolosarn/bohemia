#!/usr/bin/env python3
"""
VOICE MOOD GATE (8/13/26) - people sound like what they mean, and the six voices
he approved still sound exactly like the six voices he approved.

THE GAP THIS CLOSES. Identity was solved on 8/11: a person's voice is a pure
function of who they are, so you learn to recognise them. DELIVERY was not.
Every character in the game said every line the same way -- a mother calling her
kids to dinner and somebody telling you to get out of the house came out at the
same pitch, the same speed, the same weight. Delivery is most of what makes a
conversation feel like people rather than a text box with a noise attached.

THE RESEARCH IS OLD AND IT AGREES WITH ITSELF. Scherer (1986) and the Juslin &
Laukka meta-analysis (2003, 104 studies of vocal expression, 41 of music
performance) land on the same pattern: high-arousal states -- anger, fear,
elation -- carry HIGH MEAN F0, HIGH F0 VARIABILITY, HIGH INTENSITY and an
INCREASED SPEAKING RATE; sadness carries reduced intensity, lower pitch, slower
tempo, narrow range; and fear and happiness are specifically marked by greater
pitch variability. Those are the five things the engine now moves.

TWO AXES, NOT A LIST OF EMOTIONS, and that is a canon decision as much as a
technical one. Naming which of Paolo's characters feel "contempt" would be
writing his people for him. MECHANISM-MINE / CONTENTS-PAOLO'S: the dial ships,
he decides who is angry.

WHAT THE DEFAULT IS ALLOWED TO READ: punctuation and case. A shout, a trail-off,
a question -- marks writers already type, that mean the same thing in every
script ever written. It does NOT infer sentiment from the words. A machine
deciding what a line MEANS would be wrong in exactly the places that matter, so
valence stays 0 unless a caller states it.

THE CHECK THAT MATTERS MOST IS THE ONE THAT SAYS NOTHING CHANGED. His six
approved voices were thumbed on a specific delivery. If the mood default ever
reaches the judge, or if neutral stops being the identity, then what plays back
is not what he approved -- silently. So this gate renders neutral and asserts it
is IDENTICAL, sample for sample, to the engine with mood removed entirely.
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JS = r'''
const path=require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw=pwmod();
(async()=>{
  const {chromium}=pw;
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(900);
  const out=await p.evaluate(async()=>{
    if(typeof BOH_VOICE==='undefined') return {fatal:'BOH_VOICE is not in the shipped alpha'};
    const r={};
    r.hasMood = !!(BOH_VOICE.moodOf && BOH_VOICE.bend && BOH_VOICE.MOOD_NEUTRAL);
    if(!r.hasMood) return r;

    /* WHAT THE PUNCTUATION SAYS. Objective marks only. */
    r.reads = {};
    const LINES = {
      flat:   'Sit down, both of you.',
      shout:  'GET OUT OF MY HOUSE',
      bang:   'Back door. Behind me, and do not run!',
      bangs:  'Back door. Behind me, and do not run!!',
      trail:  'I do not know...',
      ask:    'Can I take the truck Saturday?'
    };
    for(const k in LINES) r.reads[k] = BOH_VOICE.moodOf(LINES[k]);

    /* NEUTRAL IS THE IDENTITY. bend() at zero must return the voice itself. */
    const v = BOH_VOICE.voiceOf('mother');
    r.neutralIdentity = JSON.stringify(BOH_VOICE.bend(v, BOH_VOICE.MOOD_NEUTRAL)) === JSON.stringify(v);
    r.undefMoodIsNotNeutralForShout =
      JSON.stringify(BOH_VOICE.moodOf(LINES.shout)) !== JSON.stringify(BOH_VOICE.MOOD_NEUTRAL);

    /* MEASURE THE AUDIO. Offline, through the real say() path. */
    const SR=44100;
    async function pcm(text, mood){
      const OAC=new OfflineAudioContext(1, SR*6, SR);
      const bus=OAC.createGain(); bus.gain.value=1; bus.connect(OAC.destination);
      const said = (mood===undefined) ? BOH_VOICE.say(text, v, OAC, bus, 0.02)
                                      : BOH_VOICE.say(text, v, OAC, bus, 0.02, mood);
      const buf=await OAC.startRendering();
      const d=buf.getChannelData(0);
      let pk=0, sq=0, first=-1, last=-1;
      for(let i=0;i<d.length;i++){ const a=Math.abs(d[i]);
        if(a>pk)pk=a; sq+=d[i]*d[i];
        if(a>1e-4){ if(first<0)first=i; last=i; } }
      /* zero crossings over the spoken part, kept as a reported number */
      let zc=0,n=0;
      for(let i=Math.max(1,first);i<=Math.max(1,last);i++){ n++; if((d[i]>=0)!==(d[i-1]>=0))zc++; }
      /* HIGH-FREQUENCY ENERGY, and ZCR is NOT it. The first version of this
         gate measured brightness by zero crossings and the aroused render came
         out LOWER than neutral -- because a babble is mostly unvoiced hiss,
         which crosses zero constantly, so ZCR reads the hiss-to-voice BALANCE
         far more than it reads the spectrum. Same mistake as counting every
         render as a strike.
         The first difference of the signal is a one-pole high-pass, so
         rms(diff)/rms(signal) rises and falls with the spectral centroid. It
         is cheap, it needs no FFT, and it measures the thing the research
         actually names: high-frequency energy. */
      let dsq=0;
      for(let i=Math.max(1,first);i<=Math.max(1,last);i++){ const dv=d[i]-d[i-1]; dsq+=dv*dv; }
      const rmsAll=Math.sqrt(sq/d.length);
      const rmsDiff=n?Math.sqrt(dsq/n):0;
      let sqSpoken=0;
      for(let i=Math.max(0,first);i<=Math.max(0,last);i++) sqSpoken+=d[i]*d[i];
      const rmsSpoken=n?Math.sqrt(sqSpoken/n):1e-9;
      const hf = rmsSpoken>1e-9 ? rmsDiff/rmsSpoken : 0;
      return { peak:pk, rms:rmsAll, zcr:n?zc/n:0, hf:hf,
               dur:(last-first)/SR, blips:said.blips, seconds:said.seconds,
               mood:said.mood, data:d };
    }
    function same(a,b){
      if(a.data.length!==b.data.length) return false;
      for(let i=0;i<a.data.length;i++) if(Math.abs(a.data[i]-b.data[i])>1e-7) return false;
      return true;
    }
    const flat = LINES.flat;
    const neutral   = await pcm(flat, BOH_VOICE.MOOD_NEUTRAL);
    const neutral2  = await pcm(flat, BOH_VOICE.MOOD_NEUTRAL);
    const derived   = await pcm(flat);                 /* no mood -> read the text */
    const roused    = await pcm(flat, {arousal: 1, valence: 0});
    const flatteneD = await pcm(flat, {arousal:-1, valence: 0});
    const warm      = await pcm(flat, {arousal: 0, valence: 1});

    r.neutralDeterministic = same(neutral, neutral2);
    /* A LINE WITH NO MARKS IN IT MUST COME OUT NEUTRAL. This is the check that
       protects his 8/11 verdicts: the default may only move a line that says so
       in its own punctuation. */
    r.plainLineIsNeutral = same(neutral, derived);

    const strip = o => ({peak:+o.peak.toFixed(5), rms:+o.rms.toFixed(6),
                         zcr:+o.zcr.toFixed(5), hf:+o.hf.toFixed(5), dur:+o.dur.toFixed(4),
                         seconds:o.seconds, blips:o.blips, mood:o.mood});
    r.neutral=strip(neutral); r.roused=strip(roused);
    r.flat=strip(flatteneD);  r.warm=strip(warm);
    r.shoutHeard = strip(await pcm(LINES.shout));
    r.trailHeard = strip(await pcm(LINES.trail));
    return r;
  });
  out.errors=errs.slice(0,3);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== VOICE MOOD GATE - people sound like what they mean ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=900)
    finally:
        os.unlink(js)
    line = [x for x in r.stdout.strip().split('\n') if x.startswith('{')]
    if not line:
        print('  > node produced nothing:\n' + (r.stderr or '')[-1200:])
        print('  0 passed, 1 FAILED')
        return 1
    d = json.loads(line[-1])
    if d.get('fatal'):
        print('  > FAIL ' + d['fatal'])
        print('  0 passed, 1 FAILED')
        return 1

    ok('the shipped alpha carries the mood axis', d.get('hasMood'))
    if not d.get('hasMood'):
        print('  %d passed, %d FAILED' % (p, f))
        return 1

    # ---- 1. NOTHING HE APPROVED MOVED -------------------------------------
    ok('neutral is the IDENTITY: bending a voice by nothing returns that voice',
       d['neutralIdentity'])
    ok('neutral renders the same samples twice (seeded, so a thumb keeps meaning '
       'the voice he heard)', d['neutralDeterministic'])
    ok('A LINE WITH NO MARKS IN IT IS UNCHANGED, sample for sample -- the default '
       'may only move a line that says so in its own punctuation',
       d['plainLineIsNeutral'])

    # ---- 2. THE PUNCTUATION IS READ THE WAY SCRIPTS ARE WRITTEN -----------
    reads = d['reads']
    ok('a plain statement asks for nothing (%s)' % reads['flat'],
       abs(reads['flat']['arousal']) < 1e-9)
    ok('CAPS IS A SHOUT (%s)' % reads['shout'], reads['shout']['arousal'] >= 0.4)
    ok('an exclamation mark lifts it (%s)' % reads['bang'],
       reads['bang']['arousal'] >= 0.4)
    ok('two lift it further (%s vs %s)' % (reads['bangs'], reads['bang']),
       reads['bangs']['arousal'] > reads['bang']['arousal'])
    ok('a trail-off takes it DOWN, which is the half a naive reading forgets (%s)'
       % reads['trail'], reads['trail']['arousal'] <= -0.2)
    ok('a question leans forward a little, not a lot (%s)' % reads['ask'],
       0 < reads['ask']['arousal'] < 0.4)
    ok('NOTHING GUESSES AT SENTIMENT: valence stays 0 unless a caller states it',
       all(abs(v['valence']) < 1e-9 for v in reads.values()))

    # ---- 3. AND IT IS AUDIBLE, not just a number in a struct --------------
    n, ro, fl, wa = d['neutral'], d['roused'], d['flat'], d['warm']
    print('            blips  seconds     peak       rms      zcr       hf')
    for lbl, o in (('neutral', n), ('roused', ro), ('flattened', fl), ('warm', wa),
                   ('a shout', d['shoutHeard']), ('a trail-off', d['trailHeard'])):
        print('  %-11s %4d  %7.3f  %7.5f  %8.6f  %7.5f  %7.5f'
              % (lbl, o['blips'], o['seconds'], o['peak'], o['rms'], o['zcr'],
                 o['hf']))
    # Juslin & Laukka: high arousal is FASTER, LOUDER and BRIGHTER than neutral.
    ok('AROUSED SPEECH IS FASTER (%.3fs vs %.3fs)' % (ro['seconds'], n['seconds']),
       ro['seconds'] < n['seconds'] * 0.92)
    ok('AROUSED SPEECH IS LOUDER (rms %.6f vs %.6f)' % (ro['rms'], n['rms']),
       ro['rms'] > n['rms'] * 1.05)
    ok('AROUSED SPEECH IS BRIGHTER -- high-frequency energy, which is the cue '
       'the research names (hf %.5f vs %.5f)' % (ro['hf'], n['hf']),
       ro['hf'] > n['hf'] * 1.03)
    # and the low-arousal end has to move the OTHER way, or the dial is one-sided
    ok('FLATTENED SPEECH IS SLOWER (%.3fs vs %.3fs)' % (fl['seconds'], n['seconds']),
       fl['seconds'] > n['seconds'] * 1.08)
    ok('FLATTENED SPEECH IS QUIETER (rms %.6f vs %.6f)' % (fl['rms'], n['rms']),
       fl['rms'] < n['rms'] * 0.95)
    ok('VALENCE DOES SOMETHING OF ITS OWN, separate from arousal (hf %.5f vs '
       '%.5f)' % (wa['hf'], n['hf']), abs(wa['hf'] - n['hf']) > 1e-6)
    # the whole point, end to end: a shout and a trail-off of the SAME engine
    # must not arrive the same way.
    sh, tr = d['shoutHeard'], d['trailHeard']
    ok('A SHOUT AND A TRAIL-OFF DO NOT ARRIVE THE SAME WAY (rms %.6f vs %.6f, '
       'hf %.5f vs %.5f)' % (sh['rms'], tr['rms'], sh['hf'], tr['hf']),
       sh['rms'] > tr['rms'] * 1.05 and abs(sh['hf'] - tr['hf']) > 1e-6)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  A shout is faster, louder and brighter than a trail-off, and a '
              'line with no marks in it is byte-for-byte what he approved.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
