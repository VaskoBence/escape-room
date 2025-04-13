import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { levels } from '../game/levels'; // Import levels
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss'],
})
export class LevelsComponent implements OnInit {
  levels = levels; // A levels tömb importálása

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.updateLevelAccess(); // Frissítjük a szintek elérhetőségét
  }

  updateLevelAccess(): void {
    const progress = this.userService.getUserProgress(); // Felhasználói progressz lekérdezése
    if (progress) {
      this.levels.forEach(level => {
        level.isUnlocked =
          level.id === 1 || progress.completedLevels.includes(level.id - 1); // Az első szint mindig elérhető, a többi a progressz alapján
      });
    }
  }

  navigateToGame(levelId: number): void {
    const level = this.levels.find(l => l.id === levelId);
    if (level?.isUnlocked) {
      this.router.navigate(['/game', levelId]); // Navigálás a játék oldalra
    }
  }
}