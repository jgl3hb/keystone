import * as THREE from 'three';

/**
 * Generates dense pine forest matching the trail map reference.
 * Trees should create dark green/blue-green masses with visible individual tree texture.
 */
export class TreeGenerator {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.treeLineElevation = 260;  // Above this, no trees
        this.minElevation = 15;        // Below base, no trees
    }

    generate() {
        const group = new THREE.Group();
        group.name = 'trees';

        // Generate tree positions
        const positions = this.generateTreePositions();

        // Create multiple tree types for variety
        const treeTypes = [
            this.createPineTree(0x1a3d2e, 1.0),   // Dark blue-green
            this.createPineTree(0x1f4a38, 0.9),   // Slightly lighter
            this.createPineTree(0x164030, 1.1),   // Darker, taller
            this.createPineTree(0x234d3a, 0.85),  // Medium
        ];

        // Create instanced meshes for each tree type
        const treesPerType = Math.ceil(positions.length / treeTypes.length);

        treeTypes.forEach((treeGeo, typeIndex) => {
            const material = new THREE.MeshStandardMaterial({
                color: treeGeo.color,
                roughness: 0.95,
                flatShading: true
            });

            const startIdx = typeIndex * treesPerType;
            const endIdx = Math.min(startIdx + treesPerType, positions.length);
            const count = endIdx - startIdx;

            if (count <= 0) return;

            const instancedMesh = new THREE.InstancedMesh(
                treeGeo.geometry,
                material,
                count
            );
            instancedMesh.castShadow = true;
            instancedMesh.receiveShadow = true;

            const matrix = new THREE.Matrix4();
            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();

            for (let i = 0; i < count; i++) {
                const p = positions[startIdx + i];
                position.set(p.x, p.y, p.z);

                // Random rotation
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);

                // Scale based on elevation (smaller trees higher up)
                const elevationFactor = 1.0 - (p.y / this.treeLineElevation) * 0.3;
                const baseScale = (0.6 + Math.random() * 0.5) * treeGeo.scaleFactor * elevationFactor;
                scale.set(baseScale, baseScale * (0.9 + Math.random() * 0.3), baseScale);

                matrix.compose(position, quaternion, scale);
                instancedMesh.setMatrixAt(i, matrix);
            }

            instancedMesh.instanceMatrix.needsUpdate = true;
            group.add(instancedMesh);
        });

        console.log(`Generated ${positions.length} trees`);
        return group;
    }

    /**
     * Create a more detailed pine tree geometry
     */
    createPineTree(color, scaleFactor) {
        // Multi-layer cone for fuller pine tree shape
        const geometry = new THREE.BufferGeometry();

        // Create 3 stacked cones for the foliage
        const cone1 = new THREE.ConeGeometry(3.5, 7, 6);
        const cone2 = new THREE.ConeGeometry(2.8, 5.5, 6);
        const cone3 = new THREE.ConeGeometry(2.0, 4, 6);

        // Position cones
        cone1.translate(0, 6, 0);
        cone2.translate(0, 10, 0);
        cone3.translate(0, 13, 0);

        // Merge geometries
        const mergedPositions = [];
        const mergedNormals = [];

        [cone1, cone2, cone3].forEach(cone => {
            const pos = cone.attributes.position.array;
            const norm = cone.attributes.normal.array;
            for (let i = 0; i < pos.length; i++) {
                mergedPositions.push(pos[i]);
            }
            for (let i = 0; i < norm.length; i++) {
                mergedNormals.push(norm[i]);
            }
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(mergedPositions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(mergedNormals, 3));

        return { geometry, color, scaleFactor };
    }

    /**
     * Generate dense tree positions avoiding ski runs
     */
    generateTreePositions() {
        const positions = [];
        const terrain = this.terrain;

        // Denser spacing for more realistic forest
        const baseSpacing = 18;
        const jitter = 8;

        const halfWidth = terrain.width / 2;
        const halfDepth = terrain.depth / 2;

        // Get ski run corridors
        const runCorridors = this.getRunCorridors();

        for (let x = -halfWidth + baseSpacing; x < halfWidth - baseSpacing; x += baseSpacing) {
            for (let z = -halfDepth + baseSpacing; z < halfDepth - baseSpacing; z += baseSpacing) {
                // Multiple trees per cell for density
                const treesInCell = 1 + Math.floor(Math.random() * 2);

                for (let t = 0; t < treesInCell; t++) {
                    const jx = x + (Math.random() - 0.5) * jitter * 2;
                    const jz = z + (Math.random() - 0.5) * jitter * 2;

                    const height = terrain.getHeightAt(jx, jz);

                    // Skip if above tree line or too low
                    if (height > this.treeLineElevation || height < this.minElevation) {
                        continue;
                    }

                    // Skip if in a ski run corridor
                    if (this.isInRunCorridor(jx, jz, runCorridors)) {
                        continue;
                    }

                    // Check slope - fewer trees on very steep terrain
                    const slope = this.estimateSlope(jx, jz);
                    if (slope > 0.7) {
                        continue;
                    }
                    if (slope > 0.4 && Math.random() < 0.5) {
                        continue;
                    }

                    // Density decreases near tree line
                    if (height > this.treeLineElevation - 40 && Math.random() < 0.4) {
                        continue;
                    }

                    positions.push({ x: jx, y: height, z: jz });
                }
            }
        }

        return positions;
    }

    /**
     * Ski run corridors where trees are cleared
     */
    getRunCorridors() {
        return [
            // Dercum frontside - main run swath
            { x: -80, z: 300, width: 150, depth: 500 },
            { x: -180, z: 300, width: 80, depth: 400 },
            { x: 0, z: 350, width: 100, depth: 350 },

            // North Peak runs
            { x: 70, z: -50, width: 100, depth: 250 },
            { x: 120, z: 0, width: 80, depth: 200 },

            // Outback runs
            { x: 320, z: -150, width: 120, depth: 300 },
            { x: 280, z: -100, width: 80, depth: 200 },

            // Bowl areas (natural tree-free zones)
            { x: -380, z: -50, width: 180, depth: 180 },
            { x: -20, z: -350, width: 150, depth: 120 },
            { x: 80, z: -380, width: 130, depth: 100 },
            { x: 320, z: -380, width: 180, depth: 150 },

            // Base area
            { x: -100, z: 650, width: 400, depth: 200 }
        ];
    }

    isInRunCorridor(x, z, corridors) {
        for (const c of corridors) {
            if (x > c.x - c.width / 2 && x < c.x + c.width / 2 &&
                z > c.z - c.depth / 2 && z < c.z + c.depth / 2) {
                return true;
            }
        }
        return false;
    }

    estimateSlope(x, z) {
        const delta = 4;
        const h0 = this.terrain.getHeightAt(x, z);
        const h1 = this.terrain.getHeightAt(x + delta, z);
        const h2 = this.terrain.getHeightAt(x, z + delta);

        const dx = (h1 - h0) / delta;
        const dz = (h2 - h0) / delta;

        return Math.sqrt(dx * dx + dz * dz);
    }
}
