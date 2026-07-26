// BOHEMIA GDD LINEAGE GATE (born 7/16/26 from a near-miss)
//
// WHY THIS EXISTS: at the GREAT MERGE, two inherited registries both claimed
// "GDD v2/v3/v4 superseded by v5." Both were wrong. v5's own opening line says it
// EXTENDS them. Archiving on that claim would have removed the three-dynasty arc,
// the Amalgamation's origin, the Fifth Dimensional Element, the endgame, and the
// fold from the live corpus. Nobody had read the documents.
//
// THE LAW THIS ENFORCES: v2, v3, v4 and v5 are ALL LIVE. A registry line is a
// CLAIM, not evidence. Supersession is proven by reading, never by assertion.
// If a future session wants to fold the lineage into one master, it must first
// make these term counts pass INSIDE the new master. Then this gate updates.
const fs=require('fs');
let p=0,f=0;
const ok=(n,c)=>{c?(p++):(f++,console.log('  > FAIL '+n));};
const read=n=>fs.existsSync(n)?fs.readFileSync(n,'utf8').toLowerCase():null;

const V={2:read('laws/BOHEMIA_GDD_v2.md'),3:read('laws/BOHEMIA_GDD_v3.md'),
         4:read('laws/BOHEMIA_GDD_v4.md'),5:read('laws/BOHEMIA_GDD_v5.md')};

// 1. all four must be LIVE at root. not ARCHIVE_ prefixed, not gone.
for(const v of [2,3,4,5]){
  ok('GDD v'+v+' is live in laws/', V[v]!==null);
  ok('GDD v'+v+' is not archived', !fs.existsSync('ARCHIVE_BOHEMIA_GDD_v'+v+'.md') && !fs.existsSync('archive/BOHEMIA_GDD_v'+v+'.md'));
}
const count=(s,t)=>s?(s.split(t).length-1):0;

// 2. the load-bearing lore each version ALONE carries. if a term lives in an
//    older GDD and NOT in v5, that older GDD is the only home of it: it is LIVE.
const SOLE=[
  ['dynasty',           2, 'the three-dynasty ~100-year arc'],
  ['data portrait',     2, 'the Amalgamation is built from uploaded portraits of the dead'],
  ['project angel',     2, 'pre-crash origin'],
  ['fifth dimensional', 2, 'the Amalgamation is not merely a computer'],
  ['crypto collapse',   2, 'the economic apocalypse itself'],
  ['killshot',          3, 'the dial killshot moment'],
  ['bunker',            4, 'Bunkerguy / succession'],
];
for(const [term,v,why] of SOLE){
  const inOld=count(V[v],term), inV5=count(V[5],term);
  ok('v'+v+' still holds "'+term+'" ('+why+')', inOld>0);
  // the proof that archiving would have LOST it:
  if(inV5===0) ok('"'+term+'" absent from v5 -> v'+v+' is its ONLY home, must stay live', inOld>0);
}

// 3. v5 must keep declaring what it is. if someone rewrites v5 into a true
//    superset, this line changes and the gate gets rewritten deliberately.
ok('v5 still declares itself an EXTENSION, not a replacement',
   V[5] && V[5].includes('v2 remains the lore foundation'));

// 4. the registry must never re-add the bad claim.
const reg=read('gates/bohemia_superseded.txt')||'';
for(const v of [2,3,4]){
  const bad=new RegExp('^\\s*bohemia_gdd_v'+v+'\\.md\\s*\\|','m').test(reg);
  ok('registry does NOT claim v'+v+' is superseded', !bad);
}

console.log(`\n=== GDD LINEAGE GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
