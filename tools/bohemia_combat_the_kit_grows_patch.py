#!/usr/bin/env python3
"""
V191 THE KIT GROWS -- the other half of his sentence, and it was the half nobody
built.

  PAOLO 8/26: "LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR EXPERIENCE TREE
  CYBER PUNK ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND IN HAND WITH
  ***ABILITIES*** AND THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW WAY TO
  INTERACT WITH BOHEMIA BRO!"

He named THREE things in one breath and said they go hand in hand: the TREE
(V188), the BOSSES (V190) and the ABILITIES (V185's kit). Two of the three now
touch each other -- a boss pays the tree and opens a door. THE KIT IS STILL
EXACTLY THE SIX IT SHIPPED WITH. Every player in this game has the same six
abilities on turn one of fight one and will still have those six on hour ninety,
which in a hundred-hour game with sixty bosses in it is the kit not growing at
all.

*** AND V190 ONLY PROVED THE LOCK, NOT THE GRANT. *** THE CLIMB gives you stairs
and THE CHARGE gives you the grenade -- both are verbs the engine ALREADY had,
switched off and handed back. Not one boss in the game gives you something that
did not exist before you beat him. That is the difference between a key and a
NEW WAY TO INTERACT, and it is the exact thing his sentence asked for.

-------------------------------------------------------------------------
THREE ABILITIES THAT DO NOT EXIST UNTIL SOMEBODY HANDS THEM TO YOU
-------------------------------------------------------------------------
Each one is a grant off his own ladder, read out of the record, built on
machinery that already ships. A kit entry may now carry a `key`, and until you
hold it the button is not in the row and the verb does not charge it -- so an
ability you have not earned is not a greyed-out tease, it is ABSENT.

  PATCH IT   THE WARD  "treat and dose, so a bad day stops being the last one"
             Recharges on QUIET: a turn ended with nobody holding a line on you. The only thing in this fight that gives health
             back, which is why it is behind a man rather than in the starting
             six: V182 built one door for all player damage and nothing has ever
             opened the other way.

  LIGHT IT   THE BURN  "light a fire anywhere, so you get the night back"
             *** AND IT LIGHTS THE LOT FOR THEM TOO. *** V98's dark halves every
             range in the game through ONE door (V160: "every reach comes through
             here"), so a fire un-halves YOURS and THEIRS in the same instant.
             That is not a drawback bolted on, it is what a fire IS, and it turns
             his grant into a real decision instead of a free buff: you get the
             night back and so does everybody who wants to shoot you.
             Recharges on DARK, because you light a fire when it IS dark.

  SEND HIM   THE DOGS  "take a dog: it walks with you, or it holds your gate"
             The nearest man goes down and stays down for two turns. It is a
             STUN, not suppression, so it is nothing CALL IT already does -- CALL
             IT makes a man duck, the dog takes him off his feet.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy or armour number changes.
PATCH_HP is health given back, marked as the dial it is; the fire moves a RANGE
both ways through V98's own single door; the dog uses the stun state the fight
already has.

MECHANISM MINE, CONTENTS HIS: which of his grants map onto verbs this engine can
actually perform is mechanism. The NAMES are WORDS, so they ship as a real
attempt tagged draft:true. Which boss holds what is HIS and is read from his
record, not chosen here.

REUSE CHECK: cooks no graphic pixels and opens no bank. PATCH IT writes G.pHP
through the same updPlayer V182 uses; LIGHT IT moves rangeMult, which is the one
door V160 made every reach in the game pass through; SEND HIM sets the same
`stun` a shove sets. The buttons are V185's kit row.

TASTE CHECK: no new HUD and no new row. Three more buttons in a row that already
appears and disappears on its own, and they are only there once somebody has
handed them to you.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V191 THE KIT GROWS'


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
        print('v191: already applied')
        return
    if 'V190 THE MINI BOSSES' not in d:
        sys.exit('v191 needs v190 -- run the mini bosses patch first')

    # ---- 1. THREE MORE, AND THEY ARE NOT YOURS YET ----
    d = sub(d,
        """  {id:'read',  n:'READ THE ROOM', verb:'open',  need:2, draft:true,
   why:'a pip back and a turn of power for standing where they can see you'}
];""",
        """  {id:'read',  n:'READ THE ROOM', verb:'open',  need:2, draft:true,
   why:'a pip back and a turn of power for standing where they can see you'},
  /* ===== V191 THE KIT GROWS =========================================
     Paolo 8/26 named THREE things in one breath and said they go hand in hand:
     the tree, the bosses and the ABILITIES. V188 built the tree, V190 put his
     fifty-three bosses in the game, and THE KIT IS STILL EXACTLY THE SIX IT
     SHIPPED WITH -- same six on turn one of fight one, same six on hour ninety,
     in a hundred-hour game with sixty bosses in it.
     AND V190 ONLY PROVED THE LOCK, NEVER THE GRANT: THE CLIMB hands back stairs
     and THE CHARGE hands back the grenade, and both are verbs this engine
     ALREADY HAD, switched off and returned. Not one boss gave you something
     that did not exist before you beat him. That is the difference between a
     key and A NEW WAY TO INTERACT.
     A KIT ROW WITH A `key` IS ABSENT UNTIL YOU HOLD IT -- not greyed out, not
     teased. An ability you have not earned should not be furniture on his
     screen; he has asked five times for things to come OFF that row.
     [draft:true] on every name: what these are CALLED is his. */
  {id:'patch', n:'PATCH IT',      verb:'quiet', need:3, draft:true, key:'ward',
   why:'nobody had a line on you long enough to work on it'},
  {id:'light', n:'LIGHT IT',      verb:'dark',  need:3, draft:true, key:'burn',
   why:'you get the night back -- and so does everybody aiming at you'},
  {id:'dog',   n:'SEND HIM',      verb:'close', need:2, draft:true, key:'dogs',
   why:'he goes off the man nearest you and takes him off his feet'}
];
const PATCH_HP=25;    /* [DIAL] health GIVEN BACK, which is not damage -- the only thing in this fight that ever has */
const LIT_TURNS=4;    /* [DIAL] how long a fire holds the dark off */
const DOG_STUN=2;     /* [DIAL] turns the man he takes down stays down */
const KIT_CLOSE=4.0;  /* [DIAL] how near somebody has to be for the dog to be worth having */
/* AN ABILITY YOU HAVE NOT BEEN HANDED IS NOT IN THE GAME YET. One test, used by
   the row, by the verb feed and by the press, so there is no third place for a
   locked ability to leak out of. */
