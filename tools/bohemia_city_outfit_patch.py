#!/usr/bin/env python3
"""
BOHEMIA CITY OUTFIT PATCH -- YOUR FACTION EARNS ITS OWN ENEMIES, AND THERE IS
A PLACE TO SEE THEM.  (8/26/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_OUTFIT__.

--------------------------------------------------------------------------
THE RULING, AND THE HALF THAT WAS STILL A LABEL
--------------------------------------------------------------------------
Paolo 8/26: "custom is your own personal faction!!!!!! and you can imagine if
you play the game with your custom faction the values arent just for you its
for how your factions treated bro."

The turn before this one made the OTHER outfits' wars real and put the word
CUSTOM on the card. But the standing was still a number about the player with
his outfit's name written next to it. Nothing your outfit did ever became a
fact about your outfit.

Canon has been asking for this in writing the entire time. The graph's note:
    "Player faction. No preset philosophy. IDENTITY EMERGES FROM THREE
     GENERATIONS OF ACTION."
relations: {}. Empty because it had not acted. Now it acts.

--------------------------------------------------------------------------
WHAT LANDS ON THE SURFACE
--------------------------------------------------------------------------
1. COMMITTING MAKES ENEMIES, AND THE CARD SAYS SO AS IT HAPPENS. Side with
   the Cartel and your outfit comes out of it at odds with the Caravans and
   the Remnants, by Davis's weak balance rule, not by anything I picked.
2. AN EARNED ENEMY IS PERMANENT, NOT A ONE-OFF CHARGE. From then on they are
   watching YOU, so everything you do reaches them and costs more when it
   does. That is the difference between a fine and a reputation.
3. THE OUTFIT BOARD. A player-facing panel, in the topbar beside PHONE, that
   shows your outfit's whole position across the valley: who you are up
   against, who you stand well with, which came from his lore and which you
   earned, and what each one cost. Until now the game could only ever show
   you one stranger at a time.

--------------------------------------------------------------------------
WHY THE BOARD IS A PANEL AND NOT A PHONE SCREEN
--------------------------------------------------------------------------
The phone is an IFRAME loading BOHEMIA_CURRENT_SLICE.html, which is another
lane's file. ONE SYSTEM, ONE SESSION: this does not touch it. The city owns
#savepanel, #keypanel and #pfpanel and this follows that exact pattern,
including registration in OUTSIDE_PANELS so a tap outside closes it (Paolo
8/24: "there shouldn't be any buttons that bring up any pop menus that don't
go away").

AND THE CHIP GOES IN THE TOPBAR, WHICH IS A ROW HE HAS COMPLAINED ABOUT. His
8/16 ruling was about BUILDER tools sitting under his thumb next to PHONE --
REROLL, KEY, UNDER, things for making the world rather than living in it.
Those went in the drawer. This is the opposite kind of thing: it is the
player's own standing, the same class of object as PHONE, and it is exactly
what his 8/26 ruling asked to be able to see.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_OUTFIT__'
IIFE_TAIL = "})(typeof globalThis!=='undefined'?globalThis:this);"
RESYNC = ['engine/bohemia_between.js', 'engine/bohemia_commitment.js']


def resync(src, mod):
    """ENGINE SYNC LAW: the inlined copy is the canonical body, byte for byte.

    Both modules grew this turn (the earned layer, and whoHears learning to ask
    watchers() instead of ripples()). An inlined copy that has drifted is the
    bug that meant NOBODY in Las Vegas had a faction for thirteen days with
    every gate green."""
    head = '/* ==== engine/' + os.path.basename(mod) + ' ==== */\n'
    canon = open(mod, encoding='utf-8').read().rstrip('\n')
    i = src.find(head)
    if i < 0:
        sys.exit('FAIL: no inlined ' + mod + ' block in the city')
    j = src.find(IIFE_TAIL, i)
    if j < 0:
        sys.exit('FAIL: no IIFE close after ' + mod)
    j += len(IIFE_TAIL)
    if src[i + len(head):j] == canon:
        return src, 0
    return src[:i + len(head)] + canon + src[j:], 1


# ----------------------------------------------- 1. THE SAVE REACHES THE ORGANS
# Both whoHears call sites and the cost call need the save now, because who is
# watching depends on what YOUR OUTFIT has done. Without it the earned half is
# computed and never consulted, which is this lane's oldest bug.
PAIRS = [
    ("""                  {ties:BohemiaTies, keyOf:ctVKey,
                   watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)});""",
     """                  {ties:BohemiaTies, keyOf:ctVKey,
                   /* """ + MARKER + """ -- and WHAT YOUR OWN OUTFIT HAS DONE.
                      watchers() needs the save to know which outfits are
                      watching YOU rather than the person in front of you. */
                   save:ctBelongSave(),
                   watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)});""",
     'the cost whoHears call'),

    ("""                  watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)}); }
  catch(_e){ return body; }""",
     """                  save:ctBelongSave(),   /* """ + MARKER + """ */
                  watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)}); }
  catch(_e){ return body; }""",
     'the display whoHears call'),

    ("""    return BohemiaCommitment.costs(nextState, heard, ctStandings(),
             { between:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null),
               sided:fid }) || [];""",
     """    return BohemiaCommitment.costs(nextState, heard, ctStandings(),
             { between:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null),
               save:ctBelongSave(),   /* """ + MARKER + """ */
               sided:fid }) || [];""",
     'the costs call'),
]

# ------------------------------------------- 2. COMMITTING IS WHAT EARNS THEM
OLD_COMMIT = """      try{ ctDeed('commit', CT_DEED_CLOUT['commit'], ctFid); }catch(_e){}"""
NEW_COMMIT = """      try{ ctDeed('commit', CT_DEED_CLOUT['commit'], ctFid); }catch(_e){}
      /* """ + MARKER + """ -- AND YOUR OUTFIT COMES OUT OF IT WITH ENEMIES.
         DAVIS 1967, WEAK STRUCTURAL BALANCE. The triad you just made:
             you --(+)--> this outfit      you took their side, out loud
             them --(-)--> their enemies   canon, already written
             you --(?)--> their enemies    a POSITIVE here would be the one
                                           triad weak balance forbids, so it
                                           resolves NEGATIVE.
         The enemy of my friend is my enemy, and that is the ONLY inference
         taken -- all-negative triads are permitted under weak balance, so
         being at odds with somebody never hands you an ally you did not earn.
         INSIDE THE `moved` BRANCH, beside the deed: a commitment that did not
         move is not a commitment and must not make anybody hate you. */
      try {
        if(typeof BohemiaBetween !== 'undefined'){
          CT_EARNED = BohemiaBetween.earn(sv, ctFid, r.state, (T && T.day) || 1);
          if(CT_EARNED && CT_EARNED.length) ctOutfitBadge();
        }
      } catch(_e){}"""

# ------------------------------------------------ 3. THE CARD SAYS WHY THEY CARE
OLD_HEARWHY = """  var via = heard[0].via==='watch' ? 'NOBODY. THEY WERE ALREADY WATCHING.'
          : heard[0].via==='home'  ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                   : 'SOMEBODY THEY WORK BESIDE';"""
NEW_HEARWHY = """  /* """ + MARKER + """ -- AND WATCHING WHAT, EXACTLY.
     There are now two reasons an outfit hears without a chain, and they are
     completely different facts about the player's life:
       THEM -- they have been watching the outfit you are siding with for
               years, because canon says they have a position on it.
       YOU  -- they have been watching YOU since the day you made them an
               enemy. This one is the whole point of an earned edge: it is not
               a fine you paid once, it is that you are now somebody they keep
               an eye on.
     A single sentence covering both would have been true and useless. */
  var ctWatchWhy = heard[0].watching && heard[0].watching.why;
  var via = heard[0].via==='watch'
              ? (ctWatchWhy === 'you'
                   ? 'NOBODY. THEY HAVE BEEN WATCHING YOU SINCE YOU MADE THEM.'
                   : 'NOBODY. THEY WERE ALREADY WATCHING.')
          : heard[0].via==='home'  ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                   : 'SOMEBODY THEY WORK BESIDE';"""

# ----------------------------------- 4. AND THE CARD OF SOMEBODY YOU HAVE WRONGED
OLD_UPAGAINST = """      var ctRip = BohemiaBetween.ripples(fid).filter(function(r){
        return r.sign === 'hostile'; });"""
NEW_UPAGAINST = """      /* """ + MARKER + """ -- the save, so an outfit YOU made an enemy of
         shows its own history too. ripples() merges his authored canon with
         what this run earned, authored always winning. */
      var ctRip = BohemiaBetween.ripples(fid, ctBelongSave()).filter(function(r){
        return r.sign === 'hostile'; });
      /* AND WHETHER THIS IS PERSONAL. An outfit your own outfit is at odds
         with is a different card from a stranger's, and it was reading
         identically. draft:true. */
      try {
        var ctMineRel = BohemiaBetween.between(fid, BohemiaBetween.mine(),
                                               ctBelongSave());
        if(ctMineRel && ctMineRel.sign === 'hostile'){
          body += ctRow('AND THEY ARE UP AGAINST YOU',
            ctMineRel.earned && ctMineRel.via
              ? 'SINCE YOU THREW IN WITH THE ' + String(ctMineRel.via).toUpperCase()
              : String(ctMineRel.word));
          body += ctNote(ctMineRel.note);
        }
      } catch(_e){}"""


# ------------------------------ 4b. NOBODY IS BORN IN THE PLAYER'S OWN GANG
# MEASURED, NOT SUSPECTED. A sweep of every base cell in the live world counted
# who runs with whom:
#     Cartel 1, Church 1, Colorful 1, CUSTOM 2, Homeless 2, Network 4,
#     Mob 1, Reds 2, Trades 2, Volunteers 1
# Two strangers in Las Vegas were running with CUSTOM -- the player's own
# personal faction, which Paolo named in capitals with six exclamation marks on
# 8/26 and which the player has not formed, named, or recruited a single person
# into. They joined it the way anybody joins anything here: by living near its
# base. That is correct machinery pointed at the one outfit it must not touch.
#
# THE FIX IS AT THE ASSIGNMENT, NOT ON THE MAP. MAP LAW: Claude never designs
# map layouts. The Custom base stays exactly where the run put it -- it is YOUR
# base and it belongs on the map. It is simply not a candidate for somebody
# else's allegiance. People near it fall to whichever other outfit holds that
# ground, or to nobody, which is what the ground would actually decide.
#
# RECRUITING IS A DIFFERENT MECHANISM AND IT IS NOT THIS ONE. He also asked
# about "my companions that follow me". Somebody CHOOSING your outfit later is
# a thing you earn; spawning into it at world-gen is a thing nobody chose.
OLD_FACOF = """function ctFactionOf(p){
  var bases = ctBases();
  if(!bases || typeof BohemiaAgents === 'undefined') return null;"""
NEW_FACOF = """function ctFactionOf(p){
  var bases = ctOtherBases();
  if(!bases || typeof BohemiaAgents === 'undefined') return null;"""

FACOF_HELPER = """/* """ + MARKER + """ -- THE BASES SOMEBODY ELSE COULD RUN WITH.
   Every base except your own. Measured before it was written: two strangers in
   the live world were running with CUSTOM, the player's own personal faction
   (Paolo 8/26, in capitals), purely because they lived near its base. Correct
   machinery pointed at the one outfit it must not touch.
   MAP LAW: the base is untouched and stays on the map, because it is YOUR
   base. It is only removed from the list of outfits a STRANGER can be born
   into. People near it now fall to whoever else holds that ground, or to
   nobody, which is what the ground would actually decide.
   Cached: this runs once per person per draw and the answer never changes. */
var CT_OTHER_BASES = null;
function ctOtherBases(){
  if(CT_OTHER_BASES !== null) return CT_OTHER_BASES;
  var all = ctBases();
  if(!all) return null;                     /* seed mismatch: still a real null */
  var mine = null;
  try { if(typeof BohemiaBetween !== 'undefined') mine = BohemiaBetween.mine(); }
  catch(_e){}
  if(!mine) return (CT_OTHER_BASES = all);
  var want = String(mine).toUpperCase().replace(/[\\s_]/g,''), out = {};
  for(var k in all)
    if(String(k).toUpperCase().replace(/[\\s_]/g,'') !== want) out[k] = all[k];
  return (CT_OTHER_BASES = out);
}
"""


# --------------------------------------------------------- 5. THE OUTFIT BOARD
BOARD_JS = """
/* ==== """ + MARKER + """ -- THE OUTFIT BOARD ==================================
   Paolo 8/26: "the values arent just for you its for how your factions treated
   bro." Until now the game could show him ONE STRANGER AT A TIME and nothing
   else. There was no surface anywhere that answered "where does my outfit
   stand in this valley", which is the question his ruling is about.

   HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT (8/12): a system he has to
   make decisions about ships with the instrument for seeing it, in a tab, the
   same turn. TAB: RUN. The chip is in the topbar beside PHONE.

   TIROLE 1996, COLLECTIVE REPUTATIONS: a group's standing is the aggregate of
   its members' records, and "new members of an organization may suffer from an
   original sin of their elders long after the latter are gone." In a game
   about three generations that is not a metaphor, it is the save file. This
   board is where an heir finds out what he inherited.
   ========================================================================= */
var CT_EARNED = null;      /* what the LAST commitment made, for the badge */

function ctOutfitRows(){
  if(typeof BohemiaBetween === 'undefined') return null;
  var sv = ctBelongSave(), mine = BohemiaBetween.mine();
  if(!mine) return null;
  var rip = BohemiaBetween.ripples(mine, sv);
  var st = (typeof ctStandings === 'function') ? ctStandings() : {};
  var rows = rip.map(function(r){
    var have = 0, want = String(r.to).toUpperCase().replace(/[\\s_]/g,'');
    for(var k in st) if(String(k).toUpperCase().replace(/[\\s_]/g,'') === want) have = st[k]|0;
    return { who:String(r.to).toUpperCase(), sign:r.sign, word:r.word,
             note:r.note, earned:!!r.earned, via:r.via, standing:have };
  });
  return { mine:String(mine).toUpperCase(), rows:rows };
}

function ctOutfitHtml(){
  var d = ctOutfitRows();
  if(!d) return '<div class="obempty">NO OUTFIT.</div>';
  var h = '<div class="obhead">THE ' + d.mine + '</div>';
  if(!d.rows.length){
    /* THE EMPTY STATE IS A REAL ANSWER AND IT TEACHES THE SYSTEM. Canon: "No
       preset philosophy. Identity emerges from three generations of action."
       An outfit with no enemies has not done anything yet, and saying so is
       more use than an empty box. draft:true. */
    return h + '<div class="obempty">NOBODY IN THIS VALLEY HAS A POSITION ON YOU'
      + ' YET.<br><br>You have not thrown in with anybody far enough for it to'
      + ' reach the people they are at odds with. The day you do, this fills up'
      + ' and it does not empty again.</div>';
  }
  for(var i=0;i<d.rows.length;i++){
    var r = d.rows[i];
    h += '<div class="obrow ' + r.sign + '">'
       + '<div class="obwho">' + r.who
       + '<span class="obtag">' + (r.earned ? 'YOU MADE THIS' : 'ALWAYS WAS') + '</span></div>'
       + '<div class="obword">' + r.word + '</div>'
       + (r.earned && r.via
            ? '<div class="obvia">WHEN YOU THREW IN WITH THE '
              + String(r.via).toUpperCase() + '</div>' : '')
       + '<div class="obnote">' + (r.note || '') + '</div>'
       + '<div class="obstand">WHAT THEY WILL STILL GIVE YOU: ' + r.standing + '</div>'
       + '</div>';
  }
  return h;
}

function ctOutfitOpen(){
  var p = document.getElementById('outfitpanel');
  if(!p) return;
  p.innerHTML = '<div class="obbar">YOUR OUTFIT<span id="obclose">\\u2715</span></div>'
              + '<div class="obbody">' + ctOutfitHtml() + '</div>';
  p.classList.add('on');
  var b = document.getElementById('outfitbtn'); if(b) b.classList.remove('ring');
  var x = document.getElementById('obclose');
  if(x) x.addEventListener('click', ctOutfitClose);
}
function ctOutfitClose(){
  var p = document.getElementById('outfitpanel'); if(p) p.classList.remove('on');
}
/* THE CHIP RINGS WHEN YOUR OUTFIT JUST MADE AN ENEMY. He is not going to open
   a panel on the off-chance; the moment something lands is the moment to say
   so, and it reuses #phonebtn.ring's own look rather than designing a second
   alert. */
function ctOutfitBadge(){
  var b = document.getElementById('outfitbtn'); if(b) b.classList.add('ring');
}
"""

BOARD_CSS = """
/* ==== """ + MARKER + """ -- board chrome. Reuses the city's own tokens
   (--face, --line, --acc, --ink) and #keypanel's panel geometry; nothing new
   is designed here. */
#outfitbtn{padding:7px 11px;border-radius:5px;background:var(--face);
  border:1px solid var(--line);color:var(--acc);font-weight:500;font-size:10px;
  letter-spacing:1px}
#outfitbtn:active{border-color:var(--acc);color:#fff}
#outfitbtn.ring{background:#d8b45a;border-color:#d8b45a;color:#191308;font-weight:700}
#outfitpanel{display:none;position:absolute;left:8px;right:8px;top:52px;bottom:64px;
  background:var(--bg);border:1px solid var(--line);border-radius:8px;z-index:60;
  overflow:hidden;flex-direction:column}
