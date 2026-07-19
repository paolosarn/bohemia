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

  // dressAll: dress a generated population in place (agents from bohemia_agents)
  function dressAll(agents, wardrobe){
    agents.forEach(function(a){ a.outfit=outfitFor(a.seed, wardrobe, a.faction); });
    return agents;
  }

  var API={parse:parse,byLayer:byLayer,outfitFor:outfitFor,dressAll:dressAll,
    FACTION_DRESS:FACTION_DRESS,EXTRA:EXTRA,REQUIRED:REQUIRED};
  if(HASREQ) module.exports=API;
  root.BohemiaDress=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
