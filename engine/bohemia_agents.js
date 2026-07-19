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

  // ---- SCHEDULE ------------------------------------------------------------
  // A day plan: ordered blocks covering all 1440 minutes, no gaps, no overlap.
  // acts: sleep / home (morning ration, evening) / commute / work / scav / free
  // where: 'home' | 'work' | 'street'
  // Every boundary is jittered per agent (humans vary; only the NETWORK is
  // eerily perfect, and the NETWORK is factions — Paolo's, not ours yet).
  function scheduleFor(seed, employed){
    var r=rng(seed^0xBEEF);
    var j=function(base,spread){ return Math.round(base+(r()-0.5)*2*spread); };
    var wake=j(6*60,40);            // ~06:00 +-40min (desert: work early)
    var out =wake+j(45,15);         // ration + gear up at home
    var workEnd, sleep=j(22*60+30,40);
    var blocks=[];
    if(employed){
      workEnd=j(15*60,30);          // ~15:00, before peak heat is done killing
      blocks=[
        {t0:0,        t1:wake,    act:'sleep',   where:'home'},
        {t0:wake,     t1:out,     act:'home',    where:'home'},
        {t0:out,      t1:workEnd, act:'work',    where:'work'},   // commute is part of the work block: walking there IS on the clock
        {t0:workEnd,  t1:j(18*60,40), act:'free',where:'street'},
        {t0:0,        t1:sleep,   act:'home',    where:'home'},   // t0 patched below
        {t0:sleep,    t1:DAY_TURNS, act:'sleep', where:'home'}
      ];
      blocks[4].t0=blocks[3].t1;
    } else {
      // subsistence: scavenge the block in two daylight passes, shelter at peak heat
      var midIn=j(12*60,30), midOut=j(14*60+30,30);
      blocks=[
        {t0:0,     t1:wake,   act:'sleep', where:'home'},
        {t0:wake,  t1:out,    act:'home',  where:'home'},
        {t0:out,   t1:midIn,  act:'scav',  where:'street'},
        {t0:midIn, t1:midOut, act:'home',  where:'home'},   // Mojave midday shelter
        {t0:midOut,t1:j(18*60,40), act:'scav', where:'street'},
        {t0:0,     t1:sleep,  act:'home',  where:'home'},
        {t0:sleep, t1:DAY_TURNS, act:'sleep', where:'home'}
      ];
      blocks[5].t0=blocks[4].t1;
    }
    // sanity: monotone, whole-minute (quantized) blocks
    for(var i2=0;i2<blocks.length;i2++){ var b=blocks[i2];
      b.t0=Math.max(0,Math.min(DAY_TURNS,Math.round(b.t0)));
      b.t1=Math.max(b.t0,Math.min(DAY_TURNS,Math.round(b.t1))); }
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
    var bedRooms=[];
    if(fpOf){ var fp=fpOf(houseI);
      if(fp) fp.rooms.forEach(function(rm,ri){ if(rm.role==='bed') bedRooms.push(ri); }); }
    return {
      id:'H'+(houseI+1)+'-'+(n+1),
      seed:seed,
      home:{building:houseI, bedRoom: bedRooms.length? bedRooms[n%bedRooms.length] : 0},
      job: employed? {kind:'site', district:jobSite.district, dir:jobSite.dir, dist:jobSite.dist}
                   : {kind:'scav', district:null, dir:null, dist:null},
      faction:null,
      outfit:null,
      sched:scheduleFor(seed, employed)
    };
  }

  // ---- GENERATOR: agents for one residential block -------------------------
  // res/feet come from the suburb generator (the world model's residential
  // plot); jobs = nearby job sites [{district,dir,dist}] (agentsForPlot scans
  // the real overmap for them). fpOf(i) -> floorplan of house i (injected so
  // block-level callers and world-level callers share one body).
  function agentsForBlock(blockSeed, feet, jobs, fpOf){
    var out=[];
    var jobSite=(jobs&&jobs.length)? jobs[0] : null;   // nearest site
    for(var i=0;i<feet.length;i++){
      var hh=household(hash(blockSeed,i+1,0));
      for(var n=0;n<hh;n++){
        // alternate: within a household, later members may use a farther site
        var js=(jobs&&jobs.length)? jobs[hash(blockSeed,i+1,n+13)%jobs.length] : jobSite;
        out.push(makeAgent(blockSeed,i,n,js,fpOf));
      }
    }
    return out;
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
      inHouse:inHouse, outAgents:outAgents
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
    household:household,scheduleFor:scheduleFor,whereAt:whereAt,
    makeAgent:makeAgent,agentsForBlock:agentsForBlock,agentsForPlot:agentsForPlot,
    jobsNear:jobsNear,makeSim:makeSim,FACTION_ASSIGN:FACTION_ASSIGN,hash:hash};
  if(HASREQ) module.exports=API;
  root.BohemiaAgents=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
