# Noxis Town

A Pokemon GBA-style 2D town exploration game where you can walk around, enter buildings, and chat with NPCs.

![Style](https://img.shields.io/badge/Style-Pokemon%20GBA-8bac0f)
![Tech](https://img.shields.io/badge/Tech-HTML5%20Canvas-blue)

## 🎮 Features

- **Camera Following**: Smooth camera that follows your character around the medium-sized town
- **Building Interiors**: Enter 3 houses with furnished interiors
- **4 NPCs**: 
  - Yellow (in House 1)
  - Green (in House 2)
  - Orange (wandering outside)
  - Blue (wandering outside)
- **Wandering NPCs**: Outside NPCs roam the town naturally
- **Collision Detection**: Can't walk through trees, water, or buildings
- **Dialog System**: Talk to NPCs with multi-page conversations
- **Smooth Transitions**: Screen fades when entering/exiting buildings

## 🕹️ Controls

- **Arrow Keys** or **WASD** - Move your character (red dot)
- **Space** or **Enter** - Interact with NPCs and doors
- **ESC** - (Reserved for future menus)

## 🏘️ Town Layout

```
Noxis Town includes:
- Dense tree borders (top, left, right, bottom)
- House 1 (top left) - Yellow NPC inside
- House 2 (top right) - Green NPC inside  
- House 3 (bottom right) - Your house
- Large Building (bottom middle)
- Pond (bottom left)
- Path network connecting everything
- Orange & Blue NPCs wandering the paths
```

## 🚀 Getting Started

### Play Locally
1. Open `index.html` in a modern web browser
2. Click "Press Start"
3. Explore Noxis!

### Host on GitHub Pages
1. Upload all files to a GitHub repository
2. Enable GitHub Pages in Settings → Pages
3. Your game will be live at: `https://yourusername.github.io/repository-name/`

## 📁 Project Structure

```
Noxis/
├── index.html
├── styles/
│   └── main.css
└── js/
    ├── main.js        # Entry point
    ├── game.js        # Main game loop
    ├── player.js      # Player movement
    ├── npc.js         # NPC behavior
    ├── world.js       # World manager
    ├── map.js         # Map layout & collision
    ├── camera.js      # Camera following
    ├── renderer.js    # Graphics rendering
    ├── ui.js          # Dialog & transitions
    └── config.js      # Game configuration
```

## 🎨 Visual Design

- **Player**: Red dot
- **NPCs**: 
  - Yellow dot (House 1 resident)
  - Green dot (House 2 resident)
  - Orange dot (Wandering)
  - Blue dot (Wandering)
- **Terrain**: Authentic Pokemon GBA color palette
- **Buildings**: Pixel-art houses with red roofs
- **Interiors**: Furnished with beds, tables, rugs, etc.

## 🔧 Technical Details

- **World Size**: 1600x1600 pixels (50x50 tiles)
- **Viewport**: 800x600 pixels
- **Tile Size**: 32x32 pixels
- **Camera**: Follows player, stays within bounds
- **Collision**: Tile-based with multi-point checking
- **NPCs**: Wandering AI with random direction changes

## 🐛 Debug Commands

Open browser console:
- `debugGame()` - View game state
- `teleportPlayer(x, y)` - Move player to coordinates

Example: `teleportPlayer(800, 800)` to go to town center

## 🎯 Future Features

- Shop mechanics
- Inventory system
- Quest system
- More NPCs
- Day/night cycle
- Weather effects
- Mini-games

## 📝 Version History

### v1.0.0 - Initial Town Release
- Medium-sized town with camera following
- 3 enterable houses with interiors
- 4 NPCs (2 wandering, 2 in houses)
- Dialog system
- Smooth transitions

## 📄 License

MIT License - Feel free to learn from and modify!

---

**Welcome to Noxis Town! 🏘️**
