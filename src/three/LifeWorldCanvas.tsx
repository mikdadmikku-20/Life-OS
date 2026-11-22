import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { X } from 'lucide-react';
import {
  FLOATING_PANELS,
  FloatingPanelData,
  FloatingPanelId,
} from '../data/lifeAreas';
import { createWorldMaterials } from './materials';
import { buildEnergyRing } from './buildEnergyRing';
import { buildCircuitFloor } from './buildCircuitFloor';
import { buildFloatingPanels } from './buildFloatingPanels';
import { buildConnections, updateConnections } from './buildConnections';
import { detectWebGLSupport, disposeHierarchy } from './webglUtils';
import { LifeWorldFallback } from '../components/LifeWorldFallback';

interface LifeWorldCanvasProps {
  /** Normalized scroll progress [0..1] across the Hero + Connected-Life stage */
  scrollProgressRef: React.MutableRefObject<number>;
}

interface ProjectedTooltip {
  panel: FloatingPanelData;
  x: number;
  y: number;
}

const _raycaster = new THREE.Raycaster();
const _pointer = new THREE.Vector2();
const _projVec = new THREE.Vector3();

export const LifeWorldCanvas: React.FC<LifeWorldCanvasProps> = ({
  scrollProgressRef,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [webglFailed, setWebglFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredId, setHoveredId] = useState<FloatingPanelId | null>(null);
  const [selectedId, setSelectedId] = useState<FloatingPanelId | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const activeIdRef = useRef<FloatingPanelId | null>(null);
  const selectedIdRef = useRef<FloatingPanelId | null>(null);

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
    const containerEl = containerRef.current;
    if (!mountEl || !containerEl) return;

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
    const width = Math.max(300, mountEl.clientWidth);
    const height = Math.max(320, mountEl.clientHeight);
    const isNarrow = width < 640;
    const isCompact = width < 960;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isNarrow ? 1.5 : 2)
    );
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050605, 0.038);

    const camera = new THREE.PerspectiveCamera(
      isNarrow ? 45 : 38,
      width / height,
      0.1,
      60
    );
    const baseCamZ = isNarrow ? 8.8 : 7.4;
    camera.position.set(0.35, 1.45, baseCamZ);
    camera.lookAt(0, 0.25, 0);

    // Studio environment map for crisp dark-glass & chrome reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3-point studio lighting + ring PointLight
    const hemiLight = new THREE.HemisphereLight(0xd7e8da, 0x050605, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf5f7f2, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc5ff62, 1.15);
    rimLight.position.set(-5, 3, -4.5);
    scene.add(rimLight);

    const worldRoot = new THREE.Group();
    scene.add(worldRoot);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const materials = createWorldMaterials(maxAniso);

    // 1. Background circuit floor & front chrome conduit
    const circuitFloor = buildCircuitFloor(materials, isCompact);
    worldRoot.add(circuitFloor.group);

    // 2. Elliptical glowing portal ring + electric wing beams + scroll pulse wave
    const energyRing = buildEnergyRing(materials);
    worldRoot.add(energyRing.group);

    // 3. Three-tier stacked isometric glass tower + TRCK medallion
    const panels = buildFloatingPanels(materials, isCompact);
    const proxyMeshes: THREE.Object3D[] = [];
    Object.values(panels).forEach((panel) => {
      worldRoot.add(panel.group);
      proxyMeshes.push(panel.proxyMesh);
    });

    // 4. Energy spine paths & ascending orbs
    const connections = buildConnections(panels);
    worldRoot.add(connections.group);

    // 5. Sparse atmospheric emerald dust particles
    const particleCount = reducedMotion ? 0 : isNarrow ? 16 : 36;
    let particles: THREE.Points | null = null;
    if (particleCount > 0) {
      const pGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const rad = 2.0 + (i % 5) * 0.65;
        positions[i * 3] = Math.cos(angle) * rad;
        positions[i * 3 + 1] = -0.7 + (((i * 7) % 11) / 11) * 3.8;
        positions[i * 3 + 2] = Math.sin(angle) * rad * 0.72;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00ff78,
        size: 0.035,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
      });
      particles = new THREE.Points(pGeo, pMat);
      worldRoot.add(particles);
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    _raycaster.layers.set(1);

    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerCurrentX = 0;
    let pointerCurrentY = 0;
    let scrollCurrent = 0;
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
      if (now - lastRaycastTime < 35) return;
      lastRaycastTime = now;

      _pointer.set(nx, ny);
      _raycaster.setFromCamera(_pointer, camera);
      const hits = _raycaster.intersectObjects(proxyMeshes, false);

      if (hits.length > 0) {
        const panelId = hits[0].object.userData.panelId as FloatingPanelId;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredId((prev) => (prev === panelId ? prev : panelId));
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
        const panelId = hits[0].object.userData.panelId as FloatingPanelId;
        setSelectedId((prev) => (prev === panelId ? null : panelId));
      } else if (selectedIdRef.current !== null) {
        setSelectedId(null);
      }
    };

    const handleResize = () => {
      if (!mountEl) return;
      const w = Math.max(300, mountEl.clientWidth);
      const h = Math.max(320, mountEl.clientHeight);
      if (w === lastWidth && h === lastHeight) return;
      lastWidth = w;
      lastHeight = h;
      const narrow = w < 640;
      camera.fov = narrow ? 45 : 38;
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
    let lastProjectedId: FloatingPanelId | null = null;
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
        4.2,
        delta
      );
      pointerCurrentY = THREE.MathUtils.damp(
        pointerCurrentY,
        pointerTargetY,
        4.2,
        delta
      );

      const targetScroll = scrollProgressRef.current;
      scrollCurrent = THREE.MathUtils.damp(scrollCurrent, targetScroll, 4.8, delta);

      // Scroll-driven 3D cinematic choreography
      const explodePhase = THREE.MathUtils.smoothstep(scrollCurrent, 0.04, 0.72);
      const orbitPhase = THREE.MathUtils.smoothstep(scrollCurrent, 0.12, 0.85);
      const recedePhase = THREE.MathUtils.smoothstep(scrollCurrent, 0.82, 1.0);

      const camBaseZ = lastWidth < 640 ? 8.8 : 7.4;
      const pxScale = lastWidth < 1024 ? 0.18 : 0.36;

      // Camera glides smoothly into elevated 3/4 orbit on scroll down
      camera.position.set(
        0.35 + orbitPhase * 0.95 + pointerCurrentX * pxScale,
        1.45 + explodePhase * 0.85 - recedePhase * 0.25 + pointerCurrentY * (pxScale * 0.6),
        camBaseZ - explodePhase * 0.9 + recedePhase * 1.4
      );
      camera.lookAt(orbitPhase * 0.12, 0.25 + explodePhase * 0.35, 0);

      // Slower background circuit parallax
      circuitFloor.group.position.x = -pointerCurrentX * 0.08;
      circuitFloor.group.position.z = -0.05 - pointerCurrentY * 0.05;
      circuitFloor.traceMaterial.opacity = 0.32 + explodePhase * 0.24;

      // Portal energy ring rotation, shader sweep & shockwave pulse
      energyRing.group.rotation.y =
        pointerCurrentX * 0.08 + orbitPhase * 0.42;
      energyRing.group.rotation.x = -pointerCurrentY * 0.04;
      energyRing.ringLight.intensity = 4.2 + explodePhase * 1.8;

      if (!reducedMotion) {
        energyRing.energyArcShader.uniforms.uTime.value = elapsed;
        energyRing.floorGlowShader.uniforms.uTime.value = elapsed;
      }
      energyRing.energyArcShader.uniforms.uScrollBoost.value =
        (activeIdRef.current ? 0.35 : 0) + explodePhase * 0.55;
      energyRing.floorGlowShader.uniforms.uScrollBoost.value = explodePhase;
      energyRing.pulseWaveShader.uniforms.uScroll.value = scrollCurrent;

      // Three-tier stacked isometric glass tower: cinematic floating + scroll explosion
      const activeId = activeIdRef.current;
      Object.values(panels).forEach((panel, idx) => {
        const isActive = activeId === panel.data.id;
        const depthMul = 0.85 + idx * 0.18;

        const floatY = reducedMotion
          ? 0
          : Math.sin(elapsed * 1.05 + panel.data.phase) * 0.075;
        const floatX = reducedMotion
          ? 0
          : Math.cos(elapsed * 0.72 + panel.data.phase) * 0.025;

        const targetX =
          panel.basePosition.x +
          floatX +
          pointerCurrentX * 0.14 * depthMul +
          panel.data.scrollOffsetXZ[0] * explodePhase;
        const targetY =
          panel.basePosition.y +
          floatY +
          pointerCurrentY * 0.08 * depthMul +
          panel.data.scrollLiftY * explodePhase +
          (isActive ? 0.14 : 0);
        const targetZ =
          panel.basePosition.z +
          panel.data.scrollOffsetXZ[1] * explodePhase +
          (isActive ? 0.12 : 0);

        panel.group.position.x = THREE.MathUtils.damp(
          panel.group.position.x,
          targetX,
          6,
          delta
        );
        panel.group.position.y = THREE.MathUtils.damp(
          panel.group.position.y,
          targetY,
          6,
          delta
        );
        panel.group.position.z = THREE.MathUtils.damp(
          panel.group.position.z,
          targetZ,
          6,
          delta
        );

        const rotWave = reducedMotion
          ? 0
          : Math.sin(elapsed * 0.55 + panel.data.phase) * 0.025;

        panel.tiltGroup.rotation.x = THREE.MathUtils.damp(
          panel.tiltGroup.rotation.x,
          panel.baseRotation.x - pointerCurrentY * 0.04 + (isActive ? 0.05 : 0),
          6,
          delta
        );
        panel.tiltGroup.rotation.y = THREE.MathUtils.damp(
          panel.tiltGroup.rotation.y,
          panel.baseRotation.y +
            pointerCurrentX * 0.06 +
            orbitPhase * 0.16 +
            rotWave,
          6,
          delta
        );

        panel.edgeMaterial.color.setHex(
          isActive
            ? 0xc5ff62
            : panel.data.id === 'tier-top'
              ? 0x00ff78
              : 0x5c6e60
        );
        panel.edgeMaterial.opacity = THREE.MathUtils.damp(
          panel.edgeMaterial.opacity,
          isActive ? 0.95 : 0.45 + explodePhase * 0.2,
          8,
          delta
        );
        panel.cubeTopMaterial.emissiveIntensity = THREE.MathUtils.damp(
          panel.cubeTopMaterial.emissiveIntensity,
          isActive ? 1.8 : 1.15 + explodePhase * 0.35,
          8,
          delta
        );
      });

      if (particles && !reducedMotion) {
        particles.rotation.y = elapsed * 0.03 + orbitPhase * 0.3;
      }

      updateConnections(
        connections,
        panels,
        elapsed,
        scrollCurrent,
        activeId,
        reducedMotion
      );

      // Project active panel/node position to 2D tooltip coordinates
      if (activeId && panels[activeId]) {
        panels[activeId].group.getWorldPosition(_projVec);
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
      materials.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (domEl.parentNode === mountEl) {
        mountEl.removeChild(domEl);
      }
    };
  }, [reducedMotion, scrollProgressRef]);

  if (webglFailed) {
    return <LifeWorldFallback reason="no-webgl" />;
  }

  const activeId = selectedId ?? hoveredId;
  const activePanel = FLOATING_PANELS.find((p) => p.id === activeId) ?? null;

  const projectedTooltip: ProjectedTooltip | null =
    activePanel && tooltipPos
      ? {
          panel: activePanel,
          x: tooltipPos.x,
          y: tooltipPos.y,
        }
      : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[520px] lg:h-[calc(100vh-88px)] lg:min-h-[580px] lg:max-h-[780px] rounded-[28px] overflow-hidden select-none"
      aria-label="Interactive 3D TRCK MAIN stacked glass tower and glowing ring"
    >
      {/* Subtle ambient background vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_62%,rgba(0,255,120,0.075),transparent_65%)]"
      />

      {/* Isolated WebGL mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Projected Panel Tooltip */}
      {projectedTooltip && (
        <div
          role="status"
          style={{
            left: `clamp(16px, ${projectedTooltip.x}px, calc(100% - 268px))`,
            top: `clamp(16px, ${projectedTooltip.y - 22}px, calc(100% - 148px))`,
          }}
          className="pointer-events-auto absolute z-20 w-[252px] rounded-2xl bg-[#111411] border border-[rgba(197,255,98,0.45)] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="flex items-start justify-between gap-2.5">
            <div>
              <p className="text-xs font-semibold text-[#C5FF62]">
                {projectedTooltip.panel.name}
              </p>
              <p className="mt-1 text-xs leading-[1.5] text-[#F5F7F2]/90">
                {projectedTooltip.panel.description}
              </p>
            </div>
            {selectedId && (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Dismiss tier details"
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[#A1A69E] hover:text-[#F5F7F2] hover:bg-[#191D19] transition-colors cursor-pointer shrink-0"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Accessible bottom tier selector strip */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center">
        <div
          role="group"
          aria-label="Inspect 3D tower tiers"
          className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-[#0A0D0A]/95 border border-[#30372F]/85 p-1.5"
        >
          {FLOATING_PANELS.map((panel) => {
            const isSelected = selectedId === panel.id;
            const isHovered = hoveredId === panel.id;
            const active = isSelected || isHovered;
            return (
              <button
                key={panel.id}
                type="button"
                aria-pressed={isSelected}
                onMouseEnter={() => setHoveredId(panel.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(panel.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() =>
                  setSelectedId((prev) => (prev === panel.id ? null : panel.id))
                }
                className={`min-h-[34px] px-3 py-1 rounded-xl text-[11px] sm:text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#191D19] text-[#C5FF62] border border-[rgba(197,255,98,0.45)]'
                    : 'text-[#A1A69E] hover:text-[#F5F7F2] border border-transparent'
                }`}
              >
                {panel.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
