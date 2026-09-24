#!/usr/bin/env node
/* BOHEMIA -- MERGE THE VOTE REGISTRY.  PORTRAIT, 9/24/26, after breaking it myself.
 *
 * *** WHY THIS EXISTS. *** Every lane appends to records/target/BOHEMIA_VOTE_REGISTRY.json
 * every round, so every lane hits the same conflict on every rebase, and everybody has
 * been resolving it BY SPLICING BRACES: glue a "}", a "," and a "{" between the two halves
 * of the split object and hope. That works only when both sides appended exactly one item.
 *
 * On 9/24 the other side carried TWO COMPLETE, ALREADY-CLOSED items, the splice added three
 * stray braces, and I committed invalid JSON. EYES logged the same shape twice before me
 * (two conflicted registries reaching main in one round, 9eec17d and 7104c0b1). It is not
 * a mistake anyone is going to stop making by being careful; it is the wrong technique.
 *
 * *** SO THIS DOES NOT TOUCH THE CONFLICTED TEXT AT ALL. *** During a merge or rebase git
 * keeps three COMPLETE, VALID copies in the index -- :1 base, :2 ours, :3 theirs -- so the
 * merge happens on DATA, not on characters:
 *   items    base order, then anything either side added, by id, first writer wins
 *   verdicts the same. A VOTE CONSUMES (law), so a verdict must never be dropped.
 *   the rest every other key taken from whichever side changed it, and it REFUSES if the
 *            two sides changed the same one differently rather than picking for you.
 *
 * AND IT EXITS NON-ZERO WHEN IT REFUSES, which is the other half of what went wrong: my
 * resolver DID assert and DID throw, and the `git add && git rebase --continue` on the
 * next line ran anyway. A check whose failure does not stop the next step is a comment.
 * Chain it: node tools/bohemia_merge_the_vote_registry.js && git add -A && git rebase --continue
 *
 *   node tools/bohemia_merge_the_vote_registry.js [--check]
 *     (no args)  resolve the conflict from the index and write the file
 *     --check    only validate the file on disk; resolves nothing
 */
'use strict';
const {execFileSync}=require('child_process');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');
const REL='records/target/BOHEMIA_VOTE_REGISTRY.json';
const FILE=path.join(ROOT,REL);
let bad=0;
const die=m=>{console.error('  REFUSED: '+m); bad++;};

function stage(n){
  try{ return execFileSync('git',['show',`:${n}:${REL}`],{cwd:ROOT,maxBuffer:1<<28}).toString(); }
  catch(e){ return null; }
}
function parse(txt,who){
  if(txt==null) return null;
  try{ return JSON.parse(txt); }
  catch(e){ die(`the ${who} copy is not valid JSON (${e.message}). Nothing was written.`); return null; }
}
function byId(list){ const m=new Map(); for(const x of (list||[])) if(x&&x.id) m.set(x.id,x); return m; }

function validate(d,label){
  if(!d||!Array.isArray(d.items)||!Array.isArray(d.verdicts))
    return die(`${label}: no items[] or no verdicts[]`);
  const ids=d.items.map(i=>i.id);
  const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
  if(dup.length) die(`${label}: duplicate item ids ${[...new Set(dup)].join(', ')}`);
  /* A TEXT ITEM MAY HAVE AN EMPTY src AND THAT IS NOT A DEFECT. The registry's own readme:
     "text src is the words themselves", and the coordinator's philosophical items (rule
     15a) carry everything in `why` with src "". This check fired on all three of them the
     first time it ran, which was MY RULE being wrong, not the data. Same lesson as the
     dial sweep an hour earlier: prove the instrument before believing what it says. */
  const noSrc=d.items.filter(i=>!i.show||!i.show.how||(i.show.how!=='text'&&!i.show.src));
  if(noSrc.length) die(`${label}: ${noSrc.length} item(s) with no show/src: ${noSrc.slice(0,3).map(i=>i.id).join(', ')}`);
  const mute=d.items.filter(i=>i.show&&i.show.how==='text'&&!i.show.src&&!(i.why||'').trim());
  if(mute.length) die(`${label}: ${mute.length} text item(s) with neither src nor why: ${mute.slice(0,3).map(i=>i.id).join(', ')}`);
  /* a page or image item must point at a file that is really there, or the tab 404s */
  const missing=d.items.filter(i=>{
    const s=i.show||{}; if(s.how!=='page'&&s.how!=='image'&&s.how!=='clip'&&s.how!=='audio')return false;
    return !fs.existsSync(path.join(ROOT,'slices',s.src));
  });
  if(missing.length) die(`${label}: ${missing.length} item(s) point at a file that is not in slices/: `+
    missing.slice(0,4).map(i=>i.id+' -> '+i.show.src).join(', '));
  return !bad;
}

