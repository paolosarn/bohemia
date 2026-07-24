#!/usr/bin/env python3
"""BOHEMIA ISO-3D BAKER (7/23/26) — the "rethink the approach" for building art.

Paolo, after 4 procedural passes: "it's looking better it still kind of looks
like dog shit" -> chose RETHINK THE APPROACH. Hand-drawing pixel faces in code
caps out at programmer-art. Pocket City 2's buildings are (their words) "2.5D
isometric sprites baked from 3D source." So this is a tiny SOFTWARE 3D RENDERER:
model a building as real 3D volumes, light it properly, and BAKE it down to a
crisp sprite. Real projection means windows/detail can't be "off the wall plane"
(that whole class of bug is gone), and lighting falls out of face normals + a
key/ambient rig instead of hand-tuned flat tones.

Pipeline: define a Scene of boxes / n-gon prisms / quads with per-face materials
-> project with an isometric camera -> z-buffer rasterize with barycentric fill
-> shade = ambient + key*max(0, n·L) -> render at SUPERSAMPLE x, box-downscale to
the final size for clean antialiased edges (the "baked" tell) -> a soft ground
shadow under the footprint. Materials can be a flat color OR an on-plane WINDOW
GRID (glass panes + mullions), patterned by the face's own interpolated UV so it
is always exactly on the surface.

No external deps beyond numpy + PIL. Deterministic. Pure geometry + light.

  from bohemia_iso3d import Scene, bake
"""
import math

import numpy as np


# ---- camera: orthographic isometric (2:1). world z is UP. -------------------
# screen_x = (x - y) * s ;  screen_y = (x + y) * s * 0.5 - z * s
# depth (nearest = MAX) = x + y + z  (standard iso sort key for non-interpenetrating solids)
def _project(p, s, ox, oy):
    x, y, z = p
    return (ox + (x - y) * s, oy + (x + y) * s * 0.5 - z * s, x + y + z)


def _norm(v):
    n = math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) or 1.0
    return (v[0] / n, v[1] / n, v[2] / n)


class Scene(object):
    def __init__(self):
        self.faces = []   # each: (verts[4] 3D, uvs[4], normal, material)

    def quad(self, v0, v1, v2, v3, material, normal=None):
        if normal is None:
            a = (v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2])
            b = (v3[0] - v0[0], v3[1] - v0[1], v3[2] - v0[2])
            normal = _norm((a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]))
        self.faces.append(([v0, v1, v2, v3], [(0, 0), (1, 0), (1, 1), (0, 1)], normal, material))

    def box(self, pos, size, mats):
        """pos = min corner (x,y,z), size = (dx,dy,dz). mats = dict of
        top/px/py/nx/ny (px = +x face...) or a single material for all."""
        x, y, z = pos
        dx, dy, dz = size
        # a single material (a dict with 'c'/'t', or a non-dict) applies to every
        # face; a per-face dict names top/px/py/nx/ny.
        if not isinstance(mats, dict) or not any(k in mats for k in ('top', 'px', 'py', 'nx', 'ny')):
            mats = {k: mats for k in ('top', 'px', 'py', 'nx', 'ny')}
        c = [(x, y, z), (x + dx, y, z), (x + dx, y + dy, z), (x, y + dy, z),
             (x, y, z + dz), (x + dx, y, z + dz), (x + dx, y + dy, z + dz), (x, y + dy, z + dz)]
        self.quad(c[4], c[5], c[6], c[7], mats.get('top'), (0, 0, 1))          # top
        self.quad(c[1], c[2], c[6], c[5], mats.get('px'), (1, 0, 0))           # +x
        self.quad(c[3], c[7], c[6], c[2], mats.get('py'), (0, 1, 0))           # +y
        self.quad(c[0], c[4], c[7], c[3], mats.get('nx'), (-1, 0, 0))          # -x
        self.quad(c[0], c[1], c[5], c[4], mats.get('ny'), (0, -1, 0))          # -y

    def prism(self, cx, cy, z0, rad, dz, n, mat, top_mat=None):
        """A vertical n-gon prism (cylinder-ish: curved council chamber, tanks)."""
        top_mat = top_mat or mat
        ring = [(cx + rad * math.cos(2 * math.pi * i / n), cy + rad * math.sin(2 * math.pi * i / n)) for i in range(n)]
        topv = []
        for i in range(n):
            a = ring[i]; b = ring[(i + 1) % n]
            nrm = _norm((a[0] + b[0] - 2 * cx, a[1] + b[1] - 2 * cy, 0))
            self.quad((a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z0 + dz), (a[0], a[1], z0 + dz), mat, nrm)
            topv.append((a[0], a[1], z0 + dz))
        # top cap as a fan of quads (approx)
        for i in range(0, n - 2, 2):
            self.quad(topv[0], topv[i + 1], topv[i + 2], topv[min(i + 2, n - 1)], top_mat, (0, 0, 1))


