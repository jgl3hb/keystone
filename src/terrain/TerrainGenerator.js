import * as THREE from 'three';

/**
 * Generates realistic Keystone terrain matching the classic trail map perspective.
 * Based on the 1991 James Niehues painting style.
 * 
 * Key features from reference:
 * - Dercum Mountain in foreground (left-center)
 * - North Peak behind (center-right)  
 * - The Outback further right/back
 * - River Run village at bottom
 * - Dense forest coverage with white ski runs cutting through
 */
export class TerrainGenerator {
    constructor() {
        // Larger terrain for more detail
        this.width = 2000;
        this.depth = 1600;
        this.segments = 400; // Higher resolution

        // Elevation scale (matching real 3,128 ft vertical)
        this.baseElevation = 0;
        this.maxElevation = 350;

        // Keystone's actual mountain layout from trail map perspective
        // Viewed from southeast looking northwest
        this.peaks = {
            // Dercum Mountain - main frontside, prominent in foreground
            dercumSummit: { x: -50, z: 50, height: 280, radius: 180 },
            dercumShoulder: { x: -150, z: 150, height: 240, radius: 120 },

            // North Peak - behind Dercum, highest point
            northPeakSummit: { x: 80, z: -150, height: 350, radius: 160 },
            northPeakRidge: { x: 0, z: -80, height: 300, radius: 140 },

            // The Outback - right side, behind North Peak
            outbackSummit: { x: 350, z: -280, height: 320, radius: 200 },
            outbackRidge: { x: 250, z: -180, height: 280, radius: 150 },

            // Independence Bowl area - far left
            independenceRidge: { x: -400, z: -100, height: 260, radius: 180 }
        };

        // Bowl depressions
        this.bowls = {
            independence: { x: -380, z: -50, depth: 100, radius: 140 },
            bergman: { x: -20, z: -350, depth: 90, radius: 120 },
            erickson: { x: 80, z: -380, depth: 80, radius: 110 },
            north: { x: 300, z: -400, depth: 95, radius: 130 },
            south: { x: 420, z: -350, depth: 85, radius: 120 }
        };

        this.heightmap = null;
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
        this.heightmap = new Float32Array(vertexCount);

        for (let i = 0; i < vertexCount; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            let height = this.calculateHeight(x, z);
            this.heightmap[i] = height;
            positions[i * 3 + 1] = height;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    calculateHeight(x, z) {
        let height = this.baseElevation;

        // Add mountain peaks
        for (const peak of Object.values(this.peaks)) {
            const dx = x - peak.x;
            const dz = z - peak.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            // Sharper peaks with exponential falloff
            const falloff = Math.exp(-(dist * dist) / (1.8 * peak.radius * peak.radius));
            height += peak.height * falloff;
        }

        // Add connecting ridges for realistic mountain shape
        height += this.calculateRidges(x, z);

        // Carve bowls
        for (const bowl of Object.values(this.bowls)) {
            const dx = x - bowl.x;
            const dz = z - bowl.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < bowl.radius * 1.8) {
                const falloff = Math.exp(-(dist * dist) / (2 * bowl.radius * bowl.radius));
                height -= bowl.depth * falloff * 0.7;
            }
        }

        // Add detailed noise for natural variation
        height += this.detailedNoise(x, z);

        // Valley floor at edges
        const edgeFalloff = this.calculateEdgeFalloff(x, z);
        height *= edgeFalloff;

        // Ensure base area is flat for village
        if (z > 600) {
            const flattenAmount = Math.min(1, (z - 600) / 150);
            height = height * (1 - flattenAmount) + 10 * flattenAmount;
        }

        return Math.max(0, height);
    }

    calculateRidges(x, z) {
        let ridgeHeight = 0;

        // Main ridge: Dercum to North Peak
        ridgeHeight += this.ridgeLine(x, z, -50, 50, 80, -150, 280, 60);

        // Ridge: North Peak to Outback
        ridgeHeight += this.ridgeLine(x, z, 80, -150, 350, -280, 260, 50);

        // Ridge: Dercum shoulder to Independence
        ridgeHeight += this.ridgeLine(x, z, -150, 150, -400, -100, 220, 55);

        // Ridge across North Peak area
        ridgeHeight += this.ridgeLine(x, z, 0, -80, 250, -180, 240, 45);

        // Bergman/Erickson ridge
        ridgeHeight += this.ridgeLine(x, z, -20, -350, 80, -380, 180, 40);

        return ridgeHeight;
    }

    ridgeLine(x, z, x1, z1, x2, z2, height, width) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx * dx + dz * dz);

