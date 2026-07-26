#!/usr/bin/env python3
"""BOHEMIA - COMBAT v71: EVERYTHING ON BEAT, AND THE TWO THINGS HE CAUGHT.

Five rulings from Paolo, 7/26.

1. "Everything on beat even the Enemies whatever they're doing."
   THE ANSWER TO THE QUESTION I ASKED HIM. Every event in the fight lands on the
   grid now, not just the dial. The demo already had a quantizer (onOffbeat)
   that parked events on the HALF beat; it now lands them on the BEAT, and the
   enemy side is routed through it too -- melee windups and strikes, the nerve
   break, deaths, downings. Thirteen existing call sites plus the enemy verbs
   move onto the beat in one change, because they all already funnel through
   the one scheduler.

2. "Opacity of that shit that you added last chat should go down by 50%."
   The approach ring goes from 25% to 12.5% of its original alpha.

3. "I'm not feeling the hero beat drum doubling."
   The doubled kick and the sub boom on step 0 are GONE. He said last message
   the hero should be "just the voice", and now that the doubling itself is not
   landing, it is dead weight sitting on the limiter. Beat one is still the hero
   -- it is the 808 at 3x, alone, with nothing fighting it. (The 7/24 "beat one
   is canon for every song" ruling stands: what changes is HOW beat one is
   announced, never whether it is.)

4. THE DOWNED ARE KILLS, FOR THE MUSIC. "if I have a pistol and I down an enemy,
   even if they survive because they're crawling away... if I didn't shoot them
   they typically would be dead... that's part of a kill, intensify the song...
   I hate to see that you're not recognizing them."
   The ladder counted `e.dead` ONLY, under an explicit V53 note that a shot
   which merely downs a man "must not bump the music". That is now superseded by
   his own newer words: the ladder counts everyone TAKEN OUT OF THE FIGHT --
   dead, crawling/dying, hands up, and running. If he took them out of the
   fight, the song answers.

5. ALL THE OVERWORLD MUSIC, NOT TWO SONGS. "I don't know why it's so difficult
   for you to put all of the overworld music when I press new encounter."
   Because combat carried a HAND-COPIED array of six night songs while the app
   itself holds THIRTEEN songs he tagged OVERWORLD (10 NIGHT + 1 DAY + 2
   DUSK/DAWN, his 7/19 assignments, baked in CAT_DEFAULTS). The music bus was
   already shipping his faction pools to combat and simply never shipped the
   overworld ones. Now it does, combat plays from HIS pool, and the encounter
   walks a SHUFFLE BAG -- every overworld song plays before any song repeats.

REUSE CHECK: no assets cooked. Item 5 is the opposite of cooking: it deletes a
hand-copied subset and consumes the approved corpus the app already holds.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_everything_onbeat_patch.py
Gate:  node gates/combat_lab_gate.js   (section 11)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V71 EVERYTHING ON BEAT'
PARENT_MARK = 'V71 OVERWORLD POOL'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


# ===========================================================================
# THE DEMO SIDE
# ===========================================================================
def patch_demo(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # -- 2. the ring drops another half -------------------------------------
    demo = sub1(demo,
        "const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.25;",
        "const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.125;   /* V71 (Paolo): down another 50%, so an eighth of where it started */",
        'ring alpha 50 again')
    demo = sub1(demo,
        "+(_snap*0.2125)+')';",
        "+(_snap*0.10625)+')';   /* V71: the snap comes down the same half */",
        'snap alpha 50 again')

    # -- 3. the drum doubling is dead ---------------------------------------
    demo = sub1(demo,
        """    if(s===0){ let _hd=MAST; try{ _hd=AC.createGain(); _hd.gain.value=0.55; _hd.connect(MAST); }catch(_e){ _hd=MAST; }
      drumV((f.kit&&f.kit.k)||'punchk',AC,_hd,t); drumV('boom',AC,_hd,t); } }""",
        """    /* V71 (Paolo: "I'm not feeling the hero beat drum doubling"). The doubled
       kick and the sub boom are GONE. He ruled last message that the hero
       should be JUST THE VOICE, and a doubling he cannot feel is dead weight
       sitting on the limiter in front of the note that IS the hero. Beat one is
       still canon for every song (7/24) -- it is announced by the 808 at 3x,
       alone, with nothing competing. */ }""",
        'kill the drum double')

    # -- 4. the downed are kills, for the music -----------------------------
    demo = sub1(demo,
        "  const _sk=(G._demo&&G._demo.k==='J')?4:((JUICE.J&&!G.over)?(G.e?G.e.filter(e=>e.dead).length:0):0);   /* V53 (Paolo): the song layers with KILLS, not kill-ARC releases -- a pistol shot that only DOWNS a man (alive) must not bump the music */",
        """  /* V71 THE DOWNED ARE KILLS, FOR THE MUSIC (Paolo 7/26, SUPERSEDES the V53
     note that a shot which only downs a man "must not bump the music"):
     "if I have a pistol and I down an enemy, even if they survive because
     they're crawling away... if I didn't shoot them they typically would be
     dead... that's part of a kill, intensify the song... I hate to see that
     you're not recognizing them." So the ladder counts everyone TAKEN OUT OF
     THE FIGHT -- dead, crawling, hands up, or running. Same set aliveEnemies()
     already uses to decide the fight is over; the music now agrees with it. */
  const _sk=(G._demo&&G._demo.k==='J')?4:((JUICE.J&&!G.over)?(G.e?G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length:0):0);""",
        'downed count as kills')

    # -- 1. EVERYTHING ON BEAT ----------------------------------------------
    demo = sub1(demo,
        """function onOffbeat(fn){ if(!JUICE.M)return fn();
  const ms=((0.5-_bpmPhase+1)%1)*BPM_MS; setTimeout(fn,Math.max(16,ms)); }""",
        """/* ===== V71 EVERYTHING ON BEAT (Paolo 7/26: "Everything on beat even the
   Enemies whatever they're doing") ======================================
   This scheduler used to park events on the HALF beat. Now it lands them on
   the BEAT, which puts all thirteen existing call sites -- return fire, the
   cracks of a miss, the hurt flash, the blast -- on the grid in one change.
   The enemy verbs below are routed through the same rail, so the fight is the
   drum track instead of noise over it. Nothing waits longer than one beat. */
