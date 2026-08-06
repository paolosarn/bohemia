// BOHEMIA STANDING — reputation that has to TRAVEL (8/2/26, PEOPLE lane)
//
// Paolo thumbed all twelve faction gaps WANT on 8/2. This is gap 3, and it was the
// one the research called the documented failure of the entire genre: in most games
// every NPC instantly knows what you did, anywhere, with no route the news could
// possibly have taken. The researched fix, from the 2024 FDG faction-systems paper
// and the NPC belief-formation literature, is that reputation should spread from
// WITNESSES - people remember what they personally saw, tell each other, form their
// own subjective opinion, and the story distorts as it goes.
//
// WE ALREADY HAD THE HARD HALF. bohemia_memory.js is a real witness organ: minds
// hold sightings, familiarity slows forgetting, clarity decays as 0.5^(age/halflife),
// and it is deterministic. What it had no concept of was a DEED, an OPINION, or one
// person TELLING ANOTHER. That is all this module adds.
//
// ===== THE FOUR RULES, AND WHAT EACH ONE BUYS =====
//
// 1. A DEED IS WITNESSED, NEVER ANNOUNCED. witness() only records for minds that
//    were actually near enough to see. Nobody across the valley learns anything.
//
// 2. AN OPINION IS DERIVED, NEVER STORED. opinionOf() re-computes from the deeds a
//    mind still remembers, each weighted by its CLARITY RIGHT NOW. There is no score
//    to save, so there is nothing to migrate and nothing to desync.
//    *** THIS IS ALSO THE REDEMPTION PATH, FOR FREE. *** The most-cited flaw in New
//    Vegas's reputation is that it can never be removed, only buried under a bigger
//    opposite number - there is no honest road back from hated. Here memories FADE,
//    so time alone softens what you did, and being seen doing better in front of
//    enough people is the fast way. Gap 4 falls out of gap 3's mechanism.
//
// 3. HEARSAY IS WEAKER THAN EYESIGHT AND IT RUNS OUT. gossip() moves a deed between
//    two people who are actually together, at a penalty per retelling, with a hop
//    limit. So news genuinely travels - a street at a time - and a thing everyone
//    half-heard is worth less than a thing one person watched.
//
// 4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS. standingOf() averages the opinions of
//    the people who actually belong to it. There is no faction ledger anywhere,
//    which is the whole point: BUILD THE WORLD (7/31) turned "a standing ledger"
//    off, and this is not one. Nothing is stored, nothing is authored, and a
//    faction's disposition is an emergent reading of what its people saw.
//    Zero-sum (gap 7) falls out too: a deed the Cartel watched moves the Cartel and
//    nobody else, because nobody else was standing there.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, kept to the letter:
//   DEED_WEIGHT SHIPS EMPTY. What counts as a deed and what it is worth to whom is
//   his ruling and it has not been made. With an empty table every opinion is
//   exactly 0 and every standing is NEUTRAL - the module is inert until he rules,
//   and the gate asserts that. The MECHANISM (witnessing, decay, gossip, hops,
//   aggregation) is mine. No faction is named anywhere in this file.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');
  var MEM = HASREQ ? require('./bohemia_memory.js')
                   : (root.BohemiaMemory||null);

  // ---- CONTENTS-PAOLO'S: EMPTY ---------------------------------------------
  // deedKind -> weight. Positive is a good turn, negative is a wrong done.
  // NOTHING IS IN HERE and nothing in this file invents a row. Until he rules,
  // opinionOf() returns 0 for everybody and standingOf() returns NEUTRAL.
  var DEED_WEIGHT={};

  // ---- MECHANISM, and every constant is argued ------------------------------
  var SEE_RANGE=9;        // tiles. You have to be able to SEE it to have seen it.
                          // 9 is the block-scale sightline the agent sim already
                          // uses for "somebody is near you", not a new number.
  var HEARSAY_LOSS=0.55;  // a retold deed keeps 55% of its force. Two hops and it is
                          // a third as convincing as watching it, which is about the
                          // right shape for "I heard that..." versus "I was there".
  var MAX_HOPS=2;         // eyewitness -> told -> told. After that it stops, and that
                          // is what makes news travel at the speed of PEOPLE instead
                          // of teleporting. Without a hop cap a rumour reaches the
                          // whole valley in one sim day and we are back where we
                          // started.
  var GOSSIP_WINDOW=45;   // minutes two people must be co-located to talk at all
  var MIN_FORCE=0.02;     // below this a memory is not worth carrying

  function makeLedgerFreeMind(mind){
    // a mind gains ONE array. No score, no totals, no per-faction anything.
    if(!mind.deeds) mind.deeds=[];
    return mind;
  }

  /* ---- 1. A DEED IS WITNESSED ---------------------------------------------
     Records into every mind that could actually see it. Returns how many people
     saw, which is the honest answer to "did anybody notice?" */
  function witness(minds, turn, actorId, deedKind, x, y, where){
    var n=0;
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m || m.owner===actorId) continue;          // you do not witness yourself
      var p=where && where(m.owner);
      if(!p) continue;
      if(Math.abs(p.x-x)+Math.abs(p.y-y) > SEE_RANGE) continue;
      makeLedgerFreeMind(m);
      m.deeds.push({actor:actorId, kind:deedKind, turn:turn, x:x, y:y, hops:0});
      if(m.deeds.length>(m.cap||64)) m.deeds.shift();
      n++;
    }
    return n;
  }

  /* ---- 2. AN OPINION IS DERIVED -------------------------------------------
     Re-computed every time from what is still remembered. Weight x clarity-now x
     hearsay-loss. Nothing stored means nothing to migrate and nothing to desync. */
  function forceOf(mind, d, now){
    var w=DEED_WEIGHT[d.kind];
    if(w==null) return 0;                            // unruled deed = weightless
    var c=MEM ? MEM.clarity(mind, {subject:d.actor, turn:d.turn}, now) : 1;
    var f=w * c * Math.pow(HEARSAY_LOSS, d.hops||0) * Math.pow(GEN_LOSS, d.inherited||0);
    return Math.abs(f)<MIN_FORCE ? 0 : f;
  }
  function opinionOf(mind, actorId, now){
    if(!mind || !mind.deeds) return 0;
    var t=0;
    for(var i=0;i<mind.deeds.length;i++){
      var d=mind.deeds[i];
      if(d.actor!==actorId) continue;
      t+=forceOf(mind, d, now);
    }
    return t;
  }

  /* ---- 3. HEARSAY IS WEAKER AND IT RUNS OUT -------------------------------
     Two people who are actually together swap what the other has not heard. A
     retold deed costs a hop; past MAX_HOPS it stops dead. */
  function gossip(mindA, mindB, turn){
    if(!mindA||!mindB||mindA===mindB) return 0;
    makeLedgerFreeMind(mindA); makeLedgerFreeMind(mindB);
    var moved=0;
    [[mindA,mindB],[mindB,mindA]].forEach(function(pair){
      var from=pair[0], to=pair[1];
      for(var i=0;i<from.deeds.length;i++){
        var d=from.deeds[i];
        if((d.hops||0)>=MAX_HOPS) continue;          // the story has run its course
        if(d.actor===to.owner) continue;             // nobody gossips to your face
        if(turn-d.turn>GOSSIP_WINDOW*24) continue;   // old news is not news
        var known=false;
        for(var j=0;j<to.deeds.length;j++){
          var e=to.deeds[j];
          if(e.actor===d.actor&&e.kind===d.kind&&e.turn===d.turn){ known=true; break; }
        }
        if(known) continue;
        to.deeds.push({actor:d.actor,kind:d.kind,turn:d.turn,x:d.x,y:d.y,hops:(d.hops||0)+1});
        if(to.deeds.length>(to.cap||64)) to.deeds.shift();
        moved++;
      }
    });
    return moved;
  }

  /* ---- 4. A FACTION'S VIEW IS ITS MEMBERS' VIEWS ---------------------------
     No ledger. The average of what its people actually think, and if none of its
     people have seen you, it has no view of you at all. */
  var RUNGS=[['HOSTILE',-3],['COLD',-1],['NEUTRAL',1],['WARM',3],['FWU',1e9]];
  function rungFor(v){
    for(var i=0;i<RUNGS.length;i++) if(v<RUNGS[i][1]) return RUNGS[i][0];
    return 'FWU';
  }
  function standingOf(minds, faction, actorId, now, factionOfOwner){
    var sum=0, n=0, seen=0;
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m) continue;
      if(factionOfOwner(m.owner)!==faction) continue;
      n++;
      var o=opinionOf(m, actorId, now);
      if(o!==0) seen++;
      sum+=o;
    }
    var avg=n? sum/n : 0;
    return {faction:faction, value:avg, rung:rungFor(avg), members:n, whoSaw:seen};
  }

  /* WHY ANYBODY FEELS THAT WAY, which is gap 10's actual content: a standing the
     player cannot read is a standing they cannot play around. Returns the specific
     remembered deeds driving it, strongest first, and whether each was watched or
     merely heard. */
  function becauseOf(minds, faction, actorId, now, factionOfOwner, limit){
    var out=[];
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m||!m.deeds||factionOfOwner(m.owner)!==faction) continue;
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(d.actor!==actorId) continue;
        var f=forceOf(m, d, now);
        if(!f) continue;
        out.push({who:m.owner, kind:d.kind, turn:d.turn, force:f,
                  heard:(d.hops||0)>0, hops:d.hops||0});
      }
    }
    out.sort(function(a,b){ return Math.abs(b.force)-Math.abs(a.force); });
    return out.slice(0, limit||5);
  }


  /* ---- 5. A REPUTATION OUTLIVES THE PERSON WHO EARNED IT ------------------
     (8/2/26. The thing the twelve-gap list did not have, and the game's own premise.)

     Bohemia is not a game about a hero, it is a FAMILY ACROSS THREE GENERATIONS AND
     A HUNDRED YEARS (story master), and the handoff happens WHEN THE STORY SAYS SO,
     never because somebody died (DEATH IS A RELOAD, 7/26). So there is a moment,
     already canon, when the valley stops judging you and starts judging your child.

     NOBODY HAD ASKED WHAT HAPPENS TO YOUR REPUTATION AT THAT MOMENT. It is the most
     obvious question the dynasty premise raises and it was not on the gap list, not
     in the GDD, not in any backlog.

     GROUNDED, and this is the real anthropology rather than a vibe: in stateless
     societies a family is treated as a CORPORATE ENTITY whose reputation carries its
     economic viability and social standing; lineages run ten and twelve generations
     deep, and ostracism does the work that fines and prisons do elsewhere. You are
     born owing what your father owed. That is not a fantasy mechanic, it is how
     reputation has worked for most of human history and it is exactly the register
     of a valley with no courts.

     *** AND THE ORGAN ALREADY MODELLED IT WITHOUT ANYBODY NOTICING. *** Thirty years
     pass. EVERY PERSON WHO WATCHED YOU DO ANYTHING IS DEAD. The only trace of your
     life is what got REPEATED - the deeds that travelled, hop by hop, into somebody
     who is still alive. So the rule writes itself and it is the honest one:

       A QUIET GOOD DEED DIES WITH THE WITNESS.
       A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.

     That is why gossip had to exist before this could. Nothing here is a new system;
     it is what the witness organ was always going to do if you ran the clock forward.

     THE LIFE LESSON UNDERNEATH, and the game never says it out loud: you inherit
     goodwill you did not earn and debts you did not run up, and neither one is fair. */
  var GEN_LOSS=0.45;      // what crosses a generation. Less than half, so a legend
                          // needs to have been LOUD to survive one, and by the third
                          // generation only the very loudest thing your grandfather
                          // did still registers at all - which is the arc the story
                          // master already describes.
  function inherit(minds, parentId, childId, turn){
    var carried=0, died=0;
    for(var i=0;i<minds.length;i++){
      var m=minds[i]; if(!m||!m.deeds) continue;
      var keep=[];
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(d.actor!==parentId){ keep.push(d); continue; }
        /* the eyewitness is dead. Only what was RETOLD is still in the valley. */
        if(!(d.hops>0)){ died++; continue; }
        keep.push({actor:childId, kind:d.kind, turn:turn, x:d.x, y:d.y,
                   hops:d.hops, inherited:(d.inherited||0)+1, of:parentId});
        carried++;
      }
      m.deeds=keep;
    }
    return {carried:carried, died:died};
  }

  /* WHAT THE VALLEY STILL SAYS ABOUT YOUR FAMILY. Readable, because a legend you
     cannot hear is a legend that is not doing any work. */
  function legendOf(minds, actorId, now){
    var by={};
    for(var i=0;i<minds.length;i++){
      var m=minds[i]; if(!m||!m.deeds) continue;
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(d.actor!==actorId||!d.inherited) continue;
        var f=forceOf(m,d,now);
        if(!f) continue;
        var k=d.kind;
        if(!by[k]) by[k]={kind:k, tellers:0, force:0, generations:d.inherited, of:d.of};
        by[k].tellers++; by[k].force+=f;
        by[k].generations=Math.max(by[k].generations, d.inherited);
      }
    }
    return Object.keys(by).map(function(k){return by[k];})
      .sort(function(a,b){ return Math.abs(b.force)-Math.abs(a.force); });
  }

  var API={ DEED_WEIGHT:DEED_WEIGHT, SEE_RANGE:SEE_RANGE, HEARSAY_LOSS:HEARSAY_LOSS,
    MAX_HOPS:MAX_HOPS, GOSSIP_WINDOW:GOSSIP_WINDOW, RUNGS:RUNGS,
    witness:witness, opinionOf:opinionOf, gossip:gossip, standingOf:standingOf,
    becauseOf:becauseOf, rungFor:rungFor,
    inherit:inherit, legendOf:legendOf, GEN_LOSS:GEN_LOSS };
  if(HASREQ) module.exports=API; else root.BohemiaStanding=API;
})(typeof globalThis!=='undefined'?globalThis:this);
