// World class - manages the game map and objects
class World {
    constructor() {
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
        
        // Buildings with collision boxes
        this.buildings = [
            // Player's house (left side)
            { x: 50, y: 100, width: 3, height: 3, type: 'house' },
            
            // Shop (right side)
            { x: 600, y: 100, width: 3, height: 3, type: 'shop' },
            
            // Scientist's house (bottom center)
            { x: 350, y: 400, width: 2.5, height: 2.5, type: 'house' }
        ];
        
        // Collision boxes for buildings
        this.collisionBoxes = this.buildings.map(b => ({
            x: b.x - 10,
            y: b.y - 10,
            width: b.width * CONFIG.TILE_SIZE + 20,
            height: b.height * CONFIG.TILE_SIZE + 20
        }));
        
        // NPCs
        this.npcs = [
            new NPC(660, 250, 'SHOPKEEPER', CONFIG.COLORS.NPC),
            new NPC(110, 250, 'HOUSE_KEEPER', '#e848e8'),
            new NPC(400, 520, 'SCIENTIST', '#48e8e8')
        ];
        
        // Add NPC collision boxes
        this.npcs.forEach(npc => {
            this.collisionBoxes.push({
                x: npc.x - 5,
                y: npc.y - 5,
                width: npc.width + 10,
                height: npc.height + 10
            });
        });
    }

    checkCollision(x, y, width, height) {
        const playerBox = { x, y, width, height };
        
        return this.collisionBoxes.some(box => 
            this.boxIntersect(playerBox, box)
        );
    }

    boxIntersect(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    getNearbyNPC(player) {
        return this.npcs.find(npc => npc.canInteract(player));
    }

    draw(renderer) {
        // Draw grass background
        for (let y = 0; y < this.height; y += CONFIG.TILE_SIZE) {
            for (let x = 0; x < this.width; x += CONFIG.TILE_SIZE) {
                const variant = (x / CONFIG.TILE_SIZE + y / CONFIG.TILE_SIZE) % 4;
                renderer.drawGrass(x, y, variant);
            }
        }
        
        // Draw path
        const pathY = 280;
        for (let x = 0; x < this.width; x += CONFIG.TILE_SIZE) {
            renderer.drawPath(x, pathY);
            renderer.drawPath(x, pathY + CONFIG.TILE_SIZE);
        }
        
        // Draw vertical paths to buildings
        const paths = [
            { x: 90, y: 100, height: 180 },
            { x: 640, y: 100, height: 180 },
            { x: 390, y: 344, height: 90 }
        ];
        
        paths.forEach(path => {
            for (let y = path.y + (path.height > 150 ? 0 : 60); y < path.y + path.height; y += CONFIG.TILE_SIZE) {
                renderer.drawPath(path.x, y);
            }
        });
        
        // Draw buildings
        this.buildings.forEach(building => {
            renderer.drawBuilding(
                building.x,
                building.y,
                building.width,
                building.height,
                building.type
            );
        });
    }

    drawNPCs(renderer, player) {
        this.npcs.forEach(npc => npc.draw(renderer, player));
    }
}
