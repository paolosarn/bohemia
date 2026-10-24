#!/usr/bin/env python3
"""
BOHEMIA - THE SQUIGGLE FROM A RECORDING, INTO THE GAME (SOUNDS 10/24/26, row [the squiggle, creepier], rule 135; rule 127:
no card, he hears it the next time somebody talks).

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __THE_SQUIGGLE_RECORDED__, right after the BOHEMIA SQUIGGLE VOICES block: engine/bohemia_voice_recorded.js inlined
     verbatim (the gate holds it byte for byte) and the glue: one player (window.SQUIGGLE) reading slices/voice_heard/, on the
     song's grid, and window.squiggleSay(text, v, AC, dest, when, mood): the recorded voice when its bank is in, else the
     8/11 voice exactly as before (engine/bohemia_voice.js), so nothing goes silent while it loads. The bank (737 KB) loads
     4 s after the music first runs (the door is long past), never before.
  2. Inside speakLine (the game's one voice: who spoke, one at a time, the music ducked): the line is said through
     squiggleSay; a FACE speaker ('face:<look>', posted by engine/bohemia_crew_faces.js when a face talks) gets his own voice
     from his look, cast inside his envelope like the city's people; and a face saying its line again after it finished is
     a person saying it again (he opened the same keeper twice), never dropped as a repaint.
The judge in the MUSIC tab and the cold open call BOH_VOICE.say themselves and are not touched: the judge is the record of
what he voted on 8/11.
Idempotent: the block sits between markers and is replaced on a re-run; every edit checks for its own result.
  python3 tools/bohemia_squiggle_patch.py [--stamp 'BUILD 10/24c - THE SQUIGGLE, CREEPIER']
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_voice_recorded.js')
START = '<!-- __THE_SQUIGGLE_RECORDED__ (SOUNDS 10/24, rule 135) -->\n<script>\n'
END = '</script>\n<!-- /__THE_SQUIGGLE_RECORDED__ -->\n'
ANCHOR = '<!-- /BOHEMIA SQUIGGLE VOICES -->\n'

GLUE = r"""/* ---- __THE_SQUIGGLE_RECORDED__: the glue (tools/bohemia_squiggle_patch.py) ---- */
(function () {
  if (!window.BOH_VOICE_RECORDED) return;
  var S = window.SQUIGGLE = BOH_VOICE_RECORDED.make({
    dir: 'voice_heard/',
    clock: function () { try { return { playing: MUS.playing, nextT: MUS.nextT, step: MUS.step }; } catch (_e) { return null; } }
  });
  /* the recorded voice when its bank is in; until then the voice he passed on 8/11, exactly as it was, never silence */
  window.squiggleSay = function (text, v, AC, dest, when, mood) {
    try { if (S.ready()) { var h = S.say(text, v, AC, dest, when, mood); if (h) return h; } else if (!S.loading && AC) S.load(AC); } catch (_e) {}
    return BOH_VOICE.say(text, v, AC, dest, when, mood);
  };
  /* the bank (737 KB) loads 4 s after the music first runs: the door and its first seconds are long past */
  var since = 0, iv = setInterval(function () {
    try {
      if (S.ready() || S.loading) { clearInterval(iv); return; }
      if (typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running') { since = since || Date.now(); if (Date.now() - since > 4000) { S.load(MUS.AC); clearInterval(iv); } }
    } catch (_e) {}
  }, 1000);
})();
"""

EDITS = [
    # 2a. a face is cast from his envelope by his look, like the city's people
    ("   if(sp.indexOf('city:')===0 && BOH_VOICE.castVoice){\n",
     "   /* __THE_SQUIGGLE_RECORDED__ (SOUNDS 10/24, rule 135): a FACE ('face:<look>', engine/bohemia_crew_faces.js) is one\n"
     "      person, ONE ID ONE WHOLE PERSON, so his look is his seed and his voice is cast from it like the city's people */\n"
     "   if((sp.indexOf('city:')===0 || sp.indexOf('face:')===0) && BOH_VOICE.castVoice){\n"),
    # 2b. said through the recorded squiggle
    ("   TALKING = BOH_VOICE.say(line, v, MUS.AC, d, null);\n",
     "   /* __THE_SQUIGGLE_RECORDED__ (SOUNDS 10/24, rule 135): said Animalese's way, real syllables per letter, his own pitch\n"
     "      and speed, a little wrong; the 8/11 voice until the bank is in */\n"
     "   TALKING = window.squiggleSay ? squiggleSay(line, v, MUS.AC, d, null) : BOH_VOICE.say(line, v, MUS.AC, d, null);\n"),
    # 2c. a face saying it again after it finished is said again
    ("   if(sig===LASTSAID) return null;\n   LASTSAID = sig;\n",
     "   /* __THE_SQUIGGLE_RECORDED__ (SOUNDS 10/24): a FACE calls once per showing, so the same face and line again AFTER the\n"
     "      last one finished is him opening the same keeper twice, a person saying it again, not a repaint */\n"
     "   var faceAgain = sp0.indexOf('face:')===0 && sig===LASTSAID && TALKING && TALKING.start!=null && MUS.AC\n"
     "                   && MUS.AC.currentTime > TALKING.start + (TALKING.tail || TALKING.seconds || 0);\n"
     "   if(sig===LASTSAID && !faceAgain) return null;\n   LASTSAID = sig;\n"),
    ("   var sig = String(speaker)+'|'+line;\n",
     "   var sp0 = String(speaker||''), sig = String(speaker)+'|'+line;\n"),
]


def die(msg):
    print('THE SQUIGGLE PATCH: ' + msg); sys.exit(2)


def main():
    src = open(ALPHA, encoding='utf8').read()
    eng = open(ENGINE, encoding='utf8').read()
    block = START + '/* engine/bohemia_voice_recorded.js, inlined verbatim */\n' + eng + ('' if eng.endswith('\n') else '\n') + GLUE + END
    if START in src:
        a = src.index(START); b = src.index(END, a) + len(END)
        src = src[:a] + block + src[b:]
    else:
        if src.count(ANCHOR) != 1: die('the anchor %r is not in the alpha exactly once' % ANCHOR.strip())
        src = src.replace(ANCHOR, ANCHOR + block)
    for old, new in EDITS:
        if new in src: continue
        if src.count(old) != 1: die('the speakLine line %r is not in the alpha exactly once' % old.strip()[:60])
        src = src.replace(old, new)
    stamp = None
    if '--stamp' in sys.argv:
        stamp = sys.argv[sys.argv.index('--stamp') + 1]
        import re
        n = len(re.findall(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', src))
        if n != 1: die('found %d build stamps' % n)
        src = re.sub(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', lambda m: m.group(1) + stamp + m.group(2), src)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('THE SQUIGGLE PATCH: the recorded voice in the alpha (%d bytes of engine), speakLine routed%s' % (
        len(eng), (', stamp ' + stamp) if stamp else ''))


if __name__ == '__main__':
    main()
