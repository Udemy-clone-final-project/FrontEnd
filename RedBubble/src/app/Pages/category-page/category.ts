import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../Services/category-service';
import { Category } from '../../Models/category';
import { CommonModule } from '@angular/common';

import { CategoryBanner } from '../../Components/category-banner/category-banner';
import { SubCategoryGrid } from '../../Components/sub-category-grid/sub-category-grid';
import { ShopByTheme } from '../../Components/shop-by-theme/shop-by-theme';
import { BestSellingProducts } from '../../Components/best-selling-products/best-selling-products';

@Component({
  selector: 'app-category',
  imports: [CommonModule , CategoryBanner , SubCategoryGrid , ShopByTheme , BestSellingProducts],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class CategoryComponent implements OnInit {
  
  // category? : Category // object from category model 
  category: Category = {
  id: 0,
  title: '',
  banner: '',
  subCategories: [],
  themes: [],
  bestSelling: []
};

  constructor( private route: ActivatedRoute , private categoryService : CategoryService) {}

  ngOnInit(): void {
    // Retrieve the category ID from the route parameters
    // Assuming the route is configured to pass an 'id' parameter
    const id = this.route.snapshot.paramMap.get('id') as string;

    this.categoryService.getCategory(id).subscribe(
      (category) => {
        // Handle the retrieved category data
        this.category = category;
        console.log('Category fetched successfully:', this.category);
      },
      (error) => {
        // Handle any errors that occur during the request
        console.error('Error fetching category:', error);
      }
    )
  }

}
