import * as THREE from 'three';

/**
 * Generates the Keystone ski resort terrain with three peaks,
 * ridge lines, and bowl depressions based on real elevation data.
 * 
 * Elevations (in scene units, scaled from real feet):
 * - Base: 0 (represents 9,280 ft)
 * - Summit: 313 (represents 12,408 ft)
 * - Scale: 1 unit = ~10 feet
 */
export class TerrainGenerator {
    constructor() {
        // Terrain dimensions
        this.width = 1600;
        this.depth = 1200;
        this.segments = 256;

        // Elevation scale (1 unit = 10 feet)
        this.baseElevation = 0;      // 9,280 ft
        this.maxElevation = 313;     // 12,408 ft (3,128 ft vertical)

        // Peak positions (relative to center)
        this.peaks = {
            dercum: { x: -100, z: 100, height: 280, radius: 200 },
            northPeak: { x: 100, z: -100, height: 313, radius: 180 },
            outback: { x: 350, z: -200, height: 290, radius: 220 }
        };

        // Bowl positions
        this.bowls = {
            independence: { x: -350, z: -100, depth: 80, radius: 120 },
            bergman: { x: -50, z: -280, depth: 70, radius: 100 },
            erickson: { x: 50, z: -320, depth: 60, radius: 90 },
            north: { x: 280, z: -350, depth: 75, radius: 110 },
            south: { x: 380, z: -280, depth: 65, radius: 100 }
        };

        // Heightmap for run/lift placement queries
        this.heightmap = null;
    }

    /**
     * Generate the terrain mesh
     */
    generate() {
        const geometry = new THREE.PlaneGeometry(
            this.width,
            this.depth,
            this.segments,
            this.segments
        );

        // Rotate to horizontal
        geometry.rotateX(-Math.PI / 2);

        // Generate heightmap and apply to geometry
        this.generateHeightmap(geometry);

        // Compute normals for proper lighting
        geometry.computeVertexNormals();

        // Create terrain material
        const material = this.createTerrainMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.name = 'terrain';

        return mesh;
    }

    /**
     * Generate heightmap and apply to geometry vertices
     */
    generateHeightmap(geometry) {
        const positions = geometry.attributes.position.array;
        const vertexCount = positions.length / 3;

        // Create heightmap array for later queries
        this.heightmap = new Float32Array(vertexCount);

        for (let i = 0; i < vertexCount; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            // Calculate height at this point
            let height = this.calculateHeight(x, z);

            // Store in heightmap
            this.heightmap[i] = height;

            // Apply to geometry
            positions[i * 3 + 1] = height;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    /**
     * Calculate terrain height at a given x, z position
     */
    calculateHeight(x, z) {
        let height = this.baseElevation;

        // Add peaks using Gaussian falloff
        for (const peak of Object.values(this.peaks)) {
            const dx = x - peak.x;
            const dz = z - peak.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const falloff = Math.exp(-(dist * dist) / (2 * peak.radius * peak.radius));
            height += peak.height * falloff;
        }

        // Add ridge lines between peaks
        height += this.calculateRidges(x, z);

        // Subtract bowl depressions
        for (const bowl of Object.values(this.bowls)) {
            const dx = x - bowl.x;
            const dz = z - bowl.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < bowl.radius * 1.5) {
                const falloff = Math.exp(-(dist * dist) / (2 * bowl.radius * bowl.radius));
                height -= bowl.depth * falloff * 0.6;
            }
        }

        // Add Perlin-like noise for natural variation
        height += this.noise(x, z) * 15;

        // Ensure minimum height at edges (valley floor)
        const edgeFalloff = this.calculateEdgeFalloff(x, z);
        height *= edgeFalloff;

        return Math.max(0, height);
    }

    /**
     * Calculate ridge lines connecting the three peaks
     */
    calculateRidges(x, z) {
        let ridgeHeight = 0;

        // Ridge from Dercum to North Peak
        ridgeHeight += this.ridgeLine(
            x, z,
            this.peaks.dercum.x, this.peaks.dercum.z,
            this.peaks.northPeak.x, this.peaks.northPeak.z,
            200, 40
        );

        // Ridge from North Peak to Outback
        ridgeHeight += this.ridgeLine(
            x, z,
            this.peaks.northPeak.x, this.peaks.northPeak.z,
            this.peaks.outback.x, this.peaks.outback.z,
            180, 35
        );

        // Ridge from Dercum towards Independence Bowl area
        ridgeHeight += this.ridgeLine(
            x, z,
            this.peaks.dercum.x, this.peaks.dercum.z,
            -300, 0,
            150, 30
        );

        return ridgeHeight;
    }

    /**
     * Calculate height contribution from a ridge line between two points
     */
    ridgeLine(x, z, x1, z1, x2, z2, height, width) {
        // Project point onto line segment
        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx * dx + dz * dz);

        if (length === 0) return 0;

        const t = Math.max(0, Math.min(1,
            ((x - x1) * dx + (z - z1) * dz) / (length * length)
        ));

        const projX = x1 + t * dx;
        const projZ = z1 + t * dz;

        // Distance from point to line
        const distToLine = Math.sqrt(
            (x - projX) * (x - projX) + (z - projZ) * (z - projZ)
        );

        // Gaussian falloff from ridge line
        const falloff = Math.exp(-(distToLine * distToLine) / (2 * width * width));

        // Height decreases towards endpoints
        const endFalloff = Math.sin(t * Math.PI);

        return height * falloff * endFalloff * 0.4;
    }

