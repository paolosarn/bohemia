#!/usr/bin/env python3
"""
A LIT BLOCK HUMS (9/5/26, SOUNDS lane) - BB-A-LIT-BLOCK-HUMS. LIGHT=TERRITORY,
through the ear, and it needs no canon from him at all: a hum is not a name.

THE ROW'S SHIP TEST, verbatim: "a live circuit is audible and a dead one is not."

MEASURED FIRST, and the shape is the one this lane keeps finding:

    the shell's mentions of the power grid                0
    callers of `generator` tied to power                  0
    callers of `power_on` (2 of 5 approved, 8/20)         0

The ambience bed picks `generator` on a die roll -- 12.5% outdoors, and since
this morning weighted by DISTRICT -- and NOTHING in that chain has ever asked
whether the block you are standing on has power. So a generator could hum on a
pitch-black dead street, and a live circuit, which is 12% of the valley and every
one of them OWNED, sounded exactly like the dark.

Meanwhile the grid is real, finished code on the walked surface: `POWER.at(x,y)`
answers {live, owner, id}, circuits are feeder-sized runs of about six cells,
12% are lit, and since BB-THE-NIGHT-EATS-POWER shipped this round a circuit you
cannot pay for GOES DARK and stays dark. Ten readers on that surface already ask
it. The sound was the eleventh, and it never asked.

WHAT IT DOES, and every number is the grid's own answer rather than a die:

  * the city, on the same four-second report it already sends, scans the 7x7
    block of overmap cells around you and reports the CHEBYSHEV DISTANCE to the
    nearest LIVE circuit, and which side it is on. -1 means nothing live within
    three cells.
  * the bed places the hum at that real distance instead of the random "6 to 15
    tiles" it used for everything: on the block ~2.5, next street ~11, two
    streets ~20, three ~29. The inverse law and the distance lowpass already in
    placeSound do the rest, so a generator a block away is quiet AND dull, which
    is what distance actually sounds like.
  * AND IF THERE IS NO LIVE CIRCUIT WITHIN THREE CELLS, THE HUM DOES NOT PLAY.
    That is the half of the row's test that everybody forgets to build. A dead
    grid is not "the same but quieter", it is silent of machines.

THE LIT SIGN GOES WITH IT, AND THAT IS NOT SCOPE CREEP. `sign_alive` is a neon
sign that is ON. A sign cannot be alive on a circuit that is dead -- it is the
same fact about the same block -- so it takes the same gate. Without that, a
dead street would still advertise, which is the exact thing LIGHT=TERRITORY says
it cannot do.

THE GROUNDING IS THE ROW'S OWN, and it is the best real-world result on that
page: the 2020 lockdowns cut human-generated high-frequency ground noise BY UP TO
50%, the largest such drop ever recorded and largest in the DENSEST cities, and
signals that had always been there BECAME CLEARLY AUDIBLE. DEAD IS NOT SILENT,
DEAD IS A DIFFERENT BED -- when the machines stop you do not lose sound, you lose
the layer that was masking everything else. A working generator four blocks away
in a dead valley is LOUD, and that is why the distance had to be real rather than
a taste dial.

WHAT IT DOES NOT WIRE, said out loud rather than left blank: `power_on` ("THE
BLOCK LIGHTS -- the grid takes a block") still has no caller, because its moment
does not exist. `POWER.douse()` has one (the night bill) and `POWER.relight()`
has NONE, by a deliberate decision written into the grid itself: "what it costs
to get your lights back is a price, and prices are Paolo's". A block being taken
and lit is not a thing that can happen yet. It stays cooked, judgeable, and
carries a written reason instead of an invented caller.

AND A REPORT WITHOUT THE FIELD IS EXACTLY WHAT IT WAS. The run slice sends no
litD, and `null` means "not reported" while `-1` means "reported, nothing live".
Those are different facts and conflating them would silence the run slice's bed.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new event. It
uses `generator` (4 of 5, 8/20) and `sign_alive`, both already in the bed's own
pick list, through placeSound, which has placed the bed's rare sounds since 8/14.

  python3 tools/bohemia_a_lit_block_hums.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_LIT_BLOCK_HUMS__'

CITY_ANCHOR = """    window.parent.postMessage({type:'BOHEMIA_WHERE', from:'city',
      inside:inside, night:night, min:min, space:space, district:dist},'*');"""
CITY_REPLACE = """    /* __A_LIT_BLOCK_HUMS__ -- HOW FAR IS THE NEAREST BLOCK WITH POWER.
       LIGHT=TERRITORY through the ear. The grid is finished code on this
       surface and ten readers already ask POWER.at(); the sound was the
       eleventh and never asked, so a live circuit sounded exactly like the
       dark. Chebyshev distance in overmap cells, out to three; -1 means
       nothing live within three, which is a DIFFERENT FACT from not looking.
       49 cells once every four seconds. */
    var litD=-1, litDx=0;
    try{
      if(!inside){
        var _cx=(hx/FN)|0, _cy=(hy/FN)|0, _bd=99, _bx=0, _ox, _oy, _pw, _dd;
        for(_ox=-3;_ox<=3;_ox++) for(_oy=-3;_oy<=3;_oy++){
          _pw=null; try{ _pw=POWER.at(_cx+_ox,_cy+_oy); }catch(_p){ _pw=null; }
          if(!(_pw&&_pw.live)) continue;
          _dd=Math.max(Math.abs(_ox),Math.abs(_oy));
          if(_dd<_bd){ _bd=_dd; _bx=_ox; }
        }
        if(_bd<99){ litD=_bd; litDx=_bx; }
      }
    }catch(_l){}
    window.parent.postMessage({type:'BOHEMIA_WHERE', from:'city',
      inside:inside, night:night, min:min, space:space, district:dist,
      litD:litD, litDx:litDx},'*');"""

WHERE_ANCHOR = """      this.place = d.inside ? null : (PLACE_OF[d.district] || null);"""
WHERE_REPLACE = """      this.place = d.inside ? null : (PLACE_OF[d.district] || null);
      /* __A_LIT_BLOCK_HUMS__ -- HOW FAR THE NEAREST LIVE CIRCUIT IS, in overmap
         cells, or -1 for none within three. NULL IS NOT -1: null means the
         sender does not report power at all (the run slice does not), and -1
         means it looked and the grid is dead around you. Conflating them would
         silence the run slice's bed, which is a new field deleting an old one. */
      this.litD  = d.inside ? -1 : ((typeof d.litD === 'number') ? d.litD : null);
      this.litDx = +d.litDx || 0;"""

PICK_ANCHOR = """      var _p = this.place && PLACE[this.place];
      if(_p){
        if(r < _p.gen  && (A.generator  ||[]).length) return 'generator';
        if(r < _p.wind && (A.wind_gust  ||[]).length) return 'wind_gust';
        if(r < _p.sign && (A.sign_alive ||[]).length) return 'sign_alive';"""
PICK_REPLACE = """      /* __A_LIT_BLOCK_HUMS__ -- A DEAD BLOCK HAS NO MACHINES ON IT. The row's
         ship test is "a live circuit is audible and a dead one is not", and the
         second half is the one that gets skipped. `generator` is a machine
         running and `sign_alive` is a neon sign that is ON; neither can happen
         on a circuit nobody is feeding, and 88% of this valley's circuits are
         not. A sender that does not report power (null) keeps what it had. */
      var _hum = (this.litD == null) || (this.litD >= 0);
      var _p = this.place && PLACE[this.place];
      if(_p){
        if(r < _p.gen  && _hum && (A.generator  ||[]).length) return 'generator';
        if(r < _p.wind &&         (A.wind_gust  ||[]).length) return 'wind_gust';
        if(r < _p.sign && _hum && (A.sign_alive ||[]).length) return 'sign_alive';"""

OLD_ANCHOR = """      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';"""
OLD_REPLACE = """      if(r<0.125 && _hum && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';"""

SIGN_ANCHOR = """      if(r<0.44 && (A.sign_alive||[]).length) return 'sign_alive';"""
SIGN_REPLACE = """      if(r<0.44 && _hum && (A.sign_alive||[]).length) return 'sign_alive';"""

PLACE_ANCHOR = """        if(ev!==this.kind){
          var side=(Math.random()*2-1);
          placeSound(ev, { dx: side*7, dist: 6+Math.random()*9, inside:false },
                     this.bus);
          this.last=ev; return;
        }"""
PLACE_REPLACE = """        if(ev!==this.kind){
          var side=(Math.random()*2-1);
          var dx=side*7, dist=6+Math.random()*9;
          /* __A_LIT_BLOCK_HUMS__ -- THE HUM IS AS FAR AWAY AS THE POWER IS.
             "6 to 15 tiles" was a taste dial for everything, and for this one
             sound the game knows the real answer: how many overmap cells to the
             nearest live circuit. On the block ~2.5, the next street ~11, two
             streets ~20, three ~29. placeSound's inverse law and its distance
             lowpass do the rest, so a generator a block away comes back quiet
             AND dull, which is what a block of distance actually sounds like.
             A lit sign is the same fact about the same block, so it rides it. */
          if((ev==='generator'||ev==='sign_alive') && this.litD>=0){
            dist = 2.5 + this.litD*8.5;
            dx   = Math.max(-7.5, Math.min(7.5, (this.litDx||0)*2.5));
          }
          placeSound(ev, { dx: dx, dist: dist, inside:false }, this.bus);
          this.last=ev; return;
        }"""

WIRES = [
    (CITY, [('the city measures how far the nearest live circuit is',
             CITY_ANCHOR, CITY_REPLACE)]),
    (ALPHA, [('the shell learns it', WHERE_ANCHOR, WHERE_REPLACE),
             ('a dead block gets no machine and no lit sign, by place',
              PICK_ANCHOR, PICK_REPLACE),
             ('and by the old odds too, for a sender with no place',
              OLD_ANCHOR, OLD_REPLACE),
             ('and the lit sign on that path as well', SIGN_ANCHOR, SIGN_REPLACE),
             ('and the hum is as far away as the power is',
              PLACE_ANCHOR, PLACE_REPLACE)]),
]


def main():
    print('=== A LIT BLOCK HUMS ===')
    srcs = {}
    for path, wires in WIRES:
        srcs[path] = open(path, encoding='utf8').read()
    if all(MARK in s for s in srcs.values()):
        print('  already installed (idempotent, nothing to do)')
        return 0

    for path, wires in WIRES:
        s = srcs[path]
        for what, anchor, rep in wires:
            if s.count(anchor) != 1:
                print('FAIL: anchor for %s is not unique in %s (%d)'
                      % (what, path, s.count(anchor)))
                return 1
            s = s.replace(anchor, rep, 1)
            print('  WIRED  %s' % what)
        open(path, 'w', encoding='utf8').write(s)

    print('  a live circuit is audible and a dead one is not, and the distance '
          'is the grid\'s answer rather than a dial')
    print('  NOT WIRED, with a reason: power_on ("THE BLOCK LIGHTS") still has no '
          'moment -- POWER.douse() has a caller (the night bill) and '
          'POWER.relight() has none, by the grid\'s own written decision that '
          'the price of getting your lights back is his.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
