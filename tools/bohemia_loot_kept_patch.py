#!/usr/bin/env python3
"""
V206 -- WHAT YOU TOOK LEAVES THE FIGHT WITH YOU  (COMBAT lane, [loot kept])

VAMILY row [loot kept] = BB-LOOT-LEAVES, with BB-KEYS-LAND, one pipe. Both rows
say the same thing from two ends: the fight's one message out is a body count and
a health number, and everything you crossed ground under fire to pick up dies at
the door.

PAOLO 8/25, the ruling all of this implements: "YOU GET EXPERIENCE AND LOOT OFF
THEIR BODIES." That shipped inside the arena on 9/2 (V181/V184/V190) and has
never once left it.

MEASURED IN THE DECODED BLOB BEFORE WRITING A LINE:
  * endPayload carries victory / result / reason / kills / dead / spared / fled /
    alive / fates / playerHP / turns / encounterId / questId / stepId.
    NO LOOT. NO XP. NO PLATES. NO KEYS.
  * the takings exist and are already counted, per fight, in G.rc -- cleanSlate
    builds G.rc fresh at the top of every fight, and sweepDrops pushes G.rc.xp
    and G.rc.loot into it as you walk onto each body. The numbers were always
    there; nothing ever read them on the way out.
  * plates had no per-fight counter at all (a local `gotPlate` for the readout
    line and nothing else), and keys had none either.

*** AND BB-KEYS-LAND HAS A LIVE CUSTOMER NOW, WHICH CHANGES IT FROM TIDYING INTO
A BUG. *** That row was written on 8/28 when nothing outside the fight read the
keys. Somebody added the reader on 9/6: ctLadderHeld() in the walked city, whose
own comment says "MEASURED 9/6: nothing outside the fight had ever read it." It
reads window.parent.bohemiaKeys -- the SHELL's global. And the chain is broken in
the middle:
    the fight sets window.bohemiaKeys ......... on the COMBAT FRAME's own window
    the fight posts {bohemiaKeys:[...]} ....... UNTYPED, and the shell handles
                                               messages by d.type, so nothing
                                               catches it (0 hits for bohemiaKeys
                                               anywhere in the alpha)
    the city reads window.parent.bohemiaKeys .. undefined, falls back to its own
                                               window, undefined, returns []
SO THE BOSS LADDER IN THE CITY ALWAYS SEES AN EMPTY HAND, however many keys you
are carrying. Twenty message types in the shell are handled by d.type and this
one has no type field, which is the whole defect.

WHAT THIS PATCH DOES, AND NOTHING ELSE:
  1. G.rc.plates and G.rc.keys are recorded where the pickup happens, beside the
     xp and loot that were already being recorded there.
  2. endPayload carries `took` (loot, xp, plates, keys, rounds), read off G.rc.
  3. The keys message gets a TYPE. The old untyped field rides along with it so
     any reader written against the old shape keeps working.
  4. A POCKET: what you took is kept in localStorage['bohemia.pocket'] and
     published the same way the keys are. THE FIGHT'S OWN STORAGE, not the run's
     save -- 'bohemia.tree' and 'bohemia.keys' are already the fight's and this
     is the third of the same kind. ONE SYSTEM, ONE SESSION: bohemia.save.v1
     belongs to RUN and is not touched here.
  5. The shell keeps both and hangs them on its own window, which is the hole the
     city's reader has been falling through.

NO DAMAGE BEFORE THE DIAL: nothing here authors a damage number, a hit, a roll or
a price. It carries numbers that already exist across a boundary they already
failed to cross.

MECHANISM-MINE / CONTENTS-PAOLO'S: the pocket is a container and a wire. What a
looted item DOES is not decided here -- BB-LOOT-IS-ACCESS says loot opens things
rather than adding to them, and that is a separate row and his call.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__LOOT_KEPT__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:140]))
    return src.replace(old, new, n)


POCKET = r"""
/* ===== V206 __LOOT_KEPT__ -- THE POCKET ====================================
   What you picked up off a body survives the fight. THE FIGHT'S OWN STORAGE:
   'bohemia.tree' and 'bohemia.keys' are already written from in here and this is
   the third of exactly the same kind, so nothing about the run's save
   (bohemia.save.v1, RUN's file) is touched.
   IT IS A CONTAINER AND A WIRE, AND DELIBERATELY NOT A GAME YET. What a looted
   item DOES is BB-LOOT-IS-ACCESS and it is Paolo's call: "loot opens doors, it
   does not add numbers." So this keeps and publishes; it spends nothing. */
