// BOHEMIA RESORT (8/16/26). GAMING/RESORT, on the DISTRICT KIT. Research-first (Las Vegas
// mega-resort site plans — Encore/Wynn, Paris Las Vegas, Circa; SpotlightVegas on mega-resort
// spatial design): the canonical Strip resort is a PODIUM + TOWER. Podium floors 1-4 carry the
// CASINO FLOOR, restaurants, theatre and convention space at grade; the GUEST TOWER stands on the
// podium from floor 5 up and is the whole silhouette. A PORTE COCHERE wraps the tower base and
// feeds the LOBBY off the drive; a decked PARKING GARAGE attaches to one end of the podium. The
// pool deck sits behind, screened from the street by the building rather than by any wall.
// ACT-1 DEAD: doors open, the casino floor dark and stripped, the pool a dry basin, cars left in
// the porte cochere where they were abandoned.
// NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): "no perimeter walls until I tell you, bro no
// fencing no nothing bro." There is no fence, no yard wall, no bollard line and no kerb ring in
// this district. The building IS the edge — which is how a real Strip resort works anyway: the
// podium meets the sidewalk.
// LEGEND:
//  0 sidewalk / apron            1 drive lane (DRIVABLE)
//  2 podium (casino floor)        3 dry planting bed
//  4 podium roof band             5 drive entrance (curb cut — NOT a gate in a fence)
//  6 guest tower                  7 porte cochere canopy (OVERHEAD)
//  8 parking garage deck          9 pole light
//  10 abandoned vehicle          11 drive marking      12 dry pool basin
//  13 lobby doors (PORTAL)        14 tower plant deck   15 casino skylight
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: sidewalk/apron everywhere; the drive is carved in below ----
    G.rect(0,0,W-1,H-1,0);

    // ---- THE PODIUM. Wall to wall across the plot, because that is what a Strip
    //      podium does: it meets the sidewalk on its street frontage and there is
    //      no setback to put a fence in.
    G.rect(8,10,W-9,74,2);
    G.rect(10,12,W-11,20,4);                                            // podium roof band (north)

    // ---- THE GUEST TOWER on the podium: solid mass, the silhouette of the district.
    //      Real Strip tower floorplates are long and thin (a double-loaded corridor with
    //      rooms both sides), so this is 50 m x 30 m of SOLID tower, not a hollow ring —
    //      the plant deck on top is a few small patches, the way a real roof reads.
    G.rect(30,22,96,62,6);
    G.rect(38,26,54,34,14); G.rect(66,26,84,32,14);                     // rooftop plant / cooling deck
    G.rect(44,52,62,58,14); G.rect(74,50,88,58,14);

    // ---- THE PORTE COCHERE + LOBBY, off the south drive ----
    var cx=W>>1;
    G.rect(cx-20,76,cx+20,90,7);                                        // the canopy (OVERHEAD: pass under)
    for(i=-18;i<=18;i+=9) set(cx+i,90,9);                               // canopy columns read as pole lights
    G.rect(cx-6,74,cx+6,75,13);                                         // the lobby doors into the podium

    // ---- THE DRIVE: in off the street, under the canopy, back out. One surface. ----
    G.rect(6,92,W-7,104,1);
    G.rect(cx-20,90,cx+20,92,1);                                        // the porte-cochere lane itself
    G.rect(10,104,14,H-1,1);                                            // the two street connections
    G.rect(W-15,104,W-11,H-1,1);
    for(x=16;x<=W-17;x+=10) set(x,98,11);                               // drive centre dashes
    // THE CURB CUTS are the district's only "gate" — a gap in the kerb where the drive
    // meets the street. No fence, no barrier, nothing to open (Paolo 8/16, LOCKED).
    for(x=10;x<=14;x++) set(x,H-1,5);
    for(x=W-15;x<=W-11;x++) set(x,H-1,5);

    // ---- THE PARKING GARAGE on one end of the podium (open-deck, no wall) ----
    G.rect(W-30,26,W-11,70,8);

    // THE PODIUM ROOF IS NOT A BLANK SLAB. Seen from above a real resort podium is the
    // busiest surface on the site: chiller banks, cooling towers, duct runs and kitchen
    // extract covering most of it, with SKYLIGHTS punched over the casino floor and the
    // atria. Drawn as one flat plate it read as exactly the "they all look the same"
    // Paolo has been calling out, and it gave the hero factory nothing to extrude.
    // RUNS LAST, ON WHAT IS LEFT. Placed before the tower and the garage it painted a
    // plant field across ground those masses then covered, and only the strip of podium
    // west of the tower survived -- so two thirds of the roof went back to being the blank
    // slab this exists to kill. Measured on the grid sheet, not guessed.
    for(y=24;y<=70;y+=7){
      for(x=10;x<=W-11;x+=9){
        if(get(x,y)!==2) continue;
        var pw=2+Math.floor(r()*4), ph=2+Math.floor(r()*3);
        if(r()<0.5) G.rect(x,y,Math.min(x+pw,W-11),Math.min(y+ph,73),4);        // plant
        else if(r()<0.55) G.rect(x,y,Math.min(x+pw+2,W-11),Math.min(y+ph,73),15); // skylight
      }
    }

    // ---- THE POOL DECK behind, screened by the building, not by a fence ----
    G.rect(20,78,cx-26,88,12);                                          // the dry basin
    for(i=0;i<12;i++){ var px=22+Math.floor(r()*(cx-50)), py=79+Math.floor(r()*8);
      if(get(px,py)===12&&r()<0.4) set(px,py,3); }                      // dead planting in the basin

    // ---- dead dressing: cars left in the porte cochere and on the drive ----
    G.rect(cx-12,93,cx-11,97,10); G.rect(cx+9,93,cx+10,97,10);
    G.rect(24,99,25,103,10);
    for(i=0;i<18;i++){ var dx=8+Math.floor(r()*(W-16)), dy=92+Math.floor(r()*12);
      if(get(dx,dy)===1&&r()<0.35) set(dx,dy,3); }                      // drift in the dead drive
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:0, pedOver:soft, pedInset:10});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* ONE MASS, ONE FOOTPRINT. footprints() takes connected components, so asking it
         for (podium OR tower OR garage) in one pass returned ONE bounding box swallowing
         the whole plot -- and under the INTERIOR-MATCHES-EXTERIOR LAW that would have
         built a single 84x49 m interior instead of three real volumes. Each mass carries
         its OWN roof code so the roof never cuts its body in half. */
      footprints:K.footprints(g,function(v){return v===2||v===4||v===15;})
        .concat(K.footprints(g,function(v){return v===6||v===14;}))
        .concat(K.footprints(g,function(v){return v===8;}))};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* THE MASSES HAVE TO READ APART. Measured on the grid sheet: podium #6d6455 against
     tower #7b7263 is a 6% value step, so a 50 m tower standing on a 84 m podium vanished
     into it and the whole district read as one tan slab. It is also wrong on its own
     terms — 45 DEGREE ART LAW: the TALLEST thing catches the most sky and is the LIGHTEST,
     the deck tucked at grade is the darkest. Ordered by height, not by taste. */
  var PALETTE={0:'#514c44',1:'#3f3d38',2:'#6d6455',3:'#4a4030',4:'#8d8372',5:'#c2a86a',6:'#9a9184',
    7:'#8a8172',8:'#4e4a44',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#4a5560',13:'#2e2a24',
    14:'#c0b6a0',15:'#d2cfbe'};
  var LEGEND={
    0:{name:'sidewalk / apron',   kind:'ground',    act1:'the wide resort sidewalk, cracked, sand drifted along the podium wall'},
    1:{name:'drive lane',         kind:'drive',      act1:'the arrival drive in off the street and back out (car-drivable)'},
    2:{name:'podium (casino floor)',kind:'building', act1:'the podium: four storeys of casino floor, restaurants and back of house, glass out at grade', enter:'the casino floor: dark, stripped, carpet lifting, banks of dead machines pushed into rows'},
    3:{name:'dry planting bed',   kind:'tree-dead',  act1:'a planting bed gone to dust and dead palm stumps', solid:false},
    4:{name:'podium roof band',   kind:'structure',  act1:'the podium roof band along the back of the casino floor, ducting and dead fans standing on it'},
    5:{name:'drive entrance',     kind:'gate',       act1:'the curb cut where the arrival drive meets the street — a gap in the kerb, nothing to open, no fence either side', solid:false},
    6:{name:'guest tower',        kind:'building',   act1:'the guest tower standing on the podium, window bands blown in places', enter:'a guest corridor: doors ajar down both sides, carpet, no light'},
    7:{name:'porte cochere canopy',kind:'overhead',  act1:'the arrival canopy on columns — you walk and drive UNDER it', solid:false},
    8:{name:'parking garage deck',kind:'building',   act1:'the open-deck parking structure on the end of the podium', enter:'a parking deck: cars left in the bays, ramp down into the dark'},
    9:{name:'pole light',         kind:'prop',       act1:'a canopy column / drive pole light, head dark'},
    10:{name:'abandoned vehicle', kind:'vehicle',    act1:'a car left under the canopy where it was abandoned, doors open'},
    11:{name:'drive marking',     kind:'marking',    act1:'faded arrival-drive centre dashes'},
    12:{name:'dry pool basin',    kind:'ground',     act1:'the pool deck: a dry basin, tiles crazed, silt and dead planting in the bottom', solid:false},
    13:{name:'lobby doors',       kind:'portal',     act1:'the lobby doors under the canopy, one leaf standing open', solid:false},
    14:{name:'tower plant deck',  kind:'structure',  act1:'the cooling plant standing on the tower roof, fan housings open to the sky'},
    15:{name:'casino skylight',   kind:'structure',  act1:'a skylight punched through the podium roof over the casino floor, half the glazing starred and one panel gone through'}
  };
  var NOTES={
    summary:'A dead Las Vegas mega-resort — a four-storey podium carrying the casino floor wall-to-wall on the plot, a guest tower standing on it, a porte cochere you walk and drive under into the lobby, an open-deck parking garage on one end, and a dry pool basin behind. Nothing fences it: the building is the edge.',
    reference:['Las Vegas mega-resort site plans (Encore/Wynn, Paris Las Vegas, Circa; SpotlightVegas on mega-resort spatial design): the canonical form is PODIUM + TOWER. Podium floors 1-4 carry the casino floor, restaurants, theatre and convention space at grade; the GUEST TOWER stands on the podium from floor 5 up and is the whole silhouette. A PORTE COCHERE wraps the tower base and feeds the lobby off the arrival drive; a decked PARKING GARAGE attaches to one end of the podium.'],
    layout:['The PODIUM runs wall-to-wall across the plot and meets the sidewalk on its frontage — a Strip podium has no setback, which is also why it needs no fence.',
      'The GUEST TOWER stands on the podium, set back from the podium edge, and is the tallest thing in the district.',
      'The PORTE COCHERE is a canopy on columns over the arrival lane; the LOBBY DOORS open off it into the podium.',
      'The PARKING GARAGE is an open deck on one end of the podium. The POOL DECK sits behind the building, screened by the building itself.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the lobby/porte cochere is on the primary street. The arrival DRIVE (code 1) is one connected car surface entering off the street, passing under the canopy at the lobby and returning to the street (K.driveReachFromStreet). Pedestrians walk the sidewalk (0) straight onto the podium frontage; the canopy (7) is OVERHEAD, so you pass under it on foot or in a car.',
    layering:'GROUND plane (flat): the sidewalk/apron (0), the arrival drive (1) + markings (11) + the curb cuts (5), the dry pool basin (12). STRUCTURES (¾ front face, solid): the PODIUM (2, ENTERABLE -> the casino floor), the GUEST TOWER (6, ENTERABLE -> a guest corridor), the PARKING GARAGE deck (8, ENTERABLE), the roof/plant decks (4, 14) and the SKYLIGHTS (15). OVERHEAD (pass under): the porte cochere canopy (7). PORTALS: the lobby doors (13). PROPS: pole lights / canopy columns (9), abandoned vehicles (10), dead planting (3). The tower is the vertical mass and the podium is the plinth; you walk under the canopy and in through the lobby.',
    decisions:['NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): no fence, no perimeter wall, no bollard line, no kerb ring. The podium meeting the sidewalk is the edge, which is what the real building does.',
      'Act-1 DEAD: casino floor dark and stripped, lobby door standing open, pool a dry basin, cars abandoned under the canopy, drift in the drive.',
      'Gaming/resort category. Zero purple. NO FACTION, NO OWNER, NO NAME anywhere — who holds the Strip is Paolo\'s to rule (MECHANISM-MINE / CONTENTS-PAOLO\'S).',
      'The podium, the tower and the garage are all ENTERABLE, so the interior/zoom phase has three real volumes to open rather than a facade.',
      'Research-first (per the playbook): built from real Las Vegas resort site plans, not from memory of what a casino looks like.']
  };
  K.register('resort', { generate:generate, body:function(c){return c===2||c===4||c===6||c===8||c===14||c===15;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaResort=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
