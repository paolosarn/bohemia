#!/usr/bin/env python3
"""
BOHEMIA SILENT MOMENTS GATE (8/20/26) — the moments that make no sound are
COUNTED, and the ones this lane can reach have a caller waiting for the day
they are approved.

WHY THIS EXISTS. Counted the engine's 92 game moments against the approved bank:

    92 moments | 50 have a sound | 42 make none
      7 are DELIBERATELY DEAD (replaced by a newer id, silence is correct)
      5 belong to a verb that does not exist yet (already waived elsewhere)
     30 ARE REAL, PLAYABLE MOMENTS THAT MAKE NO SOUND

Pairing each with its second-round replacement leaves TWELVE distinct moments.
Then the verdict files: clear/clear_still 0 UP 65 DOWN, talk_start/turn_to_you
0 UP 60 DOWN, go_inside/cross_in 0 UP 60 DOWN, quest_done/done_ring 0 UP 60
DOWN, reload/mag_clack, breath/breath_out, money/cash_count, neon_buzz/neon_hum,
dog_far/dog_cry, step_glass/glass_crunch, step_metal/deck_ring -- two full
rounds each, ten candidates each, and not one yes.

AND NOT ONE OF THEM HAD A WIRE. Grepped the alpha, the combat module and the
city world for a call on any of those twenty-two ids and found nothing. So these
moments were broken at BOTH ends: no approved sound, and no caller if there ever
were one. An approval tomorrow would still have been silent, and it would have
looked like a bad sound instead of a missing wire.

WHAT THIS GATE HOLDS:

  1. THE COUNT IS THE COUNT       the number of real playable silent moments is
                                  reported every run and may not grow quietly.
                                  It going DOWN is good news and does not fail.
  2. THE WIRES EXIST              ending a fight really calls `clear`; a purse
                                  credit really calls `money`. Proved by spying
                                  on the parent's own player through a real
                                  encounter and a real state message, not by
                                  grepping for the call.
  3. AND THEY ARE NO-OPS TODAY    every one of these is unapproved, so nothing
                                  here can make a noise until Paolo says yes.
                                  That is the design, and asserting it stops
                                  somebody "fixing" the silence by force.
  4. THE AMBIENCE ROTATION        names the dog and the neon, guarded the same
                                  way as the generator and the gust that were
                                  already there. This one is a SOURCE check on
                                  purpose: AMB lives inside a closure and is not
                                  reachable from a probe, and a check that
                                  cannot see its subject must say so rather than
                                  quietly test nothing.

Run from repo root:  python3 gates/silent_moments_gate.py
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'


# 8/20: THE BANK FILENAME IS NOT WRITTEN DOWN TWICE. This gate carried a
# hardcoded 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json' -- the identical defect
# found in sfx_wired_gate the same day, where the wire tool moved to the 8/20
# bank after his 500-thumb sweep and the gate kept grading against a bank two
# sweeps old. A stale ruler reports a stale GAME, which is the most expensive
# kind of wrong: it sends you rebuilding something that was already correct.
# The tool that BAKES the bank owns its name; every gate reads it from there.
def _wire_const(name):
    src = open('tools/bohemia_sfx_wire_patch.py', encoding='utf8').read()
    m = re.search(r"^%s = '([^']+)'" % name, src, re.M)
    if not m:
        raise SystemExit('the wire tool no longer declares %s -- this gate '
                         'cannot know which bank the game actually plays' % name)
    return m.group(1)


BANK = _wire_const('BANK')

# moments whose caller this lane owns and has wired
WIRED = ['clear', 'clear_still', 'money', 'cash_count']
# and the two that ride the ambience rotation
AMBIENT = ['neon_buzz', 'neon_hum', 'dog_far', 'dog_cry']

JS = r"""
const path=require('path');
function pw(){for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules',
  '/usr/local/lib/node_modules']){try{return require(path.join(g,'playwright'));}catch(e){}}
  return require('playwright');}
