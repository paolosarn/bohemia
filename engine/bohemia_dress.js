// BOHEMIA DRESS — agents wear the canon wardrobe (7/19/26, LIFE session)
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, kept to the letter:
//   - The MACHINERY (parse the canon bank, assemble a legal outfit, dress a
//     population deterministically) is this module.
//   - The CONTENTS (which faction wears what, act/rarity assignment, who gets
//     the good coat) are Paolo's rulings. FACTION_DRESS ships EMPTY. Until he
//     rules, every pick is a uniform draw over the whole canon wardrobe.
//
// The wardrobe source of truth is the clothing factory's GARMENTS array in the
// alpha (that session's system, never edited here). tools/bohemia_wardrobe_
// extract.py banks the canon rows as NAME|layer|midhex; dress_gate.js keeps
// the bank fresh against the alpha's live canon count.
//
// OUTFIT RULES (grounded, not lore):
//   - Everyone owns base + legs + feet. Nobody walks the Mojave barefoot.
//   - Extras are probabilistic per layer (deterministic per agent seed):
//       outer 25% (desert nights are COLD: 15-20C swings; coats are survival,
//                  worn or carried), head 35% (sun), face 15% (dust — the
//                  valley throws dust storms), neck 12%, hands 10%, waist 20%.
//   - No color/act/rarity logic: those axes are Paolo's pending passes.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  function hash(a,b){ var h=((a>>>0)*73856093)^((b>>>0)*19349663);
    h=(h^(h>>>13))>>>0; return (h*2654435761)>>>0; }

  // parse the bank text -> [{n,layer,hex}]
  function parse(text){
    var out=[];
    String(text).split('\n').forEach(function(line){
      line=line.trim();
      if(!line||line[0]==='#'||line[0]==='=') return;
      var p=line.split('|');
      if(p.length===3) out.push({n:p[0],layer:p[1],hex:p[2]});
    });
    return out;
  }
  function byLayer(wardrobe){
    var m={}; wardrobe.forEach(function(g){ (m[g.layer]=m[g.layer]||[]).push(g); });
    return m;
  }

  // FACTION DRESS TABLE — EMPTY (CONTENTS-PAOLO'S). When Paolo rules faction
  // dress canon, rows land as faction -> {layer -> [allowed garment names]}
  // and pick() starts filtering. Nothing here guesses his canon.
  var FACTION_DRESS={};

  // extras: layer -> percent chance an agent wears one (see header grounding)
  var EXTRA={outer:25, head:35, face:15, neck:12, hands:10, waist:20};
  var REQUIRED=['base','legs','feet'];

  // ===== DRESS CODE BY RANK (Paolo 7/21/26, LIFE-facing ruling) =====
  // "rookies of the faction can wear whatever as long as half their body is
  // a certain color... veteran faction members actually have to wear most
  // of the clothes we give them." Two tiers, same MECHANISM-MINE law:
  //   ROOKIE:  free draw off the whole canon wardrobe (like today), but the
  //            outfit is nudged until >=50% of BODY SURFACE AREA reads the
  //            faction's ruled color.
  //   VETERAN: every layer Paolo specifies in the kit is FORCED to one of
  //            his named canon garments; anything he didn't specify stays a
  //            free draw. "Most of what we give them" = every given layer,
  //            literally.
  // Both tables ship EMPTY (CONTENTS-PAOLO'S): which faction gets which
  // color, and which exact garments a veteran wears, are his rulings alone.
  // Until populated the rank functions are IDENTICAL to outfitFor — no
  // ruling, no behavior change.
  var FACTION_COLOR={};        // faction -> '#rrggbb' (his color per faction)
  var FACTION_VETERAN_KIT={};  // faction -> {layer:[canon garment names]}

  // BODY SURFACE WEIGHTS — derived from the rig's own part-pixel geometry
  // (the same synthetic body used to prove garment shapes in
  // gates/structure_gate.js: head 24-31x6-14 minus the face cutout, neck
  // 26-29x15-16, torso 23-32x16-32, each leg 4x16, each foot 4x4). Torso
  // absorbs the neck (a coat collar reads as torso). Sums to 1.0 so
  // "half the body" has one honest meaning everywhere.
  var BODY_PX={torso:174, legs:128, feet:32, head:64};
  var BODY_TOTAL_PX=BODY_PX.torso+BODY_PX.legs+BODY_PX.feet+BODY_PX.head;
  var BODY_W={torso:BODY_PX.torso/BODY_TOTAL_PX, legs:BODY_PX.legs/BODY_TOTAL_PX,
    feet:BODY_PX.feet/BODY_TOTAL_PX, head:BODY_PX.head/BODY_TOTAL_PX};

  function hexRGB(hex){ return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]; }
  function colorDist(hexA,hexB){
    var a=hexRGB(hexA), b=hexRGB(hexB);
    return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2));
  }
  var COLOR_FAMILY_TOL=95;   // a "family" match (oxblood reds, olive greens...), not a hex-exact match
  function matchesFamily(hex,target){ return colorDist(hex,target)<=COLOR_FAMILY_TOL; }

  // regionColor: what a body region actually reads as. Torso: outer wins
  // over base (a coat covers the shirt). Head: either a head OR a face
  // piece counts (durag, helm, bandana, mask -- whichever is worn).
  function regionColor(outfit){
    var torso=(outfit.outer&&outfit.outer.hex)||(outfit.base&&outfit.base.hex)||null;
    var legs=outfit.legs?outfit.legs.hex:null;
    var feet=outfit.feet?outfit.feet.hex:null;
    var head=(outfit.head&&outfit.head.hex)||(outfit.face&&outfit.face.hex)||null;
    return {torso:torso,legs:legs,feet:feet,head:head};
  }
  function coverageFor(outfit,targetHex){
    if(!targetHex) return 0;
    var rc=regionColor(outfit), cov=0;
    ['torso','legs','feet','head'].forEach(function(reg){
      if(rc[reg]&&matchesFamily(rc[reg],targetHex)) cov+=BODY_W[reg];
    });
    return cov;
  }

  // rookieOutfit: free draw, then nudge toward >=50% faction-color coverage
  // by upgrading the HEAVIEST uncovered region first, using only canon
  // items (and only within FACTION_DRESS's whitelist if one exists). If the
  // wardrobe has no matching-color item in a region, that region is simply
  // skipped -- the mechanism never invents a garment.
  function rookieOutfit(seed, wardrobe, faction){
    var o=outfitFor(seed, wardrobe, faction);
    var target=FACTION_COLOR[faction];
    if(!target) return o;              // no ruling yet -- inert
    var L=byLayer(wardrobe);
    var order=['torso','legs','head','feet'];   // heaviest weight first
    var salt=301;
    for(var i=0;i<order.length && coverageFor(o,target)<0.5;i++){
      var reg=order[i];
      if(reg==='torso'){
        var outerHit=closestMatch(allowed(L.outer||[],faction),target);
        if(outerHit){ o.outer=outerHit; continue; }
        var baseHit=closestMatch(allowed(L.base||[],faction),target);
        if(baseHit) o.base=baseHit;
      } else if(reg==='legs'){
        var legsHit=closestMatch(allowed(L.legs||[],faction),target);
        if(legsHit) o.legs=legsHit;
      } else if(reg==='head'){
        var headHit=closestMatch(allowed(L.head||[],faction),target);
        if(headHit){ o.head=headHit; continue; }
        var faceHit=closestMatch(allowed(L.face||[],faction),target);
        if(faceHit) o.face=faceHit;
      } else if(reg==='feet'){
        var feetHit=closestMatch(allowed(L.feet||[],faction),target);
        if(feetHit) o.feet=feetHit;
      }
      salt++;
    }
    return o;
  }
  function closestMatch(list,target){
    var best=null,bd=1e9;
    for(var i=0;i<list.length;i++){ var d=colorDist(list[i].hex,target); if(d<bd){bd=d;best=list[i];} }
    return (best&&bd<=COLOR_FAMILY_TOL)?best:null;
  }

  // veteranOutfit: free draw for the baseline, then FORCE every layer
  // Paolo's kit specifies to one of his named canon garments (hashed pick
  // if he listed more than one option for that layer). Unspecified layers
  // stay a free draw -- "most of what we give them," not a costume snap.
  function veteranOutfit(seed, wardrobe, faction){
    var o=outfitFor(seed, wardrobe, faction);
    var kit=FACTION_VETERAN_KIT[faction];
    if(!kit) return o;                 // no ruling yet -- inert
    var byName={}; wardrobe.forEach(function(g){ byName[g.n]=g; });
    var i=0;
    for(var layer in kit){
      var names=kit[layer]; if(!names||!names.length){i++;continue;}
      var pickName=names[hash(seed,401+i)%names.length];
      var g=byName[pickName];
      if(g) o[layer]=g;                // silently skips a name that isn't canon (never invents one)
      i++;
    }
    // NO STRAY COVER-UP: a random outer roll must never hide the torso he
    // actually assigned. If the kit governs 'base' but says nothing about
    // 'outer', the free draw doesn't get to gamble away his identifying
    // color -- drop the unforced outer so the given base always reads.
    if(kit.base && !kit.outer) delete o.outer;
    return o;
  }

  // outfitForRanked: the one entry point dressAll actually calls. An agent
  // with no .rank renders EXACTLY as before (no ruling, no behavior change).
  function outfitForRanked(seed, wardrobe, faction, rank){
    if(rank==='veteran') return veteranOutfit(seed, wardrobe, faction);
    if(rank==='rookie') return rookieOutfit(seed, wardrobe, faction);
    return outfitFor(seed, wardrobe, faction);
  }

  function allowed(list, faction){
    if(faction!=null && FACTION_DRESS[faction]){
      var t=FACTION_DRESS[faction];
      var names=t[list.length?list[0].layer:'']||null;
      if(names){ var f=list.filter(function(g){return names.indexOf(g.n)>=0;});
        if(f.length) return f; }
    }
    return list;                        // no ruling -> the whole canon layer
  }
  function pick(list, faction, seed, salt){
    var l=allowed(list, faction);
    if(!l||!l.length) return null;
    return l[hash(seed,salt)%l.length];
  }

  // outfitFor: a full legal outfit off the canon wardrobe, deterministic per
  // seed. Returns {layer: {n,layer,hex}} — required layers always present.
  function outfitFor(seed, wardrobe, faction){
    var L=byLayer(wardrobe), o={};
    REQUIRED.forEach(function(layer,i){
      var g=pick(L[layer]||[], faction, seed, 11+i);
      if(g) o[layer]=g;
    });
    Object.keys(EXTRA).forEach(function(layer,i){
      if(!L[layer]||!L[layer].length) return;
      if(hash(seed,101+i)%100 < EXTRA[layer]){
        var g=pick(L[layer], faction, seed, 201+i);
        if(g) o[layer]=g;
      }
    });
    return o;
  }

  // dressAll: dress a generated population in place (agents from bohemia_agents).
  // a.rank is optional; absent/unknown ranks draw exactly as they always have.
  function dressAll(agents, wardrobe){
    agents.forEach(function(a){ a.outfit=outfitForRanked(a.seed, wardrobe, a.faction, a.rank); });
    return agents;
  }

  var API={parse:parse,byLayer:byLayer,outfitFor:outfitFor,dressAll:dressAll,
    FACTION_DRESS:FACTION_DRESS,EXTRA:EXTRA,REQUIRED:REQUIRED,
    FACTION_COLOR:FACTION_COLOR,FACTION_VETERAN_KIT:FACTION_VETERAN_KIT,
    BODY_W:BODY_W,colorDist:colorDist,matchesFamily:matchesFamily,
    regionColor:regionColor,coverageFor:coverageFor,
    rookieOutfit:rookieOutfit,veteranOutfit:veteranOutfit,outfitForRanked:outfitForRanked};
  if(HASREQ) module.exports=API;
  root.BohemiaDress=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
