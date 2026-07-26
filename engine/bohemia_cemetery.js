// BOHEMIA CEMETERY (7/19/26). CIVIC, on the DISTRICT KIT. A memorial-park cemetery — research
// (Rome Monument, EDA Land Planning, TCLF, VA NCA): a rectilinear grid of grave SECTIONS on
// park-like lawn, roads maximizing graveside access while minimizing paving, a chapel + office
// + maintenance yard, a mausoleum + a columbarium (cremation) garden, central water/statuary as
// section identifiers, tree-defined outdoor rooms, visual terminuses (mausoleum one end, chapel
// the other). Street-aware + drivable (you drive through a cemetery), EXPLAIN-EVERY-TILE, act-1
// DEAD (dead-brown lawn, bare dead trees, weathered stone, empty fountain — a cemetery in the
// apocalypse). Full dossier + layering below.
// LEGEND:
//  0 dead-ground   1 memorial drive   2 building(chapel/office/shed)  3 dead tree
//  4 memorial lawn 5 gate             6 headstone                     7 mausoleum(crypt)
//  8 columbarium wall  9 dead fountain/pond  10 walking path  11 monument(obelisk)
//  12 parked car   13 site furniture(bench)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function clump(cx,cy,rad,n,code,over){ over=over||function(c){return c===4;};
      for(var k=0;k<n;k++){ var a=r()*6.283,d=Math.sqrt(r())*rad,tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d);
        if(over(G.get(tx,ty))){ G.set(tx,ty,code); } } }
    function bench(x,y){ if(G.get(x,y)===4||G.get(x,y)===10) G.set(x,y,13); }

    // ---- base: dead memorial lawn to a 1-tile setback edge ----
    G.rect(2,2,W-3,H-3,4);

    // ---- memorial-drive LOOP + a grid of cross drives (graveside access) ----
    var rd=1;
    G.rect(9,10,W-10,12,rd); G.rect(9,H-13,W-10,H-11,rd);              // top + bottom loop
    G.rect(9,10,11,H-11,rd); G.rect(W-12,10,W-10,H-11,rd);            // left + right loop
    [37,64,91].forEach(function(cx){ G.rect(cx-1,12,cx+1,H-13,rd); }); // vertical section drives
    [37,91].forEach(function(cy){ G.rect(11,cy-1,W-12,cy+1,rd); });    // horizontal section drives

    // ---- CHAPEL + OFFICE + PARKING by the entrance (bottom-center) ----
    G.rect(44,96,60,110,2); G.rect(62,100,74,110,2);                  // chapel + office
    G.rect(24,96,42,112,1);                                           // parking lot (drive surface)
    G.rect(31,111,35,117,1);                                          // driveway tying the lot to the bottom loop
    for(y=98;y<110;y+=4)for(x=26;x<41;x+=3){ if(r()<0.6)G.rect(x,y,x+1,y+2,12); } // parked cars

    // ---- MAUSOLEUM: the visual terminus at the far (north) end ----
    G.rect(50,14,78,30,7);

    // ---- COLUMBARIUM cremation garden (NE quadrant) ----
    G.rect(96,42,113,44,8); G.rect(96,42,98,60,8);                    // an L of niche wall
    G.disc(105,52,4,9); G.set(105,52,11);                            // reflecting pool + a monument
    bench(100,48); bench(110,56);

    // ---- central FOUNTAIN + MONUMENT plaza — a ROUNDABOUT so the cross drives stay connected ----
    G.disc(64,64,9,1);                                                // road roundabout ring (keeps the 4 drive arms joined)
    G.disc(64,64,6,10); G.disc(64,64,3,9); G.set(64,64,11);          // plaza path + dead fountain + obelisk
    for(i=0;i<8;i++){ var a=i/8*6.283; bench(Math.round(64+Math.cos(a)*5),Math.round(64+Math.sin(a)*5)); }

    // ---- MAINTENANCE shed + yard (NW back corner) ----
    G.rect(15,16,25,24,2); for(x=27;x<34;x+=3){ if(r()<0.7)G.rect(x,18,x+1,20,12); }

    // ---- dead memorial TREES lining the drives + clumps in the corners ----
    for(y=16;y<H-16;y+=8){ if(G.get(13,y)===4)G.set(13,y,3); if(G.get(W-14,y)===4)G.set(W-14,y,3); }
    for(x=16;x<W-16;x+=8){ if(G.get(x,14)===4)G.set(x,14,3); if(G.get(x,H-15)===4)G.set(x,H-15,3); }
    clump(100,100,10,20,3); clump(28,60,8,14,3); clump(64,40,7,12,3);

    // ---- ENTRANCE walk paths from the plaza + a couple of section paths ----
    for(y=64;y<=95;y++){ if(G.get(64,y)===4)G.set(64,y,10); }         // plaza -> chapel walk
    for(x=44;x<=63;x++){ if(G.get(x,64)===4)G.set(x,64,10); }

    // ---- ROWS OF HEADSTONES fill every section (lawn border left along the drives) ----
    function nearFeature(x,y){ for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++){ var c=G.get(x+dx,y+dy);
      if(c===1||c===2||c===7||c===8||c===9||c===10||c===12)return true; } return false; }
    for(y=6;y<H-6;y++)for(x=6;x<W-6;x++){ if(G.get(x,y)!==4)continue; if(!(x%2===0&&y%3===0))continue;
      if(!nearFeature(x,y)) G.set(x,y,6); }

    // ---- monumental ENTRANCE GATE on the SOUTH street (rotated to the real street by the kit) ----
    var gx=Math.round(W*0.5);
    for(i=-3;i<=3;i++)G.set(gx+i,H-1,5);
    for(y=H-1;y>=H-13;y--) for(x=-2;x<=2;x++){ var c=G.get(gx+x,y); if(c===4||c===6||c===3||c===0)G.set(gx+x,y,1); } // entrance drive to the bottom loop (punches to the edge)
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===4||c===6||c===3||c===0; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:10, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===7;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={1:'#4a4640',2:'#8a8478',3:'#4a4030',4:'#5a4f38',5:'#c79a3f',6:'#9a9488',7:'#9a938a',
    8:'#8f8a80',9:'#3a4a52',10:'#6a6a70',11:'#b0a89a',12:'#55555f',13:'#8f8676'};
  var LEGEND={
    0:{name:'dead-ground',        kind:'ground',    act1:'bare cracked dirt (setback / bare gaps)'},
    1:{name:'memorial drive',     kind:'drive',      act1:'cracked narrow asphalt cemetery lane (car-drivable, graveside access)'},
    2:{name:'building (chapel/office/shed)',kind:'building',act1:'weathered stone/stucco funeral chapel, office, or maintenance shed', enter:'chapel interior: a small nave + a viewing room; office rooms; the shed is one bay'},
    3:{name:'dead tree',          kind:'tree-dead', act1:'bare leafless memorial tree, grey bark'},
    4:{name:'memorial lawn',      kind:'turf-dead', act1:'dead brown memorial lawn, dry thatch between the plots'},
    5:{name:'gate',               kind:'gate',       act1:'monumental cemetery entrance gate/arch off the street, amber curb'},
    6:{name:'headstone',          kind:'prop',       act1:'weathered granite grave marker, lichen-stained, some leaning (blank — no names)', solid:true},
    7:{name:'mausoleum',          kind:'building',   act1:'pale-stone family/community crypt building, columns, dim', enter:'CRYPT INTERIOR: a dim central aisle flanked by walls of vaults — the solid stone block outside becomes the vault hall inside'},
    8:{name:'columbarium wall',   kind:'structure',  act1:'stone niche wall (cremation), rows of small plaques, weathered'},
    9:{name:'dead fountain / pond',kind:'water-dead',act1:'empty dry fountain basin / reflecting pool, cracked, stained'},
    10:{name:'walking path',      kind:'walk',       act1:'cracked concrete memorial path between sections'},
    11:{name:'monument (obelisk)',kind:'structure',  act1:'stone obelisk / memorial statue, weathered (has height, not enterable)'},
    12:{name:'parked car',        kind:'vehicle',    act1:'abandoned dust-caked car (hearse / visitor)'},
    13:{name:'site furniture',    kind:'prop',       act1:'weathered memorial bench / urn planter'}
  };
  var NOTES={
    summary:'A memorial-park cemetery — a rectilinear grid of grave sections on dead memorial lawn, laced by drives for graveside access, with a chapel, a mausoleum terminus, a columbarium cremation garden, and a central fountain-and-monument plaza.',
    reference:['Cemetery / memorial-park design guides (Rome Monument, EDA Land Planning, TCLF, VA National Cemetery Administration): sections/gardens of plots; roads maximizing graveside access while minimizing paving; a chapel + office + maintenance yard; a mausoleum + a columbarium (max ~5 niches high) for cremation; central water features/statuary as section identifiers; park-like lawns with rows of markers; tree-defined outdoor rooms; visual terminuses (mausoleum one end, chapel the other)'],
    layout:['A perimeter memorial-drive LOOP + a grid of cross drives divide the grounds into grave SECTIONS (maximizes graveside access, minimizes paving).',
      'Each section is dead memorial lawn filled with neat ROWS OF HEADSTONES, a lawn border left along every drive for access.',
      'A CHAPEL + office + parking sit by the entrance; a large MAUSOLEUM is the visual terminus at the far end.',
      'A COLUMBARIUM niche wall in a cremation garden (a reflecting pool + a monument + benches) forms one quadrant.',
      'A central FOUNTAIN + OBELISK plaza marks the main crossroads; dead memorial trees line the drives; a maintenance shed sits in a back corner.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a monumental entrance gate off the primary street feeds the drive loop. You DRIVE through a cemetery, so the memorial drives (code 1) are the car network, reachable from the gate in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane: the memorial drives, the dead lawn, walking paths, the empty fountain basin (flat, walk/drive). STRUCTURES (¾ front face, solid): the chapel/office/shed (2, ENTERABLE), the MAUSOLEUM (7, ENTERABLE -> a dim crypt of wall vaults — the solid stone block outside becomes the vault hall inside), the columbarium wall (8), the obelisk monument (11, height, not enterable). PROPS (solid, you weave BETWEEN them): the HEADSTONES (6 — thousands of small markers in rows define the graveside occupancy), dead trees (3), parked cars (12), benches (13). Key layering: the mausoleum is the one real interior; everything else is an outdoor grid you thread on foot or by car.',
    decisions:['Act-1 DEAD: dead-brown memorial lawn, bare dead trees, weathered/stained stone, empty fountain — a cemetery in the apocalypse. No living vegetation.',
      'RECTILINEAR by design (unlike the organic park): real cemeteries are a grid of sections to maximize graveside road access — the grid is correct here, NOT fake geometry.',
      'Civic category. Zero purple. Headstones are blank markers — no names/canon on them (Paolo\'s to author if ever).']
  };
  K.register('cemetery', { generate:generate, body:function(c){return c===2||c===7;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCemetery=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
