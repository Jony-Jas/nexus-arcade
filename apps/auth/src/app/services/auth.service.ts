import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<boolean> {
    const user = await fetch('http://localhost:3000/api/users/' + username);

    if (!user.ok) {
      return false;
    }
    const userData = await user.json();

    // Check if the password matches
    if (userData.password === password) {
      // set token in cookie
      document.cookie = `token=${userData.password}; path=/; expires=${new Date(
        Date.now() + 24 * 60 * 60 * 1000
      )}`; // 1 day
      return true;
    }

    return false;
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const user: User = { username, email, password };

    try {
      const res = lastValueFrom(
        this.http.post('http://localhost:3000/api/users', user)
      );
      const data = await res;
      console.log('User registered successfully:', data);
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  logout(): void {
    document.cookie = 'token=;';
  }

  isLoggedIn(): boolean {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    if (!tokenCookie) return false;
    return true;
  }

  getToken(): string | null {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }
}
