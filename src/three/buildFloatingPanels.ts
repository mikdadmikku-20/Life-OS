import * as THREE from 'three';
import {
  FLOATING_PANELS,
  FloatingPanelData,
  FloatingPanelId,
} from '../data/lifeAreas';
import { WorldMaterialLibrary } from './materials';

export interface FloatingPanelRef {
  data: FloatingPanelData;
  group: THREE.Group;
  tiltGroup: THREE.Group;
  edgeMaterial: THREE.LineBasicMaterial;
  cubeTopMaterial: THREE.MeshStandardMaterial;
  proxyMesh: THREE.Mesh;
  basePosition: THREE.Vector3;
  baseRotation: THREE.Euler;
}

function createRoundedSquareShape(size: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const h = size / 2;
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);
  return shape;
}

function createCubeStack(
  layers: number,
  materials: WorldMaterialLibrary,
  topMat: THREE.MeshStandardMaterial
): THREE.Group {
  const stack = new THREE.Group();
  const w = 0.24;
  const h = 0.068;
  const d = 0.24;
  const gap = 0.095;

  const boxGeo = new THREE.BoxGeometry(w, h, d);
  for (let i = 0; i < layers; i++) {
    const mat =
      i === layers - 1
        ? topMat
        : i === 0
          ? materials.cubeBaseEmerald
          : materials.cubeMidGreen;
    const slab = new THREE.Mesh(boxGeo, mat);
    slab.position.y = 0.055 + i * gap;
    stack.add(slab);
  }
  return stack;
}

function createSilverCloudHub(materials: WorldMaterialLibrary): THREE.Group {
  const cloud = new THREE.Group();
  const puffs: [number, number, number, number][] = [
    [0, 0.04, 0, 0.14],
    [-0.12, 0.0, 0.02, 0.105],
    [0.12, 0.0, 0.02, 0.105],
    [-0.06, 0.08, -0.02, 0.095],
    [0.06, 0.07, -0.02, 0.095],
  ];
  puffs.forEach(([x, y, z, r]) => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(r, 16, 16),
      materials.cloudSilver
    );
    sphere.position.set(x, y, z);
    cloud.add(sphere);
  });
  return cloud;
}

