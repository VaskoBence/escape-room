# SzabaduloSzoba

Ez a projekt egy szabadulószoba játék, amely Angular keretrendszerrel készült. A játék célja, hogy a játékos megtalálja a kulcsot, és kijusson a pályáról.

## Fejlesztési környezet

- **Angular CLI**: 19.2.7
- **Node.js**: 16.x vagy újabb
- **NPM**: 8.x vagy újabb

## Telepítés és futtatás

1. Klónozd a repót:
   ```bash
   git clone https://github.com/felhasznalonev/szabadulo-szoba.git
   cd szabadulo-szoba
   ```

2. Telepítsd a szükséges csomagokat:
   ```bash
   npm install
   ```

3. Indítsd el a fejlesztői szervert:
   ```bash
   ng serve
   ```

4. Nyisd meg a böngészőt, és látogasd meg az alábbi URL-t:
   ```
   http://localhost:4200
   ```
## Specifikáció

### Leírás
- A weboldalra a látogató tud regisztrálni, majd belépni.
- A bejelentkezett felhasználó megnézheti a profilját, módosíthatja adatait.
- A bejelentkezett felhasználó választhat pályák közül, amiket feloldott (alap esetben csak az 1. pálya van feloldva).
- A bejelentkezett felhasználó játszhat a játékkal.

### Játék leírása
- A játékos a W,A,S,D billentyűkkel irányíthatja a karakterét
- A pályán el kell jutni a kijárathoz.
- A kijárat csak akkor elérhető, ha felvesz egy kulcsot, ami a pályán található.
- Ha sikerül eljutni a kijárathoz, feloldódik a következő szint.


### To-Do list
- Profil adatok és feloldott pályák helyes tárolása.
- A játék lekorlátozása bejelentkezett felhasználókra.
- A pályák elérhetőségének limitálása.
- A játék kinézetének, elrendezésének feljavítása.
- Plusz játékelemek.
- Scoreboard
## Követelmények és ellenőrzési pontok

# Javítói segédlet – Szabaduló szoba Angular projekt

**Fordítási hiba nincs:**  
- `ng serve` futtatásakor nincs hiba.

**Futtatási hiba nincs:**  
- A böngésző konzolban sem jelenik meg hiba.

---

## Követelmények és megvalósításuk helye

### 1. Adatmodell definiálása (legalább 4 TypeScript interfész vagy class)
- `src/app/models/score.model.ts` – `Score` interface
- `src/app/models/level.model.ts` – `Level` interface
- `src/app/models/user.model.ts` – `User` interface
- `src/app/models/progress.model.ts` – `Progress` interface

### 2. Reszponzív, mobile-first felület
- Globális: `src/styles.scss`
- Példák: `app.component.scss`, `game.component.scss`, `profile.component.scss`, `registration.component.scss`
- Minden oldal mobilon is jól jelenik meg.

### 3. Legalább 4, de 2 különböző attribútum direktíva használata
- `[ngClass]`, `[ngStyle]`, ezek több helyen is szerepelnek – pl. `level-selector.component.html`, `profile.component.html`, `statistics.component.html`

### 4. Legalább 4, de 2 különböző beépített vezérlési folyamat használata
- `*ngIf`, `*ngFor` – pl. `statistics.component.html`, `profile.component.html`, `levels.component.html`


### 5. Adatátadás szülő és gyermek komponensek között (legalább 3 @Input és 3 @Output)
- `level-selector.component.ts`:  
  - `@Input() levels`, `@Input() selectedLevelId`, `@Input() showLocked`
  - `@Output() selectLevel`, `@Output() filterLevels`, `@Output() addLevel`
- Használat: `levels.component.html`
- `hud.component.ts`:
  - `@Input() @Input() timer,  @Input() hasKey, @Output() reset`
- Használat: `game.component.html`
### 6. Legalább 10 különböző Material elem helyes használata
- `MatCardModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatIconModule`, `MatTableModule`, `MatSelectModule`, `MatSnackBarModule`, `MatDialogModule`, `MatProgressBarModule`
- Példák: `registration.component.html`, `login.component.html`, `profile.component.html`, `levels.component.html`

### 7. Legalább 2 saját Pipe osztály írása és használata
- `src/app/pipe/tile-icon.pipe.ts` – `TileIconPipe`
- `src/app/pipe/difficulty-color.pipe.ts` – `DifficultyColorPipe`
- Használat: `game.component.html, levels.component.html`

### 8. Adatbevitel Angular form-ok segítségével (legalább 4)
- `registration.component.html` – regisztrációs űrlap
- `login.component.html` – bejelentkezési űrlap
- `profile.component.html` – profil szerkesztés

### 9. Legalább 2 különböző Lifecycle Hook használata
- `ngOnInit` – pl. minden fő komponensben (`game.component.ts`, `statistics.component.ts`, `levels.component.ts`)
- (Ha van: `ngOnDestroy`, `ngAfterViewInit`)

### 10. CRUD műveletek mindegyike megvalósult legalább a projekt fő entitásához (Promise, Observable használattal)
- Példa:  
  - Létrehozás: `game.component.ts` – pont mentése Firestore-ba (`addDoc`)
  - Olvasás: `statistics.component.ts` – leaderboard lekérdezés (`getDocs`)
  - Módosítás: `profile.component.ts` – profil frissítés (`updateDoc`)
  - Törlés: `profile.component.ts` – profil törlés (`deleteDoc`)
- Promise és Observable is használatban, pl. `statistics.component.ts`

### 11. CRUD műveletek service-ekbe vannak kiszervezve és megfelelő módon injektálva lettek
- Példa: `user.service.ts` – létrehozás,olvasás, törlés, módosítás
- Service injektálás: pl. minden fő komponens konstruktorában

### 12. Legalább 4 komplex Firestore lekérdezés (where, rendezés, limit, stb.)
- `statistics.component.ts` – `loadLeaderboard()` metódus:
  - Top 10: where + orderBy + limit
  - Utolsó 7 nap: where + where + orderBy + limit
  - Saját eredmények: where + where + orderBy + limit
  - Legjobb mindenkitől: where + orderBy + frontenden aggregálva

### 13. Legalább 4 különböző route a különböző oldalak eléréséhez
- `app.routes.ts`:
  - `/login`
  - `/registration`
  - `/levels`
  - `/game/:levelId`
  - `/profile`
  - `/statistics`

### 14. AuthGuard implementációja
- `guards/auth.guard.ts` – és használata: `app.routes.ts` (pl. `canActivate: [authGuard]`)

### 15. Legalább 2 route levédése azonosítással (AuthGuard)
- `app.routes.ts`:  
  - `/levels`, `/game/:levelId`, `/profile`, `/statistics` route-ok AuthGuard-dal védve


---

**Ha valamelyik követelmény nem lenne egyértelműen megtalálható, kérlek jelezd!**

---
