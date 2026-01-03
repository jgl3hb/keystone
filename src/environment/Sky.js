import * as THREE from 'three';

/**
 * Manages sky dome and atmospheric effects
 */
export class SkyManager {
    constructor() {
        this.isNight = false;
    }

    /**
     * Generate sky dome
     */
    generate() {
        const group = new THREE.Group();
        group.name = 'sky';

        // Sky dome
        const skyGeometry = new THREE.SphereGeometry(2000, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x4a90d9) },
                bottomColor: { value: new THREE.Color(0xb8d4f0) },
                offset: { value: 400 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        sky.name = 'skyDome';
        group.add(sky);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(30, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffee
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(400, 600, 200);
        sun.name = 'sun';
        group.add(sun);

        // Sun glow
        const glowGeometry = new THREE.SphereGeometry(50, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffaa,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(sun.position);
        glow.name = 'sunGlow';
        group.add(glow);

        // Distant mountains silhouette
        const mountains = this.createDistantMountains();
        group.add(mountains);

        // Stars (hidden during day)
        const stars = this.createStars();
        stars.visible = false;
        stars.name = 'stars';
        group.add(stars);

        // Store materials for day/night switching
        group.userData.skyMaterial = skyMaterial;
        group.userData.sunMaterial = sunMaterial;
        group.userData.glowMaterial = glowMaterial;

        return group;
    }

    /**
     * Create distant mountain silhouettes
     */
    createDistantMountains() {
        const group = new THREE.Group();

        const mountainMaterial = new THREE.MeshBasicMaterial({
            color: 0x6b8cae,
            fog: true
        });

        // Create several mountain peaks on the horizon
        const peaks = [
            { x: -1200, z: -800, height: 300, width: 400 },
            { x: -800, z: -900, height: 350, width: 350 },
            { x: -400, z: -850, height: 280, width: 300 },
            { x: 0, z: -900, height: 320, width: 380 },
            { x: 400, z: -850, height: 290, width: 320 },
            { x: 800, z: -900, height: 340, width: 360 },
            { x: 1200, z: -800, height: 310, width: 340 },
        ];

        for (const peak of peaks) {
            const geometry = new THREE.ConeGeometry(peak.width, peak.height, 4);
            const mountain = new THREE.Mesh(geometry, mountainMaterial);
            mountain.position.set(peak.x, peak.height / 2, peak.z);
            mountain.rotation.y = Math.random() * Math.PI * 2;
            group.add(mountain);
        }

        return group;
    }

    /**
     * Create starfield for night mode
     */
    createStars() {
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            // Random position on sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 1800;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)); // Only upper hemisphere
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: false
        });

        return new THREE.Points(geometry, material);
    }

    /**
     * Toggle between day and night
     */
    setNightMode(sky, isNight, scene, sunLight, hemiLight, renderer) {
        this.isNight = isNight;

        const skyMaterial = sky.userData.skyMaterial;
        const stars = sky.getObjectByName('stars');
        const sun = sky.getObjectByName('sun');
        const sunGlow = sky.getObjectByName('sunGlow');

        if (isNight) {
            // Night sky colors
            skyMaterial.uniforms.topColor.value.setHex(0x0a0a20);
            skyMaterial.uniforms.bottomColor.value.setHex(0x1a1a3a);

            // Dim sun (moon)
            sun.material.color.setHex(0xccccdd);
            sun.position.set(-300, 400, 100);
            sunGlow.position.copy(sun.position);
            sunGlow.material.color.setHex(0x9999bb);
            sunGlow.material.opacity = 0.15;

            // Show stars
            stars.visible = true;

            // Update scene lighting
            scene.background = new THREE.Color(0x0a0a15);
            scene.fog.color.setHex(0x1a1a2e);

            sunLight.intensity = 0.3;
            sunLight.color.setHex(0x6677aa);
            sunLight.position.set(-200, 300, 100);

            hemiLight.intensity = 0.2;
            hemiLight.color.setHex(0x2233aa);
            hemiLight.groundColor.setHex(0x1a1a2a);

            renderer.toneMappingExposure = 0.5;

        } else {
            // Day sky colors
            skyMaterial.uniforms.topColor.value.setHex(0x4a90d9);
            skyMaterial.uniforms.bottomColor.value.setHex(0xb8d4f0);

            // Bright sun
            sun.material.color.setHex(0xffffee);
            sun.position.set(400, 600, 200);
            sunGlow.position.copy(sun.position);
            sunGlow.material.color.setHex(0xffffaa);
            sunGlow.material.opacity = 0.3;

            // Hide stars
            stars.visible = false;

            // Update scene lighting
            scene.background = new THREE.Color(0x87ceeb);
            scene.fog.color.setHex(0x87ceeb);

            sunLight.intensity = 1.2;
            sunLight.color.setHex(0xffffff);
            sunLight.position.set(200, 400, 200);

            hemiLight.intensity = 0.6;
            hemiLight.color.setHex(0x87ceeb);
            hemiLight.groundColor.setHex(0x3d5c3d);

            renderer.toneMappingExposure = 1.0;
        }
    }
}