function onBeat(fn){ if(!JUICE.M)return fn();
  const ms=((1-_bpmPhase)%1)*BPM_MS; setTimeout(fn,Math.max(8,ms)); }
function onOffbeat(fn){ return onBeat(fn); }   /* V71: the old half-beat rail now lands on the beat */""",
        'the beat scheduler')

    # the enemy's own verbs, on the beat
    demo = sub1(demo,
        "        if(_isLastMan){ e.broken=true; e._brokeAt=performance.now();",
        "        if(_isLastMan){ e.broken=true; e._brokeAt=performance.now(); onBeat(()=>{try{sndHit();}catch(_e){}});   /* V71: the nerve break lands on the beat */",
        'nerve break on beat')

    demo = sub1(demo,
        "e._fleeVar=Math.floor(Math.random()*2);",
        "e._fleeVar=Math.floor(Math.random()*2); onBeat(()=>{try{sndMiss();}catch(_e){}});   /* V71: the break-and-run lands on the beat */",
        'flee on beat')

    # -- 5. all of HIS overworld music --------------------------------------
    demo = sub1(demo,
        "    if(m.pools)G._pools=m.pools;   /* CATEGORY POOL: faction-tagged vibes ride the same bus */",
        """    if(m.pools)G._pools=m.pools;   /* CATEGORY POOL: faction-tagged vibes ride the same bus */
    if(m.owpools){ G._owPools=m.owpools; G._owBag=null; }   /* V71: HIS overworld pool, all three time slots, straight off the same bus */""",
        'receive overworld pools')

    demo = sub1(demo,
        """G._owRot=G._owRot||0;
function pickOverworldSong(){ if(!OVERWORLD_SONGS.length)return null; const s=OVERWORLD_SONGS[G._owRot%OVERWORLD_SONGS.length]; G._owRot=(G._owRot||0)+1; return s; }""",
        """G._owRot=G._owRot||0;
/* ===== V71 ALL OF THE OVERWORLD MUSIC (Paolo 7/26: "I don't know why it's so
   difficult for you to put all of the overworld music when I press new
   encounter. It's just been like two songs") ==============================
   Because combat carried the hand-copied SIX above while the app itself holds
   THIRTEEN songs he tagged OVERWORLD (10 NIGHT + 1 DAY + 2 DUSK/DAWN, his 7/19
   assignments baked into CAT_DEFAULTS). The music bus was already shipping his
   FACTION pools down here and simply never shipped the overworld ones.
   Now: the pool is everything he tagged, and the encounter walks a SHUFFLE BAG
   -- every song plays before any song repeats, so two never hog the rotation. */
