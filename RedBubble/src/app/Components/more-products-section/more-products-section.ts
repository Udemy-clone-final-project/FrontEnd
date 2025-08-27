import { Component, computed, Input, signal } from '@angular/core';
import { ProductDto } from '../../Services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-more-products-section',
  imports: [CommonModule,RouterModule,CurrencyPipe,ProductCard],
  templateUrl: './more-products-section.html',
  styleUrl: './more-products-section.css'
})


export class MoreProductsSection {
  private _products = signal<ProductDto[]>([]);
  private _title = signal<string>('Related Products');

  @Input() set products(value: ProductDto[]) {
    this._products.set(value);
  }
  @Input() set title(value: string) {
    this._title.set(value);
  }

  productsSignal = this._products.asReadonly();
  titleSignal = this._title.asReadonly();


  productChunks = computed(() => {
    const chunks = [];
    for (let i = 0; i < this.productsSignal().length; i += 4) {
      chunks.push(this.productsSignal().slice(i, i + 4));
    }
    return chunks;
  })
}
