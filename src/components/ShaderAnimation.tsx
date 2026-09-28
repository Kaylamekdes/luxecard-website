import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { runWhileActive } from '../utils/runWhileActive';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4( position, 0.0, 1.0 );
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.0007;

    // A single intensity field (the original used three independently
    // phase-shifted RGB channels, whose near-singular peaks saturate to
    // white/rainbow regardless of any color multiplier applied after the
    // fact). Driving all three channels from one field and tinting by a
    // fixed gold vector keeps every pixel on the same hue, brightening
    // toward warm white-gold at hot cores instead of drifting to other hues.
    float intensity = 0.0;
    for (int i = 0; i < 5; i++) {
      intensity += lineWidth * float(i * i) /
        abs(fract(t + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
    }

    // Soft tonemap so hot cores glow instead of blowing out to flat plates,
    // then a strong dim: this sits behind hero text, so it must read as
    // ambient background motion, not a dominant foreground graphic.
    intensity = intensity / (1.0 + intensity);
    vec3 gold = vec3(1.0, 0.78, 0.22);
    vec3 color = clamp(intensity * gold * 0.28, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Could not create shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

/**
 * Decorative animated hero background: a GPU shader painting slow,
 * concentric gold filaments. Non-interactive; skipped entirely under
 * prefers-reduced-motion. Render as the first child of a `relative`
 * section, with sibling content given `relative z-[1]` so it paints above.
 *
 * Plain WebGL rather than three.js: the effect is a single full-screen quad
 * with a custom fragment shader and no real 3D (the vertex shader passes
 * clip-space coordinates straight through), so three's scene graph, camera
 * and renderer added ~190KB for features this never used.
 */
export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // A single quad covering clip space, as a triangle strip (equivalent to
    // three's PlaneGeometry(2, 2), which was always drawn at z = 0).
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'time');
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    let time = 1.0;

    container.appendChild(canvas);

    const draw = () => {
      gl.uniform1f(timeLoc, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // Capped at devicePixelRatio 1 (matching the old renderer.setPixelRatio(1)):
    // this shader runs a per-pixel loop every frame, and the extra pixels from
    // a high devicePixelRatio aren't visible in a soft background glow, only costly.
    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
      draw();
    };
    onResize();
    window.addEventListener('resize', onResize);

    // Draw one frame immediately so the canvas is never blank, then only keep
    // drawing while the effect is actually on screen and the tab is visible;
    // scrolled past the hero or in a background tab, it costs nothing.
    draw();
    const stopLoop = runWhileActive(container, () => {
      time += 0.05;
      draw();
    });

    return () => {
      window.removeEventListener('resize', onResize);
      stopLoop();
      container.removeChild(canvas);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [reduced]);

  if (reduced) return null;

  return <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />;
}
