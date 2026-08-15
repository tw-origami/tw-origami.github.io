// One module owns what every target looks like — in 2D (gate signs, jumbotron,
// HUD chip all call drawGlyph) and in 3D (gate shapes extrude the same outlines).
// One implementation means the sign on the gate, the reminder chip, and the
// jumbotron can never disagree about what a "diamond" is.
//
// Panel colors are fixed PER KIND (all letter signs blue, all number signs
// green, all shape signs navy): inside a category the only difference between
// gates is the thing being taught, so color can never leak the answer.

import * as THREE from 'three';

const OUTLINE = '#1c1233';
const PANEL = { shape: '#33518f', letter: '#2f6fe0', number: '#3fae4c' };

/* ---------------- outlines, shared by canvas and three ---------------- */

// Polygon corners in y-up math space; the canvas tracer flips y.
function polygonPoints(id, r) {
  switch (id) {
    case 'triangle': return [[0, r], [r * 0.95, -r * 0.72], [-r * 0.95, -r * 0.72]];
    case 'square': { const s = r * 0.82; return [[-s, s], [s, s], [s, -s], [-s, -s]]; }
    case 'diamond': return [[0, r * 1.05], [r * 0.72, 0], [0, -r * 1.05], [-r * 0.72, 0]];
    case 'star': {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? r * 0.45 : r;
        pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
      }
      return pts;
    }
  }
  return null;
}

// Heart as two cubic béziers, y-up: dip on top, point at the bottom.
function heartSegs(r) {
  return [
    { from: [0, r * 0.32], c1: [r * 0.6, r * 0.95], c2: [r * 1.1, r * 0.05], to: [0, -r * 0.78] },
    { from: [0, -r * 0.78], c1: [-r * 1.1, r * 0.05], c2: [-r * 0.6, r * 0.95], to: [0, r * 0.32] },
  ];
}

function traceShape(ctx, id, cx, cy, r) {
  ctx.beginPath();
  if (id === 'circle') {
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
  } else if (id === 'heart') {
    const segs = heartSegs(r);
    ctx.moveTo(cx + segs[0].from[0], cy - segs[0].from[1]);
    for (const s of segs) {
      ctx.bezierCurveTo(cx + s.c1[0], cy - s.c1[1], cx + s.c2[0], cy - s.c2[1], cx + s.to[0], cy - s.to[1]);
    }
  } else {
    const pts = polygonPoints(id, r);
    ctx.moveTo(cx + pts[0][0], cy - pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i][0], cy - pts[i][1]);
  }
  ctx.closePath();
}

/** Extruded 3D version of the same outline, for the shape gates. */
export function makeShapeGeometry(id, r, depth = 0.5) {
  const shape = new THREE.Shape();
  if (id === 'circle') {
    shape.absarc(0, 0, r * 0.92, 0, Math.PI * 2, false);
  } else if (id === 'heart') {
    const segs = heartSegs(r);
    shape.moveTo(segs[0].from[0], segs[0].from[1]);
    for (const s of segs) shape.bezierCurveTo(s.c1[0], s.c1[1], s.c2[0], s.c2[1], s.to[0], s.to[1]);
  } else {
    const pts = polygonPoints(id, r);
    shape.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

/* ---------------- 2D drawing ---------------- */

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draw any target into the square (x, y, size) of a 2d context. */
export function drawGlyph(ctx, item, x, y, size) {
  const cx = x + size / 2, cy = y + size / 2;
  const lw = Math.max(2, size * 0.045);

  // panel
  const bg = item.kind === 'color' ? item.hex : PANEL[item.kind] ?? '#33518f';
  roundRect(ctx, x, y, size, size, size * 0.12);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();

  if (item.kind === 'color') {
    // the color IS the content; just add a white inner ring so it reads as a sign
    roundRect(ctx, x + size * 0.08, y + size * 0.08, size * 0.84, size * 0.84, size * 0.08);
    ctx.lineWidth = lw * 0.9;
    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.stroke();
    return;
  }

  if (item.kind === 'shape') {
    traceShape(ctx, item.id, cx, cy, size * 0.34);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = OUTLINE;
    ctx.stroke();
    return;
  }

  if (item.kind === 'letter') {
    ctx.font = `900 ${Math.round(size * 0.62)}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = lw * 1.6;
    ctx.strokeStyle = OUTLINE;
    ctx.strokeText(item.glyph, cx, cy + size * 0.04);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.glyph, cx, cy + size * 0.04);
    return;
  }

  if (item.kind === 'number') {
    // digit on top, counting dots underneath (ten-frame style: rows of five)
    ctx.font = `900 ${Math.round(size * 0.5)}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = lw * 1.6;
    ctx.strokeStyle = OUTLINE;
    ctx.strokeText(item.glyph, cx, y + size * 0.32);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.glyph, cx, y + size * 0.32);

    const n = item.value;
    const rows = n > 5 ? 2 : 1;
    const dotR = size * 0.052;
    const gap = size * 0.155;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 5), inRow = row === rows - 1 ? n - row * 5 : 5;
      const col = i % 5;
      const rowY = y + size * (rows === 1 ? 0.72 : 0.64 + row * 0.17);
      const rowX = cx + (col - (inRow - 1) / 2) * gap;
      ctx.beginPath();
      ctx.arc(rowX, rowY, dotR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = lw * 0.7;
      ctx.strokeStyle = OUTLINE;
      ctx.stroke();
    }
  }
}

/** A ready-to-use sign texture. One canvas per texture — three.js uploads
 *  lazily, so sharing a canvas would leave every sign showing the last drawing. */
export function makeGlyphTexture(item, px = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = px;
  drawGlyph(c.getContext('2d'), item, 0, 0, px);
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
