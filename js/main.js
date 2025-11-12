// Main entry point
let game;

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    
    // Initialize game
    game = new Game();
    
    // Start button handler
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        game.start();
    });
    
    // Also allow Enter key to start
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !startScreen.classList.contains('hidden')) {
            startScreen.classList.add('hidden');
            game.start();
        }
    });
});

// Export for debugging
window.debugGame = () => {
    console.log('=== Brain Incremental Debug ===');
    console.log('Money:', game.money);
    console.log('Income/s:', game.getIncomePerSecond());
    console.log('Upgrades:', UPGRADES.map(u => ({ name: u.name, owned: u.owned })));
    console.log('Player position:', { x: game.player.x, y: game.player.y });
};

// Add money for testing
window.addMoney = (amount) => {
    game.money += amount;
    console.log(`Added $${amount}. New total: $${game.money}`);
};

// Reset game
window.resetGame = () => {
    game.resetGame();
};

console.log('%cBrain Incremental', 'font-size: 20px; color: #8bac0f; font-weight: bold;');
console.log('Debug commands: debugGame(), addMoney(amount), resetGame()');
