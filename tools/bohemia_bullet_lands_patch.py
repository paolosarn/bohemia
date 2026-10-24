#!/usr/bin/env python3
"""
BOHEMIA - THE BULLET LANDS, INTO THE GAME (SOUNDS 10/24/26, row [the bullet lands], rule 120: guns first; rule 127: no card,
he hears it in his next fight; rule 123(a)'s spirit: the thing ships straight into the game).

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __THE_BULLET_LANDS__: engine/bohemia_guns_heard.js and engine/bohemia_bullet_lands.js inlined verbatim (the gate holds
     them byte for byte), and the glue: one player (window.BULLET) on the effects bus, told whose turn it is
     (BOHEMIA_FIGHT_TURN), reading the fight's roster when the board comes up (BOHEMIA_COMBAT_STARTED, through nfFight, the
     same door RUN's code already uses), playing the count-up when UI posts it (BOHEMIA_COUNT_UP) and answering with the plan
     (BOHEMIA_COUNT_UP_PLAN), and loading its two sprites late (25 s after the music first runs, or the moment a fight
     starts, whichever is first: never before the door).
  2. Inside playSFX's own closure, beside __sfxMul: window.__sfxOut (the AudioContext and the effects bus, so the EFFECTS
     slider and his mix hold for every new sound) and window.__sfxCounted (the status line counts what renders).
  3. The one line where the fight's BOHEMIA_SFX reaches playSFX: BULLET hears it first; what it plays it stands the old
     sound down for; everything else (a blade, a fist, a step, a door) goes on to playSFX untouched.

Idempotent: every insert sits between markers and is replaced on a re-run; every edit checks for its own result.
  python3 tools/bohemia_bullet_lands_patch.py
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ENGINES = [os.path.join(ROOT, 'engine', 'bohemia_guns_heard.js'), os.path.join(ROOT, 'engine', 'bohemia_bullet_lands.js')]
START = '<!-- __THE_BULLET_LANDS__ (SOUNDS 10/24, rule 120) -->\n<script>\n'
END = '</script>\n<!-- /__THE_BULLET_LANDS__ -->\n'
ANCHOR = '<!-- BOHEMIA RUN BEAT BRIDGE (7/29/26) -->'

GLUE = r"""/* ---- __THE_BULLET_LANDS__: the glue (tools/bohemia_bullet_lands_patch.py) ---- */
(function () {
  if (!window.BOH_BULLET_LANDS) return;
  var B = window.BULLET = BOH_BULLET_LANDS.make({
    dir: 'fight_heard/', gunsDir: 'vote/guns_heard/',
    out: function () { return window.__sfxOut ? window.__sfxOut() : null; },
    clock: function () { try { return { playing: MUS.playing, nextT: MUS.nextT, step: MUS.step }; } catch (_e) { return null; } }
  });
  function roster(src) {
    try { var F = window.nfFight ? nfFight(src) : null; if (F && F.S && F.S.units) B.readRoster(F.S.units); } catch (_e) {}
  }
  addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || !d.type) return;
    try {
      if (d.type === 'BOHEMIA_FIGHT_TURN') B.turn = d.side === 'them' ? 'them' : 'you';
      else if (d.type === 'BOHEMIA_COMBAT_STARTED') { B.started(); roster(ev.source); }
      else if (d.type === 'BOHEMIA_COUNT_UP') {
        var plan = B.countUp(d.from, d.to); window.__countUpPlan = plan;
        try { (ev.source && ev.source.postMessage ? ev.source : window).postMessage({ type: 'BOHEMIA_COUNT_UP_PLAN', plan: plan }, '*'); } catch (_e) {}
      }
    } catch (_e) {}
  });
  /* the two sprites (1.4 MB) load late: 25 s after the music first runs (the door and its 20 s are long past), or the moment
     a fight comes up, whichever is first. Until they are in, the fight plays exactly what it played before. */
  var since = 0, iv = setInterval(function () {
    try {
      if (B.ready() || B.loading) { clearInterval(iv); return; }
      if (typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running') { since = since || Date.now(); if (Date.now() - since > 25000) { B.load(); clearInterval(iv); } }
    } catch (_e) {}
  }, 1000);
})();
"""

OUT_HOOK_OLD = "  window.__sfxMul = sfxMul;\n"
OUT_HOOK_NEW = ("  window.__sfxMul = sfxMul;\n"
                "  /* __THE_BULLET_LANDS__ (SOUNDS 10/24, rule 120): the fight's real guns and landings play on THIS bus (the EFFECTS\n"
                "     slider and his mix hold for them) and count where they render, like everything here */\n"
                "  window.__sfxOut = function(){ try{ MUS.audio(); var AC=MUS.AC; return AC ? { AC: AC, bus: sfxBus() || MUS.OUT || MUS.MAST || AC.destination } : null; }catch(e){ return null; } };\n"
                "  window.__sfxCounted = function(n){ SFX_COUNT += (n|0); };\n")
RECV_OLD = "      if(d.type==='BOHEMIA_SFX') window.playSFX(d.ev,d.when,d.mul);\n    }catch(e){}\n"
RECV_NEW = ("      if(d.type==='BOHEMIA_SFX'){\n"
            "        /* __THE_BULLET_LANDS__ (SOUNDS 10/24, rule 120): the gun and where its bullet went, from real recordings, heard first;\n"
            "           what it plays stands the old sound down, everything else (a blade, a fist, a step) goes on untouched */\n"
            "        var _bl=null; try{ _bl = window.BULLET ? BULLET.heard(d) : null; }catch(_e){ _bl=null; }\n"
            "        if(_bl==='done'){ if(window.__sfxCounted) __sfxCounted(1); }\n"
            "        else window.playSFX(_bl && _bl.swap ? _bl.swap : d.ev,d.when,d.mul);\n"
            "      }\n    }catch(e){}\n")


def die(msg):
    print('THE BULLET LANDS PATCH: ' + msg)
    sys.exit(1)


def once(s, old, new, done_mark, what):
    if done_mark in s:
        return s
    n = s.count(old)
    if n != 1:
        die('%s: anchor found %d times' % (what, n))
    return s.replace(old, new)


def block():
    parts = []
    for p in ENGINES:
        parts.append('/* ==== inlined verbatim from %s (the gate holds it byte for byte) ==== */\n' % os.path.relpath(p, ROOT))
        parts.append(open(p, encoding='utf-8').read().rstrip() + '\n')
    parts.append(GLUE)
    return ''.join(parts)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    body = block()
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END)
        s = s[:a] + START + body + END + s[b:]
    else:
        if s.count(ANCHOR) != 1: die('the block: anchor found %d times' % s.count(ANCHOR))
        s = s.replace(ANCHOR, START + body + END + ANCHOR)
    s = once(s, OUT_HOOK_OLD, OUT_HOOK_NEW, 'window.__sfxOut = function(){', 'the effects bus hook')
    s = once(s, RECV_OLD, RECV_NEW, "_bl = window.BULLET ? BULLET.heard(d) : null;", 'the fight\'s sound line')
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('THE BULLET LANDS PATCH: the alpha carries the player (%d bytes), the bus hook and the fight\'s sound line' % len(body))


if __name__ == '__main__':
    main()
