// NPC class
class NPC {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        this.type = type;
        this.color = color;
        this.dialogs = DIALOGS[type] || ["Hello!"];
        this.currentDialogIndex = 0;
        this.interactionRange = 50;
    }

    canInteract(player) {
        const point = player.getInteractionPoint();
        const dx = point.x - (this.x + this.width/2);
        const dy = point.y - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.interactionRange;
    }

    interact() {
        const dialog = this.dialogs[this.currentDialogIndex];
        this.currentDialogIndex = (this.currentDialogIndex + 1) % this.dialogs.length;
        return {
            type: this.type,
            text: dialog
        };
    }

    draw(renderer, player) {
        renderer.drawNPC(this.x, this.y, this.color);
        
        // Show interaction prompt if player is close
        if (this.canInteract(player)) {
            renderer.drawInteractionPrompt(this.x, this.y);
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
