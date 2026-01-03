import * as THREE from 'three';

/**
 * Generates Keystone terrain as a BROAD, gently-sloping mountain
 * NOT pointy cones - the reference shows wide, gradual terrain
 * 
 * Key characteristics from reference:
 * - Wide fan-shaped ski area spreading from summit
 * - Gentle gradients - this is a ski resort, not the Matterhorn
 * - Ridge lines define the mountain shape more than peaks
 * - Valley between mountain areas
 */
export class TerrainGenerator {
    constructor() {
        this.width = 2400;
        this.depth = 2000;
        this.segments = 300;

        this.baseElevation = 0;
        this.maxElevation = 280; // Lower max for gentler slopes
    }

    generate() {
        const geometry = new THREE.PlaneGeometry(
            this.width,
            this.depth,
            this.segments,
            this.segments
        );

        geometry.rotateX(-Math.PI / 2);
        this.generateHeightmap(geometry);
        geometry.computeVertexNormals();

        const material = this.createTerrainMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.name = 'terrain';

        return mesh;
    }

    generateHeightmap(geometry) {
        const positions = geometry.attributes.position.array;
        const vertexCount = positions.length / 3;

        for (let i = 0; i < vertexCount; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            let height = this.calculateHeight(x, z);
            positions[i * 3 + 1] = height;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    calculateHeight(x, z) {
        // Normalize coordinates to -1 to 1 range
        const nx = x / (this.width / 2);
        const nz = z / (this.depth / 2);

        let height = 0;

        // === MAIN MOUNTAIN MASS ===
        // Create a broad elevated plateau that represents the ski area
        // Using very wide, overlapping height contributions

        // Dercum Mountain area - center-left, wide and flat-topped
        const dercumX = -0.1;
        const dercumZ = -0.1;
        height += this.broadPlateau(nx, nz, dercumX, dercumZ, 0.6, 0.7, 220);

        // North Peak - behind and right of Dercum, slightly higher
        const northX = 0.15;
        const northZ = -0.35;
        height += this.broadPlateau(nx, nz, northX, northZ, 0.5, 0.6, 260);

        // The Outback - far right, connected to North Peak
        const outbackX = 0.5;
        const outbackZ = -0.4;
        height += this.broadPlateau(nx, nz, outbackX, outbackZ, 0.45, 0.55, 240);

        // === RIDGE CONNECTIONS ===
        // Wide ridges connecting the areas
        height += this.wideRidge(nx, nz, dercumX, dercumZ, northX, northZ, 180, 0.25);
        height += this.wideRidge(nx, nz, northX, northZ, outbackX, outbackZ, 160, 0.2);

        // === BOWL AREAS ===
        // Gentle depressions for the bowl terrain
        height -= this.gentleDepression(nx, nz, -0.55, -0.2, 0.25, 60);  // Independence
        height -= this.gentleDepression(nx, nz, 0.0, -0.55, 0.2, 50);    // Bergman
        height -= this.gentleDepression(nx, nz, 0.15, -0.6, 0.18, 45);   // Erickson
        height -= this.gentleDepression(nx, nz, 0.5, -0.6, 0.22, 55);    // North/South Bowl

        // === VALLEY / BASE AREA ===
        // Lower elevation at the front (base area)
        const baseFalloff = Math.max(0, (nz + 0.3) * 1.2);
        height *= Math.max(0.1, 1 - baseFalloff * baseFalloff * 0.7);

        // Flatten the base area for the village
        if (nz > 0.5) {
            const flatAmount = (nz - 0.5) / 0.5;
            height = height * (1 - flatAmount) + 15 * flatAmount;
        }

        // === NATURAL VARIATION ===
        height += this.terrainNoise(x, z);

        // Edge falloff
        const edgeDist = Math.max(Math.abs(nx), Math.abs(nz));
        if (edgeDist > 0.85) {
            const falloff = (edgeDist - 0.85) / 0.15;
            height *= 1 - falloff * 0.8;
        }

        return Math.max(0, height);
    }

    /**
     * Create a broad, flat-topped plateau (not a pointy cone)
     * This is key - ski mountains are NOT pointed
     */
    broadPlateau(x, z, cx, cz, radiusX, radiusZ, height) {
        const dx = (x - cx) / radiusX;
        const dz = (z - cz) / radiusZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Use cosine falloff for smooth, flat-topped shape
        if (dist > 1.5) return 0;

        // Flat top with gradual rolloff at edges
        if (dist < 0.3) {
            // Flat plateau top
            return height;
        } else {
            // Smooth cosine falloff from edge of plateau
            const t = (dist - 0.3) / 1.2;
            return height * Math.cos(t * Math.PI / 2) * Math.cos(t * Math.PI / 2);
        }
    }

    /**
     * Wide ridge connection between two points
     */
    wideRidge(x, z, x1, z1, x2, z2, height, width) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx * dx + dz * dz);

        if (length === 0) return 0;

        // Project point onto line
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (z - z1) * dz) / (length * length)));
        const projX = x1 + t * dx;
        const projZ = z1 + t * dz;

        const distToLine = Math.sqrt((x - projX) * (x - projX) + (z - projZ) * (z - projZ));

        if (distToLine > width * 1.5) return 0;

        // Smooth ridge profile
        const ridgeProfile = Math.cos(Math.min(1, distToLine / width) * Math.PI / 2);
        const alongRidge = Math.sin(t * Math.PI); // Highest in middle

        return height * ridgeProfile * ridgeProfile * alongRidge * 0.5;
    }

    /**
     * Gentle depression for bowl areas
     */
    gentleDepression(x, z, cx, cz, radius, depth) {
        const dx = (x - cx) / radius;
        const dz = (z - cz) / radius;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 1.5) return 0;

        // Bowl shape - deepest in center
        const bowl = Math.cos(dist * Math.PI / 3);
        return Math.max(0, depth * bowl * bowl * 0.6);
    }

    /**
     * Natural terrain variation
     */
    terrainNoise(x, z) {
        let n = 0;
        n += Math.sin(x * 0.006 + 1.3) * Math.cos(z * 0.006 + 0.7) * 8;
        n += Math.sin(x * 0.015 + 2.1) * Math.cos(z * 0.015 + 1.4) * 4;
        n += Math.sin(x * 0.04 + 0.5) * Math.cos(z * 0.04 + 2.8) * 2;
        return n;
    }

    getHeightAt(x, z) {
        return this.calculateHeight(x, z);
    }

    /**
     * Terrain material with snow and forest
     */
    createTerrainMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                snowColor: { value: new THREE.Color(0xfafafa) },
                snowShadow: { value: new THREE.Color(0xd8e8f5) },
                forestColor: { value: new THREE.Color(0x1a3828) },
                forestLight: { value: new THREE.Color(0x2a5040) },
                rockColor: { value: new THREE.Color(0x606878) },
                treeLine: { value: 200 },
                snowLine: { value: 140 },
                sunDirection: { value: new THREE.Vector3(0.3, 0.9, 0.3).normalize() }
            },
            vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying float vHeight;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vHeight = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 snowColor;
        uniform vec3 snowShadow;
        uniform vec3 forestColor;
        uniform vec3 forestLight;
        uniform vec3 rockColor;
        uniform float treeLine;
        uniform float snowLine;
        uniform vec3 sunDirection;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying float vHeight;
        
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        void main() {
          float slope = 1.0 - abs(vNormal.y);
          float diffuse = max(dot(vWorldNormal, sunDirection), 0.0);
          float light = 0.4 + diffuse * 0.6;
          
          float texNoise = noise(vPosition.xz * 0.08);
          float fineNoise = noise(vPosition.xz * 0.25);
          
          vec3 color;
          
          if (vHeight > treeLine) {
            // Above tree line - snow with rock on steep areas
            float rockAmt = smoothstep(0.4, 0.7, slope);
            vec3 snow = mix(snowColor, snowShadow, (1.0 - diffuse) * 0.5);
            color = mix(snow, rockColor, rockAmt);
          } else if (vHeight > snowLine) {
            // Transition - mixed snow and forest
            float t = (vHeight - snowLine) / (treeLine - snowLine);
            vec3 forest = mix(forestColor, forestLight, texNoise * 0.8);
            vec3 snow = mix(snowColor, snowShadow, (1.0 - diffuse) * 0.3);
            float snowAmt = t + (1.0 - slope) * 0.3;
            color = mix(forest, snow, clamp(snowAmt, 0.0, 1.0));
          } else {
            // Forest zone
            vec3 forest = mix(forestColor, forestLight, texNoise * 0.6 + fineNoise * 0.3);
            float snowPatch = (1.0 - slope) * 0.25 * step(0.65, noise(vPosition.xz * 0.03));
            color = mix(forest, snowColor, snowPatch);
          }
          
          color *= light;
          
          // Subtle atmospheric coloring
          if (diffuse < 0.25) {
            color *= vec3(0.92, 0.94, 1.0);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
            side: THREE.FrontSide
        });
    }
}
