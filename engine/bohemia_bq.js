/* bohemia_bq.js — Bohemia Quest (.bq) parser, serializer, validator.
   LAWS ENFORCED IN CODE:
   - Never crash on a garbled line. Preserve it, flag it. (voice-to-text law)
   - Round-trip lossless: parse -> serialize -> byte-identical.
   - No stat/karma gates. The format cannot express them. (CONSCIENCE SYSTEM)
   - REQ roles must be castable. (Bethesda alias-fill gate)
   No dependencies. Runs in node and in the browser. */
(function(root){
'use strict';

var BANNED_GATES = ['charm','paragon','renegade','karma','speech','morality','intimidate','persuasion'];
var GATE_KEYS    = ['none','knows','flag','has','role','faction','gen'];

/* ---------- PARSE ---------- */
function parse(text){
  var Q = { id:'', title:'', act:null, faction:null, once:true,
            roles:[], stages:[], objs:[], talks:[], raw:[], warnings:[] };
  var lines = String(text).replace(/\r\n/g,'\n').split('\n');
  var curStage=null, curTalk=null;

  for (var i=0;i<lines.length;i++){
    var raw = lines[i];
    Q.raw.push(raw);
    var L = raw.trim();
    var ln = i+1;
    if (L==='' || L[0]==='#'){ continue; }

    var m;
    if ((m=/^@QUEST\s+(\S+)\s*(.*)$/.exec(L))){ Q.id=m[1]; Q.title=m[2].trim(); curStage=null; curTalk=null; continue; }
    if ((m=/^@ACT\s+(\S+)/.exec(L))){ Q.act=m[1]; continue; }
    if ((m=/^@FACTION\s+(\S+)/.exec(L))){ Q.faction=m[1]; continue; }
    if ((m=/^@ONCE\s+(\S+)/.exec(L))){ Q.once = /^true$/i.test(m[1]); continue; }

    if ((m=/^@ROLE\s+(\S+)\s+(REQ|OPT)\s*(.*)$/i.exec(L))){
      Q.roles.push({ name:m[1], req:/^REQ$/i.test(m[2]), cond:m[3].trim(), line:ln });
      continue;
    }

    if ((m=/^@STAGE\s+(\d+)\s*(.*)$/.exec(L))){
      var flags = m[2].trim().toUpperCase().split(/\s+/).filter(Boolean);
      curStage = { n:parseInt(m[1],10), log:'', dos:[], flags:flags, tags:tagsOf(raw), line:ln };
      Q.stages.push(curStage); curTalk=null; continue;
    }
    if ((m=/^@LOG\s+(.*)$/.exec(L))){ if(curStage) curStage.log = m[1].trim(); else warn(Q,ln,'@LOG outside a @STAGE'); continue; }
    if ((m=/^@DO\s+(.*)$/.exec(L))){
      var d = { text:m[1].trim(), line:ln };
      if (curStage) curStage.dos.push(d);
      else if (curTalk) curTalk.trailingDo = d;
      else warn(Q,ln,'@DO outside a @STAGE or @TALK');
      continue;
    }
    if ((m=/^@OBJ\s+(\d+)\s+"([^"]*)"\s*(?:target=(\S+))?/.exec(L))){
      Q.objs.push({ n:parseInt(m[1],10), text:m[2], target:m[3]||null, line:ln }); continue;
    }

    if ((m=/^@TALK\s+(\S+)\s*(.*)$/.exec(L))){
      var attrs = attrsOf(m[2]);
      curTalk = { id:m[1], speaker:attrs.speaker||null, entry:attrs.entry||null,
                  says:[], opts:[], locks:[], noverbs:[], tags:tagsOf(raw), line:ln };
      Q.talks.push(curTalk); curStage=null; continue;
    }
    if ((m=/^@SAY\s+(.*)$/.exec(L))){ if(curTalk) curTalk.says.push({text:stripTags(m[1]).trim(), tags:tagsOf(raw), line:ln}); else warn(Q,ln,'@SAY outside a @TALK'); continue; }
    if ((m=/^@OPT\s+(.*)$/.exec(L))){
      if(!curTalk){ warn(Q,ln,'@OPT outside a @TALK'); continue; }
      var body = m[1];
      /* CONTINUATION: an @OPT may wrap. Following lines that start with [gate: or -> or @DO
         belong to it. Voice-to-text wraps long lines; the format must not punish that. */
      while (i+1 < lines.length && /^\s*(\[gate:|->|@DO\b|TRAP\b|SILENCE\b)/.test(lines[i+1])){
        i++; Q.raw.push(lines[i]); body += ' ' + lines[i].trim();
      }
      var o = parseOpt(body, ln, Q);
      curTalk.opts.push(o); continue;
    }
    if ((m=/^@LOCK\s+(\S+)/.exec(L))){ if(curTalk) curTalk.locks.push({target:m[1], line:ln}); else warn(Q,ln,'@LOCK outside a @TALK'); continue; }
    if ((m=/^@NOVERB\s+(.*)$/.exec(L))){ if(curTalk) curTalk.noverbs.push({text:m[1].trim(), line:ln}); else warn(Q,ln,'@NOVERB outside a @TALK'); continue; }
    if (/^@END\b/.test(L)){ curTalk=null; continue; }

    /* UNKNOWN LINE. Never dropped. Never fatal. Voice-to-text law. */
    warn(Q, ln, 'unrecognized line kept verbatim: ' + L.slice(0,60));
  }
  return Q;
}

function parseOpt(s, ln, Q){
  var o = { text:'', gate:'none', gateKey:'none', gateVal:null, trap:false, silence:false,
            to:null, dos:[], line:ln, raw:s };
  var m;
  if ((m=/^"([^"]*)"/.exec(s))) o.text = m[1];
  else if ((m=/^\(([^)]*)\)/.exec(s))) { o.text = '('+m[1]+')'; o.silence = true; }
  else { warn(Q, ln, '@OPT has no quoted text'); o.text = s.split('[')[0].trim(); }

  if ((m=/\[gate:\s*([^\]]*)\]/i.exec(s))){
    o.gate = m[1].trim();
    var parts = o.gate.split(':');
    o.gateKey = parts[0].trim().split(/[<>=]/)[0].trim().toLowerCase();
    o.gateVal = parts.slice(1).join(':').trim() || null;
  }
  if (/\bTRAP\b/.test(s)) o.trap = true;
  if (/\bSILENCE\b/.test(s)) o.silence = true;
  if ((m=/->\s*(\S+)/.exec(s))) o.to = m[1];
  var dre = /@DO\s+([^@]+)/g, d;
  while ((d = dre.exec(s))) o.dos.push({ text:d[1].trim(), line:ln });
  return o;
}

