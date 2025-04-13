import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    MatCardModule, 
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  currentUser: User | null = null;
  editedUser: User | null = null; // Ideiglenes másolat a szerkesztéshez
  isEditing = false;

  constructor(private userService: UserService, private router: Router) {
    this.currentUser = this.userService.getCurrentUser();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.currentUser) {
      // Másolat készítése a szerkesztéshez
      this.editedUser = { ...this.currentUser };
    }
  }

  saveChanges(): void {
    if (this.currentUser && this.editedUser) {
      // Az eredeti felhasználó frissítése a szerkesztett adatokkal
      this.currentUser.username = this.editedUser.username;
      this.currentUser.email = this.editedUser.email;
      this.currentUser.password = this.editedUser.password;

      this.userService.updateUser(this.currentUser);
      alert('Profile updated successfully!');
      this.isEditing = false; // Visszaállítás megtekintési módra
    }
  }

  deleteAccount(): void {
    if (this.currentUser) {
      const confirmDelete = confirm('Are you sure you want to delete your account?');
      if (confirmDelete) {
        this.userService.deleteUser(this.currentUser.id);
        alert('Account deleted successfully!');
        this.router.navigate(['/registration']); // Navigálás a regisztrációs oldalra
      }
    }
  }
}