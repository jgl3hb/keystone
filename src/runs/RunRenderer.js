import * as THREE from 'three';
import { RUNS, getAllRuns, DIFFICULTY_COLORS } from './RunData.js';

/**
 * Renders ski runs as colored paths on the terrain
 */
export class RunRenderer {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.runMeshes = new Map();
    }

    /**
     * Generate all run meshes
     */
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

    /**
     * Create a mesh for a single run
     */
    createRunMesh(run) {
        if (!run.points || run.points.length < 2) {
            console.warn(`Run ${run.name} has insufficient points`);
            return null;
        }

        // Convert points to 3D with terrain height
        const points3D = run.points.map(p => {
            const y = this.terrain.getHeightAt(p.x, p.z) + 0.5; // Slightly above terrain
            return new THREE.Vector3(p.x, y, p.z);
        });

        // Create smooth curve through points
        const curve = new THREE.CatmullRomCurve3(points3D, false, 'centripetal', 0.5);

        // Sample curve for tube geometry
        const tubeSegments = Math.max(20, run.points.length * 8);
        const radius = this.getRunWidth(run.difficulty);

        // Create tube geometry for the run
        const geometry = new THREE.TubeGeometry(curve, tubeSegments, radius, 8, false);

        // Get color based on difficulty
        const color = DIFFICULTY_COLORS[run.difficulty] || 0xffffff;

        // Create material with some transparency for groomed runs
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.0,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        // For black diamonds, add white outline effect
        if (run.difficulty === 'black' || run.difficulty === 'double') {
            material.color.setHex(0xffffff);
            material.opacity = 0.95;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `run_${run.id}`;

        // Add run name label at top
        this.addRunLabel(mesh, run, points3D[0]);

        return mesh;
    }

    /**
     * Get run width based on difficulty (easier = wider)
     */
    getRunWidth(difficulty) {
        switch (difficulty) {
            case 'green': return 4;
            case 'blue': return 3.5;
            case 'black': return 3;
            case 'double': return 2.5;
            default: return 3;
        }
    }

    /**
     * Add a text label for the run
     */
    addRunLabel(mesh, run, position) {
        // Create HTML element for label
        const div = document.createElement('div');
        div.className = 'run-label';
        div.textContent = run.name;
        div.style.cssText = `
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 3px;
      white-space: nowrap;
      pointer-events: none;
    `;

        // Add difficulty indicator
        const indicator = document.createElement('span');
        indicator.style.marginRight = '4px';
        switch (run.difficulty) {
            case 'green':
                indicator.textContent = '●';
                indicator.style.color = '#22c55e';
                break;
            case 'blue':
                indicator.textContent = '■';
                indicator.style.color = '#3b82f6';
                break;
            case 'black':
                indicator.textContent = '◆';
                indicator.style.color = '#fff';
                break;
            case 'double':
                indicator.textContent = '◆◆';
                indicator.style.color = '#fff';
                indicator.style.fontSize = '9px';
                break;
        }
        div.prepend(indicator);

        // Will be converted to CSS2DObject in main.js if CSS2DRenderer is set up
        mesh.userData.labelElement = div;
        mesh.userData.labelPosition = position.clone().add(new THREE.Vector3(0, 10, 0));
    }

    /**
     * Update run visibility based on difficulty filters
     */
    updateVisibility(showGreen, showBlue, showBlack, showDouble) {
        this.runMeshes.forEach((mesh, id) => {
            const difficulty = mesh.userData.difficulty;
            let visible = false;

            switch (difficulty) {
                case 'green': visible = showGreen; break;
                case 'blue': visible = showBlue; break;
                case 'black': visible = showBlack; break;
                case 'double': visible = showDouble; break;
            }

            mesh.visible = visible;
        });
    }
}
