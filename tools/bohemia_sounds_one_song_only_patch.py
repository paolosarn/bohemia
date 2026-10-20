#!/usr/bin/env python3
"""
BOHEMIA - ONE SONG ONLY, AND THE VOLUME SLIDERS (SOUNDS 10/20/26, row [one song only], rule 122).

PAOLO 10/20, LOCKED: 'all the music sucks except for the new one you just made, the overworld night track, so I
shouldn't be hearing anything other than that ever; if I hear any other song ever again I'm shutting this whole
shit down'; 'And ALL OF THE OVERWORLD NIGHT TRACKS TOO'; 'It's in the music tab!!!'; 'the background ambience, the
radio, has to go way down; anything volume wise, I should be seeing a slider for it in the settings.'

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __ONE_SONG_ONLY__: the song fence (tools/bohemia_sounds_one_song_only_block.js, inlined verbatim). The street,
     the opening, the room and the fight choose only from the MUSIC tab's OVERWORLD NIGHT category, read at play
     time; MUS.playStep refuses any other song; REPO MAN plays as THE MACHINE PARTY (his YES, take A).
  2. The fight's faction pick goes through the fence (a faction song is outside his set: the fight keeps the night
     song it walked in on).
  3. The street taking the music back keeps the night song that is already playing (no cut from one night song to
     another sixteen seconds after the opening).
  4. __THE_SLIDERS__: MUSIC, AMBIENCE and EFFECTS sliders in the settings card, saved in the mix the MUSIC tab's
     knobs already use (bohemia_mix), applied at once; an AMBIENCE bus the beds, the radio and the hum go through,
     far down by default.

Idempotent: every insert sits between markers and is replaced on a re-run; every edit checks for its own result.
  python3 tools/bohemia_sounds_one_song_only_patch.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
BLOCK = os.path.join(ROOT, 'tools', 'bohemia_sounds_one_song_only_block.js')


def die(msg):
    print('ONE SONG ONLY PATCH: ' + msg)
    sys.exit(1)


def once(s, old, new, done_mark, what):
    """replace old with new exactly once, unless done_mark is already in s"""
    if done_mark in s:
        return s
    n = s.count(old)
    if n != 1:
        die('%s: anchor found %d times' % (what, n))
    return s.replace(old, new)


def between(s, start, end, body, anchor, what):
    """put start+body+end in s: replace what is between the markers, or insert before anchor"""
    block = start + body + end
    if start in s:
        a = s.index(start)
        b = s.index(end, a) + len(end)
        return s[:a] + block + s[b:]
    if s.count(anchor) != 1:
        die('%s: anchor found %d times' % (what, s.count(anchor)))
    return s.replace(anchor, block + '\n' + anchor)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    block = open(BLOCK, encoding='utf-8').read().rstrip() + '\n'

    # 1. the fence, its own script, right after the engine's script closes
    s = between(s, '<!-- __ONE_SONG_ONLY__ (SOUNDS 10/20, rule 122) -->\n<script>\n', '</script>\n<!-- /__ONE_SONG_ONLY__ -->\n',
                block, '<!-- BOHEMIA RUN BEAT BRIDGE (7/29/26) -->', 'the fence')

    # 2. the fight's faction pick
    s = once(s,
             "      MUS.cur=(window.FIGHTMUS?FIGHTMUS.realFaction(ev.data.bohemiaFactionPicked)\n"
             "                              :ev.data.bohemiaFactionPicked);\n",
             "      var _fi=(window.FIGHTMUS?FIGHTMUS.realFaction(ev.data.bohemiaFactionPicked)\n"
             "                              :ev.data.bohemiaFactionPicked);\n"
             "      /* __ONE_SONG_ONLY__ (SOUNDS 10/20, rule 122): a faction song is outside his set, so the fight keeps\n"
             "         the night song it walked in on (or takes one from the set); a faction he tags OVERWORLD NIGHT plays. */\n"
             "      if(window.SONGFENCE&&!SONGFENCE.allowed(_fi,MUS.curSlot||1)) SONGFENCE.fight(); else MUS.cur=_fi;\n",
             'SONGFENCE.fight(); else MUS.cur=_fi;', 'the fight pick')

    # 3. the street keeps the night song that is playing when it takes the music back
    s = once(s,
             "  startShuffle(){ this.on=true; try{MUS.build();}catch(e){} this.play();",
             "  startShuffle(){ this.on=true; try{MUS.build();}catch(e){} if(!(window.SONGFENCE&&SONGFENCE.keep()))this.play();   /* __ONE_SONG_ONLY__ 10/20: a night song already playing is kept */",
             'if(!(window.SONGFENCE&&SONGFENCE.keep()))this.play();', 'the street keeps')

    # 4. the old fight's own loop (the workshop's COMBAT tab) plays faction songs: silent while the fence stands
    s = once(s,
             "    if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaMusicMute:!_combatOwnsIt},'*');}catch(e){} }",
             "    if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaMusicMute:(window.SONGFENCE?true:!_combatOwnsIt)},'*');}catch(e){} }   /* __ONE_SONG_ONLY__ 10/20: its loop is faction songs */",
             "bohemiaMusicMute:(window.SONGFENCE?true:!_combatOwnsIt)", 'the old fight mute')

    # 5. THE AMBIENCE KNOB in the mix the MUSIC tab's knobs and the settings card share (bohemia_mix)
    s = once(s, " var MIX_DEFAULTS={master:1, music:0.75, sfx:1};",
             " var MIX_DEFAULTS={master:1, music:0.75, sfx:1, amb:0.4};   /* __THE_SLIDERS__ 10/20 (rule 122b): the ambience starts far down, 0.4 is -20 dB */",
             "sfx:1, amb:0.4};", 'mix defaults')
    s = once(s, " var MIX={master:MIX_DEFAULTS.master, music:MIX_DEFAULTS.music, sfx:MIX_DEFAULTS.sfx};",
             " var MIX={master:MIX_DEFAULTS.master, music:MIX_DEFAULTS.music, sfx:MIX_DEFAULTS.sfx, amb:MIX_DEFAULTS.amb};",
             "sfx:MIX_DEFAULTS.sfx, amb:MIX_DEFAULTS.amb};", 'mix state')
    s = once(s, " window.__applyMix=apply;\n window.getMix=function(){ return {master:MIX.master, music:MIX.music, sfx:MIX.sfx}; };",
             " window.__applyMix=apply;\n window.getMix=function(){ return {master:MIX.master, music:MIX.music, sfx:MIX.sfx, amb:MIX.amb}; };",
             "sfx:MIX.sfx, amb:MIX.amb}; };", 'getMix')
    s = once(s, "  try{ if(window.setSFXVolume) window.setSFXVolume(taper(MIX.sfx));\n       else if(window.__SFXBUS) window.__SFXBUS.gain.value=taper(MIX.sfx); }catch(e){}\n }",
             "  try{ if(window.setSFXVolume) window.setSFXVolume(taper(MIX.sfx));\n       else if(window.__SFXBUS) window.__SFXBUS.gain.value=taper(MIX.sfx); }catch(e){}\n"
             "  try{ if(AMBBUS) AMBBUS.gain.value=taper(MIX.amb); }catch(e){}\n }\n"
             " /* __THE_SLIDERS__ (SOUNDS 10/20, rule 122: 'the background ambience, the radio, has to go way down; anything\n"
             "    volume wise, I should be seeing a slider for it in the settings'). THE AMBIENCE BUS: the beds, the room's hum,\n"
             "    the valley's radio, the map's desert, the title's wind and the heartbeat before the song meet here and nowhere\n"
             "    else, then the output bus, beside the effects and never through them, so the EFFECTS slider moves a shot and\n"
             "    the AMBIENCE slider moves the bed. Built on first use in the live context; an offline render gets none. */\n"
             " var AMBBUS=null;\n"
             " window.__ambBus=function(){\n"
             "  try{\n"
             "   if(typeof MUS==='undefined' || !MUS.AC) return null;\n"
             "   if(window.OfflineAudioContext && MUS.AC instanceof window.OfflineAudioContext) return null;\n"
             "   if(AMBBUS && AMBBUS.context===MUS.AC) return AMBBUS;\n"
             "   AMBBUS=MUS.AC.createGain(); AMBBUS.gain.value=taper(MIX.amb);\n"
             "   AMBBUS.connect(MUS.OUT||MUS.AC.destination); window.__AMBBUS=AMBBUS;\n"
             "   return AMBBUS;\n"
             "  }catch(e){ return null; }\n"
             " };",
             "window.__ambBus=function(){", 'the ambience bus')
    s = once(s, " window.setEffectsVolume=function(v){ MIX.sfx  =Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.sfx; };",
             " window.setEffectsVolume=function(v){ MIX.sfx  =Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.sfx; };\n"
             " window.setAmbienceVolume=function(v){ MIX.amb=Math.max(0,Math.min(1,+v||0)); save(); apply(); return MIX.amb; };",
             "window.setAmbienceVolume=function", 'setAmbienceVolume')
    s = once(s, "  w.appendChild(row('music','MUSIC'));\n",
             "  w.appendChild(row('music','MUSIC'));\n  w.appendChild(row('amb','AMBIENCE'));   /* __THE_SLIDERS__ 10/20 */\n",
             "row('amb','AMBIENCE')", 'the MUSIC tab knob')

    # 6. every bed, the hum and the radio onto the ambience bus (each line is its own anchor, with the comment above it).
    #    NOT the heartbeat before the song (PULSE): it is the 120 BPM clock that hands the beat to the song, at its
    #    own measured level under a footstep (gates/beat_first_gate.py), not a bed; it stays on the effects bus.
    AMB = "(window.__ambBus&&window.__ambBus())||"
    for what, old in [
        ('the room', "           because the studio did. Same reasoning as the heartbeat above. */\n        this.bus.connect(sfxBus() || MUS.OUT"),
        ('the air and the radio', "             to the MUSIC master, because MUS.stop() ducks it to zero. */\n          this.bus.connect(sfxBus()||MUS.OUT"),
        ('the map desert', "      var out=sfxBus()||MUS.OUT||MUS.MAST||AC.destination, id=this.BED;"),
    ]:
        new = old.replace("connect(sfxBus()", "connect(" + AMB + "sfxBus()").replace("var out=sfxBus()", "var out=" + AMB + "sfxBus()")
        s = once(s, old, new, new, what)
    # the title's wind: its line is not unique on its own, so the anchor carries the line above it
    old = "      var self=this; if(this.on) return;\n      if(typeof MUS==='undefined') return; try{ MUS.audio(); }catch(e){} var AC=MUS.AC; if(!AC) return;\n      var out=sfxBus()||MUS.OUT||MUS.MAST||AC.destination;\n"
    new = old.replace("var out=sfxBus()", "var out=" + AMB + "sfxBus()")
    s = once(s, old, new, new, 'the title wind')

    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('ONE SONG ONLY PATCH: done')


if __name__ == '__main__':
    main()
