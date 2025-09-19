import { Component, Input, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProductDto } from '../../Services/product.service';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../Models/product';
import { CartService } from '../../Services/cart.service';
  
@Component({
  selector: 'app-product-card',
  imports: [CommonModule,RouterModule,CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product!: ProductDto;

  private cart = inject(CartService);

  addToCart() {
    if (!this.product) return;
    const colorName = this.product.colors?.[0]?.name || '';
    const sizeName = this.product.sizes?.[0] || '';
    this.cart.add({
      productId: this.product.id,
      images: this.product.images || [],
      title: this.product.title,
      price: this.product.price,
      currency: this.product.currency || 'USD',
      variant: { color: colorName, size: sizeName },
      qty: 1,
    });
  }
}
