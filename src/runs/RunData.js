/**
 * Run data - coordinates updated for new broad terrain
 * Using normalized coordinates that work with the plateau-style terrain
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

// Coordinates scaled for new 2400x2000 terrain
export const RUNS = {
    // DERCUM MOUNTAIN - Frontside (center-left area)
    schoolmarm: {
        name: 'Schoolmarm',
        difficulty: DIFFICULTY.GREEN,
        description: 'Longest run - 3.5 miles',
        points: [
            { x: -120, z: -100 },
            { x: -180, z: 100 },
            { x: -250, z: 300 },
            { x: -300, z: 500 },
            { x: -280, z: 700 },
            { x: -220, z: 850 }
        ]
    },

    lastChance: {
        name: 'Last Chance',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -80, z: -80 },
            { x: -40, z: 120 },
            { x: 0, z: 320 },
            { x: -40, z: 520 },
            { x: -100, z: 720 },
            { x: -140, z: 850 }
        ]
    },

    frenchman: {
        name: 'Frenchman',
        difficulty: DIFFICULTY.GREEN,
        points: [
            { x: -200, z: -50 },
            { x: -280, z: 150 },
            { x: -350, z: 350 },
            { x: -380, z: 550 },
            { x: -340, z: 750 }
        ]
    },

    silverspoon: {
        name: 'Silver Spoon',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -60, z: -90 },
            { x: 20, z: 100 },
            { x: 60, z: 300 },
            { x: 40, z: 500 },
            { x: -20, z: 700 }
        ]
    },

    paymaster: {
        name: 'Paymaster',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -140, z: -70 },
            { x: -180, z: 130 },
            { x: -220, z: 330 },
            { x: -240, z: 530 }
        ]
    },

    flyingDutchman: {
        name: 'Flying Dutchman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: -100, z: -85 },
            { x: -60, z: 100 },
            { x: -30, z: 280 },
            { x: -60, z: 460 },
            { x: -120, z: 640 }
        ]
    },

    anticipation: {
        name: 'Anticipation',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -90, z: -95 },
            { x: -50, z: 50 },
            { x: -20, z: 200 },
            { x: -50, z: 350 }
        ]
    },

    geronimo: {
        name: 'Geronimo',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: -110, z: -90 },
            { x: -80, z: 60 },
            { x: -60, z: 210 },
            { x: -90, z: 360 }
        ]
    },

    // NORTH PEAK (center-right, behind Dercum)
    mozart: {
        name: 'Mozart',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 180, z: -350 },
            { x: 220, z: -180 },
            { x: 240, z: 0 },
            { x: 200, z: 180 }
        ]
    },

    catDancer: {
        name: 'Cat Dancer',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 140, z: -340 },
            { x: 100, z: -160 },
            { x: 80, z: 20 },
            { x: 120, z: 200 }
        ]
    },

    spillway: {
        name: 'Spillway',
        difficulty: DIFFICULTY.BLACK,
        points: [
            { x: 160, z: -345 },
            { x: 140, z: -180 },
            { x: 120, z: -20 },
            { x: 150, z: 140 }
        ]
    },

    // THE OUTBACK (far right)
    wildIrishman: {
        name: 'Wild Irishman',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 600, z: -400 },
            { x: 540, z: -240 },
            { x: 480, z: -80 },
            { x: 440, z: 80 }
        ]
    },

    theOutback: {
        name: 'The Outback',
        difficulty: DIFFICULTY.BLUE,
        points: [
            { x: 580, z: -390 },
            { x: 520, z: -230 },
            { x: 460, z: -70 },
            { x: 420, z: 90 }
        ]
    },

    // BOWLS
    independenceBowl: {
        name: 'Independence Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: -660, z: -200 },
            { x: -580, z: -50 },
            { x: -500, z: 100 },
            { x: -420, z: 250 }
        ]
    },

    bergmanBowl: {
        name: 'Bergman Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 0, z: -550 },
            { x: 40, z: -400 },
            { x: 70, z: -250 },
            { x: 80, z: -100 }
        ]
    },

    ericksonBowl: {
        name: 'Erickson Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 180, z: -600 },
            { x: 200, z: -450 },
            { x: 210, z: -300 },
            { x: 190, z: -150 }
        ]
    },

    northBowl: {
        name: 'North Bowl',
        difficulty: DIFFICULTY.DOUBLE,
        points: [
            { x: 600, z: -600 },
            { x: 580, z: -460 },
            { x: 550, z: -320 },
            { x: 520, z: -180 }
        ]
    }
};

export function getAllRuns() {
    return Object.entries(RUNS).map(([id, run]) => ({ id, ...run }));
}

export function getRunsByDifficulty(difficulty) {
    return getAllRuns().filter(run => run.difficulty === difficulty);
}
