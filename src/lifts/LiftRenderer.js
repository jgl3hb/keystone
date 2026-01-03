import * as THREE from 'three';
import { LIFTS, getAllLifts, LIFT_TYPES } from './LiftData.js';

/**
 * Renders lift infrastructure: towers, cables, and animated cabins/chairs
 */
export class LiftRenderer {
    constructor(terrainGenerator) {
        this.terrain = terrainGenerator;
        this.liftGroups = new Map();
        this.cabins = [];
        this.clock = new THREE.Clock();
    }

    /**
     * Generate all lift visuals
     */
    generate() {
        const group = new THREE.Group();
        group.name = 'lifts';

        const lifts = getAllLifts();

        for (const lift of lifts) {
            const liftGroup = this.createLift(lift);
            if (liftGroup) {
                liftGroup.userData = {
                    type: 'lift',
                    id: lift.id,
                    name: lift.name,
                    liftType: lift.type
                };
                this.liftGroups.set(lift.id, liftGroup);
                group.add(liftGroup);
            }
        }

        // Add update function for animation
        group.userData.update = () => this.updateCabins();

        return group;
    }

    /**
     * Create a complete lift with towers, cables, and cabins
     */
    createLift(lift) {
        const liftGroup = new THREE.Group();
        liftGroup.name = `lift_${lift.id}`;

        // Get 3D positions with terrain height
        const basePos = new THREE.Vector3(
            lift.base.x,
            this.terrain.getHeightAt(lift.base.x, lift.base.z) + 2,
            lift.base.z
        );

        const summitPos = new THREE.Vector3(
            lift.summit.x,
            this.terrain.getHeightAt(lift.summit.x, lift.summit.z) + 2,
            lift.summit.z
        );

        // Create path between base and summit
        let pathPoints;
        if (lift.midStation) {
            const midPos = new THREE.Vector3(
                lift.midStation.x,
                this.terrain.getHeightAt(lift.midStation.x, lift.midStation.z) + 2,
                lift.midStation.z
            );
            pathPoints = [basePos, midPos, summitPos];
        } else {
            pathPoints = [basePos, summitPos];
        }

        // Create towers
        const towers = this.createTowers(lift, basePos, summitPos);
        liftGroup.add(towers);

        // Create cables
        const cables = this.createCables(basePos, summitPos);
        liftGroup.add(cables);

        // Create stations
        const baseStation = this.createStation(basePos, lift.color);
        const summitStation = this.createStation(summitPos, lift.color);
        liftGroup.add(baseStation);
        liftGroup.add(summitStation);

        // Create cabins/chairs
        const cabinCount = lift.type === LIFT_TYPES.GONDOLA ? 8 : 12;
        for (let i = 0; i < cabinCount; i++) {
            const t = i / cabinCount;
            const cabin = this.createCabin(lift, basePos, summitPos, t);
            liftGroup.add(cabin);
            this.cabins.push({
                mesh: cabin,
                basePos,
                summitPos,
                progress: t,
                speed: 0.015 + Math.random() * 0.005,
                direction: i % 2 === 0 ? 1 : -1, // Alternating up/down
                liftType: lift.type
            });
        }

        return liftGroup;
    }

