#!/usr/bin/env python3
"""
V190 THE MINI BOSSES -- a boss does not drop a trophy, it hands you a VERB.

  PAOLO 8/26, ruling on what experience is for:
  "LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
  ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND IN HAND WITH ABILITIES AND
  THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH
  BOHEMIA BRO!"

*** THE BOSSES HAVE EXISTED ON PAPER FOR THREE WEEKS AND NOT ONE OF THEM WAS IN
THE GAME. *** records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md holds FIFTY-THREE of
them, each with a NAME, a HOLD, a LOCK ("impossible before") and a GRANT, audited
across seven passes and TEN of his own rulings, with a gate (boss_ladder_gate.js)
holding every lock distinct. It is a document. You cannot fight it, you cannot
beat it, and nothing in the running game has ever read one byte of it.

So this does not invent a single boss. IT READS THE RECORD AT BUILD TIME and
emits his fifty-three, verbatim, into the fight -- name, hold, lock, grant, kind
and act, straight off the table. MECHANISM-MINE / CONTENTS-PAOLO'S, made
literal: if he edits the ladder, the game changes.

-------------------------------------------------------------------------
THE THREE THINGS A BOSS NEEDS, AND WHY THE TREE HAD TO COME FIRST
-------------------------------------------------------------------------
  1. HE HAS TO BE A DIFFERENT FIGHT. Six TRAITS, and every one of them is a rule
     the engine already understands, turned on for one man: armour (makeEnemy has
     read `armor` since 7/4 and its own comment says "elites/bosses/robots set it
     later" -- nothing has ever set it), V168's spotter, V177's breacher, V90's
     deck, V167's bodies standing with him, and the blade cadence. NOT ONE NEW
     DAMAGE NUMBER. A boss is 2.2x health and a job, never a bigger gun.
  2. THE KEY HAS TO LAND SOMEWHERE PERMANENT. V188's tree is the first thing in
     this game with a memory that survives a fight, and THAT IS WHY THIS COULD
     NOT HAVE BEEN BUILT BEFORE YESTERDAY. Keys save beside it, and they are
     published to the parent window so CITY, RUN and QUESTS can read what you
     have taken without knowing anything about combat.
  3. THE LOCK HAS TO BE REAL, OR THE GRANT IS A CERTIFICATE. Two of his fifty-
     three name verbs this engine already owns, so those two verbs go DARK until
     you take them: THE CLIMB holds the stairs and the deck, THE CHARGE holds the
     grenade. Press either and the game tells you WHO HAS IT. That is the whole
     ladder in one sentence, and it is the difference between a boss and a
     health bar with a name.

AND THE KEY IS ON HIS BODY. His ruling, 8/25: "you get experience and loot OFF
THEIR BODIES." The key drops where he falls and you walk to it, through whatever
is left of his people, on the exact machinery V181 built for the experience.

-------------------------------------------------------------------------
A BOSS FIGHT IS BIGGER, ON HIS OWN NOTES
-------------------------------------------------------------------------
V167 quotes RF4's designer: "the typical encounter should have 3-4 enemies with
5-6 being very hard and ANYTHING ABOVE THAT BEING RESERVED FOR BOSS FIGHTS." We
took the 3-6 band and left 7-8 unused because there was nothing to reserve it
FOR. Now there is: a boss fight rolls 6-8. The reserved band finally means what
his notes said it meant.

-------------------------------------------------------------------------
WHERE HE CHANGES IT HIMSELF (8/12)
-------------------------------------------------------------------------
COMBAT tab, DEMO SETTINGS, a BOSS row: every one of the fifty-three in a list,
pick one and the next fight is him. Plus what you hold, and a button that gives
it all back. Without that row a boss is something I can measure and he cannot
reach, which is the exact failure the 8/12 law exists to kill.

FIFTY-THREE, NOT SIXTY: the ladder is his and it says in its own first line that
it is "a pool to cut from, not a shipping list", and the final count sits under
"WHAT I AM NOT DECIDING". The machine runs whatever the record holds. Seven more
names in that file and seven more bosses are in the game with no code written.

REUSE CHECK: cooks no graphic pixels and opens no bank. Every body is an existing
ARCH, every trait is an existing engine flag, the drop is V181's drop, the save
is V188's save, the readout is setRead. The boss list is READ FROM HIS RECORD.

TASTE CHECK: no new HUD. The boss is a name in the enemy list you already read,
a line at the bell, and a thing on the ground where he fell.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import json
import os
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md'
MARK = 'V190 THE MINI BOSSES'

# *** WHAT HE FIGHTS WITH IS WHAT HE HOLDS. *** Declared per boss, one word each,
# never derived from a column -- the ARCH table's own comment says deriving a
# behaviour from a threshold is "authoring canon behind a formula", and it is
# right. [draft:true] on all of it: which man fights which way is his to redraw,
# and the row in COMBAT is where he sees it.
TRAIT = {
    # ACT 1 -- ANIMAL
    'pot': 'guard', 'tap': 'high', 'filter': 'guard', 'burn': 'breaker',
    'surveyor': 'eyes', 'climb': 'high', 'locksmith': 'plated', 'charge': 'breaker',
    'machinist': 'plated', 'plate': 'plated', 'tooth': 'quick', 'lens': 'eyes',
    'barber': 'quick', 'ink': 'quick', 'dogs': 'quick', 'ward': 'guard',
    'cistern': 'high', 'smith': 'plated', 'midwife': 'guard',
    # ACT 2 -- HUMAN
    'soil': 'guard', 'seed': 'guard', 'vat': 'plated', 'cold': 'plated',
    'drain': 'breaker', 'pump': 'high', 'lights': 'eyes', 'quarry': 'breaker',
    'glass': 'eyes', 'loom': 'quick', 'cracker': 'breaker', 'chemist': 'breaker',
    'pour': 'plated', 'foreman': 'guard', 'road': 'guard', 'wall': 'plated',
    'bones': 'quick', 'press': 'eyes', 'surgeon': 'quick', 'engine': 'quick',
    # ACT 3 -- CITY
    'rail': 'plated', 'dam': 'high', 'grid': 'eyes', 'line': 'guard',
    'board': 'eyes', 'lift': 'high', 'tower': 'high', 'house': 'guard',
    'marquee': 'high', 'wing': 'eyes', 'school': 'guard', 'creditor': 'guard',
    'implant': 'quick', 'uplink': 'eyes',
}


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def clean(s):
    """His prose, out of a markdown table and into a JS string, unchanged in
    meaning. Only the table's own emphasis marks come off."""
    s = s.replace('**', '').replace('—', '-').strip()
    return re.sub(r'\s+', ' ', s)


