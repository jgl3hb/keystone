import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TerrainGenerator } from './terrain/TerrainGenerator.js';
import { RunRenderer } from './runs/RunRenderer.js';
import { LiftRenderer } from './lifts/LiftRenderer.js';
import { TreeGenerator } from './environment/TreeGenerator.js';
import { SkyManager } from './environment/Sky.js';
import { setupControls } from './ui/Controls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ec8e8);
scene.fog = new THREE.FogExp2(0xa8d8ea, 0.00025);

// Camera - positioned for trail map view
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    8000
);
camera.position.set(400, 800, 1800);

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
renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 300;
controls.maxDistance = 4000;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 100, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xf0f5ff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.4);
sunLight.position.set(-500, 1000, 500);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 3500;
sunLight.shadow.camera.left = -1600;
sunLight.shadow.camera.right = 1600;
sunLight.shadow.camera.top = 1600;
sunLight.shadow.camera.bottom = -1600;
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.3);
fillLight.position.set(400, 300, -300);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0x8ec8e8, 0x3d5a3d, 0.6);
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

async function init() {
    console.log('Initializing Keystone 3D Map...');

    const terrainGenerator = new TerrainGenerator();
    appState.terrain = terrainGenerator.generate();
    scene.add(appState.terrain);

    const treeGenerator = new TreeGenerator(terrainGenerator);
    appState.trees = treeGenerator.generate();
    scene.add(appState.trees);

    const runRenderer = new RunRenderer(terrainGenerator);
    appState.runs = runRenderer.generate();
    scene.add(appState.runs);

    const liftRenderer = new LiftRenderer(terrainGenerator);
    appState.lifts = liftRenderer.generate();
    scene.add(appState.lifts);

    const skyManager = new SkyManager();
    appState.sky = skyManager.generate();
    scene.add(appState.sky);

    setupControls(appState, camera, controls, scene, sunLight, hemiLight, renderer);

    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 600);

    console.log('Keystone 3D Map initialized!');
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (appState.lifts && appState.lifts.userData.update) {
        appState.lifts.userData.update();
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
animate();
