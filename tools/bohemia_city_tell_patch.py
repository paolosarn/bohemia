#!/usr/bin/env python3
"""BOHEMIA CITY TELL -- what you can SEE about somebody before either of you speaks.

*** THE HALF OF THE QUIRK THAT SHIPPED AUTHORED, GATED AND UNREACHABLE. ***
bohemia_quirk.js has carried a TELL for all 22 shapes since 8/19 -- third-person,
no dialogue, "cannot be interrupted partway through a small routine" -- and
tellFor() has never once been called by anything a player can see. Built, gated,
zero callers, which is the shape this lane has now closed nine times.

WHY IT GOES UNDER THE ONE BUTTON AND NOT ON THE CARD.
The card is where you go once you have decided somebody is worth talking to, and
it already carries a dozen rows. The tell is the thing that MAKES that decision:
it is what you notice while you are standing next to a person, before you press
anything. Put on the card it would be a thirteenth row nobody reads; put under
the verb it is the reason the verb gets pressed.

AND IT IS THE FIRST THING THIS GAME HAS EVER SAID ABOUT A STRANGER.
Measured on the walked surface: adjacent to anybody, the entire text on screen is
the button, and the button says TALK TO THE SCAVENGER. Eighty-eight people on a
settlement block and every one of them is a trade word. A tell costs one line and
turns each of them into somebody doing something specific.

*** A TELL IS NOT GATED BEHIND ASKING, AND THAT IS THE WHOLE POINT. ***
YOU HAVE TO ASK (7/31) governs the NAME: nameOf() returns null for a stranger by
law and nothing here changes that. But a habit is not a name. You can watch
somebody straighten what is already straight without being introduced, and
noticing it is exactly how you decide to talk to them. So the tell shows for a
stranger and the name still does not.

IT READS THE SAME SPREAD THE CARD READS. qkOf() is the block-de-collided answer,
so the thing you notice about somebody at a glance is the same person you meet
when you press the button -- and nobody on the street shares a tell.

REUSE CHECK: cooks no pixels and opens no bank. The line is styled from the
frame's OWN palette variables (--line, --ink) like #cttalk beside it, so there is
one place that decides how this surface looks.

  python3 tools/bohemia_city_tell_patch.py
Gate: gates/quirk_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')

CSS_ANCHOR = "    '#cttalk:active{background:#31280f}'+"
CSS_NEW = (
    "    '#cttalk:active{background:#31280f}'+\n"
    "    /* __CITY_TELL__ -- what you notice about them.\n"
    "       *** THE POSITION IS MEASURED, NOT CHOSEN. *** The first cut put it at\n"
    "       bottom:112, right over the one button, and the SCREENSHOT showed it\n"
    "       running straight THROUGH the movement pad: nav owns x198-378 below\n"
    "       y618, and the bottom-left below y714 is the note/rung/bike stack. A\n"
    "       line over a d-pad is unreadable and it sits on taps meant for the pad.\n"
    "       Measured clear band: full width ABOVE y618, so it goes there and\n"
    "       #cttalk never moves -- a verb that shifts when a line appears is a\n"
    "       verb you mis-tap. */\n"
    "    '#cttell{position:absolute;left:12px;right:12px;bottom:192px;z-index:39;'+\n"
    "      'display:none;text-align:center;pointer-events:none;'+\n"
    "      'font:11px/1.35 \"Space Grotesk\",system-ui,sans-serif;color:var(--ink);'+\n"
    "      'opacity:0.72;text-shadow:0 1px 0 rgba(0,0,0,0.85)}'+"
)

EL_ANCHOR = "  var c=document.createElement('div'); c.id='ctcard';"
EL_NEW = ("  var c=document.createElement('div'); c.id='ctcard';\n"
          "  /* __CITY_TELL__ */\n"
          "  var tl=document.createElement('div'); tl.id='cttell';")

APPEND_ANCHOR = "  st.appendChild(b); st.appendChild(c);"
APPEND_NEW = "  st.appendChild(b); st.appendChild(tl); st.appendChild(c);"

# *** THE ANCHOR MOVED UNDER THIS TOOL (8/20). *** Another lane added the
# __CITY_STALECARD__ check to ctVerb the same night -- you could walk the whole
# valley with somebody's card up -- and a tool that anchors on a whole function
# body breaks the moment anyone else edits that function. Both changes belong,
# so the anchor is now the two LINES this tool actually needs to sit between,
# not the entire function. Narrow anchors survive other people's work.
VERB_ANCHOR = """  var b=document.getElementById('cttalk'); if(!b) return;
"""

VERB_NEW = """  var b=document.getElementById('cttalk'); if(!b) return;
  var t=document.getElementById('cttell');