def read_ladder():
    """*** THE CONTENT IS HIS AND IT IS READ, NEVER RETYPED. *** Same parse the
    boss ladder gate uses (act from the section header, not from where a name is
    first mentioned -- v6 shipped two bosses in "act 0" because a prose mention
    came before the table)."""
    lad = open(LADDER, encoding='utf-8').read()
    act, rows = 0, []
    for line in lad.split('\n'):
        h = re.match(r'^##\s*ACT\s*([123])\b', line)
        if h:
            act = int(h.group(1))
        m = re.match(r'^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|', line)
        if not m:
            continue
        name = clean(m.group(2))
        bid = name.replace('THE ', '').strip().lower().replace(' ', '')
        rows.append({'i': int(m.group(1)), 'id': bid, 'n': name,
                     'holds': clean(m.group(3)), 'lock': clean(m.group(4)),
                     'grant': clean(m.group(5)), 'kind': clean(m.group(6)),
                     'act': act, 'trait': TRAIT.get(bid, 'guard'), 'draft': True})
    if len(rows) < 40:
        sys.exit('ladder parse: only %d bosses' % len(rows))
    missing = [r['id'] for r in rows if r['id'] not in TRAIT]
    if missing:
        sys.exit('no trait declared for: %s' % ', '.join(missing))
    if [r['i'] for r in rows] != list(range(1, len(rows) + 1)):
        sys.exit('ladder numbering has a gap')
    return rows


