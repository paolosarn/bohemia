// BOHEMIA STADIUM (7/20/26). LEISURE, on the DISTRICT KIT. Research-first (stadium site-plan +
// bowl-design guides — Preferred-Seating "Stadium Bowl Design", conceptdraw stadium plan, Wabash
// Valley "How to Design a Sports Stadium", Carroll Engineering): a tiered seating BOWL rings the
// playing FIELD (sightlines converge on the field, the "restricted bowl" pulling the farthest seat
// close); a CONCOURSE runs as a LOOP under/around the stands (8-15m, never a dead end); the FACADE
// wraps the outside with the entry GATES; huge PARKING aprons + highway access surround it; LIGHT
// TOWERS at the corners, a SCOREBOARD over one end. One 96m cell holds the bowl + a parking apron.
// Act-1 DEAD: cracked dead field, faded lines, weeds through the empty stands, a dead scoreboard,
// dark light towers, abandoned cars in the lots, rubble. Street-aware + drivable (the parking apron
// is the car surface, reachable from the curb). Full dossier + layering below.
// LEGEND:
//  0 desert dead-ground          1 parking / drive asphalt (DRIVABLE)
//  2 facade (outer stadium wall)  3 dead weeds / rubble
//  4 dead field turf              5 gate / entrance
//  6 seating / stands (the bowl)  7 concourse (loop under the stands)
//  8 field markings (faded lines) 9 scoreboard / jumbotron
//  11 abandoned car               12 light tower / floodlight mast
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance + main gates at the SOUTH (on the street); the bowl is centered in the cell.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function ell(cx,cy,rx,ry,code){ for(var dy=-ry;dy<=ry;dy++)for(var dx=-rx;dx<=rx;dx++){
      if((dx*dx)/(rx*rx)+(dy*dy)/(ry*ry)<=1 && get(cx+dx,cy+dy)!=null) set(cx+dx,cy+dy,code); } }
    function scatter(x0,y0,x1,y1,onto,code,dens){ for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)),ty=y0+Math.floor(r()*(y1-y0)); if(get(tx,ty)===onto)set(tx,ty,code); } }

    // ---- BASE: a PARKING APRON around the whole parcel, desert only at the very margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,6,W-7,H-7,1);                                                 // the parking/drive apron (a ring once the bowl is drawn)

    // ---- THE BOWL (concentric ellipses, outside -> in): facade, concourse, tiered stands, field
    var cx=W>>1, cy=58, rxA=48, ryA=44;                                    // bowl centered, room for the south entrance
    ell(cx,cy,rxA,ryA,2);                                                  // FACADE (outer wall)
    ell(cx,cy,rxA-2,ryA-2,7);                                              // CONCOURSE loop (under the stands)
    ell(cx,cy,rxA-5,ryA-5,6);                                             // SEATING BOWL (tiered stands)
    // tier walkways: a couple of concentric ellipse outlines inside the stands (the aisle rings)
    for(var tr=10; tr<=18; tr+=8){ for(var a=0;a<360;a+=2){ var rad=a*Math.PI/180;
      var ex=Math.round(cx+Math.cos(rad)*(rxA-tr)), ey=Math.round(cy+Math.sin(rad)*(ryA-tr));
      if(get(ex,ey)===6) set(ex,ey,7); } }
    // radial VOMITORY aisles cutting the stands (entry tunnels from the concourse up to the seats)
    for(i=0;i<12;i++){ var ang=(i/12)*Math.PI*2; for(var t=0.60;t<=0.96;t+=0.01){
      var vx=Math.round(cx+Math.cos(ang)*rxA*t), vy=Math.round(cy+Math.sin(ang)*ryA*t);
      if(get(vx,vy)===6) set(vx,vy,7); } }
    ell(cx,cy,rxA-20,ryA-19,4);                                           // the FIELD (playing surface)

    // ---- FIELD MARKINGS (faded): sidelines, a midline, a center circle ----
    for(x=cx-(rxA-22);x<=cx+(rxA-22);x++) if(get(x,cy)===4) set(x,cy,8);  // midline
    for(var cc=0;cc<360;cc+=3){ var cr=cc*Math.PI/180; var mx=Math.round(cx+Math.cos(cr)*6), my=Math.round(cy+Math.sin(cr)*5); if(get(mx,my)===4)set(mx,my,8); } // center circle
    for(y=cy-(ryA-21);y<=cy+(ryA-21);y+=(2*(ryA-21))){ for(x=cx-(rxA-24);x<=cx+(rxA-24);x++) if(get(x,y)===4)set(x,y,8); } // the two end lines

    // ---- SCOREBOARD over the north end + LIGHT TOWERS at the four corners of the bowl ----
    G.rect(cx-7,cy-ryA+15,cx+7,cy-ryA+18,9);                              // scoreboard/jumbotron over the north stands
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(s){ var lx=cx+s[0]*(rxA-3), ly=cy+s[1]*(ryA-3);
      set(lx,ly,12); set(lx+s[0],ly,12); set(lx,ly+s[1],12); });          // floodlight masts

    // ---- PARKING detail in the apron: stall lines + abandoned cars, weeds/rubble ----
    scatter(8,8,W-8,H-8,1,11,0.006);                                      // abandoned cars in the lots
    scatter(8,8,W-8,H-8,1,3,0.02);                                        // rubble/weeds in the cracked lots
    scatter(cx-rxA+22,cy-ryA+22,cx+rxA-22,cy+ryA-22,4,3,0.03);            // weeds pushing through the dead field

    // ---- ENTRANCE GATES on the SOUTH street (rotated to the real street by the kit) ----
    var gx=cx;
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-7;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3)set(gx+x,y,1); } // drive from the street into the apron
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  // NOTE: stands/scoreboard are NEUTRAL WARM GRAY, never purple (PURPLE RESERVATION LAW —
  // purple is the Amalgamation's alone; the purity gate sweeps).
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#6f665a',3:'#4a4030',4:'#5b6a44',5:'#c79a3f',6:'#6a655c',
    7:'#8f8676',8:'#c9c1aa',9:'#2c2c28',11:'#55555f',12:'#9a9488'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the parcel edge (setback)'},
    1:{name:'parking / drive asphalt',kind:'drive',  act1:'cracked asphalt parking apron + drive lanes ringing the bowl (car-drivable)'},
    2:{name:'facade (outer stadium wall)',kind:'building',act1:'the outer stadium wall — concrete + dead signage, the gates cut through it', enter:'concourse interior: the ring corridor under the stands, ramps up to the seating bowl, boarded concession windows + restrooms'},
    3:{name:'dead weeds / rubble',kind:'tree-dead',  act1:'weeds + spalled concrete rubble through the cracked lots and stands', solid:false},
    4:{name:'dead field turf',    kind:'ground',    act1:'the dead playing field — brown cracked turf, the crown still faintly there'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'a stadium entry gate cut through the facade, amber curb, turnstile husks'},
    6:{name:'seating / stands (the bowl)',kind:'structure',act1:'the tiered seating bowl — rows of dead seats stepping down to the field (the ¾ face is the rake of the stands)'},
    7:{name:'concourse (loop under the stands)',kind:'ground',act1:'the concourse ring + the aisle walkways / vomitory tunnels through the stands'},
    8:{name:'field markings',     kind:'ground',    act1:'faded painted lines — sidelines, midline, the center circle'},
    9:{name:'scoreboard / jumbotron',kind:'structure',act1:'the dead scoreboard over the north end, screen blank + cracked'},
    11:{name:'abandoned car',     kind:'vehicle',    act1:'a car rusting in the lot, dust-caked, tyres flat'},
    12:{name:'light tower / floodlight mast',kind:'structure',act1:'a floodlight mast at a corner of the bowl, lamps dark + shattered'}
  };
  var NOTES={
    summary:'A dead sports stadium — a tiered seating bowl ringing a cracked playing field, a concourse loop under the stands, the facade + entry gates, huge parking aprons, corner light towers and a dead scoreboard.',
    reference:['Stadium site-plan + bowl-design guides (Preferred-Seating "Stadium Bowl Design", conceptdraw stadium plan, Wabash Valley "How to Design a Sports Stadium", Carroll Engineering): the tiered SEATING BOWL rings the FIELD with sightlines converging on it (the "restricted bowl" pulls the farthest seat close); a CONCOURSE runs as a LOOP under/around the stands (8-15m, never a dead end) with vomitory aisles up to the seats; the FACADE wraps the outside with the entry GATES; the site needs big PARKING + highway access; LIGHT TOWERS at the corners, a SCOREBOARD over one end. A full stadium is >100m, so one 96m cell holds the bowl itself + a parking apron.'],
    layout:['A parking APRON rings the whole parcel (desert only at the very margins); the BOWL is centered with room for the south entrance.',
      'The bowl is concentric: the FACADE wall outside, a CONCOURSE loop just inside it, the tiered SEATING stands stepping down (cut by tier walkways + 12 radial vomitory aisles), and the FIELD at the center.',
      'The FIELD carries faded markings (sidelines, a midline, a center circle); a SCOREBOARD hangs over the north end.',
      'LIGHT TOWERS stand at the four corners of the bowl; abandoned cars + rubble + weeds litter the cracked lots and the empty stands.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the main entry gates are on the primary street; the parking apron (code 1) is the drivable ring around the bowl (a car reaches it from the curb in any placement — K.driveReachFromStreet). Foot circulation is the concourse LOOP (7) under the stands with radial vomitories up to the seats; the facade gates (5) are the street->concourse portals. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the parking/drive apron (1, drive), the field (4) + its markings (8), the concourse + aisles (7), desert (0). STRUCTURES (¾ front face, solid): the FACADE wall (2, ENTERABLE -> concourse interior under the stands), the tiered SEATING bowl (6 — its ¾ face is the raked rows stepping to the field; solid mass you climb, not pass through), the SCOREBOARD (9), the LIGHT TOWERS (12, tall masts). PROPS: abandoned cars (11), weeds/rubble (3). PORTALS: the gates (5). The bowl is a big ring of vertical stand-mass around a sunken flat field — you enter through the facade, walk the concourse loop, and come UP a vomitory into the seats overlooking the field.',
    decisions:['Act-1 DEAD: cracked dead field + faded lines, weeds through the empty stands, a blank cracked scoreboard, dark shattered light towers, abandoned cars, spalled-concrete rubble. No living turf, no working lights.',
      'Leisure category (stadium). Zero purple. No team names/logos/colors (Paolo\'s to author if ever) — the facade signage + scoreboard read dead.',
      'ONE cell = the bowl + its apron (a real stadium footprint is >100m); the seating is generic (bowl, not sport-specific) so it serves any event canon Paolo rules later.',
      'Research-first (per the playbook): built from real stadium bowl + concourse + site-plan logic, not memory.']
  };
  K.register('stadium', { generate:generate, body:function(c){return c===2;}, category:'leisure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaStadium=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
