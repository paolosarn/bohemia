#!/usr/bin/env python3
"""BOHEMIA THE CHIN IS NEVER THE THROAT (Paolo 8/11/26, LOCKED)

PAOLO: "It looks like u fixed it make sure we never have this chin issue ever
again."

Making it never happen again meant writing the law as a machine check, and the
FIRST RUN OF THAT CHECK FOUND THE BUG STILL LIVE ON A FACING NOBODY HAD LOOKED AT:

    CHIN LAW A -- E: 0 of 1 face row(s) his rig paints below the mouth render as
    FACE, not as neck.

Which is the whole reason this keeps happening. NECK_TONE takes the lowest N rows
of visible FACE skin, and the count was tuned per facing by eye:

    7/28   two rows reach into the chin in profile -> E and W to ONE
    8/11   two rows reach into the chin head-on   -> ONE everywhere
    8/11   ONE row is still too many on E, because on E his rig paints exactly ONE
           face row below the mouth, so the throat eats the entire chin

A NUMBER TUNED PER FACING WILL ALWAYS BE WRONG ON THE NEXT FACING SOMEBODY OPENS.
Three corrections, three weeks, same defect. So the count stops being the rule and
the CHIN becomes the rule:

    THE THROAT MAY NEVER CLAIM THE LAST FACE ROW UNDER THE MOUTH.

The pass now reads the mouth row off his own facial art for the facing it is
drawing, and refuses to start unless at least one face row survives between the
mouth and the throat. On S the throat takes y15 and the chin at y14 lives. On E
the only row below the mouth IS the chin, so the throat takes nothing there and
says so. No per-direction table, nothing to re-tune, and it is correct on a facing
that does not exist yet.

His 7/27 ruling ("the neck is not a different color") is untouched: the throat
still takes its row everywhere it can do so without eating a chin.

    python3 tools/bohemia_chin_law_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """    const _throatTop=(_throatY<0||_tRows<=0)?1e9:(_throatY-(_tRows-1));"""

NEW = """    let _throatTop=(_throatY<0||_tRows<=0)?1e9:(_throatY-(_tRows-1));
    /* THE CHIN IS NEVER THE THROAT (Paolo 8/11, LOCKED: "make sure we never have
       this chin issue ever again"). The row count above was tuned per facing by
       eye and was corrected three times in three weeks -- 7/28 two rows reached
       the chin in profile, 8/11 two rows reached it head-on, and 8/11 again ONE
       row was still too many on E, where his rig paints exactly one face row below
       the mouth so the throat ate the whole chin. A NUMBER TUNED PER FACING IS
       ALWAYS WRONG ON THE NEXT FACING SOMEBODY OPENS.
       So the count stops being the rule and the chin becomes the rule: at least
       one FACE row must survive between the mouth and the throat, whatever the
       count says. Read off his own facial art for the facing being drawn, so it is
       right on a facing that does not exist yet. */
    {let _mouthY=-1;
     try{const _fk=G.equipped&&G.equipped.facial;
       /* NOT `gdir` -- it is a `const` declared LATER in buildFrame, so reading it
          here is a temporal-dead-zone ReferenceError that this try/catch swallows
          silently, leaving _mouthY at -1 and the clamp switched off. That is
          exactly how the E facing stayed broken after this fix "landed". */
       const _gd=(typeof MIRROR!=='undefined'&&MIRROR[d])?MIRROR[d]:d;
       const _FL=_fk&&PD.layers[_fk]&&PD.layers[_fk][_gd];
       if(_FL)for(const _i in _FL.px){ if(_FL.px[_i]!==2)continue;
         const _y=((+_i/(_FL.w||24))|0)+G24_OY; if(_y>_mouthY)_mouthY=_y; }
     }catch(_e){}
     if(_mouthY>=0&&_throatTop<_mouthY+2)_throatTop=1e9;}"""

alpha = open(ALPHA, encoding='utf8').read()
if 'THE CHIN IS NEVER THE THROAT' in alpha:
    print('  ok   (already) the throat can never claim the last chin row')
    sys.exit(0)
n = alpha.count(OLD)
if n != 1:
    print('CHIN LAW: refused to write -- expected exactly 1 match, found %d' % n)
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   the throat may never claim the last face row under the mouth')
print('CHIN LAW: applied to %s' % ALPHA)
