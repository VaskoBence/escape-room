import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hud',
  standalone: true,
  template: `
    <div class="hud">
      <div class="timer">⏱️ {{ timer }}s</div>
      <div class="key-icon" [class.active]="hasKey">🔑</div>
      <button (click)="resetGame()">Reset</button>
    </div>
  `,
  styleUrls: ['./hud.component.scss'],
})
export class HudComponent {
  @Input() timer: number = 0; // Az időzítő értéke a szülőtől
  @Input() hasKey: boolean = false; // A kulcs állapota a szülőtől

  @Output() reset = new EventEmitter<void>(); // Esemény a szülőnek

  resetGame(): void {
    this.reset.emit(); // Kibocsátjuk az eseményt
  }
}