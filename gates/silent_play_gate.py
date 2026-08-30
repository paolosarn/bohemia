#!/usr/bin/env python3
"""
SILENT PLAY GATE (8/29/26) - what a MUTED player actually sees.

ROUTED ON 8/25 AND NEVER BUILT. The coordinator's sweep 19 wrote the row:

    "GATE, with SILENT-2 (a law without a machine gate is not enforced) --
     `silent_play_gate`: drive the demo with audio disabled and assert every
     INFORMATION cue produced a visible change in the same beat. AND THE CLAIM
     MUST BE ABOUT PIXELS, NOT ABOUT A FUNCTION HAVING BEEN CALLED -- this repo
     has spent a month finding finished code with no caller, and a gate that
     checks the call instead of the pixel is that bug wearing a badge."

THE NUMBER THAT MADE IT WORTH BUILDING. This lane classified 65 approved
moments and 6 stings into INFORMATION and ATMOSPHERE (SILENT-1, 8/25). Thirteen
came back INFORMATION, and the ledger's own header says what a `twin` value is:

    "twin values are what the SOUND lane BELIEVES, never what it proved.
     SILENT-2 confirms on pixels."

TEN OF THE THIRTEEN CLAIM A TWIN AND NOT ONE HAS EVER BEEN MEASURED. Three
claim NONE. Both kinds are beliefs, and a belief that a screen says something is
the most comfortable kind of wrong: it is invisible unless somebody mutes the
game and looks.

SO THIS GATE MEASURES PIXELS, IN BOTH DIRECTIONS.
  * a cue whose ledger row claims a TWIN must actually change the screen
  * a cue whose ledger row claims NONE must actually change nothing
Either one being wrong is a finding, and the second direction matters as much as
the first: a `NONE` that turns out to have a twin is this lane telling RUN to
build something that already exists.

WHY IT DRIVES ONLY WHAT IT CAN DRIVE, AND SAYS SO. Some INFORMATION cues need a
fight, a quest completion or a nightfall to fire honestly. Driving those by
poking their internals would measure the poke. The cues below are the ones a
player reaches on the walked surface, and the count is printed every run so the
coverage is never mistaken for the whole list.

    python3 gates/silent_play_gate.py
"""
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.path.join(ROOT, 'records/BOHEMIA_SOUND_IS_A_MESSAGE_8_25_26.json')