function tagsOf(s){ var t=[], m, re=/(?:^|\s)#([A-Za-z0-9_]+)/g; while((m=re.exec(s))) t.push(m[1]); return t; }
function stripTags(s){ return s.replace(/(?:^|\s)#[A-Za-z0-9_]+/g,''); }
function attrsOf(s){ var a={}, m, re=/(\w+)=([^\s]+)/g; while((m=re.exec(s))) a[m[1]]=m[2]; return a; }
function warn(Q,line,msg){ Q.warnings.push({line:line, msg:msg}); }

/* ---------- SERIALIZE (lossless round-trip) ---------- */
function serialize(Q){ return Q.raw.join('\n'); }

/* ---------- VALIDATE ---------- */
function validate(Q, world){
  world = world || null;
  var errs=[], warns=[];
  function E(c,m){ errs.push({code:c, msg:m}); }
  function W(c,m){ warns.push({code:c, msg:m}); }

  if(!Q.id) E('NO_ID','quest has no @QUEST id');
  if(!Q.stages.length) E('NO_STAGES','quest has no @STAGE');

  var roleNames = {}; Q.roles.forEach(function(r){ roleNames[r.name]=r; });

  /* G6 banned gates — CONSCIENCE SYSTEM enforced by the parser */
  Q.talks.forEach(function(t){ t.opts.forEach(function(o){
    BANNED_GATES.forEach(function(b){
      if (new RegExp('\\b'+b+'\\b','i').test(o.gate))
        E('BANNED_GATE','line '+o.line+': gate "'+o.gate+'" uses '+b.toUpperCase()+'. NO STAT GATES. NO KARMA. Ever.');
    });
    if (o.gateKey!=='none' && GATE_KEYS.indexOf(o.gateKey)<0)
      W('UNKNOWN_GATE','line '+o.line+': gate key "'+o.gateKey+'" not in the vocabulary');
    if (o.gateKey==='role' && o.gateVal && !roleNames[o.gateVal])
      E('GATE_NO_ROLE','line '+o.line+': gate role:'+o.gateVal+' is not a declared @ROLE');
  });});

  /* G3 dead links */
  var nodeIds={}; Q.talks.forEach(function(t){
    if(nodeIds[t.id]) E('DUP_NODE','duplicate @TALK id "'+t.id+'" (line '+t.line+')');
    nodeIds[t.id]=t;
  });
  Q.talks.forEach(function(t){
    t.opts.forEach(function(o){ if(o.to && o.to!=='END' && !nodeIds[o.to])
      E('DEAD_LINK','line '+o.line+': -> '+o.to+' does not exist'); });
    t.locks.forEach(function(l){ if(!nodeIds[l.target])
      E('DEAD_LOCK','line '+l.line+': @LOCK '+l.target+' does not exist'); });
    if(t.speaker && !roleNames[t.speaker])
      E('NODE_NO_ROLE','line '+t.line+': @TALK speaker='+t.speaker+' is not a declared @ROLE');
  });

  /* G2 orphan nodes — theme-in-optional, the ~18x flaw */
  var reached={}; Q.talks.forEach(function(t){ if(t.entry) reached[t.id]=true; });
  if(Q.talks.length && !Object.keys(reached).length && Q.talks[0]) reached[Q.talks[0].id]=true;
  var moved=true;
  while(moved){ moved=false;
    Q.talks.forEach(function(t){ if(reached[t.id]) t.opts.forEach(function(o){
      if(o.to && nodeIds[o.to] && !reached[o.to]){ reached[o.to]=true; moved=true; } }); });
  }
  Q.talks.forEach(function(t){ if(!reached[t.id])
    W('ORPHAN_NODE','@TALK '+t.id+' (line '+t.line+') is unreachable. Theme-in-optional is the ~18x flaw.'); });

  /* G1 alias-fill — the Bethesda lesson, taken for free */
  if(world){
    Q.roles.forEach(function(r){
      if(!r.req) return;
      if(typeof world.canCast!=='function') return;
      if(!world.canCast(r)) E('ALIAS_FILL','REQ @ROLE '+r.name+' (line '+r.line+') cannot be cast: '+r.cond+
        '. An unfilled REQ role fails the WHOLE quest silently. Bethesda shipped a debug flag for this; we fail the build.');
    });
  }

  /* G4 hardcoded names. Root-cause heuristic: a proper noun is a capitalized word that is NOT
     sentence-initial and NOT a declared role. Sentence-initial caps are grammar, not names. */
  Q.talks.forEach(function(t){ t.says.forEach(function(s){
    var txt = s.text, m, re=/([.!?]\s+|,\s+|\s+)([A-Z][a-z]{2,})/g;
    var STOP={The:1,This:1,That:1,They:1,Then:1,There:1,These:1,Those:1,You:1,Your:1,What:1,When:1,Where:1,Which:1,Who:1,Why:1,How:1,And:1,But:1,For:1,Not:1,Now:1,She:1,Her:1,His:1,Him:1,Its:1,Was:1,Were:1,Are:1,Did:1,Does:1,Get:1,Got:1,Had:1,Has:1,Have:1,Just:1,Like:1,Look:1,Make:1,Never:1,Nothing:1,Only:1,Same:1,Say:1,Said:1,Tell:1,Told:1,Take:1,Went:1,Yes:1,Sit:1,Good:1,Play:1,Cleared:1,Six:1,Everyone:1,Welcome:1,Unhoused:1,Bring:1,Write:1,Their:1,One:1,Instead:1,Nobody:1,All:1,Because:1,Before:1,Beyond:1,Every:1,Find:1,Give:1,Sorry:1,Stop:1,Still:1,Ask:1,Come:1,Keep:1,Wait:1,Watch:1,Speak:1,Read:1};
    while((m=re.exec(txt))){
      var w=m[2];
      if(m[1].match(/[.!?]/)) continue;            /* sentence-initial: grammar, not a name */
      if(STOP[w]) continue;
      if(roleNames[w.toLowerCase()]) continue;
      W('HARDCODED_NAME','line '+s.line+': possible hardcoded name "'+w+'". Quests written against names die with the person. Use a @ROLE.');
    }
  });});

  /* G7 removed verb */
  var nv=0; Q.talks.forEach(function(t){ nv+=t.noverbs.length; });
  if(Q.talks.length && nv===0)
    W('NO_NOVERB','quest declares zero @NOVERB. A quest where every obvious thing is sayable has not decided what it is about. (Q118/Q122/Q123/Q125)');

  /* G8 NAMED-BODY LAW (Q125) */
  Q.stages.forEach(function(st){
    if(st.tags.indexOf('namedbody')>=0){
      st.dos.forEach(function(d){
        if(/\b(give|loot|reward|credits|medicine|electricity|resources|item)\b/i.test(d.text))
          E('NAMED_BODY','line '+d.line+': stage #'+st.n+' is #namedbody and grants loot. NAMED-BODY LAW: no loot in a room with a corpse the player knows by name.');
      });
    }
  });

  /* G9 cross-generation flags need a test */
  var genReads=[]; Q.talks.forEach(function(t){ t.opts.forEach(function(o){
    if(o.gateKey==='gen' || /gen\s*>=\s*[23]/.test(o.gate)) genReads.push(o); });});
  if(genReads.length) W('GEN_FLAG_TEST','quest reads across a generation boundary ('+genReads.length+' gate(s)). FLAW LAW 3: needs a named regression test in bohemia_tests.js. Q116 shipped a flag bugged 25 years.');

  /* G5 branch count (Q117: count branches before scoping volume) */
  var endings = Q.stages.filter(function(s){ return s.flags.indexOf('COMPLETE')>=0 || s.flags.indexOf('FAIL')>=0; }).length;

  return {
    ok: errs.length===0,
    errors: errs, warnings: warns.concat(Q.warnings.map(function(w){ return {code:'PARSE', msg:'line '+w.line+': '+w.msg}; })),
    stats: { roles:Q.roles.length, reqRoles:Q.roles.filter(function(r){return r.req;}).length,
             stages:Q.stages.length, objectives:Q.objs.length, nodes:Q.talks.length,
             options:Q.talks.reduce(function(a,t){return a+t.opts.length;},0),
             traps:Q.talks.reduce(function(a,t){return a+t.opts.filter(function(o){return o.trap;}).length;},0),
             silences:Q.talks.reduce(function(a,t){return a+t.opts.filter(function(o){return o.silence;}).length;},0),
             noverbs:nv, locks:Q.talks.reduce(function(a,t){return a+t.locks.length;},0),
             endings: endings }
  };
}

function roundTrip(text){ return serialize(parse(text)) === String(text).replace(/\r\n/g,'\n'); }

var API = { parse:parse, serialize:serialize, validate:validate, roundTrip:roundTrip,
            BANNED_GATES:BANNED_GATES, GATE_KEYS:GATE_KEYS, VERSION:'bq-1.0.0' };
if (typeof module!=='undefined' && module.exports) module.exports = API;
root.BQ = API;
})(typeof globalThis!=='undefined'?globalThis:this);
