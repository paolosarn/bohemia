#!/usr/bin/env python3
"""
TIME PASS GATE (8/7/26) - you can hear HOW MANY hours went by.

HIS RULING, written on his own 130/130 verdict export:

    "For hours go by have it the amount of time that goes by"

NOTES ARE RULINGS (7/19). So this is not a preference to honour when convenient,
it is the spec, and the spec has a number in it: the sound must carry the
QUANTITY. That makes it machine-checkable in the only way that matters -- fire a
four-hour skip and a nine-hour skip and count what actually reached the bus. If
four hours and nine hours produce the same thing, the ruling is not built.

EVERY CHECK COUNTS RENDERS AT THE ENGINE, NOT INTENTIONS AT THE CALL SITE. The
trap here is specific and it was real: the voice limiter added on 8/4 throttles
on the WALL CLOCK, and all N strikes are requested in the same millisecond even
though they sound a beat apart. Routed through playSFX, an eight-hour sleep
would strike ONCE and every check that only asked "did a sound play" would pass.
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

(async () => {
  const { chromium } = pw;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:390,height:844}, hasTouch:true, isMobile:true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(process.argv[2], 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front', { force:true }).catch(()=>{});
  await p.waitForTimeout(1100);

  const out = {};

  // HIS THUMBS REACHED THE TABLE THE GAME READS. Not the verdict file, not the
  // bank on disk -- the object playSFX itself consults.
  out.approved = await p.evaluate(() => {
    const A = window.__SFX_APPROVED || {};
    return { time_pass: A.time_pass || null, eat: A.eat || null,
             sleep: A.sleep || null, go_inside: A.go_inside || null,
             talk_start: A.talk_start || null, quest_done: A.quest_done || null };
  });

  // COUNT RENDERS AT THE ENGINE. BOH_SFX.render is the one place a sound becomes
  // real, so wrapping it counts what the speaker gets rather than what a
  // function meant to do.
  // COUNT THE THING, NOT EVERYTHING. The first version counted every render and
  // went flaky the moment anything else made a noise in the same window -- one
  // hour "struck twice" because an unrelated sound landed in it. TIME_PASS is
  // the only family in his approved bank cooked from GLASS (the others are ash,
  // stone, bone, metal, crystal, bell, water, choir, wood), so the material is
  // an exact discriminator and nothing else can be mistaken for a strike.
  await p.evaluate(() => {
    window.__rr = [];
    const orig = BOH_SFX.render.bind(BOH_SFX);
    BOH_SFX.render = function(v, ac, dest, at){
      // GLASS ALONE STOPPED BEING EXACT (8/12). It was a true discriminator when
      // time_pass was the only approved glass sound in the game; then Paolo's
      // full 270-thumb sweep approved ui_deny, which is also glass, and this
      // counter started counting refusals as hours. A signature is only exact
      // against the bank it was measured on, and the bank grows.
      // HIS OWN WORDS NAME THE SIGNATURE THAT CANNOT DRIFT: time_pass is "the
      // only sound here that MOVES IN PITCH". Its five approved candidates
      // slide -6.5 to -9.7 semitones; ui_deny slides zero. Glass AND falling.
      if (v && v.mat === 'glass' && v.slide < -3) window.__rr.push(at == null ? -1 : at);
      return orig.apply(null, arguments);
    };
    try { MUS.audio(); } catch(e) {}
  });
  // and prove that discriminator is real rather than assumed
  out.glassIsOnlyTimePass = await p.evaluate(() => {
    try {
      const A = window.__SFX_APPROVED || {};
      const bad = [];
      for (const ev in A) {
        if (ev === 'time_pass') continue;
        for (const i of A[ev]) { const c = BOH_SFX.cook(ev,5)[i];
          if (c.mat === 'glass' && c.slide < -3) bad.push(ev+'.'+i); }
      }
      const good = A.time_pass ? A.time_pass.every(i => { const c = BOH_SFX.cook('time_pass',5)[i];
        return c.mat === 'glass' && c.slide < -3; }) : false;
      return { bad, good };
    } catch(e) { return { bad:['ERR'], good:false }; }
  });

  async function strike(h){
    await p.evaluate(() => { window.__rr = []; });
    await p.evaluate(n => window.__strikeHours(n), h);
    await p.waitForTimeout(120);
    return await p.evaluate(() => window.__rr.slice());
  }

  out.h1  = await strike(1);
  out.h4  = await strike(4);
  out.h9  = await strike(9);
  out.h30 = await strike(30);     // longer than a clock face: must cap, not spray

  // THE REAL PATH. The run reports the world clock; a JUMP in it is time passing.
  // Nothing here calls strikeHours: it posts the message the run posts and
  // watches whether the game works it out.
  /* SETTLE ON OUR OWN INPUT BEFORE READING. The run posts its own world clock
     every four seconds once its tab has been opened, and a stray report between
     the two posts below would itself be a jump and would strike. Sister gate
     sfx_wired had exactly this race and blamed the phase setter for it. Waiting
     until the parent's record of the last clock it processed is OUR number
     removes the whole class instead of shortening the window. */
  async function settle(min){
    for (let i = 0; i < 40; i++) {
      const ok = await p.evaluate(m => {
        const st = window.__timePassStats ? window.__timePassStats() : null;
        return !!(st && st.last === m);
      }, min);
      if (ok) return true;
      await p.waitForTimeout(40);
    }
    return false;
  }
  // ASK THE GAME WHAT JUMP IT ACTUALLY COMPUTED, AND RETRY IF IT IS NOT MINE.
  //
  // Settling on our own clock value was not enough. The run reports the world
  // clock every four seconds ON ITS OWN, and once a cold open started booting
  // the run at load, one of those reports began landing BETWEEN the two posts
  // below. That is a real jump -- 12:00 to 07:30 is nineteen hours the long way
  // round -- so it makes real strikes, and a ten-minute snack "struck twelve".
  // Settling could not see it because the final value was still ours.
  //
  // The fix is not a longer wait or a tighter window: it is to ask the game
  // what jump it computed and only accept a measurement where that jump is the
  // one we asked for. Interference is now detected rather than averaged over,
  // and if it cannot get a clean run in five tries it says so instead of
  // reporting somebody else's clock as ours.
  // ASK THE GAME FOR THE ROW THAT IS MINE (8/12). Clearing a counter and
  // posting in one evaluate closed the gap between those two statements, but
  // postMessage is ASYNCHRONOUS: the run's own four-second report can be
  // DELIVERED between the clear and the arrival of this test's message, so its
  // twelve strikes land in the count while the final jump still reads as the
  // test's and the assertion below waves it through. Third time this class was
  // shortened rather than closed, and the flake came back both times.
  //
  // The wire now keeps ONE ROW PER CLOCK MOVE, each owning the strikes it
  // caused. A measurement takes the rows added since it started and asks for
  // the one whose jump is the jump it asked for. Somebody else's clock move is
  // its own row and is simply not this row -- there is no window left to land
  // in. COUNT THE THING, NOT EVERYTHING.
  async function clockOnce(fromMin, toMin){
    await p.evaluate(a => {
      window.postMessage({type:'BOHEMIA_WHERE', inside:false, night:false, min:a, space:'STREET'}, '*');
    }, fromMin);
    if (!await settle(fromMin)) return null;
    const base = await p.evaluate(() => window.__timePassStats().rows);
    await p.evaluate(b => {
      window.postMessage({type:'BOHEMIA_WHERE', inside:false, night:false, min:b, space:'STREET'}, '*');
    }, toMin);
    if (!await settle(toMin)) return null;
    await p.waitForTimeout(160);
    let want = toMin - fromMin; if (want < 0) want += 1440;
    const rows = await p.evaluate(n => window.__timePassLog(n), base);
    const mine = rows.filter(r => r.jump === want);
    if (mine.length !== 1) return null;         // nothing of mine, or ambiguous
    return mine[0].strikes;
  }
  async function clock(fromMin, toMin){
    for (let i = 0; i < 5; i++) {
      const n = await clockOnce(fromMin, toMin);
      if (n !== null) return n;
      await p.waitForTimeout(400);
    }
    return -1;                                   // never got a clean measurement
  }

  out.walk      = await clock(9*60, 9*60 + 3);      // ordinary play: 3 minutes
  out.sleep8    = await clock(22*60, 22*60 + 480);  // 8 hours, no midnight
  out.midnight  = await clock(22*60, 6*60);         // 22:00 -> 06:00 IS eight hours
  out.backwards = await clock(9*60, 9*60);          // no movement at all

  // HIS OWN NUMBERS, 8/7: "Eating a snack might take 10 minutes eating a five
  // star meal might take an hour. I'm going to sleep could take six through 12
  // hours." Those are the acts this sound actually has to serve, so they are
  // the cases the gate runs -- not round numbers I chose. The addendum makes
  // claims about what each one sounds like; these turn the claims into facts.
  out.snack     = await clock(12*60, 12*60 + 10);   // 10 minutes
  out.meal      = await clock(12*60, 13*60);        // one hour
  out.sleepMin  = await clock(22*60, 22*60 + 360);  // 6 hours, his floor
  out.sleepMax  = await clock(20*60, 20*60 + 720);  // 12 hours, his ceiling

  // ================= THE REAL BUTTON, IN THE REAL RUN =====================
  // Everything above drives the clock with a synthetic message. That proves the
  // rule and proves nothing about the GAME: VERIFY ON THE REAL SURFACE (7/18)
  // says a side-door probe is a lie, and the only in-game trigger this sound
  // has today is the SLEEP action. So open the RUN tab, press the actual
  // contextual action button the player presses, and count what reaches the
  // engine. Nothing here posts a message or calls strikeHours.
  /* A TAB THAT IS NOT THERE IS A FAILURE, NOT A SKIP (ONE WORLD TAB, 8/2).
     `if (t) t.click()` walks on when the button is missing and then measures
     whatever panel happened to be open -- the shape that hid three gate failures
     behind a click that never happened when the CITY tab was removed. */
  await p.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]');
    if (!t) throw new Error('no RUN tab to open: the surface this gate measures is not reachable');
    t.click(); });
  await p.waitForTimeout(8000);
  /* __ASK_FOR_THE_RUN_SLICE__ (8/23). The alpha stopped downloading the 17.8 MB run
     slice on boot (8/21) and this gate never got told. Without this the frame
     lookup below falls through to p.frames()[1] -- THE CITY -- and every claim
     about "the run" is then measured against a surface that was never asked to
     carry them. Ask the exported loader by name, which is what it was exported
     for, and wait for the frame to finish rather than guessing a duration. */
  await p.evaluate(() => { if (window.__loadRunSlice) window.__loadRunSlice(); });
  for (let _i = 0; _i < 120 && !p.frames().find(f => f.url().includes('RUN_CURRENT')); _i++)
    await p.waitForTimeout(500);
  { const _rf = p.frames().find(f => f.url().includes('RUN_CURRENT'));
    if (_rf) await _rf.waitForLoadState('load').catch(() => {}); }
  const fr = p.frames().find(f => f.url().includes('RUN_CURRENT')) || p.frames()[1];
  if (fr) {
    const before = await fr.evaluate(() => ({
      label: (document.getElementById('actlbl') || {}).textContent,
      min: window.__RUN_PEOPLE ? window.__RUN_PEOPLE.minute() : -1
    })).catch(() => null);
    out.sleepLabel = before && before.label;
    out.sleepBefore = before && before.min;
    // SAME ROW RULE ON THE REAL PATH. Here the clock move IS the game's own --
    // that is the point of this leg -- so "mine vs theirs" is not the question;
    // the question is WHICH move, and a second report inside the nine-second
    // wait would otherwise be added to the sleep's count.
    const base = await p.evaluate(() => window.__timePassStats().rows);
    await fr.evaluate(() => { const a = document.getElementById('act'); if (a) a.click(); })
            .catch(() => {});
    await p.waitForTimeout(9000);            // the run reports its clock every 4s
    out.sleepAfter = await fr.evaluate(() => window.__RUN_PEOPLE ? window.__RUN_PEOPLE.minute() : -1)
                             .catch(() => -1);
    let want = out.sleepAfter - out.sleepBefore; if (want < 0) want += 1440;
    const rows = await p.evaluate(n => window.__timePassLog(n), base);
    const mine = rows.filter(r => r.jump === want);
    out.sleepStrikes = mine.length === 1 ? mine[0].strikes : -1;
    /* -1 MEANT TWO DIFFERENT THINGS and neither was printed: no row carried the
       jump at all, or several did. Those want opposite fixes, so the report says
       which, and what jumps it DID see. */
    out.sleepRows = mine.length;
    out.sleepJumpWanted = want;
    out.sleepJumpsSeen = rows.map(r => r.jump);
  }

  out.stats = await p.evaluate(() => window.__timePassStats ? window.__timePassStats() : null);
  out.errors = errs.slice(0, 4);
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
    if not line:
        print('=== TIME PASS GATE ===')
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-1200:])
        print(r.stderr[-1200:])
        return 1
    d = json.loads(line[-1])

    print('=== TIME PASS GATE - "have it the amount of time that goes by" ===')
    p = f = 0

    def ok(name, cond):
        nonlocal p, f
        if cond:
            p += 1
        else:
            f += 1
            print('  > FAIL ' + name)

    g = d.get('glassIsOnlyTimePass') or {}
    ok('the strike counter measures TIME_PASS and nothing else: every approved '
       'time_pass sound is glass AND falls in pitch', g.get('good'))
    ok('and NO other approved sound is glass AND falling, so nothing can be '
       'miscounted as a strike (%s)' % (g.get('bad') or 'none'), not g.get('bad'))

    a = d.get('approved') or {}
    ok('his 8/7 thumbs reached the table the GAME reads: time_pass has 5 sounds',
       a.get('time_pass') == [0, 1, 2, 3, 4])
    ok('and EAT finally has one (eat.2)', a.get('eat') == [2])
    # GRAVEYARD IS FINAL: the four he killed must be absent, not present-and-empty
    for dead in ('sleep', 'talk_start', 'go_inside', 'quest_done'):
        ok('GRAVEYARD IS FINAL: %s has no sound at all' % dead, not a.get(dead))

    h1, h4, h9, h30 = (d.get('h1') or []), (d.get('h4') or []), (d.get('h9') or []), (d.get('h30') or [])
    ok('one hour strikes ONCE (%d)' % len(h1), len(h1) == 1)
    ok('four hours strike FOUR times (%d)' % len(h4), len(h4) == 4)
    ok('nine hours strike NINE times (%d)' % len(h9), len(h9) == 9)
    ok('THE COUNT IS THE INFORMATION: four and nine are different (%d vs %d)'
       % (len(h4), len(h9)), len(h4) != len(h9))
    ok('and it CAPS instead of spraying: 30 hours -> 12 strikes (%d)' % len(h30),
       len(h30) == 12)

    # 120 BPM LAW: scheduled ahead in AUDIO time, a beat apart, not fired by a timer.
    sched = [t for t in h4 if t is not None and t >= 0]
    ok('every strike is SCHEDULED on the audio clock, not fired by a timer (%d of %d)'
       % (len(sched), len(h4)), len(sched) == len(h4) and len(h4) > 0)
    if len(sched) >= 2:
        gaps = [round(sched[i + 1] - sched[i], 3) for i in range(len(sched) - 1)]
        ok('they land a BEAT apart, evenly (120 BPM LAW): gaps %s' % gaps,
           all(abs(g - gaps[0]) < 0.01 for g in gaps) and 0.4 < gaps[0] < 0.6)
        ok('and they are strictly in order, none stacked on another',
           all(gaps[i] > 0 for i in range(len(gaps))))
    else:
        ok('there are enough strikes to measure the spacing', False)
        ok('(spacing)', False)

    ok('WALKING AROUND NEVER TRIGGERS IT: a 3-minute tick strikes nothing (%s)'
       % d.get('walk'), d.get('walk') == 0)
    ok('a clock that has not moved strikes nothing (%s)' % d.get('backwards'),
       d.get('backwards') == 0)
    ok('THE REAL PATH WORKS: an 8-hour sleep reported by the run strikes 8 (%s)'
       % d.get('sleep8'), d.get('sleep8') == 8)
    ok('MIDNIGHT IS NOT MINUS SIXTEEN HOURS: 22:00 -> 06:00 strikes 8 (%s)'
       % d.get('midnight'), d.get('midnight') == 8)

    # ---- HIS 8/7 NUMBERS, checked as behaviour -------------------------
    # laws/BOHEMIA_ADDENDUM_EATING_TAKES_TIME_8_7_26.md claims each of these
    # sounds a particular way. A claim in a law file that nothing checks is how
    # this repo has lost things before.
    ok('A SNACK IS SILENT: 10 minutes is not "hours going by" (%s strikes)'
       % d.get('snack'), d.get('snack') == 0)
    ok('A FIVE STAR MEAL STRIKES ONCE: his hour is exactly the floor (%s)'
       % d.get('meal'), d.get('meal') == 1)
    ok('HIS SHORTEST SLEEP STRIKES SIX (%s)' % d.get('sleepMin'),
       d.get('sleepMin') == 6)
    ok('HIS LONGEST SLEEP STRIKES TWELVE, so the cap never truncates a real '
       'night (%s)' % d.get('sleepMax'), d.get('sleepMax') == 12)
    ok('and you can TELL THEM APART: 6 and 12 are different counts',
       d.get('sleepMin') != d.get('sleepMax'))

    # ---- THE REAL BUTTON ------------------------------------------------
    # The one in-game trigger this sound actually has. Everything else in this
    # file is a message the gate invented.
    lab = d.get('sleepLabel') or ''
    ok('the run offers SLEEP as its own contextual action (%r)' % lab,
       'SLEEP' in lab.upper())
    adv = (d.get('sleepAfter') or 0) - (d.get('sleepBefore') or 0)
    if adv < 0:
        adv += 1440
    ok('PRESSING IT MOVES THE WORLD CLOCK by 8 hours (%d minutes)' % adv, adv == 480)
    ok('AND THE GAME STRIKES EIGHT TIMES FOR IT (%s) -- no synthetic message, '
       'the button the player actually presses [%s row(s) carried the %s-minute '
       'jump; jumps seen: %s]' % (d.get('sleepStrikes'), d.get('sleepRows'),
                                  d.get('sleepJumpWanted'), d.get('sleepJumpsSeen')),
       d.get('sleepStrikes') == 8)

    st = d.get('stats') or {}
    ok('the floor is an hour, so ordinary play can never reach it',
       st.get('floorMin') == 60)
    ok('the cap is 12, where a clock face stops', st.get('max') == 12)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Four hours sound like four. Nine sound like nine. You can count it '
              'without being told, which is the whole of what he asked for.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
