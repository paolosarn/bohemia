#!/usr/bin/env python3
"""
BOHEMIA — WIRE THE ROOM FLOOR INTO THE WALKED SURFACE (8/26/26, WORLD lane)

Paolo 8/26: "all the floors of the interior look like dog shit ... I don't know if you
have to, like, invent carpet too." Second time of asking; the first was 8/6.

WHAT THIS PATCH DOES, IN ONE SENTENCE: the floor stops being chosen by WHERE YOU ARE and
starts being chosen by WHAT ROOM YOU ARE IN.

    before   houseFloorAt(x,y)      -- a 4x4 patch position hash into ONE 20-tile pool.
                                      A living room, a hospital ward, a warehouse dock and
                                      a casino concourse all stood on the same floor.
    after    roomFloorAt(x,y,role)  -- the room's own role picks the MATERIAL, then the
                                      same patch hash picks a variant within it.

The role has existed the whole time (engine/bohemia_floorplan.js ZONES assigns living /
kitchen / bed / bath / shopfloor / lobby / ward / dock / atrium / stockroom, and every cell
carries `.role`), and its own meta has read `pending: 'wall/floor/door art per zone'` since
July. The information was there. Nothing spent it on the picture.

HIS TILE DOES NOT MOVE. HOUSE_FLOOR is his approved pool and it stays exactly where it was
always right -- the WET ROOMS, kitchen and bath. Everything this adds is material that did
not exist: carpet, wood, lino, slab, cooked by tools/bohemia_floor_cook.py after sweeping
every bank in the repo and finding zero carpet, zero wood floor, zero lino.

RE-RUNNABLE, AND REVERSED BY MARKER, NEVER BY CONTENT. The 8/25 materials patch broke its
own reversal the day the rule inside it changed name, because it matched on the body text
instead of the fence around it. Every block this writes is fenced by __ROOM_FLOOR__ and the
reversal deletes between the fences by regex, so the block can change freely.

    python3 tools/bohemia_city_room_floor_patch.py            # apply / re-apply
    python3 tools/bohemia_city_room_floor_patch.py --revert   # take it back out
"""
import json, os, re, sys

ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE  = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
BANK  = os.path.join(ROOT, 'banks', 'BOHEMIA_INTERIOR_FLOOR_POOL_8_26_26.txt')
ASSET = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_FLOORS.js')

OPEN, CLOSE = '/* __ROOM_FLOOR__ BEGIN */', '/* __ROOM_FLOOR__ END */'
FENCE = re.compile(re.escape(OPEN) + r'.*?' + re.escape(CLOSE), re.S)
TAG_OPEN, TAG_CLOSE = '<!-- __ROOM_FLOOR__ BEGIN -->', '<!-- __ROOM_FLOOR__ END -->'
TAG_FENCE = re.compile(re.escape(TAG_OPEN) + r'.*?' + re.escape(TAG_CLOSE), re.S)


def build_asset():
    """The art lives in slices/ as its own script, NOT inlined in the page. That is the
       8/6 repo-budget rule: this page is rewritten many times a day and must not carry
       megabytes of art it never edits. _config.yml already publishes all of slices/."""
    bank = json.load(open(BANK))
    js = ['/* BOHEMIA INTERIOR FLOOR POOL — cooked by tools/bohemia_floor_cook.py (8/26/26).',
          ' * ' + bank['why'],
          ' * REUSE CHECK: ' + bank['reuse_check'],
          ' * ACT 1: ' + bank['act1'],
          ' * SEAMLESS: ' + bank['seamless'],
          ' */',
          'window.FLOOR_POOL_B64=' + json.dumps(bank['pools']) + ';',
          'window.ROOM_FLOOR_MAP=' + json.dumps(bank['room_floor']) + ';',
          'window.ROOM_FLOOR_DEFAULT=' + json.dumps(bank['default_floor']) + ';']
    open(ASSET, 'w').write('\n'.join(js) + '\n')
    n = sum(len(v) for v in bank['pools'].values())
    return n, len(bank['room_floor'])