export function buildFloatingPanels(
  materials: WorldMaterialLibrary,
  isCompact: boolean
): Record<FloatingPanelId, FloatingPanelRef> {
  const result = {} as Record<FloatingPanelId, FloatingPanelRef>;

  const plateSize = isCompact ? 1.65 : 2.02;
  const cornerR = 0.22;

  const slabShape = createRoundedSquareShape(plateSize, cornerR);
  const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  });
  slabGeo.center();
  slabGeo.rotateX(-Math.PI / 2);

  const faceGeo = new THREE.PlaneGeometry(plateSize * 0.96, plateSize * 0.96);
  faceGeo.rotateX(-Math.PI / 2);

  const borderPts = slabShape
    .getPoints(44)
    .map((p) => new THREE.Vector3(p.x, 0, -p.y));
  const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPts);

  const proxyGeo = new THREE.BoxGeometry(plateSize * 1.15, 0.72, plateSize * 1.15);

  // Isometric plate tilt matching the uploaded screenshot
  const isometricTilt = new THREE.Euler(0.32, Math.PI * 0.24, -0.06);

  FLOATING_PANELS.forEach((panelData) => {
    const group = new THREE.Group();
    group.name = `TOWER_${panelData.id.toUpperCase()}`;

    const yScale = isCompact ? 0.86 : 1.0;

    // Special floating TRCK / AI chrome-pinned medallion above the top plate
    if (panelData.id === 'core-orb') {
      const basePosition = new THREE.Vector3(-0.32, panelData.baseY * yScale, 0.35);
      const baseRotation = new THREE.Euler(0.18, 0.08, 0);
      group.position.copy(basePosition);

      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.copy(baseRotation);
      group.add(tiltGroup);

      // Chrome pin stem descending toward top glass plate
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.014, 0.92, 12),
        materials.chromePin
      );
      stem.position.set(0, -0.48, 0);
      stem.rotation.z = -0.22;
      tiltGroup.add(stem);

      // Circular dark-glass medallion disc
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.045, 36),
        materials.createMedallionMaterial()
      );
      disc.rotation.x = Math.PI / 2;
      tiltGroup.add(disc);

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xc5ff62,
        transparent: true,
        opacity: 0.65,
      });
      const ringPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(a) * 0.31, Math.sin(a) * 0.31, 0.025));
      }
      tiltGroup.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(ringPts),
          edgeMaterial
        )
      );

      const cubeTopMaterial = materials.cubeTopLime.clone();
      const proxyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 10, 10),
        materials.proxyHidden
      );
      proxyMesh.layers.set(1);
      proxyMesh.userData.panelId = panelData.id;
      tiltGroup.add(proxyMesh);

      result[panelData.id] = {
        data: panelData,
        group,
        tiltGroup,
        edgeMaterial,
        cubeTopMaterial,
        proxyMesh,
        basePosition,
        baseRotation,
      };
      return;
    }

    const basePosition = new THREE.Vector3(
      panelData.id === 'tier-top' ? 0.14 : panelData.id === 'tier-mid' ? 0.0 : -0.1,
      panelData.baseY * yScale,
      panelData.id === 'tier-top' ? -0.15 : panelData.id === 'tier-mid' ? 0.0 : 0.12
    );
    const baseRotation = isometricTilt.clone();

    group.position.copy(basePosition);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.copy(baseRotation);
    group.add(tiltGroup);

    // 1. Glossy dark rounded-square glass plate
    const glassMat =
      panelData.id === 'tier-top'
        ? materials.glassTop
        : panelData.id === 'tier-mid'
          ? materials.glassMiddle
          : materials.glassBottom;
    const slabMesh = new THREE.Mesh(slabGeo, glassMat);
    tiltGroup.add(slabMesh);

    // 2. Crisp edge-titled face overlay
    const faceMat = materials.createPlateFaceMaterial(
      panelData.edgeTitle,
      panelData.id === 'tier-top' ? 'emerald' : 'dark'
    );
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.y = 0.04;
    tiltGroup.add(faceMesh);

    // 3. Subtle luminous border
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: panelData.id === 'tier-top' ? 0x00ff78 : 0x5c6e60,
      transparent: true,
      opacity: panelData.id === 'tier-top' ? 0.55 : 0.42,
    });
    const borderLoop = new THREE.LineLoop(borderGeo, edgeMaterial);
    borderLoop.position.y = 0.043;
    tiltGroup.add(borderLoop);

    // 4. Chrome vertical central support rod connecting tiers
    const pinMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.95, 14),
      materials.chromePin
    );
    pinMesh.position.set(0, -0.5, 0);
    tiltGroup.add(pinMesh);

    // 5. Glowing neon-green isometric cube stacks on each plate
    const cubeTopMaterial = materials.cubeTopLime.clone();

    if (panelData.id === 'tier-bot') {
      // Bottom tier: 2x2 grid of 2-layer glowing green stacks
      const grid: [number, number][] = [
        [0.14, -0.18],
        [0.52, -0.18],
        [0.14, 0.22],
        [0.52, 0.22],
      ];
      grid.forEach(([cx, cz]) => {
        const stack = createCubeStack(2, materials, cubeTopMaterial);
        stack.position.set(cx, 0.03, cz);
        tiltGroup.add(stack);
      });
    } else if (panelData.id === 'tier-mid') {
      // Middle tier: 2 glowing 2-layer stacks
      const coords: [number, number][] = [
        [0.2, 0.05],
        [0.54, 0.05],
      ];
      coords.forEach(([cx, cz]) => {
        const stack = createCubeStack(2, materials, cubeTopMaterial);
        stack.position.set(cx, 0.03, cz);
        tiltGroup.add(stack);
      });
    } else if (panelData.id === 'tier-top') {
      // Top tier: 4 three-layer glowing green stacks + branching lines up to silver synthesis cloud
      const cols = [-0.15, 0.16, 0.47, 0.78];
      const hubPos = new THREE.Vector3(0.32, 0.68, -0.15);
      const branchPoints: THREE.Vector3[] = [];

      cols.forEach((cx) => {
        const stack = createCubeStack(3, materials, cubeTopMaterial);
        stack.position.set(cx, 0.03, 0.22);
        tiltGroup.add(stack);

        // Crisp branch line from top of stack to hub
        const topY = 0.34;
        branchPoints.push(
          new THREE.Vector3(cx, topY, 0.22),
          new THREE.Vector3(cx, topY + 0.16, 0.04),
          new THREE.Vector3(cx, topY + 0.16, 0.04),
          hubPos
        );
      });

      const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPoints);
      const branchMat = new THREE.LineBasicMaterial({
        color: 0x00ff78,
        transparent: true,
        opacity: 0.6,
      });
      tiltGroup.add(new THREE.LineSegments(branchGeo, branchMat));

      const cloudHub = createSilverCloudHub(materials);
      cloudHub.position.copy(hubPos);
      tiltGroup.add(cloudHub);
    }

    // 6. Layer-1 proxy mesh for responsive pointer & touch raycasting
    const proxyMesh = new THREE.Mesh(proxyGeo, materials.proxyHidden);
    proxyMesh.position.y = 0.22;
    proxyMesh.layers.set(1);
    proxyMesh.userData.panelId = panelData.id;
    tiltGroup.add(proxyMesh);

    result[panelData.id] = {
      data: panelData,
      group,
      tiltGroup,
      edgeMaterial,
      cubeTopMaterial,
      proxyMesh,
      basePosition,
      baseRotation,
    };
  });

  return result;
}
