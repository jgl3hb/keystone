import * as THREE from 'three';

/**
 * Dense forest coverage for the new terrain scale
 */
export class TreeGenerator {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.treeLineElevation = 200;
        this.minElevation = 20;
    }

    generate() {
        const group = new THREE.Group();
        group.name = 'trees';

        const positions = this.generateTreePositions();

        // Multiple tree colors for variety
        const treeConfigs = [
            { color: 0x1a382a, scale: 1.0 },
            { color: 0x1f4535, scale: 0.9 },
            { color: 0x153025, scale: 1.1 },
            { color: 0x224838, scale: 0.85 }
        ];

        const baseGeometry = this.createTreeGeometry();
        const treesPerType = Math.ceil(positions.length / treeConfigs.length);

        treeConfigs.forEach((config, idx) => {
            const material = new THREE.MeshStandardMaterial({
                color: config.color,
                roughness: 0.9,
                flatShading: true
            });

            const start = idx * treesPerType;
            const end = Math.min(start + treesPerType, positions.length);
            const count = end - start;

            if (count <= 0) return;

            const mesh = new THREE.InstancedMesh(baseGeometry, material, count);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const matrix = new THREE.Matrix4();

            for (let i = 0; i < count; i++) {
                const p = positions[start + i];
                const s = (0.5 + Math.random() * 0.6) * config.scale;
                const elevFactor = 1 - (p.y / this.treeLineElevation) * 0.3;

                matrix.makeRotationY(Math.random() * Math.PI * 2);
                matrix.scale(new THREE.Vector3(s * elevFactor, s * elevFactor * (0.8 + Math.random() * 0.4), s * elevFactor));
                matrix.setPosition(p.x, p.y, p.z);

                mesh.setMatrixAt(i, matrix);
            }

            mesh.instanceMatrix.needsUpdate = true;
            group.add(mesh);
        });

        console.log(`Generated ${positions.length} trees`);
        return group;
    }

    createTreeGeometry() {
        // Simple pine tree - 3 stacked cones
        const geo = new THREE.ConeGeometry(3, 10, 5);
        geo.translate(0, 7, 0);
        return geo;
    }

    generateTreePositions() {
        const positions = [];
        const spacing = 22;
        const jitter = 10;

        const halfW = this.terrain.width / 2;
        const halfD = this.terrain.depth / 2;

        const corridors = this.getRunCorridors();

        for (let x = -halfW + spacing; x < halfW - spacing; x += spacing) {
            for (let z = -halfD + spacing; z < halfD - spacing; z += spacing) {
                const treesHere = 1 + Math.floor(Math.random() * 2);

                for (let t = 0; t < treesHere; t++) {
                    const jx = x + (Math.random() - 0.5) * jitter * 2;
                    const jz = z + (Math.random() - 0.5) * jitter * 2;

                    const height = this.terrain.getHeightAt(jx, jz);

                    if (height > this.treeLineElevation || height < this.minElevation) continue;
                    if (this.isInCorridor(jx, jz, corridors)) continue;

                    const slope = this.getSlope(jx, jz);
                    if (slope > 0.6) continue;
                    if (slope > 0.35 && Math.random() < 0.5) continue;
                    if (height > this.treeLineElevation - 30 && Math.random() < 0.5) continue;

                    positions.push({ x: jx, y: height, z: jz });
                }
            }
        }

        return positions;
    }

    getRunCorridors() {
        return [
            // Dercum frontside
            { x: -140, z: 400, w: 200, d: 700 },
            { x: -300, z: 400, w: 120, d: 600 },
            { x: 20, z: 400, w: 150, d: 600 },

            // North Peak
            { x: 160, z: -100, w: 140, d: 400 },

            // Outback
            { x: 520, z: -150, w: 180, d: 500 },

            // Bowls
            { x: -580, z: -80, w: 200, d: 250 },
            { x: 40, z: -450, w: 180, d: 200 },
            { x: 200, z: -480, w: 160, d: 180 },
            { x: 560, z: -500, w: 200, d: 220 },

            // Base
            { x: -100, z: 850, w: 500, d: 250 }
        ];
    }

    isInCorridor(x, z, corridors) {
        for (const c of corridors) {
            if (x > c.x - c.w / 2 && x < c.x + c.w / 2 && z > c.z - c.d / 2 && z < c.z + c.d / 2) {
                return true;
            }
        }
        return false;
    }

    getSlope(x, z) {
        const d = 5;
        const h0 = this.terrain.getHeightAt(x, z);
        const h1 = this.terrain.getHeightAt(x + d, z);
        const h2 = this.terrain.getHeightAt(x, z + d);
        return Math.sqrt(Math.pow((h1 - h0) / d, 2) + Math.pow((h2 - h0) / d, 2));
    }
}
