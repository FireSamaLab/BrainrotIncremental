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
        
        // Pond area (bottom left, around tile 8-15, 35-42)
        if (x >= 8 && x <= 15 && y >= 35 && y <= 42) {
            return TILE_TYPES.WATER;
        }
        
        // Main horizontal path (around row 24-26)
        if (y >= 24 && y <= 26) {
            return TILE_TYPES.PATH;
        }
        
        // Vertical paths to houses
        // Path to house 1 (around column 15)
        if (x >= 14 && x <= 16 && y >= 8 && y <= 24) {
            return TILE_TYPES.PATH;
        }
        
        // Path to house 2 (around column 30)
        if (x >= 29 && x <= 31 && y >= 8 && y <= 24) {
            return TILE_TYPES.PATH;
        }
        
        // Path to your house (around column 38)
        if (x >= 37 && x <= 39 && y >= 26 && y <= 38) {
            return TILE_TYPES.PATH;
        }
        
        // Path to larger building (around column 28)
        if (x >= 27 && x <= 29 && y >= 26 && y <= 38) {
            return TILE_TYPES.PATH;
        }
        
        // Default to grass
        return TILE_TYPES.GRASS;
    }

    createBuildings() {
        return [
            // House 1 (top left)
            {
                id: 'house1',
                x: 12 * this.tileSize,
                y: 5 * this.tileSize,
                width: 5 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 14.5 * this.tileSize,
                doorY: 9.5 * this.tileSize
            },
            // House 2 (top right)
            {
                id: 'house2',
                x: 27 * this.tileSize,
                y: 5 * this.tileSize,
                width: 5 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 29.5 * this.tileSize,
                doorY: 9.5 * this.tileSize
            },
            // Your house (bottom right)
            {
                id: 'house3',
                x: 35 * this.tileSize,
                y: 32 * this.tileSize,
                width: 5 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 37.5 * this.tileSize,
                doorY: 36.5 * this.tileSize
            },
            // Large building (bottom middle)
            {
                id: 'building1',
                x: 22 * this.tileSize,
                y: 32 * this.tileSize,
                width: 7 * this.tileSize,
                height: 5 * this.tileSize,
                doorX: 25.5 * this.tileSize,
                doorY: 36.5 * this.tileSize,
                isLarge: true
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
        // Check all corners and center
        const points = [
            { x: x, y: y },
            { x: x + width, y: y },
            { x: x, y: y + height },
            { x: x + width, y: y + height },
            { x: x + width/2, y: y + height/2 }
        ];
        
        for (let point of points) {
            const tile = this.getTileAt(point.x, point.y);
            if (tile === TILE_TYPES.TREE || tile === TILE_TYPES.WATER || tile === TILE_TYPES.BUILDING) {
                return true;
            }
        }
        
        return false;
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
