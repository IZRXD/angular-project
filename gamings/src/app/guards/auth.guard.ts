import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../user/user.service';
import { map, take, catchError, of } from 'rxjs';



export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        // Allow access if NOT logged in
        return true;
      } else {
        router.navigate(['/home']); // Redirect to home if logged in
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error in AuthGuard:', error);
      router.navigate(['/error']);
      return of(false);
    })
  );
};
