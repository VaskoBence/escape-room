import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const currentUser = await firstValueFrom(user(auth));
  if (currentUser) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};