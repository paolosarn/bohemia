#!/usr/bin/env python3
"""BOHEMIA -- COOK SIX [the courthouse, finished] (11/21/26; COMBAT FOUR's BUILD 11/21y asked 'FOR COOK (SIX)'; VAMILY rules 461, 453,
441, 416, 451(a), 455).

COMBAT FOUR's courthouse (THE COURTHOUSE, slices/fight_ground/courthouse/courthouse.json, laid by slices/bohemia_big_inside.js): a fight
at the Mob Museum, the 1933 federal courthouse downtown, is fought in its old courtroom (the gallery's pews you climb over, the bar
with its gaps, the well's counsel tables, the judge's bench, the witness stand, the jury box) or on the museum floor (exhibit cases,
stands, dead kiosks, free-standing exhibit walls cutting it into bays). All 14 of its pieces were stand-ins. These are the pictures
under its names, through the master rig, ON this lane's school tool (and the cell block's, the hospital's, the home center's, the
Sphere's, the powerhouse's, the stadium's and COOK FIVE's chain under them):

  THE FLOOR        courthouse_floor_0.webp, five tiles by five: THE 1933 TERRAZZO (the dam's terrazzo ground, the same decade's
                   floor), its brass strips every 1.5 m (a tile's edge is always a strip: any tile meets any tile), the polish worn
                   dull in the paths people walked, a fan of broken glass where a case went over, a scorched patch where somebody
                   burned papers, a long scrape where something heavy was dragged. ONE FLOOR FOR BOTH ROOMS (COMBAT FOUR's file has
                   one kind): no carpet runs, which would scatter over the museum floor; a 'carpet' kind for the aisle and this lane
                   paints it.
  THE PIECES       (courthouse_art.json's kit, COMBAT FOUR's names)
    ct_pews        the gallery's pews, a tile of them: seven rows of dark oak facing the bench (north, so the map's eye sees their
                   backs), two pews a row with their carved ends; one gone, one over, a blanket on a seat, a coat over a back
    ct_bar         the bar: the oak rail between the gallery and the well, a tile long, on its turned balusters; some kicked out
    ct_counsel     a counsel table on its side, its legs out, the chairs, the papers spilled, the water pitcher
    ct_chairs      the well's chairs piled: oak armchairs with leather seats, one on another
    ct_bench       the judge's bench, a tile of it: the raised dais, its paneled oak front, the bench top, the high-backed chair,
                   the gavel's block, a dead lamp with its green shade
    ct_jury        the jury box: two rows of chairs, the back row raised, behind a paneled oak rail
    ct_witness     the witness stand, boxed in oak, raised a step, its chair, the microphone on its gooseneck, a book on the ledge
    ct_case        an exhibit case: its cabinet, the glass gone (one pane left), the mounts empty, the labels, the glass on the floor
    ct_stand       an exhibit's waist-high stand: a post and its reading panel; an audio guide dropped on its cord beside it
    ct_kiosk       a dead screen on its kiosk, the glass cracked, its cable pulled
    ct_wall_ew/_ns the courthouse's stone: cut limestone in courses, a dark marble base, a dead brass sconce
    ct_exhibit_ew/_ns a free-standing exhibit wall (COMBAT FOUR's 'W', an air wall): its graphic panels faded, the photographs
                   gone sepia and grey, one panel peeling
  THE CEILING      courthouse_ceiling.webp (rule 451(a), over the fight at 10%): five bays by five that repeat: the courtroom's
                   coffered plaster (a square grid of deep coffers, a rosette in each), its pendant lamps dead, a patch fallen to
                   the lath, the stains where the roof leaked.

  <venv>/bin/python tools/bohemia_cook6_the_courthouse_finished_11_21_26.py render ct_floor | ct_pieces | ceil_courthouse
  python3 tools/bohemia_cook6_the_courthouse_finished_11_21_26.py cut
  python3 tools/bohemia_cook6_the_courthouse_finished_11_21_26.py sheet <before_dir> <page_dir>

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a 1930s American federal courtroom (dark oak
throughout: the gallery's pews with carved ends behind a turned-baluster bar, counsel tables in the well, the judge's raised bench with
its paneled front, the witness box beside it, the jury box of two tiered rows; a coffered plaster ceiling with pendant lamps); the
period's terrazzo with brass divider strips; a museum floor of vitrines on cabinets, interpretive stands, touchscreen kiosks and
free-standing graphic walls. The twins: this lane's school kit (the same rig and cut) and the powerhouse's terrazzo ground.
REUSE CHECK (REUSE-FIRST): the powerhouse's terrazzo ground (pw_terr, calibrated), the school's cut and sheet, the hospital's bays'
helper; COOK FIVE's rig, grounds, Parts and cutter. New here: the courthouse's plan, its pieces, the coffered ceiling.
ANALOG HORROR: a museum's audio guide dropped on its cord by a stand, still on (COMBAT FOUR's line: the 1950 hearing to an empty room);
the judge's chair still pushed back from the bench as if he just stood up; the photographs on the walls gone grey.
No reference game.
"""
import os, sys, json, math, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_school_finished_11_21_26 as SC              # this lane's: the school (and the cell block, the hospital, ...)

TG = SC.TG; FW = SC.FW; HS = SC.HS
W, H, PPM, PYM, SIDE, TMT, TW, TH = TG.W, TG.H, TG.PPM, TG.PYM, TG.SIDE, TG.TM, TG.TW, TG.TH
FG, REND, LEVEL_H = TG.FG, TG.REND, TG.LEVEL_H
SHIP = os.path.join(FG, 'courthouse')
ROWS = (0, 1, 2, 3, 4)
tile_xy = HS.tile_xy


