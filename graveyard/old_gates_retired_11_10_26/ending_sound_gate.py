#!/usr/bin/env python3
"""
ENDING SOUND GATE (8/27/26) - the last thing anybody hears, and the thing they
are not allowed to press.

WHY THIS EXISTS. PEOPLE shipped the demo's ending on 8/27, built on Kahneman and
Fredrickson's PEAK-END RULE: what a person keeps of an episode is predicted
almost entirely by the most intense moment and THE LAST ONE. Driven on the real
surface the day it landed, both branches measured:

    heardOnShow []      heardOnTapDeadVerb []

The demo's last moment made no sound, and its centrepiece -- a reply sitting
there greyed and dead, which is the corpus's single most repeated craft device
-- answered a tap with nothing.

THAT SECOND SILENCE IS NOT A MISSING NICETY, IT INVERTS THE DESIGN. The demo
gap list already named it the sharp one: "a refusal with no sound is
indistinguishable from A BROKEN BUTTON. It does not merely lose information, it
teaches the wrong thing." So the last thing a stranger did in this game was
press something that refused them on purpose, and file it as a bug.

AND IT WAS 64 MOMENTS, NOT 5. `@NOVERB` appears 59 times across the quest corpus
and renders as `<div class="noverb">` in every conversation card. The cause was
a too-narrow matcher in this lane's own tap handler -- the FIFTH this month, in
the function whose own comment warns about the fourth.

WHAT THIS GATE HOLDS, all of it driven, none of it read:
  * the ending draws, on the real walked surface, on more than one branch
  * IT MAKES A SOUND WHEN IT LANDS, and the sound is one Paolo approved
  * the withheld verb ANSWERS A TAP, and answers with the refusal sound
  * EXACTLY ONE SOUND PER TAP -- two sounds on one click is a thing he
    complained about on 8/4 and the thing the handler's policy exists to avoid
  * the ordinary controls still behave: a plain button ticks, a way out backs
  * THE CLASS CONTRACT IS REAL: the conversation card genuinely renders
    `class="noverb"`, so the 59 quest verbs go through the mechanism tested here
    rather than through an assumption
  * both sounds are in the live rack and neither is in the graveyard

    python3 gates/ending_sound_gate.py
"""
import json
import os
import re
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
  const b=await chromium.launch({args:['--allow-file-access-from-files',
                                       '--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1500);
  await p.click('#front',{force:true}).catch(()=>{});
  await p.waitForTimeout(11000);
  const out={};
  const cf=p.frames().find(x=>x.url().includes('CITY_WORLD'));
  out.cityFrame=!!cf;
  if(cf) await cf.waitForLoadState('load').catch(()=>{});
  await p.waitForTimeout(2500);

  /* RECORD WHAT THE GAME ACTUALLY ASKS FOR. Wrapping playSFX and STING.play --
     the two real entry points in the shell -- measures the request the game
     makes, not a message claiming it made one. */
  await p.evaluate(()=>{
    window.__HEARD=[];
    const s=window.playSFX;
    window.playSFX=function(ev){ window.__HEARD.push('sfx:'+ev);
      try{ return s.apply(this,arguments); }catch(e){} };
    if(window.STING&&STING.play){ const t=STING.play.bind(STING);
      STING.play=function(f){ window.__HEARD.push('sting:'+f);
        try{ return t(f); }catch(e){} }; }
  });
  const heard=()=>p.evaluate(()=>window.__HEARD.slice());
  const clear=()=>p.evaluate(()=>{ window.__HEARD=[]; });

  /* the recorder is not vacuous */
  await clear();
  await p.evaluate(()=>{ try{ playSFX('ui_tap'); }catch(e){} });
  out.recorderWorks=(await heard()).length===1;

  /* ---- AND THE MUSIC LETS GO WHEN THE DAY DOES ------------------------ */
  /* MEASURED 8/27: kill two people, end the day, and the ladder was STILL at
     level 3 when the ending landed -- a friend's text message after dark scored
     like the firefight you were in an hour ago, at the moment peak-end says is
     half of everything a person keeps.
     THIS RUNS FIRST, BEFORE ANY OTHER showEnding IN THIS FILE, AND THAT IS THE
     WHOLE POINT. The watcher acts on the TRANSITION into the ending, once, the
     same shape as talking and crowd. Its first cut of this gate tested the
     ladder AFTER two branch probes had already shown the ending, so the latch
     had long since fired and the claim went red on a sequence no player will
     ever take. A gate that drives the beats in the wrong order is measuring its
     own script, not the game. */
  await p.evaluate(()=>{ INTENSITY.reset(); INTENSITY.killed(); INTENSITY.killed(); });
  await p.waitForTimeout(900);
  out.beforeEnding = await p.evaluate(()=>({lvl:INTENSITY.level(), kills:INTENSITY.kills}));
  await cf.evaluate(()=>{ try{ OFFER_TAKEN=true; }catch(e){} showEnding(); }).catch(()=>{});
  await p.waitForTimeout(2200);          /* the watcher's OWN timer, not a poke */
  out.endingCalm = await p.evaluate(()=>({lvl:INTENSITY.level(), kills:INTENSITY.kills}));

  /* ---- THE ENDING, ON TWO REAL BRANCHES ------------------------------- */
  out.branches=[];
  for(const taken of [false,true]){
    await clear();
    const r=await cf.evaluate((tk)=>{
      try{
        try{ OFFER_TAKEN=tk; }catch(e){}
        showEnding();
        var nv=document.querySelector('#daycardIn .endnoverb');
        return { drew: document.querySelectorAll('#daycardIn .endsay').length>0,
                 key:(window.__ENDING&&window.__ENDING.key)||null,
                 noverb: nv?nv.textContent:null,
                 says: document.querySelectorAll('#daycardIn .endsay').length };
      }catch(e){ return {err:String(e)}; }
    }, taken).catch(e=>({err:String(e)}));
    await p.waitForTimeout(1300);
    r.onShow=await heard();
    await clear();
    await cf.evaluate(()=>{ var nv=document.querySelector('#daycardIn .endnoverb');
      if(nv) nv.click(); }).catch(()=>{});
    await p.waitForTimeout(800);
    r.onTap=await heard();
    out.branches.push(r);
  }

  /* ---- THE OTHER 59: the conversation card's own .noverb --------------- */
  /* The 59 quest verbs render as <div class="noverb"> (asserted in the SOURCE
     by the python half, so this is not testing a class nobody emits). What is
     under test here is the DELEGATE, which is the part this lane changed and
     the part all 64 share, so it is driven with that exact element. */
  await clear();
  out.convoNoverb = await cf.evaluate(()=>{
    var d=document.createElement('div'); d.className='noverb';
    d.textContent='(a thing you do not say)';
    document.body.appendChild(d); d.click();
    setTimeout(function(){ try{ d.remove(); }catch(e){} },50);
    return true;
  }).catch(()=>false);
  await p.waitForTimeout(700);
  out.convoHeard=await heard();

  /* ---- AND THE ORDINARY CONTROLS STILL BEHAVE ------------------------- */
  await clear();
  await cf.evaluate(()=>{ var b=document.createElement('button');
    b.textContent='DO A THING'; document.body.appendChild(b); b.click();
    setTimeout(function(){ try{ b.remove(); }catch(e){} },50); }).catch(()=>{});
  await p.waitForTimeout(700);
  out.plainButton=await heard();

  await clear();
  await cf.evaluate(()=>{ var b=document.createElement('button');
    b.textContent='CLOSE'; document.body.appendChild(b); b.click();
    setTimeout(function(){ try{ b.remove(); }catch(e){} },50); }).catch(()=>{});
  await p.waitForTimeout(700);
  out.backButton=await heard();

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
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)

    print('=== ENDING SOUND GATE - the last thing anybody hears ===')
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print(r.stdout[-900:])
        print(r.stderr[-900:])
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

    city = open(os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), encoding='utf8').read()
    alpha = open(os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), encoding='utf8').read()

    # ---- THE CLASS CONTRACT, IN THE SOURCE ------------------------------
    # A live probe that appends its own .noverb proves the DELEGATE. It proves
    # nothing about whether the game ever emits that class. Both halves or the
    # claim is decoration.
    ok('the conversation card really renders class="noverb", so the corpus\'s 59 '
       'withheld verbs go through the mechanism this gate drives',
       'class="noverb"' in city)
    ok('and the ending really renders class="endnoverb"', 'class="endnoverb"' in city)

    grave = open(os.path.join(ROOT, 'gates/bohemia_graveyard.txt'), encoding='utf8').read()
    for snd in ('ui_deny', 'phone_buzz'):
        # a family member dying (phone_buzz.0) is not the family dying; only a
        # bare id on a graveyard row retires the moment's sound entirely.
        dead = re.search(r'^\s*(?:n:)?[\'"]?%s[\'"]?\s*\|' % re.escape(snd), grave, re.M)
        ok('%s is a living sound, not a graveyard row' % snd, not dead)
        ok('%s is actually in the shipped rack' % snd, (snd + ':') in alpha)

    ok('the walked city loaded, so this is the real surface', d.get('cityFrame'))
    ok('the recorder hears exactly one sound when one is played, so a silent '
       'result below means silence and not a broken probe', d.get('recorderWorks'))

    bs = d.get('branches') or []
    ok('the ending was driven on more than one branch (%d)' % len(bs), len(bs) == 2)
    seen_keys = set()
    for b in bs:
        k = b.get('key')
        seen_keys.add(k)
        ok('the ending DRAWS on branch %s (%s lines)' % (k, b.get('says')), b.get('drew'))
        ok('AND IT MAKES A SOUND WHEN IT LANDS on branch %s: %s -- peak-end says '
           'this moment is half of what anybody keeps'
           % (k, b.get('onShow')), 'sfx:phone_buzz' in (b.get('onShow') or []))
        ok('the withheld verb exists on branch %s (%r)' % (k, b.get('noverb')), b.get('noverb'))
        ok('AND IT ANSWERS A TAP WITH THE REFUSAL SOUND on branch %s: %s -- silence '
           'here reads as a broken button, which teaches the opposite of what the '
           'beat is for' % (k, b.get('onTap')), b.get('onTap') == ['sfx:ui_deny'])
    ok('the two branches were genuinely different endings (%s)' % sorted(seen_keys),
       len(seen_keys) == 2)

    ok('a CONVERSATION card\'s withheld verb answers too, which is the other 59: %s'
       % d.get('convoHeard'), d.get('convoHeard') == ['sfx:ui_deny'])
    ok('an ordinary button still ticks: %s' % d.get('plainButton'),
       d.get('plainButton') == ['sfx:ui_tap'])
    ok('and a way out still sounds like a way out: %s' % d.get('backButton'),
       d.get('backButton') == ['sfx:ui_back'])

    be, ec = d.get('beforeEnding') or {}, d.get('endingCalm') or {}
    ok('two kills really do put the ladder at the top first, so the next claim is '
       'not passing on a ladder that never moved (level %s, kills %s)'
       % (be.get('lvl'), be.get('kills')), be.get('lvl') == 3)
    ok('AND THE MUSIC LETS GO WHEN THE DAY DOES (level %s, kills %s) -- it dropped '
       'ON THE WATCHER\'S OWN TIMER, not because the gate poked it. A text message '
       'from a friend after dark must not be scored like the firefight you were '
       'in an hour ago' % (ec.get('lvl'), ec.get('kills')), ec.get('lvl') == 1)

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'), not d.get('errors'))

    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  The demo ends on a sound, and the thing you are not allowed to say '
              'now refuses you out loud instead of looking broken.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
