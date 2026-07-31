#!/usr/bin/env python3
"""
BOHEMIA - ONE WARDROBE, NOT TWO MENUS STACKED (Paolo 7/31/26)

Paolo, with screenshots of the old slot list and the colour-ramp list sitting
above the new WARDROBE section:
  "THIS UI IS OLD AND SHOULD BE INCORPORATED INTO THE WAREDROBE... THE OLD STYLE
   MENU SHOULD BE IMPLEMENTED INTO THE NEW ADDITION CLEANLY"

He was looking at THREE things that are all "what am I wearing":
  1. the slot rows -- FACIAL / GLASSES / PANTS / SHOES / SHIRT / JACKET / HAIR /
     HAT, each NONE | name | EDIT -- his 7 hand-painted pieces
  2. the WARDROBE -- the 221 generated garments by category
  3. a separate COLORS block -- a ramp strip per piece, far from the piece
That is one job split across three lists, and the split is mine: I bolted the new
wardrobe on instead of absorbing the old one.

WHAT THIS DOES. One WARDROBE. Every category holds, in order:
    NONE  |  his painted piece (marked, and it sorts FIRST because it is canon)
          |  every approved generated garment, alphabetical (7/30 standing order)
and the colour strip for whatever that category is wearing sits INSIDE the
category, under the item it recolours, instead of in a separate block.

WHAT DELIBERATELY STAYS OUT: the BODY row. It is the one rig plus the variation
dials, not a garment, and folding sliders into a clothing list would bury them.

THE TWO WARDROBES ARE ONE LIST NOW, but they are still two mechanisms underneath
and that is on purpose: his painted pieces live in G.equipped (PD.layers, per-
direction art he painted) and the generated ones in G_WORN (gen() over the part
grid). The UI stops making him care which is which; the engine still knows.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): no joints, no anatomy, no layering, no
pixels. This is list construction in the DOM.
  built on: the BAKED package
  joints: none named
  parts: none

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO graphic pixels and opens NO
banks. It re-lists garments that already exist and re-hosts the existing ramp
editor; no art is authored.

  python3 tools/bohemia_one_wardrobe_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# 1. the old clothing rows stop being their own menu (BODY stays -- it is dials)
# ANCHORED WITH ITS OWN LINE ABOVE: this exact array appears TWICE -- once for the
# slot rows, once for the ramp editor. The tool refused to write when it resolved
# twice, which is the guard doing its job; only the charSlots one folds away.
OLD_ORDER = ("  const opts=slotOptions();const cs=document.getElementById('charSlots');cs.innerHTML='';\n"
             "  const order=['body','facial','glasses','pants','shoes','shirt','jacket','hair','hat'];")
NEW_ORDER = ("  /* ONE WARDROBE (Paolo 7/31: \"THIS UI IS OLD AND SHOULD BE INCORPORATED INTO\n"
             "     THE WAREDROBE\"). The clothing slots moved INTO the wardrobe below, where\n"
             "     his painted pieces sit in the same category list as the generated ones.\n"
             "     BODY stays here: it is the one rig plus its variation dials, not a\n"
             "     garment, and burying sliders in a clothing list would hide them. */\n"
             "  const opts=slotOptions();const cs=document.getElementById('charSlots');cs.innerHTML='';\n"
             "  const order=['body'];")

# 2. the COLORS heading no longer introduces a separate block
OLD_COLORS = '      <div class="row"><b>COLORS - tap a color box to retint that piece. Outline never retints.</b></div>\n'
NEW_COLORS = ''

# 3. the wardrobe absorbs both
OLD_FN = "  window.wardrobeRefresh = function(){"
NEW_FN = """  /* ---- PD slot  <->  wardrobe category -------------------------------
     His painted pieces and the generated garments cover the same body regions
     under different names. This is the only place that mapping needs to exist;
     everything below treats a category as one shelf. */
  window.PD_FOR_CAT = {base:'shirt', outer:'jacket', legs:'pants', feet:'shoes',
                       head:'hat', face:'glasses', hair:'hair'};
  window.wardrobeRefresh = function(){"""



# 4. THE RENDERER ITSELF. This was a hand edit twice and vanished on both rebases,
#    which is exactly the failure this file already documents for two other steps.
#    It is an edit now, so the build reproduces from main's alpha + tools alone.
RENDER_OLD_HEAD = "  window.wardrobeRefresh = function(){"


def unified_renderer():
    return open(os.path.join(REPO, 'tools', '_wardrobe_renderer.js'), encoding='utf-8').read()


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if 'PD_FOR_CAT' in s:
        print('already applied')
        return 0
    bad = []
    for label, old, new in [('the old slot rows fold into the wardrobe', OLD_ORDER, NEW_ORDER),
                            ('the separate COLORS heading goes', OLD_COLORS, NEW_COLORS),
                            ('the slot<->category map', OLD_FN, NEW_FN)]:
        if s.count(old) != 1:
            bad.append('%s -> %d matches' % (label, s.count(old)))
    if bad:
        print('REFUSING TO WRITE:')
        for b in bad:
            print('   ' + b)
        return 1
    s = s.replace(OLD_ORDER, NEW_ORDER).replace(OLD_COLORS, NEW_COLORS).replace(OLD_FN, NEW_FN)

    # swap the whole wardrobeRefresh body for the unified one
    i = s.index(RENDER_OLD_HEAD)
    j = s.index('\n  };\n', i) + len('\n  };\n')
    s = s[:i] + unified_renderer() + s[j:]

    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('  + old clothing slots folded into the wardrobe (BODY dials kept)')
    print('  + separate COLORS block retired')
    print('  + slot<->category map added')
    print('  + unified renderer (his painted pieces + generated, one shelf)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
