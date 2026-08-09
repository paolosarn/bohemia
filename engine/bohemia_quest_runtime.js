/* bohemia_quest_runtime.js — plays a parsed .bq quest. UI-AGNOSTIC.
   Consumes the AST from bohemia_bq.js (BQ.parse) and actually RUNS it: stages,
   talk nodes, option gates, and @DO verbs; tracks state, objectives, flags,
   knowledge, bonds, faction rep, locks, and the COMPLETE/FAIL outcome.

   This is the missing brick: the .bq format was parse-only until now. The runtime
   returns plain data (current speaker/says/options/objectives) that ANY ui renders,
   so it can be tested headless and later wired to the walkable slice + save.

   LAWS HONORED:
   - Never crash on an unknown @DO verb; log it, keep going. (voice-to-text spirit)
   - No stat/karma gates exist to evaluate (the parser already bans them).
   - State is plain JSON: serialize -> localStorage -> load, for the quest-aware save.

   No dependencies. Node + browser. Pairs with bohemia_bq.js. */
(function(root){
'use strict';

function num(x){ if(x==null) return 0; var n=parseInt(x,10); return isNaN(n)?0:n; }
function cmp(a,op,b){ a=+a; b=+b;
  switch(op){ case '>=':return a>=b; case '>':return a>b; case '<=':return a<=b;
              case '<':return a<b; case '==': case '=':return a===b; } return false; }

/* Recover ALL node-level @DO verbs. The parser keeps only the last one on a talk
   (trailingDo is a single field), so we re-walk the raw lines with the parser's own
   state rules and collect every @DO that belongs to a talk node (not a stage, not an
   @OPT continuation). Non-invasive: the parser is left untouched. */
function hydrateNodeDos(Q){
  var map={}, lines=Q.raw||[], curTalk=null, inStage=false, m;
  for(var i=0;i<lines.length;i++){
    var L=String(lines[i]).trim();
    if(/^@STAGE\b/.test(L)){ inStage=true; curTalk=null; continue; }
    if(/^@(QUEST|ACT|FACTION|ONCE|ROLE|OBJ|LOG)\b/.test(L)){ if(!/^@LOG/.test(L)){ curTalk=null; inStage=false; } continue; }
    if((m=/^@TALK\s+(\S+)/.exec(L))){ curTalk=m[1]; inStage=false; map[curTalk]=map[curTalk]||[]; continue; }
    if(/^@END\b/.test(L)){ curTalk=null; continue; }
    if(/^@OPT\b/.test(L)){ /* an @OPT swallows its continuation lines, incl. its @DOs */
      while(i+1<lines.length && /^\s*(\[gate:|->|@DO\b|TRAP\b|SILENCE\b)/.test(lines[i+1])) i++;
      continue;
    }
    if((m=/^@DO\s+(.*)$/.exec(L))){ if(curTalk && !inStage){ map[curTalk].push(m[1].trim()); } continue; }
  }
  return map;
}

function freshState(Q){
  var s={ stage:null, flags:{}, knows:{}, has:{}, roles:{}, faction:{}, bonds:{},
          posture:{}, gen:1, objectives:{}, locked:{}, log:[], done:false, outcome:null,
          doneTags:[], advanceTerritory:false };
  (Q.roles||[]).forEach(function(r){ s.roles[r.name]=!!r.req; }); /* REQ present, OPT absent */
  return s;
}

/* ---- WHO A ROLE ACTUALLY IS (Paolo 8/7, ruling A: "a bond built in one quest opens
   a door in another. Continuity is the dynasty.") ---------------------------------
   A bond has to attach to a PERSON, and a quest's LABEL for someone is not a person.
   Measured across the corpus before designing anything: 43 distinct role names, 5 used
   by more than one quest, and those five settle it without anybody deciding anything.

     neighbor  S06 `is=the_neighbor household=behind_fence`
               S09 `is=the_neighbor household=behind_fence`   IDENTICAL. Same person.
     runner    S02 `faction_any knows_the_load=true`
               S12 `faction=CARTEL moves_medicine=true`       DIFFERENT. Two people.

   THE AUTHOR ALREADY DECLARES IDENTITY, in the REQ conditions, and has been doing it
   since before anything could read it. Writing the neighbour's conditions verbatim
   twice IS him saying it is the same neighbour. So the key is the CONDITION SET, never
   the label: continuity needs no new authoring, and two different `runner`s can never
   be silently merged into one person.

   GROUNDED: in small-scale societies people interact with the same individuals over and
   over, and cooperation runs on DYADIC reciprocity - tracking, one-on-one, who helped
   you. A valley with no courts remembers people, not job titles. */
function personKey(Q, roleName){
  var r=(Q.roles||[]).filter(function(x){ return x.name===roleName; })[0];
  if(!r) return null;
  var toks=String(r.cond||'').trim().toLowerCase().split(/\s+/).filter(Boolean).sort();
  return roleName.toLowerCase()+'|'+toks.join(' ');
}

function Runtime(Q, state, shared){
  if(!(this instanceof Runtime)) return new Runtime(Q, state, shared);
  this.Q=Q;
  this.state=state||freshState(Q);
  /* THE CROSS-QUEST LEDGER. Optional, and null is EXACTLY the old behaviour, so a
     runtime built the old way is bit-for-bit unchanged. When present, bonds are written
     here as well as into the quest's own state, and read back by any later quest that
     names the same person. */
  this.shared=shared||null;
  this.node=null;
  this._stageById={}; (Q.stages||[]).forEach(function(st){ this._stageById[st.n]=st; },this);
  this._talkById={};  (Q.talks ||[]).forEach(function(t){ this._talkById[t.id]=t; },this);
  this._nodeDos=hydrateNodeDos(Q);
}

/* what this quest knows about a person, counting what OTHER quests already built */
Runtime.prototype.bondWith=function(roleName){
  var here=(this.state.bonds||{})[roleName];
  var k=personKey(this.Q, roleName);
  var there=(this.shared && this.shared.bonds && k!=null) ? this.shared.bonds[k] : undefined;
  if(here==null && there==null) return null;
  /* the carried bond IS the bond - the local number is this quest's contribution to it,
     already included. Never add them or a bond counts twice inside its own quest. */
  return there!=null ? there : here;
};

/* ---- conditions. entry= and [gate:] use the same vocabulary. ----
   isGate: an unrecognized/unparseable GATE is safe-FALSE (never offer a broken option);
   an unrecognized ENTRY token is treated as an available named trigger (TRUE). */
Runtime.prototype._cond=function(expr, isGate){
  if(expr==null) return true;
  expr=String(expr).trim();
  if(expr===''||expr.toLowerCase()==='none') return true;
  var self=this, s=this.state, m;
  var parts=expr.split(/\s*(?:,|&&|\band\b)\s*/i).filter(Boolean);
  if(parts.length>1) return parts.every(function(p){ return self._cond(p,isGate); });

  if((m=/^(\w+)\s*(>=|<=|==|=|>|<)\s*(-?\d+)$/.exec(expr))){
    var key=m[1].toLowerCase(), op=m[2], val=m[3], cur;
    if(key==='stage')       cur=(s.stage==null?-Infinity:s.stage);
    else if(key==='gen')    cur=s.gen;
    else if(this.bondWith(key)!=null) cur=this.bondWith(key);   /* carried across quests */
    else if(key in s.bonds) cur=s.bonds[key];
    else if(key in s.faction) cur=s.faction[key];
    else cur=0;
    return cmp(cur,op,val);
  }
  if((m=/^(\w+)\s*:\s*(\S+)$/.exec(expr))){
    var k=m[1].toLowerCase(), v=m[2];
    if(k==='flag')    return !!s.flags[v];
    if(k==='knows')   return !!s.knows[v];
    if(k==='has')     return !!s.has[v];
    if(k==='role')    return !!s.roles[v];
    if(k==='faction') return !!s.faction[v];
    if(k==='gen')     return cmp(s.gen,'>=',v);
    return false; /* a real but unknown key:val condition never silently passes */
  }
  return !isGate; /* bare token: an ENTRY named-trigger is available; a GATE is not */
};

Runtime.prototype._exec=function(text){
  if(!text) return;
  var s=this.state, p=String(text).trim().split(/\s+/), verb=p[0];
  switch(verb){
    case 'set_flag': if(p[1]) s.flags[p[1]]=true; break;
    case 'learn':    if(p[1]) s.knows[p[1]]=true; break;
    case 'have': case 'give': if(p[1]) s.has[p[1]]=true; break;
    /* call the PROTOTYPE method directly, not this.setStage: a host (the loop's
       ledger pipe) may have installed an own-property wrapper on this instance's
       setStage to observe EXTERNAL calls. If an internal @DO set_stage went through
       that wrapper too, a choice that completes a quest in one step would fire the
       OUTCOME event recursively mid-choice, before the CHOICE event itself was even
       recorded — a chronological bug in the ledger, not a stylistic one. Bypassing
       the wrapper here keeps internal transitions on the canonical logic only, so
       the host always sees choice-then-outcome in the order they actually happened. */
    case 'set_stage': if(p[1]!=null) Runtime.prototype.setStage.call(this, parseInt(p[1],10)); break;
    case 'show_objective':     this._obj(p[1],'active'); break;
    case 'complete_objective': this._obj(p[1],'done');   break;
    case 'cast': p.slice(1).forEach(function(r){ s.roles[r]=true; }); break;
    case 'bond':    if(p[1]){ s.bonds[p[1]]=(s.bonds[p[1]]||0)+num(p[2]);
                      /* and into the valley's memory of that person, so the next quest
                         that names them starts from what you already did */
                      var bk=personKey(this.Q,p[1]);
                      if(this.shared&&bk!=null){ if(!this.shared.bonds) this.shared.bonds={};
                        this.shared.bonds[bk]=(this.shared.bonds[bk]||0)+num(p[2]); } }
                    break;
    case 'faction': if(p[1]) s.faction[p[1]]=(s.faction[p[1]]||0)+num(p[2]); break;
    case 'faction_posture': if(p[1]) s.posture[p[1]]=(s.posture[p[1]]||0)+num(p[2]); break;
    /* PACING LAW (Paolo 7/24): the territory AI's advanceRound is never a tick —
       it fires when "the narrative calls for it — a quest resolves, a story beat
       lands." This is that lever, opt-in per quest: an author marks the ONE
       resolution stage that's a real story beat, everyday errands never touch it. */
    case 'advance_territory': s.advanceTerritory=true; break;
    case 'play': s.log.push('play '+p.slice(1).join(' ')); break;
    default: s.log.push('UNHANDLED_DO: '+text);
  }
};

Runtime.prototype._obj=function(n,status){
  n=parseInt(n,10); if(isNaN(n)) return;
  var def=(this.Q.objs||[]).filter(function(o){ return o.n===n; })[0];
  this.state.objectives[n]={ n:n, text:def?def.text:('objective '+n),
                             target:def?def.target:null, status:status };
};

Runtime.prototype.start=function(stageN){
  var ns=(this.Q.stages||[]).map(function(s){return s.n;}).sort(function(a,b){return a-b;});
  var first=(stageN!=null)?stageN:(ns.length?ns[0]:null);
  if(first!=null) this.setStage(first);
  return this;
};

Runtime.prototype.setStage=function(n){
  var st=this._stageById[n], self=this;
  this.state.stage=n;
  if(st){
    if(st.log) this.state.log.push('[stage '+n+'] '+st.log);
    (st.dos||[]).forEach(function(d){ self._exec(d.text); });
    /* doneTags: the completing stage's raw #hashtags (e.g. #reckless), carried
       verbatim so the LOOP layer can classify the outcome (CLOUT weighting) without
       this UI-agnostic runtime knowing anything about followers or feeds. */
    if(st.flags.indexOf('COMPLETE')>=0){ this.state.done=true; this.state.outcome='COMPLETE'; this.state.doneTags=(st.tags||[]).slice(); }
    if(st.flags.indexOf('FAIL')>=0){ this.state.done=true; this.state.outcome='FAIL'; this.state.doneTags=(st.tags||[]).slice(); }
  }
  return this;
};

/* which talk nodes can be STARTED right now: those with an entry condition that
   passes and are not locked. (Nodes without entry are sub-nodes reached via ->.) */
Runtime.prototype.available=function(){
  var self=this, out=[];
  (this.Q.talks||[]).forEach(function(t){
    if(!t.entry) return;
    if(self.state.locked[t.id]) return;
    if(self._cond(t.entry,false)) out.push(t.id);
  });
  return out;
};

Runtime.prototype._enter=function(t){
  this.node=t;
  var self=this;
  (this._nodeDos[t.id]||[]).forEach(function(d){ self._exec(d); });
  (t.locks||[]).forEach(function(l){ self.state.locked[l.target]=true; });
  return this.view();
};

Runtime.prototype.begin=function(id){
  var t=this._talkById[id];
  if(!t) return null;
  return this._enter(t);
};

Runtime.prototype.view=function(){
  var t=this.node, self=this;
  if(!t) return { ended:true, node:null, done:this.state.done, outcome:this.state.outcome };
  var opts=[];
  (t.opts||[]).forEach(function(o,i){
    if(self._cond(o.gate,true)) opts.push({ i:i, text:o.text, silence:!!o.silence, trap:!!o.trap, to:o.to });
  });
  return { node:t.id, speaker:t.speaker,
           says:t.says.map(function(s){return s.text;}),
           noverbs:t.noverbs.map(function(n){return n.text;}),
           options:opts, ended:false, done:this.state.done, outcome:this.state.outcome };
};

Runtime.prototype.choose=function(i){
  var t=this.node; if(!t) return this.view();
  var o=t.opts[i]; if(!o) return this.view();
  if(!this._cond(o.gate,true)) return this.view();   /* gate must still hold */
  var self=this;
  (o.dos||[]).forEach(function(d){ self._exec(d.text); });
  if(!o.to || o.to==='END'){ this.node=null; return this.view(); }
  var nt=this._talkById[o.to];
  if(!nt){ this.node=null; return this.view(); }
  return this._enter(nt);
};

Runtime.prototype.objectives=function(){
  var s=this.state, out=[];
  Object.keys(s.objectives).forEach(function(k){ out.push(s.objectives[k]); });
  out.sort(function(a,b){ return a.n-b.n; });
  return out;
};

Runtime.prototype.serialize=function(){ return JSON.stringify(this.state); };
Runtime.load=function(Q, json, shared){ return new Runtime(Q, typeof json==='string'?JSON.parse(json):json, shared); };

var API={ Runtime:Runtime, freshState:freshState, personKey:personKey, hydrateNodeDos:hydrateNodeDos, VERSION:'bqrt-1.0.0' };
if(typeof module!=='undefined' && module.exports) module.exports=API;
root.BQRuntime=API;
})(typeof globalThis!=='undefined'?globalThis:this);
