#!/usr/bin/env python3
"""
BOHEMIA VOTE TAB (8/7/26).

    "Are u gonna have me hunt for the changes or ur gonna put them in a voting tab"
                                                              -- Paolo, 8/7/26

HE IS RIGHT AND IT IS MY FAILURE. Five turns in a row I ended by telling him to open the
CITY tab and thumb thirty-one new icons. The CITY tab is the CITY BUILDER: the icons are
scattered across a map he has to navigate, at the size they render in play, with no thumbs
on them and no way to say anything about one. That is not a judging surface. That is a
scavenger hunt with my work hidden in it, and "he never digs" is the first line of how he
works.

There ARE sixteen judge pages in this repo, and every one of them is reached LIFE tab ->
hub -> the page. Three taps and a hub is still hunting. So: A TOP-LEVEL **VOTE** TAB, and
what it opens on is ONLY THE THINGS THAT HAVE NO VERDICT YET, newest first.

REUSE CHECK: cooks NO new graphic pixels. Every sprite on this page is the already-baked
hero out of banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt -- the same bytes the CITY
tab plants on a tile, so a thumb here is a thumb on what he actually sees in the builder.
Looked at tools/bohemia_district_hero_judge.py (the 7/23 judge, whose thumbs/comment/SUN/
export shell is the proven one and is reused here in shape) and tools/bohemia_judge_cards.py.
Nothing is drawn, generated or recoloured by this file.

WHAT IS UNJUDGED IS **DERIVED**, NEVER TYPED. A hand-written list of "the new ones" is the
house bug this repo keeps paying for, and it would go stale the first time he judged
anything. The judged set is read out of records/*VERDICT*.txt; everything in the hero bank
that no verdict file names is unjudged, and it sorts newest-baked first.

VERDICT WORKFLOW LAW: thumbs per item, a comment box per item, a global comment box at the
BOTTOM always, SUN MODE for daylight, and export as .txt (never .json).

  python3 tools/bohemia_vote_tab.py   ->  slices/BOHEMIA_VOTE_CURRENT.html
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
OUT = 'slices/BOHEMIA_VOTE_CURRENT.html'
RECORDS = 'records'

bank = json.load(open(BANK, encoding='utf8'))
heroes = [h for h in bank['heroes'] if h.get('b64')]

# ---- AND THE FACES (Paolo 8/28) ------------------------------------------------
# "from now on all the character face shit is always gonna have to come with a ... thumbs
#  up or a thumbs down bro like you can't be doing shit without ... my thumb ... if it's a
#  visual. and a lot of them I'm gonna be thumbing down so you gotta do better."
#
# THIS TAB HAS EXISTED SINCE 8/7 AND HAD NEVER HELD A SINGLE FACE. It read one bank, the
# district heroes, so every haircut, every portrait and the whole face maker shipped with
# no way for him to say yes or no to any of it. He asked for the thumb back on this lane
# and the thumb was never there in the first place.
# ONE SURFACE, NOT TWO. He never digs; a second judge page reached from somewhere else is
# the scavenger hunt this file was written to kill. Same grid, same thumbs, same note
# field, same @VERDICT grammar, same export.
FACEBANK = 'banks/BOHEMIA_FACE_CANDIDATES_8_28_26.txt'
faces = []
if os.path.exists(FACEBANK):
    try:
        faces = [x for x in json.load(open(FACEBANK, encoding='utf8'))['faces'] if x.get('b64')]
    except Exception:
        faces = []

# ---- WHO HAS ALREADY BEEN JUDGED, read off his own verdict files ----------------
# Any district named in a file with VERDICT in its name has had its say. This is
# deliberately generous: a false "judged" only ever hides something from the queue, and he
# can always ask for it back, whereas a false "unjudged" puts work in front of him twice
# and that is the thing he is annoyed about.
# A VERDICT IS DECLARED, NOT NARRATED, and this is the third time in one day this repo
# has landed on that. The first version of this scanned prose and marked 48 of 59 districts
# judged because their names appear in paragraphs. The second tightened to "a verdict token
# on the same line" and STILL got it wrong both ways: it missed "Chapel - 85 both" (no
# percent sign) and it invented rulings for `mountain` and `suburb` out of the sentence
# "70.1% of every mountain plot", which is a line about a BUG that reads exactly like a
# score. Prose numbers are subject-blind. So:
#
#     @VERDICT <district> <whatever he said>
#
# One line per ruling, in any file under records/. That is the whole grammar. The VOTE
# tab's own export emits this shape, so his .txt drops straight back in and the queue
# shrinks by itself.
# [a-z]+ cannot see an underscore, so `@VERDICT arterial_x YES` would have been read
# as a verdict on `arterial` -- his ruling silently attached to the wrong district.
DECLARED = re.compile(r'^\s*@VERDICT\s+([a-z0-9_]+)\b', re.I | re.M)

judged = set()
names = {h['district'] for h in heroes} | {x['id'] for x in faces}
for fn in sorted(os.listdir(RECORDS)):
    if not fn.lower().endswith(('.txt', '.md')):
        continue
    try:
        txt = open(os.path.join(RECORDS, fn), encoding='utf8', errors='ignore').read()
    except Exception:
        continue
    for m in DECLARED.finditer(txt):
        d = m.group(1).lower()
        if d in names:
            judged.add(d)

queue = [h for h in heroes if h['district'] not in judged]
done = [h for h in heroes if h['district'] in judged]
# newest first: the bank appends as the factory bakes, so later index = more recent
queue = list(reversed(queue))

LABEL = {h['district']: (h.get('label') or h['district']) for h in heroes}


def card(h, idx, judged_already):
    """ONLY THE SQUARE GRID IT WILL BE IN. THAT IS IT. (Paolo 8/11)

        "you're doing this weird shit while you're trying to present to me in a way.
         I'm not asking for -- when you show it to me only show me the square grid
         that it will be in that is it"

    He is right and it was my presentation, not the art. Every icon was sitting in a
    CARD: a bordered panel, a header row, a name chip, a NEW badge, inset padding and a
    tinted letterbox behind the sprite -- eight things that do not exist in the game,
    wrapped around the one thing that does. Judging art inside a frame the art will never
    have means judging the frame. It also hid the thing he has ruled on twice now: whether
    the tile FILLS ITS BOX and whether it BUTTS UP against its neighbour, which you
    physically cannot see when every tile is floated in its own padded card.

    So the surface IS the grid. Square cells, edge to edge, no gap, no padding, no
    border, no letterbox -- the map. The name is laid over the tile and only shows up
    when he needs it; the vote is the tile itself.
    """
    d = h['district']
    tag = 'judged' if judged_already else 'new'
    # THE CELL PAINTS ITS OWN GROUND, from the colour the factory measured off this very
    # tile's pad. That is what removes the black holes in the four corners of every
    # isometric diamond, and it is how the real renderer works: ground layer down, hero
    # stamped on top. Baking it into the sprite instead would blind every gate that reads
    # the alpha for geometry -- tried, and caught in one run.
    pad = h.get('pad') or '#1a1815'
    # EACH CELL IS ITS OWN TILE'S SHAPE. A sprite is one cell's isometric diamond, so a flat
    # subject is 2:1 and a tower is nearly square. Forcing every one into the same square box
    # letterboxes the flat ones -- which is the "floating in a box" he has been rejecting.
    # The cell takes the tile's aspect, the tile fills it edge to edge, and the published
    # ground colour paints the diamond's corners so the cell is solid.
    ar = '%d/%d' % (h.get('w') or 1, h.get('h') or 1)
    return ('<button class="cel %s" data-d="%s" title="%s" '
            'style="background:%s;aspect-ratio:%s">'
            '<img alt="%s" src="data:image/png;base64,%s">'
            '<span class="cn">%s</span><span class="mark"></span></button>'
            % (tag, d, d, pad, ar, d, _display_b64(h), d))


# EMBED AT DISPLAY SIZE, NOT BAKE SIZE (8/26 - the same lesson the hero wire
# patch learned 8/21 about the map). The bank sprite is ~1724px; a grid cell on
# his phone shows under 200px. Shipping the bake bytes made this page 29 MB
# with an EMPTY queue and put the whole publish surface 2 MB from its cap.
# 512px keeps tap-zoom sharp at better than 2x display. LANCZOS, not NEAREST:
# these are the factory's supersampled bakes, not native pixel art.
_DISPLAY_W = 512
_dcache = {}


def _display_b64(h):
    key = h['district']
    if key in _dcache:
        return _dcache[key]
    import base64 as _b64mod
    import io as _iomod
    from PIL import Image as _Img
    im = _Img.open(_iomod.BytesIO(_b64mod.b64decode(h['b64'])))
    if im.width > _DISPLAY_W:
        im = im.resize((_DISPLAY_W, max(1, round(im.height * _DISPLAY_W / im.width))),
                       _Img.LANCZOS)
    buf = _iomod.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    _dcache[key] = _b64mod.b64encode(buf.getvalue()).decode('ascii')
    return _dcache[key]


# AN EMPTY QUEUE IS THE GOAL, AND THE PAGE HAS TO SAY SO. When he clears the last item the
# grid wrapper renders as an empty box, which reads as broken rather than as finished --
# and it is the state he SHOULD be in most of the time.
cards_new = ('<h2>THE MAP ICONS &mdash; thumb what you like</h2><div class="grid">' + ''.join(card(h, i, False) for i, h in enumerate(queue))
             + '</div>') if queue else \
    '<div class="empty">Nothing waiting. You are all caught up.</div>'
cards_old = '<div class="grid">' + ''.join(card(h, i, True) for i, h in enumerate(done)) + '</div>'

# ---- THE FACE CELLS -------------------------------------------------------------
# A HAIRCUT IS FOUR PICTURES, NOT ONE (8/28: a haircut reads from every angle or it is not
# a haircut), so a haircut cell is a strip -- S, SE, E, N -- and it takes the strip's own
# aspect ratio rather than being letterboxed into a square. A face cell is square because
# a portrait is square. The cell is still edge to edge with no card around it (8/11).
def facecard(x, judged_already):
    tag = 'judged' if judged_already else 'new'
    ar = '%d/%d' % (x.get('w') or 1, x.get('h') or 1)
    return ('<button class="cel %s" data-d="%s" title="%s" '
            'style="background:#17150f;aspect-ratio:%s">'
            '<img alt="%s" src="data:image/png;base64,%s">'
            '<span class="cn">%s</span><span class="mark"></span></button>'
            % (tag, x['id'], x['label'], ar, x['label'], x['b64'], x['label']))


fq = [x for x in faces if x['id'] not in judged]
fd = [x for x in faces if x['id'] in judged]
_hairq = [x for x in fq if x.get('kind') == 'haircut']
_faceq = [x for x in fq if x.get('kind') != 'haircut']
faces_html = ''
if _hairq:
    faces_html += ('<h2>THE HAIRCUTS &mdash; %d of them, each shown four ways</h2>'
                   '<p class="blksub">front, three-quarter, side and back. thumb the '
                   'haircut, not the picture: if it only works from the front it is not '
                   'done.</p><div class="grid hair">%s</div>'
                   % (len(_hairq), ''.join(facecard(x, False) for x in _hairq)))
if _faceq:
    faces_html += ('<h2>THE FACES &mdash; %d people off the street</h2>'
                   '<p class="blksub">this is the portrait that pops up when somebody '
                   'talks to you, at the size it pops up.</p><div class="grid faces">%s</div>'
                   % (len(_faceq), ''.join(facecard(x, False) for x in _faceq)))
faces_done = ''.join(facecard(x, True) for x in fd)

# ---- DEMO BLOCKERS, ABOVE THE ICONS (8/9) -----------------------------------------
# Paolo 8/9: "First: DEMO BLOCKERS -- numbered, thumbable." A thumb is a verdict on a
# PICTURE; a blocker is a DECISION, and the ruled shape for a decision is the 8/4
# question format -- one question, two or three conclusions, answered with one letter,
# realistic option first and winning by default. So they render as lettered buttons in
# the same one-tap shell, ABOVE the art, because BOTTOM-UP says the thing he must not
# miss cannot be something he scrolls past.
# The list is DERIVED by tools/bohemia_demo_blockers.py -- rule one and it disappears
# from here on its own. This file only draws what that tool measured.
BLOCKERS = 'records/target/BOHEMIA_DEMO_BLOCKERS.json'
blockers = []
if os.path.exists(BLOCKERS):
    blockers = json.load(open(BLOCKERS, encoding='utf8')).get('blockers', [])


def blocker_card(b):
    opts = '\n'.join(
        '<button class="ob" data-o="%s"><b>%s.</b> %s<span class="obw">%s</span></button>'
        % (letter, letter, head, body)
        for letter, head, body in b.get('opts', []))
    why = ('<p class="why">%s</p>' % b['why']) if b.get('why') else ''
    return '''
<div class="blk" data-b="%s">
  <div class="blkhead"><span class="num">%d</span><span class="q">%s</span></div>
  %s
  <div class="opts">%s</div>
  <textarea class="bnote" rows="2" placeholder="or say it in your own words"></textarea>
  <div class="proof">%s</div>
</div>''' % (b['key'], b['n'], b['q'], why, opts, b.get('proof', ''))


blockers_html = ''
if blockers:
    blockers_html = ('<h2 class="blkh">DEMO BLOCKERS &mdash; %d things only you can decide'
                     '</h2><p class="blksub">Everything in flight in the WORLD lane that '
                     'needs you to finish it. One tap each. The first option is the '
                     'realistic one and wins if you say nothing.</p>%s'
                     '<h2>THE ICONS &mdash; thumb what you like</h2>'
                     % (len(blockers), '\n'.join(blocker_card(b) for b in blockers)))

HTML = '''<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA &mdash; VOTE</title>
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f}
  body.sun{--ink:#14120c;--bg:#e9e2cd;--card:#f4efdf;--line:#b9ae90}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace}
  header{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);
    padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  h1{font-size:14px;letter-spacing:2px;margin:0;flex:1}
  .count{color:var(--gold);font-size:12px}
  button{font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);
    border-radius:5px;padding:7px 10px;cursor:pointer}
  .wrap{padding:10px 12px 120px;max-width:640px;margin:0 auto}
  /* THE GRID IS THE SURFACE. Square cells, edge to edge, no gap and no border, so he is
     looking at the map and not at fifty-nine picture frames. */
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0;margin:0 0 4px;
        align-items:end;border:1px solid var(--line);border-radius:6px;overflow:hidden}
  /* A HAIRCUT STRIP IS FOUR HEADS WIDE, SO IT GETS THE WHOLE ROW. Two per row put each
     head at about fifty pixels, which is smaller than the thing renders in the game --
     judging art below the size it ships at is judging a thumbnail. One per row makes each
     head about a hundred, which is bigger than the RUN draws it, and that is the right
     way round. Faces are square and stack three across. */
  .grid.hair{grid-template-columns:1fr}
  .grid.faces{grid-template-columns:repeat(3,1fr)}
  .grid.hair .cn{font-size:11px;opacity:.85}
  .cel{position:relative;display:block;padding:0;margin:0;border:0;border-radius:0;
       background:#11110f;overflow:hidden;cursor:pointer;line-height:0}
  /* THE TILE FILLS THE 1x1 CELL (Paolo 8/11): "THESE HAVE TO FILL THE WHOLE 1X1 ICON GRID
     FOR THE CITY BUILDER SHIT." The sprite is one cell's isometric diamond, and a 2:1
     diamond in a square canvas leaves HEADROOM above it -- room a tall building uses and a
     flat road does not. Letterboxing that empty band into the grid is what made his tiles
     look like small pictures floating in boxes.
     `cover` + bottom anchoring fills the cell with the tile and crops the unused headroom,
     so a road cell is solid road and a tower still shows its top. The sprite is untouched:
     this is how the CELL presents it, which is the same split as the ground colour. */
  .cel img{width:100%;height:100%;display:block;image-rendering:pixelated}
  .cel .cn{position:absolute;left:0;right:0;bottom:0;font-size:9px;letter-spacing:1px;
           color:#e8e0cc;background:rgba(0,0,0,.55);padding:2px 4px;text-align:left;
           opacity:0;transition:opacity .12s;line-height:1.2}
  .cel:hover .cn,.cel.on .cn{opacity:1}
  .cel .mark{position:absolute;top:0;right:0;width:0;height:0;border-style:solid;
             border-width:0 22px 22px 0;border-color:transparent transparent transparent transparent}
  .cel.v-up   .mark{border-color:transparent #3f8b4a transparent transparent}
  .cel.v-cbb  .mark{border-color:transparent #a5871f transparent transparent}
  .cel.v-down .mark{border-color:transparent #8b3f3f transparent transparent}
  .cel.v-up,.cel.v-cbb,.cel.v-down{outline:2px solid rgba(255,255,255,.25);outline-offset:-2px}
  .cel.sel{outline:2px solid var(--gold);outline-offset:-2px;z-index:1}
  #notebar{margin:0 0 14px;padding:8px;border:1px solid var(--line);border-radius:6px;
           background:var(--card)}
  #notefor{display:block;font-size:10px;letter-spacing:2px;color:var(--gold);margin-bottom:5px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:8px;margin:0 0 12px;padding:10px}
  .cardhead{display:flex;align-items:center;gap:8px;margin-bottom:6px}
  .nm{letter-spacing:2px;font-size:13px;flex:1}
  .tag{font-size:10px;letter-spacing:1px;padding:2px 6px;border-radius:3px;border:1px solid var(--line)}
  .tag.new{color:#0d0d12;background:var(--gold);border-color:var(--gold)}
  .tag.judged{opacity:.5}
  .shot{display:flex;justify-content:center;background:rgba(0,0,0,.18);border-radius:6px;padding:6px}
  body.sun .shot{background:rgba(0,0,0,.06)}
  .shot img{max-width:100%;height:auto;image-rendering:pixelated}
  .thumbs{display:flex;gap:6px;margin:8px 0 6px}
  .tb{flex:1;text-align:center;padding:9px 4px;font-size:12px;letter-spacing:1px}
  .tb.on.up{background:#2f6b3a;border-color:#3f8b4a;color:#fff}
  .tb.on.cbb{background:#7a6320;border-color:#a5871f;color:#fff}
  .tb.on.down{background:#6b2f2f;border-color:#8b3f3f;color:#fff}
  .note{width:100%;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:vertical}
  h2{font-size:12px;letter-spacing:2px;opacity:.65;margin:22px 0 8px;border-top:1px solid var(--line);padding-top:14px}
  footer{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:1px solid var(--line);
    padding:8px 12px;display:flex;gap:8px;align-items:flex-end}
  footer textarea{flex:1;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:none}
  .empty{opacity:.6;padding:20px 0;text-align:center}
  .blkh{color:var(--gold);opacity:1;border-top:0;margin-top:4px}
  .blksub{opacity:.7;font-size:12px;margin:0 0 12px}
  .blk{background:var(--card);border:1px solid var(--gold);border-radius:8px;margin:0 0 12px;padding:10px}
  .blkhead{display:flex;gap:8px;align-items:flex-start;margin-bottom:6px}
  .num{color:#0d0d12;background:var(--gold);border-radius:3px;padding:1px 7px;font-size:12px;flex:none}
  body.sun .num{color:#f4efdf}
  .q{font-size:13px;line-height:1.35}
  .why{font-size:12px;opacity:.72;margin:0 0 8px}
  .opts{display:flex;flex-direction:column;gap:6px;margin-bottom:6px}
  .ob{text-align:left;padding:9px 10px;font-size:12px;line-height:1.35}
  .ob.on{background:#2f6b3a;border-color:#3f8b4a;color:#fff}
  .obw{display:block;opacity:.72;font-size:11px;margin-top:3px}
  .ob.on .obw{opacity:.9}
  .bnote{width:100%;background:transparent;color:var(--ink);border:1px solid var(--line);
    border-radius:5px;padding:6px;font:inherit;resize:vertical}
  .proof{font-size:10px;opacity:.4;margin-top:6px;word-break:break-all}
</style>
<header>
  <h1>VOTE</h1>
  <span class="count" id="count"></span>
  <button id="sun">SUN</button>
  <button id="exp">EXPORT</button>
</header>
<div class="wrap">
  <div id="blockers">__BLOCKERS__</div>
  <!-- THE COMMENT STAYS, THE CHROME GOES. The verdict-workflow law wants a comment per
       item; Paolo 8/11 wants nothing around the art but the square it lives in. So the
       note is not a box under every tile -- it is ONE field under the grid that follows
       whichever tile he last touched, named so he can see whose it is. -->
  <div id="notebar" hidden><span id="notefor"></span>
    <textarea class="note" id="tilenote" rows="2" placeholder="what is wrong with it (optional)"></textarea>
  </div>
  <div id="facelist">__FACES__</div>
  <div id="newlist">__NEW__</div>
  <div id="oldwrap"><h2>ALREADY JUDGED &mdash; here so you can change your mind</h2>__OLDFACES____OLD__</div>
</div>
<footer>
  <textarea id="global" rows="2" placeholder="anything about the whole batch"></textarea>
  <button id="exp2">EXPORT</button>
</footer>
<script>
(function(){
  /* *** HIS VERDICTS SURVIVE CLOSING THE TAB NOW (8/28). ***
     This page has been live since 8/7 and held every vote in a plain object -- thumb forty
     haircuts, tap away to the RUN, come back, and all of it is gone. A VERDICT THAT
     EVAPORATES IS NOT A VERDICT, and the cost is worse than the lost taps: the second time
     it happens he stops trusting the surface, which is the one thing a judging surface
     cannot afford. Found by a gate that tried to prove the vote was written down and
     could not.
     Everything he can enter is saved -- thumbs, the per-tile notes, the blocker choices
     and the batch comment -- keyed per surface, restored on load. Wrapped in try/catch
     because a phone in private mode throws on the first write, and losing persistence is
     survivable while a page that will not open is not. */
  var LSK='bohemia.vote.v1';
  var V={}, N={}, B={}, BN={}, SEL=null;
  function _load(){ try{ var raw=localStorage.getItem(LSK); if(!raw) return;
      var o=JSON.parse(raw)||{};
      V=o.V||{}; N=o.N||{}; B=o.B||{}; BN=o.BN||{};
      if(o.G){var g=document.getElementById('global'); if(g)g.value=o.G;}
    }catch(e){} }
  function _save(){ try{
      var g=document.getElementById('global');
      localStorage.setItem(LSK,JSON.stringify({V:V,N:N,B:B,BN:BN,G:g?g.value:''}));
    }catch(e){} }
  /* PAINT BACK WHAT HE ALREADY SAID, so a reload looks like where he left off rather than
     like a fresh queue. A restored vote he cannot SEE is the same bug wearing a hat. */
  function _paint(){
    document.querySelectorAll('.cel').forEach(function(c){
      var d=c.getAttribute('data-d'), v=V[d];
      c.classList.remove('v-up','v-cbb','v-down');
      if(v)c.classList.add('v-'+v); });
    document.querySelectorAll('.blk').forEach(function(blk){
      var k=blk.getAttribute('data-b'), o=B[k]; if(!o)return;
      blk.querySelectorAll('.ob').forEach(function(t){
        t.classList.toggle('on', t.getAttribute('data-o')===o); }); });
  }
  document.addEventListener('click',function(e){
    var ob=e.target.closest('.ob');
    if(ob){
      var blk=ob.closest('.blk'), k=blk.getAttribute('data-b');
      blk.querySelectorAll('.ob').forEach(function(t){t.classList.remove('on');});
      ob.classList.add('on'); B[k]=ob.getAttribute('data-o'); _save(); tally(); return;
    }
    // THE TILE IS THE VOTE. One tap cycles yes -> could be better -> no -> unvoted, so a
    // pass over sixty icons is sixty taps in the grid instead of a scroll through sixty
    // panels. A corner flag shows where he is; nothing is added around the art.
    var cel=e.target.closest('.cel'); if(!cel) return;
    var d=cel.getAttribute('data-d');
    var order=['up','cbb','down',null], cur=V[d]||null;
    var nxt=order[(order.indexOf(cur)+1)%order.length];
    cel.classList.remove('v-up','v-cbb','v-down');
    if(nxt){cel.classList.add('v-'+nxt); V[d]=nxt;} else {delete V[d];}
    _save();
    document.querySelectorAll('.cel.sel').forEach(function(x){x.classList.remove('sel');});
    cel.classList.add('sel');
    var nb=document.getElementById('notebar');
    document.getElementById('notefor').textContent=d.toUpperCase();
    document.getElementById('tilenote').value=N[d]||'';
    nb.removeAttribute('hidden'); SEL=d;
    tally();
  });
  document.addEventListener('input',function(e){
    if(e.target.classList.contains('bnote')){
      BN[e.target.closest('.blk').getAttribute('data-b')]=e.target.value; return;
    }
    if(e.target.id==='tilenote'){ if(SEL) N[SEL]=e.target.value; _save(); return; }
    if(e.target.id==='global'){ _save(); return; }
    if(!e.target.classList.contains('note')) return;
  });
  function tally(){
    /* THE FACES COUNT TOO (8/28). This read #newlist only, so the day the haircuts and
       the portraits arrived the header said "0 / 0 voted" over forty things waiting for
       a thumb -- a counter that cannot see half the queue is telling him he is done. */
    var SEL='#newlist .cel,#facelist .cel';
    var total=document.querySelectorAll(SEL).length;
    var done=Object.keys(V).filter(function(k){
      return document.querySelector('#newlist .cel[data-d="'+k+'"],#facelist .cel[data-d="'+k+'"]'); }).length;
    var bt=document.querySelectorAll('.blk').length, bd=Object.keys(B).length;
    document.getElementById('count').textContent=
      (bt? bd+' / '+bt+' decided  \\u00b7  ' : '')+done+' / '+total+' voted';
  }
  document.getElementById('sun').onclick=function(){document.body.classList.toggle('sun');};
  function exp(){
    var L=['BOHEMIA - VOTE','__STAMP__','',
           'YES = ship it.  COULD BE BETTER = ships frozen, fix later.  NO = kill it.',''];
    var blks=document.querySelectorAll('.blk');
    if(blks.length){
      L.push('DEMO BLOCKERS -- your answers:','');
      blks.forEach(function(b){
        var k=b.getAttribute('data-b'), a=B[k], n=(BN[k]||'').trim();
        if(!a && !n) return;
        var q=b.querySelector('.q').textContent.trim();
        L.push('@RULING '+k+' '+(a||'-')+'   ('+q+')');
        if(a){
          var on=b.querySelector('.ob.on');
          if(on) L.push('    = '+on.querySelector('b').nextSibling.nodeValue.trim());
        }
        if(n) L.push('    '+n);
      });
      L.push('');
    }
    document.querySelectorAll('.cel').forEach(function(c){
      var d=c.getAttribute('data-d'), v=V[d], n=(N[d]||'').trim();
      if(!v && !n) return;
      L.push('@VERDICT '+d+' '+(v?({up:'YES',cbb:'COULD BE BETTER',down:'NO'})[v]:'no-vote'));
      if(n) L.push('    '+n);
    });
    var g=(document.getElementById('global').value||'').trim();
    if(g){L.push('','ON THE WHOLE BATCH:',g);}
    if(L.length<6){L.push('(nothing voted yet)');}
    var blob=new Blob([L.join('\\n')],{type:'text/plain'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='BOHEMIA_VOTE.txt'; a.click();
  }
  document.getElementById('exp').onclick=exp;
  document.getElementById('exp2').onclick=exp;
  _load(); _paint();
  tally();
})();
</script>
'''

HTML = HTML.replace('__BLOCKERS__', blockers_html)
HTML = HTML.replace('__FACES__', faces_html)
HTML = HTML.replace('__OLDFACES__', faces_done)
HTML = HTML.replace('__NEW__', cards_new)
HTML = HTML.replace('__OLD__', cards_old)
HTML = HTML.replace('__STAMP__', '%d waiting, %d already judged' % (len(queue) + len(fq), len(done) + len(fd)))

open(OUT, 'w', encoding='utf8').write(HTML)
print('VOTE TAB: %s' % OUT)
print('  %d waiting for a vote: %s' % (len(queue), ' '.join(h['district'] for h in queue)))
print('  %d already judged: %s' % (len(done), ' '.join(sorted(h['district'] for h in done))))
print('  FACES: %d haircuts + %d faces waiting, %d already judged' % (len(_hairq), len(_faceq), len(fd)))
