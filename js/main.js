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
            e.preventDefault();
        }
    });
});

// Debug commands
window.debugGame = () => {
    console.log('=== Noxis Town Debug ===');
    console.log('Player position:', { x: game.player.x, y: game.player.y });
    console.log('Current location:', game.world.currentLocation);
    console.log('Camera position:', { x: game.camera.x, y: game.camera.y });
    console.log('NPCs:', game.world.npcs.map(n => ({ 
        id: n.id, 
        x: n.x, 
        y: n.y, 
        wandering: n.isWandering 
    })));
};

// Teleport player for testing
window.teleportPlayer = (x, y) => {
    game.player.setPosition(x, y);
    console.log(`Teleported to (${x}, ${y})`);
};

console.log('%cWelcome to Noxis Town', 'font-size: 20px; color: #8bac0f; font-weight: bold;');
console.log('Debug commands: debugGame(), teleportPlayer(x, y)');
