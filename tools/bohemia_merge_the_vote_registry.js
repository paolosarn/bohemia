#!/usr/bin/env node
/* BOHEMIA -- MERGE THE VOTE REGISTRY.  PORTRAIT, 9/24/26, after breaking it myself.
 * REWRITTEN 9/27/26 after breaking it a SECOND way -- see "SPLICED AS TEXT" below.
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
 * SO THE FIRST VERSION OF THIS TOOL MERGED ON DATA: during a merge git keeps three COMPLETE,
 * VALID copies in the index -- :1 base, :2 ours, :3 theirs -- and it parsed all three, took
 * the union of items[] and verdicts[] by id, and wrote the result with
 * `JSON.stringify(merged, null, 1)`. That fixed the invalid-JSON problem completely.
 *
 * *** AND IT INTRODUCED A NEW ONE, THE SAME SHAPE ONE STEP LATER. *** On 9/27, two lanes
 * (LIFE+CITY, then PEOPLE, independently, two hours apart) found that writing the WHOLE
 * registry back through a JSON dumper to add a handful of rows RE-ENCODES EVERY OTHER
 * LANE'S ESCAPING. PEOPLE's own words: "MY LAST TWO COMMITS RE-SERIALIZED THE WHOLE
 * REGISTRY THROUGH A JSON DUMPER TO ADD ONE ROW. 3,000 lines in and 3,000 out for thirteen
 * lines of content... the next lane to rebase over it pays for that." I read that commit
 * after pushing my OWN fourth registry merge of the round through this very tool, and this
 * tool's write path is `JSON.stringify(merged, null, 1)` -- EXACTLY the mistake, just with
 * a correctness-checked merge sitting in front of it instead of a manual dump. Fixing
 * "merge on data, not on braces" and then still re-serializing the whole file is fixing the
 * parsing half of the incident and leaving the diff half in place.
 *
 * *** SO NOW IT SPLICES AS TEXT, THE WAY PEOPLE'S FIX DID, BUT AS A MACHINE, NOT A HABIT. ***
 * (A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED -- two lanes writing the same lesson down by
 * hand in one afternoon is exactly what that law is for.) The base copy's raw BYTES are the
 * host document. A JSON-aware scanner (respects string escaping, never confused by a brace
 * or bracket inside somebody's "why" text) finds:
 *   - each top-level item/verdict that BOTH exists in base AND was changed by ours or theirs
 *     (this is the sha-citation-fixup shape: repoint one field on a row you already own) --
 *     that one object's span is REPLACED, nothing else in the array is touched.
 *   - the position right after the array's last existing element -- new items from ours,
 *     then new items from theirs, are INSERTED there, freshly serialized (there is no
 *     escaping to preserve for content that has never been written before) and reindented
 *     to the file's own indent unit, measured off the file rather than assumed.
 * Every other line of the file, including every OTHER lane's items, verdicts, and the
 * _readme block, is copied through unchanged, byte for byte.
 * Verified before it is trusted: the spliced text is re-parsed and checked structurally
 * equal to the same `merged` object the old data-merge computed, so the splice can never
 * silently diverge from the correctness logic below it.
 * IF THE SPLICE CANNOT BE DONE SAFELY (no base text to splice onto, a span cannot be found,
 * or the post-splice re-parse disagrees with `merged`) IT FALLS BACK to the old
 * whole-file `JSON.stringify`, but SAYS SO loudly on stderr, because a silent fallback to
 * the bad path is how this stayed broken for a whole round the first time.
 *
 * AND IT STILL EXITS NON-ZERO WHEN IT REFUSES, which is the other half of the 9/24 incident:
 * my resolver DID assert and DID throw, and the `git add && git rebase --continue` on the
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
function deepEq(a,c){ return JSON.stringify(a)===JSON.stringify(c); }
/* not a general canonicalizer -- JSON.stringify on parsed objects is stable enough here
   because we never compare across two different serializers, only parsed-vs-parsed */

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

/* ===================== JSON-AWARE TEXT SURGERY =====================
   Everything below reads TEXT and returns byte OFFSETS. None of it re-serializes anything
   that was already there; it only ever locates spans so we can leave them untouched, or
   replace/insert with freshly-serialized new content. */

/* From an opening '{' or '[' at text[openIdx], return the index of its matching close,
   respecting string literals (so a brace inside somebody's "why" text can never fool it). */
