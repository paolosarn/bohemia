// BOHEMIA AGENTS — the people factory (7/19/26, LIFE session)
//
// The stage exists (world model: districts, homes, floorplans). This module
// puts PEOPLE on it. An agent is placed BY the world model, exactly as the
// roadmap specified: {home room, work room, schedule} hung on world(seed).
//
// LAWS THIS OBEYS (none new):
//   120 BPM LAW        — one world-turn = one world-minute; a schedule is
//                        quantized to whole turns. In a live view one beat
//                        (0.5s) advances one turn, so a full day = 12 minutes
//                        of watching. Nothing moves between beats.
//   I-MOVE-YOU-MOVE    — the sim advances per step() call. The caller decides
//                        whether steps come from player action (world law) or
//                        from the beat (judge-tool WATCH mode). The sim itself
//                        never owns a wall clock.
//   OCCUPANCY LAW      — one body per cell, player included. An agent blocked
//                        by a body waits; it never clips, never teleports.
//   MECHANISM-MINE / CONTENTS-PAOLO'S — FACTION_ASSIGN ships EMPTY. Which
//                        faction an agent belongs to, what factions wear, who
//                        owns what: Paolo's rulings, never generated here.
//                        Agents carry faction:null until he rules.
//   MAP LAW            — agents are placed on homes the world model already
//                        made; this module designs no layouts.
//   NO NAMES           — character names are Paolo's. Agents carry mechanical
//                        designations (H3-2 = house 3, resident 2) until he
//                        names the world.
//
// GROUNDED IN THE REAL (research, folded into constants below):
//   Household size: Las Vegas averaged ~2.6 persons/household pre-collapse
//     (ACS). Post-collapse populations consolidate for safety/heat but also
//     lose members; survivor settlements historically trend to small kin
//     groups of 1-4. Weights below give a mean of ~2.2.
//   Work day: subsistence economies converge on daylight work. In the Mojave,
//     outdoor labor happens EARLY (heat: summer 40C+ afternoons) — shifts run
//     ~07:00-15:00 with a midday meal, matching real desert work patterns.
//   Employment: in a collapsed economy most labor is subsistence scavenge;
//     wage-like work exists only where an operating site (market, warehouse,
//     clinic, solar farm) is in walking range. EMPLOY_RATE reflects that only
//     part of a block holds site jobs even when a site is near.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  // ---- THE CLOCK -----------------------------------------------------------
  // One world-turn = one world-minute. DAY_TURNS = 24h * 60. The scheduler's
  // turn counter is the ONLY time source (I-MOVE-YOU-MOVE: the world cannot
  // reach night while the player stands still, unless a judge tool WATCHES).
  var DAY_TURNS=1440;
  function tod(turn){ return ((turn%DAY_TURNS)+DAY_TURNS)%DAY_TURNS; }
  function fmt(t){ var h=Math.floor(t/60), m=t%60;
    return (h<10?'0':'')+h+':'+(m<10?'0':'')+m; }
  // day fraction for bohemia_daycycle (0 = midnight)
  function dayFrac(turn){ return tod(turn)/DAY_TURNS; }

  // ---- DETERMINISM ---------------------------------------------------------
  function rng(seed){var s=(seed>>>0)||1;return function(){
    s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
  function hash(a,b,c){ var h=(a*73856093)^(b*19349663)^((c||0)*83492791);
    h=(h^(h>>>13))>>>0; return (h*2654435761)>>>0; }

  // ---- HOUSEHOLD -----------------------------------------------------------
  // weights: 1 person 30% / 2 35% / 3 20% / 4 15% -> mean ~2.2 (see header).
  function household(seed){ var r=rng(seed)(),c=[0.30,0.65,0.85,1.0];
    for(var i=0;i<4;i++) if(r<c[i]) return i+1; return 4; }

  // ---- VACANCY (Paolo 7/19: "I hope you're not making every house have
  // inhabitants... the suburb should absolutely reflect" the die-off) --------
  // Most homes are abandoned shells. OCCUPIED_RATE is the die-off dial:
  // 0.30 = ~70% of the pre-collapse population gone (dead or left the city).
  // THE VALUE IS A PLACEHOLDER - how dead Vegas is (90%? 50%?) is Paolo's
  // canon ruling, [PENDING Paolo]. The MECHANISM (deterministic per-house
  // vacancy, dial-driven) is locked here and gated.
  // DERIVED 8/1/26, no longer a placeholder. Paolo asked the question that settles
  // it: "if we know the scale model of our Las Vegas compared to real Las Vegas ...
  // it was just the full amount of people living in Vegas in 2040, 2050 - millions
  // of people right - but then you get the scale model of it and now it's not
  // millions, and then on top of it now we have an apocalypse."
  //   THE THREE STEPS, run against the LIVE MAP by tools/bohemia_scale_model.js so
  //   this number can never drift away from the world it describes:
  //     THE MAP        48x48 cells x 96 m = 21.23 km2, 12,260 dwellings drawn
  //     THE SCALE      1:78 by housing (12,260 of Clark County's 958,705 units),
  //                    1:66 by area (21.2 km2 of the valley's 540 sq mi = 1,398.6).
  //                    Two independent measures agreeing within 16% is what says
  //                    the map is a coherent model and not a doodle.
  //     STEP 1         2050 Vegas is ~2.9 M (UNLV CBER: 3 M in 2055). At 1:78 that
  //                    is 37,085 people. Millions became tens of thousands purely
  //                    from the scale model - his whole point.
  //     STEP 2         then the apocalypse. GDD v5: ~3% remain. 37,085 x 3%
  //                    = 1,113 PEOPLE IN THE WHOLE VALLEY.
  //     STEP 3         1,113 / 2.2 per household = 506 occupied homes of 12,260.
  //                    OCCUPANCY = 4.1% on paper; 0.038 is the value that
  //                    LANDS there on the real map, because occupancy is a per-house
  //                    hash roll and household draws are not exactly the mean.
  //   THE OLD VALUE WAS 0.30 and its own comment called it a placeholder whose real
  //   number was [PENDING Paolo]. It was 7.3x too many people. This replaces a
  //   self-declared placeholder with arithmetic off his own GDD and public data -
  //   it does not overrule any ruling.
  //   THE OTHER PATH IS STILL OFF, and it is HIS so it was not touched: the 7/29
  //   zone map yields 60 people valley-wide, ~19x too FEW. Its SHAPE (clusters AND
  //   no man's lands AND spread) is his ruling and is correct; only its head counts
  //   are small. The population dial's range was widened so his slider can reach
  //   the truthful number without anybody editing that ruling.
  var OCCUPIED_RATE=0.038;
  function houseOccupied(blockSeed,i,rate){
    var r=(rate!=null)?rate:OCCUPIED_RATE;
    return (hash(blockSeed,i+1,777)%1000)/1000 < r;
  }
  function inhabitedHomes(agents){ var s={},out=[];
    agents.forEach(function(a){ s[a.home.building]=1; });
    Object.keys(s).forEach(function(k){ out.push(+k); });
    return out.sort(function(a,b){return a-b;});
  }

  // ---- SCHEDULE ------------------------------------------------------------
  // A day plan: ordered blocks covering all 1440 minutes, no gaps, no overlap.
  // where: 'home' | 'work' | 'street'
  //
  // PAOLO'S CORRECTION (7/19, root-caused): v1 gave everyone one wake time
  // with a small jitter, so the whole block surged the gate together like a
  // drill. Real people run on DIFFERENT clocks and live DIFFERENT lives. So:
  //   - four life ARCHETYPES (worker / scav / keeper / watch), not one mold
  //   - worker shift starts spread across 05:30-09:00 (real crews stagger)
  //   - wake times spread over hours, every boundary jittered per agent
  // Only the NETWORK is ever eerily synchronized, and the NETWORK is a
  // faction - Paolo's table, still empty.
  var KINDS=['worker','scav','keeper','watch'];
  function scheduleFor(seed, kind, shift){
    var r=rng((seed^0xBEEF)>>>0);
    var j=function(base,spread){ return Math.round(base+(r()-0.5)*2*spread); };
    var blocks=[], cur=0;
    function until(t,act,where){ t=Math.max(cur,Math.min(DAY_TURNS,Math.round(t)));
      if(t>cur){ blocks.push({t0:cur,t1:t,act:act,where:where}); cur=t; } }
    if(kind==='worker'){                    // off-block site job, staggered shift
      until(Math.max(240,shift-j(50,25)),'sleep','home');
      until(shift,'home','home');           // ration + gear up
      until(shift+j(480,45),'work','work'); // walking there is on the clock
      until(cur+j(150,60),'free','street');
      until(j(22*60,75),'home','home');
    } else if(kind==='scav'){               // subsistence sweep, own clock
      until(j(6*60+45,105),'sleep','home');
      until(cur+j(40,20),'home','home');
      until(j(11*60+45,60),'scav','street');
      until(j(14*60+30,45),'home','home');  // Mojave midday shelter
      until(j(17*60+45,60),'scav','street');
      until(j(21*60+45,75),'home','home');
    } else if(kind==='keeper'){             // barely leaves: tends the house/stock
      until(j(7*60+30,90),'sleep','home');
      until(j(9*60+30,90),'home','home');
      until(cur+j(75,30),'errand','street');// the one daily errand
      until(j(21*60+30,60),'home','home');
    } else {                                // 'watch': sleeps late, out at dusk
      until(j(9*60+30,45),'sleep','home');
      until(j(17*60,45),'home','home');
      until(Math.min(23*60+30,j(23*60,25)),'watch','street');
      // hard cap 23:30 so the walk home lands well before deep night
    }
    until(DAY_TURNS,'sleep','home');
    return blocks;
  }
  function whereAt(agent, turn){ var t=tod(turn);
    for(var i=0;i<agent.sched.length;i++){ var b=agent.sched[i];
      if(t>=b.t0&&t<b.t1) return b; }
    return agent.sched[agent.sched.length-1];
  }

  // ---- FACTION TABLE — EMPTY (CONTENTS-PAOLO'S) ----------------------------
  // When Paolo rules faction membership (who lives where, who works for whom),
  // rows land here and agentsForBlock starts consulting it. Until then every
  // agent is faction:null and nothing in the engine invents an allegiance.
  var FACTION_ASSIGN={};

  // ---- AGENT SPEC ----------------------------------------------------------
  // agent = {
  //   id:'H<house>-<n>'         mechanical designation (names are Paolo's)
  //   seed                      deterministic per (blockSeed, house, n)
  //   home:{building, bedRoom}  building index in feet[]; bedRoom = room index
  //                             in that building's floorplan (a 'bed' room,
  //                             round-robin so a 4-person household fills its
  //                             bedrooms before doubling up)
  //   job:{kind:'site'|'scav', district|null, dir|null, dist|null}
  //                             site jobs point at a REAL neighboring district
  //                             (walk out the gate, off the block, to it)
  //   faction:null              until Paolo rules (FACTION_ASSIGN empty)
  //   outfit:null               dressed by bohemia_dress (canon wardrobe)
  //   sched:[blocks]            the 1440-minute day, jittered per agent
  // }
  function makeAgent(blockSeed, houseI, n, jobSite, fpOf){
    var seed=hash(blockSeed,houseI+1,n+1);
    var employed=!!jobSite && (hash(seed,7,7)%100)<60;  // EMPLOY_RATE 60% where a site is in range
    var kind, shift=null;
    if(employed){ kind='worker'; shift=330+hash(seed,5,5)%210; }  // shift starts 05:30-09:00
    else { var h2=hash(seed,9,9)%100; kind = h2<55?'scav' : h2<85?'keeper' : 'watch'; }
    var bedRooms=[];
    if(fpOf){ var fp=fpOf(houseI);
      if(fp) fp.rooms.forEach(function(rm,ri){ if(rm.role==='bed') bedRooms.push(ri); }); }
    return {
      id:'H'+(houseI+1)+'-'+(n+1),
      seed:seed,
      role:kind,
      home:{building:houseI, bedRoom: bedRooms.length? bedRooms[n%bedRooms.length] : 0},
      job: employed? {kind:'site', district:jobSite.district, dir:jobSite.dir, dist:jobSite.dist}
                   : {kind:'scav', district:null, dir:null, dist:null},
      faction:null,
      outfit:null,
      sched:scheduleFor(seed, kind, shift)
    };
  }

  // ---- GENERATOR: agents for one residential block -------------------------
  // res/feet come from the suburb generator (the world model's residential
  // plot); jobs = nearby job sites [{district,dir,dist}] (agentsForPlot scans
  // the real overmap for them). fpOf(i) -> floorplan of house i (injected so
  // block-level callers and world-level callers share one body).
  /* the population dial, if bohemia_population is loaded. 1 when it is not. */
  function dialOf(cell){
    try{
      var POP=(typeof BohemiaPopulation!=='undefined')?BohemiaPopulation
             :(root&&root.BohemiaPopulation)||null;
      if(POP&&POP.dialAt&&cell) return POP.dialAt(cell[0],cell[1]);
      if(POP&&POP.dial) return POP.dial();
    }catch(_e){}
    return 1;
  }
  function agentsForBlock(blockSeed, feet, jobs, fpOf, opts){
    opts=opts||{};
    var rate=(opts.occupiedRate!=null)?opts.occupiedRate:OCCUPIED_RATE;
    /* THE POPULATION DIAL HAS THE LAST WORD, whichever path the rate came from
       (Paolo 8/1, the slider he is going to make). occupiedRateFor already
       multiplies by it, so a caller on the zone map is dialled once and only
       once; a caller on this module's own placeholder is dialled HERE, and a
       caller that passed an explicit number gets it dialled too, because "0
       means nobody" has to be true everywhere or the bottom of his slider is a
       lie. bohemia_population owns the dial; this module just obeys it. */
    try{
      var POP=(typeof BohemiaPopulation!=='undefined')?BohemiaPopulation
             :(root&&root.BohemiaPopulation)||null;
      if(POP&&POP.applyDial&&!opts.preDialled)
        rate=POP.applyDial(rate, opts.cell?opts.cell[0]:null, opts.cell?opts.cell[1]:null);
    }catch(_e){}
    var out=[];
    var jobSite=(jobs&&jobs.length)? jobs[0] : null;   // nearest site
    /* EXACTLY N HOUSEHOLDS (Paolo 8/1: "in my starting neighborhood I want there
       to be FOUR FAMILIES"). A RATE cannot say four - it is a per-house coin flip
       that lands near a number and never on it, which is why the starting block's
       old "floor of 6 households" produced 5, 6 or 7 depending on the seed. When
       he names a count, the count is the law: pick exactly that many houses,
       deterministically, and leave every other door shut.
       WHICH houses: spread across the block rather than clumped at index 0, so
       four families read as a neighbourhood and not as a terrace. Deterministic
       from the block seed, so they are the same four houses forever. */
    var chosen=null;
    if(opts.households>0 && feet.length){
      /* THE DIAL STILL HAS THE LAST WORD, even over a named count. Two of his
         rulings meet here: "four families in my starting neighborhood" and "the
         slider can go all the way from ZERO to a maximum". At dial 0 the valley
         is a ghost valley and that has to include his own street, or the bottom
         of the slider is a lie. So the COUNT is dialled the same way a rate is:
         four families at 1, two at 0.5, none at 0, eight at 2. */
      var want=Math.round(opts.households * (opts.preDialled ? 1 : dialOf(opts.cell)));
      if(want<=0) return out;
      want=Math.min(want, feet.length);
      chosen={};
      var step=feet.length/want, off=hash(blockSeed,101,7)%Math.max(1,Math.floor(step));
      for(var k=0;k<want;k++){
        var idx=Math.min(feet.length-1, Math.floor(k*step)+off);
        while(chosen[idx]&&idx<feet.length-1) idx++;
        chosen[idx]=1;
      }
    }
    for(var i=0;i<feet.length;i++){
      if(chosen){ if(!chosen[i]) continue; }          // he named a count: obey it
      else if(!houseOccupied(blockSeed,i,rate)) continue;   // abandoned shell
      var hh=household(hash(blockSeed,i+1,0));
      /* A FAMILY IS MORE THAN ONE PERSON. When he names a COUNT OF FAMILIES the
         word has to mean what it means in English - the household roll returns 1
         thirty percent of the time, and "four families" coming out as two
         couples and two people living alone is not four families. Only the
         named-count path floors this; everywhere else in the valley a household
         of one is still a household of one, because most survivors are alone and
         that is the honest picture. */
      if(chosen && hh < 2) hh = 2;
      for(var n=0;n<hh;n++){
        // alternate: within a household, later members may use a farther site
        var js=(jobs&&jobs.length)? jobs[hash(blockSeed,i+1,n+13)%jobs.length] : jobSite;
        out.push(makeAgent(blockSeed,i,n,js,fpOf));
      }
    }
    return out;
  }

  // ---- THE POPULATION LAYER (Zomboid pattern, research bank 7/19) ----------
  // The valley holds a population as NUMBERS per cell; real agent objects
  // only materialize inside the player's bubble. The census runs the SAME
  // vacancy + household hashes agentsForBlock runs, so the numbers and the
  // materialized people can never disagree (gated: census === agents.length).
  // ---- WHERE PEOPLE ACTUALLY LIVE -----------------------------------------
  // MEASURED 8/1 AND WRONG TWO WAYS AT ONCE. This list was {suburb,gated,estate}
  // and it is the census's definition of housing, while agentsForPlot ignored it
  // completely and made a HOUSEHOLD out of every building in the valley. On 58
  // sampled cells the two disagreed 52 times. Concretely: ten people slept
  // inside a strip mall, three inside a solar farm's inverter shed, six in
  // self-storage units, each with a bedRoom index and a home they walk back to.
  //   FIX 1, THE LIST: the district kit's OWN registrations say apartment,
  //   suburb and trailer are category:'residential' (bohemia_apartment.js:99,
  //   bohemia_suburb.js:308, bohemia_trailer.js:84). The hand-written list
  //   disagreed with the registry and dropped apartments and trailer parks —
  //   real housing that the census therefore counted as zero. gated and estate
  //   are procedural suburb variants with no module of their own, so they stay
  //   listed by hand.
  //   FIX 2, THE GENERATOR: agentsForPlot now asks this list too, so a building
  //   is only a DWELLING where people actually live. Everything else gets
  //   workersForPlot instead — see below.
  var RESIDENTIAL={suburb:1,gated:1,estate:1,apartment:1,trailer:1};
  function censusForBlock(blockSeed, feet, rate){
    var lived=0, people=0;
    for(var i=0;i<feet.length;i++){
      if(!houseOccupied(blockSeed,i,rate)) continue;
      lived++; people+=household(hash(blockSeed,i+1,0));
    }
    return {homes:feet.length, lived:lived, people:people};
  }
  function censusForPlot(worldApi,x,y,opts){
    opts=opts||{};
    var cell=worldApi.at(x,y);
    if(!cell||!RESIDENTIAL[cell.district]) return {district:cell?cell.district:null,homes:0,lived:0,people:0};
    var plot=worldApi.plot(x,y);
    if(!plot||!plot.buildings||!plot.buildings.length) return {district:cell.district,homes:0,lived:0,people:0};
    var c=censusForBlock(cell.seed>>>0, plot.buildings, opts.occupiedRate);
    c.district=cell.district; return c;
  }
  // deterministic sampled estimate for valley-scale readouts. An ESTIMATE,
  // never presented as an exact count (the exact count exists per cell).
  function sampleValley(worldApi, nSamples, opts){
    opts=opts||{}; nSamples=nSamples||24;
    var cells=[], n=worldApi.n;
    for(var y=0;y<n;y++)for(var x=0;x<n;x++){
      var c=worldApi.at(x,y); if(c&&RESIDENTIAL[c.district]) cells.push([x,y]); }
    if(!cells.length) return {residentialCells:0,sampled:0,avgPeople:0,estimatedPeople:0};
    var step=Math.max(1,Math.floor(cells.length/nSamples)), tot=0, k=0;
    for(var i=(opts.offset|0)%step;i<cells.length&&k<nSamples;i+=step){
      tot+=censusForPlot(worldApi,cells[i][0],cells[i][1],opts).people; k++;
    }
    var avg=k?tot/k:0;
    return {residentialCells:cells.length, sampled:k, avgPeople:+avg.toFixed(2),
      estimatedPeople:Math.round(avg*cells.length)};
  }

  // ---- THE OFFLINE PLANE (STALKER pattern, research bank 7/19) -------------
  // The schedule IS the offline simulation: whereAt answers "where is this
  // person, doing what" for ANY agent at ANY turn in O(blocks), no stepping,
  // no pathfinding. The online bubble (makeSim) is the only place bodies
  // exist. These two views are gated to agree (population gate).
  function offlineSummary(agents, turn){
    var s={home:0,work:0,street:0};
    (agents||[]).forEach(function(a){ s[whereAt(a,turn).where]++; });
    return s;
  }

  // ---- ROOM ADVERTISEMENTS (rung 3 v1, Sims pattern, research bank 7/19) ---
  // The people are dumb on purpose; the PLACED WORLD is smart. Rooms
  // advertise the acts they serve, and an at-home agent's position in the
  // house follows what its current sub-act needs: kitchen at meal times,
  // living room through the evening, own bed room at night. Content = the
  // floorplan Paolo's world placed; adding life to a house = the house
  // itself, zero new brain code. Props join the advertisement table when
  // the world grows objects.
  var ADVERTS={bed:['sleep','rest'],kitchen:['eat'],dining:['eat'],
    living:['idle'],bath:['wash'],hall:[],closet:[],garage:[],entry:[]};
  // the in-house sub-act across a home block: personal breakfast window
  // right after wake, a personal supper window, wind-down after 21:00.
  function homeActAt(agent, turn){
    var b=whereAt(agent,turn); if(b.where!=='home') return null;
    if(b.act==='sleep') return 'sleep';
    var t=tod(turn);
    var wake=(agent.sched.length&&agent.sched[0].act==='sleep')?agent.sched[0].t1:6*60;
    if(t>=wake&&t<wake+45) return 'eat';               // morning ration
    var sup=18*60+(hash(agent.seed,17,3)%60);          // personal supper 18:00-19:00
    if(t>=sup-20&&t<sup+25) return 'eat';
    if(t>=21*60) return 'rest';
    return 'idle';
  }
  var ACT_IX={sleep:1,rest:2,eat:3,idle:4,wash:5};
  function homeSpotFor(agent, fp, turn, k){
    if(!fp||!fp.rooms||!fp.rooms.length) return {x:1,y:1,act:'idle'};
    var act=homeActAt(agent,turn)||'idle';
    var cand=[];
    fp.rooms.forEach(function(rm,ri){
      if(act==='sleep'||act==='rest'){ if(ri===agent.home.bedRoom) cand.push(rm); }
      else if((ADVERTS[rm.role]||[]).indexOf(act)>=0) cand.push(rm);
    });
    if(!cand.length&&(act==='sleep'||act==='rest'))
      cand=fp.rooms.filter(function(rm){return rm.role==='bed';});
    if(!cand.length) cand=fp.rooms.filter(function(rm){return rm.role==='living';});
    if(!cand.length) cand=fp.rooms;
    var rm2=cand[hash(agent.seed,ACT_IX[act]||0,7)%cand.length];   // stable per (agent, act)
    var iw=Math.max(1,rm2.w-2), ih=Math.max(1,rm2.h-2), kk=(k|0);
    var idx=(hash(agent.seed,ACT_IX[act]||0,11)+kk)%(iw*ih);       // linear index: occupants spread, never stack
    var cx=rm2.x+1+(idx%iw), cy=rm2.y+1+((idx/iw)|0);
    return {x:Math.min(cx,rm2.x+rm2.w-1), y:Math.min(cy,rm2.y+rm2.h-1), act:act, room:rm2.role};
  }

  // ---- GENERATOR: agents for a WORLD plot ----------------------------------
  // The roadmap's sentence, literal: "an agent = {home room, work room,
  // schedule} placed BY the model." Takes world(seed) and a residential plot
  // address; homes are that plot's buildings, jobs are scanned off the real
  // overmap (nearest job-capable districts within walking range).
  var JOB_DISTRICTS={commercial:1,industrial:1,medical:1,solar:1};
  function jobsNear(worldApi,x,y,radius){
    radius=radius||3; var found=[];
    for(var d=1;d<=radius;d++){
      var ring=[[0,-d,'N'],[0,d,'S'],[-d,0,'W'],[d,0,'E']];
      for(var k=0;k<ring.length;k++){
        var c=worldApi.at(x+ring[k][0],y+ring[k][1]);
        if(c&&JOB_DISTRICTS[c.district]) found.push({district:c.district,dir:ring[k][2],dist:d});
      }
    }
    found.sort(function(a,b){return a.dist-b.dist;});
    return found;
  }
  // ---- THE OTHER END OF THE COMMUTE ---------------------------------------
  // Every worker in the valley already walks out of their gate to a named
  // district (job:{kind:'site',district,dir,dist}) — and then LEAVES THE WORLD.
  // loc.mode goes 'away' and nothing anywhere renders them. Half a journey has
  // been simulated since 7/19: they depart and never arrive, so the sites they
  // work at stand empty all day while the sim insists people are there.
  //   workersForPlot is jobsNear run BACKWARDS. jobsNear looks from a home along
  //   the four compass rings out to radius 3; so the homes that can possibly
  //   send anybody HERE are at exactly the mirrored twelve positions, and the
  //   agents there are re-derived from the same seeds. NO NEW POPULATION IS
  //   INVENTED — these are the same people, with the same ids and the same
  //   identity keys, standing where the sim already said they were. Walk to the
  //   solar farm at noon and you can meet the neighbour you asked the name of.
  function workersForPlot(worldApi,X,Y,radius,opts){
    radius=radius||3; opts=opts||{};
    var here=worldApi.at(X,Y);
    if(!here||!JOB_DISTRICTS[here.district]) return [];
    var out=[];
    for(var d=1;d<=radius;d++){
      /* mirror of jobsNear's ring: a home NORTH of here saw this cell to its
         SOUTH, so it recorded dir 'S'. */
      var ring=[[0,-d,'S'],[0,d,'N'],[-d,0,'E'],[d,0,'W']];
      for(var k=0;k<ring.length;k++){
        var hx=X+ring[k][0], hy=Y+ring[k][1];
        var hc=worldApi.at(hx,hy);
        if(!hc||!RESIDENTIAL[hc.district]) continue;
        var home=agentsForPlot(worldApi,hx,hy,opts);
        for(var i=0;i<home.length;i++){
          var a=home[i], j=a.job;
          if(!j||j.kind!=='site') continue;
          if(j.district!==here.district||j.dir!==ring[k][2]||j.dist!==d) continue;
          /* a VISITOR: their home is on another grid, so this cell may never
             treat them as a resident. The sim reads this flag and inverts them —
             present while their shift says 'work', away the rest of the day. */
          var v={}; for(var kk in a) v[kk]=a[kk];
          v.visiting=true; v.fromCell=[hx,hy];
          out.push(v);
        }
      }
    }
    return out;
  }
  /* EVERYBODY A CELL HOLDS: the residents who live there plus the workers who
     are there for the day. This is what a surface should ask for. */
  function peopleForPlot(worldApi,x,y,opts){
    return agentsForPlot(worldApi,x,y,opts).concat(workersForPlot(worldApi,x,y,3,opts));
  }
  function agentsForPlot(worldApi,x,y,opts){
    opts=opts||{};
    var plot=worldApi.plot(x,y);
    if(!plot||!plot.buildings||!plot.buildings.length) return [];
    var cell=worldApi.at(x,y);
    /* NOBODY LIVES IN THE STRIP MALL. A building is only a home where homes are
       (see RESIDENTIAL above). This is what makes censusForPlot and this
       function agree; they disagreed on 52 of 58 sampled cells. */
    if(!RESIDENTIAL[cell.district]) return [];
    var jobs=jobsNear(worldApi,x,y,3);
    var fpOf=function(i){ var b=plot.building(i); return b?b.floorplan():null; };
    /* THE SAME RATE ON BOTH ENDS OF THE COMMUTE. A caller that generates a block
       at one occupancy rate (the run uses a zone map, and a floor on the player's
       own cell) has to hand the SAME rate in when it asks who commutes out of
       that block — otherwise the worker standing at the solar farm is a different
       person from the neighbour standing in their own yard, and this lane's whole
       promise is that they are not. */
    /* WHICH POPULATION THIS CELL HOLDS, and a contradiction this function must
       NOT resolve on its own. MEASURED 8/1:
         this module's flat OCCUPIED_RATE placeholder -> 8,282 people in the valley
         Paolo's ruled zone map (7/29)                ->    60 people in the valley
         GDD v5 (~3% of pre-crash 2.3M survive)       -> ~69,000 people
       Three numbers, three orders of magnitude apart, all live at once. The RUN
       uses the zone map and only feels inhabited because it applies a 6-household
       FLOOR to the player's own cell; walk one block and the neighbourhood is
       genuinely dead (cells 39,22 and 39,24 hold nobody, measured on the real
       surface). Defaulting this to the zone map was tried and BACKED OUT: it makes
       every consumer agree on a population that is almost certainly wrong, which
       spreads the bug instead of containing it. A contradiction between two live
       rulings is [PENDING Paolo], not this function's call.
       So the rate stays explicit: opts.rateFor (the run's, zone map + its floor),
       else opts.occupiedRate, else the module's declared placeholder. */
    var rate = opts.rateFor ? opts.rateFor(x,y) : opts.occupiedRate;
    var o = (rate!=null)?{occupiedRate:rate}:{};
    o.cell = [x,y];          /* so a REPAIRED district fills up and its neighbour does not */
    return agentsForBlock(cell.seed>>>0, plot.buildings, jobs, fpOf, o);
  }

  // ---- BOUNDED DEVIATION (rung 4b, the Radiant lesson made law) ------------
  // Events may push an agent off plan, but the bounds are machine-enforced:
  //   - every deviation carries an EXPIRY (until turn) or it is rejected -
  //     nobody wanders off their life forever
  //   - at most DEVIATION_CAP of a block's population deviates at once
  //     (Shadows of Doubt: "never more than a handful")
  //   - when it expires, the agent RE-CONVERGES to the schedule; the offline
  //     plane stays the plan (deviation is an online-bubble phenomenon)
  // WHAT triggers a deviation is content (combat, quests, faction moves) -
  // not decided here. Kinds are mechanism verbs only:
  //   goto:{x,y,until}  be somewhere else for a while
  //   flee:{x,y,until}  get away from a point (indoors counts as safe)
  //   stay_home:{until} shelter in place
  var DEVIATION_CAP=0.2;
  function deviate(sim, agent, ev){
    if(!ev||typeof ev.until!=='number') return {ok:false,why:'unbounded'};
    if(ev.until<=sim.turn) return {ok:false,why:'expired'};
    var cap=Math.max(1,Math.floor(sim.agents.length*DEVIATION_CAP));
    var active=0;
    sim.agents.forEach(function(a){ if(a.dev&&a.dev.until>sim.turn) active++; });
    if(active>=cap && !(agent.dev&&agent.dev.until>sim.turn)) return {ok:false,why:'cap'};
    agent.dev={kind:ev.kind, x:ev.x, y:ev.y, until:ev.until|0};
    agent._path=null;
    return {ok:true};
  }

  // ---- THE SIM: a block living a day ---------------------------------------
  // Advances ONE world-turn per step() call. The caller decides what a step is
  // (player action per I-MOVE-YOU-MOVE, or one 120BPM beat in a judge tool's
  // WATCH mode). Occupancy: one body per exterior cell, player included.
  //
  // Agent loc modes: 'in' (inside their house — visible when you enter it),
  // 'out' (on the block streets, x/y valid), 'away' (off-block at a job site;
  // they walked out the gate and the valley has them until the walk home).
  function makeSim(res, feet, agents, opts){
    opts=opts||{};
    var G=res.g, W=res.W, H=res.H;
    var fpOf=opts.fpOf||function(){return null;};
    var doorOf=opts.doorOf||{};      // 'x,y' -> house index (the walk slice's doors)
    var doorCell=[];                 // house index -> [x,y] exterior door cell
    Object.keys(doorOf).forEach(function(k){ var p=k.split(',');
      doorCell[doorOf[k]]=[+p[0],+p[1]]; });
    /* THE WAY IN IS NOT ALWAYS A GATE (8/1, CITY lane).
       This scanned the grid for a code-5 cell and called it the block's
       entrance. That held only while every residential block was gated, which
       was itself a bug: Paolo's bank law says "most Vegas communities are walled
       but NOT gated", and once the suburb generator started building the 98% of
       ordinary subdivisions with an OPEN STREET through the wall instead of a
       gate assembly, this scan found nothing, `gate` stayed null, and agents on
       those blocks could no longer leave for work or walk home. The life sim
       went quiet on almost the whole valley.
       THE RESULT OBJECT ALREADY KNOWS. `res` is the generator's own output and
       it carries `gates` - every entrance, with its edge and its centre cell,
       whichever kind it is. Reading it needs no new argument and no caller
       change, and it is strictly BETTER than the scan: the recorded cell is
       always the centre column, which is the one the road spoke runs into. The
       scan survives underneath for callers that hand over a bare grid. */
    var gate=null;                   // the block's entrance (gate OR open street)
    /* AN ENTRANCE IS NOT ALWAYS A GATE CELL. This scan looked for code 5 and
       nothing else, which held only while every residential block was gated -
       itself the bug Paolo's bank law names ("most Vegas communities are walled
       but NOT gated"). Once the suburb generator started building the valley's
       98% of ordinary subdivisions with an OPEN STREET through the wall instead
       of a gate assembly, this found nothing, `gate` stayed null, and nobody on
       those blocks could leave for work or walk home. The life sim went quiet on
       almost the whole valley.
       ONLY THE PREDICATE CHANGED, AND THAT IS THE WHOLE POINT. The first attempt
       at this fix read the generator's own entrance list instead, which sounds
       strictly better and is not: the scan lands on the FIRST aperture cell with
       a road beside it (x=61 of the 61..67 row), the entrance list records the
       CENTRE (x=64), and swapping one for the other left two commuters per block
       stranded mid-walk. population_gate caught it. So the search is untouched,
       byte-for-byte, on every block that has a real gate - it just also
       recognises the open-street entrance, which is a road cell sitting ON the
       perimeter ring and cannot be anything else. */
    var _perim=function(x,y){ return x===0||y===0||x===W-1||y===H-1; };
    var _entrance=function(x,y){ return G[y][x]===5 || (G[y][x]===1 && _perim(x,y)); };
    // prefer the entrance cell with the entry ROAD directly inside it (the row
    // is 7 cells wide but only the center column carries the road; targeting a
    // flank cell makes every commuter shuffle the wall row single-file)
    for(var y0=0;y0<H;y0++)for(var x0=0;x0<W;x0++) if(_entrance(x0,y0)){
      var rd=[[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var ax=x0+d[0],ay=y0+d[1];
        return ax>=0&&ay>=0&&ax<W&&ay<H&&G[ay][ax]===1;});
      if(rd){gate=[x0,y0];y0=H;break;}
      if(!gate)gate=[x0,y0];
    }
    function passable(x,y){ if(x<0||y<0||x>=W||y>=H) return false;
      /* 10 = SIDEWALK (Paolo 7/31). It was missing here the moment the suburb
         gained one, and a sidewalk the sim treats as a wall is worse than no
         sidewalk: neighbours could not cross their own kerb, so walks never
         finished and population_gate went red on OFFLINE/ONLINE AGREEMENT.
         Caught by that gate the same hour, which is the point of having it. */
      var c=G[y][x]; return c===0||c===1||c===3||c===5||c===10; }
    // BFS path on the exterior grid (roads/driveways/dead ground)
    function path(from,to){
      if(!from||!to) return null;
      var q=[from], came={}, key=function(p){return p[0]+','+p[1];};
      came[key(from)]=null; var qi=0;
      while(qi<q.length){ var cur=q[qi++];
        if(cur[0]===to[0]&&cur[1]===to[1]){ var out=[],c=cur;
          while(c){ out.push(c); c=came[key(c)]; } out.reverse(); return out; }
        var nb=[[1,0],[-1,0],[0,1],[0,-1]];
        for(var k=0;k<4;k++){ var nx=cur[0]+nb[k][0],ny=cur[1]+nb[k][1];
          var kk=nx+','+ny;
          if((passable(nx,ny)||(nx===to[0]&&ny===to[1]))&&!(kk in came)){
            came[kk]=cur; q.push([nx,ny]); } } }
      return null;
    }
    // interior standing spots per house: bed cells for sleepers, common cells else
    var interior={};
    function interiorSpots(hi){
      if(interior[hi]) return interior[hi];
      var fp=fpOf(hi); var spots={bed:{},common:[]};
      if(fp){ fp.rooms.forEach(function(rm,ri){
        var cx=rm.x+(rm.w>>1), cy=rm.y+(rm.h>>1);
        if(rm.role==='bed'){ (spots.bed[ri]=spots.bed[ri]||[]).push([cx,cy],[rm.x+1,rm.y+1],[rm.x+rm.w-2,rm.y+rm.h-2]); }
        else spots.common.push([cx,cy]); }); }
      interior[hi]=spots; return spots;
    }
    var sim={
      turn:(opts.startTurn|0)||0,
      agents:agents,
      occ:{},                          // exterior occupancy 'x,y' -> agent id (caller adds player)
      playerAt:opts.playerAt||null,    // [x,y] or null; OCCUPANCY includes the player
      step:step, whereAt:whereAt, tod:function(){return tod(sim.turn);},
      inHouse:inHouse, outAgents:outAgents,
      // the household as the room advertisements place them right now
      homeSpots:function(hi){ var fp=fpOf(hi), out=[];
        inHouse(hi).forEach(function(a,k){ out.push({agent:a, spot:homeSpotFor(a,fp,sim.turn,k)}); });
        return out; }
    };
    agents.forEach(function(a,ai){
      a.loc={mode:'in',x:0,y:0};       // day 0 starts at 00:00: everyone home asleep
      a._path=null; a._act='sleep';
      // distinct interior spots per occupant
      var sp=interiorSpots(a.home.building);
      var beds=sp.bed[a.home.bedRoom]||sp.common;
      a._bedSpot=beds.length? beds[ai%beds.length] : [1,1];
      a._commonSpot=sp.common.length? sp.common[ai%sp.common.length] : a._bedSpot;
    });
    function inHouse(hi){ return agents.filter(function(a){
      return a.loc.mode==='in' && a.home.building===hi; }); }
    function outAgents(){ return agents.filter(function(a){return a.loc.mode==='out';}); }
    function occFree(x,y,id){ var k=x+','+y;
      if(sim.playerAt&&sim.playerAt[0]===x&&sim.playerAt[1]===y) return false;
      return !(k in sim.occ)||sim.occ[k]===id; }
    function place(a,x,y){ var k0=a.loc.x+','+a.loc.y;
      if(sim.occ[k0]===a.id) delete sim.occ[k0];
      a.loc.x=x; a.loc.y=y; sim.occ[x+','+y]=a.id; }
    function leaveGrid(a,mode){ var k0=a.loc.x+','+a.loc.y;
      if(sim.occ[k0]===a.id) delete sim.occ[k0];
      a.loc.mode=mode; a._path=null; }
    function step(){
      sim.turn++;
      var t=tod(sim.turn);
      agents.forEach(function(a){
        // DEVIATION overrides the plan, inside its bounds, until it expires
        if(a.dev){
          if(sim.turn>=a.dev.until){ a.dev=null; a._path=null; a._act='__reconverge'; }
          else { var dv=a.dev, ddoor=doorCell[a.home.building]||gate;
            if(a.loc.mode==='away'){            // deviations act on the block: come back first
              if(gate&&occFree(gate[0],gate[1],a.id)){ a.loc.mode='out'; place(a,gate[0],gate[1]); a._path=null; }
              return; }
            if(dv.kind==='stay_home'){
              if(a.loc.mode==='in') return;
              walkTo(a,ddoor,function(){ leaveGrid(a,'in'); }); return; }
            if(dv.kind==='goto'){
              if(a.loc.mode==='in'){ stepOut(a,ddoor); return; }
              walkTo(a,[dv.x,dv.y],null); return; }
            if(dv.kind==='flee'){
              if(a.loc.mode==='in') return;      // indoors is safe
              var best=null,bd=-1,nb=[[1,0],[-1,0],[0,1],[0,-1]];
              for(var q=0;q<4;q++){ var fx=a.loc.x+nb[q][0],fy=a.loc.y+nb[q][1];
                if(!passable(fx,fy)||!occFree(fx,fy,a.id)) continue;
                var dd=Math.abs(fx-dv.x)+Math.abs(fy-dv.y);
                if(dd>bd){bd=dd;best=[fx,fy];} }
              var cur=Math.abs(a.loc.x-dv.x)+Math.abs(a.loc.y-dv.y);
              if(best&&bd>cur) place(a,best[0],best[1]);
              return; }
            return; }
        }
        var b=whereAt(a,sim.turn);
        var want=b.where, act=b.act;
        if(act!==a._act){ a._act=act; a._path=null; }   // activity change -> replan
        var door=doorCell[a.home.building]||gate;
        /* A VISITOR IS A RESIDENT INVERTED. They live on another cell, so 'home'
           means gone from this grid and 'work' means here. Their home.building
           indexes another cell's buildings and must never be used against this
           one's doors. */
        if(a.visiting){
          if(want==='work'){
            if(a.loc.mode==='away'||a.loc.mode==='in'){
              if(gate&&occFree(gate[0],gate[1],a.id)){ a.loc.mode='out'; place(a,gate[0],gate[1]); a._path=null; }
              return; }
            roam(a,act); return; }
          if(a.loc.mode!=='away') leaveGrid(a,'away');   /* off shift: they went home */
          return;
        }
        if(want==='home'){
          if(a.loc.mode==='in') return;                  // already home
          if(a.loc.mode==='away'){                       // walking back: reappear at the gate
            if(gate&&occFree(gate[0],gate[1],a.id)){ a.loc.mode='out'; place(a,gate[0],gate[1]); a._path=null; }
            return; }
          walkTo(a,door,function(){ leaveGrid(a,'in'); });
        } else if(want==='work'){                        // off-block site: out the gate, then away
          if(a.loc.mode==='away') return;
          if(a.loc.mode==='in'){ stepOut(a,door); return; }
          walkTo(a,gate,function(){ leaveGrid(a,'away'); });
        } else {                                         // street: scav / free roam on the block
          if(a.loc.mode==='away'){                       // free time after work: come back first
            if(gate&&occFree(gate[0],gate[1],a.id)){ a.loc.mode='out'; place(a,gate[0],gate[1]); a._path=null; }
            return; }
          if(a.loc.mode==='in'){ stepOut(a,door); return; }
          roam(a,act);
        }
      });
      return sim;
    }
    function stepOut(a,door){                            // house -> exterior door cell
      if(door&&occFree(door[0],door[1],a.id)){ a.loc.mode='out'; place(a,door[0],door[1]); a._path=null; }
    }
    function walkTo(a,to,arrive){
      if(!to) return;
      if(a.loc.x===to[0]&&a.loc.y===to[1]){ if(arrive)arrive(); return; }
      if(!a._path||!a._path.length) a._path=path([a.loc.x,a.loc.y],to)||[];
      if(a._path.length<2){ if(arrive&&a.loc.x===to[0]&&a.loc.y===to[1])arrive(); return; }
      var nxt=a._path[1];
      if(occFree(nxt[0],nxt[1],a.id)){ a._path.shift(); place(a,nxt[0],nxt[1]);
        if(a.loc.x===to[0]&&a.loc.y===to[1]&&arrive)arrive(); }
      else a._path=null;                                 // blocked body: wait, replan next turn
    }
    // scavenge/free wander: deterministic waypoints off the agent's seed + turn
    function roam(a,act){
      if(!a._path||a._path.length<2){
        var tries=0, r=rng(hash(a.seed,sim.turn>>5,3));
        while(tries++<12){
          var tx=1+Math.floor(r()*(W-2)), ty=1+Math.floor(r()*(H-2));
          if(passable(tx,ty)){ a._path=path([a.loc.x,a.loc.y],[tx,ty]); if(a._path)break; }
        }
        if(!a._path)return;
      }
      var nxt=a._path[1]; if(!nxt)return;
      if(occFree(nxt[0],nxt[1],a.id)){ a._path.shift(); place(a,nxt[0],nxt[1]); }
      else a._path=null;
    }
    return sim;
  }

  var API={DAY_TURNS:DAY_TURNS,tod:tod,fmt:fmt,dayFrac:dayFrac,
    household:household,scheduleFor:scheduleFor,whereAt:whereAt,KINDS:KINDS,
    OCCUPIED_RATE:OCCUPIED_RATE,houseOccupied:houseOccupied,inhabitedHomes:inhabitedHomes,
    makeAgent:makeAgent,agentsForBlock:agentsForBlock,agentsForPlot:agentsForPlot,
    censusForBlock:censusForBlock,censusForPlot:censusForPlot,sampleValley:sampleValley,
    offlineSummary:offlineSummary,RESIDENTIAL:RESIDENTIAL,
    ADVERTS:ADVERTS,homeActAt:homeActAt,homeSpotFor:homeSpotFor,
    deviate:deviate,DEVIATION_CAP:DEVIATION_CAP,
    jobsNear:jobsNear,workersForPlot:workersForPlot,peopleForPlot:peopleForPlot,
    makeSim:makeSim,FACTION_ASSIGN:FACTION_ASSIGN,hash:hash};
  if(HASREQ) module.exports=API;
  root.BohemiaAgents=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