const POCKET={items:[],xp:0,plates:0,keys:[],fights:0};
const POCKET_MAX=60;               /* [DIAL] a pocket, not a warehouse */
function pocketLoad(){
  try{ const raw=localStorage.getItem('bohemia.pocket');
    if(raw){ const o=JSON.parse(raw)||{};
      if(Array.isArray(o.items))POCKET.items=o.items.slice(0,POCKET_MAX);
      POCKET.xp=o.xp|0; POCKET.plates=o.plates|0; POCKET.fights=o.fights|0;
      if(Array.isArray(o.keys))POCKET.keys=o.keys.slice(); } }
  catch(_e){}                      /* opaque origin: keep the in-memory copy */
  pocketPublish(); return POCKET; }
function pocketSave(){
  try{ localStorage.setItem('bohemia.pocket',JSON.stringify(
    {items:POCKET.items,xp:POCKET.xp,plates:POCKET.plates,keys:POCKET.keys,fights:POCKET.fights})); }catch(_e){}
  pocketPublish(); }
/* PUBLISHED THE SAME WAY THE KEYS ARE, and with a TYPE on it, which is the half
   the keys row was missing: the shell routes by d.type and an untyped message
   cannot be routed by anybody. */
function pocketPublish(){
  try{ window.bohemiaPocket={items:POCKET.items.slice(),xp:POCKET.xp|0,
    plates:POCKET.plates|0,keys:POCKET.keys.slice(),fights:POCKET.fights|0}; }catch(_e){}
  try{ parent.postMessage({type:'BOHEMIA_COMBAT_POCKET',
    pocket:{items:POCKET.items.slice(),xp:POCKET.xp|0,plates:POCKET.plates|0,
            keys:POCKET.keys.slice(),fights:POCKET.fights|0}},'*'); }catch(_e){} }
/* CREDITED FROM THE PAYLOAD THAT JUST WENT OUT, so the pocket and the message can
   never disagree about what you took. */
function pocketCredit(p){
  const t=(p&&p.took)||null; if(!t)return POCKET;
  if(t.loot&&t.loot.length){ for(let i=0;i<t.loot.length;i++){
    if(POCKET.items.length>=POCKET_MAX)break; POCKET.items.push(t.loot[i]); } }
  POCKET.xp=(POCKET.xp|0)+(t.xp|0);
  POCKET.plates=(POCKET.plates|0)+(t.plates|0);
  if(t.keys&&t.keys.length){ for(let i=0;i<t.keys.length;i++){
    if(POCKET.keys.indexOf(t.keys[i])<0)POCKET.keys.push(t.keys[i]); } }
  POCKET.fights=(POCKET.fights|0)+1;
  pocketSave(); return POCKET; }
function pocketForget(){ POCKET.items=[]; POCKET.xp=0; POCKET.plates=0;
  POCKET.keys=[]; POCKET.fights=0; pocketSave(); }
