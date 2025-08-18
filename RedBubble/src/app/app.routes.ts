import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthCardComponent } from './Components/auth-card/auth-card-component';
import { ProductDetails } from './Pages/product-details/product-details';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'home',
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
  },
  {
    path: 'products/:id',
    component: ProductDetails,
    pathMatch: 'full'
  }

];
