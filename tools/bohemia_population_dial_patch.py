#!/usr/bin/env python3
"""BOHEMIA POPULATION DIAL -- the slider he asked for on 8/1, fifteen days late.

PAOLO 8/1, VERBATIM: "why don't you do some coding plumbing right now till I make
a population slider ... I think this is gonna be extremely important anyway as we
go throughout the three acts ... it should be something that's extremely easy to
control ... the slider can go all the way from zero to a maximum."

THE PLUMBING WAS BUILT THAT DAY AND THE SLIDER NEVER WAS. engine/bohemia_
population.js has carried DIAL, setDial(), dialAt(), applyDial() and a MIN/MAX
since 8/1; the city has them inlined; and MEASURED 8/16, NOTHING ANYWHERE CALLS
setDial. There is no control, in any tab, at any zoom. He cannot set the number
he told us to build him a way to set.
HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT (8/12): "every system he has to
make decisions about ships with an INSTRUMENT for making them, IN A TAB, THE SAME
TURN." This is that instrument, and it is overdue.

*** WHAT IT IS REALLY FOR, AND IT IS BIGGER THAN A SLIDER. ***
records/BOHEMIA_HOW_MANY_PEOPLE_CONTRADICTION_8_1_26.md has sat [PENDING Paolo]
since 8/1 with three live answers to "how many people live here" spanning three
orders of magnitude -- 60, 8,282, ~69,000 -- and it ends with the one sentence
that would settle it:

    "walking one block from home, how many people should be on that street --
     nobody, a couple, or a dozen?"

That question was never put to him in a form he could answer, because answering
it meant arbitrating three constants in three files. NOW IT IS A HANDLE. He drags
until the street looks right and the contradiction is closed by LOOKING, which is
the only way he has ever wanted to decide anything.

*** AND THE HEADLINE THE MEASUREMENT KILLED. ***
This tool's first draft opened by telling him the valley was running at a
NINETEENTH of its truthful population. That came straight out of the module's own
comment and IT WAS WRONG BY ABOUT SEVENTY TIMES: the comment divided a TOTAL
POPULATION (the scale model's ~4,723) by a NEIGHBOURHOOD COUNT (census() dedupes
to one row per neighbourhood, so its "60" is 60 neighbourhoods). Swept properly on
8/16 -- seed 7, every 3rd plot, counting the agents the world actually builds --
dial 1 already yields ~4,194 people, which is 89% OF THE SCALE MODEL. The fix
landed in engine/bohemia_population.js as LANDMARK{} plus the sweep table, and in
people_gate G9, which had frozen the bad arithmetic into an assertion.
So: THE STREET IS NOT EMPTY BECAUSE A DIAL IS DOWN. It is empty because ~4,200
people spread over a 96x96 valley IS one person every couple of blocks. That is
the scale model working. Whether it is the GAME he wants is a different question,
it is HIS, and this is the thing he answers it with.

*** THE NUMBER IS STILL HIS. *** MECHANISM-MINE / CONTENTS-PAOLO'S: a dial is a
DECISION, not words, so it waits. This ships at EXACTLY what it is today -- dial
1, nothing moves until he drags it.

WHAT THE PANEL SHOWS, every figure read live rather than retyped:
  HOW MANY PEOPLE ARE ON THIS STREET RIGHT NOW -- the count peoplePass actually
    blitted this frame (BARK_DREW), because that is the number his question was
    about and the only one he can check by looking
  the dial, 0 to the module's own DIAL_MAX
  FOUR PLACES TO GO, one tap each, each labelled with what it means in plain
    words and read out of BohemiaPopulation.LANDMARK so the panel cannot drift:
    nobody / as it is now / the scale model / the story's own answer

IT CUTS, THEN IT INSERTS -- never appends, never patches in place. Every region
lives between markers and a re-run REMOVES the old block and re-inserts it at the
anchor. That is not just idempotence, it is self-healing, and it was needed
immediately: the first cut landed the panel INSIDE #topbar, whose CSS carries
`#topbar>*{position:static !important;top:auto !important}`, which would have
stripped the panel's positioning and dropped a 420px card into the middle of the
toolbar's flex row. A swap-in-place would have left it there forever.

LANE NOTE: PEOPLE-lane code in the CITY lane's file, additive, between markers,
touching no city logic. It is here because this is the surface where he can SEE
the answer change.

REUSE CHECK: cooks no pixels and opens no bank. The button and panel wear the
surface's own chip face (var(--face)/var(--line)/var(--acc), copied from the
#reroll rule beside it); every number comes from engine/bohemia_population.js or
from the frame the city just drew.

  python3 tools/bohemia_population_dial_patch.py
Gate: gates/population_dial_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')

# ---------------------------------------------------------------- the button
# THE FILE STORES THE GLYPH ITSELF, NOT THE ENTITY -- read the anchor out of the
# file, never retype it. (Retyping the reroll arrow as &#8635; is exactly what
# made the first run of this tool resolve 0 anchors and refuse to write.)
BTN_ANCHOR = '<div id="reroll">'
BTN_BEGIN = '<!-- BOHEMIA POPULATION DIAL BUTTON -->'
BTN_END = '<!-- /BOHEMIA POPULATION DIAL BUTTON -->'
# IT GOES IN THE BUILDER'S DRAWER, AND THAT WAS NOT MY CALL -- IT WAS A REBASE'S.
# Hours before this shipped, the RUN lane landed __BUILDERS_TOOLS_IN_A_DRAWER__ off
# Paolo 8/16: "Im not even trying to press re roll fr the run has a lot of bullshit
# buttons still around from the early days." They audited the walking row one
# control at a time and moved the three that BUILD the world (REROLL, KEY, UNDER)
# into a tray behind a spanner, away from PHONE, which is the button he was
# actually reaching for. A POPULATION DIAL IS A BUILDER TOOL BY THAT SAME AUDIT --
# it regenerates the valley -- so a ninth chip under his thumb would have rebuilt
# the exact mess he had just complained about, and one_valley_gate (which now
# presses every control left in that row and fails anything that can touch the
# world) would have been right to fail it.
# The anchor did the work: `<div id="reroll">` moved INTO the tray, so this button
# followed it there without the tool changing. No inline face either -- the tray
# styles its own children (`#devtray > div`), so it wears REROLL's exact chip
# rather than a hand-copied approximation of it.
BTN_BLOCK = BTN_BEGIN + '<div id="popbtn">\U0001f465 PEOPLE</div>' + BTN_END
BTN_TAIL = '\n    '

# ---------------------------------------------------------------- the panel
# a child of #stage (position:relative), NEVER of #topbar.
PANEL_ANCHOR = '  <div id="qline">'
BEGIN = '<!-- ===== BOHEMIA POPULATION DIAL (generated by tools/bohemia_population_dial_patch.py) ===== -->'
END = '<!-- ===== END BOHEMIA POPULATION DIAL ===== -->'

PANEL = BEGIN + '''
<style>
/* THE DRAWER NEVER GOT THE POSITION RESET THE TOOLBAR HAS, and my chip is what
   made that visible. #reroll, #underbtn and #keybtn each still carry their
   sandbox-era `position:absolute;right:NNNpx;top:10px`. Inside #topbar that was
   harmless, because #topbar>* overrides position to static !important. When the
   RUN lane moved those three into #devtray on 8/16 the override stopped applying
   and the absolute rules woke back up, so the tray -- whose own CSS says
   `flex-direction:column;gap:5px` -- renders as a ROW of overlapping chips that
   only tiles because those old right: offsets happen to sit side by side.
   MEASURED at 390px: UNDER 216..303 against KEY 294..365, a 9px overlap, and a
   static chip added to the tray lands on top of KEY entirely.
   This is the same one-line reset #topbar already uses, applied to the drawer,
   so the tray lays out as the column its author wrote. It changes no chip's
   face and deletes nothing. */
#devtray > *{position:static !important;top:auto !important;right:auto !important;
  bottom:auto !important;left:auto !important;margin:0 !important}
</style>
<div id="popwrap" style="display:none;position:absolute;left:8px;right:8px;top:78px;z-index:60;
     background:#0d0b07;border:1px solid #2a2114;border-radius:6px;padding:11px 12px;
     font:12px/1.5 ui-monospace,monospace;color:#cdbd8a;max-width:430px;margin:0 auto">
  <div style="display:flex;align-items:baseline;gap:8px">
    <div style="color:#d8b45a;letter-spacing:1px;font-size:11px">HOW MANY PEOPLE ON YOUR STREET</div>
    <div style="flex:1"></div>
    <div id="popclose" style="color:#8d8168;padding:0 6px">&#10005;</div>
  </div>
  <div id="popnow" style="margin-top:7px;color:#e8dfc8;font-size:14px"></div>
  <input id="popslider" type="range" min="0" max="32" step="0.1" value="1"
         style="width:100%;margin-top:9px;accent-color:#d8b45a">
  <div id="popmarks" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px"></div>
  <div id="popsays" style="margin-top:8px;color:#8d8168"></div>
  <div id="popwhere" style="margin-top:5px;color:#6f6552;font-size:10px;line-height:1.5"></div>
  <div style="margin-top:8px;color:#6f6552;font-size:10px;line-height:1.5">
    This is YOUR number and it ships exactly where it has always been. Drag it
    until the street looks like the city you want, then leave it there.
  </div>
</div>
''' + END
PANEL_TAIL = '\n'

# ---------------------------------------------------------------- the script
SCRIPT_ANCHOR = "document.getElementById('reroll').addEventListener('click',()=>{"
SCRIPT_BEGIN = '/* ===== BOHEMIA POPULATION DIAL SCRIPT (generated) ===== */'
SCRIPT_END = '/* ===== END BOHEMIA POPULATION DIAL SCRIPT ===== */'

SCRIPT = SCRIPT_BEGIN + r'''
/* ---- THE HANDLE. The number stays his; this is only the way to reach it. ----
   Every figure printed here is read at the moment it is shown -- the dial, the
   module's own MAX, its own LANDMARK table, and the count of people the surface
   ACTUALLY BLITTED this frame -- so the panel cannot drift from the game the way
   a retyped constant does. That is not a style preference: the reason this
   feature was fifteen days late is that the module's own retyped constant said
   the truthful dial was 19 when the measurement says 1.1. */
function popDrawnNow(){
  /* BARK_DREW is reset at the top of peoplePass and pushed to for every body it
     blits, so its length IS what is on screen. It is never cleared afterward, so
     it survives until the next frame -- which is what makes it readable here. */
  try { return (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW.length : -1; }
  catch (_e) { return -1; }
}
function popWalking(){
  try { return typeof MODE !== 'undefined' && MODE === 'human'; } catch (_e) { return false; }
}
function popLandmarks(){
  var L = {};
  try { L = BohemiaPopulation.LANDMARK || {}; } catch (_e) {}
  /* plain words for each, in the order he would think of them */
  return [
    ['nobody',  L.nobody, 'NOBODY'],
    ['today',   L.today,  'AS IT IS NOW'],
    ['scale',   L.scale,  'THE SCALE MODEL'],
    ['story',   L.story,  "THE STORY'S ANSWER"]
  ].filter(function(r){ return typeof r[1] === 'number' && isFinite(r[1]); });
}
function popWhere(){
  /* WHERE HE IS STANDING CHANGES WHAT THE HANDLE CAN DO, and hiding that would
     make the slider look broken on the one block he starts on. His 7/29 zone
     ruling is "some clusters. some no mans lands. some random spread", so a
     SPREAD neighbourhood is one household per 128x128 subdivision BY DESIGN --
     turn the dial to the top there and you still see almost nobody, because
     they are scattered over ground far wider than the screen. In a SETTLEMENT
     the same drag goes from six bodies to eighty-eight. Measured 8/16, both. */
  try {
    var z = BohemiaPopulation.zoneAt(om, POWER, city.x, city.y, seed);
    if (z === 'cluster') return 'You are standing in a settlement. This is where the dial shows most.';
    if (z === 'empty') return 'This is a no man’s land. Nobody lives here at any setting.';
    if (z) return 'This block is scattered houses, not a settlement, so the dial moves it slowly here. Walk to a settlement to see it properly.';
  } catch (_e) {}
  return '';
}
function popSays(v){
  var L = {}; try { L = BohemiaPopulation.LANDMARK || {}; } catch (_e) {}
  if (v <= 0) return 'A ghost valley. Every home dark, every street yours.';
  if (v < 1) return 'Emptier than it ships. Fewer homes hold anybody.';
  if (v === 1) return 'Exactly as the valley is right now. This is what ships.';
  if (L.story && v >= L.story) return 'About what the story says survived the crash.';
  if (L.scale && v <= L.scale) return "About what the valley's scale model asks for.";
  return 'Fuller than it ships, short of what the story claims survived.';
}
function popRefresh(){
  var s = document.getElementById('popslider');
  var now = document.getElementById('popnow');
  var says = document.getElementById('popsays');
  if (!s || !now) return;
  var v = Number(s.value);
  var drawn = popDrawnNow();
  /* HONEST WHEN IT CANNOT SEE. peoplePass returns before drawing anybody unless
     there is a body to draw, and the city overview does not run it at all, so a
     0 here would be a lie about the world rather than a fact about it. */
  var head = (!popWalking() || drawn < 0)
    ? 'walk out onto the street to count them'
    : (drawn + (drawn === 1 ? ' person on this street' : ' people on this street'));
  now.textContent = head;
  if (says) says.textContent = popSays(v);
  var wh = document.getElementById('popwhere');
  if (wh) wh.textContent = popWhere();
  var marks = document.getElementById('popmarks');
  if (marks) {
    var kids = marks.children;
    for (var i = 0; i < kids.length; i++) {
      var on = Math.abs(Number(kids[i].getAttribute('data-v')) - v) < 0.05;
      kids[i].style.color = on ? '#fff' : '#8d8168';
      kids[i].style.borderColor = on ? '#5a4a2a' : '#2a2114';
      kids[i].style.background = on ? '#1f1a10' : 'transparent';
    }
  }
}
function popApply(v){
  try { BohemiaPopulation.setDial(Number(v)); } catch (_e) { return; }
  /* the population is DERIVED, so the world has to be rebuilt from it: drop the
     streamed chunks and let them come back at the new rate. Same three caches
     the reroll handler clears, for the same reason. */
  try { chunkCache.clear(); metaCache.clear(); __subCache.clear(); } catch (_e) {}
  try { if (typeof render === 'function') render(); } catch (_e) {}
  popRefresh();
}
(function(){
  var btn = document.getElementById('popbtn');
  var wrap = document.getElementById('popwrap');
  var s = document.getElementById('popslider');
  var x = document.getElementById('popclose');
  if (!btn || !wrap || !s) return;
  try {
    s.max = String(BohemiaPopulation.DIAL_MAX);
    s.min = String(BohemiaPopulation.DIAL_MIN);
    s.value = String(BohemiaPopulation.dial());
  } catch (_e) {}
  var marks = document.getElementById('popmarks');
  if (marks) popLandmarks().forEach(function(r){
    var b = document.createElement('div');
    b.setAttribute('data-v', String(r[1]));
    b.setAttribute('data-k', r[0]);
    b.className = 'popmark';
    b.style.cssText = 'padding:4px 7px;border:1px solid #2a2114;border-radius:4px;' +
      'font-size:9px;letter-spacing:1px;color:#8d8168';
    b.textContent = r[2];
    b.addEventListener('click', function(){ s.value = String(r[1]); popApply(r[1]); });
    marks.appendChild(b);
  });
  btn.addEventListener('click', function(){
    var open = (wrap.style.display === 'none' || !wrap.style.display);
    wrap.style.display = open ? 'block' : 'none';
    /* THE TOOLBAR WRAPS ON A PHONE. Seven chips do not fit 374px, so a fixed
       top would put this card underneath the second row on the only screen he
       ever uses. Measure the row that is actually there. */
    if (open) {
      /* clear whatever is actually above it: the toolbar wraps to two rows at
         phone width, and this button lives in the BUILDER'S DRAWER, which hangs
         below the toolbar and is taller still. Take the lowest of the two. */
      var low = 0;
      ['topbar', 'devtray'].forEach(function (id) {
        var e = document.getElementById(id);
        if (e && e.offsetParent !== null) low = Math.max(low, e.offsetTop + e.offsetHeight);
      });
      if (low) wrap.style.top = (low + 8) + 'px';
      popRefresh();
    }
  });
  if (x) x.addEventListener('click', function(){ wrap.style.display = 'none'; });
  /* live while dragging, applied on release -- rebuilding the stream on every
     pixel of a drag would make the handle feel broken on a phone. */
  s.addEventListener('input', popRefresh);
  s.addEventListener('change', function(){ popApply(s.value); });
})();
''' + SCRIPT_END
SCRIPT_TAIL = '\n'


def cut(text, begin, end, tail, label):
    """Remove a marked region entirely, so the next insert can RELOCATE it.

    THE TAIL HAS TO BE EXACT. The first version greedily ate every newline AND
    SPACE after the closing marker, which on the second run swallowed the two
    spaces of `  <div id="qline">` and left the anchor unresolvable -- the tool
    refused to write and said the anchor was gone, when the tool itself had just
    eaten it. Strip precisely the suffix that was appended, never a character
    that belonged to the file.
    """
    i = text.find(begin)
    if i < 0:
        return text, False
    j = text.find(end, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %s has an opening marker and no closing one.' % label)
    k = j + len(end)
    if text[k:k + len(tail)] == tail:
        k += len(tail)
    return text[:i] + text[k:], True


def insert_before(text, anchor, block, label):
    n = text.count(anchor)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))
    return text.replace(anchor, block + anchor, 1)


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    before = s

    s, had_btn = cut(s, BTN_BEGIN, BTN_END, BTN_TAIL, 'the POP button')
    s, had_panel = cut(s, BEGIN, END, PANEL_TAIL, 'the population panel')
    s, had_script = cut(s, SCRIPT_BEGIN, SCRIPT_END, SCRIPT_TAIL, 'the population script')

    s = insert_before(s, BTN_ANCHOR, BTN_BLOCK + BTN_TAIL, 'REROLL button')
    s = insert_before(s, PANEL_ANCHOR, PANEL + PANEL_TAIL, 'qline')
    s = insert_before(s, SCRIPT_ANCHOR, SCRIPT + SCRIPT_TAIL, 'reroll handler')

    if s == before:
        print('POPULATION DIAL: already exactly this. Nothing written.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('POPULATION DIAL: button %s, panel %s, script %s' % (
        'moved' if had_btn else 'added',
        'moved' if had_panel else 'added',
        'moved' if had_script else 'added'))
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
