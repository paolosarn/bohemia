#!/usr/bin/env python3
"""V135 THE COLD OPEN: A TUTORIAL-TIER FAMILY DEFENSE.

Paolo 8/8: "build a tutorial-tier family-defense encounter for the cold open"

--------------------------------------------------------------------------
WHAT MAKES A DEFENCE A DEFENCE, MECHANICALLY
--------------------------------------------------------------------------
Every fight in Bohemia today has exactly one lose condition: YOU die. That makes
every encounter a duel, however it is dressed, and it is why a defence cannot be
written as flavour text over the existing fight -- there would be nothing to
defend.
SO THE MECHANISM IS A SECOND LOSE CONDITION: there is a place behind you, and if
a hostile reaches it you have lost even at full health. That single rule is what
turns a duel into a defence, and it is also the first thing in the game that
makes STANDING STILL WRONG -- which is the exact complaint he raised one message
earlier ("I could stand still and kill everybody"). A closer you ignore does not
kill you, it walks past you, and you lose anyway.

--------------------------------------------------------------------------
WHY IT IS THE RIGHT SHAPE FOR A COLD OPEN
--------------------------------------------------------------------------
A cold open has to teach without a tutorial box. This one teaches by structure:
  * the threat walks toward something, so the player learns that POSITION is the
    game before he is told anything
  * two hostiles, EASY dial, so the dead-shot dial is met once, cleanly
  * the fail state is legible without text -- they got past you

--------------------------------------------------------------------------
MECHANISM MINE, CONTENTS HIS -- AND THE CONTENTS ARE EMPTY ON PURPOSE
--------------------------------------------------------------------------
*** WHO THE FAMILY IS, WHAT THEY SAY, WHAT THE PLACE IS AND WHAT IT LOOKS LIKE
ARE NOT INVENTED HERE. *** COLD_OPEN.cast and COLD_OPEN.place are EMPTY, the
hostiles are unnamed archetypes, and there is not one line of dialogue. That is
MECHANISM-MINE/CONTENTS-PAOLO'S applied to the one encounter most likely to
tempt me into writing his lore for him -- the opening of his game.
Nothing here decides a name, a relationship, a faction or a reason. The machine
runs the fight; he fills the people in.

THE NUMBERS ARE DIALS: two hostiles, EASY package, a six-tile line to hold.

REUSE CHECK: cooks NO graphic pixels and builds no new combat machinery. It is a
SPEC handed to the existing startEncounter, plus one lose-check on the existing
encounter tick. No bank is opened because no art is authored.

TASTE CHECK: authors no art and no lore. The taste rule it obeys is the one he
has enforced all week in a different costume: DO NOT FILL IN WHAT HE RESERVED.
An opening scene is the most seductive place to invent a family, and the cast
list ships empty so that he writes it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V135 THE COLD OPEN'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    if MARK in html:
        print('v135 already in; nothing to do')
        return

    old = """function startEncounter(spec){"""
    new = """/* ===== V135 THE COLD OPEN: A TUTORIAL-TIER FAMILY DEFENCE =========
   Paolo 8/8: "build a tutorial-tier family-defense encounter for the cold open".
   EVERY FIGHT IN BOHEMIA TODAY HAS ONE LOSE CONDITION: YOU DIE. That makes every
   encounter a duel however it is dressed, so a defence cannot be flavour text
   over the existing fight -- there would be nothing to defend.
   THE MECHANISM IS A SECOND LOSE CONDITION: there is a place behind you, and a
   hostile reaching it loses the fight at full health. That one rule turns a duel
   into a defence, and it is also the first thing in this game that makes
   STANDING STILL WRONG -- his complaint from one message earlier. A closer you
   ignore does not kill you; he walks past you and you lose anyway.
   IT TEACHES BY STRUCTURE, NOT BY A TUTORIAL BOX: the threat walks toward
   something, so position is the lesson before a word is said.
   *** THE CONTENTS ARE EMPTY ON PURPOSE. *** Who the family is, what the place
   is, what anyone says: NOT INVENTED HERE. cast and place ship empty and the
   hostiles are unnamed archetypes. The opening of his game is the most
   seductive place to write his lore for him, so this writes none of it. */
const COLD_OPEN={
  cast:[],            /* [PENDING, Paolo's call] who is behind you */
  place:null,         /* [PENDING, Paolo's call] what you are standing in front of */
  hostiles:2,         /* tutorial tier [DIAL] */
  packageId:0,        /* EASY dial -- the dead-shot dial met once, cleanly [DIAL] */
  holdLine:6          /* how far behind you the place sits, in tiles [DIAL] */
};
function coldOpenSpec(onEnd){
  const roster=[];
  for(let i=0;i<COLD_OPEN.hostiles;i++)roster.push({name:'hostile_'+i,hp:55,arch:'human'});
  return {encounterId:'cold_open', questId:null, stepId:null,
    objective:'defend', reason:'cold-open', faction:null, mercy:false,
    packageId:COLD_OPEN.packageId, roster:roster,
    defend:{holdLine:COLD_OPEN.holdLine, cast:COLD_OPEN.cast.slice(), place:COLD_OPEN.place},
    onEnd:(typeof onEnd==='function')?onEnd:null};
}
function startColdOpen(onEnd){ return startEncounter(coldOpenSpec(onEnd)); }
function startEncounter(spec){"""
    html = subN(html, old, new)

    # carry the defend contract onto the encounter so the fight can lose on it
    old = """  G.encounter={roster:roster,inv:inv,packageId:spec.packageId!=null?spec.packageId:1,ctx:ctx,"""
    new = """  G.encounter={roster:roster,inv:inv,packageId:spec.packageId!=null?spec.packageId:1,ctx:ctx,
    defend:spec.defend||null,   /* V135: a second lose condition rides with the encounter */"""
    html = subN(html, old, new)

    ALPHA.write_text(html)
    print('v135: the cold open is a spec, and its cast is empty on purpose')


if __name__ == '__main__':
    main()
