import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { X } from 'lucide-react';
import { detectWebGLSupport, disposeHierarchy } from './webglUtils';
import {
  LIFE_HUB_PILLARS,
  LifeHubFallback,
  LifeHubPillar,
} from '../components/app/LifeHubFallback';

const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();
const _projVec = new THREE.Vector3();

function createIconTileTexture(
  label: string,
  pillarId: LifeHubPillar['id'],
  maxAniso: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark emerald-glass tile fill
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#10281B');
    grad.addColorStop(1, '#07120C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Subtle crisp border glow
    ctx.strokeStyle = 'rgba(197, 255, 98, 0.55)';
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 232, 232);

    // Draw clean geometric icon per life area
    ctx.strokeStyle = '#C5FF62';
    ctx.fillStyle = '#00FF78';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = 128;
    const cy = 104;

    if (pillarId === 'schedule') {
      ctx.strokeRect(cx - 42, cy - 36, 84, 74);
      ctx.beginPath();
      ctx.moveTo(cx - 42, cy - 12);
      ctx.lineTo(cx + 42, cy - 12);
      ctx.moveTo(cx - 22, cy - 48);
      ctx.lineTo(cx - 22, cy - 26);
      ctx.moveTo(cx + 22, cy - 48);
      ctx.lineTo(cx + 22, cy - 26);
      ctx.stroke();
      ctx.fillRect(cx - 20, cy + 6, 16, 16);
    } else if (pillarId === 'goals') {
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (pillarId === 'learning') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 28);
      ctx.lineTo(cx - 44, cy - 38);
      ctx.lineTo(cx - 44, cy + 30);
      ctx.lineTo(cx, cy + 40);
      ctx.lineTo(cx + 44, cy + 30);
      ctx.lineTo(cx + 44, cy - 38);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 28);
      ctx.lineTo(cx, cy + 40);
      ctx.stroke();
    } else if (pillarId === 'health') {
      ctx.beginPath();
      ctx.moveTo(cx - 48, cy);
      ctx.lineTo(cx - 24, cy);
      ctx.lineTo(cx - 10, cy - 34);
      ctx.lineTo(cx + 10, cy + 34);
      ctx.lineTo(cx + 24, cy);
      ctx.lineTo(cx + 48, cy);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy + 30);
      ctx.lineTo(cx - 12, cy + 4);
      ctx.lineTo(cx + 8, cy + 18);
      ctx.lineTo(cx + 40, cy - 28);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 18, cy - 28);
      ctx.lineTo(cx + 40, cy - 28);
      ctx.lineTo(cx + 40, cy - 6);
      ctx.stroke();
    }

    // Label below icon
    ctx.fillStyle = '#F5F7F2';
    ctx.font = '600 28px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.toUpperCase(), 128, 198);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAniso);
  texture.needsUpdate = true;
  return texture;
}

