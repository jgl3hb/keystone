/**
 * Lift data for Keystone Ski Resort
 * Includes gondolas, high-speed quads, and other chairlifts
 */

export const LIFT_TYPES = {
    GONDOLA: 'gondola',
    HIGH_SPEED_QUAD: 'hsQuad',
    HIGH_SPEED_SIX: 'hsSix',
    QUAD: 'quad',
    TRIPLE: 'triple',
    DOUBLE: 'double'
};

/**
 * All lifts with their positions and properties
 * Each lift has a base and summit position
 */
export const LIFTS = {
    // ========================================
    // MAIN GONDOLAS
    // ========================================

    riverRunGondola: {
        name: 'River Run Gondola',
        type: LIFT_TYPES.GONDOLA,
        capacity: 8,
        color: 0xff3333,
        base: { x: -100, z: 550 },
        summit: { x: -100, z: 90 },
        midStation: { x: -100, z: 300 },
        towerCount: 12
    },

    outpostGondola: {
        name: 'Outpost Gondola',
        type: LIFT_TYPES.GONDOLA,
        capacity: 6,
        color: 0xff3333,
        base: { x: -80, z: 100 },
        summit: { x: 100, z: -80 },
        towerCount: 10
    },

    // ========================================
    // HIGH-SPEED CHAIRLIFTS
    // ========================================

    summitExpress: {
        name: 'Summit Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xff3333,
        base: { x: -60, z: 530 },
        summit: { x: -70, z: 95 },
        towerCount: 14
    },

    montezumaExpress: {
        name: 'Montezuma Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0xff3333,
        base: { x: -150, z: 350 },
        summit: { x: -130, z: 100 },
        towerCount: 10
    },

    peruExpress: {
        name: 'Peru Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x33cc33,
        base: { x: -20, z: 520 },
        summit: { x: 20, z: 250 },
        towerCount: 9
    },

    rubyExpress: {
        name: 'Ruby Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x3399ff,
        base: { x: 70, z: 150 },
        summit: { x: 60, z: -60 },
        towerCount: 8
    },

    santiagoExpress: {
        name: 'Santiago Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x3399ff,
        base: { x: 130, z: 100 },
        summit: { x: 110, z: -90 },
        towerCount: 9
    },

    outbackExpress: {
        name: 'Outback Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x3399ff,
        base: { x: 260, z: 50 },
        summit: { x: 340, z: -180 },
        towerCount: 11
    },

    bergmanExpress: {
        name: 'Bergman Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xff3333,
        base: { x: 0, z: -50 },
        summit: { x: -30, z: -260 },
        towerCount: 10
    },

    // ========================================
    // OTHER CHAIRLIFTS
    // ========================================

    wayback: {
        name: 'Wayback',
        type: LIFT_TYPES.QUAD,
        capacity: 4,
        color: 0x3399ff,
        base: { x: 200, z: 80 },
        summit: { x: 250, z: -100 },
        towerCount: 8
    },

    ranger: {
        name: 'Ranger',
        type: LIFT_TYPES.TRIPLE,
        capacity: 3,
        color: 0x33cc33,
        base: { x: -50, z: 150 },
        summit: { x: -30, z: 50 },
        towerCount: 6
    },

    discovery: {
        name: 'Discovery',
        type: LIFT_TYPES.DOUBLE,
        capacity: 2,
        color: 0x33cc33,
        base: { x: -200, z: 500 },
        summit: { x: -220, z: 380 },
        towerCount: 5
    },

    a51: {
        name: 'A-51',
        type: LIFT_TYPES.DOUBLE,
        capacity: 2,
        color: 0xffcc00,
        base: { x: -160, z: 300 },
        summit: { x: -140, z: 180 },
        towerCount: 5
    },

    lArgentine: {
        name: "L'Argentine",
        type: LIFT_TYPES.TRIPLE,
        capacity: 3,
        color: 0x33cc33,
        base: { x: -230, z: 480 },
        summit: { x: -250, z: 350 },
        towerCount: 6
    }
};

/**
 * Get all lifts as an array
 */
export function getAllLifts() {
    return Object.entries(LIFTS).map(([id, lift]) => ({
        id,
        ...lift
    }));
}

/**
 * Get lifts by type
 */
export function getLiftsByType(type) {
    return getAllLifts().filter(lift => lift.type === type);
}