function matchBracket(text, openIdx){
  const open=text[openIdx], close = open==='{' ? '}' : ']';
  let depth=0, i=openIdx, inStr=false, esc=false;
  for(; i<text.length; i++){
    const c=text[i];
    if(inStr){
      if(esc) esc=false;
      else if(c==='\\') esc=true;
      else if(c==='"') inStr=false;
      continue;
    }
    if(c==='"'){ inStr=true; continue; }
    if(c===open) depth++;
    else if(c===close){ depth--; if(depth===0) return i; }
  }
  throw new Error('unbalanced JSON text: no match for '+open+' at '+openIdx);
}

/* Scan a JSON VALUE starting at text[i] (whitespace already skipped) and return the index
   right after it ends (object/array via matchBracket, string via escape-aware scan,
   number/true/false/null via a stop-char scan). */
function valueEnd(text, i){
  const c=text[i];
  if(c==='{'||c==='[') return matchBracket(text,i)+1;
  if(c==='"'){
    let j=i+1, esc=false;
    for(; j<text.length; j++){
      if(esc){ esc=false; continue; }
      if(text[j]==='\\'){ esc=true; continue; }
      if(text[j]==='"') return j+1;
    }
    throw new Error('unterminated string at '+i);
  }
  /* number / true / false / null: stop at the next structural char or whitespace */
  let j=i;
  while(j<text.length && !',}] \t\r\n'.includes(text[j])) j++;
  return j;
}

/* Parse the top-level key: value pairs of a root JSON OBJECT whose '{' is at rootOpenIdx.
   Returns a Map key -> {keyStart, valStart, valEnd} (valEnd exclusive, right after the
   value, before any trailing comma/whitespace). Only goes one level deep -- exactly what
   is needed to find "items", "verdicts", or any other top-level key untouched. */
function topLevelSpans(text, rootOpenIdx){
  const rootClose=matchBracket(text, rootOpenIdx);
  const out=new Map();
  let i=rootOpenIdx+1;
  while(true){
    while(i<rootClose && ' \t\r\n,'.includes(text[i])) i++;
    if(i>=rootClose) break;
    if(text[i]!=='"') throw new Error('expected a key at '+i);
    const keyStart=i;
    const keyEnd=valueEnd(text,i);           // strings use the same scanner
    const key=JSON.parse(text.slice(keyStart,keyEnd));
    i=keyEnd;
    while(i<rootClose && ' \t\r\n'.includes(text[i])) i++;
    if(text[i]!==':') throw new Error('expected : after key '+key+' at '+i);
    i++;
    while(i<rootClose && ' \t\r\n'.includes(text[i])) i++;
    const valStart=i;
    const vEnd=valueEnd(text,i);
    out.set(key,{keyStart,valStart,valEnd:vEnd});
    i=vEnd;
  }
  return out;
}

/* Given the span of an ARRAY value (text[start]==='[' ... text[end-1]===']'), return
   {elements:[{start,end,id}], lastElementEnd, closeIdx}. `id` is the parsed "id" field of
   each element if it has one and is an object, else null. Elements that are not objects
   (should not happen in this file) get id=null and are never matched/replaced by id. */
function arrayElements(text, start, end){
  const closeIdx=end-1; // text[closeIdx] === ']'
  const elements=[];
  let i=start+1, lastElementEnd=start+1;
  while(true){
    while(i<closeIdx && ' \t\r\n,'.includes(text[i])) i++;
    if(i>=closeIdx) break;
    const elStart=i;
    const elEnd=valueEnd(text,i);
    let id=null;
    if(text[elStart]==='{'){
      try{
        const spans=topLevelSpans(text.slice(elStart,elEnd), 0);
        const idSpan=spans.get('id');
        if(idSpan) id=JSON.parse(text.slice(elStart+idSpan.valStart, elStart+idSpan.valEnd));
      }catch(e){ /* leave id null; this element just won't be matchable by id */ }
    }
    elements.push({start:elStart,end:elEnd,id});
    lastElementEnd=elEnd;
    i=elEnd;
  }
  return {elements, lastElementEnd, closeIdx};
}

/* Measure the file's own indent unit and the base indent of an array's elements, straight
   off the bytes, so a future reformat of this file does not silently misalign a splice.
   Falls back to (2,4) -- this file's convention today -- only if nothing can be measured. */
