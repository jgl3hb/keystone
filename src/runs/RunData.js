/**
 * Run data for Keystone Ski Resort
 * Paths adjusted to match the new terrain layout (larger scale, SE view looking NW)
 */

export const DIFFICULTY = {
    GREEN: 'green',
    BLUE: 'blue',
    BLACK: 'black',
    DOUBLE: 'double'
};

export const DIFFICULTY_COLORS = {
    green: 0x22c55e,
    blue: 0x3b82f6,
    black: 0x111111,
    double: 0x111111
};

/**
 * Major ski runs - coordinates updated for new terrain scale
 */
export const RUNS = {
    // ========================================
    // DERCUM MOUNTAIN - Frontside
    // ========================================

    schoolmarm: {
        name: 'Schoolmarm',
        difficulty: DIFFICULTY.GREEN,
        description: 'Longest run at Keystone - 3.5 miles',
        points: [
            { x: -50, z: 50 },
            { x: -80, z: 150 },
            { x: -120, z: 280 },
            { x: -150, z: 400 },
            { x: -180, z: 520 },
            { x: -160, z: 640 },
            { x: -120, z: 720 }
        ]
    },

    lastChance: {
        name: 'Last Chance',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -40, z: 60 },
            { x: -20, z: 180 },
            { x: 0, z: 320 },
            { x: -30, z: 460 },
            { x: -60, z: 600 },
            { x: -80, z: 720 }
        ]
    },

    frenchman: {
        name: 'Frenchman',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -100, z: 100 },
            { x: -140, z: 200 },
            { x: -180, z: 320 },
            { x: -200, z: 450 },
            { x: -180, z: 580 }
        ]
    },

    silverspoon: {
        name: 'Silver Spoon',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -30, z: 55 },
            { x: 10, z: 160 },
            { x: 30, z: 280 },
            { x: 20, z: 400 },
            { x: -10, z: 520 }
        ]
    },

    paymaster: {
        name: 'Paymaster',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -70, z: 60 },
            { x: -100, z: 180 },
            { x: -130, z: 300 },
            { x: -140, z: 420 }
        ]
    },

    flyingDutchman: {
        name: 'Flying Dutchman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -55, z: 55 },
            { x: -40, z: 140 },
            { x: -25, z: 250 },
            { x: -40, z: 360 },
            { x: -70, z: 480 }
        ]
    },

    anticipation: {
        name: 'Anticipation',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -45, z: 52 },
            { x: -30, z: 120 },
            { x: -20, z: 200 },
            { x: -35, z: 300 }
        ]
    },

    geronimo: {
        name: 'Geronimo',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -60, z: 55 },
            { x: -50, z: 130 },
            { x: -45, z: 210 },
            { x: -60, z: 300 }
        ]
    },

    starfire: {
        name: 'Starfire',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -90, z: 70 },
            { x: -120, z: 160 },
            { x: -150, z: 260 },
            { x: -160, z: 360 }
        ]
    },

    // ========================================
    // NORTH PEAK
    // ========================================

    mozart: {
        name: 'Mozart',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 80, z: -150 },
            { x: 100, z: -60 },
            { x: 110, z: 40 },
            { x: 90, z: 140 }
        ]
    },

    catDancer: {
        name: 'Cat Dancer',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 70, z: -140 },
            { x: 50, z: -50 },
            { x: 40, z: 50 },
            { x: 60, z: 150 }
        ]
    },

    prospector: {
        name: 'Prospector',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 60, z: -130 },
            { x: 35, z: -40 },
            { x: 25, z: 60 },
            { x: 45, z: 160 }
        ]
    },

    spillway: {
        name: 'Spillway',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 75, z: -145 },
            { x: 65, z: -70 },
            { x: 55, z: 20 },
            { x: 70, z: 110 }
        ]
    },

    theWindows: {
        name: 'The Windows',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 50, z: -120 },
            { x: 30, z: -40 },
            { x: 20, z: 50 }
        ]
    },

    // ========================================
    // THE OUTBACK
    // ========================================

    wildIrishman: {
        name: 'Wild Irishman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 350, z: -280 },
            { x: 310, z: -180 },
            { x: 280, z: -80 },
            { x: 260, z: 20 }
        ]
    },

    theOutback: {
        name: 'The Outback',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 340, z: -270 },
            { x: 300, z: -170 },
            { x: 270, z: -70 },
            { x: 250, z: 30 }
        ]
    },

    theBlackForest: {
        name: 'The Black Forest',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 370, z: -275 },
            { x: 400, z: -180 },
            { x: 420, z: -80 },
            { x: 400, z: 20 }
        ]
    },

    // ========================================
    // BOWLS
    // ========================================

    northBowl: {
        name: 'North Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 300, z: -400 },
            { x: 310, z: -320 },
            { x: 295, z: -240 },
            { x: 280, z: -160 }
        ]
    },

    southBowl: {
        name: 'South Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 420, z: -350 },
            { x: 400, z: -270 },
            { x: 380, z: -190 },
            { x: 360, z: -110 }
        ]
    },

    independenceBowl: {
        name: 'Independence Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: -380, z: -50 },
            { x: -340, z: 30 },
            { x: -300, z: 120 },
            { x: -260, z: 200 }
        ]
    },

    bergmanBowl: {
        name: 'Bergman Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: -20, z: -350 },
            { x: 0, z: -260 },
            { x: 20, z: -170 },
            { x: 40, z: -80 }
        ]
    },

    ericksonBowl: {
        name: 'Erickson Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 80, z: -380 },
            { x: 100, z: -290 },
            { x: 110, z: -200 },
            { x: 100, z: -110 }
        ]
    }
};

export function getAllRuns() {
    return Object.entries(RUNS).map(([id, run]) => ({ id, ...run }));
}

export function getRunsByDifficulty(difficulty) {
    return getAllRuns().filter(run => run.difficulty === difficulty);
}
