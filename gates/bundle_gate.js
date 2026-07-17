// BOHEMIA BUNDLE GATE (born 7/16/26, second re-audit)
// The graphics bundle carries a per-module md5 header. Twice in one session it
// drifted from the canonical standalone modules: once inherited, once because a
// later edit touched a standalone AFTER the bundle was built. ENGINE SYNC's canon
// list did not cover the test module, so the drift passed unseen.
// A bundle that lies about its own md5s is worse than no bundle: it looks verified.
const fs=require('fs'),cr=require('crypto');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log('  > FAIL '+n));};
const B='engine/BOHEMIA_GRAPHICS_ENGINE_MASTER_7_16_26.js';
ok('bundle exists', fs.existsSync(B));
if(fs.existsSync(B)){
  const src=fs.readFileSync(B,'utf8');
  const rx=/### FILE: (\S+)\n### MD5: ([0-9a-f]{32})/g; let m,n=0;
  while((m=rx.exec(src))){
    n++;
    const [_,name,md5]=m;
    const sp='engine/'+name; if(fs.existsSync(sp)){
      const h=cr.createHash('md5').update(fs.readFileSync(sp)).digest('hex');
      ok('bundle md5 matches standalone: '+name, h===md5);
    } else ok('bundled module exists standalone: '+name, false);
  }
  ok('bundle declares modules (>0)', n>0);
  console.log('  '+n+' modules cross-checked against disk');
}
console.log(`\n=== BUNDLE GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
