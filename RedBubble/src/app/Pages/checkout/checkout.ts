import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../Services/cart.service';
import { PaymentService } from '../../Services/payment.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private cart = inject(CartService);
  private payments = inject(PaymentService);
  private router = inject(Router);

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

  // Payment (Card only)
  cardNumber = signal<string>('');
  cardExp = signal<string>('');
  cardCvc = signal<string>('');
  useShippingForBilling = signal<boolean>(true);
  saveCardInfo = signal<boolean>(false);
  canPay = computed(() => this.isValidCardNumber(this.cardNumber()) && this.isValidExp(this.cardExp()) && this.isValidCvc(this.cardCvc()));
  payLabel = computed(() => `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.totalWithShipping())}`);

  // Helper validations (lightweight front-end checks)
  private digitsOnly(value: string) { return (value || '').replace(/\D+/g, ''); }
  isValidCardNumber(value: string) {
    const digits = this.digitsOnly(value);
    return digits.length >= 13 && digits.length <= 19; // basic length check
  }
  isValidExp(value: string) {
    const m = /^\s*(0[1-9]|1[0-2])\/(\d{2})\s*$/.exec(value || '');
    if (!m) return false;
    const month = Number(m[1]);
    const year2 = Number(m[2]);
    const now = new Date();
    const currentYear2 = Number(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;
    if (year2 < currentYear2) return false;
    if (year2 === currentYear2 && month < currentMonth) return false;
    return true;
  }
  isValidCvc(value: string) {
    return /^\d{3,4}$/.test((value || '').trim());
  }

  // Input handlers to format/sanitize outside template
  onCardNumberChange(value: string) {
    const digits = this.digitsOnly(value).slice(0, 19);
    // group into 4-4-4-4-3 pattern visually
    const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    this.cardNumber.set(grouped);
  }

  onCardExpChange(value: string) {
    const digits = this.digitsOnly(value).slice(0, 4); // MMYY
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    this.cardExp.set(formatted);
  }

  onCardCvcChange(value: string) {
    const digits = this.digitsOnly(value).slice(0, 4);
    this.cardCvc.set(digits);
  }

  // Trigger payment intent and (later) Stripe confirmation
  startPayment() {
    if (!this.canPay()) return;
    // Require auth for order creation
    const token = localStorage.getItem('rb_token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const amountCents = Math.round(this.totalWithShipping() * 100);
    const shippingInfo = {
      firstName: this.fullName().split(' ')[0] || this.fullName(),
      lastName: this.fullName().split(' ').slice(1).join(' '),
      email: this.email(),
      phone: this.phoneNumber(),
      address: `${this.addressLine1()} ${this.addressLine2()}`.trim(),
      city: this.city(),
      state: this.province(),
      zipCode: this.postalCode(),
      country: this.country(),
      shippingType: this.selectedShippingType()
    };

    this.payments.createPaymentIntent(amountCents, 'usd', undefined, shippingInfo).subscribe(async res => {
      const stripe = await loadStripe('pk_test_51Rz5apAo4Br4gXWiJuG0aSqLuQWy9SzdH7IvekvIqtj7lFWLGKs7mT6zDS0arPvsWj29WbvFcvxrtKUEhhdQ2BmZ00km09jH1Q');
      if (!stripe) return;

      const [mm, yy] = (this.cardExp() || '').split('/');
      // For PCI compliance, Stripe recommends Elements; direct details only for test/dev.
      const confirm = await stripe.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: { token: 'tok_visa' } as any,
          billing_details: { email: this.email() }
        }
      });

      if ((confirm as any).error) {
        console.error((confirm as any).error.message);
        return;
      }

      // Create order on backend (OrdersController) and clear cart
      const paymentIntentId = (confirm as any).paymentIntent?.id as string;
      const address = {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        country: shippingInfo.country,
        postalCode: shippingInfo.zipCode
      };
      try {
        await this.payments.createOrder({
          cartId: this.cart.getCartId() || '',
          deliveryMethodId: 1,
          shippingAddress: address
        }).toPromise();
      } catch (e) {
        console.error('Create order failed', e);
        if ((e as any)?.status === 401) {
          this.router.navigate(['/auth/login']);
          return;
        }
      }

      // Clear local cart
      this.cart.clear();

      this.router.navigate(['/checkout/success'], { queryParams: { pid: paymentIntentId } });
    });
  }
}
