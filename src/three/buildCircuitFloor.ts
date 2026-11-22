import * as THREE from 'three';
import { WorldMaterialLibrary } from './materials';

export interface CircuitFloorRefs {
  group: THREE.Group;
  traceMaterial: THREE.LineBasicMaterial;
  nodesInstanced: THREE.InstancedMesh;
}

export function buildCircuitFloor(
  materials: WorldMaterialLibrary,
  isCompact: boolean
): CircuitFloorRefs {
  const group = new THREE.Group();
  group.name = 'CIRCUIT_FLOOR_ENVIRONMENT';
  group.position.set(0, -1.35, -0.05);
  group.rotation.x = -Math.PI * 0.43;
  group.rotation.z = 0.06;

  // Matte deep-black base disc
  const floorGeo = new THREE.CircleGeometry(6.8, 56);
  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#050605'),
    roughness: 0.9,
    metalness: 0.2,
  });
  const floorPlane = new THREE.Mesh(floorGeo, floorMat);
  floorPlane.position.z = -0.06;
  group.add(floorPlane);

  // Fine perimeter rings around the portal ring
  const traceMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff78,
    transparent: true,
    opacity: 0.34,
  });

  [2.78, 3.25, 3.9].forEach((radius, idx) => {
    const pts: THREE.Vector3[] = [];
    const segs = 80;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * radius * 1.24,
          Math.sin(a) * radius,
          0
        )
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat =
      idx === 0
        ? traceMaterial
        : new THREE.LineBasicMaterial({
            color: 0x1a3021,
            transparent: true,
            opacity: 0.48,
          });
    group.add(new THREE.Line(geo, mat));
  });

  // Radial PCB circuit traces radiating outward with small glowing green dots
  const traceCount = isCompact ? 22 : 44;
  const linePositions: number[] = [];
  const terminalCoords: THREE.Vector3[] = [];

  for (let i = 0; i < traceCount; i++) {
    const angle = (i / traceCount) * Math.PI * 2 + (i % 2) * 0.035;
    const rStart = 2.75 + (i % 3) * 0.12;
    const rMid = rStart + 0.42 + (i % 3) * 0.22;
    const rEnd = rMid + 0.38 + (i % 4) * 0.24;

    const x0 = Math.cos(angle) * rStart * 1.24;
    const y0 = Math.sin(angle) * rStart;

    const bendAngle = angle + (i % 2 === 0 ? 0.06 : -0.06);
    const x1 = Math.cos(angle) * rMid * 1.24;
    const y1 = Math.sin(angle) * rMid;

    const x2 = Math.cos(bendAngle) * rEnd * 1.24;
    const y2 = Math.sin(bendAngle) * rEnd;

    linePositions.push(x0, y0, 0.01, x1, y1, 0.01);
    linePositions.push(x1, y1, 0.01, x2, y2, 0.01);
    terminalCoords.push(new THREE.Vector3(x2, y2, 0.02));
  }

  const tracesGeo = new THREE.BufferGeometry();
  tracesGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linePositions, 3)
  );
  group.add(new THREE.LineSegments(tracesGeo, traceMaterial));

  // Front-center chrome metallic conduit extending forward from the ring (signature detail from reference)
  const frontConduitGeo = new THREE.CylinderGeometry(0.032, 0.044, 3.2, 12);
  const frontConduit = new THREE.Mesh(frontConduitGeo, materials.chromePin);
  frontConduit.position.set(0, -3.55, 0.04);
  group.add(frontConduit);

  // Instanced terminal green dots at circuit endpoints
  const dotGeo = new THREE.SphereGeometry(0.038, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const nodesInstanced = new THREE.InstancedMesh(
    dotGeo,
    dotMat,
    terminalCoords.length
  );

  const dummy = new THREE.Object3D();
  const cLime = new THREE.Color('#C5FF62');
  const cGreen = new THREE.Color('#00FF78');

  terminalCoords.forEach((pos, idx) => {
    dummy.position.copy(pos);
    dummy.scale.setScalar(idx % 3 === 0 ? 1.4 : 0.9);
    dummy.updateMatrix();
    nodesInstanced.setMatrixAt(idx, dummy.matrix);
    nodesInstanced.setColorAt(idx, idx % 3 === 0 ? cLime : cGreen);
  });
  nodesInstanced.instanceMatrix.needsUpdate = true;
  if (nodesInstanced.instanceColor) {
    nodesInstanced.instanceColor.needsUpdate = true;
  }
  nodesInstanced.computeBoundingSphere();
  group.add(nodesInstanced);

  return {
    group,
    traceMaterial,
    nodesInstanced,
  };
}
