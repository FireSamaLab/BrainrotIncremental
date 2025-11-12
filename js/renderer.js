// Renderer - Draws the game world
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.canvas.width = CONFIG.VIEWPORT_WIDTH;
        this.canvas.height = CONFIG.VIEWPORT_HEIGHT;
    }

    clear() {
        this.ctx.fillStyle = CONFIG.COLORS.GRASS;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw the outside world
    drawWorld(map, camera) {
        const startTileX = Math.floor(camera.x / CONFIG.TILE_SIZE);
        const startTileY = Math.floor(camera.y / CONFIG.TILE_SIZE);
        const endTileX = Math.ceil((camera.x + CONFIG.VIEWPORT_WIDTH) / CONFIG.TILE_SIZE);
        const endTileY = Math.ceil((camera.y + CONFIG.VIEWPORT_HEIGHT) / CONFIG.TILE_SIZE);

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                if (x >= 0 && x < map.tilesWide && y >= 0 && y < map.tilesTall) {
                    const worldX = x * CONFIG.TILE_SIZE;
                    const worldY = y * CONFIG.TILE_SIZE;
                    const screenPos = camera.worldToScreen(worldX, worldY);
                    
                    const tileType = map.tiles[y][x];
                    this.drawTile(screenPos.x, screenPos.y, tileType, x, y);
                }
            }
        }

        // Draw buildings
        map.buildings.forEach(building => {
            if (camera.isVisible(building.x, building.y, building.width, building.height)) {
                const screenPos = camera.worldToScreen(building.x, building.y);
                this.drawBuilding(screenPos.x, screenPos.y, building.width, building.height, building.isLarge);
            }
        });
    }

    drawTile(x, y, type, tileX, tileY) {
        switch(type) {
            case TILE_TYPES.GRASS:
                this.drawGrass(x, y, tileX, tileY);
                break;
            case TILE_TYPES.PATH:
                this.drawPath(x, y);
                break;
            case TILE_TYPES.TREE:
                this.drawTree(x, y, tileX, tileY);
                break;
            case TILE_TYPES.WATER:
                this.drawWater(x, y, tileX, tileY);
                break;
        }
    }

    drawGrass(x, y, tileX, tileY) {
        // Alternate between grass shades for variety
        const variant = (tileX + tileY) % 3;
        this.ctx.fillStyle = variant === 0 ? CONFIG.COLORS.DARK_GRASS : CONFIG.COLORS.GRASS;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Add grass details
        if (variant === 1) {
            this.ctx.fillStyle = CONFIG.COLORS.DARK_GRASS;
            this.ctx.fillRect(x + 8, y + 12, 2, 3);
            this.ctx.fillRect(x + 20, y + 18, 2, 3);
        }
    }

    drawPath(x, y) {
        this.ctx.fillStyle = CONFIG.COLORS.PATH;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Path texture
        this.ctx.fillStyle = CONFIG.COLORS.PATH_EDGE;
        this.ctx.fillRect(x + 2, y + 2, 2, 2);
        this.ctx.fillRect(x + 28, y + 28, 2, 2);
        this.ctx.fillRect(x + 16, y + 16, 2, 2);
    }

    drawTree(x, y, tileX, tileY) {
        // Tree foliage
        this.ctx.fillStyle = CONFIG.COLORS.TREE_GREEN;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Add darker shade for depth
        this.ctx.fillStyle = CONFIG.COLORS.TREE_DARK;
        this.ctx.fillRect(x + 4, y + 4, CONFIG.TILE_SIZE - 8, CONFIG.TILE_SIZE - 8);
        
        // Trunk hint at bottom
        if ((tileX + tileY) % 2 === 0) {
            this.ctx.fillStyle = CONFIG.COLORS.TREE_TRUNK;
            this.ctx.fillRect(x + 12, y + 24, 8, 6);
        }
    }

    drawWater(x, y, tileX, tileY) {
        // Water base
        this.ctx.fillStyle = CONFIG.COLORS.WATER;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Water shimmer effect
        const shimmer = (tileX + tileY) % 4;
        if (shimmer === 0) {
            this.ctx.fillStyle = CONFIG.COLORS.WATER_LIGHT;
            this.ctx.fillRect(x + 8, y + 8, 4, 4);
        } else if (shimmer === 2) {
            this.ctx.fillStyle = CONFIG.COLORS.WATER_DARK;
            this.ctx.fillRect(x + 20, y + 20, 4, 4);
        }
    }

    drawBuilding(x, y, width, height, isLarge = false) {
        const roofHeight = 20;
        
        // Main building body
        this.ctx.fillStyle = CONFIG.COLORS.BUILDING;
        this.ctx.fillRect(x, y + roofHeight, width, height - roofHeight);
        
        // Building shadow
        this.ctx.fillStyle = CONFIG.COLORS.BUILDING_DARK;
        this.ctx.fillRect(x + 4, y + height - 12, width - 8, 8);
        
        // Roof
        this.ctx.fillStyle = CONFIG.COLORS.ROOF_RED;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8, y + roofHeight);
        this.ctx.lineTo(x + width/2, y);
        this.ctx.lineTo(x + width + 8, y + roofHeight);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Roof shadow
        this.ctx.fillStyle = CONFIG.COLORS.ROOF_DARK;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width/2, y);
        this.ctx.lineTo(x + width + 8, y + roofHeight);
        this.ctx.lineTo(x + width/2, y + roofHeight);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Door
        const doorX = x + width/2 - 12;
        const doorY = y + height - 28;
        this.ctx.fillStyle = CONFIG.COLORS.DOOR;
        this.ctx.fillRect(doorX, doorY, 24, 28);
        
        // Door frame
        this.ctx.strokeStyle = CONFIG.COLORS.BUILDING_DARK;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(doorX, doorY, 24, 28);
        
        // Windows
        if (isLarge) {
            this.drawWindow(x + 15, y + 30);
            this.drawWindow(x + 40, y + 30);
            this.drawWindow(x + width - 31, y + 30);
            this.drawWindow(x + width - 56, y + 30);
        } else {
            this.drawWindow(x + 10, y + 25);
            this.drawWindow(x + width - 26, y + 25);
        }
    }

    drawWindow(x, y) {
        this.ctx.fillStyle = CONFIG.COLORS.WINDOW;
        this.ctx.fillRect(x, y, 16, 16);
        
        // Window frame
        this.ctx.strokeStyle = CONFIG.COLORS.BUILDING_DARK;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, 16, 16);
        
        // Window cross
        this.ctx.beginPath();
        this.ctx.moveTo(x + 8, y);
        this.ctx.lineTo(x + 8, y + 16);
        this.ctx.moveTo(x, y + 8);
        this.ctx.lineTo(x + 16, y + 8);
        this.ctx.stroke();
    }

    // Draw interior
    drawInterior(interior) {
        // Floor
        for (let y = 0; y < interior.height; y += CONFIG.TILE_SIZE) {
            for (let x = 0; x < interior.width; x += CONFIG.TILE_SIZE) {
                const variant = (x + y) / CONFIG.TILE_SIZE % 2;
                this.ctx.fillStyle = variant === 0 ? CONFIG.COLORS.FLOOR_WOOD : CONFIG.COLORS.FLOOR_LIGHT;
                this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
            }
        }
        
        // Walls
        this.ctx.fillStyle = CONFIG.COLORS.WALL;
        this.ctx.fillRect(0, 0, interior.width, CONFIG.TILE_SIZE); // Top
        this.ctx.fillRect(0, 0, CONFIG.TILE_SIZE, interior.height); // Left
        this.ctx.fillRect(interior.width - CONFIG.TILE_SIZE, 0, CONFIG.TILE_SIZE, interior.height); // Right
        this.ctx.fillRect(0, interior.height - CONFIG.TILE_SIZE, interior.width, CONFIG.TILE_SIZE); // Bottom
        
        // Draw furniture
        interior.furniture.forEach(item => {
            this.drawFurniture(
                item.x * CONFIG.TILE_SIZE,
                item.y * CONFIG.TILE_SIZE,
                item.width * CONFIG.TILE_SIZE,
                item.height * CONFIG.TILE_SIZE,
                item.type
            );
        });
        
        // Exit door
        const doorX = interior.exitDoor.x;
        const doorY = interior.exitDoor.y;
        this.ctx.fillStyle = CONFIG.COLORS.DOOR;
        this.ctx.fillRect(doorX, doorY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    }

    drawFurniture(x, y, width, height, type) {
        switch(type) {
            case 'bed':
                this.ctx.fillStyle = CONFIG.COLORS.FURNITURE;
                this.ctx.fillRect(x, y, width, height);
                this.ctx.fillStyle = '#ff6666';
                this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
                break;
            case 'table':
                this.ctx.fillStyle = CONFIG.COLORS.FURNITURE;
                this.ctx.fillRect(x, y, width, height);
                break;
            case 'chair':
                this.ctx.fillStyle = CONFIG.COLORS.FURNITURE;
                this.ctx.fillRect(x, y, width, height);
                break;
            case 'bookshelf':
                this.ctx.fillStyle = CONFIG.COLORS.FURNITURE;
                this.ctx.fillRect(x, y, width, height);
                this.ctx.fillStyle = '#666';
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillRect(x + 2, y + 8 + i * 16, width - 4, 2);
                }
                break;
            case 'counter':
                this.ctx.fillStyle = CONFIG.COLORS.FURNITURE;
                this.ctx.fillRect(x, y, width, height);
                break;
            case 'rug':
                this.ctx.fillStyle = CONFIG.COLORS.RUG_RED;
                this.ctx.fillRect(x, y, width, height);
                this.ctx.fillStyle = CONFIG.COLORS.RUG_DARK;
                this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
                break;
        }
    }

    // Draw entities
    drawSprite(sprite, x, y, width, height) {
        // Draw sprite image
        this.ctx.drawImage(sprite, x, y, width, height);
        
        // Optional: Add shadow under sprite
        this.ctx.fillStyle = CONFIG.COLORS.SHADOW;
        this.ctx.beginPath();
        this.ctx.ellipse(x + width/2, y + height + 2, width/2, width/4, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawDot(x, y, color, size = CONFIG.PLAYER_SIZE) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Shadow
        this.ctx.fillStyle = CONFIG.COLORS.SHADOW;
        this.ctx.beginPath();
        this.ctx.ellipse(x + size/2, y + size + 2, size/2, size/4, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawInteractionPrompt(x, y) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x + 2, y - 15, 20, 12);
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('!', x + 12, y - 5);
    }
}