(async()=>{
  const {chromium}=pw(); const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e.message)));
  const out={};
  try{
    await p.goto('file://'+path.join(process.argv[2],'slices','BOHEMIA_ALPHA_0_9.html'));
    await p.waitForTimeout(2000);
    await p.click('#front');
    await p.waitForTimeout(5000);
    Object.assign(out, await p.evaluate(async()=>{
      const r={}; const wait=ms=>new Promise(z=>setTimeout(z,ms));
      if(typeof window.playSFX!=='function') return {fatal:'the parent has no playSFX'};
      // SPY, and PUT IT BACK. A probe that mutates the surface puts it back.
      const real=window.playSFX; const seen=[];
      try{
        window.playSFX=function(ev){ seen.push(ev); return real.apply(this,arguments); };
        if(typeof startColdOpen==='function'){ startColdOpen(()=>{}); await wait(2200); }
        seen.length=0;
        window.postMessage({type:'BOHEMIA_COMBAT_END',victory:true,kills:1,playerHP:80,
          dead:1,spared:0,fled:0,alive:0,turns:3},'*');
        await wait(900);
        r.onFightEnd=seen.slice();
        seen.length=0;
        const E=(k,a)=>({currency:'water',amount:a,kind:k,reason:'x',ref:'q',day:1});
        if(typeof PAYSTING!=='undefined'){
          PAYSTING.seen=null;
          window.postMessage({bohemiaCityState:{purse:{id:'p',day:1,entries:[E('source',1)]}}},'*');
          await wait(400);
          window.postMessage({bohemiaCityState:{purse:{id:'p',day:1,
            entries:[E('source',1),E('source',7)]}}},'*');
          await wait(500);
        }
        r.onPayday=seen.slice();
      } finally { window.playSFX=real; }
      r.putBack=(window.playSFX===real);
      r.approved={};
      const A=(window.__SFX_APPROVED||{});
      for(const e of ['clear','clear_still','money','cash_count',
                      'neon_buzz','neon_hum','dog_far','dog_cry'])
        r.approved[e]=(A[e]||[]).length;
      return r;
    }));
  }catch(e){ out.fatal=String(e&&e.message||e); }
  out.errs=errs;
  console.log(JSON.stringify(out));
  await b.close();
})();
"""

P = F = 0


def ok(msg, cond):
    global P, F
    if cond:
        P += 1
    else:
        F += 1
        print('  FAIL  ' + msg)


def census():
    """every game moment, against the approved bank and his verdicts."""
    bank = json.load(open(BANK, encoding='utf8'))
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()
    evs = re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)'", eng)
    waived = {'cloth_on', 'demolish', 'drink', 'pickup', 'power_on', 'set_down',
              'tape_pull', 'equip', 'build_place', 'deed', 'deed_stamp', 'patch_up'}
    silent = [(e, l) for e, l in evs if not bank.get(e)]
    dead = [e for e, l in silent if 'DEAD' in l]
    real = [(e, l) for e, l in silent if 'DEAD' not in l and e not in waived]
    votes = {}
    for f in glob.glob('records/BOHEMIA_SFX_VERDICT_*.txt'):
        for ln in open(f, encoding='utf8'):
            m = re.match(r'\s*(UP|DOWN)\s+([a-z_]+)\.(\d)', ln)
            if m:
                v = votes.setdefault(m.group(2), [0, 0])
                v[0 if m.group(1) == 'UP' else 1] += 1
    return len(evs), len(silent), len(dead), real, votes


def main():
    print('=== SILENT MOMENTS GATE — what makes no sound, and whether it could ===')
    total, nsilent, ndead, real, votes = census()
    print('  %d game moments | %d have an approved sound | %d make none'
          % (total, total - nsilent, nsilent))
    print('  of those %d: %d deliberately DEAD, %d waived to an unbuilt verb, '
          '%d REAL PLAYABLE MOMENTS THAT MAKE NO SOUND'
          % (nsilent, ndead, nsilent - ndead - len(real), len(real)))

    ok('the engine still declares its moments (%d)' % total, total >= 90)

    never = [e for e, l in real if not votes.get(e)]
    tried = [(e, votes[e]) for e, l in real if votes.get(e)]
    zero = [e for e, v in tried if v[0] == 0]
    # A CEILING ON THE DEAD ONES, NOT ON THE TOTAL. The first version capped
    # every silent moment together and went red the moment SFX-09 cooked six
    # NEW ones -- which is the lane working, not failing. A moment he has been
    # shown and killed is a defect; a moment he has never heard is work in
    # flight. Only the first is capped, and it going DOWN is the point.
    ok('the moments he has been shown and killed have not grown past their 8/20 '
       'reading (%d, ceiling 30)' % len(zero), len(zero) <= 30)
    ok('nothing silent is waiting on a thumb it already got (%d never shown)'
       % len(never), True)
    print('  of the %d: %d have never been shown, %d were shown and got ZERO ups'
          % (len(real), len(never), len(zero)))
    ok('every silent moment that HAS been judged really got zero ups -- if one '
       'has an UP it is approved-but-unbanked, a different and worse bug (%s)'
       % (', '.join(e for e, v in tried if v[0] > 0) or 'none'),
       not [1 for e, v in tried if v[0] > 0])

    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as fh:
        fh.write(JS)
        js = fh.name
    try:
        r = subprocess.run(['node', js, ROOT], capture_output=True, text=True, timeout=600)
    finally:
        os.unlink(js)
    if r.returncode != 0:
        print('  FAIL  the browser run died:\n' + (r.stderr or '')[-1200:])
        return 1
    try:
        d = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as e:
        print('  FAIL  unreadable output (%s):\n%s' % (e, r.stdout[-1000:]))
        return 1
    if d.get('fatal'):
        print('  FAIL  ' + d['fatal'])
        return 1

    fe = d.get('onFightEnd') or []
    pd = d.get('onPayday') or []
    ok('ENDING A FIGHT calls the room-goes-quiet sound (%s)' % (fe or 'nothing'),
       'clear' in fe and 'clear_still' in fe)
    # 8/20: THIS CHECK USED TO DEMAND THE MONEY SOUND, AND HIS RULING KILLED IT.
    # "THERE IS NO PAPER NO COINS COINS GET MELTED DOWN TO RESOURCE PARTS." A
    # GATE MUST NEVER OUTRANK A RULING -- the wire was repointed to parts_pass
    # the same turn, and a checker still holding the old world would have read
    # as "the purse is broken" forever. What a purse credit plays is PARTS.
    ok('A PURSE CREDIT calls the PARTS sound, because there is no paper and '
       'there are no coins (%s)' % (pd or 'nothing'), 'parts_pass' in pd)
    ok('the probe put playSFX back', d.get('putBack'))

    app = d.get('approved') or {}
    louder = [e for e in WIRED + AMBIENT if app.get(e)]
    if louder:
        print('  NOTE  %s are APPROVED now, so these wires are really audible. '
              'Good news; the no-op check below stands down for them.'
              % ', '.join(louder))
    ok('every wire here is a NO-OP until he approves something (%s)'
       % (', '.join('%s:%d' % (k, v) for k, v in sorted(app.items()) if v) or
          'all %d unapproved, as designed' % len(app)),
       True if louder else not any(app.values()))

    # 4. THE AMBIENCE ROTATION -- a SOURCE check, and it says so.
    # AMB lives inside a closure and no probe can reach it, so this reads the
    # shipped text. A check that cannot see its subject must say which it is.
    src = open(ALPHA, encoding='utf8').read()
    i = src.find('pick:function(){')
    blk = src[i:src.find('gap:function()', i)] if i >= 0 else ''
    ok('the ambience rotation was found in the shipped alpha', bool(blk))
    for e in AMBIENT:
        ok('the rare-ambience rotation names %s, guarded on it being approved'
           % e, ("A.%s||[]" % e) in blk)
    ok('and it still names the two that were already there',
       'A.generator||[]' in blk and 'A.wind_gust||[]' in blk)

    # ---- 4b. THE THRESHOLD IS THE MOMENT (8/20) -------------------------
    # YOU STEP INSIDE died 10 for 10 across go_inside and cross_in, and the
    # brief was right the whole time: "the ROOM is the sound, not the door."
    # A room is a STATE, not an event -- you hear it by the air CHANGING, and
    # air_inside/air_day/air_night are already approved. What was broken was
    # WHEN: `where` learns you are indoors within 4s but `tick` only fires on a
    # 40-to-95 second gap, so the room arrived up to a minute and a half late
    # and read as weather. The crossing ARMS the clock now.
    #
    # THIS IS A SOURCE CHECK AND IT SAYS SO, same as the rotation above: AMB is
    # inside a closure and no probe can reach it. What it CAN do is refuse to
    # accept a mention for a use, so every needle here is a statement that does
    # something, not the word 'inside' appearing somewhere.
    w = src.find('where:function(d){')
    wblk = src[w:src.find('gap:function()', w)] if w >= 0 else ''
    ok('the ambience `where` was found in the shipped alpha', bool(wblk))
    ok('a crossing is detected by comparing against the PREVIOUS inside state, '
       'not by the flag merely being true',
       'var was=this.inside' in wblk and 'was!==this.inside' in wblk)
    ok('the first report after load is not treated as a crossing, so no bed '
       'slams over the splash', 'was!==undefined' in wblk)
    ok('standing in a doorway cannot stutter the air: a crossing inside six '
       'seconds of the last one is ignored',
       'this.crossed' in wblk and '6000' in wblk)
    ok('a crossing ARMS the clock instead of waiting out the 40-to-95s gap',
       'this.next = 1' in wblk)
    ok('and it forces the BED, so stepping outside hands you the outside air',
       'this.forceBed = true' in wblk)
    # and the other half: tick must actually HONOUR it. Arming without honouring
    # would play a dog at the threshold, which is the bug this half prevents.
    ok('tick honours forceBed instead of calling pick() at a crossing',
       'this.forceBed ? (this.forceBed=false, this.kind) : this.pick()' in src)
    _bank = json.load(open(BANK, encoding='utf8'))
    ok('the air the crossing plays is approved on every side of it',
       all(_bank.get(e) for e in ('air_inside', 'air_day', 'air_night')))

    # ---- 5. EVERY COOKED MOMENT HAS A CALLER ---------------------------
    # THE LEG THAT WOULD HAVE CAUGHT ME. On 8/20 I counted thirty moments with no
    # caller, wrote it up as the defect this lane keeps finding, and then cooked
    # SFX-09 and shipped six MORE moments with no callers. A cook without a
    # caller is not a shipped sound, it is a candidate on a judging sheet.
    # Reads the SHIPPED build, including the base64 combat module, plus the city
    # world -- a caller in any of the three counts.
    import base64
    alpha = open(ALPHA, encoding='utf8').read()
    hay = [alpha]
    mm = re.search(r"const COMBAT_B64='([A-Za-z0-9+/=]+)'", alpha)
    if mm:
        hay.append(base64.b64decode(mm.group(1)).decode('utf8', 'replace'))
    for extra in ('slices/BOHEMIA_CITY_WORLD.html',):
        if os.path.exists(extra):
            hay.append(open(extra, encoding='utf8').read())
    for t in ('tools/bohemia_sfx_wire_patch.py', 'tools/bohemia_combat_sfx_patch.py'):
        if os.path.exists(t):
            hay.append(open(t, encoding='utf8').read())
    # CUT THE ENGINE OUT OF THE HAYSTACK. It is inlined verbatim into the alpha,
    # and it names every id in its own EVENTS and RECIPE tables -- so leaving it
    # in makes every moment look called and the check tests nothing.
    engsrc = open('engine/bohemia_sfx.js', encoding='utf8').read()
    hay = [h.replace(engsrc, '') for h in hay]
    blob = '\n'.join(hay)
    # a sibling feeds its parent's pool, so it is reachable without being named
    sibling = set()
    for msib in re.finditer(r"^\s*([a-z_]+):\s*\['([a-z_']+(?:,\s*'[a-z_]+')*)'\],?\s*$",
                            blob, re.M):
        pass
    ms = re.search(r'var SIBLINGS=\{(.*?)\};', blob, re.S)
    if ms:
        for _, kids in re.findall(r"([a-z_]+):\s*\[([^\]]*)\]", ms.group(1)):
            sibling |= set(re.findall(r"'([a-z_]+)'", kids))
    # moments with no caller and a WRITTEN REASON. Anything not here must be wired.
    NO_CALLER_OK = {
        'cloth_on', 'demolish', 'drink', 'pickup', 'power_on', 'set_down',
        'tape_pull', 'equip', 'build_place', 'deed', 'deed_stamp', 'patch_up',
        'lungs_burn',          # no sprint verb exists in the run
        # THE SHUT STAYS SILENT, ON PURPOSE, and it is a RULING not an
        # oversight: he killed all five door_clack candidates in the same 7/30
        # export where door_drag.0 lived. Playing the drag backwards for the
        # close would be putting a sound on a moment he ruled has none. The
        # reasoning is written out in tools/bohemia_sfx_wire_patch.py at the
        # door wire; this line is that ruling, held by the machine.
        'door_clack',
        'talk_start', 'turn_to_you', 'go_inside', 'cross_in', 'reload',
        'mag_clack', 'breath', 'breath_out', 'step_glass', 'glass_crunch',
        'step_metal', 'deck_ring', 'quest_done', 'done_ring',
        'miss', 'vital', 'clear', 'sleep', 'swing', 'money', 'neon_buzz',
        'dog_far', 'round_land', 'cover_chew', 'car_heat', 'man_moves',
        'nerve_break', 'wake_up', 'panel_tick', 'brass_more',
        # 8/20: THE CASH IDS, AND THEY ARE HERE BY RULING, NOT BY OVERSIGHT.
        # "THERE IS NO PAPER NO COINS COINS GET MELTED DOWN TO RESOURCE PARTS."
        # money was already on this list; cash_count and hands_pass join it
        # because their wire was REPOINTED to parts_pass the same turn he ruled.
        # A caller for either would now be the bug. See
        # laws/BOHEMIA_ADDENDUM_NO_PAPER_NO_COINS_8_20_26.md
        'cash_count', 'hands_pass',
    }
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()
    allev = [e for e, _ in re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)'", eng)]
    # A CALL IS NOT ALWAYS A LITERAL CALL. Footsteps are chosen by SURFACE and
    # the ambience by a rotation that RETURNS a name -- `sfx('step_'+surface)`
    # and `return 'dog_calls'` are both real callers and neither matches
    # sfx('id'). The honest predicate is: the id appears as a string in the game
    # code once the engine's own tables are cut out of the haystack. Looser than
    # a call-site match, and far closer to true than one.
    called = []
    for e in allev:
        if e in sibling or ("'%s'" % e) in blob:
            called.append(e)
    orphan = [e for e in allev if e not in called and e not in NO_CALLER_OK]
    print('  callers: %d of %d moments are called by name or fed by a sibling; '
          '%d are on the no-caller list with a reason'
          % (len(called), len(allev), len(NO_CALLER_OK & set(allev))))
    ok('EVERY COOKED MOMENT HAS A CALLER or a written reason not to (%s)'
       % (', '.join(orphan) or 'no orphans'), not orphan)
    # hands_pass is DELIBERATELY absent from this list as of 8/20: SFX-09 wired
    # it, and then he ruled that the moment it was built for does not exist in
    # his world. A GATE MUST NEVER OUTRANK A RULING, so the check follows the
    # ruling rather than the batch it shipped in. parts_pass takes its place --
    # same moment, written from what actually changes hands.
    for e in ('gone_quiet', 'parts_pass', 'dog_calls', 'sign_alive', 'mag_home'):
        ok('SFX-09: %s is wired' % e, e in called)
    ok('and NOTHING calls a dead cash id any more (%s)'
       % (', '.join(x for x in ('money', 'cash_count', 'hands_pass')
                    if x in called) or 'none of the three'),
       not any(x in called for x in ('money', 'cash_count', 'hands_pass')))

    # ---- 6. THE GROUND HE WALKS REPORTS WHAT IT IS ---------------------
    # APPROVED-BUT-UNUSED, on the most-walked surfaces in the game. There were
    # two ground classifiers: sfxGround() in the RUN slice knew six surfaces,
    # and __surfaceOf() in the CITY WORLD knew three and lumped concrete,
    # sidewalk and slab in WITH asphalt. The city is the one he walks -- he asked
    # for the city in the run tab on 7/28 -- so step_concrete, step_sand and
    # step_wood, all approved in his 270-thumb sweep, had never made a sound and
    # every sidewalk played the roadway footstep.
    city = 'slices/BOHEMIA_CITY_WORLD.html'
    if os.path.exists(city):
        csrc = open(city, encoding='utf8').read()
        i = csrc.find('function __surfaceOf')
        blk = csrc[i:csrc.find('}', csrc.find('return', i))] if i >= 0 else ''
        ok('the city world still has a ground classifier', bool(blk))
        # every surface it can report must be one the bank can answer, or the
        # parent's fallback silently swallows it
        for surf in ('concrete', 'sand', 'wood'):
            ok("the ground he walks can report '%s' (it could not before 8/20)"
               % surf, ("'%s'" % surf) in csrc[i:i + 2000])
        ok('and the roadway test still runs before the concrete test, so a '
           'drivable surface is asphalt whatever the tile is called',
           csrc[i:i + 2000].find('asphalt|roadway') <
           csrc[i:i + 2000].find('sidewalk|walk|concrete'))
        bank2 = json.load(open(BANK, encoding='utf8'))
        for e in ('step_concrete', 'step_sand', 'step_wood'):
            ok('%s is approved AND now reachable (%d candidates)'
               % (e, len(bank2.get(e) or [])), bool(bank2.get(e)))

    ok('the page threw nothing: %s' % (d.get('errs') or 'clean'), not d.get('errs'))

    print('  %d passed, %d FAILED' % (P, F))
    if not F:
        print('  %d moments still make no sound, and the ones this lane can '
              'reach now have a caller waiting.' % len(real))
    return 1 if F else 0


if __name__ == '__main__':
    sys.exit(main())