try{ pocketLoad(); }catch(_e){}
/* ===== /V206 __LOOT_KEPT__ ===== */
"""


def patch_blob(blob):
    if MARK in blob:
        print('  blob already patched')
        return blob, False

    # 1. the pocket, declared beside the keys it travels with
    blob = sub(blob,
               "const KEYS={taken:[]};",
               "const KEYS={taken:[]};\n" + POCKET.strip(),
               1, 'blob/pocket')

    # 2. plates get a per-fight counter, beside the xp and loot that had one
    blob = sub(blob,
               "if(d.plate && (G.pp||0)<(PP_MAX+(G.perkCarry||0))){ G.pp=(G.pp||0)+1; gotPlate++; }",
               "if(d.plate && (G.pp||0)<(PP_MAX+(G.perkCarry||0))){ G.pp=(G.pp||0)+1; gotPlate++;\n"
               "        /* V206 " + MARK + ": and it is COUNTED for the way out. A plate was the one\n"
               "           thing on a body with no per-fight counter at all -- gotPlate was a local\n"
               "           for the readout line and died with the function. */\n"
               "        G.rc=G.rc||{}; G.rc.plates=(G.rc.plates||0)+1; }",
               1, 'blob/plates')

    # 3. keys taken IN THIS FIGHT, which KEYS.taken cannot answer (it is all-time)
    blob = sub(blob,
               "KEYS.taken.push(id); keysSave();",
               "KEYS.taken.push(id); keysSave();\n"
               "  /* V206 " + MARK + ": KEYS.taken is EVERY key you have ever held, so it cannot\n"
               "     answer 'what did this fight give me'. G.rc is rebuilt by cleanSlate at the\n"
               "     top of every fight, which makes it the honest place for that. */\n"
               "  try{ G.rc=G.rc||{}; (G.rc.keys=G.rc.keys||[]).push(id); }catch(_e){}",
               1, 'blob/rckeys')

    # 4. the message out carries it
    blob = sub(blob,
               "encounterId:C.encounterId||null, questId:C.questId||null, stepId:C.stepId||null }; }",
               "encounterId:C.encounterId||null, questId:C.questId||null, stepId:C.stepId||null,\n"
               "      /* ===== V206 " + MARK + ": WHAT YOU TOOK. ======================\n"
               "         BB-LOOT-LEAVES, measured: this payload was a body count and a health\n"
               "         number, and the loot, the experience, the plates and the keys all died\n"
               "         with the fight. Every one of these numbers was ALREADY being counted in\n"
               "         G.rc, which cleanSlate rebuilds at the top of every fight -- so this is\n"
               "         a read, not a new mechanic, and it cannot disagree with what the readout\n"
               "         told him when he walked onto the body. */\n"
               "      took:{ loot:((G.rc&&G.rc.loot)||[]).slice(),\n"
               "             xp:((G.rc&&G.rc.xp)|0)+((G.rc&&G.rc.execXP)|0),\n"
               "             plates:((G.rc&&G.rc.plates)|0),\n"
               "             keys:((G.rc&&G.rc.keys)||[]).slice(),\n"
               "             rounds:(G.spare|0) } }; }",
               1, 'blob/payload')

    # 5. the keys message gets a TYPE (the whole of BB-KEYS-LAND's defect)
    blob = sub(blob,
               "try{ parent.postMessage({bohemiaKeys:KEYS.taken.slice()},'*'); }catch(_e){} }",
               "/* V206 " + MARK + ": *** AND IT CARRIES A TYPE NOW. *** The shell routes every\n"
               "     one of its twenty message types by d.type and this one had no type field at\n"
               "     all, so nothing could ever catch it -- which is why the city's own\n"
               "     ctLadderHeld(), written 9/6 to read exactly this, has been seeing an empty\n"
               "     hand. The old untyped field rides along so a reader written against the old\n"
               "     shape keeps working. */\n"
               "  try{ parent.postMessage({type:'BOHEMIA_COMBAT_KEYS',\n"
               "    keys:KEYS.taken.slice(), bohemiaKeys:KEYS.taken.slice()},'*'); }catch(_e){} }",
               1, 'blob/keytype')

    # 6. and the pocket is credited from the payload that just went out
    blob = sub(blob,
               "function sendCombatEnd(win,reason){ BohemiaHandoff.end(G,win,reason||(win?'cleared':'down'),\n"
               "    function(m){ try{parent.postMessage(m,'*');}catch(_e){} }); }",
               "function sendCombatEnd(win,reason){ const _p=BohemiaHandoff.end(G,win,reason||(win?'cleared':'down'),\n"
               "    function(m){ try{parent.postMessage(m,'*');}catch(_e){} });\n"
               "  /* V206 " + MARK + ": the pocket is credited FROM THE PAYLOAD THAT JUST WENT\n"
               "     OUT, never from a second read of the fight, so the message and the pocket\n"
               "     cannot disagree. end() latches one send per fight, so this credits once. */\n"
               "  try{ if(_p)pocketCredit(_p); }catch(_e){}\n"
               "  return _p; }",
               1, 'blob/credit')
    return blob, True


SHELL = r"""
/* ===== V206 __LOOT_KEPT__ -- THE SHELL KEEPS WHAT THE FIGHT SENDS ==========
   THE HOLE THIS FILLS, MEASURED: the walked city's ctLadderHeld() reads
   window.parent.bohemiaKeys, the shell never set it, and the fight's keys
   message had no type for the shell to route -- so the boss ladder in the city
   has been showing an empty hand no matter what you are carrying. The shell is
   the middle of that chain and it was missing.
   IT KEEPS A COPY IN ITS OWN STORAGE TOO, because the city can be standing there
   asking before the fight frame has ever been opened in this session, and an
   answer of "nothing" that only means "combat has not booted" is a lie with a
   default on it. */
