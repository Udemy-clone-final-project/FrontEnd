import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryComponent } from './Pages/category-page/category';

export const routes: Routes = [
     {path: '', component: HomeComponent},
     {path: 'category/:id', component: CategoryComponent},
];
