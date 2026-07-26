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
  var OCCUPIED_RATE=0.30;
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
  function agentsForBlock(blockSeed, feet, jobs, fpOf, opts){
    opts=opts||{};
    var rate=(opts.occupiedRate!=null)?opts.occupiedRate:OCCUPIED_RATE;
    var out=[];
    var jobSite=(jobs&&jobs.length)? jobs[0] : null;   // nearest site
    for(var i=0;i<feet.length;i++){
      if(!houseOccupied(blockSeed,i,rate)) continue;   // abandoned shell: nobody home
      var hh=household(hash(blockSeed,i+1,0));
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
  var RESIDENTIAL={suburb:1,gated:1,estate:1};
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
  function agentsForPlot(worldApi,x,y){
    var plot=worldApi.plot(x,y);
    if(!plot||!plot.buildings||!plot.buildings.length) return [];
    var cell=worldApi.at(x,y);
    var jobs=jobsNear(worldApi,x,y,3);
    var fpOf=function(i){ var b=plot.building(i); return b?b.floorplan():null; };
    return agentsForBlock(cell.seed>>>0, plot.buildings, jobs, fpOf);
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
    var gate=null;                   // the block gate (code 5) exterior cell
    // prefer the gate cell with the entry ROAD directly inside it (the gate row
    // is 7 cells wide but only the center column carries the road; targeting a
    // flank cell makes every commuter shuffle the wall row single-file)
    for(var y0=0;y0<H;y0++)for(var x0=0;x0<W;x0++) if(G[y0][x0]===5){
      var rd=[[0,-1],[0,1],[-1,0],[1,0]].some(function(d){var ax=x0+d[0],ay=y0+d[1];
        return ax>=0&&ay>=0&&ax<W&&ay<H&&G[ay][ax]===1;});
      if(rd){gate=[x0,y0];y0=H;break;}
      if(!gate)gate=[x0,y0];
    }
    function passable(x,y){ if(x<0||y<0||x>=W||y>=H) return false;
      var c=G[y][x]; return c===0||c===1||c===3||c===5; }
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
    jobsNear:jobsNear,makeSim:makeSim,FACTION_ASSIGN:FACTION_ASSIGN,hash:hash};
  if(HASREQ) module.exports=API;
  root.BohemiaAgents=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
