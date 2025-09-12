import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../Services/cart.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private cart = inject(CartService);

  items = this.cart.items;

  shippingType = this.cart.shippingType;
  shippingCost = this.cart.shippingCost;
  subtotal = this.cart.subtotal;
  totalWithShipping = this.cart.totalWithShipping;
  displayCurrency = signal<'USD' | string>('USD');



  onSelectShipping(t: 'standard'|'express') { this.cart.setShippingType(t); }

  // Coupon (UI only)
  couponCode = '';



  onInc(item: CartItem) { this.cart.changeQuantity({ productId: item.productId, variant: item.variant }, +1); }
  onDec(item: CartItem) { this.cart.changeQuantity({ productId: item.productId, variant: item.variant }, -1); }
  onRemove(item: CartItem) { this.cart.changeQuantity({ productId: item.productId, variant: item.variant }, -item.qty); }
}
