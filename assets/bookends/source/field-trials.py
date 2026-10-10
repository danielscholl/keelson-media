#!/usr/bin/env python3
"""Builds the Field Trials opener and closer. Run from videos/assets/bookends:

    node ../../tools/cards.mjs source/field-cards.json && python3 source/field-trials.py [--still open|close]

Opener: the Sora drawing is keyed off its own sheet (ink = anything far from a smoothed sheet estimate),
scaled to 90% and laid on the series sheet under the title, so it dissolves into any plate seamlessly.
It freezes on the finished drawing at 2.53 s (the take animates the pumpjack after that and the
counterweight melts) and holds for the narration plus a few seconds before the first board.
"""
import argparse, subprocess
import numpy as np
from PIL import Image

I = "../intros"
OPEN_SRC, CLOSE_SRC = f"{I}/sora-field-survey-draw-4s.mp4", f"{I}/sora-field-survey-dawn-8s.mp4"
W, H, FPS = 1920, 1080, 30
SW, SH = 1280, 720
FREEZE, OPEN_LEN = 2.53, 6.6
SCALE, OX, OY = 1.35, 104, 196
CLOSE_END, CLOSE_LEN, CARD_AT = 8.0, 8.8, 3.6
ENC = ["-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]


def frames(path, w, h, t_end, vf=None):
    cmd = ["ffmpeg", "-loglevel", "error", "-i", path, "-t", f"{t_end}"] + (["-vf", vf] if vf else [])
    p = subprocess.Popen(cmd + ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    n = w * h * 3
    while len(buf := p.stdout.read(n)) == n:
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3).astype(np.float32)
    p.wait()


def rgba(path):
    im = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32)
    return im[..., :3], im[..., 3:] / 255


def key(F, bs=40):
    lum, sat = F.mean(2), F.max(2) - F.min(2)
    paper = (lum > 215) & (sat < 40)
    gh, gw = SH // bs, SW // bs
    n = paper.reshape(gh, bs, gw, bs).sum((1, 3))
    s = (F * paper[..., None]).reshape(gh, bs, gw, bs, 3).sum((1, 3))
    est = np.where((n > 200)[..., None], s / np.maximum(n, 1)[..., None], np.median(F[paper], axis=0))
    S = np.stack([np.asarray(Image.fromarray(est[..., c].astype(np.float32), "F").resize((SW, SH), Image.BILINEAR))
                  for c in range(3)], 2)
    a = np.clip((np.abs(F - S).max(2) - 22) / 45, 0, 1)
    a[:4], a[-4:], a[:, :4], a[:, -4:] = 0, 0, 0, 0
    pre = np.clip(F - (1 - a)[..., None] * S, 0, None) * (a > 0)[..., None]
    return np.minimum(pre, 255 * a[..., None]), a


def place(pre, a, bg):
    w, h = round(SW * SCALE), round(SH * SCALE)
    sz = lambda ch: np.asarray(Image.fromarray(ch.astype(np.float32), "F").resize((w, h), Image.LANCZOS))
    P = np.stack([sz(pre[..., c]) for c in range(3)], 2)
    A = np.clip(sz(a), 0, 1)[..., None]
    out = bg.copy()
    y1, x1 = min(H, OY + h), min(W, OX + w)
    out[OY:y1, OX:x1] = np.clip(P[: y1 - OY, : x1 - OX], 0, 255) + out[OY:y1, OX:x1] * (1 - A[: y1 - OY, : x1 - OX])
    return out


def over(img, card, t, t0, d):
    k = np.clip((t - t0) / d, 0, 1)
    rgb, al = card
    return rgb * al * k + img * (1 - al * k)


def encode(path, src, audio_filter, length, gen):
    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-i", src, "-filter_complex", audio_filter,
                          "-map", "0:v", "-map", "[au]", "-t", f"{length}", *ENC, path], stdin=subprocess.PIPE)
    for fr in gen:
        p.stdin.write(np.clip(fr, 0, 255).astype(np.uint8).tobytes())
    p.stdin.close()
    p.wait()
    print(path)


def opener(still=False):
    bg = rgba("cards/field-sheet.png")[0]
    title = rgba("cards/field-open.png")
    drawn = [place(*key(F), bg) for F in frames(OPEN_SRC, SW, SH, FREEZE)]
    if still:
        Image.fromarray(np.clip(over(drawn[-1], title, 9, 0, 1), 0, 255).astype(np.uint8)).save("cards/_open-still.png")
        return
    n = round(OPEN_LEN * FPS)
    gen = (over(drawn[min(i, len(drawn) - 1)], title, i / FPS, 0.6, 0.6) for i in range(n))
    af = (f"[1:a]atrim=0:{FREEZE + 0.1},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
          f"volume=4dB,afade=in:d=0.12,afade=out:st={FREEZE - 0.25}:d=0.35,apad,atrim=duration={OPEN_LEN}[au]")
    encode("open-field-trials.mp4", OPEN_SRC, af, OPEN_LEN, gen)


def closer(still=False):
    card = rgba("cards/field-close.png")
    shot = list(frames(CLOSE_SRC, W, H, CLOSE_END, vf=f"scale={W}:{H}:flags=lanczos"))
    if still:
        Image.fromarray(np.clip(over(shot[-1], card, 9, 0, 1), 0, 255).astype(np.uint8)).save("cards/_close-still.png")
        return
    n = round(CLOSE_LEN * FPS)
    gen = (over(shot[min(i, len(shot) - 1)], card, i / FPS, CARD_AT, 1.0) for i in range(n))
    af = (f"[1:a]atrim=0:{CLOSE_END},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,highpass=f=40,"
          f"volume=-5dB,afade=in:d=0.6,afade=out:st={CLOSE_LEN - 2.2}:d=2.2,apad,atrim=duration={CLOSE_LEN}[au]")
    encode("close-field-trials.mp4", CLOSE_SRC, af, CLOSE_LEN, gen)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", choices=["open", "close"])
    a = ap.parse_args()
    if a.still == "open":
        opener(True)
    elif a.still == "close":
        closer(True)
    else:
        opener()
        closer()