export const LifeHubCenterpiece: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredId, setHoveredId] = useState<LifeHubPillar['id'] | null>(null);
  const [selectedId, setSelectedId] = useState<LifeHubPillar['id'] | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const activeIdRef = useRef<LifeHubPillar['id'] | null>(null);
  const selectedIdRef = useRef<LifeHubPillar['id'] | null>(null);

  useEffect(() => {
    activeIdRef.current = selectedId ?? hoveredId;
    selectedIdRef.current = selectedId;
  }, [hoveredId, selectedId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const { supported, isSoftwareGl } = detectWebGLSupport();
    if (!supported) {
      setWebglFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches;
    let width = Math.max(260, mountEl.clientWidth);
    let height = Math.max(210, mountEl.clientHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060c09, 0.045);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0, 1.85, 6.1);
    camera.lookAt(0, 0.1, 0);

    // Studio reflection environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Warm/cool 3-point rig
    const hemiLight = new THREE.HemisphereLight(0xd8f5e0, 0x050b07, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf6f8f2, 2.1);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5ff62, 1.35);
    rimLight.position.set(-4.5, 3, -3.5);
    scene.add(rimLight);

    const hubPointLight = new THREE.PointLight(0x00ff78, 3.6, 8.5, 1.6);
    hubPointLight.position.set(0, 0.45, 0);
    scene.add(hubPointLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central luminous elliptical portal ring (horizontal oval via scale)
    const ringGroup = new THREE.Group();
    ringGroup.scale.set(1.28, 1, 0.78);
    rootGroup.add(ringGroup);

    const energyRingShader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBoost: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uBoost;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float angle = vUv.x * 6.2831853;
          float wave = 0.5 + 0.5 * sin(angle * 2.0 - uTime * 2.1);
          float highlight = smoothstep(0.55, 0.98, wave);
          vec3 baseGreen = vec3(0.0, 0.66, 0.35);
          vec3 brightLime = vec3(0.77, 1.0, 0.38);
          vec3 col = mix(baseGreen, brightLime, highlight + uBoost * 0.35);
          float fresnel = pow(1.0 - abs(vNormal.z), 1.4);
          col += brightLime * fresnel * 0.3;
          gl_FragColor = vec4(col, 0.96);
        }
      `,
      transparent: true,
    });

    const mainTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.068, 24, 96),
      energyRingShader
    );
    mainTorus.rotation.x = Math.PI / 2;
    ringGroup.add(mainTorus);

    const outerChromeRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.04, 0.014, 12, 96),
      new THREE.MeshStandardMaterial({
        color: 0x9ab8a4,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    outerChromeRing.rotation.x = Math.PI / 2;
    outerChromeRing.position.y = -0.06;
    ringGroup.add(outerChromeRing);

    // Core dark emerald disc inside the elliptical ring
    const centerDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.74, 0.08, 40),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b1f15,
        roughness: 0.25,
        metalness: 0.2,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
      })
    );
    centerDisc.position.y = -0.04;
    ringGroup.add(centerDisc);

    // 2. Five floating isometric 3D icon tiles orbiting the elliptical ring
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const tileShape = new THREE.Shape();
    const s = 0.34;
    const r = 0.07;
    tileShape.moveTo(-s + r, -s);
    tileShape.lineTo(s - r, -s);
    tileShape.quadraticCurveTo(s, -s, s, -s + r);
    tileShape.lineTo(s, s - r);
    tileShape.quadraticCurveTo(s, s, s - r, s);
    tileShape.lineTo(-s + r, s);
    tileShape.quadraticCurveTo(-s, s, -s, s - r);
    tileShape.lineTo(-s, -s + r);
    tileShape.quadraticCurveTo(-s, -s, -s + r, -s);

    const tileGeo = new THREE.ExtrudeGeometry(tileShape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.018,
    });
    tileGeo.center();

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x163826,
      metalness: 0.45,
      roughness: 0.3,
    });

    interface TileEntry {
      pillar: LifeHubPillar;
      group: THREE.Group;
      faceMat: THREE.MeshBasicMaterial;
      proxy: THREE.Mesh;
      baseAngle: number;
      phase: number;
    }

    const tiles: TileEntry[] = [];
    const proxyMeshes: THREE.Object3D[] = [];

    LIFE_HUB_PILLARS.forEach((pillar, idx) => {
      const baseAngle = (idx / LIFE_HUB_PILLARS.length) * Math.PI * 2 - Math.PI / 2;
      const tileGroup = new THREE.Group();
      rootGroup.add(tileGroup);

      const tileBody = new THREE.Mesh(tileGeo, sideMat);
      tileGroup.add(tileBody);

      const tex = createIconTileTexture(pillar.label, pillar.id, maxAniso);
      const faceMat = new THREE.MeshBasicMaterial({ map: tex });
      const facePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), faceMat);
      facePlane.position.z = 0.056;
      tileGroup.add(facePlane);

      const proxy = new THREE.Mesh(
        new THREE.BoxGeometry(0.84, 0.84, 0.24),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      proxy.layers.set(1);
      proxy.userData.pillarId = pillar.id;
      tileGroup.add(proxy);
      proxyMeshes.push(proxy);

      tiles.push({
        pillar,
        group: tileGroup,
        faceMat,
        proxy,
        baseAngle,
        phase: idx * 1.25,
      });
    });

    // 3. Floating isometric cubes & miniature torus accents (inspired by Image 2)
    const accentCubes: { mesh: THREE.Mesh; basePos: THREE.Vector3; phase: number }[] = [];
    const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff78,
      emissive: 0x00a85a,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.2,
    });
    const cubeCoords: [number, number, number][] = [
      [-2.55, 0.55, -0.4],
      [2.6, 0.65, 0.25],
      [0.15, 0.95, -1.55],
      [-1.7, -0.35, 1.35],
    ];
    cubeCoords.forEach(([x, y, z], idx) => {
      const m = new THREE.Mesh(cubeGeo, cubeMat);
      m.position.set(x, y, z);
      m.rotation.set(0.4 + idx * 0.3, 0.7, 0.2);
      rootGroup.add(m);
      accentCubes.push({ mesh: m, basePos: new THREE.Vector3(x, y, z), phase: idx * 1.4 });
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    _raycaster.layers.set(1);

    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerCurrentX = 0;
    let pointerCurrentY = 0;
    let lastRaycastTime = 0;
    let lastWidth = width;
    let lastHeight = height;

    const handlePointerMove = (event: PointerEvent) => {
      if (isTouchOnly) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerTargetX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerTargetY = THREE.MathUtils.clamp(ny, -1, 1);

      const now = performance.now();
      if (now - lastRaycastTime < 40) return;
      lastRaycastTime = now;

      _pointer.set(nx, ny);
      _raycaster.setFromCamera(_pointer, camera);
      const hits = _raycaster.intersectObjects(proxyMeshes, false);

      if (hits.length > 0) {
        const pid = hits[0].object.userData.pillarId as LifeHubPillar['id'];
        renderer.domElement.style.cursor = 'pointer';
        setHoveredId((prev) => (prev === pid ? prev : pid));
      } else {
        renderer.domElement.style.cursor = 'default';
        setHoveredId((prev) => (prev === null ? prev : null));
      }
    };

    const handlePointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
      renderer.domElement.style.cursor = 'default';
      setHoveredId(null);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      _pointer.set(nx, ny);
      _raycaster.setFromCamera(_pointer, camera);
      const hits = _raycaster.intersectObjects(proxyMeshes, false);

      if (hits.length > 0) {
        const pid = hits[0].object.userData.pillarId as LifeHubPillar['id'];
        setSelectedId((prev) => (prev === pid ? null : pid));
      } else if (selectedIdRef.current !== null) {
        setSelectedId(null);
      }
    };

    const handleResize = () => {
      if (!mountEl) return;
      const w = Math.max(260, mountEl.clientWidth);
      const h = Math.max(210, mountEl.clientHeight);
      if (w === lastWidth && h === lastHeight) return;
      lastWidth = w;
      lastHeight = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFailed(true);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    domEl.addEventListener('pointerleave', handlePointerLeave);
    domEl.addEventListener('pointerdown', handlePointerDown);
    domEl.addEventListener('webglcontextlost', handleContextLost);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountEl);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let lastProjectedId: LifeHubPillar['id'] | null = null;
    let lastProjX = -1;
    let lastProjY = -1;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      pointerCurrentX = THREE.MathUtils.damp(
        pointerCurrentX,
        pointerTargetX,
        4.5,
        delta
      );
      pointerCurrentY = THREE.MathUtils.damp(
        pointerCurrentY,
        pointerTargetY,
        4.5,
        delta
      );

      camera.position.set(
        pointerCurrentX * 0.32,
        1.85 + pointerCurrentY * 0.18,
        6.1
      );
      camera.lookAt(0, 0.12, 0);

      if (!reducedMotion) {
        energyRingShader.uniforms.uTime.value = elapsed;
      }
      const activeId = activeIdRef.current;
      energyRingShader.uniforms.uBoost.value = activeId ? 1 : 0;

      const orbitOffset = reducedMotion ? 0 : elapsed * 0.16;

      tiles.forEach((tile) => {
        const isActive = activeId === tile.pillar.id;
        const angle = tile.baseAngle + orbitOffset;
        const targetX = Math.cos(angle) * 2.22;
        const targetZ = Math.sin(angle) * 1.36;
        const floatY = reducedMotion
          ? 0.28
          : 0.28 + Math.sin(elapsed * 1.3 + tile.phase) * 0.08;
        const targetY = floatY + (isActive ? 0.2 : 0);

        tile.group.position.x = THREE.MathUtils.damp(
          tile.group.position.x,
          targetX,
          6,
          delta
        );
        tile.group.position.y = THREE.MathUtils.damp(
          tile.group.position.y,
          targetY,
          6,
          delta
        );
        tile.group.position.z = THREE.MathUtils.damp(
          tile.group.position.z,
          targetZ,
          6,
          delta
        );

        tile.group.lookAt(camera.position.x, camera.position.y, camera.position.z);
        const targetScale = isActive ? 1.14 : 1.0;
        const nextScale = THREE.MathUtils.damp(
          tile.group.scale.x,
          targetScale,
          7,
          delta
        );
        tile.group.scale.setScalar(nextScale);
      });

      accentCubes.forEach((item) => {
        if (!reducedMotion) {
          item.mesh.position.y =
            item.basePos.y + Math.sin(elapsed * 1.1 + item.phase) * 0.09;
          item.mesh.rotation.y = elapsed * 0.5 + item.phase;
        }
      });

      // Project tooltip coords
      if (activeId) {
        const activeTile = tiles.find((t) => t.pillar.id === activeId);
        if (activeTile) {
          activeTile.group.getWorldPosition(_projVec);
          _projVec.project(camera);
          const px = Math.round(((_projVec.x + 1) / 2) * lastWidth);
          const py = Math.round(((-_projVec.y + 1) / 2) * lastHeight);
          if (
            activeId !== lastProjectedId ||
            Math.abs(px - lastProjX) > 2 ||
            Math.abs(py - lastProjY) > 2
          ) {
            lastProjectedId = activeId;
            lastProjX = px;
            lastProjY = py;
            setTooltipPos({ x: px, y: py });
          }
        }
      } else if (lastProjectedId !== null) {
        lastProjectedId = null;
        setTooltipPos(null);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      animate();
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointermove', handlePointerMove);
      domEl.removeEventListener('pointerleave', handlePointerLeave);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('webglcontextlost', handleContextLost);

      disposeHierarchy(scene);
      tileGeo.dispose();
      cubeGeo.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (domEl.parentNode === mountEl) {
        mountEl.removeChild(domEl);
      }
    };
  }, [reducedMotion]);

  if (webglFailed) {
    return <LifeHubFallback />;
  }

  const activeId = selectedId ?? hoveredId;
  const activePillar =
    LIFE_HUB_PILLARS.find((p) => p.id === activeId) ?? null;

  return (
    <div
      className="relative w-full h-[230px] sm:h-[260px] lg:h-[280px] rounded-2xl bg-[#07110C] border border-[#1E3B2B] overflow-hidden select-none"
      aria-label="Interactive 3D TRCK MAIN elliptical life ring centerpiece"
    >
      <div ref={mountRef} className="w-full h-full" />

      {activePillar && tooltipPos && (
        <div
          role="status"
          style={{
            left: `clamp(12px, ${tooltipPos.x}px, calc(100% - 224px))`,
            top: `clamp(12px, ${tooltipPos.y - 16}px, calc(100% - 104px))`,
          }}
          className="pointer-events-auto absolute z-20 w-[212px] rounded-xl bg-[#0B1711] border border-[#C5FF62]/50 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-[#C5FF62]">
                {activePillar.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[#F5F7F2]/90">
                {activePillar.description}
              </p>
            </div>
            {selectedId && (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close pillar tooltip"
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[#A1B0A6] hover:text-[#F5F7F2] cursor-pointer shrink-0"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Accessible bottom quick-inspect strip */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-center">
        <div
          role="group"
          aria-label="Inspect life hub areas"
          className="flex flex-wrap items-center justify-center gap-1 rounded-xl bg-[#060E0A] border border-[#1E3B2B] p-1"
        >
          {LIFE_HUB_PILLARS.map((pillar) => {
            const isSelected = selectedId === pillar.id;
            const active = isSelected || hoveredId === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                aria-pressed={isSelected}
                onMouseEnter={() => setHoveredId(pillar.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(pillar.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() =>
                  setSelectedId((prev) =>
                    prev === pillar.id ? null : pillar.id
                  )
                }
                className={`min-h-[28px] px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#C5FF62] text-[#06100A]'
                    : 'text-[#A1B0A6] hover:text-[#F5F7F2]'
                }`}
              >
                {pillar.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
