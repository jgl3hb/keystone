import * as THREE from 'three';

/**
 * Generates pine trees across the terrain using instanced meshes for performance
 */
export class TreeGenerator {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.treeLineElevation = 220; // ~11,500 ft - above this, no trees
        this.minElevation = 20;       // Below base area
    }

    /**
     * Generate all trees as instanced meshes
     */
    generate() {
        const group = new THREE.Group();
        group.name = 'trees';

        // Create tree geometry (simple cone + cylinder)
        const treeGeometry = this.createTreeGeometry();

        // Create material
        const treeMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a4a1a,
            roughness: 0.9,
            flatShading: true
        });

        // Generate tree positions
        const positions = this.generateTreePositions();

        // Create instanced mesh
        const instancedMesh = new THREE.InstancedMesh(
            treeGeometry,
            treeMaterial,
            positions.length
        );
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;

        // Position each tree
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        for (let i = 0; i < positions.length; i++) {
            const p = positions[i];
            position.set(p.x, p.y, p.z);

            // Random rotation around Y
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);

            // Random scale variation
            const s = 0.7 + Math.random() * 0.6;
            scale.set(s, s * (0.8 + Math.random() * 0.4), s);

            matrix.compose(position, quaternion, scale);
            instancedMesh.setMatrixAt(i, matrix);
        }

        instancedMesh.instanceMatrix.needsUpdate = true;
        group.add(instancedMesh);

        return group;
    }

    /**
     * Create a simple pine tree geometry
     */
    createTreeGeometry() {
        const group = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 6);
        trunkGeometry.translate(0, 2, 0);

        // Foliage layers (3 cones stacked)
        const foliage1 = new THREE.ConeGeometry(4, 8, 6);
        foliage1.translate(0, 10, 0);

        const foliage2 = new THREE.ConeGeometry(3.5, 6, 6);
        foliage2.translate(0, 14, 0);

        const foliage3 = new THREE.ConeGeometry(2.5, 5, 6);
        foliage3.translate(0, 17, 0);

        // Merge geometries
        const mergedGeometry = new THREE.BufferGeometry();

        // For simplicity, just use one cone for the tree
        const treeGeometry = new THREE.ConeGeometry(3, 12, 6);
        treeGeometry.translate(0, 8, 0);

        return treeGeometry;
    }

    /**
     * Generate positions for trees across the terrain
     */
    generateTreePositions() {
        const positions = [];
        const terrain = this.terrain;

        // Grid-based placement with jitter
        const spacing = 25;
        const jitter = 10;

        const halfWidth = terrain.width / 2;
        const halfDepth = terrain.depth / 2;

        // Define ski run corridors to avoid (simplified boxes)
        const runCorridors = this.getRunCorridors();

        for (let x = -halfWidth + spacing; x < halfWidth - spacing; x += spacing) {
            for (let z = -halfDepth + spacing; z < halfDepth - spacing; z += spacing) {
                // Add random jitter
                const jx = x + (Math.random() - 0.5) * jitter * 2;
                const jz = z + (Math.random() - 0.5) * jitter * 2;

                // Get terrain height
                const height = terrain.getHeightAt(jx, jz);

                // Skip if above tree line or too low
                if (height > this.treeLineElevation || height < this.minElevation) {
                    continue;
                }

                // Skip if in a ski run corridor
                if (this.isInRunCorridor(jx, jz, runCorridors)) {
                    continue;
                }

                // Skip if on steep slope (probability based)
                const slope = this.estimateSlope(jx, jz);
                if (slope > 0.6 && Math.random() < 0.7) {
                    continue;
                }

                // Add tree with some random culling for variety
                if (Math.random() > 0.15) {
                    positions.push({ x: jx, y: height, z: jz });
                }
            }
        }

        console.log(`Generated ${positions.length} trees`);
        return positions;
    }

    /**
     * Define corridors where ski runs are (no trees)
     */
    getRunCorridors() {
        // Simplified run corridors based on main run areas
        return [
            // Dercum frontside main corridors
            { x: -100, z: 200, width: 80, depth: 400 },
            { x: -60, z: 300, width: 60, depth: 300 },
            { x: -150, z: 250, width: 50, depth: 250 },

            // North Peak corridors
            { x: 90, z: 0, width: 60, depth: 200 },
            { x: 60, z: 50, width: 50, depth: 150 },

            // Outback corridors
            { x: 340, z: -100, width: 80, depth: 200 },
            { x: 300, z: -50, width: 60, depth: 150 },

            // Bowl areas (sparse trees)
            { x: -350, z: -100, width: 100, depth: 100 },
            { x: -30, z: -250, width: 80, depth: 100 },
            { x: 60, z: -280, width: 70, depth: 100 },
            { x: 300, z: -300, width: 100, depth: 150 }
        ];
    }

    /**
     * Check if a point is in a ski run corridor
     */
    isInRunCorridor(x, z, corridors) {
        for (const c of corridors) {
            if (x > c.x - c.width / 2 && x < c.x + c.width / 2 &&
                z > c.z - c.depth / 2 && z < c.z + c.depth / 2) {
                return true;
            }
        }
        return false;
    }

    /**
     * Estimate slope at a point (for tree placement)
     */
    estimateSlope(x, z) {
        const delta = 5;
        const h0 = this.terrain.getHeightAt(x, z);
        const h1 = this.terrain.getHeightAt(x + delta, z);
        const h2 = this.terrain.getHeightAt(x, z + delta);

        const dx = (h1 - h0) / delta;
        const dz = (h2 - h0) / delta;

        return Math.sqrt(dx * dx + dz * dz);
    }
}
