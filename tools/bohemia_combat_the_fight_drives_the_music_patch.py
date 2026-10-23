#!/usr/bin/env python3
"""
BOHEMIA - THE FIGHT DRIVES THE MUSIC (COMBAT 10/23/26, row [the fight drives the music], rule 126).

PAOLO 10/23, LOCKED: 'I almost played a first day; the combat should feel a lot better; we have a whole intensity
system with the music, wtf bro'. The same hour, rule 126(e): 'and when it's the enemies' turn have it at the low
intensity, I want to hear it's my turn time'.

MEASURED FIRST: the shell's ladder (KILLMUS, window.INTENSITY) hears BOHEMIA_COMBAT_STARTED, BOHEMIA_PLAYER_HIT,
BOHEMIA_SHOT_RESULT 'killshot' and BOHEMIA_COMBAT_END, and the rebuilt fight (slices/BOHEMIA_FIGHT.html) posted none of
them, so the song never moved in a fight since 10/2. The fight now posts the first three (combatMsgIn hears them as
ever) and BOHEMIA_FIGHT_TURN {side}; its end is the BOHEMIA_FIGHT_OVER it already sent.

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js): one marked block beside
KILLMUS, COMBAT's for this alone (rule 126(e)); RUN keeps the rest of the file.
  - THEIR TURN IS THE BOTTOM OF THE LADDER: level 1, the calm arrangement, whatever the kills and the threat say; his
    turn is the fight's level again (threat 2, two kills 3). It lands on the next BEAT (126(e)), because one act of
    theirs is one to three beats and a bar is four: a drop held for the bar would mostly never land. A kill, the threat
    and the end keep the bar (126(b)). No new song, no new part, no change to the music engine: the arrangements his allowed songs
    already carry (MUS.layers 0 / 2 / 4; all nine OVERWORLD NIGHT songs have a klay and none is a menu song).
  - THE END SETTLES ON THE BAR, from BOHEMIA_FIGHT_OVER (the rebuilt fight never sends BOHEMIA_COMBAT_END: that is the
    frozen fight's settle, and its handler takes him home through cityFightHome at once, before the recap's beats).
    A fight frame that goes without one settles too.
  - A FRESH FIGHT COUNTS ITS OWN KILLS: the first message from a new fight frame zeroes the count.
  - Only the rebuilt fight's own frame (NF.frame) is heard here.

Idempotent: the block sits between markers and is replaced on a re-run.
  python3 tools/bohemia_combat_the_fight_drives_the_music_patch.py
then cut the demo: node tools/bohemia_cut_the_demo.js
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
ANCHOR = 'window.INTENSITY=KILLMUS;\n'
OPEN = '/* ===== __THE_FIGHT_DRIVES_THE_MUSIC__ (COMBAT 10/23, row [the fight drives the music], rule 126) ====='
CLOSE = '/* ===== /__THE_FIGHT_DRIVES_THE_MUSIC__ ===== */\n'

BLOCK = OPEN + r'''
   PAOLO 10/23: 'the combat should feel a lot better; we have a whole intensity system with the music, wtf bro'; the same
   hour: 'when it's the enemies' turn have it at the low intensity, I want to hear it's my turn time'.
   THIS BLOCK IS COMBAT'S, FOR THIS ALONE (rule 126(e)); the patch is tools/bohemia_combat_the_fight_drives_the_music_patch.py
   and the gate gates/the_fight_drives_the_music_gate.js. The rebuilt fight posts BOHEMIA_COMBAT_STARTED, BOHEMIA_PLAYER_HIT
   and BOHEMIA_SHOT_RESULT 'killshot' (combatMsgIn hears them, as it always has) and BOHEMIA_FIGHT_TURN {side}, heard here.
   THEIR TURN IS THE BOTTOM OF THE LADDER (level 1, the calm arrangement, whatever the kills and the threat say); his turn
   is the fight's level again. THE TURN LANDS ON THE NEXT BEAT, not the next bar (126(e): 'on the beat'): one act of theirs
   is one to three beats and a bar is four, so a drop held for the bar would mostly never land and he would never hear
   'my turn'. A kill, the threat and the end keep the bar (126(b)): the quantum is the beat only for a change a turn made.
   THE CHANGE IS NEVER MISSED. KILLMUS's watcher looked at MUS.step every 60 ms for a step that is a bar's first, and a
   step lasts 125 ms, so a busy thread stepped right past the bar and the lift waited for the next one: MEASURED in the
   demo, the fight's first lift 2.2 s after the board while the fight built. The scheduler reads MUS.layers once for every
   step it books (playStep's `sk`), with MUS.step the step being booked, so the pending change is committed AT THAT READ, on
   the first step that is a boundary: exact on a stalled phone, no polling, MUS.playStep and the engine untouched. A plain
   write to MUS.layers (the MUSIC tab's KILL LAYERS, a reset) is a write, as before, and drops anything pending.
   THE END SETTLES ON THE BAR, from the fight's own BOHEMIA_FIGHT_OVER (it never sends BOHEMIA_COMBAT_END: that is the
   frozen fight's settle, and its handler takes him home at once, before the recap's beats). A fight frame that goes
   without one settles too. Only the rebuilt fight's own frame (NF.frame) is heard. */
(function(){
  var K = KILLMUS, lvl = K.level, rs = K.reset, arm0 = K.arm, P = null;
  var MINE = { BOHEMIA_COMBAT_STARTED: 1, BOHEMIA_PLAYER_HIT: 1, BOHEMIA_SHOT_RESULT: 1, BOHEMIA_FIGHT_TURN: 1, BOHEMIA_FIGHT_OVER: 1 };
  K.theirTurn = false; K.nf = null; K.turns = 0; K.settles = 0; K.quant = 16; K.exact = false;
  K.level = function(){ return this.theirTurn ? 1 : lvl.call(this); };
  K.reset = function(){ this.theirTurn = false; this.quant = 16; P = null; return rs.apply(this, arguments); };
  /* MUS is declared further down this script, so the commit-on-read goes in once the script has run */
  function exact(){
    if(K.exact) return true;
    var m; try{ m = MUS; }catch(e){ return false; }
    var d = m && Object.getOwnPropertyDescriptor(m, 'layers');
    if(!d || !('value' in d)) return false;   /* somebody else holds the property: the old watcher, as before */
    var cur = d.value;
    Object.defineProperty(m, 'layers', { configurable: true, enumerable: true,
      get: function(){ if(P && (!m.playing || m.step % P.q === 0)){ cur = P.want; P = null; } return cur; },
      set: function(x){ cur = x; P = null; } });
    return (K.exact = true);
  }
  (function tryExact(){ if(!exact()) setTimeout(tryExact, 250); })();
  /* a turn's change asks for the beat (4 steps), anything else the bar (16); one already pending on the beat keeps it */
  K.arm = function(){
    if(!exact()){ this.quant = 16; return arm0.call(this); }
    P = { want: this.want, q: P ? Math.min(P.q, this.quant) : this.quant }; this.quant = 16;
  };
  K.pending = function(){ return P ? { want: P.want, q: P.q } : null; };
  K.turn = function(side){ this.theirTurn = side === 'them'; this.turns++; this.quant = 4; this.apply(); };
  K.settle = function(){ this.kills = 0; this.threat = false; this.theirTurn = false; this.nf = null; this.settles++; this.apply(); };
  function fightWin(){ try{ return (window.NF && NF.frame && NF.frame.contentWindow) || null; }catch(e){ return null; } }
  window.addEventListener('message', function(ev){
    var d = ev && ev.data; if(!d || !MINE[d.type]) return;
    var w = fightWin(); if(!w || ev.source !== w) return;
    if(d.type === 'BOHEMIA_FIGHT_OVER'){ K.settle(); return; }
    if(K.nf !== w){ K.nf = w; K.kills = 0; K.theirTurn = false; }   /* a fresh fight counts its own kills */
    if(d.type === 'BOHEMIA_FIGHT_TURN') K.turn(d.side);
  });
  setInterval(function(){ if(K.nf && !fightWin()) K.settle(); }, 1000);
})();
''' + CLOSE


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if OPEN in s:
        a = s.index(OPEN)
        b = s.index(CLOSE, a) + len(CLOSE)
        s2 = s[:a] + BLOCK + s[b:]
    else:
        if s.count(ANCHOR) != 1:
            print('THE FIGHT DRIVES THE MUSIC PATCH: the anchor ' + ANCHOR.strip() + ' is not in the alpha exactly once')
            sys.exit(1)
        s2 = s.replace(ANCHOR, ANCHOR + BLOCK, 1)
    if s2 == s:
        print('THE FIGHT DRIVES THE MUSIC PATCH: already in, nothing changed')
        return
    open(ALPHA, 'w', encoding='utf-8').write(s2)
    print('THE FIGHT DRIVES THE MUSIC PATCH: the block is in the alpha beside KILLMUS (' + str(len(BLOCK)) + ' bytes)')


if __name__ == '__main__':
    main()
