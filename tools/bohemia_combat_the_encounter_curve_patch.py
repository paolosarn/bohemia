#!/usr/bin/env python3
"""V167 THE ENCOUNTER CURVE. RF4-24 + RF4-26, and the precondition for RF4-37.

  Paolo 8/19: "its still not feeling like rogue fable 4 bro"

I went looking for the biggest FEEL gap in the spec rather than guessing, and it
is the only THREE-STAR row in the document, sitting at SPECED with the worst
measurement in the file:

  RF4-24  *** THE ENCOUNTER-SIZE RULE, IN HIS OWN DESIGN NOTES: "The typical
  encounter should have 3-4 enemies with 5-6 being very hard and anything above
  that being RESERVED FOR BOSS FIGHTS or very challenging vaults." Fights
  "become messy when there are more than about 5-6" and "devolve into MESSY
  KITING AND CHOKE-POINT ABUSE." ***
  MEASURED: 8.0 per fight. min 8, max 8, across 40 arenas.
  INSIDE RF4's 3-6 BAND: 0 OF 40.

*** EVERY FIGHT IN BOHEMIA IS BOSS-FIGHT SIZING, EVERY SINGLE TIME. ***

Read his complaints back with that in hand and they stop being separate notes.
"messy kiting and choke-point abuse" is RF4's designer describing, in advance and
in his own words, the exact fight Paolo keeps reporting: find cover, sit, grind,
nothing sharp ever happens. It is not that our systems are wrong. It is that
every encounter is being played at the size RF4 reserves for a BOSS.

--------------------------------------------------------------------------
AND IT WAS ONE BUTTON, LEFT ON
--------------------------------------------------------------------------
The demo settings carry a FOES row -- 1 / 3 / 5 / 8 -- and `8` has had the `on`
class since it was written. `G.numEnemies` defaults to 8 and setupEnemies reads
it straight. There is no curve, there is no roll, there is no variance. Eight,
forever, in every fight he has ever played.

THE SPEC ROUTES THIS TO ME BY NAME: "WHAT COMBAT DECIDES HERE, AND LAB MUST NOT
... the curve is design." And its gate says in as many words that eight is not a
ruling and 3-6 is not one either -- the divergence had to stay MEASURED AND
DECLARED until COMBAT landed the curve. This lands it.

--------------------------------------------------------------------------
HIS OWN WORDS POINT THE OTHER WAY, AND I AM NOT PRETENDING THEY DO NOT
--------------------------------------------------------------------------
  "I am really concerned how easy this game could be unless I throw 8+ enemies
   at a player"

That is Paolo, and it is the strongest argument against this change. Two things
answer it, and the second one is a measurement rather than an opinion.

FIRST: he said that BEFORE v154-v166. Since then a man needs an extra turn to
acquire, cover is a place you stand rather than a magic arc, there is a way out
you have to reach, the heavy cannot cut corners, and a wall now turns five enemy
systems off. The reason he wanted eight bodies was that the fight was too easy,
and RF4's own answer to "too easy" is the row right underneath: RF4-26, FEWER,
STRONGER, MIXED. More bodies is the stat-inflation answer. NO DAMAGE BEFORE THE
DIAL bans that everywhere else in this project for the same reason.

SECOND: I MEASURED IT BOTH WAYS, AND HE WAS RIGHT. Same policy, same rolls, 24
fights each, driven through the shipped return-fire path:

    PINNED 8    6.36 HP lost per turn   0.246 hits per turn   DIED 8 of 24
    THE CURVE   3.74 HP lost per turn   0.168 hits per turn   DIED 2 of 24

Turns per fight barely moved (8.6 against 9.4), so this is not a short-fight
illusion. HALF THE GUNS IS HALF THE INCOMING FIRE, and shuffling which archetypes
turn up barely dents it: moving the SEC-BOT earlier, from N>=5 to N>=4, bought
back 3.31 -> 3.74 and nothing more.

*** SO I AM SHIPPING IT WITH THE DROP DECLARED RATHER THAN HIDDEN, AND HERE IS
WHY THAT IS THE HONEST CALL AND NOT A DODGE. *** The only lever that closes that
gap is making each enemy hit harder, and NO DAMAGE BEFORE THE DIAL forbids me
from setting a damage number, full stop. The compensator RF4 actually uses is not
per-fight lethality at all -- it is ATTRITION ACROSS A FLOOR. You fight many small
encounters and your resources do not reset between them. In the COMBAT tab every
fight starts at 100 HP because it is a standalone arena, and wiring encounters
into a run belongs to another lane.

So the true sentence is: THE FIGHT IS SHARPER, SHORTER AND LESS LETHAL ONE FOR
ONE, and the thing that is supposed to make that add up is a run, which does not
exist here yet. That is written into the record and into the gate so it cannot
quietly become false, and the boss sizing he has been playing is one tap away in
the same panel.

--------------------------------------------------------------------------
WHAT THE CURVE IS
--------------------------------------------------------------------------
A distribution, not a constant, rolled per encounter off the arena's own dice so
it stays deterministic per seed:

    3 bodies  30%      typical
    4 bodies  35%      typical
    5 bodies  22%      "very hard"
    6 bodies  13%      "very hard", the top of the band
    7-8              NOT ROLLED -- reserved, exactly as his notes say, and still
                     one tap away on the FOES row for the stress case

Mean about 4.2. These are [DIAL] numbers and they are mine to pick under the
spec's own column rule; what is NOT mine is whether he wants boss sizing back,
and that stays one button away rather than buried.

*** HE CAN STILL DIRECT IT (8/12). *** The FOES row gains a CURVE button, on by
default, and 1 / 3 / 5 / 8 all still pin the size exactly as they do today. A
fight size he can no longer choose would be me taking a dial off him to make my
feature measure well.

--------------------------------------------------------------------------
AND FEWER ONLY WORKS IF THE GROUPS ARE COMPOSED (RF4-26)
--------------------------------------------------------------------------
  RF4-26  "Enemies should generally be more individually powerful, come in MIXED
  GROUPS and be designed to WORK TOGETHER, support and compliment each other."
  HALF BUILT: the bodies are differentiated; THE GROUPS ARE NOT COMPOSED.

They were picked by modular arithmetic on the slot index -- `i%4===3` is a bot,
`i%3===2` is a blade, one random slot is a sniper -- and every one of those rules
is gated on N being large. SHRINKING N ALONE WOULD HAVE MADE IT WORSE, and this
is the trap the whole change turns on: at N=4 the `N>=5` test kills the SEC-BOT
outright, and at N=3 the `N>=4` test kills the sniper too, so a small fight
degrades to goons and a stick. Fewer AND blander AND easier: precisely the
outcome he was afraid of, arrived at by doing half the work.

So the roster is COMPOSED FROM A SPINE instead, at every size:

    THE WORST MAN   one sniper whenever N>=3, placed at the BACK
    THE MACHINE     a SEC-BOT at N>=4, two at N>=6 (earlier than the old N>=5,
                    because half the bodies cannot carry a fight unless the ones
                    that remain are the dangerous ones -- RF4-26 verbatim)
    THE PRESSURE    a blade at N>=3, two at N>=6 (his 7/19 MELEE MIX still rules
                    this: OFF means none, PACK still doubles it)
    THE REST        goons

A three-man fight is now a sniper, a blade and a goon -- three different problems
arriving from three directions -- where before it was two goons and a stick.

--------------------------------------------------------------------------
WHICH IS ALSO RF4-37's MISSING PRECONDITION
--------------------------------------------------------------------------
  RF4-37  "PRIORITY TARGETS ARE THE CORE PUZZLE... rather than simply blasting
  away at whichever enemy is closest the player often needs to plan a few turns
  ahead, IGNORE THE NEAREST ENEMIES and maneuver himself into position to kill
  the Priority-Target WHO IS OFTEN HIDING IN THE BACK."
  PARTIAL: priority is computable. "What is missing is a target worth crossing
  the room for."

You cannot have a priority target in a crowd of eight interchangeable goons --
there is nothing to prioritise. Guaranteeing exactly one sniper, at the back, at
every size, is the precondition for that puzzle existing at all. The other half
-- making him WORTH crossing the room for, so ignoring him costs you -- is the
next item and is NOT claimed here. RF4-37 stays SPECED.

REUSE CHECK: cooks NO graphic pixels. Reuses makeEnemy, the existing ARCH table,
the existing sniperIdx/closeIdx/eliteIdx placement machinery and the arena's own
seeded dice (BohemiaArena.withDice) so a seed still reproduces a fight exactly.
No new archetype, no new art, no bank opened.

TASTE CHECK: authors no art. The taste rule is RF4's designer's own sentence,
which is also the reason this is worth doing at all: a fight of eight "devolves
into messy kiting and choke-point abuse". Three sharp problems beat eight dull
ones, and the restraint is that nothing was added to make it hard -- something
was taken away.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V167 THE ENCOUNTER CURVE'
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
        print('v167 already in; nothing to do')
        return

    # ---- 1. the curve, and the spine ---------------------------------
    old = """function setupEnemies(){ return BohemiaArena.withDice(setupEnemiesBody); }"""
    new = """/* ===== V167 THE ENCOUNTER CURVE (RF4-24, and RF4-26's other half) =====
   Paolo 8/19: "its still not feeling like rogue fable 4 bro."
   RF4-24 is the only THREE-STAR row in the teardown and it measured 8.0 per
   fight, min 8, max 8, across 40 arenas -- INSIDE RF4's BAND 0 OF 40. His own
   design notes: "the typical encounter should have 3-4 enemies with 5-6 being
   very hard and anything above that being RESERVED FOR BOSS FIGHTS", and fights
   above 5-6 "devolve into MESSY KITING AND CHOKE-POINT ABUSE."
   That last phrase is RF4's designer describing, in advance, the exact fight
   Paolo keeps reporting. Every encounter in this game has been played at boss
   sizing, forever, because the `8` button in the FOES row has had the `on` class
   since it was written and nothing ever rolled anything else. */
