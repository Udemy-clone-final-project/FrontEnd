import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../Services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private cart = inject(CartService);

  // Cart/summary
  items = this.cart.items;
  firstItem = computed<CartItem | null>(() => this.items().length ? this.items()[0] : null);
  subtotal = this.cart.subtotal;

  // Shipping (UI only for now)
  selectedShippingType = signal<'standard' | 'express'>('standard');
  private shippingPrices: Record<'standard' | 'express', number> = { standard: 27.05, express: 65.33 };
  shippingCost = computed(() => this.shippingPrices[this.selectedShippingType()]);
  totalWithShipping = computed(() => this.subtotal() + this.shippingCost());
  selectShipping(type: 'standard' | 'express') { this.selectedShippingType.set(type); }

  // Address signals (UI only)
  email = signal<string>('');
  signUpForOffers = signal<boolean>(false);
  fullName = signal<string>('');
  country = signal<string>('Egypt');
  addressLine1 = signal<string>('');
  addressLine2 = signal<string>('');
  city = signal<string>('');
  province = signal<string>('');
  postalCode = signal<string>('');
  phoneNumber = signal<string>('');

  showExtraAddressFields = computed(() => this.addressLine1().trim().length > 0);

  // Payment (UI only)
  paymentMethod = signal<'card' | 'bank' | 'paypal'>('card');
  cardNumber = signal<string>('');
  cardExp = signal<string>('');
  cardCvc = signal<string>('');
  useShippingForBilling = signal<boolean>(true);
  saveCardInfo = signal<boolean>(false);
  payLabel = computed(() => `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.totalWithShipping())}`);

  // Static bank list for UI (Angular 20: used with @for in template)
  banks: string[] = [
    'Mercury',
    'Bank of America',
    'Navy Federal Credit Union',
    'Chase',
    'Wells Fargo',
    'Capital One',
    'US Bank',
    'PNC Bank',
    'USAA Bank',
    'TD Bank',
    'Truist',
    'Citibank'
  ];
}
