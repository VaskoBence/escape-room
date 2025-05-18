import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LevelsComponent } from './levels/levels.component';
import { GameComponent } from './game/game.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'registration', loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent) },
  { path: 'levels', loadComponent: () => import('./levels/levels.component').then(m => m.LevelsComponent), canActivate: [authGuard] },
  { path: 'game/:levelId', loadComponent: () => import('./game/game.component').then(m => m.GameComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'statistics', loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent), canActivate: [authGuard] }
];