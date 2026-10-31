import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FieldPlant, PlantHealthCategory } from '../types/agrilens';
import {
  RotateCcw,
  ZoomIn,
  Eye,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface FieldView3DProps {
  plants: FieldPlant[];
  selectedPlantId: string | null;
  onSelectPlant: (plantId: string | null) => void;
  onOpenDiagnosis: (diagnosisId: string) => void;
  viewMode: 'normal' | 'health' | 'ai_findings';
  onChangeViewMode: (mode: 'normal' | 'health' | 'ai_findings') => void;
  lang: 'en' | 'hi';
}

export const FieldView3D: React.FC<FieldView3DProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
  onOpenDiagnosis,
  viewMode,
  onChangeViewMode,
  lang,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const plantMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const highlightRingRef = useRef<THREE.Mesh | null>(null);
  const bboxRef = useRef<THREE.BoxHelper | null>(null);

  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activePreset, setActivePreset] = useState<'iso' | 'top' | 'row'>('iso');

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null;

  // Health Colors
  const HEALTH_COLORS: Record<PlantHealthCategory, number> = {
    healthy: 0x478653,     // Leaf green
    observation: 0xd6ad57, // Gold accent
    suspected: 0xcc6a2e,   // Orange warning
    priority: 0xb53526,    // Red alert
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Software-WebGL Detection
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Fog Setup (Matching AgriLens Warm Cream)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5ede1); // Soft warm earth horizon
    scene.fog = new THREE.FogExp2(0xf5ede1, 0.018);
    sceneRef.current = scene;

    // 4. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 120);
    camera.position.set(0, 18, 26);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Never submerge below ground
    controls.minDistance = 6;
    controls.maxDistance = 55;
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    // 5. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff6e6, 0x5a4838, 0.65);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(15, 25, 12);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 50;
      sunLight.shadow.camera.left = -16;
      sunLight.shadow.camera.right = 16;
      sunLight.shadow.camera.top = 16;
      sunLight.shadow.camera.bottom = -16;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xbde0b2, 0.35);
    fillLight.position.set(-15, 12, -10);
    scene.add(fillLight);

    // 7. Soil Bed & Ground Construction
    // Base agricultural soil plane
    const soilGeo = new THREE.PlaneGeometry(38, 28, 32, 32);
    soilGeo.rotateX(-Math.PI / 2);

    // Create rich procedural soil texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#4a3b2c';
    ctx.fillRect(0, 0, 512, 512);
    // Soil grain noise
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = 40 + Math.random() * 50;
      ctx.fillStyle = `rgb(${gray + 20},${gray},${gray - 10})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    const soilTex = new THREE.CanvasTexture(canvas);
    soilTex.wrapS = THREE.RepeatWrapping;
    soilTex.wrapT = THREE.RepeatWrapping;
    soilTex.repeat.set(8, 6);
    soilTex.colorSpace = THREE.SRGBColorSpace;

    const soilMat = new THREE.MeshStandardMaterial({
      map: soilTex,
      roughness: 0.92,
      metalness: 0.05,
      color: 0x544332,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.receiveShadow = !isSoftwareGl;
    scene.add(soilMesh);

    // Raised Furrow Mounds along the 4 rows (z = -6.3, -2.1, 2.1, 6.3)
    const rowPositionsZ = [-6.3, -2.1, 2.1, 6.3];
    rowPositionsZ.forEach((rz) => {
      const furrowGeo = new THREE.CylinderGeometry(0.7, 0.85, 32, 16);
      furrowGeo.rotateZ(Math.PI / 2);
      const furrowMat = new THREE.MeshStandardMaterial({
        color: 0x3d3023,
        roughness: 0.95,
      });
      const furrow = new THREE.Mesh(furrowGeo, furrowMat);
      furrow.position.set(0, 0.25, rz);
      furrow.receiveShadow = !isSoftwareGl;
      scene.add(furrow);
    });

    // Outer Plot Wooden Perimeter Border
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x6e5842, roughness: 0.8 });
    const bTop = new THREE.Mesh(new THREE.BoxGeometry(38.4, 0.3, 0.4), borderMat);
    bTop.position.set(0, 0.15, -14);
    const bBottom = new THREE.Mesh(new THREE.BoxGeometry(38.4, 0.3, 0.4), borderMat);
    bBottom.position.set(0, 0.15, 14);
    const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 28), borderMat);
    bLeft.position.set(-19.2, 0.15, 0);
    const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 28), borderMat);
    bRight.position.set(19.2, 0.15, 0);
    scene.add(bTop, bBottom, bLeft, bRight);

    // 8. Procedural Multi-Part Crop Model Generator
    // Generates a 3-12 part realistic plant group (Stem, Petioles, Foliage Leaflets, Flower/Fruit)
    function buildProceduralPlant(plant: FieldPlant): THREE.Group {
      const group = new THREE.Group();
      group.name = plant.id;
      group.position.set(plant.x, 0.45, plant.z);

      // Random micro-rotation and scale for natural biological variance
      const seed = plant.row * 13 + plant.col * 7;
      const yaw = Math.sin(seed) * 0.4;
      const scaleVariance = 0.9 + Math.abs(Math.cos(seed)) * 0.2;
      group.rotation.y = yaw;
      group.scale.set(scaleVariance, scaleVariance, scaleVariance);

      // Stem (curved cylinder with nodes)
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.sin(seed) * 0.1, 0.7, Math.cos(seed) * 0.08),
        new THREE.Vector3(Math.cos(seed) * 0.12, 1.4, Math.sin(seed) * 0.05),
        new THREE.Vector3(0, 2.0, 0),
      ]);
      const stemGeo = new THREE.TubeGeometry(stemCurve, 12, 0.07, 8, false);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x3d7036,
        roughness: 0.75,
        metalness: 0.05,
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.castShadow = !isSoftwareGl;
      group.add(stemMesh);

      // Custom Leaf Blade Geometry (Leaf shape with central fold and pointed apex)
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.35, 0.4, 0.3, 0.9);
      leafShape.quadraticCurveTo(0.15, 1.4, 0, 1.7);
      leafShape.quadraticCurveTo(-0.15, 1.4, -0.3, 0.9);
      leafShape.quadraticCurveTo(-0.35, 0.4, 0, 0);

      const leafGeo = new THREE.ShapeGeometry(leafShape);
      // Curve the leaf geometry slightly along Y for realistic droop
      const pos = leafGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setZ(i, -Math.sin((y / 1.7) * Math.PI) * 0.2);
      }
      leafGeo.computeVertexNormals();

      // Foliage Material
      const leafColor = 0x3b803b;
      const leafMat = new THREE.MeshStandardMaterial({
        color: leafColor,
        roughness: 0.6,
        metalness: 0.08,
        side: THREE.DoubleSide,
      });

      // 6 to 8 Paired Leaflets spiraling up the stem
      const leafCount = 7;
      for (let i = 0; i < leafCount; i++) {
        const heightFactor = (i + 1) / (leafCount + 1);
        const yPos = 0.4 + heightFactor * 1.4;
        const angle = (i * (Math.PI * 2 * 0.38)) + (seed * 0.1);
        const leafScale = 0.8 + (1 - Math.abs(heightFactor - 0.5)) * 0.5;

        const leafMesh = new THREE.Mesh(leafGeo, leafMat.clone());
        leafMesh.name = 'foliage_leaf';
        leafMesh.position.set(0, yPos, 0);
        leafMesh.rotation.y = angle;
        leafMesh.rotation.x = Math.PI / 3 + Math.sin(seed + i) * 0.15;
        leafMesh.rotation.z = Math.sin(seed * 2 + i) * 0.15;
        leafMesh.scale.set(leafScale * 0.7, leafScale * 0.7, leafScale * 0.7);
        leafMesh.castShadow = !isSoftwareGl;
        group.add(leafMesh);
      }

      // Fruit / Bud accent (Tomato ripening or floral bud)
      const fruitGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const isRed = (plant.col + plant.row) % 3 === 0;
      const fruitMat = new THREE.MeshStandardMaterial({
        color: isRed ? 0xb53526 : 0x78ab3e,
        roughness: 0.35,
        metalness: 0.1,
      });
      const fruitMesh = new THREE.Mesh(fruitGeo, fruitMat);
      fruitMesh.position.set(0.18, 1.25, 0.12);
      fruitMesh.castShadow = !isSoftwareGl;
      group.add(fruitMesh);

      // Contact shadow disc on furrow surface
      const shadowGeo = new THREE.CircleGeometry(0.65, 16);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x1b130a,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });
      const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
      shadowDisc.position.set(0, 0.02, 0);
      group.add(shadowDisc);

      // Invisible Raycast Proxy Box for easy touch/mouse clicking
      const clickBoxGeo = new THREE.BoxGeometry(1.6, 2.3, 1.6);
      clickBoxGeo.translate(0, 1.15, 0);
      const clickBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const clickBox = new THREE.Mesh(clickBoxGeo, clickBoxMat);
      clickBox.userData = { plantId: plant.id };
      group.add(clickBox);

      return group;
    }

    // Build all plants in grid
    plantMeshesRef.current.clear();
    plants.forEach((plant) => {
      const plantGroup = buildProceduralPlant(plant);
      scene.add(plantGroup);
      plantMeshesRef.current.set(plant.id, plantGroup);
    });

    // 9. Interactive Selection Ring & Bounding Box
    const ringGeo = new THREE.RingGeometry(0.85, 1.05, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd6ad57,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const highlightRing = new THREE.Mesh(ringGeo, ringMat);
    highlightRing.visible = false;
    scene.add(highlightRing);
    highlightRingRef.current = highlightRing;

    // 10. Raycasting Pointer Handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (hit.object.userData?.plantId) {
          onSelectPlant(hit.object.userData.plantId);
          return;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 11. Render Loop with software WebGL guard
    let frameId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // 12. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      scene.clear();
    };
  }, []); // Run once on mount

  // Update View Modes and Material Colors
  useEffect(() => {
    plants.forEach((plant) => {
      const group = plantMeshesRef.current.get(plant.id);
      if (!group) return;

      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === 'foliage_leaf') {
          const mat = child.material as THREE.MeshStandardMaterial;

          if (viewMode === 'normal') {
            mat.color.setHex(0x3b803b);
            mat.emissive.setHex(0x000000);
          } else if (viewMode === 'health') {
            const hex = HEALTH_COLORS[plant.healthCategory];
            mat.color.setHex(hex);
            mat.emissive.setHex(0x101a08);
          } else if (viewMode === 'ai_findings') {
            if (plant.linkedDiagnosisId) {
              const hex = HEALTH_COLORS[plant.healthCategory];
              mat.color.setHex(hex);
              mat.emissive.setHex(hex);
              mat.emissiveIntensity = 0.35;
            } else {
              mat.color.setHex(0x6e786b);
              mat.emissive.setHex(0x000000);
            }
          }
        }
      });
    });
  }, [viewMode, plants]);

  // Update Selection Highlight and Camera Focus
  useEffect(() => {
    if (!highlightRingRef.current || !sceneRef.current) return;

    if (selectedPlantId) {
      const plant = plants.find((p) => p.id === selectedPlantId);
      if (plant) {
        highlightRingRef.current.position.set(plant.x, 0.47, plant.z);
        highlightRingRef.current.visible = true;

        // Smooth camera shift toward selected plant
        if (controlsRef.current && cameraRef.current) {
          controlsRef.current.target.set(plant.x, 1.0, plant.z);
        }
      }
    } else {
      highlightRingRef.current.visible = false;
    }
  }, [selectedPlantId, plants]);

  // Camera Presets
  const handleSetPreset = (preset: 'iso' | 'top' | 'row') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);

    if (preset === 'iso') {
      cameraRef.current.position.set(0, 18, 26);
      controlsRef.current.target.set(0, 0.5, 0);
    } else if (preset === 'top') {
      cameraRef.current.position.set(0, 32, 0.1);
      controlsRef.current.target.set(0, 0, 0);
    } else if (preset === 'row') {
      cameraRef.current.position.set(-18, 5, 2.1);
      controlsRef.current.target.set(4, 1.2, 2.1);
    }
    controlsRef.current.update();
  };

  const handleResetCamera = () => {
    handleSetPreset('iso');
    onSelectPlant(null);
    onChangeViewMode('normal');
  };

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] rounded-2xl overflow-hidden shadow-md border border-[#80674733] bg-[#f5ede1]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#245638] text-white text-xs font-semibold tracking-wide shadow flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#D6AD57]" />
          <span>{lang === 'hi' ? 'खेत ब्लॉक-ए (32 पौधे)' : 'Field Block-A (32 Mapped Plants)'}</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-[#FAF6EDdd] backdrop-blur-sm text-[#24342A] text-xs font-medium border border-[#80674722] shadow-sm">
          {viewMode === 'normal'
            ? lang === 'hi' ? 'सामान्य दृश्य' : 'Standard Foliage'
            : viewMode === 'health'
            ? lang === 'hi' ? 'स्वास्थ्य वर्गीकरण' : 'Health Classification'
            : lang === 'hi' ? 'एआई निष्कर्ष दृश्य' : 'AI Detections'}
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => handleSetPreset('iso')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
            activePreset === 'iso'
              ? 'bg-[#245638] text-white'
              : 'bg-[#FFFDF8] text-[#24342A] hover:bg-[#FAF6ED] border border-[#80674733]'
          }`}
          title="Isometric View"
        >
          {lang === 'hi' ? 'आइसो' : 'Isometric'}
        </button>
        <button
          onClick={() => handleSetPreset('top')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
            activePreset === 'top'
              ? 'bg-[#245638] text-white'
              : 'bg-[#FFFDF8] text-[#24342A] hover:bg-[#FAF6ED] border border-[#80674733]'
          }`}
          title="Top-down Grid View"
        >
          {lang === 'hi' ? 'ऊपरी दृश्य' : 'Top-Down'}
        </button>
        <button
          onClick={() => handleSetPreset('row')}
          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
            activePreset === 'row'
              ? 'bg-[#245638] text-white'
              : 'bg-[#FFFDF8] text-[#24342A] hover:bg-[#FAF6ED] border border-[#80674733]'
          }`}
          title="Row Inspection View"
        >
          {lang === 'hi' ? 'पंक्ति' : 'Row Level'}
        </button>
        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg bg-[#FFFDF8] text-[#24342A] hover:bg-[#FAF6ED] border border-[#80674733] shadow-sm transition"
          title="Reset Camera & Selection"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#806747]" />
        </button>
      </div>

      {/* Collapsible Unified Bottom Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-4xl">
        {/* Toggle Collapse Header */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="px-3 py-1 rounded-t-lg bg-[#245638] text-white text-xs font-medium flex items-center gap-1 shadow-md hover:bg-[#143B29] transition"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#D6AD57]" />
                <span>{lang === 'hi' ? 'खेत नियंत्रण दिखाएं' : 'Show Field Controls'}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#D6AD57]" />
                <span>{lang === 'hi' ? 'नियंत्रण छुपाएं' : 'Minimize Dock'}</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Content */}
        {!hudCollapsed && (
          <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#80674733] shadow-xl text-[#24342A]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Left: 4 View Modes */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => onChangeViewMode('normal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    viewMode === 'normal'
                      ? 'bg-[#245638] text-white shadow-sm'
                      : 'bg-[#FAF6ED] text-[#24342A] hover:bg-[#FAF6EDbb] border border-[#80674722]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#D6AD57]" />
                  <span>{lang === 'hi' ? 'सामान्य दृश्य' : 'NORMAL VIEW'}</span>
                </button>

                <button
                  onClick={() => onChangeViewMode('health')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    viewMode === 'health'
                      ? 'bg-[#245638] text-white shadow-sm'
                      : 'bg-[#FAF6ED] text-[#24342A] hover:bg-[#FAF6EDbb] border border-[#80674722]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-[#478653]" />
                  <span>{lang === 'hi' ? 'स्वास्थ्य दृश्य' : 'HEALTH VIEW'}</span>
                </button>

                <button
                  onClick={() => onChangeViewMode('ai_findings')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    viewMode === 'ai_findings'
                      ? 'bg-[#245638] text-white shadow-sm'
                      : 'bg-[#FAF6ED] text-[#24342A] hover:bg-[#FAF6EDbb] border border-[#80674722]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D6AD57]" />
                  <span>{lang === 'hi' ? 'एआई निष्कर्ष' : 'AI FINDINGS'}</span>
                </button>

                <button
                  onClick={handleResetCamera}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF6ED] text-[#746C60] hover:bg-[#FAF6EDbb] border border-[#80674722] whitespace-nowrap transition"
                >
                  {lang === 'hi' ? 'रीसेट' : 'RESET VIEW'}
                </button>
              </div>

              {/* Middle: Legend Swatches */}
              <div className="flex items-center gap-3 text-[11px] text-[#746C60] flex-wrap justify-center">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#478653]" />
                  {lang === 'hi' ? 'स्वस्थ' : 'Healthy'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D6AD57]" />
                  {lang === 'hi' ? 'निगरानी' : 'Observation'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cc6a2e]" />
                  {lang === 'hi' ? 'संभावित' : 'Suspected'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b53526]" />
                  {lang === 'hi' ? 'गंभीर' : 'Priority'}
                </span>
              </div>
            </div>

            {/* Selected Plant Detail Bar */}
            {selectedPlant ? (
              <div className="mt-3 pt-3 border-t border-[#80674722] flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FAF6ED] p-2.5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-[#245638] text-sm flex items-center gap-1">
                    <span>{selectedPlant.id}</span>
                    <span className="text-gray-400 font-normal">| {selectedPlant.cropType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedPlant.healthCategory === 'healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedPlant.healthCategory === 'observation'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedPlant.healthCategory === 'suspected'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {selectedPlant.healthCategory}
                    </span>
                    <span className="text-[#746C60]">
                      {lang === 'hi' ? 'नमी:' : 'Moisture:'} {selectedPlant.moisturePercent}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[#746C60] italic truncate max-w-xs">{selectedPlant.notes}</p>
                  {selectedPlant.linkedDiagnosisId && (
                    <button
                      onClick={() => onOpenDiagnosis(selectedPlant.linkedDiagnosisId!)}
                      className="px-2.5 py-1 rounded-lg bg-[#245638] text-white font-semibold flex items-center gap-1 hover:bg-[#143B29] transition whitespace-nowrap shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3 text-[#D6AD57]" />
                      <span>{lang === 'hi' ? 'निदान देखें' : 'View Diagnosis'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => onSelectPlant(null)}
                    className="text-[#746C60] hover:text-black text-xs font-medium px-1.5 py-0.5"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-center text-xs text-[#746C60] italic">
                {lang === 'hi'
                  ? 'पौधे की विस्तृत स्वास्थ्य रिपोर्ट देखने के लिए किसी भी पौधे पर क्लिक करें।'
                  : 'Click on any plant in the 3D rows to inspect health records or link diagnostic telemetry.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
