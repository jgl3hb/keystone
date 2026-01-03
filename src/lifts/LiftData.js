/**
 * Lift data for Keystone - coordinates updated for new terrain scale
 */

export const LIFT_TYPES = {
    GONDOLA: 'gondola',
    HIGH_SPEED_QUAD: 'hsQuad',
    HIGH_SPEED_SIX: 'hsSix',
    QUAD: 'quad',
    TRIPLE: 'triple',
    DOUBLE: 'double'
};

export const LIFTS = {
    riverRunGondola: {
        name: 'River Run Gondola',
        type: LIFT_TYPES.GONDOLA,
        capacity: 8,
        color: 0xcc2222,
        base: { x: -80, z: 700 },
        summit: { x: -50, z: 60 },
        towerCount: 16
    },

    outpostGondola: {
        name: 'Outpost Gondola',
        type: LIFT_TYPES.GONDOLA,
        capacity: 6,
        color: 0xcc2222,
        base: { x: -40, z: 70 },
        summit: { x: 80, z: -140 },
        towerCount: 12
    },

    summitExpress: {
        name: 'Summit Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xcc2222,
        base: { x: -40, z: 680 },
        summit: { x: -30, z: 65 },
        towerCount: 18
    },

    montezumaExpress: {
        name: 'Montezuma Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0xcc2222,
        base: { x: -150, z: 450 },
        summit: { x: -100, z: 80 },
        towerCount: 14
    },

    peruExpress: {
        name: 'Peru Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x22aa22,
        base: { x: 20, z: 650 },
        summit: { x: 40, z: 300 },
        towerCount: 12
    },

    rubyExpress: {
        name: 'Ruby Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x2266cc,
        base: { x: 60, z: 180 },
        summit: { x: 50, z: -100 },
        towerCount: 10
    },

    santiagoExpress: {
        name: 'Santiago Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 120, z: 120 },
        summit: { x: 90, z: -130 },
        towerCount: 11
    },

    outbackExpress: {
        name: 'Outback Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 260, z: 50 },
        summit: { x: 340, z: -260 },
        towerCount: 14
    },

    bergmanExpress: {
        name: 'Bergman Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xcc2222,
        base: { x: 30, z: -60 },
        summit: { x: -10, z: -330 },
        towerCount: 12
    },

    wayback: {
        name: 'Wayback',
        type: LIFT_TYPES.QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 200, z: 100 },
        summit: { x: 260, z: -140 },
        towerCount: 10
    },

    ranger: {
        name: 'Ranger',
        type: LIFT_TYPES.TRIPLE,
        capacity: 3,
        color: 0x22aa22,
        base: { x: -20, z: 180 },
        summit: { x: -10, z: 70 },
        towerCount: 7
    },

    discovery: {
        name: 'Discovery',
        type: LIFT_TYPES.DOUBLE,
        capacity: 2,
        color: 0x22aa22,
        base: { x: -200, z: 620 },
        summit: { x: -220, z: 480 },
        towerCount: 6
    },

    a51: {
        name: 'A-51',
        type: LIFT_TYPES.DOUBLE,
        capacity: 2,
        color: 0xccaa00,
        base: { x: -180, z: 380 },
        summit: { x: -160, z: 220 },
        towerCount: 6
    }
};

export function getAllLifts() {
    return Object.entries(LIFTS).map(([id, lift]) => ({ id, ...lift }));
}

export function getLiftsByType(type) {
    return getAllLifts().filter(lift => lift.type === type);
}
