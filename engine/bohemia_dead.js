// BOHEMIA DEAD — THE DEAD-PLACEMENT PASS (8/8/26, WORLD lane)
//
// PAOLO'S RULING, laws/BOHEMIA_ADDENDUM_LORE_SITTING_7_31_26.md sec 2, LOCKED:
//   "We need a lot more corpses a lot more skeletons in the game."
//   "ofc i want a realistic mix of skeletons and husks."
//   ...bleached, scattered, animal-worked SKELETONS in the open; desiccated
//   mummified HUSKS in the sealed places (cars, rooms, tunnels)... REALISTIC is
//   the placement law: where a body lies determines what a decade made of it,
//   so THE DEAD TELL YOU WHERE THEY DIED.
// Commissioned direct 8/8: "skeletons in the open, husks in sealed places,
// realistic mix, story-via-placement."
//
// THIS MODULE IS THE PLACEMENT LAW AS A MACHINE. It answers three questions for
// every district in the valley, deterministically, from data that already exists:
//   WHERE  can a body be           (from the district's own LEGEND — no district
//                                   file is edited, all 61 of them work today)
//   WHAT   ten years made of it    (open -> skeleton, sealed -> husk)
//   HOW MANY                       (from the death math, concentrated by a
//                                   grounded story table, never spread evenly)
//
// ============================================================================
// WHY EXPOSURE DECIDES THE FORM — THE REAL SCIENCE, NOT A STYLE CHOICE
// ============================================================================
// Paolo's ruling is forensically correct and that is why it is easy to build:
//
//   IN THE OPEN. Vultures can strip a fleshed body to bone in as little as five
//   hours; coyotes and vultures begin within about two days, and COMPLETE
//   DISARTICULATION arrives within about six weeks. Dispersed elements are
//   found adjacent to the deposition site or along nearby game trails — so
//   scatter is SHORT-RANGE AND DIRECTIONAL, never a uniform sprinkle. Ten years
//   of Mojave UV then bleaches what is left. => partial, scattered, pale bone.
//
//   SEALED AND DRY. "The absence of external or internal moisture leads to
//   mummification of the entire body, WHICH COMPLETELY RESTRICTS DISARTICULATION
//   AND ANIMAL SCAVENGING." Aridity can preserve remains for hundreds of years.
//   => one intact husk, in the position it died in, NEVER scattered, still
//   dressed, because nothing could reach it.
//
// That is the whole rule: A BODY THE ANIMALS COULD REACH IS BONES AND IS SPREAD
// OUT. A BODY THEY COULD NOT REACH IS STILL A PERSON AND IS EXACTLY WHERE IT FELL.
// Sources cited in records/BOHEMIA_THE_DEAD_TELL_YOU_WHERE_THEY_DIED_8_8_26.md.
//
// ============================================================================
// MECHANISM-MINE / CONTENTS-PAOLO'S — WHAT THIS DELIBERATELY DOES NOT DO
// ============================================================================
//   - NO GORE. The gore/blood overlay bank is "story-placed by Paolo, hold"
//     (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md) and the DECAL corpse-
//     persist layer belongs to FRESH KILLS. Ten-year-old dead do not bleed.
//     Nothing here ever emits a gore tile.
//   - NO NAMED DEAD. The tower die-off, the exodus road, the hospital order are
//     HIS story beats. This pass lays down the AMBIENT dead the world is made of
//     and leaves `story` on every placement so an authored beat can override a
//     site later. It never writes a name, a note, or a reason for one body.
//   - NO DISPOSAL CANON. laws/BOHEMIA_ADDENDUM_DEATH_MATH_AND_ICONS_7_5_26.md
//     offers three cultures for what Vegas did with 2.2M dead (feed the fields /
//     the refusal / etc). Paolo has not ruled. VISIBLE_FRACTION below is the one
//     number that ruling will move, so it is declared in ONE place, flagged
//     [PENDING Paolo], and the gate bands it instead of pretending it is settled.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): THIS MODULE COOKS ZERO PIXELS. It is
// pure placement. The art it points at is Paolo's own, already in the game and
// never once drawn:
//   opened slices/BOHEMIA_CITY_TILES.js -> TP_TILES.gore, 73 tiles, 0 draws
//     (records/BOHEMIA_BANK_CONSUMPTION_8_6_26.md). Proved by aspect-sequence
//     match to be pack "10. Zombie bodies and bones" (34) + "skeletons and
//     bones" (39), from banks/BOHEMIA_HD_TILE_REPO_part*.txt.
//   opened banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (Paolo's Great Sweep,
//     THE act-1 verdict authority) -> 62 of those 73 carry his UP. The 11 DOWN
//     are all in the zombie pack. TILES below uses UP-only ranges with a +/-1
//     index safety margin around every DOWN, so a one-off mapping error still
//     cannot draw a tile he killed.
//   opened banks/BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt -> NOT USED, on hold.
//   opened banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt -> nothing skeletal.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');
  var KIT=HASREQ ? require('./bohemia_district_kit.js')
                 : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  var VERSION='8/8/26';

  /* ---- deterministic hash. Same seed + same cell + same tile = same dead,
     forever, on every device. ONE SEED law. -------------------------------- */
  function hash(a,b,c,d){
    var h=((a>>>0)*73856093)^((b>>>0)*19349663)^((c>>>0)*83492791)^((d>>>0)*2654435761);
    h=(h^(h>>>13))>>>0; return (h*1103515245+12345)>>>0;
  }
  function frac(h){ return (h>>>8)/16777216; }

  /* ========================================================================
     1. HOW MANY DIED IN THIS VALLEY — derived, never guessed
     ======================================================================== */
  // Every input here is already canon and cited. Change canon and this follows.
  var MATH={
    realPop:        2340000,   // GDD v5 / scale model: ~2.3M pre-crash Clark County
    survivorShare:  0.03,      // GDD v5: "~3% remain"
    modelScale:     17.3,      // records/..._FOUR_TIMES_THE_PEOPLE_..._8_6_26.md (1:17.3 by housing)
    // [PENDING Paolo] what the culture did with 2.2M bodies is an UNRULED lore
    // fork (death-math addendum a/b/c). Until he rules it, this is the share of
    // the dead still readable AS REMAINS, IN PLACE, ten years on.
    //
    // 0.60, AND THE ARITHMETIC IS THE ARGUMENT. ~4,000 survivors were left
    // holding ~131,000 bodies: THIRTY-THREE DEAD PER LIVING PERSON, in summer,
    // with no fuel and no machinery. Real mass-casualty events overwhelm
    // disposal at ratios far gentler than that. So the honest default is not
    // "most were cleared" — it is THE DEAD WERE NEVER CLEARED AT ALL, and bone
    // in arid conditions persists for decades while sealed bodies mummify and
    // last centuries. What actually removes a body here is fire, flood down the
    // washes, the organised minority who did bury their own in the first year,
    // canon corpse-collection by a population too small to matter at scale, and
    // full burial under collapse or sand. That is a minority, not a majority.
    //
    // WHAT TEN YEARS TOOK IS LEGIBILITY, NOT COUNT: an open body is fragments
    // now, not a person. That is modelled by FORM and SCATTER below, which is
    // the correct place for it — not by pretending the body is gone.
    visibleFraction: 0.60
  };
  function preCrashModelPop(){ return MATH.realPop/MATH.modelScale; }
  function modelDead(){ return preCrashModelPop()*(1-MATH.survivorShare); }
  function visibleDead(){ return modelDead()*MATH.visibleFraction; }

  /* ========================================================================
     2. WHERE A BODY CAN BE — read off the district's OWN legend
     ========================================================================
     THE WHOLE REASON THIS IS ONE FILE AND NOT SIXTY-ONE EDITS. Every district
     already declares, per tile, a `kind` that the kit resolves to a layer +
     solid + enter (DISTRICT DOSSIER LAW, 7/19). That is exactly an exposure
     map and nobody had read it as one.

       OPEN    the sky can see it and an animal can walk to it
               -> ground-layer, not solid: roads, lots, lawn, plaza, walks,
                  dry basins, the desert itself
       SEALED  a body got shut inside something and stayed dry
               -> a VEHICLE (a car with the doors closed is a desert oven and
                  the single most reliable mummifier in the valley)
               -> a BUILDING TILE THAT CAN BE ENTERED (a room, a crypt, a
                  tunnel mouth); `enter` is the legend's own word for "there is
                  an inside here"
       NONE    solid mass with no way in, props, portals, overhead — no body
     ---------------------------------------------------------------------- */
  var OPEN='open', SEALED='sealed', NONE='none';
  function exposureOf(entry){
    if(!entry) return NONE;
    var L=KIT.tileLayer(entry);
    if(entry.kind==='vehicle') return SEALED;                 // inside the car
    if(entry.kind==='building' && L.enter) return SEALED;     // inside the room
    if(L.layer==='ground' && !L.solid) return OPEN;
    return NONE;
  }

  /* ========================================================================
     3. STORY-VIA-PLACEMENT — where people actually die when a city dies
     ========================================================================
     Paolo: "where bodies lie tells what happened there." So the load is NOT
     uniform and that is the entire point: a body every ten metres everywhere is
     wallpaper, and wallpaper says nothing. Concentrate it and the map narrates.

     Each row is {open, sealed, story} where open/sealed are WEIGHTS (relative
     pull on the valley's visible dead), not counts. Grounded in how mass-
     mortality events actually distribute, every line defensible:

       AT HOME is the biggest bucket in any real mass-mortality event — people
       die in bed, in a chair, in the room they shut themselves into. Sealed
       dominates every residential type.
       CARE AND CUSTODY kill everyone inside: a jail, a ward, a care home is a
       building full of people who could not leave. Highest sealed anywhere.
       SHELTER POINTS (stadium, school, campus, terminal, mall, chapel) are
       where a frightened city gathers and then does not disperse.
       THE ROAD OUT is the exodus: sealed in the cars, bones on the shoulder.
       WATER pulls the dying. People crawl toward it and stop short.
       WORK EMPTIES. Industrial, warehouse, railyard: people went home to die.
       THE CEMETERY IS THE IRONY. It is where the dead were SUPPOSED to go, so
       it holds almost no loose dead — except the overflow that never got in.
       THE OPEN DESERT is the walk-out. Thin, scattered, and no husks at all,
       because out there nothing is sealed.

     [PENDING Paolo] the per-district numbers are a first honest pass and every
     one is his to move; the SHAPE (which places are heavy, which are empty) is
     his ruling already applied. */
  // AT HOME. `open` is not zero and must not be: people still died in the yard,
  // in the driveway, on the street they were walking down. It is just dwarfed by
  // indoors, which is what the ratio says.
  /* AT HOME, AND THE GROUP IS A FAMILY (Paolo 8/11: "abandoned houses
     clusters where it's really creepy"). A household is the natural cluster
     size and it is why an abandoned house is the creepiest room in the game:
     you do not find A body, you find THE FAMILY, in one room, together. */
  var HOME={open:1.4, sealed:9.0, cluster:5, story:'died at home, together, in the room they shut themselves into'};
  var STORY={
    suburb:    HOME, gated:HOME, trailer:HOME, town:HOME,
    apartment: {open:0.8, sealed:12.0, cluster:7, story:'stacked dead: a tower of sealed rooms, everyone home at once'},
    medical:   {open:6.0, sealed:16.0, cluster:14, story:'the wards filled, then the corridors, then the line outside never got in'},
    jail:      {open:0.3, sealed:15.0, cluster:12, story:'locked in. nobody opened the doors and nobody could leave'},
    policestation:{open:2.0, sealed:6.0, story:'holding cells and a last stand at the counter'},
    stadium:   {open:7.0, sealed:5.0, cluster:16, story:'a shelter point: the city gathered here and then did not leave'},
    campus:    {open:3.0, sealed:7.0, story:'dorms and halls used as shelter'},
    school:    {open:3.0, sealed:7.0, story:'gym shelter, classrooms after'},
    terminal:  {open:5.0, sealed:6.0, cluster:12, story:'they waited for transport that never came'},
    airport:   {open:4.0, sealed:6.0, story:'the concourse queue that never boarded'},
    airbase:   {open:2.0, sealed:3.0, story:'evacuated, then not'},
    mall:      {open:3.5, sealed:6.0, story:'shelter, then a supply riot, then quiet'},
    chapel:    {open:2.5, sealed:6.5, story:'people came here to die together'},
    cityhall:  {open:3.0, sealed:5.0, story:'the last administration, at their desks'},
    courthouse:{open:2.0, sealed:4.0, story:'sealed chambers, a queue at the steps'},
    library:   {open:1.5, sealed:4.5, story:'a cool stone building people slept in'},
    freeway:   {open:5.0, sealed:11.0, cluster:8, story:'the exodus: sealed in the cars, bones on the shoulder'},
    arterial:  {open:4.0, sealed:8.0, story:'the road out, stopped'},
    interchange:{open:4.5, sealed:10.0, story:'the jam that never cleared'},
    rail:      {open:2.5, sealed:3.0, story:'walked the line out of town'},
    railyard:  {open:1.5, sealed:2.0, story:'work emptied early'},
    truckstop: {open:4.0, sealed:7.0, story:'the last fuel, and the fight over it'},
    drivein:   {open:2.0, sealed:5.0, story:'people slept in their cars here'},
    boneyard:  {open:2.0, sealed:6.0, story:'a field of sealed fuselages, and what got in them'},
    water:     {open:8.0, sealed:0.0, story:'they crawled toward the water and stopped short'},
    watertreat:{open:6.0, sealed:3.0, story:'the plant everybody walked to when the taps died'},
    reservoir: {open:7.0, sealed:0.5, story:'the shoreline the whole valley walked to'},
    intake:    {open:5.0, sealed:1.0, story:'the last working intake, and the queue for it'},
    pumpstation:{open:3.5,sealed:1.5, story:'a pipe that still ran, for a while'},
    basin:     {open:3.0, sealed:0.3, story:'washed down and left'},
    wash:      {open:3.0, sealed:0.3, story:'the flood carried them here and dropped them'},
    park:      {open:4.0, sealed:0.5, story:'shade and a fountain: people lay down here'},
    golf:      {open:3.0, sealed:1.0, story:'the ponds drew them'},
    waterpark: {open:4.5, sealed:1.5, story:'they came for water and found empty concrete'},
    ballpark:  {open:3.5, sealed:2.5, story:'another shelter point'},
    speedway:  {open:2.5, sealed:2.0, story:'the infield camp'},
    /* THE DUMPING PIT (his 8/11 ruling). Was 1.2/2.0 -- the lowest in the
       table -- on the reading that the dead were meant to go here and did
       not. He ruled the opposite and history agrees: when disposal fails,
       burial ground is exactly where the bodies get dumped. FEW, HUGE
       clusters: one pit you can stand at the edge of. */
    cemetery:  {open:16.0, sealed:2.0, cluster:34, story:'the pit. they stopped digging graves and started digging one hole'},
    /* THE FERTILIZER WORKS (his 8/11 ruling). Somebody is turning the dead
       into soil, and a farm is where the soil goes. Big clusters because a
       processing line is a QUEUE of bodies, not a scatter. */
    farm:      {open:9.0, sealed:2.5, cluster:18, story:'the intake line. they are turning people into soil here'},
    landfill:  {open:11.0, sealed:1.0, cluster:26, story:'where the city put what it would not look at, and then put its dead'},
    granary:   {open:1.5, sealed:3.5, story:'guarded the grain to the end'},
    swapmeet:  {open:3.0, sealed:1.5, story:'the last market, and the crush at it'},
    commercial:{open:2.5, sealed:3.5, story:'looted, then slept in'},
    downtown:  {open:3.5, sealed:6.0, story:'the towers emptied downward and stopped on the stairs'},
    industrial:{open:1.0, sealed:1.5, story:'work emptied: people went home to die'},
    warehouse: {open:1.0, sealed:2.0, story:'a raid on the stock, ten years ago'},
    storage:   {open:0.8, sealed:3.0, story:'people lived in the units. some never opened again'},
    quarry:    {open:1.2, sealed:0.5, story:'walked out this way'},
    gypsum:    {open:1.0, sealed:0.4, story:'walked out this way'},
    fueldepot: {open:1.5, sealed:2.0, story:'the fuel fight'},
    arsenal:   {open:1.5, sealed:3.0, story:'sealed and defended, to the end'},
    datafort:  {open:0.6, sealed:2.5, story:'sealed rooms nobody could open'},
    substation:{open:0.8, sealed:0.6, story:'crews caught working'},
    battery:   {open:0.6, sealed:0.6, story:'crews caught working'},
    solar:     {open:0.8, sealed:0.4, story:'shade under the panels, for a while'},
    radio:     {open:1.0, sealed:2.0, story:'somebody stayed on the air'},
    reclaim:   {open:2.0, sealed:1.5, story:'salvage crews, later'},
    firestation:{open:2.0, sealed:4.0, story:'the last crew, in the bunk room'},
    garage:    {open:1.5, sealed:5.0, story:'a deck of sealed cars in the dark'},
    crypt:     {open:0.5, sealed:4.0, story:'the vaults, as intended'},
    desert:    {open:1.4, sealed:0.0, story:'the walk-out that did not make it'},
    mountain:  {open:0.9, sealed:0.0, story:'went up to see and stayed'},
    /* THE VEGAS-ONLY ROWS. These are recipe landmarks rather than kit districts,
       and the valley is full of them (resort 118 cells, strip 81), so leaving
       them on the default row would flatten the loudest places on the map. */
    resort:    {open:5.0, sealed:14.0, cluster:12, story:'thousands of rooms full of people with no way home, and the doors held'},
    casino:    {open:3.0, sealed:9.0, story:'the floor, and the rooms above it'},
    strat:     {open:3.0, sealed:9.0, story:'the floor, and the rooms above it'},
    luxor:     {open:3.0, sealed:9.0, story:'the floor, and the rooms above it'},
    strip:     {open:7.0, sealed:9.0, story:'the boulevard: caught in the open, and sealed in the cars beside them'},
    convention:{open:5.0, sealed:8.0, story:'halls big enough to shelter a district, and they did'},
    highroller:{open:3.5, sealed:6.0, story:'stopped at height, and stayed stopped'},
    sphere:    {open:3.5, sealed:6.0, story:'a sealed shell people went inside'},
    minigp:    {open:2.5, sealed:2.0, story:'the infield camp'},
    estate:    {open:1.2, sealed:8.0, story:'big houses, sealed rooms, the same ending'},
    prison:    {open:0.3, sealed:15.0, story:'custody: locked in, and nobody came back with a key'},
    fort:      {open:1.5, sealed:4.0, story:'held out, then did not'},
    dam:       {open:1.0, sealed:1.0, story:'the crews who stayed with the machines'},
    springs:   {open:6.0, sealed:0.5, story:'water: they walked here from everywhere and stopped'},
    sign:      {open:2.0, sealed:0.3, story:'people slept under it for the shade'}
  };
  var DEFAULT_STORY={open:2.0, sealed:3.0, cluster:4, story:'the ordinary dead of an ordinary block'};
  var DEFAULT_CLUSTER=4;

  /* ACT 1 IS THE THICK ONE (Paolo 8/11): "especially in act one I wanna see lots
     of corpses". The number of people who died NEVER changes -- what changes is
     how much of it is still lying in the street as the city comes back. Act 1 is
     ten years of nobody clearing anything; by act 3 the living have. */
  var ACT_DENSITY={1:2.2, 2:1.0, 3:0.35};

  /* ========================================================================
     THE PLACES HE NAMED (Paolo 8/11)
     ========================================================================
       "The cemetery can become like a body dumping pit. I'm sure a faction or
        two is trying to turn people into fertilizer whatever you think."

     THE CEMETERY IS NOW THE PIT, and this is the historically correct shape
     rather than a horror flourish. When disposal collapses, the dead go into
     PITS AND TRENCHES on ground that was already for burying: the Great Irish
     Famine's "famine pits" were shallow unmarked trenches in workhouse grounds,
     and epidemic burials went in fast, unmarked, without caskets, for sanitation.
     A cemetery in a collapse does not stop being used -- it stops being ORDERLY.
     So it flips from the LOWEST weight in the table (the irony that the dead were
     supposed to go there and did not) to one of the highest, in FEW ENORMOUS
     CLUSTERS: one pit, not a sprinkle across the lawns.

     THE FERTILIZER WORKS. Human composting is a real, licensed process and the
     details are what make the site legible instead of lurid: a body goes into a
     vessel with straw, alfalfa and sawdust, held at 55-71 C and aerated, and
     comes out in about 30 days as roughly 250 lb of soil, with a second 30 days
     resting. Metal -- pacemakers, hip replacements -- is pulled out BY HAND and
     set aside. That gives a site anyone can read at a glance: rows of vessels,
     a carbon pile, a sorting table, a heap of finished soil, and a tray of
     implants nobody could compost.
     WHOSE OPERATION IT IS STAYS HIS. No faction is named here, and none is
     invented (MECHANISM-MINE / CONTENTS-PAOLO'S). The site exists; who runs it
     is a ruling, and the death-math addendum's a/b/c fork is still open. */
  function storyFor(type){ return STORY[type]||DEFAULT_STORY; }

  /* ========================================================================
     4. THE ART — Paolo's own tiles, UP-only, with his size rulings applied
     ========================================================================
     TP_TILES.gore, index ranges proved against his Great Sweep. `skel` is the
     whole "skeletons and bones" pack (39/39 UP, zero DOWN in it). `husk` is the
     UP body tiles with a +/-1 margin cut around every DOWN he gave, so even an
     off-by-one in the mapping cannot surface a tile he killed. */
  var TILES={
    bank:'gore',                                  // TP_TILES category name
    skel:{from:34, to:72},                        // "skeletons and bones", all UP
    husk:[[9,16],[21,23],[27,33]],                // UP bodies, DOWN-safe margins
    down:[0,1,2,3,4,5,6,7,18,19,25],              // his DOWNs — never drawn
    /* SIZE IS A METRE, NOT A FLAG. A fine tile is 0.75 m and an adult is about
       1.7 m, so a body lying on the ground covers a bit over two tiles. These are
       the DRAW HEIGHTS in cells; width follows each tile's own aspect so a judged
       sprite is never reshaped.
         husk     1.9  an intact mummified body, full length, as it fell
         skeleton 1.5  shorter on purpose: after ten years and the scavengers
                       this is a PARTIAL, disarticulated set, not a laid-out body
       (The first cut used 0.55 off the sweep's "BIG: render smaller" prop flag
       and rendered two pale specks on the asphalt. That flag is about props
       standing in a room; a femur is not a sofa.) */
    scale:{skeleton:1.5, husk:1.9},

    /* ---- HOW LONG EACH TILE ACTUALLY IS, IN METRES (Paolo 8/11, LOCKED) ----
       "i would challenge you to make sure any bones or skulls are always the
        same size as our humans ... anything thats human decay please make the
        art with a person next to it so u get the real scale and size"

       He was right and one number for 62 different things was the bug. The
       scale above is a single DRAW HEIGHT applied to every tile in the bank,
       so the game drew a lone skull and a whole skeleton at the SAME 1.75 m.
       Measured on the reference sheet (tools/bohemia_bone_scale_sheet.js,
       slices/look/bone-scale.png): the man is 1.74 m, and it was wrong in BOTH
       directions -- single skulls at 0.92-1.31 m (a skull is 0.20 m), while
       fully articulated skeletons like #34 drew at 0.64 m, child-sized.

       These are REAL ANATOMY, not taste: an adult skull is ~20 cm, a femur
       ~45 cm, a ribcage ~35 cm, a laid-out adult ~1.7 m. That makes the table
       MECHANISM (measurable fact), never CONTENTS -- nothing here judges his
       art, it only states how big the thing it depicts is in the world.
       The value is the LONG AXIS on screen; the other axis follows the tile's
       own ratio, so a judged sprite is still never reshaped. */
    metres:{
      /* single skull */
      44:0.20, 45:0.20, 46:0.20, 47:0.20, 48:0.20, 14:0.25, 10:0.30,
      /* jaw, ribcage, single long bone */
      53:0.22, 51:0.40, 49:0.45, 56:0.45, 16:0.45, 54:0.35, 55:0.40,
      /* a few bones together / crossed */
      50:0.55, 52:0.55, 58:0.60, 27:0.70, 28:0.60, 13:0.45, 17:0.40, 26:0.45,
      /* skulls stacked, small clusters */
      41:0.50, 42:0.50, 22:0.55, 24:0.55, 32:0.50, 64:0.55, 65:0.60,
      59:0.60, 62:0.60, 43:0.80, 66:0.90,
      /* a body's worth of remains, lying */
      9:0.90, 63:0.90, 31:1.10, 20:1.20, 21:1.30, 60:1.20, 33:1.20, 15:1.20,
      8:1.30, 11:1.30, 29:1.30, 23:1.40, 61:1.40, 12:1.50, 30:1.60,
      /* a FULL articulated skeleton is a person, so it is person-length */
      34:1.70, 35:1.70, 36:1.70, 37:1.70, 39:1.70, 40:1.70, 38:1.30,
      /* heaped bone: legitimately bigger than one body */
      57:1.10, 67:1.10, 68:1.10, 69:1.10, 70:1.10, 71:1.10, 72:1.20
    },
    /* anything the table has not ruled on falls back to a body's remains, which
       is the safe middle: never a man-sized skull, never a doll-sized corpse. */
    metresDefault:1.20,
    /* NOTHING HUMAN OUT-MEASURES THE HUMAN. A heap may; a body part may not.
       The gate holds this line so a future tile cannot quietly go giant. */
    humanMetres:1.74
  };
  /* THE LONG AXIS OF A TILE, IN METRES. One place, so the renderer and the gate
     cannot disagree about how big a thing is (the 8/9 scatter bug was two
     rulers for one measurement). */
  function tileMetres(i){
    var m=TILES.metres[i];
    return (typeof m==='number' && m>0) ? m : TILES.metresDefault;
  }
  function tileIndex(form,h){
    if(form==='skeleton'){ var n=TILES.skel.to-TILES.skel.from+1; return TILES.skel.from+(h%n); }
    var spans=TILES.husk, total=0, i;
    for(i=0;i<spans.length;i++) total+=spans[i][1]-spans[i][0]+1;
    var k=h%total;
    for(i=0;i<spans.length;i++){ var w=spans[i][1]-spans[i][0]+1; if(k<w) return spans[i][0]+k; k-=w; }
    return spans[0][0];
  }

  /* ========================================================================
     5. THE PASS
     ========================================================================
     place({type,g,legend,seed,cellX,cellY}) -> [{x,y,form,exposure,tile,scale,
                                                  scatter,interior,story}]
     One call per district cell. Pure, deterministic, allocation-light. */
  function place(opts){
    opts=opts||{};
    var legend=opts.legend||{}, type=opts.type||'suburb';
    /* THE GRID ARRIVES IN TWO SHAPES AND BOTH ARE LEGAL. Generators hand back
       rows (g[y][x]); the walked world caches the same plot FLAT (kit[y*FN+x])
       and reshaping 16,384 cells per district on a phone to satisfy one caller's
       taste is a cost with no buyer. Take either, ask the same question. */
    var g=opts.g, W, H, at;
    if(g && g.length && g[0] && g[0].length!==undefined){
      H=g.length; W=g[0].length; at=function(x,y){ return g[y][x]; };
    } else if(opts.kit && opts.kit.length){
      W=opts.W||opts.side||128; H=opts.H||opts.side||128;
      var kit=opts.kit; at=function(x,y){ return kit[y*W+x]; };
    } else return [];
    var seed=(opts.seed>>>0)||1, cx=(opts.cellX|0), cy=(opts.cellY|0);
    var st=storyFor(type);

    // exposure per CODE, resolved once (61 legends, never per tile)
    var EX={}; for(var c in legend) EX[c]=exposureOf(legend[c]);

    /* THE CENSUS ALSO COLLECTS THE ELIGIBLE TILES, because clustering needs to
       PICK from them rather than roll a die on each one. Two flat index arrays,
       16,384 entries worst case, built in the pass that was already happening. */
    var nOpen=0,nSealed=0,x,y,e;
    var openIdx=[], sealedIdx=[], driveIdx=[];
    for(y=0;y<H;y++)for(x=0;x<W;x++){
      var cc=at(x,y); e=EX[cc];
      if(e===OPEN){ nOpen++; openIdx.push(y*W+x); }
      else if(e===SEALED){ nSealed++; sealedIdx.push(y*W+x); }
      var lg=legend[cc];
      if(lg && lg.kind==='drive') driveIdx.push(y*W+x);
    }
    if(!nOpen&&!nSealed) return [];

    /* THE RATE. visibleDead() bodies are spread over the valley's cells in
       proportion to each cell's story weight: a cell's SHARE is its own weight
       over the average weight, so a hospital pulls many times what a substation
       does and the valley total still lands on the death math. The share then
       splits between open and sealed by the same row's two weights.
       The surface counts (nOpen/nSealed) are NOT a second multiplier — they only
       turn a count into a per-tile probability further down. Multiplying by both
       is the double-count that made the first run place one body per district. */
    var cells=CELLS_PER_SIDE*CELLS_PER_SIDE;
    var perCellAvg=visibleDead()/cells;
    var wOpen=st.open, wSealed=st.sealed, wTot=wOpen+wSealed;
    var cellShare=perCellAvg*(wTot/AVG_WEIGHT);
    var openCount   = wTot? cellShare*(wOpen  /wTot)*OPEN_REACH   : 0;
    var sealedCount = wTot? cellShare*(wSealed/wTot)*SEALED_REACH : 0;

    /* ONE PASS OVER THE PLOT, NOT THREE. MEASURED, NOT GUESSED: on a first
       crossing into a district cell this pass cost 35-55 ms at p50 and up to
       130 ms at worst, against a 16.7 ms frame -- and the demo plan names exactly
       that moment (row 8, "district crossings don't hitch on a phone"). Confirmed
       by A/B with a control row: dead ON 101/235 ms, dead OFF 69/106 ms, dead ON
       again 125/207 ms.
       It walked all 16,384 tiles THREE times: once to census the surfaces, then
       once per form to place. The census has to happen first (the per-tile odds
       need the totals), but the two placement passes were always one pass asking
       two questions about the same tile. Same output, same seeds, same bodies --
       the hashes are keyed on (seed, cell, x, y), never on iteration order, which
       is what makes this safe to fold. */
    /* ACT 1 IS THE THICK ONE (Paolo 8/11): "especially in act one I wanna see
       lots of corpses". Later acts are the world being cleaned up as it comes
       back to life, which is the arc, so the multiplier lives on the ACT and not
       on the death math -- the number of people who died never changes. */
    var actMul=ACT_DENSITY[opts.act||1]||1;
    openCount*=actMul; sealedCount*=actMul;

    var out=[];
    emitClusters(OPEN,'skeleton',openCount,openIdx);
    emitClusters(SEALED,'husk',sealedCount,sealedIdx);
    return out;

    /* ========================================================================
       CLUSTERS, NOT A SPRINKLE (Paolo 8/11, and it is the whole point)
       ========================================================================
         "clusters where it's really creepy ... in abandoned parts of streets and
          abandoned buildings in abandoned houses"
       THE MEASUREMENT THAT FORCED THIS: an even per-tile roll put the realistic
       total down at one body every 115 SCREENS of walking in a suburb. Correct
       arithmetic, invisible game. An even sprinkle is also the ONE distribution a
       mass-mortality event never produces -- people die together, in a room, at a
       checkpoint, around the last water. Historic famine and plague disposal is
       PITS AND TRENCHES, not a scatter.
       So the same bodies are grouped: pick seeds, pack the group around each one.
       The valley total is untouched; what changes is that you now find SEVEN at
       once instead of walking past one you never saw. */
    function emitClusters(want,form,count,idx){
      if(count<=0||!idx.length) return;
      var size=Math.max(2, st.cluster||DEFAULT_CLUSTER);
      var n=Math.max(1, Math.round(count/size));
      var placed={}, made=0, k;
      for(k=0;k<n;k++){
        var seedIdx=pickSeed(idx,k);
        made+=growCluster(want,form,seedIdx,size,idx,placed,k);
      }
      /* the rounding above can under-shoot on a small cell; top up so a district
         never quietly holds fewer dead than the death math gave it */
      var want2=Math.round(count);
      for(k=0;made<want2 && k<idx.length*2; k++){
        var extra=idx[hash(seed,cx*131+cy,9090+k,made)%idx.length];
        if(placed[extra]) continue;
        placeAt(want,form,extra,placed); made++;
      }
    }

    /* WHERE A CLUSTER STARTS: the ABANDONED part of the plot, which is derivable
       rather than invented -- it is the ground FURTHEST FROM THE DRIVE NETWORK.
       Where cars went is where people went, so the back of the lot, the dead end,
       the far side of the block is what has been walked past for ten years. Six
       candidates are sampled and the most remote wins; sampling rather than a
       full distance transform because this runs on a phone at a crossing. */
    function pickSeed(idx,k){
      var best=idx[0], bestD=-1, t;
      for(t=0;t<6;t++){
        var cand=idx[hash(seed,cx*131+cy,k*17+t,4242)%idx.length];
        var d=remoteness(cand);
        if(d>bestD){ bestD=d; best=cand; }
      }
      return best;
    }
    function remoteness(i){
      if(!driveIdx.length) return 1;
      var ix=i%W, iy=(i/W)|0, best=1e9, j;
      /* a sample of the drive network, not all of it: eight probes give the
         ordering we need and cost nothing */
      for(j=0;j<8;j++){
        var d0=driveIdx[(j*driveIdx.length/8)|0];
        var dx=Math.abs(d0%W-ix), dy=Math.abs(((d0/W)|0)-iy);
        var m=dx>dy?dx:dy; if(m<best) best=m;
      }
      return best;
    }

    /* GROW: walk outward from the seed and take eligible tiles until the group is
       full. Tight, so it reads as a group and not as a fresh sprinkle. */
    function growCluster(want,form,seedIdx,size,idx,placed,k){
      var sx=seedIdx%W, sy=(seedIdx/W)|0, made=0, r, dx, dy;
      var radius=Math.max(2, Math.ceil(Math.sqrt(size))+1);
      for(r=0;r<=radius && made<size;r++){
        for(dy=-r;dy<=r && made<size;dy++)for(dx=-r;dx<=r && made<size;dx++){
          if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;   // ring by ring
          var nx=sx+dx, ny=sy+dy;
          if(nx<0||ny<0||nx>=W||ny>=H) continue;
          var i=ny*W+nx;
          if(placed[i]) continue;
          if(EX[at(nx,ny)]!==want) continue;
          /* not every tile in the ring: a group is bodies, not a filled disc */
          if(r>0 && (hash(seed,cx*131+cy,i,k+31)%100)>=62) continue;
          placeAt(want,form,i,placed); made++;
        }
      }
      return made;
    }
    function placeAt(want,form,i,placed){
      placed[i]=1;
      var xx=i%W, yy=(i/W)|0;
      one(want,form,1.1,xx,yy,at(xx,yy));      // p>1: the roll already happened
    }
    function one(want,form,p,xx,yy,code){
      var scatterRoom=(form==='skeleton');
        var h=hash(seed,cx*131+cy,xx,yy);
        if(frac(h)>=p) return;
        var h2=hash(h,xx,yy,7);
        out.push({x:xx,y:yy,form:form,exposure:want,
          tile:tileIndex(form,h2),
          scale:TILES.scale[form],
          /* SCATTER. Bone goes 0-2 cells along ONE direction (game-trail
             dispersal), and only over open ground. A husk NEVER scatters:
             mummification "completely restricts disarticulation".
             THE DIRECTION SHIPS WITH THE BODY. It used to be computed here and
             then RE-DERIVED by the renderer from the tile index, which is a
             different number -- so the pass validated a trail running north and
             the screen drew one running east, straight through a wall. Anything
             two places compute separately is a bug waiting for a seed. Emit it
             once; everyone reads it. */
          scatter:0, dir:[0,0],
          interior:(want===SEALED&&isRoom(legend[code])),
          story:st.story});
        if(scatterRoom) scatterOf(out[out.length-1],h2,xx,yy,EX,at,W,H);
    }
  }
  function isRoom(entry){ return !!(entry&&entry.kind==='building'); }
  /* Writes BOTH the run length and the direction onto the remain, so the screen
     draws the trail this function actually validated. */
  function scatterOf(rec,h,x,y,EX,at,W,H){
    var n=h%100; if(n<42) return;                   // 42% still articulated enough to read as one
    var d=[[1,0],[-1,0],[0,1],[0,-1]][(h>>>7)%4];
    var len=(n<82)?1:2, k, ok=0;
    for(k=1;k<=len;k++){ var nx=x+d[0]*k, ny=y+d[1]*k;
      if(nx<0||ny<0||nx>=W||ny>=H) break;
      if(EX[at(nx,ny)]!==OPEN) break;               // bone does not scatter through a wall
      ok=k; }
    rec.scatter=ok; rec.dir=ok?[d[0],d[1]]:[0,0];
  }

  var CELLS_PER_SIDE=96;                            // canon constant, declared registry
  var OPEN_REACH=1.0, SEALED_REACH=1.0;             // hooks for act 2/3 restyle

  /* AVG_WEIGHT — THE DENOMINATOR, AND THE ONE THAT IS EASY TO GET WRONG.
     For the valley total to land on the death math, this has to be the mean
     story weight of A REAL VALLEY CELL, weighted by how many cells of each type
     the seed actually produces. The obvious version — the plain mean over the
     STORY table — is NOT that, and using it overshot the death math by 33%,
     because this valley is mostly suburb (2,582 cells) and arterial (2,434),
     both heavier than the table's average. A table of 77 rows says nothing
     about a map that uses two of them for half its area.
     MEASURED on the canonical seed 'bohemia' (2691674296), 9,216 cells, 8/8/26:
         plain table mean       6.71   -> valley total 104,825 vs 78,721 target
         CELL-WEIGHTED mean     8.94   -> valley total lands on the death math
     It is declared, not recomputed at boot, because computing it would mean
     generating the whole world inside a per-district helper. dead_gate.js
     re-measures it against the live world every run and fails if the valley
     drifts more than 10% away from this number, so a lane that changes the mix
     of districts cannot silently move the body count of the game. */
  var AVG_WEIGHT=8.94;
  var AVG_WEIGHT_MEASURED={seed:2691674296, cells:9216, date:'8/8/26', tolerance:0.10};

  /* ========================================================================
     6. INSIDE — and the interior law does the work for free
     ========================================================================
     INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED): "every interior floor
     plate === the footprint w x h, every time." So a husk this pass put on a
     building tile at (x,y) IS a husk standing at (x-foot.x, y-foot.y) on that
     building's floor plate. No second placement pass, no second random draw, no
     way for the two views to disagree: THE BODY YOU CANNOT SEE FROM THE STREET
     IS AT EXACTLY THE TILE YOU FIND IT AT WHEN YOU WALK IN.

     inside(list, foot, isFloor) -> [{x,y,...}] in plate-local coordinates.
     isFloor(x,y) is optional; when given, a husk that lands on an interior WALL
     is nudged to a neighbouring floor tile (a body is in the room, not in the
     masonry) and dropped only if the whole neighbourhood is wall. */
  function inside(list, foot, isFloor){
    if(!list||!foot) return [];
    var out=[], i, d, lx, ly;
    var D4=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
    for(i=0;i<list.length;i++){
      d=list[i]; if(!d.interior) continue;
      lx=d.x-foot.x; ly=d.y-foot.y;
      if(lx<0||ly<0||lx>=foot.w||ly>=foot.h) continue;
      if(typeof isFloor==='function'){
        var found=null, k;
        for(k=0;k<D4.length;k++){ var nx=lx+D4[k][0], ny=ly+D4[k][1];
          if(nx<0||ny<0||nx>=foot.w||ny>=foot.h) continue;
          if(isFloor(nx,ny)){ found=[nx,ny]; break; } }
        if(!found) continue;
        lx=found[0]; ly=found[1];
      }
      out.push({x:lx,y:ly,form:d.form,exposure:d.exposure,tile:d.tile,
                scale:d.scale,scatter:0,interior:true,story:d.story});
    }
    return out;
  }

  /* stats(list) — what a plot ended up holding. The gate reads this; so does the
     dossier. Counting is never the caller's job to re-derive. */
  function stats(list){
    var o={total:0,skeleton:0,husk:0,open:0,sealed:0,scattered:0,interior:0};
    (list||[]).forEach(function(d){ o.total++; o[d.form]++; o[d.exposure]++;
      if(d.scatter)o.scattered++; if(d.interior)o.interior++; });
    o.skeletonShare=o.total?o.skeleton/o.total:0;
    return o;
  }

  var API={VERSION:VERSION, place:place, inside:inside, stats:stats, exposureOf:exposureOf,
           ACT_DENSITY:ACT_DENSITY,
           storyFor:storyFor, STORY:STORY, DEFAULT_STORY:DEFAULT_STORY, TILES:TILES,
           MATH:MATH, OPEN:OPEN, SEALED:SEALED, NONE:NONE, tileMetres:tileMetres,
           preCrashModelPop:preCrashModelPop, modelDead:modelDead, visibleDead:visibleDead,
           avgWeight:function(){return AVG_WEIGHT;}, cellsPerSide:function(){return CELLS_PER_SIDE;},
           AVG_WEIGHT_MEASURED:AVG_WEIGHT_MEASURED};
  if(HASREQ) module.exports=API;
  root.BohemiaDead=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
