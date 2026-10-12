"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { LAND_MASK_BASE64, LAND_POINT_COUNT } from "./land-mask";

const DEG = Math.PI / 180;
const HOME = { lat: 23.588, lng: 58.383 }; // Muscat
const DESTINATIONS = [
  { lat: 3.139, lng: 101.687 }, // Kuala Lumpur — ITEX 2026
  { lat: 25.205, lng: 55.271 }, // Dubai — WHX
  { lat: 37.567, lng: 126.978 }, // Seoul — World Hospital Congress
];
const VIEW_CENTER = { lat: 18, lng: 84 };

type Palette = {
  ocean: THREE.Color;
  rim: THREE.Color;
  dot: THREE.Color;
  dotBright: THREE.Color;
  atmosphere: THREE.Color;
  arc: THREE.Color;
  marker: THREE.Color;
  ring: THREE.Color;
  oceanAlpha: number;
  dotOpacity: number;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    ocean: new THREE.Color("#03163a"),
    rim: new THREE.Color("#1d7ce0"),
    dot: new THREE.Color("#22aef0"),
    dotBright: new THREE.Color("#b8ecff"),
    atmosphere: new THREE.Color("#1f8fff"),
    arc: new THREE.Color("#6fdcff"),
    marker: new THREE.Color("#00aeef"),
    ring: new THREE.Color("#3aa8ff"),
    oceanAlpha: 0.92,
    dotOpacity: 1,
  },
  light: {
    ocean: new THREE.Color("#eef6fd"),
    rim: new THREE.Color("#7cc8f2"),
    dot: new THREE.Color("#0a4f80"),
    dotBright: new THREE.Color("#00aeef"),
    atmosphere: new THREE.Color("#00aeef"),
    arc: new THREE.Color("#0090d8"),
    marker: new THREE.Color("#0077c8"),
    ring: new THREE.Color("#00aeef"),
    oceanAlpha: 0.95,
    dotOpacity: 0.9,
  },
};

function latLngToVec(lat: number, lng: number, r = 1) {
  const phi = lat * DEG;
  const lam = lng * DEG;
  return new THREE.Vector3(Math.cos(phi) * Math.cos(lam) * r, Math.sin(phi) * r, -Math.cos(phi) * Math.sin(lam) * r);
}

