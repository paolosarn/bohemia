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
  /* HOW LONG A THING IS STILL WORTH TELLING - and this was the SECOND bug the demo
     page found in an hour. GOSSIP_WINDOW was documented as a co-location window and
     then used as a STALENESS window (turn-d.turn > GOSSIP_WINDOW*24), which made news
     untellable after EIGHTEEN HOURS. A day-step is 1440 minutes, so on any normal
     clock gossip could never fire even once - the module's whole third rule was dead
     and every unit test passed, because they all gossiped within minutes of the deed.
     ONE CONSTANT WAS DOING TWO JOBS AND THE SECOND JOB WAS WRONG. Split, and named
     for what it actually is: people retell a striking thing for weeks, not overnight. */
  var NEWS_LIFE=14*24*60; // a fortnight before somebody stops bringing it up unasked
  var MIN_FORCE=0.02;     // below this a memory is not worth carrying

  /* ---- A DEED IS NOT A FACE, AND THIS WAS A REAL BUG ----------------------
     Found the day it shipped, by BUILDING THE VISIBLE VERSION. On screen a serious
     wrong was worth -0.05 after three days and the whole system looked broken.
     The cause: opinions were decaying on bohemia_memory's SIGHTING half-life, which
     is twelve hours - correct for "did you see that guy walk past", absurd for "that
     man burned my neighbour's house down". Reputation that evaporates in two days is
     not reputation.
     GROUNDED, and it is the well-documented asymmetry: routine observations fade on
     the ordinary curve, while SIGNIFICANT events are held far longer and far more
     vividly - the flashbulb effect. You forget a stranger's face by tomorrow. You
     remember what somebody did to your family for years.
     SO A DEED CARRIES ITS OWN CLOCK, and the bigger it was the longer it holds:
     a base of three weeks, multiplied by the size of the thing. Sightings are
     untouched - bohemia_memory still owns those and nothing about missing-persons
     changed.
     THE LESSON, which is why the demo page exists at all: this was invisible in
     every unit test, because a test asserts "it went down" and it HAD gone down. It
     took looking at it to see it had gone down to nothing. */
  var DEED_HALFLIFE=21*24*60;   // three weeks for an ordinary deed
  function deedHalflife(w){
    return DEED_HALFLIFE * (1 + Math.log(1+Math.abs(w||1))/Math.LN2);
  }

  function makeLedgerFreeMind(mind){
    // a mind gains ONE array. No score, no totals, no per-faction anything.
    if(!mind.deeds) mind.deeds=[];
    return mind;
  }

  /* ---- 1. A DEED IS WITNESSED ---------------------------------------------
     Records into every mind that could actually see it. Returns how many people
     saw, which is the honest answer to "did anybody notice?"

     opts (8/6, all OPTIONAL and every default is the old behaviour exactly, so
     nothing that already called this changes):
       range    how far THIS deed carries. A back-yard handshake and a public
                humiliation are not seen by the same number of people, and until
                bohemia_deeds.js existed nothing in the game could say so.
                Defaults to SEE_RANGE.
       maxHops  how many retellings THIS deed earns, carried ON the deed so
                gossip() can honour it. This is what finally makes the module's
                own generational law true instead of decorative: inherit() only
                carries a deed with hops>0, so a deed that never earned a
                retelling really does die with the people who watched it.
                Defaults to MAX_HOPS.
       only     a predicate on the witness's owner id. One act can mean opposite
                things to two factions and nothing at all to a third; this is how
                the third one correctly remembers nothing. Defaults to everybody. */
  function witness(minds, turn, actorId, deedKind, x, y, where, opts){
    opts = opts || {};
    var range = (opts.range==null) ? SEE_RANGE : opts.range;
    var mh    = opts.maxHops;
    var only  = opts.only;
    var n=0;
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m || m.owner===actorId) continue;          // you do not witness yourself
      if(only && !only(m.owner)) continue;           // it did not mean anything to them
      var p=where && where(m.owner);
      if(!p) continue;
      if(Math.abs(p.x-x)+Math.abs(p.y-y) > range) continue;
      makeLedgerFreeMind(m);
      /* seed: THE STORY'S OWN NAME, stamped where the story starts, so every
         eyewitness of one event agrees it is one event and so a retelling that
         changes the actor or the act can still be recognised as the same story
         coming back. See seedOf/retell (9/22, [rumours travel]). */
      var d={actor:actorId, kind:deedKind, turn:turn, x:x, y:y, hops:0,
             seed:String(actorId)+'|'+String(deedKind)+'|'+(turn|0)};
      if(mh!=null) d.maxHops=mh;
      m.deeds.push(d);
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
    /* *** AND A THING THAT HAS BEEN MADE RIGHT STOPS COUNTING. *** (9/6, VAMILY
       [make it right], row NOTHING-IN-THIS-GAME-CAN-BE-FORGIVEN.)
       MEASURED BEFORE BUILDING: forgive, forgiven, settle, settled, absolve,
       pardon, spare and redeem appeared ZERO times in this module and in
       bohemia_deeds.js. Every function here got a deed INTO the world -- witness,
       gossip, inherit, legendOf -- and NOTHING resolved one. A deed was written,
       it travelled, it faded, and it was never settled, so standing was a
       one-way ratchet toward being hated.
       THE RECORD IS KEPT ON PURPOSE. Forgiveness is not amnesia: the whole
       literature treats it as a drop in negative motivation toward the offender,
       never as forgetting, and becauseOf must still be able to say the thing
       happened. So the deed stays in the mind and stops carrying weight.
       [PENDING Paolo] whether a forgiven thing should still sting a little
       rather than going clean to nothing. That is a magnitude and magnitudes are
       his; the mechanism does not need one to be true. */
    if(d.right) return 0;
    /* *** AND A MEMORY OF SOMEBODY WHO IS GONE IS NOT A CHARGE AGAINST WHOEVER
       *** CAME NEXT (9/23, [creditor stands]). A living witness keeps an untold
       deed across the fold, stamped `ended`. It stays readable as history and it
       weighs NOTHING, so the child's standing is exactly what it was before this
       existed and the dynasty rule -- a quiet deed never becomes the thing your
       child is judged for -- is untouched. */
    if(d.ended) return 0;
    /* the deed's own clock, not the sighting clock (see DEED_HALFLIFE above) */
    var age=Math.max(0, (now|0)-(d.turn|0));
    var c=Math.pow(0.5, age/deedHalflife(w));
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

  /* ==== 3a. A STORY CHANGES IN THE TELLING ==================================
     9/22/26, PEOPLE lane, VAMILY [rumours travel], row
     A-RUMOUR-ABOUT-SOMEBODY-WHO-IS-NOT-YOU.

     *** MEASURED ON THE ALPHA BEFORE A LINE WAS WRITTEN: gossip() COPIED A DEED
     *** AND CHANGED NOTHING.
     One mind witnessed a third party, gossip moved it, and a field by field diff
     of the copy against the original came back `changed: []`. The only thing a
     retelling ever cost was BELIEF, through HEARSAY_LOSS. So the city could carry
     a story right across the valley and it arrived PERFECT, and the reaction line
     this repo already ships -- "I heard a version of it. Probably the wrong
     version." -- had never once been true. There was no wrong version.

     THE REAL THING, and it is one of the most replicated results there is.
     Bartlett's serial reproduction (Remembering, 1932) and Allport & Postman's
     rumour work (The Psychology of Rumor, 1947) get the same three changes every
     time a story is passed along a chain of people:

       LEVELLING     detail falls out, and it goes fast: most of the loss happens
                     in the first two or three retellings. WHERE and WHEN go
                     before WHAT, because the shape of the event is what people
                     hold on to.
       SHARPENING    the handful of details that survive get LOUDER. A rumour
                     does not drift toward the boring version, because the boring
                     version is not the one anybody bothers to repeat.
       ASSIMILATION  the story bends toward what the teller already carries. This
                     is the famous one: in Allport & Postman the razor moves out
                     of the hand that held it and into the hand the teller
                     expected to find it in.

     AND A FOURTH ONE THAT IS NOT BARTLETT AND MATTERS HERE: the source goes
     before the claim does (Hovland's sleeper effect, 1949). People keep the story
     and lose where they got it, which is why news from somebody you do not trust
     still ends up believed. `from` already rides on every retelling since 9/5;
     what LEVELLING takes here is the place and the hour, never the fact that
     somebody said it.

     *** THE SAME RETELLING ALWAYS COMES OUT THE SAME WAY. *** The roll is hashed
     off the story and the teller, not off Math.random. A rumour is not a slot
     machine: if you walk away and come back, the version this person carries is
     the version they had, and a gate can put the same story through the same
     mouth twice and get one answer. */

  /* WHICH WAY A STORY GROWS. draft:true, and it is a CONTENT table in the sense
     the law means: which act is the bigger one is a judgement about what this
     game thinks is serious, so these rows are attempts he overturns with a word.
     What is NOT a judgement, and is the mechanism: a rumour climbs and never
     descends. Nobody repeats the smaller version of something. */
  var LOUDER={
    'favour':          'commit',            /* draft: a hand became a side taken */
    'claim:met':       'commit',            /* draft */
    'spared':          'pushed_the_price',  /* draft: you let him go became you squeezed him */
    'claim:refused':   'pushed_the_price',  /* draft */
    'loan:short':      'pushed_the_price',  /* draft */
    'pushed_the_price':'downed'             /* draft: and then it became a beating */
    /* 'commit' and 'downed' are the top of their own side and do not climb. */
  };

  /* HOW OFTEN EACH ONE HAPPENS PER HOP. draft:true. These are RATES, not worths:
     nothing here says what a deed is WORTH, which is DEED_WEIGHT and is his.
     Allport & Postman measured roughly 70% of detail gone across five or six
     retellings with most of it in the first few; at MAX_HOPS 2 that shape puts a
     detail's odds of surviving one hop a little over half, which is where these
     sit. He turns them in VOTE. */
  var DRIFT={ draft:true,
    where: 0.50,   /* draft: the place slides */
    when:  0.35,   /* draft: the hour goes vague */
    louder:0.25,   /* draft: the bigger version gets told */
    blame: 0.20 }; /* draft: it lands on somebody else */

  /* HOW FAR A PLACE SLIDES WHEN IT SLIDES: tiles. SEE_RANGE, because a retold
     place is not a missing place, it is a place near something the teller knows,
     and one sightline out is the smallest move that makes the answer wrong. */
  var PLACE_SLIP=SEE_RANGE;

  /* A ROLL THAT IS THE SAME EVERY TIME IT IS ASKED. FNV-1a, 32 bit, over the
     story's own identity plus who is telling it plus which of the four this is,
     so the four rolls of one retelling are independent and none of them move
     when the rest of the world does. */
  function drdRoll(s){
    var h=2166136261;
    for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*16777619)>>>0; }
    return (h>>>8)/16777216;
  }
  /* THE STORY'S OWN NAME, WHICH SURVIVES EVERYTHING THAT HAPPENS TO IT.
     Without this, distortion breaks the "have I heard this" test: the dedup below
     compared actor+kind+turn, so a story that drifted came back around as NEWS and
     two neighbours could trade one event forever, each copy a little wronger, until
     the ledger was nothing else. YOU RECOGNISE THE STORY, NOT THE TIMESTAMP. */
  function seedOf(d){
    return d.seed || (String(d.actor)+'|'+String(d.kind)+'|'+(d.turn|0));
  }

  /* WHO ELSE THE TELLER COULD PUT IT ON. Assimilation needs somewhere for the
     story to bend TOWARD, and the honest answer with DEED_WEIGHT still empty is
     NOT "whoever they hate" -- opinionOf returns 0 for everybody until he rules,
     so a hate-ranking here would be a number I invented. It is WHO IS ALREADY IN
     THEIR HEAD. That is the Allport and Postman mechanism said plainly, and it
     needs no ruling at all: the story assimilates to the teller's existing frame,
     and their frame is the faces they know.

     *** AND "THEIR FRAME" IS THEIR SIGHTINGS, NOT THEIR DEED LEDGER, WHICH THIS
     *** COST A CUT TO LEARN. *** The first version read the ledger. Measured on
     the alpha, over a day of city time on his own block:

         minds holding no actor at all      37
         minds holding exactly one          20
         minds holding two                   4
         stories that changed hands          0

     A mind holding exactly one actor has an EMPTY pool the moment you exclude the
     real one, so the single most important effect in the row -- the razor changing
     hands -- could never fire, and the claim about it could never have failed.
     A SIGHTING LIST IS ALWAYS FULL, because everybody who walks past you is in it,
     and it is also the truer reading: a story bends toward A FAMILIAR FACE, not
     toward somebody you happen to have a story about.

     MOST FAMILIAR FIRST, because that is what "who came to mind" means, and `fam`
     is the counter bohemia_memory already keeps for exactly that. Never the
     listener (you do not tell a man he did it himself), never the real actor,
     and never a stranger: a teller with an empty head does not invent one. */
  function blameTargets(from, realActor, listener){
    var out=[], seen={}, i, a;
    var sight=from.sightings||[], fam=from.fam||{}, deeds=from.deeds||[];
    for(i=0;i<sight.length;i++){
      a=sight[i].subject;
      if(a==null||a===realActor||a===listener||a===from.owner) continue;
      if(seen[a]) continue; seen[a]=1; out.push(a);
    }
    for(i=0;i<deeds.length;i++){               /* and anyone they have a story about */
      a=from.deeds[i].actor;
      if(a==null||a===realActor||a===listener||a===from.owner) continue;
      if(seen[a]) continue; seen[a]=1; out.push(a);
    }
    /* the same head gives the same order: familiarity, then the name itself */
    out.sort(function(p,q){
      var d=(fam[q]||0)-(fam[p]||0);
      return d || (String(p)<String(q) ? -1 : String(p)>String(q) ? 1 : 0);
    });
    return out;
  }

  /* THE RETELLING. Takes the deed as the teller holds it and returns the deed as
     the listener will hold it. Everything that changed is written down on the
     copy -- `vague`, `truly`, `grew` -- because a surface that cannot say WHICH
     part is wrong can only say "probably the wrong version" and mean nothing. */
  function retell(d, from, to, turn){
    var r={actor:d.actor, kind:d.kind, turn:d.turn, x:d.x, y:d.y,
           hops:(d.hops||0)+1, from:from.owner, seed:seedOf(d)};
    if(d.maxHops!=null) r.maxHops=d.maxHops;
    if(d.inherited) r.inherited=d.inherited;
    if(d.of) r.of=d.of;
    if(d.right) r.right=d.right;
    if(d.truly) r.truly=d.truly;
    if(d.vague) r.vague={where:d.vague.where, when:d.vague.when};
    if(d.grew) r.grew=d.grew;
    var tag=r.seed+'|'+String(from.owner)+'|'+String(to.owner)+'|'+r.hops;

    /* LEVELLING: the place slides, and it slides SOMEWHERE, because a teller who
       does not know where it happened still names a place. */
    if(drdRoll(tag+'|where') < DRIFT.where){
      var a1=drdRoll(tag+'|wx'), a2=drdRoll(tag+'|wy');
      if(r.x!=null) r.x=(r.x|0)+Math.round((a1*2-1)*PLACE_SLIP);
      if(r.y!=null) r.y=(r.y|0)+Math.round((a2*2-1)*PLACE_SLIP);
      r.vague=r.vague||{}; r.vague.where=1;
    }
    /* LEVELLING: the hour goes vague. The TURN IS NOT MOVED -- it is the deed's
       own clock and the decay curve reads it, so shifting it would quietly make
       an old wrong feel fresh. What goes is the CLAIM to know when. */
    if(drdRoll(tag+'|when') < DRIFT.when){ r.vague=r.vague||{}; r.vague.when=1; }

    /* SHARPENING: the bigger version is the one that gets repeated. */
    var up=LOUDER[r.kind];
    if(up && drdRoll(tag+'|loud') < DRIFT.louder){
      r.grew=(r.grew||[]).concat([r.kind]);
      r.kind=up;
    }
    /* ASSIMILATION: it lands on somebody the teller already carries. `truly` keeps
       the person it was really about, ONCE -- a story that has already been moved
       onto the wrong man does not remember a second wrong man, it remembers the
       right one. */
    if(drdRoll(tag+'|who') < DRIFT.blame){
      var pool=blameTargets(from, r.actor, to.owner);
      if(pool.length){
        /* THE FRONT OF THE LIST, MOSTLY. A uniform pick over a familiarity-sorted
           list throws the sort away; squaring the roll puts most of the weight on
           the faces that actually come to mind, which is the whole reason the
           list is in that order. */
        var rr=drdRoll(tag+'|pick');
        var pick=pool[Math.floor(rr*rr*pool.length)%pool.length];
        if(!r.truly) r.truly=r.actor;
        r.actor=pick;
      }
    }
    return r;
  }
  /* IS THIS DEED STILL THE TRUTH. One question, asked in one place, so a mouth
     and a gate cannot have two ideas of what "wrong" means. */
  function isWrong(d){
    return !!(d && (d.truly || (d.grew && d.grew.length) ||
                    (d.vague && (d.vague.where || d.vague.when))));
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
        /* the story has run its course. A deed may carry its OWN budget (set by
           bohemia_deeds.js from the quest's clout tag) — a thing people cannot
           stop repeating outlives a thing mentioned once. MAX_HOPS when it doesn't. */
        if((d.hops||0)>=(d.maxHops==null?MAX_HOPS:d.maxHops)) continue;
        if(d.actor===to.owner) continue;             // nobody gossips to your face
        if(turn-d.turn>NEWS_LIFE) continue;          // nobody volunteers ancient news
        /* *** RECOGNISED BY THE STORY, NOT BY THE TIMESTAMP (9/22). *** The old
           test was actor+kind+turn, and the moment a retelling could change the
           actor or the kind, a story that drifted came back around as fresh news
           and one event could bounce between two neighbours forever. seedOf() is
           the name the story keeps no matter what happens to it. */
        var sd=seedOf(d), known=false;
        for(var j=0;j<to.deeds.length;j++){
          var e=to.deeds[j];
          if(seedOf(e)===sd){ known=true; break; }
        }
        if(known) continue;
        /* *** AND WHO TOLD THEM TRAVELS WITH IT (9/5, BB-STANDING-PLAYER). ***
           This web has always recorded HOW FAR a story went -- hops -- and never
           WHO CARRIED IT. So the game could count your reputation and could not
           answer the only question the row says matters: "who will vouch for me
           now." A number is a bar; a name and the person who vouched for you to
           them is a WEB. One field.
           AND SINCE 9/22 THE COPY IS NOT A COPY: retell() above is where the
           place slides, the hour goes vague, the act grows and the blame moves. */
        var r=retell(d, from, to, turn);
        /* and a shifted blame must not land on the listener's own face, which the
           candidate list already refuses; this is the belt on it. */
        if(r.actor===to.owner) continue;
        to.deeds.push(r);
        if(to.deeds.length>(to.cap||64)) to.deeds.shift();
        moved++;
      }
    });
    return moved;
  }

  /* ==== MAKING IT RIGHT (9/6/26, PEOPLE lane) ==============================
     VAMILY [make it right], row NOTHING-IN-THIS-GAME-CAN-BE-FORGIVEN.

     "A deed is written, it travels, it fades, and it is never settled. So a
     player who wronged somebody in hour two can never make it right, and
     standing is a one-way ratchet toward being hated -- and generation three is
     the ANGEL, who cannot forgive anything."

     *** THE PERSON WHO WAS WRONGED IS THE ONE WHO DECIDES, and that is not a
     nicety, it is the whole reason this is not a cheat. *** This takes ONE MIND.
     There is deliberately no valley-wide absolution and no way for the actor to
     clear their own name: you can only be forgiven by somebody who is actually
     carrying the thing.

     ONLY A THING HELD AGAINST YOU CAN BE MADE RIGHT. Nobody forgives you for a
     kindness, and letting them would turn this into an eraser for good standing
     as well as bad. So a deed whose force is positive is refused.

     FOUR WORDS, ONE MECHANISM. The row names settled, paid off, forgiven and
     spared. Those are four STORIES for the same event -- whether they got
     something, whether they simply let it go, whether you had them and did not.
     The word is recorded so a surface can say which one it was and so he can
     rule them apart later; the mechanism does not pretend to know the
     difference. draft:true. */
  var RIGHT_WORDS = {
    settled:  'SQUARED WITH THEM',      /* draft:true */
    paid:     'PAID THEM BACK',         /* draft:true */
    forgiven: 'THEY LET IT GO',         /* draft:true */
    spared:   'YOU HAD THEM AND DID NOT'/* draft:true */
  };

  /* ==========================================================================
     WHAT IT COSTS TO MAKE IT RIGHT, IN BATTERIES. (9/11, [paid means paid].)
     ECONOMY round 26 read this module the round after it shipped and found the
     hole: RIGHT_WORDS says 'PAID THEM BACK', the one live caller passed exactly
     that word, and makeRight had no purse, no currency and no amount. The card
     said paid and nothing was ever paid.
     THE COORDINATOR RULED IT 9/7: restitution is paid in batteries to the person
     wronged, WEIGHT FOR WEIGHT -- a wrong that weighs three costs three -- under
     EVERYTHING COSTS ONE.
     SO THE PRICE IS NOT A NEW NUMBER. It is the grudge itself: the same sum
     wouldSquare already adds up, which is the same sum forceOf already weighs,
     which is his STANDING dial and nothing else. A heavier wrong costs more
     because it IS more, and if he never rules the deed table it costs nothing --
     which is the honest answer, not a hidden default. */
  function priceOf(mind, actorId, now){
    var w = wouldSquare(mind, actorId, now);
    /* ROUNDED UP, because EVERYTHING COSTS ONE means a wrong you can feel cannot
       cost zero, and a fraction of a battery is not a thing anybody can hand
       over. A grudge of 0.2 costs one battery. */
    return Math.ceil(-w.grudge) || 0;
  }

  /* makeRight(mind, actorId, opts) -> {settled, deeds, how, paid}
       mind     the person doing the forgiving. THEIRS is the only opinion this
                changes, because theirs is the only one it is.
       actorId  who is being forgiven.
       opts.how one of RIGHT_WORDS. Defaults to 'settled'.
       opts.kind settle only this deed kind; default every held grudge.
       opts.turn when, so a surface can say how long ago it was squared.
       opts.paid how many batteries actually changed hands. Zero or absent is a
                legal, ordinary case: it means words alone.

     *** AND THE WORD 'paid' IS REFUSED UNLESS SOMETHING WAS ACTUALLY PAID. ***
     That is the whole of this row. A surface can still settle a wrong with
     nothing but an apology -- the coordinator's ruling says so explicitly, "if
     the purse cannot cover it the apology is still offered and the wronged
     person decides whether words alone will do" -- but then the record says
     THEY LET IT GO, which is what happened, instead of PAID THEM BACK, which is
     not. The caller cannot lie to the ledger even by accident. */
  function makeRight(mind, actorId, opts){
    opts = opts || {};
    var how = RIGHT_WORDS[opts.how] ? opts.how : 'settled';
    var paid = Math.max(0, (opts.paid|0));
    if(how === 'paid' && !paid) how = 'forgiven';
    var now = (opts.turn==null) ? 0 : (opts.turn|0);
    var out = {settled:0, deeds:[], how:how, paid:paid};
    if(!mind || !mind.deeds || actorId==null) return out;
    for(var i=0;i<mind.deeds.length;i++){
      var d=mind.deeds[i];
      if(d.actor!==actorId) continue;
      if(d.right) continue;                       /* already squared */
      if(opts.kind && d.kind!==opts.kind) continue;
      /* THE FORCE IS READ BEFORE THE MARK GOES ON, because forceOf returns 0
         for anything already righted and this has to know what it is holding.
         A weightless deed is not a grudge and there is nothing to forgive. */
      var f = forceOf(mind, d, now);
      if(!(f<0)) continue;                        /* only a thing held AGAINST you */
      d.right = {how:how, turn:now, paid:paid};
      out.settled++; out.deeds.push(d.kind);
    }
    return out;
  }
  /* WHAT THIS PERSON HAS SQUARED WITH YOU, for a surface that wants to say so.
     The record survives on purpose -- forgiven is not forgotten -- so this can
     always answer, however long ago it was. */
  function madeRightBy(mind, actorId){
    var out=[];
    if(!mind || !mind.deeds) return out;
    for(var i=0;i<mind.deeds.length;i++){
      var d=mind.deeds[i];
      if(d.actor===actorId && d.right)
        out.push({kind:d.kind, how:d.right.how, turn:d.right.turn,
                  say:RIGHT_WORDS[d.right.how], sawIt:!(d.hops>0), draft:true});
    }
    return out;
  }
  /* ---- WOULD THEY? AND THE ANSWER IS NOT A DIAL ---------------------------
     A button that always works is not somebody deciding, it is an eraser. But
     "how forgiving is this person" would be a tuned number, and numbers are his.

     SO IT IS ASKED OF WHAT THEY ACTUALLY SAW. Would they square the old thing?
     Only if everything ELSE they know about you already comes out positive --
     that is, if you have since given them a reason. Nothing new is invented:
     it is this web's own arithmetic with the grudge taken out of the sum.

     AND IT MAKES THE RIGHT LOOP. "Make it right" stops being a button and
     becomes the literal instruction: go and do something for the person you
     wronged, in front of them, and then ask. Somebody whose only knowledge of
     you is the bad thing will not forgive you, which is both true and the
     harder, better version.

     GROUNDED, NOT GUESSED: the forgiveness literature's most consistent finding
     is that amends and apology raise forgiveness while severity lowers it. Both
     fall out of this sum already -- a heavier grudge needs more good to outweigh
     it -- without a threshold anybody had to pick.

     Returns the working, so a card can say WHY not rather than greying out. */
  function wouldSquare(mind, actorId, now){
    var out={would:false, grudge:0, rest:0, kinds:[]};
    if(!mind || !mind.deeds || actorId==null) return out;
    for(var i=0;i<mind.deeds.length;i++){
      var d=mind.deeds[i];
      if(d.actor!==actorId) continue;
      var f=forceOf(mind, d, now);
      if(d.right) continue;                       /* already squared: not in either sum */
      if(f<0){ out.grudge+=f; out.kinds.push(d.kind); }
      else out.rest+=f;
    }
    /* NOTHING HELD AGAINST YOU IS NOT THE SAME AS FORGIVEN, and the card must
       not offer to fix a thing that is not broken. */
    if(!out.kinds.length) return out;
    out.would = out.rest > 0 && (out.rest + out.grudge) >= 0;
    return out;
  }

  /* ---- AND THE WEB LEARNS IT HAPPENED -------------------------------------
     "the web learns it happened" is the row's own line, and the shape of it is
     the row's own rule applied precisely: THE PERSON WHO WAS WRONGED DECIDES.

     So a mind that only HEARD the story (hops>0) drops it when the eyewitness
     squares it -- their whole grip on it was second hand, and "she's squared it
     with him" really is how a retold grudge dies. A mind that SAW IT THEMSELVES
     is NOT settled by somebody else's decision, because it was not somebody
     else's to make. That asymmetry is the feature.

     Called with the same pair gossip is called with, so the news of a settlement
     travels on exactly the paths the grudge travelled on. */
  function carryRight(mindA, mindB){
    if(!mindA||!mindB||mindA===mindB) return 0;
    makeLedgerFreeMind(mindA); makeLedgerFreeMind(mindB);
    var moved=0;
    [[mindA,mindB],[mindB,mindA]].forEach(function(pair){
      var from=pair[0], to=pair[1];
      for(var i=0;i<from.deeds.length;i++){
        var d=from.deeds[i];
        if(!d.right) continue;
        if(d.hops>0) continue;                    /* only the eyewitness's word carries */
        for(var j=0;j<to.deeds.length;j++){
          var e=to.deeds[j];
          if(e.actor!==d.actor||e.kind!==d.kind||e.turn!==d.turn) continue;
          if(e.right) continue;
          if(!(e.hops>0)) continue;               /* they saw it too: theirs to decide */
          e.right = {how:d.right.how, turn:d.right.turn, heard:true};
          moved++;
        }
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


  /* ---- WHO WILL VOUCH FOR YOU (9/5/26, BB-STANDING-PLAYER) ----------------
     THE ROW'S OWN SHAPE, IN ITS OWN WORDS: "it is A WEB, NOT A BAR. A job comes
     from a PERSON, and that person heard about you from someone. The question a
     favour answers is not 'did my bar go up' but 'who will vouch for me now.'"

     Everything this needs already existed -- witness, gossip, opinionOf, hops,
     the rung ladder -- except the one field above, so this ADDS NO SECOND
     OPINION MECHANISM. It asks the same minds the same question and returns
     PEOPLE instead of a number: who is warm on you, the single deed that did it,
     whether they saw it themselves, and who told them if they did not.

     IT CANNOT INVENT A STANDING HE NEVER RULED. Every force runs through
     forceOf, which returns 0 for a deed with no weight, and DEED_WEIGHT ships
     EMPTY. So on today's build this correctly returns NOBODY, and the surface
     says so out loud rather than drawing a neutral bar. */
  function whoVouches(minds, actorId, now, opts){
    opts=opts||{};
    var min=(opts.min==null?0:opts.min), out=[];
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m||!m.deeds||m.owner===actorId) continue;
      var v=opinionOf(m, actorId, now);
      if(v<=min) continue;
      var best=null, bf=0;
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(d.actor!==actorId) continue;
        var fo=forceOf(m,d,now);
        if(fo>bf){ bf=fo; best=d; }
      }
      if(!best) continue;
      out.push({ who:m.owner, value:v, rung:rungFor(v), kind:best.kind,
                 turn:best.turn, hops:best.hops||0,
                 sawIt:!(best.hops>0),
                 from:(best.from==null?null:best.from) });
    }
    out.sort(function(a,b){ return b.value-a.value; });
    return opts.limit? out.slice(0,opts.limit) : out;
  }

  /* AND THE OTHER HALF, BECAUSE A WEB HAS TWO SIDES AND SHOWING ONE IS A BAR. */
  function whoWont(minds, actorId, now, opts){
    opts=opts||{};
    var max=(opts.max==null?0:opts.max), out=[];
    for(var i=0;i<minds.length;i++){
      var m=minds[i];
      if(!m||!m.deeds||m.owner===actorId) continue;
      var v=opinionOf(m, actorId, now);
      if(v>=max) continue;
      out.push({ who:m.owner, value:v, rung:rungFor(v) });
    }
    out.sort(function(a,b){ return a.value-b.value; });
    return opts.limit? out.slice(0,opts.limit) : out;
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
  /* *** AND WHETHER THE WITNESS IS DEAD IS NOT THIS FUNCTION'S TO ASSUME.
     *** (9/23, PEOPLE [creditor stands], row YOU-DO-NOT-INHERIT-A-BILL-YOU-
     *** INHERIT-THE-PERSON.)

     The rule below drops an untold deed because "the eyewitness is dead", and the
     gate that pins it says the premise out loud: "Thirty years pass and everybody
     who watched you is dead." That is a coherent reading and the DYNASTY half of
     it is right: a thing one person saw and never mentioned must not become the
     child's reputation. What is not right is deciding, for everybody, that they
     are gone.

     MEASURED, AND THE REPO ITSELF ALREADY REFUSED THIS CALL. bohemia_family.js,
     on its parked bury() writer: "WHEN a person dies of age is a magnitude, so it
     waits on Paolo." Nothing in this game ages anybody out. So the organ asserted
     that everybody who watched is dead, while the surface kept drawing them: on
     the alpha, the only witness of a short night was the neighbour at his own
     door, and the fold said "1 of the things you did died with the last person
     who saw them" about a man who is still standing there and still speaks.

     AND THE REAL WORLD SAYS THE SAME. A generation step is about thirty years. A
     lender who was an adult when he handed it over is very likely alive at the
     end of it; you do not get to bury a whole valley to close a ledger.

     SO THE ORGAN ASKS. `alive` is an OPTIONAL predicate on the witness's owner
     id, exactly the shape witness() already uses for `where`. WITH NOTHING
     PASSED THE BEHAVIOUR IS WHAT IT HAS ALWAYS BEEN, byte for byte, which is why
     the two gates that pin the old rule stay green: a caller that cannot say who
     is alive has not earned a different answer.

     WHAT A LIVING WITNESS KEEPS IS A MEMORY, NEVER A CHARGE. The deed stays
     theirs, still about the PARENT, and it is stamped `ended` so forceOf gives it
     zero: the child is not judged for a thing nobody ever repeated, which is the
     dynasty rule untouched. The man remembers your father. He is not billing you.
     That is the row's own sentence: you inherit the person, not the number. */
  function inherit(minds, parentId, childId, turn, alive){
    var carried=0, died=0, stood=0;
    for(var i=0;i<minds.length;i++){
      var m=minds[i]; if(!m||!m.deeds) continue;
      var keep=[];
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(d.actor!==parentId){ keep.push(d); continue; }
        /* the eyewitness is dead. Only what was RETOLD is still in the valley.
           UNLESS THE CALLER CAN SAY THEY ARE STANDING RIGHT THERE (see above). */
        if(!(d.hops>0)){
          if(alive && alive(m.owner)){
            d.ended = turn;                 /* the one it was about is gone */
            if(d.of == null) d.of = parentId;
            keep.push(d); stood++; continue;
          }
          died++; continue;
        }
        keep.push({actor:childId, kind:d.kind, turn:turn, x:d.x, y:d.y,
                   hops:d.hops, inherited:(d.inherited||0)+1, of:parentId});
        carried++;
      }
      m.deeds=keep;
    }
    return {carried:carried, died:died, stood:stood};
  }

  /* WHO IS STILL STANDING THERE AND STILL REMEMBERS. The row's own sentence made
     into a question anybody can ask: after the fold, which people saw the last
     one do this, and are still here. Returns the WITNESSES, not a balance, which
     is the whole point of the row -- an heir meets the people, never a number. */
  function whoRemembers(minds, ofId, kind){
    var out=[];
    for(var i=0;i<minds.length;i++){
      var m=minds[i]; if(!m||!m.deeds) continue;
      for(var j=0;j<m.deeds.length;j++){
        var d=m.deeds[j];
        if(!d.ended) continue;                       /* about a life that has ended */
        if(ofId!=null && d.of!==ofId && d.actor!==ofId) continue;
        if(kind!=null && d.kind!==kind) continue;
        out.push({who:m.owner, kind:d.kind, turn:d.turn, of:d.of,
                  x:d.x, y:d.y, saw:!(d.hops>0)});
        break;                                       /* one row per person */
      }
    }
    return out;
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
    /* [rumours travel] 9/22: the drift is his to turn, and isWrong is the one
       place anything asks whether a story is still the truth. */
    DRIFT:DRIFT, LOUDER:LOUDER, retell:retell, isWrong:isWrong, seedOf:seedOf,
    witness:witness, opinionOf:opinionOf, gossip:gossip, standingOf:standingOf,
    whoVouches:whoVouches, whoWont:whoWont,
    becauseOf:becauseOf, rungFor:rungFor,
    RIGHT_WORDS:RIGHT_WORDS, priceOf:priceOf, makeRight:makeRight, madeRightBy:madeRightBy,
    wouldSquare:wouldSquare,
    carryRight:carryRight,
    inherit:inherit, legendOf:legendOf, GEN_LOSS:GEN_LOSS,
    whoRemembers:whoRemembers,
    DEED_HALFLIFE:DEED_HALFLIFE, deedHalflife:deedHalflife, NEWS_LIFE:NEWS_LIFE };
  if(HASREQ) module.exports=API; else root.BohemiaStanding=API;
})(typeof globalThis!=='undefined'?globalThis:this);
