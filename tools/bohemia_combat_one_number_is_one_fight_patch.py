#!/usr/bin/env python3
"""
V192 ONE NUMBER IS ONE EXACT FIGHT, NOT ONE EXACT LOT -- the second half of V88's
promise, broken by V190 four hours after the first half was fixed.

V88's sentence, in its own code comment:

    "Cover, spawn layout, looks, weapons -- ONE NUMBER REPRODUCES ONE EXACT
     FIGHT, FOREVER."

V190 broke that promise TWICE, in opposite directions, and both times a gate arm
with nothing to do with bosses is what said so.

  FIRST CUT: rolled the boss INSIDE BohemiaArena.withDice. That draws one number
  off the seeded stream on every fight, which silently re-dealt every arena Paolo
  has ever written down. Caught by V173 and V180 going red.

  SECOND CUT: moved the roll out to the real Math.random. That fixed the COVER
  and left WHO TURNS UP unseeded -- so a pinned seed still rolled a different
  encounter every replay. *** THE ARENA WAS REPRODUCIBLE AND THE FIGHT WAS NOT,
  WHICH IS HALF A PROMISE. *** Caught by an RF4-49 movement arm that has pinned
  seed 6 for weeks and started failing about one run in three: the fight it drew
  was sometimes a six-to-eight man boss fight with two of his guards standing on
  the cell it wanted to step into.

THE LESSON, AND IT IS NOT THE ONE I WROTE DOWN YESTERDAY: I recorded "a feature
that costs a seeded stream one draw rewrites the whole map" and then FIXED IT BY
TAKING THE DRAW OUT OF THE STREAM ENTIRELY, which trades one broken half for the
other. A thing that must be reproducible cannot be moved OFF the seed to protect
the seed. It needs its own stream, keyed off the same number.

-------------------------------------------------------------------------
WHAT SHIPS
-------------------------------------------------------------------------
A SECOND STREAM, KEYED OFF THE ARENA NUMBER. bossDice() builds a generator from
the seed itself rather than from the arena's running stream, so:

  * the arena's own draws are untouched to the byte -- a fight with no boss deals
    exactly the lot it always dealt, which is what V190's first fix bought;
  * seed 6 is seed 6 forever, boss and all, which is what it cost.

Both halves hold at once, and neither is traded for the other.

WHICH MEN ARE STILL OPEN DEPENDS ON WHAT YOU ALREADY HOLD, so the same number can
hand you a different man as you take keys off people. That is the ladder working
rather than the seed drifting: a boss whose door you have already opened is a
fight with nothing behind it, and V190 gates that separately.

NO DAMAGE BEFORE THE DIAL: changes which generator a decision reads and nothing
else. Not one damage, accuracy, hp, armour or resource number moves.

REUSE CHECK: cooks no graphic pixels and opens no bank. BohemiaArena.dice IS
V88's own exported generator -- the same function withDice uses -- and this calls
it with a different key. Nothing new was written to make a number.

TASTE CHECK: invisible. It is the difference between an arena number meaning
something and meaning nothing.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V192 ONE NUMBER IS ONE EXACT FIGHT'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v192: already applied')
        return
    if 'V190 THE MINI BOSSES' not in d:
        sys.exit('v192 needs v190 -- run the mini bosses patch first')

    d = sub(d,
        """function rollBoss(){
  if(G.bossPick){ const b=bossById(G.bossPick); if(b)return b; }
  if(G.bossOff)return null;
  if(Math.random()>=BOSS_CHANCE)return null;
  const open=BOSSES.filter(b=>!keyHas(b.id));
  if(!open.length)return null;
  return open[Math.floor(Math.random()*open.length)]; }""",
        """/* ===== V192 ONE NUMBER IS ONE EXACT FIGHT, NOT ONE EXACT LOT =========
   V88's promise, verbatim: "cover, spawn layout, looks, weapons -- ONE NUMBER
   REPRODUCES ONE EXACT FIGHT, FOREVER."
   *** V190 BROKE IT TWICE, IN OPPOSITE DIRECTIONS. *** The first cut rolled the
   boss INSIDE withDice, drew one number off the seeded stream on every fight,
   and re-dealt every arena he has ever written down. The fix moved the roll out
   to the real Math.random -- which repaired the COVER and left WHO TURNS UP
   unseeded, so a pinned seed still rolled a different encounter every replay.
   The lot was reproducible and the FIGHT was not, which is half a promise.
   Both times a gate arm with nothing to do with bosses is what said so: V173
   and V180 the first time, and an RF4-49 movement arm that has pinned seed 6 for
   weeks the second -- it started failing about one run in three because the
   fight it drew was sometimes a boss fight with two guards standing on the cell
   it wanted to step into.
   A THING THAT MUST BE REPRODUCIBLE CANNOT BE MOVED OFF THE SEED TO PROTECT THE
   SEED. It needs its OWN stream, keyed off the same number: the arena's draws
   stay untouched to the byte, and seed 6 is seed 6 forever. */
function bossDice(){
  try{ if(BohemiaArena.get()==null)BohemiaArena.roll();
    return BohemiaArena.dice(((BohemiaArena.get()|0)*2246822519)^0x5f3759df); }
  catch(_e){ return Math.random; } }
function rollBoss(){
  if(G.bossPick){ const b=bossById(G.bossPick); if(b)return b; }
  if(G.bossOff)return null;
  const r=bossDice();
  if(r()>=BOSS_CHANCE)return null;
  /* WHICH MEN ARE STILL OPEN DEPENDS ON WHAT YOU HOLD, so the same number can
     hand you a different man as you take keys off people. That is the ladder
     working, not the seed drifting. */
  const open=BOSSES.filter(b=>!keyHas(b.id));
  if(!open.length)return null;
  return open[Math.floor(r()*open.length)]; }""",
        what='the second stream')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v192: one number is one exact fight -- %d chars' % len(d))


if __name__ == '__main__':
    main()
