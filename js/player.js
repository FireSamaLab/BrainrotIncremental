// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = SPRITE_CONFIG.FRAME_WIDTH;
        this.height = SPRITE_CONFIG.FRAME_HEIGHT;
        this.speed = CONFIG.PLAYER_SPEED;
        this.color = CONFIG.COLORS.PLAYER;
        
        // Direction and animation
        this.direction = 'down';
        this.isMoving = false;
        this.currentFrame = 1; // Start with middle frame (standing pose)
        this.frameTimer = 0;
        
        // Sprite handling
        this.sprite = null;
        this.spriteLoaded = false;
        this.loadSprite();
        
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };
        
        this.setupControls();
    }

    loadSprite() {
        if (!SPRITES.PLAYER) return;
        
        this.sprite = new Image();
        this.sprite.onload = () => {
            this.spriteLoaded = true;
            console.log('Player sprite loaded successfully');
        };
        this.sprite.onerror = () => {
            console.warn('Failed to load player sprite, using red dot instead');
            this.spriteLoaded = false;
        };
        this.sprite.src = SPRITES.PLAYER;
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.keys.up = true;
                    this.direction = 'up';
                    e.preventDefault();
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = true;
                    this.direction = 'down';
                    e.preventDefault();
                    break;
                case 'arrowleft':
                case 'a':
                    this.keys.left = true;
                    this.direction = 'left';
                    e.preventDefault();
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = true;
                    this.direction = 'right';
                    e.preventDefault();
                    break;
                case ' ':
                case 'enter':
                    this.keys.interact = true;
                    e.preventDefault();
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.keys.up = false;
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = false;
                    break;
                case 'arrowleft':
                case 'a':
                    this.keys.left = false;
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = false;
                    break;
                case ' ':
                case 'enter':
                    this.keys.interact = false;
                    break;
            }
        });
    }

    update(map, deltaTime) {
        let newX = this.x;
        let newY = this.y;
        this.isMoving = false;

        if (this.keys.up) {
            newY -= this.speed;
            this.isMoving = true;
            this.direction = 'up';
        }
        if (this.keys.down) {
            newY += this.speed;
            this.isMoving = true;
            this.direction = 'down';
        }
        if (this.keys.left) {
            newX -= this.speed;
            this.isMoving = true;
            this.direction = 'left';
        }
        if (this.keys.right) {
            newX += this.speed;
            this.isMoving = true;
            this.direction = 'right';
        }

        // Update animation
        if (this.isMoving) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= SPRITE_CONFIG.ANIMATION_SPEED) {
                this.currentFrame = (this.currentFrame + 1) % SPRITE_CONFIG.FRAMES_PER_ROW;
                this.frameTimer = 0;
            }
        } else {
            // Reset to standing frame when not moving
            this.currentFrame = 1; // Middle frame is usually the standing pose
            this.frameTimer = 0;
        }

        // Check collision with map
        if (!map.isSolid(newX, newY, this.width, this.height)) {
            this.x = newX;
            this.y = newY;
        } else {
            // Try sliding along walls
            if (!map.isSolid(newX, this.y, this.width, this.height)) {
                this.x = newX;
            } else if (!map.isSolid(this.x, newY, this.width, this.height)) {
                this.y = newY;
            } else {
                this.isMoving = false;
            }
        }

        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, map.width - this.width));
        this.y = Math.max(0, Math.min(this.y, map.height - this.height));
    }

    draw(renderer, camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        if (this.spriteLoaded && this.sprite) {
            renderer.drawAnimatedSprite(
                this.sprite,
                screenPos.x,
                screenPos.y,
                this.direction,
                this.currentFrame
            );
        } else {
            renderer.drawDot(screenPos.x, screenPos.y, this.color, CONFIG.PLAYER_SIZE);
        }
    }

    drawInterior(renderer) {
        // When in interior, draw at fixed position
        if (this.spriteLoaded && this.sprite) {
            renderer.drawAnimatedSprite(
                this.sprite,
                this.x,
                this.y,
                this.direction,
                this.currentFrame
            );
        } else {
            renderer.drawDot(this.x, this.y, this.color, CONFIG.PLAYER_SIZE);
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }
}
