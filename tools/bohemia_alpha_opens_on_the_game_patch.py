#!/usr/bin/env python3
"""
THE FIRST THING YOU SEE IS THE GAME (8/15/26, RUN lane).

DEMO STATUS BOARD row 7, and the coordinator's own words for it:

    ROW 7 -- THE FIRST FIVE MINUTES -- OPEN. THE CHEAPEST BIG WIN ON THE BOARD.
    A NEW PLAYER LANDS ON A DEV TAB. [...] The first thing a friend sees after
    the splash is the character/wardrobe workbench, and they must find RUN among
    ~16 tabs to reach the game.
    OWNER: RUN. DEMO-BLOCKING, and it is the single highest ratio of
    player-impact to work on this board.

MEASURED, not taken on faith: `ALPHA:1014` is `<div class="tab on"
data-p="char">CHARACTER</div>` and `:1109` is `<div class="panel on"
id="p-char">`. Tap the splash today and you are looking at the wardrobe
workbench. The game is four tabs to the left, behind a name a stranger has no
reason to read as "the game".

WHY THIS IS NOT A ONE-LINE HTML EDIT, AND I CHECKED BEFORE ASSUMING. Moving the
`on` class to the RUN tab in the markup would show an EMPTY PANEL. The city
iframe is built lazily, inside the tab CLICK handler (`ALPHA:7481`, `if
(PANEL==='city' && !document.getElementById('cityFrame'))`), and that handler
also does five other things the game needs: sends the player, sends the cast,
restores the city save, and pushes approved prefabs. A markup default runs none
of it. So the entry TAPS THE TAB, which is the same door the player uses, and
every one of those five steps happens exactly as it always has.

That is also why the CHARACTER tab keeps its `on` class in the markup: it is
only ever true for the instant before the splash is dismissed, which nobody can
see, and changing it would be a second source of truth for which panel is open.

A MISSING TAB IS LOUD HERE, ON PURPOSE. one_world_tab_gate.js exists because
eight places in this fleet wrote `if(t)t.click()` and a tab that was not found
was silently skipped -- a game that quietly does not open. If the RUN tab is
ever renamed, this reports it in the console AND leaves __RUN_TAB_MISSING on
window, so the gate can see it rather than infer it from a blank screen.

WHAT THIS DOES NOT DO, and it is the other half of row 7: route splash -> COLD
OPEN -> the day. That half is not landed here because row 10 records that the
cold open "hands off to nothing" and calls the fight WITHOUT SWITCHING TABS
(`:21436-21438`), so promoting it to the opening today would put a stranger in
front of a scene that ends in a dead stop. Making the game the first thing is
correct on its own and does not depend on it.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It reuses the alpha's own tab click handler rather than
duplicating any part of it -- that reuse is the entire point of the patch.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_GAME_IS_THE_FIRST_THING__'

OLD = """document.getElementById('front').addEventListener('click',()=>{
  document.getElementById('front').style.display='none';
  document.getElementById('app').style.display='flex';buildUI();});"""

NEW = """document.getElementById('front').addEventListener('click',()=>{
  document.getElementById('front').style.display='none';
  document.getElementById('app').style.display='flex';buildUI();
  /* """ + MARK + """ -- DEMO BOARD ROW 7, "the cheapest big win on the board".
     A new player used to land on the CHARACTER wardrobe workbench and had to
     find RUN among the tabs to reach the game. Now the entry opens the game.
     IT TAPS THE REAL TAB rather than setting a class, because the city iframe
     is built lazily INSIDE that click handler, which also sends the player,
     sends the cast, restores the city save and pushes approved prefabs. A
     markup default would show an empty panel and skip all five.
     A MISSING TAB IS LOUD: one_world_tab_gate.js exists because this fleet
     wrote `if(t)t.click()` eight times and a renamed tab became a game that
     quietly does not open. */
  var runTab=document.querySelector('.tab[data-p="run"]');
  if(!runTab){ window.__RUN_TAB_MISSING=true;
    console.error('THE RUN TAB IS GONE from the alpha tab bar: the game cannot open'); }
  else { runTab.click(); window.__OPENED_ON_THE_GAME=(window.__OPENED_ON_THE_GAME||0)+1; }
});"""


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the splash entry handler is not where this expects it')
    s = s.replace(OLD, NEW, 1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + ALPHA + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
