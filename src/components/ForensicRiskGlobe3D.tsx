import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Eye, 
  ZoomIn, 
  Maximize2, 
  ShieldAlert, 
  Sparkles,
  Info
} from 'lucide-react';
import { CompanyForensicProfile } from '../types';

interface ForensicRiskGlobe3DProps {
  company: CompanyForensicProfile;
  height?: number;
}

interface RiskVector {
  id: string;
  label: string;
  value: number; // 0 to 100 risk scale (100 = high anomaly, 0 = safe)
  status: 'Critical' | 'Warning' | 'Healthy';
  metric: string;
  secRule: string;
  position: THREE.Vector3;
}

export const ForensicRiskGlobe3D: React.FC<ForensicRiskGlobe3DProps> = ({ 
  company, 
  height = 360 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [hoveredVector, setHoveredVector] = useState<RiskVector | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate 8 3D Forensic Risk Vectors based on the company's real accounting data
  const vectors: RiskVector[] = React.useMemo(() => {
    // 1. Beneish M-Score risk (high risk if > -1.78)
    const beneishRisk = Math.min(100, Math.max(10, Math.round(((company.beneishMScore + 3.0) / 2.5) * 100)));
    // 2. Altman Z-Score risk (high risk if < 1.81)
    const altmanRisk = Math.min(100, Math.max(10, Math.round(100 - (company.altmanZScore / 5) * 100)));
    // 3. Sloan Accruals risk (high risk if > 8%)
    const sloanRisk = Math.min(100, Math.max(10, Math.round((company.sloanAccrualRatio / 0.15) * 100)));
    // 4. Critical Flag Count risk
    const critCount = company.flags.filter(f => f.status === 'Critical Anomaly').length;
    const flagRisk = Math.min(100, Math.max(15, critCount * 25));
    // 5. Working Capital / Receivables DSO risk
    const dsoRisk = Math.min(95, Math.max(20, Math.round((100 - company.forensicScore) * 1.1)));
    // 6. Revenue ASC 606 Quality
    const revRisk = Math.min(90, Math.max(15, Math.round(100 - company.forensicScore)));
    // 7. Balance Sheet Leverage & Debt
    const debtRisk = altmanRisk > 60 ? 80 : 35;
    // 8. Governance & Auditor Discrepancy
    const govRisk = company.flags.some(f => f.category === 'Governance & Disclosure Risk' && f.status !== 'Healthy') ? 85 : 25;

    const rawList = [
      { id: 'beneish', label: 'Beneish M-Score (Earnings Manipulation)', value: beneishRisk, metric: `${company.beneishMScore} (${company.beneishMScore > -1.78 ? 'Watch' : 'Safe'})`, secRule: 'ASC 250 / PCAOB AS 2401' },
      { id: 'altman', label: 'Altman Z-Score (Solvency & Capital Buffer)', value: altmanRisk, metric: `${company.altmanZScore} (${company.altmanZScore < 1.81 ? 'Distress' : 'Safe'})`, secRule: 'ASC 205-40 Going Concern' },
      { id: 'sloan', label: 'Sloan Accrual Ratio (Cash vs Paper Earnings)', value: sloanRisk, metric: `${(company.sloanAccrualRatio * 100).toFixed(1)}%`, secRule: 'ASC 230 Operating Cash Flow' },
      { id: 'flags', label: 'Deterministic Critical Flag Severity', value: flagRisk, metric: `${critCount} Critical Anomaly Triggers`, secRule: '30 Red Flags Sector Lens' },
      { id: 'dso', label: 'Working Capital & DSO Velocity', value: dsoRisk, metric: `${dsoRisk > 60 ? 'Extended Collections' : 'Normal'}`, secRule: 'ASC 310 Receivables' },
      { id: 'rev', label: 'ASC 606 Revenue Recognition Quality', value: revRisk, metric: `Health ${company.forensicScore}/100`, secRule: 'ASC 606 Customer Contracts' },
      { id: 'debt', label: 'Balance Sheet Solvency & Unfunded Commitments', value: debtRisk, metric: `${debtRisk > 50 ? 'Elevated Commitments' : 'Investment Grade'}`, secRule: 'ASC 470 Debt & Credit' },
      { id: 'gov', label: 'Corporate Governance & Filing Regularity', value: govRisk, metric: `${company.filingAuditLogs[0]?.auditorOpinion || 'Unqualified'}`, secRule: 'Item 9A Internal Controls' },
    ];

    // Compute spherical positions around a sphere of radius 2.2
    return rawList.map((item, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / rawList.length);
      const theta = Math.sqrt(rawList.length * Math.PI) * phi;
      
      // Scale radius based on risk score (higher risk = spikes outward)
      const radius = 1.6 + (item.value / 100) * 1.4;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const status: 'Critical' | 'Warning' | 'Healthy' = 
        item.value >= 70 ? 'Critical' : item.value >= 40 ? 'Warning' : 'Healthy';

      return {
        ...item,
        status,
        position: new THREE.Vector3(x, y, z),
      };
    });
  }, [company]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const currentHeight = height;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 7.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Group for all rotating elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff4d4d, 2.5, 30);
    pointLight.position.set(5, 8, 6);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x60a5fa, 1.5, 25);
    cyanLight.position.set(-6, -4, -4);
    scene.add(cyanLight);

    // 5. Central 3D Forensic Polyhedron Core (Deformed based on risk profile)
    const coreGeometry = new THREE.IcosahedronGeometry(1.8, 2);
    const posAttribute = coreGeometry.attributes.position;
    const vertex = new THREE.Vector3();

    // Sculpt vertices using noise and risk spikes
    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      const distance = vertex.length();
      // Find nearest vector influence
      let nearestDist = 999;
      let nearestWeight = 0;
      vectors.forEach(v => {
        const d = vertex.distanceTo(v.position);
        if (d < nearestDist) {
          nearestDist = d;
          nearestWeight = v.value / 100;
        }
      });

      const distortion = 1 + (nearestWeight * 0.45 * Math.sin(distance * 3));
      vertex.normalize().multiplyScalar(1.6 * distortion);
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    coreGeometry.computeVertexNormals();

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: wireframeMode,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Inner wireframe shell
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4d4d,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(coreGeometry, wireMaterial);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    mainGroup.add(wireMesh);

    // 6. Glowing Radar Equatorial Rings
    const ringGeo1 = new THREE.RingGeometry(2.3, 2.34, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xff4d4d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(2.7, 2.73, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 6;
    mainGroup.add(ring2);

    // 7. Interactive Risk Beacon Nodes & Laser Vector Lines
    const beaconMeshes: THREE.Mesh[] = [];
    const beaconHitboxes: THREE.Mesh[] = [];

    vectors.forEach((v) => {
      // Line from center to beacon
      const linePoints = [new THREE.Vector3(0, 0, 0), v.position];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: v.status === 'Critical' ? 0xff4d4d : v.status === 'Warning' ? 0xfbbf24 : 0x34d399,
        transparent: true,
        opacity: v.status === 'Critical' ? 0.8 : 0.4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(line);

      // Beacon Sphere
      const beaconGeo = new THREE.SphereGeometry(v.status === 'Critical' ? 0.16 : 0.12, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: v.status === 'Critical' ? 0xff4d4d : v.status === 'Warning' ? 0xfbbf24 : 0x34d399,
        emissive: v.status === 'Critical' ? 0xff1f1f : v.status === 'Warning' ? 0xd97706 : 0x059669,
        emissiveIntensity: 1.2,
        roughness: 0.2,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(v.position);
      mainGroup.add(beacon);
      beaconMeshes.push(beacon);

      // Outer pulsating halo for critical nodes
      if (v.status === 'Critical') {
        const haloGeo = new THREE.SphereGeometry(0.26, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xff4d4d,
          transparent: true,
          opacity: 0.35,
          wireframe: true,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(v.position);
        mainGroup.add(halo);
      }

      // Invisible larger hitbox for comfortable raycasting on mouse hover
      const hitGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(v.position);
      hitMesh.userData = { vector: v };
      mainGroup.add(hitMesh);
      beaconHitboxes.push(hitMesh);
    });

    // 8. 3D Forensic Telemetry Particle Field (180 particles)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 2.2;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius;
      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff6b6b,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 9. Interactive Pointer Drag & Raycasting
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      setMousePos({ x: clientX, y: clientY });

      // Normalized coordinates for Raycaster
      pointer.x = (clientX / width) * 2 - 1;
      pointer.y = -(clientY / currentHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycast against beacon hitboxes
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(beaconHitboxes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData?.vector) {
          setHoveredVector(hit.userData.vector);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredVector(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth inertia rotation
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.1;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.1;

      if (isAutoRotate && !isDragging) {
        targetRotationY += 0.004;
      }

      // Orbiting particles rotation
      particles.rotation.y = elapsed * 0.05;
      ring2.rotation.z = elapsed * 0.1;

      // Pulsate beacons
      beaconMeshes.forEach((mesh, i) => {
        const s = 1 + 0.12 * Math.sin(elapsed * 3 + i);
        mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Handle Container Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / currentHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, currentHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [company, vectors, isAutoRotate, wireframeMode, height]);

  return (
    <div className="relative w-full bg-slate-950/70 border border-slate-800/90 rounded-xl overflow-hidden shadow-inner">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing relative"
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs pointer-events-auto">
          <Sparkles className="h-3.5 w-3.5 text-red-400" />
          <span className="text-white font-medium">3D Forensic Risk Polyhedron</span>
          <span className="text-slate-400 text-[10px]">· 8 Vectors</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-lg text-xs border transition-colors ${
              isAutoRotate 
                ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={isAutoRotate ? 'Pause 3D Auto-Rotation' : 'Resume 3D Auto-Rotation'}
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-1.5 rounded-lg text-xs border transition-colors ${
              wireframeMode 
                ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Wireframe Shell"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 3D Vector Tooltip on Hover */}
      {hoveredVector && (
        <div 
          className="absolute z-20 pointer-events-none bg-slate-900/95 backdrop-blur border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 max-w-xs animate-fadeIn"
          style={{
            left: Math.min(mousePos.x + 15, (containerRef.current?.clientWidth || 300) - 220),
            top: Math.max(10, Math.min(mousePos.y - 40, height - 130)),
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="font-semibold text-white truncate">{hoveredVector.label}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              hoveredVector.status === 'Critical' 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : hoveredVector.status === 'Warning'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {hoveredVector.status}
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            Reading: <strong className="text-white">{hoveredVector.metric}</strong>
          </div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1 pt-0.5">
            <Info className="h-3 w-3 text-slate-500 shrink-0" />
            <span>Rule: {hoveredVector.secRule}</span>
          </div>
        </div>
      )}

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800/80">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
          <span>Click &amp; drag to rotate in 3D · Hover beacons to inspect</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-slate-900/70 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800/80 text-[10px]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400"></span> Anomaly</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Warning</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Clean</span>
        </div>
      </div>
    </div>
  );
};
