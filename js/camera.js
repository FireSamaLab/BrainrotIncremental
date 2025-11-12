// Camera - Follows the player smoothly
class Camera {
    constructor(worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewportWidth = CONFIG.VIEWPORT_WIDTH;
        this.viewportHeight = CONFIG.VIEWPORT_HEIGHT;
    }

    follow(target) {
        // Center camera on target
        this.x = target.x - this.viewportWidth / 2;
        this.y = target.y - this.viewportHeight / 2;

        // Keep camera within world bounds
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.viewportWidth));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.viewportHeight));
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    isVisible(x, y, width, height) {
        return x + width > this.x &&
               x < this.x + this.viewportWidth &&
               y + height > this.y &&
               y < this.y + this.viewportHeight;
    }
}
