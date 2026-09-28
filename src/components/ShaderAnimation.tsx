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
 * three.js is dynamically imported so its ~500KB doesn't sit in the main
 * bundle for a purely decorative effect.
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

    import('three').then((THREE) => {
      if (cancelled) return;

      const camera = new THREE.Camera();
      camera.position.z = 1;

      const scene = new THREE.Scene();
      const geometry = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // No MSAA: the scene is a single full-screen quad shaded per pixel, so
      // there are no geometry edges to smooth, only a multisample buffer to pay for.
      const renderer = new THREE.WebGLRenderer({ antialias: false });
      // Capped at 1: this shader runs a per-pixel loop every frame, and the
      // extra pixels from a high devicePixelRatio aren't visible in a soft
      // background glow, only costly.
      renderer.setPixelRatio(1);
      container.appendChild(renderer.domElement);

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
      const stopLoop = runWhileActive(container, () => {
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
      });

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        stopLoop();
        container.removeChild(renderer.domElement);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduced]);

  if (reduced) return null;

  return <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" />;
}
