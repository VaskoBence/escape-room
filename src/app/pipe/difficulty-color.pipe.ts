import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyColor',
  standalone: true
})
export class DifficultyColorPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'easy': return '#4caf50';    // zöld
      case 'medium': return '#ff9800';  // narancs
      case 'hard': return '#f44336';    // piros
      default: return '#9e9e9e';        // szürke/alapértelmezett
    }
  }
}