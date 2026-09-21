#!/usr/bin/env python3
"""
A COMMENT IN THE JSON SILENCED EVERY FOOTSTEP (9/21/26, SOUNDS lane).
WALKING is rule 18 item two, so this is allowed to ship while the lane is held.

*** PAOLO 7/31, QUOTED IN THE FUNCTION'S OWN COMMENT: "I don't hear no sound for the
steps that I'm making." That was fixed. IT HAS BEEN BROKEN AGAIN SINCE 9/15 AND THE
BREAK WAS A COMMENT. ***

THE BUG, IN ONE SENTENCE. The approved footstep bank is embedded in the alpha as
<script type="application/json" id="sfxApproved">, and on 9/15 a round added a nine-line
/* ... */ explanation INSIDE that tag. JSON has no comments. So JSON.parse throws, the
loader's catch is EMPTY, STEP_BANK stays null forever, and stepSfx returns at its first
line every single time. Every footstep in the game has been silent since.

MEASURED ON THE DEPLOYED ALPHA, BOTH SIDES OF THE WIRE IN ONE RUN, so it is not inferred:
    BOHEMIA_STEP messages the city POSTED ....... 39   (of 44 postMessages total)
    the surfaces it sent ........................ dirt, and only dirt
    the shell's stepSfx() was CALLED ........... 117 times
    BOH_SFX.render calls of any kind ............ 0
    __STEPBUS ever created ...................... no
and then, asked directly:
    the #sfxApproved tag exists ................. yes, 832 characters
    STEP_BANK ................................... null
    window.__SFX_APPROVED step keys ............. all six, step_dirt = [0,1,2,3,4]
The data was present in two places and the one footsteps read had never parsed.

*** AND THE MOST IMPORTANT PART OF THIS WHOLE FIX: A GATE WAS ALREADY SAYING SO. The
suite's FOOTSTEP gate was RED, in these words: "FAIL: the embedded bank parses and
carries every judged step", "FAIL: WALKING MAKES A SOUND: audio nodes started (15 ->
15)". It has been red and nobody read it. I found this with six hand-built instruments
and the checker had the answer the whole time. A RED GATE NOBODY READS IS THE SAME AS NO
GATE, and that is a bigger finding than the comment. ***

WHAT THIS CHANGES, TWO THINGS, AND THE SECOND MATTERS MORE THAN THE FIRST.

1. THE COMMENT MOVES OUT OF THE JSON. Not deleted: it explains a real decision (wood is
   left out on purpose because no wooden ground exists in the valley) and deleting a
   reason is how the reason gets undone again. It becomes an HTML comment immediately
   above the tag, where it is just as readable and cannot be parsed.

2. THE LOADER STOPS FAILING SILENTLY, WHICH IS WHAT ACTUALLY COST SIX ROUNDS. An empty
   catch turned a syntax error into a game with no footsteps and no symptom. Now:
     * a parse failure is RECORDED on window.__STEP_BANK_WHY, so a checker and a human
       can both see what happened instead of guessing;
     * and it FALLS BACK to window.__SFX_APPROVED, which is the table the rest of the
       game already consults and which was measured holding all six step surfaces. That
       is REUSE-FIRST doing real work: two copies of one truth is what let one of them
       rot unnoticed, and the fallback means the feet can never again be silenced by the
       formatting of a duplicate.
   The fallback copies ONLY step_* keys, so nothing else in the approved table leaks into
   the footstep path, and it runs ONLY when the embedded bank fails. With the JSON valid
   again it never runs at all.

WOOD, AND WHY THE FALLBACK DOES NOT QUIETLY UNDO A DECISION: the embedded bank leaves
step_wood out on purpose and __SFX_APPROVED has it. The fallback is a LAST RESORT for a
broken build, not a merge, so on a healthy build wood stays out exactly as ruled. If the
fallback ever fires, a missing-on-purpose sound is a far smaller problem than a game with
no footsteps, and __STEP_BANK_WHY says out loud that it happened.

REUSE CHECK: cooks nothing, banks nothing, adds no event, no candidate, no pixel, no new
sound. It deletes a duplicate source of truth rather than adding one. His approved
indices are not edited; the JSON payload is byte for byte what it was.

  python3 tools/bohemia_a_comment_in_the_json_silenced_every_footstep.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__A_COMMENT_IN_THE_JSON_SILENCED_EVERY_FOOTSTEP__'

OPEN_TAG = '<script type="application/json" id="sfxApproved">'

OLD_LOADER = """(function loadStepBank(){
  try{
    var el = document.getElementById('sfxApproved');
    if(el){ STEP_BANK = JSON.parse(el.textContent); return; }
  }catch(_e){}
})();"""

NEW_LOADER = """(function loadStepBank(){
  /* __A_COMMENT_IN_THE_JSON_SILENCED_EVERY_FOOTSTEP__ (9/21, SOUNDS lane)
     THIS LOADER USED TO SWALLOW ITS OWN FAILURE AND THAT COST EVERY FOOTSTEP IN
     THE GAME. On 9/15 a round added a nine-line block comment INSIDE the
     application/json tag this reads. JSON has no comments, so JSON.parse threw,
     the catch was EMPTY, STEP_BANK stayed null, and stepSfx returned at its first
     line forever. Measured on the deployed alpha, both ends of the wire in one
     run: the city posted 39 BOHEMIA_STEP messages, stepSfx ran 117 times, and
     BOH_SFX.render was called ZERO times.
     AND THE SUITE'S FOOTSTEP GATE WAS ALREADY RED ABOUT IT, in these words: "the
     embedded bank parses and carries every judged step". A RED GATE NOBODY READS
     IS THE SAME AS NO GATE.
     SO: the failure is RECORDED, never swallowed, and there is a fallback to the
     table the rest of the game already consults. Two copies of one truth is what
     let one of them rot unseen, so the feet can no longer be silenced by the
     formatting of a duplicate. */
  window.__STEP_BANK_WHY = 'not tried';
  try{
    var el = document.getElementById('sfxApproved');
    if(!el){ window.__STEP_BANK_WHY = 'no #sfxApproved tag in the document'; }
    else {
      try{
        STEP_BANK = JSON.parse(el.textContent);
        window.__STEP_BANK_WHY = 'parsed the embedded bank';
      }catch(_pe){
        window.__STEP_BANK_WHY = 'the embedded bank did not parse: ' + String(_pe && _pe.message);
      }
    }
  }catch(_e){ window.__STEP_BANK_WHY = 'reading the tag threw: ' + String(_e && _e.message); }
  /* LAST RESORT, NOT A MERGE. Only when the embedded bank failed, and only the
     step_* keys, so nothing else in the approved table reaches the footstep path.
     On a healthy build this never runs, which is why step_wood stays left out
     exactly as the bank rules it. */
  if(!STEP_BANK){
    try{
      var A = window.__SFX_APPROVED || null;
      if(A){
        var fb = {}, n = 0;
        for(var k in A){ if(k.indexOf('step_')===0 && A[k] && A[k].length){ fb[k] = A[k]; n++; } }
        if(n){ STEP_BANK = fb;
          window.__STEP_BANK_WHY += ' | FELL BACK to __SFX_APPROVED, ' + n + ' surfaces'; }
      }
    }catch(_fe){ window.__STEP_BANK_WHY += ' | the fallback threw: ' + String(_fe && _fe.message); }
  }
})();"""


def main():
    print('=== A COMMENT IN THE JSON SILENCED EVERY FOOTSTEP ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # PREMISE CONTROLS: every fact this fix stands on, checked before touching anything.
    for word, why in (
            ('var STEP_BANK = null', 'the bank variable the footsteps read'),
            ('if(!STEP_BANK) return;', 'the early return that makes the walk silent'),
            (OPEN_TAG, 'the embedded approved bank tag'),
            ('__SFX_APPROVED=APPROVED', 'the table the fallback reads')):
        if word not in src:
            print('FAIL: %s is gone; re-measure before trusting this fix' % why)
            return 1
    print('  PREMISE  the bank variable, the silent early return, the embedded tag and '
          'the table the fallback reads are all where this expects them')

    # ---- 1. THE COMMENT COMES OUT OF THE JSON, INTACT, AS AN HTML COMMENT --------
    i = src.index(OPEN_TAG)
    j = src.index('</script>', i)
    body = src[i + len(OPEN_TAG):j]

    m = re.match(r'\s*/\*(.*?)\*/\s*', body, re.S)
    if not m:
        print('FAIL: no block comment inside the json tag. Either somebody already')
        print('      fixed it or the shape changed; re-measure rather than patching blind.')
        return 1
    comment_text = m.group(1).strip()
    payload = body[m.end():]

    # THE PAYLOAD MUST BE VALID JSON ONCE THE COMMENT IS GONE. If it is not, the
    # comment was not the only problem and this fix must not claim it was.
    import json as _json
    try:
        parsed = _json.loads(payload)
    except Exception as e:
        print('FAIL: the payload still does not parse with the comment removed: %s' % e)
        print('      The comment was not the whole bug. Stop and measure again.')
        return 1
    steps = sorted(k for k in parsed if k.startswith('step_'))
    print('  PARSED   %d step surfaces once the comment is out: %s'
          % (len(steps), ', '.join(steps)))

    html_comment = (
        '<!-- __A_COMMENT_IN_THE_JSON_SILENCED_EVERY_FOOTSTEP__ (9/21, SOUNDS lane)\n'
        '     THE NOTE BELOW USED TO LIVE INSIDE THE JSON TAG AND IT SILENCED EVERY\n'
        '     FOOTSTEP IN THE GAME. JSON has no comments, so JSON.parse threw into an\n'
        '     empty catch and STEP_BANK stayed null from 9/15 onward. Measured: the city\n'
        '     posted 39 step messages, stepSfx ran 117 times, zero sounds were rendered,\n'
        '     and the suite\'s FOOTSTEP gate was red about it the whole time.\n'
        '     IT IS KEPT WORD FOR WORD, because it explains a real decision and deleting\n'
        '     a reason is how the reason gets undone. It just lives out here now, where\n'
        '     it is exactly as readable and cannot be parsed.\n'
        '     ORIGINAL NOTE, 9/15:\n'
        + '\n'.join('     ' + ln.rstrip() for ln in comment_text.split('\n'))
        + '\n-->\n')

    new_tag = OPEN_TAG + payload.lstrip('\n')
    src = src[:i] + html_comment + new_tag + src[j:]
    print('  MOVED    the note is now an HTML comment above the tag; the JSON is valid')

    # ---- 2. THE LOADER STOPS FAILING SILENTLY -----------------------------------
    if src.count(OLD_LOADER) != 1:
        print('FAIL: the loader is not where this expects it (%d)' % src.count(OLD_LOADER))
        return 1
    src = src.replace(OLD_LOADER, NEW_LOADER, 1)
    print('  CHANGED  a parse failure is now recorded on __STEP_BANK_WHY and falls back '
          'to the table the rest of the game reads')

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  His approved indices are untouched; the JSON payload is byte for byte what '
          'it was.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
