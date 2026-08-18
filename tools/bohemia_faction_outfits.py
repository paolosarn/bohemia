#!/usr/bin/env python3
"""BOHEMIA THIRTEEN OUTFITS YOU CAN TELL APART IN THE DARK (8/18/26, CHARACTER lane)

Backlog row SIL, second half. Paolo 7/19 STRUCTURE-NOT-COLOR, amended 8/15 to govern
IDENTITY: "every faction must be identifiable by SILHOUETTE -- garment shape,
proportion, headwear -- with colour as the BACK-UP channel, never the carrier."

MEASURED BEFORE ANYTHING WAS ASSIGNED, because the first read said it might be
impossible. tools/bohemia_silhouette_lever.js found only about SIX shape classes
above the separation floor, and there are THIRTEEN selectable factions -- nine long
coats scoring 0.0446 to four decimals are one shape in nine colours. Assigning
thirteen fits on that evidence and hoping is how you ship six factions that read the
same and find out from him.

So tools/bohemia_faction_fits.js SEARCHED the space instead: 880 candidates (5 bodies
x 11 shoulder shapes x 4 heads x 4 legs), each rendered and scored on the FRONT width
profile, then a greedy farthest-point pick for the largest mutually-distinct set.

    floor 0.030  ->  19 distinguishable
    floor 0.040  ->  14 distinguishable, closest pair 0.0420
    floor 0.045  ->  11  -- NOT enough for thirteen

THE ANSWER IS FOURTEEN AT 0.040, so thirteen is reachable with one slot spare, and
the closest two factions sit THREE TIMES further apart than the 0.014 gap that made
two city residents read as the same person. The shape classes MULTIPLY against body
and legs; my own "only six classes" reading was the wrong conclusion from the right
number, and the search is what corrected it.

CONTENTS: the faction LIST is canon (engine/BOHEMIA_faction_graph.json, 13 selectable
+ 4 social forces that are members INSIDE other factions and by design carry no outfit
of their own). WHICH shape belongs to WHICH faction is taste, so every entry ships
draft:true and he retunes any line in the tab -- see the instrument below. The
agents module header reserves "what factions wear" to him by name, which is exactly
why this ships an INSTRUMENT and not a question (HE MUST BE ABLE TO DIRECT IT, 8/12):
WEAR IT puts a faction's fit on the player, he changes it with the wardrobe that is
already on the same screen, SAVE TO writes it back, EXPORT hands him the table.

THE TEST IS ONE TAP: the GREYSCALE button strips every colour off the board. The
valley opens at 06:00 and it is dark, so colour is the one channel that is not
reliably there. Thirteen people must still be thirteen people with it gone.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels. Every garment named
below is an existing st:'canon' entry in the alpha's own GARMENTS catalogue, chosen by
measuring the catalogue rather than by taste -- and five of them (TRADES APRON,
MOB PINSTRIPE SHIRT, SIGNAL RED, VESTMENT GOLD, MOSS GREEN) were AUTHORED FOR THESE
FACTIONS BY NAME and were sitting unused, which is the whole argument for looking in
the bank before drawing anything; every body is the ONE painted rig
reshaped by BODYVAR dials that already exist. The rendering reuses famPaintBody and
famPaintShadow, the family cast's own path, rather than a second painter beside it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): does not touch his painted art. Rendering goes
  through famPaintBody, which borrows G.bodyVar / G.age / window.G_WORN and restores
  all three plus the PD slots in a finally. No joint, bone or painted pixel is read or
  written here.
  built on: BAKED, BOH_BODYVAR
  joints: none named
  parts: none named

    python3 tools/bohemia_faction_outfits.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---------------------------------------------------------------- 1. the table
OLD_TBL = """window.FAMILY_CAST = FAMILY_CAST;"""

NEW_TBL = """window.FAMILY_CAST = FAMILY_CAST;

