// BOHEMIA TILE POOL — the art-bind choke point (7/16/26)
// Blockgen/plotgen emit SEMANTIC cells. This module is the only place a
// semantic cell turns into an actual tile. Two Paolo laws live here, both
// locked 7/14 in the verdict stream and both previously unimplemented:
//
// 1) WEATHER RARITY LAW (V6-0 verdict): parents 88% / weathered 12%.
//    UNIFORM SIBLING DRAW IS BANNED. The draw keys on the CELL, never on the
//    family, so weathered siblings scatter as rare instances instead of a
//    whole surface flipping to its weather sibling at once. That verdict
//    ("tile colors shifted") was the symptom of a family-keyed draw.
//
// 2) MARKINGS 30-YEAR LAW (V6 laws): every marking white/yellow washes
//    toward asphalt at 0.55. Act-1 is the base every act builds on, so the
//    wash is baked into the act-1 pool, not a render-time filter.
//
// PENDING Paolo:
//   - ASPHALT_BASE rgb (default below is the mid of the street pool's asphalt)
//   - whether act-2/act-3 pools re-wash at lower amounts or repaint fresh
const BOH_TILEPOOL=(()=>{
  const WEATHERED_SHARE=0.12;      // LAW — parents 88 / weathered 12
  // TAN WALL LAW (Paolo, 7/14): "85% of Vegas walls are desert yellow tan
  // brick vibes — create tan versions, keep originals; pool weighted 85% tan
  // / 15% original". Orthogonal to weathering: a wall is (tan|original) AND
  // (parent|weathered). Wall pools only — entries opt in by carrying `tan`.
  const TAN_SHARE=0.85;
  const MARK_WASH=0.55;            // LAW — 30 years of sun and tires
  const ASPHALT_BASE=[62,60,58];   // [PENDING Paolo]

  // ---- deterministic per-cell hash -----------------------------------------
  // Same cell + same seed = same tile forever (saves stay stable). Different
  // cells decorrelate: this is what kills the uniform sibling draw.
  // SEED ENTERS AFTER THE COORDS ARE AVALANCHED, deliberately. If the seed is
  // folded into the same low bits as x, then two small seeds only PERMUTE the
  // same multiset of draws instead of resampling the field, and every seed
  // hands back an identical weathered count. Coords mix first, seed second,
  // fmix32 last.
  function h32(x,y,seed,salt){
    let h=Math.imul((x>>>0)^0x2545F491,0x9E3779B1);
    h^=h>>>15;
    h=(h+Math.imul((y>>>0)^0x85EBCA77,0xC2B2AE3D))>>>0;
    h^=h>>>13;
    h=(h^Math.imul(seed>>>0,0x27D4EB2F))>>>0;
    h=Math.imul(h^(salt>>>0),0x165667B1);
    h^=h>>>16;h=Math.imul(h,0x85EBCA6B);
    h^=h>>>13;h=Math.imul(h,0xC2B2AE35);
    h^=h>>>16;
    return (h>>>0)/4294967296;
  }

  // ---- pool ----------------------------------------------------------------
  // entries: [{key, pack, idx, weathered:bool, tan?:bool, weight?}]
  // A "weathered" entry is a weather SIBLING of a parent tile (same art,
  // sun-bleached / cracked / stained variant).
  // A "tan" entry is the desert-yellow-tan repaint of a wall (TAN WALL LAW).
  // The two axes are INDEPENDENT and drawn on separate hash salts, so tan
  // walls weather at the same rate original walls do.
  function makePool(entries,opts){
    opts=opts||{};
    const share=opts.weatheredShare==null?WEATHERED_SHARE:opts.weatheredShare;
    const tanShare=opts.tanShare==null?TAN_SHARE:opts.tanShare;
    // The tan axis only exists if the pool was actually given tan siblings.
    const hasTanAxis=entries.some(e=>e.tan)&&entries.some(e=>!e.tan);
    const parents=entries.filter(e=>!e.weathered);
    const weathered=entries.filter(e=>e.weathered);
    if(!parents.length) throw new Error('tilepool: pool has no parent tiles');
    function wpick(list,u){
      let total=0;for(const e of list)total+=(e.weight==null?1:e.weight);
      let acc=0,t=u*total;
      for(const e of list){acc+=(e.weight==null?1:e.weight);if(t<acc)return e;}
      return list[list.length-1];
    }
    // pick(x,y,seed) — x,y are FINE CELL coords, not family ids. Law-critical.
    // Passing a family id here reintroduces the V6-0 bug: whole families flip
    // together instead of scattering per cell.
    function pick(x,y,seed){
      seed=seed>>>0;
      const useW=weathered.length>0 && h32(x,y,seed,1)<share;
      let list=useW?weathered:parents;
      if(hasTanAxis){
        // TAN WALL LAW — salt 3, independent of the weather draw (salt 1).
        const wantTan=h32(x,y,seed,3)<tanShare;
        const bucket=list.filter(e=>!!e.tan===wantTan);
        if(bucket.length) list=bucket;   // empty bucket = no sibling, keep what exists
      }
      return wpick(list,h32(x,y,seed,2));
    }
    return {pick,share,tanShare:hasTanAxis?tanShare:null,
      parents:parents.length,weathered:weathered.length,
      tan:entries.filter(e=>e.tan).length,size:entries.length};
  }

  // ---- 30-year marking wash ------------------------------------------------
  // Marking classifier: paint markings are the high-luma low-hue-spread pixels.
  // WHITE  = bright, near-grey.
  // YELLOW = bright, red>=green>>blue.
  // Asphalt, curbs, dirt and every non-marking pixel are left alone: this runs
  // on marking tiles, and it still must not eat the asphalt underneath them.
  function isMarkingPx(r,g,b){
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
    if(mx<120)return false;              // markings are the bright pixels
    const sat=mx===0?0:(mx-mn)/mx;
    if(sat<0.18)return true;             // white / near-grey
    if(b<g&&g<=r&&r-b>40&&sat>=0.18)return true; // yellow band
    return false;
  }
  function washRGB(rgb,amt,asphalt){
    amt=amt==null?MARK_WASH:amt;
    const a=asphalt||ASPHALT_BASE;
    return [
      Math.round(rgb[0]+(a[0]-rgb[0])*amt),
      Math.round(rgb[1]+(a[1]-rgb[1])*amt),
      Math.round(rgb[2]+(a[2]-rgb[2])*amt)
    ];
  }
  // rgba: Uint8ClampedArray/Array, length w*h*4. Mutates a COPY, returns it.
  // Transparent pixels are skipped (alpha is never touched, ever).
  function washMarkings(rgba,opts){
    opts=opts||{};
    const amt=opts.amount==null?MARK_WASH:opts.amount;
    const asphalt=opts.asphalt||ASPHALT_BASE;
    const out=(typeof Uint8ClampedArray!=='undefined'&&rgba instanceof Uint8ClampedArray)
      ? new Uint8ClampedArray(rgba) : rgba.slice(0);
    let touched=0;
    for(let i=0;i<out.length;i+=4){
      if(out[i+3]===0)continue;
      if(!isMarkingPx(out[i],out[i+1],out[i+2]))continue;
      const w=washRGB([out[i],out[i+1],out[i+2]],amt,asphalt);
      out[i]=w[0];out[i+1]=w[1];out[i+2]=w[2];
      touched++;
    }
    return {pixels:out,touched};
  }

  return {makePool,washMarkings,washRGB,isMarkingPx,h32,
    WEATHERED_SHARE,TAN_SHARE,MARK_WASH,ASPHALT_BASE};
})();
if(typeof module!=='undefined')module.exports=BOH_TILEPOOL;
