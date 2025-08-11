import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product-service';
import { Product } from '../../Models/product';
import { ProductsGrid } from '../../Components/products-grid/products-grid';

@Component({
  selector: 'app-products-page',
  imports: [ProductsGrid],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage implements OnInit {

  products: Product[] = []
  
  
  
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    // Listen for changes in route parameters
    this.route.paramMap.subscribe(params => {
      const subCatId = params.get('subCatId');
      const themeId = params.get('themeId');

      if (subCatId) {
        this.productService.getProductsBySubCategory(subCatId)
          .subscribe(data => {
            this.products = data;
          });
      }

      else if (themeId) {
        this.productService.getProductsByTheme(themeId)
          .subscribe(data => {
            this.products = data
          });
      }
    }
    )

    console.log(this.products);
  }
  

}
