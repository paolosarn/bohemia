#!/usr/bin/env python3
"""BOHEMIA -- COOK: a signed distance as a mesh (surface nets), numpy only, so a shape written as a distance (CHARACTER's armour
classes, tools/bohemia_character_the_armour_shows.py) can go through DIRECTION's master rig in Blender as the same shape.

  V, F = mesh(sdf, lo, hi, h)      # sdf(points (n, 3)) -> distances (n,); lo, hi the box to search; h the cell size

One vertex a cell the surface crosses (the mean of its edges' crossings), one quad an edge the surface cuts; every face turned so
its normal points out (the distance grows along it). A coarse pass finds where the shape is, the fine pass meshes only there.
"""
import numpy as np


def _grid(lo, hi, h):
    xs = [np.arange(lo[i], hi[i] + h * 0.5, h) for i in range(3)]
    return xs, np.stack(np.meshgrid(*xs, indexing='ij'), -1)


def _eval(sdf, P, chunk=400000):
    flat = P.reshape(-1, 3); out = np.empty(len(flat))
    for i in range(0, len(flat), chunk):
        out[i:i + chunk] = sdf(flat[i:i + chunk])
    return out.reshape(P.shape[:-1])


def bounds(sdf, lo, hi, h=2.0, pad=None):
    """where the shape is, from a coarse look (h a cell): its box, padded, or None"""
    xs, P = _grid(lo, hi, h)
    F = _eval(sdf, P)
    ins = F < h
    if not ins.any(): return None
    idx = np.argwhere(ins); a, b = idx.min(0), idx.max(0)
    pad = 2 * h if pad is None else pad
    return [xs[i][a[i]] - pad for i in range(3)], [xs[i][b[i]] + pad for i in range(3)]


def mesh(sdf, lo, hi, h):
    bb = bounds(sdf, lo, hi, max(h * 3, 1.0))
    if bb is None: return np.zeros((0, 3)), np.zeros((0, 3), int)
    lo, hi = bb
    xs, P = _grid(lo, hi, h)
    F = _eval(sdf, P)
    nx, ny, nz = F.shape
    ins = F < 0
    # the cells' eight corners
    C = [(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, 0), (0, 0, 1), (1, 0, 1), (0, 1, 1), (1, 1, 1)]
    E = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 2), (1, 3), (4, 6), (5, 7), (0, 4), (1, 5), (2, 6), (3, 7)]
    sl = lambda o: (slice(o[0], nx - 1 + o[0]), slice(o[1], ny - 1 + o[1]), slice(o[2], nz - 1 + o[2]))
    Fc = [F[sl(o)] for o in C]; Pc = [P[sl(o)] for o in C]
    acc = np.zeros(Fc[0].shape + (3,)); cnt = np.zeros(Fc[0].shape)
    for a, b in E:
        s = (Fc[a] < 0) != (Fc[b] < 0)
        if not s.any(): continue
        d = Fc[a] - Fc[b]; t = np.where(s, Fc[a] / np.where(np.abs(d) < 1e-12, 1e-12, d), 0.0)
        acc += np.where(s[..., None], Pc[a] + t[..., None] * (Pc[b] - Pc[a]), 0.0); cnt += s
    act = cnt > 0
    vid = -np.ones(act.shape, int); vid[act] = np.arange(act.sum())
    V = acc[act] / cnt[act][:, None]
    faces = []
    # an edge along x from (i, j, k) to (i + 1, j, k): the four cells round it are (i, j-1..j, k-1..k)
    for ax in range(3):
        o = [0, 0, 0]; o[ax] = 1
        a = ins[:nx - o[0], :ny - o[1], :nz - o[2]]; b = ins[o[0]:, o[1]:, o[2]:]
        cut = a != b
        u, w = [k for k in range(3) if k != ax]
        idx = np.argwhere(cut)
        idx = idx[(idx[:, u] >= 1) & (idx[:, w] >= 1) & (idx[:, u] <= vid.shape[u] - 1) & (idx[:, w] <= vid.shape[w] - 1) & (idx[:, ax] <= vid.shape[ax] - 1)]
        if not len(idx): continue
        def cell(du, dw):
            q = idx.copy(); q[:, u] += du; q[:, w] += dw
            return vid[q[:, 0], q[:, 1], q[:, 2]]
        q = np.stack([cell(-1, -1), cell(0, -1), cell(0, 0), cell(-1, 0)], 1)
        ok = (q >= 0).all(1); q = q[ok]
        flip = a[idx[ok, 0], idx[ok, 1], idx[ok, 2]]
        q[flip] = q[flip][:, ::-1]
        faces.append(q)
    if not faces: return V, np.zeros((0, 3), int)
    Q = np.concatenate(faces)
    T = np.concatenate([Q[:, [0, 1, 2]], Q[:, [0, 2, 3]]])
    # every face out: the distance grows along its normal
    n = np.cross(V[T[:, 1]] - V[T[:, 0]], V[T[:, 2]] - V[T[:, 0]]); ln = np.linalg.norm(n, axis=1)
    good = ln > 1e-12; T, n, ln = T[good], n[good], ln[good]; n = n / ln[:, None]
    c = V[T].mean(1)
    grow = sdf(c + n * h * 0.5) - sdf(c - n * h * 0.5)
    T[grow < 0] = T[grow < 0][:, ::-1]
    return V, T
