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
          posture:{}, gen:1, objectives:{}, locked:{}, log:[], done:false, outcome:null };
  (Q.roles||[]).forEach(function(r){ s.roles[r.name]=!!r.req; }); /* REQ present, OPT absent */
  return s;
}

function Runtime(Q, state){
  if(!(this instanceof Runtime)) return new Runtime(Q, state);
  this.Q=Q;
  this.state=state||freshState(Q);
  this.node=null;
  this._stageById={}; (Q.stages||[]).forEach(function(st){ this._stageById[st.n]=st; },this);
  this._talkById={};  (Q.talks ||[]).forEach(function(t){ this._talkById[t.id]=t; },this);
  this._nodeDos=hydrateNodeDos(Q);
}

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
    case 'set_stage': if(p[1]!=null) this.setStage(parseInt(p[1],10)); break;
    case 'show_objective':     this._obj(p[1],'active'); break;
    case 'complete_objective': this._obj(p[1],'done');   break;
    case 'cast': p.slice(1).forEach(function(r){ s.roles[r]=true; }); break;
    case 'bond':    if(p[1]) s.bonds[p[1]]=(s.bonds[p[1]]||0)+num(p[2]); break;
    case 'faction': if(p[1]) s.faction[p[1]]=(s.faction[p[1]]||0)+num(p[2]); break;
    case 'faction_posture': if(p[1]) s.posture[p[1]]=(s.posture[p[1]]||0)+num(p[2]); break;
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
    if(st.flags.indexOf('COMPLETE')>=0){ this.state.done=true; this.state.outcome='COMPLETE'; }
    if(st.flags.indexOf('FAIL')>=0){ this.state.done=true; this.state.outcome='FAIL'; }
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
Runtime.load=function(Q, json){ return new Runtime(Q, typeof json==='string'?JSON.parse(json):json); };

var API={ Runtime:Runtime, freshState:freshState, hydrateNodeDos:hydrateNodeDos, VERSION:'bqrt-1.0.0' };
if(typeof module!=='undefined' && module.exports) module.exports=API;
root.BQRuntime=API;
})(typeof globalThis!=='undefined'?globalThis:this);