def _shade(color, normal, key_dir, key, ambient):
    d = max(0.0, normal[0] * key_dir[0] + normal[1] * key_dir[1] + normal[2] * key_dir[2])
    f = ambient + key * d
    return (min(255, color[0] * f), min(255, color[1] * f), min(255, color[2] * f))


def _mat_color(material, u, v):
    if material is None:
        return None
    if material.get('t') == 'win':
        cols, rows = material['cols'], material['rows']
        u0, u1 = material.get('u0', 0.06), material.get('u1', 0.94)
        v0, v1 = material.get('v0', 0.05), material.get('v1', 0.95)
        if not (u0 <= u <= u1 and v0 <= v <= v1):
            return material['wall']
        cu = (u - u0) / (u1 - u0) * cols
        cv = (v - v0) / (v1 - v0) * rows
        fu, fv = cu - math.floor(cu), cv - math.floor(cv)
        border = fu < 0.13 or fu > 0.87 or fv < 0.1 or fv > 0.9
        return material['frame'] if border else material['glass']
    return material['c']


def bake(scene, out_w, out_h, origin, scale, key_dir=(0.8, -0.35, 0.75),
         key=0.62, ambient=0.5, ss=4, shadow=True):
    """Render the scene to an (out_h,out_w,4) uint8 sprite. origin=(ox,oy) in
    FINAL pixels for world (0,0,0); scale = final pixels per world unit."""
    W, H = out_w * ss, out_h * ss
    s = scale * ss
    ox, oy = origin[0] * ss, origin[1] * ss
    img = np.zeros((H, W, 4), dtype=np.float64)
    zbuf = np.full((H, W), -1e9)
    kd = _norm(key_dir)

    # ground shadow first (a soft dark ellipse under the projected footprint)
    if shadow:
        xs, ys = [], []
        for verts, _uv, _n, _m in scene.faces:
            for p in verts:
                if p[2] <= 0.01:
                    px, py, _d = _project((p[0], p[1], 0), s, ox, oy)
                    xs.append(px); ys.append(py)
        if xs:
            cxp, cyp = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
            rw, rh = (max(xs) - min(xs)) / 2 + 6 * ss, (max(ys) - min(ys)) / 2 + 4 * ss
            yy, xx = np.mgrid[0:H, 0:W]
            d2 = ((xx - cxp) / (rw + 1e-6)) ** 2 + ((yy - cyp) / (rh + 1e-6)) ** 2
            m = d2 <= 1.0
            al = (0.32 * (1 - d2)).clip(0, 0.32)
            img[m, :3] = (18, 16, 14)
            img[m, 3] = al[m] * 255

    # faces: sort back-to-front as a cheap prepass, then z-buffer for correctness
    order = sorted(range(len(scene.faces)),
                   key=lambda i: sum(sum(c) for c in scene.faces[i][0]) / 4.0)
    for i in order:
        verts, uvs, normal, material = scene.faces[i]
        if material is None:
            continue
        P = [_project(p, s, ox, oy) for p in verts]
        base_sh = None  # per-pixel color from material; shade once by normal
        # split quad into 2 tris: (0,1,2) and (0,2,3)
        for tri in ((0, 1, 2), (0, 2, 3)):
            p0, p1, p2 = P[tri[0]], P[tri[1]], P[tri[2]]
            uv0, uv1, uv2 = uvs[tri[0]], uvs[tri[1]], uvs[tri[2]]
            minx = max(0, int(math.floor(min(p0[0], p1[0], p2[0]))))
            maxx = min(W - 1, int(math.ceil(max(p0[0], p1[0], p2[0]))))
            miny = max(0, int(math.floor(min(p0[1], p1[1], p2[1]))))
            maxy = min(H - 1, int(math.ceil(max(p0[1], p1[1], p2[1]))))
            if minx > maxx or miny > maxy:
                continue
            yy, xx = np.mgrid[miny:maxy + 1, minx:maxx + 1]
            denom = ((p1[1] - p2[1]) * (p0[0] - p2[0]) + (p2[0] - p1[0]) * (p0[1] - p2[1]))
            if abs(denom) < 1e-9:
                continue
            a = ((p1[1] - p2[1]) * (xx - p2[0]) + (p2[0] - p1[0]) * (yy - p2[1])) / denom
            b = ((p2[1] - p0[1]) * (xx - p2[0]) + (p0[0] - p2[0]) * (yy - p2[1])) / denom
            c = 1 - a - b
            inside = (a >= -1e-4) & (b >= -1e-4) & (c >= -1e-4)
            if not inside.any():
                continue
            depth = a * p0[2] + b * p1[2] + c * p2[2]
            reg = zbuf[miny:maxy + 1, minx:maxx + 1]
            win = inside & (depth > reg)
            if not win.any():
                continue
            u = a * uv0[0] + b * uv1[0] + c * uv2[0]
            vv = a * uv0[1] + b * uv1[1] + c * uv2[1]
            # build the color field
            if material.get('t') == 'win':
                col = np.empty((win.shape[0], win.shape[1], 3))
                # vectorized window pattern
                cols, rows = material['cols'], material['rows']
                u0, u1 = material.get('u0', 0.06), material.get('u1', 0.94)
                v0, v1 = material.get('v0', 0.05), material.get('v1', 0.95)
                inwin = (u >= u0) & (u <= u1) & (vv >= v0) & (vv <= v1)
                cu = (u - u0) / (u1 - u0) * cols
                cv = (vv - v0) / (v1 - v0) * rows
                fu = cu - np.floor(cu); fv = cv - np.floor(cv)
                col[:] = material['wall']
                if material.get('punch'):
                    # small punched windows in a wall (masonry / industrial)
                    gl = inwin & (fu > 0.3) & (fu < 0.7) & (fv > 0.28) & (fv < 0.72)
                    fr = inwin & ~gl & (fu > 0.24) & (fu < 0.76) & (fv > 0.22) & (fv < 0.78)
                    border = ~gl
                else:
                    # full curtain-wall grid (glass panes + mullions)
                    border = (fu < 0.13) | (fu > 0.87) | (fv < 0.1) | (fv > 0.9)
                    gl = inwin & ~border
                    fr = inwin & border
                for ch in range(3):
                    col[gl, ch] = material['glass'][ch]
                    col[fr, ch] = material['frame'][ch]
                # DEAD WORLD: some panes are broken (very dark) or boarded (masonry)
                if 'dead' in material:
                    ci = np.floor(cu).astype(np.int64)
                    cj = np.floor(cv).astype(np.int64)
                    ds = int(material.get('deadseed', 1))
                    hsh = ((ci * 73856093) ^ (cj * 19349663) ^ (ds * 83492791)) & 0xffff
                    hf = hsh / 65535.0
                    dead = gl & (hf < material['dead'])
                    broke = dead & (hf < material['dead'] * 0.5)
                    board = dead & ~broke
                    bc = material.get('breakc', (10, 12, 14))
                    bd = material.get('boardc', material['wall'])
                    for ch in range(3):
                        col[broke, ch] = bc[ch]
                        col[board, ch] = bd[ch]
            elif material.get('t') == 'lot':
                # a PARKING LOT top: asphalt with thin white stall stripes (one axis)
                col = np.empty((win.shape[0], win.shape[1], 3))
                colsN = material.get('cols', 9)
                cu = (u * colsN)
                fu = cu - np.floor(cu)
                cv2 = vv * material.get('rows', 2)
                fv2 = cv2 - np.floor(cv2)
                col[:] = material['asphalt']
                stall = (fu < 0.06) | (fu > 0.94)
                # leave a drive aisle (no stall line) down the middle band of v
                aisle = (vv > 0.42) & (vv < 0.58)
                stripe = stall & ~aisle
                for ch in range(3):
                    col[stripe, ch] = material['stripe'][ch]
            else:
                col = np.empty((win.shape[0], win.shape[1], 3))
                col[:] = material['c']
            shf = ambient + key * max(0.0, normal[0] * kd[0] + normal[1] * kd[1] + normal[2] * kd[2])
            col = np.clip(col * shf, 0, 255)
            reg_img = img[miny:maxy + 1, minx:maxx + 1]
            reg_img[win, :3] = col[win]
            reg_img[win, 3] = 255
            reg[win] = depth[win]

    # downscale (box filter) SS -> final, alpha-weighted
    out = np.zeros((out_h, out_w, 4), dtype=np.uint8)
    a4 = img.reshape(out_h, ss, out_w, ss, 4)
    alpha = a4[..., 3]
    asum = alpha.sum(axis=(1, 3))
    for ch in range(3):
        num = (a4[..., ch] * alpha).sum(axis=(1, 3))
        out[..., ch] = np.where(asum > 0, num / np.maximum(asum, 1e-6), 0).astype(np.uint8)
    out[..., 3] = (asum / (ss * ss)).clip(0, 255).astype(np.uint8)
    return out
