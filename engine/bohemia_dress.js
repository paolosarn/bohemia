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

  // parse the bank text -> [{n,layer,hex,pattern}]. Widened 7/21 (dress-code-
  // by-rank) from a strict 3-field line to >=3: a 4th pattern field is now
  // written by the extractor, but any OLDER 3-field bank (or any consumer
  // that only ever cared about n/layer/hex) still parses exactly as before.
  function parse(text){
    var out=[];
    String(text).split('\n').forEach(function(line){
      line=line.trim();
      if(!line||line[0]==='#'||line[0]==='=') return;
      var p=line.split('|');
      if(p.length>=3) out.push({n:p[0],layer:p[1],hex:p[2],pattern:p[3]||''});
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

  // ===== THE LOOK (Paolo 7/21, second pass): three real modes, not one =====
  // "the reds can be the brightest red possible and cartel can be the
  // darkest red possible, maroon vibes. the colorful will be fun, they can
  // have a rainbow colorway... not even a single color, like rainbow
  // literally. i'd like to see gold STRIPES [for the mob] rather than all
  // gold. for all the factions... just make it realistic, not everyone is
  // gonna have a long shirt of the single color, this has to be realistic
  // to how people actually wear clothes."
  // FACTION_LOOK ships EMPTY (contents-Paolo's): faction -> one of
  //   {mode:'family', color:'#hex'}   -- a color FAMILY (his exact hex is
  //                                      the target; brightest/darkest are
  //                                      just which hex he picks)
  //   {mode:'stripe', color:'#hex'}   -- same coverage math, but the torso
  //                                      garment must ALSO carry a striped
  //                                      pattern (a suit reads as pinstripe,
  //                                      not a flood-fill)
  //   {mode:'rainbow'}                -- no target color at all; see below
  // FACTION_COLOR (the first pass) still works standalone as shorthand for
  // {mode:'family'} -- nothing that used it breaks.
  //
  // SIX FACTIONS RULED (7/21, his exact asks -- the other 7 stay unruled:
  // real color collisions turned up between them in review, parked for a
  // dedicated pass rather than silently baked):
  //   REDS     brightest red the wardrobe actually carries (SIGNAL RED
  //            SHIRT/BOOTS, cooked this turn -- the muted corpus had
  //            nothing bright enough yet)
  //   CARTEL   darkest red/maroon = the existing OXBLOOD ramp mid-tone,
  //            already worn by 6+ canon items
  //   CHURCH   a bright vestment gold, cooked distinctly apart from MOB's
  //            (>120 RGB units -- his exact ask, "have the church's gold
  //            different than the mob's gold")
  //   MOB      stripe mode on the existing MUSTARD ramp (duller, old-money)
  //            -- "gold stripes rather than all gold"
  //   CARAVANS his call, unchanged: the existing acc tan, blends with the
  //            desert on purpose
  //   COLORFUL rainbow mode -- see rainbowOutfit. Needed 5 new spectrum
  //            colorways cooked first: the whole 187-item wardrobe carried
  //            ZERO real blue/green/purple/yellow before this turn.
  var FACTION_LOOK={
    REDS:{mode:'family',color:'#dc2820'},
    CARTEL:{mode:'family',color:'#5c302a'},
    CHURCH:{mode:'family',color:'#ffd75c'},
    MOB:{mode:'stripe',color:'#b08a2a'},
    CARAVANS:{mode:'family',color:'#caa05a'},
    COLORFUL:{mode:'rainbow'}
  };

  function hexHSL(hex){
    var rgb=hexRGB(hex), r=rgb[0]/255,g=rgb[1]/255,b=rgb[2]/255;
    var mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, h=0,s=0;
    if(mx!==mn){ var d=mx-mn; s=l>0.5?d/(2-mx-mn):d/(mx+mn);
      if(mx===r) h=(g-b)/d+(g<b?6:0); else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4;
      h*=60; }
    return [h,s,l];
  }
  // vivid: saturated enough AND not crushed to near-black/near-white to
  // register as a real hue -- the exact opposite of "brown and shit."
  function isVivid(hex){ var hsl=hexHSL(hex); return hsl[1]>=0.35 && hsl[2]>=0.18 && hsl[2]<=0.82; }
  function hueBucket(hex){ return Math.floor(hexHSL(hex)[0]/60)%6; }   // 6 slices of the color wheel

  // REALISM ORDER (Paolo: "not everyone is gonna have a long shirt of the
  // single color"): a real outfit states its identity with ONE piece plus a
  // small tell, not matching separates. Torso always carries the most
  // weight (0.437, alone still under 50%); the cheapest way past the line
  // is one small accessory (feet or head, ~0.08-0.16 each), not a second
  // full garment. Legs are the LAST resort, only if the wardrobe has
  // nothing small that matches -- a shirt+pants matching set is the
  // exception, never the default.
  var REALISM_ORDER=['torso','feet','head','legs'];

  function closestMatch(list,target,requirePattern){
    var best=null,bd=1e9;
    for(var i=0;i<list.length;i++){
      if(requirePattern && list[i].pattern!==requirePattern) continue;
      var d=colorDist(list[i].hex,target); if(d<bd){bd=d;best=list[i];}
    }
    return (best&&bd<=COLOR_FAMILY_TOL)?best:null;
  }
  // NO STRAY COVER-UP, generalized (first caught in veteranOutfit 7/21):
  // torso is outer-over-base and head is head-over-face. Whichever one we
  // just forced, the OTHER must not be left standing if it would visually
  // win the region-color check instead. Returns true if a garment landed.
  function nudgeRegion(o,L,faction,reg,target,requirePattern){
    if(reg==='torso'){
      var outerHit=closestMatch(allowed(L.outer||[],faction),target,requirePattern);
      if(outerHit){ o.outer=outerHit; return true; }
      var baseHit=closestMatch(allowed(L.base||[],faction),target,requirePattern);
      if(baseHit){ o.base=baseHit; delete o.outer; return true; }
      return false;
    } else if(reg==='legs'){
      var legsHit=closestMatch(allowed(L.legs||[],faction),target,requirePattern);
      if(legsHit){ o.legs=legsHit; return true; }
      return false;
    } else if(reg==='head'){
      var headHit=closestMatch(allowed(L.head||[],faction),target);
      if(headHit){ o.head=headHit; return true; }
      var faceHit=closestMatch(allowed(L.face||[],faction),target);
      if(faceHit){ o.face=faceHit; delete o.head; return true; }
      return false;
    } else if(reg==='feet'){
      var feetHit=closestMatch(allowed(L.feet||[],faction),target);
      if(feetHit){ o.feet=feetHit; return true; }
      return false;
    }
    return false;
  }

  // FAMILY / STRIPE: nudge the realism order toward >=50% coverage of his
  // hex. Stripe mode additionally requires the TORSO piece specifically
  // (the one region big enough to read a pattern) to carry the pattern; the
  // plain-color fallback only fires when NO striped match exists at all --
  // once a real striped garment lands, torso being under 50% alone (it
  // always is: 0.437) is expected and the loop simply moves on to the next
  // region, it never un-does a placement that already succeeded.
  function familyOrStripeOutfit(seed, wardrobe, faction, look){
    var o=outfitFor(seed, wardrobe, faction);
    var L=byLayer(wardrobe), target=look.color;
    for(var i=0;i<REALISM_ORDER.length && coverageFor(o,target)<0.5;i++){
      var reg=REALISM_ORDER[i];
      var wantPattern=(look.mode==='stripe'&&reg==='torso')?'stripe':null;
      if(wantPattern){
        var placed=nudgeRegion(o,L,faction,reg,target,'stripe');
        if(!placed) nudgeRegion(o,L,faction,reg,target,null);   // no striped match exists -- settle for the color, never fabricate
      } else nudgeRegion(o,L,faction,reg,target,null);
    }
    return o;
  }

  // RAINBOW: no target hex. The outfit must read as genuinely multi-hued --
  // at least 3 of the 4 regions vivid AND in DIFFERENT 60-degree hue
  // buckets (so it's red+yellow+blue, never four shades of the same red).
  // Regions the wardrobe can't make vivid are left as the free draw --
  // COLORFUL never invents a garment either.
  function rainbowOutfit(seed, wardrobe, faction){
    var o=outfitFor(seed, wardrobe, faction);
    var L=byLayer(wardrobe);
    function usedBuckets(){ var rc=regionColor(o), bset={};
      ['torso','legs','head','feet'].forEach(function(r){ if(rc[r]&&isVivid(rc[r])) bset[hueBucket(rc[r])]=1; });
      return bset; }
    function vividCount(){ return Object.keys(usedBuckets()).length; }
    var order=['torso','legs','head','feet'];
    for(var i=0;i<order.length && vividCount()<3;i++){
      var reg=order[i], used=usedBuckets();
      var layerName=(reg==='torso')?['outer','base']:(reg==='head')?['head','face']:[reg];
      var placed=false;
      for(var li=0;li<layerName.length&&!placed;li++){
        var list=allowed(L[layerName[li]]||[],faction), best=null;
        for(var k=0;k<list.length;k++){ if(!isVivid(list[k].hex))continue;
          var hb=hueBucket(list[k].hex); if(!used[hb]){ best=list[k]; break; } }
        if(best){ o[layerName[li]]=best; placed=true;
          if(reg==='torso'&&layerName[li]==='base') delete o.outer;   // no stray cover-up
          if(reg==='head'&&layerName[li]==='face') delete o.head; }
      }
    }
    return o;
  }

  // rookieOutfit: dispatches by mode. No ruling for the faction (neither
  // table populated) -> the plain free draw, byte-identical to today.
  function rookieOutfit(seed, wardrobe, faction){
    var look=FACTION_LOOK[faction]||(FACTION_COLOR[faction]?{mode:'family',color:FACTION_COLOR[faction]}:null);
    if(!look) return outfitFor(seed, wardrobe, faction);
    if(look.mode==='rainbow') return rainbowOutfit(seed, wardrobe, faction);
    return familyOrStripeOutfit(seed, wardrobe, faction, look);
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
    FACTION_LOOK:FACTION_LOOK,
    BODY_W:BODY_W,colorDist:colorDist,matchesFamily:matchesFamily,
    hexHSL:hexHSL,isVivid:isVivid,hueBucket:hueBucket,
    regionColor:regionColor,coverageFor:coverageFor,
    rookieOutfit:rookieOutfit,veteranOutfit:veteranOutfit,outfitForRanked:outfitForRanked};
  if(HASREQ) module.exports=API;
  root.BohemiaDress=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