        if (length === 0) return 0;

        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (z - z1) * dz) / (length * length)));
        const projX = x1 + t * dx;
        const projZ = z1 + t * dz;
        const distToLine = Math.sqrt((x - projX) * (x - projX) + (z - projZ) * (z - projZ));

        const falloff = Math.exp(-(distToLine * distToLine) / (2 * width * width));
        const endFalloff = Math.sin(t * Math.PI);

        return height * falloff * endFalloff * 0.35;
    }

    detailedNoise(x, z) {
        // Multi-octave noise for realistic terrain detail
        let n = 0;
        n += Math.sin(x * 0.008 + 1.3) * Math.cos(z * 0.008 + 0.7) * 12;
        n += Math.sin(x * 0.02 + 2.1) * Math.cos(z * 0.02 + 1.4) * 6;
        n += Math.sin(x * 0.05 + 0.5) * Math.cos(z * 0.05 + 2.8) * 3;
        n += Math.sin(x * 0.12 + 3.2) * Math.cos(z * 0.12 + 0.3) * 1.5;
        return n;
    }

    calculateEdgeFalloff(x, z) {
        const halfWidth = this.width / 2;
        const halfDepth = this.depth / 2;
        const margin = 150;

        let falloff = 1;

        // Back edge (where bowls are)
        if (z < -halfDepth + margin * 2) {
            const t = (z - (-halfDepth + margin * 2)) / (margin * 2);
            falloff *= 1 + t * 0.3; // Less falloff at back
        }

        // Side edges
        if (Math.abs(x) > halfWidth - margin) {
            const t = (Math.abs(x) - (halfWidth - margin)) / margin;
            falloff *= 1 - t * 0.6;
        }

        return Math.max(0.05, falloff);
    }

    getHeightAt(x, z) {
        return this.calculateHeight(x, z);
    }

    /**
     * Create realistic snow/forest terrain material matching trail map style
     */
    createTerrainMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                // Snow colors - bright white with subtle blue shadows
                snowColor: { value: new THREE.Color(0xffffff) },
                snowShadow: { value: new THREE.Color(0xd0e0f0) },

                // Forest colors - dark blue-green like the reference
                forestColor: { value: new THREE.Color(0x1a3d2e) },
                forestHighlight: { value: new THREE.Color(0x2d5a45) },

                // Rock color for steep cliffs
                rockColor: { value: new THREE.Color(0x5a5a6a) },

                // Elevation thresholds
                treeLine: { value: 260 },     // Above this = mostly snow
                snowMix: { value: 200 },      // Snow starts appearing

                // Sun direction for lighting
                sunDirection: { value: new THREE.Vector3(0.4, 0.8, 0.3).normalize() }
            },
            vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying float vHeight;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vHeight = position.y;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 snowColor;
        uniform vec3 snowShadow;
        uniform vec3 forestColor;
        uniform vec3 forestHighlight;
        uniform vec3 rockColor;
        uniform float treeLine;
        uniform float snowMix;
        uniform vec3 sunDirection;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        varying float vHeight;
        varying vec2 vUv;
        
        // Simple noise for texture variation
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
          // Calculate slope (steeper = more rock)
          float slope = 1.0 - abs(vNormal.y);
          
          // Lighting
          float diffuse = max(dot(vWorldNormal, sunDirection), 0.0);
          float ambient = 0.35;
          float light = ambient + diffuse * 0.65;
          
          // Add texture noise
          float texNoise = noise(vPosition.xz * 0.1) * 0.15;
          float fineNoise = noise(vPosition.xz * 0.4) * 0.08;
          
          vec3 color;
          
          // Above tree line - mostly snow with rock on steep areas
          if (vHeight > treeLine) {
            float rockAmount = smoothstep(0.5, 0.8, slope);
            vec3 snow = mix(snowColor, snowShadow, 1.0 - diffuse * 0.5);
            color = mix(snow, rockColor, rockAmount);
            color += texNoise * 0.3;
          }
          // Transition zone
          else if (vHeight > snowMix) {
            float t = (vHeight - snowMix) / (treeLine - snowMix);
            t = smoothstep(0.0, 1.0, t);
            
            // Forest with snow patches
            vec3 forest = mix(forestColor, forestHighlight, texNoise + fineNoise);
            vec3 snow = mix(snowColor, snowShadow, 1.0 - diffuse * 0.5);
            
            // More snow on gentle slopes, forest on steep
            float snowOnSlope = 1.0 - smoothstep(0.2, 0.5, slope);
            color = mix(forest, snow, t * snowOnSlope + slope * 0.2);
          }
          // Forest zone
          else {
            // Dense forest with variation
            vec3 forest = mix(forestColor, forestHighlight, texNoise + fineNoise * 2.0);
            
            // Snow patches on gentle slopes
            float snowPatch = smoothstep(0.3, 0.0, slope) * smoothstep(50.0, 150.0, vHeight);
            snowPatch *= (noise(vPosition.xz * 0.05) > 0.6 ? 1.0 : 0.0);
            
            vec3 snow = mix(snowColor, snowShadow, 0.3);
            color = mix(forest, snow, snowPatch * 0.4);
          }
          
          // Apply lighting
          color *= light;
          
          // Add subtle blue tint to shadows (like in the reference)
          if (diffuse < 0.3) {
            color = mix(color, color * vec3(0.9, 0.92, 1.05), 0.3);
          }
          
          // Slight warmth in lit areas
          if (diffuse > 0.5) {
            color = mix(color, color * vec3(1.02, 1.0, 0.98), 0.2);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
            side: THREE.FrontSide
        });
    }
}
