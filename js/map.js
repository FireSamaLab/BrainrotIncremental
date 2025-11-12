// Map layout for Noxis Town
class GameMap {
    constructor() {
        this.width = CONFIG.WORLD_WIDTH;
        this.height = CONFIG.WORLD_HEIGHT;
        this.tileSize = CONFIG.TILE_SIZE;
        this.tilesWide = Math.floor(this.width / this.tileSize);
        this.tilesTall = Math.floor(this.height / this.tileSize);
        
        // Create tile grid
        this.tiles = this.createTileGrid();
        
        // Define buildings
        this.buildings = this.createBuildings();
        
        // Define doors (entrance points)
        this.doors = this.createDoors();
        
        // Define interiors
        this.interiors = this.createInteriors();
        
        // Current location
        this.currentMap = 'outside';
    }

    createTileGrid() {
        const grid = [];
        for (let y = 0; y < this.tilesTall; y++) {
            const row = [];
            for (let x = 0; x < this.tilesWide; x++) {
                row.push(this.determineTileType(x, y));
            }
            grid.push(row);
        }
        return grid;
    }

    determineTileType(x, y) {
        // Top border - dense trees (rows 0-3)
        if (y < 4) return TILE_TYPES.TREE;
        
        // Left and right borders - trees
        if (x < 2 || x >= this.tilesWide - 2) return TILE_TYPES.TREE;
        
        // Bottom border - trees
        if (y >= this.tilesTall - 2) return TILE_TYPES.TREE;
        
        // Pond area (bottom left) - matches reference image position
        if (x >= 3 && x <= 7 && y >= 28 && y <= 33) {
            return TILE_TYPES.WATER;
        }
        
        // Main horizontal path through middle (connecting everything)
        if (y >= 13 && y <= 15) {
            return TILE_TYPES.PATH;
        }
        
        // Path to House 1 (top left) - U shape
        // Vertical part from main path
        if (x >= 10 && x <= 11 && y >= 5 && y <= 13) {
            return TILE_TYPES.PATH;
        }
        // Horizontal part at bottom of house to door
        if (x >= 8 && x <= 11 && y >= 11 && y <= 12) {
            return TILE_TYPES.PATH;
        }
        
        // Path to House 2 (top right) - U shape
        // Vertical part from main path
        if (x >= 20 && x <= 21 && y >= 5 && y <= 13) {
            return TILE_TYPES.PATH;
        }
        // Horizontal part at bottom of house to door
        if (x >= 18 && x <= 21 && y >= 11 && y <= 12) {
            return TILE_TYPES.PATH;
        }
        
        // Path to Large Building (bottom center/left) - U shape
        // Vertical part from main path
        if (x >= 11 && x <= 12 && y >= 15 && y <= 16) {
            return TILE_TYPES.PATH;
        }
        // Horizontal part at bottom of building to door
        if (x >= 8 && x <= 12 && y >= 22 && y <= 23) {
            return TILE_TYPES.PATH;
        }
        
        // Path to Your House (bottom right) - U shape
        // Vertical part from main path
        if (x >= 20 && x <= 21 && y >= 15 && y <= 22) {
            return TILE_TYPES.PATH;
        }
        // Horizontal part at bottom of house to door
        if (x >= 18 && x <= 21 && y >= 27 && y <= 28) {
            return TILE_TYPES.PATH;
        }
        
        // Default to grass
        return TILE_TYPES.GRASS;
    }

    createBuildings() {
        return [
            // House 1 (top left) - like reference image
            {
                id: 'house1',
                x: 8 * this.tileSize,
                y: 6 * this.tileSize,
                width: 6 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 10.5 * this.tileSize,
                doorY: 10.5 * this.tileSize,
                spriteUrl: SPRITES.HOUSE_GREEN
            },
            // House 2 (top right) - like reference image
            {
                id: 'house2',
                x: 18 * this.tileSize,
                y: 6 * this.tileSize,
                width: 6 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 20.5 * this.tileSize,
                doorY: 10.5 * this.tileSize,
                spriteUrl: SPRITES.HOUSE_GREEN
            },
            // Your house (bottom right) - smaller house
            {
                id: 'house3',
                x: 18 * this.tileSize,
                y: 22 * this.tileSize,
                width: 5 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 20.5 * this.tileSize,
                doorY: 26.5 * this.tileSize,
                spriteUrl: SPRITES.HOUSE_GREEN
            },
            // Large building (bottom center/left) - like the mart in reference
            {
                id: 'building1',
                x: 8 * this.tileSize,
                y: 16 * this.tileSize,
                width: 8 * this.tileSize,
                height: 6 * this.tileSize,
                doorX: 11.5 * this.tileSize,
                doorY: 21.5 * this.tileSize,
                isLarge: true,
                spriteUrl: SPRITES.HOUSE_GREEN // Using same sprite for now, can change later
            }
        ];
    }