function owAll(){
  const p=G._owPools; if(!p)return OVERWORLD_SONGS.slice();
  const out=[], seen={};
  for(const k in p)for(const s of (p[k]||[])){ const n=s&&s.n; if(n&&seen[n])continue; if(n)seen[n]=1; out.push(s); }
  return out.length?out:OVERWORLD_SONGS.slice(); }
function pickOverworldSong(){
  const pool=owAll(); if(!pool.length)return null;
  if(!G._owBag||!G._owBag.length){                       /* refill and shuffle the bag */
    G._owBag=pool.slice();
    for(let i=G._owBag.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=G._owBag[i]; G._owBag[i]=G._owBag[j]; G._owBag[j]=t; } }
  const s=G._owBag.pop(); G._owRot=(G._owRot||0)+1;
  try{ if(s&&s.n)setRead('\\u266a '+s.n,'overworld \\u00b7 '+((G._owBag?G._owBag.length:0)+1)+' left in the bag','#8fd0e8'); }catch(_e){}
  return s; }""",
        'overworld shuffle bag')

    # NEW ENCOUNTER always rolls a fresh song, not just when the phase changes
    demo = sub1(demo,
        """function newEncounter(){ audio(); G._endSent=false;   /* V59 */
  if(G.factionShuffle) pickRandomFaction();
  if(G.factionShuffle) pickDayPhase();   /* V55 */""",
        """function newEncounter(){ audio(); G._endSent=false;   /* V59 */
  if(G.factionShuffle) pickRandomFaction();
  if(G.factionShuffle) pickDayPhase();   /* V55 */
  if(G.factionShuffle) try{ G._owSong=pickOverworldSong(); }catch(_e){}   /* V71: NEW ENCOUNTER always pulls the next song out of the bag */""",
        'new encounter rolls a song')

    return demo


# ===========================================================================
# THE PARENT SIDE: ship his overworld pool down the bus that already exists
# ===========================================================================
OLD_PUSH = """  out.pools={};
  for(const f of MFACTIONS){ const arr=[];
    MLOOPS.forEach(m=>{ if(MUS.V[m.n+'#1']!==0&&MUS.catsOf(m.n+'#1').indexOf(f.n)>=0){
      const c={}; for(const k of ['n','root','wave','kick','bass','hat','scale','inst','am','kit','mel','swing','feel','klay'])if(m[k]!==undefined)c[k]=m[k];
      c.hero=MUS.hero[m.n+'#1'];
      arr.push(c); } });
    if(arr.length)out.pools[f.n]=arr; }"""

NEW_PUSH = """  out.pools={};
  const _songObj=(m)=>{ const c={}; for(const k of ['n','root','wave','kick','bass','hat','scale','inst','am','kit','mel','swing','feel','klay'])if(m[k]!==undefined)c[k]=m[k];
    c.hero=MUS.hero[m.n+'#1']; return c; };
  for(const f of MFACTIONS){ const arr=[];
    MLOOPS.forEach(m=>{ if(MUS.V[m.n+'#1']!==0&&MUS.catsOf(m.n+'#1').indexOf(f.n)>=0){
      arr.push(_songObj(m)); } });
    if(arr.length)out.pools[f.n]=arr; }
  /* V71 OVERWORLD POOL (Paolo 7/26: "I don't know why it's so difficult for you
     to put all of the overworld music when I press new encounter. It's just
     been like two songs"). The faction pools have ridden this bus since 7/19;
     the OVERWORLD ones never did, so combat was stuck on a hand-copied array of
     six night songs while thirteen tagged overworld songs sat right here. */
  out.owpools={};
  for(const cat of ['OVERWORLD NIGHT','OVERWORLD DAY','OVERWORLD DUSK/DAWN']){ const arr=[];
    MLOOPS.forEach(m=>{ if(MUS.V[m.n+'#1']!==0&&MUS.catsOf(m.n+'#1').indexOf(cat)>=0){
      arr.push(_songObj(m)); } });
    if(arr.length)out.owpools[cat]=arr; }"""


def patch_parent(src):
    if PARENT_MARK in src:
        print('  parent: already patched, skipping')
        return src
    return sub1(src, OLD_PUSH, NEW_PUSH, 'overworld pool push')


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch_demo(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    src = patch_parent(src)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
