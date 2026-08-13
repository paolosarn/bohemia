#!/usr/bin/env python3
"""
THE PHONE REMEMBERS WHAT YOU DID (8/12/26).

Paolo: "we are trying tk create the best funnest deepest videogame ever."

DEPTH IS NOT MORE SURFACE. It is yesterday still being true today. So I measured
what actually survives a night in the shipped build, across a real day boundary:

    day 1 ends   TRADES +8      (he handed the tap to the trades, in daylight)
    day 2 opens  {}             gone

A BOND survived. Everything he did to a FACTION was forgotten by morning. In a
valley whose entire spine is factions -- REDS, BLUES, NETWORK, TRADES, CARTEL,
REMNANTS -- that is the deepest hole in the loop, and it is not a missing feature:
it is half a wiring job somebody stopped in the middle.

Paolo 8/7, ruling A, quoted in the quest runtime's own source:

    "a bond built in one quest opens a door in another. Continuity is the dynasty."

Bonds were wired into the shared ledger that day. Faction standing and posture were
not, so they lived only in the quest's own state -- and a quest's state dies with
the quest. The engine fix carries all three now, and keeps the REASON with each
move: the completing stage's own @LOG line, so what shows your standing shows the
quest's words and never prose I wrote about it.

THIS FILE IS THE HALF THAT MAKES IT VISIBLE. A ledger nobody can read is not depth,
it is bookkeeping. The phone's home screen now carries THE VALLEY'S MEMORY OF YOU:
who you are solid with, which factions you moved, and the line from the job that
moved them.

WHY THE PHONE AND NOT A STATS SCREEN. Because it is already the thing that brings
him work, and standing is WHY the work comes. A menu would be a menu; on the phone
it is the same object that rang this morning, telling you what last week cost you.
It also makes the Profile app honest -- it has been showing follower count and
nothing else, on a device whose whole job is who knows you.

REUSE CHECK: cooks no graphic pixels of any kind. The block reuses the live strip's
own container and type (.live-strip/.lv-top/.lv-obj) and the phone's existing
number treatment. No bank is opened because nothing is drawn.

Edits the SOURCE; the built slice is regenerated with
`node tools/build_current_slice.js`.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html'
MARK = '__THE_VALLEY_REMEMBERS__'

OLD = """  el('home').innerHTML =
    liveStrip()+"""
NEW = """  el('home').innerHTML =
    liveStrip()+
    standingBlock()+"""

BLOCK = """
/* """ + MARK + """ -- WHAT THE VALLEY REMEMBERS ABOUT YOU (8/12/26).
   Measured before it was built: a bond survived the night and faction standing did
   not, so everything he did to a faction was forgotten by morning. The engine
   carries all three now; this is the half that lets him SEE it, because a ledger
   nobody can read is bookkeeping, not depth.
   Every "why" line here is the quest's OWN words -- the same law the offer and the
   resolution buttons live under. I show his prose; I do not write prose about it. */
function standingRow(r){
  var n = r.n>0 ? ('+'+r.n) : String(r.n);
  return '<div class="st-row"><span class="st-who">'+esc(String(r.who).replace(/\\|.*$/,''))+
         '</span><span class="st-n '+(r.n>0?'up':'dn')+'">'+esc(n)+'</span></div>';
}
function standingBlock(){
  var S = LIVE && LIVE.standing;
  if(!S) return '';
  var any = (S.faction.length + S.bonds.length + S.posture.length) > 0;
  if(!any){
    /* AN EMPTY LEDGER IS NOT AN ERROR, IT IS DAY ONE. Saying so is better than an
       empty box, and better than hiding the thing that is about to start filling. */
    return '<div class="live-strip"><div class="lv-top">THE VALLEY</div>'+
           '<div class="lv-obj">Nobody here knows you yet.</div></div>';
  }
  var h = '<div class="live-strip"><div class="lv-top">WHAT THE VALLEY REMEMBERS</div>';
  if(S.faction.length){ h += '<div class="st-hd">standing</div>'+S.faction.map(standingRow).join(''); }
  if(S.bonds.length){   h += '<div class="st-hd">people</div>'+S.bonds.map(standingRow).join(''); }
  if(S.posture.length){ h += '<div class="st-hd">watching you</div>'+S.posture.map(standingRow).join(''); }
  if(S.log && S.log.length){
    h += '<div class="st-hd">because</div>';
    S.log.slice(0,3).forEach(function(e){
      if(!e.why) return;
      h += '<div class="st-why">'+esc(e.why)+'</div>';
    });
  }
  return h+'</div>';
}
"""

CSS_ADD = """/* """ + MARK + """ -- the ledger, in the phone's own type. */
.st-hd{margin-top:8px;font-size:9px;font-weight:700;letter-spacing:2px;color:#8d7c5e}
.st-row{display:flex;justify-content:space-between;align-items:baseline;padding:2px 0}
.st-who{font-size:12px;color:#e7d8bb}
.st-n{font-size:12px;font-weight:700}
.st-n.up{color:#9ed060}
.st-n.dn{color:#c8503a}
.st-why{margin-top:3px;font-size:11px;line-height:1.4;color:#8d7c5e}
</style>"""


def main():
    if not os.path.exists(SRC):
        sys.exit('FAIL: ' + SRC + ' not found')
    s = open(SRC, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the home screen was not found -- run the live/offer patches first')
    s = s.replace(OLD, NEW, 1)

    i = s.find('</style>')
    if i < 0:
        sys.exit('FAIL: no </style> to extend')
    s = s[:i] + CSS_ADD + s[i + len('</style>'):]

    tail = s.rfind('</script>')
    if tail < 0:
        sys.exit('FAIL: no closing script tag')
    s = s[:tail] + BLOCK + '\n' + s[tail:]

    open(SRC, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + SRC + ' (' + str(len(s)) + ' bytes)')
    print('NEXT: node tools/build_current_slice.js')


if __name__ == '__main__':
    main()