    createDoors() {
        return this.buildings.map(building => ({
            id: building.id,
            x: building.doorX,
            y: building.doorY,
            width: this.tileSize,
            height: this.tileSize,
            targetMap: building.id + '_interior'
        }));
    }

    createInteriors() {
        const interiors = {};
        
        // House 1 interior
        interiors['house1_interior'] = {
            width: 13 * this.tileSize,
            height: 10 * this.tileSize,
            exitDoor: { x: 6.5 * this.tileSize, y: 9 * this.tileSize },
            furniture: [
                { type: 'bed', x: 2, y: 2, width: 2, height: 2 },
                { type: 'table', x: 8, y: 3, width: 2, height: 1 },
                { type: 'rug', x: 5, y: 4, width: 3, height: 2 }
            ],
            npc: 'YELLOW'
        };
        
        // House 2 interior
        interiors['house2_interior'] = {
            width: 13 * this.tileSize,
            height: 10 * this.tileSize,
            exitDoor: { x: 6.5 * this.tileSize, y: 9 * this.tileSize },
            furniture: [
                { type: 'bed', x: 9, y: 2, width: 2, height: 2 },
                { type: 'bookshelf', x: 2, y: 2, width: 1, height: 2 },
                { type: 'rug', x: 5, y: 5, width: 3, height: 2 }
            ],
            npc: 'GREEN'
        };
        
        // House 3 interior (your house)
        interiors['house3_interior'] = {
            width: 13 * this.tileSize,
            height: 10 * this.tileSize,
            exitDoor: { x: 6.5 * this.tileSize, y: 9 * this.tileSize },
            furniture: [
                { type: 'bed', x: 2, y: 2, width: 2, height: 2 },
                { type: 'table', x: 8, y: 2, width: 2, height: 1 },
                { type: 'chair', x: 8, y: 3, width: 1, height: 1 },
                { type: 'rug', x: 5, y: 5, width: 3, height: 2 }
            ]
        };
        
        // Large building interior
        interiors['building1_interior'] = {
            width: 16 * this.tileSize,
            height: 10 * this.tileSize,
            exitDoor: { x: 8 * this.tileSize, y: 9 * this.tileSize },
            furniture: [
                { type: 'counter', x: 3, y: 2, width: 4, height: 1 },
                { type: 'counter', x: 9, y: 2, width: 4, height: 1 },
                { type: 'rug', x: 6, y: 6, width: 4, height: 2 }
            ]
        };
        
        return interiors;
    }

    getTileAt(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        if (tileX < 0 || tileX >= this.tilesWide || tileY < 0 || tileY >= this.tilesTall) {
            return TILE_TYPES.TREE; // Out of bounds
        }
        
        return this.tiles[tileY][tileX];
    }

    isSolid(x, y, width, height) {
        // Check tile collisions (trees, water)
        const points = [
            { x: x, y: y },
            { x: x + width, y: y },
            { x: x, y: y + height },
            { x: x + width, y: y + height },
            { x: x + width/2, y: y + height/2 }
        ];
        
        for (let point of points) {
            const tile = this.getTileAt(point.x, point.y);
            if (tile === TILE_TYPES.TREE || tile === TILE_TYPES.WATER) {
                return true;
            }
        }
        
        // Check building collisions
        for (let building of this.buildings) {
            if (this.boxIntersect(
                { x, y, width, height },
                { x: building.x, y: building.y, width: building.width, height: building.height }
            )) {
                return true;
            }
        }
        
        return false;
    }

    boxIntersect(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    checkDoorCollision(x, y, width, height) {
        const playerCenter = {
            x: x + width / 2,
            y: y + height / 2
        };
        
        for (let door of this.doors) {
            const dx = Math.abs(playerCenter.x - door.x);
            const dy = Math.abs(playerCenter.y - door.y);
            
            if (dx < this.tileSize && dy < this.tileSize) {
                return door;
            }
        }
        
        return null;
    }
}
