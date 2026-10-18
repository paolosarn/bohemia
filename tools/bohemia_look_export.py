#!/usr/bin/env python3
"""THE LOOK RULER'S EXPORT (10/18/26, PLUMBER lane, VAMILY row [the look leg]; rule 108 ROUND EIGHT (c)).

DINOv2 ViT-S/14 (Apache-2.0: LICENSE and MODEL_CARD.md of facebookresearch/dinov2, read 10/18) to ONNX, for
the twin gate's LOOK ruler. It runs on GitHub's free runner (.github/workflows/look.yml), because the
weights' hosts answer 403 from the container; the ONNX is cached there and NEVER committed (gates/twin_gate.py
L0 is red on a tracked weights file).

  1. the model is built by the repo's own hub code at a pinned commit (dinov2/hub/backbones.py dinov2_vits14,
     pretrained=True: the LVD-142M weights from dl.fbaipublicfiles.com), so nothing here re-implements it;
  2. the positional embedding is interpolated ONCE to the 224 px grid (16 x 16 patches) by the model's own
     interpolate_pos_encoding and baked in, so the exported graph is a plain ViT at one size with no bicubic
     resize inside it;
  3. exported with the TorchScript exporter (opset 17), input 'pixel_values' 1x3x224x224, output 'cls' 1x384
     (x_norm_clstoken, what the hub model returns);
  4. verified: onnxruntime against the UNBAKED torch model on noise, a flat grey and six pack pieces put
     through the twin gate's own preprocessing (tools/bohemia_twin_gate.py look_input); every cosine at or over
     0.9999 or the export is refused;
  5. a sidecar beside it (dinov2_vits14.json): the commit, the weights' URL, bytes and sha256, the ONNX's
     sha256, torch's version, the opset, the verification numbers. The gate reads it (L1).

  python3 tools/bohemia_look_export.py --repo /path/to/dinov2 --out tools/models/dinov2_vits14.onnx
"""
import argparse, hashlib, inspect, json, os, sys, time

os.environ.setdefault('XFORMERS_DISABLED', '1')     # the plain attention path; xformers is not on the runner
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
WEIGHTS_URL = 'https://dl.fbaipublicfiles.com/dinov2/dinov2_vits14/dinov2_vits14_pretrain.pth'
VERIFY_LINE = 0.9999


