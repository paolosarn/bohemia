#!/usr/bin/env python3
"""
BOHEMIA - THE FIGHT'S BEAT (SOUNDS 10/25/26, rows [the fight's music you can hear] and [three intensities in every song];
rules 166(e), 167, 168). Paolo 10/25, playing a fight: 'I only hear the sound effects... I'm not hearing any music... it
doesn't have tempo, doesn't have BPM, doesn't intensify'; 'one when you're on the world map or chilling, two when they're
attacking, three when it's your turn to attack... we have a way we've been doing it'.

WHAT THIS PATCH PUTS IN THE ALPHA (the demo is cut from it by tools/bohemia_cut_the_demo.js):
  1. __THE_FIGHTS_BEAT__: tools/bohemia_sounds_the_fights_beat_block.js inlined verbatim after __THE_SONG_AFTER_THE_BATTLE__:
     the recorded kit and the cello and trombone under every song at its level (1 a soft pulse, 2 tension, 3 combat
     music), a fill into every change, a crash on the new level, the music lifted above the effects for the fight.
  2. THE TURN MAPPING, in the small marked block beside KILLMUS that takes BOHEMIA_FIGHT_TURN (COMBAT's block, rule 126(e);
     amended by rule 167(c), the coordinator's row puts the mapping there and a NOTE on COMBAT's board): the map 1, their
     turn 2, his turn 3, at the top of the next bar (168(d)), where it said their turn is the lowest, on the next beat.
Idempotent: the block sits between markers and is replaced on a re-run; the mapping lines are replaced once and checked.
  python3 tools/bohemia_sounds_the_fights_beat_patch.py [--stamp 'BUILD 10/25c - ...']
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
BLOCK = os.path.join(ROOT, 'tools', 'bohemia_sounds_the_fights_beat_block.js')
START = '<!-- __THE_FIGHTS_BEAT__ (SOUNDS 10/25, rules 166 to 168) -->\n<script>\n'
END = '</script>\n<!-- /__THE_FIGHTS_BEAT__ -->\n'
ANCHOR = '<!-- /__THE_SONG_AFTER_THE_BATTLE__ -->\n'

MAP = [
    ("  K.level = function(){ return this.theirTurn ? 1 : lvl.call(this); };\n",
     "  /* __THE_TURN_MAPPING__ (SOUNDS 10/25, rule 167(c), amending 126(e) by the coordinator's row; NOTE on COMBAT's board):\n"
     "     PAOLO 10/25: 'three intensity is like when it's your turn to attack, two when they're attacking, and one when you're\n"
     "     in the world map or chilling'. The map, a town, chilling 1; their turn 2; HIS TURN 3. The board up before the first\n"
     "     turn is 2 (the fight has begun); the frozen fight, which tells no turn, keeps its threat and its two-kill climb. The\n"
     "     8/26 talking and crowd triggers are retired by 167(c): a town is level 1. */\n"
     "  K.yourTurn = false;\n"
     "  K.level = function(){\n"
     "    if(this.theirTurn) return 2;\n"
     "    if(this.yourTurn && this.nf) return 3;\n"
     "    if(this.nf || this.threat) return this.kills >= 2 ? 3 : 2;\n"
     "    return 1; };\n"),
    ("  K.reset = function(){ this.theirTurn = false; this.quant = 16; P = null; return rs.apply(this, arguments); };\n",
     "  K.reset = function(){ this.theirTurn = false; this.yourTurn = false; this.quant = 16; P = null; return rs.apply(this, arguments); };\n"),
    ("  K.turn = function(side){ this.theirTurn = side === 'them'; this.turns++; this.quant = 4; this.apply(); };\n",
     "  /* THE TURN LANDS ON THE TOP OF THE NEXT BAR (rule 168(d), SOUNDS 10/25): the fight's beat plays a fill into it on the\n"
     "     bar's last beat, so he hears the turn coming a beat before the new level opens on its crash */\n"
     "  K.turn = function(side){ this.theirTurn = side === 'them'; this.yourTurn = side === 'you'; this.turns++; this.quant = 16; this.apply(); };\n"),
    ("  K.settle = function(){ this.kills = 0; this.threat = false; this.theirTurn = false; this.nf = null; this.settles++; this.apply(); };\n",
     "  K.settle = function(){ this.kills = 0; this.threat = false; this.theirTurn = false; this.yourTurn = false; this.nf = null; this.settles++; this.apply(); };\n"),
    ("    if(K.nf !== w){ K.nf = w; K.kills = 0; K.theirTurn = false; }   /* a fresh fight counts its own kills */\n",
     "    if(K.nf !== w){ K.nf = w; K.kills = 0; K.theirTurn = false; K.yourTurn = false; K.apply(); }   /* a fresh fight counts its own kills; the board up is 2 */\n"),
]


def die(msg):
    print("THE FIGHT'S BEAT PATCH: " + msg); sys.exit(2)


def main():
    s = open(ALPHA, encoding='utf-8').read()
    block = START + open(BLOCK, encoding='utf-8').read().rstrip() + '\n' + END
    if START in s:
        a = s.index(START); b = s.index(END, a) + len(END)
        s = s[:a] + block + s[b:]
    else:
        if s.count(ANCHOR) != 1: die("the song after the battle's end %r is not in the alpha exactly once" % ANCHOR.strip())
        s = s.replace(ANCHOR, ANCHOR + block)
    for old, new in MAP:
        if new in s: continue
        if s.count(old) != 1: die('the mapping line %r is not in the alpha exactly once' % old.strip()[:80])
        s = s.replace(old, new)
    stamp = None
    if '--stamp' in sys.argv:
        stamp = sys.argv[sys.argv.index('--stamp') + 1]
        n = len(re.findall(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', s))
        if n != 1: die('found %d build stamps' % n)
        s = re.sub(r'(<div id="buildstamp"[^>]*>)[^<]*(</div>)', lambda m: m.group(1) + stamp + m.group(2), s)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print("THE FIGHT'S BEAT PATCH: the block after the song after the battle, the turn mapping in KILLMUS's turn block%s" % ((', stamp ' + stamp) if stamp else ''))


if __name__ == '__main__':
    main()
