/**
 * Run data for Keystone Ski Resort
 * Extracted from official trail maps
 * 
 * Difficulty levels:
 * - green: Beginner (easiest)
 * - blue: Intermediate
 * - black: Advanced
 * - double: Expert (double black diamond)
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
    black: 0x1a1a1a,
    double: 0x1a1a1a
};

/**
 * Major ski runs organized by mountain area
 * Each run has control points that define its path down the mountain
 * Points are relative to terrain center, y will be calculated from terrain height
 */
export const RUNS = {
    // ========================================
    // DERCUM MOUNTAIN - Frontside
    // ========================================

    // GREEN RUNS
    schoolmarm: {
        name: 'Schoolmarm',
        difficulty: DIFFICULTY.GREEN,
        description: 'Longest run at Keystone - 3.5 miles',
        points: [
            { x: -100, z: 80 },    // Summit
            { x: -120, z: 120 },
            { x: -150, z: 180 },
            { x: -180, z: 250 },
            { x: -200, z: 320 },
            { x: -220, z: 400 },
            { x: -180, z: 480 },
            { x: -140, z: 550 }    // Base
        ]
    },

    lastChance: {
        name: 'Last Chance',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -80, z: 90 },
            { x: -60, z: 150 },
            { x: -40, z: 220 },
            { x: -30, z: 300 },
            { x: -50, z: 400 },
            { x: -80, z: 500 },
            { x: -100, z: 550 }
        ]
    },

    frenchman: {
        name: 'Frenchman',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -140, z: 100 },
            { x: -170, z: 150 },
            { x: -200, z: 220 },
            { x: -220, z: 300 },
            { x: -200, z: 400 }
        ]
    },

    ina: {
        name: "Ina's Way",
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -60, z: 200 },
            { x: -40, z: 280 },
            { x: -20, z: 360 },
            { x: 0, z: 450 },
            { x: -20, z: 520 }
        ]
    },

    // BLUE RUNS
    flyingDutchman: {
        name: 'Flying Dutchman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -90, z: 85 },
            { x: -70, z: 130 },
            { x: -45, z: 190 },
            { x: -30, z: 260 },
            { x: -50, z: 340 }
        ]
    },

    paymaster: {
        name: 'Paymaster',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -110, z: 90 },
            { x: -130, z: 140 },
            { x: -145, z: 200 },
            { x: -140, z: 280 },
            { x: -120, z: 360 }
        ]
    },

    silverSpoon: {
        name: 'Silver Spoon',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -50, z: 100 },
            { x: -25, z: 160 },
            { x: -10, z: 230 },
            { x: -20, z: 310 },
            { x: -40, z: 400 }
        ]
    },

    goDevil: {
        name: 'Go Devil',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -130, z: 95 },
            { x: -160, z: 160 },
            { x: -175, z: 240 },
            { x: -160, z: 320 },
            { x: -140, z: 400 }
        ]
    },

    santa: {
        name: 'Santa Fe',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 20, z: 150 },
            { x: 40, z: 220 },
            { x: 50, z: 300 },
            { x: 40, z: 380 },
            { x: 20, z: 460 }
        ]
    },

    // BLACK RUNS
    anticipation: {
        name: 'Anticipation',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -95, z: 85 },
            { x: -85, z: 120 },
            { x: -75, z: 165 },
            { x: -70, z: 220 },
            { x: -80, z: 280 }
        ]
    },

    geronimo: {
        name: 'Geronimo',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -105, z: 88 },
            { x: -95, z: 130 },
            { x: -90, z: 180 },
            { x: -100, z: 240 },
            { x: -110, z: 300 }
        ]
    },

    springDipper: {
        name: 'Spring Dipper',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -75, z: 90 },
            { x: -55, z: 140 },
            { x: -40, z: 200 },
            { x: -55, z: 270 }
        ]
    },

    starfire: {
        name: 'Starfire',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -145, z: 92 },
            { x: -170, z: 140 },
            { x: -190, z: 200 },
            { x: -180, z: 270 }
        ]
    },

    // ========================================
    // NORTH PEAK
    // ========================================

    // BLUE RUNS
    mozart: {
        name: 'Mozart',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 100, z: -100 },
            { x: 120, z: -40 },
            { x: 140, z: 30 },
            { x: 130, z: 100 },
            { x: 110, z: 180 }
        ]
    },

    catDancer: {
        name: 'Cat Dancer',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 90, z: -95 },
            { x: 70, z: -30 },
            { x: 55, z: 50 },
            { x: 70, z: 130 }
        ]
    },

    foxTrot: {
        name: 'Fox Trot',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 110, z: -90 },
            { x: 130, z: -20 },
            { x: 145, z: 60 },
            { x: 135, z: 140 }
        ]
    },

    prospector: {
        name: 'Prospector',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 80, z: -80 },
            { x: 60, z: -10 },
            { x: 45, z: 70 },
            { x: 60, z: 150 }
        ]
    },

    // BLACK RUNS
    spillway: {
        name: 'Spillway',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 95, z: -98 },
            { x: 85, z: -50 },
            { x: 75, z: 10 },
            { x: 85, z: 80 }
        ]
    },

    theSlot: {
        name: 'The Slot',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 105, z: -95 },
            { x: 120, z: -40 },
            { x: 130, z: 30 },
            { x: 120, z: 100 }
        ]
    },

    theWindows: {
        name: 'The Windows',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 85, z: -92 },
            { x: 65, z: -40 },
            { x: 50, z: 20 },
            { x: 65, z: 90 }
        ]
    },

    lowerWindows: {
        name: 'Lower Windows',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 55, z: 20 },
            { x: 40, z: 80 },
            { x: 35, z: 150 }
        ]
    },

    // ========================================
    // THE OUTBACK
    // ========================================

    // BLUE RUNS
    wildIrishman: {
        name: 'Wild Irishman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 350, z: -200 },
            { x: 320, z: -130 },
            { x: 290, z: -50 },
            { x: 260, z: 30 }
        ]
    },

    theOutback: {
        name: 'The Outback',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 340, z: -190 },
            { x: 310, z: -120 },
            { x: 280, z: -40 },
            { x: 250, z: 40 }
        ]
    },

    // BLACK RUNS
    theBlackForest: {
        name: 'The Black Forest',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 360, z: -195 },
            { x: 390, z: -130 },
            { x: 410, z: -50 },
            { x: 400, z: 30 }
        ]
    },

    timber: {
        name: 'Timber',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 370, z: -190 },
            { x: 395, z: -120 },
            { x: 380, z: -40 }
        ]
    },

    // DOUBLE BLACK RUNS (Bowls)
    northBowl: {
        name: 'North Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 280, z: -350 },
            { x: 290, z: -280 },
            { x: 285, z: -200 },
            { x: 270, z: -120 }
        ]
    },

    southBowl: {
        name: 'South Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 380, z: -280 },
            { x: 370, z: -210 },
            { x: 355, z: -140 },
            { x: 340, z: -70 }
        ]
    },

    pumaBowl: {
        name: 'Puma Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 400, z: -250 },
            { x: 420, z: -180 },
            { x: 410, z: -100 }
        ]
    },

    // ========================================
    // BOWL AREAS
    // ========================================

    independenceBowl: {
        name: 'Independence Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: -350, z: -100 },
            { x: -320, z: -30 },
            { x: -280, z: 50 },
            { x: -240, z: 120 }
        ]
    },

    bergmanBowl: {
        name: 'Bergman Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: -50, z: -280 },
            { x: -30, z: -200 },
            { x: -10, z: -120 },
            { x: 10, z: -40 }
        ]
    },

    ericksonBowl: {
        name: 'Erickson Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 50, z: -320 },
            { x: 70, z: -240 },
            { x: 85, z: -160 },
            { x: 80, z: -80 }
        ]
    }
};

/**
 * Get all runs as an array for iteration
 */
export function getAllRuns() {
    return Object.entries(RUNS).map(([id, run]) => ({
        id,
        ...run
    }));
}

/**
 * Get runs filtered by difficulty
 */
export function getRunsByDifficulty(difficulty) {
    return getAllRuns().filter(run => run.difficulty === difficulty);
}
