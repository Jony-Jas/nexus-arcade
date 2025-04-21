import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// import { InitializationService } from '../services/initialization.service';

@Injectable({
  providedIn: 'root',
})
export class InitializationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if user is authenticated in cookies
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));

    if (!token) {
      window.location.href = 'http://localhost:3000/auth'; // Using port 4202 for the auth app
      return false;
    }

    return true;
  }
}
