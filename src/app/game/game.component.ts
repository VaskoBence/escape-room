import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Tile } from '../models/tile.model';
import { HudComponent } from '../hud/hud.component';
import { TileIconPipe } from '../pipe/tile-icon.pipe';
import { Firestore, doc, getDoc, updateDoc, setDoc, collection,addDoc, getDocs } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { DifficultyColorPipe } from '../pipe/difficulty-color.pipe';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HudComponent,
    TileIconPipe,
    DifficultyColorPipe
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  grid: Tile[][] = [];
  playerPosition = { x: 0, y: 0 };
  viewport = { startX: 0, startY: 0, width: 10, height: 10 };
  levelId: number = 1;
  hasKey: boolean = false;
  timer: number = 0; 
  difficulty: string = 'easy'; // alapértelmezett érték
  private timerId: any;
  private timerStart: number = 0;
  levelLayout: string[][] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}


  

  async ngOnInit() {
    this.levelId = +this.route.snapshot.paramMap.get('levelId')!;
    await this.loadLevelFromFirestore(this.levelId);
    this.viewport.width = Math.min(10, Math.floor(window.innerWidth / 50));
    this.viewport.height = Math.min(10, Math.floor(window.innerHeight / 50));
    this.initializeGrid(this.levelLayout);
    this.startTimer();

    // Görgetés a gridhez
    setTimeout(() => {
      const grid = document.querySelector('.game-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  async loadLevelFromFirestore(levelId: number) {
    const levelDocRef = doc(this.firestore, 'levels', String(levelId));
    const levelSnap = await getDoc(levelDocRef);
    if (levelSnap.exists()) {
      const data = levelSnap.data();
      this.levelLayout = data['layout'].map((row: string) =>
        row.split('').map(cell => cell === 'E' ? ' ' : cell)
      );
      this.difficulty = data['difficulty'] || 'easy'; // ITT ÁLLÍTSD BE!
    } else {
      alert('Level not found!');
      this.router.navigate(['/levels']);
    }
  }

  initializeGrid(layout: string[][]): void {
    this.grid = layout.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        switch (cell) {
          case 'W':
            return { type: 'wall', isWalkable: false } as Tile;
          case 'P':
            this.playerPosition = { x: rowIndex, y: colIndex };
            return { type: 'player', isWalkable: true } as Tile;
          case 'K':
            return { type: 'key', isWalkable: true, hasKey: true } as Tile;
          case 'E':
            return { type: 'exit', isWalkable: true } as Tile;
          case 'L':
            return { type: 'lockedExit', isWalkable: false } as Tile;
          default:
            return { type: 'empty', isWalkable: true } as Tile;
        }
      })
    );
    this.updateViewport();
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent): Promise<void> {
    const { x, y } = this.playerPosition;
    let newX = x;
    let newY = y;

    if (event.key === 'w' && x > 0) newX--;
    if (event.key === 's' && x < this.grid.length - 1) newX++;
    if (event.key === 'a' && y > 0) newY--;
    if (event.key === 'd' && y < this.grid[0].length - 1) newY++;

    const targetTile = this.grid[newX][newY];

    if (targetTile.isWalkable) {
      this.grid[x][y] = { type: 'empty', isWalkable: true };
      this.playerPosition = { x: newX, y: newY };
      this.grid[newX][newY] = { type: 'player', isWalkable: true };

      if (targetTile.type === 'key' && targetTile.hasKey) {
        this.hasKey = true;
        for (let i = 0; i < this.grid.length; i++) {
          for (let j = 0; j < this.grid[i].length; j++) {
            if (this.grid[i][j].type === 'lockedExit') {
              this.grid[i][j] = { type: 'exit', isWalkable: true };
            }
          }
        }
      }

      if (targetTile.type === 'exit') {
        this.stopTimer(); // Először állítsd meg a timert!
        alert('Level Complete!');
        await this.completeLevel(this.levelId);
        this.router.navigate(['/levels']);
      }

      this.updateViewport();
    } else if (targetTile.type === 'lockedExit' && !this.hasKey) {
      alert('The exit is locked! Find the key first.');
    }
  }

  async completeLevel(levelId: number) {
  const authUser = await firstValueFrom(user(this.auth));
  if (!authUser) return;
  const progressDocRef = doc(this.firestore, 'progresses', authUser.uid);
  const progressSnap = await getDoc(progressDocRef);
  if (progressSnap.exists()) {
    const data = progressSnap.data();
    const completedLevels: number[] = data['completedLevels'] || [];
    if (!completedLevels.includes(levelId)) {
      completedLevels.push(levelId);
      await updateDoc(progressDocRef, { completedLevels });
    }
  } else {
    await setDoc(progressDocRef, {
      userId: authUser.uid,
      completedLevels: [levelId]
    });
  }

  // SCORE MENTÉSE
  const scoresCol = collection(this.firestore, 'scores');
  await addDoc(scoresCol, {
  userId: authUser.uid,
  levelId: levelId,
  time: Math.round(this.timer * 100) / 100, // két tizedesre kerekítve
  date: new Date()
});
}

  startTimer(): void {
  this.timerStart = performance.now();
  this.timerId = setInterval(() => {
    this.timer = (performance.now() - this.timerStart) / 1000;
  }, 10); // 10ms, azaz századmásodperc pontosság
}

stopTimer(): void {
  if (this.timerId) {
    clearInterval(this.timerId);
    this.timerId = null;
    // Végső pontos érték, két tizedesre kerekítve
    this.timer = Math.round((performance.now() - this.timerStart) / 10) / 100;
  }
}

  updateViewport(): void {
    const { x, y } = this.playerPosition;
    const offsetX = Math.floor(this.viewport.width / 3);
    const offsetY = Math.floor(this.viewport.height / 3);

    this.viewport.startX = Math.max(0, x - offsetY);
    this.viewport.startY = Math.max(0, y - offsetX);

    this.viewport.startX = Math.min(
      this.viewport.startX,
      Math.max(0, this.grid.length - this.viewport.height)
    );
    this.viewport.startY = Math.min(
      this.viewport.startY,
      Math.max(0, this.grid[0].length - this.viewport.width)
    );
  }

  onReset(): void {
  this.stopTimer();      // Állítsd le a timert!
  this.timer = 0;
  this.hasKey = false;
  this.initializeGrid(this.levelLayout);
  this.startTimer();     // Indítsd újra a timert!
}

  getVisibleGrid(): Tile[][] {
  if (!this.grid || this.grid.length === 0 || !this.grid[0]) {
    return [];
  }
  const visibleGrid = this.grid
    .slice(
      this.viewport.startX,
      Math.min(this.viewport.startX + this.viewport.height, this.grid.length)
    )
    .map((row) =>
      row.slice(
        this.viewport.startY,
        Math.min(this.viewport.startY + this.viewport.width, row.length)
      )
    );

  // Ellenőrizd, hogy van-e legalább egy sor, különben ne próbálj map-elni!
  if (visibleGrid.length === 0 || !visibleGrid[0]) {
    return [];
  }

  return visibleGrid[0].map((_, colIndex) =>
    visibleGrid.map(row => row[colIndex])
  );
}
}