function kitOwned(k){ return !k.key || (typeof keyHas==='function' && keyHas(k.key)); }""",
        what='three more abilities')

    # *** AND THEY GET THEIR OWN VERBS, WHICH AN OLD ARM DEMANDED. ***
    # The first cut hung them on cover / move2 / kill, three verbs the shipped six
    # already own, and V185's arm went red on its own law: "recharge conditions are
    # UNIQUE PER ITEM". Two abilities on one verb is a menu getting longer, not a
    # set of pressures getting wider -- which is the exact thing V185 was written
    # to prevent. Three NEW conditions, fed at turn end beside the two V185
    # already feeds there, and they conflict with each other and with the old six:
    # you cannot be unseen and have somebody in your face in the same turn.
    d = sub(d,
        """function kitCoverTick(){""",
        """/* ===== V191 THREE MORE THINGS A TURN CAN BE ========================
   V185's law is that a recharge is UNIQUE PER ITEM and is a VERB, and the first
   cut of these three hung them on cover / move2 / kill -- verbs the shipped six
   already own -- which its own gate arm caught and refused. So each of the new
   abilities gets a condition nothing else reads, measured at the end of a turn
   exactly where 'open' and 'cover' are measured:
     QUIET  nobody held a line on you. The opposite of 'open' AND distinct from
            'cover': stone does not make you unseen, and the dark does it without
            any stone at all.
     DARK   the turn ended after dark. You light a fire when it IS dark, and it
            is the only ability in the kit whose condition is the WORLD rather
            than something you did -- which is why it belongs to a man who holds
            fuel rather than to you.
     CLOSE  somebody got inside four tiles. The dog goes at whoever is nearest,
            so the thing that charges him is the thing he answers. */
function kitOwnTicks(){
  if(G.over)return;
  try{ if(!eyesOnMe())kitVerb('quiet'); }catch(_x){}
  try{ if(isDark())kitVerb('dark'); }catch(_x){}
  try{ let near=1e9;
    for(const e of (G.e||[])){ if(!e||e.dead||e.downed)continue;
      if((e.edist||99)<near)near=e.edist; }
    if(near<=KIT_CLOSE)kitVerb('close'); }catch(_x){} }
function kitCoverTick(){""",
        what='the three new verbs')

    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick(); kitCoverTick();",
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick(); kitCoverTick(); kitOwnTicks();   /* V191 */",
        what='the tick')

    # ---- 2. AND THE VERB FEED DOES NOT CHARGE WHAT YOU DO NOT OWN ----
    d = sub(d,
        "  for(const k of KIT){ if(k.verb!==verb)continue;",
        "  for(const k of KIT){ if(k.verb!==verb)continue; if(!kitOwned(k))continue;   /* V191 */",
        what='the verb feed')

    d = sub(d,
        "function kitReady(id){ const k=kitDef(id); if(!k)return false;\n  return ((G.kit&&G.kit[id])||0)>=Math.max(1,k.need-(G.perkKit||0)); }",
        """function kitReady(id){ const k=kitDef(id); if(!k)return false;
  if(!kitOwned(k))return false;   /* V191: nobody has handed you this one */
  return ((G.kit&&G.kit[id])||0)>=Math.max(1,k.need-(G.perkKit||0)); }""",
        what='kitReady')

    # *** AND V188'S OPENING MOVE MUST NOT ARM A LOCKED ONE. *** Its own gate arm
    # caught this: the perk picks a random KIT row and charges it, and with three
    # locked rows in the list it started arming abilities the player does not
    # have -- which read as arming NOTHING, because kitReady refuses them. A
    # feature that widens a list silently breaks every random pick over that list.
    d = sub(d,
        "G.kit=G.kit||{}; const k=KIT[Math.floor(Math.random()*KIT.length)];",
        "G.kit=G.kit||{}; const _own=KIT.filter(kitOwned); const k=_own[Math.floor(Math.random()*_own.length)];   /* V191: never arm one nobody handed him */",
        what='opening move picks an owned one')

    # ---- 3. WHAT THE THREE ACTUALLY DO ----
    d = sub(d,
        """  if(id==='read'){ if(!kitSpend(id))return false;""",
        """  /* ===== V191 THE THREE A MAN HAS TO HAND YOU ======================
     Every one drives a machine that already ships, which is the same bar the
     original six were held to. */
  if(id==='patch'){ if(!kitSpend(id))return false;
    /* THE WARD: "treat and dose, so a bad day stops being the last one." V182
       built ONE DOOR for every point of damage that reaches the player and
       nothing has ever opened the other way -- this is the first thing in the
       fight that gives health back, which is exactly why it sits behind a man
       instead of in the starting six. */
    const was=G.pHP|0;
    G.pHP=Math.min(G.pMax||100,(G.pHP||0)+PATCH_HP);
    try{ updPlayer(); }catch(_e){}
    setRead('PATCH IT','+'+((G.pHP|0)-was)+' -- it holds for now','#8fe89a'); return true; }
  if(id==='light'){ if(!kitSpend(id))return false;
    /* THE BURN: "light a fire anywhere, so you get the night back."
       *** AND IT LIGHTS THE LOT FOR THEM TOO. *** V98's dark halves every range
       in this game and V160 made every reach -- yours, theirs, the sniper's --
       come through ONE door, so un-halving it un-halves it for everybody who
       wants to shoot you. That is not a drawback bolted onto a buff, it is what
       a fire IS, and it is what makes his grant a decision. */
    G._litT=(G.mTurn||0)+LIT_TURNS;
    try{ updGap(); renderBoard(); }catch(_e){}
    setRead('LIGHT IT','the lot is lit for '+LIT_TURNS+' turns -- for you and for them','#e8b04a'); return true; }
  if(id==='dog'){ if(!kitSpend(id))return false;
    /* THE DOGS: "take a dog: it walks with you, or it holds your gate." A STUN,
       not suppression, so it is nothing CALL IT already does -- CALL IT makes a
       man put his head down, the dog takes him off his feet. */
    let tgt=null,bd=1e9;
    for(const e of (G.e||[])){ if(!e||e.dead||e.downed)continue;
      if((e.edist||99)<bd){bd=e.edist;tgt=e;} }
    if(tgt){ tgt.stun=Math.max(tgt.stun||0,DOG_STUN); tgt.windup=false; tgt.acq=0; tgt.stunCooldown=0; }
    try{ renderBoard(); }catch(_e){}
    setRead('SEND HIM',tgt?(tgt.n+' is on the floor for '+DOG_STUN+' turns'):'nothing close enough','#8fd0e8'); return true; }
  if(id==='read'){ if(!kitSpend(id))return false;""",
        what='what the three do')

    # ---- 4. THE FIRE REACHES EVERY GUN, THROUGH THE ONE DOOR ----
    d = sub(d,
        "function rangeMult(){ const m=NIGHT_RANGE[G.dayPhase||'night']; return m==null?1:m; }",
        """function rangeMult(){
  /* V191 LIGHT IT (THE BURN, his ladder): a fire on the lot un-halves the dark.
     IT GOES HERE AND NOWHERE ELSE, because V160 made this the ONE DOOR every
     reach in the game passes through -- yours, theirs, the sniper's, and V151's
     floor. Putting it anywhere else would light the lot for you alone, which is
     not a fire, it is a scope. */
  if(G._litT&&(G.mTurn||0)<=G._litT)return 1;
  const m=NIGHT_RANGE[G.dayPhase||'night']; return m==null?1:m; }""",
        what='the fire in the one door')

    # ---- 5. AND IT DIES WITH THE FIGHT ----
    d = sub(d,
        "  G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;",
        "  G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false; G._litT=0;   /* V191: a fire does not survive into the next fight */",
        what='the fire dies with the fight')

    # ---- 6. THE ROW ONLY SHOWS WHAT IS YOURS ----
    d = sub(d,
        "  for(const k of KIT) if(kitReady(k.id))",
        "  for(const k of KIT) if(kitOwned(k)&&kitReady(k.id))   /* V191 */",
        what='the kit row')

    # ---- 7. TAKING THE KEY PUTS THE BUTTON IN YOUR HAND THE SAME TURN ----
    d = sub(d,
        "  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); }catch(_e){}\n  return true; }",
        """  /* V191: and if his grant IS an ability, it is in your hand this turn --
     a reward you have to restart the fight to see is a patch note. */
  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); updKit(); }catch(_e){}
  try{ const k=KIT.find(x=>x.key===id);
    if(k)setRead('NEW: '+k.n,k.why,'#8fe89a'); }catch(_e){}
  return true; }""",
        what='the ability lands the same turn')

    d = sub(d,
        "function keysForget(){ KEYS.taken=[]; keysSave();\n  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); }catch(_e){} }",
        "function keysForget(){ KEYS.taken=[]; keysSave();\n  try{ updTree(); updBossRow(); updStairBtn(); updGrenBtn(); updKit(); }catch(_e){} }",
        what='forget clears the row too')

    # ---- 8. AND THE ROW HE DIRECTS IT FROM SAYS WHICH ABILITIES ARE OUT THERE ----
    d = sub(d,
        "  for(const id of ['climb','charge']){ const b=bossById(id); if(!b)continue;\n    lines.push((keyHas(id)?'\\u2714 ':'\\u2717 ')+b.n+' \\u2014 '+b.grant); }",
        """  for(const id of ['climb','charge']){ const b=bossById(id); if(!b)continue;
    lines.push((keyHas(id)?'\\u2714 ':'\\u2717 ')+b.n+' \\u2014 '+b.grant); }
  /* V191: and the three who hand you an ABILITY rather than a door */
  for(const k of KIT){ if(!k.key)continue; const b=bossById(k.key); if(!b)continue;
    lines.push((keyHas(k.key)?'\\u2714 ':'\\u2717 ')+b.n+' \\u2014 '+k.n); }""",
        what='the row names the abilities')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v191: the kit grows -- 6 abilities + 3 behind three of his men -- %d chars' % len(d))


if __name__ == '__main__':
    main()
