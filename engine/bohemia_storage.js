// BOHEMIA SELF-STORAGE (7/20/26). INDUSTRIAL, on the DISTRICT KIT. Research-first (self-storage
// site-plan guides — Inside Self-Storage layout guidelines, SteelCo building plans, ZP Architects,
// Mini Storage Outlet): rows of drive-up UNIT buildings (30-40ft wide) with ROLL-UP DOORS facing
// 30ft DRIVE AISLES (a car reaches every unit); a single GATE with a keypad + an OFFICE on the
// public side; the "FORTRESS" configuration runs single-loaded buildings along the perimeter so
// they double as the security FENCE. Act-1 DEAD + LOOTED: doors pried up, units ransacked + empty,
// debris drifted in the aisles, a dead keypad, an abandoned car. Street-aware + drivable (the drive
// aisles are the car surface, reaching every unit door from the gate). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground          1 drive aisle (DRIVABLE)
//  2 storage-unit building        3 debris / tumbleweed
//  4 unit roof ridge              5 gate / keypad
//  6 roll-up door (closed)        7 looted / open unit (ransacked)
//  8 perimeter fence              9 pole light
//  10 abandoned vehicle          11 aisle marking / curb   12 office
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a UNIT BUILDING: a long bar with a roof ridge + a row of roll-up doors on each long face,
    // some pried open + ransacked (dead-world). Doors face the aisles above + below.
    function unitBar(x0,x1,y0,y1){
      G.rect(x0,y0,x1,y1,2);                                             // the building body
      for(x=x0;x<=x1;x++) set(x,(y0+y1)>>1,4);                           // roof ridge line
      for(x=x0+1;x<x1-1;x+=4){                                           // roll-up doors, both faces
        var topOpen=r()<0.4, botOpen=r()<0.4;
        set(x,y0,topOpen?7:6); set(x+1,y0,topOpen?7:6);
        set(x,y1,botOpen?7:6); set(x+1,y1,botOpen?7:6);
        if(topOpen){ set(x,y0-1,7); }                                    // ransacked spill into the aisle
        if(botOpen){ set(x,y1+1,7); }
      }
    }

    // ---- BASE: the site is DRIVE AISLE (a car reaches every door); desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,8,W-7,H-7,1);

    // ---- FORTRESS PERIMETER: single-loaded unit buildings ring the site (double as the fence) ----
    G.frame(8);                                                          // outer security fence line
    unitBar(10,117,10,17);                                               // north perimeter units
    unitBar(10,117,111,118);                                            // south perimeter units (behind the office row)
    // ---- INTERIOR ROWS: double-loaded unit bars with 30ft-ish drive aisles between ----
    unitBar(12,115,34,41);
    unitBar(12,115,58,65);
    unitBar(12,115,82,89);

    // ---- OFFICE on the public side of the gate (beside the entrance lane, not across it) ----
    G.rect(80,100,104,109,12);
    G.rect(78,99,106,99,4);                                             // office roof line

    // ---- aisle markings, pole lights, an abandoned car, drifted debris ----
    for(x=16;x<=112;x+=8){ set(x,25,11); set(x,49,11); set(x,73,11); set(x,97,11); } // aisle centre dots
    [[10,24],[116,24],[10,72],[116,72],[10,100],[116,100]].forEach(function(p){ set(p[0],p[1],9); }); // pole lights
    G.rect(30,96,31,101,10); G.rect(96,50,97,55,10);                     // abandoned cars in the aisles
    for(i=0;i<34;i++){ var dx=8+Math.floor(r()*(W-16)), dy=10+Math.floor(r()*(H-20)); if(get(dx,dy)===1&&r()<0.5)set(dx,dy,3); } // debris drifted in the aisles

    // ---- ENTRANCE GATE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    G.rect(gx-2,96,gx+2,H-1,1);                                          // carve the entrance drive straight through the south units + fence
    set(gx-3,110,11); set(gx+3,110,11);                                 // the keypad posts flanking the inner lane
    for(i=-3;i<=3;i++) set(gx+i,H-1,5);                                 // street gate (on the edge only)
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===12;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#7a6f5c',3:'#4a4030',4:'#8a8078',5:'#c79a3f',6:'#b06a3a',
    7:'#241f1a',8:'#6a6a72',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#6f665a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'drive aisle',        kind:'drive',      act1:'the cracked drive aisle between the unit rows — a car reaches every door (car-drivable)'},
    2:{name:'storage-unit building',kind:'building', act1:'a row of drive-up storage units, corrugated steel, sun-faded + dented', enter:'unit interior: a single roll-up bay — bare shelving, a few ransacked boxes, dust'},
    3:{name:'debris / tumbleweed',kind:'tree-dead',  act1:'debris + tumbleweed + dumped junk drifted in the aisles', solid:false},
    4:{name:'unit roof ridge',    kind:'structure',  act1:'the corrugated roof ridge running the length of a unit row'},
    5:{name:'gate / keypad',      kind:'gate',       act1:'the security gate + dead keypad — the street gate and the inner keypad gate, both hanging'},
    6:{name:'roll-up door (closed)',kind:'structure',act1:'a closed roll-up door, orange paint faded, padlock rusted', solid:true},
    7:{name:'looted / open unit', kind:'portal',     act1:'a pried-open unit — door jammed up, the bay ransacked + empty, dark inside', solid:false},
    8:{name:'perimeter fence',    kind:'structure',  act1:'the security fence ringing the site (the fortress perimeter), wire sagging', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'an aisle pole light, head dark'},
    10:{name:'abandoned vehicle', kind:'vehicle',    act1:'a car abandoned in an aisle, tyres flat, dust-caked'},
    11:{name:'aisle marking / curb',kind:'marking',  act1:'faded aisle centre-line / curb paint'},
    12:{name:'office',            kind:'building',    act1:'the storage office on the public side of the gate, window smashed, ledger gone', enter:'office interior: the counter + a wall of gate-code files, a back room'}
  };
  var NOTES={
    summary:'A dead, looted self-storage facility — rows of drive-up unit buildings with roll-up doors (many pried open + ransacked) facing drive aisles, a fortress perimeter that doubles as the fence, a gate + keypad, an office, debris drifted through the aisles.',
    reference:['Self-storage site-plan guides (Inside Self-Storage layout guidelines, SteelCo building plans, ZP Architects, Mini Storage Outlet): rows of drive-up UNIT buildings (30-40ft wide) with ROLL-UP DOORS facing ~30ft DRIVE AISLES so a car reaches every unit; a single GATE with a keypad set back from the entrance + an OFFICE on the public side; the FORTRESS configuration runs single-loaded buildings along the perimeter setbacks so they double as security fencing.'],
    layout:['The site is a grid of DRIVE AISLES (desert outside the fence); a security FENCE rings it (with single-loaded perimeter unit rows — the fortress config).',
      'Interior UNIT rows run across the site — long buildings with a roof ridge and roll-up DOORS on both faces; many doors are pried OPEN, the units ransacked + empty, spill in the aisle.',
      'A single GATE (street gate + an inner keypad gate) enters past the OFFICE on the public side.',
      'Aisle markings, pole lights, an abandoned car, and drifted debris fill the dead aisles.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street; the DRIVE AISLES (code 1) are one connected drivable grid reaching every unit door from the gate in any placement (K.driveReachFromStreet). The office sits on the public side of the gate. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive, flat): the drive aisles (1) + markings (11), desert (0). STRUCTURES (¾ front face, solid): the storage-unit buildings (2, ENTERABLE -> a single roll-up bay interior) with their roof ridge (4) and roll-up DOORS (6, closed, solid), the perimeter FENCE (8), the OFFICE (12, ENTERABLE). PORTALS: the gate/keypad (5) and every LOOTED OPEN unit (7 — a pried-up door you step INTO the ransacked bay). PROPS: pole lights (9), abandoned vehicles (10), debris (3). The unit rows are the vertical mass; you drive the aisles and step into whichever bay stands open.',
    decisions:['Act-1 DEAD + LOOTED: ~40% of doors pried open, units ransacked + empty, spill in the aisles, a dead keypad, debris drifted, an abandoned car. The looting tells the collapse story (this is where people cached what they lost).',
      'Industrial category (storage). Zero purple. No unit contents (Paolo\'s + the loot economy\'s to author) — the open bays read empty/ransacked.',
      'Fortress perimeter config honored (perimeter buildings double as the fence) per the site-plan security guidance.',
      'Every looted unit is a PORTAL (step into the bay) — hooks the zoom/interior + loot systems later.',
      'Research-first (per the playbook): built from real self-storage site plans, not memory.']
  };
  K.register('storage', { generate:generate, body:function(c){return c===2||c===12;}, category:'industrial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaStorage=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
