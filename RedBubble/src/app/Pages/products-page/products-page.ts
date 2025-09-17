import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { ProductDto } from '../../Services/product.service';
import { ProductsGrid } from '../../Components/products-grid/products-grid';

@Component({
  selector: 'app-products-page',
  imports: [ProductsGrid],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css'
})
export class ProductsPage implements OnInit {

  products: ProductDto[] = []
  
  
  
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
    // Listen for changes in route parameters
    this.route.paramMap.subscribe(params => {
      const subCatId = params.get('subCatId');
      const themeId = params.get('themeId');

      if (subCatId) {
        this.productService.getAll({ page: 1, limit: 12, tag: subCatId })
          .subscribe(({ items }) => {
            this.products = items;
          });
      } else if (themeId) {
        this.productService.getAll({ page: 1, limit: 12, tag: themeId })
          .subscribe(({ items }) => {
            this.products = items;
          });
      } else {
        this.productService.getAll({ page: 1, limit: 12 })
          .subscribe(({ items }) => {
            this.products = items;
          });
      }
    }
    )

    console.log(this.products);
  }
  

}
