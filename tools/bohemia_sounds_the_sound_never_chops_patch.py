#!/usr/bin/env python3
"""
BOHEMIA - THE SOUND NEVER CHOPS, AND THE SONG IS ABOVE THE FIGHT (SOUNDS 10/25/26, rows [the sound never chops] and
[the fight's music you can hear]; rules 168(b), 175(a)(c), 181(c)).

PAOLO 10/25: 'every time I play the game on my car speakers through Bluetooth it gets all choppy... could you support and
fix that'; playing a fight: 'I only hear the sound effects... I'm not hearing any music'. Rule 181(c): the music's level
against the effects and the chop are FIXES, not new music, and go straight into the game: his approved songs play exactly
the same notes, only heard and steadier. Nothing here touches a song, a voice, a level or the song lock.

MEASURED BEFORE (gates/the_fights_music_you_can_hear_gate.js, the demo, a road fight, AUTO):
  - the game's one AudioContext asked for no latency, the smallest buffer the device allows (computer: 10 ms base);
  - while an effect sounds in the fight the music sat UNDER it: music -32.6 dB, effects -31.3 dB (the median of the 100 ms
    windows an effect sounds in, after his sliders at their defaults);
  - the fight frame made its own second AudioContext on his first finger down;
  - and, read in the transport: a phone that stalls more than a quarter second RE-ANCHORS THE SONG TO ITS FIRST STEP, so
    the song jumped back to its start after every long stall (a chop you hear as the song restarting).

WHAT THIS PATCH PUTS IN THE ALPHA AND THE DEMO (the same edits in both; the demo's next cut carries them from the alpha):
  1. __THE_SOUND_NEVER_CHOPS__ the game's AudioContext asks for latencyHint 'playback', the bigger buffer a car's
     Bluetooth and a busy phone need (175(c)); a browser that refuses the option gets the old context.
  2. __THE_SONG_KEEPS_ITS_PLACE__ a stall re-anchors onto the next beat of the same grid as before, but a song already
     playing keeps its place (the step moves on by the time the stall took, rounded to the beat), instead of starting over;
     a transport that has booked nothing yet (the nine-second parse at boot) still starts at step 0, as before.
  3. __THE_SONG_ABOVE_THE_FIGHT__ in a fight the music is lifted 6 dB and the effects come down 4 dB, over half a second
     when the board comes up (BOHEMIA_COMBAT_STARTED) and back over a bar when it ends (BOHEMIA_FIGHT_OVER): one gain node
     after his music slider, one after the effects bus, so his sliders still move both. MEASURED: the lift alone left the
     song 2.2 dB under the shots on the computer (music -31.4, effects -29.2 while they sound), so both halves.
AND IN THE FIGHT FRAME (COMBAT's file, one marked line, a NOTE on COMBAT's board):
  4. __ONE_AUDIOCONTEXT__ the fight's audio() takes the game's AudioContext from the shell (window.parent.__sfxOut) and
     makes its own only when the fight runs alone (its own page, a gate's bare open), then with playback latency.

Idempotent: every edit checks for its own mark; the lift's block sits between markers and is replaced on a re-run.
  python3 tools/bohemia_sounds_the_sound_never_chops_patch.py
Gate: gates/the_fights_music_you_can_hear_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHELLS = [os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), os.path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html')]
FIGHT = os.path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html')


def die(msg):
    print('THE SOUND NEVER CHOPS PATCH: ' + msg)
    sys.exit(1)


def once(s, old, new, mark, what):
    if mark in s:
        return s
    n = s.count(old)
    if n != 1:
        die('%s: anchor found %d times, wanted 1' % (what, n))
    return s.replace(old, new)


AC_OLD = "try{this.AC=new (window.AudioContext||window.webkitAudioContext)();this.MAST=this.AC.createGain();"
AC_NEW = ("try{this.AC=(function(){ var C=window.AudioContext||window.webkitAudioContext; "
          "try{ return new C({latencyHint:'playback'}); }catch(_e){ return new C(); } })();   "
          "/* __THE_SOUND_NEVER_CHOPS__ (SOUNDS 10/25, rule 175(c)): the playback-sized buffer a car's Bluetooth and a busy "
          "phone need; it was the smallest the device allows (10 ms on a computer) */\n"
          "  this.MAST=this.AC.createGain();")

STALL_OLD = ("MUS.nextT=(_p&&_p>_n+0.02)?_p:(window.__beatNext?window.__beatNext(_n+0.06):_n+0.06); MUS.step=0; MUS.uiBar=0;   "
             "/* __THE_ONE_BEAT__ 10/24 */")
STALL_NEW = ("var _was=MUS.nextT, _st=MUS.step;\n"
             "      MUS.nextT=(_p&&_p>_n+0.02)?_p:(window.__beatNext?window.__beatNext(_n+0.06):_n+0.06); MUS.step=0; MUS.uiBar=0;   "
             "/* __THE_ONE_BEAT__ 10/24 */\n"
             "      /* __THE_SONG_KEEPS_ITS_PLACE__ (SOUNDS 10/25, rule 175(a)): a song already playing does not start over after a\n"
             "         stall; it moves on by the time the stall took, rounded up to the beat, on the same grid. Nothing booked yet\n"
             "         (the boot's long parse) still starts at step 0, as above. */\n"
             "      if(_st>0){ var _lost=Math.max(0,Math.round((MUS.nextT-_was)/MUS.stepDur())); MUS.step=Math.ceil((_st+_lost)/4)*4; MUS.uiBar=Math.floor(MUS.step/16)%64; }")

LIFT_ANCHOR = "/* ===== /__THE_FIGHT_DRIVES_THE_MUSIC__ ===== */"
LIFT_MARK = "__THE_SONG_ABOVE_THE_FIGHT__"
LIFT_BLOCK = r"""
/* ===== __THE_SONG_ABOVE_THE_FIGHT__ (SOUNDS 10/25, row [the fight's music you can hear], rules 168(b), 181(c)) =====
   PAOLO 10/25, playing a fight: 'I only hear the sound effects... I'm not hearing any music'. MEASURED (the demo, a road
   fight, AUTO, his sliders at their defaults): while an effect sounds the music sat UNDER it (computer: music -32.6 dB,
   effects -31.3; the phone at 4x: -34.1 and -34.1); the music lifted 6 dB alone still sat 2.2 dB under. A volume, not new
   music (181(c)): one gain node after his music slider (__MUSVOL) and one after the effects bus (__SFXBUS), both at 1
   everywhere but a fight, where the music rises 6 dB and the effects come down 4 over half a second when the board comes
   up, and both come back over a bar when the fight ends. His sliders still move both; the song's notes are untouched.
   tools/bohemia_sounds_the_sound_never_chops_patch.py, gates/the_fights_music_you_can_hear_gate.js. */
