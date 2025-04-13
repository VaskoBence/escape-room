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

### 1. **Fordítási hiba nincs**
- Futtasd az `ng serve` parancsot, és ellenőrizd, hogy nincs fordítási hiba.

### 2. **Futtatási hiba nincs**
- Nyisd meg a böngésző konzolját (`F12` → Console fül), és ellenőrizd, hogy nincs hibaüzenet.

### 3. **Adatmodell definiálása**
- Ezeket az adatmodelleket használom:
  - **Tile**: A pálya celláinak modellje.
  - **Progress**: A felhasználó előrehaladásának modellje.
  - **Level**: A játék szintjeinek modellje.
  - **User**: A felhasználó modellje.

### 4. **Alkalmazás felbontása megfelelő számú komponensre**

### 5. **Reszponzív, mobile-first felület**

### 6. **Legalább 2 különböző attribútum direktíva használata**
- Ezeket az attribútim direktívákat használom például:
  - **`[class.*]`**: Dinamikus osztályok a cellák típusának megfelelően.
  - **`[style.*]`**: Dinamikus stílusok a cellák megjelenítéséhez.

### 7. **Legalább 2 különböző beépített vezérlési folyamat használata**
- Ezeket a vezérlési folyamatokat használom (`game/game.component.ts`):
  - **`if`**: Játékos mozgásának kezelése.
  - **`switch`**: A grid celláinak inicializálása. 
  - **`for`**: A grid celláinak bejárása (pl. kijárat kinyitása).
    
### 8. **Adatátadás szülő és gyermek komponensek között**
- Itt találhatóak: **`hud/hud.component.ts`**:
  - **`@Input`**: Fogadja a `timer` és `hasKey` értékét a szülőtől.
  - **`@Output`**: Eseményt küld a szülőnek a játék újraindításához.

### 9. **Legalább 10 különböző Material elem helyes használata**
- Az alábbi Material elemeket használtam.:
  - **MatToolbarModule**
  - **MatButtonModule**
  - **MatIconModule**
  - **MatProgressBarModule**
  - **MatSnackBarModule**
  - **MatDialogModule**
  - **MatInputModule**
  - **MatCheckboxModule**
  - **MatSelectModule**
  - **MatTooltipModule**

### 10. **Adatbevitel Angular form-ok segítségével**
- Ezek az megvalósított Angular form-ok:
  - **Regisztrációs űrlap**: A `registration/registration.component.ts`-ben.
  - **Bejelentkezési űrlap**: A `login/login.component.ts`-ben.

### 11. **Legalább 1 saját Pipe osztály írása és használata**
- Itt található a Pipe osztály: **`pipe/tile-icon.pipe.ts`**:
  - A cellák típusát ikonokra alakítja át.
  - Használatban van a grid megjelenítésénél.