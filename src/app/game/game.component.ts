import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { levels } from './levels';
import { MatCardModule } from '@angular/material/card';
import { Tile } from '../models/tile.model';
import { HudComponent } from '../hud/hud.component';
import { TileIconPipe } from '../pipe/tile-icon.pipe';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HudComponent,
    TileIconPipe,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  grid: Tile[][] = []; // A pálya gridje Tile objektumokkal
  playerPosition = { x: 0, y: 0 }; // Játékos pozíciója
  viewport = { startX: 0, startY: 0, width: 10, height: 10 }; // Nézetablak
  levelId: number = 1; // Aktuális szint azonosítója
  hasKey: boolean = false; // Van-e kulcsa a játékosnak
  timer: number = 0; // Időzítő

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.levelId = +this.route.snapshot.paramMap.get('levelId')!;
    const level = levels.find((l) => l.id === this.levelId);
    if (level) {
      this.viewport.width = Math.min(10, Math.floor(window.innerWidth / 50)); // Dinamikus szélesség
      this.viewport.height = Math.min(10, Math.floor(window.innerHeight / 50)); // Dinamikus magasság
      this.initializeGrid(level.layout);
      this.startTimer();
    }
  }

  initializeGrid(layout: string[][]): void {
    this.grid = layout.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        switch (cell) {
          case 'W':
            return { type: 'wall', isWalkable: false } as Tile;
          case 'P':
            this.playerPosition = { x: rowIndex, y: colIndex }; // Játékos pozíció
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

    this.updateViewport(); // Frissítjük a nézetablakot
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const { x, y } = this.playerPosition;
    let newX = x;
    let newY = y;

    // Irányok kezelése
    if (event.key === 'w' && x > 0) newX--; // Felfelé
    if (event.key === 's' && x < this.grid.length - 1) newX++; // Lefelé
    if (event.key === 'a' && y > 0) newY--; // Balra
    if (event.key === 'd' && y < this.grid[0].length - 1) newY++; // Jobbra

    const targetTile = this.grid[newX][newY];

    if (targetTile.isWalkable) {
      // Játékos pozíció frissítése
      this.grid[x][y] = { type: 'empty', isWalkable: true }; // Az előző pozíció üres lesz
      this.playerPosition = { x: newX, y: newY }; // Új pozíció
      this.grid[newX][newY] = { type: 'player', isWalkable: true }; // Az új pozíció a játékosé

      // Ha kulcsra lépünk
      if (targetTile.type === 'key' && targetTile.hasKey) {
        this.hasKey = true;

        // Nyissuk ki a kijáratot
        for (let i = 0; i < this.grid.length; i++) {
          for (let j = 0; j < this.grid[i].length; j++) {
            if (this.grid[i][j].type === 'lockedExit') {
              this.grid[i][j] = { type: 'exit', isWalkable: true }; // Kinyitjuk a kijáratot
            }
          }
        }
      }

      // Ha kijáratra lépünk
      if (targetTile.type === 'exit') {
        alert('Level Complete!');
        this.userService.completeLevel(this.levelId);
        this.router.navigate(['/levels']);
      }

      this.updateViewport();
    } else if (targetTile.type === 'lockedExit' && !this.hasKey) {
      alert('The exit is locked! Find the key first.');
    }
  }

  startTimer(): void {
    setInterval(() => {
      this.timer++;
    }, 1000);
  }

  updateViewport(): void {
    const { x, y } = this.playerPosition;
  
    // A nézetablak eltolása (pl. 1/3-nál kezdje a követést)
    const offsetX = Math.floor(this.viewport.width / 3); // Vízszintes eltolás
    const offsetY = Math.floor(this.viewport.height / 3); // Függőleges eltolás
  
    this.viewport.startX = Math.max(0, x - offsetY);
    this.viewport.startY = Math.max(0, y - offsetX);
  
    // Biztosítjuk, hogy a nézetablak ne lépje túl a pálya határait
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
    // Játék újraindítása
    this.timer = 0;
    this.hasKey = false;
  
    // Az aktuális szint újrainicializálása
    const level = levels.find((l) => l.id === this.levelId);
    if (level) {
      this.initializeGrid(level.layout); // Újrainicializáljuk a pályát az eredeti elrendezés alapján
    }
  }

  getVisibleGrid(): Tile[][] {
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

    return visibleGrid[0].map((_, colIndex) =>
  visibleGrid.map(row => row[colIndex])
);
  }
}