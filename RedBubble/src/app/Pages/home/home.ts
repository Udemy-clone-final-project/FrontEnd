import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../Components/product-card/product-card';
import { ProductDto, ProductService } from '../../Services/product.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  private productService = inject(ProductService);
  products = signal<ProductDto[]>([]);

  ngOnInit() {
    this.productService
      .getAll({ page: 1, limit: 15 })
      .subscribe(({ items }) => this.products.set(items));
  }
}
