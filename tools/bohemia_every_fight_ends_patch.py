#!/usr/bin/env python3
"""
V239 -- EVERY FIGHT ENDS (COMBAT, rule 57: "COMBAT owns the end condition")

PAOLO 10/1, he played the demo: "I entered combat and it was so dog shit and then combat didn't end so I
couldn't get back into the overworld." Rule 57: EVERY FIGHT ENDS AND RETURNS TO THE MAP: all down / all
fled / your side down, then the map where you were. RUN [fight returns] owns the way back; COMBAT owns the
end condition. Battle Brothers: the battle is over when the last enemy is dead or has fled the field.

WHY IT NEVER ENDED, FOUND IN THE SOURCE: V159 (8/16) made the way out the ONLY win -- "Killing every man
no longer ends the fight" -- and every fight places a way out (placeWayOut), so on a cleared board the
game said NOTHING LEFT IN YOUR WAY and waited for him to walk there. Nobody told him; he sat on a quiet
board. And V212's rout waited for him to chase every runner still in reach, with no limit.

NOW: when nobody is left who can fight (dead, down, broken or running), the fight ends and pays out,
way out or not. Men still running inside his reach give him ROUT_TURNS turns to run them down (V212's
choice stays), then the fight ends anyway. Reaching the way out is still the early win: leaving before
the shooting is over. His side down is still the loss. The rout's one-time line is reset every fight
(it never was: after the first rout it never spoke again).

NO DAMAGE BEFORE THE DIAL: nothing about how a shot or a hit works moves. Only when it is over.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__EVERY_FIGHT_ENDS__'

EDITS = [
 ("function fightOver(){ return aliveEnemies().length===0 && chaseable().length===0; }",
  """/* ===== V239 __EVERY_FIGHT_ENDS__ (COMBAT, rule 57, Paolo 10/1: "combat didn't end so I couldn't get back
   into the overworld"). Over when nobody can fight; runners in reach buy ROUT_TURNS turns to chase, then
   it is over anyway. The way out is the early win, never the only one. */
const ROUT_TURNS=3;   /* [DIAL] turns to run down the men who broke, then they got away */
function fightOver(){ if(aliveEnemies().length>0){ G._routAt=null; return false; }
  if(G._routAt==null)G._routAt=(G.mTurn||0);
  return chaseable().length===0 || ((G.mTurn||0)-G._routAt)>=ROUT_TURNS; }"""),
 ("  if(fightOver()){ if(!(EXIT_ON&&G.exit))try{winGame();}catch(_e){} }else{ try{routAsk();}catch(_e){} } }",
  "  if(fightOver()){ try{winGame();}catch(_e){} }else{ try{routAsk();}catch(_e){} } }   /* V239: over is over, way out or not */"),
 ("    if(EXIT_ON&&G.exit){ try{ setRead('NOTHING LEFT IN YOUR WAY','the way out is '+Math.round(G.exit.edist)+' tiles \\u2014 go','#8fe89a'); }catch(_e){} return false; }\n",
  "    /* V239: the cleared board no longer waits for him to walk to the way out (rule 57) */\n"),
 ("function afterKill(){ if(fightOver()&&!(EXIT_ON&&G.exit))return winGame();   /* V212 __THE_ROUT__ */\n  if(fightOver())return endTurnReturn(false);   /* V159: board clear, but you still have to leave */\n",
  "function afterKill(){ if(fightOver())return winGame();   /* V212 __THE_ROUT__ */   /* V239: the last man down ends it (rule 57) */\n"),
 ("function resetFightState(){\n  G.over=false;",
  "function resetFightState(){\n  G._routSaid=false; G._routAt=null;   /* V239: the rout speaks once per fight, not once ever */\n  G.over=false;"),
 ("  setRead(G._wonByExit?'YOU MADE IT':'AREA CLEAR',\n          G._wonByExit?'out, and it never mattered how many you left standing':'every gun down','#8fe89a'); setPhaseUI();",
  "  const _ran=!G._wonByExit&&G.e.some(e=>e&&!e.dead&&e.fleeing);   /* V239: all fled is an end too */\n"
  "  setRead(G._wonByExit?'YOU MADE IT':(_ran?'THEY RAN':'AREA CLEAR'),\n"
  "          G._wonByExit?'out, and it never mattered how many you left standing':(_ran?'the rest got away, the street is yours':'every gun down'),'#8fe89a'); setPhaseUI();"),
]


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  every fight already ends')
        return
    if '__COVER_IS_A_THING__' not in blob:
        sys.exit('GUARD: V238 is not in this blob; V239 is written on top of it')
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V239 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
