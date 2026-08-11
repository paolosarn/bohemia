#!/usr/bin/env python3
"""V142 NO ACTION MUSIC WITHOUT ACTION.

Paolo 8/11: "The game should always start off with overworld music and not some
bullshit action music that I thought we removed a long time ago."

--------------------------------------------------------------------------
WHAT IS ACTUALLY HAPPENING
--------------------------------------------------------------------------
The combat frame's audio bootstrap starts the FIGHT loop unconditionally:

    function audio(){ if(AC){ ...AC.resume(); startFactionLoop(); return; } ... }

audio() is the generic "wake the sound up" call. It runs on the panel's first
tap, on RUN, on a grenade, on the calibrate tool -- on anything that makes a
noise at all. So the fight's music starts the moment the combat frame is
TOUCHED, whether or not a fight exists. Since 8/8 the frame is also warmed at
app open, which makes it that much easier to hear the fight theme when there is
no fight.

THE OVERWORLD PLAYLIST IS NOT BROKEN AND IS NOT TOUCHED HERE. CITYMUS already
filters strictly to the overworld creepers (OVERWORLD PLAYLIST LAW, 7/7: "the
overworld plays ONLY the creepers; faction/action themes are for scenes,
dialogue, interiors"). The bug is not that the wrong pool got picked. It is that
COMBAT'S OWN LOOP STARTS WHEN THERE IS NO COMBAT, over the top of everything.

--------------------------------------------------------------------------
THE RULE
--------------------------------------------------------------------------
The fight theme plays WHEN THERE IS A FIGHT. Nowhere else.

audio() goes back to doing only its job -- create the context, resume it -- and
the loop is started by the things that mean a fight is happening: the encounter
handoff (afterSetup, which already does it), and the player's explicit MUSIC: ON
toggle, which is him asking for it out loud.

The one case the old line existed for is kept, because it was a real fix: after
the death-stop the loop must be able to restart mid-fight. So audio() still
starts it -- but only when a fight is actually live, which is exactly the
condition that was missing.

STAYING IN MY LANE: this touches the COMBAT frame's own loop only. It changes no
playlist, no category, no track, no verdict weighting and nothing in CITYMUS or
MUS, all of which belong to the music lane.

REUSE CHECK: cooks NO graphic pixels and adds no audio. It reuses the existing
startFactionLoop, G.over and G.e. No bank is opened because nothing is authored.

TASTE CHECK: authors no art. The taste rule is his and it is old: action music
over a game that is not in action is the game lying about what is happening.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V142 NO ACTION MUSIC WITHOUT ACTION'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v142 already in; nothing to do')
        return

    old = """function audio(){ if(AC){ if(AC.state==='suspended')AC.resume(); startFactionLoop(); return; } /* BUG FIX (Paolo 7/3/26): the early return skipped restarting the loop after the death-stop; startFactionLoop self-guards, so always try */ try{AC=new (window.AudioContext||window.webkitAudioContext)(); MAST=AC.createGain(); MAST.gain.value=0.8;"""
    new = """/* ===== V142 NO ACTION MUSIC WITHOUT ACTION ========================
   Paolo 8/11: "The game should always start off with overworld music and not
   some bullshit action music that I thought we removed a long time ago."
   audio() is the generic wake-the-sound-up call -- it runs on the panel's first
   tap, on RUN, on a grenade, on the calibrate tool, on anything that makes a
   noise. It also started the FIGHT LOOP unconditionally, so combat's music
   began the moment the frame was TOUCHED, fight or no fight. Since 8/8 the
   frame is warmed at app open too, which makes it that much easier to hear the
   fight theme when there is no fight.
   THE OVERWORLD PLAYLIST IS FINE AND IS NOT TOUCHED: CITYMUS already filters to
   the creepers only (OVERWORLD PLAYLIST LAW 7/7). The bug was never the pool.
   It was combat's own loop playing over the top of everything, unasked.
   THE FIGHT THEME PLAYS WHEN THERE IS A FIGHT. The 7/3 fix it used to carry is
   KEPT -- after the death-stop the loop must be able to restart mid-fight -- but
   now with the condition that was missing: a fight has to actually be live. */
function fightLive(){ try{ return !G.over && Array.isArray(G.e) && G.e.some(e=>e&&!e.dead); }catch(_e){ return false; } }
function audio(){ if(AC){ if(AC.state==='suspended')AC.resume(); if(fightLive())startFactionLoop(); return; } /* BUG FIX (Paolo 7/3/26): the early return skipped restarting the loop after the death-stop; startFactionLoop self-guards. V142: and it only restarts when a fight is actually happening */ try{AC=new (window.AudioContext||window.webkitAudioContext)(); MAST=AC.createGain(); MAST.gain.value=0.8;"""
    js = subN(js, old, new)

    old = """  MAST.connect(_cmp); _cmp.connect(AC.destination); if(AC.state==='suspended')AC.resume(); startFactionLoop();}catch(e){} }"""
    new = """  MAST.connect(_cmp); _cmp.connect(AC.destination); if(AC.state==='suspended')AC.resume(); if(fightLive())startFactionLoop();}catch(e){} }   /* V142: waking the sound up is not the same as starting a fight */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v142: the fight theme only plays when there is a fight -- %d chars' % len(js))


if __name__ == '__main__':
    main()
