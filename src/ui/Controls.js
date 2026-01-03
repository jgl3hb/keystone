import * as THREE from 'three';
import { SkyManager } from '../environment/Sky.js';

/**
 * Setup UI control panel interactions
 */
export function setupControls(appState, camera, controls, scene, sunLight, hemiLight, renderer) {
    const skyManager = new SkyManager();

    // Layer toggles
    document.getElementById('showRuns').addEventListener('change', (e) => {
        appState.showRuns = e.target.checked;
        if (appState.runs) appState.runs.visible = e.target.checked;
    });

    document.getElementById('showLifts').addEventListener('change', (e) => {
        appState.showLifts = e.target.checked;
        if (appState.lifts) appState.lifts.visible = e.target.checked;
    });

    document.getElementById('showTrees').addEventListener('change', (e) => {
        appState.showTrees = e.target.checked;
        if (appState.trees) appState.trees.visible = e.target.checked;
    });

    document.getElementById('showLabels').addEventListener('change', (e) => {
        appState.showLabels = e.target.checked;
        // Toggle CSS2D labels visibility
        document.querySelectorAll('.run-label, .lift-label').forEach(el => {
            el.style.display = e.target.checked ? 'block' : 'none';
        });
    });

    // Difficulty filters
    const difficultyFilters = ['showGreen', 'showBlue', 'showBlack', 'showDouble'];
    difficultyFilters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', (e) => {
            appState[filterId] = e.target.checked;
            updateRunVisibility(appState);
        });
    });

    // Camera preset buttons
    document.getElementById('viewFront').addEventListener('click', () => {
        animateCamera(camera, controls,
            new THREE.Vector3(0, 300, 800),
            new THREE.Vector3(0, 100, 0)
        );
    });

    document.getElementById('viewTop').addEventListener('click', () => {
        animateCamera(camera, controls,
            new THREE.Vector3(0, 800, 100),
            new THREE.Vector3(0, 0, -100)
        );
    });

    document.getElementById('viewNorthPeak').addEventListener('click', () => {
        animateCamera(camera, controls,
            new THREE.Vector3(300, 350, 200),
            new THREE.Vector3(100, 150, -100)
        );
    });

    document.getElementById('viewOutback').addEventListener('click', () => {
        animateCamera(camera, controls,
            new THREE.Vector3(500, 350, 100),
            new THREE.Vector3(350, 150, -150)
        );
    });

    // Night mode toggle
    document.getElementById('nightMode').addEventListener('change', (e) => {
        appState.isNight = e.target.checked;
        if (appState.sky) {
            skyManager.setNightMode(appState.sky, e.target.checked, scene, sunLight, hemiLight, renderer);
        }
    });

    // Info panel close button
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('info-panel').classList.add('hidden');
    });

    // Raycaster for click detection
    setupClickDetection(camera, scene, renderer);
}

/**
 * Animate camera to a new position
 */
function animateCamera(camera, controls, targetPos, targetLookAt) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 1000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startPos, targetPos, ease);
        controls.target.lerpVectors(startTarget, targetLookAt, ease);
        controls.update();

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

/**
 * Update run visibility based on difficulty filters
 */
function updateRunVisibility(appState) {
    if (!appState.runs) return;

    appState.runs.traverse((child) => {
        if (child.userData && child.userData.type === 'run') {
            const difficulty = child.userData.difficulty;
            let visible = false;

            switch (difficulty) {
                case 'green': visible = appState.showGreen; break;
                case 'blue': visible = appState.showBlue; break;
                case 'black': visible = appState.showBlack; break;
                case 'double': visible = appState.showDouble; break;
            }

            child.visible = visible;
        }
    });
}

/**
 * Setup click detection for runs and lifts
 */
function setupClickDetection(camera, scene, renderer) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with runs and lifts
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (const intersect of intersects) {
            let obj = intersect.object;

            // Walk up parent chain to find userData
            while (obj && !obj.userData.type) {
                obj = obj.parent;
            }

            if (obj && obj.userData.type) {
                showInfoPanel(obj.userData);
                break;
            }
        }
    });
}

/**
 * Show info panel for a run or lift
 */
function showInfoPanel(data) {
    const panel = document.getElementById('info-panel');
    const title = document.getElementById('info-title');
    const type = document.getElementById('info-type');
    const details = document.getElementById('info-details');

    title.textContent = data.name || data.id;

    if (data.type === 'run') {
        type.textContent = getDifficultyLabel(data.difficulty);
        details.textContent = data.description || '';
    } else if (data.type === 'lift') {
        type.textContent = getLiftTypeLabel(data.liftType);
        details.textContent = '';
    }

    panel.classList.remove('hidden');
}

/**
 * Get human-readable difficulty label
 */
function getDifficultyLabel(difficulty) {
    switch (difficulty) {
        case 'green': return '● Beginner (Green Circle)';
        case 'blue': return '■ Intermediate (Blue Square)';
        case 'black': return '◆ Advanced (Black Diamond)';
        case 'double': return '◆◆ Expert (Double Black Diamond)';
        default: return difficulty;
    }
}

/**
 * Get human-readable lift type label
 */
function getLiftTypeLabel(liftType) {
    switch (liftType) {
        case 'gondola': return 'Gondola';
        case 'hsQuad': return 'High-Speed Quad';
        case 'hsSix': return 'High-Speed Six-Pack';
        case 'quad': return 'Quad Chairlift';
        case 'triple': return 'Triple Chairlift';
        case 'double': return 'Double Chairlift';
        default: return liftType;
    }
}
