import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryComponent } from './Pages/category-page/category';
import { ProductsPage } from './Pages/products-page/products-page';
import { AuthCardComponent } from './Components/auth-card/auth-card-component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
      // { path: 'category/:categoryId', component: CategoryPageComponent }, // category page
     { path: 'category/:id', component: CategoryComponent },
     { path: 'subcategory/:subCatId', component: ProductsPage },
     { path: 'theme/:themeId', component: ProductsPage },
     
     // press sub-cat or theme ==> productspage
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
