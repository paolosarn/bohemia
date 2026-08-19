#!/usr/bin/env python3
"""V166 THE DIAL STOPS TINKLING. Paolo 8/19, a ruling, fixed at the root.

  "when i leave or enter the deadshot dial theres like a glass bottle noise i
   hate that"

NOT GUESSED. HOOKED AND MEASURED. Every voice in the combat frame -- sfxAsk,
tone, sndShot, sndShot2, sndHit, sndKill, sndMiss, sndReturn, sndVital,
sndMissImpact, audio -- was wrapped, the dial was opened through the shipped
enterAim, and the log printed:

    ON ENTER   : ["sfxAsk(casing)"]
    after 700ms: ["tone(680,0.05)", "tone(340,0.085)"]
    ON LEAVE   : []

TWO SOUNDS, TWO SEPARATE BUGS, and he is hearing both as one tinkle.

--------------------------------------------------------------------------
BUG ONE: THE BRASS COMES OUT BEFORE THE GUN GOES OFF
--------------------------------------------------------------------------
`sfxAsk('casing')` sat inside enterAim. Its OWN COMMENT says "it rides the
ROUND, not the trigger, so a dry pull throws no brass" -- and opening the dial is
not the trigger either, it is RAISING THE GUN. The shot happens later, when he
hits the green. So a casing tinked off the concrete the instant the dial opened,
before a single round had left the barrel.

It rides sndShot now, which is the ONE DOOR every shot in the file goes through
(four call sites: the volley, the chain, the killshot and the parent bridge), and
it sits ABOVE the sfxAsk('shot') early return so it fires whether or not the bank
has a sample for the bang.

--------------------------------------------------------------------------
BUG TWO: THE LAST BARE UI BEEP IN THE FILE, AND V75 ALREADY NAMED THE DISEASE
--------------------------------------------------------------------------
    function sndAccent(){ tone(680,0.05,0.05,'triangle'); tone(340,0.085,0.035,'sine'); }

Two PURE tones, no noise floor, no body, a high one and its octave below, both
decaying in under a tenth of a second. That is a glass ping by construction. It
fires every time the kill window comes round on the dial, which is exactly "when
I enter the deadshot dial".

*** AND THE FIX WAS ALREADY WRITTEN IN THIS FILE, THREE LINES ABOVE IT. *** V75
says of sndBeat: "It was a 415Hz square blip -- A UI BEEP SITTING OUTSIDE THE
MUSIC, which is a big part of why the timing never felt musical. It plays the
song's own hat, and beat one plays its kick." V75 fixed sndBeat and sndHeroTick
and LEFT sndAccent, the third member of the same trio, as the last naked
oscillator in the combat loop. Same disease, same cure, one missed.

So the three dial voices are now all the song's own, and all distinguishable:

    beat tick    the song's HAT              (V75)
    beat one     the song's KICK + HAT       (V75)
    kill window  the song's KICK, alone      (V166)

Nothing is invented: kick and hat are the only two voices a song carries
(POOL_FIELDS), sndHeroTick already stacks them, and this uses the same drumV call
with the same arguments. The fallback stops being glassy too -- if there is no
song it drops to one low square instead of a triangle-and-sine chime.

*** AND IF HE SAYS IT AGAIN, IT GOES SILENT. *** STOP PRODUCING: a second
rejection ends the feature. The accent has a JOB -- it is how you hear the kill
window coming without staring at the dial -- and the VISUAL pulse (_accPulse) is
set outside the sound call, so silencing it costs no information on screen. That
is the next move if this is still wrong, not a third sound.

REUSE CHECK: cooks NO graphic pixels and authors NO new voice. It calls drumV
with the song's own kit exactly as sndBeat and sndHeroTick already do, and moves
one existing sfx cue from the wrong event to the right one. No bank opened.

TASTE CHECK: authors no art. The taste rule is his sentence and V75's: a bare
oscillator sitting outside the music is a UI beep, and this game does not have
UI beeps, it has a band.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V166 THE DIAL STOPS TINKLING'
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
        print('v166 already in; nothing to do')
        return

    # ---- 1. the accent joins the band -------------------------------
    old = """function sndAccent(){ tone(680,0.05,0.05,'triangle'); tone(340,0.085,0.035,'sine'); } // kill-window cue"""
    new = """/* ===== V166 THE DIAL STOPS TINKLING ==============================
   Paolo 8/19: "when i leave or enter the deadshot dial theres like a glass
   bottle noise i hate that."
   HOOKED AND MEASURED, not guessed: opening the dial logged sfxAsk(casing) and
   then tone(680)+tone(340). This was the second half. Two PURE tones, a high one
   and its octave below, no noise floor and no body, both gone inside a tenth of
   a second -- a glass ping by construction.
   *** AND THE CURE IS WRITTEN THREE LINES ABOVE, BY V75, ABOUT ITS OWN TWIN: ***
   "it was a 415Hz square blip -- A UI BEEP SITTING OUTSIDE THE MUSIC, which is a
   big part of why the timing never felt musical." V75 fixed sndBeat and
   sndHeroTick to play the song's own kit and left THIS one, the third of the
   trio, as the last naked oscillator in the combat loop.
   All three are the band now, and all three are still tellable apart:
       beat tick    the song's HAT          beat one   its KICK + HAT
       kill window  its KICK, alone
   IF HE SAYS IT AGAIN IT GOES SILENT, not a third sound. STOP PRODUCING says a
   second rejection ends it, and the VISUAL pulse is set outside this call, so
   silence costs nothing on screen. */
function sndAccent(){ try{ const f=owSong(); drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,AC.currentTime); }
  catch(_e){ tone(190,0.06,0.05,'square'); } }   /* even the fallback is low and dry now, never a chime */"""
    js = subN(js, old, new)

    # ---- 2. the brass rides the shot, not the raise -------------------
    old = """  spendRound();   /* V157: one trigger pull, one round -- spent only once the shot is real */
  try{ sfxAsk('casing'); }catch(_e){}   /* HIS casing.0. It rides the ROUND, not the trigger, so a dry
        pull throws no brass. Its own hits land at 0.25-0.44 of a
        beat, which is why it reads as brass hitting the floor
        rather than as part of the gun. */"""
    new = """  spendRound();   /* V157: one trigger pull, one round -- spent only once the shot is real */
  /* V166: THE BRASS USED TO COME OUT HERE, AND HERE IS THE RAISE. Opening the
     dial is not the trigger, it is bringing the gun up -- the shot happens later,
     when he hits the green -- so a casing tinked off the concrete before a single
     round had left the barrel. This cue's own comment already said it "rides the
     ROUND, not the trigger"; it just was not where the round goes. Moved to
     sndShot, the one door every shot in this file goes through. */"""
    js = subN(js, old, new)

    old = """function sndShot(){ if(sfxAsk('shot'))return;"""
    new = """function sndShot(){
  /* V166: and the brass comes out WITH THE BANG. Above the early return, so it
     throws whether or not the bank has a sample for the shot itself. */
  try{ sfxAsk('casing'); }catch(_e){}   /* HIS casing.0. Its own hits land at 0.25-0.44 of a beat, which is why it reads as brass hitting the floor rather than as part of the gun. */
  if(sfxAsk('shot'))return;"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v166: the dial stops tinkling -- %d chars' % len(js))


if __name__ == '__main__':
    main()