# ---- the ground: the 1933 terrazzo ---------------------------------------------------------------------------------------------
def plan_ct_floor(ID, seed=223):
    xm, ty, lx, ly, col, row = TG.tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['pw_terr'], np.uint8)
    w = TG.win(lx, ly, 0.5, 1.5)
    dust = TG.mixn(FW.vnoise((H, W), 2.0 * PPM, rng), TG.pnoise(rng, 2.0), w)
    # a closed building is dark: the polish under years of dust a step down from the dam's
    dark = 0.2 + np.clip((0.45 - dust) / 0.3, 0, 1) * 0.08; pale = np.clip((dust - 0.6) / 0.3, 0, 1) * 0.05
    # its brass strips every 1.5 m both ways (a tile's edge is always a strip, so any tile meets any tile)
    strip = (np.abs(((lx + 0.75) % 1.5) - 0.75) > 0.735) | (np.abs(((ly + 0.75) % 1.5) - 0.75) > 0.735)
    dark = np.where(strip, dark + 0.2, dark)
    for r in ROWS:
        for c in range(5):
            sy, sx = tile_xy(r, c); X, Y = lx[sy, sx], ly[sy, sx]; D, Pl = dark[sy, sx], pale[sy, sx]
            nn = FW.vnoise(X.shape, 1.2 * PPM, rng); Wn = TG.win(X, Y, 1.0, 2.4)
            for _ in range(rng.randint(1, 3)):                           # the polish worn dull where people walked: a paler path
                cx, cy = rng.uniform(3, 9), rng.uniform(3, 9); ang = rng.uniform(0, math.pi)
                d0 = np.abs((X - cx) * math.sin(ang) - (Y - cy) * math.cos(ang)); m = np.clip(1 - d0 / 1.3, 0, 1) * Wn * (0.6 + 0.4 * nn)
                Pl[:] = np.maximum(Pl, m * 0.16)
            u = rng.rand()
            if u < 0.25:                                                 # a fan of broken glass where a case went over: pale glints
                cx, cy = rng.uniform(3.5, 8.5), rng.uniform(3.5, 8.5)
                for _ in range(160):
                    a = rng.uniform(-0.9, 0.9) + math.pi / 2; d = abs(rng.normal(0, 1.2)); x, y = cx + d * math.cos(a), cy + d * math.sin(a)
                    Pl[np.hypot(X - x, Y - y) < rng.uniform(0.02, 0.05)] = 0.75
            elif u < 0.4:                                                # a scorched patch where somebody burned papers, the ash in it
                cx, cy = rng.uniform(4, 8), rng.uniform(4, 8); d = np.hypot(X - cx, Y - cy)
                D[:] = np.maximum(D, np.clip(1.25 - d / 1.5, 0, 1) * (0.5 + 0.4 * nn) * 0.75)
                Pl[(d < 0.6) & (nn > 0.4)] = 0.45
            elif u < 0.55:                                               # a long scrape where something heavy was dragged
                cx, cy = rng.uniform(2.5, 4), rng.uniform(3, 9); L_ = rng.uniform(4, 6); a0 = rng.uniform(-0.3, 0.3)
                for off in (-0.25, 0.25):
                    t = np.clip(((X - cx) * math.cos(a0) + (Y - cy) * math.sin(a0)) / L_, 0, 1)
                    d0 = np.hypot(X - cx - t * L_ * math.cos(a0), Y - cy - off - t * L_ * math.sin(a0))
                    Pl[:] = np.maximum(Pl, np.clip(1 - d0 / 0.05, 0, 1) * 0.35 * (1 - t * 0.6))
            for _ in range(rng.randint(3, 7)):                           # heel scuffs
                cx, cy = rng.uniform(1.5, 10.5), rng.uniform(1.5, 10.5); L_ = rng.uniform(0.08, 0.25); a0 = rng.uniform(0, 6.3)
                t = np.clip(((X - cx) * math.cos(a0) + (Y - cy) * math.sin(a0)) / L_, -1, 1); d0 = np.hypot(X - cx - t * L_ * math.cos(a0), Y - cy - t * L_ * math.sin(a0))
                D[d0 < 0.018] = 0.5
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


TG.PLANS['ct_floor'] = plan_ct_floor


def ct_floor_things(bpy, NF, M, rng):
    return FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0.6, 59.4), r_.uniform(1.0, 59.4)), 50)


TG.GARAGE_THINGS['ct_floor'] = ct_floor_things

# ---- the pieces ------------------------------------------------------------------------------------------------------------
CT_AT = dict(pews=(10.0, 46.0), bar=(26.0, 46.0), bench=(42.0, 46.0), wall_ns=(57.0, 45.0),
             wall_ew=(10.0, 37.0), exhibit_ew=(26.0, 37.0), counsel=(42.0, 37.0), exhibit_ns=(57.5, 22.0),
             jury=(8.0, 20.0), witness=(17.0, 20.0), case=(24.5, 20.0), stand=(31.0, 20.0), kiosk=(36.5, 20.0), chairs=(43.0, 20.0))
WALL_H, BAR_H, BENCH_H, EXH_H = 2.4, 0.98, 1.6, 2.6
ROW_W = 1.0                                                     # a pew's row: a metre, back to back


def pew(P, x0, x1, y, rng, how='up'):
    """a pew facing north (the bench), so the map's eye (south) sees its back: the back, the seat, the carved ends"""
    if how == 'over':                                           # knocked over backward: its back flat on the floor, the seat standing up
        P.box('ct_oak', x0, x1, y - 0.5, y - 0.44, 0.0, 0.06); P.box('ct_oak', x0, x1, y - 0.06, y, 0.0, 0.45)
        for x in (x0, x1 - 0.06): P.box('ct_oak', x, x + 0.06, y - 0.5, y, 0.0, 0.5)
        return
    P.box('ct_oak', x0, x1, y, y + 0.06, 0.42, 0.95)                                                           # the back
    P.box('ct_oak_l', x0, x1, y - 0.004, y, 0.88, 0.95)                                                         # its top rail's wear
    P.box('ct_oak', x0, x1, y + 0.06, y + 0.5, 0.4, 0.45)                                                       # the seat
    P.box('under', x0, x1, y + 0.45, y + 0.5, 0.1, 0.4)                                                         # its apron, in shadow
    for x in (x0, x1 - 0.07):                                                                                   # the carved ends
        P.box('ct_oak', x, x + 0.07, y - 0.02, y + 0.55, 0.0, 1.0); P.box('ct_oak_l', x, x + 0.07, y + 0.05, y + 0.25, 1.0, 1.04)


def pews(P, ox, oy, rng):
    """the gallery's pews, a tile of them: seven rows, two pews a row with their carved ends (a gap at the aisle and at the tile's edge,
    so a run of tiles is rows of pews); one gone, one over, a blanket on a seat, a coat over a back, the papers under them"""
    gone = (rng.randint(7), rng.randint(2)); over = (rng.randint(7), rng.randint(2))
    for k in range(7):
        y = oy + k * ROW_W
        for j, (x0, x1) in enumerate(((ox - 5.85, ox - 0.25), (ox + 0.25, ox + 5.85))):
            if (k, j) == gone:
                for x in (x0 + 0.3, x1 - 0.3): P.box('stain', x - 0.1, x + 0.1, y + 0.1, y + 0.4, 0.0, 0.004)     # where its feet were bolted
                continue
            pew(P, x0, x1, y, rng, 'over' if (k, j) == over else 'up')
    k = rng.randint(1, 6); x0 = ox + rng.uniform(-5, 2); P.box(('rug', 'blue', 'tan')[rng.randint(3)], x0, x0 + 1.7, oy + k * ROW_W + 0.08, oy + k * ROW_W + 0.48, 0.45, 0.5)   # a blanket on a seat
    P.box('white', x0 + 1.75, x0 + 2.1, oy + k * ROW_W + 0.1, oy + k * ROW_W + 0.45, 0.45, 0.55)
    k = rng.randint(0, 6); x0 = ox + rng.uniform(-4, 3); P.box('ct_coat', x0, x0 + 0.5, oy + k * ROW_W - 0.03, oy + k * ROW_W + 0.1, 0.5, 0.97)   # a coat over a back
    for _ in range(8): x, y = ox + rng.uniform(-5.6, 5.6), oy + rng.uniform(-0.3, 6.6); P.box('paper', x, x + 0.21, y, y + 0.28, 0.0, 0.005)


