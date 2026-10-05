"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ODISHA_DISTRICTS, REGIONAL_HUBS, RegionalHub } from "./odishaMapData";
import { Sparkles, MapPin, Radio, Shield, Compass, Eye, Activity } from "lucide-react";

interface CinematicOdishaMoonProps {
  onHubSelect?: (hub: RegionalHub) => void;
  activeHubId?: string;
}

export default function CinematicOdishaMoon({
  onHubSelect,
  activeHubId = "bbsr",
}: CinematicOdishaMoonProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(
    REGIONAL_HUBS.find((h) => h.id === activeHubId) || REGIONAL_HUBS[0]
  );
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Store target rotations for smooth hub transitions
  const targetRotation = useRef({ x: 0.15, y: 0 });
  const currentRotation = useRef({ x: 0.15, y: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });

  // Constants for authentic spherical map projection
  const TEXTURE_WIDTH = 2048;
  const TEXTURE_HEIGHT = 1024;
  const MAP_SCALE = 0.88;
  // Center of front hemisphere in Three.js SphereGeometry is at u = 0.25, v_geo = 0.5
  const MAP_ORIGIN_X = TEXTURE_WIDTH * 0.25 - 400 * MAP_SCALE;
  const MAP_ORIGIN_Y = TEXTURE_HEIGHT * 0.5 - 340 * MAP_SCALE;

  // Helper to convert map viewBox (800x680) coordinates directly to 3D point on sphere surface
  const getSpherePoint = useCallback((px: number, py: number, radius: number): THREE.Vector3 => {
    const cx = MAP_ORIGIN_X + px * MAP_SCALE;
    const cy = MAP_ORIGIN_Y + py * MAP_SCALE;
    const u = cx / TEXTURE_WIDTH;
    const v_geo = cy / TEXTURE_HEIGHT;
    const x = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v_geo * Math.PI);
    const y = radius * Math.cos(v_geo * Math.PI);
    const z = radius * Math.sin(u * Math.PI * 2) * Math.sin(v_geo * Math.PI);
    return new THREE.Vector3(x, y, z);
  }, [MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_SCALE]);

  // Handle hub selection with smooth camera rotation toward the selected node
  const handleSelectHub = useCallback(
    (hub: RegionalHub) => {
      setSelectedHub(hub);
      if (onHubSelect) onHubSelect(hub);

      const cx = MAP_ORIGIN_X + hub.x * MAP_SCALE;
      const cy = MAP_ORIGIN_Y + hub.y * MAP_SCALE;
      const u = cx / TEXTURE_WIDTH;
      const v_geo = cy / TEXTURE_HEIGHT;

      // Angular deviation from front center (u = 0.25, v_geo = 0.5)
      const deltaTheta = (u - 0.25) * Math.PI * 2;
      const deltaPhi = (v_geo - 0.5) * Math.PI;

      // Smoothly frame the active node
      targetRotation.current.y = -deltaTheta * 0.85;
      targetRotation.current.x = deltaPhi * 0.65;
    },
    [MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_SCALE, onHubSelect]
  );

  // Generate high-resolution procedural moon texture with accurate Odisha vector geography
  const createOdishaLunarTexture = useCallback(() => {
    const width = TEXTURE_WIDTH;
    const height = TEXTURE_HEIGHT;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Deep Celestial Lunar Regolith Base with basalt mare gradients
    const bgGrad = ctx.createRadialGradient(
      width * 0.25,
      height * 0.5,
      width * 0.04,
      width * 0.25,
      height * 0.5,
      width * 0.55
    );
    bgGrad.addColorStop(0, "#141C2E"); // Luminous basalt center
    bgGrad.addColorStop(0.35, "#0D1322");
    bgGrad.addColorStop(0.7, "#080C16");
    bgGrad.addColorStop(1, "#03060C");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Micro-surface crater texture & lunar grain
    for (let i = 0; i < 750; i++) {
      const cx = (Math.sin(i * 19.3) * 0.5 + 0.5) * width;
      const cy = (Math.cos(i * 31.7) * 0.5 + 0.5) * height;
      const cr = (Math.sin(i * 7.1) * 0.5 + 0.5) * 14 + 1.2;
      
      // Crater shadowed rim
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.arc(cx + 1, cy + 1, cr, 0, Math.PI * 2);
      ctx.fill();

      // Crater illuminated crest
      ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Delicate Cartographic Latitude & Longitude Navigation Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let y = 80; y < height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 60; x < width; x += 160) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 4. Project Authentic Odisha State Geography directly on Front Hemisphere
    ctx.save();
    ctx.translate(MAP_ORIGIN_X, MAP_ORIGIN_Y);
    ctx.scale(MAP_SCALE, MAP_SCALE);

    // 4a. Bay of Bengal Maritime Coastal Shelf Gradient & Wave Contours
    const oceanGrad = ctx.createLinearGradient(540, 200, 780, 520);
    oceanGrad.addColorStop(0, "rgba(56, 189, 248, 0.05)");
    oceanGrad.addColorStop(0.4, "rgba(255, 107, 0, 0.08)");
    oceanGrad.addColorStop(1, "rgba(6, 182, 212, 0.12)");
    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.moveTo(560, 200);
    ctx.bezierCurveTo(680, 260, 750, 360, 780, 480);
    ctx.lineTo(820, 680);
    ctx.lineTo(490, 680);
    ctx.closePath();
    ctx.fill();

    // Maritime bathymetric contour shelf lines along Odisha coastline
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(580, 210);
    ctx.bezierCurveTo(700, 270, 770, 370, 800, 490);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4b. Draw All 30 Authentic Odisha Districts
    ODISHA_DISTRICTS.forEach((district) => {
      try {
        const p = new Path2D(district.path);

        // District surface fill
        if (district.isCapitalDistrict) {
          // Khordha / Bhubaneswar capital highlight
          ctx.fillStyle = "rgba(255, 107, 0, 0.38)";
        } else if (district.isCoastal) {
          ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
        } else {
          ctx.fillStyle = "rgba(255, 107, 0, 0.09)";
        }
        ctx.fill(p);

        // Crisp luminous boundary lines
        if (district.isCapitalDistrict) {
          ctx.strokeStyle = "rgba(255, 215, 100, 1.0)";
          ctx.lineWidth = 2.8;
        } else if (district.isCoastal) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
          ctx.lineWidth = 1.6;
        } else {
          ctx.strokeStyle = "rgba(255, 150, 65, 0.65)";
          ctx.lineWidth = 1.2;
        }
        ctx.stroke(p);
      } catch {
        // Fallback for non-Path2D environments
      }
    });

    // 4c. Chilika Lake - Distinctive Blue Lagoon Contour
    try {
      const chilikaPath = new Path2D(
        "M 508 410 Q 525 395 540 405 Q 555 418 548 435 Q 532 445 515 432 Z"
      );
      ctx.fillStyle = "rgba(6, 182, 212, 0.45)";
      ctx.fill(chilikaPath);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.stroke(chilikaPath);
    } catch {
      // Ignore fallback
    }

    // 4d. Regional Hub Markers on the Map Texture
    REGIONAL_HUBS.forEach((hub) => {
      const isBhubaneswar = hub.id === "bbsr";

      if (isBhubaneswar) {
        // Bhubaneswar Multi-ring Beacon on texture
        ctx.save();
        const radGrad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 42);
        radGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        radGrad.addColorStop(0.18, "rgba(255, 180, 50, 0.95)");
        radGrad.addColorStop(0.5, "rgba(255, 107, 0, 0.45)");
        radGrad.addColorStop(1, "rgba(255, 107, 0, 0)");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 42, 0, Math.PI * 2);
        ctx.fill();

        // High-contrast gold pin center
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#FF9933";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      } else {
        // Other regional network nodes
        ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.restore();

    return canvas;
  }, [MAP_ORIGIN_X, MAP_ORIGIN_Y, MAP_SCALE]);

  // WebGL & Three.js 3D Engine Initialization
  useEffect(() => {
    if (!mountRef.current) return;

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera with cinematic focal length
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // Renderer with high-DPI retina sharpness
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Core Odisha Moon Sphere
    const sphereRadius = 2.15;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);

    const textureCanvas = createOdishaLunarTexture();
    let sphereMaterial: THREE.MeshStandardMaterial;

    if (textureCanvas) {
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      sphereMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.88,
        metalness: 0.16,
        emissive: new THREE.Color(0x3a1905),
        emissiveMap: texture,
        emissiveIntensity: 0.16,
      });
    } else {
      sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.8,
        metalness: 0.2,
      });
    }

    const moonSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // Align Odisha toward the viewer
    moonSphere.rotation.x = currentRotation.current.x;
    moonSphere.rotation.y = currentRotation.current.y;
    scene.add(moonSphere);

    // 2. Atmospheric Fresnel Rim Glow (21hrs.space ethereal horizon)
    const atmosphereGeometry = new THREE.SphereGeometry(sphereRadius * 1.025, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 4.0);
          vec3 rimColor = mix(vec3(0.03, 0.45, 0.88), vec3(0.95, 0.52, 0.08), 0.30);
          gl_FragColor = vec4(rimColor * 1.4, fresnel * 0.72);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 3. Dynamic 3D Surface Beacon & Vertical Celestial Light Ray
    // Calculate initial 3D position of active hub from map coordinates
    const initialBeaconVec = getSpherePoint(selectedHub.x, selectedHub.y, sphereRadius);
    const currentBeaconVec = initialBeaconVec.clone();
    const surfaceNormal = currentBeaconVec.clone().normalize();

    // Beacon Core Light (bright focused core)
    const beaconGeometry = new THREE.SphereGeometry(0.034, 16, 16);
    const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beaconMesh = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beaconMesh.position.copy(currentBeaconVec);
    moonSphere.add(beaconMesh);

    // Expanding Geographic Pulse Ring on Surface (lies flat against sphere tangent)
    const ringGeometry = new THREE.RingGeometry(0.026, 0.072, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
    pulseRing.position.copy(currentBeaconVec).multiplyScalar(1.003);
    pulseRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfaceNormal);
    moonSphere.add(pulseRing);

    // Vertical Celestial Light Beam radiating outward along surface normal
    const beamGeometry = new THREE.CylinderGeometry(0.002, 0.018, 0.44, 16, 1, true);
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffa347,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
    beamMesh.position.copy(currentBeaconVec).add(surfaceNormal.clone().multiplyScalar(0.22));
    beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);
    moonSphere.add(beamMesh);

    // Dedicated Celestial Point Light illuminating the active focal hub and surrounding districts
    const hubPointLight = new THREE.PointLight(0xff9933, 1.4, 2.0);
    hubPointLight.position.copy(currentBeaconVec).multiplyScalar(1.08);
    moonSphere.add(hubPointLight);

    // 4. Subtle Orbital Navigation Ring
    const orbitRingGeometry = new THREE.RingGeometry(sphereRadius * 1.28, sphereRadius * 1.285, 96);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeometry, orbitRingMaterial);
    orbitRing.rotation.x = Math.PI * 0.38;
    orbitRing.rotation.y = Math.PI * 0.12;
    scene.add(orbitRing);

    // 5. Floating Cosmic Data Particles (180 micro-particles)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = sphereRadius * (1.3 + Math.random() * 1.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i] = r * Math.cos(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi);
      particlePositions[i + 2] = r * Math.cos(phi) * Math.sin(theta);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffa347,
      size: 0.024,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Directional Lighting Hierarchy
    // Primary Key Light (Upper Left Sun creating dramatic crater shadows)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.6);
    keyLight.position.set(-4.5, 3.8, 3.2);
    scene.add(keyLight);

    // Secondary Rim Light (Lower Right Cold Sky Reflection)
    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.0);
    rimLight.position.set(3.5, -2.5, -2.0);
    scene.add(rimLight);

    // Soft Ambient Space Illumination (controlled velvet darkness)
    const ambientLight = new THREE.AmbientLight(0x050811, 0.45);
    scene.add(ambientLight);

    // Mouse Parallax Event Listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosition.current.x = x * 0.22;
      mousePosition.current.y = y * 0.18;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize Observer
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop with high-precision timestamp
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smoothly glide beacon to active focal hub coordinates
      const targetBeaconVec = getSpherePoint(selectedHub.x, selectedHub.y, sphereRadius);
      currentBeaconVec.lerp(targetBeaconVec, 0.07);
      const currentNormal = currentBeaconVec.clone().normalize();

      beaconMesh.position.copy(currentBeaconVec);

      pulseRing.position.copy(currentBeaconVec).multiplyScalar(1.003);
      pulseRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), currentNormal);

      beamMesh.position.copy(currentBeaconVec).add(currentNormal.clone().multiplyScalar(0.22));
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), currentNormal);

      hubPointLight.position.copy(currentBeaconVec).multiplyScalar(1.08);

      // Continuous Ultra-Slow Floating Rotation (respects reduced motion)
      if (!motionQuery.matches) {
        // Gentle organic harmonic float loop (+/- 0.04 rad)
        const idleFloat = Math.sin(elapsedTime * 0.4) * 0.04;
        const destY = targetRotation.current.y + mousePosition.current.x + idleFloat;
        const destX = targetRotation.current.x + mousePosition.current.y;

        currentRotation.current.y += (destY - currentRotation.current.y) * 0.04;
        currentRotation.current.x += (destX - currentRotation.current.x) * 0.04;

        moonSphere.rotation.y = currentRotation.current.y;
        moonSphere.rotation.x = currentRotation.current.x;

        // Orbit ring subtle counter-rotation
        orbitRing.rotation.z = elapsedTime * 0.02;

        // Particle subtle drift
        particleSystem.rotation.y = elapsedTime * 0.015;

        // Bhubaneswar Pulse Wave Expansion Loop
        const pulseCycle = (elapsedTime * 1.5) % 2; // 0 to 2 seconds
        const pulseScale = 1 + pulseCycle * 2.8;
        pulseRing.scale.set(pulseScale, pulseScale, pulseScale);
        ringMaterial.opacity = Math.max(0, 0.9 * (1 - pulseCycle / 2));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      motionQuery.removeEventListener("change", motionListener);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      sphereGeometry.dispose();
      atmosphereGeometry.dispose();
      ringGeometry.dispose();
      beamGeometry.dispose();
      orbitRingGeometry.dispose();
      particleGeometry.dispose();
      sphereMaterial.dispose();
      atmosphereMaterial.dispose();
      ringMaterial.dispose();
      beamMaterial.dispose();
      orbitRingMaterial.dispose();
      particleMaterial.dispose();
    };
  }, [createOdishaLunarTexture, getSpherePoint, selectedHub, isHovered]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
      {/* Background radial celestial bloom */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-tr from-orange-600/10 via-amber-500/5 to-cyan-500/10 blur-[100px] opacity-70" />
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-[440px] sm:h-[540px] lg:h-[620px] max-w-[680px] relative z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {!webGlSupported && (
          <div className="text-center p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-xs text-slate-400">
            WebGL acceleration offline. Rendering high-definition vector map fallback.
          </div>
        )}
      </div>

      {/* Floating Technical Telemetry Callout (Top Right) */}
      <div className="absolute top-2 -right-2 sm:top-4 sm:-right-4 lg:-right-6 z-20 pointer-events-none hidden sm:block">
        <div className="p-3.5 rounded-sm border border-white/10 bg-[#070A14]/85 backdrop-blur-xl shadow-2xl space-y-1 font-mono text-[10px] text-slate-400 min-w-[205px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="text-[#FF8800] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF8800]" />
              SURVEY OF INDIA • GEODETIC GRID
            </span>
            <span className="text-slate-500">20°N 85°E</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-500 font-sans">Active Focal:</span>
            <span className="text-white font-bold">{selectedHub.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">GPS Grid:</span>
            <span className="text-emerald-400">{selectedHub.coordinates}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Circulation:</span>
            <span className="text-amber-300 font-bold">50,000+ Print</span>
          </div>
        </div>
      </div>

      {/* Precision Crosshair Accents */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none hidden lg:block font-mono text-slate-700 text-xs select-none">
        + 20.2961° N
      </div>
      <div className="absolute bottom-16 left-4 z-20 pointer-events-none hidden lg:block font-mono text-slate-700 text-xs select-none">
        + 85.8245° E
      </div>

      {/* Floating Interactive Hub Selector Ribbon (Bottom of Sphere) */}
      <div className="absolute -bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-2 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1.5 px-2.5 rounded-full border border-white/10 bg-[#070A14]/90 backdrop-blur-xl shadow-2xl scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 hidden sm:inline">
            Focal Nodes:
          </span>
          {REGIONAL_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const isBhubaneswar = hub.id === "bbsr";

            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-950/60 ring-1 ring-white/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                {isBhubaneswar && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#ff8800]" />}
                <span>{hub.name}</span>
                <span className="font-serif text-[11px] opacity-75">{hub.odiaName}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Telemetry Strip on Mobile */}
        <div className="sm:hidden text-center text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-white/5">
          <span className="text-orange-400 font-bold">{selectedHub.name}</span>: {selectedHub.coordinates} • 50,000+ Circulation
        </div>
      </div>
    </div>
  );
}
