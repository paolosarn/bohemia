/* ANIMATION [the aura of the one you control], CANDIDATE C, THE CURRENT: the sheet's table (written by
   tools/bohemia_animation_the_aura_current_bake.py from DIRECTION's master rig, never by hand). Rows are the facings,
   columns the twelve keys of one bar (three a beat at 120 BPM); a cell is the rig's one crop box. origin[F] is the
   cell pixel where the stand-in's feet centre (the world origin) lands, computed from the rig's camera (rig.json
   ground_screen minus crop_box_px) and checked against the stand-in's own pixels; lay it on his feet point. */
window.AURA_CURRENT = {"src":"ANIMATION_THE_AURA_CURRENT.webp","cell":[89,134],"keys":12,"keys_per_beat":3,"bpm":120,"ppm":57,"rows":{"N":0,"NE":1,"E":2,"SE":3,"S":4,"SW":5,"W":6,"NW":7},"origin":{"N":[40,108],"NE":[40,108],"E":[40,108],"SE":[40,108],"S":[40,108],"SW":[40,108],"W":[40,108],"NW":[40,108]},"origin_exact":[40.0,108.02],"layer":"front","rig":"records/target/master_rig/aura_current/rig.json","model":"reference/models/bohemia/aura_current.glb","arc_px_by_key":[362,54,68,239,89,20,312,68,58,316,67,63],"rim":"#1d1b1b"};