/* ===== THE THIRTEEN OUTFITS ==================================================
   Paolo 7/19 STRUCTURE-NOT-COLOR, amended 8/15 to govern IDENTITY: a faction is
   told apart by its OUTLINE, with colour as the back-up channel and never the
   carrier. The valley opens at 06:00 in the dark, which is why.
   NOT PICKED BY EYE. tools/bohemia_faction_fits.js rendered 880 candidate fits
   (5 bodies x 11 shoulder shapes x 4 heads x 4 legs) and searched for the biggest
   mutually-distinct set on the front width profile:
        floor 0.030 -> 19    floor 0.040 -> 14    floor 0.045 -> 11
   Thirteen factions, fourteen slots at 0.040, closest pair 0.0420 -- three times
   the 0.014 gap that made two city residents read as one person. The thirteen
   below are that measured set.
   THE FACTION LIST IS CANON (engine/BOHEMIA_faction_graph.json). The four social
   forces (Pures, Panthers, La Familia, Triads) are deliberately absent: they are
   members INSIDE other factions and wearing their own outline would break what
   they are.
   WHICH SHAPE BELONGS TO WHOM IS HIS. Every line is draft:true and every line is
   editable in the CHARACTER tab -- WEAR IT, change it in the wardrobe on the same
   screen, SAVE TO. Held by gates/faction_outfit_gate.js. */
var FACTION_LOOKS = [
  { faction:'Caravans', draft:true, age:'adult', shape:'broad / mantle / wide brim',
    why:'built for the road and the sun: load across the shoulders, brim against the sky',
    dials:{height:-0.30,belly:0.55,arms:0.30,shoulders:0.60,hips:0.15},
    worn:{hair:'DUSK SHAG',base:'DUST PLAID SHIRT',back:'OLIVE SHOULDER MANTLE',
          head:'CHINESE RICE FARMER HAT',legs:'DUST TROUSERS',feet:'SANDWALKERS'} },
  { faction:'Colorful', draft:true, age:'adult', shape:'small / long coat / knit cap / long hem',
    why:'smallest body carrying the most line: the one silhouette built to be seen on purpose',
    dials:{height:-0.60,belly:-0.30,arms:-0.30,shoulders:-0.40,hips:0.25},
    worn:{hair:'SHAG',base:'STRIPED TEE',outer:'BONE DUSTER',head:'BONE KNIT CAP',
          legs:'ANKLE WRAP SKIRT',feet:'BONE SNEAKERS'} },
  { faction:'Anarchists', draft:true, age:'adult', shape:'lanky / split-tail / knit cap',
    why:'the only torn hem in the valley -- the outline itself refuses to be tidy',
    dials:{height:0.45,belly:-0.45,arms:0.35,shoulders:-0.25,hips:-0.25},
    worn:{hair:'WOLF CUT',base:'BLACK TANK',outer:'SPLIT-TAIL DUSTER',
          head:'CHARCOAL WATCH CAP',legs:'DUST TROUSERS',feet:'RUST BOOTS'} },
  { faction:'Blues', draft:true, age:'adult', shape:'broad / mid coat / bare head',
    why:'the biggest headcount and the least performance: bulk, no signal, nothing on the head',
    dials:{height:-0.30,belly:0.55,arms:0.30,shoulders:0.60,hips:0.15},
    worn:{hair:'CROP',base:'MOSS GREEN SHIRT',outer:"DRIFTER'S COAT",
          legs:'DUST TROUSERS',feet:'FIELD BOOTS'} },
  { faction:'Homeless', draft:true, age:'adult', shape:'small / mantle / bare head / long hem',
    why:'a blanket over the shoulders reads as a mantle at this size, and it is the most Amalgamation-resistant thing anybody wears: nothing bought',
    dials:{height:-0.60,belly:-0.30,arms:-0.30,shoulders:-0.40,hips:0.25},
    worn:{hair:'LONG LOOSE',base:'TATTERED TEE',back:'SHOULDER MANTLE',
          legs:'ANKLE WRAP SKIRT',feet:'WRAPPED BOOTS'} },
  { faction:'Church', draft:true, age:'adult', shape:'tall / mantle / skull cap',
    why:'reads as vestment from across a street: tall, shoulders covered, head covered',
    dials:{height:0.75,belly:-0.25,arms:0.10,shoulders:0.25,hips:-0.10},
    worn:{hair:'ASH SWEEP',base:'VESTMENT GOLD SHIRT',back:'SHOULDER MANTLE',
          head:'BONE KNIT CAP',legs:'DUST TROUSERS',feet:'VESTMENT GOLD BOOTS'} },
  { faction:'Reds', draft:true, age:'adult', shape:'tall / long coat / bare head',
    why:'the money faction, not the military one: the tallest, narrowest column on the street',
    dials:{height:0.75,belly:-0.25,arms:0.10,shoulders:0.25,hips:-0.10},
    worn:{hair:'SLICK BACK',base:'SIGNAL RED SHIRT',outer:'BRICK LONGCOAT',
          legs:'DUST TROUSERS',feet:'SIGNAL RED BOOTS'} },
  { faction:'Cartel', draft:true, age:'adult', shape:'small / cape / knit cap',
    why:'small and covered, and it does not advertise: a shape that is hard to read on purpose',
    dials:{height:-0.60,belly:-0.30,arms:-0.30,shoulders:-0.40,hips:0.25},
    worn:{hair:'SLICK BACK',base:'FADED BLACK LONGSLEEVE',back:'STEEL ROAD CAPE',
          head:'CHARCOAL WATCH CAP',legs:'DUST TROUSERS',feet:'OXBLOOD BOOTS'} },
  { faction:'Trades', draft:true, age:'adult', shape:'broad / no coat / work cap',
    why:'a working body and a cap, nothing over it: a guild that never takes a public position wears no banner',
    dials:{height:-0.30,belly:0.55,arms:0.30,shoulders:0.60,hips:0.15},
    worn:{hair:'BUZZ CUT',base:'COPPER WORK SHIRT',head:'DUST WORK CAP',
          legs:'DUST TROUSERS',feet:'DUST BROWN BOOTS',waist:'SOOT TOOL BELT'} },
  { faction:'Mob', draft:true, age:'adult', shape:'lanky / cape / bare head / long hem',
    why:'the Strip: tall, caped and hemmed, and it is the only outline that reads as ownership',
    dials:{height:0.45,belly:-0.45,arms:0.35,shoulders:-0.25,hips:-0.25},
    worn:{hair:'SLICK BACK',base:'MOB PINSTRIPE SHIRT',back:'ROAD CAPE',
          legs:'ANKLE WRAP SKIRT',feet:'OXBLOOD BOOTS',waist:'LEATHER BELT'} },
  { faction:'Network', draft:true, age:'adult', shape:'tall / nothing / nothing',
    why:'the manufactured one, and it shows: no coat, no hat, no wear -- eerily clean, like the lights',
    dials:{height:0.75,belly:-0.25,arms:0.10,shoulders:0.25,hips:-0.10},
    worn:{hair:'TEMPLE TAPER',base:'STEEL WORK SHIRT',legs:'DUST TROUSERS',
          feet:'STEEL SNEAKERS'} },
  { faction:'Volunteers', draft:true, age:'adult', shape:'small / nothing / nothing',
    why:'resource-poor by design, and the outline says it: the least on anybody in the valley',
    dials:{height:-0.60,belly:-0.30,arms:-0.30,shoulders:-0.40,hips:0.25},
    worn:{hair:'BOWL CUT',base:'WHITE TEE',legs:'DUST TROUSERS',feet:'WHITE SNEAKERS'} },
  { faction:'Remnants', draft:true, age:'adult', shape:'broad / split-tail / field cap',
    why:'the floor of civilisation, still in the coat: the heaviest covered silhouette on the street',
    dials:{height:-0.30,belly:0.55,arms:0.30,shoulders:0.60,hips:0.15},
    worn:{hair:'BUZZ CUT',base:'OLIVE DRAB TEE',outer:'SPLIT-TAIL DUSTER',
          head:'STORM KNIT CAP',legs:'DUST TROUSERS',feet:'OLIVE BOOTS'} }
];
window.FACTION_LOOKS = FACTION_LOOKS;

