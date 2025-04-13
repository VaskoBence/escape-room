import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    const isValidUser = this.userService.validateUser(this.username, this.password);

    if (isValidUser) {
      alert('Login successful!');
      this.router.navigate(['/levels']); // Navigálás a szintek oldalra
    } else {
      alert('Invalid username or password!');
    }
  }
}