def main():
    if not os.path.exists(LADDER):
        sys.exit('no ladder record at ' + LADDER)
    rows = read_ladder()
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v190: already applied')
        return

    js_rows = ',\n'.join('  ' + json.dumps(r, ensure_ascii=False) for r in rows)

    # ---- 1. THE LADDER, IN THE GAME ----
    block = """/* ===== V190 THE MINI BOSSES ==========================================
   Paolo 8/26: "IT WILL GO HAND IN HAND WITH ABILITIES AND THE 60 MINI BOSSES IN
   THE GAME THAT GIVE YOU A NEW WAY TO INTERACT WITH BOHEMIA BRO!"
   *** EVERY ROW BELOW IS READ OUT OF HIS OWN RECORD AT BUILD TIME. *** Not one
   boss is invented here. records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md is seven
   passes, ten of his rulings and a gate holding every lock distinct, and until
   now it was a document you could not fight. The patch tool parses that table
   and emits it verbatim -- name, hold, lock, grant, kind, act. Edit the record
   and the game changes; that is MECHANISM-MINE / CONTENTS-PAOLO'S with the seam
   made out of a file instead of a promise.
   FIFTY-THREE, NOT SIXTY, and that is deliberate: the ladder's first line calls
   itself "a pool to cut from, not a shipping list" and puts the final count under
   WHAT I AM NOT DECIDING. Seven more names in that file is seven more bosses
   with no code written. */
const BOSSES=[
%s
];
/* *** SIX TRAITS, AND EVERY ONE IS A RULE THIS ENGINE ALREADY OBEYS. *** A boss
   is 2.2x health and A JOB. Not one new damage number, not one multiplier: NO
   DAMAGE BEFORE THE DIAL, and the thing that makes him hard is that he asks a
   question the five men beside him do not. */
const BOSS_TRAITS={
  guard:  {n:'HE IS NEVER ALONE',   says:'two of his stay on him'},
  plated: {n:'HE IS PLATED',        says:'flat armour -- small hits do not count'},
  eyes:   {n:'HE RANGES YOU',       says:'he spots, and every gun on the lot uses it'},
  breaker:{n:'HE BREAKS STONE',     says:'he shoots the rock you are behind'},
  high:   {n:'HE HOLDS THE HEIGHT', says:'he takes the deck and he stays on it'},
  quick:  {n:'HE CLOSES',           says:'he comes at you and he is fast'}
};
const BOSS_HP=2.2;        /* [DIAL] health, and health is the ONLY stat a boss inflates */
/* *** AND IT IS CAPPED, BECAUSE THE FIRST MEASUREMENT SAID SO. *** 2.2x on top
   of a SEC-BOT's 160 is 352, and with the plated armour on top that is twenty
   hits from a pistol -- not a hard fight, a LONG one, which is the "messy kiting"
   RF4's own designer warns about and the thing V167 shrank the roster to escape.
   The spread that survives is 99 (a sniper who holds the roof) to 200 (a plated
   machine), so WHICH boss you drew still changes how long he takes. */
const BOSS_HP_CAP=200;    /* [DIAL] */
const BOSS_ARMOR=9;       /* [DIAL] makeEnemy has read `armor` since 7/4 -- "elites/bosses/robots set it later" -- and nothing has ever set it */
const BOSS_XP=4;          /* [DIAL] the body is worth four ordinary men */
const BOSS_CHANCE=0.14;   /* [DIAL] how often one turns up unasked */
/* THE KEYS. What you have taken off somebody, permanently, across every fight
   you will ever have. Saved beside V188's tree because the tree is the first
   thing in this game with a memory, and PUBLISHED to the parent window so CITY,
   RUN and QUESTS can read what you hold without knowing a thing about combat. */
const KEYS={taken:[]};
function keysLoad(){
  try{ const raw=localStorage.getItem('bohemia.keys');
    if(raw){ const o=JSON.parse(raw); if(Array.isArray(o))KEYS.taken=o; } }
  catch(_e){}                       /* opaque origin: keep the in-memory copy */
  keysPublish(); return KEYS; }
function keysSave(){
  try{ localStorage.setItem('bohemia.keys',JSON.stringify(KEYS.taken)); }catch(_e){}
  keysPublish(); }
function keysPublish(){
  try{ window.bohemiaKeys=KEYS.taken.slice(); }catch(_e){}
  try{ parent.postMessage({bohemiaKeys:KEYS.taken.slice()},'*'); }catch(_e){} }
function keyHas(id){ return KEYS.taken.indexOf(id)>=0; }
function bossById(id){ for(const b of BOSSES)if(b.id===id)return b; return null; }
function bossWhoHolds(id){ const b=bossById(id); return b?b.n:'somebody'; }
/* *** THE KEY IS ON HIS BODY. *** His ruling, 8/25: "you get experience and loot
   OFF THEIR BODIES." So a boss's key falls where he falls and you walk to it,
   through whatever is left of his people, on V181's own drop machinery. */
function keyWin(id){
  const b=bossById(id); if(!b)return false;
  if(keyHas(id)){ try{ setRead(b.n+' AGAIN','you already hold this one','#8a7d66'); }catch(_e){} return false; }
  KEYS.taken.push(id); keysSave();
  try{ setRead('YOU TOOK '+b.n,b.grant,'#e8c88a'); }catch(_e){}
  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); }catch(_e){}
  return true; }
function keysForget(){ KEYS.taken=[]; keysSave();
  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); }catch(_e){} }
/* WHO IS IN THIS ONE. His pick always wins; otherwise it is a roll, and the roll
   only ever offers a man who still holds something you do not have -- meeting
   the same boss after you have taken his key is a fight with no door behind it. */
function rollBoss(){
  if(G.bossPick){ const b=bossById(G.bossPick); if(b)return b; }
  if(G.bossOff)return null;
  if(Math.random()>=BOSS_CHANCE)return null;
  const open=BOSSES.filter(b=>!keyHas(b.id));
  if(!open.length)return null;
  return open[Math.floor(Math.random()*open.length)]; }
/* which body he starts as. The trait picks it, so the man you see matches the
   job he does -- a breaker is a breacher, a man who holds the height is the man
   with the reach to make it worth holding.
   *** EYES IS AN ORDINARY BODY ON PURPOSE, AND THE FIRST CUT GOT IT WRONG. ***
   It read `sniper` for both EYES and HIGH, and ARCH.sniper already carries
   spotter:true -- so two of the six traits produced the identical man and only
   the deck told them apart. He is a GOON WHOSE JOB IS TO RANGE YOU, which is
   exactly what V168 built the spotter flag to mean, and now the only thing he
   inherits is the job. */
function bossArch(b){
  return b.trait==='quick' ? 'bat'
       : b.trait==='eyes'  ? 'human'
       : b.trait==='high'  ? 'sniper'
       : b.trait==='breaker'? 'breacher'
       : b.trait==='plated'? 'bot'
       : 'human'; }
""" % js_rows

    d = sub(d, "/* ===== V185 THE KIT (RF4-11, RF4-13) ==============================",
            block + "/* ===== V185 THE KIT (RF4-11, RF4-13) ==============================",
            what='the ladder in the game')

    # ---- 2. A BOSS FIGHT IS BIGGER, ON HIS OWN NOTES ----
    # *** THE BOSS IS ROLLED OUTSIDE THE ARENA'S DICE, AND THE FIRST CUT WAS NOT. ***
    # setupEnemiesBody runs inside BohemiaArena.withDice, which swaps Math.random
    # for a SEEDED stream so that, in V88's own words, "one number reproduces one
    # exact fight, forever." Rolling the boss in there consumed one draw off that
    # stream on EVERY fight, which silently re-dealt every arena Paolo has ever
    # written down -- and two long-standing gate arms went red the moment it
    # landed, which is the only reason it was caught. A feature that costs the
    # seeded stream a single draw is a feature that rewrites the whole map.
    d = sub(d,
        "function setupEnemies(){ return BohemiaArena.withDice(setupEnemiesBody); }",
        """function setupEnemies(){
  /* ===== V190 WHO IS IN THIS ONE, DECIDED BEFORE THE DICE ARE SWAPPED =======
     *** THIS LINE IS OUT HERE ON PURPOSE AND IT IS THE WHOLE BUG. *** Everything
     below runs on the ARENA'S OWN SEEDED STREAM (V88: "one number reproduces one
     exact fight, forever"). The first cut rolled the boss INSIDE that stream, so
     every fight in the game drew one extra number and every seed he has ever
     written down quietly became a different arena. Two gate arms that have
     nothing to do with bosses went red on the spot, which is the only reason it
     was caught. Out here it uses the real Math.random and the seeded stream is
     untouched: a fight with no boss deals exactly the arena it always dealt. */
  G._bossOn=null; G.boss=null; G.bossId=null;
  try{ G._bossOn=rollBoss(); }catch(_e){}
  return BohemiaArena.withDice(setupEnemiesBody); }""",
        what='the boss is rolled outside the dice')

    d = sub(d,
        "  if(G.encCurve!==false)G.numEnemies=rollEncounterSize();",
        """  if(G.encCurve!==false)G.numEnemies=rollEncounterSize();
  /* ===== V190: AND A BOSS FIGHT IS BIGGER, WHICH HIS OWN NOTES ALREADY SAID.
     V167 quotes RF4's designer: "the typical encounter should have 3-4 enemies
     with 5-6 being very hard and ANYTHING ABOVE THAT BEING RESERVED FOR BOSS
     FIGHTS." We built the 3-6 band and left 7-8 unused, because there was
     nothing in this game to reserve it FOR. There is now.
     THE DRAW IS INSIDE THE GUARD, never before it: a fight with no boss must
     leave the seeded stream exactly where it found it. */
  if(G._bossOn&&G.encCurve!==false)G.numEnemies=6+Math.floor(Math.random()*3);""",
        what='the reserved band')

    # ---- 3. ONE OF THEM IS SOMEBODY ----
    d = sub(d,
        "  (function v121Occupancy(){",
        """  /* ===== V190 ONE OF THEM IS SOMEBODY ==============================
     He REPLACES the last slot rather than adding a body, so the encounter curve
     V167 measured stays exactly true and the occupancy sweep below still sees
     every man. The size was already raised at the top of this function; a second
     pass adding a body on top of that would be two things deciding one number,
     which is the giants bug and the deck-teleport bug and I am not writing it a
     third time. */
  (function v190Boss(){
    const b=G._bossOn; if(!b||!G.e.length)return;
    const slot=G.e.length-1, old=G.e[slot];
    const e=makeEnemy(slot,bossArch(b));
    e.ea=old.ea; e.edist=old.edist; e.beatOffset=old.beatOffset; e.phase=old.phase;
    e.boss=true; e.bossId=b.id; e.n=b.n; e.elite=true;
    /* HEALTH IS THE ONLY STAT A BOSS INFLATES. No accuracy, no damage, no
       multiplier: NO DAMAGE BEFORE THE DIAL, and a boss who hits harder is a
       number, while a boss with a job is a fight. */
    e.max=Math.min(BOSS_HP_CAP,Math.round(e.max*BOSS_HP)); e.hp=e.max; e.hpMax=e.max;
    /* every trait below is a flag this engine already reads, turned on for one
       man. The flags live on e.E, so the object is COPIED first -- writing
       through to ARCH would give the whole archetype his job forever. */
    if(b.trait==='plated'){ e.armor=BOSS_ARMOR; }
    if(b.trait==='eyes'){ e.E=Object.assign({},e.E,{spotter:true}); }
    if(b.trait==='breaker'){ e.E=Object.assign({},e.E,{breach:true}); }
    if(b.trait==='quick'){ e.adv=3; e.cad=1; e.reach=1.8; e.melee=true; }
    if(b.trait==='high'){ const spots=(G.deck||[]).filter(T=>!T.stair);
      if(spots.length){ const T=spots[Math.floor(Math.random()*spots.length)];
        e.ea=T.ea; e.edist=T.edist; e.lvl=DECK_LVL; e.gcov=0; } }
    G.e[slot]=e;
    /* HE IS NEVER ALONE: two of his walk him in and stay inside three tiles.
       Placed by BEARING, so the spawn layout the arena rolled still reads. */
    if(b.trait==='guard'){ const others=G.e.filter(o=>o!==e&&(o.lvl|0)===(e.lvl|0));
      for(let k=0;k<2&&k<others.length;k++){ const g=others[k];
        g.ea=e.ea+(k?0.30:-0.30); g.edist=Math.max(2.5,e.edist+(k?1.4:-1.2));
        try{ snapBody(g); }catch(_x){} } }
    G.boss=b; G.bossId=b.id;
  })();
  (function v121Occupancy(){""",
        what='the boss body')

    # ---- 4. THE BELL SAYS WHO HE IS ----
    d = sub(d,
        "try{ if(G.shape)setRead(G.shape.n,G.shape.says,'#e8c88a'); }catch(_e){}",
        """try{ if(G.shape)setRead(G.shape.n,G.shape.says,'#e8c88a'); }catch(_e){}
  try{ keysLoad(); }catch(_e){}
  /* V190: and if somebody in this lot HOLDS something, his name goes last so it
     is the line still on screen when the fight starts. */
  try{ if(G.boss){ const T=BOSS_TRAITS[G.boss.trait]||{};
    setRead(G.boss.n+'  \\u00b7  '+(T.n||''),G.boss.holds+'  \\u2014  '+G.boss.grant,'#e8593a'); } }catch(_e){}""",
        what='the bell')

    # ---- 5. THE KEY FALLS WHERE HE FALLS ----
    d = sub(d,
        "                plate:plate,\n                _at:performance.now()}); }",
        """                plate:plate,
                /* V190: AND A BOSS LEAVES HIS KEY ON THE GROUND. His ruling,
                   8/25: "you get experience and loot OFF THEIR BODIES." A key
                   handed over at the killshot would be a cutscene; a key lying
                   in the open, with his people still shooting, is the last
                   decision of the fight. */
                key:(e.boss?e.bossId:null),
                xpMult:(e.boss?BOSS_XP:1),
                _at:performance.now()}); }""",
        what='the key drop')

    # ---- 6. AND YOU WALK TO IT ----
    d = sub(d,
        "      if(d.xp){ G.ledger=G.ledger||{}; G.ledger.xp=(G.ledger.xp||0)+d.xp;",
        """      /* V190: the key is taken by walking onto it, like everything else he
         ruled belongs on a body. */
      if(d.key){ try{ keyWin(d.key); }catch(_x){} }
      if(d.xp){ d.xp=Math.round(d.xp*(d.xpMult||1));
                G.ledger=G.ledger||{}; G.ledger.xp=(G.ledger.xp||0)+d.xp;""",
        what='taking the key')

    # ---- 7. TWO VERBS GO DARK UNTIL YOU TAKE THEM ----
    d = sub(d,
        "function doStairs(){ if(G.inc||G.over||G.phase!=='cover')return;",
        """/* ===== V190 THE LOCK IS REAL OR THE GRANT IS A CERTIFICATE ===========
   THE CLIMB, boss #6, holds "the last hoist that lifts" and its lock is written
   in his record as "EVERYTHING ABOVE THE GROUND FLOOR IS SCENERY". This engine
   has had a deck since V90 and stairs since V91, so that lock is not a metaphor
   here -- it is one function. Until you beat him the stairs tell you WHO HAS
   THEM, which turns a locked button into a name and an address. */
function doStairs(){ if(G.inc||G.over||G.phase!=='cover')return;
  if(!keyHas('climb')){ setRead('YOU CANNOT CLIMB',
    bossWhoHolds('climb')+' holds the hoist -- beat him and the height is yours','#c8a23a'); return; }""",
        what='the climb lock')

    d = sub(d,
        "function canThrow(){ return !G.over && G.phase==='cover' && !G.inc && !G.pGren",
        """/* V190: THE CHARGE, boss #8, holds "who still has anything that goes off" and
   its lock is "a wall is a wall, and a door is the only way in". The grenade is
   the only thing in this build that goes off, so it is his until you take it. */
function canThrow(){ return keyHas('charge') && !G.over && G.phase==='cover' && !G.inc && !G.pGren""",
        what='the charge lock')

    d = sub(d,
        "  if((G.pGrenLeft||0)<=0){ setRead('NO GRENADES','none left this fight','#8a7d66'); return; }",
        """  if(!keyHas('charge')){ setRead('YOU HAVE NOTHING THAT GOES OFF',
    bossWhoHolds('charge')+' holds the charges -- beat him and a wall stops being a wall','#c8a23a'); return; }
  if((G.pGrenLeft||0)<=0){ setRead('NO GRENADES','none left this fight','#8a7d66'); return; }""",
        what='the charge readout')

    # ---- 8. WHAT YOU HAVE TAKEN, IN THE TREE ----
    d = sub(d,
        "  panel.innerHTML=h; }",
        """  /* V190: AND WHAT YOU HAVE TAKEN OFF SOMEBODY. The tree is where a permanent
     thing lives, and a key is the most permanent thing in the game -- a perk
     makes you better at the fight, a key changes what the world will let you
     do. */
  { const t=(typeof KEYS!=='undefined'&&KEYS.taken)?KEYS.taken:[];
    h+='<div style="opacity:0.6;margin-top:7px">TAKEN OFF SOMEBODY ('+t.length+' of '+BOSSES.length+')</div>';
    if(!t.length)h+='<div style="opacity:0.5;font-size:10px">nothing yet. every one of them holds something you cannot do.</div>';
    for(const id of t){ const b=bossById(id); if(!b)continue;
      h+='<div style="color:#e8c88a;margin:2px 0">\\u2714 '+b.n+'<span style="opacity:0.7"> \\u2014 '+b.grant+'</span></div>'; } }
  panel.innerHTML=h; }""",
        what='keys in the tree')

    # ---- 9. WHERE HE CHANGES IT HIMSELF (8/12) ----
    d = sub(d,
        '  <div class="setgrp"><span class="gl">DIFFICULTY PACKAGE</span>',
        """  <div class="setgrp"><span class="gl">BOSSES &mdash; every one of them holds something you cannot do</span>
    <div class="controls">
      <select id="bosssel" class="cbtn" style="font-family:'Space Grotesk';font-size:10px;letter-spacing:1px;padding:5px 6px;cursor:pointer;max-width:60%"></select>
      <button id="bossforget" class="cbtn" style="border-color:#8a5c3a;color:#c8a23a">GIVE IT ALL BACK</button>
      <div id="bossrow" style="font-size:10px;color:#8a7d66;letter-spacing:1px;flex:1 1 100%;text-align:left;line-height:1.5"></div>
    </div>
  </div>

  <div class="setgrp"><span class="gl">DIFFICULTY PACKAGE</span>""",
        what='the boss row')

    d = sub(d,
        "  const sb2=D('stairbtn'); if(sb2)sb2.addEventListener('click',()=>doStairs());",
        """  const sb2=D('stairbtn'); if(sb2)sb2.addEventListener('click',()=>doStairs());
  /* ===== V190 WHERE HE CHANGES IT HIMSELF (8/12) ====================
     "WHERE DOES HE CHANGE THIS HIMSELF?" If the answer is "he tells me and I
     edit a file", it is not shipped. Fifty-three names in a list, pick one and
     the next fight is him, plus what you hold and a way to hand it back. */
  try{ keysLoad(); }catch(_e){}
  (function v190Row(){
    const sel=D('bosssel'); if(!sel)return;
    let o='<option value="">BOSS: WHOEVER TURNS UP</option><option value="off">BOSS: NOBODY</option>';
    for(const A of [1,2,3]){ o+='<option disabled>-- ACT '+A+' --</option>';
      for(const b of BOSSES.filter(x=>x.act===A))
        o+='<option value="'+b.id+'">'+b.i+'. '+b.n+'</option>'; }
    sel.innerHTML=o;
    sel.addEventListener('change',()=>{
      G.bossPick=(sel.value&&sel.value!=='off')?sel.value:null;
      G.bossOff=(sel.value==='off');
      updBossRow();
      if(G.bossPick){ const b=bossById(G.bossPick);
        try{ setRead('NEXT FIGHT: '+b.n,b.holds,'#e8c88a'); }catch(_e){} } });
    const fb=D('bossforget');
    if(fb)fb.addEventListener('click',()=>{ keysForget();
      try{ setRead('GAVE IT ALL BACK','every key is on somebody else again','#c8a23a'); }catch(_e){} });
    updBossRow(); })();""",
        what='the boss row wiring')

    # updBossRow lives with the rest of the boss code
    d = sub(d,
        "function bossArch(b){",
        """function updBossRow(){ const r=D('bossrow'); if(!r)return;
  const t=KEYS.taken.length;
  const lines=['YOU HOLD '+t+' OF '+BOSSES.length+'.'];
  for(const id of ['climb','charge']){ const b=bossById(id); if(!b)continue;
    lines.push((keyHas(id)?'\\u2714 ':'\\u2717 ')+b.n+' \\u2014 '+b.grant); }
  if(G.boss)lines.push('IN THIS FIGHT: '+G.boss.n+' \\u2014 '+((BOSS_TRAITS[G.boss.trait]||{}).n||''));
  r.textContent=lines.join('   \\u00b7   '); }
function bossArch(b){""",
        what='updBossRow')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    from collections import Counter
    c = Counter(r['trait'] for r in rows)
    print('v190: %d mini bosses off his record -- %s -- %d chars'
          % (len(rows), ' '.join('%s:%d' % kv for kv in sorted(c.items())), len(d)))


if __name__ == '__main__':
    main()
