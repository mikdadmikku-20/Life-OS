import * as THREE from 'three';
import { WorldMaterialLibrary } from './materials';

export interface EnergyRingRefs {
  group: THREE.Group;
  ellipseGroup: THREE.Group;
  energyArcShader: THREE.ShaderMaterial;
  floorGlowShader: THREE.ShaderMaterial;
  pulseWaveShader: THREE.ShaderMaterial;
  ringLight: THREE.PointLight;
}

export function buildEnergyRing(
  materials: WorldMaterialLibrary
): EnergyRingRefs {
  const group = new THREE.Group();
  group.name = 'PORTAL_ENERGY_RING';
  group.position.set(0, -1.05, 0);

  // Oblique elliptical perspective container matching uploaded reference
  const ellipseGroup = new THREE.Group();
  ellipseGroup.scale.set(1.24, 1.0, 0.94);
  ellipseGroup.rotation.x = -Math.PI * 0.43;
  ellipseGroup.rotation.z = 0.06;
  group.add(ellipseGroup);

  // 1. Thick reflective dark-emerald torus body
  const torusGeo = new THREE.TorusGeometry(2.38, 0.23, 30, 128);
  const ringMesh = new THREE.Mesh(torusGeo, materials.ringBody);
  ellipseGroup.add(ringMesh);

  // 2. White-hot / neon-lime / emerald crescent energy arc wrapping the torus
  const arcGeo = new THREE.TorusGeometry(2.38, 0.252, 26, 128);
  const energyArcShader = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollBoost: { value: 0 },
      uColorWhiteLime: { value: new THREE.Color('#EEFFCC') },
      uColorLime: { value: new THREE.Color('#C5FF62') },
      uColorEnergy: { value: new THREE.Color('#00FF78') },
      uColorEmerald: { value: new THREE.Color('#00A85A') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uScrollBoost;
      uniform vec3 uColorWhiteLime;
      uniform vec3 uColorLime;
      uniform vec3 uColorEnergy;
      uniform vec3 uColorEmerald;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      void main() {
        float angle = vUv.x * 6.2831853;
        float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vViewPos)));
        rim = pow(rim, 1.4);

        // Dominant bright left/lower crescent arc matching reference image + animated sweep
        float primaryArc = 0.5 + 0.5 * sin(angle + 2.35 - uTime * 0.35);
        primaryArc = pow(primaryArc, 2.6);

        float secondaryArc = 0.5 + 0.5 * sin(angle * 2.0 - uTime * 0.7);
        secondaryArc = pow(secondaryArc, 5.5) * 0.65;

        float intensity = clamp(primaryArc + secondaryArc + uScrollBoost * 0.35, 0.0, 1.35);

        vec3 col = mix(uColorEmerald, uColorEnergy, smoothstep(0.1, 0.6, intensity));
        col = mix(col, uColorLime, smoothstep(0.55, 0.92, intensity));
        col = mix(col, uColorWhiteLime, smoothstep(0.88, 1.25, intensity) * (0.45 + 0.55 * rim));

        float alpha = clamp(0.24 + rim * 0.36 + intensity * 0.72, 0.0, 0.98);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const energyArcMesh = new THREE.Mesh(arcGeo, energyArcShader);
  ellipseGroup.add(energyArcMesh);

  // 3. Soft emerald floor glow + horizontal electric lightning wing streaks
  const floorGlowGeo = new THREE.PlaneGeometry(12.2, 8.4);
  const floorGlowShader = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollBoost: { value: 0 },
      uColorLime: { value: new THREE.Color('#C5FF62') },
      uColorEnergy: { value: new THREE.Color('#00FF78') },
      uColorEmerald: { value: new THREE.Color('#00A85A') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uScrollBoost;
      uniform vec3 uColorLime;
      uniform vec3 uColorEnergy;
      uniform vec3 uColorEmerald;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(vec2(p.x * 1.06, p.y * 1.38));

        // Emerald portal glow beneath the ring
        float ringGlow = exp(-pow((r - 0.50) * 4.2, 2.0));
        float innerGlow = exp(-r * r * 3.2) * 0.34;

        // Horizontal electric energy wing filaments shooting left & right from ring sides
        float bandY = exp(-pow((p.y + 0.02) * 14.0, 2.0));
        float bandSpread = smoothstep(0.35, 0.58, abs(p.x)) * (1.0 - smoothstep(0.76, 1.0, abs(p.x)));
        float filamentNoise = noise(vec2(abs(p.x) * 14.0 - uTime * 2.8, p.y * 28.0));
        float filament = smoothstep(0.45, 0.88, filamentNoise);
        float wingEnergy = bandY * bandSpread * (0.45 + 0.95 * filament) * (1.0 + uScrollBoost * 0.65);

        vec3 col = mix(uColorEmerald, uColorEnergy, ringGlow * 0.8 + innerGlow);
        col = mix(col, uColorLime, clamp(wingEnergy * 1.15, 0.0, 1.0));

        float alpha = ringGlow * 0.52 + innerGlow * 0.45 + wingEnergy * 0.68;
        alpha *= (1.0 - smoothstep(0.72, 1.0, length(p)));

        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.92));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const floorGlowMesh = new THREE.Mesh(floorGlowGeo, floorGlowShader);
  floorGlowMesh.rotation.x = -Math.PI * 0.44;
  floorGlowMesh.position.set(0, -0.34, -0.05);
  group.add(floorGlowMesh);

  // 4. Scroll-triggered expanding 3D pulse shockwave ring across the floor
  const pulseWaveGeo = new THREE.PlaneGeometry(11.0, 8.2);
  const pulseWaveShader = new THREE.ShaderMaterial({
    uniforms: {
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color('#C5FF62') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uScroll;
      uniform vec3 uColor;
      varying vec2 vUv;

      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(vec2(p.x * 1.05, p.y * 1.35));
        float waveRadius = 0.42 + fract(uScroll * 2.0) * 0.52;
        float ring = exp(-pow((r - waveRadius) * 28.0, 2.0));
        float visibility = smoothstep(0.02, 0.14, uScroll) * (1.0 - smoothstep(0.85, 1.0, uScroll));
        float alpha = ring * visibility * (1.0 - fract(uScroll * 2.0)) * 0.55;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pulseWaveMesh = new THREE.Mesh(pulseWaveGeo, pulseWaveShader);
  pulseWaveMesh.rotation.x = -Math.PI * 0.44;
  pulseWaveMesh.position.set(0, -0.32, -0.04);
  group.add(pulseWaveMesh);

  // 5. Central glowing emerald PointLight illuminating the underside of the 3 glass tiers
  const ringLight = new THREE.PointLight(0x00ff78, 4.2, 12, 1.35);
  ringLight.position.set(0, 0.3, 0.25);
  group.add(ringLight);

  return {
    group,
    ellipseGroup,
    energyArcShader,
    floorGlowShader,
    pulseWaveShader,
    ringLight,
  };
}
