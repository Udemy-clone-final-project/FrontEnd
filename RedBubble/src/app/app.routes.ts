import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthCardComponent } from './Components/auth-card/auth-card-component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        component: AuthCardComponent,
        data: { mode: 'signup' }
      },
      {
        path: 'login',
        component: AuthCardComponent,
        data: { mode: 'login' }
      },
      {
        path: '',
        redirectTo: 'signup',
        pathMatch: 'full'
      }
    ]
  }
];
