/**
 * Lift data - coordinates updated for 2400x2000 terrain
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
        base: { x: -140, z: 850 },
        summit: { x: -100, z: -80 },
        towerCount: 18
    },

    outpostGondola: {
        name: 'Outpost Gondola',
        type: LIFT_TYPES.GONDOLA,
        capacity: 6,
        color: 0xcc2222,
        base: { x: -60, z: -60 },
        summit: { x: 160, z: -330 },
        towerCount: 14
    },

    summitExpress: {
        name: 'Summit Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xcc2222,
        base: { x: -80, z: 820 },
        summit: { x: -60, z: -70 },
        towerCount: 20
    },

    montezumaExpress: {
        name: 'Montezuma Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0xcc2222,
        base: { x: -260, z: 550 },
        summit: { x: -180, z: -40 },
        towerCount: 16
    },

    peruExpress: {
        name: 'Peru Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x22aa22,
        base: { x: 40, z: 800 },
        summit: { x: 80, z: 350 },
        towerCount: 14
    },

    rubyExpress: {
        name: 'Ruby Express',
        type: LIFT_TYPES.HIGH_SPEED_SIX,
        capacity: 6,
        color: 0x2266cc,
        base: { x: 100, z: 220 },
        summit: { x: 80, z: -280 },
        towerCount: 12
    },

    santiagoExpress: {
        name: 'Santiago Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 220, z: 150 },
        summit: { x: 180, z: -320 },
        towerCount: 13
    },

    outbackExpress: {
        name: 'Outback Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 440, z: 100 },
        summit: { x: 580, z: -380 },
        towerCount: 16
    },

    bergmanExpress: {
        name: 'Bergman Express',
        type: LIFT_TYPES.HIGH_SPEED_QUAD,
        capacity: 4,
        color: 0xcc2222,
        base: { x: 60, z: -80 },
        summit: { x: 20, z: -520 },
        towerCount: 14
    },

    wayback: {
        name: 'Wayback',
        type: LIFT_TYPES.QUAD,
        capacity: 4,
        color: 0x2266cc,
        base: { x: 360, z: 120 },
        summit: { x: 480, z: -200 },
        towerCount: 12
    },

    ranger: {
        name: 'Ranger',
        type: LIFT_TYPES.TRIPLE,
        capacity: 3,
        color: 0x22aa22,
        base: { x: -40, z: 200 },
        summit: { x: -20, z: -20 },
        towerCount: 8
    },

    discovery: {
        name: 'Discovery',
        type: LIFT_TYPES.DOUBLE,
        capacity: 2,
        color: 0x22aa22,
        base: { x: -340, z: 780 },
        summit: { x: -380, z: 580 },
        towerCount: 7
    }
};

export function getAllLifts() {
    return Object.entries(LIFTS).map(([id, lift]) => ({ id, ...lift }));
}

export function getLiftsByType(type) {
    return getAllLifts().filter(lift => lift.type === type);
}
