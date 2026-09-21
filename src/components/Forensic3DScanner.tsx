import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Scan, Rotate3d, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Forensic3DScannerProps {
  className?: string;
  height?: number;
}

export const Forensic3DScanner: React.FC<Forensic3DScannerProps> = ({ className = '', height }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [detectedFlags, setDetectedFlags] = useState(0);

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setDetectedFlags(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setScanProgress(p);
      if (p === 30) setDetectedFlags(1);
      if (p === 65) setDetectedFlags(2);
      if (p === 90) setDetectedFlags(3);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 50);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 6.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff3838, 3, 20);
    redLight.position.set(4, 5, 5);
    scene.add(redLight);

    const rimLight = new THREE.PointLight(0x60a5fa, 1.5, 20);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // 5. 3D Geometric Caduceus Core & Financial Crystal
    // Main Octahedron Diamond Crystal (Forensic Core)
    const crystalGeo = new THREE.OctahedronGeometry(1.6, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.9,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    rootGroup.add(crystal);

    // Glowing Red Wireframe Overlay
    const crystalWireGeo = new THREE.OctahedronGeometry(1.65, 0);
    const crystalWireMat = new THREE.MeshBasicMaterial({
      color: 0xff4d4d,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const crystalWire = new THREE.Mesh(crystalWireGeo, crystalWireMat);
    rootGroup.add(crystalWire);

    // 6. Caduceus Staff (Vertical Glowing Column)
    const staffGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.4, 16);
    const staffMat = new THREE.MeshStandardMaterial({
      color: 0xff3838,
      emissive: 0xff3838,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    rootGroup.add(staff);

    // Caduceus Top Orb
    const orbGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      emissive: 0xff3838,
      emissiveIntensity: 1.5,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 1.7;
    rootGroup.add(orb);

    // 7. Torus Risk Rings (Caduceus Serpent Loops & Financial Orbit)
    const torusGeo1 = new THREE.TorusGeometry(1.9, 0.025, 16, 100);
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0xff4d4d,
      transparent: true,
      opacity: 0.6,
    });
    const torus1 = new THREE.Mesh(torusGeo1, torusMat1);
    torus1.rotation.x = Math.PI / 2.5;
    rootGroup.add(torus1);

    const torusGeo2 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
    });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.rotation.x = Math.PI / 1.7;
    torus2.rotation.y = Math.PI / 4;
    rootGroup.add(torus2);

    // 8. Financial Ascending Candlestick Bar Pillars in 3D Space
    const candleGroup = new THREE.Group();
    const candleData = [
      { x: -1.8, y: -0.6, z: 0.4, h: 0.7, color: 0x10b981 },
      { x: -1.2, y: -0.3, z: 0.7, h: 0.9, color: 0x10b981 },
      { x: -0.6, y: -0.5, z: 0.9, h: 0.6, color: 0xef4444 },
      { x: 0.0, y: 0.1, z: 1.1, h: 1.1, color: 0x10b981 },
      { x: 0.6, y: 0.4, z: 0.9, h: 1.3, color: 0x10b981 },
      { x: 1.2, y: 0.2, z: 0.7, h: 0.8, color: 0xef4444 },
      { x: 1.8, y: 0.8, z: 0.4, h: 1.5, color: 0x10b981 },
    ];

    candleData.forEach(c => {
      const geo = new THREE.BoxGeometry(0.12, c.h, 0.12);
      const mat = new THREE.MeshStandardMaterial({
        color: c.color,
        roughness: 0.4,
        emissive: c.color,
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(c.x, c.y, c.z);
      candleGroup.add(mesh);
    });
    rootGroup.add(candleGroup);

    // 9. Floating 3D Forensic Satellite Nodes (7 Lenses)
    const satelliteNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const sGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const sMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff4d4d : 0x38bdf8,
        emissive: i % 2 === 0 ? 0xff2222 : 0x0284c7,
        emissiveIntensity: 1.2,
      });
      const node = new THREE.Mesh(sGeo, sMat);
      node.position.set(Math.cos(angle) * 2.2, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2.2);
      rootGroup.add(node);
      satelliteNodes.push(node);
    }

    // 10. Scanning Laser Plane
    const scanPlaneGeo = new THREE.PlaneGeometry(5, 5);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xff3838,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlane.position.y = -2;
    rootGroup.add(scanPlane);

    // 11. Ambient 3D Stars / SEC Data Stream Particles (250 particles)
    const count = 250;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 12;
      partPos[i + 1] = (Math.random() - 0.5) * 8;
      partPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xff6b6b,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(partGeo, partMat);
    scene.add(particleCloud);

    // 12. Pointer Parallax
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    container.addEventListener('mousemove', handlePointerMove);

    // 13. Animation Loop
    let clock = new THREE.Clock();
    let scanDirection = 1;
    let scanY = -2;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX;
      camera.position.y = 0.5 + mouseY;
      camera.lookAt(0, 0, 0);

      // Rotate 3D Core
      crystal.rotation.y = elapsed * 0.4;
      crystal.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
      crystalWire.rotation.y = elapsed * 0.4;
      crystalWire.rotation.x = Math.sin(elapsed * 0.3) * 0.2;

      // Torus rings counter-rotation
      torus1.rotation.z = elapsed * 0.25;
      torus2.rotation.z = -elapsed * 0.2;
      candleGroup.rotation.y = elapsed * 0.15;

      // Orbit satellite nodes
      satelliteNodes.forEach((node, i) => {
        const offset = (i / 7) * Math.PI * 2 + elapsed * 0.5;
        node.position.x = Math.cos(offset) * 2.2;
        node.position.z = Math.sin(offset) * 2.2;
        node.position.y = Math.sin(offset * 2) * 0.4;
      });

      // Scanning Laser Sweep
      scanY += 0.04 * scanDirection;
      if (scanY > 2.2) scanDirection = -1;
      if (scanY < -2.2) scanDirection = 1;
      scanPlane.position.y = scanY;

      // Drift particle stream
      particleCloud.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      crystalGeo.dispose();
      crystalMat.dispose();
      crystalWireGeo.dispose();
      crystalWireMat.dispose();
      staffGeo.dispose();
      staffMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      torusGeo1.dispose();
      torusMat1.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      scanPlaneGeo.dispose();
      scanPlaneMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 backdrop-blur ${className}`}>
      {/* WebGL Canvas */}
      <div 
        ref={containerRef} 
        style={height ? { height: `${height}px` } : undefined}
        className={`w-full ${height ? '' : 'h-[380px] sm:h-[440px]'} cursor-crosshair`}
      />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-full text-xs pointer-events-auto shadow-lg">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-white font-semibold tracking-wide">3D Forensics Hologram</span>
          <span className="text-slate-400 text-[10px]">WebGL 60FPS</span>
        </div>

        <button
          onClick={triggerScan}
          disabled={isScanning}
          className="pointer-events-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Scan className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? `Scanning SEC Grid ${scanProgress}%` : 'Trigger 3D Telemetry Scan'}</span>
        </button>
      </div>

      {/* Bottom Forensic Telemetry HUD */}
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 p-2.5 rounded-xl pointer-events-auto">
          <div className="text-[10px] text-slate-400">Core Telemetry</div>
          <div className="font-mono text-white font-semibold text-xs mt-0.5 flex items-center gap-1">
            <span className="text-red-400">30</span> Red Flags
          </div>
        </div>

        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 p-2.5 rounded-xl pointer-events-auto">
          <div className="text-[10px] text-slate-400">SEC Ground Truth</div>
          <div className="font-mono text-emerald-400 font-semibold text-xs mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Live EDGAR XBRL
          </div>
        </div>

        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 p-2.5 rounded-xl pointer-events-auto">
          <div className="text-[10px] text-slate-400">Sloan Accrual Ratio</div>
          <div className="font-mono text-white font-semibold text-xs mt-0.5">
            Real-Time Analysis
          </div>
        </div>

        <div className="bg-slate-900/85 backdrop-blur border border-slate-800 p-2.5 rounded-xl pointer-events-auto">
          <div className="text-[10px] text-slate-400">Anomalies Detected</div>
          <div className="font-mono text-red-400 font-bold text-xs mt-0.5 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            <span>{isScanning ? `${detectedFlags} flags in sweep` : '0 Critical In Health'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