def bar(P, ox, oy, rng):
    """the bar: the oak rail between the gallery and the well, a tile long, on its turned balusters; newels every three metres; some
    balusters kicked out, one length of the top rail broken and hanging"""
    brk = rng.randint(0, 3) * 3.0 + 1.0
    P.box('ct_oak', ox - 6, ox + 6, oy, oy + 0.16, 0.0, 0.1)                                                    # its sill
    for s in range(4):
        x0 = ox - 6 + s * 3.0
        if x0 + 1.0 == ox - 6 + brk:                                                                            # the broken length
            P.box('ct_oak', x0 + 0.08, x0 + 1.4, oy + 0.02, oy + 0.14, BAR_H - 0.08, BAR_H)
            P.bar('ct_oak', (x0 + 1.4, oy + 0.08, BAR_H - 0.04), (x0 + 2.4, oy - 0.3, 0.05), 0.05)
            for _ in range(4): x = x0 + rng.uniform(1.4, 2.8); y = oy - rng.uniform(0.2, 0.9); P.bar('ct_oak', (x, y, 0.02), (x + rng.uniform(-0.4, 0.4), y - 0.3, 0.02), 0.025)
        else: P.box('ct_oak', x0, x0 + 3.0, oy + 0.0, oy + 0.16, BAR_H - 0.08, BAR_H)                           # the top rail
        P.box('ct_oak', x0 - 0.08, x0 + 0.08, oy - 0.02, oy + 0.18, 0.0, BAR_H + 0.08)                         # a newel
        P.box('ct_oak_l', x0 - 0.09, x0 + 0.09, oy - 0.03, oy + 0.19, BAR_H + 0.08, BAR_H + 0.12)
        for b in range(1, 20):
            x = x0 + b * 0.15
            if (x0 + 1.0 == ox - 6 + brk and 1.3 < b * 0.15 < 2.7) or rng.rand() < 0.07: continue              # kicked out
            P.drum('ct_oak', x, oy + 0.08, 0.1, BAR_H - 0.08, 0.025, 6)
    P.box('ct_oak', ox + 5.92, ox + 6.0, oy - 0.02, oy + 0.18, 0.0, BAR_H + 0.08)


def counsel(P, ox, oy, rng):
    """a counsel table on its side (cover): its top stood on its edge facing south, its legs out to the north, the chairs, the papers
    spilled, the water pitcher"""
    P.box('ct_oak', ox - 1.3, ox + 1.3, oy + 0.9, oy + 0.97, 0.0, 1.1); P.box('ct_oak_l', ox - 1.3, ox + 1.3, oy + 0.895, oy + 0.9, 0.95, 1.08)
    for x in (ox - 1.15, ox + 1.15):
        for z in (0.1, 1.0): P.box('ct_oak', x - 0.05, x + 0.05, oy + 0.97, oy + 1.72, z - 0.05, z + 0.05)
    P.box('ct_oak', ox - 1.3, ox + 1.3, oy + 0.97, oy + 1.72, 0.0, 0.04)                                        # its apron on the floor
    for (x, y, over) in ((ox - 1.8, oy + 0.3, False), (ox + 1.6, oy + 0.2, True)): SC_chair(P, x, y, over)
    for _ in range(14): x, y = ox + rng.uniform(-2.0, 2.0), oy + rng.uniform(-1.0, 0.8); P.box('paper', x, x + 0.21, y, y + 0.28, 0.0, 0.005)
    P.drum('glass_d', ox + 0.4, oy + 0.3, 0.0, 0.08, 0.1, 10)                                                    # the pitcher on its side


def SC_chair(P, x, y, over=False):
    """a courtroom armchair: oak frame, leather seat and back; or on its back"""
    if over:
        P.box('ct_leather', x - 0.25, x + 0.25, y, y + 0.5, 0.0, 0.06); P.box('ct_oak', x - 0.25, x + 0.25, y + 0.5, y + 0.95, 0.0, 0.05)
        for dx in (-0.25, 0.22): P.box('ct_oak', x + dx, x + dx + 0.03, y + 0.05, y + 0.45, 0.06, 0.5)
        return
    P.box('ct_leather', x - 0.25, x + 0.25, y, y + 0.48, 0.42, 0.48); P.box('ct_leather', x - 0.24, x + 0.24, y + 0.44, y + 0.5, 0.48, 0.92)
    for dx in (-0.27, 0.24): P.box('ct_oak', x + dx, x + dx + 0.03, y + 0.02, y + 0.46, 0.62, 0.66)              # its arms
    for (dx, dy) in ((-0.22, 0.03), (0.2, 0.03), (-0.22, 0.44), (0.2, 0.44)): P.box('ct_oak', x + dx, x + dx + 0.03, y + dy, y + dy + 0.03, 0.0, 0.42)


def chairs(P, ox, oy, rng):
    """the well's chairs piled: oak armchairs with leather seats, two standing, the rest thrown on them"""
    SC_chair(P, ox - 0.6, oy + 0.4); SC_chair(P, ox + 0.1, oy + 0.5)
    for k in range(5):
        x, y = ox + rng.uniform(-1.2, 0.9), oy + rng.uniform(0.2, 1.0); z = 0.5 + rng.uniform(0.0, 0.5)
        a = rng.uniform(-0.8, 0.8); ca, sa = math.cos(a), math.sin(a)
        P.poly('ct_leather', [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-0.25, -0.24), (0.25, -0.24), (0.25, 0.24), (-0.25, 0.24))], z, z + 0.06)
        P.poly('ct_oak', [(x + u * ca - v * sa, y + u * sa + v * ca) for (u, v) in ((-0.25, 0.26), (0.25, 0.26), (0.25, 0.32), (-0.25, 0.32))], z, z + 0.4)
        for (u, v) in ((-0.22, -0.2), (0.22, -0.2)): P.bar('ct_oak', (x + u * ca - v * sa, y + u * sa + v * ca, z), (x + u * ca - v * sa + 0.1, y + u * sa + v * ca - 0.25, z + 0.35), 0.015)
    SC_chair(P, ox + 1.3, oy + 0.1, True)