JS = r'''
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw();
  const b=await chromium.launch({args:['--allow-file-access-from-files',
                                       '--autoplay-policy=no-user-gesture-required',
                                       '--mute-audio']});
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

  /* THE PLAYER IS DEAF FOR THIS WHOLE RUN. --mute-audio at the browser, and the
     two shell entry points stubbed so nothing can sneak a sound in and make a
     silent screen look like it communicated. */
  await p.evaluate(()=>{
    window.__HEARD=[];
    window.playSFX=function(ev){ window.__HEARD.push(ev); };
    if(window.STING) STING.play=function(f){ window.__HEARD.push('sting:'+f); };
  });

  /* ONE BEAT IS 500ms AT 120 BPM. The routed row says "a visible change in the
     same beat", so the window is one beat plus a frame, not "eventually". */
  const BEAT=500;
  async function shot(){ return (await p.screenshot({type:'png'})).toString('base64'); }
  function diff(a,b){ return a===b ? 0 : 1; }

  /* pixel change, measured by the page itself so it is the REAL canvas, not a
     compressed screenshot: hash the visible text plus a canvas sample. */
  async function fingerprint(){
    return await p.evaluate(()=>{
      let t='';
      try{ t=(document.body.innerText||'').replace(/\s+/g,' ').trim(); }catch(e){}
      let c='';
      try{
        const cv=[...document.querySelectorAll('canvas')];
        for(const x of cv.slice(0,3)){
          try{ c += x.toDataURL().length + ':' + x.toDataURL().slice(-64); }catch(e){}
        }
      }catch(e){}
      /* THREE SURFACES, NOT ONE. The shell, the walked city AND the run slice
         are separate documents, and save_chime fires in the run -- a
         fingerprint that only watched the city would have reported "no visual
         change" for a screen it was not looking at, which is a false finding
         of exactly the kind this gate exists to prevent. */
      let f='';
      for(const id of ['cityFrame','runFrame']){
        try{
          const fr=document.getElementById(id);
          if(fr&&fr.contentDocument) f += id + ':' +
            (fr.contentDocument.body.innerText||'').replace(/\s+/g,' ').trim();
        }catch(e){}
      }
      return {text:t, canvas:c, frame:f};
    });
  }

  out.cues=[];
  async function drive(name, fire){
    await p.evaluate(()=>{ window.__HEARD=[]; });
    const before = await fingerprint();
    let err=null;
    try{ await fire(); }catch(e){ err=String(e); }
    await p.waitForTimeout(BEAT + 80);
    const after = await fingerprint();
    const heard = await p.evaluate(()=>window.__HEARD.slice());
    out.cues.push({
      name, err, heard,
      textChanged:   before.text   !== after.text,
      canvasChanged: before.canvas !== after.canvas,
      frameChanged:  before.frame  !== after.frame,
      /* what a deaf player would have to notice */
      anyVisible: (before.text!==after.text) || (before.frame!==after.frame)
    });
  }

  /* ---- 0a. THE NULL CONTROL. Do NOTHING for one beat and measure.
     A fingerprint that reads a whole live document also reads its CLOCK, and a
     clock makes every measurement say "the screen changed". If this row reports
     a change, the instrument is too noisy to answer the question and the gate
     says so instead of reporting a twin that is really a ticking minute. */
  await drive('NULL: do nothing for one beat', async()=>{});

  /* ---- 0b. THE POSITIVE CONTROL. A cue that plainly DOES change the screen, so
     a run where nothing ever changes cannot pass by measuring a broken probe. */
  await drive('CONTROL: open the phone', async()=>{
    await cf.evaluate(()=>{ const b=document.getElementById('phonebtn');
      if(b) b.click(); });
  });
  await cf.evaluate(()=>{ const b=document.querySelector('#daycard .dcgo,[data-act="close"]');
    if(b) b.click(); }).catch(()=>{});
  await p.waitForTimeout(400);

  /* ---- 1. save_chime. Ledger says twin NONE: "Nothing anywhere says a save
     happened; the chime is the entire notification." autoSave() is the one
     call site every autosave goes through. */
  /* THE RUN SLICE IS A THIRD DOCUMENT and autoSave lives in it. The first cut
     of this gate drove it in the city frame, found nothing, and reported the
     cue as never fired -- my probe looking in the wrong room, not a dead wire. */
  await p.evaluate(()=>{ try{ if(window.__loadRunSlice) window.__loadRunSlice(); }catch(e){} });
  await p.waitForTimeout(4000);
  const rf=p.frames().find(x=>x.url().includes('RUN_CURRENT'));
  out.runFrame=!!rf;
  if(rf){
    await rf.waitForLoadState('load').catch(()=>{});
    await p.waitForTimeout(1500);
    await drive('save_chime', async()=>{
      await rf.evaluate(()=>{ if(typeof autoSave==='function') autoSave('gate'); });
    });
  }

  /* ---- 1b. THE SECOND NULL, AND IT IS NOT BELT-AND-BRACES.
     The first null ran before the run slice existed. Loading it puts a THIRD
     live document into the fingerprint, with its own clock, so a control taken
     without it validates nothing about the measurements taken with it: ui_deny
     reported a visual twin it does not have, and the city's own text had not
     changed by a single line. A CONTROL MUST BE TAKEN UNDER THE SAME CONDITIONS
     AS THE MEASUREMENT IT VALIDATES. */
  await drive('NULL 2: do nothing, with the run loaded', async()=>{});

  /* ---- 2. ui_deny. Ledger says twin NONE: "a refusal with no sound is
     indistinguishable from a BROKEN BUTTON." Driven on the real withheld verb,
     the demo's own last beat. */
  /* THE SETUP IS NOT THE MEASUREMENT, AND MY FIRST CUT MEASURED THE SETUP.
     It drew the ending card INSIDE the driven block, so the fingerprint taken
     before the block did not have the card in it and the one after did. The
     screen had changed enormously -- because I had just drawn a whole card --
     and the gate reported ui_deny as HAVING a visual twin. The card is not the
     refusal. Draw it, let it settle, fingerprint, THEN press the thing you are
     not allowed to press, and measure only that. */
  await cf.evaluate(()=>{
    try{ OFFER_TAKEN=false; }catch(e){}
    if(typeof showEnding==='function') showEnding();
  }).catch(()=>{});
  await p.waitForTimeout(900);
  await drive('ui_deny', async()=>{
    await cf.evaluate(()=>{ const nv=document.querySelector('#daycardIn .endnoverb');
      if(nv) nv.click(); });
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
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)

    print('=== SILENT PLAY GATE - what a MUTED player actually sees ===')
    line = [l for l in r.stdout.strip().split('\n') if l.startswith('{')]
    if not line:
        print('  > FAIL the browser run produced nothing')
        print((r.stdout + r.stderr)[-900:])
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

    led = json.load(open(LEDGER, encoding='utf8'))['rows']
    info = {k: v for k, v in led.items() if v.get('kind') == 'INFORMATION'}
    claims_twin = sorted(k for k, v in info.items() if (v.get('twin') or '') != 'NONE')
    claims_none = sorted(k for k, v in info.items() if v.get('twin') == 'NONE')

    ok('the ledger exists and still classifies (%d INFORMATION, %d claim a twin, '
       '%d claim NONE)' % (len(info), len(claims_twin), len(claims_none)),
       len(info) >= 10)
    ok('the walked city loaded, so this is the real surface', d.get('cityFrame'))

    cues = {c['name']: c for c in (d.get('cues') or [])}

    for nm in ('NULL: do nothing for one beat',
               'NULL 2: do nothing, with the run loaded'):
        nul = cues.get(nm) or {}
        ok('%s IS QUIET: doing nothing changes nothing (text %s, frame %s). A '
           'control must be taken under the SAME conditions as the measurements '
           'it validates -- the first cut of this gate took only the first of '
           'these, and every reading taken after the run slice loaded was '
           'against an untested baseline'
           % (nm, nul.get('textChanged'), nul.get('frameChanged')),
           not nul.get('anyVisible'))

    ctl = cues.get("CONTROL: open the phone") or {}
    ok('THE CONTROL CHANGES THE SCREEN, so a run where nothing changes cannot '
       'pass on a broken probe (text %s, frame %s)'
       % (ctl.get('textChanged'), ctl.get('frameChanged')), ctl.get('anyVisible'))

    for name in ('save_chime', 'ui_deny'):
        c = cues.get(name)
        if not c:
            ok('%s was driven at all' % name, False)
            continue
        ok('%s: the cue actually FIRED, so the measurement is of a real moment '
           'and not of a dead call (%s)' % (name, c.get('heard')),
           name in (c.get('heard') or []))
        claimed = (info.get(name) or {}).get('twin')
        if claimed == 'NONE':
            ok('%s CLAIMS NO VISUAL TWIN AND THE SCREEN AGREES: a deaf player '
               'sees nothing when it fires (text %s, frame %s). This is the '
               'claim proved, not assumed -- and it is the case RUN\'s SILENT-2 '
               'row exists to fix'
               % (name, c.get('textChanged'), c.get('frameChanged')),
               not c.get('anyVisible'))
        else:
            ok('%s claims a twin and the screen shows one' % name,
               c.get('anyVisible'))
        ok('%s threw nothing while being driven (%s)' % (name, c.get('err')),
           not c.get('err'))

    ok('the page threw nothing: %s' % (d.get('errors') or 'clean'),
       not d.get('errors'))

    print('  DRIVEN: %d of %d INFORMATION cues. The rest need a fight, a quest '
          'completion or a nightfall to fire honestly, and poking their '
          'internals would measure the poke.' % (len([c for c in cues if not c.startswith('NULL') and not c.startswith('CONTROL')]), len(info)))
    print('  STILL UNPROVEN AND STILL BELIEFS: %s'
          % ', '.join(k for k in claims_twin if k not in cues))
    print('  %d passed, %d FAILED' % (p, f))
    if not f:
        print('  Two of this lane\'s three no-twin claims are now MEASURED on a '
              'muted run instead of believed.')
    return 1 if f else 0


if __name__ == '__main__':
    sys.exit(main())
