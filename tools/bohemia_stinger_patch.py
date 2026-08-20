#!/usr/bin/env python3
"""
BOHEMIA — THE STING (8/19/26, SOUND lane). Winning and dying finally sound
like something.

REUSE CHECK: cooks NO new voice and writes no song. The sting is played by
voices already in his 602-instrument rack (`glasshope`, his canon MENU song's
lead, and `subboom`), and every note it plays is taken from the KEY OF THE SONG
ALREADY PLAYING. Banks opened: the rack, and MUS's own current song object.
Writing a bespoke victory jingle would have been the violation -- and it would
also have clashed, because a fixed-key jingle over a shuffled soundtrack is
wrong in fourteen of fifteen songs.

WHAT WAS MISSING. Checked before claiming: the alpha has no stinger of any kind.
The four matches for "fanfare" in the file are a VOICE NAME (`staticfanfare`)
inside one song, not a system. So nothing musical marks the two biggest moments
the demo has: you won the fight, or you went down. There are SOUND EFFECTS for
adjacent things -- `kill` is approved and wired, `went_down` is approved and
wired -- but a body hitting the floor is information, not a feeling.

A STINGER IS THE CHEAPEST EMOTIONAL BEAT IN GAME AUDIO. It is a short musical
phrase played ON TOP of the running score to mark an event, and the practitioner
literature is consistent that it lands on a beat or a phrase end rather than the
raw instant of the event. Here it takes THE NEXT BEAT: an outcome wants to feel
connected to the thing that caused it, and 120 BPM means the longest it ever
waits is half a second.
  https://splice.com/blog/interactive-music-system-video-games/
  https://www.thegameaudioco.com/making-your-game-s-music-more-dynamic-vertical-layering-vs-horizontal-resequencing

WHY IT IS IN THE SONG'S KEY AND NOT ITS OWN. Bohemia shuffles 127 songs across
15 roots. A stinger written in one key is out of tune with almost everything, and
the one thing worse than no sting is a sting that fights the score. So it reads
`MUS.fac().root` -- the root of whatever is playing right now -- and builds its
figure from intervals off that: a rising root/fifth/octave for a win, a falling
octave/fifth/root for a loss. Those intervals are consonant in every scale in the
file, major or minor, which is exactly why they were chosen over anything with a
third in it. The sting cannot be out of key, ever, because it has no key of its
own.

MECHANISM-MINE / CONTENTS-PAOLO'S: the shape of the gesture is mechanism. What it
is made of -- the songs, the roots, the rack -- is all his.

SCREECH LAW: no delay, no convolver, nothing self-feeding. It calls his rack,
which the instrument gate already sweeps.

Idempotent: keyed on `const STING=`.

  python3 tools/bohemia_stinger_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = "window.FIGHTMUS=FIGHTMUS;"

PLAYER = r"""
/* ===== STING (8/19/26) -- WINNING AND DYING SOUND LIKE SOMETHING =========
   Nothing musical marked either one. The game has a `kill` sound and a
   `went_down` sound and both are approved and wired, but a body hitting the
   floor is INFORMATION. A stinger is the feeling, and it is the cheapest one
   in game audio: a short phrase played OVER the running score.

   IT HAS NO KEY OF ITS OWN, ON PURPOSE. Bohemia shuffles 127 songs across 15
   roots, so a stinger written in one key is out of tune with almost all of
   them, and a sting that fights the score is worse than no sting. This reads
   the root of whatever is playing RIGHT NOW and builds its figure from
   intervals off it -- root, fifth, octave -- which are consonant in every
   scale in the file, major or minor. That is why there is no third in it.

   IT LANDS ON THE NEXT BEAT, not the raw instant of the event: an outcome
   should feel connected to what caused it, and at 120 BPM the longest it ever
   waits is half a second. 120 BPM LAW, same as everything else. */
