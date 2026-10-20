#!/usr/bin/env python3
"""COMBAT, rule 121 round (10/19): THE THREE CARDS IN THE VOTE TAB, one per row, each with its card id in the registry and on
the board in the same push (rule 118b). Appends to records/target/BOHEMIA_VOTE_REGISTRY.json, never edits another lane's
object; the first pictures are cut by RUN TWO's tool (tools/bohemia_run2_first_picture.py), never by hand.
    python3 tools/bohemia_combat_the_round_cards.py <sha>
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')


def cards(sha, rig):
    return [
        dict(id='combat-the-fight-wears-the-3d-models-10-19', kind='animation', lane='combat', sha=sha, made='10/19',
             title='THE FIGHT IN THE 3D MODELS: EVERY MAN, EVERY ENEMY AND EVERY BEAST, EIGHT WAYS, THE GUN HELD IN BOTH HANDS',
             said="we have to do a full implementation of the 3D models, that's top priority... BRO EVERYTHING IS A 3D MODEL NOW FUCK THE UGLY 8 BIT SHIT / I dont like how the weapons just swing with the hand like some dumbass shit",
             why='Every fighter is now his clay model in eight directions, walking, shooting, swinging, hit and falling, with his face in the strip from the same model, and a man with a gun holds it in both hands, still while his legs walk, never swinging loose with his arm. You see it here in the VOTE tab from the fight\'s own camera, and it is live at today\'s size in the COMBAT tab and the demo\'s fights.',
             show=dict(how='image', src='../records/target/combat/COMBAT_THE_FIGHT_WEARS_THE_RIG_10_19.webp',
                       # the first picture (RUN TWO's cut, tools/bohemia_run2_first_picture.py --rect 585 0 585 1266): the after
                       first='../records/target/vote_first/combat-the-fight-wears-the-3d-models-10-19.webp', firstAt=[585, 0, 585, 1266]),
             before_after=dict(before='the old flat people, two facings, painted faces', after='the rig models, eight facings, the clips on the beat, the gun in both hands, the portrait from the same model', scale='the phone at 1:1, halved side by side; the man below at two phone pixels to the rig\'s'),
             twin=dict(src='slices/fight_people/cast_apron.webp', diffs=[
                 'NOW: the man was painted flat and had two facings (south-east and south-west); every man is his clay model now, turning through all eight.',
                 'NOW: he walked, swung and fell from the flat sheet\'s nine frames; the rig\'s own walk (six keys) and four new clips (the gun up, the swing, the blow landing, the fall) play on the beat.',
                 'NOW: a gun hung from one hand and swung with his arm as he walked; it is held across him in both hands, still while his legs walk, and up at the shoulder when he shoots.',
                 'NOW: his face in the strip was a painted 64; it is PORTRAIT\'s portrait of the same model, so his hair and skin on the board and in the strip are one.']),
             sprites=rig, look=dict(px=1, palette='slices/fight_rig/fight_rig.json (64 colours a sheet)', light='upper-left'), draft=True),
        dict(id='combat-smooth-10-19', kind='animation', lane='combat', sha=sha, made='10/19',
             title='THE FIGHT, SMOOTH: THE SAME FIGHT BEFORE AND AFTER, EVERY FRAME',
             said="combat is still not smooth, it still sucks, it looks like it's been coded by a fifth grader",
             why='The same fight played twice side by side, before and after: the men glide down their whole path instead of hopping tile by tile, the next man moves a fraction of a beat after the last one instead of two whole beats, the camera keeps moving instead of stopping the turn, and blows and falls play whole. You see it here in the VOTE tab, every frame the game drew, and it is live in the COMBAT tab and the demo\'s fights.',
             show=dict(how='image', src='../records/target/combat/COMBAT_SMOOTH_BEFORE_AFTER_10_19.webp'), draft=True),
        dict(id='combat-the-tear-and-the-floor-10-19', kind='tile', lane='combat', sha=sha, made='10/19',
             title='THE TEAR ON YOUR MAN, AND THE FLOOR MADE THE 3D WAY (BEFORE AND AFTER)',
             said="combat only... I'm fucking with the tear / the fight floor: looks like shit",
             why='The man you control wears the tear you picked, in the fight only, and the ground under the men is now modelled and lit by the same sun as they are (slabs with their joints, stones as stones, cracked mud) instead of painted tiles. You see it here in the VOTE tab on the real fight, before on the left and after on the right, and both are live in the COMBAT tab and the demo\'s fights.',
             show=dict(how='image', src='../records/target/combat/COMBAT_THE_TEAR_AND_THE_FLOOR_10_19.webp'),
             before_after=dict(before='the floor as it shipped (two soils and a camouflage print)', after='the ground modelled and rendered through the rig, laid by the same plan', scale='1:1 at his idle stop'),
             twin=dict(src='records/target/cook2_fight_floor/COOK2_FIGHT_FLOOR_KIT.json', diffs=[
                 'NOW: every ground was a flat painted soil pasted in blobs; it is modelled: concrete slabs with their joints and each its own tilt, stones lying on the dirt, the dry wash split into plates.',
                 'NOW: the ground was lit by whoever painted the tile; it is lit by the one sun the men are lit by, from the upper left.',
                 'NOW: the man whose turn it was had only tape on his tile\'s corners; he wears the tear, the picture failing to hold him, on the beat.']),
             draft=True),
    ]


def main():
    """appended as text before the items' closing bracket, so no other lane's object is reformatted (a json.dump of the whole
    registry rewrote 276 lines of CHARACTER's card, measured 10/19); a card already there is replaced in place, its own lines"""
    sha = sys.argv[1]
    text = open(REG).read()
    reg = json.loads(text)
    rig = sorted('slices/fight_rig/' + f for f in os.listdir(os.path.join(ROOT, 'slices/fight_rig')) if f.endswith('.webp') and not f.endswith('_guns.webp') and f != 'faces.webp')
    have = {it.get('id') for it in reg['items']}
    add = []
    for c in cards(sha, rig):
        block = '\n'.join(' ' + l for l in json.dumps(c, indent=1, ensure_ascii=False).split('\n'))
        if c['id'] in have:
            i = text.index('\n  "id": "%s"' % c['id']); a = text.rindex('\n {', 0, i); b = text.index('\n }', i) + 3
            text = text[:a + 1] + block + text[b:]
        else: add.append(block)
    if add:
        k = text.index('\n ],\n "verdicts"')
        text = text[:k] + ',\n' + ',\n'.join(add) + text[k:]
    json.loads(text)
    open(REG, 'w').write(text)
    print('registered', [c['id'] for c in cards(sha, rig)])


if __name__ == '__main__':
    main()
