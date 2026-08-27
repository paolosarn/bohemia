#!/usr/bin/env python3
"""
BOHEMIA CITY VALLEY PATCH -- THE GAME NEVER TOLD HIM THE OUTFITS EXIST.
(8/27/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_VALLEY__.

--------------------------------------------------------------------------
THE MEASUREMENT THAT CAUSED THIS, AND IT IS THE WHOLE REASON
--------------------------------------------------------------------------
The CHARACTER lane's handoff this week ended with a sentence aimed at
everybody: "IF YOU TAKE ONE THING FROM THIS HANDOFF: WHEN HE ASKS FOR
SOMETHING, CHECK LATER THAT IT ACTUALLY GOT WORN." Four garments cooked for
the Colorful in July, with his own words attached, worn by NOBODY for five
weeks.

So this lane pointed that at itself and asked the only question that matters
about two weeks of faction work: CAN THE PLAYER REACH ANY OF IT.

Measured on the real surface, cold start, no save:
    THE PLAYER STARTS AT CELL 48,48.
    Within SIX cells in every direction -- 169 cells -- ZERO people run with
    anybody at all.
    The nearest affiliated person is NINE CELLS away.
    The nearest faction base is the Colorful at 34,33: TWENTY NINE CELLS.
    REACH_CELLS is 12, so nobody within ~17 cells of the start CAN be
    affiliated with anyone. It is not sparse, it is arithmetically empty.
    FN is 128 fine tiles per cell, so that nearest base is 3,712 tiles of
    walking. The open-world research puts the useful distance between points
    of interest at 60-120 seconds of travel; this is ten to twenty times that.

EVERYTHING THIS LANE HAS BUILT -- belonging, the rungs, the wall, commitments,
word travelling, the canon wars, earned enemies, the board -- SITS BEHIND THAT
WALK, AND NOTHING ANYWHERE TELLS HIM IT IS THERE.

--------------------------------------------------------------------------
WHAT I AM NOT DOING, AND WHY
--------------------------------------------------------------------------
AFFILIATED_RATE (0.30) and REACH_CELLS (12) are both marked [PENDING Paolo] in
bohemia_agents.js. Widening either would make the whole valley affiliated by
my decision rather than his. MAP LAW: Claude never designs map layouts, so the
bases do not move and the player's spawn is not mine either.

So the dead zone is REPORTED, not tuned. What IS mine is the board, and the
board is where the game can stop pretending the valley is empty.

--------------------------------------------------------------------------
AND THE DESIGN CALL IS GROUNDED IN HIS OWN CANON, NOT IN A PREFERENCE
--------------------------------------------------------------------------
Should the game tell you where the outfits are, or should you find them?

REALISM FIRST, which is his identity law. Would somebody living in this valley
know whose ground is whose? YES. Everybody knows which neighbourhood belongs to
who -- that is the entire meaning of territory, and not knowing would be the
unrealistic option. This repo's own canon already says so out loud:
LIGHT=TERRITORY, CLUSTERED POWER (12% lit, OWNED, the network eerily perfect),
and NOBODY PATROLS THE DARK. Territory is visible by construction.

What you do NOT know is any of them personally, and that half is untouched:
you still have to walk there, turn up, and earn every rung.

AND IT IS A BEARING, NOT A WAYPOINT. The open-world research is consistent
that the working middle is between fully-guided (pins, markers, minimap icons)
and fully-organic: you see something in the distance, you go, and from there
you see the next thing. A compass direction and a plain-English distance is
what a person would actually carry in their head. A pin on a map is a HUD.

--------------------------------------------------------------------------
WHAT LANDS
--------------------------------------------------------------------------
The OUTFIT board grows a second half: THE VALLEY. Every outfit canon names,
which way their ground lies from where you are standing right now, how far in
plain words, and whether you have met anybody from them yet. The nearest one
is called out on its own, because a system with no next step is a system with
no next step.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_VALLEY__'

VALLEY_JS = """
/* ==== """ + MARKER + """ -- WHO IS OUT THERE, AND WHICH WAY ==============
   MEASURED BEFORE IT WAS BUILT. Cold start, real surface: the player begins at
   cell 48,48 and there is not one affiliated person within SIX CELLS in any
   direction. The nearest is nine cells out. The nearest faction base is
   twenty-nine cells away and REACH_CELLS is twelve, so a seventeen-cell radius
   around the player's own front door CANNOT contain anybody who runs with
   anybody. Two weeks of faction machinery sat behind that walk with nothing
   anywhere saying it was there.

   THE DIALS ARE NOT MINE (AFFILIATED_RATE and REACH_CELLS are both marked
   [PENDING Paolo]) AND THE MAP IS NOT MINE (MAP LAW). The board is.

   REALISM FIRST: a person living here would know whose ground is whose. That
   is what territory MEANS, and this repo's own canon says it already --
   LIGHT=TERRITORY, CLUSTERED POWER, owned, nobody patrols the dark. What you
   do not know is any of them personally, and that half is untouched.

   A BEARING, NOT A WAYPOINT. The useful middle between a HUD full of pins and
   a world with no signposts at all is the thing a person actually carries in
   their head: which way, and roughly how far. */

