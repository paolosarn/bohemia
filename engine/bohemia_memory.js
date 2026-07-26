// BOHEMIA MEMORY — what people remember seeing (7/19/26, LIFE session)
//
// The witness organ. Grounded in Shadows of Doubt's citizen memory model:
// a sighting starts near-accurate and FUZZES with time; how long it lasts
// scales with FAMILIARITY (you remember your neighbor longer than a
// stranger). Distinctiveness/alertness modifiers join later when the world
// has faces and factions (contents Paolo's).
//
// WHY THIS EXISTS NOW: the questbook's engine backlog demands THE
// SETTLEMENT'S MISSING-PERSONS ORGAN (Q133/Q134/Q138). Its seed question,
// "when did anyone last see H3-2, and how sure are they", is answerable
// from these minds: sightings recorded during the online sim, clarity
// decaying afterward, the best witness findable across a settlement.
// Testimony VERBS, lies, and what factions do with witnesses stay Paolo's.
//
// MECHANISM RULES:
//   - a mind is a RING BUFFER (cap enforced; memory is finite)
//   - repeat sightings of the same subject REFRESH the record and build
//     familiarity instead of flooding the buffer
//   - clarity = 0.5 ^ (age / halflife), halflife grows with familiarity
//     (base 12h; a face seen often keeps for days)
//   - deterministic: no wall clock, no randomness; pure f(turn)
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  var BASE_HALFLIFE=12*60;      // minutes: a stranger's face is fog by tomorrow
  var REFRESH_WINDOW=30;        // re-seeing within 30min updates, not duplicates
  var MIN_CLARITY=0.05;         // below this the witness has nothing usable

  function makeMind(ownerId, cap){
    return {owner:ownerId, cap:cap||64, sightings:[], fam:{}};
  }
  function see(mind, turn, subjectId, x, y){
    if(subjectId===mind.owner) return;               // you are not your own witness
    var s=mind.sightings, last=null;
    for(var i=s.length-1;i>=0;i--) if(s[i].subject===subjectId){ last=s[i]; break; }
    mind.fam[subjectId]=(mind.fam[subjectId]||0)+((!last||turn-last.turn>=5)?1:0);
    if(last && turn-last.turn<=REFRESH_WINDOW){ last.turn=turn; last.x=x; last.y=y; return; }
    s.push({subject:subjectId, turn:turn, x:x, y:y});
    if(s.length>mind.cap) s.shift();                 // ring: oldest memory falls out
  }
  function halflife(mind, subjectId){
    var f=mind.fam[subjectId]||0;
    return BASE_HALFLIFE*(1+Math.log(1+f)/Math.LN2); // familiarity slows the fog
  }
  function clarity(mind, sight, now){
    var age=Math.max(0, now-sight.turn);
    return Math.pow(0.5, age/halflife(mind, sight.subject));
  }
  function recall(mind, subjectId, now){
    var best=null;
    for(var i=mind.sightings.length-1;i>=0;i--){ var s=mind.sightings[i];
      if(s.subject!==subjectId) continue;
      var c=clarity(mind,s,now);
      if(c<MIN_CLARITY) continue;
      if(!best||s.turn>best.turn) best={subject:s.subject,turn:s.turn,x:s.x,y:s.y,clarity:+c.toFixed(3)};
    }
    return best;
  }
  // THE ORGAN QUERY: across a settlement's minds, who saw the subject last,
  // and how clearly. This is "when did anyone last see H3-2".
  function lastSeenAcross(minds, subjectId, now){
    var best=null;
    (minds||[]).forEach(function(m){
      var r=recall(m, subjectId, now);
      if(r && (!best || r.turn>best.r.turn || (r.turn===best.r.turn && r.clarity>best.r.clarity)))
        best={witness:m.owner, r:r};
    });
    return best;   // {witness, r:{turn,x,y,clarity}} or null: nobody remembers
  }

  // ---- SIM ATTACHMENT -------------------------------------------------------
  // Give every agent in an online sim a mind, and record co-visibility each
  // world-turn: out-agents see out-agents (and the player) within RADIUS.
  // Block scale keeps this trivially cheap (n out-bodies is small).
  var RADIUS=8;
  function attach(sim, opts){
    opts=opts||{};
    var R=opts.radius||RADIUS;
    sim.agents.forEach(function(a){ if(!a.mind) a.mind=makeMind(a.id, opts.cap); });
    var step0=sim.step;
    sim.step=function(){
      var out=step0.apply(sim, arguments);
      var vis=sim.outAgents();
      for(var i=0;i<vis.length;i++){
        for(var k=0;k<vis.length;k++){
          if(i===k) continue;
          var a=vis[i], b=vis[k];
          if(Math.abs(a.loc.x-b.loc.x)+Math.abs(a.loc.y-b.loc.y)<=R)
            see(a.mind, sim.turn, b.id, b.loc.x, b.loc.y);
        }
        if(sim.playerAt){ var p=sim.playerAt, a2=vis[i];
          if(Math.abs(a2.loc.x-p[0])+Math.abs(a2.loc.y-p[1])<=R)
            see(a2.mind, sim.turn, '@', p[0], p[1]); }
      }
      return out;
    };
    return sim;
  }
  function minds(sim){ return sim.agents.map(function(a){return a.mind;}).filter(Boolean); }

  var API={makeMind:makeMind,see:see,clarity:clarity,halflife:halflife,recall:recall,
    lastSeenAcross:lastSeenAcross,attach:attach,minds:minds,
    BASE_HALFLIFE:BASE_HALFLIFE,REFRESH_WINDOW:REFRESH_WINDOW,MIN_CLARITY:MIN_CLARITY,RADIUS:RADIUS};
  if(HASREQ) module.exports=API;
  root.BohemiaMemory=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
