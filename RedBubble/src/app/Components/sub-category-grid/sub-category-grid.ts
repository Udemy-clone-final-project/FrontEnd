import { Component, Input, input } from '@angular/core';
import { SubCategory } from '../../Models/sub-category';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-category-grid',
  imports: [RouterLink , CommonModule],
  templateUrl: './sub-category-grid.html',
  styleUrl: './sub-category-grid.css'
})
export class SubCategoryGrid {

  // this comes from parent component 
  // CategoryPage (parent) sends category.subCategories into SubCategoryGrid (child)
  @Input() subCategories: SubCategory[] = []; 

  constructor(private router:Router){}

  goToProducts(subCatId: number){
    // go to products that under this subcategory
    this.router.navigate(['/subcategory', subCatId]); // according to routes ==> this will go in ProductsPage
  }

// How the flow works now
// Category page passes category.subCategories → SubCategoryGridComponent.
// You click a subcategory → router.navigate(['/subcategory', sub.id]).
// Angular matches your route { path: 'subcategory/:subCatId', component: ProductsPage }
// ProductsPageComponent loads and fetches products for that ID.

}