const CHECK=process.argv.includes('--check');

if(CHECK){
  const d=parse(fs.readFileSync(FILE,'utf8'),'on-disk');
  if(d){ validate(d,'the registry on disk');
    if(!bad) console.log(`  ok  ${d.items.length} items, ${d.verdicts.length} verdicts, valid, no dupes, every file present`); }
  process.exit(bad?1:0);
}

const base=parse(stage(1),'base'), ours=parse(stage(2),'ours'), theirs=parse(stage(3),'theirs');
if(!ours||!theirs){
  console.error('  REFUSED: this file is not in a conflicted state in the index.');
  console.error('  Run this DURING a rebase or merge conflict, or pass --check to validate on disk.');
  process.exit(1);
}
if(bad) process.exit(1);

const b=base||{items:[],verdicts:[]};
const merged=JSON.parse(JSON.stringify(ours));

for(const key of ['items','verdicts']){
  const seen=new Set(), out=[];
  const push=x=>{ if(x&&x.id&&!seen.has(x.id)){ seen.add(x.id); out.push(x); } };
  for(const x of (b[key]||[]))      push(byId(ours[key]).get(x.id) || byId(theirs[key]).get(x.id) || x);
  for(const x of (ours[key]||[]))   push(x);
  for(const x of (theirs[key]||[])) push(x);
  merged[key]=out;
}

/* every other key: take whichever side moved it, and refuse if both moved it differently */
for(const k of new Set([...Object.keys(ours),...Object.keys(theirs)])){
  if(k==='items'||k==='verdicts') continue;
  const o=JSON.stringify(ours[k]), t=JSON.stringify(theirs[k]), bb=JSON.stringify(b[k]);
  if(o===t) continue;
  if(o===bb) merged[k]=theirs[k];
  else if(t===bb) merged[k]=ours[k];
  else die(`both sides changed "${k}" differently. Pick one by hand; nothing was written.`);
}

if(!validate(merged,'the merged registry')) { console.error('  Nothing was written.'); process.exit(1); }

/* NOTHING EITHER SIDE HAD MAY BE MISSING. This is the claim that actually matters: a lost
   verdict means he is asked to judge something he already judged, which NOTES ARE RULINGS
   forbids, and a lost item is somebody's whole round. */
for(const [who,src] of [['ours',ours],['theirs',theirs]])
  for(const key of ['items','verdicts']){
    const have=new Set(merged[key].map(x=>x.id));
    const lost=(src[key]||[]).filter(x=>!have.has(x.id)).map(x=>x.id);
    if(lost.length) die(`${lost.length} ${key} from ${who} are missing: ${lost.slice(0,5).join(', ')}`);
  }
if(bad){ console.error('  Nothing was written.'); process.exit(1); }

fs.writeFileSync(FILE, JSON.stringify(merged,null,1).replace(/\n$/,''));
const addedO=merged.items.length-(ours.items||[]).length, addedT=merged.items.length-(theirs.items||[]).length;
console.log(`  merged on DATA, not on braces: ${merged.items.length} items, ${merged.verdicts.length} verdicts`);
console.log(`  ours had ${ours.items.length} items (+${addedO} from the other side), theirs had ${theirs.items.length} (+${addedT})`);
console.log('  nothing lost from either side, no duplicate ids, every referenced file present.');
