#!/usr/bin/env python3
"""BOHEMIA -- COOK 10/19/26: THE MASTER RIG, RUN AS IT IS, WITH ITS OCCLUSION AND BEVEL NODES AT ONE RAY A CAMERA SAMPLE.
Rule 121(j): every building and accessory goes through the rig, and a building is twenty times a prop's pixels.

The rig's source pass (tools/bohemia_direction_master_rig.py, DIRECTION's, never edited) puts an Ambient Occlusion node
(the crevice grime) and a Bevel node (the chipped edge) into every material, each casting 8 rays at EVERY camera sample;
the rig renders 128 camera samples a pixel, so a pixel already averages 1,024 occlusion rays where 128 converge. This
wrapper runs the rig file unchanged as __main__ and, before every render, sets those two nodes to one ray a camera
sample: the same picture in expectation, about five times faster on a ground (measured on the floor's blocks and on the
barrier's rig run, both ways, in records/BOHEMIA_COOK_THE_FLOOR_THROUGH_THE_RIG_10_19_26.md). Nothing else changes; the
rig's own rig.json, card and breaks are written exactly as the rig writes them.

  <venv>/bin/python tools/bohemia_cook_rig_one_ray.py <the master rig's own arguments>

REFERENCE CHECK (the 9/4 standing duty): the rig is DIRECTION's master rig, the card is its card. No reference game.
REUSE CHECK (REUSE-FIRST): the rig file is executed whole (runpy); only a render_pre handler is added.
TASTE CHECK: none; no pixel is chosen here.
"""
import os, sys, runpy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RIG = os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')


def install():
    import bpy
    from bpy.app.handlers import persistent

    @persistent
    def one_ray(scene, *_):
        for m in bpy.data.materials:
            if not m.use_nodes or not m.node_tree: continue
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL') and n.samples != 1: n.samples = 1
    bpy.app.handlers.render_pre.append(one_ray)


if __name__ == '__main__':
    install()
    sys.argv = [RIG] + sys.argv[1:]
    sys.path.insert(0, os.path.dirname(RIG))
    runpy.run_path(RIG, run_name='__main__')
    sys.stdout.flush(); os._exit(0)
