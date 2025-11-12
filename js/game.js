// Main Game class
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.camera = new Camera(CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
        this.world = new World();
        this.player = new Player(800, 800); // Start in center of town
        this.ui = new UIManager(this);
        
        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.usingCamera = true;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.canvas.classList.add('active');
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update
        if (!this.ui.isInputBlocked()) {
            // Update player movement
            if (this.world.currentLocation === 'outside') {
                this.player.update(this.world.map);
                this.camera.follow(this.player);
            } else {
                // In interior, check collision with world
                const newX = this.player.x;
                const newY = this.player.y;
                
                let targetX = newX;
                let targetY = newY;
                
                if (this.player.keys.up) targetY -= this.player.speed;
                if (this.player.keys.down) targetY += this.player.speed;
                if (this.player.keys.left) targetX -= this.player.speed;
                if (this.player.keys.right) targetX += this.player.speed;
                
                if (!this.world.checkCollision(targetX, targetY, this.player.width, this.player.height)) {
                    this.player.x = targetX;
                    this.player.y = targetY;
                } else {
                    // Try sliding
                    if (!this.world.checkCollision(targetX, newY, this.player.width, this.player.height)) {
                        this.player.x = targetX;
                    } else if (!this.world.checkCollision(newX, targetY, this.player.width, this.player.height)) {
                        this.player.y = targetY;
                    }
                }
            }
            
            // Update world (NPC wandering, etc.)
            this.world.update(deltaTime);
            
            // Handle interactions
            this.handleInteractions();
        }
        
        // Render
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    handleInteractions() {
        if (this.player.keys.interact) {
            this.player.keys.interact = false;
            
            // Check for NPC interaction
            const npc = this.world.getNearbyNPC(this.player);
            if (npc) {
                const dialog = npc.interact();
                this.ui.showDialog(dialog);
                return;
            }
            
            // Check for door interaction
            const door = this.world.checkDoorInteraction(this.player);
            if (door) {
                if (door.isExit) {
                    // Exit building
                    this.transitionToOutside();
                } else {
                    // Enter building
                    this.transitionToInterior(door.targetMap);
                }
                return;
            }
        }
    }

    async transitionToInterior(interiorId) {
        await this.ui.playTransition();
        this.world.enterBuilding(interiorId, this.player);
        this.usingCamera = false;
    }

    async transitionToOutside() {
        await this.ui.playTransition();
        this.world.exitBuilding(this.player);
        this.camera.follow(this.player);
        this.usingCamera = true;
    }

    render() {
        this.renderer.clear();
        
        if (this.world.currentLocation === 'outside') {
            // Draw world with camera
            this.world.draw(this.renderer, this.camera);
            
            // Draw player
            this.player.draw(this.renderer, this.camera);
            
            // Draw interaction prompts
            const npc = this.world.getNearbyNPC(this.player);
            if (npc) {
                const screenPos = this.camera.worldToScreen(npc.x, npc.y);
                this.renderer.drawInteractionPrompt(screenPos.x, screenPos.y);
            }
            
            // Check if near door
            const door = this.world.checkDoorInteraction(this.player);
            if (door && !door.isExit) {
                const building = this.world.map.buildings.find(b => b.id + '_interior' === door.targetMap);
                if (building) {
                    const screenPos = this.camera.worldToScreen(building.doorX - 8, building.doorY - 20);
                    this.renderer.drawInteractionPrompt(screenPos.x, screenPos.y);
                }
            }
        } else {
            // Draw interior
            this.world.draw(this.renderer, null);
            
            // Draw player
            this.player.drawInterior(this.renderer);
            
            // Draw interaction prompts
            const npc = this.world.getNearbyNPC(this.player);
            if (npc) {
                this.renderer.drawInteractionPrompt(npc.x, npc.y);
            }
            
            // Check if near exit
            const door = this.world.checkDoorInteraction(this.player);
            if (door && door.isExit) {
                const exitDoor = this.world.currentInterior.exitDoor;
                this.renderer.drawInteractionPrompt(exitDoor.x - 8, exitDoor.y - 20);
            }
        }
    }
}