(function(){
  var LIFT = 2.0, TRIM = 0.63, mus = null, fx = null, ctx = null, on = false;
  function between(src, dst, g){ var n = ctx.createGain(); n.gain.value = g; src.disconnect(dst); src.connect(n); n.connect(dst); return n; }
  function ensure(){
    try{
      if(typeof MUS === 'undefined' || !MUS.AC || !window.__MUSVOL || !MUS.OUT) return false;
      if(window.OfflineAudioContext && MUS.AC instanceof window.OfflineAudioContext) return false;
      if(ctx !== MUS.AC){ ctx = MUS.AC; mus = null; fx = null; }
      if(!mus){ mus = between(window.__MUSVOL, MUS.OUT, on ? LIFT : 1); window.__FIGHTLIFT = mus; }
      if(!fx){ try{ window.__sfxOut && window.__sfxOut(); }catch(_e){}
        if(window.__SFXBUS && window.__SFXBUS.context === ctx){ fx = between(window.__SFXBUS, MUS.OUT, on ? TRIM : 1); window.__FIGHTTRIM = fx; } }
      return true;
    }catch(e){ return false; }
  }
  function ramp(n, to, secs){ if(!n) return; var t = ctx.currentTime, g = n.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + secs); }
  function set(up, secs){ on = up; if(!ensure()) return; ramp(mus, up ? LIFT : 1, secs); ramp(fx, up ? TRIM : 1, secs); }
  window.addEventListener('message', function(ev){
    var d = ev && ev.data; if(!d || !d.type) return;
    if(d.type === 'BOHEMIA_COMBAT_STARTED') set(true, 0.5);
    else if(d.type === 'BOHEMIA_FIGHT_OVER' || d.type === 'BOHEMIA_COMBAT_END') set(false, 2.0);
  });
  /* built as soon as the game has its music, so nothing is rewired mid-fight; and a fight frame gone without its end
     never leaves the song lifted */
  setInterval(function(){ ensure(); if(on && !document.getElementById('fightFrame')) set(false, 2.0); }, 1000);
  window.__songAboveTheFight = function(){ return { lift: LIFT, trim: TRIM, on: on, music: mus ? +mus.gain.value.toFixed(3) : null, effects: fx ? +fx.gain.value.toFixed(3) : null }; };
})();
/* ===== /__THE_SONG_ABOVE_THE_FIGHT__ ===== */"""

FIGHT_OLD = "function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (_e) {} } }"
FIGHT_NEW = ("function audio() { if (!AC) { try { AC = (function () { try { const o = window.parent !== window && typeof window.parent.__sfxOut === 'function' ? window.parent.__sfxOut() : null; return o && o.AC ? o.AC : null; } catch (_e) { return null; } })()"
             " || (function () { const C = window.AudioContext || window.webkitAudioContext; try { return new C({ latencyHint: 'playback' }); } catch (_e) { return new C(); } })(); } catch (_e) {} } }"
             "   /* __ONE_AUDIOCONTEXT__ (SOUNDS 10/25, rule 175(c)): the game's one AudioContext from the shell; its own only alone */")


def main():
    for f in SHELLS:
        s = open(f, encoding='utf-8').read()
        s0 = s
        s = once(s, AC_OLD, AC_NEW, '__THE_SOUND_NEVER_CHOPS__', os.path.basename(f) + ' the AudioContext')
        s = once(s, STALL_OLD, STALL_NEW, '__THE_SONG_KEEPS_ITS_PLACE__', os.path.basename(f) + ' the stall')
        lift_end = '/* ===== /__THE_SONG_ABOVE_THE_FIGHT__ ===== */'
        if LIFT_MARK in s:
            a = s.index('\n/* ===== __THE_SONG_ABOVE_THE_FIGHT__')
            b = s.index(lift_end, a) + len(lift_end)
            s = s[:a] + LIFT_BLOCK + s[b:]          # the block is replaced on a re-run
        else:
            if s.count(LIFT_ANCHOR) != 1:
                die(os.path.basename(f) + ' the lift: anchor found %d times' % s.count(LIFT_ANCHOR))
            s = s.replace(LIFT_ANCHOR, LIFT_ANCHOR + LIFT_BLOCK)
        if s != s0:
            open(f, 'w', encoding='utf-8').write(s)
        print('THE SOUND NEVER CHOPS PATCH: ' + os.path.basename(f) + (' patched' if s != s0 else ' already patched'))
    s = open(FIGHT, encoding='utf-8').read()
    s0 = s
    s = once(s, FIGHT_OLD, FIGHT_NEW, '__ONE_AUDIOCONTEXT__', 'BOHEMIA_FIGHT.html audio()')
    if s != s0:
        open(FIGHT, 'w', encoding='utf-8').write(s)
    print('THE SOUND NEVER CHOPS PATCH: BOHEMIA_FIGHT.html' + (' patched' if s != s0 else ' already patched'))


if __name__ == '__main__':
    main()
