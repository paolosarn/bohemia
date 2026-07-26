// BOHEMIA PROP SCALE — ITEM SCALE LAW resolver (v2, 7/16/26)
// Paolo's 848 scale flags split on one fault line (ITEM SCALE LAW, 7/13):
//   BIG   (542) = hand objects rendered at a full cell -> render sub-cell.
//   SMALL (306) = structures rendered as 1-cell props   -> take real footprints.
//
// v1 could only act when the CALLER already knew the family, and it only knew
// what to do with 'vehicle'. So most of Paolo's 306 SMALL flags resolved to
// nothing. This is the missing middle: pack -> family -> policy. Nothing here
// invents a verdict: the flags are his, the policies are his law text, the
// classifier only reads his own pack names.
const BOH_SCALE=(function(){
  const ITEM_SCALE=0.55;                 // Paolo's law: hand objects ~0.55 cell

  // ---- pack -> family (reads Paolo's own pack names, first match wins) -----
  const FAMILY_RULES=[
    [/abandoned car|abandoned card|vehicle|car wreck/i, 'vehicle'],
    [/roof/i,                                           'roof'],
    [/broken wall|broken building wall|ruined building part|scrap wall|panel/i,'wall'],
    [/chain link|fence|palisade|wire/i,                 'fence'],
    [/dead tree|nature prop|tree/i,                     'tree'],
    [/market stall|port market/i,                       'stall'],
    [/cargo|container/i,                                'container'],
    // Everything below is a hand object / small prop by Paolo's own law text:
    // "jars, bottles, food, drinks, supplies, loot, blood splats, screens,
    //  small props".
    [/survival|jar|bottle|crate|barrel|supplies|food|drink|cafe|loot|weapon|pot|skeleton|bone|computer|screen|zombie|blood|gore|workbench|tool|trash|debris|gauge|meter|pipe|cable|wiring|furniture|fixture|camp|tent|ember|particle|light source|fire barrel|emergency|warning sign|hazard|street prop|miscellaneous|grass|ground|garden|crop|winter/i,'item'],
  ];
  function familyOf(pack){
    for(const r of FAMILY_RULES) if(r[0].test(pack)) return r[1];
    return null;                          // unmapped: reported, never guessed
  }

  // ---- family -> policy (straight out of Paolo's law text) ----------------
  // fp marked RESEARCHED = real-world dimensions at 1 cell ~ 1m, TUNABLE
  // [PENDING Paolo]. The car 2x3 is his, locked, quoted: "2x3 i told you".
  const POLICY={
    vehicle:  {mode:'FOOTPRINT', fp:[3,2], src:'PAOLO LOCKED — cars 2x3 law'},
    wall:     {mode:'SURFACE', layer:'wall', src:'law text: walls render as surface cells'},
    roof:     {mode:'SURFACE', layer:'roof', src:'law text: roofs render as surface cells'},
    fence:    {mode:'RUN',     src:'law text: fences as run pieces'},
    stall:    {mode:'FOOTPRINT', fp:[3,3], src:'RESEARCHED market stall ~3x3m [PENDING Paolo]'},
    tree:     {mode:'FOOTPRINT', fp:[2,2], src:'RESEARCHED mature canopy ~2m [PENDING Paolo]'},
    container:{mode:'FOOTPRINT', fp:[6,2], src:'RESEARCHED ISO container 6.06x2.44m [PENDING Paolo]'},
    item:     {mode:'ITEM', scale:ITEM_SCALE, src:'PAOLO LOCKED — ITEM_SCALE 0.55'},
  };

  let FIXES={},PACKFAM={};
  function load(confirmedSet){
    FIXES={};PACKFAM={};
    for(const v of confirmedSet.verdicts){
      if(v.scale_fix) FIXES[v.pack+'#'+v.idx]=v.scale_fix;
      if(PACKFAM[v.pack]===undefined) PACKFAM[v.pack]=familyOf(v.pack);
    }
    return report(confirmedSet);
  }

  // {cellW,cellH,drawScale,mode,layer} — drawScale<1 = sub-cell sprite centered
  // in the footprint. SURFACE/RUN tell the renderer this is not a prop at all:
  // it belongs to a surface layer or a fence run, per the law.
  function sizeFor(pack,idx,family,declaredFp){
    const fam=family||PACKFAM[pack]||familyOf(pack);
    const fix=FIXES[pack+'#'+idx];
    let w=(declaredFp&&declaredFp[0])||1, h=(declaredFp&&declaredFp[1])||1;
    let drawScale=1,mode='PROP',layer=null;
    const pol=POLICY[fam];

    // LAW ORDER (Paolo's rule 3): his per-tile flag overrides any default.
    if(fix&&fix.mode==='ITEM_SCALE'){                 // his explicit BIG flag
      drawScale=fix.render_scale||ITEM_SCALE; mode='ITEM';
      return {cellW:w,cellH:h,drawScale,mode,layer,family:fam};
    }
    // Otherwise the family policy rules, flagged or not. Law text: "structure
    // families NEVER render as 1-cell props" — that is a property of the
    // family, not of whether Paolo happened to flag that particular tile.
    if(!pol) return {cellW:w,cellH:h,drawScale:1,
      mode:(fix?'UNMAPPED':'PROP'),layer:null,family:fam};
    mode=pol.mode;
    if(pol.mode==='FOOTPRINT'){w=pol.fp[0];h=pol.fp[1];}
    else if(pol.mode==='SURFACE'){layer=pol.layer;w=1;h=1;}
    else if(pol.mode==='RUN'){w=1;h=1;}
    else if(pol.mode==='ITEM'){drawScale=pol.scale;}
    return {cellW:w,cellH:h,drawScale,mode,layer,family:fam};
  }

  // Coverage: does every one of Paolo's 848 flags resolve to something now?
  function report(confirmedSet){
    const r={flags:0,resolved:0,unmapped:0,byMode:{},unmappedPacks:{}};
    for(const v of confirmedSet.verdicts){
      if(!v.scale_fix) continue;
      r.flags++;
      const s=sizeFor(v.pack,v.idx,null,[1,1]);
      if(s.mode==='UNMAPPED'){r.unmapped++;r.unmappedPacks[v.pack]=(r.unmappedPacks[v.pack]||0)+1;}
      else r.resolved++;
      const k=(s.family||'?')+' -> '+s.mode;
      r.byMode[k]=(r.byMode[k]||0)+1;
    }
    return r;
  }

  return {load,sizeFor,report,familyOf,POLICY,ITEM_SCALE};
})();
if(typeof module!=='undefined')module.exports=BOH_SCALE;
