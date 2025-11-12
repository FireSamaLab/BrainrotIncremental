// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER_SIZE;
        this.height = CONFIG.PLAYER_SIZE;
        this.speed = CONFIG.PLAYER_SPEED;
        this.color = CONFIG.COLORS.PLAYER;
        
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            interact: false
        };
        
        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    this.keys.up = true;
                    e.preventDefault();
                    break;
                case 'arrowdown':
                case 's':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
                case 'arrowleft':
                case 'a':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'arrowright':
                case 'd':
                    this.keys.right = true;
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

    update(map) {
        let newX = this.x;
        let newY = this.y;

        if (this.keys.up) {
            newY -= this.speed;
        }
        if (this.keys.down) {
            newY += this.speed;
        }
        if (this.keys.left) {
            newX -= this.speed;
        }
        if (this.keys.right) {
            newX += this.speed;
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
            }
        }

        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, map.width - this.width));
        this.y = Math.max(0, Math.min(this.y, map.height - this.height));
    }

    draw(renderer, camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        renderer.drawDot(screenPos.x, screenPos.y, this.color, this.width);
    }

    drawInterior(renderer) {
        // When in interior, draw at fixed position
        renderer.drawDot(this.x, this.y, this.color, this.width);
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
