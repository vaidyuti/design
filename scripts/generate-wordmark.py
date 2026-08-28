#!/usr/bin/env python3
"""Generate the Vaidyuti wordmark SVGs from real Comfortaa outlines.

Reads the variable Comfortaa woff2 shipped by @fontsource-variable/comfortaa,
instances it at wght=600 (SemiBold, matching the logo), converts the glyphs of
"Vaidyuti" to SVG paths, and emits light/dark/mark assets into public/.

Run:  python3 scripts/generate-wordmark.py
"""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "node_modules/@fontsource-variable/comfortaa/files/comfortaa-latin-wght-normal.woff2")
OUT = os.path.join(ROOT, "public")

WORD = "Vaidyuti"
WEIGHT = 600
TRACKING = 0.02      # em, matches the logo's open letterspacing
LIME = "#EEFF41"
INK = "#141704"
DARK_TEXT = "#6C7813"   # primary-700, for lime-on-white legibility

font = TTFont(SRC)
font = instantiateVariableFont(font, {"wght": WEIGHT}, inplace=True)
upm = font["head"].unitsPerEm
glyphset = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]

# Lay out the word, flipping Y (font space is Y-up, SVG is Y-down).
paths, x = [], 0.0
track = TRACKING * upm
for ch in WORD:
    gname = cmap[ord(ch)]
    pen = SVGPathPen(glyphset)
    glyphset[gname].draw(TransformPen(pen, Transform(1, 0, 0, -1, x, 0)))
    d = pen.getCommands()
    if d:
        paths.append(d)
    x += hmtx[gname][0] + track
x -= track

asc, desc = font["hhea"].ascent, font["hhea"].descent
pad = 0.06 * upm
vb = f"{-pad:.0f} {-asc - pad:.0f} {x + 2 * pad:.0f} {asc - desc + 2 * pad:.0f}"
W, H = x + 2 * pad, asc - desc + 2 * pad
path_d = " ".join(paths)


def wordmark(fill, w=260):
    h = round(w * H / W)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="{vb}" role="img" aria-label="Vaidyuti">\n'
        f'  <title>Vaidyuti</title>\n'
        f'  <path fill="{fill}" d="{path_d}"/>\n</svg>\n'
    )


def write(name, content):
    p = os.path.join(OUT, name)
    with open(p, "w") as f:
        f.write(content)
    print(f"  {name}  ({len(content):,} bytes)")


print("Generating wordmarks from Comfortaa wght=%d ..." % WEIGHT)
# Dark backgrounds -> lime wordmark, exactly the logo.
write("vaidyuti-logo-dark.svg", wordmark(LIME))
# Light backgrounds -> olive (lime is illegible on white as text).
write("vaidyuti-logo-light.svg", wordmark(DARK_TEXT))
# Theme-adaptive: inherits currentColor from the consuming component.
write("vaidyuti-logo.svg", wordmark("currentColor"))

# Square app mark: the "V", lime on black, rounded to match --radius.
vpen = SVGPathPen(glyphset)
vg = cmap[ord("V")]
glyphset[vg].draw(TransformPen(vpen, Transform(1, 0, 0, -1, 0, 0)))
vw = hmtx[vg][0]
cap = font["OS/2"].sCapHeight if hasattr(font["OS/2"], "sCapHeight") else int(0.7 * upm)
S = 512
scale = (S * 0.46) / cap
tx = (S - vw * scale) / 2
ty = (S + cap * scale) / 2
mark = (
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" '
    f'viewBox="0 0 {S} {S}" role="img" aria-label="Vaidyuti">\n'
    f'  <title>Vaidyuti</title>\n'
    f'  <rect width="{S}" height="{S}" rx="112" fill="{INK}"/>\n'
    f'  <g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})">'
    f'<path fill="{LIME}" d="{vpen.getCommands()}"/></g>\n</svg>\n'
)
write("vaidyuti-logo-mark.svg", mark)
print("Done.")
