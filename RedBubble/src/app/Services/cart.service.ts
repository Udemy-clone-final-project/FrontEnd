import { Injectable, signal, effect, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface CartItem {
  productId: number;
  images: string[];
  title: string;
  price: number;
  currency: string;
  variant: { color: string; size: string };
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7106/api';
  private cartIdKey = 'rb_cart_id';
  private cartId: string | null = localStorage.getItem(this.cartIdKey);
  private _items = signal<CartItem[]>([]);
  private _shippingPrices: Record<'standard' | 'express', number> = {
    standard: 0,
    express: 44.05,
  };
  totalItems = computed(() => this._items().reduce((sum, i) => sum + i.qty, 0));
  subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.price * i.qty, 0)
  );

  items = this._items.asReadonly();

  shippingType = signal<'standard' | 'express'>(
    (localStorage.getItem('cart.shippingType') as 'standard' | 'express') ??
      'standard'
  );
  shippingCost = computed(() => this._shippingPrices[this.shippingType()]);
  totalWithShipping = computed(() => this.subtotal() + this.shippingCost());

  setShippingType(type: 'standard' | 'express') {
    this.shippingType.set(type);
  }

  constructor() {
    // Hydrate from localStorage
    try {
      const raw = localStorage.getItem('cart.items');
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          this._items.set(parsed);
        }
      }
    } catch {
      // ignore hydration errors
    }

    // Sync local cache but server is source of truth
    effect(() => {
      try {
        const current = this._items();
        localStorage.setItem('cart.items', JSON.stringify(current));
      } catch {}
    });

    // persist shipping type
    effect(() => {
      try {
        localStorage.setItem(
          'cart.shippingType',
          JSON.stringify(this.shippingType())
        );
      } catch {}
    });
    // Initial fetch from API
    this.fetchCartFromApi();
  }

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.cartId) headers = headers.set('x-cart-id', this.cartId);
    return headers;
  }

  private saveCartId(id: string | null | undefined) {
    if (!id) return;
    this.cartId = id;
    localStorage.setItem(this.cartIdKey, id);
  }

  getCartId(): string | null {
    return this.cartId;
  }

  private mapFromDto(dto: CustomerCartDto): CartItem[] {
    return (dto.items || dto.Items || []).map(i => ({
      productId: i.variantId,
      images: i.pictureUrl ? [i.pictureUrl] : [],
      title: `${i.designTitle} - ${i.productName}`,
      price: Number(i.unitPrice),
      currency: 'USD',
      variant: { color: i.colorName, size: i.sizeName },
      qty: i.quantity,
    }));
  }

  private fetchCartFromApi() {
    this.http.get<CustomerCartDto>(`${this.baseUrl}/Cart`, { headers: this.buildHeaders(), observe: 'response' })
      .subscribe(res => {
        const body = res.body as CustomerCartDto;
        this.saveCartId(body?.id || res.headers.get('X-Cart-Id'));
        this._items.set(this.mapFromDto(body || { id: null as any, items: [] }));
      });
  }

  private isSameLine(
    item1: CartItem,
    item2: { productId: number; variant: { color: string; size: string } }
  ) {
    return (
      item1.productId === item2.productId &&
      item1.variant.color === item2.variant.color &&
      item1.variant.size === item2.variant.size
    );
  }

  changeQuantity(
    line: { productId: number; variant: { color: string; size: string } },
    delta: number
  ) {
    const current = this._items();
    const existing = current.find(i => this.isSameLine(i, line));
    const nextQty = Math.max(0, (existing?.qty || 0) + delta);
    if (!existing) return;
    if (nextQty === 0) {
      this.remove(line);
      return;
    }
    const payload: AddItemDto = { variantId: line.productId, quantity: nextQty };
    this.http.post<CustomerCartDto>(`${this.baseUrl}/Cart`, payload, { headers: this.buildHeaders(), observe: 'response' })
      .subscribe(res => {
        const body = res.body as CustomerCartDto;
        this.saveCartId(body?.id || res.headers.get('X-Cart-Id'));
        this._items.set(this.mapFromDto(body));
      });
  }

  add(item: CartItem) {
    const existing = this.items().find((i) => this.isSameLine(i, item));
    const desiredQty = (existing?.qty || 0) + item.qty;
    const payload: AddItemDto = { variantId: item.productId, quantity: desiredQty };
    this.http.post<CustomerCartDto>(`${this.baseUrl}/Cart`, payload, { headers: this.buildHeaders(), observe: 'response' })
      .subscribe(res => {
        const body = res.body as CustomerCartDto;
        this.saveCartId(body?.id || res.headers.get('X-Cart-Id'));
        this._items.set(this.mapFromDto(body));
      });
  }

  clear() {
    // No clear endpoint; remove each item sequentially
    const snapshot = [...this._items()];
    snapshot.forEach(i => this.remove({ productId: i.productId, variant: i.variant }));
  }

  remove(item: {
    productId: number;
    variant: { color: string; size: string };
  }) {
    this.http.delete<void>(`${this.baseUrl}/Cart/items/${item.productId}`, { headers: this.buildHeaders(), observe: 'response' })
      .subscribe(() => {
        this._items.update((items) =>
          items.filter(
            (i) =>
              i.productId !== item.productId ||
              i.variant.color !== item.variant.color ||
              i.variant.size !== item.variant.size
          )
        );
      });
  }

  getTotalItem() {
    return this.totalItems();
  }

  getTotalPrice() {
    return this.subtotal();
  }
}

// Backend DTOs
interface AddItemDto { variantId: number; quantity: number; }
interface CustomerCartDto { id: string | null; items?: CartItemDto[]; Items?: CartItemDto[]; totalPrice?: number; }
interface CartItemDto {
  variantId: number;
  designTitle: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  pictureUrl: string;
  colorName: string;
  sizeName: string;
}