def bench(P, ox, oy, rng):
    """the judge's bench, a tile of it: the raised dais (its carpet worn), the bench's paneled oak front the tile's width (so the tiles
    meet as one bench), the bench top, the high-backed chair pushed back as if he just stood up, the gavel's block, a dead lamp"""
    D = 9.3                                                     # (the first render's carpet dusted to a pale pink slab the size of the tile: dark now)
    P.box('ct_oak', ox - 6, ox + 6, oy, oy + D, 0.0, 0.42); P.box('ct_carpet', ox - 6, ox + 6, oy + 0.6, oy + D - 0.1, 0.42, 0.44)
    for k in range(1, 8): P.box('under', ox - 6, ox + 6, oy + 0.6 + k * 1.2, oy + 0.62 + k * 1.2, 0.44, 0.445)   # the carpet's seams
    P.box('ct_oak', ox - 6, ox + 6, oy, oy + 0.6, 0.0, BENCH_H)                                                  # the front
    for k in range(9):                                                                                          # its panels' stiles
        x = ox - 6 + k * 1.5; P.box('ct_oak_l', x, x + 0.1, oy - 0.03, oy, 0.1, BENCH_H - 0.1)
    P.box('ct_oak_l', ox - 6, ox + 6, oy - 0.03, oy, 0.1, 0.18); P.box('ct_oak_l', ox - 6, ox + 6, oy - 0.03, oy, BENCH_H - 0.18, BENCH_H - 0.1)
    P.box('ct_oak', ox - 6, ox + 6, oy - 0.05, oy + 1.2, BENCH_H, BENCH_H + 0.06)                                # the bench top
    P.box('ct_leather', ox - 1.2, ox + 0.4, oy + 0.5, oy + 1.0, BENCH_H + 0.06, BENCH_H + 0.065)                 # its blotter
    cx, cy = ox - 0.3 + rng.uniform(-0.6, 0.6), oy + 2.4                                                         # the chair, pushed back
    P.drum('black', cx, cy, 0.44, 0.5, 0.3, 6); P.box('ct_leather', cx - 0.32, cx + 0.32, cy - 0.3, cy + 0.3, 0.9, 1.0)
    P.box('ct_leather', cx - 0.3, cx + 0.3, cy + 0.28, cy + 0.42, 1.0, 1.95)
    P.box('ct_oak', ox + 0.8, ox + 1.0, oy + 0.6, oy + 0.75, BENCH_H + 0.06, BENCH_H + 0.09)                     # the gavel's block
    P.bar('ct_oak', (ox + 0.85, oy + 0.9, BENCH_H + 0.1), (ox + 1.15, oy + 0.95, BENCH_H + 0.1), 0.02)
    P.drum('brass', ox + 2.2, oy + 0.8, BENCH_H + 0.06, BENCH_H + 0.4, 0.03, 6); P.drum('ct_shade', ox + 2.2, oy + 0.8, BENCH_H + 0.36, BENCH_H + 0.48, 0.2, 10)   # a dead lamp
    for _ in range(5): x, y = ox + rng.uniform(-5, 5), oy + rng.uniform(0.2, 1.0); P.box('paper', x, x + 0.21, y, y + 0.28, BENCH_H + 0.06, BENCH_H + 0.065)


def jury(P, ox, oy, rng):
    """the jury box: two rows of six chairs, the back row raised a step, behind a paneled oak rail; a chair turned, one gone"""
    P.box('ct_oak', ox - 2.8, ox + 2.8, oy, oy + 3.2, 0.0, 0.15); P.box('ct_oak', ox - 2.8, ox + 2.8, oy + 1.7, oy + 3.2, 0.15, 0.4)
    P.box('ct_carpet', ox - 2.7, ox + 2.7, oy + 0.15, oy + 1.65, 0.15, 0.16)
    P.box('ct_oak', ox - 2.8, ox + 2.8, oy, oy + 0.1, 0.0, 1.0); P.box('ct_oak_l', ox - 2.85, ox + 2.85, oy - 0.03, oy + 0.13, 1.0, 1.05)   # the rail
    for x in (ox - 2.8, ox + 2.7): P.box('ct_oak', x, x + 0.1, oy, oy + 3.2, 0.0, 1.0)
    for k in range(1, 6): P.box('ct_oak_l', ox - 2.8 + k * 0.93, ox - 2.75 + k * 0.93, oy - 0.03, oy, 0.15, 0.9)
    for (z, y) in ((0.15, oy + 0.6), (0.4, oy + 2.1)):
        for i in range(6):
            x = ox - 2.3 + i * 0.92
            if rng.rand() < 0.08: continue
            t = rng.rand() < 0.12
            P.drum('black', x, y + 0.25, z, z + 0.38, 0.04, 6); P.box('ct_leather', x - 0.24, x + 0.24, y + 0.02, y + 0.48, z + 0.38, z + 0.45)
            if t: P.box('ct_leather', x + 0.2, x + 0.27, y + 0.02, y + 0.48, z + 0.45, z + 0.95)                # turned
            else: P.box('ct_leather', x - 0.23, x + 0.23, y + 0.44, y + 0.52, z + 0.45, z + 0.95)
    P.box('paper', ox + 0.6, ox + 0.85, oy + 0.7, oy + 1.0, 0.6, 0.605)                                         # a juror's notepad


def witness(P, ox, oy, rng):
    """the witness stand: raised a step, boxed in paneled oak on three sides, its chair, the microphone on its gooseneck, a book"""
    P.box('ct_oak', ox - 1.0, ox + 1.0, oy, oy + 1.8, 0.0, 0.3); P.box('ct_carpet', ox - 0.9, ox + 0.9, oy + 0.1, oy + 1.7, 0.3, 0.31)
    P.box('ct_oak', ox - 1.0, ox + 1.0, oy, oy + 0.1, 0.0, 1.2); P.box('ct_oak_l', ox - 1.05, ox + 1.05, oy - 0.05, oy + 0.3, 1.2, 1.25)   # the front and its ledge
    for x in (ox - 1.0, ox + 0.9): P.box('ct_oak', x, x + 0.1, oy, oy + 1.8, 0.0, 1.2)
    for k in (-0.5, 0.5): P.box('ct_oak_l', ox + k - 0.03, ox + k + 0.03, oy - 0.03, oy, 0.1, 1.1)
    P.box('ct_oak', ox - 1.3, ox - 1.0, oy + 1.2, oy + 1.8, 0.0, 0.15)                                         # its step
    SC_chair(P, ox, oy + 0.8)
    P.bar('black', (ox + 0.4, oy + 0.15, 1.25), (ox + 0.3, oy + 0.4, 1.55), 0.012); P.drum('black', ox + 0.3, oy + 0.42, 1.55, 1.62, 0.03, 8)   # the microphone
    P.box('black', ox - 0.6, ox - 0.25, oy - 0.02, oy + 0.24, 1.25, 1.3)                                         # a book on the ledge


def case(P, ox, oy, rng):
    """an exhibit case: its cabinet, the glass gone (one pane left at its end), the mounts empty, the labels, its brass plate, the
    glass on the floor"""
    P.box('ct_cab', ox - 1.0, ox + 1.0, oy + 0.2, oy + 1.1, 0.0, 0.9); P.box('black', ox - 1.02, ox + 1.02, oy + 0.18, oy + 1.12, 0.0, 0.08)
    P.box('ct_felt', ox - 0.98, ox + 0.98, oy + 0.22, oy + 1.08, 0.9, 0.92)
    for (x0, y0) in ((-1.0, 0.2), (0.98, 0.2), (-1.0, 1.08), (0.98, 1.08)): P.box('chrome', ox + x0, ox + x0 + 0.02, oy + y0, oy + y0 + 0.02, 0.92, 1.62)   # its frame
    P.box('chrome', ox - 1.0, ox + 1.0, oy + 0.2, oy + 0.22, 1.6, 1.62); P.box('chrome', ox - 1.0, ox + 1.0, oy + 1.08, oy + 1.1, 1.6, 1.62)
    P.box('glass_d', ox + 0.97, ox + 0.99, oy + 0.22, oy + 1.08, 0.92, 1.6)                                     # one pane left
    for (x, y) in ((-0.6, 0.6), (0.0, 0.5), (0.5, 0.75)):
        P.box('white', ox + x - 0.06, ox + x + 0.06, oy + y - 0.04, oy + y + 0.04, 0.92, 1.1); P.box('paper', ox + x - 0.1, ox + x + 0.1, oy + 0.26, oy + 0.34, 0.92, 0.925)   # empty mounts, their labels
    P.box('brass', ox - 0.3, ox + 0.3, oy + 0.17, oy + 0.2, 0.6, 0.72)
    for _ in range(30): x, y = ox + rng.uniform(-1.6, 1.6), oy - rng.uniform(0.0, 1.0); P.box('glassbit', x, x + rng.uniform(0.05, 0.16), y, y + rng.uniform(0.04, 0.1), 0.0, 0.012)


