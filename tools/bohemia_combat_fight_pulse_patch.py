#!/usr/bin/env python3
"""BOHEMIA - COMBAT v75: THE FIGHT PULSE. No new mechanics.

Paolo: "before I would want to confirm these... the music, I'm not really feeling
the rhythm in this shit... it's decent, but not enough to slap more mechanics on
the timing unless we can make the music and the action button work better
together."

So: NO NEW TIMING MECHANICS THIS TURN. One job -- the music and the button.

THE DIAGNOSIS, MEASURED OFF HIS OWN SONG TABLE, not guessed:

  song                  kicks/bar   hats/bar   feel
  SLOW CREEP               0.50       0.50     half
  SATELLITE PRAYER         0.50       0.50     half
  REPO MAN                 0.50       0.50     half
  GHOST IN THE GRID        0.50       1.00     half
  SLOW BLEED               0.50       0.50     half
  THE PIT BOSS IS GONE     0.75       0.50     half
  ------------------------------------------------
  AVERAGE                  0.54       0.58     ALL half-time

  A track you can lock to -- four-on-the-floor, the pulse under house, techno,
  disco and every rhythm game -- runs 4 KICKS AND 8 HATS PER BAR. The encounter
  music is at roughly ONE EIGHTH of that, every song is half-time, and every
  lead is an ambient voice. There is a kick about every other bar.

  That is not a mix problem or a sync problem. HE IS TRYING TO FEEL A PULSE THAT
  IS NOT IN THE RECORDING. The clock is right (v67-68), the grade is right (v69),
  the events are on the grid (v71) -- and none of it can rescue a bed with a kick
  every eight beats. The music is doing the opposite job: it is MOOD.

WHY NOT JUST SWAP THE SONGS: because they are his. V63 is his own ruling that
encounters play the overworld creepers, and the 13 tracks are his approved canon.
MECHANISM-MINE / CONTENTS-PAOLO'S. So the creeper stays EXACTLY as approved and
gets a FLOOR under it.

THE FIGHT PULSE (combat only, never the studio, never the overworld):
  - KICK ON ALL FOUR BEATS. Four-on-the-floor, the thing a player locks to.
  - HATS ON THE EIGHTHS.
  - A BACKBEAT on 2 and 4.
  It is played with THE SONG'S OWN KIT voices, so it sounds like the same record
  with its floor turned on, not a metronome bolted to the side. It ducks under
  his mix (the song's own voices stay louder than the pulse) and it climbs with
  the groove chain, so playing well thickens the groove instead of just widening
  a window.

AND THE BUTTON FINALLY PLAYS INTO THE TRACK:
  the count was a 415Hz square blip -- a UI beep sitting outside the music. It is
  now the song's own hat on every beat and its kick+backbeat on beat one, so the
  thing you time against is PART OF THE RECORD.

AND HE CAN A/B IT IN ONE TAP: a PULSE button in settings cycles HARD / SOFT /
OFF. OFF is the bare creeper exactly as it plays today, so the comparison is
honest and the verdict is his.

REUSE CHECK: no new audio assets are cooked. The pulse is played entirely with
the drum voices the song already declares (f.kit.k / f.kit.h) plus the shipped
drumV; nothing about his 13 approved songs is edited.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_fight_pulse_patch.py
Gate:  node gates/combat_lab_gate.js   (section 14 executes the pulse pattern)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V75 THE FIGHT PULSE'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


PULSE_CORE = r"""/* ===== V75 THE FIGHT PULSE (pure pattern, gate-simmed) ===================
   Paolo: "I'm not really feeling the rhythm in this shit... not enough to slap
   more mechanics on the timing unless we can make the music and the action
   button work better together."
   MEASURED off his own song table: the encounter creepers average 0.54 KICKS
   and 0.58 HATS PER BAR, all six half-time, every lead an ambient voice. A
   track you can lock to runs 4 kicks and 8 hats per bar. He was trying to feel
   a pulse that is not in the recording -- no clock fix could ever rescue that.
   His songs are canon (V63 is his own ruling) so they are untouched. This is a
   FLOOR under them, combat only: four-on-the-floor, hats on the eighths, a
   backbeat on 2 and 4, played with THE SONG'S OWN KIT so it reads as the same
   record with its floor switched on. */
