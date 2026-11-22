import * as THREE from 'three';
import { FLOATING_PANELS, FloatingPanelId } from '../data/lifeAreas';
import { FloatingPanelRef } from './buildFloatingPanels';

export interface TowerConnectionRef {
  panelId: FloatingPanelId;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  curve: THREE.QuadraticBezierCurve3;
}

export interface ConnectionsSystemRefs {
  group: THREE.Group;
  connections: TowerConnectionRef[];
  ascendingOrbs: THREE.InstancedMesh;
}

const _ringBase = new THREE.Vector3(0, -1.05, 0);
const _mid = new THREE.Vector3();
const _pt = new THREE.Vector3();
const _dummy = new THREE.Object3D();

const ORB_COUNT = 18;

export function buildConnections(
  panels: Record<FloatingPanelId, FloatingPanelRef>
): ConnectionsSystemRefs {
  const group = new THREE.Group();
  group.name = 'ENERGY_SPINE_AND_PATHS';

  const connections: TowerConnectionRef[] = [];

  FLOATING_PANELS.forEach((pData, idx) => {
    const panel = panels[pData.id];
    const angle = idx * 1.55 - 0.6;
    const start = new THREE.Vector3(
      Math.cos(angle) * 2.1,
      _ringBase.y,
      Math.sin(angle) * 1.4
    );
    const end = panel.basePosition.clone();
    _mid.copy(start).lerp(end, 0.5).add(new THREE.Vector3(0, 0.35, 0.25));

    const curve = new THREE.QuadraticBezierCurve3(start, _mid.clone(), end);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(22));
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff78,
      transparent: true,
      opacity: 0.22,
    });
    const line = new THREE.Line(geo, material);
    group.add(line);

    connections.push({
      panelId: pData.id,
      line,
      material,
      curve,
    });
  });

  // Ascending luminous energy orbs rising up the central tower axis on scroll
  const orbGeo = new THREE.SphereGeometry(0.036, 10, 10);
  const orbMat = new THREE.MeshBasicMaterial({
    color: 0xc5ff62,
    transparent: true,
    opacity: 0.85,
  });
  const ascendingOrbs = new THREE.InstancedMesh(orbGeo, orbMat, ORB_COUNT);
  ascendingOrbs.frustumCulled = false;
  group.add(ascendingOrbs);

  return { group, connections, ascendingOrbs };
}

export function updateConnections(
  refs: ConnectionsSystemRefs,
  panels: Record<FloatingPanelId, FloatingPanelRef>,
  elapsed: number,
  scrollProgress: number,
  activeId: FloatingPanelId | null,
  reducedMotion: boolean
): void {
  refs.connections.forEach((conn, idx) => {
    const panel = panels[conn.panelId];
    conn.curve.v2.copy(panel.group.position);

    const posAttr = conn.line.geometry.getAttribute(
      'position'
    ) as THREE.BufferAttribute;
    const count = posAttr.count;
    for (let i = 0; i < count; i++) {
      conn.curve.getPoint(i / (count - 1), _pt);
      posAttr.setXYZ(i, _pt.x, _pt.y, _pt.z);
    }
    posAttr.needsUpdate = true;

    const isHighlighted = activeId === conn.panelId;
    // Illuminate connections progressively as the mouse scrolls down
    const threshold = idx * 0.16;
    const scrollGlow = THREE.MathUtils.smoothstep(
      scrollProgress,
      threshold,
      threshold + 0.35
    );

    conn.material.color.setHex(isHighlighted ? 0xc5ff62 : 0x00ff78);
    conn.material.opacity = isHighlighted
      ? 0.88
      : 0.14 + scrollGlow * 0.48;
  });

  if (reducedMotion) {
    refs.ascendingOrbs.visible = false;
    return;
  }

  refs.ascendingOrbs.visible = true;
  const scrollBoost = 1 + scrollProgress * 1.4;

  for (let i = 0; i < ORB_COUNT; i++) {
    const phase = i / ORB_COUNT;
    const life = (elapsed * 0.24 * scrollBoost + phase + scrollProgress * 0.65) % 1;
    const radius = 0.28 + (1 - life) * 1.45 * (0.4 + scrollProgress * 0.6);
    const angle = phase * Math.PI * 6 + elapsed * 0.55 + scrollProgress * 2.2;
    const y = -1.15 + life * (3.6 + scrollProgress * 1.1);

    _dummy.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius * 0.72
    );
    const s = Math.sin(life * Math.PI) * (0.65 + scrollProgress * 0.55);
    _dummy.scale.setScalar(Math.max(0.01, s));
    _dummy.updateMatrix();
    refs.ascendingOrbs.setMatrixAt(i, _dummy.matrix);
  }
  refs.ascendingOrbs.instanceMatrix.needsUpdate = true;
}
