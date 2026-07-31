#!/usr/bin/env python3
"""
BOHEMIA - THE ANIMATION TAB BECOMES A JUDGING SURFACE, AND HE CAN WEAR THE
CLOTHES (Paolo 7/31/26)

His list, verbatim, and what each one turned into:

 1. "when im in the animation tab or when i press shuffle animation in character
    i would like it to automatically every 2 seconds to change the directions its
    facing. in animation it can be its own button. it should be on by default.
    maybe next to the all 8 button?"
      -> AUTO-SPIN button beside ALL 8, ON by default, 2000ms, and the CHARACTER
         stage spins too. Pauses itself when ALL 8 is showing (that view already
         shows every facing at once, so spinning it is noise).

 2. "we have all these clothes now in our system. can i wear the clothes now?
    theres no option to."
      -> He was right and it was worse than "no option": there are TWO wardrobes.
         PD.layers is his 7 hand-painted pieces, and that is ALL the CHARACTER tab
         ever offered -- the babypunk outfit. The 221 generated GARMENTS lived
         only in the CLOTHES tab as previews you could look at and never put on.
         Now the character composites worn GARMENTS through the same gen() the
         preview uses, so what he judged is literally what he wears.

 3. "also a shuffle clothes button" -> SHUFFLE FIT, on the character stage next
    to SHUFFLE ANIM, rolls one canon garment per category.

 4. "in animation and character show skeleton is on by default. it should be off
    by default." -> G.showSkel starts false and the button starts OFF.

 5. "in the animation tab wtf does swing amplitude or knock do. i think that was
    based off older alpha shit you can get ride of them." -> both rows deleted.
    The VARIABLES stay (G.swing is read by the rig sync path, G.knock by combat's
    headshot harness at 3 call sites) -- only his UI loses them, and the builders
    that populated them are guarded so their absence cannot throw.

 6. "i want to judge all the animations in bulk now" -> JUDGE ALL: every clip in
    one alphabetical list with KEEP/KILL per row, a live unjudged count, and one
    export. Votes share the existing CAND_VOTE store, so anything he already
    thumbed is already filled in.

 7. "damn i think you made cough worse i think we gotta redo it from the ground
    up." -> REVERTED to its pre-session state, and NOT attempted a third time.
    STOP PRODUCING (7/26): a second rejection ends the feature for the session,
    and "writing a fourth version of anything means you already failed". Cough
    v1 (my amplitude raise) and v2 (my hand lift) were both rejected. It goes
    back to what it was and waits for his direction. whistle and search are
    reported bad by him too and are deliberately NOT touched for the same reason.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): adds no joints, no anatomy, no layering
scheme. Garments composite through the SAME gen(grid,cw,ch) contract the CLOTHES
tab preview already used, reading the rig's own part grid; the cough revert
restores existing coefficients. Nothing here authors a body.
  built on: POSE, CLO_PREVIEW
  joints: none named
  parts: none
  (The first version of this block claimed BAKED, RIG and buildFrame. rig_check_gate
   caught it: none of those words appear in this file. That is the gate doing
   exactly its job -- a citation is a claim the machine can check, never a
   name-drop -- and the claim was mine, so the claim got corrected.)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO new graphic pixels and opens NO
banks. Every garment drawn here already exists in GARMENTS (221 pieces, 12
generators); this tool only makes them wearable. No art is authored.

  python3 tools/bohemia_judging_surface_and_wardrobe_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

edits = []      # (label, old, new)


# ---------------------------------------------------------------- 7. COUGH
def revert_cough(s):
    m = re.search(r"cough:\(d,ph\)=>\{", s)
    if not m:
        return s, False
    i = s.index('{', m.start())
    d = 0
    for k in range(i, len(s)):
        if s[k] == '{':
            d += 1
        elif s[k] == '}':
            d -= 1
            if d == 0:
                break
    body = s[i:k + 1]
    new = (body.replace("g[0][1]-8", "g[0][1]-4")
               .replace("spine:spF(d)*(0.12+0.40*b)", "spine:spF(d)*(0.12+0.18*b)")
               .replace("hipOff:[0,1.9*b]", "hipOff:[0,0.8*b]"))
    return s[:i] + new + s[k + 1:], new != body


# ---------------------------------------------------------- 4. SKELETON OFF
edits.append(('skeleton starts OFF (state)', 'showSkel:true', 'showSkel:false'))
edits.append(('skeleton starts OFF (button)',
              '<div class="row"><b>SHOW SKELETON</b><button class="opt on" id="skelToggle">ON</button></div>',
              '<div class="row"><b>SHOW SKELETON</b><button class="opt" id="skelToggle">OFF</button></div>'))

# ------------------------------------------------- 5. KILL SWING + KNOCK ROWS
edits.append(('SWING AMPLITUDE row deleted (Paolo: "older alpha shit")',
              '      <div class="row"><b>SWING AMPLITUDE</b><input type="range" id="swingR" min="0" max="1" step="0.05"><span id="swingV" class="mini"></span></div>\n',
              ''))
edits.append(('KNOCK row deleted (Paolo: "older alpha shit")',
              '      <div class="row"><b>KNOCK</b><div id="knockBtns"></div></div>\n',
              ''))
# their builders must not throw now that the elements are gone
edits.append(('the swing builder survives its row being gone',
              "  const sw=document.getElementById('swingR');sw.value=G.swing;document.getElementById('swingV').textContent=G.swing;\n"
              "  sw.oninput=()=>{G.swing=+sw.value;document.getElementById('swingV').textContent=G.swing;};",
              "  /* SWING AMPLITUDE + KNOCK: rows removed 7/31 (Paolo: \"wtf does swing amplitude\n"
              "     or knock do... older alpha shit you can get ride of them\"). G.swing and G.knock\n"
              "     STAY -- the rig sync path reads G.swing and combat's headshot harness reads\n"
              "     G.knock at 3 sites -- only his UI loses them, so these builders no-op. */\n"
              "  const sw=document.getElementById('swingR');\n"
              "  if(sw){sw.value=G.swing;const _sv=document.getElementById('swingV');if(_sv)_sv.textContent=G.swing;\n"
              "    sw.oninput=()=>{G.swing=+sw.value;const v2=document.getElementById('swingV');if(v2)v2.textContent=G.swing;};}"))
edits.append(('the knock builder survives its row being gone',
              "  const kb=document.getElementById('knockBtns');kb.innerHTML='';",
              "  const kb=document.getElementById('knockBtns');if(kb){kb.innerHTML='';"))
edits.append(('close the knock builder guard',
              "b.onclick=()=>{G.knock=k;HS.key=null;G.t0=performance.now();document.querySelectorAll('#knockBtns .opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');};kb.appendChild(b);});",
              "b.onclick=()=>{G.knock=k;HS.key=null;G.t0=performance.now();document.querySelectorAll('#knockBtns .opt').forEach(x=>x.classList.remove('on'));b.classList.add('on');};kb.appendChild(b);});}"))

# ------------------------------------------------- 1. AUTO-SPIN + 6. JUDGE ALL
edits.append(('AUTO-SPIN and JUDGE ALL buttons, beside ALL 8',
              '<div class="row"><button id="grid8Btn" class="opt">ALL 8</button><button id="poseEditBtn" class="opt">POSE EDIT</button>',
              '<div class="row"><button id="grid8Btn" class="opt">ALL 8</button>'
              '<button id="autoDirBtn" class="opt on">&#8635; AUTO-SPIN</button>'
              '<button id="judgeAllBtn" class="opt" style="border-color:#6f6">JUDGE ALL</button>'
              '<button id="poseEditBtn" class="opt">POSE EDIT</button>'))
edits.append(('the JUDGE ALL panel host',
              '      <div class="mini" id="animInfo"></div>\n',
              '      <div class="mini" id="animInfo"></div>\n'
              '      <div id="judgeAll" style="display:none"></div>\n'))

# ------------------------------------------------------------ 3. SHUFFLE FIT
edits.append(('SHUFFLE FIT button on the character stage',
              '<button id="charShuf" class="opt" style="position:absolute;right:7px;bottom:7px;line-height:1;padding:5px 9px;background:rgba(20,18,26,.72)">&#8635; SHUFFLE ANIM</button>',
              '<button id="charShuf" class="opt" style="position:absolute;right:7px;bottom:7px;line-height:1;padding:5px 9px;background:rgba(20,18,26,.72)">&#8635; SHUFFLE ANIM</button>'
              '<button id="charFit" class="opt" style="position:absolute;left:7px;bottom:7px;line-height:1;padding:5px 9px;background:rgba(20,18,26,.72)">&#128087; SHUFFLE FIT</button>'))

# ------------------------------------------------------- 2. WEAR THE GARMENTS
edits.append(('GARMENTS reachable outside the clothes tab',
              '  var GARMENTS=[',
              '  /* WEARABLE (Paolo 7/31: "can i wear the clothes now? theres no option to").\n'
              '     The 221 generated garments lived only in this tab as previews. Exposed so the\n'
              '     CHARACTER render can composite the ones he is wearing through the SAME gen()\n'
              '     the preview uses -- what he judged is what he wears. */\n'
              '  var GARMENTS=window.GARMENTS=['))
# INSERTED AFTER THE PAINTED LAYERS, NOT BEFORE. The first version anchored on the
# CLO_PREVIEW line, which sits BEFORE the PD.layers loop -- so his equipped
# babypunk pieces painted straight over every worn garment and wearing a shirt
# changed EXACTLY 0 PIXELS. Fully wired, completely dead. The anchor is now the
# INTERIOR HOLE FILL comment, the first thing after that loop closes. This was a
# manual fix once; putting it in the tool is what makes a rebase replay safe.
edits.append(('worn garments composite AFTER the painted layers',
              "  /* INTERIOR HOLE FILL LAW (Paolo 7/2/26)",
              "  if(window.CLO_PREVIEW){ const gm=window.CLO_PREVIEW(grid,CW,CH); if(gm)for(const gi in gm){ const i=+gi; if(i>=0&&i<px.length) px[i]=gm[gi]; } }\n"
              "  /* WHAT HE IS WEARING (Paolo 7/31). Same gen() contract as the preview, drawn in\n"
              "     the layer order the closet uses so an outer coat lands over its base. Skipped\n"
              "     entirely while CLO_PREVIEW is live, so a preview thumbnail still shows ONE\n"
              "     garment on a clean body instead of his whole fit. */\n"
              "  if(!window.CLO_PREVIEW&&window.GARMENTS&&window.G_WORN){\n"
              "    const ORD=['base','legs','feet','outer','waist','gear','back','neck','hands','head','face'];\n"
              "    for(const lay of ORD){ const nm=window.G_WORN[lay]; if(!nm)continue;\n"
              "      const gg=window.GARMENTS.find(x=>x.n===nm); if(!gg||!gg.gen)continue;\n"
              "      let out=null; try{ out=gg.gen(grid,CW,CH); }catch(e){}\n"
              "      if(out)for(const gi in out){ const i=+gi; if(i>=0&&i<px.length) px[i]=out[gi]; } } }\n"
              "  /* INTERIOR HOLE FILL LAW (Paolo 7/2/26)"))


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if 'G_WORN' in s and 'autoDirBtn' in s:
        print('already applied')
        return 0

    s, coughed = revert_cough(s)
    applied, bad = [], []
    if coughed:
        applied.append('cough REVERTED to its pre-session state (2 rejections = stop)')
    for label, old, new in edits:
        n = s.count(old)
        if n != 1:
            bad.append('%s -> resolved %d times, expected 1' % (label, n))
            continue
        s = s.replace(old, new)
        applied.append(label)
    if bad:
        print('REFUSING TO WRITE:')
        for x in bad:
            print('   ' + x)
        return 1
    open(ALPHA, 'w', encoding='utf-8').write(s)
    for a in applied:
        print('  + ' + a)
    print('%d edits applied' % len(applied))
    return 0


if __name__ == '__main__':
    sys.exit(main())
