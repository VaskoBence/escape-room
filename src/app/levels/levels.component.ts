import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { levels } from '../game/levels';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { LevelSelectorComponent } from '../level-selector/level-selector.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    LevelSelectorComponent,
     ],
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss'],
})
export class LevelsComponent implements OnInit {
  levels = levels;
  selectedLevelId: number | null = null;


  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.updateLevelAccess();
  }


  async updateLevelAccess(): Promise<void> {
    const authUser = await firstValueFrom(user(this.auth));
    if (authUser) {
      const progressDocRef = doc(this.firestore, 'progresses', authUser.uid);
      const progressSnap = await getDoc(progressDocRef);
      let completedLevels: number[] = [];
      if (progressSnap.exists()) {
        completedLevels = progressSnap.data()['completedLevels'] || [];
      }
      this.levels.forEach(level => {
        level.isUnlocked =
          level.id === 1 || completedLevels.includes(level.id - 1);
      });
    }
  }

  onFilterLevels(difficulty: string) {
    // Itt szűrheted a levels tömböt, vagy csak logolhatod:
    // Példa: csak az adott nehézségű pályákat mutasd
    // this.levels = levels.filter(l => l.difficulty === difficulty);
    console.log('Szűrés:', difficulty);
  }

  onAddLevel() {
    // Itt adhatsz hozzá új pályát, vagy csak logolhatod:
    console.log('Új pálya hozzáadása');
  }

  navigateToGame(levelId: number): void {
    this.selectedLevelId = levelId;
    const level = this.levels.find(l => l.id === levelId);
    if (level?.isUnlocked) {
      this.router.navigate(['/game', levelId]);
    }
  }
}