"""

# and the two places the tell must ALSO be hidden, patched by their own narrow
# anchors so each survives independently.
HIDE1_ANCHOR = "  if(CT_OPEN || MODE!=='human'){ b.style.display='none'; return; }"
HIDE1_NEW = "  if(CT_OPEN || MODE!=='human'){ b.style.display='none'; if(t) t.style.display='none'; return; }"

HIDE2_ANCHOR = "  if(!p){ b.style.display='none'; window.__CT_VERB=null; return; }"
HIDE2_NEW = ("  if(!p){ b.style.display='none'; if(t) t.style.display='none';\n"
             "          window.__CT_VERB=null; window.__CT_TELL=null; return; }")

SHOW_ANCHOR = "  b.textContent=label; b.style.display='block'; window.__CT_VERB=label;"
SHOW_NEW = SHOW_ANCHOR + """
  /* __CITY_TELL__ -- WHAT YOU NOTICE, and it is the only thing this game has
     ever said about a stranger. Standing next to anybody, the whole text on
     screen was the button, and the button says their TRADE: eighty-eight people
     on a block and every one of them the word SCAVENGER.
     A TELL IS NOT A NAME, so YOU HAVE TO ASK (7/31) is untouched -- nameOf()
     still returns null for a stranger and this never prints one. You can watch
     somebody straighten what is already straight without being introduced, and
     noticing it is how you decide to talk to them at all.
     Read through qkOf() so it is the BLOCK-de-collided answer: the thing you
     notice at a glance is the same person you meet when you press the button,
     and nobody on this street has the same tell. */
  var tell=null;
  try { var q=qkOf(who.key); tell=q&&q.tell; } catch(_e){}
  window.__CT_TELL=tell||null;
  if(t){
    if(tell){ t.textContent=tell; t.style.display='block'; }
    else t.style.display='none';
  }"""


def cut_ok(s, needle, label):
    n = s.count(needle)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))
    return True


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    before = s
    n_before = s.count('\n')

    if '__CITY_TELL__' in s:
        print('CITY TELL: already applied. Nothing written.')
        return

    cut_ok(s, CSS_ANCHOR, 'tell css')
    s = s.replace(CSS_ANCHOR, CSS_NEW, 1)
    cut_ok(s, EL_ANCHOR, 'tell element')
    s = s.replace(EL_ANCHOR, EL_NEW, 1)
    cut_ok(s, APPEND_ANCHOR, 'tell append')
    s = s.replace(APPEND_ANCHOR, APPEND_NEW, 1)
    cut_ok(s, VERB_ANCHOR, 'ctVerb head')
    s = s.replace(VERB_ANCHOR, VERB_NEW, 1)
    cut_ok(s, HIDE1_ANCHOR, 'card-open hide')
    s = s.replace(HIDE1_ANCHOR, HIDE1_NEW, 1)
    cut_ok(s, HIDE2_ANCHOR, 'nobody-adjacent hide')
    s = s.replace(HIDE2_ANCHOR, HIDE2_NEW, 1)
    cut_ok(s, SHOW_ANCHOR, 'verb label')
    s = s.replace(SHOW_ANCHOR, SHOW_NEW, 1)

    # A WIRING PATCH ONLY EVER ADDS. 8/17: a sibling tool in this lane removed
    # 2,607 lines of another lane's work because an anchor had moved.
    grew = s.count('\n') - n_before
    if grew < 0:
        sys.exit('REFUSING TO WRITE: this would REMOVE %d lines from the city.' % -grew)

    if s == before:
        print('CITY TELL: nothing to do.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY TELL: +%d lines' % grew)
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()