def stand(P, ox, oy, rng):
    """an exhibit's waist-high stand: a post and its reading panel; an audio guide dropped on its cord beside it"""
    P.box('ct_cab', ox - 0.3, ox + 0.3, oy + 0.2, oy + 0.6, 0.0, 0.03); P.box('ct_cab', ox - 0.05, ox + 0.05, oy + 0.35, oy + 0.45, 0.03, 0.85)
    P.box('ct_panel', ox - 0.45, ox + 0.45, oy + 0.1, oy + 0.7, 0.85, 0.92)
    P.box('paper', ox - 0.38, ox + 0.1, oy + 0.18, oy + 0.62, 0.92, 0.925); P.box('ct_photo', ox + 0.15, ox + 0.38, oy + 0.3, oy + 0.6, 0.92, 0.925)
    x, y = ox + 0.7, oy - 0.2; P.box('black', x, x + 0.08, y, y + 0.16, 0.0, 0.03); P.bar('black', (x + 0.04, y + 0.16, 0.02), (ox + 0.3, oy + 0.3, 0.6), 0.006)   # the audio guide, on its cord
    P.box('haz', x + 0.02, x + 0.03, y + 0.12, y + 0.13, 0.03, 0.035)                                            # its light, still on


def kiosk(P, ox, oy, rng):
    """a dead screen on its kiosk: the pillar, the slanted screen, its glass cracked, the cable pulled out"""
    P.box('ct_cab', ox - 0.3, ox + 0.3, oy + 0.2, oy + 0.6, 0.0, 1.05); P.box('black', ox - 0.32, ox + 0.32, oy + 0.18, oy + 0.62, 0.0, 0.06)
    P.box('ct_cab', ox - 0.36, ox + 0.36, oy + 0.1, oy + 0.62, 1.05, 1.12); P.box('black', ox - 0.31, ox + 0.31, oy + 0.15, oy + 0.57, 1.12, 1.13)
    P.bar('white', (ox - 0.2, oy + 0.2, 1.135), (ox + 0.25, oy + 0.5, 1.135), 0.004); P.bar('white', (ox + 0.05, oy + 0.33, 1.135), (ox - 0.1, oy + 0.55, 1.135), 0.004)   # cracked
    P.bar('black', (ox + 0.3, oy + 0.5, 0.2), (ox + 0.9, oy + 0.1, 0.01), 0.012)                               # the cable


def wall_ew(P, ox, oy, rng):
    """the courthouse's stone: cut limestone in courses (0.6 m, the joints staggered), a dark marble base, a dead brass sconce"""
    P.box('ct_stone', ox - 6, ox + 6, oy, oy + 0.4, 0.0, WALL_H); P.box('ct_stone', ox - 6, ox + 6, oy - 0.01, oy + 0.41, WALL_H, WALL_H + 0.06)
    P.box('ct_marble', ox - 6, ox + 6, oy - 0.03, oy + 0.4, 0.0, 0.32)
    for k in range(1, 4):
        z = 0.32 + k * 0.6 - 0.12; P.box('under', ox - 6, ox + 6, oy - 0.004, oy, z, z + 0.012)
    for k in range(4):
        z0 = 0.32 + k * 0.6 - 0.12; z1 = min(WALL_H, z0 + 0.6)
        for i in range(11):
            x = ox - 6 + i * 1.2 + (0.6 if k % 2 else 0.0)
            if ox - 6 < x < ox + 6: P.box('under', x - 0.006, x + 0.006, oy - 0.004, oy, max(0.32, z0), z1)
    x = ox + rng.uniform(-3, 3); P.box('brass', x - 0.06, x + 0.06, oy - 0.12, oy, 1.85, 2.05); P.drum('glass_d', x, oy - 0.16, 2.0, 2.15, 0.1, 8)   # a sconce, dead
    P.box('stain', ox + 2.0, ox + 2.6, oy - 0.006, oy, 0.32, 1.9)                                                # where the rain came down it


def wall_ns(P, ox, oy, rng):
    P.box('ct_stone', ox - 0.2, ox + 0.2, oy, oy + 12, 0.0, WALL_H); P.box('ct_stone', ox - 0.21, ox + 0.21, oy, oy + 12, WALL_H, WALL_H + 0.06)
    P.box('ct_marble', ox - 0.23, ox + 0.23, oy - 0.02, oy, 0.0, 0.32); P.box('ct_stone', ox - 0.206, ox + 0.206, oy - 0.006, oy, 0.32, WALL_H)


def exhibit_ew(P, ox, oy, rng):
    """a free-standing exhibit wall, a tile long: its frame, four graphic panels faded (a title band, the text in blocks, the
    photographs gone grey and sepia), one panel peeling"""
    P.box('ct_cab', ox - 6, ox + 6, oy, oy + 0.3, 0.0, EXH_H); P.box('black', ox - 6, ox + 6, oy - 0.02, oy + 0.32, 0.0, 0.08)
    peel = rng.randint(4)
    for k in range(4):
        x0 = ox - 6 + k * 3.0 + 0.1; x1 = x0 + 2.8
        P.box('ct_panel', x0, x1, oy - 0.01, oy, 0.25, EXH_H - 0.15)
        P.box('ct_title', x0 + 0.1, x1 - 0.1, oy - 0.012, oy - 0.01, EXH_H - 0.5, EXH_H - 0.25)
        for j in range(3): P.box('paper', x0 + 0.15, x0 + 1.25, oy - 0.012, oy - 0.01, 0.5 + j * 0.45, 0.85 + j * 0.45)   # its text, in blocks
        P.box('ct_photo', x0 + 1.4, x1 - 0.15, oy - 0.012, oy - 0.01, 0.9, 1.9)
        if k == peel: P.prism_y('ct_panel', oy - 0.6, oy - 0.01, [(x1 - 1.0, 0.25), (x1 - 0.1, 0.25), (x1 - 0.1, 1.2), (x1 - 1.0, 0.9)])   # peeling off it
    P.box('ct_cab', ox - 6, ox + 6, oy - 0.02, oy + 0.32, EXH_H, EXH_H + 0.05)


def exhibit_ns(P, ox, oy, rng):
    P.box('ct_cab', ox - 0.15, ox + 0.15, oy, oy + 12, 0.0, EXH_H + 0.05); P.box('ct_panel', ox - 0.155, ox + 0.155, oy - 0.006, oy, 0.25, EXH_H - 0.15)


