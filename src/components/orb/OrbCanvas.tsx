'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { orbFragment, orbVertex } from './shaders';

gsap.registerPlugin(ScrollTrigger);

/*
  One fixed WebGL scene behind the whole page:
  - a noise-deformed sphere (custom shaders) with a glowing rim,
  - a slowly counter-rotating wireframe shell and a starfield,
  - UnrealBloom post-processing for the glow.
  The orb's position/size/brightness are a small "state" that ScrollTriggers ease between per section,
  so it glides around the page as you scroll.
*/

const STATES: { id: string; x: number; y: number; s: number; glow: number }[] = [
  { id: '#features', x: 0.62, y: 0.25, s: 0.5, glow: 0.75 },
  { id: '#tour', x: 0.78, y: 0.55, s: 0.32, glow: 0.55 },
  { id: '#pricing', x: -0.7, y: -0.35, s: 0.55, glow: 0.7 },
  { id: '#cta', x: 0, y: 0.08, s: 0.95, glow: 0.8 },
];

export default function OrbCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    performance.mark('orb:start');
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    } catch {
      return; // no WebGL: the CSS gradient background remains
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    // The composer clears its (linear) buffer with the raw clear value, and OutputPass then sRGB-encodes it.
    // Passing the colour pre-converted to linear means it comes out as exactly #0a0b1e (measured), not lavender.
    renderer.setClearColor(new THREE.Color('#0a0b1e').convertSRGBToLinear(), 1);
    // The canvas starts invisible; the CSS poster orb shows until the first real frame is ready.
    Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', opacity: '0' });
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6;

    const uniforms = {
      uTime: { value: 0 }, uAmp: { value: 0.22 }, uFreq: { value: 1.25 }, uGlow: { value: 1 },
      uColA: { value: new THREE.Color('#6c5ce7') }, uColB: { value: new THREE.Color('#00d4ff') }, uColC: { value: new THREE.Color('#c9b8ff') },
    };
    // Detail 48 (~138k vertices) looks identical under the noise displacement and builds ~4Ã— faster than 96 (~553k).
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 48), new THREE.ShaderMaterial({ uniforms, vertexShader: orbVertex, fragmentShader: orbFragment }));
    const shell = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.75, 2)),
      new THREE.LineBasicMaterial({ color: 0x6c5ce7, transparent: true, opacity: 0.18 }),
    );
    const group = new THREE.Group();
    group.add(orb, shell);
    scene.add(group);
    performance.mark('orb:geometry');

    // Starfield
    const starCount = window.innerWidth < 768 ? 900 : 2200;
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(6 + Math.random() * 18);
      pos.set([v.x, v.y, v.z - 6], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xbfc8ff, size: 0.035, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(stars);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.3, 0.3);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    let halfW = 1, halfH = 1;
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.resolution.set(w / 2, h / 2);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      halfW = halfH * camera.aspect;
    };
    resize();
    window.addEventListener('resize', resize);

    // Scroll-driven state (x/y as a fraction of the visible half-width/height).
    const mobile = window.innerWidth < 768;
    const state = { x: 0, y: mobile ? -0.05 : 0, s: mobile ? 0.58 : 0.9, glow: mobile ? 0.7 : 0.85 };
    const triggers: ScrollTrigger[] = [];
    if (!reduce) {
      let prev = { ...state };
      for (const st of STATES) {
        const target = document.querySelector(st.id);
        if (!target) continue;
        const from = { ...prev };
        const to = { x: st.x, y: st.y, s: st.s * (window.innerWidth < 768 ? 0.75 : 1), glow: st.glow };
        const tween = gsap.fromTo(state, from, { ...to, ease: 'power2.inOut', immediateRender: false, scrollTrigger: { trigger: target, start: 'top 85%', end: 'top 15%', scrub: 1.2 } });
        triggers.push(tween.scrollTrigger!);
        prev = to;
      }
    }

    // Pointer: the orb leans towards the cursor and gets more agitated near it.
    const pointer = new THREE.Vector2(0, 0), smooth = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    window.addEventListener('pointermove', onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let firstFrame = false;
    const frame = () => {
      const t = reduce ? 3 : clock.getElapsedTime();
      smooth.lerp(pointer, 0.05);
      const ox = state.x * halfW, oy = state.y * halfH;
      group.position.set(ox, oy, 0);
      group.scale.setScalar(state.s);
      const d = Math.hypot(smooth.x * halfW - ox, smooth.y * halfH - oy);
      uniforms.uTime.value = t;
      uniforms.uAmp.value += ((0.18 + Math.max(0, 1.6 - d) * 0.12) - uniforms.uAmp.value) * 0.05;
      uniforms.uGlow.value = state.glow;
      orb.rotation.y = t * 0.15 + smooth.x * 0.4;
      orb.rotation.x = -smooth.y * 0.3;
      shell.rotation.y = -t * 0.08;
      shell.rotation.z = t * 0.04;
      stars.rotation.y = t * 0.01 + smooth.x * 0.03;
      stars.rotation.x = smooth.y * 0.02;
      composer.render();
      if (!firstFrame) {
        firstFrame = true;
        performance.mark('orb:first-frame');
        // Cross-fade: real orb in, CSS poster out.
        gsap.to(renderer.domElement, { opacity: 1, duration: reduce ? 0 : 0.9, ease: 'power2.out' });
        if (poster.current) gsap.to(poster.current, { opacity: 0, scale: 0.96, duration: reduce ? 0 : 0.9, ease: 'power2.out' });
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    // Start straight away. (Measured: compileAsync's polling made the first frame ~390 ms later, so it's not used.)
    let disposed = false;
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      composer.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-space">
      {/* Poster orb: pure CSS, in the static HTML, so something orb-shaped is on screen at first paint.
          Sized to match the WebGL orb's starting size (â‰ˆ47vh desktop, â‰ˆ31vh mobile). Also the fallback without WebGL. */}
      <div ref={poster} className="orb-poster absolute left-1/2 top-1/2" />
    </div>
  );
}