/* HIS EDITS OUTRANK THE TABLE AND SURVIVE THE PHONE. Saving a fit writes the
   override here; the table above is only ever the starting point. */
var FACTION_LOOK_KEY = 'boh.factionlooks.v1';
function factionLooksLoad(){
  try{ var raw=localStorage.getItem(FACTION_LOOK_KEY); if(!raw) return;
    var o=JSON.parse(raw);
    FACTION_LOOKS.forEach(function(f){ if(o[f.faction]){
      f.worn=o[f.faction].worn||f.worn; f.dials=o[f.faction].dials||f.dials;
      f.age=o[f.faction].age||f.age; f.mine=true; } });
  }catch(e){}
}
function factionLooksSave(name){
  var f=FACTION_LOOKS.filter(function(x){return x.faction===name;})[0];
  if(!f) return false;
  f.worn=Object.assign({},window.G_WORN||{});
  f.dials=Object.assign({},G.bodyVar||{});
  f.age=G.age||'adult'; f.mine=true;
  try{
    var o={}; try{o=JSON.parse(localStorage.getItem(FACTION_LOOK_KEY)||'{}');}catch(e){}
    o[name]={worn:f.worn,dials:f.dials,age:f.age};
    localStorage.setItem(FACTION_LOOK_KEY,JSON.stringify(o));
  }catch(e){}
  return true;
}
window.factionLooksSave = factionLooksSave;"""

# ---------------------------------------------------------------- 2. the markup
OLD_HTML = """      <div class="row"><b>THE FAMILY</b><span class="mini">father, mother, brother, sister &mdash; the cold open cast, on the one rig. tap any one to turn it.</span></div>
      <div id="familyCast"></div>"""

NEW_HTML = """      <div class="row"><b>THE FAMILY</b><span class="mini">father, mother, brother, sister &mdash; the cold open cast, on the one rig. tap any one to turn it.</span></div>
      <div id="familyCast"></div>
      <div class="row"><b>THE THIRTEEN OUTFITS</b><span class="mini">every faction, told apart by its OUTLINE and not its colour. tap one to turn it.</span></div>
      <div class="row" style="gap:6px;display:flex;align-items:center;flex-wrap:wrap">
        <button id="facGrey" class="opt" style="border-color:#8fe89a">&#9680; COLOUR OFF &mdash; THE TEST</button>
        <button id="facExport" class="opt">EXPORT .TXT</button>
        <span id="facStat" class="mini"></span>
      </div>
      <div id="outfitBoard"></div>
      <div class="mini" id="facNote" style="line-height:1.55;max-width:min(94vw,440px);margin:4px auto 0"></div>"""

# ---------------------------------------------------------------- 3. the board
OLD_BUILD = """window.famBuild = famBuild;"""

NEW_BUILD = """window.famBuild = famBuild;

