// BOHEMIA SWAP MEET (7/20/26). COMMERCIAL, on the DISTRICT KIT. Research-first (flea-market / swap-
// meet site guides — Wikipedia flea market, San Fernando + Florida swap-meet layouts, booth-layout
// guides): broad PAVED/DIRT AISLES stretch in rows lined with CANOPY-covered vendor STALLS (rows
// often color-coded so shoppers navigate); a food court / market hall; a big PARKING lot; entrance
// gates with a map kiosk. Big meets reach ~1,000 vendor spaces on many acres. In Bohemia the swap
// meet is where the BARTER ECONOMY lives, so a dead one is loaded: torn faded tents, knocked-over
// tables, junk piles, an abandoned car, a dead market sign. Street-aware + drivable (you park, then
// walk the aisles). Full dossier + layering (the tents are the OVERHEAD pass-under layer).
// LEGEND:
//  0 desert dead-ground          1 gravel parking / drive (DRIVABLE)
//  2 building (food hall / office) 3 junk / debris pile
//  4 stall canopy / tent (OVERHEAD) 5 gate / entrance
//  6 vendor stall / table         7 market aisle (packed-dirt walkway)
//  8 market pylon sign            9 pole light
//  10 abandoned car              11 parking marking   12 map kiosk / dead planter
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: the market grounds are packed-dirt AISLE; desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,7,W-6,H-6,7);

    // ---- MARKET HALL / food court at the back-left; a couple of solid vendor sheds ----
    G.rect(10,10,44,22,2);

    // ---- the MARKET: rows of INDIVIDUAL PEAKED TENTS with open sky/dirt between them (so it reads
    // unmistakably OUTDOOR / al-fresco, not an indoor hall), color-coded per row (bleached white /
    // faded red / faded teal — markets navigate by tent color), corner poles + a peaked ridge, some
    // collapsed ----
    var TENT=[4,13,14], rowi=0;
    for(var ry=16; ry<=74; ry+=14){
      var tc=TENT[rowi%3]; rowi++;
      for(var tx=12; tx<=106; tx+=13){
        if(r()<0.16){ set(tx+5,ry+3,3); set(tx+3,ry+5,3); continue; }    // a collapsed / looted tent -> open gap
        G.rect(tx,ry,tx+10,ry+7,tc);                                     // the tent canopy
        set(tx,ry,6); set(tx+10,ry,6); set(tx,ry+7,6); set(tx+10,ry+7,6);// the corner tent POLES
        for(var py=ry;py<=ry+7;py++) set(tx+5,py,10);                    // the peaked RIDGE line (reads as a tent roof from above)
        set(tx+3,ry+3,6); set(tx+7,ry+3,6); set(tx+3,ry+5,6); set(tx+7,ry+5,6); // vendor tables under the tent
      }
    }

    // ---- PARKING lot across the front (south), gravel, with stalls + a drive aisle ----
    G.rect(8,90,120,120,1);
    for(y=94;y<=116;y+=8){ for(x=14;x<=116;x+=5){ set(x,y,11); set(x,y+1,11); } }  // parking stall rows
    G.rect(8,100,120,104,1);                                             // a clear drive aisle through the lot

    // ---- MARKET SIGN pylon + map kiosk at the entrance; pole lights; junk + an abandoned car ----
    G.rect(14,110,17,120,8);                                             // market pylon sign at the street
    G.rect(96,84,104,88,12);                                            // map kiosk at the market mouth
    [[12,86],[116,86],[12,120],[116,120],[64,88]].forEach(function(p){ set(p[0],p[1],9); }); // pole lights
    G.rect(70,96,72,101,10); G.rect(88,110,90,115,10);                   // abandoned cars in the lot
    for(i=0;i<26;i++){ var jx=8+Math.floor(r()*(W-16)), jy=80+Math.floor(r()*10); if(get(jx,jy)===7)set(jx,jy,3); } // junk drifted at the market mouth

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-8;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===7)set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===7; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:7, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#5f5a4e',2:'#6a5f50',3:'#4a4030',4:'#b0a690',5:'#c79a3f',6:'#7a5a44',
    7:'#6f6656',8:'#b0863a',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#55603a',13:'#a86a4a',14:'#5f7a72'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the market edge (setback)'},
    1:{name:'gravel parking / drive',kind:'drive',   act1:'the gravel parking lot + drive aisle (car-drivable — you park, then walk the market)'},
    2:{name:'building (food hall / office)',kind:'building',act1:'the market hall / food court + office, roll doors seized, signage dead', enter:'market-hall interior: permanent indoor stalls + a food-court counter up front, storage behind'},
    3:{name:'junk / debris pile',kind:'tree-dead',   act1:'a knocked-over stall / a pile of picked-over junk + torn tarp', solid:false},
    4:{name:'stall canopy / tent',kind:'overhead',   act1:'a vendor canopy / tent over a stall row — fabric bleached + torn, poles leaning (you walk UNDER it)'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the market entrance off the street, amber curb, turnstile husks'},
    6:{name:'vendor stall / table',kind:'prop',      act1:'a vendor table / stall stand, goods long gone, some tipped', solid:true},
    7:{name:'market aisle (packed-dirt walkway)',kind:'ground',act1:'the packed-dirt market aisle between the stall rows — the walkable grid'},
    8:{name:'market pylon sign', kind:'structure',   act1:'the market sign at the street, letters gone, board cracked'},
    9:{name:'pole light',         kind:'prop',       act1:'a market pole light, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car left in the gravel lot, tyres flat, dust-caked'},
    11:{name:'parking marking',   kind:'marking',    act1:'faded stall paint / row markers in the gravel lot'},
    12:{name:'map kiosk / dead planter',kind:'prop', act1:'the you-are-here map kiosk / a dead planter at the market mouth', solid:false},
    13:{name:'stall canopy / tent (red)',kind:'overhead',act1:'a faded red vendor canopy over a stall row — the market navigated by tent color (you walk UNDER it)'},
    14:{name:'stall canopy / tent (teal)',kind:'overhead',act1:'a faded teal vendor canopy over a stall row — the market navigated by tent color (you walk UNDER it)'}
  };
  var NOTES={
    summary:'A dead swap meet / flea market — rows of torn canopy-covered vendor stalls on packed-dirt aisles, a market hall / food court, a gravel parking lot, a dead market sign, junk drifted through the abandoned booths. In Bohemia this is where the barter economy lived.',
    reference:['Flea-market / swap-meet site guides (Wikipedia flea market, San Fernando + Florida swap-meet layouts, booth-layout guides): broad AISLES run in rows lined with CANOPY-covered vendor STALLS (rows often color-coded so shoppers navigate; a map at the entrance); a permanent indoor market hall + FOOD COURT; a big PARKING lot; big meets reach ~1,000 vendor spaces across many acres.'],
    layout:['The market grounds are packed-dirt AISLE (desert at the margins); a MARKET HALL / food court sits back-left.',
      'The MARKET is rows of CANOPY-covered stalls (overhead tents) with vendor tables under them, separated by the packed-dirt aisles — the shopper grid; some stalls are collapsed to junk, the canopies torn.',
      'A gravel PARKING lot spans the front (south) with stall rows + a clear drive aisle; you park here and walk in.',
      'A market PYLON sign + a map kiosk mark the entrance; pole lights ring the mouth; junk + an abandoned car litter the dead lot.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entrance is on the primary street; the gravel PARKING + drive (code 1) is the drivable surface reachable from the curb (you park, then WALK) in any placement (K.driveReachFromStreet). Foot circulation is the packed-dirt AISLE grid (7) between the stall rows. Corner side streets get a pedestrian gate onto the aisles.',
    layering:'GROUND plane (walk/drive, flat): the market aisle (7, walk), the gravel parking/drive (1, drive) + its markings (11), desert (0). OVERHEAD (drawn ABOVE, you pass UNDER it): the stall CANOPIES / tents (4) — fabric over the stall rows, the aisle runs under them. STRUCTURES (¾ front face, solid, ENTERABLE): the market hall / food court (2 -> indoor stalls + food-court interior); the market PYLON sign (8). PROPS (solid, weave between): the vendor tables/stalls (6), pole lights (9), the map kiosk (12), abandoned cars (10), junk piles (3). PORTALS: the gate (5). The tents are what you walk UNDER; the hall is what you go INTO; the stalls you weave between.',
    decisions:['Act-1 DEAD: torn bleached tents, knocked-over + looted stalls (some collapsed to junk), a dead market sign, an abandoned car, junk drifted through the booths. Empty of goods + people (LIFE + the barter economy reactivate it later — this district gives them the STAGE).',
      'Commercial category (swapmeet). Zero purple. No vendor brands/goods (Paolo\'s + the economy\'s to author) — the stalls read empty.',
      'The barter economy hook: this is the canonical swap-meet stage the LIFE/ECONOMY systems can populate with traders.',
      'Uses the OVERHEAD layer for the tents (walk under) — the aisle stays walkable beneath.',
      'Research-first (per the playbook): built from real swap-meet / flea-market site layouts, not memory.']
  };
  K.register('swapmeet', { generate:generate, body:function(c){return c===2;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSwapmeet=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
