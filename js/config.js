// Game Configuration
const CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 32,
    PLAYER_SPEED: 2,
    
    // Colors (Pokemon GBA palette)
    COLORS: {
        GRASS: '#8bac0f',
        DARK_GRASS: '#306230',
        PATH: '#c4c4a0',
        WALL: '#505040',
        ROOF_RED: '#d84848',
        ROOF_DARK: '#a03030',
        BUILDING: '#e8d0a0',
        BUILDING_DARK: '#c0a878',
        DOOR: '#785048',
        WINDOW: '#87ceeb',
        PLAYER: '#3850b8',
        NPC: '#e8a048',
        TEXT: '#0f380f'
    }
};

// Upgrades available in shop
const UPGRADES = [
    {
        id: 'neuron_1',
        name: 'Basic Neuron',
        description: 'A simple neuron that generates thoughts',
        baseCost: 10,
        baseIncome: 1,
        costMultiplier: 1.15,
        owned: 0
    },
    {
        id: 'synapse_1',
        name: 'Synapse Network',
        description: 'Connected neurons work better together',
        baseCost: 100,
        baseIncome: 8,
        costMultiplier: 1.15,
        owned: 0
    },
    {
        id: 'dendrite_1',
        name: 'Dendrite Cluster',
        description: 'Enhanced neural pathways',
        baseCost: 1100,
        baseIncome: 47,
        costMultiplier: 1.14,
        owned: 0
    },
    {
        id: 'cortex_1',
        name: 'Cortex Module',
        description: 'Advanced processing power',
        baseCost: 12000,
        baseIncome: 260,
        costMultiplier: 1.13,
        owned: 0
    },
    {
        id: 'brain_1',
        name: 'Mini Brain',
        description: 'A complete thinking system',
        baseCost: 130000,
        baseIncome: 1400,
        costMultiplier: 1.12,
        owned: 0
    }
];

// NPC Dialogs
const DIALOGS = {
    SHOPKEEPER: [
        "Welcome to the Brain Shop!|I sell neural upgrades that generate money over time.",
        "The more neurons you have, the more you can think!|And thinking generates money!",
        "Come back anytime you want to upgrade your brain power!"
    ],
    SCIENTIST: [
        "Did you know?|Your brain has billions of neurons!",
        "Neural networks are fascinating...|Keep building yours!",
        "The human brain is the most complex structure in the known universe!"
    ],
    HOUSE_KEEPER: [
        "This is your neural storage facility.|All your upgrades are kept safe here!",
        "I can feel the brain power emanating from this place!",
        "Your collection is growing nicely!"
    ]
};
