import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importáljuk a Router osztályt
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {take} from 'rxjs';

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
  password = ''
  error = '';

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {
  this.authService.currentUser$.pipe(take(1)).subscribe(user => {
    if (user) {
      this.router.navigate(['/levels']);
    }
  });
}

 async register() {
  this.error = '';
  try {
    // Firebase Auth regisztráció
    const cred = await this.authService.register(this.email, this.password);

    // Firestore-ban user dokumentum létrehozása (userId = Firebase Auth uid)
    await setDoc(doc(this.firestore, 'users', cred.user.uid), {
      username: this.username,
      email: this.email,
      createdAt: new Date()
    });

    // Firestore-ban progress dokumentum létrehozása (userId = Firebase Auth uid)
    await setDoc(doc(this.firestore, 'progresses', cred.user.uid), {
      userId: cred.user.uid,
      completedLevels: []
    });

    alert('Sikeres regisztráció!');
    this.router.navigate(['/login']);
  } catch (err: any) {
    this.error = err.message || 'Ismeretlen hiba!';
  }
}
}