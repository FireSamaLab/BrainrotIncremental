// UI Manager
class UIManager {
    constructor(game) {
        this.game = game;
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogText = document.getElementById('dialog-text');
        this.transitionOverlay = document.getElementById('transition-overlay');
        
        this.isDialogActive = false;
        this.currentDialog = null;
        this.dialogPages = [];
        this.currentPage = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close dialog on interact key
        window.addEventListener('keydown', (e) => {
            if ((e.key === ' ' || e.key === 'Enter') && this.isDialogActive) {
                this.advanceDialog();
                e.preventDefault();
            }
        });
    }

    showDialog(dialog) {
        this.isDialogActive = true;
        this.currentDialog = dialog;
        this.dialogPages = dialog.text.split('|');
        this.currentPage = 0;
        
        this.dialogBox.classList.remove('hidden');
        this.typeText(this.dialogPages[0]);
    }

    typeText(text) {
        this.dialogText.textContent = '';
        let i = 0;
        const speed = 30;
        
        const type = () => {
            if (i < text.length) {
                this.dialogText.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    advanceDialog() {
        this.currentPage++;
        
        if (this.currentPage < this.dialogPages.length) {
            this.typeText(this.dialogPages[this.currentPage]);
        } else {
            this.closeDialog();
        }
    }

    closeDialog() {
        this.isDialogActive = false;
        this.dialogBox.classList.add('hidden');
        this.currentDialog = null;
    }

    async playTransition() {
        this.transitionOverlay.classList.remove('hidden');
        this.transitionOverlay.classList.add('fade-in');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.transitionOverlay.classList.remove('fade-in');
        this.transitionOverlay.classList.add('fade-out');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        this.transitionOverlay.classList.add('hidden');
        this.transitionOverlay.classList.remove('fade-out');
    }

    isInputBlocked() {
        return this.isDialogActive;
    }
}
