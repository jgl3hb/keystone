import * as THREE from 'three';
import { RUNS, getAllRuns, DIFFICULTY_COLORS, DIFFICULTY } from './RunData.js';

/**
 * Renders ski runs as wide, bright white paths cutting through the forest.
 * Matching the classic trail map style where groomed runs are clearly visible.
 */
export class RunRenderer {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.runMeshes = new Map();
    }

    generate() {
        const group = new THREE.Group();
        group.name = 'runs';

        const runs = getAllRuns();

        for (const run of runs) {
            const mesh = this.createRunMesh(run);
            if (mesh) {
                mesh.userData = {
                    type: 'run',
                    id: run.id,
                    name: run.name,
                    difficulty: run.difficulty
                };
                this.runMeshes.set(run.id, mesh);
                group.add(mesh);
            }
        }

        return group;
    }

    createRunMesh(run) {
        if (!run.points || run.points.length < 2) {
            return null;
        }

        // Convert points to 3D with terrain height
        const points3D = run.points.map(p => {
            const y = this.terrain.getHeightAt(p.x, p.z) + 0.3;
            return new THREE.Vector3(p.x, y, p.z);
        });

        // Create smooth curve
        const curve = new THREE.CatmullRomCurve3(points3D, false, 'centripetal', 0.5);

        // Get run width based on difficulty (green runs are wider)
        const width = this.getRunWidth(run.difficulty);

        // Create ribbon geometry that follows terrain
        const geometry = this.createRibbonGeometry(curve, width, 50);

        // All runs are white/off-white like in the reference (snow-covered)
        const material = new THREE.MeshStandardMaterial({
            color: 0xf8f8ff,
            roughness: 0.85,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;
        mesh.name = `run_${run.id}`;

        // Add colored edge markers for difficulty
        const markers = this.createDifficultyMarkers(run, points3D);
        mesh.add(markers);

        return mesh;
    }

    /**
     * Create ribbon geometry that conforms to terrain
     */
    createRibbonGeometry(curve, width, segments) {
        const points = curve.getPoints(segments);
        const vertices = [];
        const indices = [];
        const uvs = [];

        for (let i = 0; i < points.length; i++) {
            const p = points[i];

            // Get tangent direction
            const t = i / (points.length - 1);
            const tangent = curve.getTangentAt(t);

            // Calculate perpendicular direction (cross with up)
            const up = new THREE.Vector3(0, 1, 0);
            const perp = new THREE.Vector3().crossVectors(tangent, up).normalize();

            // Create two vertices (left and right edge of run)
            const halfWidth = width / 2;

            const left = new THREE.Vector3(
                p.x - perp.x * halfWidth,
                this.terrain.getHeightAt(p.x - perp.x * halfWidth, p.z - perp.z * halfWidth) + 0.5,
                p.z - perp.z * halfWidth
            );

            const right = new THREE.Vector3(
                p.x + perp.x * halfWidth,
                this.terrain.getHeightAt(p.x + perp.x * halfWidth, p.z + perp.z * halfWidth) + 0.5,
                p.z + perp.z * halfWidth
            );

            vertices.push(left.x, left.y, left.z);
            vertices.push(right.x, right.y, right.z);

            uvs.push(0, t);
            uvs.push(1, t);
        }

        // Create triangles
        for (let i = 0; i < points.length - 1; i++) {
            const v0 = i * 2;
            const v1 = v0 + 1;
            const v2 = v0 + 2;
            const v3 = v0 + 3;

            indices.push(v0, v2, v1);
            indices.push(v1, v2, v3);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }

    /**
     * Create difficulty markers at the top of each run
     */
    createDifficultyMarkers(run, points) {
        const group = new THREE.Group();

        const color = DIFFICULTY_COLORS[run.difficulty] || 0x22c55e;

        // Create marker at top of run
        let geometry;
        if (run.difficulty === DIFFICULTY.GREEN) {
            geometry = new THREE.CircleGeometry(3, 16);
        } else if (run.difficulty === DIFFICULTY.BLUE) {
            geometry = new THREE.PlaneGeometry(5, 5);
            geometry.rotateZ(Math.PI / 4); // Diamond
        } else {
            geometry = new THREE.PlaneGeometry(5, 5);
            geometry.rotateZ(Math.PI / 4);
        }

        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });

        const marker = new THREE.Mesh(geometry, material);
        const topPoint = points[0];
        marker.position.set(topPoint.x, topPoint.y + 8, topPoint.z);
        marker.lookAt(new THREE.Vector3(topPoint.x, topPoint.y + 8, topPoint.z + 1));

        group.add(marker);

        return group;
    }

    getRunWidth(difficulty) {
        switch (difficulty) {
            case 'green': return 20;   // Wide beginner runs
            case 'blue': return 16;
            case 'black': return 12;
            case 'double': return 10;  // Narrower expert runs
            default: return 14;
        }
    }
}