    /**
     * Create lift towers along the cable path
     */
    createTowers(lift, basePos, summitPos) {
        const group = new THREE.Group();

        const direction = new THREE.Vector3().subVectors(summitPos, basePos);
        const length = direction.length();
        direction.normalize();

        const towerCount = lift.towerCount || 8;
        const towerSpacing = length / (towerCount - 1);

        const towerGeometry = new THREE.CylinderGeometry(0.8, 1.2, 20, 8);
        const towerMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 0.7,
            roughness: 0.3
        });

        // Cross-arm geometry
        const armGeometry = new THREE.BoxGeometry(8, 0.5, 0.5);

        for (let i = 1; i < towerCount - 1; i++) {
            const t = i / (towerCount - 1);
            const pos = new THREE.Vector3().lerpVectors(basePos, summitPos, t);

            // Adjust for terrain
            const terrainHeight = this.terrain.getHeightAt(pos.x, pos.z);
            const cableHeight = basePos.y + (summitPos.y - basePos.y) * t;
            const towerHeight = Math.max(15, cableHeight - terrainHeight + 5);

            // Create tower
            const scaledGeometry = towerGeometry.clone();
            const tower = new THREE.Mesh(scaledGeometry, towerMaterial);
            tower.scale.y = towerHeight / 20;
            tower.position.set(pos.x, terrainHeight + towerHeight / 2, pos.z);
            tower.castShadow = true;
            group.add(tower);

            // Add cross-arm at top
            const arm = new THREE.Mesh(armGeometry, towerMaterial);
            arm.position.set(pos.x, terrainHeight + towerHeight, pos.z);
            group.add(arm);
        }

        return group;
    }

    /**
     * Create cable lines (up and down)
     */
    createCables(basePos, summitPos) {
        const group = new THREE.Group();

        const cableMaterial = new THREE.LineBasicMaterial({
            color: 0x222222,
            linewidth: 2
        });

        // Offset for parallel cables
        const offset = 2;
        const perpendicular = new THREE.Vector3()
            .subVectors(summitPos, basePos)
            .cross(new THREE.Vector3(0, 1, 0))
            .normalize()
            .multiplyScalar(offset);

        // Cable 1 (up)
        const points1 = [
            basePos.clone().add(perpendicular),
            summitPos.clone().add(perpendicular)
        ];
        const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        const cable1 = new THREE.Line(geometry1, cableMaterial);
        group.add(cable1);

        // Cable 2 (down)
        const points2 = [
            basePos.clone().sub(perpendicular),
            summitPos.clone().sub(perpendicular)
        ];
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        const cable2 = new THREE.Line(geometry2, cableMaterial);
        group.add(cable2);

        return group;
    }

    /**
     * Create lift station building
     */
    createStation(position, color) {
        const group = new THREE.Group();

        // Main building
        const buildingGeometry = new THREE.BoxGeometry(15, 8, 10);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x5a5a5a,
            roughness: 0.8
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.copy(position);
        building.position.y += 4;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(10, 4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: color || 0xff3333,
            roughness: 0.6
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.copy(position);
        roof.position.y += 10;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        return group;
    }

    /**
     * Create cabin or chair based on lift type
     */
    createCabin(lift, basePos, summitPos, initialT) {
        let cabin;

        if (lift.type === LIFT_TYPES.GONDOLA) {
            cabin = this.createGondolaCabin(lift.color);
        } else {
            cabin = this.createChairLift(lift.capacity, lift.color);
        }

        // Initial position along cable
        const pos = new THREE.Vector3().lerpVectors(basePos, summitPos, initialT);
        cabin.position.copy(pos);
        cabin.position.y += 3;

        return cabin;
    }

    /**
     * Create gondola cabin mesh
     */
    createGondolaCabin(color) {
        const group = new THREE.Group();

        // Cabin body
        const bodyGeometry = new THREE.BoxGeometry(3, 4, 3);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color || 0xff3333,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);

        // Windows
        const windowGeometry = new THREE.PlaneGeometry(2, 1.5);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.7
        });

        // Front window
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        frontWindow.position.set(0, 0.5, 1.51);
        group.add(frontWindow);

        // Back window
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
        backWindow.position.set(0, 0.5, -1.51);
        backWindow.rotation.y = Math.PI;
        group.add(backWindow);

        // Hanger
        const hangerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
        const hangerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const hanger = new THREE.Mesh(hangerGeometry, hangerMaterial);
        hanger.position.y = 3;
        group.add(hanger);

        group.castShadow = true;
        return group;
    }

    /**
     * Create chairlift mesh
     */
    createChairLift(capacity, color) {
        const group = new THREE.Group();

        const seatWidth = capacity * 0.8;

        // Seat
        const seatGeometry = new THREE.BoxGeometry(seatWidth, 0.3, 1.5);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: color || 0x3399ff,
            roughness: 0.7
        });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = -0.5;
        group.add(seat);

        // Back rest
        const backGeometry = new THREE.BoxGeometry(seatWidth, 1.5, 0.2);
        const back = new THREE.Mesh(backGeometry, seatMaterial);
        back.position.set(0, 0.3, -0.65);
        group.add(back);

        // Arm rests
        const armGeometry = new THREE.BoxGeometry(0.2, 0.8, 1.5);
        const leftArm = new THREE.Mesh(armGeometry, seatMaterial);
        leftArm.position.set(-seatWidth / 2 + 0.1, 0, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, seatMaterial);
        rightArm.position.set(seatWidth / 2 - 0.1, 0, 0);
        group.add(rightArm);

        // Hanger
        const hangerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 3);
        const hangerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const hanger = new THREE.Mesh(hangerGeometry, hangerMaterial);
        hanger.position.y = 2;
        group.add(hanger);

        // Safety bar
        const barGeometry = new THREE.TorusGeometry(1, 0.08, 8, 16, Math.PI);
        const bar = new THREE.Mesh(barGeometry, hangerMaterial);
        bar.position.set(0, 0.3, 0.5);
        bar.rotation.x = -Math.PI / 2;
        bar.rotation.z = Math.PI;
        group.add(bar);

        group.castShadow = true;
        return group;
    }

    /**
     * Update cabin positions for animation
     */
    updateCabins() {
        const delta = this.clock.getDelta();

        for (const cabin of this.cabins) {
            // Update progress
            cabin.progress += cabin.speed * cabin.direction * delta * 10;

            // Bounce at endpoints
            if (cabin.progress >= 1) {
                cabin.progress = 1;
                cabin.direction = -1;
            } else if (cabin.progress <= 0) {
                cabin.progress = 0;
                cabin.direction = 1;
            }

            // Calculate position along cable
            const pos = new THREE.Vector3().lerpVectors(
                cabin.basePos,
                cabin.summitPos,
                cabin.progress
            );

            // Slight offset based on direction (up vs down cable)
            const perpendicular = new THREE.Vector3()
                .subVectors(cabin.summitPos, cabin.basePos)
                .cross(new THREE.Vector3(0, 1, 0))
                .normalize()
                .multiplyScalar(cabin.direction * 2);

            pos.add(perpendicular);
            pos.y += 3;

            cabin.mesh.position.copy(pos);

            // Face direction of travel
            cabin.mesh.lookAt(
                cabin.direction > 0 ? cabin.summitPos : cabin.basePos
            );
        }
    }
}
