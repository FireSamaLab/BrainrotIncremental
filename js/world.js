// World manager - handles map, NPCs, and transitions
class World {
    constructor() {
        this.map = new GameMap();
        this.currentLocation = 'outside';
        this.currentInterior = null;
        
        // Initialize NPCs
        this.npcs = this.createNPCs();
    }

    createNPCs() {
        const npcs = [];
        
        // Yellow - in house 1
        npcs.push(new NPC('YELLOW', 200, 150, NPC_DATA.YELLOW));
        
        // Green - in house 2
        npcs.push(new NPC('GREEN', 200, 150, NPC_DATA.GREEN));
        
        // Orange - wandering outside
        npcs.push(new NPC('ORANGE', 600, 800, NPC_DATA.ORANGE));
        
        // Blue - wandering outside
        npcs.push(new NPC('BLUE', 900, 600, NPC_DATA.BLUE));
        
        return npcs;
    }

    update(deltaTime) {
        // Update wandering NPCs
        if (this.currentLocation === 'outside') {
            this.npcs.forEach(npc => {
                if (npc.isWandering) {
                    npc.update(deltaTime, this.map);
                }
            });
        }
    }

    getNearbyNPC(player) {
        // Get NPCs in current location
        const visibleNPCs = this.getVisibleNPCs();
        
        for (let npc of visibleNPCs) {
            if (npc.canInteract(player)) {
                return npc;
            }
        }
        
        return null;
    }

    getVisibleNPCs() {
        if (this.currentLocation === 'outside') {
            // Show wandering NPCs
            return this.npcs.filter(npc => npc.isWandering);
        } else {
            // Show interior NPC if any
            const interior = this.map.interiors[this.currentLocation];
            if (interior && interior.npc) {
                return this.npcs.filter(npc => npc.id === interior.npc);
            }
        }
        return [];
    }

    enterBuilding(buildingId, player) {
        const interior = this.map.interiors[buildingId];
        if (!interior) return false;
        
        this.currentLocation = buildingId;
        this.currentInterior = interior;
        
        // Position player at entrance
        player.setPosition(interior.exitDoor.x, interior.exitDoor.y - 50);
        
        // Position interior NPC if exists
        if (interior.npc) {
            const npc = this.npcs.find(n => n.id === interior.npc);
            if (npc) {
                npc.setPosition(interior.width / 2, interior.height / 2 - 50);
                npc.isWandering = false;
            }
        }
        
        return true;
    }

    exitBuilding(player) {
        // Find the building we're exiting from
        const buildingId = this.currentLocation.replace('_interior', '');
        const building = this.map.buildings.find(b => b.id === buildingId);
        
        if (building) {
            this.currentLocation = 'outside';
            this.currentInterior = null;
            
            // Position player outside the door
            player.setPosition(building.doorX - CONFIG.PLAYER_SIZE/2, building.doorY + 40);
            
            // Reset interior NPC to wandering if applicable
            const interior = this.map.interiors[buildingId + '_interior'];
            if (interior && interior.npc) {
                const npc = this.npcs.find(n => n.id === interior.npc);
                if (npc && npc.location === 'outside') {
                    npc.isWandering = true;
                }
            }
        }
    }

    checkDoorInteraction(player) {
        if (this.currentLocation === 'outside') {
            // Check if player is at a building door
            return this.map.checkDoorCollision(player.x, player.y, player.width, player.height);
        } else if (this.currentInterior) {
            // Check if player is at exit door
            const door = this.currentInterior.exitDoor;
            const dx = Math.abs(player.x - door.x);
            const dy = Math.abs(player.y - door.y);
            
            if (dx < CONFIG.TILE_SIZE && dy < CONFIG.TILE_SIZE) {
                return { isExit: true };
            }
        }
        return null;
    }

    draw(renderer, camera) {
        if (this.currentLocation === 'outside') {
            renderer.drawWorld(this.map, camera);
            
            // Draw wandering NPCs
            this.npcs.forEach(npc => {
                if (npc.isWandering && camera.isVisible(npc.x, npc.y, npc.width, npc.height)) {
                    npc.draw(renderer, camera);
                }
            });
        } else if (this.currentInterior) {
            renderer.drawInterior(this.currentInterior);
            
            // Draw interior NPC if any
            const visibleNPCs = this.getVisibleNPCs();
            visibleNPCs.forEach(npc => {
                npc.draw(renderer, null);
            });
        }
    }

    checkCollision(x, y, width, height) {
        if (this.currentLocation === 'outside') {
            return this.map.isSolid(x, y, width, height);
        } else if (this.currentInterior) {
            // Interior collision - check walls and furniture
            const interior = this.currentInterior;
            
            // Wall collision
            if (x < CONFIG.TILE_SIZE || 
                x + width > interior.width - CONFIG.TILE_SIZE ||
                y < CONFIG.TILE_SIZE || 
                y + height > interior.height - CONFIG.TILE_SIZE) {
                return true;
            }
            
            // Furniture collision
            for (let furniture of interior.furniture) {
                const fx = furniture.x * CONFIG.TILE_SIZE;
                const fy = furniture.y * CONFIG.TILE_SIZE;
                const fw = furniture.width * CONFIG.TILE_SIZE;
                const fh = furniture.height * CONFIG.TILE_SIZE;
                
                if (x < fx + fw && x + width > fx &&
                    y < fy + fh && y + height > fy) {
                    return true;
                }
            }
        }
        
        return false;
    }
}
