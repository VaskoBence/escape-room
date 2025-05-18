import { Component } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { User } from 'firebase/auth';
import { MatFormField, MatLabel} from '@angular/material/form-field'; 
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { deleteDoc } from '@angular/fire/firestore';
import { deleteUser } from 'firebase/auth';




interface UserProfile {
  username: string;
  email: string;
}

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
  userId: string | null = null; // <-- új mező

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const authUser = await firstValueFrom(user(this.auth));
    if (authUser) {
      this.userId = authUser.uid; 
      const userDocRef = doc(this.firestore, 'users', authUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        this.currentUser = userSnap.data() as UserProfile;
      }
    }
  }

  toggleEdit(): void{
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
      const userDocRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userDocRef, {
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
      // 1. Törlés Firestore-ból
      await deleteDoc(doc(this.firestore, 'users', this.userId));
      await deleteDoc(doc(this.firestore, 'progresses', this.userId));

      // 2. Törlés Firebase Auth-ból
      const authUser = await firstValueFrom(user(this.auth));
      if (authUser) {
        await deleteUser(authUser);
      }

      // 3. Átirányítás loginre
      window.location.href = '/login';
    } catch (err: any) {
      this.error = err.message || 'Hiba történt a profil törlésekor!';
    }
  }


}