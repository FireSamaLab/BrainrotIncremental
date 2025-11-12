// UI Manager
class UIManager {
    constructor(game) {
        this.game = game;
        this.dialogBox = document.getElementById('dialog-box');
        this.dialogText = document.getElementById('dialog-text');
        this.shopMenu = document.getElementById('shop-menu');
        this.shopItems = document.getElementById('shop-items');
        this.moneyDisplay = document.getElementById('money-display');
        this.incomeDisplay = document.getElementById('income-display');
        
        this.isDialogActive = false;
        this.isShopActive = false;
        this.currentDialog = null;
        this.dialogPages = [];
        this.currentPage = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('close-shop').addEventListener('click', () => {
            this.closeShop();
        });
        
        // Close dialog/shop on interact key
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                if (this.isDialogActive) {
                    this.advanceDialog();
                }
            }
            if (e.key === 'Escape') {
                if (this.isShopActive) {
                    this.closeShop();
                }
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
        
        // Open shop if talking to shopkeeper
        if (dialog.type === 'SHOPKEEPER') {
            setTimeout(() => {
                if (this.currentPage >= this.dialogPages.length - 1) {
                    this.showShop();
                }
            }, 100);
        }
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
            
            // Open shop if it was shopkeeper
            if (this.currentDialog && this.currentDialog.type === 'SHOPKEEPER') {
                this.showShop();
            }
        }
    }

    closeDialog() {
        this.isDialogActive = false;
        this.dialogBox.classList.add('hidden');
        this.currentDialog = null;
    }

    showShop() {
        this.isShopActive = true;
        this.shopMenu.classList.remove('hidden');
        this.updateShop();
    }

    closeShop() {
        this.isShopActive = false;
        this.shopMenu.classList.add('hidden');
    }

    updateShop() {
        this.shopItems.innerHTML = '';
        
        UPGRADES.forEach(upgrade => {
            const cost = this.calculateCost(upgrade);
            const canAfford = this.game.money >= cost;
            
            const item = document.createElement('div');
            item.className = 'shop-item' + (canAfford ? '' : ' disabled');
            
            item.innerHTML = `
                <div class="item-name">${upgrade.name}</div>
                <div class="item-description">${upgrade.description}</div>
                <div class="item-stats">
                    <span class="item-cost">Cost: $${this.formatNumber(cost)}</span>
                    <span class="item-income">+$${this.formatNumber(upgrade.baseIncome)}/s</span>
                </div>
                <div class="item-description">Owned: ${upgrade.owned}</div>
            `;
            
            if (canAfford) {
                item.addEventListener('click', () => {
                    this.game.buyUpgrade(upgrade);
                    this.updateShop();
                });
            }
            
            this.shopItems.appendChild(item);
        });
    }

    calculateCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
    }

    updateHUD() {
        this.moneyDisplay.textContent = this.formatNumber(this.game.money);
        this.incomeDisplay.textContent = this.formatNumber(this.game.getIncomePerSecond()) + '/s';
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return Math.floor(num).toString();
    }

    isInputBlocked() {
        return this.isDialogActive || this.isShopActive;
    }
}
