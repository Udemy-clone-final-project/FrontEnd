import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryComponent } from './Pages/category-page/category';
import { ProductsPage } from './Pages/products-page/products-page';

export const routes: Routes = [
     { path: '', component: HomeComponent },
     // { path: 'category/:categoryId', component: CategoryPageComponent }, // category page
     { path: 'category/:id', component: CategoryComponent },
     { path: 'subcategory/:subCatId', component: ProductsPage },
     { path: 'theme/:themeId', component: ProductsPage },
     // press sub-cat or theme ==> productspage

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