def ct_parts(P, rng):
    A = CT_AT
    for k, f in (('pews', pews), ('bar', bar), ('bench', bench), ('wall_ns', wall_ns), ('wall_ew', wall_ew), ('exhibit_ew', exhibit_ew), ('counsel', counsel),
                 ('exhibit_ns', exhibit_ns), ('jury', jury), ('witness', witness), ('case', case), ('stand', stand), ('kiosk', kiosk), ('chairs', chairs)):
        f(P, *A[k], rng)


def ct_mats(bpy, NF, F, M, which):
    if which not in ('ct_pieces', 'tun_pieces'): return
    if which == 'ct_pieces': SC.sc_mats_(bpy, NF, F, M, 'sc_pieces')
    M.update(ct_oak=NF.material(bpy, 'in_black_oak_stained', 'clay_rust', 1, 0.9), ct_oak_l=NF.material(bpy, 'in_oak_worn', 'clay_rust', 2, 0.9),
             ct_leather=NF.material(bpy, 'in_black_leather', 'clay_rust', 0, 0.95), ct_carpet=NF.material(bpy, 'in_black_carpet_court', 'clay_rust', 0, 1.0),
             ct_coat=NF.material(bpy, 'in_black_coat_wool', 'tape_grey', 1, 1.0), ct_shade=NF.material(bpy, 'in_glass_bankers_green', 'clay_teal', 1, 0.6),
             ct_cab=NF.material(bpy, 'in_black_exhibit_cabinet', 'tape_grey', 1, 0.9), ct_felt=NF.material(bpy, 'in_felt_case', 'clay_rust', 1, 1.0),
             ct_panel=NF.material(bpy, 'in_exhibit_panel_faded', 'clay_teal', 1, 0.9), ct_title=NF.material(bpy, 'in_exhibit_title_faded', 'clay_mustard', 2, 0.9),
             ct_photo=NF.material(bpy, 'in_photo_sepia', 'tape_masking', 2, 0.9), ct_stone=NF.material(bpy, 'in_stone_limestone', 'clay_bone', 2, 0.92),
             ct_marble=NF.material(bpy, 'in_black_marble_base', 'tape_grey', 1, 0.5),
             ct_plaster=NF.material(bpy, 'in_ceil_plaster', 'clay_bone', 3, 0.95), ct_plaster_d=NF.material(bpy, 'in_ceil_plaster_coffer', 'clay_bone', 1, 0.95))


TG.PARTS['ct_pieces'] = ct_parts
TG.MAT_HOOKS.append(ct_mats)


# ---- the ceiling: the courtroom's coffered plaster -----------------------------------------------------------------------------
def ceil_courthouse(P, rng):
    """the courtroom's coffered plaster: a square grid of deep coffers (2.4 m), their beams and an inner molding, a rosette in each;
    its pendant lamps dead; a patch fallen to the lath in some bays; the stains where the roof leaked; cracks"""
    at = TG.at
    P.box('ct_plaster_d', -3.0, 63.0, -3.0, 63.0, -0.3, 0.0)
    for k in range(-1, 27):                                     # the beams, across the whole scene (drawn bay by bay, the last bay's east and south
        P.box('ct_plaster', k * 2.4 - 0.18, k * 2.4 + 0.18, -3.0, 63.0, 0.0, 0.2)                     #  edges had no beam: THE GATE's C2, 11.9 against 8)
        P.box('ct_plaster', -3.0, 63.0, SIDE - k * 2.4 - 0.18, SIDE - k * 2.4 + 0.18, 0.0, 0.21)
    for r in range(5):
        for c in range(5):
            fall = (rng.randint(1, 4), rng.randint(1, 4)) if rng.rand() < 0.55 else None    # (inside the bay: THE GATE's C2 caught a fallen coffer on a bay's edge, 14.6 against 8)
            for i in range(5):
                for j in range(5):
                    x, y = at(c, r, i * 2.4, j * 2.4)
                    if fall and (i, j) == fall or (fall and abs(i - fall[0]) + abs(j - fall[1]) == 1 and 0 < i < 4 and 0 < j < 4 and rng.rand() < 0.35):
                        P.box('black', x + 0.18, x + 2.22, y - 2.22, y - 0.18, 0.0, 0.004)                         # fallen to the lath
                        for k in range(6): P.box('sc_wood', x + 0.2, x + 2.2, y - 0.4 - k * 0.32, y - 0.36 - k * 0.32, 0.005, 0.01)
                        P.bar('ct_plaster', (x + 1.2, y - 1.2, 0.01), (x + 1.4, y - 1.5, 0.5), 0.12)                # a chunk hanging
                        continue
                    P.box('ct_plaster', x + 0.5, x + 1.9, y - 1.9, y - 0.5, 0.0, 0.04)                              # the inner molding's field
                    P.box('ct_plaster_d', x + 0.58, x + 1.82, y - 1.82, y - 0.58, 0.04, 0.05)
                    P.drum('ct_plaster', x + 1.2, y - 1.2, 0.05, 0.09, 0.18, 12)                                    # a rosette
            for (i, j) in ((1, 1), (3, 3)):                                                                         # the pendant lamps, dead
                x, y = at(c, r, i * 2.4 + 1.2, j * 2.4 + 1.2, 0.6); P.drum('brass', x, y, 0.5, 0.56, 0.12, 10); P.drum('glass_d', x, y, 0.56, 0.7, 0.32, 12)
            if rng.rand() < 0.45: x, y = at(c, r, rng.uniform(4, 8), rng.uniform(4, 8), 0.01); TG.bloom(P, 'stain', x, y, rng.uniform(0.7, 1.4), rng, 6)
            for _ in range(rng.randint(1, 3)):                                                                     # cracks
                x, y = at(c, r, rng.uniform(4, 8), rng.uniform(4, 8)); a = rng.uniform(0, 6.3)
                for k in range(4):
                    x1, y1 = x + 0.5 * math.cos(a), y + 0.5 * math.sin(a); P.bar('black', (x, y, 0.045), (x1, y1, 0.045), 0.012); x, y, a = x1, y1, a + rng.uniform(-0.6, 0.6)


TG.CEILINGS['courthouse'] = (ceil_courthouse, 'courthouse/courthouse_ceiling.webp', "the courtroom's coffered plaster: a square grid of deep coffers with a rosette in each, the pendant lamps dead, a patch fallen to the lath, the stains where the roof leaked, cracks")
TG.CEIL_DATA['courthouse'] = 'courthouse/courthouse.json'

# ---- the cut ---------------------------------------------------------------------------------------------------------------------
KIND = dict(pews='LOW_COVER', bar='LOW_COVER', counsel='COVER', chairs='LOW_COVER', bench='COVER', jury='LOW_COVER', witness='COVER', case='COVER',
            stand='LOW_COVER', kiosk='LOW_COVER', wall_ew='WALL', wall_ns='WALL', exhibit_ew='WALL', exhibit_ns='WALL')
HM = dict(pews=1.0, bar=BAR_H, counsel=1.1, chairs=1.2, bench=BENCH_H, jury=1.05, witness=1.25, case=1.62, stand=0.92, kiosk=1.13, wall_ew=WALL_H, wall_ns=WALL_H,
          exhibit_ew=EXH_H, exhibit_ns=EXH_H)