def sha256(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True, help='a checkout of facebookresearch/dinov2')
    ap.add_argument('--out', default=os.path.join(ROOT, 'tools', 'models', 'dinov2_vits14.onnx'))
    ap.add_argument('--weights-sha256', default=os.environ.get('DINOV2_VITS14_SHA256', ''),
                    help='refuse weights whose sha256 differs (empty: record it, do not hold it)')
    a = ap.parse_args(argv)

    import numpy as np
    import torch
    import onnxruntime as ort
    import bohemia_twin_gate as TG
    sys.path.insert(0, os.path.abspath(a.repo))
    from dinov2.hub.backbones import dinov2_vits14

    commit = os.popen('git -C %s rev-parse HEAD' % a.repo).read().strip()
    t0 = time.time()
    model = dinov2_vits14(pretrained=True).eval()
    ckpt = os.path.join(torch.hub.get_dir(), 'checkpoints', os.path.basename(WEIGHTS_URL))
    w_sha = sha256(ckpt)
    print('weights %s: %d bytes, sha256 %s (%.1f s)' % (os.path.basename(ckpt), os.path.getsize(ckpt), w_sha, time.time() - t0))
    if a.weights_sha256 and a.weights_sha256 != w_sha:
        print('REFUSED: the weights are not the pinned ones (%s)' % a.weights_sha256)
        return 1

    # the inputs the verification reads: noise, flat grey, and pack pieces through the gate's own preprocessing
    rng = np.random.default_rng(14)
    xs = [rng.normal(size=(1, 3, 224, 224)).astype(np.float32), np.zeros((1, 3, 224, 224), np.float32)]
    for fam in ('ground', 'road', 'prop'):
        fs = TG.pack_pieces(fam)
        for f in fs[:2]:
            xs.append(TG.look_input(TG.rgba(f)))
    with torch.no_grad():
        ref = [model(torch.from_numpy(x)).numpy() for x in xs]          # the hub model, interpolating each call
        tok = torch.zeros(1, 1 + 16 * 16, model.embed_dim)
        pe = model.interpolate_pos_encoding(tok, 224, 224).detach().clone()
    model.pos_embed = torch.nn.Parameter(pe, requires_grad=False)       # baked: npatch == N, the early return
    with torch.no_grad():
        baked = [model(torch.from_numpy(x)).numpy() for x in xs]
    d_bake = max(float(np.abs(r - b).max()) for r, b in zip(ref, baked))
    print('baked the 224 grid into pos_embed %s; max |torch - baked| %.2e' % (tuple(pe.shape), d_bake))

    class Cls(torch.nn.Module):
        """one input, one output: the hub model's forward takes *args and **kwargs, and the tracer named a
        second graph input 'masks' after forward_features' keyword (run 39152518660)."""
        def __init__(self, m):
            super().__init__()
            self.m = m

        def forward(self, pixel_values):
            return self.m.head(self.m.forward_features(pixel_values)['x_norm_clstoken'])

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    kw = dict(input_names=['pixel_values'], output_names=['cls'], opset_version=17, do_constant_folding=True)
    if 'dynamo' in inspect.signature(torch.onnx.export).parameters:
        kw['dynamo'] = False
    torch.onnx.export(Cls(model).eval(), (torch.from_numpy(xs[0]),), a.out, **kw)
    sess = ort.InferenceSession(a.out, providers=['CPUExecutionProvider'])
    ins = [i.name for i in sess.get_inputs()]
    print('the graph takes %s and gives %s' % (ins, [o.name for o in sess.get_outputs()]))
    if ins != ['pixel_values']:
        print('REFUSED: the graph must take one input, pixel_values')
        os.remove(a.out)
        return 1
    coss, diffs = [], []
    for x, r in zip(xs, ref):
        o = sess.run(None, {'pixel_values': x})[0].reshape(-1)
        r = r.reshape(-1)
        coss.append(float(o @ r / (np.linalg.norm(o) * np.linalg.norm(r) + 1e-12)))
        diffs.append(float(np.abs(o - r).max()))
    t1 = time.time()
    for _ in range(20):
        sess.run(None, {'pixel_values': xs[2]})
    ms = (time.time() - t1) / 20 * 1000
    side = {'_readme': 'the LOOK ruler\'s export (tools/bohemia_look_export.py); never committed, cached on the runner',
            'model': 'DINOv2 ViT-S/14, LVD-142M, CLS after the final norm (x_norm_clstoken), 384-d',
            'licence': 'Apache-2.0 (facebookresearch/dinov2 LICENSE and MODEL_CARD.md, read 10/18)',
            'source': 'facebookresearch/dinov2@%s dinov2/hub/backbones.py dinov2_vits14(pretrained=True)' % commit,
            'weights_url': WEIGHTS_URL, 'weights_bytes': os.path.getsize(ckpt), 'weights_sha256': w_sha,
            'onnx_bytes': os.path.getsize(a.out), 'onnx_sha256': sha256(a.out),
            'torch': torch.__version__, 'onnxruntime': ort.__version__, 'opset': 17,
            'input': 'pixel_values float32 1x3x224x224, ImageNet mean and std (tools/bohemia_twin_gate.py look_input)',
            'pos_embed': 'interpolated once to 16x16 by the model\'s own interpolate_pos_encoding, baked',
            'verify': {'inputs': len(xs), 'cos_min': round(min(coss), 7), 'max_abs': round(max(diffs), 6),
                       'bake_max_abs': round(d_bake, 7), 'line': VERIFY_LINE},
            'ms_per_image_cpu': round(ms, 1), 'made': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
    json.dump(side, open(os.path.splitext(a.out)[0] + '.json', 'w'), indent=1)
    print('exported %s: %d bytes, sha256 %s' % (a.out, side['onnx_bytes'], side['onnx_sha256']))
    print('verified on %d inputs: cos min %.7f, max |onnx - torch| %.2e, %.1f ms an image' % (len(xs), min(coss), max(diffs), ms))
    print('LOOK_EXPORT ' + json.dumps({k: side[k] for k in ('source', 'weights_sha256', 'onnx_sha256', 'torch', 'verify', 'ms_per_image_cpu')}))
    if min(coss) < VERIFY_LINE:
        print('REFUSED: the ONNX disagrees with torch (cos %.6f under %.4f)' % (min(coss), VERIFY_LINE))
        os.remove(a.out)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
