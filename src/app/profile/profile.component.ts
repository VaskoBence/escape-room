import { Component } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserService, UserProfile } from '../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  currentUser: UserProfile | null = null;
  editedUser: UserProfile | null = null;
  isEditing = false;
  error = '';
  success = '';
  userId: string | null = null;

  constructor(
    private auth: Auth,
    private userService: UserService
  ) {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const authUser = await firstValueFrom(user(this.auth));
    if (authUser) {
      this.userId = authUser.uid;
      this.currentUser = await this.userService.getProfile(this.userId);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedUser = { ...this.currentUser! };
    } else {
      this.editedUser = null;
    }
  }

  async saveChanges() {
    this.error = '';
    this.success = '';
    try {
      if (this.userId && this.editedUser) {
        await this.userService.updateProfile(this.userId, {
          username: this.editedUser.username,
          email: this.editedUser.email
        });
        this.currentUser = { ...this.editedUser };
        this.success = 'Profil sikeresen frissítve!';
        this.isEditing = false;
        this.editedUser = null;
      }
    } catch (err: any) {
      this.error = err.message || 'Hiba történt a profil frissítésekor!';
    }
  }

  async deleteProfile() {
    if (!this.userId) return;
    if (!confirm('Biztosan törlöd a profilodat? Ez nem visszavonható!')) return;

    try {
      await this.userService.deleteProfile(this.userId);
      window.location.href = '/login';
    } catch (err: any) {
      this.error = err.message || 'Hiba történt a profil törlésekor!';
    }
  }
}