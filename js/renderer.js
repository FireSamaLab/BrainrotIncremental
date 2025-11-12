// Renderer - Handles all drawing operations
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
    }

    clear() {
        this.ctx.fillStyle = CONFIG.COLORS.GRASS;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawTile(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    }

    drawGrass(x, y, variant = 0) {
        const colors = [CONFIG.COLORS.GRASS, CONFIG.COLORS.DARK_GRASS];
        const color = colors[variant % colors.length];
        this.drawTile(x, y, color);
        
        // Add grass detail
        if (variant % 3 === 0) {
            this.ctx.fillStyle = CONFIG.COLORS.DARK_GRASS;
            this.ctx.fillRect(x + 10, y + 15, 3, 4);
            this.ctx.fillRect(x + 18, y + 12, 3, 4);
        }
    }

    drawPath(x, y) {
        this.ctx.fillStyle = CONFIG.COLORS.PATH;
        this.ctx.fillRect(x, y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Path edges
        this.ctx.fillStyle = CONFIG.COLORS.DARK_GRASS;
        this.ctx.fillRect(x + 2, y + 2, 2, 2);
        this.ctx.fillRect(x + 28, y + 28, 2, 2);
    }

    drawBuilding(x, y, width, height, type = 'house') {
        const w = width * CONFIG.TILE_SIZE;
        const h = height * CONFIG.TILE_SIZE;
        
        // Main building
        this.ctx.fillStyle = CONFIG.COLORS.BUILDING;
        this.ctx.fillRect(x, y, w, h);
        
        // Building shadow
        this.ctx.fillStyle = CONFIG.COLORS.BUILDING_DARK;
        this.ctx.fillRect(x, y + h - 8, w, 8);
        
        // Roof
        this.ctx.fillStyle = CONFIG.COLORS.ROOF_RED;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8, y);
        this.ctx.lineTo(x + w/2, y - 20);
        this.ctx.lineTo(x + w + 8, y);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Roof shadow
        this.ctx.fillStyle = CONFIG.COLORS.ROOF_DARK;
        this.ctx.beginPath();
        this.ctx.moveTo(x + w/2, y - 20);
        this.ctx.lineTo(x + w + 8, y);
        this.ctx.lineTo(x + w/2, y);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Door
        const doorX = x + w/2 - 12;
        const doorY = y + h - 28;
        this.ctx.fillStyle = CONFIG.COLORS.DOOR;
        this.ctx.fillRect(doorX, doorY, 24, 28);
        
        // Door frame
        this.ctx.strokeStyle = CONFIG.COLORS.BUILDING_DARK;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(doorX, doorY, 24, 28);
        
        // Windows
        if (type === 'house') {
            this.drawWindow(x + 10, y + 20);
            this.drawWindow(x + w - 26, y + 20);
        } else if (type === 'shop') {
            this.drawWindow(x + 10, y + 15);
            this.drawWindow(x + w - 26, y + 15);
            
            // Shop sign
            this.ctx.fillStyle = CONFIG.COLORS.BUILDING_DARK;
            this.ctx.fillRect(x + w/2 - 20, y - 8, 40, 12);
            this.ctx.fillStyle = CONFIG.COLORS.TEXT;
            this.ctx.font = '8px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SHOP', x + w/2, y - 1);
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

    drawPlayer(x, y, direction = 'down') {
        // Body
        this.ctx.fillStyle = CONFIG.COLORS.PLAYER;
        this.ctx.fillRect(x + 4, y + 8, 16, 20);
        
        // Head
        this.ctx.fillStyle = '#f8d8a8';
        this.ctx.fillRect(x + 6, y + 2, 12, 12);
        
        // Hair
        this.ctx.fillStyle = '#505040';
        this.ctx.fillRect(x + 6, y, 12, 6);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        if (direction === 'down') {
            this.ctx.fillRect(x + 8, y + 7, 2, 2);
            this.ctx.fillRect(x + 14, y + 7, 2, 2);
        }
        
        // Legs
        this.ctx.fillStyle = '#303030';
        this.ctx.fillRect(x + 6, y + 28, 5, 4);
        this.ctx.fillRect(x + 13, y + 28, 5, 4);
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 2, y + 30, 20, 3);
    }

    drawNPC(x, y, color) {
        // Body
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 4, y + 8, 16, 20);
        
        // Head
        this.ctx.fillStyle = '#f8d8a8';
        this.ctx.fillRect(x + 6, y + 2, 12, 12);
        
        // Hair
        this.ctx.fillStyle = '#a07040';
        this.ctx.fillRect(x + 6, y, 12, 6);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + 8, y + 7, 2, 2);
        this.ctx.fillRect(x + 14, y + 7, 2, 2);
        
        // Legs
        this.ctx.fillStyle = '#303030';
        this.ctx.fillRect(x + 6, y + 28, 5, 4);
        this.ctx.fillRect(x + 13, y + 28, 5, 4);
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 2, y + 30, 20, 3);
    }

    drawInteractionPrompt(x, y) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x + 2, y - 15, 20, 12);
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('!', x + 12, y - 5);
    }

    formatMoney(amount) {
        if (amount >= 1000000) {
            return '$' + (amount / 1000000).toFixed(2) + 'M';
        } else if (amount >= 1000) {
            return '$' + (amount / 1000).toFixed(2) + 'K';
        }
        return '$' + Math.floor(amount);
    }
}
