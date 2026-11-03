#!/usr/bin/env python3
"""
BOHEMIA - THE TOWN YOU DID NOT DEFEND, INTO THE GAME (RADIO 11/3/26, rule 353, ask line 367).

  python3 tools/bohemia_radio_patch.py      (idempotent: the alpha's block is replaced whole every run, the map's two lines once)

WHAT IT DOES, nothing else:
  ALPHA (the demo is cut from it): __THE_LAST_TRANSMISSIONS__, engine/bohemia_radio_heard.js inlined verbatim and its glue:
    one player (window.RADIO) on the effects bus (window.__sfxOut) answering the map's {type:'BOHEMIA_RADIO', ev:'fall'} with
    {type:'BOHEMIA_RADIO_STARTED', id, in_ms} once the recording is booked on the next beat. While he is judging in the VOTE
    tab nothing plays (the 8/16 empty-room rule) and the map's words run alone.
  MAP (slices/BOHEMIA_CITY_WORLD.html): slices/bohemia_radio.js loaded beside the road's events, and ONE line in raidSettle:
    a raid on a town you hold settled 'taken' (nobody came) asks BohemiaRadio.fall(town, by).
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
ALPHA, CITY = P('slices', 'BOHEMIA_ALPHA_0_9.html'), P('slices', 'BOHEMIA_CITY_WORLD.html')
ENGINE = P('engine', 'bohemia_radio_heard.js')
START = '<!-- __THE_LAST_TRANSMISSIONS__ (RADIO 11/3, ask 367) -->\n<script>\n'
END = '</script>\n<!-- /__THE_LAST_TRANSMISSIONS__ -->\n'
ANCHOR = '</script>\n<!-- /__THE_PUNCH_HEARD__ -->\n'

GLUE = r"""/* ---- __THE_LAST_TRANSMISSIONS__: the glue (tools/bohemia_radio_patch.py) ---- */
(function () {
  if (!window.BOH_RADIO) return;
  var R = window.RADIO = BOH_RADIO.make({
    dir: 'radio/',
    out: function () { return window.__sfxOut ? window.__sfxOut() : null; }
  });
  addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_RADIO' || (d.ev !== 'fall' && d.ev !== 'under')) return;
    var src = ev.source;
    try { if (typeof window.__judging === 'function' && window.__judging()) return; } catch (_e) {}   /* he is judging: the words run alone */
    if (d.ev === 'under') { try { R.under(d.id, { from: d.from, dur: d.dur, db: d.db }); } catch (_e) {} return; }   /* rule 371(c) */
    try {
      R.fall(d.id).then(function (res) {
        if (!res || !src) return;
        try { src.postMessage({ type: 'BOHEMIA_RADIO_STARTED', id: d.id, in_ms: res.in_ms }, '*'); } catch (_e) {}
      });
    } catch (_e) {}
  });
})();
"""

CITY_EDITS = [
    ('<script src="bohemia_road_events.js"></script>',
     '<script src="bohemia_road_events.js"></script>  <script src="bohemia_radio.js"></script>',
     'bohemia_radio.js'),
    ("    raidSay(r.outcome === 'taken' ? (r.by + ' took ' + r.base + '. What we built there stands. It pays them now.')\n"
     "                                  : (r.base + ' held. The crew from ' + r.by + ' went home.'));\n",
     "    raidSay(r.outcome === 'taken' ? (r.by + ' took ' + r.base + '. What we built there stands. It pays them now.')\n"
     "                                  : (r.base + ' held. The crew from ' + r.by + ' went home.'));\n"
     "    if(r.outcome === 'taken'){ try{ if(window.BohemiaRadio) BohemiaRadio.fall(r.base, r.by); }catch(_e){} }   /* __THE_LAST_TRANSMISSIONS__ (RADIO 11/3, rule 353): nobody came; the phone hears it fall */\n",
     'BohemiaRadio.fall(r.base'),
]


def die(msg):
    print('THE RADIO PATCH: ' + msg); sys.exit(1)


def apply(path, edits):
    s = open(path, encoding='utf-8').read(); n = 0
    for old, new, mark in edits:
        if mark in s: continue
        if s.count(old) != 1: die('%s: anchor found %d times: %s' % (os.path.basename(path), s.count(old), old[:90]))
        s = s.replace(old, new); n += 1
    open(path, 'w', encoding='utf-8').write(s)
    return n


def main():
    eng = open(ENGINE, encoding='utf-8').read()
    s = open(ALPHA, encoding='utf-8').read()
    block = START + '/* ==== inlined verbatim from engine/bohemia_radio_heard.js (the gate holds it byte for byte) ==== */\n' + eng + GLUE + END
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END); s = s[:a] + block + s[b:]
    else:
        if s.count(ANCHOR) != 1: die('the punch block is not in the alpha once')
        s = s.replace(ANCHOR, ANCHOR + block)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('alpha: the radio block; map %d edits' % apply(CITY, CITY_EDITS))


if __name__ == '__main__':
    main()