/* PLAIN WORDS FOR A DISTANCE. These are WORDS, so they ship as a real attempt
   he can edit (ALWAYS MAKE AN ATTEMPT, 8/11), and every threshold is a
   description of a number the map already decided rather than a dial. */
function ctFarWord(cells){
  return cells <= 3  ? 'RIGHT AROUND HERE'
       : cells <= 8  ? 'CLOSE'
       : cells <= 16 ? 'A WALK'
       : cells <= 30 ? 'A LONG WAY OFF'
                     : 'THE FAR SIDE OF THE VALLEY';
}
/* THE COMPASS. Eight points off the raw offset, which is what a person would
   say. Screen-space y grows southward in this world, so a base with a SMALLER
   y is NORTH of you -- getting that backwards would have shipped a board that
   confidently pointed the wrong way, and it is the kind of thing that reads
   fine in a diff. */
function ctBearing(dx, dy){
  var ns = dy < 0 ? 'NORTH' : dy > 0 ? 'SOUTH' : '';
  var ew = dx < 0 ? 'WEST'  : dx > 0 ? 'EAST'  : '';
  var ax = Math.abs(dx), ay = Math.abs(dy);
  if(ns && ew){
    if(ax > ay * 2) return ew;          /* mostly sideways */
    if(ay > ax * 2) return ns;          /* mostly up or down */
    return ns + ew;                     /* genuinely diagonal */
  }
  return ns || ew || 'RIGHT HERE';
}

/* EVERY OUTFIT THE VALLEY HOLDS, FROM WHERE YOU ARE STANDING NOW.
   Reads the bases the RUN already baked. Nothing is placed, moved or invented
   here; MAP LAW. Sorted nearest first, because the only question a player has
   in front of this list is "which one can I actually get to". */
function ctValleyRows(){
  var bases = (typeof ctBases === 'function') ? ctBases() : null;
  if(!bases) return null;
  var mine = null;
  try { if(typeof BohemiaBetween !== 'undefined') mine = BohemiaBetween.mine(); }
  catch(_e){}
  var cell = ctCell(), out = [];
  for(var name in bases){
    var b = bases[name];
    if(!b || b.x == null || b.y == null) continue;
    var dx = b.x - cell[0], dy = b.y - cell[1];
    var d  = Math.abs(dx) + Math.abs(dy);
    var isMine = !!(mine && String(name).toUpperCase().replace(/[\\s_]/g,'')
                          === String(mine).toUpperCase().replace(/[\\s_]/g,''));
    out.push({ who:String(name).toUpperCase(), cells:d, mine:isMine,
               where:isMine ? 'YOURS' : ctBearing(dx, dy),
               far:isMine ? 'THIS IS YOUR GROUND' : ctFarWord(d),
               met:ctMetAnyOf(name) });
  }
  out.sort(function(a,b){ return a.cells - b.cells; });
  return out;
}

/* HAVE YOU EVER MET ANYBODY FROM THEM. Read off the standing ledger, which is
   the only record that survives walking away -- CT_MET is per-person and the
   roster is per-cell, so neither can answer a question about an OUTFIT. */
function ctMetAnyOf(name){
  try {
    if(typeof BohemiaBelonging === 'undefined') return false;
    return BohemiaBelonging.gaveOf(ctBelongSave(), name) > 0;
  } catch(_e){ return false; }
}

