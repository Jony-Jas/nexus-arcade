import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