var BOH_KEYS_LS='bohemia.keys', BOH_POCKET_LS='bohemia.pocket';
function bohKeepKeys(list){
  try{ window.bohemiaKeys=(list||[]).slice(); }catch(_e){}
  try{ localStorage.setItem(BOH_KEYS_LS,JSON.stringify((list||[]).slice())); }catch(_e){}
}
function bohKeepPocket(p){
  try{ window.bohemiaPocket=p||null; }catch(_e){}
  try{ if(p)localStorage.setItem(BOH_POCKET_LS,JSON.stringify(p)); }catch(_e){}
}
/* and on boot, before any fight has run, the shell hands the city whatever the
   last session left behind */
try{ var _bk=localStorage.getItem(BOH_KEYS_LS);
  if(_bk){ var _a=JSON.parse(_bk); if(Array.isArray(_a))window.bohemiaKeys=_a; } }catch(_e){}
try{ var _bp=localStorage.getItem(BOH_POCKET_LS);
  if(_bp)window.bohemiaPocket=JSON.parse(_bp); }catch(_e){}
"""


def patch_shell(path):
    s = open(path, encoding='utf-8').read()
    if MARK in s:
        print('  %s already patched' % path)
        return False

    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64 in ' + path)
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, changed = patch_blob(blob)
    if changed:
        s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]

    # the shell half: the keeper, and the two handlers that feed it
    s = sub(s,
            "function cityEncounterIn(d){",
            SHELL.strip() + "\nfunction cityEncounterIn(d){",
            1, 'shell/keeper')
    s = sub(s,
            "  if(d.type==='BOHEMIA_COMBAT_END'){",
            "  /* V206 " + MARK + ": the two the fight publishes and nobody caught */\n"
            "  if(d.type==='BOHEMIA_COMBAT_KEYS'){ bohKeepKeys(d.keys||d.bohemiaKeys||[]); return; }\n"
            "  if(d.type==='BOHEMIA_COMBAT_POCKET'){ bohKeepPocket(d.pocket||null); return; }\n"
            "  if(d.type==='BOHEMIA_COMBAT_END'){",
            1, 'shell/handlers')
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/12i - WHAT YOU TOOK COMES WITH YOU\g<2>', s, count=1)
    open(path, 'w', encoding='utf-8').write(s)
    print('V206 applied to', path)
    return True


if __name__ == '__main__':
    patch_shell(ALPHA)