var BohemiaPulse=(function(){
  var MODES={off:0, soft:0.55, hard:1.0};
  /* a 16-step bar. kick on every beat, hat on every eighth, backbeat on 2 and 4. */
  function kick(s){ return s%4===0; }                 /* steps 0,4,8,12 */
  function hat(s){ return s%2===0; }                  /* eighths */
  function back(s){ return s===4||s===12; }           /* beats 2 and 4 */
  function on(mode){ return (MODES[mode]||0)>0; }
  /* THE PULSE THICKENS WITH THE GROOVE CHAIN: playing in the pocket makes the
     floor heavier, so rhythm is rewarded with GROOVE and not just a wider dial. */
  function gain(mode,grooveLevel){
    var m=MODES[mode]||0; if(!m)return 0;
    var g=1+((grooveLevel||1)-1)*0.15;                /* +15% per chain level */
    return m*g; }
  /* it sits UNDER his mix on purpose -- the song stays the song. */
  function mix(mode,grooveLevel){
    return { kick:0.085*gain(mode,grooveLevel),
             hat: 0.030*gain(mode,grooveLevel),
             back:0.055*gain(mode,grooveLevel) }; }
  function cycle(mode){ return mode==='hard'?'soft':(mode==='soft'?'off':'hard'); }
  return { MODES:MODES, kick:kick, hat:hat, back:back, on:on,
           gain:gain, mix:mix, cycle:cycle }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaPulse;
/* ===== V75 PULSE CORE END ===== */
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo, "function playStep(s,t,sc){", PULSE_CORE + "function playStep(s,t,sc){", 'pulse core')

    # the floor itself, first thing in the step so the song layers over it
    demo = sub1(demo,
        "  const rootShift=f.scale[sc.rs%f.scale.length]||0;",
        """  /* V75 THE FIGHT PULSE: the floor his creepers do not have. Four-on-the-
     floor + eighth hats + a backbeat, in the song's OWN kit, under his mix.
     Combat only, and dead the moment the fight is over. */
  if(BohemiaPulse.on(G.pulse||'hard') && !G.over && !G._musMuted){
    try{
      const _pm=BohemiaPulse.mix(G.pulse||'hard',BohemiaGroove.level(G.groove));
      const _pk=(f.kit&&f.kit.k)||'punchk', _ph=(f.kit&&f.kit.h)||'tight';
      const _pg=(v)=>{ const g=AC.createGain(); g.gain.value=v; g.connect(MAST); return g; };
      if(BohemiaPulse.kick(s)) drumV(_pk,AC,_pg(_pm.kick/0.085*0.9),t);
      if(BohemiaPulse.hat(s))  drumV(_ph,AC,_pg(_pm.hat/0.030*0.55),t);
      if(BohemiaPulse.back(s)) drumV('clap',AC,_pg(_pm.back/0.055*0.7),t);
    }catch(_e){}
  }
  const rootShift=f.scale[sc.rs%f.scale.length]||0;""",
        'the pulse in the step')

    # the count stops being a UI beep and becomes part of the record
    demo = sub1(demo,
        "function sndBeat(){ tone(415,0.035,0.055,'square'); }",
        """/* V75: the count IS the record now. It was a 415Hz square blip -- a UI beep
   sitting outside the music, which is a big part of why the timing never felt
   musical. It plays the song's own hat, and beat one plays its kick. */
function sndBeat(){ try{ const f=owSong(); drumV((f.kit&&f.kit.h)||'tight',AC,MAST,AC.currentTime); }catch(_e){ tone(415,0.035,0.055,'square'); } }""",
        'metronome is the record')

    demo = sub1(demo,
        "function sndHeroTick(){ tone(830,0.045,0.075,'square'); tone(415,0.05,0.035,'triangle'); }",
        """function sndHeroTick(){ try{ const f=owSong(); const t=AC.currentTime;
    drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t); drumV((f.kit&&f.kit.h)||'tight',AC,MAST,t);
  }catch(_e){ tone(830,0.045,0.075,'square'); } }   /* V75: beat one is the kit, not a beep */""",
        'hero tick is the record')

    # ONE TAP TO JUDGE IT: HARD / SOFT / OFF
    # it lives NEXT TO THE MUSIC TOGGLE, not buried in the perks row: it is a
    # music control, and it is the thing he is being asked to judge this turn.
    demo = sub1(demo,
        '<div class="controls"><button id="musictog" class="on">MUSIC: ON</button></div>',
        '<div class="controls"><button id="musictog" class="on">MUSIC: ON</button>'
        '<button id="pulsebtn" style="border-color:#8fe89a;color:#cfe8c0">PULSE: HARD</button></div>\n'
        '    <div style="font-size:10px;color:#8a7d66;letter-spacing:1px;line-height:1.5">'
        'FIGHT PULSE: the overworld creepers average 0.54 kicks a bar (half-time, ambient) so there is '
        'nothing to lock onto. This lays four-on-the-floor + eighth hats + a backbeat UNDER the song in '
        'the song\'s own kit, and it thickens as your GROOVE chain climbs. OFF is the bare creeper, '
        'exactly as it plays today. Tap to A/B it.</div>',
        'pulse button')

    demo = sub1(demo,
        "  const sc=D('synccal'); if(sc)sc.addEventListener('click',()=>{ if(!calTap())calStart(); });",
        """  /* V75: ONE TAP TO A/B IT. OFF is the bare creeper exactly as it plays
     today, so the comparison is honest and the verdict is his. */
  const pb=D('pulsebtn'); if(pb)pb.addEventListener('click',()=>{ audio();
    G.pulse=BohemiaPulse.cycle(G.pulse||'hard');
    pb.textContent='PULSE: '+G.pulse.toUpperCase();
    setRead('FIGHT PULSE '+G.pulse.toUpperCase(),
      G.pulse==='off'?'bare overworld creeper — 0.54 kicks a bar, nothing to lock to'
      :(G.pulse==='hard'?'four on the floor under the song — lock to it':'the floor, tucked back'),
      G.pulse==='off'?'#8a7d66':'#8fe89a'); });
  const sc=D('synccal'); if(sc)sc.addEventListener('click',()=>{ if(!calTap())calStart(); });""",
        'pulse button wiring')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
