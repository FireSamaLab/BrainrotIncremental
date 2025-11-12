// Main Game class
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.world = new World();
        this.player = new Player(400, 350);
        this.ui = new UIManager(this);
        
        // Game state
        this.money = 0;
        this.isRunning = false;
        this.lastTime = 0;
        this.lastIncomeTime = 0;
        
        // Load save
        this.loadGame();
        
        // Setup income generation
        this.setupIncomeGeneration();
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.lastIncomeTime = performance.now();
        this.canvas.classList.add('active');
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update
        if (!this.ui.isInputBlocked()) {
            this.player.update(this.world);
            this.handleInteractions();
        }
        
        // Generate income
        this.generateIncome(currentTime);
        
        // Render
        this.render();
        
        // Update UI
        this.ui.updateHUD();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    handleInteractions() {
        if (this.player.keys.interact) {
            const npc = this.world.getNearbyNPC(this.player);
            if (npc && !this.ui.isDialogActive) {
                const dialog = npc.interact();
                this.ui.showDialog(dialog);
            }
            this.player.keys.interact = false;
        }
    }

    setupIncomeGeneration() {
        // Generate income every 100ms for smooth updates
        setInterval(() => {
            if (this.isRunning) {
                const income = this.getIncomePerSecond() / 10;
                this.money += income;
                this.saveGame();
            }
        }, 100);
    }

    generateIncome(currentTime) {
        // This is called in the game loop but income is handled by interval
        // We keep this for potential future use
    }

    getIncomePerSecond() {
        let total = 0;
        UPGRADES.forEach(upgrade => {
            total += upgrade.baseIncome * upgrade.owned;
        });
        return total;
    }

    buyUpgrade(upgrade) {
        const cost = this.ui.calculateCost(upgrade);
        
        if (this.money >= cost) {
            this.money -= cost;
            upgrade.owned++;
            this.saveGame();
            return true;
        }
        return false;
    }

    render() {
        this.renderer.clear();
        this.world.draw(this.renderer);
        this.world.drawNPCs(this.renderer, this.player);
        this.player.draw(this.renderer);
    }

    saveGame() {
        const saveData = {
            money: this.money,
            upgrades: UPGRADES.map(u => ({ id: u.id, owned: u.owned })),
            lastSave: Date.now()
        };
        localStorage.setItem('brainIncremental_save', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('brainIncremental_save');
        
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.money = data.money || 0;
                
                // Restore upgrade counts
                if (data.upgrades) {
                    data.upgrades.forEach(saved => {
                        const upgrade = UPGRADES.find(u => u.id === saved.id);
                        if (upgrade) {
                            upgrade.owned = saved.owned;
                        }
                    });
                }
                
                // Calculate offline earnings (max 8 hours)
                if (data.lastSave) {
                    const offlineTime = Math.min(Date.now() - data.lastSave, 8 * 60 * 60 * 1000);
                    const offlineIncome = (this.getIncomePerSecond() * offlineTime) / 1000;
                    
                    if (offlineIncome > 0) {
                        this.money += offlineIncome;
                        console.log(`Welcome back! You earned $${Math.floor(offlineIncome)} while away!`);
                    }
                }
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your progress?')) {
            localStorage.removeItem('brainIncremental_save');
            location.reload();
        }
    }
}
