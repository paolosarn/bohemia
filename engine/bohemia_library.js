// BOHEMIA LIBRARY (7/21/26; REBUILT 8/2/26). CIVIC, on the DISTRICT KIT.
//
// REBUILT TWICE, and the second rebuild is the one that matters. The original was a
// generic columned-stone central library off library-programme guides — a building from
// a different country and a different century, standing in the Mojave. It is replaced by
// THE REAL ONE THIS VALLEY HAS: Antoine Predock's LAS VEGAS LIBRARY AND LIED DISCOVERY
// MUSEUM (1986-90, 833 Las Vegas Blvd N, across from Cashman Field) — a sandstone DRUM
// under an oculus, a giant concrete TOWER, a museum wing and a long low reading wing, in
// Predock's own words coloured by the fact that "the color scheme is provided by the
// desert." One landmark, four parts.
//
// THEN Paolo scored that rebuild 22%: "There's like six different buildings of the
// library. What's up with that?" ARTICULATION IS NOT FRAGMENTATION — see the note over
// buildCanonical. It is ONE building now, and every part shares a wall with another.
//
// A library is BUILDING-dominant (the point is the building), so the plot is nearly all
// structure + plaza (WALKABLE-LAND LAW, easily). Act-1 DEAD: the oculus glazing gone, the
// clerestory mostly sky, the fountain basin dry, one plant unit stripped for its copper.
// Street-aware + drivable via a kerb cut to a small lot. Full dossier + layering.
// LEGEND:
//  0 desert dead-ground     1 drive / lot (DRIVABLE)   2 library / museum (the ONE building)
//  3 dead tree              4 forecourt ground         5 gate / kerb cut
//  6 stall marking (PAINT)  7 entry plaza              9 plaza light
//  10 rooftop lantern / plant  15 plaza planter
//  11 clerestory glazing   12 courtyard               13 terrace / walk
//  14 oculus ring          17 roof edge               18 doorway (PORTAL)   19 dead car
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    /* A LIBRARY IS ONE BUILDING. Paolo 8/2, at 22%: "There's like six different
       buildings of the library. What's up with that?"

       He is right and it is a thinking error, not a drawing error. The 7/30 law says NO
       BUILDING IS A FLAT RECTANGLE, and I turned that into "make several separate
       buildings", which is a different thing and a wrong one. ARTICULATION IS NOT
       FRAGMENTATION. A civic landmark is ONE mass whose parts differ -- a drum, a tower,
       a long wing -- all joined, sharing walls, the roof line stepping between them.
       Predock's building is a single continuous composition, not a campus.

       Worse, I had encoded the mistake in the gate: it asserted four or more separate
       footprints, so the machine was REQUIRING the bug. Fixed the same turn. This is ONE
       footprint now, and its variety is asserted by the PARTS it contains.

       THE REFERENCE, unchanged: Antoine Predock's LAS VEGAS LIBRARY AND LIED DISCOVERY
       MUSEUM (1986-90, Las Vegas Blvd, across from Cashman Field) -- the cones, the giant
       concrete tower, sandstone and concrete, "the color scheme is provided by the
       desert". */

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // the desert forecourt ground
    G.rect(6,6,120,96,13);                                   // the terrace it all stands on

    /* ---- ONE BUILDING. Every piece below TOUCHES the piece beside it, and between them
       they fill the north two thirds of the plot: the first cut of this rebuild left the
       whole top of the terrace blank, which is the WALKABLE-LAND failure in a different
       coat -- thin features stranded in empty pavement. ---- */
    G.rect(12,62,114,90,2);                                  // the READING WING, the spine
    G.disc(38,40,22,2);                                      // THE DRUM, landing on the spine
    G.rect(8,10,30,30,2);                                    // the ADMIN block, sharing the drum's wall
    G.rect(56,34,74,62,2);                                   // THE TOWER shaft, the hinge
    G.rect(60,12,114,62,2);                                  // the MUSEUM WING

    /* THE DRUM: the oculus ring dropping daylight into the round reading room, and the
       lantern standing in the middle of it. */
    G.disc(38,40,15,14);
    G.disc(38,40,8,2);
    G.disc(38,40,4,10);

    /* THE TOWER. Seen from above a tower is a CAP, so it reads as one: a parapet ring
       round a roof plate with the stair-core lantern in the middle. The first cut painted
       the whole shaft in plant grey and it read as a HOLE between the drum and the museum
       -- a name that lies is a bug, and so is a colour that lies. */
    G.rect(57,35,73,60,17);
    G.rect(59,37,71,58,2);
    G.rect(63,44,68,51,10);

    /* THE COURTYARD, carved INSIDE the museum wing -- enclosed on all four sides, which is
       what makes it a courtyard instead of a gap between two buildings. DRESSED: the two
       cross walks that quarter it, dead planting down both beds, and a dry basin at the
       crossing. An undressed courtyard is just a void with a nice name. */
    G.rect(76,22,106,52,12);
    G.rect(90,22,92,52,13); G.rect(76,36,106,38,13);
    for(x=80;x<=102;x+=6){ set(x,28,3); set(x,46,3); }
    G.disc(91,37,4,10); G.disc(91,37,2,12);
    G.rect(88,52,94,54,18);                                  // the door onto it

    /* THE READING WING under its clerestory, with parapets front and back and the
       mechanical plant sitting on the roof behind the glazing. */
    for(x=16;x<=110;x+=5) G.rect(x,68,x+2,78,11);
    G.rect(12,62,114,63,17); G.rect(12,89,114,90,17);
    for(x=20;x<=104;x+=14) G.rect(x,82,x+5,86,10);
    G.rect(54,90,70,92,18);                                  // the main doors onto the plaza

    /* THE ADMIN BLOCK: back-of-house, and it carries the goods door onto the service drive.
       Kept clear of the oculus ring -- the first cut put it straight through the ring and
       took a bite out of the one shape the whole district is recognised by. */
    G.rect(9,11,29,29,17); G.rect(11,13,27,27,2); G.rect(14,16,21,23,10);
    G.rect(8,18,10,24,18);

    /* ---- THE ENTRY PLAZA. Dressed, because a plaza with nothing on it is a void with a
       nice name: the steps off the terrace, two rows of PLANTER walls with the trees dead
       in them, the dry fountain basin, and the light line along the kerb. ---- */
    G.rect(18,94,112,114,7);
    G.rect(18,94,112,96,13);                                 // the steps down off the terrace
    for(x=24;x<=102;x+=13){ G.rect(x,98,x+6,102,15); set(x+3,100,3);
                            G.rect(x,107,x+6,111,15); set(x+3,109,3); }
    G.disc(64,104,7,10); G.disc(64,104,4,7);
    for(x=24;x<=104;x+=12) set(x,113,9);

    /* ---- THE LOT and the service drive up the west side ---- */
    G.rect(6,116,120,124,1);
    for(x=10;x<=116;x+=4) for(y=118;y<=122;y++) set(x,y,6);  // the stall ticks are PAINT (6)
    G.rect(6,6,10,124,1);
    for(i=0;i<12;i++){ var cx=10+Math.floor(r()*26)*4, cy=118+Math.floor(r()*2);
      if(get(cx+1,cy)===1||get(cx+1,cy)===6) G.rect(cx+1,cy,cx+2,cy+3,19); }

    /* THE TERRACE IS WALKED ON, so it is not left as a blank plate: planters with the
       street trees dead in them drop into whatever open pockets the building leaves,
       wherever there is room for one clear of every wall. */
    for(y=11;y<=92;y+=6) for(x=11;x<=114;x+=6){
      var clear=true;
      for(var dy=-1;dy<=1&&clear;dy++) for(var dx=-1;dx<=1;dx++) if(get(x+dx,y+dy)!==13){ clear=false; break; }
      if(clear){ G.rect(x-1,y-1,x+1,y+1,15); set(x,y,3); }
    }

    for(i=0;i<22;i++){ var tx=4+Math.floor(r()*120), ty=4+Math.floor(r()*120);
      if(get(tx,ty)===4) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:17, door:18, min:150,
      outside:function(c){ return c===13||c===7||c===12||c===1||c===4||c===6; } });

    var gx=64;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=124;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===4||c===13) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===13; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* THE OCULUS RING, THE ROOF EDGE AND THE DOORWAYS ARE THE BUILDING. Counting only
         the sandstone made the drum read as TWO buildings -- its inner core was fenced off
         from its own outer wall by the glazed ring between them, which is a hole in a roof,
         not a gap between two structures. A library is ONE building (Paolo 8/2). */
      footprints:K.footprints(g,function(v){return v===2||v===14||v===17||v===18;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* SANDSTONE AND CONCRETE. Predock's own note on the building: "the color scheme is
     provided by the desert." No green anywhere -- nothing is watering this. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#9a7f5c',3:'#514f40',4:'#6b6250',5:'#c79a3f',6:'#4a4a52',
    7:'#8a8175',9:'#b0863a',15:'#7a6f57',10:'#8e8a7c',11:'#93a2a8',12:'#6f6a5c',13:'#7d7a71',
    14:'#c2b48c',17:'#bfa87f',18:'#241f1a',19:'#6a6e72'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'drive / lot',        kind:'drive',    act1:'the library lot and its service drive — asphalt gone to plates, weeds up every joint (car-drivable)'},
    2:{name:'library / museum',   kind:'building', act1:'sandstone and concrete geometry — Predock built this valley a landmark out of a drum, a tower and two long low wings, and the sandstone is still the colour of the desert it was matched to', enter:'library interior: the drum is one round room under a dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead courtyard tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'forecourt ground',   kind:'ground',   act1:'the unpaved forecourt — decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street into the lot, amber paint gone chalky'},
    6:{name:'stall marking',      kind:'marking',  act1:'the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it'},
    7:{name:'entry plaza',        kind:'ground',   act1:'the civic plaza across the front — big sandstone pavers heaved by roots, and the fountain basin dry in the middle of it'},
    9:{name:'plaza light',        kind:'structure',act1:'a plaza light on its concrete stem, head dark, the glass long gone'},
    10:{name:'rooftop lantern / plant',kind:'structure',act1:'the drum\'s rooftop lantern and the mechanical plant on the tower and the wings, ducting collapsed, one unit stripped for its copper'},
    11:{name:'clerestory glazing',kind:'structure',act1:'the clerestory teeth running the length of the reading wing — the glass that lit the stacks, now mostly sky'},
    12:{name:'courtyard',         kind:'ground',   act1:'a walled reading courtyard between the masses, its paving cracked, the planting dead in place'},
    13:{name:'terrace / plinth',  kind:'ground',     act1:'the raised concrete terrace the whole building sits on, and the walks across it, cracked corner to corner'},
    14:{name:'oculus ring',       kind:'structure',act1:'the ring of the drum\'s oculus — the round clerestory that dropped daylight into the middle of the reading room, its glazing gone'},
    15:{name:'plaza planter',    kind:'structure',act1:'a low sandstone planter wall across the plaza, its bed gone to hardpan with a dead tree still standing in it, coping cracked where people sat on it for thirty years', solid:true},
    17:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping missing in runs'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — the plaza doors under the reading wing, the museum entrance, the tower stair core'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left in the lot, flat and sun-bleached, nobody came back for it'}
  };
  var NOTES={
    summary:'A dead public library — ONE building, articulated: a sandstone DRUM under a dead oculus, a giant concrete TOWER standing where the parts meet, a MUSEUM WING wrapped around an enclosed courtyard, and a long low READING WING under a clerestory that runs its whole length. It stands on a raised terrace over a civic plaza with a dry fountain, and a small lot behind. Modelled on the real one this valley has.',
    reference:['ANTOINE PREDOCK, LAS VEGAS LIBRARY AND LIED DISCOVERY MUSEUM (1986-90, 833 Las Vegas Blvd N, opposite Cashman Field): a single continuous composition of primary geometric solids — a great sandstone drum/cone lit from an oculus, a tall square concrete tower, a museum wing and a low reading wing — NOT a campus of separate pavilions. Predock on the palette: "the color scheme is provided by the desert," which is why this district is sandstone and concrete with no green anywhere.',
      'Public-library programme (WBDG space types, Opening the Book space planning): circulation at the centre, wrapped by stacks, wrapped by reading rooms lit from above. That programme is kept — it is WHAT the drum and the reading wing contain — but the FORM is Predock\'s, not a generic colonnaded central library.'],
    layout:['ONE BUILDING (Paolo 8/2, at 22%: "there\'s like six different buildings of the library"). The READING WING is the spine across the south of the plot; the DRUM lands on it; the TOWER is the hinge between the drum and the museum; the MUSEUM WING lands on the spine too. Every mass shares a wall with the mass beside it.',
      'THE DRUM carries the oculus RING (14) and its rooftop lantern (10) — the round clerestory that dropped daylight into the middle of the reading room.',
      'THE COURTYARD (12) is carved INSIDE the museum wing, enclosed on all four sides with dead planting in it. That is what makes it a courtyard and not a gap between two buildings.',
      'THE CLERESTORY (11) runs the length of the reading wing as a row of teeth; roof edges (17) and doorways (18) are placed by K.roofsAndDoors so no mass is a flat rectangle.',
      'THE ENTRY PLAZA (7) spans the front with a dry fountain basin and a line of plaza lights; the raised terrace (13) is what the whole building stands on; the forecourt (4) is unpaved hardpan with dead trees, never a lawn.',
      'THE LOT (1) and its service drive run behind, ticked into stalls, with a few cars nobody came back for.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut (5) on the primary street feeds the lot and the service drive down the west side, and code 1 is reachable from the curb end to end (K.driveReachFromStreet > 0.85). Foot circulation is plaza -> terrace -> the doors under the reading wing, with the museum entrance and the tower stair core as the other two ways in. WALKABLE-LAND: the plot is overwhelmingly building + plaza + terrace; the lot is the only pavement. A corner adds a pedestrian gate onto the plaza, never a second car entrance.',
    layering:'GROUND (flat, walk on it): the entry plaza (7), the forecourt hardpan (4), the terrace/walks (13), the enclosed courtyard (12), the lot and service drive (1, DRIVE), bare desert (0). STRUCTURE (¾ front face, solid, ENTERABLE): the LIBRARY/MUSEUM mass (2 — the drum is one round room under the dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery), the oculus RING (14), the clerestory glazing (11), the roof edge (17), the plaza lights (9), the rooftop lantern and mechanical plant (10). PROP: dead trees (3). PORTAL: the doorways (18) and the kerb cut/gate (5). The DRUM and the TOWER are the vertical hero — you cross the plaza, climb onto the terrace and go in under the reading wing.',
    decisions:['ARTICULATION IS NOT FRAGMENTATION (Paolo 8/2). "No building is a flat rectangle" means articulate the mass, never split it into a campus. The building type decides: a library is one building, a downtown block is many. The gate was rewritten the same turn — it had been REQUIRING four or more separate footprints.',
      'The generic columned central library was killed for the real local landmark. A valley builds what it built; Predock\'s is the library Las Vegas actually has.',
      'Act-1 DEAD: the oculus glazing gone, the clerestory mostly sky, the fountain basin dry, coping missing off the parapets, one plant unit stripped for its copper, cars flat in the lot. What survives on the shelves is a knowledge/scarcity question and stays PENDING Paolo.',
      'NO GREEN. Predock\'s desert palette is also the honest act-1 answer: nothing is watering this. The forecourt is decomposed granite gone to hardpan, not lawn.',
      'Civic category. Zero purple. No library name or inscription anywhere (Paolo\'s to author).']
  };
  K.register('library', { generate:generate, body:function(c){return c===2||c===14||c===17||c===18;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaLibrary=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