BLOCK = OPEN + r'''
/* THE FLOOR ANSWERS TO ITS ROOM (Paolo 8/26, second time of asking; first was 8/6
   "Tile wood and carpet bro ofc bro wtf"). houseFloorAt(x,y) took NO ROOM: a 4x4 patch
   hash into one 20-tile pool, so a living room, a hospital ward, a warehouse dock and a
   casino concourse were the same floor. The role was computed and thrown away.
   HIS TILE IS UNTOUCHED and keeps the rooms it was always right for -- kitchen and bath.
   Everything else stands on material that did not exist in this game yesterday. */
const FLOOR_IMG=(function(){
  const P=window.FLOOR_POOL_B64||{}, out={};
  for(const k in P) out[k]=P[k].map(function(b){
    const i=new Image(); i.src='data:image/png;base64,'+b; return i; });
  return out;
})();
function roomFloorAt(x,y,role){
  const map=window.ROOM_FLOOR_MAP||{};
  const mat=map[role]||window.ROOM_FLOOR_DEFAULT||'lino';
  /* THE WET ROOMS KEEP HIS TILE. Not a special case bolted on: 'tile' is a value in the
     map the cook wrote, so which rooms are tiled is one line in one table. */
  if(mat==='tile'){
    const n=HOUSE_FLOOR.length; if(!n) return null;
    const h=(Math.imul(Math.floor(x/4),73856093)^Math.imul(Math.floor(y/4),19349663))>>>0;
    const im=HOUSE_FLOOR[h%n];
    return (im&&im.complete&&im.naturalWidth)?im:null;
  }
  const pool=FLOOR_IMG[mat]; if(!pool||!pool.length) return null;
  /* SAME PATCH QUANTISATION THE REST OF THE INTERIOR USES -- ~4 cells share one tile, so
     a floor reads as a surface and not as confetti. The room picks the MATERIAL; the
     patch hash only picks which variant of it. */
  const h2=(Math.imul(Math.floor(x/4),2654435761)^Math.imul(Math.floor(y/4),40503))>>>0;
  const im2=pool[h2%pool.length];
  return (im2&&im2.complete&&im2.naturalWidth)?im2:null;
}
''' + CLOSE

GROUND_OLD = """    /* __HOUSE_FLOORS__ -- his tile first. A room is NEVER the street. */
    const hf=houseFloorAt(x,y);"""
GROUND_NEW = """    /* __HOUSE_FLOORS__ -- his tile first. A room is NEVER the street. */
    /* __ROOM_FLOOR__ CALL -- and the room decides which floor it is (8/26). */
    const hf=roomFloorAt(x,y,c.role);"""


def apply():
    n, roles = build_asset()
    s = open(PAGE, encoding='utf-8').read()
    s = FENCE.sub('', s)
    s = TAG_FENCE.sub('', s)
    s = s.replace(GROUND_NEW, GROUND_OLD)          # normalise before re-applying

    # 1. the asset script tag, right after the existing tiles script
    anchor = '<script src="BOHEMIA_CITY_TILES_01.js"></script>'
    if anchor not in s:
        print('FAIL: could not find the tiles script tag to anchor to'); sys.exit(1)
    s = s.replace(anchor, anchor + '\n' + TAG_OPEN +
                  '<script src="BOHEMIA_CITY_FLOORS.js"></script>' + TAG_CLOSE, 1)

    # 2. the picker, immediately after houseFloorAt so HOUSE_FLOOR is in scope
    anchor2 = 'function inFloorPool(role){ return IN_FLOORPOOL[role]||\'side\'; }'
    if anchor2 not in s:
        print('FAIL: could not find inFloorPool to anchor the picker to'); sys.exit(1)
    s = s.replace(anchor2, anchor2 + '\n' + BLOCK, 1)

    # 3. the call site
    if GROUND_OLD not in s:
        print('FAIL: could not find the interior GROUND PASS call site'); sys.exit(1)
    s = s.replace(GROUND_OLD, GROUND_NEW, 1)

    open(PAGE, 'w', encoding='utf-8').write(s)
    print('APPLIED  %d floor tiles in %d materials, %d room roles mapped'
          % (n, len(json.load(open(BANK))['pools']), roles))
    print('         asset: %s' % os.path.relpath(ASSET, ROOT))


def revert():
    s = open(PAGE, encoding='utf-8').read()
    s = FENCE.sub('', s)
    s = TAG_FENCE.sub('', s)
    s = s.replace(GROUND_NEW, GROUND_OLD)
    open(PAGE, 'w', encoding='utf-8').write(s)
    if os.path.exists(ASSET): os.remove(ASSET)
    print('REVERTED')


if __name__ == '__main__':
    revert() if '--revert' in sys.argv else apply()
