// Game Configuration for Noxis Town
const CONFIG = {
    // Display settings
    VIEWPORT_WIDTH: 800,
    VIEWPORT_HEIGHT: 600,
    TILE_SIZE: 32,
    
    // World settings
    WORLD_WIDTH: 1600,  // 50 tiles wide
    WORLD_HEIGHT: 1600, // 50 tiles tall
    
    // Player settings
    PLAYER_SPEED: 3,
    PLAYER_SIZE: 16,
    
    // NPC settings
    NPC_SIZE: 16,
    NPC_WANDER_SPEED: 1,
    NPC_WANDER_PAUSE: 2000, // ms between movements
    
    // Interaction
    INTERACTION_RANGE: 40,
    
    // Colors (Pokemon GBA palette)
    COLORS: {
        // Terrain
        GRASS: '#8bac0f',
        DARK_GRASS: '#609048',
        PATH: '#c4c4a0',
        PATH_EDGE: '#a8a888',
        
        // Nature
        TREE_GREEN: '#306230',
        TREE_DARK: '#0f380f',
        TREE_TRUNK: '#785048',
        
        // Water
        WATER: '#4890d0',
        WATER_DARK: '#3070a8',
        WATER_LIGHT: '#68b0f0',
        
        // Buildings
        ROOF_RED: '#d84848',
        ROOF_DARK: '#a03030',
        BUILDING: '#e8d0a0',
        BUILDING_DARK: '#c0a878',
        DOOR: '#785048',
        WINDOW: '#87ceeb',
        WALL: '#f8f8e8',
        
        // Interior
        FLOOR_WOOD: '#c89860',
        FLOOR_LIGHT: '#d8a870',
        RUG_RED: '#d84848',
        RUG_DARK: '#a03030',
        FURNITURE: '#987050',
        
        // Entities
        PLAYER: '#ff0000',        // RED
        NPC_YELLOW: '#ffff00',    // YELLOW
        NPC_GREEN: '#00ff00',     // GREEN
        NPC_ORANGE: '#ff8800',    // ORANGE
        NPC_BLUE: '#0088ff',      // BLUE
        
        // UI
        TEXT: '#0f380f',
        SHADOW: 'rgba(0, 0, 0, 0.3)'
    }
};

// Tile types for collision and rendering
const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    TREE: 2,
    WATER: 3,
    BUILDING: 4,
    DOOR: 5,
    INTERIOR_FLOOR: 6,
    INTERIOR_WALL: 7,
    FURNITURE: 8
};

// Sprite URLs
const SPRITES = {
    NPC_01: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/NPC/NPC%2001.png',
    NPC_02: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/NPC/NPC%2002.png',
    NPC_03: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/NPC/NPC%2003.png',
    NPC_04: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/NPC/NPC%2004.png',
    PLAYER: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/NPC/MAINCHARACTER.png',
    HOUSE_GREEN: 'https://raw.githubusercontent.com/FireSamaLab/BrainrotIncremental/main/Assets/Building/House_Green.png',
};

// Sprite Animation Configuration  
// Your sprite layout: Row 0=Down, Row 1=Left, Row 2=Right, Row 3=Up
const SPRITE_CONFIG = {
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 48,  // Character is taller - was 32, now 48
    FRAMES_PER_ROW: 3,
    ANIMATION_SPEED: 150,
    
    // Direction to row mapping matches your sprite sheet perfectly
    DIRECTIONS: {
        down: 0,   // Row 0 = Down ✓
        left: 1,   // Row 1 = Left ✓
        right: 2,  // Row 2 = Right ✓
        up: 3      // Row 3 = Up ✓
    }
};

// NPC Dialogs
const NPC_DATA = {
    YELLOW: {
        name: "Yellow Resident",
        color: CONFIG.COLORS.NPC_YELLOW,
        spriteUrl: SPRITES.NPC_01,
        location: 'house1',
        dialogs: [
            "Welcome to Noxis!|This is a peaceful town.",
            "I love living here.|The air is so fresh!",
            "Have you explored the whole town yet?"
        ]
    },
    GREEN: {
        name: "Green Resident",
        color: CONFIG.COLORS.NPC_GREEN,
        spriteUrl: SPRITES.NPC_02,
        location: 'house2',
        dialogs: [
            "Hello there!|Nice to meet you.",
            "I'm the Green resident.|I've lived here for years.",
            "The pond is beautiful this time of year!"
        ]
    },
    ORANGE: {
        name: "Orange Wanderer",
        color: CONFIG.COLORS.NPC_ORANGE,
        spriteUrl: SPRITES.NPC_03,
        location: 'outside',
        dialogs: [
            "I like to walk around town.|It helps me think.",
            "Have you seen the pond?|It's quite relaxing.",
            "This town has a nice layout, doesn't it?"
        ]
    },
    BLUE: {
        name: "Blue Wanderer",
        color: CONFIG.COLORS.NPC_BLUE,
        spriteUrl: SPRITES.NPC_04,
        location: 'outside',
        dialogs: [
            "Hello!|I'm just enjoying the day.",
            "I love exploring Noxis.|There's always something new to see.",
            "The trees here are so green and healthy!"
        ]
    }
};
