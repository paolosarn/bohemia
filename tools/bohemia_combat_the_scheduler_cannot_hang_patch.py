#!/usr/bin/env python3
"""V144 THE MUSIC SCHEDULER COULD HANG THE WHOLE GAME. IT CANNOT NOW.

Paolo 8/12: "idk i pressed wait hella and when i went to shoot someone the game
froze bro"

--------------------------------------------------------------------------
THE FREEZE IS REAL AND IT IS IN THE AUDIO CLOCK
--------------------------------------------------------------------------
    function seqTick(){ if(!_seq.on||!AC)return; const ahead=AC.currentTime+0.1;
      while(_seq.next<ahead){ playStep(...); _seq.step++; _seq.next+=stepDur(); }
    }

This is a lookahead scheduler on a 25ms setInterval, and it is the standard
shape -- except for one thing: IT HAS NO RECOVERY. The loop runs until it has
caught `_seq.next` up to the audio clock, one 0.125s step at a time, replaying
EVERY step it missed.

setInterval does not fire on time. It fires late when the tab is backgrounded,
when the phone locks, when the OS is busy, when garbage collection runs. The
audio clock keeps going the whole time. So the gap between `_seq.next` and
`AC.currentTime` is however long the interval was starved:

    starved 10 seconds ->    80 iterations
    starved 1 minute   ->   480 iterations
    starved 5 minutes  -> 2,400 iterations

and every iteration calls playStep(), which builds and schedules real audio
nodes. A few hundred of those in one tick locks the tab. THAT IS THE FREEZE, and
"pressed wait hella" is exactly the shape that produces it: a long session with
real time passing between taps, phone going to sleep and coming back.

It looks like a freeze rather than a crash because nothing throws. The main
thread is simply gone, inside a while loop, scheduling music that is already in
the past.

--------------------------------------------------------------------------
THE FIX IS THE ONE THE SCHEDULING LITERATURE ALREADY GIVES
--------------------------------------------------------------------------
1. RESYNC INSTEAD OF CATCHING UP. If the scheduler has fallen behind by more
   than a beat, the missed steps are in the PAST and can never be heard. Do not
   play them. Jump the step counter forward to where the music would be and
   carry on. Silence during a stall is correct; a stampede of stale notes is not.
2. A HARD CEILING ON ONE TICK. Even after a resync, the loop is capped. A tick
   only ever needs to schedule one or two steps, so a cap of 64 is a hundred
   times more headroom than real use and still makes hanging impossible. This is
   the belt to the resync's braces: whatever else is ever wrong with the clock,
   this loop cannot take the main thread away again.

WHY BOTH: the resync fixes the cause I can name. The cap fixes the causes I
cannot -- a suspended context resuming oddly, a clock that jumps, a future
change to stepDur. A loop with no bound in a 25ms timer is a hang waiting for an
excuse, and this game has already spent one on him.

REUSE CHECK: cooks NO graphic pixels and adds no audio. It changes the loop
bounds of the existing sequencer and calls the existing stepDur/playStep. No
bank is opened because nothing is authored.

TASTE CHECK: authors no art. The taste rule is the floor under every other one:
the game must not stop. A frozen tab is worse than any ugly frame, and this one
ate a session of his playtesting.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V144 THE SCHEDULER CANNOT HANG'
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
        print('v144 already in; nothing to do')
        return

    old = """function seqTick(){ if(!_seq.on||!AC)return; const ahead=AC.currentTime+0.1;
  while(_seq.next<ahead){ playStep(_seq.step%16,_seq.next,songCtx(_seq.step)); _seq.step++; _seq.next+=stepDur(); }
}"""
    new = """/* ===== V144 THE SCHEDULER CANNOT HANG ============================
   Paolo 8/12: "i pressed wait hella and when i went to shoot someone the game
   froze bro."
   THIS LOOP WAS THE FREEZE. It is a lookahead scheduler on a 25ms setInterval,
   which is the right shape, except it had NO RECOVERY: it caught `_seq.next` up
   to the audio clock one 0.125s step at a time, REPLAYING EVERY STEP IT MISSED.
   setInterval does not fire on time -- it fires late when the tab is
   backgrounded, when the phone locks, when the OS is busy, when GC runs -- and
   the audio clock keeps running the whole time. Starved ten seconds is 80
   iterations; a minute is 480; five minutes is 2,400. Every one builds and
   schedules real audio nodes. A few hundred in one tick takes the main thread
   away, which is why it reads as a FREEZE and not a crash: nothing throws, the
   thread is just gone, scheduling music that already happened.
   1. RESYNC, NEVER CATCH UP. Steps missed during a stall are in the PAST and
      can never be heard. Jump the counter to where the music would be. Silence
      during a stall is correct; a stampede of stale notes is not.
   2. A HARD CEILING ANYWAY. A tick only ever needs one or two steps, so 64 is a
      hundred times real headroom and still makes hanging impossible. The resync
      fixes the cause I can name; the cap fixes the ones I cannot. An unbounded
      loop inside a 25ms timer is a hang waiting for an excuse. */
const SEQ_MAX_STEPS=64;      /* the most one tick may ever schedule [DIAL] */
const SEQ_RESYNC=0.5;        /* behind by more than this and we jump instead of replaying [DIAL] */
function seqTick(){ if(!_seq.on||!AC)return;
  const now=AC.currentTime, ahead=now+0.1, sd=stepDur();
  if(!(sd>0))return;         /* a zero or broken step length would be an infinite loop */
  if(_seq.next<now-SEQ_RESYNC){
    const miss=Math.ceil((now-_seq.next)/sd);
    _seq.step+=miss; _seq.next+=miss*sd;   /* the music is where it WOULD be, not where it was */
  }
  let guard=0;
  while(_seq.next<ahead&&guard++<SEQ_MAX_STEPS){ playStep(_seq.step%16,_seq.next,songCtx(_seq.step)); _seq.step++; _seq.next+=sd; }
  if(guard>=SEQ_MAX_STEPS)_seq.next=ahead;   /* never leave it still behind, or the next tick inherits the backlog */
}"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v144: the scheduler cannot hang -- %d chars' % len(js))


if __name__ == '__main__':
    main()
