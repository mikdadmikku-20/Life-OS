import * as THREE from 'three';

export interface WorldMaterialLibrary {
  chromePin: THREE.MeshStandardMaterial;
  glassBottom: THREE.MeshPhysicalMaterial;
  glassMiddle: THREE.MeshPhysicalMaterial;
  glassTop: THREE.MeshPhysicalMaterial;
  cubeTopLime: THREE.MeshStandardMaterial;
  cubeMidGreen: THREE.MeshStandardMaterial;
  cubeBaseEmerald: THREE.MeshStandardMaterial;
  cloudSilver: THREE.MeshStandardMaterial;
  ringBody: THREE.MeshStandardMaterial;
  proxyHidden: THREE.MeshBasicMaterial;
  createPlateFaceMaterial: (
    edgeText: string,
    tint: 'dark' | 'emerald'
  ) => THREE.MeshStandardMaterial;
  createMedallionMaterial: () => THREE.MeshStandardMaterial;
  dispose: () => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function createWorldMaterials(
  maxAnisotropy: number
): WorldMaterialLibrary {
  const createdTextures: THREE.Texture[] = [];
  const createdMaterials: THREE.Material[] = [];
  const anisotropy = Math.min(8, Math.max(1, maxAnisotropy));

  const chromePin = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D4DCD6'),
    roughness: 0.14,
    metalness: 0.95,
  });

  const glassBottom = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#090C0A'),
    roughness: 0.12,
    metalness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.9,
  });

  const glassMiddle = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0B100D'),
    roughness: 0.08,
    metalness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.88,
  });

  const glassTop = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0F2115'),
    roughness: 0.16,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  const cubeTopLime = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6BFF95'),
    emissive: new THREE.Color('#00FF78'),
    emissiveIntensity: 1.15,
    roughness: 0.18,
    metalness: 0.15,
  });

  const cubeMidGreen = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#19E66E'),
    emissive: new THREE.Color('#00D864'),
    emissiveIntensity: 0.8,
    roughness: 0.22,
    metalness: 0.2,
  });

  const cubeBaseEmerald = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#067A40'),
    emissive: new THREE.Color('#00A85A'),
    emissiveIntensity: 0.45,
    roughness: 0.28,
    metalness: 0.25,
  });

  const cloudSilver = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#DCE3DE'),
    roughness: 0.35,
    metalness: 0.22,
    emissive: new THREE.Color('#7FA88E'),
    emissiveIntensity: 0.15,
  });

  const ringBody = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#042413'),
    emissive: new THREE.Color('#006B38'),
    emissiveIntensity: 0.72,
    roughness: 0.16,
    metalness: 0.62,
  });

  const proxyHidden = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const createPlateFaceMaterial = (
    edgeText: string,
    tint: 'dark' | 'emerald'
  ): THREE.MeshStandardMaterial => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      if (tint === 'emerald') {
        grad.addColorStop(0, 'rgba(18, 42, 26, 0.94)');
        grad.addColorStop(1, 'rgba(9, 18, 12, 0.94)');
      } else {
        grad.addColorStop(0, 'rgba(14, 18, 15, 0.92)');
        grad.addColorStop(1, 'rgba(7, 9, 8, 0.94)');
      }
      ctx.fillStyle = grad;
      drawRoundedRect(ctx, 6, 6, size - 12, size - 12, 42);
      ctx.fill();

      // Subtle glossy highlight corner
      const sheen = ctx.createRadialGradient(
        size * 0.8,
        size * 0.2,
        10,
        size * 0.8,
        size * 0.2,
        240
      );
      sheen.addColorStop(0, 'rgba(197, 255, 98, 0.08)');
      sheen.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheen;
      drawRoundedRect(ctx, 6, 6, size - 12, size - 12, 42);
      ctx.fill();

      // Subtle edge rim
      ctx.strokeStyle =
        tint === 'emerald'
          ? 'rgba(0, 255, 120, 0.28)'
          : 'rgba(245, 247, 242, 0.16)';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, 10, 10, size - 20, size - 20, 38);
      ctx.stroke();

      // Clean typography along front-left edge matching reference screenshot
      ctx.save();
      ctx.translate(40, size - 44);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = 'rgba(220, 232, 222, 0.82)';
      ctx.font = '500 20px Manrope, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(edgeText, 0, 0);
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
    createdTextures.push(tex);

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.16,
      metalness: 0.22,
      transparent: true,
      opacity: 0.94,
    });
    createdMaterials.push(mat);
    return mat;
  };

  const createMedallionMaterial = (): THREE.MeshStandardMaterial => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const grad = ctx.createRadialGradient(
        size * 0.35,
        size * 0.3,
        10,
        size / 2,
        size / 2,
        size * 0.5
      );
      grad.addColorStop(0, '#2A332D');
      grad.addColorStop(1, '#101411');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(197, 255, 98, 0.55)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#F5F7F2';
      ctx.font = '700 54px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TRCK', size / 2, size / 2 + 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.needsUpdate = true;
    createdTextures.push(tex);

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.2,
      metalness: 0.4,
      emissive: new THREE.Color('#00FF78'),
      emissiveMap: tex,
      emissiveIntensity: 0.28,
    });
    createdMaterials.push(mat);
    return mat;
  };

  return {
    chromePin,
    glassBottom,
    glassMiddle,
    glassTop,
    cubeTopLime,
    cubeMidGreen,
    cubeBaseEmerald,
    cloudSilver,
    ringBody,
    proxyHidden,
    createPlateFaceMaterial,
    createMedallionMaterial,
    dispose: () => {
      chromePin.dispose();
      glassBottom.dispose();
      glassMiddle.dispose();
      glassTop.dispose();
      cubeTopLime.dispose();
      cubeMidGreen.dispose();
      cubeBaseEmerald.dispose();
      cloudSilver.dispose();
      ringBody.dispose();
      proxyHidden.dispose();
      createdMaterials.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
    },
  };
}
