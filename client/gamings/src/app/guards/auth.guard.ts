import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../user/user.service';
import { map, take, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService: any = inject(AuthService);
  const router = inject(Router);

  return userService.isLoggedIn$.pipe(
    // Use observable
    take(1), //Take only one value
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login'], { replaceUrl: true }); //Add replaceUrl so it doesn't add to history stack
        return false;
      }
    })
  );
};