    /**
     * Simple noise function for terrain variation
     */
    noise(x, z) {
        const scale1 = 0.01;
        const scale2 = 0.03;
        const scale3 = 0.08;

        // Layer multiple frequencies
        let n = 0;
        n += Math.sin(x * scale1 + 1.3) * Math.cos(z * scale1 + 0.7) * 1.0;
        n += Math.sin(x * scale2 + 2.1) * Math.cos(z * scale2 + 1.4) * 0.5;
        n += Math.sin(x * scale3 + 0.5) * Math.cos(z * scale3 + 2.8) * 0.25;

        return n;
    }

    /**
     * Calculate edge falloff to create valley floor at borders
     */
    calculateEdgeFalloff(x, z) {
        const halfWidth = this.width / 2;
        const halfDepth = this.depth / 2;
        const margin = 100;

        let falloff = 1;

        // Front edge (base area)
        if (z > halfDepth - margin) {
            const t = (z - (halfDepth - margin)) / margin;
            falloff *= 1 - t * 0.7;
        }

        // Side edges
        if (Math.abs(x) > halfWidth - margin) {
            const t = (Math.abs(x) - (halfWidth - margin)) / margin;
            falloff *= 1 - t * 0.5;
        }

        return Math.max(0.1, falloff);
    }

    /**
     * Get height at any x, z position (for placing objects)
     */
    getHeightAt(x, z) {
        return this.calculateHeight(x, z);
    }

    /**
     * Create the terrain shader material with snow/forest blending
     */
    createTerrainMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: {
                snowColor: { value: new THREE.Color(0xffffff) },
                forestColor: { value: new THREE.Color(0x2d4a2d) },
                rockColor: { value: new THREE.Color(0x6b6b6b) },
                treeLine: { value: 220 },  // ~11,500 ft
                snowLine: { value: 180 },  // ~11,000 ft
            },
            vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vHeight;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vHeight = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 snowColor;
        uniform vec3 forestColor;
        uniform vec3 rockColor;
        uniform float treeLine;
        uniform float snowLine;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vHeight;
        
        void main() {
          // Calculate slope (steeper = more rock)
          float slope = 1.0 - abs(vNormal.y);
          
          // Base color based on elevation
          vec3 color;
          
          if (vHeight > treeLine) {
            // Above tree line: mostly snow with some rock on steep areas
            color = mix(snowColor, rockColor, smoothstep(0.4, 0.7, slope));
          } else if (vHeight > snowLine) {
            // Transition zone
            float t = (vHeight - snowLine) / (treeLine - snowLine);
            vec3 groundColor = mix(forestColor, snowColor, slope * 0.5);
            color = mix(groundColor, snowColor, t);
          } else {
            // Below snow line: forest with snow patches
            float snowAmount = smoothstep(0.0, 0.3, slope) * 0.3;
            color = mix(forestColor, snowColor, snowAmount + vHeight / snowLine * 0.4);
          }
          
          // Add simple lighting
          vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
          float diffuse = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.4;
          
          color *= ambient + diffuse * 0.6;
          
          // Add slight blue tint to shadowed snow areas
          if (vHeight > snowLine && diffuse < 0.3) {
            color = mix(color, vec3(0.8, 0.85, 1.0), 0.2);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
            side: THREE.DoubleSide
        });
    }
}
