// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        this.speed = CONFIG.PLAYER_SPEED;
        this.direction = 'down';
        
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

    update(world) {
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

        // Check collision
        if (!world.checkCollision(newX, newY, this.width, this.height)) {
            this.x = newX;
            this.y = newY;
        } else {
            // Try sliding along walls
            if (!world.checkCollision(newX, this.y, this.width, this.height)) {
                this.x = newX;
            } else if (!world.checkCollision(this.x, newY, this.width, this.height)) {
                this.y = newY;
            }
        }

        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, CONFIG.CANVAS_WIDTH - this.width));
        this.y = Math.max(0, Math.min(this.y, CONFIG.CANVAS_HEIGHT - this.height));
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    getInteractionPoint() {
        const offset = 40;
        switch(this.direction) {
            case 'up':
                return { x: this.x + this.width/2, y: this.y - offset };
            case 'down':
                return { x: this.x + this.width/2, y: this.y + this.height + offset };
            case 'left':
                return { x: this.x - offset, y: this.y + this.height/2 };
            case 'right':
                return { x: this.x + this.width + offset, y: this.y + this.height/2 };
        }
    }

    draw(renderer) {
        renderer.drawPlayer(this.x, this.y, this.direction);
    }
}
