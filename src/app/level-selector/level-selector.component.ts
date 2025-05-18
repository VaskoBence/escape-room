import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Level } from '../models/level.model';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-level-selector',
  imports: [CommonModule],
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.scss']
})
export class LevelSelectorComponent {
  @Input() levels: Level[] = [];
  @Input() selectedLevelId: number | null = null;
  @Input() showLocked: boolean = true;

  @Output() selectLevel = new EventEmitter<number>();
  @Output() filterLevels = new EventEmitter<string>();
  @Output() addLevel = new EventEmitter<void>();

  onSelect(levelId: number) {
    this.selectLevel.emit(levelId);
  }

  onFilter(difficulty: string) {
    this.filterLevels.emit(difficulty);
  }

  onAddLevel() {
    this.addLevel.emit();
  }
}