const STING={
  last:0, GAP:2500,                      /* one sting per moment, never a burst */
  FIG:{
    /* [semitone off the song's root, which 16th step it lands on] */
    win:  { v:'glasshope', g:0.20, sd:0.16, oct:12,
            n:[[0,0],[7,2],[12,4],[19,7]] },     /* rising, and it keeps rising */
    loss: { v:'subboom',   g:0.26, sd:0.34, oct:-12,
            n:[[12,0],[7,4],[0,9]] }             /* falling, and it lands heavy */
  },
  /* the next BEAT is four 16th-steps of grid away at most */
  when(){
    try{
      if(MUS&&MUS.playing&&MUS.AC){
        var toBeat=(4-(MUS.step%4))%4;
        return MUS.nextT + toBeat*MUS.stepDur();
      }
      if(MUS&&MUS.AC) return MUS.AC.currentTime+0.02;
    }catch(e){}
    return null;
  },
  play(which){
    var F=this.FIG[which]; if(!F)return false;
    var now=Date.now(); if(now<this.last+this.GAP)return false;
    try{
      if(typeof MUS==='undefined')return false;
      MUS.audio(); if(!MUS.AC)return false;
      var SV=window.synthV||(typeof synthV!=='undefined'?synthV:null);
      if(!SV)return false;
      var t0=this.when(); if(t0==null)return false;
      /* THE ROOT OF WHATEVER IS PLAYING. If nothing is playing there is still a
         key to be in -- MUS.fac() is whatever song is loaded -- and if even
         that is missing, 45 is the root his canon MENU song uses. */
      var f=null; try{ f=MUS.fac(); }catch(e){}
      var root=(f&&typeof f.root==='number')?f.root:45;
      /* ITS OWN BUS, so it sits OVER the score instead of inside it, and so
         MUS.stop() ducking the music master can never swallow it mid-phrase. */
      if(!this.bus){
        this.bus=MUS.AC.createGain(); this.bus.gain.value=1;
        this.bus.connect((typeof sfxBus==='function'&&sfxBus())||MUS.OUT||MUS.MAST||MUS.AC.destination);
      }
      var step=(MUS.stepDur?MUS.stepDur():0.125);
      for(var i=0;i<F.n.length;i++){
        var semi=root+F.oct+F.n[i][0]-55;    /* -55: the rack's own note offset, as MUS uses it */
        var t=t0+F.n[i][1]*step;
        try{ SV(F.v, MUS.AC, this.bus, function(x){return MUS.noteHz(x);},
                F.sd, semi, t, F.g); }catch(e){}
      }
      this.last=now;
      return true;
    }catch(e){ return false; }
  }
};
window.STING=STING;
"""

OLD_END = """      G.lastEncounter=enc.outcome;
      /* AND THE STREETS COME BACK, at the next 8-bar phrase and never inside
         the cooldown, so two fights in a row stay ONE musical event. */
      try{ if(window.FIGHTMUS)FIGHTMUS.leave(); }catch(_e){}"""
NEW_END = """      G.lastEncounter=enc.outcome;
      /* AND IT SOUNDS LIKE SOMETHING (8/19). The two biggest moments the demo
         has had nothing musical on them at all. In the key of whatever is
         playing, on the next beat. See STING. */
      try{ if(window.STING)STING.play(enc.victory?'win':'loss'); }catch(_e){}
      /* AND THE STREETS COME BACK, at the next 8-bar phrase and never inside
         the cooldown, so two fights in a row stay ONE musical event. */
      try{ if(window.FIGHTMUS)FIGHTMUS.leave(); }catch(_e){}"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if 'const STING=' not in s:
        if ANCHOR not in s:
            print('FAIL: FIGHTMUS is not there to sit beside')
            return 1
        s = s.replace(ANCHOR, ANCHOR + PLAYER, 1)
        changed.append('STING installed beside FIGHTMUS')

    if "STING.play(enc.victory" not in s:
        if OLD_END not in s:
            print('FAIL: the combat-end handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_END, NEW_END, 1)
        changed.append('winning and losing a fight now play a sting')

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())
