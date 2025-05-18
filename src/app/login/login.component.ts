import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = ''
  error = '';

  constructor(
  public authService: AuthService,
  private router: Router
) {
  this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.router.navigate(['/levels']);
      }
    });
}
  async login() {
    this.error = '';
    try {
      await this.authService.login(this.email, this.password);
      alert('Sikeres bejelentkezés!');
      this.router.navigate(['/levels']);
    } catch (err: any) {
      this.error = err.message || 'Hibás email vagy jelszó!';
    }
  }
}