function measureIndent(text, arrayValStart){
  let i=arrayValStart+1;
  while(i<text.length && (text[i]===' '||text[i]==='\r')) {}
  const m=/\[\r?\n( *)/.exec(text.slice(arrayValStart, arrayValStart+40));
  const elementIndent = m ? m[1].length : 4;
  /* the unit is the element indent minus the array-key indent (one level up); the array
     key itself sits at elementIndent/2 spaces in every registry shape seen so far, so a
     single level is elementIndent/2 when that divides evenly, else fall back to 2 */
  const unit = (elementIndent%2===0 && elementIndent>0) ? elementIndent/2 : 2;
  return {unit, elementIndent: elementIndent||4};
}

/* Serialize one object, reindented from a fresh JSON.stringify(obj, null, unit) so its
   nested lines land at `indentSpaces` for the object's own opening brace. This is the only
   place new bytes are invented, and it is invented ONLY for content nobody has written yet
   (a brand-new row) or content this splice is deliberately replacing wholesale (an edited
   row) -- never a re-encoding of bytes that could have been left alone.
   BARE FIRST LINE, ON PURPOSE. A REPLACE op's `start` is computed by arrayElements() to
   point AT the object's own '{', which means the whitespace before it is base's original
   indentation and is ALREADY part of the preserved prefix (out.slice(0, op.start)) -- if
   this function also indented line 0, that whitespace would be written twice. (Caught by
   diffing against base and finding an item's opening brace at 8 spaces instead of 4: the
   two write paths, insert and replace, need the indent in different places, and the first
   draft gave both of them the insert path's rule.) THE INSERT CALLER supplies its own
   line-0 indent explicitly, right where there is no pre-existing whitespace to double up. */
function serializeAt(obj, indentSpaces, unit){
  const raw=JSON.stringify(obj, null, unit);
  return raw.split('\n').map((line,idx)=> idx===0 ? line : ' '.repeat(indentSpaces)+line).join('\n');
}

/* THE SPLICE. Takes the base raw text and the already-correct `merged` object (computed by
   the same union logic as before) and returns spliced text, or throws if anything about the
   text doesn't match what was expected -- the caller falls back to a full re-serialize on
   any throw, never on a silent guess. */
function spliceOntoBase(baseText, base, merged, oursNew, theirsNew){
  const rootOpen=baseText.indexOf('{');
  if(rootOpen<0) throw new Error('no root object in base text');
  const top=topLevelSpans(baseText, rootOpen);

  const ops=[]; // {start, end, text}, applied end-to-start so earlier offsets stay valid

  for(const key of ['items','verdicts']){
    const span=top.get(key);
    if(!span) throw new Error('base text has no top-level "'+key+'"');
    const {unit, elementIndent}=measureIndent(baseText, span.valStart);
    const {elements, lastElementEnd, closeIdx}=arrayElements(baseText, span.valStart, span.valEnd);
    const byIdInBase=new Map(elements.filter(e=>e.id).map(e=>[e.id,e]));
    const mergedById=byId(merged[key]);

    /* 1. existing base rows whose content changed (the sha-fixup shape): replace in place */
    for(const el of elements){
      if(!el.id) continue;
      const wasObj=base[key].find(x=>x.id===el.id);
      const nowObj=mergedById.get(el.id);
      if(wasObj && nowObj && !deepEq(wasObj,nowObj)){
        ops.push({start:el.start, end:el.end, text:serializeAt(nowObj, elementIndent, unit)});
      }
    }

    /* 2. brand-new rows from either side: appended once, in the same base/ours/theirs
       order the data-merge already used, so text and data can never disagree on order */
    const already=new Set(elements.map(e=>e.id).filter(Boolean));
    const newOnes=[...oursNew[key], ...theirsNew[key]].filter(x=>x.id && !already.has(x.id));
    if(newOnes.length){
      const hasExisting=elements.length>0;
      /* INSERT, not replace: lastElementEnd sits right after the previous '}' with no
         whitespace of its own after it, so (unlike the replace path above) THIS caller must
         supply the first line's indent itself. */
      const pieces=newOnes.map(o=>' '.repeat(elementIndent)+serializeAt(o, elementIndent, unit));
      const text=(hasExisting?',\n':'\n')+pieces.join(',\n');
      ops.push({start:lastElementEnd, end:lastElementEnd, text});
    }
  }

  /* 3. any other top-level key the data-merge changed from base (rare: e.g. "version") */
  for(const k of Object.keys(merged)){
    if(k==='items'||k==='verdicts') continue;
    if(deepEq(base[k], merged[k])) continue;
    const span=top.get(k);
    if(!span) throw new Error('base text has no top-level "'+k+'" to replace');
    /* same replace-path rule as items/verdicts above: valStart already sits past this
       key's own indentation, so the first line of the new value must be bare. This key is
       a direct child of the root object (depth 1), so its own nested lines sit one indent
       unit in -- the same unit measured off the items array, since one file has one unit. */
    const {unit}=top.get('items') ? measureIndent(baseText, top.get('items').valStart) : {unit:2};
    ops.push({start:span.valStart, end:span.valEnd, text:serializeAt(merged[k], unit, unit)});
  }

  ops.sort((a,c)=> c.start-a.start);
  let out=baseText;
  for(const op of ops) out = out.slice(0,op.start) + op.text + out.slice(op.end);
  return out;
}

const CHECK=process.argv.includes('--check');

if(CHECK){
  const d=parse(fs.readFileSync(FILE,'utf8'),'on-disk');
  if(d){ validate(d,'the registry on disk');
    if(!bad) console.log(`  ok  ${d.items.length} items, ${d.verdicts.length} verdicts, valid, no dupes, every file present`); }
  process.exit(bad?1:0);
}

const baseText=stage(1);
const base=parse(baseText,'base'), ours=parse(stage(2),'ours'), theirs=parse(stage(3),'theirs');
if(!ours||!theirs){
  console.error('  REFUSED: this file is not in a conflicted state in the index.');
  console.error('  Run this DURING a rebase or merge conflict, or pass --check to validate on disk.');
  process.exit(1);
}
if(bad) process.exit(1);

/* SHAPE-CHECK OURS/THEIRS BEFORE TOUCHING THEM, not just the merged result. The union loop
   below assumes items/verdicts are arrays on every side; without this a malformed side
   (caught once by hand: "items" itself somehow not an array) threw an uncaught TypeError
   mid-iteration instead of a clean refusal -- exactly the "resolver threw, and the next
   command ran anyway" shape rule 33h/9/24's incident is named for, just one script over. */
for(const [label,d] of [['base',base],['ours',ours],['theirs',theirs]]){
  if(d===null) continue;
  if(!Array.isArray(d.items)) die(`${label}: "items" is not an array`);
  if(!Array.isArray(d.verdicts)) die(`${label}: "verdicts" is not an array`);
}
if(bad){ console.error('  Nothing was written.'); process.exit(1); }

const b=base||{items:[],verdicts:[]};
const merged=JSON.parse(JSON.stringify(ours));
const oursNewByKey={}, theirsNewByKey={};

for(const key of ['items','verdicts']){
  const seen=new Set(), out=[];
  const baseIds=new Set((b[key]||[]).map(x=>x.id));
  const push=x=>{ if(x&&x.id&&!seen.has(x.id)){ seen.add(x.id); out.push(x); } };
  for(const x of (b[key]||[]))      push(byId(ours[key]).get(x.id) || byId(theirs[key]).get(x.id) || x);
  for(const x of (ours[key]||[]))   push(x);
  for(const x of (theirs[key]||[])) push(x);
  merged[key]=out;
  oursNewByKey[key]=(ours[key]||[]).filter(x=>x.id && !baseIds.has(x.id));
  theirsNewByKey[key]=(theirs[key]||[]).filter(x=>x.id && !baseIds.has(x.id));
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

/* *** SPLICE AS TEXT. FALL BACK ONLY IF IT CANNOT BE DONE, AND SAY SO LOUDLY. *** */
let finalText=null, splicedOk=false;
if(baseText){
  try{
    const spliced=spliceOntoBase(baseText, b, merged, oursNewByKey, theirsNewByKey);
    const reparsed=JSON.parse(spliced);
    /* the splice must produce EXACTLY the object the data-merge already proved correct --
       this is what lets the surgery above be aggressive without being trusted blindly */
    if(!deepEq(reparsed, merged)) throw new Error('spliced text re-parses to something different from the verified merge');
    finalText=spliced; splicedOk=true;
  }catch(e){
    console.error('  COULD NOT SPLICE AS TEXT ('+e.message+').');
    console.error('  Falling back to a full re-serialization -- THIS DIFF WILL TOUCH EVERY');
    console.error('  EXISTING LINE and needs a human look before it ships. Report this so the');
    console.error('  splice path gets fixed for the shape that beat it.');
  }
}else{
  console.error('  No base copy of the file (not a real 3-way conflict) -- cannot splice as');
  console.error('  text against nothing. Falling back to a full re-serialization.');
}
if(!splicedOk) finalText=JSON.stringify(merged,null,1);

fs.writeFileSync(FILE, finalText.replace(/\n$/,''));
const addedO=merged.items.length-(ours.items||[]).length, addedT=merged.items.length-(theirs.items||[]).length;
console.log(`  merged on DATA, not on braces: ${merged.items.length} items, ${merged.verdicts.length} verdicts`);
console.log(`  ours had ${ours.items.length} items (+${addedO} from the other side), theirs had ${theirs.items.length} (+${addedT})`);
console.log('  nothing lost from either side, no duplicate ids, every referenced file present.');
console.log(splicedOk
  ? '  SPLICED AS TEXT: every unrelated line is the base copy, byte for byte.'
  : '  WROTE A FULL RE-SERIALIZATION (see the warning above) -- diff this before pushing.');
