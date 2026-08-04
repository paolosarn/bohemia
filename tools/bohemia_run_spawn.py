#!/usr/bin/env python3
"""
RUN SPAWN = THE DISTRICT WE ARE WORKING ON (Paolo 8/2/26).

  "when I first opened up the run it keeps like opening up in the very center of
   the map instead of the district that we're working on... so right now we're
   working on the suburb and every time I go to click on the run it like keeps
   wanting to start me off in the middle of the map... and make it easy for
   yourself moving forward like when we're upgrading a district or working on it
   together like I should be starting off there"

WHAT IT WAS. The city opened here, hardcoded:

    const city={x:0,y:0};
    // spawn on the strip street
    (function(){ const L=om.layout; city.x=L.stripX; city.y=Math.round(96*0.5); })();

`96*0.5` is literally the middle of the 96x96 valley, on the Strip. Every single
run, no matter what we were building. And because swapMode's DROP IN derives the
walked player from city.x/city.y --
    hx=city.x*FN+(FN>>1); hy=city.y*FN+(FN>>1);
-- that one line put BOTH the overview marker and the person in the wrong place.

WHAT IT IS NOW. One named setting, WORKING_DISTRICT, and the spawn finds the
nearest cell of that type to the valley centre. Deterministic (a full scan in a
fixed order, ties broken by scan order, no rng), so the same district type always
opens the same cell and his bearings do not move under him between sessions.

MAKING IT EASY FOREVER, which is the half he actually asked for:
    python3 tools/bohemia_run_spawn.py suburb
    python3 tools/bohemia_run_spawn.py commercial
Change the lane, run one command, the run opens there. The current setting is
also written to records/BOHEMIA_WORKING_DISTRICT.txt so any other session can see
where the run opens without decoding a 24MB blob to find out.

The Strip stays as the FALLBACK, so a district type that is not placed in this
valley can never leave the player nowhere.

REUSE CHECK: cooks no graphic pixels and opens no bank. Pure plumbing -- it moves
a camera, it does not design a map (MAP LAW: Claude never designs map layouts).

Idempotent per district: re-running with the same district reports NOOP.
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'   # legacy home; the resolver decides at run time
RECORD = 'records/BOHEMIA_WORKING_DISTRICT.txt'
MARKER = '__WORKING_DISTRICT__'

OLD = ("""const city={x:0,y:0};                  // marker on overmap slots
// spawn on the strip street
(function(){ const L=om.layout; city.x=L.stripX; city.y=Math.round(96*0.5); })();""")


def block(district):
    return ("""const city={x:0,y:0};                  // marker on overmap slots
/* """ + MARKER + """ (Paolo 8/2: "it keeps opening up in the very center of the map
   instead of the district that we're working on ... I should be starting off there").
   This was `city.y = Math.round(96*0.5)` -- the literal middle of the 96x96 valley,
   on the Strip, every run, whatever we were building. And swapMode's DROP IN derives
   the walked player from city.x/city.y, so the one line put BOTH the overview marker
   and the person in the wrong place.
   Set it with: python3 tools/bohemia_run_spawn.py <district>
   Current setting is mirrored in records/BOHEMIA_WORKING_DISTRICT.txt so another
   session can read it without decoding this blob. */
const WORKING_DISTRICT='""" + district + """';
(function(){
  /* nearest cell of that type to the valley centre. A FULL scan in a fixed order
     with ties broken by scan order: deterministic, so the run opens the same cell
     every time and his bearings never move under him between sessions. */
  let best=null,bd=Infinity; const cx=om.n>>1, cy=om.n>>1;
  for(let y=0;y<om.n;y++)for(let x=0;x<om.n;x++){
    const t=om.at(x,y); if(!t||t.district!==WORKING_DISTRICT) continue;
    const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);
    if(d<bd){ bd=d; best=[x,y]; }
  }
  if(best){ city.x=best[0]; city.y=best[1]; return; }
  /* FALLBACK: a district type not placed in this valley must never leave the
     player nowhere, so the old Strip spawn is kept as the safety net. */
  const L=om.layout; city.x=L.stripX; city.y=Math.round(96*0.5);
})();""")


def main():
    district = (sys.argv[1] if len(sys.argv) > 1 else 'suburb').strip()
    if not re.fullmatch(r'[a-z_]+', district):
        print('FAIL: district must be a bare lowercase name, got %r' % district); return 1

    # WHERE the city app lives and WHAT SHAPE it is in are not this tool's business
    # (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
    # base64-ing it, and this tool -- the one the gate tells a session to run --
    # would have died on 'CITY_B64 not found'. One resolver knows.
    sys.path.insert(0, os.path.join(REPO, 'gates'))
    import bohemia_city_app as CITY_APP
    app = CITY_APP.read()
    if app is None:
        print('FAIL: the city app is not in any of: '
              + ', '.join(CITY_APP.searched())); return 1
    target, city = app.file, app.src
    alpha = open(target, encoding='utf8', errors='ignore').read()
    if app.inline:
        lo = hi = 0
    else:
        m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
        if not m:
            print('FAIL: CITY_B64 not found'); return 1
        lo, hi = m.start(1), m.end(1)

    cur = re.search(r"const WORKING_DISTRICT='([a-z_]+)'", city)
    if cur:
        if cur.group(1) == district:
            print("NOOP: the run already opens in '%s'" % district); return 0
        # already patched, just swap the name
        new_city = city[:cur.start(1)] + district + city[cur.end(1):]
        was = cur.group(1)
    else:
        if city.count(OLD) != 1:
            print('FAIL: the spawn block is not where this tool expects it '
                  '(%d matches)' % city.count(OLD)); return 1
        new_city = city.replace(OLD, block(district), 1)
        was = 'the strip, at the centre of the map'

    if app.inline:
        open(target, 'w', encoding='utf8').write(new_city)
    else:
        out = base64.b64encode(new_city.encode('utf8')).decode('ascii')
        open(target, 'w', encoding='utf8').write(alpha[:lo] + out + alpha[hi:])
    open(RECORD, 'w').write(
        district + "\n\n"
        "THE RUN OPENS HERE (Paolo 8/2). Set it with:\n"
        "    python3 tools/bohemia_run_spawn.py <district>\n"
        "Whatever district we are building, the run should start there. This file is\n"
        "the readable mirror of the WORKING_DISTRICT constant inside the city blob, so\n"
        "no session has to decode 24MB to find out where the run opens.\n"
        "Gate: gates/run_spawn_gate.js\n")
    print('wrote %s' % target)
    print("  the run now opens in: %s   (was: %s)" % (district, was))
    print('  mirrored to %s' % RECORD)
    return 0


if __name__ == '__main__':
    sys.exit(main())