const ENC_SIZES=[3,4,5,6];        /* [DIAL] 7-8 are RESERVED, per his notes, and stay one tap away on the FOES row */
const ENC_WEIGHTS=[30,35,22,13];  /* [DIAL] typical 3-4, "very hard" 5-6; mean about 4.2 */
function rollEncounterSize(){ let r=Math.random()*100,i=0;
  for(;i<ENC_WEIGHTS.length-1;i++){ if(r<ENC_WEIGHTS[i])break; r-=ENC_WEIGHTS[i]; }
  return ENC_SIZES[i]; }
/* ===== AND FEWER ONLY WORKS IF THE GROUP IS COMPOSED (RF4-26) =========
   "Enemies should be more individually powerful, come in MIXED GROUPS and be
   designed to work together." The bodies were already differentiated; the GROUPS
   were picked by modular arithmetic on the slot index, and every one of those
   rules was gated on N being big: `N>=5` for the machine, `N>=4` for the sniper.
   SHRINKING N ALONE WOULD HAVE MADE THE GAME WORSE -- a four-man fight would
   have lost its SEC-BOT and a three-man fight its sniper too, degrading to goons
   and a stick. Fewer AND blander AND easier is exactly what he was afraid of.
   So there is a SPINE at every size, and a three-man fight is three different
   problems from three directions rather than two goons and a stick. */
