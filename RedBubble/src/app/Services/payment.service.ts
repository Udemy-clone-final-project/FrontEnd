import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private cart = inject(CartService);
  private baseUrl = 'https://localhost:7106/api/payments';

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const cartId = this.cart.getCartId();
    if (cartId) headers = headers.set('x-cart-id', cartId);
    const token = localStorage.getItem('rb_token');
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  createOrUpdatePaymentIntent(): Observable<any> {
    const cartId = this.cart.getCartId() || '';
    return this.http.post(`${this.baseUrl}/${cartId}`, {}, { headers: this.buildHeaders() });
  }

  createPaymentIntent(amount: number, currency = 'usd', cartId?: string, shippingInfo?: any): Observable<{ clientSecret: string; paymentIntentId: string; }> {
    return this.http.post<{ clientSecret: string; paymentIntentId: string; }>(`${this.baseUrl}/create-payment-intent`, {
      amount,
      currency,
      cartId: cartId || this.cart.getCartId(),
      shippingInfo
    }, { headers: this.buildHeaders() });
  }

  confirmPaymentAndCreateOrder(request: { cartId: string; paymentIntentId: string; shippingInfo?: any; billingInfo?: any; }): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/confirm-payment`, request, { headers: this.buildHeaders() });
  }

  // Real order creation against OrdersController
  createOrder(order: { cartId: string; deliveryMethodId: number; shippingAddress: AddressDto; }): Observable<any> {
    return this.http.post(`https://localhost:7106/api/orders`, order, { headers: this.buildHeaders() });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7106/api/orders`, { headers: this.buildHeaders() });
  }
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  estimatedDelivery: string;
}

export interface AddressDto {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}


