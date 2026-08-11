#!/usr/bin/env python3
"""
SQUIGGLE VOICE GATE (8/9/26) - the voices are real, seeded, and speech-shaped.

Paolo's demo ruling: Animal-Crossing-class gibberish speech, per-character
voices from an identity seed, ZERO voice acting and zero audio files.

WHAT MAKES THIS GATEABLE RATHER THAN A MATTER OF TASTE. Whether a voice sounds
GOOD is his ear and nothing here touches that. But four of the claims in the
engine's docstring are facts about output, and a claim nothing checks is how
this repo loses things:

  SEEDED      the same character saying the same line is identical every time,
              and two different characters are not. If this fails, the player
              can never learn to recognise anybody, which is the entire reason
              the feature exists.
  SPEECH      voiced and unvoiced alternate. A babble synth that pitches every
              letter produces a TUNE, and that is the classic failure mode.
  DECLINATION pitch falls across a statement and rises at a question.
  NO SAMPLES  nothing is fetched, and the SCREECH LAW holds (no delay, no
              convolver, no feedback anywhere).

Everything is measured by capturing what the engine actually schedules on a
real AudioContext in the real alpha, not by reading the source.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_voice.js')
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

JS = r'''
const path = require('path');
function pwmod(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}return require('playwright');}
const pw = pwmod();

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  // NOTHING MAY BE FETCHED. "zero audio files" is a ruling, so watch the wire.
  const net = [], netOther = [];
  p.on('request', r => { const u = r.url();
    if (u.startsWith('file:') || u.startsWith('data:') || u.startsWith('blob:')) return;
    // THE RULING IS ABOUT AUDIO. A first version failed this gate on another
    // lane's Google Fonts request, which is not a sample and not this lane's
    // business -- a gate that blames a neighbour for something outside its own
    // claim is the broken one. Audio requests fail; everything else is reported
    // so the information is not lost.
    if (/\.(wav|mp3|ogg|m4a|aac|flac|opus|webm)(\?|$)/i.test(u) || r.resourceType() === 'media')
      net.push(u);
    else netOther.push(u);
  });
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(900);
  await p.evaluate(() => { const t = document.querySelector('.tab[data-p="music"]'); if (t) t.click(); });
  await p.waitForTimeout(2600);

  const out = {};
  out.hasEngine = await p.evaluate(() => typeof BOH_VOICE === 'object' && !!BOH_VOICE);
  out.hasPanel  = await p.evaluate(() => !!document.getElementById('vxWrap'));
  out.noui      = await p.evaluate(() => { const w=document.getElementById('vxWrap');
                                           return !!(w && w.hasAttribute('data-noui')); });
  out.rows      = await p.evaluate(() => document.querySelectorAll('#vxWrap .vxPlay').length);

  // SEEDED: a voice is a pure function of its seed.
  out.seeded = await p.evaluate(() => {
    const a = BOH_VOICE.voiceOf('father'), b = BOH_VOICE.voiceOf('father');
    const c = BOH_VOICE.voiceOf('mother');
    return { same: JSON.stringify(a) === JSON.stringify(b),
             differ: JSON.stringify(a) !== JSON.stringify(c),
             a: a, c: c };
  });

  // ---- CAPTURE WHAT IS ACTUALLY SCHEDULED -----------------------------
  // Wrap the AudioContext factories and record every node the engine builds,
  // with the frequency and time it was given. This is the output, not the code.
  await p.evaluate(() => {
    window.__cap = null;
    window.__record = function(fn){
      const AC = MUS.AC;
      const rec = { osc:[], noise:[], bq:[], delay:0, conv:0 };
      const o1 = AC.createOscillator.bind(AC), b1 = AC.createBufferSource.bind(AC),
            q1 = AC.createBiquadFilter.bind(AC);
      const d1 = AC.createDelay ? AC.createDelay.bind(AC) : null;
      const c1 = AC.createConvolver ? AC.createConvolver.bind(AC) : null;
      // READ THE PITCH THAT WAS SCHEDULED, NOT .value.
      // First version of this filtered on frequency.value and found ZERO voiced
      // blips in a line of 60. The engine sets pitch with setValueAtTime, which
      // does not move .value until the scheduled moment arrives, so every
      // oscillator still read as the 440Hz default. Capturing the scheduled
      // value also separates the two kinds of oscillator for free: the CARRIER
      // is pitched with setValueAtTime, the vibrato LFO is set through .value,
      // so only carriers are recorded here and no filter guesses at a range.
      AC.createOscillator = function(){
        const n=o1(); const s=n.start.bind(n);
        const sv=n.frequency.setValueAtTime.bind(n.frequency);
        let sched=null;
        n.frequency.setValueAtTime=function(val,when){ sched=val; return sv(val,when); };
        n.start=function(t){ if(sched!==null) rec.osc.push({t:t, f:sched, type:n.type});
                             return s(t); };
        return n; };
      AC.createBufferSource = function(){ const n=b1(); const s=n.start.bind(n);
        n.start=function(t){ rec.noise.push({t:t}); return s(t); }; return n; };
      AC.createBiquadFilter = function(){ const n=q1(); rec.bq.push(n); return n; };
      if (d1) AC.createDelay = function(){ rec.delay++; return d1.apply(null, arguments); };
      if (c1) AC.createConvolver = function(){ rec.conv++; return c1(); };
      try { fn(); } finally {
        AC.createOscillator=o1; AC.createBufferSource=b1; AC.createBiquadFilter=q1;
        if (d1) AC.createDelay=d1; if (c1) AC.createConvolver=c1;
      }
      // the vibrato LFO is an oscillator too; the carrier is the one whose
      // frequency sits in a human pitch range
      rec.voiced = rec.osc;   // already only the carriers
      return rec;
    };
    try { MUS.audio(); } catch(e) {}
  });

  async function say(seed, text){
    return await p.evaluate(a => {
      const v = BOH_VOICE.voiceOf(a.seed);
      let r = null;
      const rec = window.__record(() => { r = BOH_VOICE.say(a.text, v, MUS.AC, MUS.AC.destination, MUS.AC.currentTime + 0.05); });
      return { ret:r, osc:rec.voiced.map(o=>({t:+o.t.toFixed(5), f:+o.f.toFixed(2)})),
               noise:rec.noise.length, allOsc:rec.osc.length,
               delay:rec.delay, conv:rec.conv };
    }, { seed, text });
  }

  const STMT = "You want to come in here and act like the last three months never happened.";
  const QUES = "Are you going to pay me or not?";

  out.say1 = await say('father', STMT);
  out.say2 = await say('father', STMT);      // same person, same line, twice
  out.say3 = await say('mother', STMT);      // different person
  out.sayQ = await say('father', QUES);

  out.net = net.slice(0, 5);
  out.netOther = Array.from(new Set(netOther)).slice(0, 4);
  out.errors = errs.slice(0, 4);
  console.log(JSON.stringify(out));
  await b.close();
})();
'''


def main():
    print('=== SQUIGGLE VOICE GATE - seeded, speech-shaped, no samples ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    # ---- SCREECH LAW, read on the engine itself -------------------------
    src = open(ENGINE, encoding='utf8').read()
    code = re.sub(r'/\*[\s\S]*?\*/', ' ', src)
    code = re.sub(r'(^|[^:\'"\\])//[^\n]*', r'\1 ', code)
    for bad in ('createDelay', 'createConvolver', 'createWaveShaper'):
        ok('SCREECH LAW: the engine never calls %s' % bad, bad not in code)
    ok('SCREECH LAW: no feedback path (no node connected back to its own source)',
       'feedback' not in code.lower())
    ok('ZERO AUDIO FILES: the engine loads no buffer from anywhere',
       'decodeAudioData' not in code and 'XMLHttpRequest' not in code
       and 'fetch(' not in code)

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=420)
    finally:
        os.unlink(js)
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    ok('the engine is in the ONE alpha', d.get('hasEngine'))
    ok('the judge page is in the MUSIC tab', d.get('hasPanel'))
    ok('it carries data-noui so a click tone cannot cover the voice (Paolo 8/4)',
       d.get('noui'))
    ok('eight candidate voices to judge (%s)' % d.get('rows'), d.get('rows') == 8)

    s = d.get('seeded') or {}
    ok('SEEDED: the same character is the same voice every time', s.get('same'))
    ok('and two different characters are NOT the same voice', s.get('differ'))
    va, vc = s.get('a') or {}, s.get('c') or {}
    ok('the character knob is the VOCAL TRACT, not just pitch (%.3f vs %.3f)'
       % (va.get('tract', 0), vc.get('tract', 0)),
       va.get('tract') != vc.get('tract'))
    ok('pitches stay inside a human range (%s, %s Hz)' % (va.get('f0'), vc.get('f0')),
       78 <= (va.get('f0') or 0) <= 300 and 78 <= (vc.get('f0') or 0) <= 300)

    s1, s2, s3, sq = (d.get('say1') or {}), (d.get('say2') or {}), (d.get('say3') or {}), (d.get('sayQ') or {})
    ok('a line actually schedules something (%s blips)' % ((s1.get('ret') or {}).get('blips')),
       ((s1.get('ret') or {}).get('blips') or 0) > 20)

    # SEEDED PER LINE: identical twice, different for another person.
    # COMPARE THE BABBLE, NOT THE WALL CLOCK. Each call is scheduled from
    # AC.currentTime, so absolute timestamps differ by construction and the
    # first version of this check could never have passed. What must be
    # identical is the SEQUENCE: the same pitches at the same offsets from the
    # start of the line.
    # PITCH IS COMPARED EXACTLY; TIMING WITHIN A TOLERANCE NO EAR COULD HEAR.
    # Not a softened assertion -- a correct one. Each call is scheduled from a
    # different AC.currentTime, so the per-blip offsets are computed by
    # subtracting two large floats and land a few bits apart. The claim being
    # made is that the BABBLE is the same, and a 0.1ms scheduling difference is
    # not a babble difference. The pitches, which are the thing you recognise a
    # person by, must match to the digit.
    def pitches(x):
        return [b['f'] for b in ((x or {}).get('osc') or [])]

    def offsets(x):
        o = (x or {}).get('osc') or []
        return [b['t'] - o[0]['t'] for b in o] if o else []

    p1, p2, p3 = pitches(s1), pitches(s2), pitches(s3)
    o1, o2 = offsets(s1), offsets(s2)
    ok('the SAME person saying the SAME line babbles the SAME PITCHES, exactly',
       bool(p1) and p1 == p2)
    ok('and lands them at the same moments (within 0.1ms)',
       len(o1) == len(o2) and all(abs(a - b) < 1e-4 for a, b in zip(o1, o2)))
    ok('a DIFFERENT person saying the same line does not', bool(p1) and p1 != p3)

    # SPEECH SHAPE: voiced and unvoiced must both be present.
    #
    # COUNTING BUFFER SOURCES WAS THE WRONG RULER AND MUTATION CAUGHT IT. The
    # first version counted every createBufferSource as "unvoiced" -- but the
    # BREATH mixed into a voiced blip is a buffer source too, so a build with
    # every consonant pitched (a tune, the exact failure this check exists for)
    # still showed plenty of "noise" and passed. A checker that cannot tell a
    # breath from a hiss is the broken one.
    #
    # The exact count needs no node inspection at all: say() reports how many
    # letters it spoke, and every VOICED letter creates exactly one carrier
    # oscillator. So unvoiced = spoken - carriers, and it cannot be fooled.
    nv = len(s1.get('osc') or [])
    spoken = (s1.get('ret') or {}).get('blips') or 0
    nu = spoken - nv
    ok('VOICED blips exist (%d of %d letters)' % (nv, spoken), nv > 10)
    ok('UNVOICED blips exist too (%d) -- without them it is a TUNE, not speech' % nu,
       nu > 5)
    ok('and neither drowns the other (voiced %d / unvoiced %d)' % (nv, nu),
       nv > 0 and nu > 0 and 0.05 < (nu / max(1, nv)) < 20)

    # DECLINATION: statement falls, question ends higher than it fell to.
    fs = [o['f'] for o in (s1.get('osc') or [])]
    fq = [o['f'] for o in (sq.get('osc') or [])]
    if len(fs) >= 8:
        head = sum(fs[:len(fs) // 4]) / max(1, len(fs) // 4)
        tail = sum(fs[-len(fs) // 4:]) / max(1, len(fs) // 4)
        ok('DECLINATION: a statement falls in pitch (%.0f Hz -> %.0f Hz)' % (head, tail),
           tail < head)
    else:
        ok('DECLINATION: enough blips to measure', False)
    if len(fq) >= 8:
        qhead = sum(fq[:len(fq) // 4]) / max(1, len(fq) // 4)
        qtail = sum(fq[-max(1, len(fq) // 6):]) / max(1, len(fq) // 6)
        ok('A QUESTION RISES AT THE END instead (%.0f Hz -> %.0f Hz)' % (qhead, qtail),
           qtail > qhead * 0.99)
    else:
        ok('a question has enough blips to measure', False)

    # timing must be monotonic: a scheduled line, not a pile
    ts = [o['t'] for o in (s1.get('osc') or [])]
    ok('every blip is SCHEDULED in order, none stacked on another',
       all(ts[i] <= ts[i + 1] for i in range(len(ts) - 1)) and len(ts) > 1)
    ok('the line takes a believable amount of time (%.2fs)'
       % ((s1.get('ret') or {}).get('seconds') or 0),
       1.0 < ((s1.get('ret') or {}).get('seconds') or 0) < 20)

    ok('no delay node was built while speaking', (s1.get('delay') or 0) == 0)
    ok('no convolver was built while speaking', (s1.get('conv') or 0) == 0)
    ok('ZERO AUDIO FILES FETCHED, as ruled (%s)' % (d.get('net') or 'clean'),
       not d.get('net'))
    if d.get('netOther'):
        print('    NOTE  the alpha fetches %d non-audio external(s), not this '
              'lane\'s: %s' % (len(d['netOther']), ', '.join(
                  u.split('/')[2] for u in d['netOther'])))
    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Eight people who sound like themselves, out of arithmetic. '
              'No recording, no sample, nothing assigned to anybody yet.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
