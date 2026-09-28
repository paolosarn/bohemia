#!/usr/bin/env python3
"""
V228 -- THE MOUND IS ONE CELL  (COMBAT lane, [fight on the grid], rule 34 and rule 33d)

PAOLO 9/24 (rule 33d): "ONE terrain effect in the whole fight, a SMALL MOUND = accuracy
bonus, nothing else on a tile changes a number." Rule 34 (9/27) puts it on the grid in as
many words: "the mound is ONE CELL of COVER, the only terrain effect." This row carries it.

MEASURED FIRST, and it has been measured twice by this lane's own gate:
    house board (9/27)   the high ground was  9.26 tiles across, ~111 m, stair 6.5 tiles off
    cell board  (9/28)   the high ground was  8.86 cells across,  ~27 m, stair 6.1 cells off
    both                 the player started on it 0 times, and it eased 0 of 519 shots
THE ONE TERRAIN RULE HE KEPT HAD NEVER ONCE FIRED. It was built correctly (his 8/2 ruling,
"if you're on a second story and you got cover... it should be easier to hit them") and it
was unreachable: a raised slab the size of a block, a staircase six cells away.

---------------------------------------------------------------- WHAT IT DOES

THE SLAB BECOMES ONE CELL, one to three cells from where he stands, in a direction the dice
pick. That is the whole change. Everything else it needs was already built:

  - A one-cell mound IS ITS OWN STAIR. The builder marks the deck tile nearest the bottom
    edge as the entrance, and with one tile that is the tile. So stepping onto it runs the
    V106 climb (one stamina pip, his V114 "the geometry is not free") and stepping off it
    runs the V106 descent. No new movement code, and THE EDGE refusal can never fire on a
    mound, because you are always standing on the way down.
  - The accuracy effect is untouched: highGroundEdge still eases the dial over a man in
    cover below you, steepest right under you, exactly as he ruled on 8/2. Nothing about
    who it helps moved.
  - V140's rule still keeps an enemy off it: a man is only put up high if the high ground
    is outside your reach, and a mound one to three cells away is inside every gun's reach
    (a pistol is four cells). So the mound starts empty, for a reason already written down.

THE DICE DEAL THE SAME CARDS. Every arena is seeded, and a pinned seed is how this fleet
reproduces a fight. The old block drew five numbers (the 72% roll, width, depth, bearing,
distance); this one draws the SAME FIVE IN THE SAME ORDER and simply does not use width and
depth on the cell board, and remaps the distance draw into one-to-three cells. So every
number drawn after this block is the number it always was.

THE BODY BOARD IS BYTE-IDENTICAL: behind houseOn() false it computes width, depth and
distance from the same draws with the same arithmetic as before.

NO DAMAGE BEFORE THE DIAL: the effect was already the dial's own tier pull and it is not
touched. EVERYTHING COSTS ONE: climbing still costs the one pip it always cost. MAP LAW:
authors no street; placement is dice and parameters.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_MOUND_IS_ONE_CELL__'

OLD = """  if((G.arenaKind==='warehouse'||Math.random()<0.72)&&!G.teachBeat){
    const dw=2+Math.floor(Math.random()*3), dh=2+Math.floor(Math.random()*3);
    const a1=Math.random()*Math.PI*2, d1=4.5+Math.random()*3.5;
    const ox=Math.round(Math.cos(a1)*d1), oy=Math.round(Math.sin(a1)*d1);
    for(let i2=0;i2<dw;i2++)for(let j2=0;j2<dh;j2++){
      const tx=ox+i2, ty=oy+j2;
      if(Math.hypot(tx,ty)<2.6)continue;   /* never build a storey on top of the player */"""

NEW = """  if((G.arenaKind==='warehouse'||Math.random()<0.72)&&!G.teachBeat){
    /* ===== V228 __THE_MOUND_IS_ONE_CELL__ (COMBAT, [fight on the grid], rules 33d and 34)
       Paolo 9/24: "ONE terrain effect in the whole fight, a SMALL MOUND = accuracy bonus."
       Rule 34: "the mound is ONE CELL of COVER." MEASURED BY THIS LANE'S OWN GATE, TWICE:
       the slab this built was 9 tiles across on the house board and still 8.86 CELLS across
       (27 m) on the cell board, its stair six cells off, the player on it 0 of 120 starts,
       and it eased 0 of 519 shots. THE ONE TERRAIN RULE HE KEPT HAD NEVER FIRED.
       SO THE SLAB IS ONE CELL, ONE TO THREE CELLS FROM HIM. Nothing else is new: a one-cell
       deck is its own stair (the entrance is the deck tile nearest the bottom edge, and there
       is one), so V106's climb and descent do the stepping and his V114 pip is the price.
       THE DICE DEAL THE SAME CARDS: the same five numbers are drawn in the same order as the
       old block, and the cell board simply does not use width and depth. The body board
       computes everything from those draws exactly as before, byte for byte. */
    const _dwDraw=Math.random(), _dhDraw=Math.random();
    const a1=Math.random()*Math.PI*2, _dFrac=Math.random();
    const _mound=houseOn();
    const dw=_mound?1:(2+Math.floor(_dwDraw*3)), dh=_mound?1:(2+Math.floor(_dhDraw*3));
    const d1=_mound?(MOUND_NEAR+_dFrac*(MOUND_FAR-MOUND_NEAR)):(4.5+_dFrac*3.5);
    let ox=Math.round(Math.cos(a1)*d1), oy=Math.round(Math.sin(a1)*d1);
    if(_mound&&ox===0&&oy===0)ox=1;   /* never ON him: a mound he starts on is not a move he makes */
    for(let i2=0;i2<dw;i2++)for(let j2=0;j2<dh;j2++){
      const tx=ox+i2, ty=oy+j2;
      if(Math.hypot(tx,ty)<(_mound?0.5:2.6))continue;   /* never build a storey on top of the player */"""

OLD_LVL = """const DECK_LVL=1;"""
NEW_LVL = """const DECK_LVL=1;
/* V228: where the mound sits, in CELLS. One step is the nearest a mound can be without being
   under his feet; three is still inside a pistol's four, so it is a move he can make on the
   first beat of any fight. [DIALS] -- TUNING (chat 21) owns every felt number from here. */
const MOUND_NEAR=1.2, MOUND_FAR=3;"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. A guard that checks the text it wrote rather
    than whether the file still runs is not a guard."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the mound is already one cell')
        return
    if '__THE_CELL_BOARD__' not in blob:
        sys.exit('GUARD: V227 is not in this blob; the mound is measured in its cells')
    for old, new, what in ((OLD, NEW, 'the deck builder'), (OLD_LVL, NEW_LVL, 'the mound dials')):
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
        blob = blob.replace(old, new, 1)
    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # THE SAME FIVE DRAWS, IN THE SAME ORDER. Count Math.random() in the block before and
    # after: the 0.72 roll plus four. Any other number means every seed after this deals
    # different cards, and that is the 8/27 lesson.
    blk = code[code.index("G.arenaKind==='warehouse'||Math.random()<0.72"):]
    blk = blk[:blk.index('G.deck.push')]
    if blk.count('Math.random()') != 5:
        sys.exit('GUARD: the deck block draws %d numbers, not 5' % blk.count('Math.random()'))
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V228 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