/* ===== THE OUTFITS BOARD =====================================================
   HE MUST BE ABLE TO DIRECT IT (Paolo 8/12, LOCKED): "what factions wear" is
   reserved to him by name in the agents module, so this is not a question with
   his name on it -- it is the instrument. WEAR IT drops a faction's fit onto the
   player, he changes it with the WARDROBE that is already on this same screen,
   SAVE TO writes it back and it survives the phone, EXPORT hands him the table.
   COLOUR OFF is the test in one tap, because the valley is dark and a cast that
   only separates in daylight does not separate.
   Rendering is famPaintBody -- the family cast's own path, not a second painter. */
var FAC_CARDS = [];
function outfitBuild(){
  var host = document.getElementById('outfitBoard');
  if (!host || !window.drawChar || typeof FACTION_LOOKS === 'undefined') return;
  factionLooksLoad();
  host.innerHTML = ''; FAC_CARDS.length = 0;
  var DIRS8 = ['S','SE','E','NE','N','NW','W','SW'];
  FACTION_LOOKS.forEach(function(f){
    var m = { role:f.faction, name:f.faction, age:f.age||'adult', dials:f.dials, worn:f.worn };
    var card = document.createElement('div'); card.className = 'famCard';
    var stage = document.createElement('div'); stage.className = 'famStage';
    var sh = document.createElement('canvas'); sh.className='famShadow'; sh.width=112; sh.height=112;
    var bd = document.createElement('canvas'); bd.className='famBody';   bd.width=112; bd.height=112;
    bd.setAttribute('data-faction', f.faction);
    stage.appendChild(sh); stage.appendChild(bd);
    famPaintShadow(sh);
    famPaintBody(bd, m, 'S');
    var d = 0;
    stage.onclick = function(){ d=(d+1)%8; famPaintBody(bd, m, DIRS8[d]);
      lbl.textContent = f.faction.toUpperCase() + ' \\u00b7 ' + DIRS8[d]; };
    var lbl = document.createElement('div'); lbl.className='famRole';
    lbl.textContent = f.faction.toUpperCase() + ' \\u00b7 S';
    var shp = document.createElement('div'); shp.className='famName'; shp.textContent = f.shape || '';
    var dr  = document.createElement('div'); dr.className='famDraft';
    dr.textContent = f.mine ? 'yours' : 'draft fit';
    /* THE DIRECTING HALF. Two buttons and the wardrobe he already has. */
    var bar = document.createElement('div'); bar.style.cssText='display:flex;gap:4px;justify-content:center;margin-top:3px';
    var wear = document.createElement('button'); wear.className='opt'; wear.style.cssText='font-size:9px;padding:3px 6px';
    wear.textContent='WEAR IT';
    wear.onclick=function(ev){ ev.stopPropagation();
      window.G_WORN = Object.assign({}, f.worn);
      G.bodyVar = Object.assign({}, f.dials);
      G.age = f.age || 'adult';
      ['shirt','jacket','pants','shoes','hat','glasses','hair'].forEach(function(s){
        if (s in G.equipped) G.equipped[s]=''; });
      try{ rebuildFromRig(); }catch(e){}
      try{ HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); }catch(e){}
      try{ if(window.renderAll) renderAll(); else if(window.paintChar) paintChar(); }catch(e){}
      facSay('wearing ' + f.faction + '. change it in the WARDROBE below, then SAVE TO ' +
             f.faction.toUpperCase() + '.');
      window.scrollTo(0,0);
    };
    var save = document.createElement('button'); save.className='opt'; save.style.cssText='font-size:9px;padding:3px 6px';
    save.textContent='SAVE TO';
    save.onclick=function(ev){ ev.stopPropagation();
      if(factionLooksSave(f.faction)){ dr.textContent='yours';
        famPaintBody(bd, {role:f.faction,name:f.faction,age:f.age,dials:f.dials,worn:f.worn}, 'S');
        facSay(f.faction + ' now wears what you have on. it stays on this phone.'); }
    };
    bar.appendChild(wear); bar.appendChild(save);
    card.appendChild(stage); card.appendChild(lbl); card.appendChild(shp);
    card.appendChild(dr); card.appendChild(bar);
    host.appendChild(card);
    FAC_CARDS.push({cv:bd, look:f});
  });
  var note = document.getElementById('facNote');
  if (note) note.textContent =
    'These are the 13 factions that can be joined. The four supremacist groups are ' +
    'not here on purpose: they sit INSIDE other factions, so an outline of their own ' +
    'would give them away. Every fit was measured, not eyeballed: 880 combinations ' +
    'rendered, the 14 most different picked, 13 handed out. The closest two are three ' +
    'times further apart than the two neighbours that used to look like one person.';
}
window.outfitBuild = outfitBuild;
function facSay(s){ var e=document.getElementById('facStat'); if(e) e.textContent = s; }
/* ONE TAP TAKES THE COLOUR AWAY, because that is the actual test and he should not
   have to take a screenshot into an editor to run it. */
