import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { detectWebGLSupport, disposeHierarchy } from './webglUtils';

const NETWORK_POINTS: [number, number, number][] = [
  [0, 0, 0],
  [-1.45, 0.72, 0.25],
  [1.4, 0.65, -0.25],
  [-1.1, -0.78, -0.3],
  [1.2, -0.74, 0.35],
  [0.12, 1.25, -0.35],
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 5],
  [2, 5],
  [1, 3],
  [2, 4],
];

export const VisionNetworkCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const { supported, isSoftwareGl } = detectWebGLSupport();
    if (!supported) {
      setFallback(true);
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
      setFallback(true);
      return;
    }

    const width = Math.max(240, mountEl.clientWidth);
    const height = Math.max(220, mountEl.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 30);
    camera.position.set(0, 0.2, 4.7);

    const ambient = new THREE.HemisphereLight(0xd5e4d7, 0x050605, 0.9);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xf5f7f2, 1.5);
    key.position.set(3, 4, 4);
    scene.add(key);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Simplified restrained orbital ring motif
    const orbitRingGeo = new THREE.TorusGeometry(1.15, 0.022, 12, 72);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0x00ff78,
      emissive: 0x00a85a,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.45,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.set(Math.PI * 0.36, 0.15, 0);
    networkGroup.add(orbitRing);

    const centerGeo = new THREE.OctahedronGeometry(0.28, 0);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xc5ff62,
      emissive: 0xc5ff62,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.35,
    });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    networkGroup.add(centerMesh);

    const nodeGeo = new THREE.IcosahedronGeometry(0.15, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x191d19,
      roughness: 0.32,
      metalness: 0.72,
    });

    NETWORK_POINTS.slice(1).forEach((pos) => {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.set(...pos);
      networkGroup.add(mesh);
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00ff78,
      transparent: true,
      opacity: 0.35,
    });
    NETWORK_EDGES.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...NETWORK_POINTS[a]),
        new THREE.Vector3(...NETWORK_POINTS[b]),
      ]);
      networkGroup.add(new THREE.Line(geo, lineMat));
    });

    const handleResize = () => {
      if (!mountEl) return;
      const w = Math.max(240, mountEl.clientWidth);
      const h = Math.max(220, mountEl.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(mountEl);

    let isVisible = true;
    const visObs = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    visObs.observe(mountEl);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 90);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 90);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 90);
        }
      };
      frameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (disposed) return;
      const t = clock.getElapsedTime();
      if (isVisible) {
        if (!reducedMotion) {
          networkGroup.rotation.y = t * 0.14;
          networkGroup.rotation.x = Math.sin(t * 0.25) * 0.1;
          centerMesh.rotation.y = -t * 0.35;
        }
        renderer.render(scene, camera);
      }

      if (reducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else if (isSoftwareGl) {
      tick();
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObs.disconnect();
      visObs.disconnect();
      disposeHierarchy(scene);
      renderer.dispose();
      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallback) {
    return (
      <div className="w-full h-[260px] flex items-center justify-center">
        <svg
          viewBox="0 0 320 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-full max-w-[300px] h-auto"
        >
          <ellipse
            cx="160"
            cy="130"
            rx="92"
            ry="44"
            stroke="rgba(0,255,120,0.32)"
            strokeWidth="1.5"
          />
          <line x1="160" y1="130" x2="82" y2="78" stroke="rgba(0,255,120,0.35)" />
          <line x1="160" y1="130" x2="238" y2="82" stroke="rgba(0,255,120,0.35)" />
          <line x1="160" y1="130" x2="96" y2="188" stroke="rgba(0,255,120,0.35)" />
          <line x1="160" y1="130" x2="226" y2="182" stroke="rgba(0,255,120,0.35)" />
          <circle cx="82" cy="78" r="10" fill="#191D19" stroke="#30372F" />
          <circle cx="238" cy="82" r="10" fill="#191D19" stroke="#30372F" />
          <circle cx="96" cy="188" r="10" fill="#191D19" stroke="#30372F" />
          <circle cx="226" cy="182" r="10" fill="#191D19" stroke="#30372F" />
          <circle cx="160" cy="130" r="18" fill="#111411" stroke="#C5FF62" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-[260px] sm:h-[290px]"
      aria-label="Restrained 3D geometric network representing a connected personal system"
    />
  );
};
