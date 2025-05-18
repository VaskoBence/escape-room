import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hud',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hud">
      <div class="timer">⏱️ {{ timer | number:'1.2-2' }}s</div>
      <div class="key-icon" [class.active]="hasKey">🔑</div>
      <button (click)="resetGame()">Reset</button>
    </div>
  `,
  styleUrls: ['./hud.component.scss'],
})
export class HudComponent {
  @Input() timer: number = 0;
  @Input() hasKey: boolean = false;

  @Output() reset = new EventEmitter<void>();

  resetGame(): void {
    this.reset.emit();
  }
}