NAME = dict(pews='PEWS', bar="THE BAR'S RAIL", counsel='A COUNSEL TABLE', chairs='PILED CHAIRS', bench="THE JUDGE'S BENCH", jury='THE JURY BOX', witness='THE WITNESS STAND',
            case='AN EXHIBIT CASE', stand='AN EXHIBIT STAND', kiosk='A DEAD KIOSK', wall_ew="THE COURTHOUSE'S STONE", wall_ns="THE COURTHOUSE'S STONE",
            exhibit_ew='AN EXHIBIT WALL', exhibit_ns='AN EXHIBIT WALL')


def cut():
    os.makedirs(SHIP, exist_ok=True); bytes_ = {}
    im = Image.open(os.path.join(REND, 'ct_floor.png')).convert('RGB'); fn = os.path.join(SHIP, 'courthouse_floor_0.webp'); im.save(fn, 'WEBP', quality=TG.QS, method=6); bytes_['floor'] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'ct_pieces.png')).convert('RGBA'); A = CT_AT; sz = {}
    def one(key, box, shadow=0.7, foot=None): sz[key] = TG.cut_piece(im, foot or A[key], box, 'ct_' + key, 'courthouse', shadow)
    x, y = A['pews']; one('pews', (x - 6.0, x + 6.0 + 0.01, y - 0.7, y + 6.6 + 1.05 * 1.45), 1.0)
    x, y = A['bar']; one('bar', (x - 6.0, x + 6.0 + 0.01, y - 1.3, y + 0.3 + (BAR_H + 0.15) * 1.45), 0.6)
    x, y = A['bench']; one('bench', (x - 6.0, x + 6.0 + 0.01, y - 0.2, y + 9.4 + (BENCH_H + 0.5) * 1.45), 1.0)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 0.5 + WALL_H * 1.45), 1.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + WALL_H * 1.45), 0.5)
    x, y = A['exhibit_ew']; one('exhibit_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.8, y + 0.4 + EXH_H * 1.45), 1.0)
    x, y = A['exhibit_ns']; one('exhibit_ns', (x - 0.6, x + 0.6, y - 0.05, y + 12.1 + EXH_H * 1.45), 0.5)
    x, y = A['counsel']; one('counsel', (x - 2.4, x + 2.2, y - 1.2, y + 1.9 + 1.2 * 1.45), 1.0)
    x, y = A['jury']; one('jury', (x - 3.1, x + 3.1, y - 0.3, y + 3.3 + 1.0 * 1.45), 1.0)
    x, y = A['witness']; one('witness', (x - 1.5, x + 1.3, y - 0.3, y + 1.9 + 1.65 * 1.45), 1.0)
    x, y = A['case']; one('case', (x - 1.8, x + 1.8, y - 1.2, y + 1.2 + 1.7 * 1.45), 1.0)
    x, y = A['stand']; one('stand', (x - 0.8, x + 1.1, y - 0.4, y + 0.8 + 1.0 * 1.45), 1.0)
    x, y = A['kiosk']; one('kiosk', (x - 0.6, x + 1.1, y - 0.1, y + 0.7 + 1.2 * 1.45), 1.0)
    x, y = A['chairs']; one('chairs', (x - 1.7, x + 1.8, y - 0.3, y + 1.4 + 1.2 * 1.45), 1.0)
    for key, v in sz.items():
        if v['foot'][1] > v['h']:
            fn = os.path.join(SHIP, 'ct_%s.webp' % key); q = Image.open(fn).convert('RGBA'); o = Image.new('RGBA', (q.width, int(v['foot'][1]) + 1), (0, 0, 0, 0)); o.alpha_composite(q, (0, 0))
            o.save(fn, 'WEBP', quality=86, method=6); v['h'] = o.height
    for k, v in sz.items(): v.update(piece=k, src='courthouse/ct_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(SHIP, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['courthouse/courthouse_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    ent = lambda k: dict(kind=KIND[k], h=HM[k], name=NAME[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot'])
    kit = {'ct_' + k: ent(k) for k in sz}
    art = {'version': 'cook6-courthouse-art-11-21', 'lane': 'cook 6 (COOK FIVE\'s list)', 'stage': 'finished',
           'for': "COMBAT FOUR's courthouse (slices/fight_ground/courthouse/courthouse.json, BUILD 11/21y): the names its handoff asked for, the garage's format. floor.floor is the 1933 terrazzo (all 25 tiles: its brass strips every 1.5 m so every tile's edge is a strip, the polish worn dull where people walked, a fan of broken glass, a scorched patch where papers were burned, a scrape where something was dragged; nothing within a metre of an edge but the strips); floor.ring the same. ONE FLOOR FOR BOTH ROOMS, as your file has one kind: no carpet runs, which would scatter over the museum floor; give the courtroom's aisle a 'carpet' kind and this lane paints it.",
           'floor': {'floor': cells(ROWS), 'ring': cells(ROWS)}, 'kit': kit,
           'how_it_lays': {'the gallery': "ct_pews a tile wide, seven rows a metre apart facing north (the bench), two pews a row, the tile's south row at your 'at' [0.5, 0.72], the rows up to 1.6 m from its north edge; ct_bar the oak rail a tile long at its foot (your 'at' [0.5, 0.6]).",
                           'the well and the bench': "ct_bench a tile wide: its paneled front at the foot (your 'at' [0.5, 0.95]), the dais 9.3 m to the north; two B rows make the clerk's front and the bench's. ct_counsel a table on its side; ct_chairs a pile; ct_jury the box 5.6 m wide; ct_witness the box 2 m.",
                           'the museum floor': "ct_case a vitrine 2 m; ct_stand a reading stand and the audio guide; ct_kiosk a dead screen; ct_exhibit_ew / _ns a free-standing wall 2.6 m, a tile long (your 'W', an air wall).",
                           'the walls': "ct_wall_ew / _ns: cut limestone to 2.4 m on a dark marble base, a tile long."},
           'bytes': bytes_}
    TG.keep_ceiling(art, os.path.join(SHIP, 'courthouse_art.json'))
    cp = os.path.join(REND, 'ceil_courthouse.png')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGBA'); bg = Image.new('RGBA', im.size, tuple(int(v) for v in np.asarray(im)[..., :3].reshape(-1, 3).mean(0)) + (255,)); bg.alpha_composite(im)
        fn = os.path.join(SHIP, 'courthouse_ceiling.webp'); bg.convert('RGB').resize(TG.CEIL_PX, Image.LANCZOS).save(fn, 'WEBP', quality=70, method=6); bytes_['ceiling'] = os.path.getsize(fn)
        p = os.path.join(FG, 'courthouse/courthouse.json'); s = open(p).read(); i = s.index('"ceiling"'); j = s.index('}', i); e = s[i:j]
        assert '"src": "courthouse/courthouse_ceiling.webp"' in e
        now = json.loads(s)['ceiling']
        if not (now.get('have') is True and now.get('tile') == [TG.CEIL_COVERS, TG.CEIL_COVERS]):   # (the one agreed edit in COMBAT FOUR's file)
            e = re.sub(r'"have":\s*(false|true)', '"have": true', e); e = re.sub(r'"tile":\s*\[[^\]]*\]', '"tile": [%d, %d]' % (TG.CEIL_COVERS, TG.CEIL_COVERS), e)
            open(p, 'w').write(s[:i] + e + s[j:])
        art['ceiling'] = dict(sheet='courthouse/courthouse_ceiling.webp', bays=[5, 5], bay_px=[TG.CEIL_PX[0] // 5, TG.CEIL_PX[1] // 5], covers=[TG.CEIL_COVERS, TG.CEIL_COVERS], what=TG.CEILINGS['courthouse'][2],
                              contract="courthouse.json 'ceiling' (COMBAT FOUR's: the fight draws it over the board at that alpha, rule 451(a)); five bays by five that repeat")
    json.dump(art, open(os.path.join(SHIP, 'courthouse_art.json'), 'w'), indent=1)
    print('courthouse: bytes', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})
    tot = sum(os.path.getsize(os.path.join(SHIP, f)) for f in os.listdir(SHIP) if f.endswith('.webp')); print('the folder\'s pictures', tot, 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_COURTHOUSE_11_21.webp: before and now on his phone (the ceiling off and at his 10%), the museum floor,
    close in, the pieces at their own pixels, two tiles of the terrazzo, the ceiling at full strength"""
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(items, cw, ch):
        r = Image.new('RGB', (WID, ch + 26), BG); d = ImageDraw.Draw(r); x = 0
        for lab, n in items: n = n.convert('RGB').resize((cw, ch), Image.LANCZOS); d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); x += cw + 10
        rows.append(r)
    up = lambda fn: (lambda n: n.crop((0, int(n.width * 150 / 390), n.width, int(n.width * 720 / 390))))(Image.open(fn))
    title('THE COURTHOUSE, BEFORE AND NOW', 'on his phone, 390 x 844, as the fight opens in the courtroom: before (every piece a stand-in), now, and now with the ceiling at his 10%')
    cw = (WID - 20) // 3; ch = int(570 * cw / 390)
    strip((('BEFORE: ALL ITS PIECES STAND-INS', up(os.path.join(before_dir, 'courthouse_upright_open_a0.png'))), ('NOW, THE CEILING OFF', up(os.path.join(page_dir, 'courthouse_upright_open_a0.png'))),
           ('NOW, AS HE MEETS IT: THE CEILING AT 10%', up(os.path.join(page_dir, 'courthouse_upright_open_a01.png')))), cw, ch)
    first_row = len(rows) - 1
    title('CLOSE IN, ON THE PAGE', "pinched in on his phone: the gallery's pews and the bar, the judge's bench, the jury box")
    strip([(lab, up(os.path.join(page_dir, 'courthouse_upright_%s.png' % n))) for lab, n in (('THE PEWS, THE BAR', 'pews_close'), ("THE JUDGE'S BENCH", 'bench_close'), ('THE JURY BOX', 'jury_close'))], cw, ch)
    mf = os.path.join(page_dir, 'mf', 'courthouse_upright_open_a0.png')
    if os.path.exists(mf):
        title('THE OTHER ROOM: THE MUSEUM FLOOR', 'exhibit cases, stands, dead kiosks, free-standing exhibit walls cutting it into bays')
        strip((('THE MUSEUM FLOOR', up(mf)), ('THE CASES', up(os.path.join(page_dir, 'mf', 'courthouse_upright_cases_close.png'))), ('AN EXHIBIT WALL', up(os.path.join(page_dir, 'mf', 'courthouse_upright_walls_close.png')))), cw, ch)
    title('THE PIECES AT THEIR OWN PIXELS', "the pews, the bar, the bench, the jury box, the witness stand, the counsel table, the chairs, a case, a stand, a kiosk, the walls")
    def piece(k, bg=(150, 146, 132)):
        im = Image.open(os.path.join(SHIP, 'ct_%s.webp' % k)).convert('RGBA'); o = Image.new('RGBA', im.size, bg + (255,)); o.alpha_composite(im); return o.convert('RGB')
    def row_of(keys, hgt):
        ims = [piece(k) for k in keys]; ims = [i.resize((max(1, int(i.width * hgt / i.height)), hgt), Image.LANCZOS) for i in ims]
        tot = sum(i.width for i in ims) + 8 * (len(ims) - 1); k = min(1.0, WID / tot)
        r = Image.new('RGB', (WID, int(hgt * k)), BG); x = 0
        for i in ims: i = i.resize((max(1, int(i.width * k)), int(hgt * k)), Image.LANCZOS); r.paste(i, (x, 0)); x += i.width + 8
        rows.append(r)
    row_of(('pews', 'bench'), 300); row_of(('bar', 'wall_ew', 'exhibit_ew'), 110); row_of(('jury', 'witness', 'counsel', 'chairs'), 170); row_of(('case', 'stand', 'kiosk'), 150)
    title('THE TERRAZZO, AND THE CEILING AT FULL STRENGTH', 'its brass strips, the polish worn dull, broken glass, a scorched patch; the coffered plaster, the lamps dead, a patch fallen to the lath')
    fl = Image.open(os.path.join(SHIP, 'courthouse_floor_0.webp')).convert('RGB'); ce = Image.open(os.path.join(SHIP, 'courthouse_ceiling.webp')).convert('RGB')
    t1 = fl.crop((TW, 0, TW * 2, TH)); t2 = fl.crop((TW * 2, TH * 3, TW * 3, TH * 4)); cw3 = (WID - 20) // 4; hh3 = int(TH * cw3 / TW)
    cwc = WID - 2 * (cw3 + 10); hc = int(ce.height * cwc / ce.width); r = Image.new('RGB', (WID, max(hh3, hc)), BG)
    r.paste(t1.resize((cw3, hh3), Image.LANCZOS), (0, 0)); r.paste(t2.resize((cw3, hh3), Image.LANCZOS), (cw3 + 10, 0)); r.paste(ce.resize((cwc, hc), Image.LANCZOS), (2 * (cw3 + 10), 0)); rows.append(r)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [cw + 10 + cw + 10, y + 26, cw, ch]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_COURTHOUSE_11_21.webp'); out.save(fn, 'WEBP', quality=74, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-courthouse-11-21.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]:
            fn = TG.scene_ground(n, '--quick' in a) if n == 'ct_floor' else TG.scene_pieces(n, '--quick' in a) if n == 'ct_pieces' else TG.scene_ceiling('courthouse', '--quick' in a)
            print('  rendered', n, fn, flush=True)
    elif a and a[0] == 'plan':
        ID = TG.ids(); gid, dark, pale = plan_ct_floor(ID)
        img = np.zeros((H, W, 3), np.float32); img[:] = (176, 166, 146)
        img = img * (1 - dark[..., None] * 0.7) + (255 - img) * pale[..., None] * 0.35
        fn = os.path.join(TG.OUT, 'ct_floor_plan.png'); Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(fn); print(fn)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    else: print(__doc__)