function ctValleyHtml(){
  var rows = ctValleyRows();
  if(!rows || !rows.length) return '';
  var others = rows.filter(function(r){ return !r.mine; });
  var nearest = others[0];
  var h = '<div class="obhead2">THE VALLEY</div>';
  /* THE NEXT STEP, ON ITS OWN, because a list is not a direction. Measured
     reason it exists: from the player's start the nearest of these is twenty
     nine cells away, and nothing in the game has ever mentioned it. draft. */
  if(nearest)
    h += '<div class="obnext">NEAREST GROUND THAT BELONGS TO ANYBODY: <b>'
       + nearest.who + '</b>, ' + nearest.where + ', ' + nearest.far + '.</div>';
  for(var i=0;i<rows.length;i++){
    var r = rows[i];
    h += '<div class="obv' + (r.mine ? ' isyours' : '') + '">'
       + '<span class="obvwho">' + r.who + '</span>'
       + '<span class="obvwhere">' + r.where + ' \\u00b7 ' + r.far + '</span>'
       + '<span class="obvmet">' + (r.mine ? '' : (r.met ? 'YOU HAVE DEALT WITH THEM'
                                                         : 'NEVER MET')) + '</span>'
       + '</div>';
  }
  return h;
}
"""

VALLEY_CSS = """
/* ==== """ + MARKER + """ -- the valley half of the board. Same tokens, same
   geometry; nothing new is designed. */
#outfitpanel .obhead2{color:var(--acc);font-size:11px;letter-spacing:3px;
  padding:16px 4px 8px;border-top:1px solid var(--line);margin-top:10px}
#outfitpanel .obnext{font-size:10px;line-height:1.6;opacity:.85;padding:2px 4px 10px}
#outfitpanel .obnext b{color:var(--ink)}
#outfitpanel .obv{display:flex;justify-content:space-between;align-items:baseline;
  gap:6px;padding:5px 6px;border-bottom:1px solid var(--line);font-size:10px}
#outfitpanel .obv.isyours{opacity:.55}
#outfitpanel .obvwho{color:var(--ink);letter-spacing:2px;flex:0 0 auto}
#outfitpanel .obvwhere{color:var(--acc);letter-spacing:1px;text-align:right;flex:1 1 auto}
#outfitpanel .obvmet{font-size:8px;opacity:.5;letter-spacing:1px;flex:0 0 auto}
"""

# THE EMPTY STATE STOPS BEING A DEAD END. It was true and useless: it said
# nobody has a position on you and left him looking at a wall. Now it says the
# same true thing and then points at the valley.
OLD_EMPTY = """    return h + '<div class="obempty">NOBODY IN THIS VALLEY HAS A POSITION ON YOU'
      + ' YET.<br><br>You have not thrown in with anybody far enough for it to'
      + ' reach the people they are at odds with. The day you do, this fills up'
      + ' and it does not empty again.</div>';"""
NEW_EMPTY = """    /* """ + MARKER + """ -- AND THEN IT SAYS WHERE THEY ALL ARE.
       This used to end here, which was true and a dead end. Measured: from the
       player's start the nearest affiliated person is NINE CELLS away and the
       nearest base is TWENTY NINE, and no surface in the game had ever
       mentioned that any of them existed. An empty state that does not point
       anywhere is the same as no screen at all. */
    return h + '<div class="obempty">NOBODY IN THIS VALLEY HAS A POSITION ON YOU'
      + ' YET.<br><br>You have not thrown in with anybody far enough for it to'
      + ' reach the people they are at odds with. The day you do, this fills up'
      + ' and it does not empty again.</div>' + ctValleyHtml();"""

# and the same on the non-empty path
OLD_TAIL = """    h += '<div class="obrow ' + r.sign + '">'"""
ANCHOR_RETURN = """  return h;
}

function ctOutfitOpen(){"""
NEW_RETURN = """  /* """ + MARKER + """ -- the valley goes under your own positions on every
     path, not only the empty one. Once you HAVE enemies you need the list
     more, not less: it is the only place that says which of them you could
     actually walk to. */
  return h + ctValleyHtml();
}

function ctOutfitOpen(){"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if '__CITY_OUTFIT__' not in s:
        sys.exit('FAIL: the outfit board is not in this city -- run '
                 'tools/bohemia_city_outfit_patch.py first')

    for old, new, what in ((OLD_EMPTY, NEW_EMPTY, 'the empty state'),
                           (ANCHOR_RETURN, NEW_RETURN, 'the board return')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    js_at = '/* ==== __CITY_OUTFIT__ -- THE OUTFIT BOARD =================================='
    if js_at not in s:
        sys.exit('FAIL: could not find the outfit board block')
    s = s.replace(js_at, VALLEY_JS + '\n' + js_at, 1)

    css_at = '/* ==== __CITY_OUTFIT__ -- board chrome.'
    if css_at not in s:
        sys.exit('FAIL: could not find the board css')
    s = s.replace(css_at, VALLEY_CSS + css_at, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY VALLEY: the board says who is out there and which way')
    print('  TAB: RUN, the ⚔ OUTFIT chip. Second half of the board.')


if __name__ == '__main__':
    main()
