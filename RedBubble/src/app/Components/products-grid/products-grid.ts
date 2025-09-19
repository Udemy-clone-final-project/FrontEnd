import { Component, Input } from '@angular/core';
import { ProductDto } from '../../Services/product.service';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';

 
@Component({
  selector: 'app-products-grid',
  imports: [CommonModule , ProductCard],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css'
})
export class ProductsGrid {

  // get it from productspage parent component
  @Input() products: ProductDto[] = []

}
