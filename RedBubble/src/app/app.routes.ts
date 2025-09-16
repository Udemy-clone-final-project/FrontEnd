import { Routes } from '@angular/router';

import { Home } from './Pages/home/home';
import { CategoryComponent } from './Pages/category-page/category';
import { ProductsPage } from './Pages/products-page/products-page';

import { AuthCardComponent } from './Components/auth-card/auth-card-component';
import { ProductDetails } from './Pages/product-details/product-details';
import {Cart} from './Pages/cart/cart';
import { Checkout } from './Pages/checkout/checkout';
import { NotFound } from './Pages/not-found/not-found';
import { Shop } from './Pages/shop/shop';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    pathMatch: 'full'
  },
      // { path: 'category/:categoryId', component: CategoryPageComponent }, // category page
     { path: 'category/:id', component: CategoryComponent },
     { path: 'subcategory/:subCatId', component: ProductsPage },
     { path: 'theme/:themeId', component: ProductsPage },
     
     // press sub-cat or theme ==> productspage
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
    path: 'shop',
    component: Shop,
    pathMatch: 'full'
  },
  {
    path: 'shop/tag/:slug',
    component: Shop,
    pathMatch: 'full'
  },
  {
    path: 'products/:id',
    component: ProductDetails,
    pathMatch: 'full'
  },
  {
    path: 'cart',
    component:Cart,
    pathMatch: 'full'
  },
  {
    path: 'checkout',
    component: Checkout,
    pathMatch: 'full'
  },
  {
    path:'**',
    component:NotFound,
    pathMatch:'full'
  }

];

// Navigation Tree Diagram in RedBubble

// HOME (/home)
// │
// └── Category Page (/category/:categoryId)
//     │
//     ├── Subcategories List
//     │     └── Products Page (/category/:categoryId/subcategory/:subCatId/products)
//     │
//     └── Themes List
//           └── Products Page (/category/:categoryId/theme/:themeId/products)
