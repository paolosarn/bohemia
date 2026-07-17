// BOHEMIA LIGHT REGISTRY RESOLVER — the emitter choke point (7/16/26)
// Every light in the world resolves through here. Nothing hands an emitter to
// BOH_LIGHT except this module. Same shape as bohemia_tilepool.js (which tile)
// and bohemia_prop_scale.js (how big): this one answers IS IT LIT, AND HOW FAR.
//
// LAWS ENCODED (all Paolo, all already locked, none new):
//  - LIGHT PHILOSOPHY: emitters feed a whole-frame multiply pass. No per-sprite tint.
//  - UNLIT FUEL NO FLICKER (7/14): unlit fuel emits nothing. Fire is a STATE CHANGE.
//  - DARK LAMP CANON (7/14 MEGA): act-1 default state is DARK. The lit sprite IS
//    the powered state. So "is this lamp on?" is not a per-sprite property at all.
//  - CLUSTERED POWER LAW (7/14): ~12% of feeder circuits alive, owned, never
//    alternating. Light = territory. THIS is what decides a lamp's state.
//  - HEIGHT/RADIUS LAW (meter-grounded, 7/14): illuminated width ~= pole height.
//    residential 8, arterial 12, highway mast 15, fire 4, item light 3.
const BOH_LIGHTREG=(()=>{

  // radius_classes as stated by the registry itself
  const R={residential_lamp:8,arterial_lamp:12,highway_mast:15,fire:4,item_light:3};

  // Which radius class a source belongs to, by pole family. Height is a physical
  // fact about the sprite, not a placement choice.
  const HIGHWAY=[/mast/,/traffic_light_tall/];
  const RESIDENTIAL=[/lamp_cane/,/lamp_post/,/ped_signal/];
  const ARTERIAL=[/lamp_curved/,/lamp_double/,/traffic_light/,/spotlight/,/floodlight/];
  const ITEM=[/^i_survival_/,/^i_item_/];

  // Fuel that is NOT burning. Registered as fire, emits nothing until lit.
  // (p_camp_firewood_stack_21 DOWN 7/14: "not on fire — no idle flicker")
  const UNLIT_FUEL=[/firewood_stack/,/woodpile/,/log_pile/];

  // Combustion that is not on the grid, however it got filed.
  const FLAME_NOT_GRID=[/flare/];

  function match(name,pats){return pats.some(p=>p.test(name));}

  function radiusClassOf(s){
    const n=s.source;
    if(match(n,ITEM))return 'item_light';
    if(s.type==='fire')return 'fire';
    if(match(n,HIGHWAY))return 'highway_mast';
    if(match(n,RESIDENTIAL))return 'residential_lamp';
    if(match(n,ARTERIAL))return 'arterial_lamp';
    return null; // beacons and anything unclassed keep their authored radius
  }

  // ---- NORMALIZE -----------------------------------------------------------
  // Every correction below is the registry disagreeing with a law the registry
  // itself quotes. No new judgement is introduced. Returns {sources,report}.
  function normalize(reg){
    const out=[],report=[];
    for(const raw of reg.sources){
      const s=JSON.parse(JSON.stringify(raw));
      const n=s.source;

      // 1. unlit fuel emits nothing. fire is a state change.
      if(match(n,UNLIT_FUEL)){
        s.type='fuel'; s.radius_cells=0; s.flicker_amp=0; s.anim_clip=null;
        s.lights_when='ignited';
        report.push([n,'UNLIT FUEL NO FLICKER: emitter stripped, becomes fuel awaiting ignition']);
      }

      // 2. combustion is never on the grid
      else if(match(n,FLAME_NOT_GRID)&&String(s.type).startsWith('electric')){
        s.type='fire';
        report.push([n,'road flare is pyrotechnic combustion, not grid — reclassed electric -> fire']);
      }

      // 3. DARK LAMP CANON + CLUSTERED POWER: electric is no longer PENDING as a
      //    yes/no. The circuit answers it. Type settles, state defers to the grid.
      if(String(s.type).startsWith('electric')){
        s.type='electric';
        s.default_state='dark';        // act-1 dead state canon
        s.powered_by='circuit';        // CLUSTERED POWER LAW decides
        delete s.note;
      }

      // 4. radius from the height law, not a flat stamp
      const rc=radiusClassOf(s);
      if(rc&&s.radius_cells!==R[rc]&&s.radius_cells!==0){
        report.push([n,`radius ${s.radius_cells} -> ${R[rc]} (class ${rc}, height law)`]);
        s.radius_cells=R[rc];
      }
      if(rc)s.radius_class=rc;
      delete s.radius_classes;
      out.push(s);
    }
    return {sources:out,radius_classes:R,report};
  }

  // ---- RESOLVE -------------------------------------------------------------
  // props: [{source, x, y, cell:[ox,oy], ignited?}]  (cell = overmap cell for grid lookup)
  // power: BOH_POWERGRID.powerMap(...) or null (null = nothing electric is lit)
  // Returns the emitter list BOH_LIGHT.setEmitters() eats, plus per-prop sprite state.
  function resolve(props,index,power){
    const emitters=[],states=[];
    for(const p of props){
      const s=index[p.source];
      if(!s){states.push({source:p.source,state:'unknown',lit:false});continue;}
      let lit=false,owner=null;
      if(s.type==='fire')            lit=true;
      else if(s.type==='fuel')       lit=!!p.ignited;   // state change, not an idle
      else if(s.type==='beacon')     lit=true;          // battery
      else if(s.type==='electric'){
        if(power&&p.cell){const st=power.at(p.cell[0],p.cell[1]);lit=!!st.live;owner=st.owner;}
        else lit=false;                                  // DARK is the default, always
      }
      states.push({source:p.source,x:p.x,y:p.y,lit,
        sprite:(s.type==='electric')?(lit?'lit':'dark'):(lit?'lit':'unlit'),owner});
      if(!lit)continue;
      const r=(s.type==='fuel')?R.fire:s.radius_cells;
      if(!r)continue;
      emitters.push({x:p.x,y:p.y,color:s.emit_color,r_cells:r,
        wobAmp:(s.type==='fuel')?0.22:s.flicker_amp});
    }
    return {emitters,states};
  }

  function indexOf(sources){
    const ix={};for(const s of sources)ix[s.source]=s;return ix;
  }

  return {normalize,resolve,indexOf,radiusClassOf,R};
})();
if(typeof module!=='undefined')module.exports=BOH_LIGHTREG;
