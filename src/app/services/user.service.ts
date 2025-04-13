import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Progress } from '../models/progress.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];
  private progress: Progress[] = []; // Progressziók tömbje
  private currentUser: User | null = null; // Az aktuális felhasználó

  // Felhasználó hozzáadása
  addUser(user: User): void {
    this.users.push(user);
    this.progress.push({ userId: user.id, completedLevels: [] }); // Alapértelmezett progressz
  }

  // Felhasználó ellenőrzése bejelentkezéshez
  validateUser(username: string, password: string): boolean {
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      this.currentUser = user;
      return true;
    }
    return false;
  }

  // Felhasználók lekérdezése
  getUsers(): User[] {
    return this.users; // Visszaadja a felhasználók tömbjét
  }
  
  // Bejelentkezési állapot lekérdezése
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserProgress(): Progress | null {
    if (!this.currentUser) return null; // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
    return this.progress.find(p => p.userId === this.currentUser!.id) || null;
  }

  completeLevel(levelId: number): void {
    if (!this.currentUser) return; // Ha nincs bejelentkezett felhasználó, kilépünk
  
    let userProgress = this.progress.find(p => p.userId === this.currentUser!.id);
    if (!userProgress) {
      // Ha még nincs progresszió ehhez a felhasználóhoz, inicializáljuk
      userProgress = { userId: this.currentUser!.id, completedLevels: [] };
      this.progress.push(userProgress);
    }
  
    if (!userProgress.completedLevels.includes(levelId)) {
      userProgress.completedLevels.push(levelId); // Hozzáadjuk a teljesített szintet
    }
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    // Ha még nincs progresszió ehhez a felhasználóhoz, inicializáljuk
    if (!this.progress.find(p => p.userId === user.id)) {
      this.progress.push({ userId: user.id, completedLevels: [] });
    }
  }

  // Kijelentkezés
  logout(): void {
    this.currentUser = null; // Töröljük az aktuális felhasználót
  }

  // Felhasználó frissítése
  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      if (this.currentUser?.id === updatedUser.id) {
        this.currentUser = updatedUser; // Frissítjük az aktuális felhasználót
      }
    }
  }

  deleteUser(userId: string): void {
    this.users = this.users.filter(user => user.id !== userId);
    this.progress = this.progress.filter(p => p.userId !== userId); // Töröljük a progressziót is
    if (this.currentUser?.id === userId) {
      this.currentUser = null; // Töröljük az aktuális felhasználót
    }
  }
}