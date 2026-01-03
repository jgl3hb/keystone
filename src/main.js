import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { TerrainGenerator } from './terrain/TerrainGenerator.js';
import { RunRenderer } from './runs/RunRenderer.js';
import { LiftRenderer } from './lifts/LiftRenderer.js';
import { TreeGenerator } from './environment/TreeGenerator.js';
import { SkyManager } from './environment/Sky.js';
import { setupControls } from './ui/Controls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 500, 2500);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    5000
);
camera.position.set(0, 400, 800);

// Renderer
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// CSS2D Renderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('app').appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 2000;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 100, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(200, 400, 200);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 1500;
sunLight.shadow.camera.left = -800;
sunLight.shadow.camera.right = 800;
sunLight.shadow.camera.top = 800;
sunLight.shadow.camera.bottom = -800;
scene.add(sunLight);

// Hemisphere light for natural sky coloring
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d5c3d, 0.6);
scene.add(hemiLight);

// App state
const appState = {
    showRuns: true,
    showLifts: true,
    showTrees: true,
    showLabels: true,
    showGreen: true,
    showBlue: true,
    showBlack: true,
    showDouble: true,
    isNight: false,
    terrain: null,
    runs: null,
    lifts: null,
    trees: null,
    sky: null
};

// Initialize scene components
async function init() {
    console.log('Initializing Keystone 3D Map...');

    // Generate terrain
    const terrainGenerator = new TerrainGenerator();
    appState.terrain = terrainGenerator.generate();
    scene.add(appState.terrain);

    // Generate ski runs
    const runRenderer = new RunRenderer(terrainGenerator);
    appState.runs = runRenderer.generate();
    scene.add(appState.runs);

    // Generate lifts
    const liftRenderer = new LiftRenderer(terrainGenerator);
    appState.lifts = liftRenderer.generate();
    scene.add(appState.lifts);

    // Generate trees
    const treeGenerator = new TreeGenerator(terrainGenerator);
    appState.trees = treeGenerator.generate();
    scene.add(appState.trees);

    // Generate sky
    const skyManager = new SkyManager();
    appState.sky = skyManager.generate();
    scene.add(appState.sky);

    // Setup UI controls
    setupControls(appState, camera, controls, scene, sunLight, hemiLight, renderer);

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);

    console.log('Keystone 3D Map initialized!');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // Update lift animations
    if (appState.lifts && appState.lifts.userData.update) {
        appState.lifts.userData.update();
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start
init();
animate();
