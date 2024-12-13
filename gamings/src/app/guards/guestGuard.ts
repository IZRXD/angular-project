import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('accessToken'); 
    if (isLoggedIn) {
      this.router.navigate(['/home']); 
      return false;
    }
    return true;
  }
}
