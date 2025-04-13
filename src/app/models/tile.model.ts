export interface Tile {
    type: 'empty' | 'wall' | 'player' | 'key' | 'exit' | 'lockedExit'; // Tile típusa
    isWalkable: boolean; // Járható-e a tile
    hasKey?: boolean; // Van-e kulcs a tile-on
  }