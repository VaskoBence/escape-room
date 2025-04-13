import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tileIcon',
  standalone: true,
})
export class TileIconPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'wall':
        return '🧱'; // Fal
      case 'player':
        return '🧍'; // Játékos
      case 'key':
        return '🔑'; // Kulcs
      case 'exit':
        return '🚪'; // Kijárat
      case 'lockedExit':
        return '🔒'; // Zárt kijárat
      case 'empty':
        return '⬜'; // Üres cella
      default:
        return '❓'; // Ismeretlen típus
    }
  }
}