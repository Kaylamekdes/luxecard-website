import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { runWhileActive } from '../utils/runWhileActive';

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4( position, 1.0 );
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

/**
 * Decorative animated hero background: a GPU shader painting slow,
 * concentric gold filaments. Non-interactive; skipped entirely under
 * prefers-reduced-motion. Render as the first child of a `relative`
 * section, with sibling content given `relative z-[1]` so it paints above.
 *
 * three.js is dynamically imported (only the specific classes this needs,
 * so tree-shaking drops the rest of the library from that chunk) and not
 * even requested until the browser reports idle — or after a 1.5s ceiling,
 * whichever comes first — so it never competes with the hero's own
 * critical requests (fonts, the hero video, etc.) for bandwidth right
 * after load. The Hero section's own background is already this shader's
 * dark base color, so there's nothing to look unfinished while it's
 * loading; once ready, the canvas fades in over 600ms rather than
 * popping in.
 */
export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanup = () => {};

    const load = () => {
      import('three').then(({ Camera, Scene, PlaneGeometry, ShaderMaterial, Mesh, WebGLRenderer, Vector2 }) => {
        if (cancelled) return;

        const camera = new Camera();
        camera.position.z = 1;

        const scene = new Scene();
        const geometry = new PlaneGeometry(2, 2);

        const uniforms = {
          time: { value: 1.0 },
          resolution: { value: new Vector2() },
        };

        const material = new ShaderMaterial({
          uniforms,
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
        });

        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        // No MSAA: the scene is a single full-screen quad shaded per pixel, so
        // there are no geometry edges to smooth, only a multisample buffer to pay for.
        const renderer = new WebGLRenderer({ antialias: false });
        // Capped at 1: this shader runs a per-pixel loop every frame, and the
        // extra pixels from a high devicePixelRatio aren't visible in a soft
        // background glow, only costly.
        renderer.setPixelRatio(1);

        const canvas = renderer.domElement;
        // Starts invisible and fades in once the first frame is actually
        // drawn, instead of popping in the instant three.js finishes
        // loading — the section's own background is the same dark color
        // underneath, so there's nothing to look unfinished in the meantime.
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 600ms ease-out';
        container.appendChild(canvas);

        const onResize = () => {
          const width = container.clientWidth;
          const height = container.clientHeight;
          renderer.setSize(width, height);
          uniforms.resolution.value.x = renderer.domElement.width;
          uniforms.resolution.value.y = renderer.domElement.height;
        };
        onResize();
        window.addEventListener('resize', onResize);

        // Draw one frame immediately so the canvas is never blank, then only keep
        // drawing while the effect is actually on screen and the tab is visible;
        // scrolled past the hero or in a background tab, it costs nothing.
        renderer.render(scene, camera);
        // Two rAFs so the opacity:0 above is actually painted first — otherwise
        // this could land in the same commit as the append and the browser
        // would have nothing to transition from, skipping straight to opaque.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) canvas.style.opacity = '1';
          });
        });
        const stopLoop = runWhileActive(container, () => {
          uniforms.time.value += 0.05;
          renderer.render(scene, camera);
        });

        cleanup = () => {
          window.removeEventListener('resize', onResize);
          stopLoop();
          container.removeChild(canvas);
          renderer.dispose();
          geometry.dispose();
          material.dispose();
        };
      }).catch(() => {
        // WebGL unavailable (WebGLRenderer's constructor throws, rejecting
        // this chain) or the chunk failed to load: the hero's own dark
        // gradient is already the fallback look, so there's nothing further
        // to do here — just don't leave this as an unhandled rejection.
      });
    };

    // Idle, capped at 1.5s: on a slow/busy page this still guarantees the
    // shader shows up reasonably soon, while on a normal load it waits
    // until the hero's own critical requests are out of the way first.
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(load, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(load, 1500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      cleanup();
    };
  }, [reduced]);

  if (reduced) return null;

  return <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />;
}
