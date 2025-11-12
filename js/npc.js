// NPC class
class NPC {
    constructor(id, x, y, data) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = CONFIG.NPC_SIZE;
        this.height = CONFIG.NPC_SIZE;
        this.name = data.name;
        this.color = data.color;
        this.location = data.location;
        this.dialogs = data.dialogs;
        this.currentDialogIndex = 0;
        
        // Sprite handling
        this.spriteUrl = data.spriteUrl;
        this.sprite = null;
        this.spriteLoaded = false;
        
        // Load sprite if URL is provided
        if (this.spriteUrl) {
            this.loadSprite();
        }
        
        // Wandering behavior
        this.isWandering = (this.location === 'outside');
        this.wanderDirection = { x: 0, y: 0 };
        this.wanderTimer = 0;
        this.wanderPause = CONFIG.NPC_WANDER_PAUSE;
        this.speed = CONFIG.NPC_WANDER_SPEED;
        
        // Boundaries for wandering (stay away from edges)
        this.minX = 100;
        this.maxX = CONFIG.WORLD_WIDTH - 100;
        this.minY = 100;
        this.maxY = CONFIG.WORLD_HEIGHT - 100;
    }

    loadSprite() {
        this.sprite = new Image();
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            // Adjust NPC size based on sprite dimensions
            this.width = this.sprite.width;
            this.height = this.sprite.height;
        };
        this.sprite.onerror = () => {
            console.warn(`Failed to load sprite for ${this.id}, using colored dot instead`);
            this.spriteLoaded = false;
        };
        this.sprite.src = this.spriteUrl;
    }

    update(deltaTime, map) {
        if (!this.isWandering) return;
        
        this.wanderTimer -= deltaTime;
        
        if (this.wanderTimer <= 0) {
            // Pick a new random direction
            const directions = [
                { x: 0, y: -1 },  // Up
                { x: 0, y: 1 },   // Down
                { x: -1, y: 0 },  // Left
                { x: 1, y: 0 },   // Right
                { x: 0, y: 0 }    // Pause
            ];
            
            this.wanderDirection = directions[Math.floor(Math.random() * directions.length)];
            this.wanderTimer = this.wanderPause + Math.random() * 1000;
        }
        
        // Move in wander direction
        if (this.wanderDirection.x !== 0 || this.wanderDirection.y !== 0) {
            const newX = this.x + this.wanderDirection.x * this.speed;
            const newY = this.y + this.wanderDirection.y * this.speed;
            
            // Check if new position is valid
            if (!map.isSolid(newX, newY, this.width, this.height) &&
                newX > this.minX && newX < this.maxX &&
                newY > this.minY && newY < this.maxY) {
                this.x = newX;
                this.y = newY;
            } else {
                // Hit obstacle, pick new direction immediately
                this.wanderTimer = 0;
            }
        }
    }

    canInteract(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < CONFIG.INTERACTION_RANGE;
    }

    interact() {
        const dialog = this.dialogs[this.currentDialogIndex];
        this.currentDialogIndex = (this.currentDialogIndex + 1) % this.dialogs.length;
        return {
            name: this.name,
            text: dialog
        };
    }

    draw(renderer, camera, showPrompt = false) {
        if (this.isWandering) {
            // Draw in world space
            const screenPos = camera.worldToScreen(this.x, this.y);
            
            if (this.spriteLoaded && this.sprite) {
                renderer.drawSprite(this.sprite, screenPos.x, screenPos.y, this.width, this.height);
            } else {
                renderer.drawDot(screenPos.x, screenPos.y, this.color, CONFIG.NPC_SIZE);
            }
            
            if (showPrompt) {
                renderer.drawInteractionPrompt(screenPos.x, screenPos.y);
            }
        } else {
            // Draw in local space (interior)
            if (this.spriteLoaded && this.sprite) {
                renderer.drawSprite(this.sprite, this.x, this.y, this.width, this.height);
            } else {
                renderer.drawDot(this.x, this.y, this.color, CONFIG.NPC_SIZE);
            }
            
            if (showPrompt) {
                renderer.drawInteractionPrompt(this.x, this.y);
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
