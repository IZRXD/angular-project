import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { GamesCatalogComponent } from './games-catalog/games-catalog.component';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { authGuard } from './guards/auth.guard';
import { GameEditComponent } from './game-edit/game-edit.component';
import { AboutComponent } from './about/about.component';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },

  {
    path: 'create-game',
    component: GameCreateComponent,
    canActivate: [authGuard],
  },

  {
    path: 'catalog',
    children: [
      { path: '', component: GamesCatalogComponent },
      {
        path: ':gameId/details',
        component: GameDetailsComponent,
      },
      { path: ':gameId/edit', component: GameEditComponent },
      { path: ':gameId/delete', component: GameDetailsComponent },
    ],
    canActivate: [authGuard],
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
