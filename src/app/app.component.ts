import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'szabadulo-szoba'
  constructor(public authService: AuthService, private router: Router) {}

  async logout(): Promise<void> {
  await this.authService.logout();
  this.authService.currentUser$.pipe(take(1)).subscribe(user => {
    if (!user) {
      this.router.navigate(['/login']);
    }
  });
}
}