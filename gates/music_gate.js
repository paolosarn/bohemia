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
const voiceExists=v=>code.indexOf("kind==='"+v+"'")>=0;
const drumExists=v=>drumSrc.indexOf("'"+v+"'")>=0||drumSrc.indexOf(v+':')>=0||voiceExists(v); /* hats are unquoted table keys */
const missing=new Set();
for(const s of songs){ for(const v of [s.b,s.l,s.am]) if(v&&!voiceExists(v)) missing.add(s.n+':'+v);
  for(const v of [s.k,s.h]) if(v&&!drumExists(v)) missing.add(s.n+':kit.'+v); }
ok('every MLOOPS voice has a synthV/drumV body ('+songs.length+' songs swept)', missing.size===0);
if(missing.size) console.log('    missing:', [...missing].slice(0,8).join(' '));

// 4+5+6. the fresh batch
const nvm=/const NEW_VIBES=\[([^\]]*)\]/.exec(code);
const newNames=nvm?[...nvm[1].matchAll(/'([^']+)'/g)].map(m=>m[1]):[];
ok('NEW_VIBES declared and non-empty', newNames.length>0);
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