#outfitpanel.on{display:flex}
#outfitpanel .obbar{display:flex;justify-content:space-between;align-items:center;
  padding:9px 11px;border-bottom:1px solid var(--line);color:var(--acc);
  font-size:11px;letter-spacing:2px;flex:0 0 auto}
#outfitpanel #obclose{padding:0 6px}
#outfitpanel .obbody{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:8px}
#outfitpanel .obhead{color:var(--ink);font-size:15px;letter-spacing:3px;
  padding:6px 4px 12px}
#outfitpanel .obempty{color:var(--ink);opacity:.7;font-size:11px;line-height:1.6;
  padding:4px}
#outfitpanel .obrow{border:1px solid var(--line);border-left-width:3px;
  border-radius:6px;padding:8px 10px;margin-bottom:8px;background:var(--face)}
#outfitpanel .obrow.hostile{border-left-color:#8a4a3a}
#outfitpanel .obrow.warm{border-left-color:#5a8a4a}
#outfitpanel .obrow.neutral,#outfitpanel .obrow.unknown{border-left-color:var(--line)}
#outfitpanel .obwho{display:flex;justify-content:space-between;align-items:baseline;
  color:var(--ink);font-size:12px;letter-spacing:2px}
#outfitpanel .obtag{font-size:8px;letter-spacing:1px;opacity:.55}
#outfitpanel .obword{color:var(--acc);font-size:10px;letter-spacing:1px;padding-top:3px}
#outfitpanel .obvia{font-size:9px;opacity:.6;padding-top:2px;letter-spacing:1px}
#outfitpanel .obnote{font-size:10px;line-height:1.5;opacity:.8;padding-top:5px}
#outfitpanel .obstand{font-size:9px;opacity:.5;padding-top:5px;letter-spacing:1px}
"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return

    for m in RESYNC:
        s, n = resync(s, m)
        print('ENGINE SYNC: %-34s %s' % (m, 'resynced' if n else 'already current'))

    for old, new, what in PAIRS:
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    print('  + the save reaches whoHears (both calls) and costs')

    for old, new, what in ((OLD_FACOF, NEW_FACOF, 'the faction bridge'),
                           (OLD_COMMIT, NEW_COMMIT, 'the commit handler'),
                           (OLD_HEARWHY, NEW_HEARWHY, 'the how-it-got-out row'),
                           (OLD_UPAGAINST, NEW_UPAGAINST, 'the up-against row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    print('  + committing earns enemies; the card says when it is personal')

    # the chip, beside PHONE
    chip_at = """    <div id="devbtn">\U0001f6e0</div>"""
    if chip_at not in s:
        sys.exit('FAIL: could not find the topbar dev chip to sit beside')
    s = s.replace(chip_at,
                  """    <div id="outfitbtn">⚔ OUTFIT</div>\n""" + chip_at, 1)

    # the panel, beside the city's own panels
    panel_at = """  <div id="pfpanel"></div>"""
    if panel_at not in s:
        sys.exit('FAIL: could not find the panel row')
    s = s.replace(panel_at, panel_at + """\n  <div id="outfitpanel"></div>""", 1)

    # css
    css_at = """<style id="homePhoneCss">"""
    if css_at not in s:
        sys.exit('FAIL: could not find the phone css block')
    s = s.replace(css_at, css_at + BOARD_CSS, 1)

    # the code, right before the commit wiring block it depends on
    js_at = """/* __CITY_SIDECOST__ -- WHAT YOU STAND AT WITH EVERYBODY."""
    if js_at not in s:
        sys.exit('FAIL: could not find a home for the board code')
    s = s.replace(js_at, FACOF_HELPER + BOARD_JS + '\n' + js_at, 1)

    # A TAP OUTSIDE CLOSES IT. Paolo 8/24, and the city already has ONE
    # listener for this rather than five patches. Registering is the whole job.
    reg_at = """  ['pfpanel',     null,        null],"""
    if reg_at not in s:
        sys.exit('FAIL: could not find OUTSIDE_PANELS')
    s = s.replace(reg_at, reg_at + """\n  /* """ + MARKER + """ -- Paolo 8/24: "there shouldn't be any buttons that
     bring up any pop menus that don't go away after ... clicking out of them."
     One row in the registry the city already keeps, not a sixth bespoke
     handler that behaves slightly differently from the other five. */
  ['outfitpanel', 'outfitbtn', function(){ try{ ctOutfitClose(); }catch(_e){} }],""", 1)

    # and the chip opens it
    open_at = """document.getElementById('phonebtn').addEventListener('click',function(){"""
    if open_at not in s:
        sys.exit('FAIL: could not find the phone button wiring')
    s = s.replace(open_at, """/* """ + MARKER + """ */
(function(){
  var ob=document.getElementById('outfitbtn');
  if(ob) ob.addEventListener('click', function(){
    var p=document.getElementById('outfitpanel');
    if(p && p.classList.contains('on')) ctOutfitClose(); else ctOutfitOpen();
  });
})();
""" + open_at, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY OUTFIT: your faction earns its enemies, and there is a board')
    print('  TAB: RUN. The chip is in the topbar beside PHONE.')


if __name__ == '__main__':
    main()
