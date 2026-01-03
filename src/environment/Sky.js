import * as THREE from 'three';

/**
 * Sky dome matching the reference trail map style - 
 * Blue sky with distant mountain backdrop
 */
export class SkyManager {
    constructor() {
        this.isNight = false;
    }

    generate() {
        const group = new THREE.Group();
        group.name = 'sky';

        // Sky dome with gradient
        const skyGeometry = new THREE.SphereGeometry(2800, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x4a8bc9) },
                bottomColor: { value: new THREE.Color(0xc8e0f0) },
                offset: { value: 500 },
                exponent: { value: 0.5 }
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

        // Distant mountain range backdrop (like in the reference painting)
        const mountains = this.createDistantMountains();
        group.add(mountains);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(60, 16, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(-600, 900, -400);
        sun.name = 'sun';
        group.add(sun);

        // Sun glow
        const glowGeometry = new THREE.SphereGeometry(100, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(sun.position);
        glow.name = 'sunGlow';
        group.add(glow);

        // Stars (hidden during day)
        const stars = this.createStars();
        stars.visible = false;
        stars.name = 'stars';
        group.add(stars);

        group.userData.skyMaterial = skyMaterial;
        group.userData.sunMaterial = sunMaterial;
        group.userData.glowMaterial = glowMaterial;

        return group;
    }

    /**
     * Create distant mountain range like in the James Niehues paintings
     */
    createDistantMountains() {
        const group = new THREE.Group();

        // Blue-gray color for distant mountains (atmospheric perspective)
        const mountainMaterial = new THREE.MeshBasicMaterial({
            color: 0x7899b8,
            fog: true
        });

        const darkMountainMaterial = new THREE.MeshBasicMaterial({
            color: 0x5577a0,
            fog: true
        });

        // Several mountain peaks along the back horizon
        const peaks = [
            { x: -1800, z: -1200, height: 500, width: 600, mat: mountainMaterial },
            { x: -1200, z: -1300, height: 600, width: 500, mat: darkMountainMaterial },
            { x: -600, z: -1250, height: 550, width: 450, mat: mountainMaterial },
            { x: 0, z: -1350, height: 620, width: 520, mat: darkMountainMaterial },
            { x: 600, z: -1280, height: 580, width: 480, mat: mountainMaterial },
            { x: 1200, z: -1320, height: 540, width: 500, mat: darkMountainMaterial },
            { x: 1800, z: -1200, height: 500, width: 550, mat: mountainMaterial },

            // Second layer (closer, slightly darker)
            { x: -1500, z: -1000, height: 400, width: 450, mat: darkMountainMaterial },
            { x: -900, z: -1050, height: 450, width: 400, mat: mountainMaterial },
            { x: -300, z: -1100, height: 480, width: 420, mat: darkMountainMaterial },
            { x: 300, z: -1080, height: 460, width: 440, mat: mountainMaterial },
            { x: 900, z: -1020, height: 420, width: 400, mat: darkMountainMaterial },
            { x: 1500, z: -1000, height: 400, width: 420, mat: mountainMaterial },
        ];

        for (const peak of peaks) {
            const geometry = new THREE.ConeGeometry(peak.width, peak.height, 5);
            const mountain = new THREE.Mesh(geometry, peak.mat);
            mountain.position.set(peak.x, peak.height / 2 + 50, peak.z);
            mountain.rotation.y = Math.random() * Math.PI;
            group.add(mountain);
        }

        return group;
    }

    createStars() {
        const starCount = 2500;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 2600;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi));
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

    setNightMode(sky, isNight, scene, sunLight, hemiLight, renderer) {
        this.isNight = isNight;

        const skyMaterial = sky.userData.skyMaterial;
        const stars = sky.getObjectByName('stars');
        const sun = sky.getObjectByName('sun');
        const sunGlow = sky.getObjectByName('sunGlow');

        if (isNight) {
            skyMaterial.uniforms.topColor.value.setHex(0x0a0a20);
            skyMaterial.uniforms.bottomColor.value.setHex(0x1a1a3a);

            sun.material.color.setHex(0xccccdd);
            sun.position.set(-400, 500, 200);
            sunGlow.position.copy(sun.position);
            sunGlow.material.color.setHex(0x9999bb);
            sunGlow.material.opacity = 0.15;

            stars.visible = true;

            scene.background = new THREE.Color(0x0a0a15);
            scene.fog = new THREE.FogExp2(0x1a1a2e, 0.0003);

            sunLight.intensity = 0.3;
            sunLight.color.setHex(0x6677aa);

            hemiLight.intensity = 0.2;
            hemiLight.color.setHex(0x2233aa);
            hemiLight.groundColor.setHex(0x1a1a2a);

            renderer.toneMappingExposure = 0.5;
        } else {
            skyMaterial.uniforms.topColor.value.setHex(0x4a8bc9);
            skyMaterial.uniforms.bottomColor.value.setHex(0xc8e0f0);

            sun.material.color.setHex(0xffffee);
            sun.position.set(-600, 900, -400);
            sunGlow.position.copy(sun.position);
            sunGlow.material.color.setHex(0xffffcc);
            sunGlow.material.opacity = 0.2;

            stars.visible = false;

            scene.background = new THREE.Color(0x8ec8e8);
            scene.fog = new THREE.FogExp2(0xa8d8ea, 0.0004);

            sunLight.intensity = 1.4;
            sunLight.color.setHex(0xfffaf0);

            hemiLight.intensity = 0.6;
            hemiLight.color.setHex(0x8ec8e8);
            hemiLight.groundColor.setHex(0x3d5a3d);

            renderer.toneMappingExposure = 1.1;
        }
    }
}
