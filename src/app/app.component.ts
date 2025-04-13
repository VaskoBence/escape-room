import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { RouterModule } from '@angular/router'; // Import RouterModule for router-outlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public userService: UserService, private router: Router) {}

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']); // Navigálás a login oldalra kijelentkezés után
  }
}