function facGreyToggle(){
  var host=document.getElementById('outfitBoard'); if(!host) return;
  var on = host.style.filter.indexOf('grayscale') < 0;
  host.style.filter = on ? 'grayscale(1)' : '';
  var b=document.getElementById('facGrey');
  if(b) b.textContent = on ? '\\u25d1 COLOUR BACK ON' : '\\u25d0 COLOUR OFF \\u2014 THE TEST';
  facSay(on ? 'colour is gone. thirteen outlines, and they still have to be thirteen people.' : '');
}
function facExport(){
  var L=['BOHEMIA THE THIRTEEN OUTFITS','', 'faction | shape | body | worn'];
  (window.FACTION_LOOKS||[]).forEach(function(f){
    var w=[]; for(var k in f.worn) w.push(k+'='+f.worn[k]);
    L.push(f.faction + ' | ' + (f.shape||'') + ' | ' +
      JSON.stringify(f.dials) + ' | ' + w.join(', ') + (f.mine?'   [YOURS]':'   [draft]'));
  });
  var blob=new Blob([L.join('\\n')+'\\n'],{type:'text/plain'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='BOHEMIA_THE_THIRTEEN_OUTFITS.txt'; a.click();
  facSay('exported.');
}"""

# ------------------------------------------------------------ 4. wire the boot
OLD_BOOT = """    setTimeout(function(){ try { window.famBuild(); } catch(e){} }, 1300);"""
NEW_BOOT = """    setTimeout(function(){ try { window.famBuild(); } catch(e){} }, 1300);
    setTimeout(function(){ try { window.outfitBuild(); } catch(e){} }, 1500);
    setTimeout(function(){
      var g=document.getElementById('facGrey');   if(g) g.addEventListener('click', facGreyToggle);
      var x=document.getElementById('facExport'); if(x) x.addEventListener('click', facExport);
    }, 1600);"""


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    applied, missed = [], []
    for label, old, new in [
        ('the thirteen measured fits + his override store', OLD_TBL, NEW_TBL),
        ('THE THIRTEEN OUTFITS section in the CHARACTER tab', OLD_HTML, NEW_HTML),
        ('the board, WEAR IT / SAVE TO / COLOUR OFF / EXPORT', OLD_BUILD, NEW_BUILD),
        ('the board builds at boot', OLD_BOOT, NEW_BOOT),
    ]:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)
    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('FACTION OUTFITS: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('FACTION OUTFITS: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
