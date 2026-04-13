"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import SunCalc from "suncalc";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const LAT  = 25.2854;
const LON  = 51.5310;
const SKY_RADIUS    = 400;
const SUN_DISTANCE  = 380;
const MOON_DISTANCE = 360;
const STAR_COUNT    = 2000;

// ─────────────────────────────────────────────────────────────
// PURE HELPERS  (no React, no Three imports needed at module level)
// ─────────────────────────────────────────────────────────────

/**
 * Convert SunCalc azimuth + altitude to a normalised THREE.Vector3.
 *
 * SunCalc azimuth: from South, clockwise  (S=0, W=π/2, N=±π, E=-π/2)
 * Our Three.js axes: +X=East, +Y=Up, +Z=South
 *
 *   x =  cos(alt) * sin(az)
 *   y =  sin(alt)
 *   z =  cos(alt) * cos(az)
 */
function toCartesian(azimuth: number, altitude: number): THREE.Vector3 {
  // Clamp altitude away from ±90° to keep cos(alt) well away from 0
  const alt = Math.max(-Math.PI / 2 + 1e-5, Math.min(Math.PI / 2 - 1e-5, altitude));
  const cosAlt = Math.cos(alt);
  return new THREE.Vector3(
    cosAlt * Math.sin(azimuth),
    Math.sin(alt),
    cosAlt * Math.cos(azimuth)
  ).normalize();
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** 0 when alt ≤ 0, ramps to 1 over fadeRad radians above horizon */
function horizonBlend(altRad: number, fadeRad = 0.12): number {
  return clamp01(altRad / fadeRad);
}

function fmt(date: Date): string {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function deg(rad: number): string {
  return (rad * 180 / Math.PI).toFixed(1) + "°";
}

function phaseName(f: number): string {
  if (f < 0.03 || f > 0.97) return "New Moon";
  if (f < 0.22) return "Waxing Crescent";
  if (f < 0.28) return "First Quarter";
  if (f < 0.47) return "Waxing Gibbous";
  if (f < 0.53) return "Full Moon";
  if (f < 0.72) return "Waning Gibbous";
  if (f < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

// Sky palette
const C = {
  night:    new THREE.Color(0x04061a),
  dawn:     new THREE.Color(0x1a0a2e),
  sunrise:  new THREE.Color(0xff6a00),
  day:      new THREE.Color(0x2196f3),
  dayHoriz: new THREE.Color(0x87ceeb),
  sunset:   new THREE.Color(0xff4500),
  ground:   new THREE.Color(0x060a06),
};

function skyColorAt(normAlt: number, sunAltRad: number): THREE.Color {
  const t = clamp01((sunAltRad + 0.1) / 0.35);

  // horizon band
  const horizNight = C.night.clone().lerp(C.dawn, clamp01((sunAltRad + 0.3) / 0.3));
  let   horizColor = horizNight.lerp(C.dayHoriz.clone(), t);

  if (sunAltRad > -0.18 && sunAltRad < 0.22) {
    const twiT     = 1 - Math.abs(sunAltRad) / 0.22;
    const twiColor = sunAltRad >= 0 ? C.sunrise : C.sunset;
    horizColor.lerp(twiColor, twiT * 0.6 * (1 - normAlt));
  }

  const zenith = C.night.clone().lerp(C.day, t);
  return horizColor.lerp(zenith, normAlt * normAlt);
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function SkyScene() {
  const mountRef     = useRef<HTMLDivElement>(null);
  // UI refs — updated imperatively from the animation loop (no re-renders)
  const hudTimeRef   = useRef<HTMLDivElement>(null);
  const hudSunRef    = useRef<HTMLDivElement>(null);
  const hudMoonRef   = useRef<HTMLDivElement>(null);
  const hudPhaseRef  = useRef<HTMLDivElement>(null);
  const sunriseRef   = useRef<HTMLSpanElement>(null);
  const dhuhrRef     = useRef<HTMLSpanElement>(null);
  const maghribRef   = useRef<HTMLSpanElement>(null);
  const sliderRef    = useRef<HTMLInputElement>(null);
  const timeLblRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 2000);
    camera.position.set(0, 5, 0);

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Sky dome ──────────────────────────────────────────────
    const skyGeo    = new THREE.SphereGeometry(SKY_RADIUS, 64, 32);
    const skyColors = new Float32Array(skyGeo.attributes.position.count * 3);
    skyGeo.setAttribute("color", new THREE.BufferAttribute(skyColors, 3));
    const skyMat  = new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    function updateSkyColors(sunAltRad: number) {
      const pos = skyGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vy      = pos.getY(i) / SKY_RADIUS;
        const normAlt = clamp01((vy + 0.05) / 1.05);
        const c       = skyColorAt(normAlt, sunAltRad);
        skyColors[i * 3]     = c.r;
        skyColors[i * 3 + 1] = c.g;
        skyColors[i * 3 + 2] = c.b;
      }
      (skyGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // ── Ground plane ──────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(SKY_RADIUS * 0.95, 64),
      new THREE.MeshLambertMaterial({ color: 0x8b7d6b })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);

    // ── Sun ───────────────────────────────────────────────────
    const sunMat  = new THREE.MeshBasicMaterial({ color: 0xfffbe6 });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), sunMat);
    // Halo (inner additive glow via transparent oversized sphere)
    const haloMat  = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.15, depthWrite: false });
    sunMesh.add(new THREE.Mesh(new THREE.SphereGeometry(18, 16, 8), haloMat));
    scene.add(sunMesh);

    // ── Moon ─────────────────────────────────────────────────
    const moonMat  = new THREE.MeshStandardMaterial({
      color: 0xd0cec8,
      roughness: 0.9,
      emissive: new THREE.Color(0xd0cec8),
      emissiveIntensity: 0,
    });
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 16), moonMat);
    scene.add(moonMesh);

    // ── Stars ─────────────────────────────────────────────────
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(1 - Math.random());
      const r     = SKY_RADIUS * 0.95;
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat   = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, sizeAttenuation: true });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── Lights ────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x112233, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbe6, 0);
    scene.add(sunLight);

    const moonLight = new THREE.DirectionalLight(0x8899bb, 0);
    scene.add(moonLight);

    // ── Camera look-around ────────────────────────────────────
    let yaw = 0, pitch = 0.1;
    let isDragging = false, lastX = 0, lastY = 0;

    const applyCamera = () => {
      camera.lookAt(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        Math.cos(yaw) * Math.cos(pitch)
      );
    };
    applyCamera();

    const onMouseDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onMouseUp   = ()               => { isDragging = false; };
    const onMouseMove = (e: MouseEvent)  => {
      if (!isDragging) return;
      yaw   -= (e.clientX - lastX) * 0.003;
      pitch  = Math.max(-0.3, Math.min(1.4, pitch + (e.clientY - lastY) * 0.003));
      lastX  = e.clientX; lastY = e.clientY;
      applyCamera();
    };
    const onTouchStart = (e: TouchEvent) => { lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      yaw   -= (e.touches[0].clientX - lastX) * 0.004;
      pitch  = Math.max(-0.3, Math.min(1.4, pitch + (e.touches[0].clientY - lastY) * 0.004));
      lastX  = e.touches[0].clientX; lastY = e.touches[0].clientY;
      applyCamera();
      e.preventDefault();
    };

    renderer.domElement.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("touchstart", onTouchStart);
    renderer.domElement.addEventListener("touchmove",  onTouchMove, { passive: false });

    // ── Slider / live state ───────────────────────────────────
    let isLive = true;
    let sliderMinutes = 0;

    const syncSliderToNow = () => {
      const now = new Date();
      sliderMinutes = now.getHours() * 60 + now.getMinutes();
      if (sliderRef.current) sliderRef.current.value = String(sliderMinutes);
    };
    syncSliderToNow();

    const onSliderInput = () => {
      if (!sliderRef.current) return;
      isLive        = false;
      sliderMinutes = parseInt(sliderRef.current.value, 10);
    };

    let liveBtn: HTMLButtonElement | null = null;
    const liveBtnEl = document.getElementById("skyLiveBtn") as HTMLButtonElement | null;
    liveBtn = liveBtnEl;
    if (liveBtn) {
      liveBtn.addEventListener("click", () => {
        isLive = true;
        if (liveBtn) liveBtn.classList.add("sky-active");
        syncSliderToNow();
      });
    }
    if (sliderRef.current) {
      sliderRef.current.addEventListener("input", onSliderInput);
    }

    // Auto-sync slider when live
    const liveInterval = setInterval(() => {
      if (isLive) syncSliderToNow();
    }, 5000);

    // ── Prayer times (computed once per day) ──────────────────
    let lastDay = -1;
    const updatePrayerTimes = (date: Date) => {
      const times = SunCalc.getTimes(date, LAT, LON);
      if (sunriseRef.current)  sunriseRef.current.textContent  = fmt(times.sunrise);
      if (dhuhrRef.current)    dhuhrRef.current.textContent    = fmt(times.solarNoon);
      if (maghribRef.current)  maghribRef.current.textContent  = fmt(times.sunset);
    };

    // ── Animation loop ────────────────────────────────────────
    let rafId: number;
    const tmp = new THREE.Color(); // reusable to avoid per-frame allocation

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // 1. Simulation date
      let simDate: Date;
      if (isLive) {
        simDate = new Date();
        const s = simDate.getHours() * 60 + simDate.getMinutes();
        if (sliderRef.current) sliderRef.current.value = String(s);
      } else {
        const now = new Date();
        simDate   = new Date(
          now.getFullYear(), now.getMonth(), now.getDate(),
          Math.floor(sliderMinutes / 60), sliderMinutes % 60, 0, 0
        );
      }

      if (timeLblRef.current) {
        timeLblRef.current.textContent = fmt(simDate);
      }

      // Recompute prayer times once per calendar day
      if (simDate.getDate() !== lastDay) {
        lastDay = simDate.getDate();
        updatePrayerTimes(simDate);
      }

      // 2. Sun position
      const sunPos     = SunCalc.getPosition(simDate, LAT, LON);
      const sunAlt     = sunPos.altitude;  // radians, negative below horizon
      const sunVec     = toCartesian(sunPos.azimuth, sunAlt);
      const sunAbove   = sunAlt > -0.02;
      sunMesh.visible  = sunAbove;
      sunMesh.position.copy(sunVec).multiplyScalar(SUN_DISTANCE);

      // Sun colour: orange at horizon → pale yellow at zenith
      const sunNoonT = clamp01(sunAlt / (Math.PI / 4));
      tmp.setHex(0xfffbe6).lerp(new THREE.Color(0xff8800), 1 - sunNoonT);
      sunMat.color.copy(tmp);

      // 3. Moon position
      const moonPos     = SunCalc.getMoonPosition(simDate, LAT, LON);
      const moonAlt     = moonPos.altitude;
      const moonVec     = toCartesian(moonPos.azimuth, moonAlt);
      const moonAbove   = moonAlt > -0.02;
      moonMesh.visible  = moonAbove;
      moonMesh.position.copy(moonVec).multiplyScalar(MOON_DISTANCE);

      const moonIllum = SunCalc.getMoonIllumination(simDate);
      moonMat.emissiveIntensity = 0.05 + moonIllum.fraction * 0.6;

      // 4. Directional lights
      const sunBlend  = horizonBlend(sunAlt);
      const moonBlend = horizonBlend(moonAlt);

      sunLight.position.copy(sunMesh.position);
      sunLight.intensity = sunBlend * 2.2;
      tmp.setHex(0xfffbe6).lerp(new THREE.Color(0xff9944), 1 - sunNoonT);
      sunLight.color.copy(tmp);

      moonLight.position.copy(moonMesh.position);
      moonLight.intensity = moonBlend * (1 - sunBlend) * moonIllum.fraction * 0.12;

      ambientLight.intensity = 0.08 + sunBlend * 0.45;
      ambientLight.color.setHex(sunBlend > 0.5 ? 0xc8d8ff : 0x112233);

      // 5. Stars fade out during day
      starMat.opacity     = clamp01(1 - sunBlend * 2.5);
      starMat.transparent = true;

      // 6. Sky gradient
      updateSkyColors(sunAlt);

      // 7. HUD
      if (hudTimeRef.current)
        hudTimeRef.current.textContent  = `🕐 ${fmt(simDate)}`;
      if (hudSunRef.current)
        hudSunRef.current.textContent   =
          `☀️  alt ${deg(sunAlt)}  az ${deg(sunPos.azimuth)}  ${sunAbove ? "above horizon" : "below horizon"}`;
      if (hudMoonRef.current)
        hudMoonRef.current.textContent  =
          `🌙  alt ${deg(moonAlt)}  az ${deg(moonPos.azimuth)}  ${moonAbove ? "above" : "below"}`;
      if (hudPhaseRef.current)
        hudPhaseRef.current.textContent =
          `Phase: ${phaseName(moonIllum.phase)} · ${(moonIllum.fraction * 100).toFixed(0)}% lit`;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(liveInterval);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mousedown",  onMouseDown);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove",  onTouchMove);
      if (sliderRef.current)
        sliderRef.current.removeEventListener("input", onSliderInput);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* Three.js canvas mounts here */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* ── HUD ── */}
      <div style={{
        position: "absolute", top: 16, left: 16,
        color: "#fff", fontSize: 12, lineHeight: 1.8,
        textShadow: "0 1px 4px rgba(0,0,0,.9)",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
          Doha · Qatar · 25.28°N 51.53°E
        </div>
        <div ref={hudTimeRef}  />
        <div ref={hudSunRef}   />
        <div ref={hudMoonRef}  />
        <div ref={hudPhaseRef} />
        <div style={{ marginTop: 8, fontSize: 10, opacity: 0.55 }}>
          <div>Sunrise  <span ref={sunriseRef} style={{ fontWeight: 600, color: "#fbbf24" }}>–</span></div>
          <div>Dhuhr    <span ref={dhuhrRef}   style={{ fontWeight: 600, color: "#fbbf24" }}>–</span></div>
          <div>Maghrib  <span ref={maghribRef} style={{ fontWeight: 600, color: "#fbbf24" }}>–</span></div>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, opacity: 0.4 }}>Drag to look around</div>
      </div>

      {/* ── Time scrubber ── */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999, padding: "10px 20px",
        color: "#fff", fontSize: 12, whiteSpace: "nowrap",
      }}>
        <span>🕐</span>
        <input
          ref={sliderRef}
          type="range"
          min="0" max="1439" step="1"
          defaultValue="0"
          style={{ width: 220, accentColor: "#f59e0b", cursor: "pointer" }}
        />
        <span ref={timeLblRef} style={{ minWidth: 42, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
          --:--
        </span>
        <button
          id="skyLiveBtn"
          className="sky-active"
          style={{
            background: "rgba(245,158,11,0.25)",
            border: "1px solid rgba(245,158,11,0.45)",
            color: "#f59e0b",
            borderRadius: 999,
            padding: "3px 12px",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          LIVE
        </button>
      </div>
    </div>
  );
}