function composeRoster(N){
  const MM=(G.meleeMix==null)?1:G.meleeMix;   /* his 7/19 ruling still governs the blades */
  const out=[];
  if(N>=3)out.push('sniper');                                  /* THE WORST MAN, and he goes at the back */
  if(N>=6)out.push('bot','bot'); else if(N>=4)out.push('bot');  /* THE MACHINE, and it arrives EARLIER than the old N>=5 -- see the difficulty measurement in the record: half the bodies cannot carry the same fight unless the ones that remain are the dangerous ones, which is RF4-26 verbatim */
  const BL=['shiv','bat','spear'];
  let blades = (MM===0)?0 : (MM===2 ? Math.max(1,Math.floor(N/2)) : (N>=6?2:(N>=3?1:0)));
  for(let i=0;i<blades&&out.length<N;i++)out.push(BL[i%3]);    /* THE PRESSURE */
  while(out.length<N)out.push('human');                        /* THE REST */
  return out.slice(0,N); }
function setupEnemies(){ return BohemiaArena.withDice(setupEnemiesBody); }"""
    js = subN(js, old, new)

    # ---- 2. the size is rolled, unless he pinned it -------------------
    old = """  G.e=[]; const N=G.numEnemies; G.mTurn=0; G.selTarget=null;"""
    new = """  /* V167: THE SIZE IS ROLLED, off the ARENA'S OWN DICE so a seed still
     reproduces a fight exactly. He can still pin it: the FOES row's 1/3/5/8 all
     set encCurve false and work exactly as they do today, because a fight size
     he can no longer choose would be me taking a dial off him to make my own
     feature measure well. */
  if(G.encCurve!==false)G.numEnemies=rollEncounterSize();
  G.e=[]; const N=G.numEnemies; G.mTurn=0; G.selTarget=null;"""
    js = subN(js, old, new)

    # ---- 3. the sniper exists from three up, not four ----------------
    old = """  let sniperIdx=-1; if(N>=4){ let sp=0; do{ sniperIdx=Math.floor(Math.random()*N); }while(sniperIdx===closeIdx&&sp++<20); }"""
    new = """  /* V167: N>=3, not N>=4. RF4-37 says there is "almost always a highest priority
     target... often hiding in the back", and a three-man fight with no back line
     is a fight with nothing to prioritise. This slot is still never the close
     man, which is what puts him at the back. */
  let sniperIdx=-1; if(N>=3){ let sp=0; do{ sniperIdx=Math.floor(Math.random()*N); }while(sniperIdx===closeIdx&&sp++<20); }"""
    js = subN(js, old, new)

    # ---- 4. the roster is composed, not derived from the index -------
    old = """  for(let i=0;i<N;i++){ let arch=(N>=5 && i%4===3)?'bot':'human';
    /* MELEE MIX (Paolo 7/19): blades join the gunfight. SOME = every 3rd body,
       PACK = every other. Settings toggle; default SOME. */
    const MM=(G.meleeMix==null)?1:G.meleeMix;
    if(MM===1&&N>=3&&i%3===2)arch=['shiv','bat','spear'][((i/3)|0)%3];
    else if(MM===2&&i%2===1)arch=['shiv','bat','spear'][((i/2)|0)%3];
    if(i===sniperIdx)arch='sniper';   /* V39: overrides the melee-mix roll on his slot */
    const e=makeEnemy(i,arch);"""
    new = """  /* V167: COMPOSED, not derived from the slot index. MELEE MIX (Paolo 7/19)
     still rules the blades and still reads OFF / SOME / PACK -- it moved inside
     composeRoster with the rest of the recipe so there is ONE place that decides
     who turns up, instead of three modular tests that each disagree about how
     big a fight has to be before anybody interesting is in it. */
  const _roster=composeRoster(N);
  /* and the worst man goes to the BACK slot the spawn code already picks out */
  { const _pi=_roster.indexOf('sniper');
    if(_pi>=0&&sniperIdx>=0&&sniperIdx<N){ const _t=_roster[sniperIdx]; _roster[sniperIdx]=_roster[_pi]; _roster[_pi]=_t; } }
  for(let i=0;i<N;i++){ const arch=_roster[i];
    const e=makeEnemy(i,arch);"""
    js = subN(js, old, new)

    # ---- 5. and he can still direct it -------------------------------
    old = """      <button class="nb" data-n="1">1</button><button class="nb" data-n="3">3</button><button class="nb" data-n="5">5</button><button class="nb on" data-n="8">8</button>"""
    new = """      <button class="nb on" id="ncurve">CURVE</button><button class="nb" data-n="1">1</button><button class="nb" data-n="3">3</button><button class="nb" data-n="5">5</button><button class="nb" data-n="8">8</button>"""
    js = subN(js, old, new)

    old = """document.querySelectorAll('[data-n]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-n]').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  G.numEnemies=+b.dataset.n; fullResetCombat(); }));"""
    new = """/* V167: CURVE is the default and pinning a number turns it off. HE MUST BE ABLE
   TO DIRECT IT (8/12): the boss sizing he has been playing for weeks is still
   one tap away, it just is not what every fight is any more. */
{ const _cb=D('ncurve'); if(_cb)_cb.addEventListener('click',()=>{ audio();
    document.querySelectorAll('[data-n]').forEach(x=>x.classList.remove('on'));
    _cb.classList.add('on'); G.encCurve=true; fullResetCombat(); }); }
document.querySelectorAll('[data-n]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-n]').forEach(x=>x.classList.remove('on'));
  { const _cb=D('ncurve'); if(_cb)_cb.classList.remove('on'); }
  b.classList.add('on');
  G.encCurve=false; G.numEnemies=+b.dataset.n; fullResetCombat(); }));"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v167: the encounter curve -- %d chars' % len(js))


if __name__ == '__main__':
    main()
