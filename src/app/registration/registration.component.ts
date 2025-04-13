import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importáljuk a Router osztályt
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  username = '';
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {} // Router injektálása

  register(): void {
    const newUser: User = {
      id: Date.now().toString(), // Ideiglenes ID
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.userService.addUser(newUser);
    console.log('Registered users:', this.userService.getUsers());
    alert('Registration successful!');

    // Navigálás a bejelentkező oldalra
    this.router.navigate(['/login']);
  }
}