/** Rebuilds the Fibonacci-sphere points that fall on land (see scripts/generate-land-mask.mjs). */
function landPositions() {
  const bin = atob(LAND_MASK_BASE64);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: number[] = [];
  for (let i = 0; i < LAND_POINT_COUNT; i++) {
    if (!(bin.charCodeAt(i >> 3) & (1 << (i & 7)))) continue;
    const y = 1 - (i / (LAND_POINT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    out.push(Math.cos(t) * r, y, Math.sin(t) * r);
  }
  return new Float32Array(out);
}

const isDarkNow = () => document.documentElement.classList.contains("dark");

export default function Globe({ className, label }: { className?: string; label: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the static glow behind the canvas stays visible
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    let raf = 0;
    let visible = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    tilt.add(spin);
    scene.add(tilt);

    const baseTilt = VIEW_CENTER.lat * DEG;
    const baseSpin = -(VIEW_CENTER.lng + 90) * DEG;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    let palette = PALETTES[isDarkNow() ? "dark" : "light"];

    // Ocean sphere with fresnel rim.
    const oceanMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uBase: { value: palette.ocean.clone() },
          uRim: { value: palette.rim.clone() },
          uAlpha: { value: palette.oceanAlpha },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uBase; uniform vec3 uRim; uniform float uAlpha;
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
            gl_FragColor = vec4(mix(uBase, uRim, f), uAlpha);
          }`,
      }),
    );
    const ocean = new THREE.Mesh(track(new THREE.SphereGeometry(0.995, 72, 72)), oceanMat);
    ocean.renderOrder = 0;
    spin.add(ocean);

    // Atmosphere halo.
    const atmoMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: palette.atmosphere.clone() } },
        vertexShader: /* glsl */ `
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying vec3 vNormal; varying vec3 vView;
          void main(){
            float i = pow(max(0.0, 0.72 + dot(vNormal, vView)), 3.0);
            gl_FragColor = vec4(uColor, clamp(i, 0.0, 1.0) * 0.55);
          }`,
      }),
    );
    const atmosphere = new THREE.Mesh(track(new THREE.SphereGeometry(1.16, 64, 64)), atmoMat);
    atmosphere.renderOrder = -1;
    tilt.add(atmosphere);

    // Land dots.
    const positions = landPositions();
    const rand = new Float32Array(positions.length / 3).map(() => Math.random());
    const dotsGeo = track(new THREE.BufferGeometry());
    dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotsGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    const dotsMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 15 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uColor: { value: palette.dot.clone() },
          uBright: { value: palette.dotBright.clone() },
          uOpacity: { value: palette.dotOpacity },
          uHome: { value: latLngToVec(HOME.lat, HOME.lng) },
        },
        vertexShader: /* glsl */ `
          uniform float uSize; uniform float uPixelRatio; uniform vec3 uHome;
          attribute float aRand;
          varying float vFacing; varying float vRand; varying float vHome;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * position);
            vFacing = dot(n, normalize(-mv.xyz));
            vRand = aRand;
            vHome = 1.0 - smoothstep(0.0, 0.32, distance(position, uHome));
            gl_PointSize = uSize * uPixelRatio * (1.0 + vHome * 0.6) / -mv.z;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform vec3 uBright; uniform float uTime; uniform float uOpacity;
          varying float vFacing; varying float vRand; varying float vHome;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.15, d);
            float facing = smoothstep(-0.05, 0.45, vFacing);
            float twinkle = 0.7 + 0.3 * sin(uTime * 1.6 + vRand * 60.0);
            vec3 col = mix(uColor, uBright, max(step(0.93, vRand) * 0.8, vHome));
            gl_FragColor = vec4(col, a * facing * twinkle * uOpacity);
          }`,
      }),
    );
    const dots = new THREE.Points(dotsGeo, dotsMat);
    dots.renderOrder = 1;
    spin.add(dots);

    // Arcs from Muscat to each destination, with a travelling light pulse.
    const home = latLngToVec(HOME.lat, HOME.lng);
    const arcMats: THREE.ShaderMaterial[] = [];
    DESTINATIONS.forEach((dest, i) => {
      const end = latLngToVec(dest.lat, dest.lng);
      const dist = home.distanceTo(end);
      const lift = 1 + Math.max(0.12, dist * 0.42);
      const c1 = home.clone().lerp(end, 0.25).normalize().multiplyScalar(lift);
      const c2 = home.clone().lerp(end, 0.75).normalize().multiplyScalar(lift);
      const curve = new THREE.CubicBezierCurve3(home.clone().multiplyScalar(1.004), c1, c2, end.clone().multiplyScalar(1.004));
      const mat = track(
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uOffset: { value: i * 0.33 },
            uDraw: { value: reduceMotion ? 1 : 0 },
            uColor: { value: palette.arc.clone() },
          },
          vertexShader: /* glsl */ `
            varying float vT;
            void main(){ vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
          fragmentShader: /* glsl */ `
            uniform float uTime; uniform float uOffset; uniform float uDraw; uniform vec3 uColor;
            varying float vT;
            void main(){
              if (vT > uDraw) discard;
              float head = fract(uTime * 0.28 + uOffset);
              float trail = smoothstep(head - 0.28, head, vT) * step(vT, head);
              gl_FragColor = vec4(uColor, 0.22 + trail * 0.95);
            }`,
        }),
      );
      arcMats.push(mat);
      const arc = new THREE.Mesh(track(new THREE.TubeGeometry(curve, 96, 0.0042, 8, false)), mat);
      arc.renderOrder = 2;
      spin.add(arc);
    });

    // Markers: dot + pulsing ring, oriented to the surface.
    const markerMat = track(new THREE.MeshBasicMaterial({ color: palette.marker.clone() }));
    const ringMat = track(
      new THREE.MeshBasicMaterial({ color: palette.ring.clone(), transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    );
    const ringGeo = track(new THREE.RingGeometry(0.03, 0.036, 48));
    const rings: { mesh: THREE.Mesh; phase: number; scale: number }[] = [];
    [HOME, ...DESTINATIONS].forEach((p, i) => {
      const isHome = i === 0;
      const pos = latLngToVec(p.lat, p.lng, 1.006);
      const dot = new THREE.Mesh(track(new THREE.SphereGeometry(isHome ? 0.02 : 0.013, 16, 16)), markerMat);
      dot.position.copy(pos);
      spin.add(dot);
      for (let k = 0; k < (isHome ? 2 : 1); k++) {
        const ring = new THREE.Mesh(ringGeo, ringMat.clone());
        track(ring.material as THREE.Material);
        ring.position.copy(pos);
        ring.lookAt(pos.clone().multiplyScalar(2));
        ring.renderOrder = 3;
        spin.add(ring);
        rings.push({ mesh: ring, phase: k * 0.5 + i * 0.27, scale: isHome ? 1.6 : 1 });
      }
    });

    // Orbit ring with a small satellite (a nod to NeoMove's satellite link).
    const orbit = new THREE.Group();
    orbit.rotation.set(1.15, 0.3, -0.35);
    const orbitMat = track(new THREE.MeshBasicMaterial({ color: palette.ring.clone(), transparent: true, opacity: 0.28 }));
    orbit.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.42, 0.0022, 6, 180)), orbitMat));
    const satellite = new THREE.Mesh(track(new THREE.SphereGeometry(0.022, 16, 16)), markerMat);
    orbit.add(satellite);
    tilt.add(orbit);

    function applyPalette(next: Palette) {
      palette = next;
      oceanMat.uniforms.uBase.value.copy(next.ocean);
      oceanMat.uniforms.uRim.value.copy(next.rim);
      oceanMat.uniforms.uAlpha.value = next.oceanAlpha;
      atmoMat.uniforms.uColor.value.copy(next.atmosphere);
      dotsMat.uniforms.uColor.value.copy(next.dot);
      dotsMat.uniforms.uBright.value.copy(next.dotBright);
      dotsMat.uniforms.uOpacity.value = next.dotOpacity;
      arcMats.forEach((m) => m.uniforms.uColor.value.copy(next.arc));
      arcMats.forEach((m) => (m.blending = isDarkNow() ? THREE.AdditiveBlending : THREE.NormalBlending));
      markerMat.color.copy(next.marker);
      orbitMat.color.copy(next.ring);
      rings.forEach((r) => (r.mesh.material as THREE.MeshBasicMaterial).color.copy(next.ring));
      requestRender();
    }
    applyPalette(palette);
    const themeObserver = new MutationObserver(() => applyPalette(PALETTES[isDarkNow() ? "dark" : "light"]));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Pointer parallax + drag to spin.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { active: false, startX: 0, offset: 0, velocity: 0, lastX: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (drag.active) {
        const dx = e.clientX - drag.lastX;
        drag.lastX = e.clientX;
        drag.offset += dx * 0.006;
        drag.velocity = dx * 0.006;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // keep vertical page scroll on phones
      drag.active = true;
      drag.lastX = e.clientX;
      renderer.domElement.setPointerCapture(e.pointerId);
      host.style.cursor = "grabbing";
    };
    const onUp = () => {
      drag.active = false;
      host.style.cursor = "";
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    host.addEventListener("pointerleave", onLeave);

    // Sizing.
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Render loop — runs only while visible.
    const t0 = performance.now();
    let drawStart = -1;
    let shown = false;
    function requestRender() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function frame() {
      raf = 0;
      const t = (performance.now() - t0) / 1000;
      if (drawStart < 0) drawStart = t;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      if (!drag.active) {
        drag.offset += drag.velocity;
        drag.velocity *= 0.92;
        drag.offset *= 0.985; // ease back towards Oman
      }
      const sway = reduceMotion ? 0 : Math.sin(t * 0.12) * 0.42;
      spin.rotation.y = baseSpin + sway + drag.offset + pointer.x * 0.22;
      tilt.rotation.x = baseTilt + pointer.y * 0.12;

      dotsMat.uniforms.uTime.value = t;
      const draw = reduceMotion ? 1 : Math.min(1, Math.max(0, (t - drawStart - 0.4) / 1.6));
      arcMats.forEach((m, i) => {
        m.uniforms.uTime.value = t;
        m.uniforms.uDraw.value = Math.min(1, Math.max(0, draw * 1.4 - i * 0.2));
      });
      rings.forEach((r) => {
        const p = reduceMotion ? 0.5 : (t * 0.55 + r.phase) % 1;
        const s = (0.6 + p * 2.2) * r.scale;
        r.mesh.scale.setScalar(s);
        (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.85;
      });
      const a = t * 0.25;
      satellite.position.set(Math.cos(a) * 1.42, Math.sin(a) * 1.42, 0);

      renderer.render(scene, camera);
      if (!shown) {
        shown = true;
        setReady(true);
      }
      if (!reduceMotion && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(host);
    const onVis = () => {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointerleave", onLeave);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={label}
      className={cn(
        "relative cursor-grab transition-[opacity,transform] duration-[1400ms] ease-out-expo",
        ready ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className,
      )}
    />
  );
}
