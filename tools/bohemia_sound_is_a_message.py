#!/usr/bin/env python3
"""
BOHEMIA — SILENT-1: WHICH SOUNDS ARE MESSAGES (8/25/26, SOUND lane).

REUSE CHECK: cooks nothing. It reads the approved bank and the engine's own
briefs and writes one column beside each moment. No candidate, no voice, no
pixel.

ROUTED BY SWEEP 19 (coordinator, 8/25): "a sound may be the best copy of a
message; it may never be the only copy." SOUND classifies, RUN draws. The
coordinator named three cues it could see and said outright that this lane would
know the rest.

THE TEST, and it is deliberately narrow:
    IF HE CANNOT HEAR IT, DOES HE MISS A STATE CHANGE HE HAS TO ACT ON?
Not "is it useful", not "is it nice" -- ACT ON. Everything else is ATMOSPHERE,
and atmosphere is exempt by the sweep's own decision: losing it costs beauty and
nothing else, and that is most of the 500 candidates this lane has cooked.

THREE CORRECTIONS TO THE INPUT, because a routed task is not exempt from being
checked:

1. `done_ring` IS A CORPSE. The coordinator listed it as one of the three. It
   went 0 UP / 5 DOWN and holds no approved sound; the moment IT IS DONE is real
   but its SFX died 10 for 10 across two ids. It is carried by a STING now.

2. WHICH MEANS THE STINGS HAD TO BE IN SCOPE AT ALL. The sweep says "a
   one-column pass over the rack", and the rack is the SFX engine -- but the
   most information-dense sounds in this game are not in it. taken / paid /
   done / missed are the transaction family, they are pure state change, and a
   pass that only walked the rack would have missed every one of them.

3. AND MOST OF THE THREE ALREADY HAVE A TWIN, WHICH MAKES THE LIST SMALLER, NOT
   BIGGER. Saying so is the point of doing this in the lane that knows the
   sounds: handing RUN a padded list would cost them work on cues that are
   already covered.

WHAT THIS FILE WILL NOT CLAIM. It does NOT assert whether a visual twin exists.
That is a claim about PIXELS, the sweep says so in capitals, and this repo has
spent a month finding finished code with no caller -- a lane that greps for
`ammo` and calls it a readout is that bug wearing a badge. Where a twin is
suspected it is marked SUSPECTED and left for SILENT-2 to confirm on the real
surface. The one thing this lane is authoritative about is which sounds carry
MESSAGES, and that is the only column it fills.

  python3 tools/bohemia_sound_is_a_message.py           # print
  python3 tools/bohemia_sound_is_a_message.py --write   # write the record
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = 'records/BOHEMIA_SOUND_IS_A_MESSAGE_8_25_26.json'

# INFORMATION: the sound carries a state change he has to act on.
# `twin` is what THIS lane believes, never what it proved: SILENT-2 confirms on
# pixels. NONE means this lane could find nothing that says it visually and it is
# the strongest candidate for a twin; SUSPECTED means something plausibly already
# says it and RUN should check before drawing anything.
INFORMATION = {
    'save_chime': dict(
        msg='THE RUN WAS WRITTEN',
        twin='NONE',
        why='the strongest case in the game. Nothing anywhere says a save '
            'happened; the chime is the entire notification. A player who '
            'cannot hear it has no way at all to know his run is safe, which is '
            'exactly the thing a person checks before putting the phone down.'),
    'ui_deny': dict(
        msg='YOU CANNOT DO THAT',
        twin='NONE',
        why='a refusal with no sound is indistinguishable from a BROKEN BUTTON. '
            'This is the one on the list that does not just lose information, '
            'it actively teaches the wrong thing: he taps, nothing happens, and '
            'the game looks broken rather than strict. His own brief for it is '
            '"refused. short and flat, never a buzzer."'),
    'phone_buzz': dict(
        msg='A JOB ARRIVED',
        twin='SUSPECTED (an unread badge on the phone button)',
        why='the coordinator is right that this is a message and right that the '
            'badge is weak, and sweep 14 already found the badge is the ONLY '
            'other pointer at the day\'s work. So the twin exists but is thin: '
            'this is a STRENGTHEN job, not a draw-from-nothing job, and that '
            'distinction is worth RUN\'s time.'),
    'dry_fire': dict(
        msg='EMPTY -- THE SHOT DID NOT HAPPEN',
        twin='SUSPECTED (combat draws a great deal of state)',
        why='in a rhythm fight, pressing and getting nothing is a beat lost and '
            'a chain broken. He has to know it was EMPTY rather than mistimed, '
            'and those two failures feel identical without the sound.'),
    'block': dict(
        msg='IT DID NOT GET THROUGH',
        twin='SUSPECTED (combat shows verdicts)',
        why='the difference between a hit and a blocked hit is the difference '
            'between a working plan and a wasted beat.'),
}

# ATMOSPHERE: losing it costs beauty and nothing else. Grouped so the reasoning
# is inspectable rather than a flat list of 50 names.
ATMOSPHERE_WHY = {
    'the world': 'air_day air_inside air_night generator wind_gust sign_alive',
    'the ground under him': 'step_asphalt step_concrete step_dirt step_gravel '
                            'step_sand step_wood walk_more sand_more wood_more',
    'the body': 'come_up sleep_sink lungs_burn heartbeat boots_go cloth_on '
                'tape_pull eat drink',
    'the fight, which is a VISUAL event': 'shot shot_more hit hit_more kill '
                                          'melee_hit vital_deep miss_past '
                                          'swing_air casing dirt_take '
                                          'stone_bite cover_more hurt hurt_more '
                                          'went_down will_goes',
    'things he does to the world': 'door_drag pickup set_down demolish power_on '
                                   'time_pass mag_home',
    'the interface answering a touch': 'ui_tap ui_back',
}

# THE STINGS. Not in the rack at all, and the reason this pass is not just a
# one-column edit of the SFX table.
STINGS = {
    'taken':  dict(msg='YOU TOOK THE JOB', twin='SUSPECTED (an objective '
                   'arrives on screen -- measured 8/25 on the real walk)',
                   why='the commitment. The objective line appearing IS a twin, '
                       'and a good one.'),
    'paid':   dict(msg='YOU WERE PAID', twin='SUSPECTED (the purse changes)',
                   why='the purse is a number on a screen; this is likely '
                       'already covered.'),
    'done':   dict(msg='THE JOB IS FINISHED', twin='SUSPECTED (the objective '
                   'line resolves)', why='carries the moment whose SFX died '
                   '10 for 10 -- the coordinator\'s `done_ring`.'),
    'missed': dict(msg='THE JOB WENT UNFINISHED', twin='NONE',
                   why='the quietest failure in the game. Nothing announces that '
                       'the day ended with the work undone -- he just wakes up '
                       'on day two. This is a real gap and it is not on the '
                       'coordinator\'s list because the sting system is not in '
                       'the rack they swept.'),
    'win':    dict(msg='THE FIGHT IS WON', twin='SUSPECTED (the fight ends '
                   'visibly)', why='hard to miss on screen.'),
    'loss':   dict(msg='THE FIGHT IS LOST', twin='SUSPECTED (the fight ends '
                   'visibly)', why='hard to miss on screen.'),
}


def main():
    bank = json.load(open(sorted(glob.glob('banks/BOHEMIA_SFX_APPROVED_*.json'))[-1],
                          encoding='utf8'))
    eng = open('engine/bohemia_sfx.js', encoding='utf8').read()
    labels = {e: l for e, l, w in
              re.findall(r"\{ ev: '([a-z_]+)',\s*label: '([^']*)',\s*why: '([^']*)'", eng)}

    atmos = {}
    for group, names in ATMOSPHERE_WHY.items():
        for n in names.split():
            atmos[n] = group

    rows, unclassified = {}, []
    for ev in sorted(bank):
        if ev in INFORMATION:
            rows[ev] = dict(kind='INFORMATION', label=labels.get(ev, '?'),
                            **INFORMATION[ev])
        elif ev in atmos:
            rows[ev] = dict(kind='ATMOSPHERE', label=labels.get(ev, '?'),
                            group=atmos[ev])
        else:
            unclassified.append(ev)

    for fig, d in STINGS.items():
        rows['STING:' + fig] = dict(kind='INFORMATION', label='(sting) ' + d['msg'],
                                    **d)

    info = {k: v for k, v in rows.items() if v['kind'] == 'INFORMATION'}
    need = {k: v for k, v in info.items() if v.get('twin') == 'NONE'}

    print('=== SILENT-1: WHICH SOUNDS ARE MESSAGES ===')
    print('  approved moments classified : %d' % len(bank))
    print('  stings classified           : %d' % len(STINGS))
    print('  INFORMATION                 : %d' % len(info))
    print('  ATMOSPHERE                  : %d  (exempt by sweep 19)'
          % sum(1 for v in rows.values() if v['kind'] == 'ATMOSPHERE'))
    print()
    print('  NO TWIN THIS LANE COULD FIND -- the real work for SILENT-2 (%d):'
          % len(need))
    for k in sorted(need):
        print('     %-16s %s' % (k, need[k]['msg']))
    print()
    print('  A TWIN IS SUSPECTED -- CHECK BEFORE DRAWING (%d):'
          % (len(info) - len(need)))
    for k in sorted(info):
        if info[k].get('twin') != 'NONE':
            print('     %-16s %s' % (k, info[k]['twin']))
    if unclassified:
        print()
        print('  *** UNCLASSIFIED, AND THAT IS A DEFECT: %s' % ', '.join(unclassified))
        print('      Every approved moment gets a column. Add it above.')

    if '--write' not in sys.argv:
        print('\n(--write to bake the record)')
        return 1 if unclassified else 0

    json.dump({'law': 'records/BOHEMIA_THREE_SOUNDS_ARE_THE_ONLY_COPY_8_25_26.md',
               'routed': 'SWEEP 19, SOUNDS SILENT-1',
               'test': 'if he cannot hear it, does he miss a state change he has '
                       'to act on?',
               'note': 'twin values are what the SOUND lane BELIEVES, never what '
                       'it proved. SILENT-2 confirms on pixels. NONE means this '
                       'lane could find nothing visual and it is the strongest '
                       'candidate for a twin.',
               'rows': rows},
              open(OUT, 'w', encoding='utf8'), indent=1, sort_keys=True)
    print('\n  wrote %s' % OUT)
    return 1 if unclassified else 0


if __name__ == '__main__':
    sys.exit(main())
