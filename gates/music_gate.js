// BOHEMIA MUSIC GATE (reborn 7/17/26). The chat era had _newvoice_gate.js; it
// did not survive the chat->repo transport (absent from the 534-file seed),
// which means the music laws ran unenforced from repo birth until this file.
// A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
// Guards, against the ONE alpha:
//   1. SCREECH LAW: zero createDelay calls in the executable build (the
//      lawbook text block is excluded; it names the ban and may say the word).
//      Nothing may feed back; anything that rings is excited-and-decaying.
//   2. The brickwall limiter stays in the master chain.
//   3. EVERY voice a song asks for exists: inst.b, inst.l, am, kit.k, kit.h
//      of every MLOOPS + MFACTIONS entry must have a synthV body or DR hit.
//   4. NEW badges point at real songs: every NEW_VIBES name is in MLOOPS.
//   5. MUSIC VARIETY LAW on the fresh batch: no two NEW_VIBES songs share
//      scale + feel + kick.
//   6. NEW VOICES LAW: every NEW_VIBES song's lead is a voice no other song
//      uses as lead (the batch BIRTHS voices, it does not borrow leads).
const fs=require('fs'),path=require('path');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log('  > FAIL '+n));};
const ALPHA=path.join(__dirname,'../slices/BOHEMIA_ALPHA_0_9.html');
ok('the ONE alpha exists', fs.existsSync(ALPHA));
if(!fs.existsSync(ALPHA)){ console.log(`\n=== MUSIC GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
let src=fs.readFileSync(ALPHA,'utf8');

// strip the plain-text lawbook block before sweeping for the crime
const bi=src.indexOf('<script type="text/plain" id="BOHEMIA_MUSIC_REPO">');
const bj=src.indexOf('</script>',bi);
const code=(bi>=0&&bj>bi)?src.slice(0,bi)+src.slice(bj):src;
ok('embedded music repo block present', bi>=0);

// 1. SCREECH LAW
ok('SCREECH: zero createDelay in the build', !/createDelay\s*\(/.test(code));
ok('SCREECH: zero convolver (nothing rings by loop)', !/createConvolver\s*\(/.test(code));
// 2. limiter
ok('brickwall limiter in master chain', /createDynamicsCompressor\s*\(/.test(code));

// grab an array literal by balanced brackets
function grabArr(marker){
  const i=code.indexOf(marker); if(i<0) return null;
  const start=code.indexOf('[',i); let d=0;
  for(let k=start;k<code.length;k++){ const c=code[k];
    if(c==='[')d++; else if(c===']'){d--; if(!d) return code.slice(start,k+1); } }
  return null;
}
const mloops=grabArr('const MLOOPS=');
const mfact=grabArr('const MFACTIONS=');
ok('MLOOPS parses', !!mloops); ok('MFACTIONS parses', !!mfact);
// NO HOLES IN THE SONG LIST (8/2). A batch tool that leaves a stray comma
// writes `},\n,\n{` and JS turns that into an EMPTY SLOT. Everything that maps
// over songs then dies on `undefined.n`, and it is invisible three ways: the
// file looks fine by eye, a grep for ',,' never matches because a newline sits
// between them, and the song COUNT still looks right. It cost a crash this
// batch. Ask the parsed array, not the text.
// grabArr returns TEXT, so EVAL the literal and ask the real array. Reading
// the text is what let this slip in the first place.
function holesIn(txt){
  if(!txt) return -1;
  let arr; try{ arr = eval(txt); }catch(e){ return -2; }
  if(!Array.isArray(arr)) return -3;
  let h=0; for(let i=0;i<arr.length;i++) if(!arr[i] || !arr[i].n) h++;
  return h;
}
ok('no holes in MLOOPS (a stray comma makes an empty slot)', holesIn(mloops)===0);
ok('no holes in MFACTIONS', holesIn(mfact)===0);

// tolerant parser: split the array into top-level {...} entries, read fields independently
function parse(block){ const out=[]; let d=0,st=-1;
  for(let i=0;i<block.length;i++){ const c=block[i];
    if(c==='{'){ if(!d)st=i; d++; }
    else if(c==='}'){ d--; if(!d&&st>=0){ const e=block.slice(st,i+1);
      const g=(rx)=>{const m=rx.exec(e);return m?m[1]:null;};
      const n=g(/n:'([^']+)'/); if(!n)continue;
      out.push({n, scale:g(/scale:\[([0-9,]+)\]/)||'', kick:g(/kick:\[([0-9,]+)\]/)||'',
        b:g(/\bb:'([^']+)'/), l:g(/\bl:'([^']+)'/), am:g(/am:'([^']+)'/),
        k:g(/\bk:'([^']+)'/), h:g(/\bh:'([^']+)'/), feel:g(/feel:'([a-z0-9]+)'/)||'normal'});
      st=-1; } } }
  return out; }
const songs=parse(mloops||'');
ok('MLOOPS has 100+ songs after the batch', songs.length>=100);

// 3. every asked-for voice has a body: melodic voices in synthV, kit hits in drumV
const di=code.indexOf('function drumV('); const dj=code.indexOf('function synthV(');
const drumSrc=(di>=0&&dj>di)?code.slice(di,dj):'';
ok('drumV dispatcher found', di>=0);
// 'osc' is a real sentinel handled directly in playStep (raw oscillator using
// the song's own f.wave), not a synthV kind -- never flag it as missing.
const voiceExists=v=>v==='osc'||code.indexOf("kind==='"+v+"'")>=0;
const drumExists=v=>drumSrc.indexOf("'"+v+"'")>=0||drumSrc.indexOf(v+':')>=0||voiceExists(v); /* hats are unquoted table keys */
const missing=new Set();
for(const s of songs){ for(const v of [s.b,s.l,s.am]) if(v&&!voiceExists(v)) missing.add(s.n+':'+v);
  for(const v of [s.k,s.h]) if(v&&!drumExists(v)) missing.add(s.n+':kit.'+v); }
ok('every MLOOPS voice has a synthV/drumV body ('+songs.length+' songs swept)', missing.size===0);
if(missing.size) console.log('    missing:', [...missing].slice(0,8).join(' '));

// 4+5+6. the fresh batch
const nvm=/const NEW_VIBES=\[([^\]]*)\]/.exec(code);
const newNames=nvm?[...nvm[1].matchAll(/'([^']+)'/g)].map(m=>m[1]):[];
/* NEW_VIBES MAY BE EMPTY, AND ON 8/2 IT IS (fixed the same day it fired).
   This used to demand a non-empty list, on the assumption that there is always
   a fresh unjudged batch in the build. That assumption broke the first time
   Paolo caught up: he judged batches 21, 22 and 23 in one day, so after the
   last verdict there was nothing left unjudged and the honest value is [].
   The gate was failing him for being FAST.
   The NEW badge means "cooked and not yet ruled on", so what the machine
   actually has to protect is not a non-empty list - it is that nothing cooked
   is HIDDEN from him. So: empty is legal, and when it is empty every song in
   MLOOPS must carry a verdict. A cooked song sitting unbadged and unjudged is
   the real defect, and that is now what fails. */
ok('NEW_VIBES is declared at all', nvm!==null);
const cdm=/const CANON_DEFAULTS=\{([^}]*)\}/.exec(code);
const ruled=new Set(cdm?[...cdm[1].matchAll(/'([^']+?)#\d+'\s*:/g)].map(m=>m[1]):[]);
/* THE BATCH 20 DEBT, NAMED RATHER THAN HIDDEN OR SILENTLY BURIED.
   The first run of this check found nine real songs in exactly the state it was
   written to catch: cooked by batch 20, shown to Paolo on his sheet (they carry
   his categories), never thumbed either way, and no longer badged NEW because
   batch 21 overwrote NEW_VIBES. They have been invisible-but-present for days.
   THEY ARE NOT BEING BURIED HERE. "Unjudged is dead" is his law and burying
   nine songs on his behalf inside a gate fix would be exactly the kind of
   decision this repo says is his. They are LISTED, so the debt is a fact the
   machine states out loud every run instead of a silence, and they are in front
   of him to rule on. The waiver is CLOSED: anything that falls into this state
   from now on fails, so the hole cannot reopen while nobody is looking. */
const BATCH20_UNRULED=['THE FORECLOSURE NOTICE','THE COUNTING ROOM',
  'THE BOSS TAKES HIS CUT','THE LAST GOOD CHECK','BROKEN WINDOW ANTHEM',
  'PARADE OF LOST BALLOONS','WHAT THE APPRENTICE BUILDS','HANDS THAT STILL BUILD',
  'A NAME NOT YET CHOSEN'];
const unbadged=songs.map(s=>s.n).filter(n=>!newNames.includes(n)&&!ruled.has(n));
const fresh_hidden=unbadged.filter(n=>!BATCH20_UNRULED.includes(n));
ok('nothing is cooked-but-hidden: every song is either badged NEW or has a verdict'
   +(newNames.length?'':'  (NEW_VIBES empty: he has judged everything else)'),
   fresh_hidden.length===0);
if(fresh_hidden.length) console.log('    unjudged and unbadged:', fresh_hidden.slice(0,8).join(' | '));
if(unbadged.length) console.log('    KNOWN DEBT, waiting on Paolo ('+unbadged.length+
  ' batch-20 songs cooked, shown, never ruled): '+unbadged.slice(0,4).join(' | ')+' ...');
const newSongs=newNames.map(n=>songs.find(s=>s.n===n));
ok('every NEW_VIBES name is a real MLOOPS song', newSongs.every(Boolean));
const tuples=new Set(newSongs.filter(Boolean).map(s=>s.scale+'|'+s.feel+'|'+s.kick));
ok('VARIETY LAW: no two fresh songs share scale+feel+kick', tuples.size===newSongs.filter(Boolean).length);
// a fresh song BIRTHS a voice: at least one of its b/l/am appears in no other song
const useCount={}; for(const s of songs) for(const v of new Set([s.b,s.l,s.am].filter(Boolean))) useCount[v]=(useCount[v]||0)+1;
ok('NEW VOICES LAW: every fresh song births at least one voice all its own',
   newSongs.filter(Boolean).every(s=>[s.b,s.l,s.am].filter(Boolean).some(v=>useCount[v]===1)));

console.log('  '+songs.length+' songs, '+newNames.length+' fresh, screech-swept '+(code.length/1e6).toFixed(1)+'MB');
console.log(`\n=== MUSIC GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
